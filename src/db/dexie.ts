import Dexie, { type Table } from 'dexie';
import type {
  AppConfig,
  Attempt,
  Question,
  Subject,
  Test,
  Topic,
  UserState,
} from '../models';
import { securityPlusSeed } from '../../seed/seedSecurityPlus';

export const DEFAULT_MASTERY_THRESHOLD = 3;
export const DEFAULT_TEST_DURATION_MINUTES = 30;

export class CybersecQuizDB extends Dexie {
  subjects!: Table<Subject, string>;
  topics!: Table<Topic, string>;
  questions!: Table<Question, string>;
  tests!: Table<Test, string>;
  attempts!: Table<Attempt, string>;
  userState!: Table<UserState, string>;
  config!: Table<AppConfig, string>;

  constructor() {
    super('CybersecQuizDB');

    this.version(1).stores({
      subjects: 'id',
      topics: 'id, subjectId',
      questions: 'id, subjectId, *topicIds, type',
      tests: 'id, status, [subjectIds+status]',
      attempts: 'id, questionId, testId, subjectId, *topicIds, isCorrect',
      userState: 'id',
    });

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

        await questionsTable.toCollection().modify((question) => {
          const currentDifficulty = (question as unknown as { difficulty?: unknown }).difficulty;
          const currentLabel = (question as unknown as { difficultyLabel?: unknown }).difficultyLabel;

          if (typeof currentDifficulty === 'string') {
            const mapped = mapDifficultyLabelToScore(currentDifficulty);
            (question as Question).difficulty = mapped;
            (question as Question).difficultyLabel = currentDifficulty as Question['difficultyLabel'];
          } else if (typeof currentDifficulty === 'number') {
            (question as Question).difficulty = clampDifficultyScore(currentDifficulty);
          } else {
            const label = typeof currentLabel === 'string' ? currentLabel : undefined;
            (question as Question).difficultyLabel = label as Question['difficultyLabel'];
            (question as Question).difficulty = label
              ? mapDifficultyLabelToScore(label)
              : DEFAULT_DIFFICULTY_SCORE;
          }
        });

        const existingConfig = await configTable.get('settings');
        if (!existingConfig) {
          await configTable.put({ id: 'settings', masteryThreshold: DEFAULT_MASTERY_THRESHOLD });
        } else if (!existingConfig.masteryThreshold) {
          existingConfig.masteryThreshold = DEFAULT_MASTERY_THRESHOLD;
          await configTable.put(existingConfig);
        }
      });

    this.on('populate', async () => {
      await this.populateFromSeed();
    });
  }

  private async populateFromSeed(): Promise<void> {
    const { subjects, topics, questions } = securityPlusSeed;
    await this.transaction(
      'rw',
      this.subjects,
      this.topics,
      this.questions,
      this.userState,
      this.config,
      async () => {
        await this.subjects.bulkAdd(subjects);
        await this.topics.bulkAdd(topics);
        await this.questions.bulkAdd(
          questions.map((question) => ({
            ...question,
            difficulty: question.difficulty ?? DEFAULT_DIFFICULTY_SCORE,
          })),
        );
        await this.userState.put({ id: 'singleton' });
        await this.config.put({ id: 'settings', masteryThreshold: DEFAULT_MASTERY_THRESHOLD });
      },
    );
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

const DEFAULT_DIFFICULTY_SCORE: number = 3;

const mapDifficultyLabelToScore = (label: string): number => {
  switch (label) {
    case 'easy':
      return 2;
    case 'hard':
      return 4;
    case 'medium':
      return 3;
    default:
      return DEFAULT_DIFFICULTY_SCORE;
  }
};

const clampDifficultyScore = (value: number): number => {
  if (Number.isNaN(value)) {
    return DEFAULT_DIFFICULTY_SCORE;
  }
  return Math.min(5, Math.max(1, Math.round(value)));
};
