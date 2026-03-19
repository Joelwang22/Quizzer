### 2026-03-19 09:08 (local)
**Summary:** Fixed the generated `5.6 - User Training` lesson pulling in table-of-contents numbers and front-matter text from the Professor Messer PDF extraction.
**Changes:**
- Tightened the Messer lesson generator so real lesson parsing starts at content pages instead of the early table-of-contents pages (`scripts/generate-security-plus-lessons.mjs`).
- Filtered standalone page-number lines and merged promotional footer lines such as `ProfessorMesser.com` / `Security+ Success Bundle` from generated lesson content (`scripts/generate-security-plus-lessons.mjs`).
- Regenerated the lesson dataset so `5.6 - User Training` now contains only the real user-training material (`src/data/securityPlusLessons.generated.ts`).
**Commands run:**
- `node scripts/generate-security-plus-lessons.mjs`
- `pnpm test -- src/data/__tests__/securityPlusLessons.test.ts`

### 2026-03-19 09:03 (local)
**Summary:** Added Playwright-based browser verification for the lesson system and ran a full Chromium pass across every lesson and slide.
**Changes:**
- Added Playwright to the repo with project scripts, browser config, and output ignores for reports and test artifacts (`package.json`, `playwright.config.ts`, `.gitignore`).
- Added an end-to-end lesson integrity spec that opens every lesson, walks every slide, and fails on browser errors, console errors, empty slide content, or obvious broken render markers like `undefined`, `null`, `NaN`, or `[object Object]` (`e2e/lessons.spec.ts`).
- Updated Vitest discovery to exclude `e2e/` so Playwright specs are only executed by the Playwright runner (`vite.config.ts`).
**Commands run:**
- `pnpm add -D @playwright/test`
- `pnpm exec playwright install chromium`
- `pnpm test:e2e -- e2e/lessons.spec.ts`
- `pnpm test`
- `pnpm lint`
- `pnpm build`

### 2026-03-19 08:53 (local)
**Summary:** Replaced the Security+ lesson summaries with a Professor Messer course-notes lesson path and added a supplemental 4.9 investigation-data lesson.
**Changes:**
- Added a column-aware PDF extraction path for two-column study-note PDFs and regenerated a cleaner Professor Messer text extraction for lesson generation (`scripts/extract-pdf-columns.mjs`, `docs/extracted/Professor-Messer-SY0-701-COMPTIA.clean.txt`).
- Added a lesson generator that turns the cleaned Professor Messer notes into a large static lesson dataset and refactored the lesson module into a stable wrapper plus generated content (`scripts/generate-security-plus-lessons.mjs`, `src/data/securityPlusLessons.generated.ts`, `src/data/securityPlusLessons.ts`).
- Replaced the prior 19-lesson objective summary with 119 Professor Messer section lessons (`1.1` through `5.6`) and appended a supplemental `4.9 - Data Sources to Support Investigations` lesson sourced from the other local Security+ materials.
- Updated the lesson tests to validate the Messer coverage shape, `5.5`/`5.6`, and the supplemental `4.9` coverage (`src/data/__tests__/securityPlusLessons.test.ts`).
**Commands run:**
- `node scripts/extract-pdf-columns.mjs docs/Professor-Messer-SY0-701-COMPTIA.pdf docs/extracted/Professor-Messer-SY0-701-COMPTIA.clean.txt`
- `node scripts/generate-security-plus-lessons.mjs`
- `pnpm test -- src/data/__tests__/securityPlusLessons.test.ts`
- `pnpm test`
- `pnpm build`
- `pnpm lint`

