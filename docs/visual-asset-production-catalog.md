# Nexus Learning OS Visual Asset Production Catalog

**Status:** Production planning baseline  
**Owner:** Visual Learning Agent with Curriculum, Teacher/Explanation, Tutor, Content Operations, and QA agents  
**Applies to:** Foundation Academy, Bridge Academy, Scholar Academy, lesson player, tutor, assessments, dashboards, classroom mode, and manager review

## Verified Real Generation Run

The first controlled production workflow was completed on 2026-07-17 for the Grade 6 ratios lesson:

- Slot: `g6-math-ratios-unit-rates-teaching-diagram-diagram`
- Asset: `asset-openai-g6-math-ratios-unit-rates-teaching-diagram-diagram-1784272201342`
- Model: `gpt-image-2`
- Output: PNG, 1024x1024 request, approximately 5.3 cents estimated cost
- Review: approved after prompt revision; review version 3 and three review-history entries were persisted
- Storage: Supabase Storage bucket `k12-visual-assets`
- Verification: the public asset returned HTTP 200 with `image/png`

Public verification asset: https://hqsydwjcpcammmfftyqi.supabase.co/storage/v1/object/public/k12-visual-assets/lessons/g6-math-ratios-unit-rates/asset-openai-g6-math-ratios-unit-rates-teaching-diagram-diagram-1784272201342.png

The direct Postgres connection still needs the correct database password. During this controlled run, the process used local repository mode only to avoid blocking the generation command, while the approved asset was uploaded and persisted through the real Supabase Storage and REST paths. The next hardening step is to correct `DATABASE_URL` and repeat the same run in Postgres mode.

## 1. Purpose

This catalog defines the visual assets the product needs to teach students directly. It is an implementation and production specification, not a list of decorative illustrations.

Every visual must answer three questions:

1. What learning decision or action does the visual support?
2. What should the student notice, say, build, solve, or revise after seeing it?
3. How will the visual be reused by the lesson player, tutor, assessment, parent, teacher, or later retrieval flow?

The product should use the simplest effective visual format. A generated illustration is appropriate for a phenomenon, setting, object, or context. A deterministic SVG, HTML canvas, chart, map, table, interactive board, or rendered equation is usually better for exact academic relationships. Generated images must never be used when precision, readable labels, or mathematical correctness depends on pixels that a model may distort.

## 2. Audited Scope

The catalog was derived from the canonical product source of truth, V7 migration/build documents, the existing visual backlog and agent, the lesson library generator, the eight pilot/showcase lessons, the Grade 6 Batch 1 plan, quiz/tutor requirements, and the current dashboard/admin workflows.

Current curriculum scale:

| Scope | Count |
|---|---:|
| Total planned lessons | 6,100 |
| Units | 436 |
| Foundation Academy K-5 lessons | 2,808 |
| Bridge Academy 6-8 lessons | 1,388 |
| Scholar Academy 9-12 lessons | 1,904 |
| Subjects | 10 |
| Lessons with group homework | 3,292 |
| Current pilot/showcase lessons | 8 |
| Current visual-agent slots | 58 |
| Current high-priority slots | 24 |

The 6,100 lessons currently have a baseline visual requirement in the generated library, but that requirement is too coarse for a student-facing teaching product. This document expands it into moment-level slots and a reusable asset system.

## 3. Asset Model

### 3.1 Three production tiers

Every requested visual belongs to one of these tiers:

| Tier | Use | Examples | Production method |
|---|---|---|---|
| Shared visual system | Reused across many lessons with data/configuration | fraction strip frame, CER board, discussion protocol, XP progress core | Human-designed component, SVG, CSS, canvas, or a reviewed master illustration |
| Lesson variant | Same visual family with lesson-specific labels/data/content | a particular ratio table, cell diagram, source card, weather graph | Deterministic renderer or template populated from lesson data |
| Bespoke concept asset | Unique phenomenon, setting, artifact, scene, or metaphor | ecosystem scene, ancient artifact, literary setting, AI architecture illustration | Human art or OpenAI-generated image, always review-gated |

The required catalog is a set of **slots**. A slot may be fulfilled by a shared master plus lesson data rather than a new bitmap. This is how the system can cover all lessons without unnecessary cost or visual inconsistency.

