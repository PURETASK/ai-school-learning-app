# Project Source of Truth — Nexus Learning OS

**Status:** Canonical — Version 7  
**Effective date:** 2026-07-12  
**Supersedes:** Project Source of Truth V6 and the mandatory 16-step universal lesson contract  
**Applies to:** Product, curriculum, pedagogy, assessment, AI behavior, data contracts, user experience, engineering, quality assurance, and contributor decisions

This document is the controlling source of truth for the K–12 Learning App Suite. If another document, lesson, schema, implementation, prompt, or design decision conflicts with this file, this file wins until it is intentionally revised through version control.

---

## 1. Canonical Product Identity

The product is a **K–12 thinking-development, mastery, retention, and transfer learning platform**.

It is not primarily:

- a video library;
- a worksheet repository;
- a flashcard application;
- a quiz grinder;
- an unrestricted child-facing chatbot;
- a collection of disconnected educational games;
- a school of record in the current product phase.

The platform teaches complete academic content while deliberately developing the learner’s ability to:

- acquire accurate knowledge;
- perform important skills;
- reason from first principles;
- evaluate evidence;
- interpret meaning and context;
- identify and repair errors;
- retain important knowledge;
- transfer learning to unfamiliar situations;
- communicate and defend conclusions;
- plan, monitor, and improve their own learning.

### Official academies

| Academy | Grade Band | Canonical Slug | Product Role |
|---|---:|---|---|
| Foundation Academy | Kindergarten–Grade 5 | `foundation-academy` | Foundational literacy, numeracy, knowledge, guided play, concrete models, early reasoning, and parent-supported learning |
| Bridge Academy | Grades 6–8 | `bridge-academy` | Subject mastery, structured independence, study skills, research, laboratories, discussion, systems thinking, and transition readiness |
| Scholar Academy | Grades 9–12 | `scholar-academy` | Course-based disciplinary expertise, advanced reasoning, essays, laboratories, projects, portfolios, capstones, and college/career readiness |

---

## 2. Canonical Learning Mission

The academies exist to develop **independent, knowledgeable, thoughtful, durable, and capable learners**.

The system does not define learning as lesson completion, time on task, video consumption, or a single quiz score.

A successful learner can:

1. **Know** — retrieve and recognize accurate knowledge.
2. **Do** — perform the skill with suitable accuracy and independence.
3. **Reason** — explain, analyze, compare, evaluate, and solve.
4. **Remember** — retain the learning after meaningful time has passed.
5. **Transfer** — apply the learning to a new problem, representation, subject, or real situation.

These are the **Five Outcomes of Real Learning**:

- Knowledge
- Capability
- Reasoning
- Retention
- Transfer

All units must intentionally develop the outcomes relevant to their standards and purpose. Not every minor lesson must assess all five outcomes.

---

## 3. Governing Learning Principles

1. **Knowledge and reasoning are partners.** Reasoning without knowledge becomes speculation; knowledge without reasoning remains shallow.
2. **Teach clearly before expecting independent performance.** Beginners require models, explanations, examples, and structured practice.
3. **Students must actively process learning.** Passive exposure is not sufficient evidence of understanding.
4. **First principles means reconstruction from essential components.** It does not mean forcing novices to discover established knowledge without guidance.
5. **Practice must be deliberate and diagnostic.** More questions are not automatically better instruction.
6. **Immediate success does not prove durable learning.** Retention must be checked later.
7. **Mastery requires multiple forms of evidence.** One percentage is an incomplete signal.
8. **Projects apply and integrate knowledge.** They do not replace the systematic teaching of prerequisite knowledge and skills.
9. **Feedback must produce a useful next action.** Praise or answer revelation alone is not sufficient.
10. **The cause of failure must be diagnosed before more work is assigned.**
11. **Student autonomy expands with competence and responsibility.**
12. **AI assistance must reduce dependence over time.**
13. **Curriculum coherence matters more than feature count.**
14. **Not every lesson must be entertaining.** Every lesson must be purposeful, understandable, active, accessible, and appropriately challenging.
15. **The final goal is independence from the platform.** The learner should increasingly be able to learn, verify, remember, and apply without permanent support.

---

## 4. Canonical Intellectual DNA

The original learning loop remains the philosophical DNA of the product:

```text
Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply
```

This loop describes the complete capabilities the platform develops across units and courses.

**It is no longer a mandatory screen-by-screen sequence inside every lesson.**

The mandatory 16-step universal lesson structure is superseded because different instructional purposes require different lesson forms. A phonics lesson, laboratory investigation, historical seminar, fluency exercise, calculus proof, and design project must not be forced into an identical sequence.

---

## 5. Nexus Learning Cycle

The canonical instructional cycle is:

