import type { Attempt, Question } from '../models';

export interface GraderResult {
  attempts: Attempt[];
  totalCorrect: number;
  totalQuestions: number;
}

export const gradeResponses = (questions: Question[], responses: Attempt[]): GraderResult => {
  // TODO: Implement full grading logic for MCQ and PBQ types.
  const totalCorrect = responses.filter((attempt) => attempt.isCorrect).length;
  return {
    attempts: responses,
    totalCorrect,
    totalQuestions: questions.length,
  };
};

export const evaluatePBQ = (question: Question, response: Attempt): boolean => {
  // TODO: Evaluate PBQ answers against pbqSpec configuration.
  console.warn('PBQ grading not implemented', question.id, response.id);
  return false;
};
