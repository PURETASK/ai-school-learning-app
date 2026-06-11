# 15 — Question Bank Index

> **Project context:** K–12 Learning App Suite with Foundation Academy (K–5), Bridge Academy (6–8), and Scholar Academy (9–12). The platform is a thinking-development and retention platform, not a video/flashcard library. Every curriculum artifact must support the core loop: **Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply**.

## Purpose

This document defines the question bank system. Questions power quizzes, retrieval checks, diagnostics, Memory Vault, reteach, challenge paths, and analytics.

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

## Question Types

| Type | Use |
|---|---|
| Multiple Choice | Quick checks and diagnostic items. |
| Multiple Select | Evidence and concept classification. |
| True / False | Simple misconception checks. |
| Short Answer | Explanation and recall. |
| Explain Your Thinking | Reasoning quality. |
| Claim → Evidence → Reasoning | Academic proof. |
| Drag-and-Drop Sorting | K–8 categorization and evidence sorting. |
| Matching | Vocabulary and concept pairs. |
| Sequencing | Processes, timelines, steps. |
| Fill in the Blank | Vocabulary/formula recall. |
| Error Analysis | Debugging and misconception correction. |
| Graph / Chart Interpretation | Data reasoning. |
| Text Evidence Selection | Reading/history evidence. |
| Math Step-by-Step | Procedural reasoning. |
| Science Prediction | Inquiry and cause/effect. |
| History Source Analysis | Context and perspective. |
| Coding Debug Question | Computational thinking. |
| Reflection Prompt | Metacognition. |
| Confidence Rating | Adaptive review scheduling. |

## Question Schema

```ts
type QuestionItem = {
  id: string;
  lessonId: string;
  questionType: string;
  prompt: string;
  choices?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  standardsTags: string[];
  thinkingSkillTags: string[];
  skillTags: string[];
  misconceptionTag?: string;
  feedbackIfWrong?: string;
  reteachPathId?: string;
  challengePathId?: string;
  accessibilityNotes?: string;
};
```

## MVP Question Bank Files

```txt
GRADE_3_MATH_QUESTION_BANK.md
GRADE_3_ELA_QUESTION_BANK.md
GRADE_3_SCIENCE_QUESTION_BANK.md
GRADE_3_SOCIAL_STUDIES_QUESTION_BANK.md
GRADE_6_MATH_QUESTION_BANK.md
GRADE_6_ELA_QUESTION_BANK.md
GRADE_6_SCIENCE_QUESTION_BANK.md
GRADE_6_SOCIAL_STUDIES_QUESTION_BANK.md
GRADE_9_ALGEBRA_1_QUESTION_BANK.md
GRADE_9_ENGLISH_9_QUESTION_BANK.md
GRADE_9_BIOLOGY_QUESTION_BANK.md
GRADE_9_WORLD_HISTORY_QUESTION_BANK.md
```

## Quality Rules

A question is production-ready only when:

- It has one clear learning target.
- Wrong answers are plausible and useful.
- Explanation teaches, not just confirms.
- It is tagged for standards and thinking skills.
- It maps to reteach/challenge actions.
- It is accessible and age-appropriate.

## Seed Lesson Requirement

Each complete seed lesson should include at minimum:

- 3 retrieval check questions.
- 5 quiz questions.
- 1 explain-your-thinking prompt.
- 1 misconception/error analysis item where applicable.
- Answer key and explanations.

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
