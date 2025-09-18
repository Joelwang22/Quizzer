import type { QuestionType } from './question';

export type TestStatus = 'in_progress' | 'completed';

export interface SelectionPolicy {
  source: 'all' | 'unseen' | 'not_mastered';
  types: QuestionType[];
}

export interface TestAttemptAnswer {
  questionId: string;
  chosenChoiceIds?: string[];
  pbqAnswer?: unknown;
  isCorrect?: boolean;
}

export interface Test {
  id: string;
  status: TestStatus;
  subjectIds: string[];
  topicIds: string[];
  selectionPolicy: SelectionPolicy;
  questionIds: string[];
  currentIndex: number;
  answers: TestAttemptAnswer[];
  markedForReview: string[];
  timeSpentMs?: number;
  score?: number;
}
