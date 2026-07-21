export const nexusLessonFamilies = [
  "concept_launch",
  "skill_workshop",
  "fluency_sprint",
  "reasoning_lab",
  "inquiry_investigation",
  "seminar_discussion",
  "mastery_check",
  "transfer_challenge",
  "project_studio"
];

export const nexusLearningPhases = ["orient", "model", "deconstruct", "practice", "reason", "prove", "remember", "transfer", "adapt"];

export const nexusLearningStates = [
  "not_diagnosed",
  "prerequisite_gap",
  "acquiring",
  "developing",
  "accurate",
  "secure",
  "durable",
  "transferable"
];

export const nexusMasteryProofs = ["recall", "explain", "perform", "retain", "transfer"];

const lessonFamilySet = new Set(nexusLessonFamilies);
const learningPhaseSet = new Set(nexusLearningPhases);
const learningStateSet = new Set(nexusLearningStates);
const masteryProofSet = new Set(nexusMasteryProofs);
const memoryReviewModes = new Set(["recall", "recognize_discriminate", "explain", "correct", "connect", "apply", "mix"]);
const evidenceResults = new Set(["correct", "partially_correct", "incorrect", "incomplete", "not_attempted"]);
const assistanceLevels = new Set(["independent", "hinted", "guided", "modeled", "ineligible"]);
const errorActionTypes = new Set(["retry", "reteach", "prerequisite_repair", "alternate_representation", "challenge", "escalate"]);

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function asArray(value) {
  return Array.isArray(value) ? value.filter((item) => item !== undefined && item !== null) : [];
}

function firstText(...values) {
  return values.find(nonEmptyString) || "";
}

function unique(values) {
  return [...new Set(asArray(values).filter(nonEmptyString))];
}

function academyForLesson(lesson = {}) {
  if (["foundation", "bridge", "scholar"].includes(lesson.academy)) return lesson.academy;
  if (["foundation", "bridge", "scholar"].includes(lesson.academyId)) return lesson.academyId;
  const grade = Number.parseInt(String(lesson.grade || lesson.gradeLevel || ""), 10);
  if (Number.isFinite(grade) && grade <= 5) return "foundation";
  if (Number.isFinite(grade) && grade <= 8) return "bridge";
  return "scholar";
}

function inferLessonFamily(lesson = {}) {
  if (lesson.lessonFamily && lessonFamilySet.has(lesson.lessonFamily)) return lesson.lessonFamily;
  if (lesson.groupHomework) return "project_studio";
  if (lesson.subject === "science") return "inquiry_investigation";
  if (lesson.subject === "ela" || lesson.subject === "social-studies") return "reasoning_lab";
  if (lesson.subject === "math") return "skill_workshop";
  return "concept_launch";
}

function phaseModule(phase, title, studentAction, extras = {}) {
  return {
    phase,
    title,
    studentAction,
    ...extras
  };
}

function modulesFromV2Lesson(lesson = {}) {
  const sections = lesson.sections || lesson.lessonSections || {};
  const modules = [
    phaseModule("orient", "Learning destination", firstText(lesson.studentFacing?.mission, lesson.objective, lesson.learningObjective), {
      successCheck: firstText(lesson.essentialQuestion, "I can say what I am learning and why it matters.")
    }),
    phaseModule("model", "Clear model", firstText(sections.directInstruction, sections.teach, lesson.teachingSupport?.teacherModel, lesson.visual?.caption), {
      visualSupport: firstText(lesson.visual?.title, lesson.visual?.caption, lesson.visual?.altText)
    }),
    phaseModule("deconstruct", "Break down the idea", firstText(lesson.studentFacing?.steps?.[0], lesson.teachingSupport?.firstPrinciplesPrompt, "Name the parts, rules, and relationships that make the idea work.")),
    phaseModule("practice", "Try it with support", firstText(sections.guidedPractice, sections.interactiveActivity, sections.independentPractice), {
      successCheck: "The learner can try the skill and explain one decision."
    }),
    phaseModule("reason", "Reason with evidence", firstText(lesson.studentFacing?.thinkingPrompt, lesson.evidenceTask, lesson.groupHomework?.prompt, "Explain why the answer or model makes sense.")),
    phaseModule("prove", "Show current learning", firstText(lesson.quiz?.[0]?.question, lesson.masteryCheck, "Complete a current-context proof task independently.")),
    phaseModule("remember", "Schedule retrieval", firstText(lesson.retentionChecks?.[0]?.prompt, "Review the priority idea after a delay.")),
    phaseModule("transfer", "Use it somewhere new", firstText(sections.challengePath, lesson.challengePath, lesson.groupHomework?.deliverable, "Apply the idea in a changed context.")),
    phaseModule("adapt", "Choose next step", firstText(sections.reteachPath, lesson.reteachPath, "Use the evidence to decide reteach, practice, review, or challenge."))
  ];
  return modules.filter((module) => nonEmptyString(module.studentAction));
}