### 3.2 Canonical asset record

Each approved asset must have:

```text
assetId
lessonId or reusableFamilyId
unitId, courseId, grade, gradeBand, academyId, subject
placement
assetKind
title, caption, altText, learnerAction
sourcePrompt or rendererSpec
negativePrompt / safetyConstraints
visualVersion, sourceVersion, reviewVersion
rubricScores, grade, blockers, revisionInstructions
status: planned | prompt-review | generated | image-review | approved | rejected | published
storageProvider, storageBucket, storagePath, storagePublicUrl
approvedBy, approvedAt, publishedAt
revisionHistory and generationMetadata
```

### 3.3 Naming convention

Use:

```text
{academy}-{grade}-{subject}-{lesson-slug}-{placement}-{variant}
```

Examples:

```text
bridge-g6-math-ratios-unit-rates-teaching-diagram-double-number-line-v1
foundation-g3-science-mini-ecosystem-misconception-decomposers-v1
scholar-g9-biology-cells-assessment-stimulus-organelle-evidence-v1
shared-tutor-first-step-equation-balance-v1
```

## 4. Required Lesson-Moment Catalog

These are the visual moments the lesson player must support. They are not all shown at once; the player selects the relevant moment based on the lesson's active phase and the learner's state.

### 4.1 Foundation Academy K-5: 10 required slots per lesson

| ID | Placement | Teaching job | Required visual behavior |
|---|---|---|---|
| F01 | lesson hero | Create curiosity and context | One concrete object, scene, phenomenon, or character-free situation; student says what they notice |
| F02 | vocabulary anchor | Make new words memorable | Picture plus one short label, gesture, sound, or object connection; never a dense glossary |
| F03 | concrete-to-model | Connect real objects to a representation | Manipulatives, ten frames, story map, sound boxes, body movement, or simple system arrows |
| F04 | interactive model | Give the child something to move, sort, draw, trace, or assemble | Stable board with large targets and immediate descriptive feedback |
| F05 | worked example | Show one successful path | 3-5 visible steps with a single highlighted next move; audio narration may accompany it |
| F06 | practice feedback | Make the error visible and repairable | Show the child's current state, the relevant rule/model, and one next action |
| F07 | tutor help | Diagnose what the child is confused about | Choice cards for word, picture, first step, or “I do not know what to do” |
| F08 | misconception repair | Replace one common wrong model | Wrong idea and corrected model side by side, using labels and shapes rather than color alone |
| F09 | quiz stimulus | Support interpretation in an assessment | Number line, picture graph, passage card, sequence, map, or object set when the question needs it |
| F10 | Memory Vault | Support delayed retrieval | One uncluttered visual cue that can be shown after 24 hours, 3-7 days, and later spiral review |

Foundation art direction: high contrast, large shapes, warm but not visually noisy, concrete before symbolic, optional audio, minimal text, no babyish mascots required.

### 4.2 Bridge Academy 6-8: 12 required slots per lesson

| ID | Placement | Teaching job | Required visual behavior |
|---|---|---|---|
| B01 | mission hero | Establish a real problem, phenomenon, or quest | Mature context image or interactive opening prompt with one observable tension |
| B02 | concept model | Make the target relationship visible | Labeled diagram, graph, map, process, or model with a “what do you notice?” prompt |
| B03 | deconstruct/compare | Show how a solution or interpretation is built | Annotated parts, correct-versus-incorrect strategy, or compare/contrast frame |
| B04 | interactive model | Allow manipulation and prediction | Sliders, draggable values, sortable evidence, coordinate points, system toggles, or code trace |
| B05 | worked example/data card | Model expert thinking without hiding reasoning | Partially completed example, data table, source, lab setup, or evidence chain |
| B06 | tutor diagnosis | Help the student identify the exact stuck point | Confusion classifier visual: vocabulary, model, first step, reasoning, or transfer |
| B07 | tutor alternate explanation | Switch representation when the first explanation fails | Diagram, metaphor, real-world example, or first-principles card selected by the tutor |
| B08 | misconception repair | Repair a predictable middle-school error | Tempting shortcut versus durable reasoning, with the changed assumption called out |
| B09 | assessment stimulus | Make quiz/test evidence interpretable | Graph, map, source excerpt, table, model, diagram, or simulation state |
| B10 | answer/distractor explanation | Explain why options are right or wrong | Correct evidence highlighted; each important distractor tied to a misconception |
| B11 | Memory Vault | Support retrieval and transfer | Compact anchor model plus one new situation prompt |
| B12 | group mission workflow | Make collaboration executable | Roles, shared artifact, individual evidence, handoff points, and completion criteria |

