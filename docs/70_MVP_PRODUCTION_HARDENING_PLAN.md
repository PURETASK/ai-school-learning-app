# MVP Production Hardening Plan

## Goal

Move from local demo scaffold to safe internal alpha without breaking the learning doctrine.

## P0 Before Internal Alpha

1. Add persistent progress storage.
2. Add Memory Vault review-session UI.
3. Add rubric scoring model for open response questions.
4. Add auth mock boundaries or real auth provider.
5. Add role-based access guards for student and parent views.
6. Add automated unit tests for mastery, quiz scoring, Memory Vault scheduling, and content loading.
7. Add empty/error/loading states for every MVP screen.

## P1 Before Beta With Real Learners

1. Parent consent flow.
2. Data retention/deletion workflow.
3. Accessibility audit.
4. Security threat-model review.
5. Teacher/content reviewer workflow.
6. Manual review queue for open-ended responses.
7. More MVP lessons by course/unit.

## P2 After Core Loop Stabilizes

1. Full teacher dashboard.
2. Assignment system.
3. AI tutor with guardrails.
4. Portfolio and project submissions.
5. Advanced analytics.
6. Mobile app.

## Definition of Hardened MVP

The app can run the full learning loop, persist it, review it later, show parent-visible progress, and prevent unauthorized access to student data.
