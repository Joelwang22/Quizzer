import type { Acronym } from '../models';
import { createAcronymId } from './acronymImport';

interface PdfTextItemLike {
  str: string;
  transform: ArrayLike<number>;
  pageNumber?: number;
}

interface PdfTextContentLike {
  items: unknown[];
}

interface PdfPageLike {
  getTextContent: () => Promise<PdfTextContentLike>;
}

interface PdfDocumentLike {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PdfPageLike>;
}

interface PdfLoadingTaskLike {
  promise: Promise<PdfDocumentLike>;
}

interface PdfJsLike {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (options: { data: Uint8Array; disableWorker?: boolean }) => PdfLoadingTaskLike;
}

export interface AcronymPdfImportResult {
  entries: Acronym[];
  skippedLines: string[];
}

const normaliseWhitespace = (value: string): string => value.replace(/\s+/g, ' ').trim();

const acronymTokenPattern = /^[A-Za-z0-9][A-Za-z0-9/+.-]{1,24}$/;

const looksLikeAcronym = (token: string): boolean => {
  const trimmed = token.trim();
  if (trimmed.length < 2) {
    return false;
  }
  if (!acronymTokenPattern.test(trimmed)) {
    return false;
  }
  if (!/[A-Za-z]/.test(trimmed)) {
    return false;
  }

  const uppercaseCount = (trimmed.match(/[A-Z]/g) ?? []).length;
  if (uppercaseCount === 0) {
    return false;
  }

  const lowercaseCount = (trimmed.match(/[a-z]/g) ?? []).length;
  if (lowercaseCount === 0) {
    return true;
  }

  if (uppercaseCount >= 2) {
    return true;
  }

  const digitCount = (trimmed.match(/[0-9]/g) ?? []).length;
  return digitCount > 0;
};

const isPdfTextItemLike = (value: unknown): value is PdfTextItemLike => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;
  if (typeof record.str !== 'string') {
    return false;
  }

  const transformValue = record.transform;
  if (!transformValue || (typeof transformValue !== 'object' && typeof transformValue !== 'function')) {
    return false;
  }

  const lengthValue = (transformValue as { length?: unknown }).length;
  if (typeof lengthValue !== 'number' || lengthValue < 6) {
    return false;
  }

  const transform = transformValue as ArrayLike<unknown>;
  for (let index = 0; index < 6; index += 1) {
    const entry = transform[index];
    if (typeof entry !== 'number' || !Number.isFinite(entry)) {
      return false;
    }
  }

  return true;
};

type PositionedItem = { text: string; x: number; y: number };

const groupIntoLines = (items: PositionedItem[], tolerance = 2): PositionedItem[][] => {
  const sorted = [...items].sort((a, b) => {
    if (b.y !== a.y) {
      return b.y - a.y;
    }
    return a.x - b.x;
  });

  const lines: PositionedItem[][] = [];
  let currentLine: PositionedItem[] = [];
  let currentY = Number.NaN;

  for (const item of sorted) {
    if (currentLine.length === 0) {
      currentLine = [item];
      currentY = item.y;
      continue;
    }

    if (Math.abs(item.y - currentY) <= tolerance) {
      currentLine.push(item);
      continue;
    }

    lines.push(currentLine.sort((a, b) => a.x - b.x));
    currentLine = [item];
    currentY = item.y;
  }

  if (currentLine.length > 0) {
    lines.push(currentLine.sort((a, b) => a.x - b.x));
  }

  return lines;
};