Bridge art direction: cyber/neon academy-world styling is allowed around the learning model, but the model itself must remain crisp, readable, and evidence-focused. Avoid decorative neon behind graphs, equations, maps, or source text.

### 4.3 Scholar Academy 9-12: 13 required slots per lesson

| ID | Placement | Teaching job | Required visual behavior |
|---|---|---|---|
| S01 | course/phenomenon hero | Frame the disciplinary question | Professional context image, phenomenon, artifact, dataset, or problem statement |
| S02 | context/source frame | Establish historical, scientific, literary, or technical context | Source card, timeline, apparatus, citation-ready image, or context map |
| S03 | precise concept model | Represent the disciplinary structure | Clean model, proof architecture, molecular/physical system, rhetorical framework, or economic model |
| S04 | deconstruct/process | Expose expert reasoning | Annotated derivation, lab procedure, essay architecture, source comparison, or decision tree |
| S05 | interactive/data studio | Let the student test a claim or manipulate variables | Graphing, simulation, model revision, dataset filtering, code trace, or evidence comparison |
| S06 | worked example/lab record | Show a defensible solution or product | Full reasoning with assumptions, units, evidence, and quality checks visible |
| S07 | tutor diagnosis | Locate the student's conceptual or procedural gap | More granular than Bridge: definition, representation, assumption, method choice, reasoning, or transfer |
| S08 | tutor alternate explanation | Provide a second route without lowering rigor | Analogy, visual abstraction, first-principles reconstruction, worked counterexample, or source lens |
| S09 | misconception repair | Correct a durable advanced misconception | Counterexample, boundary condition, model failure, or “why the shortcut breaks” visual |
| S10 | assessment stimulus | Require interpretation, not recognition | Primary source, graph, map, data table, lab result, proof diagram, or design brief |
| S11 | answer/distractor explanation | Build exam-quality feedback | Evidence-to-conclusion chain and explanation of the most plausible wrong path |
| S12 | Memory Vault | Preserve important knowledge and method | Compact synthesis model with retrieval cue and transfer prompt |
| S13 | portfolio/group artifact | Turn learning into a defensible product | Research brief, lab poster, code architecture, argument map, design board, or team handoff |

Scholar art direction: precise, restrained, portfolio-quality diagrams and source visuals. Neon may signal navigation or state, but must not make the content look like a game screenshot.

## 5. Teaching-Moment Visual Families

These reusable families should be designed once and populated with lesson data.

### 5.1 Core instructional families

| Family | Variants to create | Used in |
|---|---|---|
| Concrete-to-abstract ladder | object -> drawing -> model -> symbols | Foundation math/science, Bridge math/science, Scholar quantitative subjects |
| See-build-explain-recall | notice, manipulate, explain, delayed retrieval frame | All bands |
| Worked-example ladder | full model, faded model, independent blank | All bands |
| Compare-strategies board | method A, method B, choose and defend | Math, ELA, science, CS, social studies |
| Claim-evidence-reasoning board | claim, evidence, reasoning, counterclaim | ELA, science, social studies, CS, Scholar writing |
| System map | parts, inputs, outputs, relationships, feedback | Science, social studies, economics, CS |
| Timeline and sequence | order, duration, turning point, consequence | ELA narrative, social studies, science cycles, project planning |
| Spatial/map frame | legend, scale, route, region, resource, boundary | Social studies, science, geometry, data |
| Data-to-conclusion frame | table -> graph -> pattern -> claim | Math, science, social studies, health, economics |
| Process/debug loop | reproduce, isolate, change one variable, test, log, fix | CS, math errors, lab science, writing revision |
| Decision matrix | options, criteria, evidence, trade-off, decision | Social studies, life skills, career, science design |
| Reflection/transfer card | what changed, why it matters, where else it applies | All bands |

