# 02 — Core Pillars

## Purpose

This document defines the permanent educational pillars of the K–12 Learning App Suite. Every lesson, feature, dashboard, quiz, data model, and curriculum decision should trace back to these pillars.

---

## Pillar 1: Standards-Aligned Curriculum

### Definition

Lessons map to normal school subjects, grade-level expectations, academic skills, and future state-specific standards.

### Implementation

- Every lesson has grade, subject, course/unit, standards tags, and skill tags.
- Standards are stored as data, not hardcoded business logic.
- The MVP uses general standard categories before adding state-specific mappings.

### Measurement

- Standards coverage reports
- Skill mastery by subject
- Grade-level readiness indicators

### Avoid

- Random lessons with no curriculum hierarchy
- One-state-only hardcoding too early
- Standards tags that exist only as decoration

---

## Pillar 2: First-Principles Problem Solving

### Definition

Students learn to break problems into basic truths, known facts, unknowns, constraints, rules, and step-by-step reasoning.

### Implementation

- First-Principles Breakdown in every major lesson
- Problem-Solving Lab
- Knowns/unknowns fields in problem tasks
- Answer-check prompts

### Measurement

- Problem-Solving Score
- Explanation quality
- Correct strategy selection
- Error-checking behavior

### Avoid

- Teaching only formula memorization
- Rewarding final answers without reasoning

---

## Pillar 3: Critical Thinking

### Definition

Students question, compare, evaluate, detect weak logic, identify assumptions, and improve answers.

### Implementation

- Critical Thinking Checkpoints
- “What else could explain this?” prompts
- Strongest/weakest answer comparisons
- Assumption checks

### Measurement

- Critical Thinking Score
- Quality of explanations
- Ability to reject weak evidence or weak logic

### Avoid

- Multiple-choice only
- “Because I said so” answer explanations

---

## Pillar 4: Discussion & Academic Dialogue

### Definition

Students learn to explain ideas, respond respectfully, debate, listen, and revise thinking.

### Implementation

- Sentence frames
- Structured discussion prompts
- Teacher/parent controls
- AI-guided dialogue practice first
- Moderated class discussion later

### Measurement

- Discussion Score
- Use of evidence
- Respectful response patterns
- Revision after new information

### Avoid

- Unrestricted chat
- Random direct messages
- Public student profiles

---

## Pillar 5: Interpretation

### Definition

Students analyze meaning, context, perspective, symbols, data, sources, maps, charts, art, media, and author intent.

### Implementation

- Interpretation Lens feature
- Text Lens, Data Lens, History Lens, Science Lens, Media Lens
- Source/context questions
- Perspective prompts

### Measurement

- Interpretation Score
- Ability to identify context and meaning
- Ability to distinguish literal meaning from implied meaning

### Avoid

- Treating reading/history/data as answer-hunting only

---

## Pillar 6: Evidence-Based Reasoning

### Definition

Students support claims with text evidence, facts, data, observations, examples, and logic.

### Implementation

- Claim → Evidence → Reasoning tasks
- Evidence Room
- Evidence sorting
- Source-based questions
- “Show your proof” prompts

### Measurement

- Evidence Score
- Relevance of evidence
- Strength of reasoning connection

### Avoid

- Accepting unsupported opinions as complete answers

---

## Pillar 7: Metacognition

### Definition

Students learn to plan, monitor, evaluate, and improve their learning.

### Implementation

- Think Check
- Learning Planner
- Reflection prompts
- Mistake Journal

### Measurement

- Reflection Score
- Strategy selection
- Self-correction behavior
- Review compliance

### Avoid

- Treating mistakes as final failure instead of learning data

---

## Pillar 8: Retrieval + Spaced Retention

### Definition

Students repeatedly recall information across time so learning sticks.

### Implementation

- Retrieval Checks
- Memory Vault
- Day 1 / Day 3 / Day 7 / Day 14 / Day 30 review schedule
- Mixed review

### Measurement

- Retention Score
- Review accuracy
- Time between successful recalls
- Review completion rate

### Avoid

- One-and-done lessons
- Completion without future review

---

## Pillar 9: Inquiry-Based Learning

### Definition

