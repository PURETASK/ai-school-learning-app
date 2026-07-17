# K-12 Learning Academies Build Guide

## Purpose

This guide is the working build manual for the K-12 Learning Academies product. It explains what we teach, how lessons are built, what the student sees and uses, how the experience differs from ordinary school, how the tutor diagnoses confusion, and how truth/fact-checking governs AI and content quality.

The product is not a worksheet app. It is a school-sellable learning academy and parent/homeschool-friendly platform with three age-band experiences:

- Foundation Academy: Kindergarten through grade 5.
- Bridge Academy: grades 6 through 8.
- Scholar Academy: grades 9 through 12.

All academies share the same platform model for curriculum, lessons, quizzes, mastery, assignments, portfolios, rewards, parent controls, content review, AI tutor logs, visual assets, and audit events.

The current productization priority is School/Classroom Mode, especially Bridge Academy for grades 6-8. In this mode, a student attends a class session inside the app: the app teaches directly, shows visuals and diagrams, guides practice, asks for confusion in plain text, supports tutor help, gives group missions, checks mastery, and gives teachers live progress and intervention tools.

Parent/Homeschool Mode remains supported. Parents can create child accounts, review progress, approve rewards, and use the academy as guided homeschool or supplemental support. School/Classroom Mode adds teachers, class sections, rosters, school admins, class launch, live monitoring, group work, and school reporting.

## What We Teach

The curriculum covers normal school subjects across K-12:

- English language arts and reading.
- Writing.
- Math.
- Science.
- Social studies, history, geography, civics, and economics.
- Health and PE.
- Arts, music, and media.
- Computer science and digital literacy.
- SEL, life skills, study skills, and executive function.
- Career and college readiness for high school.

The current curriculum map generates 6,100 planned lesson blueprints across 436 units. Each lesson belongs to an academy, grade, subject, course, unit, standards family, and mastery path. No lesson should exist as an orphan activity.

## Lesson Anatomy

Every full lesson should contain:

- Grade band, grade level, subject, course, unit, lesson number, and standards tags.
- Learning objective and essential question.
- Vocabulary and prerequisite skills.
- Warm-up or prior-knowledge check.
- Direct instruction with a short learner-facing summary.
- Guided practice.
- Interactive activity.
- Independent practice.
- Quiz or checkpoint.
- Answer key and explanation.
- Mastery threshold.
- Reteach path.
- Challenge path.
- Visual or diagram plan.
- Helper notes.
- Common misunderstandings.
- Confusion prompt.
- Parent or teacher notes.
- Accessibility notes.
- Retention checks after the first attempt.
- Reward tied to mastery, transfer, or delayed recall.

For grades 6-12, lessons also need structured group homework with roles, a shared artifact, and individual accountability.

Implementation note: content drafts now store this anatomy directly. A draft carries the essential question, student summary, why-it-matters text, vocabulary, prerequisites, warm-up, direct instruction, guided practice, interactive activity, independent practice, reteach path, challenge path, helper notes, common misunderstanding repairs, visual supports, quiz checkpoints, source cards, and group homework scaffold when the grade band requires it. The publish gate blocks drafts that do not have this lesson body, even if their title and objective exist.

## How We Teach

The teaching model is:

1. Start with curiosity, a concrete object, a story, a visual, a problem, a real-world case, or a student question.
2. Ask what the learner already notices or thinks.
3. Teach with a visual, model, diagram, example, or physical action before abstract symbols when possible.
4. Give a small guided practice step.
5. Ask the learner to explain the idea in plain language.
6. Check for common misunderstandings.
7. Give independent practice.
8. Measure mastery.
9. If mastery fails, send the learner into a targeted reteach path.
10. If mastery passes, give a challenge, transfer task, delayed recall, and reward.

The app should optimize for durable learning, not fast completion.

## What The Student Witnesses And Uses

The student should see:

- A clear daily path.
- The current academy and grade.
- The lesson objective in simple language.
- A meaningful image, diagram, map, model, lab scene, or data visual.
- A short explanation of why the lesson matters.
- A practice task that feels active, not passive.
- A place to write exactly what is confusing.
- A tutor that asks about the stuck point before giving help.
- Common misunderstanding cards.
- Helper notes that explain what to look at, draw, say, or try.
- Quiz feedback that points to reteach or challenge.
- Progress and rewards tied to learning that sticks.

