# 16 — Rubric Library Index

> **Project context:** K–12 Learning App Suite with Foundation Academy (K–5), Bridge Academy (6–8), and Scholar Academy (9–12). The platform is a thinking-development and retention platform, not a video/flashcard library. Every curriculum artifact must support the core loop: **Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply**.

## Purpose

This document defines the rubric library. Rubrics score thinking quality, project quality, writing, discussion, evidence, interpretation, and reflection.

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

## Core Rubrics Required

| Rubric | Purpose | MVP Priority |
|---|---|---|
| Content Mastery Rubric | Subject knowledge quality. | High |
| Problem-Solving Rubric | Known/unknowns, strategy, steps, check. | High |
| Critical Thinking Rubric | Logic, assumptions, evaluation. | High |
| Evidence-Based Reasoning Rubric | Claim, evidence, reasoning. | High |
| Interpretation Rubric | Meaning, context, perspective, depth. | High |
| Discussion Rubric | Respectful academic dialogue. | Medium |
| Writing Rubric | Organization, evidence, clarity, conventions. | High |
| Science Lab Rubric | Question, model, evidence, conclusion. | Medium |
| History Source Analysis Rubric | Source, context, evidence, perspective. | Medium |
| Project Rubric | Artifact quality and application. | High |
| Capstone Rubric | High-school portfolio/capstone defense. | Later |
| Reflection Rubric | Mistake analysis and next steps. | High |

## Standard 4-Level Rubric Scale

| Level | Label | Meaning |
|---:|---|---|
| 1 | Beginning | Student needs major support. |
| 2 | Developing | Student shows partial understanding. |
| 3 | Proficient | Student meets grade/course expectation. |
| 4 | Advanced | Student exceeds expectation or transfers skill. |

## Mastery Conversion

| Rubric Level | Mastery Band |
|---|---|
| 1 | 0–39 or 40–64 depending severity |
| 2 | 40–64 or 65–79 |
| 3 | 80–89 |
| 4 | 90–100 |

## Rubric Entry Schema

```ts
type Rubric = {
  id: string;
  title: string;
  scoreType: string;
  criteria: {
    name: string;
    level1: string;
    level2: string;
    level3: string;
    level4: string;
  }[];
  applicableGrades: string[];
  applicableSubjects: string[];
};
```

## Rubric QA Rules

- Criteria must be observable.
- Language must be student-friendly where used with students.
- Rubric must distinguish between content correctness and reasoning quality.
- Rubric should connect to dashboard scores.
- Rubric should include examples for content creators.

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
