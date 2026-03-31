### 2026-04-01 07:31 (local)
**Summary:** Finished the remaining story integration across the rest of the generated Security+ lessons, extending Northwind cutscenes and story-backed checks through the Domain 5 policy, risk, vendor, compliance, audit, and awareness content.
**Changes:**
- Added new `lessonStories` cold opens and callbacks for the remaining generated lessons: `5-1-security-policies`, `5-1-security-standards-and-procedures`, `5-1-governance-and-considerations`, `5-2-risk-management`, `5-2-risk-analysis`, `5-2-risk-strategies`, `5-2-business-impact-analysis`, `5-3-third-party-risk-assessment`, `5-3-agreement-types`, `5-4-compliance-and-privacy`, `5-5-audits-and-penetration-tests`, `5-6-security-awareness`, and `5-6-user-training` (`src/data/lessonStories.ts`).
- Added matching `lessonCheckStories` entries for those same remaining generated lessons so their in-lesson checks now use story-native setup dialogue, question stems, and post-reveal payoff lines instead of the generic lesson prompts (`src/data/lessonCheckStories.ts`).
- Re-ran the repo checks after completing the remaining lessons and confirmed the full story-data expansion still builds, lints, and passes Vitest.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- `pnpm test`

### 2026-04-01 07:22 (local)
**Summary:** Continued the next story batch through Lesson 100, extending Northwind cutscenes and story-backed checks across endpoint security, IAM, access controls, MFA, password security, automation, incident response, incident planning, digital forensics, and log analysis.
**Changes:**
- Added new `lessonStories` cold opens and callbacks for Lessons 91 through 100, covering endpoint security, identity and access management, access controls, multifactor authentication, password security, scripting and automation, incident response, incident planning, digital forensics, and log data (`src/data/lessonStories.ts`).
- Added matching `lessonCheckStories` entries for the same Lessons 91 through 100 so those in-lesson checks now use story-native setup dialogue, question stems, and post-reveal payoff lines instead of the generic lesson prompts (`src/data/lessonCheckStories.ts`).
- Re-ran the repo checks after the batch expansion and confirmed the story-data additions still build, lint, and pass Vitest. The first lint attempt hit a transient ESLint/Vite temp-file read error; the immediate rerun passed cleanly.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- `pnpm test`

### 2026-04-01 07:14 (local)
**Summary:** Continued the next story batch through Lesson 90, extending Northwind cutscenes and story-backed checks across vulnerability management, threat intelligence, penetration testing, security monitoring, firewalls, web filtering, and email security.
**Changes:**
- Added new `lessonStories` cold opens and callbacks for Lessons 81 through 90, covering vulnerability scanning, threat intelligence, penetration testing, analyzing vulnerabilities, vulnerability remediation, security monitoring, security tools, firewalls, web filtering and OS security, and email security and data monitoring (`src/data/lessonStories.ts`).
- Added matching `lessonCheckStories` entries for the same Lessons 81 through 90 so those in-lesson checks now use story-native setup dialogue, question stems, and post-reveal payoff lines instead of the generic lesson prompts (`src/data/lessonCheckStories.ts`).
- Re-ran the repo checks after the batch expansion and confirmed the story-data additions still build, lint, and pass Vitest.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- `pnpm test`

### 2026-04-01 06:57 (local)
**Summary:** Continued the next story batch through Lesson 80, extending Northwind cutscenes and story-backed checks across resiliency, recovery, secure baselines, hardening targets, wireless/mobile controls, application security, and asset management.
**Changes:**
- Added new `lessonStories` cold opens and callbacks for Lessons 71 through 80, covering resiliency, site resiliency, recovery testing and backups, power resiliency, secure baselines, hardening targets, securing wireless and mobile, wireless security settings, application security, and asset management (`src/data/lessonStories.ts`).
- Added matching `lessonCheckStories` entries for the same Lessons 71 through 80 so those in-lesson checks now use story-native setup dialogue, question stems, and post-reveal payoff lines instead of the generic lesson prompts (`src/data/lessonCheckStories.ts`).
- Re-ran the repo checks after the batch expansion and confirmed the story-data additions still build, lint, and pass Vitest.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- `pnpm test`

### 2026-04-01 06:47 (local)
**Summary:** Continued the next story batch through Lesson 70, extending Northwind cutscenes and story-backed checks across infrastructure considerations, secure network design, network security controls, and the opening data-protection lessons in Domain 3.
**Changes:**
- Added new `lessonStories` cold opens and callbacks for Lessons 61 through 70, covering infrastructure considerations, secure infrastructures, intrusion prevention, network appliances, firewall types, port security and 802.1X, secure communication, data types and classifications, states of data, and protecting data (`src/data/lessonStories.ts`).
- Added matching `lessonCheckStories` entries for the same Lessons 61 through 70 so those in-lesson checks now use story-native setup dialogue, question stems, and post-reveal payoff lines instead of the generic lesson prompts (`src/data/lessonCheckStories.ts`).
- Re-ran the repo checks after the batch expansion and confirmed the story-data additions still build, lint, and pass Vitest.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- `pnpm test`

### 2026-04-01 06:38 (local)
**Summary:** Continued the next story batch through Lesson 60, extending Northwind cutscenes and story-backed checks across password attacks, IoCs, Domain 2.5 controls, and the opening Domain 3.1 cloud and infrastructure lessons.
**Changes:**
- Added new `lessonStories` cold opens and callbacks for Lessons 51 through 60, covering password attacks, indicators of compromise, segmentation and access control, mitigation techniques, hardening techniques, endpoint hardening, cloud infrastructures, cloud architecture, network infrastructure, and specialized infrastructure (`src/data/lessonStories.ts`).
- Added matching `lessonCheckStories` entries for the same Lessons 51 through 60 so those in-lesson checks now use story-native setup dialogue, question stems, and post-reveal payoff lines instead of the generic lesson prompts (`src/data/lessonCheckStories.ts`).
- Re-ran the repo checks after the batch expansion and confirmed the story-data additions still build, lint, and pass Vitest.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- `pnpm test`

### 2026-04-01 06:24 (local)
**Summary:** Continued the next story batch through Lesson 50, extending Northwind cutscenes and story-backed checks across the remaining 2.4 malware, physical, availability, DNS, wireless, on-path, replay, application, and cryptographic attack lessons.
**Changes:**
- Added new `lessonStories` cold opens and callbacks for Lessons 41 through 50, covering spyware and bloatware, other malware types, physical attacks, denial of service, DNS attacks, wireless attacks, on-path attacks, replay attacks, application attacks, and cryptographic attacks (`src/data/lessonStories.ts`).
- Added matching `lessonCheckStories` entries for the same Lessons 41 through 50 so those in-lesson checks now use story-native setup dialogue, question stems, and post-reveal payoff lines instead of the generic lesson prompts (`src/data/lessonCheckStories.ts`).
- Re-ran the repo checks after the batch expansion and confirmed the story-data additions still build, lint, and pass Vitest.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- `pnpm test`

### 2026-04-01 06:19 (local)
**Summary:** Continued the next story batch through Lesson 40, extending Northwind cutscenes and story-backed checks across the XSS, platform, cloud, and malware lessons.
**Changes:**
- Added new `lessonStories` cold opens and callbacks for Lessons 31 through 40, covering cross-site scripting, hardware vulnerabilities, virtualization vulnerabilities, cloud-specific vulnerabilities, supply-chain vulnerabilities, misconfiguration vulnerabilities, mobile-device vulnerabilities, zero-day vulnerabilities, malware overview, and viruses/worms (`src/data/lessonStories.ts`).
- Added matching `lessonCheckStories` entries for the same Lessons 31 through 40 so those in-lesson checks now use story-native setup dialogue, question stems, and post-reveal payoff lines instead of the generic lesson prompts (`src/data/lessonCheckStories.ts`).
- Re-ran the repo checks after the batch expansion and confirmed the story-data additions still build, lint, and pass Vitest.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- `pnpm test`

