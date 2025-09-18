import type { Question } from '../models';

export interface PBQQuestionProps {
  question: Question;
  value: unknown;
  onChange: (value: unknown) => void;
}

const PBQQuestion = ({ question, value, onChange }: PBQQuestionProps): JSX.Element => {
  const baseConfig = question.pbqSpec?.configuration ?? {};

  if (question.type === 'pbq_order') {
    const configOrdering = Array.isArray((baseConfig as { ordering?: unknown }).ordering)
      ? ((baseConfig as { ordering: unknown[] }).ordering.map((item) => String(item)))
      : [];

    const ordering = Array.isArray(value)
      ? (value as string[]).map((item) => String(item))
      : configOrdering;

    const moveItem = (fromIndex: number, toIndex: number): void => {
      const next = [...ordering];
      const [item] = next.splice(fromIndex, 1);
      if (item === undefined) {
        return;
      }
      next.splice(toIndex, 0, item);
      onChange(next);
    };

    return (
      <div className="space-y-3 rounded-lg border border-amber-500/30 bg-slate-900/40 p-4">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold">{question.stem}</h2>
          <p className="text-sm text-slate-400">Drag-less controls: use the buttons to reorder.</p>
        </header>
        <ol className="space-y-2" aria-label="Ordered response">
          {ordering.map((item, index) => (
            <li
              key={item}
              className="flex items-center justify-between rounded-md border border-amber-500/40 bg-slate-900 px-3 py-2"
            >
              <span>
                <span className="mr-2 font-semibold">{index + 1}.</span>
                {item}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-md bg-primary/80 px-2 py-1 text-xs text-white disabled:opacity-40"
                  onClick={() => moveItem(index, Math.max(0, index - 1))}
                  disabled={index === 0}
                >
                  Up
                </button>
                <button
                  type="button"
                  className="rounded-md bg-primary/80 px-2 py-1 text-xs text-white disabled:opacity-40"
                  onClick={() => moveItem(index, Math.min(ordering.length - 1, index + 1))}
                  disabled={index === ordering.length - 1}
                >
                  Down
                </button>
              </div>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (question.type === 'pbq_match') {
    const config = baseConfig as {
      pairs?: Array<{ secure: string; legacy: string }>;
    };
    const pairs = Array.isArray(config.pairs) ? config.pairs : [];
    const answerPairs = Array.isArray(value)
      ? (value as Array<{ secure: string; legacy: string }>)
      : pairs.map((pair) => ({ secure: pair.secure, legacy: '' }));

    const allLegacyOptions = Array.from(new Set(pairs.map((pair) => pair.legacy)));

    const updatePair = (index: number, legacy: string): void => {
      const next = [...answerPairs];
      const source = pairs[index];
      if (!source) {
        return;
      }
      next[index] = { secure: source.secure, legacy };
      onChange(next);
    };

    return (
      <div className="space-y-3 rounded-lg border border-amber-500/30 bg-slate-900/40 p-4">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold">{question.stem}</h2>
          <p className="text-sm text-slate-400">Match each secure protocol with its legacy counterpart.</p>
        </header>
        <div className="space-y-3">
          {pairs.map((pair, index) => (
            <div key={pair.secure} className="flex items-center gap-3">
              <span className="min-w-[8rem] font-medium text-teal-300">{pair.secure}</span>
              <select
                className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2"
                value={answerPairs[index]?.legacy ?? ''}
                onChange={(event) => updatePair(index, event.target.value)}
              >
                <option value="">Select legacy protocol</option>
                {allLegacyOptions.map((legacy) => (
                  <option key={legacy} value={legacy}>
                    {legacy}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (question.type === 'pbq_fill') {
    const stringValue = typeof value === 'string' ? value : '';
    return (
      <div className="space-y-3 rounded-lg border border-amber-500/30 bg-slate-900/40 p-4">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold">{question.stem}</h2>
        </header>
        <textarea
          className="min-h-[6rem] w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2"
          placeholder="Type your response"
          value={stringValue}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    );
  }

  const serialisedValue = typeof value === 'string' ? value : JSON.stringify(value ?? {}, null, 2);

  return (
    <div className="space-y-3 rounded-lg border border-amber-500/30 bg-slate-900/40 p-4">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">{question.stem}</h2>
        <p className="text-sm text-slate-400">
          Provide your answer as JSON. We will refine the PBQ interaction in a later milestone.
        </p>
      </header>
      <textarea
        className="min-h-[10rem] w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2"
        value={serialisedValue}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
};

export default PBQQuestion;
