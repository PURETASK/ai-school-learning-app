# 20 — MVP Content Production Plan

> **Project context:** K–12 Learning App Suite with Foundation Academy (K–5), Bridge Academy (6–8), and Scholar Academy (9–12). The platform is a thinking-development and retention platform, not a video/flashcard library. Every curriculum artifact must support the core loop: **Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply**.

## Purpose

This document defines the exact content-production sequence for the MVP. It converts the curriculum inventory into a realistic production pipeline.

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

## MVP Boundary

| Academy | Grade/Course | Subjects/Courses |
|---|---|---|
| Foundation | Grade 3 | ELA, Math, Science, Social Studies |
| Bridge | Grade 6 | ELA, Math, Science, Social Studies |
| Scholar | Grade 9 | English 9, Algebra I, Biology, World History I |

## Production Phases

### Phase A — Curriculum Structure

1. Approve platform curriculum overview.
2. Approve academy syllabi index.
3. Approve K–12 scope and sequence.
4. Approve MVP grade/course syllabi.
5. Approve MVP unit maps.

### Phase B — Seed Content

1. Create 12 complete seed lessons.
2. Create quiz questions and answer keys.
3. Create Memory Vault items.
4. Create reteach paths.
5. Create challenge paths.
6. Create parent/teacher notes.
7. Validate lesson JSON schema.

### Phase C — App Import Readiness

1. Confirm lesson IDs.
2. Confirm unit IDs.
3. Confirm standard and thinking tags.
4. Export CSV and JSON tables.
5. Test import with Lesson Player.
6. Test quiz scoring and feedback.
7. Test Memory Vault schedule creation.

### Phase D — MVP Expansion

1. Expand each MVP subject to one full unit.
2. Add unit assessments.
3. Add project starter.
4. Add 30-day Memory Vault checks.
5. Add dashboard report examples.

## 12 Seed Lessons

| ID | Lesson | Required Artifacts |
|---|---|---|
| FA-G3-MATH-U1-L1 | Multiplication as Equal Groups | Lesson MD/JSON, 8 quiz items, 5 review items, reteach, challenge |
| FA-G3-ELA-U2-L1 | Finding the Main Idea | Lesson MD/JSON, 8 quiz items, 5 review items, reteach, challenge |
| FA-G3-SCI-U1-L1 | Plant Life Cycles | Lesson MD/JSON, 8 quiz items, 5 review items, reteach, challenge |
| FA-G3-SS-U1-L1 | Communities and Roles | Lesson MD/JSON, 8 quiz items, 5 review items, reteach, challenge |
| BA-G6-MATH-U1-L1 | Understanding Ratios | Lesson MD/JSON, 8 quiz items, 5 review items, reteach, challenge |
| BA-G6-ELA-U2-L1 | Theme and Text Evidence | Lesson MD/JSON, 8 quiz items, 5 review items, reteach, challenge |
| BA-G6-SCI-U2-L1 | Water Cycle Systems | Lesson MD/JSON, 8 quiz items, 5 review items, reteach, challenge |
| BA-G6-SS-U2-L1 | Ancient Civilizations and Geography | Lesson MD/JSON, 8 quiz items, 5 review items, reteach, challenge |
| SA-G9-ALG1-U1-L1 | Variables and Expressions | Lesson MD/JSON, 8 quiz items, 5 review items, reteach, challenge |
| SA-G9-ENG9-U3-L1 | Claim, Evidence, and Reasoning | Lesson MD/JSON, 8 quiz items, 5 review items, reteach, challenge |
| SA-G9-BIO-U2-L1 | Cells as Systems | Lesson MD/JSON, 8 quiz items, 5 review items, reteach, challenge |
| SA-G9-WH1-U2-L1 | Early River Valley Civilizations | Lesson MD/JSON, 8 quiz items, 5 review items, reteach, challenge |

## Definition of Done for a Complete Lesson

A lesson is MVP-ready when it has:

- Complete Markdown lesson.
- Complete JSON lesson.
- Standards tags.
- Thinking skill tags.
- 8 quiz/retrieval questions.
- Answer key with explanations.
- 5 Memory Vault items.
- Reteach path.
- 2 challenge tasks.
- Parent/teacher note.
- Accessibility note.
- QA status approved.

## MVP Success Metrics

| Metric | Target |
|---|---|
| Lesson completion flow | Student can complete all 12 seed lessons in app. |
| Quiz scoring | All quiz items score and show feedback. |
| Mastery branching | Scores route to reteach/review/challenge. |
| Memory Vault | Review items are scheduled after lesson completion. |
| Parent dashboard | Adult can see completed lesson, score, weak skill, next review. |
| Content validation | All JSON files pass schema validation. |

## Production Risks

| Risk | Mitigation |
|---|---|
| Too much curriculum too early | Complete 12 seed lessons first. |
| Weak lesson quality | Use universal lesson structure and QA checklist. |
| Missing adaptive paths | Require reteach/challenge per lesson. |
| Passive content drift | Enforce active practice, evidence, retrieval. |
| Tag inconsistency | Use standards/thinking tag guide. |
| Child-safety gaps | Keep discussions AI/teacher-structured until controls exist. |

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
