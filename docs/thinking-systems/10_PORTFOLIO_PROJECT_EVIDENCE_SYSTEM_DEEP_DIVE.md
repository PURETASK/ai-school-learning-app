# Portfolio / Project Evidence System Deep Dive

## Purpose
The Portfolio / Project Evidence System stores proof of learning: essays, projects, lab reports, reflections, writing drafts, presentations, code projects, and capstones.

## Student Artifacts
- Essays
- Projects
- Lab reports
- Capstones
- Reflection responses
- Writing drafts
- Presentations
- Code projects
- Teacher/parent feedback

## Privacy Boundary
Portfolio evidence is private to the student and authorized parent/teacher roles. It is not a public gallery in MVP.

## Student Outcome
Students can point to real artifacts that prove growth, not just quiz scores.

## MVP Interaction
The V6 scaffold creates a lesson-linked evidence prompt and rubric tags. Persistence comes later.

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
