# Evidence Room Deep Dive

## Purpose
The Evidence Room trains students to support answers with proof using Claim → Evidence → Reasoning.

## Student Flow
1. Make a claim.
2. Choose evidence.
3. Sort strong, weak, irrelevant, and counterargument evidence.
4. Explain reasoning.
5. Revise weak answers.

## Subject Coverage
- ELA and writing: text evidence.
- Science: observations and data.
- Social studies: sources, maps, timelines, and context.
- Math: reasoning steps and checks.

## Student Outcome
Students learn that strong answers require relevant proof and explanation.

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
