# 06 — Course Syllabi Index

> **Project context:** K–12 Learning App Suite with Foundation Academy (K–5), Bridge Academy (6–8), and Scholar Academy (9–12). The platform is a thinking-development and retention platform, not a video/flashcard library. Every curriculum artifact must support the core loop: **Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply**.

## Purpose

This document lists all course syllabi required by the platform and defines the standard course syllabus format. Course syllabi bridge grade-level planning and unit maps.

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

## Course Syllabus Required Sections

Each course syllabus must include:

- Course title and code.
- Academy and grade.
- Course purpose.
- Prerequisite skills.
- Full-year/unit sequence.
- Core standards tag families.
- Thinking skill emphasis.
- Major vocabulary/concept banks.
- Assessment plan.
- Project/application plan.
- Memory Vault review plan.
- Reteach/challenge expectations.
- Parent/teacher notes.
- Accessibility and safety notes.

## Course Code Convention

```txt
[ACADEMY]-G[GRADE]-[SUBJECT]
```

Examples:

```txt
FA-G3-MATH
BA-G6-ELA
SA-G9-ALG1
SA-G9-BIO
```

## Foundation Academy Course Syllabi

For each grade K–5, create syllabi for:

| Subject | Course Code Pattern |
|---|---|
| ELA / Reading | `FA-G#-ELA` |
| Writing | `FA-G#-WRI` |
| Math | `FA-G#-MATH` |
| Science | `FA-G#-SCI` |
| Social Studies | `FA-G#-SS` |
| Computer Science | `FA-G#-CS` |
| Health / PE | `FA-G#-HPE` |
| Arts / Music | `FA-G#-ART` |
| SEL / Life Skills | `FA-G#-SEL` |

## Bridge Academy Course Syllabi

For each grade 6–8, create syllabi for:

| Subject | Course Code Pattern |
|---|---|
| ELA | `BA-G#-ELA` |
| Writing | `BA-G#-WRI` |
| Math | `BA-G#-MATH` |
| Science | `BA-G#-SCI` |
| Social Studies | `BA-G#-SS` |
| Computer Science | `BA-G#-CS` |
| Health / PE | `BA-G#-HPE` |
| Arts / Media | `BA-G#-ART` |
| SEL / Life Skills | `BA-G#-SEL` |
| Study Skills | `BA-G#-STUDY` |

## Scholar Academy Course Syllabi

High school uses named courses:

| Course | Code | Priority |
|---|---|---|
| English 9 | `SA-G9-ENG9` | MVP |
| Algebra I | `SA-G9-ALG1` | MVP |
| Biology | `SA-G9-BIO` | MVP |
| World History I | `SA-G9-WH1` | MVP |
| English 10 | `SA-G10-ENG10` | Later |
| Geometry | `SA-G10-GEO` | Later |
| Chemistry | `SA-G10-CHEM` | Later |
| World History II | `SA-G10-WH2` | Later |
| American Literature | `SA-G11-AM-LIT` | Later |
| Algebra II | `SA-G11-ALG2` | Later |
| Physics | `SA-G11-PHY` | Later |
| U.S. History | `SA-G11-USH` | Later |
| English 12 | `SA-G12-ENG12` | Later |
| Statistics / Precalculus / Financial Math | `SA-G12-MATH-*` | Later |
| Government | `SA-G12-GOV` | Later |
| Economics | `SA-G12-ECON` | Later |
| Capstone | `SA-G12-CAP` | Later |

## MVP Course Syllabi To Create First

```txt
FA-G3-ELA.md
FA-G3-MATH.md
FA-G3-SCI.md
FA-G3-SS.md
BA-G6-ELA.md
BA-G6-MATH.md
BA-G6-SCI.md
BA-G6-SS.md
SA-G9-ENG9.md
SA-G9-ALG1.md
SA-G9-BIO.md
SA-G9-WH1.md
```

## Course Syllabus Acceptance Criteria

A course syllabus is complete when a content writer can create all unit maps from it without asking for missing sequence, assessment, or review information.

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
