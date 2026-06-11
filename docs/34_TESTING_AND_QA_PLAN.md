# Testing and QA Plan

## Purpose

Define how the platform is tested so learning, safety, and data logic work correctly.

## MVP Test Priorities

1. Lesson loads correctly.
2. Quiz scoring works.
3. Feedback displays correctly.
4. Mastery band calculation works.
5. Memory Vault schedules review.
6. Student dashboard shows progress.
7. Parent dashboard only shows linked student.
8. Accessibility basics pass.

## Test Types

### Unit Tests

- Mastery engine
- Review scheduler
- Quiz scoring
- Permission helpers
- Content validation

### Integration Tests

- Lesson completion flow
- Quiz attempt saving
- Review item creation
- Dashboard summary calculations

### UI/E2E Tests Later

- Student completes lesson
- Parent views progress
- Unauthorized route access blocked

## Manual QA Checklist

- Works on desktop and tablet sizes.
- Keyboard navigation works.
- Error states are friendly.
- Empty states are useful.
- No unsafe social features.

## Implementation Notes for Codex

- Add tests as utilities become stable.
- Do not block MVP with excessive test infrastructure, but core learning logic must be testable.

---

## Definition of Done

This document is usable when:

- The purpose is clear.
- MVP requirements are separated from later-phase requirements.
- Required screens, data, permissions, and edge cases are identified.
- Codex can implement from it without inventing product rules.
- Safety, accessibility, and learning-pillar impacts are considered.


---

# V2 Implementation Expansion

## Document Status

- **Version:** 2.0
- **Readiness Target:** Codex-ready implementation guidance
- **Primary Dependency:** AGENTS.md, Product Bible, Core Pillars, MVP Scope
- **Core Learning Loop:** Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply

## V2 Improvements Added

- Adds MVP versus later-phase boundary.
- Adds user-role implications.
- Adds data dependencies.
- Adds accessibility and safety checks.
- Adds empty/error state expectations.
- Adds acceptance criteria Codex can execute against.

## What This Document Must Lock

- Must align with the saved product loop and core pillars.
- Must not introduce features that bypass child safety or role permissions.
- Must support Grade 3/6/9 MVP before expansion.

## Implementation Requirements

- State screens/components needed.
- List data required and source of truth.
- Define permissions and user states.
- Add validation and QA criteria.
- Define unit, integration, E2E, accessibility, content validation, and permission tests.

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

- Use this document before implementing related feature code.
- Create typed models/components based on the requirements.
- Add TODOs for later-phase items rather than mixing them into MVP.

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
