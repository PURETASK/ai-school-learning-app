# 12 — Thinking Skills Activity Map

> **Project context:** K–12 Learning App Suite with Foundation Academy (K–5), Bridge Academy (6–8), and Scholar Academy (9–12). The platform is a thinking-development and retention platform, not a video/flashcard library. Every curriculum artifact must support the core loop: **Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply**.

## Purpose

This document defines the activity banks that teach students how to think. These activities are embedded inside lessons and also support standalone thinking practice.

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

## Core Thinking Loop

1. What am I trying to solve?
2. What do I know?
3. What do I need to find out?
4. What smaller parts can I break this into?
5. What rule, pattern, system, or relationship matters?
6. What evidence supports my answer?
7. What could be wrong with my thinking?
8. Can I explain it clearly?
9. Can I discuss or defend it respectfully?
10. What will I do differently next time?

## Thinking Activity Banks

| Activity Bank | Purpose | MVP Priority |
|---|---|---|
| Problem-Solving Lab | Break problems into knowns, unknowns, rules, steps, checks. | High |
| Thinking Cards | Reusable routines like See-Think-Wonder and CER. | High |
| Evidence Room | Classify evidence and build proof. | High |
| Interpretation Lens | Analyze meaning, context, symbols, data, perspective. | High |
| Discussion Arena | Structured academic dialogue with sentence frames. | Medium |
| Debugging Arena | Find, explain, and fix mistakes. | High |
| Systems Mapper | Map parts, relationships, causes, feedback loops. | Medium |
| Mistake Journal | Reflect on errors and plan next steps. | High |
| Learning Planner | Plan, monitor, evaluate learning tasks. | Medium |
| Memory Vault | Retrieve and space knowledge. | High |

## Activity Schema

```ts
type ThinkingActivity = {
  id: string;
  title: string;
  activityBank: string;
  academy: "foundation" | "bridge" | "scholar";
  gradeBand: "K-5" | "6-8" | "9-12";
  subject: string;
  prompt: string;
  studentAction: string;
  expectedOutput: string;
  thinkingSkillTags: string[];
  feedbackRule: string;
  accessibilitySupport: string;
};
```

## Example Activities

| Activity | Student Task | Thinking Skill |
|---|---|---|
| Break the Problem Apart | Identify knowns/unknowns and choose a strategy. | First principles |
| Find the Hidden Assumption | Identify what the explanation assumes. | Critical thinking |
| Choose the Best Evidence | Sort strong, weak, irrelevant evidence. | Evidence reasoning |
| Compare Two Interpretations | Choose which interpretation is better supported. | Interpretation |
| Find the Bug | Locate and fix a reasoning/calculation/code error. | Debugging |
| Map the System | Identify parts and relationships. | Systems thinking |
| Reflect on the Mistake | Name mistake type and next strategy. | Metacognition |

## Grade-Band Adaptation

| Grade Band | Activity Style |
|---|---|
| K–2 | Visual, oral, matching, simple sentence frames. |
| 3–5 | Short written responses, graphic organizers, guided models. |
| 6–8 | Paragraph explanations, evidence sorting, discussion prompts. |
| 9–12 | Rubric-scored analysis, debate, source evaluation, modeling. |

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