The student should use:

- Lesson visuals.
- Diagrams and callouts.
- Plain-text confusion entry.
- Quizzes and practice tasks.
- Retention checks.
- Group roles for older learners.
- Portfolio artifacts for high school.
- Parent-approved rewards.

In School/Classroom Mode, the student should also see:

- Their class, subject, level, XP, and today objective.
- A class arrival screen and bell ringer.
- A visual mini-lesson taught by the app.
- Live lesson steps that move from hook to guided practice to active task to mastery check.
- Group mission roles for Bridge and Scholar lessons.
- An exit ticket, confidence check, and next recommended step.

## How This Differs From Normal School

Normal school often moves by schedule, worksheet completion, and one-size pacing. This product should move by evidence of understanding.

Key differences:

- The student names the exact confusion instead of silently failing.
- The tutor diagnoses the type of confusion before teaching.
- Lessons include visuals, diagrams, metaphors, examples, and physical or creative tasks.
- Young learners learn through play, movement, story, and parent-supported explanation.
- Middle and high school learners use group roles, shared artifacts, projects, and evidence defense.
- Rewards are tied to mastery, delayed recall, or transfer, not just completing a page.
- The system measures joy, frustration, independence, immediate score, 24-hour recall, and 7-day recall.
- Content is reviewed for evidence, visuals, accessibility, age fit, and truth before publication.

## Confusion-First Tutor Flow

The tutor should not begin by answering. It should ask:

```txt
What exactly do you not understand?
```

The learner writes in plain text. The tutor then classifies the response:

- Vocabulary gap.
- Visual-model gap.
- Missing first step.
- Reasoning gap.
- Known misconception.
- Direct-answer seeking.
- Unsafe or sensitive input.
- Too vague and needs clarification.

After classification, the tutor gives one targeted teaching move:

- A simpler description.
- A diagram suggestion.
- A concrete example.
- A metaphor or analogy.
- A step-by-step hint.
- A prompt to draw, point, compare, explain, or retry.
- A reviewed visual from the Visual Learning Agent.
- A request for staff-side fact-checking if the claim is outside the lesson source.

The tutor should then ask the learner to retry in their own words.

## Tutor Explanation Modes

The student should be able to choose how the tutor helps after writing the stuck point. The current supported modes are:

- Find my stuck point: diagnose the confusion and give one targeted reteach move.
- Show me a picture: use a diagram callout, sketch prompt, or reviewed visual hint.
- Tell me a metaphor: use an age-appropriate story or analogy before the retry.
- Show first step: give only the first action, then ask the learner to continue.
- Give real example: connect the idea to a concrete real-world task.
- Quiz me gently: ask one low-stakes retrieval question focused on reasoning.
- Start from basics: rebuild the idea from what is true, what changes, and what rule must stay true.

This is different from ordinary school help because the student is not forced through one explanation style. The platform should learn which mode repairs confusion for each learner, then use trial-and-error data to improve future recommendations.

After each tutor response, the student should be able to mark whether the response helped, left them confused, felt too hard, or needs a picture. Those outcomes feed tutor-quality metrics by explanation mode and become evidence for redesigning lessons, rubrics, visuals, and future tutor prompts.

If the student marks a tutor response as still confusing, too hard, or needing a picture, the next tutor pass for that lesson should avoid repeating the same teaching style. The adaptive tutor should switch toward a better mode such as picture/diagram support, first-step scaffolding, or first-principles questions. The same feedback also creates a Fun And Retention Agent improvement signal so staff can revise the lesson instead of blaming the learner.

Implementation note: tutor questions and feedback are now server-backed through `/api/tutor/ask` and `/api/tutor/feedback`. These routes use session claims, learner consent, and repository write permissions before recording `ai_tutor_events`.

## First-Principles Teaching Loop

Use first-principles reasoning when the student is lost because they memorized a procedure without understanding the idea underneath.

The tutor should ask:

- What is the basic object, quantity, claim, or system?
- What changes?
- What must stay true?
- What evidence or definition proves that?
- Can the student rebuild the next step from those facts?

For younger learners, simplify the wording:

- What whole thing are we looking at?
- What part changes?
- What has to stay fair, equal, or true?

First-principles help should not become a lecture. It should be a short question sequence that lets the student discover the rule, then retry with a picture, example, or single first step.

