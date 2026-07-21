# Repository Interactive Evidence Build Guide

## Purpose

Move interactive learning evidence from a prototype-only signal into a reusable production read path. The app already records interactive widget attempts and projects them into `interactive_skill_evidence`; this slice makes parent and teacher screens visibly consume those normalized catalog signals.

## Why This Is The Correct Next Slice

- It supports the current product priority: the app must prove what a student actually understands, not just show lesson notes.
- It moves us away from local in-memory state and toward Supabase/Postgres-backed reads.
- It is small enough to validate fully before scaling Grade 6 content production.
- It directly supports parent and teacher workflows: parents see what their child can do, and teachers see live class evidence.
- It preserves the release gate: no content scaling until generation, evidence, review, and publishing paths work reliably.

## Next 5 Steps

1. **Create a pure catalog signal helper**
   - Read `catalog.lessons[*].interactiveSkillEvidence`.
   - Normalize camelCase app rows and snake_case database rows.
   - Return total signals, secure signals, needs-support signals, latest signal, and visible signal rows.

2. **Wire repository signals into parent UX**
   - Add a repository-backed evidence card to each parent learner insight.
   - Keep existing engine-derived evidence visible.
   - Label the new card clearly as catalog/database-backed so we can audit whether the normalized path is working.

3. **Wire repository signals into teacher UX**
   - Add a teacher live-monitor metric for catalog skill signals on the current lesson.
   - Keep the existing per-student live evidence row.
   - Make it clear when no repository-backed signal exists yet.

4. **Add tests**
   - Unit test the signal helper using the current Learning AI interaction.
   - Assert it filters by lesson, preserves the AI builder boundary skill, and reports secure evidence.
   - Add source-contract checks that the parent and teacher UI expose repository-backed skill signals.

5. **Validate**
   - Run `npm test`.
   - Run syntax checks for edited files.
   - Document any limitations and the next follow-up.

## Acceptance Criteria

- Repository catalog evidence can be converted into dashboard-ready signals without importing Node-only repository code into the browser app.
- Parent screens show repository-backed interactive skill evidence when the catalog provides it.
- Teacher classroom command shows a catalog-backed skill signal count for the live lesson.
- Tests prove the Learning AI lesson evidence survives the write/read catalog path.
- No broader content scaling is started in this slice.

## Known Boundary

This slice does not replace every parent/teacher data dependency with Supabase reads. It creates the verified bridge for interactive skill evidence first. The next slice should fetch learner-scoped catalogs for each signed-in parent/teacher context and remove remaining local JSON fallback dependencies feature by feature.

## Follow-Up Slice: Learner-Scoped Catalog Reads

The next implementation step is to request `/api/learning/catalog?learnerId=...` for each learner visible to the signed-in role:

- Student: one catalog for the signed-in student.
- Parent: one catalog per linked child account.
- Teacher: one catalog per assigned class learner.
- Admin roles: keep the global catalog available for operational overview.

Parent and teacher dashboards should prefer the scoped catalog when it exists, then fall back to the global catalog only as a development/degraded read path. This pattern now covers interactive skill evidence, quiz attempts, and mastery records from the learning catalog.

## Follow-Up Slice: Rewards And Tutor Events

Rewards and tutor events live outside the learning catalog, so they need separate learner-scoped repository reads:

- `/api/tutor/events?learnerId=...` for student, parent, and teacher scoped tutor visibility.
- `/api/rewards/approvals?learnerId=...` for reward approval visibility.
- Parent and teacher screens should show scoped summaries before relying on local fallback state.
- Scoped roles must not fetch broad tutor event lists. Student, parent, and teacher reads must include or imply a single learner id. Admin roles may use global operational reads.

This pattern should be repeated for the remaining dashboard dependencies until parent, teacher, and student screens can run from repository reads rather than local JSON fallback state.

## Follow-Up Slice: Parent Timeline And Reward Panel

The parent evidence timeline and reward approval panel should use repository reads wherever possible:

- Timeline quiz/mastery status should prefer learner-scoped catalog evidence.
- Timeline reward status should prefer learner-scoped reward approvals.
- Scratchpad writing should project into `lesson_scratchpads` and read back through scoped repository rows.
- Reward approval actions can keep the existing API write flow, but the list display should prefer `/api/rewards/approvals?learnerId=...`.
- If repository reads are missing, the UI may fall back to local state and label the fallback clearly.

## Follow-Up Slice: Lesson Scratchpads

Student-written evidence is now a first-class repository record:

- `lesson_scratchpads` stores first step, explanation, confusion, retry-after-hint, tutor review count, and update time.
- `/api/learning/scratchpads?learnerId=...` reads scoped scratchpad rows.
- `/api/learning/scratchpad` writes through the learning-evidence repository slice.
- Parent timeline student-writing cards should prefer learner-scoped scratchpad rows before local fallback state.
