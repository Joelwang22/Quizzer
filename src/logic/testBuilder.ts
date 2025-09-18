import type { Question, QuestionType, Test } from '../models';

export interface TestBuilderOptions {
  questionPool: Question[];
  topicFilter?: string[];
  selectionPolicy: Test['selectionPolicy'];
  count: number;
}

export interface BuiltTest {
  questions: Question[];
  diagnostics: string[];
}

export const buildTest = (options: TestBuilderOptions): BuiltTest => {
  // TODO: Implement selection rules (topic filters, unseen/not-mastered, PBQ mix, randomness).
  const diagnostics = ['TestBuilder is currently returning the first N questions as a stub.'];
  return {
    questions: options.questionPool.slice(0, options.count),
    diagnostics,
  };
};

export const generateSelectionTypes = (types: QuestionType[]): QuestionType[] => {
  // TODO: Add logic to enforce required PBQ counts and multi-select ratios.
  return Array.from(new Set(types));
};