function proofsFromV2Lesson(lesson = {}, phaseModules = []) {
  const proofs = ["recall", "explain", "perform"];
  if (phaseModules.some((module) => module.phase === "remember")) proofs.push("retain");
  if (phaseModules.some((module) => module.phase === "transfer")) proofs.push("transfer");
  return unique(proofs);
}

export function adaptV2LessonToNexusV3(lesson = {}) {
  const phaseModules = modulesFromV2Lesson(lesson);
  const activePhases = phaseModules.map((module) => module.phase);
  const requiredMasteryProofs = proofsFromV2Lesson(lesson, phaseModules);
  const lessonFamily = inferLessonFamily(lesson);
  return {
    schemaVersion: "v2-adapted",
    sourceSchemaVersion: lesson.schemaVersion || "legacy-v2",
    id: lesson.id,
    title: lesson.title,
    academy: academyForLesson(lesson),
    gradeLevel: String(lesson.gradeLevel || lesson.grade || ""),
    subject: lesson.subject,
    course: lesson.courseTitle || lesson.course || "",
    unitId: lesson.unitId || lesson.unitTitle || `${lesson.subject || "subject"}-unit`,
    lessonNumber: Number(lesson.lessonNumber || 1),
    estimatedMinutes: Number(lesson.estimatedMinutes || lesson.minutes || 25),
    lessonFamily,
    activePhases,
    targetLearningStates: ["acquiring", "developing", "accurate"],
    learningObjective: firstText(lesson.learningObjective, lesson.objective),
    successCriteria: unique([
      lesson.successCriteria,
      lesson.studentFacing?.success,
      "I can explain the idea in my own words.",
      "I can complete a current-context proof task."
    ].flat()),
    essentialQuestion: lesson.essentialQuestion || "",
    standardsTags: unique(lesson.standardsTags || lesson.standards || []),
    thinkingSkillTags: unique([lessonFamily, ...(lesson.thinkingSkillTags || [])]),
    vocabularyTerms: unique(lesson.vocabularyTerms || lesson.vocabulary || []),
    prerequisiteSkillIds: unique(lesson.prerequisiteSkillIds || lesson.prerequisiteSkills || []),
    outcomes: {
      knowledge: unique([lesson.objective || lesson.learningObjective, ...(lesson.vocabularyTerms || [])]),
      capability: unique([lesson.studentFacing?.mission, lesson.sections?.independentPractice, lesson.sections?.interactiveActivity]),
      reasoning: unique([lesson.studentFacing?.thinkingPrompt, lesson.teachingSupport?.firstPrinciplesPrompt]),
      retention: activePhases.includes("remember") ? ["Delayed retrieval evidence is required before durable mastery."] : [],
      transfer: activePhases.includes("transfer") ? ["The learner must apply the idea in a changed context."] : []
    },
    phaseModules,
    proofTasks: requiredMasteryProofs.map((proof) => ({
      proof,
      prompt: proof === "retain" ? "Complete a delayed Memory Vault check." : proof === "transfer" ? "Apply the idea in a new context." : "Show this proof without final-answer help.",
      independentRequired: true
    })),
    requiredMasteryProofs,
    feedbackRules: [
      {
        diagnosisCode: "unknown_or_misconception",
        result: "The learner's response is incomplete or uncertain.",
        hint: "Ask the learner to name the exact stuck point and compare it with the model.",
        action: "Route to targeted reteach, alternate representation, or guided retry."
      }
    ],
    reteachPaths: [
      {
        id: `${lesson.id || "lesson"}-reteach`,
        trigger: "Current-context proof is below threshold or explanation is unclear.",
        action: firstText(lesson.sections?.reteachPath, lesson.reteachPath, "Reteach with a different model and a smaller step.")
      }
    ],
    prerequisiteRepairPaths: [
      {
        id: `${lesson.id || "lesson"}-prerequisite-repair`,
        trigger: "The learner cannot start because prerequisite vocabulary or skill is missing.",
        action: "Pause the lesson, repair the prerequisite, then return to the model."
      }
    ],
    challengePaths: [
      {
        id: `${lesson.id || "lesson"}-challenge`,
        trigger: "The learner is secure in the current context.",
        action: firstText(lesson.sections?.challengePath, lesson.challengePath, "Assign a transfer challenge with explanation.")
      }
    ],
    parentTeacherNotes: lesson.parentTeacherNotes || lesson.teachingSupport?.adultNote || "",
    accessibilityNotes: unique([lesson.accessibilityNotes, lesson.visual?.altText].flat()),
    safetyNotes: unique(lesson.safetyNotes || []),
    contentStatus: "seed",
    version: "3-adapter-preview",
    migration: {
      adaptedFrom: "v2",
      nativeV3: false,
      warnings: [
        "This lesson is compatibility-adapted. It is not a native V3 redesign.",
        "Lesson family, active phases, and mastery proofs were inferred from legacy fields.",
        "Immediate score bands must remain routing signals only until V3 mastery evidence is implemented."
      ]
    },
    legacySource: lesson
  };
}

