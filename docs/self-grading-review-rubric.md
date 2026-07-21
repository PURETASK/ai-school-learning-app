# Self-Grading, Critic, And Revision Rubric

This document defines how generated lessons, tutor responses, image prompts, and generated images are graded before they become student-facing.

The goal is not only to reject weak work. The system must:

1. Grade the artifact.
2. Explain why it received that grade.
3. Suggest targeted improvements.
4. Send the improvements back to the creating agent.
5. Generate a better version.
6. Re-grade the improved version.
7. Stop only when it passes the required threshold or escalates to human review.

## Grade Scale

| Grade | Score | Meaning | Default Action |
|---|---:|---|---|
| A | 90-100 | Production-ready. Strong learning value, safe, clear, accurate, polished. | Approve or queue for final human spot-check. |
| B | 80-89 | Usable after minor improvements. Good core idea with small clarity, polish, or support gaps. | Return to creator for one improvement pass, then re-grade. |
| C | 70-79 | Not student-ready. The idea is workable, but important teaching, safety, visual, or accuracy gaps remain. | Return to creator with required changes. Human review if repeated. |
| D | 60-69 | Weak. Major confusion, missing supports, poor alignment, or low production quality. | Reject for student use. Require rewrite from structured critique. |
| F | 0-59 | Unsafe, inaccurate, misleading, unusable, or violates policy. | Block. Human review required before any reuse. |

## Global Pass Rules

An artifact can only become student-facing if:

- Overall grade is `A`, or `B` with no critical blockers.
- No safety, privacy, factual accuracy, or direct-answer policy blocker exists.
- Required metadata is present.
- The artifact is age-appropriate for the grade band.
- The artifact has been reviewed by the correct critic agent.
- Any generated image is storage-backed and approved.

Default thresholds:

- `90+`: auto-eligible for manager approval.
- `80-89`: revision required unless manager overrides.
- `<80`: not publishable.
- Any critical blocker: automatic `F` until fixed.

## Critical Blockers

Any one of these forces an `F` regardless of numeric score:

- Exposes child private data.
- Gives final graded answers instead of teaching.
- Contains unsafe, violent, sexual, discriminatory, or age-inappropriate content.
- Makes unsupported factual claims.
- Uses copyrighted/branded characters or protected likenesses without permission.
- Lacks required alt text for student-facing visuals.
- Has no connection to the lesson objective.
- Misleads the student about what is true.
- Pretends the AI is a human teacher.
- Bypasses human review for OpenAI-generated images or live web findings.

## Artifact Types

The grading system covers five artifact types:

1. Lesson content
2. Tutor response
3. Image prompt
4. Generated image / diagram
5. Agent research or review output

Each artifact type has its own weighted rubric.

---

# 1. Lesson Content Rubric

Use for lesson drafts, published lesson candidates, reteach paths, challenge paths, and full student-facing lesson experiences.

## Categories

| Category | Weight | What A-Level Looks Like |
|---|---:|---|
| Objective Alignment | 15 | The lesson clearly teaches one grade-appropriate objective and every activity supports it. |
| Student-Facing Teaching | 15 | The app directly teaches the student, not a teacher. Language is clear, active, and age-fit. |
| Learning Science | 15 | Uses visual model, active practice, retrieval, misconception repair, and transfer. |
| Misconception Handling | 10 | Predicts likely confusion and gives targeted repair paths. |
| Practice And Mastery | 10 | Includes guided practice, independent practice, quiz/mastery check, reteach, and challenge. |
| Fun And Retention | 10 | Includes curiosity, active task, choice, reward, and delayed recall. |
| Visual Support | 10 | Includes specific diagrams/images and describes how the student uses them. |
| Accessibility | 5 | Readable, keyboard-friendly, clear text, alt text, no color-only meaning. |
| Safety And Privacy | 5 | No unsafe content or unnecessary student data. |
| Standards And Evidence | 5 | Includes standards tags and source/evidence notes where needed. |

## Lesson Grade Bands

- `A`: 90-100. Publishable after manager review.
- `B`: 80-89. Needs targeted revision, usually visual, wording, or practice improvement.
- `C`: 70-79. Needs substantial rewrite before student use.
- `D`: 60-69. Concept may be salvageable, but lesson structure is weak.
- `F`: 0-59. Blocked by safety, accuracy, missing objective, or unusable teaching.

## Required Revision Feedback

The critic must return:

- `topStrengths`
- `criticalBlockers`
- `scoreByCategory`
- `missingRequirements`
- `studentConfusionRisks`
- `specificRevisionInstructions`
- `improvedLessonBrief`
- `requiredVisuals`
- `requiredTutorSupports`
- `regradeTarget`

---

# 2. Tutor Response Rubric

Use for AI tutor messages, hint sequences, reteach responses, and confusion diagnosis.

## Categories

