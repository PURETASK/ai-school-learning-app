# Evidence Guidance Audit

Date: 2026-06-11

This audit converts EEF and What Works Clearinghouse math guidance into implementation rules for the K-12 learning app. The goal is to use the strongest practical recommendations without copying one school system exactly. The app should treat evidence as a design contract, then keep testing with learner data.

## Sources Reviewed

1. EEF Improving Mathematics in Key Stages 2 and 3
   - URL: https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/maths-ks-2-3
   - Main fit: Foundation grades 3-5 and Bridge grades 6-8.
   - Adopted recommendations: assessment, manipulatives, representations, problem solving, knowledge networks, metacognition, task selection, interventions, and transition support.

2. EEF Improving Mathematics in the Early Years and Key Stage 1
   - URL: https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/early-maths
   - Main fit: Foundation Academy, especially kindergarten through grade 2.
   - Adopted recommendations: developmental progressions, math through the day, story contexts, picture books, board games, and real-world talk.

3. EEF A School's Guide to Implementation
   - URL: https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/implementation
   - Main fit: product rollout and content improvement.
   - Adopted recommendations: explore, prepare, deliver, sustain; monitor and adapt instead of assuming a feature works.

4. WWC Teaching Math to Young Children
   - URL: https://ies.ed.gov/ncee/wwc/PracticeGuide/18
   - Main fit: Foundation Academy early math.
   - Adopted recommendations: number and operations progression, progress monitoring, describing the world mathematically, daily math, and integrated math experiences.

5. WWC Assisting Students Struggling with Mathematics
   - URL: https://ies.ed.gov/ncee/wwc/PracticeGuide/2
   - Main fit: intervention and reteach logic for Foundation and Bridge.
   - Adopted recommendations: screening, explicit systematic instruction, visual representations, word-problem structures, fact retrieval, progress monitoring, and motivation.

6. WWC Improving Mathematical Problem Solving in Grades 4 Through 8
   - URL: https://ies.ed.gov/ncee/wwc/PracticeGuide/16
   - Main fit: upper Foundation and Bridge math.
   - Adopted recommendations: prepared problem sets, reflection, visual representations, multiple strategies, concepts, and notation.

7. WWC Teaching Strategies for Improving Algebra Knowledge
   - URL: https://ies.ed.gov/ncee/wwc/PracticeGuide/20
   - Main fit: Bridge algebra readiness and Scholar Academy algebra.
   - Adopted recommendations: solved examples, algebraic structure, and choosing alternative strategies.

## Product Rules Added

Every math lesson should include these evidence-backed moves:

1. Prior knowledge check
2. Misconception check
3. Manipulative rationale
4. Representations that connect concrete, visual, symbolic, and verbal forms
5. Problem-solving strategy
6. Worked example
7. Examples and non-examples
8. Knowledge connections across facts, concepts, procedures, and transfer
9. Plan-monitor-evaluate metacognitive prompt
10. Intervention trigger
11. Transition bridge across grade bands
12. Specific feedback frame

The first implemented example is `g3-fractions-number-line`. It now includes all 12 required evidence moves.

## Curriculum Impact

Foundation Academy:

- Use story, movement, concrete objects, pictures, and board-game style practice.
- Keep lessons short, active, visual, and parent-friendly.
- Use diagnostics and progress checks to start from what the learner knows.
- Reward retention and transfer, not only fast completion.

Bridge Academy:

- Use quest-style independence without losing explicit instruction.
- Add group homework with roles, shared artifacts, and individual accountability.
- Use visual representations, structured problem solving, and reflection prompts.
- Add transition bridges from grade 5 concepts to middle-school abstraction.

Scholar Academy:

- Use course-based dashboards and portfolio evidence.
- In algebra, use solved examples, compare strategies, and emphasize structure across equations, graphs, tables, and words.
- Keep motivation professional: achievement markers, portfolios, capstones, and career relevance.

## Implementation Gates

The app now treats evidence as a quality gate:

- `src/data.js` stores the source audit and required math moves.
- `src/engine.js` audits lessons with `getLessonEvidenceAudit`.
- `src/engine.js` audits content drafts with `getDraftEvidenceAudit` and blocks publishing incomplete math drafts.
- `src/engine.js` validates generated lesson batches with `validateLessonBatch` and imports them with `importLessonBatch` only when the whole batch passes.
- `src/app.js` shows the evidence audit in the lesson player, Learning Lab, and Admin views.
- The Admin authoring form includes fields for every required math evidence move.
- The Admin batch import form rejects malformed lessons and rejects math lessons missing required evidence moves before drafts are created.
- The Admin batch import form also checks duplicate lesson keys, required visual metadata, alt text, accessibility notes, age-fit notes, readability metadata, and standards coverage warnings.
- Successful batch imports generate SVG visual asset records from approved metadata.
- Visual assets start in review and must be approved before their linked drafts can be published.
- Reviewers can replace generated SVG assets with external approved image URLs when license, credit, caption, and alt text are supplied.
- `tests/run-tests.mjs` verifies that sources, required moves, and the Grade 3 math lesson audit are present.

## Next Implementation Work

1. Add teacher/parent notes that explain how to use manipulatives without creating dependence.
2. Add intervention records that track why a learner was routed to reteach.
3. Add algebra-specific solved-example and strategy-choice templates for Bridge and Scholar courses.
4. Track whether evidence moves improve delayed recall, joy, frustration, independence, and parent support minutes.
5. Add true binary upload support for externally designed lesson visuals instead of URL/data-image replacement only.
6. Add batch-level reading passage analysis for longer lesson bodies once full lesson text fields are generated.
