# 55 — MVP Backlog and Task Breakdown

## Purpose

Breaks the MVP into actionable tasks, dependencies, priority, and definition of done.


---

# V2 Implementation Expansion

## Document Status

- **Version:** 2.0
- **Readiness Target:** Codex-ready implementation guidance
- **Primary Dependency:** AGENTS.md, Product Bible, Core Pillars, MVP Scope
- **Core Learning Loop:** Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply

## V2 Improvements Added

- Adds task IDs.
- Adds dependency graph.
- Adds vertical-slice milestone.
- Adds P0/P1/P2 split.
- Adds Codex-ready task cards.
- Adds “do not start yet” backlog.

## What This Document Must Lock

- MVP work must produce a working vertical lesson loop.
- Do not build broad curriculum or advanced dashboards before vertical slice.

## Implementation Requirements

- Define task cards for scaffold, types, content, lesson player, quiz engine, mastery, Memory Vault, dashboards.
- Include test expectations per task.

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

- Work task IDs in order unless user overrides.
- After each task, report changed files and tests run.

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

## P0 Backlog

| ID | Task | Depends On |
|---|---|---|
| MVP-001 | Scaffold Next.js + TypeScript + Tailwind app. | Docs complete |
| MVP-002 | Create base folder structure and shared types. | MVP-001 |
| MVP-003 | Add content folder and sample Grade 3 Math lesson. | MVP-002 |
| MVP-004 | Implement lesson loader/validator. | MVP-003 |
| MVP-005 | Build Lesson Player shell. | MVP-004 |
| MVP-006 | Build Quiz Engine with feedback. | MVP-005 |
| MVP-007 | Build Mastery Engine. | MVP-006 |
| MVP-008 | Build Memory Vault scheduling. | MVP-007 |
| MVP-009 | Build Student Dashboard. | MVP-008 |
| MVP-010 | Build Basic Parent Dashboard. | MVP-009 |

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
