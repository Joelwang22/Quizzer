import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, DEFAULT_TEST_DURATION_MINUTES } from '../db';
import type { AppConfig, Question, QuestionType, Subject, Test, Topic } from '../models';
import { buildTest, type TestBuilderResult } from '../logic/testBuilder';

type SourceOption = Test['selectionPolicy']['source'];

const DEFAULT_SIZE = 30;

const CreateTest = (): JSX.Element => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([]);
  const [source, setSource] = useState<SourceOption>('all');
  const [size, setSize] = useState<number>(DEFAULT_SIZE);
  const [diagnostics, setDiagnostics] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [topicsOpen, setTopicsOpen] = useState<boolean>(false);

  useEffect(() => {
    const load = async (): Promise<void> => {
      const [subjectsData, topicsData, questionsData, configData] = await Promise.all([
        db.subjects.toArray(),
        db.topics.toArray(),
        db.questions.toArray(),
        db.config.get('settings'),
      ]);

      setSubjects(subjectsData);
      setTopics(topicsData);
      setQuestions(questionsData);
      setConfig(configData ?? { id: 'settings', masteryThreshold: 3, timerEnabled: false });

      if (subjectsData.length > 0) {
        setSelectedSubjectIds(subjectsData.map((subject) => subject.id));
      }
    };

    void load();
  }, []);

  const visibleTopics = useMemo<Topic[]>(() => {
    if (subjects.length === 0) {
      return topics;
    }

    if (selectedSubjectIds.length === 0) {
      return [];
    }

    const selectedSubjects = new Set(selectedSubjectIds);
    return topics.filter((topic) => selectedSubjects.has(topic.subjectId));
  }, [selectedSubjectIds, subjects.length, topics]);

  const topicsSummary = useMemo(() => {
    if (subjects.length > 0 && selectedSubjectIds.length === 0) {
      return 'Select at least one subject to filter by topics.';
    }

    if (selectedTopicIds.length === 0) {
      return 'All topics included.';
    }

    const count = selectedTopicIds.length;
    return `${count} topic${count === 1 ? '' : 's'} selected.`;
  }, [selectedSubjectIds.length, selectedTopicIds.length, subjects.length]);

  useEffect(() => {
    if (subjects.length === 0) {
      return;
    }

    if (selectedSubjectIds.length === 0) {
      setSelectedTopicIds([]);
      return;
    }

    const selectedSubjects = new Set(selectedSubjectIds);
    const allowedTopicIds = new Set(
      topics.filter((topic) => selectedSubjects.has(topic.subjectId)).map((topic) => topic.id),
    );

    setSelectedTopicIds((current) => current.filter((topicId) => allowedTopicIds.has(topicId)));
  }, [selectedSubjectIds, subjects.length, topics]);

  const availableTypes = useMemo<QuestionType[]>(() => {
    const allTypes = new Set<QuestionType>();
    questions.forEach((question) => allTypes.add(question.type));
    return Array.from(allTypes);
  }, [questions]);

  const handleToggleSubject = (subjectId: string): void => {
    setSelectedSubjectIds((current) => {
      if (current.includes(subjectId)) {
        return current.filter((id) => id !== subjectId);
      }
      return [...current, subjectId];
    });
  };

  const handleToggleTopic = (topicId: string): void => {
    setSelectedTopicIds((current) => {
      if (current.includes(topicId)) {
        return current.filter((id) => id !== topicId);
      }
      return [...current, topicId];
    });
  };

  const handleToggleType = (type: QuestionType): void => {
    setSelectedTypes((current) => {
      if (current.includes(type)) {
        return current.filter((value) => value !== type);
      }
      return [...current, type];
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (subjects.length > 0 && selectedSubjectIds.length === 0) {
        setDiagnostics([]);
        setError('Select at least one subject.');
        return;
      }

      const attempts = await db.attempts.toArray();
      const effectiveTypes = selectedTypes.length > 0 ? selectedTypes : availableTypes;
      const effectiveSubjectIds = selectedSubjectIds.length > 0
        ? selectedSubjectIds
        : Array.from(new Set(questions.map((question) => question.subjectId)));

      const allowedTopicIds = new Set(
        topics
          .filter((topic) => effectiveSubjectIds.includes(topic.subjectId))
          .map((topic) => topic.id),
      );
      const effectiveTopicIds = selectedTopicIds.filter((topicId) => allowedTopicIds.has(topicId));

      const desiredSize = Number.isFinite(size) && size > 0 ? Math.floor(size) : DEFAULT_SIZE;

      const builderResult: TestBuilderResult = buildTest({
        questions,
        attempts,
        subjectIds: effectiveSubjectIds,
        topicIds: effectiveTopicIds,
        selectionPolicy: {
          source,
          types: effectiveTypes,
        },
        size: desiredSize,
        masteryThreshold: config?.masteryThreshold,
      });

      setDiagnostics(builderResult.diagnostics);

      if (builderResult.questionIds.length === 0) {
        setError(builderResult.diagnostics[0] ?? 'Unable to build test with current filters.');
        return;
      }

      const createdAt = new Date().toISOString();
      const testId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `test-${Date.now()}`;

      await db.transaction('rw', db.tests, db.userState, async () => {
        const testRecord: Test = {
          id: testId,
          status: 'in_progress',
          subjectIds: effectiveSubjectIds,
          topicIds: effectiveTopicIds,
          selectionPolicy: {
            source,
            types: effectiveTypes,
          },
          questionIds: builderResult.questionIds,
          currentIndex: 0,
          answers: {},
          markedForReview: [],
          timeSpentMs: 0,
          score: 0,
          createdAt,
          timeRemainingMs: config?.timerEnabled
            ? DEFAULT_TEST_DURATION_MINUTES * 60 * 1000
            : undefined,
        };

        await db.tests.put(testRecord);

        const existingUserState = await db.userState.get('singleton');
        await db.userState.put({
          ...existingUserState,
          id: 'singleton',
          lastTestId: testId,
        });
      });

      navigate(`/test/${testId}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to create test.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Create Test</h1>
        <p className="text-slate-300">
          Select your desired subject, topics, and question mix. We will build a 30-question Security+
          quiz that honours unseen and not-mastered filters.
        </p>
      </header>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Subjects</h2>
          <div className="flex flex-wrap gap-3">
            {subjects.map((subject) => (
              <label
                key={subject.id}
                className="flex items-center gap-2 rounded-md border border-slate-700 px-3 py-2"
              >
                <input
                  type="checkbox"
                  checked={selectedSubjectIds.includes(subject.id)}
                  onChange={() => handleToggleSubject(subject.id)}
                />
                <span>{subject.name}</span>
              </label>
            ))}
            {subjects.length === 0 ? <p className="text-slate-400">No subjects found.</p> : null}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Topics</h2>
              <p className="text-sm text-slate-400">{topicsSummary}</p>
            </div>
            <button
              type="button"
              className="rounded-md border border-slate-700 bg-transparent px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
              onClick={() => setTopicsOpen((current) => !current)}
            >
              {topicsOpen ? 'Hide topics' : 'Filter topics'}
            </button>
          </div>
          {topicsOpen ? (
            <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-3">
              <div className="flex flex-wrap gap-3">
                {visibleTopics.map((topic) => (
                  <label
                    key={topic.id}
                    className="flex items-center gap-2 rounded-md border border-slate-700 px-3 py-2"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTopicIds.includes(topic.id)}
                      onChange={() => handleToggleTopic(topic.id)}
                    />
                    <span>{topic.name}</span>
                  </label>
                ))}
                {visibleTopics.length === 0 ? (
                  subjects.length > 0 && selectedSubjectIds.length === 0 ? (
                    <p className="text-sm text-slate-400">Select at least one subject to see its topics.</p>
                  ) : (
                    <p className="text-sm text-slate-400">No topics available for the selected subject(s).</p>
                  )
                ) : null}
              </div>
            </div>
          ) : null}
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Question Types</h2>
          <div className="flex flex-wrap gap-3">
            {availableTypes.map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 rounded-md border border-slate-700 px-3 py-2 capitalize"
              >
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleToggleType(type)}
                />
                <span>{type.replace(/_/g, ' ')}</span>
              </label>
            ))}
            {availableTypes.length === 0 ? (
              <p className="text-slate-400">No question types discovered yet.</p>
            ) : null}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Question Source</h2>
          <select
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2"
            value={source}
            onChange={(event) => setSource(event.target.value as SourceOption)}
          >
            <option value="all">All questions</option>
            <option value="unseen">Unseen only</option>
            <option value="not_mastered">Not mastered (fewer than 3 correct)</option>
          </select>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Questions per Test</h2>
          <input
            type="number"
            min={1}
            max={60}
            value={size}
            onChange={(event) => setSize(Number(event.target.value))}
            className="w-32 rounded-md border border-slate-700 bg-slate-900 px-3 py-2"
          />
        </section>

        <div className="space-y-2">
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 font-semibold text-white hover:bg-teal-600 disabled:cursor-not-allowed disabled:bg-slate-700"
            disabled={
              isSubmitting ||
              questions.length === 0 ||
              (subjects.length > 0 && selectedSubjectIds.length === 0)
            }
          >
            {isSubmitting ? 'Building test…' : 'Build test'}
          </button>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          {diagnostics.length > 0 ? (
            <ul className="text-sm text-slate-400">
              {diagnostics.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </form>
    </section>
  );
};

export default CreateTest;
