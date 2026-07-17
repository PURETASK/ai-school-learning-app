# Production Readiness Build Guide

## Purpose

This guide turns the current prototype gaps into an exact production build process. It covers five required workstreams:

1. Production identity and account lifecycle.
2. Real database migration and repository-backed persistence.
3. Manager review UI for live source findings.
4. Safer live-source fetch handling for blocked or protected sources.
5. Full K-12 lesson library expansion with richer visual and interactive teaching.
6. School/Classroom Mode productization for a sellable middle-school class experience.

The goal is to move from a local JSON-backed prototype to a production-grade K-12 learning product without weakening the privacy, review, and learning-science rules already established.

Runtime verification must distinguish configured environment variables from a reachable repository. Authenticated school-admin and platform-admin sessions can call `GET /api/runtime/health`; the endpoint probes the normalized `lessons` table, returns latency and repository mode, and intentionally omits credentials and raw database errors from the response. A configuration screen showing `DATABASE_URL=configured` is not sufficient evidence that Postgres is serving requests.

The commercial priority is now a school-sellable product, with Bridge Academy grades 6-8 as the first classroom wedge. Parent/Homeschool Mode remains supported, but production readiness must include teacher, class, roster, school-admin, reporting, and class-session workflows.

## Non-Negotiable Requirements

- Students cannot trigger external browsing, image generation, publishing, or cost-bearing tools.
- Parent, teacher, school-admin, and platform-admin roles must come from trusted session claims, not client-selected dropdowns.
- Parent access must be limited to their own children.
- Teacher access must be limited to assigned classes and students.
- Live source findings must remain staff review material until a manager approves them.
- Lesson changes from external sources must be rewritten in original curriculum language before publication.
- Generated visuals and source-backed lesson changes must pass human review before becoming student-facing.
- Production cannot rely on `data/app-state.json` as the system of record.
- Production cannot store raw passwords in app data.
- The app must teach students directly; teacher-facing plans alone do not satisfy the student experience requirement.
- School/Classroom Mode must enforce teacher-class and school-admin scope before any school pilot.
- Publish, review, visual, evidence, and truth-policy gates must stay centralized in the engine or service layer, then exposed through API and UI.

## Workstream 1: Production Identity

### Recommended Direction

Use a managed identity provider that supports email verification, password reset, JWT/OIDC claims, session revocation, and admin user lifecycle. If the production database is Supabase/Postgres, Supabase Auth is the most direct fit because it aligns with Postgres row-level security. If another provider is chosen, keep the same app-facing auth adapter and verify JWTs through the provider JWKS.

The app should stop owning passwords directly in production. The current local `scrypt` account flow remains useful for local development only.

### Required Roles

- `student`
- `parent`
- `teacher`
- `school-admin`
- `platform-admin`

### Required Identity Claims

Every authenticated request must resolve to a server-trusted session object:

```txt
userId
email
emailVerified
role
scope
studentId, when role is student
guardianId, when role is parent
teacherId, when role is teacher
schoolId, when school-scoped
classIds, when teacher-scoped
revokedBefore, optional session invalidation marker
issuedAt
expiresAt
```

Client-provided role values may be used only for local preview tooling. Production endpoints must ignore client role dropdowns and use verified session claims.

### Required Account Flows

#### Parent Signup

1. Parent creates account through identity provider.
2. Provider verifies email.
3. App creates `users` row with role `parent`.
4. App creates or links `guardians` row.
5. Parent creates child profile or accepts child-link invitation.
6. Parent grants consent for student AI helper, tutor logging, and visuals according to policy.
7. Parent sees only linked child data.

#### Teacher Signup

1. Teacher creates account through identity provider.
2. Provider verifies email.
3. School admin or platform admin approves teacher role.
4. App creates `users` and `teachers` rows.
5. Teacher is assigned classes.
6. Teacher sees only assigned students, classes, assignments, and reports.

#### Student Signup

Preferred production pattern:

1. Parent or teacher creates an invitation.
2. Student account is created with minimal profile data.
3. Student account links to `students` row.
4. Parent consent is required before AI helper, tutor logs, or generated-media interactions are enabled.
5. Student cannot create unrestricted external tool calls.

Direct student self-signup should be disabled unless parent verification and consent are built into the flow.

