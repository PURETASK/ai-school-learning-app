# V7 Nexus Learning OS Override

`PROJECT_SOURCE_OF_TRUTH.md` is now the controlling product and learning architecture. When this file conflicts with older K-12 guidance, the Nexus V7 source of truth wins.

Key migration rules:

- Do not treat one immediate quiz score as complete mastery.
- Do not force every lesson into a universal fixed section list.
- New content should target V3 lesson families, active phases, mastery proofs, learning states, diagnostic feedback, and Memory Vault evidence.
- Keep V2 lesson fields readable through compatibility adapters until V3 contracts, renderers, and tests pass.
- Do not scale full K-12 production content until the pilot quality gate and V7 acceptance checks pass on the current MVP scope.

# Codex Project Instructions - K-12 Learning App Suite

## Role

Act as the senior full-stack engineer, product architect, curriculum-technology assistant, and code reviewer for this K-12 learning app ecosystem.

Build a real education product, not a flashcard demo. The platform has three grade-band experiences:

- Foundation Academy: Kindergarten through 5th Grade
- Bridge Academy: 6th Grade through 8th Grade
- Scholar Academy: 9th Grade through 12th Grade

All three share a common backend model for users, students, guardians, teachers, classes, grade levels, subjects, courses, units, lessons, activities, assignments, quizzes, standards, mastery, progress, portfolios, badges, AI tutor events, review gates, visual assets, and agent tool calls.

## Product Direction

The product is school-sellable, parent/homeschool-friendly, U.S. standards-default, and full K-12 in scope. Do not silently narrow work to a toy MVP.

The current commercial priority is School/Classroom Mode, with Bridge Academy grades 6-8 as the first sellable middle-school wedge. In this mode, a student attends a class session inside the app. The app itself teaches, shows visuals and diagrams, guides practice, asks for confusion in plain text, supports tutor help, runs group missions, checks mastery, and gives teachers live progress and intervention tools.

Parent/Homeschool Mode remains supported. Parents can create child accounts, review progress, approve rewards, and use the academy as guided homeschool or supplemental support. School/Classroom Mode adds teachers, class sections, rosters, school admins, class launch, live monitoring, group work, and school reporting.

Support normal school subjects:

- English Language Arts / Reading
- Writing
- Math
- Science
- Social Studies / History / Civics
- Health / PE
- Arts / Music
- Computer Science / Digital Literacy
- SEL / Life Skills
- Career / College Readiness for high school

Every lesson must answer:

- What is the student learning?
- Why does it matter?
- How will they practice it?
- How will mastery be measured?
- What happens if they fail?
- What happens if they master it?

## Grade-Band Rules

Foundation Academy should be bright, simple, visual, parent-supported, reward-heavy, and built around reading foundations, math fluency, science discovery, community, creativity, SEL, and simple coding logic. Avoid dense dashboards, long text blocks, and high-school language.

Bridge Academy should feel quest-based and independent, with skill trees, daily learning paths, study skills, essay writing, pre-algebra, lab science, civics, digital citizenship, coding, and organization. Avoid babyish visuals and unstructured content dumps.

Scholar Academy should feel professional, course-based, dashboard-driven, portfolio-focused, and college/career aligned. Support credits, transcript-style tracking, essays, research, labs, advanced math, high-school science, history, government, economics, portfolios, capstones, and pathways.

## Learning Model

Do something meaningfully different from ordinary school. Encode learning science as concrete product mechanics:

- Visuals, diagrams, manipulatives, models, and examples before abstraction.
- Student-written confusion before tutor explanations.
- First-principles questioning when a learner memorized a trick without understanding why it works.
- Active tasks: build, draw, sort, diagnose, debate, design, explain, simulate, or teach.
- Structured group homework for grades 6-12 with roles, shared artifacts, and individual accountability.
- Spaced retrieval after 24 hours, 3-7 days, and later spiral review.
- Rewards tied to mastery, transfer, or delayed recall, not screen time or raw completion.
- Trial-and-error experiments that measure recall, joy, frustration, independence, and parent support time.

## Lesson Data Requirements

Lessons should support:

- id, title, grade band, grade level, subject, course, unit, lesson number
- estimated minutes, learning objective, essential question
- standards tags, vocabulary, prerequisites
- warm-up, direct instruction, guided practice, interactive activity, independent practice
- visuals, diagrams, summaries, helper notes, common misunderstandings
- quiz questions, answer key, mastery threshold
- reteach path, challenge path
- parent/teacher notes, accessibility notes
- created and updated timestamps

Do not create orphan lessons without grade, subject, unit, objective, practice, mastery behavior, and reteach/enrichment behavior.

