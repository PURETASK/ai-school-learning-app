# 14 — Vocabulary and Concept Bank

> **Project context:** K–12 Learning App Suite with Foundation Academy (K–5), Bridge Academy (6–8), and Scholar Academy (9–12). The platform is a thinking-development and retention platform, not a video/flashcard library. Every curriculum artifact must support the core loop: **Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply**.

## Purpose

This document defines the vocabulary and concept bank system. Vocabulary is not just glossary text; it feeds lessons, quizzes, Memory Vault, reteach paths, accessibility supports, and parent/teacher notes.

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

## Vocabulary Entry Schema

Every vocabulary/concept entry must include:

```ts
type VocabularyEntry = {
  id: string;
  term: string;
  academy: "foundation" | "bridge" | "scholar";
  gradeLevel: string;
  subject: string;
  unitId?: string;
  lessonId?: string;
  studentFriendlyDefinition: string;
  formalDefinition?: string;
  example: string;
  nonExample?: string;
  visualIdea?: string;
  relatedTerms: string[];
  standardsTags: string[];
  thinkingSkillTags: string[];
  memoryVaultPrompt: string;
  accessibilityNotes?: string;
};
```

## Entry Requirements

| Field | Why It Matters |
|---|---|
| Student-friendly definition | Makes vocabulary accessible. |
| Formal definition | Supports older grades and teacher use. |
| Example | Shows correct use. |
| Non-example | Prevents misconception. |
| Visual idea | Supports K–5 and accessibility. |
| Related terms | Builds concept networks. |
| Memory Vault prompt | Supports retention. |

## MVP Vocabulary Banks

Create vocabulary banks for:

```txt
GRADE_3_VOCABULARY_BANK.md
GRADE_6_VOCABULARY_BANK.md
GRADE_9_VOCABULARY_BANK.md
MATH_CONCEPT_BANK.md
ELA_CONCEPT_BANK.md
SCIENCE_CONCEPT_BANK.md
SOCIAL_STUDIES_CONCEPT_BANK.md
```

## Example Entries

| Term | Grade/Course | Student-Friendly Definition | Memory Vault Prompt |
|---|---|---|---|
| Equal groups | Grade 3 Math | Groups that each have the same number of items. | What does “equal groups” mean in multiplication? |
| Main idea | Grade 3 ELA | The most important point a text is mostly about. | How do details help you find the main idea? |
| Ratio | Grade 6 Math | A comparison between two quantities. | What does a ratio compare? |
| Theme | Grade 6 ELA | A message or lesson about life in a story. | How is theme different from topic? |
| Variable | Algebra I | A symbol that represents a value that can change or is unknown. | What does a variable represent? |
| Cell | Biology | The smallest living unit of an organism. | Why is a cell considered a system? |

## Vocabulary QA Checklist

- Definition is grade-appropriate.
- Example is concrete.
- Non-example prevents likely confusion.
- Term links to lesson and review item.
- Term supports accessibility.
- Memory Vault prompt is answerable without rereading.

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
