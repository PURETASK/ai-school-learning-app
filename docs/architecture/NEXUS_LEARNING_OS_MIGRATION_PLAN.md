# Nexus Learning OS — V7 Migration Plan

**Status:** Implementation companion to `PROJECT_SOURCE_OF_TRUTH.md`  
**Effective date:** 2026-07-12  
**Migration strategy:** Incremental, testable, backward-compatible

---

## 1. Migration Objective

Replace the rigid universal 16-section lesson contract with the Nexus Learning OS while preserving working V6 content, routes, dashboards, seed lessons, and thinking-system scaffolds.

The migration must improve instructional architecture without creating a destructive rewrite.

---

## 2. Non-Negotiable Constraints

1. Preserve the three academies and canonical slugs.
2. Preserve the current Grade 3, Grade 6, and Grade 9 MVP focus.
3. Preserve the 16 existing seed lesson files.
4. Preserve current working Lesson Player, Memory Vault, dashboard, and thinking-system routes until replacements pass tests.
5. Introduce V3 alongside V2 before deprecating V2.
6. Do not mechanically relabel legacy fields and call the lesson redesigned.
7. Do not remove the existing score bands until new routing and reporting are operational.
8. Do not enable unrestricted AI tutoring.
9. Do not claim production readiness without persistence, authentication, role controls, accessibility testing, and parent/teacher workflows.

---

## 3. Recommended Version-Control Procedure

Before code changes:

```bash
git checkout -b feat/nexus-learning-os-v7
git tag archive/v6-before-nexus-learning-os
```

Create a backup copy:

```text
docs/archive/v6/PROJECT_SOURCE_OF_TRUTH_V6.md
```

Install the new files:

```text
PROJECT_SOURCE_OF_TRUTH.md
NEXUS_LEARNING_OS_MIGRATION_PLAN.md
```

---

## 4. Phase 0 — Documentation Lock

### Update

- `PROJECT_SOURCE_OF_TRUTH.md`
- `AGENTS.md`
- `README.md`
- `MVP_VERTICAL_SLICE_SPEC.md`
- `LESSON_VALIDATION_RULES.md`
- `CODEX_FIRST_BUILD_PROMPT.md`
- thinking-system index and QA documents

### Remove or revise statements that require

- exactly 16 sections in every lesson;
- immediate 80–89 score equals complete mastery;
- every lesson contains every reasoning task;
- static review scheduling only.

### Acceptance criteria

- No canonical document contradicts the Nexus Learning Cycle.
- Deprecated V6 language is explicitly marked as legacy.
- Codex read order includes the migration plan.

---

## 5. Phase 1 — Contracts and Schemas

### Create

```text
schemas/lesson-v3/lesson.schema.json
schemas/lesson-v3/unit.schema.json
schemas/lesson-v3/mastery-evidence.schema.json
schemas/lesson-v3/memory-vault.schema.json
schemas/lesson-v3/error-intelligence.schema.json
src/types/nexusLesson.ts
src/types/learningState.ts
src/types/masteryEvidence.ts
src/types/errorIntelligence.ts
src/types/memoryVaultV2.ts
```

### Add schema versioning

```ts
type SupportedLesson = LegacyLessonV2 | NexusLessonV3;
```

Each lesson file must declare:

```json
{
  "schemaVersion": "2"
}
```

or:

```json
{
  "schemaVersion": "3"
}
```

### Acceptance criteria

- V2 lessons still validate.
- V3 fixtures validate.
- Invalid lesson-family, phase, mastery-proof, or learning-state values fail validation.
- IDs and prerequisite references are validated.

---

## 6. Phase 2 — Compatibility Adapter

### Create

```text
src/lib/content/adaptLegacyLessonV2.ts
src/lib/content/loadSupportedLesson.ts
scripts/report-v2-migration-readiness.ts
```

### Adapter behavior

Map legacy sections into V3-compatible presentation modules without changing the source file.

The adapter must attach:

- `sourceSchemaVersion: "2"`;
- `migrationStatus: "legacy_adapted"`;
- a warning that lesson family and mastery proofs are inferred;
- no false claim that the lesson has been pedagogically redesigned.

### Acceptance criteria

- All 16 legacy lessons load.
- No existing content is lost.
- Existing quiz answers and review items remain intact.
- Adapter output is deterministic.

---

## 7. Phase 3 — Modular Lesson Player

