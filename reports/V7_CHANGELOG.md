# V7 Changelog — Persistence Layer

## Added

- Typed persistence contracts in `src/types/persistence.ts`.
- Local prototype persistence hook in `src/features/persistence/usePersistentLearningState.ts`.
- Persistence status panel with reset control.
- Persistent selected lesson, section completion, quiz drafts, quiz attempts, Memory Vault data, mistake entries, planner entries, and portfolio evidence prompts.
- Parent dashboard persisted-evidence summary.
- Student dashboard saved-evidence summary.
- Persistence architecture, data contract, migration, QA, and privacy docs.
- V7 audit/static checks.

## Updated

- `MvpLearningLoop.tsx` now owns all persisted MVP state through `usePersistentLearningState`.
- `StudentDashboard.tsx` shows saved learning evidence counts.
- `ParentDashboard.tsx` shows persisted learning evidence counts.
- `ThinkingSystemsHub.tsx` accepts persisted evidence summaries.
- Audit and static smoke tests check V7 persistence requirements.

## Validation

- Lesson validation: 16 lessons, no errors.
- Foundation audit: 85 checks, 0 failures.
- Static smoke tests: passed, including V7 persistence checks.

## Known Limitations

- localStorage only; no auth, RBAC, or database yet.
- Data is scoped to the demo student only.
- Free-text persistence should remain limited until production privacy controls exist.