export function validateNexusLessonV3(lesson = {}, { requireNative = true } = {}) {
  const errors = [];
  const warnings = [];
  const schemaVersion = lesson.schemaVersion;
  const native = schemaVersion === "3";

  if (requireNative && !native) errors.push({ path: "schemaVersion", message: "Native V3 lessons must declare schemaVersion \"3\"." });
  if (!requireNative && schemaVersion === "v2-adapted") warnings.push({ path: "schemaVersion", message: "Lesson is adapted from V2 and still requires native redesign." });
  if (!nonEmptyString(lesson.id)) errors.push({ path: "id", message: "Lesson id is required." });
  if (!nonEmptyString(lesson.title)) errors.push({ path: "title", message: "Lesson title is required." });
  if (!["foundation", "bridge", "scholar"].includes(lesson.academy)) errors.push({ path: "academy", message: "Academy must be foundation, bridge, or scholar." });
  if (!lessonFamilySet.has(lesson.lessonFamily)) errors.push({ path: "lessonFamily", message: "Lesson family is required and must be canonical." });
  if (!asArray(lesson.activePhases).length) errors.push({ path: "activePhases", message: "At least one active learning phase is required." });
  for (const phase of asArray(lesson.activePhases)) {
    if (!learningPhaseSet.has(phase)) errors.push({ path: "activePhases", message: `Unknown learning phase: ${phase}.` });
  }
  for (const state of asArray(lesson.targetLearningStates)) {
    if (!learningStateSet.has(state)) errors.push({ path: "targetLearningStates", message: `Unknown learning state: ${state}.` });
  }
  if (!nonEmptyString(lesson.learningObjective)) errors.push({ path: "learningObjective", message: "Learning objective is required." });
  if (!asArray(lesson.successCriteria).length) errors.push({ path: "successCriteria", message: "At least one success criterion is required." });
  if (!asArray(lesson.requiredMasteryProofs).length) errors.push({ path: "requiredMasteryProofs", message: "At least one mastery proof is required." });
  for (const proof of asArray(lesson.requiredMasteryProofs)) {
    if (!masteryProofSet.has(proof)) errors.push({ path: "requiredMasteryProofs", message: `Unknown mastery proof: ${proof}.` });
  }
  const modulePhases = new Set(asArray(lesson.phaseModules).map((module) => module.phase));
  for (const phase of asArray(lesson.activePhases)) {
    if (!modulePhases.has(phase)) errors.push({ path: "phaseModules", message: `Active phase ${phase} has no module.` });
  }
  if (!lesson.outcomes || !asArray(lesson.outcomes.knowledge).length || !asArray(lesson.outcomes.capability).length) {
    errors.push({ path: "outcomes", message: "Knowledge and capability outcomes are required." });
  }
  if (!asArray(lesson.feedbackRules).length) errors.push({ path: "feedbackRules", message: "Diagnostic feedback rules are required." });
  if (!asArray(lesson.reteachPaths).length) errors.push({ path: "reteachPaths", message: "Reteach paths are required." });
  if (!asArray(lesson.challengePaths).length) errors.push({ path: "challengePaths", message: "Challenge paths are required." });
  if (asArray(lesson.requiredMasteryProofs).includes("retain") && !asArray(lesson.activePhases).includes("remember")) {
    errors.push({ path: "activePhases", message: "Retain proof requires an active remember phase." });
  }
  if (asArray(lesson.requiredMasteryProofs).includes("transfer") && !asArray(lesson.activePhases).includes("transfer")) {
    errors.push({ path: "activePhases", message: "Transfer proof requires an active transfer phase." });
  }

  return {
    passed: errors.length === 0,
    native,
    schemaVersion,
    errors,
    warnings
  };
}

