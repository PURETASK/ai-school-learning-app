# Production Foundation Sprint

This sprint moves the prototype from browser-only state toward a real platform foundation while still avoiding external dependencies.

## Implemented

- Node server API routes:
  - `GET /api/state`
  - `GET /api/auth/session`
  - `POST /api/auth/signup`
  - `POST /api/auth/signin`
  - `POST /api/auth/request-email-verification`
  - `POST /api/auth/verify-email`
  - `POST /api/auth/request-password-reset`
  - `POST /api/auth/reset-password`
  - `POST /api/auth/revoke-session`
  - `POST /api/auth/child-account`
  - `POST /api/rewards/fulfill`
  - `PUT /api/state`
  - `POST /api/state/reset`
  - `GET /api/content/drafts`
  - `GET /api/content/visual-assets`
  - `GET /api/tutor/events`
  - `GET /api/agent-command-center/reviews`
  - `GET /api/audit/events`
  - `POST /api/learning/quiz`
  - `POST /api/learning/interactive`
  - `POST /api/content/lessons`
  - `POST /api/content/status`
- File-backed JSON persistence at `data/app-state.json`.
- Repository abstraction with JSON fallback and PostgreSQL mode through `K12_REPOSITORY_MODE=postgres`.
- Database apply command using `DATABASE_URL` and `npm run db:apply`.
- Normalized seed export at `db/seeds/0001_k12_learning_seed.sql`.
- Postgres repository writes now upsert normalized table rows in addition to the transition snapshot.
- Server-side auth/session claim parsing for student, parent, teacher, school-admin, and platform-admin roles.
- Local signed-session signup/signin for parent, teacher, and student prototype accounts.
- Dedicated account-security repository write path for signup/signin, email verification, password reset, session revocation, and parent-managed child account creation.
- Server-backed tutor ask and feedback routes with learner consent checks and `ai_tutor_events` write permissions.
- Automatic Truth And Fact-Check scoring for server-created tutor turns, including review queue routing when a response needs source checking or human review.
- Draft-level Truth And Fact-Check scoring and publication blocking until manager approval records content truth review.
- OpenAI image generation service with API-key gating, daily limits, estimated cost controls, safety suffixes, and human review.
- Full generated K-12 lesson-library index with 6,100 lesson blueprints.
- Browser API client with local fallback.
- App hydration from server state.
- Persistent save path for learner progress, rewards, experiments, AI logs, placement, and content drafts.
- Admin authoring surface for Grade 3 lesson drafts.
- Rich lesson-draft anatomy for essential questions, learner summaries, why-it-matters text, lesson sections, helper notes, misconception repair, visual supports, quiz checkpoints, source cards, and group homework scaffolds.
- Lesson-body publication gate that blocks drafts missing the teaching anatomy needed for student-facing learning.
- Draft workflow actions for draft, review, and published statuses.
- Draft-to-published lesson conversion that creates curriculum lesson records with activities, visual supports, source cards, quizzes, and standards projection after manager approval.
- Published lesson catalog integration so approved records appear in the daily path, Curriculum published catalog, Admin published-record panel, lesson player, quiz completion, mastery tracking, and AI tutor context.
- Normalized learning-catalog repository read path at `GET /api/learning/catalog`, grouping `lessons`, `activities`, `quizzes`, `quiz_questions`, `lesson_standards`, `lesson_progress`, `mastery_records`, `interactive_skill_evidence`, and `quiz_attempts` from JSON projection or Postgres tables.
- Dedicated quiz-completion repository write path at `POST /api/learning/quiz`, recording submitted answers, quiz attempts, lesson progress, mastery records, retention schedules, and learning events through scoped role checks.
- Dedicated interactive-attempt repository write path at `POST /api/learning/interactive`, recording widget attempts, skill diagnoses, recommended support, learning events, and `interactive_skill_evidence` rows through the learning-evidence slice.
- Parent/admin gift-card fulfillment route with manual and Tremendous-compatible provider modes, amount/daily caps, server-only credentials, and reward fulfillment projection.
- Dedicated content workflow repository write paths for `POST /api/content/lessons`, `POST /api/content/import`, and `POST /api/content/status`, writing content drafts, generated visual records, published lesson catalog rows, and derived manager-review queue rows without re-upserting every production table.
- Dedicated visual workflow repository write paths for visual asset status, replacement, and image-generation review records.
- Dedicated manager-review decision write path at `POST /api/agent-command-center/review`, writing the affected visual/content/tool/tutor/redesign rows and syncing stale pending review items out of `agent_review_items`.
- Normalized content-draft repository read path at `GET /api/content/drafts`, mapping `content_drafts` rows back into app-facing lesson anatomy, review gate, visual support, and truth-review fields.
- Normalized visual-asset repository read path at `GET /api/content/visual-assets`, mapping `visual_assets` rows into review cards with asset URLs, alt text, captions, licenses, status, and draft/lesson links.
- Normalized AI tutor event repository read path at `GET /api/tutor/events`, mapping `ai_tutor_events` rows into learner-scoped confusion analysis, explanation mode, feedback, first-principles, visual-hint, safety, and Truth And Fact-Check audit fields.
- Normalized manager-review repository read path at `GET /api/agent-command-center/reviews`, mapping `agent_review_items` rows into queue actions for visual, content, tool, and AI decisions.
- Normalized audit-event repository read path at `GET /api/audit/events`, combining `audit_events` and `auth_audit_events` for platform-admin operational review.
- Staff-only live curriculum source audit through the Tool Gateway with approved-source URL checks, server-side fetch, snippet extraction, source-ledger payloads, and redesign-task review.
- Published lesson quiz attempts, progress, mastery records, tutor logs, and redesign tasks now stay linked to published lesson ids in normalized projection.
- Interactive widget attempts now create concept-level `interactive_skill_evidence` rows with widget id, skill id, diagnosis, recommended support, correctness, attempts, and status for parent/teacher learning signals.
- Production data model contract with required K-12 tables, role access matrix, RLS flags, seed projection, and readiness checks.
- Grade 3 core pilot lesson coverage across:
  - ELA
  - Math
  - Science
  - Social Studies

