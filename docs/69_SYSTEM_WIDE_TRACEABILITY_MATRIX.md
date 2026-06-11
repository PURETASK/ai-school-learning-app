# System-Wide Traceability Matrix

## Purpose

This document connects the original build doctrine to concrete implementation artifacts so Codex and human reviewers can verify that the product is not drifting.

## Pillar → Feature Traceability

| Pillar | Required Product Evidence | Current Artifact | Status |
|---|---|---|---|
| Standards-Aligned Curriculum | Standards tags on every lesson | seed lesson JSON, validation script | Present |
| First-Principles Problem Solving | Breakdown section in every lesson | Lesson Player section 4 | Present |
| Critical Thinking | Checkpoint in every lesson | Lesson Player section 7 | Present |
| Discussion & Academic Dialogue | Structured prompt, no open chat | Lesson Player section 9 | Present, scaffold only |
| Interpretation | Interpretation lens/task | Lesson Player section 9 | Present |
| Evidence-Based Reasoning | CER/evidence task | Lesson Player section 8 | Present |
| Metacognition | Reflection section | Lesson Player section 15 | Present |
| Retrieval + Spaced Retention | Retrieval check + Memory Vault | Lesson Player section 11, Memory Vault engine | Present |
| Inquiry-Based Learning | Questions/investigation tasks | Seed lessons | Present, needs expansion |
| Computational + Systems Thinking | Debug/system tasks | Seed lessons and future modules | Partial |
| Project-Based Application | Challenge/project tasks | Challenge path | Present, needs rich projects |
| Adaptive Mastery + Feedback | Mastery bands + feedback plan | Mastery/feedback engines | Present |
| Fun + Motivation | Meaningful progress/rewards | Dashboard scaffold | Partial |
| Accessibility + Inclusive Learning | Semantic UI and notes | components/docs | Partial |
| Safe Child-Centered Design | No open chat, privacy docs | docs + scaffold limitations | Partial |

## Feature → File Traceability

| Feature | Primary Files |
|---|---|
| Student Dashboard | `src/features/dashboards/student/StudentDashboard.tsx` |
| Lesson Player | `src/features/lessons/LessonPlayer.tsx` |
| Quiz Engine | `src/features/quizzes/quizEngine.ts`, `QuizPanel.tsx` |
| Feedback Engine | `src/features/feedback/feedbackEngine.ts` |
| Mastery Engine | `src/features/mastery/masteryEngine.ts` |
| Memory Vault | `src/features/memory-vault/memoryVaultEngine.ts` |
| Parent Dashboard | `src/features/dashboards/parent/ParentDashboard.tsx` |
| Progress Engine | `src/features/progress/progressEngine.ts` |
| Analytics Contract | `src/features/analytics/analyticsEvents.ts` |

## Review Rule

Any new feature must point back to at least one core pillar, one user role, one data contract, and one acceptance test.
