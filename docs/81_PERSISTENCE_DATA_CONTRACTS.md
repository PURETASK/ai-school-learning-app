# 81 — Persistence Data Contracts

## Purpose

This document defines what the app saves in V7 and how each persisted record maps to the learning system.

## Primary Contract

The central type is `LearningPersistenceState` in:

```txt
src/types/persistence.ts
```

## Persisted State Fields

| Field | Purpose |
|---|---|
| `schemaVersion` | Supports future migration. |
| `studentId` | Scopes data to one student. |
| `selectedLessonId` | Restores the last selected lesson. |
| `completedLessonIds` | Powers dashboard completion. |
| `completedSectionKeysByLesson` | Restores lesson-section progress. |
| `draftAnswersByLesson` | Prevents losing in-progress quiz answers. |
| `quizResults` | Stores latest score per lesson. |
| `quizAttemptHistory` | Stores every submitted quiz attempt. |
| `memoryVaultItems` | Stores scheduled and reviewed review items. |
| `memoryVaultSessionSummaries` | Stores review-session evidence. |
| `mistakeJournalEntries` | Stores detected mistake patterns. |
| `learningPlannerEntries` | Stores planning tasks assigned from lesson/quiz evidence. |
| `portfolioEvidenceItems` | Stores prompts/evidence records for future project portfolio. |
| `createdAtIso` | Initial creation timestamp. |
| `updatedAtIso` | Last save timestamp. |

## Quiz Attempt Record

A quiz attempt saves:

```txt
id
studentId
lessonId
submittedAtIso
result
```

This allows the app to later show improvement over time, not just the latest score.

## Mistake Journal Persistence

Mistake entries are generated after quiz submission. They are deduplicated by ID and include:

```txt
lessonId
questionId
skillTag
mistakeType
severity
evidence
repairPrompt
recommendedSystem
```

## Planner Persistence

Learning Planner entries are assigned after lesson/quiz evidence. They are saved with:

```txt
status: assigned | in_progress | completed
source: lesson | quiz | student
createdAtIso
updatedAtIso
```

## Portfolio Persistence

Portfolio evidence records are saved as private prompts in MVP. Later, they can store uploaded files, drafts, code projects, lab reports, or capstone artifacts.

## Contract Rule

No component should invent an untyped persistence object. Add all persistent data to `src/types/persistence.ts` first.
