import { describe, expect, it } from 'vitest';
import type { Attempt, Question, Test } from '../../models';
import {
  calculateOverallAccuracy,
  calculateOverallWindows,
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
      Array.from({ length: 20 }, (_, index): Attempt => {
        const baseAttempt =
          sampleAttempts[index % sampleAttempts.length] ?? sampleAttempts[0];
        return {
          ...baseAttempt,
          id: `attempt-${index}`,
        };
      }),
      sampleQuestions,
    );
    const weakest = findWeakTopics(topics, 5);
    expect(weakest.length).toBeGreaterThan(0);
  });

  it('returns all topics that share the lowest accuracy over the threshold', () => {
    const expandedAttempts: Attempt[] = [];
    const baseNetworkAttempt = sampleAttempts[0];
    const baseCloudAttempt = sampleAttempts[1] ?? sampleAttempts[0];

    if (!baseNetworkAttempt || !baseCloudAttempt) {
      throw new Error('Sample attempts must be defined for test data.');
    }

    for (let index = 0; index < 12; index += 1) {
      expandedAttempts.push({
        ...baseNetworkAttempt,
        id: `network-${index}`,
        isCorrect: index % 2 === 0,
      });
    }
    for (let index = 0; index < 12; index += 1) {
      expandedAttempts.push({
        ...baseCloudAttempt,
        id: `cloud-${index}`,
        isCorrect: index % 3 === 0,
      });
    }
    const topics = calculateTopicAccuracy(expandedAttempts, sampleQuestions);
    const weakest = findWeakTopics(topics, 10);
    expect(weakest.length).toBeGreaterThan(0);
    expect(weakest.every((topic) => topic.attempts >= 10)).toBe(true);
  });

  it('returns empty list when no topic meets the attempt threshold', () => {
    const topics = calculateTopicAccuracy(sampleAttempts, sampleQuestions);
    const weakest = findWeakTopics(topics, 10);
    expect(weakest).toHaveLength(0);
  });

  it('computes accuracy windows for last test and rolling periods', () => {
    const referenceDate = new Date('2024-01-10T00:00:00.000Z');
    const attemptsWithDates: Attempt[] = [
      {
        ...sampleAttempts[0],
        id: 'recent-correct',
        submittedAt: '2024-01-09T00:00:00.000Z',
      },
      {
        ...sampleAttempts[1],
        id: 'recent-wrong',
        submittedAt: '2024-01-08T00:00:00.000Z',
      },
      {
        ...sampleAttempts[2],
        id: 'older-wrong',
        submittedAt: '2023-12-15T00:00:00.000Z',
      },
    ];

    const tests: Test[] = [
      createTest('t1', 80, '2024-01-09T01:00:00.000Z'),
      createTest('t2', 60, '2023-12-20T01:00:00.000Z'),
    ];

    const windows = calculateOverallWindows(attemptsWithDates, tests, 7, referenceDate);

    expect(windows.lastTest.accuracy).toBeCloseTo(0.8);
    expect(windows.recentWindow.accuracy).toBeCloseTo(0.5);
    expect(windows.allTime.accuracy).toBeCloseTo(1 / 3);
  });
});

const createTest = (id: string, score: number, completedAt: string): Test => ({
  id,
  status: 'completed',
  subjectIds: ['security-plus'],
  topicIds: ['networking'],
  selectionPolicy: { source: 'all', types: ['mcq_single'] },
  questionIds: ['q1', 'q2'],
  currentIndex: 0,
  answers: {},
  markedForReview: [],
  createdAt: completedAt,
  completedAt,
  score,
});