```text
Orient → Model → Deconstruct → Practice → Reason → Prove → Remember → Transfer → Adapt
```

The full cycle must be completed across a coherent unit. Individual lessons use only the phases required by their learning purpose.

### 5.1 Orient

The learner establishes:

- the learning destination;
- why the learning matters;
- success criteria;
- relevant prior knowledge;
- possible prerequisite gaps;
- the question, problem, phenomenon, text, performance, or product that organizes the learning.

Possible components:

- hook or phenomenon;
- learning goal;
- essential question;
- success criteria;
- short diagnostic;
- prior-knowledge activation;
- vocabulary preview.

### 5.2 Model

The teacher, lesson, approved media, demonstration, or worked example provides a clear and accurate mental model.

Possible components:

- explicit explanation;
- think-aloud;
- concrete or visual representation;
- expert model;
- worked example;
- non-example;
- comparison of correct and incorrect approaches;
- common misconception warning.

### 5.3 Deconstruct

The learner examines how and why the model works.

Core questions:

1. What is the actual goal?
2. What are the smallest meaningful parts?
3. What must be true?
4. What facts, definitions, constraints, rules, or relationships govern the task?
5. What assumptions are explicit or hidden?
6. Which parts are essential and which are incidental?
7. Can the idea be rebuilt in the learner’s own words, symbols, model, or demonstration?
8. How can the reconstruction be checked?

### 5.4 Practice

Practice follows a gradual transfer of responsibility:

1. fully modeled example;
2. partially completed example;
3. guided practice;
4. supported independent practice;
5. independent practice;
6. variable, mixed, or interleaved practice.

Practice must identify its purpose:

- conceptual understanding;
- accuracy;
- strategy selection;
- procedural fluency;
- communication;
- discrimination between similar concepts;
- preparation for transfer.

### 5.5 Reason

The lesson activates only the reasoning studio or studios that genuinely serve the learning target.

Possible reasoning studios:

- Problem-Solving Lab
- Evidence Room
- Interpretation Lens
- Discussion Arena
- Debugging Arena
- Systems Mapper
- Thinking Cards

A lesson normally uses zero, one, or two studios. No lesson is required to use all studios.

### 5.6 Prove

The learner produces evidence of current learning.

Proof formats may include:

- oral explanation;
- written response;
- quiz;
- demonstration;
- solved problem;
- reading performance;
- experiment;
- source analysis;
- model or diagram;
- code;
- design;
- debate;
- performance;
- portfolio artifact.

Assessment format must match the actual learning target.

### 5.7 Remember

Priority knowledge and skills enter the Memory Vault for delayed retrieval, discrimination, explanation, correction, interleaving, and application.

### 5.8 Transfer

The learner applies the learning in a changed or unfamiliar context.

Transfer may occur through:

- a novel problem;
- a new representation;
- a case study;
- a source set;
- an investigation;
- a simulation;
- a design challenge;
- a project;
- an authentic decision;
- teaching another learner;
- a cross-disciplinary connection.

Transfer may occur later in the unit rather than in the introductory lesson.

### 5.9 Adapt

The system selects the next instructional action from evidence.

Possible actions:

- continue;
- repair a prerequisite;
- reteach with a different model;
- provide guided practice;
- reduce scaffolding;
- schedule review;
- assign a transfer task;
- unlock challenge or enrichment;
- escalate to a parent, teacher, tutor, or specialist workflow.

---

## 6. Canonical Lesson Families

Every lesson must declare one primary lesson family. A secondary family is optional.

### 6.1 Concept Launch

**Purpose:** Establish new knowledge, vocabulary, relationships, or mental models.

Usually includes:

- Orient
- Model
- Deconstruct
- short guided Practice

### 6.2 Skill Workshop

**Purpose:** Build accurate and independent performance.

Usually includes:

- Model
- Practice
- Feedback
- Prove

### 6.3 Fluency Sprint

**Purpose:** Increase efficient performance of an already understood foundational skill.

Usually includes:

- retrieval;
- brief paced practice;
- immediate error correction;
- scheduled review.

Fluency work must not replace conceptual teaching.

### 6.4 Reasoning Lab

**Purpose:** Analyze, solve, compare, evaluate, interpret, justify, model, or debug.

Usually includes:

- Deconstruct
- one or more reasoning studios
- Prove
- reflection

### 6.5 Inquiry or Investigation

**Purpose:** Investigate a phenomenon, question, source set, problem, or design.

Usually includes:

- Orient
- prerequisite background instruction
- guided investigation
- Evidence Room or Systems Mapper
- explanation or design conclusion

Inquiry must include appropriate guidance.

### 6.6 Seminar or Discussion

