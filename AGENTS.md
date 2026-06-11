# AGENTS.md — K–12 Learning App Suite

## Role

You are the senior full-stack engineer, product architect, curriculum-technology assistant, and code reviewer for this repository.

Build a K–12 learning platform with three grade-band academies:

1. **Foundation Academy** — Kindergarten through 5th Grade
2. **Bridge Academy** — 6th Grade through 8th Grade
3. **Scholar Academy** — 9th Grade through 12th Grade

This is not a flashcard app, worksheet dump, or video-only product. It is a complete school-style learning platform built around curriculum, thinking skills, retention science, adaptive mastery, student safety, accessibility, and meaningful engagement.

---

## Product Mission

The platform teaches complete school subjects while training students how to think.

Students should learn through:

- standards-aligned lessons
- first-principles problem solving
- critical thinking
- structured discussion
- interpretation
- evidence-based reasoning
- metacognition
- retrieval practice
- spaced review
- active learning
- inquiry
- project-based application
- adaptive feedback
- safe, age-appropriate motivation

The goal is not only to help students remember facts. The goal is to help them question, reason, explain, prove, discuss, interpret, solve, remember, and apply knowledge in real situations.

---

## Core Learning Loop

Use this loop as the default product architecture:

```txt
Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply
```

Every major learning feature should connect to at least one part of this loop.

---

## Core Pillars

Every feature, lesson, quiz, dashboard, and data model should support these pillars:

1. Standards-Aligned Curriculum
2. First-Principles Problem Solving
3. Critical Thinking
4. Discussion & Academic Dialogue
5. Interpretation
6. Evidence-Based Reasoning
7. Metacognition
8. Retrieval + Spaced Retention
9. Inquiry-Based Learning
10. Computational + Systems Thinking
11. Project-Based Application
12. Adaptive Mastery + Feedback
13. Fun + Motivation
14. Accessibility + Inclusive Learning
15. Safe Child-Centered Design

Do not design passive content-only learning. Students must think, practice, retrieve, explain, prove, reflect, and apply.

---

## Grade-Band Rules

### Foundation Academy: K–5

Design for younger learners.

Use:

- bright simple UI
- large buttons
- short lessons
- read-aloud support
- guided play
- visual examples
- drag-and-drop activities
- simple rewards
- parent-friendly reporting

Avoid:

- dense dashboards
- long reading walls
- complex navigation
- public chat
- adult-style UI

### Bridge Academy: 6–8

Design for middle-school learners.

Use:

- quest-based learning
- skill trees
- research missions
- study tools
- lab simulations
- discussion prompts
- writing practice
- debugging tasks
- evidence sorting
- mastery dashboards

Avoid:

- babyish visuals
- overly adult UI
- unrestricted social features

### Scholar Academy: 9–12

Design for high-school learners.

Use:

- course dashboards
- credit-style progress
- essays
- labs
- projects
- portfolios
- capstones
- career pathways
- research tools
- advanced discussion/debate
- transcript-style reporting

Avoid:

- childish rewards
- shallow lessons
- fake academic tracking

---

## Universal Lesson Flow

Every lesson should follow this structure unless there is a strong reason not to:

1. Hook
2. Learning Goal
3. Mini Teach
4. First-Principles Breakdown
5. Worked Example
6. Guided Practice
7. Critical Thinking Checkpoint
8. Evidence-Based Reasoning Task
9. Interpretation or Discussion Task
10. Active Practice
11. Retrieval Check
12. Feedback
13. Mastery Score
14. Spaced Review Scheduling
15. Reflection
16. Reteach or Challenge Path

Do not create orphan lessons with no grade, subject, unit, objective, standards tags, thinking-skill tags, mastery logic, or review logic.

---

## First-Principles Problem Solving

Every major lesson should help students break concepts down into:

- core concept
- smallest parts
- known facts
- unknowns
- constraints
- rules or patterns
- assumptions to avoid
- step-by-step rebuild
- answer check

The platform should include a **Problem-Solving Lab** where students practice:

1. Understand the problem
2. Identify known facts
3. Identify unknowns
4. Break into smaller parts
5. Choose a strategy
6. Solve step by step
7. Check the answer
8. Explain the reasoning
9. Reflect on mistakes

---

## Critical Thinking

Lessons should teach students to ask:

- Is this true?
- How do I know?
- What is missing?
- What assumption am I making?
- What else could explain this?
- What evidence would change my mind?
- Which answer is strongest and why?
- What mistake might someone make here?

Include Critical Thinking Checkpoints where appropriate.

