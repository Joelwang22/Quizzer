import type { ReactNode, TdHTMLAttributes } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../db';
import type { Acronym, Subject } from '../models';

const PAGE_SIZE = 25;

interface AcronymDraft {
  id?: string;
  subjectId: string;
  acronym: string;
  definition: string;
}

const toSubjectLabel = (subject: Subject): string => `${subject.name} (${subject.id})`;

const normaliseAcronymValue = (value: string): string => value.trim().toUpperCase();

const makeNewId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `acr-${crypto.randomUUID()}`;
  }
  return `acr-${Date.now()}`;
};

const Acronyms = (): JSX.Element => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [acronyms, setAcronyms] = useState<Acronym[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [subjectFilter, setSubjectFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(0);

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [draft, setDraft] = useState<AcronymDraft | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [deleteTarget, setDeleteTarget] = useState<Acronym | null>(null);

  const refreshData = useCallback(async (): Promise<void> => {
    setLoading(true);
    setLoadError(null);
    try {
      const [subjectRows, acronymRows] = await Promise.all([db.subjects.toArray(), db.acronyms.toArray()]);
      setSubjects(subjectRows);
      setAcronyms(acronymRows);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to load acronyms.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshData();
  }, [refreshData]);

  const subjectLabelById = useMemo(() => {
    const map = new Map<string, string>();
    subjects.forEach((subject) => {
      map.set(subject.id, subject.name);
    });
    return map;
  }, [subjects]);

  const filteredAcronyms = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const results = acronyms.filter((entry) => {
      if (subjectFilter && entry.subjectId !== subjectFilter) {
        return false;
      }
      if (normalizedSearch) {
        const haystack = `${entry.acronym} ${entry.definition}`.toLowerCase();
        if (!haystack.includes(normalizedSearch)) {
          return false;
        }
      }
      return true;
    });

    results.sort((a, b) => {
      const acronymDelta = a.acronym.localeCompare(b.acronym);
      if (acronymDelta !== 0) {
        return acronymDelta;
      }
      const subjectDelta = a.subjectId.localeCompare(b.subjectId);
      if (subjectDelta !== 0) {
        return subjectDelta;
      }
      return a.id.localeCompare(b.id);
    });

    return results;
  }, [acronyms, searchTerm, subjectFilter]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm, subjectFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredAcronyms.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageSlice = filteredAcronyms.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const subjectOptions = useMemo(() => {
    return subjects
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((subject) => ({ value: subject.id, label: toSubjectLabel(subject) }));
  }, [subjects]);

  const openCreateForm = (): void => {
    const defaultSubjectId = subjectFilter || subjects[0]?.id || 'security-plus';
    setDraft({
      subjectId: defaultSubjectId,
      acronym: '',
      definition: '',
    });
    setFormError(null);
    setIsFormOpen(true);
  };

  const openEditForm = (entry: Acronym): void => {
    setDraft({ ...entry });
    setFormError(null);
    setIsFormOpen(true);
  };

  const closeForm = (): void => {
    setIsFormOpen(false);
    setDraft(null);
    setFormError(null);
  };

  const saveDraft = async (): Promise<void> => {
    if (!draft) {
      return;
    }

    const subjectId = draft.subjectId.trim();
    if (!subjectId) {
      setFormError('Choose a subject.');
      return;
    }

    const acronymValue = normaliseAcronymValue(draft.acronym);
    if (!acronymValue) {
      setFormError('Enter an acronym.');
      return;
    }

    const definitionValue = draft.definition.trim();
    if (!definitionValue) {
      setFormError('Enter a definition.');
      return;
    }

    const duplicate = acronyms.find(
      (entry) =>
        entry.id !== draft.id &&
        entry.subjectId === subjectId &&
        normaliseAcronymValue(entry.acronym) === acronymValue,
    );
    if (duplicate) {
      setFormError(`"${acronymValue}" already exists for this subject.`);
      return;
    }

    setSubmitting(true);
    try {
      const id = draft.id ?? makeNewId();
      await db.acronyms.put({
        id,
        subjectId,
        acronym: acronymValue,
        definition: definitionValue,
      });
      await refreshData();
      closeForm();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to save acronym.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!deleteTarget) {
      return;
    }

    await db.acronyms.delete(deleteTarget.id);
    setDeleteTarget(null);
    await refreshData();
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Acronyms</h1>
          <p className="text-sm text-slate-300">View and edit the acronym list saved in your local database.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="rounded-md border border-slate-700 bg-transparent px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
            onClick={() => navigate('/hangman')}
          >
            Back to Hangman
          </button>
          <button
            type="button"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600"
            onClick={openCreateForm}
            disabled={loading}
          >
            Add acronym
          </button>
        </div>
      </header>

      {loadError ? <p className="text-sm text-red-300">{loadError}</p> : null}

      <article className="space-y-4 rounded-lg border border-slate-800 bg-slate-900/40 p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <label htmlFor="acronym-subject-filter" className="text-sm font-medium text-slate-300">
                Subject
              </label>
              <select
                id="acronym-subject-filter"
                className="w-64 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                value={subjectFilter}
                onChange={(event) => setSubjectFilter(event.target.value)}
                disabled={loading}
              >
                <option value="">All</option>
                {subjectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="acronym-search" className="text-sm font-medium text-slate-300">
                Search
              </label>
              <input
                id="acronym-search"
                className="w-72 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Acronym or definition"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
            <span>
              Showing {filteredAcronyms.length} of {acronyms.length}
            </span>
            <button
              type="button"
              className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
              onClick={refreshData}
              disabled={loading}
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-950/60">
              <tr>
                <HeaderCell>Acronym</HeaderCell>
                <HeaderCell>Definition</HeaderCell>
                <HeaderCell className="w-48">Subject</HeaderCell>
                <HeaderCell className="w-36">Actions</HeaderCell>
              </tr>
            </thead>
            <tbody>
              {pageSlice.map((entry) => (
                <tr key={entry.id} className="border-t border-slate-800">
                  <TableCell className="font-mono font-semibold text-teal-200">{entry.acronym}</TableCell>
                  <TableCell className="max-w-xl break-words text-slate-100">{entry.definition}</TableCell>
                  <TableCell className="text-slate-300">
                    {subjectLabelById.get(entry.subjectId) ?? entry.subjectId}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <button className="text-teal-300" onClick={() => openEditForm(entry)} disabled={loading}>
                        Edit
                      </button>
                      <button className="text-red-400" onClick={() => setDeleteTarget(entry)} disabled={loading}>
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </tr>
              ))}
              {loading ? (
                <tr>
                  <TableCell colSpan={4} className="text-center text-sm text-slate-400">
                    Loading acronyms...
                  </TableCell>
                </tr>
              ) : null}
              {!loading && pageSlice.length === 0 ? (
                <tr>
                  <TableCell colSpan={4} className="text-center text-sm text-slate-400">
                    No acronyms match the current filters.
                  </TableCell>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="text-slate-400">
            Page {safePage + 1} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-md border border-slate-700 px-3 py-1 hover:bg-slate-800 disabled:opacity-50"
              onClick={() => setPage((current) => Math.max(0, current - 1))}
              disabled={safePage <= 0}
            >
              Prev
            </button>
            <button
              type="button"
              className="rounded-md border border-slate-700 px-3 py-1 hover:bg-slate-800 disabled:opacity-50"
              onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
              disabled={safePage >= totalPages - 1}
            >
              Next
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          Tip: Use the Hangman page for bulk imports (PDF/text) and auto-loading the full Security+ acronym pack.
        </p>
      </article>

      {isFormOpen && draft ? (
        <Modal title={draft.id ? 'Edit acronym' : 'Add acronym'} onClose={closeForm}>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <label htmlFor="acronym-subject" className="text-sm font-medium text-slate-300">
                  Subject
                </label>
                <select
                  id="acronym-subject"
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                  value={draft.subjectId}
                  onChange={(event) => {
                    setDraft((current) => (current ? { ...current, subjectId: event.target.value } : current));
                  }}
                  disabled={submitting}
                >
                  {subjectOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label htmlFor="acronym-code" className="text-sm font-medium text-slate-300">
                  Acronym
                </label>
                <input
                  id="acronym-code"
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-mono"
                  value={draft.acronym}
                  onChange={(event) => {
                    setDraft((current) => (current ? { ...current, acronym: event.target.value } : current));
                  }}
                  placeholder="e.g., CIA, S/MIME, NAC"
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="acronym-definition" className="text-sm font-medium text-slate-300">
                Definition
              </label>
              <textarea
                id="acronym-definition"
                className="min-h-[120px] w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                value={draft.definition}
                onChange={(event) => {
                  setDraft((current) => (current ? { ...current, definition: event.target.value } : current));
                }}
                placeholder="e.g., Confidentiality Integrity Availability"
                disabled={submitting}
              />
            </div>

            {formError ? <p className="text-sm text-red-300">{formError}</p> : null}

            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-700 px-3 py-2 text-sm"
                onClick={closeForm}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600 disabled:opacity-60"
                onClick={saveDraft}
                disabled={submitting}
              >
                {submitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      ) : null}

      {deleteTarget ? (
        <Modal title="Delete acronym" onClose={() => setDeleteTarget(null)}>
          <div className="space-y-4">
            <p className="text-sm text-slate-300">
              Delete <span className="font-mono text-slate-100">{deleteTarget.acronym}</span>?
            </p>
            <p className="text-xs text-slate-400">This removes it from your local database.</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-700 px-3 py-1"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button type="button" className="rounded-md bg-red-500 px-3 py-1 text-white" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </Modal>
      ) : null}
    </section>
  );
};

const HeaderCell = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <th className={`px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 ${className}`}>
    {children}
  </th>
);

type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

const TableCell = ({ className = '', children, ...rest }: TableCellProps): JSX.Element => (
  <td {...rest} className={['px-3 py-2 align-top text-sm text-slate-200', className].filter(Boolean).join(' ')}>
    {children}
  </td>
);

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

const Modal = ({ title, children, onClose }: ModalProps): JSX.Element => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
    <div className="w-full max-w-3xl rounded-lg border border-slate-800 bg-slate-950 shadow-xl">
      <header className="flex items-center justify-between border-b border-slate-800 p-4">
        <h2 className="text-lg font-semibold text-slate-200">{title}</h2>
        <button className="text-slate-400" onClick={onClose}>
          Close
        </button>
      </header>
      <div className="p-4">{children}</div>
    </div>
  </div>
);

export default Acronyms;
