# 86 — Supabase Persistence Adapter

## Architecture

Two persistence layers run together in Supabase mode:

1. **Snapshot layer** (since V8.0): `usePersistentLearningState` saves the whole
   `LearningPersistenceState` to `student_learning_state_snapshots` (debounced
   800ms). Guarantees complete state restore after refresh/login.
2. **Normalized event layer** (V8.1): `supabaseLearningPersistence` implements
   `LearningPersistenceAdapter` — one typed save method per table — so
   dashboards and analytics can query individual events.

## Files
- `src/features/persistence/learningPersistenceAdapter.ts` — contract + input
  types + `PersistenceResult` (structured success/error; never throws).
- `src/features/persistence/supabaseLearningPersistence.ts` — Supabase
  implementation; also exports snapshot load/save/reset and
  `getOrCreateActiveStudentProfileId()`.
- `src/features/persistence/learningPersistenceProvider.ts` — mode switch.
  `local` mode returns a no-op adapter (the localStorage snapshot already
  captures all state), so calling code is identical in both modes.
- `src/lib/supabase/client.ts` — typed `createClient<Database>` singleton.
- `src/types/database.types.ts` — generated from the live schema.

## Mode selection
- `NEXT_PUBLIC_PERSISTENCE_MODE=supabase` + URL + anon key set → Supabase.
- Anything else → V7 localStorage behavior (unchanged).

## Error handling rules
- All adapter methods return `PersistenceResult` — `{ ok: true, data }` or
  `{ ok: false, error: { code, message } }`. No method throws into the UI.
- The snapshot hook surfaces failures through the existing
  `PersistenceStatusPanel` via `status.error`.
- A failed event write never blocks the lesson flow; the snapshot remains the
  source of truth and events can be re-derived.

## Student bootstrap
`getOrCreateActiveStudentProfileId()`: looks up the guardian's first linked
student; if none, creates a `student_profiles` row (user_id null) and a
`guardian_student_links` row. MVP = one child per guardian; multi-child
selection UI is a planned follow-up.

## Engine wiring status (V8.1)
Engines currently persist through the snapshot. Wiring each engine to also call
the normalized methods (quiz submit → saveQuizAttempt, etc.) is the next pass;
the adapter surface is complete and typed so each wiring change is small.
