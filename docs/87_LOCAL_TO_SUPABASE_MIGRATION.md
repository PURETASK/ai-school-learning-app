# 87 — Local to Supabase Migration

## Purpose
Move a V7 localStorage learning state into the signed-in account without
losing progress and without silently uploading child data.

## Flow (src/features/persistence/migrateLocalToSupabase.ts)
1. User signs in (AuthGate).
2. App detects local V7 state via `readLocalLearningState(localStudentId)`.
3. App asks: "Save this learning progress to your account?" —
   `migrateLocalToSupabase({ localStudentId, consentConfirmed })` refuses to
   run unless `consentConfirmed: true` comes from that explicit user action.
4. Order of writes:
   a. Whole-state snapshot first (if this fails, abort — retryable, nothing lost).
   b. Quiz attempts + answers (per-row, failures collected).
   c. Memory Vault items (stage names mapped `day-1` → `day_1`).
   d. Mistake Journal entries (mistake types normalized).
5. On success a local flag (`k12-learning-app:migrated-to-supabase:<studentId>`)
   prevents duplicate uploads.
6. Returns `MigrationSummary` (counts + per-row failures) for display.

## Not yet migrated as events
Planner/portfolio/thinking-system entries ride along inside the snapshot
(nothing is lost); event-level backfill can be added when those systems are
wired to the normalized adapter.

## Consent rule
Child data must never be uploaded without an explicit confirmation step
(docs/84). The consent gate is enforced in code, not just UI.
