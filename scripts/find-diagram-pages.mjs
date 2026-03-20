/**
 * Scan the extracted Professor Messer text file and identify pages that are
 * likely to contain diagrams (sparse text = few meaningful lines per page).
 *
 * Output: a ranked list of pages by line count, plus the section heading
 * that was active at the time, so we know which lesson a page belongs to.
 *
 * Usage:  node scripts/find-diagram-pages.mjs
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const inputPath = path.resolve('docs/extracted/Professor-Messer-SY0-701-COMPTIA.clean.txt');

const headingPattern = /^\d\.[1-9]\s-\s?.+$/;
const footerPatterns = [
  /^--- PAGE \d+ ---$/,
  /^\d+$/,
  /^© 2023 Messer Studios/,
  /^https?:\/\//,
  /^ProfessorMesser\.com$/i,
  /ProfessorMesser\.com/i,
  /^Professor Messer/,
  /^Continue your journey on$/i,
  /^SY0-701 CompTIA Security\+ Training Course$/i,
  /^Free Monthly Security\+ Study Group Live Streams$/i,
  /^24 x 7 Live Chat$/i,
  /^Voucher Discounts$/i,
  /Security\+ Success Bundle/i,
  /^Contents$/,
  /^Introduction$/,
  /^The CompTIA Security\+ certification$/,
  /^How to use this book$/,
  /^Section \d\.0 - /,
];

const isFooterLine = (line) => footerPatterns.some((p) => p.test(line));

const text = await fs.readFile(inputPath, 'utf8');
const rawLines = text.split(/\r?\n/);

let currentPage = 0;
let currentSection = 'Unknown';
const pageInfo = new Map(); // pageNum -> { section, lines: [] }

for (const rawLine of rawLines) {
  const line = rawLine.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();

  const pageMatch = /^--- PAGE (\d+) ---$/.exec(line);
  if (pageMatch) {
    currentPage = Number(pageMatch[1]);
    if (!pageInfo.has(currentPage)) {
      pageInfo.set(currentPage, { section: currentSection, lines: [] });
    }
    continue;
  }

  if (!line) continue;

  if (headingPattern.test(line)) {
    currentSection = line;
    // Update the section in the current page record too
    const record = pageInfo.get(currentPage);
    if (record && record.lines.length === 0) {
      record.section = currentSection;
    }
    continue;
  }

  if (isFooterLine(line)) continue;

  const record = pageInfo.get(currentPage);
  if (record) {
    record.lines.push(line);
  }
}

// Sort pages by line count ascending (fewest lines = most likely to be a diagram)
const sorted = [...pageInfo.entries()]
  .map(([page, info]) => ({ page, section: info.section, lineCount: info.lines.length, lines: info.lines }))
  .filter((entry) => entry.page >= 10) // skip front matter
  .sort((a, b) => a.lineCount - b.lineCount);

console.log('\n=== SPARSE PAGES (likely diagrams) ===\n');
console.log('Page | Lines | Section');
console.log('-----|-------|--------');

for (const entry of sorted.slice(0, 60)) {
  const preview = entry.lines.slice(0, 2).join(' | ') || '(empty)';
  console.log(`${String(entry.page).padStart(4)} | ${String(entry.lineCount).padStart(5)} | ${entry.section}`);
  if (entry.lineCount > 0 && entry.lineCount <= 4) {
    console.log(`       Lines: ${preview}`);
  }
}

// Also print a summary by section of its sparsest page
console.log('\n\n=== SPARSEST PAGE PER SECTION ===\n');
const sectionMap = new Map();
for (const entry of sorted) {
  if (!sectionMap.has(entry.section)) {
    sectionMap.set(entry.section, entry);
  }
}

for (const [section, entry] of sectionMap) {
  if (entry.lineCount <= 8) {
    console.log(`  p.${entry.page} (${entry.lineCount} lines) — ${section}`);
  }
}
