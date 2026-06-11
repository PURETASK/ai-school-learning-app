# 60 — Analytics Event Taxonomy

## Purpose

Defines privacy-conscious analytics events that measure learning, retention, friction, and product quality.


---

# V2 Implementation Expansion

## Document Status

- **Version:** 2.0
- **Readiness Target:** Codex-ready implementation guidance
- **Primary Dependency:** AGENTS.md, Product Bible, Core Pillars, MVP Scope
- **Core Learning Loop:** Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply

## V2 Improvements Added

- Adds event naming standard.
- Adds event property rules.
- Adds privacy minimization.
- Adds dashboard metrics.
- Adds funnel definitions.
- Adds learning-outcome metrics.

## What This Document Must Lock

- Analytics should measure learning health, not surveillance.
- Do not collect unnecessary personal details.

## Implementation Requirements

- Track lesson_started, lesson_completed, quiz_answered, mastery_calculated, review_scheduled, review_completed, reteach_assigned, challenge_unlocked.
- Use stable IDs, not sensitive text, when possible.

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

- Create analytics types.
- Emit events from engines, not random components.
- Add opt-out/privacy review before production.

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

## Event Naming Pattern

`domain_action_object`

Examples:

| Event | Purpose |
|---|---|
| lesson_started | Student begins lesson. |
| lesson_section_completed | Student completes a lesson phase. |
| quiz_answer_submitted | Student submits quiz/retrieval answer. |
| mastery_band_assigned | Mastery engine assigns band. |
| review_item_scheduled | Memory Vault schedules review. |
| review_item_completed | Student completes review item. |
| reteach_path_assigned | Adaptive engine assigns reteach. |
| parent_progress_viewed | Parent views linked child progress. |

## Privacy Rules

- Prefer IDs/tags over raw student text.
- Do not log full essay responses in analytics events.
- Do not log sensitive personal details.
- Analytics must respect role boundaries.

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
