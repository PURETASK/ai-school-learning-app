# 13 — Gamification and Motivation

## Purpose

The platform should make learning engaging without becoming shallow or addictive.

Fun should support learning.

---

## Motivation Philosophy

Students should feel:

- progress
- competence
- autonomy
- curiosity
- purpose
- safety
- pride after improvement

Gamification should reward learning behaviors, not screen time.

---

## Rewardable Behaviors

Reward:

- skill mastery
- review completion
- mistake correction
- strong explanation
- evidence use
- project completion
- effort over time
- improvement after failure
- thoughtful discussion
- reflection
- challenge completion

---

## Non-Rewardable Behaviors

Do not reward:

- random clicking
- skipping explanations
- guessing quickly
- passive video watching
- login without learning
- racing through content
- leaderboard dominance over weaker students

---

## XP System

XP should come from meaningful learning actions.

Example XP events:

```txt
+10 Complete guided practice
+15 Complete retrieval check
+20 Correct mistake after feedback
+25 Use strong evidence
+30 Master skill
+40 Complete project milestone
+50 Finish spaced review streak
```

---

## Badge System

Badge examples:

- Evidence Builder
- Mistake Detective
- Memory Vault Keeper
- First-Principles Solver
- Critical Thinker
- Discussion Champion
- Project Finisher
- Review Streak

Badges should map to real behaviors.

---

## Streaks

Streaks should encourage healthy learning habits.

Avoid punishing students too harshly for missing one day.

Use:

- weekly learning streak
- review streak
- recovery streak
- comeback streak

---

## Quest System

Quests should frame learning as purpose.

Example:

```txt
Mission: Repair the Number Bridge
Skill: Arrays and multiplication
Task: Build equal groups
Assessment: Retrieval check
Reward: bridge restored + mastery progress
```

---

## Boss Battles

Boss battles are cumulative assessments.

Rules:

- include mixed review
- include old and new skills
- include explanation tasks
- unlock after preparation

---

## Skill Trees

Skill trees show prerequisite relationships.

Example:

```txt
Equal Groups → Arrays → Multiplication Facts → Word Problems → Multi-Step Problems
```

---

## Academy-Specific Motivation

### Foundation Academy

- stickers
- maps
- characters
- short quests
- visual celebrations

### Bridge Academy

- guilds
- skill trees
- missions
- titles
- lab challenges

### Scholar Academy

- course progress
- portfolio milestones
- certifications/badges
- capstones
- career pathways

---

## Anti-Addiction Design

Avoid:

- loot boxes
- endless scroll
- manipulative push notifications
- streak shame
- random reward loops

Use:

- clear stopping points
- healthy session design
- progress summary
- review reminder with parent controls


---

# V2 Implementation Expansion

## Document Status

- **Version:** 2.0
- **Readiness Target:** Codex-ready implementation guidance
- **Primary Dependency:** AGENTS.md, Product Bible, Core Pillars, MVP Scope
- **Core Learning Loop:** Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply

## V2 Improvements Added

- Adds reward economy rules.
- Adds anti-addiction principles.
- Adds grade-band motivation differences.
- Adds badge taxonomy.
- Adds XP event rules.
- Adds boss battle and quest ideas.

## What This Document Must Lock

- Do not reward empty screen time.
- Reward correction, persistence, evidence use, mastery, and review.

## Implementation Requirements

- Create XP event types.
- Use badges as milestone markers.
- Avoid public leaderboards for MVP.

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

- Implement rewards after mastery events exist.
- Use reward rules from this document, not ad hoc points.

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
