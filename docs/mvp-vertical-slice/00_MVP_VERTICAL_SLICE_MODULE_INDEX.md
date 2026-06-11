# MVP Vertical Slice Module Index — V2

## Purpose

This folder defines the seven connected modules that prove the K–12 learning app's core learning loop before database, auth, AI tutor, mobile, payments, or school-admin expansion.

## Official Loop

```txt
Student Dashboard → Lesson Player → Quiz Engine → Feedback Engine → Mastery Engine → Memory Vault → Parent Dashboard
```

## V2 Improvements

- Strengthened module boundaries.
- Added component/data contracts.
- Added child-safety and accessibility requirements per module.
- Added empty/error states.
- Added acceptance criteria and QA checklists.
- Added analytics-event placeholders for future reporting.
- Aligned implementation with v2 seed lesson JSON.

## Module Files

| # | Module | Spec |
|---:|---|---|
| 1 | Student Dashboard | `01_STUDENT_DASHBOARD_SPEC.md` |
| 2 | Lesson Player | `02_LESSON_PLAYER_SPEC.md` |
| 3 | Quiz Engine | `03_QUIZ_ENGINE_SPEC.md` |
| 4 | Feedback Engine | `04_FEEDBACK_ENGINE_SPEC.md` |
| 5 | Mastery Engine | `05_MASTERY_ENGINE_SPEC.md` |
| 6 | Memory Vault | `06_MEMORY_VAULT_SPEC.md` |
| 7 | Parent Dashboard | `07_PARENT_DASHBOARD_SPEC.md` |

## Definition of Done

The vertical slice is done when a student can start a seed lesson, complete the universal lesson flow, answer the quiz, receive feedback and a mastery band, schedule Memory Vault items, and show progress in the parent view.
