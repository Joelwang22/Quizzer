import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../db';
import type { HangmanStats, UserState } from '../models';
import { securityPlusAcronyms } from '../data/acronyms';
import type { Acronym } from '../models';
import { parseAcronymText } from '../logic/acronymImport';
import { importAcronymsFromPdfArrayBuffer } from '../logic/acronymPdfImport';
import {
  DEFAULT_MAX_MISTAKES,
  isSolved,
  maskSolution,
  normaliseGuess,
  normaliseSolution,
} from '../logic/hangman';

const KEYBOARD_CHARS = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');

const DEFAULT_STATS: HangmanStats = {
  played: 0,
  wins: 0,
  losses: 0,
  currentStreak: 0,
  bestStreak: 0,
};

const DEFAULT_SUBJECT_ID = 'security-plus';
const AUTO_IMPORT_PDF_URL = `${import.meta.env.BASE_URL}acronyms/security-plus.pdf`;
const AUTO_IMPORT_MIN_ENTRIES = 310;

const pickRandomEntry = (entries: Acronym[], excludeId?: string): Acronym | null => {
  if (entries.length === 0) {
    return null;
  }

  if (entries.length === 1) {
    return entries[0] ?? null;
  }

  const candidatePool = excludeId ? entries.filter((entry) => entry.id !== excludeId) : entries;
  const pool = candidatePool.length > 0 ? candidatePool : entries;

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex] ?? pool[0] ?? null;
};

const applyOutcome = (stats: HangmanStats, outcome: 'win' | 'loss'): HangmanStats => {
  const played = stats.played + 1;

  if (outcome === 'win') {
    const wins = stats.wins + 1;
    const currentStreak = stats.currentStreak + 1;
    const bestStreak = Math.max(stats.bestStreak, currentStreak);
    return { ...stats, played, wins, currentStreak, bestStreak };
  }

  const losses = stats.losses + 1;
  return { ...stats, played, losses, currentStreak: 0 };
};

