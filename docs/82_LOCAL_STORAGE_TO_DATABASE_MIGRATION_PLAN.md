# 82 — Local Storage to Database Migration Plan

## Purpose

V7 proves persistence in the browser. This document explains how to migrate to Supabase/Postgres later.

## Phase 1 — Local Prototype

Current V7 scope:

```txt
localStorage
single demo student
no auth
no server persistence
safe for prototype only
```

## Phase 2 — Auth and User Scope

Add:

```txt
Supabase Auth or Clerk
student profile table
guardian-student link table
role-based access checks
```

## Phase 3 — Database Tables

Suggested initial tables:

```txt
student_learning_state_snapshots
lesson_progress
quiz_attempts
memory_vault_items
memory_vault_sessions
mistake_journal_entries
learning_planner_entries
portfolio_evidence_items
```

## Phase 4 — Adapter Replacement

Replace localStorage functions with server-backed equivalents:

```txt
loadLearningState → fetch from database
saveLearningState → upsert snapshot / transactional updates
resetLearningState → archive/delete per policy
```

## Phase 5 — Parent Dashboard Security

Parent dashboard data must be filtered server-side by guardian-student relationship. Never trust client-only filtering for real users.

## Phase 6 — Data Retention and Deletion

Before launch:

- Add delete/export data flows.
- Define retention windows.
- Avoid saving sensitive free-text unless necessary.
- Add audit logs for admin access.

## Migration Rule

Do not rewrite Lesson Player, Quiz Engine, Memory Vault, or Thinking Systems for database support. Only swap the persistence adapter and API/service layer.
