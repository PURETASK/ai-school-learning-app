import { pilotLessons } from "./data.js";
import { getFullLessonLibrary, getLessonProductionBatchPlan } from "./lessonLibrary.js";

const placementWeights = {
  "lesson-hero": 100,
  "teaching-diagram": 92,
  "ai-tutor": 88,
  "misconception-repair": 82,
  "group-homework": 72,
  "content-draft": 65
};

const librarySlotTemplates = {
  "K-5": [
    ["lesson-hero", "educational illustration", "Anchor the concrete idea before abstract work.", "Describe what they notice, then connect it to the objective."],
    ["vocabulary-anchor", "picture vocabulary card", "Make a new word, symbol, or object memorable.", "Name the visual, say the word, and use it in one example."],
    ["concrete-model", "concrete-to-visual model", "Connect a real object or action to a representation.", "Point to the model and explain what each part means."],
    ["interactive-model", "interactive manipulative board", "Give the learner something to move, sort, draw, or assemble.", "Change one part and predict what happens."],
    ["worked-example", "step-by-step worked example", "Show one successful path with the next move visible.", "Explain why the next step is allowed before trying one."],
    ["practice-feedback", "practice feedback card", "Make an error visible and give one repair action.", "Compare the work to the model and fix one part."],
    ["ai-tutor", "step-by-step help card", "Help the tutor diagnose the child's exact stuck point.", "Choose or write what feels confusing, then retry one step."],
    ["misconception-repair", "mistake-and-fix diagram", "Replace a common wrong model with the corrected model.", "Point to what changed and explain the fix."],
    ["assessment-stimulus", "assessment picture or diagram", "Support interpretation when a quiz item depends on a visual.", "Use the evidence in the picture to choose or explain an answer."],
    ["memory-vault", "retrieval cue card", "Cue delayed recall without re-teaching the whole lesson.", "Recall the rule or idea, then apply it to a small new example."]
  ],
  "6-8": [
    ["lesson-hero", "mission or phenomenon illustration", "Establish a real problem, phenomenon, or quest.", "Describe the tension and predict what must be figured out."],
    ["teaching-diagram", "labeled concept model", "Make the target relationship visible.", "Point to the parts, explain the relationship, and test one example."],
    ["deconstruct-compare", "strategy comparison board", "Expose how a solution or interpretation is built.", "Compare two approaches and defend which one fits the evidence."],
    ["interactive-model", "interactive model or simulation board", "Let the learner manipulate variables or evidence.", "Change one variable, predict the result, and record what changed."],
    ["worked-example", "worked example or data card", "Model expert thinking without hiding reasoning.", "Complete the faded step and explain the reason behind it."],
    ["ai-tutor", "confusion diagnosis card", "Locate the student's vocabulary, model, first-step, reasoning, or transfer gap.", "Write the exact stuck point and select the most useful help mode."],
    ["tutor-alternate", "alternate explanation visual", "Switch representation when the first explanation failed.", "Choose a diagram, metaphor, example, or first-principles route and retry."],
    ["misconception-repair", "mistake-and-fix diagram", "Repair a tempting shortcut or durable misconception.", "Identify the hidden assumption that makes the wrong path fail."],
    ["assessment-stimulus", "quiz or test evidence visual", "Make evidence interpretable in an assessment.", "Use the graph, map, source, model, or table as evidence, not decoration."],
    ["answer-explanation", "correct-answer and distractor explanation", "Explain why the correct option works and why plausible wrong options fail.", "Name the evidence that rules out the tempting distractor."],
    ["memory-vault", "retrieval and transfer card", "Support later recall and application to a new situation.", "Recall the model, then use it in a different context."],
    ["group-homework", "collaboration workflow diagram", "Make roles, handoffs, shared artifact, and individual accountability executable.", "Choose a role, contribute evidence, and complete the handoff."]
  ],
  "9-12": [
    ["lesson-hero", "course or phenomenon illustration", "Frame the disciplinary question or problem.", "State the question and identify the evidence that would matter."],
    ["context-source", "context or source frame", "Establish historical, scientific, literary, or technical context.", "Identify creator, context, purpose, and limitations where relevant."],
    ["teaching-diagram", "precise disciplinary model", "Represent the underlying structure or relationship.", "Explain each component and the conditions under which the model holds."],
    ["deconstruct-process", "annotated expert-process diagram", "Expose expert reasoning, derivation, lab process, or argument architecture.", "Reconstruct the method from assumptions, evidence, and steps."],
    ["interactive-model", "data or simulation studio", "Let the learner test a claim or manipulate variables.", "Change one variable, record the result, and revise the model or claim."],
    ["worked-example", "worked solution or lab record", "Show a defensible solution or product with quality checks.", "Audit assumptions, units, evidence, and conclusion before accepting it."],
    ["ai-tutor", "advanced confusion diagnosis card", "Locate a definition, representation, assumption, method, reasoning, or transfer gap.", "Describe the exact failure point and choose a support route."],
    ["tutor-alternate", "alternate rigorous explanation visual", "Provide a second route without lowering rigor.", "Use an analogy, counterexample, or first-principles reconstruction, then explain the limit."],
    ["misconception-repair", "boundary-condition or counterexample diagram", "Correct an advanced misconception by showing where a shortcut breaks.", "Name the condition that invalidates the original claim."],
    ["assessment-stimulus", "assessment source, graph, map, or model", "Require interpretation rather than recognition.", "Build a conclusion from the supplied evidence and state uncertainty if needed."],
    ["answer-explanation", "evidence-to-conclusion and distractor diagnosis", "Build exam-quality feedback and transfer.", "Trace the evidence to the conclusion and explain the most plausible wrong path."],
    ["memory-vault", "synthesis and transfer cue", "Preserve important knowledge and method over time.", "Retrieve the core model and apply it to a novel problem."],
    ["group-homework", "portfolio or capstone artifact workflow", "Turn individual and team learning into a defensible product.", "Submit an artifact, evidence trail, reflection, and next revision."]
  ]
};

