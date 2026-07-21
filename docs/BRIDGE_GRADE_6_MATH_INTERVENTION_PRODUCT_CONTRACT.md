# Bridge Academy Grade 6 Math Intervention Class Product Contract

## Contract Status

- **Status:** Controlling contract for the first sellable product
- **Commercial priority:** Active
- **Pilot duration:** 6-8 weeks
- **Content commitment:** 25 app-led class sessions
- **Class duration:** 35-55 minutes

This contract narrows commercial sequencing without replacing the broader Nexus Learning OS architecture or its official MVP. `PROJECT_SOURCE_OF_TRUTH.md` remains the ultimate authority for learning architecture, safety, data integrity, and repository governance.

## Product Definition

**Product:** Bridge Academy Grade 6 Math Intervention Class

**Primary buyer:** A middle-school principal, intervention lead, or curriculum director responsible for improving Grade 6 mathematics outcomes.

**Operator:** A Grade 6 mathematics or intervention teacher who launches classes, monitors progress, intervenes, and reviews evidence.

**Learners:** One or more rostered Grade 6 classes. Every learner uses a student-scoped account inside a school tenant.

**Supporting users:** School administrators configure the school and rosters. Linked parents receive scoped progress summaries and approved recommendations.

**Delivery model:** The app teaches the class directly while the teacher manages the room, monitors learning states, and provides human intervention.

## Learning Promise

The product will help a teacher identify what each learner misunderstands, teach Grade 6 mathematics with accurate visual and interactive models, provide guided practice and guardrailed tutor support, and collect evidence of immediate understanding, transfer, and delayed recall.

The product does not promise guaranteed test-score gains, placement, credit, diagnosis, or replacement of a qualified teacher.

## Pilot Scope

The pilot contains exactly 25 reviewed and published sessions organized as:

| Strand | Sessions |
|---|---:|
| Readiness diagnostic and learning routines | 2 |
| Ratios, rates, and proportional reasoning | 6 |
| Number system and rational-number reasoning | 5 |
| Expressions, equations, and inequalities | 6 |
| Geometry and measurement | 3 |
| Statistics and data reasoning | 2 |
| Final transfer challenge and reflection | 1 |
| **Total** | **25** |

Each session must map standards as data, identify prerequisites and misconceptions, and include a reteach and challenge route. The detailed curriculum sequence may revise session allocation through content review, but it may not exceed 25 sessions or add another subject without an approved contract change.

## Class-Session Contract

Every session must fit a 35-55 minute classroom block and provide:

1. **Arrival and retrieval, 3-5 minutes:** prior knowledge, attendance/readiness, and an accessible objective.
2. **Visual model, 7-10 minutes:** the app directly teaches through a diagram, manipulative, animation, simulation, or worked example.
3. **Guided practice, 6-8 minutes:** small steps with immediate diagnostic feedback.
4. **Confusion check, 3-5 minutes:** the learner explains the stuck point in plain text; the tutor classifies it before helping.
5. **Active or group task, 8-12 minutes:** learners model, sort, explain, compare, diagnose, or create, with individual evidence for group work.
6. **Mastery proof and exit ticket, 5-8 minutes:** the learner answers, explains reasoning, and reports confidence.
7. **Adaptive next step, 3-5 minutes:** targeted reteach, challenge, or Memory Vault scheduling.

Empty or unnecessary phases may be omitted under the V3 lesson-family rules, but the session must still produce valid mastery evidence. One immediate quiz score never proves durable mastery. Reviews should be scheduled after approximately 24 hours, 3-7 days, and a later spiral interval when appropriate.

## Required Product Workflows

- School admin creates or configures a school, teacher, class, and roster.
- Teacher receives the class, launches a session, monitors progress, and records interventions.
- Student signs in, joins the current class, completes the app-led lesson, uses tutor help, submits individual/group evidence, and completes the exit ticket.
- Quiz, mastery, learning-state, XP, tutor, intervention, and Memory Vault evidence persist to the database and survive reload.
- Teacher sees live and historical learner evidence scoped to assigned classes.
- Linked parent sees only their learner's progress, strengths, needs, and approved recommendations.
- Content and generated visuals pass grading, revision, human approval, storage, and publishing gates before student use.

