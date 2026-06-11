# Problem-Solving Lab Deep Dive

## Purpose
The Problem-Solving Lab is the main first-principles problem-solving system.

## Student Flow
1. Understand the problem.
2. Identify known facts.
3. Identify unknowns.
4. Break into smaller parts.
5. Choose a strategy.
6. Solve step by step.
7. Check the answer.
8. Explain reasoning.
9. Reflect.

## Student Outcome
Students learn how to approach unfamiliar problems instead of memorizing only familiar patterns.

## MVP Interaction
The V6 scaffold renders known facts, unknowns, solution steps, answer check, and success criteria. Later versions should let students fill each field.

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
