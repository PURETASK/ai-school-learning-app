# 19 — Tech Stack Decision

## Platform Choice

Build web-first.

Web-first is the best early path because it supports faster iteration, easier curriculum editing, easier dashboard testing, easier deployment, and later mobile expansion.

---

## Recommended Stack

```txt
Frontend: Next.js + TypeScript
Styling: Tailwind CSS
Database: PostgreSQL / Supabase
Auth: Supabase Auth or Clerk
Content: Markdown/JSON first
Database import later
Hosting: Vercel
Testing: Vitest + Playwright later
```

---

## Frontend

Use:

- Next.js
- TypeScript
- React components
- server/client boundaries where useful
- accessible semantic HTML

---

## Styling

Use:

- Tailwind CSS
- design tokens later
- reusable components
- grade-band visual variants

Avoid:

- one-off inline styling everywhere
- inaccessible color choices
- complex animation before core UX works

---

## Backend / Data

MVP can use local JSON/Markdown content plus lightweight app state.

Production should move toward:

- PostgreSQL
- Supabase or similar backend
- database migrations
- row-level security where possible
- role-based access

---

## Authentication

Candidates:

- Supabase Auth
- Clerk

MVP decision can be delayed until core lesson engine is ready, but data models should assume roles and linked student/parent accounts.

---

## Hosting

Preferred:

- Vercel for Next.js app

---

## Testing

Use:

- Vitest for utilities and engines
- Playwright for critical flows later

Critical tests:

- lesson progress
- quiz scoring
- mastery logic
- review scheduling
- role permissions
- dashboard calculations

---

## Dependency Rules

Do not add dependencies unless:

- the problem is real
- the dependency is maintained
- the dependency reduces complexity
- the dependency does not create security or performance issues

---

## Future Mobile Plan

Mobile can be built later with:

- responsive web first
- PWA consideration
- React Native / Expo later if needed

Do not build mobile first.


---

# V2 Implementation Expansion

## Document Status

- **Version:** 2.0
- **Readiness Target:** Codex-ready implementation guidance
- **Primary Dependency:** AGENTS.md, Product Bible, Core Pillars, MVP Scope
- **Core Learning Loop:** Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply

## V2 Improvements Added

- Adds architecture rationale.
- Adds dependency rules.
- Adds environment assumptions.
- Adds testing stack.
- Adds future mobile boundary.
- Adds integration notes for Supabase/Clerk/Vercel.

## What This Document Must Lock

- Next.js + TypeScript + Tailwind is default.
- Web-first, mobile later.
- Markdown/JSON content first, DB import later.

## Implementation Requirements

- Use strong typing.
- Keep UI/business/content logic separated.
- Do not add dependencies casually.

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

- Scaffold with Next.js TypeScript.
- Install Tailwind.
- Create src/features and content folders.

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
