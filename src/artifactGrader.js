const defaultThresholds = {
  lesson: 90,
  image_prompt: 90,
  generated_visual: 90
};

const lessonCategoryConfig = [
  ["objectiveAlignment", "Objective Alignment", 15],
  ["studentFacingTeaching", "Student-Facing Teaching", 15],
  ["learningScience", "Learning Science", 15],
  ["misconceptionHandling", "Misconception Handling", 10],
  ["practiceAndMastery", "Practice And Mastery", 10],
  ["funAndRetention", "Fun And Retention", 10],
  ["visualSupport", "Visual Support", 10],
  ["accessibility", "Accessibility", 5],
  ["safetyAndPrivacy", "Safety And Privacy", 5],
  ["standardsAndEvidence", "Standards And Evidence", 5]
];

const imagePromptCategoryConfig = [
  ["learningObjectiveFit", "Learning Objective Fit", 20],
  ["visualClarity", "Visual Clarity", 20],
  ["ageFit", "Age Fit", 15],
  ["teachingUse", "Teaching Use", 15],
  ["safetyAndCopyright", "Safety And Copyright", 15],
  ["accessibility", "Accessibility", 10],
  ["artDirection", "Art Direction", 5]
];

const generatedVisualCategoryConfig = [
  ["conceptAccuracy", "Concept Accuracy", 20],
  ["instructionalUsefulness", "Instructional Usefulness", 20],
  ["clarityAndLayout", "Clarity And Layout", 15],
  ["ageFit", "Age Fit", 10],
  ["accessibility", "Accessibility", 10],
  ["safetyAndPrivacy", "Safety And Privacy", 10],
  ["productStyle", "Product Style", 10],
  ["storageAndMetadata", "Storage And Metadata", 5]
];

function text(value) {
  if (Array.isArray(value)) return value.map(text).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(text).join(" ");
  return String(value || "").trim();
}

function lower(value) {
  return text(value).toLowerCase();
}

function countPresent(values) {
  return values.filter((value) => {
    if (Array.isArray(value)) return value.length > 0;
    if (value && typeof value === "object") return Object.keys(value).length > 0;
    return Boolean(text(value));
  }).length;
}

function hasAny(value, terms) {
  const source = lower(value);
  return terms.some((term) => source.includes(term));
}

function hasNegatedSafetyRule(source, terms) {
  return terms.some((term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(do not|don't|no|without|avoid|forbidden)\\s+[^.]{0,80}${escaped}`, "i").test(source);
  });
}

function scoreFromPresent(values) {
  if (!values.length) return 0;
  return Math.round((countPresent(values) / values.length) * 100);
}

export function gradeForScore(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function category(id, label, weight, score, feedback, improvement) {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));
  return {
    id,
    label,
    weight,
    score: normalizedScore,
    passed: normalizedScore >= 90,
    feedback,
    improvement
  };
}

function weightedScore(categories, blockers = []) {
  if (blockers.length) return 0;
  const weight = categories.reduce((sum, item) => sum + item.weight, 0) || 1;
  return Math.round(categories.reduce((sum, item) => sum + item.score * item.weight, 0) / weight);
}

function resultFor({ artifactType, artifactId, threshold, categories, blockers, missingRequirements, studentConfusionRisks, specificRevisionInstructions, extra = {} }) {
  const score = weightedScore(categories, blockers);
  const grade = blockers.length ? "F" : gradeForScore(score);
  const passed = !blockers.length && score >= threshold;
  const weakCategories = categories.filter((item) => item.score < 90);
  const strengths = categories
    .filter((item) => item.score >= 90)
    .slice(0, 3)
    .map((item) => item.label);

  return {
    artifactType,
    artifactId,
    score,
    grade,
    passed,
    threshold,
    criticalBlockers: blockers,
    blockers,
    scoreByCategory: categories,
    topStrengths: strengths,
    missingRequirements,
    studentConfusionRisks,
    specificRevisionInstructions: specificRevisionInstructions.length
      ? specificRevisionInstructions
      : weakCategories.map((item) => item.improvement),
    regradeTarget: { grade: "A", score: threshold },
    ...extra
  };
}