export function getRenderableNexusPhaseModules(lesson = {}) {
  const modulesByPhase = new Map(asArray(lesson.phaseModules).map((module) => [module.phase, module]));
  return asArray(lesson.activePhases)
    .filter((phase) => learningPhaseSet.has(phase))
    .map((phase) => modulesByPhase.get(phase))
    .filter((module) => module && nonEmptyString(module.studentAction));
}

function contractResult(errors) {
  return { passed: errors.length === 0, errors };
}

function requiredText(errors, value, path) {
  if (!nonEmptyString(value)) errors.push({ path, message: `${path} is required.` });
}

export function validateNexusUnitV3(unit = {}) {
  const errors = [];
  if (unit.schemaVersion !== "3") errors.push({ path: "schemaVersion", message: "Unit must declare schemaVersion \"3\"." });
  requiredText(errors, unit.id, "id");
  requiredText(errors, unit.title, "title");
  if (!lessonFamilySet.has(unit.primaryLessonFamily) && unit.primaryLessonFamily !== undefined) {
    errors.push({ path: "primaryLessonFamily", message: "Unknown primary lesson family." });
  }
  if (!["foundation", "bridge", "scholar"].includes(unit.academy)) errors.push({ path: "academy", message: "Academy is required." });
  requiredText(errors, unit.gradeLevel, "gradeLevel");
  requiredText(errors, unit.subject, "subject");
  if (!asArray(unit.lessonIds).length) errors.push({ path: "lessonIds", message: "At least one lesson id is required." });
  if (!asArray(unit.unitObjectives).length) errors.push({ path: "unitObjectives", message: "At least one unit objective is required." });
  if (!asArray(unit.assessment?.proofs).length) errors.push({ path: "assessment.proofs", message: "At least one assessment proof is required." });
  for (const proof of asArray(unit.assessment?.proofs)) {
    if (!masteryProofSet.has(proof)) errors.push({ path: "assessment.proofs", message: `Unknown mastery proof: ${proof}.` });
  }
  return contractResult(errors);
}

export function validateNexusMasteryEvidenceV3(evidence = {}) {
  const errors = [];
  for (const path of ["id", "learnerId", "lessonId", "proof", "result", "learningState", "assistance", "recordedAt"]) requiredText(errors, evidence[path], path);
  if (!masteryProofSet.has(evidence.proof)) errors.push({ path: "proof", message: "Unknown mastery proof." });
  if (!evidenceResults.has(evidence.result)) errors.push({ path: "result", message: "Unknown evidence result." });
  if (!learningStateSet.has(evidence.learningState)) errors.push({ path: "learningState", message: "Unknown learning state." });
  if (!assistanceLevels.has(evidence.assistance)) errors.push({ path: "assistance", message: "Unknown assistance level." });
  if (evidence.score !== undefined && evidence.score !== null && (!Number.isFinite(Number(evidence.score)) || Number(evidence.score) < 0 || Number(evidence.score) > 100)) {
    errors.push({ path: "score", message: "Score must be between 0 and 100." });
  }
  if (evidence.proof === "retain" && ["independent", "hinted", "guided", "modeled"].includes(evidence.assistance) === false) {
    errors.push({ path: "assistance", message: "Retention evidence must identify how the learner performed." });
  }
  return contractResult(errors);
}

