# 83 — Persistence QA and Acceptance Tests

## Purpose

This document defines how to test V7 persistence.

## Manual Acceptance Tests

### Test 1 — Lesson Completion Persists

1. Open the app.
2. Select a lesson.
3. Mark several lesson sections complete.
4. Refresh the browser.
5. Confirm section completion remains visible.

### Test 2 — Quiz Attempt Persists

1. Complete a quiz.
2. Confirm result appears.
3. Refresh the browser.
4. Confirm quiz score and quiz attempt count remain.

### Test 3 — Memory Vault Persists

1. Complete a lesson.
2. Confirm Memory Vault items are scheduled.
3. Refresh the browser.
4. Confirm the review plan still appears.

### Test 4 — Review Session Persists

1. Open Memory Vault.
2. Complete a review session.
3. Refresh the browser.
4. Confirm session summary remains in the Parent Dashboard.

### Test 5 — Mistake Journal Persists

1. Submit a quiz with incorrect answers.
2. Open Thinking Systems.
3. Confirm Mistake Journal entries exist.
4. Refresh.
5. Confirm saved mistake count remains.

### Test 6 — Planner and Portfolio Persist

1. Submit a quiz.
2. Confirm Learning Planner and Portfolio Evidence records are created.
3. Refresh.
4. Confirm saved counts remain in the Student and Parent dashboards.

### Test 7 — Reset Works

1. Click Reset demo progress.
2. Confirm saved lesson progress, quiz attempts, Memory Vault items, mistake entries, planner entries, and portfolio evidence clear.

## Static Test Coverage

The static test script checks for:

```txt
persistence type contracts
localStorage hook
persistence status panel
vertical slice wiring
parent dashboard persistence evidence
```

Run:

```bash
npm run check
```

## Done Criteria

Persistence is acceptable for V7 if:

- Refresh does not erase lesson progress.
- Refresh does not erase quiz evidence.
- Refresh does not erase Memory Vault schedules/sessions.
- Thinking-system records are saved after quiz evidence.
- Parent dashboard can summarize persisted evidence.
- Reset clears demo state.