### 2026-04-01 06:06 (local)
**Summary:** Continued the next story batch through Lesson 30, extending Northwind cutscenes and story-backed checks across the phishing, social-engineering, and software-vulnerability lessons.
**Changes:**
- Added new `lessonStories` cold opens and callbacks for Lessons 21 through 30, covering phishing, impersonation, watering-hole attacks, other social-engineering attacks, memory injections, buffer overflows, race conditions, malicious updates, OS vulnerabilities, and SQL injection (`src/data/lessonStories.ts`).
- Added matching `lessonCheckStories` entries for the same Lessons 21 through 30 so those in-lesson checks now use story-native setup dialogue, question stems, and post-reveal payoff lines instead of the generic lesson prompts (`src/data/lessonCheckStories.ts`).
- Re-ran the repo checks after the batch expansion and confirmed the story-data additions still build, lint, and pass Vitest.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- `pnpm exec vitest run`

### 2026-04-01 05:40 (local)
**Summary:** Propagated the story layer to the next batch of 10 lessons, extending Northwind cutscenes and story-backed checks through Lesson 20.
**Changes:**
- Added new `lessonStories` cold opens and callbacks for Lessons 11 through 20, covering PKI, encrypting data, key exchange, encryption technologies, obfuscation, hashing and digital signatures, blockchain, certificates, threat actors, and common threat vectors (`src/data/lessonStories.ts`).
- Added matching `lessonCheckStories` entries for the same Lessons 11 through 20 so their in-lesson checks now use story-native setup dialogue, question stems, and post-reveal payoff lines instead of the generic lesson prompts (`src/data/lessonCheckStories.ts`).
- Re-ran the repo checks after the batch expansion and confirmed the story-data additions still build, lint, and pass Vitest.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- `pnpm exec vitest run`

### 2026-04-01 05:28 (local)
**Summary:** Made cutscene speech bubbles widen dynamically when a narrow bubble would force too much vertical spill toward the sprites, while still clamping inside the scene bounds.
**Changes:**
- Added adaptive bubble-width logic to the shared lesson cutscene player so it starts from the normal width target, measures the available headroom above the active speaker, and expands the bubble horizontally up to the stage width limit when extra width is needed to reduce height (`src/pages/LessonViewer.tsx`).
- Kept the existing left/right clamping logic in place so wider bubbles still stay inside the cutscene bounds rather than overflowing the scene container (`src/pages/LessonViewer.tsx`).
- Re-ran the repo checks after the bubble-sizing change and confirmed the lesson viewer still builds, lints, and passes Vitest.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- `pnpm exec vitest run`

### 2026-04-01 05:25 (local)
**Summary:** Removed the remaining `max-w-4xl` cap from check slides so quiz/reflection content can use the full card width.
**Changes:**
- Changed the story-backed check heading and body wrappers from `max-w-4xl` to full-width containers, allowing the compact cutscene, prompt, and answer UI to expand across the full lesson card instead of stopping early (`src/pages/LessonViewer.tsx`).
- Left the compact cutscene internals unchanged; this pass only removed the parent width constraint that was making the quiz/reflection area look narrower than the card (`src/pages/LessonViewer.tsx`).
- Re-ran the repo checks after the width change and confirmed the lesson viewer still builds, lints, and passes Vitest.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- `pnpm exec vitest run`

### 2026-04-01 05:21 (local)
**Summary:** Increased the compact quiz/reflection cutscene stage height by 50% so longer speech bubbles have more room before colliding with the sprites.
**Changes:**
- Increased the compact check-scene stage minimum height from `11.5rem` to `17.25rem`, giving the speech-bubble overlay substantially more vertical headroom while keeping the full-size lesson cutscene layout unchanged (`src/pages/LessonViewer.tsx`).
- Left the compact title row, replay placement, and story-backed check mechanics unchanged; this pass was only about allocating more scene space for dense dialogue (`src/pages/LessonViewer.tsx`).
- Re-ran the repo checks after the stage-height change and confirmed the lesson viewer still builds, lints, and passes Vitest.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- `pnpm exec vitest run`

### 2026-04-01 05:19 (local)
**Summary:** Removed the redundant `Multiple choice` check heading for story-backed MCQs and moved the compact cutscene replay control into the top-right title row.
**Changes:**
- Suppressed the `Multiple choice` label on story-backed multiple-choice check slides so the check now leads with the scenario cutscene and prompt instead of repeating the interaction type (`src/pages/LessonViewer.tsx`).
- Moved the compact `Replay scene` action into the cutscene title row and removed its duplicate lower placement, freeing more vertical room for the staged dialogue area on quiz/reflection slides (`src/pages/LessonViewer.tsx`).
- Re-ran the repo checks after the layout update and confirmed the lesson viewer still builds, lints, and passes Vitest.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- `pnpm exec vitest run`

### 2026-04-01 04:44 (local)
**Summary:** Flattened the quiz/reflection cutscene chrome so the story setup now keeps only the scenario title and staged dialogue without extra nested cards.
**Changes:**
- Simplified the compact lesson cutscene variant to drop the extra outer shell, eyebrow, progress badge, and inner stage card when used on story-backed checks; quiz/reflection cutscenes now start with the scenario title and render directly in the slide (`src/pages/LessonViewer.tsx`).
- Kept the compact check-scene controls and bubble-driven sprite staging intact, so the cutscene behavior remains the same while using less vertical space and less visual chrome (`src/pages/LessonViewer.tsx`).
- Re-ran the repo checks after flattening the compact cutscene layout and confirmed the lesson viewer still builds, lints, and passes Vitest.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- `pnpm exec vitest run`

### 2026-04-01 03:58 (local)
**Summary:** Turned the story-backed quiz/reflection preambles into compact cutscenes so check slides now stage the scene instead of showing a static script block.
**Changes:**
- Extended the shared lesson cutscene player with a compact variant that keeps the pre-question story area constrained while still supporting auto-play, `Next line`, `Skip to end`, and `Replay scene` (`src/pages/LessonViewer.tsx`).
- Replaced the static `CheckStoryPrompt` transcript layout with the compact cutscene player so story-backed checks now use sprites and speech bubbles in the same space previously reserved for the quiz/reflection story script (`src/pages/LessonViewer.tsx`).
- Re-ran the repo checks after the UI change and confirmed the updated lesson viewer still builds, lints, and passes Vitest.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- `pnpm exec vitest run`

### 2026-04-01 02:08 (local)
**Summary:** Tightened the first 10 story-backed lesson checks so the quiz moments continue the surrounding Northwind scenes instead of feeling like separate examples.
**Changes:**
- Rewrote the first 10 `lessonCheckStories` titles, setup dialogue, post-reveal lines, and several question stems so each quiz now follows the specific lesson story beat already established in the cold open or callback (`src/data/lessonCheckStories.ts`).
- Kept the grading behavior and lesson mechanics unchanged; this pass was limited to story continuity and wording so the existing check UI still renders and scores the same way (`src/pages/LessonViewer.tsx`).
- Verified the repo checks after the content pass and confirmed the updated story-check data builds, lints, and passes the Vitest suite.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- `pnpm exec vitest run`

