import { useEffect, useState } from 'react';
import { db, DEFAULT_MASTERY_THRESHOLD } from '../db';
import type { AppConfig } from '../models';
import { collectionExportSchema, type CollectionExport } from '../models/schemas';
import { exportCollection, mergeCollection, replaceCollection } from '../utils/dataTransfer';

interface ImportPreview extends CollectionExport {
  fileName: string;
  sizeKb: number;
}

type ImportMode = 'merge' | 'replace';

const Settings = (): JSX.Element => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [exporting, setExporting] = useState<boolean>(false);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [importMode, setImportMode] = useState<ImportMode>('merge');
  const [importError, setImportError] = useState<string | null>(null);
  const [applyingImport, setApplyingImport] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    void loadConfig();
  }, []);

  const loadConfig = async (): Promise<void> => {
    const current = await db.config.get('settings');
    if (!current) {
      await db.config.put({ id: 'settings', masteryThreshold: DEFAULT_MASTERY_THRESHOLD });
      setConfig({ id: 'settings', masteryThreshold: DEFAULT_MASTERY_THRESHOLD });
    } else {
      setConfig(current);
    }
  };

  const handleExport = async (): Promise<void> => {
    setExporting(true);
    try {
      const payload = await exportCollection();
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cybersec-quiz-export-${new Date().toISOString()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const parsed = JSON.parse(text);
        const validation = collectionExportSchema.parse(parsed);
        setImportPreview({
          ...validation,
          fileName: file.name,
          sizeKb: Math.round(file.size / 1024),
        });
        setImportError(null);
        setStatusMessage(null);
      } catch (error) {
        setImportPreview(null);
        setStatusMessage(null);
        setImportError(error instanceof Error ? error.message : 'Unable to parse JSON file.');
      }
    };
    reader.onerror = () => {
      setImportPreview(null);
      setImportError('Failed to read file.');
    };
    reader.readAsText(file);
  };

  const handleApplyImport = async (): Promise<void> => {
    if (!importPreview) {
      return;
    }
      setImportError(null);
      setStatusMessage(null);
    setApplyingImport(true);
    try {
      if (importMode === 'replace') {
        await replaceCollection(importPreview);
      } else {
        await mergeCollection(importPreview);
      }
      await loadConfig();
      setStatusMessage(`Import complete (${importMode} mode).`);
      setImportPreview(null);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to apply import.');
    } finally {
      setApplyingImport(false);
    }
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Settings & Data</h1>
        <p className="text-sm text-amber-300">
          These actions affect your local IndexedDB storage. Back up your data before importing or replacing content.
        </p>
      </header>

      <article className="space-y-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4">
        <h2 className="text-xl font-semibold text-amber-200">Data export</h2>
        <p className="text-sm text-amber-100">
          Download a JSON archive containing subjects, topics, questions, tests, and attempts. You can re-import it later on
          another device.
        </p>
    <button
          type="button"
          className="rounded-md bg-primary px-4 py-2 font-semibold text-white hover:bg-teal-600 disabled:opacity-60"
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? 'Preparing…' : 'Export data'}
        </button>
      </article>

      <article className="space-y-4 rounded-lg border border-red-500/40 bg-red-500/10 p-4">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold text-red-200">Import JSON</h2>
          <p className="text-sm text-red-100">
            Importing will modify your local data. Merge keeps existing ids and updates matches; Replace clears local data
            first. This cannot be undone.
          </p>
        </header>
        <div className="space-y-2">
          <input type="file" accept="application/json" onChange={handleImportFile} />
          {importError ? <p className="text-sm text-red-200">{importError}</p> : null}
          {importPreview ? (
            <div className="rounded-md border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200">
              <p className="font-semibold">{importPreview.fileName} ({importPreview.sizeKb} KB)</p>
              <ul className="list-disc pl-5 text-slate-300">
                <li>{importPreview.subjects.length} subjects</li>
                <li>{importPreview.topics.length} topics</li>
                <li>{importPreview.questions.length} questions</li>
                <li>{importPreview.tests.length} tests</li>
                <li>{importPreview.attempts.length} attempts</li>
              </ul>
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-100">
            <input
              type="radio"
              value="merge"
              checked={importMode === 'merge'}
              onChange={() => setImportMode('merge')}
            />
            Merge into existing data (same ids overwrite)
          </label>
          <label className="flex items-center gap-2 text-sm text-red-200">
            <input
              type="radio"
              value="replace"
              checked={importMode === 'replace'}
              onChange={() => setImportMode('replace')}
            />
            Replace everything (clears current DB)
          </label>
        </div>
        <button
          type="button"
          className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-500 disabled:opacity-60"
          onClick={handleApplyImport}
          disabled={!importPreview || applyingImport}
        >
          {applyingImport ? 'Applying…' : importMode === 'merge' ? 'Merge data' : 'Replace data'}
        </button>
        {statusMessage ? <p className="text-sm text-green-300">{statusMessage}</p> : null}
      </article>

      <article className="space-y-4 rounded-lg border border-slate-800 bg-slate-900/40 p-4">
        <h2 className="text-xl font-semibold">Quiz preferences</h2>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300" htmlFor="masteryThreshold">
            Mastery threshold
          </label>
          <input
            id="masteryThreshold"
            type="number"
            className="w-24 rounded-md border border-slate-700 bg-slate-900 px-3 py-2"
            min={1}
            max={10}
            value={config?.masteryThreshold ?? DEFAULT_MASTERY_THRESHOLD}
            onChange={(event) =>
              setConfig((current) => ({
                id: 'settings',
                masteryThreshold: Math.max(1, Number(event.target.value)),
                timerEnabled: current?.timerEnabled ?? false,
              }))
            }
          />
          <p className="text-sm text-slate-400">
            Questions solved correctly this many times are considered mastered when building new tests.
          </p>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-slate-100">
            <input
              type="checkbox"
              checked={Boolean(config?.timerEnabled)}
              onChange={(event) =>
                setConfig((current) => ({
                  id: 'settings',
                  masteryThreshold: current?.masteryThreshold ?? DEFAULT_MASTERY_THRESHOLD,
                  timerEnabled: event.target.checked,
                }))
              }
            />
            Enable 30-minute countdown timer for new tests
          </label>
          <p className="text-sm text-slate-400">
            When enabled, tests start with a shared timer that pauses when you close the tab and resumes on return.
          </p>
        </div>
        <div>
          <button
            type="button"
            className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
            onClick={async () => {
              if (!config) {
                return;
              }
              await db.config.put(config);
              setStatusMessage('Preferences saved.');
            }}
          >
            Save preferences
          </button>
        </div>
      </article>
    </section>
  );
};

export default Settings;