**Purpose:** Develop interpretation, evidence use, listening, response, revision, and academic dialogue.

Usually includes:

- preparation and knowledge-building;
- Interpretation Lens or Evidence Room;
- Discussion Arena;
- written or recorded synthesis.

### 6.7 Mastery Check

**Purpose:** Determine what the learner can do independently.

Assistance is limited and documented. A Mastery Check is not a teaching session.

### 6.8 Transfer Challenge

**Purpose:** Apply learning in a novel context.

Usually includes:

- unfamiliar problem or context;
- independent strategy selection;
- explanation or defense;
- transfer evidence.

### 6.9 Project Studio

**Purpose:** Integrate multiple knowledge and skill targets over time.

Usually includes:

- project brief;
- prerequisite checkpoints;
- planning;
- creation or investigation;
- critique;
- revision;
- public or authentic product where appropriate;
- individual accountability;
- reflection and portfolio evidence.

---

## 7. First-Principles Learning Progression

First-principles reasoning must be developmentally adapted.

### 7.1 Foundation Academy

```text
See → Name → Separate → Pattern → Build → Check
```

Learner questions:

- What do I notice?
- What is it called?
- What parts does it have?
- What pattern do I see?
- Can I build, draw, sort, act out, or show it?
- How do I know it is correct?

Preferred representations:

- objects;
- pictures;
- gestures;
- movement;
- sorting;
- drawing;
- oral explanation;
- simple symbols.

### 7.2 Bridge Academy

```text
Define → Known → Unknown → Parts → Rule → Strategy → Test → Explain
```

Learner questions:

- What am I trying to find, decide, or explain?
- What do I know?
- What is missing?
- What smaller tasks are inside the problem?
- What rule, pattern, system, or relationship matters?
- Which strategy is suitable?
- How can the result be tested?
- How can the reasoning be explained clearly?

### 7.3 Scholar Academy

```text
Define → Assumptions → Primitives → Relationships → Derive → Model → Falsify → Transfer
```

Learner questions:

- How precisely is the problem defined?
- Which assumptions are explicit or hidden?
- What facts, definitions, constraints, or principles cannot be reduced further in this context?
- How do those elements interact?
- What conclusion follows?
- How can the conclusion be represented or modeled?
- What evidence, test, or counterexample could prove the conclusion wrong?
- Where else does the principle apply?

---

## 8. Canonical Thinking and Application Systems

The following systems remain official:

1. Mistake Journal
2. Reteach and Intervention Engine
3. Challenge and Enrichment Engine
4. Problem-Solving Lab
5. Evidence Room
6. Interpretation Lens
7. Discussion Arena
8. Debugging Arena
9. Learning Planner
10. Systems Mapper
11. Thinking Cards
12. Portfolio / Project Evidence System
13. Memory Vault

Each system must have:

- a dedicated specification;
- a typed data contract;
- a clear activation rule;
- a student-facing action;
- a feedback or scoring rule;
- an accessibility boundary;
- a child-safety boundary;
- persistence requirements;
- parent/teacher visibility rules;
- acceptance tests.

### Shared system loop

```text
Evidence → Pattern → Diagnosis → Recommendation → Student Action → Reflection → Visibility
```

---

## 9. Learning-State Model

Each important skill or concept has a current learning state.

| State | Canonical Label | Meaning | Default System Action |
|---:|---|---|---|
| 0 | Not Yet Diagnosed | Insufficient evidence | Short diagnostic and prerequisite scan |
| 1 | Prerequisite Gap | Earlier knowledge or skill is missing | Pause, repair prerequisite, then return |
| 2 | Acquiring | First exposure or fragile initial model | Explicit teaching, examples, small steps |
| 3 | Developing | Partial understanding or inconsistent performance | Guided practice and misconception-specific feedback |
| 4 | Accurate | Correct in familiar contexts but slow, scaffolded, or format-dependent | Variation, explanation, reduced scaffolding, fluency where relevant |
| 5 | Secure | Independent current performance and valid explanation | Schedule delayed retrieval and mixed practice |
| 6 | Durable | Successful after a meaningful delay | Extend interval and interleave |
| 7 | Transferable | Successful application in an unfamiliar context | Challenge, project, peer teaching, or advanced study |

### Transition rule

A skill state changes only when new evidence supports the transition. Completion status alone cannot advance the state.

### Regression rule

A state may move backward when delayed evidence exposes fragile learning. Regression is instructional information, not punishment.

---

## 10. Five Proofs of Mastery

Major concepts and power skills use the Five Proofs of Mastery.

