import Dexie, { type Table } from 'dexie';
import type {
  Acronym,
  AppConfig,
  Attempt,
  Question,
  Subject,
  Test,
  Topic,
  UserState,
} from '../models';
import { securityPlusSeed } from '../../seed/seedSecurityPlus';
import { securityPlusAcronyms } from '../data/acronyms';
import type { QuestionDifficulty } from '../models/types';

// --- App defaults ------------------------------------------------------------
export const DEFAULT_MASTERY_THRESHOLD = 3;
export const DEFAULT_TEST_DURATION_MINUTES = 30;

// Difficulty helpers: normalize to 1..5 as the QuestionDifficulty union
const toDifficulty = (n: number): QuestionDifficulty =>
  Math.min(5, Math.max(1, Math.round(n))) as QuestionDifficulty;

const DEFAULT_DIFFICULTY: QuestionDifficulty = 3; // prefer union-typed const
const DEFAULT_DIFFICULTY_NUM = 3; // numeric for intermediate math

const mapDifficultyLabelToScore = (label: string): number => {
  switch (label) {
    case 'easy':
      return 2;
    case 'hard':
      return 4;
    case 'medium':
      return 3;
    default:
      return DEFAULT_DIFFICULTY_NUM;
  }
};

export class CybersecQuizDB extends Dexie {
  subjects!: Table<Subject, string>;
  topics!: Table<Topic, string>;
  questions!: Table<Question, string>;
  tests!: Table<Test, string>;
  attempts!: Table<Attempt, string>;
  acronyms!: Table<Acronym, string>;
  userState!: Table<UserState, string>;
  config!: Table<AppConfig, string>;

  constructor() {
    super('CybersecQuizDB');

    // v1 schema
    this.version(1).stores({
      subjects: 'id',
      topics: 'id, subjectId',
      questions: 'id, subjectId, *topicIds, type',
      tests: 'id, status, [subjectIds+status]',
      attempts: 'id, questionId, testId, subjectId, *topicIds, isCorrect',
      userState: 'id',
    });

    // v2 adds difficulty + config store
    this.version(2)
      .stores({
        subjects: 'id',
        topics: 'id, subjectId',
        questions: 'id, subjectId, *topicIds, type, difficulty',
        tests: 'id, status, [subjectIds+status]',
        attempts: 'id, questionId, testId, subjectId, *topicIds, isCorrect',
        userState: 'id',
        config: 'id',
      })
      .upgrade(async (transaction) => {
        const questionsTable = transaction.table<Question>('questions');
        const configTable = transaction.table<AppConfig>('config');

        // Normalize difficulty/difficultyLabel into the new fields
        await questionsTable.toCollection().modify((question) => {
          const record = question as unknown as Record<string, unknown>;
          const currentDifficulty = record['difficulty'];
          const currentLabel = record['difficultyLabel'];

          if (typeof currentDifficulty === 'string') {
            const score = mapDifficultyLabelToScore(currentDifficulty);
            record['difficulty'] = toDifficulty(score);
            record['difficultyLabel'] = currentDifficulty;
          } else if (typeof currentDifficulty === 'number') {
            record['difficulty'] = toDifficulty(currentDifficulty);
          } else {
            const label = typeof currentLabel === 'string' ? currentLabel : undefined;
            record['difficultyLabel'] = label;
            const score = label ? mapDifficultyLabelToScore(label) : DEFAULT_DIFFICULTY_NUM;
            record['difficulty'] = toDifficulty(score);
          }
        });

        // Ensure config exists and has required defaults
        const existingConfig = await configTable.get('settings');
        if (!existingConfig) {
          await configTable.put({
            id: 'settings',
            masteryThreshold: DEFAULT_MASTERY_THRESHOLD,
            timerEnabled: false,
          });
        } else {
          if (typeof existingConfig.masteryThreshold !== 'number') {
            existingConfig.masteryThreshold = DEFAULT_MASTERY_THRESHOLD;
          }
          if (typeof existingConfig.timerEnabled === 'undefined') {
            existingConfig.timerEnabled = false;
          }
          await configTable.put(existingConfig);
        }
      });

    // v3 adds acronym practice table
    this.version(3)
      .stores({
        subjects: 'id',
        topics: 'id, subjectId',
        questions: 'id, subjectId, *topicIds, type, difficulty',
        tests: 'id, status, [subjectIds+status]',
        attempts: 'id, questionId, testId, subjectId, *topicIds, isCorrect',
        userState: 'id',
        config: 'id',
        acronyms: 'id, subjectId, acronym',
      })
      .upgrade(async (transaction) => {
        const acronymsTable = transaction.table<Acronym>('acronyms');
        const existingCount = await acronymsTable.count();
        if (existingCount === 0) {
          await acronymsTable.bulkAdd(securityPlusAcronyms);
        }
      });

    // Initial seed on first create
    this.on('populate', async () => {
      await this.populateFromSeed();
    });
  }

  private async populateFromSeed(): Promise<void> {
    const { subjects, topics, questions } = securityPlusSeed;

    // Split into two transactions to satisfy Dexie TS overloads.
    await this.transaction('rw', this.subjects, this.topics, this.questions, async () => {
      await this.subjects.bulkAdd(subjects);
      await this.topics.bulkAdd(topics);
      await this.questions.bulkAdd(
        questions.map((q) => ({
          ...q,
          difficulty: q.difficulty ?? DEFAULT_DIFFICULTY,
        })),
      );
    });

    await this.transaction('rw', this.acronyms, async () => {
      await this.acronyms.bulkAdd(securityPlusAcronyms);
    });

    await this.transaction('rw', this.userState, this.config, async () => {
      await this.userState.put({ id: 'singleton' });
      await this.config.put({
        id: 'settings',
        masteryThreshold: DEFAULT_MASTERY_THRESHOLD,
        timerEnabled: false,
      });
    });
  }
}

export const db = new CybersecQuizDB();

void db.open().catch((error) => {
  // TODO: Route Dexie errors to a central error boundary/logging utility.
  console.error('Failed to open CybersecQuizDB', error);
});

export const resetDatabase = async (): Promise<void> => {
  await db.delete();
  await db.open();
};
