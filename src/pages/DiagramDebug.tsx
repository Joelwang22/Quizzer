import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getLessonDiagramCrop,
  LESSON_DIAGRAM_DEBUG_OVERRIDE_EXPORT_FILE_NAME,
  loadLessonDiagramDebugOverrides,
  normalizeDiagramCropOverrides,
  saveLessonDiagramDebugOverrides,
  type DiagramCrop,
} from '../data/lessonDiagramCrops';
import {
  SECURITY_PLUS_LESSONS,
  getDiagramStorageKey,
  type DiagramSlide,
} from '../data/securityPlusLessons';

interface PdfViewport {
  width: number;
  height: number;
}

interface PdfPage {
  getViewport(params: { scale: number }): PdfViewport;
  render(params: { canvasContext: CanvasRenderingContext2D; viewport: PdfViewport }): { promise: Promise<void> };
}

interface PdfDocument {
  getPage(pageNumber: number): Promise<PdfPage>;
}

interface PdfJsModule {
  GlobalWorkerOptions: {
    workerSrc: string;
  };
  getDocument(src: string): {
    promise: Promise<PdfDocument>;
  };
}

interface DiagramDebugEntry {
  id: string;
  lessonId: string;
  lessonTitle: string;
  lessonSubtitle: string;
  lessonIndex: number;
  slideIndex: number;
  slide: DiagramSlide;
  sourceCrop: DiagramCrop | null;
}

type OverrideMap = Record<string, DiagramCrop>;
type ResizeDirection = 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
type InteractionMode = 'move' | ResizeDirection;

interface InteractionState {
  mode: InteractionMode;
  startPointerX: number;
  startPointerY: number;
  startCrop: DiagramCrop;
  boundsWidth: number;
  boundsHeight: number;
}

interface DiagramDebugCardProps {
  entry: DiagramDebugEntry;
  crop: DiagramCrop;
  hasOverride: boolean;
  onCropChange: (entryId: string, crop: DiagramCrop) => void;
  onResetOverride: (entryId: string) => void;
}

const pdfDocCache = new Map<string, PdfDocument>();

const FULL_PAGE_CROP: DiagramCrop = { x: 0, y: 0, width: 1, height: 1 };
const MIN_CROP_SIZE = 0.02;
const SOURCE_PREVIEW_WIDTH = 1200;
const DRAG_HANDLE_SIZE = 16;

const HANDLE_DIRECTIONS: ReadonlyArray<ResizeDirection> = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

const HANDLE_POSITIONS: Record<ResizeDirection, { left: string; top: string; cursor: string }> = {
  nw: { left: '0%', top: '0%', cursor: 'nwse-resize' },
  n: { left: '50%', top: '0%', cursor: 'ns-resize' },
  ne: { left: '100%', top: '0%', cursor: 'nesw-resize' },
  e: { left: '100%', top: '50%', cursor: 'ew-resize' },
  se: { left: '100%', top: '100%', cursor: 'nwse-resize' },
  s: { left: '50%', top: '100%', cursor: 'ns-resize' },
  sw: { left: '0%', top: '100%', cursor: 'nesw-resize' },
  w: { left: '0%', top: '50%', cursor: 'ew-resize' },
};

const DIAGRAM_DEBUG_ENTRIES: DiagramDebugEntry[] = SECURITY_PLUS_LESSONS.flatMap((lesson, lessonIndex) =>
  lesson.slides.flatMap((slide, slideIndex) =>
    slide.type === 'diagram'
      ? [
          {
            id: getDiagramStorageKey(lesson.id, slide),
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            lessonSubtitle: lesson.subtitle,
            lessonIndex,
            slideIndex,
            slide,
            sourceCrop: getLessonDiagramCrop(slide),
          },
        ]
      : [],
  ),
);

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

const roundCropValue = (value: number): number => Math.round(value * 10000) / 10000;

