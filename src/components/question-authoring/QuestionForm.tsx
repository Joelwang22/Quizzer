import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import {
  isMCQ,
  isPBQ,
  type Choice,
  type Question,
  type QuestionType,
  type QuestionUpsert,
  type Subject,
  type Topic,
} from '../../models';
import { questionTypeValues, questionUpsertSchema } from '../../models/schemas';

interface QuestionFormProps {
  subjects: Subject[];
  topics: Topic[];
  initialQuestion?: Question | QuestionUpsert;
  submitting?: boolean;
  duplicateWarning?: string | null;
  onCancel: () => void;
  onSubmit: (payload: QuestionUpsert) => Promise<void> | void;
}

interface FormErrors {
  fieldErrors: Record<string, string>;
  formError?: string;
}

const PAGE_TOPIC_LIMIT = 8;

const difficultyOptions = [1, 2, 3, 4, 5] as const;

export const QuestionForm = ({
  subjects,
  topics,
  initialQuestion,
  submitting = false,
  duplicateWarning,
  onCancel,
  onSubmit,
}: QuestionFormProps): JSX.Element => {
  const [type, setType] = useState<QuestionType>(initialQuestion?.type ?? 'mcq_single');
  const [subjectId, setSubjectId] = useState<string>(initialQuestion?.subjectId ?? subjects[0]?.id ?? '');
  const [topicIds, setTopicIds] = useState<string[]>(initialQuestion?.topicIds ?? []);
  const [stem, setStem] = useState<string>(initialQuestion?.stem ?? '');
  const [explanation, setExplanation] = useState<string>(initialQuestion?.explanation ?? '');
  const [difficulty, setDifficulty] = useState<number>(initialQuestion?.difficulty ?? 3);
  const [choices, setChoices] = useState<Choice[]>(() => {
    if (initialQuestion && isMCQ(initialQuestion)) {
      return initialQuestion.choices;
    }
    return [createChoice('A'), createChoice('B')];
  });
  const [correctChoiceIds, setCorrectChoiceIds] = useState<string[]>(() => {
    if (initialQuestion && isMCQ(initialQuestion)) {
      return initialQuestion.correctChoiceIds;
    }
    return [];
  });
  const [pbqInstructions, setPbqInstructions] = useState<string>(() => {
    if (initialQuestion && isPBQ(initialQuestion)) {
      return initialQuestion.pbqSpec.instructions;
    }
    return '';
  });
  const [pbqConfigJson, setPbqConfigJson] = useState<string>(() => {
    if (initialQuestion && isPBQ(initialQuestion)) {
      return JSON.stringify(initialQuestion.pbqSpec.configuration ?? {}, null, 2);
    }
    return '{\n  \n}';
  });
  const [errors, setErrors] = useState<FormErrors>({ fieldErrors: {} });
  const [showAllTopics, setShowAllTopics] = useState<boolean>(false);

  useEffect(() => {
    if (initialQuestion) {
      setType(initialQuestion.type);
      setSubjectId(initialQuestion.subjectId);
      setTopicIds(initialQuestion.topicIds);
      setStem(initialQuestion.stem);
      setExplanation(initialQuestion.explanation ?? '');
      setDifficulty(initialQuestion.difficulty ?? 3);
      if (isMCQ(initialQuestion)) {
        setChoices(initialQuestion.choices);
        setCorrectChoiceIds(initialQuestion.correctChoiceIds);
      } else {
        setChoices([createChoice('A'), createChoice('B')]);
        setCorrectChoiceIds([]);
      }
      if (isPBQ(initialQuestion)) {
        setPbqInstructions(initialQuestion.pbqSpec.instructions);
        setPbqConfigJson(
          JSON.stringify(initialQuestion.pbqSpec.configuration ?? {}, null, 2),
        );
      } else {
        setPbqInstructions('');
        setPbqConfigJson('{\n  \n}');
      }
    }
  }, [initialQuestion]);

  useEffect(() => {
    // ensure correct answers align with available choices when editing type/choices
    setCorrectChoiceIds((current) => current.filter((choiceId) => choices.some((choice) => choice.id === choiceId)));
  }, [choices]);

  const filteredTopics = useMemo(() => {
    if (!subjectId) {
      return topics;
    }
    return topics.filter((topic) => topic.subjectId === subjectId);
  }, [subjectId, topics]);

  const visibleTopics = useMemo(() => {
    if (showAllTopics) {
      return filteredTopics;
    }
    return filteredTopics.slice(0, PAGE_TOPIC_LIMIT);
  }, [filteredTopics, showAllTopics]);

  const parsedConfiguration = useMemo(() => {
    if (!requiresPBQSpec(type)) {
      return { value: undefined, error: null } as const;
    }
    try {
      const value = JSON.parse(pbqConfigJson);
      return { value, error: null } as const;
    } catch (error) {
      return {
        value: undefined,
        error: error instanceof Error ? error.message : 'Invalid JSON',
      } as const;
    }
  }, [pbqConfigJson, type]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const fieldErrors: Record<string, string> = {};
    let configuration: unknown;

    if (requiresPBQSpec(type)) {
      if (parsedConfiguration.error) {
        fieldErrors['pbqSpec.configuration'] = parsedConfiguration.error;
      } else {
        configuration = parsedConfiguration.value;
      }
    }

    if (!subjectId) {
      fieldErrors.subjectId = 'Select a subject';
    }
    if (topicIds.length === 0) {
      fieldErrors.topicIds = 'Select at least one topic';
    }

    if (type.startsWith('mcq') && correctChoiceIds.length === 0) {
      fieldErrors.correctChoiceIds = 'Mark at least one correct option';
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors({ fieldErrors, formError: undefined });
      return;
    }

    const payload: QuestionUpsert = {
      id: initialQuestion?.id,
      subjectId,
      topicIds,
      type,
      stem,
      explanation: explanation.trim() || undefined,
      difficulty,
      createdAt: initialQuestion?.createdAt,
      updatedAt: initialQuestion?.updatedAt,
      ...(type.startsWith('mcq')
        ? {
            choices,
            correctChoiceIds,
          }
        : {
            pbqSpec: {
              instructions: pbqInstructions.trim() || 'Answer the scenario.',
              configuration: configuration ?? {},
            },
          }),
    } as QuestionUpsert;

    try {
      const parsed = questionUpsertSchema.parse(payload);
      await onSubmit(parsed);
      setErrors({ fieldErrors: {} });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        for (const issue of error.issues) {
          newErrors[issue.path.join('.')] = issue.message;
        }
        setErrors({ fieldErrors: newErrors });
      } else {
        setErrors({ fieldErrors: {}, formError: error instanceof Error ? error.message : 'Failed to save question.' });
      }
    }
  };

  const toggleChoiceSelection = (choiceId: string): void => {
    if (type === 'mcq_single') {
      setCorrectChoiceIds([choiceId]);
      return;
    }
    setCorrectChoiceIds((current) =>
      current.includes(choiceId)
        ? current.filter((id) => id !== choiceId)
        : [...current, choiceId],
    );
  };

  const choiceInputDisabled = !type.startsWith('mcq');

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300" htmlFor="subject">
          Subject
        </label>
        <select
          id="subject"
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2"
          value={subjectId}
          onChange={(event) => setSubjectId(event.target.value)}
        >
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
        {errors.fieldErrors.subjectId ? (
          <p className="text-sm text-red-400">{errors.fieldErrors.subjectId}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <span className="block text-sm font-medium text-slate-300">Topics</span>
        <div className="flex flex-wrap gap-2">
          {visibleTopics.map((topic) => (
            <label key={topic.id} className="flex items-center gap-2 rounded-md border border-slate-700 px-3 py-1 text-sm">
              <input
                type="checkbox"
                checked={topicIds.includes(topic.id)}
                onChange={() =>
                  setTopicIds((current) =>
                    current.includes(topic.id)
                      ? current.filter((id) => id !== topic.id)
                      : [...current, topic.id],
                  )
                }
              />
              {topic.name}
            </label>
          ))}
        </div>
        {filteredTopics.length > PAGE_TOPIC_LIMIT ? (
          <button
            type="button"
            className="text-sm text-teal-300"
            onClick={() => setShowAllTopics((value) => !value)}
          >
            {showAllTopics ? 'Show fewer topics' : 'Show all topics'}
          </button>
        ) : null}
        {errors.fieldErrors.topicIds ? (
          <p className="text-sm text-red-400">{errors.fieldErrors.topicIds}</p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300" htmlFor="type">
            Question type
          </label>
          <select
            id="type"
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2"
            value={type}
            onChange={(event) => {
              const nextType = event.target.value as QuestionType;
              setType(nextType);
              if (!nextType.startsWith('mcq')) {
                setCorrectChoiceIds([]);
              }
            }}
          >
            {questionTypeValues.map((value) => (
              <option key={value} value={value}>
                {formatQuestionType(value)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300" htmlFor="difficulty">
            Difficulty (1 = easiest)
          </label>
          <select
            id="difficulty"
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2"
            value={difficulty}
            onChange={(event) => setDifficulty(Number(event.target.value))}
          >
            {difficultyOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300" htmlFor="stem">
          Prompt
        </label>
        <textarea
          id="stem"
          className="min-h-[6rem] w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2"
          value={stem}
          onChange={(event) => setStem(event.target.value)}
        />
        {errors.fieldErrors.stem ? (
          <p className="text-sm text-red-400">{errors.fieldErrors.stem}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300" htmlFor="explanation">
          Explanation (optional)
        </label>
        <textarea
          id="explanation"
          className="min-h-[4rem] w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2"
          value={explanation}
          onChange={(event) => setExplanation(event.target.value)}
        />
      </div>

      {type.startsWith('mcq') ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Choices</h3>
            <button
              type="button"
              className="rounded-md border border-slate-700 px-3 py-1 text-sm hover:bg-slate-800"
              onClick={() => setChoices((current) => [...current, createChoice(String.fromCharCode(65 + current.length))])}
              disabled={choiceInputDisabled}
            >
              Add choice
            </button>
          </div>
          <div className="space-y-2">
            {choices.map((choice, index) => (
              <div key={choice.id} className="flex items-center gap-3">
                <input
                  type={type === 'mcq_single' ? 'radio' : 'checkbox'}
                  className="mt-1"
                  name="correct-choice"
                  checked={correctChoiceIds.includes(choice.id)}
                  onChange={() => toggleChoiceSelection(choice.id)}
                />
                <input
                  type="text"
                  className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2"
                  value={choice.text}
                  onChange={(event) =>
                    setChoices((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, text: event.target.value } : item,
                      ),
                    )
                  }
                />
                <button
                  type="button"
                  className="text-sm text-red-400"
                  onClick={() =>
                    setChoices((current) => current.filter((_, itemIndex) => itemIndex !== index))
                  }
                  disabled={choices.length <= 2}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          {errors.fieldErrors.correctChoiceIds ? (
            <p className="text-sm text-red-400">{errors.fieldErrors.correctChoiceIds}</p>
          ) : null}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300" htmlFor="pbqInstructions">
              PBQ instructions
            </label>
            <textarea
              id="pbqInstructions"
              className="min-h-[4rem] w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2"
              value={pbqInstructions}
              onChange={(event) => setPbqInstructions(event.target.value)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300" htmlFor="pbqConfig">
                Configuration JSON
              </label>
              <textarea
                id="pbqConfig"
                className="min-h-[12rem] w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-sm"
                value={pbqConfigJson}
                onChange={(event) => setPbqConfigJson(event.target.value)}
              />
              {errors.fieldErrors['pbqSpec.configuration'] ? (
                <p className="text-sm text-red-400">{errors.fieldErrors['pbqSpec.configuration']}</p>
              ) : null}
              {parsedConfiguration.error ? (
                <p className="text-sm text-amber-400">{parsedConfiguration.error}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-300">Preview</h4>
              <pre className="min-h-[12rem] overflow-auto rounded-md border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200">
                {parsedConfiguration.value
                  ? JSON.stringify(parsedConfiguration.value, null, 2)
                  : 'Provide JSON in the editor to preview.'}
              </pre>
            </div>
          </div>
        </div>
      )}

      {duplicateWarning ? (
        <p className="rounded-md border border-amber-500/80 bg-amber-500/10 p-3 text-sm text-amber-200">
          {duplicateWarning}
        </p>
      ) : null}

      {errors.formError ? (
        <p className="rounded-md border border-red-500/80 bg-red-900/40 p-3 text-sm text-red-300">
          {errors.formError}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 font-semibold text-white hover:bg-teal-600 disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? 'Saving…' : 'Save question'}
        </button>
        <button
          type="button"
          className="rounded-md border border-slate-700 px-4 py-2 hover:bg-slate-800"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const requiresPBQSpec = (type: QuestionType): boolean => type.startsWith('pbq_');

const createChoice = (label: string): Choice => ({
  id: `${label.toLowerCase()}-${crypto.randomUUID?.() ?? Math.random().toString(16).slice(2, 8)}`,
  text: '',
});

const formatQuestionType = (type: QuestionType): string => {
  return type
    .replace('pbq', 'PBQ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export default QuestionForm;
