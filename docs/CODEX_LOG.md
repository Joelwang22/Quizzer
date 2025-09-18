### 2025-09-19 01:16 (local)
**Summary:** Wrapped up Milestone A core flows, implementing builder, grader, and runner wiring across Dexie-backed sessions. Established analytics helpers and updated tooling ahead of the next authoring/analytics UI work.
**Changes:**
- Added subject/topic-aware selection with unseen/not-mastered support (`src/logic/testBuilder.ts`).
- Expanded grading for MCQ/PBQ and persisted richer attempt/test state (`src/logic/grader.ts`, `src/models/test.ts`).
- Connected Create Test and Test Runner flows with keyboard-first UI components (`src/pages/CreateTest.tsx`, `src/pages/TestRunner.tsx`, `src/components/MCQQuestion.tsx`, `src/components/PBQQuestion.tsx`).
- Improved results/resume behaviour and analytics helpers with coverage (`src/pages/Home.tsx`, `src/pages/Results.tsx`, `src/logic/__tests__/analytics.test.ts`).
**Decisions:**
- Prioritised Milestone A features to unblock downstream authoring and analytics UI milestones.
- Deferred test/build verification until dependencies can be installed outside the sandbox.
**Follow-ups:**
- Question Editor CRUD + validation
- Import/Export JSON (merge/replace)
- Analytics UI (charts + summaries)
- Retry missed only, timer, keyboard help modal
- Dexie migration v2 (difficulty + masteryThreshold)
**Commands run:**
- `pnpm test` (fails in sandbox: missing deps)
- `pnpm build` (fails in sandbox: missing dev packages)
