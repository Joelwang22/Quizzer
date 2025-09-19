import { z, type RefinementCtx } from 'zod';
import type { QuestionDifficulty } from './types';

export const questionTypeValues = [
  'mcq_single',
  'mcq_multi',
  'pbq_order',
  'pbq_match',
  'pbq_fill',
  'pbq_group',
] as const;

export const questionDifficultySchema = z
  .number({ required_error: 'Difficulty is required' })
  .int()
  .min(1)
  .max(5) as z.ZodType<QuestionDifficulty>;

// ---------------- Base shapes (objects only — no superRefine here) ----------------

const baseQuestionObj = z.object({
  id: z.string().min(1),
  subjectId: z.string().min(1, 'Subject is required'),
  topicIds: z.array(z.string().min(1)).min(1, 'Select at least one topic'),
  type: z.enum(questionTypeValues),
  stem: z.string().min(1, 'Prompt is required'),
  explanation: z.string().optional(),
  difficulty: questionDifficultySchema.optional(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

const choiceSchema = z.object({
  id: z.string().min(1, 'Choice id is required'),
  text: z.string().min(1, 'Choice text is required'),
});

// MCQ variants as ZodObjects
const mcqSingleObj = baseQuestionObj.extend({
  type: z.literal('mcq_single'),
  choices: z.array(choiceSchema).min(2, 'Provide at least two choices'),
  correctChoiceIds: z.array(z.string().min(1)).min(1, 'Select at least one correct answer'),
});

const mcqMultiObj = baseQuestionObj.extend({
  type: z.literal('mcq_multi'),
  choices: z.array(choiceSchema).min(2, 'Provide at least two choices'),
  correctChoiceIds: z.array(z.string().min(1)).min(2, 'Multi-select questions must have at least two correct choices'),
});

// PBQ variants as ZodObjects
const pbqBaseObj = baseQuestionObj.extend({
  pbqSpec: z.object({
    instructions: z.string().min(1, 'Instructions are required'),
    configuration: z.record(z.unknown()),
  }),
});

const pbqOrderObj = pbqBaseObj.extend({
  type: z.literal('pbq_order'),
});

const pbqMatchObj = pbqBaseObj.extend({
  type: z.literal('pbq_match'),
});

const pbqFillObj = pbqBaseObj.extend({
  type: z.literal('pbq_fill'),
});

const pbqGroupObj = pbqBaseObj.extend({
  type: z.literal('pbq_group'),
});

// ---------------- Persisted union + union-level validations ----------------

const persistedQuestionSchemaBase = z.discriminatedUnion('type', [
  mcqSingleObj,
  mcqMultiObj,
  pbqOrderObj,
  pbqMatchObj,
  pbqFillObj,
  pbqGroupObj,
]);

type PersistedQuestionBase = z.infer<typeof persistedQuestionSchemaBase>;

export const persistedQuestionSchema = persistedQuestionSchemaBase.superRefine(
  (question: PersistedQuestionBase, ctx: RefinementCtx) => {
    switch (question.type) {
      case 'mcq_single': {
        // choices subset check
        const choiceIds = new Set(question.choices.map((c) => c.id));
        const allValid = question.correctChoiceIds.every((id) => choiceIds.has(id));
        if (!allValid) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Correct answers must reference existing choices',
            path: ['correctChoiceIds'],
          });
        }
        // exactly one correct
        if (question.correctChoiceIds.length !== 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Single-answer questions must have exactly one correct choice.',
            path: ['correctChoiceIds'],
          });
        }
        break;
      }
      case 'mcq_multi': {
        const choiceIds = new Set(question.choices.map((c) => c.id));
        const allValid = question.correctChoiceIds.every((id) => choiceIds.has(id));
        if (!allValid) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Correct answers must reference existing choices',
            path: ['correctChoiceIds'],
          });
        }
        if (question.correctChoiceIds.length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Multi-select questions must have at least two correct choices.',
            path: ['correctChoiceIds'],
          });
        }
        break;
      }
      case 'pbq_order': {
        const ordering = (question.pbqSpec.configuration as Record<string, unknown>)?.['ordering'];
        if (!Array.isArray(ordering) || ordering.length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Ordering PBQs require an "ordering" array with at least two entries.',
            path: ['pbqSpec', 'configuration', 'ordering'],
          });
        }
        break;
      }
      case 'pbq_match': {
        const pairs = (question.pbqSpec.configuration as Record<string, unknown>)?.['pairs'];
        if (!Array.isArray(pairs) || pairs.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Matching PBQs require a non-empty "pairs" array.',
            path: ['pbqSpec', 'configuration', 'pairs'],
          });
        } else {
          pairs.forEach((pair: unknown, index: number) => {
            if (!pair || typeof pair !== 'object') {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Each pair must be an object with "secure" and "legacy" values.',
                path: ['pbqSpec', 'configuration', 'pairs', index],
              });
              return;
            }
            const { secure, legacy } = pair as { secure?: unknown; legacy?: unknown };
            if (typeof secure !== 'string' || typeof legacy !== 'string') {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Pairs must define string "secure" and "legacy" values.',
                path: ['pbqSpec', 'configuration', 'pairs', index],
              });
            }
          });
        }
        break;
      }
      case 'pbq_fill': {
        const accepted = (question.pbqSpec.configuration as Record<string, unknown>)?.['acceptedAnswers'];
        if (!Array.isArray(accepted) || accepted.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Fill-in PBQs require an "acceptedAnswers" array.',
            path: ['pbqSpec', 'configuration', 'acceptedAnswers'],
          });
        } else if (!accepted.every((v) => typeof v === 'string' && v.trim().length > 0)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Accepted answers must be non-empty strings.',
            path: ['pbqSpec', 'configuration', 'acceptedAnswers'],
          });
        }
        break;
      }
      case 'pbq_group': {
        const groups = (question.pbqSpec.configuration as Record<string, unknown>)?.['groups'];
        if (!groups || typeof groups !== 'object') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Grouping PBQs require a "groups" object.',
            path: ['pbqSpec', 'configuration', 'groups'],
          });
        } else {
          const entries = Object.entries(groups as Record<string, unknown>);
          if (entries.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Provide at least one group with values.',
              path: ['pbqSpec', 'configuration', 'groups'],
            });
          }
          for (const [groupName, values] of entries) {
            if (!Array.isArray(values) || values.length === 0) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Each group must include at least one item.',
                path: ['pbqSpec', 'configuration', 'groups', groupName],
              });
            }
          }
        }
        break;
      }
    }
  }
);

