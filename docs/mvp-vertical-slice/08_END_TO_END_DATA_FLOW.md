# End-to-End Data Flow — V2

## Purpose

Define how data moves through the MVP vertical slice without a database.

## Flow

```txt
content/*.json
  ↓ loadLessons.ts
Lesson[]
  ↓ StudentDashboard
selectedLessonId
  ↓ LessonPlayer
completedSectionKeys
  ↓ QuizPanel
StudentAnswer[]
  ↓ gradeQuiz()
QuizResult
  ↓ buildFeedbackPlan() + calculateMasterySummary()
FeedbackPlan + MasterySummary
  ↓ scheduleMemoryVaultItems()
ScheduledReviewItem[]
  ↓ ParentDashboard
safe progress summary
```

## Data Contracts

| Data | Owner | Consumer |
|---|---|---|
| `Lesson[]` | loader | dashboards, lesson player, quiz engine |
| `StudentAnswer[]` | quiz panel | quiz engine |
| `QuizResult` | quiz engine | feedback, mastery, dashboards |
| `ScheduledReviewItem[]` | Memory Vault | dashboards, future review player |
| `completedLessonIds` | vertical slice state | dashboards, recommendations |
| `completedSectionKeysByLesson` | vertical slice state | lesson player |

## Integrity Rules

- Lesson content must validate before use.
- Quiz result must include per-skill breakdown.
- Memory Vault items must have stable IDs.
- Parent dashboard must use aggregated progress, not hidden raw personal data.
- No external network calls in local MVP.

## Future Persistence

Later, replace local state with tables for lesson progress, quiz attempts, mastery records, and spaced review items. Do not change the UI contracts casually when persistence is added.
