# Cybersec Quiz

An offline-first practice app for Security+ style assessments. The project uses React, TypeScript, Vite, Dexie, and Tailwind. All data is local to the browser and can be exported/imported as JSON bundles.

## Contributor Setup
- Install dependencies with `pnpm install` (pnpm v9+).
- Use `pnpm dev` for the Vite development server, `pnpm lint` and `pnpm test` before opening pull requests.
- Data is stored in IndexedDB. The developer menu (visible only in dev builds) lets you reset the database, dump JSON, or load sample subjects.

## Authoring Workflow
- Navigate to **Question Bank** to filter, add, duplicate, or delete questions. The list supports subject/topic/type/difficulty filters and search.
- The modal editor validates MCQ and PBQ content using Zod. PBQ “order” questions provide keyboard up/down controls, “match” uses select inputs, “fill” uses plain text, and “group” accepts JSON maps.
- A dedicated **Question Editor** page allows quick switching between questions for batch edits.
- Duplicate stems with identical answers trigger warnings; submit twice to confirm.

## Import / Export
- Use **Settings → Data export** to download a JSON snapshot of `{ subjects, topics, questions, tests, attempts }`.
- Import mode options:
  - **Merge**: upserts by id and keeps existing data.
  - **Replace**: wipes tables before loading (dangerous!).
- Imports are validated with Zod; summaries and errors display before data is committed.

## PBQ Coverage
Supported PBQ types and expectations:
- `pbq_order`: strict ordering with button-based reordering.
- `pbq_match`: select inputs for matching pairs.
- `pbq_fill`: case-insensitive accepted answers.
- `pbq_group`: JSON-based bucket definitions.

## Timer & Analytics
- Enable the 30-minute countdown timer in **Settings**; time remaining persists across reloads.
- Results pages offer “Retry missed only,” generating a new in-progress test with unanswered items.
- The **Analytics** view charts overall accuracy (last test, 7-day window, all-time), per-topic accuracy with CSV export, and a test timeline.

## Testing
- Unit tests cover analytics windows and test-builder filtering. Run `pnpm test` to execute Vitest suites.