### Replace the rendering assumption

From:

```text
Render all 16 sections in fixed order.
```

To:

```text
Render the lesson’s declared family and active phase modules in authored order.
```

### Create or refactor

```text
src/features/lessons/components/LessonPhaseRenderer.tsx
src/features/lessons/components/LessonFamilyHeader.tsx
src/features/lessons/components/phases/OrientModule.tsx
src/features/lessons/components/phases/ModelModule.tsx
src/features/lessons/components/phases/DeconstructModule.tsx
src/features/lessons/components/phases/PracticeModule.tsx
src/features/lessons/components/phases/ReasonModule.tsx
src/features/lessons/components/phases/ProveModule.tsx
src/features/lessons/components/phases/RememberModule.tsx
src/features/lessons/components/phases/TransferModule.tsx
src/features/lessons/components/phases/AdaptModule.tsx
```

### UX rules

- Do not show empty phases.
- Do not turn every phase into a separate page by default.
- Show the learning goal and success criteria persistently but unobtrusively.
- Distinguish teaching, practice, assessment, and reflection modes.
- Make assistance state visible during assessments.

### Acceptance criteria

- Legacy lessons render through the adapter.
- Native V3 lessons render without legacy placeholders.
- Keyboard navigation and focus order work.
- Screen readers receive phase headings and task instructions.

---

## 8. Phase 4 — Learning-State and Mastery Engine

### Create

```text
src/features/learning-state/
src/features/mastery-evidence/
```

### Required records

- current state per student and skill;
- evidence event history;
- mastery-proof status;
- independent versus assisted evidence;
- delayed-evidence timestamps;
- state transition reason;
- confidence and hint usage where collected.

### Routing priorities

1. Detect prerequisite gap.
2. Detect misconception or error type.
3. Determine current learning state.
4. Select the smallest effective next action.
5. Schedule delayed evidence.

### Acceptance criteria

- A high immediate score does not automatically set `durable` or `transferable`.
- A delayed failure can move `secure` back to `developing` or `accurate`.
- Assisted performance is not recorded as independent mastery.
- State changes are explainable in parent/teacher views.

---

## 9. Phase 5 — Feedback and Error Intelligence

### Create or refactor

```text
src/features/feedback/diagnosticFeedbackEngine.ts
src/features/error-intelligence/
```

### Implement

```text
Result → Diagnosis → Hint → Action
```

### Initial diagnosis codes

- prerequisite_gap
- knowledge_gap
- vocabulary_confusion
- misconception
- strategy_selection
- procedure_error
- calculation_error
- evidence_weakness
- interpretation_error
- unsupported_assumption
- communication_weakness
- attention_slip
- confidence_mismatch
- retention_failure
- transfer_failure

### Acceptance criteria

- Feedback identifies a next action.
- Repeated diagnosis changes the instructional route.
- Mistake Journal entries persist.
- Parent/teacher summaries avoid stigmatizing labels.

---

## 10. Phase 6 — Memory Vault 2.0

### Preserve

- Day 0
- Day 1
- Day 3
- Day 7
- Day 14
- Day 30

as default stages.

### Add

- adaptive intervals;
- response latency where valid;
- confidence;
- hint usage;
- diagnosis code;
- learning state;
- mastery-proof status;
- review mode;
- transfer evidence.

### Review modes

- recall;
- discriminate;
- explain;
- correct;
- connect;
- apply;
- mix.

### Acceptance criteria

- Incorrect responses trigger repair and earlier review.
- Correct but hinted responses do not receive the same interval as independent responses.
- Durable items move toward mixed and application review.
- Review history survives refresh and sign-in changes.

---

## 11. Phase 7 — Redesign Three Exemplar Lessons

Do not migrate all lessons first.

Manually redesign one lesson per academy:

1. Foundation Academy Grade 3 lesson
2. Bridge Academy Grade 6 lesson
3. Scholar Academy Grade 9 lesson

Each exemplar must demonstrate:

- intentional lesson family;
- active phases only;
- academy-appropriate first principles;
- target learning states;
- required mastery proofs;
- diagnosis-aware feedback;
- Memory Vault plan;
- transfer placement;
- accessibility notes;
- parent/teacher visibility.

### Recommended exemplar mix

- Foundation: Concept Launch + Skill Workshop
- Bridge: Reasoning Lab or Inquiry
- Scholar: Seminar, Reasoning Lab, or Transfer Challenge

