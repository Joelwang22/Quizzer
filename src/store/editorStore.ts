import { create } from 'zustand';
import type { Question } from '../models';

interface QuestionEditorState {
  draft?: Question;
  isDirty: boolean;
  // TODO: Wire up validation via zod schema and persistence through Dexie.
  setDraft: (draft: Question | undefined) => void;
  markSaved: () => void;
}

export const useQuestionEditorStore = create<QuestionEditorState>((set) => ({
  draft: undefined,
  isDirty: false,
  setDraft: (draft) => set({ draft, isDirty: true }),
  markSaved: () => set({ isDirty: false }),
}));