### 2026-03-31 03:28 (local)
**Summary:** Flattened the story-backed multiple-choice slide layout so the MCQ reads as one panel with only the check type and scene title.
**Changes:**
- Removed the inner content card shell from `SlideCheck` so the question content now sits directly in the main slide panel instead of inside a second bordered container (`src/pages/LessonViewer.tsx`).
- Simplified the check heading to just the mode label, and stripped the extra eyebrow/description copy plus the `Northwind Scenario` / `In Context` labels from the scene preamble; the scene now just shows the context title such as `Prove Denise Wrote It` (`src/pages/LessonViewer.tsx`).
- Browser-checked Lesson 3 slide 9 to confirm the slide now shows `Multiple choice` plus `Prove Denise Wrote It` and none of the removed redundant labels.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- inline Vite + Playwright sanity check for `/lessons/2?slide=9`

### 2026-03-31 03:24 (local)
**Summary:** Simplified story-backed multiple-choice slides so the prompt no longer duplicates the options and answers reveal immediately on button click.
**Changes:**
- Added prompt-only rendering for multiple-choice checks so the question stem is shown without the inline `(A)...(D)` option list while the answer choices remain exclusively on the interactive buttons (`src/pages/LessonViewer.tsx`).
- Removed the extra scenario guidance line from the check preamble and changed multiple-choice buttons to auto-submit on click, immediately revealing correct/incorrect feedback and the explanation without a separate `Submit answer` step (`src/pages/LessonViewer.tsx`).
- Browser-checked Lesson 3 slide 9 to confirm the prompt no longer contains inline options, no submit button remains, and clicking `B` immediately grades and opens the explanation.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- inline Vite + Playwright sanity check for `/lessons/2?slide=9`

### 2026-03-31 03:19 (local)
**Summary:** Replaced the generic multiple-choice lesson checks with story-native Northwind prompts so the question itself, choices, grading, and explanation all live inside the same scenario.
**Changes:**
- Expanded `lessonCheckStories` so all first 10 story-backed lessons now provide full question and answer overrides, not just a scenario wrapper (`src/data/lessonCheckStories.ts`).
- Updated `SlideCheck` to render and grade against the story override content when present, so the live check stem, answer key, extracted choices, and explanation all come from the Northwind version instead of the original generic lesson text (`src/pages/LessonViewer.tsx`).
- Browser-checked all first 10 story-backed checks with an inline Playwright pass and confirmed each lesson now shows a story-native prompt; Lesson 3 slide 9 specifically now renders the Denise/vendor digital-signature question rather than the old generic Alice/Bob wording.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- inline Vite + Playwright sanity sweep for the first 10 story-backed lesson checks

### 2026-03-31 02:08 (local)
**Summary:** Corrected the story-backed check prompts so they align with the actual question stems instead of only the broader lesson theme.
**Changes:**
- Rewrote the first batch of `lessonCheckStories` to match the real check-slide questions, including fixing Lesson 3 slide 9 so the scenario now supports the digital-signature/authorship prompt rather than an unrelated finance-approval scenario (`src/data/lessonCheckStories.ts`).
- Kept the integrated single-panel check layout from the earlier pass, but changed the content so the story setup and the multiple-choice question now reinforce each other instead of reading like two separate ideas forced together.
- Browser-checked Lesson 3 slide 9 after the rewrite to confirm the scenario and the actual Alice/Bob authorship question now align.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- inline Vite + Playwright sanity check for `/lessons/2?slide=9`

### 2026-03-31 01:47 (local)
**Summary:** Fixed single-answer lesson check slides so multiple-choice and true/false interactions now actually submit and grade the selected answer.
**Changes:**
- Added answer-key parsing for single-answer `check` slides based on the explanation text, supporting both multiple-choice letter answers and true/false answers (`src/pages/LessonViewer.tsx`).
- Updated `SlideCheck` so binary and multiple-choice lessons now require a selection, expose a `Submit answer` action, reveal correct/incorrect feedback, and then show the explanation plus any story-backed payoff line (`src/pages/LessonViewer.tsx`).
- Browser-checked Lesson 4’s story-backed multiple-choice check to confirm selecting an option, submitting it, and rendering feedback now works end-to-end.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- inline Vite + Playwright sanity check for `/lessons/3?slide=9`

### 2026-03-30 23:29 (local)
**Summary:** Integrated the Northwind story into the first set of in-lesson check slides so scenario context now frames the quiz itself.
**Changes:**
- Added a new lesson-check story metadata layer for five initial lessons (`Non-repudiation`, `AAA`, `Zero Trust`, `Change Management`, and `Technical Change Management`), including short setup lines plus a one-line in-character payoff after reveal (`src/data/lessonCheckStories.ts`).
- Updated the lesson viewer so `check` slides can render a compact `Northwind Scenario` prompt above the existing quiz interaction and a `Back To The Scene` line after the explanation without changing the underlying question mechanics (`src/pages/LessonViewer.tsx`).
- Browser-checked Lesson 4’s check slide to confirm the story prompt appears before the question and the in-character payoff only appears after the explanation is revealed.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- inline Vite + Playwright sanity check for `/lessons/3?slide=9`

### 2026-03-30 14:01 (local)
**Summary:** Added a separate cutscene stage layout for scenes where Noah is absent so the cast spreads out evenly instead of inheriting the Noah-left composition.
**Changes:**
- Updated the cutscene player to detect whether Noah Reed is present in the scene and use a different stage layout when he is not: instead of reserving a left protagonist column, all visible speakers now sit in a single evenly spaced row across the stage (`src/pages/LessonViewer.tsx`).
- Kept the active-speaker anchor, measured speech bubble overlay, and timing behavior unchanged so non-Noah scenes still use the same bubble system while looking less lopsided.
- Browser-checked Lesson 2’s callback cutscene (Marty + Priya only) to confirm the two-character no-Noah scene now spreads more evenly across the stage.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- inline Vite + Playwright sanity check for `/lessons/1?slide=12`

### 2026-03-30 13:54 (local)
**Summary:** Revised the first 10 Northwind lesson scripts to sound more natural and less like direct exam exposition.
**Changes:**
- Rewrote the cold-open and callback dialogue beats across the first 10 story-backed lessons to use shorter, more conversational phrasing, lighter interruptions, and less overt concept narration while preserving the same teaching intent (`src/data/lessonStories.ts`).
- Kept the titles, story structure, and concept/takeaway mapping intact so the narrative still anchors the same lesson objectives without sounding as scripted.
**Commands run:**
- `pnpm build`
- `pnpm lint`

### 2026-03-30 13:36 (local)
**Summary:** Slowed cutscene auto-play timing so speech bubbles stay on screen longer for longer lines.
**Changes:**
- Replaced the old character-count-only delay formula with a more readable timing model based on word count plus punctuation pauses, with a higher minimum and maximum display time so longer dialogue stays visible long enough to read comfortably (`src/pages/LessonViewer.tsx`).
- Kept the manual cutscene controls unchanged, so users can still advance, skip, or replay even though the default auto-play pacing is now more generous.
- Browser-checked Lesson 1 after the timing change to confirm the cutscene still renders and starts normally with the updated pacing model.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- inline Vite + Playwright sanity check for `/lessons/0?slide=1`

