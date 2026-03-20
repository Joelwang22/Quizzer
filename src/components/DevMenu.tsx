import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetDatabase } from '../db';
import type { CollectionExport } from '../models/schemas';
import { exportCollection, mergeCollection } from '../utils/dataTransfer';

const SAMPLE_SUBJECT_PAYLOAD: CollectionExport = {
  subjects: [
    { id: 'cloud-foundations', name: 'Cloud Foundations' },
  ],
  topics: [
    { id: 'shared-responsibility', subjectId: 'cloud-foundations', name: 'Shared Responsibility' },
    { id: 'cloud-controls', subjectId: 'cloud-foundations', name: 'Cloud Controls' },
  ],
  questions: [
    {
      id: 'cloud-q1',
      subjectId: 'cloud-foundations',
      topicIds: ['shared-responsibility'],
      type: 'mcq_single',
      stem: 'In a cloud deployment, who is responsible for configuring identity access policies?',
      choices: [
        { id: 'a', text: 'The cloud provider only' },
        { id: 'b', text: 'The customer' },
        { id: 'c', text: 'Shared between provider and customer' },
      ],
      correctChoiceIds: ['b'],
      explanation: 'Identity and access management is a customer responsibility in most service models.',
      difficulty: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cloud-q2',
      subjectId: 'cloud-foundations',
      topicIds: ['cloud-controls'],
      type: 'mcq_multi',
      stem: 'Select controls that mitigate misconfigured public storage buckets.',
      choices: [
        { id: 'a', text: 'Automated configuration scanning' },
        { id: 'b', text: 'Physical access badges' },
        { id: 'c', text: 'Policy-as-code guardrails' },
      ],
      correctChoiceIds: ['a', 'c'],
      explanation: 'Configuration scanning and policy guardrails detect or prevent public buckets.',
      difficulty: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  tests: [],
  attempts: [],
};

const DevMenu = (): JSX.Element => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [busy, setBusy] = useState<boolean>(false);

  const handleReset = async (): Promise<void> => {
    setBusy(true);
    try {
      await resetDatabase();
      window.location.reload();
    } finally {
      setBusy(false);
    }
  };

  const handleDump = async (): Promise<void> => {
    const payload = await exportCollection();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dev-dump-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadSample = async (): Promise<void> => {
    setBusy(true);
    try {
      await mergeCollection(SAMPLE_SUBJECT_PAYLOAD);
      setOpen(false);
    } finally {
      setBusy(false);
    }
  };

  if (!import.meta.env.DEV) {
    return <></>;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 text-sm text-slate-200">
      {open ? (
        <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-950/95 p-4 shadow-xl">
          <header className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Dev Menu</h2>
            <button className="text-slate-400" onClick={() => setOpen(false)}>
              Close
            </button>
          </header>
          <p className="text-xs text-slate-400">Tools for local development only.</p>
          <div className="space-y-2">
            <button
              type="button"
              className="w-full rounded-md border border-slate-700 px-3 py-2 hover:bg-slate-800"
              onClick={handleDump}
            >
              Dump DB (JSON)
            </button>
            <button
              type="button"
              className="w-full rounded-md border border-slate-700 px-3 py-2 hover:bg-slate-800"
              onClick={() => {
                navigate('/debug/lesson-diagrams');
                setOpen(false);
              }}
            >
              Diagram Inspector
            </button>
            <button
              type="button"
              className="w-full rounded-md border border-slate-700 px-3 py-2 hover:bg-slate-800"
              onClick={handleLoadSample}
              disabled={busy}
            >
              Load sample alt subject
            </button>
            <button
              type="button"
              className="w-full rounded-md bg-red-600 px-3 py-2 font-semibold text-white hover:bg-red-500 disabled:opacity-60"
              onClick={handleReset}
              disabled={busy}
            >
              Reset DB
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="rounded-full bg-slate-900/80 px-4 py-2 font-semibold text-slate-200 shadow-lg backdrop-blur hover:bg-slate-800"
          onClick={() => setOpen(true)}
        >
          Dev Menu
        </button>
      )}
    </div>
  );
};

export default DevMenu;
