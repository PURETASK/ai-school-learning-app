# V8 Changelog

## V8.0 — Auth + snapshot persistence
- AuthGate (email/password sign-up/sign-in/sign-out)
- Supabase client + snapshot save/load/reset (student_learning_state_snapshots)
- Dual-mode persistence hook (local default, supabase via env)
- Initial 10-table schema; consolidation of legacy duplicate schema (0003/0004)
- Fixes: portfolioEvidenceEngine successCriteria, tailwindcss pinned ^3

## V8.1 — Full normalized data model
- 20-table proposal schema applied with fixes (canonical academy slugs,
  default profile role, guardian child-creation policy, can_write_student)
- snapshot table retained and repointed to student_profiles
- Generated database types; typed client
- LearningPersistenceAdapter contract + Supabase implementation (15 methods)
- Provider switch + local no-op fallback adapter
- Consent-gated migrateLocalToSupabase with MigrationSummary
- Docs 85–88; audit + smoke tests extended with V8 checks