### 2026-03-30 13:31 (local)
**Summary:** Constrained cutscene speech bubbles to the stage bounds while keeping them centered over the active speaker whenever space allows.
**Changes:**
- Replaced the per-speaker bubble placement with a single measured overlay bubble that uses the active speaker’s on-screen position to compute the ideal center point, then clamps the bubble inside the cutscene stage bounds before rendering (`src/pages/LessonViewer.tsx`).
- Kept the bubble tail aligned to the speaking character by separately measuring and clamping the tail anchor within the bubble, so centered bubbles still point toward the speaker even when the box itself has to shift inward (`src/pages/LessonViewer.tsx`).
- Browser-checked Lesson 1 after the update to confirm both the opening bubble and the next-speaker bubble stay inside the lesson viewport bounds.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- inline Vite + Playwright sanity check for `/lessons/0?slide=1`

### 2026-03-30 13:27 (local)
**Summary:** Re-anchored cutscene speech bubbles over the speaking character’s head and added a tail so they read as proper speech bubbles.
**Changes:**
- Moved cutscene dialogue bubbles from column-aligned placement to speaker-anchored placement by attaching each bubble to the speaking character’s sprite wrapper and centering it horizontally above the head (`src/pages/LessonViewer.tsx`).
- Added a small rotated tail element at the bottom of each bubble so the active line reads visually as a speech bubble pointing toward the current speaker (`src/pages/LessonViewer.tsx`).
- Browser-checked Lesson 1 after the update to confirm both the opening line and the next-speaker line still render correctly with the new centered anchoring.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- inline Vite + Playwright sanity check for `/lessons/0?slide=1`

### 2026-03-30 13:21 (local)
**Summary:** Removed the fixed-height cutscene bubble slots so dialogue bubbles can render at natural height without stretching vertically.
**Changes:**
- Repositioned cutscene speech bubbles to float directly above the speaking character using `bottom-full` absolute positioning, removing the fixed vertical allocation that was making bubbles look unnaturally tall (`src/pages/LessonViewer.tsx`).
- Increased the maximum bubble width while keeping the stage lineup stable, allowing longer lines to overlap upward into scene space rather than stretching vertically or pushing sprites around (`src/pages/LessonViewer.tsx`).
- Browser-checked Lesson 1 after the change to confirm the second line still renders correctly and the visible sprite lineup remains stable as the active speaker changes.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- inline Vite + Playwright sanity check for `/lessons/0?slide=1`

### 2026-03-30 13:18 (local)
**Summary:** Removed the remaining sprite chrome from lesson cutscenes and made right-side speech bubbles non-displacing.
**Changes:**
- Added an explicit unstyled mode to the shared `CastSprite` component and switched the cutscene stage to use it, so lesson cutscene sprites no longer inherit the default rounded border/background wrapper (`src/components/CastSprite.tsx`, `src/pages/LessonViewer.tsx`).
- Changed the active speech bubbles to render inside fixed-height bubble slots with absolute positioning, so when a right-side character speaks the bubble no longer pushes or reflows the rest of the lineup (`src/pages/LessonViewer.tsx`).
- Browser-checked Lesson 1 after the update to confirm the cutscene sprites are borderless and the visible stage lineup remains stable as dialogue advances.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- inline Vite + Playwright sanity check for `/lessons/0?slide=1`

### 2026-03-30 13:14 (local)
**Summary:** Removed the boxed character treatment from lesson cutscenes and tightened the right-side cast into a single side-by-side lineup.
**Changes:**
- Reworked the cutscene stage so sprites no longer sit inside bordered character cards; actors now appear as plain stage figures with only subtle emphasis on the active speaker (`src/pages/LessonViewer.tsx`).
- Changed the right-side scene cast from a roomy grid into a bottom-aligned side-by-side lineup, reducing the awkward spacing between non-player characters while preserving per-speaker speech bubbles above the active actor (`src/pages/LessonViewer.tsx`).
- Browser-checked Lesson 1 after the layout change to confirm the dialogue bubble still renders and all scene characters remain visible on stage.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- inline Vite + Playwright sanity check for `/lessons/0?slide=1`

### 2026-03-30 13:10 (local)
**Summary:** Simplified the cutscene stage so Noah stays anchored on the left while the rest of the cast remains visible on the right.
**Changes:**
- Reworked the conversation stage layout so the learner character, Noah Reed, is pinned to the left whenever he is present in the scene, while all other participants render together on the right side as persistent stage cards (`src/pages/LessonViewer.tsx`).
- Removed the separate `Cast In Scene` roster because the full scene cast now stays visible on the stage throughout playback, with speech bubbles still appearing only above the active speaker (`src/pages/LessonViewer.tsx`).
- Browser-checked Lesson 1 with Playwright to confirm the old cast section is gone, all three scene characters remain visible at once, and the opening dialogue still renders correctly after the relayout.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- inline Vite + Playwright sanity check for `/lessons/0?slide=1`

### 2026-03-30 13:07 (local)
**Summary:** Redesigned the Northwind cutscenes into a two-character stage so only the active line appears as a speech bubble above the current speaker.
**Changes:**
- Reworked the cutscene player to select an active speaker and conversation partner, place them on a shared stage facing each other, and render only one live speech bubble above the current speaker instead of stacking past dialogue lines in the scene body (`src/pages/LessonViewer.tsx`).
- Moved the rest of the scene participants into a lighter cast roster and added a gated `Reveal full script` control that only appears after the scene completes, so the transcript stays hidden during playback but remains accessible afterward (`src/pages/LessonViewer.tsx`).
- Browser-checked Lesson 1 with Playwright to confirm the scene starts with one active bubble, keeps future lines hidden until advanced, and reveals the full script only after the explicit post-scene button is used.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- inline Vite + Playwright sanity check for `/lessons/0?slide=1`

### 2026-03-30 13:01 (local)
**Summary:** Upgraded the Northwind cutscenes into actual timed conversation scenes with sequential speech bubbles and scene controls.
**Changes:**
- Expanded the first 10 lesson story callbacks so they contain spoken dialogue as well as a final takeaway, allowing both the opening and ending cutscenes to play as conversations instead of static text summaries (`src/data/lessonStories.ts`).
- Replaced the static story panels in the lesson viewer with a conversation player that reveals one bubble at a time, highlights the active speaker in the cast strip, auto-plays the scene, and provides `Next line`, `Skip to end`, and `Replay scene` controls (`src/pages/LessonViewer.tsx`).
- Browser-checked Lesson 1 in Playwright to confirm the first bubble renders alone, later bubbles advance correctly, and the takeaway appears only after the scene finishes.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- inline Vite + Playwright sanity check for `/lessons/0?slide=1`

### 2026-03-30 12:55 (local)
**Summary:** Reworked lesson story presentation so Northwind beats use dedicated cutscene slides instead of being stacked inside intro and summary panels.
**Changes:**
- Changed the lesson viewer to synthesize story-backed slide sequences: a cold-open cutscene before the first lesson slide and a callback cutscene after the lesson content, so the normal slide panels keep their original height and are no longer displaced by story cards (`src/pages/LessonViewer.tsx`).
- Restored the standard intro and summary slide rendering paths, with the story content now handled by separate cutscene slide components rather than inline card insertion.
- Browser-checked Lesson 1 with Playwright to confirm slide 1 is the story cutscene, slide 2 is the original intro, and the final slide is the callback cutscene with the updated slide count.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- inline Vite + Playwright sanity checks for `/lessons/0?slide=1`, `/lessons/0?slide=2`, and `/lessons/0?slide=12`