### Acceptance criteria

- Curriculum review confirms the redesign is genuinely topic-specific.
- Student flow is shorter and clearer than the legacy 16-screen flow.
- The lesson produces structured evidence for the new engines.

---

## 12. Phase 8 — Dashboards and Reporting

### Student dashboard

Show:

- current course progress;
- today’s learning task;
- due Memory Vault reviews;
- current skill state using understandable language;
- recent growth;
- next recommended action;
- challenge availability.

Do not expose an intimidating wall of analytics.

### Parent/teacher dashboard

Show:

- current skill state;
- evidence type;
- independent versus assisted work;
- recurring error patterns;
- due review;
- reteach actions;
- transfer evidence;
- content version;
- escalation notices.

### Acceptance criteria

- Reports explain why a recommendation was made.
- Reports do not equate completion with learning.
- Reports distinguish immediate performance from durable evidence.

---

## 13. Phase 9 — AI Tutor Foundation

Do not build the full conversational tutor first.

Implement constrained instructional actions:

- diagnostic prompt;
- approved explanation retrieval;
- hint ladder;
- request-another-example;
- explain-your-reasoning prompt;
- misconception comparison;
- escalation.

### Acceptance criteria

- Assessment mode blocks prohibited answer assistance.
- Hint level is logged.
- Tutor responses are grounded in approved content.
- The learner can exit or request human help.
- No public or unrestricted child-to-AI social channel is created.

---

## 14. Compliance and Audit Updates

Update compliance checks from:

```text
lesson-player: 16 official sections
```

To checks such as:

- valid schema version;
- valid lesson family;
- valid active phases;
- required objective and success criteria;
- proof tasks present;
- valid mastery-proof policy;
- adaptive path exists;
- accessibility notes present;
- Memory Vault plan where required;
- no contradictory deprecated flags.

Keep a separate legacy check confirming V2 compatibility until V2 retirement.

---

## 15. Required Automated Tests

### Content tests

- all IDs unique;
- required fields present;
- lesson phases compatible with family;
- standards tags formatted;
- answer keys valid;
- prerequisites resolvable;
- mastery proofs valid;
- review items valid;
- no orphan adaptive paths.

### Engine tests

- state-transition rules;
- assisted versus independent evidence;
- delayed mastery behavior;
- prerequisite routing;
- diagnosis-specific reteach;
- interval adaptation;
- hint logging;
- regression handling.

### UI tests

- V2 lesson render;
- V3 lesson render;
- keyboard navigation;
- screen-reader labels;
- text scaling;
- reduced motion;
- role-based dashboard access.

### Safety tests

- prohibited child-facing AI requests;
- cross-account access denial;
- public profile absence;
- data export and deletion workflow;
- assessment-help restrictions.

---

## 16. Migration Status Table

Create:

```text
reports/V7_LESSON_MIGRATION_STATUS.csv
```

Recommended columns:

```text
lesson_id,academy,grade,subject,current_schema,target_family,migration_status,
content_review,pedagogy_review,accessibility_review,technical_validation,
mastery_proofs_defined,memory_plan_defined,adaptive_paths_defined,notes
```

Canonical migration statuses:

- legacy_unreviewed
- legacy_adapted
- redesign_in_progress
- v3_draft
- v3_reviewed
- pilot_ready
- approved

---

## 17. Immediate Recommended Sprint

The first V7 sprint should deliver only:

1. Install the new source-of-truth and migration plan.
2. Update `AGENTS.md` and compliance language.
3. Define V3 TypeScript contracts and JSON schema.
4. Build the V2 compatibility adapter.
5. Build the modular phase renderer.
6. Redesign one Foundation, one Bridge, and one Scholar exemplar.
7. Add migration-status reporting.
8. Preserve every existing route and seed lesson.

Do not begin full AI tutoring or all-grade curriculum expansion during this sprint.

---

## 18. Definition of Done

The migration is not done because the UI looks different.

It is done when:

- instructional intent is represented in the data model;
- lessons no longer require irrelevant sections;
- the system diagnoses why a learner is struggling;
- current, retained, and transfer performance are distinguishable;
- review adapts to evidence;
- AI help is constrained and logged;
- legacy content remains operational;
- exemplars demonstrate materially better learning design;
- validation, accessibility, safety, and regression tests pass.

