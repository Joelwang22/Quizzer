import fs from 'node:fs/promises';
import path from 'node:path';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

const isPdfTextItemLike = (value) => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  if (typeof value.str !== 'string') {
    return false;
  }

  const { transform } = value;
  if (!transform || typeof transform.length !== 'number' || transform.length < 6) {
    return false;
  }

  for (let index = 0; index < 6; index += 1) {
    if (typeof transform[index] !== 'number' || !Number.isFinite(transform[index])) {
      return false;
    }
  }

  return true;
};

const normalizeWhitespace = (value) =>
  value
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const normalizePunctuationSpacing = (value) => value.replace(/\s+([,.;:!?])/g, '$1');

const groupIntoLines = (items, tolerance = 2) => {
  const sorted = [...items].sort((a, b) => {
    if (b.y !== a.y) {
      return b.y - a.y;
    }

    return a.x - b.x;
  });

  const lines = [];
  let currentLine = [];
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

const extractPageLines = (items) => {
  const positioned = [];

  for (const item of items) {
    if (!isPdfTextItemLike(item)) {
      continue;
    }

    positioned.push({
      text: item.str,
      x: item.transform[4] ?? 0,
      y: item.transform[5] ?? 0,
    });
  }

  return groupIntoLines(positioned)
    .map((line) => normalizePunctuationSpacing(normalizeWhitespace(line.map((entry) => entry.text).join(' '))))
    .filter((line) => line.length > 0);
};

const [, , inputArg, outputArg] = process.argv;

if (!inputArg || !outputArg) {
  console.error('Usage: node scripts/extract-pdf-text.mjs <input.pdf> <output.txt>');
  process.exit(1);
}

const run = async () => {
  const inputPath = path.resolve(inputArg);
  const outputPath = path.resolve(outputArg);

  const data = new Uint8Array(await fs.readFile(inputPath));
  const loadingTask = pdfjs.getDocument({ data, disableWorker: true });
  const document = await loadingTask.promise;
  const pages = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const items = Array.isArray(content.items) ? content.items : [];
    const lines = extractPageLines(items);
    pages.push(`--- PAGE ${pageNumber} ---\n${lines.join('\n')}`);
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${pages.join('\n\n')}\n`, 'utf8');
  console.log(`Wrote ${document.numPages} pages to ${outputPath}`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