Students ask questions, investigate, observe, test, and explain.

### Implementation

- Inquiry Quests
- Predictions
- Observations
- Evidence collection
- Explanation tasks

### Measurement

- Inquiry quality
- Question formation
- Evidence-to-conclusion reasoning

### Avoid

- Science/social studies as fact memorization only

---

## Pillar 10: Computational + Systems Thinking

### Definition

Students decompose problems, recognize patterns, abstract, debug, model systems, and analyze cause/effect.

### Implementation

- Debugging Arena
- Systems Mapper
- Algorithm activities
- Cause/effect maps
- Input-output models

### Measurement

- Debugging accuracy
- System relationship accuracy
- Algorithm explanation quality

### Avoid

- Coding as syntax-only instruction
- Isolated facts with no relationships

---

## Pillar 11: Project-Based Application

### Definition

Students apply learning in real outputs: writing, presentations, experiments, designs, code, research, and capstones.

### Implementation

- Capstone Missions
- Unit projects
- Portfolio
- Rubrics

### Measurement

- Project Score
- Rubric performance
- Evidence of transfer/application

### Avoid

- Quizzes as the only proof of learning

---

## Pillar 12: Adaptive Mastery + Feedback

### Definition

The app changes reteach, challenge, and review paths based on performance.

### Implementation

- Mastery Engine
- Feedback Engine
- Reteach paths
- Challenge paths
- Intervention flags

### Measurement

- Mastery bands
- Growth over time
- Reteach success rate

### Avoid

- Same path for every student
- Generic “wrong” feedback

---

## Pillar 13: Fun + Motivation

### Definition

Game systems motivate learning behavior without becoming addictive or shallow.

### Implementation

- XP
- badges
- quests
- skill trees
- boss battles
- mastery unlocks
- progress celebrations

### Measurement

- learning engagement
- review completion
- persistence after mistakes
- improvement over time

### Avoid

- rewards for mindless clicking
- leaderboards that shame weaker students
- loot-box mechanics

---

## Pillar 14: Accessibility + Inclusive Learning

### Definition

Content and UX work for different learners, reading levels, abilities, devices, and support needs.

### Implementation

- semantic HTML
- contrast
- keyboard access
- read-aloud support
- captions/transcripts
- alt text
- simple language
- multiple ways to respond

### Measurement

- accessibility checks
- usability tests
- successful keyboard navigation
- readable grade-band UX

### Avoid

- tiny buttons
- flashing effects
- color-only signals
- text overload for young students

---

## Pillar 15: Safe Child-Centered Design

### Definition

Privacy, safety, restricted communication, and parent/teacher controls are built in from day one.

### Implementation

- role-based access
- no unrestricted chat
- no random DMs
- no public profiles for kids
- minimum data collection
- safe AI tutor behavior

### Measurement

- permission tests
- data access audits
- moderation logs
- privacy review

### Avoid

- social-first design
- behavioral ads for children
- exposing private data in logs


---

# V2 Implementation Expansion

## Document Status

- **Version:** 2.0
- **Readiness Target:** Codex-ready implementation guidance
- **Primary Dependency:** AGENTS.md, Product Bible, Core Pillars, MVP Scope
- **Core Learning Loop:** Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply

## V2 Improvements Added

- Adds implementation patterns for each pillar.
- Adds measurement rules for pillar-level progress.
- Adds anti-patterns for each pillar.
- Links pillars to named features such as Memory Vault and Evidence Room.
- Clarifies that pillars are product requirements, not motivational slogans.
- Adds review checklist for new feature proposals.

## What This Document Must Lock

- All lessons must support multiple pillars, not only content coverage.
- First-principles, critical thinking, interpretation, discussion, and evidence reasoning are equal-status pillars.
- Safe child-centered design is a product pillar, not just a legal note.

## Implementation Requirements

- Every feature spec should state which pillars it serves.
- Every lesson should include standards tags and thinking skill tags.
- Dashboards should eventually report both content mastery and thinking growth.

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

- Add pillar tags to feature cards and curriculum schemas.
- Reject passive lesson flows that omit retrieval, feedback, or thinking tasks.
- When generating curriculum, include pillar coverage notes.

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