function safetyBlockers(value, { requireObjective = false, requireAltText = false, requireStorage = false, asset = null } = {}) {
  const source = lower(value);
  const blockers = [];
  const checks = [
    {
      terms: ["private data", "student address", "phone number", "ssn", "social security"],
      message: "Exposes or requests child private data."
    },
    {
      terms: ["give the final answer", "just tell me the answer", "solve it for me", "do the homework for me"],
      message: "Risks giving final graded answers instead of teaching."
    },
    {
      terms: ["violent", "sexual", "gore", "hate", "slur", "weapon", "scary"],
      message: "Contains unsafe or age-inappropriate content."
    },
    {
      terms: ["mickey", "disney", "pokemon", "marvel", "minecraft", "roblox", "lego", "logo", "brand mascot", "branded characters", "copyrighted characters"],
      message: "Uses copyrighted, branded, or protected characters/logos."
    },
    {
      terms: ["real child", "real children", "photo of a child", "student face", "likeness"],
      message: "Depicts or requests real children or protected likenesses."
    },
    {
      terms: ["human teacher", "i am your teacher", "real teacher"],
      message: "Pretends the AI is a human teacher."
    }
  ];

  for (const check of checks) {
    if (hasAny(source, check.terms) && !hasNegatedSafetyRule(source, check.terms)) blockers.push(check.message);
  }
  if (requireObjective && !hasAny(source, ["objective", "learning goal", "lesson", "grade"])) {
    blockers.push("Has no clear connection to the lesson objective.");
  }
  if (requireAltText && !text(asset?.altText)) {
    blockers.push("Lacks required alt text for a student-facing visual.");
  }
  if (requireStorage && asset?.assetKind !== "generated-svg" && !text(asset?.storagePublicUrl || asset?.storagePath)) {
    blockers.push("Generated image is not storage-backed.");
  }

  return [...new Set(blockers)];
}

function gradeBandFromGrade(grade) {
  const number = Number.parseInt(String(grade || ""), 10);
  if (Number.isNaN(number)) return "";
  if (number <= 5) return "K-5";
  if (number <= 8) return "6-8";
  return "9-12";
}

function lessonSections(lesson) {
  return lesson.lessonSections || lesson.teachingSections || lesson.sections || {};
}

function lessonQuiz(lesson) {
  return lesson.quizQuestions || lesson.quiz || [];
}

function lessonMisunderstandings(lesson) {
  return lesson.commonMisunderstandings || lesson.teachingSupport?.commonMisunderstandings || [];
}

function lessonVisualSupports(lesson) {
  const supports = lesson.visualSupports || [];
  return [lesson.visual, lesson.visualAssetId, ...supports].filter(Boolean);
}