### 5.2 Student confusion and tutor families

Create approved visual variants for each subject and band, not one generic tutor card:

1. Vocabulary confusion: word, plain-language definition, example, non-example, pronunciation or symbol.
2. Representation confusion: object/model/symbol translation.
3. First-step confusion: highlight only the first valid move.
4. Procedure confusion: show the sequence and the reason for each step.
5. Reasoning confusion: connect evidence to the conclusion.
6. Misconception: show the tempting wrong model and the condition it violates.
7. Transfer confusion: map the known example to the new situation.
8. Direct-answer seeking: show a hint ladder and a “you try next” checkpoint.
9. Test-reading confusion: mark what the question asks, what evidence matters, and what can be ignored.
10. Confidence/frustration: calm reset card with one smaller solvable step; do not use manipulative reward imagery.

Each family needs: Foundation, Bridge, Scholar, dark-mode/high-contrast, text-minimal, and screen-reader description variants.

## 6. Subject Asset Matrix

The following list is the minimum asset-family coverage for every subject. Each family should have shared masters, lesson-specific variants, misconception variants, assessment variants, and Memory Vault variants where the lesson uses the concept.

### 6.1 ELA / Reading

- Phoneme-grapheme mouth/letter map; sound boxes; blending path; syllable split cards.
- Vocabulary picture, context clue scene, morphology/root tree, synonym-antonym scale.
- Story mountain, character goal/change map, setting map, plot cause/effect chain.
- Main idea/detail/evidence organizer; claim-evidence-reasoning board.
- Annotation layers for key idea, evidence, inference, tone, structure, and unknown word.
- Theme/symbol/conflict triangle; point-of-view lens; compare-text matrix.
- Argument architecture: claim, reasons, evidence, explanation, counterclaim.
- Source reliability and citation map; research question funnel.
- Misconception cards: retell is not analysis, interesting detail is not evidence, quote is not explanation, theme is not one word, summary is not opinion.
- Quiz/test visuals: passage cards, annotation overlays, evidence choice cards, paired-text comparison panels.
- Tutor visuals: “show me the sentence,” “what changed,” “which detail proves it,” and “say the idea in your own words.”

### 6.2 Writing

- Idea-to-outline map; sentence-combining strips; paragraph architecture.
- Evidence integration sequence: introduce, quote/paraphrase, explain, link.
- Revision lenses: clarity, organization, evidence, style, conventions.
- Feedback protocol card; peer-review workflow; version comparison.
- Rhetorical triangle; audience-purpose-tone map; genre decision tree.
- Research synthesis matrix; citation/source trail.
- Misconception cards: more words is not better writing, grammar edits do not fix reasoning, thesis is not a topic, evidence without explanation is incomplete.
- Assessment visuals: prompt decomposition, rubric-to-draft map, annotated exemplar, revision decision cards.

### 6.3 Math

- Number lines, ratio tables, double number lines, tape diagrams, arrays, ten frames, base-ten blocks, fraction strips.
- Variable machines, balance models, expression trees, equation-step flowcharts.
- Coordinate planes, transformations, angle/shape diagrams, area/volume decomposition.
- Probability spinners, sample spaces, dot plots, histograms, box plots, mean/median/mode/spread visuals.
- Function machines, input-output tables, graph interpretation, slope/constant-rate models.
- Geometry proof frames, similarity/congruence maps, trigonometry circle, statistics inference frames.
- Error analysis cards: wrong operation, unit mismatch, sign error, illegal cancellation, graph misread, formula misuse, rounding too early.
- Assessment visuals: every required graph/table/number line/shape/map; correct-answer explanation; distractor diagnosis.
- Interactive visual modules: draggable points, adjustable ratios, sliders, graph overlays, equation balance, virtual manipulatives.

### 6.4 Science

