# 85 — Supabase Schema and RLS

## Status
Applied to live project `hqsydwjcpcammmfftyqi` (AI_SCHOOL) on 2026-06-10 via two migrations:
`v8_full_normalized_schema_part1_tables` and `v8_full_normalized_schema_part2_rls`.
Repo copy: `supabase/migrations/0005_v8_full_normalized_schema.sql`.

## Data Model (21 tables)

Identity: `profiles` (1:1 with auth.users, auto-created by trigger, default role `parent`),
`student_profiles` (children; `user_id` nullable — guardian-managed children have no login),
`guardian_student_links` (many-to-many guardian↔student).

State: `student_learning_state_snapshots` — whole `LearningPersistenceState` as JSONB,
one row per student. This is the restore path and safety net.

Normalized learning data: `lesson_progress`, `quiz_attempts`, `quiz_answers`,
`mastery_records` (unique per student+skill), `memory_vault_items`,
`memory_vault_review_sessions`, `memory_vault_review_answers`,
`mistake_journal_entries`, `reteach_plans`, `challenge_plans`.

Thinking systems: `problem_solving_lab_entries`, `evidence_room_entries`,
`interpretation_lens_entries`, `discussion_arena_entries`, `learning_planner_entries`,
`systems_mapper_entries`, `portfolio_evidence_items`.

## Deviations from the original proposal (intentional)

1. `academy` check uses canonical slugs (`foundation-academy`, `bridge-academy`,
   `scholar-academy`) to match PROJECT_SOURCE_OF_TRUTH and lesson JSON — not
   the short names in the draft proposal.
2. `profiles.role` defaults to `parent` and is auto-created by the
   `on_auth_user_created` trigger so sign-up cannot fail on a missing role.
3. Added policy `guardians can insert child profiles` (user_id IS NULL): the
   draft only allowed self-owned student profiles, which would have made it
   impossible for a parent to create a child.
4. Added `can_write_student()`: linked guardians may write student data because
   in the MVP the guardian account operates the app on the child's behalf.
5. Snapshot table retained (not in the draft) per docs/82 — adapter-level
   restore without rewriting engines, and a recovery source if event writes fail.

## RLS
- RLS enabled on all 21 tables; 51+ policies.
- Pattern: SELECT allowed to owner or linked guardian; INSERT/UPDATE via
  `can_write_student`; child tables (quiz_answers, review answers) check
  ownership through their parent row.
- Helper functions are SECURITY DEFINER with `search_path = public`, EXECUTE
  revoked from `anon`. `authenticated` keeps EXECUTE (required for policies);
  they only disclose the caller's own access rights — accepted advisor warning,
  see docs/88.

## Mastery bands (DB values)
`needs_intervention` (0–39), `needs_reteach` (40–64), `almost_mastered` (65–79),
`mastered` (80–89), `advanced` (90–100).

## Mistake type mapping
App enum `used_wrong_operation` → DB `wrong_operation`
(`normalizeMistakeType()` in the Supabase adapter).
