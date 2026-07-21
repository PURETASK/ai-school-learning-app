# Nexus Learning OS V7 Repository Audit

**Audit date:** 2026-07-12  
**Audit mode:** Read-only migration audit  
**Repository:** `C:\Users\onlyw\Documents\ai school`  
**Decision status:** V7 is recommended as the target learning architecture. It is not yet installed in this repository, and the product is not production-ready.

**Historical baseline note (2026-07-16):** This read-only audit captures the pre-migration baseline. It is not the live status tracker. Since this audit was written, V3 contracts, the V2 adapter, the modular phase player, and native exemplars have been added. See `docs/migration-v7/MIGRATION_STATUS.md` for current status.

## 1. Scope And Source Inputs

This audit was performed before any V7 application migration. It inspected the current repository, the supplied V7 handoff materials, and the supplied curriculum workbook/document.

Reviewed inputs:

- `C:\Users\onlyw\Downloads\CODEX_V7_INGESTION_PROMPT.md`
- `C:\Users\onlyw\Downloads\NEXUS_LEARNING_OS_MIGRATION_PLAN.md`
- `C:\Users\onlyw\Downloads\NEXUS_LEARNING_OS_MIGRATION_PLAN (1).md`
- `C:\Users\onlyw\Downloads\PROJECT_SOURCE_OF_TRUTH(1).md`
- `C:\Users\onlyw\Downloads\PROJECT_SOURCE_OF_TRUTH(1) (1).md`
- `C:\Users\onlyw\Downloads\V7_ACCEPTANCE_CHECKLIST.md`
- `C:\Users\onlyw\Downloads\V7_ACCEPTANCE_CHECKLIST (1).md`
- `C:\Users\onlyw\Downloads\Nexus Learning OS.docx`
- `C:\Users\onlyw\Downloads\K12_Three_Lessons_Per_Topic_Curriculum_Map.xlsx`
- Both supplied pasted Nexus architecture texts.
- The two supplied V7 handoff ZIP packages, including their `AGENTS.md`, install instructions, source-of-truth, migration plan, and acceptance checklist.

The workbook is treated as a **reference curriculum planning artifact**, not as canonical product logic. It reports 13 grade tabs (K-12), 12 subjects, 624 topics, and 1,872 three-lesson outlines. Its rows are useful for planning and comparison, but they do not replace authored lesson contracts, standards review, learning evidence design, or publication gates.

The supplied ingestion prompt explicitly required audit-only work. This report therefore does not install the V7 documents, modify application behavior, add dependencies, rewrite lessons, or claim production readiness.

## 2. Executive Decision

### Recommendation

Adopt Nexus Learning OS V7 as the **instructional and content architecture**, while preserving the current app shell, routes, account/security work, repository work, visual pipeline, tutor safety boundaries, six pilot lessons, and existing test harness during migration.

Do not stay with the current process unchanged. The current process is strong at product scaffolding and operational gates, but it still centers the lesson around a universal section list and an immediate quiz score. That is the exact risk the V7 materials identify.

Do not replace the working system in one rewrite. Introduce V3 beside the current V2-shaped data and renderer, prove the adapter and player against the six pilots, then migrate the Grade 3, Grade 6, and Grade 9 exemplars before expanding content.

### Why V7 is better for the stated product goal

V7 aligns directly with the product goal of building a school-like learning experience that develops independent learners rather than a content library:

- It measures knowledge, capability, reasoning, retention, and transfer.
- It separates immediate performance from durable mastery.
- It requires multiple forms of mastery evidence: recall, explanation, performance, retention, and transfer.
- It makes diagnosis and the next action part of feedback instead of simply revealing an answer.
- It allows different lesson families for a concept launch, skill workshop, reasoning lab, seminar, mastery check, transfer challenge, or project studio.
- It keeps AI tutoring constrained and evidence-producing rather than answer-producing.
- It makes units, prerequisites, memory scheduling, misconceptions, and transfer first-class design objects.

The current process should remain the **delivery and governance layer**. V7 should become the **learning/content layer**.

## 3. Current Repository Inventory

### Stack and commands

