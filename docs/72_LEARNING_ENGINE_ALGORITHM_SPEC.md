# Learning Engine Algorithm Specification

## Quiz Scoring

1. Multiple choice is exact-match auto-scored.
2. Open responses are heuristic in MVP and must be flagged for rubric review.
3. Skill breakdowns aggregate by `skillTag`.
4. A quiz result produces total score, correct count, points, answer feedback, and skill breakdowns.

## Mastery Assignment

| Score | Band | Action |
|---:|---|---|
| 0–39 | Needs Intervention | Assign intervention path |
| 40–64 | Needs Reteach | Assign reteach lesson |
| 65–79 | Almost Mastered | Assign guided practice |
| 80–89 | Mastered | Schedule spaced review |
| 90–100 | Advanced | Unlock challenge task |

## Memory Vault Scheduling

For each Memory Vault item in a lesson, create scheduled review records for Day 1, Day 3, Day 7, Day 14, and Day 30.

## Feedback Routing

- Score < 80: prioritize reteach.
- Score 80–89: mark mastered for now and schedule review.
- Score ≥ 90: schedule review and unlock challenge.
- Any weak skill under 80 should be visible to the student/parent dashboard.

## Future Adaptive Rescheduling

- Correct quickly + high confidence: increase interval.
- Correct slowly or low confidence: repeat soon.
- Incorrect: show feedback, assign reteach, review tomorrow.