- Phenomenon opener; observation/evidence/noticing frame.
- System diagrams with inputs, outputs, matter, energy, feedback, and scale.
- Cycles: water, rock, carbon, life cycles, energy flow, body systems.
- Lab setup, safety, apparatus labels, measurement and data-recording visuals.
- Data table -> graph -> model -> claim sequence.
- Model revision before/after; competing models; boundary conditions.
- Biology: cell/organelles, heredity, ecosystems, evolution, body systems.
- Chemistry: particle models, atoms, bonding, reactions, conservation, acids/bases.
- Physics/environmental: force diagrams, energy transfer, waves, circuits, climate and sustainability.
- Misconception cards: labels are not explanations, correlation is not cause, arrows have meaning, models are not reality, one cause rarely explains a system.
- Assessment visuals: diagrams, lab results, graphs, model comparison, phenomenon before/after.

### 6.5 Social Studies / History / Civics

- Physical, political, resource, migration, trade, and settlement maps.
- Timeline puzzle with turning points, overlapping events, duration, and consequence.
- Artifact/source cards with creator, date, audience, purpose, context, and limitations.
- Cause/effect web; continuity/change matrix; compare-perspectives board.
- Civilization system map: geography, government, economy, culture, technology, belief.
- Government process maps: branches, rights, elections, lawmaking, courts, civic action.
- Economics: supply/demand, incentives, trade-offs, budgets, markets, policy effects.
- Misconception cards: date memorization is not causation, one source is not the whole story, geography is not background-only, perspective is not automatically false, correlation is not causation.
- Assessment visuals: map, source excerpt, timeline, artifact image, policy decision chart, evidence comparison.

### 6.6 Computer Science / Digital Literacy / AI

- Algorithm sequence and pseudocode cards; flowcharts; loops; conditionals; decomposition.
- Input-process-output diagram; data structures; data flow; API request/response.
- Frontend/backend/database architecture; UI wireframe; state transition map.
- Debugging loop: observe, reproduce, isolate, hypothesize, change, test, log.
- Privacy and safety cards: safe/unsafe data, permission boundaries, phishing, strong passwords, public/private data.
- Prompt builder: goal, context, constraints, examples, output format, verification.
- AI system diagram: user -> app -> gateway -> model/tool -> review -> result.
- Agent/tool authorization matrix; human approval gate; fact-check/source ledger.
- Misconception cards: AI output is not automatically true, prompt length is not the same as clarity, debugging is not random guessing, frontend is not backend, a tool should not get unrestricted access.
- Assessment visuals: code trace, flowchart, UI bug, architecture diagram, data privacy scenario, test report.

### 6.7 Health / PE

- Body-system basics, movement patterns, warm-up/cool-down, safety sequences.
- Habit loop, sleep/food/movement/stress planning, decision tree, first-aid sequence.
- Consent/boundary/digital citizenship scenario cards with age-appropriate wording.
- Goal-setting and reflection map; activity tracking without unnecessary sensitive health data.
- Misconception cards: wellness is not perfection, intensity is not always better, safety is not optional, one habit does not fix every outcome.
- Assessment visuals: safe/unsafe scenario, sequence, routine plan, decision matrix.

### 6.8 Arts / Music / Media

- Shape/color/line/composition guides; critique lens; iteration board.
- Rhythm notation, pattern, melody, form, dynamics, and listening maps.
- Storyboard, shot list, framing, sound, edit, and publishing workflow.
- Creative brief, reference board, peer critique, revision comparison.
- Misconception cards: creativity is not copying, critique is not personal judgment, more effects do not equal better communication.
- Assessment visuals: identify design choices, compare compositions, annotate an artwork/media frame, plan a revision.

### 6.9 Life Skills / SEL

- Emotion vocabulary and intensity scale; situation-thought-feeling-action map.
- Routine planner, decision tree, communication script, conflict repair sequence.
- Goal decomposition, time blocking, prioritization, feedback and reflection loop.
- Digital reputation, teamwork roles, help-seeking and self-advocacy maps.
- Misconception cards: naming a feeling is not solving a problem, confidence is not certainty, conflict is not automatically failure.
- Assessment visuals: choose a response, order a process, identify evidence of a healthy plan, revise a communication script.

### 6.10 Career / College Readiness

- Interest/skill/pathway map; career cluster map; training and education pathway.
- Resume and portfolio architecture; application timeline; interview response framework.
- Cost/benefit/fit decision matrix; budgeting, credit, taxes, markets, and investing models.
- Project plan, risk register, stakeholder map, professional communication workflow.
- Misconception cards: a job title is not a career plan, salary is not the only fit criterion, a resume is not a list without evidence.
- Assessment visuals: compare pathways, annotate a resume, build a budget, decide between options with evidence.

