# First Codex Task — V7 Ingestion and Repository Audit

Read `AGENTS.md`, `PROJECT_SOURCE_OF_TRUTH.md`, `docs/architecture/README.md`, and `docs/architecture/NEXUS_LEARNING_OS_MIGRATION_PLAN.md` before doing anything else.

This first task is **audit-only**. Do not modify application code, schemas, dependencies, routes, lesson content, tests, or configuration yet.

## Objectives

1. Inspect the repository structure and identify the current framework, package manager, scripts, persistence layer, authentication model, test stack, deployment configuration, and content-loading pipeline.
2. Locate every document, schema, type, validator, component, route, script, seed lesson, test, and prompt that assumes the V6 fixed 16-section lesson contract.
3. Identify every place where a single immediate score is treated as complete mastery.
4. Locate Memory Vault scheduling, feedback logic, AI/chat behavior, student data storage, parent/teacher views, accessibility infrastructure, and role controls.
5. Compare the actual repository with every phase and non-negotiable constraint in the V7 migration plan.
6. Identify contradictions between V7, legacy documents, and implemented behavior.
7. Produce an evidence-based migration report. Do not guess when code evidence is unavailable.

## Required output

Create or update only this report:

`docs/architecture/V7_REPOSITORY_AUDIT.md`

The report must contain:

- Executive summary
- Current architecture and stack
- Working features that must be preserved
- V6 coupling inventory with exact file paths
- Data/schema inventory
- Lesson Player inventory
- Mastery and score-routing inventory
- Memory Vault inventory
- AI tutor/chat inventory
- Persistence, authentication, roles, privacy, accessibility, and safety gaps
- Test and CI inventory
- Contradictory or stale documents
- Migration risk register
- Recommended Phase 0 changes
- Proposed implementation phases mapped to the official migration plan
- Commands that should be used to verify each phase
- Open questions that cannot be answered from the repository

## Boundaries

- Do not delete or overwrite legacy documents.
- Do not rewrite lesson files.
- Do not install dependencies.
- Do not implement V3 contracts.
- Do not claim the product is production-ready.
- Cite exact repository paths and relevant symbols or line ranges throughout the report.

At the end, summarize:

1. what you inspected;
2. what is definitely working;
3. what is legacy-coupled;
4. what is missing;
5. the safest first implementation change.