const libraryPlacementWeights = {
  "lesson-hero": 100,
  "teaching-diagram": 96,
  "concrete-model": 94,
  "interactive-model": 92,
  "deconstruct-compare": 90,
  "deconstruct-process": 90,
  "worked-example": 88,
  "ai-tutor": 86,
  "tutor-alternate": 84,
  "misconception-repair": 84,
  "assessment-stimulus": 82,
  "answer-explanation": 80,
  "memory-vault": 76,
  "group-homework": 74,
  "portfolio-artifact": 74,
  "vocabulary-anchor": 72,
  "practice-feedback": 72,
  "context-source": 72
};

const visualBatchSubjectPriority = [
  "math",
  "science",
  "ela",
  "social-studies",
  "computer-science",
  "writing",
  "health-pe",
  "life-skills",
  "arts-media",
  "career-college"
];

function academyRange(academyId) {
  if (academyId === "bridge") return "6-8";
  if (academyId === "scholar") return "9-12";
  return "K-5";
}

function subjectLabel(subject) {
  return String(subject || "lesson").replace("-", " ");
}

function promptStyleForRange(range) {
  if (range === "K-5") {
    return "bright, friendly, concrete, simple labels, large shapes, playful but not babyish";
  }
  if (range === "6-8") {
    return "quest-like, clear diagram language, mature middle school colors, evidence-focused";
  }
  return "professional academic, clean infographic, portfolio-ready, precise labels";
}

function visualSafetyRules() {
  return [
    "Create an original educational image or diagram.",
    "Do not depict real children, private data, branded characters, copyrighted characters, or school logos.",
    "Use high contrast, readable spacing, and a calm classroom-safe design.",
    "Avoid tiny text, clutter, scary imagery, stereotypes, or unrealistic body details.",
    "If text is needed, keep it to short labels only."
  ].join(" ");
}

function buildPrompt({ lesson, title, placement, purpose, mustShow, learnerAction, assetType }) {
  const range = academyRange(lesson.academyId);
  return [
    `Generate a ${assetType} for a Grade ${lesson.grade} ${subjectLabel(lesson.subject)} lesson called "${lesson.title}".`,
    `Placement: ${placement}.`,
    `Learning objective: ${lesson.objective}`,
    `Purpose: ${purpose}`,
    `Must show: ${mustShow}`,
    `Learner action after viewing: ${learnerAction}`,
    `Visual style: ${promptStyleForRange(range)}.`,
    `Accessibility: ${visualSafetyRules()}`,
    `Output should support the caption: "${title}".`
  ].join(" ");
}