## 7. Lesson-Type Asset Packs

Not every lesson is a standard explanation lesson. The content pipeline must select a pack by lesson purpose.

### Explanation lesson pack

Hero, concept model, worked example, interactive model, misconception repair, tutor card, assessment stimulus, Memory Vault.

### Practice/fluency lesson pack

Minimal hero, model/example, interactive practice board, error feedback states, hint ladder, mixed-practice stimulus, retrieval card. Do not generate a new decorative image for every question.

### Investigation/lab pack

Phenomenon, materials/safety setup, procedure sequence, variable/control diagram, data table/graph frame, model revision, claim-evidence-reasoning board, conclusion/transfer card.

### Reading/seminar pack

Context image or source frame, annotation layer, vocabulary/context card, evidence organizer, discussion protocol, perspective comparison, writing/assessment frame, Memory Vault.

### Project/design pack

Brief, constraints, role workflow, research/source board, planning canvas, prototype/revision board, rubric map, presentation/portfolio frame, reflection/transfer card.

### Review/test pack

Blueprint/coverage map, formula or vocabulary reference where allowed, stimulus library, answer-explanation cards, distractor diagnosis, confidence/error reflection, reteach route card.

## 8. Quiz and Test Asset Requirements

Every item must be classified before production:

| Class | Visual rule | Examples |
|---|---|---|
| Recall | No image unless it improves retrieval | vocabulary, definition, basic fact |
| Interpret | Visual recommended | chart, map, short passage, labeled model |
| Evidence | Visual required | graph, source, lab result, data table, diagram |
| Transfer | Visual or interactive stimulus required | new scenario, simulation state, design brief |

For every visual-required item, produce:

1. Student stimulus.
2. Accessible text equivalent or structured data equivalent.
3. Correct-answer explanation visual.
4. Distractor diagnosis for each meaningful wrong path.
5. Teacher/parent explanation note.
6. Reteach link to the relevant lesson visual.

Question visuals must be versioned independently from lesson visuals because assessments may be reused in different forms. Never place the answer inside the image. Avoid generated text for equations, maps, graph labels, and source excerpts; render those deterministically.

## 9. Dashboard, Classroom, Reward, and Agent Assets

### Student

- Academy world map with accessible subject routes.
- Level/XP core with numeric progress and non-color state labels.
- Subject world tiles and topic skill-tree nodes.
- Daily mission path with current, locked, review, and completed states.
- Tutor entry card and confusion-mode selector.
- Memory Vault reminder and retrieval streak.
- Reward preview, mastery badge, and non-monetary unlocks.
- Learning lab experiment card: hypothesis, action, result, next decision.
- Group mission room: role, shared artifact, individual evidence, handoff, due state.

### Parent

- Child selector and account-link status.
- Strength/struggle summary chart with plain-language explanation.
- Mastery evidence timeline, not only a single percentage.
- Suggested lesson/reteach card with reason.
- Tutor-help summary with privacy-safe topic and outcome.
- Reward approval card, budget/eligibility state, and audit trail.
- Weekly retention report: learned, remembered, transferred, needs review.
- Consent, privacy, and session/device status.

### Teacher and school

- Class roster mastery heatmap with accessible labels.
- Live class launch board and pacing state.
- Misconception cluster map and intervention queue.
- Group mission progress board with individual accountability.
- Exit-ticket distribution and next-day reteach suggestions.
- Assignment calendar, missing-work state, and evidence quality.
- Student support view with tutor recommendations and teacher override.

### Admin and manager review

- Lesson, prompt, image, tutor, source, and batch queue icons.
- A-F grade badges with category score breakdown.
- Revision-loop diagram: create -> grade -> improve -> regenerate -> grade -> approve -> store -> publish.
- Asset lineage/version history.
- Storage/CDN promotion status.
- Standards/source ledger cards.
- Safety blocker and policy status visuals.
- Batch quality gate and release decision board.

### Rewards and celebrations

Rewards should reinforce mastery, retention, transfer, reflection, and contribution, not raw screen time. Required assets:

