# 76 — V5 Thinking and Adaptation Systems

## Purpose

This document locks the V5 expansion of the MVP from a retention-only vertical slice into a thinking, mistake-analysis, application, evidence, and adaptation loop. Memory Vault handles retention. These systems handle why the student struggled, how to repair learning, how to stretch advanced learners, and how to collect proof of thinking.

## V5 Systems Added to MVP

1. Mistake Journal
2. Reteach and Intervention Engine
3. Challenge and Enrichment Engine
4. Problem-Solving Lab
5. Evidence Room
6. Interpretation Lens
7. Discussion Arena
8. Learning Planner
9. Systems Mapper
10. Portfolio / Project Evidence System

## 1. Mistake Journal

### Purpose
Tracks mistake patterns and converts them into repair actions.

### Canonical Mistake Types
- Misread the question
- Used wrong operation
- Forgot vocabulary
- Weak evidence
- Skipped a step
- Guessed too fast
- Calculation error
- Misunderstood concept
- Weak explanation

### MVP Implementation
- Implemented in `src/features/mistake-journal/mistakeJournalEngine.ts`.
- Consumes `QuizResult.answers`.
- Produces `MistakeJournalEntry[]`.
- Routes entries to Reteach, Problem-Solving Lab, Evidence Room, Learning Planner, or Memory Vault.

## 2. Reteach and Intervention Engine

### Purpose
Assigns a smaller and clearer learning path when mastery is below target.

### MVP Includes
- Simpler explanation
- Visual model prompt
- Worked example
- Vocabulary support
- Scaffold steps
- Smaller practice set
- Misconception correction
- Parent/teacher note

### Implementation
- Implemented in `src/features/reteach/reteachInterventionEngine.ts`.
- Uses lesson `reteachPath` plus mistake journal evidence.

## 3. Challenge and Enrichment Engine

### Purpose
Gives advanced learners meaningful extension tasks instead of only moving ahead.

### MVP Includes
- Harder problem
- Real-world application
- Creative task
- Multi-step reasoning
- Debate prompt
- Research extension
- Design challenge
- Cross-subject challenge

### Implementation
- Implemented in `src/features/challenge/challengeEnrichmentEngine.ts`.
- Uses lesson `challengePath` and derives missing categories safely.

## 4. Problem-Solving Lab

### Student Flow
1. Understand the problem
2. Identify known facts
3. Identify unknowns
4. Break into smaller parts
5. Choose a strategy
6. Solve step by step
7. Check the answer
8. Explain reasoning
9. Reflect

### Implementation
- Built into `src/features/thinking/thinkingSystemsEngine.ts`.
- Displayed in `ThinkingSystemsHub.tsx`.

## 5. Evidence Room

### Student Flow
1. Make a claim
2. Choose evidence
3. Sort strong, weak, irrelevant, and counterargument evidence
4. Explain reasoning
5. Revise weak answer

### Implementation
- Built into `buildEvidenceRoomTask`.
- Displayed in `ThinkingSystemsHub.tsx`.

## 6. Interpretation Lens

### Lenses
- Text Lens
- Data Lens
- History Lens
- Science Lens
- Art Lens
- Media Lens
- Perspective Lens
- Cause-and-Effect Lens

### Implementation
- Automatically chooses an MVP lens from the lesson subject.
- Displayed in `ThinkingSystemsHub.tsx`.

## 7. Discussion Arena

### MVP Safety Rule
Discussion is prompt-only. No open public chat, no random direct messages, no public student profiles.

### Sentence Frames
- I think ___ because ___.
- I agree because ___.
- I disagree because ___.
- The evidence shows ___.
- Another possibility is ___.
- I changed my mind because ___.

## 8. Learning Planner

### Student Flow
- What do I need to do?
- What step comes first?
- What strategy will I use?
- How will I know I am done?
- What got in my way?
- What will I do differently next time?

### Implementation
- Derived from each lesson and shown in the Thinking Systems Hub.

## 9. Systems Mapper

### Purpose
Teaches cause/effect and connected thinking.

### MVP Model
- Learning goal → strategy → result
- Evidence/check → strategy improvement

## 10. Portfolio / Project Evidence System

### Purpose
Stores proof of student thinking and growth.

### MVP Artifacts
- Essays
- Writing drafts
- Lab reports
- Reflection responses
- Code projects
- Presentations
- Capstones later

## V5 Seed Lesson Expansion

The MVP now contains 16 actual seed lesson files:

- 12 original academic seed lessons
- 4 added lessons:
  - FA-G3-WR-U1-L1 — Building a Strong Paragraph
  - BA-G6-CS-U1-L1 — Debugging an Algorithm
  - SA-G9-STUDY-U1-L1 — Planning, Monitoring, and Evaluating Learning
  - SA-G9-FIN-U1-L1 — Budgeting from First Principles

## Acceptance Criteria

- Lesson validator passes with 16 content JSON files.
- Static smoke test confirms 16 lessons and all 10 V5 systems.
- Student Dashboard exposes Thinking Systems entry.
- Results screen exposes Thinking Systems entry.
- Thinking Systems Hub displays all 10 systems.
- No open student-to-student communication is introduced.
- Memory Vault schedule remains Day 1, 3, 7, 14, 30.
