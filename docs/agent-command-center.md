# Agent Command Center

## Purpose

The Agent Command Center is the manager view for work that needs human judgment before the app exposes content, generated visuals, AI safety outcomes, or external tool outputs to learners.

It sits on top of the Tool Gateway. The Tool Gateway controls execution; the Command Center controls review and release.

## Review Queue Sources

The queue is derived from live app state:

| Source | Queue rule | Manager decision |
| --- | --- | --- |
| Visual assets | `status: review` | Approve or reject before student-facing use |
| Content drafts | `status: review`, `publicationBlocked`, incomplete lesson body, or missing `truthReviewStatus: approved` | Approve Truth And Fact-Check/content review if gates pass, or return to draft |
| Tool calls | `requiresHumanReview` without `reviewStatus` | Approve or reject the output |
| AI logs | `flagged: true`, low truth score, or external research needed without `reviewStatus` | Mark reviewed after parent/teacher safety or truth-policy review |

Review decisions are stored back into the same records the app already uses, so the queue does not become a disconnected checklist.

## AI Tutor Tool Contract

The tutor is allowed to use tools only through the registered gateway and only for lesson-scoped support.

Core rules:

- Ask the learner to write the exact stuck point before teaching.
- Classify confusion before giving help.
- Give a hint, reteach move, diagram suggestion, or retry prompt.
- Offer explanation modes, including picture/diagram, metaphor, first step, real example, gentle quiz, and first-principles basics.
- Refuse direct answer requests.
- Escalate unsafe language.
- Keep generated visuals behind human review.
- Log interactions for parent/teacher visibility.

The current contract lives in `src/data.js` as `aiTutorToolContract`, and the engine exposes it through `getAiTutorToolContractSummary()`.

## New Managed Agent Tools

- `fun_retention_design`: audits whether a lesson has a curiosity hook, active task, visual model, retrieval loop, student choice, and mastery-tied reward.
- `syllabus_misconception_research`: creates staff-only web research plans for usual syllabi, standards sequence, common hard parts, easier parts, and redesign hypotheses.

The research tool is not student-facing. It can point staff toward approved source targets, but student-facing content still requires human review.

Research outputs now include a source ledger and redesign tasks. Tool call logs preserve the structured payload so the manager can review the claim, source, proposed lesson change, and acceptance criteria before anything reaches students. When approved, a syllabus-research tool review creates a review-stage content draft linked to the source lesson, source tool call, redesign task ids, and research source ids.

Content draft approval now records Truth And Fact-Check approval before publishing. Direct publish attempts remain blocked when lesson body anatomy, evidence moves, visual approval, accessibility/age-fit notes, or truth review are incomplete. Once approval succeeds, the manager action also creates or updates a linked published lesson record; that record becomes available in the learner catalog and lesson player. Returning the draft to review removes that student-facing record.

## Implementation Files

- `src/data.js` defines the tutor contract.
- `src/engine.js` builds `getAgentReviewQueue()`, `getAgentCommandCenter()`, and `resolveAgentReviewItem()`.
- `scripts/serve.mjs` persists review decisions through `POST /api/agent-command-center/review` using the focused `writeAgentReviewDecision()` repository path.
- `src/repository.js` writes affected visual/content/tool/tutor/redesign rows and syncs stale pending `agent_review_items` out of the derived queue after a decision.
- `src/app.js` renders the manager review queue inside the Tools tab.
- `tests/run-tests.mjs` validates queue creation and review decisions.

## Next Production Upgrade

Add immutable audit metadata around review decisions:

- Persist a separate append-only `audit_events` row for every approve, reject, or reviewed action.
- Store actor role, learner/content scope, decision, reason, timestamp, and affected entity ids.
- Add manager notes and request-revision decisions, not only approve/reject/reviewed.
- Keep students blocked from all command-center decision routes.