- Mastery badge family by subject and grade band.
- Delayed-recall badge.
- Transfer badge.
- Helpful collaborator badge.
- Revision/debugging badge.
- Project/capstone badge.
- Subject level-up animation frames.
- Reward approval state, pending, approved, fulfilled, and rejected visuals.
- Non-monetary unlocks: avatar palettes, academy world items, portfolio themes, sound packs, and creative tools.

Money or gift-card imagery must never imply guaranteed payment. It must be shown only after parent approval, eligibility, budget, fraud checks, and provider confirmation.

## 10. Grade 6 Bridge Academy Batch 1 Priority Set

Before broad K-12 visual production, complete and approve the following asset families for the school-sellable wedge:

### Math

- Ratios and unit rates: double number line, ratio table, fair-deal comparison, decimal/money model, misconception cards, graph/table quiz stimuli.
- Expressions/equations: variable machine, balance model, step trace, error diagnosis, equation quiz visuals.
- Coordinate geometry: coordinate plane, quadrant/axis, movement vectors, distance/shape task, graph interpretation.
- Area/volume: decomposition, nets, unit cubes, formula-to-model bridge, measurement-error repairs.
- Statistics: dot plot, histogram, box plot, center/spread comparison, misleading graph repair.

### ELA and writing

- Close-reading annotation layers, claim/evidence board, theme/symbol/conflict triangle, source reliability board, argument paragraph architecture, revision map, discussion protocol.

### Science

- Weather/earth systems phenomenon, map symbols, evidence graph, system feedback, lab/safety setup, model revision, one-variable misconception repair.

### Social studies

- Early-human migration map, artifact/source frame, timeline puzzle, geography-resource-culture system map, evidence comparison, cause/effect decision board.

### Computer science and Learning AI

- Vocabulary card, frontend/backend/API/database architecture, prompt builder, tool gateway boundary, debugging loop, test plan, bug report, privacy card, agent review pipeline.

### Batch 1 acceptance

Every Batch 1 lesson must have all required slots for its lesson type, a reviewed alt text, deterministic data visuals where precision matters, at least a B on the visual rubric, a linked storage-backed approved asset, and a browser-verified render in the student lesson player.

## 11. Production Counts and Capacity Plan

The following are **catalog slots**, not a promise to generate every slot as a separate bitmap:

| Band | Lessons | Slots per lesson | Catalog slots |
|---|---:|---:|---:|
| Foundation K-5 | 2,808 | 10 | 28,080 |
| Bridge 6-8 | 1,388 | 12 | 16,656 |
| Scholar 9-12 | 1,904 | 13 | 24,752 |
| **Total** | **6,100** | — | **69,488** |

Recommended unique-asset strategy:

- Build shared master families first.
- Render exact lesson variants from data whenever the visual is a graph, table, equation, map, timeline, or labeled model.
- Generate bespoke images only for phenomena, settings, artifacts, object collections, and metaphors that genuinely improve understanding.
- Reuse tutor, misconception, workflow, dashboard, and assessment explanation templates across lessons.
- Store every lesson-specific mapping even when the binary asset is shared.

This turns 69,488 teaching slots into a manageable combination of shared masters, deterministic variants, and reviewed bespoke assets.

## 12. Generation and Review Pipeline

The catalog is executable in the application through:

- `getLessonVisualCatalog(lesson)`: returns the phase-level slot plan for one lesson.
- `getFullLibraryVisualSlotManifest()`: returns the complete lesson-to-slot manifest for batch tooling.
- `getFullLibraryVisualCatalogSummary()`: returns lesson, slot, band, subject, placement, linked-asset, and production-ready coverage counts.
- `getVisualProductionBatchPlan()`: resolves lesson-production batches into visual work packages with required slots, placement counts, linked/ready counts, and an explicit visual gate state.
- `getVisualLearningAgentAudit(state)`: keeps the interactive pilot review queue focused while exposing the full catalog summary to the manager view.

The batch planner prioritizes the Grade 6 school wedge in this order: Math, Science, ELA, Social Studies, Computer Science, then the remaining subjects and grade bands.