For parent-created provider-backed child accounts, configure `SUPABASE_CHILD_EMAIL_DOMAIN` to a verified school-owned domain. The parent-facing username is stored on the application account, while Supabase Auth receives a managed address such as `child-username@<domain>` with `email_confirm=true`; student username login resolves that address through the scoped `users` repository record. The child password is sent only to Supabase Auth and is never stored in application state.

### Required Account Lifecycle Features

- Email verification.
- Password reset.
- Change email.
- Change password.
- Session revocation for one device.
- Session revocation for all devices.
- Account disable/suspend.
- Role change approval workflow.
- Parent-child link request.
- Parent-child unlink request with audit record.
- Teacher-class assignment and removal.
- Parent-created child provisioning through the provider admin user endpoint, including rollback if the application account cannot be persisted.
- Account deletion/export workflow.
- Audit log for role changes, child links, consent changes, and revocations.

### Database Requirements

Add or confirm these tables and relationships:

```txt
users
students
guardians
teachers
classes
enrollments
guardian_student_links
teacher_class_assignments
student_consents
account_invitations
session_revocations
auth_audit_events
```

If the identity provider owns password reset and email verification, do not duplicate password tokens in app tables. Store only app-specific account state, links, roles, consent, and audit records.

### API Requirements

```txt
GET  /api/auth/session
POST /api/auth/logout
POST /api/auth/revoke-session
POST /api/auth/revoke-all-sessions
POST /api/account/invitations
POST /api/account/invitations/accept
POST /api/account/child-links
POST /api/account/child-links/:id/approve
POST /api/account/child-links/:id/revoke
POST /api/account/teacher-assignments
POST /api/account/teacher-assignments/:id/revoke
GET  /api/account/audit-events
```

Production `POST /api/auth/signup` and `POST /api/auth/signin` should either be removed or converted into provider-backed wrappers. They must not keep local password hashes as the production auth source.

### Acceptance Criteria

- Unverified email cannot access student records or staff tools.
- Student cannot call `live_curriculum_source_audit`.
- Parent can view only linked children.
- Teacher can view only assigned classes/students.
- Platform admin can revoke a session and the old token stops working.
- Role change creates an audit event.
- Parent-child link and unlink create audit events.
- Auth tests cover valid token, expired token, revoked token, wrong role, wrong child, wrong teacher assignment, and missing consent.

## Workstream 2: Real Database And Repository Calls

### Recommended Direction

Use the generated SQL migration as the database foundation, then replace JSON snapshot access route by route. Keep the JSON repository only for local development fallback.

Production should use:

```txt
DATABASE_URL
APP_ENV=production
AUTH_ISSUER
AUTH_AUDIENCE
AUTH_JWKS_URL
AUTH_SESSION_SECRET only for local fallback, not primary production auth
```

For the current Supabase project, `SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL` can provide the auth issuer default, and `SUPABASE_JWKS_URL` points to the Supabase JWKS endpoint. Public keys can be exposed to browser code; `SUPABASE_SECRET_KEY`, service-role keys, and the Postgres database password must stay server-only.

For this app's current transition snapshot bridge, use the exact URI copied from Supabase's Connect dialog. The Session Pooler URI is valid for IPv4-only networks; the direct `db.<project-ref>.supabase.co` host may require Supabase's IPv4 add-on. A reachable host is not proof of valid credentials: `npm run supabase:check` must report `psqlQuerySucceeded=true` before any migration is applied. If it reports password authentication failure, reset the database password in Supabase Database Settings, replace only the password portion of `DATABASE_URL` in the local `.env`, and rerun the check.

### Migration Process

1. Provision a Postgres-compatible database.
2. Create a staging database before production.
3. Set `DATABASE_URL` for staging.
4. Run Supabase/database preflight:

```powershell
npm run supabase:check
```

Expected preflight evidence is `projectReachable=true`, `jwksReachable=true`, `dbTcpReachable=true`, and `psqlQuerySucceeded=true`. The checker reports only safe connection metadata; it never prints the password. Do not proceed to `db:apply` when PostgreSQL authentication fails.

5. Run local validation:

```bash
npm test
npm run export:migration
npm run export:seed
```

6. Apply the generated migration to staging:

```powershell
npm run db:apply
```

7. Verify table count, indexes, and RLS policies.
8. Apply seed data only to development or staging unless the seed is explicitly production-approved.
9. Run repository smoke tests against staging.
10. Repeat for production after backup and approval.

### Repository Replacement Order

Replace JSON access in this order:

1. Auth/session and account records.
2. Learner catalog and published lessons.
3. Lesson progress, quiz attempts, mastery records, retention schedules, and learning events.
4. Content drafts and publish workflow.
5. Visual assets and visual review.
6. AI tutor events and tutor feedback.
7. Tool call logs and live source ledger.
8. Agent review items and manager decisions.
9. Audit events.
10. Experiments, retention checks, rewards, and portfolios.

The current repository exposes normalized read models for learning catalog, content drafts, visual assets, tutor events, manager review items, and audit events. Implemented write slices now include auth/account lifecycle routes through `writeAccountSecurity()`, reward requests/decisions/gift-card fulfillment through the learning-evidence slice, `POST /api/learning/quiz` through `writeLearningEvidence()`, content draft/import/status routes through `writeContentWorkflow()`, visual status/replacement/generation routes through `writeVisualWorkflow()`, and manager review decisions through `writeAgentReviewDecision()`. The review-decision slice syncs the derived `agent_review_items` table so approved or rejected items do not stay in the queue. Continue moving tutor writes, tool/source-ledger writes, audit writes, experiments, and portfolios onto explicit repository functions.

### Required Repository Functions

```txt
readSessionUser(userId)
readGuardianChildren(guardianId)
readTeacherAssignments(teacherId)
readLearnerCatalog(learnerId)
writeLessonProgress(input)
writeQuizAttempt(input)
writeMasteryRecord(input)
readContentDrafts(filters)
writeContentDraft(input)
updateContentDraftStatus(input)
readVisualAssets(filters)
updateVisualAssetStatus(input)
writeTutorEvent(input)
writeTutorFeedback(input)
writeToolCallLog(input)
writeResearchEvidenceSource(input)
writeLessonRedesignTask(input)
readAgentReviewItems(filters)
writeAgentReviewDecision(input)
writeAuditEvent(input)
```

### Database Safety Requirements

- RLS policies must enforce role and ownership checks.
- App service role must be limited and audited.
- Student-facing endpoints cannot use admin bypass paths.
- All writes must validate server-side.
- All external-tool writes must include owner agent, role, risk label, review status, and actor id.
- Migrations must be repeatable in staging from a clean database.
- Backups must exist before production migrations.

### Acceptance Criteria

- `APP_ENV=production` fails startup if `DATABASE_URL` is missing.
- Production mode does not write to `data/app-state.json`.
- Catalog reads come from normalized lessons/activities/quizzes/progress tables.
- Quiz completion writes submitted answers, attempts, progress, mastery, recall schedules, and learning events through a scoped repository route.
- Tool logs and source ledgers persist to database tables.
- Manager review decisions persist without snapshot bridge.
- Tests cover repository reads/writes for each converted route.
- Migration validation passes before and after applying to staging.

## Workstream 3: Manager Review UI For Live Source Findings

### Purpose

Live source findings are research evidence, not curriculum. The manager review UI must make staff approve, reject, or request revision before a source-backed finding changes any lesson.

### Required Review States

```txt
needs-human-review
approved-for-draft
needs-revision
rejected
applied-to-draft
published
archived
```

### Required UI Surfaces

#### Manager Review Queue

Each live source item should show:

- Source name.
- Source URL.
- Fetch status.
- Checked date.
- Reviewer.
- Lesson target.
- Extracted snippets.
- Proposed claim.
- Proposed redesign move.
- Risk label.
- Whether source was fully fetched, blocked, partial, or manual-review-only.
- Approve, reject, and request revision actions.

#### Source Evidence Detail

The detail view should show:

- Original source URL.
- Title and description.
- Snippets extracted.
- Tool call log.
- Approved-source allowlist status.
- Staff notes.
- Claim rewrite field.
- Lesson section affected.
- Linked redesign task.
- Linked draft, when created.

#### Draft Creation Action

Manager approval should not directly modify a published lesson. It should create or update a content draft in `review` status.

Required draft metadata:

```txt
sourceToolCallId
sourceEvidenceIds
redesignTaskIds
managerReviewerId
approvedAt
claimRewrite
affectedLessonSection
reviewStatus
```

### API Requirements

```txt
GET  /api/review/source-findings
GET  /api/review/source-findings/:id
POST /api/review/source-findings/:id/approve
POST /api/review/source-findings/:id/reject
POST /api/review/source-findings/:id/request-revision
POST /api/review/source-findings/:id/create-draft
```

### Rules