function createSlot(lesson, config) {
  const range = academyRange(lesson.academyId);
  const priority = placementWeights[config.placement] || 50;
  const id = `${lesson.id}-${config.placement}-${config.key}`.replace(/[^a-z0-9-]+/gi, "-").toLowerCase();
  return {
    id,
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    academyId: lesson.academyId,
    grade: lesson.grade,
    gradeBand: range,
    subject: lesson.subject,
    placement: config.placement,
    priority,
    assetType: config.assetType,
    title: config.title,
    reason: config.reason,
    caption: config.caption,
    altText: config.altText,
    prompt: buildPrompt({
      lesson,
      title: config.caption,
      placement: config.placement,
      purpose: config.reason,
      mustShow: config.mustShow,
      learnerAction: config.learnerAction,
      assetType: config.assetType
    }),
    reviewChecklist: [
      "The image directly supports the learning objective.",
      "The visual can be explained without relying only on color.",
      "Any text is short and readable.",
      "The image is age-appropriate for the grade band.",
      "The image does not reveal or imply student personal data."
    ]
  };
}

export function getLessonVisualOpportunities(lesson) {
  const support = lesson.teachingSupport || {};
  const callouts = support.diagramCallouts || [];
  const misunderstandings = support.commonMisunderstandings || [];
  const slots = [
    createSlot(lesson, {
      key: "core",
      placement: "lesson-hero",
      assetType: "educational illustration",
      title: `${lesson.title} core visual`,
      reason: "Anchor the lesson with a memorable visual before abstract work begins.",
      caption: lesson.visual?.caption || support.summary || lesson.objective,
      altText: lesson.visual?.caption || lesson.objective,
      mustShow: support.summary || lesson.objective,
      learnerAction: "Describe what they notice, then connect it to the objective."
    }),
    createSlot(lesson, {
      key: "diagram",
      placement: "teaching-diagram",
      assetType: "labeled concept diagram",
      title: `${lesson.title} teaching diagram`,
      reason: "Make the teaching move visible so the learner can see, build, and explain the idea.",
      caption: support.description || lesson.sections.teach,
      altText: callouts.map((item) => item.title).join(", ") || lesson.objective,
      mustShow: callouts.map((item) => `${item.title}: ${item.body}`).join("; ") || lesson.sections.teach,
      learnerAction: "Point to the key parts, explain the connection, then try one example."
    }),
    createSlot(lesson, {
      key: "tutor",
      placement: "ai-tutor",
      assetType: "step-by-step help card",
      title: `${lesson.title} tutor visual`,
      reason: "Give the tutor a reusable visual to show while explaining a stuck point.",
      caption: support.confusionPrompt || "Write the exact stuck point before getting help.",
      altText: `Tutor help card for ${lesson.title}`,
      mustShow: `${support.summary || lesson.objective}; next step: ${lesson.sections.reteach}`,
      learnerAction: "Write what is confusing, then use the picture to retry one step."
    })
  ];

  misunderstandings.slice(0, 2).forEach((item, index) => {
    slots.push(
      createSlot(lesson, {
        key: `misconception-${index + 1}`,
        placement: "misconception-repair",
        assetType: "mistake-and-fix diagram",
        title: `${lesson.title} misconception repair ${index + 1}`,
        reason: "Show a common wrong idea beside the corrected reasoning.",
        caption: item.fix,
        altText: `Common misunderstanding: ${item.mistake}`,
        mustShow: `Wrong idea: ${item.mistake}. Corrective move: ${item.fix}.`,
        learnerAction: "Compare the mistake to the fix and explain which part changed."
      })
    );
  });

  if (lesson.groupHomework) {
    slots.push(
      createSlot(lesson, {
        key: "group",
        placement: "group-homework",
        assetType: "collaboration workflow diagram",
        title: `${lesson.title} group workflow`,
        reason: "Help middle and high school teams understand roles, evidence, and the shared artifact.",
        caption: lesson.groupHomework.sharedOutcome,
        altText: `Group workflow for ${lesson.groupHomework.title}`,
        mustShow: `${lesson.groupHomework.roles.join(", ")} working toward ${lesson.groupHomework.sharedOutcome}`,
        learnerAction: "Choose a role, gather evidence, and contribute to the shared artifact."
      })
    );
  }

  return slots;
}