| Proof | Question | Typical Evidence |
|---|---|---|
| Recall | Can the learner retrieve essential knowledge without immediate support? | free recall, oral response, short answer |
| Explain | Can the learner accurately explain why or how? | explanation, annotation, think-aloud, diagram |
| Perform | Can the learner complete the skill independently? | problem, performance, writing, code, demonstration |
| Retain | Can the learner still recall and perform after delay? | Memory Vault review, delayed assessment |
| Transfer | Can the learner use the learning in a changed or unfamiliar context? | novel task, project, investigation, new source |

Not every factual detail requires all five proofs. Curriculum authors must mark which proofs are required for each priority standard or skill.

---

## 11. Multidimensional Mastery Evidence

The platform must not represent mastery as one undifferentiated percentage.

Track the dimensions relevant to the learning target:

- Knowledge
- Accuracy
- Fluency
- Explanation
- Problem Solving
- Critical Thinking
- Evidence Use
- Interpretation
- Communication or Discussion
- Retention
- Transfer
- Reflection and Self-Regulation
- Project or Performance Quality

### Transitional score bands

The existing score bands remain available for compatibility and immediate routing, but they are not complete mastery claims.

| Score | Transitional Label | Meaning | Default Action |
|---:|---|---|---|
| 0–39 | Needs Intervention | Severe gap or invalid current strategy | Intervention and prerequisite diagnosis |
| 40–64 | Needs Reteach | Conceptual or procedural weakness | Alternate explanation and reteach |
| 65–79 | Developing | Partial understanding or inconsistency | Guided and varied practice |
| 80–89 | Secure in Current Context | Strong immediate performance | Schedule delayed review |
| 90–100 | Strong Current Performance | Excellent immediate evidence | Challenge where appropriate and delayed review |

The former labels **Almost Mastered**, **Mastered**, and **Advanced** are deprecated when they are based only on an immediate percentage.

A durable mastery status requires the evidence specified by the skill’s mastery-proof policy.

---

## 12. Feedback Protocol

All automated and human feedback should follow:

```text
Result → Diagnosis → Hint → Action
```

### Result

State what is correct, incomplete, or incorrect.

### Diagnosis

Identify the most probable learning issue.

Canonical diagnosis codes:

- prerequisite gap;
- knowledge gap;
- vocabulary confusion;
- conceptual misconception;
- strategy-selection error;
- procedural error;
- calculation error;
- evidence-selection weakness;
- interpretation error;
- unsupported assumption;
- communication weakness;
- attention slip;
- confidence mismatch;
- retention failure;
- transfer failure.

### Hint

Provide the smallest useful support that preserves student thinking.

### Action

Give the learner a concrete next step.

Examples:

- reread and restate the question;
- compare two examples;
- review a prerequisite;
- repair one specific step;
- switch representation;
- explain the governing rule;
- retry with a new item;
- enter the reteach path;
- request human support.

---

## 13. Error Intelligence System

The Mistake Journal is upgraded into an Error Intelligence System.

Each meaningful error record should capture:

- learner ID;
- skill ID;
- lesson or assessment ID;
- task context;
- submitted response;
- correct or defensible response;
- diagnosis code;
- confidence;
- hint usage;
- correction made;
- next strategy;
- recurrence count;
- current learning state;
- parent/teacher visibility level;
- next repair action.

The system must detect repeated patterns.

Repeated failure must trigger a changed instructional response, such as:

- a different representation;
- a prerequisite repair;
- a smaller step size;
- a worked example;
- oral rather than written explanation;
- concrete rather than symbolic modeling;
- tutor or teacher escalation.

Assigning another identical worksheet is not considered adaptive instruction.

---

## 14. Memory Vault 2.0

The Memory Vault is a signature durable-learning engine.

### Default review sequence

| Stage | Timing | Primary Purpose |
|---|---|---|
| Learn | Day 0 | Initial encoding, explanation, and active practice |
| Quick Recall | Day 1 | Retrieval after an initial delay |
| Reinforce | Day 3 | Repair weakness and strengthen recall |
| Mixed Review | Day 7 | Interleave with related knowledge |
| Application | Day 14 | Apply in a changed context |
| Durable Check | Day 30 | Test long-term retention and readiness for a longer interval |

These timings are defaults, not rigid universal intervals.

### Adaptive scheduling rules

- Correct, independent, and confident performance may lengthen the interval.
- Correct but slow, uncertain, or heavily hinted performance should produce a shorter interval.
- Incorrect performance triggers feedback, diagnosis, repair, and an earlier review.
- Repeated misconceptions trigger a different instructional representation.
- Durable knowledge should be increasingly reviewed through mixed and transfer tasks rather than simple repetition.

### Review modes

- Recall
- Recognize and Discriminate
- Explain
- Correct
- Connect
- Apply
- Mix

### Required Memory Vault data

