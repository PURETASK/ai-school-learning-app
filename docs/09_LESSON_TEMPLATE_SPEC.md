# 09 — Lesson Template Specification

## Purpose

This document defines the universal lesson structure.

Every lesson should teach content, develop thinking, check understanding, give feedback, schedule review, and branch into reteach or challenge paths.

---

## Required Lesson Flow

```txt
1. Hook
2. Learning Goal
3. Mini Teach
4. First-Principles Breakdown
5. Worked Example
6. Guided Practice
7. Critical Thinking Checkpoint
8. Evidence-Based Reasoning Task
9. Interpretation / Discussion Task
10. Active Practice
11. Retrieval Check
12. Feedback
13. Mastery Score
14. Spaced Review Scheduling
15. Reflection
16. Reteach or Challenge Path
```

---

## Required Metadata

```ts
type Lesson = {
  id: string;
  title: string;
  academy: "foundation" | "bridge" | "scholar";
  gradeLevel: string;
  subject: string;
  course?: string;
  unit: string;
  lessonNumber: number;
  estimatedMinutes: number;
  learningObjective: string;
  essentialQuestion: string;
  standardsTags: string[];
  thinkingSkillTags: string[];
  vocabularyTerms: string[];
  prerequisites: string[];
  hook: string;
  miniTeach: string;
  firstPrinciplesBreakdown: FirstPrinciplesBreakdown;
  workedExample: string;
  guidedPractice: Activity[];
  criticalThinkingCheckpoint: ThinkingPrompt[];
  evidenceTask: EvidenceTask;
  interpretationTask?: InterpretationTask;
  discussionPrompt?: DiscussionPrompt;
  activePractice: Activity[];
  retrievalCheck: QuizQuestion[];
  quiz: QuizQuestion[];
  feedbackRules: FeedbackRule[];
  masteryThreshold: number;
  spacedReviewSchedule: ReviewSchedule;
  reteachPath: string[];
  challengePath: string[];
  reflectionPrompt: string;
  parentTeacherNotes: string;
  accessibilityNotes: string;
};
```

---

## First-Principles Breakdown

```ts
type FirstPrinciplesBreakdown = {
  coreConcept: string;
  smallestParts: string[];
  knownFacts: string[];
  unknowns: string[];
  constraints: string[];
  rulesOrPatterns: string[];
  assumptionsToAvoid: string[];
  stepByStepRebuild: string[];
  answerCheck: string[];
};
```

---

## Activity Model

```ts
type Activity = {
  id: string;
  type:
    | "multiple_choice"
    | "short_answer"
    | "sort"
    | "match"
    | "sequence"
    | "model"
    | "source_analysis"
    | "evidence_sort"
    | "discussion"
    | "reflection"
    | "project_step";
  prompt: string;
  instructions: string;
  expectedResponse?: string;
  choices?: string[];
  feedback?: FeedbackRule[];
  skillTags: string[];
};
```

---

## Quiz Question Model

```ts
type QuizQuestion = {
  id: string;
  questionText: string;
  questionType:
    | "multiple_choice"
    | "short_answer"
    | "explain"
    | "select_evidence"
    | "order_steps";
  choices?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  skillTag: string;
  standardTag: string;
  thinkingSkillTag?: string;
};
```

---

## Feedback Rule Model

```ts
type FeedbackRule = {
  condition: string;
  message: string;
  hint?: string;
  reteachRecommendation?: string;
  reviewRecommendation?: string;
};
```

---

## Review Schedule Model

```ts
type ReviewSchedule = {
  initialReview: "day_1";
  followUps: ("day_3" | "day_7" | "day_14" | "day_30")[];
};
```

---

## Lesson Acceptance Criteria

A lesson is complete only if it includes:

- grade, subject, unit
- learning objective
- standards tags
- thinking skill tags
- first-principles breakdown
- guided practice
- retrieval check
- quiz or assessment
- feedback rules
- mastery threshold
- spaced review schedule
- reteach/challenge path
- accessibility notes

---

## Bad Lesson Example

```txt
Read paragraph → answer one multiple choice question → earn badge
```

This is not acceptable.

---

## Good Lesson Example

```txt
Hook → goal → teach → breakdown → example → guided practice → evidence task → retrieval → feedback → mastery → review scheduled
```


---

# V2 Implementation Expansion

## Document Status

- **Version:** 2.0
- **Readiness Target:** Codex-ready implementation guidance
- **Primary Dependency:** AGENTS.md, Product Bible, Core Pillars, MVP Scope
- **Core Learning Loop:** Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply

## V2 Improvements Added

- Adds full required schema outline.
- Adds section-by-section authoring guidance.
- Adds quality rules for each lesson phase.
- Adds sample JSON validation expectations.
- Adds accessibility and safety requirements.
- Adds acceptance criteria for lesson readiness.

## What This Document Must Lock

- Every lesson follows the 16-part flow unless explicitly exempted.
- Lessons must include retrieval and spaced review scheduling.
- Lessons must include first-principles and at least one thinking/evidence/interpretation task.

## Implementation Requirements

- Validate required fields.
- Support multiple activity types and quiz question types.
- Include feedbackRules, masteryThreshold, reteachPath, and challengePath.

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

- Create TypeScript Lesson types from this spec.
- Build Lesson Player to render sections generically.
- Create content QA for missing lesson sections.

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
