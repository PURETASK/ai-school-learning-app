# V3 Implementation Changelog

## Changed

- Expanded Lesson Player from 13 visible sections to the full 16-section official universal lesson flow.
- Added derived Lesson Player sections for Mastery Score, Spaced Review Scheduling, and Reteach or Challenge Path.
- Replaced hardcoded lesson-section clamp in the vertical slice with `LESSON_SECTION_COUNT`.
- Added progress snapshot types and progress engine.
- Added learning-event analytics type contract and helper functions.
- Added static smoke tests.
- Added foundation audit script.
- Added package scripts: `audit`, `test`, and `check`.
- Added V3 compliance and improvement reports.

## Validation

- Lesson validation: passed.
- Foundation audit: passed.
- Static smoke tests: passed.

## Still Not Done

- Database persistence.
- Real auth/RBAC.
- Parent consent/account linking.
- Memory Vault review-session UI.
- Rubric scoring for open responses.
- Vitest/Playwright test suite.
