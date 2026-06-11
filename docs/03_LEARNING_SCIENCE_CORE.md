# 03 — Learning Science Core

## Core Belief

The program should be built around **fun plus memory plus thinking**.

The app must not rely on passive videos, random worksheets, or empty gamification. Each lesson should require students to actively think, retrieve, practice, explain, reflect, and apply.

---

## Core Learning Methods

| Method | Why It Matters | Product Implementation |
|---|---|---|
| Retrieval practice | Students remember more when they actively recall information | Retrieval Checks, low-stakes quizzes, explain-it-back prompts |
| Spaced practice | Learning sticks better when review is distributed over time | Memory Vault schedule: Day 1, 3, 7, 14, 30 |
| Active learning | Students learn by doing, not just receiving | Sorting, solving, building, debugging, explaining |
| Interleaving | Students learn when to use strategies by mixing related skills | Mixed practice and boss battles |
| Feedback | Students need specific correction and next steps | Feedback Engine and Reteach Paths |
| Metacognition | Students learn to plan, monitor, and evaluate | Think Check and Reflection prompts |
| Guided play | Younger learners benefit from purposeful play | K–5 mission games and manipulatives |
| Project-based learning | Students transfer knowledge to real outputs | Unit projects and Capstone Missions |
| Visible thinking routines | Repeatable routines help students build thinking habits | Thinking Cards and Interpretation Lens |
| Cognitive load control | Novices need clear examples and manageable chunks | Mini Teach, Worked Example, Guided Practice |
| Gamification | Motivation works when rewards support real learning | XP, badges, quests, skill trees tied to mastery |

---

## Retrieval Practice

### Product Rule

Students should not complete lessons by only watching or reading.

Every lesson should include:

- recall questions
- short quizzes
- explain-it-back prompts
- cumulative review
- mixed old/new recall
- Memory Vault item creation

### Example

```txt
Bad:
Watch video → click next → earn badge

Good:
Mini Teach → Guided Practice → Recall without hints → Explain why → Feedback → Memory Vault review
```

---

## Spaced Practice

### Product Rule

Every skill must return later.

Default review schedule:

```txt
Day 0: learn
Day 1: quick recall
Day 3: practice again
Day 7: mixed review
Day 14: application
Day 30: mastery check
```

---

## Active Learning

### Product Rule

Every lesson needs a student action beyond reading.

Examples:

| Subject | Active Task |
|---|---|
| Reading | Find evidence, sequence events, explain theme |
| Math | Solve, model, compare strategies |
| Science | Predict, simulate, classify, explain |
| Social Studies | Analyze source, map events, compare perspectives |
| Writing | Revise paragraph, strengthen evidence |
| Computer Science | Debug, reorder steps, build simple algorithm |

---

## Interleaving

### Product Rule

After initial instruction, practice should mix:

```txt
new skill + prior skill + similar-looking distractor skill
```

This prevents students from blindly repeating one procedure without understanding.

---

## Feedback

### Product Rule

Never show only “wrong.”

Useful feedback should include:

1. What was incorrect
2. Why it was incorrect
3. The correct reasoning step
4. A similar retry opportunity
5. Reteach or review recommendation

---

## Metacognition

### Product Rule

Students should plan, monitor, and evaluate.

Use Think Check:

Before:

- What do I already know?
- What strategy will I use?

During:

- What step am I on?
- Am I stuck?
- Do I need a hint?

After:

- What worked?
- What mistake did I fix?
- What should I review?

---

## Guided Play

### Product Rule for Foundation Academy

Play must serve learning.

Examples:

- phonics monster sorting sounds
- multiplication bridge building
- science garden simulation
- community helper map
- story repair writing game

---

## Project-Based Learning

### Product Rule

Every unit should eventually have an application project.

Project types:

- storybook
- model
- museum exhibit
- science investigation
- research report
- debate
- app prototype
- business plan
- capstone presentation

---

## Visible Thinking Routines

### Product Rule

Reusable Thinking Cards should be built into lessons.

Examples:

- See → Think → Wonder
- Claim → Evidence → Reasoning
- I Used to Think → Now I Think
- Connect → Extend → Challenge
- Parts → Purposes → Complexities

---

## Cognitive Load Control

### Product Rule

Use gradual release:

```txt
I Do → We Do → You Do → Mixed Review
```

Do not overload young or novice learners with long text walls, too many buttons, or too many new concepts at once.

---

## Gamification Done Correctly

### Reward

- mastery
- review completion
- mistake correction
- strong reasoning
- evidence use
- project completion
- effort over time

### Do Not Reward

- random clicking
- guessing fast
- skipping explanations
- passive video watching
- login with no learning


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

- Adds method-to-feature mapping.
- Adds retention and active-learning requirements.
- Adds cognitive-load design constraints by grade band.
- Adds evidence-quality notes so weak gamification is rejected.
- Adds lesson-engine implications for Codex.
- Adds measurement hooks for analytics.

## What This Document Must Lock

- Practice testing/retrieval and spacing are core mechanics.
- Students must do active work in every lesson.
- Gamification must reward learning behaviors, not screen time.

## Implementation Requirements

- Build Retrieval Check and Memory Vault into MVP.
- Use worked examples before independent practice.
- Include feedback explanations for incorrect answers.
- Keep lesson chunks short and grade-appropriate.

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

- Implement retrieval questions as first-class lesson sections.
- Create spaced review records when a skill is learned.
- Add “explain your thinking” prompts where appropriate.

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
