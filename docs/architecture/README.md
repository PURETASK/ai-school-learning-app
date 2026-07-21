# Architecture Documentation Index

## Canonical

- `../../PROJECT_SOURCE_OF_TRUTH.md` — Nexus Learning OS V7. Controls product identity, pedagogy, mastery, memory, assessment, AI behavior, and cross-functional decisions.
- `NEXUS_LEARNING_OS_MIGRATION_PLAN.md` — implementation order and backward-compatibility requirements.

## Legacy

Place superseded V6 documents in `../archive/v6/`. Legacy files may explain existing code but may not override V7.

Every legacy document should begin with:

```text
STATUS: LEGACY — SUPERSEDED BY PROJECT_SOURCE_OF_TRUTH.md V7
USE: Historical implementation context only
```

## Conflict rule

When documentation disagrees:

1. `PROJECT_SOURCE_OF_TRUTH.md`
2. Current migration plan
3. Current task-specific approved specification
4. Existing implementation documentation
5. Legacy documentation

Codex must report unresolved contradictions instead of inventing a compromise.
