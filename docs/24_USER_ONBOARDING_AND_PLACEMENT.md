# User Onboarding and Placement

## Purpose

Define how students, parents, and later teachers enter the system and how students are placed into the right academy, grade, subject level, and starting lesson.

## MVP Onboarding

### Parent-Created Student Account

1. Parent creates account.
2. Parent creates student profile.
3. Parent selects grade level.
4. App assigns academy automatically.
5. Student receives starting dashboard.

### Student Profile Fields

- Display name or nickname
- Grade level
- Academy
- Reading support needed yes/no
- Accessibility preferences
- Parent/guardian link

## Placement Philosophy

Do not assume grade level equals skill level. Grade determines curriculum path, but diagnostics should determine starting point inside subject skills.

## MVP Placement

- Use parent-selected grade.
- Start with grade-level sample lessons.
- Add optional diagnostic later.

## Later Diagnostic Placement

For each subject:

- Short diagnostic quiz
- Foundational skill check
- Confidence rating
- Recommended starting unit
- Review backlog created automatically

## Academy Assignment

```txt
K–5 → Foundation Academy
6–8 → Bridge Academy
9–12 → Scholar Academy
```

## Student Safety Notes

- Do not ask for unnecessary personal information.
- Do not require public usernames for children.
- Avoid exact birthdate unless legally required.
- Parent should control younger-student access.

## Implementation Notes for Codex

- Model student profile separately from auth user.
- Support multiple students per parent.
- Store grade and academy as normalized fields.
- Add placeholder diagnostic structure but do not overbuild in MVP.

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
- Parent creates student profile in MVP.
- Student grade selects academy automatically.
- Placement diagnostic can be simple in MVP and richer later.

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
