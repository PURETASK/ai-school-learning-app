# Thinking Systems QA and Acceptance Tests — V6

## System-Wide Tests
- All ten thinking-system docs exist.
- All ten thinking-system components exist.
- `ThinkingSystemsHub` renders all ten systems.
- `ThinkingSystemsHub` works before and after quiz submission.
- Mistake Journal produces zero entries before quiz and entries after weak quiz results.
- Reteach Engine activates for low mastery.
- Challenge Engine unlocks for advanced mastery.
- Discussion Arena remains prompt-only in MVP.
- Portfolio system does not expose public sharing.

## Accessibility Tests
- Every system panel has a heading.
- Buttons and future inputs must have visible focus.
- Status cannot rely on color alone.
- Student messages must be plain-language and age-appropriate.

## Safety Tests
- No system asks for address, phone, precise location, health diagnosis, or private family data.
- No system creates public profiles, public posts, or random DMs.
- Mistake feedback must use repair language, not shame language.

## MVP Acceptance Criteria
V6 passes when `npm run check` validates 16 lessons, audits docs/code, and confirms all ten thinking/adaptation systems are documented and componentized.
