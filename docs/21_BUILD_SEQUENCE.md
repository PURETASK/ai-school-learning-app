# 21 — Build Sequence

## Purpose

This document defines the exact implementation order.

Build the learning engine first. Do not start with decoration, full K–12, AI tutor, payments, or social features.

---

## Phase 0 — Preproduction

1. Create docs folder
2. Create Product Bible
3. Create Core Pillars
4. Create Learning Science Core
5. Create Thinking Skills Framework
6. Create MVP Scope
7. Create Lesson Template Spec
8. Create Data Model Spec
9. Create AGENTS.md for Codex

Definition of done:

- product mission locked
- pillars locked
- lesson structure locked
- MVP locked
- data model outlined
- Codex instructions created

---

## Phase 1 — Repo Scaffold

10. Create Next.js + TypeScript app
11. Install Tailwind
12. Create src structure
13. Create content folder
14. Create shared types

Definition of done:

- app runs locally
- folder structure exists
- shared types exist
- docs are committed
- no major feature yet

---

## Phase 2 — Curriculum Foundation

15. Create Grade 3 curriculum maps
16. Create Grade 6 curriculum maps
17. Create Grade 9 curriculum maps
18. Create sample lessons in JSON/Markdown

Definition of done:

- one course map per MVP subject
- at least one sample lesson per academy
- lesson content follows universal template
- sample lessons include review schedule and mastery logic

---

## Phase 3 — Core Learning Engine

19. Build Lesson Player
20. Build Quiz Engine
21. Build Feedback Engine
22. Build Mastery Engine
23. Build Memory Vault

Definition of done:

- student can complete sample lesson
- quiz scoring works
- feedback appears
- mastery band is assigned
- review item is created

---

## Phase 4 — Dashboards

24. Student Dashboard
25. Parent Dashboard
26. Progress reports
27. Weak skill recommendations

Definition of done:

- student sees today’s lesson and review due
- student sees mastery by subject
- parent sees child summary
- weak skills are visible

---

## Phase 5 — Thinking Features

28. Problem-Solving Lab
29. Evidence Room
30. Interpretation Lens
31. Mistake Journal
32. Thinking Cards

Definition of done:

- at least one thinking feature works inside a lesson
- reasoning/evidence/interpreting tasks are trackable
- mistake categories can be stored

---

## Phase 6 — Expansion

33. Teacher system
34. Assignments
35. Portfolio
36. AI tutor
37. Content admin
38. More grades
39. Mobile app

Definition of done:

- only after MVP loop is proven

---

## What Not to Build First

Do not start with:

- random homepage
- pretty landing page
- AI tutor first
- full K–12 content
- public discussion boards
- leaderboards
- mobile app first
- payments
- school admin tools
- complex animations

---

## First Real Build After Docs

```txt
1. Next.js + TypeScript project
2. Tailwind setup
3. Base folder structure
4. Shared TypeScript types
5. Curriculum content folder
6. Sample Grade 3 Math lesson
7. Lesson Player
8. Quiz Engine
9. Feedback Engine
10. Mastery Engine
11. Memory Vault
12. Student Dashboard
13. Parent Dashboard
```


---

# V2 Implementation Expansion

## Document Status

- **Version:** 2.0
- **Readiness Target:** Codex-ready implementation guidance
- **Primary Dependency:** AGENTS.md, Product Bible, Core Pillars, MVP Scope
- **Core Learning Loop:** Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply

## V2 Improvements Added

- Adds phase gates.
- Adds definition of done per phase.
- Adds blocked/unblocked dependencies.
- Adds what not to build first.
- Adds Codex task ordering.
- Adds release-readiness checkpoints.

## What This Document Must Lock

- Build docs, then scaffold, then shared types, then content, then lesson/quiz/mastery/review, then dashboards.

## Implementation Requirements

- Do not start with landing page, AI tutor, payments, or mobile.
- Finish a vertical learning slice before horizontal expansion.

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

- Follow the sequence unless user explicitly overrides.
- When asked to build out of order, warn about dependency risk.

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
