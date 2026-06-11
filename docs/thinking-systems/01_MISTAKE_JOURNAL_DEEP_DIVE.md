# Mistake Journal Deep Dive

## Purpose
The Mistake Journal turns wrong answers into repairable learning patterns. It prevents the app from saying only “wrong” and instead says, “Here is the exact kind of mistake. Here is how to fix it.”

## Mistake Types
- Misread the question
- Used the wrong operation
- Forgot vocabulary
- Weak evidence
- Skipped a step
- Guessed too fast
- Calculation error
- Misunderstood concept
- Weak explanation

## Student Outcome
Students should learn that mistakes are diagnostic evidence, not identity labels.

## Engine Requirements
- Read `QuizResult.answers`.
- Classify every answer below the 0.8 threshold.
- Assign a mistake type, severity, repair prompt, and recommended next system.
- Summarize patterns across the quiz attempt.

## Parent/Teacher Output
Show the primary pattern, affected skills, and recommended support system. Do not show raw shame-based language.

## Required Data Contract
- Lesson ID and title.
- Academy, grade, subject, course, and unit.
- Standards tags and thinking skill tags.
- Current quiz result when available.
- Skill tags and mastery band when available.

## Required UI States
- Empty state before quiz evidence exists.
- Active state after lesson or quiz evidence exists.
- Recommendation state explaining the next action.
- Parent/teacher summary state that avoids shame language.

## Accessibility Rules
- Use semantic headings.
- Do not rely only on color.
- Provide visible focus states for interactive controls.
- Keep language age-appropriate and plain.

## Child Safety Rules
- No public posting.
- No random direct messages.
- No sensitive personal disclosure prompts.
- Feedback must describe the work, not label the child.

## MVP Acceptance Criteria
- The system renders from a real lesson object.
- The system can operate with or without a quiz result.
- The system produces a student-friendly next action.
- The system produces a parent/teacher support note or summary when appropriate.
- The system is listed in `ThinkingSystemsHub`.
- The system has a dedicated component file.