### 2026-03-30 12:52 (local)
**Summary:** Implemented the first story layer for guided lessons by adding Northwind cold-open and callback cards to the first 10 lessons.
**Changes:**
- Added structured lesson-story metadata for Lessons 1 through 10, keyed by lesson id and built around the Northwind Office Systems cast, with a cold open, concept hook, and callback/payoff for each lesson (`src/data/lessonStories.ts`).
- Updated the lesson viewer to render compact story cards only on intro and summary slides, reusing the animated cast sprites so the narrative supports the lesson without crowding the main content (`src/pages/LessonViewer.tsx`).
- Browser-checked Lesson 1 and Lesson 10 with Playwright against the live app to confirm the new `Northwind Story Beat` intro card and `Northwind Callback` summary card both render in the intended places.
**Commands run:**
- `pnpm build`
- `pnpm lint`
- inline Vite + Playwright sanity checks for `/lessons/0`, `/lessons/0?slide=10`, `/lessons/9`, and `/lessons/9?slide=8`

### 2026-03-30 12:39 (local)
**Summary:** Removed the end-of-loop flicker on the `/story-cast` sprite preview by switching to a proper stepped sprite-sheet animation.
**Changes:**
- Replaced the manual frame-by-frame keyframe percentages with a standard `steps(4)` sprite-sheet animation that runs from frame 0 through the sheet width, eliminating the visible flicker/jump when the loop resets on `/story-cast` (`src/index.css`).
- Rechecked the `/story-cast` route after the CSS change to confirm the cast still renders and animates with the updated timing model.
**Commands run:**
- inline Vite browser check for `/story-cast`
- `pnpm build`
- `pnpm lint`

### 2026-03-30 12:30 (local)
**Summary:** Split Ethan Cole’s nose and mouth positioning so the lower face can be tuned independently.
**Changes:**
- Replaced Ethan’s shared lower-face offset with separate `noseYOffset` and `mouthYOffset` handling in the story-cast generator, allowing the nose to stay in a normal position while the mouth/beard sits lower (`scripts/generate-story-cast-sprites.mjs`, `public/story-cast/*`).
- Rechecked Ethan’s `/story-cast` card after regeneration to confirm the nose and mouth no longer move as one block.
**Commands run:**
- `node scripts/generate-story-cast-sprites.mjs`
- inline Vite + Playwright close-up check for Ethan Cole on `/story-cast`
- `pnpm build`
- `pnpm lint`

### 2026-03-30 12:23 (local)
**Summary:** Adjusted Ethan Cole’s nose placement so it sits higher on the face and no longer crowds the mouth.
**Changes:**
- Added a per-character nose Y-offset in the story-cast generator and used it to raise Ethan Cole’s single nose pixel by one row, improving the spacing between his nose and beard/mouth (`scripts/generate-story-cast-sprites.mjs`, `public/story-cast/*`).
- Rechecked Ethan’s card in `/story-cast` after regeneration to confirm the facial spacing reads correctly at preview scale.
**Commands run:**
- `node scripts/generate-story-cast-sprites.mjs`
- inline Vite + Playwright close-up check for Ethan Cole on `/story-cast`
- `pnpm build`
- `pnpm lint`

### 2026-03-30 11:38 (local)
**Summary:** Applied a second targeted facial polish pass to Rosa, Ethan, and Tessa after the first fix still looked off in close-up.
**Changes:**
- Refined Rosa Jimenez’s face to use a cleaner small smile, Ethan Cole’s face to use clearer stern eyes plus a trimmed beard/mouth separation, and Tessa Vale’s face to use a more restrained closed smile with the nose removed entirely (`scripts/generate-story-cast-sprites.mjs`, `public/story-cast/*`).
- Took focused browser screenshots of the individual cast cards from `/story-cast` before and after the pass so the changes were based on the actual rendered close-ups instead of the full-page preview.
**Commands run:**
- inline Vite + Playwright close-up checks for Rosa Jimenez, Ethan Cole, and Tessa Vale on `/story-cast`
- `node scripts/generate-story-cast-sprites.mjs`
- `pnpm build`
- `pnpm lint`

### 2026-03-30 11:31 (local)
**Summary:** Polished the weakest cast faces by giving Priya, Rosa, Ethan, and Tessa more character-specific eye and mouth shapes.
**Changes:**
- Added targeted face-style handling in the story-cast generator so Priya uses a tired focused eye shape with a tighter mouth, Rosa uses softer kinder eyes with a warmer smile, Ethan uses steadier deeper-set eyes and a less blocky beard/mouth treatment, and Tessa uses friendlier eyes with a softer smile (`scripts/generate-story-cast-sprites.mjs`, `public/story-cast/*`).
- Rechecked the updated `/story-cast` preview in-browser after regenerating the sprite sheets to confirm those four faces read more naturally than the generic template pass.
**Commands run:**
- `node scripts/generate-story-cast-sprites.mjs`
- inline Vite + Playwright preview check for `/story-cast`
- `pnpm build`
- `pnpm lint`

### 2026-03-30 11:28 (local)
**Summary:** Corrected the cast rig so the sprite heads are centered over the torso instead of leaning too far right, and tightened the upper-body silhouette.
**Changes:**
- Shifted the generated head anchor left to center the face over the torso and widened the neck/shoulder bridge pixels so the cast no longer looks detached or right-heavy in the `/story-cast` preview (`scripts/generate-story-cast-sprites.mjs`, `public/story-cast/*`).
- Rechecked the updated sprite set in-browser after regeneration to confirm the cast reads more balanced and less awkward at preview scale.
**Commands run:**
- `node scripts/generate-story-cast-sprites.mjs`
- inline Vite + Playwright preview check for `/story-cast`
- `pnpm build`
- `pnpm lint`

### 2026-03-30 11:22 (local)
**Summary:** Reduced the story-cast idle motion so the sprites feel steadier and less bobbleheaded in the preview.
**Changes:**
- Flattened the generated idle poses by removing the up/down bob and side sway from the four-frame cast animation while keeping smaller arm/leg/blink variation for life, reducing the excessive head movement visible on `/story-cast` (`scripts/generate-story-cast-sprites.mjs`, `public/story-cast/*`).
- Rechecked the `/story-cast` preview in-browser after regenerating the sprite sheets to confirm the cast reads more like subtle idle motion than exaggerated head bobbing.
**Commands run:**
- `node scripts/generate-story-cast-sprites.mjs`
- inline Vite + Playwright preview check for `/story-cast`
- `pnpm build`
- `pnpm lint`

### 2026-03-30 11:08 (local)
**Summary:** Reworked the first-pass story cast sprites into a cleaner animated set with better proportions, facial readability, clothing details, and a less awkward idle loop.
**Changes:**
- Rewrote the local story-cast sprite generator to produce more polished four-frame idle sprite sheets with improved head/body proportions, rounded silhouettes, per-character brows/mouths, better hair shapes, stronger outfit differentiation, prop rendering, and basic shadows instead of the blockier first-pass rigs (`scripts/generate-story-cast-sprites.mjs`, `public/story-cast/*`).
- Updated the sprite animation CSS to handle four-frame sheets and slowed the loop slightly so the cast reads more like discrete idle animation instead of a harsh three-frame cycle (`src/index.css`).
- Enlarged the `/story-cast` preview sprites so the art pass is easier to evaluate in-browser while the narrative layer is still being designed (`src/pages/StoryCast.tsx`).
**Commands run:**
- `node scripts/generate-story-cast-sprites.mjs`
- inline Vite + Playwright preview checks for `/story-cast`
- `pnpm build`
- `pnpm lint`

