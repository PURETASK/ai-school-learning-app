# K-12 Learning Academies Build Blueprint

For the full implementation guide covering curriculum, lesson anatomy, student experience, tutor confusion analysis, visuals, truth-policy review, agents, tools, data, build order, and quality gates, use `docs/build-guide.md`.

For the dedicated teacher/tutor/web-audit/visual agent routing model, use `docs/agentic-teaching-system.md`.

## Current Implementation

The first build is a dependency-free responsive web app. It is designed to run locally without package installation and prove the product shape before moving to a production stack.

Implemented surfaces:

- Student daily learning path and academy selector.
- Full K-12 curriculum browser across Foundation, Bridge, and Scholar academies.
- Lesson player with the universal lesson structure, quiz scoring, mastery status, reteach path, and challenge path.
- Parent dashboard with household learners, mastery summary, intervention queue, and assignments.
- Admin/content operations view with draft/review/publish pipeline, readiness checks, and launch gates.
- Guardrailed AI helper surface with direct-answer blocking, safety flagging, lesson-scoped hints, and parent-visible logs.
- Radical Learning Lab view with evidence-backed retention principles, young learner loop, experiment loop, rewards, and motivation model.
- Middle/high lesson experience model with visual prompts, interesting tasks, structured group homework, retention checks, and mastery-tied rewards.
- Bridge Academy School/Classroom Mode pilot slice with school profile, class section, class session sequence, group mission, student/staff classroom preview, student group-evidence submission, teacher live monitor, teacher intervention actions, and school-admin operations page.
- Production schema support for `schools`, `class_sessions`, `group_missions`, `group_artifacts`, `teacher_interventions`, and `school_reports`.
- Classroom API/write path support for class-session status changes, group artifact submission, and teacher intervention records through a dedicated classroom repository slice.
- School-admin roster operations: class creation, learner enrollment, all-or-nothing CSV import, pending student invitations, and school-scoped CSV export through dedicated school repository/API paths.
- Parent setup view with consent readiness, diagnostic placement, accommodations, and family reward configuration.
- Experiment view with learning events, recall scheduling, affect telemetry, experiment templates, and recent variant runs.
- File-backed local API for state persistence and content draft authoring.
- Admin authoring workflow for Grade 3 lesson draft creation, review, and publish status.
- Grade 3 core pilot sample coverage for ELA, math, science, and social studies.
- Agent roster and operating model.

## Product Defaults

- One responsive web app, not three separate apps.
- School/Classroom Mode is the productization priority for selling to schools, with Bridge Academy grades 6-8 as the first sellable wedge.
- Parents and homeschool families remain a supported audience through Parent/Homeschool Mode.
- U.S. national standards are the default baseline, with state overlays later.
- High-school records are internal progress records, not accredited transcripts.
- AI is a lesson-scoped helper, not the source of canonical instruction or grades.
- Learning design optimizes for durable retention, joy, autonomy, competence, relatedness, and measured trial-and-error improvements.

## Production Architecture Path

The static prototype should later move to a modular monolith:

- Web: Next.js and TypeScript.
- Data: PostgreSQL with Prisma.
- Jobs: queue-backed content generation, report snapshots, and review workflows.
- Assets: object storage for portfolio artifacts, lesson media, worksheets, and admin uploads.
- AI: central AI gateway with redaction, moderation, retrieval, policy checks, and audit logs.
- Testing: unit tests, integration tests, and Playwright end-to-end tests.

Core modules:

- `auth`
- `curriculum`
- `contentWorkflow`
- `learning`
- `assessment`
- `mastery`
- `assignment`
- `reporting`
- `portfolio`
- `ai`
- `audit`

## Next Implementation Milestones

1. Add school-admin teacher invitations, group mission authoring, attendance/session records, and report download snapshots.
2. Replace remaining static classroom seed data with persisted curriculum, learner, mastery, class, roster, session, and assignment records.
3. Add school-admin edit screens for schools, class sections, enrollments, group missions, and report export snapshots.
4. Add parent onboarding, learner profiles, consent state, grade placement, and school-linked guardian visibility.
5. Expand grade 3, grade 6, and grade 9 into complete first pilot paths, with grade 6 prioritized for the first middle-school pilot.
6. Add content authoring screens with versioned review and publish states.
7. Add printable worksheets, portfolio uploads, deeper group mission artifact review, and exportable high-school internal records.
8. Replace the demo AI helper with a server-side AI gateway before any production AI use.
9. Expand the Learning Lab into real experimentation infrastructure with variant assignment, delayed-recall scheduling, and parent-approved reward configuration.
10. Run the classroom API/write routes against Supabase with `K12_REPOSITORY_MODE=postgres`, then retire JSON fallback for school pilot flows.
11. Expand authoring from draft metadata to a full lesson block editor and publishing pipeline.
