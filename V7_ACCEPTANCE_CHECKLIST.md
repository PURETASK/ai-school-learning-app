# Nexus Learning OS V7 — Acceptance Checklist

## Documentation lock

- [ ] Root `PROJECT_SOURCE_OF_TRUTH.md` is V7 and marked canonical.
- [ ] Root `AGENTS.md` defines authority, read order, workflow, and safeguards.
- [ ] V6 source documents are archived and marked legacy.
- [ ] No current document still claims every lesson must render exactly 16 fixed sections.
- [ ] The repository audit identifies all V6 coupling before code migration.

## Compatibility

- [ ] All 16 existing V2 seed lessons still load and render.
- [ ] Existing academy slugs, MVP grades, course routes, dashboards, and Memory Vault routes remain operational.
- [ ] V2 and V3 schemas can coexist.
- [ ] The V2 adapter labels content as legacy-adapted and does not falsely claim redesign.

## Lesson architecture

- [ ] V3 lessons declare a valid lesson family.
- [ ] V3 lessons declare only the active phases they use.
- [ ] Empty phases are not rendered.
- [ ] Unit records demonstrate the full Nexus Learning Cycle over time.
- [ ] Grade-band first-principles routines are represented correctly.

## Mastery and adaptation

- [ ] Recall, explain, perform, retain, and transfer evidence can be stored separately.
- [ ] Assisted and independent performance are distinguishable.
- [ ] Immediate high scores do not automatically create durable or transferable status.
- [ ] Delayed failure can revise a learning state.
- [ ] State transitions include a reason and evidence reference.

## Feedback and error intelligence

- [ ] Feedback follows Result → Diagnosis → Hint → Action.
- [ ] Error categories are stored and reviewable.
- [ ] Repeated errors can trigger a different instructional response.
- [ ] Prerequisite repair is distinct from ordinary reteaching.

## Memory Vault

- [ ] Reviews support recall, recognition/discrimination, explanation, correction, connection, application, and mixed selection.
- [ ] Review timing can adapt to accuracy, confidence, hint use, and error history.
- [ ] Review history is persisted.
- [ ] Delayed retention evidence is visible to authorized adults.

## AI tutor

- [ ] Approved hint ladder is enforced.
- [ ] Assessment mode restricts help.
- [ ] AI cannot automatically complete assessed work.
- [ ] AI uncertainty and source limitations are surfaced.
- [ ] Child-safety and human-escalation boundaries are implemented.

## Engineering quality

- [ ] Typecheck passes.
- [ ] Lint passes.
- [ ] Unit tests pass.
- [ ] Integration tests pass.
- [ ] Production build passes.
- [ ] Accessibility checks cover keyboard navigation, focus order, headings, labels, and screen-reader semantics.
- [ ] Migrations are deterministic and tested.
- [ ] Documentation matches implemented behavior.
- [ ] Remaining limitations are stated accurately.
