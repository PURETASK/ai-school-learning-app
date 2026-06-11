# MVP Vertical Slice Specification

## Goal

Prove the full learning loop using the 12 polished seed lessons before expanding content or advanced platform features.

## Required Demo Flow

```txt
Student opens dashboard
Student sees today's lesson
Student opens lesson
Student completes lesson sections
Student answers quiz
App gives feedback
App calculates mastery score
App creates Memory Vault review items
Parent dashboard shows progress
```

## Feature Build Order

1. Student Dashboard
2. Lesson Player
3. Quiz Engine
4. Feedback Engine
5. Mastery Engine
6. Memory Vault
7. Basic Parent Dashboard

## Student Dashboard Requirements

Must show:

- Student name
- Academy
- Grade
- Today's lesson
- Current progress
- Memory Vault review due
- Mastery by subject
- Recent activity

## Lesson Player Requirements

Must render:

- Hook
- Learning Goal
- Mini Teach
- First-Principles Breakdown
- Worked Example
- Guided Practice
- Critical Thinking Checkpoint
- Evidence-Based Reasoning Task
- Interpretation / Discussion Prompt
- Active Practice
- Retrieval Check
- Quiz
- Reflection

## Quiz Engine Requirements

Must support:

- Multiple choice
- Short answer placeholder
- Explain-your-thinking prompt
- Answer key
- Explanation
- Score calculation

## Feedback Engine Requirements

Must return:

- Correct explanation
- Wrong answer explanation
- Hint
- Reteach recommendation
- Challenge recommendation

## Mastery Engine Requirements

Use official bands:

- 0–39: Needs Intervention
- 40–64: Needs Reteach
- 65–79: Almost Mastered
- 80–89: Mastered
- 90–100: Advanced

## Memory Vault Requirements

After lesson completion, generate review items for:

- Day 1
- Day 3
- Day 7
- Day 14
- Day 30

## Parent Dashboard Requirements

Must show:

- Completed lessons
- Quiz score
- Mastery band
- Weak skills
- Memory Vault due items
- Suggested support

## Definition of Done

The vertical slice is done when a developer can run the app locally, open a seed lesson, complete a quiz, see a mastery band, generate due review items, and view a parent-facing progress summary.