### 2026-03-19 08:33 (local)
**Summary:** Expanded the Security+ guided lessons from a short summary path into a full SY0-701 objective-aligned course sourced from the local PDFs.
**Changes:**
- Added a reusable PDF-to-text extraction script and generated searchable text copies of the main Security+ study PDFs under `docs/extracted/` so lesson expansion could be mapped against the source material (`scripts/extract-pdf-text.mjs`, `docs/extracted/*`).
- Rewrote the lesson dataset from 5 broad lessons to 19 objective-aligned lessons covering objectives `1.1` through `5.4`, while keeping the existing lesson viewer/search APIs intact (`src/data/securityPlusLessons.ts`).
- Updated lesson tests to validate objective coverage and broader topic searchability (including late-domain topics like `802.1X`, `SPF/DKIM/DMARC`, and right-to-audit clauses) (`src/data/__tests__/securityPlusLessons.test.ts`).
- Ignored the scratch `temp/` directory in ESLint so repo linting no longer fails on ad hoc extraction scripts outside the app code (`eslint.config.js`).
**Commands run:**
- `node scripts/extract-pdf-text.mjs docs/CompTIA-Security-SY0-701.pdf docs/extracted/CompTIA-Security-SY0-701.txt`
- `node scripts/extract-pdf-text.mjs docs/Professor-Messer-SY0-701-COMPTIA.pdf docs/extracted/Professor-Messer-SY0-701-COMPTIA.txt`
- `node scripts/extract-pdf-text.mjs docs/Official-Security+-Student-Guide.pdf docs/extracted/Official-Security-Student-Guide.txt`
- `pnpm test -- src/data/__tests__/securityPlusLessons.test.ts`
- `pnpm test`
- `pnpm build`
- `pnpm lint`

### 2026-03-18 05:47 (local)
**Summary:** Ported the newer quiz runner navigation/review UX from GEX1015 into Quizzer.
**Changes:**
- Added a centered Test Runner layout with a collapsible question navigator that expands into the desktop right gutter and falls back to a modal on smaller screens (`src/pages/TestRunner.tsx`).
- Added review-screen flow, answered/marked question tracking, progress summary stats, and unsaved-answer guards before navigation (`src/pages/TestRunner.tsx`, `src/components/ProgressBar.tsx`).
- Added component coverage for the upgraded progress summary (`src/components/__tests__/ProgressBar.test.tsx`).
**Commands run:**
- `pnpm test`
- `pnpm exec eslint src\pages\TestRunner.tsx src\components\ProgressBar.tsx src\components\__tests__\ProgressBar.test.tsx`
- `pnpm build`

### 2025-12-20 17:17 (local)
**Summary:** Split “Option A/B/C/D …” sentences onto their own lines in the Explanation panel.
**Changes:**
- Updated explanation formatting to add line breaks before `Option X` (and avoided breaking after `Correct Answer:`) (`src/logic/formatExplanation.ts`).
- Added/updated formatter unit tests (`src/logic/__tests__/formatExplanation.test.ts`).
**Commands run:**
- `pnpm test`
- `pnpm lint`
- `pnpm build`

### 2025-12-20 16:37 (local)
**Summary:** Formatted explanations to add a new line per option after submitting an answer.
**Changes:**
- Added an explanation formatter that inserts line breaks before option tokens (A./(A)/A:) when multiple options are present (`src/logic/formatExplanation.ts`).
- Rendered explanations with preserved newlines in the Test Runner (`src/pages/TestRunner.tsx`).
- Added unit coverage for explanation formatting (`src/logic/__tests__/formatExplanation.test.ts`).
**Commands run:**
- `pnpm test`
- `pnpm lint`
- `pnpm build`

### 2025-12-20 13:10 (local)
**Summary:** Added a chapter-only import scope for practice exam PDFs to avoid importing duplicated mock exam questions.
**Changes:**
- Added a `sectionScope` option (`chapters` vs `all`) to the practice exam PDF importer and defaulted the Question Bank UI to chapters-only (`src/logic/practiceExamPdfImport.ts`, `src/pages/QuestionBank.tsx`).
- Added unit coverage for chapters-only filtering (`src/logic/__tests__/practiceExamPdfImport.test.ts`).
**Commands run:**
- `pnpm test`
- `pnpm lint`
- `pnpm build`

