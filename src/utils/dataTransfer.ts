import { db } from '../db';
import type { Attempt, Question, Subject, Test, Topic } from '../models';
import type { CollectionExport } from '../models/schemas';

export const exportCollection = async (): Promise<CollectionExport> => {
  const [subjects, topics, questions, tests, attempts] = await Promise.all([
    db.subjects.toArray(),
    db.topics.toArray(),
    db.questions.toArray(),
    db.tests.toArray(),
    db.attempts.toArray(),
  ]);

  return {
    subjects,
    topics,
    questions,
    tests,
    attempts,
  };
};

export const mergeCollection = async (payload: CollectionExport): Promise<void> => {
  await db.transaction('rw', db.subjects, db.topics, db.questions, db.tests, db.attempts, async () => {
    await db.subjects.bulkPut(payload.subjects as Subject[]);
    await db.topics.bulkPut(payload.topics as Topic[]);
    await db.questions.bulkPut(normaliseQuestions(payload.questions));
    await db.tests.bulkPut(payload.tests as Test[]);
    await db.attempts.bulkPut(payload.attempts as Attempt[]);
  });
};

export const replaceCollection = async (payload: CollectionExport): Promise<void> => {
  await db.transaction('rw', db.subjects, db.topics, db.questions, db.tests, db.attempts, async () => {
    await Promise.all([
      db.subjects.clear(),
      db.topics.clear(),
      db.questions.clear(),
      db.tests.clear(),
      db.attempts.clear(),
    ]);
    await db.subjects.bulkAdd(payload.subjects as Subject[]);
    await db.topics.bulkAdd(payload.topics as Topic[]);
    await db.questions.bulkAdd(normaliseQuestions(payload.questions));
    await db.tests.bulkAdd(payload.tests as Test[]);
    await db.attempts.bulkAdd(payload.attempts as Attempt[]);
  });
};

export const normaliseQuestions = (questions: CollectionExport['questions']): Question[] =>
  questions.map((question) => ({
    ...question,
    difficulty: clampDifficulty(question.difficulty),
  } as Question));

const clampDifficulty = (value: number | undefined): number | undefined => {
  if (value === undefined || Number.isNaN(value)) {
    return undefined;
  }
  return Math.min(5, Math.max(1, Math.round(value)));
};