function librarySlotId(lesson, placement, index) {
  return `${lesson.id}-${placement}-${index + 1}`.replace(/[^a-z0-9-]+/gi, "-").toLowerCase();
}

function libraryPrompt({ lesson, placement, assetType, reason, learnerAction, mustShow }) {
  const grade = lesson.gradeLevel || lesson.grade || "K-12";
  const objective = lesson.learningObjective || lesson.objective || "Support the lesson objective.";
  return [
    `Create a ${assetType} for Grade ${grade} ${subjectLabel(lesson.subject)} in ${lesson.gradeBand} called "${lesson.title}".`,
    `Placement: ${placement}.`,
    `Learning objective: ${objective}`,
    `Teaching job: ${reason}`,
    `Must show: ${mustShow}`,
    `Learner action: ${learnerAction}`,
    `Visual style: ${promptStyleForRange(lesson.gradeBand || academyRange(lesson.academyId))}.`,
    `Accessibility and safety: ${visualSafetyRules()}`,
    "Prefer a deterministic chart, table, equation, map, timeline, or labeled diagram when exact academic relationships or text must be correct."
  ].join(" ");
}

function createLibrarySlot(lesson, template, index) {
  const [placement, assetType, reason, learnerAction] = template;
  const objective = lesson.learningObjective || lesson.objective || "Support the lesson objective.";
  const misunderstanding = lesson.commonMisunderstanding || "A learner may apply a memorized rule without explaining why it works.";
  const groupDescription = typeof lesson.groupHomework === "string"
    ? lesson.groupHomework
    : lesson.groupHomework?.sharedOutcome || "Contribute individual evidence to a shared artifact.";
  const mustShowByPlacement = {
    "lesson-hero": lesson.interestingTask || objective,
    "vocabulary-anchor": `${objective}; one essential word or symbol`,
    "concrete-model": lesson.visualRequirement || objective,
    "interactive-model": lesson.interestingTask || objective,
    "worked-example": objective,
    "practice-feedback": `The relevant model for ${objective}; one repair action`,
    "ai-tutor": `${objective}; confusion diagnosis and next step`,
    "tutor-alternate": `${objective}; a second representation or explanation route`,
    "misconception-repair": `Common misunderstanding: ${misunderstanding}; corrected model and reason`,
    "assessment-stimulus": objective,
    "answer-explanation": `${objective}; evidence for the correct answer and the plausible wrong path`,
    "memory-vault": objective,
    "group-homework": groupDescription,
    "context-source": `${objective}; relevant context, source, or phenomenon`
  }[placement] || objective;
  const title = `${lesson.title} ${placement.replace(/-/g, " ")}`;
  return {
    id: librarySlotId(lesson, placement, index),
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    academyId: lesson.academyId,
    grade: lesson.gradeLevel || lesson.grade,
    gradeBand: lesson.gradeBand || academyRange(lesson.academyId),
    subject: lesson.subject,
    courseId: lesson.courseId,
    courseTitle: lesson.courseTitle,
    unitId: lesson.unitId,
    unitTitle: lesson.unitTitle,
    placement,
    priority: libraryPlacementWeights[placement] || 50,
    assetType,
    title,
    reason,
    caption: objective,
    altText: `${title} showing ${mustShowByPlacement}.`,
    learnerAction,
    source: "full-lesson-library-catalog",
    reusableFamily: placement,
    prompt: libraryPrompt({ lesson, placement, assetType, reason, learnerAction, mustShow: mustShowByPlacement }),
    reviewChecklist: [
      "The visual supports the exact lesson objective and active phase.",
      "The student action is clear without relying only on decoration or color.",
      "Exact labels, equations, tables, graphs, maps, and source text use deterministic rendering when needed.",
      "The visual matches the grade band, subject, and accessibility requirements.",
      "The asset has an alt text or structured text/data equivalent and contains no private or copyrighted material."
    ]
  };
}

