# MVP Backlog and Task Breakdown

## Status And Scope

This backlog supports the active first-sellable-product contract. It does not replace the official Grade 3/6/9 learning-engine MVP in `PROJECT_SOURCE_OF_TRUTH.md`.

Commercial implementation must follow `docs/BRIDGE_GRADE_6_MATH_INTERVENTION_PRODUCT_CONTRACT.md`. The former Next.js scaffold backlog is retired because it no longer describes the current repository.

## Ordered Pilot Backlog

| ID | Task | Completion evidence | Depends on |
|---|---|---|---|
| PILOT-001 | Lock product contract and reconcile supporting documents. | Approved contract with precedence, scope, metrics, gates, and deferrals. | Source of truth |
| PILOT-002 | Repair the Supabase production baseline. | Migrations, seeds, RLS checks, and strict readiness audit pass. | PILOT-001 |
| PILOT-003 | Prove production identity and tenancy. | Verification, reset, refresh, revocation, trusted claims, and isolation tests pass. | PILOT-002 |
| PILOT-004 | Finish repository migration. | Required pilot workflows use focused database repositories and survive readback; broad state routes are not runtime dependencies. | PILOT-002, PILOT-003 |
| PILOT-005 | Build the golden Grade 6 Math class session. | Automated and manual evidence covers provisioning through teacher/parent progress readback. | PILOT-003, PILOT-004 |
| PILOT-006 | Complete teacher classroom operations. | Attendance, timing, live status, interventions, group roles, artifacts, and closeout are persisted and usable. | PILOT-005 |
| PILOT-007 | Polish the V3 student teaching experience. | App-led phases, visuals, interactions, confusion diagnosis, tutor strategies, adaptive routes, exit ticket, and accessibility pass. | PILOT-005 |
| PILOT-008 | Produce the 25-session Grade 6 Math track. | Exactly 25 sessions score B or higher, receive human approval, publish, and appear in the teacher sequence. | PILOT-005, PILOT-007 |
| PILOT-009 | Install launch gates. | End-to-end, permission, accessibility, security, monitoring, cost, recovery, and privacy evidence passes. | PILOT-006, PILOT-008 |
| PILOT-010 | Run and evaluate the design-partner pilot. | One school/1-3 classes produce a reviewed pilot report and proceed/revise/stop decision. | PILOT-009 |

## Execution Rules

- Complete foundation tasks `PILOT-001` through `PILOT-004` before treating demo behavior as production evidence.
- Use `PILOT-005` as the acceptance fixture for later classroom, content, and launch work.
- Do not scale content before grading, revision, approval, storage, publishing, and rendering work end to end.
- Do not add deferred features unless the product contract is explicitly revised.
- Every task must identify role scope, persistent data, error/empty states, accessibility, tests, and operational ownership.

## Deferred Backlog

- Additional grades and subjects.
- Full K-12 content production.
- Automated billing and consumer subscriptions.
- Gift cards and cash-equivalent rewards.
- Native mobile applications.
- Full SIS/LMS and district SSO integrations.
- Public social features and unrelated general-purpose agents.
