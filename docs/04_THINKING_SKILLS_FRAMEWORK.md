# 04 — Thinking Skills Framework

## Purpose

This document defines how the app teaches students how to think.

The platform should not only deliver academic content. It should develop reasoning, interpretation, discussion, evidence use, reflection, and problem-solving habits.

---

## Core Student Thinking Loop

```txt
1. What am I trying to solve?
2. What do I know?
3. What do I need to find out?
4. What smaller parts can I break this into?
5. What rule, pattern, system, or relationship matters?
6. What evidence supports my answer?
7. What could be wrong with my thinking?
8. Can I explain it clearly?
9. Can I discuss or defend it respectfully?
10. What will I do differently next time?
```

---

## First-Principles Thinking

Students learn to break ideas into foundational truths.

### Student Questions

- What is the problem really asking?
- What do I know for sure?
- What are the smallest parts?
- What rule applies?
- What assumption should I avoid?
- How can I rebuild the answer step by step?

### Feature

**Problem-Solving Lab**

---

## Critical Thinking

Students learn to question, compare, evaluate, and avoid shallow answers.

### Student Questions

- Is this true?
- How do I know?
- What information is missing?
- What assumption am I making?
- What else could explain this?
- Which answer is strongest and why?

### Feature

**Critical Thinking Checkpoint**

---

## Evidence-Based Reasoning

Students learn that strong answers require proof.

### Structure

```txt
Claim → Evidence → Reasoning
```

### Student Questions

- What is my claim?
- What evidence supports it?
- Is the evidence strong or weak?
- How does the evidence prove the claim?
- What counterargument exists?

### Feature

**Evidence Room**

---

## Interpretation

Students learn to understand meaning below the surface.

### Lenses

- Text Lens
- Data Lens
- History Lens
- Science Lens
- Art Lens
- Media Lens
- Perspective Lens
- Cause-and-Effect Lens

### Student Questions

- What does this mean?
- Who created this?
- Why was it created?
- What context matters?
- What is implied?
- What perspective is missing?

### Feature

**Interpretation Lens**

---

## Academic Discussion

Students learn to explain, listen, respond, and revise thinking.

### Sentence Frames

- I think ___ because ___.
- I agree because ___.
- I disagree because ___.
- The evidence shows ___.
- Another possibility is ___.
- I changed my mind because ___.

### Feature

**Discussion Arena**

### Safety Rule

No unrestricted public chat, random direct messages, or public student profiles for younger learners.

---

## Metacognition

Students learn to plan, monitor, and evaluate their own thinking.

### Feature

**Think Check**

Before:

- What do I already know?
- What strategy will I use?

During:

- Am I stuck?
- What step am I on?

After:

- What worked?
- What mistake did I fix?

---

## Inquiry Thinking

Students learn to ask questions, investigate, observe, and explain.

### Flow

```txt
Question → Prediction → Investigation → Evidence → Explanation
```

### Feature

**Inquiry Quest**

---

## Computational Thinking

Students learn to decompose, recognize patterns, abstract, create algorithms, test, and debug.

### Feature

**Debugging Arena**

Use debugging beyond code:

- math mistakes
- sentence errors
- science explanations
- history timelines
- logic puzzles

---

## Systems Thinking

Students learn how parts interact in a larger whole.

### Questions

- What are the parts?
- How do they connect?
- What causes what?
- What changes if one part changes?
- What feedback loop exists?

### Feature

**Systems Mapper**

---

## Creative Constraint Thinking

Students solve problems with rules and limits.

### Questions

- What resources do I have?
- What constraints exist?
- What can I change?
- What can I not change?
- What is the simplest workable solution?

---

## Reflection and Error Analysis

Students learn from mistakes.

### Feature

**Mistake Journal**

Mistake categories:

- misread question
- wrong operation
- weak evidence
- skipped step
- careless calculation
- vocabulary gap
- guessed too fast
- misunderstood concept

---

## Grade-Band Development

### K–5

Use visual, simple, guided thinking:

- What do I see?
- What do I know?
- What should I try?
- What happened?

### 6–8

Use structured reasoning:

- define problem
- knowns/unknowns
- strategy choice
- evidence
- explanation

### 9–12

Use advanced reasoning:

- assumptions
- constraints
- variables
- source credibility
- counterargument
- defense of reasoning


---

# V2 Implementation Expansion

## Document Status

- **Version:** 2.0
- **Readiness Target:** Codex-ready implementation guidance
- **Primary Dependency:** AGENTS.md, Product Bible, Core Pillars, MVP Scope
- **Core Learning Loop:** Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply

## V2 Improvements Added

- Adds thinking-skill taxonomy.
- Adds grade-band progression for each thinking skill.
- Adds UI modules for thinking features.
- Adds scoring categories.
- Adds teacher/parent reporting implications.
- Adds implementation sequencing for thinking modules.

## What This Document Must Lock

- Problem-Solving Lab, Evidence Room, Interpretation Lens, Mistake Journal, and Thinking Cards are core product modules.
- Discussion starts structured and safe; unrestricted chat is not MVP.

## Implementation Requirements

- Use the ten-step student thinking loop in lesson prompts.
- Tag activities with thinkingSkillTags.
- Create reusable components for thinking prompts rather than hardcoding per lesson.

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

- Add shared types for ThinkingPrompt, EvidenceTask, InterpretationTask, DiscussionPrompt, and MistakeType.
- Build thinking features after the core lesson/quiz/mastery engine.

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
