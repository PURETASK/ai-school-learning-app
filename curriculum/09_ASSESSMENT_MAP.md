# 09 — Assessment Map

> **Project context:** K–12 Learning App Suite with Foundation Academy (K–5), Bridge Academy (6–8), and Scholar Academy (9–12). The platform is a thinking-development and retention platform, not a video/flashcard library. Every curriculum artifact must support the core loop: **Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply**.

## Purpose

This document defines all assessment types used by the platform and how they connect to mastery, thinking skills, Memory Vault, dashboards, and adaptive learning.

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

## Assessment Philosophy

Assessment is not only grading. Assessment is a learning signal. Each assessment should tell the student, parent, teacher, and app what to do next.

## Assessment Types

| Assessment Type | Timing | Purpose | Output |
|---|---|---|---|
| Diagnostic Assessment | Before unit/course | Placement and readiness | Starting level, prerequisites |
| Lesson Check | During lesson | Immediate understanding | Feedback/hints |
| Retrieval Check | End of lesson | Recall from memory | Memory Vault item scheduling |
| Mini Quiz | End of lesson | Skill/mastery score | Branching decision |
| Unit Quiz | End of unit | Unit mastery | Gradebook/dashboard signal |
| Performance Task | Mid/end unit | Application | Rubric score |
| Project Assessment | End of project | Artifact quality | Project/rubric score |
| Writing Assessment | Writing lessons | Communication quality | Writing rubric score |
| Lab Assessment | Science units | Evidence/investigation quality | Lab rubric score |
| Discussion Assessment | Dialogue tasks | Academic talk quality | Discussion rubric score |
| Interpretation Assessment | Reading/history/data/media | Depth of interpretation | Interpretation rubric score |
| Evidence Reasoning Assessment | CER tasks | Claim/evidence/reasoning quality | Evidence score |
| Cumulative Review | Weekly/monthly | Long-term retention | Retention score |
| Memory Vault Mastery Check | Day 30+ | Durable recall | Retention strength |
| Capstone Assessment | Major project | Transfer/application | Portfolio evidence |

## Mastery Score Integration

Assessments may feed these scores:

- Content Mastery Score
- Problem-Solving Score
- Critical Thinking Score
- Evidence Score
- Interpretation Score
- Discussion Score
- Retention Score
- Reflection Score
- Fluency Score
- Project Score

## Assessment Design Requirements

Every assessment item should include:

- Question/task prompt.
- Expected response.
- Correct answer or rubric criteria.
- Explanation.
- Standards tags.
- Thinking skill tags.
- Difficulty level.
- Feedback rule.
- Reteach link.
- Challenge link if mastered.
- Accessibility notes if needed.

## Question Difficulty Levels

| Level | Description |
|---|---|
| 1 | Recall or identify. |
| 2 | Apply a known skill. |
| 3 | Explain reasoning or evidence. |
| 4 | Analyze/compare/debug. |
| 5 | Transfer to new situation or project. |

## Assessment QA Checklist

- The assessment measures the stated objective.
- Distractors reveal meaningful misconceptions.
- Correct answers include explanations.
- At least one item requires reasoning, evidence, or explanation.
- The assessment feeds adaptive branching.
- The assessment can be used in reporting without exposing private student data.

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
