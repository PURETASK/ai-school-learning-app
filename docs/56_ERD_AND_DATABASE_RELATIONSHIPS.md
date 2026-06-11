# 56 — ERD and Database Relationships

## Purpose

Defines database relationships, cardinality, key constraints, and future ERD structure.


---

# V2 Implementation Expansion

## Document Status

- **Version:** 2.0
- **Readiness Target:** Codex-ready implementation guidance
- **Primary Dependency:** AGENTS.md, Product Bible, Core Pillars, MVP Scope
- **Core Learning Loop:** Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply

## V2 Improvements Added

- Adds relationship matrix.
- Adds many-to-many tables.
- Adds indexes and uniqueness constraints.
- Adds row-level security considerations.
- Adds content-file-to-database mapping.
- Adds future migration notes.

## What This Document Must Lock

- Types-first now; database later.
- Database model must preserve privacy boundaries and curriculum flexibility.

## Implementation Requirements

- Define user↔student guardian links, teacher↔class↔enrollment, lesson↔standards, lesson↔skills, progress↔student↔lesson.
- Plan RLS policies for Supabase.

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

- Create ERD notes before migrations.
- Do not write migrations until schema has been reviewed.

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

## Relationship Matrix

| Relationship | Type | Notes |
|---|---|---|
| users → student_profiles | 1:0..1 | Student may have auth account later; parent-created profile first. |
| users → guardian_student_links → student_profiles | many:many | Parent/guardian links to one or more students. |
| teachers → classes → enrollments → students | many:many | Phase 2. |
| courses → units → lessons | 1:many | Curriculum hierarchy. |
| lessons → lesson_standards → standards | many:many | Flexible mapping. |
| lessons → lesson_skills → skills | many:many | Skill mastery tracking. |
| students → lesson_progress → lessons | many:many | Completion/progress. |
| students → skill_mastery → skills | many:many | Mastery over time. |
| students → spaced_review_items | 1:many | Memory Vault. |

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