### 2026-03-30 10:54 (local)
**Summary:** Added an original animated pixel-art cast prototype for the planned story mode, including reusable sprite-sheet assets and an in-app preview route.
**Changes:**
- Built a local sprite generator that outputs original three-frame idle pixel-sprite sheets for the full Northwind Office Systems cast without external image tooling, and committed the generated assets under `public/story-cast` for reuse in future lesson/story work (`scripts/generate-story-cast-sprites.mjs`, `public/story-cast/*`).
- Added reusable cast metadata plus a small `CastSprite` component that animates the generated sprite sheets with CSS step timing, making the assets usable in future lesson callouts and story beats (`src/data/storyCast.ts`, `src/components/CastSprite.tsx`, `src/index.css`).
- Added a dedicated `/story-cast` preview page so the full cast can be reviewed in the app while the narrative layer is still being designed (`src/pages/StoryCast.tsx`, `src/App.tsx`, `src/pages/index.ts`, `src/components/index.ts`).
**Commands run:**
- `node scripts/generate-story-cast-sprites.mjs`
- inline Vite + Playwright preview check for `/story-cast`
- `pnpm build`
- `pnpm lint`

### 2026-03-30 10:19 (local)
**Summary:** Fine-tuned the bullet-slide lead marker offset so the starting dot is vertically centered against the first line of text, then verified the fix with Playwright measurements.
**Changes:**
- Adjusted the bullet-slide marker top offset from `0.85rem` to `1rem`, eliminating the roughly 2.4 px high bias visible on key-point slides such as Lesson 20 slide 5 and Lesson 42 slide 8 (`src/pages/LessonViewer.tsx`).
- Rechecked `/lessons/19?slide=5` and `/lessons/41?slide=8` in Playwright, confirming the marker center now matches the highlighted keyword center on both slides.
**Commands run:**
- inline Vite + Playwright measurement/screenshot checks for `/lessons/19?slide=5` and `/lessons/41?slide=8`
- `pnpm build`
- `pnpm lint`

### 2026-03-30 10:15 (local)
**Summary:** Removed the unnecessary separator dots from lesson keyword highlight pills and verified the cleanup on the reported bullet-slide pages.
**Changes:**
- Dropped the extra pseudo-element marker from short highlighted lesson labels so keyword pills no longer render an internal dot after the text (`src/index.css`).
- Rechecked `/lessons/19?slide=5` and `/lessons/41?slide=8` in Playwright after the CSS cleanup to confirm the highlight pills are clean and the left-hand bullets remain aligned.
**Commands run:**
- inline Vite + Playwright screenshot checks for `/lessons/19?slide=5` and `/lessons/41?slide=8`
- `pnpm build`
- `pnpm lint`

### 2026-03-30 10:06 (local)
**Summary:** Corrected the actual bullet-slide regression by aligning the left-hand list markers on lesson key-point slides, then rechecked the reported pages in Playwright.
**Changes:**
- Replaced the starting bullet glyph on `bullets` slides with a fixed-size circular marker and tuned its offset so the marker aligns with the first line of lesson text instead of sitting low beside the content cards (`src/pages/LessonViewer.tsx`).
- Browser-checked `/lessons/19?slide=5` and `/lessons/41?slide=8` with fresh Playwright screenshots after the patch to verify the left-hand markers now align with the text.
**Commands run:**
- inline Vite + Playwright screenshot checks for `/lessons/19?slide=5` and `/lessons/41?slide=8`
- `pnpm build`
- `pnpm lint`

### 2026-03-30 10:00 (local)
**Summary:** Fixed the remaining lesson label-separator dot alignment issue on bullet slides and verified the reported examples in-browser.
**Changes:**
- Replaced the label separator bullet glyph with a sized pseudo-element dot and aligned short lesson labels with inline flex so the separator sits consistently beside the text instead of drifting vertically on bullet slides (`src/index.css`).
- Browser-checked the reported regressions on Lesson 20 slide 5 and Lesson 42 slide 8 with direct screenshots after the CSS change to confirm the separator alignment now matches the label text.
**Commands run:**
- inline Vite + Playwright screenshot checks for `/lessons/19?slide=5` and `/lessons/41?slide=8`
- `pnpm build`
- `pnpm lint`

### 2026-03-30 07:56 (local)
**Summary:** Used Playwright to inspect Lesson 42 slides 4 and 8, then fixed both the separator-dot alignment and the missing list markers in lesson rich text.
**Changes:**
- Browser-checked `/lessons/41?slide=4` and `/lessons/41?slide=8` with Playwright screenshots/DOM inspection to verify the reported rendering issues before patching the CSS.
- Restored explicit `ul`/`ol` markers in lesson rich text so indented list items render with visible bullets again, including the previously markerless lines on Lesson 42 slide 4 (`src/index.css`).
- Simplified the label separator rendering to a baseline-safe inline marker and widened label detection so longer `Label:` phrases can receive the separator without being forced into oversized badge styling (`src/index.css`, `src/pages/LessonViewer.tsx`).
**Commands run:**
- `pnpm exec playwright test e2e/lesson-highlight-inspect.spec.ts --project=chromium`
- `pnpm build`
- `pnpm lint`

### 2026-03-30 07:51 (local)
**Summary:** Fixed the lesson-label separator dot alignment so the marker sits on the text baseline instead of drifting on some slides.
**Changes:**
- Switched the short label highlight variant to an explicit inline-flex baseline-aligned treatment and sized/positioned the separator dot for more consistent rendering across lessons such as Lesson 42 slide 8 (`src/index.css`).
- Removed a leftover unused variable from the lesson highlight heuristic and re-ran the verification pass (`src/pages/LessonViewer.tsx`).
**Commands run:**
- `pnpm build`
- `pnpm lint`

### 2026-03-30 07:38 (local)
**Summary:** Fixed the awkward lesson-text indentation caused by longer highlighted phrases wrapping like pill badges.
**Changes:**
- Tightened the lesson highlight-pill heuristic so only short labels and acronym-like terms keep the pill treatment, while longer emphasized phrases use the flatter underline style and wrap normally (`src/pages/LessonViewer.tsx`).
- Re-ran the production build and lint pass to confirm the updated lesson viewer still compiles cleanly (`src/pages/LessonViewer.tsx`).
**Commands run:**
- `pnpm build`
- `pnpm lint`

### 2026-03-30 07:26 (local)
**Summary:** Improved lesson readability by widening the lesson content area, increasing text spacing, and introducing restrained category-based keyword highlighting.
**Changes:**
- Expanded the lesson viewer panels and content spacing so lesson slides make better use of the available width while keeping paragraphs, bullets, term cards, check explanations, and summaries easier to scan (`src/pages/LessonViewer.tsx`).
- Added a semantic lesson-rich-text decorator that classifies emphasized keywords into a small shared palette for protocols, identity terms, risks, and process/governance terms instead of rendering every highlight in the same teal (`src/pages/LessonViewer.tsx`, `src/index.css`).
- Refined the shared lesson typography rules for paragraph rhythm, list spacing, subhead styling, and summary label treatment to make dense slide content read more like structured notes than compact blocks (`src/index.css`, `src/pages/LessonViewer.tsx`).
**Commands run:**
- `pnpm build`
- `pnpm test`
- `pnpm lint`

