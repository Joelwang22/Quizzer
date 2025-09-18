# Repository Guidelines

## What we’re building
An offline-first quiz web app for Security+ (with room for other subjects). Supports MCQ + PBQ, topic-tagged question bank, analytics (weak topics), “Create Test” (30 Qs), random/topic-based selection, unseen/not-mastered filters, and resume-in-progress.

## Tech + tools (local only)
- React + TypeScript + Vite + Tailwind
- IndexedDB via Dexie for persistence
- React Router; lightweight state (Zustand or Context)
- Vitest + Testing Library
- PWA (service worker, manifest)
**No server, no network calls** (import/export JSON only)

## Commands (use pnpm; if missing, install with npm)
- Install: `pnpm i`
- Dev: `pnpm dev`
- Build: `pnpm build`
- Test: `pnpm test`
- Lint/format: `pnpm lint` / `pnpm format`

## Project layout (generate if missing)
/src
/db/dexie.ts # Dexie setup + schema/migrations
/models/* # TS types incl. PBQSpec
/logic/{testBuilder,grader,analytics}.ts
/store/* # testRunner, editor, analytics slices
/components/* # MCQ + PBQ UIs, ProgressBar, Timer, Charts
/pages/{Home,CreateTest,TestRunner,Results,QuestionBank,QuestionEditor,Analytics,Settings}.tsx
/public/manifest.webmanifest # PWA
/seed/seedSecurityPlus.ts # initial Qs (10 MCQ, 2 PBQ)

## Data model (IndexedDB via Dexie)
- **subjects**: { id, name }
- **topics**: { id, subjectId, name }
- **questions**: {
  id, subjectId, topicIds: string[], type: "mcq_single"|"mcq_multi"|
  "pbq_order"|"pbq_match"|"pbq_fill"|"pbq_group",
  stem, choices?, correctChoiceIds?, explanation?, difficulty?, pbqSpec?, createdAt, updatedAt
}
- **tests**: {
  id, status: "in_progress"|"completed", subjectIds, topicIds,
  selectionPolicy: { source: "all"|"unseen"|"not_mastered", types: string[] },
  questionIds, currentIndex, answers, markedForReview, timeSpentMs?, score?
}
- **attempts**: { id, questionId, testId?, submittedAt, isCorrect, chosenChoiceIds?, pbqAnswer?, subjectId, topicIds }
- **userState**: { id:"singleton", lastTestId?, bestScores? }

## Selection + mastery rules
- “Unseen” = no attempts for that question.
- “Not mastered” = < 3 lifetime correct attempts (configurable).
- Build `testBuilder.ts` to honor topic filters, type mix, and “unseen/not-mastered”.

## PBQ spec (minimum)
- `pbq_order`: order items; supports DnD **and** keyboard; strict order grading.
- `pbq_match`: pair left/right; full-credit-only for now.
- `pbq_fill`: short-text blanks; case-insensitive exact matches.
- `pbq_group`: bucket items; grade by exact target map.
All PBQs show explanation after submit.

## Accessibility & UX
- WCAG AA, labeled controls, focus rings, ARIA live feedback after Submit.
- Keyboard: 1–9 toggles options, Enter=Submit, N=Next, R=Mark for review.
- Mobile-first; clean Tailwind styling; no external fonts.

## Analytics
Implement `analytics.ts`:
- Overall accuracy (recent/all time), per-topic accuracy & attempts.
- Weak topics = lowest accuracy with ≥ 10 attempts.
- “Retry missed only” flow from Results.

## Question editing
- CRUD UI for MCQ/PBQ with validation.
- Import/export full DB as JSON (merge or replace; schema validate with errors shown).
- Duplicate warning on same stem + subject + identical answers.

## Agent guidance (please follow)
- When adding MCQ or PBQ types, update types, `grader.ts`, and `analytics.ts` tests.
- Write unit tests for `testBuilder.ts` and `analytics.ts`.
- Keep TypeScript strict; avoid `any`.
- Ask for approval before installing new packages; prefer zero deps.
- Don’t add network calls; keep everything offline.

## Definition of done
- `pnpm build` passes; `pnpm test` green; `pnpm lint` clean.
- Lighthouse ≥ 95 (PWA, accessibility, best practices) on dev build OK.
- Seed Security+ questions load on first run (idempotent).

## CI
- Workflow location: `.github/workflows/ci.yml`.
- Trigger on `push` and `pull_request` to `main`.
- Jobs: `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build` (type-check + bundle), `pnpm test -- --runInBand`.
- Cache pnpm store via `actions/cache` keyed on `pnpm-lock.yaml`. Fail fast if lint/type/test fail.

## Deployment
- **GitHub Pages**: Add deploy job after CI that runs `pnpm build`, uploads `dist` via `actions/upload-pages-artifact`, and uses `actions/deploy-pages`. Set `base` in `vite.config.ts` to `/<repo>` when publishing to subdirectory.
- **Netlify/Vercel**: Configure build command `pnpm build` and publish directory `dist`. Expose `VITE_` prefixed env vars. Enable asset compression and offline caching to leverage the PWA plugin.

## Session protocol
- On start: read the latest 1–2 entries from `docs/CODEX_LOG.md` and the current `codex_state.json`, then print a 3–5 line state summary for the session.
- On finish (after code/tests): append a new entry to `docs/CODEX_LOG.md` and update `codex_state.json` (`features`, `todos`, `lastUpdated`).
- Never rewrite or reorder old log entries; always append to the top of the log.
- If either file is missing or malformed, recreate it with sensible defaults before proceeding.
