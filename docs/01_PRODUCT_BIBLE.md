# 01 — Product Bible

## Product Summary

The K–12 Learning App Suite is a web-first education platform with three grade-band academies:

1. **Foundation Academy** — Kindergarten through 5th Grade
2. **Bridge Academy** — 6th Grade through 8th Grade
3. **Scholar Academy** — 9th Grade through 12th Grade

The platform teaches normal school subjects while also training students to think, reason, remember, explain, discuss, interpret, and apply knowledge.

This is not a passive video course, worksheet dump, or flashcard-only app. It is a structured learning engine.

---

## Mission Statement

Help students master school subjects and become stronger thinkers by combining:

- complete standards-aligned curriculum
- first-principles problem solving
- critical thinking
- academic discussion
- interpretation
- evidence-based reasoning
- metacognition
- retrieval practice
- spaced review
- active learning
- project-based application
- adaptive feedback
- safe child-centered design
- accessible and inclusive UX

---

## Core Learning Loop

```txt
Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply
```

This loop is the foundation for lesson design, assessment, feedback, dashboards, and curriculum structure.

---

## Three-Academy Model

### Foundation Academy: Kindergarten–5th Grade

Purpose:

- foundational reading
- phonics
- vocabulary
- writing basics
- math fluency
- science discovery
- community/social studies
- guided play
- SEL
- computer science foundations

UX style:

- bright
- simple
- visual
- playful
- short lessons
- large controls
- parent-guided support

### Bridge Academy: 6th–8th Grade

Purpose:

- middle-school independence
- structured study skills
- essay foundations
- pre-algebra and algebra readiness
- science labs
- historical thinking
- digital citizenship
- coding foundations
- critical discussion

UX style:

- quest-based
- skill-tree progression
- more mature than elementary
- still motivating
- clear daily learning path

### Scholar Academy: 9th–12th Grade

Purpose:

- high-school course progress
- transcript-style tracking
- essays
- labs
- research
- civics
- economics
- career pathways
- capstones
- portfolios

UX style:

- professional
- course-based
- portfolio-focused
- college/career aligned

---

## Target Users

### Students

Students use the platform to complete daily lessons, practice skills, review old learning, build projects, and track progress.

### Parents / Guardians

Parents monitor progress, weak skills, completed lessons, review habits, and learning consistency.

### Teachers

Teachers eventually assign lessons, monitor class mastery, identify weak skills, and review student submissions.

### Admins

Admins manage platform structure, curriculum, permissions, safety, and reporting.

---

## What the Platform Does

The platform:

- delivers standards-aligned lessons
- tracks skill mastery
- schedules spaced review
- provides feedback
- assigns reteach/challenge paths
- teaches thinking skills
- supports project work
- gives parent/teacher reports
- protects children’s data
- supports accessible learning

---

## What the Platform Does Not Do

The platform should not:

- become a random video library
- reward empty screen time
- expose student data publicly
- create unrestricted student social networks
- launch with open chat
- replace professional legal/compliance review
- claim official school accreditation without authorization
- build full K–12 before proving the MVP

---

## MVP Definition

MVP grades:

- Grade 3 — Foundation Academy
- Grade 6 — Bridge Academy
- Grade 9 — Scholar Academy

MVP subjects:

- ELA / Reading
- Math
- Science
- Social Studies

MVP features:

- Lesson Player
- Quiz Engine
- Feedback Engine
- Mastery Engine
- Memory Vault
- Student Dashboard
- Basic Parent Dashboard
- Content Files

---

## Long-Term Vision

The final platform should support:

- K–12 curriculum coverage
- parent dashboards
- teacher dashboards
- class assignments
- portfolios
- capstones
- AI tutor with guardrails
- full content admin
- mobile app
- state-specific standards mapping
- school deployments
- analytics and reporting

---

## Non-Negotiable Rules

1. Build the learning engine before decoration.
2. Every lesson must include thinking, practice, feedback, and review.
3. Every student action must respect privacy and safety.
4. Every feature must have a clear user role and purpose.
5. Every curriculum item must belong to grade, subject, unit, and skill structures.
6. Codex must read `AGENTS.md` and docs before major implementation.


---

## Source References

These docs use standards and safety frameworks as reference layers. They are not legal advice or a complete compliance certification.

- Common Core State Standards: https://corestandards.org/
- ELA Standards: https://thecorestandards.org/ELA-Literacy/
- Next Generation Science Standards: https://www.nextgenscience.org/
- C3 Framework for Social Studies: https://www.socialstudies.org/standards/c3
- CSTA K–12 Computer Science Standards: https://csteachers.org/k12standards/
- FTC COPPA Rule: https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa
- U.S. Department of Education FERPA: https://studentprivacy.ed.gov/ferpa
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- CAST UDL Guidelines: https://udlguidelines.cast.org/


---

# V2 Implementation Expansion

## Document Status

- **Version:** 2.0
- **Readiness Target:** Codex-ready implementation guidance
- **Primary Dependency:** AGENTS.md, Product Bible, Core Pillars, MVP Scope
- **Core Learning Loop:** Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply

## V2 Improvements Added

- Adds explicit success outcomes by user role.
- Separates non-negotiable product principles from flexible design choices.
- Defines what counts as MVP, phase 2, and out of scope.
- Adds measurable product-quality gates.
- Clarifies that the app is a thinking-development and retention platform.
- Adds decision log placeholders to prevent future drift.

## What This Document Must Lock

- Web-first platform is the default.
- Three academies stay separate in UX but share a common data backbone.
- Learning engine outranks decoration, landing pages, or random gamification.
- MVP proves Grade 3, Grade 6, and Grade 9 across four core subjects.

## Implementation Requirements

- Define the parent platform and academy relationship.
- Map every major feature to at least one core pillar.
- Use the product bible as the first file Codex reads after AGENTS.md.
- Update this document only through intentional product decisions.

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

- Do not scaffold screens that contradict the product bible.
- When adding features, reference the mission, academy, user role, and learning pillar.
- Flag any requested feature that conflicts with child safety or retention-first design.

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

## Key Risks

- Scope creep into full K–12 before MVP.
- Building a generic ed-tech dashboard without the thinking/retention engine.

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