const computeColumnGapThreshold = (lines: PositionedItem[][]): number => {
  const gaps: number[] = [];

  for (const line of lines) {
    const sorted = [...line].sort((a, b) => a.x - b.x);
    for (let index = 1; index < sorted.length; index += 1) {
      const previous = sorted[index - 1];
      const current = sorted[index];
      if (!previous || !current) {
        continue;
      }
      const gap = current.x - previous.x;
      if (gap > 0) {
        gaps.push(gap);
      }
    }
  }

  if (gaps.length === 0) {
    return 120;
  }

  const sortedGaps = [...gaps].sort((a, b) => a - b);
  const median = sortedGaps[Math.floor(sortedGaps.length / 2)] ?? 0;
  const maxGap = sortedGaps[sortedGaps.length - 1] ?? 0;

  return Math.max(120, (median + maxGap) / 2);
};

const splitLineIntoSegments = (items: PositionedItem[], gapThreshold: number): PositionedItem[][] => {
  const sorted = [...items].sort((a, b) => a.x - b.x);
  const segments: PositionedItem[][] = [];

  let current: PositionedItem[] = [];
  let lastX = Number.NaN;

  for (const item of sorted) {
    if (current.length === 0) {
      current = [item];
      lastX = item.x;
      continue;
    }

    if (item.x - lastX > gapThreshold) {
      segments.push(current);
      current = [item];
      lastX = item.x;
      continue;
    }

    current.push(item);
    lastX = item.x;
  }

  if (current.length > 0) {
    segments.push(current);
  }

  return segments;
};

const clusterAnchors = (xs: number[], tolerance: number): number[] => {
  const sorted = xs.filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
  if (sorted.length === 0) {
    return [];
  }

  const anchors: number[] = [];
  let clusterMin = sorted[0] ?? 0;
  let last = clusterMin;

  for (let index = 1; index < sorted.length; index += 1) {
    const value = sorted[index];
    if (value === undefined) {
      continue;
    }

    if (value - last <= tolerance) {
      last = value;
      clusterMin = Math.min(clusterMin, value);
      continue;
    }

    anchors.push(clusterMin);
    clusterMin = value;
    last = value;
  }

  anchors.push(clusterMin);
  return anchors;
};

