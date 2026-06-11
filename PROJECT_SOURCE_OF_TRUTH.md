# Project Source of Truth — K–12 Learning App Suite

Status: **canonical**  
Last updated: 2026-06-08 UTC

This file is the controlling source-of-truth for Codex and all contributors. If another document conflicts with this file, this file wins until intentionally revised.

## Official Platform Model

The product is a **K–12 thinking-development and retention learning platform**, not a video library, worksheet repository, or flashcard app.

Official academies:

| Academy | Grade Band | Canonical Slug | Product Role |
|---|---:|---|---|
| Foundation Academy | Kindergarten–5th Grade | `foundation-academy` | Foundational literacy, numeracy, guided play, early reasoning, parent-supported learning |
| Bridge Academy | 6th–8th Grade | `bridge-academy` | Middle-school independence, study skills, research, labs, discussion, pre-algebra/algebra readiness |
| Scholar Academy | 9th–12th Grade | `scholar-academy` | High-school courses, credits, essays, labs, portfolio, capstones, college/career readiness |

## Official Core Learning Loop

```txt
Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply
```

## Official Core Pillars

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

## Official MVP Scope

MVP grades:

| Academy | MVP Grade |
|---|---:|
| Foundation Academy | Grade 3 |
| Bridge Academy | Grade 6 |
| Scholar Academy | Grade 9 |

MVP subjects/courses:

| Grade | Canonical Course Names |
|---:|---|
| Grade 3 | Grade 3 ELA, Grade 3 Math, Grade 3 Science, Grade 3 Social Studies |
| Grade 6 | Grade 6 ELA, Grade 6 Math, Grade 6 Science, Grade 6 Social Studies |
| Grade 9 | English 9, Algebra I, Biology, World History I |

MVP features:

1. Student Dashboard
2. Lesson Player
3. Quiz Engine
4. Feedback Engine
5. Mastery Engine
6. Memory Vault
7. Basic Parent Dashboard
8. JSON/Markdown content loading
9. Lesson validation script

## Official Mastery Bands

| Score Range | Canonical Label | App Action |
|---:|---|---|
| 0–39 | Needs Intervention | Assign intervention path |
| 40–64 | Needs Reteach | Assign reteach lesson |
| 65–79 | Almost Mastered | Assign guided practice |
| 80–89 | Mastered | Schedule spaced review |
| 90–100 | Advanced | Unlock challenge task |

## Official Memory Vault Schedule

| Stage | Timing | Purpose |
|---|---|---|
| Learn | Day 0 | Initial encoding and active practice |
| Quick Recall | Day 1 | First retrieval after sleep/time gap |
| Practice Again | Day 3 | Reinforce and catch weak memory |
| Mixed Review | Day 7 | Interleaved review with other skills |
| Application Task | Day 14 | Apply skill in a new context |
| Mastery Check | Day 30 | Long-term retention check |

## Official Universal Lesson Flow

1. Hook
2. Learning Goal
3. Mini Teach
4. First-Principles Breakdown
5. Worked Example
6. Guided Practice
7. Critical Thinking Checkpoint
8. Evidence-Based Reasoning Task
9. Interpretation / Discussion Task
10. Active Practice
11. Retrieval Check
12. Feedback
13. Mastery Score
14. Spaced Review Scheduling
15. Reflection
16. Reteach or Challenge Path

## Official Repository Paths

```txt
AGENTS.md
README.md
PROJECT_SOURCE_OF_TRUTH.md
CANONICAL_NAMING_CONVENTIONS.md
CODEX_FIRST_BUILD_PROMPT.md
MVP_VERTICAL_SLICE_SPEC.md
REPO_SETUP_COMMANDS.md
LESSON_IMPORT_PLAN.md
LESSON_VALIDATION_RULES.md
FIRST_DEMO_SCRIPT.md

docs/              # Product, engineering, safety, architecture docs 01–60
curriculum/        # Curriculum inventory/control docs 01–20
content/           # Machine-readable lesson JSON organized for app loading
seed-lessons/      # Human-readable lesson pack, answer keys, CSVs, rubrics
schemas/           # JSON schemas
src/               # App source scaffold
scripts/           # Validation/import scripts
tables/            # Planning and audit CSVs
reports/           # Consistency audits and build reports
```

## Deprecated / Superseded Source Packs

The original separate packs are superseded by this master foundation archive. Keep them only for traceability:

- `k12_learning_app_complete_docs_v2`
- `k12_curriculum_inventory_pack_v2`
- `k12_seed_lessons_complete_v2`
- `k12_learning_app_supplemental_docs`

## Codex Rule

Before implementation, Codex must read:

1. `AGENTS.md`
2. `PROJECT_SOURCE_OF_TRUTH.md`
3. `MVP_VERTICAL_SLICE_SPEC.md`
4. `LESSON_IMPORT_PLAN.md`
5. `LESSON_VALIDATION_RULES.md`
6. `docs/15_MVP_SCOPE.md`
7. `docs/55_MVP_BACKLOG_AND_TASK_BREAKDOWN.md`
8. `seed-lessons/LESSON_JSON_SCHEMA_V2.json`


## V5 Source-of-Truth Update

The canonical MVP seed lesson count is now **16 actual lesson files**. This is separate from the **16-step universal lesson flow** required inside every lesson.

### Added V5 Lessons

- FA-G3-WR-U1-L1 — Building a Strong Paragraph
- BA-G6-CS-U1-L1 — Debugging an Algorithm
- SA-G9-STUDY-U1-L1 — Planning, Monitoring, and Evaluating Learning
- SA-G9-FIN-U1-L1 — Budgeting from First Principles

### Added V5 MVP Systems

- Mistake Journal
- Reteach and Intervention Engine
- Challenge and Enrichment Engine
- Problem-Solving Lab
- Evidence Room
- Interpretation Lens
- Discussion Arena
- Learning Planner
- Systems Mapper
- Portfolio / Project Evidence System