export function gradeLessonContent(lessonOrDraft = {}) {
  const lesson = lessonOrDraft || {};
  const sections = lessonSections(lesson);
  const studentFacing = lesson.studentFacing || {};
  const support = lesson.teachingSupport || {};
  const quiz = lessonQuiz(lesson);
  const misunderstandings = lessonMisunderstandings(lesson);
  const visualSupports = lessonVisualSupports(lesson);
  const gradeBand = lesson.academyId || gradeBandFromGrade(lesson.grade);
  const allText = text(lesson);
  const requiredSections = [
    sections.warmup || sections.warmUp,
    sections.teach || sections.directInstruction,
    sections.guidedPractice,
    sections.activity || sections.interactiveActivity,
    sections.independentPractice,
    sections.reteach || sections.reteachPath,
    sections.challenge || sections.challengePath
  ];

  const categories = [
    category(...lessonCategoryConfig[0], scoreFromPresent([lesson.objective || lesson.learningObjective, lesson.title, lesson.subject, lesson.grade]), "Checks that the lesson has one clear grade-level learning target.", "Add a single clear objective, grade, subject, and title."),
    category(
      ...lessonCategoryConfig[1],
      scoreFromPresent([studentFacing.mission || lesson.studentSummary, studentFacing.whyItMatters || lesson.whyItMatters, studentFacing.bigIdea || support.summary, studentFacing.tutorHandoff || support.confusionPrompt]),
      "Checks that the app directly teaches the learner instead of giving teacher notes.",
      "Rewrite the opening, big idea, why-it-matters, and tutor handoff as direct student-facing language."
    ),
    category(
      ...lessonCategoryConfig[2],
      scoreFromPresent([visualSupports.length, sections.activity || sections.interactiveActivity, lesson.retentionChecks, sections.reteach || sections.reteachPath, sections.challenge || sections.challengePath]),
      "Checks visual model, active task, retrieval, reteach, and transfer.",
      "Add a visual model, active task, delayed recall, reteach path, and challenge transfer."
    ),
    category(
      ...lessonCategoryConfig[3],
      scoreFromPresent([misunderstandings.length, support.confusionPrompt || studentFacing.tutorHandoff, sections.reteach || sections.reteachPath]),
      "Checks common misunderstandings and targeted repair moves.",
      "Add likely misunderstandings, fixes, and a student prompt that asks what exactly is confusing."
    ),
    category(
      ...lessonCategoryConfig[4],
      scoreFromPresent([sections.guidedPractice, sections.independentPractice, quiz.length, lesson.masteryThreshold, sections.reteach || sections.reteachPath, sections.challenge || sections.challengePath]),
      "Checks guided practice, independent practice, quiz, mastery, reteach, and challenge.",
      "Add practice, quiz questions, mastery threshold, reteach path, and challenge path."
    ),
    category(
      ...lessonCategoryConfig[5],
      scoreFromPresent([lesson.funTasks, lesson.reward, lesson.retentionChecks, studentFacing.mission, gradeBand === "foundation" || lesson.groupHomework]),
      "Checks curiosity, active task, choice/collaboration, reward, and delayed recall.",
      "Add a fun active task, learner choice or group role, mastery reward, and delayed recall check."
    ),
    category(
      ...lessonCategoryConfig[6],
      scoreFromPresent([visualSupports.length, lesson.visual?.caption, lesson.visual?.title, support.diagramCallouts, lesson.visual?.altText || lesson.visual?.caption]),
      "Checks that visuals have a teaching job, caption, labels/callouts, and alt text.",
      "Add a specific diagram/image, caption, alt text, and instructions for how the student uses it."
    ),
    category(
      ...lessonCategoryConfig[7],
      scoreFromPresent([lesson.accessibilityNotes || lesson.visual?.altText || lesson.visual?.caption, support.helperNotes || lesson.helperNotes]),
      "Checks accessibility notes, alt text, and helper notes.",
      "Add accessibility notes, alt text, and helper notes that do not rely only on color."
    ),
    category(
      ...lessonCategoryConfig[8],
      safetyBlockers(allText).length ? 0 : 100,
      "Checks safety, privacy, and direct-answer policy.",
      "Remove unsafe, private, branded, or direct-answer content."
    ),
    category(
      ...lessonCategoryConfig[9],
      scoreFromPresent([lesson.standards || lesson.standardsTags || lesson.standards_tags, lesson.sourceCards || lesson.evidenceMoves || lesson.standards]),
      "Checks standards and evidence metadata.",
      "Add standards tags and evidence/source notes."
    )
  ];

  const missingRequirements = [];
  if (!text(lesson.objective || lesson.learningObjective)) missingRequirements.push("Learning objective is missing.");
  if (!text(studentFacing.mission || lesson.studentSummary)) missingRequirements.push("Student-facing mission or summary is missing.");
  if (requiredSections.some((value) => !text(value))) missingRequirements.push("One or more teach/practice/reteach/challenge sections are missing.");
  if (!quiz.length) missingRequirements.push("Quiz or mastery check is missing.");
  if (!misunderstandings.length) missingRequirements.push("Common misunderstanding repair is missing.");
  if (!visualSupports.length) missingRequirements.push("Specific lesson visual support is missing.");
  if (["bridge", "scholar", "6-8", "9-12"].includes(gradeBand) && !lesson.groupHomework) missingRequirements.push("Grades 6-12 need structured group homework.");

  const blockers = safetyBlockers(allText);
  if (!text(lesson.objective || lesson.learningObjective)) blockers.push("Lesson has no learning objective.");

  return resultFor({
    artifactType: "lesson",
    artifactId: lesson.id || "",
    threshold: defaultThresholds.lesson,
    categories,
    blockers: [...new Set(blockers)],
    missingRequirements,
    studentConfusionRisks: [
      ...(!misunderstandings.length ? ["No explicit common misunderstanding repair path."] : []),
      ...(!text(support.confusionPrompt || studentFacing.tutorHandoff) ? ["Tutor does not ask the learner to name the stuck point."] : []),
      ...(!visualSupports.length ? ["The learner may not have a concrete visual model before abstraction."] : [])
    ],
    specificRevisionInstructions: categories.filter((item) => item.score < 90).map((item) => item.improvement),
    extra: {
      improvedLessonBrief: `Revise "${lesson.title || "this lesson"}" so the app teaches one objective directly, shows a concrete visual, asks what is confusing, gives active practice, checks mastery, and rewards delayed recall.`,
      requiredVisuals: visualSupports.length ? visualSupports.map((visual) => text(visual.title || visual.caption || visual).slice(0, 120)) : ["Add a lesson hero diagram, teaching diagram, and tutor help visual."],
      requiredTutorSupports: [
        support.confusionPrompt || studentFacing.tutorHandoff || "Ask the student to write the exact part that feels confusing.",
        "Use misconception repair before giving another practice item."
      ]
    }
  });
}

