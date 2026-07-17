# Visual Asset Master Backlog

Purpose: define every image, diagram, visual prompt, quiz/test visual, tutor visual, reward visual, classroom visual, and future lesson visual pattern needed to make the app feel like it is directly teaching the student.

This backlog is the source for the Visual Learning Agent, OpenAI image generation, human review, Supabase Storage promotion, and lesson publishing. It should be treated as a production content plan, not decoration.

For the complete moment-level catalog, subject matrix, grade-band slot requirements, production counts, naming convention, and definition of done, use [`visual-asset-production-catalog.md`](visual-asset-production-catalog.md). This file remains the live prioritized backlog; the catalog is the broader production specification behind it.

## Current Inventory

- Current pilot/showcase lessons: 8
- Current catalog lessons including published copies: 16
- Current visual-agent slots: 58
- High-priority slots: 24
- Slot breakdown:
  - Lesson hero: 8
  - Teaching diagram: 8
  - AI tutor visual: 8
  - Misconception repair: 16
  - Group homework workflow: 4
  - Content draft visual plan: 14
- Generated K-12 blueprint library: 6,100 lesson blueprints
- Generated visual requirement count: 6,100 baseline visuals before richer per-phase expansion

## Production Rule

Every student-facing lesson needs visual support at the exact moment the student needs it. The minimum production set for a real lesson is:

1. Lesson hero or phenomenon image.
2. Core teaching diagram.
3. Interactive task visual or manipulative board.
4. Tutor stuck-point visual.
5. Misconception repair visual.
6. Quiz/test evidence visual when the question depends on interpretation.
7. Summary/Memory Vault visual for later recall.
8. Group-work workflow visual for grades 6-12 when collaboration is assigned.

No lesson should be considered production-ready if it only has a decorative header image.

## Style And Accessibility Rules

All assets must follow these rules:

- Cyber/neon academy-world style for Bridge Academy, but labels must stay readable.
- Foundation Academy visuals should be bright, concrete, large, friendly, and low-text.
- Scholar Academy visuals should be precise, professional, and portfolio-ready.
- Use short labels only; avoid text-heavy generated images.
- Do not depict real children, private data, school logos, branded characters, copyrighted characters, or unsafe scenes.
- Do not rely only on color. Use labels, shapes, arrows, icons, and contrast.
- Every asset needs alt text, caption, placement, lesson id, grade, subject, review checklist, and source prompt.
- Any OpenAI-generated image starts in review status, then must be approved, promoted to storage, and linked to the lesson.

## Asset Types We Need

### Lesson Teaching Assets

- `lesson-hero`: first visual the student sees; creates curiosity and context.
- `teaching-diagram`: labeled explanation model; makes the concept visible.
- `interactive-model`: visual board or manipulative used by the student.
- `worked-example`: step-by-step example with a correct path.
- `compare-strategies`: side-by-side comparison of two methods or explanations.
- `summary-card`: concise visual recap for the end of the lesson.
- `memory-vault-card`: recall image used after 24 hours, 3-7 days, and later spiral review.

### Tutor Assets

- `ai-tutor`: reusable help card shown when the learner asks what they do not understand.
- `first-step-card`: tiny visual showing the first move without giving the full answer.
- `visual-model-hint`: diagram the tutor can point to when the learner asks for a picture.
- `metaphor-card`: visual metaphor when the student needs an analogy.
- `first-principles-card`: shows what is known, what changes, and what must stay true.
- `retry-card`: shows the corrected smaller task after a hint.

### Misconception Assets

- `mistake-and-fix`: wrong idea beside corrected reasoning.
- `trap-card`: shows a tempting but incorrect shortcut.
- `diagnosis-card`: helps the tutor classify the confusion.
- `self-check-card`: learner checks their own work against the visual evidence.

### Quiz And Test Assets

- `question-stimulus`: image, graph, map, model, passage card, table, or diagram used by a question.
- `answer-explanation`: post-answer visual that explains why the correct answer works.
- `distractor-diagnosis`: visual showing why each wrong answer is tempting but wrong.
- `mastery-proof`: visual prompt requiring transfer, not recall.
- `test-readiness-card`: short checklist visual before a unit test.

### Classroom And Group Assets

- `group-homework`: role workflow and shared artifact map.
- `class-session-board`: live class launch visual for teachers and students.
- `lab-setup`: safety and materials diagram.
- `artifact-template`: visual layout for a group product.
- `discussion-protocol`: turn-taking and evidence sentence stems.

