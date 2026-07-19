import {
  aiTutorToolContract,
  contentPipeline,
  curriculum,
  diagnosticBlueprints,
  evidenceGuidanceAudit,
  explanationModes,
  experimentTemplates,
  parentOnboardingModel,
  pilotLessons,
  radicalLearningModel,
  rewardCatalog
} from "./data.js";
import {
  createProductionSeedProjection,
  getProductionDataModelReadiness,
  getProductionSchema,
  getProductionSchemaSummary,
  getRoleAccessMatrix,
  validateProductionSchema
} from "./schema.js";
import { authorizeRepositoryAction, getRepositoryAccessSummary } from "./accessControl.js";
import { getLessonLibrarySamples, getLessonLibrarySummary, getLessonProductionBatchPlan } from "./lessonLibrary.js";
import { generatePostgresMigration, getMigrationReadiness } from "./migrations.js";
import { createImageGenerationPlan, getOpenAiImageReadiness } from "./openaiImageService.js";
import { getVisualAssetStorageConfig } from "./visualAssetStorageService.js";
import { getProductionAuthReadiness, isProductionAuthProviderConfigured } from "./productionAuth.js";
import { executeToolGateway, getToolGatewaySummary, getToolRegistry, reviewTutorResponseQuality } from "./toolGateway.js";
import { getOpenAiTutorReadiness } from "./openaiTutorService.js";
import { adaptStructuredLesson } from "./contentImportAdapter.js";
import {
  createGeneratedVisualAsset,
  findVisualOpportunity,
  getFullLibraryVisualCatalogSummary,
  getLessonVisualCatalog,
  getLessonVisualOpportunities,
  getProjectVisualAudit,
  getVisualProductionBatchPlan
} from "./visualAgent.js";
import {
  createRevisionBrief,
  gradeArtifact,
  gradeForScore,
  gradeGeneratedVisual,
  gradeImagePrompt,
  gradeLessonContent,
  runArtifactRevisionLoop
} from "./artifactGrader.js";
import { exportRosterCsv, parseRosterCsv, rosterImportContract } from "./roster.js";
import { getViewContractSummary } from "./viewContract.js";
import { adaptV2LessonToNexusV3, getRenderableNexusPhaseModules } from "./nexusV3.js";

export {
  createRevisionBrief,
  gradeArtifact,
  gradeForScore,
  gradeGeneratedVisual,
  gradeImagePrompt,
  gradeLessonContent,
  runArtifactRevisionLoop
};

const storageKey = "k12-learning-academies-state";

export function createInitialState() {
  const state = {
    selectedAcademyId: "foundation",
    selectedLessonId: pilotLessons[0].id,
    selectedExplanationModeId: "diagnose",
    selectedAnswers: {},
    pendingTutorPrompt: "",
    lessonScratchpads: {},
    interactiveResponses: {},
    rewardApprovals: [],
    emailVerificationRequests: [],
    passwordResetRequests: [],
    sessionRevocations: [],
    accountInvitations: [],
    quizResults: {},
    aiLogs: [],
    toolCallLogs: [],
    lessonImprovementSignals: [],
    persistence: {
      source: "local-seed",
      syncedAt: null,
      lastError: null
    },
    parentProfile: {
      id: "parent-1",
      name: "Demo Parent",
      emailVerified: true,
      householdSetupComplete: false,
      preferredReportDay: "Friday"
    },
    consentRecords: {
      avery: {
        dataCollection: true,
        aiHelper: true,
        portfolio: true,
        thirdPartySharing: false,
        consentedBy: "Demo Parent",
        lastUpdated: "2026-06-10"
      },
      maya: {
        dataCollection: true,
        aiHelper: true,
        portfolio: true,
        thirdPartySharing: false,
        consentedBy: "Demo Parent",
        lastUpdated: "2026-06-10"
      },
      jordan: {
        dataCollection: true,
        aiHelper: true,
        portfolio: true,
        thirdPartySharing: false,
        consentedBy: "Demo Parent",
        lastUpdated: "2026-06-10"
      }
    },
    placementResults: {
      avery: {
        diagnosticId: "math-foundation",
        recommendedStart: "Grade 3 fractions prerequisite path",
        confidence: 78,
        supportPlan: "Use manipulatives and next-day recall before abstract fraction quizzes."
      },
      maya: {
        diagnosticId: "bridge-transition",
        recommendedStart: "Grade 6 integrated science with planner prompts",
        confidence: 72,
        supportPlan: "Add collaboration roles and short reflection after each group task."
      },
      jordan: {
        diagnosticId: "scholar-course-readiness",
        recommendedStart: "Grade 9 Biology and Algebra I standard track",
        confidence: 84,
        supportPlan: "Use portfolio reminders and evidence-based study sessions."
      }
    },
    rewardSettings: {
      enabled: true,
      selectedCatalogIds: ["creative-unlocks", "family-benefits", "mastery-badges"],
      familyBenefits: ["Choose dinner music", "Pick the next field trip topic", "Lead a family game"],
      requireDelayedRecall: true
    },
    learningEvents: [
      {
        id: "event-demo-1",
        learnerId: "avery",
        lessonId: "g3-fractions-number-line",
        type: "lesson_started",
        value: { source: "daily-path" },
        occurredAt: "2026-06-10 09:00"
      }
    ],
    retentionSchedules: [
      {
        id: "recall-fractions-1",
        learnerId: "avery",
        lessonId: "g3-fractions-number-line",
        skillTag: "fractions-number-line",
        currentMastery: 50,
        nextRecall: "1 day",
        intervalDays: 1,
        recallCount: 0,
        lastResult: "reteach due"
      },
      {
        id: "recall-cells-1",
        learnerId: "jordan",
        lessonId: "g9-biology-cells",
        skillTag: "cell-structure-function",
        currentMastery: 88,
        nextRecall: "7 days",
        intervalDays: 7,
        recallCount: 1,
        lastResult: "passed"
      }
    ],
    masteryBenefits: [
      {
        id: "benefit-cell-transfer",
        learnerId: "jordan",
        lessonId: "g9-biology-cells",
        type: "portfolio_marker",
        title: "Systems Biologist portfolio marker",
        unlockedAt: "2026-06-10",
        source: "Delayed recall and transfer explanation"
      }
    ],
    affectCheckins: [
      {
        id: "affect-fractions-1",
        learnerId: "avery",
        lessonId: "g3-fractions-number-line",
        joy: 4,
        frustration: 2,
        independence: 3,
        note: "Liked hopping the number line."
      }
    ],
    experimentRuns: [
      {
        id: "exp-fractions-movement",
        templateId: "movement-vs-screen",
        lessonId: "g3-fractions-number-line",
        variant: "Movement or manipulative task before guided practice",
        learnerId: "avery",
        immediateScore: 80,
        recall24h: 76,
        recall7d: 68,
        joy: 5,
        frustration: 2,
        independence: 4,
        parentMinutes: 8,
        decision: "Continue collecting 7-day recall evidence"
      }
    ],
    contentDrafts: [],
    publishedLessons: [],
    contentImportJobs: [],
    visualAssets: [],
    visualGenerationJobs: [],
    artifactReviewHistory: [],
    assignments: [
      {
        id: "assign-review-fractions",
        learner: "Avery",
        title: "Review fraction number lines",
        due: "This week",
        status: "Assigned"
      }
    ],
    schoolProfile: {
      id: "school-demo-1",
      name: "Bridge Pilot Middle School",
      district: "Demo District",
      implementationStage: "Pilot planning",
      pilotFocus: "Bridge Academy grade 6 visual science class"
    },
    learners: [
      {
        id: "avery",
        name: "Avery",
        grade: "3",
        academyId: "foundation",
        schedule: "45 min/day",
        accommodations: ["Read-aloud support", "Short practice sets"]
      },
      {
        id: "maya",
        name: "Maya",
        grade: "6",
        academyId: "bridge",
        schedule: "60 min/day",
        accommodations: ["Planner prompts"]
      },
      {
        id: "jordan",
        name: "Jordan",
        grade: "9",
        academyId: "scholar",
        schedule: "90 min/day",
        accommodations: ["Portfolio reminders"]
      }
    ],
    classSections: [
      {
        id: "class-bridge-science-6a",
        schoolId: "school-demo-1",
        teacherId: "teacher-demo-1",
        name: "Bridge Science Studio 6A",
        grade: "6",
        academyId: "bridge",
        subject: "science",
        courseTitle: "Earth Systems And Evidence Lab",
        schedule: "Period 2 | Mon-Thu | 50 min",
        status: "pilot-ready",
        studentIds: ["maya"],
        currentSessionId: "session-weather-systems-1"
      }
    ],
    classSessions: [
      {
        id: "session-weather-systems-1",
        classSectionId: "class-bridge-science-6a",
        lessonId: "g6-earth-systems-weather",
        title: "Weather Systems Class Lab",
        status: "Ready to launch",
        periodLabel: "Period 2",
        durationMinutes: 50,
        launchGoal: "Students use visuals, evidence roles, and a forecast defense to explain how weather data supports a prediction.",
        steps: [
          { id: "arrival", label: "Arrive", minutes: 3, studentAction: "Check level, objective, and mission role.", status: "ready" },
          { id: "bell-ringer", label: "Notice", minutes: 5, studentAction: "Study the weather image and write one pattern.", status: "ready" },
          { id: "mini-lesson", label: "Visual lesson", minutes: 10, studentAction: "Follow the pressure, wind, and cloud model.", status: "ready" },
          { id: "guided-practice", label: "Try", minutes: 8, studentAction: "Match data cards to a forecast claim.", status: "ready" },
          { id: "confusion-check", label: "Stuck point", minutes: 5, studentAction: "Write exactly what is unclear for tutor help.", status: "watch" },
          { id: "group-mission", label: "Team mission", minutes: 12, studentAction: "Use a role to defend a team forecast.", status: "ready" },
          { id: "exit-ticket", label: "Exit ticket", minutes: 7, studentAction: "Answer a mastery check and confidence prompt.", status: "locked" }
        ]
      }
    ],
    groupMissions: [
      {
        id: "mission-weather-forecast-crew",
        sessionId: "session-weather-systems-1",
        title: "Forecast Crew Evidence Defense",
        groupSize: "3-5 learners",
        sharedArtifact: "One team forecast board with claim, evidence, and confidence rating.",
        roles: ["Data detective", "Map reader", "Evidence speaker", "Skeptic", "Recorder"],
        individualEvidence: "Each learner submits one sentence explaining which data point changed the forecast and why.",
        teacherLookFor: "Every student must connect a visible data pattern to a forecast claim, not only copy the group answer.",
        status: "ready"
      }
    ],
    mastery: {
      "g3-fractions-number-line": {
        score: 50,
        status: "Needs review",
        attempts: 1,
        evidence: "Initial diagnostic showed number-line spacing gaps."
      },
      "g6-earth-systems-weather": {
        score: 72,
        status: "Developing",
        attempts: 1,
        evidence: "Forecast evidence practice in progress."
      },
      "g9-biology-cells": {
        score: 88,
        status: "Mastered",
        attempts: 2,
        evidence: "Explained organelle functions with evidence."
      }
    }
  };
  state.lessonScratchpads = {
    maya: {
      "g6-earth-systems-weather": {
        learnerId: "maya",
        lessonId: "g6-earth-systems-weather",
        firstStep: "I checked what changed first in the weather data.",
        explanation: "A forecast needs evidence from the visible pattern, not just a guess.",
        confusion: "I still need help deciding which data point matters most.",
        retryAfterHint: "",
        tutorReviewCount: 1,
        updatedAt: "2026-07-10T12:00:00.000Z"
      }
    }
  };
  return ensurePublishedPilotContent(state);
}

const corePilotPublishedAt = "2026-07-10T12:00:00.000Z";
const legacySeedDraftIds = new Set(["draft-grade3-ela-main-idea", "draft-grade3-science-ecosystems"]);

function pilotDraftId(lesson) {
  return `draft-pilot-${lesson.id}`;
}

function pilotAssetId(lesson) {
  return `asset-pilot-${lesson.id}`;
}

function sourceCardForLesson(lesson) {
  const standardId = lesson.standards?.[0] || defaultStandardsForSubject(lesson.subject)[0] || "standards";
  return {
    sourceId: `standard-${standardId}`,
    title: `${standardId} standards tag`,
    url: "",
    claim: `${lesson.title} is aligned to ${standardId}; state-specific mapping remains data-driven before district rollout.`,
    checkedAt: corePilotPublishedAt,
    reviewerNote: "Internal standards tag reviewed for the pilot publication bundle."
  };
}

function readabilityForLesson(lesson) {
  const band = gradeBandForGrade(lesson.grade);
  if (band === "foundation") {
    return {
      band,
      vocabularyLevel: "Upper-elementary language with read-aloud support and repeated key terms.",
      maxSentenceWords: 14,
      supportNotes: "Use short chunks, large visuals, repeated vocabulary, and a parent/teacher read-aloud option."
    };
  }
  if (band === "bridge") {
    return {
      band,
      vocabularyLevel: "Middle-school academic terms introduced through visuals and team roles.",
      maxSentenceWords: 18,
      supportNotes: "Use evidence cards, role prompts, partner talk, and confidence checks before independent writing."
    };
  }
  return {
    band,
    vocabularyLevel: "High-school course vocabulary tied to diagrams, evidence, and portfolio artifacts.",
    maxSentenceWords: 22,
    supportNotes: "Use claim-evidence-reasoning frames, diagram labels, and transfer tasks before abstraction."
  };
}

function pilotLessonSections(lesson) {
  const sections = lesson.sections || {};
  return {
    warmUp: sections.warmup || `Notice the main visual for ${lesson.title} and name one thing you already understand.`,
    directInstruction: sections.teach || lesson.teachingSupport?.description || lesson.objective,
    guidedPractice: sections.guidedPractice || "Try one example with support, then explain why the step works.",
    interactiveActivity: sections.activity || lesson.funTasks?.[0] || "Build, draw, sort, or model the idea before answering.",
    independentPractice: sections.independentPractice || "Try a short independent task and write the exact stuck point if something breaks.",
    reteachPath: sections.reteach || lesson.teachingSupport?.commonMisunderstandings?.[0]?.fix || "Use a simpler visual model and retry one step.",
    challengePath: sections.challenge || lesson.funTasks?.[1] || "Transfer the idea to a new example and explain the reasoning."
  };
}

function pilotVisualSupports(lesson) {
  const support = lesson.teachingSupport || {};
  const callouts = support.diagramCallouts || [];
  return [
    {
      placement: "lesson-hero",
      title: lesson.visual?.title || `${lesson.title} core visual`,
      description: lesson.visual?.caption || support.summary || lesson.objective,
      prompt: `Create a bold educational hero image for ${lesson.title}. Show the concept clearly with no real children, no logos, and no copyrighted characters.`,
      altText: lesson.visual?.altText || lesson.visual?.caption || lesson.objective
    },
    {
      placement: "teaching-diagram",
      title: `${lesson.title} diagram`,
      description: callouts.map((item) => `${item.title}: ${item.body}`).join(" ") || support.description || lesson.objective,
      prompt: `Create a labeled diagram for ${lesson.title} with 3-5 readable callouts and high contrast.`,
      altText: `Diagram showing ${callouts.map((item) => item.title).join(", ") || lesson.title}.`
    },
    {
      placement: "ai-tutor",
      title: `${lesson.title} tutor help card`,
      description: support.confusionPrompt || "The tutor asks what is confusing before giving a hint.",
      prompt: `Create a small tutor help card for ${lesson.title} that shows one visual hint and one retry step.`,
      altText: `Tutor visual hint for ${lesson.title}.`
    }
  ];
}

function pilotDraftFromLesson(lesson) {
  const support = lesson.teachingSupport || {};
  const sections = pilotLessonSections(lesson);
  const visualSupports = pilotVisualSupports(lesson);
  const draft = {
    id: pilotDraftId(lesson),
    sourceLessonId: lesson.id,
    sourceBatchId: "core-pilot-publication",
    status: "published",
    academyId: lesson.academyId,
    grade: lesson.grade,
    subject: lesson.subject,
    courseTitle: lesson.courseTitle,
    unitTitle: lesson.unitTitle,
    title: lesson.title,
    objective: lesson.objective,
    standards: lesson.standards || defaultStandardsForSubject(lesson.subject),
    estimatedMinutes: lesson.estimatedMinutes,
    masteryThreshold: lesson.masteryThreshold,
    xp: lesson.xp,
    reviewNotes: "Published core pilot lesson reviewed for student-facing app-led instruction, visual support, tutor prompts, and mastery checks.",
    accessibilityNotes: "Includes alt text, short chunks, keyboard-friendly tasks, high-contrast SVG support, and non-color-only instructions.",
    ageFitNotes: `${gradeBandForGrade(lesson.grade)} lesson uses age-fit pacing, vocabulary, visuals, active learning, and retry supports.`,
    essentialQuestion: lesson.essentialQuestion || `How can ${lesson.title.toLowerCase()} help me solve or explain a real problem?`,
    studentSummary: support.summary || lesson.objective,
    whyItMatters: `This matters because learners use ${lesson.unitTitle.toLowerCase()} to explain, build, predict, compare, or solve beyond one quiz.`,
    vocabularyTerms: defaultVocabularyTerms(lesson.subject),
    prerequisiteSkills: defaultPrerequisiteSkills(lesson),
    lessonSections: sections,
    helperNotes: (support.helperNotes || defaultHelperNotes(lesson).map((item) => item.note)).map((note, index) => ({
      title: ["Look", "Build", "Explain", "Recall"][index] || `Hint ${index + 1}`,
      note
    })),
    commonMisunderstandings: (support.commonMisunderstandings || []).map((item) => ({
      misunderstanding: item.mistake,
      repair: item.fix,
      signal: item.signal || ""
    })),
    visual: normalizeVisual({
      ...(lesson.visual || {}),
      altText: lesson.visual?.altText || lesson.visual?.caption || lesson.objective
    }),
    visualSupports,
    visualAssetId: pilotAssetId(lesson),
    quizQuestions: (lesson.quiz || []).map((question) => ({
      questionText: question.prompt,
      questionType: "multiple-choice",
      choices: question.choices,
      correctAnswer: question.choices?.[question.answerIndex] || question.correctAnswer || "",
      explanation: question.explanation,
      difficultyLevel: "core",
      skillTag: `${lesson.subject}-${slug(lesson.unitTitle || lesson.title)}`,
      standardTag: lesson.standards?.[0] || ""
    })),
    sourceCards: [sourceCardForLesson(lesson)],
    groupHomework: normalizeGroupHomework(lesson.groupHomework, lesson),
    readability: readabilityForLesson(lesson),
    evidenceMoves: lesson.evidenceMoves || {},
    truthReviewStatus: "approved",
    truthScore: 5,
    truthIssues: [],
    needsExternalResearch: false,
    truthReviewedAt: corePilotPublishedAt,
    truthReviewedBy: "manager",
    publishedAt: corePilotPublishedAt,
    publishedBy: "manager",
    createdAt: corePilotPublishedAt,
    updatedAt: corePilotPublishedAt,
    publicationBlocked: false,
    blockedReason: ""
  };
  const normalized = normalizeContentDraft(draft);
  const audit = getDraftEvidenceAudit(normalized);
  return {
    ...normalized,
    evidenceAudit: summarizeEvidenceAudit(audit),
    truthReviewStatus: "approved",
    contentTruthReview: {
      ...getContentDraftTruthReview({ ...normalized, truthReviewStatus: "approved" }),
      status: "approved",
      requiresHumanReview: false
    }
  };
}

function pilotVisualAssetFromLesson(lesson) {
  const draft = pilotDraftFromLesson(lesson);
  const visual = draft.visual || {};
  return {
    id: pilotAssetId(lesson),
    draftId: draft.id,
    lessonId: lesson.id,
    sourceBatchId: "core-pilot-publication",
    status: "approved",
    assetKind: "generated-svg",
    type: visual.type || "lesson-image",
    placement: "lesson-hero",
    subject: lesson.subject,
    grade: lesson.grade,
    title: visual.title || `${lesson.title} visual`,
    caption: visual.caption || lesson.objective,
    altText: visual.altText || visual.caption || lesson.objective,
    license: "generated-in-app",
    credit: "K-12 Learning Academies internal SVG renderer",
    sourcePrompt: visual.generationPrompt || lesson.studentFacing?.mission || lesson.objective,
    reviewChecklist: [
      "The image directly supports the learning objective.",
      "The labels are readable and do not rely only on color.",
      "The visual matches the lesson misconception and helper notes.",
      "The visual is age-appropriate and classroom-safe.",
      "Alt text and caption describe the learning idea."
    ],
    accessibilityChecklist: {
      hasAltText: true,
      hasCaption: true,
      highContrast: true,
      needsHumanReview: false
    },
    svg: createVisualAssetSvg({ ...lesson, visual }),
    approvedAt: corePilotPublishedAt,
    reviewedBy: "manager",
    createdAt: corePilotPublishedAt,
    updatedAt: corePilotPublishedAt
  };
}

function learningAiProductionVisualSvg(placement) {
  const chip = (x, y, label, fill = "#25d9ff", width = 150) =>
    `<rect x="${x}" y="${y}" width="${width}" height="54" rx="18" fill="${fill}" opacity=".92"/>
    <text x="${x + 18}" y="${y + 34}" font-family="Arial, sans-serif" font-size="18" font-weight="900" fill="#08101f">${escapeXml(label)}</text>`;
  const arrow = (x1, y1, x2, y2, color = "#9dff45") =>
    `<path d="M${x1} ${y1} C ${Math.round((x1 + x2) / 2)} ${y1 - 28}, ${Math.round((x1 + x2) / 2)} ${y2 + 28}, ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round"/>
    <path d="M${x2 - 18} ${y2 - 16} L${x2 + 8} ${y2} L${x2 - 18} ${y2 + 16}" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
  const header = (title, subtitle) => `
    <rect width="960" height="540" rx="26" fill="#070a18"/>
    <rect x="34" y="34" width="892" height="472" rx="30" fill="#111a3d" opacity=".72" stroke="#25d9ff" stroke-width="4"/>
    <text x="62" y="92" font-family="Arial, sans-serif" font-size="32" font-weight="900" fill="#ffffff">${escapeXml(title)}</text>
    <text x="62" y="126" font-family="Arial, sans-serif" font-size="18" font-weight="800" fill="#a8b7d7">${escapeXml(subtitle)}</text>`;

  if (placement === "teaching-diagram") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" role="img">
      ${header("Learning AI system map", "Follow the whole builder loop before trusting the output.")}
      ${chip(70, 190, "Goal", "#ffd166", 116)}
      ${arrow(190, 216, 260, 216)}
      ${chip(270, 172, "Prompt + context", "#25d9ff", 196)}
      ${arrow(472, 216, 540, 216)}
      ${chip(548, 172, "AI output", "#ff3fb4", 158)}
      ${arrow(712, 216, 780, 216)}
      ${chip(790, 172, "Human review", "#9dff45", 170)}
      ${chip(142, 330, "Frontend", "#4f8cff", 150)}
      ${chip(366, 330, "Backend/API", "#45ffbc", 170)}
      ${chip(620, 330, "Database", "#9c7dff", 150)}
      ${arrow(292, 356, 360, 356, "#25d9ff")}
      ${arrow(538, 356, 612, 356, "#25d9ff")}
      <path d="M790 260 C830 320, 770 400, 674 398" fill="none" stroke="#ff5c7a" stroke-width="8" stroke-linecap="round"/>
      <text x="682" y="438" font-family="Arial, sans-serif" font-size="18" font-weight="900" fill="#ffb6cf">Test, debug, retest</text>
      <text x="74" y="478" font-family="Arial, sans-serif" font-size="18" font-weight="800" fill="#d7e8ff">Student action: explain each part, then write one test for the app.</text>
    </svg>`;
  }

  if (placement === "ai-tutor") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" role="img">
      ${header("Tutor stuck-point router", "The tutor asks what is confusing before giving help.")}
      ${chip(70, 178, "Student question", "#ffd166", 190)}
      ${arrow(264, 204, 334, 204)}
      ${chip(344, 178, "Diagnose stuck point", "#25d9ff", 222)}
      ${arrow(570, 204, 640, 204)}
      ${chip(650, 178, "Hint, not answer", "#9dff45", 190)}
      ${chip(106, 330, "Vocabulary", "#4f8cff", 150)}
      ${chip(292, 330, "Diagram", "#ff3fb4", 128)}
      ${chip(462, 330, "First step", "#45ffbc", 142)}
      ${chip(650, 330, "Debug report", "#9c7dff", 166)}
      <text x="96" y="468" font-family="Arial, sans-serif" font-size="20" font-weight="900" fill="#ffffff">Tutor rule: ask, classify, show a model, give one next question, then check if it helped.</text>
    </svg>`;
  }

  if (placement === "misconception-repair") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" role="img">
      ${header("Common AI mistakes repair board", "Replace magic thinking with a testable builder habit.")}
      <rect x="70" y="174" width="360" height="250" rx="26" fill="#2a1035" stroke="#ff3fb4" stroke-width="4"/>
      <text x="100" y="222" font-family="Arial, sans-serif" font-size="24" font-weight="900" fill="#ffffff">Mistake</text>
      <text x="100" y="270" font-family="Arial, sans-serif" font-size="20" font-weight="800" fill="#ffd6ef">AI always knows the truth.</text>
      <text x="100" y="314" font-family="Arial, sans-serif" font-size="20" font-weight="800" fill="#ffd6ef">Frontend and backend are the same.</text>
      <text x="100" y="358" font-family="Arial, sans-serif" font-size="20" font-weight="800" fill="#ffd6ef">One happy-path test is enough.</text>
      ${arrow(444, 300, 524, 300, "#9dff45")}
      <rect x="540" y="174" width="350" height="250" rx="26" fill="#102f35" stroke="#25d9ff" stroke-width="4"/>
      <text x="570" y="222" font-family="Arial, sans-serif" font-size="24" font-weight="900" fill="#ffffff">Repair</text>
      <text x="570" y="270" font-family="Arial, sans-serif" font-size="20" font-weight="800" fill="#d7f8ff">Verify facts and run tests.</text>
      <text x="570" y="314" font-family="Arial, sans-serif" font-size="20" font-weight="800" fill="#d7f8ff">Screen vs server vs database.</text>
      <text x="570" y="358" font-family="Arial, sans-serif" font-size="20" font-weight="800" fill="#d7f8ff">Normal, edge, privacy, accessibility.</text>
      <text x="84" y="474" font-family="Arial, sans-serif" font-size="18" font-weight="800" fill="#d7e8ff">Student action: pick one mistake and rewrite it as a builder rule.</text>
    </svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" role="img">
    ${header("AI builder crew mission", "Each role owns one part of the app blueprint.")}
    ${chip(74, 178, "Prompt engineer", "#ffd166", 190)}
    ${chip(290, 178, "Frontend designer", "#25d9ff", 210)}
    ${chip(526, 178, "Backend mapper", "#45ffbc", 190)}
    ${chip(184, 324, "Bug hunter", "#ff5c7a", 150)}
    ${chip(418, 324, "Safety reviewer", "#9dff45", 190)}
    ${chip(660, 324, "Shared blueprint", "#9c7dff", 210)}
    ${arrow(500, 205, 640, 352, "#25d9ff")}
    ${arrow(380, 352, 652, 352, "#9dff45")}
    <text x="78" y="476" font-family="Arial, sans-serif" font-size="18" font-weight="800" fill="#d7e8ff">Group product: prompt, screen sketch, backend/API map, tests, bug report, and safety rule.</text>
  </svg>`;
}

function learningAiProductionVisualAssets() {
  const lesson = pilotLessons.find((item) => item.id === "g6-learning-ai-build-test");
  if (!lesson) return [];
  const specs = [
    {
      placement: "teaching-diagram",
      title: "Learning AI system map",
      caption: "A complete builder map connecting prompt, AI output, frontend, backend, database, tests, and bug fixes.",
      altText: "A cyber-neon diagram shows a student goal flowing to a prompt, AI output, human review, frontend, backend API, database, and a test debug retest loop.",
      studentUseNote: "Trace the path out loud, then name one test for each app part."
    },
    {
      placement: "ai-tutor",
      title: "Tutor stuck-point router",
      caption: "The tutor classifies the student's exact confusion before choosing a hint, diagram, first step, or debug-report prompt.",
      altText: "A diagram shows a student question moving to stuck-point diagnosis, then to hint options such as vocabulary, diagram, first step, and debug report.",
      studentUseNote: "Write which stuck-point lane you are in before asking the tutor for help."
    },
    {
      placement: "misconception-repair",
      title: "Common AI mistakes repair board",
      caption: "Mistakes such as trusting AI blindly or testing only the happy path are paired with concrete builder repairs.",
      altText: "A two-column board lists AI mistakes on the left and repairs on the right, including verify facts, separate screen server and database, and test normal edge privacy and accessibility cases.",
      studentUseNote: "Choose one mistake and rewrite it as a builder rule you will follow."
    },
    {
      placement: "group-homework",
      title: "AI builder crew mission",
      caption: "A group-work visual showing prompt engineer, frontend designer, backend mapper, bug hunter, and safety reviewer roles.",
      altText: "A cyber-neon group mission board shows five roles feeding into a shared AI app blueprint with prompt, screen sketch, backend map, tests, bug report, and safety rule.",
      studentUseNote: "Pick a role and add one artifact to the shared blueprint."
    }
  ];

  return specs.map((spec) => ({
    id: `asset-${lesson.id}-${spec.placement}`,
    draftId: pilotDraftId(lesson),
    lessonId: lesson.id,
    sourceBatchId: "core-pilot-publication",
    status: "approved",
    assetKind: "generated-svg",
    type: "ai-learning-production-visual",
    placement: spec.placement,
    subject: lesson.subject,
    grade: lesson.grade,
    title: spec.title,
    caption: spec.caption,
    altText: spec.altText,
    studentUseNote: spec.studentUseNote,
    license: "generated-in-app",
    credit: "K-12 Learning Academies internal SVG renderer",
    sourcePrompt: `${lesson.visual.generationPrompt} Placement: ${spec.placement}. Purpose: ${spec.studentUseNote} Use high contrast, short readable labels, clear spacing, no real children, no private data, no logos, classroom-safe cyber-neon Academy Worlds style.`,
    reviewChecklist: [
      "The visual directly supports the Learning AI objective.",
      "The learner action is explicit and tied to the placement.",
      "Labels are short, high contrast, and readable.",
      "The visual addresses a known confusion or workflow step.",
      "The image is classroom-safe with no real children, private data, logos, or copyrighted characters."
    ],
    accessibilityChecklist: {
      hasAltText: true,
      hasCaption: true,
      highContrast: true,
      needsHumanReview: false
    },
    svg: learningAiProductionVisualSvg(spec.placement),
    approvedAt: corePilotPublishedAt,
    reviewedBy: "manager",
    reviewStatus: "approved",
    createdAt: corePilotPublishedAt,
    updatedAt: corePilotPublishedAt
  }));
}

function standardPilotProductionVisualSvg(lesson, placement) {
  const [accent, background] = visualColorsForSubject(lesson.subject);
  const title = escapeXml(clipText(lesson.title || "Lesson", 58));
  const objective = escapeXml(clipText(lesson.objective || lesson.teachingSupport?.summary || "", 96));
  const misconception = lesson.teachingSupport?.commonMisunderstandings?.[0] || {};
  const groupTitle = lesson.groupHomework?.title || "Team mission";
  const label = (x, y, textValue, fill = accent, width = 176) => `
    <rect x="${x}" y="${y}" width="${width}" height="54" rx="18" fill="${fill}" opacity=".94"/>
    <text x="${x + 18}" y="${y + 35}" font-family="Arial, sans-serif" font-size="18" font-weight="900" fill="#07101f">${escapeXml(clipText(textValue, 20))}</text>`;
  const arrow = (x1, y1, x2, y2, color = "#9dff45") => `
    <path d="M${x1} ${y1} C ${Math.round((x1 + x2) / 2)} ${y1 - 30}, ${Math.round((x1 + x2) / 2)} ${y2 + 30}, ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round"/>
    <path d="M${x2 - 18} ${y2 - 16} L${x2 + 8} ${y2} L${x2 - 18} ${y2 + 16}" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
  const shell = (heading, subheading, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" role="img">
    <rect width="960" height="540" rx="26" fill="#070a18"/>
    <rect x="34" y="34" width="892" height="472" rx="30" fill="${background}" opacity=".16" stroke="${accent}" stroke-width="4"/>
    <text x="62" y="88" font-family="Arial, sans-serif" font-size="30" font-weight="900" fill="#ffffff">${escapeXml(heading)}</text>
    <text x="62" y="122" font-family="Arial, sans-serif" font-size="17" font-weight="800" fill="#a8b7d7">${escapeXml(subheading)}</text>
    <text x="62" y="158" font-family="Arial, sans-serif" font-size="18" font-weight="800" fill="#d7e8ff">${objective}</text>
    ${body}
    <text x="68" y="482" font-family="Arial, sans-serif" font-size="18" font-weight="800" fill="#d7e8ff">Learning target: ${title}</text>
  </svg>`;

  if (placement === "teaching-diagram") {
    return shell(`${lesson.grade} ${String(lesson.subject).replace("-", " ")} model`, "Look, label, explain, then try the idea yourself.", `
      ${label(74, 220, "Look", "#ffd166", 120)}
      ${arrow(196, 248, 266, 248)}
      ${label(276, 220, "Label parts", accent, 166)}
      ${arrow(446, 248, 516, 248)}
      ${label(526, 220, "Explain why", "#9dff45", 170)}
      ${arrow(700, 248, 770, 248)}
      ${label(780, 220, "Try it", "#ff3fb4", 118)}
      <rect x="178" y="344" width="604" height="62" rx="22" fill="#0c1430" stroke="#25d9ff" stroke-width="3"/>
      <text x="204" y="382" font-family="Arial, sans-serif" font-size="20" font-weight="900" fill="#ffffff">${escapeXml(clipText(lesson.visual?.caption || lesson.teachingSupport?.summary || lesson.objective, 72))}</text>
    `);
  }

  if (placement === "ai-tutor") {
    return shell("Tutor help map", "The app asks what is confusing and changes the explanation path.", `
      ${label(72, 214, "Student stuck", "#ffd166", 176)}
      ${arrow(252, 242, 332, 242)}
      ${label(342, 214, "Classify", accent, 136)}
      ${arrow(482, 242, 560, 242)}
      ${label(570, 214, "Hint path", "#9dff45", 148)}
      ${arrow(722, 242, 800, 242)}
      ${label(810, 214, "Retry", "#ff3fb4", 106)}
      ${label(130, 344, "Picture", "#25d9ff", 132)}
      ${label(320, 344, "Example", "#9c7dff", 132)}
      ${label(510, 344, "First step", "#45ffbc", 142)}
      ${label(710, 344, "Check", "#ffd166", 114)}
    `);
  }

  if (placement === "misconception-repair") {
    return shell("Misconception repair", "Turn the common wrong idea into a clear next move.", `
      <rect x="70" y="198" width="365" height="214" rx="26" fill="#2a1035" stroke="#ff3fb4" stroke-width="4"/>
      <text x="100" y="244" font-family="Arial, sans-serif" font-size="24" font-weight="900" fill="#ffffff">Common mix-up</text>
      <text x="100" y="294" font-family="Arial, sans-serif" font-size="20" font-weight="800" fill="#ffd6ef">${escapeXml(clipText(misconception.mistake || "The model is memorized without meaning.", 38))}</text>
      ${arrow(448, 306, 522, 306)}
      <rect x="540" y="198" width="350" height="214" rx="26" fill="#102f35" stroke="#25d9ff" stroke-width="4"/>
      <text x="570" y="244" font-family="Arial, sans-serif" font-size="24" font-weight="900" fill="#ffffff">Repair move</text>
      <text x="570" y="294" font-family="Arial, sans-serif" font-size="20" font-weight="800" fill="#d7f8ff">${escapeXml(clipText(misconception.fix || "Use the visual, explain why, then retry.", 38))}</text>
      <text x="96" y="438" font-family="Arial, sans-serif" font-size="18" font-weight="800" fill="#d7e8ff">Student action: say the wrong idea, correct it, then solve one new example.</text>
    `);
  }

  return shell("Group mission board", "Each learner owns one useful part of the shared work.", `
    ${label(76, 210, "Model keeper", "#25d9ff", 174)}
    ${label(284, 210, "Evidence finder", "#ffd166", 184)}
    ${label(506, 210, "Checker", "#9dff45", 132)}
    ${label(674, 210, "Explainer", "#ff3fb4", 148)}
    <rect x="190" y="344" width="580" height="72" rx="26" fill="#0c1430" stroke="#9dff45" stroke-width="4"/>
    <text x="220" y="386" font-family="Arial, sans-serif" font-size="21" font-weight="900" fill="#ffffff">${escapeXml(clipText(groupTitle, 56))}</text>
    <text x="220" y="416" font-family="Arial, sans-serif" font-size="16" font-weight="800" fill="#a8b7d7">Team output: model, evidence, check, and explanation.</text>
  `);
}

function standardPilotProductionVisualAssets() {
  return pilotLessons
    .filter((lesson) => lesson.id !== "g6-learning-ai-build-test")
    .flatMap((lesson) =>
      getRequiredPilotVisualPlacements(lesson)
        .filter((placement) => placement !== "lesson-hero")
        .map((placement) => {
          const titleByPlacement = {
            "teaching-diagram": `${lesson.title} teaching diagram`,
            "ai-tutor": `${lesson.title} tutor help visual`,
            "misconception-repair": `${lesson.title} misconception repair`,
            "group-homework": `${lesson.title} group mission`
          };
          const actionByPlacement = {
            "teaching-diagram": "Use the diagram to label the model, explain the relationship, and try one example.",
            "ai-tutor": "Use this visual when the learner names the stuck point and needs a hint path.",
            "misconception-repair": "Use this repair board to replace the common wrong idea with a better next move.",
            "group-homework": "Use this board to assign roles and produce a shared artifact with individual accountability."
          };
          return {
            id: `asset-${lesson.id}-${placement}`,
            draftId: pilotDraftId(lesson),
            lessonId: lesson.id,
            sourceBatchId: "core-pilot-publication",
            status: "approved",
            assetKind: "generated-svg",
            type: `${lesson.visual?.type || "lesson"}-${placement}`,
            placement,
            subject: lesson.subject,
            grade: lesson.grade,
            title: titleByPlacement[placement] || `${lesson.title} visual`,
            caption: `${titleByPlacement[placement] || lesson.title}: ${actionByPlacement[placement] || "Use the image to explain the learning objective."}`,
            altText: `${titleByPlacement[placement] || lesson.title} for Grade ${lesson.grade} ${String(lesson.subject).replace("-", " ")}. It uses short labels, arrows, and high contrast to support the lesson objective.`,
            studentUseNote: actionByPlacement[placement] || "Describe what you notice, connect it to the objective, and retry one step.",
            license: "generated-in-app",
            credit: "K-12 Learning Academies internal SVG renderer",
            sourcePrompt: `Create a polished cyber-neon Academy Worlds ${placement} visual for lesson ${lesson.id}, called ${lesson.title}. Grade ${lesson.grade}, subject ${lesson.subject}. Learning objective: ${lesson.objective}. Purpose: ${actionByPlacement[placement]}. Must show clear labels, readable spacing, high contrast, learner action after viewing, no real children, no private data, no logos, no copyrighted characters, classroom-safe imagery.`,
            reviewChecklist: [
              "The visual directly supports the lesson objective.",
              "The learner action is explicit and tied to this placement.",
              "Labels are short, high contrast, and readable.",
              "The visual addresses a known confusion, model, tutor path, or group task.",
              "The image is classroom-safe with no real children, private data, logos, or copyrighted characters."
            ],
            accessibilityChecklist: {
              hasAltText: true,
              hasCaption: true,
              highContrast: true,
              needsHumanReview: false
            },
            svg: standardPilotProductionVisualSvg(lesson, placement),
            approvedAt: corePilotPublishedAt,
            reviewedBy: "manager",
            reviewStatus: "approved",
            createdAt: corePilotPublishedAt,
            updatedAt: corePilotPublishedAt
          };
        })
    );
}

function createCorePilotPublication() {
  const contentDrafts = pilotLessons.map(pilotDraftFromLesson);
  const visualAssets = [
    ...pilotLessons.map(pilotVisualAssetFromLesson),
    ...standardPilotProductionVisualAssets(),
    ...learningAiProductionVisualAssets(),
    ...bridgeGrade6BatchOneVisualAssets()
  ];
  const publishedLessons = contentDrafts.map((draft) =>
    createPublishedLessonFromDraft(draft, {
      publishedAt: draft.publishedAt,
      publishedBy: draft.publishedBy,
      updatedAt: draft.updatedAt
    })
  );
  return { contentDrafts, visualAssets, publishedLessons };
}

function withPolishedNextWaveLessonProfile(lesson, draft) {
  if (lesson.id !== "bridge-6-ela-u1-l1") return draft;
  return {
    ...draft,
    title: "Myth Lab: Decode the Hero's Journey",
    objective: "Analyze how a myth uses character choices, symbols, and conflict to reveal a theme or cultural value.",
    essentialQuestion: "How do myths use impossible events to tell real truths about courage, choices, and community values?",
    studentSummary:
      "In this mission, you become a myth decoder: spot the pattern of a hero's journey, connect symbols to meaning, and prove a theme with evidence from the story.",
    whyItMatters:
      "Myths are ancient story technology. They helped communities explain danger, courage, pride, loyalty, and consequences. The same patterns still appear in games, movies, books, and real leadership choices.",
    vocabularyTerms: ["myth", "theme", "archetype", "symbol", "conflict", "cultural value", "evidence"],
    prerequisiteSkills: [
      "Can retell the beginning, middle, and end of a short story.",
      "Can quote or paraphrase one detail as evidence.",
      "Can explain how a character's choice changes what happens next."
    ],
    studentFacing: {
      mission: "Decode a myth like a story engineer",
      bigIdea: "A myth is not just an old adventure. It is a pattern of choices, symbols, and consequences that teaches what a community values.",
      whyItMatters: "If you can decode a myth, you can notice the same story patterns in games, films, novels, and real-life leadership decisions.",
      modelSteps: [
        "Track the hero: What does the character want, fear, or need to prove?",
        "Mark the turning point: Which choice creates the biggest consequence?",
        "Decode the symbol: What object, creature, place, or event stands for a bigger idea?",
        "Prove the theme: Write a claim that connects the choice, symbol, and consequence."
      ],
      example:
        "If a hero ignores a warning and loses something important, the theme might be that pride can make people blind to danger. The evidence is the ignored warning plus the consequence.",
      nonExample: "Do not write 'the theme is mythology' or retell the whole plot. A theme is a message about life, choices, or values.",
      quickCheck: "Explain one symbol and one character choice, then connect both to a possible theme.",
      tutorHandoff: "I am stuck on whether my evidence proves the theme or only retells the plot."
    },
    lessonSections: {
      warmup:
        "The app shows three myth-inspired images: a dangerous journey, a mysterious object, and a warning sign. Write what each image could symbolize before seeing the vocabulary.",
      directInstruction:
        "The app teaches myths as story systems: a hero faces pressure, makes a choice, meets a consequence, and reveals a cultural value. A color-coded map separates plot events from theme evidence.",
      guidedPractice:
        "Read a short myth excerpt, tap the hero's choice, highlight one symbol, and choose which detail best supports a theme claim. Feedback explains why one answer is evidence and another is only plot retelling.",
      interactiveActivity:
        "Build a Myth Decoder Board: drag cards into four zones labeled hero goal, pressure, symbol, and consequence. Then write one theme claim using the frame: This myth suggests that ___ because ___.",
      independentPractice:
        "Answer two evidence questions, revise one weak theme claim, and write a two-sentence explanation that uses at least one story detail.",
      summary:
        "Memory card: Myth = impossible events plus real human meaning. Theme proof needs a choice, a consequence, and evidence.",
      reteach:
        "If theme and plot get mixed up, hide extra details and ask only: What choice did the character make? What happened because of it? What lesson could that show?",
      challenge:
        "Compare a myth pattern to a modern game, movie, or book and explain which archetype or symbol changed."
    },
    helperNotes: [
      { title: "Theme is not a topic", note: "If the learner writes one word like courage, ask: What is the myth saying about courage?" },
      { title: "Evidence must do work", note: "A strong detail should show the choice, symbol, or consequence that makes the theme believable." },
      { title: "Use the pattern before the paragraph", note: "Complete hero goal -> pressure -> choice -> consequence before writing the final claim." },
      { title: "Tutor stuck-point prompt", note: "Ask whether the student is stuck on vocabulary, finding evidence, telling plot from theme, or starting the claim." }
    ],
    commonMisunderstandings: [
      {
        misunderstanding: "The student retells the whole myth instead of naming a theme.",
        repair: "Cross out extra events and keep only the choice, consequence, and message about life.",
        signal: "The answer begins with 'first, then, after that' and never says what the myth teaches."
      },
      {
        misunderstanding: "The student names a topic, like bravery, but not a theme.",
        repair: "Use the frame: The myth suggests that bravery means ___ when ___.",
        signal: "The answer is one word or a vague phrase."
      },
      {
        misunderstanding: "The student chooses a cool symbol but cannot explain what it means.",
        repair: "Ask: What feeling, danger, value, or choice does this object or creature stand for?",
        signal: "The symbol is named, but the explanation stays literal."
      }
    ],
    visualSupports: [
      {
        placement: "lesson-hero",
        title: "Myth Decoder Board",
        description: "A neon classroom quest board showing four connected zones: hero goal, pressure, symbol, and consequence.",
        prompt:
          "Create a bold cyber-neon Grade 6 ELA diagram called Myth Decoder Board. Show four labeled zones: hero goal, pressure, symbol, consequence. Use clear icons, no real children, no logos, no copyrighted characters, readable labels.",
        altText: "A myth decoder board with hero goal, pressure, symbol, and consequence zones."
      },
      {
        placement: "teaching-diagram",
        title: "Plot-to-theme evidence chain",
        description: "A labeled chain showing character choice -> consequence -> cultural value -> theme claim.",
        prompt:
          "Create a clean teaching diagram for Grade 6 mythology analysis showing character choice leading to consequence, cultural value, and theme claim. Use short labels, arrows, high contrast, cyber academy style.",
        altText: "A diagram connecting character choice, consequence, cultural value, and theme claim."
      },
      {
        placement: "ai-tutor",
        title: "Theme repair hint card",
        description: "A tutor card that asks whether the student is stuck on plot, symbol, evidence, or claim wording.",
        prompt:
          "Create a small tutor hint card for Grade 6 ELA mythology. Show four stuck-point buttons: plot, symbol, evidence, claim. Keep it readable and classroom safe.",
        altText: "Tutor hint card with plot, symbol, evidence, and claim stuck-point options."
      },
      {
        placement: "group-homework",
        title: "Myth remix team board",
        description: "A collaborative board where students assign roles and remix a myth pattern into a modern school-safe scenario.",
        prompt:
          "Create a team mission board for Grade 6 mythology group homework. Include facilitator, evidence keeper, visual builder, and reporter roles. Cyber-neon academy style, no real students.",
        altText: "A group mission board for remixing a myth pattern with team roles."
      }
    ],
    groupHomework: {
      title: "Myth Remix Crew Mission",
      roles: ["Pattern tracker", "Evidence keeper", "Symbol designer", "Theme reporter"],
      sharedArtifact:
        "Create one Myth Decoder Board for a myth or myth-inspired story. The board must show the hero goal, pressure, symbol, consequence, and one theme claim.",
      individualAccountability: "Each learner submits one evidence sentence explaining how their assigned card proves the final theme."
    },
    quizQuestions: [
      {
        questionText: "Which answer is a theme, not just a topic?",
        questionType: "multiple-choice",
        choices: ["Courage", "The hero fights a monster", "Real courage means making a wise choice even when afraid", "The story has a magical object"],
        correctAnswer: "Real courage means making a wise choice even when afraid",
        explanation: "A theme is a message about life or choices. It usually makes a claim, not just a one-word topic.",
        difficultyLevel: "core",
        skillTag: "ela-theme-analysis",
        standardTag: "ccss-ela"
      },
      {
        questionText: "A hero ignores a warning, enters a forbidden cave, and loses the tool needed to finish the quest. Which detail is strongest evidence for a theme about pride?",
        questionType: "multiple-choice",
        choices: ["The cave is dark", "The hero ignores the warning", "The quest happens long ago", "The tool has a silver handle"],
        correctAnswer: "The hero ignores the warning",
        explanation: "Ignoring the warning shows the choice connected to pride. The consequence helps prove the theme.",
        difficultyLevel: "core",
        skillTag: "ela-evidence-selection",
        standardTag: "ccss-ela"
      },
      {
        questionText: "What should you do first if you only have a plot summary but no theme?",
        questionType: "multiple-choice",
        choices: ["Add more events", "Find the character choice and consequence", "Copy the title", "Pick the longest sentence"],
        correctAnswer: "Find the character choice and consequence",
        explanation: "The choice and consequence help turn plot into a message about life, values, or decisions.",
        difficultyLevel: "developing",
        skillTag: "ela-plot-to-theme",
        standardTag: "ccss-ela"
      },
      {
        questionText: "A symbol in a myth is best understood as...",
        questionType: "multiple-choice",
        choices: ["A random object that looks interesting", "A detail that stands for a bigger idea or value", "A character's name", "The last sentence of the story"],
        correctAnswer: "A detail that stands for a bigger idea or value",
        explanation: "Symbols matter because they carry meaning beyond the literal object, place, creature, or event.",
        difficultyLevel: "transfer",
        skillTag: "ela-symbolism",
        standardTag: "ccss-ela"
      }
    ],
    sourceCards: [
      {
        sourceId: "ccss-ela-rl-6-2",
        title: "Common Core ELA RL.6.2",
        url: "",
        claim: "Students determine a theme or central idea and explain how it is conveyed through details.",
        checkedAt: "2026-07-16T00:00:00.000Z",
        reviewerNote: "Used as the default national standard tag for Grade 6 literary theme analysis."
      },
      {
        sourceId: "ccss-ela-rl-6-4",
        title: "Common Core ELA RL.6.4",
        url: "",
        claim: "Students determine meaning of words and phrases as used in a text, including figurative and connotative meanings.",
        checkedAt: "2026-07-16T00:00:00.000Z",
        reviewerNote: "Supports symbol and meaning work in myth analysis."
      }
    ],
    reward: "Unlock the Myth Decoder badge after a strong theme claim and a next-day recall check."
  };
}

const bridgeGrade6BatchOneSpecs = [
  {
    id: "bridge-g6-batch1-math-ratios-rate-lab",
    subject: "math",
    courseTitle: "Grade 6 Mathematics",
    unitTitle: "Ratios, Rates, And Proportional Reasoning",
    title: "Ratio Lab: Fair Comparisons",
    objective: "Use ratio tables, double number lines, and unit rates to compare real-world deals fairly.",
    essentialQuestion: "How can a model prove which deal is actually better?",
    vocabularyTerms: ["ratio", "equivalent ratio", "rate", "unit rate", "scale factor"],
    standards: ["ccss-math-6-rp"],
    visualModel: "ratio table and double number line",
    misconception: "The student picks the lower total price without comparing the price per one unit.",
    repair: "Divide or scale to one unit, then write a sentence naming the unit rate for each deal.",
    groupTitle: "Deal Detective Crew",
    groupOutcome: "Build a fair-comparison board for two snack, game-currency, or classroom-supply deals."
  },
  {
    id: "bridge-g6-batch1-math-expressions-machine",
    subject: "math",
    courseTitle: "Grade 6 Mathematics",
    unitTitle: "Expressions, Equations, And Variables",
    title: "Variable Machine: Build And Test Expressions",
    objective: "Write, evaluate, and explain expressions with variables by connecting a situation to a repeatable rule.",
    essentialQuestion: "How does a variable help us describe a pattern before we know every number?",
    vocabularyTerms: ["variable", "expression", "coefficient", "operation", "substitute"],
    standards: ["ccss-math-6-ee"],
    visualModel: "input-output machine and expression builder",
    misconception: "The student treats a variable as a label instead of a value that can change.",
    repair: "Test the expression with two inputs and explain what stays the same and what changes.",
    groupTitle: "Rule Builder Team",
    groupOutcome: "Create a variable machine for a real classroom pattern and test it with three inputs."
  },
  {
    id: "bridge-g6-batch1-science-weather-systems",
    subject: "science",
    courseTitle: "Grade 6 Integrated Science",
    unitTitle: "Earth Systems, Weather, And Climate",
    title: "Weather Evidence Lab: Predict The Pattern",
    objective: "Use pressure, wind, temperature, and cloud evidence to explain and predict a weather pattern.",
    essentialQuestion: "How do pieces of weather data work together as a system?",
    vocabularyTerms: ["system", "air pressure", "front", "wind", "evidence"],
    standards: ["ngss-ms-ess2"],
    visualModel: "weather map with pressure arrows and evidence tags",
    misconception: "The student memorizes weather words but cannot connect evidence to a prediction.",
    repair: "Point to one map clue, say what it changes, then explain the prediction with because.",
    groupTitle: "Forecast Studio",
    groupOutcome: "Publish a one-minute forecast with a map, three evidence labels, and one uncertainty note."
  },
  {
    id: "bridge-g6-batch1-ela-close-reading-evidence",
    subject: "ela",
    courseTitle: "Grade 6 English Language Arts",
    unitTitle: "Close Reading And Evidence",
    title: "Evidence Quest: Prove The Claim",
    objective: "Read closely, choose relevant evidence, and explain how the evidence supports a claim about a text.",
    essentialQuestion: "What makes evidence strong enough to prove a claim?",
    vocabularyTerms: ["claim", "evidence", "inference", "relevance", "explanation"],
    standards: ["ccss-ela-rl-6-1", "ccss-ela-ri-6-1"],
    visualModel: "claim-evidence-reasoning bridge",
    misconception: "The student chooses an interesting quote that does not actually prove the claim.",
    repair: "Ask whether the quote directly answers the claim, then add a because sentence explaining the link.",
    groupTitle: "Evidence Review Board",
    groupOutcome: "Build a shared claim-evidence-reasoning board and defend which evidence is strongest."
  },
  {
    id: "bridge-g6-batch1-social-early-humans-map",
    subject: "social-studies",
    courseTitle: "Grade 6 Ancient World History And Geography",
    unitTitle: "Historical Thinking, Geography, And Early Humans",
    title: "Human Journey Map: Evidence And Geography",
    objective: "Use maps, artifacts, and environmental clues to explain how geography shaped early human choices.",
    essentialQuestion: "How can geography and artifacts help us reason about human decisions long ago?",
    vocabularyTerms: ["artifact", "migration", "geography", "chronology", "source"],
    standards: ["c3-history-geography", "ca-hss-6"],
    visualModel: "migration map with artifact evidence cards",
    misconception: "The student treats history as a list of dates instead of evidence about choices and conditions.",
    repair: "Connect one artifact or map feature to a human need, choice, or tradeoff.",
    groupTitle: "Archaeology Map Crew",
    groupOutcome: "Create a map claim using one geography clue, one artifact clue, and one uncertainty note."
  }
];

function bridgeBatchVisualSvg(spec, placement) {
  const accentBySubject = {
    math: "#25d9ff",
    science: "#9dff45",
    ela: "#ff3fb4",
    "social-studies": "#ffd166"
  };
  const accent = accentBySubject[spec.subject] || "#25d9ff";
  const safeTitle = escapeXml(clipText(spec.title, 48));
  const safeObjective = escapeXml(clipText(spec.objective, 90));
  const panel = (x, y, width, heading, body, color) => `
    <rect x="${x}" y="${y}" width="${width}" height="150" rx="22" fill="#0b1530" stroke="${color}" stroke-width="4"/>
    <text x="${x + 22}" y="${y + 42}" font-family="Arial, sans-serif" font-size="22" font-weight="900" fill="#ffffff">${escapeXml(clipText(heading, 22))}</text>
    <text x="${x + 22}" y="${y + 82}" font-family="Arial, sans-serif" font-size="18" font-weight="800" fill="#d7e8ff">${escapeXml(clipText(body, 30))}</text>
    <text x="${x + 22}" y="${y + 116}" font-family="Arial, sans-serif" font-size="16" font-weight="800" fill="#a8b7d7">Point, explain, retry</text>`;
  const arrow = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} C ${(x1 + x2) / 2} ${y1 - 24}, ${(x1 + x2) / 2} ${y2 + 24}, ${x2} ${y2}" fill="none" stroke="#9dff45" stroke-width="7" stroke-linecap="round"/><path d="M${x2 - 16} ${y2 - 14} L${x2 + 8} ${y2} L${x2 - 16} ${y2 + 14}" fill="none" stroke="#9dff45" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
  const placementContent = {
    "lesson-hero": `${panel(74, 210, 246, "Notice", spec.visualModel, accent)}${panel(356, 210, 246, "Mission", "Find the fair relationship", "#ffd166")}${panel(638, 210, 246, "Prove", "Use evidence + because", "#ff3fb4")}${arrow(320, 286, 350, 286)}${arrow(602, 286, 632, 286)}`,
    "teaching-diagram": `${panel(74, 210, 246, "Context", "Name the quantities", accent)}${panel(356, 210, 246, "Model", spec.visualModel, "#25d9ff")}${panel(638, 210, 246, "Reason", "Compare one unit", "#9dff45")}${arrow(320, 286, 350, 286)}${arrow(602, 286, 632, 286)}`,
    "ai-tutor": `${panel(74, 210, 246, "Stuck?", "Write the exact gap", "#ffd166")}${panel(356, 210, 246, "Choose", "Word, model, step", accent)}${panel(638, 210, 246, "Retry", "Try one smaller move", "#ff3fb4")}${arrow(320, 286, 350, 286)}${arrow(602, 286, 632, 286)}`,
    "misconception-repair": `${panel(74, 210, 246, "Wrong path", spec.misconception, "#ff3fb4")}${panel(356, 210, 246, "Check", "Use the visible model", accent)}${panel(638, 210, 246, "Repair", spec.repair, "#9dff45")}${arrow(320, 286, 350, 286)}${arrow(602, 286, 632, 286)}`,
    "group-homework": `${panel(74, 210, 246, "Roles", "Builder + checker", accent)}${panel(356, 210, 246, "Artifact", spec.groupTitle, "#ffd166")}${panel(638, 210, 246, "Proof", "Each learner explains", "#9dff45")}${arrow(320, 286, 350, 286)}${arrow(602, 286, 632, 286)}`
  }[placement] || `${panel(74, 210, 246, "Look", spec.visualModel, accent)}${panel(356, 210, 246, "Explain", "Name the evidence", "#ffd166")}${panel(638, 210, 246, "Apply", "Try a new case", "#9dff45")}${arrow(320, 286, 350, 286)}${arrow(602, 286, 632, 286)}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" role="img">
    <rect width="960" height="540" rx="28" fill="#070a18"/>
    <rect x="32" y="32" width="896" height="476" rx="30" fill="#111a3d" stroke="${accent}" stroke-width="4"/>
    <text x="64" y="88" font-family="Arial, sans-serif" font-size="30" font-weight="900" fill="#ffffff">Grade 6 Mission Visual</text>
    <text x="64" y="124" font-family="Arial, sans-serif" font-size="18" font-weight="800" fill="#a8b7d7">${safeTitle} | ${escapeXml(placement.replace(/-/g, " "))}</text>
    <text x="64" y="160" font-family="Arial, sans-serif" font-size="17" font-weight="800" fill="#d7e8ff">${safeObjective}</text>
    ${placementContent}
    <text x="68" y="474" font-family="Arial, sans-serif" font-size="17" font-weight="800" fill="#d7e8ff">Student action: point to the model, explain the evidence, then complete one retry.</text>
  </svg>`;
}

function bridgeGrade6BatchOneVisualAssets() {
  const placements = [
    "lesson-hero",
    "teaching-diagram",
    "ai-tutor",
    "misconception-repair",
    "group-homework",
    "assessment-stimulus",
    "answer-explanation",
    "memory-vault"
  ];
  return bridgeGrade6BatchOneSpecs.flatMap((spec) => placements.map((placement) => {
    const draftId = `draft-${spec.id}`;
    const slotId = `${draftId}-${placement}`;
    return {
      id: `asset-${slotId}`,
      draftId,
      lessonId: draftId,
      sourceBatchId: "bridge-academy-grade-6-batch-1",
      status: "approved",
      assetKind: "generated-svg",
      type: `bridge-grade6-${placement}`,
      placement,
      subject: spec.subject,
      grade: "6",
      title: `${spec.title} ${placement.replace(/-/g, " ")}`,
      caption: `Use this ${placement.replace(/-/g, " ")} to ${spec.objective.toLowerCase()}`,
      altText: `Grade 6 ${spec.subject} ${placement.replace(/-/g, " ")} for ${spec.title}. It shows ${spec.visualModel} with a student action to point, explain, and retry.`,
      studentUseNote: "Point to the model, explain the evidence, and retry one step.",
      license: "generated-in-app",
      credit: "K-12 Learning Academies internal deterministic SVG renderer",
      sourcePrompt: `Create a precise, classroom-safe Grade 6 ${spec.subject} ${placement} for ${spec.title}. Show ${spec.visualModel}. Use short labels, high contrast, no real children, no private data, no logos, and require the learner to point, explain, and retry.`,
      reviewChecklist: [
        "The visual directly supports the Grade 6 lesson objective.",
        "The visual matches the exact placement and learner action.",
        "Labels are short, readable, and do not rely only on color.",
        "The model is factually accurate and age-appropriate.",
        "Alt text, caption, safety, and review metadata are complete."
      ],
      accessibilityChecklist: {
        hasAltText: true,
        hasCaption: true,
        highContrast: true,
        keyboardEquivalentRequired: true,
        needsHumanReview: false
      },
      generationMetadata: {
        slotId,
        renderer: "deterministic-svg",
        sourceBatchId: "bridge-academy-grade-6-batch-1",
        reviewRequired: true,
        reviewedBy: "manager",
        visualVersion: "1.0.0"
      },
      svg: bridgeBatchVisualSvg(spec, placement),
      approvedAt: corePilotPublishedAt,
      reviewedBy: "manager",
      reviewStatus: "approved",
      createdAt: corePilotPublishedAt,
      updatedAt: corePilotPublishedAt
    };
  }));
}

function createBridgeGrade6BatchOneDraft(spec, index) {
  const skillTag = `${spec.subject}-${slug(spec.unitTitle)}`;
  return normalizeContentDraft({
    id: `draft-${spec.id}`,
    sourceBatchId: "bridge-academy-grade-6-batch-1",
    status: "review",
    academyId: "bridge",
    grade: "6",
    subject: spec.subject,
    courseTitle: spec.courseTitle,
    unitTitle: spec.unitTitle,
    title: spec.title,
    visualAssetId: `asset-draft-${spec.id}-lesson-hero`,
    objective: spec.objective,
    standards: spec.standards,
    estimatedMinutes: 34,
    masteryThreshold: 82,
    xp: 140,
    essentialQuestion: spec.essentialQuestion,
    studentSummary: `This Bridge Academy mission teaches you to use a ${spec.visualModel} before writing a final answer.`,
    whyItMatters: "This is built like a real middle-school class session: the app teaches, you use a visual model, your team builds evidence, the tutor helps with the stuck point, and mastery depends on explanation plus recall.",
    vocabularyTerms: spec.vocabularyTerms,
    prerequisiteSkills: ["Can write one complete explanation sentence.", "Can point to a model or source before answering.", "Can revise after feedback."],
    studentFacing: {
      mission: spec.title,
      bigIdea: spec.objective,
      whyItMatters: "This lesson helps you prove your thinking instead of guessing or memorizing.",
      modelSteps: [
        `Look at the ${spec.visualModel} and name what each part represents.`,
        "Try one guided example while the app shows why each move works.",
        "Write the exact part that feels confusing if you get stuck.",
        "Build a team artifact, then prove one answer independently."
      ],
      example: `A strong answer uses the ${spec.visualModel}, names the evidence, and explains the because link.`,
      nonExample: "A weak answer gives a final answer with no model, source, or reason.",
      quickCheck: "Before the quiz, explain the model in one sentence and name one common mistake.",
      tutorHandoff: `I am stuck on ${spec.visualModel}, vocabulary, choosing evidence, starting the first step, or explaining why.`
    },
    lessonSections: {
      warmup: `The app shows a cyber-neon ${spec.visualModel}. Write one thing you notice and one question before the rule appears.`,
      directInstruction: `The app teaches ${spec.unitTitle.toLowerCase()} in three beats: concrete situation, visual model, then academic language. The student must explain the model before practice unlocks.`,
      guidedPractice: `Work through one example with feedback. The app asks which part of the ${spec.visualModel} proves each move.`,
      interactiveActivity: `Build or annotate a ${spec.visualModel}. Drag labels, choose evidence, and write one because sentence that connects the model to the answer.`,
      independentPractice: "Complete two solo checks: one familiar problem and one changed-context transfer problem.",
      summary: `Memory card: ${spec.title} depends on model -> evidence -> explanation, not a final answer alone.`,
      reteach: `If the learner misses mastery, the app returns to the ${spec.visualModel}, hides extra steps, and asks one first-principles question.`,
      challenge: "If mastery is strong, the learner creates a new example, predicts a mistake, and writes a tutor hint for another student."
    },
    evidenceMoves: spec.subject === "math"
      ? {
          priorKnowledgeCheck: "Start with a quick notice-and-wonder check on the concrete situation before symbols appear.",
          misconceptionCheck: `Ask the learner to choose whether ${spec.misconception.toLowerCase()} is happening and explain the signal.`,
          manipulativeRationale: `Use the ${spec.visualModel} because Grade 6 learners need to see the relationship before naming the rule.`,
          representations: [`concrete context`, spec.visualModel, "equation or written explanation"],
          problemSolvingStrategy: "Name the known quantities, map them onto the visual model, then write the because sentence.",
          workedExample: `Show one complete ${spec.visualModel} example with each move labeled before independent practice.`,
          examplesAndNonExamples: [`Strong example: ${spec.repair}`, "Non-example: final answer with no model or evidence."],
          knowledgeConnections: "Connect the model to earlier fraction, multiplication, and comparison reasoning.",
          metacognitivePrompt: "Plan: what do I know? Monitor: does the model match? Evaluate: did my explanation prove the answer?",
          interventionTrigger: "If the learner cannot explain the model-to-answer link, pause the quiz and launch reteach.",
          transitionBridge: "Move from the visual model to academic notation only after the learner explains the visual in plain language.",
          feedbackFrame: "Feedback names the missing move: context, model, operation, evidence, or because link."
        }
      : {},
    helperNotes: [
      { title: "Model before answer", note: `Do not score the final answer until the learner connects it to the ${spec.visualModel}.` },
      { title: "Diagnose the stuck point", note: "Ask whether the learner is stuck on vocabulary, the first step, choosing evidence, or explaining why." },
      { title: "Team plus individual proof", note: "The group artifact is shared, but every learner submits one independent evidence sentence." },
      { title: "Recall unlock", note: "Reward XP is strongest after the learner can retrieve the idea later, not only during the first attempt." }
    ],
    commonMisunderstandings: [
      {
        misunderstanding: spec.misconception,
        repair: spec.repair,
        signal: "The response looks complete but does not explain the model-to-answer connection."
      },
      {
        misunderstanding: "The student copies a vocabulary word without using it in context.",
        repair: "Ask for a plain-language definition, a visual pointer, and one example from the task.",
        signal: "The answer contains the word but no evidence or example."
      },
      {
        misunderstanding: "The student waits for the tutor to give the answer.",
        repair: "The tutor asks for the first step, shows one hint, and requires a retry before revealing more.",
        signal: "The student asks for the final answer or says only 'I don't know.'"
      }
    ],
    visualSupports: [
      {
        placement: "lesson-hero",
        title: `${spec.title} mission board`,
        description: `A bold Grade 6 class mission board for ${spec.unitTitle}.`,
        prompt: `Create a cyber-neon Grade 6 ${spec.subject} lesson hero for ${spec.title}. Show ${spec.visualModel}, student mission, and mastery reward. No real children, no private data, no logos.`,
        altText: `${spec.title} mission board with ${spec.visualModel}.`
      },
      {
        placement: "teaching-diagram",
        title: `${spec.visualModel} teaching diagram`,
        description: `A labeled diagram that breaks the lesson model into visible parts and one learner action.`,
        prompt: `Create a readable teaching diagram for Grade 6 ${spec.subject}: ${spec.visualModel}. Include labels, arrows, one example, and learner action. High contrast, classroom safe.`,
        altText: `${spec.visualModel} teaching diagram for ${spec.title}.`
      },
      {
        placement: "ai-tutor",
        title: `${spec.title} tutor stuck-point card`,
        description: "Tutor card with stuck-point lanes: vocabulary, first step, visual model, evidence, and explanation.",
        prompt: `Create a tutor help card for ${spec.title}. Show stuck-point lanes and hint-before-answer flow. No real children, no logos.`,
        altText: `Tutor stuck-point card for ${spec.title}.`
      },
      {
        placement: "misconception-repair",
        title: `${spec.title} repair board`,
        description: spec.repair,
        prompt: `Create a misconception repair board for ${spec.title}. Show wrong idea, model check, repair move, retry. High contrast, short labels.`,
        altText: `Misconception repair board for ${spec.title}.`
      },
      {
        placement: "group-homework",
        title: `${spec.groupTitle} visual`,
        description: spec.groupOutcome,
        prompt: `Create a group mission board for ${spec.groupTitle}. Include roles, shared artifact, individual proof, and review checklist. Cyber-neon academy style.`,
        altText: `${spec.groupTitle} group mission visual.`
      }
    ],
    groupHomework: normalizeGroupHomework({
      title: spec.groupTitle,
      roles: ["Facilitator", "Model builder", "Evidence checker", "Reporter"],
      sharedOutcome: spec.groupOutcome,
      accountability: "Each learner submits one independent explanation that names their evidence and the model part they used."
    }, { gradeBand: "6-8" }),
    quizQuestions: [
      {
        questionText: `What makes an answer strong in ${spec.title}?`,
        questionType: "multiple-choice",
        choices: ["It is short", "It uses a model and explains the evidence", "It copies a vocabulary word", "It skips the first step"],
        correctAnswer: "It uses a model and explains the evidence",
        explanation: "Bridge Academy mastery requires evidence and reasoning, not just a final answer.",
        difficultyLevel: "core",
        skillTag,
        standardTag: spec.standards[0]
      },
      {
        questionText: `Which move best repairs this misconception: ${spec.misconception}`,
        questionType: "multiple-choice",
        choices: [spec.repair, "Ask for the final answer", "Add more unrelated facts", "Skip the visual model"],
        correctAnswer: spec.repair,
        explanation: "The repair targets the actual misunderstanding and returns to the model.",
        difficultyLevel: "developing",
        skillTag: `${skillTag}-misconception`,
        standardTag: spec.standards[0]
      },
      {
        questionText: "What should the tutor ask before giving help?",
        questionType: "multiple-choice",
        choices: ["What exactly feels confusing?", "Do you want me to finish it?", "Should we skip the model?", "Which reward do you want?"],
        correctAnswer: "What exactly feels confusing?",
        explanation: "The tutor has to diagnose the stuck point before choosing an explanation mode.",
        difficultyLevel: "core",
        skillTag: "tutor-confusion-diagnosis",
        standardTag: spec.standards[0]
      },
      {
        questionText: "Why does the group task still require individual evidence?",
        questionType: "multiple-choice",
        choices: ["So one person can do all the work", "So each learner proves their own understanding", "So the task is longer", "So the quiz can be skipped"],
        correctAnswer: "So each learner proves their own understanding",
        explanation: "Collaboration helps learning, but mastery still needs individual proof.",
        difficultyLevel: "transfer",
        skillTag: `${skillTag}-group-accountability`,
        standardTag: spec.standards[0]
      }
    ],
    sourceCards: [
      {
        sourceId: `bridge-g6-batch1-${spec.subject}`,
        title: `Bridge Academy Batch 1 ${spec.courseTitle}`,
        url: "",
        claim: `${spec.title} is an original Nexus lesson aligned to the documented Grade 6 Batch 1 scope and standards tags.`,
        checkedAt: "2026-07-16T00:00:00.000Z",
        reviewerNote: "Original lesson design. External IXL references may guide coverage only and must not be copied."
      },
      {
        sourceId: "grade-6-california-scope-sequence",
        title: "Bridge Academy Grade 6 California Scope Sequence",
        url: "docs/curriculum/grade-6-california-scope-sequence.md",
        claim: "Batch 1 should cover ratios/rates, expressions/equations, weather systems, close reading/evidence, and early-human historical thinking.",
        checkedAt: "2026-07-16T00:00:00.000Z",
        reviewerNote: "Local source-of-truth scope sequence for the first sellable Bridge Academy wedge."
      }
    ],
    reward: `Earn ${spec.title} XP after a correct explanation and next-day recall check.`,
    reviewNotes: `Bridge Academy Batch 1 lesson ${index + 1} of ${bridgeGrade6BatchOneSpecs.length}. Original Nexus content; do not copy proprietary IXL explanations, question banks, or sequence.`,
    accessibilityNotes: "Every diagram needs alt text, readable labels, keyboard-completable interactions, captions, and a non-color-only explanation path.",
    ageFitNotes: "Grade 6 Bridge Academy pacing: independent but scaffolded, visual first, group artifact with individual accountability, tutor hints before answers.",
    truthReviewStatus: "needs-human-review",
    truthScore: 4,
    truthIssues: ["Truth-policy and standards review required before publication."],
    needsExternalResearch: false,
    createdAt: corePilotPublishedAt,
    updatedAt: corePilotPublishedAt
  });
}

function createBridgeGrade6BatchOneDrafts() {
  return bridgeGrade6BatchOneSpecs.map(createBridgeGrade6BatchOneDraft);
}

const bridgeGrade6BatchOneId = "bridge-academy-grade-6-batch-1";

function getReviewableContentBatchIds(state = {}) {
  return [
    ...new Set([
      ...(state.contentDrafts || []).map((draft) => draft.sourceBatchId),
      ...(state.contentBatchPublications || []).map((publication) => publication.sourceBatchId)
    ].filter(Boolean))
  ];
}

function getContentBatchReviewState(state = {}, sourceBatchId = "") {
  const drafts = (state.contentDrafts || []).filter((draft) => draft.sourceBatchId === sourceBatchId);
  const publicationHistory = (state.contentBatchPublications || []).filter((publication) => publication.sourceBatchId === sourceBatchId);
  const latestPublication = publicationHistory[0] || null;
  const publishedBatchLessons = (state.publishedLessons || []).filter((lesson) => lesson.sourceBatchId === sourceBatchId);
  const lessonReviews = drafts.map((draft) => {
    const completeness = getContentDraftCompletenessReview(draft);
    const truth = getContentDraftTruthReview(draft);
    const review = gradeLessonContent({
      ...draft,
      quiz: draft.quizQuestions,
      visual: draft.visual || draft.visualSupports?.[0],
      teachingSupport: {
        summary: draft.studentFacing?.bigIdea || draft.studentSummary,
        diagramCallouts: (draft.visualSupports || []).map((support) => ({
          title: support.title,
          body: support.description
        })),
        commonMisunderstandings: draft.commonMisunderstandings,
        helperNotes: draft.helperNotes,
        confusionPrompt: draft.studentFacing?.tutorHandoff || `Write exactly what is confusing about ${draft.title}.`
      },
      groupHomework: draft.groupHomework
    });
    return {
      draftId: draft.id,
      title: draft.title,
      subject: draft.subject,
      passed: completeness.passed && review.score >= 80 && !review.criticalBlockers.length,
      score: review.score,
      grade: review.grade,
      truthStatus: truth.status,
      completenessStatus: completeness.status,
      blockers: [...(review.criticalBlockers || []), ...(review.missingRequirements || []), ...(!completeness.passed ? completeness.issues : [])]
    };
  });
  const scores = lessonReviews.map((review) => review.score).filter((score) => typeof score === "number");
  const score = scores.length ? Math.min(...scores) : 0;
  const decisionStatuses = drafts.map((draft) => draft.batchReviewStatus || "").filter(Boolean);
  const approved = drafts.length > 0 && drafts.every((draft) => draft.batchReviewStatus === "approved");
  const rejected = decisionStatuses.includes("rejected");
  const revisionRequired = decisionStatuses.includes("revision-required");
  const published = Boolean(latestPublication && latestPublication.status === "published");
  const partialPublication = Boolean(latestPublication && latestPublication.status === "partial");
  const passedLessons = lessonReviews.filter((review) => review.passed).length;
  const blockers = lessonReviews.flatMap((review) => review.blockers.map((blocker) => `${review.title}: ${blocker}`));
  const publishedLessonReports = (latestPublication?.results || []).map((result) => ({
    draftId: result.draftId,
    title: result.title,
    subject: result.subject,
    passed: result.status === "published",
    score: result.score ?? null,
    grade: result.grade || "",
    truthStatus: "approved",
    completenessStatus: result.status === "published" ? "complete" : "blocked",
    blockers: result.status === "published" ? [] : [result.blockedReason || "Publication blocked."]
  }));
  return {
    id: `batch-review-${sourceBatchId}`,
    sourceBatchId,
    title: sourceBatchId === bridgeGrade6BatchOneId
      ? "Bridge Academy Grade 6 Batch 1"
      : sourceBatchId.replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
    status: published ? "published" : partialPublication ? "partial" : approved ? "approved" : rejected ? "rejected" : revisionRequired ? "revision-required" : "manager-review",
    decision: published || partialPublication || approved ? "approved" : rejected ? "rejected" : revisionRequired ? "revision-required" : "",
    academyId: drafts[0]?.academyId || publishedBatchLessons[0]?.academyId || "",
    gradeBand: "6-8",
    gradeLevels: [...new Set([...drafts.map((draft) => draft.grade), ...publishedBatchLessons.map((lesson) => lesson.grade)].filter(Boolean))],
    subjects: [...new Set([...drafts.map((draft) => draft.subject), ...publishedBatchLessons.map((lesson) => lesson.subject)].filter(Boolean))],
    totalLessons: latestPublication?.totalLessons || drafts.length,
    passedLessons: latestPublication ? latestPublication.publishedCount : passedLessons,
    score: latestPublication ? latestPublication.score : score,
    grade: latestPublication ? latestPublication.grade : gradeForScore(score),
    threshold: 80,
    passed: latestPublication ? latestPublication.publishedCount === latestPublication.totalLessons && latestPublication.blockedCount === 0 : drafts.length > 0 && passedLessons === drafts.length && score >= 80 && !blockers.length,
    publishEligible: approved && drafts.every((draft) => draft.status === "review"),
    lessonIds: drafts.length ? drafts.map((draft) => draft.id) : publishedBatchLessons.map((lesson) => lesson.id),
    lessonReports: latestPublication ? publishedLessonReports : lessonReviews,
    blockers: latestPublication ? (latestPublication.results || []).filter((result) => result.status !== "published").map((result) => `${result.title}: ${result.blockedReason || "Publication blocked."}`) : blockers,
    revisionInstructions: blockers.length
      ? blockers.slice(0, 6)
      : [`Approve the batch to mark all ${drafts.length || publishedBatchLessons.length} lesson(s) as manager-reviewed, then publish each lesson through the individual content gate.`],
    reviewHistory: [
      ...publicationHistory.map((publication) => ({
        action: "batch-publication",
        status: publication.status,
        reviewer: publication.reviewedBy,
        createdAt: publication.attemptedAt,
        publishedCount: publication.publishedCount,
        blockedCount: publication.blockedCount
      })),
      ...drafts.flatMap((draft) => draft.batchReviewHistory || [])
    ].slice(0, 12),
    publication: latestPublication
  };
}

function createNextWaveContentDrafts() {
  return getLessonLibrarySamples(9).map((lesson, index) =>
    normalizeContentDraft(withPolishedNextWaveLessonProfile(lesson, {
      id: `draft-next-wave-${lesson.id}`,
      sourceBatchId: "next-wave-k12-production",
      status: "review",
      academyId: lesson.academyId,
      grade: lesson.gradeLevel,
      subject: lesson.subject,
      courseTitle: lesson.courseTitle,
      unitTitle: lesson.unitTitle,
      title: lesson.title,
      objective: lesson.learningObjective,
      standards: lesson.standardsTags,
      estimatedMinutes: lesson.estimatedMinutes,
      masteryThreshold: lesson.masteryThreshold,
      xp: lesson.gradeBand === "K-5" ? 80 : lesson.gradeBand === "6-8" ? 120 : 160,
      essentialQuestion: lesson.essentialQuestion,
      studentSummary: `This next-wave lesson turns ${lesson.unitTitle.toLowerCase()} into an app-led learning mission with a visual model, a student explanation checkpoint, and a delayed recall reward.`,
      whyItMatters: `Learners use ${lesson.unitTitle.toLowerCase()} to explain something observable, solve a real problem, or build an artifact instead of only answering a worksheet.`,
      vocabularyTerms: defaultVocabularyTerms(lesson.subject),
      prerequisiteSkills: [`Ready to notice examples of ${lesson.unitTitle.toLowerCase()}`, "Can explain a first attempt in plain words"],
      lessonSections: {
        warmup: `The app opens with a quick notice-and-wonder prompt: look at a ${lesson.visualRequirement}, then write one thing you notice and one question you have.`,
        directInstruction: `The app teaches the core idea in three short beats: concrete example, visual model, then academic language. The student must explain the idea back before moving on.`,
        guidedPractice: `The student solves a low-risk practice item with hints. The tutor asks what feels confusing before giving a strategy.`,
        interactiveActivity: `The student completes the active task: ${lesson.interestingTask}. The screen captures a drawing, sorting choice, model, or written explanation.`,
        independentPractice: "The student answers two mastery checks and one transfer question that changes the context.",
        summary: "The lesson ends with a short recap card, one common trap, and a next-day recall promise connected to the reward system.",
        reteach: "If mastery is below threshold, the app switches to a simpler visual, fewer steps, and a first-principles prompt.",
        challenge: "If mastery is strong, the app asks the learner to create a new example, explain a misconception, or connect the skill to another subject."
      },
      helperNotes: lesson.helperNotes.map((note, noteIndex) => ({
        title: ["Notice first", "Explain before scoring", "Recall for reward"][noteIndex] || `Helper note ${noteIndex + 1}`,
        note
      })),
      commonMisunderstandings: [
        {
          misunderstanding: lesson.commonMisunderstanding,
          repair: `Ask the student to point to the exact part of the visual that supports their answer before using symbols or academic wording.`,
          signal: "The answer is correct-looking, but the explanation cannot connect to the model."
        }
      ],
      visualSupports: [
        {
          title: `${lesson.unitTitle} visual model`,
          description: lesson.visualRequirement,
          prompt: `Create a bold, high-contrast classroom-safe diagram for grade ${lesson.gradeLevel}: ${lesson.visualRequirement}. No real children, no tiny text, simple labels, app UI friendly.`,
          placement: "lesson-hero",
          altText: `Diagram support for ${lesson.title}`
        },
        {
          title: `${lesson.unitTitle} step-by-step diagram`,
          description: `A labeled teaching diagram that breaks ${lesson.unitTitle.toLowerCase()} into visible parts, examples, and one student action.`,
          prompt: `Create a clean teaching diagram for grade ${lesson.gradeLevel} ${lesson.subject}: ${lesson.learningObjective}. Include short labels, arrows, one example, and a learner action. No real children, no logos, no tiny text.`,
          placement: "teaching-diagram",
          altText: `Step-by-step diagram for ${lesson.title}`
        }
      ],
      quizQuestions: [
        {
          questionText: `Which explanation best shows the idea of ${lesson.unitTitle.toLowerCase()}?`,
          questionType: "multiple-choice",
          choices: ["A memorized fact only", "A model plus a reason", "A guess with no evidence", "A copied definition only"],
          correctAnswer: "A model plus a reason",
          explanation: "Mastery means the learner can connect the answer to a model or evidence, not just repeat a phrase.",
          difficultyLevel: "core",
          skillTag: `${lesson.subject}-${slug(lesson.unitTitle)}`,
          standardTag: lesson.standardsTags?.[0] || ""
        },
        {
          questionText: "What should the tutor ask first when the learner is stuck?",
          questionType: "multiple-choice",
          choices: ["What answer do you want?", "What exactly feels confusing?", "Should I skip this?", "Do you want the final answer?"],
          correctAnswer: "What exactly feels confusing?",
          explanation: "The tutor should diagnose the stuck point before choosing an explanation mode.",
          difficultyLevel: "transfer",
          skillTag: "tutor-confusion-diagnosis",
          standardTag: lesson.standardsTags?.[0] || ""
        }
      ],
      sourceCards: [
        {
          title: "Internal K-12 production scope map",
          sourceId: "next-wave-k12-production",
          claim: "Lesson is generated from the full curriculum production map and must pass manager, truth, visual, and accessibility review before publication.",
          reviewerNote: "Review standards fit, lesson clarity, visual usefulness, and age-appropriate task design before publishing."
        }
      ],
      groupHomework: lesson.groupHomework
        ? normalizeGroupHomework({
            title: `${lesson.unitTitle} crew mission`,
            roles: lesson.groupHomework,
            sharedOutcome: `Create a shared visual artifact that explains ${lesson.unitTitle.toLowerCase()} and includes one individual reflection per teammate.`,
            accountability: "Each learner submits one explanation of what they contributed and one question they can now answer."
          }, lesson)
        : normalizeGroupHomework(null, lesson),
      reviewNotes: `Next-wave production draft ${index + 1} of 9. It is intentionally review-gated until manager, truth, visual, and accessibility checks pass.`,
      accessibilityNotes: "Requires alt text, readable labels, keyboard-completable interaction, text alternative for any diagram, and no color-only instructions.",
      ageFitNotes: `${lesson.gradeBand} pacing and task structure. Foundation lessons use parent-supported play; Bridge and Scholar lessons use group/product evidence.`,
      truthReviewStatus: "needs-human-review",
      truthScore: 4,
      truthIssues: ["Manager and Truth And Fact-Check review required before publication."],
      needsExternalResearch: false,
      createdAt: corePilotPublishedAt,
      updatedAt: corePilotPublishedAt
    }))
  );
}

function mergeById(primary = [], secondary = []) {
  const rows = new Map();
  for (const item of [...secondary, ...primary]) {
    if (item?.id) rows.set(item.id, item);
  }
  return [...rows.values()];
}

function ensurePublishedPilotContent(state) {
  const core = createCorePilotPublication();
  const nextWaveDrafts = createNextWaveContentDrafts();
  const bridgeBatchOneDrafts = createBridgeGrade6BatchOneDrafts();
  const existingDrafts = (state.contentDrafts || []).filter((draft) => !legacySeedDraftIds.has(draft.id));
  return {
    ...state,
    contentDrafts: mergeById(existingDrafts, [...core.contentDrafts, ...nextWaveDrafts, ...bridgeBatchOneDrafts]),
    visualAssets: mergeById(state.visualAssets || [], core.visualAssets),
    publishedLessons: mergeById(state.publishedLessons || [], core.publishedLessons)
  };
}

function createTutorTruthReview(lesson, studentInput, tutorResponse) {
  const quality = reviewTutorResponseQuality({
    lesson,
    support: getLessonTeachingSupport(lesson.id),
    studentInput,
    tutorResponse: tutorResponse.text || tutorResponse.response || ""
  });
  const truthScore = Math.round(quality.review.average);
  const requiresHumanReview = Boolean(tutorResponse.flagged || quality.needsExternalResearch || truthScore < 4 || quality.issues.length);

  return {
    score: truthScore,
    status: requiresHumanReview ? "needs-human-review" : "auto-reviewed",
    requiresHumanReview,
    issues: quality.issues,
    needsExternalResearch: quality.needsExternalResearch,
    scores: quality.review.scores,
    average: quality.review.average,
    researchPlan: quality.researchPlan,
    reviewedByAgentId: "truth-policy"
  };
}

function normalizeAiLog(log) {
  const lessonId = log.lessonId || findLessonIdByTitle(log.lessonTitle);
  const lesson = findLesson(lessonId);
  const baseLog = {
    ...log,
    lessonId: lesson.id,
    stuckPointCategoryId: log.stuckPointCategoryId || "",
    stuckPointLabel: log.stuckPointLabel || "",
    hintPath: Array.isArray(log.hintPath) ? log.hintPath : [],
    nextQuestion: log.nextQuestion || ""
  };
  if (baseLog.truthReview || !baseLog.response) {
    return baseLog;
  }

  const truthReview = createTutorTruthReview(lesson, baseLog.input || "", {
    text: baseLog.response,
    flagged: baseLog.flagged
  });

  return {
    ...baseLog,
    truthScore: truthReview.score,
    truthIssues: truthReview.issues,
    truthReview,
    truthReviewStatus: truthReview.status,
    needsExternalResearch: truthReview.needsExternalResearch,
    requiresHumanReview: truthReview.requiresHumanReview,
    reviewStatus: baseLog.reviewStatus || (truthReview.requiresHumanReview ? "" : "auto-reviewed")
  };
}

function textIncludesAny(value, words) {
  const normalized = String(value || "").toLowerCase();
  return words.some((word) => normalized.includes(word));
}

function contentDraftSourceIds(draft) {
  return [
    ...(draft.researchSourceIds || []),
    ...(draft.redesignTasks || []).flatMap((task) => task.sourceIds || []),
    ...(draft.sourceLedger || []).map((source) => source.sourceId || source.id || ""),
    ...(draft.sourceCards || []).map((source) => source.sourceId || source.id || "")
  ].filter(Boolean);
}

export function getContentDraftTruthReview(draft = {}) {
  const audit = getDraftEvidenceAudit(draft);
  const completeness = getContentDraftCompletenessReview(draft);
  const sourceIds = [...new Set(contentDraftSourceIds(draft))];
  const standards = draft.standards || [];
  const text = [
    draft.title,
    draft.objective,
    draft.unitTitle,
    draft.essentialQuestion,
    draft.studentSummary,
    draft.whyItMatters,
    draft.reviewNotes,
    draft.accessibilityNotes,
    draft.ageFitNotes,
    ...(draft.vocabularyTerms || []),
    ...(draft.prerequisiteSkills || []),
    ...Object.values(draft.lessonSections || {}),
    ...(draft.helperNotes || []).flatMap((note) => [note.title, note.note]),
    ...(draft.commonMisunderstandings || []).flatMap((item) => [item.misunderstanding, item.repair, item.signal]),
    ...(draft.visualSupports || []).flatMap((item) => [item.title, item.description, item.prompt, item.altText]),
    ...(draft.quizQuestions || []).flatMap((question) => [question.questionText, question.correctAnswer, question.explanation]),
    ...(draft.sourceCards || []).flatMap((source) => [source.title, source.claim, source.reviewerNote]),
    ...(draft.redesignTasks || []).flatMap((task) => [task.title, task.change, task.why]),
    ...(draft.sourceLedger || []).flatMap((source) => [source.claim, source.troubleSignal, source.redesignMove])
  ].join(" ");
  const issues = [];

  if (!String(draft.title || "").trim()) issues.push("Draft title is missing.");
  if (!String(draft.objective || "").trim()) issues.push("Learning objective is missing.");
  if (!standards.length) issues.push("Standards tags are missing, so source grounding is weak.");
  if (audit.required && !audit.passed) issues.push(`Evidence moves are incomplete: ${audit.missing.map((move) => move.label).join(", ")}.`);
  if (!String(draft.accessibilityNotes || "").trim()) issues.push("Accessibility notes are missing.");
  if (!String(draft.ageFitNotes || "").trim()) issues.push("Age-fit notes are missing.");
  if (!completeness.passed) issues.push(`Lesson body is incomplete: ${completeness.issues.join(" ")}`);

  const usesCurrentClaim = textIncludesAny(text, ["latest", "today", "current", "recent", "news", "law", "price", "research says"]);
  const usesOverbroadClaim = textIncludesAny(text, ["always", "never", "guarantee", "proves that", "all students", "official placement"]);
  const researchDerived = Boolean(draft.sourceToolCallId || draft.sourceLessonId || draft.redesignTaskIds?.length || draft.redesignTasks?.length);
  const needsExternalResearch = usesCurrentClaim || (researchDerived && !sourceIds.length);

  if (usesCurrentClaim) issues.push("Draft includes current or external claims that need staff-side source checking.");
  if (usesOverbroadClaim) issues.push("Draft uses overbroad language that should be narrowed before publication.");
  if (researchDerived && !sourceIds.length) issues.push("Research-derived draft is missing source ids.");

  let score = 5;
  if (!standards.length) score -= 1;
  if (audit.required && !audit.passed) score -= 2;
  if (!String(draft.accessibilityNotes || "").trim() || !String(draft.ageFitNotes || "").trim()) score -= 1;
  if (!completeness.passed) score -= 1;
  if (usesCurrentClaim || usesOverbroadClaim) score -= 1;
  if (researchDerived && !sourceIds.length) score -= 1;
  score = Math.max(1, Math.min(5, score));

  const approved = draft.truthReviewStatus === "approved";
  return {
    score,
    status: approved ? "approved" : "needs-human-review",
    requiresHumanReview: !approved,
    issues,
    needsExternalResearch,
    sourceIds,
    checkedByAgentId: "truth-policy",
    summary: issues.length
      ? issues.join(" ")
      : "Draft is grounded in stored lesson metadata, standards tags, and review notes; manager approval is still required before publication."
  };
}

function normalizeContentDraft(draft) {
  const standards = Array.isArray(draft.standards) && draft.standards.length ? draft.standards : defaultStandardsForSubject(draft.subject || "ela");
  const baseDraft = {
    ...draft,
    standards
  };
  const lessonSections = normalizeTeachingSections(draft.lessonSections || draft.teachingSections || {}, baseDraft);
  const helperNotes = normalizeObjectList(draft.helperNotes, normalizeHelperNote, defaultHelperNotes(baseDraft));
  const commonMisunderstandings = normalizeObjectList(
    draft.commonMisunderstandings || draft.misconceptions,
    normalizeMisunderstanding,
    defaultCommonMisunderstandings(baseDraft)
  );
  const visualSupports = ensureMinimumVisualSupports(
    normalizeObjectList(draft.visualSupports, normalizeVisualSupport, defaultVisualSupports(baseDraft)),
    baseDraft
  );
  const quizQuestions = normalizeObjectList(draft.quizQuestions || draft.quiz, (question, index) => normalizeQuizQuestion(question, index, baseDraft), defaultQuizQuestions(baseDraft));
  const sourceCards = normalizeObjectList(draft.sourceCards, normalizeSourceCard, defaultSourceCards(baseDraft));
  const normalizedDraft = {
    ...baseDraft,
    standards,
    essentialQuestion: String(draft.essentialQuestion || defaultEssentialQuestion(baseDraft)).trim(),
    studentSummary: String(draft.studentSummary || draft.summary || defaultStudentSummary(baseDraft)).trim(),
    whyItMatters: String(draft.whyItMatters || defaultWhyItMatters(baseDraft)).trim(),
    vocabularyTerms: normalizeTextList(draft.vocabularyTerms, defaultVocabularyTerms(baseDraft.subject)),
    prerequisiteSkills: normalizeTextList(draft.prerequisiteSkills, defaultPrerequisiteSkills(baseDraft)),
    lessonSections,
    helperNotes,
    commonMisunderstandings,
    visualSupports,
    quizQuestions,
    sourceCards,
    groupHomework: normalizeGroupHomework(draft.groupHomework, baseDraft)
  };
  const completenessReview = getContentDraftCompletenessReview(normalizedDraft);
  const truthReview = getContentDraftTruthReview(normalizedDraft);
  return {
    ...normalizedDraft,
    lessonBodyReady: completenessReview.passed,
    teachingCompletenessStatus: draft.teachingCompletenessStatus || completenessReview.status,
    teachingCompletenessIssues: draft.teachingCompletenessIssues || completenessReview.issues,
    contentCompletenessReview: draft.contentCompletenessReview || completenessReview,
    truthScore: typeof draft.truthScore === "number" ? draft.truthScore : truthReview.score,
    truthIssues: draft.truthIssues || truthReview.issues,
    needsExternalResearch: typeof draft.needsExternalResearch === "boolean" ? draft.needsExternalResearch : truthReview.needsExternalResearch,
    truthReviewStatus: draft.truthReviewStatus || truthReview.status,
    contentTruthReview: draft.contentTruthReview || truthReview
  };
}

export function normalizeAppState(state = {}) {
  const merged = {
    ...createInitialState(),
    ...(state || {})
  };
  const contentDrafts = (merged.contentDrafts || []).map(normalizeContentDraft);
  const publishedFromDrafts = contentDrafts
    .filter((draft) => draft.status === "published")
    .map((draft) =>
      createPublishedLessonFromDraft(draft, {
        publishedAt: draft.publishedAt || draft.updatedAt || draft.truthReviewedAt || draft.createdAt,
        publishedBy: draft.truthReviewedBy || "manager",
        updatedAt: draft.updatedAt || draft.createdAt
      })
    );
  const publishedLessonMap = new Map();
  for (const lesson of (merged.publishedLessons || []).map(normalizePublishedLesson)) {
    publishedLessonMap.set(lesson.id, lesson);
  }
  for (const lesson of publishedFromDrafts) {
    publishedLessonMap.set(lesson.id, lesson);
  }

  return ensurePublishedPilotContent({
    ...merged,
    contentDrafts,
    publishedLessons: [...publishedLessonMap.values()],
    lessonScratchpads: merged.lessonScratchpads || {},
    interactiveResponses: merged.interactiveResponses || {},
    rewardApprovals: merged.rewardApprovals || [],
    emailVerificationRequests: merged.emailVerificationRequests || [],
    passwordResetRequests: merged.passwordResetRequests || [],
    sessionRevocations: merged.sessionRevocations || [],
    accountInvitations: merged.accountInvitations || [],
    classroomArtifacts: merged.classroomArtifacts || [],
    teacherInterventions: merged.teacherInterventions || [],
    aiLogs: (merged.aiLogs || []).map(normalizeAiLog),
    artifactReviewHistory: merged.artifactReviewHistory || []
  });
}

export function loadState() {
  if (typeof localStorage === "undefined") {
    return createInitialState();
  }

  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? normalizeAppState(JSON.parse(stored)) : createInitialState();
  } catch {
    return createInitialState();
  }
}

export function saveState(state) {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }
}

// A scoped session may keep static lesson content in the browser, but it must
// never render cached learner, household, classroom, or account records when
// the repository bootstrap is unavailable.
export function isolateStateForStrictLearnerScope(state = {}) {
  const isolated = { ...(state || {}) };
  for (const key of [
    "learners", "localAccounts", "parentProfile", "consentRecords", "placementResults",
    "learningEvents", "retentionSchedules", "masteryBenefits", "affectCheckins", "experimentRuns",
    "assignments", "schoolProfile", "classSections", "classSessions", "groupMissions",
    "lessonScratchpads", "interactiveResponses", "rewardApprovals", "quizResults", "mastery",
    "aiLogs", "toolCallLogs", "accountInvitations", "emailVerificationRequests", "passwordResetRequests",
    "sessionRevocations", "contentDrafts", "contentImportJobs", "visualGenerationJobs",
    "artifactReviewHistory", "lessonImprovementSignals"
  ]) {
    isolated[key] = Array.isArray(isolated[key]) ? [] : {};
  }
  isolated.pendingTutorPrompt = "";
  isolated.persistence = {
    ...(isolated.persistence || {}),
    source: "repository-scoped",
    lastError: "Scoped repository data is unavailable; cached learner records were withheld."
  };
  return isolated;
}

export function resetState() {
  const fresh = createInitialState();
  saveState(fresh);
  return fresh;
}

function accountSlug(value = "") {
  const slug = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 34);
  return slug || `account-${Date.now()}`;
}

function normalizeAccountEmail(email = "") {
  return String(email || "").trim().toLowerCase();
}

function normalizeAccountUsername(username = "") {
  return String(username || "")
    .trim()
    .toLowerCase()
    .replace(/^@+/, "")
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^[._-]+|[._-]+$/g, "")
    .slice(0, 32);
}

function studentEmailForUsername(username = "") {
  const normalizedUsername = normalizeAccountUsername(username);
  return normalizedUsername ? `${normalizedUsername}@student.local` : "";
}

function normalizeAccountRole(role = "") {
  return ["parent", "teacher", "student"].includes(role) ? role : "parent";
}

function defaultAcademyForGrade(grade = "3") {
  const numeric = Number(grade);
  if (Number.isFinite(numeric) && numeric >= 9) return "scholar";
  if (Number.isFinite(numeric) && numeric >= 6) return "bridge";
  return "foundation";
}

export function createSessionClaimsForAccount(account = {}) {
  const role = normalizeAccountRole(account.role);
  return {
    role,
    scope: role === "parent" ? "own-household" : role === "teacher" ? "assigned" : "own",
    userId: account.userId,
    studentId: account.studentId || "",
    guardianId: account.guardianId || "",
    teacherId: account.teacherId || "",
    schoolId: account.schoolId || "school-demo-1",
    accountId: account.id,
    displayName: account.displayName || "",
    email: account.email || "",
    emailVerified: Boolean(account.emailVerified),
    sessionId: account.sessionId || `session-${account.id || account.userId || "local"}-${Date.now()}`
  };
}

export function findLocalAccountByEmail(state = {}, email = "") {
  const normalizedEmail = normalizeAccountEmail(email);
  return (state.localAccounts || []).find((account) => account.email === normalizedEmail) || null;
}

export function findLocalAccountByLogin(state = {}, login = "") {
  const rawLogin = String(login || "").trim().toLowerCase();
  const normalizedEmail = rawLogin.includes("@") ? normalizeAccountEmail(rawLogin) : "";
  const normalizedUsername = normalizeAccountUsername(rawLogin);
  return (
    (state.localAccounts || []).find(
      (account) =>
        (normalizedEmail && account.email === normalizedEmail) ||
        (normalizedUsername && account.username === normalizedUsername) ||
        account.email === rawLogin
    ) || null
  );
}

export function registerLocalAccount(state = {}, input = {}) {
  const authProvider = String(input.authProvider || "local-preview").trim() || "local-preview";
  const providerManaged = authProvider !== "local-preview";
  const role = normalizeAccountRole(input.role);
  const requestedUsername = normalizeAccountUsername(input.username || input.childUsername || (!String(input.email || "").includes("@") ? input.email : ""));
  const emailInput = normalizeAccountEmail(input.email);
  const email = emailInput || (role === "student" && requestedUsername ? studentEmailForUsername(requestedUsername) : "");
  const username =
    role === "student"
      ? requestedUsername || normalizeAccountUsername(email.split("@")[0] || input.displayName || input.name)
      : "";
  const displayName = String(input.displayName || input.name || "").trim();
  if (role === "student" && !username && (!email || !email.includes("@"))) {
    return { state, result: { accepted: false, reason: "A child username or valid email is required." } };
  }
  if (role !== "student" && (!email || !email.includes("@"))) {
    return { state, result: { accepted: false, reason: "A valid email is required." } };
  }
  if (!displayName) {
    return { state, result: { accepted: false, reason: "Display name is required." } };
  }
  if (findLocalAccountByEmail(state, email)) {
    return { state, result: { accepted: false, reason: "An account with this email already exists." } };
  }
  if (username && (state.localAccounts || []).some((account) => account.username === username)) {
    return { state, result: { accepted: false, reason: "A child account with this username already exists." } };
  }
  if (!providerManaged && (!input.passwordHash || !input.passwordSalt)) {
    return { state, result: { accepted: false, reason: "Password hash is required." } };
  }

  const idBase = accountSlug(username || email.split("@")[0] || displayName);
  const accountId = `acct-${role}-${idBase}-${Date.now()}`;
  const grade = String(input.grade || "3");
  const academyId = input.academyId || defaultAcademyForGrade(grade);
  let learners = state.learners || [];
  let consentRecords = state.consentRecords || {};
  let parentProfile = state.parentProfile || {};
  let accountLinks = {};

  if (role === "student") {
    const studentId = input.studentId || accountSlug(displayName || username);
    const accommodations = Array.isArray(input.accommodations)
      ? input.accommodations.filter(Boolean)
      : String(input.accommodations || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
    if (!learners.some((learner) => learner.id === studentId)) {
      learners = [
        ...learners,
        {
          id: studentId,
          name: displayName,
          grade,
          academyId,
          schedule: academyId === "foundation" ? "45 min/day" : academyId === "bridge" ? "60 min/day" : "90 min/day",
          accommodations
        }
      ];
    }
    const parentManaged = Boolean(input.createdByParent || input.managedByGuardianId || input.guardianId);
    consentRecords = {
      ...consentRecords,
      [studentId]: consentRecords[studentId] || {
        dataCollection: true,
        aiHelper: parentManaged ? Boolean(input.aiHelper ?? true) : false,
        portfolio: true,
        thirdPartySharing: false,
        consentedBy: input.consentedBy || (parentManaged ? "Parent managed account" : "Pending parent setup"),
        lastUpdated: new Date().toISOString().slice(0, 10)
      }
    };
    accountLinks = { studentId, ...(input.guardianId || input.managedByGuardianId ? { guardianId: input.guardianId || input.managedByGuardianId } : {}) };
  } else if (role === "parent") {
    const guardianId = `guardian-${idBase}`;
    parentProfile = {
      ...parentProfile,
      id: parentProfile.id || guardianId,
      name: displayName,
      email,
      emailVerified: Boolean(input.emailVerified)
    };
    accountLinks = { guardianId, ...(input.studentId ? { studentId: input.studentId } : {}) };
  } else {
    accountLinks = {
      teacherId: `teacher-${idBase}`,
      ...(input.studentId ? { studentId: input.studentId } : {})
    };
  }

  const account = {
    id: accountId,
    userId: input.userId || `user-${accountId}`,
    role,
    displayName,
    email,
    ...(username ? { username } : {}),
    status: role === "student" || input.emailVerified ? "active" : "pending-email-verification",
    emailVerified: role === "student" ? true : Boolean(input.emailVerified),
    ...(input.passwordHash ? { passwordHash: input.passwordHash } : {}),
    ...(input.passwordSalt ? { passwordSalt: input.passwordSalt } : {}),
    ...(input.passwordAlgorithm ? { passwordAlgorithm: input.passwordAlgorithm } : {}),
    authProvider,
    ...(input.providerSubject ? { providerSubject: input.providerSubject } : {}),
    grade,
    academyId,
    gradeLevelId: `${academyId}-${grade.toLowerCase()}`,
    schoolId: input.schoolId || (providerManaged ? "" : "school-demo-1"),
    createdAt: new Date().toISOString(),
    ...accountLinks
  };
  const nextState = {
    ...state,
    learners,
    consentRecords,
    parentProfile,
    localAccounts: [account, ...(state.localAccounts || [])]
  };
  return {
    state: nextState,
    result: {
      accepted: true,
      account: {
        id: account.id,
        userId: account.userId,
        role: account.role,
        displayName: account.displayName,
        email: account.email,
        username: account.username || "",
        authProvider: account.authProvider || "",
        providerSubject: account.providerSubject || "",
        grade: account.grade || "",
        academyId: account.academyId || "",
        status: account.status || "active",
        emailVerified: Boolean(account.emailVerified),
        studentId: account.studentId || "",
        guardianId: account.guardianId || "",
        teacherId: account.teacherId || "",
        schoolId: account.schoolId
      },
      sessionClaims: createSessionClaimsForAccount(account)
    }
  };
}

export function registerProviderAccount(state = {}, input = {}) {
  const providerUser = input.providerUser || {};
  const providerSubject = String(providerUser.id || input.providerSubject || "").trim();
  const email = normalizeAccountEmail(providerUser.email || input.email);
  const role = normalizeAccountRole(input.role || "parent");
  const displayName = String(input.displayName || providerUser.user_metadata?.display_name || email.split("@")[0] || "").trim();
  const emailVerified = Boolean(providerUser.emailVerified ?? providerUser.email_confirmed_at ?? input.emailVerified);

  if (!providerSubject) return { state, result: { accepted: false, reason: "Provider user id is required." } };
  if (!email || !email.includes("@")) return { state, result: { accepted: false, reason: "Provider user email is required." } };
  if (!displayName) return { state, result: { accepted: false, reason: "Display name is required." } };
  if (!roleIdsForProvider().includes(role)) {
    return { state, result: { accepted: false, reason: "Provider signup only supports approved adult roles." } };
  }

  const duplicate = (state.localAccounts || []).find(
    (account) => account.providerSubject === providerSubject || account.userId === providerSubject || account.email === email
  );
  if (duplicate) {
    return {
      state,
      result: {
        accepted: true,
        alreadyProvisioned: true,
        account: publicAccount(duplicate),
        sessionClaims: createSessionClaimsForAccount(duplicate)
      }
    };
  }

  const idBase = accountSlug(providerSubject);
  const accountId = `acct-${role}-${idBase}`;
  const account = {
    id: accountId,
    userId: providerSubject,
    role,
    displayName,
    email,
    status: emailVerified ? "active" : "pending-email-verification",
    emailVerified,
    authProvider: String(input.authProvider || "supabase"),
    providerSubject,
    schoolId: input.schoolId || "",
    createdAt: input.createdAt || new Date().toISOString()
  };

  let parentProfile = state.parentProfile || {};
  let accountLinks = {};
  if (role === "parent") {
    const guardianId = input.guardianId || `guardian-${idBase}`;
    parentProfile = {
      ...parentProfile,
      ...(parentProfile.id && parentProfile.id !== "guardian-parent-1" ? {} : { id: guardianId }),
      name: displayName,
      email,
      emailVerified
    };
    accountLinks = { guardianId };
  } else {
    accountLinks = { teacherId: input.teacherId || `teacher-${idBase}` };
  }

  const nextAccount = { ...account, ...accountLinks };
  const nextState = {
    ...state,
    parentProfile,
    localAccounts: [nextAccount, ...(state.localAccounts || [])]
  };
  return {
    state: nextState,
    result: {
      accepted: true,
      alreadyProvisioned: false,
      account: publicAccount(nextAccount),
      sessionClaims: createSessionClaimsForAccount(nextAccount)
    }
  };
}

function roleIdsForProvider() {
  return ["parent", "teacher"];
}

export function createParentManagedChildAccount(state = {}, input = {}) {
  const parentSession = input.parentSession || {};
  const allowedRoles = ["parent", "school-admin", "platform-admin"];
  if (!parentSession.authenticated || !allowedRoles.includes(parentSession.role)) {
    return { state, result: { accepted: false, reason: "A parent or admin session is required to create a child account." } };
  }
  if (parentSession.role === "parent" && !parentSession.emailVerified) {
    return { state, result: { accepted: false, reason: "Parent email verification is required before creating child accounts." } };
  }

  const username = normalizeAccountUsername(input.username || input.childUsername);
  if (!username) {
    return { state, result: { accepted: false, reason: "Child username is required." } };
  }

  const displayName = String(input.displayName || input.childName || "").trim();
  if (!displayName) {
    return { state, result: { accepted: false, reason: "Child display name is required." } };
  }

  const guardianId = parentSession.guardianId || input.guardianId || state.parentProfile?.id || "guardian-parent-1";
  const studentId = input.studentId || `learner-${username}`;
  const grade = String(input.grade || "3");
  const registered = registerLocalAccount(state, {
    role: "student",
    displayName,
    username,
    email: input.email || studentEmailForUsername(username),
    grade,
    academyId: input.academyId || defaultAcademyForGrade(grade),
    studentId,
    guardianId,
    managedByGuardianId: guardianId,
    createdByParent: true,
    consentedBy: parentSession.displayName || state.parentProfile?.name || "Parent account",
    accommodations: input.accommodations,
    aiHelper: input.aiHelper,
    passwordHash: input.passwordHash,
    passwordSalt: input.passwordSalt,
    passwordAlgorithm: input.passwordAlgorithm,
    authProvider: input.authProvider,
    providerSubject: input.providerSubject,
    userId: input.userId,
    emailVerified: input.emailVerified
  });

  if (!registered.result.accepted) {
    return registered;
  }

  return {
    state: registered.state,
    result: {
      ...registered.result,
      childLogin: {
        username,
        studentId,
        displayName,
        grade,
        academyId: input.academyId || defaultAcademyForGrade(grade)
      }
    }
  };
}

export function canParentAccessLearner(state = {}, session = {}, learnerId = "") {
  const normalizedLearnerId = String(learnerId || "").trim();
  if (!normalizedLearnerId) return false;
  if (["school-admin", "platform-admin"].includes(session.role)) return true;
  if (session.role !== "parent" || !session.guardianId) return false;
  return (state.localAccounts || []).some(
    (account) => account.role === "student" && account.studentId === normalizedLearnerId && account.guardianId === session.guardianId
  );
}

function publicAccount(account = {}) {
  return {
    id: account.id || "",
    userId: account.userId || "",
    role: account.role || "",
    displayName: account.displayName || "",
    username: account.username || "",
    email: account.email || "",
    authProvider: account.authProvider || "",
    providerSubject: account.providerSubject || "",
    status: account.status || "active",
    emailVerified: Boolean(account.emailVerified),
    studentId: account.studentId || "",
    guardianId: account.guardianId || "",
    teacherId: account.teacherId || "",
    lastSignedInAt: account.lastSignedInAt || "",
    createdAt: account.createdAt || ""
  };
}

function requestExpired(request = {}) {
  return request.expiresAt ? Date.parse(request.expiresAt) <= Date.now() : false;
}

function futureIso(minutes = 30) {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

function findLocalAccountById(state = {}, accountId = "") {
  return (state.localAccounts || []).find((account) => account.id === accountId) || null;
}

function findLocalAccountByUserId(state = {}, userId = "") {
  return (state.localAccounts || []).find((account) => account.userId === userId) || null;
}

export function getAuthSecuritySummary(state = {}) {
  const accounts = (state.localAccounts || []).map(publicAccount);
  const pendingEmailVerification = (state.emailVerificationRequests || []).filter((request) => request.status === "pending" && !requestExpired(request));
  const pendingPasswordReset = (state.passwordResetRequests || []).filter((request) => request.status === "pending" && !requestExpired(request));
  return {
    accountCount: accounts.length,
    verifiedAccounts: accounts.filter((account) => account.emailVerified).length,
    pendingVerificationAccounts: accounts.filter((account) => account.email && !account.emailVerified).length,
    pendingEmailVerification: pendingEmailVerification.length,
    pendingPasswordReset: pendingPasswordReset.length,
    revokedSessions: (state.sessionRevocations || []).length,
    accounts
  };
}

export function createEmailVerificationRequest(state = {}, input = {}) {
  const account =
    findLocalAccountById(state, input.accountId) ||
    findLocalAccountByLogin(state, input.login || input.email || input.username || "") ||
    findLocalAccountByUserId(state, input.userId || "");

  if (!account || !account.email) {
    return {
      state,
      result: {
        accepted: false,
        reason: "A matching account with an email address is required."
      }
    };
  }

  if (account.emailVerified) {
    return {
      state,
      result: {
        accepted: true,
        alreadyVerified: true,
        account: publicAccount(account),
        summary: `${account.displayName} is already email verified.`
      }
    };
  }

  const request = {
    id: `email-verify-${account.id}-${Date.now()}`,
    accountId: account.id,
    userId: account.userId,
    email: account.email,
    purpose: "email_verification",
    tokenHash: input.tokenHash || "",
    tokenSalt: input.tokenSalt || "",
    tokenAlgorithm: input.tokenAlgorithm || "hmac-sha256",
    tokenPreview: input.tokenPreview || "",
    status: "pending",
    requestedByUserId: input.requestedByUserId || account.userId,
    createdAt: new Date().toISOString(),
    expiresAt: input.expiresAt || futureIso(60)
  };

  return {
    state: {
      ...state,
      emailVerificationRequests: [request, ...(state.emailVerificationRequests || [])].slice(0, 80)
    },
    result: {
      accepted: true,
      request: {
        id: request.id,
        accountId: request.accountId,
        email: request.email,
        tokenPreview: request.tokenPreview,
        expiresAt: request.expiresAt,
        status: request.status
      },
      summary: `Verification requested for ${account.email}.`
    }
  };
}

export function verifyLocalAccountEmail(state = {}, input = {}) {
  const tokenHash = String(input.tokenHash || "");
  const request = (state.emailVerificationRequests || []).find(
    (item) => item.tokenHash === tokenHash && item.status === "pending" && !requestExpired(item)
  );

  if (!request) {
    return {
      state,
      result: {
        accepted: false,
        reason: "Verification code is invalid, expired, or already used."
      }
    };
  }

  const account = findLocalAccountById(state, request.accountId);
  if (!account) {
    return {
      state,
      result: {
        accepted: false,
        reason: "Verification account was not found."
      }
    };
  }

  const verifiedAt = new Date().toISOString();
  const nextAccounts = (state.localAccounts || []).map((item) =>
    item.id === account.id
      ? {
          ...item,
          emailVerified: true,
          status: "active",
          verifiedAt,
          updatedAt: verifiedAt
        }
      : item
  );
  const nextParentProfile =
    account.role === "parent"
      ? {
          ...(state.parentProfile || {}),
          emailVerified: true,
          email: account.email,
          name: account.displayName || state.parentProfile?.name || "Parent"
        }
      : state.parentProfile;

  return {
    state: {
      ...state,
      parentProfile: nextParentProfile,
      localAccounts: nextAccounts,
      emailVerificationRequests: (state.emailVerificationRequests || []).map((item) =>
        item.id === request.id ? { ...item, status: "used", usedAt: verifiedAt } : item
      )
    },
    result: {
      accepted: true,
      account: publicAccount({ ...account, emailVerified: true, status: "active" }),
      summary: `${account.email} is now verified.`
    }
  };
}

export function createPasswordResetRequest(state = {}, input = {}) {
  const account = findLocalAccountByLogin(state, input.login || input.email || input.username || "");
  if (!account) {
    return {
      state,
      result: {
        accepted: true,
        accountFound: false,
        summary: "If an account exists, a reset flow has been started."
      }
    };
  }

  const request = {
    id: `password-reset-${account.id}-${Date.now()}`,
    accountId: account.id,
    userId: account.userId,
    email: account.email,
    purpose: "password_reset",
    tokenHash: input.tokenHash || "",
    tokenSalt: input.tokenSalt || "",
    tokenAlgorithm: input.tokenAlgorithm || "hmac-sha256",
    tokenPreview: input.tokenPreview || "",
    status: "pending",
    requestedByUserId: input.requestedByUserId || account.userId,
    createdAt: new Date().toISOString(),
    expiresAt: input.expiresAt || futureIso(30)
  };

  return {
    state: {
      ...state,
      passwordResetRequests: [request, ...(state.passwordResetRequests || [])].slice(0, 80)
    },
    result: {
      accepted: true,
      accountFound: true,
      request: {
        id: request.id,
        accountId: request.accountId,
        tokenPreview: request.tokenPreview,
        expiresAt: request.expiresAt,
        status: request.status
      },
      summary: "Password reset request created."
    }
  };
}

export function resetLocalAccountPassword(state = {}, input = {}) {
  const tokenHash = String(input.tokenHash || "");
  const request = (state.passwordResetRequests || []).find(
    (item) => item.tokenHash === tokenHash && item.status === "pending" && !requestExpired(item)
  );

  if (!request) {
    return {
      state,
      result: {
        accepted: false,
        reason: "Reset code is invalid, expired, or already used."
      }
    };
  }

  const account = findLocalAccountById(state, request.accountId);
  if (!account) {
    return {
      state,
      result: {
        accepted: false,
        reason: "Reset account was not found."
      }
    };
  }

  if (!input.passwordHash || !input.passwordSalt) {
    return {
      state,
      result: {
        accepted: false,
        reason: "A new password hash is required."
      }
    };
  }

  const changedAt = new Date().toISOString();
  const nextState = {
    ...state,
    localAccounts: (state.localAccounts || []).map((item) =>
      item.id === account.id
        ? {
            ...item,
            passwordHash: input.passwordHash,
            passwordSalt: input.passwordSalt,
            passwordAlgorithm: input.passwordAlgorithm || "scrypt-sha256",
            passwordChangedAt: changedAt,
            updatedAt: changedAt
          }
        : item
    ),
    passwordResetRequests: (state.passwordResetRequests || []).map((item) =>
      item.id === request.id ? { ...item, status: "used", usedAt: changedAt } : item
    )
  };

  const revoked = revokeAccountSession(nextState, {
    userId: account.userId,
    revokeAll: true,
    reason: "password reset",
    actorUserId: account.userId
  });

  return {
    state: revoked.state,
    result: {
      accepted: true,
      account: publicAccount(account),
      summary: "Password was reset and existing sessions were revoked."
    }
  };
}

export function revokeAccountSession(state = {}, input = {}) {
  const userId = String(input.userId || "").trim();
  if (!userId) {
    return {
      state,
      result: {
        accepted: false,
        reason: "A user id is required to revoke sessions."
      }
    };
  }

  const createdAt = new Date().toISOString();
  const sessionId = input.revokeAll ? "" : String(input.sessionId || "").trim();
  const revocation = {
    id: `session-revocation-${userId}-${sessionId || "all"}-${Date.now()}`.replace(/[^a-z0-9_-]/gi, "-"),
    userId,
    sessionId,
    revokedBefore: input.revokeAll ? createdAt : "",
    reason: input.reason || (input.revokeAll ? "all sessions revoked" : "session revoked"),
    actorUserId: input.actorUserId || userId,
    createdAt
  };

  return {
    state: {
      ...state,
      sessionRevocations: [revocation, ...(state.sessionRevocations || [])].slice(0, 120)
    },
    result: {
      accepted: true,
      revocation,
      summary: input.revokeAll ? "All existing sessions were revoked." : "The selected session was revoked."
    }
  };
}

export function isSessionRevoked(state = {}, session = {}) {
  if (!session?.authenticated || session.devFallback || !session.userId) return false;
  const issuedAt = Date.parse(session.issuedAt || session.iat || 0);
  return (state.sessionRevocations || []).some((revocation) => {
    if (revocation.userId !== session.userId) return false;
    if (revocation.sessionId && session.sessionId) return revocation.sessionId === session.sessionId;
    if (!revocation.sessionId && revocation.revokedBefore && Number.isFinite(issuedAt)) {
      return issuedAt <= Date.parse(revocation.revokedBefore);
    }
    return false;
  });
}

export function findAcademy(academyId) {
  return curriculum.academies.find((academy) => academy.id === academyId) || curriculum.academies[0];
}

export function findLesson(lessonId) {
  return pilotLessons.find((lesson) => lesson.id === lessonId) || pilotLessons[0];
}

export function getLessonCatalog(state = {}) {
  const published = (state.publishedLessons || []).map(normalizePublishedLesson);
  const publishedIds = new Set(published.map((lesson) => lesson.id));
  return [
    ...pilotLessons.filter((lesson) => !publishedIds.has(lesson.id)).map((lesson) => ({ ...lesson, catalogSource: "pilot" })),
    ...published.map((lesson) => ({ ...lesson, catalogSource: "published" }))
  ];
}

export function findLessonInState(state = {}, lessonId) {
  return getLessonCatalog(state).find((lesson) => lesson.id === lessonId) || findLesson(lessonId);
}

function repositoryActivityBuckets(activities = []) {
  const sections = {};
  const funTasks = [];
  let groupHomework = null;
  const visualSupports = [];
  const sourceCards = [];

  for (const activity of activities) {
    const body = String(activity.body || "").trim();
    if (!body && !activity.title) continue;
    const type = String(activity.type || "").trim();
    if (type === "fun_task") {
      funTasks.push(body || activity.title);
    } else if (type === "group_homework") {
      groupHomework = {
        title: activity.title || "Group mission",
        sharedOutcome: body || "Create and submit one shared explanation.",
        groupSize: "Small team",
        roles: ["Builder", "Explainer", "Checker"],
        parentRole: "Share the finished artifact and reflection."
      };
    } else if (type === "visual_support") {
      visualSupports.push({
        id: activity.id,
        title: activity.title || "Visual support",
        description: body,
        prompt: body
      });
    } else if (type === "source_card") {
      sourceCards.push({ id: activity.id, title: activity.title || "Source card", claim: body });
    } else if (type === "warm_up") {
      sections.warmup = body;
    } else if (type === "direct_instruction") {
      sections.teach = body;
    } else if (type === "guided_practice") {
      sections.guidedPractice = body;
    } else if (type === "interactive_activity") {
      sections.activity = body;
    } else if (type === "independent_practice") {
      sections.independentPractice = body;
    } else if (type === "reteach") {
      sections.reteach = body;
    } else if (type === "challenge") {
      sections.challenge = body;
    }
  }

  return { sections, funTasks, groupHomework, visualSupports, sourceCards };
}

export function repositoryCatalogLessonToAppLesson(catalogLesson = {}) {
  const buckets = repositoryActivityBuckets(catalogLesson.activities);
  const questions = (catalogLesson.quiz?.questions || []).map((question) => {
    const answerIndex = question.choices.indexOf(question.correctAnswer);
    return {
      id: question.id,
      prompt: question.prompt,
      choices: question.choices,
      answerIndex: answerIndex >= 0 ? answerIndex : 0,
      explanation: question.explanation,
      questionType: question.questionType,
      difficultyLevel: question.difficultyLevel,
      skillTag: question.skillTag,
      standardTag: question.standardTag
    };
  });

  return {
    id: catalogLesson.id,
    title: catalogLesson.title,
    academyId: catalogLesson.gradeBandId,
    grade: String(catalogLesson.gradeLevelId || "").split("-").pop() || "",
    subject: catalogLesson.subjectId,
    estimatedMinutes: Number(catalogLesson.estimatedMinutes || 25),
    objective: catalogLesson.learningObjective || "",
    essentialQuestion: catalogLesson.essentialQuestion || "",
    masteryThreshold: Number(catalogLesson.masteryThreshold || 80),
    standards: catalogLesson.standards || [],
    sections: buckets.sections,
    funTasks: buckets.funTasks,
    groupHomework: buckets.groupHomework,
    visualSupports: buckets.visualSupports,
    sourceCards: buckets.sourceCards,
    quiz: questions,
    catalogSource: catalogLesson.catalogSource || "normalized",
    repositoryCatalog: true
  };
}

export function mergeRepositoryLearningCatalog(state = {}, catalog = {}) {
  const repositoryLessons = (catalog.lessons || [])
    .filter((lesson) => lesson && lesson.id)
    .map(repositoryCatalogLessonToAppLesson);
  if (!repositoryLessons.length) return state;

  const pilotIds = new Set(pilotLessons.map((lesson) => lesson.id));
  const existing = new Map((state.publishedLessons || []).map((lesson) => [lesson.id, lesson]));
  for (const lesson of repositoryLessons) {
    if (pilotIds.has(lesson.id)) continue;
    existing.set(lesson.id, { ...existing.get(lesson.id), ...lesson });
  }

  return {
    ...state,
    publishedLessons: [...existing.values()],
    persistence: {
      ...(state.persistence || {}),
      source: "scoped-repository",
      lastError: null
    }
  };
}

export function mergeRepositoryLearningEvents(state = {}, readModel = {}) {
  const incoming = (readModel.events || []).filter((event) => event?.learnerId && event?.id);
  if (!incoming.length) return state;
  const learnerId = readModel.learnerId && readModel.learnerId !== "all" ? readModel.learnerId : incoming[0].learnerId;
  const existing = (state.learningEvents || []).filter((event) => event.learnerId !== learnerId);
  const normalized = incoming.map((event) => ({
    id: event.id,
    learnerId: event.learnerId,
    lessonId: event.lessonId || "",
    type: event.type || "",
    value: event.value || {},
    occurredAt: event.occurredAt || ""
  }));
  return {
    ...state,
    learningEvents: [...normalized, ...existing].slice(0, 200),
    persistence: {
      ...(state.persistence || {}),
      source: "scoped-repository",
      lastError: null
    }
  };
}

export function mergeRepositoryLearnerProfiles(state = {}, profileReadModel = {}) {
  const profiles = (profileReadModel.learners || []).filter((learner) => learner && learner.id);
  if (!profiles.length) return state;
  const incomingIds = new Set(profiles.map((learner) => learner.id));
  const existing = (state.learners || []).filter((learner) => !incomingIds.has(learner.id));
  return {
    ...state,
    learners: [...existing, ...profiles.map((learner) => ({ ...learner, repositoryProfile: true }))],
    persistence: {
      ...(state.persistence || {}),
      source: "scoped-repository",
      lastError: null
    }
  };
}

function scopedLearners(state = {}, learnerIds = [], options = {}) {
  const allowed = new Set((learnerIds || []).filter(Boolean));
  if (!allowed.size) return options.strictLearnerScope ? [] : state.learners || [];
  return (state.learners || []).filter((learner) => allowed.has(learner.id));
}

function lessonMatchesLearner(lesson = {}, learner = {}) {
  return lesson.academyId === learner.academyId || String(lesson.grade) === String(learner.grade);
}

export function getTodayPlan(state, options = {}) {
  const learners = scopedLearners(state, options.learnerIds, options);
  const lessonScope =
    options.strictLearnerScope && !learners.length
      ? []
      : options.learnerIds?.length && learners.length
      ? getLessonCatalog(state).filter((lesson) => learners.some((learner) => lessonMatchesLearner(lesson, learner)))
      : getLessonCatalog(state);

  return lessonScope.map((lesson, index) => {
    const mastery = state.mastery[lesson.id] || { score: 0, status: "Not started", attempts: 0 };
    const action = mastery.score >= lesson.masteryThreshold ? "Challenge" : mastery.score > 0 ? "Reteach" : "Start";
    return {
      ...lesson,
      order: index + 1,
      action,
      mastery
    };
  });
}

function getDefaultClassSection(state = {}, learnerId = "", classSectionId = "", options = {}) {
  const sections = state.classSections || [];
  const allowFallback = options.allowFallback !== false;
  return (
    sections.find((section) => classSectionId && section.id === classSectionId) ||
    sections.find((section) => learnerId && (section.studentIds || []).includes(learnerId)) ||
    (allowFallback ? sections[0] : null) ||
    null
  );
}

function getClassSessionForSection(state = {}, classSection = {}) {
  const sessions = state.classSessions || [];
  return (
    sessions.find((session) => session.id === classSection?.currentSessionId) ||
    sessions.find((session) => session.classSectionId === classSection?.id) ||
    null
  );
}

function getMissionForSession(state = {}, session = {}) {
  return (state.groupMissions || []).find((mission) => mission.sessionId === session?.id) || null;
}

function findClassroomArtifact(state = {}, missionId = "", learnerId = "") {
  return (
    (state.classroomArtifacts || []).find(
      (artifact) => artifact.missionId === missionId && artifact.learnerId === learnerId
    ) || null
  );
}

function findOpenTeacherIntervention(state = {}, sessionId = "", learnerId = "") {
  return (
    (state.teacherInterventions || []).find(
      (intervention) =>
        intervention.classSessionId === sessionId &&
        intervention.learnerId === learnerId &&
        intervention.status !== "resolved"
    ) || null
  );
}

function createTeacherInterventionImprovementSignal(intervention = {}, outcome = "", note = "") {
  const lesson = findLesson(intervention.lessonId || pilotLessons[0].id);
  const normalizedOutcome = String(outcome || "needs-redesign");
  return {
    id: `improve-intervention-${intervention.id}-${normalizedOutcome}`.replace(/[^a-z0-9_-]/gi, "-"),
    lessonId: intervention.lessonId || lesson.id,
    learnerId: intervention.learnerId || intervention.studentId || "",
    lessonTitle: lesson.title,
    ownerAgentId: "fun-retention",
    title: `Teacher support did not resolve: ${lesson.title}`,
    why: `${intervention.summary || "Targeted teacher support"} was marked ${normalizedOutcome.replace("-", " ")}.`,
    change:
      intervention.adaptiveReteach?.reteachMove ||
      "Redesign the lesson reteach path, tutor hint, or visual model because targeted teacher support did not resolve the learner's stuck point.",
    sourceIds: ["teacher-intervention-outcome", intervention.id],
    status: "needs-redesign",
    feedback: normalizedOutcome,
    modeId: "teacher-intervention",
    confusionType: intervention.adaptiveReteach?.diagnosisLabel || "",
    note: String(note || "").slice(0, 300),
    createdAt: new Date().toLocaleString()
  };
}

function getLearnerClassStatus(state = {}, learner = {}, session = {}, lesson = {}) {
  const scratchpad = getLessonScratchpad(state, learner.id, lesson.id);
  const mastery = state.mastery?.[lesson.id] || { score: 0, status: "Not started", attempts: 0 };
  const result = state.quizResults?.[lesson.id];
  const subjectProgress = getLearnerSubjectProgress(state, learner.id).find((subject) => subject.subject === lesson.subject);
  const mission = getMissionForSession(state, session);
  const artifact = mission ? findClassroomArtifact(state, mission.id, learner.id) : null;
  const intervention = findOpenTeacherIntervention(state, session?.id || "", learner.id);
  const adaptiveReteach = getAdaptiveReteachRecommendation(state, learner.id, lesson.id);
  const hasConfusion = Boolean(String(scratchpad.confusion || "").trim());
  const status = intervention
    ? "Teacher support"
    : hasConfusion
    ? "Needs help"
    : Number(mastery.score || 0) >= Number(lesson.masteryThreshold || 80)
      ? "Mastered"
      : artifact?.artifactStatus === "submitted"
        ? "Evidence submitted"
      : result
        ? "Reteach"
        : "In progress";

  return {
    learner,
    sessionId: session?.id || "",
    lessonId: lesson.id,
    status,
    mastery,
    subjectProgress,
    currentStep: hasConfusion ? "Stuck point" : result ? "Exit ticket" : "Visual lesson",
    tutorSignal: hasConfusion ? "Student wrote a stuck point." : "No tutor flag yet.",
    confusion: scratchpad.confusion || "",
    adaptiveReteach,
    artifact,
    intervention,
    levelProfile: getLearnerLevelProfile(state, learner.id)
  };
}

export function getLearnerClassSession(state = {}, learnerId = "") {
  const learner = getLearnerById(state, learnerId);
  if (!learner) return null;
  const classSection = getDefaultClassSection(state, learner.id, "", { allowFallback: false });
  if (!classSection) return null;
  const session = getClassSessionForSection(state, classSection);
  if (!session) return null;
  const lesson = findLessonInState(state, session.lessonId);
  const mission = getMissionForSession(state, session);
  const classmates = (classSection.studentIds || [])
    .map((studentId) => getLearnerById(state, studentId))
    .filter(Boolean);

  return {
    learner,
    classSection,
    session,
    lesson,
    mission,
    classmates,
    learnerStatus: getLearnerClassStatus(state, learner, session, lesson),
    school: state.schoolProfile || null
  };
}

export function getTeacherClassMonitor(state = {}, classSectionId = "", options = {}) {
  const classSection = getDefaultClassSection(state, "", classSectionId, options);
  if (!classSection) {
    return {
      school: state.schoolProfile || null,
      classSection: null,
      session: null,
      lesson: null,
      mission: null,
      learners: [],
      metrics: { enrolled: 0, ready: 0, inProgress: 0, needsHelp: 0, mastered: 0, averageMastery: 0 },
      confusionHeatmap: [],
      adminReadiness: []
    };
  }

  const session = getClassSessionForSection(state, classSection);
  const lesson = findLessonInState(state, session?.lessonId);
  const learners = (classSection.studentIds || [])
    .map((studentId) => getLearnerById(state, studentId))
    .filter(Boolean)
    .map((learner) => {
      const status = getLearnerClassStatus(state, learner, session, lesson);
      return {
        ...status,
        interactiveSkillEvidence: getLearnerInteractiveSkillEvidence(state, learner.id, { lessonId: lesson?.id }).signals.slice(0, 3)
      };
    });
  const needsHelp = learners.filter((item) => item.status === "Needs help").length;
  const teacherSupport = learners.filter((item) => item.status === "Teacher support").length;
  const submittedArtifacts = learners.filter((item) => item.artifact?.artifactStatus === "submitted").length;
  const mastered = learners.filter((item) => item.status === "Mastered").length;
  const averageMastery = learners.length
    ? Math.round(learners.reduce((sum, item) => sum + Number(item.mastery.score || 0), 0) / learners.length)
    : 0;
  const confusionTypes = [
    { label: "Visual model", count: learners.filter((item) => /picture|diagram|map|visual|model/i.test(item.confusion)).length },
    { label: "First step", count: learners.filter((item) => /start|first|begin|step/i.test(item.confusion)).length },
    { label: "Evidence link", count: learners.filter((item) => /why|because|evidence|reason/i.test(item.confusion)).length },
    { label: "Needs teacher", count: needsHelp }
  ];

  return {
    school: state.schoolProfile || null,
    classSection,
    session,
    lesson,
    mission: getMissionForSession(state, session),
    learners,
    metrics: {
      enrolled: learners.length,
      ready: learners.filter((item) => item.status === "In progress").length,
      inProgress: learners.filter((item) => ["In progress", "Reteach", "Evidence submitted"].includes(item.status)).length,
      needsHelp,
      teacherSupport,
      submittedArtifacts,
      mastered,
      averageMastery
    },
    confusionHeatmap: confusionTypes,
    adminReadiness: [
      { label: "Roster", status: learners.length ? "Ready" : "Needs students" },
      { label: "Class session", status: session ? session.status || "Ready" : "Needs launch plan" },
      { label: "Group mission", status: getMissionForSession(state, session) ? "Ready" : "Needs mission" },
      { label: "Teacher scope", status: classSection.teacherId ? "Ready" : "Needs assignment" }
    ]
  };
}

export function refreshSchoolReports(state = {}, { schoolId = "" } = {}) {
  const sections = (state.classSections || []).filter((section) => !schoolId || section.schoolId === schoolId);
  const previousReports = new Map((state.schoolReports || []).map((report) => [report.classId, report]));
  const reports = sections.map((section) => {
    const monitor = getTeacherClassMonitor(state, section.id);
    const metrics = monitor.metrics || {};
    const sessionIds = new Set((state.classSessions || []).filter((session) => session.classSectionId === section.id).map((session) => session.id));
    const groupMissions = (state.groupMissions || []).filter((mission) => sessionIds.has(mission.sessionId)).length;
    const openInterventions = (state.teacherInterventions || []).filter(
      (intervention) => sessionIds.has(intervention.classSessionId) && intervention.status !== "resolved"
    ).length;
    const previous = previousReports.get(section.id);
    return {
      id: previous?.id || `school-report-${section.id}`.replace(/[^a-z0-9_-]/gi, "-"),
      schoolId: section.schoolId || schoolId || state.schoolProfile?.id || "",
      classId: section.id,
      reportType: "classroom-progress-snapshot",
      summary: `${section.name || "Class"} has ${metrics.enrolled || 0} enrolled learner(s), ${metrics.averageMastery || 0}% average mastery, and ${metrics.needsHelp || 0} learner(s) needing support.`,
      metrics: {
        enrolledStudents: metrics.enrolled || 0,
        averageMastery: metrics.averageMastery || 0,
        activeSessions: (state.classSessions || []).filter((session) => session.classSectionId === section.id).length,
        groupMissions,
        submittedArtifacts: metrics.submittedArtifacts || 0,
        openInterventions,
        needsHelp: metrics.needsHelp || 0,
        mastered: metrics.mastered || 0
      },
      createdAt: previous?.createdAt || new Date().toISOString()
    };
  });
  return { ...state, schoolReports: reports };
}

const classSessionStatuses = new Set(["Ready to launch", "Live", "Paused", "Completed"]);

function normalizeClassSessionStatus(status = "") {
  const value = String(status || "").trim();
  return classSessionStatuses.has(value) ? value : "Ready to launch";
}

function findClassSessionById(state = {}, classSessionId = "") {
  return (state.classSessions || []).find((session) => session.id === classSessionId) || null;
}

function findClassSectionById(state = {}, classSectionId = "") {
  return (state.classSections || []).find((section) => section.id === classSectionId) || null;
}

function findClassSectionForSession(state = {}, session = {}) {
  return findClassSectionById(state, session?.classSectionId || "");
}

export function updateClassSessionStatus(state = {}, input = {}) {
  const classSessionId = String(input.classSessionId || input.sessionId || "").trim();
  const session = findClassSessionById(state, classSessionId);
  if (!session) {
    return {
      state,
      result: {
        accepted: false,
        reason: "Class session was not found."
      }
    };
  }

  const nextStatus = normalizeClassSessionStatus(input.status || session.status);
  const now = new Date().toISOString();
  const stepId = String(input.stepId || "").trim();
  const stepStatus = String(input.stepStatus || "").trim();
  const nextSessions = (state.classSessions || []).map((item) => {
    if (item.id !== session.id) return item;
    const nextSteps = stepId
      ? (item.steps || []).map((step) => (step.id === stepId ? { ...step, status: stepStatus || step.status || "ready" } : step))
      : item.steps || [];
    return {
      ...item,
      status: nextStatus,
      steps: nextSteps,
      startedAt: nextStatus === "Live" && !item.startedAt ? now : item.startedAt || "",
      endedAt: nextStatus === "Completed" ? now : item.endedAt || "",
      updatedAt: now
    };
  });
  const nextSession = nextSessions.find((item) => item.id === session.id);

  return {
    state: {
      ...state,
      classSessions: nextSessions
    },
    result: {
      accepted: true,
      session: nextSession,
      summary: `${nextSession.title || "Class session"} is now ${nextSession.status}.`
    }
  };
}

export function updateGroupMission(state = {}, input = {}) {
  const missionId = String(input.missionId || input.groupMissionId || "").trim();
  const mission = (state.groupMissions || []).find((item) => item.id === missionId);
  if (!mission) {
    return { state, result: { accepted: false, reason: "Group mission was not found." } };
  }

  const session = findClassSessionById(state, mission.sessionId);
  const classSection = session ? findClassSectionForSession(state, session) : null;
  if (!session || !classSection) {
    return { state, result: { accepted: false, reason: "The group mission is not linked to a class session." } };
  }

  const title = String(input.title ?? mission.title ?? "").trim();
  const sharedArtifact = String(input.sharedArtifact ?? mission.sharedArtifact ?? "").trim();
  const teacherLookFor = String(input.teacherLookFor ?? mission.teacherLookFor ?? "").trim();
  const individualEvidence = String(input.individualEvidence ?? mission.individualEvidence ?? "").trim();
  const roleLabels = Array.isArray(input.roleLabels)
    ? input.roleLabels.map((item) => String(item).trim()).filter(Boolean)
    : String(input.roleLabels ?? mission.roleLabels ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
  const groupSize = Math.max(2, Math.min(8, Number(input.groupSize ?? mission.groupSize ?? 3) || 3));

  if (title.length < 8) {
    return { state, result: { accepted: false, reason: "Mission title must be at least 8 characters." } };
  }
  if (sharedArtifact.length < 8) {
    return { state, result: { accepted: false, reason: "Describe the shared artifact students will create." } };
  }
  if (teacherLookFor.length < 12) {
    return { state, result: { accepted: false, reason: "Add a concrete teacher look-for before saving the mission." } };
  }
  if (individualEvidence.length < 12) {
    return { state, result: { accepted: false, reason: "Add the individual evidence requirement for accountability." } };
  }

  const updatedMission = {
    ...mission,
    title,
    groupSize,
    sharedArtifact,
    roleLabels: roleLabels.length ? roleLabels : mission.roleLabels || [],
    individualEvidence,
    teacherLookFor,
    updatedAt: new Date().toISOString()
  };
  const nextState = {
    ...state,
    groupMissions: (state.groupMissions || []).map((item) => (item.id === mission.id ? updatedMission : item))
  };
  return {
    state: nextState,
    result: {
      accepted: true,
      mission: updatedMission,
      summary: `${updatedMission.title} was updated for ${classSection.name}.`
    }
  };
}

export function submitClassroomArtifact(state = {}, input = {}) {
  const missionId = String(input.missionId || "").trim();
  const learnerId = String(input.learnerId || input.studentId || "").trim();
  const mission = (state.groupMissions || []).find((item) => item.id === missionId);
  const session = mission ? findClassSessionById(state, mission.sessionId) : null;
  const classSection = session ? findClassSectionForSession(state, session) : null;
  const learner = getLearnerById(state, learnerId);
  const individualEvidence = String(input.individualEvidence || input.evidence || "").trim();

  if (!mission || !session || !classSection || !learner || !(classSection.studentIds || []).includes(learner.id)) {
    return {
      state,
      result: {
        accepted: false,
        reason: "A valid enrolled learner, group mission, and class session are required."
      }
    };
  }

  if (individualEvidence.length < 12) {
    return {
      state,
      result: {
        accepted: false,
        reason: "Write a specific evidence sentence before submitting the group mission artifact."
      }
    };
  }

  const now = new Date().toISOString();
  const existing = findClassroomArtifact(state, mission.id, learner.id);
  const artifact = {
    ...(existing || {}),
    id: existing?.id || `group-artifact-${mission.id}-${learner.id}`.replace(/[^a-z0-9_-]/gi, "-"),
    missionId: mission.id,
    classSessionId: session.id,
    classSectionId: classSection.id,
    learnerId: learner.id,
    artifactTitle: String(input.artifactTitle || mission.sharedArtifact || mission.title || "Group artifact").trim(),
    artifactStatus: "submitted",
    individualEvidence,
    submittedAt: now,
    reviewedAt: existing?.reviewedAt || "",
    reviewedBy: existing?.reviewedBy || "",
    teacherNote: existing?.teacherNote || ""
  };

  const nextState = {
    ...state,
    classroomArtifacts: [artifact, ...(state.classroomArtifacts || []).filter((item) => item.id !== artifact.id)].slice(0, 160)
  };

  return {
    state: logLearningEvent(nextState, {
      learnerId: learner.id,
      lessonId: session.lessonId,
      type: "group_artifact_submitted",
      value: {
        missionId: mission.id,
        artifactStatus: artifact.artifactStatus
      }
    }),
    result: {
      accepted: true,
      artifact,
      summary: `${learner.name} submitted group mission evidence.`
    }
  };
}

export function recordTeacherIntervention(state = {}, input = {}) {
  const interventionId = String(input.interventionId || "").trim();
  const now = new Date().toISOString();

  if (interventionId) {
    const existing = (state.teacherInterventions || []).find((item) => item.id === interventionId);
    if (!existing) {
      return {
        state,
        result: {
          accepted: false,
          reason: "Teacher intervention was not found."
        }
      };
    }

    const outcome = String(input.outcome || "").trim();
    const outcomeNote = String(input.outcomeNote || input.teacherNote || "").slice(0, 300);
    const nextStatus = String(input.status || "resolved").trim();
    const nextIntervention = {
      ...existing,
      status: nextStatus,
      resolvedAt: nextStatus === "resolved" ? now : existing.resolvedAt || "",
      teacherNote: input.teacherNote === undefined ? existing.teacherNote || outcomeNote || "" : String(input.teacherNote || ""),
      outcome: outcome || existing.outcome || "",
      outcomeAt: outcome ? now : existing.outcomeAt || "",
      outcomeNote: outcomeNote || existing.outcomeNote || ""
    };
    const improvementSignal =
      outcome && ["not-worked", "needs-redesign", "still-confused"].includes(outcome)
        ? createTeacherInterventionImprovementSignal(nextIntervention, outcome, outcomeNote)
        : null;
    const existingSignals = state.lessonImprovementSignals || [];
    const nextImprovementSignals = improvementSignal
      ? [improvementSignal, ...existingSignals.filter((signal) => signal.id !== improvementSignal.id)].slice(0, 80)
      : existingSignals;
    const nextState = {
      ...state,
      teacherInterventions: (state.teacherInterventions || []).map((item) => (item.id === interventionId ? nextIntervention : item)),
      lessonImprovementSignals: nextImprovementSignals
    };
    const withEvent = outcome
      ? logLearningEvent(nextState, {
          learnerId: nextIntervention.learnerId || nextIntervention.studentId || "",
          lessonId: nextIntervention.lessonId || "",
          type: "teacher_intervention_outcome",
          value: {
            outcome,
            status: nextIntervention.status,
            improvementSignalId: improvementSignal?.id || "",
            diagnosisLabel: nextIntervention.adaptiveReteach?.diagnosisLabel || ""
          }
        })
      : nextState;

    return {
      state: withEvent,
      result: {
        accepted: true,
        intervention: nextIntervention,
        improvementSignalId: improvementSignal?.id || "",
        summary: outcome
          ? `Teacher intervention outcome recorded: ${outcome.replace("-", " ")}.`
          : `Teacher intervention ${nextIntervention.status}.`
      }
    };
  }

  const classSessionId = String(input.classSessionId || input.sessionId || "").trim();
  const learnerId = String(input.learnerId || input.studentId || "").trim();
  const session = findClassSessionById(state, classSessionId);
  const classSection = session ? findClassSectionForSession(state, session) : null;
  const learner = getLearnerById(state, learnerId);
  if (!session || !classSection || !learner || !(classSection.studentIds || []).includes(learner.id)) {
    return {
      state,
      result: {
        accepted: false,
        reason: "A valid class session and enrolled learner are required before recording an intervention."
      }
    };
  }

  const interventionType = String(input.interventionType || "reteach").trim();
  const adaptiveReteach = getAdaptiveReteachRecommendation(state, learner.id, session.lessonId);
  const summary =
    String(input.summary || "").trim() ||
    (adaptiveReteach.diagnosisLabel || adaptiveReteach.hasTutorRetry
      ? `Targeted reteach for ${learner.name}: ${adaptiveReteach.reteachMove}`
      : `Teacher will review ${learner.name}'s stuck point, visual model, and exit ticket before assigning the next step.`);
  const id = `intervention-${session.id}-${learner.id}-${Date.now()}`.replace(/[^a-z0-9_-]/gi, "-");
  const intervention = {
    id,
    teacherId: String(input.teacherId || classSection.teacherId || "teacher-demo-1"),
    classSessionId: session.id,
    learnerId: learner.id,
    lessonId: session.lessonId || "",
    interventionType,
    summary,
    adaptiveReteach,
    status: String(input.status || "open").trim(),
    createdAt: now,
    resolvedAt: "",
    teacherNote: String(input.teacherNote || "")
  };

  const nextState = {
    ...state,
    teacherInterventions: [intervention, ...(state.teacherInterventions || [])].slice(0, 160)
  };

  return {
    state: logLearningEvent(nextState, {
      learnerId: learner.id,
      lessonId: session.lessonId,
      type: "teacher_intervention_recorded",
      value: {
        interventionType,
        status: intervention.status,
        diagnosisLabel: adaptiveReteach.diagnosisLabel || "",
        evidenceStrength: adaptiveReteach.evidenceStrength || ""
      }
    }),
    result: {
      accepted: true,
      intervention,
      summary: `Teacher intervention recorded for ${learner.name}.`
    }
  };
}

export function getClassroomProductSummary(state = {}) {
  const classes = state.classSections || [];
  const sessions = state.classSessions || [];
  const missions = state.groupMissions || [];
  const artifacts = state.classroomArtifacts || [];
  const interventions = state.teacherInterventions || [];
  return {
    schoolName: state.schoolProfile?.name || "No school configured",
    implementationStage: state.schoolProfile?.implementationStage || "Not started",
    pilotFocus: state.schoolProfile?.pilotFocus || "Bridge Academy classroom pilot",
    classCount: classes.length,
    activeSessions: sessions.length,
    groupMissions: missions.length,
    submittedArtifacts: artifacts.filter((artifact) => artifact.artifactStatus === "submitted").length,
    openInterventions: interventions.filter((intervention) => intervention.status !== "resolved").length,
    enrolledStudents: classes.reduce((sum, section) => sum + (section.studentIds || []).length, 0),
    bridgeClassReady: classes.some((section) => section.academyId === "bridge" && section.status === "pilot-ready")
  };
}

export function getSchoolReportSnapshot(state = {}, schoolId = "") {
  const targetSchoolId = String(schoolId || state.schoolProfile?.id || "school-demo-1").trim();
  const sections = (state.classSections || []).filter((section) => !section.schoolId || section.schoolId === targetSchoolId);
  const rows = sections.map((section) => {
    const monitor = getTeacherClassMonitor(state, section.id);
    return {
      schoolId: section.schoolId || targetSchoolId,
      classId: section.id,
      className: section.name || "Class",
      grade: section.grade || "",
      academyId: section.academyId || "",
      subject: section.subject || "",
      teacherId: section.teacherId || "",
      rosterCount: monitor.metrics.enrolled || 0,
      averageMastery: monitor.metrics.averageMastery || 0,
      needsHelp: monitor.metrics.needsHelp || 0,
      teacherSupport: monitor.metrics.teacherSupport || 0,
      submittedArtifacts: monitor.metrics.submittedArtifacts || 0,
      groupMissions: (state.groupMissions || []).filter((mission) =>
        (state.classSessions || []).some((session) => session.id === mission.sessionId && session.classSectionId === section.id)
      ).length,
      sessionStatus: monitor.session?.status || "No session"
    };
  });
  return {
    school: state.schoolProfile || null,
    schoolId: targetSchoolId,
    generatedAt: new Date().toISOString(),
    totals: {
      classes: rows.length,
      rosterCount: rows.reduce((sum, row) => sum + row.rosterCount, 0),
      averageMastery: rows.length ? Math.round(rows.reduce((sum, row) => sum + row.averageMastery, 0) / rows.length) : 0,
      needsHelp: rows.reduce((sum, row) => sum + row.needsHelp, 0),
      teacherSupport: rows.reduce((sum, row) => sum + row.teacherSupport, 0),
      submittedArtifacts: rows.reduce((sum, row) => sum + row.submittedArtifacts, 0)
    },
    rows
  };
}

const schoolClassSubjectIds = new Set([
  "ela",
  "writing",
  "math",
  "science",
  "social-studies",
  "health-pe",
  "arts-media",
  "computer-science",
  "life-skills",
  "career-college"
]);

function schoolSubjectLabel(subject = "") {
  const labels = {
    ela: "ELA",
    writing: "Writing",
    math: "Math",
    science: "Science",
    "social-studies": "Social Studies",
    "health-pe": "Health and PE",
    "arts-media": "Arts and Music",
    "computer-science": "Computer Science",
    "life-skills": "Life Skills",
    "career-college": "Career and College Readiness"
  };
  return labels[subject] || "Learning";
}

function normalizeSchoolGrade(grade = "") {
  const value = String(grade || "").trim().toUpperCase();
  if (value === "K") return value;
  const numeric = Number(value);
  return Number.isInteger(numeric) && numeric >= 1 && numeric <= 12 ? String(numeric) : "";
}

export function createSchoolClass(state = {}, input = {}) {
  const name = String(input.name || input.className || "").trim();
  const grade = normalizeSchoolGrade(input.grade || input.gradeLevel);
  const subject = String(input.subject || "science").trim().toLowerCase();
  const schoolId = String(input.schoolId || state.schoolProfile?.id || "school-demo-1").trim();
  const teacherId = String(input.teacherId || "teacher-demo-1").trim();

  if (!name) return { state, result: { accepted: false, reason: "Class name is required." } };
  if (!grade) return { state, result: { accepted: false, reason: "Choose a grade from K through 12." } };
  if (!schoolClassSubjectIds.has(subject)) {
    return { state, result: { accepted: false, reason: "Choose a supported school subject." } };
  }

  const id = String(input.id || `class-${slug(name)}-${Date.now()}`).replace(/[^a-z0-9_-]/gi, "-");
  if ((state.classSections || []).some((section) => section.id === id || section.name?.toLowerCase() === name.toLowerCase())) {
    return { state, result: { accepted: false, reason: "A class with that name already exists." } };
  }

  const academyId = defaultAcademyForGrade(grade);
  const section = {
    id,
    schoolId,
    teacherId,
    name,
    grade,
    academyId,
    subject,
    courseTitle: String(input.courseTitle || `${schoolSubjectLabel(subject)} Studio`).trim(),
    schedule: String(input.schedule || "Schedule to be set").trim(),
    status: "setup",
    studentIds: [],
    currentSessionId: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return {
    state: { ...state, classSections: [section, ...(state.classSections || [])] },
    result: { accepted: true, classSection: section, summary: `${name} was created and is ready for roster enrollment.` }
  };
}

export function enrollLearnerInSchoolClass(state = {}, input = {}) {
  const classSectionId = String(input.classSectionId || input.classId || "").trim();
  const learnerId = String(input.learnerId || input.studentId || "").trim();
  const section = findClassSectionById(state, classSectionId);
  const learner = getLearnerById(state, learnerId);

  if (!section || !learner || !learner.id) {
    return { state, result: { accepted: false, reason: "Choose an existing class and learner before enrolling." } };
  }

  const existingIds = section.studentIds || [];
  if (existingIds.includes(learner.id)) {
    return {
      state,
      result: {
        accepted: true,
        alreadyEnrolled: true,
        classSection: section,
        learner,
        summary: `${learner.name} is already enrolled in ${section.name}.`
      }
    };
  }

  const updatedSection = {
    ...section,
    studentIds: [...existingIds, learner.id],
    updatedAt: new Date().toISOString()
  };
  const nextState = {
    ...state,
    classSections: (state.classSections || []).map((item) => (item.id === section.id ? updatedSection : item))
  };
  return {
    state: nextState,
    result: {
      accepted: true,
      alreadyEnrolled: false,
      classSection: updatedSection,
      learner,
      enrollment: {
        id: `enroll-${section.id}-${learner.id}`.replace(/[^a-z0-9_-]/gi, "-"),
        classSectionId: section.id,
        learnerId: learner.id,
        status: "active"
      },
      summary: `${learner.name} is now enrolled in ${section.name}.`
    }
  };
}

function normalizeRosterGrade(grade = "") {
  const value = String(grade || "").trim().toUpperCase();
  if (value === "K") return value;
  const numeric = Number(value);
  return Number.isInteger(numeric) && numeric >= 1 && numeric <= 12 ? String(numeric) : "";
}

function rosterStudentId(row = {}) {
  const explicit = String(row.student_id || row.studentId || "").trim();
  if (explicit) return explicit.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80);
  const basis = String(row.username || row.email || row.display_name || "student").trim().toLowerCase();
  return `student-${slug(basis)}`.slice(0, 80);
}

export function getSchoolRosterImportContract() {
  return { ...rosterImportContract, requiredHeaders: [...rosterImportContract.requiredHeaders], optionalHeaders: [...rosterImportContract.optionalHeaders] };
}

export function importSchoolRoster(state = {}, input = {}) {
  const schoolId = String(input.schoolId || state.schoolProfile?.id || "school-demo-1").trim();
  const parsed = parseRosterCsv(input.csv || input.rosterCsv || "");
  if (!parsed.accepted) {
    return { state, result: { accepted: false, imported: 0, createdLearners: 0, enrolled: 0, invitations: 0, errors: parsed.errors } };
  }

  const sections = state.classSections || [];
  const learners = state.learners || [];
  const accounts = state.localAccounts || [];
  const errors = [];
  const rowsWithIds = new Set();
  const rowsWithEmails = new Set();

  for (const row of parsed.rows) {
    const displayName = String(row.display_name || "").trim();
    const grade = normalizeRosterGrade(row.grade);
    const classId = String(row.class_id || row.class_section_id || "").trim();
    const section = sections.find((item) => item.id === classId);
    const email = normalizeAccountEmail(row.email);
    const username = normalizeAccountUsername(row.username);
    const studentId = rosterStudentId(row);

    if (!displayName) errors.push(`Row ${row.rowNumber}: display_name is required.`);
    if (!grade) errors.push(`Row ${row.rowNumber}: grade must be K through 12.`);
    if (!section) errors.push(`Row ${row.rowNumber}: class_id ${classId || "(empty)"} was not found.`);
    if (section && section.schoolId && section.schoolId !== schoolId) errors.push(`Row ${row.rowNumber}: class_id ${classId} belongs to another school.`);
    if (section && grade && String(section.grade).toUpperCase() !== grade) errors.push(`Row ${row.rowNumber}: grade ${grade} does not match class ${classId}'s grade.`);
    if (email && !/^\S+@\S+\.\S+$/.test(email)) errors.push(`Row ${row.rowNumber}: email is not valid.`);
    if (rowsWithIds.has(studentId)) errors.push(`Row ${row.rowNumber}: duplicate student_id ${studentId}.`);
    if (email && rowsWithEmails.has(email)) errors.push(`Row ${row.rowNumber}: duplicate email ${email}.`);
    rowsWithIds.add(studentId);
    if (email) rowsWithEmails.add(email);
  }

  if (errors.length) {
    return { state, result: { accepted: false, imported: 0, createdLearners: 0, enrolled: 0, invitations: 0, errors } };
  }

  const nextLearners = [...learners];
  const nextConsentRecords = { ...(state.consentRecords || {}) };
  const nextSections = sections.map((section) => ({ ...section, studentIds: [...(section.studentIds || [])] }));
  const nextInvitations = [...(state.accountInvitations || [])];
  let createdLearners = 0;
  let enrolled = 0;
  let invitations = 0;

  for (const row of parsed.rows) {
    const grade = normalizeRosterGrade(row.grade);
    const section = nextSections.find((item) => item.id === String(row.class_id || row.class_section_id || "").trim());
    const email = normalizeAccountEmail(row.email);
    const username = normalizeAccountUsername(row.username);
    const suppliedStudentId = rosterStudentId(row);
    const existingAccount = accounts.find(
      (account) =>
        account.role === "student" &&
        ((email && account.email === email) || (username && account.username === username) || account.studentId === suppliedStudentId)
    );
    const studentId = existingAccount?.studentId || suppliedStudentId;
    let learner = nextLearners.find((item) => item.id === studentId);

    if (!learner) {
      const academyId = defaultAcademyForGrade(grade);
      learner = {
        id: studentId,
        name: String(row.display_name).trim(),
        grade,
        academyId,
        schedule: academyId === "foundation" ? "45 min/day" : academyId === "bridge" ? "60 min/day" : "90 min/day",
        accommodations: String(row.accommodations || "")
          .split(";")
          .map((item) => item.trim())
          .filter(Boolean),
        status: "pending-account",
        schoolId
      };
      nextLearners.push(learner);
      nextConsentRecords[studentId] = nextConsentRecords[studentId] || {
        dataCollection: false,
        aiHelper: false,
        portfolio: false,
        thirdPartySharing: false,
        consentedBy: "Pending parent or school consent",
        lastUpdated: new Date().toISOString().slice(0, 10)
      };
      createdLearners += 1;
    }

    if (section && !section.studentIds.includes(studentId)) {
      section.studentIds.push(studentId);
      section.status = section.status === "setup" ? "roster-ready" : section.status;
      section.updatedAt = new Date().toISOString();
      enrolled += 1;
    }

    const invitationId = `invite-student-${studentId}-${section?.id || "unassigned"}`.replace(/[^a-z0-9_-]/gi, "-");
    const hasPendingInvitation = nextInvitations.some((item) => item.id === invitationId && item.status === "pending");
    if (!existingAccount && !hasPendingInvitation) {
      nextInvitations.push({
        id: invitationId,
        email,
        username,
        role: "student",
        invitedByUserId: input.invitedByUserId || "user-platform-admin",
        targetStudentId: studentId,
        targetClassId: section?.id || "",
        tokenHash: "",
        status: "pending",
        expiresAt: "",
        acceptedAt: "",
        createdAt: new Date().toISOString()
      });
      invitations += 1;
    }
  }

  return {
    state: {
      ...state,
      learners: nextLearners,
      consentRecords: nextConsentRecords,
      classSections: nextSections,
      accountInvitations: nextInvitations
    },
    result: {
      accepted: true,
      imported: parsed.rows.length,
      createdLearners,
      enrolled,
      invitations,
      errors: [],
      summary: `Imported ${parsed.rows.length} roster row(s), enrolled ${enrolled} learner(s), and created ${invitations} pending invitation(s).`
    }
  };
}

export function getSchoolRosterCsv(state = {}, schoolId = "") {
  return exportRosterCsv(state, schoolId || state.schoolProfile?.id || "");
}

export function scoreQuiz(lesson, answers) {
  const correct = lesson.quiz.filter((question) => answers[question.id] === question.answerIndex).length;
  const score = Math.round((correct / lesson.quiz.length) * 100);
  return {
    correct,
    total: lesson.quiz.length,
    score,
    passed: score >= lesson.masteryThreshold
  };
}

export function getAdaptiveReteachRecommendation(state = {}, learnerId = "", lessonId = "") {
  const lesson = findLessonInState(state, lessonId || state.selectedLessonId);
  const tutorEvidence = getTutorReflectionEvidence(state, learnerId, lesson.id);
  const scratchpad = getLessonScratchpad(state, learnerId, lesson.id);
  const latest = tutorEvidence.latestQualified || tutorEvidence.latest;
  const diagnosisLabel = latest?.label || "";
  const retryText = String(scratchpad.retryAfterHint || "").trim();
  const defaultMove = lesson.sections?.reteach || "Return to the model, try one smaller step, then answer a simpler check.";

  const movesByDiagnosis = {
    "plot vs theme": "Separate what happened from what it means. Write one event, then turn it into a theme claim with because.",
    evidence: "Pick one detail that proves the claim. Explain how the detail supports the claim before choosing another answer.",
    "symbol meaning": "Name the symbol, write what it represents, then connect that meaning to the character's choice.",
    "claim wording": "Rewrite the claim as a full message about choices, consequences, or values instead of a one-word topic.",
    "first step": "Do only the first move. Name the input, the action, and the expected output before solving the whole problem.",
    reasoning: "Use a because sentence. Connect the detail or step to the rule, claim, or model.",
    "visual model": "Label the diagram first. Say what each part represents before trying the quiz again.",
    vocabulary: "Define the blocking word in your own words, then use it in one lesson example."
  };

  const targetedMove = movesByDiagnosis[diagnosisLabel] || defaultMove;
  return {
    type: diagnosisLabel ? "diagnosis-targeted-reteach" : "standard-reteach",
    diagnosisLabel,
    hasTutorRetry: Boolean(retryText),
    tutorRetry: retryText,
    nextQuestion: latest?.nextQuestion || "",
    reteachMove: targetedMove,
    teacherLookFor: diagnosisLabel
      ? `Check whether the learner repaired ${diagnosisLabel} after the tutor hint.`
      : "Check the written stuck point, then assign the lesson reteach path.",
    studentMessage: diagnosisLabel
      ? `Your quiz shows this still needs work: ${diagnosisLabel}. Use your tutor retry, then try this move: ${targetedMove}`
      : `Your quiz shows this still needs work. Try this repair: ${targetedMove}`,
    evidenceStrength: retryText ? "strong-retry-evidence" : latest ? "diagnosed-no-retry" : "quiz-only"
  };
}

export function completeLessonQuiz(state, lessonId, answers, options = {}) {
  const lesson = findLessonInState(state, lessonId);
  const submittedAnswers = Object.fromEntries(Object.entries(answers || {}).map(([questionId, answerIndex]) => [questionId, Number(answerIndex)]));
  const learnerId = options.learnerId || (lesson.academyId === "foundation" ? "avery" : lesson.academyId === "bridge" ? "maya" : "jordan");
  const adaptiveReteach = getAdaptiveReteachRecommendation(state, learnerId, lessonId);
  const result = {
    ...scoreQuiz(lesson, submittedAnswers),
    answers: submittedAnswers,
    adaptiveReteach: null
  };
  if (!result.passed) result.adaptiveReteach = adaptiveReteach;
  const previous = state.mastery[lessonId] || { attempts: 0 };
  const nextMastery = {
    score: result.score,
    status: result.passed ? "Mastered" : "Needs review",
    attempts: previous.attempts + 1,
    evidence: result.passed
      ? `Passed ${lesson.title} checkpoint with ${result.score}%.`
      : `${adaptiveReteach.studentMessage} (${result.score}% checkpoint score.)`,
    adaptiveReteach: result.adaptiveReteach
  };

  const nextState = {
    ...state,
    quizResults: {
      ...state.quizResults,
      [lessonId]: result
    },
    mastery: {
      ...state.mastery,
      [lessonId]: nextMastery
    }
  };

  return scheduleRecall(
    logLearningEvent(nextState, {
      learnerId,
      lessonId,
      type: "quiz_completed",
      value: { score: result.score, passed: result.passed }
    }),
    learnerId,
    lessonId,
    result.score
  );
}

export function getLessonScratchpad(state = {}, learnerId = "", lessonId = "") {
  return state.lessonScratchpads?.[learnerId]?.[lessonId] || {
    learnerId,
    lessonId,
    firstStep: "",
    explanation: "",
    confusion: "",
    retryAfterHint: "",
    recallResponse: "",
    transferResponse: "",
    retryAfterHintAt: "",
    updatedAt: "",
    tutorReviewCount: 0
  };
}

export function updateLessonScratchpad(state = {}, input = {}) {
  const learnerId = String(input.learnerId || "").trim();
  const lessonId = String(input.lessonId || state.selectedLessonId || "").trim();
  if (!learnerId || !lessonId) return state;

  const previous = getLessonScratchpad(state, learnerId, lessonId);
  const nextEntry = {
    ...previous,
    learnerId,
    lessonId,
    firstStep: input.firstStep === undefined ? previous.firstStep || "" : String(input.firstStep || ""),
    explanation: input.explanation === undefined ? previous.explanation || "" : String(input.explanation || ""),
    confusion: input.confusion === undefined ? previous.confusion || "" : String(input.confusion || ""),
    retryAfterHint: input.retryAfterHint === undefined ? previous.retryAfterHint || "" : String(input.retryAfterHint || ""),
    recallResponse: input.recallResponse === undefined ? previous.recallResponse || "" : String(input.recallResponse || ""),
    transferResponse: input.transferResponse === undefined ? previous.transferResponse || "" : String(input.transferResponse || ""),
    retryAfterHintAt:
      input.retryAfterHint === undefined
        ? previous.retryAfterHintAt || ""
        : String(input.retryAfterHint || "").trim()
          ? new Date().toISOString()
          : "",
    updatedAt: new Date().toISOString()
  };

  return {
    ...state,
    lessonScratchpads: {
      ...(state.lessonScratchpads || {}),
      [learnerId]: {
        ...(state.lessonScratchpads?.[learnerId] || {}),
        [lessonId]: nextEntry
      }
    }
  };
}

export function createScratchpadTutorPrompt(state = {}, learnerId = "", lessonId = "") {
  const lesson = findLessonInState(state, lessonId || state.selectedLessonId);
  const scratchpad = getLessonScratchpad(state, learnerId, lesson.id);
  const support = getLessonTeachingSupport(lesson.id, state);
  const mythBoard = getInteractiveResponse(state, learnerId, lesson.id, "myth-decoder-board");
  const parts = [
    `Lesson: ${lesson.title}`,
    lesson.studentFacing?.mission ? `Mission: ${lesson.studentFacing.mission}` : "",
    mythBoard.value ? `My Myth Decoder Board choice: ${mythBoard.value} (${mythBoard.correct ? "marked correct" : "needs repair"})` : "",
    scratchpad.firstStep ? `My first try: ${scratchpad.firstStep}` : "",
    scratchpad.explanation ? `My explanation: ${scratchpad.explanation}` : "",
    scratchpad.confusion ? `What I still do not understand: ${scratchpad.confusion}` : "",
    scratchpad.recallResponse ? `My delayed recall: ${scratchpad.recallResponse}` : "",
    scratchpad.transferResponse ? `My transfer attempt: ${scratchpad.transferResponse}` : ""
  ].filter(Boolean);
  if (parts.length > 1) {
    const modeHint = lesson.id === "published-draft-next-wave-bridge-6-ela-u1-l1"
      ? "\nPlease diagnose whether I am stuck on plot vs theme, symbol meaning, evidence, or claim wording. Teach me with hints and one next question, not the final answer."
      : "\nPlease review my thinking and teach me with hints, not the final answer.";
    return `${parts.join("\n")}${modeHint}`;
  }
  return `I am working on ${lesson.title}. ${support.confusionPrompt}`;
}

export function markScratchpadTutorReviewed(state = {}, learnerId = "", lessonId = "") {
  const scratchpad = getLessonScratchpad(state, learnerId, lessonId);
  const nextState = updateLessonScratchpad(state, {
    learnerId,
    lessonId,
    firstStep: scratchpad.firstStep,
    explanation: scratchpad.explanation,
    confusion: scratchpad.confusion,
    retryAfterHint: scratchpad.retryAfterHint,
    recallResponse: scratchpad.recallResponse,
    transferResponse: scratchpad.transferResponse
  });
  return {
    ...nextState,
    lessonScratchpads: {
      ...(nextState.lessonScratchpads || {}),
      [learnerId]: {
        ...(nextState.lessonScratchpads?.[learnerId] || {}),
        [lessonId]: {
          ...getLessonScratchpad(nextState, learnerId, lessonId),
          tutorReviewCount: (scratchpad.tutorReviewCount || 0) + 1,
          reviewedAt: new Date().toISOString()
        }
      }
    }
  };
}

export function submitTutorHintRetry(state = {}, input = {}) {
  const learnerId = String(input.learnerId || "").trim();
  const lessonId = String(input.lessonId || state.selectedLessonId || "").trim();
  const retryAfterHint = String(input.retryAfterHint || input.response || "").trim();
  if (!learnerId || !lessonId || !retryAfterHint) {
    return {
      state,
      result: {
        accepted: false,
        reason: "Write a retry response after the tutor hint before earning reflection retry XP."
      }
    };
  }

  const previousScratchpad = getLessonScratchpad(state, learnerId, lessonId);
  const nextState = updateLessonScratchpad(state, { learnerId, lessonId, retryAfterHint });
  const latestTutorEvidence = getTutorReflectionEvidence(nextState, learnerId, lessonId).latestQualified;
  const alreadyLogged = (nextState.learningEvents || []).some(
    (event) =>
      event.learnerId === learnerId &&
      event.lessonId === lessonId &&
      event.type === "tutor_hint_retry_submitted" &&
      event.value?.retryAfterHint === retryAfterHint
  );
  const withEvent =
    alreadyLogged || previousScratchpad.retryAfterHint === retryAfterHint
      ? nextState
      : logLearningEvent(nextState, {
          learnerId,
          lessonId,
          type: "tutor_hint_retry_submitted",
          value: {
            retryAfterHint,
            usedDiagnosis: Boolean(latestTutorEvidence?.label),
            stuckPointLabel: latestTutorEvidence?.label || "",
            nextQuestion: latestTutorEvidence?.nextQuestion || ""
          }
        });

  return {
    state: withEvent,
    result: {
      accepted: true,
      summary: latestTutorEvidence?.label
        ? `Retry saved after tutor diagnosed ${latestTutorEvidence.label}.`
        : "Retry saved after tutor hint.",
      xp: xpForEvent(withEvent, {
        learnerId,
        lessonId,
        type: "tutor_hint_retry_submitted",
        value: { usedDiagnosis: Boolean(latestTutorEvidence?.label) }
      })
    }
  };
}

export function getInteractiveResponse(state = {}, learnerId = "", lessonId = "", widgetId = "") {
  return state.interactiveResponses?.[learnerId]?.[lessonId]?.[widgetId] || {
    learnerId,
    lessonId,
    widgetId,
    value: "",
    correct: false,
    attempts: 0,
    updatedAt: ""
  };
}

const interactiveSkillDiagnostics = {
  "ai-builder-system-sort": {
    skillId: "ai-builder-system-boundaries",
    skillLabel: "AI builder system boundaries",
    conceptBreakdown: "Learner separates AI, frontend, backend, data, QA, tool calls, and human review instead of treating the app as one magic box.",
    correctDiagnosis: "Learner identified backend permission work as behind-the-scenes safety logic.",
    retryDiagnosis: "Learner may be mixing visible interface choices with backend, data, or security responsibilities.",
    recommendedSupport: "Use the AI builder map and ask: does the user see this directly, or does it protect, store, connect, test, or approve something behind the scenes?"
  },
  "fraction-number-line-target": {
    skillId: "fraction-number-line-placement",
    skillLabel: "Fraction number line placement",
    conceptBreakdown: "Learner places fractions by equal intervals, not by counting tick marks only.",
    correctDiagnosis: "Learner used equal spacing to locate the fraction.",
    retryDiagnosis: "Learner may be counting tick marks instead of spaces.",
    recommendedSupport: "Return to the strip-to-line model and count equal spaces between 0 and 1."
  },
  "myth-decoder-board": {
    skillId: "theme-evidence-reasoning",
    skillLabel: "Theme evidence reasoning",
    conceptBreakdown: "Learner separates plot details from a transferable theme claim.",
    correctDiagnosis: "Learner selected a theme claim rather than a plot detail.",
    retryDiagnosis: "Learner may be retelling what happened instead of naming the message the events prove.",
    recommendedSupport: "Use the frame: the story suggests that people sometimes ___ because ___."
  },
  "g6-ratio-table-lab": {
    skillId: "ratio-scaling",
    skillLabel: "Ratio scaling",
    conceptBreakdown: "Learner scales both quantities together to preserve the relationship.",
    correctDiagnosis: "Learner recognized equivalent rates by scaling both columns.",
    retryDiagnosis: "Learner may be comparing only the larger number or changing one quantity without the other.",
    recommendedSupport: "Use a ratio table and ask what factor changed both quantities."
  },
  "g6-expression-machine": {
    skillId: "expression-order",
    skillLabel: "Expression order and variables",
    conceptBreakdown: "Learner understands input, variable, operation order, and output.",
    correctDiagnosis: "Learner traced the expression machine in the correct order.",
    retryDiagnosis: "Learner may be skipping the variable meaning or reversing the operation order.",
    recommendedSupport: "Run one input through the machine one step at a time and label each operation."
  },
  "g6-weather-evidence-map": {
    skillId: "forecast-evidence",
    skillLabel: "Forecast evidence",
    conceptBreakdown: "Learner uses current map data and multiple clues to support a forecast.",
    correctDiagnosis: "Learner chose current pressure and wind evidence for the forecast.",
    retryDiagnosis: "Learner may be using preferences, old information, or a single clue as evidence.",
    recommendedSupport: "Point to two current data clues before writing a because sentence."
  },
  "g6-cer-evidence-board": {
    skillId: "cer-reasoning",
    skillLabel: "Claim evidence reasoning",
    conceptBreakdown: "Learner connects claim, evidence, and reasoning instead of listing details only.",
    correctDiagnosis: "Learner selected the reasoning move that explains how evidence supports the claim.",
    retryDiagnosis: "Learner may be confusing evidence with the explanation of why it matters.",
    recommendedSupport: "Use the sentence frame: this evidence supports the claim because ___."
  },
  "g6-migration-source-map": {
    skillId: "source-map-reasoning",
    skillLabel: "Map and source reasoning",
    conceptBreakdown: "Learner combines map evidence with source clues to explain movement decisions.",
    correctDiagnosis: "Learner connected map features to a migration decision.",
    retryDiagnosis: "Learner may be reading a single map label without using source evidence.",
    recommendedSupport: "Ask what the map shows, what the source says, and how both clues connect."
  }
};

function interactiveSkillEvidenceForResponse(widgetId, response) {
  const diagnostic = interactiveSkillDiagnostics[widgetId] || {
    skillId: widgetId || "interactive-model",
    skillLabel: "Interactive model",
    conceptBreakdown: "Learner uses an interactive model to show current understanding.",
    correctDiagnosis: "Learner selected the expected model response.",
    retryDiagnosis: "Learner needs another model pass before the skill is secure.",
    recommendedSupport: "Return to the model, ask for the exact stuck point, then retry one smaller step."
  };
  const correct = Boolean(response.correct);
  return {
    skillId: diagnostic.skillId,
    skillLabel: diagnostic.skillLabel,
    conceptBreakdown: diagnostic.conceptBreakdown,
    status: correct ? "secure" : response.attempts > 1 ? "needs-reteach" : "needs-retry",
    diagnosis: correct ? diagnostic.correctDiagnosis : diagnostic.retryDiagnosis,
    recommendedSupport: diagnostic.recommendedSupport,
    evidenceStrength: correct ? "interactive-correct" : "interactive-retry",
    updatedAt: response.updatedAt || ""
  };
}

export function recordInteractiveResponse(state = {}, input = {}) {
  const learnerId = String(input.learnerId || "").trim();
  const lessonId = String(input.lessonId || state.selectedLessonId || "").trim();
  const widgetId = String(input.widgetId || "lesson-widget").trim();
  if (!learnerId || !lessonId || !widgetId) return state;
  const previous = getInteractiveResponse(state, learnerId, lessonId, widgetId);
  const response = {
    learnerId,
    lessonId,
    widgetId,
    value: String(input.value || ""),
    correct: Boolean(input.correct),
    feedback: String(input.feedback || ""),
    attempts: (previous.attempts || 0) + 1,
    updatedAt: new Date().toISOString()
  };
  response.skillEvidence = interactiveSkillEvidenceForResponse(widgetId, response);
  const nextState = {
    ...state,
    interactiveResponses: {
      ...(state.interactiveResponses || {}),
      [learnerId]: {
        ...(state.interactiveResponses?.[learnerId] || {}),
        [lessonId]: {
          ...(state.interactiveResponses?.[learnerId]?.[lessonId] || {}),
          [widgetId]: response
        }
      }
    }
  };
  return logLearningEvent(nextState, {
    learnerId,
    lessonId,
    type: "interactive_widget_attempted",
    value: {
      widgetId,
      value: response.value,
      correct: response.correct,
      attempts: response.attempts,
      skillEvidence: response.skillEvidence
    }
  });
}

export function getLearnerInteractiveSkillEvidence(state = {}, learnerId = "", options = {}) {
  const lessonFilter = String(options.lessonId || "").trim();
  const lessonResponses = state.interactiveResponses?.[learnerId] || {};
  const signals = Object.entries(lessonResponses)
    .filter(([lessonId]) => !lessonFilter || lessonId === lessonFilter)
    .flatMap(([lessonId, widgets]) =>
      Object.entries(widgets || {}).map(([widgetId, response]) => {
        const lesson = findLessonInState(state, lessonId);
        const skillEvidence = response.skillEvidence || interactiveSkillEvidenceForResponse(widgetId, response);
        return {
          learnerId,
          lessonId,
          lessonTitle: lesson?.title || lessonId,
          widgetId,
          value: response.value || "",
          correct: Boolean(response.correct),
          attempts: Number(response.attempts || 0),
          ...skillEvidence
        };
      })
    )
    .sort((left, right) => new Date(right.updatedAt || 0).getTime() - new Date(left.updatedAt || 0).getTime());
  return {
    learnerId,
    total: signals.length,
    secure: signals.filter((signal) => signal.status === "secure").length,
    needsSupport: signals.filter((signal) => signal.status !== "secure").length,
    signals
  };
}

export function getParentSummary(state, options = {}) {
  const learners = scopedLearners(state, options.learnerIds, options);
  const learnerIds = options.learnerIds?.length ? options.learnerIds : learners.map((learner) => learner.id);
  const plans = getTodayPlan(state, { learnerIds, strictLearnerScope: options.strictLearnerScope });
  const mastered = plans.filter((item) => item.mastery.score >= item.masteryThreshold).length;
  const needsReview = plans.filter((item) => item.mastery.status === "Needs review").length;
  const averageMastery = plans.length ? Math.round(plans.reduce((sum, item) => sum + item.mastery.score, 0) / plans.length) : 0;
  const consentReady = getConsentReadiness(state);
  const scopedConsentMissing = learnerIds.length
    ? learnerIds.filter((learnerId) => {
        const consent = state.consentRecords?.[learnerId];
        return !consent?.dataCollection || !consent?.portfolio;
      })
    : consentReady.missing;
  return {
    mastered,
    needsReview,
    averageMastery,
    consentReady: scopedConsentMissing.length === 0,
    consentMissing: scopedConsentMissing.length,
    portfolioItems: 9,
    attendanceStreak: 12,
    learnerCount: learners.length,
    nextIntervention: needsReview ? "Schedule a 12-minute reteach block before the next quiz." : "Offer a challenge task."
  };
}

export function getCurriculumTotals() {
  const courseCount = curriculum.academies.reduce((sum, academy) => sum + academy.courseCount, 0);
  const plannedUnitCount = curriculum.academies.reduce((sum, academy) => sum + academy.plannedUnitCount, 0);
  return {
    academies: curriculum.academies.length,
    courseCount,
    plannedUnitCount,
    targetLessons: curriculum.totalTargetLessons
  };
}

export function getPlatformSchema() {
  return getProductionSchema();
}

export function getPlatformSchemaSummary() {
  return getProductionSchemaSummary();
}

export function getPlatformSchemaValidation() {
  return validateProductionSchema();
}

export function getPlatformRoleAccessMatrix() {
  return getRoleAccessMatrix();
}

export function getPlatformSeedProjection(state) {
  return createProductionSeedProjection(state);
}

export function getPlatformDataModelReadiness(state) {
  return getProductionDataModelReadiness(state);
}

export function getPlatformMigration() {
  return generatePostgresMigration();
}

export function getPlatformMigrationReadiness() {
  return getMigrationReadiness();
}

export function getPlatformRepositoryAccessSummary() {
  return getRepositoryAccessSummary();
}

export function canAccessRepositoryAction(request) {
  return authorizeRepositoryAction(request);
}

export function getPlatformLessonLibrarySummary() {
  return getLessonLibrarySummary();
}

export function getPlatformLessonLibrarySamples(limit) {
  return getLessonLibrarySamples(limit);
}

export function getPlatformLessonProductionBatchPlan(options) {
  return getLessonProductionBatchPlan(options);
}

function getRequiredPilotVisualPlacements(lesson) {
  const placements = ["lesson-hero", "teaching-diagram", "ai-tutor"];
  if ((lesson.teachingSupport?.commonMisunderstandings || []).length) {
    placements.push("misconception-repair");
  }
  if (["bridge", "scholar"].includes(gradeBandForGrade(lesson.grade)) && lesson.groupHomework) {
    placements.push("group-homework");
  }
  return placements;
}

function getPilotVisualPlacementStatus(state, lesson) {
  const requiredPlacements = getRequiredPilotVisualPlacements(lesson);
  const assetsByPlacement = Object.fromEntries(
    requiredPlacements.map((placement) => [
      placement,
      getApprovedLessonVisualAsset(state, lesson.id, {
        preferredPlacements: [placement],
        requirePreferredPlacement: true,
        includeInlineSvg: true
      })
    ])
  );
  const missingPlacements = requiredPlacements.filter((placement) => !assetsByPlacement[placement]);
  const approvedAssets = Object.values(assetsByPlacement).filter(Boolean);
  return {
    requiredPlacements,
    missingPlacements,
    assetsByPlacement,
    approvedAssetIds: approvedAssets.map((asset) => asset.id),
    ready: missingPlacements.length === 0
  };
}

export function getPilotQualityGateReport(state = createInitialState()) {
  const visualAudit = getVisualLearningAgentAudit(state);
  const lessonReports = pilotLessons.map((lesson) => {
    const contentReview = gradeLessonContent(lesson);
    const promptSlot = visualAudit.slots.find((slot) => slot.lessonId === lesson.id && slot.placement === "lesson-hero") || getLessonVisualOpportunities(lesson)[0];
    const promptReview = gradeImagePrompt(promptSlot || { prompt: lesson.visual?.generationPrompt || lesson.objective, lessonId: lesson.id, grade: lesson.grade, subject: lesson.subject });
    const visualPlacementStatus = getPilotVisualPlacementStatus(state, lesson);
    const visualAsset = getApprovedLessonVisualAsset(state, lesson.id, { preferredPlacements: ["teaching-diagram", "lesson-hero"], includeInlineSvg: true });
    const visualReview = visualAsset
      ? gradeGeneratedVisual(visualAsset)
      : gradeGeneratedVisual({ id: `missing-${lesson.id}`, lessonId: lesson.id, title: lesson.title, caption: lesson.visual?.caption, sourcePrompt: promptSlot?.prompt, status: "missing" });
    const checks = {
      content: contentReview.score >= 80 && !contentReview.criticalBlockers.length,
      prompt: promptReview.score >= 80 && !promptReview.criticalBlockers.length,
      visual: Boolean(visualAsset) && visualPlacementStatus.ready && visualReview.score >= 80 && !visualReview.criticalBlockers.length,
      quiz: Array.isArray(lesson.quiz) && lesson.quiz.length > 0,
      tutor: Boolean(lesson.teachingSupport?.confusionPrompt || lesson.studentFacing?.tutorHandoff),
      accessibility: Boolean(lesson.accessibilityNotes || lesson.visual?.altText || visualAsset?.altText)
    };
    const score = Math.min(contentReview.score, promptReview.score, visualReview.score, ...Object.values(checks).map((passed) => passed ? 100 : 0));
    const grade = gradeForScore(score);
    const blockers = [
      ...(!checks.content ? [`Lesson content scored ${contentReview.grade} (${contentReview.score}).`] : []),
      ...(!checks.prompt ? [`Image prompt scored ${promptReview.grade} (${promptReview.score}).`] : []),
      ...(!checks.visual
        ? [
            visualPlacementStatus.missingPlacements.length
              ? `Missing approved production visuals for: ${visualPlacementStatus.missingPlacements.join(", ")}.`
              : visualAsset
                ? `Production visual scored ${visualReview.grade} (${visualReview.score}) or has a blocker.`
                : "No approved production visual is linked to this pilot lesson."
          ]
        : []),
      ...(!checks.quiz ? ["Quiz/mastery check is missing."] : []),
      ...(!checks.tutor ? ["Tutor handoff/confusion prompt is missing."] : []),
      ...(!checks.accessibility ? ["Accessibility notes or visual alt text is missing."] : [])
    ];
    return {
      lessonId: lesson.id,
      title: lesson.title,
      gradeLevel: lesson.grade,
      subject: lesson.subject,
      score,
      grade,
      passed: blockers.length === 0 && score >= 80,
      checks,
      blockers,
      contentReview,
      promptReview,
      visualReview,
      visualAssetId: visualAsset?.id || "",
      visualPlacementStatus
    };
  });
  const passedLessons = lessonReports.filter((lesson) => lesson.passed).length;
  const requiredPlacementCount = lessonReports.reduce((total, lesson) => total + lesson.visualPlacementStatus.requiredPlacements.length, 0);
  const readyPlacementCount = lessonReports.reduce((total, lesson) => total + lesson.visualPlacementStatus.approvedAssetIds.length, 0);
  const missingVisualPlacements = lessonReports.flatMap((lesson) =>
    lesson.visualPlacementStatus.missingPlacements.map((placement) => ({
      lessonId: lesson.lessonId,
      title: lesson.title,
      placement
    }))
  );
  return {
    minimumGrade: "B",
    minimumScore: 80,
    totalLessons: lessonReports.length,
    passedLessons,
    scaleUnlocked: passedLessons === lessonReports.length,
    summary: {
      a: lessonReports.filter((lesson) => lesson.grade === "A").length,
      b: lessonReports.filter((lesson) => lesson.grade === "B").length,
      belowB: lessonReports.filter((lesson) => ["C", "D", "F"].includes(lesson.grade)).length,
      visualReady: lessonReports.filter((lesson) => lesson.checks.visual).length,
      visualPlacementsReady: readyPlacementCount,
      visualPlacementsRequired: requiredPlacementCount,
      missingVisualPlacements: missingVisualPlacements.length,
      tutorReady: lessonReports.filter((lesson) => lesson.checks.tutor).length,
      quizReady: lessonReports.filter((lesson) => lesson.checks.quiz).length
    },
    missingVisualPlacements,
    lessons: lessonReports,
    blockingLessons: lessonReports.filter((lesson) => !lesson.passed).map((lesson) => ({ id: lesson.lessonId, title: lesson.title, blockers: lesson.blockers }))
  };
}

export function getPlatformOpenAiImageReadiness(env) {
  return getOpenAiImageReadiness(env);
}

export function getApprovedLessonVisualAsset(state = {}, lessonId = "", options = {}) {
  const preferredPlacements = Array.isArray(options.preferredPlacements) ? options.preferredPlacements : [];
  const requirePreferredPlacement = Boolean(options.requirePreferredPlacement);
  const includeInlineSvg = Boolean(options.includeInlineSvg);
  const placementRank = (asset) => {
    const index = preferredPlacements.indexOf(asset.placement);
    return index === -1 ? preferredPlacements.length + 1 : index;
  };
  const assets = (state.visualAssets || []).filter(
    (asset) => asset.lessonId === lessonId && asset.status === "approved" && (asset.storagePublicUrl || asset.assetUrl || (includeInlineSvg && asset.svg))
  ).filter((asset) => !requirePreferredPlacement || !preferredPlacements.length || preferredPlacements.includes(asset.placement));
  return assets.sort((left, right) => {
    const leftPlacement = placementRank(left);
    const rightPlacement = placementRank(right);
    if (leftPlacement !== rightPlacement) return leftPlacement - rightPlacement;
    const leftOpenAi = left.assetKind === "openai-generated-image" ? 1 : 0;
    const rightOpenAi = right.assetKind === "openai-generated-image" ? 1 : 0;
    if (leftOpenAi !== rightOpenAi) return rightOpenAi - leftOpenAi;
    const leftStorage = left.storagePublicUrl ? 1 : 0;
    const rightStorage = right.storagePublicUrl ? 1 : 0;
    if (leftStorage !== rightStorage) return rightStorage - leftStorage;
    return Date.parse(right.updatedAt || right.createdAt || "0") - Date.parse(left.updatedAt || left.createdAt || "0");
  })[0] || null;
}

export function getAppViewContractSummary() {
  return getViewContractSummary();
}

export function getRuntimeConfigurationStatus(env = {}) {
  const productionMode = ["production", "prod"].includes(String(env.APP_ENV || env.NODE_ENV || "").toLowerCase());
  const repositoryMode = String(env.K12_REPOSITORY_MODE || (env.DATABASE_URL ? "postgres" : "json")).toLowerCase();
  const databaseConfigured = Boolean(env.DATABASE_URL);
  const supabaseUrlConfigured = Boolean(env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL);
  const supabasePublishableConfigured = Boolean(env.SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  const supabaseSecretConfigured = Boolean(env.SUPABASE_SECRET_KEY);
  const supabaseRestConfigured = supabaseUrlConfigured && supabaseSecretConfigured;
  const supabaseJwksConfigured = Boolean(env.SUPABASE_JWKS_URL);
  const durableRepository = ["postgres", "supabase-rest"].includes(repositoryMode);
  const authProviderConfigured = isProductionAuthProviderConfigured(env);
  const authReadiness = getProductionAuthReadiness(env);
  const authBlockers = [...(authReadiness.blockers || []), ...(authReadiness.missing || []).map((item) => `Missing ${item}.`)];
  const openAiImage = getOpenAiImageReadiness(env);
  const openAiTutor = getOpenAiTutorReadiness(env);
  const visualAssetStorage = getVisualAssetStorageConfig(env);
  const blockers = [];
  const warnings = [];

  if (repositoryMode === "postgres" && !databaseConfigured) blockers.push("DATABASE_URL is required for Postgres repository mode.");
  if (repositoryMode === "supabase-rest" && !supabaseRestConfigured) blockers.push("SUPABASE_URL and SUPABASE_SECRET_KEY are required for Supabase REST repository mode.");
  if (productionMode && !durableRepository) blockers.push("Production runtime must use K12_REPOSITORY_MODE=postgres or supabase-rest.");
  if (productionMode && !databaseConfigured && !supabaseRestConfigured) blockers.push("Production runtime must configure a durable database connection.");
  if (productionMode && !authProviderConfigured) blockers.push("Production runtime must configure Supabase or another trusted auth provider.");
  if (authProviderConfigured && !authReadiness.passed) blockers.push(...authBlockers);
  if (!openAiImage.ready) warnings.push("OpenAI image generation is not ready; image prompts stay review-only until OPENAI_API_KEY and image settings are configured.");
  if (!openAiTutor.ready) warnings.push("OpenAI tutor generation is not ready; the local tutor remains the fallback until OPENAI_API_KEY and tutor limits are configured.");
  if (!visualAssetStorage.ready) warnings.push("Supabase visual asset storage is not ready; generated images cannot be promoted from data URLs to storage/CDN-backed production assets.");
  if (!supabasePublishableConfigured) warnings.push("Supabase publishable key is not configured for browser/client auth setup.");
  if (!supabaseSecretConfigured) warnings.push("Supabase server secret key is not configured; server-only Supabase API operations remain unavailable.");
  if (supabaseUrlConfigured && !supabaseJwksConfigured) warnings.push("SUPABASE_JWKS_URL is recommended for verified Supabase session claims.");

  return {
    ready: blockers.length === 0,
    productionMode,
    repositoryMode,
    databaseConfigured,
    databaseConnectionConfigured: databaseConfigured || (repositoryMode === "supabase-rest" && supabaseRestConfigured),
    supabaseUrlConfigured,
    supabasePublishableConfigured,
    supabaseSecretConfigured,
    supabaseJwksConfigured,
    authProviderConfigured,
    authReadiness,
    openAiImage,
    openAiTutor,
    visualAssetStorage,
    blockers,
    warnings,
    checks: [
      {
        id: "repository-mode",
        label: "Repository mode",
        passed: repositoryMode === "postgres" ? databaseConfigured : repositoryMode === "supabase-rest" ? supabaseRestConfigured : !productionMode,
        value: repositoryMode,
        detail: repositoryMode === "postgres" ? "Postgres selected." : repositoryMode === "supabase-rest" ? "Supabase PostgREST selected." : "JSON fallback selected."
      },
      {
        id: "database-url",
        label: "Database URL",
        passed: databaseConfigured || (repositoryMode === "supabase-rest" && supabaseRestConfigured),
        value: databaseConfigured ? "configured" : repositoryMode === "supabase-rest" && supabaseRestConfigured ? "supabase-rest" : "missing",
        detail: repositoryMode === "supabase-rest" ? "Supabase REST credentials are required for durable normalized reads and writes." : "Required before applying migrations, seeding Supabase, or running production runtime."
      },
      {
        id: "supabase-auth",
        label: "Supabase auth",
        passed: authProviderConfigured && authReadiness.passed,
        value: authProviderConfigured ? "configured" : "missing",
        detail: authReadiness.passed ? "Trusted provider claims can be verified." : authBlockers.join(" ")
      },
      {
        id: "supabase-client",
        label: "Supabase client keys",
        passed: supabaseUrlConfigured && supabasePublishableConfigured,
        value: supabaseUrlConfigured && supabasePublishableConfigured ? "configured" : "missing",
        detail: "Browser-safe project URL and publishable key for auth/client setup."
      },
      {
        id: "openai-images",
        label: "OpenAI images",
        passed: openAiImage.ready && openAiImage.reviewRequired,
        value: openAiImage.ready ? "configured" : "review-only",
        detail: openAiImage.ready ? `${openAiImage.model} with review gate and daily cost controls.` : "OPENAI_API_KEY or image settings are missing."
      },
      {
        id: "openai-tutor",
        label: "OpenAI tutor",
        passed: openAiTutor.ready,
        value: openAiTutor.ready ? "configured" : "local fallback",
        detail: openAiTutor.ready
          ? `${openAiTutor.model} with moderation, daily limits, and quality review.`
          : "Set OPENAI_API_KEY and tutor settings before enabling provider-backed student tutoring."
      },
      {
        id: "visual-storage",
        label: "Visual asset storage",
        passed: visualAssetStorage.ready,
        value: visualAssetStorage.ready ? visualAssetStorage.bucket : "not configured",
        detail: visualAssetStorage.ready
          ? `Supabase Storage bucket ${visualAssetStorage.bucket} is configured for approved visual assets.`
          : "Set SUPABASE_URL, SUPABASE_SECRET_KEY, and VISUAL_ASSET_STORAGE_BUCKET before approving generated image assets."
      }
    ]
  };
}

export function getStateDependencyAudit() {
  const focusedReadRoutes = [
    "/api/bootstrap",
    "/api/auth/security",
    "/api/learning/catalog",
    "/api/learning/scratchpads",
    "/api/learning/assignments",
    "/api/learning/retention-schedules",
    "/api/learning/portfolio-evidence",
    "/api/rewards/approvals",
    "/api/tutor/events",
    "/api/classroom/student",
    "/api/classroom/evidence",
    "/api/classroom/monitor",
    "/api/school/overview",
    "/api/content/drafts",
    "/api/content/visual-assets",
    "/api/agent-command-center/reviews",
    "/api/audit/events"
  ];
  const focusedWriteRoutes = [
    "/api/auth/signup",
    "/api/auth/signin",
    "/api/auth/request-email-verification",
    "/api/auth/verify-email",
    "/api/auth/request-password-reset",
    "/api/auth/reset-password",
    "/api/auth/revoke-session",
    "/api/auth/child-account",
    "/api/learning/quiz",
    "/api/learning/scratchpad",
    "/api/learning/interactive",
    "/api/learning/phase",
    "/api/rewards/request",
    "/api/rewards/decision",
    "/api/rewards/fulfill",
    "/api/classroom/session/status",
    "/api/classroom/artifact",
    "/api/classroom/mission",
    "/api/classroom/intervention",
    "/api/school/class",
    "/api/school/enrollment",
    "/api/school/roster/import",
    "/api/content/lessons",
    "/api/content/import",
    "/api/content/batches/publish",
    "/api/content/status",
    "/api/content/visual-assets/status",
    "/api/content/visual-assets/replace",
    "/api/content/visual-assets/promote-storage",
    "/api/visual-agent/generate",
    "/api/tutor/ask",
    "/api/tutor/feedback",
    "/api/tool-gateway/execute",
    "/api/agent-command-center/review"
  ];
  const legacySnapshotRoutes = [
    {
      route: "GET /api/state",
      purpose: "Bootstraps the legacy client snapshot until every view has its own focused read model.",
      replacement: "Role-scoped /api/bootstrap plus feature-specific read models. Production access is restricted to platform-admin maintenance."
    },
    {
      route: "PUT /api/state",
      purpose: "Persists optimistic local state after older UI actions.",
      replacement: "Feature-specific write routes with scoped repository write slices. Production access is restricted to platform-admin maintenance."
    },
    {
      route: "POST /api/state/reset",
      purpose: "Development reset of the entire prototype snapshot.",
      replacement: "Admin-only seed/reset tooling separated from student, parent, and teacher runtime flows; production access is restricted to platform-admin maintenance."
    }
  ];
  const nextSlices = [
    "Replace the remaining legacy state merge with bootstrap-provided role and learner identity summaries.",
    "Move remaining optimistic saveState calls behind feature-specific write acknowledgements.",
    "Remove student/parent/teacher dependence on broad local fallback once each dashboard has scoped read coverage.",
    "Keep /api/state only as an admin/dev backup export until production launch, then disable it outside development."
  ];
  const focusedRouteCount = focusedReadRoutes.length + focusedWriteRoutes.length;

  return {
    source: "static-route-audit",
    focusedReadRoutes,
    focusedWriteRoutes,
    legacySnapshotRoutes,
    nextSlices,
    summary: {
      focusedReadRoutes: focusedReadRoutes.length,
      focusedWriteRoutes: focusedWriteRoutes.length,
      focusedRouteCount,
      legacySnapshotRoutes: legacySnapshotRoutes.length,
      migrationCoveragePercent: Math.round((focusedRouteCount / (focusedRouteCount + legacySnapshotRoutes.length)) * 100),
      productionBlocker: true
    },
    releaseRule:
      "Production runtime should not depend on broad /api/state for student, parent, or teacher workflows. Keep replacing it with scoped read/write routes before launch."
  };
}

function auditStatus(complete, blocked = false) {
  if (complete) return "complete";
  if (blocked) return "blocked";
  return "in-progress";
}

export function getProductCompletenessAudit(state = createInitialState(), env = {}) {
  const viewContract = getViewContractSummary();
  const runtime = Array.isArray(env.checks) ? env : getRuntimeConfigurationStatus(env);
  const library = getLessonLibrarySummary();
  const batchPlan = getLessonProductionBatchPlan({ batchSize: 24, limit: 6 });
  const published = getPublishedLessonSummary(state);
  const authoring = getContentAuthoringSummary(state);
  const visuals = getVisualAssetSummary(state);
  const pilotQuality = getPilotQualityGateReport(state);
  const auth = getAuthSecuritySummary(state);
  const tutor = getTutorQualityDashboard(state);
  const agents = getAgentToolGatewaySummary(state);
  const migration = getMigrationReadiness();
  const dataModel = getProductionDataModelReadiness(state);
  const contentReviewQueue = (state.contentDrafts || []).filter((draft) => draft.status === "review" || draft.publicationBlocked).length;
  const corePilotReady = pilotQuality.scaleUnlocked && published.total >= 6 && published.withVisualSupports >= 6 && published.withQuiz >= 6;
  const durableRepository = ["postgres", "supabase-rest"].includes(runtime.repositoryMode);
  const databaseConfigured = runtime.databaseConnectionConfigured ?? runtime.databaseConfigured;
  const databaseBlocked = !databaseConfigured || !durableRepository;
  const liveDatabaseHealthy = runtime.databaseVerified === true || runtime.liveHealth?.healthy === true;
  const productionAuthReady = runtime.authProviderConfigured && runtime.authReadiness?.passed;
  const categories = [
    {
      id: "views",
      title: "14-view product surface",
      status: auditStatus(viewContract.passed),
      evidence: `${viewContract.totalViews}/14 views contracted with ${viewContract.roleViews} role home pages.`,
      nextStep: viewContract.passed ? "Keep renderer tests tied to this contract." : "Fix missing or duplicate view contract entries."
    },
    {
      id: "runtime",
      title: "Runtime configuration",
      status: auditStatus(runtime.ready && durableRepository, databaseBlocked),
      evidence: `Repository=${runtime.repositoryMode}; database=${databaseConfigured ? "configured" : "missing"}; OpenAI=${runtime.openAiImage.ready ? "ready" : "review-only"}.`,
      nextStep: databaseBlocked ? "Configure K12_REPOSITORY_MODE=postgres with DATABASE_URL or K12_REPOSITORY_MODE=supabase-rest with Supabase URL and secret, then verify the normalized repository." : "Keep production runtime checks visible in Setup/Admin."
    },
    {
      id: "auth",
      title: "Production identity and role claims",
      status: auditStatus(productionAuthReady),
      evidence: `${auth.accountCount} local accounts; ${auth.verifiedAccounts} verified; provider=${runtime.authReadiness?.provider || "not-configured"}.`,
      nextStep: productionAuthReady ? "Run role/claim integration tests against the provider." : "Connect Supabase Auth or another provider with verified role/session claims."
    },
    {
      id: "database",
      title: "Database migration and normalized repository",
      status: auditStatus(migration.passed && dataModel.passed && databaseConfigured && liveDatabaseHealthy, !databaseConfigured || (durableRepository && !liveDatabaseHealthy)),
      evidence: `${dataModel.schema.tableCount} tables modeled; migration ${migration.passed ? "ready" : "not ready"}; DB ${databaseConfigured ? "configured" : "missing"}; live probe ${liveDatabaseHealthy ? "passed" : "not verified"}.`,
      nextStep: !databaseConfigured
        ? "Configure a durable Postgres or Supabase REST repository before applying or verifying the migration."
        : liveDatabaseHealthy
          ? "Keep db:verify in deployment checks after every migration."
          : "Run npm run supabase:check, repair DATABASE_URL credentials, then apply and verify the migration."
    },
    {
      id: "pilot-lessons",
      title: "Polished pilot and showcase lessons",
      status: auditStatus(corePilotReady),
      evidence: `${pilotQuality.passedLessons}/${pilotQuality.totalLessons} pilots pass the B-or-better quality gate; ${published.total} published; ${published.withVisualSupports} visual-ready; ${published.withQuiz} quiz-ready.`,
      nextStep: corePilotReady ? "Use the pilot and showcase lessons as the quality bar for the next production batches." : "Do not scale yet. Fix every pilot lesson below B, then rerun the content, prompt, visual, tutor, quiz, and accessibility gates."
    },
    {
      id: "content-scale",
      title: "Full K-12 lesson production",
      status: auditStatus(corePilotReady && authoring.published >= library.generatedLessonCount, !corePilotReady),
      evidence: `${library.generatedLessonCount.toLocaleString()} blueprints across ${batchPlan.totalBatches} production batches; ${authoring.total} drafts; ${authoring.published} published; ${contentReviewQueue} in review; pilot scale gate=${pilotQuality.scaleUnlocked ? "open" : "blocked"}.`,
      nextStep: corePilotReady
        ? `Start with ${batchPlan.firstWaveBatchCount} Bridge Academy batches (${batchPlan.firstWaveLessonCount.toLocaleString()} lessons), then convert each batch into reviewed drafts, visuals, quizzes, and published records.`
        : "Pilot quality gate is blocking scale. Resolve every lesson below B before creating the next production batch."
    },
    {
      id: "visuals",
      title: "Images, diagrams, and visual review",
      status: auditStatus(visuals.approved >= published.total && runtime.openAiImage.ready),
      evidence: `${visuals.total} assets; ${visuals.approved} approved; OpenAI ${runtime.openAiImage.ready ? "configured" : "not configured"}.`,
      nextStep: runtime.openAiImage.ready ? "Generate reviewed image variants for next-wave drafts." : "Keep generated SVGs live and add OPENAI_API_KEY for staff-reviewed image generation."
    },
    {
      id: "tutor",
      title: "Tutor diagnosis and quality loop",
      status: auditStatus(tutor.totalInteractions > 0 && tutor.truthReviewed > 0 && runtime.openAiTutor?.ready === true),
      evidence: `${tutor.totalInteractions} interactions; ${tutor.truthReviewed} truth-reviewed; ${tutor.improvementSignalCount} improvement signals; provider=${runtime.openAiTutor?.ready ? "ready" : "local fallback"}.`,
      nextStep: runtime.openAiTutor?.ready
        ? "Keep provider responses behind moderation, quality review, and persisted feedback gates."
        : "Configure OPENAI_API_KEY and tutor limits, then verify the provider-backed path without bypassing the local tutor fallback."
    },
    {
      id: "agents",
      title: "Manager and specialist agents",
      status: auditStatus(agents.totalTools >= 9 && agents.reviewRequiredTools >= 1),
      evidence: `${agents.totalTools} managed tools; ${agents.reviewRequiredTools} review-gated external-risk tools.`,
      nextStep: "Continue moving source audit, visual generation, and tutor grading through logged gateway tools."
    },
    {
      id: "school-product",
      title: "School/classroom sellable workflow",
      status: auditStatus((state.classSections || []).length > 0 && (state.classSessions || []).length > 0 && (state.schoolReports || []).length > 0),
      evidence: `${(state.classSections || []).length} classes; ${(state.classSessions || []).length} class sessions; ${(state.schoolReports || []).length} school reports.`,
      nextStep: "Make teacher invitations, attendance, mission editing, exports, and reports fully database-backed."
    },
    {
      id: "rewards",
      title: "Mastery rewards and parent approval",
      status: auditStatus((state.rewardApprovals || []).length > 0),
      evidence: `${(state.rewardApprovals || []).length} reward approvals; ${(state.rewardRedemptions || []).length} redemptions.`,
      nextStep: "Keep gift-card fulfillment parent-controlled and provider-gated before moving real money."
    }
  ];
  const complete = categories.filter((item) => item.status === "complete").length;
  const blocked = categories.filter((item) => item.status === "blocked").length;
  const inProgress = categories.length - complete - blocked;
  return {
    complete,
    inProgress,
    blocked,
    total: categories.length,
    percent: Math.round((complete / categories.length) * 100),
    readyForSale: blocked === 0 && inProgress === 0,
    categories
  };
}

export function planOpenAiImageGeneration(input) {
  return createImageGenerationPlan(input);
}

export function getPipelineStats() {
  return {
    stages: contentPipeline.length,
    gates: contentPipeline.filter((stage) => stage.status === "Gate").length,
    active: contentPipeline.filter((stage) => stage.status === "Active").length
  };
}

export function mergePersistedState(localState, persistedState) {
  if (!persistedState) return localState;
  return {
    ...createInitialState(),
    ...localState,
    ...persistedState,
    persistence: {
      source: persistedState.persistence?.source || "server-repository",
      syncedAt: new Date().toLocaleString(),
      lastError: null
    }
  };
}

export function markPersistenceError(state, error) {
  return {
    ...state,
    persistence: {
      ...state.persistence,
      source: state.persistence?.source || "local-fallback",
      lastError: error?.message || String(error)
    }
  };
}

export function getRadicalLearningSummary() {
  return {
    principleCount: radicalLearningModel.principles.length,
    experimentSteps: radicalLearningModel.experimentLoop.length,
    rewardCount: radicalLearningModel.rewardSystem.length,
    metrics: radicalLearningModel.metrics
  };
}

export function getEvidenceGuidanceSummary() {
  const recommendationCount = evidenceGuidanceAudit.sources.reduce((sum, source) => sum + source.recommendations.length, 0);
  return {
    sourceCount: evidenceGuidanceAudit.sources.length,
    recommendationCount,
    requiredMoveCount: evidenceGuidanceAudit.requiredMathLessonMoves.length,
    implementationPhaseCount: evidenceGuidanceAudit.implementationCycle.length
  };
}

export function getLessonEvidenceAudit(lessonId, appState = null) {
  const lesson = appState ? findLessonInState(appState, lessonId) : findLesson(lessonId);
  return auditEvidenceMoves(lesson.subject, lesson.evidenceMoves || {}, lesson.id);
}

function auditEvidenceMoves(subject, evidenceMoves = {}, itemId = "draft") {
  const requiredMoves = subject === "math" ? evidenceGuidanceAudit.requiredMathLessonMoves : [];
  const missing = requiredMoves.filter((move) => {
    const value = evidenceMoves?.[move.key];
    return Array.isArray(value) ? value.length === 0 : !String(value || "").trim();
  });
  return {
    itemId,
    lessonId: itemId,
    subject,
    required: requiredMoves.length,
    present: requiredMoves.length - missing.length,
    missing,
    passed: missing.length === 0,
    requiredMoves,
    evidenceMoves
  };
}

export function getEvidenceImplementationPlan() {
  return evidenceGuidanceAudit.implementationCycle.map((phase, index) => ({
    ...phase,
    order: index + 1
  }));
}

export function getOnboardingStatus(state) {
  const learners = state.learners || [];
  const consent = getConsentReadiness(state);
  const placements = learners.filter((learner) => state.placementResults?.[learner.id]).length;
  const rewardReady = Boolean(state.rewardSettings?.enabled && state.rewardSettings.selectedCatalogIds?.length);
  const completed = [
    state.parentProfile?.emailVerified,
    learners.length > 0,
    consent.ready,
    placements === learners.length,
    rewardReady
  ].filter(Boolean).length;

  return {
    steps: parentOnboardingModel.requiredSteps.map((step, index) => ({
      ...step,
      complete: index < completed
    })),
    completed,
    total: parentOnboardingModel.requiredSteps.length,
    percent: Math.round((completed / parentOnboardingModel.requiredSteps.length) * 100)
  };
}

export function getLearnerAccess(state, learnerId) {
  const consent = state.consentRecords?.[learnerId];
  const placement = state.placementResults?.[learnerId];
  const blockedReasons = [];

  if (!state.parentProfile?.emailVerified) blockedReasons.push("Parent email is not verified.");
  if (!consent?.dataCollection || !consent?.portfolio) blockedReasons.push("Required parent consent is missing.");
  if (!placement) blockedReasons.push("Placement diagnostic is not complete.");
  if (consent && !consent.aiHelper) blockedReasons.push("AI tutor is disabled by parent control.");

  return {
    active: blockedReasons.length === 0,
    aiAllowed: Boolean(consent?.aiHelper),
    blockedReasons
  };
}

export function getConsentReadiness(state) {
  const missing = (state.learners || []).filter((learner) => {
    const consent = state.consentRecords?.[learner.id];
    return !consent?.dataCollection || !consent?.portfolio;
  });

  const aiRestricted = (state.learners || []).filter((learner) => !state.consentRecords?.[learner.id]?.aiHelper);

  return {
    ready: missing.length === 0,
    missing,
    aiRestricted,
    requiredFields: parentOnboardingModel.childDataMinimum,
    parentControls: parentOnboardingModel.parentControls
  };
}

export function getPlacementPlan(state) {
  return (state.learners || []).map((learner) => {
    const result = state.placementResults?.[learner.id];
    const diagnostic =
      diagnosticBlueprints.find((item) => item.id === result?.diagnosticId) ||
      diagnosticBlueprints.find((item) => item.academyId === learner.academyId) ||
      diagnosticBlueprints[0];

    return {
      learner,
      diagnostic,
      result: result || {
        recommendedStart: "Run diagnostic before assigning full path",
        confidence: 0,
        supportPlan: "No placement evidence yet."
      }
    };
  });
}

export function simulateDiagnosticPlacement(state, learnerId) {
  const learner = state.learners.find((item) => item.id === learnerId);
  if (!learner) return state;

  const diagnostic = diagnosticBlueprints.find((item) => item.academyId === learner.academyId) || diagnosticBlueprints[0];
  const confidence = learner.academyId === "foundation" ? 81 : learner.academyId === "bridge" ? 76 : 86;
  return {
    ...state,
    placementResults: {
      ...state.placementResults,
      [learnerId]: {
        diagnosticId: diagnostic.id,
        recommendedStart:
          learner.academyId === "foundation"
            ? "Concrete-to-abstract foundations with next-day recall"
            : learner.academyId === "bridge"
              ? "Course path with collaboration roles and planner support"
              : "Course path with portfolio evidence and internal progress records",
        confidence,
        supportPlan: diagnostic.recommendationRule
      }
    }
  };
}

export function getRewardPlan(state) {
  const selected = rewardCatalog.filter((reward) => state.rewardSettings?.selectedCatalogIds?.includes(reward.id));
  const approvals = state.rewardApprovals || [];
  return {
    selected,
    catalog: rewardCatalog,
    requireDelayedRecall: Boolean(state.rewardSettings?.requireDelayedRecall),
    familyBenefits: state.rewardSettings?.familyBenefits || [],
    approvalSummary: {
      pending: approvals.filter((approval) => approval.status === "pending").length,
      approved: approvals.filter((approval) => approval.status === "approved").length,
      redeemed: approvals.filter((approval) => approval.status === "redeemed").length,
      rejected: approvals.filter((approval) => approval.status === "rejected").length
    }
  };
}

const subjectLabels = {
  ela: "English / Reading",
  writing: "Writing",
  math: "Math",
  science: "Science",
  "social-studies": "Social Studies",
  "health-pe": "Health / PE",
  "arts-media": "Arts / Music",
  "computer-science": "Computer Science",
  "life-skills": "Life Skills",
  "career-college": "Career / College"
};

const subjectVisualSignals = {
  ela: "Detective boards, story maps, evidence cards",
  writing: "Organizer maps, revision ladders, mentor text callouts",
  math: "Manipulatives, number lines, models, worked examples",
  science: "Labeled diagrams, models, simulations, lab evidence",
  "social-studies": "Maps, timelines, source cards, civic scenarios",
  "health-pe": "Movement demos, habit trackers, safety diagrams",
  "arts-media": "Reference images, creative briefs, critique boards",
  "computer-science": "Flowcharts, block models, debugging traces",
  "life-skills": "Scenario cards, reflection prompts, decision maps",
  "career-college": "Portfolio maps, pathway boards, planning templates"
};

const rewardMilestones = [
  {
    level: 1,
    title: "First mission badge",
    benefit: "Claim a visible badge after the first real lesson action, then keep building toward family rewards.",
    requiresParentApproval: false
  },
  {
    level: 2,
    title: "Avatar color pack",
    benefit: "Unlock a new student dashboard color theme after a mastery check.",
    requiresParentApproval: false
  },
  {
    level: 3,
    title: "Lab theme unlock",
    benefit: "Choose the visual theme for the next experiment or project.",
    requiresParentApproval: false
  },
  {
    level: 5,
    title: "Parent-approved $10 reward",
    benefit: "Eligible for a parent-approved gift card or family benefit after delayed recall evidence.",
    requiresParentApproval: true
  },
  {
    level: 8,
    title: "Project choice pass",
    benefit: "Choose from approved project formats for the next unit challenge.",
    requiresParentApproval: true
  },
  {
    level: 12,
    title: "Capstone showcase",
    benefit: "Unlock a portfolio showcase slot for a finished project and reflection.",
    requiresParentApproval: true
  }
];

function normalizeXp(value) {
  return Math.max(0, Math.round(Number(value) || 0));
}

function buildLevelProgress(totalXp, xpPerLevel = 500) {
  const normalizedXp = normalizeXp(totalXp);
  const level = Math.floor(normalizedXp / xpPerLevel) + 1;
  const currentLevelXp = normalizedXp % xpPerLevel;
  return {
    totalXp: normalizedXp,
    level,
    currentLevelXp,
    nextLevelXp: xpPerLevel,
    xpToNextLevel: xpPerLevel - currentLevelXp,
    progressPercent: Math.min(100, Math.round((currentLevelXp / xpPerLevel) * 100))
  };
}

function getLearnerById(state = {}, learnerId = "") {
  return (state.learners || []).find((learner) => learner.id === learnerId) || (state.learners || [])[0] || null;
}

function lessonsForLearner(state = {}, learner = {}) {
  return getLessonCatalog(state).filter(
    (lesson) => lesson.academyId === learner.academyId || String(lesson.grade) === String(learner.grade)
  );
}

function xpForEvent(state = {}, event = {}) {
  const lesson = event.lessonId ? findLessonInState(state, event.lessonId) : null;
  const baseXp = Number(lesson?.xp || 100);
  if (event.type === "lesson_started") return 10;
  if (event.type === "affect_checkin_submitted") return 15;
  if (event.type === "scratchpad_tutor_reviewed") return event.value?.diagnosisReady ? 50 : 35;
  if (event.type === "tutor_hint_retry_submitted") return event.value?.usedDiagnosis ? 45 : 25;
  if (event.type === "interactive_widget_attempted") return event.value?.correct ? 30 : 12;
  if (event.type === "phase_completed") return 8;
  if (event.type === "group_artifact_submitted") return 45;
  if (event.type === "teacher_intervention_recorded") return 10;
  if (event.type === "quiz_completed") {
    const score = Number(event.value?.score || 0);
    return event.value?.passed ? baseXp + Math.round(score * 0.2) : Math.max(25, Math.round(baseXp * 0.25));
  }
  if (event.type === "tutor_helped") return 30;
  return 10;
}

function tutorReflectionXpForLog(log = {}) {
  if (log.flagged || log.type === "safety") return 0;
  if (log.type === "blocked-answer") return 5;
  let xp = 20;
  if (log.stuckPointCategoryId || log.stuckPointLabel) xp += 12;
  if (Array.isArray(log.hintPath) && log.hintPath.length >= 2) xp += 12;
  if (log.nextQuestion || log.nextStep) xp += 6;
  if (log.studentFeedback === "helped") xp += 10;
  if (log.studentFeedback && log.studentFeedback !== "helped") xp += 4;
  return normalizeXp(Math.min(65, xp));
}

export function getTutorReflectionEvidence(state = {}, learnerId = "", lessonId = "") {
  const logs = (state.aiLogs || [])
    .filter((log) => !learnerId || log.learnerId === learnerId || log.studentId === learnerId)
    .filter((log) => !lessonId || log.lessonId === lessonId)
    .map((log) => ({
      id: log.id,
      learnerId: log.learnerId || log.studentId || "",
      lessonId: log.lessonId || "",
      lessonTitle: log.lessonTitle || log.lessonId || "Tutor event",
      categoryId: log.stuckPointCategoryId || "",
      label: log.stuckPointLabel || "",
      hintPath: Array.isArray(log.hintPath) ? log.hintPath : [],
      nextQuestion: log.nextQuestion || log.nextStep || "",
      helped: log.helped,
      studentFeedback: log.studentFeedback || "",
      xp: tutorReflectionXpForLog(log),
      timestamp: log.timestamp || "",
      qualifiesForRewardEvidence: Boolean(!log.flagged && log.type !== "blocked-answer" && (log.stuckPointCategoryId || log.stuckPointLabel))
    }))
    .sort((left, right) => new Date(right.timestamp || 0).getTime() - new Date(left.timestamp || 0).getTime());

  const qualified = logs.filter((log) => log.qualifiesForRewardEvidence);
  return {
    total: logs.length,
    qualified: qualified.length,
    totalXp: normalizeXp(logs.reduce((sum, log) => sum + log.xp, 0)),
    latest: logs[0] || null,
    latestQualified: qualified[0] || null,
    logs
  };
}

function masteryXpForLesson(state = {}, lesson = {}, learnerEvents = []) {
  if (learnerEvents.some((event) => event.lessonId === lesson.id && event.type === "quiz_completed")) return 0;
  const mastery = state.mastery?.[lesson.id];
  if (!mastery?.score) return 0;
  return Math.round(Number(lesson.xp || 100) * (Number(mastery.score) / 100));
}

function rewardForLevel(level = 1) {
  return rewardMilestones.find((reward) => reward.level > level) || rewardMilestones[rewardMilestones.length - 1];
}

function latestMasteryEvidence(state = {}, learnerId = "") {
  const learner = getLearnerById(state, learnerId);
  const lessons = learner ? lessonsForLearner(state, learner) : [];
  const lessonIds = new Set(lessons.map((lesson) => lesson.id));
  const quizEvents = (state.learningEvents || []).filter(
    (event) => event.learnerId === learnerId && event.type === "quiz_completed" && lessonIds.has(event.lessonId)
  );
  const bestQuizEvent = quizEvents.sort((left, right) => Number(right.value?.score || 0) - Number(left.value?.score || 0))[0];
  if (bestQuizEvent) {
    const lesson = findLessonInState(state, bestQuizEvent.lessonId);
    return {
      type: "quiz",
      lessonId: lesson?.id || bestQuizEvent.lessonId,
      lessonTitle: lesson?.title || "Recent lesson",
      score: Number(bestQuizEvent.value?.score || 0),
      source: bestQuizEvent.value?.passed ? "Mastery quiz passed" : "Quiz attempt needs review"
    };
  }

  const benefit = (state.masteryBenefits || []).find((item) => item.learnerId === learnerId);
  if (benefit) {
    return {
      type: "benefit",
      lessonId: benefit.lessonId || "",
      lessonTitle: benefit.title || "Mastery benefit",
      score: 100,
      source: benefit.source || "Mastery benefit"
    };
  }

  return {
    type: "profile",
    lessonId: "",
    lessonTitle: "Learning profile",
    score: 0,
    source: "Level progress and parent review"
  };
}

export function getRewardApprovalQueue(state = {}, learnerId = "") {
  const approvals = state.rewardApprovals || [];
  const ordered = [...approvals].sort(
    (left, right) =>
      new Date(right.reviewedAt || right.requestedAt || 0).getTime() - new Date(left.reviewedAt || left.requestedAt || 0).getTime()
  );
  return learnerId ? ordered.filter((approval) => approval.learnerId === learnerId) : ordered;
}

export function requestRewardApproval(state = {}, input = {}) {
  const learnerId = String(input.learnerId || "").trim();
  const learner = getLearnerById(state, learnerId);
  if (!learner) {
    return {
      state,
      result: {
        accepted: false,
        reason: "Reward request needs a valid learner."
      }
    };
  }

  const profile = getLearnerLevelProfile(state, learner.id);
  const requestedLevel = Number(input.rewardLevel || input.level || profile.level);
  const reward =
    rewardMilestones
      .filter((item) => item.level <= profile.level)
      .sort((left, right) => right.level - left.level)
      .find((item) => !requestedLevel || item.level === requestedLevel) ||
    profile.unlockedRewards[profile.unlockedRewards.length - 1] ||
    rewardMilestones[0];
  const existingPending = (state.rewardApprovals || []).find(
    (approval) => approval.learnerId === learner.id && approval.rewardLevel === reward.level && approval.status === "pending"
  );

  if (!reward || reward.level > profile.level) {
    return {
      state,
      result: {
        accepted: false,
        reason: "That reward is not unlocked yet. Finish more mastery, tutor reflection, projects, or recall checks first."
      }
    };
  }

  if (existingPending) {
    return {
      state,
      result: {
        accepted: true,
        duplicate: true,
        request: existingPending,
        summary: `${learner.name} already has a pending request for ${existingPending.rewardTitle}.`
      }
    };
  }

  const evidence = latestMasteryEvidence(state, learner.id);
  const request = {
    id: `reward-${learner.id}-${reward.level}-${Date.now()}`,
    learnerId: learner.id,
    learnerName: learner.name,
    rewardLevel: reward.level,
    rewardTitle: String(input.rewardTitle || reward.title),
    rewardBenefit: String(input.rewardBenefit || reward.benefit),
    requiresParentApproval: Boolean(reward.requiresParentApproval),
    status: reward.requiresParentApproval ? "pending" : "approved",
    requestedBy: input.requestedBy || learner.name,
    requestedAt: new Date().toISOString(),
    reviewedBy: reward.requiresParentApproval ? "" : "system",
    reviewedAt: reward.requiresParentApproval ? "" : new Date().toISOString(),
    note: String(input.note || ""),
    evidence,
    source: input.source || "student-level-dashboard"
  };

  return {
    state: {
      ...state,
      rewardApprovals: [request, ...(state.rewardApprovals || [])].slice(0, 80)
    },
    result: {
      accepted: true,
      request,
      summary: reward.requiresParentApproval
        ? `${learner.name} requested ${request.rewardTitle}. Parent approval is required before redemption.`
        : `${learner.name} unlocked ${request.rewardTitle}.`
    }
  };
}

export function updateRewardApprovalStatus(state = {}, input = {}) {
  const requestId = String(input.requestId || "").trim();
  const status = String(input.status || "approved").trim().toLowerCase();
  const allowedStatuses = ["approved", "rejected", "redeemed"];
  if (!allowedStatuses.includes(status)) {
    return {
      state,
      result: {
        accepted: false,
        reason: "Reward decision must be approved, rejected, or redeemed."
      }
    };
  }

  const request = (state.rewardApprovals || []).find((approval) => approval.id === requestId);
  if (!request) {
    return {
      state,
      result: {
        accepted: false,
        reason: "Reward request was not found."
      }
    };
  }

  const reviewedAt = new Date().toISOString();
  const reviewed = {
    ...request,
    status,
    reviewedBy: String(input.reviewedBy || "Parent"),
    reviewedAt,
    parentNote: String(input.note || request.parentNote || "")
  };
  const nextState = {
    ...state,
    rewardApprovals: (state.rewardApprovals || []).map((approval) => (approval.id === requestId ? reviewed : approval))
  };

  const withBenefit =
    status === "redeemed"
      ? {
          ...nextState,
          masteryBenefits: [
            {
              id: `benefit-${request.learnerId}-${Date.now()}`,
              learnerId: request.learnerId,
              lessonId: request.evidence?.lessonId || "",
              type: "parent_approved_reward",
              title: request.rewardTitle,
              unlockedAt: reviewedAt,
              source: request.evidence?.source || "Parent-approved reward redemption"
            },
            ...(nextState.masteryBenefits || [])
          ].slice(0, 80),
          learningEvents: [
            {
              id: `event-${Date.now()}-${(nextState.learningEvents || []).length + 1}`,
              learnerId: request.learnerId,
              lessonId: request.evidence?.lessonId || "",
              type: "reward_redeemed",
              value: {
                rewardTitle: request.rewardTitle,
                rewardLevel: request.rewardLevel
              },
              occurredAt: new Date().toLocaleString()
            },
            ...(nextState.learningEvents || [])
          ].slice(0, 50)
        }
      : nextState;

  return {
    state: withBenefit,
    result: {
      accepted: true,
      request: reviewed,
      summary:
        status === "redeemed"
          ? `${request.rewardTitle} was redeemed and logged as a mastery benefit.`
          : `${request.rewardTitle} was ${status}.`
    }
  };
}

export function recordRewardFulfillmentResult(state = {}, input = {}) {
  const requestId = String(input.requestId || "").trim();
  const request = (state.rewardApprovals || []).find((approval) => approval.id === requestId);
  if (!request) {
    return {
      state,
      result: {
        accepted: false,
        reason: "Reward request was not found."
      }
    };
  }

  const fulfilledAt = new Date().toISOString();
  const success = Boolean(input.fulfilled);
  const fulfillment = {
    provider: input.provider || "manual",
    status: success ? (input.deliveryStatus || "fulfilled") : "failed",
    amountCents: Number(input.amountCents || 0),
    currencyCode: input.currencyCode || "USD",
    recipientEmail: input.recipientEmail || "",
    recipientName: input.recipientName || "",
    providerReference: input.providerReference || "",
    manualReview: Boolean(input.manualReview),
    requestedBy: input.requestedBy || "Parent",
    requestedAt: fulfilledAt,
    completedAt: success ? fulfilledAt : "",
    error: success ? "" : String(input.error || "Gift-card fulfillment failed.")
  };
  const nextRequest = {
    ...request,
    status: success ? "redeemed" : "approved",
    fulfillment,
    reviewedBy: input.reviewedBy || request.reviewedBy || "Parent",
    reviewedAt: success ? fulfilledAt : request.reviewedAt || fulfilledAt,
    parentNote: input.note || request.parentNote || ""
  };
  const nextState = {
    ...state,
    rewardApprovals: (state.rewardApprovals || []).map((approval) => (approval.id === requestId ? nextRequest : approval))
  };

  const withBenefit =
    success
      ? {
          ...nextState,
          masteryBenefits: [
            {
              id: `benefit-${request.learnerId}-${Date.now()}`,
              learnerId: request.learnerId,
              lessonId: request.evidence?.lessonId || "",
              type: "gift_card_reward",
              title: request.rewardTitle,
              unlockedAt: fulfilledAt,
              source: `Gift-card fulfillment via ${fulfillment.provider}`
            },
            ...(nextState.masteryBenefits || [])
          ].slice(0, 80),
          learningEvents: [
            {
              id: `event-${Date.now()}-${(nextState.learningEvents || []).length + 1}`,
              learnerId: request.learnerId,
              lessonId: request.evidence?.lessonId || "",
              type: "gift_card_fulfilled",
              value: {
                rewardTitle: request.rewardTitle,
                rewardLevel: request.rewardLevel,
                provider: fulfillment.provider,
                amountCents: fulfillment.amountCents,
                currencyCode: fulfillment.currencyCode
              },
              occurredAt: new Date().toLocaleString()
            },
            ...(nextState.learningEvents || [])
          ].slice(0, 50)
        }
      : nextState;

  return {
    state: withBenefit,
    result: {
      accepted: success,
      request: nextRequest,
      fulfillment,
      summary: success
        ? `${request.rewardTitle} was fulfilled and logged as a mastery benefit.`
        : `Gift-card fulfillment failed: ${fulfillment.error}`
    }
  };
}

export function getLearnerLevelProfile(state = {}, learnerId = "") {
  const learner = getLearnerById(state, learnerId);
  if (!learner) {
    return {
      learnerId: "",
      learnerName: "",
      grade: "",
      academyId: "",
      totalXp: 0,
      level: 1,
      currentLevelXp: 0,
      nextLevelXp: 500,
      xpToNextLevel: 500,
      progressPercent: 0,
      nextReward: rewardMilestones[0],
      unlockedRewards: [],
      xpSources: { lessons: 0, tutor: 0, experiments: 0, benefits: 0 }
    };
  }

  const learnerEvents = (state.learningEvents || []).filter((event) => event.learnerId === learner.id);
  const eventXp = learnerEvents.reduce((sum, event) => sum + xpForEvent(state, event), 0);
  const masteryXp = lessonsForLearner(state, learner).reduce((sum, lesson) => sum + masteryXpForLesson(state, lesson, learnerEvents), 0);
  const tutorEvidence = getTutorReflectionEvidence(state, learner.id);
  const tutorXp = tutorEvidence.totalXp;
  const experimentXp = (state.experimentRuns || []).filter((run) => run.learnerId === learner.id).length * 45;
  const benefitXp = (state.masteryBenefits || []).filter((benefit) => benefit.learnerId === learner.id).length * 80;
  const profile = buildLevelProgress(eventXp + masteryXp + tutorXp + experimentXp + benefitXp);

  return {
    learnerId: learner.id,
    learnerName: learner.name,
    grade: learner.grade,
    academyId: learner.academyId,
    ...profile,
    nextReward: rewardForLevel(profile.level),
    unlockedRewards: rewardMilestones.filter((reward) => reward.level <= profile.level),
    xpSources: {
      lessons: normalizeXp(eventXp + masteryXp),
      tutor: normalizeXp(tutorXp),
      experiments: normalizeXp(experimentXp),
      benefits: normalizeXp(benefitXp)
    },
    tutorEvidence: {
      total: tutorEvidence.total,
      qualified: tutorEvidence.qualified,
      latestLabel: tutorEvidence.latestQualified?.label || tutorEvidence.latest?.label || "",
      latestNextQuestion: tutorEvidence.latestQualified?.nextQuestion || tutorEvidence.latest?.nextQuestion || ""
    },
    rewardRule: "Parent-approved rewards unlock from mastery, transfer, tutor reflection, projects, experiments, or delayed recall evidence."
  };
}

function engagementDateKey(value, fallback = "") {
  const parsed = value instanceof Date ? value : new Date(value || "");
  if (Number.isNaN(parsed.getTime())) return fallback;
  return parsed.toISOString().slice(0, 10);
}

function engagementEventDate(event = {}) {
  return event.occurredAt || event.createdAt || event.timestamp || "";
}

/**
 * Converts learning evidence into a small daily game loop. The rewards are
 * attached to learning actions, not time spent or repeated clicking.
 */
export function getStudentEngagementProfile(state = {}, learnerId = "", now = new Date()) {
  const learner = getLearnerById(state, learnerId);
  if (!learner) {
    return {
      learnerId: "",
      dateKey: engagementDateKey(now),
      streak: 0,
      todayXp: 0,
      combo: 0,
      missions: [],
      completedMissions: 0,
      totalMissions: 0,
      celebration: "Choose a learner to begin a mission."
    };
  }

  const dateKey = engagementDateKey(now);
  const events = (state.learningEvents || []).filter((event) => event.learnerId === learner.id);
  const todayEvents = events.filter((event) => engagementDateKey(engagementEventDate(event)) === dateKey);
  const levelProfile = getLearnerLevelProfile(state, learner.id);
  const hasToday = (type, predicate = () => true) => todayEvents.some((event) => event.type === type && predicate(event));
  const lessons = lessonsForLearner(state, learner);
  const nextLesson = lessons.find((lesson) => Number(state.mastery?.[lesson.id]?.score || 0) < Number(lesson.masteryThreshold || 80)) || lessons[0] || null;
  const lessonId = nextLesson?.id || state.selectedLessonId || "";
  const missionDefinitions = [
    {
      id: "launch",
      icon: "01",
      title: "Open the portal",
      description: "Start one lesson and discover today’s question.",
      xp: 10,
      done: hasToday("lesson_started"),
      actionLabel: "Enter lesson",
      action: "lesson",
      lessonId
    },
    {
      id: "model",
      icon: "02",
      title: "Build a model",
      description: "Try the interactive board, sorter, or lab widget.",
      xp: 30,
      done: hasToday("interactive_widget_attempted", (event) => Boolean(event.value?.correct)),
      actionLabel: "Try the widget",
      action: "lesson",
      lessonId
    },
    {
      id: "tutor",
      icon: "03",
      title: "Name the stuck point",
      description: "Tell the tutor exactly what is confusing, then use one hint.",
      xp: 50,
      done: hasToday("scratchpad_tutor_reviewed", (event) => Boolean(event.value?.diagnosisReady)),
      actionLabel: "Ask tutor",
      action: "ai",
      lessonId
    },
    {
      id: "prove",
      icon: "04",
      title: "Prove your thinking",
      description: "Finish a checkpoint and read the reasoning behind your result.",
      xp: 100,
      done: hasToday("quiz_completed", (event) => Boolean(event.value?.passed)),
      actionLabel: "Take checkpoint",
      action: "lesson",
      lessonId
    }
  ];
  const completedMissions = missionDefinitions.filter((mission) => mission.done).length;
  const todayXp = todayEvents.reduce((sum, event) => sum + xpForEvent(state, event), 0);
  const activeDates = new Set(
    events.map((event) => engagementDateKey(engagementEventDate(event))).filter(Boolean)
  );
  let streak = 0;
  const cursor = new Date(now);
  while (activeDates.has(engagementDateKey(cursor))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  const combo = Math.min(4, completedMissions);
  const celebration = completedMissions === missionDefinitions.length
    ? "Full mission clear. Your brain has evidence, not just activity."
    : completedMissions > 0
      ? `${completedMissions} mission${completedMissions === 1 ? "" : "s"} cleared. Keep the combo alive.`
      : "Your first mission is waiting. Start small, then build momentum.";

  return {
    learnerId: learner.id,
    dateKey,
    streak,
    todayXp: normalizeXp(todayXp),
    combo,
    missions: missionDefinitions,
    completedMissions,
    totalMissions: missionDefinitions.length,
    celebration,
    nextMission: missionDefinitions.find((mission) => !mission.done) || null,
    rewardTrack: {
      level: levelProfile.level,
      totalXp: levelProfile.totalXp,
      progressPercent: levelProfile.progressPercent,
      xpToNextLevel: levelProfile.xpToNextLevel,
      nextReward: levelProfile.nextReward,
      unlockedCount: levelProfile.unlockedRewards.length
    }
  };
}

export function recordStudentEngagementAction(state = {}, { learnerId = "", lessonId = "", type = "", value = {} } = {}) {
  const allowedTypes = new Set(["lesson_started", "affect_checkin_submitted", "interactive_widget_attempted", "phase_completed"]);
  if (!learnerId || !allowedTypes.has(type)) return state;
  const today = engagementDateKey(new Date());
  const duplicate = (state.learningEvents || []).some(
    (event) =>
      event.learnerId === learnerId &&
      event.lessonId === lessonId &&
      event.type === type &&
      (type !== "phase_completed" || event.value?.phase === value?.phase) &&
      engagementDateKey(engagementEventDate(event)) === today
  );
  return duplicate ? state : logLearningEvent(state, { learnerId, lessonId, type, value });
}

function nexusLessonForProgress(lesson = {}) {
  return lesson.schemaVersion === "3" ? lesson : adaptV2LessonToNexusV3(lesson);
}

function phaseEvidenceReady(state = {}, learnerId = "", lessonId = "", phase = "", evidence = {}) {
  const scratchpad = evidence.scratchpad || getLessonScratchpad(state, learnerId, lessonId);
  if (phase === "practice") {
    const interactive = evidence.interactiveResponse || Object.values(state.interactiveResponses?.[learnerId]?.[lessonId] || {})[0] || null;
    return Boolean(interactive?.value || scratchpad.firstStep);
  }
  if (phase === "reason") return Boolean(scratchpad.explanation || scratchpad.confusion);
  if (phase === "prove") return Boolean(evidence.quizResult || state.quizResults?.[lessonId] || (state.learningEvents || []).some((event) => event.learnerId === learnerId && event.lessonId === lessonId && event.type === "quiz_completed"));
  if (phase === "remember") return Boolean(scratchpad.recallResponse);
  if (phase === "transfer") return Boolean(scratchpad.transferResponse);
  return true;
}

export function getNexusPhaseProgress(state = {}, learnerId = "", lessonId = "", options = {}) {
  const lesson = findLessonInState(state, lessonId || state.selectedLessonId);
  const nexusLesson = nexusLessonForProgress(lesson);
  const modules = getRenderableNexusPhaseModules(nexusLesson);
  const completed = new Set([
    ...(options.completedPhases || []),
    ...(state.learningEvents || [])
      .filter((event) => event.learnerId === learnerId && event.lessonId === lesson.id && event.type === "phase_completed")
      .map((event) => event.value?.phase)
      .filter(Boolean)
  ]);
  const phases = modules.map((module, index) => {
    const done = completed.has(module.phase);
    const previousDone = modules.slice(0, index).every((item) => completed.has(item.phase));
    const evidenceReady = phaseEvidenceReady(state, learnerId, lesson.id, module.phase, options);
    const ready = !done && previousDone && evidenceReady;
    const reason = done
      ? "Evidence already recorded."
      : !previousDone
        ? `Finish ${modules.find((item, previousIndex) => previousIndex < index && !completed.has(item.phase))?.phase || "the previous phase"} first.`
        : !evidenceReady
          ? module.phase === "practice"
            ? "Try the interactive model or write your first step before clearing practice."
            : module.phase === "reason"
              ? "Write your reasoning or exact confusion before clearing this phase."
            : module.phase === "prove"
              ? "Submit the checkpoint before clearing the prove phase."
              : module.phase === "remember"
                ? "Write what you can recall without looking before clearing this phase."
                : module.phase === "transfer"
                  ? "Explain how the idea works in a new situation before clearing this phase."
                  : "Complete the evidence task before clearing this phase."
          : "Ready for your next move.";
    return { phase: module.phase, index, done, ready, locked: !done && !ready, reason };
  });
  return {
    lessonId: lesson.id,
    activePhases: modules.map((module) => module.phase),
    completedPhases: phases.filter((phase) => phase.done).map((phase) => phase.phase),
    nextPhase: phases.find((phase) => phase.ready)?.phase || null,
    phases
  };
}

export function completeNexusPhase(state = {}, { learnerId = "", lessonId = "", phase = "", scratchpad = null } = {}) {
  const progress = getNexusPhaseProgress(state, learnerId, lessonId, { scratchpad });
  const target = progress.phases.find((item) => item.phase === phase);
  if (!target) {
    return { state, result: { accepted: false, reason: "That phase is not active in this lesson." } };
  }
  if (target.done) {
    return { state, result: { accepted: false, reason: "That phase has already been cleared." } };
  }
  if (!target.ready) {
    return { state, result: { accepted: false, reason: target.reason, nextPhase: progress.nextPhase } };
  }
  const nextState = recordStudentEngagementAction(state, {
    learnerId,
    lessonId: progress.lessonId,
    type: "phase_completed",
    value: { phase, source: "nexus-phase-player" }
  });
  return {
    state: nextState,
    result: {
      accepted: true,
      phase,
      nextPhase: getNexusPhaseProgress(nextState, learnerId, progress.lessonId).nextPhase,
      summary: `${phase} phase cleared. Continue to the next evidence move.`
    }
  };
}

function learnerCourseSubjects(learner = {}) {
  const academy = findAcademy(learner.academyId);
  const grade = academy.grades.find((item) => String(item.grade) === String(learner.grade)) || academy.grades[0];
  return (grade?.courses || []).map((course) => ({
    subject: course.subject,
    title: subjectLabels[course.subject] || course.title,
    courseTitle: course.title,
    firstUnit: course.units?.[0]?.title || "Diagnostic start"
  }));
}

export function getLearnerSubjectProgress(state = {}, learnerId = "") {
  const learner = getLearnerById(state, learnerId);
  if (!learner) return [];

  const learnerEvents = (state.learningEvents || []).filter((event) => event.learnerId === learner.id);
  const catalog = lessonsForLearner(state, learner);
  const subjects = learnerCourseSubjects(learner);
  const seen = new Set();

  return subjects
    .filter((course) => {
      if (seen.has(course.subject)) return false;
      seen.add(course.subject);
      return true;
    })
    .map((course) => {
      const lessons = catalog.filter((lesson) => lesson.subject === course.subject);
      const lessonIds = new Set(lessons.map((lesson) => lesson.id));
      const subjectEvents = learnerEvents.filter((event) => lessonIds.has(event.lessonId));
      const eventXp = subjectEvents.reduce((sum, event) => sum + xpForEvent(state, event), 0);
      const masteryXp = lessons.reduce((sum, lesson) => sum + masteryXpForLesson(state, lesson, subjectEvents), 0);
      const tutorSubjectXp = getTutorReflectionEvidence(state, learner.id).logs
        .filter((log) => lessonIds.has(log.lessonId))
        .reduce((sum, log) => sum + log.xp, 0);
      const subjectXp = eventXp + masteryXp + tutorSubjectXp;
      const levelProgress = buildLevelProgress(subjectXp, 150);
      const masteryScores = lessons.map((lesson) => Number(state.mastery?.[lesson.id]?.score || 0));
      const masteryAverage = masteryScores.length
        ? Math.round(masteryScores.reduce((sum, score) => sum + score, 0) / masteryScores.length)
        : 0;
      const nextLesson =
        lessons.find((lesson) => Number(state.mastery?.[lesson.id]?.score || 0) < Number(lesson.masteryThreshold || 80)) || lessons[0] || null;
      const visualSupportCount = lessons.reduce(
        (sum, lesson) => sum + (lesson.visual ? 1 : 0) + (lesson.teachingSupport?.diagramCallouts?.length || 0),
        0
      );
      const commonMisunderstanding = nextLesson?.teachingSupport?.commonMisunderstandings?.[0]?.mistake || "Needs diagnostic evidence.";

      return {
        subject: course.subject,
        label: course.title,
        courseTitle: course.courseTitle,
        firstUnit: course.firstUnit,
        subjectXp: normalizeXp(subjectXp),
        tutorXp: normalizeXp(tutorSubjectXp),
        level: levelProgress.level,
        currentLevelXp: levelProgress.currentLevelXp,
        nextLevelXp: levelProgress.nextLevelXp,
        progressPercent: levelProgress.progressPercent,
        masteryAverage,
        completedLessons: subjectEvents.filter((event) => event.type === "quiz_completed" && event.value?.passed).length,
        plannedLessons: lessons.length || 1,
        nextLessonId: nextLesson?.id || "",
        nextLessonTitle: nextLesson?.title || `${course.firstUnit} starter`,
        visualSignal: subjectVisualSignals[course.subject] || "Visual models and examples",
        visualSupportCount,
        commonMisunderstanding,
        status:
          masteryAverage >= 85
            ? "Excelling"
            : masteryAverage > 0 && masteryAverage < 70
              ? "Needs reteach"
              : masteryAverage > 0
                ? "Building"
                : "Ready to start"
      };
    });
}

export function getHouseholdLearnerInsights(state = {}, options = {}) {
  return scopedLearners(state, options.learnerIds, options).map((learner) => {
    const levelProfile = getLearnerLevelProfile(state, learner.id);
    const subjects = getLearnerSubjectProgress(state, learner.id);
    const scratchpads = Object.values(state.lessonScratchpads?.[learner.id] || {}).sort(
      (left, right) => new Date(right.updatedAt || 0).getTime() - new Date(left.updatedAt || 0).getTime()
    );
    const latestScratchpad = scratchpads[0] || null;
    const sortedByMastery = [...subjects].sort((left, right) => right.masteryAverage - left.masteryAverage);
    const strongest = sortedByMastery.find((subject) => subject.masteryAverage > 0) || sortedByMastery[0];
    const weakest =
      [...subjects]
        .filter((subject) => subject.masteryAverage > 0)
        .sort((left, right) => left.masteryAverage - right.masteryAverage)[0] || subjects[0];
    const childAccount = (state.localAccounts || []).find((account) => account.role === "student" && account.studentId === learner.id);
    const tutorEvidence = getTutorReflectionEvidence(state, learner.id);
    const interactiveEvidence = getLearnerInteractiveSkillEvidence(state, learner.id);
    const latestInteractiveSkill = interactiveEvidence.signals[0] || null;

    return {
      learner,
      childAccount: childAccount
        ? {
            username: childAccount.username || "",
            email: childAccount.email || "",
            status: childAccount.status || "active",
            lastSignedInAt: childAccount.lastSignedInAt || ""
          }
        : null,
      levelProfile,
      subjects,
      strengths: strongest ? [`${strongest.label}: ${strongest.status} (${strongest.masteryAverage}% mastery)`] : ["Run the first diagnostic to find strengths."],
      struggles: weakest ? [`${weakest.label}: ${weakest.commonMisunderstanding}`] : ["No struggle evidence yet."],
      suggestedLesson: weakest?.nextLessonTitle || "Run diagnostic placement",
      suggestedLessonId: weakest?.nextLessonId || "",
      latestScratchpad: latestScratchpad
        ? {
            lessonId: latestScratchpad.lessonId,
            firstStep: latestScratchpad.firstStep || "",
            explanation: latestScratchpad.explanation || "",
            confusion: latestScratchpad.confusion || "",
            updatedAt: latestScratchpad.updatedAt || "",
            tutorReviewCount: latestScratchpad.tutorReviewCount || 0
          }
        : null,
      latestTutorReflection: tutorEvidence.latestQualified || tutorEvidence.latest || null,
      tutorReflectionSummary: {
        total: tutorEvidence.total,
        qualified: tutorEvidence.qualified,
        totalXp: tutorEvidence.totalXp
      },
      latestInteractiveSkill,
      interactiveSkillSignals: interactiveEvidence.signals.slice(0, 5),
      interactiveSkillSummary: {
        total: interactiveEvidence.total,
        secure: interactiveEvidence.secure,
        needsSupport: interactiveEvidence.needsSupport
      },
      suggestedTutorPrompt: weakest
        ? `Ask the tutor: I am stuck on ${weakest.commonMisunderstanding.toLowerCase()}`
        : "Ask the tutor to diagnose the exact stuck point before giving hints.",
      rewardRequests: getRewardApprovalQueue(state, learner.id).slice(0, 5)
    };
  });
}

export function addFamilyBenefit(state, benefit) {
  const cleanBenefit = benefit.trim();
  if (!cleanBenefit) return state;
  const existing = state.rewardSettings?.familyBenefits || [];
  return {
    ...state,
    rewardSettings: {
      ...state.rewardSettings,
      familyBenefits: [...new Set([cleanBenefit, ...existing])].slice(0, 8)
    }
  };
}

export function logLearningEvent(state, event) {
  const entry = {
    id: `event-${Date.now()}-${(state.learningEvents || []).length + 1}`,
    learnerId: event.learnerId,
    lessonId: event.lessonId,
    type: event.type,
    value: event.value || {},
    occurredAt: new Date().toLocaleString()
  };

  return {
    ...state,
    learningEvents: [entry, ...(state.learningEvents || [])].slice(0, 50)
  };
}

export function getRecallInterval(score) {
  if (score < 70) {
    return { intervalDays: 1, nextRecall: "Reteach within 1 day", label: "Reteach" };
  }
  if (score < 85) {
    return { intervalDays: 1, nextRecall: "1 day, then 3 and 7 days", label: "Fragile mastery" };
  }
  if (score < 95) {
    return { intervalDays: 3, nextRecall: "3 days, then 7 and 14 days", label: "Stable mastery" };
  }
  return { intervalDays: 7, nextRecall: "7 days, then 21 and 45 days", label: "Strong mastery" };
}

export function scheduleRecall(state, learnerId, lessonId, score) {
  const lesson = findLessonInState(state, lessonId);
  const interval = getRecallInterval(score);
  const schedule = {
    id: `recall-${lessonId}-${Date.now()}`,
    learnerId,
    lessonId,
    skillTag: `${lesson.subject}-${lesson.unitTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    currentMastery: score,
    nextRecall: interval.nextRecall,
    intervalDays: interval.intervalDays,
    recallCount: 0,
    lastResult: interval.label
  };

  return {
    ...state,
    retentionSchedules: [schedule, ...(state.retentionSchedules || []).filter((item) => item.lessonId !== lessonId || item.learnerId !== learnerId)].slice(0, 20)
  };
}

export function submitAffectCheckin(state, learnerId, lessonId, scores) {
  const checkin = {
    id: `affect-${Date.now()}`,
    learnerId,
    lessonId,
    joy: Number(scores.joy),
    frustration: Number(scores.frustration),
    independence: Number(scores.independence),
    note: scores.note || ""
  };

  return logLearningEvent(
    {
      ...state,
      affectCheckins: [checkin, ...(state.affectCheckins || [])].slice(0, 30)
    },
    {
      learnerId,
      lessonId,
      type: "affect_checkin_submitted",
      value: {
        joy: checkin.joy,
        frustration: checkin.frustration,
        independence: checkin.independence
      }
    }
  );
}

export function getLearningTelemetry(state, options = {}) {
  const allowed = new Set((options.learnerIds || []).filter(Boolean));
  const strict = Boolean(options.strictLearnerScope);
  const matchesScope = (item = {}) => {
    if (!allowed.size) return !strict;
    return allowed.has(item.learnerId || item.studentId || "");
  };
  const checkins = (state.affectCheckins || []).filter(matchesScope);
  const avg = (field) => (checkins.length ? Number((checkins.reduce((sum, item) => sum + item[field], 0) / checkins.length).toFixed(1)) : 0);
  return {
    eventCount: (state.learningEvents || []).filter(matchesScope).length,
    recallDueCount: (state.retentionSchedules || []).filter((item) => matchesScope(item) && item.intervalDays <= 3).length,
    benefitCount: (state.masteryBenefits || []).filter(matchesScope).length,
    averageJoy: avg("joy"),
    averageFrustration: avg("frustration"),
    averageIndependence: avg("independence")
  };
}

export function getExperimentDashboard(state) {
  const runs = state.experimentRuns || [];
  const averages = runs.length
    ? {
        immediateScore: Math.round(runs.reduce((sum, run) => sum + run.immediateScore, 0) / runs.length),
        recall24h: Math.round(runs.reduce((sum, run) => sum + run.recall24h, 0) / runs.length),
        recall7d: Math.round(runs.reduce((sum, run) => sum + run.recall7d, 0) / runs.length),
        joy: Number((runs.reduce((sum, run) => sum + run.joy, 0) / runs.length).toFixed(1)),
        frustration: Number((runs.reduce((sum, run) => sum + run.frustration, 0) / runs.length).toFixed(1))
      }
    : { immediateScore: 0, recall24h: 0, recall7d: 0, joy: 0, frustration: 0 };

  return {
    templates: experimentTemplates,
    runs,
    averages,
    bestSignal:
      averages.recall7d >= 75
        ? "Retention is holding after a week."
        : "Keep testing variants until 7-day recall improves without raising frustration."
  };
}

export function addExperimentRun(state, templateId = "movement-vs-screen") {
  const template = experimentTemplates.find((item) => item.id === templateId) || experimentTemplates[0];
  const learner = state.learners[0];
  const lesson = pilotLessons[0];
  const existingRuns = state.experimentRuns || [];
  const runIndex = existingRuns.length + 1;
  const newRun = {
    id: `exp-${template.id}-${runIndex}`,
    templateId: template.id,
    lessonId: lesson.id,
    variant: runIndex % 2 === 0 ? template.variantA : template.variantB,
    learnerId: learner.id,
    immediateScore: 78 + (runIndex % 4) * 3,
    recall24h: 72 + (runIndex % 3) * 4,
    recall7d: 64 + (runIndex % 4) * 5,
    joy: Math.min(5, 3 + (runIndex % 3)),
    frustration: Math.max(1, 3 - (runIndex % 2)),
    independence: Math.min(5, 3 + (runIndex % 2)),
    parentMinutes: Math.max(5, 12 - runIndex),
    decision: `Compare ${template.targetMetric} before changing the lesson.`
  };

  return {
    ...state,
    experimentRuns: [newRun, ...existingRuns].slice(0, 12)
  };
}

function normalizeEvidenceMoves(subject, evidenceMoves = {}) {
  if (subject !== "math") {
    return evidenceMoves;
  }

  return Object.fromEntries(
    evidenceGuidanceAudit.requiredMathLessonMoves.map((move) => [move.key, String(evidenceMoves[move.key] || "").trim()])
  );
}

function slug(value) {
  return String(value || "lesson").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "lesson";
}

function defaultStandardsForSubject(subject) {
  const standardsBySubject = {
    ela: ["ccss-ela"],
    writing: ["ccss-ela"],
    math: ["ccss-math"],
    science: ["ngss"],
    "social-studies": ["c3"],
    "health-pe": ["shape"],
    "computer-science": ["k12cs"],
    "arts-media": ["arts"],
    "life-skills": ["sel"],
    "career-college": ["sel", "ccss-ela"]
  };
  return standardsBySubject[subject] || ["ccss-ela"];
}

function gradeBandForGrade(grade) {
  const normalized = String(grade || "").toUpperCase();
  if (normalized === "K") return "foundation";
  const numericGrade = Number(normalized);
  if (numericGrade >= 9) return "scholar";
  if (numericGrade >= 6) return "bridge";
  return "foundation";
}

function readabilityLimitForBand(band) {
  if (band === "foundation") return 16;
  if (band === "bridge") return 24;
  return 32;
}

function normalizeVisual(visual = {}) {
  return {
    type: String(visual.type || "lesson-image").trim(),
    title: String(visual.title || "").trim(),
    caption: String(visual.caption || "").trim(),
    altText: String(visual.altText || visual.alt || "").trim()
  };
}

function normalizeReadability(readability = {}, grade) {
  const band = String(readability.band || gradeBandForGrade(grade)).trim();
  return {
    band,
    vocabularyLevel: String(readability.vocabularyLevel || "").trim(),
    maxSentenceWords: Number(readability.maxSentenceWords || 0),
    supportNotes: String(readability.supportNotes || "").trim()
  };
}

function subjectLabel(subject) {
  return String(subject || "lesson").replaceAll("-", " ");
}

function normalizeTextList(value, fallback = []) {
  if (Array.isArray(value)) {
    const items = value.map((item) => String(item || "").trim()).filter(Boolean);
    return items.length ? items : fallback;
  }
  const items = String(value || "")
    .split(/\r?\n|;/)
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length ? items : fallback;
}

function defaultVocabularyTerms(subject) {
  const termsBySubject = {
    math: ["model", "strategy", "evidence"],
    science: ["system", "observation", "explanation"],
    ela: ["main idea", "detail", "evidence"],
    writing: ["claim", "evidence", "revision"],
    "social-studies": ["source", "community", "evidence"],
    "computer-science": ["algorithm", "debug", "pattern"],
    "life-skills": ["choice", "reflection", "practice"]
  };
  return termsBySubject[subject] || ["idea", "evidence", "explain"];
}

function defaultPrerequisiteSkills(draft) {
  const label = subjectLabel(draft.subject);
  return [
    `Say what you already know about this ${label} idea.`,
    "Point to one example or clue before answering.",
    "Explain the first step in your own words."
  ];
}

function normalizeObjectList(value, normalizer, fallback = []) {
  const source = Array.isArray(value) ? value : [];
  const normalized = source.map((item, index) => normalizer(item, index)).filter(Boolean);
  return normalized.length ? normalized : fallback;
}

function defaultStudentSummary(draft) {
  return `You will learn to ${String(draft.objective || "practice the lesson goal").replace(/\.$/, "")}.`;
}

function defaultWhyItMatters(draft) {
  const subject = subjectLabel(draft.subject);
  return `This matters because the same ${subject} idea appears in projects, conversations, and future lessons.`;
}

function defaultEssentialQuestion(draft) {
  const objective = String(draft.objective || "show what you understand").replace(/\.$/, "");
  return `How can I ${objective.charAt(0).toLowerCase()}${objective.slice(1)}?`;
}

function defaultTeachingSections(draft) {
  const objective = String(draft.objective || "the lesson goal").replace(/\.$/, "");
  const subject = subjectLabel(draft.subject);
  return {
    warmUp: `Start with one concrete example and ask the learner what they notice before naming the ${subject} idea.`,
    directInstruction: `Model how to ${objective} using a visual, a short explanation, and one think-aloud step.`,
    guidedPractice: "Work through one example together. Ask the learner to explain why each step makes sense.",
    interactiveActivity: "Turn the idea into a quick build, sort, sketch, movement, discussion, or evidence hunt.",
    independentPractice: "Give the learner a short independent attempt and ask them to write the exact stuck point if they hit one.",
    reteachPath: "Use a simpler example, a different visual, and one first-step prompt before trying again.",
    challengePath: "Ask the learner to transfer the idea to a new problem, explain their reasoning, or create a mini artifact."
  };
}

function normalizeTeachingSections(sections = {}, draft = {}) {
  const defaults = defaultTeachingSections(draft);
  return {
    warmUp: String(sections.warmUp || sections.warmup || draft.warmUp || defaults.warmUp).trim(),
    directInstruction: String(sections.directInstruction || sections.teach || draft.directInstruction || defaults.directInstruction).trim(),
    guidedPractice: String(sections.guidedPractice || draft.guidedPractice || defaults.guidedPractice).trim(),
    interactiveActivity: String(sections.interactiveActivity || sections.activity || draft.interactiveActivity || defaults.interactiveActivity).trim(),
    independentPractice: String(sections.independentPractice || draft.independentPractice || defaults.independentPractice).trim(),
    reteachPath: String(sections.reteachPath || sections.reteach || draft.reteachPath || defaults.reteachPath).trim(),
    challengePath: String(sections.challengePath || sections.challenge || draft.challengePath || defaults.challengePath).trim()
  };
}

function defaultHelperNotes(draft) {
  const objective = String(draft.objective || "the lesson goal").replace(/\.$/, "");
  return [
    {
      title: "Look",
      note: "Find the visual clue, model, source detail, or example before reading the full explanation."
    },
    {
      title: "Say",
      note: `Explain how the clue helps you ${objective}.`
    },
    {
      title: "Try",
      note: "Do one small step, then check whether the result still matches the objective."
    }
  ];
}

function normalizeHelperNote(note, index) {
  if (typeof note === "string") {
    return { title: `Helper note ${index + 1}`, note: note.trim() };
  }
  const text = String(note?.note || note?.body || note?.description || "").trim();
  if (!text) return null;
  return {
    title: String(note?.title || `Helper note ${index + 1}`).trim(),
    note: text
  };
}

function defaultCommonMisunderstandings(draft) {
  const subject = draft.subject || "lesson";
  const bySubject = {
    math: {
      misunderstanding: "The learner follows a procedure but cannot connect it to the model.",
      repair: "Ask them to draw or point to the part of the model that proves the step."
    },
    science: {
      misunderstanding: "The learner remembers labels but does not explain how the system works.",
      repair: "Ask for a cause-effect sentence using evidence from the diagram or observation."
    },
    ela: {
      misunderstanding: "The learner retells details without naming the central idea or claim.",
      repair: "Ask which detail several other details point toward."
    },
    writing: {
      misunderstanding: "The learner adds more sentences without improving evidence or structure.",
      repair: "Ask which sentence proves the claim and which sentence only repeats it."
    },
    "social-studies": {
      misunderstanding: "The learner memorizes a fact without using source context.",
      repair: "Ask who made the source, when it was made, and what evidence it gives."
    }
  };
  const fallback = bySubject[subject] || {
    misunderstanding: "The learner may name the answer without explaining the reasoning.",
    repair: "Ask them to show the first clue, step, or example that supports the answer."
  };
  return [fallback];
}

function normalizeMisunderstanding(item, index) {
  if (typeof item === "string") {
    const [mistake, repair] = item.split(/\s*->\s*/);
    return {
      misunderstanding: String(mistake || item).trim(),
      repair: String(repair || "Ask the learner to explain the idea with a different representation.").trim()
    };
  }
  const misunderstanding = String(item?.misunderstanding || item?.mistake || item?.error || "").trim();
  if (!misunderstanding) return null;
  return {
    misunderstanding,
    repair: String(item?.repair || item?.fix || item?.teachingMove || "Ask the learner to explain the idea another way.").trim(),
    signal: String(item?.signal || item?.lookFor || "").trim()
  };
}

function defaultVisualSupports(draft) {
  const visual = normalizeVisual(draft.visual || {});
  const title = visual.title || `${draft.title || "Lesson"} visual`;
  const caption = visual.caption || draft.objective || "Lesson visual support.";
  const altText = visual.altText || caption;
  return [
    {
      placement: "lesson-hero",
      title,
      description: caption,
      prompt: `Create an original educational image for "${draft.title || "lesson"}" that shows the main idea without depicting real children.`,
      altText
    },
    {
      placement: "teaching-diagram",
      title: `${draft.title || "Lesson"} diagram`,
      description: "A labeled diagram that breaks the idea into visible parts before abstract practice.",
      prompt: `Create a clean diagram for ${draft.objective || "the lesson objective"} with labels, arrows, and high contrast.`,
      altText: `Diagram support for ${draft.objective || draft.title || "lesson objective"}.`
    },
    {
      placement: "ai-tutor",
      title: `${draft.title || "Lesson"} tutor visual`,
      description: "Reusable visual hint the tutor can reference when the learner asks for a picture.",
      prompt: `Create a small tutor visual that can explain a stuck point for ${draft.objective || "this lesson"}.`,
      altText: `Tutor visual hint for ${draft.title || "lesson"}.`
    }
  ];
}

function ensureMinimumVisualSupports(visualSupports = [], draft = {}) {
  const normalized = Array.isArray(visualSupports) ? visualSupports.filter(Boolean) : [];
  if (normalized.length >= 2) return normalized;
  const existingPlacements = new Set(normalized.map((support) => support.placement).filter(Boolean));
  const additions = defaultVisualSupports(draft).filter((support) => !existingPlacements.has(support.placement));
  return [...normalized, ...additions].slice(0, Math.max(2, normalized.length));
}

function normalizeVisualSupport(item, index) {
  if (typeof item === "string") {
    const [placement, title, description] = item.split("|").map((part) => part.trim());
    return {
      placement: placement || `visual-${index + 1}`,
      title: title || `Visual support ${index + 1}`,
      description: description || item.trim(),
      prompt: `Create an original educational visual for ${title || item.trim()}.`,
      altText: description || title || item.trim()
    };
  }
  const title = String(item?.title || "").trim();
  const description = String(item?.description || item?.caption || item?.reason || "").trim();
  if (!title && !description) return null;
  return {
    placement: String(item?.placement || item?.key || `visual-${index + 1}`).trim(),
    title: title || `Visual support ${index + 1}`,
    description: description || title,
    prompt: String(item?.prompt || `Create an original educational visual for ${title || description}.`).trim(),
    altText: String(item?.altText || item?.alt || description || title).trim()
  };
}

function normalizeQuizQuestion(question, index, draft) {
  if (typeof question === "string") {
    return {
      questionText: question.trim(),
      questionType: "short-response",
      choices: [],
      correctAnswer: "Learner explains the idea with evidence.",
      explanation: "The response should show reasoning, not just a copied answer.",
      difficultyLevel: "developing",
      skillTag: draft.subject || "lesson-skill",
      standardTag: draft.standards?.[0] || ""
    };
  }
  const questionText = String(question?.questionText || question?.prompt || "").trim();
  if (!questionText) return null;
  return {
    questionText,
    questionType: String(question?.questionType || question?.type || "multiple-choice").trim(),
    choices: Array.isArray(question?.choices) ? question.choices.map((choice) => String(choice || "").trim()).filter(Boolean) : [],
    correctAnswer: String(question?.correctAnswer || question?.correct_answer || question?.answer || "").trim(),
    explanation: String(question?.explanation || "The answer should include reasoning tied to the lesson objective.").trim(),
    difficultyLevel: String(question?.difficultyLevel || question?.difficulty || "developing").trim(),
    skillTag: String(question?.skillTag || question?.skill || draft.subject || "lesson-skill").trim(),
    standardTag: String(question?.standardTag || question?.standard || draft.standards?.[0] || "").trim()
  };
}

function defaultQuizQuestions(draft) {
  const objective = String(draft.objective || "the lesson objective").replace(/\.$/, "");
  return [
    {
      questionText: `Which explanation best shows how to ${objective}?`,
      questionType: "short-response",
      choices: [],
      correctAnswer: "A correct response explains the idea with a model, example, or evidence.",
      explanation: "Mastery requires reasoning in the learner's own words.",
      difficultyLevel: "developing",
      skillTag: draft.subject || "lesson-skill",
      standardTag: draft.standards?.[0] || ""
    }
  ];
}

function normalizeSourceCard(card, index) {
  if (typeof card === "string") {
    const [sourceId, title, url, claim] = card.split("|").map((part) => part.trim());
    return {
      sourceId: sourceId || `source-${index + 1}`,
      title: title || sourceId || `Source ${index + 1}`,
      url: url || "",
      claim: claim || "Staff should verify this source card before publication.",
      checkedAt: "",
      reviewerNote: ""
    };
  }
  const sourceId = String(card?.sourceId || card?.id || "").trim();
  const title = String(card?.title || card?.sourceName || sourceId || `Source ${index + 1}`).trim();
  const claim = String(card?.claim || card?.note || card?.redesignMove || "").trim();
  if (!sourceId && !title && !claim) return null;
  return {
    sourceId: sourceId || `source-${index + 1}`,
    title,
    url: String(card?.url || card?.sourceUrl || "").trim(),
    claim: claim || "Staff should verify this source card before publication.",
    checkedAt: String(card?.checkedAt || "").trim(),
    reviewerNote: String(card?.reviewerNote || card?.troubleSignal || "").trim()
  };
}

function defaultSourceCards(draft) {
  const standards = draft.standards || [];
  if (Array.isArray(draft.sourceLedger) && draft.sourceLedger.length) {
    return draft.sourceLedger.map(normalizeSourceCard).filter(Boolean);
  }
  if (standards.length) {
    return standards.map((standard, index) => ({
      sourceId: `standard-${standard}`,
      title: `${standard} standards tag`,
      url: "",
      claim: `Draft is aligned to ${standard}; staff can map this to a state-specific standard later.`,
      checkedAt: "",
      reviewerNote: "Standards are stored as flexible data, not hardcoded state logic."
    }));
  }
  return [
    {
      sourceId: "staff-review-required",
      title: "Staff source review required",
      url: "",
      claim: "Add a standards, curriculum, or research source before publication.",
      checkedAt: "",
      reviewerNote: ""
    }
  ];
}

function publishedLessonIdForDraft(draft) {
  return `published-${String(draft.id || "draft").replace(/[^a-z0-9_-]/gi, "-")}`;
}

function normalizedCourseTitle(subject) {
  return String(subject || "lesson")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function nativeBridgeMythologyV3Fields(published = {}) {
  if (published.sourceDraftId !== "draft-next-wave-bridge-6-ela-u1-l1") return {};
  return {
    schemaVersion: "3",
    academy: "bridge",
    gradeLevel: "6",
    course: "Grade 6 English Language Arts",
    unitId: "mythology-and-theme",
    lessonNumber: 1,
    lessonFamily: "reasoning_lab",
    secondaryLessonFamily: "seminar_discussion",
    activePhases: ["orient", "model", "deconstruct", "practice", "reason", "prove", "remember", "transfer", "adapt"],
    targetLearningStates: ["acquiring", "developing", "accurate", "secure"],
    learningObjective: "Analyze how a myth uses character choices, symbols, and consequences to reveal a theme or cultural value.",
    successCriteria: [
      "I can separate plot events from a message about life or choices.",
      "I can connect a symbol and character choice to a consequence.",
      "I can defend a theme claim with a specific story detail.",
      "I can revise a weak claim after checking whether the evidence actually supports it."
    ],
    essentialQuestion: "How do myths use impossible events to communicate real truths about choices and community values?",
    standardsTags: published.standards || [],
    thinkingSkillTags: ["theme-analysis", "claim-evidence-reasoning", "symbol-interpretation", "perspective", "transfer"],
    vocabularyTerms: ["myth", "theme", "symbol", "archetype", "conflict", "consequence", "cultural value", "evidence"],
    prerequisiteSkillIds: ["retell-sequence", "identify-character-choice", "cite-or-paraphrase-detail", "write-because-sentence"],
    outcomes: {
      knowledge: [
        "A topic names an idea, while a theme states what a story suggests about that idea.",
        "A symbol matters when its meaning connects to a character choice, consequence, or cultural value."
      ],
      capability: ["Build a myth-decoder evidence chain.", "Write and defend a theme claim using a relevant story detail."],
      reasoning: ["Judge whether a detail proves the claim or merely retells the plot."],
      retention: ["Retrieve the plot-versus-theme distinction and evidence test after a delay."],
      transfer: ["Apply the theme-and-evidence model to a modern story, game, or community situation."]
    },
    phaseModules: [
      { phase: "orient", title: "Enter the myth lab", studentAction: "Look at the journey, object, and warning visuals. Write what each might represent before reading the vocabulary.", visualSupport: "Myth Decoder Board: hero goal, pressure, symbol, consequence.", successCheck: "I can make a prediction and name what evidence would change it." },
      { phase: "model", title: "Watch choice become meaning", studentAction: "Trace one character choice to its consequence, then connect that chain to a possible cultural value.", teacherModel: "A plot tells what happened. A theme explains what the pattern may suggest about life or choices.", visualSupport: "Choice -> consequence -> cultural value -> theme claim chain.", successCheck: "I can point to the story event and the message separately." },
      { phase: "deconstruct", title: "Separate plot, symbol, and theme", studentAction: "Sort statement cards into event, symbol meaning, evidence, topic, or theme claim.", successCheck: "I can explain why a one-word topic is not yet a theme." },
      { phase: "practice", title: "Build the evidence board", studentAction: "Place a hero goal, pressure, symbol, and consequence into the board, then draft a theme sentence.", teacherModel: "Use: The myth suggests that ___ because ___. Keep one strong detail doing the proof work.", successCheck: "My draft includes a message and a story detail." },
      { phase: "reason", title: "Defend the message", studentAction: "Choose the strongest detail for your claim and explain why it supports the message instead of only repeating the plot.", successCheck: "My because sentence connects evidence to the claim." },
      { phase: "prove", title: "Complete the myth checkpoint", studentAction: "Analyze a new myth detail, answer the evidence questions, and revise one weak theme claim independently.", successCheck: "I can defend my answer without final-answer help." },
      { phase: "remember", title: "Store the decoder test", studentAction: "After a delay, retrieve the test: Is this a topic, an event, or a message supported by a choice and consequence?", successCheck: "I can use the test when the story and examples change." },
      { phase: "transfer", title: "Decode a modern story", studentAction: "Find the same choice-consequence pattern in a school-safe game, film, book, or community story and defend the connection.", successCheck: "I can transfer the model without forcing the original myth onto the new story." },
      { phase: "adapt", title: "Choose the next evidence move", studentAction: "If you are stuck, choose plot-versus-theme, symbol meaning, evidence, or claim wording and request the matching tutor route.", successCheck: "My next step responds to the exact gap in my reasoning." }
    ],
    proofTasks: [
      { proof: "recall", prompt: "State the difference between a topic, a plot event, and a theme.", independentRequired: true },
      { proof: "explain", prompt: "Explain how one character choice and consequence support a theme claim.", independentRequired: true },
      { proof: "perform", prompt: "Build an evidence chain and defend the strongest detail.", independentRequired: true },
      { proof: "retain", prompt: "After a delay, classify a new statement and retrieve the evidence test.", independentRequired: true },
      { proof: "transfer", prompt: "Apply the model to a changed modern story or community situation.", independentRequired: true }
    ],
    requiredMasteryProofs: ["recall", "explain", "perform", "retain", "transfer"],
    feedbackRules: [
      { diagnosisCode: "plot_vs_theme", result: "The learner retells events without stating what the pattern suggests about life or choices.", hint: "Keep only the character choice and consequence, then ask what message that pattern could suggest.", action: "Route to plot-versus-theme repair." },
      { diagnosisCode: "topic_not_theme", result: "The learner names a topic such as courage but not a complete message.", hint: "Finish the sentence: The myth suggests that courage means ___ when ___.", action: "Route to claim wording repair." },
      { diagnosisCode: "symbol_without_meaning", result: "The learner names a symbol but cannot connect it to a value, warning, or choice.", hint: "Ask what the symbol carries in this scene and how that meaning changes the claim.", action: "Route to symbol-meaning repair." },
      { diagnosisCode: "evidence_without_reasoning", result: "The learner selects a detail but does not explain why it proves the claim.", hint: "Add because between the detail and the message.", action: "Route to evidence reasoning retry." }
    ],
    reteachPaths: [{ id: "g6-mythology-plot-theme-reteach", trigger: "The learner confuses event, topic, and theme.", action: "Use a three-column sort, then rebuild one choice-consequence-theme chain." }],
    prerequisiteRepairPaths: [{ id: "g6-mythology-evidence-prerequisite", trigger: "The learner cannot identify a character choice or relevant detail.", action: "Repair sequence and evidence selection with a short excerpt before returning to theme analysis." }],
    challengePaths: [{ id: "g6-mythology-modern-transfer", trigger: "The learner independently defends a theme with evidence.", action: "Compare the myth pattern with a modern story and explain what changed and what stayed useful." }],
    memoryPlan: { defaultIntervals: ["day-0", "day-1", "day-3", "day-7"], reviewModes: ["recall", "explain", "correct", "apply"], priorityItems: ["topic versus theme", "choice and consequence", "symbol meaning", "evidence because sentence"] },
    parentTeacherNotes: "Treat plot retelling as an intermediate step, not mastery. Require a message, a relevant detail, and a because explanation before marking the lesson transferable.",
    accessibilityNotes: ["Provide text descriptions for every visual card and keyboard-completable sorting.", "Do not use color alone to distinguish plot, evidence, and theme.", "Accept oral or drawn claim-evidence reasoning when writing mechanics are not the target."],
    safetyNotes: ["Use classroom-safe myth excerpts and avoid presenting cultural traditions as a single universal interpretation."],
    contentStatus: "pilot_ready",
    version: "3.0.0-bridge-mythology-exemplar"
  };
}

export function createPublishedLessonFromDraft(draft = {}, options = {}) {
  const normalizedDraft = normalizeContentDraft(draft);
  const visualSupport = normalizedDraft.visualSupports?.[0] || {};
  const visual = normalizeVisual(normalizedDraft.visual || {
    type: visualSupport.placement || "lesson-image",
    title: visualSupport.title || `${normalizedDraft.title} visual`,
    caption: visualSupport.description || normalizedDraft.studentSummary,
    altText: visualSupport.altText || visualSupport.description || normalizedDraft.studentSummary
  });
  const sections = normalizedDraft.lessonSections || {};
  const quizQuestions = (normalizedDraft.quizQuestions || []).map((question, index) => {
    const choices = Array.isArray(question.choices) && question.choices.length ? question.choices : [question.correctAnswer || "Learner explains with evidence."];
    const answerIndex = Math.max(0, choices.findIndex((choice) => choice === question.correctAnswer));
    return {
      id: `${publishedLessonIdForDraft(normalizedDraft)}-q${index + 1}`,
      prompt: question.questionText,
      questionType: question.questionType,
      choices,
      answerIndex: answerIndex >= 0 ? answerIndex : 0,
      correctAnswer: question.correctAnswer || choices[0],
      explanation: question.explanation,
      difficultyLevel: question.difficultyLevel,
      skillTag: question.skillTag || normalizedDraft.subject,
      standardTag: question.standardTag || normalizedDraft.standards?.[0] || ""
    };
  });

  const publishedLesson = {
    id: publishedLessonIdForDraft(normalizedDraft),
    sourceDraftId: normalizedDraft.id,
    sourceBatchId: normalizedDraft.sourceBatchId || "",
    sourceLessonId: normalizedDraft.sourceLessonId || "",
    sourceToolCallId: normalizedDraft.sourceToolCallId || "",
    academyId: normalizedDraft.academyId,
    academy: normalizedDraft.academy || normalizedDraft.academyId,
    grade: normalizedDraft.grade,
    subject: normalizedDraft.subject,
    courseTitle: normalizedDraft.courseTitle || normalizedCourseTitle(normalizedDraft.subject),
    unitTitle: normalizedDraft.unitTitle || normalizedCourseTitle(normalizedDraft.subject),
    title: normalizedDraft.title,
    objective: normalizedDraft.objective,
    learningObjective: normalizedDraft.learningObjective || normalizedDraft.objective,
    standards: normalizedDraft.standards || [],
    estimatedMinutes: Number(normalizedDraft.estimatedMinutes || 25),
    masteryThreshold: Number(normalizedDraft.masteryThreshold || 80),
    xp: Number(normalizedDraft.xp || 120),
    status: "published",
    schemaVersion: normalizedDraft.schemaVersion,
    lessonFamily: normalizedDraft.lessonFamily,
    activePhases: normalizedDraft.activePhases || [],
    targetLearningStates: normalizedDraft.targetLearningStates || [],
    successCriteria: normalizedDraft.successCriteria || [],
    thinkingSkillTags: normalizedDraft.thinkingSkillTags || [],
    outcomes: normalizedDraft.outcomes || {},
    phaseModules: normalizedDraft.phaseModules || [],
    proofTasks: normalizedDraft.proofTasks || [],
    requiredMasteryProofs: normalizedDraft.requiredMasteryProofs || [],
    feedbackRules: normalizedDraft.feedbackRules || [],
    reteachPaths: normalizedDraft.reteachPaths || [],
    challengePaths: normalizedDraft.challengePaths || [],
    contentStatus: normalizedDraft.contentStatus || "published",
    version: normalizedDraft.version || "",
    essentialQuestion: normalizedDraft.essentialQuestion,
    studentSummary: normalizedDraft.studentSummary,
    whyItMatters: normalizedDraft.whyItMatters,
    vocabularyTerms: normalizedDraft.vocabularyTerms || [],
    prerequisiteSkills: normalizedDraft.prerequisiteSkills || [],
    studentFacing: normalizedDraft.studentFacing || {},
    visual,
    visualSupports: normalizedDraft.visualSupports || [],
    sourceCards: normalizedDraft.sourceCards || [],
    evidenceMoves: normalizedDraft.evidenceMoves || {},
    evidenceAudit: normalizedDraft.evidenceAudit || summarizeEvidenceAudit(getDraftEvidenceAudit(normalizedDraft)),
    teachingSupport: {
      summary: normalizedDraft.studentSummary,
      description: sections.directInstruction || normalizedDraft.objective,
      diagramCallouts: (normalizedDraft.visualSupports || []).map((support) => ({
        title: support.title,
        body: support.description
      })),
      helperNotes: (normalizedDraft.helperNotes || []).map((note) => note.note),
      commonMisunderstandings: (normalizedDraft.commonMisunderstandings || []).map((item) => ({
        mistake: item.misunderstanding,
        fix: item.repair,
        signal: item.signal || ""
      })),
      confusionPrompt: `Write exactly what is confusing about ${normalizedDraft.title}: the words, the visual, the first step, or the reasoning.`
    },
    sections: {
      warmup: sections.warmUp,
      teach: sections.directInstruction,
      guidedPractice: sections.guidedPractice,
      activity: sections.interactiveActivity,
      independentPractice: sections.independentPractice,
      reteach: sections.reteachPath,
      challenge: sections.challengePath
    },
    funTasks: [sections.interactiveActivity, sections.challengePath].filter(Boolean),
    retentionChecks: ["Same-day teach-back", "Next-day recall", "Seven-day transfer check"],
    reward: normalizedDraft.reward || "Unlock progress only after mastery, teach-back, or delayed recall evidence.",
    groupHomework: normalizedDraft.groupHomework
      ? {
          title: normalizedDraft.groupHomework.title,
          groupSize: "Structured learning crew",
          roles: normalizedDraft.groupHomework.roles || [],
          sharedOutcome: normalizedDraft.groupHomework.sharedArtifact,
          parentRole: "Review the shared artifact and individual accountability note."
        }
      : null,
    quiz: quizQuestions.length ? quizQuestions : defaultQuizQuestions(normalizedDraft).map((question, index) => ({
      id: `${publishedLessonIdForDraft(normalizedDraft)}-q${index + 1}`,
      prompt: question.questionText,
      questionType: question.questionType,
      choices: question.choices.length ? question.choices : [question.correctAnswer],
      answerIndex: 0,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      difficultyLevel: question.difficultyLevel,
      skillTag: question.skillTag,
      standardTag: question.standardTag
    })),
    publishedAt: options.publishedAt || new Date().toLocaleString(),
    publishedBy: options.publishedBy || "manager",
    updatedAt: options.updatedAt || new Date().toLocaleString()
  };
  return { ...publishedLesson, ...nativeBridgeMythologyV3Fields(publishedLesson) };
}

function normalizePublishedLesson(lesson = {}) {
  if (lesson.sourceDraftId) {
    return {
      ...lesson,
      status: lesson.status || "published",
      visualSupports: lesson.visualSupports || [],
      sourceCards: lesson.sourceCards || [],
      quiz: lesson.quiz || [],
      sections: lesson.sections || {}
    };
  }
  return lesson;
}

function upsertPublishedLesson(publishedLessons = [], lesson) {
  const rows = (publishedLessons || []).map(normalizePublishedLesson).filter((item) => item.id !== lesson.id && item.sourceDraftId !== lesson.sourceDraftId);
  return [lesson, ...rows].slice(0, 120);
}

function removePublishedLessonForDraft(publishedLessons = [], draftId) {
  return (publishedLessons || []).filter((lesson) => lesson.sourceDraftId !== draftId && lesson.id !== publishedLessonIdForDraft({ id: draftId }));
}

function normalizeGroupHomework(value, draft) {
  const band = gradeBandForGrade(draft.grade);
  if (!value && band === "foundation") return null;
  if (typeof value === "string") {
    return {
      title: value.trim() || "Group explanation task",
      roles: ["Facilitator", "Evidence keeper", "Reporter"],
      sharedArtifact: "One shared explanation, diagram, or project artifact.",
      individualAccountability: "Each learner submits one sentence explaining their contribution."
    };
  }
  const defaultGroup =
    band === "scholar"
      ? {
          title: "Seminar or project team task",
          roles: ["Lead researcher", "Evidence analyst", "Designer", "Presenter"],
          sharedArtifact: "A portfolio-ready explanation, model, source analysis, or lab/product artifact.",
          individualAccountability: "Each learner defends one evidence choice and one next step."
        }
      : {
          title: "Quest crew task",
          roles: ["Facilitator", "Evidence keeper", "Visual builder", "Reporter"],
          sharedArtifact: "A shared diagram, explanation, or short presentation.",
          individualAccountability: "Each learner explains one part in their own words."
        };
  const source = value || defaultGroup;
  return {
    title: String(source.title || defaultGroup.title).trim(),
    roles: normalizeTextList(source.roles, defaultGroup.roles),
    sharedArtifact: String(source.sharedArtifact || source.sharedOutcome || defaultGroup.sharedArtifact).trim(),
    individualAccountability: String(source.individualAccountability || defaultGroup.individualAccountability).trim()
  };
}

export function getContentDraftCompletenessReview(draft = {}) {
  const sections = draft.lessonSections || draft.teachingSections || {};
  const sectionValues = [
    sections.warmUp,
    sections.directInstruction,
    sections.guidedPractice,
    sections.interactiveActivity,
    sections.independentPractice,
    sections.reteachPath,
    sections.challengePath
  ];
  const issues = [];
  if (!String(draft.essentialQuestion || "").trim()) issues.push("Essential question is missing.");
  if (!String(draft.studentSummary || "").trim()) issues.push("Student-facing summary is missing.");
  if (!String(draft.whyItMatters || "").trim()) issues.push("Why-it-matters explanation is missing.");
  if (sectionValues.some((value) => !String(value || "").trim())) issues.push("One or more lesson teaching sections are missing.");
  if ((draft.helperNotes || []).length < 2) issues.push("At least two helper notes are required.");
  if (!(draft.commonMisunderstandings || []).length) issues.push("At least one common misunderstanding and repair move is required.");
  if ((draft.visualSupports || []).length < 2) issues.push("At least two visual supports are required.");
  if (!(draft.quizQuestions || []).length) issues.push("At least one quiz or checkpoint question is required.");
  if (!(draft.sourceCards || []).length) issues.push("At least one source or standards card is required.");
  if (["bridge", "scholar"].includes(gradeBandForGrade(draft.grade)) && !draft.groupHomework) {
    issues.push("Grades 6-12 drafts require structured group homework.");
  }
  return {
    passed: issues.length === 0,
    status: issues.length ? "needs-lesson-body" : "ready",
    issues,
    checkedByAgentId: "content-ops",
    summary: issues.length ? issues.join(" ") : "Draft includes learner summary, lesson sections, helper notes, misconception repair, visuals, quiz, and source cards."
  };
}

function escapeXml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function clipText(value, maxLength = 42) {
  const text = String(value || "").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
}

function visualColorsForSubject(subject) {
  const colorsBySubject = {
    math: ["#4867b1", "#eaf1ff"],
    science: ["#2f8f83", "#edf8f2"],
    ela: ["#e85d4f", "#fff4f1"],
    writing: ["#e85d4f", "#fff4f1"],
    "social-studies": ["#c9942c", "#f8f4ea"]
  };
  return colorsBySubject[subject] || ["#6f5aa6", "#f4f0fb"];
}

function visualSceneSvg(lesson, { compact = false } = {}) {
  const text = (x, y, value, size = 24, fill = "#ffffff", weight = 800) =>
    `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${escapeXml(clipText(value, compact ? 28 : 58))}</text>`;
  const tag = (x, y, value, fill = "#172033") =>
    `<rect x="${x}" y="${y}" width="${compact ? 126 : 178}" height="40" rx="10" fill="${fill}" stroke="#45f3ff" stroke-width="3"/>${text(x + 12, y + 27, value, compact ? 15 : 17)}`;
  const type = lesson.visual?.type || "lesson-image";

  if (type === "number-line") {
    return `
      <line x1="110" y1="320" x2="850" y2="320" stroke="#ffffff" stroke-width="8"/>
      ${[0, 1, 2, 3, 4].map((tick) => `<line x1="${110 + tick * 185}" y1="288" x2="${110 + tick * 185}" y2="352" stroke="#45f3ff" stroke-width="6"/>`).join("")}
      <circle cx="480" cy="320" r="34" fill="#ff4fd8"/>
      ${text(108, 390, "0")} ${text(834, 390, "1")} ${text(402, 254, "1/2 = 2/4", 30, "#ffea64")}
      <path d="M110 236 C238 166 350 166 480 236" fill="none" stroke="#66ff9a" stroke-width="8"/>
      <path d="M480 236 C602 166 728 166 850 236" fill="none" stroke="#b967ff" stroke-width="8"/>
      ${tag(92, 104, "Whole")}${tag(378, 104, "Equal spaces")}${tag(666, 104, "Same point")}
    `;
  }

  if (type === "story-map") {
    return `
      <rect x="360" y="216" width="240" height="96" rx="18" fill="#ff4fd8"/>${text(398, 274, "Main Idea", 30)}
      ${[[92, 96, "Proof detail"], [666, 96, "Proof detail"], [116, 382, "Distractor?"], [646, 382, "Proof detail"]]
        .map(([x, y, label]) => `${tag(x, y, label)}<line x1="${x + 88}" y1="${y + 40}" x2="480" y2="264" stroke="#45f3ff" stroke-width="4"/>`)
        .join("")}
    `;
  }

  if (type === "ecosystem-model") {
    return `
      <circle cx="140" cy="140" r="62" fill="#ffea64"/>
      <rect x="356" y="304" width="44" height="82" fill="#66ff9a"/><circle cx="378" cy="270" r="58" fill="#66ff9a"/>
      <ellipse cx="650" cy="340" rx="90" ry="38" fill="#ff4fd8"/><circle cx="600" cy="328" r="12" fill="#080b1e"/>
      <path d="M204 156 C278 184 310 220 338 252" fill="none" stroke="#ffffff" stroke-width="7"/>
      <path d="M424 288 C500 260 556 282 598 328" fill="none" stroke="#45f3ff" stroke-width="7"/>
      <path d="M662 378 C576 456 372 450 302 382" fill="none" stroke="#b967ff" stroke-width="7"/>
      ${tag(72, 430, "Sun energy")}${tag(358, 430, "Plant food")}${tag(646, 430, "System change")}
    `;
  }

  if (type === "community-map") {
    return `
      <path d="M100 0 C186 160 120 290 220 540" fill="none" stroke="#45f3ff" stroke-width="34"/>
      <path d="M0 370 C250 318 502 380 960 300" fill="none" stroke="#ffea64" stroke-width="22"/>
      <rect x="380" y="128" width="126" height="86" rx="16" fill="#ffffff" stroke="#080b1e" stroke-width="6"/>${text(400, 180, "School", 22, "#080b1e")}
      <circle cx="680" cy="148" r="58" fill="#66ff9a"/>${text(642, 246, "Park", 24)}
      <rect x="714" y="370" width="138" height="74" rx="18" fill="#ff4fd8"/>${text(748, 416, "Town", 24)}
      ${text(82, 96, "N", 34)}<path d="M96 116 l0 78 m-38 -39 l76 0" stroke="#ffffff" stroke-width="7"/>
    `;
  }

  if (type === "weather-map") {
    return `
      <path d="M80 356 C214 206 284 402 420 260 C560 110 696 160 888 86" fill="none" stroke="#45f3ff" stroke-width="14"/>
      <path d="M88 140 C230 74 334 126 442 92 C578 48 704 106 862 156" fill="none" stroke="#ff4fd8" stroke-width="14"/>
      <circle cx="254" cy="316" r="58" fill="#ffffff" stroke="#080b1e" stroke-width="7"/>${text(232, 334, "H", 46, "#080b1e")}
      <circle cx="642" cy="190" r="58" fill="#ffffff" stroke="#080b1e" stroke-width="7"/>${text(624, 208, "L", 46, "#080b1e")}
      <path d="M382 392 l82 -54 l-16 36" fill="none" stroke="#66ff9a" stroke-width="8"/>
      <path d="M590 380 l96 -30 l-28 28" fill="none" stroke="#66ff9a" stroke-width="8"/>
      ${tag(80, 438, "Pressure")}${tag(374, 438, "Wind")}${tag(666, 438, "Evidence")}
    `;
  }

  if (type === "cell-diagram") {
    return `
      <ellipse cx="480" cy="296" rx="328" ry="142" fill="#ffffff" stroke="#45f3ff" stroke-width="8"/>
      <circle cx="392" cy="280" r="62" fill="#b967ff"/>${text(342, 288, "Nucleus", 22)}
      <ellipse cx="610" cy="232" rx="78" ry="34" fill="#ff4fd8"/>${text(562, 240, "Energy", 20)}
      <rect x="580" y="344" width="138" height="48" rx="24" fill="#ffea64"/>${text(606, 376, "Transport", 19, "#080b1e")}
      <circle cx="270" cy="360" r="34" fill="#66ff9a"/>
      ${tag(80, 104, "Information")}${tag(384, 104, "Energy")}${tag(688, 104, "Boundary")}
    `;
  }

  return `${tag(120, 220, lesson.title || "Lesson visual")}${text(120, 300, lesson.objective || "", 22, "#d7e8ff")}`;
}

function createVisualAssetSvg(lesson) {
  const [accent, background] = visualColorsForSubject(lesson.subject);
  const title = escapeXml(clipText(lesson.visual.title || lesson.title));
  const caption = escapeXml(clipText(lesson.visual.caption || lesson.objective, 72));
  const subject = escapeXml(String(lesson.subject || "lesson").replace("-", " ").toUpperCase());
  const grade = escapeXml(`Grade ${lesson.grade}`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" role="img">
  <rect width="960" height="540" rx="24" fill="#080b1e"/>
  <rect x="34" y="34" width="892" height="472" rx="28" fill="${background}" opacity=".12" stroke="${accent}" stroke-width="4"/>
  <rect x="62" y="64" width="200" height="44" rx="12" fill="${accent}"/>
  <text x="82" y="94" font-family="Arial, sans-serif" font-size="21" font-weight="800" fill="#ffffff">${subject}</text>
  <text x="756" y="96" font-family="Arial, sans-serif" font-size="24" font-weight="800" fill="#ffffff">${grade}</text>
  <text x="62" y="154" font-family="Arial, sans-serif" font-size="38" font-weight="900" fill="#ffffff">${title}</text>
  <text x="62" y="198" font-family="Arial, sans-serif" font-size="21" font-weight="700" fill="#d7e8ff">${caption}</text>
  ${visualSceneSvg(lesson)}
</svg>`;
}

function createVisualAsset(lesson, draftId, batchId, importedAt) {
  return {
    id: `asset-${draftId}`,
    draftId,
    sourceBatchId: batchId,
    status: "review",
    assetKind: "generated-svg",
    type: lesson.visual.type,
    subject: lesson.subject,
    grade: lesson.grade,
    title: lesson.visual.title,
    caption: lesson.visual.caption,
    altText: lesson.visual.altText,
    license: "generated-in-app",
    sourcePrompt: lesson.visual.generationPrompt || lesson.studentFacing?.mission || lesson.objective,
    reviewChecklist: [
      "The image directly supports the learning objective.",
      "The labels are readable and do not rely only on color.",
      "The visual matches the lesson misconception and helper notes.",
      "The visual is age-appropriate and classroom-safe.",
      "Alt text and caption describe the learning idea."
    ],
    accessibilityChecklist: {
      hasAltText: Boolean(lesson.visual.altText),
      hasCaption: Boolean(lesson.visual.caption),
      highContrast: true,
      needsHumanReview: true
    },
    svg: createVisualAssetSvg(lesson),
    createdAt: importedAt,
    updatedAt: ""
  };
}

function summarizeEvidenceAudit(audit) {
  return {
    required: audit.required,
    present: audit.present,
    passed: audit.passed,
    missingKeys: audit.missing.map((move) => move.key),
    missingLabels: audit.missing.map((move) => move.label)
  };
}

export function getDraftEvidenceAudit(draft) {
  return auditEvidenceMoves(draft.subject, draft.evidenceMoves || {}, draft.id);
}

function normalizeLessonImport(rawLesson = {}, index = 0) {
  rawLesson = adaptStructuredLesson(rawLesson);
  const subject = String(rawLesson.subject || "").trim();
  const standards = Array.isArray(rawLesson.standards) && rawLesson.standards.length ? rawLesson.standards : defaultStandardsForSubject(subject);
  const evidenceMoves = normalizeEvidenceMoves(subject, rawLesson.evidenceMoves || {});
  const title = String(rawLesson.title || "").trim();
  const grade = String(rawLesson.grade || rawLesson.gradeLevel || "").trim();
  const objective = String(rawLesson.objective || rawLesson.learningObjective || "").trim();
  const visual = normalizeVisual(rawLesson.visual || {});
  const readability = normalizeReadability(rawLesson.readability || {}, grade);
  const baseLesson = {
    id: rawLesson.id || `import-lesson-${index + 1}`,
    academyId: rawLesson.academyId || "foundation",
    grade,
    subject,
    title,
    objective,
    unitTitle: String(rawLesson.unitTitle || rawLesson.unit || "").trim(),
    standards,
    reviewNotes: String(rawLesson.reviewNotes || "Imported batch lesson requires academic review before publishing.").trim(),
    visual,
    accessibilityNotes: String(rawLesson.accessibilityNotes || "").trim(),
    ageFitNotes: String(rawLesson.ageFitNotes || "").trim(),
    readability,
    evidenceMoves
  };

  return {
    ...baseLesson,
    academy: rawLesson.academy || rawLesson.academyId,
    learningObjective: rawLesson.learningObjective || objective,
    studentFacing: rawLesson.studentFacing || {},
    funTasks: rawLesson.funTasks || [],
    retentionChecks: rawLesson.retentionChecks || [],
    reward: rawLesson.reward || "",
    teachingSupport: rawLesson.teachingSupport || {},
    schemaVersion: rawLesson.schemaVersion,
    lessonFamily: rawLesson.lessonFamily,
    activePhases: rawLesson.activePhases || [],
    targetLearningStates: rawLesson.targetLearningStates || [],
    successCriteria: rawLesson.successCriteria || [],
    thinkingSkillTags: rawLesson.thinkingSkillTags || [],
    outcomes: rawLesson.outcomes || {},
    phaseModules: rawLesson.phaseModules || [],
    proofTasks: rawLesson.proofTasks || [],
    requiredMasteryProofs: rawLesson.requiredMasteryProofs || [],
    feedbackRules: rawLesson.feedbackRules || [],
    reteachPaths: rawLesson.reteachPaths || [],
    challengePaths: rawLesson.challengePaths || [],
    contentStatus: rawLesson.contentStatus || "review_required",
    version: rawLesson.version || "",
    essentialQuestion: String(rawLesson.essentialQuestion || defaultEssentialQuestion(baseLesson)).trim(),
    studentSummary: String(rawLesson.studentSummary || rawLesson.summary || defaultStudentSummary(baseLesson)).trim(),
    whyItMatters: String(rawLesson.whyItMatters || defaultWhyItMatters(baseLesson)).trim(),
    vocabularyTerms: normalizeTextList(rawLesson.vocabularyTerms, defaultVocabularyTerms(subject)),
    prerequisiteSkills: normalizeTextList(rawLesson.prerequisiteSkills, defaultPrerequisiteSkills(baseLesson)),
    lessonSections: normalizeTeachingSections(rawLesson.lessonSections || rawLesson.teachingSections || {}, baseLesson),
    helperNotes: normalizeObjectList(rawLesson.helperNotes, normalizeHelperNote, defaultHelperNotes(baseLesson)),
    commonMisunderstandings: normalizeObjectList(
      rawLesson.commonMisunderstandings || rawLesson.misconceptions,
      normalizeMisunderstanding,
      defaultCommonMisunderstandings(baseLesson)
    ),
    visualSupports: normalizeObjectList(rawLesson.visualSupports, normalizeVisualSupport, defaultVisualSupports(baseLesson)),
    quizQuestions: normalizeObjectList(rawLesson.quizQuestions || rawLesson.quiz, (question, questionIndex) => normalizeQuizQuestion(question, questionIndex, baseLesson), defaultQuizQuestions(baseLesson)),
    sourceCards: normalizeObjectList(rawLesson.sourceCards, normalizeSourceCard, defaultSourceCards(baseLesson)),
    groupHomework: normalizeGroupHomework(rawLesson.groupHomework, baseLesson)
  };
}

export function validateLessonBatch(batchInput) {
  const lessons = Array.isArray(batchInput) ? batchInput : Array.isArray(batchInput?.lessons) ? batchInput.lessons : [];
  const errors = [];
  const warnings = [];
  const seenKeys = new Map();
  const normalizedLessons = lessons.map((lesson, index) => {
    const normalized = normalizeLessonImport(lesson, index);
    const path = `lessons[${index}]`;
    const duplicateKey = `${normalized.grade}|${normalized.subject}|${normalized.unitTitle}|${normalized.title}`.toLowerCase();

    if (!normalized.title) errors.push({ path: `${path}.title`, message: "Lesson title is required." });
    if (!normalized.grade) errors.push({ path: `${path}.grade`, message: "Grade is required." });
    if (!normalized.subject) errors.push({ path: `${path}.subject`, message: "Subject is required." });
    if (!normalized.objective) errors.push({ path: `${path}.objective`, message: "Learning objective is required." });
    if (!normalized.unitTitle) errors.push({ path: `${path}.unitTitle`, message: "Unit title is required so lessons are not orphaned." });
    if (!normalized.standards.length) errors.push({ path: `${path}.standards`, message: "At least one standards tag is required." });
    if (!normalized.visual.title) errors.push({ path: `${path}.visual.title`, message: "Visual title is required for generated lessons." });
    if (!normalized.visual.caption) errors.push({ path: `${path}.visual.caption`, message: "Visual caption is required for generated lessons." });
    if (!normalized.visual.altText) errors.push({ path: `${path}.visual.altText`, message: "Visual alt text is required for accessibility." });
    if (!normalized.accessibilityNotes) errors.push({ path: `${path}.accessibilityNotes`, message: "Accessibility notes are required." });
    if (!normalized.ageFitNotes) errors.push({ path: `${path}.ageFitNotes`, message: "Age-fit notes are required." });
    if (!normalized.readability.vocabularyLevel) errors.push({ path: `${path}.readability.vocabularyLevel`, message: "Readability vocabulary level is required." });
    if (!normalized.readability.supportNotes) errors.push({ path: `${path}.readability.supportNotes`, message: "Readability support notes are required." });

    const expectedBand = gradeBandForGrade(normalized.grade);
    const maxSentenceWords = readabilityLimitForBand(expectedBand);
    if (normalized.readability.band !== expectedBand) {
      errors.push({ path: `${path}.readability.band`, message: `Readability band must match grade band ${expectedBand}.` });
    }
    if (!normalized.readability.maxSentenceWords || normalized.readability.maxSentenceWords > maxSentenceWords) {
      errors.push({
        path: `${path}.readability.maxSentenceWords`,
        message: `Max sentence words must be 1-${maxSentenceWords} for ${expectedBand} lessons.`
      });
    }

    if (seenKeys.has(duplicateKey)) {
      errors.push({ path, message: `Duplicate lesson in batch also appears at lessons[${seenKeys.get(duplicateKey)}].` });
    } else {
      seenKeys.set(duplicateKey, index);
    }

    const audit = auditEvidenceMoves(normalized.subject, normalized.evidenceMoves, normalized.id);
    if (audit.required && !audit.passed) {
      errors.push({
        path: `${path}.evidenceMoves`,
        message: `Math lesson is missing evidence moves: ${audit.missing.map((move) => move.label).join(", ")}.`
      });
    }

    return normalized;
  });

  if (!lessons.length) {
    errors.push({ path: "lessons", message: "Batch import requires a non-empty lessons array." });
  }

  if (normalizedLessons.length >= 3) {
    const standardSets = new Set(normalizedLessons.map((lesson) => lesson.standards.slice().sort().join("|")));
    if (standardSets.size === 1) {
      warnings.push({
        path: "lessons.standards",
        message: "All lessons use the same standards set. Check coverage balance before scaling this batch."
      });
    }
  }

  return {
    accepted: errors.length === 0,
    total: lessons.length,
    readyCount: errors.length === 0 ? normalizedLessons.length : 0,
    errors,
    warnings,
    lessons: normalizedLessons
  };
}

export function importLessonBatch(state, batchInput) {
  const validation = validateLessonBatch(batchInput);
  const importedAt = new Date().toLocaleString();
  const requestedBatchId = Array.isArray(batchInput) ? "" : String(batchInput?.sourceBatchId || "").trim();
  const batchId = requestedBatchId || `batch-${Date.now()}`;
  const job = {
    id: batchId,
    status: validation.accepted ? "imported" : "rejected",
    total: validation.total,
    imported: validation.accepted ? validation.total : 0,
    errors: validation.errors,
    warnings: validation.warnings,
    importedAt
  };

  if (!validation.accepted) {
    return {
      state: {
        ...state,
        contentImportJobs: [job, ...(state.contentImportJobs || [])].slice(0, 20)
      },
      result: {
        ...validation,
        batchId,
        imported: 0
      }
    };
  }

  const visualAssets = [];
  const existingDrafts = (state.contentDrafts || []).filter((draft) => draft.sourceBatchId !== batchId);
  const existingVisualAssets = (state.visualAssets || []).filter((asset) => asset.sourceBatchId !== batchId);
  const drafts = validation.lessons.map((lesson, index) => {
    const audit = auditEvidenceMoves(lesson.subject, lesson.evidenceMoves, lesson.id);
    const draftId = `draft-${batchId}-${index + 1}-${slug(lesson.title)}`;
    const visualAsset = createVisualAsset(lesson, draftId, batchId, importedAt);
    visualAssets.push(visualAsset);
    return normalizeContentDraft({
      id: draftId,
      status: "draft",
      academyId: lesson.academyId,
      grade: lesson.grade,
      subject: lesson.subject,
      title: lesson.title,
      objective: lesson.objective,
      unitTitle: lesson.unitTitle,
      standards: lesson.standards,
      reviewNotes: lesson.reviewNotes,
      visual: lesson.visual,
      visualAssetId: visualAsset.id,
      accessibilityNotes: lesson.accessibilityNotes,
      ageFitNotes: lesson.ageFitNotes,
      essentialQuestion: lesson.essentialQuestion,
      studentSummary: lesson.studentSummary,
      whyItMatters: lesson.whyItMatters,
      studentFacing: lesson.studentFacing || {},
      funTasks: lesson.funTasks || [],
      retentionChecks: lesson.retentionChecks || [],
      reward: lesson.reward || "",
      teachingSupport: lesson.teachingSupport || {},
      vocabularyTerms: lesson.vocabularyTerms,
      prerequisiteSkills: lesson.prerequisiteSkills,
      lessonSections: lesson.lessonSections,
      helperNotes: lesson.helperNotes,
      commonMisunderstandings: lesson.commonMisunderstandings,
      visualSupports: lesson.visualSupports,
      quizQuestions: lesson.quizQuestions,
      sourceCards: lesson.sourceCards,
      groupHomework: lesson.groupHomework,
      readability: lesson.readability,
      evidenceMoves: lesson.evidenceMoves,
      academy: lesson.academy,
      learningObjective: lesson.learningObjective,
      schemaVersion: lesson.schemaVersion,
      lessonFamily: lesson.lessonFamily,
      activePhases: lesson.activePhases || [],
      targetLearningStates: lesson.targetLearningStates || [],
      successCriteria: lesson.successCriteria || [],
      thinkingSkillTags: lesson.thinkingSkillTags || [],
      outcomes: lesson.outcomes || {},
      phaseModules: lesson.phaseModules || [],
      proofTasks: lesson.proofTasks || [],
      requiredMasteryProofs: lesson.requiredMasteryProofs || [],
      feedbackRules: lesson.feedbackRules || [],
      reteachPaths: lesson.reteachPaths || [],
      challengePaths: lesson.challengePaths || [],
      contentStatus: lesson.contentStatus || "review_required",
      version: lesson.version || "",
      evidenceAudit: summarizeEvidenceAudit(audit),
      sourceLessonId: lesson.sourceLessonId || lesson.id,
      estimatedMinutes: lesson.estimatedMinutes,
      masteryThreshold: lesson.masteryThreshold,
      activePhases: lesson.activePhases || [],
      memoryVaultItems: lesson.memoryVaultItems || [],
      retrievalCheck: lesson.retrievalCheck || null,
      reteachPath: lesson.reteachPath || null,
      challengePath: lesson.challengePath || null,
      publicationBlocked: false,
      blockedReason: "",
      sourceBatchId: batchId,
      createdAt: importedAt
    });
  });

  return {
    state: {
      ...state,
      contentDrafts: [...drafts, ...existingDrafts].slice(0, 60),
      visualAssets: [...visualAssets, ...existingVisualAssets].slice(0, 120),
      contentImportJobs: [job, ...(state.contentImportJobs || [])].slice(0, 20)
    },
    result: {
      ...validation,
      batchId,
      imported: drafts.length
    }
  };
}

export function createContentDraft(state, draft) {
  const subject = draft.subject || "math";
  const evidenceMoves = normalizeEvidenceMoves(subject, draft.evidenceMoves || {});
  const evidenceAudit = getDraftEvidenceAudit({
    id: "new-draft",
    subject,
    evidenceMoves
  });
  const nextDraft = normalizeContentDraft({
    id: `draft-${Date.now()}`,
    status: "draft",
    academyId: draft.academyId || "foundation",
    grade: draft.grade || "3",
    subject,
    title: draft.title?.trim() || "Untitled lesson",
    objective: draft.objective?.trim() || "Define the learning objective before review.",
    standards: draft.standards || [],
    reviewNotes: draft.reviewNotes?.trim() || "Needs academic review before publishing.",
    accessibilityNotes: draft.accessibilityNotes?.trim() || "",
    ageFitNotes: draft.ageFitNotes?.trim() || "",
    essentialQuestion: draft.essentialQuestion?.trim() || "",
    studentSummary: draft.studentSummary?.trim() || "",
    whyItMatters: draft.whyItMatters?.trim() || "",
    vocabularyTerms: draft.vocabularyTerms || [],
    prerequisiteSkills: draft.prerequisiteSkills || [],
    lessonSections: draft.lessonSections || draft.teachingSections || {},
    helperNotes: draft.helperNotes || [],
    commonMisunderstandings: draft.commonMisunderstandings || draft.misconceptions || [],
    visualSupports: draft.visualSupports || [],
    quizQuestions: draft.quizQuestions || draft.quiz || [],
    sourceCards: draft.sourceCards || [],
    groupHomework: draft.groupHomework || null,
    unitTitle: draft.unitTitle || "",
    sourceToolCallId: draft.sourceToolCallId || "",
    sourceLessonId: draft.sourceLessonId || "",
    redesignTaskIds: draft.redesignTaskIds || [],
    researchSourceIds: draft.researchSourceIds || [],
    redesignTasks: draft.redesignTasks || [],
    evidenceMoves,
    evidenceAudit: summarizeEvidenceAudit(evidenceAudit),
    publicationBlocked: false,
    blockedReason: "",
    createdAt: new Date().toLocaleString()
  });

  return {
    ...state,
    contentDrafts: [nextDraft, ...(state.contentDrafts || [])].slice(0, 30)
  };
}

function researchDraftIdForToolLog(logId) {
  return `draft-redesign-${String(logId || "research").replace(/[^a-z0-9_-]/gi, "-")}`;
}

function createResearchRedesignDraftFromToolLog(log, reviewedAt) {
  const payload = log.payload || {};
  const lesson = findLesson(payload.lessonId);
  const tasks = Array.isArray(payload.redesignTasks) ? payload.redesignTasks : [];
  if (!tasks.length) return null;

  const sourceIds = [
    ...(payload.sourceCoverage?.sourceIds || []),
    ...tasks.flatMap((task) => task.sourceIds || [])
  ].filter(Boolean);
  const uniqueSourceIds = [...new Set(sourceIds)];
  const reviewNotes = [
    `Research-approved redesign from ${log.toolName}.`,
    uniqueSourceIds.length ? `Sources: ${uniqueSourceIds.join(", ")}.` : "Sources require staff verification.",
    "Redesign tasks:",
    ...tasks.slice(0, 6).map((task, index) => `${index + 1}. ${task.title}: ${task.change}`)
  ].join("\n");
  const subject = lesson.subject || payload.subject || "math";
  const evidenceMoves = normalizeEvidenceMoves(subject, lesson.evidenceMoves || {});
  const evidenceAudit = getDraftEvidenceAudit({
    id: researchDraftIdForToolLog(log.id),
    subject,
    evidenceMoves
  });

  return normalizeContentDraft({
    id: researchDraftIdForToolLog(log.id),
    status: "review",
    academyId: lesson.academyId || "foundation",
    grade: lesson.grade || payload.grade || "3",
    subject,
    title: `Research redesign: ${lesson.title}`,
    objective: `Improve "${lesson.objective}" using reviewed misconception and source-ledger findings.`,
    unitTitle: lesson.unitTitle || "",
    standards: lesson.standards || [],
    reviewNotes,
    accessibilityNotes: lesson.accessibilityNotes || "Use the source lesson accessibility supports and verify any new visual or task text before publication.",
    ageFitNotes: lesson.ageFitNotes || "Use the source lesson grade-band language, task length, and independence expectations.",
    essentialQuestion: lesson.essentialQuestion || `How can this lesson better repair the confusion students usually have with ${lesson.title}?`,
    studentSummary: `You will revisit ${lesson.title} with a clearer visual, a known hard-part check, and a chance to explain the idea in your own words.`,
    whyItMatters: "This redesign exists because reviewed learner confusion and source findings showed the lesson needs a stronger path to understanding.",
    vocabularyTerms: lesson.vocabulary || defaultVocabularyTerms(subject),
    prerequisiteSkills: lesson.prerequisites || defaultPrerequisiteSkills({ ...lesson, subject }),
    lessonSections: normalizeTeachingSections(lesson.sections || {}, { ...lesson, subject }),
    helperNotes: normalizeObjectList(lesson.teachingSupport?.helperNotes, normalizeHelperNote, defaultHelperNotes({ ...lesson, subject })),
    commonMisunderstandings: normalizeObjectList(
      lesson.teachingSupport?.commonMisunderstandings,
      normalizeMisunderstanding,
      defaultCommonMisunderstandings({ ...lesson, subject })
    ),
    visualSupports: normalizeObjectList([], normalizeVisualSupport, defaultVisualSupports({ ...lesson, subject })),
    quizQuestions: normalizeObjectList(lesson.quiz, (question, index) => normalizeQuizQuestion(question, index, { ...lesson, subject }), defaultQuizQuestions({ ...lesson, subject })),
    sourceCards: normalizeObjectList(payload.sourceLedger, normalizeSourceCard, defaultSourceCards({ ...lesson, subject, standards: lesson.standards || [] })),
    groupHomework: normalizeGroupHomework(lesson.groupHomework, { ...lesson, subject }),
    sourceToolCallId: log.id,
    sourceLessonId: lesson.id,
    redesignTaskIds: tasks.map((task) => task.id),
    researchSourceIds: uniqueSourceIds,
    redesignTasks: tasks,
    sourceLedger: payload.sourceLedger || [],
    evidenceMoves,
    evidenceAudit: summarizeEvidenceAudit(evidenceAudit),
    publicationBlocked: false,
    blockedReason: "",
    createdAt: reviewedAt,
    updatedAt: reviewedAt
  });
}

function applyApprovedResearchToolLog(state, log, reviewedAt) {
  if (!log || log.toolId !== "syllabus_misconception_research" || log.status !== "completed") {
    return { state, draft: null };
  }

  const existingDraft = (state.contentDrafts || []).find((draft) => draft.sourceToolCallId === log.id);
  if (existingDraft) {
    return { state, draft: existingDraft };
  }

  const draft = createResearchRedesignDraftFromToolLog(log, reviewedAt);
  if (!draft) return { state, draft: null };

  return {
    state: {
      ...state,
      contentDrafts: [draft, ...(state.contentDrafts || [])].slice(0, 60)
    },
    draft
  };
}

function redesignDraftIdForSignal(signalId) {
  return `draft-redesign-signal-${String(signalId || "task").replace(/[^a-z0-9_-]/gi, "-")}`;
}

function createRedesignDraftFromSignal(signal = {}, reviewedAt = "") {
  const lesson = findLessonInState({ publishedLessons: [] }, signal.lessonId || pilotLessons[0].id);
  const subject = lesson.subject || "lesson";
  const evidenceMoves = normalizeEvidenceMoves(subject, lesson.evidenceMoves || {});
  const evidenceAudit = getDraftEvidenceAudit({
    id: redesignDraftIdForSignal(signal.id),
    subject,
    evidenceMoves
  });
  const change = String(signal.change || "Redesign the lesson with a clearer visual, tutor prompt, and reteach path.").trim();
  const why = String(signal.why || "Learner evidence showed the current support did not resolve confusion.").trim();
  const sourceIds = Array.isArray(signal.sourceIds) && signal.sourceIds.length ? signal.sourceIds : ["lesson-improvement-signal"];
  const reviewNotes = [
    `Manager-approved redesign signal from ${signal.ownerAgentId || "fun-retention"}.`,
    `Why: ${why}`,
    `Required change: ${change}`,
    signal.feedback ? `Feedback signal: ${String(signal.feedback).replace("-", " ")}.` : "",
    sourceIds.length ? `Evidence sources: ${sourceIds.join(", ")}.` : ""
  ].filter(Boolean).join("\n");

  return normalizeContentDraft({
    id: redesignDraftIdForSignal(signal.id),
    status: "review",
    academyId: lesson.academyId || "foundation",
    grade: lesson.grade || "3",
    subject,
    title: `Evidence redesign: ${lesson.title}`,
    objective: `Improve "${lesson.objective}" using learner evidence from tutor or teacher support.`,
    unitTitle: lesson.unitTitle || "",
    standards: lesson.standards || [],
    reviewNotes,
    accessibilityNotes: lesson.accessibilityNotes || "Preserve source lesson accessibility supports and verify new visual, text, and interaction changes.",
    ageFitNotes: lesson.ageFitNotes || "Keep the redesign age-appropriate for the source academy and grade.",
    essentialQuestion: lesson.essentialQuestion || `How can this lesson better help students understand ${lesson.title}?`,
    studentSummary: `You will retry ${lesson.title} with a clearer explanation, a better visual, and a targeted practice path based on student evidence.`,
    whyItMatters: why,
    vocabularyTerms: lesson.vocabulary || defaultVocabularyTerms(subject),
    prerequisiteSkills: lesson.prerequisites || defaultPrerequisiteSkills({ ...lesson, subject }),
    lessonSections: {
      ...normalizeTeachingSections(lesson.sections || {}, { ...lesson, subject }),
      reteachPath: change,
      challengePath: lesson.sections?.challenge || "After the redesign works, apply the idea to a new example and explain what changed."
    },
    helperNotes: [
      ...normalizeObjectList(lesson.teachingSupport?.helperNotes, normalizeHelperNote, defaultHelperNotes({ ...lesson, subject })),
      { title: "Redesign focus", note: change }
    ],
    commonMisunderstandings: [
      ...normalizeObjectList(
        lesson.teachingSupport?.commonMisunderstandings,
        normalizeMisunderstanding,
        defaultCommonMisunderstandings({ ...lesson, subject })
      ),
      {
        misunderstanding: signal.confusionType ? `Learner stayed stuck on ${signal.confusionType}.` : "Learner support did not resolve the stuck point.",
        repair: change,
        signal: signal.feedback || "needs-redesign"
      }
    ],
    visualSupports: [
      ...defaultVisualSupports({ ...lesson, subject }),
      {
        placement: "misconception-repair",
        title: `${lesson.title} redesign repair visual`,
        description: change,
        prompt: `Create a clear educational visual that fixes this learner confusion for ${lesson.title}: ${change}`,
        altText: `Redesign visual for ${lesson.title}: ${change}`
      }
    ],
    quizQuestions: normalizeObjectList(lesson.quiz, (question, index) => normalizeQuizQuestion(question, index, { ...lesson, subject }), defaultQuizQuestions({ ...lesson, subject })),
    sourceCards: sourceIds.map((sourceId, index) => ({
      sourceId,
      title: `Redesign evidence ${index + 1}`,
      url: "",
      claim: index === 0 ? why : `Related evidence source: ${sourceId}.`,
      checkedAt: reviewedAt,
      reviewerNote: "Created from manager-reviewed tutor/teacher redesign evidence."
    })),
    groupHomework: normalizeGroupHomework(lesson.groupHomework, { ...lesson, subject }),
    sourceLessonId: lesson.id,
    redesignTaskIds: [signal.id],
    redesignTasks: [signal],
    evidenceMoves,
    evidenceAudit: summarizeEvidenceAudit(evidenceAudit),
    publicationBlocked: false,
    blockedReason: "",
    createdAt: reviewedAt,
    updatedAt: reviewedAt
  });
}

function applyApprovedRedesignSignal(state = {}, signal = {}, reviewedAt = "") {
  if (!signal?.id) return { state, draft: null };
  const existingDraft = (state.contentDrafts || []).find((draft) => (draft.redesignTaskIds || []).includes(signal.id));
  if (existingDraft) return { state, draft: existingDraft };
  const draft = createRedesignDraftFromSignal(signal, reviewedAt);
  return {
    state: {
      ...state,
      contentDrafts: [draft, ...(state.contentDrafts || [])].slice(0, 60)
    },
    draft
  };
}

export function getDraftVisualAsset(state, draft) {
  if (!draft?.visualAssetId) return null;
  return (state.visualAssets || []).find((asset) => asset.id === draft.visualAssetId) || null;
}

function reviewArtifactId(artifactType, artifact = {}, review = {}) {
  return review.artifactId || artifact.id || artifact.assetId || artifact.lessonId || `${artifactType}-${Date.now()}`;
}

function createArtifactReviewRecord({ artifactType, artifact, review, attempt = 1, creatorId = "quality-gate", action = "automatic-grade", trigger = "pipeline", revisionBrief = null } = {}) {
  const artifactId = reviewArtifactId(artifactType, artifact, review);
  const createdAt = new Date().toISOString();
  return {
    id: `artifact-review-${artifactType}-${artifactId}-${Date.now()}-${attempt}`.replace(/[^a-z0-9_-]/gi, "-"),
    artifactType,
    artifactId,
    attempt,
    version: Number(artifact?.reviewVersion || 0) + 1,
    creatorId,
    action,
    trigger,
    score: review.score,
    grade: review.grade,
    threshold: review.threshold,
    passed: Boolean(review.passed),
    criticalBlockers: review.criticalBlockers || [],
    blockers: review.blockers || [],
    missingRequirements: review.missingRequirements || [],
    revisionInstructions: review.specificRevisionInstructions || [],
    revisionBrief: revisionBrief || null,
    createdAt
  };
}

export function getArtifactReviewHistory(state, artifactType = "", artifactId = "") {
  return (state.artifactReviewHistory || [])
    .filter((item) => (!artifactType || item.artifactType === artifactType) && (!artifactId || item.artifactId === artifactId))
    .sort((left, right) => String(right.createdAt || "").localeCompare(String(left.createdAt || "")));
}

export function recordArtifactReview(state, { artifactType, artifact = {}, review, attempt = 1, creatorId = "quality-gate", action = "automatic-grade", trigger = "pipeline", revisionBrief = null } = {}) {
  if (!artifactType || !review) return { state, record: null };
  const record = createArtifactReviewRecord({ artifactType, artifact, review, attempt, creatorId, action, trigger, revisionBrief });
  const artifactId = record.artifactId;
  const history = [record, ...(state.artifactReviewHistory || [])].slice(0, 300);
  const updateItem = (item) => {
    if (item.id !== artifactId) return item;
    const itemHistory = [record, ...(item.reviewHistory || [])].slice(0, 12);
    return {
      ...item,
      latestReview: review,
      reviewHistory: itemHistory,
      reviewVersion: record.version,
      reviewStatus: review.passed ? "passed" : review.criticalBlockers?.length ? "blocked" : "revision-required",
      updatedAt: record.createdAt
    };
  };

  return {
    state: {
      ...state,
      artifactReviewHistory: history,
      contentDrafts: artifactType === "lesson" || artifactType === "lesson_content" ? (state.contentDrafts || []).map(updateItem) : state.contentDrafts,
      visualAssets: artifactType === "image_prompt" || artifactType === "generated_visual" || artifactType === "generated_image" ? (state.visualAssets || []).map(updateItem) : state.visualAssets
    },
    record
  };
}

function gradeAndRecordArtifact(state, artifactType, artifact, options = {}) {
  const review = gradeArtifact(artifactType, artifact);
  const revisionBrief = createRevisionBrief(review, artifact, { artifactType });
  return {
    ...recordArtifactReview(state, {
    ...options,
    artifactType,
    artifact,
    review,
    revisionBrief
    }),
    review,
    revisionBrief
  };
}

export function updateVisualAssetStatus(state, assetId, status) {
  const allowedStatuses = new Set(["review", "approved", "rejected"]);
  const nextStatus = allowedStatuses.has(status) ? status : "review";
  const updatedAt = new Date().toLocaleString();
  const asset = (state.visualAssets || []).find((item) => item.id === assetId);
  if (asset && nextStatus === "approved") {
    const graded = gradeAndRecordArtifact(state, "generated_visual", asset, { action: "approval-preflight", trigger: "status-transition" });
    if (!graded.review.passed) {
      return {
        ...graded.state,
        visualAssets: (graded.state.visualAssets || []).map((item) =>
          item.id === assetId
            ? { ...item, status: "review", publicationBlocked: true, blockedReason: graded.review.criticalBlockers?.join(" ") || graded.review.missingRequirements?.join(" ") || "Visual quality gate failed." }
            : item
        )
      };
    }
    state = graded.state;
  }
  return {
    ...state,
    visualAssets: (state.visualAssets || []).map((asset) =>
      asset.id === assetId
        ? {
            ...asset,
            status: nextStatus,
            approvedAt: nextStatus === "approved" ? asset.approvedAt || updatedAt : asset.approvedAt || "",
            approvedByUserId: nextStatus === "approved" ? asset.approvedByUserId || "user-platform-admin" : asset.approvedByUserId || "",
            storageStatus:
              nextStatus === "approved" && asset.assetKind !== "generated-svg" && !asset.storagePublicUrl
                ? asset.storageStatus || "needs-storage"
                : asset.storageStatus || "",
            updatedAt
          }
        : asset
    )
  };
}

function isAllowedAssetUrl(assetUrl) {
  return /^https?:\/\/\S+/i.test(assetUrl) || /^data:image\/(png|jpeg|jpg|webp|svg\+xml);/i.test(assetUrl);
}

export function validateVisualAssetReplacement(replacement = {}) {
  const assetUrl = String(replacement.assetUrl || "").trim();
  const altText = String(replacement.altText || "").trim();
  const caption = String(replacement.caption || "").trim();
  const license = String(replacement.license || "").trim();
  const credit = String(replacement.credit || "").trim();
  const errors = [];

  if (!assetUrl) errors.push({ path: "assetUrl", message: "Replacement asset URL or data image is required." });
  if (assetUrl && !isAllowedAssetUrl(assetUrl)) {
    errors.push({ path: "assetUrl", message: "Asset URL must be http, https, or a data image URL." });
  }
  if (!altText) errors.push({ path: "altText", message: "Replacement alt text is required." });
  if (!caption) errors.push({ path: "caption", message: "Replacement caption is required." });
  if (!license) errors.push({ path: "license", message: "Replacement license is required." });
  if (!credit) errors.push({ path: "credit", message: "Replacement credit is required." });

  return {
    accepted: errors.length === 0,
    errors,
    replacement: {
      assetUrl,
      altText,
      caption,
      license,
      credit,
      storageProvider: String(replacement.storageProvider || "").trim(),
      storageBucket: String(replacement.storageBucket || "").trim(),
      storagePath: String(replacement.storagePath || "").trim(),
      storagePublicUrl: String(replacement.storagePublicUrl || "").trim(),
      storageStatus: String(replacement.storageStatus || "").trim()
    }
  };
}

export function replaceVisualAsset(state, assetId, replacement) {
  const validation = validateVisualAssetReplacement(replacement);
  if (!validation.accepted) {
    return {
      state,
      result: {
        ...validation,
        assetId,
        replaced: false
      }
    };
  }

  let replaced = false;
  const nextState = {
    ...state,
    visualAssets: (state.visualAssets || []).map((asset) => {
      if (asset.id !== assetId) return asset;
      replaced = true;
      return {
        ...asset,
        status: "review",
        assetKind: "external-url",
        assetUrl: validation.replacement.assetUrl,
        altText: validation.replacement.altText,
        caption: validation.replacement.caption,
        license: validation.replacement.license,
        credit: validation.replacement.credit,
        storageProvider: validation.replacement.storageProvider || (validation.replacement.assetUrl.includes("/storage/v1/object/") ? "supabase-storage" : ""),
        storageBucket: validation.replacement.storageBucket || "",
        storagePath: validation.replacement.storagePath || "",
        storagePublicUrl: validation.replacement.storagePublicUrl || "",
        storageStatus: validation.replacement.storageStatus || (validation.replacement.assetUrl.startsWith("http") ? "external-review" : "review-data-url"),
        replacementHistory: [
          {
            assetKind: asset.assetKind,
            assetUrl: asset.assetUrl || "",
            svg: asset.svg || "",
            replacedAt: new Date().toLocaleString()
          },
          ...(asset.replacementHistory || [])
        ].slice(0, 5),
        updatedAt: new Date().toLocaleString()
      };
    })
  };

  return {
    state: nextState,
    result: {
      accepted: replaced,
      errors: replaced ? [] : [{ path: "assetId", message: "Visual asset was not found." }],
      assetId,
      replaced
    }
  };
}

export function markVisualAssetStoragePromoted(state, assetId, storage = {}) {
  let promoted = false;
  const updatedAt = new Date().toLocaleString();
  const nextState = {
    ...state,
    visualAssets: (state.visualAssets || []).map((asset) => {
      if (asset.id !== assetId) return asset;
      promoted = true;
      return {
        ...asset,
        assetUrl: storage.publicUrl || storage.storagePublicUrl || asset.assetUrl || "",
        storageProvider: storage.provider || asset.storageProvider || "supabase-storage",
        storageBucket: storage.bucket || asset.storageBucket || "",
        storagePath: storage.path || asset.storagePath || "",
        storagePublicUrl: storage.publicUrl || storage.storagePublicUrl || "",
        storageStatus: "stored-review",
        generationMetadata: {
          ...(asset.generationMetadata || {}),
          storageContentType: storage.contentType || "",
          storageSizeBytes: storage.sizeBytes || null,
          promotedAt: updatedAt
        },
        updatedAt
      };
    })
  };

  const promotedAsset = (nextState.visualAssets || []).find((item) => item.id === assetId);
  const graded = promotedAsset
    ? gradeAndRecordArtifact(nextState, "generated_visual", promotedAsset, { action: "storage-promotion-grade", trigger: "storage-promotion" })
    : { state: nextState, review: null };
  const finalState = {
    ...graded.state,
    visualAssets: (graded.state.visualAssets || []).map((item) =>
      item.id === assetId
        ? { ...item, publicationBlocked: graded.review ? !graded.review.passed : false, blockedReason: graded.review?.passed ? "" : graded.review?.criticalBlockers?.join(" ") || graded.review?.missingRequirements?.join(" ") || "" }
        : item
    )
  };

  return {
    state: finalState,
    result: {
      accepted: promoted,
      assetId,
      promoted,
      storage,
      review: graded.review || null,
      approvalEligible: Boolean(graded.review?.passed)
    }
  };
}

export function getVisualAssetSummary(state) {
  const assets = state.visualAssets || [];
  return {
    total: assets.length,
    review: assets.filter((asset) => asset.status === "review").length,
    approved: assets.filter((asset) => asset.status === "approved").length,
    rejected: assets.filter((asset) => asset.status === "rejected").length,
    openAiGenerated: assets.filter((asset) => asset.assetKind === "openai-generated-image").length,
    storageBacked: assets.filter((asset) => asset.storagePublicUrl || asset.storagePath).length,
    productionReady: assets.filter(
      (asset) => asset.status === "approved" && asset.altText && asset.caption && asset.license && (asset.assetKind === "generated-svg" || asset.storagePublicUrl)
    ).length,
    needsStorage: assets.filter((asset) => asset.assetKind !== "generated-svg" && !asset.storagePublicUrl).length
  };
}

export function getVisualLearningAgentAudit(state) {
  return getProjectVisualAudit(state, { includeFullCatalog: true });
}

export {
  getContentBatchReviewState,
  getFullLibraryVisualCatalogSummary,
  getLessonVisualCatalog,
  getReviewableContentBatchIds,
  getVisualProductionBatchPlan
};

export function getVisualLearningOpportunity(state, slotId) {
  return findVisualOpportunity(state, slotId);
}

export function addGeneratedVisualAsset(state, generation) {
  const asset = createGeneratedVisualAsset(generation);
  const promptPlan = { ...(generation.slot || {}), prompt: generation.prompt };
  const promptReview = gradeImagePrompt(promptPlan);
  const generatedReview = gradeGeneratedVisual(asset);
  const job = {
    id: `visual-job-${Date.now()}`,
    status: "generated-review",
    slotId: generation.slot.id,
    lessonId: generation.slot.lessonId,
    title: generation.slot.title,
    model: generation.model,
    prompt: generation.prompt,
    assetId: asset.id,
    estimatedCostCents: generation.estimatedCostCents || null,
    reviewRequired: true,
    usage: generation.usage || null,
    plan: generation.generationPlan || null,
    promptReview,
    generatedVisualReview: generatedReview,
    revisionAttempt: generation.revisionAttempt || 1,
    createdAt: asset.createdAt
  };

  let nextState = {
    ...state,
    visualAssets: [asset, ...(state.visualAssets || [])].slice(0, 160),
    visualGenerationJobs: [job, ...(state.visualGenerationJobs || [])].slice(0, 40)
  };
  const promptRecorded = recordArtifactReview(nextState, {
    artifactType: "image_prompt",
    artifact: { ...asset, prompt: generation.prompt },
    review: promptReview,
    attempt: generation.revisionAttempt || 1,
    creatorId: generation.creatorId || "visual-learning-agent",
    trigger: "visual-generation"
  });
  nextState = promptRecorded.state;
  const generatedRecorded = recordArtifactReview(nextState, {
    artifactType: "generated_visual",
    artifact: nextState.visualAssets.find((item) => item.id === asset.id) || asset,
    review: generatedReview,
    attempt: generation.revisionAttempt || 1,
    creatorId: generation.creatorId || "visual-learning-agent",
    trigger: "visual-generation"
  });
  nextState = generatedRecorded.state;

  return {
    state: nextState,
    result: {
      accepted: true,
      generated: true,
      slotId: generation.slot.id,
      assetId: asset.id,
      model: generation.model,
      estimatedCostCents: generation.estimatedCostCents || null,
      usage: generation.usage || null,
      promptReview,
      generatedVisualReview: generatedReview,
      reviewRecordIds: [promptRecorded.record?.id, generatedRecorded.record?.id].filter(Boolean)
    }
  };
}

export function getAgentToolRegistry() {
  return getToolRegistry();
}

export function getAgentToolGatewaySummary(state) {
  return getToolGatewaySummary(state);
}

export function runAgentTool(state, request) {
  return executeToolGateway(state, request);
}

export function getAiTutorToolContractSummary() {
  return {
    ...aiTutorToolContract,
    stageCount: aiTutorToolContract.responseStages.length,
    allowedCount: aiTutorToolContract.allowedBehaviors.length,
    blockedCount: aiTutorToolContract.blockedBehaviors.length,
    permittedToolCount: aiTutorToolContract.permittedTools.length,
    auditSignalCount: aiTutorToolContract.auditSignals.length
  };
}

export function getAgentReviewQueue(state) {
  const visualItems = (state.visualAssets || [])
    .filter((asset) => asset.status === "review")
    .map((asset) => ({
      id: `visual:${asset.id}`,
      type: "visual",
      title: asset.title || "Generated visual",
      status: asset.status,
      priority: asset.assetKind === "openai-generated-image" ? "high" : "medium",
      ownerAgentId: "visual-learning",
      summary: asset.caption || asset.altText || "Visual asset needs human approval before student-facing use.",
      score: asset.latestReview?.score ?? null,
      grade: asset.latestReview?.grade || "",
      threshold: asset.latestReview?.threshold ?? null,
      passed: Boolean(asset.latestReview?.passed),
      blockers: asset.latestReview?.criticalBlockers || asset.latestReview?.blockers || [],
      revisionInstructions: asset.latestReview?.specificRevisionInstructions || [],
      reviewHistory: asset.reviewHistory || [],
      nextAction: "Approve or reject the visual asset after checking accuracy, age fit, license, caption, and alt text.",
      actions: ["approve", "request_revision", "reject"]
    }));

  const contentItems = (state.contentDrafts || [])
    .filter((draft) => draft.status === "review" || draft.publicationBlocked)
    .map((draft) => {
      const audit = getDraftEvidenceAudit(draft);
      const completeness = getContentDraftCompletenessReview(draft);
      const visualAsset = getDraftVisualAsset(state, draft);
      const truthReview = getContentDraftTruthReview(draft);
      const truthBlocked = draft.truthReviewStatus !== "approved";
      const blockedReason =
        draft.blockedReason ||
        (audit.required && !audit.passed
          ? `Missing evidence moves: ${audit.missing.map((move) => move.label).join(", ")}`
          : !completeness.passed
            ? `Lesson body incomplete: ${completeness.issues.join(" ")}`
          : visualAsset && visualAsset.status !== "approved"
            ? `Visual asset is ${visualAsset.status}.`
            : truthBlocked
              ? `Truth review required: ${truthReview.summary}`
              : "Needs academic, accessibility, licensing, and age-fit review.");
      return {
        id: `content:${draft.id}`,
        type: "content",
        title: draft.title,
        status: draft.publicationBlocked ? "blocked" : draft.status,
        priority: draft.publicationBlocked || (audit.required && !audit.passed) || !completeness.passed || truthBlocked ? "high" : "medium",
        ownerAgentId: truthBlocked ? "truth-policy" : !completeness.passed ? "content-ops" : "content-ops",
        summary: blockedReason,
        score: draft.latestReview?.score ?? null,
        grade: draft.latestReview?.grade || "",
        threshold: draft.latestReview?.threshold ?? null,
        passed: Boolean(draft.latestReview?.passed),
        blockers: draft.latestReview?.criticalBlockers || draft.latestReview?.blockers || [],
        revisionInstructions: draft.latestReview?.specificRevisionInstructions || [],
        reviewHistory: draft.reviewHistory || [],
        nextAction: draft.publicationBlocked
          ? "Fix the blocked gate before publishing."
          : !completeness.passed
            ? "Content Ops should complete lesson sections, helper notes, misconception repair, visuals, quiz, and source cards."
          : truthBlocked
            ? "Truth-policy reviewer should confirm source grounding, age fit, and claim accuracy before publication."
            : "Approve to publish or reject back to draft.",
        actions: ["approve", "request_revision", "reject"]
      };
    });

  const batchItems = getReviewableContentBatchIds(state)
    .map((sourceBatchId) => getContentBatchReviewState(state, sourceBatchId))
    .filter((batch) => !["approved", "rejected", "published", "partial"].includes(batch.status))
    .map((batch) => ({
      id: `batch:${batch.sourceBatchId}`,
      type: "batch",
      title: batch.title,
      status: batch.status,
      priority: batch.passed ? "medium" : "high",
      ownerAgentId: "content-ops",
      summary: `${batch.passedLessons}/${batch.totalLessons} lessons meet the batch quality bar; grade ${batch.grade}; subjects: ${batch.subjects.join(", ")}.`,
      score: batch.score,
      grade: batch.grade,
      threshold: batch.threshold,
      passed: batch.passed,
      blockers: batch.blockers,
      revisionInstructions: batch.revisionInstructions,
      reviewHistory: batch.reviewHistory,
      nextAction: batch.passed
        ? "Approve the batch before individual lesson publication, or request revision if the whole set needs a stronger classroom standard."
        : "Request revision before any lesson in this batch can be treated as a production-grade middle-school batch.",
      actions: ["approve", "request_revision", "reject"]
    }));

  const toolItems = (state.toolCallLogs || [])
    .filter((log) => log.requiresHumanReview && !log.reviewStatus)
    .map((log) => ({
      id: `tool:${log.id}`,
      type: "tool",
      title: log.toolName,
      status: log.status,
      priority: log.externalRisk === "api-cost" || log.status === "blocked" ? "high" : "medium",
      ownerAgentId: log.ownerAgentId,
      summary: log.summary,
      nextAction: "Review the tool output before it affects students, curriculum, content, or generated assets.",
      actions: ["approve", "reject"]
    }));

  const aiItems = (state.aiLogs || [])
    .filter((log) => {
      const needsTruthReview = log.requiresHumanReview || log.needsExternalResearch || (typeof log.truthScore === "number" && log.truthScore < 4);
      return (log.flagged || needsTruthReview) && !log.reviewStatus;
    })
    .map((log) => {
      const truthIssues = log.truthIssues || log.truthReview?.issues || [];
      const providerReview = log.providerReview || {};
      const providerIssues = providerReview.issues || [];
      const reviewIssues = [...new Set([...truthIssues, ...providerIssues])];
      const truthSummary = reviewIssues.length ? reviewIssues.join(" ") : `Truth-policy score ${log.truthScore || "n/a"}/5.`;
      const providerStatus = log.providerAttemptStatus || (log.provider ? "accepted" : "local-only");
      return {
        id: `ai:${log.id}`,
        type: "ai",
        title: log.flagged ? `${log.lessonTitle} AI safety flag` : `${log.lessonTitle} tutor review`,
        status: log.flagged ? log.type : log.reviewStatus || log.truthReviewStatus || "needs-human-review",
        priority: log.flagged || log.needsExternalResearch || providerStatus !== "accepted" ? "high" : "medium",
        ownerAgentId: log.flagged ? "ai-safety" : "truth-policy",
        summary: log.flagged ? log.analysis || log.response : `${truthSummary}${providerStatus !== "local-only" ? ` Provider status: ${providerStatus}.` : ""}`,
        score: typeof providerReview.average === "number" ? Math.round(providerReview.average * 20) : typeof log.truthScore === "number" ? log.truthScore * 20 : null,
        grade: typeof providerReview.average === "number"
          ? providerReview.average >= 4.5 ? "A" : providerReview.average >= 4 ? "B" : providerReview.average >= 3 ? "C" : providerReview.average >= 2 ? "D" : "F"
          : "",
        threshold: 80,
        passed: providerStatus === "accepted" && !log.flagged && !log.requiresHumanReview,
        blockers: log.flagged ? [log.analysis || "Safety review required."] : reviewIssues,
        revisionInstructions: providerIssues.length ? providerIssues : log.needsExternalResearch ? ["Truth-policy review requires staff-side source checking."] : [],
        reviewHistory: log.reviewHistory || [],
        providerStatus,
        providerReview,
        nextAction: log.flagged
          ? "Parent or teacher should review the flagged interaction and follow the safety escalation path."
          : providerStatus === "quality-rejected"
            ? "Request revision or reject the provider response; the student already received the local tutor fallback."
            : "Approve, request revision, or reject after checking the tutor reasoning, lesson grounding, and source-research need.",
        actions: ["approve", "request_revision", "reject"]
      };
    });

  const finalRedesignReviewStatuses = ["approved", "rejected", "revision-requested", "reviewed", "implemented"];
  const redesignItems = (state.lessonImprovementSignals || [])
    .filter((signal) => !finalRedesignReviewStatuses.includes(signal.reviewStatus || ""))
    .map((signal) => ({
      id: `redesign:${signal.id}`,
      type: "redesign",
      title: signal.title || "Lesson redesign task",
      status: signal.status || "needs-redesign",
      priority: signal.feedback === "needs-picture" || signal.feedback === "needs-redesign" ? "high" : "medium",
      ownerAgentId: signal.ownerAgentId || "fun-retention",
      summary: signal.why || signal.change || "Lesson redesign signal needs manager review before changing student-facing content.",
      score: null,
      grade: "",
      threshold: null,
      passed: false,
      blockers: [],
      revisionInstructions: signal.change ? [signal.change] : [],
      reviewHistory: signal.reviewHistory || [],
      nextAction: "Approve to assign the redesign task, request revision for a stronger fix, or reject if the evidence is weak.",
      actions: ["approve", "request_revision", "reject"]
    }));

  const items = [...aiItems, ...redesignItems, ...batchItems, ...visualItems, ...contentItems, ...toolItems].slice(0, 80);
  return {
    total: items.length,
    visualReview: visualItems.length,
    contentReview: contentItems.length,
    batchReview: batchItems.length,
    toolReview: toolItems.length,
    aiReview: aiItems.length,
    redesignReview: redesignItems.length,
    highPriority: items.filter((item) => item.priority === "high").length,
    items
  };
}

function getArtifactForReviewItem(state = {}, item = {}) {
  const [, id = ""] = String(item.id || "").split(":");
  if (item.type === "visual") return (state.visualAssets || []).find((asset) => asset.id === id) || null;
  if (item.type === "content") return (state.contentDrafts || []).find((draft) => draft.id === id) || null;
  if (item.type === "batch") return getContentBatchReviewState(state, id);
  if (item.type === "tool") return (state.toolCallLogs || []).find((log) => log.id === id) || null;
  if (item.type === "ai") return (state.aiLogs || []).find((log) => log.id === id) || null;
  if (item.type === "redesign") return (state.lessonImprovementSignals || []).find((signal) => signal.id === id) || null;
  return null;
}

function getReviewDossierSections(state = {}, item = {}, artifact = null) {
  if (item.type === "visual") {
    const review = artifact?.latestReview || {};
    return {
      grade: review.grade || item.grade || "",
      score: review.score ?? item.score ?? null,
      threshold: review.threshold ?? item.threshold ?? null,
      categoryScores: review.scoreByCategory || [],
      blockers: review.criticalBlockers || review.blockers || item.blockers || [],
      issues: [...(review.visualIssues || []), ...(review.teachingIssues || []), ...(review.studentConfusionRisks || [])],
      missingRequirements: review.missingRequirements || [],
      revisionInstructions: review.specificRevisionInstructions || item.revisionInstructions || [],
      reviewHistory: artifact?.reviewHistory || item.reviewHistory || [],
      sourcePrompt: artifact?.sourcePrompt || review.regenerationPrompt || "",
      reviewChecklist: artifact?.reviewChecklist || [],
      publishImpact: artifact?.status === "approved"
        ? "Already approved for student-facing lesson placement."
        : artifact?.storagePublicUrl || artifact?.assetKind === "generated-svg"
          ? "Approval will make this asset available to the lesson player."
          : "Approval is blocked until generated assets are promoted to storage."
    };
  }

  if (item.type === "content") {
    const completeness = getContentDraftCompletenessReview(artifact || {});
    const truthReview = getContentDraftTruthReview(artifact || {});
    const evidence = getDraftEvidenceAudit(artifact || {});
    const review = artifact?.latestReview || {};
    return {
      grade: review.grade || item.grade || "",
      score: review.score ?? item.score ?? null,
      threshold: review.threshold ?? item.threshold ?? null,
      categoryScores: review.scoreByCategory || [],
      blockers: review.criticalBlockers || review.blockers || item.blockers || [],
      issues: [
        ...(!completeness.passed ? completeness.issues : []),
        ...(truthReview.requiresHumanReview ? [`Truth And Fact-Check review required: ${truthReview.summary}`] : []),
        ...(truthReview.issues || []),
        ...(evidence.required && !evidence.passed ? evidence.missing.map((move) => `Missing evidence move: ${move.label}`) : [])
      ],
      missingRequirements: review.missingRequirements || [],
      revisionInstructions: review.specificRevisionInstructions || item.revisionInstructions || [],
      reviewHistory: artifact?.reviewHistory || item.reviewHistory || [],
      sourcePrompt: "",
      reviewChecklist: [
        `Lesson body: ${completeness.passed ? "complete" : completeness.status}`,
        `Truth policy: ${truthReview.status}`,
        `Evidence guidance: ${evidence.required ? evidence.status : "not required"}`
      ],
      publishImpact: artifact?.status === "published"
        ? "Already published to the student lesson catalog."
        : "Approval attempts publication and stores manager truth approval if every gate passes."
    };
  }

  if (item.type === "tool") {
    return {
      grade: "",
      score: null,
      threshold: null,
      categoryScores: [],
      blockers: artifact?.status === "blocked" ? [artifact.summary || "Tool call was blocked."] : [],
      issues: artifact?.error ? [artifact.error] : [],
      missingRequirements: [],
      revisionInstructions: [],
      reviewHistory: [],
      sourcePrompt: artifact?.input ? JSON.stringify(artifact.input, null, 2) : "",
      reviewChecklist: [
        "Confirm the tool was run by an allowed role.",
        "Confirm source claims or generated assets are not student-facing until approved.",
        "Reject if the payload is unsafe, off-scope, or not source-grounded."
      ],
      publishImpact: "Approval may apply staff-side tool output, such as creating a draft from reviewed research."
    };
  }

  if (item.type === "batch") {
    return {
      grade: artifact?.grade || item.grade || "",
      score: artifact?.score ?? item.score ?? null,
      threshold: artifact?.threshold ?? item.threshold ?? null,
      categoryScores: [
        { id: "lessonQuality", label: "Lesson quality", score: artifact?.passed ? 100 : artifact?.score || 0, passed: Boolean(artifact?.passed), feedback: `${artifact?.passedLessons || 0}/${artifact?.totalLessons || 0} lessons meet the batch quality bar.` },
        { id: "coverage", label: "Grade 6 Batch 1 coverage", score: artifact?.totalLessons >= 5 ? 100 : 60, passed: artifact?.totalLessons >= 5, feedback: `${artifact?.subjects?.join(", ") || "No subjects"} included.` },
        { id: "reviewGates", label: "Review gates", score: artifact?.status === "approved" ? 100 : 85, passed: true, feedback: "Batch approval is separate from individual lesson publication." }
      ],
      blockers: artifact?.blockers || item.blockers || [],
      issues: [],
      missingRequirements: [],
      revisionInstructions: artifact?.revisionInstructions || item.revisionInstructions || [],
      reviewHistory: artifact?.reviewHistory || item.reviewHistory || [],
      sourcePrompt: JSON.stringify(
        {
          sourceBatchId: artifact?.sourceBatchId,
          lessonIds: artifact?.lessonIds,
          subjects: artifact?.subjects,
          gradeLevels: artifact?.gradeLevels
        },
        null,
        2
      ),
      reviewChecklist: [
        "Confirm the batch matches the documented Bridge Academy Grade 6 Batch 1 scope.",
        "Confirm every lesson has app-led teaching, visual supports, group homework, tutor handoff, quiz, and source cards.",
        "Approval marks the batch manager-reviewed; each lesson still needs its individual publication gate."
      ],
      publishImpact: "Approval stamps all lessons in this batch as manager-reviewed for batch quality, but does not publish them automatically."
    };
  }

  if (item.type === "ai") {
    const providerReview = artifact?.providerReview || {};
    const providerScores = providerReview.scores || {};
    const categoryScores = Object.entries(providerScores).map(([id, score]) => ({
      id,
      label: id.replace(/([A-Z])/g, " $1").replace(/^./, (value) => value.toUpperCase()),
      score: Math.round(Number(score || 0) * 20),
      passed: Number(score || 0) >= 4,
      feedback: Number(score || 0) >= 4 ? "Passed the tutor quality threshold." : "Revise this category before treating the provider response as cleared."
    }));
    return {
      grade: typeof providerReview.average === "number"
        ? providerReview.average >= 4.5 ? "A" : providerReview.average >= 4 ? "B" : providerReview.average >= 3 ? "C" : providerReview.average >= 2 ? "D" : "F"
        : "",
      score: typeof providerReview.average === "number" ? Math.round(providerReview.average * 20) : typeof artifact?.truthScore === "number" ? artifact.truthScore * 20 : null,
      threshold: 80,
      categoryScores,
      blockers: artifact?.flagged ? [artifact.analysis || "Tutor event was flagged."] : [],
      issues: [...(artifact?.truthIssues || artifact?.truthReview?.issues || []), ...(providerReview.issues || [])],
      missingRequirements: [],
      revisionInstructions: providerReview.issues || [],
      reviewHistory: artifact?.reviewHistory || [],
      sourcePrompt: artifact?.input || "",
      reviewChecklist: [
        "Check that the tutor guided instead of giving direct answers.",
        "Check that reasoning matches the lesson and grade band.",
        "Check the provider moderation result and model/request metadata.",
        "Escalate unsafe, personal, or out-of-scope student input."
      ],
      publishImpact: `Provider status: ${artifact?.providerAttemptStatus || (artifact?.provider ? "accepted" : "local-only")}. Reviewed tutor events become quality evidence for improving explanations and safety rules.`
    };
  }

  if (item.type === "redesign") {
    return {
      grade: "",
      score: null,
      threshold: null,
      categoryScores: [],
      blockers: artifact?.status === "blocked" ? [artifact.why || "Redesign task is blocked."] : [],
      issues: artifact?.note ? [artifact.note] : [],
      missingRequirements: [],
      revisionInstructions: [artifact?.change, artifact?.note].filter(Boolean),
      reviewHistory: artifact?.reviewHistory || item.reviewHistory || [],
      sourcePrompt: [
        artifact?.why ? `Why: ${artifact.why}` : "",
        artifact?.change ? `Change: ${artifact.change}` : "",
        artifact?.sourceIds?.length ? `Sources: ${artifact.sourceIds.join(", ")}` : ""
      ].filter(Boolean).join("\n"),
      reviewChecklist: [
        "Confirm the signal comes from learner/tutor/teacher evidence.",
        "Confirm the proposed change names an actual lesson, visual, tutor, or reteach improvement.",
        "Do not publish the redesign directly; approval assigns the task for content revision."
      ],
      publishImpact: "Approval assigns the redesign task to the responsible agent. Student-facing lessons still require content, visual, truth, and manager publication gates."
    };
  }

  return {
    grade: item.grade || "",
    score: item.score ?? null,
    threshold: item.threshold ?? null,
    categoryScores: [],
    blockers: item.blockers || [],
    issues: [],
    missingRequirements: [],
    revisionInstructions: item.revisionInstructions || [],
    reviewHistory: item.reviewHistory || [],
    sourcePrompt: "",
    reviewChecklist: [],
    publishImpact: item.nextAction || ""
  };
}

export function getManagerReviewDossier(state = {}, reviewId = "") {
  const queue = getAgentReviewQueue(state);
  const item = queue.items.find((queueItem) => queueItem.id === reviewId) || null;
  if (!item) {
    return {
      found: false,
      reviewId,
      summary: "Review item was not found."
    };
  }
  const artifact = getArtifactForReviewItem(state, item);
  const sections = getReviewDossierSections(state, item, artifact);
  return {
    found: true,
    reviewId,
    item,
    artifactId: artifact?.id || "",
    artifactType: item.type,
    title: item.title,
    ownerAgentId: item.ownerAgentId,
    priority: item.priority,
    status: item.status,
    summary: item.summary,
    nextAction: item.nextAction,
    actions: item.actions,
    ...sections
  };
}

export function getAgentCommandCenter(state) {
  const gateway = getAgentToolGatewaySummary(state);
  const reviewQueue = getAgentReviewQueue(state);
  const tutorContract = getAiTutorToolContractSummary();
  return {
    gateway,
    reviewQueue,
    tutorContract,
    nextAction:
      reviewQueue.total > 0
        ? "Work through high-priority review items before publishing content or exposing generated assets."
        : "Run lesson audits, content review, and preview checks as the next manager verification loop."
  };
}

export function resolveAgentReviewItem(state, reviewId, decision = "approve") {
  const [type, id] = String(reviewId || "").split(":");
  const normalizedDecision = ["approve", "reject", "request_revision", "reviewed"].includes(decision) ? decision : "approve";
  const reviewedAt = new Date().toLocaleString();

  if (type === "visual") {
    const asset = (state.visualAssets || []).find((item) => item.id === id);
    if (!asset) {
      return { state, result: { accepted: false, reviewId, decision: normalizedDecision, summary: "Visual review item was not found." } };
    }
    const preflight = gradeAndRecordArtifact(state, "generated_visual", asset, { action: "manager-preflight", trigger: "manager-review" });
    if (normalizedDecision === "approve" && !preflight.review.passed) {
      return {
        state: {
          ...preflight.state,
          visualAssets: (preflight.state.visualAssets || []).map((item) => item.id === id ? { ...item, status: "review", publicationBlocked: true, blockedReason: preflight.review.criticalBlockers?.join(" ") || preflight.review.missingRequirements?.join(" ") || "Visual quality gate failed." } : item)
        },
        result: {
          accepted: false,
          reviewId,
          decision: normalizedDecision,
          summary: "Visual approval blocked by the artifact quality gate.",
          review: preflight.review,
          revisionBrief: createRevisionBrief(preflight.review, asset, { artifactType: "generated_visual" })
        }
      };
    }
    const nextStatus = normalizedDecision === "approve" ? "approved" : normalizedDecision === "request_revision" ? "review" : "rejected";
    const updatedState = updateVisualAssetStatus(preflight.state, id, nextStatus);
    const decisionRecord = createArtifactReviewRecord({
      artifactType: "generated_visual",
      artifact: asset,
      review: preflight.review,
      attempt: asset.reviewVersion || 1,
      creatorId: "manager",
      action: normalizedDecision,
      trigger: "manager-review",
      revisionBrief: createRevisionBrief(preflight.review, asset, { artifactType: "generated_visual" })
    });
    const revisionBrief = createRevisionBrief(preflight.review, asset, { artifactType: "generated_visual" });
    const revisionJob = normalizedDecision === "request_revision"
      ? {
          id: `visual-revision-${asset.id}-${Date.now()}`,
          status: "revision-requested",
          assetId: asset.id,
          lessonId: asset.lessonId || "",
          creatorId: "visual-learning-agent",
          attempt: Number(asset.reviewVersion || 0) + 1,
          prompt: revisionBrief.regenerationPrompt,
          revisionBrief,
          createdAt: reviewedAt
        }
      : null;
    return {
      state: {
        ...updatedState,
        artifactReviewHistory: [decisionRecord, ...(updatedState.artifactReviewHistory || [])].slice(0, 300),
        visualGenerationJobs: revisionJob ? [revisionJob, ...(updatedState.visualGenerationJobs || [])].slice(0, 40) : updatedState.visualGenerationJobs,
        visualAssets: (updatedState.visualAssets || []).map((item) => item.id === id ? { ...item, reviewHistory: [decisionRecord, ...(item.reviewHistory || [])].slice(0, 12), latestReviewDecision: normalizedDecision, reviewStatus: normalizedDecision === "approve" ? "approved" : normalizedDecision === "request_revision" ? "revision-required" : "rejected" } : item)
      },
      result: {
        accepted: true,
        reviewId,
        decision: normalizedDecision,
        summary: normalizedDecision === "request_revision" ? "Visual asset returned to the creator for revision." : `Visual asset marked ${nextStatus}.`,
        review: preflight.review,
        revisionBrief
      }
    };
  }

  if (type === "content") {
    const exists = (state.contentDrafts || []).some((draft) => draft.id === id);
    if (!exists) {
      return { state, result: { accepted: false, reviewId, decision: normalizedDecision, summary: "Content review item was not found." } };
    }
    const nextStatus = normalizedDecision === "approve" ? "published" : "draft";
    const nextState = updateContentDraftStatus(state, id, nextStatus, {
      truthReviewed: normalizedDecision === "approve",
      reviewedAt,
      reviewedBy: "manager"
    });
    const draft = (nextState.contentDrafts || []).find((item) => item.id === id);
    const accepted = normalizedDecision === "reject" || normalizedDecision === "request_revision" || draft?.status === "published";
    return {
      state: nextState,
      result: {
        accepted,
        reviewId,
        decision: normalizedDecision,
        summary: accepted
          ? normalizedDecision === "request_revision" ? "Content item returned to the creator for revision." : `Content item moved to ${draft.status}.`
          : draft?.blockedReason || "Content item could not publish because a review gate is still blocking it."
      }
    };
  }

  if (type === "batch") {
    const batch = getContentBatchReviewState(state, id);
    if (!batch.totalLessons) {
      return { state, result: { accepted: false, reviewId, decision: normalizedDecision, summary: "Batch review item was not found." } };
    }
    const nextStatus =
      normalizedDecision === "approve"
        ? "approved"
        : normalizedDecision === "request_revision"
          ? "revision-required"
          : "rejected";
    const reviewRecord = {
      action: normalizedDecision,
      status: nextStatus,
      reviewer: "manager",
      createdAt: reviewedAt,
      score: batch.score,
      grade: batch.grade,
      sourceBatchId: id,
      revisionInstructions: normalizedDecision === "request_revision" ? batch.revisionInstructions : []
    };
    const nextState = {
      ...state,
      contentDrafts: (state.contentDrafts || []).map((draft) =>
        draft.sourceBatchId === id
          ? {
              ...draft,
              batchReviewStatus: nextStatus,
              batchReviewedAt: reviewedAt,
              batchReviewedBy: "manager",
              batchReviewScore: batch.score,
              batchReviewGrade: batch.grade,
              batchReviewHistory: [reviewRecord, ...(draft.batchReviewHistory || [])].slice(0, 12),
              reviewNotes: [draft.reviewNotes, `Batch review ${nextStatus}: ${batch.title}.`].filter(Boolean).join("\n"),
              updatedAt: reviewedAt
            }
          : draft
      )
    };
    return {
      state: nextState,
      result: {
        accepted: true,
        reviewId,
        decision: normalizedDecision,
        sourceBatchId: id,
        affectedDrafts: batch.totalLessons,
        summary:
          normalizedDecision === "approve"
            ? `${batch.title} approved for individual lesson publication review.`
            : normalizedDecision === "request_revision"
              ? `${batch.title} returned for batch-level revision.`
              : `${batch.title} rejected at batch review.`
      }
    };
  }

  if (type === "tool") {
    let found = false;
    let reviewedLog = null;
    let nextState = {
      ...state,
      toolCallLogs: (state.toolCallLogs || []).map((log) => {
        if (log.id !== id) return log;
        found = true;
        reviewedLog = {
          ...log,
          reviewStatus: normalizedDecision === "reject" ? "rejected" : "approved",
          reviewedAt,
          reviewedBy: "manager"
        };
        return reviewedLog;
      })
    };
    let appliedDraft = null;
    if (found && normalizedDecision === "approve") {
      const applied = applyApprovedResearchToolLog(nextState, reviewedLog, reviewedAt);
      nextState = applied.state;
      appliedDraft = applied.draft;
    }
    return {
      state: nextState,
      result: {
        accepted: found,
        reviewId,
        decision: normalizedDecision,
        appliedDraftId: appliedDraft?.id || "",
        summary: found
          ? appliedDraft
            ? `Tool call review marked ${normalizedDecision}; created content draft ${appliedDraft.title}.`
            : `Tool call review marked ${normalizedDecision}.`
          : "Tool review item was not found."
      }
    };
  }

  if (type === "ai") {
    let found = false;
    let reviewedLog = null;
    const nextStatus =
      normalizedDecision === "approve"
        ? "approved"
        : normalizedDecision === "request_revision"
          ? "revision-requested"
          : normalizedDecision === "reject"
            ? "rejected"
            : "reviewed";
    const nextState = {
      ...state,
      aiLogs: (state.aiLogs || []).map((log) => {
        if (log.id !== id) return log;
        found = true;
        const providerIssues = log.providerReview?.issues || [];
        const revisionInstructions = normalizedDecision === "request_revision"
          ? (providerIssues.length ? providerIssues : log.needsExternalResearch ? ["Complete staff-side source checking before another provider attempt."] : ["Re-run the tutor quality gate with a clearer, grade-appropriate explanation."])
          : [];
        const reviewRecord = {
          action: normalizedDecision,
          status: nextStatus,
          reviewer: "manager",
          createdAt: reviewedAt,
          providerStatus: log.providerAttemptStatus || (log.provider ? "accepted" : "local-only"),
          grade: typeof log.providerReview?.average === "number"
            ? log.providerReview.average >= 4.5 ? "A" : log.providerReview.average >= 4 ? "B" : log.providerReview.average >= 3 ? "C" : log.providerReview.average >= 2 ? "D" : "F"
            : "",
          score: typeof log.providerReview?.average === "number" ? Math.round(log.providerReview.average * 20) : null,
          revisionInstructions
        };
        reviewedLog = {
          ...log,
          reviewStatus: nextStatus,
          reviewedAt,
          reviewedBy: "manager",
          reviewHistory: [reviewRecord, ...(log.reviewHistory || [])].slice(0, 20),
          providerRevisionInstructions: revisionInstructions
        };
        return reviewedLog;
      })
    };
    return {
      state: nextState,
      result: {
        accepted: found,
        reviewId,
        decision: normalizedDecision,
        summary: found
          ? normalizedDecision === "request_revision"
            ? "AI tutor response returned for provider revision with manager instructions."
            : `AI tutor review marked ${nextStatus}.`
          : "AI review item was not found.",
        revisionInstructions: reviewedLog?.providerRevisionInstructions || []
      }
    };
  }

  if (type === "redesign") {
    let found = false;
    let reviewedSignal = null;
    const nextStatus =
      normalizedDecision === "approve"
        ? "approved"
        : normalizedDecision === "request_revision"
          ? "revision-requested"
          : "rejected";
    const nextState = {
      ...state,
      lessonImprovementSignals: (state.lessonImprovementSignals || []).map((signal) => {
        if (signal.id !== id) return signal;
        found = true;
        reviewedSignal = {
          ...signal,
          status: nextStatus === "approved" ? "assigned" : signal.status || "needs-redesign",
          reviewStatus: nextStatus,
          reviewedAt,
          reviewedBy: "manager",
          reviewHistory: [
            {
              action: normalizedDecision,
              status: nextStatus,
              reviewer: "manager",
              createdAt: reviewedAt,
              revisionInstructions:
                normalizedDecision === "request_revision"
                  ? [signal.change || "Revise this redesign task with a clearer evidence-backed improvement."]
                  : []
            },
            ...(signal.reviewHistory || [])
          ].slice(0, 12)
        };
        return reviewedSignal;
      })
    };
    const applied =
      found && normalizedDecision === "approve"
        ? applyApprovedRedesignSignal(nextState, reviewedSignal, reviewedAt)
        : { state: nextState, draft: null };
    return {
      state: applied.state,
      result: {
        accepted: found,
        reviewId,
        decision: normalizedDecision,
        appliedDraftId: applied.draft?.id || "",
        summary: found
          ? normalizedDecision === "approve"
            ? applied.draft
              ? `Lesson redesign task approved and created content draft ${applied.draft.title}.`
              : "Lesson redesign task approved and assigned for content revision."
            : normalizedDecision === "request_revision"
              ? "Lesson redesign task returned for a stronger revision brief."
              : "Lesson redesign task rejected."
          : "Lesson redesign review item was not found."
      }
    };
  }

  return {
    state,
    result: {
      accepted: false,
      reviewId,
      decision: normalizedDecision,
      summary: "Review item type is not supported."
    }
  };
}

export function updateContentDraftStatus(state, draftId, status, options = {}) {
  let publishedLesson = null;
  let removePublishedDraftId = status === "published" ? "" : draftId;
  const artifactReviewRecords = [];
  const contentDrafts = (state.contentDrafts || []).map((draft) => {
    if (draft.id !== draftId) return draft;

    const contentReview = {
      ...gradeLessonContent(createPublishedLessonFromDraft(normalizeContentDraft(draft), { publishedBy: "quality-gate" })),
      artifactId: draft.id
    };
    const contentReviewRecord = createArtifactReviewRecord({
      artifactType: "lesson",
      artifact: draft,
      review: contentReview,
      attempt: Number(draft.reviewVersion || 0) + 1,
      creatorId: options.reviewedBy || "content-ops",
      action: status === "published" ? "publication-preflight" : "status-grade",
      trigger: "content-pipeline",
      revisionBrief: createRevisionBrief(contentReview, draft, { artifactType: "lesson" })
    });
    artifactReviewRecords.push(contentReviewRecord);
    const withContentReview = (nextDraft) => ({
      ...nextDraft,
      latestReview: contentReview,
      reviewHistory: [contentReviewRecord, ...(draft.reviewHistory || [])].slice(0, 12),
      reviewVersion: contentReviewRecord.version,
      reviewStatus: contentReview.passed ? "passed" : contentReview.criticalBlockers?.length ? "blocked" : "revision-required"
    });
    const audit = getDraftEvidenceAudit(draft);
    const completeness = getContentDraftCompletenessReview(draft);
    const truthReview = getContentDraftTruthReview(draft);
    if (status === "published" && !audit.passed) {
      removePublishedDraftId = draft.id;
      return withContentReview({
        ...draft,
        ...normalizeContentDraft(draft),
        evidenceAudit: summarizeEvidenceAudit(audit),
        publicationBlocked: true,
        blockedReason: `Missing evidence moves: ${audit.missing.map((move) => move.label).join(", ")}`,
        updatedAt: new Date().toLocaleString()
      });
    }

    if (status === "published" && !completeness.passed) {
      removePublishedDraftId = draft.id;
      return withContentReview({
        ...draft,
        ...normalizeContentDraft(draft),
        lessonBodyReady: false,
        teachingCompletenessStatus: completeness.status,
        teachingCompletenessIssues: completeness.issues,
        contentCompletenessReview: completeness,
        publicationBlocked: true,
        blockedReason: `Lesson body is incomplete: ${completeness.issues.join(" ")}`,
        updatedAt: new Date().toLocaleString()
      });
    }

    const visualAsset = getDraftVisualAsset(state, draft);
    if (status === "published" && visualAsset && visualAsset.status !== "approved") {
      removePublishedDraftId = draft.id;
      return withContentReview({
        ...draft,
        ...normalizeContentDraft(draft),
        publicationBlocked: true,
        blockedReason: `Visual asset must be approved before publishing. Current status: ${visualAsset.status}.`,
        updatedAt: new Date().toLocaleString()
      });
    }

    const truthApproved = options.truthReviewed || draft.truthReviewStatus === "approved";
    if (status === "published" && !truthApproved) {
      removePublishedDraftId = draft.id;
      return withContentReview({
        ...draft,
        ...normalizeContentDraft(draft),
        publicationBlocked: true,
        blockedReason: truthReview.issues.length
          ? `Truth And Fact-Check approval required: ${truthReview.issues.join(" ")}`
          : "Truth And Fact-Check approval is required before publishing.",
        updatedAt: new Date().toLocaleString()
      });
    }

    if (status === "published" && !contentReview.passed) {
      removePublishedDraftId = draft.id;
      return withContentReview({
        ...draft,
        ...normalizeContentDraft(draft),
        publicationBlocked: true,
        blockedReason: contentReview.criticalBlockers?.join(" ") || contentReview.missingRequirements?.join(" ") || "Lesson artifact quality gate failed.",
        updatedAt: new Date().toLocaleString()
      });
    }

    const normalizedDraft = normalizeContentDraft(draft);
    const updatedAt = new Date().toLocaleString();
    const nextDraft = withContentReview({
      ...normalizedDraft,
      status,
      evidenceAudit: summarizeEvidenceAudit(audit),
      lessonBodyReady: completeness.passed,
      teachingCompletenessStatus: completeness.status,
      teachingCompletenessIssues: completeness.issues,
      contentCompletenessReview: completeness,
      truthScore: truthReview.score,
      truthIssues: truthReview.issues,
      needsExternalResearch: truthReview.needsExternalResearch,
      truthReviewStatus: options.truthReviewed ? "approved" : normalizedDraft.truthReviewStatus,
      contentTruthReview: {
        ...truthReview,
        status: options.truthReviewed ? "approved" : truthReview.status,
        requiresHumanReview: options.truthReviewed ? false : truthReview.requiresHumanReview
      },
      truthReviewedAt: options.truthReviewed ? options.reviewedAt || updatedAt : normalizedDraft.truthReviewedAt,
      truthReviewedBy: options.truthReviewed ? options.reviewedBy || "manager" : normalizedDraft.truthReviewedBy,
      publicationBlocked: false,
      blockedReason: "",
      publishedAt: status === "published" ? normalizedDraft.publishedAt || options.reviewedAt || updatedAt : normalizedDraft.publishedAt,
      publishedBy: status === "published" ? options.reviewedBy || normalizedDraft.publishedBy || "manager" : normalizedDraft.publishedBy,
      updatedAt
    });
    if (status === "published") {
      publishedLesson = createPublishedLessonFromDraft(nextDraft, {
        publishedAt: nextDraft.publishedAt,
        publishedBy: nextDraft.publishedBy,
        updatedAt
      });
      removePublishedDraftId = "";
    }
    return nextDraft;
  });
  let publishedLessons = state.publishedLessons || [];
  if (publishedLesson) {
    publishedLessons = upsertPublishedLesson(publishedLessons, publishedLesson);
  } else if (removePublishedDraftId) {
    publishedLessons = removePublishedLessonForDraft(publishedLessons, removePublishedDraftId);
  }
  const publishedDraft = publishedLesson
    ? contentDrafts.find((draft) => draft.id === publishedLesson.sourceDraftId)
    : null;
  const visualAssets = publishedLesson
    ? (state.visualAssets || []).map((asset) => {
        if (asset.draftId !== publishedLesson.sourceDraftId && asset.lessonId !== publishedLesson.sourceDraftId) return asset;
        return {
          ...asset,
          lessonId: publishedLesson.id,
          publishedLessonId: publishedLesson.id,
          sourceDraftId: publishedLesson.sourceDraftId,
          publishedAt: publishedLesson.publishedAt,
          updatedAt: publishedLesson.updatedAt
        };
      })
    : state.visualAssets;
  const implementedRedesignTaskIds = new Set(publishedDraft?.redesignTaskIds || []);
  const lessonImprovementSignals = implementedRedesignTaskIds.size
    ? (state.lessonImprovementSignals || []).map((signal) => {
        if (!implementedRedesignTaskIds.has(signal.id)) return signal;
        return {
          ...signal,
          status: "implemented",
          reviewStatus: "implemented",
          implementedAt: publishedLesson.publishedAt,
          implementedDraftId: publishedDraft.id,
          implementedLessonId: publishedLesson.id,
          reviewHistory: [
            {
              action: "published",
              status: "implemented",
              reviewer: publishedLesson.publishedBy || "manager",
              createdAt: publishedLesson.publishedAt,
              publishedLessonId: publishedLesson.id,
              draftId: publishedDraft.id,
              revisionInstructions: []
            },
            ...(signal.reviewHistory || [])
          ].slice(0, 12)
        };
      })
    : state.lessonImprovementSignals;
  return {
    ...state,
    artifactReviewHistory: [...artifactReviewRecords, ...(state.artifactReviewHistory || [])].slice(0, 300),
    contentDrafts,
    publishedLessons,
    visualAssets,
    lessonImprovementSignals
  };
}

export function publishApprovedContentBatch(state = {}, sourceBatchId = bridgeGrade6BatchOneId, options = {}) {
  const reviewedAt = options.reviewedAt || new Date().toLocaleString();
  const reviewedBy = options.reviewedBy || "manager";
  const batchDrafts = (state.contentDrafts || []).filter((draft) => draft.sourceBatchId === sourceBatchId);
  if (!batchDrafts.length) {
    return {
      state,
      result: {
        accepted: false,
        sourceBatchId,
        summary: "No draft lessons were found for this content batch."
      }
    };
  }
  const notApproved = batchDrafts.filter((draft) => draft.batchReviewStatus !== "approved");
  if (notApproved.length) {
    return {
      state,
      result: {
        accepted: false,
        sourceBatchId,
        blockedCount: notApproved.length,
        summary: "Batch must be manager-approved before publication.",
        blockers: notApproved.map((draft) => `${draft.title}: batch review status is ${draft.batchReviewStatus || "not reviewed"}.`)
      }
    };
  }

  let nextState = state;
  const results = [];
  for (const draft of batchDrafts) {
    nextState = updateContentDraftStatus(nextState, draft.id, "published", {
      truthReviewed: true,
      reviewedAt,
      reviewedBy
    });
    const publishedLesson = (nextState.publishedLessons || []).find((lesson) => lesson.sourceDraftId === draft.id);
    const blockedDraft = (nextState.contentDrafts || []).find((item) => item.id === draft.id);
    const latestReview = publishedLesson
      ? gradeLessonContent(publishedLesson)
      : blockedDraft?.latestReview || gradeLessonContent(createPublishedLessonFromDraft(normalizeContentDraft(draft), { publishedBy: reviewedBy }));
    results.push({
      draftId: draft.id,
      publishedLessonId: publishedLesson?.id || "",
      title: draft.title,
      subject: draft.subject,
      status: publishedLesson ? "published" : "blocked",
      score: latestReview.score,
      grade: latestReview.grade,
      blockedReason: publishedLesson ? "" : blockedDraft?.blockedReason || "Publication blocked by the individual content gate."
    });
  }

  const publishedCount = results.filter((result) => result.status === "published").length;
  const blockedCount = results.length - publishedCount;
  const score = results.length ? Math.min(...results.map((result) => Number(result.score || 0))) : 0;
  const publicationRecord = {
    id: `batch-publication-${sourceBatchId}-${Date.now()}`,
    sourceBatchId,
    status: blockedCount === 0 ? "published" : publishedCount > 0 ? "partial" : "blocked",
    attemptedAt: reviewedAt,
    reviewedBy,
    totalLessons: results.length,
    publishedCount,
    blockedCount,
    score,
    grade: gradeForScore(score),
    results
  };

  return {
    state: {
      ...nextState,
      contentBatchPublications: [publicationRecord, ...(nextState.contentBatchPublications || [])].slice(0, 40)
    },
    result: {
      accepted: true,
      sourceBatchId,
      totalLessons: results.length,
      publishedCount,
      blockedCount,
      status: publicationRecord.status,
      score,
      grade: publicationRecord.grade,
      results,
      summary:
        blockedCount === 0
          ? `${publishedCount}/${results.length} lessons published from ${sourceBatchId}.`
          : `${publishedCount}/${results.length} lessons published; ${blockedCount} blocked by individual gates.`
    }
  };
}

export function getContentAuthoringSummary(state) {
  const drafts = (state.contentDrafts || []).map(normalizeContentDraft);
  const evidenceAudits = drafts.map((draft) => getDraftEvidenceAudit(draft));
  const completenessReviews = drafts.map((draft) => getContentDraftCompletenessReview(draft));
  const truthReviews = drafts.map((draft) => getContentDraftTruthReview(draft));
  const truthReviewed = drafts.filter((draft) => draft.truthReviewStatus === "approved").length;
  const truthScoreTotal = truthReviews.reduce((sum, review) => sum + review.score, 0);
  const imports = state.contentImportJobs || [];
  const visualAssets = getVisualAssetSummary(state);
  return {
    total: drafts.length,
    draft: drafts.filter((item) => item.status === "draft").length,
    review: drafts.filter((item) => item.status === "review").length,
    published: drafts.filter((item) => item.status === "published").length,
    publishedLessonRecords: (state.publishedLessons || []).length,
    grade3Core: drafts.filter((item) => item.grade === "3" && ["ela", "math", "science", "social-studies"].includes(item.subject)).length,
    mathDrafts: drafts.filter((item) => item.subject === "math").length,
    evidenceReady: evidenceAudits.filter((audit) => audit.required > 0 && audit.passed).length,
    evidenceBlocked: evidenceAudits.filter((audit) => audit.required > 0 && !audit.passed).length,
    lessonBodyReady: completenessReviews.filter((review) => review.passed).length,
    lessonBodyBlocked: completenessReviews.filter((review) => !review.passed).length,
    visualSupportReady: drafts.filter((draft) => (draft.visualSupports || []).length >= 2).length,
    misconceptionReady: drafts.filter((draft) => (draft.commonMisunderstandings || []).length > 0).length,
    sourceCardReady: drafts.filter((draft) => (draft.sourceCards || []).length > 0).length,
    truthReviewed,
    truthBlocked: drafts.length - truthReviewed,
    truthAverage: truthReviews.length ? Math.round((truthScoreTotal / truthReviews.length) * 10) / 10 : 0,
    externalResearchNeeded: truthReviews.filter((review) => review.needsExternalResearch).length,
    importJobs: imports.length,
    importsRejected: imports.filter((job) => job.status === "rejected").length,
    importsAccepted: imports.filter((job) => job.status === "imported").length,
    visualAssets: visualAssets.total,
    visualAssetsInReview: visualAssets.review,
    visualAssetsApproved: visualAssets.approved,
    visualAssetsRejected: visualAssets.rejected
  };
}

export function getPublishedLessonSummary(state) {
  const lessons = (state.publishedLessons || []).map(normalizePublishedLesson);
  const byAcademy = lessons.reduce((counts, lesson) => {
    counts[lesson.academyId] = (counts[lesson.academyId] || 0) + 1;
    return counts;
  }, {});
  const bySubject = lessons.reduce((counts, lesson) => {
    counts[lesson.subject] = (counts[lesson.subject] || 0) + 1;
    return counts;
  }, {});
  return {
    total: lessons.length,
    foundation: byAcademy.foundation || 0,
    bridge: byAcademy.bridge || 0,
    scholar: byAcademy.scholar || 0,
    bySubject,
    withVisualSupports: lessons.filter((lesson) => (lesson.visualSupports || []).length >= 2).length,
    withSourceCards: lessons.filter((lesson) => (lesson.sourceCards || []).length > 0).length,
    withQuiz: lessons.filter((lesson) => (lesson.quiz || []).length > 0).length,
    lessons
  };
}

export function getBridgeGrade6CoursePath(state = {}, learnerId = "", options = {}) {
  const learner = getLearnerById(state, learnerId);
  const sourceBatchId = bridgeGrade6BatchOneId;
  const publishedLessons = getLessonCatalog(state)
    .filter((lesson) => lesson.sourceBatchId === sourceBatchId && lesson.status === "published")
    .sort((left, right) => {
      const order = ["math", "science", "ela", "social-studies"];
      const subjectCompare = order.indexOf(left.subject) - order.indexOf(right.subject);
      if (subjectCompare !== 0) return subjectCompare;
      return String(left.title || "").localeCompare(String(right.title || ""));
    });
  const publications = (state.contentBatchPublications || []).filter((publication) => publication.sourceBatchId === sourceBatchId);
  const latestPublication = publications[0] || null;
  const learnerEvents = (state.learningEvents || []).filter((event) => event.learnerId === learnerId);
  const completedLessonIds = new Set(
    learnerEvents.filter((event) => event.type === "quiz_completed" && event.value?.passed).map((event) => event.lessonId)
  );
  const lessons = publishedLessons.map((lesson, index) => {
    const mastery = state.mastery?.[lesson.id] || { score: 0, status: "Not started", attempts: 0 };
    const completed = completedLessonIds.has(lesson.id) || Number(mastery.score || 0) >= Number(lesson.masteryThreshold || 80);
    return {
      id: lesson.id,
      title: lesson.title,
      subject: lesson.subject,
      unitTitle: lesson.unitTitle,
      objective: lesson.objective,
      visualSupportCount: (lesson.visualSupports || []).length,
      quizCount: (lesson.quiz || []).length,
      groupHomework: Boolean(lesson.groupHomework),
      masteryScore: Number(mastery.score || 0),
      masteryStatus: mastery.status || (completed ? "Mastered" : "Not started"),
      completed,
      order: index + 1
    };
  });
  const completedCount = lessons.filter((lesson) => lesson.completed).length;
  const nextLesson = lessons.find((lesson) => !lesson.completed) || lessons[0] || null;
  const currentLessonId = String(options.currentLessonId || "");
  const currentIndex = currentLessonId ? lessons.findIndex((lesson) => lesson.id === currentLessonId) : -1;
  const currentLesson = currentIndex >= 0 ? lessons[currentIndex] : null;
  const previousMission = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextMission = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const eligibleLearner = !learner || (learner.academyId === "bridge" && String(learner.grade) === "6");
  return {
    sourceBatchId,
    title: "Bridge Academy Grade 6 Batch 1",
    subtitle: "Attendable middle-school course path",
    eligibleLearner,
    publicationStatus: latestPublication?.status || (lessons.length ? "published" : "not-published"),
    totalLessons: lessons.length,
    completedLessons: completedCount,
    progressPercent: lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0,
    subjectCount: new Set(lessons.map((lesson) => lesson.subject)).size,
    nextLessonId: nextLesson?.id || "",
    nextLessonTitle: nextLesson?.title || "Publish the approved Grade 6 batch first",
    currentLesson,
    currentMissionNumber: currentIndex >= 0 ? currentIndex + 1 : 0,
    previousMission,
    nextMission,
    lessons,
    latestPublication
  };
}

export function getLessonExperience(lessonId, appState = null) {
  const lesson = appState ? findLessonInState(appState, lessonId) : findLesson(lessonId);
  const evidenceAudit = getLessonEvidenceAudit(lessonId, appState);
  const teachingSupport = getLessonTeachingSupport(lessonId, appState);
  return {
    hasVisual: Boolean(lesson.visual),
    funTaskCount: lesson.funTasks?.length || 0,
    hasGroupHomework: Boolean(lesson.groupHomework),
    retentionCheckCount: lesson.retentionChecks?.length || 0,
    reward: lesson.reward || "Mastery progress",
    evidenceAuditPassed: evidenceAudit.passed,
    evidenceMoveCount: evidenceAudit.present,
    teachingSupportCount:
      teachingSupport.diagramCallouts.length + teachingSupport.helperNotes.length + teachingSupport.commonMisunderstandings.length
  };
}

function getLessonTeachingSupportFromLesson(lesson) {
  const support = lesson.teachingSupport || {};
  return {
    summary: support.summary || lesson.objective,
    description: support.description || lesson.sections?.teach || lesson.objective,
    diagramCallouts:
      Array.isArray(support.diagramCallouts) && support.diagramCallouts.length
        ? support.diagramCallouts
        : [
            {
              title: lesson.visual?.title || "Lesson visual",
              body: lesson.visual?.caption || lesson.objective
            },
            {
              title: "Build",
              body: lesson.sections?.activity || lesson.objective
            },
            {
              title: "Explain",
              body: lesson.sections?.challenge || lesson.objective
            }
          ],
    helperNotes:
      Array.isArray(support.helperNotes) && support.helperNotes.length
        ? support.helperNotes
        : [lesson.sections?.reteach || "Use a simpler example first.", "Ask the learner to explain the idea in their own words before retrying."],
    commonMisunderstandings:
      Array.isArray(support.commonMisunderstandings) && support.commonMisunderstandings.length
        ? support.commonMisunderstandings
        : [
            {
              mistake: "The learner can repeat the answer but cannot explain the reason.",
              fix: lesson.sections?.reteach || "Return to a visual or concrete example, then ask for a short explanation."
            }
          ],
    confusionPrompt: support.confusionPrompt || "Write the exact word, step, picture, or question that does not make sense yet."
  };
}

export function getLessonTeachingSupport(lessonId, appState = null) {
  const lesson = appState ? findLessonInState(appState, lessonId) : findLesson(lessonId);
  return getLessonTeachingSupportFromLesson(lesson);
}

const importantWordStoplist = new Set([
  "about",
  "after",
  "again",
  "asked",
  "before",
  "because",
  "between",
  "child",
  "every",
  "first",
  "instead",
  "learner",
  "learners",
  "means",
  "same",
  "should",
  "there",
  "these",
  "those",
  "which",
  "while",
  "where",
  "would"
]);

function importantWords(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 5 && !importantWordStoplist.has(word));
}

function analyzeConfusion(input, lesson, support) {
  const normalized = input.toLowerCase();
  const matchedMisunderstanding = support.commonMisunderstandings.find((item) => {
    const words = importantWords(`${item.mistake} ${item.fix}`);
    return words.some((word) => normalized.includes(word));
  });

  if (matchedMisunderstanding) {
    return {
      focus: "Likely misconception",
      insight: matchedMisunderstanding.mistake,
      fix: matchedMisunderstanding.fix
    };
  }

  if (/(diagram|picture|image|visual|map|line|model|arrow|graph)/.test(normalized)) {
    return {
      focus: "Visual model",
      insight: `The learner is pointing to the representation: ${support.diagramCallouts[0].title}.`,
      fix: support.diagramCallouts[0].body
    };
  }

  if (/(word|vocab|term|means|meaning|definition)/.test(normalized)) {
    return {
      focus: "Vocabulary",
      insight: "The learner may not have a stable meaning for a key term yet.",
      fix: support.summary
    };
  }

  if (/(step|first|next|how|procedure|solve|start)/.test(normalized)) {
    return {
      focus: "Next step",
      insight: "The learner needs a smaller first action before solving.",
      fix: lesson.sections.guidedPractice || lesson.sections.reteach
    };
  }

  if (/(why|because|reason|connect|proof|evidence)/.test(normalized)) {
    return {
      focus: "Reasoning",
      insight: "The learner needs to connect the action to the why behind it.",
      fix: lesson.sections.challenge || support.description
    };
  }

  return {
    focus: "General confusion",
    insight: "The learner wrote a real stuck point, but it needs to be narrowed to a word, step, or visual.",
    fix: support.helperNotes[0]
  };
}

function createGenericStuckPointDiagnosis(input, lesson, support, analysis) {
  const normalized = String(input || "").toLowerCase();
  if (/(diagram|picture|image|visual|map|line|model|arrow|graph)/.test(normalized)) {
    return {
      categoryId: "visual-model",
      label: "visual model",
      studentFriendlyLabel: "the picture or model",
      hintPath: [
        "Point to the exact part of the model that is unclear.",
        `Use this callout: ${support.diagramCallouts[0]?.body || support.summary}`,
        "Explain what each label or mark represents before solving."
      ],
      nextQuestion: "Which part of the picture can you label with confidence, and which part is still unclear?"
    };
  }

  if (/(word|vocab|term|means|meaning|definition)/.test(normalized)) {
    return {
      categoryId: "vocabulary",
      label: "vocabulary",
      studentFriendlyLabel: "a word or definition",
      hintPath: [
        "Choose the word that is blocking the problem.",
        `Connect it to the lesson idea: ${support.summary}`,
        "Use the word in one short example from the lesson."
      ],
      nextQuestion: "Which word should we define first, and where did it appear in the problem?"
    };
  }

  if (/(step|first|next|how|procedure|solve|start)/.test(normalized)) {
    return {
      categoryId: "first-step",
      label: "first step",
      studentFriendlyLabel: "where to start",
      hintPath: [
        "Do only the first move.",
        lesson.sections.guidedPractice || lesson.sections.reteach || analysis.fix,
        "Stop and write what changed before trying the next move."
      ],
      nextQuestion: "What is the smallest first move you can do without finishing the whole problem?"
    };
  }

  if (/(why|because|reason|connect|proof|evidence)/.test(normalized)) {
    return {
      categoryId: "reasoning",
      label: "reasoning",
      studentFriendlyLabel: "why the answer makes sense",
      hintPath: [
        "Name the claim you are trying to prove.",
        "Pick one detail that supports it.",
        "Use because to connect the detail to the claim."
      ],
      nextQuestion: "What claim are you trying to prove, and what detail is your strongest evidence?"
    };
  }

  return {
    categoryId: analysis.focus === "Likely misconception" ? "misconception" : "too-vague",
    label: analysis.focus === "Likely misconception" ? "possible misconception" : "too broad",
    studentFriendlyLabel: analysis.focus === "Likely misconception" ? "a mistaken idea to repair" : "a stuck point that needs narrowing",
    hintPath: [
      "Restate the problem in your own words.",
      "Circle the first word, step, or model part that does not make sense.",
      "Ask for help on that exact part."
    ],
    nextQuestion: "Can you name the exact word, step, or visual part where your thinking stops?"
  };
}

function createMythologyStuckPointDiagnosis(input, analysis) {
  const normalized = String(input || "").toLowerCase();
  const hasPlot = /(plot|retell|story|event|happen|happened|beginning|middle|end)/.test(normalized);
  const hasTheme = /(theme|message|lesson|life|value|meaning)/.test(normalized);
  const hasSymbol = /(symbol|cave|object|image|represents|stand for|stands for)/.test(normalized);
  const hasEvidence = /(evidence|prove|proof|detail|quote|support|because|shows)/.test(normalized);
  const hasClaim = /(claim|sentence|wording|write|phrase|statement)/.test(normalized);

  if ((hasPlot && hasTheme) || (hasTheme && hasEvidence)) {
    return {
      categoryId: "plot-vs-theme",
      label: "plot vs theme",
      studentFriendlyLabel: "telling the difference between what happened and what it means",
      hintPath: [
        "First separate event from message: an event tells what happened; a theme tells what the story suggests about choices or values.",
        "Use the board choice as your possible theme claim, then ask which event best proves it.",
        "Test it with this frame: This detail shows the theme because ___."
      ],
      nextQuestion: "Which one detail from the myth best proves your theme claim, and what does that detail show about the character's choice?"
    };
  }

  if (hasSymbol) {
    return {
      categoryId: "symbol-meaning",
      label: "symbol meaning",
      studentFriendlyLabel: "figuring out what an object, place, or image represents",
      hintPath: [
        "Name the object or image first.",
        "Ask what feeling, warning, or value it carries in the scene.",
        "Connect that meaning to the theme claim with because."
      ],
      nextQuestion: "What might the symbol warn the hero about, and how does that warning connect to the theme?"
    };
  }

  if (hasEvidence) {
    return {
      categoryId: "evidence",
      label: "evidence",
      studentFriendlyLabel: "choosing proof that actually supports the claim",
      hintPath: [
        "Write the claim at the top of the board.",
        "Choose one detail where the hero makes a decision or faces a consequence.",
        "Explain how that detail supports the claim instead of only retelling it."
      ],
      nextQuestion: "Does your evidence show the hero's choice, the consequence, or the cultural value? Pick one and explain why."
    };
  }

  if (hasClaim) {
    return {
      categoryId: "claim-wording",
      label: "claim wording",
      studentFriendlyLabel: "turning an idea into a clear theme claim",
      hintPath: [
        "Avoid naming only the topic.",
        "Use a full message about choices, consequences, or values.",
        "Try: The myth suggests that ___ because ___."
      ],
      nextQuestion: "Can you rewrite your claim so it says a message about life, not just a topic?"
    };
  }

  return {
    categoryId: "myth-analysis-general",
    label: "myth analysis",
    studentFriendlyLabel: "which myth-analysis move to use first",
    hintPath: [
      "Choose one lane: plot vs theme, symbol meaning, evidence, or claim wording.",
      analysis.fix,
      "Ask one focused question about that lane before revising."
    ],
    nextQuestion: "Which lane are you stuck in: plot vs theme, symbol meaning, evidence, or claim wording?"
  };
}

function createStuckPointDiagnosis(input, lesson, support, analysis) {
  if (lesson.id === "published-draft-next-wave-bridge-6-ela-u1-l1" || lesson.id === "bridge-6-ela-u1-l1") {
    return createMythologyStuckPointDiagnosis(input, analysis);
  }

  return createGenericStuckPointDiagnosis(input, lesson, support, analysis);
}

function normalizeExplanationMode(modeId) {
  return explanationModes.find((mode) => mode.id === modeId) || explanationModes[0];
}

function findLessonIdByTitle(title) {
  return (pilotLessons.find((lesson) => lesson.title === title) || pilotLessons[0]).id;
}

export function getExplanationModes() {
  return explanationModes.map((mode) => ({ ...mode, uses: [...mode.uses] }));
}

function createLessonMetaphor(lesson, ageBand) {
  if (lesson.subject === "math") {
    return ageBand === "K-5"
      ? "stepping stones across a creek: each stone has to be spaced evenly before you can count where you are"
      : "a scale on a map: the marks only help if the distance between them stays consistent";
  }

  if (lesson.subject === "science") {
    return ageBand === "K-5"
      ? "being a nature detective who looks for one clue at a time"
      : "running a lab investigation where every claim needs observable evidence";
  }

  if (lesson.subject === "ela" || lesson.subject === "writing") {
    return ageBand === "K-5"
      ? "building a treasure map where the strongest clues all point to the same spot"
      : "building a court case where each detail must support the same claim";
  }

  return ageBand === "K-5"
    ? "building with blocks: one clear piece goes down before the next one"
    : "solving a route problem: first identify the destination, then choose the next useful move";
}

function createFirstPrinciplesPrompt(lesson, support, analysis, ageBand) {
  const baseQuestions =
    ageBand === "K-5"
      ? [
          "What is the whole thing we are looking at?",
          "What part changes?",
          "What must stay fair, equal, or true?"
        ]
      : [
          "What is the core object, quantity, claim, or system?",
          "Which variable, relationship, or evidence changes?",
          "What rule, constraint, or definition must remain true?"
        ];

  return {
    coreTruth: support.summary,
    stuckPoint: analysis.focus,
    questions: baseQuestions,
    finalCheck: `Use those answers to explain: ${lesson.objective}`
  };
}

function createModeTeachingMove(modeId, lesson, support, analysis, ageBand, reviewPrompt) {
  const mode = normalizeExplanationMode(modeId);
  const callout = support.diagramCallouts[0];
  const firstAction = lesson.sections.guidedPractice || lesson.sections.reteach || analysis.fix;
  const realWorldTask = lesson.funTasks?.[0] || lesson.sections.activity || support.description;
  const quizPrompt = lesson.quiz?.[0]?.prompt || support.confusionPrompt;
  const firstPrinciplesPrompt = createFirstPrinciplesPrompt(lesson, support, analysis, ageBand);

  if (mode.id === "visual") {
    return {
      mode,
      text: `Picture it first: ${callout.title}. ${callout.body} Sketch that model, label the part that feels confusing, then try the lesson step again.`,
      nextStep: callout.body,
      prompt: "Draw or describe the picture you see, then name the spot where it stops making sense.",
      visualHint: `${callout.title}: ${callout.body}`,
      firstPrinciplesPrompt: ""
    };
  }

  if (mode.id === "metaphor") {
    const metaphor = createLessonMetaphor(lesson, ageBand);
    return {
      mode,
      text: `Try this metaphor: this lesson is like ${metaphor}. Use that picture to explain ${analysis.focus.toLowerCase()}, then retry one small example.`,
      nextStep: analysis.fix,
      prompt: "Write the metaphor back in your own words, then connect it to the lesson problem.",
      visualHint: "",
      firstPrinciplesPrompt: ""
    };
  }

  if (mode.id === "first-step") {
    return {
      mode,
      text: `First step only: ${firstAction} Stop after that first move and write what you notice before doing the next step.`,
      nextStep: firstAction,
      prompt: "Do just the first move, then tell me what changed.",
      visualHint: "",
      firstPrinciplesPrompt: ""
    };
  }

  if (mode.id === "real-world") {
    return {
      mode,
      text: `Real-world example: ${realWorldTask} Connect that example to the stuck point: ${analysis.insight}`,
      nextStep: realWorldTask,
      prompt: "Write one real-life version of this idea, then explain how it matches the lesson.",
      visualHint: "",
      firstPrinciplesPrompt: ""
    };
  }

  if (mode.id === "gentle-quiz") {
    return {
      mode,
      text: `Quick check, no pressure: ${quizPrompt} Do not chase the answer first. Tell me the reason one choice or move would make sense.`,
      nextStep: analysis.fix,
      prompt: "Answer with your reasoning first, then choose or retry.",
      visualHint: "",
      firstPrinciplesPrompt: ""
    };
  }

  if (mode.id === "first-principles") {
    return {
      mode,
      text: `Start from basics: ${firstPrinciplesPrompt.coreTruth} Ask: ${firstPrinciplesPrompt.questions.join(" ")} Then use those answers to rebuild the idea without memorizing a trick.`,
      nextStep: firstPrinciplesPrompt.questions.join(" "),
      prompt: firstPrinciplesPrompt.finalCheck,
      visualHint: "",
      firstPrinciplesPrompt: firstPrinciplesPrompt.questions.join(" | ")
    };
  }

  return {
    mode,
    text: `${analysis.fix} ${reviewPrompt}`,
    nextStep: analysis.fix,
    prompt: reviewPrompt,
    visualHint: "",
    firstPrinciplesPrompt: ""
  };
}

export function createAiTutorResponse(input, lessonId, ageBand = "K-5", explanationModeId = "diagnose", lessonOverride = null) {
  const lesson = lessonOverride || findLesson(lessonId);
  const support = lessonOverride ? getLessonTeachingSupportFromLesson(lessonOverride) : getLessonTeachingSupport(lessonId);
  const normalized = input.trim().toLowerCase();
  const requestedMode = normalizeExplanationMode(explanationModeId);
  const directAnswerPattern =
    /(solve it|do it for me|tell me (which|the) answer|give me (the )?(answer|result)|which answer (should|do) i pick|answer to pick|just choose)/;
  const safetyPattern = /(hurt myself|self harm|abuse|violence|suicide|unsafe at home)/;

  if (!normalized) {
    return {
      type: "clarify-confusion",
      text: `Write exactly what does not make sense yet. ${support.confusionPrompt}`,
      analysis: "No learner explanation was provided yet.",
      nextStep: "The coach needs the student to name the stuck point before teaching.",
      prompt: support.confusionPrompt,
      modeId: requestedMode.id,
      modeTitle: requestedMode.title,
      strategy: requestedMode.strategy,
      visualHint: "",
      firstPrinciplesPrompt: "",
      flagged: false
    };
  }

  if (safetyPattern.test(normalized)) {
    return {
      type: "safety",
      text: "I cannot handle that alone. Please talk to a trusted adult now. I will flag this for parent review.",
      analysis: "Safety language detected.",
      nextStep: "Escalate to a trusted adult and parent review.",
      prompt: "",
      modeId: requestedMode.id,
      modeTitle: requestedMode.title,
      strategy: requestedMode.strategy,
      visualHint: "",
      firstPrinciplesPrompt: "",
      flagged: true
    };
  }

  if (directAnswerPattern.test(normalized)) {
    return {
      type: "blocked-answer",
      text: `I cannot give the final answer. Write your first step and the exact part that feels confusing. Hint: use the lesson objective, "${lesson.objective}".`,
      analysis: "The learner appears to be asking for completion rather than understanding.",
      nextStep: support.confusionPrompt,
      prompt: "Write your first step, then name the point where you get stuck.",
      modeId: requestedMode.id,
      modeTitle: requestedMode.title,
      strategy: requestedMode.strategy,
      visualHint: "",
      firstPrinciplesPrompt: "",
      flagged: false
    };
  }

  const agePrefix = ageBand === "K-5" ? "Small hint" : ageBand === "6-8" ? "Strategy hint" : "Study prompt";
  const analysis = analyzeConfusion(input, lesson, support);
  const stuckPoint = createStuckPointDiagnosis(input, lesson, support, analysis);
  const reviewPrompt =
    ageBand === "K-5"
      ? "Now point, draw, or say one example in your own words."
      : "Now write one sentence explaining your reasoning, then try one similar example.";
  const teachingMove = createModeTeachingMove(requestedMode.id, lesson, support, analysis, ageBand, reviewPrompt);
  const hintPathText = stuckPoint.hintPath.map((step, index) => `${index + 1}. ${step}`).join(" ");

  return {
    type: analysis.focus === "Likely misconception" ? "misunderstanding-review" : "confusion-analysis",
    text: `${agePrefix}: I think the stuck point is ${stuckPoint.studentFriendlyLabel}. ${teachingMove.text} Hint path: ${hintPathText}`,
    analysis: `${analysis.focus}: ${analysis.insight} Stuck-point category: ${stuckPoint.label}.`,
    nextStep: stuckPoint.nextQuestion,
    prompt: `${teachingMove.prompt} ${stuckPoint.nextQuestion}`,
    modeId: teachingMove.mode.id,
    modeTitle: teachingMove.mode.title,
    strategy: `${teachingMove.mode.strategy} Stuck-point classifier: ${stuckPoint.label}.`,
    visualHint: teachingMove.visualHint,
    firstPrinciplesPrompt: teachingMove.firstPrinciplesPrompt,
    stuckPointCategoryId: stuckPoint.categoryId,
    stuckPointLabel: stuckPoint.label,
    hintPath: stuckPoint.hintPath,
    nextQuestion: stuckPoint.nextQuestion,
    flagged: false
  };
}

function getUnhelpfulTutorLogs(state, lessonId) {
  const lesson = findLessonInState(state, lessonId);
  return (state.aiLogs || []).filter((log) => log.lessonTitle === lesson.title && log.studentFeedback && !log.helped);
}

function selectAdaptiveExplanationMode(state, input, lessonId, requestedModeId) {
  const requestedMode = normalizeExplanationMode(requestedModeId);
  const recentUnhelpful = getUnhelpfulTutorLogs(state, lessonId)[0];
  if (!recentUnhelpful) {
    return {
      modeId: requestedMode.id,
      adaptive: false,
      previousModeId: "",
      reason: ""
    };
  }

  const normalizedInput = String(input || "").toLowerCase();
  const preferredByFeedback = {
    "needs-picture": "visual",
    "too-hard": "first-step",
    "still-confused": /(why|reason|beginning|basic|true|underneath|understand)/.test(normalizedInput)
      ? "first-principles"
      : "visual"
  };
  const fallbackCycle = ["visual", "first-principles", "metaphor", "real-world", "first-step", "gentle-quiz"];
  const preferredModeId = preferredByFeedback[recentUnhelpful.studentFeedback] || "first-principles";
  const nextModeId =
    preferredModeId !== recentUnhelpful.modeId
      ? preferredModeId
      : fallbackCycle.find((modeId) => modeId !== recentUnhelpful.modeId && modeId !== requestedMode.id) || requestedMode.id;

  if (nextModeId === requestedMode.id && requestedMode.id !== recentUnhelpful.modeId) {
    return {
      modeId: requestedMode.id,
      adaptive: false,
      previousModeId: recentUnhelpful.modeId || "",
      reason: ""
    };
  }

  return {
    modeId: nextModeId,
    adaptive: nextModeId !== requestedMode.id || nextModeId !== recentUnhelpful.modeId,
    previousModeId: recentUnhelpful.modeId || "",
    reason: `Previous ${recentUnhelpful.modeTitle || recentUnhelpful.modeId || "tutor"} response was marked ${recentUnhelpful.studentFeedback.replace("-", " ")}. Switching strategy instead of repeating the same help.`
  };
}

export function createAdaptiveTutorResponse(state, input, lessonId, ageBand = "K-5", explanationModeId = "diagnose") {
  const lesson = findLessonInState(state, lessonId);
  const selection = selectAdaptiveExplanationMode(state, input, lessonId, explanationModeId);
  const response = createAiTutorResponse(input, lesson.id, ageBand, selection.modeId, lesson);
  return {
    ...response,
    adaptive: selection.adaptive,
    previousModeId: selection.previousModeId,
    adaptationReason: selection.reason,
    strategy: selection.adaptive ? `${response.strategy} Adaptive switch: ${selection.reason}` : response.strategy
  };
}

export function appendAiLog(state, input, response, lessonId, learnerId = "") {
  const lesson = findLessonInState(state, lessonId);
  const truthReview = createTutorTruthReview(lesson, input, response);
  return {
    ...state,
    aiLogs: [
      {
        id: `ai-${Date.now()}`,
        learnerId: learnerId || (lesson.academyId === "foundation" ? "avery" : lesson.academyId === "bridge" ? "maya" : "jordan"),
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        input,
        response: response.text,
        analysis: response.analysis || "",
        nextStep: response.nextStep || "",
        prompt: response.prompt || "",
        modeId: response.modeId || "diagnose",
        modeTitle: response.modeTitle || "Diagnose First",
        strategy: response.strategy || "",
        visualHint: response.visualHint || "",
        firstPrinciplesPrompt: response.firstPrinciplesPrompt || "",
        stuckPointCategoryId: response.stuckPointCategoryId || "",
        stuckPointLabel: response.stuckPointLabel || "",
        hintPath: response.hintPath || [],
        nextQuestion: response.nextQuestion || "",
        adaptive: Boolean(response.adaptive),
        adaptationReason: response.adaptationReason || "",
        previousModeId: response.previousModeId || "",
        truthScore: truthReview.score,
        truthIssues: truthReview.issues,
        truthReview,
        truthReviewStatus: truthReview.status,
        needsExternalResearch: truthReview.needsExternalResearch,
        requiresHumanReview: truthReview.requiresHumanReview,
        reviewStatus: truthReview.requiresHumanReview ? "" : "auto-reviewed",
        studentFeedback: "",
        feedbackNote: "",
        helped: null,
        qualityScore: null,
        type: response.type,
        flagged: response.flagged,
        timestamp: new Date().toLocaleString()
      },
      ...state.aiLogs
    ].slice(0, 12)
  };
}

export function askAiTutor(
  state,
  { input = "", lessonId = pilotLessons[0].id, ageBand = "K-5", explanationMode = "diagnose", learnerId = "", scratchpadReview = false } = {}
) {
  const lesson = findLessonInState(state, lessonId);
  const learnerForReview = learnerId || (lesson.academyId === "foundation" ? "avery" : lesson.academyId === "bridge" ? "maya" : "jordan");
  const stateForTutor = scratchpadReview ? markScratchpadTutorReviewed(state, learnerForReview, lesson.id) : state;
  const response = createAdaptiveTutorResponse(stateForTutor, input, lesson.id, ageBand, explanationMode);
  const nextState = {
    ...appendAiLog(
      {
        ...stateForTutor,
        selectedLessonId: lesson.id,
        selectedExplanationModeId: response.modeId || explanationMode
      },
      input,
      response,
      lesson.id,
      learnerForReview
    )
  };
  const withTutorEvidence =
    scratchpadReview && response.type !== "blocked-answer" && response.type !== "safety"
      ? {
          ...nextState,
          learningEvents: [
            {
              id: `event-${Date.now()}-${(nextState.learningEvents || []).length + 1}`,
              learnerId: learnerForReview,
              lessonId: lesson.id,
              type: "scratchpad_tutor_reviewed",
              value: {
                diagnosisReady: Boolean(response.stuckPointCategoryId || response.stuckPointLabel),
                stuckPointCategoryId: response.stuckPointCategoryId || "",
                stuckPointLabel: response.stuckPointLabel || "",
                hintCount: Array.isArray(response.hintPath) ? response.hintPath.length : 0,
                nextQuestion: response.nextQuestion || response.nextStep || ""
              },
              occurredAt: new Date().toLocaleString()
            },
            ...(nextState.learningEvents || [])
          ].slice(0, 50)
        }
      : nextState;

  return {
    state: withTutorEvidence,
    response,
    log: withTutorEvidence.aiLogs[0]
  };
}

export function attachTutorProviderResponse(state, logId, providerResult = {}, { minimumAverage = 4 } = {}) {
  const existingLog = (state.aiLogs || []).find((log) => log.id === logId);
  const providerWasAttempted = Boolean(providerResult.plan?.accepted);
  if (!existingLog || !providerWasAttempted) {
    return {
      state,
      result: {
        accepted: false,
        fallback: true,
        reason: providerResult.blocked ? "Provider moderation blocked the request." : "Provider generation was not attempted.",
        providerReview: null,
        log: existingLog || null
      }
    };
  }

  const providerAttemptedAt = new Date().toISOString();
  const previousAttemptHistory = Array.isArray(existingLog.providerAttemptHistory) ? existingLog.providerAttemptHistory : [];
  const providerAttemptNumber = previousAttemptHistory.length + 1;
  const providerBase = {
    provider: "openai",
    providerModel: providerResult.model || providerResult.plan?.config?.model || "",
    providerRequestId: providerResult.requestId || "",
    providerUsage: providerResult.usage || {},
    providerModeration: providerResult.moderation || {},
    providerAttemptedAt,
    providerAttemptNumber
  };
  const withAttemptHistory = (log, { status, review = null, error = "" } = {}) => ({
    ...log,
    providerAttemptHistory: [
      {
        attempt: providerAttemptNumber,
        status,
        attemptedAt: providerAttemptedAt,
        requestId: providerResult.requestId || "",
        model: providerResult.model || providerResult.plan?.config?.model || "",
        usage: providerResult.usage || {},
        moderation: providerResult.moderation || {},
        average: typeof review?.average === "number" ? review.average : null,
        grade: typeof review?.average === "number"
          ? review.average >= 4.5 ? "A" : review.average >= 4 ? "B" : review.average >= 3 ? "C" : review.average >= 2 ? "D" : "F"
          : "",
        issues: review?.issues || (error ? [error] : [])
      },
      ...previousAttemptHistory
    ].slice(0, 8)
  });
  if (!providerResult.accepted || !providerResult.response?.text) {
    const blockedLog = withAttemptHistory({
      ...existingLog,
      ...providerBase,
      providerAttemptStatus: providerResult.blocked ? "moderation-blocked" : "provider-failed",
      providerReview: {
        accepted: false,
        average: null,
        scores: {},
        issues: [providerResult.error || "Provider response was not eligible for attachment."],
        needsExternalResearch: false
      },
      requiresHumanReview: true,
      reviewStatus: ""
    }, {
      status: providerResult.blocked ? "moderation-blocked" : "provider-failed",
      review: null,
      error: providerResult.error || "Provider response was not eligible for attachment."
    });
    return {
      state: { ...state, aiLogs: [blockedLog, ...(state.aiLogs || []).filter((log) => log.id !== logId)] },
      result: {
        accepted: false,
        fallback: true,
        reason: providerResult.blocked ? "Provider moderation blocked the request." : "Provider response was not eligible for attachment.",
        providerReview: blockedLog.providerReview,
        log: blockedLog
      }
    };
  }

  const lesson = findLessonInState(state, existingLog.lessonId);
  const truthReview = createTutorTruthReview(lesson, existingLog.input || "", providerResult.response);
  const answerPolicyScore = Number(truthReview.scores?.answerPolicy || 0);
  const accepted =
    truthReview.average >= Number(minimumAverage || 4) &&
    answerPolicyScore >= 5 &&
    !providerResult.response.flagged &&
    !truthReview.needsExternalResearch;
  const providerReview = {
    accepted,
    average: truthReview.average,
    scores: truthReview.scores,
    issues: truthReview.issues,
    needsExternalResearch: truthReview.needsExternalResearch
  };
  if (!accepted) {
    const reviewedFallbackLog = withAttemptHistory({
      ...existingLog,
      ...providerBase,
      providerAttemptStatus: "quality-rejected",
      providerReview,
      requiresHumanReview: true,
      reviewStatus: ""
    }, { status: "quality-rejected", review: providerReview });
    return {
      state: { ...state, aiLogs: [reviewedFallbackLog, ...(state.aiLogs || []).filter((log) => log.id !== logId)] },
      result: { accepted: false, fallback: true, reason: "Provider response did not pass the tutor quality gate.", providerReview, log: reviewedFallbackLog }
    };
  }

  const response = {
    ...providerResult.response,
    modeId: providerResult.response.modeId || existingLog.modeId || "diagnose",
    modeTitle: existingLog.modeTitle || "Diagnose First",
    strategy: providerResult.response.strategy || existingLog.strategy || "Provider response passed the local truth-policy gate.",
    stuckPointCategoryId: existingLog.stuckPointCategoryId || "",
    stuckPointLabel: existingLog.stuckPointLabel || "",
    adaptive: existingLog.adaptive,
    flagged: false
  };
  const updatedLog = withAttemptHistory({
    ...existingLog,
    response: response.text,
    analysis: response.analysis || existingLog.analysis,
    nextStep: response.nextStep || existingLog.nextStep,
    prompt: response.prompt || existingLog.prompt,
    modeId: response.modeId,
    modeTitle: response.modeTitle,
    strategy: response.strategy,
    visualHint: response.visualHint || existingLog.visualHint,
    firstPrinciplesPrompt: response.firstPrinciplesPrompt || existingLog.firstPrinciplesPrompt,
    hintPath: response.hintPath.length ? response.hintPath : existingLog.hintPath,
    nextQuestion: response.nextQuestion || existingLog.nextQuestion,
    ...providerBase,
    providerAttemptStatus: "accepted",
    providerReview,
    truthScore: truthReview.score,
    truthIssues: truthReview.issues,
    truthReview,
    truthReviewStatus: truthReview.status,
    needsExternalResearch: truthReview.needsExternalResearch,
    requiresHumanReview: truthReview.requiresHumanReview,
    reviewStatus: truthReview.requiresHumanReview ? "" : "auto-reviewed",
    providerAttachedAt: new Date().toISOString()
  }, { status: "accepted", review: providerReview });
  const nextState = {
    ...state,
    aiLogs: [updatedLog, ...(state.aiLogs || []).filter((log) => log.id !== logId)]
  };
  return { state: nextState, result: { accepted: true, fallback: false, providerReview, log: updatedLog } };
}

function createLessonImprovementSignal(log, feedback, note) {
  const lessonId = log.lessonId || findLessonIdByTitle(log.lessonTitle);
  const lesson = findLesson(lessonId);
  const support = getLessonTeachingSupport(lessonId);
  const normalizedFeedback = String(feedback || "still-confused");
  const changeByFeedback = {
    "needs-picture": "Add or revise a diagram, visual hint, or misconception-repair image before the next tutor prompt.",
    "too-hard": "Break the lesson into a smaller first action with simpler language and a lower-friction retry prompt.",
    "still-confused": "Switch explanation mode and add a first-principles repair path before asking another retrieval question."
  };

  return {
    id: `improve-${log.id}-${normalizedFeedback}`.replace(/[^a-z0-9_-]/gi, "-"),
    lessonId,
    learnerId: log.learnerId || "",
    lessonTitle: lesson.title,
    ownerAgentId: "fun-retention",
    title: `Tutor repair needed: ${lesson.title}`,
    why: `${log.modeTitle || "Tutor"} did not resolve "${log.analysis || log.input || support.confusionPrompt}".`,
    change: changeByFeedback[normalizedFeedback] || changeByFeedback["still-confused"],
    sourceIds: ["student-tutor-feedback", log.id],
    status: "needs-redesign",
    feedback: normalizedFeedback,
    modeId: log.modeId || "",
    confusionType: log.type || "",
    note: String(note || "").slice(0, 300),
    createdAt: new Date().toLocaleString()
  };
}

export function submitTutorFeedback(state, logId, feedback, note = "") {
  const normalizedFeedback = ["helped", "still-confused", "too-hard", "needs-picture"].includes(feedback) ? feedback : "still-confused";
  const helped = normalizedFeedback === "helped";
  const qualityScore = helped ? 5 : normalizedFeedback === "needs-picture" ? 3 : 2;
  let found = false;
  let reviewedLog = null;

  const nextLogs = (state.aiLogs || []).map((log) => {
    if (log.id !== logId) return log;
    found = true;
    reviewedLog = {
      ...log,
      studentFeedback: normalizedFeedback,
      feedbackNote: String(note || "").slice(0, 300),
      helped,
      qualityScore,
      feedbackAt: new Date().toLocaleString()
    };
    return reviewedLog;
  });

  const improvementSignal = found && !helped ? createLessonImprovementSignal(reviewedLog, normalizedFeedback, note) : null;
  const lessonId = found ? findLessonIdByTitle(reviewedLog.lessonTitle) : pilotLessons[0].id;
  const existingSignals = state.lessonImprovementSignals || [];
  const nextImprovementSignals = improvementSignal
    ? [improvementSignal, ...existingSignals.filter((signal) => signal.id !== improvementSignal.id)].slice(0, 80)
    : existingSignals;

  return {
    state: found
      ? {
          ...state,
          aiLogs: nextLogs,
          lessonImprovementSignals: nextImprovementSignals,
          learningEvents: [
            {
              id: `event-${Date.now()}`,
              learnerId: reviewedLog.learnerId || reviewedLog.studentId || "",
              lessonId,
              type: "tutor_feedback_submitted",
              detail: normalizedFeedback,
              createdAt: new Date().toLocaleString()
            },
            ...(state.learningEvents || [])
          ].slice(0, 80)
        }
      : state,
    result: {
      accepted: found,
      logId,
      feedback: normalizedFeedback,
      helped,
      qualityScore,
      improvementSignalId: improvementSignal?.id || "",
      summary: found
        ? improvementSignal
          ? "Tutor feedback recorded and a lesson-improvement signal was queued for the Fun And Retention agent."
          : "Tutor feedback recorded for quality and retention analysis."
        : "Tutor log was not found."
    }
  };
}

export function getTutorImprovementQueue(state) {
  const signals = state.lessonImprovementSignals || [];
  return {
    total: signals.length,
    needsRedesign: signals.filter((signal) => signal.status === "needs-redesign").length,
    byLesson: pilotLessons
      .map((lesson) => ({
        lessonId: lesson.id,
        title: lesson.title,
        count: signals.filter((signal) => signal.lessonId === lesson.id).length
      }))
      .filter((item) => item.count > 0),
    signals
  };
}

export function getTutorQualityDashboard(state) {
  const logs = state.aiLogs || [];
  const feedbackLogs = logs.filter((log) => log.studentFeedback);
  const truthReviewedLogs = logs.filter((log) => typeof log.truthScore === "number");
  const truthScoreTotal = truthReviewedLogs.reduce((sum, log) => sum + log.truthScore, 0);
  const needsTruthReview = logs.filter(
    (log) => !log.reviewStatus && (log.requiresHumanReview || log.needsExternalResearch || (typeof log.truthScore === "number" && log.truthScore < 4))
  );
  const byMode = explanationModes.map((mode) => {
    const modeLogs = logs.filter((log) => log.modeId === mode.id);
    const modeFeedback = modeLogs.filter((log) => log.studentFeedback);
    const modeTruthLogs = modeLogs.filter((log) => typeof log.truthScore === "number");
    const helped = modeFeedback.filter((log) => log.helped).length;
    return {
      modeId: mode.id,
      title: mode.title,
      total: modeLogs.length,
      feedbackCount: modeFeedback.length,
      helped,
      stillConfused: modeFeedback.length - helped,
      helpfulRate: modeFeedback.length ? Math.round((helped / modeFeedback.length) * 100) : 0,
      truthAverage: modeTruthLogs.length ? Math.round((modeTruthLogs.reduce((sum, log) => sum + log.truthScore, 0) / modeTruthLogs.length) * 10) / 10 : 0
    };
  });
  const helpedTotal = feedbackLogs.filter((log) => log.helped).length;

  return {
    totalInteractions: logs.length,
    feedbackCount: feedbackLogs.length,
    helped: helpedTotal,
    stillConfused: feedbackLogs.length - helpedTotal,
    helpfulRate: feedbackLogs.length ? Math.round((helpedTotal / feedbackLogs.length) * 100) : 0,
    firstPrinciplesUses: logs.filter((log) => log.modeId === "first-principles").length,
    adaptiveSwitches: logs.filter((log) => log.adaptive).length,
    improvementSignalCount: (state.lessonImprovementSignals || []).length,
    truthReviewed: truthReviewedLogs.length,
    truthAverage: truthReviewedLogs.length ? Math.round((truthScoreTotal / truthReviewedLogs.length) * 10) / 10 : 0,
    needsTruthReview: needsTruthReview.length,
    externalResearchNeeded: logs.filter((log) => log.needsExternalResearch).length,
    needsReview: feedbackLogs.filter((log) => !log.helped || log.flagged).length + needsTruthReview.length,
    byMode
  };
}

export function getReadinessChecklist() {
  const totals = getCurriculumTotals();
  return [
    {
      label: "All 14 product views have a navigation and access contract",
      passed: getViewContractSummary().passed
    },
    {
      label: "Three academies configured",
      passed: totals.academies === 3
    },
    {
      label: "K-12 course map present",
      passed: totals.courseCount >= 70
    },
    {
      label: "Target lesson volume in full-school range",
      passed: totals.targetLessons >= 5000 && totals.targetLessons <= 7000
    },
    {
      label: "Full lesson library index is generated",
      passed: getLessonLibrarySummary().readinessPassed
    },
    {
      label: "Pilot lessons cover grades 3, 6, and 9",
      passed: ["3", "6", "9"].every((grade) => pilotLessons.some((lesson) => lesson.grade === grade))
    },
    {
      label: "Content workflow includes review gates",
      passed: getPipelineStats().gates >= 2
    },
    {
      label: "Parent consent is ready for demo learners",
      passed: getConsentReadiness(createInitialState()).ready
    },
    {
      label: "Math lessons pass evidence guidance audit",
      passed: pilotLessons.filter((lesson) => lesson.subject === "math").every((lesson) => getLessonEvidenceAudit(lesson.id).passed)
    },
    {
      label: "Learning experiments and reward model are configured",
      passed: experimentTemplates.length >= 3 && rewardCatalog.length >= 4
    },
    {
      label: "Agent tools are gateway-managed and review-gated",
      passed:
        getToolRegistry().length >= 6 &&
        getToolRegistry()
          .filter((tool) => tool.externalRisk !== "none")
          .every((tool) => tool.requiresHumanReview || tool.allowedRoles.every((role) => role !== "student"))
    },
    {
      label: "Agent command center and AI tutor tool contract are configured",
      passed: getAiTutorToolContractSummary().stageCount >= 7 && getAiTutorToolContractSummary().blockedCount >= 6
    },
    {
      label: "Production data model covers K-12 platform entities",
      passed: getProductionDataModelReadiness(createInitialState()).passed
    },
    {
      label: "Database migration and repository access policies are generated",
      passed: getMigrationReadiness().passed
    },
    {
      label: "OpenAI image generation is cost-controlled and review-gated",
      passed: getOpenAiImageReadiness({ OPENAI_API_KEY: "test-key" }).reviewRequired
    }
  ];
}
