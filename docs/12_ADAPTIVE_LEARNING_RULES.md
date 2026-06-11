# 12 — Adaptive Learning Rules

## Purpose

The platform should respond to student performance.

Every student should not receive the same next step if their understanding is different.

---

## Core Branching Logic

```txt
If score < 40:
  assign intervention path

If score 40–64:
  assign reteach lesson

If score 65–79:
  assign guided practice

If score 80–89:
  mark mastered and schedule review

If score 90+:
  unlock challenge task
```

---

## Score-Based Branching

### Needs Intervention: 0–39

System action:

- mark skill as high risk
- assign intervention path
- simplify explanations
- use worked examples
- notify parent/teacher if repeated

### Needs Reteach: 40–64

System action:

- assign reteach lesson
- target mistake type
- reduce cognitive load
- review prerequisite skills

### Almost Mastered: 65–79

System action:

- assign guided practice
- schedule review
- give hints less often
- check again soon

### Mastered: 80–89

System action:

- mark mastered
- schedule spaced review
- unlock next lesson

### Advanced: 90–100

System action:

- mark advanced
- schedule spaced review
- unlock challenge task

---

## Mistake-Type Branching

Mistake types:

- misread question
- vocabulary gap
- wrong operation
- weak evidence
- skipped step
- calculation error
- misunderstood concept
- guessed too fast
- poor source interpretation

Each mistake type should map to a targeted response.

---

## Confidence-Based Branching

If confidence is low but answer is correct:

- schedule review sooner
- provide optional explanation
- mark as developing, not fully stable

If confidence is high but answer is wrong:

- show misconception feedback
- add to Mistake Journal
- schedule reteach

---

## Retention-Based Branching

If a student forgets after time passes:

- lower retention strength
- schedule closer review
- provide retrieval practice
- do not erase initial content mastery automatically

---

## Reteach Rules

Reteach should be:

- shorter than the original lesson
- more focused
- based on mistake type
- rich in examples
- followed by practice

---

## Challenge Rules

Challenge tasks should:

- require transfer
- include open-ended reasoning
- avoid just being “more questions”
- use evidence, explanation, or application

---

## Parent/Teacher Alerts

Trigger alerts only for meaningful patterns, not one bad attempt.

Examples:

- repeated failure on same skill
- many missed reviews
- repeated low confidence
- reading comprehension weak across multiple lessons


---

# V2 Implementation Expansion

## Document Status

- **Version:** 2.0
- **Readiness Target:** Codex-ready implementation guidance
- **Primary Dependency:** AGENTS.md, Product Bible, Core Pillars, MVP Scope
- **Core Learning Loop:** Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply

## V2 Improvements Added

- Adds score-based branching.
- Adds mistake-type branching.
- Adds retention-based branching.
- Adds confidence-based branching.
- Adds intervention escalation rules.
- Adds implementation examples.

## What This Document Must Lock

- Branching must be explainable to students/parents.
- Adaptive logic should be deterministic for MVP, tunable later.

## Implementation Requirements

- Map scores to next actions.
- Use mistake journal entries to assign targeted reteach paths.
- Avoid black-box adaptation.

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

- Implement adaptiveRules.ts.
- Return nextRecommendedAction from quiz/mastery results.
- Add acceptance tests for boundary scores.

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