export function getLessonVisualCatalog(lesson) {
  const band = lesson.gradeBand || academyRange(lesson.academyId);
  const templates = librarySlotTemplates[band] || librarySlotTemplates["K-5"];
  return templates.map((template, index) => createLibrarySlot(lesson, template, index));
}

export function getFullLibraryVisualSlotManifest({ lessons = getFullLessonLibrary(), limit } = {}) {
  const selectedLessons = typeof limit === "number" ? lessons.slice(0, Math.max(0, limit)) : lessons;
  return selectedLessons.flatMap(getLessonVisualCatalog);
}

export function getFullLibraryVisualCatalogSummary({ lessons = getFullLessonLibrary(), assets = [] } = {}) {
  const slots = getFullLibraryVisualSlotManifest({ lessons });
  const by = (items, key) => items.reduce((totals, item) => {
    const value = typeof key === "function" ? key(item) : item[key];
    totals[value] = (totals[value] || 0) + 1;
    return totals;
  }, {});
  const linked = slots.filter((slot) => assets.some((asset) => asset.lessonId === slot.lessonId && asset.placement === slot.placement));
  const productionReady = slots.filter((slot) => assets.some((asset) =>
    asset.lessonId === slot.lessonId &&
    asset.placement === slot.placement &&
    asset.status === "approved" &&
    asset.altText &&
    asset.caption &&
    asset.license &&
    (asset.assetKind === "generated-svg" || asset.storagePublicUrl)
  ));
  return {
    catalogSource: "full-lesson-library",
    lessonCount: lessons.length,
    slotCount: slots.length,
    reusableFamilyCount: new Set(slots.map((slot) => slot.reusableFamily)).size,
    byBand: by(lessons, "gradeBand"),
    bySubject: by(lessons, "subject"),
    byPlacement: by(slots, "placement"),
    groupWorkflowSlots: slots.filter((slot) => slot.placement === "group-homework").length,
    linkedSlotCount: linked.length,
    productionReadySlotCount: productionReady.length,
    missingSlotCount: slots.length - linked.length,
    readySlotCount: productionReady.length,
    coveragePercent: slots.length ? Math.round((productionReady.length / slots.length) * 1000) / 10 : 0
  };
}

function batchVisualStatus(slot, assets) {
  const candidate = assets.find((asset) => asset.lessonId === slot.lessonId && asset.placement === slot.placement);
  if (!candidate) return "missing";
  const ready = candidate.status === "approved" && candidate.altText && candidate.caption && candidate.license && (candidate.assetKind === "generated-svg" || candidate.storagePublicUrl);
  return ready ? "ready" : candidate.status || "review";
}

