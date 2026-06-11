# 19 — Parent and Teacher Guide Index

> **Project context:** K–12 Learning App Suite with Foundation Academy (K–5), Bridge Academy (6–8), and Scholar Academy (9–12). The platform is a thinking-development and retention platform, not a video/flashcard library. Every curriculum artifact must support the core loop: **Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply**.

## Purpose

This document defines the adult-facing guide system. Parents and teachers need clear explanations of what the student is learning, how progress is measured, and how to support without giving away answers.

## Locked Core Pillars

Every syllabus, unit, lesson, assessment, activity bank, and review item must support the locked core pillars:

1. Standards-Aligned Curriculum
2. First-Principles Problem Solving
3. Critical Thinking
4. Discussion & Academic Dialogue
5. Interpretation
6. Evidence-Based Reasoning
7. Metacognition
8. Retrieval + Spaced Retention
9. Inquiry-Based Learning
10. Computational + Systems Thinking
11. Project-Based Application
12. Adaptive Mastery + Feedback
13. Fun + Motivation
14. Accessibility + Inclusive Learning
15. Safe Child-Centered Design

## Parent Guides Required

| Guide | Purpose | MVP Priority |
|---|---|---|
| Parent Overview Guide | Explains platform and academies. | High |
| Parent Dashboard Guide | Explains progress, mastery, Memory Vault. | High |
| Supporting Reading Guide | Helps with reading without doing work. | Medium |
| Supporting Math Guide | Helps with math explanation and practice. | Medium |
| Memory Vault Guide | Explains spaced review. | High |
| Privacy and Safety Guide | Explains child safety rules. | High |

## Teacher Guides Required

| Guide | Purpose | Priority |
|---|---|---|
| Teacher Overview Guide | Explains curriculum model. | Medium |
| Assignment Guide | How to assign lessons. | Later |
| Progress Report Guide | How to read dashboards. | Medium |
| Reteach Guide | How to respond to weak skills. | Medium |
| Discussion Guide | How structured dialogue works. | Later |
| Standards Alignment Guide | How tags map to expectations. | Medium |

## Parent/Teacher Notes in Lessons

Every lesson should include a short adult note with:

- What the student is learning.
- What mastery looks like.
- Common misconception.
- How to help without giving answer.
- Suggested discussion question.
- Memory Vault expectation.

## Adult Dashboard Language Rules

Use clear, non-alarming language.

Instead of:

```txt
Student failed fractions.
```

Use:

```txt
Student needs reteach support with fraction comparison. Recommended next step: visual model practice.
```

## Parent/Teacher Guide Acceptance Criteria

A guide is complete when:

- Adult can understand the feature without developer explanation.
- Privacy boundaries are clear.
- Support advice does not encourage answer-giving.
- Dashboard terms are defined.
- Reteach/challenge actions are explained.

## Universal Review Checklist

Before this document is marked **Approved**, verify that it:

- Aligns to the three-academy structure.
- Supports the full learning loop, not just passive content.
- Identifies MVP scope versus later expansion.
- Includes implementation rules Codex can follow.
- Includes content QA expectations.
- Includes accessibility and child-safety considerations where relevant.
- Connects to standards tags, thinking skill tags, Memory Vault review, mastery bands, and parent/teacher reporting.
- Avoids scope creep by clearly naming what is out of scope for MVP.

## Status Labels

Use these workflow labels for all content artifacts referenced here:

| Status | Meaning |
|---|---|
| `planned` | Artifact exists in the backlog only. |
| `drafting` | Writer/curriculum designer is creating first draft. |
| `needs_review` | Draft is ready for academic/product review. |
| `needs_revision` | Review found required fixes. |
| `approved` | Artifact is ready for app implementation. |
| `implemented` | Artifact exists in the repo/app. |
| `tested` | Artifact has passed QA checks. |
| `published` | Artifact is live or release-ready. |
| `archived` | Artifact is deprecated but preserved for history. |

## Codex Instruction

When Codex modifies files related to this document, it must:

1. Read `AGENTS.md` first.
2. Preserve naming conventions and hierarchy.
3. Avoid creating orphan lessons, units, standards, questions, or review items.
4. Update indexes/tables when adding artifacts.
5. Keep Markdown/JSON human-readable and validation-friendly.
6. Report files changed and how to test them.