- skill and prerequisite links;
- last reviewed timestamp;
- next review timestamp;
- interval;
- accuracy history;
- response latency where appropriate;
- confidence;
- hint usage;
- diagnosis code;
- current learning state;
- proof-of-mastery status;
- transfer evidence;
- retention strength.

---

## 15. AI Tutor Protocol

The AI tutor is a constrained instructional coach, not an answer engine or unrestricted companion.

### The AI tutor may

- restate the learning goal;
- ask diagnostic questions;
- activate relevant prior knowledge;
- identify likely misconceptions;
- present approved explanations and examples;
- give progressively stronger hints;
- ask the learner to explain reasoning;
- compare strategies;
- generate controlled practice from approved skill definitions;
- recommend Memory Vault review;
- summarize learning evidence for authorized adults;
- escalate persistent difficulty.

### The AI tutor must not

- complete assessed work for the learner;
- immediately reveal answers when productive struggle is appropriate;
- invent standards, facts, or curriculum expectations;
- present uncertain information as certain;
- replace human safeguarding or professional judgment;
- diagnose a medical, psychological, or disability condition;
- conduct unrestricted private social conversation with children;
- collect unnecessary personal information;
- reward dependence or excessive engagement.

### Canonical hint ladder

1. Ask the learner to restate the task.
2. Direct attention to relevant information.
3. Remind the learner of the applicable concept or rule.
4. Isolate the next step.
5. Show a parallel example.
6. Complete a limited portion while preserving the remaining thinking.
7. Provide the full explanation only when teaching—not assessing—or after meaningful attempts under approved rules.

The AI tutor must log hint level and distinguish assisted performance from independent performance.

---

## 16. Academy Teaching Profiles

### 16.1 Foundation Academy — Guided Discovery Built on Explicit Foundations

Primary methods:

- structured literacy;
- developmental mathematics;
- read-alouds and oral language;
- explicit modeling;
- manipulatives and concrete materials;
- guided play;
- movement, music, art, and story;
- short focused practice;
- frequent adult interaction;
- visual routines;
- gentle retrieval;
- parent-supported learning.

Typical evidence:

- oral explanation;
- demonstration;
- sorting;
- drawing;
- manipulatives;
- reading performance;
- short writing;
- simple project or performance.

### 16.2 Bridge Academy — Structured Independence and Reasoning Apprenticeship

Primary methods:

- coherent subject instruction;
- explicit models and guided notes;
- worked examples;
- laboratories and investigations;
- Problem-Solving Lab;
- Evidence Room;
- Debugging Arena;
- structured academic discussion;
- research missions;
- study and organization instruction;
- increasingly independent practice;
- interleaved retrieval;
- short and medium projects.

Typical evidence:

- written explanations;
- problem solutions;
- source analysis;
- laboratory records;
- discussion products;
- models;
- presentations;
- delayed mastery checks.

### 16.3 Scholar Academy — Disciplinary Expertise, Independent Judgment, and Authentic Production

Primary methods:

- rigorous course knowledge;
- advanced worked examples;
- analytical reading and writing;
- seminars;
- research;
- laboratories;
- mathematical and computational modeling;
- source evaluation;
- technical and creative production;
- internships or authentic briefs where available;
- portfolios;
- capstones;
- formal examinations;
- delayed retention and transfer checks.

Typical evidence:

- examinations;
- essays;
- laboratory investigations;
- research products;
- performances;
- code;
- designs;
- presentations;
- portfolios;
- capstone defense.

Autonomy increases only when the learner demonstrates sufficient knowledge, capability, and self-regulation.

---

## 17. Canonical Unit Architecture

The unit is the primary instructional-design object.

Every complete unit must include:

### A. Unit destination

- essential knowledge;
- priority concepts;
- power skills;
- reasoning goals;
- transfer goal;
- standards or framework alignment;
- required mastery proofs.

### B. Prerequisite map

- prerequisite skill IDs;
- diagnostic tasks;
- repair routes;
- assumed vocabulary and background knowledge.

### C. Learning progression

A deliberate sequence of lesson families, such as:

- Concept Launch;
- Skill Workshop;
- Reasoning Lab;
- retrieval session;
- Inquiry or Seminar;
- Mastery Check;
- Transfer Challenge or Project Studio.

### D. Transfer experience

- authentic or novel task;
- clear constraints;
- individual accountability;
- rubric;
- feedback and revision opportunity.

### E. Durable-learning plan

- Memory Vault items;
- planned interleaving;
- delayed mastery checks;
- future-unit connections.

---

## 18. Canonical Lesson Data Contract — V3 Direction

New content must target the V3 conceptual model. Exact TypeScript and JSON Schema files may refine field names but must preserve these meanings.