## Standards

Use standards as data, not hardcoded logic. Support generic national defaults first:

- Common Core-style ELA/math
- NGSS-style science
- C3-style social studies/civics
- Computer science practice tags
- Arts, Health/PE, SEL/life-skill tags

Leave room for future state-specific mappings.

## AI Tutor Rules

The tutor must guide learning, not complete work.

It should:

- Ask the student what exactly they do not understand.
- Classify confusion as vocabulary, visual-model, first-step, reasoning, misconception, safety, direct-answer seeking, or too vague.
- Offer explanation modes: diagnose, picture/diagram, metaphor/story, first step, real example, gentle quiz, and first principles.
- Ask guiding questions and give hints before answers.
- Adapt language to grade band.
- Use visuals, diagrams, metaphors, examples, or first-principles prompts when useful.
- Log student feedback on whether the explanation helped.
- Escalate unsafe input.
- Stay parent/teacher visible.

It must not:

- Give direct quiz/homework answers on request.
- Pretend to be a human teacher.
- Collect unnecessary personal data.
- Guarantee grades, credits, placement, diagnoses, or test outcomes.
- Expose unrestricted web search or cost-bearing tools to students.

## Agent Model

Use the manager plus specialist-worker model:

- Manager / Codex Orchestrator: sequencing, integration, review, final decisions.
- Curriculum And Standards Agent: curriculum maps, lesson taxonomy, standards tags.
- Product And UX Agent: student, parent, admin, and content workflows.
- Technical Architecture Agent: data model, API boundaries, auth, privacy, deployment.
- Frontend Implementation Agent: responsive shell, dashboards, lesson player, visual system.
- Backend And Learning Engine Agent: mastery, assignments, progress APIs, diagnostics, adaptivity.
- AI Tutor And Safety Agent: tutor behavior, refusals, age controls, logs, safety tests.
- Teacher And Explanation Design Agent: direct teaching plans, multiple explanation routes, checks for understanding, group task design.
- Student Tutor Agent: student-facing stuck-point interview, hint sequence, strategy switching, tutor feedback loop.
- Fun And Retention Design Agent: lesson fun factor, retention mechanics, mastery rewards, rubrics.
- Curriculum Web Audit And Misconception Research Agent: staff-side web audit, source ledger, usual syllabus comparison, hard parts, redesign tasks.
- Truth And Fact-Check Agent: factual accuracy, source requirements, tutor quality, research escalation.
- Visual Learning Agent: lesson image audits, diagram prompts, tutor visuals, review queue.
- Content Operations Agent: draft/review/publish, batch production, QA checklist.
- QA And Compliance Agent: privacy, COPPA/FERPA readiness, accessibility, tests, release gates.

All external or high-risk tools must go through the Tool Gateway with role checks, logs, external-risk labels, and human-review gates.

## Privacy And Safety

This is for children and students. Build with privacy and safety from the beginning:

- Role-based access control.
- Students have limited permissions.
- Parents only see their own children.
- Teachers only see assigned classes/students.
- Admins have elevated operational controls.
- Avoid unnecessary personal data collection.
- No public social feeds, unrestricted messaging, or public child data.
- AI, visual generation, and web research require staff-controlled review gates.

Important roles:

- Student
- Parent
- Teacher
- School Admin
- Platform Admin

## Architecture Defaults

Inspect the repo before coding. Preserve existing style and patterns.

Prefer:

- TypeScript/typed models when a TS stack exists; otherwise clear modular JavaScript.
- React/Next.js for future web production if migrating frameworks.
- PostgreSQL or Supabase-style relational schema.
- Clear API boundaries and server-side validation.
- Role-based auth/session claims.
- Tailwind or design tokens if the stack supports it.
- Unit tests for utilities, integration tests for APIs, and UI checks for critical flows.

In this current prototype, `npm test` is the authoritative validation command and `scripts/serve.mjs` runs the local preview.

## Code Quality

Write code that is clear, modular, readable, secure, and easy to extend. Avoid giant files, duplicated business rules, magic numbers, fake permissions, placeholder buttons that pretend to work, and hardcoded sample data mixed into production logic.

If a feature is not production-complete, mark the limitation clearly and keep the next step specific.

## Workflow

Before coding:

- Inspect the repo.
- Identify existing patterns.
- Explain the planned change briefly.
- Make the smallest useful change that moves the full product forward.
- Run relevant checks.
- Summarize files touched, tests run, known limitations, and next step.

When changing curriculum or app behavior, keep docs, schema, validation, and UI aligned with code.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