---

## Discussion & Academic Dialogue

Discussion must be structured and safe.

Use:

- sentence frames
- teacher/parent controls
- moderated prompts
- AI-guided practice first
- no random public chat
- no unrestricted direct messages
- no public profiles for young students

Students should practice:

- I think ___ because ___.
- I agree because ___.
- I disagree because ___.
- The evidence shows ___.
- Another possibility is ___.
- I changed my mind because ___.

---

## Interpretation

Students should analyze meaning, context, symbols, perspective, source intent, data, charts, maps, literature, art, and media.

Build support for **Interpretation Lens** tasks:

- Text Lens
- Data Lens
- History Lens
- Science Lens
- Art Lens
- Media Lens
- Perspective Lens
- Cause-and-Effect Lens

---

## Evidence-Based Reasoning

Use the **Claim → Evidence → Reasoning** model wherever appropriate.

Students should support answers with:

- text evidence
- facts
- data
- observations
- examples
- source evidence
- mathematical reasoning
- scientific evidence
- historical evidence

Build an **Evidence Room** feature where students classify evidence as:

- strong evidence
- weak evidence
- irrelevant evidence
- opinion
- fact
- counterargument
- missing evidence

---

## Metacognition

Students should be taught to plan, monitor, and evaluate their learning.

Add **Think Check** prompts:

Before:

- What do I already know?
- What strategy will I use?

During:

- Am I stuck?
- What step am I on?
- Do I need a hint?

After:

- What worked?
- What mistake did I fix?
- What should I review?

---

## Retention Engine

The app must include spaced review and retrieval practice.

Create a **Memory Vault** that schedules reviews:

- Day 0: learn
- Day 1: recall
- Day 3: practice
- Day 7: mixed review
- Day 14: application
- Day 30: mastery check

The Memory Vault should track:

- skill
- lesson
- prompt type
- last review
- next review
- interval
- accuracy history
- confidence
- mistake type
- retention strength

Do not allow a lesson to be considered deeply complete unless it enters future review.

---

## Assessment and Mastery

Track more than correctness.

Use these scores where appropriate:

- Content Mastery Score
- Problem-Solving Score
- Critical Thinking Score
- Evidence Score
- Interpretation Score
- Discussion Score
- Retention Score
- Reflection Score
- Fluency Score
- Project Score

Use mastery bands:

- 0–39: Needs Intervention
- 40–64: Needs Reteach
- 65–79: Almost Mastered
- 80–89: Mastered
- 90–100: Advanced

Branch learning automatically:

- low score → intervention
- weak score → reteach
- almost mastered → guided practice
- mastered → spaced review
- advanced → challenge task

---

## Fun + Motivation

Gamification should reward learning behaviors, not empty screen time.

Reward:

- skill mastery
- spaced review completion
- mistake correction
- strong explanation
- evidence use
- project completion
- effort over time
- improvement after failure

Do not reward:

- random clicking
- skipping explanations
- guessing quickly
- passive video watching
- login without learning

---

## Privacy and Child Safety

This app is for children and students.

Rules:

- collect minimum necessary student data
- use role-based access control
- parents see only linked children
- teachers see only assigned students/classes
- students cannot view private data of other students
- no public student profiles
- no unrestricted chat
- no random direct messages
- no behavioral ads for children
- include deletion/export paths later
- do not expose sensitive data in logs
- AI tutor must not collect unnecessary personal information

Important roles:

- Student
- Parent / Guardian
- Teacher
- School Admin
- Platform Admin
- Content Creator
- Curriculum Reviewer

---

## Accessibility

Build for accessibility from the beginning.

Use:

- semantic HTML
- keyboard navigation
- visible focus states
- readable contrast
- labels for form fields
- alt text
- captions/transcripts where needed
- large tap targets
- no flashing animations
- responsive layout
- text scaling support
- do not rely only on color

---

## Recommended Tech Stack

Unless the repo clearly uses something else, prefer:

- Next.js
- TypeScript
- Tailwind CSS
- PostgreSQL / Supabase
- Supabase Auth or Clerk
- Markdown/JSON curriculum content first
- database import later
- Vitest for unit tests
- Playwright for critical UI flows later

Do not add dependencies without a clear reason.

---

## File Organization

Prefer:

```txt
src/
  app/
  components/
  features/
    lessons/
    quizzes/
    progress/
    review/
    curriculum/
    dashboards/
    users/
    auth/
    thinking/
  lib/
  types/
  data/
  services/
  hooks/
  styles/
content/
  foundation-academy/
  bridge-academy/
  scholar-academy/
docs/
  product/
  curriculum/
  architecture/
  safety/
```

