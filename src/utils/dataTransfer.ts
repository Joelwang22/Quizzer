import { db } from '../db/dexie';
import type {
  Attempt,
  Question,
  QuestionDifficulty,
  Subject,
  Test,
  Topic,
} from '../models';
import { collectionExportSchema, type CollectionExport } from '../models/schemas';


// ---------- Export (validate & type) ----------
export const exportCollection = async (): Promise<CollectionExport> => {
  const [subjects, topics, questions, tests, attempts] = await Promise.all([
    db.subjects.toArray(),
    db.topics.toArray(),
    db.questions.toArray(),
    db.tests.toArray(),
    db.attempts.toArray(),
  ]);

  // Build a loose payload, then let Zod type it precisely as CollectionExport.
  const payload = {
    subjects,
    topics,
    // normalize difficulty to 1..5 (optional)
    questions: normaliseQuestions(questions as Question[]),
    tests,
    attempts,
  };

  // validates shape and returns typed CollectionExport
  return collectionExportSchema.parse(payload);
};

// ---------- Merge (upsert) ----------
export const mergeCollection = async (payload: CollectionExport): Promise<void> => {
  // Split transactions to satisfy Dexie TS overloads
  await db.transaction('rw', db.subjects, db.topics, db.questions, db.tests, async () => {
    await db.subjects.bulkPut(payload.subjects as Subject[]);
    await db.topics.bulkPut(payload.topics as Topic[]);
    await db.questions.bulkPut(normaliseQuestions(payload.questions as unknown as Question[]));
    await db.tests.bulkPut(payload.tests as Test[]);
  });

  await db.transaction('rw', db.attempts, async () => {
    await db.attempts.bulkPut(payload.attempts as Attempt[]);
  });
};

// ---------- Replace (wipe then load) ----------
export const replaceCollection = async (payload: CollectionExport): Promise<void> => {
  await db.transaction('rw', db.subjects, db.topics, db.questions, db.tests, async () => {
    await Promise.all([db.subjects.clear(), db.topics.clear(), db.questions.clear(), db.tests.clear()]);
    await db.subjects.bulkAdd(payload.subjects as Subject[]);
    await db.topics.bulkAdd(payload.topics as Topic[]);
    await db.questions.bulkAdd(normaliseQuestions(payload.questions as unknown as Question[]));
    await db.tests.bulkAdd(payload.tests as Test[]);
  });

  await db.transaction('rw', db.attempts, async () => {
    await db.attempts.clear();
    await db.attempts.bulkAdd(payload.attempts as Attempt[]);
  });
};

// ---------- Helpers ----------
export const normaliseQuestions = (questions: Question[]): Question[] =>
  questions.map((q) => ({
    ...q,
    difficulty: toDifficulty(q.difficulty),
  }));

const toDifficulty = (value: number | undefined): QuestionDifficulty | undefined => {
  if (value == null || Number.isNaN(value)) return undefined;
  return Math.min(5, Math.max(1, Math.round(value))) as QuestionDifficulty;
};
