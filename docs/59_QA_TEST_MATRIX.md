# 59 — QA Test Matrix

## Purpose

Defines the QA matrix across unit, integration, E2E, accessibility, content, security, and curriculum tests.


---

# V2 Implementation Expansion

## Document Status

- **Version:** 2.0
- **Readiness Target:** Codex-ready implementation guidance
- **Primary Dependency:** AGENTS.md, Product Bible, Core Pillars, MVP Scope
- **Core Learning Loop:** Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply

## V2 Improvements Added

- Adds test categories.
- Adds coverage expectations.
- Adds role/permission tests.
- Adds lesson schema validation tests.
- Adds dashboard tests.
- Adds release gates.

## What This Document Must Lock

- Tests must cover learning logic, not only UI.
- Permission denial tests are required.

## Implementation Requirements

- Create unit tests for mastery/review/adaptive logic.
- Create integration tests for lesson completion.
- Create E2E for first demo flow.
- Validate content files.

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

- Use Vitest for logic tests.
- Use Playwright later for critical flows.
- Add test matrix to every MVP milestone.

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

## MVP Test Matrix

| Area | Test | Priority |
|---|---|---:|
| Lesson validation | Missing required field fails | P0 |
| Quiz engine | Correct/incorrect answers produce feedback | P0 |
| Mastery engine | Boundary scores map to correct bands | P0 |
| Memory Vault | Mastered skill creates Day 1 review | P0 |
| Student dashboard | Shows due lesson/review | P0 |
| Parent dashboard | Shows only linked child | P0 |
| Accessibility | Lesson player keyboard usable | P0 |
| Security | Student cannot access parent route | P0 |

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