### Platform Assets

- Student level and XP progress visuals.
- Subject world icons.
- Reward chest/card visuals.
- Parent progress summary visuals.
- Teacher intervention and class heatmap visuals.
- Admin review queue icons and status diagrams.
- Agent workflow diagrams that explain what each agent does.

## Priority Order

1. Current 8 pilot/showcase lessons: complete all required visual slots.
2. Published copies of the same lessons: ensure they use approved storage-backed assets.
3. Grade 6 Bridge Academy Batch 1: math, ELA, science, social studies, computer science.
4. Quiz and test visual assets for Grade 6 math first.
5. Tutor visual library for common stuck points across Grade 6.
6. Parent/teacher dashboard visuals.
7. Full K-12 production library.

## Current Pilot And Showcase Lesson Asset List

### 1. Fractions On A Number Line

Lesson id: `g3-fractions-number-line`

Grade: 3

Subject: Math

Current need: move from inline/simple visuals to polished, reviewed, storage-backed visual assets.

Required assets:

- `lesson-hero`: Fraction path image.
  - Shows: number line from 0 to 1 with equal jumps for halves, thirds, and fourths.
  - Student action: notice equal spaces before naming fractions.
  - Style: bright Foundation Academy, large labels, friendly math path.
- `teaching-diagram`: Strip to floor path to number line.
  - Shows: same whole as a strip, same whole as a walking path, same whole as a drawn number line.
  - Labels: whole interval, equal spaces, same point.
  - Student action: point to spaces, not tick marks.
- `interactive-model`: Build-a-number-line board.
  - Shows: draggable/fill-in fraction tiles, endpoints 0 and 1, equal-space markers.
  - Student action: place 1/2, 1/3, 1/4, then explain.
- `ai-tutor`: Fraction stuck-point help card.
  - Shows: three choices: finding the whole, making equal spaces, placing the fraction.
  - Student action: choose exactly where they are confused.
- `misconception-repair-1`: Tick marks vs spaces.
  - Wrong side: counting tick marks.
  - Fix side: counting equal spaces between endpoints.
- `misconception-repair-2`: Unequal spaces.
  - Wrong side: random gaps on number line.
  - Fix side: same-size spaces from 0 to 1.
- `quiz-stimulus-1`: Number line with missing fraction.
  - Used for: identifying a point based on equal partitions.
- `quiz-explanation-1`: Why the answer is correct.
  - Shows: count the spaces, then locate the point.
- `memory-vault-card`: Equal spaces rule.
  - Shows: 0, 1, equal jumps, "fractions live in spaces."

### 2. Main Idea Detective

Lesson id: `g3-ela-main-idea-evidence`

Grade: 3

Subject: ELA

Required assets:

- `lesson-hero`: Detective clue board.
  - Shows: main idea card in the center, detail cards around it, one distractor card off to the side.
  - Student action: choose which details prove the big idea.
- `teaching-diagram`: Main idea proof triangle.
  - Shows: claim/main idea at top, two proof details below, distractor outside.
  - Labels: main idea, proof detail, distractor detail.
- `interactive-model`: Detail sorting board.
  - Shows: bins for "proves it," "interesting but not proof," and "not in the text."
  - Student action: sort evidence cards.
- `ai-tutor`: Big idea stuck card.
  - Shows: three stuck points: finding big idea, choosing proof, rejecting distractors.
- `misconception-repair-1`: First sentence is not always the main idea.
  - Wrong side: automatically choosing first sentence.
  - Fix side: checking all details.
- `misconception-repair-2`: Favorite detail is not proof.
  - Wrong side: choosing the coolest fact.
  - Fix side: choosing detail that supports the central idea.
- `quiz-stimulus-1`: Short paragraph with evidence cards.
  - Used for: choosing best main idea.
- `quiz-stimulus-2`: Main idea plus four possible proof details.
  - Used for: selecting relevant evidence.
- `memory-vault-card`: Claim plus proof.
  - Shows: "big idea + two proof details."

### 3. Build A Mini Ecosystem

Lesson id: `g3-science-mini-ecosystem`

Grade: 3

Subject: Science

Required assets:

- `lesson-hero`: Mini ecosystem image.
  - Shows: sun, plants, insects, soil, water, and food connection.
  - Student action: name living and nonliving parts.
