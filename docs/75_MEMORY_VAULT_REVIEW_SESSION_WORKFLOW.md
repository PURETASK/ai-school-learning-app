# 75 — Memory Vault Review Session Workflow

## Purpose

The Memory Vault is no longer only a scheduler. This workflow closes the retention loop by letting a student actively retrieve scheduled review items, receive feedback, update retention strength, reschedule weak items, and expose parent-facing review evidence.

This document governs the MVP implementation of:

```txt
Lesson completion → Memory Vault scheduling → Review session → Retrieval scoring → Retention update → Parent summary
```

## Canonical Review Flow

1. Student completes a lesson and quiz.
2. App schedules Memory Vault items for Day 1, Day 3, Day 7, Day 14, and Day 30.
3. Student opens the Memory Vault review session from the Student Dashboard or results screen.
4. App selects due items first. If no items are due, the MVP permits practice review of upcoming scheduled items for demo/testing.
5. Student answers from memory before seeing the expected answer.
6. Student rates confidence from 1–5.
7. App scores the answer using a lightweight recall heuristic.
8. App shows feedback and the expected answer.
9. Correct/high-confidence items move toward stronger retention.
10. Incorrect/low-confidence items are rescheduled for near-term review and flagged for reteach.
11. Parent Dashboard summarizes the latest session.

## Required UI Elements

The review session must include:

- Session title and progress indicator.
- Current prompt.
- Subject, review stage, and retention strength labels.
- Free-response answer field.
- Confidence selector from 1 to 5.
- Check Answer action.
- Expected answer reveal after submission.
- Score/feedback panel.
- Review queue navigation.
- Finish Session action.
- Session summary with total, correct, average score, mastered count, and reteach count.

## Scoring Rules

MVP scoring is heuristic and safe for early demos:

```txt
Exact match or contained expected answer → high score
Keyword overlap with expected answer → partial/full score
No answer → 0
Short/weak answer → low partial score
```

A full production version should later replace or supplement this with rubric scoring, teacher review, and AI-assisted feedback under the AI tutor policy.

## Retention Strength Rules

Retention strength values:

```txt
weak → developing → strong → mastered
```

Rules:

```txt
Score >= 90 and confidence >= 4 → increase by 2 levels
Score >= 80 and confidence >= 3 → increase by 1 level
Score >= 60 → keep same level
Score < 60 → decrease by 1 level
```

## Status Rules

```txt
Correct item → completed
Incorrect item → rescheduled
Low confidence → may be rescheduled soon even when partially correct
Completed item → remains available in history but no longer blocks dashboard review count
Rescheduled item → due date moves to tomorrow
```

## Parent Dashboard Requirements

Parent Dashboard must show:

- Total Memory Vault items scheduled.
- Completed review item count.
- Rescheduled review item count.
- Latest review session average.
- Latest correct count.
- Reteach count.
- Parent support note.

Parent language must be coaching-oriented, not punitive.

## Data Contracts

Implemented types:

```ts
MemoryVaultReviewAnswer
MemoryVaultReviewOutcome
MemoryVaultReviewAttempt
MemoryVaultSessionSummary
ScheduledReviewItem
```

Implemented functions:

```ts
getReviewableMemoryVaultItems
scoreMemoryVaultResponse
gradeMemoryVaultAnswer
updateRetentionStrength
applyMemoryVaultReviewOutcome
applyMemoryVaultReviewSession
buildMemoryVaultSessionId
```

## MVP Limitations

- Review session state is local only.
- No database persistence yet.
- No authenticated student identity beyond demo mock data.
- Open-response scoring is heuristic, not final-grade authoritative.
- Review history resets on page refresh.

## Next Production Steps

1. Persist review sessions to the database.
2. Add due-date filtering by real user timezone.
3. Add review attempt history per student.
4. Add teacher/parent override notes.
5. Add rubric scoring for explain/apply prompts.
6. Add accessibility test coverage.
7. Add analytics events for review started/completed/rescheduled.

## Acceptance Criteria

- Student can start a review session after completing a lesson.
- Student must answer before seeing expected answer.
- Student can set confidence.
- App scores and shows feedback.
- App updates retention strength.
- Incorrect items are rescheduled.
- Parent Dashboard shows latest review-session evidence.
- Static tests confirm the workflow is wired into the vertical slice.
