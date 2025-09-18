export type QuestionType =
  | 'mcq_single'
  | 'mcq_multi'
  | 'pbq_order'
  | 'pbq_match'
  | 'pbq_fill'
  | 'pbq_group';

export type QuestionDifficulty = 1 | 2 | 3 | 4 | 5;

export interface PBQSpec {
  // TODO: Flesh out PBQ schema fields (prompts, inputs, expected outcomes).
  instructions: string;
  configuration: Record<string, unknown>;
}

export interface Question {
  id: string;
  subjectId: string;
  topicIds: string[];
  type: QuestionType;
  stem: string;
  choices?: Array<{ id: string; text: string }>;
  correctChoiceIds?: string[];
  explanation?: string;
  difficulty?: QuestionDifficulty;
  difficultyLabel?: 'easy' | 'medium' | 'hard';
  pbqSpec?: PBQSpec;
  createdAt: string;
  updatedAt: string;
}
