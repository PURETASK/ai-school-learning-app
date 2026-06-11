# 01 — Platform Curriculum Overview

> **Project context:** K–12 Learning App Suite with Foundation Academy (K–5), Bridge Academy (6–8), and Scholar Academy (9–12). The platform is a thinking-development and retention platform, not a video/flashcard library. Every curriculum artifact must support the core loop: **Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply**.

## Purpose

This document defines the complete curriculum system for the K–12 Learning App Suite. It explains what curriculum means in this product, how the three academies relate to one another, how subjects and courses are organized, and how lessons connect to thinking skills, retention, mastery, projects, and dashboards.

This is the curriculum-control document. All other curriculum documents should reference it.

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

## Curriculum Definition

In this platform, curriculum is not only a list of topics. A curriculum artifact is complete only when it defines:

- What students learn.
- Why it matters.
- How students think through it.
- How students practice it.
- How students prove it.
- How students remember it later.
- How the app adapts when students struggle or excel.
- How adults understand progress.

## Academy Model

| Academy | Grades | Primary Development Goal | UX Mode | Curriculum Mode |
|---|---:|---|---|---|
| Foundation Academy | K–5 | Build literacy, numeracy, curiosity, habits, and early reasoning | Guided, visual, playful | Grade-level subject syllabi |
| Bridge Academy | 6–8 | Build independence, study systems, evidence use, and abstract reasoning | Quest-based, skill-tree, structured | Grade-level subject syllabi + research/lab projects |
| Scholar Academy | 9–12 | Build credit-style academic mastery, portfolio evidence, and career/college readiness | Course dashboard, portfolio, capstone | Course-based syllabi |

## Curriculum Object Hierarchy

```txt
Platform
  Academy
    Grade Band
      Grade Level
        Subject
          Course
            Unit
              Lesson
                Lesson Section
                Activity
                Quiz Item
                Memory Vault Item
                Reteach Path
                Challenge Path
                Parent/Teacher Note
```

## Core Curriculum Artifacts

| Artifact | Required Before MVP? | Purpose |
|---|---:|---|
| Platform curriculum overview | Yes | Defines global curriculum rules. |
| Academy syllabi | Yes | Defines K–5, 6–8, 9–12 experience. |
| K–12 scope and sequence | Yes | Shows grade-to-grade progression. |
| Subject scope and sequence | Yes | Shows subject progression across grades. |
| Grade-level syllabi | MVP grades first | Defines full-year grade expectations. |
| Course syllabi | MVP courses first | Defines course-level expectations. |
| Unit maps | MVP first | Converts syllabi into teachable sequences. |
| Lesson inventory | Yes | Tracks every lesson and status. |
| Question bank | Yes for seed lessons | Feeds quizzes and review. |
| Memory Vault map | Yes | Prevents forgetting. |
| Reteach/challenge maps | Yes | Enables adaptation. |
| Rubric library | Yes for thinking/project tasks | Enables quality scoring. |

## MVP Curriculum Boundary

The first release should not attempt all K–12 content. The MVP curriculum is:

| Academy | Grade/Course | Subjects |
|---|---|---|
| Foundation Academy | Grade 3 | ELA, Math, Science, Social Studies |
| Bridge Academy | Grade 6 | ELA, Math, Science, Social Studies |
| Scholar Academy | Grade 9 | English 9, Algebra I, Biology, World History I |

## Curriculum Success Criteria

The curriculum is successful when a student can:

- Complete a lesson using the universal lesson flow.
- Explain the concept in their own words.
- Solve a related problem with evidence/reasoning.
- Receive useful feedback.
- Enter a Memory Vault review cycle.
- See progress on dashboard mastery scores.
- Receive reteach or challenge content based on performance.

## Non-Negotiable Curriculum Rules

1. No orphan lessons.
2. No lesson without a learning objective.
3. No lesson without standards tags and thinking skill tags.
4. No quiz without answer explanations.
5. No completion without future review scheduling.
6. No reward for passive clicking.
7. No discussion feature without safety controls.
8. No child-facing content without accessibility review.
9. No curriculum expansion without index updates.
10. No “fun” that distracts from learning evidence.

## Related Documents

- `02_ACADEMY_SYLLABI_INDEX.md`
- `03_K12_SCOPE_AND_SEQUENCE.md`
- `08_LESSON_INVENTORY.md`
- `09_ASSESSMENT_MAP.md`
- `11_MEMORY_VAULT_REVIEW_MAP.md`
- `20_MVP_CONTENT_PRODUCTION_PLAN.md`

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