function promptText(promptPlan) {
  if (typeof promptPlan === "string") return promptPlan;
  return [promptPlan.prompt, promptPlan.lessonId, promptPlan.grade, promptPlan.subject, promptPlan.placement, promptPlan.reason, promptPlan.caption, promptPlan.altText, promptPlan.reviewChecklist].map(text).join(" ");
}

export function gradeImagePrompt(promptPlan = {}) {
  const source = promptText(promptPlan);
  const blockers = safetyBlockers(source, { requireObjective: true });
  const categories = [
    category(...imagePromptCategoryConfig[0], scoreFromPresent([hasAny(source, ["lesson", "lesson id", "called"]), hasAny(source, ["grade"]), hasAny(source, ["subject", "math", "science", "ela", "social"]), hasAny(source, ["learning objective", "objective"])]), "Checks that the image generation prompt is tied to a specific lesson objective.", "Add lesson id/title, grade, subject, and learning objective."),
    category(...imagePromptCategoryConfig[1], scoreFromPresent([hasAny(source, ["must show", "show"]), hasAny(source, ["label"]), hasAny(source, ["clear", "readable", "uncluttered"]), hasAny(source, ["diagram", "image", "illustration", "visual"])]), "Checks composition, labels, and clarity.", "Specify one focused scene or diagram, required labels, readable spacing, and what not to clutter."),
    category(...imagePromptCategoryConfig[2], scoreFromPresent([hasAny(source, ["grade", "k-5", "6-8", "9-12"]), hasAny(source, ["age", "friendly", "middle school", "academic", "professional"])]), "Checks age and grade-band fit.", "State the grade band and age-appropriate visual complexity."),
    category(...imagePromptCategoryConfig[3], scoreFromPresent([hasAny(source, ["purpose", "learner action", "student", "tutor"]), hasAny(source, ["misconception", "hard part", "stuck", "confusing"]), hasAny(source, ["after viewing", "use the image", "explain"])]), "Checks how the learner or tutor will use the visual.", "Add the visual purpose, hard part or misconception, and the action students take after viewing."),
    category(...imagePromptCategoryConfig[4], blockers.length ? 0 : scoreFromPresent([hasAny(source, ["do not depict real children", "no real children"]), hasAny(source, ["private data"]), hasAny(source, ["copyrighted", "branded", "logo"]), hasAny(source, ["unsafe", "classroom-safe", "age-appropriate"])]), "Checks safety, copyright, privacy, and forbidden content.", "Add explicit no real children, no private data, no logos/characters, and classroom-safe constraints."),
    category(...imagePromptCategoryConfig[5], scoreFromPresent([hasAny(source, ["high contrast"]), hasAny(source, ["readable"]), hasAny(source, ["spacing"]), hasAny(source, ["short labels", "labels only"])]), "Checks accessibility and readable labels.", "Request high contrast, clear spacing, and short readable labels."),
    category(...imagePromptCategoryConfig[6], scoreFromPresent([hasAny(source, ["cyber", "neon", "academy", "quest", "product style", "visual style"])]), "Checks art direction fit.", "Add Academy Worlds cyber-neon style guidance without weakening educational clarity.")
  ];
  const missingRequirements = [];
  for (const requirement of [
    ["lesson id/title", ["lesson", "called"]],
    ["grade", ["grade"]],
    ["subject", ["subject", "math", "science", "ela", "social"]],
    ["learning objective", ["learning objective", "objective"]],
    ["visual purpose", ["purpose"]],
    ["misconception or hard part", ["misconception", "hard part", "stuck", "confusing"]],
    ["required labels", ["label"]],
    ["safety constraints", ["do not depict real children", "private data", "copyrighted"]]
  ]) {
    if (!hasAny(source, requirement[1])) missingRequirements.push(`${requirement[0]} is missing.`);
  }

  return resultFor({
    artifactType: "image_prompt",
    artifactId: typeof promptPlan === "object" ? promptPlan.id || promptPlan.slotId || "" : "",
    threshold: defaultThresholds.image_prompt,
    categories,
    blockers,
    missingRequirements,
    studentConfusionRisks: missingRequirements.filter((item) => /objective|purpose|misconception|label/.test(item)),
    specificRevisionInstructions: categories.filter((item) => item.score < 90).map((item) => item.improvement),
    extra: {
      canGenerate: !blockers.length && weightedScore(categories, blockers) >= defaultThresholds.image_prompt,
      regenerationPrompt: [
        source,
        "Revise this into one production image prompt with: lesson id/title, grade, subject, learning objective, visual purpose, hard part or misconception, required labels, high contrast, readable spacing, Academy Worlds cyber-neon style, no real children, no private data, no logos, no copyrighted characters, classroom-safe imagery."
      ].join("\n\n")
    }
  });
}