- `teaching-diagram`: Dependency arrows.
  - Shows: energy source, dependency arrow, system change.
  - Student action: read every arrow as "depends on" or "gives to."
- `interactive-model`: Remove-one-part ecosystem board.
  - Shows: ecosystem pieces that can be removed to see what changes.
  - Student action: predict and explain the change.
- `ai-tutor`: Ecosystem stuck card.
  - Shows: living parts, nonliving parts, arrows, and what changes.
- `misconception-repair-1`: Animals are not the only important parts.
  - Wrong side: animal-only ecosystem.
  - Fix side: sun, plants, water, soil, insects, decomposers.
- `misconception-repair-2`: Arrows are relationships, not decoration.
  - Wrong side: random arrows.
  - Fix side: labeled dependency arrows.
- `quiz-stimulus-1`: Ecosystem with one missing component.
  - Used for: predicting system impact.
- `quiz-explanation-1`: How energy moves through the system.
- `memory-vault-card`: Systems change when parts change.

### 4. Map A Community Region

Lesson id: `g3-social-regions-community-map`

Grade: 3

Subject: Social Studies

Required assets:

- `lesson-hero`: Community region map.
  - Shows: river, road, farm, town center, park, school, compass rose.
  - Student action: notice symbols and real places.
- `teaching-diagram`: Map symbols and resources.
  - Shows: compass rose, map symbol, local resource.
  - Student action: explain what a symbol stands for.
- `interactive-model`: Floor map mission board.
  - Shows: routes, landmarks, resource cards, direction arrows.
  - Student action: plan a path and explain how resources support the community.
- `ai-tutor`: Map stuck card.
  - Shows: directions, symbols, resources, and region description.
- `misconception-repair-1`: Symbols are not decorations.
  - Wrong side: random icons.
  - Fix side: icon linked to real place/function.
- `misconception-repair-2`: Region is not one building.
  - Wrong side: only a school building.
  - Fix side: land, water, weather, people, and resources together.
- `quiz-stimulus-1`: Map with symbols and compass.
  - Used for: interpreting location and resources.
- `quiz-explanation-1`: How to use compass plus symbol key.
- `memory-vault-card`: Symbol means real place.

### 5. Ratio Quest: Build A Better Deal

Lesson id: `g6-math-ratios-unit-rates`

Grade: 6

Subject: Math

Required assets:

- `lesson-hero`: Neon market comparison board.
  - Shows: two snack deals, ratio tables, double number lines, unit price callouts.
  - Student action: make a first guess, then demand fair evidence.
- `teaching-diagram`: Ratio relationship model.
  - Shows: ratio pair, scale factor, unit rate.
  - Student action: connect table, double number line, and unit rate.
- `interactive-model`: Ratio table and double-number-line widget.
  - Shows: two linked representations that update together.
  - Student action: scale quantities and calculate unit rate.
- `worked-example`: Correct fair-comparison path.
  - Shows: Deal A and Deal B reduced to price per item.
- `compare-strategies`: Additive vs multiplicative scaling.
  - Shows: why adding the same number does not preserve ratio.
- `ai-tutor`: Ratio stuck card.
  - Shows: ratio meaning, scaling, double number line, unit rate.
- `misconception-repair-1`: Additive scaling trap.
  - Wrong side: adding same number.
  - Fix side: multiplying both quantities by same scale factor.
- `misconception-repair-2`: Lower total price trap.
  - Wrong side: choosing cheaper total.
  - Fix side: compare price per one item.
- `misconception-repair-3`: Reversed labels trap.
  - Wrong side: dollars per ticket reversed as tickets per dollar without noticing.
  - Fix side: label every quantity and unit.
- `quiz-stimulus-1`: Pencils cost-per-unit question.
  - Shows: 6 pencils for $3.
- `quiz-stimulus-2`: Equivalent juice ratio cards.
  - Shows: table/card set with equivalent and non-equivalent ratios.
- `quiz-stimulus-3`: Ticket deal comparison.
  - Shows: Deal A 4 for $12, Deal B 6 for $15.
- `answer-explanation-set`: one visual explanation for each quiz item.
- `group-homework`: Better deal crew workflow.
  - Shows: price checker, table builder, number-line mapper, skeptic, presenter.
- `memory-vault-card`: Fair comparison means same unit.

### 6. Reading Weather Patterns

Lesson id: `g6-earth-systems-weather`

Grade: 6

Subject: Science

Required assets:

- `lesson-hero`: Forecast studio weather map.
  - Shows: pressure zones, wind arrows, clouds, temperature bands.
  - Student action: gather at least two pieces of evidence.
- `teaching-diagram`: Weather evidence model.
  - Shows: pressure zone, wind arrow, evidence claim.
  - Student action: connect map symbol to prediction.
- `interactive-model`: Forecast evidence board.
  - Shows: pressure, wind, temperature, clouds, forecast claim, confidence meter.
  - Student action: build forecast from evidence, then revise.
- `worked-example`: Claim-evidence-reasoning forecast.
  - Shows: current map data -> claim -> reason -> confidence.
- `ai-tutor`: Weather stuck card.
  - Shows: pressure, wind arrows, data tables, and evidence-to-forecast.
- `misconception-repair-1`: One symbol is not enough.
  - Wrong side: forecast from one cloud icon.
  - Fix side: pressure plus wind plus temperature evidence.
- `misconception-repair-2`: Wrong forecast does not mean useless model.
  - Wrong side: method failed forever.
  - Fix side: compare prediction to actuals and revise the rule.
- `quiz-stimulus-1`: Current pressure map.
  - Used for: best evidence for short-term forecast.
- `quiz-stimulus-2`: Falling pressure scenario.
  - Used for: predicting likely stormy change.
- `group-homework`: Forecast crew workflow.
  - Shows: data collector, map reader, claim writer, skeptic, presenter.
- `memory-vault-card`: Forecasts improve with evidence and revision.

### 7. Cell Structure And Function

Lesson id: `g9-biology-cells`

Grade: 9

Subject: Biology

Required assets:

- `lesson-hero`: Cell systems image.
  - Shows: labeled cell structures connected to jobs.
  - Student action: connect structure to function before memorizing names.
- `teaching-diagram`: Function categories.
  - Shows: information, energy, boundary, transport, structure.
  - Student action: classify each organelle by job.
- `interactive-model`: Cell failure diagnosis board.
  - Shows: symptom cards, organelle cards, evidence board.
  - Student action: diagnose which structure explains the evidence.
- `worked-example`: Organelle failure CER.
  - Shows: claim, evidence, reasoning.
- `ai-tutor`: Cell stuck card.
  - Shows: names, jobs, evidence, plant/animal comparison.
- `misconception-repair-1`: Names without jobs.
  - Wrong side: memorized label list.
  - Fix side: what breaks if the structure stops working.
- `misconception-repair-2`: Cell wall vs cell membrane.
  - Wrong side: both called protection.
  - Fix side: wall support vs membrane controlled movement.
- `quiz-stimulus-1`: Cell diagram with highlighted structure.
- `quiz-stimulus-2`: Failure symptom card.
- `group-homework`: Organelle emergency room workflow.
  - Shows: systems doctor, evidence analyst, diagram designer, skeptic, presenter.
- `memory-vault-card`: Structure explains function.

### 8. Learning AI

Lesson id: `g6-learning-ai-build-test`

Grade: 6

Subject: Computer Science / AI Literacy

Required assets:

- `lesson-hero`: AI builder system map.
  - Shows: student idea, prompt, AI model, frontend, backend, API, database, tests, bug reports, final project.
  - Student action: see AI as a system they control and check.
- `teaching-diagram`: Frontend/backend/AI/data flow.
  - Shows: prompt and context, frontend and backend, test/debug loop, agent/tool boundary.
  - Student action: explain what each part does.
- `interactive-model`: Build a tiny app blueprint board.
  - Shows: app goal, screen sketch, data needed, backend action, test case, bug report.
  - Student action: fill the blueprint and debug one case.
- `definition-card-set`: AI, prompt, model, context, output, frontend, backend, API, database, bug, test, agent, tool.
  - Shows: one icon and one student-friendly definition per term.
- `prompt-builder-card`: Goal, context, constraints, example, check.
  - Student action: write a better prompt.
- `bug-loop-card`: reproduce, isolate, fix, retest.
  - Student action: test a project before trusting it.
- `ai-tutor`: AI builder stuck card.
  - Shows: definitions, prompt writing, frontend/backend, testing, privacy/safety.
- `misconception-repair-1`: AI always knows the truth.
  - Wrong side: trusting output without checking.
  - Fix side: check facts, sources, and tests.