```ts
type Academy = "foundation" | "bridge" | "scholar";

type LessonFamily =
  | "concept_launch"
  | "skill_workshop"
  | "fluency_sprint"
  | "reasoning_lab"
  | "inquiry_investigation"
  | "seminar_discussion"
  | "mastery_check"
  | "transfer_challenge"
  | "project_studio";

type LearningPhase =
  | "orient"
  | "model"
  | "deconstruct"
  | "practice"
  | "reason"
  | "prove"
  | "remember"
  | "transfer"
  | "adapt";

type LearningState =
  | "not_diagnosed"
  | "prerequisite_gap"
  | "acquiring"
  | "developing"
  | "accurate"
  | "secure"
  | "durable"
  | "transferable";

type MasteryProof =
  | "recall"
  | "explain"
  | "perform"
  | "retain"
  | "transfer";

type ReasoningStudio =
  | "problem_solving_lab"
  | "evidence_room"
  | "interpretation_lens"
  | "discussion_arena"
  | "debugging_arena"
  | "systems_mapper"
  | "thinking_cards";

type NexusLesson = {
  id: string;
  title: string;
  academy: Academy;
  gradeLevel: string;
  subject: string;
  course?: string;
  unitId: string;
  lessonNumber: number;
  estimatedMinutes: number;

  lessonFamily: LessonFamily;
  secondaryLessonFamily?: LessonFamily;
  activePhases: LearningPhase[];
  targetLearningStates: LearningState[];

  learningObjective: string;
  successCriteria: string[];
  essentialQuestion?: string;
  standardsTags: string[];
  thinkingSkillTags: string[];
  vocabularyTerms: string[];
  prerequisiteSkillIds: string[];

  outcomes: {
    knowledge: string[];
    capability: string[];
    reasoning?: string[];
    retention?: string[];
    transfer?: string[];
  };

  orient?: LessonModule;
  model?: LessonModule;
  deconstruct?: FirstPrinciplesModule;
  practice?: PracticeSequence;
  reasoningStudios?: ReasoningStudioModule[];
  proofTasks: ProofTask[];
  memoryPlan?: MemoryPlan;
  transferTask?: TransferTask;

  requiredMasteryProofs: MasteryProof[];
  feedbackRules: DiagnosticFeedbackRule[];
  reteachPaths: AdaptivePath[];
  prerequisiteRepairPaths: AdaptivePath[];
  challengePaths: AdaptivePath[];

  parentTeacherNotes?: string;
  accessibilityNotes: string[];
  safetyNotes: string[];
  contentStatus: "seed" | "draft" | "reviewed" | "pilot_ready" | "approved";
  version: string;
};
```

### Data-model rule

Do not implement a single giant unstructured lesson text field. Modules must be typed enough to support adaptive routing, analytics, accessibility, and validation.

---

## 19. Backward Compatibility and Migration

The existing 16 seed lesson files and current V6 implementation must not be discarded.

### Old-to-new mapping

| V6 Field or Step | V7 Phase or System |
|---|---|
| Hook, Learning Goal | Orient |
| Mini Teach, Worked Example | Model |
| First-Principles Breakdown | Deconstruct |
| Guided Practice, Active Practice | Practice |
| Critical Thinking Checkpoint | Reason / Thinking Cards or Problem-Solving Lab |
| Evidence-Based Reasoning Task | Reason / Evidence Room |
| Interpretation or Discussion Task | Reason / Interpretation Lens or Discussion Arena |
| Retrieval Check, Quiz, Mastery Score | Prove and Remember |
| Spaced Review Scheduling | Memory Vault 2.0 |
| Feedback | Feedback Protocol and Error Intelligence |
| Reflection | Adapt and Learning Planner |
| Reteach or Challenge Path | Adapt |
| Existing project evidence | Transfer and Portfolio / Project Evidence System |

### Compatibility rules

1. Existing V2 lesson JSON remains readable through a compatibility adapter.
2. The Lesson Player may render legacy sections while new modular rendering is introduced.
3. Validation must distinguish `schemaVersion: "2"` from `schemaVersion: "3"`.
4. No seed lesson is considered upgraded merely because fields were mechanically renamed.
5. Each migrated lesson must be assigned a real lesson family, active phases, target state, mastery proofs, and diagnostic feedback rules.
6. The old 16-step requirement is removed from compliance audits after the V3 adapter and replacement acceptance tests are operational.
7. Historical files remain available for traceability.

---

## 20. Curriculum and Content Quality Gates

A lesson or unit cannot reach **Approved** status unless reviewers can answer:

1. What exact knowledge or capability is being developed?
2. What prerequisites are required?
3. Which learning state is the instruction designed to change?
4. Why is the selected lesson family appropriate?
5. What is explicitly taught or modeled?
6. What must the learner actively do?
7. Which reasoning studio is justified, if any?
8. What misconceptions are anticipated?
9. What evidence proves current learning?
10. Which mastery proofs are required?
11. How will retention be checked later?
12. Where will transfer occur?
13. What happens when the learner struggles?
14. What happens when the learner is already secure or advanced?
15. Is the lesson accessible, safe, accurate, and developmentally appropriate?
16. Does every activity serve the learning goal?
17. Are standards claims verifiable rather than implied?
18. Has a subject-matter reviewer approved the content?

### Content-status definitions

| Status | Meaning |
|---|---|
| Seed | Structural example; not ready for normal student use |
| Draft | Topic-specific instructional content exists but requires review |
| Reviewed | Content, pedagogy, and technical structure have passed internal review |
| Pilot Ready | Complete materials, answer keys, accessibility review, and pilot plan exist |
| Approved | Pilot evidence and authorized reviewer approval support release |

---

## 21. Product and Jurisdiction Posture

Until a separate decision is formally locked, the curriculum must be described as:

- U.S.-oriented;
- nationally portable in architecture;
- framework-informed;
- configurable for state-specific crosswalks;
- suitable for supplemental, homeschool-support, tutoring, and microschool use;
- not automatically compliant with every state;
- not an accredited school or school of record.

No document may claim full state standards alignment without a completed, reviewed, versioned crosswalk.

---

## 22. Official MVP Scope

The MVP continues to prove the learning engine before attempting full K–12 breadth.

### MVP grades

| Academy | MVP Grade |
|---|---:|
| Foundation Academy | Grade 3 |
| Bridge Academy | Grade 6 |
| Scholar Academy | Grade 9 |

### MVP courses

| Grade | Canonical Course Names |
|---:|---|
| Grade 3 | Grade 3 ELA, Grade 3 Math, Grade 3 Science, Grade 3 Social Studies |
| Grade 6 | Grade 6 ELA, Grade 6 Math, Grade 6 Science, Grade 6 Social Studies |
| Grade 9 | English 9, Algebra I, Biology, World History I |

### Existing seed content

The canonical existing seed count remains **16 lesson files** until an updated inventory is approved.

### MVP product capabilities

1. Student Dashboard
2. Modular Lesson Player with V2 compatibility
3. Quiz and Proof Task Engine
4. Diagnostic Feedback Engine
5. Learning-State and Mastery Engine
6. Memory Vault 2.0 foundation
7. Mistake Journal / Error Intelligence foundation
8. Reteach and Intervention Engine
9. Challenge and Enrichment Engine
10. Thinking Systems access
11. Basic Parent Dashboard
12. JSON/Markdown content loading
13. V2 and V3 lesson validation
14. Persistent progress architecture

### Delayed until later phases

- unrestricted AI tutor;
- public discussion boards;
- full school administration;
- diploma or transcript issuance;
- full K–12 content;
- native mobile application;
- behavior-based advertising;
- public student profiles;
- leaderboards based on raw scores or time spent.

---

## 23. Safety, Privacy, and Accessibility

Because the platform serves children, safety and accessibility are product requirements.

### Privacy and child-safety rules

- Collect only data necessary for learning and authorized operations.
- Use parent or guardian controls for younger learners.
- Apply role-based access control.
- Do not create public student profiles by default.
- Do not use behavioral advertising for children.
- Provide deletion and export workflows.
- Restrict child-facing communication features.
- Log automated tutoring assistance and escalation.
- Separate instructional analytics from unnecessary surveillance.
- Never infer sensitive diagnoses from ordinary learning behavior.

### Accessibility target

Target WCAG 2.2 AA-aligned implementation, including:

- semantic structure;
- keyboard operation;
- visible focus;
- readable contrast;
- scalable text;
- large touch targets;
- captions and transcripts;
- screen-reader labels;
- meaningful alt text;
- no reliance on color alone;
- reduced-motion support;
- no dangerous flashing;
- plain language appropriate to age;
- multiple response modes where academically valid.

Accessibility support must not silently reduce the intended learning standard.

---

## 24. Persistence and Evidence Integrity

Production learning evidence must use durable storage rather than browser-only local state.

Persist at minimum:

- student and guardian profiles;
- enrollment and course relationships;
- lesson progress;
- proof-task and quiz attempts;
- submitted answers;
- hint usage;
- feedback and diagnosis codes;
- skill states;
- mastery-proof evidence;
- Memory Vault items and sessions;
- Mistake Journal entries and patterns;
- reteach and challenge plans;
- thinking-system entries;
- portfolio artifacts;
- parent/teacher review events;
- versioned content identifiers.

Authorization rules must prevent cross-student and cross-family data leakage.

---