- Browser app: vanilla JavaScript/HTML/CSS modules; no framework dependency is declared in `package.json`.
- Server: Node ESM HTTP server in `scripts/serve.mjs`.
- State engine: `src/engine.js` and `src/data.js`.
- Repository: JSON fallback plus Postgres/Supabase repository path in `src/repository.js`.
- Schema/migrations: `src/schema.js`, `src/migrations.js`, and generated SQL under `db/migrations`.
- Auth/security: `src/auth.js`, `src/productionAuth.js`, `src/accessControl.js`, and server session checks.
- AI/tutor/tool gateway: `src/toolGateway.js`, `src/openaiImageService.js`, `src/visualAgent.js`, and tutor functions in `src/engine.js`.
- Visual assets: `src/visualAssetStorageService.js` and visual generation scripts/routes.
- Tests: `tests/run-tests.mjs`.

Current package scripts include:

```text
npm test
npm start
npm run db:apply
npm run db:seed
npm run db:verify
npm run export:migration
npm run export:seed
npm run storage:setup
npm run visual:generate-one
npm run supabase:check
```

### Current product surface

`src/viewContract.js` and the tests define a 14-view product surface, four role home surfaces (`student`, `parent`, `teacher`, `school`), and role-specific access rules. The current system already contains meaningful workflows for curriculum, lesson delivery, parent/teacher/school views, tutor, experiments, visuals, content administration, agent reviews, setup, and rewards.

### Current pilots

`src/data.js` exposes six pilot lessons:

1. `g3-fractions-number-line` — math
2. `g3-ela-main-idea-evidence` — ELA
3. `g3-science-mini-ecosystem` — science
4. `g3-social-regions-community-map` — social studies
5. `g6-earth-systems-weather` — science
6. `g9-biology-cells` — science

The pilots cover Grades 3, 6, and 9, matching the V7 MVP preservation requirement. The current tests require objectives, sections, quizzes, visual prompts, fun tasks, retention checks, rewards, student-facing supports, and A-level content grading for the six pilots.

## 4. Working Features To Preserve

These are valuable foundations and should not be discarded during the V7 migration:

1. Three academy identities and canonical grade-band intent in `src/data.js` and `AGENTS.md`.
2. Grade 3, Grade 6, and Grade 9 pilot coverage.
3. 14-view navigation/access contract in `src/viewContract.js`.
4. Student, parent, teacher, school, and admin role model.
5. Server-side session and role checks in `scripts/serve.mjs` and `src/accessControl.js`.
6. Parent-first child-account flow and account-security data model scaffolding.
7. Curriculum/lesson/unit/course data structures and normalized schema model.
8. Student lesson player, quiz submission, scratchpad, confusion capture, tutor handoff, and progress surfaces.
9. Teacher class session, roster, group mission, group artifact, intervention, and monitor workflows.
10. Parent progress, reward approval, and child scope controls.
11. Learning evidence, quiz attempts, mastery records, retention schedules, experiment runs, and reward settings.
12. Tutor diagnosis, explanation modes, feedback, truth-policy scoring, safety checks, and tool gateway boundaries.
13. Automatic lesson, prompt, and generated-visual grading with revision briefs.
14. Visual opportunity audit, OpenAI image route, storage promotion, review queue, and approval preflight.
15. Content draft, visual review, agent review, and publication gate scaffolding.
16. Supabase/Postgres migration generation, normalized projection, repository reads, and runtime readiness checks.
17. Existing tests for pilots, classroom flows, auth/security, repository behavior, visual review, tutor behavior, and migration structure.

The V7 migration must wrap these features in new contracts rather than remove them.

## 5. V6 Couplings And Fixed-Lesson Assumptions

The repository does not currently contain a literal `16` count in the lesson renderer. It does, however, contain the same underlying coupling: a universal list of required lesson sections that every course/unit/lesson is expected to satisfy. This distinction matters because mechanically changing the count would not constitute the V7 redesign.

### Direct coupling evidence

- `src/data.js:1146-1159` defines `lessonTemplate` as a universal ordered list of 12 entries: objective, warm-up, teach, guided practice, interactive activity, independent practice, mini quiz, mastery score, reteach, challenge, adult report, and reward.
- `src/data.js:1169-1183` places `requiredLessonSections: lessonTemplate` on every generated unit. This makes the section contract part of curriculum generation rather than an optional lesson-family choice.
- `src/app.js:3285-3288` renders the universal “Lesson contract” list for the learner/adult lesson view.
- `src/engine.js:4030-4039` normalizes every lesson into the same seven teaching keys: warm-up, direct instruction, guided practice, interactive activity, independent practice, reteach path, and challenge path.
- `src/engine.js:4350-4360` maps authored lesson fields back into the same legacy `sections` object when publishing a content draft.
- `src/engine.js:4681` and `src/engine.js:4956` continue to normalize imported/research-created material into `lessonSections` rather than a typed V3 module list.
- `src/artifactGrader.js:188-222` grades presence of the legacy section names and their aliases. This is useful as a compatibility check but is not a V3 lesson-family validator.
- `src/app.js:2768-2878` and `src/app.js:3112-3265` render fixed-purpose content from `lesson.sections.*` fields. The player is not yet phase-driven or authored-order-driven.

