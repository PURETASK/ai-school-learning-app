# Database Migration Plan

## Purpose

The schema contract now produces a PostgreSQL migration artifact from code. This gives us a concrete bridge from the current JSON-backed prototype to PostgreSQL or Supabase without hand-maintaining a separate SQL document.

## Generated Artifact

`getPlatformMigration()` generates:

- `create table if not exists` statements for every production table.
- Primary keys.
- Foreign key constraints.
- Foreign-key and scope indexes.
- Table comments.
- Row-level security enables for protected tables.
- Role policies for platform admins, students, parents, teachers, and staff review workflows.
- Supabase-aware auth helper functions that read trusted `app_metadata` claims from `auth.jwt()` when available and fall back to server-side `app.*` settings for direct Postgres operations.

The local preview exposes this through:

```txt
GET /api/schema/migration
```

The Admin view also shows migration readiness and a SQL preview.

To write the generated SQL to disk:

```bash
npm run export:migration
```

The export command writes:

```txt
db/migrations/0001_k12_learning_foundation.sql
```

To apply the migration to a real PostgreSQL-compatible database:

```bash
set DATABASE_URL=postgresql://...
npm run db:apply
```

On PowerShell:

```powershell
$env:DATABASE_URL="postgresql://postgres:<database-password>@db.hqsydwjcpcammmfftyqi.supabase.co:5432/postgres"
npm run db:apply
```

The apply command uses `psql` so the machine running it needs the PostgreSQL CLI available. Run `npm run db:apply -- --dry-run` to verify readiness without touching a database.

Prefer the direct Supabase database host for migrations, local preview servers, and the transition snapshot bridge. The Supabase pooler can work for small reads and table upserts, but it closed the larger `app_state_snapshots` JSON update during local verification. If direct database connections time out on an IPv4-only network, use the pooler only as a fallback and verify `POST /api/learning/quiz` plus `GET /api/learning/catalog` before relying on it. Keep the database password out of source files and paste it only into a local `.env` file or a temporary shell environment variable.

Before applying against Supabase, run the safe preflight:

```powershell
$env:NEXT_PUBLIC_SUPABASE_URL="https://hqsydwjcpcammmfftyqi.supabase.co"
$env:NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="..."
npm run supabase:check
```

The preflight checks project reachability, JWKS reachability, direct database TCP connectivity, and whether `DATABASE_URL` is configured. It does not print keys or passwords.

To export normalized seed data from the current prototype state contract:

```bash
npm run export:seed
```

This writes:

```txt
db/seeds/0001_k12_learning_seed.sql
```

To load that seed projection into the configured database:

```bash
npm run db:seed
```

The seed command uses conflict-safe upserts, so it can refresh the current pilot projection after schema changes without creating duplicate IDs.

## Repository Access Checks

`canAccessRepositoryAction()` validates role/table/operation decisions before we wire a live database:

- Students can write their own learning evidence, quiz attempts, progress, portfolio submissions, and tutor questions.
- Students cannot write tool-call records or publish content.
- Parents can read household learner data and manage household consent/rewards.
- Teachers can write assigned learning, mastery, assignments, and content-review records.
- School admins are scoped to school roster and school operations.
- Platform admins are operational users, with access expected to remain auditable.

## Production Conversion Steps

1. Review generated SQL from `GET /api/schema/migration`.
2. Export it with `npm run export:migration`.
3. Apply it with `DATABASE_URL` and `npm run db:apply`.
4. For Supabase Auth, set role and scope fields in `raw_app_meta_data`/`app_metadata`; do not use user-editable `user_metadata` for authorization.
5. If the app will use the Supabase Data API directly, grant only the needed table privileges to `authenticated` and keep RLS enabled on every exposed table. New Supabase projects may not expose SQL-created tables automatically.
6. Add database integration tests for each role and core protected table.
7. Continue replacing transitional state snapshot reads with normalized repository functions. The learning catalog/progress, content draft, visual asset, and AI tutor event routes are implemented; remaining slices include review decisions and audit events.

## Live Supabase Status

The migration has been applied to the connected Supabase database and verified with:

```bash
npm run db:verify
```

Latest verification result:

- `actualTables=45`
- `missingTables=none`
- `rlsEnabled=33`
- `policies=96`
- `ready=true`

The migration generator also handles partial earlier schema attempts by repairing empty-table column types before recreating foreign keys, indexes, comments, and RLS policies. It only removes inbound foreign-key constraints automatically when the child table is empty; otherwise it raises a manual repair error.
