import type { FC } from 'react';

export interface PBQQuestionProps {
  // TODO: Replace with PBQ spec once models are defined.
  stem: string;
  type: 'pbq_order' | 'pbq_match' | 'pbq_fill' | 'pbq_group';
}

const PBQQuestion: FC<PBQQuestionProps> = ({ stem, type }) => {
  return (
    <div className="space-y-2 rounded-lg border border-amber-500/30 p-4">
      <h2 className="text-xl font-semibold">Performance-Based Question</h2>
      <p className="font-medium">Type: {type}</p>
      <p>{stem}</p>
      <p className="text-sm text-slate-400">TODO: Render drag-and-drop and keyboard flows plus scoring guidance.</p>
    </div>
  );
};

export default PBQQuestion;