const sanitizeCrop = (crop: DiagramCrop): DiagramCrop => {
  const width = clamp(crop.width, MIN_CROP_SIZE, 1);
  const height = clamp(crop.height, MIN_CROP_SIZE, 1);
  const x = clamp(crop.x, 0, 1 - width);
  const y = clamp(crop.y, 0, 1 - height);

  return {
    x: roundCropValue(x),
    y: roundCropValue(y),
    width: roundCropValue(width),
    height: roundCropValue(height),
  };
};

const formatCropNumber = (value: number): string => value.toFixed(3);

const cropToInlineText = (crop: DiagramCrop): string =>
  `{ x: ${formatCropNumber(crop.x)}, y: ${formatCropNumber(crop.y)}, width: ${formatCropNumber(crop.width)}, height: ${formatCropNumber(crop.height)} }`;

const escapeTsString = (value: string): string => value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

const buildCropEntrySnippet = (caption: string, crop: DiagramCrop): string =>
  `'${escapeTsString(caption)}': {\n  x: ${formatCropNumber(crop.x)},\n  y: ${formatCropNumber(crop.y)},\n  width: ${formatCropNumber(crop.width)},\n  height: ${formatCropNumber(crop.height)},\n},`;

const buildCropEntryByIdSnippet = (diagramId: string, crop: DiagramCrop): string =>
  buildCropEntrySnippet(diagramId, crop);

const buildOverrideMapSnippet = (entries: DiagramDebugEntry[], overrides: OverrideMap): string => {
  const lines = entries.flatMap((entry) => {
    const crop = overrides[entry.id];
    return crop ? [buildCropEntryByIdSnippet(entry.id, crop)] : [];
  });

  return lines.length > 0 ? `{\n${lines.map((line) => `  ${line.replace(/\n/g, '\n  ')}`).join('\n')}\n}` : '{}';
};

const writeToClipboard = async (value: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
};

