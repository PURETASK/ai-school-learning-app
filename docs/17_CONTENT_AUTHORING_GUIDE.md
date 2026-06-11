# 17 — Content Authoring Guide

## Purpose

This document defines how curriculum content is written, stored, reviewed, and prepared for the app.

Start with Markdown/JSON files before building a full content admin system.

---

## Content Philosophy

Content should be:

- grade-appropriate
- standards-tagged
- thinking-skill tagged
- interactive
- review-ready
- accessible
- safe for children
- expandable

---

## Preferred MVP Format

Use structured JSON for app-loaded lessons and Markdown for human-readable curriculum maps.

Example:

```txt
course.md
unit-01.md
lesson-001.json
```

---

## Folder Structure

```txt
content/
  foundation-academy/
    grade-3/
      math/
        course.md
        units/
          unit-01.md
        lessons/
          lesson-001-arrays-and-multiplication.json
      ela/
      science/
      social-studies/
  bridge-academy/
    grade-6/
  scholar-academy/
    grade-9/
```

---

## Curriculum Map Format

```md
# Grade 3 Math Curriculum

## Course Overview

## Units

### Unit 1: Multiplication Foundations

- Objective:
- Essential Question:
- Lessons:
  1. Equal Groups
  2. Arrays
  3. Skip Counting
- Thinking Skills:
- Project:
- Assessment:
- Standards Tags:
```

---

## Lesson Format

```md
# Lesson: [Title]

Grade:
Subject:
Unit:
Estimated Time:
Learning Objective:
Essential Question:
Standards Tags:
Thinking Skill Tags:
Vocabulary:
Prerequisites:

## Hook

## Mini Teach

## First-Principles Breakdown

## Worked Example

## Guided Practice

## Critical Thinking Checkpoint

## Evidence-Based Reasoning Task

## Interpretation / Discussion Task

## Active Practice

## Retrieval Check

## Quiz

## Answer Key

## Feedback Rules

## Spaced Review

## Reteach Path

## Challenge Path

## Reflection

## Parent/Teacher Notes
```

---

## Standards Tagging Rules

Every lesson needs at least one standards tag.

Example:

```txt
MATH.G3.OA.MULTIPLICATION_ARRAYS
```

---

## Thinking Skill Tagging Rules

Every lesson needs at least one thinking skill tag.

Example:

```txt
THINK.FIRST_PRINCIPLES.KNOWNS_UNKNOWNS
THINK.EVIDENCE.CER
```

---

## Accessibility Notes

Content authors should specify:

- read-aloud needs
- vocabulary supports
- visual supports
- alternative response options
- possible cognitive load issues

---

## Content Review Checklist

Before content is accepted:

- belongs to correct grade/subject/unit
- has objective
- has standards tags
- has thinking skill tags
- includes practice
- includes retrieval
- includes feedback
- includes review schedule
- avoids unsafe/inappropriate content
- accessible language level
- no unsupported factual claims


---

# V2 Implementation Expansion

## Document Status

- **Version:** 2.0
- **Readiness Target:** Codex-ready implementation guidance
- **Primary Dependency:** AGENTS.md, Product Bible, Core Pillars, MVP Scope
- **Core Learning Loop:** Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply

## V2 Improvements Added

- Adds authoring checklist.
- Adds file naming rules.
- Adds review statuses.
- Adds standards/thinking tags.
- Adds sample lesson authoring flow.
- Adds quality gates before content enters app.

## What This Document Must Lock

- Use Markdown/JSON first.
- No lesson is publishable without metadata, standards, thinking tags, quiz, feedback, and review schedule.

## Implementation Requirements

- Define draft → review → approved → published lifecycle.
- Separate content authoring from code.

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

- Create sample content files.
- Add validation scripts later.
- Do not build complex admin editor before schema stabilizes.

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
