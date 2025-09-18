import { describe, expect, it } from 'vitest';
import type { Attempt, Question } from '../../models';
import {
  calculateOverallAccuracy,
  calculateTopicAccuracy,
  findWeakTopics,
} from '../analytics';

describe('analytics helpers', () => {
  const sampleQuestions: Question[] = [
    {
      id: 'q1',
      subjectId: 'security-plus',
      topicIds: ['networking'],
      type: 'mcq_single',
      stem: 'stub',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      choices: [],
      correctChoiceIds: [],
    },
    {
      id: 'q2',
      subjectId: 'security-plus',
      topicIds: ['networking', 'cloud'],
      type: 'mcq_single',
      stem: 'stub',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      choices: [],
      correctChoiceIds: [],
    },
  ];

  const sampleAttempts: Attempt[] = [
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
      questionId: 'q2',
      subjectId: 'security-plus',
      topicIds: ['networking', 'cloud'],
      submittedAt: '2024-01-02T00:00:00.000Z',
      isCorrect: false,
    },
    {
      id: 'a3',
      questionId: 'q2',
      subjectId: 'security-plus',
      topicIds: ['networking', 'cloud'],
      submittedAt: '2024-01-03T00:00:00.000Z',
      isCorrect: false,
    },
  ];

  it('calculates overall accuracy', () => {
    const result = calculateOverallAccuracy(sampleAttempts);
    expect(result.totalAttempts).toBe(3);
    expect(result.correct).toBe(1);
    expect(result.accuracy).toBeCloseTo(1 / 3);
  });

  it('aggregates topic accuracy', () => {
    const topics = calculateTopicAccuracy(sampleAttempts, sampleQuestions);
    const networking = topics.find((topic) => topic.topicId === 'networking');

    expect(topics).toHaveLength(2);
    expect(networking?.attempts).toBe(3);
    expect(networking?.correct).toBe(1);
  });

  it('identifies weak topics using threshold', () => {
    const topics = calculateTopicAccuracy(
      Array.from({ length: 20 }, (_, index) => ({
        ...sampleAttempts[index % sampleAttempts.length],
        id: `attempt-${index}`,
      })),
      sampleQuestions,
    );
    const weakest = findWeakTopics(topics, 5);
    expect(weakest.length).toBeGreaterThan(0);
  });
});