### 2025-12-18 18:27 (local)
**Summary:** Added a one-click dedupe tool to ensure the question bank has no duplicate questions (updates tests/attempts safely).
**Changes:**
- Added content-based fingerprinting + MCQ choice-id remapping helpers (`src/logic/questionFingerprint.ts`).
- Added a dedupe planner that merges duplicate questions (topics/explanation), rewrites tests/attempts, and deletes duplicates (`src/logic/dedupeQuestionBank.ts`).
- Exposed "Deduplicate bank" from the PDF import modal so existing duplicates can be cleaned without reimporting (`src/pages/QuestionBank.tsx`).
- Added Vitest coverage for dedupe planning + choice-id remapping (`src/logic/__tests__/dedupeQuestionBank.test.ts`).
**Commands run:**
- `pnpm test`
- `pnpm lint`
- `pnpm build`

### 2025-12-18 17:45 (local)
**Summary:** Deduped imported practice exam questions across PDF sections and improved labeling for the 401-600 answer ranges.
**Changes:**
- De-duplicate identical MCQs during PDF import by fingerprint (merge topic tags, keep best explanation) and report `duplicateCount` (`src/logic/practiceExamPdfImport.ts`).
- Label answer ranges `401-500` / `501-600` as Exam Simulator #5/#6 (without changing existing import IDs) and auto-rename existing `Answers ...` topics on re-import (`src/logic/practiceExamPdfImport.ts`, `src/pages/QuestionBank.tsx`).
- Added unit coverage for cross-section de-duplication (`src/logic/__tests__/practiceExamPdfImport.test.ts`).
**Commands run:**
- `pnpm test`
- `pnpm lint`
- `pnpm build`

### 2025-12-18 17:18 (local)
**Summary:** Reduced noisy PDF import warnings caused by source numbering typos (e.g., “Explanation 62” under “Question 362”).
**Changes:**
- Defer/skip explanation-number mismatch warnings when they match common source-PDF typos (off-by-one, repeated previous number, missing leading digits) (`src/logic/practiceExamPdfImport.ts`).
- Added regression tests for the misnumbered explanation patterns (`src/logic/__tests__/practiceExamPdfImport.test.ts`).
**Commands run:**
- `pnpm test` (escalated; sandbox process spawning)
- `pnpm lint` (escalated; sandbox process spawning)
- `pnpm build` (escalated; sandbox process spawning)

### 2025-12-18 17:05 (local)
**Summary:** Hardened the practice exam PDF importer to detect question/explanation headers with missing punctuation (fixes “Explanation N encountered while parsing question N-1”).
**Changes:**
- Accept `Question 444` (missing dot) and leading punctuation like `. Question 456` when detecting new questions (`src/logic/practiceExamPdfImport.ts`).
- Accept `Explanation 444` lines that omit the trailing period after the number (`src/logic/practiceExamPdfImport.ts`).
- Added test coverage for these header variations (`src/logic/__tests__/practiceExamPdfImport.test.ts`).
**Commands run:**
- `pnpm test` (escalated; sandbox process spawning)
- `pnpm lint` (escalated; sandbox process spawning)
- `pnpm build` (escalated; sandbox process spawning)

### 2025-12-18 15:31 (local)
**Summary:** Fixed practice exam PDF import returning zero questions (handles “Explanation … Correct Answer …” on one line).
**Changes:**
- Parse the remainder of an `Explanation N.` line so merged `Correct Answer` text is captured (`src/logic/practiceExamPdfImport.ts`).
- Updated unit tests to cover the merged explanation+answer line format (`src/logic/__tests__/practiceExamPdfImport.test.ts`).
**Commands run:**
- `pnpm test` (escalated; sandbox process spawning)
- `pnpm lint` (escalated; sandbox process spawning)
- `pnpm build` (escalated; sandbox process spawning)

