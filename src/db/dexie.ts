import Dexie, { type Table } from 'dexie';
import type { Attempt, Question, Subject, Test, Topic, UserState } from '../models';
import { securityPlusSeed } from '../../seed/seedSecurityPlus';

export class CybersecQuizDB extends Dexie {
  subjects!: Table<Subject, string>;
  topics!: Table<Topic, string>;
  questions!: Table<Question, string>;
  tests!: Table<Test, string>;
  attempts!: Table<Attempt, string>;
  userState!: Table<UserState, string>;

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

    this.on('populate', async () => {
      await this.populateFromSeed();
    });
  }

  private async populateFromSeed(): Promise<void> {
    const { subjects, topics, questions } = securityPlusSeed;
    await this.transaction('rw', this.subjects, this.topics, this.questions, this.userState, async () => {
      await this.subjects.bulkAdd(subjects);
      await this.topics.bulkAdd(topics);
      await this.questions.bulkAdd(questions);
      await this.userState.put({ id: 'singleton' });
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