## Tutor Response Quality Standard

A good tutor response:

- Names the likely stuck point.
- Uses the lesson objective and teaching support.
- Avoids giving final answers.
- Uses age-appropriate language.
- Gives only one next helpful move.
- Uses visuals or metaphors when helpful.
- Invites the student to explain or retry.
- Logs the interaction.
- Flags safety issues.
- Escalates uncertain factual claims to review.

A bad tutor response:

- Gives the answer without teaching.
- Ignores what the student wrote.
- Uses language too advanced or too childish.
- Makes broad claims without support.
- Overloads the student with too many steps.
- Uses unreviewed images or web content.
- Pretends to be a human teacher.
- Claims official grades, diagnoses, credits, or placement outcomes.

## Truth And Fact-Check Agent

The Truth And Fact-Check Agent reviews tutor and content outputs. It grades:

- Factual accuracy.
- Whether the answer is grounded in the lesson.
- Whether the tutor understood the student's misunderstanding.
- Whether the tutor followed the answer policy.
- Whether the explanation fits the learner's age band.
- Whether a visual, diagram, metaphor, or example would help.
- Whether a first-principles question sequence would repair the misconception.
- Whether external research is required.
- Whether sources, dates, and reviewer notes are needed.

The agent should not expose unrestricted web search to students. If web research is needed, it becomes a staff-side task through the Tool Gateway.

Implementation note: every server-created tutor turn now receives an automatic Truth And Fact-Check review. The AI tutor event stores `truthScore`, `truthIssues`, `needsExternalResearch`, and `truthReviewStatus`. Low-score responses, unsafe responses, or responses that need current/external source checking are routed into the manager review queue before they are treated as approved guidance.

Content drafts also receive a Truth And Fact-Check review record. Drafts store `truthScore`, `truthIssues`, `needsExternalResearch`, and `truthReviewStatus`, and cannot publish until the manager approves the content review item. Evidence, visual approval, accessibility notes, age-fit notes, standards tags, and truth approval all have to pass before a draft becomes publishable.

Truth-policy review steps:

1. Inspect lesson objective, standards tags, teaching support, and common misunderstandings.
2. Inspect the student's plain-text confusion.
3. Inspect the tutor response.
4. Score response quality.
5. Flag unsupported or overbroad claims.
6. Decide whether standards lookup, browser research, or another source check is needed.
7. Return a revision plan.
8. Log the review for manager approval.

## Visual And Diagram Strategy

The Visual Learning Agent scans lessons and drafts for useful visual opportunities:

- Lesson hero visual.
- Teaching diagram.
- AI tutor help card.
- Misconception repair diagram.
- Group homework workflow.
- Draft lesson visual plan.

Generated images must remain review-only until approved. Each image needs:

- Purpose.
- Prompt.
- Caption.
- Alt text.
- Placement.
- Age-band style.
- Safety constraints.
- Human approval status.

Visuals should be used when a student needs to see a relationship, process, comparison, map, system, structure, sequence, or misconception.

## Teacher And Explanation Design Agent

The Teacher And Explanation Design Agent designs the instructional path before a student-facing tutor response or lesson revision is published. It does not browse the web or generate images directly. Instead, it creates a structured plan that other controlled agents can execute.

The agent should produce:

- Confusion profile: vocabulary, visual model, first step, reasoning, misconception, or too vague.
- Teacher plan: launch, direct instruction, checks for understanding, and group task.
- Explanation routes: diagnose, visual, metaphor, first step, real-world example, gentle quiz, and first principles.
- Visual plans: annotated diagram, misconception contrast, process flow, manipulative model, real-world scene, and first-principles map.
- Tutor handoff: first question, mode order, strategy-switch rule, and answer policy.
- Web-audit handoff: staff-only research questions and approved source targets.

This keeps teaching flexible without making the tutor invent unsupported explanations. The teacher agent designs multiple ways to teach; the student tutor asks the learner what is confusing and selects one route; the Visual Learning Agent prepares reviewed visuals; the Truth And Fact-Check Agent grades tutor quality; the Curriculum Web Audit Agent researches outside sources only through staff-controlled review.

Implementation note: the Tool Gateway exposes this as `explanation_variation_studio`. Parent, teacher, school-admin, and platform-admin roles can run it. Student roles cannot run it directly.