## 25. Official Repository Paths

```text
AGENTS.md
README.md
PROJECT_SOURCE_OF_TRUTH.md
CANONICAL_NAMING_CONVENTIONS.md
CODEX_FIRST_BUILD_PROMPT.md
MVP_VERTICAL_SLICE_SPEC.md
REPO_SETUP_COMMANDS.md
LESSON_IMPORT_PLAN.md
LESSON_VALIDATION_RULES.md
FIRST_DEMO_SCRIPT.md

schemas/           # V2 legacy and V3 Nexus lesson/data schemas
docs/              # Product, pedagogy, safety, architecture, and implementation docs
curriculum/        # Scope, sequence, crosswalk, and content-control docs
content/           # Machine-readable lesson content
seed-lessons/      # Human-readable seed lessons, rubrics, answer keys, and fixtures
src/               # Application source
scripts/           # Validation, migration, import, and audit scripts
tables/            # Planning and compliance tables
reports/           # Audits, migration reports, QA, and validation output
```

Recommended additions:

```text
docs/nexus-learning-os/
docs/migration-v7/
schemas/lesson-v3/
src/features/learning-state/
src/features/error-intelligence/
src/features/memory-vault-v2/
src/features/adaptive-routing/
scripts/migrate-v2-to-v3/
```

---

## 26. Contributor and Coding-Agent Rules

Before implementation, contributors and coding agents must read:

1. `AGENTS.md`
2. `PROJECT_SOURCE_OF_TRUTH.md`
3. `NEXUS_LEARNING_OS_MIGRATION_PLAN.md`
4. `MVP_VERTICAL_SLICE_SPEC.md`
5. `LESSON_IMPORT_PLAN.md`
6. `LESSON_VALIDATION_RULES.md`
7. the active V2 and V3 lesson schemas
8. the relevant thinking-system specifications
9. safety and accessibility requirements

### Implementation rules

- Do not delete working V6 features during migration.
- Do not rewrite all seed lessons blindly.
- Add adapters before replacing consumers.
- Use typed contracts for learning evidence.
- Distinguish assisted from independent performance.
- Treat score bands as routing signals, not final mastery truth.
- Do not mark content approved without the required review state.
- Do not add child-facing AI behavior outside the tutor protocol.
- Do not build decorative features before the learning-state, feedback, memory, and evidence systems work.
- Report known limitations honestly.

---

## 27. Superseded and Deprecated Rules

The following are formally superseded:

- the requirement that every lesson contain all 16 legacy sections;
- the requirement that the Lesson Player always render the same 16 sections;
- the assumption that an immediate score of 80–89 proves complete mastery;
- the assumption that 90–100 automatically proves advanced transfer;
- undiagnosed repetition as the default reteach mechanism;
- static Memory Vault intervals with no performance adaptation;
- unrestricted AI assistance;
- the treatment of every thinking system as mandatory in every lesson.

The following remain active:

- three-academy product model;
- Grade 3, Grade 6, and Grade 9 MVP focus;
- 16 existing seed lessons until inventory changes;
- named thinking systems;
- retention and adaptive-learning mission;
- repository organization;
- safe child-centered design;
- accessibility requirements;
- parent/teacher visibility;
- standards tags and content validation.

---

## 28. Required V7 Migration Outcomes

V7 migration is complete only when:

1. this source-of-truth is installed at the repository root;
2. `AGENTS.md` no longer mandates the 16-step lesson structure;
3. a V2 compatibility adapter exists;
4. a V3 lesson schema and TypeScript contract exist;
5. the Lesson Player renders lesson-family modules;
6. validation supports V2 and V3;
7. the compliance matrix no longer checks for 16 sections as the universal rule;
8. skill learning states are persisted;
9. mastery evidence distinguishes current, retained, and transfer performance;
10. Memory Vault stores adaptive review evidence;
11. feedback includes diagnosis and action;
12. hint usage is logged;
13. the 16 seed lessons have migration status records;
14. at least one lesson from each academy is manually redesigned—not mechanically converted—to demonstrate the new model;
15. regression tests confirm current MVP routes still work.

---

## 29. Canonical Summary

The Nexus Learning OS is governed by this progression:

```text
Coherent Knowledge
      ↓
Clear Modeling
      ↓
First-Principles Deconstruction
      ↓
Deliberate Practice
      ↓
Disciplinary Reasoning
      ↓
Multiple Proofs of Learning
      ↓
Adaptive Retrieval and Retention
      ↓
Authentic Transfer
      ↓
Diagnosis and Adaptation
      ↓
Increasing Learner Independence
```

The platform’s defining promise is:

> **Teach students what they need to know, show them how knowledge works, train them to reason with it, help them remember it, and require them to use it independently.**

