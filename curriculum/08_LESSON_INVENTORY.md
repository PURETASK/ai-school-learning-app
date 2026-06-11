# 08 — Lesson Inventory

> **Project context:** K–12 Learning App Suite with Foundation Academy (K–5), Bridge Academy (6–8), and Scholar Academy (9–12). The platform is a thinking-development and retention platform, not a video/flashcard library. Every curriculum artifact must support the core loop: **Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply**.

## Purpose

This document defines how every lesson is tracked from idea to publication. It is the source of truth for lesson status, metadata, dependencies, and production readiness.

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

## Lesson Inventory Required Columns

| Column | Required | Description |
|---|---:|---|
| Lesson ID | Yes | Stable unique ID. |
| Title | Yes | Student/teacher-readable title. |
| Academy | Yes | Foundation, Bridge, or Scholar. |
| Grade | Yes | Grade level or course grade. |
| Subject/Course | Yes | ELA, Math, Biology, etc. |
| Unit ID | Yes | Parent unit. |
| Lesson Number | Yes | Order inside unit. |
| Lesson Type | Yes | Concept, skill, review, project, etc. |
| Estimated Minutes | Yes | Age-appropriate time estimate. |
| Standards Tags | Yes | Standards families addressed. |
| Thinking Skill Tags | Yes | Thinking pillars used. |
| Memory Vault Items | Yes | Number or IDs created. |
| Quiz Items | Yes | Number or IDs created. |
| Reteach Path | Yes | Linked support content. |
| Challenge Path | Yes | Linked enrichment content. |
| Status | Yes | Workflow status. |
| QA Owner | Recommended | Reviewer responsible. |
| Last Updated | Recommended | Version control. |

## Lesson Type Taxonomy

| Type | Purpose |
|---|---|
| Concept Lesson | Introduces a new concept. |
| Skill Lesson | Builds a procedural skill. |
| Worked Example Lesson | Shows step-by-step modeling. |
| Guided Practice Lesson | Scaffolds student practice. |
| Active Practice Lesson | Requires student action/application. |
| Problem-Solving Lab | Uses first-principles problem solving. |
| Critical Thinking Lesson | Evaluates logic, assumptions, and alternatives. |
| Evidence-Based Reasoning Lesson | Uses Claim → Evidence → Reasoning. |
| Interpretation Lesson | Analyzes meaning, source, data, or perspective. |
| Discussion Lesson | Uses structured academic dialogue. |
| Review Lesson | Cumulative review. |
| Reteach Lesson | Alternate instruction after low score. |
| Challenge Lesson | Enrichment after mastery. |
| Project Lesson | Produces an artifact. |
| Assessment Lesson | Diagnostic, quiz, unit test, or performance task. |
| Reflection Lesson | Student self-assessment and metacognition. |
| Memory Vault Review | Spaced recall/retrieval. |

## MVP Seed Lessons

| Lesson ID | Title | Academy | Grade/Course | Subject | Purpose |
|---|---|---|---|---|---|
| FA-G3-MATH-U1-L1 | Multiplication as Equal Groups | Foundation | Grade 3 | Math | Tests visual/first-principles math. |
| FA-G3-ELA-U2-L1 | Finding the Main Idea | Foundation | Grade 3 | ELA | Tests evidence-based reading. |
| FA-G3-SCI-U1-L1 | Plant Life Cycles | Foundation | Grade 3 | Science | Tests science sequence and observation. |
| FA-G3-SS-U1-L1 | Communities and Roles | Foundation | Grade 3 | Social Studies | Tests civics/community reasoning. |
| BA-G6-MATH-U1-L1 | Understanding Ratios | Bridge | Grade 6 | Math | Tests proportional reasoning. |
| BA-G6-ELA-U2-L1 | Theme and Text Evidence | Bridge | Grade 6 | ELA | Tests interpretation/evidence. |
| BA-G6-SCI-U2-L1 | Water Cycle Systems | Bridge | Grade 6 | Science | Tests systems thinking. |
| BA-G6-SS-U2-L1 | Ancient Civilizations and Geography | Bridge | Grade 6 | Social Studies | Tests cause/effect and geography. |
| SA-G9-ALG1-U1-L1 | Variables and Expressions | Scholar | Grade 9 | Algebra I | Tests high-school math modeling. |
| SA-G9-ENG9-U3-L1 | Claim, Evidence, and Reasoning | Scholar | Grade 9 | English 9 | Tests academic argument. |
| SA-G9-BIO-U2-L1 | Cells as Systems | Scholar | Grade 9 | Biology | Tests systems model + evidence. |
| SA-G9-WH1-U2-L1 | Early River Valley Civilizations | Scholar | Grade 9 | World History I | Tests source/context reasoning. |

## Lesson Completion Definition

A lesson is complete only when it has:

- Markdown curriculum file.
- JSON lesson file.
- Quiz items.
- Answer key.
- Feedback explanations.
- Memory Vault items.
- Reteach path.
- Challenge path.
- Accessibility notes.
- Parent/teacher notes.
- QA review status.

## Inventory Governance

- Adding a lesson requires updating this inventory.
- Deleting a lesson requires preserving archived status.
- Changing a lesson ID requires updating question, review, reteach, challenge, and dashboard links.
- No lesson may be implemented without a parent unit.

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