export function gradeGeneratedVisual(asset = {}) {
  const source = text(asset);
  const isStorageBacked = asset.assetKind === "generated-svg" || Boolean(asset.storagePublicUrl || asset.storagePath);
  const blockers = safetyBlockers(source, { requireAltText: true, requireStorage: true, asset });
  const categories = [
    category(...generatedVisualCategoryConfig[0], scoreFromPresent([asset.lessonId || asset.draftId, asset.title, asset.caption, asset.sourcePrompt]), "Checks that the visual can be tied back to the academic concept.", "Add lesson/draft link, title, caption, and source prompt."),
    category(...generatedVisualCategoryConfig[1], scoreFromPresent([asset.caption, asset.placement, asset.reviewChecklist, hasAny(source, ["student", "learner", "objective", "supports"])]), "Checks that the image has a clear teaching job.", "Add a caption, placement, review checklist, and student-use note."),
    category(...generatedVisualCategoryConfig[2], scoreFromPresent([asset.altText, asset.caption, asset.reviewChecklist?.length >= 3, asset.svg || asset.storagePublicUrl || asset.assetUrl]), "Checks readability, labels, and layout metadata.", "Add alt text, caption, readable-label checklist, and a renderable asset URL/SVG."),
    category(...generatedVisualCategoryConfig[3], scoreFromPresent([asset.grade, asset.subject, asset.placement]), "Checks grade, subject, and placement fit.", "Add grade, subject, and placement metadata."),
    category(...generatedVisualCategoryConfig[4], scoreFromPresent([asset.altText, asset.caption, hasAny(source, ["high contrast", "readable", "spacing", "alt text"])]), "Checks alt text and accessibility evidence.", "Add alt text, caption, high contrast/readability checklist."),
    category(...generatedVisualCategoryConfig[5], blockers.length ? 0 : 100, "Checks visual safety, privacy, and copyright constraints.", "Remove unsafe/private/branded content and regenerate if needed."),
    category(...generatedVisualCategoryConfig[6], scoreFromPresent([hasAny(source, ["neon", "academy", "quest", "cyber", "polished", "generated-in-app", "openai"])]), "Checks fit with the app visual direction.", "Add product style metadata or revise prompt for Academy Worlds visual style."),
    category(...generatedVisualCategoryConfig[7], scoreFromPresent([isStorageBacked, asset.sourcePrompt, asset.license, asset.credit, asset.reviewChecklist?.length >= 5, asset.status]), "Checks storage, source prompt, license, credit, checklist, and status.", "Promote generated image to storage and keep source prompt, license, credit, checklist, and review status.")
  ];
  const score = weightedScore(categories, blockers);
  const passed = !blockers.length && score >= defaultThresholds.generated_visual;

  return resultFor({
    artifactType: "generated_visual",
    artifactId: asset.id || "",
    threshold: defaultThresholds.generated_visual,
    categories,
    blockers,
    missingRequirements: [
      ...(!text(asset.altText) ? ["Alt text is missing."] : []),
      ...(!text(asset.caption) ? ["Caption is missing."] : []),
      ...(!isStorageBacked ? ["Generated image must be promoted to storage."] : []),
      ...(!text(asset.sourcePrompt) ? ["Source prompt is missing."] : []),
      ...(!(asset.reviewChecklist || []).length ? ["Review checklist is missing."] : [])
    ],
    studentConfusionRisks: [
      ...(!text(asset.caption) ? ["Learner may not know what to notice in the image."] : []),
      ...(!text(asset.placement) ? ["Visual is not tied to a lesson moment."] : [])
    ],
    specificRevisionInstructions: categories.filter((item) => item.score < 90).map((item) => item.improvement),
    extra: {
      approved: passed,
      visualIssues: categories.filter((item) => item.score < 90).map((item) => item.feedback),
      teachingIssues: categories.filter((item) => ["conceptAccuracy", "instructionalUsefulness", "clarityAndLayout"].includes(item.id) && item.score < 90).map((item) => item.improvement),
      promptImprovements: ["Make the academic concept unmistakable.", "Reduce clutter and keep labels short.", "Include the learner action after viewing."],
      regenerationPrompt: `${asset.sourcePrompt || "Regenerate this visual."}\n\nImprove it for an A grade: exact academic concept, one clear teaching purpose, short readable labels, high contrast, age-fit Academy Worlds cyber-neon style, no real children, no private data, no logos, and storage/review metadata preserved.`,
      altText: asset.altText || "",
      caption: asset.caption || "",
      studentUseNote: asset.studentUseNote || "Student should describe what they notice, connect it to the lesson objective, and retry one practice step."
    }
  });
}

