# 16 — Data Model Specification

## Data Philosophy

The app should use clean relational models and clear TypeScript types.

Do not collapse curriculum, users, progress, quizzes, and reviews into one giant table.

Start with Markdown/JSON content for MVP, then move or sync to database later.

---

## User Models

```ts
type UserRole =
  | "student"
  | "parent"
  | "teacher"
  | "school_admin"
  | "platform_admin"
  | "content_creator"
  | "curriculum_reviewer";

type User = {
  id: string;
  email?: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};
```

---

## Student Profile

```ts
type StudentProfile = {
  id: string;
  userId: string;
  academy: "foundation" | "bridge" | "scholar";
  gradeLevel: string;
  parentGuardianIds: string[];
  currentSubjects: string[];
  createdAt: string;
  updatedAt: string;
};
```

---

## Curriculum Models

```ts
type Academy = {
  id: string;
  name: "Foundation Academy" | "Bridge Academy" | "Scholar Academy";
  gradeRange: string;
};

type Subject = {
  id: string;
  name: string;
};

type Course = {
  id: string;
  academyId: string;
  gradeLevel: string;
  subjectId: string;
  title: string;
  overview: string;
};

type Unit = {
  id: string;
  courseId: string;
  title: string;
  overview: string;
  essentialQuestions: string[];
  objectiveIds: string[];
  lessonIds: string[];
  standardsTags: string[];
  thinkingSkillTags: string[];
};
```

---

## Lesson Model

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
  sections: LessonSection[];
  quizIds: string[];
  masteryThreshold: number;
  reviewSchedule: ReviewSchedule;
  reteachPath: string[];
  challengePath: string[];
};
```

---

## Lesson Section Model

```ts
type LessonSectionType =
  | "hook"
  | "learning_goal"
  | "mini_teach"
  | "first_principles"
  | "worked_example"
  | "guided_practice"
  | "critical_thinking"
  | "evidence_reasoning"
  | "interpretation"
  | "discussion"
  | "active_practice"
  | "retrieval_check"
  | "feedback"
  | "reflection";

type LessonSection = {
  id: string;
  type: LessonSectionType;
  title: string;
  content: string;
  activityIds?: string[];
};
```

---

## Quiz Models

```ts
type QuizQuestion = {
  id: string;
  lessonId: string;
  questionText: string;
  questionType: "multiple_choice" | "short_answer" | "explain" | "select_evidence" | "order_steps";
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

## Progress Models

```ts
type LessonProgress = {
  id: string;
  studentId: string;
  lessonId: string;
  status: "not_started" | "in_progress" | "completed";
  currentSectionId?: string;
  completedAt?: string;
  masteryScore?: number;
};
```

---

## Mastery Model

```ts
type MasteryStatus =
  | "needs_intervention"
  | "needs_reteach"
  | "almost_mastered"
  | "mastered"
  | "advanced";

type SkillMastery = {
  id: string;
  studentId: string;
  skillId: string;
  score: number;
  status: MasteryStatus;
  lastUpdatedAt: string;
};
```

---

## Retention Model

```ts
type SpacedReviewItem = {
  id: string;
  studentId: string;
  skillId: string;
  lessonId: string;
  promptType: "recall" | "multiple_choice" | "short_answer" | "explain" | "apply";
  lastReviewedAt?: string;
  nextReviewAt: string;
  reviewIntervalDays: number;
  accuracyHistory: number[];
  confidenceRating?: number;
  mistakeType?: string;
  retentionStrength: "weak" | "developing" | "strong" | "mastered";
};
```

---

## Reward Model

```ts
type XpEvent = {
  id: string;
  studentId: string;
  eventType: string;
  amount: number;
  reason: string;
  createdAt: string;
};

type Badge = {
  id: string;
  title: string;
  description: string;
  criteria: string;
};
```

---

## Future Database Tables

```txt
users
roles
student_profiles
guardian_student_links
teacher_profiles
classes
class_enrollments
academies
grade_bands
grade_levels
subjects
courses
units
lessons
lesson_sections
activities
standards
skills
lesson_standards
lesson_skills
quiz_questions
quiz_attempts
quiz_answers
lesson_progress
skill_mastery
spaced_review_items
assignments
badges
student_badges
xp_events
portfolio_items
rubrics
rubric_scores
mistake_journal_entries
discussion_prompts
ai_tutor_sessions
```

---

## Relationship Notes

- One parent can link to many students.
- One teacher can teach many classes.
- One class has many enrollments.
- One course has many units.
- One unit has many lessons.
- One lesson can map to many skills and standards.
- One skill can generate many spaced review items.
- One student has many lesson progress records.


---

# V2 Implementation Expansion

## Document Status

- **Version:** 2.0
- **Readiness Target:** Codex-ready implementation guidance
- **Primary Dependency:** AGENTS.md, Product Bible, Core Pillars, MVP Scope
- **Core Learning Loop:** Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply

## V2 Improvements Added

- Adds relationship notes.
- Adds TypeScript model guidance.
- Adds row-level access implications.
- Adds indexing candidates.
- Adds migration strategy hooks.
- Adds privacy sensitivity labels.

## What This Document Must Lock

- Do not collapse curriculum/progress/users into one table.
- Content files come first, relational database later.

## Implementation Requirements

- Define users, roles, students, curriculum, quizzes, progress, mastery, review, rewards, and safety entities.
- Plan many-to-many tables for lessons↔standards and lessons↔skills.

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

- Create shared TypeScript types before DB implementation.
- When using Supabase/Postgres later, map access policies to roles.

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
