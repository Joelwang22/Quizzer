#!/usr/bin/env node
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const SUMMARY_PLACEHOLDER = 'Summary TBD.';

const args = process.argv.slice(2);
const summary = args.length > 0 ? args.join(' ') : SUMMARY_PLACEHOLDER;

const now = new Date();
const pad = (value) => value.toString().padStart(2, '0');
const formattedTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

const entry = [
  `### ${formattedTime} (local)`,
  `**Summary:** ${summary}`,
  '**Changes:**',
  '- TBD',
  '**Decisions:**',
  '- TBD',
  '**Follow-ups:**',
  '- TBD',
  '**Commands run:**',
  '- TBD',
].join('\n');

const logPath = 'docs/CODEX_LOG.md';

await mkdir(dirname(logPath), { recursive: true });

let existing = '';
try {
  existing = await readFile(logPath, 'utf8');
} catch (error) {
  if (error.code !== 'ENOENT') {
    throw error;
  }
}

const updated = existing.trim().length > 0 ? `${entry}\n\n${existing.trim()}` : entry;
await writeFile(logPath, `${updated}\n`, 'utf8');

console.log(`Appended session stub at ${formattedTime}.`);