- `misconception-repair-2`: Frontend and backend are the same.
  - Wrong side: all app parts in one box.
  - Fix side: restaurant metaphor with menu/table service vs kitchen/order system.
- `misconception-repair-3`: Prompting is magic.
  - Wrong side: vague "make it good."
  - Fix side: goal, context, constraints, example.
- `misconception-repair-4`: A passing screen means the app works.
  - Wrong side: looks good equals correct.
  - Fix side: test expected behavior and edge cases.
- `misconception-repair-5`: Agents can do anything.
  - Wrong side: unlimited agent.
  - Fix side: role, permissions, tools, logs, human review.
- `misconception-repair-6`: Sharing private data helps AI.
  - Wrong side: entering personal details.
  - Fix side: use safe examples and remove private data.
- `quiz-stimulus-set`: five image-backed quiz cards.
  - Prompt quality card.
  - Frontend/backend sorting card.
  - Bug report selection card.
  - Privacy-safe AI use card.
  - Agent/tool boundary card.
- `group-homework`: AI builder crew workflow.
  - Shows: product thinker, prompt engineer, frontend mapper, backend mapper, tester, safety reviewer.
- `memory-vault-card`: Human goal, AI help, human check.

## Published Pilot Copies

The published copies should not receive separate concept art unless the lesson content diverges. They should reference approved storage-backed versions of the pilot assets above:

- `published-draft-pilot-g3-fractions-number-line`
- `published-draft-pilot-g3-ela-main-idea-evidence`
- `published-draft-pilot-g3-science-mini-ecosystem`
- `published-draft-pilot-g3-social-regions-community-map`
- `published-draft-pilot-g6-math-ratios-unit-rates`
- `published-draft-pilot-g6-earth-systems-weather`
- `published-draft-pilot-g9-biology-cells`
- `published-draft-pilot-g6-learning-ai-build-test`

Required action: map each published lesson to the approved visual asset ids after manager approval.

## Current Draft Visual Plan Assets

These draft lessons need at least one content-draft visual before publication. Once promoted to real lessons, each needs the full production set.

- `draft-next-wave-foundation-k-ela-u1-l1`: Letters and sounds visual plan.
- `draft-next-wave-foundation-k-ela-u1-l2`: Letters and sounds visual plan.
- `draft-next-wave-foundation-k-ela-u1-l3`: Letters and sounds visual plan.
- `draft-next-wave-foundation-k-ela-u1-l4`: Letters and sounds visual plan.
- `draft-next-wave-foundation-3-ela-u1-l1`: Context clues visual plan.
- `draft-next-wave-bridge-6-ela-u1-l1`: Myth Lab hero journey, symbol, conflict, theme evidence board.
- `draft-next-wave-bridge-8-ela-u1-l1`: Dystopian fiction setting, control, conflict, theme visual plan.
- `draft-next-wave-scholar-9-english-9-u1-l1`: Short story structure and evidence visual plan.
- `draft-next-wave-scholar-12-english-12-u1-l1`: British/world literature context and theme visual plan.
- `draft-bridge-g6-batch1-math-ratios-rate-lab`: Ratio Lab fair comparison visual plan.
- `draft-bridge-g6-batch1-math-expressions-machine`: Variable machine visual plan.
- `draft-bridge-g6-batch1-science-weather-systems`: Weather evidence lab visual plan.
- `draft-bridge-g6-batch1-ela-close-reading-evidence`: Evidence Quest claim/proof visual plan.
- `draft-bridge-g6-batch1-social-early-humans-map`: Human Journey map/artifact/geography visual plan.

## Grade 6 Bridge Academy Batch 1 Assets

This is the school-sellable middle-school wedge. These should be generated before expanding other grades.

### Grade 6 Math

Needed asset families:

- Ratio table and double number line diagrams.
- Unit rate fair-comparison boards.
- Variable machine diagrams.
- Expression evaluation flowcharts.
- Coordinate plane maps.
- Area/volume decomposition diagrams.
- Statistics dot plot, histogram, box plot, and mean/median balance visuals.
- Mistake/fix cards for additive reasoning, variable confusion, sign errors, formula misuse, and data spread.
- Quiz stimuli for every math question that requires interpretation.
- Unit test visual set: one page per unit with graph/table/diagram evidence.

### Grade 6 ELA

Needed asset families:

