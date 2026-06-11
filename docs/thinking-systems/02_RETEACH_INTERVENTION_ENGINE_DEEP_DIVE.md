# Reteach and Intervention Engine Deep Dive

## Purpose
The Reteach and Intervention Engine gives a smaller, clearer, lower-load learning path when a student is not ready yet.

## Required Supports
- Simpler explanation
- Visual model
- Worked example
- Vocabulary support
- Step-by-step scaffold
- Smaller practice set
- Common misconception correction
- Parent/teacher note

## Activation
Activate when mastery is below 80%, when mistake patterns are high severity, or when the student requests help.

## Student Outcome
The student gets a repair path instead of a generic retry loop.

## Exit Criteria
The reteach path should define what evidence proves the student is ready to return to normal practice.

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
