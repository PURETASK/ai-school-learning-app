# Systems Mapper Deep Dive

## Purpose
The Systems Mapper teaches students to see parts, relationships, cause/effect, feedback loops, and hidden consequences.

## Example Uses
- Science: ecosystems, water cycle, cells.
- History: trade routes, empire growth, war causes.
- Math: functions and input/output.
- Health: sleep, food, exercise, mood.
- Economics: supply, demand, price.

## Student Outcome
Students learn that knowledge is connected, not just a list of isolated facts.

## MVP Interaction
The V6 scaffold renders nodes, links, and change prompts. Later versions should allow interactive drag-and-drop maps.

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
