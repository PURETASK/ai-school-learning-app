# Component and State Map — V2

## Top-Level State Owner

`src/features/vertical-slice/MvpLearningLoop.tsx` owns MVP local state.

## State Map

| State | Type | Purpose |
|---|---|---|
| `screen` | union | Controls current MVP view. |
| `selectedLessonId` | string | Chooses current lesson. |
| `sectionIndex` | number | Controls lesson player section. |
| `completedSectionKeysByLesson` | record | Tracks section progress locally. |
| `answers` | `StudentAnswer[]` | Stores current quiz responses. |
| `quizResults` | record | Stores completed quiz evidence by lesson. |
| `completedLessonIds` | string[] | Tracks completed lessons. |
| `memoryVaultItems` | `ScheduledReviewItem[]` | Stores scheduled reviews. |

## Component Contracts

| Component | Inputs | Outputs |
|---|---|---|
| `StudentDashboard` | student, lessons, results, vault | selected lesson, start lesson |
| `LessonPlayer` | lesson, section state | complete section, next/back/jump, quiz transition |
| `QuizPanel` | questions, answers | answer changes, submit |
| `ResultsPanel` | lesson + quiz result | parent/student navigation |
| `ParentDashboard` | completed lessons, quiz results, vault | none in MVP |

## Future Refactor Path

When the MVP stabilizes, extract state transitions into a reducer or service layer before adding Supabase. Do not wire database calls directly into every component.
