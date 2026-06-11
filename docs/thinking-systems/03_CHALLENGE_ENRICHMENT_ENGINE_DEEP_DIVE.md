# Challenge and Enrichment Engine Deep Dive

## Purpose
The Challenge and Enrichment Engine gives advanced work to students who demonstrate strong mastery.

## Challenge Types
- Harder problem
- Real-world application
- Creative task
- Multi-step reasoning
- Debate prompt
- Research extension
- Design challenge
- Cross-subject challenge

## Activation
Unlock primarily at 90%+ mastery. Some challenge prompts may be available on demand after completion.

## Student Outcome
Students who master a skill apply it more deeply instead of only moving to the next lesson.

## Portfolio Link
Every challenge should identify one artifact worth saving to the Portfolio / Project Evidence System.

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