## Fun And Retention Design Agent

The Fun And Retention Design Agent audits whether a lesson is worth doing and likely to stick. It scores:

- Curiosity hook.
- Active build or task.
- Visual model.
- Retrieval loop.
- Student choice.
- Mastery-tied reward.

It should recommend concrete redesign moves such as adding a mystery opener, changing passive practice into building or debating, adding misconception repair, or tying a badge to delayed recall instead of completion.

## Syllabus And Misconception Research Agent

The Syllabus And Misconception Research Agent is staff-only. It prepares research plans for:

- Usual U.S. grade/course syllabi.
- Standards sequence before and after the lesson.
- Topics students usually struggle with most and least.
- Why those topics are hard.
- Released-item or practice-guide evidence.
- Better first-principles, visual, task-based, or retrieval-based teaching approaches.

Approved source targets include Common Core math, NGSS science, IES/What Works Clearinghouse guides, NAEP/Nation's Report Card patterns, and state education department course guides. Research outputs must be reviewed before they affect student-facing lessons.

The live web connection is `live_curriculum_source_audit`. It is staff-only, server-side, allowlist-based, and review-gated. It fetches approved curriculum or practice-guide URLs, extracts source snippets, writes source-ledger payloads, and creates redesign tasks for manager review. It must not accept arbitrary student-provided URLs or publish a source claim directly into a lesson.

The agent must produce three structured outputs:

- Source ledger: source id, source name, URL, checked date, claim, likely trouble signal, and redesign move.
- Misconception analysis: likely most difficult parts, likely easier anchor ideas, and why students struggle.
- Redesign tasks: concrete lesson changes with source ids, acceptance criteria, owner agent, and review status.

These outputs map to production tables so staff can audit where a lesson idea came from and why it was changed.

When a manager approves a `syllabus_misconception_research` tool call, the approved redesign tasks should create a content draft in `review` status. The draft must link back to the source tool call, source lesson, redesign task ids, and research source ids. This keeps research out of student-facing lessons until the normal content review and publish gates approve it.

When a manager approves a content draft for publication, the app now creates a linked published lesson record. That record preserves the lesson body, helper notes, misconceptions, visuals, quiz checkpoints, source cards, standards tags, and math evidence moves, then projects into production curriculum tables. Published records join the learner catalog, daily path, Curriculum published catalog, lesson player, quiz completion, mastery tracking, and tutor context. Moving the draft back to review removes that published record so unfinished edits do not stay student-facing.

## Agent Team

The operating agent model:

- Manager Agent: coordinates work, integration, and final decisions.
- Curriculum And Standards Agent: owns K-12 maps and standards tagging.
- Product And UX Agent: owns student, parent, and admin workflows.
- Technical Architecture Agent: owns data model, API boundaries, auth, and deployment.
- Frontend Implementation Agent: owns responsive UI and lesson/player surfaces.
- Backend And Learning Engine Agent: owns mastery, progress, assignments, reports, and adaptivity.
- AI Tutor And Safety Agent: owns tutor behavior, logs, refusals, safety, and age fit.
- Fun And Retention Design Agent: owns lesson fun factor, retention mechanics, rewards, and rubric engagement checks.
- Teacher And Explanation Design Agent: owns direct teaching plans, multiple explanation routes, checks for understanding, and group task design.
- Student Tutor Agent: owns the direct student stuck-point interview, hint sequence, strategy switching, and tutor feedback loop.
- Curriculum Web Audit And Misconception Research Agent: owns staff-side web audit, usual syllabus comparison, common trouble spots, and redesign hypotheses.
- Truth And Fact-Check Agent: owns tutor grading, factual review, source needs, and research escalation.
- Visual Learning Agent: owns image/diagram audits and review-only generation.
- Content Operations Agent: owns draft/review/publish, batch production, and content QA.
- QA And Compliance Agent: owns tests, privacy, accessibility, curriculum integrity, and launch gates.

## Tool And Web Research Policy

Tools must be controlled through the Tool Gateway.

Students cannot trigger:

- Cost-bearing APIs.
- Browser automation.
- Unrestricted web search.
- Public publishing.
- Generated media release.

## Local Account System

The current prototype supports local signed-session accounts for:

- Parent.
- Teacher.
- Student.

