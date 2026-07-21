# 15 — MVP Scope

> **Scope note:** This document describes the representative Grade 3/6/9 learning-engine MVP preserved by `PROJECT_SOURCE_OF_TRUTH.md`. The active first sellable product is narrower and includes the teacher and school-admin capabilities required by `docs/BRIDGE_GRADE_6_MATH_INTERVENTION_PRODUCT_CONTRACT.md`. For commercial sequencing and pilot acceptance, the product contract controls.

## MVP Goal

Prove the core learning engine with three representative grade levels and four core subjects.

The MVP must demonstrate:

```txt
lesson → practice → retrieval → feedback → mastery → spaced review → dashboard
```

---

## MVP Users

Primary:

- Student
- Parent / Guardian

Not required to prove the original learner/guardian vertical slice, but required where assigned by the first-sellable-product contract:

- Teacher
- School Admin
- Platform Admin
- Content Creator
- Curriculum Reviewer

---

## MVP Academies and Grades

| Academy | MVP Grade |
|---|---:|
| Foundation Academy | Grade 3 |
| Bridge Academy | Grade 6 |
| Scholar Academy | Grade 9 |

---

## MVP Subjects

- ELA / Reading
- Math
- Science
- Social Studies

---

## MVP Features

Required:

- Lesson Player
- Quiz Engine
- Feedback Engine
- Mastery Engine
- Memory Vault
- Student Dashboard
- Basic Parent Dashboard
- Content Files

---

## Excluded From The Original Learning-Engine Proof

Do not build first:

- unrestricted or unreviewed AI tutor
- open discussion boards
- teacher classroom features beyond the contracted Grade 6 Math pilot
- school administration beyond pilot setup, roster, role, reporting, and compliance needs
- mobile app
- automated billing, payments, gift cards, and cash-equivalent rewards
- full K–12 curriculum
- advanced content editor
- public social features
- leaderboards

---

## First Demo Flow

```txt
Student logs in
Chooses academy/grade
Sees today's lesson
Completes lesson
Answers retrieval check
Gets feedback
Receives mastery score
Review item enters Memory Vault
Student dashboard updates
Parent sees progress
```

---

## MVP Success Metrics

The MVP is successful if:

- lesson content loads from files
- a student can complete a lesson
- quiz answers are scored
- feedback is shown
- mastery band is assigned
- Memory Vault review item is created
- dashboard reflects progress
- parent can view linked child summary
- no unsafe communication exists
- UX is accessible enough for initial testing

---

## MVP Acceptance Criteria

1. One sample Grade 3 Math lesson works end-to-end.
2. One sample Grade 6 Science lesson works end-to-end.
3. One sample Grade 9 World History lesson works end-to-end.
4. Mastery and review logic function.
5. Student dashboard shows next lesson and review due.
6. Parent dashboard shows progress summary.
7. Content structure can expand without code rewrite.


---

# V2 Implementation Expansion

## Document Status

- **Version:** 2.0
- **Readiness Target:** Codex-ready implementation guidance
- **Primary Dependency:** AGENTS.md, Product Bible, Core Pillars, MVP Scope
- **Core Learning Loop:** Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply

## V2 Improvements Added

- Adds MVP success metrics.
- Adds first demo flow.
- Adds exclusions.
- Adds acceptance criteria.
- Adds risk controls.
- Adds post-MVP expansion path.

## What This Document Must Lock

- MVP = Grade 3, Grade 6, Grade 9; ELA/Reading, Math, Science, Social Studies.
- The first commercial implementation is Bridge Academy Grade 6 Math Intervention Class; its limited teacher, school-admin, and guardrailed tutor workflows are active requirements.
- Mobile, automated billing/payments, gift cards, additional sellable subjects/grades, and full K–12 content production remain deferred until the pilot contract passes.

## Implementation Requirements

- Build one vertical slice before broad expansion.
- Include complete lesson lifecycle from start to review scheduling.

## Data, Permission, and UX Considerations

| Concern | Required Treatment |
|---|---|
| Student data | Collect only what the feature needs; avoid sensitive logs. |
| Role access | Student, parent, teacher, and admin access must be explicit. |
| Accessibility | Use semantic UI, visible focus states, readable language, and non-color-only signals. |
| Empty states | Define what users see when no lessons, reviews, progress, or linked users exist. |
| Error states | Explain what failed and give a safe next action; never expose private internals. |
| Analytics | Track learning events by IDs/tags, not unnecessary personal text. |

## Codex Implementation Instructions

- Use MVP scope to reject unrelated tasks.
- Mark any non-MVP implementation as deferred unless explicitly requested.

## Acceptance Criteria

- Codex can implement from the document without inventing missing product rules.
- MVP requirements are separated from later-phase expansion.
- User roles, data needs, permissions, empty states, errors, and accessibility are considered.
- The document connects back to the core learning loop and locked pillars.
- A reviewer can tell whether a feature is done, incomplete, or out of scope.

## Review Checklist

- [ ] The document separates MVP from later-phase work.
- [ ] The document identifies required data and relationships.
- [ ] The document identifies permissions and safety constraints.
- [ ] The document includes accessibility expectations.
- [ ] The document provides acceptance criteria or completion checks.
- [ ] The document aligns with the 15 locked core pillars.
- [ ] The document avoids passive learning patterns.
- [ ] The document helps Codex build without inventing missing rules.

## Pillar Coverage Reminder

This document should continue to support the locked core pillars:

- Standards-Aligned Curriculum
- First-Principles Problem Solving
- Critical Thinking
- Discussion & Academic Dialogue
- Interpretation
- Evidence-Based Reasoning
- Metacognition
- Retrieval + Spaced Retention
- Inquiry-Based Learning
- Computational + Systems Thinking
- Project-Based Application
- Adaptive Mastery + Feedback
- Fun + Motivation
- Accessibility + Inclusive Learning
- Safe Child-Centered Design