### Interpretation

The existing contract is a useful V2 compatibility surface. It must not be relabeled as V3. V7 should add a typed lesson family, active phase modules, required mastery proofs, and explicit evidence requirements while retaining a V2 adapter for existing lessons.

## 6. Immediate-Score And Mastery Routing Inventory

V7 specifically requires that immediate high scores do not automatically create durable or transferable status. Current code still has immediate-score completion paths:

- `src/engine.js:2358-2365` computes a single quiz percentage and sets `passed` when it meets `lesson.masteryThreshold`.
- `src/engine.js:2369-2383` writes `status: "Mastered"` when that one quiz passes and records the passing score as the evidence.
- `src/engine.js:1603-1609` chooses `Challenge` when `mastery.score >= lesson.masteryThreshold`; otherwise it chooses `Reteach` or `Start`.
- `src/engine.js:1666-1673` uses the threshold to assign classroom learner status.
- `src/engine.js:3238-3270` awards XP/reward reasoning from the best quiz event and whether it passed.
- `src/app.js:2297-2304`, `src/app.js:2940-2951`, and `src/app.js:3994-4002` present a passed quiz as “mastered” or “Mastery evidence saved.”
- `src/app.js:4859-4926` exposes immediate score and delayed recall metrics in experiments, but those metrics do not yet control the core mastery state machine.

The current retention schedules and delayed checks are valuable, but they are not yet authoritative for mastery routing. The migration must introduce separate evidence dimensions and learning states such as `Acquiring`, `Developing`, `Accurate`, `Secure`, `Durable`, and `Transferable`. A 90% immediate score can remain a transitional score band, but cannot by itself grant `Durable` or `Transferable`.

## 7. Current Architecture Versus V7 Phases

| V7 phase | Current evidence | Status | Required migration outcome |
|---|---|---|---|
| Phase 0: Documentation lock | V7 source-of-truth, migration plan, checklist, and ingestion prompt exist only in Downloads; repo has older K-12 docs and `AGENTS.md`. | Not started | Install canonical docs after this audit, mark superseded V6 docs, resolve contradictions, and record migration status. |
| Phase 1: V3 contracts/schemas/types | `src/schema.js` is primarily a relational persistence model; `src/data.js` contains the V2 lesson template; no `schemas/lesson-v3`, typed mastery-evidence, memory-vault, or error-intelligence contracts were found. | Not started | Add V3 contracts beside V2 for lessons, units, mastery evidence, Memory Vault, and error intelligence. |
| Phase 2: V2 compatibility adapter | `normalizeTeachingSections` and publishing normalization exist, but they return legacy fields and do not identify inferred family/phases/proofs or warn that content is legacy-adapted. | Partial foundation | Build an explicit adapter that preserves source data, marks `legacy-adapted`, and reports inferred fields. |
| Phase 3: Modular lesson player | The player renders legacy section fields and fixed support panels; no V3 phase renderer or authored active-phase modules exist. | Not started | Add phase modules and render only declared phases in authored order, with empty phases omitted. |
| Phase 4: Learning-state/mastery engine | Quiz score, threshold, mastery status, retention schedules, XP, and progress exist. | Partial, incompatible routing | Add multiple evidence types and state transitions; preserve old score bands until the new router is operational. |
| Phase 5: Feedback/error intelligence | Tutor diagnosis, misconception fields, scratchpad review, and feedback exist. | Partial | Normalize Result -> Diagnosis -> Hint -> Action, persist error categories, and route the next task from diagnosis. |
| Phase 6: Memory Vault 2.0 | Retention schedules and experiment metrics exist. | Partial | Add review modes, adaptive intervals, review evidence, memory strength, and Day 0/1/3/7/14/30 defaults. |
| Phase 7: Three exemplars | Six pilots exist across Grades 3, 6, and 9; the tests exercise rich pilot content. | Existing baseline | Redesign one Foundation, one Bridge, and one Scholar exemplar using native V3 modules, not field relabeling. |
| Phase 8: Dashboards/reporting | Student, parent, teacher, school, experiments, rewards, and admin surfaces exist. | Partial | Add knowledge/capability/reasoning/retention/transfer views and explain assisted versus independent evidence. |
| Phase 9: Constrained AI tutor | Tutor and Tool Gateway exist with safety/review intent. | Partial | Enforce hint ladder, log assistance level, distinguish independent evidence, and keep external tools staff-controlled. |
| Phase 10: Compliance/audit | Auth, repository, visual review, agent review, accessibility/readiness checks, and tests exist. | Partial | Complete canonical docs, migration CSV/report, accessibility evidence, parent/teacher workflow proof, and production gates. |

