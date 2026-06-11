# 58 — Security Threat Model

## Purpose

Identifies security threats, risks, mitigations, and release-blocking safety requirements.


---

# V2 Implementation Expansion

## Document Status

- **Version:** 2.0
- **Readiness Target:** Codex-ready implementation guidance
- **Primary Dependency:** AGENTS.md, Product Bible, Core Pillars, MVP Scope
- **Core Learning Loop:** Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply

## V2 Improvements Added

- Adds threat categories.
- Adds risk scoring.
- Adds mitigations.
- Adds child-specific harms.
- Adds AI-specific threats.
- Adds pre-launch security checklist.

## What This Document Must Lock

- Child data exposure is a critical risk.
- Auth, authorization, logging, and AI tutor must be threat-modeled before launch.

## Implementation Requirements

- Threat model student data, parent links, teacher class access, lesson content, AI interactions, and analytics.
- Define mitigation and test for each high-risk threat.

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

- Add security review checklist to release process.
- Implement least privilege and secure defaults.

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

## Threat Register

| Threat | Risk | Mitigation |
|---|---|---|
| Student accesses another student profile | Critical | Role/RLS checks, route guards, API tests |
| Parent sees unrelated child | Critical | guardian_student_links enforced server-side |
| Teacher sees unassigned class | High | class enrollment checks |
| Sensitive student data in logs | High | redact logs, no raw student responses in error logs |
| AI tutor gives unsafe/inappropriate answer | High | policy, filters, evals, age-band prompts |
| XSS through lesson content | High | sanitize rendered Markdown/content |

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