## Pilot Operating Metrics

These are pilot decision targets, not public efficacy claims:

| Area | Pilot target |
|---|---|
| Provisioning | At least 95% of invited pilot users can activate and reach the correct scoped home without staff repair. |
| Session reliability | At least 98% of launched sessions reach the lesson player without a blocking product error. |
| Participation | At least 80% of present learners complete the session exit ticket. |
| Learning evidence | Pre/post and delayed-recall evidence is captured for at least 85% of completed sessions. |
| Tutor usefulness | At least 70% of rated tutor interventions are marked helpful or lead to successful next-step evidence. |
| Teacher operability | A teacher can identify stuck learners and assign or record an intervention during the class period. |
| Content quality | All 25 sessions achieve at least grade B, target grade A, and receive manager approval before publication. |
| Safety and privacy | Zero known cross-tenant disclosures, unauthorized role escalations, or unreviewed student-facing generated assets. |
| Accessibility | Zero unresolved critical accessibility blockers in the tested student and teacher flows. |

Pilot reporting must also record attendance, completion, help requests, immediate mastery, delayed recall, learner confidence/frustration, and teacher intervention time.

## Release Acceptance Criteria

The product is eligible for a design-partner school pilot only when:

- Production Supabase migrations, seeds, repository reads/writes, and strict readiness checks pass.
- Email verification, password reset, token refresh, session revocation, and trusted role claims work with the production identity provider.
- Automated permission tests prove school, class, teacher, parent, and student isolation.
- No required pilot workflow depends on local JSON or broad state snapshot endpoints.
- One golden class session passes end to end from school setup through teacher and parent readback.
- Teacher attendance, launch, phase monitoring, intervention, group-role, artifact-review, and closeout workflows are database-backed.
- The V3 student player teaches directly and supports visuals, interactions, confusion diagnosis, tutor help, retry/reteach, challenge, and exit ticket states.
- All 25 Grade 6 Math sessions are reviewed, approved, published, and represented in the teacher sequence.
- Critical workflows pass automated browser tests, accessibility checks, responsive/keyboard QA, and manual school-pilot scripts.
- Monitoring, audit logs, rate limits, AI cost controls, backup/recovery procedures, data export/deletion, and incident ownership are documented and tested.
- Teacher onboarding, school setup, student onboarding, parent communication, and pilot support materials are ready.

## Explicit Deferrals

Until this contract's release criteria pass, do not prioritize:

- Additional grades or a full K-12 lesson buildout.
- Additional sellable subject tracks beyond Grade 6 Math.
- Consumer subscriptions, automated billing, or payment-provider integration.
- Gift cards, cash-equivalent rewards, or real-money fulfillment.
- Native mobile applications.
- District SSO, OneRoster, Clever, ClassLink, or full SIS/LMS integrations beyond a safe CSV pilot path.
- Public social feeds, unrestricted student messaging, or public leaderboards.
- New general-purpose agent families unrelated to the pilot's teaching, safety, quality, or operations.
- Accreditation, transcript, course-credit, or guaranteed-outcome claims.

The shared three-academy architecture and existing content remain preserved; this deferral governs implementation priority, not deletion.

## Change Control

Scope may change only through an explicit revision to this contract that states the reason, evidence, acceptance impact, and displaced work. New features do not enter the active pilot backlog merely because supporting architecture already exists.

## Document Precedence

For the first sellable product, use this order:

1. `PROJECT_SOURCE_OF_TRUTH.md` for canonical learning architecture, safety, persistence, and repository rules.
2. This product contract for commercial scope, implementation priority, pilot metrics, and release acceptance.
3. `docs/school-class-product-plan.md` for detailed role experiences and classroom capabilities.
4. `docs/15_MVP_SCOPE.md`, `docs/40_RELEASE_ROADMAP_AND_MILESTONES.md`, and `docs/55_MVP_BACKLOG_AND_TASK_BREAKDOWN.md` for supporting scope, sequencing, and tasks.
5. Older plans, handoff packs, and historical MVP documents as non-controlling context.

When this contract and `PROJECT_SOURCE_OF_TRUTH.md` appear to conflict, the source of truth wins and this contract must be corrected. When a lower-ranked document conflicts with this contract on the first sellable pilot, this contract wins.
