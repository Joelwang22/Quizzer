import type { FC } from 'react';

export interface AnalyticsChartProps {
  title: string;
  description?: string;
}

const AnalyticsChart: FC<AnalyticsChartProps> = ({ title, description }) => {
  return (
    <div className="space-y-2 rounded-lg border border-slate-700 p-4">
      <header>
        <h2 className="text-lg font-semibold">{title}</h2>
        {description ? <p className="text-sm text-slate-400">{description}</p> : null}
      </header>
      <div className="flex h-32 items-center justify-center rounded-md bg-slate-900 text-slate-500">
        TODO: Render chart visualisations (sparklines, bars) summarising quiz performance.
      </div>
    </div>
  );
};

export default AnalyticsChart;
