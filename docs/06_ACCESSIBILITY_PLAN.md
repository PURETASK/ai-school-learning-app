# 06 — Accessibility Plan

## Accessibility Target

Target WCAG 2.2 AA-style accessibility practices from the beginning.

The app should also use Universal Design for Learning principles so different learners can access, engage with, and express understanding in multiple ways.

---

## Visual Accessibility

Requirements:

- readable contrast
- scalable text
- no tiny text in lesson UI
- avoid text over busy images
- do not use color as the only signal
- support light/dark modes later if feasible
- clear error messages

---

## Keyboard Navigation

Requirements:

- all interactive controls reachable by keyboard
- visible focus states
- logical tab order
- no keyboard traps
- skip links for dense pages later
- forms usable without mouse

---

## Screen Reader Support

Requirements:

- semantic HTML
- heading hierarchy
- labels for form fields
- ARIA only where semantic HTML is insufficient
- alt text for meaningful images
- empty alt for decorative images
- status messages announced when needed

---

## Captions and Transcripts

If videos or audio are added later:

- captions required
- transcripts required
- audio-only content must have text alternative
- read-aloud support should not be the only way to consume content

---

## Text Scaling

UX should remain usable when browser text size increases.

Avoid fixed-height containers that clip text.

---

## Cognitive Accessibility

Lessons should use:

- short sections
- clear headings
- predictable flow
- simple language for younger learners
- examples before independent practice
- one primary action at a time
- progress indicators
- low-distraction layouts

---

## Young Learner Design

K–5 UX should use:

- large tap targets
- simple choices
- read-aloud support
- visual examples
- minimal text walls
- clear next-step buttons
- friendly but not chaotic animation

---

## Color and Contrast Rules

- Color cannot be the only state indicator.
- Add icons/text for correct/incorrect/review/locked/mastered.
- Use contrast checks for text and controls.

---

## Motion and Animation

Avoid:

- flashing animation
- intense motion
- autoplay distractions
- rewards that block learning flow

Allow:

- subtle success animations
- optional reduced-motion support
- calm transitions

---

## Accessibility Testing Checklist

Before release, test:

- keyboard-only lesson completion
- screen reader labels on forms
- contrast on dashboards
- quiz error states
- focus states
- responsive layout
- text scaling
- color-independent statuses
- no flashing effects


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

- Adds grade-band accessibility rules.
- Adds component-level requirements.
- Adds keyboard/screen-reader testing checklist.
- Adds cognitive accessibility guidance.
- Adds content readability rules.
- Adds release gates for accessibility.

## What This Document Must Lock

- Accessibility is required from MVP, not after launch.
- Color alone must never carry state.
- Foundation Academy needs additional visual/audio support.

## Implementation Requirements

- Use semantic HTML and labeled controls.
- Maintain visible focus states.
- Support text scaling and large tap targets.
- Avoid flashing/strobing animation.

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

- Build accessible UI primitives first.
- Add aria labels where necessary but prefer semantic HTML.
- Include accessibility notes in lesson metadata.

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