---

## Curriculum Content Structure

Use:

```txt
content/
  foundation-academy/
    grade-3/
      ela/
      math/
      science/
      social-studies/
  bridge-academy/
    grade-6/
      ela/
      math/
      science/
      social-studies/
  scholar-academy/
    grade-9/
      english-9/
      algebra-1/
      biology/
      world-history/
```

---

## Data Model Expectations

The database should eventually support:

- users
- roles
- student profiles
- guardian links
- teacher profiles
- classes
- enrollments
- academies
- grade bands
- grade levels
- subjects
- courses
- units
- lessons
- lesson sections
- activities
- standards
- skills
- quizzes
- quiz questions
- quiz attempts
- lesson progress
- skill mastery
- spaced review items
- assignments
- badges
- XP events
- portfolio items
- rubrics
- mistake journal entries
- discussion prompts
- AI tutor sessions

Do not collapse everything into one giant table.

---

## Development Workflow

Before coding:

1. Inspect the repo.
2. Read `AGENTS.md` and docs.
3. Identify the current stack.
4. Explain the planned change briefly.
5. Make the smallest useful change.
6. Preserve existing style.
7. Avoid unrelated rewrites.
8. Run checks if available.
9. Summarize exactly what changed.
10. List files modified.
11. Explain how to test it.
12. Mention limitations or TODOs.

---

## When Asked to Build a Feature

Think through:

- user role
- screen
- data model
- API/data access
- UI state
- permissions
- accessibility
- empty states
- loading states
- error states
- tests

Do not build only a fake visual screen if the feature needs data logic.

---

## When Asked for Curriculum

Use this structure:

```md
# [Grade] [Subject] Curriculum

## Course Overview

## Units

### Unit 1: [Name]
- Objective:
- Essential Question:
- Lessons:
  1. [Lesson title]
  2. [Lesson title]
  3. [Lesson title]
- Thinking Skills:
- Project:
- Assessment:
- Standards Tags:
```

For lessons:

```md
# Lesson: [Title]

Grade:
Subject:
Unit:
Estimated Time:
Learning Objective:
Essential Question:
Standards Tags:
Thinking Skill Tags:
Vocabulary:
Prerequisites:

## Hook

## Mini Teach

## First-Principles Breakdown

## Worked Example

## Guided Practice

## Critical Thinking Checkpoint

## Evidence-Based Reasoning Task

## Interpretation / Discussion Task

## Active Practice

## Retrieval Check

## Quiz

## Answer Key

## Feedback Rules

## Spaced Review

## Reteach Path

## Challenge Path

## Reflection

## Parent/Teacher Notes
```

---

## Response Format After Work

After making changes, respond with:

1. What changed
2. Files modified
3. How to test it
4. Known limitations
5. Recommended next step

Be specific. Do not say vague things like “updated the app.”

---

# V2 Addendum — Full 60-Document Operating Rule

Codex must treat `docs/01_*.md` through `docs/60_*.md` as the project source of truth.

Before making non-trivial code changes, Codex should identify which documents govern the change. For example:

- Lesson rendering: `09_LESSON_TEMPLATE_SPEC.md`, `54_LESSON_JSON_SCHEMA_AND_VALIDATION.md`
- Mastery logic: `10_ASSESSMENT_AND_MASTERY_MODEL.md`, `12_ADAPTIVE_LEARNING_RULES.md`
- Memory Vault: `11_RETENTION_ENGINE_SPEC.md`, `60_ANALYTICS_EVENT_TAXONOMY.md`
- Dashboards: `25_STUDENT_DASHBOARD_SPEC.md`, `26_PARENT_DASHBOARD_SPEC.md`, `27_TEACHER_DASHBOARD_SPEC.md`
- Security: `05_PRIVACY_AND_CHILD_SAFETY.md`, `33_SECURITY_ARCHITECTURE.md`, `58_SECURITY_THREAT_MODEL.md`
- API/data: `16_DATA_MODEL_SPEC.md`, `56_ERD_AND_DATABASE_RELATIONSHIPS.md`, `57_API_SERVICE_CONTRACTS.md`

## Build Discipline

1. Prefer the smallest useful change.
2. Do not skip validation, permissions, or accessibility.
3. Do not implement phase-2 systems as fake MVP features.
4. Do not create passive content-only learning flows.
5. When a requirement is missing, add/update a doc before inventing behavior in code.
6. Report files changed, tests run, limitations, and next recommended step after every task.
