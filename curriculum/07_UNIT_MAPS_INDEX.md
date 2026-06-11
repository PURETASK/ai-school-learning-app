# 07 — Unit Maps Index

> **Project context:** K–12 Learning App Suite with Foundation Academy (K–5), Bridge Academy (6–8), and Scholar Academy (9–12). The platform is a thinking-development and retention platform, not a video/flashcard library. Every curriculum artifact must support the core loop: **Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply**.

## Purpose

This document defines the unit map system and lists the MVP unit maps required before lesson production scales. Unit maps are the bridge between course syllabi and individual lessons.

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

## Unit Map Required Fields

Every unit map must include:

- Unit ID.
- Unit title.
- Academy, grade, subject/course.
- Estimated duration.
- Essential question.
- Unit objectives.
- Standards tags.
- Thinking skill tags.
- Core vocabulary.
- Lesson sequence.
- Assessment plan.
- Project/application task.
- Memory Vault targets.
- Reteach paths.
- Challenge paths.
- Parent/teacher notes.
- Accessibility notes.

## Unit ID Convention

```txt
[ACADEMY]-G[GRADE]-[SUBJECT]-U[NUMBER]
```

Examples:

```txt
FA-G3-MATH-U1
BA-G6-SCI-U2
SA-G9-ALG1-U1
```

## MVP Unit Maps — Foundation Grade 3

### Grade 3 Math

| Unit ID | Unit Title | Core Focus |
|---|---|---|
| FA-G3-MATH-U1 | Multiplication Foundations | Equal groups, arrays, skip counting, facts |
| FA-G3-MATH-U2 | Division Foundations | Sharing, grouping, inverse operations |
| FA-G3-MATH-U3 | Fractions as Equal Parts | Unit fractions, comparing, number line |
| FA-G3-MATH-U4 | Area and Perimeter | Measurement, multiplication connection |
| FA-G3-MATH-U5 | Time, Measurement, and Data | Graphs, elapsed time, measurement |
| FA-G3-MATH-U6 | Geometry and Shape Reasoning | Shapes, categories, attributes |
| FA-G3-MATH-U7 | Multi-Step Word Problems | Problem-solving lab focus |
| FA-G3-MATH-U8 | Review and Mastery Challenges | Cumulative review and application |

### Grade 3 ELA

| Unit ID | Unit Title | Core Focus |
|---|---|---|
| FA-G3-ELA-U1 | Reading Strategies and Fluency | Accuracy, fluency, comprehension habits |
| FA-G3-ELA-U2 | Main Idea and Key Details | Informational reading, evidence |
| FA-G3-ELA-U3 | Story Elements and Theme | Characters, setting, plot, lesson/theme |
| FA-G3-ELA-U4 | Vocabulary in Context | Context clues, morphology |
| FA-G3-ELA-U5 | Point of View and Perspective | Narrator, speaker, opinion |
| FA-G3-ELA-U6 | Comparing Texts | Similarities, differences, evidence |
| FA-G3-ELA-U7 | Research Reading | Sources, facts, notes |
| FA-G3-ELA-U8 | Reading Mastery Project | Presentation/book response |

### Grade 3 Science

| Unit ID | Unit Title | Core Focus |
|---|---|---|
| FA-G3-SCI-U1 | Plant and Animal Life Cycles | Growth, survival, inherited traits |
| FA-G3-SCI-U2 | Ecosystems and Habitats | Needs, adaptation, food chains |
| FA-G3-SCI-U3 | Weather and Climate Patterns | Data, patterns, forecasting |
| FA-G3-SCI-U4 | Forces and Motion | Pushes, pulls, cause/effect |
| FA-G3-SCI-U5 | Engineering Design | Build, test, improve |

### Grade 3 Social Studies

| Unit ID | Unit Title | Core Focus |
|---|---|---|
| FA-G3-SS-U1 | Communities and Roles | People, jobs, responsibilities |
| FA-G3-SS-U2 | Maps and Regions | Geography, symbols, directions |
| FA-G3-SS-U3 | Local and State History | Change over time, sources |
| FA-G3-SS-U4 | Citizenship and Government | Rules, rights, responsibilities |
| FA-G3-SS-U5 | Economics in Communities | Needs, wants, goods, services |

## MVP Unit Maps — Bridge Grade 6

| Course | Unit 1 | Unit 2 | Unit 3 | Unit 4 | Unit 5 |
|---|---|---|---|---|---|
| Math | Ratios and Rates | Fraction/Decimal Operations | Rational Numbers | Expressions/Equations | Statistics/Data |
| ELA | Close Reading | Theme and Evidence | Informational Text | Argument Writing | Research Project |
| Science | Scientific Modeling | Water Cycle Systems | Weather/Climate | Ecosystems | Engineering Design |
| Social Studies | Geography Tools | Ancient River Civilizations | Egypt/Mesopotamia | Greece/Rome | Trade and Culture |

## MVP Unit Maps — Scholar Grade 9

| Course | Unit 1 | Unit 2 | Unit 3 | Unit 4 | Unit 5 |
|---|---|---|---|---|---|
| Algebra I | Variables/Expressions | Linear Equations | Inequalities | Functions | Systems |
| English 9 | Close Reading | Literary Analysis | CER Writing | Rhetoric | Research |
| Biology | Science Practices | Cells as Systems | Genetics | Evolution | Ecology |
| World History I | Historical Thinking | River Civilizations | Classical Empires | Belief Systems | Trade Networks |

## Unit Map Acceptance Criteria

A unit map is complete when it supports:

- Lesson planning.
- Assessment design.
- Memory Vault item creation.
- Reteach/challenge branching.
- Parent/teacher reporting.
- Standards/thinking skill tagging.

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
