# Supabase Normalized Evidence Repair

The production Supabase project is reachable through PostgREST, but the normalized repository probe currently reports two missing tables:

- `lesson_scratchpads`
- `interactive_skill_evidence`

The full source migration remains `db/migrations/0001_k12_learning_foundation.sql`. If that migration has already been applied and only these two tables are missing, run `db/repairs/0002_normalized_learning_evidence.sql` in the Supabase SQL Editor. The repair is idempotent, creates the indexes used by learner-scoped reads, and restores the student/parent/teacher/platform-admin RLS policies.

Do not paste credentials into SQL or commit `.env` files. After running the repair:

```powershell
npm run supabase:check
npm run readiness:audit
```

The first command must report `supabaseRestQuerySucceeded=true` with an empty missing-table list. The readiness report must then show `databaseProbe.status` as `passed` and `databaseMigration` as `sql-ready-and-live-verified`.

If the repair fails because helper functions or parent tables are missing, stop and apply the complete `0001` migration instead. Do not disable RLS or make the tables public to bypass the check.