export const extractAcronymsFromPdfTextItems = (
  textItems: PdfTextItemLike[],
  subjectId: string,
): AcronymPdfImportResult => {
  const entries: Acronym[] = [];
  const skippedLines: string[] = [];

  const usedIds = new Map<string, number>();

  const pushEntry = (acronym: string, definition: string): Acronym | null => {
    const cleanAcronym = normaliseWhitespace(acronym);
    const cleanDefinition = normaliseWhitespace(definition);
    if (!cleanAcronym) {
      return null;
    }

    const baseId = createAcronymId(subjectId, cleanAcronym);
    const nextCount = (usedIds.get(baseId) ?? 0) + 1;
    usedIds.set(baseId, nextCount);
    const id = nextCount === 1 ? baseId : `${baseId}-${nextCount}`;

    const nextEntry: Acronym = { id, subjectId, acronym: cleanAcronym, definition: cleanDefinition };
    entries.push(nextEntry);
    return nextEntry;
  };

  const itemsByPage = new Map<number, PositionedItem[]>();

  for (const item of textItems) {
    const x = item.transform[4] ?? 0;
    const y = item.transform[5] ?? 0;
    const text = item.str;
    if (!text || text.trim().length === 0) {
      continue;
    }

    const pageNumber = item.pageNumber ?? 1;
    const pageItems = itemsByPage.get(pageNumber) ?? [];
    pageItems.push({ text, x, y });
    itemsByPage.set(pageNumber, pageItems);
  }

  const pageNumbers = Array.from(itemsByPage.keys()).sort((a, b) => a - b);

  for (const pageNumber of pageNumbers) {
    const positionedItems = itemsByPage.get(pageNumber) ?? [];
    if (positionedItems.length === 0) {
      continue;
    }

    const lines = groupIntoLines(positionedItems);
    const gapThreshold = computeColumnGapThreshold(lines);

    const pageSegments = lines.map((line) => splitLineIntoSegments(line, gapThreshold));
    const anchorCandidates: number[] = [];

    for (const segments of pageSegments) {
      for (const segment of segments) {
        const first = segment[0];
        if (!first) {
          continue;
        }
        const firstText = normaliseWhitespace(first.text);
        if (firstText && looksLikeAcronym(firstText)) {
          anchorCandidates.push(first.x);
        }
      }
    }

    const anchors = clusterAnchors(anchorCandidates, 60);
    const fallbackAnchor = Math.min(...positionedItems.map((item) => item.x));
    const columnAnchors = anchors.length > 0 ? anchors : [fallbackAnchor];
    const currentByColumn = new Array<Acronym | null>(columnAnchors.length).fill(null);

    const findColumnIndex = (x: number): number => {
      let bestIndex = 0;
      let bestDistance = Math.abs(x - (columnAnchors[0] ?? x));
      for (let index = 1; index < columnAnchors.length; index += 1) {
        const anchor = columnAnchors[index];
        if (anchor === undefined) {
          continue;
        }
        const distance = Math.abs(x - anchor);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      }
      return bestIndex;
    };

    for (const segments of pageSegments) {
      let handledAny = false;
      const lineTextParts: string[] = [];

      for (const segment of segments) {
        const segmentText = normaliseWhitespace(segment.map((item) => item.text).join(' '));
        if (!segmentText) {
          continue;
        }

        lineTextParts.push(segmentText);

        const segmentMinX = segment[0]?.x ?? 0;
        const columnIndex = findColumnIndex(segmentMinX);
        const columnAnchor = columnAnchors[columnIndex] ?? segmentMinX;

        if (/acronym/i.test(segmentText) && /spelled\s+out/i.test(segmentText)) {
          currentByColumn[columnIndex] = null;
          handledAny = true;
          continue;
        }

        const firstText = normaliseWhitespace(segment[0]?.text ?? '');
        const restText = normaliseWhitespace(segment.slice(1).map((item) => item.text).join(' '));

        if (firstText && looksLikeAcronym(firstText)) {
          const next = pushEntry(firstText, restText);
          if (next) {
            currentByColumn[columnIndex] = next;
          } else {
            currentByColumn[columnIndex] = null;
          }
          handledAny = true;
          continue;
        }

        const current = currentByColumn[columnIndex];
        const continuationCandidate = segmentMinX > columnAnchor + 20;
        if (current && continuationCandidate) {
          current.definition = normaliseWhitespace(`${current.definition} ${segmentText}`);
          handledAny = true;
          continue;
        }

        skippedLines.push(segmentText);
        currentByColumn[columnIndex] = null;
      }

      if (!handledAny) {
        const combined = normaliseWhitespace(lineTextParts.join(' '));
        if (combined) {
          skippedLines.push(combined);
        }
        currentByColumn.fill(null);
      }
    }
  }

  const filteredEntries = entries.filter((entry) => entry.definition.trim().length > 0);

  return { entries: filteredEntries, skippedLines };
};

export const importAcronymsFromPdfArrayBuffer = async (
  data: ArrayBuffer,
  subjectId: string,
): Promise<AcronymPdfImportResult> => {
  const pdfjs = (await import('pdfjs-dist')) as unknown as PdfJsLike;
  const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;

  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

  const binary = new Uint8Array(data);

  const load = async (disableWorker?: boolean): Promise<AcronymPdfImportResult> => {
    const loadingTask = pdfjs.getDocument({ data: binary, disableWorker });
    const document = await loadingTask.promise;

    const allTextItems: PdfTextItemLike[] = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      const items = Array.isArray(content.items) ? content.items : [];
      for (const item of items) {
        if (!isPdfTextItemLike(item)) {
          continue;
        }
        allTextItems.push({ str: item.str, transform: item.transform, pageNumber });
      }
    }

    return extractAcronymsFromPdfTextItems(allTextItems, subjectId);
  };

  try {
    return await load(false);
  } catch (error) {
    return await load(true).catch(() => {
      throw error;
    });
  }
};
