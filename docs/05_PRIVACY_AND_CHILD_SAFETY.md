# 05 — Privacy and Child Safety

## Core Safety Philosophy

This platform serves children and students. Privacy and safety are product requirements, not optional polish.

The app should collect the minimum data necessary, restrict access by role, avoid public student exposure, and prevent unsafe communication patterns.

This document is not legal advice. A professional review is required before launch.

---

## Student Data Rules

Collect only what is needed for learning and account operation.

Potentially necessary:

- student display name or nickname
- grade level
- linked parent/guardian account
- lesson progress
- quiz attempts
- mastery records
- review schedule
- assignment submissions
- portfolio items

Avoid unless strictly required:

- full birth date
- precise location
- public profile information
- unnecessary photos/videos
- sensitive demographic data
- open-ended private personal disclosures

---

## Parent / Guardian Rules

Parents/guardians should be able to:

- create or approve child accounts
- view linked child progress
- review mastery reports
- manage child privacy settings
- request data export/deletion later
- control communication settings

Parents/guardians should not see unrelated students.

---

## Teacher Access Rules

Teachers should only see:

- classes assigned to them
- students enrolled in those classes
- assignments they manage
- relevant progress and submissions

Teachers should not access unrelated families or platform-wide admin tools.

---

## School Admin Rules

School admins can manage school-level users/classes where applicable, but should not casually access private student learning records without a legitimate role-based reason.

---

## Platform Admin Rules

Platform admins need elevated permissions, but admin access should still be logged and scoped.

Rules:

- no casual browsing of student data
- audit sensitive admin actions
- least privilege for internal tools
- no sensitive data in logs

---

## Communication Restrictions

The MVP should not include open communication features.

Avoid:

- unrestricted chat
- random direct messages
- public student profiles
- public comments
- open social feeds
- public leaderboards for children

Safer future communication progression:

```txt
K–2: AI-guided simple response practice
3–5: sentence-frame discussion prompts
6–8: moderated class discussion
9–12: teacher-controlled debate, peer review, presentations
```

---

## AI Tutor Safety

The AI tutor must:

- guide, not simply answer
- use hints before final explanations
- explain at grade level
- avoid adult themes for younger students
- avoid collecting unnecessary personal information
- never pretend to be a human teacher
- never guarantee grades, diagnoses, or official placements
- flag unsafe content
- keep parent/teacher visibility where appropriate

---

## No Public Profiles Policy

Students should not have public profile pages in the MVP.

Student identity should be private and scoped to:

- the student
- linked parent/guardian
- assigned teacher/class if applicable
- necessary admin systems

---

## No Behavioral Ads for Children

Do not design behavioral advertising, ad targeting, or data monetization around children.

---

## Data Deletion and Export

Future system should support:

- parent request for child data export
- parent request for deletion
- school data export process
- retention policy by data type
- audit trail of deletion requests

---

## Logging Rules

Do not log:

- student private messages
- unnecessary personal information
- auth tokens
- full sensitive profile payloads
- unredacted child data

Log only what is necessary for debugging, security, and learning analytics.

---

## Compliance Reference Notes

- COPPA applies to online services directed to children under 13 or services that knowingly collect personal information from children under 13.
- FERPA matters when handling student education records in covered school contexts.
- State student data privacy laws may also apply.
- A legal/compliance review is required before public launch.


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

- Adds data-classification categories.
- Adds release-blocking safety checks.
- Adds consent-flow dependencies.
- Adds communication safety rules.
- Adds logging restrictions.
- Adds incident-response handoff notes.

## What This Document Must Lock

- No public student profiles.
- No unrestricted student chat or random DMs.
- Minimum necessary student data only.
- Parents see only linked children; teachers see only assigned students/classes.

## Implementation Requirements

- Define data collection purpose per field.
- Use role-based access from first implementation.
- Do not log sensitive student content in plaintext.
- Create delete/export plan before launch.

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

- Add access-control guards to protected routes.
- Annotate student data fields by sensitivity.
- Do not introduce social features without safety spec and moderation plan.

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

- Accidental exposure of student progress.
- Overcollection of child data.
- AI tutor collecting unnecessary personal details.

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
