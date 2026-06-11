# 08 — Curriculum Architecture

## Purpose

This document defines how curriculum is organized, stored, tagged, and expanded.

The system must prevent orphan lessons and random content. Every piece of curriculum belongs to a hierarchy.

---

## Curriculum Hierarchy

```txt
Academy
  Grade Band
    Grade Level
      Subject
        Course
          Unit
            Lesson
              Section
              Activity
              Quiz
              Review Item
              Project
```

---

## Academies

### Foundation Academy

Grades:

- Kindergarten
- Grade 1
- Grade 2
- Grade 3
- Grade 4
- Grade 5

### Bridge Academy

Grades:

- Grade 6
- Grade 7
- Grade 8

### Scholar Academy

Grades:

- Grade 9
- Grade 10
- Grade 11
- Grade 12

---

## MVP Curriculum

Start with:

```txt
Foundation Academy / Grade 3
Bridge Academy / Grade 6
Scholar Academy / Grade 9
```

Subjects:

- ELA / Reading
- Math
- Science
- Social Studies

---

## Subjects

Core subjects:

- ELA / Reading
- Writing
- Math
- Science
- Social Studies
- Computer Science
- Health / PE
- Arts / Music
- SEL / Life Skills
- Career / College Readiness

---

## Courses

Elementary courses can map directly to subject/grade.

Middle school courses:

- Grade 6 ELA
- Grade 6 Math
- Grade 6 Science
- Grade 6 Social Studies
- etc.

High school courses:

- English 9
- Algebra I
- Biology
- World History
- Health
- Computer Science Foundations

---

## Units

A unit should include:

- title
- grade
- subject/course
- overview
- essential questions
- objectives
- standards tags
- thinking skill tags
- lesson list
- project
- assessment
- review plan

---

## Lessons

A lesson should include:

- metadata
- instructional sections
- activities
- retrieval checks
- quiz
- mastery logic
- review schedule
- reteach/challenge paths
- accessibility notes

---

## Activities

Activity types:

- multiple choice
- short answer
- drag/drop later
- sorting
- matching
- sequencing
- math model
- source analysis
- evidence classification
- discussion prompt
- reflection
- project step
- code/debugging task

---

## Quizzes

Quiz questions should support:

- question text
- type
- choices
- correct answer
- explanation
- difficulty
- skill tag
- standard tag
- thinking skill tag
- feedback rule

---

## Projects

Every unit should eventually support a project or application task.

Project examples:

- Grade 3: design a multiplication garden
- Grade 6: create a water cycle investigation
- Grade 9: write a source-based historical argument

---

## Curriculum File Structure

```txt
content/
  foundation-academy/
    grade-3/
      ela/
        course.md
        units/
        lessons/
      math/
      science/
      social-studies/
  bridge-academy/
    grade-6/
      ela/
      math/
      science/
      social-studies/
  scholar-academy/
    grade-9/
      english-9/
      algebra-1/
      biology/
      world-history/
```

---

## Curriculum Object Rules

Every content object must include:

- id
- title
- academy
- grade level
- subject
- course if applicable
- standards tags
- thinking skill tags
- created/updated metadata later

---

## No Orphan Rule

Do not create:

- a lesson with no unit
- a quiz with no lesson or skill
- a skill with no subject/grade relationship
- a review item with no source lesson/skill


---

# V2 Implementation Expansion

## Document Status

- **Version:** 2.0
- **Readiness Target:** Codex-ready implementation guidance
- **Primary Dependency:** AGENTS.md, Product Bible, Core Pillars, MVP Scope
- **Core Learning Loop:** Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply

## V2 Improvements Added

- Adds complete hierarchy rules.
- Adds folder structure and content lifecycle.
- Adds academy-specific course rules.
- Adds unit completeness criteria.
- Adds prerequisites and dependency rules.
- Adds validation checklist.

## What This Document Must Lock

- Curriculum is content-data first using Markdown/JSON.
- No orphan lessons.
- Courses/units/lessons must connect to standards and thinking tags.

## Implementation Requirements

- Create Grade 3/6/9 maps before expanding grades.
- Include unit projects and assessments.
- Use content files first, database import later.

## Data, Permission, and UX Considerations

| Concern | Required Treatment |
|---|---|
| Student data | Collect only what the feature needs; avoid sensitive logs. |
| Role access | Student, parent, teacher, and admin access must be explicit. |
| Accessibility | Use semantic UI, visible focus states, readable language, and non-color-only signals. |
| Empty states | Define what users see when no lessons, reviews, progress, or linked users exist. |
| Error states | Explain what failed and give a safe next action; never expose private internals. |
| Analytics | Track learning events by IDs/tags, not unnecessary personal text. |

## Codex Implementation Instructions

- Create content folder structure exactly as specified.
- Implement curriculum loader only after schema is defined.
- Flag lessons missing required metadata.

## Acceptance Criteria

- Codex can implement from the document without inventing missing product rules.
- MVP requirements are separated from later-phase expansion.
- User roles, data needs, permissions, empty states, errors, and accessibility are considered.
- The document connects back to the core learning loop and locked pillars.
- A reviewer can tell whether a feature is done, incomplete, or out of scope.

## Review Checklist

- [ ] The document separates MVP from later-phase work.
- [ ] The document identifies required data and relationships.
- [ ] The document identifies permissions and safety constraints.
- [ ] The document includes accessibility expectations.
- [ ] The document provides acceptance criteria or completion checks.
- [ ] The document aligns with the 15 locked core pillars.
- [ ] The document avoids passive learning patterns.
- [ ] The document helps Codex build without inventing missing rules.

## Pillar Coverage Reminder

This document should continue to support the locked core pillars:

- Standards-Aligned Curriculum
- First-Principles Problem Solving
- Critical Thinking
- Discussion & Academic Dialogue
- Interpretation
- Evidence-Based Reasoning
- Metacognition
- Retrieval + Spaced Retention
- Inquiry-Based Learning
- Computational + Systems Thinking
- Project-Based Application
- Adaptive Mastery + Feedback
- Fun + Motivation
- Accessibility + Inclusive Learning
- Safe Child-Centered Design
