# V3 Quality Gate Checklist

## Required Commands

```bash
npm run validate:lessons
npm run audit
npm run test
```

## Required Pass Conditions

- 12 seed lesson JSON files validate.
- No duplicate lesson IDs.
- Memory Vault schedule is Day 1/3/7/14/30.
- Lesson Player exposes 16 official sections.
- Mastery engine contains all five official bands.
- `PROJECT_SOURCE_OF_TRUTH.md` remains present and authoritative.

## Manual Review Conditions

- Lesson content must be age-appropriate.
- Feedback must be encouraging but specific.
- Parent dashboard must not expose unrelated student data.
- No open chat or public profiles may be added without safety design.
- Open responses must not be treated as fully reliable auto-grading in production.

## Release Blockers

- Missing auth/RBAC for real users.
- Missing parent consent flow for children.
- Missing persistence for progress.
- Missing review-session workflow for Memory Vault.
- Missing accessibility checks.
