# 11 — Retention Engine Specification

## Purpose

The Memory Vault is a signature feature of the platform.

It exists to fight forgetting by automatically scheduling retrieval practice across time.

---

## Memory Vault Rule

A lesson is not deeply complete until its core skills enter spaced review.

---

## Default Review Schedule

```txt
Day 0: Learn skill
Day 1: Quick recall
Day 3: Practice again
Day 7: Mixed review
Day 14: Application task
Day 30: Mastery check
```

---

## Review Item Types

```txt
recall
multiple_choice
short_answer
explain
apply
select_evidence
debug_error
mixed_review
```

---

## Spaced Review Item Model

```ts
type SpacedReviewItem = {
  id: string;
  studentId: string;
  skillId: string;
  lessonId: string;
  promptType: "recall" | "multiple_choice" | "short_answer" | "explain" | "apply";
  lastReviewedAt?: string;
  nextReviewAt: string;
  reviewIntervalDays: number;
  accuracyHistory: number[];
  confidenceRating?: number;
  mistakeType?: string;
  retentionStrength: "weak" | "developing" | "strong" | "mastered";
};
```

---

## Retention Strength

```txt
weak: repeated errors or overdue review
developing: some successful recall but not stable
strong: multiple successful spaced recalls
mastered: successful long-interval recall and application
```

---

## Rescheduling Logic

If correct quickly:

```txt
increase interval
```

If correct slowly:

```txt
keep similar or shorter interval
```

If wrong:

```txt
show feedback
assign reteach or hint
schedule review tomorrow
record mistake type
```

If missed review:

```txt
keep due
show on dashboard
lower retention confidence if repeatedly missed
```

---

## Mixed Review

After a skill is initially learned, it should appear alongside older and similar skills.

This prevents students from only memorizing a procedure in isolation.

---

## Mistake-Based Review

If a mistake repeats, generate a targeted review.

Example:

```txt
Student repeatedly misses fraction comparison because they compare denominators incorrectly.

System:
Add “compare fraction size using same whole” review item.
Recommend reteach lesson.
Flag weak concept on dashboard.
```

---

## Dashboard Integration

Student dashboard should show:

- review due today
- overdue review
- Memory Vault streak
- weak skills
- mastered skills

Parent dashboard should show:

- review consistency
- retention improvement
- missed review patterns

---

## MVP Implementation

MVP can implement a simple review scheduler in local content/state first, then database-backed scheduling later.

MVP requirements:

- create review item after lesson
- compute next review date
- show due review
- update review item after attempt


---

# V2 Implementation Expansion

## Document Status

- **Version:** 2.0
- **Readiness Target:** Codex-ready implementation guidance
- **Primary Dependency:** AGENTS.md, Product Bible, Core Pillars, MVP Scope
- **Core Learning Loop:** Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply

## V2 Improvements Added

- Adds item lifecycle.
- Adds scheduling rules and rescheduling logic.
- Adds mistake-based review handling.
- Adds dashboard integration.
- Adds data model details.
- Adds edge cases for overdue reviews.

## What This Document Must Lock

- Memory Vault is MVP, not optional.
- A lesson is not deeply complete until review items are scheduled.

## Implementation Requirements

- Create review items for learned skills.
- Use Day 1/3/7/14/30 schedule as baseline.
- Adjust intervals based on accuracy, speed, confidence, and mistake type.

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

- Implement spacedReviewEngine.ts.
- Create Memory Vault UI cards.
- Add review due counts to student and parent dashboards.

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
