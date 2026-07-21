# Agent Team Operating Model

This workspace uses Codex as the manager agent. Specialist sub-agents are temporary workers used for parallel research, design, implementation, review, and verification.

## Manager

**Codex Orchestrator** owns the master plan, work sequencing, user updates, task handoffs, integration review, and final delivery. The manager is accountable for accepting or rejecting agent output.

## Specialist Agents

| Agent | Ownership |
| --- | --- |
| Curriculum And Standards | K-12 curriculum maps, standards alignment, lesson taxonomy, unit templates |
| Product And UX | Student, parent, and admin workflows; age-specific UX rules |
| Technical Architecture | Data model, service boundaries, build order, deployment path |
| Frontend Implementation | Responsive shell, dashboards, lesson player, visual system |
| Backend And Learning Engine | Mastery, assignments, reports, progress interfaces |
| AI Tutor And Safety | Guardrailed tutor behavior, refusal rules, AI logs |
| Teacher And Explanation Design | Direct teaching plans, multiple explanation routes, checks for understanding, group task design |
| Student Tutor | Student-facing stuck-point interview, hint sequence, strategy switching, tutor feedback loop |
| Fun And Retention Design | Lesson fun factor, retention mechanics, mastery-tied rewards, rubric engagement checks |
| Curriculum Web Audit And Misconception Research | Staff-side web audit, usual syllabus comparison, common trouble spots, source-backed redesign prompts |
| Truth And Fact-Check | Tutor quality grading, factual review, source needs, research escalation |
| Visual Learning | Lesson image audits, diagram prompt generation, tutor visual supports |
| Content Operations | Draft/review/publish workflow, quiz bank rules, production batching |
| QA And Compliance | Privacy, accessibility, curriculum integrity, release gates |

## Operating Rules

- Every agent receives a narrow assignment with clear deliverables.
- Implementation agents receive disjoint file or module ownership.
- Agents assume other workers may be editing the workspace and do not revert unrelated changes.
- The manager integrates results only after reviewing them against the product goal.

## First Execution Wave Completed

- Curriculum and standards guidance was used to create the K-12 academy map, standards registry, lesson metadata, and pilot lesson priorities.
- UX guidance was used to define the student dashboard, curriculum browser, lesson player, parent dashboard, admin workflow, and age-band rules.
- Architecture guidance was captured as a production path from the dependency-free prototype toward a modular Next.js/Postgres system.
- QA/compliance guidance was used to define launch gates, AI guardrails, privacy requirements, accessibility targets, and tests.
