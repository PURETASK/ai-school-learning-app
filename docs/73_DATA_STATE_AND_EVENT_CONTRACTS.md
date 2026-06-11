# Data, State, and Event Contracts

## Local MVP State

The current scaffold uses local React state for:

- selected lesson
- completed lesson IDs
- completed lesson section keys
- quiz answers
- quiz results
- scheduled Memory Vault items

## Production State Boundary

These state objects must eventually persist to backend storage:

- student profile
- lesson progress
- quiz attempts
- skill mastery records
- scheduled Memory Vault items
- parent/guardian links

## Learning Events

The analytics contract supports:

- dashboard_viewed
- lesson_started
- lesson_section_completed
- quiz_started
- quiz_submitted
- feedback_viewed
- mastery_band_assigned
- memory_vault_items_scheduled
- parent_dashboard_viewed

## Privacy Rule

Learning events must not include unnecessary personal data or free-text student answers unless a privacy-approved logging policy exists.
