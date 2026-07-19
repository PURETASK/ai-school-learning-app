# Production Database Schema

## Purpose

The app now has a production-oriented data model contract that maps the current prototype state into the tables we need for a real K-12 learning platform.

This now backs three implementation paths: generated PostgreSQL DDL, normalized seed export, and repository upserts in Postgres mode. Local JSON remains the default preview fallback, but the schema contract is no longer only documentation.

## Required Education Tables

The schema covers the core entities from the product instructions:

- `users`
- `students`
- `guardians`
- `teachers`
- `schools`
- `classes`
- `class_sessions`
- `group_missions`
- `group_artifacts`
- `teacher_interventions`
- `school_reports`
- `enrollments`
- `grade_bands`
- `grade_levels`
- `subjects`
- `courses`
- `units`
- `lessons`
- `activities`
- `quizzes`
- `quiz_questions`
- `quiz_attempts`
- `lesson_progress`
- `mastery_records`
- `interactive_skill_evidence`
- `standards`
- `lesson_standards`
- `assignments`
- `portfolio_items`
- `badges`
- `student_badges`

It also includes school product tables for the first sellable classroom mode. `schools` stores the school or organization profile. `classes` now belongs to a school and teacher. `class_sessions` stores the class-period lesson block students attend in the app. `group_missions` stores structured collaborative work, `group_artifacts` stores shared artifact and individual-accountability evidence, `teacher_interventions` stores support decisions from live monitoring, and `school_reports` stores school-admin report snapshots for usage, mastery, intervention, and pilot readiness.

It also includes operational tables for privacy, accessibility, retention, experiments, content workflow, generated visuals, AI tutor logs, tool calls, review queues, source ledgers, redesign tasks, and audit events. `ai_tutor_events` stores the explanation mode, strategy, visual hint, first-principles prompt, student feedback, helped flag, student feedback quality score, Truth And Fact-Check score, truth issue list, external-research flag, and truth-review status so tutor behavior can be improved from evidence instead of vibes.

`research_evidence_sources` stores staff-reviewed source claims used by the syllabus and misconception research agent. `lesson_redesign_tasks` stores source-backed changes created from research findings, tutor feedback, and misconception analysis. Unhelpful tutor feedback now projects into `lesson_redesign_tasks` with `owner_agent_id = fun-retention`, so repeated confusion becomes actionable lesson-improvement work in the production data path.

`content_drafts` also stores rich lesson-authoring data, research lineage, and truth-review data for redesign work: unit title, standards tags, essential question, student summary, why-it-matters text, vocabulary, prerequisites, lesson sections, helper notes, common misunderstandings, visual supports, quiz questions, source cards, group homework, lesson-body readiness, review notes, accessibility notes, age-fit notes, source lesson id, source tool call id, redesign task ids, research source ids, truth score, truth issues, external-research flag, and truth-review status. This allows approved research to become a draft while preserving its evidence trail and blocking publication until lesson body, visual, evidence, and Truth And Fact-Check approval are recorded.

`GET /api/bootstrap` is the role-scoped initial read model. It returns only the signed session scope, normalized learner profiles authorized for that role, authorized learner ids, learner-scoped catalogs, approved student visuals, and a compatibility declaration for the legacy snapshot route. Learner profiles join `users`, `students`, guardian links, grade placement, classes, enrollments, and accommodations, then expose only the filtered learner-safe fields. Student, parent, and teacher clients consume those profiles before any development fallback and can hydrate without the broad snapshot route; school-admin and platform-admin maintenance views retain the compatibility path until their remaining screens are migrated.

The broad `GET/PUT /api/state` and `POST /api/state/reset` routes are compatibility and maintenance routes only. In production they require platform-admin access to `app_state_snapshots`; student, parent, teacher, and school workflows must use `/api/bootstrap` and feature-specific scoped reads/writes. The client also short-circuits its shared persistence helper for student, parent, and teacher sessions, so navigation and selected-answer UI state cannot accidentally issue a broad snapshot write.

When a draft is approved for publication, the engine creates a `publishedLessons` record linked to the source draft. Seed projection maps that record into `lessons`, `activities`, `quizzes`, `quiz_questions`, and `lesson_standards`, including visual supports and source cards as auditable activity rows. Published lesson quiz attempts, lesson progress, mastery records, AI tutor logs, and redesign tasks stay linked to the published lesson id instead of falling back to pilot lesson ids.