### 2025-12-18 15:18 (local)
**Summary:** Added a PDF importer to port the Security+ practice exam questions into IndexedDB, with progress + warnings.
**Changes:**
- Added an ExamsDigest-style practice exam PDF parser that extracts MCQs + answers into our Question model (`src/logic/practiceExamPdfImport.ts`).
- Added a Question Bank "Import PDF" modal that imports the parsed questions/topics into Dexie (`src/pages/QuestionBank.tsx`).
- Show explanations only after submitting an answer (avoids spoilers when importing explanations) (`src/components/MCQQuestion.tsx`, `src/pages/TestRunner.tsx`).
- Added unit coverage for the parser (`src/logic/__tests__/practiceExamPdfImport.test.ts`).
**Commands run:**
- `pnpm test` (escalated; sandbox process spawning)
- `pnpm lint` (escalated; sandbox process spawning)
- `pnpm build` (escalated; sandbox process spawning)

### 2025-12-18 11:26 (local)
**Summary:** Added an Acronyms CRUD page so you can view/edit the saved acronym list (used by Hangman).
**Changes:**
- Added acronyms list + create/edit/delete UI with search, subject filter, and pagination (`src/pages/Acronyms.tsx`).
- Wired routing/navigation to the acronyms manager (`src/App.tsx`, `src/pages/index.ts`, `src/pages/Home.tsx`, `src/pages/Hangman.tsx`).
**Commands run:**
- `pnpm test`
- `pnpm lint`
- `pnpm build`

### 2025-12-18 10:59 (local)
**Summary:** Preserved word spacing in Acronym Hangman masked answers so multi-word definitions show visible gaps.
**Changes:**
- Preserved whitespace when rendering the masked solution (`src/pages/Hangman.tsx`).
**Commands run:**
- `pnpm test`
- `pnpm lint`
- `pnpm build`

### 2025-12-17 01:26 (local)
**Summary:** Fixed Hangman PDF acronym import so multi-page, multi-column tables parse the full Security+ list (resolves the “Parsed 34 acronyms” failure).
**Changes:**
- Made the PDF parser page-aware and column-aware (split lines into multiple table segments/columns instead of a single left/right split) (`src/logic/acronymPdfImport.ts`).
- Added coverage for multi-page + multi-column extraction (`src/logic/__tests__/acronymPdfImport.test.ts`).
**Commands run:**
- `pnpm test` (escalated; sandbox blocks esbuild spawn)
- `pnpm lint`
- `pnpm build` (escalated; sandbox blocks esbuild spawn)

### 2025-12-16 17:48 (local)
**Summary:** Fixed the Security+ acronym PDF importer so the full list can be reliably loaded into IndexedDB (and you can retry from the UI when it fails).
**Changes:**
- Hardened PDF parsing (support array-like transforms, retry with `disableWorker`, always feed `Uint8Array`) (`src/logic/acronymPdfImport.ts`).
- Added an explicit “Import now” control + surfaced auto-import failures on Hangman so the full pack can be loaded on demand (`src/pages/Hangman.tsx`).
**Decisions:**
- Only auto-import when the DB contains the built-in seed set (49) to avoid overwriting custom acronym lists.
**Commands run:**
- `pnpm lint`
- `pnpm test` (escalated; sandbox blocks esbuild pipes)
- `pnpm build` (escalated; sandbox blocks esbuild pipes)

### 2025-12-16 17:34 (local)
**Summary:** Tweaked Hangman auto-import threshold so the PDF loader upgrades partial acronym lists to the full set.
**Changes:**
- Raised the minimum entry threshold for skipping auto-import (`src/pages/Hangman.tsx`).

### 2025-12-16 17:33 (local)
**Summary:** Fixed the bundled PDF URL construction to respect Vite `BASE_URL` without relying on `new URL()` with a relative base.
**Changes:**
- Switched the Hangman auto-import PDF path to `${import.meta.env.BASE_URL}acronyms/security-plus.pdf` (`src/pages/Hangman.tsx`).
**Commands run:**
- `pnpm lint`