- Approval creates a draft, not a published lesson.
- The draft still needs content, truth, visual, accessibility, age-fit, standards, and manager publish gates.
- Rejected source findings cannot be used by the tutor or lesson player.
- Blocked or partial fetch results require manual reviewer notes before approval.
- Reviewer must rewrite source claims in original language.

### Acceptance Criteria

- A fetched IES source finding appears in the manager review queue.
- Manager can inspect snippets and source metadata.
- Manager approval creates a linked draft in `review` status.
- Manager rejection prevents draft creation.
- Published lesson does not change until draft passes publish gates.
- Every decision writes an audit event.

## Workstream 4: Better 403 And Protected Source Handling

### Boundary

The system must not bypass paywalls, logins, CAPTCHAs, robots restrictions, or site access controls. A `403` is a signal to use an alternate approved source path or manual review, not a reason to evade protections.

### Required Fetch Outcomes

```txt
fetched
blocked-403
not-found-404
timeout
invalid-url
not-allowlisted
requires-manual-review
requires-browser-review
source-too-large
unsupported-content-type
```

### Improved Fetch Process

1. Confirm URL is HTTPS and allowlisted.
2. Try normal server fetch with timeout.
3. Record status code, content type, final URL, and response size.
4. If `200`, extract title, description, headings, and evidence snippets.
5. If `403`, mark as `blocked-403`.
6. Check whether an approved alternate URL exists for the same source.
7. If alternate exists, queue a second staff-only fetch attempt.
8. If alternate does not exist, create a manual-review task.
9. Never publish claims from a blocked fetch without human source notes.

### Approved Alternatives

For protected pages, staff may add approved alternatives such as:

- Official PDF version.
- Official downloadable practice guide.
- Official summary page.
- Official standards landing page.
- State education department mirror.
- Citation-only manual review entry.

Each alternate must be stored in the allowlist with:

```txt
sourceName
canonicalUrl
alternateUrl
host
sourceType
allowedUse
addedBy
approvedBy
approvedAt
notes
```

### API Requirements

```txt
GET  /api/source-allowlist
POST /api/source-allowlist
POST /api/source-allowlist/:id/approve
POST /api/tool-gateway/execute live_curriculum_source_audit
POST /api/review/source-findings/:id/manual-notes
```

### UI Requirements

The live source audit result should clearly show:

- `Fetched` when content was extracted.
- `Blocked by source` when status is `403`.
- `Manual review required` when the source could not be fetched.
- Alternate source suggestions when available.
- Reviewer note field for manual source evidence.

### Acceptance Criteria

- `403` source does not appear as a successful evidence extraction.
- `403` source creates a manual-review task.
- Approved alternate source can be fetched and linked to the canonical source.
- Student roles cannot see source-fetch internals.
- Review queue distinguishes fetched evidence from blocked/manual evidence.

## Workstream 5: Full K-12 Lesson Library And Richer Teaching

### Scope

The platform should keep the full K-12 scope active:

- Foundation Academy: K-5.
- Bridge Academy: 6-8.
- Scholar Academy: 9-12.
- All core subjects plus arts, health/PE, computer science, SEL/life skills, and career/college readiness.

The generated lesson library is the planning layer. Student-facing lessons must be produced, reviewed, enriched, and published in batches.

### Required Lesson Content

Every student-facing lesson needs:

```txt
gradeBand
gradeLevel
subject
course
unit
lessonNumber
title
estimatedMinutes
learningObjective
essentialQuestion
whyItMatters
standardsTags
vocabularyTerms
prerequisiteSkills
warmUp
directInstruction
guidedPractice
interactiveActivity
independentPractice
quizQuestions
answerKey
masteryThreshold
reteachPath
challengePath
helperNotes
commonMisunderstandings
visualSupports
diagramPrompts
tutorHandoff
parentTeacherNotes
accessibilityNotes
retentionChecks
rewardPlan
sourceCards
reviewStatus
```

Grades 6-12 additionally require:

```txt
groupHomework
collaborationRoles
sharedArtifact
individualAccountability
discussionOrDefensePrompt
```

High school additionally requires:

```txt
creditOrCourseTrack
portfolioArtifact
careerOrCollegeConnection
capstoneConnection, when relevant
```

### Content Production Pipeline

