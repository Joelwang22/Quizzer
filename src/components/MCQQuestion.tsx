import type { FC } from 'react';

export interface MCQQuestionProps {
  // TODO: Replace with real question model once implemented.
  prompt: string;
}

const MCQQuestion: FC<MCQQuestionProps> = ({ prompt }) => {
  return (
    <div className="space-y-2 rounded-lg border border-slate-700 p-4">
      <h2 className="text-xl font-semibold">Multiple Choice Question</h2>
      <p>{prompt}</p>
      <p className="text-sm text-slate-400">TODO: Render choices, accessibility shortcuts, and review states.</p>
    </div>
  );
};

export default MCQQuestion;
