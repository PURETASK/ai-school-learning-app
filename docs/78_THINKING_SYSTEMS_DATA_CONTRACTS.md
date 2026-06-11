# Thinking Systems Data Contracts — V6

## Core Contract Families
- `ThinkingSystemDefinition` defines name, priority, activation, status, outcome, evidence, and safety boundary.
- `ThinkingSystemRuntimeStatus` tells the UI whether a system is currently available and why.
- `MistakeJournalEntry` stores question-level mistake evidence.
- `MistakePatternSummary` summarizes mistake types across a quiz.
- `ReteachInterventionPlan` creates scaffolded support.
- `ChallengeEnrichmentPlan` creates advanced tasks.
- `ProblemSolvingLabTask` stores first-principles decomposition.
- `EvidenceRoomTask` stores claim/evidence/reasoning work.
- `InterpretationLensTask` stores interpretation prompts and lens type.
- `DiscussionArenaPrompt` stores safe sentence frames and moderation rules.
- `LearningPlannerTask` stores planning, monitoring, and reflection prompts.
- `SystemsMapperTask` stores nodes, links, and change prompts.
- `PortfolioEvidenceItem` stores artifact prompts and rubric tags.

## Persistence Target
Later database tables should include: `mistake_journal_entries`, `reteach_plans`, `challenge_tasks`, `problem_solving_attempts`, `evidence_room_attempts`, `interpretation_attempts`, `discussion_responses`, `learning_planner_entries`, `systems_maps`, and `portfolio_items`.

## Privacy Note
All records are student education records. Persist only necessary data and gate access by role.
