# Student Dashboard — V2 Design + Build Specification

## 1. Purpose

Start, orient, recommend, and summarize progress before the lesson begins.

This module is part of the MVP vertical slice:

```txt
Student Dashboard → Lesson Player → Quiz Engine → Feedback Engine → Mastery Engine → Memory Vault → Parent Dashboard
```

## 2. User Roles

- Student

## 3. Repo Location

```txt
src/features/dashboards/student/StudentDashboard.tsx
```

## 4. Must-Contain UI / System Elements

- identity card
- academy/grade context
- recommended lesson mission
- all seed lessons grid
- subject mastery cards
- Memory Vault preview
- weak-skill signals
- recent activity placeholder
- safe progress language

## 5. Required Data Inputs

- StudentProfile
- Lesson[]
- completedLessonIds
- QuizResult map
- ScheduledReviewItem[]
- subject mastery summaries

## 6. Local State / Derived State

| State | Purpose |
|---|---|
| selected IDs | Track current lesson/question/section selections. |
| progress values | Display completion and mastery without waiting for database persistence. |
| derived recommendations | Choose next action from lesson completion, quiz evidence, and Memory Vault state. |
| empty/error state flags | Prevent crashes when content is missing or incomplete. |

## 7. Main User Interactions

| Interaction | Expected Result |
|---|---|
| View module | User immediately understands what to do next. |
| Select/advance | State updates without losing current learning evidence. |
| Submit evidence | The next engine receives typed data, not loose strings. |
| Return/back | User can safely return without exposing unrelated data. |

## 8. Empty / Error States

- no lessons loaded
- no completed lessons
- no Memory Vault items
- no weak skills
- malformed lesson card

## 9. Acceptance Criteria

- [ ] Can select any seed lesson
- [ ] Can start recommended lesson
- [ ] Shows due/upcoming Memory Vault items
- [ ] Shows mastery and weak-skill signals
- [ ] Never exposes other student data

- [ ] Keyboard navigation works.
- [ ] Status is not communicated by color alone.
- [ ] Component uses canonical types from `src/types/`.
- [ ] Component does not add auth/database dependencies in MVP.

## 10. Codex Implementation Instructions

1. Read `PROJECT_SOURCE_OF_TRUTH.md` and `CANONICAL_NAMING_CONVENTIONS.md` first.
2. Use the seed lesson JSON from `content/`.
3. Preserve the universal lesson loop and official mastery bands.
4. Build small typed helpers before adding UI complexity.
5. Add error/empty states before visual polish.
6. Do not introduce new dependencies unless the need is documented.
7. Keep this module composable so Supabase persistence can be added later.

## 11. Analytics Events To Add Later

| Event | Trigger |
|---|---|
| `student-dashboard_viewed` | User lands on the module. |
| `student-dashboard_action_started` | User begins main action. |
| `student-dashboard_action_completed` | User completes main action. |
| `student-dashboard_error_seen` | User sees recoverable error state. |

## 12. QA Checklist

- [ ] Content renders from JSON only.
- [ ] No hardcoded lesson-specific logic.
- [ ] Works with all 12 seed lessons.
- [ ] Works when no quiz result exists.
- [ ] Works when Memory Vault is empty.
- [ ] Child-safety rules remain intact.


## Cross-Cutting Requirements

### Child Safety
- No public student profiles, unrestricted chat, random direct messages, or social feeds.
- Feedback must be supportive and non-shaming.
- Do not collect extra personal data in MVP local-state mode.
- Parent view must show only the linked demo student now; later role-based access must enforce this server-side.

### Accessibility
- Use semantic headings, landmarks, labels, and button text.
- All interactive controls must be keyboard reachable with visible focus states.
- Do not rely only on color for mastery, completion, or error status.
- Use readable language and short section labels for younger learners.
- Avoid flashing, auto-playing, or high-motion UI.

### Data Integrity
- All lesson-driven UI must come from validated JSON in `content/`.
- Missing optional data may degrade gracefully; missing required data must show a clear validation/error state.
- IDs must remain canonical and stable across lesson, quiz, answer key, Memory Vault, and reports.

### MVP Boundary
- Local state only.
- No real auth, database, payments, mobile app, open discussion boards, or AI tutor in this pass.
- Do not build unrelated homepage/marketing features before the learning loop is proven.


## 13. Implementation Status

| Layer | Status | V2 Notes |
|---|---|---|
| Product definition | Improved | V2 adds data contracts, edge cases, analytics, and QA. |
| UI scaffold | Improved | Existing scaffold upgraded to deeper MVP behavior. |
| Persistence | Later | Local state only. |
| Tests | Next | Add unit tests and component smoke tests next. |

## 14. Next Build Tasks

- Add unit tests for module logic.
- Add component smoke tests for empty/default/evidence states.
- Add Storybook or screenshot examples later if desired.
- Connect to persistence only after local MVP loop is stable.


## V3 Hardening Addendum

### System-Specific Upgrade

Add priority ordering: due Memory Vault items, incomplete recommended lesson, weak skill repair. Dashboard must distinguish demo state from persisted state.

### Additional Acceptance Criteria

- The feature maps back to at least one core pillar and one measurable learning outcome.
- The feature has a clear empty state, error state, and accessibility requirement.
- The feature can run with seed JSON content before database support exists.
- The feature must not introduce unrestricted child communication or privacy leakage.

### QA Evidence Required

- Static check or manual test proving the feature follows the MVP vertical slice.
- Review note proving the feature does not contradict `PROJECT_SOURCE_OF_TRUTH.md`.
- Screenshot or demo flow confirmation before calling the feature MVP-ready.