- Annotation overlays for passages.
- Claim-evidence-reasoning organizer.
- Theme/symbol/conflict triangle.
- Vocabulary context clue scene cards.
- Argument paragraph structure diagram.
- Research source reliability traffic-light board.
- Discussion protocol cards.
- Misconception repairs for summary without evidence, quote without explanation, vague claim, and theme as one word.

### Grade 6 Science

Needed asset families:

- Phenomenon images that start each lesson.
- System diagrams with inputs, outputs, feedback, and scale.
- Lab setup diagrams.
- Data table to graph transformation visuals.
- Claim-evidence-reasoning boards.
- Model revision before/after visuals.
- Misconception repairs for memorized terms, one-cause explanations, graph misreads, and model-as-fact thinking.

### Grade 6 Social Studies

Needed asset families:

- Map labs with terrain, movement, resources, and settlement patterns.
- Artifact investigation boards.
- Timeline puzzle strips.
- Primary-source reliability frames.
- Cause/effect decision diagrams.
- Ancient civilization system maps: geography, economy, government, culture, technology.
- Misconception repairs for memorizing dates, ignoring geography, treating all sources as equally reliable, and single-cause explanations.

### Grade 6 Computer Science / AI

Needed asset families:

- Algorithm flowcharts.
- Input-process-output diagrams.
- Data privacy safe/unsafe cards.
- AI prompt builder cards.
- Frontend/backend/API/database architecture maps.
- Debugging loop visuals.
- Agent/tool permission diagrams.
- Misconception repairs for AI truth, privacy oversharing, vague prompts, and untested projects.

## Full K-12 Library Visual Requirements

The generated library currently plans 6,100 lesson blueprints. Minimum baseline: one reviewed visual per blueprint. Production target: 5-8 assets per lesson depending on grade band and subject.

### Foundation Academy K-5

Baseline per lesson:

- Hero object/image.
- Concrete manipulative diagram.
- Interactive board.
- Tutor help card.
- Mistake/fix visual.
- Memory Vault recall card.

Subject patterns:

- ELA: phonics mouth/letter maps, sound boxes, story maps, vocabulary picture cards, main idea/evidence boards.
- Writing: sentence-building strips, paragraph hamburger alternatives, revision check cards, idea-to-draft maps.
- Math: ten frames, number lines, fraction strips, base-ten blocks, arrays, measurement diagrams, concrete-to-symbolic transitions.
- Science: observation photos/illustrations, life cycles, system arrows, cause/effect boards, simple lab setup cards.
- Social studies: maps, timelines, community role cards, needs/resources diagrams, artifact cards.
- Health/PE: routine cards, safety sequence images, body systems basics, movement diagrams.
- Arts/media: composition guides, rhythm pattern visuals, storyboard panels.
- Computer science: sequencing cards, loop patterns, robot path maps, condition cards.
- Life skills: emotion maps, routine planners, choice/consequence cards.

### Bridge Academy 6-8

Baseline per lesson:

- Quest/mission hero.
- Concept model.
- Interactive model.
- Worked example or source/data card.
- Misconception repair.
- Tutor visual.
- Quiz/test stimulus visual.
- Memory Vault card.
- Group workflow visual when assigned.

Subject patterns:

- Math: ratio tables, number lines, coordinate planes, algebra machines, geometry decompositions, statistics graphs, function maps.
- ELA/writing: annotation layers, evidence boards, argument maps, revision flows, discussion stems.
- Science: phenomenon images, system models, lab setups, data graphs, model-revision boards.
- Social studies: maps, timelines, source frames, trade/government/culture system maps, decision simulations.
- Computer science: algorithms, app architecture, data flow, debugging, AI safety, agent/tool boundaries.
- Arts/media: design critique boards, storyboard, composition, media production workflow.
- Health/PE/life skills: habit loops, wellness planning, conflict resolution maps, digital citizenship scenarios.

### Scholar Academy 9-12

Baseline per lesson:

- Course-level concept visual.
- Precise diagram/model.
- Data/source stimulus.
- Worked example or lab/process diagram.
- Misconception repair.
- Tutor support card.
- Assessment stimulus.
- Portfolio artifact template.

Subject patterns:

- English: rhetorical triangle, evidence synthesis boards, literary context maps, essay architecture.
- Advanced math: function transformations, geometry proofs, trigonometry unit circle, statistics inference, calculus preview diagrams if added later.
- Biology/chemistry/physics: cell/process diagrams, molecular models, lab setups, force/energy systems, data plots.
- History/government/economics: source comparison, causation webs, constitutional process maps, market models.
- Career/college: resume/portfolio maps, decision matrices, project planning boards.

