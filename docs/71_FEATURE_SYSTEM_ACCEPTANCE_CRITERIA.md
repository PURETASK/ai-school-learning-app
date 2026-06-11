# Feature System Acceptance Criteria

## Student Dashboard

- Shows academy, grade, recommended lesson, progress, Memory Vault, weak skills, and lesson list.
- Does not expose other students.
- Prioritizes due review items before new lessons when applicable.

## Lesson Player

- Displays all 16 official lesson flow steps.
- Tracks section completion.
- Allows keyboard navigation.
- Provides missing-section warnings during development.

## Quiz Engine

- Blocks submit until all required answers are present.
- Auto-scores multiple choice.
- Marks open responses as needing rubric review unless strong rubric scoring exists.
- Produces skill breakdowns.

## Feedback Engine

- Returns summary, next action, strengths, weak skills, reteach/challenge recommendation, and parent note.
- Maps feedback to mastery band.

## Mastery Engine

- Uses official five mastery bands.
- Returns next action and flags for reteach/challenge/review.

## Memory Vault

- Schedules Day 1, 3, 7, 14, and 30 review items.
- Deduplicates scheduled items per student/lesson/source item.
- Supports due/upcoming grouping.

## Parent Dashboard

- Shows only the linked student's progress.
- Shows latest result, weak skills, Memory Vault plan, and support note.

## Quality Gate

No feature is complete until it has UI states, data inputs, accessibility checks, privacy checks, and at least one acceptance test.
