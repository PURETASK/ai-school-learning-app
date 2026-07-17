# Nexus Learning OS V7 Migration Status

**Status:** V3 contract and compatibility foundations are installed; evidence, Memory Vault, production runtime, and exemplar expansion remain in progress.  
**Last updated:** 2026-07-16

## Canonical Documents

| Artifact | Status | Repository path | Notes |
|---|---|---|---|
| Project source of truth | Installed | `PROJECT_SOURCE_OF_TRUTH.md` | Controls product, pedagogy, mastery, AI, safety, and migration decisions. |
| V7 ingestion/audit prompt | Installed | `CODEX_V7_INGESTION_PROMPT.md` | Audit task completed in `docs/architecture/V7_REPOSITORY_AUDIT.md`. |
| V7 acceptance checklist | Installed | `V7_ACCEPTANCE_CHECKLIST.md` | Drives migration validation. |
| V7 migration plan | Installed | `docs/architecture/NEXUS_LEARNING_OS_MIGRATION_PLAN.md` | Official phase plan. |
| Architecture index | Installed | `docs/architecture/README.md` | Points contributors at canonical architecture docs. |
| V7 AGENTS handoff copy | Preserved | `docs/nexus-learning-os/AGENTS_V7_CANONICAL.md` | Kept as reference so the existing project `AGENTS.md` could be updated without wholesale overwrite. |
| Install instructions | Preserved | `docs/nexus-learning-os/INSTALL_INSTRUCTIONS.md` | Installation evidence and future handoff guidance. |
| Legacy archive marker | Installed | `docs/archive/v6/README.md` | Marks older V6 assumptions as historical context. |
| Grade 6 California source ledger | Installed | `data/source-ledger/california-grade-6-source-ledger.json` | Stores official standards sources plus IXL reference-only URLs with copyright/use boundaries. |
| Grade 6 Bridge Academy scope sequence | Installed | `docs/curriculum/grade-6-california-scope-sequence.md` | Original Grade 6 math, ELA, science, and social-studies blueprint for Batch 1 planning. |

## Phase Progress

| Phase | Status | Current result | Next required action |
|---|---|---|---|
| Phase 0: documentation lock | In progress | Canonical V7 docs installed and `AGENTS.md` now declares V7 precedence. | Mark stale legacy docs and keep this status tracker updated. |
| Phase 1: V3 contracts | In progress | Lesson, unit, mastery-evidence, Memory Vault, and error-intelligence JSON contracts plus runtime validators now exist beside V2. | Add repository persistence and route-level reads/writes for the new evidence records. |
| Phase 2: V2 adapter | Complete | `adaptV2LessonToNexusV3()` labels compatibility content as `v2-adapted`; tests verify warnings and phase preservation. | Keep the adapter until native coverage replaces each lesson family. |
| Phase 3: modular player | Complete | The player renders declared V3 modules in `activePhases` order and omits empty phases while retaining the V2 path. | Expand native phase modules and connect phase evidence to repository reads. |
| Phase 4: mastery evidence | Not started | Immediate score can still route to `Mastered`. | Add evidence dimensions and learning-state transitions before changing routing labels. |
| Phase 5: feedback/error intelligence | Partial foundation | Tutor diagnosis and misconception fields exist. | Persist Result -> Diagnosis -> Hint -> Action records. |
| Phase 6: Memory Vault 2.0 | Partial foundation | Retention schedules exist. | Add review modes, adaptive intervals, evidence quality, confidence, and hint usage. |
| Phase 7: three exemplars | In progress | Native V3 exemplars now exist across Foundation Grade 3, Bridge Grade 6, and Scholar Grade 9, including ratios, weather, fractions, cells, and Learning AI. | Run the complete V7 acceptance checklist and connect each proof to persisted mastery/Memory Vault evidence before declaring the migration complete. |
| Phase 8: dashboards | Partial foundation | Student, parent, teacher, school, admin views exist. | Show knowledge, capability, reasoning, retention, transfer, and assistance level. |
| Phase 9: constrained tutor | Partial foundation | Tutor and Tool Gateway exist. | Add V7 hint ladder enforcement and assisted-versus-independent evidence logs. |
| Phase 10: release audit | Not started | Baseline audit exists. | Add migration readiness report and run full verification gates after each phase. |

## Grade 6 Source Ingestion Boundary

IXL Grade 6 pages are staff-only external references for coverage comparison and optional outbound links. They must not be copied into published lessons. Official California standards sources and original Nexus V3 lesson design remain the publishable curriculum basis.

## Release Gate

Do not scale lesson production beyond the MVP/pilot scope until:

- V3 contracts exist.
- V2 adapter passes tests.
- Modular player passes tests.
- Mastery no longer equates one immediate score with durable mastery.
- The six pilots pass the existing artifact quality gate.
- Three native V3 exemplars pass the V7 acceptance checklist.
