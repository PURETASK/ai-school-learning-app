# 18 — Challenge and Enrichment Map

> **Project context:** K–12 Learning App Suite with Foundation Academy (K–5), Bridge Academy (6–8), and Scholar Academy (9–12). The platform is a thinking-development and retention platform, not a video/flashcard library. Every curriculum artifact must support the core loop: **Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply**.

## Purpose

This document defines what happens when students master content. Advanced students need deeper thinking, transfer, creativity, and project opportunities, not just the next ordinary lesson.

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

## Challenge Triggers

| Trigger | Action |
|---|---|
| Quiz score 90+ | Unlock challenge task. |
| Repeated Memory Vault mastery | Unlock mixed/application challenge. |
| Strong rubric score | Offer project extension. |
| High fluency + strong explanation | Offer multi-step transfer task. |

## Challenge Types

| Type | Purpose |
|---|---|
| Harder Problem | Increases complexity. |
| Open-Ended Problem | Allows multiple valid solutions. |
| Real-World Application | Transfers skill to context. |
| Creative Project | Produces artifact. |
| Debate Prompt | Requires counterargument and evidence. |
| Design Challenge | Uses constraints and iteration. |
| Research Extension | Builds independent inquiry. |
| Advanced Reading | Extends interpretation. |
| Multi-Step Reasoning | Combines skills. |
| Cross-Subject Challenge | Connects disciplines. |

## Challenge Path Schema

```ts
type ChallengePath = {
  id: string;
  lessonId: string;
  trigger: string;
  challengeType: string;
  prompt: string;
  expectedOutput: string;
  scoringRubricId?: string;
  thinkingSkillTags: string[];
  estimatedMinutes: number;
  accessibilityAlternative?: string;
};
```

## MVP Requirement

Each seed lesson must include at least two challenge tasks:

- One deeper reasoning task.
- One real-world/application or creative task.

## Challenge QA Rules

- Challenge must extend the lesson objective.
- Challenge must not introduce unrelated new content without support.
- Challenge must reward reasoning, not only speed.
- Challenge should be optional or clearly marked advanced.
- Challenge should support portfolio/project use when possible.

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
