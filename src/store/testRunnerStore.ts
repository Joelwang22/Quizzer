import { create } from 'zustand';

interface TestRunnerState {
  currentTestId?: string;
  activeQuestionIndex: number;
  isTimerRunning: boolean;
  // TODO: Replace placeholder state with derived data from Dexie and logic layer.
  setCurrentTest: (testId: string | undefined) => void;
  setQuestionIndex: (index: number) => void;
}

export const useTestRunnerStore = create<TestRunnerState>((set) => ({
  currentTestId: undefined,
  activeQuestionIndex: 0,
  isTimerRunning: false,
  setCurrentTest: (testId) => set({ currentTestId: testId }),
  setQuestionIndex: (index) => set({ activeQuestionIndex: index }),
}));