1. Generate unit and lesson blueprint.
2. Run standards mapping.
3. Run syllabus and misconception research planner.
4. Run live approved-source audit when needed.
5. Create lesson draft.
6. Add visuals, diagrams, helper notes, summaries, and misunderstanding repairs.
7. Add quiz and mastery behavior.
8. Add reteach and challenge paths.
9. Add retention checks and reward plan.
10. Run Fun And Retention Agent.
11. Run Truth And Fact-Check Agent.
12. Run Visual Learning Agent.
13. Human reviews content, visuals, source claims, accessibility, and age fit.
14. Publish only after all gates pass.
15. Monitor tutor feedback and learner outcomes.
16. Create redesign tasks from repeated confusion or low retention.

### Batch Plan

Use batch sizes that are small enough for review:

```txt
Pilot batch: 6 lessons
Review batch: 25 lessons
Production batch: 100 lessons
Grade-subject release: 250-500 lessons
Full library target: 5,000-7,000 reviewed lessons
```

Each batch must include:

- Batch id.
- Academy and grade range.
- Subjects.
- Unit ids.
- Source policy.
- Reviewer list.
- Acceptance criteria.
- Test results.
- Publish decision.

### Visual And Interactive Requirements

Each lesson must include at least two visual supports:

- One core teaching visual.
- One tutor or misconception repair visual.

Use visual types based on topic:

- Math: number line, area model, graph, manipulative diagram, worked-example map.
- Science: system diagram, lab setup, cycle, cause-effect model, data visual.
- ELA: story map, claim-evidence organizer, vocabulary image, writing structure.
- Social studies: timeline, map, primary-source frame, decision diagram.
- Computer science: flowchart, algorithm trace, interface sketch, data model.
- Health/PE/SEL: routine card, body-system diagram, decision tree, reflection map.
- Arts/music: composition guide, media storyboard, pattern diagram.
- Career/college: pathway chart, finance model, portfolio map, application timeline.

Interactive tasks should ask students to build, draw, sort, diagnose, debate, design, explain, simulate, or teach.

### Acceptance Criteria

- No orphan lessons.
- Every lesson has standards tags, objective, practice, quiz, mastery behavior, reteach path, challenge path, visuals, helper notes, and common misunderstanding repair.
- Every 6-12 lesson has group homework with roles and individual accountability.
- Every published visual has caption, alt text, age fit, and approval status.
- Tutor can use lesson context and reviewed visuals without inventing unsupported claims.
- Student feedback can create redesign tasks.
- Published lesson records appear in learner catalog, lesson player, mastery tracking, parent dashboard, and repository projection.

## Cross-Workstream Build Order

### Phase 0: Freeze Current Prototype Contract

Run:

```bash
npm test
npm run export:migration
npm run export:seed
```

Record current behavior for:

- Local auth signup/signin.
- Live source audit.
- Manager review queue.
- Content draft publish gates.
- Lesson player.
- Tutor ask and feedback.

### Phase 1: Database Staging

1. Provision staging Postgres.
2. Apply migration.
3. Run seed only in staging.
4. Point repository reads to staging.
5. Verify catalog, content drafts, visual assets, tutor events, tool logs, and review queue.

### Phase 2: Production Auth Adapter

1. Add provider JWT verification.
2. Map provider users to app roles and profiles.
3. Add parent-child link flows.
4. Add teacher assignment flows.
5. Add session revocation.
6. Replace local signup/signin in production.
7. Keep local auth only for development.

### Phase 3: Repository Write Replacement

1. Move progress, quiz, mastery writes. First slice complete: `POST /api/learning/quiz`; continue remaining learner-evidence actions.
2. Move content draft and publish writes. Complete for draft creation, batch import, status changes, visual generation/review, and manager review decisions.
3. Move visual asset review writes. Complete for status changes, replacements, generated assets, and derived review queue sync.
4. Move tutor event and feedback writes.
5. Move remaining tool-log, source-finding, audit-event, account, experiment, reward, and portfolio writes.
6. Disable JSON writes in production.

### Phase 4: Review UI Hardening

1. Split source findings from generic review items.
2. Add source detail view.
3. Add approve/reject/request-revision flow.
4. Approval creates draft, not published lesson.
5. Add blocked-source/manual-review state.

### Phase 5: Content Scale

1. Pick one grade-subject track.
2. Build 25 reviewed lessons.
3. Run student/tutor UX review.
4. Expand to 100 lessons.
5. Add source and visual review dashboard metrics.
6. Expand grade by grade.

### Phase 6: Launch Gate

Production launch is blocked until:

- Real identity provider is active.
- Email verification and password reset are active.
- Session revocation works.
- Parent-child links are enforced.
- Teacher-class assignments are enforced.
- Database is the production source of truth.
- JSON persistence is disabled in production.
- Manager review source findings flow works.
- `403` and blocked-source handling works.
- At least one grade-subject track has reviewed student-facing lessons.
- Accessibility, privacy, tutor safety, source review, and visual approval checks pass.

## Validation Commands

Run these after each meaningful change:

```bash
npm test
npm run export:migration
npm run export:seed
```

For database work, also run:

```powershell
npm run db:verify
psql $env:DATABASE_URL -c "\dt"
psql $env:DATABASE_URL -c "select count(*) from public.lessons;"
psql $env:DATABASE_URL -c "select count(*) from public.agent_review_items;"
psql $env:DATABASE_URL -c "select count(*) from public.research_evidence_sources;"
```

For browser verification:

```txt
Open http://localhost:4173/
Verify Setup account flow.
Verify Tools live source audit.
Verify Admin review queue.
Verify Lesson tutor flow.
Verify browser console has zero errors.
```

## Immediate Next Implementation Tasks

1. Add school-admin repository/API routes for teacher invitations, attendance/session records, and report download snapshots. Group mission editing is now implemented through the teacher classroom command surface and the normalized `group_missions` repository slice.
2. Wire a concrete provider, such as Supabase Auth, Clerk, Auth0, or another OIDC provider, into the production auth adapter.
3. Keep the server running with `K12_REPOSITORY_MODE=postgres` and verify each converted normalized feature route against Supabase.
4. Add Source Findings review view in the Admin or Tools area.
5. Change `403` live audit wording from completed extraction to blocked/manual-review status.
6. Add allowlist alternate-source records.
7. Produce the first 25-lesson reviewed Bridge Academy class-session batch for one middle-school subject track.
8. Add visual/interactive task QA metrics to the content batch validator.
9. Package teacher guide, school-admin setup guide, student guide, parent letter, and pilot QA checklist.
10. Add OneRoster/Clever/ClassLink adapters only after the CSV contract and school permission tests are used in a staging pilot.

Completed groundwork:

- `src/productionAuth.js` defines provider-neutral verified-claims mapping and production auth readiness checks.
- Production mode with `AUTH_PROVIDER` configured rejects local prototype tokens by default.
- `account_invitations`, `guardian_student_links`, `teacher_class_assignments`, `session_revocations`, and `auth_audit_events` are in the production schema and migration.
- The Bridge Academy School/Classroom Mode shell now has a student/staff preview, student group-evidence submission, teacher live monitor, teacher launch/status controls, teacher intervention creation/resolution, school-admin operations page, dedicated classroom API/write routes, and normalized schema tables for schools, class sessions, group missions, group artifacts, teacher interventions, and school reports.
- Teacher classroom operations now include validated group mission editing with role labels, shared artifact requirements, individual accountability evidence, teacher look-fors, and normalized repository persistence through `PUT /api/classroom/mission`.
- School-admin operations now include class creation, learner enrollment, all-or-nothing CSV roster import, pending student invitations, and school-scoped CSV export through `writeSchoolOperations()`.
- `npm run db:verify` checks a staging database after migration apply.

### Provider-backed Supabase Auth

Production identity uses Supabase Auth rather than the local preview password store.
Set these server variables:

```env
NODE_ENV=production
AUTH_PROVIDER=supabase
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SECRET_KEY=your-server-only-secret-key
SUPABASE_JWKS_URL=https://your-project-ref.supabase.co/auth/v1/.well-known/jwks.json
AUTH_EMAIL_REDIRECT_TO=https://your-app.example.com/
AUTH_PASSWORD_RESET_REDIRECT_TO=https://your-app.example.com/
```

The server now verifies Supabase bearer JWT signatures against the configured JWKS endpoint, validates issuer/audience/expiry/email verification/role claims, and rejects local HMAC session tokens in production by default. Signup, sign-in, verification resend/confirmation, password-reset request/update, refresh-token rotation, and current-session logout have provider-backed REST contracts. The API client stores the provider refresh token for automatic access-token renewal. Authorization roles must be provisioned in Supabase `app_metadata` or resolved from the normalized `users` table; editable `user_metadata` is never used for authorization.

The local password and action-token flows remain available only for development preview. Provider logout now writes current-session or revoke-before records through the repository, and every authenticated request checks normalized `session_revocations`. This enforcement still requires the production migration and valid database credentials to be active.