### 2026-03-26 08:11 (local)
**Summary:** Added the next targeted Official Student Guide visuals for certificate chaining, DMARC verification, and qualitative risk heat maps.
**Changes:**
- Inserted three new lesson visuals into the generated Security+ deck: the certificate chain-of-trust screenshot on page 60, the DMARC lookup screenshot on page 322, and the traffic-light risk heat map on page 453 (`src/data/securityPlusLessons.generated.ts`).
- Added source crop mappings for the three new captions and tuned the risk heat map crop so the factor labels render fully in the lesson viewer (`src/data/lessonDiagramCrops.ts`).
- Browser-checked all three new diagram cards in the local lesson diagram inspector, corrected the new caption strings to ASCII hyphens to avoid mojibake, and re-ran the lesson regression/build/lint pass.
**Commands run:**
- `pnpm test -- src/data/__tests__/securityPlusLessons.test.ts`
- `pnpm build`
- `pnpm lint`

### 2026-03-24 18:12 (local)
**Summary:** Added a broad set of currently missing verified Security+ lesson visuals from the local Official Student Guide PDF and wired crops for each new slide.
**Changes:**
- Expanded the generated lesson deck with new diagram/screenshot slides for NIST CSF, security control functional types, file-download hash verification, digital envelope/PFS, OSI layering, remote-access VPN, 802.1X/RADIUS/EAP, SDN planes, Wi-Fi heat maps, Security Onion monitoring views, Joe Sandbox, phishing header analysis, pass-the-hash via LSASS/SAM, the incident-response lifecycle, the cyber kill chain, and BIA recovery metrics (`src/data/securityPlusLessons.generated.ts`).
- Added crop mappings for every new caption so the lesson viewer renders the actual figure regions instead of full textbook pages, including the new Security Onion, phishing, Joe Sandbox, VPN, and metric visuals (`src/data/lessonDiagramCrops.ts`).
- Re-ran the lesson-data regression suite plus production build and lint to confirm the expanded diagram set is valid and the repo remains green.
**Commands run:**
- `pnpm test -- src/data/__tests__/securityPlusLessons.test.ts`
- `pnpm build`
- `pnpm lint`

### 2026-03-23 13:51 (local)
**Summary:** Made lesson-diagram crop overrides stable across lesson reordering and added export/import persistence for moving crop sets between browsers.
**Changes:**
- Added stable per-diagram IDs during lesson normalization and switched lesson rendering/debug override lookup off slide-index keys, so reordering or merging slides no longer invalidates saved diagram crops (`src/data/securityPlusLessons.ts`, `src/pages/LessonViewer.tsx`, `src/pages/DiagramDebug.tsx`).
- Updated diagram crop resolution to migrate old `lessonId::slideIndex` overrides into the new stable IDs automatically while preserving legacy caption-based source crop entries as a compatibility fallback (`src/data/lessonDiagramCrops.ts`).
- Added debug-page JSON export/import for crop overrides, plus regression tests covering stable diagram IDs and legacy-key migration so crop sets can be carried between browser profiles without re-cropping (`src/pages/DiagramDebug.tsx`, `src/data/__tests__/securityPlusLessons.test.ts`).
- Declared Node globals in the local PDF scan helper scripts so repository lint remains green (`scan_detail.mjs`, `scan_pdf.mjs`, `scan_pdf2.mjs`, `scan_pdf3.mjs`, `scan_smart.mjs`).
**Commands run:**
- `pnpm test -- src/data/__tests__/securityPlusLessons.test.ts`
- `pnpm build`
- `pnpm lint`

### 2026-03-23 13:23 (local)
**Summary:** Merged same-number supplemental Security+ lessons into their base lessons and filled the remaining verified minor protocol and operations gaps.
**Changes:**
- Changed lesson assembly so same-number supplements are merged into the base lesson slide deck instead of appearing as separate `60A`/`67A`/`77A`/`90A`/`92A`/`113A` lessons, while keeping the standalone `4.9` investigation lesson inserted as its own objective after `4.8` (`src/data/securityPlusLessons.ts`).
- Expanded coverage for the remaining verified gaps: SFTP vs FTPS, SMTP ports 25/587/465, TACACS+ vs RADIUS, layer-2 hardening (BPDU Guard, PortFast, VLAN hopping), Kerberos clock skew and NTP dependency, WPA3 DPP, juice jacking, gamified awareness training, plus new deep dives for SED/TCG Opal, CMDB usage, and syslog/SNMPv3 protocol details (`src/data/securityPlusLessonSupplementApplication.ts`, `src/data/securityPlusLessonSupplementNetwork.ts`, `src/data/securityPlusLessonSupplementIdentity.ts`, `src/data/securityPlusLessonSupplementMobile.ts`, `src/data/securityPlusLessonSupplementPersonnel.ts`, `src/data/securityPlusLessonSupplementOps.ts`).
- Extended lesson-search regression coverage for the new terms so the in-app search now explicitly hits `SFTP`, `FTPS`, `port 587`, `TACACS+`, `SNMPv3`, `BPDU Guard`, `clock skew`, `syslog severity`, `Self-Encrypting Drive`, `Device Provisioning Protocol`, `juice jacking`, `gamification`, and `CMDB` (`src/data/__tests__/securityPlusLessons.test.ts`).
**Commands run:**
- `pnpm test -- src/data/__tests__/securityPlusLessons.test.ts`
- `pnpm build`
- `pnpm lint`

### 2026-03-23 13:08 (local)
**Summary:** Closed the remaining minor Security+ lesson gaps with explicit Purdue Model, VPN design, and NAC system coverage, while confirming SOAR already had direct lesson coverage.
**Changes:**
- Added a new VPN/NAC supplement covering remote-access vs site-to-site VPN, IPsec vs TLS VPN behavior, split tunneling, full tunneling, always-on VPN, and NAC as a full posture/quarantine system rather than only 802.1X authentication (`src/data/securityPlusLessonSupplementNetwork.ts`, `src/data/securityPlusLessons.ts`).
- Expanded the OT supplement to name the Purdue Model directly and tie it to layered OT segmentation boundaries between plant-floor systems and enterprise IT (`src/data/securityPlusLessonSupplementOt.ts`).
- Extended lesson-search regression coverage for `Purdue Model`, `split tunneling`, `agentless NAC`, and `SOAR`, keeping the lower-priority terms searchable alongside the earlier gap-remediation topics (`src/data/__tests__/securityPlusLessons.test.ts`).
**Commands run:**
- `pnpm test -- src/data/__tests__/securityPlusLessons.test.ts`
- `pnpm build`
- `pnpm lint`

### 2026-03-23 12:42 (local)
**Summary:** Filled the biggest Security+ lesson coverage gaps by adding anchored supplemental lessons for identity protocols, application security, OT/ICS/IoT, mobile security, and personnel operations.
**Changes:**
- Added five new supplemental lesson modules and wired the lesson catalog to insert them after the relevant base lessons, so the app now explicitly teaches LDAP/LDAPS, X.500 distinguished names, LDAP injection, Kerberos KDC/TGT/TGS, WAF/API gateway/STARTTLS/DNSSEC, OT components like PLC/DCS/HMI/data historian, mobile threat defense/geofencing, and personnel-process topics such as onboarding/offboarding and background checks (`src/data/securityPlusLessons.ts`, `src/data/securityPlusLessonSupplement*.ts`).
- Kept the existing supplemental `4.9` investigation lesson but moved lesson assembly to an anchor-based insertion model so future coverage fixes can land next to the right objective instead of relying on a single hard-coded splice (`src/data/securityPlusLessons.ts`).
- Extended lesson-search tests to assert the new gap-remediation terms are searchable in-app, covering `LDAP injection`, `distinguished name`, `STARTTLS`, `data historian`, `mobile threat defense`, and `background checks` (`src/data/__tests__/securityPlusLessons.test.ts`).
**Commands run:**
- `pnpm test -- src/data/__tests__/securityPlusLessons.test.ts`
- `pnpm build`
- `pnpm lint`

