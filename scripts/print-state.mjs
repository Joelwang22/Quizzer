#!/usr/bin/env node
import { readFile } from 'node:fs/promises';

const STATE_PATH = 'codex_state.json';

try {
  const raw = await readFile(STATE_PATH, 'utf8');
  const state = JSON.parse(raw);
  console.log(JSON.stringify(state, null, 2));
} catch (error) {
  console.error(`Unable to read ${STATE_PATH}:`, error.message);
  process.exitCode = 1;
}
