# 11 — Memory Vault Review Map

> **Project context:** K–12 Learning App Suite with Foundation Academy (K–5), Bridge Academy (6–8), and Scholar Academy (9–12). The platform is a thinking-development and retention platform, not a video/flashcard library. Every curriculum artifact must support the core loop: **Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply**.

## Purpose

This document defines how curriculum creates Memory Vault items. The Memory Vault is the platform's primary spaced retrieval and retention engine.

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

## Memory Vault Rule

A lesson is not deeply complete unless it creates future review items. Students must retrieve, space, and reapply knowledge over time.

## Review Schedule

| Review Event | Timing | Purpose |
|---|---|---|
| Learn | Day 0 | Initial instruction and practice. |
| Quick Recall | Day 1 | Interrupt forgetting early. |
| Practice Again | Day 3 | Strengthen retrieval. |
| Mixed Review | Day 7 | Interleave with older skills. |
| Application Task | Day 14 | Transfer skill to context. |
| Mastery Check | Day 30 | Confirm durable retention. |

## Review Item Types

| Type | Use |
|---|---|
| Vocabulary Recall | Definitions and disciplinary language. |
| Math Fact Recall | Facts, operations, formulas. |
| Concept Recall | Core idea or rule. |
| Explain-It-Back | Student explains in own words. |
| Evidence Recall | Student recalls evidence or proof logic. |
| Sequence Recall | Steps, processes, timelines. |
| Error Correction | Student fixes a mistake. |
| Application Prompt | Student applies skill to new case. |

## Required Memory Vault Fields

```ts
type MemoryVaultItem = {
  id: string;
  lessonId: string;
  skillId: string;
  academy: "foundation" | "bridge" | "scholar";
  gradeLevel: string;
  subject: string;
  promptType: "recall" | "multiple_choice" | "short_answer" | "explain" | "apply" | "error_correction";
  prompt: string;
  expectedAnswer: string;
  feedback: string;
  standardsTags: string[];
  thinkingSkillTags: string[];
  reviewScheduleDays: number[];
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
};
```

## Rescheduling Logic

| Student Result | Action |
|---|---|
| Correct quickly + confident | Increase interval. |
| Correct but slow/low confidence | Repeat sooner. |
| Incorrect but close | Show feedback and review tomorrow. |
| Incorrect with major misconception | Trigger reteach path and review tomorrow. |
| Repeated success | Mark retention strength strong/mastered. |
| Repeated misses | Flag adult dashboard and assign intervention. |

## Subject Review Priorities

| Subject | Review Targets |
|---|---|
| ELA | Vocabulary, reading strategies, text evidence, literary terms. |
| Math | Facts, formulas, operations, problem-solving structures. |
| Science | Vocabulary, processes, models, cause/effect, systems. |
| Social Studies | Timeline, geography, civics concepts, source evidence. |
| Writing | CER structure, transitions, grammar, revision habits. |
| CS | Syntax, logic patterns, debugging steps. |

## MVP Requirement

Each of the 12 seed lessons must create at least 5 Memory Vault items:

- 1 vocabulary/concept recall.
- 1 explain-it-back prompt.
- 1 application prompt.
- 1 error/misconception correction.
- 1 mixed review item.

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