### 2026-03-21 04:19 (local)
**Summary:** Made lesson slides honor the same local diagram crop overrides used by the dev inspector so crop tuning matches between the two views.
**Changes:**
- Added shared debug-override loading for lesson diagram crops, using the same `lessonId::slideIndex` keys and browser storage entry that the dev inspector writes (`src/data/lessonDiagramCrops.ts`).
- Updated the lesson viewer to pass the current lesson/slide override key into diagram rendering, so a crop adjusted in the dev menu is immediately reflected on the actual lesson slide (`src/pages/LessonViewer.tsx`).
- Switched the dev inspector to import the shared override storage key from the crop module to keep both code paths aligned (`src/pages/DiagramDebug.tsx`).
**Commands run:**
- `pnpm exec playwright test e2e/lesson-diagrams.spec.ts --project=chromium`
- `pnpm test -- src/data/__tests__/securityPlusLessons.test.ts`
- `pnpm build`

### 2026-03-21 04:14 (local)
**Summary:** Fixed Lesson 62 slide 2 so the full security-zone topology diagram renders at the intended aspect ratio in the lesson viewer.
**Changes:**
- Updated the slide wrapper to provide full slide height to diagram panels, allowing the diagram canvas stage to expand and use the available vertical space instead of collapsing to a small intrinsic render (`src/pages/LessonViewer.tsx`).
- Expanded the crop for the Lesson 62 slide 2 security-zone topology figure so the lesson uses the full diagram from Professor Messer page 56 instead of only the upper slice (`src/data/lessonDiagramCrops.ts`).
- Re-verified Lesson 62 slide 2 with Playwright screenshots after the crop/layout changes and reran the full diagram slide E2E pass to confirm the rest of the diagram slides still render correctly.
**Commands run:**
- `pnpm exec playwright test e2e/lesson-diagrams.spec.ts --project=chromium`
- `pnpm test -- src/data/__tests__/securityPlusLessons.test.ts`
- `pnpm build`

### 2026-03-21 03:47 (local)
**Summary:** Stabilized lesson diagram rendering so slides stop looping in the loading state and Playwright can verify the rendered canvases reliably.
**Changes:**
- Reworked the diagram slide renderer to measure a stable canvas stage instead of an element that shifts when the loading message appears, preventing resize-triggered render loops in the lesson viewer (`src/pages/LessonViewer.tsx`).
- Kept the current canvas mounted during same-slide resizes and moved the loading/error messaging into an overlay inside the render stage so diagrams no longer flicker back to a blank "Rendering page ..." state (`src/pages/LessonViewer.tsx`).
- Hardened the diagram Playwright spec to wait for the loading message to clear and for the canvas to have nonzero size before checking its final dimensions, then relaxed the minimum size threshold to match responsive slide rendering (`e2e/lesson-diagrams.spec.ts`).
**Commands run:**
- `pnpm exec playwright test e2e/lesson-diagrams.spec.ts --project=chromium`
- `pnpm test -- src/data/__tests__/securityPlusLessons.test.ts`
- `pnpm build`

### 2026-03-20 17:37 (local)
**Summary:** Used Playwright to diagnose diagram cutoff behavior in lesson slides and confirmed the slide viewport is not clipping the rendered canvases.
**Changes:**
- Ran the Chromium diagram-slide E2E pass and reproduced a flaky zero-size canvas assertion while the PDF was still in its loading state (`e2e/lesson-diagrams.spec.ts`).
- Probed Lesson 62 slide 4 and another diagram slide directly with Playwright, capturing screenshots plus DOM metrics that showed the rendered canvas fits fully inside the lesson slide viewport with no overflow (`codex/tmp_cutoff_debug/*`).
- Compared Lesson 62 slide 4 against the diagram inspector and confirmed the remaining visible loss is from the normalized crop box on the source PDF page, not from the slide layout container.
**Commands run:**
- `pnpm exec playwright test e2e/lesson-diagrams.spec.ts --project=chromium`
- `node --input-type=module -` (Playwright diagnostic probes against `/lessons/61?slide=4`, `/lessons/2?slide=2`, and `/debug/lesson-diagrams`)

### 2026-03-20 17:14 (local)
**Summary:** Normalized the remaining mojibake/encoding corruption in the lesson source and local metadata files.
**Changes:**
- Repaired the corrupted UTF-8 sequences in the generated lesson dataset so lesson titles, captions, arrows, quotes, bullets, and dash punctuation now render as intended again (`src/data/securityPlusLessons.generated.ts`).
- Cleaned the diagram crop caption map and verified the lesson viewer/test/state/log files no longer contain the corrupted marker sequences (`src/data/lessonDiagramCrops.ts`, `src/pages/LessonViewer.tsx`, `src/data/securityPlusLessons.ts`, `src/data/__tests__/securityPlusLessons.test.ts`, `codex_state.json`, `docs/CODEX_LOG.md`).
- Re-scanned the repo source set after normalization; the only remaining hit was in the generated `playwright-report/index.html` artifact, not in application/source files.
**Commands run:**
- `pnpm test -- src/data/__tests__/securityPlusLessons.test.ts`
- `pnpm build`

### 2026-03-20 16:29 (local)
**Summary:** Added the missing Lesson 62 explanation slide for the zone-access diagram and stopped diagram canvases from stretching when the slide width changes.
**Changes:**
- Inserted a new Lesson 62 concept slide immediately after the zone-access diagram so the numbered access-control behavior from the source page is explained in the lesson flow (`src/data/securityPlusLessons.generated.ts`).
- Updated the diagram renderer to measure its available width with `ResizeObserver` and re-render the cropped PDF canvas at that exact width, preserving aspect ratio instead of relying on CSS stretch (`src/pages/LessonViewer.tsx`).
- Browser-checked Lesson 62 slide 4 and the new slide 5 at multiple viewport widths to confirm the diagram stays proportional and the new explanation content is present.
**Commands run:**
- `pnpm test -- src/data/__tests__/securityPlusLessons.test.ts`
- `pnpm build`

### 2026-03-20 16:01 (local)
**Summary:** Fixed two lesson diagram mapping issues by adding the missing Race Conditions diagram and correcting Lesson 62 slide 4 to the actual source page.
**Changes:**
- Added a Race Conditions diagram slide to Lesson 27, using the lower flowchart on Professor Messer PDF page 32 instead of leaving that lesson without its shared-page visual (`src/data/securityPlusLessons.generated.ts`).
- Corrected Lesson 62 slide 4 to source Official Student Guide PDF page 117 and retuned its crop to the actual zone-access diagram rather than the page-118 explanatory text (`src/data/securityPlusLessons.generated.ts`, `src/data/lessonDiagramCrops.ts`).
- Added the new crop mapping for the Race Conditions flowchart so the lesson viewer renders the diagram itself rather than surrounding page text (`src/data/lessonDiagramCrops.ts`).
**Decisions:**
- Normalized the new Race Conditions caption to ASCII hyphen text to avoid further encoding drift in generated lesson content.
- Kept the existing lesson structure and inserted the new diagram directly after the TOCTOU explanation so the visual lands next to the concept it illustrates.
**Follow-ups:**
- If more shared-page diagrams are missing, use `/debug/lesson-diagrams` to visually verify the remaining crop boxes against their source pages.
**Commands run:**
- `pnpm test -- src/data/__tests__/securityPlusLessons.test.ts`
- `pnpm build`

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
