# 53 — K–12 Scope and Sequence

## Purpose

Defines the K–12 curricular scope and sequence from Kindergarten through Grade 12 across subjects.


---

# V2 Implementation Expansion

## Document Status

- **Version:** 2.0
- **Readiness Target:** Codex-ready implementation guidance
- **Primary Dependency:** AGENTS.md, Product Bible, Core Pillars, MVP Scope
- **Core Learning Loop:** Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply

## V2 Improvements Added

- Adds grade-by-grade curriculum backbone.
- Adds progression logic across academies.
- Adds MVP slice within full K–12 path.
- Adds subject coverage expectations.
- Adds prerequisite chains.
- Adds future expansion sequence.

## What This Document Must Lock

- Full K–12 is documented but not built first.
- Grade 3/6/9 are MVP proof points.
- Curriculum expands by subject/grade after the engine works.

## Implementation Requirements

- Define core subjects for every grade.
- Create unit-level scope, not every lesson yet.
- Mark prerequisite dependencies and spiral review needs.

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

- Create curriculum maps under content for MVP grades first.
- Do not generate thousands of lessons until schemas and QA are stable.

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

## Grade-Band Coverage Matrix

| Grade Band | ELA/Writing | Math | Science | Social Studies | CS/Digital | SEL/Life |
|---|---|---|---|---|---|---|
| K–2 | Foundational reading, oral language, sentences | Counting, operations, shapes | Observing, weather, plants, animals | Family, community, maps | Sequencing, patterns | emotions, routines |
| 3–5 | Comprehension, evidence, paragraphs/essays | Multiplication, fractions, decimals | Earth/life/physical science | regions, early U.S., civics | block coding, logic | goals, empathy |
| 6–8 | Literature, argument, research | ratios, equations, geometry, algebra readiness | earth/life/physical science | ancient/world/U.S. history | Python/web/data basics | study skills |
| 9–12 | English courses, research, rhetoric | Algebra, Geometry, advanced options | Biology, Chemistry, Physics, electives | World, U.S., Gov/Econ | CS pathways | college/career |

## MVP Slice

- Grade 3: ELA, Math, Science, Social Studies.
- Grade 6: ELA, Math, Science, Social Studies.
- Grade 9: English 9, Algebra I, Biology, World History.

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