| Category | Weight | What A-Level Looks Like |
|---|---:|---|
| Confusion Diagnosis | 20 | Identifies whether the student is stuck on vocabulary, visual model, first step, reasoning, misconception, or vague confusion. |
| Hint-First Teaching | 15 | Gives a helpful hint or question before giving direct explanation. |
| Lesson Grounding | 15 | Uses current lesson objective, visual, helper notes, and misconception data. |
| Accuracy | 15 | Correct, precise, not overbroad, and flags uncertainty when needed. |
| Student Thinking | 10 | Asks the learner to explain, draw, retry, compare, or justify. |
| Age Fit | 10 | Matches grade band vocabulary and tone. |
| Safety And Privacy | 10 | No unsafe content, no unnecessary personal data, no human impersonation. |
| Next Step | 5 | Gives one concrete next action. |

## Tutor Pass Rules

- Must score `85+` to be student-facing without human review.
- Must not give direct final answers for quiz/homework requests.
- If score is below `85`, the tutor response returns to the Tutor Agent with a required strategy change.

## Tutor Revision Examples

If weak on diagnosis:

- Ask the student to write exactly what part is confusing.
- Classify the stuck point.
- Use the matching explanation mode.

If weak on visuals:

- Reference an approved diagram.
- Ask the student to point to or describe the confusing part.
- Request a visual prompt from the Visual Learning Agent if no visual exists.

---

# 3. Image Prompt Rubric

Use before calling OpenAI image generation.

## Categories

| Category | Weight | What A-Level Looks Like |
|---|---:|---|
| Learning Objective Fit | 20 | Prompt clearly depicts the exact concept or misconception. |
| Visual Clarity | 20 | Focused composition, readable labels, uncluttered layout. |
| Age Fit | 15 | Style and complexity match K-5, 6-8, or 9-12. |
| Teaching Use | 15 | Tells how student/tutor/lesson will use the image. |
| Safety And Copyright | 15 | No real children, private data, logos, copyrighted characters, unsafe imagery. |
| Accessibility | 10 | Requests high contrast, clear spacing, short readable labels. |
| Art Direction | 5 | Matches Academy Worlds / cyber-neon product style when appropriate. |

## Prompt Pass Rules

- `90+`: can generate.
- `80-89`: revise prompt before generation unless cost is very low and manager approves.
- `<80`: do not generate.
- Any safety/copyright blocker: `F`.

## Required Prompt Fields

Every production prompt must include:

- lesson id
- grade
- subject
- learning objective
- visual purpose
- misconception or hard part
- required labels
- style direction
- safety constraints
- accessibility constraints
- forbidden content

---

# 4. Generated Image / Diagram Rubric

Use after image generation and before approval.

## Categories

| Category | Weight | What A-Level Looks Like |
|---|---:|---|
| Concept Accuracy | 20 | The image correctly represents the academic idea. |
| Instructional Usefulness | 20 | Student can learn from it, not just admire it. |
| Clarity And Layout | 15 | Main idea is obvious, labels are readable, layout is not cluttered. |
| Age Fit | 10 | Appropriate for the target grade band. |
| Accessibility | 10 | Alt text possible, high contrast, no color-only meaning. |
| Safety And Privacy | 10 | No real children, private data, logos, unsafe imagery, stereotypes. |
| Product Style | 10 | Fits the app’s visual direction and feels polished. |
| Storage And Metadata | 5 | Stored in Supabase Storage with source prompt, model, license, credit, checklist, alt text, and status. |

## Image Pass Rules

- `90+`: approve.
- `80-89`: revise prompt and regenerate if improvement is likely; otherwise human can approve with note.
- `<80`: reject and regenerate.
- Any factual/safety/copyright blocker: reject.

## Required Image Review Output

The Image Critic must return:

- `grade`
- `score`
- `approved`
- `blockers`
- `visualIssues`
- `teachingIssues`
- `promptImprovements`
- `regenerationPrompt`
- `altText`
- `caption`
- `studentUseNote`

---

# 5. Agent Research Or Review Output Rubric

Use for web audit findings, source ledgers, content-review outputs, fact-check outputs, and agent-created improvement plans.

## Categories

| Category | Weight | What A-Level Looks Like |
|---|---:|---|
| Source Quality | 20 | Uses official, primary, or reputable sources. |
| Relevance | 15 | Findings directly improve the target lesson or teaching problem. |
| Accuracy | 20 | Claims are precise and not overstated. |
| Evidence Ledger | 15 | Includes source URL, date checked, claim, trouble signal, and redesign move. |
| Actionability | 15 | Produces concrete changes the creating agent can apply. |
| Safety And Scope | 10 | Does not expose external tools or unreviewed claims to students. |
| Conflict Handling | 5 | Flags uncertainty or conflicting guidance. |

## Research Pass Rules

- `90+`: may inform lesson revision after manager approval.
- `80-89`: usable but needs source or action clarity.
- `<80`: not allowed to alter student-facing lessons.
- Any unsourced major claim: block.

