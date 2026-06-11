# Discussion Arena Deep Dive

## Purpose
The Discussion Arena teaches structured academic dialogue without unsafe public chat.

## Supported Frames
- I think ___ because ___.
- I agree because ___.
- I disagree because ___.
- The evidence shows ___.
- Another possibility is ___.
- I changed my mind because ___.

## MVP Safety Boundary
The MVP is prompt-only. There is no open public chat, no random direct messages, and no public student profiles.

## Student Outcome
Students learn to explain, respond, disagree respectfully, and revise thinking based on evidence.

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
