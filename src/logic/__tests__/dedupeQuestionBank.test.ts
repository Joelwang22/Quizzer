import { describe, expect, it } from 'vitest';
import { buildQuestionBankDeduplicationPlan } from '../dedupeQuestionBank';
import type { Attempt, Question, Test } from '../../models';

describe('question bank deduplication', () => {
  it('merges duplicate MCQs and remaps choice ids in tests/attempts', () => {
    const questionA: Question = {
      id: 'q1',
      subjectId: 'security-plus',
      topicIds: ['t1'],
      type: 'mcq_single',
      stem: 'What is 2 + 2?',
      choices: [
        { id: 'a', text: '4' },
        { id: 'b', text: '3' },
      ],
      correctChoiceIds: ['a'],
      explanation: 'Short explanation.',
      difficulty: 2,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    };

    const questionB: Question = {
      id: 'q2',
      subjectId: 'security-plus',
      topicIds: ['t2'],
      type: 'mcq_single',
      stem: 'What is 2 + 2?',
      choices: [
        { id: 'a-xyz', text: '4' },
        { id: 'b-xyz', text: '3' },
      ],
      correctChoiceIds: ['a-xyz'],
      explanation: 'Longer explanation that should be kept.',
      difficulty: 4,
      createdAt: '2025-01-02T00:00:00.000Z',
      updatedAt: '2025-01-02T00:00:00.000Z',
    };

    const test: Test = {
      id: 'test-1',
      status: 'in_progress',
      subjectIds: ['security-plus'],
      topicIds: [],
      selectionPolicy: { source: 'all', types: ['mcq_single'] },
      questionIds: ['q2', 'q1'],
      currentIndex: 1,
      answers: {
        q2: {
          questionId: 'q2',
          chosenChoiceIds: ['a-xyz'],
          isCorrect: true,
          submittedAt: '2025-01-02T02:00:00.000Z',
        },
        q1: {
          questionId: 'q1',
          chosenChoiceIds: ['b'],
          isCorrect: false,
          submittedAt: '2025-01-01T02:00:00.000Z',
        },
      },
      markedForReview: ['q2'],
      createdAt: '2025-01-02T00:00:00.000Z',
    };

    const attempt: Attempt = {
      id: 'attempt-1',
      questionId: 'q2',
      testId: 'test-1',
      submittedAt: '2025-01-02T02:00:00.000Z',
      isCorrect: true,
      chosenChoiceIds: ['a-xyz'],
      subjectId: 'security-plus',
      topicIds: ['t2'],
    };

    const plan = buildQuestionBankDeduplicationPlan({
      questions: [questionA, questionB],
      tests: [test],
      attempts: [attempt],
      nowIso: '2025-01-03T00:00:00.000Z',
    });

    expect(plan.duplicateGroups).toBe(1);
    expect(plan.questionIdsToDelete).toEqual(['q2']);
    expect(plan.questionsToPut).toHaveLength(1);
    expect(plan.questionsToPut[0]?.id).toBe('q1');
    expect(plan.questionsToPut[0]?.topicIds).toEqual(['t1', 't2']);
    expect(plan.questionsToPut[0]?.explanation).toBe('Longer explanation that should be kept.');

    expect(plan.testsToPut).toHaveLength(1);
    const updatedTest = plan.testsToPut[0];
    expect(updatedTest?.questionIds).toEqual(['q1']);
    expect(updatedTest?.currentIndex).toBe(0);
    expect(Object.keys(updatedTest?.answers ?? {})).toEqual(['q1']);
    expect(updatedTest?.answers['q1']?.questionId).toBe('q1');
    expect(updatedTest?.answers['q1']?.chosenChoiceIds).toEqual(['a']);
    expect(updatedTest?.markedForReview).toEqual(['q1']);

    expect(plan.attemptsToPut).toHaveLength(1);
    expect(plan.attemptsToPut[0]?.questionId).toBe('q1');
    expect(plan.attemptsToPut[0]?.chosenChoiceIds).toEqual(['a']);
  });

  it('returns an empty plan when no duplicates exist', () => {
    const question: Question = {
      id: 'q1',
      subjectId: 'security-plus',
      topicIds: ['t1'],
      type: 'mcq_single',
      stem: 'Sample question',
      choices: [
        { id: 'a', text: 'A' },
        { id: 'b', text: 'B' },
      ],
      correctChoiceIds: ['a'],
    };

    const plan = buildQuestionBankDeduplicationPlan({
      questions: [question],
      tests: [],
      attempts: [],
      nowIso: '2025-01-03T00:00:00.000Z',
    });

    expect(plan.duplicateGroups).toBe(0);
    expect(plan.questionIdsToDelete).toEqual([]);
    expect(plan.questionsToPut).toEqual([]);
    expect(plan.testsToPut).toEqual([]);
    expect(plan.attemptsToPut).toEqual([]);
  });
});