export function validateNexusMemoryVaultItemV3(item = {}) {
  const errors = [];
  for (const path of ["id", "learnerId", "skillId", "lessonId", "reviewMode", "currentLearningState", "nextReviewAt"]) requiredText(errors, item[path], path);
  if (!memoryReviewModes.has(item.reviewMode)) errors.push({ path: "reviewMode", message: "Unknown Memory Vault review mode." });
  if (!learningStateSet.has(item.currentLearningState)) errors.push({ path: "currentLearningState", message: "Unknown learning state." });
  if (item.intervalDays !== undefined && (!Number.isFinite(Number(item.intervalDays)) || Number(item.intervalDays) < 0)) errors.push({ path: "intervalDays", message: "Interval must be zero or greater." });
  if (item.confidence !== undefined && item.confidence !== null && (!Number.isFinite(Number(item.confidence)) || Number(item.confidence) < 1 || Number(item.confidence) > 5)) errors.push({ path: "confidence", message: "Confidence must be between 1 and 5." });
  if (item.retentionStrength !== undefined && item.retentionStrength !== null && (!Number.isFinite(Number(item.retentionStrength)) || Number(item.retentionStrength) < 0 || Number(item.retentionStrength) > 100)) errors.push({ path: "retentionStrength", message: "Retention strength must be between 0 and 100." });
  return contractResult(errors);
}

export function validateNexusErrorIntelligenceV3(record = {}) {
  const errors = [];
  for (const path of ["id", "learnerId", "lessonId", "result", "diagnosis", "hint", "action", "recordedAt"]) {
    if (record[path] === undefined || record[path] === null || record[path] === "") errors.push({ path, message: `${path} is required.` });
  }
  if (!evidenceResults.has(record.result?.correctness)) errors.push({ path: "result.correctness", message: "Unknown result correctness." });
  requiredText(errors, record.diagnosis?.code, "diagnosis.code");
  if (!Number.isFinite(Number(record.diagnosis?.confidence)) || Number(record.diagnosis.confidence) < 0 || Number(record.diagnosis.confidence) > 1) errors.push({ path: "diagnosis.confidence", message: "Diagnosis confidence must be between 0 and 1." });
  if (!Number.isFinite(Number(record.hint?.level)) || Number(record.hint.level) < 1 || Number(record.hint.level) > 5) errors.push({ path: "hint.level", message: "Hint level must be between 1 and 5." });
  requiredText(errors, record.hint?.text, "hint.text");
  if (!errorActionTypes.has(record.action?.type)) errors.push({ path: "action.type", message: "Unknown error-intelligence action." });
  requiredText(errors, record.action?.target, "action.target");
  return contractResult(errors);
}

export function getNexusV3ContractSummary() {
  return {
    schemaVersion: "3",
    lessonFamilies: nexusLessonFamilies,
    learningPhases: nexusLearningPhases,
    learningStates: nexusLearningStates,
    masteryProofs: nexusMasteryProofs,
    memoryReviewModes: [...memoryReviewModes],
    evidenceResults: [...evidenceResults],
    assistanceLevels: [...assistanceLevels],
    errorActionTypes: [...errorActionTypes],
    schemas: [
      "lesson-v3/lesson.schema.json",
      "lesson-v3/unit.schema.json",
      "lesson-v3/mastery-evidence.schema.json",
      "lesson-v3/memory-vault.schema.json",
      "lesson-v3/error-intelligence.schema.json"
    ],
    adapter: "v2-to-v3-compatibility",
    nativeRequiredForApproval: true
  };
}