The app catalog also reads those records for the daily path, Curriculum published catalog, lesson player, quiz completion, mastery tracking, scratchpad writing, interactive model evidence, and tutor context. `GET /api/learning/catalog` is a feature-specific normalized read route: it groups lessons, activities, quizzes, quiz questions, standards, progress, mastery, lesson scratchpads, interactive skill evidence, and attempts from the JSON projection or from Postgres tables. `GET /api/learning/assignments` reads learner-scoped assignment rows, `GET /api/learning/retention-schedules` reads learner-scoped spaced-recall schedules, and `GET /api/learning/portfolio-evidence` reads learner-scoped portfolio artifacts and earned badges for child, parent, and teacher dashboards. Rewards and tutor events intentionally live outside the learning catalog: `GET /api/rewards/approvals` reads learner-scoped reward approval, fulfillment, and parent-action state, while `GET /api/tutor/events` reads learner-scoped tutor quality, feedback, visual hints, first-principles prompts, safety flags, and Truth And Fact-Check review state for child, parent, and teacher summaries. `GET /api/auth/security` now reads account-created identity state from normalized `users`, `students`, `guardians`, `teachers`, relationship, invitation, revocation, consent, accommodation, and `auth_audit_events` rows, then scopes accounts, pending email verification, password reset, and revoked session summaries to the signed role before the setup UI renders them. `GET /api/system/state-dependencies` exposes the current migration audit: focused read routes, focused write routes, remaining broad `/api/state` snapshot routes, and the release rule that student, parent, and teacher production workflows must not depend on broad state hydration. The lesson player combines those scoped routes through `getRepositoryLessonEvidence()` so its interactive widget, scratchpad, tutor retry, quiz, mastery, and reward panels prefer repository rows before falling back to local prototype state. Student learning actions now call `refreshLearningActionReadModels()` after the write returns so quiz, scratchpad, interactive, tutor, and reward screens immediately re-check the scoped repository read path. `POST /api/learning/quiz` is the paired feature-specific write route for quiz completion; it records submitted answers, quiz attempts, lesson progress, mastery records, retention schedules, and learning events through the repository layer instead of using the broad prototype state write. `POST /api/learning/scratchpad` now writes student first-step, explanation, confusion, retry-after-hint, and tutor-review count through the learning-evidence repository slice, and `GET /api/learning/scratchpads` reads those scoped rows for parent/teacher evidence surfaces. Interactive widget attempts now project into `interactive_skill_evidence` with learner, lesson, widget, skill id, diagnosis, recommended support, status, correctness, attempts, and evidence strength so parent and teacher dashboards can persist exact concept-level signals. Classroom routes now use a dedicated classroom repository slice: `POST /api/classroom/session/status` writes `class_sessions`, `POST /api/classroom/artifact` writes student `group_artifacts` plus a learning event, `POST /api/classroom/intervention` writes `teacher_interventions` and updated school report metrics, `GET /api/classroom/evidence` reads class-session artifacts plus intervention history, `GET /api/classroom/monitor` builds teacher/school live-monitor state from normalized class, learner, session, lesson, mission, artifact, intervention, mastery, scratchpad, and interactive-evidence tables, and `GET /api/classroom/student` reads the enrolled learner's attendable class-session shape from the same normalized classroom tables. `GET /api/school/overview` reads school profile, classes, teachers, enrolled learners, pending invitations, and report rows from the normalized school operations tables so school-admin screens can move away from broad state hydration. `GET /api/content/drafts` now reads `content_drafts` from the normalized repository and maps those rows back into app-facing draft fields for authoring and review surfaces. `GET /api/content/visual-assets` reads `visual_assets` rows for staff review, including asset URLs, alt text, captions, licenses, approval status, and draft/lesson links. `GET /api/agent-command-center/reviews` reads `agent_review_items` as a manager-ready decision queue, and `GET /api/audit/events` reads `audit_events` plus `auth_audit_events` for platform-admin operational history.

## Role Model

The role matrix is explicit:

- `student`
- `parent`
- `teacher`
- `school-admin`
- `platform-admin`

PII and child-linked tables are marked for row-level security. Student and parent records must be scoped to the learner or household. Teacher access must be scoped to assigned classes. Admin access must remain operational and auditable.

## Seed Projection

`POST /api/learning/phase` records one same-day, learner-scoped Nexus phase completion in `learning_events`. Phase completion is a small evidence-based XP reward, deduplicated by learner, lesson, phase, and day, and rehydrated through `GET /api/learning/events` so the V3 phase player remains useful after refresh or database reload.

`createProductionSeedProjection(state)` converts current prototype state into table-shaped rows:

- Learners become `students`, `users`, `student_guardians`, `enrollments`, and `accommodations`.
- The Bridge Academy pilot school, class section, class session, group mission, group artifact accountability, teacher intervention, and school report snapshot become `schools`, `classes`, `class_sessions`, `group_missions`, `group_artifacts`, `teacher_interventions`, and `school_reports`.
- Curriculum maps become `grade_bands`, `grade_levels`, `subjects`, `courses`, and `units`.
- Pilot lessons become `lessons`, `activities`, `quizzes`, `quiz_questions`, and `lesson_standards`.
- Mastery and interactive model state becomes `quiz_attempts`, `lesson_progress`, `mastery_records`, `interactive_skill_evidence`, `retention_schedules`, and `learning_events`.
- Content drafts, visual assets, AI tutor events, tool calls, source ledgers, redesign tasks, review items, learning events, experiments, rewards, gift-card fulfillment status, and consent records map to their production tables.

`createNormalizedStateUpsertSql(state)` turns that projection into conflict-safe `insert ... on conflict do update` SQL for the normalized production tables. The Postgres repository uses this during `writeState()` so prototype operations also populate real tables while route-by-route reads are migrated. `writeAccountSecurity()` narrows identity writes to users, guardians, teachers, students, relationship links, session revocations, consent, accommodations, and auth audit rows. `writeLearningEvidence()` narrows that write to quiz attempts, progress, mastery, lesson scratchpads, interactive skill evidence, retention schedules, and learning events for learner evidence routes. `writeTutorWorkflow()` narrows tutor writes to AI tutor events, scratchpads, and learning events. `writeRewardWorkflow()` narrows reward writes to reward approvals and learning events. `writeToolGatewayWorkflow()` narrows staff research/tool writes to agent tool calls, research evidence, redesign tasks, and review items. `writeClassroomWorkflow()` narrows classroom writes to class sessions, group missions, group artifacts, teacher interventions, school reports, and learning events. `writeSchoolOperations()` narrows school setup writes to schools, users, teachers, students, classes, teacher assignments, enrollments, account invitations, and school reports. `writeContentWorkflow()`, `writeVisualWorkflow()`, and `writeAgentReviewDecision()` narrow staff/admin writes to their affected content, visual, published-catalog, tool, tutor, redesign, school/class-session, and review-queue tables.

`writeAccountProvisioning()` is the production account-creation path. It writes only the new provider/local user, linked guardian or teacher, managed student, relationship, consent, and accommodation rows, so a parent signup or child account does not re-project seeded demo records. `createNormalizedTableDeleteMissingSql(state, ["agent_review_items"])` is used only for the derived manager review queue so stale pending review rows are removed after an approval, rejection, or reviewed decision. It is intentionally not used on learner evidence or content history tables.

