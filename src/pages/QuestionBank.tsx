import type { ChangeEvent, ReactNode, TdHTMLAttributes } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { db } from '../db';
import {
  isMCQ,
  isPBQ,
  type Question,
  type QuestionUpsert,
  type Subject,
  type Topic,
} from '../models';
import { QuestionForm } from '../components/question-authoring/QuestionForm';
import {
  importPracticeExamQuestionsFromPdfArrayBuffer,
  type PracticeExamPdfImportProgress,
  type PracticeExamPdfImportSectionScope,
} from '../logic/practiceExamPdfImport';
import { buildQuestionBankDeduplicationPlan } from '../logic/dedupeQuestionBank';

const PAGE_SIZE = 10;

interface DuplicateContext {
  hash: string;
  message: string;
}

const difficultyLabels: Record<number, string> = {
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
};

const QuestionBank = (): JSX.Element => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [subjectFilter, setSubjectFilter] = useState<string>('');
  const [topicFilter, setTopicFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(0);

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | undefined>(undefined);
  const [duplicateContext, setDuplicateContext] = useState<DuplicateContext | null>(null);
  const [pendingCandidate, setPendingCandidate] = useState<QuestionUpsert | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Question | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [importSectionScope, setImportSectionScope] = useState<PracticeExamPdfImportSectionScope>('chapters');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importBusy, setImportBusy] = useState<boolean>(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSummary, setImportSummary] = useState<string | null>(null);
  const [importWarningsPreview, setImportWarningsPreview] = useState<string[]>([]);
  const [importProgress, setImportProgress] = useState<PracticeExamPdfImportProgress | null>(null);

  useEffect(() => {
    void refreshData();
  }, []);

  const refreshData = async (): Promise<void> => {
    const [subjectRows, topicRows, questionRows] = await Promise.all([
      db.subjects.toArray(),
      db.topics.toArray(),
      db.questions.toArray(),
    ]);
    setSubjects(subjectRows);
    setTopics(topicRows);
    setQuestions(questionRows);
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      if (subjectFilter && question.subjectId !== subjectFilter) {
        return false;
      }
      if (topicFilter && !question.topicIds.includes(topicFilter)) {
        return false;
      }
      if (typeFilter && question.type !== typeFilter) {
        return false;
      }
      if (difficultyFilter && String(question.difficulty ?? '') !== difficultyFilter) {
        return false;
      }
      if (searchTerm) {
        const haystack = `${question.stem} ${question.explanation ?? ''}`.toLowerCase();
        if (!haystack.includes(searchTerm.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  }, [questions, subjectFilter, topicFilter, typeFilter, difficultyFilter, searchTerm]);

  useEffect(() => {
    setPage(0);
  }, [subjectFilter, topicFilter, typeFilter, difficultyFilter, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / PAGE_SIZE));
  const pageSlice = filteredQuestions.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const handleAddQuestion = (): void => {
    setEditingQuestion(undefined);
    setDuplicateContext(null);
    setPendingCandidate(null);
    setIsFormOpen(true);
  };

  const handleEditQuestion = (question: Question): void => {
    setEditingQuestion(question);
    setDuplicateContext(null);
    setPendingCandidate(null);
    setIsFormOpen(true);
  };

  const handleDuplicateQuestion = (question: Question): void => {
    const duplicateSeed: QuestionUpsert = isMCQ(question)
      ? {
          id: undefined,
          createdAt: undefined,
          updatedAt: undefined,
          type: question.type,
          subjectId: question.subjectId,
          topicIds: [...question.topicIds],
          stem: `${question.stem} (Copy)`,
          explanation: question.explanation,
          difficulty: question.difficulty,
          choices: question.choices.map((choice) => ({ ...choice })),
          correctChoiceIds: [...question.correctChoiceIds],
        }
      : {
          id: undefined,
          createdAt: undefined,
          updatedAt: undefined,
          type: question.type,
          subjectId: question.subjectId,
          topicIds: [...question.topicIds],
          stem: `${question.stem} (Copy)`,
          explanation: question.explanation,
          difficulty: question.difficulty,
          pbqSpec: {
            instructions: question.pbqSpec.instructions,
            configuration: JSON.parse(JSON.stringify(question.pbqSpec.configuration)),
          },
        };
    setEditingQuestion(undefined);
    setPendingCandidate(duplicateSeed);
    setDuplicateContext(null);
    setIsFormOpen(true);
  };

  const handlePersist = async (payload: QuestionUpsert): Promise<void> => {
    const candidateHash = hashQuestion(candidateFingerprint(payload));

    if (duplicateContext && duplicateContext.hash === candidateHash) {
      await saveQuestion(payload);
      setDuplicateContext(null);
      setPendingCandidate(null);
      setIsFormOpen(false);
      await refreshData();
      return;
    }

    const duplicate = findDuplicate(payload, questions);
    if (duplicate) {
      setPendingCandidate(payload);
      setDuplicateContext({
        hash: candidateHash,
        message: `This question looks similar to "${duplicate.stem}" (id: ${duplicate.id}). Save again to confirm.`,
      });
      return;
    }

    await saveQuestion(payload);
    setPendingCandidate(null);
    setDuplicateContext(null);
    setIsFormOpen(false);
    await refreshData();
  };

  const saveQuestion = async (payload: QuestionUpsert): Promise<void> => {
    setSubmitting(true);
    try {
      const now = new Date().toISOString();
      if (payload.id) {
        const existing = await db.questions.get(payload.id);
        await db.questions.put({
          ...(existing ?? {}),
          ...payload,
          id: payload.id,
          createdAt: existing?.createdAt ?? now,
          updatedAt: now,
        });
      } else {
        const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `q-${Date.now()}`;
        await db.questions.put({
          ...payload,
          id,
          createdAt: now,
          updatedAt: now,
        } as Question);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseForm = (): void => {
    setIsFormOpen(false);
    setEditingQuestion(undefined);
    setPendingCandidate(null);
    setDuplicateContext(null);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!deleteTarget) {
      return;
    }
    await db.questions.delete(deleteTarget.id);
    setDeleteTarget(null);
    await refreshData();
  };

  const openImportModal = (): void => {
    setIsImportOpen(true);
    setImportMode('merge');
    setImportSectionScope('chapters');
    setImportFile(null);
    setImportError(null);
    setImportSummary(null);
    setImportWarningsPreview([]);
    setImportProgress(null);
  };

  const closeImportModal = (): void => {
    if (importBusy) {
      return;
    }
    setIsImportOpen(false);
  };

  const handleImportFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setImportFile(event.target.files?.[0] ?? null);
    setImportError(null);
    setImportSummary(null);
    setImportWarningsPreview([]);
    setImportProgress(null);
  };

  const handleImportPracticeExamPdf = async (): Promise<void> => {
    if (!importFile) {
      setImportError('Choose a PDF file to import.');
      return;
    }

    setImportBusy(true);
    setImportError(null);
    setImportSummary(null);
    setImportWarningsPreview([]);
    setImportProgress(null);

    try {
      const buffer = await importFile.arrayBuffer();
      const result = await importPracticeExamQuestionsFromPdfArrayBuffer(buffer, 'security-plus', {
        onProgress: (progress) => setImportProgress(progress),
        sectionScope: importSectionScope,
      });

      if (result.questions.length === 0) {
        throw new Error(
          'No questions found in the PDF. Ensure it contains selectable text and matches the expected practice exam format.',
        );
      }

      await db.transaction('rw', db.subjects, db.topics, db.questions, async () => {
        const existingSubject = await db.subjects.get('security-plus');
        if (!existingSubject) {
          await db.subjects.put({ id: 'security-plus', name: 'CompTIA Security+' });
        }

        if (importMode === 'replace') {
          await db.questions.where('id').startsWith('imp-examsdigest-sy0701-').delete();
        }

        for (const topic of result.requiredTopics) {
          const existing = await db.topics.get(topic.id);
          if (!existing) {
            await db.topics.put(topic);
          } else if (
            existing.name !== topic.name &&
            existing.name.startsWith('Answers ') &&
            topic.name.startsWith('Exam Simulator #')
          ) {
            await db.topics.put({ ...existing, name: topic.name });
          }
        }

        await db.questions.bulkPut(result.questions);
      });

      await refreshData();

      const warningCount = result.warnings.length;
      const scopeLabel = importSectionScope === 'chapters' ? 'chapters only' : 'all sections';
      const summaryParts = [`Imported ${result.questions.length} questions (${scopeLabel}) from ${importFile.name}.`];
      if (result.duplicateCount > 0) {
        summaryParts.push(
          `Skipped ${result.duplicateCount} duplicate${result.duplicateCount === 1 ? '' : 's'}.`,
        );
      }
      if (warningCount > 0) {
        summaryParts.push(`${warningCount} warning${warningCount === 1 ? '' : 's'}.`);
      }
      setImportSummary(summaryParts.join(' '));
      setImportWarningsPreview(result.warnings.slice(0, 10));
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to import PDF.');
    } finally {
      setImportBusy(false);
    }
  };

  const handleDeduplicateQuestionBank = async (): Promise<void> => {
    if (importBusy) {
      return;
    }

    const confirmed = window.confirm(
      'This will merge and remove duplicate questions (by content) and update any existing tests/attempts to point at the kept question. Continue?',
    );
    if (!confirmed) {
      return;
    }

    setImportBusy(true);
    setImportError(null);
    setImportSummary(null);
    setImportWarningsPreview([]);
    setImportProgress(null);

    try {
      const nowIso = new Date().toISOString();
      const plan = await db.transaction('rw', db.questions, db.tests, db.attempts, async () => {
        const [questionRows, testRows, attemptRows] = await Promise.all([
          db.questions.toArray(),
          db.tests.toArray(),
          db.attempts.toArray(),
        ]);

        const dedupePlan = buildQuestionBankDeduplicationPlan({
          questions: questionRows,
          tests: testRows,
          attempts: attemptRows,
          nowIso,
        });

        if (dedupePlan.questionIdsToDelete.length === 0) {
          return dedupePlan;
        }

        await db.questions.bulkPut(dedupePlan.questionsToPut);
        await db.questions.bulkDelete(dedupePlan.questionIdsToDelete);
        await db.tests.bulkPut(dedupePlan.testsToPut);
        if (dedupePlan.attemptsToPut.length > 0) {
          await db.attempts.bulkPut(dedupePlan.attemptsToPut);
        }

        return dedupePlan;
      });

      await refreshData();

      if (plan.questionIdsToDelete.length === 0) {
        setImportSummary('No duplicate questions found.');
        return;
      }

      const duplicateCount = plan.questionIdsToDelete.length;
      const duplicateGroups = plan.duplicateGroups;
      const testsTouched = plan.testsToPut.length;
      const attemptsTouched = plan.attemptsToPut.length;

      setImportSummary(
        `Removed ${duplicateCount} duplicate question${duplicateCount === 1 ? '' : 's'} across ${duplicateGroups} group${duplicateGroups === 1 ? '' : 's'}. Updated ${testsTouched} test${testsTouched === 1 ? '' : 's'} and ${attemptsTouched} attempt${attemptsTouched === 1 ? '' : 's'}.`,
      );
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to deduplicate question bank.');
    } finally {
      setImportBusy(false);
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Question Bank</h1>
          <p className="text-sm text-slate-400">
            Filter by subject, topic, question type, or difficulty. Add or edit questions with schema validation.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="rounded-md border border-slate-700 px-4 py-2 font-semibold text-slate-100 hover:bg-slate-800"
            onClick={openImportModal}
          >
            Import PDF
          </button>
          <button
            type="button"
            className="rounded-md bg-primary px-4 py-2 font-semibold text-white hover:bg-teal-600"
            onClick={handleAddQuestion}
          >
            Add question
          </button>
        </div>
      </header>

      <div className="grid gap-4 rounded-lg border border-slate-800 bg-slate-900/40 p-4 md:grid-cols-5">
        <FilterSelect
          label="Subject"
          value={subjectFilter}
          onChange={setSubjectFilter}
          options={subjects.map((subject) => ({ value: subject.id, label: subject.name }))}
        />
        <FilterSelect
          label="Topic"
          value={topicFilter}
          onChange={setTopicFilter}
          options={topics
            .filter((topic) => (subjectFilter ? topic.subjectId === subjectFilter : true))
            .map((topic) => ({ value: topic.id, label: topic.name }))}
        />
        <FilterSelect
          label="Type"
          value={typeFilter}
          onChange={setTypeFilter}
          options={[
            { value: 'mcq_single', label: 'MCQ (single)' },
            { value: 'mcq_multi', label: 'MCQ (multi)' },
            { value: 'pbq_order', label: 'PBQ order' },
            { value: 'pbq_match', label: 'PBQ match' },
            { value: 'pbq_fill', label: 'PBQ fill' },
            { value: 'pbq_group', label: 'PBQ group' },
          ]}
        />
        <FilterSelect
          label="Difficulty"
          value={difficultyFilter}
          onChange={setDifficultyFilter}
          options={[1, 2, 3, 4, 5].map((value) => ({
            value: String(value),
            label: difficultyLabels[value] ?? String(value),
          }))}
        />
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-300" htmlFor="search">
            Search
          </label>
          <input
            id="search"
            type="search"
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2"
            placeholder="Search stem or explanation"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      <article className="space-y-4">
        <header className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Showing {pageSlice.length} of {filteredQuestions.length} questions (page {page + 1} / {totalPages})
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-md border border-slate-700 px-3 py-1 text-sm hover:bg-slate-800 disabled:opacity-40"
              onClick={() => setPage((value) => Math.max(0, value - 1))}
              disabled={page === 0}
            >
              Previous
            </button>
            <button
              type="button"
              className="rounded-md border border-slate-700 px-3 py-1 text-sm hover:bg-slate-800 disabled:opacity-40"
              onClick={() => setPage((value) => Math.min(totalPages - 1, value + 1))}
              disabled={page >= totalPages - 1}
            >
              Next
            </button>
          </div>
        </header>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-900">
              <tr>
                <HeaderCell>Subject</HeaderCell>
                <HeaderCell>Topics</HeaderCell>
                <HeaderCell>Type</HeaderCell>
                <HeaderCell>Difficulty</HeaderCell>
                <HeaderCell>Prompt</HeaderCell>
                <HeaderCell className="text-right">Actions</HeaderCell>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {pageSlice.map((question) => (
                <tr key={question.id} className="hover:bg-slate-900/40">
                  <TableCell>{subjects.find((subject) => subject.id === question.subjectId)?.name ?? question.subjectId}</TableCell>
                  <TableCell>
                    <ul className="text-sm text-slate-400">
                      {question.topicIds.map((topicId) => (
                        <li key={topicId}>{topics.find((topic) => topic.id === topicId)?.name ?? topicId}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>{formatQuestionType(question.type)}</TableCell>
                  <TableCell>{question.difficulty ?? '—'}</TableCell>
                  <TableCell>
                    <p className="line-clamp-2 text-sm text-slate-200">{question.stem}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 text-sm">
                      <button className="text-teal-300" onClick={() => handleEditQuestion(question)}>
                        Edit
                      </button>
                      <button className="text-amber-300" onClick={() => handleDuplicateQuestion(question)}>
                        Duplicate
                      </button>
                      <button className="text-red-400" onClick={() => setDeleteTarget(question)}>
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </tr>
              ))}
              {pageSlice.length === 0 ? (
                <tr>
                  <TableCell colSpan={6} className="text-center text-sm text-slate-400">
                    No questions match the current filters.
                  </TableCell>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </article>

      {isFormOpen ? (
        <Modal title={editingQuestion ? 'Edit question' : 'Add question'} onClose={handleCloseForm}>
          <QuestionForm
            subjects={subjects}
            topics={topics}
            initialQuestion={pendingCandidate ?? editingQuestion}
            submitting={submitting}
            duplicateWarning={duplicateContext?.message ?? null}
            onCancel={handleCloseForm}
            onSubmit={handlePersist}
          />
        </Modal>
      ) : null}

      {deleteTarget ? (
        <Modal title="Delete question" onClose={() => setDeleteTarget(null)}>
          <div className="space-y-4">
            <p className="text-sm text-slate-300">
              Are you sure you want to delete "{deleteTarget.stem}"? This removes the question but retains past attempts.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-700 px-3 py-1"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md bg-red-500 px-3 py-1 text-white"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      ) : null}

      {isImportOpen ? (
        <Modal title="Import practice exam PDF" onClose={closeImportModal}>
          <div className="space-y-4">
            <p className="text-sm text-slate-300">
              Import the Security+ practice exam PDF into your local database. The file is parsed locally and never
              uploaded.
            </p>

            <div className="space-y-2">
              <input type="file" accept="application/pdf" onChange={handleImportFileChange} disabled={importBusy} />
              {importProgress ? (
                <p className="text-xs text-slate-400">
                  Parsing page {importProgress.page}/{importProgress.totalPages}...
                </p>
              ) : null}
              {importError ? <p className="text-sm text-red-300">{importError}</p> : null}
              {importSummary ? <p className="text-sm text-emerald-300">{importSummary}</p> : null}
              {importWarningsPreview.length > 0 ? (
                <div className="rounded-md border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200">
                  <p className="mb-2 font-semibold">Warnings (first {importWarningsPreview.length})</p>
                  <ul className="list-disc space-y-1 pl-5 text-slate-300">
                    {importWarningsPreview.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-100">
                <input
                  type="radio"
                  value="chapters"
                  checked={importSectionScope === 'chapters'}
                  onChange={() => setImportSectionScope('chapters')}
                  disabled={importBusy}
                />
                Chapters only (topic-grouped, no mock exam duplicates)
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-100">
                <input
                  type="radio"
                  value="all"
                  checked={importSectionScope === 'all'}
                  onChange={() => setImportSectionScope('all')}
                  disabled={importBusy}
                />
                All sections (includes exam simulators)
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-100">
                <input
                  type="radio"
                  value="merge"
                  checked={importMode === 'merge'}
                  onChange={() => setImportMode('merge')}
                  disabled={importBusy}
                />
                Merge into existing questions
              </label>
              <label className="flex items-center gap-2 text-sm text-red-200">
                <input
                  type="radio"
                  value="replace"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                  disabled={importBusy}
                />
                Replace previous import (keeps custom questions)
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800 disabled:opacity-60"
                onClick={handleDeduplicateQuestionBank}
                disabled={importBusy}
              >
                Deduplicate bank
              </button>
              <button
                type="button"
                className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800 disabled:opacity-60"
                onClick={closeImportModal}
                disabled={importBusy}
              >
                Close
              </button>
              <button
                type="button"
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600 disabled:opacity-60"
                onClick={handleImportPracticeExamPdf}
                disabled={importBusy || !importFile}
              >
                {importBusy ? 'Importing...' : 'Import PDF'}
              </button>
            </div>
          </div>
        </Modal>
      ) : null}
    </section>
  );
};

const HeaderCell = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <th className={`px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 ${className}`}>
    {children}
  </th>
);

type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

const TableCell = ({ className = '', children, ...rest }: TableCellProps): JSX.Element => (
  <td
    {...rest}
    className={['px-3 py-2 align-top text-sm text-slate-200', className].filter(Boolean).join(' ')}
  >
    {children}
  </td>
);

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}

const FilterSelect = ({ label, value, onChange, options }: FilterSelectProps): JSX.Element => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-slate-300" htmlFor={label}>
      {label}
    </label>
    <select
      id={label}
      className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="">All</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

const Modal = ({ title, children, onClose }: ModalProps): JSX.Element => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
    <div className="w-full max-w-3xl rounded-lg border border-slate-800 bg-slate-950 shadow-xl">
      <header className="flex items-center justify-between border-b border-slate-800 p-4">
        <h2 className="text-lg font-semibold text-slate-200">{title}</h2>
        <button className="text-slate-400" onClick={onClose}>
          Close
        </button>
      </header>
      <div className="p-4">{children}</div>
    </div>
  </div>
);

const candidateFingerprint = (candidate: QuestionUpsert): Record<string, unknown> => {
  if (isMCQ(candidate)) {
    const answers = candidate.correctChoiceIds
      .map((choiceId) =>
        candidate.choices.find((choice) => choice.id === choiceId)?.text.trim().toLowerCase(),
      )
      .filter((value): value is string => Boolean(value))
      .sort();

    return {
      stem: candidate.stem.trim().toLowerCase(),
      subjectId: candidate.subjectId,
      answers,
    };
  }

  return {
    stem: candidate.stem.trim().toLowerCase(),
    subjectId: candidate.subjectId,
    configuration: candidate.pbqSpec.configuration,
  };
};

const hashQuestion = (payload: Record<string, unknown>): string => JSON.stringify(payload);

const findDuplicate = (candidate: QuestionUpsert, existingQuestions: Question[]): Question | undefined => {
  const targetStem = candidate.stem.trim().toLowerCase();
  return existingQuestions.find((question) => {
    if (candidate.id && question.id === candidate.id) {
      return false;
    }
    if (question.subjectId !== candidate.subjectId) {
      return false;
    }
    if (question.stem.trim().toLowerCase() !== targetStem) {
      return false;
    }
    if (isMCQ(candidate)) {
      if (!isMCQ(question)) {
        return false;
      }
      const candidateChoiceTexts = candidate.correctChoiceIds
        .map((choiceId) =>
          candidate.choices.find((choice) => choice.id === choiceId)?.text.trim().toLowerCase(),
        )
        .filter((value): value is string => Boolean(value))
        .sort();
      const existingChoiceTexts = question.correctChoiceIds
        .map((choiceId) =>
          question.choices.find((choice) => choice.id === choiceId)?.text.trim().toLowerCase(),
        )
        .filter((value): value is string => Boolean(value))
        .sort();
      return candidateChoiceTexts.length > 0 && compareArrays(candidateChoiceTexts, existingChoiceTexts);
    }

    if (!isPBQ(question)) {
      return false;
    }

    const candidateConfig = JSON.stringify(candidate.pbqSpec.configuration);
    const existingConfig = JSON.stringify(question.pbqSpec.configuration);
    return candidateConfig === existingConfig;
  });
};

const compareArrays = (a: unknown[], b: unknown[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((value, index) => value === b[index]);
};

const formatQuestionType = (type: string): string =>
  type
    .replace('pbq', 'PBQ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export default QuestionBank;
