# 54 — Lesson JSON Schema and Validation

## Purpose

Defines machine-validated lesson JSON schema, validation rules, errors, and content QA hooks.


---

# V2 Implementation Expansion

## Document Status

- **Version:** 2.0
- **Readiness Target:** Codex-ready implementation guidance
- **Primary Dependency:** AGENTS.md, Product Bible, Core Pillars, MVP Scope
- **Core Learning Loop:** Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply

## V2 Improvements Added

- Adds schema-level constraints.
- Adds validation failure messages.
- Adds required/optional sections.
- Adds enum definitions.
- Adds sample minimal and complete lesson shapes.
- Adds Codex implementation tasks for validators.

## What This Document Must Lock

- Lesson files must be validated before rendering.
- Schema is source of truth for lesson content files and future DB import.

## Implementation Requirements

- Implement JSON schema or Zod schema.
- Validate academy, grade, subject, section completeness, tags, masteryThreshold, and review schedule.
- Block publishing if required fields are missing.

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

- Create `src/types/lesson.ts` and `src/lib/lessonValidation.ts`.
- Add sample valid and invalid fixtures.
- Add tests for validation errors.

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

## Suggested Zod-Style Schema Shape

```ts
type Academy = 'foundation' | 'bridge' | 'scholar';
type LessonSectionType =
  | 'hook'
  | 'learning_goal'
  | 'mini_teach'
  | 'first_principles_breakdown'
  | 'worked_example'
  | 'guided_practice'
  | 'critical_thinking_checkpoint'
  | 'evidence_task'
  | 'interpretation_discussion_task'
  | 'active_practice'
  | 'retrieval_check'
  | 'feedback'
  | 'mastery_score'
  | 'spaced_review'
  | 'reflection'
  | 'reteach_or_challenge';
```

## Validation Rules

| Rule | Severity |
|---|---|
| Missing id/title/academy/gradeLevel/subject/unit | Error |
| Missing learningObjective or essentialQuestion | Error |
| Empty standardsTags or thinkingSkillTags | Error |
| No retrievalCheck or quiz | Error |
| No spacedReviewSchedule | Error |
| masteryThreshold outside 0–100 | Error |
| accessibilityNotes missing | Warning |
| parentTeacherNotes missing | Warning |

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