const DiagramDebugCard = memo(function DiagramDebugCard({
  entry,
  crop,
  hasOverride,
  onCropChange,
  onResetOverride,
}: DiagramDebugCardProps): JSX.Element {
  const cardRef = useRef<HTMLElement | null>(null);
  const sourceFrameRef = useRef<HTMLDivElement>(null);
  const sourceCanvasRef = useRef<HTMLCanvasElement>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [isAdjusting, setIsAdjusting] = useState(false);
  const interactionRef = useRef<InteractionState | null>(null);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((item) => item.isIntersecting)) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    let cancelled = false;
    setStatus('loading');
    setErrorMsg('');

    const renderSourcePage = async (): Promise<void> => {
      try {
        const pdfjsLib = (await import('pdfjs-dist')) as unknown as PdfJsModule;
        const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default as string;
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

        let pdf = pdfDocCache.get(entry.slide.src);
        if (!pdf) {
          pdf = await pdfjsLib.getDocument(entry.slide.src).promise;
          pdfDocCache.set(entry.slide.src, pdf);
        }

        if (cancelled) {
          return;
        }

        const page = await pdf.getPage(entry.slide.page);
        if (cancelled) {
          return;
        }

        const sourceCanvas = sourceCanvasRef.current;
        if (!sourceCanvas) {
          return;
        }

        const sourceCtx = sourceCanvas.getContext('2d');
        if (!sourceCtx) {
          throw new Error('Source canvas context unavailable');
        }

        const baseViewport = page.getViewport({ scale: 1 });
        const scale = SOURCE_PREVIEW_WIDTH / baseViewport.width;
        const viewport = page.getViewport({ scale });

        sourceCanvas.width = viewport.width;
        sourceCanvas.height = viewport.height;

        await page.render({ canvasContext: sourceCtx, viewport }).promise;

        if (!cancelled) {
          setStatus('ready');
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMsg(error instanceof Error ? error.message : 'Failed to render debug preview');
          setStatus('error');
        }
      }
    };

    void renderSourcePage();

    return () => {
      cancelled = true;
    };
  }, [entry.slide.page, entry.slide.src, shouldRender]);

  useEffect(() => {
    if (status !== 'ready') {
      return;
    }

    const sourceCanvas = sourceCanvasRef.current;
    const cropCanvas = cropCanvasRef.current;
    if (!sourceCanvas || !cropCanvas) {
      return;
    }

    const sourceX = sourceCanvas.width * crop.x;
    const sourceY = sourceCanvas.height * crop.y;
    const sourceWidth = sourceCanvas.width * crop.width;
    const sourceHeight = sourceCanvas.height * crop.height;

    cropCanvas.width = Math.max(1, Math.round(sourceWidth));
    cropCanvas.height = Math.max(1, Math.round(sourceHeight));

    const cropCtx = cropCanvas.getContext('2d');
    if (!cropCtx) {
      return;
    }

    cropCtx.clearRect(0, 0, cropCanvas.width, cropCanvas.height);
    cropCtx.drawImage(
      sourceCanvas,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      cropCanvas.width,
      cropCanvas.height,
    );
  }, [crop, status]);

  const setCopyFeedback = useCallback((message: string) => {
    setCopyStatus(message);
    window.setTimeout(() => setCopyStatus(''), 1800);
  }, []);

  const startInteraction = useCallback(
    (event: React.PointerEvent<HTMLElement>, mode: InteractionMode): void => {
      if (status !== 'ready') {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const bounds = sourceFrameRef.current?.getBoundingClientRect();
      if (!bounds || bounds.width <= 0 || bounds.height <= 0) {
        return;
      }

      interactionRef.current = {
        mode,
        startPointerX: event.clientX,
        startPointerY: event.clientY,
        startCrop: crop,
        boundsWidth: bounds.width,
        boundsHeight: bounds.height,
      };
      setIsAdjusting(true);

      const handlePointerMove = (moveEvent: PointerEvent): void => {
        const interaction = interactionRef.current;
        if (!interaction) {
          return;
        }

        const dx = (moveEvent.clientX - interaction.startPointerX) / interaction.boundsWidth;
        const dy = (moveEvent.clientY - interaction.startPointerY) / interaction.boundsHeight;

        let nextCrop = interaction.startCrop;

        if (interaction.mode === 'move') {
          nextCrop = sanitizeCrop({
            ...interaction.startCrop,
            x: interaction.startCrop.x + dx,
            y: interaction.startCrop.y + dy,
          });
        } else {
          let left = interaction.startCrop.x;
          let top = interaction.startCrop.y;
          let right = interaction.startCrop.x + interaction.startCrop.width;
          let bottom = interaction.startCrop.y + interaction.startCrop.height;

          if (interaction.mode.includes('w')) {
            left = clamp(interaction.startCrop.x + dx, 0, right - MIN_CROP_SIZE);
          }
          if (interaction.mode.includes('e')) {
            right = clamp(interaction.startCrop.x + interaction.startCrop.width + dx, left + MIN_CROP_SIZE, 1);
          }
          if (interaction.mode.includes('n')) {
            top = clamp(interaction.startCrop.y + dy, 0, bottom - MIN_CROP_SIZE);
          }
          if (interaction.mode.includes('s')) {
            bottom = clamp(interaction.startCrop.y + interaction.startCrop.height + dy, top + MIN_CROP_SIZE, 1);
          }

          nextCrop = sanitizeCrop({
            x: left,
            y: top,
            width: right - left,
            height: bottom - top,
          });
        }

        onCropChange(entry.id, nextCrop);
      };

      const stopInteraction = (): void => {
        interactionRef.current = null;
        setIsAdjusting(false);
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', stopInteraction);
        window.removeEventListener('pointercancel', stopInteraction);
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', stopInteraction);
      window.addEventListener('pointercancel', stopInteraction);
    },
    [crop, entry.id, onCropChange, status],
  );

  const handleNumericChange = useCallback(
    (field: keyof DiagramCrop, value: string): void => {
      const numericValue = Number(value);
      if (!Number.isFinite(numericValue)) {
        return;
      }

      onCropChange(
        entry.id,
        sanitizeCrop({
          ...crop,
          [field]: numericValue,
        }),
      );
    },
    [crop, entry.id, onCropChange],
  );

  const handleCopyCrop = useCallback(async (): Promise<void> => {
    const copied = await writeToClipboard(cropToInlineText(crop));
    setCopyFeedback(copied ? 'Copied crop object' : 'Clipboard write failed');
  }, [crop, setCopyFeedback]);

  const handleCopyEntry = useCallback(async (): Promise<void> => {
    const copied = await writeToClipboard(buildCropEntryByIdSnippet(entry.id, crop));
    setCopyFeedback(copied ? 'Copied mapping entry' : 'Clipboard write failed');
  }, [crop, entry.id, setCopyFeedback]);

  return (
    <article
      ref={cardRef}
      className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/30"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-300">
            Lesson {entry.lessonIndex + 1} - Slide {entry.slideIndex + 1}
          </p>
          <h2 className="text-lg font-semibold text-slate-100">{entry.slide.caption}</h2>
          <p className="text-sm text-slate-400">
            {entry.lessonTitle} - {entry.lessonSubtitle}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              hasOverride ? 'bg-amber-500/15 text-amber-200' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {hasOverride ? 'Local override active' : 'Using source crop'}
          </span>
          <Link
            to={`/lessons/${entry.lessonIndex}?slide=${entry.slideIndex + 1}`}
            className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
          >
            Open lesson slide
          </Link>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Source</p>
          <p className="mt-1 font-mono text-xs text-slate-300">{entry.slide.src}</p>
          <p className="mt-2 text-slate-400">PDF page {entry.slide.page}</p>
          <p className="mt-2 break-all font-mono text-[11px] text-slate-500">{entry.id}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Current crop</p>
          <p className="mt-1 font-mono text-xs leading-6 text-slate-300">
            x={formatCropNumber(crop.x)} y={formatCropNumber(crop.y)}
            <br />
            w={formatCropNumber(crop.width)} h={formatCropNumber(crop.height)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Source crop</p>
          {entry.sourceCrop ? (
            <p className="mt-1 font-mono text-xs leading-6 text-slate-300">
              x={formatCropNumber(entry.sourceCrop.x)} y={formatCropNumber(entry.sourceCrop.y)}
              <br />
              w={formatCropNumber(entry.sourceCrop.width)} h={formatCropNumber(entry.sourceCrop.height)}
            </p>
          ) : (
            <p className="mt-1 text-rose-300">No source crop entry</p>
          )}
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Status</p>
          <p className="mt-1 text-slate-300">
            {status === 'idle' ? 'Waiting to enter viewport' : null}
            {status === 'loading' ? 'Rendering PDF previews' : null}
            {status === 'ready' ? (isAdjusting ? 'Dragging crop box' : 'Rendered') : null}
            {status === 'error' ? `Error: ${errorMsg}` : null}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Edit controls</p>
            <p className="mt-1 text-sm text-slate-400">
              Drag inside the crop box to move it. Drag the handles to resize it. Changes auto-save locally; use
              export/import if you need the same crop set in another browser.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onCropChange(entry.id, FULL_PAGE_CROP)}
              className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
            >
              Full page
            </button>
            <button
              type="button"
              onClick={() => onResetOverride(entry.id)}
              className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
            >
              {entry.sourceCrop ? 'Reset to source crop' : 'Clear local override'}
            </button>
            <button
              type="button"
              onClick={() => void handleCopyCrop()}
              className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
            >
              Copy crop
            </button>
            <button
              type="button"
              onClick={() => void handleCopyEntry()}
              className="rounded-md border border-amber-500/60 px-3 py-2 text-sm text-amber-100 hover:bg-amber-500/10"
            >
              Copy mapping entry
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {(['x', 'y', 'width', 'height'] as const).map((field) => (
            <label key={field} className="space-y-2">
              <span className="text-xs uppercase tracking-[0.14em] text-slate-500">{field}</span>
              <input
                type="number"
                step="0.001"
                min="0"
                max="1"
                value={crop[field]}
                onChange={(event) => handleNumericChange(field, event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-amber-400"
              />
            </label>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <span>Minimum crop size: {formatCropNumber(MIN_CROP_SIZE)} on each axis</span>
          {copyStatus ? <span className="text-amber-300">{copyStatus}</span> : <span>Crop values use normalized PDF-page coordinates</span>}
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Source page with editable crop box
          </p>
          <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70 p-2">
            <div ref={sourceFrameRef} className="relative">
              <canvas
                ref={sourceCanvasRef}
                className={`block w-full rounded-lg ${status === 'ready' ? '' : 'pointer-events-none opacity-0'}`}
              />
              {status === 'ready' ? (
                <div
                  className={`absolute border-2 border-amber-400 bg-amber-400/10 shadow-[0_0_0_9999px_rgba(2,6,23,0.45)] ${
                    isAdjusting ? 'cursor-grabbing' : 'cursor-grab'
                  }`}
                  style={{
                    left: `${crop.x * 100}%`,
                    top: `${crop.y * 100}%`,
                    width: `${crop.width * 100}%`,
                    height: `${crop.height * 100}%`,
                  }}
                  onPointerDown={(event) => startInteraction(event, 'move')}
                >
                  <div className="pointer-events-none absolute inset-0 border border-white/40" />
                  <div className="pointer-events-none absolute left-2 top-2 rounded bg-slate-950/85 px-2 py-1 text-[11px] font-semibold text-amber-100">
                    {formatCropNumber(crop.x)}, {formatCropNumber(crop.y)} / {formatCropNumber(crop.width)} x{' '}
                    {formatCropNumber(crop.height)}
                  </div>
                  {HANDLE_DIRECTIONS.map((direction) => {
                    const handle = HANDLE_POSITIONS[direction];
                    return (
                      <button
                        key={direction}
                        type="button"
                        aria-label={`Resize crop ${direction}`}
                        className="absolute rounded-full border border-white/70 bg-amber-300 shadow"
                        style={{
                          left: handle.left,
                          top: handle.top,
                          width: `${DRAG_HANDLE_SIZE}px`,
                          height: `${DRAG_HANDLE_SIZE}px`,
                          transform: 'translate(-50%, -50%)',
                          cursor: handle.cursor,
                        }}
                        onPointerDown={(event) => startInteraction(event, direction)}
                      />
                    );
                  })}
                </div>
              ) : null}
            </div>
            {status !== 'ready' ? (
              <div className="absolute inset-2 flex items-center justify-center rounded-lg bg-slate-950/80 text-sm text-slate-500">
                {status === 'error' ? `Could not render source page: ${errorMsg}` : 'Render the card by scrolling it into view'}
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Cropped output</p>
          <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70 p-2">
            <canvas
              ref={cropCanvasRef}
              className={`block w-full rounded-lg ${status === 'ready' ? '' : 'pointer-events-none opacity-0'}`}
            />
            {status !== 'ready' ? (
              <div className="absolute inset-2 flex items-center justify-center rounded-lg bg-slate-950/80 text-sm text-slate-500">
                {status === 'error' ? `Could not render crop: ${errorMsg}` : 'Waiting for PDF render'}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
});

const DiagramDebug = (): JSX.Element => {
  const [query, setQuery] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [overrides, setOverrides] = useState<OverrideMap>(() => loadLessonDiagramDebugOverrides());

  useEffect(() => {
    saveLessonDiagramDebugOverrides(overrides);
  }, [overrides]);

  const filteredEntries = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return DIAGRAM_DEBUG_ENTRIES;
    }

    return DIAGRAM_DEBUG_ENTRIES.filter((entry) =>
      [
        entry.slide.caption,
        entry.lessonTitle,
        entry.lessonSubtitle,
        entry.lessonId,
        String(entry.lessonIndex + 1),
        String(entry.slideIndex + 1),
      ].some((value) => value.toLowerCase().includes(normalized)),
    );
  }, [query]);

  const overrideCount = Object.keys(overrides).length;

  const setPageCopyFeedback = useCallback((message: string) => {
    setCopyStatus(message);
    window.setTimeout(() => setCopyStatus(''), 2000);
  }, []);

  const handleCropChange = useCallback((entryId: string, crop: DiagramCrop): void => {
    const nextCrop = sanitizeCrop(crop);
    setOverrides((current) => ({
      ...current,
      [entryId]: nextCrop,
    }));
  }, []);

  const handleResetOverride = useCallback((entryId: string): void => {
    setOverrides((current) => {
      const next = { ...current };
      delete next[entryId];
      return next;
    });
  }, []);

  const handleClearAllOverrides = useCallback((): void => {
    setOverrides({});
  }, []);

  const handleCopyOverrideMap = useCallback(async (): Promise<void> => {
    const copied = await writeToClipboard(buildOverrideMapSnippet(DIAGRAM_DEBUG_ENTRIES, overrides));
    setPageCopyFeedback(copied ? 'Copied override map' : 'Clipboard write failed');
  }, [overrides, setPageCopyFeedback]);

  const handleExportOverrides = useCallback((): void => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      overrides: normalizeDiagramCropOverrides(overrides),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = LESSON_DIAGRAM_DEBUG_OVERRIDE_EXPORT_FILE_NAME;
    anchor.click();
    window.URL.revokeObjectURL(url);
    setPageCopyFeedback('Downloaded overrides JSON');
  }, [overrides, setPageCopyFeedback]);

  const handleImportOverrides = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      try {
        const parsed = JSON.parse(await file.text()) as unknown;
        const importedOverrides = normalizeDiagramCropOverrides(parsed);
        setOverrides(importedOverrides);
        setPageCopyFeedback(`Imported ${Object.keys(importedOverrides).length} overrides`);
      } catch {
        setPageCopyFeedback('Import failed');
      } finally {
        event.target.value = '';
      }
    },
    [setPageCopyFeedback],
  );

  return (
    <section className="mx-auto w-full max-w-7xl space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">Dev Only</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-100">Lesson Diagram Inspector</h1>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-slate-400">
          Use this page to tune crop boxes visually. Drag the overlay on the source PDF page, compare it with the
          cropped output, and copy the resulting mapping back into the crop source file when the slice looks right.
          Browser storage is local to one browser profile; export the JSON file if you want to move crops elsewhere.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <label className="flex min-w-[18rem] flex-1 items-center rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
            <span className="mr-3 shrink-0 text-slate-500">Filter</span>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by lesson, caption, or slide"
              className="w-full bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
            />
          </label>
          <span className="rounded-full bg-slate-800 px-3 py-2 text-sm text-slate-300">
            {overrideCount} local override{overrideCount === 1 ? '' : 's'}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={(event) => void handleImportOverrides(event)}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => void handleCopyOverrideMap()}
            className="rounded-md border border-amber-500/60 px-3 py-2 text-sm text-amber-100 hover:bg-amber-500/10"
          >
            Copy override map
          </button>
          <button
            type="button"
            onClick={handleExportOverrides}
            className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            Export overrides JSON
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            Import overrides JSON
          </button>
          <button
            type="button"
            onClick={handleClearAllOverrides}
            className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            Clear all overrides
          </button>
          <span className="text-sm text-slate-400">
            Showing {filteredEntries.length} of {DIAGRAM_DEBUG_ENTRIES.length} diagram slides
          </span>
          {copyStatus ? <span className="text-sm text-amber-300">{copyStatus}</span> : null}
        </div>
      </div>

      <div className="space-y-5">
        {filteredEntries.map((entry) => {
          const crop = overrides[entry.id] ?? entry.sourceCrop ?? FULL_PAGE_CROP;

          return (
            <DiagramDebugCard
              key={entry.id}
              entry={entry}
              crop={crop}
              hasOverride={Boolean(overrides[entry.id])}
              onCropChange={handleCropChange}
              onResetOverride={handleResetOverride}
            />
          );
        })}
      </div>
    </section>
  );
};

export default DiagramDebug;