1. Curriculum or lesson agent creates a slot with objective, learner action, placement, and asset type.
2. Visual agent writes the source prompt or renderer specification.
3. Lesson grader checks instructional alignment and age fit.
4. Prompt grader checks clarity, safety, text limitations, and visual feasibility.
5. Deterministic renderer or approved image provider creates the candidate.
6. Generated visual grader checks instructional value, visual clarity, accessibility, safety, and technical quality.
7. Manager review UI records A-F grade, blockers, revision instructions, and revision history.
8. Low-quality or unsafe artifacts stop at review and return to the originating agent.
9. Approved assets are promoted to Supabase Storage/CDN with immutable version metadata.
10. Lesson publishing links the approved asset id and verifies the student-facing render.
11. Student/teacher feedback and tutor-help outcomes feed the next revision or replacement decision.

No student should see a generated visual that is still in `generated`, `image-review`, `rejected`, or `approved-pending-storage` status.

## 13. Asset Acceptance Checklist

An asset passes only when all required checks are true:

- It teaches the exact objective or supports the exact learner action.
- It is appropriate for the grade band and subject.
- The learner can tell what to look at and what to do next.
- The model is factually, mathematically, scientifically, historically, or linguistically correct.
- Labels are short, readable, and rendered deterministically when precision matters.
- Alt text and a text/data equivalent exist.
- Meaning does not depend on color alone.
- It does not expose personal data or use real children/identifiable people.
- It does not contain unsafe, frightening, branded, or copyrighted character material.
- It works in the lesson player at desktop and mobile widths.
- It has an approved storage-backed URL before publication.
- The tutor can select it for an appropriate confusion type.
- The quiz/test can link to it when the visual is assessment evidence.
- The manager review record contains grade, scores, blockers, and revision history.

Minimum release grade: **B**. An A is preferred for core teaching models, misconception repairs, assessment stimuli, and shared tutor assets.

## 14. Implementation Backlog

### P0: pilot release gate

1. Complete the eight pilot/showcase lesson slot mappings.
2. Produce missing heroes, teaching diagrams, tutor cards, misconception repairs, and group workflows.
3. Add quiz stimulus, answer explanation, and distractor diagnosis visuals for Ratio Quest and Learning AI.
4. Promote approved pilot assets to Supabase Storage.
5. Verify every approved asset appears in the student lesson player and tutor path.

### P1: Grade 6 Batch 1

1. Build shared visual masters for math, ELA, science, social studies, and CS/AI.
2. Implement deterministic renderers for graphs, tables, equations, maps, timelines, code traces, and evidence organizers.
3. Generate and review Batch 1 bespoke phenomenon/context assets.
4. Add assessment and group-work assets.
5. Link approved assets from draft ids to published lesson ids during publication.
6. Run the batch-quality gate before the next batch starts.

The first Batch 1 package now includes deterministic, review-metadata-complete SVG assets for eight placements on each of the five seeded Grade 6 lessons: hero, teaching diagram, tutor, misconception repair, group homework, assessment stimulus, answer explanation, and Memory Vault. These assets are still subject to the manager/content publication gate and can be replaced by reviewed image-generation outputs later.

### P2: product-wide support visuals

1. Complete student, parent, teacher, and admin dashboards.
2. Complete tutor confusion-mode visual library.
3. Complete reward, level, Memory Vault, and learning-lab visual states.
4. Add reusable classroom protocols and portfolio templates.

### P3: full K-12 expansion

1. Expand shared subject families by grade band.
2. Generate lesson variants from approved templates.
3. Add bespoke assets only when the curriculum review identifies a real comprehension benefit.
4. Audit coverage, accessibility, reuse, cost, and learner outcomes each production wave.

## 15. Definition of Done

The visual system is production-ready when the app can show, for any published lesson:

- the correct phase-specific visual;
- a usable interactive or deterministic model when needed;
- a tutor-selected visual matched to the student's stated confusion;
- a misconception repair visual after an error;
- an accessible quiz/test stimulus and explanation;
- a delayed-retrieval Memory Vault cue;
- group-work or portfolio visuals when the lesson requires collaboration;
- an approved storage-backed asset with complete review history;
- and a safe fallback when no approved visual exists.

The next work should remain focused on the eight pilots and Bridge Academy Grade 6 Batch 1 until this definition of done is verified end to end.
