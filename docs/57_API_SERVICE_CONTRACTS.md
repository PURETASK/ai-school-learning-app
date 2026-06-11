# 57 — API Service Contracts

## Purpose

Defines API/service contracts before endpoint implementation.


---

# V2 Implementation Expansion

## Document Status

- **Version:** 2.0
- **Readiness Target:** Codex-ready implementation guidance
- **Primary Dependency:** AGENTS.md, Product Bible, Core Pillars, MVP Scope
- **Core Learning Loop:** Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply

## V2 Improvements Added

- Adds service boundaries.
- Adds request/response shapes.
- Adds auth/permission notes.
- Adds error conventions.
- Adds versioning notes.
- Adds testable endpoint acceptance criteria.

## What This Document Must Lock

- Keep services modular: curriculum, progress, quiz, mastery, review, dashboard.
- MVP can use local data/service functions before external API endpoints.

## Implementation Requirements

- Define service methods and response errors.
- Never expose data across role boundaries.
- Keep validation server-side when backend exists.

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

- Create service interfaces before wiring UI.
- Mock services in MVP if DB is not ready.

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

## MVP Service Boundaries

| Service | Main Methods |
|---|---|
| CurriculumService | listLessons, getLesson, listUnits, validateLesson |
| QuizService | startAttempt, submitAnswer, completeAttempt |
| MasteryService | calculateMastery, updateSkillMastery, getStudentMastery |
| ReviewService | createReviewItems, getDueReviews, submitReview |
| DashboardService | getStudentDashboard, getParentDashboard |

## Error Shape

```ts
type ServiceError = {
  code: string;
  message: string;
  safeMessage: string;
  status: number;
  details?: Record<string, unknown>;
};
```

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
