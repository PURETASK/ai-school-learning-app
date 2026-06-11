# Codex Prompt — MVP Module Buildout V2

Read these files first:

```txt
AGENTS.md
PROJECT_SOURCE_OF_TRUTH.md
CANONICAL_NAMING_CONVENTIONS.md
docs/mvp-vertical-slice/00_MVP_VERTICAL_SLICE_MODULE_INDEX.md
docs/mvp-vertical-slice/01_STUDENT_DASHBOARD_SPEC.md
docs/mvp-vertical-slice/02_LESSON_PLAYER_SPEC.md
docs/mvp-vertical-slice/03_QUIZ_ENGINE_SPEC.md
docs/mvp-vertical-slice/04_FEEDBACK_ENGINE_SPEC.md
docs/mvp-vertical-slice/05_MASTERY_ENGINE_SPEC.md
docs/mvp-vertical-slice/06_MEMORY_VAULT_SPEC.md
docs/mvp-vertical-slice/07_PARENT_DASHBOARD_SPEC.md
docs/mvp-vertical-slice/08_END_TO_END_DATA_FLOW.md
docs/mvp-vertical-slice/09_COMPONENT_AND_STATE_MAP.md
docs/mvp-vertical-slice/10_ACCEPTANCE_TESTS.md
```

## Task

Deepen the MVP vertical slice implementation only:

```txt
Student Dashboard → Lesson Player → Quiz Engine → Feedback Engine → Mastery Engine → Memory Vault → Parent Dashboard
```

## Current MVP Rules

- Use local state only.
- Use the 12 seed lesson JSON files from `content/`.
- Do not add auth, database, AI tutor, payments, public discussions, mobile, or homepage marketing.
- Keep code typed and modular.
- Preserve child-safety and accessibility rules.
- Run `npm run validate:lessons` after content changes.

## Required Build Tasks

1. Verify `src/types/*` align with lesson schema v2.
2. Keep `MvpLearningLoop` as the temporary local-state orchestrator.
3. Ensure Student Dashboard shows recommended lesson, progress, Memory Vault preview, and weak-skill signals.
4. Ensure Lesson Player renders all 13 universal sections and handles nested objects.
5. Ensure Quiz Engine supports multiple-choice and open-response MVP scoring.
6. Ensure Feedback Engine returns summary, next action, strengths, weak skills, reteach/challenge recommendation, and parent support note.
7. Ensure Mastery Engine uses official mastery bands and never treats completion as mastery.
8. Ensure Memory Vault schedules Day 1, 3, 7, 14, and 30 reviews with stable IDs and due dates.
9. Ensure Parent Dashboard shows safe progress summary, weak skill signals, latest mastery, and review plan.
10. Add unit/component tests next if testing dependencies are available.

## Do Not Build Yet

- Supabase integration
- Real auth
- AI tutor
- Teacher dashboard
- Open discussion board
- Payments
- Mobile app
- Full K–12 curriculum

## Response Format

After work, respond with:

1. What changed
2. Files modified
3. How to test it
4. Known limitations
5. Recommended next step
