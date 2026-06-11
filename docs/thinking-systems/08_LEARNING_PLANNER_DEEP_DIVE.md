# Learning Planner Deep Dive

## Purpose
The Learning Planner helps students plan, start, monitor, finish, and reflect on learning tasks.

## Student Flow
1. What do I need to do?
2. What step comes first?
3. What strategy will I use?
4. How will I know I am done?
5. What got in my way?
6. What will I do differently next time?

## Grade Band Use
- Foundation: simple first-step and finish-signal prompts.
- Bridge: study strategy and obstacle prompts.
- Scholar: planning, monitoring, evaluating, and independent learning routines.

## Student Outcome
Students build executive-function habits instead of depending on the app to push every step.

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
