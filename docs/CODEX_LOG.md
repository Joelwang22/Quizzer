### 2025-09-19 23:49 (local)
**Summary:** Normalised question typings into discriminated unions, fixed authoring/editor components, and aligned analytics/test utilities so TypeScript build succeeds alongside vitest and Vite build.
**Changes:**
- Introduced canonical MCQ/PBQ union types with guards (`src/models/types.ts`) and refactored authoring flows, grader, and test runner to use safe narrowing.
- Hardened analytics helpers and fixtures for required attempt fields and updated windows/visuals (`src/logic/analytics.ts`, `src/pages/Analytics.tsx`).
- Removed manual PWA registration import in favour of plugin auto injection to avoid missing Workbox dependency during build (`src/main.tsx`, `vite.config.ts`).
**Decisions:**
- Prefer plugin auto-registration over manual `virtual:pwa-register` to keep build green without bundling extras.
- Cast question duplication payloads per discriminant rather than weakening types.
**Follow-ups:**
- Audit PWA runtime after auto registration swap to ensure offline resume still works.
- Expand analytics fixtures to cover PBQ attempts once PBQ authoring matures.
**Commands run:**
- `pnpm vitest run --pool=threads --maxWorkers=1 --minWorkers=1`
- `pnpm build`

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
