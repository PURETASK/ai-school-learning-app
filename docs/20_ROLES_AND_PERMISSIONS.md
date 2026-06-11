# 20 — Roles and Permissions

## Purpose

This document defines access control.

The app serves children, so role boundaries must be strict.

---

## Roles

```txt
Student
Parent / Guardian
Teacher
School Admin
Platform Admin
Content Creator
Curriculum Reviewer
```

---

## Student Permissions

Can:

- view assigned/current lessons
- complete lessons
- answer quizzes
- view own progress
- complete reviews
- earn badges
- submit projects later

Cannot:

- view other students’ private data
- message random users
- create public profile
- access admin tools
- modify curriculum

---

## Parent / Guardian Permissions

Can:

- view linked child progress
- manage child account settings
- view weak/strong skills
- view review consistency
- request data export/deletion later

Cannot:

- view unrelated students
- access teacher-only class data
- modify global curriculum

---

## Teacher Permissions

Can:

- view assigned classes
- view assigned student progress
- assign lessons later
- review submissions later
- moderate class discussion later

Cannot:

- view unrelated classes
- access platform admin tools
- casually browse all student data

---

## School Admin Permissions

Can:

- manage school users/classes later
- view school-level reports
- assign teachers to classes

Cannot:

- edit global platform code/curriculum unless granted
- bypass privacy expectations

---

## Platform Admin Permissions

Can:

- manage platform settings
- manage global content systems
- manage users when necessary
- perform support actions

Must:

- follow audit logging
- use least privilege
- avoid casual student-data browsing

---

## Content Creator Permissions

Can:

- create draft lessons
- create units
- create quizzes
- add standards/thinking tags

Cannot:

- publish without review if workflow requires
- view student private data

---

## Curriculum Reviewer Permissions

Can:

- review content
- approve/reject content
- comment on curriculum quality
- check standards alignment

Cannot:

- view unnecessary student data

---

## Permission Matrix

| Action | Student | Parent | Teacher | School Admin | Platform Admin | Content Creator | Reviewer |
|---|---|---|---|---|---|---|---|
| Complete lesson | Yes | No | No | No | Test only | No | No |
| View own progress | Yes | No | No | No | Support only | No | No |
| View linked child | No | Yes | No | No | Support only | No | No |
| View assigned class | No | No | Yes | Yes | Support only | No | No |
| Edit draft content | No | No | No | No | Yes | Yes | Yes |
| Publish content | No | No | No | No | Yes | Maybe | Yes |
| Manage roles | No | No | No | Limited | Yes | No | No |

---

## Data Access Rules

- Parents see only linked children.
- Teachers see only assigned students/classes.
- Students do not see private data of other students.
- Admin access should be logged.
- No public student profiles in MVP.
- No unrestricted communication.


---

# V2 Implementation Expansion

## Document Status

- **Version:** 2.0
- **Readiness Target:** Codex-ready implementation guidance
- **Primary Dependency:** AGENTS.md, Product Bible, Core Pillars, MVP Scope
- **Core Learning Loop:** Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply

## V2 Improvements Added

- Adds permission matrix requirements.
- Adds data access boundaries.
- Adds role-specific dashboards.
- Adds future admin/content roles.
- Adds safety restrictions.
- Adds testing rules for permissions.

## What This Document Must Lock

- Parents see only linked children.
- Teachers see only assigned classes/students.
- Students cannot access other students’ private data.

## Implementation Requirements

- Define Student, Parent/Guardian, Teacher, School Admin, Platform Admin, Content Creator, Curriculum Reviewer.
- Use role guards in routes and APIs.

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

- Add role types and permission helpers.
- Test access denials as much as access approvals.

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
