# 14 — Feature Map

## Purpose

This document defines major product features, build priority, user roles, data needs, and acceptance criteria.

---

## Core Learning Engine

### Lesson Player

Purpose: deliver the universal lesson flow.

MVP: yes

Roles: student

Data needed:

- lesson
- activities
- quiz
- progress
- mastery rules

Acceptance criteria:

- student can complete lesson sections
- progress is tracked
- retrieval check appears
- mastery result is generated

---

### Quiz Engine

Purpose: score questions and provide explanations.

MVP: yes

Supports:

- multiple choice
- short answer later
- explanation
- evidence selection later
- ordered steps later

Acceptance criteria:

- answers are evaluated
- explanations are shown
- mistake type can be recorded

---

### Feedback Engine

Purpose: provide specific next-step feedback.

MVP: yes

Acceptance criteria:

- correct answers receive reinforcement
- wrong answers receive explanation and hint
- feedback can route to reteach or review

---

### Mastery Engine

Purpose: convert performance into mastery bands.

MVP: yes

Acceptance criteria:

- score maps to mastery status
- next action is assigned
- mastery is stored

---

### Memory Vault

Purpose: spaced review and retention.

MVP: yes

Acceptance criteria:

- lesson creates review items
- due reviews show on dashboard
- review attempts update retention state

---

## Thinking Features

### Problem-Solving Lab

Purpose: first-principles problem solving.

MVP: phase 5

### Evidence Room

Purpose: Claim → Evidence → Reasoning.

MVP: phase 5

### Interpretation Lens

Purpose: meaning/context/perspective/data analysis.

MVP: phase 5

### Discussion Arena

Purpose: structured academic dialogue.

MVP: later, safety-gated

### Debugging Arena

Purpose: find, explain, and fix mistakes.

MVP: phase 5 or 6

### Systems Mapper

Purpose: map parts, causes, effects, and relationships.

MVP: later

### Mistake Journal

Purpose: error analysis and pattern detection.

MVP: phase 5

### Thinking Cards

Purpose: reusable thinking routines.

MVP: phase 5

---

## Student Features

- dashboard
- today’s lesson
- review due
- subject progress
- mastery bars
- badges/XP
- weak skills
- completed lessons

---

## Parent Features

- linked child progress
- lesson completion
- weak skills
- review consistency
- mastery by subject
- suggested support

---

## Teacher Features

Later:

- classes
- assignments
- class mastery
- submissions
- discussion moderation
- reports

---

## Admin Features

Later:

- content admin
- standards management
- user management
- curriculum review workflow
- analytics

---

## AI Tutor Features

Later:

- hint ladder
- grade-level explanations
- guided problem solving
- safe content handling
- parent/teacher visibility


---

# V2 Implementation Expansion

## Document Status

- **Version:** 2.0
- **Readiness Target:** Codex-ready implementation guidance
- **Primary Dependency:** AGENTS.md, Product Bible, Core Pillars, MVP Scope
- **Core Learning Loop:** Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply

## V2 Improvements Added

- Adds feature cards.
- Adds MVP/later segmentation.
- Adds dependencies.
- Adds risks.
- Adds acceptance criteria.
- Adds pillar mapping.

## What This Document Must Lock

- Lesson Player, Quiz Engine, Feedback Engine, Mastery Engine, Memory Vault, Student Dashboard, and Basic Parent Dashboard are MVP.

## Implementation Requirements

- Each feature needs purpose, user role, screens, data, permissions, and definition of done.
- Avoid visual-only feature stubs.

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

- Before building a feature, verify it exists in this feature map.
- Add missing feature cards before implementation.

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
