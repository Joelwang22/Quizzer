import { describe, expect, it, vi } from 'vitest';
import type { Attempt, Question } from '../../models';
import { buildTest } from '../testBuilder';

const baseQuestions: Question[] = [
  {
    id: 'q1',
    subjectId: 'security-plus',
    topicIds: ['networking'],
    type: 'mcq_single',
    stem: 'Question 1',
    choices: [
      { id: 'a', text: 'A' },
      { id: 'b', text: 'B' },
    ],
    correctChoiceIds: ['a'],
    explanation: '',
    difficulty: 3,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'q2',
    subjectId: 'security-plus',
    topicIds: ['networking'],
    type: 'mcq_single',
    stem: 'Question 2',
    choices: [
      { id: 'a', text: 'A' },
      { id: 'b', text: 'B' },
    ],
    correctChoiceIds: ['a'],
    explanation: '',
    difficulty: 3,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'q3',
    subjectId: 'security-plus',
    topicIds: ['governance'],
    type: 'mcq_multi',
    stem: 'Question 3',
    choices: [
      { id: 'a', text: 'A' },
      { id: 'b', text: 'B' },
      { id: 'c', text: 'C' },
    ],
    correctChoiceIds: ['a', 'c'],
    explanation: '',
    difficulty: 3,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'q4',
    subjectId: 'security-plus',
    topicIds: ['networking'],
    type: 'pbq_fill',
    stem: 'Question 4',
    pbqSpec: {
      instructions: 'Fill in the blank',
      configuration: { acceptedAnswers: ['answer'] },
    },
    explanation: '',
    difficulty: 3,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'q5',
    subjectId: 'security-plus',
    topicIds: ['networking'],
    type: 'mcq_single',
    stem: 'Question 5',
    choices: [
      { id: 'a', text: 'A' },
      { id: 'b', text: 'B' },
    ],
    correctChoiceIds: ['a'],
    explanation: '',
    difficulty: 3,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

const baseAttempts: Attempt[] = [
  {
    id: 'a1',
    questionId: 'q1',
    subjectId: 'security-plus',
    topicIds: ['networking'],
    submittedAt: '2024-01-01T00:00:00.000Z',
    isCorrect: true,
  },
  {
    id: 'a2',
    questionId: 'q1',
    subjectId: 'security-plus',
    topicIds: ['networking'],
    submittedAt: '2024-01-02T00:00:00.000Z',
    isCorrect: true,
  },
  {
    id: 'a3',
    questionId: 'q2',
    subjectId: 'security-plus',
    topicIds: ['networking'],
    submittedAt: '2024-01-03T00:00:00.000Z',
    isCorrect: true,
  },
  {
    id: 'a4',
    questionId: 'q2',
    subjectId: 'security-plus',
    topicIds: ['networking'],
    submittedAt: '2024-01-04T00:00:00.000Z',
    isCorrect: true,
  },
  {
    id: 'a5',
    questionId: 'q2',
    subjectId: 'security-plus',
    topicIds: ['networking'],
    submittedAt: '2024-01-05T00:00:00.000Z',
    isCorrect: true,
  },
];

describe('testBuilder', () => {
  it('selects only unseen questions when requested', () => {
    const result = buildTest({
      questions: baseQuestions,
      attempts: baseAttempts,
      subjectIds: ['security-plus'],
      topicIds: [],
      selectionPolicy: {
        source: 'unseen',
        types: ['mcq_single'],
      },
      size: 1,
    });

    expect(result.questionIds).toEqual(['q5']);
  });

  it('respects not-mastered threshold override', () => {
    const result = buildTest({
      questions: baseQuestions,
      attempts: baseAttempts,
      subjectIds: ['security-plus'],
      topicIds: [],
      selectionPolicy: {
        source: 'not_mastered',
        types: ['mcq_single'],
      },
      size: 2,
      masteryThreshold: 3,
    });

    expect(new Set(result.questionIds)).toEqual(new Set(['q1', 'q5']));
  });

  it('filters by topic and type', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const result = buildTest({
      questions: baseQuestions,
      attempts: [],
      subjectIds: ['security-plus'],
      topicIds: ['governance'],
      selectionPolicy: {
        source: 'all',
        types: ['mcq_multi'],
      },
      size: 1,
    });
    expect(result.questionIds).toEqual(['q3']);
    vi.restoreAllMocks();
  });

  it('returns diagnostic when pool insufficient', () => {
    const result = buildTest({
      questions: baseQuestions,
      attempts: [],
      subjectIds: ['security-plus'],
      topicIds: [],
      selectionPolicy: {
        source: 'all',
        types: ['pbq_fill'],
      },
      size: 5,
    });

    expect(result.questionIds).toHaveLength(0);
    expect(result.diagnostics[0]).toContain('Insufficient questions');
  });
});