## 8. Important Process Conflicts

The current process and V7 materials are complementary, but these conflicts must be resolved explicitly:

1. **Universal template versus lesson families.** Current generation assumes every unit has the same required section list. V7 requires a lesson family and only the phases needed for that purpose.
2. **Single quiz pass versus multiple proofs.** Current quiz completion writes “Mastered.” V7 requires delayed recall, explanation, performance, and transfer evidence where appropriate.
3. **Full-library planning versus controlled scale.** The workbook and `docs/lesson-library-scale.md` plan thousands of blueprints. V7 says do not expand until the new contracts, adapter, renderer, and evidence routing work on exemplars.
4. **Content QA versus learning architecture QA.** The current A-F artifact graders are useful for content safety, clarity, visuals, and completeness. They do not yet grade V7 lesson family, active phases, required proofs, learning state, or unit-level durable-learning plans.
5. **JSON fallback versus production claims.** `src/repository.js:211-339` still supports `data/app-state.json`; `src/repository.js:1035-1205` provides Postgres mode. Runtime checks correctly block production when Postgres is not selected, but local fallback must not be described as production persistence.
6. **Partial batch gate worktree change.** `src/schema.js` and `src/repository.js` currently contain an unverified `content_batch_reviews` table/read-path addition. No complete engine write path, API route, UI, migration refresh, or test contract was found for it. It must be verified or reverted as a separate change after the V7 audit decision; it is not evidence that the batch gate is complete.

## 9. Recommended Phase 0 Changes

These are documentation and governance changes only. They should happen before V3 code work:

1. Copy the supplied canonical V7 files into the repository without deleting the older V6/build documents.
2. Add a clear legacy header to documents that still describe the universal lesson contract or immediate score as mastery.
3. Add `docs/architecture/V7_REPOSITORY_AUDIT.md` as this evidence record.
4. Add a migration-status CSV/Markdown table for every affected contract, route, renderer, seed lesson, test, and document.
5. Record that the workbook is a curriculum reference and not the canonical lesson schema.
6. Record the preserved MVP scope: all three academies, Grades 3/6/9 exemplars, and the 16 legacy seed lesson files referenced by the V7 handoff. The current application data exposes six pilot records; the exact legacy seed-file inventory must be confirmed during Phase 0 installation rather than guessed.
7. Define the V2/V3 coexistence rule: no deletion of V2 routes or lesson fields until the adapter, V3 player, evidence router, and tests pass.
8. Define the release gate: no full K-12 content expansion until the three exemplars and six pilot compatibility path pass the V7 acceptance checklist and the existing artifact-quality gate.

## 10. Proposed Implementation Sequence

The following sequence maps the official V7 plan to the current project without losing the existing product work:

### Phase 1: V3 contracts

Create typed, versioned contracts for:

- `LessonV3` and `UnitV3`.
- Lesson families and active phases.
- Required mastery proofs.
- Learning-state transitions.
- Error intelligence records.
- Memory Vault review items and evidence.

Add fixtures for a Grade 3 concept lesson, Grade 6 reasoning/investigation lesson, and Grade 9 inquiry lesson. Validate both valid and invalid examples.

### Phase 2: V2 adapter

Adapt current `pilotLessons` and imported drafts without mutating their source. The adapter must:

- preserve legacy fields;
- mark `schemaVersion: "v2-adapted"`;
- infer a lesson family only with an explicit warning;
- infer phase modules from existing sections;
- identify missing proofs and evidence;
- never claim that adapted content is a native V3 lesson.

### Phase 3: modular player

Add a renderer that accepts V3 modules and uses the existing player shell, tutor handoff, visual supports, quiz controls, and role guards. Render only active phases. Keep the V2 player available behind the adapter until coverage is complete.

### Phase 4: evidence and mastery routing

Implement evidence records for recall, explain, perform, retain, and transfer. Keep `score` as one signal. Replace direct `score >= threshold -> Mastered` routing with explicit state transitions and assisted/independent flags.

### Phase 5: feedback and error intelligence

