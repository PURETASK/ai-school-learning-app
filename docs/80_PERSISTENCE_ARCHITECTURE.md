# 80 — Persistence Architecture

## Purpose

This document defines the V7 persistence layer for the K–12 Learning App MVP. The goal is to make learning progress survive refresh while keeping the implementation simple enough for a prototype and structured enough to migrate to a real database later.

## MVP Storage Mode

V7 uses a typed localStorage adapter.

This is intentional for the prototype because it lets the MVP prove the learning loop before adding auth, RBAC, Supabase/Postgres, and server APIs.

## Persistence Scope

The persistence layer must save:

1. Selected lesson
2. Completed lesson IDs
3. Completed lesson sections
4. Draft quiz answers
5. Quiz results
6. Quiz attempt history
7. Memory Vault scheduled items
8. Memory Vault review session summaries
9. Mistake Journal entries
10. Learning Planner entries
11. Portfolio / Project Evidence prompts

## Current Files

```txt
src/types/persistence.ts
src/features/persistence/persistenceKeys.ts
src/features/persistence/localLearningPersistence.ts
src/features/persistence/usePersistentLearningState.ts
src/features/persistence/components/PersistenceStatusPanel.tsx
```

## Storage Key

```txt
k12-learning-app:v7:student:<studentId>:learning-state
```

## Architecture

```txt
MvpLearningLoop
  uses usePersistentLearningState
    reads localStorage on hydration
    validates/merges lesson IDs
    writes state changes back to localStorage
  passes persisted state into:
    Student Dashboard
    Lesson Player
    Quiz Engine
    Memory Vault Review Session
    Thinking Systems Hub
    Parent Dashboard
```

## Design Rule

Persistence must not be scattered across random components. Components should receive persisted state as props and call parent actions. The central persistence owner for MVP is `MvpLearningLoop`.

## Future Database Migration Rule

The app should replace the storage adapter, not the learning systems. The future server adapter should implement the same conceptual contract:

```txt
loadLearningState(studentId)
saveLearningState(studentId, state)
resetLearningState(studentId)
appendQuizAttempt(studentId, attempt)
appendMemoryVaultSession(studentId, session)
appendMistakeEntries(studentId, entries)
upsertPlannerEntry(studentId, entry)
upsertPortfolioEvidence(studentId, item)
```

## Privacy Notes

Local persistence is for MVP/demo only. For real children/users:

- Add auth before multi-user use.
- Enforce role-based access.
- Avoid sensitive data in localStorage.
- Do not persist unrestricted chat content.
- Provide delete/export paths before launch.
