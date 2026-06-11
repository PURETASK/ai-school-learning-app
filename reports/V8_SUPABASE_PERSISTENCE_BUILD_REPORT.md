# V8 Supabase Persistence Build Report

Date: 2026-06-10

## What V8 delivers
1. Real guardian accounts (email+password) via AuthGate; app gated on sign-in
   in Supabase mode; localStorage demo mode unchanged.
2. Live database schema: 21 tables, full RLS, applied to project AI_SCHOOL
   (`hqsydwjcpcammmfftyqi`) — see docs/85.
3. Snapshot persistence: whole learning state saved per student, restored on
   load (cross-device, survives cache clears).
4. Normalized adapter surface: 15 typed save methods covering all 17 data
   domains (quiz attempts+answers and vault sessions+answers are saved through
   their parent methods), structured error results, no UI crashes.
5. Provider switch (`NEXT_PUBLIC_PERSISTENCE_MODE`), typed Supabase client,
   generated database types.
6. Consent-gated local→account migration helper with summary reporting.

## Validation
- scripts/audit-foundation.mjs: extended with v8 checks — ALL PASS
- scripts/static-smoke-tests.mjs: extended with v8 checks — PASS
- scripts/validate-lessons.mjs: 16/16 PASS (unchanged)
- npx tsc --noEmit: clean
- next build: succeeds

## Known limitations (honest list)
- Engines write the snapshot; normalized event writes are wired for migration
  only so far. Next pass: quiz submit → saveQuizAttempt etc. (docs/86).
- One student per guardian (auto-created). Multi-child UI pending.
- Migration consent UI not yet built (helper + flag exist; needs a prompt
  component after sign-in).
- No delete/export flows yet (COPPA blocker before real launch).
- Keys used during development must be rotated before any real student data.