The Setup tab exposes signup and signin. Server routes hash passwords with salted `scrypt-sha256`, store local account records, and return signed session tokens. The browser stores the token locally and sends it as `Authorization: Bearer ...`, so API routes can see parent, teacher, or student claims instead of relying only on dev fallback headers.

This is not final production auth. Before launch, replace it with a production identity provider, email verification, password reset, parent-managed child linking, database row-level enforcement, account export, and deletion flows.

Staff can use tools for:

- Standards lookup.
- Lesson audit.
- Truth-policy review.
- Visual generation planning.
- Browser preview checks.
- Content review.
- Curriculum export.
- Live approved-source web audit.

When web research is needed, the system should record:

- Research question.
- Source checked.
- Date checked.
- Reviewer.
- What changed in the lesson or tutor response.
- Whether the result is safe for student-facing use.

## Data And Persistence

The product model includes:

- Users, students, guardians, teachers, classes, and enrollments.
- Academies, grades, subjects, courses, units, lessons, activities, quizzes, and questions.
- Quiz attempts, lesson progress, mastery records, assignments, portfolios, badges, rewards, and retention schedules.
- Content drafts, visual assets, AI tutor events, agent tool calls, review items, audit events, consent records, accommodations, learning events, and experiment runs.

Local preview uses JSON fallback. Production mode uses PostgreSQL-compatible migrations, seed export, role-scoped access checks, and normalized repository table reads.

## Build Order

1. Keep the three-academy curriculum map complete.
2. Build Bridge Academy School/Classroom Mode as the first sellable middle-school wedge.
3. Add teacher class launch, live monitor, school-admin roster/reporting, and student class-session flows.
4. Expand pilot lessons into full grade/course lesson packs.
5. Convert every lesson into the full lesson anatomy.
6. Convert approved drafts into published lesson records and normalized curriculum rows.
7. Launch published records through the student lesson player and tutor path.
8. Add richer visuals, diagrams, and activities.
9. Continue hardening the server-backed confusion-first tutor in the main lesson loop.
10. Expand truth-policy review from content drafts into published lesson audits and recurring source-card reviews.
11. Continue replacing snapshot reads with normalized database reads; the learning catalog/progress, content draft, visual asset, and AI tutor event routes are live, and remaining routes include review decisions and audit events.
12. Connect real auth and role claims.
13. Apply the database migration to a live database.
14. Keep OpenAI image generation behind server-side cost limits and human review, and configure gift-card fulfillment provider credentials only after parent/admin controls are verified.
15. Add external identity, deployment, monitoring, and integration tests.
16. Run controlled learning experiments and keep only variants that improve retention without increasing frustration.

For the exact production execution plan for identity, real database persistence, manager review of live source findings, protected-source fetch handling, and full K-12 lesson-library expansion, use [Production Readiness Build Guide](production-readiness-build-guide.md).

For the school-sellable class product direction, use [School And Classroom Product Plan](school-class-product-plan.md).

## Suggested Improvements

- Keep improving the misconception memory: if a student repeats the same confusion, show a different explanation style instead of repeating the same hint.
- Add explanation mode choices: show me a picture, tell me a story, give me a real-world example, show me the first step, or quiz me.
- Add confidence check-ins before and after help.
- Keep improving tutor grading dashboards for parents and teachers with per-learner trends and reviewer notes.
- Expand source-card review into recurring checks for staff-reviewed factual claims.
- Expand the lesson improvement queue based on repeated confusion patterns into staff assignment and publishing workflows.
- Add student-created diagrams as portfolio artifacts.
- Add a "teach it back" recorder or writing prompt after every tutor interaction.
- Add small-group challenge rooms for Bridge and Scholar learners, with no open chat unless privacy controls are ready.
- Add A/B learning experiments for different explanation styles: diagram-first, metaphor-first, example-first, and movement-first.

## Definition Of Done

A lesson or feature is done only when:

- It is grade-band appropriate.
- It has clear curriculum metadata.
- It includes objective, practice, mastery, reteach, and challenge paths.
- It has visual support or a reason why visual support is not needed.
- It includes common misunderstandings.
- The tutor can ask for and classify confusion.
- Truth-policy review can grade the response.
- Parent/teacher visibility exists where needed.
- Privacy and role access are respected.
- Tests or validation checks prove the behavior.
