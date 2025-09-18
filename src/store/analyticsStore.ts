import { create } from 'zustand';
import type { Attempt, Question } from '../models';
import {
  calculateOverallAccuracy,
  calculateTopicAccuracy,
  findWeakTopics,
  type OverallAccuracy,
  type TopicAccuracy,
} from '../logic/analytics';

interface AnalyticsState {
  attempts: Attempt[];
  questions: Question[];
  overall: OverallAccuracy;
  topics: TopicAccuracy[];
  weakTopics: TopicAccuracy[];
  // TODO: Replace sync setters with Dexie subscriptions once available.
  setData: (payload: { attempts: Attempt[]; questions: Question[] }) => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  attempts: [],
  questions: [],
  overall: { totalAttempts: 0, correct: 0, accuracy: 0 },
  topics: [],
  weakTopics: [],
  setData: ({ attempts, questions }) => {
    const overall = calculateOverallAccuracy(attempts);
    const topics = calculateTopicAccuracy(attempts, questions);
    const weakTopics = findWeakTopics(topics);
    set({ attempts, questions, overall, topics, weakTopics });
  },
}));