Normalize every failed or uncertain attempt into `Result -> Diagnosis -> Hint -> Action`. Persist the misconception category, evidence, next action, and whether the student improved after the hint.

### Phase 6: Memory Vault 2.0

Use current retention schedules as the compatibility base, then add review mode, scheduled interval, evidence quality, confidence, and independent retrieval. Start with Day 0/1/3/7/14/30 defaults and adapt from evidence.

### Phase 7: three native exemplars and six-pilot gate

Build native V3 exemplars for Foundation Grade 3, Bridge Grade 6, and Scholar Grade 9. Run the six current pilots through the adapter and quality gate. Do not expand the curriculum workbook into student-facing production lessons until the gate passes.

### Phase 8: dashboards

Add separate reporting for immediate performance, secure/current-context performance, durable recall, transfer, reasoning, and assistance level. Parent and teacher views should show the next instructional action, not only a percentage.

### Phase 9: constrained tutor

Preserve current Tool Gateway role checks. Add V7 hint ladder and assisted-versus-independent logging. Student sessions must not receive unrestricted web search, raw source retrieval, or cost-bearing generation tools.

### Phase 10: compliance and release

Run accessibility, privacy, auth, parent/teacher workflow, database, migration, visual review, and audit checks. Publish a migration status report. Only then begin Bridge Academy Batch 1 and larger curriculum production.

## 11. Verification Commands By Phase

These commands are the minimum evidence set. They are not proof of production readiness by themselves.

```powershell
# Baseline and current regression suite
npm test

# Syntax checks for the current Node modules
node --check scripts/serve.mjs
node --check src/engine.js
node --check src/repository.js
node --check src/schema.js

# V3 contract and adapter phases
npm test
node scripts/report-v2-migration-readiness.mjs

# Modular player and accessibility checks
npm test
# Run the local server and verify critical role/player routes with HTTP smoke tests.
npm start

# Persistence and migration phases
npm run export:migration
npm run export:seed
npm run supabase:check
npm run db:apply
npm run db:seed
npm run db:verify

# Visual and content release gates
npm run visual:generate-one
npm test
```

The `report-v2-migration-readiness` command does not exist in the current repository and is listed as a required future verification command from the official V7 plan. It must be added during the appropriate implementation phase, not invented as a passing result now.

## 12. Audit Findings And Decision

### Keep

Keep the existing app shell, academy identity, role model, server routes, tutor safety boundary, visual review pipeline, A-F artifact graders, six pilot records, classroom workflows, repository schema, and tests. They are valuable product and operational foundations.

### Change

Change the learning/content contract, mastery state machine, lesson player composition, feedback record, Memory Vault model, and dashboard interpretation. These are the areas where the current process does not yet meet the Nexus goal.

### Do not do yet

- Do not generate the full K-12 lesson library.
- Do not mechanically rename legacy fields into V3 fields.
- Do not remove V2 lesson routes or score bands.
- Do not enable unrestricted AI tutoring.
- Do not claim that the current JSON fallback is production persistence.
- Do not treat the workbook's 1,872 outlines as authored, reviewed, publishable lessons.

### Immediate next action

Complete Phase 0 documentation lock and the migration-status inventory. After that, implement Phase 1 V3 contracts and Phase 2 adapter before continuing the batch-quality gate or Bridge Academy Batch 1 as a scale activity. The batch gate remains important, but it should grade the correct V3 evidence contract rather than only the current legacy section presence contract.

## 13. Audit Limitations

- The supplied documents describe 16 legacy seed lesson files, while the current `src/data.js` exposes six pilot lesson records. The exact on-disk 16-file inventory must be confirmed after the canonical handoff is installed; this audit does not infer missing files.
- The repository is entirely untracked in the current working tree, so historical Git attribution and prior committed state could not be used to distinguish older user files from recent edits.
- The Postgres repository path is implemented in code, but this audit did not reapply migrations, reseed the database, or claim live database readiness.
- No browser visual verification was claimed. This report is based on local source inspection, document extraction, workbook inspection, and code/test inventory.

## 14. Verification Snapshot

- `node --check scripts/serve.mjs` — passed.
- `node --check src/engine.js` — passed.
- `node --check src/repository.js` — passed.
- `node --check src/schema.js` — passed.
- `npm test` — currently fails at `tests/run-tests.mjs:557` because `getProductionDataModelReadiness(createInitialState())` reports `content_batch_reviews` as required but empty. This is consistent with the unverified partial batch-gate change described above; it was not repaired during this audit-only task.
