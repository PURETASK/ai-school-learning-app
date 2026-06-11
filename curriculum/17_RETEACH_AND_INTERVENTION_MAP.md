# 17 — Reteach and Intervention Map

> **Project context:** K–12 Learning App Suite with Foundation Academy (K–5), Bridge Academy (6–8), and Scholar Academy (9–12). The platform is a thinking-development and retention platform, not a video/flashcard library. Every curriculum artifact must support the core loop: **Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply**.

## Purpose

This document defines how the curriculum supports students who struggle. Reteach is not failure punishment; it is adaptive instruction.

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

## Adaptive Branching Bands

| Score | Label | Curriculum Action |
|---:|---|---|
| 0–39 | Needs Intervention | Assign intervention path and possible adult alert. |
| 40–64 | Needs Reteach | Assign reteach lesson with alternate explanation. |
| 65–79 | Almost Mastered | Assign guided practice and quick review. |
| 80–89 | Mastered | Schedule Memory Vault review. |
| 90–100 | Advanced | Unlock challenge/enrichment. |

## Reteach Content Types

| Type | Purpose |
|---|---|
| Simpler Explanation | Restates concept with fewer steps. |
| Visual Model | Uses image, model, manipulative, graph, or diagram. |
| Worked Example | Shows step-by-step solution. |
| Scaffolded Practice | Breaks task into smaller parts. |
| Vocabulary Support | Defines key terms with examples/non-examples. |
| Misconception Correction | Targets a known wrong idea. |
| Alternate Strategy | Offers another valid method. |
| Audio/Read-Aloud | Supports accessibility and younger learners. |
| Parent/Teacher Tip | Helps adults support without giving answers. |

## Mistake Types

| Mistake Type | Example Action |
|---|---|
| Misread question | Highlight key words; ask student to restate. |
| Vocabulary gap | Send to vocabulary support. |
| Wrong operation/strategy | Use Problem-Solving Lab. |
| Calculation error | Assign fluency practice. |
| Weak evidence | Send to Evidence Room. |
| Shallow interpretation | Use Interpretation Lens scaffold. |
| Skipped step | Use worked example and checklist. |
| Guessing too fast | Require confidence rating and reflection. |

## Reteach Path Schema

```ts
type ReteachPath = {
  id: string;
  lessonId: string;
  trigger: string;
  misconceptionTags: string[];
  reteachType: string;
  explanation: string;
  scaffoldSteps: string[];
  practiceItems: string[];
  exitCriteria: string;
  parentTeacherNote?: string;
};
```

## MVP Requirement

Each seed lesson must include at least:

- One misconception-targeted reteach path.
- One visual or scaffolded explanation.
- Three practice items.
- Clear exit criteria.

## Intervention Escalation

Repeated low performance should trigger:

1. Short reteach path.
2. Smaller practice set.
3. Memory Vault review tomorrow.
4. Adult dashboard flag if repeated.
5. Optional teacher/parent recommendation.

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
