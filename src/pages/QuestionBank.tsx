import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { db } from '../db';
import type { Question, Subject, Topic } from '../models';
import { QuestionForm } from '../components/question-authoring/QuestionForm';
import type { QuestionUpsert } from '../models/schemas';

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
    const duplicateSeed: QuestionUpsert = {
      ...question,
      id: undefined,
      stem: `${question.stem} (Copy)`,
      createdAt: undefined,
      updatedAt: undefined,
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

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Question Bank</h1>
          <p className="text-sm text-slate-400">
            Filter by subject, topic, question type, or difficulty. Add or edit questions with schema validation.
          </p>
        </div>
        <button
          type="button"
          className="rounded-md bg-primary px-4 py-2 font-semibold text-white hover:bg-teal-600"
          onClick={handleAddQuestion}
        >
          Add question
        </button>
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
          options={[1, 2, 3, 4, 5].map((value) => ({ value: String(value), label: difficultyLabels[value] }))}
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
    </section>
  );
};

const HeaderCell = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <th className={`px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 ${className}`}>
    {children}
  </th>
);

const TableCell = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <td className={`px-3 py-2 align-top text-sm text-slate-200 ${className}`}>{children}</td>
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
  if (candidate.type.startsWith('mcq')) {
    return {
      stem: candidate.stem.trim().toLowerCase(),
      subjectId: candidate.subjectId,
      answers: (candidate.correctChoiceIds ?? [])
        .map((choiceId) => candidate.choices?.find((choice) => choice.id === choiceId)?.text.trim().toLowerCase())
        .filter(Boolean)
        .sort(),
    };
  }

  return {
    stem: candidate.stem.trim().toLowerCase(),
    subjectId: candidate.subjectId,
    configuration: candidate.pbqSpec?.configuration ?? {},
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
    if (candidate.type.startsWith('mcq')) {
      if (!question.correctChoiceIds || !question.choices) {
        return false;
      }
      const candidateChoiceTexts = (candidate.correctChoiceIds ?? [])
        .map((choiceId) => candidate.choices?.find((choice) => choice.id === choiceId)?.text.trim().toLowerCase())
        .filter(Boolean)
        .sort();
      const existingChoiceTexts = question.correctChoiceIds
        .map((choiceId) => question.choices?.find((choice) => choice.id === choiceId)?.text.trim().toLowerCase())
        .filter(Boolean)
        .sort();
      return candidateChoiceTexts.length > 0 && compareArrays(candidateChoiceTexts, existingChoiceTexts);
    }

    const candidateConfig = candidate.pbqSpec?.configuration;
    const existingConfig = question.pbqSpec?.configuration;
    if (!candidateConfig || !existingConfig) {
      return false;
    }
    return JSON.stringify(candidateConfig) === JSON.stringify(existingConfig);
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
