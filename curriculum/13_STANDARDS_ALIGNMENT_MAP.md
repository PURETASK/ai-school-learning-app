# 13 — Standards Alignment Map

> **Project context:** K–12 Learning App Suite with Foundation Academy (K–5), Bridge Academy (6–8), and Scholar Academy (9–12). The platform is a thinking-development and retention platform, not a video/flashcard library. Every curriculum artifact must support the core loop: **Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply**.

## Purpose

This document defines how curriculum artifacts are tagged to standards while keeping the platform flexible across states and districts.

## Locked Core Pillars

Every syllabus, unit, lesson, assessment, activity bank, and review item must support the locked core pillars:

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

## Standards Philosophy

The app should use standards as curriculum metadata, not hardcoded business logic. Generic national-reference tags should come first; state-specific crosswalks can be added later.

## Reference Layers

| Subject Area | Reference Layer |
|---|---|
| ELA / Reading | Common Core-style ELA strands |
| Math | Common Core-style math domains |
| Science | NGSS-style disciplinary/core practices |
| Social Studies | C3-style inquiry/civics/economics/geography/history |
| Computer Science | CSTA-style CS concepts/practices |
| Arts | National Core Arts-style creative process strands |
| Health / PE | SHAPE-style health/PE strands |
| SEL / Life Skills | CASEL-style self-management/social awareness model |

## Standards Tag Format

```txt
[SUBJECT].[GRADE_OR_COURSE].[STRAND].[SKILL]
```

Examples:

```txt
ELA.G3.RI.MAIN_IDEA
ELA.G6.LIT.THEME_EVIDENCE
MATH.G3.OA.EQUAL_GROUPS
MATH.G6.RP.RATIOS
ALG1.EXPRESSIONS.VARIABLES
SCI.G3.LIFE.PLANT_LIFE_CYCLES
BIO.CELLS.SYSTEMS
SS.G6.GEO.RIVER_CIVILIZATIONS
WH1.CIV.RIVER_VALLEYS
CS.G6.ALG.DEBUGGING
```

## Alignment Requirements

Every lesson must include:

- At least one standards tag.
- At least one thinking skill tag.
- At least one skill tag for mastery tracking.
- At least one Memory Vault target.

Every quiz item must include:

- Standards tag.
- Skill tag.
- Difficulty level.
- Misconception target when relevant.

## Crosswalk Rules

When state-specific standards are added later:

1. Do not rewrite lesson IDs.
2. Add crosswalk tables.
3. Preserve generic tag as stable internal reference.
4. Allow multiple state tags per lesson.
5. Version standards mappings.

## Standards QA Checklist

- Tags are specific enough for reporting.
- Tags are not so granular that they become impossible to maintain.
- Tags match the lesson objective.
- Tags connect to assessments.
- Tags support parent/teacher progress reports.

## Universal Review Checklist

Before this document is marked **Approved**, verify that it:

- Aligns to the three-academy structure.
- Supports the full learning loop, not just passive content.
- Identifies MVP scope versus later expansion.
- Includes implementation rules Codex can follow.
- Includes content QA expectations.
- Includes accessibility and child-safety considerations where relevant.
- Connects to standards tags, thinking skill tags, Memory Vault review, mastery bands, and parent/teacher reporting.
- Avoids scope creep by clearly naming what is out of scope for MVP.

## Status Labels

Use these workflow labels for all content artifacts referenced here:

| Status | Meaning |
|---|---|
| `planned` | Artifact exists in the backlog only. |
| `drafting` | Writer/curriculum designer is creating first draft. |
| `needs_review` | Draft is ready for academic/product review. |
| `needs_revision` | Review found required fixes. |
| `approved` | Artifact is ready for app implementation. |
| `implemented` | Artifact exists in the repo/app. |
| `tested` | Artifact has passed QA checks. |
| `published` | Artifact is live or release-ready. |
| `archived` | Artifact is deprecated but preserved for history. |

## Codex Instruction

When Codex modifies files related to this document, it must:

1. Read `AGENTS.md` first.
2. Preserve naming conventions and hierarchy.
3. Avoid creating orphan lessons, units, standards, questions, or review items.
4. Update indexes/tables when adding artifacts.
5. Keep Markdown/JSON human-readable and validation-friendly.
6. Report files changed and how to test them.