const Hangman = (): JSX.Element => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<HangmanStats>(DEFAULT_STATS);
  const [acronyms, setAcronyms] = useState<Acronym[]>([]);
  const [currentEntry, setCurrentEntry] = useState<Acronym | null>(null);
  const [correctGuesses, setCorrectGuesses] = useState<Set<string>>(() => new Set());
  const [wrongGuesses, setWrongGuesses] = useState<Set<string>>(() => new Set());
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [roundId, setRoundId] = useState<string>(() => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return `round-${Date.now()}`;
  });
  const [importOpen, setImportOpen] = useState<boolean>(false);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('replace');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importText, setImportText] = useState<string>('');
  const [importBusy, setImportBusy] = useState<boolean>(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSummary, setImportSummary] = useState<string | null>(null);
  const [skippedPreview, setSkippedPreview] = useState<string[]>([]);
  const [autoImportBusy, setAutoImportBusy] = useState<boolean>(false);
  const [autoImportError, setAutoImportError] = useState<string | null>(null);
  const [autoImportSummary, setAutoImportSummary] = useState<string | null>(null);

  const recordedRoundRef = useRef<string | null>(null);

  const solution = useMemo(() => {
    return currentEntry ? normaliseSolution(currentEntry.definition) : '';
  }, [currentEntry]);

  const maskedSolution = useMemo(() => {
    return currentEntry ? maskSolution(solution, correctGuesses) : '';
  }, [correctGuesses, currentEntry, solution]);

  const solved = useMemo(() => {
    return currentEntry ? isSolved(solution, correctGuesses) : false;
  }, [correctGuesses, currentEntry, solution]);

  const mistakes = wrongGuesses.size;
  const lost = Boolean(currentEntry) && mistakes >= DEFAULT_MAX_MISTAKES;
  const isOver = solved || lost;
  const remaining = Math.max(0, DEFAULT_MAX_MISTAKES - mistakes);

  const wrongGuessList = useMemo(() => Array.from(wrongGuesses).sort(), [wrongGuesses]);

  const refreshAcronyms = useCallback(async (): Promise<void> => {
    const rows = await db.acronyms.toArray();
    setAcronyms(rows);
  }, []);

  const commitAcronymImport = useCallback(
    async (entries: Acronym[], mode: 'merge' | 'replace'): Promise<void> => {
      await db.transaction('rw', db.acronyms, async () => {
        if (mode === 'replace') {
          await db.acronyms.clear();
        }
        await db.acronyms.bulkPut(entries);
      });

      await refreshAcronyms();
      setCurrentEntry(null);
    },
    [refreshAcronyms],
  );

  const importFromBundledPdf = useCallback(async (): Promise<void> => {
    setAutoImportBusy(true);
    setAutoImportError(null);
    setAutoImportSummary(null);

    try {
      const response = await fetch(AUTO_IMPORT_PDF_URL, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Could not load local PDF (HTTP ${response.status}).`);
      }

      const buffer = await response.arrayBuffer();
      const result = await importAcronymsFromPdfArrayBuffer(buffer, DEFAULT_SUBJECT_ID);
      if (result.entries.length < AUTO_IMPORT_MIN_ENTRIES) {
        throw new Error(`Parsed ${result.entries.length} acronyms; expected at least ${AUTO_IMPORT_MIN_ENTRIES}.`);
      }

      await commitAcronymImport(result.entries, 'replace');
      setAutoImportSummary(`Imported ${result.entries.length} acronyms from the local PDF.`);
    } catch (error) {
      setAutoImportError(error instanceof Error ? error.message : 'Failed to import from the local PDF.');
    } finally {
      setAutoImportBusy(false);
    }
  }, [commitAcronymImport]);

  useEffect(() => {
    const load = async (): Promise<void> => {
      const [existing, acronymRows] = await Promise.all([
        db.userState.get('singleton'),
        db.acronyms.toArray(),
      ]);
      setStats(existing?.hangmanStats ?? DEFAULT_STATS);
      setAcronyms(acronymRows);

      if (
        import.meta.env.MODE !== 'test' &&
        acronymRows.length === securityPlusAcronyms.length &&
        acronymRows.every((entry) => entry.id.startsWith('sp-acr-')) &&
        typeof fetch !== 'undefined'
      ) {
        void importFromBundledPdf();
      }
    };
    void load();
  }, []);

  const availableEntries = useMemo<Acronym[]>(() => {
    return acronyms.length > 0 ? acronyms : securityPlusAcronyms;
  }, [acronyms]);

  const applyImport = useCallback(
    async (payload: { entries: Acronym[]; skippedLines: string[]; sourceLabel: string }): Promise<void> => {
      const { entries, skippedLines, sourceLabel } = payload;
      if (entries.length === 0) {
        throw new Error('No acronyms found to import.');
      }

      await commitAcronymImport(entries, importMode);
      setImportSummary(
        `Imported ${entries.length} acronyms from ${sourceLabel}. Skipped ${skippedLines.length} line${skippedLines.length === 1 ? '' : 's'}.`,
      );
      setSkippedPreview(skippedLines.slice(0, 10));
      setImportError(null);
    },
    [commitAcronymImport, importMode],
  );

  const handleImportPdf = useCallback(async (): Promise<void> => {
    if (!importFile) {
      setImportError('Choose a PDF file to import.');
      return;
    }

    setImportBusy(true);
    setImportError(null);
    setImportSummary(null);
    setSkippedPreview([]);

    try {
      const buffer = await importFile.arrayBuffer();
      const result = await importAcronymsFromPdfArrayBuffer(buffer, DEFAULT_SUBJECT_ID);
      await applyImport({ entries: result.entries, skippedLines: result.skippedLines, sourceLabel: importFile.name });
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to import PDF.');
    } finally {
      setImportBusy(false);
    }
  }, [applyImport, importFile]);

  const handleImportText = useCallback(async (): Promise<void> => {
    if (!importText.trim()) {
      setImportError('Paste acronym text to import.');
      return;
    }

    setImportBusy(true);
    setImportError(null);
    setImportSummary(null);
    setSkippedPreview([]);

    try {
      const result = parseAcronymText(importText, DEFAULT_SUBJECT_ID);
      await applyImport({ ...result, sourceLabel: 'pasted text' });
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to import text.');
    } finally {
      setImportBusy(false);
    }
  }, [applyImport, importText]);

  const handleResetDefaults = useCallback(async (): Promise<void> => {
    setImportBusy(true);
    setImportError(null);
    setImportSummary(null);
    setSkippedPreview([]);

    try {
      await commitAcronymImport(securityPlusAcronyms, 'replace');
      setImportSummary(`Reset to the built-in set (${securityPlusAcronyms.length} acronyms).`);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to reset acronyms.');
    } finally {
      setImportBusy(false);
    }
  }, [commitAcronymImport]);

  const handleClearAcronyms = useCallback(async (): Promise<void> => {
    setImportBusy(true);
    setImportError(null);
    setImportSummary(null);
    setSkippedPreview([]);

    try {
      await db.acronyms.clear();
      await refreshAcronyms();
      setCurrentEntry(null);
      setImportSummary('Cleared all acronyms from the local database.');
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to clear acronyms.');
    } finally {
      setImportBusy(false);
    }
  }, [refreshAcronyms]);

  const persistStats = useCallback(async (nextStats: HangmanStats): Promise<void> => {
    const existing = await db.userState.get('singleton');
    const payload: UserState = {
      ...(existing ?? { id: 'singleton' }),
      id: 'singleton',
      hangmanStats: nextStats,
    };
    await db.userState.put(payload);
  }, []);

  const startNewRound = useCallback((): void => {
    const next = pickRandomEntry(availableEntries, currentEntry?.id);
    setCurrentEntry(next);
    setCorrectGuesses(new Set());
    setWrongGuesses(new Set());
    setStatusMessage('');
    recordedRoundRef.current = null;

    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      setRoundId(crypto.randomUUID());
      return;
    }
    setRoundId(`round-${Date.now()}`);
  }, [availableEntries, currentEntry?.id]);

  useEffect(() => {
    if (currentEntry) {
      return;
    }
    startNewRound();
  }, [currentEntry, startNewRound]);

  const handleGuess = useCallback(
    (raw: string): void => {
      if (!currentEntry || isOver) {
        return;
      }

      const guess = normaliseGuess(raw);
      if (!guess) {
        return;
      }

      if (correctGuesses.has(guess) || wrongGuesses.has(guess)) {
        setStatusMessage(`Already guessed ${guess}.`);
        return;
      }

      if (solution.includes(guess)) {
        setCorrectGuesses((current) => {
          const next = new Set(current);
          next.add(guess);
          return next;
        });
        setStatusMessage(`Good guess: ${guess}`);
        return;
      }

      setWrongGuesses((current) => {
        const next = new Set(current);
        next.add(guess);
        return next;
      });
      setStatusMessage(`No ${guess} in the definition.`);
    },
    [correctGuesses, currentEntry, isOver, solution, wrongGuesses],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      const activeElement = document.activeElement as HTMLElement | null;
      if (activeElement && ['INPUT', 'SELECT', 'TEXTAREA'].includes(activeElement.tagName)) {
        return;
      }

      const guess = normaliseGuess(event.key);
      if (!guess) {
        return;
      }

      event.preventDefault();
      handleGuess(guess);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleGuess]);

  useEffect(() => {
    if (!currentEntry || !isOver) {
      return;
    }

    if (recordedRoundRef.current === roundId) {
      return;
    }
    recordedRoundRef.current = roundId;

    const outcome = solved ? 'win' : 'loss';
    setStats((current) => {
      const next = applyOutcome(current, outcome);
      void persistStats(next);
      return next;
    });
  }, [currentEntry, isOver, persistStats, roundId, solved]);

  if (!currentEntry) {
    return (
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold">Acronym Hangman</h1>
        <p className="text-slate-300">Loading practice set…</p>
        <button type="button" className="rounded-md border border-slate-700 bg-transparent px-3 py-2 text-sm hover:bg-slate-800" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </section>
    );
  }

  const solvedMessage = solved
    ? `Solved: ${currentEntry.definition}`
    : lost
      ? `Out of guesses. Answer: ${currentEntry.definition}`
      : null;

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Acronym Hangman</h1>
        <p className="text-slate-300">
          Guess the definition one character at a time. Use your keyboard or the on-screen buttons.
        </p>
      </header>

      <article className="space-y-4 rounded-lg border border-slate-800 bg-slate-900/40 p-4">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Practice set</h2>
            <p className="text-sm text-slate-400">
              {acronyms.length > 0 ? `${acronyms.length} acronyms loaded from your local database.` : 'Using the built-in acronym set.'}
            </p>
            {acronyms.length > 0 && acronyms.length < AUTO_IMPORT_MIN_ENTRIES ? (
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-400">Full Security+ pack:</span>
                  <button
                    type="button"
                    className="rounded-md border border-slate-700 bg-transparent px-3 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-60"
                    onClick={importFromBundledPdf}
                    disabled={autoImportBusy || importBusy}
                  >
                    {autoImportBusy ? 'Importing…' : 'Import now'}
                  </button>
                </div>
                {autoImportError ? (
                  <p className="text-xs text-red-300">
                    {autoImportError} Put the PDF at <span className="font-mono">public/acronyms/security-plus.pdf</span>{' '}
                    or use “Import from PDF” below.
                  </p>
                ) : null}
                {autoImportSummary ? <p className="text-xs text-emerald-300">{autoImportSummary}</p> : null}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="rounded-md border border-slate-700 bg-transparent px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
            onClick={() => setImportOpen((current) => !current)}
          >
            {importOpen ? 'Hide import' : 'Import acronyms'}
          </button>
        </header>

        {importOpen ? (
          <div className="space-y-4 rounded-lg border border-slate-800 bg-slate-950/40 p-4">
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-200">
              <span className="font-semibold text-slate-300">Import mode</span>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="import-mode"
                  value="replace"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                />
                Replace (clear then import)
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="import-mode"
                  value="merge"
                  checked={importMode === 'merge'}
                  onChange={() => setImportMode('merge')}
                />
                Merge (upsert by acronym)
              </label>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-300">Import from PDF</h3>
              <input
                type="file"
                accept="application/pdf"
                onChange={(event) => setImportFile(event.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                className="rounded-md bg-primary px-4 py-2 font-semibold text-white hover:bg-teal-600 disabled:opacity-60"
                onClick={handleImportPdf}
                disabled={importBusy || !importFile}
              >
                {importBusy ? 'Importing…' : 'Import PDF'}
              </button>
              <p className="text-xs text-slate-400">
                Tip: Choose `docs/CompTIA-SecurityPlus-Acronyms.pdf` to populate your local acronym table, or copy it to
                `public/acronyms/security-plus.pdf` for automatic loading on first open.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-300">Import from pasted text</h3>
              <textarea
                className="min-h-[10rem] w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-xs text-slate-100"
                placeholder="Paste lines like: AAA - Authentication, Authorization, Accounting"
                value={importText}
                onChange={(event) => setImportText(event.target.value)}
              />
              <button
                type="button"
                className="rounded-md border border-slate-700 bg-transparent px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-60"
                onClick={handleImportText}
                disabled={importBusy || importText.trim().length === 0}
              >
                {importBusy ? 'Importing…' : 'Import text'}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="rounded-md border border-slate-700 bg-transparent px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-60"
                onClick={handleResetDefaults}
                disabled={importBusy}
              >
                Reset to built-in set
              </button>
              <button
                type="button"
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60"
                onClick={handleClearAcronyms}
                disabled={importBusy}
              >
                Clear acronyms
              </button>
            </div>

            {importError ? <p className="text-sm text-red-300">{importError}</p> : null}
            {importSummary ? <p className="text-sm text-emerald-300">{importSummary}</p> : null}
            {skippedPreview.length > 0 ? (
              <div className="space-y-1 text-xs text-slate-400">
                <p className="font-semibold text-slate-300">Skipped lines (first {skippedPreview.length})</p>
                <ul className="list-disc pl-5">
                  {skippedPreview.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Acronym</p>
            <p className="text-2xl font-mono font-semibold text-teal-200">{currentEntry.acronym}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Mistakes</p>
            <p className="font-mono text-xl text-accent">
              {mistakes}/{DEFAULT_MAX_MISTAKES}
            </p>
            <p className="text-xs text-slate-400">{remaining} remaining</p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-center">
          <p className="break-words font-mono text-xl leading-relaxed tracking-wider text-slate-100">
            {maskedSolution}
          </p>
          {wrongGuessList.length > 0 ? (
            <p className="mt-2 text-sm text-slate-400">
              Wrong: <span className="font-mono text-slate-200">{wrongGuessList.join(' ')}</span>
            </p>
          ) : (
            <p className="mt-2 text-sm text-slate-400">Wrong: none yet</p>
          )}
        </div>

        <div className="grid grid-cols-7 gap-2 sm:grid-cols-9 md:grid-cols-12" aria-label="Acronym keyboard">
          {KEYBOARD_CHARS.map((char) => {
            const guessed = correctGuesses.has(char) || wrongGuesses.has(char);
            return (
              <button
                key={char}
                type="button"
                className={`px-2 py-2 text-sm font-semibold ${guessed ? 'opacity-50' : ''} rounded-md border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed`}
                onClick={() => handleGuess(char)}
                disabled={guessed || isOver}
                aria-pressed={guessed}
              >
                {char}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={startNewRound} className="rounded-md bg-primary px-4 py-2 font-semibold text-white hover:bg-teal-600">
            New round
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-md border border-slate-700 bg-transparent px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
          >
            Back to Home
          </button>
        </div>

        <div role="status" aria-live="polite" className="text-sm text-slate-300">
          {solvedMessage ?? statusMessage}
        </div>
      </article>

      <article className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
        <h2 className="text-xl font-semibold">Stats</h2>
        <div className="mt-3 grid gap-3 text-sm text-slate-200 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-md border border-slate-800 bg-slate-950 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Played</p>
            <p className="mt-1 text-lg font-semibold">{stats.played}</p>
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-950 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Wins</p>
            <p className="mt-1 text-lg font-semibold text-emerald-300">{stats.wins}</p>
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-950 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Losses</p>
            <p className="mt-1 text-lg font-semibold text-red-300">{stats.losses}</p>
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-950 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Streak</p>
            <p className="mt-1 text-lg font-semibold">{stats.currentStreak}</p>
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-950 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Best streak</p>
            <p className="mt-1 text-lg font-semibold">{stats.bestStreak}</p>
          </div>
        </div>
      </article>
    </section>
  );
};

export default Hangman;