export function getVisualProductionBatchPlan({ batchSize = 24, limit = 12, assets = [], lessons = getFullLessonLibrary() } = {}) {
  const productionPlan = getLessonProductionBatchPlan({ batchSize });
  const selectedBatches = [...productionPlan.batches]
    .sort((a, b) => {
      const academyScore = { bridge: 0, foundation: 1, scholar: 2 };
      const gradeScore = (value) => (String(value) === "6" ? 0 : Number(String(value).replace("K", "0")) || 99);
      const subjectScore = (value) => {
        const index = visualBatchSubjectPriority.indexOf(value);
        return index >= 0 ? index : visualBatchSubjectPriority.length;
      };
      return (academyScore[a.academyId] ?? 9) - (academyScore[b.academyId] ?? 9) ||
        gradeScore(a.gradeLevel) - gradeScore(b.gradeLevel) ||
        subjectScore(a.subject) - subjectScore(b.subject) ||
        a.title.localeCompare(b.title);
    })
    .slice(0, Math.max(0, limit));
  const lessonsById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const batches = selectedBatches.map((batch) => {
    const firstSample = lessonsById.get(batch.sampleLessonIds?.[0]);
    const matchingLessons = lessons.filter((lesson) => lesson.courseId === batch.courseId && lesson.unitId === batch.unitId && String(lesson.gradeLevel) === String(batch.gradeLevel));
    const sampleIndex = firstSample ? matchingLessons.findIndex((lesson) => lesson.id === firstSample.id) : -1;
    const batchLessons = sampleIndex >= 0 ? matchingLessons.slice(sampleIndex, sampleIndex + batch.lessonCount) : [];
    const slots = batchLessons.flatMap(getLessonVisualCatalog);
    const byPlacement = slots.reduce((totals, slot) => {
      totals[slot.placement] = (totals[slot.placement] || 0) + 1;
      return totals;
    }, {});
    const byStatus = slots.reduce((totals, slot) => {
      const status = batchVisualStatus(slot, assets);
      totals[status] = (totals[status] || 0) + 1;
      return totals;
    }, {});
    const missing = byStatus.missing || 0;
    const ready = byStatus.ready || 0;
    return {
      ...batch,
      resolvedLessonCount: batchLessons.length,
      requiredSlotCount: slots.length,
      readySlotCount: ready,
      missingSlotCount: missing,
      reviewSlotCount: Math.max(0, slots.length - ready - missing),
      coveragePercent: slots.length ? Math.round((ready / slots.length) * 1000) / 10 : 0,
      byPlacement,
      byStatus,
      visualGate: missing === 0 && ready === slots.length ? "ready" : missing ? "missing-assets" : "review-required",
      nextVisualSlots: slots.filter((slot) => batchVisualStatus(slot, assets) !== "ready").slice(0, 8)
    };
  });
  return {
    batchSize: productionPlan.batchSize,
    totalBatches: productionPlan.totalBatches,
    selectedBatches: batches.length,
    totalLessons: productionPlan.totalLessons,
    totalRequiredSlots: batches.reduce((sum, batch) => sum + batch.requiredSlotCount, 0),
    totalReadySlots: batches.reduce((sum, batch) => sum + batch.readySlotCount, 0),
    totalMissingSlots: batches.reduce((sum, batch) => sum + batch.missingSlotCount, 0),
    batches
  };
}

function getDraftVisualOpportunity(draft) {
  return createSlot(
    {
      id: draft.id,
      academyId: draft.academyId || "foundation",
      grade: draft.grade || "3",
      subject: draft.subject || "lesson",
      title: draft.title || "Untitled draft",
      objective: draft.objective || "Draft objective pending.",
      visual: draft.visual || null,
      teachingSupport: {
        summary: draft.objective || "Draft objective pending.",
        description: draft.reviewNotes || "Draft needs a visual plan before publication.",
        diagramCallouts: [
          { title: "Objective", body: draft.objective || "Draft objective pending." },
          { title: "Practice", body: draft.reviewNotes || "Add practice details." },
          { title: "Review", body: "Human review before learner release." }
        ],
        commonMisunderstandings: []
      },
      sections: {
        teach: draft.objective || "Draft objective pending.",
        reteach: draft.reviewNotes || "Draft needs reteach notes."
      }
    },
    {
      key: "draft",
      placement: "content-draft",
      assetType: "draft lesson image",
      title: `${draft.title || "Draft"} visual plan`,
      reason: "Draft needs a reviewed visual before it can become a rich learner experience.",
      caption: draft.objective || draft.reviewNotes || "Draft visual support.",
      altText: `Draft visual plan for ${draft.title || "lesson draft"}`,
      mustShow: draft.objective || draft.reviewNotes || "Draft learning idea.",
      learnerAction: "Use the image to preview the lesson goal."
    }
  );
}

