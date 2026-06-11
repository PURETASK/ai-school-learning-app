# K–12 Learning App Master Foundation

This archive merges the project foundation into one repo-ready package.

It includes:

- Product/engineering/safety docs `docs/01–60`
- Curriculum inventory/control docs `curriculum/01–20`
- Polished seed lessons v2 in Markdown and JSON
- App-ready seed lesson JSON under `content/`
- Lesson schema under `schemas/`
- Repo scaffold folders under `src/`
- TypeScript type stubs and basic MVP engines
- Lesson validation script
- Tactical Codex build docs
- Consistency audit report

## Start Here

Read these first:

1. `PROJECT_SOURCE_OF_TRUTH.md`
2. `CANONICAL_NAMING_CONVENTIONS.md`
3. `CODEX_FIRST_BUILD_PROMPT.md`
4. `MVP_VERTICAL_SLICE_SPEC.md`
5. `LESSON_IMPORT_PLAN.md`
6. `LESSON_VALIDATION_RULES.md`
7. `reports/CONSISTENCY_AUDIT_REPORT.md`

## First Build Goal

Build the MVP vertical slice:

```txt
Student Dashboard → Lesson Player → Quiz Engine → Feedback Engine → Mastery Engine → Memory Vault → Parent Dashboard
```

## Validate Lessons

```bash
node scripts/validate-lessons.mjs
```

## Current Seed Content

- 12 polished seed lessons
- 144 quiz questions
- 72 Memory Vault items
- Reteach and challenge paths
- Master answer key and Memory Vault files

## Important Rule

Do not build homepage-first, payments, public discussions, mobile app, full AI tutor, school admin, or all K–12 content before proving the learning loop.


## V3 Audit Status

This archive has been audited against the project build guide. V3 adds compliance reports, static smoke tests, a foundation audit script, progress/analytics contracts, and a corrected 16-section Lesson Player.

Run:

```bash
npm run validate:lessons
npm run audit
npm run test
```

See `reports/COMPREHENSIVE_SYSTEM_AUDIT_V3.md` for the full review.


## V5 Thinking Systems Update

The MVP now includes 16 seed lessons and a Thinking Systems Hub. The hub implements Mistake Journal, Reteach/Intervention, Challenge/Enrichment, Problem-Solving Lab, Evidence Room, Interpretation Lens, Discussion Arena, Learning Planner, Systems Mapper, and Portfolio Evidence scaffolds.

## V7 Persistence Layer

The MVP now includes local prototype persistence. Progress, quiz attempts, Memory Vault sessions, Mistake Journal entries, Learning Planner entries, and Portfolio Evidence prompts survive browser refresh through a typed localStorage adapter.

Run checks:

```bash
npm run check
```

Persistence docs:

- `docs/80_PERSISTENCE_ARCHITECTURE.md`
- `docs/81_PERSISTENCE_DATA_CONTRACTS.md`
- `docs/82_LOCAL_STORAGE_TO_DATABASE_MIGRATION_PLAN.md`
- `docs/83_PERSISTENCE_QA_AND_ACCEPTANCE_TESTS.md`
- `docs/84_PERSISTENCE_PRIVACY_AND_DATA_RETENTION.md`