export function gradeArtifact(artifactType, artifact) {
  if (artifactType === "lesson" || artifactType === "lesson_content") return gradeLessonContent(artifact);
  if (artifactType === "image_prompt") return gradeImagePrompt(artifact);
  if (artifactType === "generated_visual" || artifactType === "generated_image") return gradeGeneratedVisual(artifact);
  throw new Error(`Unsupported artifact type: ${artifactType}`);
}

export function createRevisionBrief(review, artifact = {}, options = {}) {
  const artifactType = review.artifactType || options.artifactType || "artifact";
  const artifactId = review.artifactId || artifact.id || options.artifactId || "";
  const topProblems = [
    ...(review.missingRequirements || []),
    ...(review.scoreByCategory || []).filter((item) => item.score < 90).map((item) => `${item.label}: ${item.feedback}`)
  ].slice(0, 8);
  const specificImprovements = (review.specificRevisionInstructions || []).filter(Boolean).slice(0, 10);

  return {
    artifactId,
    artifactType,
    currentGrade: review.grade,
    currentScore: review.score,
    targetGrade: "A",
    targetScore: review.threshold || 90,
    blockers: review.criticalBlockers || review.blockers || [],
    topProblems,
    specificImprovements,
    mustKeep: options.mustKeep || ["Keep the original learning objective and grade band unless the critic says they are wrong."],
    mustRemove: options.mustRemove || (review.criticalBlockers || review.blockers || []),
    creatorInstructions: `Revise the ${artifactType} until it scores ${review.threshold || 90}+ with no critical blockers. Fix the failed rubric categories first, then preserve the strongest student-facing teaching elements.`,
    regenerationPrompt: review.regenerationPrompt || review.improvedLessonBrief || `Revise this ${artifactType} using the listed improvements and re-submit for grading.`,
    nextCritic: options.nextCritic || (artifactType === "generated_visual" || artifactType === "image_prompt" ? "Visual Learning Agent" : "Truth And Fact-Check Agent")
  };
}

export function runArtifactRevisionLoop({ artifact, artifactType, maxAttempts = 3, regenerate = null, creatorId = "creator-agent", options = {} } = {}) {
  if (!artifactType) throw new Error("artifactType is required");
  let currentArtifact = artifact;
  const history = [];

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const review = gradeArtifact(artifactType, currentArtifact);
    const revisionBrief = createRevisionBrief(review, currentArtifact, { ...options, artifactType });
    history.push({
      attempt,
      creatorId,
      artifact: currentArtifact,
      review,
      revisionBrief
    });

    if (review.passed) {
      return {
        status: "manager-review",
        approved: true,
        attempts: attempt,
        history,
        finalArtifact: currentArtifact,
        finalReview: review
      };
    }
    if ((review.criticalBlockers || []).length && attempt >= maxAttempts) {
      return {
        status: "blocked",
        approved: false,
        attempts: attempt,
        history,
        finalArtifact: currentArtifact,
        finalReview: review
      };
    }
    if (typeof regenerate !== "function") {
      return {
        status: "revision-required",
        approved: false,
        attempts: attempt,
        history,
        finalArtifact: currentArtifact,
        finalReview: review
      };
    }

    currentArtifact = regenerate({
      artifact: currentArtifact,
      review,
      revisionBrief,
      attempt,
      artifactType
    });
  }

  const finalReview = history[history.length - 1].review;
  return {
    status: finalReview.passed ? "manager-review" : (finalReview.criticalBlockers || []).length ? "blocked" : "revision-required",
    approved: finalReview.passed,
    attempts: history.length,
    history,
    finalArtifact: currentArtifact,
    finalReview
  };
}
