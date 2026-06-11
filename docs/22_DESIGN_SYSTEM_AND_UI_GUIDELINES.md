# Design System and UI Guidelines

## Purpose

Define the visual and interaction system for the K–12 learning app suite so Foundation Academy, Bridge Academy, and Scholar Academy feel related but age-appropriate.

## Design Philosophy

The UI must support learning, not distract from it. Visual design should reduce cognitive load, make progress visible, and guide students toward the next meaningful action.

## Parent Platform Identity

- Parent platform should feel trustworthy, modern, safe, and education-focused.
- Shared UI tokens should create consistency across all academies.
- Each academy can have its own theme layer, but core components remain reusable.

## Academy Visual Rules

### Foundation Academy — K–5

- Bright, friendly, high-clarity UI.
- Large cards and buttons.
- Minimal menu depth.
- Read-aloud and icon support.
- Gentle reward animations.
- No dense dashboards.

### Bridge Academy — 6–8

- Quest-map and skill-tree feel.
- More mature color palette than elementary.
- Clear daily mission structure.
- Uses badges, levels, and guild-style academic identity.

### Scholar Academy — 9–12

- Course dashboard and portfolio feel.
- Professional but not boring.
- Transcript-style progress.
- Strong support for projects, essays, labs, and career pathways.

## Core Design Tokens

Document later in code as CSS variables or Tailwind theme values:

- Color tokens
- Typography tokens
- Spacing tokens
- Border radius tokens
- Shadow tokens
- Motion tokens
- Status colors
- Mastery colors
- Alert colors

## Component Inventory

MVP components:

- App shell
- Academy selector
- Lesson card
- Unit card
- Progress bar
- Mastery badge
- Quiz option card
- Feedback panel
- Memory Vault card
- Dashboard stat card
- Parent report card
- Empty state card
- Error state card
- Primary/secondary buttons
- Modal/dialog
- Form field

## Accessibility Requirements

- Keyboard navigable components.
- Visible focus states.
- Color cannot be the only signal.
- Avoid tiny click targets.
- Support screen-reader labels.
- Avoid flashing or overstimulating animation.

## Implementation Notes for Codex

- Create reusable UI primitives before building many screens.
- Do not hardcode academy colors inside page components.
- Keep UI components separate from learning/business logic.
- Use semantic HTML.

---

## Definition of Done

This document is usable when:

- The purpose is clear.
- MVP requirements are separated from later-phase requirements.
- Required screens, data, permissions, and edge cases are identified.
- Codex can implement from it without inventing product rules.
- Safety, accessibility, and learning-pillar impacts are considered.


---

# V2 Implementation Expansion

## Document Status

- **Version:** 2.0
- **Readiness Target:** Codex-ready implementation guidance
- **Primary Dependency:** AGENTS.md, Product Bible, Core Pillars, MVP Scope
- **Core Learning Loop:** Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply

## V2 Improvements Added

- Adds MVP versus later-phase boundary.
- Adds user-role implications.
- Adds data dependencies.
- Adds accessibility and safety checks.
- Adds empty/error state expectations.
- Adds acceptance criteria Codex can execute against.

## What This Document Must Lock

- Must align with the saved product loop and core pillars.
- Must not introduce features that bypass child safety or role permissions.
- Must support Grade 3/6/9 MVP before expansion.

## Implementation Requirements

- State screens/components needed.
- List data required and source of truth.
- Define permissions and user states.
- Add validation and QA criteria.
- Define color/token strategy for three academies.
- Build reusable UI primitives before pages.
- Document component variants: lesson card, quiz option, feedback panel, mastery badge, dashboard stat card.

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

- Use this document before implementing related feature code.
- Create typed models/components based on the requirements.
- Add TODOs for later-phase items rather than mixing them into MVP.

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
