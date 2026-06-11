# 10 — Assessment and Mastery Model

## Purpose

This document defines how the platform measures learning.

The app should not only track whether a student clicked through a lesson. It should track mastery, reasoning, retention, evidence use, interpretation, reflection, and project application.

---

## Score Types

| Score | Measures |
|---|---|
| Content Mastery Score | Subject knowledge |
| Problem-Solving Score | Ability to break down and solve unfamiliar problems |
| Critical Thinking Score | Ability to question, compare, evaluate, and analyze |
| Evidence Score | Ability to support answers with proof |
| Interpretation Score | Ability to understand meaning, context, and source intent |
| Discussion Score | Ability to explain, respond, and revise respectfully |
| Retention Score | Ability to remember after time passes |
| Reflection Score | Ability to identify mistakes and improve |
| Fluency Score | Ability to perform foundational skills efficiently |
| Project Score | Ability to apply learning in a real output |

---

## Mastery Bands

```txt
0–39: Needs Intervention
40–64: Needs Reteach
65–79: Almost Mastered
80–89: Mastered
90–100: Advanced
```

---

## Diagnostic Assessment

Purpose:

- place student at a reasonable starting point
- identify prior knowledge
- detect gaps
- avoid assigning work that is too easy or too hard

MVP diagnostic can be simple and subject-specific.

---

## Formative Assessment

Used during lessons:

- guided practice responses
- retrieval checks
- misconception detection
- explanation prompts
- evidence sorting
- mistake journal tags

---

## Quiz Assessment

Quiz scoring should include:

- correctness
- skill tags
- difficulty
- answer explanations
- mistake category
- confidence if available
- time/fluency if useful

---

## Project Assessment

Projects should use rubrics.

Rubric categories can include:

- content accuracy
- evidence use
- reasoning
- creativity
- communication
- revision
- application

---

## Retention Assessment

Retention is measured by later recall.

A student has stronger retention when they:

- answer correctly after time passes
- explain without hints
- apply the skill in mixed review
- avoid repeated mistake patterns

---

## Thinking Skill Assessment

Thinking skill scores should be calculated from tasks that require explanation, evidence, interpretation, and process, not only final answers.

---

## Parent/Teacher Reporting

Reports should show:

- overall mastery
- weak skills
- strong skills
- recent lessons
- review due/missed
- growth over time
- recommended next actions

---

## Example Scoring Flow

```txt
Student completes Grade 3 Math lesson.

Quiz score: 78
Explanation score: 70
Retrieval score: 80
Mistake: word problem operation selection

Result:
Almost Mastered

System:
Assign guided practice.
Schedule review on Day 1 and Day 3.
Add mistake to Mistake Journal.
Recommend Operation Detective reteach if pattern repeats.
```


---

# V2 Implementation Expansion

## Document Status

- **Version:** 2.0
- **Readiness Target:** Codex-ready implementation guidance
- **Primary Dependency:** AGENTS.md, Product Bible, Core Pillars, MVP Scope
- **Core Learning Loop:** Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply

## V2 Improvements Added

- Adds multidimensional score definitions.
- Adds assessment type rules.
- Adds rubric-based scoring support.
- Adds score-to-action mapping.
- Adds parent/teacher reporting language.
- Adds calibration needs for future AI scoring.

## What This Document Must Lock

- Correctness alone is insufficient.
- Mastery bands are fixed for MVP.
- Every assessment should trigger a next action: review, reteach, challenge, or intervention.

## Implementation Requirements

- Track content mastery plus thinking scores.
- Separate diagnostic, formative, mastery, retention, and project assessments.
- Use rubrics for writing/projects/discussion.

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

- Implement masteryEngine.ts with score bands.
- Store skill-level mastery not only lesson completion.
- Emit mastery events for analytics.

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