export function getProjectVisualAudit(state = {}, { includeFullCatalog = false } = {}) {
  const lessonSlots = pilotLessons.flatMap(getLessonVisualOpportunities);
  const draftSlots = (state.contentDrafts || [])
    .filter((draft) => !draft.visualAssetId)
    .map(getDraftVisualOpportunity);
  const assets = Array.isArray(state.visualAssets) ? state.visualAssets : [];
  const slotsWithStatus = [...lessonSlots, ...draftSlots].map((slot) => {
    const matchingAssets = assets.filter((asset) => {
      if (asset.lessonId !== slot.lessonId && asset.draftId !== slot.lessonId) return false;
      if (asset.placement !== slot.placement) return false;
      return true;
    });
    const exactAsset = matchingAssets.find((asset) => asset.generationMetadata?.slotId === slot.id);
    const candidate = exactAsset || (matchingAssets.length === 1 ? matchingAssets[0] : matchingAssets[0]);
    const productionReady = Boolean(
      candidate &&
        candidate.status === "approved" &&
        candidate.altText &&
        candidate.caption &&
        candidate.license &&
        (candidate.assetKind === "generated-svg" || candidate.storagePublicUrl)
    );
    const assetStatus = !candidate
      ? "missing"
      : candidate.status === "approved" && productionReady
        ? "approved"
        : candidate.status === "approved"
          ? "approved-pending-storage"
          : candidate.status === "rejected"
            ? "rejected"
            : "review";
    return {
      ...slot,
      assetId: candidate?.id || "",
      assetCount: matchingAssets.length,
      assetStatus,
      productionReady,
      storageBacked: Boolean(candidate?.storagePublicUrl || candidate?.storagePath),
      reviewVersion: Number(candidate?.reviewVersion || 0)
    };
  });
  const slots = slotsWithStatus.sort((a, b) => {
    const statusWeight = { missing: 4, rejected: 3, review: 2, "approved-pending-storage": 1, approved: 0 };
    return (statusWeight[b.assetStatus] || 0) - (statusWeight[a.assetStatus] || 0) || b.priority - a.priority;
  });
  const byPlacement = slots.reduce((totals, slot) => {
    totals[slot.placement] = (totals[slot.placement] || 0) + 1;
    return totals;
  }, {});
  const byStatus = slots.reduce((totals, slot) => {
    totals[slot.assetStatus] = (totals[slot.assetStatus] || 0) + 1;
    return totals;
  }, {});

  return {
    agentId: "visual-learning-agent",
    agentName: "Visual Learning Agent",
    auditedLessons: pilotLessons.length,
    auditedDrafts: state.contentDrafts?.length || 0,
    totalSlots: slots.length,
    highPriority: slots.filter((slot) => slot.priority >= 88).length,
    byPlacement,
    byStatus,
    generatedAssets: assets.filter((asset) => asset.assetKind === "openai-generated-image").length,
    approvedAssets: assets.filter((asset) => asset.status === "approved").length,
    storageBackedAssets: assets.filter((asset) => asset.storagePublicUrl || asset.storagePath).length,
    highPriorityMissing: slots.filter((slot) => slot.priority >= 88 && slot.assetStatus === "missing").length,
    highPriorityReview: slots.filter((slot) => slot.priority >= 88 && slot.assetStatus === "review").length,
    fullCatalog: includeFullCatalog
      ? getFullLibraryVisualCatalogSummary({ assets })
      : null,
    slots
  };
}

export function findVisualOpportunity(state, slotId) {
  return getProjectVisualAudit(state).slots.find((slot) => slot.id === slotId) || null;
}

export function createGeneratedVisualAsset({ slot, prompt, b64Json, model, outputFormat = "png", usage = null, createdAt = "" }) {
  const timestamp = createdAt || new Date().toLocaleString();
  return {
    id: `asset-openai-${slot.id}-${Date.now()}`,
    draftId: "",
    lessonId: slot.lessonId,
    status: "review",
    assetKind: "openai-generated-image",
    placement: slot.placement,
    subject: slot.subject,
    grade: slot.grade,
    title: slot.title,
    caption: slot.caption,
    altText: slot.altText,
    license: "openai-generated-review-required",
    credit: `OpenAI Images API via ${model}`,
    assetUrl: `data:image/${outputFormat};base64,${b64Json}`,
    storageProvider: "supabase-storage",
    storageBucket: "",
    storagePath: "",
    storagePublicUrl: "",
    storageStatus: "pending-storage",
    sourcePrompt: prompt,
    sourceModel: model,
    reviewChecklist: slot.reviewChecklist,
    usage,
    generationMetadata: {
      model,
      outputFormat,
      placement: slot.placement,
      slotId: slot.id,
      reviewRequired: true
    },
    createdAt: timestamp,
    updatedAt: timestamp
  };
}
