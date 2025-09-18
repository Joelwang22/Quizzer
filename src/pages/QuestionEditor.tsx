import { useEffect, useMemo, useState } from 'react';
import { db } from '../db';
import type { Question, Subject, Topic } from '../models';
import { QuestionForm } from '../components/question-authoring/QuestionForm';
import type { QuestionUpsert } from '../models/schemas';

const QuestionEditor = (): JSX.Element => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('');
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
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
    if (!selectedQuestionId && questionRows.length > 0) {
      setSelectedQuestionId(questionRows[0].id);
    }
  };

  const selectedQuestion = useMemo(() => {
    if (!selectedQuestionId) {
      return undefined;
    }
    return questions.find((question) => question.id === selectedQuestionId);
  }, [questions, selectedQuestionId]);

  const handleSubmit = async (payload: QuestionUpsert): Promise<void> => {
    const duplicate = findDuplicate(payload, questions);
    const fingerprint = hashQuestion(candidateFingerprint(payload));

    if (duplicate && duplicate.id !== payload.id && duplicateWarning !== fingerprint) {
      setDuplicateWarning(fingerprint);
      return;
    }

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
        } as Question);
      } else {
        const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `q-${Date.now()}`;
        await db.questions.put({
          ...payload,
          id,
          createdAt: now,
          updatedAt: now,
        } as Question);
        setSelectedQuestionId(id);
      }
      setDuplicateWarning(null);
      await refreshData();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Question Editor</h1>
        <p className="text-sm text-slate-300">
          Use the form below to create or update questions. Switch between drafts using the selector, or start a fresh
          template.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <select
          className="max-w-xs rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
          value={selectedQuestionId}
          onChange={(event) => {
            setSelectedQuestionId(event.target.value);
            setDuplicateWarning(null);
          }}
        >
          {questions.map((question) => (
            <option key={question.id} value={question.id}>
              {question.stem.slice(0, 60)}{question.stem.length > 60 ? '…' : ''}
            </option>
          ))}
          <option value="">Create new…</option>
        </select>
        <button
          type="button"
          className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
          onClick={() => {
            setSelectedQuestionId('');
            setDuplicateWarning(null);
          }}
        >
          New question
        </button>
      </div>

      <QuestionForm
        subjects={subjects}
        topics={topics}
        initialQuestion={selectedQuestionId ? selectedQuestion : undefined}
        duplicateWarning={duplicateWarning ? 'Potential duplicate detected. Submit again to confirm.' : null}
        submitting={submitting}
        onCancel={() => {
          setDuplicateWarning(null);
          setSelectedQuestionId(selectedQuestion?.id ?? questions[0]?.id ?? '');
        }}
        onSubmit={handleSubmit}
      />
    </section>
  );
};

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

const hashQuestion = (payload: Record<string, unknown>): string => JSON.stringify(payload);

const compareArrays = (a: unknown[], b: unknown[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((value, index) => value === b[index]);
};

export default QuestionEditor;