`createNormalizedTableSelectSql(tableId)` creates bounded, validated read SQL for a specific normalized table. The server exposes this through protected `/api/repository/tables/:tableId` endpoints. `readLearningCatalog()` combines the normalized learning tables into an app-facing catalog read model for `GET /api/learning/catalog`, including `interactiveSkillEvidence`, `latestInteractiveSkillEvidence`, `summary.withInteractiveEvidence`, and `summary.interactiveEvidenceSignals`. `readRewardApprovals()` maps normalized reward rows into learner-scoped reward approval, parent-action, redemption, fulfillment, and gift-card readiness summaries for `GET /api/rewards/approvals`. `readAiTutorEvents()` maps normalized tutor rows into learner-scoped confusion, feedback, first-principles, visual hint, safety, and truth-policy fields for `GET /api/tutor/events`. `readAccountSecurity()` maps normalized identity, relationship, auth audit, and revocation rows into the account-security setup summary for `GET /api/auth/security`. `readPortfolioEvidence()` combines `portfolio_items`, `student_badges`, and `badges` into learner-scoped portfolio and badge summaries for student, parent, and teacher views. `readClassroomEvidence()` combines `class_sessions`, `group_missions`, `group_artifacts`, and `teacher_interventions` into staff-scoped classroom evidence summaries for teacher live monitor metrics. `readClassroomMonitor()` combines classroom, learning-evidence, and roster rows into the teacher live-monitor shape so School/Classroom Mode can be rendered from repository reads instead of broad app state. `readLearnerClassSession()` returns the student-facing class-session shape for an enrolled learner, including class, school, session, lesson, mission, classmates, status, artifact, intervention, mastery, scratchpad, and interactive evidence. `readSchoolOperations()` combines `schools`, `classes`, `teachers`, `students`, `enrollments`, `teacher_class_assignments`, `account_invitations`, and `school_reports` into a school-admin overview used by roster setup and launch-readiness screens. `readContentDrafts()` maps normalized content rows into the app-facing draft anatomy, review-gate, and truth-review fields for `GET /api/content/drafts`. `readVisualAssets()` maps normalized visual rows into review-ready asset cards for `GET /api/content/visual-assets`. `readAgentReviewItems()` maps `agent_review_items` into command-center actions, and `readAuditEvents()` combines `audit_events` with `auth_audit_events` for platform-admin audit review.

## Implementation Files

- `src/schema.js` defines tables, relationships, role access, validation, and seed projection.
- `src/repository.js` provides JSON fallback, Postgres snapshot persistence, normalized table upsert SQL, targeted account provisioning, focused write slices for account security, learning evidence, content workflow, visual workflow, and manager review decisions, the normalized account-security read model, the normalized learning-catalog read model, learner-scoped reward/tutor/portfolio/badge evidence read models, staff-scoped classroom evidence read model, school-operations read model, the normalized content-draft read model, the normalized visual-asset read model, the manager review queue read model, and the audit-event read model.
- `scripts/serve.mjs` exposes protected normalized table inspection endpoints, auth lifecycle write routes, `GET /api/auth/security`, `GET /api/system/state-dependencies`, `GET /api/learning/catalog`, `GET /api/rewards/approvals`, `GET /api/tutor/events`, `GET /api/learning/portfolio-evidence`, `GET /api/classroom/evidence`, `GET /api/school/overview`, `POST /api/learning/quiz`, `POST /api/learning/interactive`, content workflow write routes, visual workflow write routes, `POST /api/agent-command-center/review`, `GET /api/content/drafts`, `GET /api/content/visual-assets`, `GET /api/agent-command-center/reviews`, and `GET /api/audit/events` for route-by-route migration.
- `src/migrations.js` generates PostgreSQL DDL, indexes, comments, and RLS policy SQL from the schema contract.
- `src/accessControl.js` defines repository-level role/table/operation checks before live database wiring.
- `scripts/apply-migration.mjs` applies the generated migration with `DATABASE_URL` and `psql`.
- `scripts/export-normalized-seed.mjs` writes `db/seeds/0001_k12_learning_seed.sql`.
- `src/engine.js` exposes schema readiness helpers and includes the data model in launch readiness checks.
- `src/app.js` renders schema coverage in the Admin view.
- `tests/run-tests.mjs` validates required tables, row-level security flags, relationships, role access, and projection coverage.

## Next Production Step

Continue the persistence migration:

1. Keep `DATABASE_URL` configured for staging/production and run `npm run db:verify` after schema changes.
2. Start the server with `K12_REPOSITORY_MODE=postgres`.
3. Use `npm run export:seed` when a local or staging database needs the current seed projection.
4. Use `GET /api/system/state-dependencies` in the Admin view to track focused read/write route coverage and retire the remaining broad `/api/state` bootstrap, PUT, and reset routes from non-admin production workflows.
5. Add live database integration tests for permissions, lesson progress, quiz attempts, content publishing, AI tutor events, review decisions, and audit-event access.
