# 07 — Standards Map

## Standards Philosophy

The platform should use a flexible standards-mapping system.

Do not hardcode the app to one state at the beginning. Use general standards-inspired tags first, then allow state-specific mapping later.

Standards should be stored as data and connected to lessons, skills, units, quizzes, and assessments.

---

## Reference Layers

| Area | Reference Layer |
|---|---|
| ELA / Reading | Common Core-style ELA |
| Math | Common Core-style Math |
| Science | NGSS-style science practices and content |
| Social Studies | C3-style inquiry, civics, economics, geography, history |
| Computer Science | CSTA-style K–12 CS concepts and practices |
| Arts | National Core Arts-style categories later |
| Health / PE | SHAPE-style health/PE categories later |
| SEL / Life Skills | CASEL-style competencies later |
| Career Readiness | college/career readiness categories |

---

## Standard Tag Format

Use readable internal tags.

Pattern:

```txt
SUBJECT.GRADE.DOMAIN.SKILL
```

Examples:

```txt
ELA.G3.RI.MAIN_IDEA
ELA.G3.RL.CHARACTER_TRAITS
MATH.G3.OA.MULTIPLICATION_ARRAYS
MATH.G6.RP.RATIOS
SCI.G6.EARTH_SYSTEMS.WATER_CYCLE
SS.G9.WORLD_HISTORY.CIVILIZATIONS
CS.G6.ALGORITHMS.DEBUGGING
```

---

## Thinking Skill Tags

Use separate tags for thinking skills.

Examples:

```txt
THINK.FIRST_PRINCIPLES.KNOWNS_UNKNOWNS
THINK.CRITICAL.ASSUMPTION_CHECK
THINK.EVIDENCE.CER
THINK.INTERPRETATION.PERSPECTIVE
THINK.METACOGNITION.REFLECTION
THINK.SYSTEMS.CAUSE_EFFECT
```

---

## ELA / Reading

Categories:

- foundational skills
- vocabulary
- comprehension
- literary text
- informational text
- evidence use
- grammar/language
- speaking/listening
- research

---

## Math

Categories:

- counting/cardinality
- operations/algebraic thinking
- number/base ten
- fractions
- ratios/proportions
- expressions/equations
- functions
- geometry
- measurement/data
- statistics/probability
- modeling

---

## Science

Categories:

- science and engineering practices
- life science
- earth and space science
- physical science
- engineering/technology
- crosscutting concepts

---

## Social Studies

Categories:

- inquiry
- civics
- economics
- geography
- history
- source analysis
- civic participation
- argument with evidence

---

## Computer Science

Categories:

- computing systems
- networks/internet
- data/analysis
- algorithms/programming
- impacts of computing
- abstraction
- debugging
- collaboration

---

## Future State-Specific Mapping

A future standards table should support:

```txt
internal_standard_id
source_framework
source_standard_code
state
grade_level
subject
description
related_lesson_ids
related_skill_ids
```

The internal tag remains stable even when state mappings change.


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

- Adds canonical tag format.
- Adds crosswalk strategy for future state-specific mapping.
- Adds validation rules for standards tags.
- Adds examples by academy and subject.
- Adds content-authoring rules.
- Adds reporting implications.

## What This Document Must Lock

- Use generic standards-style tags first; add state-specific mapping later.
- Lessons can map to multiple standards and multiple thinking skills.

## Implementation Requirements

- Define tag namespaces per subject.
- Do not hardcode standards logic into UI.
- Store standards as data that can be mapped and revised.

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

- Create standards seed file.
- Validate lesson standardsTags against allowed namespaces.
- Display standards in parent/teacher reports later.

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
