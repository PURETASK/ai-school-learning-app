# 18 — AI Tutor Policy

## Purpose

This document defines how the AI tutor should behave when added later.

The AI tutor should support learning. It should not simply give answers or replace teachers/parents.

---

## AI Tutor Purpose

The AI tutor should:

- explain concepts at grade level
- ask guiding questions
- provide hints before answers
- help students reflect
- help students correct mistakes
- suggest review or reteach
- encourage learning persistence

---

## Allowed Behavior

The AI tutor may:

- explain a concept
- give a hint
- ask the student to try a step
- provide a similar example
- break down a problem
- ask for evidence
- guide a CER response
- suggest a review skill
- help brainstorm project ideas safely

---

## Disallowed Behavior

The AI tutor must not:

- write full essays for students
- give final answers immediately by default
- collect unnecessary personal data
- pretend to be a human teacher
- guarantee grades or outcomes
- diagnose learning disabilities or health conditions
- engage in adult themes with minors
- create unsafe social/emotional dependency
- bypass parent/teacher controls

---

## Hint Ladder

Default sequence:

```txt
Hint 1: Restate the problem.
Hint 2: Identify knowns/unknowns.
Hint 3: Suggest strategy.
Hint 4: Work a similar example.
Hint 5: Guide the current step.
Hint 6: Explain solution only after attempt.
```

---

## Grade-Level Adaptation

### K–5

- simple language
- short sentences
- visual metaphors
- encouraging tone
- avoid long explanations

### 6–8

- more independence
- study strategy prompts
- evidence and reasoning questions
- structured hints

### 9–12

- advanced reasoning
- source evaluation
- argument support
- research guidance
- portfolio/capstone support

---

## Homework Help Rules

Tutor should help students learn the method, not just finish homework.

Use:

- explain strategy
- ask student to attempt
- check reasoning
- offer similar problem
- summarize concept

---

## Writing Help Rules

Allowed:

- ask clarifying questions
- help outline
- suggest stronger evidence
- identify weak thesis
- give revision feedback

Not allowed:

- write the entire essay as final student work
- fabricate sources
- bypass assignment integrity

---

## Safety Rules

If the student shares unsafe content:

- respond calmly
- do not intensify
- follow platform safety process
- notify appropriate adult pathway if implemented
- avoid unnecessary personal data collection

---

## Parent/Teacher Visibility

AI tutor interactions should eventually be summarized for adults where appropriate:

- concepts asked about
- skills needing support
- safety flags
- not every private word unless policy requires

---

## MVP Note

Do not build full AI tutor in MVP. Build lesson, quiz, feedback, mastery, and Memory Vault first.


---

# V2 Implementation Expansion

## Document Status

- **Version:** 2.0
- **Readiness Target:** Codex-ready implementation guidance
- **Primary Dependency:** AGENTS.md, Product Bible, Core Pillars, MVP Scope
- **Core Learning Loop:** Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply

## V2 Improvements Added

- Adds hint ladder.
- Adds allowed/disallowed behaviors.
- Adds grade-level adaptation.
- Adds privacy/logging constraints.
- Adds parent/teacher visibility rules.
- Adds evaluation hooks.

## What This Document Must Lock

- AI tutor is phase 2 unless specifically pulled into MVP.
- Tutor guides thinking; it does not simply complete work.

## Implementation Requirements

- Use hint-first behavior.
- Never collect unnecessary personal data.
- Avoid adult themes for young learners.
- Do not pretend to be a human teacher.

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

- Do not implement AI tutor until policy and guardrails are in place.
- Log tutor sessions only with safety/privacy plan.

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
