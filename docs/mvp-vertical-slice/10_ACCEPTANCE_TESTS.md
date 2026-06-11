# MVP Vertical Slice Acceptance Tests — V2

## Manual Smoke Test

1. Run `npm run validate:lessons`.
2. Run `npm run dev`.
3. Open the local app.
4. Confirm Student Dashboard loads all 12 seed lessons.
5. Select one Grade 3, one Grade 6, and one Grade 9 lesson.
6. Start a lesson and navigate all 13 universal sections.
7. Submit a complete quiz.
8. Confirm results show score, points, mastery band, skill breakdown, feedback, and scheduled review count.
9. Open Parent Dashboard.
10. Confirm completed lesson, weak skills, latest mastery, and Memory Vault plan appear.

## Required Automated Tests Next

| Test | Type | Priority |
|---|---|---|
| Lesson loader returns 12 lessons | unit | P0 |
| Validator rejects missing quiz answer | unit | P0 |
| `gradeQuiz` scores MC questions | unit | P0 |
| `gradeQuiz` produces skill breakdown | unit | P0 |
| `getMasteryBand` returns correct bands | unit | P0 |
| `scheduleMemoryVaultItems` creates day 1/3/7/14/30 items | unit | P0 |
| StudentDashboard renders empty state | component | P1 |
| LessonPlayer renders all sections | component | P1 |
| QuizPanel prevents incomplete submit | component | P1 |
| ParentDashboard hides unrelated data | component/security | P1 |

## Failure Conditions

The MVP should fail review if:

- Lesson completion does not schedule Memory Vault items.
- The quiz can submit with no answers.
- Parent view exposes non-linked student data.
- Lesson Player skips first-principles, evidence, interpretation, or retrieval sections.
- Feedback only says “right/wrong” without next action.

---

# V4 Memory Vault Review-Session Acceptance Tests

## Student Review Flow

- Complete any seed lesson quiz.
- Confirm Memory Vault items are scheduled.
- Click **Open Memory Vault review** from the result screen or **Start review session** from the Student Dashboard.
- Confirm the session displays a prompt, confidence selector, answer input, and review queue.
- Confirm expected answer is not shown before answering.
- Submit an answer.
- Confirm feedback and expected answer appear.
- Finish all review items.
- Confirm session summary appears.

## Data Flow

- Correct answers update item status to `completed`.
- Incorrect answers update item status to `rescheduled`.
- Retention strength changes based on score and confidence.
- Session summary is stored in vertical-slice state.
- Parent Dashboard displays latest Memory Vault session summary.

## Static Quality Gate

`npm run test` must confirm:

- `MemoryVaultReviewSession` exists.
- `MvpLearningLoop` has a `memory-vault` screen.
- `memoryVaultSessionSummaries` is tracked.
- Memory Vault engine exposes review-session functions.
- Parent Dashboard has latest review-session summary.