## Why This Matters

The app can now preserve state outside the browser and has a basic content-authoring path. This is the first step toward the real platform architecture: persistent curriculum, authoring workflow, learner records, mastery history, consent, rewards, and experiments.

## Current Limits

- Local default persistence is still JSON-file based unless `K12_REPOSITORY_MODE=postgres` and `DATABASE_URL` are set.
- Postgres reads still use the transition snapshot for broad app hydration while normalized feature routes are migrated table by table.
- Auth claims and local account signup/signin are implemented at the server boundary. The local account lifecycle now enforces adult email verification before parent child-account creation, one-time password reset, and server-side session revocation. Production still needs a managed identity provider, real email delivery, provider-backed reset links, rate limits, and account deletion/export workflows.
- API routes are local prototype routes, not hardened production endpoints.
- Gift-card fulfillment has a provider gateway, but production still needs real provider credentials, finance/legal review, fraud controls, and live-provider dry runs before enabling real money movement.
- Authoring now stores rich lesson body structure, but it is still an operational editor rather than a polished curriculum-studio workflow.
- Published draft records now convert into normalized lesson/activity/quiz/progress rows and open in the existing learner lesson player; the learning catalog, content draft, visual asset, AI tutor event, manager review, and audit-event read routes are live.
- The production schema has been applied to the connected Supabase database and verified with `npm run db:verify`.

## Next Foundation Step

Start the server with `K12_REPOSITORY_MODE=postgres`, verify the normalized feature routes against Supabase, then keep reducing the broad transition snapshot by moving additional screens and mutations onto explicit repository functions.