---

# Revision Loop

## Agent Roles

| Agent | Job |
|---|---|
| Creator Agent | Creates lesson, prompt, image, tutor response, or research output. |
| Critic Agent | Grades the artifact with the correct rubric. |
| Truth And Safety Agent | Checks factual accuracy, source needs, policy, privacy, and child safety. |
| Fun And Retention Agent | Scores engagement, retention, active learning, and reward alignment. |
| Visual Learning Agent | Scores image usefulness and suggests better diagrams/prompts. |
| Manager Agent | Decides approval, rejection, or another revision pass. |

## Loop Steps

1. Creator produces artifact.
2. Critic grades artifact.
3. Truth/Safety checks blockers.
4. Fun/Retention or Visual critic adds domain-specific critique when relevant.
5. If grade is below threshold, system creates a revision brief.
6. Revision brief returns to the Creator Agent.
7. Creator regenerates improved artifact.
8. Critic re-grades.
9. Repeat up to `3` revision attempts.
10. If still below threshold, escalate to human manager.

## Revision Attempt Rules

| Attempt | Action |
|---:|---|
| 1 | Return precise critique and regenerate. |
| 2 | Return stricter critique, include examples, require missing fields. |
| 3 | Return final improvement brief and flag for manager review. |
| 4+ | Stop automatic revision. Human decision required. |

## Required Revision Brief Format

```json
{
  "artifactId": "string",
  "artifactType": "lesson | tutor_response | image_prompt | generated_image | research_output",
  "currentGrade": "A | B | C | D | F",
  "currentScore": 0,
  "targetGrade": "A",
  "targetScore": 90,
  "blockers": [],
  "topProblems": [],
  "specificImprovements": [],
  "mustKeep": [],
  "mustRemove": [],
  "creatorInstructions": "",
  "regenerationPrompt": "",
  "nextCritic": "string"
}
```

## Approval States

| State | Meaning |
|---|---|
| `draft` | Created but not graded. |
| `critic-review` | Waiting for rubric grade. |
| `revision-required` | Failed threshold but can be improved. |
| `blocked` | Critical blocker. Human review required. |
| `manager-review` | Passed critic, waiting manager approval. |
| `approved` | Student-facing eligible. |
| `rejected` | Not usable. |

## Default Publish Thresholds

| Artifact | Auto Revision Threshold | Manager Review Threshold | Student-Facing Threshold |
|---|---:|---:|---:|
| Lesson content | <90 | 90+ | Manager approved |
| Tutor response | <85 | 85+ | 85+ and no blocker |
| Image prompt | <90 | 90+ | Prompt can generate |
| Generated image | <90 | 90+ | Approved and storage-backed |
| Research output | <90 | 90+ | Manager approved |

## What Gets Sent Back To The Creating Agent

The creator should not receive vague feedback like “make it better.”

It should receive:

- exact failed categories
- category scores
- why each weak score happened
- concrete changes to make
- examples of better wording or visual direction
- the new target grade
- the prior artifact
- the constraints that must not change

Example:

```txt
Your image prompt scored 78/C.
Main failures:
- Visual clarity: asks for too many objects.
- Misconception repair: does not show equal spaces.
- Accessibility: labels are not specified.

Regenerate the prompt with:
- one number line from 0 to 1
- labels: 0, 1/2, 1, equal spaces
- neon academy style
- no characters
- clear high-contrast labels
Target score: 90/A.
```

## First Implementation Target

Start with three graders:

1. `gradeLessonContent(lessonOrDraft)`
2. `gradeImagePrompt(promptPlan)`
3. `gradeGeneratedVisual(asset)`

Then wire the revision loop:

1. Generate image prompt.
2. Grade prompt.
3. Improve prompt if below 90.
4. Generate image.
5. Grade image.
6. If below 90, create regeneration prompt.
7. Repeat up to 3 times.
8. Approve only storage-backed images with score 90+.

## Implemented Code Contracts

The first deterministic grader layer lives in `src/artifactGrader.js` and is re-exported from `src/engine.js`.

- `gradeLessonContent(lessonOrDraft)` grades objective alignment, student-facing teaching, learning science, misconception handling, practice/mastery, fun/retention, visual support, accessibility, safety/privacy, and standards/evidence.
- `gradeImagePrompt(promptPlan)` grades prompts before image generation and blocks unsafe, branded, private-data, direct-answer, or real-child requests.
- `gradeGeneratedVisual(asset)` grades generated images/diagrams after generation and requires alt text plus storage-backed production assets for non-SVG images.
- `createRevisionBrief(review, artifact, options)` converts a failed grade into exact creator-agent instructions.
- `runArtifactRevisionLoop({ artifact, artifactType, regenerate })` grades, creates a revision brief, sends it to the creator callback, re-grades, and stops at pass, blocker, or the configured attempt limit.