// ---------------- Upsert union (optional meta on each variant) ----------------

const metaOptional = {
  id: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
};

const mcqSingleUpsertObj = mcqSingleObj.extend(metaOptional);
const mcqMultiUpsertObj = mcqMultiObj.extend(metaOptional);
const pbqOrderUpsertObj = pbqOrderObj.extend(metaOptional);
const pbqMatchUpsertObj = pbqMatchObj.extend(metaOptional);
const pbqFillUpsertObj = pbqFillObj.extend(metaOptional);
const pbqGroupUpsertObj = pbqGroupObj.extend(metaOptional);

const questionUpsertSchemaBase = z.discriminatedUnion('type', [
  mcqSingleUpsertObj,
  mcqMultiUpsertObj,
  pbqOrderUpsertObj,
  pbqMatchUpsertObj,
  pbqFillUpsertObj,
  pbqGroupUpsertObj,
]);

type QuestionUpsertBase = z.infer<typeof questionUpsertSchemaBase>;

export const questionUpsertSchema = questionUpsertSchemaBase.superRefine(
  (question: QuestionUpsertBase, ctx: RefinementCtx) => {
    // Reuse the same validations as persisted
    // (copy/paste from above switch; or keep it minimal if editor already constrains inputs)
    switch (question.type) {
      case 'mcq_single': {
        const choiceIds = new Set(question.choices.map((c) => c.id));
        const allValid = question.correctChoiceIds.every((id) => choiceIds.has(id));
        if (!allValid) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Correct answers must reference existing choices',
            path: ['correctChoiceIds'],
          });
        }
        if (question.correctChoiceIds.length !== 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Single-answer questions must have exactly one correct choice.',
            path: ['correctChoiceIds'],
          });
        }
        break;
      }
      case 'mcq_multi': {
        const choiceIds = new Set(question.choices.map((c) => c.id));
        const allValid = question.correctChoiceIds.every((id) => choiceIds.has(id));
        if (!allValid) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Correct answers must reference existing choices',
            path: ['correctChoiceIds'],
          });
        }
        if (question.correctChoiceIds.length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Multi-select questions must have at least two correct choices.',
            path: ['correctChoiceIds'],
          });
        }
        break;
      }
      case 'pbq_order': {
        const ordering = (question.pbqSpec.configuration as Record<string, unknown>)?.['ordering'];
        if (!Array.isArray(ordering) || ordering.length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Ordering PBQs require an "ordering" array with at least two entries.',
            path: ['pbqSpec', 'configuration', 'ordering'],
          });
        }
        break;
      }
      case 'pbq_match': {
        const pairs = (question.pbqSpec.configuration as Record<string, unknown>)?.['pairs'];
        if (!Array.isArray(pairs) || pairs.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Matching PBQs require a non-empty "pairs" array.',
            path: ['pbqSpec', 'configuration', 'pairs'],
          });
        }
        break;
      }
      case 'pbq_fill': {
        const accepted = (question.pbqSpec.configuration as Record<string, unknown>)?.['acceptedAnswers'];
        if (!Array.isArray(accepted) || accepted.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Fill-in PBQs require an "acceptedAnswers" array.',
            path: ['pbqSpec', 'configuration', 'acceptedAnswers'],
          });
        }
        break;
      }
      case 'pbq_group': {
        const groups = (question.pbqSpec.configuration as Record<string, unknown>)?.['groups'];
        if (!groups || typeof groups !== 'object') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Grouping PBQs require a "groups" object.',
            path: ['pbqSpec', 'configuration', 'groups'],
          });
        }
        break;
      }
    }
  }
);