## Quiz And Test Visual Policy

Every quiz/test item should be classified as one of these:

- No visual needed: pure vocabulary or short recall.
- Visual recommended: explanation improves with a picture.
- Visual required: question cannot be answered well without a graph, map, model, diagram, table, passage card, or source image.

Required visual quiz assets:

- Math: tables, graphs, number lines, shape diagrams, coordinate grids, ratio cards.
- Science: diagrams, data tables, graphs, lab setups, models, before/after phenomena.
- ELA: passage cards, annotation layers, evidence cards, claim/detail organizers.
- Social studies: maps, timelines, source cards, artifact images, decision charts.
- Computer science: flowcharts, UI sketches, system maps, debug traces.

Each visual quiz item should have:

- Stimulus image.
- Correct-answer explanation visual.
- Distractor diagnosis when the wrong answer reveals a misconception.

## Tutor Visual Policy

The tutor should not generate unreviewed student-facing images on demand. Instead:

1. Student writes what they do not understand.
2. Tutor classifies the confusion.
3. Tutor selects an approved visual if one exists.
4. If no visual exists, tutor requests a staff-side visual slot.
5. Visual Learning Agent creates a prompt.
6. Prompt is graded.
7. Image is generated.
8. Image is graded.
9. Manager approves, rejects, or requests revision.
10. Approved visual is promoted to storage and becomes available to future tutor sessions.

Tutor visual categories:

- Vocabulary confusion.
- First-step confusion.
- Visual-model confusion.
- Reasoning confusion.
- Misconception repair.
- Transfer/application confusion.
- Test/quiz feedback.

## Dashboard And Product Visuals

### Child Dashboard

Needed:

- Academy world map.
- Level badge.
- XP progress core.
- Subject world tiles.
- Today mission path.
- Reward preview.
- Memory Vault reminder.
- Tutor helper icon/card.
- Strength/struggle simple visual.

### Parent Dashboard

Needed:

- Child progress summary chart.
- Strengths/weaknesses heatmap.
- Tutor conversation summary card.
- Reward approval card.
- Suggested reteach lesson card.
- Weekly report visual.
- Consent/privacy status card.

### Teacher Dashboard

Needed:

- Class roster heatmap.
- Live class mission board.
- Intervention queue visual.
- Group mission progress board.
- Exit ticket status chart.
- Misconception cluster map.

### Admin / Manager Review

Needed:

- Review queue icons for lesson, prompt, image, tutor, source, and batch.
- A-F grade badge set.
- Revision loop diagram.
- Approval pipeline diagram.
- Source ledger card.
- Storage/CDN promotion status card.

## Generation Metadata Required Per Asset

Every generated asset must store:

- `assetId`
- `lessonId`
- `draftId`, when applicable
- `placement`
- `assetType`
- `grade`
- `gradeBand`
- `subject`
- `title`
- `caption`
- `altText`
- `sourcePrompt`
- `negativePrompt` or safety constraints
- `reviewChecklist`
- `rubricScores`
- `grade`
- `status`
- `storageProvider`
- `storageBucket`
- `storagePath`
- `storagePublicUrl`
- `approvedBy`
- `approvedAt`
- `revisionHistory`

## Review Rubric

An asset should be approved only if it earns at least B:

- Instructional alignment: does it teach the exact concept?
- Visual clarity: can a student understand the model quickly?
- Age fit: does it match grade band maturity?
- Accessibility: alt text, contrast, not color-only, readable labels.
- Safety/privacy: no private data, no real child likeness, no unsafe content.
- Misconception value: if a repair asset, does it clearly show wrong vs right?
- Reuse value: can tutor/teacher/parent use it again?

## Immediate Build Queue

1. Generate and review the 8 lesson heroes.
2. Generate and review the 8 teaching diagrams.
3. Generate and review the 8 tutor stuck-point cards.
4. Generate and review the 16 misconception repair diagrams.
5. Generate and review the 4 group workflow diagrams.
6. Generate quiz stimulus/explanation visuals for Ratio Quest and Learning AI first.
7. Promote approved assets to Supabase Storage.
8. Link approved asset ids to published lessons.
9. Confirm the lesson player, tutor, quiz review, parent dashboard, teacher dashboard, and admin review queue all display the approved assets.
10. Only then expand visual generation to Grade 6 Batch 1.