### 2025-12-16 17:30 (local)
**Summary:** Auto-loaded the full Security+ acronym list into IndexedDB from the local CompTIA PDF, without requiring manual import clicks.
**Changes:**
- Added a PDF table parser for acronyms (`src/logic/acronymPdfImport.ts`) with unit coverage (`src/logic/__tests__/acronymPdfImport.test.ts`).
- Updated Hangman to auto-import from `public/acronyms/security-plus.pdf` when the local acronym table is small, and to use the structured PDF parser for PDF imports (`src/pages/Hangman.tsx`).
- Ignored local PDF study materials by default (`.gitignore`).
**Decisions:**
- Keep the full acronym source as a local PDF asset (ignored by git) and parse it into IndexedDB to avoid committing extracted text.
**Follow-ups:**
- If you deploy to a non-root `base` path, keep using `import.meta.env.BASE_URL` for PDF fetches (already done).
**Commands run:**
- `pnpm lint`
- `pnpm test` (escalated; sandbox blocks esbuild pipes)
- `pnpm build` (escalated; sandbox blocks esbuild pipes)

### 2025-12-16 15:50 (local)
**Summary:** Fixed acronym import parsing so normal sentences no longer get mis-detected as acronym entries, and verified build/test in the current sandbox.
**Changes:**
- Tightened acronym-token heuristics to reduce false positives (`src/logic/acronymImport.ts`).
**Decisions:**
- Treat mixed-case tokens as acronyms only when they contain multiple uppercase letters or digits (e.g., `IoT`, `Wi-Fi`, `802.1X`).
**Follow-ups:**
- Improve PDF text extraction heuristics for multi-column layouts if the import misses entries.
**Commands run:**
- `pnpm lint`
- `pnpm test` (escalated; sandbox blocks esbuild pipes)
- `pnpm build` (escalated; sandbox blocks esbuild pipes)

### 2025-12-16 14:51 (local)
**Summary:** Added a standalone Acronym Hangman practice mode and linked it from the Home page.
**Changes:**
- Added acronym dataset + hangman helpers (`src/data/acronyms.ts`, `src/logic/hangman.ts`) with unit tests (`src/logic/__tests__/hangman.test.ts`).
- Added the Hangman page with local stats persisted in `userState` (`src/pages/Hangman.tsx`, `src/models/userState.ts`).
- Wired routing + a Home entry button (`src/App.tsx`, `src/pages/Home.tsx`, `src/pages/index.ts`).
**Decisions:**
- Keep Hangman separate from quiz tests; use a built-in acronym set and optional stats only.
**Follow-ups:**
- Add acronym import / custom lists (JSON) when needed.
**Commands run:**
- None

### 2025-12-16 14:39 (local)
**Summary:** Added an always-visible "Filter topics" toggle on Create Test to reduce clutter while keeping topic selection available.
**Changes:**
- Collapsed the topic checkbox list behind a toggle and added a small selection summary (`src/pages/CreateTest.tsx`).
**Decisions:**
- Default to collapsed topics to keep Create Test scannable as topic counts grow.
**Follow-ups:**
- Add topic search and “clear selected” affordances if needed.
**Commands run:**
- None

### 2025-12-16 14:34 (local)
**Summary:** Tightened Create Test subject/topic behaviour so topics are only shown when a subject is selected, and building a test requires at least one subject.
**Changes:**
- Hide topics when no subject is selected, clear stale topic selections, and disable test creation until a subject is picked (`src/pages/CreateTest.tsx`).
**Decisions:**
- Treat “no subject selected” as invalid instead of “all subjects” to reduce confusion and UI clutter as more subjects are added.
**Follow-ups:**
- Add topic search/collapse once topic counts grow.
**Commands run:**
- None

### 2025-12-16 14:27 (local)
**Summary:** Filtered Create Test topics to only show topics for the selected subject(s), and prevented stale topic selections from carrying across subject changes.
**Changes:**
- Scoped Create Test topic list to selected subjects and pruned topic selections when subjects change (`src/pages/CreateTest.tsx`).
**Decisions:**
- When no subjects are selected, show all topics (matches the “all subjects” fallback used when building a test).
**Follow-ups:**
- Consider adding search/collapse for large topic sets.
**Commands run:**
- None

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