export type QuestionUpsert = z.infer<typeof questionUpsertSchema>;

// ---------------- Other entities ----------------

export const subjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export const topicSchema = z.object({
  id: z.string().min(1),
  subjectId: z.string().min(1),
  name: z.string().min(1),
});

export const attemptSchema = z.object({
  id: z.string().min(1),
  questionId: z.string().min(1),
  testId: z.string().optional(),
  submittedAt: z.string().min(1),
  isCorrect: z.boolean(),
  chosenChoiceIds: z.array(z.string()).optional(),
  pbqAnswer: z.unknown().optional(),
  subjectId: z.string().min(1),
  topicIds: z.array(z.string().min(1)),
});

export const testAttemptAnswerSchema = z.object({
  questionId: z.string().min(1),
  chosenChoiceIds: z.array(z.string()).optional(),
  pbqAnswer: z.unknown().optional(),
  isCorrect: z.boolean().optional(),
  submittedAt: z.string().optional(),
});

export const testSchema = z.object({
  id: z.string().min(1),
  status: z.union([z.literal('in_progress'), z.literal('completed')]),
  subjectIds: z.array(z.string()),
  topicIds: z.array(z.string()),
  selectionPolicy: z.object({
    source: z.union([z.literal('all'), z.literal('unseen'), z.literal('not_mastered')]),
    types: z.array(z.enum(questionTypeValues)),
  }),
  questionIds: z.array(z.string().min(1)),
  currentIndex: z.number().int().nonnegative(),
  answers: z.record(testAttemptAnswerSchema),
  markedForReview: z.array(z.string()),
  timeSpentMs: z.number().nonnegative().optional(),
  score: z.number().min(0).max(100).optional(),
  createdAt: z.string().min(1),
  completedAt: z.string().optional(),
});

export const collectionExportSchema = z.object({
  subjects: z.array(subjectSchema),
  topics: z.array(topicSchema),
  questions: z.array(persistedQuestionSchema),
  attempts: z.array(attemptSchema),
  tests: z.array(testSchema),
});

export type CollectionExport = z.infer<typeof collectionExportSchema>;
