import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import {
  agentTeam,
  curriculum,
  diagnosticBlueprints,
  evidenceGuidanceAudit,
  explanationModes,
  experimentTemplates,
  funRetentionRubric,
  learningScienceSources,
  parentOnboardingModel,
  pilotLessons,
  qualityGates,
  radicalLearningModel,
  rewardCatalog,
  standardsFrameworks,
  syllabusResearchFindings,
  syllabusResearchSources
} from "../src/data.js";
import {
  addExperimentRun,
  addFamilyBenefit,
  addGeneratedVisualAsset,
  appendAiLog,
  askAiTutor,
  attachTutorProviderResponse,
  completeLessonQuiz,
  createAdaptiveTutorResponse,
  createContentDraft,
  createPublishedLessonFromDraft,
  createAiTutorResponse,
  createInitialState,
  createSchoolClass,
  createRevisionBrief,
  getSchoolRosterCsv,
  normalizeAppState,
  getContentAuthoringSummary,
  getContentDraftCompletenessReview,
  getContentDraftTruthReview,
  getConsentReadiness,
  getClassroomProductSummary,
  getBridgeGrade6CoursePath,
  getCurriculumTotals,
  getDraftEvidenceAudit,
  getDraftVisualAsset,
  getEvidenceGuidanceSummary,
  getAgentCommandCenter,
  getAgentReviewQueue,
  getAgentToolGatewaySummary,
  getAgentToolRegistry,
  getAppViewContractSummary,
  getAdaptiveReteachRecommendation,
  getAiTutorToolContractSummary,
  getExplanationModes,
  getLessonCatalog,
  getLessonEvidenceAudit,
  getExperimentDashboard,
  findLessonInState,
  getLearnerAccess,
  getLessonExperience,
  getLessonScratchpad,
  getInteractiveResponse,
  getLearnerInteractiveSkillEvidence,
  getLessonTeachingSupport,
  getLearningTelemetry,
  getLearnerLevelProfile,
  getStudentEngagementProfile,
  getLearnerSubjectProgress,
  mergeRepositoryLearningEvents,
  getLearnerClassSession,
  getHouseholdLearnerInsights,
  getManagerReviewDossier,
  getOnboardingStatus,
  getParentSummary,
  recordTeacherIntervention,
  enrollLearnerInSchoolClass,
  importSchoolRoster,
  canAccessRepositoryAction,
  canParentAccessLearner,
  getPlatformDataModelReadiness,
  getAuthSecuritySummary,
  getPlatformLessonLibrarySamples,
  getPlatformLessonLibrarySummary,
  getPlatformLessonProductionBatchPlan,
  getPilotQualityGateReport,
  getApprovedLessonVisualAsset,
  getPlatformMigration,
  getPlatformMigrationReadiness,
  getPlatformOpenAiImageReadiness,
  getPlatformRoleAccessMatrix,
  getPlatformRepositoryAccessSummary,
  getProductCompletenessAudit,
  getPublishedLessonSummary,
  getPlatformSchema,
  getPlatformSchemaSummary,
  getPlatformSchemaValidation,
  getPlatformSeedProjection,
  getPlacementPlan,
  getPipelineStats,
  getRadicalLearningSummary,
  getRecallInterval,
  getReadinessChecklist,
  getRewardPlan,
  getRewardApprovalQueue,
  getRuntimeConfigurationStatus,
  isolateStateForStrictLearnerScope,
  getStateDependencyAudit,
  getTeacherClassMonitor,
  refreshSchoolReports,
  getTodayPlan,
  getTutorQualityDashboard,
  getTutorImprovementQueue,
  getTutorReflectionEvidence,
  gradeGeneratedVisual,
  gradeImagePrompt,
  gradeLessonContent,
  getVisualAssetSummary,
  getFullLibraryVisualCatalogSummary,
  getLessonVisualCatalog,
  getVisualProductionBatchPlan,
  getVisualLearningAgentAudit,
  getVisualLearningOpportunity,
  importLessonBatch,
  markVisualAssetStoragePromoted,
  findLocalAccountByEmail,
  findLocalAccountByLogin,
  mergePersistedState,
  mergeRepositoryLearnerProfiles,
  replaceVisualAsset,
  registerProviderAccount,
  registerLocalAccount,
  requestRewardApproval,
  recordRewardFulfillmentResult,
  submitClassroomArtifact,
  updateLessonScratchpad,
  createScratchpadTutorPrompt,
  markScratchpadTutorReviewed,
  submitTutorHintRetry,
  recordInteractiveResponse,
  recordStudentEngagementAction,
  createParentManagedChildAccount,
  createEmailVerificationRequest,
  createPasswordResetRequest,
  publishApprovedContentBatch,
  resolveAgentReviewItem,
  revokeAccountSession,
  resetLocalAccountPassword,
  updateRewardApprovalStatus,
  runAgentTool,
  createSessionClaimsForAccount,
  isSessionRevoked,
  simulateDiagnosticPlacement,
  submitAffectCheckin,
  submitTutorFeedback,
  updateClassSessionStatus,
  updateGroupMission,
  verifyLocalAccountEmail,
  updateContentDraftStatus,
  updateVisualAssetStatus,
  mergeRepositoryLearningCatalog,
  repositoryCatalogLessonToAppLesson,
  validateVisualAssetReplacement,
  validateLessonBatch,
  runArtifactRevisionLoop,
  scoreQuiz
} from "../src/engine.js";
import { formatSchoolReportSnapshotsCsv } from "../src/schoolReports.js";
import {
  createActionTokenRecord,
  createPasswordRecord,
  createSessionToken,
  getRequestSession,
  getRequestSessionAsync,
  hashActionToken,
  publicSessionSummary,
  verifyPassword,
  verifySessionToken
} from "../src/auth.js";
import {
  isSupabaseAuthConfigured,
  normalizeSupabaseAuthResponse,
  supabaseAdminCreateUser,
  supabaseAdminDeleteUser,
  supabaseRequestPasswordReset,
  supabaseSignIn,
  supabaseSignUp,
  supabaseVerifyEmail,
  supabaseUpdatePassword
} from "../src/supabaseAuth.js";
import { extractSourceEvidence, fetchApprovedSourceAudit, isApprovedLiveSourceUrl } from "../src/liveSourceAudit.js";
import { createImageGenerationPlan, estimateImageCostCents } from "../src/openaiImageService.js";
import {
  createTutorGenerationPlan,
  generateOpenAiTutorResponse,
  getOpenAiTutorReadiness
} from "../src/openaiTutorService.js";
import {
  getVisualAssetStorageConfig,
  parseDataImageUrl,
  setupVisualAssetStorageBucket,
  uploadVisualAssetToSupabaseStorage,
  visualAssetStoragePath
} from "../src/visualAssetStorageService.js";
import {
  createGiftCardFulfillmentPlan,
  fulfillGiftCardReward,
  getGiftCardFulfillmentReadiness,
  isGiftCardRewardRequest
} from "../src/rewardFulfillmentService.js";
import { getLearningCatalogInteractiveSignals, getLearningCatalogQuizMasterySummary } from "../src/learningCatalogSignals.js";
import {
  createProductionSessionFromVerifiedClaims,
  getProductionAuthConfig,
  getProductionAuthReadiness,
  isProductionAuthProviderConfigured
} from "../src/productionAuth.js";
import { allowedViewsByRole, appViewIds, appViews, roleViewIds, viewIcons, viewLabels } from "../src/viewContract.js";
import {
  agentReviewDecisionRepositoryTableIds,
  agentReviewRepositoryTableIds,
  aiTutorEventRepositoryTableIds,
  accountSecurityRepositoryTableIds,
  createAccountSecurityReadModel,
  createSessionRevocationRows,
  classroomEvidenceRepositoryTableIds,
  classroomMonitorRepositoryTableIds,
  classroomStudentRepositoryTableIds,
  classroomWorkflowRepositoryTableIds,
  schoolOperationsRepositoryTableIds,
  contentWorkflowRepositoryTableIds,
  auditEventRepositoryTableIds,
  contentDraftRepositoryTableIds,
  createAccountProvisioningRows,
  createNormalizedRowsUpsertSql,
  createNormalizedStateUpsertSql,
  createNormalizedTableDeleteMissingSql,
  createNormalizedTableSelectSql,
  createStateRepository,
  assignmentRepositoryTableIds,
  lessonScratchpadRepositoryTableIds,
  learningCatalogRepositoryTableIds,
  learningEvidenceRepositoryTableIds,
  learningEventRepositoryTableIds,
  learnerProfileRepositoryTableIds,
  createLearnerProfileReadModel,
  normalizedRepositoryTableIds,
  portfolioEvidenceRepositoryTableIds,
  rewardApprovalRepositoryTableIds,
  retentionScheduleRepositoryTableIds,
  schoolOperationsReadRepositoryTableIds,
  visualAssetRepositoryTableIds,
  visualWorkflowRepositoryTableIds
} from "../src/repository.js";
import { exportRepositoryRosterCsv } from "../src/roster.js";
import {
  getAccessSummary,
  getAuthorizedView,
  getVisibleRoleViews,
  isViewAllowedForSession
} from "../src/accessControl.js";
import {
  adaptV2LessonToNexusV3,
  getRenderableNexusPhaseModules,
  getNexusV3ContractSummary,
  nexusLearningPhases,
  nexusLessonFamilies,
  nexusMasteryProofs,
  validateNexusLessonV3,
  validateNexusUnitV3,
  validateNexusMasteryEvidenceV3,
  validateNexusMemoryVaultItemV3,
  validateNexusErrorIntelligenceV3
} from "../src/nexusV3.js";
import { parseRosterCsv } from "../src/roster.js";
import { buildMigrationReadinessReport } from "../scripts/report-v2-migration-readiness.mjs";
import { getNativeV3ExemplarRecords } from "../scripts/export-native-v3-exemplars.mjs";

const v2V3MigrationReport = buildMigrationReadinessReport({ root: process.cwd() });
assert.equal(v2V3MigrationReport.summary.contentFiles, 24, "migration report should inventory legacy and native on-disk content files");
assert.equal(v2V3MigrationReport.summary.seedLessonFiles, 16, "migration report should inventory the 16 seed lesson files");
assert.equal(v2V3MigrationReport.summary.nativeV3Pilots, 8, "migration report should identify all eight native V3 pilot exemplars");
assert.ok(v2V3MigrationReport.checks.some((item) => item.id === "native-content-files" && item.passed), "migration report should confirm all on-disk content is native V3");
assert.equal(v2V3MigrationReport.status, "ready", "migration report should be ready after the complete on-disk V3 migration");
assert.equal(getNativeV3ExemplarRecords().length, 8, "native V3 export should expose all eight authored exemplars");

const totals = getCurriculumTotals();

assert.equal(curriculum.academies.length, 3, "three academies should be configured");
assert.equal(curriculum.academies[0].range, "K-5", "foundation range should be K-5");
assert.equal(curriculum.academies[1].range, "6-8", "bridge range should be 6-8");
assert.equal(curriculum.academies[2].range, "9-12", "scholar range should be 9-12");
assert.ok(totals.courseCount >= 70, "K-12 map should include broad course coverage");
assert.ok(totals.plannedUnitCount >= 250, "K-12 map should include planned unit coverage");
assert.ok(totals.targetLessons >= 5000 && totals.targetLessons <= 7000, "target lessons should match full-school plan");
const viewContract = getAppViewContractSummary();
assert.equal(viewContract.passed, true, "all product views should have a valid navigation/access contract");
assert.equal(viewContract.totalViews, 14, "app should maintain the 14-view product surface");
assert.deepEqual(roleViewIds, ["student", "parent", "teacher", "school"], "role views should remain the four account home surfaces");
assert.equal(new Set(appViewIds).size, appViewIds.length, "view ids should be unique");
assert.ok(appViews.every((view) => view.label && view.icon && view.purpose), "each view contract should include label, icon, and purpose");
assert.equal(viewLabels.length, appViewIds.length, "view labels should cover every app view");
assert.deepEqual(Object.keys(viewIcons), appViewIds, "view icons should cover every app view in order");
assert.deepEqual(allowedViewsByRole["school-admin"], appViewIds, "school admin should access the complete app surface");
assert.deepEqual(allowedViewsByRole["platform-admin"], appViewIds, "platform admin should access the complete app surface");
assert.deepEqual(allowedViewsByRole.student, ["student", "lesson", "ai"], "student access should stay limited to learner-facing pages");

const frameworkIds = standardsFrameworks.map((framework) => framework.id);
for (const id of ["ccss-ela", "ccss-math", "ngss", "c3", "shape", "k12cs", "arts", "sel"]) {
  assert.ok(frameworkIds.includes(id), `standards framework ${id} should exist`);
}

for (const lesson of pilotLessons) {
  assert.ok(lesson.objective, `${lesson.id} should have an objective`);
  assert.ok(lesson.sections.warmup, `${lesson.id} should have a warm-up`);
  assert.ok(lesson.sections.teach, `${lesson.id} should have instruction`);
  assert.ok(lesson.sections.reteach, `${lesson.id} should have a reteach path`);
  assert.ok(lesson.sections.challenge, `${lesson.id} should have a challenge path`);
  assert.ok(lesson.standards.length >= 1, `${lesson.id} should have standards`);
  assert.ok(lesson.quiz.length >= 2, `${lesson.id} should have quiz evidence`);
  assert.equal(lesson.masteryThreshold, 80, `${lesson.id} should use the default mastery threshold`);
  assert.ok(lesson.visual, `${lesson.id} should include a visual prompt`);
  assert.ok(lesson.funTasks.length >= 3, `${lesson.id} should include interesting tasks`);
  assert.ok(lesson.retentionChecks.length >= 3, `${lesson.id} should include delayed retention checks`);
  assert.ok(lesson.reward, `${lesson.id} should include a reward contract`);
  assert.ok(lesson.teachingSupport?.summary, `${lesson.id} should include a learner-facing summary`);
  assert.ok(lesson.teachingSupport?.description, `${lesson.id} should include a teaching description`);
  assert.ok(lesson.teachingSupport?.diagramCallouts?.length >= 3, `${lesson.id} should include diagram callouts`);
  assert.ok(lesson.teachingSupport?.helperNotes?.length >= 3, `${lesson.id} should include helper notes`);
  assert.ok(lesson.teachingSupport?.commonMisunderstandings?.length >= 2, `${lesson.id} should include common misunderstandings`);
  assert.ok(lesson.teachingSupport?.confusionPrompt, `${lesson.id} should include a tutor confusion prompt`);
  assert.ok(lesson.studentFacing?.mission, `${lesson.id} should include a student-facing mission`);
  assert.ok(lesson.studentFacing?.whyItMatters, `${lesson.id} should explain why the lesson matters to the student`);
  assert.ok(lesson.studentFacing?.bigIdea, `${lesson.id} should include a student-facing big idea`);
  assert.ok(lesson.studentFacing?.modelSteps?.length >= 3, `${lesson.id} should include student model steps`);
  assert.ok(lesson.studentFacing?.example, `${lesson.id} should include a concrete example`);
  assert.ok(lesson.studentFacing?.nonExample, `${lesson.id} should include a non-example or watch-out`);
  assert.ok(lesson.studentFacing?.quickCheck, `${lesson.id} should include a quick check`);
  assert.ok(lesson.studentFacing?.studentSummary, `${lesson.id} should include a student summary`);
  assert.ok(lesson.studentFacing?.tutorHandoff, `${lesson.id} should include a tutor handoff prompt`);
  const lessonContentGrade = gradeLessonContent(lesson);
  assert.equal(lessonContentGrade.passed, true, `${lesson.id} should pass the production lesson content grader`);
  assert.equal(lessonContentGrade.grade, "A", `${lesson.id} should earn an A-level lesson content grade`);
  assert.ok(lessonContentGrade.scoreByCategory.some((item) => item.id === "studentFacingTeaching"), `${lesson.id} should include student-facing teaching scoring`);
  assert.ok(lessonContentGrade.requiredVisuals.length >= 1, `${lesson.id} grading should return required visual guidance`);
}

const learningAiLesson = pilotLessons.find((lesson) => lesson.id === "g6-learning-ai-build-test");
assert.ok(learningAiLesson, "Learning AI special lesson should be part of the reviewed lesson catalog");
assert.equal(learningAiLesson.contentStatus, "special_showcase", "Learning AI should be marked as a special showcased lesson");
assert.equal(learningAiLesson.subject, "computer-science", "Learning AI should live in the computer science subject");
assert.equal(learningAiLesson.showcase?.priority, 1, "Learning AI should have top showcase priority");
assert.match(learningAiLesson.objective, /frontend/i, "Learning AI objective should cover frontend work");
assert.match(learningAiLesson.objective, /backend/i, "Learning AI objective should cover backend work");
assert.match(learningAiLesson.objective, /bug-testing/i, "Learning AI objective should cover testing and bugs");
assert.ok(learningAiLesson.teachingSupport.commonMisunderstandings.some((item) => /AI always knows the truth/i.test(item.mistake)), "Learning AI should address AI truth and hallucination risk");
assert.ok(learningAiLesson.teachingSupport.helperNotes.some((note) => /private/i.test(note)), "Learning AI should include privacy guidance");
assert.ok(learningAiLesson.groupHomework.roles.includes("Safety reviewer"), "Learning AI group work should include a safety reviewer role");
assert.ok(learningAiLesson.quiz.some((item) => /bug report/i.test(item.prompt)), "Learning AI should test bug-reporting skill");
assert.equal(learningAiLesson.schemaVersion, "3", "Learning AI should be a native V3 showcase lesson");
assert.equal(learningAiLesson.lessonFamily, "project_studio", "Learning AI should use the project studio lesson family");
assert.ok(learningAiLesson.definitionCards.some((card) => card.term === "Hallucination"), "Learning AI should define hallucination risk");
assert.ok(learningAiLesson.definitionCards.some((card) => card.term === "Deployment"), "Learning AI should include deployment vocabulary");
assert.ok(learningAiLesson.definitionCards.some((card) => card.term === "AI agent"), "Learning AI should define agent boundaries");
assert.ok(learningAiLesson.definitionCards.some((card) => card.term === "Tool call"), "Learning AI should define tool calls");
assert.ok(learningAiLesson.definitionCards.some((card) => card.term === "Environment variable"), "Learning AI should define environment variables");
assert.ok(learningAiLesson.definitionCards.some((card) => card.term === "Cost limit"), "Learning AI should teach cost controls");
assert.ok(learningAiLesson.builderPath.some((step) => /Test before trusting/i.test(step.title)), "Learning AI should include a testing-before-trusting builder step");
assert.ok(learningAiLesson.builderPath.some((step) => /Launch with guardrails/i.test(step.title)), "Learning AI should include launch guardrails");
assert.ok(learningAiLesson.vocabularyTerms.includes("accessibility"), "Learning AI V3 vocabulary should include accessibility");
assert.ok(learningAiLesson.vocabularyTerms.includes("tool call"), "Learning AI V3 vocabulary should include tool calls");
assert.ok(learningAiLesson.feedbackRules.some((rule) => rule.diagnosisCode === "weak_debug_report"), "Learning AI should diagnose weak bug reports");
assert.ok(learningAiLesson.feedbackRules.some((rule) => rule.diagnosisCode === "unsafe_agent_or_tool_use"), "Learning AI should diagnose unsafe agent/tool use");
assert.ok(learningAiLesson.quiz.some((item) => /paid image tool/i.test(item.prompt)), "Learning AI should test cost-controlled tool use");
const learningAiGrade = gradeLessonContent(learningAiLesson);
assert.equal(learningAiGrade.grade, "A", "Learning AI should earn an A-level content grade");
assert.equal(learningAiGrade.passed, true, "Learning AI should pass the lesson content grader");

const pilotQualityGate = getPilotQualityGateReport(createInitialState());
assert.equal(pilotQualityGate.totalLessons, pilotLessons.length, "pilot quality gate should cover every pilot and showcased lesson");
assert.equal(pilotQualityGate.scaleUnlocked, true, "lesson scale visual gate should unlock after every pilot has all required phase-specific visuals");
assert.equal(pilotQualityGate.passedLessons, pilotLessons.length, "all pilot lessons should pass after approved placement-specific visuals are seeded");
assert.equal(pilotQualityGate.summary.missingVisualPlacements, 0, "pilot quality board should report no missing phase-specific visual placements");
assert.ok(
  pilotQualityGate.lessons.every((item) => item.checks.content && item.checks.prompt && item.checks.quiz && item.checks.tutor && item.checks.accessibility),
  "pilots should pass content, prompt, quiz, tutor, and accessibility checks"
);
assert.ok(
  pilotQualityGate.lessons.every((item) => item.visualPlacementStatus.requiredPlacements.includes("teaching-diagram")),
  "pilot gate should require approved teaching-diagram assets, not just hero images"
);
assert.ok(
  pilotQualityGate.lessons.every((item) => item.visualPlacementStatus.missingPlacements.length === 0),
  "pilot gate should have approved misconception-repair assets when lessons include common misunderstandings"
);
const firstPilotGate = pilotQualityGate.lessons[0];
const firstPilotBaseAsset = createInitialState().visualAssets.find((asset) => asset.lessonId === firstPilotGate.lessonId);
const firstPilotCompleteVisualState = {
  ...createInitialState(),
  visualAssets: [
    ...createInitialState().visualAssets,
    ...firstPilotGate.visualPlacementStatus.missingPlacements.map((placement) => ({
      ...firstPilotBaseAsset,
      id: `asset-test-${firstPilotGate.lessonId}-${placement}`,
      placement,
      title: `${firstPilotGate.title} ${placement}`,
      caption: `${firstPilotGate.title} ${placement} approved production visual.`,
      altText: `${firstPilotGate.title} ${placement} visual.`,
      updatedAt: "2026-07-15T12:00:00.000Z"
    }))
  ]
};
const firstPilotCompleteGate = getPilotQualityGateReport(firstPilotCompleteVisualState).lessons.find((item) => item.lessonId === firstPilotGate.lessonId);
assert.equal(firstPilotCompleteGate.checks.visual, true, "a pilot should clear the visual gate only after every required placement has an approved asset");
assert.equal(firstPilotCompleteGate.visualPlacementStatus.missingPlacements.length, 0, "completed pilot visual gate should report no missing placements");

const nexusV3Summary = getNexusV3ContractSummary();
assert.equal(nexusV3Summary.schemaVersion, "3", "Nexus V3 contract should declare schema version 3");
assert.ok(nexusLessonFamilies.includes("inquiry_investigation"), "Nexus V3 should support inquiry/investigation lessons");
assert.ok(nexusLearningPhases.includes("remember"), "Nexus V3 should include the Memory Vault remember phase");
assert.ok(nexusMasteryProofs.includes("transfer"), "Nexus V3 should include transfer proof");
assert.deepEqual(
  nexusV3Summary.schemas,
  [
    "lesson-v3/lesson.schema.json",
    "lesson-v3/unit.schema.json",
    "lesson-v3/mastery-evidence.schema.json",
    "lesson-v3/memory-vault.schema.json",
    "lesson-v3/error-intelligence.schema.json"
  ],
  "Nexus V3 should publish all core contract schemas"
);
for (const schemaPath of nexusV3Summary.schemas) {
  const schema = JSON.parse(readFileSync(`schemas/${schemaPath}`, "utf8"));
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema", `${schemaPath} should be valid JSON Schema draft 2020-12`);
}
const validV3Unit = {
  schemaVersion: "3",
  id: "unit-g6-ratios",
  title: "Ratios and Fair Comparisons",
  academy: "bridge",
  gradeLevel: "6",
  subject: "math",
  lessonIds: ["g6-math-ratios-unit-rates"],
  unitObjectives: ["Compare ratios using equivalent representations."],
  assessment: { proofs: ["recall", "explain", "perform", "retain", "transfer"] }
};
assert.equal(validateNexusUnitV3(validV3Unit).passed, true, "valid V3 unit should pass contract validation");
assert.equal(validateNexusUnitV3({ ...validV3Unit, lessonIds: [] }).passed, false, "unit without lessons should fail contract validation");
assert.equal(
  validateNexusMasteryEvidenceV3({ id: "evidence-1", learnerId: "avery", lessonId: "g6-math-ratios-unit-rates", proof: "transfer", result: "correct", learningState: "transferable", assistance: "independent", recordedAt: "2026-07-16T00:00:00Z" }).passed,
  true,
  "independent transfer evidence should pass contract validation"
);
assert.equal(
  validateNexusMasteryEvidenceV3({ id: "evidence-2", learnerId: "avery", lessonId: "g6-math-ratios-unit-rates", proof: "retain", result: "correct", learningState: "durable", assistance: "unknown", recordedAt: "2026-07-16T00:00:00Z" }).passed,
  false,
  "unknown assistance should fail mastery evidence validation"
);
assert.equal(
  validateNexusMemoryVaultItemV3({ id: "vault-1", learnerId: "avery", skillId: "ratio", lessonId: "g6-math-ratios-unit-rates", reviewMode: "mix", currentLearningState: "durable", nextReviewAt: "2026-07-17T00:00:00Z" }).passed,
  true,
  "valid Memory Vault item should pass contract validation"
);
assert.equal(
  validateNexusErrorIntelligenceV3({
    id: "error-1",
    learnerId: "avery",
    lessonId: "g6-math-ratios-unit-rates",
    result: { response: "", correctness: "incorrect" },
    diagnosis: { code: "total_price_trap", confidence: 0.9 },
    hint: { level: 1, text: "Compare the unit amounts first." },
    action: { type: "alternate_representation", target: "ratio-table" },
    recordedAt: "2026-07-16T00:00:00Z"
  }).passed,
  true,
  "valid error-intelligence record should pass contract validation"
);
const nativeBridgeWeatherLesson = pilotLessons.find((item) => item.id === "g6-earth-systems-weather");
const nativeBridgeRatiosLesson = pilotLessons.find((item) => item.id === "g6-math-ratios-unit-rates");
const nativeLearningAiLesson = pilotLessons.find((item) => item.id === "g6-learning-ai-build-test");
assert.equal(nativeBridgeRatiosLesson.schemaVersion, "3", "Grade 6 ratios exemplar should be a native V3 lesson");
assert.equal(nativeBridgeRatiosLesson.lessonFamily, "skill_workshop", "Grade 6 ratios exemplar should use the skill workshop lesson family");
assert.deepEqual(
  nativeBridgeRatiosLesson.activePhases,
  ["orient", "model", "deconstruct", "practice", "reason", "prove", "remember", "transfer", "adapt"],
  "Grade 6 ratios native V3 exemplar should declare the full phase path"
);
assert.deepEqual(
  nativeBridgeRatiosLesson.requiredMasteryProofs,
  ["recall", "explain", "perform", "retain", "transfer"],
  "Grade 6 ratios exemplar should require all five major mastery proofs"
);
assert.ok(
  nativeBridgeRatiosLesson.externalReferenceCards.every((card) => card.studentVisibility === false && card.reviewStatus === "manager-review-required"),
  "IXL reference cards should stay hidden from students until manager approval"
);
const nativeBridgeRatiosValidation = validateNexusLessonV3(nativeBridgeRatiosLesson);
assert.equal(nativeBridgeRatiosValidation.passed, true, "Grade 6 ratios native V3 exemplar should pass V3 validation");
assert.equal(nativeBridgeRatiosValidation.native, true, "Grade 6 ratios exemplar should be reported as native");
assert.deepEqual(
  getRenderableNexusPhaseModules(nativeBridgeRatiosLesson).map((module) => module.phase),
  nativeBridgeRatiosLesson.activePhases,
  "Native Grade 6 ratios V3 phase modules should render in activePhases order"
);
assert.ok(
  nativeBridgeRatiosLesson.feedbackRules.some((rule) => rule.diagnosisCode === "total_price_trap"),
  "Grade 6 ratios exemplar should diagnose total-price trap misconceptions"
);
assert.equal(nativeBridgeWeatherLesson.schemaVersion, "3", "Grade 6 weather exemplar should now be a native V3 lesson");
assert.equal(nativeBridgeWeatherLesson.lessonFamily, "inquiry_investigation", "Grade 6 weather exemplar should use the inquiry lesson family");
assert.deepEqual(
  nativeBridgeWeatherLesson.activePhases,
  ["orient", "model", "deconstruct", "practice", "reason", "prove", "remember", "transfer", "adapt"],
  "Grade 6 native V3 exemplar should declare the full unit-representative phase path"
);
assert.deepEqual(
  nativeBridgeWeatherLesson.requiredMasteryProofs,
  ["recall", "explain", "perform", "retain", "transfer"],
  "Grade 6 native V3 exemplar should require all five major mastery proofs"
);
const nativeBridgeValidation = validateNexusLessonV3(nativeBridgeWeatherLesson);
assert.equal(nativeBridgeValidation.passed, true, "Grade 6 native V3 exemplar should pass V3 validation");
assert.equal(nativeBridgeValidation.native, true, "Grade 6 native V3 exemplar should be reported as native");
assert.deepEqual(
  getRenderableNexusPhaseModules(nativeBridgeWeatherLesson).map((module) => module.phase),
  nativeBridgeWeatherLesson.activePhases,
  "Native Grade 6 V3 phase modules should render in activePhases order"
);
const nativeLearningAiValidation = validateNexusLessonV3(nativeLearningAiLesson);
assert.equal(nativeLearningAiValidation.passed, true, "Learning AI native V3 showcase should pass V3 validation");
assert.deepEqual(
  getRenderableNexusPhaseModules(nativeLearningAiLesson).map((module) => module.phase),
  nativeLearningAiLesson.activePhases,
  "Learning AI native V3 phase modules should render in activePhases order"
);
assert.deepEqual(
  nativeLearningAiLesson.requiredMasteryProofs,
  ["recall", "explain", "perform", "retain", "transfer"],
  "Learning AI should require all five major mastery proofs"
);
const nativeFoundationFractionsLesson = pilotLessons.find((item) => item.id === "g3-fractions-number-line");
const nativeScholarCellsLesson = pilotLessons.find((item) => item.id === "g9-biology-cells");
for (const [lesson, label] of [
  [nativeFoundationFractionsLesson, "Foundation fractions"],
  [nativeScholarCellsLesson, "Scholar cells"]
]) {
  const validation = validateNexusLessonV3(lesson);
  assert.equal(lesson.schemaVersion, "3", `${label} should be a native V3 exemplar`);
  assert.equal(validation.passed, true, `${label} should pass V3 validation`);
  assert.deepEqual(
    getRenderableNexusPhaseModules(lesson).map((module) => module.phase),
    lesson.activePhases,
    `${label} phase modules should follow authored active phase order`
  );
  assert.deepEqual(lesson.requiredMasteryProofs, ["recall", "explain", "perform", "retain", "transfer"], `${label} should require the full evidence path`);
}
const adaptedPilotLesson = adaptV2LessonToNexusV3(pilotLessons.find((item) => item.id === "g3-ela-main-idea-evidence"));
assert.equal(adaptedPilotLesson.schemaVersion, "v2-adapted", "V2 adapter should label adapted lessons instead of pretending they are native V3");
assert.equal(adaptedPilotLesson.academy, "foundation", "V2 adapter should infer Foundation Academy from a grade 3 lesson");
assert.ok(adaptedPilotLesson.activePhases.includes("remember"), "V2 adapter should preserve retention work as the remember phase");
assert.ok(adaptedPilotLesson.requiredMasteryProofs.includes("retain"), "V2 adapter should require retain proof when retention checks exist");
assert.ok(adaptedPilotLesson.migration.warnings.some((warning) => warning.includes("not a native V3")), "V2 adapter should warn that migration is not a redesign");
const adaptedValidation = validateNexusLessonV3(adaptedPilotLesson, { requireNative: false });
assert.equal(adaptedValidation.passed, true, "adapted V2 lesson should satisfy compatibility validation");
assert.equal(adaptedValidation.native, false, "adapted V2 lesson should not be reported as native V3");
assert.ok(adaptedValidation.warnings.length >= 1, "adapted V2 lesson should carry migration warnings");
const adaptedRenderablePhases = getRenderableNexusPhaseModules(adaptedPilotLesson).map((module) => module.phase);
assert.deepEqual(adaptedRenderablePhases, adaptedPilotLesson.activePhases, "renderable V3 phase modules should follow activePhases order");
const nativeV3Lesson = {
  ...adaptedPilotLesson,
  schemaVersion: "3",
  sourceSchemaVersion: undefined,
  migration: undefined,
  contentStatus: "draft",
  version: "3.0.0"
};
const nativeValidation = validateNexusLessonV3(nativeV3Lesson);
assert.equal(nativeValidation.passed, true, "native V3-shaped lesson should pass contract validation");
const brokenV3Lesson = {
  ...nativeV3Lesson,
  activePhases: ["orient", "transfer"],
  phaseModules: nativeV3Lesson.phaseModules.filter((module) => module.phase !== "transfer"),
  requiredMasteryProofs: ["transfer"]
};
const brokenValidation = validateNexusLessonV3(brokenV3Lesson);
assert.equal(brokenValidation.passed, false, "V3 validation should reject active phases without modules");
assert.ok(brokenValidation.errors.some((error) => error.path === "phaseModules"), "V3 validation should identify the missing phase module");
const sparsePhaseLesson = {
  ...nativeV3Lesson,
  activePhases: ["orient", "model", "transfer"],
  phaseModules: [
    nativeV3Lesson.phaseModules.find((module) => module.phase === "transfer"),
    { ...nativeV3Lesson.phaseModules.find((module) => module.phase === "orient"), studentAction: "" },
    nativeV3Lesson.phaseModules.find((module) => module.phase === "model")
  ]
};
assert.deepEqual(
  getRenderableNexusPhaseModules(sparsePhaseLesson).map((module) => module.phase),
  ["model", "transfer"],
  "V3 render model should omit empty phases and preserve activePhases order"
);

const incompleteLessonGrade = gradeLessonContent({ id: "weak-lesson", title: "", subject: "math" });
assert.equal(incompleteLessonGrade.passed, false, "incomplete lessons should not pass the lesson grader");
assert.equal(incompleteLessonGrade.grade, "F", "missing objective should force a blocked lesson grade");
assert.ok(incompleteLessonGrade.missingRequirements.length >= 3, "weak lesson grading should list missing requirements");
const lessonRevisionBrief = createRevisionBrief(incompleteLessonGrade, { id: "weak-lesson" });
assert.equal(lessonRevisionBrief.targetGrade, "A", "revision brief should target an A grade");
assert.ok(lessonRevisionBrief.specificImprovements.length >= 1, "revision brief should include concrete improvements");

const grades = pilotLessons.map((lesson) => lesson.grade);
for (const grade of ["3", "6", "9"]) {
  assert.ok(grades.includes(grade), `pilot content should include grade ${grade}`);
}

const grade3Subjects = new Set(pilotLessons.filter((lesson) => lesson.grade === "3").map((lesson) => lesson.subject));
for (const subject of ["ela", "math", "science", "social-studies"]) {
  assert.ok(grade3Subjects.has(subject), `grade 3 pilot should include ${subject}`);
}

for (const grade of ["6", "9"]) {
  const lessonForGrade = pilotLessons.find((item) => item.grade === grade);
  assert.ok(lessonForGrade.groupHomework, `grade ${grade} lesson should include structured group homework`);
  assert.ok(lessonForGrade.groupHomework.roles.length >= 3, `grade ${grade} group homework should include team roles`);
}

assert.ok(learningScienceSources.length >= 5, "learning model should include evidence anchors");
assert.ok(evidenceGuidanceAudit.sources.length >= 7, "evidence guidance audit should include EEF and WWC sources");
assert.equal(
  evidenceGuidanceAudit.sources.find((source) => source.id === "eef-maths-ks2-3").recommendations.length,
  8,
  "EEF KS2/3 math source should include eight recommendations"
);
for (const sourceId of ["eef-maths-ks2-3", "eef-early-maths", "eef-implementation", "wwc-young-math", "wwc-rti-math", "wwc-problem-solving", "wwc-algebra"]) {
  assert.ok(evidenceGuidanceAudit.sources.some((source) => source.id === sourceId), `evidence source ${sourceId} should exist`);
}
assert.ok(evidenceGuidanceAudit.requiredMathLessonMoves.length >= 12, "math lessons should have required evidence moves");
const evidenceSummary = getEvidenceGuidanceSummary();
assert.ok(evidenceSummary.recommendationCount >= 25, "evidence summary should count mapped recommendations");
assert.equal(evidenceSummary.requiredMoveCount, evidenceGuidanceAudit.requiredMathLessonMoves.length, "evidence summary should count required moves");

const mathEvidenceAudit = getLessonEvidenceAudit("g3-fractions-number-line");
assert.equal(mathEvidenceAudit.passed, true, "grade 3 fraction lesson should pass evidence guidance audit");
assert.equal(mathEvidenceAudit.present, mathEvidenceAudit.required, "grade 3 fraction lesson should include all required evidence moves");
for (const key of evidenceGuidanceAudit.requiredMathLessonMoves.map((move) => move.key)) {
  assert.ok(mathEvidenceAudit.evidenceMoves[key], `fraction lesson should include evidence move ${key}`);
}
assert.ok(radicalLearningModel.principles.length >= 8, "radical learning model should include core principles");
assert.ok(radicalLearningModel.rewardSystem.length >= 5, "reward model should include multiple reward types");
assert.ok(radicalLearningModel.metrics.includes("7-day recall"), "learning model should measure delayed retention");
assert.ok(radicalLearningModel.metrics.includes("Joy rating"), "learning model should measure fun and motivation");
assert.ok(parentOnboardingModel.requiredSteps.length >= 5, "parent onboarding should include setup, consent, placement, and rewards");
assert.ok(diagnosticBlueprints.length >= 4, "diagnostic blueprints should cover foundation, bridge, and scholar needs");
assert.ok(rewardCatalog.length >= 4, "reward catalog should include configurable reward types");
assert.ok(experimentTemplates.length >= 3, "experiments should include multiple safe learning variants");

const labSummary = getRadicalLearningSummary();
assert.ok(labSummary.experimentSteps >= 5, "trial-and-error engine should include an experiment loop");
assert.ok(labSummary.metrics.length >= 8, "trial-and-error engine should track learning and experience metrics");

const middleExperience = getLessonExperience("g6-earth-systems-weather");
assert.equal(middleExperience.hasVisual, true, "middle lesson should expose a visual");
assert.equal(middleExperience.hasGroupHomework, true, "middle lesson should expose group homework");
assert.ok(middleExperience.funTaskCount >= 3, "middle lesson should expose interesting tasks");
assert.ok(middleExperience.teachingSupportCount >= 8, "middle lesson should expose rich teaching support");

const teachingSupport = getLessonTeachingSupport("g3-fractions-number-line");
assert.match(teachingSupport.summary, /equal spaces/i, "teaching support should summarize the key concept");
assert.ok(teachingSupport.commonMisunderstandings.some((item) => /tick marks/i.test(item.mistake)), "teaching support should identify common misunderstanding patterns");

const lesson = pilotLessons[0];
const perfectAnswers = Object.fromEntries(lesson.quiz.map((question) => [question.id, question.answerIndex]));
const perfectScore = scoreQuiz(lesson, perfectAnswers);
assert.equal(perfectScore.score, 100, "perfect quiz should score 100");
assert.equal(perfectScore.passed, true, "perfect quiz should pass mastery");

let state = createInitialState();
const initialVisualAudit = getVisualLearningAgentAudit(state);
assert.ok(initialVisualAudit.totalSlots >= 50, "visual audit should expose the comprehensive lesson visual backlog");
assert.ok(initialVisualAudit.byStatus.missing > 0, "visual audit should identify unproduced visual slots");
assert.ok(initialVisualAudit.byStatus.approved > 0, "visual audit should identify approved visual slots");
assert.equal(initialVisualAudit.slots[0].assetStatus, "missing", "visual queue should prioritize missing slots before complete slots");
assert.ok(initialVisualAudit.highPriority > 0, "visual audit should expose high-priority visual work");
assert.equal(initialVisualAudit.fullCatalog.lessonCount, 6100, "visual audit should include the full lesson library catalog");
assert.equal(initialVisualAudit.fullCatalog.slotCount, 69488, "full catalog should expand every lesson into the documented visual slots");
assert.equal(initialVisualAudit.fullCatalog.byBand["K-5"], 2808, "full visual catalog should preserve Foundation lesson count");
assert.equal(initialVisualAudit.fullCatalog.byBand["6-8"], 1388, "full visual catalog should preserve Bridge lesson count");
assert.equal(initialVisualAudit.fullCatalog.byBand["9-12"], 1904, "full visual catalog should preserve Scholar lesson count");
const catalogSample = getLessonVisualCatalog(getPlatformLessonLibrarySamples(1)[0]);
assert.ok(catalogSample.length >= 10, "each full-library lesson should receive a phase-level visual catalog");
assert.ok(catalogSample.every((slot) => slot.prompt && slot.reviewChecklist.length >= 5), "full-library visual slots should include prompts and review metadata");
assert.equal(getFullLibraryVisualCatalogSummary({ lessons: getPlatformLessonLibrarySamples(1) }).lessonCount, 1, "visual catalog summary should support scoped batch previews");
const visualBatchPlan = getVisualProductionBatchPlan({ batchSize: 24, limit: 6, assets: state.visualAssets });
assert.equal(visualBatchPlan.selectedBatches, 6, "visual production planning should support a bounded batch preview");
assert.ok(visualBatchPlan.totalRequiredSlots > 0, "visual production batches should calculate required slot counts");
assert.ok(visualBatchPlan.batches.every((batch) => batch.resolvedLessonCount === batch.lessonCount), "visual batch planning should resolve every sampled lesson to its visual slots");
assert.ok(visualBatchPlan.batches.every((batch) => batch.visualGate === "missing-assets" || batch.visualGate === "review-required" || batch.visualGate === "ready"), "visual batches should expose an explicit gate state");
assert.equal(visualBatchPlan.batches[0].gradeLevel, "6", "visual batch planning should prioritize the Grade 6 school wedge");
assert.equal(visualBatchPlan.batches[0].subject, "math", "visual batch planning should prioritize Grade 6 math first");
const polishedBridgeDraft = state.contentDrafts.find((draft) => draft.id === "draft-next-wave-bridge-6-ela-u1-l1");
assert.ok(polishedBridgeDraft, "initial state should include the Grade 6 mythology next-wave draft");
assert.equal(polishedBridgeDraft.title, "Myth Lab: Decode the Hero's Journey", "Grade 6 mythology draft should use the polished lesson title");
assert.ok(polishedBridgeDraft.studentFacing?.modelSteps?.length >= 4, "Grade 6 mythology draft should include student-facing model steps");
assert.ok(polishedBridgeDraft.visualSupports.length >= 4, "Grade 6 mythology draft should include multiple purposeful visual supports");
assert.ok(polishedBridgeDraft.commonMisunderstandings.length >= 3, "Grade 6 mythology draft should include multiple misconception repairs");
assert.ok(polishedBridgeDraft.quizQuestions.length >= 4, "Grade 6 mythology draft should include a stronger quiz set");
const polishedBridgeApproval = resolveAgentReviewItem(state, `content:${polishedBridgeDraft.id}`, "approve");
const polishedBridgePublishedLesson = polishedBridgeApproval.state.publishedLessons.find((item) => item.sourceDraftId === polishedBridgeDraft.id);
assert.ok(polishedBridgePublishedLesson, "manager approval should publish the polished Grade 6 mythology lesson");
assert.equal(polishedBridgePublishedLesson.studentFacing.mission, "Decode a myth like a story engineer", "published Grade 6 mythology lesson should preserve the student-facing mission");
assert.ok(polishedBridgePublishedLesson.groupHomework?.sharedOutcome.includes("Myth Decoder Board"), "published Grade 6 mythology lesson should preserve group homework artifact");
assert.ok(polishedBridgePublishedLesson.teachingSupport.commonMisunderstandings.length >= 3, "published Grade 6 mythology lesson should preserve misconception repair");
const bridgeBatchOneDrafts = state.contentDrafts.filter((draft) => draft.sourceBatchId === "bridge-academy-grade-6-batch-1");
assert.equal(bridgeBatchOneDrafts.length, 5, "initial state should include the five-lesson Bridge Academy Grade 6 Batch 1 seed");
assert.deepEqual(
  bridgeBatchOneDrafts.map((draft) => draft.unitTitle).sort(),
  [
    "Close Reading And Evidence",
    "Earth Systems, Weather, And Climate",
    "Expressions, Equations, And Variables",
    "Historical Thinking, Geography, And Early Humans",
    "Ratios, Rates, And Proportional Reasoning"
  ].sort(),
  "Bridge Batch 1 should match the documented Grade 6 production units"
);
assert.ok(
  bridgeBatchOneDrafts.every(
    (draft) =>
      draft.status === "review" &&
      draft.academyId === "bridge" &&
      draft.grade === "6" &&
      draft.visualSupports.length >= 5 &&
      draft.commonMisunderstandings.length >= 3 &&
      draft.quizQuestions.length >= 4 &&
      draft.groupHomework?.roles?.length >= 4 &&
      draft.sourceCards.length >= 2 &&
      draft.studentFacing?.modelSteps?.length >= 4
  ),
  "every Bridge Batch 1 draft should be a review-ready app-led class lesson with visuals, group work, tutor supports, quiz, and source cards"
);
assert.ok(
  bridgeBatchOneDrafts.every((draft) => getContentDraftCompletenessReview(draft).passed),
  "every Bridge Batch 1 draft should pass the content completeness gate before manager review"
);
assert.ok(
  bridgeBatchOneDrafts.every((draft) => gradeLessonContent({ ...draft, quiz: draft.quizQuestions, teachingSupport: { commonMisunderstandings: draft.commonMisunderstandings, helperNotes: draft.helperNotes, confusionPrompt: draft.studentFacing?.tutorHandoff }, visual: draft.visual || draft.visualSupports[0], groupHomework: draft.groupHomework }).score >= 80),
  "every Bridge Batch 1 draft should meet at least the B-level lesson content quality threshold"
);
const bridgeBatchReviewQueue = getAgentReviewQueue(state);
assert.ok(bridgeBatchReviewQueue.batchReview >= 1, "manager review queue should count pending batch reviews");
const unpublishedBridgeCoursePath = getBridgeGrade6CoursePath(state, "maya");
assert.equal(unpublishedBridgeCoursePath.publicationStatus, "not-published", "Bridge Grade 6 course path should not expose unpublished batch lessons");
assert.equal(unpublishedBridgeCoursePath.totalLessons, 0, "Bridge Grade 6 course path should stay empty until publication");
const bridgeBatchReviewItem = bridgeBatchReviewQueue.items.find((item) => item.id === "batch:bridge-academy-grade-6-batch-1");
assert.ok(bridgeBatchReviewItem, "Bridge Batch 1 should enter the manager review queue as a batch item");
assert.equal(bridgeBatchReviewItem.type, "batch", "Bridge Batch 1 review item should use the batch review type");
assert.equal(bridgeBatchReviewItem.passed, true, "Bridge Batch 1 review item should pass the batch quality preflight");
assert.ok(bridgeBatchReviewItem.actions.includes("approve"), "Bridge Batch 1 review item should expose manager approval");
const bridgeBatchDossier = getManagerReviewDossier(state, "batch:bridge-academy-grade-6-batch-1");
assert.equal(bridgeBatchDossier.found, true, "manager review dossier should resolve Bridge Batch 1");
assert.equal(bridgeBatchDossier.artifactType, "batch", "Bridge Batch 1 dossier should identify batch artifact type");
assert.ok(bridgeBatchDossier.reviewChecklist.length >= 3, "Bridge Batch 1 dossier should include batch review checklist");
const bridgeBatchProjection = getPlatformSeedProjection(state);
const bridgeBatchReviewRow = bridgeBatchProjection.tables.content_batch_reviews.find((row) => row.source_batch_id === "bridge-academy-grade-6-batch-1");
assert.ok(bridgeBatchReviewRow, "Bridge Batch 1 should project into content_batch_reviews");
assert.equal(bridgeBatchReviewRow.total_lessons, 5, "Bridge Batch 1 projection should store total lesson count");
assert.equal(bridgeBatchReviewRow.passed_lessons, 5, "Bridge Batch 1 projection should store passed lesson count");
assert.equal(bridgeBatchReviewRow.status, "manager-review", "Bridge Batch 1 projection should start in manager review");
assert.ok(
  bridgeBatchProjection.tables.agent_review_items.some((row) => row.source_type === "batch" && row.source_id === "bridge-academy-grade-6-batch-1"),
  "Bridge Batch 1 should project into normalized manager review items"
);
const approvedBridgeBatch = resolveAgentReviewItem(state, "batch:bridge-academy-grade-6-batch-1", "approve");
assert.equal(approvedBridgeBatch.result.accepted, true, "manager should approve Bridge Batch 1 as a batch");
assert.equal(approvedBridgeBatch.result.affectedDrafts, 5, "Bridge Batch 1 approval should affect all five batch drafts");
assert.ok(
  approvedBridgeBatch.state.contentDrafts
    .filter((draft) => draft.sourceBatchId === "bridge-academy-grade-6-batch-1")
    .every((draft) => draft.batchReviewStatus === "approved" && draft.batchReviewHistory.length >= 1),
  "Bridge Batch 1 approval should stamp every draft with batch review history"
);
assert.equal(
  getAgentReviewQueue(approvedBridgeBatch.state).items.some((item) => item.id === "batch:bridge-academy-grade-6-batch-1"),
  false,
  "approved Bridge Batch 1 should leave the pending batch review queue"
);
const approvedBridgeBatchProjection = getPlatformSeedProjection(approvedBridgeBatch.state);
const approvedBridgeBatchRow = approvedBridgeBatchProjection.tables.content_batch_reviews.find((row) => row.source_batch_id === "bridge-academy-grade-6-batch-1");
assert.equal(approvedBridgeBatchRow.status, "approved", "approved Bridge Batch 1 projection should store approved status");
assert.equal(approvedBridgeBatchRow.publish_eligible, true, "approved Bridge Batch 1 projection should become publish eligible");
assert.equal(
  approvedBridgeBatchProjection.tables.agent_review_items.some((row) => row.source_type === "batch" && row.source_id === "bridge-academy-grade-6-batch-1"),
  false,
  "approved Bridge Batch 1 should not project as a pending normalized review item"
);
const publishedBridgeBatch = publishApprovedContentBatch(approvedBridgeBatch.state, "bridge-academy-grade-6-batch-1", {
  reviewedAt: "2026-07-16 09:00",
  reviewedBy: "manager"
});
assert.equal(publishedBridgeBatch.result.accepted, true, "manager should be able to publish an approved Bridge Batch 1");
assert.equal(publishedBridgeBatch.result.totalLessons, 5, "Bridge Batch 1 publication should attempt all five lessons");
assert.equal(publishedBridgeBatch.result.publishedCount, 5, "Bridge Batch 1 publication should publish all five approved lessons");
assert.equal(publishedBridgeBatch.result.blockedCount, 0, "Bridge Batch 1 publication should not leave blocked lessons");
assert.equal(
  publishedBridgeBatch.state.visualAssets.filter((asset) => asset.sourceBatchId === "bridge-academy-grade-6-batch-1" && asset.status === "approved").length,
  40,
  "Bridge Batch 1 should carry eight approved visual placements for each of five lessons"
);
assert.ok(
  publishedBridgeBatch.state.visualAssets
    .filter((asset) => asset.sourceBatchId === "bridge-academy-grade-6-batch-1")
    .every((asset) => asset.assetKind === "generated-svg" && asset.svg.includes("<svg") && asset.generationMetadata?.slotId),
  "Bridge Batch 1 visual assets should contain deterministic SVG content and slot lineage"
);
assert.equal(
  publishedBridgeBatch.state.contentDrafts
    .filter((draft) => draft.sourceBatchId === "bridge-academy-grade-6-batch-1")
    .every((draft) => draft.status === "published" && !draft.publicationBlocked),
  true,
  "published Bridge Batch 1 should move its source drafts out of review into published state"
);
const publishedBridgeBatchLessons = publishedBridgeBatch.state.publishedLessons.filter((lesson) => lesson.sourceBatchId === "bridge-academy-grade-6-batch-1");
assert.equal(publishedBridgeBatchLessons.length, 5, "published Bridge Batch 1 should create five production lesson records");
assert.ok(
  publishedBridgeBatchLessons.every((lesson) => lesson.status === "published" && lesson.quiz.length >= 4 && lesson.visualSupports.length >= 5),
  "every published Bridge Batch 1 lesson should keep quiz and visual teaching supports"
);
assert.ok(
  publishedBridgeBatchLessons.every((lesson) => getApprovedLessonVisualAsset(publishedBridgeBatch.state, lesson.id, { includeInlineSvg: true })),
  "every published Bridge Batch 1 lesson should resolve an approved visual asset by published lesson id"
);
const publishedBridgeCoursePath = getBridgeGrade6CoursePath(publishedBridgeBatch.state, "maya");
assert.equal(publishedBridgeCoursePath.publicationStatus, "published", "Bridge Grade 6 course path should report published status after batch publication");
assert.equal(publishedBridgeCoursePath.totalLessons, 5, "Bridge Grade 6 course path should expose all five published Batch 1 lessons");
assert.equal(publishedBridgeCoursePath.subjectCount, 4, "Bridge Grade 6 course path should span math, science, ELA, and social studies");
assert.ok(publishedBridgeCoursePath.nextLessonId, "Bridge Grade 6 course path should identify the next attendable lesson");
assert.ok(
  publishedBridgeCoursePath.lessons.every((lesson) => lesson.visualSupportCount >= 5 && lesson.quizCount >= 4),
  "Bridge Grade 6 course path lessons should carry visuals and quiz checks into the student experience"
);
const secondBridgeMissionContext = getBridgeGrade6CoursePath(publishedBridgeBatch.state, "maya", {
  currentLessonId: publishedBridgeCoursePath.lessons[1].id
});
assert.equal(secondBridgeMissionContext.currentMissionNumber, 2, "Bridge lesson player context should identify the current mission number");
assert.equal(secondBridgeMissionContext.previousMission.id, publishedBridgeCoursePath.lessons[0].id, "Bridge lesson player context should expose previous mission navigation");
assert.equal(secondBridgeMissionContext.nextMission.id, publishedBridgeCoursePath.lessons[2].id, "Bridge lesson player context should expose next mission navigation");
assert.equal(
  getAgentReviewQueue(publishedBridgeBatch.state).items.some((item) => item.id === "batch:bridge-academy-grade-6-batch-1"),
  false,
  "published Bridge Batch 1 should stay out of the pending batch review queue"
);
const publishedBridgeBatchProjection = getPlatformSeedProjection(publishedBridgeBatch.state);
const publishedBridgeBatchRow = publishedBridgeBatchProjection.tables.content_batch_reviews.find((row) => row.source_batch_id === "bridge-academy-grade-6-batch-1");
assert.equal(publishedBridgeBatchRow.status, "published", "published Bridge Batch 1 projection should store published status");
assert.equal(publishedBridgeBatchRow.passed_lessons, 5, "published Bridge Batch 1 projection should store published lesson count");
assert.equal(publishedBridgeBatchRow.publish_eligible, false, "published Bridge Batch 1 projection should no longer be awaiting publication");
assert.ok(
  publishedBridgeBatchRow.review_history.some((entry) => entry.action === "batch-publication" && entry.publishedCount === 5),
  "published Bridge Batch 1 projection should retain batch publication history"
);
const classroomSummary = getClassroomProductSummary(state);
assert.equal(classroomSummary.bridgeClassReady, true, "initial state should include a Bridge Academy school/classroom pilot");
assert.equal(classroomSummary.activeSessions, 1, "initial state should include a class session");
assert.equal(classroomSummary.groupMissions, 1, "initial state should include a structured group mission");
const learnerClassSession = getLearnerClassSession(state, "maya");
assert.equal(learnerClassSession.classSection.academyId, "bridge", "Maya should be assigned to the Bridge classroom pilot");
assert.equal(learnerClassSession.lesson.id, "g6-earth-systems-weather", "Bridge classroom session should open the middle-school lesson");
assert.ok(learnerClassSession.session.steps.length >= 7, "class session should have an attendable class-period sequence");
const teacherClassMonitor = getTeacherClassMonitor(state);
assert.equal(teacherClassMonitor.metrics.enrolled, 1, "teacher monitor should count enrolled students");
assert.ok(
  teacherClassMonitor.adminReadiness.some((item) => item.label === "Class session" && item.status === "Ready to launch"),
  "school-admin readiness should expose the launchable class-session state"
);
const launchedClassSession = updateClassSessionStatus(state, {
  classSessionId: "session-weather-systems-1",
  status: "Live",
  stepId: "mini-lesson",
  stepStatus: "live"
});
assert.equal(launchedClassSession.result.accepted, true, "teacher should be able to launch a class session");
assert.equal(
  launchedClassSession.result.session.steps.find((step) => step.id === "mini-lesson").status,
  "live",
  "class launch should update a step state"
);
const submittedClassArtifact = submitClassroomArtifact(launchedClassSession.state, {
  missionId: "mission-weather-forecast-crew",
  learnerId: "maya",
  individualEvidence: "The pressure arrows changed my forecast because the air is moving toward the low-pressure area."
});
assert.equal(submittedClassArtifact.result.accepted, true, "student should submit individual evidence for a group mission");
assert.equal(getClassroomProductSummary(submittedClassArtifact.state).submittedArtifacts, 1, "classroom summary should count submitted artifacts");
const monitorAfterArtifact = getTeacherClassMonitor(submittedClassArtifact.state);
assert.equal(monitorAfterArtifact.metrics.submittedArtifacts, 1, "teacher monitor should count submitted group evidence");
assert.equal(monitorAfterArtifact.learners[0].artifact.artifactStatus, "submitted", "teacher monitor should expose artifact state");
const updatedGroupMission = updateGroupMission(launchedClassSession.state, {
  missionId: "mission-weather-forecast-crew",
  title: "Pressure Map Forecast Brief",
  groupSize: 4,
  sharedArtifact: "A labeled forecast map with three evidence callouts.",
  roleLabels: "evidence lead, map designer, skeptic, presenter",
  individualEvidence: "Each learner writes one evidence sentence linking pressure movement to the forecast.",
  teacherLookFor: "Every learner should explain why one pressure arrow supports the forecast instead of merely naming it."
});
assert.equal(updatedGroupMission.result.accepted, true, "teacher should be able to edit the group mission");
assert.equal(updatedGroupMission.result.mission.groupSize, 4, "mission edits should persist the configured group size");
assert.deepEqual(
  updatedGroupMission.result.mission.roleLabels,
  ["evidence lead", "map designer", "skeptic", "presenter"],
  "mission edits should normalize comma-separated student roles"
);
const invalidGroupMission = updateGroupMission(launchedClassSession.state, {
  missionId: "mission-weather-forecast-crew",
  title: "Short"
});
assert.equal(invalidGroupMission.result.accepted, false, "mission edits should reject incomplete accountability requirements");
assert.equal(
  getTeacherClassMonitor(submittedClassArtifact.state, "", { allowFallback: false }).classSection,
  null,
  "teacher monitor should not fall back to a demo class when strict class scope is required"
);
const classroomLesson = learnerClassSession.lesson;
const classroomTutorTurn = askAiTutor(submittedClassArtifact.state, {
  input: "I do not know the first step for connecting pressure arrows to a forecast.",
  lessonId: classroomLesson.id,
  ageBand: "6-8",
  learnerId: "maya",
  scratchpadReview: true
});
const classroomRetry = submitTutorHintRetry(classroomTutorTurn.state, {
  learnerId: "maya",
  lessonId: classroomLesson.id,
  retryAfterHint: "First I should name what the arrows show, then explain how the air movement changes the forecast."
});
const classroomWrongAnswers = Object.fromEntries(
  classroomLesson.quiz.map((question) => [question.id, Number(question.answerIndex) === 0 ? 1 : 0])
);
const classroomFailedQuiz = completeLessonQuiz(classroomRetry.state, classroomLesson.id, classroomWrongAnswers, { learnerId: "maya" });
const targetedMonitor = getTeacherClassMonitor(classroomFailedQuiz);
assert.equal(targetedMonitor.learners[0].adaptiveReteach.diagnosisLabel, "visual model", "teacher monitor should expose adaptive reteach diagnosis");
assert.match(targetedMonitor.learners[0].adaptiveReteach.reteachMove, /diagram|model/i, "teacher monitor should expose a targeted reteach move");
const targetedIntervention = recordTeacherIntervention(classroomFailedQuiz, {
  classSessionId: "session-weather-systems-1",
  learnerId: "maya",
  interventionType: "reteach"
});
assert.equal(targetedIntervention.result.accepted, true, "teacher should create a targeted intervention without manually writing the summary");
assert.match(targetedIntervention.result.intervention.summary, /Targeted reteach/i, "teacher intervention should prefill from adaptive reteach");
assert.equal(targetedIntervention.result.intervention.adaptiveReteach.diagnosisLabel, "visual model", "teacher intervention should preserve adaptive reteach metadata");
const workedOutcome = recordTeacherIntervention(targetedIntervention.state, {
  interventionId: targetedIntervention.result.intervention.id,
  outcome: "worked",
  outcomeNote: "Maya labeled the arrows and fixed the forecast explanation."
});
assert.equal(workedOutcome.result.accepted, true, "teacher should record when targeted support worked");
assert.equal(workedOutcome.result.intervention.outcome, "worked", "worked outcome should persist on the intervention");
assert.equal(workedOutcome.result.improvementSignalId, "", "worked intervention outcomes should not create redesign signals");
assert.ok(
  workedOutcome.state.learningEvents.some(
    (event) => event.type === "teacher_intervention_outcome" && event.value?.outcome === "worked" && event.value?.improvementSignalId === ""
  ),
  "worked intervention outcome should log learning evidence without a redesign signal"
);
const redesignIntervention = recordTeacherIntervention(classroomFailedQuiz, {
  classSessionId: "session-weather-systems-1",
  learnerId: "maya",
  interventionType: "reteach"
});
const redesignOutcome = recordTeacherIntervention(redesignIntervention.state, {
  interventionId: redesignIntervention.result.intervention.id,
  outcome: "needs-redesign",
  outcomeNote: "Maya still cannot connect the arrows to the forecast after targeted support."
});
assert.equal(redesignOutcome.result.accepted, true, "teacher should record when targeted support needs redesign");
assert.equal(redesignOutcome.result.intervention.outcome, "needs-redesign", "needs-redesign outcome should persist on the intervention");
assert.ok(redesignOutcome.result.improvementSignalId, "needs-redesign outcome should create a lesson improvement signal");
const redesignQueue = getTutorImprovementQueue(redesignOutcome.state);
assert.ok(
  redesignQueue.signals.some(
    (signal) =>
      signal.id === redesignOutcome.result.improvementSignalId &&
      signal.sourceIds.includes("teacher-intervention-outcome") &&
      signal.status === "needs-redesign"
  ),
  "teacher failed-support outcome should feed the lesson/tutor improvement queue"
);
const redesignReviewQueue = getAgentReviewQueue(redesignOutcome.state);
assert.equal(redesignReviewQueue.redesignReview, 1, "teacher redesign signals should enter the manager review queue");
assert.ok(
  redesignReviewQueue.items.some(
    (item) =>
      item.id === `redesign:${redesignOutcome.result.improvementSignalId}` &&
      item.type === "redesign" &&
      item.actions.includes("approve") &&
      item.actions.includes("request_revision")
  ),
  "manager review queue should expose approve/request-revision actions for redesign signals"
);
const redesignDossier = getManagerReviewDossier(redesignOutcome.state, `redesign:${redesignOutcome.result.improvementSignalId}`);
assert.equal(redesignDossier.found, true, "manager review dossier should resolve lesson redesign signals");
assert.equal(redesignDossier.artifactType, "redesign", "manager review dossier should identify redesign artifact type");
assert.ok(redesignDossier.revisionInstructions.some((instruction) => /diagram|model/i.test(instruction)), "redesign dossier should show the proposed targeted repair");
const revisionRequestedRedesign = resolveAgentReviewItem(redesignOutcome.state, `redesign:${redesignOutcome.result.improvementSignalId}`, "request_revision");
assert.equal(revisionRequestedRedesign.result.accepted, true, "manager should request revision on a redesign signal");
assert.equal(
  revisionRequestedRedesign.state.lessonImprovementSignals.find((signal) => signal.id === redesignOutcome.result.improvementSignalId).reviewStatus,
  "revision-requested",
  "redesign request-revision decision should persist review status"
);
const approvedRedesign = resolveAgentReviewItem(redesignOutcome.state, `redesign:${redesignOutcome.result.improvementSignalId}`, "approve");
assert.equal(approvedRedesign.result.accepted, true, "manager should approve a redesign signal");
assert.ok(approvedRedesign.result.appliedDraftId, "approved redesign signal should create a content draft");
assert.equal(
  approvedRedesign.state.lessonImprovementSignals.find((signal) => signal.id === redesignOutcome.result.improvementSignalId).status,
  "assigned",
  "approved redesign signal should become assigned work"
);
assert.equal(getAgentReviewQueue(approvedRedesign.state).redesignReview, 0, "approved redesign signals should leave the pending manager queue");
const redesignDraft = approvedRedesign.state.contentDrafts.find((draft) => draft.id === approvedRedesign.result.appliedDraftId);
assert.ok(redesignDraft, "approved redesign draft should be saved in content drafts");
assert.equal(redesignDraft.status, "review", "approved redesign draft should enter content review");
assert.equal(redesignDraft.sourceLessonId, classroomLesson.id, "approved redesign draft should link back to the source lesson");
assert.deepEqual(redesignDraft.redesignTaskIds, [redesignOutcome.result.improvementSignalId], "approved redesign draft should link to the redesign task");
assert.ok(redesignDraft.reviewNotes.includes("Manager-approved redesign signal"), "approved redesign draft should preserve review rationale");
assert.ok(redesignDraft.visualSupports.some((support) => support.placement === "misconception-repair"), "approved redesign draft should include a misconception repair visual plan");
assert.ok(getAgentReviewQueue(approvedRedesign.state).items.some((item) => item.id === `content:${redesignDraft.id}`), "approved redesign draft should enter manager content review");
const publishedRedesignDraft = resolveAgentReviewItem(approvedRedesign.state, `content:${redesignDraft.id}`, "approve");
assert.equal(publishedRedesignDraft.result.accepted, true, "manager should publish the approved redesign draft through content review");
const implementedSignal = publishedRedesignDraft.state.lessonImprovementSignals.find((signal) => signal.id === redesignOutcome.result.improvementSignalId);
assert.equal(implementedSignal.status, "implemented", "publishing a redesign draft should mark the linked redesign signal implemented");
assert.equal(implementedSignal.reviewStatus, "implemented", "implemented redesign signal should leave review status as implemented");
assert.equal(implementedSignal.implementedDraftId, redesignDraft.id, "implemented redesign signal should store the implementing draft id");
assert.ok(implementedSignal.implementedLessonId, "implemented redesign signal should store the published lesson id");
assert.ok(
  publishedRedesignDraft.state.publishedLessons.some((lessonRow) => lessonRow.id === implementedSignal.implementedLessonId && lessonRow.sourceDraftId === redesignDraft.id),
  "published redesign lesson should link back to the implementing draft"
);
const implementedRedesignProjection = getPlatformSeedProjection(publishedRedesignDraft.state);
const implementedRedesignRow = implementedRedesignProjection.tables.lesson_redesign_tasks.find((row) => row.id === redesignOutcome.result.improvementSignalId);
assert.equal(implementedRedesignRow.status, "implemented", "implemented redesign row should persist implemented status");
assert.equal(implementedRedesignRow.review_status, "implemented", "implemented redesign row should persist review status");
assert.equal(implementedRedesignRow.implemented_draft_id, redesignDraft.id, "implemented redesign row should persist draft id");
assert.equal(implementedRedesignRow.implemented_lesson_id, implementedSignal.implementedLessonId, "implemented redesign row should persist lesson id");
assert.ok(implementedRedesignRow.implemented_at, "implemented redesign row should persist implementation timestamp");
assert.ok(implementedRedesignRow.review_history.length >= 1, "implemented redesign row should persist review history");
assert.equal(
  getAgentReviewQueue(publishedRedesignDraft.state).items.some((item) => item.id === `redesign:${redesignOutcome.result.improvementSignalId}`),
  false,
  "implemented redesign signals should not remain in the live manager review queue"
);
assert.equal(
  implementedRedesignProjection.tables.agent_review_items.some((row) => row.source_type === "redesign" && row.source_id === redesignOutcome.result.improvementSignalId),
  false,
  "implemented redesign signals should not project as pending normalized review rows"
);
assert.ok(
  redesignOutcome.state.learningEvents.some(
    (event) =>
      event.type === "teacher_intervention_outcome" &&
      event.value?.outcome === "needs-redesign" &&
      event.value?.improvementSignalId === redesignOutcome.result.improvementSignalId
  ),
  "needs-redesign intervention outcome should log the improvement signal id"
);
const redesignProjection = getPlatformSeedProjection(redesignOutcome.state);
assert.ok(
  redesignProjection.tables.teacher_interventions.some((row) => row.id === redesignOutcome.result.intervention.id && /Outcome: needs-redesign/i.test(row.summary)),
  "intervention outcome should project into normalized teacher intervention summaries"
);
assert.ok(
  redesignProjection.tables.lesson_redesign_tasks.some((row) => row.id === redesignOutcome.result.improvementSignalId),
  "teacher outcome redesign signal should project into lesson redesign tasks"
);
assert.ok(
  redesignProjection.tables.agent_review_items.some((row) => row.source_type === "redesign" && row.source_id === redesignOutcome.result.improvementSignalId),
  "teacher outcome redesign signal should project into agent review items"
);
const recordedIntervention = recordTeacherIntervention(submittedClassArtifact.state, {
  classSessionId: "session-weather-systems-1",
  learnerId: "maya",
  interventionType: "reteach",
  summary: "Review pressure arrows with a diagram, then ask Maya to explain the first evidence link."
});
assert.equal(recordedIntervention.result.accepted, true, "teacher should record a learner intervention from the live monitor");
assert.equal(getTeacherClassMonitor(recordedIntervention.state).metrics.teacherSupport, 1, "teacher monitor should count open interventions");
const resolvedIntervention = recordTeacherIntervention(recordedIntervention.state, {
  interventionId: recordedIntervention.result.intervention.id,
  status: "resolved"
});
assert.equal(resolvedIntervention.result.accepted, true, "teacher should resolve an intervention");
assert.equal(getClassroomProductSummary(resolvedIntervention.state).openInterventions, 0, "resolved interventions should not count as open");
const createdSchoolClass = createSchoolClass(state, {
  id: "class-bridge-math-6b",
  name: "Bridge Math Studio 6B",
  grade: "6",
  subject: "math",
  teacherId: "teacher-demo-1",
  schedule: "Period 3 | Tue-Fri | 50 min"
});
assert.equal(createdSchoolClass.result.accepted, true, "school admin should be able to create a class section");
assert.equal(createdSchoolClass.result.classSection.status, "setup", "new class sections should start in setup status");
const enrolledSchoolLearner = enrollLearnerInSchoolClass(createdSchoolClass.state, {
  classSectionId: "class-bridge-math-6b",
  learnerId: "maya"
});
assert.equal(enrolledSchoolLearner.result.accepted, true, "school admin should be able to enroll a learner in a class");
assert.deepEqual(enrolledSchoolLearner.result.classSection.studentIds, ["maya"], "enrollment should update the class roster");
const schoolSetupProjection = getPlatformSeedProjection(enrolledSchoolLearner.state);
assert.ok(
  schoolSetupProjection.tables.classes.some((item) => item.id === "class-bridge-math-6b"),
  "created class sections should project into classes"
);
assert.ok(
  schoolSetupProjection.tables.enrollments.some((item) => item.class_id === "class-bridge-math-6b" && item.student_id === "maya"),
  "class enrollment should project into enrollments"
);
const parsedRoster = parseRosterCsv(
  "display_name,grade,class_id,student_id,username,email,accommodations\n\"Sam Lee\",6,class-bridge-math-6b,sam-lee,samlee,sam@example.edu,Planner prompts\nAlex Kim,6,class-bridge-math-6b,alex-kim,alexkim,alex@example.edu,"
);
assert.equal(parsedRoster.accepted, true, "valid roster CSV should parse");
assert.equal(parsedRoster.rows.length, 2, "roster parser should return each non-empty row");
const importedRoster = importSchoolRoster(state, {
  csv: "display_name,grade,class_id,student_id,username,email\nSam Lee,6,class-bridge-science-6a,sam-lee,samlee,sam@example.edu\nAlex Kim,6,class-bridge-science-6a,alex-kim,alexkim,alex@example.edu",
  schoolId: "school-demo-1",
  invitedByUserId: "user-platform-admin"
});
assert.equal(importedRoster.result.accepted, true, "school admin should import a valid roster CSV");
assert.equal(importedRoster.result.imported, 2, "roster import should count rows");
assert.equal(importedRoster.result.createdLearners, 2, "roster import should create minimal learner profiles");
assert.equal(importedRoster.result.enrolled, 2, "roster import should enroll each imported learner");
assert.equal(importedRoster.result.invitations, 2, "new roster learners should receive pending invitations");
const importedProjection = getPlatformSeedProjection(importedRoster.state);
assert.ok(importedProjection.tables.students.some((item) => item.id === "sam-lee"), "imported learner should project into students");
assert.ok(
  importedProjection.tables.enrollments.some((item) => item.class_id === "class-bridge-science-6a" && item.student_id === "sam-lee"),
  "imported learner should project into enrollments"
);
assert.ok(
  importedProjection.tables.account_invitations.some((item) => item.target_student_id === "sam-lee" && item.status === "pending"),
  "imported learner should project into pending account invitations"
);
const exportedRoster = getSchoolRosterCsv(importedRoster.state, "school-demo-1");
assert.match(exportedRoster, /student_id,display_name,grade,class_id/, "school roster export should include stable headers");
assert.match(exportedRoster, /Sam Lee/, "school roster export should include imported learners");
const invalidRoster = importSchoolRoster(state, {
  csv: "display_name,grade,class_id\nMissing Class,6,does-not-exist",
  schoolId: "school-demo-1"
});
assert.equal(invalidRoster.result.accepted, false, "roster import should reject unknown class ids");
assert.equal(invalidRoster.state.learners.length, state.learners.length, "invalid roster import should not mutate learners");
const normalizedLegacyTutorState = normalizeAppState({
  aiLogs: [
    {
      id: "legacy-ai-log",
      learnerId: "avery",
      lessonTitle: "Fractions on a Number Line",
      input: "I need a picture for the equal spaces.",
      response: "Use the number line model and count equal spaces, then retry by explaining why the point is fair."
    }
  ]
});
assert.equal(
  normalizedLegacyTutorState.aiLogs[0].lessonId,
  "g3-fractions-number-line",
  "state normalization should backfill lesson ids on legacy tutor logs"
);
assert.equal(typeof normalizedLegacyTutorState.aiLogs[0].truthScore, "number", "state normalization should backfill tutor truth-policy scores");
const platformSchema = getPlatformSchema();
const platformSummary = getPlatformSchemaSummary();
const platformValidation = getPlatformSchemaValidation();
const platformProjection = getPlatformSeedProjection(state);
const platformReadiness = getPlatformDataModelReadiness(state);
const platformTableIds = platformSchema.tables.map((table) => table.id);
for (const tableId of [
  "users",
  "students",
  "guardians",
  "teachers",
  "schools",
  "account_invitations",
  "guardian_student_links",
  "session_revocations",
  "teacher_class_assignments",
  "classes",
  "class_sessions",
  "group_missions",
  "group_artifacts",
  "teacher_interventions",
  "school_reports",
  "enrollments",
  "grade_bands",
  "grade_levels",
  "subjects",
  "courses",
  "units",
  "lessons",
  "activities",
  "quizzes",
  "quiz_questions",
  "quiz_attempts",
  "lesson_progress",
  "mastery_records",
  "interactive_skill_evidence",
  "standards",
  "lesson_standards",
  "assignments",
  "portfolio_items",
  "badges",
  "student_badges",
  "reward_approvals",
  "agent_tool_calls",
  "agent_review_items",
  "audit_events",
  "auth_audit_events",
  "consent_records",
  "app_state_snapshots"
]) {
  assert.ok(platformTableIds.includes(tableId), `production schema should include ${tableId}`);
}
assert.equal(platformValidation.passed, true, "production schema should pass structural validation");
const usersTable = platformSchema.tables.find((table) => table.id === "users");
assert.ok(usersTable.columns.includes("email_verified"), "users should track provider email verification");
assert.ok(usersTable.columns.includes("auth_provider"), "users should track production identity provider");
assert.ok(usersTable.columns.includes("provider_subject"), "users should track provider subject ids");
const aiTutorEventTable = platformSchema.tables.find((table) => table.id === "ai_tutor_events");
assert.ok(aiTutorEventTable.columns.includes("mode_id"), "AI tutor events should store explanation mode");
assert.ok(aiTutorEventTable.columns.includes("student_feedback"), "AI tutor events should store student feedback");
assert.ok(aiTutorEventTable.columns.includes("quality_score"), "AI tutor events should store quality score");
assert.ok(aiTutorEventTable.columns.includes("truth_score"), "AI tutor events should store truth-policy score");
assert.ok(aiTutorEventTable.columns.includes("truth_issues"), "AI tutor events should store truth-policy issue details");
assert.ok(aiTutorEventTable.columns.includes("needs_external_research"), "AI tutor events should store research escalation flags");
const contentDraftTable = platformSchema.tables.find((table) => table.id === "content_drafts");
assert.ok(contentDraftTable.columns.includes("accessibility_notes"), "content drafts should store accessibility notes");
assert.ok(contentDraftTable.columns.includes("age_fit_notes"), "content drafts should store age-fit notes");
assert.ok(contentDraftTable.columns.includes("lesson_sections"), "content drafts should store full teaching sections");
assert.ok(contentDraftTable.columns.includes("helper_notes"), "content drafts should store helper notes");
assert.ok(contentDraftTable.columns.includes("common_misunderstandings"), "content drafts should store misconception repair");
assert.ok(contentDraftTable.columns.includes("visual_supports"), "content drafts should store visual supports");
assert.ok(contentDraftTable.columns.includes("quiz_questions"), "content drafts should store quiz checkpoints");
assert.ok(contentDraftTable.columns.includes("source_cards"), "content drafts should store source cards");
assert.ok(contentDraftTable.columns.includes("lesson_body_ready"), "content drafts should store lesson-body readiness");
assert.ok(contentDraftTable.columns.includes("truth_score"), "content drafts should store truth-policy score");
assert.ok(contentDraftTable.columns.includes("truth_review_status"), "content drafts should store truth-review status");
const agentToolCallTable = platformSchema.tables.find((table) => table.id === "agent_tool_calls");
assert.ok(agentToolCallTable.columns.includes("payload"), "agent tool calls should preserve structured payloads");
assert.ok(platformTableIds.includes("research_evidence_sources"), "production schema should include research evidence source ledger");
assert.ok(platformTableIds.includes("lesson_redesign_tasks"), "production schema should include lesson redesign tasks");
const redesignTaskTable = platformSchema.tables.find((table) => table.id === "lesson_redesign_tasks");
for (const column of ["review_status", "implemented_draft_id", "implemented_lesson_id", "implemented_at", "review_history"]) {
  assert.ok(redesignTaskTable.columns.includes(column), `lesson redesign tasks should store ${column}`);
}
assert.equal(platformReadiness.passed, true, "production data model should be ready for prototype projection");
assert.ok(platformSummary.relationshipCount >= 30, "production schema should define relational boundaries");
assert.ok(platformSummary.rlsTableCount >= 20, "production schema should mark protected role-scoped tables");
assert.equal(getPlatformRoleAccessMatrix().length, 5, "role matrix should cover the five required user roles");
assert.equal(platformProjection.tables.students.length, state.learners.length, "seed projection should create one student row per learner");
assert.equal(platformProjection.tables.grade_bands.length, 3, "seed projection should include all academies as grade bands");
assert.equal(platformProjection.tables.schools.length, 1, "seed projection should include a school profile");
assert.equal(platformProjection.tables.class_sessions.length, 1, "seed projection should include a class session");
assert.equal(platformProjection.tables.group_missions.length, 1, "seed projection should include a group mission");
assert.equal(platformProjection.tables.group_artifacts.length, 1, "seed projection should include individual group accountability evidence");
assert.equal(platformProjection.tables.teacher_interventions.length, 1, "seed projection should include teacher intervention records");
assert.equal(platformProjection.tables.school_reports.length, 1, "seed projection should include school report snapshots");
const classroomEvidenceProjection = getPlatformSeedProjection(recordedIntervention.state);
assert.equal(
  classroomEvidenceProjection.tables.group_artifacts[0].artifact_status,
  "submitted",
  "submitted classroom evidence should project into group_artifacts"
);
assert.equal(
  classroomEvidenceProjection.tables.teacher_interventions[0].intervention_type,
  "reteach",
  "recorded teacher support should project into teacher_interventions"
);
assert.equal(
  classroomEvidenceProjection.tables.school_reports[0].metrics.submittedArtifacts,
  1,
  "school report projection should count submitted artifacts"
);
assert.ok(platformProjection.tables.courses.length >= totals.courseCount, "seed projection should include the K-12 course map");
assert.ok(platformProjection.tables.units.length >= totals.plannedUnitCount, "seed projection should include planned units");
assert.equal(platformProjection.tables.lessons.length, pilotLessons.length, "seed projection should include pilot lessons");
assert.ok(platformProjection.tables.quiz_attempts.length >= Object.keys(state.mastery).length, "seed projection should preserve mastery as quiz attempt evidence");
assert.ok(platformProjection.tables.agent_review_items.length >= 1, "seed projection should include review queue rows");
assert.equal(platformProjection.summary.requiredTablesWithRows, platformProjection.summary.requiredTableCount, "all required tables should project rows");

const platformMigration = getPlatformMigration();
const migrationReadiness = getPlatformMigrationReadiness();
const repositoryAccess = getPlatformRepositoryAccessSummary();
assert.equal(migrationReadiness.passed, true, "database migration readiness should pass");
assert.match(platformMigration.sql, /create table if not exists public\."users"/, "migration should create users table");
assert.match(platformMigration.sql, /"email_verified" boolean/, "migration should store provider email verification");
assert.match(platformMigration.sql, /create table if not exists public\."account_invitations"/, "migration should create account invitations table");
assert.match(platformMigration.sql, /create table if not exists public\."guardian_student_links"/, "migration should create guardian-student lifecycle table");
assert.match(platformMigration.sql, /create table if not exists public\."session_revocations"/, "migration should create session revocations table");
assert.match(platformMigration.sql, /create table if not exists public\."teacher_class_assignments"/, "migration should create teacher assignment lifecycle table");
assert.match(platformMigration.sql, /create table if not exists public\."auth_audit_events"/, "migration should create auth audit table");
assert.match(platformMigration.sql, /alter table public\."students" add constraint "fk_students_user_id"/, "migration should add foreign keys after table creation");
assert.match(platformMigration.sql, /create table if not exists public\."quiz_attempts"/, "migration should create quiz attempts table");
assert.match(platformMigration.sql, /create table if not exists public\."lesson_scratchpads"/, "migration should create lesson scratchpads table");
assert.match(platformMigration.sql, /create table if not exists public\."interactive_skill_evidence"/, "migration should create interactive skill evidence table");
assert.match(platformMigration.sql, /"correct" boolean/, "migration should store interactive skill correctness as boolean");
assert.match(platformMigration.sql, /"mode_id" text/, "migration should store AI tutor explanation mode");
assert.match(platformMigration.sql, /"quality_score" integer/, "migration should store tutor quality score");
assert.match(platformMigration.sql, /"truth_score" integer/, "migration should store tutor truth-policy score");
assert.match(platformMigration.sql, /"truth_issues" jsonb/, "migration should store tutor truth-policy issues as JSON");
assert.match(platformMigration.sql, /"needs_external_research" boolean/, "migration should store tutor research escalation flags");
assert.match(platformMigration.sql, /"accessibility_notes" text/, "migration should store content accessibility notes");
assert.match(platformMigration.sql, /"age_fit_notes" text/, "migration should store content age-fit notes");
assert.match(platformMigration.sql, /create table if not exists public\."research_evidence_sources"/, "migration should create research evidence source ledger");
assert.match(platformMigration.sql, /create table if not exists public\."lesson_redesign_tasks"/, "migration should create lesson redesign tasks");
assert.match(platformMigration.sql, /"implemented_lesson_id" text/, "migration should store implemented redesign lesson ids");
assert.match(platformMigration.sql, /"review_history" jsonb/, "migration should store redesign review history");
assert.match(platformMigration.sql, /create table if not exists public\."app_state_snapshots"/, "migration should create repository transition table");
assert.match(platformMigration.sql, /alter table public\."students" enable row level security/, "migration should enable student RLS");
assert.match(platformMigration.sql, /create policy "students_parent_household"/, "migration should include household parent policy");
assert.match(platformMigration.sql, /create or replace function public\.k12_auth_jwt\(\)/, "migration should include Supabase JWT-aware RLS helper");
assert.match(platformMigration.sql, /auth\.jwt\(\)/, "migration should read trusted Supabase JWT claims when available");
assert.match(platformMigration.sql, /app_metadata/, "migration should read authorization claims from app metadata");
assert.match(platformMigration.sql, /k12_current_app_role\(\)/, "RLS policies should use normalized app-role claims");
assert.match(platformMigration.sql, /for select to authenticated using/, "RLS select policies should specify the authenticated Postgres role");
assert.match(platformMigration.sql, /for all to authenticated using/, "RLS write-capable policies should specify the authenticated Postgres role");
assert.doesNotMatch(platformMigration.sql, /user_metadata/, "migration must not use user-editable metadata for authorization");
assert.doesNotMatch(platformMigration.sql, /current_setting\('app\.role'/, "role policies should not be app-local-only");
assert.ok(platformMigration.rlsPolicyCount >= platformSummary.rlsTableCount, "migration should include at least one RLS policy per protected table");
assert.ok(platformMigration.indexCount >= platformSummary.relationshipCount, "migration should index relational scope columns");
assert.equal(repositoryAccess.blockedStudentExternalOps, true, "repository access should block student external tool writes");
assert.equal(
  canAccessRepositoryAction({ role: "student", tableId: "quiz_attempts", operation: "write", scope: "own" }).allowed,
  true,
  "students should be allowed to write own quiz attempts"
);
assert.equal(
  canAccessRepositoryAction({ role: "student", tableId: "mastery_records", operation: "write", scope: "own" }).allowed,
  true,
  "students should be allowed to write own mastery evidence"
);
assert.equal(
  canAccessRepositoryAction({ role: "student", tableId: "interactive_skill_evidence", operation: "write", scope: "own" }).allowed,
  true,
  "students should be allowed to write own interactive skill evidence"
);
assert.equal(
  canAccessRepositoryAction({ role: "student", tableId: "lesson_scratchpads", operation: "write", scope: "own" }).allowed,
  true,
  "students should be allowed to write own lesson scratchpads"
);
assert.equal(
  canAccessRepositoryAction({ role: "parent", tableId: "lesson_progress", operation: "write", scope: "own-household" }).allowed,
  true,
  "parents should be allowed to write household learning progress"
);
assert.equal(
  canAccessRepositoryAction({ role: "student", tableId: "reward_approvals", operation: "write", scope: "own" }).allowed,
  true,
  "students should be allowed to request their own reward approvals"
);
assert.equal(
  canAccessRepositoryAction({ role: "student", tableId: "group_artifacts", operation: "write", scope: "own" }).allowed,
  true,
  "students should be allowed to submit their own group mission evidence"
);
assert.equal(
  canAccessRepositoryAction({ role: "parent", tableId: "reward_approvals", operation: "write", scope: "own-household" }).allowed,
  true,
  "parents should be allowed to approve household reward requests"
);
assert.equal(
  canAccessRepositoryAction({ role: "student", tableId: "agent_tool_calls", operation: "write", scope: "own" }).allowed,
  false,
  "students should not write tool call records"
);
assert.equal(
  canAccessRepositoryAction({ role: "student", tableId: "ai_tutor_events", operation: "write", scope: "own" }).allowed,
  true,
  "students should be allowed to write own AI tutor events through the tutor API"
);
assert.equal(
  canAccessRepositoryAction({ role: "parent", tableId: "ai_tutor_events", operation: "write", scope: "own-household" }).allowed,
  false,
  "parents should not impersonate student AI tutor event writes"
);
assert.equal(
  canAccessRepositoryAction({ role: "parent", tableId: "consent_records", operation: "write", scope: "own-household" }).allowed,
  true,
  "parents should manage household consent records"
);
assert.equal(
  canAccessRepositoryAction({ role: "parent", tableId: "guardian_student_links", operation: "write", scope: "own-household" }).allowed,
  true,
  "parents should request household child links"
);
assert.equal(
  canAccessRepositoryAction({ role: "student", tableId: "account_invitations", operation: "write", scope: "own" }).allowed,
  false,
  "students should not write account invitations"
);
assert.equal(
  canAccessRepositoryAction({ role: "teacher", tableId: "mastery_records", operation: "write", scope: "assigned" }).allowed,
  true,
  "teachers should write assigned mastery records"
);
assert.equal(
  canAccessRepositoryAction({ role: "school-admin", tableId: "teacher_class_assignments", operation: "write", scope: "school" }).allowed,
  true,
  "school admins should manage teacher-class assignments"
);
assert.equal(
  canAccessRepositoryAction({ role: "school-admin", tableId: "class_sessions", operation: "write", scope: "school" }).allowed,
  true,
  "school admins should manage class sessions"
);
assert.equal(
  canAccessRepositoryAction({ role: "teacher", tableId: "teacher_interventions", operation: "write", scope: "assigned" }).allowed,
  true,
  "teachers should write assigned intervention notes"
);

const secret = "test-session-secret";
const token = createSessionToken({ role: "teacher", scope: "assigned", userId: "user-teacher-1", teacherId: "teacher-1" }, secret);
const verifiedClaims = verifySessionToken(token, secret);
assert.equal(verifiedClaims.role, "teacher", "signed auth token should preserve role claims");
assert.equal(verifiedClaims.scope, "assigned", "signed auth token should preserve scope claims");
assert.ok(verifiedClaims.expiresAt, "signed auth token should include an expiry time");
assert.equal(verifySessionToken(token, "wrong-secret"), null, "auth token should reject the wrong secret");
const expiredToken = createSessionToken(
  {
    role: "student",
    scope: "own",
    userId: "user-expired-student",
    studentId: "expired-student",
    issuedAt: "2026-01-01T00:00:00.000Z",
    expiresAt: "2026-01-01T00:05:00.000Z"
  },
  secret
);
assert.equal(
  verifySessionToken(expiredToken, secret, { now: new Date("2026-01-01T00:06:00.000Z") }),
  null,
  "expired auth tokens should be rejected"
);
assert.equal(publicSessionSummary(verifiedClaims).expiresAt, verifiedClaims.expiresAt, "public session summary should expose token expiry");
assert.equal(isViewAllowedForSession("admin", { authenticated: true, role: "student" }), false, "student UI should not expose admin views");
assert.equal(isViewAllowedForSession("lesson", { authenticated: true, role: "student" }), true, "student UI should allow lesson views");
assert.deepEqual(getVisibleRoleViews({ authenticated: true, role: "student" }), ["student"], "student UI should only show the child role page");
assert.deepEqual(getVisibleRoleViews({ authenticated: true, role: "parent" }), ["parent"], "parent UI should only show the parent role page");
assert.deepEqual(getVisibleRoleViews({ authenticated: true, role: "teacher" }), ["teacher"], "teacher UI should only show the teacher role page");
assert.deepEqual(getVisibleRoleViews({ authenticated: true, role: "school-admin" }), ["student", "parent", "teacher", "school"], "school admins should see student, parent, teacher, and school role pages");
assert.equal(getAuthorizedView("tools", { authenticated: true, role: "school-admin" }), "tools", "school admins should allow managed tool view");
assert.equal(getAuthorizedView("tools", { authenticated: true, role: "student" }), "student", "blocked student view should redirect to child page");
assert.equal(getAuthorizedView("teacher", { authenticated: true, role: "school-admin" }), "teacher", "school admins should access teacher operations");
assert.equal(getAuthorizedView("setup", { authenticated: true, role: "school-admin" }), "setup", "school admins should access school setup flows");
assert.equal(getAuthorizedView("tools", { authenticated: true, role: "teacher" }), "tools", "teacher UI should allow managed tool view");
assert.equal(getAccessSummary({ authenticated: true, role: "platform-admin" }).roleViews.length, 4, "platform admin should see all role pages for QA");
const productionAuthEnv = {
  NODE_ENV: "production",
  AUTH_PROVIDER: "oidc",
  AUTH_ISSUER: "https://auth.example.test/",
  AUTH_AUDIENCE: "k12-learning-app",
  AUTH_JWKS_URL: "https://auth.example.test/.well-known/jwks.json"
};
const productionAuthReadiness = getProductionAuthReadiness(productionAuthEnv);
assert.equal(productionAuthReadiness.passed, true, "production auth readiness should pass with provider config");
const supabaseAuthEnv = {
  NODE_ENV: "production",
  SUPABASE_URL: "https://hqsydwjcpcammmfftyqi.supabase.co",
  SUPABASE_JWKS_URL: "https://hqsydwjcpcammmfftyqi.supabase.co/auth/v1/.well-known/jwks.json"
};
const nextPublicSupabaseAuthEnv = {
  NODE_ENV: "production",
  NEXT_PUBLIC_SUPABASE_URL: "https://hqsydwjcpcammmfftyqi.supabase.co",
  SUPABASE_JWKS_URL: "https://hqsydwjcpcammmfftyqi.supabase.co/auth/v1/.well-known/jwks.json"
};
const supabaseAuthConfig = getProductionAuthConfig(supabaseAuthEnv);
assert.equal(supabaseAuthConfig.provider, "supabase", "Supabase URL should configure the Supabase auth provider");
assert.equal(supabaseAuthConfig.issuer, "https://hqsydwjcpcammmfftyqi.supabase.co/auth/v1", "Supabase issuer should default from project URL");
assert.equal(supabaseAuthConfig.audience, "authenticated", "Supabase audience should default to authenticated");
assert.equal(supabaseAuthConfig.jwksUrl, supabaseAuthEnv.SUPABASE_JWKS_URL, "Supabase JWKS URL should be accepted from environment");
assert.equal(isProductionAuthProviderConfigured(supabaseAuthEnv), true, "Supabase environment should count as production auth");
assert.equal(getProductionAuthConfig(nextPublicSupabaseAuthEnv).provider, "supabase", "NEXT_PUBLIC Supabase URL should configure production auth");
assert.equal(isProductionAuthProviderConfigured(nextPublicSupabaseAuthEnv), true, "NEXT_PUBLIC Supabase environment should count as production auth");
assert.equal(getProductionAuthReadiness(supabaseAuthEnv).passed, true, "Supabase auth readiness should pass with project URL and JWKS");
const nowSeconds = Math.floor(Date.now() / 1000);
const productionClaimsResult = createProductionSessionFromVerifiedClaims(
  {
    iss: "https://auth.example.test/",
    aud: "k12-learning-app",
    sub: "provider-teacher-1",
    email: "verified.teacher@example.test",
    email_verified: true,
    sid: "provider-session-1",
    iat: nowSeconds,
    exp: nowSeconds + 3600,
    app_metadata: {
      role: "teacher",
      scope: "assigned",
      userId: "user-provider-teacher-1",
      teacherId: "teacher-provider-1",
      schoolId: "school-demo-1"
    }
  },
  productionAuthEnv
);
assert.equal(productionClaimsResult.accepted, true, "verified provider claims should create a production session");
assert.equal(productionClaimsResult.session.productionAuth, true, "provider session should be marked as production auth");
assert.equal(productionClaimsResult.session.emailVerified, true, "provider session should preserve email verification");
assert.equal(productionClaimsResult.session.teacherId, "teacher-provider-1", "provider session should map teacher id");
assert.equal(
  createProductionSessionFromVerifiedClaims({ ...productionClaimsResult.session, email_verified: false }, productionAuthEnv).accepted,
  false,
  "production auth should reject unverified email by default"
);
const localTokenInProduction = getRequestSession(
  { headers: { authorization: `Bearer ${token}` } },
  { ...productionAuthEnv, AUTH_SESSION_SECRET: secret }
);
assert.equal(localTokenInProduction.authenticated, false, "production provider mode should not accept local prototype tokens by default");
const localTokenWithSupabaseProduction = getRequestSession(
  { headers: { authorization: `Bearer ${token}` } },
  { ...supabaseAuthEnv, AUTH_SESSION_SECRET: secret }
);
assert.equal(localTokenWithSupabaseProduction.authenticated, false, "Supabase production mode should not accept local prototype tokens by default");
const trustedClaimsHeader = Buffer.from(
  JSON.stringify({
    iss: "https://auth.example.test/",
    aud: "k12-learning-app",
    sub: "provider-parent-1",
    email: "verified.parent@example.test",
    email_verified: true,
    sid: "provider-session-parent-1",
    app_metadata: {
      role: "parent",
      scope: "own-household",
      userId: "user-provider-parent-1",
      guardianId: "guardian-provider-parent-1",
      studentId: "avery"
    }
  })
).toString("base64url");
const trustedProxySession = getRequestSession(
  {
    headers: {
      "x-k12-auth-proxy-secret": "proxy-secret",
      "x-k12-verified-claims": trustedClaimsHeader
    }
  },
  { ...productionAuthEnv, AUTH_TRUSTED_PROXY: "true", AUTH_PROXY_SHARED_SECRET: "proxy-secret" }
);
assert.equal(trustedProxySession.authenticated, true, "trusted verified claims should authenticate through proxy boundary");
assert.equal(trustedProxySession.productionAuth, true, "trusted verified claims should create a production session");
assert.equal(publicSessionSummary(trustedProxySession).emailVerified, true, "public session summary should expose email verification state");
const rejectedProxySession = getRequestSession(
  {
    headers: {
      "x-k12-auth-proxy-secret": "wrong-secret",
      "x-k12-verified-claims": trustedClaimsHeader
    }
  },
  { ...productionAuthEnv, AUTH_TRUSTED_PROXY: "true", AUTH_PROXY_SHARED_SECRET: "proxy-secret" }
);
assert.equal(rejectedProxySession.authenticated, false, "trusted proxy session should reject the wrong shared secret");
const passwordRecord = createPasswordRecord("parent-pass-123");
assert.equal(verifyPassword("parent-pass-123", passwordRecord), true, "local auth should verify the stored password hash");
assert.equal(verifyPassword("wrong-password", passwordRecord), false, "local auth should reject the wrong password");
const parentSignup = registerLocalAccount(state, {
  role: "parent",
  displayName: "Local Parent",
  email: "parent@example.test",
  ...passwordRecord
});
assert.equal(parentSignup.result.accepted, true, "parent account signup should create a local account");
assert.equal(parentSignup.result.sessionClaims.role, "parent", "parent signup should create parent session claims");
assert.equal(parentSignup.result.sessionClaims.emailVerified, false, "adult signup should start unverified until email confirmation");
assert.equal(parentSignup.result.account.status, "pending-email-verification", "adult signup should be pending until email verification");
assert.ok(parentSignup.result.sessionClaims.sessionId, "local auth session claims should include a session id for future revocation");
assert.equal(findLocalAccountByEmail(parentSignup.state, "PARENT@example.test").role, "parent", "local account lookup should normalize email");
assert.equal(getAuthSecuritySummary(parentSignup.state).pendingVerificationAccounts, 1, "auth summary should count pending adult verification");
const providerParentSignup = registerProviderAccount(state, {
  role: "parent",
  displayName: "Provider Parent",
  providerUser: { id: "supabase-parent-001", email: "provider-parent@example.test", emailVerified: true }
});
assert.equal(providerParentSignup.result.accepted, true, "provider signup should provision an application account");
assert.equal(providerParentSignup.result.account.authProvider, "supabase", "provider account should retain its auth provider");
assert.equal(providerParentSignup.result.account.userId, "supabase-parent-001", "provider account should use the provider subject as user id");
assert.ok(providerParentSignup.result.account.guardianId, "provider parent should receive a unique guardian id");
assert.equal(providerParentSignup.result.sessionClaims.emailVerified, true, "verified provider signup should produce verified claims");
const providerDuplicate = registerProviderAccount(providerParentSignup.state, {
  role: "parent",
  providerUser: { id: "supabase-parent-001", email: "provider-parent@example.test", emailVerified: true }
});
assert.equal(providerDuplicate.result.alreadyProvisioned, true, "provider signup should be idempotent for the same provider subject");
const parentVerificationToken = createActionTokenRecord("verify-test");
const parentVerificationRequest = createEmailVerificationRequest(parentSignup.state, {
  accountId: parentSignup.result.account.id,
  requestedByUserId: parentSignup.result.account.userId,
  ...parentVerificationToken
});
assert.equal(parentVerificationRequest.result.accepted, true, "email verification request should be created for the parent account");
const parentVerificationHash = hashActionToken(parentVerificationToken.token, parentVerificationToken.tokenSalt);
const parentVerified = verifyLocalAccountEmail(parentVerificationRequest.state, { tokenHash: parentVerificationHash });
assert.equal(parentVerified.result.accepted, true, "valid email verification token should verify the account");
assert.equal(findLocalAccountByEmail(parentVerified.state, "parent@example.test").emailVerified, true, "verified parent account should persist emailVerified");
assert.equal(parentVerified.state.parentProfile.emailVerified, true, "verified parent should update household email readiness");
assert.equal(createSessionClaimsForAccount(findLocalAccountByEmail(parentVerified.state, "parent@example.test")).emailVerified, true, "verified session claims should include email verification");
const revokedParentSession = revokeAccountSession(parentVerified.state, {
  userId: parentSignup.result.account.userId,
  sessionId: "session-test-1",
  reason: "test current-session revocation",
  actorUserId: parentSignup.result.account.userId
});
assert.equal(revokedParentSession.result.accepted, true, "session revocation should be accepted for a known user");
assert.equal(
  isSessionRevoked(revokedParentSession.state, {
    authenticated: true,
    userId: parentSignup.result.account.userId,
    sessionId: "session-test-1",
    issuedAt: new Date().toISOString()
  }),
  true,
  "revoked session ids should be rejected by the auth gate"
);
const teacherSignup = registerLocalAccount(revokedParentSession.state, {
  role: "teacher",
  displayName: "Local Teacher",
  email: "teacher@example.test",
  ...createPasswordRecord("teacher-pass-123")
});
assert.equal(teacherSignup.result.sessionClaims.role, "teacher", "teacher signup should create teacher session claims");
assert.ok(teacherSignup.result.sessionClaims.teacherId, "teacher signup should create a teacher id");
const teacherResetToken = createActionTokenRecord("reset-test");
const teacherResetRequest = createPasswordResetRequest(teacherSignup.state, {
  login: "teacher@example.test",
  requestedByUserId: teacherSignup.result.account.userId,
  ...teacherResetToken
});
assert.equal(teacherResetRequest.result.accepted, true, "password reset request should be accepted");
assert.equal(teacherResetRequest.result.accountFound, true, "password reset should locate the teacher account");
const teacherResetHash = hashActionToken(teacherResetToken.token, teacherResetToken.tokenSalt);
const teacherPasswordReset = resetLocalAccountPassword(teacherResetRequest.state, {
  tokenHash: teacherResetHash,
  ...createPasswordRecord("teacher-new-pass-456")
});
assert.equal(teacherPasswordReset.result.accepted, true, "password reset should update the password");
assert.equal(verifyPassword("teacher-new-pass-456", findLocalAccountByEmail(teacherPasswordReset.state, "teacher@example.test")), true, "new teacher password should verify");
assert.equal(verifyPassword("teacher-pass-123", findLocalAccountByEmail(teacherPasswordReset.state, "teacher@example.test")), false, "old teacher password should fail after reset");
assert.ok(
  teacherPasswordReset.state.sessionRevocations.some((revocation) => revocation.userId === teacherSignup.result.account.userId && !revocation.sessionId),
  "password reset should revoke existing sessions for the account"
);
const studentSignup = registerLocalAccount(teacherPasswordReset.state, {
  role: "student",
  displayName: "Local Student",
  email: "student@example.test",
  grade: "6",
  ...createPasswordRecord("student-pass-123")
});
assert.equal(studentSignup.result.sessionClaims.role, "student", "student signup should create student session claims");
assert.ok(studentSignup.state.learners.some((learner) => learner.id === studentSignup.result.sessionClaims.studentId), "student signup should create a learner record");
assert.equal(studentSignup.state.consentRecords[studentSignup.result.sessionClaims.studentId].aiHelper, false, "student-created learner should wait for parent AI consent");
assert.equal(createSessionClaimsForAccount(studentSignup.result.account).scope, "own", "student session claims should be scoped to own learner");
assert.equal(findLocalAccountByLogin(studentSignup.state, studentSignup.result.account.username).role, "student", "student username should work as a login lookup");
const unverifiedManagedChildSignup = createParentManagedChildAccount(studentSignup.state, {
  parentSession: { authenticated: true, role: "parent", guardianId: parentSignup.result.sessionClaims.guardianId, displayName: "Local Parent", emailVerified: false },
  displayName: "Blocked Child",
  username: "blocked-child",
  grade: "4",
  ...createPasswordRecord("blocked-pass-123")
});
assert.equal(unverifiedManagedChildSignup.result.accepted, false, "unverified parents should not create managed child accounts");
const managedChildSignup = createParentManagedChildAccount(studentSignup.state, {
  parentSession: { authenticated: true, role: "parent", guardianId: parentSignup.result.sessionClaims.guardianId, displayName: "Local Parent", emailVerified: true },
  displayName: "Managed Child",
  username: "managed-child",
  grade: "4",
  accommodations: "Read-aloud support",
  ...createPasswordRecord("managed-pass-123")
});
assert.equal(managedChildSignup.result.accepted, true, "parent should be able to create a managed child account");
assert.equal(managedChildSignup.result.childLogin.username, "managed-child", "managed child account should return a child username");
assert.equal(findLocalAccountByLogin(managedChildSignup.state, "managed-child").studentId, "learner-managed-child", "username login should locate managed child account");
assert.equal(managedChildSignup.state.consentRecords["learner-managed-child"].aiHelper, true, "parent-created child account should include parent AI consent");
assert.equal(
  canParentAccessLearner(
    managedChildSignup.state,
    { authenticated: true, role: "parent", guardianId: parentSignup.result.sessionClaims.guardianId },
    "learner-managed-child"
  ),
  true,
  "parents should access their linked child learner"
);
assert.equal(
  canParentAccessLearner(managedChildSignup.state, { authenticated: true, role: "parent", guardianId: "guardian-other" }, "learner-managed-child"),
  false,
  "parents should not access another household's learner"
);
const providerChildSignup = createParentManagedChildAccount(providerParentSignup.state, {
  parentSession: {
    authenticated: true,
    role: "parent",
    guardianId: providerParentSignup.result.sessionClaims.guardianId,
    displayName: "Provider Parent",
    emailVerified: true
  },
  displayName: "Provider Child",
  username: "provider-child",
  email: "provider-child@students.example.edu",
  authProvider: "supabase",
  providerSubject: "supabase-child-001",
  userId: "supabase-child-001",
  grade: "6",
  aiHelper: true,
  emailVerified: true
});
assert.equal(providerChildSignup.result.accepted, true, "provider parent should provision a managed child account record");
assert.equal(providerChildSignup.result.account.authProvider, "supabase", "managed provider child should retain provider identity");
assert.equal(providerChildSignup.result.account.userId, "supabase-child-001", "managed provider child should use provider user id");
assert.equal(providerChildSignup.state.localAccounts.find((account) => account.username === "provider-child").passwordHash, undefined, "provider child records must not store a local password hash");
assert.equal(providerChildSignup.state.consentRecords["learner-provider-child"].aiHelper, true, "provider child should persist parent AI consent");
const targetedProvisioning = createAccountProvisioningRows(providerChildSignup.state, providerChildSignup.result.account.id);
assert.deepEqual(
  targetedProvisioning.rowsByTable.users.map((row) => row.id),
  ["supabase-child-001"],
  "targeted account provisioning should write only the provider user row for this account"
);
assert.ok(targetedProvisioning.rowsByTable.students?.some((row) => row.id === "learner-provider-child"), "targeted provisioning should include the linked student row");
assert.ok(targetedProvisioning.rowsByTable.guardian_student_links?.length === 1, "targeted provisioning should include the approved guardian link");
const targetedProvisioningSql = createNormalizedRowsUpsertSql(targetedProvisioning.rowsByTable);
assert.ok(targetedProvisioningSql.sql.includes('insert into public."users"'), "targeted provisioning SQL should include users");
assert.ok(!targetedProvisioningSql.sql.includes("demo-parent@example.invalid"), "targeted provisioning SQL should not include seeded demo accounts");
assert.equal(
  canParentAccessLearner(managedChildSignup.state, { authenticated: true, role: "school-admin" }, "learner-managed-child"),
  true,
  "school admins should pass the reward learner access gate"
);
const managedLevelProfile = getLearnerLevelProfile(managedChildSignup.state, "learner-managed-child");
assert.equal(managedLevelProfile.level, 1, "new managed child should start at level 1");
assert.ok(getLearnerSubjectProgress(managedChildSignup.state, "learner-managed-child").some((subject) => subject.label === "Math"), "managed child should get subject-level progress rows");
assert.ok(getHouseholdLearnerInsights(managedChildSignup.state).some((insight) => insight.childAccount?.username === "managed-child"), "parent insights should include managed child account status");
const managedChildScopedInsights = getHouseholdLearnerInsights(managedChildSignup.state, { learnerIds: ["learner-managed-child"] });
assert.equal(managedChildScopedInsights.length, 1, "scoped parent insights should only return the linked child");
assert.equal(managedChildScopedInsights[0].learner.id, "learner-managed-child", "scoped parent insights should not leak seeded demo learners");
const managedChildScopedPlan = getTodayPlan(managedChildSignup.state, { learnerIds: ["learner-managed-child"] });
assert.ok(managedChildScopedPlan.length > 0, "scoped daily path should return lessons for the linked child");
assert.ok(
  managedChildScopedPlan.every((lesson) => lesson.academyId === "foundation" || String(lesson.grade) === "4"),
  "scoped daily path should match the linked child's grade or academy"
);
const managedChildParentSummary = getParentSummary(managedChildSignup.state, { learnerIds: ["learner-managed-child"] });
assert.equal(managedChildParentSummary.learnerCount, 1, "scoped parent summary should count only linked learners");
const emptyHouseholdSummary = getParentSummary(managedChildSignup.state, { learnerIds: [], strictLearnerScope: true });
assert.equal(emptyHouseholdSummary.learnerCount, 0, "strict empty household scope should not fall back to seeded learners");
assert.equal(getTodayPlan(managedChildSignup.state, { learnerIds: [], strictLearnerScope: true }).length, 0, "strict empty daily path should not fall back to seeded lessons");
assert.equal(getHouseholdLearnerInsights(managedChildSignup.state, { learnerIds: [], strictLearnerScope: true }).length, 0, "strict empty parent insights should stay empty");
const accountProjection = getPlatformSeedProjection(managedChildSignup.state);
assert.ok(accountProjection.tables.users.some((user) => user.email === "parent@example.test"), "account projection should include local parent user");
assert.ok(accountProjection.tables.teachers.some((teacher) => teacher.id === teacherSignup.result.sessionClaims.teacherId), "account projection should include local teacher profile");
assert.ok(accountProjection.tables.session_revocations.length >= 2, "account projection should include revoked sessions");
assert.ok(accountProjection.tables.auth_audit_events.some((event) => event.event_type === "email-verification-request"), "auth audit projection should include email verification requests");
assert.ok(accountProjection.tables.auth_audit_events.some((event) => event.event_type === "password-reset-request"), "auth audit projection should include password reset requests");
assert.ok(accountProjection.tables.auth_audit_events.some((event) => event.event_type === "session-revoked"), "auth audit projection should include session revocations");
assert.ok(accountSecurityRepositoryTableIds.includes("session_revocations"), "account security repository slice should write session revocations");
assert.ok(accountSecurityRepositoryTableIds.includes("auth_audit_events"), "account security repository slice should write auth audit events");
const accountSecurityRepository = createStateRepository({ root: `${process.env.TEMP || "C:\\tmp"}\\k12-learning-account-security-read-test`, env: {} });
const accountSecurityPendingVerification = createEmailVerificationRequest(managedChildSignup.state, {
  accountId: teacherSignup.result.account.id,
  requestedByUserId: teacherSignup.result.account.userId,
  ...createActionTokenRecord("repository-verify-test")
});
const accountSecurityPendingReset = createPasswordResetRequest(accountSecurityPendingVerification.state, {
  login: "teacher@example.test",
  requestedByUserId: teacherSignup.result.account.userId,
  ...createActionTokenRecord("repository-reset-test")
});
await accountSecurityRepository.writeState(accountSecurityPendingReset.state);
const repositoryAccountSecurity = await accountSecurityRepository.readAccountSecurity();
assert.equal(repositoryAccountSecurity.source, "normalized-repository", "account security read model should identify normalized repository source");
assert.ok(repositoryAccountSecurity.tableIds.includes("users"), "account security read model should list account tables");
assert.ok(repositoryAccountSecurity.summary.accountCount >= 3, "account security read model should count signed account rows");
assert.ok(repositoryAccountSecurity.summary.pendingEmailVerification >= 1, "account security read model should count pending email verification audit rows");
assert.ok(repositoryAccountSecurity.summary.pendingPasswordReset >= 1, "account security read model should count pending password reset audit rows");
assert.ok(repositoryAccountSecurity.sessionRevocations.length >= 2, "account security read model should expose session revocation rows");
const normalizedScopeSecurity = createAccountSecurityReadModel({
  users: [
    { id: "parent-user", role: "parent", email: "parent@example.test", email_verified: true },
    { id: "student-user", role: "student", email: "child@example.test", email_verified: true },
    { id: "teacher-user", role: "teacher", email: "teacher@example.test", email_verified: true }
  ],
  students: [{ id: "student-1", user_id: "student-user", status: "active" }],
  guardians: [{ id: "guardian-1", user_id: "parent-user" }],
  student_guardians: [{ student_id: "student-1", guardian_id: "guardian-1", status: "approved" }],
  guardian_student_links: [],
  teacher_class_assignments: [{ teacher_id: "teacher-1", class_id: "class-1", status: "active" }],
  classes: [{ id: "class-1", teacher_id: "teacher-1", status: "active" }],
  enrollments: [{ class_id: "class-1", student_id: "student-1", status: "active" }],
  consent_records: []
});
assert.equal(normalizedScopeSecurity.studentGuardians.length, 1, "account security read model should preserve direct parent-child links");
assert.equal(normalizedScopeSecurity.teacherClassAssignments.length, 1, "account security read model should preserve teacher assignments");
assert.equal(normalizedScopeSecurity.enrollments.length, 1, "account security read model should preserve class enrollments");
const targetedRevocation = createSessionRevocationRows({ sessionRevocations: [{ id: "revoke-1", userId: "user-1", sessionId: "session-1", reason: "test", createdAt: "2026-07-17T00:00:00.000Z" }] }, "revoke-1");
assert.equal(targetedRevocation.rowsByTable.session_revocations[0].user_id, "user-1", "targeted revocation rows should map app claims to normalized columns");
const repositoryRosterCsv = exportRepositoryRosterCsv({
  classes: [{ id: "class-1", name: "Math 6", studentIds: ["student-1"] }],
  learners: [{ id: "student-1", name: "Learner One", grade: "6", academyId: "bridge", status: "active", username: "learner1", email: "learner@example.test" }]
});
assert.ok(repositoryRosterCsv.includes("class-1,Math 6,bridge,active,learner1"), "repository roster export should use normalized school operation data");

const lessonLibrarySummary = getPlatformLessonLibrarySummary();
const lessonLibrarySamples = getPlatformLessonLibrarySamples(8);
const lessonBatchPlan = getPlatformLessonProductionBatchPlan({ batchSize: 24, limit: 9 });
assert.equal(lessonLibrarySummary.generatedLessonCount, curriculum.totalTargetLessons, "lesson library should generate the full target count");
assert.equal(lessonLibrarySummary.visualReady, lessonLibrarySummary.generatedLessonCount, "every lesson blueprint should require a visual");
assert.equal(lessonLibrarySummary.readinessPassed, true, "lesson library readiness should pass");
assert.ok(lessonLibrarySamples.some((item) => item.gradeBand === "6-8" && item.groupHomework), "middle-school samples should include group homework");
assert.ok(lessonLibrarySamples.some((item) => item.gradeBand === "9-12" && item.groupHomework), "high-school samples should include group homework");
assert.ok(lessonBatchPlan.totalBatches > 200, "lesson production should be split into reviewable batches");
assert.equal(lessonBatchPlan.totalLessons, lessonLibrarySummary.generatedLessonCount, "production batches should cover every lesson blueprint");
assert.ok(lessonBatchPlan.firstWaveBatchCount > 0, "Bridge Academy should have a first production wave");
assert.ok(lessonBatchPlan.firstWaveLessonCount > 0, "Bridge Academy first wave should include lessons");
assert.equal(lessonBatchPlan.visualRequirementCount, lessonLibrarySummary.generatedLessonCount, "each production-batch lesson should carry a visual requirement");
assert.ok(lessonBatchPlan.groupHomeworkCount >= lessonLibrarySummary.groupHomeworkReady, "batch plan should preserve 6-12 group homework requirements");
assert.ok(lessonBatchPlan.batches.every((batch) => batch.academyId === "bridge"), "limited batch preview should prioritize Bridge Academy first");
assert.ok(lessonBatchPlan.batches.every((batch) => batch.reviewSteps.length >= 5), "each batch should keep the full review/publish gate sequence");

const imageReadiness = getPlatformOpenAiImageReadiness({ OPENAI_API_KEY: "test-key", OPENAI_IMAGE_MODEL: "gpt-image-2" });
assert.equal(imageReadiness.ready, true, "OpenAI image readiness should pass when an API key is configured");
assert.equal(imageReadiness.reviewRequired, true, "OpenAI image generation should remain review-gated");
const localRuntimeStatus = getRuntimeConfigurationStatus({});
assert.equal(localRuntimeStatus.ready, true, "local runtime status should allow JSON fallback outside production");
assert.equal(localRuntimeStatus.repositoryMode, "json", "local runtime status should report JSON fallback mode without DATABASE_URL");
assert.ok(localRuntimeStatus.warnings.some((warning) => /OpenAI image generation/i.test(warning)), "local runtime status should warn when OpenAI images are not configured");
assert.ok(localRuntimeStatus.warnings.some((warning) => /visual asset storage/i.test(warning)), "local runtime status should warn when visual storage is not configured");
const completenessAudit = getProductCompletenessAudit(createInitialState(), { NODE_ENV: "development" });
const agentAudit = completenessAudit.categories.find((category) => category.id === "agents");
assert.match(agentAudit.evidence, /managed tools; .* review-gated external-risk tools/, "readiness audit should use the tool gateway summary contract");
const stateDependencyAudit = getStateDependencyAudit();
assert.equal(stateDependencyAudit.summary.legacySnapshotRoutes, 3, "state dependency audit should track remaining broad state routes");
assert.ok(stateDependencyAudit.focusedReadRoutes.includes("/api/auth/security"), "state dependency audit should include account-security read route");
assert.ok(stateDependencyAudit.focusedReadRoutes.includes("/api/rewards/approvals"), "state dependency audit should include reward read route");
assert.ok(stateDependencyAudit.focusedReadRoutes.includes("/api/tutor/events"), "state dependency audit should include tutor event read route");
assert.ok(stateDependencyAudit.focusedWriteRoutes.includes("/api/learning/quiz"), "state dependency audit should include feature-specific learning writes");
assert.ok(stateDependencyAudit.focusedWriteRoutes.includes("/api/learning/phase"), "state dependency audit should include persisted Nexus phase completion writes");
assert.equal(stateDependencyAudit.summary.productionBlocker, true, "state dependency audit should keep broad state dependency as a production blocker");
const postgresRuntimeStatus = getRuntimeConfigurationStatus({
  DATABASE_URL: "postgresql://postgres:password@example.supabase.co:5432/postgres",
  K12_REPOSITORY_MODE: "postgres",
  SUPABASE_URL: "https://hqsydwjcpcammmfftyqi.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "publishable",
  SUPABASE_SECRET_KEY: "secret",
  SUPABASE_JWKS_URL: "https://hqsydwjcpcammmfftyqi.supabase.co/auth/v1/.well-known/jwks.json",
  VISUAL_ASSET_STORAGE_BUCKET: "k12-visual-assets",
  OPENAI_API_KEY: "test-key"
});
assert.equal(postgresRuntimeStatus.ready, true, "configured Postgres/Supabase runtime should pass readiness");
assert.equal(postgresRuntimeStatus.checks.find((check) => check.id === "database-url").passed, true, "runtime status should pass database check with DATABASE_URL");
assert.equal(postgresRuntimeStatus.checks.find((check) => check.id === "visual-storage").passed, true, "runtime status should pass visual storage check with bucket config");
const brokenProductionRuntimeStatus = getRuntimeConfigurationStatus({ NODE_ENV: "production" });
assert.equal(brokenProductionRuntimeStatus.ready, false, "production runtime should fail without database and auth provider config");
assert.ok(brokenProductionRuntimeStatus.blockers.some((blocker) => /DATABASE_URL/.test(blocker)), "production runtime should report missing DATABASE_URL");
const scopedIsolation = isolateStateForStrictLearnerScope({
  learners: [{ id: "private-learner" }],
  localAccounts: [{ id: "private-account" }],
  lessonScratchpads: { "private-learner": { lesson: { confusion: "private" } } },
  quizResults: { lesson: { score: 100 } },
  visualAssets: [{ id: "safe-asset" }],
  selectedLessonId: "safe-lesson"
});
assert.equal(scopedIsolation.learners.length, 0, "strict learner scope should withhold cached learner records");
assert.deepEqual(scopedIsolation.lessonScratchpads, {}, "strict learner scope should withhold cached scratchpads");
assert.deepEqual(scopedIsolation.quizResults, {}, "strict learner scope should withhold cached quiz results");
assert.equal(scopedIsolation.visualAssets[0].id, "safe-asset", "strict learner scope should preserve non-private visual assets");
assert.equal(scopedIsolation.persistence.source, "repository-scoped", "strict learner scope should mark repository isolation");
const localProductAudit = getProductCompletenessAudit(state, {});
assert.equal(localProductAudit.readyForSale, false, "product audit should not mark the current local build as sellable");
assert.ok(localProductAudit.total >= 10, "product audit should cover major product systems");
assert.ok(localProductAudit.categories.some((item) => item.id === "views" && item.status === "complete"), "product audit should count the 14-view contract as complete");
assert.ok(localProductAudit.categories.some((item) => item.id === "runtime" && item.status === "blocked"), "product audit should flag missing Postgres runtime as blocked");
assert.ok(localProductAudit.categories.some((item) => item.id === "content-scale" && item.status === "in-progress"), "product audit should keep full K-12 lesson production in progress until generated blueprints are fully published");
assert.match(localProductAudit.categories.find((item) => item.id === "content-scale").evidence, /production batches/, "product audit should expose production batch counts");
assert.match(localProductAudit.categories.find((item) => item.id === "content-scale").evidence, /pilot scale gate=open/, "product audit should explain that the pilot visual quality gate is open");
const configuredProductAudit = getProductCompletenessAudit(state, postgresRuntimeStatus);
assert.notEqual(configuredProductAudit.categories.find((item) => item.id === "runtime").status, "blocked", "configured runtime should clear the runtime blocker");
assert.equal(configuredProductAudit.categories.find((item) => item.id === "database").status, "blocked", "database audit should require a live repository probe instead of trusting URL presence");
const verifiedProductAudit = getProductCompletenessAudit(state, { ...postgresRuntimeStatus, databaseVerified: true });
assert.equal(verifiedProductAudit.categories.find((item) => item.id === "database").status, "complete", "database audit should pass after a live repository probe is recorded");
assert.equal(estimateImageCostCents({ model: "gpt-image-2", size: "1024x1024", quality: "medium" }), 5.3, "image cost estimate should use configured model/size/quality");
const blockedImagePlan = createImageGenerationPlan({
  prompt: "Generate a learning diagram",
  state: { visualGenerationJobs: [] },
  env: { OPENAI_IMAGE_ENABLED: "true" }
});
assert.equal(blockedImagePlan.accepted, false, "image plan should block without an API key");
assert.match(blockedImagePlan.blockers.join(" "), /OPENAI_API_KEY/, "image plan should explain missing API key");
const acceptedImagePlan = createImageGenerationPlan({
  prompt: "Generate a learning diagram",
  state: { visualGenerationJobs: [] },
  env: { OPENAI_API_KEY: "test-key", OPENAI_IMAGE_MODEL: "gpt-image-2", OPENAI_IMAGE_MAX_COST_CENTS: "10" }
});
assert.equal(acceptedImagePlan.accepted, true, "image plan should pass with API key and cost limit");
assert.match(acceptedImagePlan.prompt, /Do not show real children/i, "image plan should append child-safety constraints");

const normalizedPlan = createNormalizedStateUpsertSql(state);
assert.ok(normalizedRepositoryTableIds.includes("content_drafts"), "normalized repository should include content drafts");
assert.ok(normalizedRepositoryTableIds.includes("visual_assets"), "normalized repository should include visual assets");
assert.ok(normalizedRepositoryTableIds.includes("ai_tutor_events"), "normalized repository should include AI tutor events");
assert.ok(normalizedRepositoryTableIds.includes("agent_review_items"), "normalized repository should include review queue items");
assert.ok(normalizedRepositoryTableIds.includes("research_evidence_sources"), "normalized repository should include research evidence sources");
assert.ok(normalizedRepositoryTableIds.includes("lesson_redesign_tasks"), "normalized repository should include lesson redesign tasks");
assert.ok(normalizedRepositoryTableIds.includes("reward_approvals"), "normalized repository should include reward approval records");
assert.ok(normalizedPlan.rowCounts.users >= state.learners.length + 3, "normalized SQL should project user rows");
assert.ok(normalizedPlan.rowCounts.content_drafts >= 2, "normalized SQL should project content draft rows");
assert.match(normalizedPlan.sql, /insert into public\."content_drafts"/, "normalized SQL should upsert content drafts");
assert.match(normalizedPlan.sql, /insert into public\."quiz_attempts"/, "normalized SQL should upsert quiz attempts");
assert.match(normalizedPlan.sql, /insert into public\."agent_review_items"/, "normalized SQL should upsert review items");
assert.match(normalizedPlan.sql, /"source_prompt"/, "normalized SQL should persist visual source prompts");
assert.match(normalizedPlan.sql, /"review_checklist"/, "normalized SQL should persist visual review checklists");
assert.match(normalizedPlan.sql, /"storage_public_url"/, "normalized SQL should include storage-backed visual URL metadata");
assert.match(normalizedPlan.sql, /on conflict \("id"\) do update set/, "normalized SQL should use conflict-safe upserts");
const seedProjection = getPlatformSeedProjection(state);
assert.ok(seedProjection.tables.visual_assets.length >= 6, "seed projection should include visual assets");
assert.ok(
  seedProjection.tables.visual_assets.every((asset) => String(asset.asset_url || "").startsWith("data:image/svg+xml,")),
  "seed visual assets should use previewable SVG data URLs"
);
assert.ok(
  seedProjection.tables.visual_assets.every((asset) => String(asset.asset_url || "").length < 1600),
  "seed visual asset URLs should stay compact enough for reliable Supabase pooler imports"
);
const approvedPilotVisuals = (state.visualAssets || []).filter(
  (asset) => asset.assetKind === "generated-svg" && asset.sourceBatchId === "core-pilot-publication"
);
assert.ok(approvedPilotVisuals.length >= pilotLessons.length, "each pilot lesson should have at least one approved production visual asset");
assert.ok(
  pilotLessons.every((lesson) => approvedPilotVisuals.some((asset) => asset.lessonId === lesson.id)),
  "approved pilot visuals should cover every pilot lesson"
);
assert.deepEqual(
  ["ai-tutor", "group-homework", "lesson-hero", "misconception-repair", "teaching-diagram"].sort(),
  [...new Set(approvedPilotVisuals.filter((asset) => asset.lessonId === "g6-learning-ai-build-test").map((asset) => asset.placement))].sort(),
  "Learning AI approved visuals should cover every required placement"
);
assert.ok(
  approvedPilotVisuals.every((asset) => asset.sourcePrompt && asset.reviewChecklist?.length >= 5),
  "pilot visual assets should keep source prompts and reviewer checklists"
);
assert.ok(
  approvedPilotVisuals.some((asset) => /Equal spaces|Main idea|Food web|Compass|Pressure|Nucleus/i.test(asset.svg || "")),
  "pilot visual SVGs should contain lesson-specific diagram labels"
);
const ratioSvgVisual = approvedPilotVisuals.find((asset) => asset.lessonId === "g6-math-ratios-unit-rates");
const ratioOpenAiVisual = {
  ...ratioSvgVisual,
  id: "asset-openai-ratio-selector-test",
  assetKind: "openai-generated-image",
  assetUrl: "",
  storagePublicUrl: "https://example.com/ratio-openai.png",
  storagePath: "lessons/g6-math-ratios-unit-rates/ratio-openai.png",
  placement: "teaching-diagram",
  updatedAt: "2026-07-13T10:00:00.000Z"
};
const ratioMisconceptionVisual = {
  ...ratioOpenAiVisual,
  id: "asset-openai-ratio-misconception-selector-test",
  storagePublicUrl: "https://example.com/ratio-misconception.png",
  storagePath: "lessons/g6-math-ratios-unit-rates/ratio-misconception.png",
  placement: "misconception-repair",
  updatedAt: "2026-07-13T11:00:00.000Z"
};
assert.equal(
  getApprovedLessonVisualAsset({ visualAssets: [ratioSvgVisual, ratioOpenAiVisual] }, "g6-math-ratios-unit-rates").id,
  ratioOpenAiVisual.id,
  "lesson visual selector should prefer approved storage-backed OpenAI images over generated SVG fallbacks"
);
assert.equal(
  getApprovedLessonVisualAsset(
    { visualAssets: [ratioSvgVisual, ratioOpenAiVisual, ratioMisconceptionVisual] },
    "g6-math-ratios-unit-rates",
    { preferredPlacements: ["teaching-diagram", "lesson-hero"] }
  ).id,
  ratioOpenAiVisual.id,
  "lesson visual selector should keep the teaching diagram in the model phase when a newer misconception asset exists"
);
assert.equal(
  getApprovedLessonVisualAsset(
    { visualAssets: [ratioSvgVisual, ratioOpenAiVisual, ratioMisconceptionVisual] },
    "g6-math-ratios-unit-rates",
    { preferredPlacements: ["misconception-repair"], requirePreferredPlacement: true }
  ).id,
  ratioMisconceptionVisual.id,
  "lesson visual selector should return the approved misconception-repair asset when that placement is required"
);
assert.equal(
  getApprovedLessonVisualAsset(
    { visualAssets: [ratioSvgVisual, ratioOpenAiVisual] },
    "g6-math-ratios-unit-rates",
    { preferredPlacements: ["misconception-repair"], requirePreferredPlacement: true }
  ),
  null,
  "lesson visual selector should not substitute a teaching diagram for a required misconception-repair visual"
);
const evidenceAnswers = Object.fromEntries(pilotLessons[0].quiz.map((question) => [question.id, question.answerIndex]));
const completedEvidenceState = completeLessonQuiz(state, pilotLessons[0].id, evidenceAnswers);
assert.deepEqual(
  completedEvidenceState.quizResults[pilotLessons[0].id].answers,
  evidenceAnswers,
  "quiz completion should preserve submitted answers as learning evidence"
);
assert.ok(learningEvidenceRepositoryTableIds.includes("quiz_attempts"), "learning evidence slice should include quiz attempts");
assert.ok(learningEvidenceRepositoryTableIds.includes("interactive_skill_evidence"), "learning evidence slice should include interactive skill evidence");
assert.ok(learningEvidenceRepositoryTableIds.includes("retention_schedules"), "learning evidence slice should include retention schedules");
assert.ok(learningEvidenceRepositoryTableIds.includes("reward_approvals"), "learning evidence slice should include reward approvals");
const evidencePlan = createNormalizedStateUpsertSql(completedEvidenceState, learningEvidenceRepositoryTableIds);
assert.match(evidencePlan.sql, /insert into public\."quiz_attempts"/, "learning evidence SQL should upsert quiz attempts");
assert.match(evidencePlan.sql, /insert into public\."learning_events"/, "learning evidence SQL should upsert learning events");
assert.match(evidencePlan.sql, /reward_approvals/, "learning evidence SQL should include reward approvals table");
assert.doesNotMatch(evidencePlan.sql, /insert into public\."content_drafts"/, "learning evidence SQL should not write content drafts");
assert.ok(classroomWorkflowRepositoryTableIds.includes("class_sessions"), "classroom workflow slice should include class sessions");
assert.ok(classroomWorkflowRepositoryTableIds.includes("group_artifacts"), "classroom workflow slice should include group artifacts");
assert.ok(classroomWorkflowRepositoryTableIds.includes("teacher_interventions"), "classroom workflow slice should include teacher interventions");
assert.ok(classroomWorkflowRepositoryTableIds.includes("school_reports"), "classroom workflow slice should include school reports");
const classroomWorkflowPlan = createNormalizedStateUpsertSql(recordedIntervention.state, classroomWorkflowRepositoryTableIds);
assert.match(classroomWorkflowPlan.sql, /insert into public\."group_artifacts"/, "classroom workflow SQL should upsert group artifacts");
assert.match(classroomWorkflowPlan.sql, /insert into public\."teacher_interventions"/, "classroom workflow SQL should upsert teacher interventions");
assert.doesNotMatch(classroomWorkflowPlan.sql, /insert into public\."content_drafts"/, "classroom workflow SQL should not write content drafts");
assert.ok(classroomEvidenceRepositoryTableIds.includes("group_artifacts"), "classroom evidence read model should declare group artifacts");
assert.ok(classroomEvidenceRepositoryTableIds.includes("teacher_interventions"), "classroom evidence read model should declare teacher interventions");
const classroomEvidenceRepository = createStateRepository({ root: `${process.env.TEMP || "C:\\tmp"}\\k12-learning-classroom-evidence-test`, env: {} });
await classroomEvidenceRepository.writeState(recordedIntervention.state);
const repositoryClassroomEvidence = await classroomEvidenceRepository.readClassroomEvidence({
  classSessionId: recordedIntervention.result.intervention.classSessionId
});
assert.equal(repositoryClassroomEvidence.source, "normalized-repository", "classroom evidence read model should identify normalized repository source");
assert.ok(repositoryClassroomEvidence.tableIds.includes("group_artifacts"), "classroom evidence read model should expose artifact table");
assert.ok(repositoryClassroomEvidence.summary.artifacts >= 1, "classroom evidence read model should count class artifacts");
assert.ok(repositoryClassroomEvidence.summary.interventions >= 1, "classroom evidence read model should count teacher interventions");
assert.ok(repositoryClassroomEvidence.artifacts.every((artifact) => artifact.classSessionId === recordedIntervention.result.intervention.classSessionId), "classroom evidence read model should filter artifacts by class session");
assert.ok(repositoryClassroomEvidence.interventions.every((intervention) => intervention.classSessionId === recordedIntervention.result.intervention.classSessionId), "classroom evidence read model should filter interventions by class session");
assert.ok(classroomMonitorRepositoryTableIds.includes("lesson_scratchpads"), "classroom monitor read model should declare scratchpad rows");
assert.ok(classroomMonitorRepositoryTableIds.includes("interactive_skill_evidence"), "classroom monitor read model should declare interactive evidence rows");
const repositoryClassroomMonitor = await classroomEvidenceRepository.readClassroomMonitor({
  classSectionId: "class-bridge-science-6a"
});
assert.equal(repositoryClassroomMonitor.source, "normalized-repository", "classroom monitor read model should identify normalized repository source");
assert.ok(repositoryClassroomMonitor.tableIds.includes("class_sessions"), "classroom monitor read model should expose class sessions");
assert.equal(repositoryClassroomMonitor.classSection.id, "class-bridge-science-6a", "classroom monitor should return the requested class section");
assert.ok(repositoryClassroomMonitor.learners.length >= 1, "classroom monitor should include enrolled learners");
assert.ok(repositoryClassroomMonitor.metrics.enrolled >= 1, "classroom monitor should count enrolled learners");
assert.ok(repositoryClassroomMonitor.metrics.teacherSupport >= 1, "classroom monitor should count open teacher support");
assert.ok(repositoryClassroomMonitor.learners.some((item) => item.status === "Teacher support"), "classroom monitor should expose learner support status from interventions");
assert.ok(classroomStudentRepositoryTableIds.includes("class_sessions"), "student classroom read model should declare class sessions");
assert.ok(classroomStudentRepositoryTableIds.includes("group_artifacts"), "student classroom read model should declare group artifacts");
const repositoryLearnerClassSession = await classroomEvidenceRepository.readLearnerClassSession({ learnerId: "maya" });
assert.equal(repositoryLearnerClassSession.source, "normalized-repository", "student classroom read model should identify normalized repository source");
assert.ok(repositoryLearnerClassSession.tableIds.includes("lesson_scratchpads"), "student classroom read model should expose lesson scratchpads");
assert.equal(repositoryLearnerClassSession.classroom.learner.id, "maya", "student classroom read model should return the requested learner");
assert.equal(repositoryLearnerClassSession.classroom.classSection.id, "class-bridge-science-6a", "student classroom read model should return the learner class section");
assert.equal(repositoryLearnerClassSession.classroom.lesson.id, "g6-earth-systems-weather", "student classroom read model should return the live lesson");
assert.equal(repositoryLearnerClassSession.classroom.learnerStatus.status, "Teacher support", "student classroom read model should include learner support status");
assert.ok(schoolOperationsRepositoryTableIds.includes("classes"), "school operations slice should include classes");
assert.ok(schoolOperationsRepositoryTableIds.includes("enrollments"), "school operations slice should include enrollments");
assert.ok(schoolOperationsRepositoryTableIds.includes("account_invitations"), "school operations slice should include account invitations");
assert.ok(schoolOperationsRepositoryTableIds.includes("school_reports"), "school operations slice should include school reports");
const schoolOperationsPlan = createNormalizedStateUpsertSql(importedRoster.state, schoolOperationsRepositoryTableIds);
assert.match(schoolOperationsPlan.sql, /insert into public\."classes"/, "school operations SQL should upsert classes");
assert.match(schoolOperationsPlan.sql, /insert into public\."enrollments"/, "school operations SQL should upsert enrollments");
assert.match(schoolOperationsPlan.sql, /insert into public\."account_invitations"/, "school operations SQL should upsert account invitations");
assert.doesNotMatch(schoolOperationsPlan.sql, /insert into public\."content_drafts"/, "school operations SQL should not write content drafts");
assert.ok(schoolOperationsReadRepositoryTableIds.includes("schools"), "school operations read model should declare schools");
assert.ok(schoolOperationsReadRepositoryTableIds.includes("enrollments"), "school operations read model should declare enrollments");
const schoolOperationsRepository = createStateRepository({ root: `${process.env.TEMP || "C:\\tmp"}\\k12-learning-school-operations-test`, env: {} });
await schoolOperationsRepository.writeState(importedRoster.state);
const repositorySchoolOperations = await schoolOperationsRepository.readSchoolOperations({ schoolId: importedRoster.state.schoolProfile.id });
assert.equal(repositorySchoolOperations.source, "normalized-repository", "school operations read model should identify normalized repository source");
assert.ok(repositorySchoolOperations.tableIds.includes("account_invitations"), "school operations read model should expose invitation table");
assert.ok(repositorySchoolOperations.summary.classes >= 1, "school operations read model should count classes");
assert.ok(repositorySchoolOperations.summary.learners >= 1, "school operations read model should count enrolled learners");
assert.ok(repositorySchoolOperations.summary.pendingInvitations >= 1, "school operations read model should count pending invitations");
assert.ok(repositorySchoolOperations.classes.every((section) => section.schoolId === importedRoster.state.schoolProfile.id), "school operations read model should filter classes by school");
assert.ok(repositorySchoolOperations.learners.some((learner) => learner.name === "Sam Lee"), "school operations read model should expose imported roster learners");
assert.ok(contentWorkflowRepositoryTableIds.includes("content_drafts"), "content workflow slice should include drafts");
assert.ok(contentWorkflowRepositoryTableIds.includes("agent_review_items"), "content workflow slice should include review queue rows");
assert.ok(contentWorkflowRepositoryTableIds.includes("lesson_standards"), "content workflow slice should include published lesson standards");
const contentWorkflowPlan = createNormalizedStateUpsertSql(state, contentWorkflowRepositoryTableIds);
assert.match(contentWorkflowPlan.sql, /insert into public\."content_drafts"/, "content workflow SQL should upsert content drafts");
assert.match(contentWorkflowPlan.sql, /insert into public\."agent_review_items"/, "content workflow SQL should upsert review rows");
assert.doesNotMatch(contentWorkflowPlan.sql, /insert into public\."ai_tutor_events"/, "content workflow SQL should not write tutor events");
assert.deepEqual(
  visualWorkflowRepositoryTableIds,
  ["grade_bands", "grade_levels", "subjects", "standards", "courses", "units", "lessons", "content_drafts", "visual_assets", "agent_review_items"],
  "visual workflow slice should write lesson and draft parents before visuals and review rows"
);
assert.ok(agentReviewDecisionRepositoryTableIds.includes("agent_tool_calls"), "review decision slice should include tool calls");
assert.ok(agentReviewDecisionRepositoryTableIds.includes("ai_tutor_events"), "review decision slice should include AI tutor events");
assert.ok(agentReviewDecisionRepositoryTableIds.includes("lesson_redesign_tasks"), "review decision slice should include redesign tasks");
const reviewCleanup = createNormalizedTableDeleteMissingSql(state, agentReviewRepositoryTableIds);
assert.match(reviewCleanup.sql, /delete from public\."agent_review_items"/, "review cleanup SQL should delete stale review rows");
assert.doesNotMatch(reviewCleanup.sql, /delete from public\."content_drafts"/, "review cleanup SQL should not delete content drafts");
const jsonRepositoryStatus = createStateRepository({ root: process.cwd(), env: {} }).status();
assert.equal(jsonRepositoryStatus.mode, "json", "repository should default to JSON fallback mode");
assert.equal(jsonRepositoryStatus.normalizedTables, normalizedRepositoryTableIds.length, "repository status should expose normalized table coverage");
const selectDraftSql = createNormalizedTableSelectSql("content_drafts", { limit: 7 });
assert.match(selectDraftSql, /from public\."content_drafts"/, "normalized select SQL should target the requested table");
assert.match(selectDraftSql, /limit 7/, "normalized select SQL should include a bounded limit");
assert.throws(() => createNormalizedTableSelectSql("not_a_table"), /Unknown production table|not exposed/, "normalized select SQL should reject unknown tables");
const jsonRepository = createStateRepository({ root: `${process.env.TEMP || "C:\\tmp"}\\k12-learning-repository-test`, env: {} });
await jsonRepository.writeState(state);
await jsonRepository.writeLearningEvidence(completedEvidenceState);
await jsonRepository.writeContentWorkflow(state);
await jsonRepository.writeVisualWorkflow(state);
await jsonRepository.writeAgentReviewDecision(state);
const draftRows = await jsonRepository.readNormalizedTable("content_drafts", { limit: 1 });
assert.equal(draftRows.length, 1, "JSON repository normalized table read should honor limits");
assert.ok(draftRows[0].title, "JSON repository normalized table read should return table-shaped rows");
assert.ok(draftRows[0].lesson_sections, "normalized content draft rows should include lesson sections");
assert.equal(draftRows[0].lesson_body_ready, true, "normalized content draft rows should include lesson-body readiness");
assert.ok(Array.isArray(draftRows[0].visual_supports), "normalized content draft rows should include visual support JSON");
const repositoryContentDrafts = await jsonRepository.readContentDrafts();
assert.equal(repositoryContentDrafts.source, "normalized-repository", "content draft reads should identify the normalized repository source");
assert.ok(repositoryContentDrafts.tableIds.includes("content_drafts"), "content draft read model should list its backing table");
assert.ok(contentDraftRepositoryTableIds.includes("content_drafts"), "content draft table set should include content_drafts");
assert.equal(repositoryContentDrafts.summary.total, state.contentDrafts.length, "content draft read model should count normalized draft rows");
assert.ok(repositoryContentDrafts.summary.lessonBodyReady >= 1, "content draft read model should count lesson-body readiness");
assert.ok(repositoryContentDrafts.summary.visualSupportReady >= 1, "content draft read model should count visual supports");
assert.ok(repositoryContentDrafts.summary.truthNeedsReview >= 1, "content draft read model should count truth-review needs");
assert.ok(repositoryContentDrafts.drafts[0].academyId, "content draft read model should map academy_id to academyId");
assert.ok(repositoryContentDrafts.drafts[0].lessonSections.directInstruction, "content draft read model should map lesson_sections to lessonSections");
assert.ok(Array.isArray(repositoryContentDrafts.drafts[0].sourceCards), "content draft read model should map source_cards to sourceCards");
const reviewContentDrafts = await jsonRepository.readContentDrafts({ status: "review" });
assert.ok(reviewContentDrafts.drafts.every((draft) => draft.status === "review"), "content draft read model should support status filtering");
const tableSummary = await jsonRepository.readNormalizedTableSummary();
assert.ok(tableSummary.rowCounts.content_drafts >= 2, "normalized table summary should count content drafts");
assert.ok(tableSummary.tableIds.includes("quiz_attempts"), "normalized table summary should list queryable tables");
const repositoryLearningCatalog = await jsonRepository.readLearningCatalog({ learnerId: "avery" });
assert.equal(repositoryLearningCatalog.source, "normalized-repository", "learning catalog should identify the normalized repository source");
assert.ok(repositoryLearningCatalog.tableIds.includes("lesson_progress"), "learning catalog should read progress tables");
assert.ok(learningCatalogRepositoryTableIds.includes("mastery_records"), "learning catalog table set should include mastery records");
assert.ok(learningCatalogRepositoryTableIds.includes("learning_events"), "learning catalog table set should include phase learning events");
assert.ok(repositoryLearningCatalog.summary.lessonCount >= pilotLessons.length, "learning catalog should include seed lessons");
assert.ok(repositoryLearningCatalog.summary.withQuiz >= pilotLessons.length, "learning catalog should connect lessons to quiz questions");
assert.ok(
  repositoryLearningCatalog.lessons.some((item) => item.id === "g3-fractions-number-line" && item.progress && item.mastery),
  "learning catalog should include learner progress and mastery for the selected learner"
);
const metadataOnlyCatalog = await jsonRepository.readLearningCatalog({ includeProgress: false });
assert.ok(
  metadataOnlyCatalog.lessons.every((item) => !item.progress && !item.mastery && !item.scratchpad && !item.latestAttempt),
  "metadata-only catalogs should omit learner progress and assessment evidence"
);
const repositoryLearningEvents = await jsonRepository.readLearningEvents({ learnerId: "avery" });
assert.equal(repositoryLearningEvents.source, "normalized-repository", "learning event read model should identify the normalized repository source");
assert.ok(repositoryLearningEvents.tableIds.includes("learning_events"), "learning event read model should expose its source table");
assert.ok(repositoryLearningEvents.events.every((event) => event.learnerId === "avery"), "learning event read model should enforce learner filtering");
const mergedLearningEventState = mergeRepositoryLearningEvents(createInitialState(), repositoryLearningEvents);
assert.ok(mergedLearningEventState.learningEvents.some((event) => event.learnerId === "avery"), "repository learning events should merge into the student state");
assert.ok(learningEventRepositoryTableIds.includes("learning_events"), "learning event repository slice should declare learning_events");
assert.ok(learnerProfileRepositoryTableIds.includes("student_guardians"), "learner profile read model should include guardian links");
const repositoryStudentProfiles = await jsonRepository.readLearnerProfiles({ role: "student", studentId: "avery" });
assert.equal(repositoryStudentProfiles.source, "normalized-repository", "learner profiles should identify the normalized repository source");
assert.equal(repositoryStudentProfiles.learners.length, 1, "student learner profile read should be limited to the authenticated learner");
assert.equal(repositoryStudentProfiles.learners[0].id, "avery", "student learner profile read should return the requested learner");
assert.ok(repositoryStudentProfiles.learners[0].grade, "learner profile should include grade placement");
const mergedLearnerProfileState = mergeRepositoryLearnerProfiles(createInitialState(), repositoryStudentProfiles);
assert.equal(mergedLearnerProfileState.learners.find((learner) => learner.id === "avery").repositoryProfile, true, "repository learner profile merge should mark the profile as authoritative");
const repositoryLesson = repositoryLearningCatalog.lessons.find((item) => item.id === "g3-fractions-number-line");
assert.ok(repositoryLesson.activities.length >= 5, "learning catalog should expose ordered lesson activities for the student player");
assert.ok(repositoryLesson.quiz.questions.length >= 2, "learning catalog should expose quiz questions for the student player");
const adaptedRepositoryLesson = repositoryCatalogLessonToAppLesson(repositoryLesson);
assert.equal(adaptedRepositoryLesson.repositoryCatalog, true, "repository lesson adapter should mark repository-backed lessons");
assert.equal(adaptedRepositoryLesson.sections.teach, repositoryLesson.activities.find((item) => item.type === "direct_instruction").body, "repository lesson adapter should map teaching activity content");
const repositoryMergedState = mergeRepositoryLearningCatalog(createInitialState(), {
  lessons: [{ ...repositoryLesson, id: "published-repository-test-lesson", catalogSource: "published" }]
});
assert.ok(repositoryMergedState.publishedLessons.some((lesson) => lesson.id === "published-repository-test-lesson"), "repository catalog merge should make non-pilot lessons available to the player");
const repositoryQuizMasterySummary = getLearningCatalogQuizMasterySummary(repositoryLearningCatalog, {
  lessonId: "g3-fractions-number-line"
});
assert.ok(repositoryQuizMasterySummary.masteryRecords >= 1, "catalog quiz/mastery helper should count scoped mastery records");
assert.ok(repositoryQuizMasterySummary.quizAttempts >= 1, "catalog quiz/mastery helper should count scoped quiz attempts");
assert.ok(repositoryQuizMasterySummary.needsReview >= 1, "catalog quiz/mastery helper should count needs-review mastery records");
assert.equal(repositoryQuizMasterySummary.latest.lessonId, "g3-fractions-number-line", "catalog quiz/mastery helper should expose the latest lesson evidence");
assert.ok(rewardApprovalRepositoryTableIds.includes("reward_approvals"), "reward approval read model should declare reward approvals");
const scopedRewardState = requestRewardApproval(state, {
  learnerId: "avery",
  rewardLevel: 2,
  rewardTitle: "Repository reward read proof",
  rewardBenefit: "Parent-visible mastery benefit",
  requestedBy: "Avery",
  source: "test"
}).state;
scopedRewardState.masteryBenefits = [
  ...(scopedRewardState.masteryBenefits || []),
  {
    id: "repository-portfolio-proof",
    learnerId: "avery",
    lessonId: "g3-fractions-number-line",
    title: "Repository portfolio read proof",
    type: "mastery_artifact",
    source: "test",
    unlockedAt: "2026-06-28T12:00:00.000Z"
  }
];
const rewardRepository = createStateRepository({ root: `${process.env.TEMP || "C:\\tmp"}\\k12-learning-reward-read-test`, env: {} });
await rewardRepository.writeState(scopedRewardState);
const repositoryRewardApprovals = await rewardRepository.readRewardApprovals({ learnerId: "avery" });
assert.equal(repositoryRewardApprovals.source, "normalized-repository", "reward approval read model should identify normalized repository source");
assert.ok(repositoryRewardApprovals.tableIds.includes("reward_approvals"), "reward approval read model should expose its table set");
assert.ok(repositoryRewardApprovals.summary.total >= 1, "reward approval read model should count scoped reward requests");
assert.ok(repositoryRewardApprovals.approvals.every((approval) => approval.learnerId === "avery"), "reward approval read model should filter by learner");
assert.ok(portfolioEvidenceRepositoryTableIds.includes("portfolio_items"), "portfolio evidence read model should declare portfolio items");
assert.ok(portfolioEvidenceRepositoryTableIds.includes("student_badges"), "portfolio evidence read model should declare earned badge rows");
const repositoryPortfolioEvidence = await rewardRepository.readPortfolioEvidence({ learnerId: "avery" });
assert.equal(repositoryPortfolioEvidence.source, "normalized-repository", "portfolio evidence read model should identify normalized repository source");
assert.ok(repositoryPortfolioEvidence.tableIds.includes("portfolio_items"), "portfolio evidence read model should expose its table set");
assert.ok(repositoryPortfolioEvidence.summary.portfolioItems >= 1, "portfolio evidence read model should count learner portfolio artifacts");
assert.ok(repositoryPortfolioEvidence.summary.badgesEarned >= 1, "portfolio evidence read model should count learner badges");
assert.ok(repositoryPortfolioEvidence.portfolioItems.every((item) => item.learnerId === "avery"), "portfolio evidence read model should filter portfolio by learner");
assert.ok(repositoryPortfolioEvidence.studentBadges.every((badge) => badge.learnerId === "avery"), "portfolio evidence read model should filter badges by learner");

const authoring = getContentAuthoringSummary(state);
assert.ok(authoring.total >= 2, "initial state should include content drafts");
assert.ok(authoring.grade3Core >= 2, "initial content drafts should support the grade 3 pilot");

const visualAudit = getVisualLearningAgentAudit(state);
assert.equal(visualAudit.agentId, "visual-learning-agent", "visual learning agent should expose a stable agent id");
assert.equal(visualAudit.auditedLessons, pilotLessons.length, "visual learning agent should audit every pilot lesson");
assert.ok(visualAudit.totalSlots >= pilotLessons.length * 5, "visual learning agent should create multiple visual opportunities per lesson");
assert.ok(visualAudit.byPlacement["lesson-hero"] >= pilotLessons.length, "visual learning agent should recommend core lesson images");
assert.ok(visualAudit.byPlacement["teaching-diagram"] >= pilotLessons.length, "visual learning agent should recommend teaching diagrams");
assert.ok(visualAudit.byPlacement["ai-tutor"] >= pilotLessons.length, "visual learning agent should recommend tutor visuals");
const learningAiVisualSlots = visualAudit.slots.filter((slot) => slot.lessonId === "g6-learning-ai-build-test");
assert.ok(learningAiVisualSlots.length >= 6, "Learning AI should receive hero, diagram, tutor, misconception, and group-work visual opportunities");
assert.deepEqual(
  ["ai-tutor", "group-homework", "lesson-hero", "misconception-repair", "teaching-diagram"].sort(),
  [...new Set(learningAiVisualSlots.map((slot) => slot.placement))].sort(),
  "Learning AI visual slots should cover all required production placements"
);
const learningAiPromptGrade = gradeImagePrompt(learningAiVisualSlots.find((slot) => slot.placement === "teaching-diagram"));
assert.equal(learningAiPromptGrade.grade, "A", "Learning AI teaching diagram prompt should earn an A-level grade");
assert.equal(learningAiPromptGrade.canGenerate, true, "Learning AI teaching diagram prompt should be eligible for generation");
const learningAiGate = getPilotQualityGateReport(state).lessons.find((item) => item.lessonId === "g6-learning-ai-build-test");
assert.ok(learningAiGate, "pilot quality gate should include the Learning AI special lesson");
assert.equal(learningAiGate.checks.content, true, "Learning AI should clear content gate");
assert.equal(learningAiGate.checks.prompt, true, "Learning AI should clear prompt gate");
assert.equal(learningAiGate.checks.visual, true, "Learning AI should clear the visual gate after approved production visuals are seeded");
assert.deepEqual(learningAiGate.visualPlacementStatus.missingPlacements, [], "Learning AI should have no missing required visual placements");
for (const placement of ["lesson-hero", "teaching-diagram", "ai-tutor", "misconception-repair", "group-homework"]) {
  const approvedAsset = getApprovedLessonVisualAsset(state, "g6-learning-ai-build-test", {
    preferredPlacements: [placement],
    requirePreferredPlacement: true,
    includeInlineSvg: true
  });
  assert.ok(approvedAsset, `Learning AI should resolve an approved ${placement} visual`);
  assert.equal(approvedAsset.status, "approved", `Learning AI ${placement} visual should be approved`);
  assert.equal(gradeGeneratedVisual(approvedAsset).passed, true, `Learning AI ${placement} visual should pass the generated visual grader`);
}
const tutorVisualSlot = visualAudit.slots.find((slot) => slot.placement === "ai-tutor" && slot.lessonId === lesson.id);
assert.ok(tutorVisualSlot, "visual learning agent should create a tutor visual slot for the active lesson");
assert.match(tutorVisualSlot.prompt, /Generate a/i, "visual prompt should be generation-ready");
assert.match(tutorVisualSlot.prompt, /Learning objective/i, "visual prompt should include lesson context");
assert.match(tutorVisualSlot.prompt, /Do not depict real children/i, "visual prompt should include child-safety visual constraints");
assert.equal(getVisualLearningOpportunity(state, tutorVisualSlot.id).id, tutorVisualSlot.id, "visual opportunity lookup should find a slot by id");
const imagePromptGrade = gradeImagePrompt(tutorVisualSlot);
assert.equal(imagePromptGrade.passed, true, "visual opportunity prompt should pass the image prompt grader");
assert.equal(imagePromptGrade.grade, "A", "review-gated visual prompt should earn an A-level prompt grade");
assert.equal(imagePromptGrade.canGenerate, true, "A-level prompt should be eligible for image generation");
const unsafePromptGrade = gradeImagePrompt("Make a picture of a real child with a Mickey Mouse logo and give the final answer.");
assert.equal(unsafePromptGrade.passed, false, "unsafe image prompt should not pass");
assert.equal(unsafePromptGrade.grade, "F", "unsafe image prompt should be blocked");
assert.ok(unsafePromptGrade.criticalBlockers.length >= 2, "unsafe prompt should list critical blockers");
const promptRevisionLoop = runArtifactRevisionLoop({
  artifactType: "image_prompt",
  artifact: "Draw a math picture.",
  regenerate: ({ revisionBrief }) =>
    [
      revisionBrief.regenerationPrompt,
      "Lesson id/title: g3-fractions-number-line called Fraction Number Line Adventure.",
      "Grade 3 math subject. Learning objective: locate fractions on a number line using equal spaces.",
      "Visual purpose: show the hard part and misconception that students count tick marks instead of equal spaces.",
      "Required labels: 0, 1/2, 1, equal spaces, same point.",
      "Learner action after viewing: explain the equal spaces, then retry one practice item.",
      "Visual style: Academy Worlds cyber-neon educational diagram, clear and uncluttered.",
      "Accessibility and forbidden content: high contrast, readable spacing, short labels only, do not depict real children, no private data, no logos, no copyrighted characters, classroom-safe."
    ].join(" ")
});
assert.equal(promptRevisionLoop.status, "manager-review", "revision loop should improve a weak prompt to manager review");
assert.equal(promptRevisionLoop.finalReview.passed, true, "revision loop final prompt should pass grading");
assert.ok(promptRevisionLoop.history.length >= 2, "revision loop should record the failed and improved attempts");
const generatedVisual = addGeneratedVisualAsset(state, {
  slot: tutorVisualSlot,
  prompt: tutorVisualSlot.prompt,
  b64Json: "ZmFrZS1pbWFnZQ==",
  model: "gpt-image-1.5",
  outputFormat: "png",
  usage: { total_tokens: 1 }
});
assert.equal(generatedVisual.result.accepted, true, "generated visual should be accepted into review state");
assert.equal(generatedVisual.state.visualAssets[0].status, "review", "generated OpenAI image should require review");
assert.equal(generatedVisual.state.visualAssets[0].assetKind, "openai-generated-image", "generated visual should record OpenAI asset kind");
assert.equal(getVisualAssetSummary(generatedVisual.state).openAiGenerated, 1, "visual summary should count OpenAI-generated assets");
assert.equal(getVisualAssetSummary(generatedVisual.state).needsStorage, 1, "generated OpenAI image should require storage promotion before production approval");
assert.equal(getVisualAssetStorageConfig({ SUPABASE_URL: "https://example.supabase.co", SUPABASE_SECRET_KEY: "secret" }).ready, true, "visual storage config should pass with Supabase URL and secret key");
assert.equal(parseDataImageUrl(generatedVisual.state.visualAssets[0].assetUrl).accepted, true, "generated visual data URL should be parseable for storage upload");
assert.match(visualAssetStoragePath(generatedVisual.state.visualAssets[0], "png"), /^lessons\//, "visual storage path should be lesson scoped");
const existingBucketSetup = await setupVisualAssetStorageBucket({
  env: {
    SUPABASE_URL: "https://example.supabase.co",
    SUPABASE_SECRET_KEY: "secret",
    VISUAL_ASSET_STORAGE_BUCKET: "k12-visual-assets"
  },
  fetchImpl: async () => ({
    ok: true,
    status: 200,
    json: async () => ({ public: true, allowed_mime_types: ["image/png"] })
  })
});
assert.equal(existingBucketSetup.ready, true, "storage setup should pass when the configured bucket exists");
const createdBucketCalls = [];
const createdBucketSetup = await setupVisualAssetStorageBucket({
  env: {
    SUPABASE_URL: "https://example.supabase.co",
    SUPABASE_SECRET_KEY: "secret",
    VISUAL_ASSET_STORAGE_BUCKET: "k12-visual-assets"
  },
  createIfMissing: true,
  fetchImpl: async (url, options) => {
    createdBucketCalls.push({ url, options });
    return createdBucketCalls.length === 1
      ? { ok: false, status: 404, json: async () => ({}) }
      : { ok: true, status: 200, json: async () => ({}) };
  }
});
assert.equal(createdBucketSetup.ready, true, "storage setup should create the configured bucket when requested");
assert.equal(createdBucketCalls.length, 2, "storage setup should check the bucket before creating it");
const storageCalls = [];
const storageUpload = await uploadVisualAssetToSupabaseStorage({
  asset: generatedVisual.state.visualAssets[0],
  env: {
    SUPABASE_URL: "https://example.supabase.co",
    SUPABASE_SECRET_KEY: "secret",
    VISUAL_ASSET_STORAGE_BUCKET: "k12-visual-assets"
  },
  fetchImpl: async (url, options) => {
    storageCalls.push({ url, options });
    return {
      ok: true,
      status: 200,
      json: async () => ({})
    };
  }
});
assert.equal(storageUpload.accepted, true, "storage upload should accept generated visual data images");
assert.ok(storageUpload.publicUrl.includes("/storage/v1/object/public/k12-visual-assets/lessons/"), "storage upload should produce a public object URL");
assert.equal(storageCalls.length, 1, "storage upload should skip bucket creation unless explicitly enabled");
const storagePromotedVisual = markVisualAssetStoragePromoted(generatedVisual.state, generatedVisual.result.assetId, storageUpload);
assert.equal(storagePromotedVisual.result.accepted, true, "storage promotion should update the generated visual asset");
assert.equal(getVisualAssetSummary(storagePromotedVisual.state).storageBacked, 1, "visual summary should count storage-backed generated assets");
const storagePromotedImageGrade = gradeGeneratedVisual(storagePromotedVisual.state.visualAssets[0]);
assert.equal(storagePromotedImageGrade.passed, true, "storage-backed generated image should pass generated visual grading");
assert.equal(storagePromotedImageGrade.approved, true, "passing generated visual grade should be approval-eligible");
assert.ok(storagePromotedImageGrade.scoreByCategory.some((item) => item.id === "storageAndMetadata"), "generated visual grade should include storage and metadata scoring");
assert.ok(storagePromotedVisual.state.artifactReviewHistory.some((item) => item.artifactType === "generated_visual"), "visual grading should persist review history in application state");
assert.ok(storagePromotedVisual.state.visualAssets[0].reviewHistory.length >= 2, "visual asset should retain prompt and generated-visual review attempts");
const unpromotedImageGrade = gradeGeneratedVisual(generatedVisual.state.visualAssets[0]);
assert.equal(unpromotedImageGrade.passed, false, "unpromoted generated image should fail production grading");
assert.ok(unpromotedImageGrade.criticalBlockers.some((item) => /storage-backed/i.test(item)), "unpromoted generated image should require storage backing");
const visualRepository = createStateRepository({ root: `${process.env.TEMP || "C:\\tmp"}\\k12-learning-visual-repository-test`, env: {} });
await visualRepository.writeState(storagePromotedVisual.state);
const repositoryVisualAssets = await visualRepository.readVisualAssets();
assert.equal(repositoryVisualAssets.source, "normalized-repository", "visual asset reads should identify the normalized repository source");
assert.ok(repositoryVisualAssets.tableIds.includes("visual_assets"), "visual asset read model should list its backing table");
assert.ok(visualAssetRepositoryTableIds.includes("visual_assets"), "visual asset table set should include visual_assets");
assert.ok(repositoryVisualAssets.assets.some((asset) => asset.id === generatedVisual.result.assetId && asset.reviewHistory.length >= 1), "normalized visual repository should persist review history");
const visualWorkflowSql = createNormalizedStateUpsertSql(storagePromotedVisual.state, ["visual_assets", "agent_review_items"]);
assert.match(visualWorkflowSql.sql, /"latest_review"/, "visual workflow SQL should persist the latest artifact grade");
assert.match(visualWorkflowSql.sql, /"review_history"/, "visual workflow SQL should persist revision history");
assert.match(visualWorkflowSql.sql, /"revision_instructions"/, "review queue SQL should persist creator feedback");
assert.ok(repositoryVisualAssets.summary.total >= 7, "visual asset read model should include generated visual rows plus approved lesson diagrams");
assert.equal(repositoryVisualAssets.summary.review, 1, "visual asset read model should count review assets");
assert.equal(repositoryVisualAssets.summary.openAiGenerated, 1, "visual asset read model should count OpenAI-generated assets");
assert.ok(repositoryVisualAssets.summary.generatedSvg >= 6, "visual asset read model should count approved SVG lesson diagrams");
assert.equal(repositoryVisualAssets.summary.storageBacked, 1, "visual asset read model should count storage-backed generated images");
const repositoryOpenAiVisual = repositoryVisualAssets.assets.find((asset) => asset.assetKind === "openai-generated-image");
assert.ok(repositoryOpenAiVisual.assetUrl.startsWith("https://example.supabase.co/storage/v1/object/public/"), "visual asset read model should prefer storage public URLs");
assert.equal(repositoryOpenAiVisual.sourcePrompt, tutorVisualSlot.prompt, "visual asset read model should preserve source prompts from the database");
assert.ok(repositoryOpenAiVisual.reviewChecklist.length >= 5, "visual asset read model should preserve review checklists from the database");
assert.equal(repositoryOpenAiVisual.reviewReady, true, "visual asset read model should mark complete assets as review-ready");
assert.equal(repositoryOpenAiVisual.productionReady, true, "storage-backed generated images should be production-ready after review metadata is complete");
const reviewVisualAssets = await visualRepository.readVisualAssets({ status: "review" });
assert.ok(reviewVisualAssets.assets.every((asset) => asset.status === "review"), "visual asset read model should support status filtering");

const toolRegistry = getAgentToolRegistry();
assert.ok(toolRegistry.length >= 9, "tool gateway should expose managed tools");
const visualGenerationTool = toolRegistry.find((tool) => tool.id === "visual_generation");
assert.equal(visualGenerationTool.requiresHumanReview, true, "visual generation tool should require human review");
assert.equal(visualGenerationTool.studentFacing, false, "visual generation tool should not be student-facing");
const truthPolicyTool = toolRegistry.find((tool) => tool.id === "truth_policy_review");
assert.equal(truthPolicyTool.ownerAgentId, "truth-policy", "truth policy tool should be owned by the truth-policy agent");
assert.equal(truthPolicyTool.requiresHumanReview, true, "truth policy review should require human review");
assert.equal(truthPolicyTool.studentFacing, false, "truth policy review should not be student-facing");
const funRetentionTool = toolRegistry.find((tool) => tool.id === "fun_retention_design");
assert.equal(funRetentionTool.ownerAgentId, "fun-retention", "fun-retention tool should be owned by the fun-retention agent");
assert.equal(funRetentionTool.studentFacing, false, "fun-retention tool should stay staff/parent mediated");
const syllabusResearchTool = toolRegistry.find((tool) => tool.id === "syllabus_misconception_research");
assert.equal(syllabusResearchTool.ownerAgentId, "syllabus-research", "syllabus research tool should be owned by the syllabus-research agent");
assert.equal(syllabusResearchTool.requiresHumanReview, true, "syllabus research should require human review");
assert.equal(syllabusResearchTool.studentFacing, false, "syllabus research should not be student-facing");
const liveSourceAuditTool = toolRegistry.find((tool) => tool.id === "live_curriculum_source_audit");
assert.equal(liveSourceAuditTool.ownerAgentId, "syllabus-research", "live source audit should be owned by the web audit agent");
assert.equal(liveSourceAuditTool.externalRisk, "web-fetch", "live source audit should be marked as web-fetch risk");
assert.equal(liveSourceAuditTool.requiresHumanReview, true, "live source audit should require human review");
assert.equal(liveSourceAuditTool.studentFacing, false, "live source audit should not be student-facing");
const explanationStudioTool = toolRegistry.find((tool) => tool.id === "explanation_variation_studio");
assert.equal(explanationStudioTool.ownerAgentId, "teacher-explanation", "explanation studio should be owned by the teacher explanation agent");
assert.equal(explanationStudioTool.studentFacing, false, "explanation studio should be staff/parent mediated");
assert.ok(explanationStudioTool.allowedRoles.includes("parent"), "explanation studio should allow parent-guided planning");
assert.ok(funRetentionRubric.length >= 6, "fun-retention rubric should cover multiple design dimensions");
assert.ok(syllabusResearchSources.some((source) => source.id === "common-core-math"), "syllabus research should include Common Core as an approved source target");
assert.ok(syllabusResearchSources.some((source) => source.id === "ca-common-core-math-grade-6"), "syllabus research should include California Grade 6 math standards");
assert.ok(syllabusResearchSources.some((source) => source.id === "ixl-grade-6-math-reference"), "syllabus research should include IXL Grade 6 math as a constrained reference source");
assert.ok(syllabusResearchFindings.length >= 5, "syllabus research should include a staff source ledger");
assert.ok(syllabusResearchFindings.some((finding) => finding.sourceId === "wwc-fractions-k8"), "source ledger should include WWC fractions evidence");
assert.ok(syllabusResearchFindings.some((finding) => finding.id === "finding-ca-g6-math-source-set"), "source ledger should include California Grade 6 math curriculum findings");
assert.ok(
  syllabusResearchFindings.some((finding) => finding.id === "finding-ixl-g6-math-reference-boundary" && /must not copy/i.test(finding.claim)),
  "IXL Grade 6 reference finding should block copying proprietary content"
);
const grade6SourceLedger = JSON.parse(readFileSync("data/source-ledger/california-grade-6-source-ledger.json", "utf8"));
assert.equal(grade6SourceLedger.gradeLevel, "6", "California source ledger should target Grade 6");
assert.ok(grade6SourceLedger.policy.ixlBlockedUse.some((item) => /Copying full skill lists/i.test(item)), "source ledger should block copying IXL skill lists");
assert.ok(grade6SourceLedger.sources.filter((source) => source.provider === "IXL").length >= 8, "source ledger should include supplied IXL reference URLs");
assert.ok(grade6SourceLedger.sources.some((source) => source.id === "ixl-g6-math-videos"), "source ledger should preserve the IXL Grade 6 videos link");
assert.ok(grade6SourceLedger.sources.some((source) => source.id === "ca-common-core-math-g6" && source.status === "primary"), "official California math standards should be primary");
const grade6ScopeSequence = readFileSync("docs/curriculum/grade-6-california-scope-sequence.md", "utf8");
assert.match(grade6ScopeSequence, /Bridge Academy Grade 6 California Scope Sequence/, "Grade 6 scope sequence doc should exist");
assert.match(grade6ScopeSequence, /Do not copy IXL lesson explanations/, "Grade 6 scope sequence should preserve the IXL use boundary");
assert.match(grade6ScopeSequence, /Bridge Academy Batch 1/, "Grade 6 scope sequence should define the first production batch");
assert.equal(isApprovedLiveSourceUrl("https://ies.ed.gov/ncee/wwc/PracticeGuide/15"), true, "live audit should allow approved curriculum sources");
assert.equal(isApprovedLiveSourceUrl("https://example.com/random"), false, "live audit should reject unapproved sources");
const extractedSource = extractSourceEvidence(
  "<html><head><title>Practice Guide</title><meta name=\"description\" content=\"Fractions instruction guidance\"></head><body><p>Grade 3 math students often struggle with fractions because they count marks instead of equal spaces on the number line.</p><p>Teachers should use visual models, explicit language, and student explanations before symbolic shortcuts.</p></body></html>",
  { subject: "math", grade: "3", lessonTitle: "Fractions on a Number Line" }
);
assert.equal(extractedSource.title, "Practice Guide", "source extraction should read title metadata");
assert.ok(extractedSource.snippets.some((snippet) => /fractions/i.test(snippet)), "source extraction should return relevant snippets");
const mockedLiveAudit = await fetchApprovedSourceAudit({
  sourceUrl: "https://ies.ed.gov/ncee/wwc/PracticeGuide/15",
  subject: "math",
  grade: "3",
  gradeBand: "K-5",
  lessonTitle: lesson.title,
  fetchImpl: async () => ({
    ok: true,
    status: 200,
    headers: { get: () => "text/html; charset=utf-8" },
    text: async () =>
      "<html><head><title>Fractions Guide</title></head><body><p>Fractions should be represented on number lines so students reason about equal spaces and explain why procedures work.</p></body></html>"
  })
});
assert.equal(mockedLiveAudit.audit.ok, true, "mocked live audit should accept an approved source response");
assert.ok(mockedLiveAudit.sourceLedger[0].sourceUrl.includes("PracticeGuide/15"), "live audit should create source ledger rows");
const gatewaySummary = getAgentToolGatewaySummary(state);
assert.equal(gatewaySummary.totalTools, toolRegistry.length, "tool gateway summary should count registered tools");
assert.ok(gatewaySummary.externalRiskTools >= 2, "tool gateway should identify external-risk tools");

const lessonAuditRun = runAgentTool(state, {
  toolId: "lesson_audit",
  role: "teacher",
  input: { lessonId: "g3-fractions-number-line" }
});
state = lessonAuditRun.state;
assert.equal(lessonAuditRun.result.accepted, true, "teacher should be able to run lesson audit");
assert.equal(state.toolCallLogs.length, 1, "lesson audit should create a tool call log");
assert.equal(lessonAuditRun.result.data.evidenceAudit.passed, true, "lesson audit should include evidence audit result");

const blockedVisualRun = runAgentTool(state, {
  toolId: "visual_generation",
  role: "student",
  input: { slotId: tutorVisualSlot.id }
});
state = blockedVisualRun.state;
assert.equal(blockedVisualRun.result.accepted, false, "student should not be allowed to run visual generation");
assert.equal(state.toolCallLogs[0].status, "blocked", "blocked tool run should be logged");

const standardsLookupRun = runAgentTool(state, {
  toolId: "standards_lookup",
  role: "parent",
  input: { query: "math" }
});
state = standardsLookupRun.state;
assert.equal(standardsLookupRun.result.accepted, true, "parent should be able to run standards lookup");
assert.ok(standardsLookupRun.result.data.matches.some((framework) => framework.id === "ccss-math"), "standards lookup should find math framework");

const funRetentionRun = runAgentTool(state, {
  toolId: "fun_retention_design",
  role: "teacher",
  input: { lessonId: lesson.id }
});
state = funRetentionRun.state;
assert.equal(funRetentionRun.result.accepted, true, "teacher should be able to run fun-retention design audit");
assert.equal(funRetentionRun.result.ownerAgentId, "fun-retention", "fun-retention design should use the fun-retention agent");
assert.ok(funRetentionRun.result.data.rubric.score >= 80, "pilot lesson should score as retention-ready");
assert.ok(funRetentionRun.result.data.firstPrinciplesTeachingPrompt.length >= 3, "fun-retention audit should include first-principles teaching prompt");

const explanationStudioRun = runAgentTool(state, {
  toolId: "explanation_variation_studio",
  role: "parent",
  input: {
    lessonId: lesson.id,
    studentInput: "I do not understand the picture or why the equal spaces matter."
  }
});
state = explanationStudioRun.state;
assert.equal(explanationStudioRun.result.accepted, true, "parent should be able to run explanation variation planning");
assert.equal(explanationStudioRun.result.ownerAgentId, "teacher-explanation", "explanation studio should use the teacher explanation agent");
assert.ok(explanationStudioRun.result.data.explanationRoutes.length >= explanationModes.length, "explanation studio should create a route for every explanation mode");
assert.ok(explanationStudioRun.result.data.visualPlans.length >= 6, "explanation studio should create multiple visual types");
assert.ok(
  explanationStudioRun.result.data.visualPlans.some((plan) => plan.type === "misconception-contrast"),
  "explanation studio should include misconception contrast visuals"
);
assert.equal(explanationStudioRun.result.data.webAuditHandoff.staffOnly, true, "web audit handoff should stay staff-only");
assert.equal(
  explanationStudioRun.result.data.webAuditHandoff.recommendedToolId,
  "syllabus_misconception_research",
  "web audit handoff should route to syllabus misconception research"
);

const blockedExplanationStudioRun = runAgentTool(state, {
  toolId: "explanation_variation_studio",
  role: "student",
  input: { lessonId: lesson.id }
});
state = blockedExplanationStudioRun.state;
assert.equal(blockedExplanationStudioRun.result.accepted, false, "student should not be able to run explanation variation planning");
assert.equal(blockedExplanationStudioRun.log.status, "blocked", "blocked explanation planning should be logged");

const syllabusResearchRun = runAgentTool(state, {
  toolId: "syllabus_misconception_research",
  role: "teacher",
  input: { lessonId: lesson.id, subject: "math", grade: "3" }
});
state = syllabusResearchRun.state;
assert.equal(syllabusResearchRun.result.accepted, true, "teacher should be able to run syllabus research planning");
assert.equal(syllabusResearchRun.result.ownerAgentId, "syllabus-research", "syllabus research should use the syllabus-research agent");
assert.equal(syllabusResearchRun.result.data.staffOnly, true, "syllabus web research should be staff-only");
assert.ok(syllabusResearchRun.result.data.likelyMostDifficult.length >= 1, "syllabus research should surface likely hard parts");
assert.ok(syllabusResearchRun.result.data.studentInterviewQuestions.some((question) => /confusing/i.test(question)), "research plan should feed student interview questions");
assert.ok(syllabusResearchRun.result.data.sourceLedger.length >= 3, "syllabus research should attach relevant source findings");
assert.ok(syllabusResearchRun.result.data.redesignTasks.length >= syllabusResearchRun.result.data.likelyMostDifficult.length, "syllabus research should create redesign tasks");
assert.ok(syllabusResearchRun.log.payload.redesignTasks.length >= 1, "tool call log should preserve redesign task payload");
assert.equal(new Set(state.toolCallLogs.map((log) => log.id)).size, state.toolCallLogs.length, "tool call ids should stay unique for review routing");
const researchProjection = getPlatformSeedProjection(state);
assert.ok(researchProjection.tables.research_evidence_sources.length >= syllabusResearchFindings.length, "seed projection should include source ledger rows");
assert.ok(researchProjection.tables.lesson_redesign_tasks.length >= syllabusResearchRun.result.data.redesignTasks.length, "seed projection should include research redesign tasks");
assert.ok(researchProjection.tables.agent_tool_calls.some((log) => log.payload?.redesignTasks?.length), "agent tool call projection should preserve structured payloads");

const liveAuditPlanRun = runAgentTool(state, {
  toolId: "live_curriculum_source_audit",
  role: "teacher",
  input: {
    lessonId: lesson.id,
    sourceUrl: "https://ies.ed.gov/ncee/wwc/PracticeGuide/15",
    subject: "math",
    grade: "3"
  }
});
state = liveAuditPlanRun.state;
assert.equal(liveAuditPlanRun.result.accepted, true, "teacher should be able to prepare a live source audit");
assert.equal(liveAuditPlanRun.result.data.approved, true, "live source audit should mark approved source URLs");
assert.equal(liveAuditPlanRun.result.data.staffOnly, true, "live source audit should stay staff-only");
const blockedLiveAuditRun = runAgentTool(state, {
  toolId: "live_curriculum_source_audit",
  role: "student",
  input: {
    lessonId: lesson.id,
    sourceUrl: "https://ies.ed.gov/ncee/wwc/PracticeGuide/15"
  }
});
state = blockedLiveAuditRun.state;
assert.equal(blockedLiveAuditRun.result.accepted, false, "student should not be able to run live source audit");
assert.equal(blockedLiveAuditRun.log.status, "blocked", "blocked live source audit should be logged");

const approvedResearchToolState = resolveAgentReviewItem(state, `tool:${syllabusResearchRun.log.id}`, "approve");
state = approvedResearchToolState.state;
assert.equal(approvedResearchToolState.result.accepted, true, "manager should be able to approve syllabus research output");
assert.ok(approvedResearchToolState.result.appliedDraftId, "approving syllabus research should create a content draft");
const researchDraft = state.contentDrafts.find((draft) => draft.id === approvedResearchToolState.result.appliedDraftId);
assert.equal(researchDraft.status, "review", "research redesign draft should enter review status");
assert.equal(researchDraft.sourceToolCallId, syllabusResearchRun.log.id, "research draft should link back to the tool call");
assert.equal(researchDraft.sourceLessonId, lesson.id, "research draft should link back to the source lesson");
assert.ok(researchDraft.redesignTaskIds.length >= 1, "research draft should store redesign task ids");
assert.ok(researchDraft.researchSourceIds.includes("wwc-fractions-k8"), "research draft should preserve source ids");
assert.equal(getDraftEvidenceAudit(researchDraft).passed, true, "research draft should preserve math evidence moves from the source lesson");
const researchDraftProjection = getPlatformSeedProjection(state);
const researchDraftRow = researchDraftProjection.tables.content_drafts.find((row) => row.id === researchDraft.id);
assert.equal(researchDraftRow.source_tool_call_id, syllabusResearchRun.log.id, "content draft projection should store source tool call id");
assert.ok(researchDraftRow.redesign_task_ids.length >= 1, "content draft projection should store redesign task ids");

const blockedSyllabusResearchRun = runAgentTool(state, {
  toolId: "syllabus_misconception_research",
  role: "student",
  input: { lessonId: lesson.id }
});
state = blockedSyllabusResearchRun.state;
assert.equal(blockedSyllabusResearchRun.result.accepted, false, "student should not be able to run syllabus web research");
assert.equal(blockedSyllabusResearchRun.log.status, "blocked", "blocked syllabus research should be logged");

const truthReviewRun = runAgentTool(state, {
  toolId: "truth_policy_review",
  role: "teacher",
  input: {
    lessonId: lesson.id,
    studentInput: "I keep counting the tick marks",
    tutorResponse: "The stuck point is counting tick marks. Use the number line model and count equal spaces, then retry by explaining why 1/2 and 2/4 land on the same point."
  }
});
state = truthReviewRun.state;
assert.equal(truthReviewRun.result.accepted, true, "teacher should be able to run truth-policy review");
assert.equal(truthReviewRun.result.ownerAgentId, "truth-policy", "truth-policy review should use the truth-policy agent");
assert.ok(truthReviewRun.result.data.review.average >= 4, "truth-policy review should grade a grounded tutor response highly");
assert.equal(truthReviewRun.result.requiresHumanReview, true, "truth-policy review should remain human-review gated");

const curriculumExportRun = runAgentTool(state, {
  toolId: "curriculum_export",
  role: "school-admin",
  input: {}
});
state = curriculumExportRun.state;
assert.equal(curriculumExportRun.result.accepted, true, "school admin should be able to run curriculum export");
assert.equal(curriculumExportRun.result.data.academies.length, 3, "curriculum export should include all academies");

const tutorContract = getAiTutorToolContractSummary();
assert.ok(tutorContract.stageCount >= 7, "AI tutor contract should define the full response sequence");
assert.ok(tutorContract.blockedBehaviors.some((behavior) => /final quiz/i.test(behavior)), "AI tutor contract should block final-answer behavior");
assert.ok(tutorContract.permittedTools.some((tool) => tool.toolId === "visual_generation"), "AI tutor contract should route visuals through the gateway");
assert.ok(tutorContract.permittedTools.some((tool) => tool.toolId === "truth_policy_review"), "AI tutor contract should route quality review through truth policy");
assert.ok(agentTeam.some((agent) => agent.id === "truth-policy"), "agent team should include a truth and fact-check agent");
assert.ok(agentTeam.some((agent) => agent.id === "fun-retention"), "agent team should include a fun and retention design agent");
assert.ok(agentTeam.some((agent) => agent.id === "syllabus-research"), "agent team should include a syllabus and misconception research agent");
assert.ok(agentTeam.some((agent) => agent.id === "teacher-explanation"), "agent team should include a teacher explanation design agent");
assert.ok(agentTeam.some((agent) => agent.id === "student-tutor"), "agent team should include a student tutor agent");

const visualReviewQueue = getAgentReviewQueue(generatedVisual.state);
assert.equal(visualReviewQueue.visualReview, 1, "generated review visual should enter the manager review queue");
const visualReviewDossier = getManagerReviewDossier(storagePromotedVisual.state, `visual:${generatedVisual.result.assetId}`);
assert.equal(visualReviewDossier.found, true, "manager review dossier should resolve visual review items");
assert.equal(visualReviewDossier.artifactType, "visual", "manager review dossier should identify visual artifact type");
assert.ok(visualReviewDossier.categoryScores.length >= 4, "manager visual dossier should expose rubric category scores");
assert.ok(visualReviewDossier.reviewHistory.length >= 1, "manager visual dossier should expose revision history");
assert.ok(visualReviewDossier.sourcePrompt, "manager visual dossier should expose the source prompt");
assert.match(visualReviewDossier.publishImpact, /lesson player|Approval/i, "manager visual dossier should explain publish impact");
const blockedVisualApproval = resolveAgentReviewItem(generatedVisual.state, `visual:${generatedVisual.result.assetId}`, "approve");
assert.equal(blockedVisualApproval.result.accepted, false, "manager approval should be blocked until the generated visual passes storage and quality gates");
assert.equal(blockedVisualApproval.state.visualAssets[0].status, "review", "blocked visual approval should leave the asset in review");
assert.ok(blockedVisualApproval.result.review.criticalBlockers.some((item) => /storage-backed/i.test(item)), "blocked visual approval should expose the storage gate");
const approvedVisualReview = resolveAgentReviewItem(storagePromotedVisual.state, `visual:${generatedVisual.result.assetId}`, "approve");
assert.equal(approvedVisualReview.result.accepted, true, "manager should be able to approve a storage-backed visual review item");
assert.equal(approvedVisualReview.state.visualAssets[0].status, "approved", "approved visual review should update asset status");
const requestedVisualRevision = resolveAgentReviewItem(storagePromotedVisual.state, `visual:${generatedVisual.result.assetId}`, "request_revision");
assert.equal(requestedVisualRevision.result.accepted, true, "manager should be able to return a visual to the creator for revision");
assert.equal(requestedVisualRevision.state.visualAssets[0].status, "review", "requested visual revision should return the asset to review");
assert.equal(requestedVisualRevision.state.visualAssets[0].reviewStatus, "revision-required", "requested visual revision should record revision-required status");
assert.ok(requestedVisualRevision.state.visualGenerationJobs.some((job) => job.status === "revision-requested" && job.assetId === generatedVisual.result.assetId), "requested visual revision should create a creator-agent revision job");

let commandCenter = getAgentCommandCenter(state);
assert.ok(commandCenter.reviewQueue.toolReview >= 1, "command center should surface review-gated tool calls");
const reviewAuditRepository = createStateRepository({ root: `${process.env.TEMP || "C:\\tmp"}\\k12-learning-review-audit-repository-test`, env: {} });
await reviewAuditRepository.writeState(state);
const repositoryReviewItems = await reviewAuditRepository.readAgentReviewItems();
assert.equal(repositoryReviewItems.source, "normalized-repository", "review queue read model should identify the normalized repository source");
assert.ok(repositoryReviewItems.tableIds.includes("agent_review_items"), "review queue read model should list its backing table");
assert.ok(agentReviewRepositoryTableIds.includes("agent_review_items"), "review queue table set should include agent_review_items");
assert.ok(repositoryReviewItems.summary.toolReview >= 1, "review queue read model should count pending tool reviews");
assert.ok(repositoryReviewItems.items.some((item) => item.id === `tool:${blockedVisualRun.log.id}`), "review queue rows should map to manager review command ids");
const highPriorityReviewItems = await reviewAuditRepository.readAgentReviewItems({ priority: "high" });
assert.ok(highPriorityReviewItems.items.every((item) => item.priority === "high"), "review queue read model should support priority filtering");
const repositoryAuditEvents = await reviewAuditRepository.readAuditEvents();
assert.equal(repositoryAuditEvents.source, "normalized-repository", "audit event read model should identify the normalized repository source");
assert.ok(repositoryAuditEvents.tableIds.includes("audit_events"), "audit event read model should include audit_events");
assert.ok(auditEventRepositoryTableIds.includes("auth_audit_events"), "audit event table set should include auth_audit_events");
assert.ok(repositoryAuditEvents.summary.toolCalls >= 1, "audit event read model should count tool-call audit records");
assert.ok(repositoryAuditEvents.events.some((event) => event.entityType === "agent_tool_call"), "audit event rows should expose normalized entity types");
const reviewedToolState = resolveAgentReviewItem(state, `tool:${blockedVisualRun.log.id}`, "reject");
state = reviewedToolState.state;
assert.equal(reviewedToolState.result.accepted, true, "manager should be able to review a tool call");
assert.equal(state.toolCallLogs.find((log) => log.id === blockedVisualRun.log.id).reviewStatus, "rejected", "reviewed tool call should store decision");

const safetyResponseForQueue = createAiTutorResponse("I feel unsafe at home", lesson.id, "K-5");
state = appendAiLog(state, "I feel unsafe at home", safetyResponseForQueue, lesson.id);
commandCenter = getAgentCommandCenter(state);
assert.ok(commandCenter.reviewQueue.aiReview >= 1, "command center should surface flagged AI interactions");
const reviewedAiState = resolveAgentReviewItem(state, `ai:${state.aiLogs[0].id}`, "reviewed");
state = reviewedAiState.state;
assert.equal(reviewedAiState.result.accepted, true, "manager should be able to mark flagged AI log reviewed");
assert.equal(state.aiLogs[0].reviewStatus, "reviewed", "AI log should store review status");

const draftState = createContentDraft(state, {
  subject: "social-studies",
  title: "Map Symbols Review",
  objective: "Use map symbols to explain a community feature.",
  standards: ["c3"],
  reviewNotes: "Check map accessibility labels.",
  accessibilityNotes: "Use high-contrast labels and a read-aloud option.",
  ageFitNotes: "Grade 3 students use familiar community landmarks and short written explanations."
});
assert.equal(getContentAuthoringSummary(draftState).total, getContentAuthoringSummary(state).total + 1, "creating a content draft should add one draft");
assert.ok(getContentAuthoringSummary(draftState).truthBlocked >= 1, "authoring summary should count drafts waiting on truth review");
assert.equal(typeof draftState.contentDrafts[0].truthScore, "number", "creating a content draft should attach a truth-policy score");
assert.equal(draftState.contentDrafts[0].truthReviewStatus, "needs-human-review", "new content drafts should require truth-policy review");
assert.ok(getContentAuthoringSummary(draftState).lessonBodyReady >= 1, "authoring summary should count rich lesson bodies");
assert.equal(getContentDraftCompletenessReview(draftState.contentDrafts[0]).passed, true, "new content drafts should include a complete lesson-body scaffold");
assert.ok(draftState.contentDrafts[0].lessonSections.directInstruction, "new content drafts should include direct instruction text");
assert.ok(draftState.contentDrafts[0].helperNotes.length >= 2, "new content drafts should include helper notes");
assert.ok(draftState.contentDrafts[0].commonMisunderstandings.length >= 1, "new content drafts should include misconception repair");
assert.ok(draftState.contentDrafts[0].visualSupports.length >= 2, "new content drafts should include visual supports");
assert.ok(draftState.contentDrafts[0].quizQuestions.length >= 1, "new content drafts should include quiz checkpoints");
assert.ok(draftState.contentDrafts[0].sourceCards.length >= 1, "new content drafts should include source cards");
const oneVisualDraftState = createContentDraft(state, {
  subject: "ela",
  title: "Single Visual Repair Draft",
  objective: "Use a visual clue to explain a sentence meaning.",
  visualSupports: [
    {
      placement: "lesson-hero",
      title: "Context clue image",
      description: "A sentence with one highlighted clue.",
      prompt: "Create a context clue image.",
      altText: "A highlighted clue in a sentence."
    }
  ]
});
assert.ok(oneVisualDraftState.contentDrafts[0].visualSupports.length >= 2, "normalization should repair drafts that provide only one visual support");
assert.equal(getContentDraftCompletenessReview(oneVisualDraftState.contentDrafts[0]).passed, true, "a one-visual draft should pass lesson-body completeness after visual support repair");
const newDraftId = draftState.contentDrafts[0].id;
const reviewedDraftState = updateContentDraftStatus(draftState, newDraftId, "review");
assert.equal(reviewedDraftState.contentDrafts[0].status, "review", "draft status should update");
assert.ok(
  getAgentReviewQueue(reviewedDraftState).items.some((item) => item.type === "content" && item.ownerAgentId === "truth-policy"),
  "review-stage content drafts should enter the Truth And Fact-Check review queue"
);

const bodyGapDraftState = {
  ...state,
  contentDrafts: [
    {
      id: "draft-body-gap",
      status: "review",
      academyId: "foundation",
      grade: "3",
      subject: "science",
      title: "Raw Body Gap",
      objective: "Explain one observation with evidence.",
      standards: ["ngss"],
      reviewNotes: "Has metadata but no lesson body.",
      accessibilityNotes: "Use alt text and read-aloud support.",
      ageFitNotes: "Grade 3 explanation with short sentences.",
      evidenceMoves: {}
    }
  ]
};
const bodyGapPublish = updateContentDraftStatus(bodyGapDraftState, "draft-body-gap", "published");
assert.notEqual(bodyGapPublish.contentDrafts[0].status, "published", "draft without lesson body should not publish");
assert.match(bodyGapPublish.contentDrafts[0].blockedReason, /Lesson body is incomplete/i, "body block should explain missing lesson anatomy");

const incompleteMathDraftState = createContentDraft(state, {
  subject: "math",
  title: "Compare Fractions Draft",
  objective: "Compare fractions using a number line.",
  standards: ["ccss-math"],
  evidenceMoves: {
    priorKnowledgeCheck: "Ask learners to place 1/2 before instruction."
  }
});
const incompleteMathDraft = incompleteMathDraftState.contentDrafts[0];
const incompleteMathAudit = getDraftEvidenceAudit(incompleteMathDraft);
assert.equal(incompleteMathAudit.passed, false, "incomplete math draft should fail evidence audit");
const blockedPublishState = updateContentDraftStatus(incompleteMathDraftState, incompleteMathDraft.id, "published");
assert.notEqual(blockedPublishState.contentDrafts[0].status, "published", "incomplete math draft should not publish");
assert.equal(blockedPublishState.contentDrafts[0].publicationBlocked, true, "incomplete math draft should record publication block");

const completeEvidenceMoves = Object.fromEntries(
  evidenceGuidanceAudit.requiredMathLessonMoves.map((move) => [move.key, `${move.label} implementation detail.`])
);

function batchQa(overrides = {}) {
  return {
    visual: {
      type: "lesson-image",
      title: "Learning visual",
      caption: "A clear educational image connected to the lesson objective.",
      altText: "Accessible description of the learning visual."
    },
    accessibilityNotes: "Use readable contrast, alt text, labels, and an offline option.",
    ageFitNotes: "Tasks match the learner grade band and avoid babyish or overly adult language.",
    readability: {
      band: "foundation",
      vocabularyLevel: "Grade 3 vocabulary with direct support",
      maxSentenceWords: 14,
      supportNotes: "Use short sentences, repeated terms, and visual cues."
    },
    ...overrides
  };
}

const baselinePublishedLessonTotal = getPublishedLessonSummary(state).total;
const completeMathDraftState = createContentDraft(state, {
  subject: "math",
  title: "Equivalent Fractions Evidence Draft",
  objective: "Explain equivalent fractions with strips and number lines.",
  standards: ["ccss-math"],
  accessibilityNotes: "Use readable labels, alt text, and a tactile fraction strip option.",
  ageFitNotes: "Grade 3 learners build with strips before writing a short explanation.",
  evidenceMoves: completeEvidenceMoves
});
const completeMathDraft = completeMathDraftState.contentDrafts[0];
assert.equal(getDraftEvidenceAudit(completeMathDraft).passed, true, "complete math draft should pass evidence audit");
assert.equal(getContentDraftTruthReview(completeMathDraft).requiresHumanReview, true, "complete drafts should still require truth-policy approval before publishing");
const truthBlockedMathDraftState = updateContentDraftStatus(completeMathDraftState, completeMathDraft.id, "published");
assert.notEqual(truthBlockedMathDraftState.contentDrafts[0].status, "published", "complete math draft should not publish without truth approval");
assert.match(truthBlockedMathDraftState.contentDrafts[0].blockedReason, /Truth And Fact-Check approval/i, "truth block should explain review requirement");
const reviewReadyMathDraftState = updateContentDraftStatus(completeMathDraftState, completeMathDraft.id, "review");
const contentReviewDossier = getManagerReviewDossier(reviewReadyMathDraftState, `content:${completeMathDraft.id}`);
assert.equal(contentReviewDossier.found, true, "manager review dossier should resolve content review items");
assert.equal(contentReviewDossier.artifactType, "content", "manager review dossier should identify content artifact type");
assert.ok(contentReviewDossier.reviewChecklist.some((item) => /Truth policy/i.test(item)), "manager content dossier should show truth-policy gate status");
assert.match(contentReviewDossier.publishImpact, /publication/i, "manager content dossier should explain publication impact");
assert.ok(contentReviewDossier.issues.some((issue) => /Truth/i.test(issue)), "manager content dossier should show unresolved truth review issues before approval");
const approvedMathDraftState = resolveAgentReviewItem(reviewReadyMathDraftState, `content:${completeMathDraft.id}`, "approve");
assert.equal(approvedMathDraftState.state.contentDrafts[0].status, "published", "manager content approval should publish after truth review");
assert.equal(approvedMathDraftState.state.contentDrafts[0].truthReviewStatus, "approved", "manager content approval should store truth approval");
assert.equal(approvedMathDraftState.state.contentDrafts[0].publicationBlocked, false, "approved math draft should clear publication block");
assert.equal(approvedMathDraftState.state.contentDrafts[0].latestReview.artifactType, "lesson", "published content should retain the lesson quality review");
assert.ok(approvedMathDraftState.state.contentDrafts[0].reviewHistory.length >= 1, "published content should retain review history");
assert.equal(
  getPublishedLessonSummary(approvedMathDraftState.state).total,
  baselinePublishedLessonTotal + 1,
  "manager content approval should create one new published lesson record"
);
assert.equal(approvedMathDraftState.state.publishedLessons[0].sourceDraftId, completeMathDraft.id, "published lesson should link back to source draft");
assert.ok(approvedMathDraftState.state.publishedLessons[0].sections.teach, "published lesson should include direct instruction");
assert.ok(approvedMathDraftState.state.publishedLessons[0].teachingSupport.commonMisunderstandings.length >= 1, "published lesson should preserve misconception repair");
assert.ok(approvedMathDraftState.state.publishedLessons[0].visualSupports.length >= 2, "published lesson should preserve visual supports");
assert.ok(approvedMathDraftState.state.publishedLessons[0].quiz.length >= 1, "published lesson should preserve quiz checkpoints");
const publishedLesson = approvedMathDraftState.state.publishedLessons[0];
assert.ok(getLessonCatalog(approvedMathDraftState.state).some((item) => item.id === publishedLesson.id), "lesson catalog should include published lessons");
assert.equal(findLessonInState(approvedMathDraftState.state, publishedLesson.id).title, publishedLesson.title, "state-aware lookup should find a published lesson");
assert.ok(getTodayPlan(approvedMathDraftState.state).some((item) => item.id === publishedLesson.id && item.catalogSource === "published"), "daily path should include published lessons");
assert.equal(getLessonTeachingSupport(publishedLesson.id, approvedMathDraftState.state).summary, publishedLesson.studentSummary, "published lesson support should use the published student summary");
assert.equal(getLessonEvidenceAudit(publishedLesson.id, approvedMathDraftState.state).passed, true, "published math lesson should remain evidence-audit ready");
const publishedQuizState = completeLessonQuiz(approvedMathDraftState.state, publishedLesson.id, { [publishedLesson.quiz[0].id]: 0 });
assert.ok(publishedQuizState.quizResults[publishedLesson.id], "published lesson quiz should be completable");
assert.ok(publishedQuizState.mastery[publishedLesson.id], "published lesson mastery should be recorded");
const publishedQuizProjection = getPlatformSeedProjection(publishedQuizState);
assert.ok(
  publishedQuizProjection.tables.quiz_attempts.some((row) => row.quiz_id === `${publishedLesson.id}-quiz`),
  "published lesson quiz attempts should project into normalized quiz attempts"
);
assert.ok(
  publishedQuizProjection.tables.lesson_progress.some((row) => row.lesson_id === publishedLesson.id),
  "published lesson progress should project into normalized lesson progress"
);
assert.ok(
  publishedQuizProjection.tables.mastery_records.some((row) => row.lesson_id === publishedLesson.id),
  "published lesson mastery should project into normalized mastery records"
);
const publishedRepository = createStateRepository({ root: `${process.env.TEMP || "C:\\tmp"}\\k12-learning-published-repository-test`, env: {} });
await publishedRepository.writeState(publishedQuizState);
const publishedRepositoryCatalog = await publishedRepository.readLearningCatalog({ learnerId: "avery" });
assert.ok(
  publishedRepositoryCatalog.lessons.some((item) => item.id === publishedLesson.id && item.catalogSource === "published" && item.progress && item.mastery && item.latestAttempt),
  "repository learning catalog should read published lesson progress, mastery, and latest attempt"
);
const approvedProjection = getPlatformSeedProjection(approvedMathDraftState.state);
const publishedLessonRow = approvedProjection.tables.lessons.find((row) => row.id === approvedMathDraftState.state.publishedLessons[0].id);
assert.ok(publishedLessonRow, "published lesson should project into production lessons table");
assert.equal(publishedLessonRow.status, "published", "published lesson row should have published status");
assert.ok(
  approvedProjection.tables.activities.some((row) => row.lesson_id === publishedLessonRow.id && row.activity_type === "visual_support"),
  "published lesson should project visual supports into activities"
);
assert.ok(
  approvedProjection.tables.quiz_questions.some((row) => row.quiz_id === `${publishedLessonRow.id}-quiz`),
  "published lesson should project quiz questions"
);
const unpublishedAgainState = updateContentDraftStatus(approvedMathDraftState.state, completeMathDraft.id, "review");
assert.equal(
  getPublishedLessonSummary(unpublishedAgainState).total,
  baselinePublishedLessonTotal,
  "moving a published draft back to review should remove the new published lesson record"
);

const emptyBatchValidation = validateLessonBatch({ lessons: [] });
assert.equal(emptyBatchValidation.accepted, false, "empty batch should be rejected");
assert.ok(emptyBatchValidation.errors.some((error) => error.path === "lessons"), "empty batch should explain missing lessons");

const invalidBatch = {
  lessons: [
    {
      title: "Generated Fraction Lesson Missing Evidence",
      grade: "3",
      subject: "math",
      unitTitle: "Fractions",
      objective: "Compare fractions on a number line.",
      standards: ["ccss-math"],
      ...batchQa(),
      evidenceMoves: {
        priorKnowledgeCheck: "Ask what learners already know about halves."
      }
    }
  ]
};
const invalidBatchValidation = validateLessonBatch(invalidBatch);
assert.equal(invalidBatchValidation.accepted, false, "math batch missing evidence moves should be rejected");
const rejectedBatchImport = importLessonBatch(state, invalidBatch);
assert.equal(rejectedBatchImport.result.imported, 0, "rejected batch should import zero lessons");
assert.equal(rejectedBatchImport.state.contentDrafts.length, state.contentDrafts.length, "rejected batch should not create drafts");
assert.equal(rejectedBatchImport.state.contentImportJobs[0].status, "rejected", "rejected batch should record rejected import job");

const missingQaBatch = {
  lessons: [
    {
      title: "Generated Lesson Missing QA",
      grade: "3",
      subject: "science",
      unitTitle: "Ecosystems",
      objective: "Explain one ecosystem relationship.",
      standards: ["ngss"]
    }
  ]
};
const missingQaValidation = validateLessonBatch(missingQaBatch);
assert.equal(missingQaValidation.accepted, false, "batch missing media/accessibility/readability QA should be rejected");
for (const path of ["lessons[0].visual.title", "lessons[0].visual.altText", "lessons[0].accessibilityNotes", "lessons[0].ageFitNotes", "lessons[0].readability.vocabularyLevel"]) {
  assert.ok(missingQaValidation.errors.some((error) => error.path === path), `missing QA batch should report ${path}`);
}

const duplicateBatch = {
  lessons: [
    {
      title: "Generated Duplicate",
      grade: "3",
      subject: "science",
      unitTitle: "Ecosystems",
      objective: "Explain one ecosystem relationship.",
      standards: ["ngss"],
      ...batchQa()
    },
    {
      title: "Generated Duplicate",
      grade: "3",
      subject: "science",
      unitTitle: "Ecosystems",
      objective: "Use evidence for one ecosystem relationship.",
      standards: ["ngss"],
      ...batchQa()
    }
  ]
};
assert.equal(validateLessonBatch(duplicateBatch).accepted, false, "duplicate lesson keys should be rejected");

const validBatch = {
  lessons: [
    {
      title: "Generated Equivalent Fractions",
      grade: "3",
      subject: "math",
      unitTitle: "Fractions",
      objective: "Explain equivalent fractions using a number line.",
      standards: ["ccss-math"],
      ...batchQa(),
      evidenceMoves: completeEvidenceMoves
    },
    {
      title: "Generated Ecosystem Claim",
      grade: "3",
      subject: "science",
      unitTitle: "Ecosystems",
      objective: "Use evidence to explain one ecosystem relationship.",
      standards: ["ngss"],
      ...batchQa()
    }
  ]
};
const validBatchValidation = validateLessonBatch(validBatch);
assert.equal(validBatchValidation.accepted, true, "valid batch should pass validation");
const baselineVisualSummary = getVisualAssetSummary(state);
const baselineGeneratedSvg = (state.visualAssets || []).filter((asset) => asset.assetKind === "generated-svg").length;
const baselineLinkedDrafts = (state.visualAssets || []).filter((asset) => asset.draftId).length;
const acceptedBatchImport = importLessonBatch(state, validBatch);
assert.equal(acceptedBatchImport.result.imported, 2, "valid batch should import every lesson");
assert.equal(acceptedBatchImport.state.contentDrafts.length, state.contentDrafts.length + 2, "valid batch should create draft records");
assert.equal(acceptedBatchImport.state.contentImportJobs[0].status, "imported", "valid batch should record imported job");
assert.equal(getDraftEvidenceAudit(acceptedBatchImport.state.contentDrafts[0]).passed, true, "imported math draft should preserve passing evidence audit");
assert.ok(acceptedBatchImport.state.contentDrafts[0].visual.altText, "imported draft should preserve visual alt text");
assert.ok(acceptedBatchImport.state.contentDrafts[0].accessibilityNotes, "imported draft should preserve accessibility notes");
assert.equal(getContentDraftCompletenessReview(acceptedBatchImport.state.contentDrafts[0]).passed, true, "imported draft should preserve or scaffold full lesson body");

const bridgeNativeLessonPaths = [
  "../content/bridge-academy/grade-6/computer-science/BA-G6-CS-U1-L1_DEBUGGING_AN_ALGORITHM.json",
  "../content/bridge-academy/grade-6/ela/BA-G6-ELA-U2-L1_THEME_AND_TEXT_EVIDENCE.json",
  "../content/bridge-academy/grade-6/math/BA-G6-MATH-U1-L1_UNDERSTANDING_RATIOS.json",
  "../content/bridge-academy/grade-6/science/BA-G6-SCI-U2-L1_WATER_CYCLE_SYSTEMS.json",
  "../content/bridge-academy/grade-6/social-studies/BA-G6-SS-U2-L1_ANCIENT_CIVILIZATIONS_AND_GEOGRAPHY.json"
];
const bridgeNativeBatch = {
  sourceBatchId: "bridge-academy-grade-6-native-batch-1",
  lessons: bridgeNativeLessonPaths.map((file) => JSON.parse(readFileSync(new URL(file, import.meta.url), "utf8")))
};
const bridgeNativeValidation = validateLessonBatch(bridgeNativeBatch);
assert.equal(bridgeNativeValidation.accepted, true, "native Bridge Grade 6 batch should pass the compatibility adapter and quality gate");
assert.deepEqual(
  bridgeNativeValidation.lessons.map((lesson) => lesson.subject).sort(),
  ["computer-science", "ela", "math", "science", "social-studies"],
  "native Bridge batch should normalize source subject labels"
);
assert.ok(bridgeNativeValidation.lessons.every((lesson) => lesson.quizQuestions.length >= 10), "native Bridge lessons should preserve their quiz banks");
assert.ok(bridgeNativeValidation.lessons.every((lesson) => lesson.visualSupports.length >= 3), "native Bridge lessons should receive hero, diagram, and tutor visuals");
assert.ok(bridgeNativeValidation.lessons.every((lesson) => lesson.groupHomework), "Bridge lessons should include structured group homework");
const bridgeNativeImport = importLessonBatch(state, bridgeNativeBatch);
assert.equal(bridgeNativeImport.result.imported, 5, "native Bridge batch should create five reviewable drafts");
assert.equal(bridgeNativeImport.state.contentDrafts[0].sourceBatchId, bridgeNativeBatch.sourceBatchId, "native batch id should be stable for review and publication");
assert.ok(
  bridgeNativeImport.state.contentDrafts.filter((draft) => draft.sourceBatchId === bridgeNativeBatch.sourceBatchId).every((draft) => draft.sourceLessonId),
  "native drafts should retain source lesson ids"
);
const nativeBatchReviewItem = getAgentReviewQueue(bridgeNativeImport.state).items.find((item) => item.id === `batch:${bridgeNativeBatch.sourceBatchId}`);
assert.ok(nativeBatchReviewItem, "native imported batches should appear in the manager review queue");
assert.equal(nativeBatchReviewItem.type, "batch", "native imported batch review should use the batch workflow");
assert.equal(nativeBatchReviewItem.grade, "A", "native Bridge batch should reach the A quality grade after source-field adaptation");
assert.equal(nativeBatchReviewItem.passed, true, "native Bridge batch should clear the B/80 batch gate");
assert.equal(getManagerReviewDossier(bridgeNativeImport.state, nativeBatchReviewItem.id).found, true, "native imported batches should have a manager dossier");
const nativeBatchProjection = getPlatformSeedProjection(bridgeNativeImport.state);
const nativeBatchProjectionRow = nativeBatchProjection.tables.content_batch_reviews.find((row) => row.source_batch_id === bridgeNativeBatch.sourceBatchId);
assert.ok(nativeBatchProjectionRow, "native imported batches should be represented in the normalized content batch review projection");
assert.equal(nativeBatchProjectionRow.total_lessons, 5, "normalized native batch review should preserve the imported lesson count");
assert.equal(nativeBatchProjectionRow.grade, "A", "normalized native batch review should use the grader-backed A quality grade");
assert.equal(nativeBatchProjectionRow.passed, true, "normalized native batch review should preserve the batch quality gate result");
assert.ok(
  nativeBatchProjection.tables.agent_review_items.some((row) => row.source_type === "batch" && row.source_id === bridgeNativeBatch.sourceBatchId),
  "normalized native batch projection should create a pending manager review item"
);
const approvedNativeBatch = resolveAgentReviewItem(bridgeNativeImport.state, nativeBatchReviewItem.id, "approve");
assert.equal(approvedNativeBatch.result.accepted, true, "manager should be able to approve a native imported batch");
assert.equal(approvedNativeBatch.result.affectedDrafts, 5, "native batch approval should update every imported draft");
assert.ok(
  approvedNativeBatch.state.contentDrafts.filter((draft) => draft.sourceBatchId === bridgeNativeBatch.sourceBatchId).every((draft) => draft.batchReviewStatus === "approved"),
  "native batch approval should stamp every draft with the batch decision"
);
const reimportedNativeBatch = importLessonBatch(bridgeNativeImport.state, bridgeNativeBatch);
assert.equal(
  reimportedNativeBatch.state.contentDrafts.filter((draft) => draft.sourceBatchId === bridgeNativeBatch.sourceBatchId).length,
  5,
  "re-importing a deterministic native batch should replace its drafts instead of duplicating them"
);
for (const draft of bridgeNativeImport.state.contentDrafts.filter((item) => item.sourceBatchId === bridgeNativeBatch.sourceBatchId)) {
  const publishedNativeLesson = createPublishedLessonFromDraft(draft, { publishedBy: "quality-gate" });
  const nativeLessonValidation = validateNexusLessonV3(publishedNativeLesson);
  assert.equal(nativeLessonValidation.passed, true, `${draft.title} should remain V3-valid after draft publication projection`);
  assert.deepEqual(
    getRenderableNexusPhaseModules(publishedNativeLesson).map((module) => module.phase),
    publishedNativeLesson.activePhases,
    `${draft.title} published phase modules should follow activePhases order`
  );
}
assert.ok(acceptedBatchImport.state.contentDrafts[0].visualSupports.length >= 2, "imported draft should include visual supports");
assert.ok(acceptedBatchImport.state.contentDrafts[0].sourceCards.length >= 1, "imported draft should include source cards");
assert.equal(getVisualAssetSummary(acceptedBatchImport.state).total, baselineVisualSummary.total + 2, "valid batch should create visual asset records");
assert.equal(getVisualAssetSummary(acceptedBatchImport.state).review, baselineVisualSummary.review + 2, "generated visual assets should start in review");
const importedMathDraft = acceptedBatchImport.state.contentDrafts[0];
const importedVisualAsset = getDraftVisualAsset(acceptedBatchImport.state, importedMathDraft);
assert.ok(importedVisualAsset.svg.includes("<svg"), "generated visual asset should include SVG markup");
assert.equal(importedVisualAsset.status, "review", "generated visual asset should require review");
const batchVisualRepository = createStateRepository({ root: `${process.env.TEMP || "C:\\tmp"}\\k12-learning-batch-visual-repository-test`, env: {} });
await batchVisualRepository.writeState(acceptedBatchImport.state);
const batchRepositoryVisualAssets = await batchVisualRepository.readVisualAssets();
assert.equal(batchRepositoryVisualAssets.summary.generatedSvg, baselineGeneratedSvg + 2, "visual asset read model should count generated SVG assets");
assert.equal(batchRepositoryVisualAssets.summary.linkedDrafts, baselineLinkedDrafts + 2, "visual asset read model should count draft-linked assets");
assert.ok(
  batchRepositoryVisualAssets.assets.every((asset) => asset.assetUrl.startsWith("data:image/svg+xml")),
  "generated SVG visual assets should project as previewable data-image URLs"
);
const invalidReplacement = validateVisualAssetReplacement({ assetUrl: "ftp://example.com/image.png", altText: "", caption: "", license: "", credit: "" });
assert.equal(invalidReplacement.accepted, false, "invalid visual replacement should be rejected");
assert.ok(invalidReplacement.errors.some((error) => error.path === "assetUrl"), "invalid replacement should report URL error");
const replacedVisualState = replaceVisualAsset(acceptedBatchImport.state, importedVisualAsset.id, {
  assetUrl: "https://example.com/fraction-number-line.png",
  altText: "External image showing one half and two fourths at the same point.",
  caption: "Reviewer-approved equivalent fraction number line.",
  license: "Internal licensed asset",
  credit: "Curriculum design team"
});
const replacedVisualAsset = getDraftVisualAsset(replacedVisualState.state, importedMathDraft);
assert.equal(replacedVisualState.result.replaced, true, "valid replacement should update the visual asset");
assert.equal(replacedVisualAsset.assetKind, "external-url", "replacement should switch asset kind");
assert.equal(replacedVisualAsset.status, "review", "replacement should return asset to review");
assert.equal(replacedVisualAsset.assetUrl, "https://example.com/fraction-number-line.png", "replacement should store external URL");
const visualBlockedPublish = updateContentDraftStatus(acceptedBatchImport.state, importedMathDraft.id, "published");
assert.notEqual(visualBlockedPublish.contentDrafts[0].status, "published", "draft with unapproved visual asset should not publish");
assert.match(visualBlockedPublish.contentDrafts[0].blockedReason, /Visual asset must be approved/i, "visual block should explain approval requirement");
const approvedVisualState = updateVisualAssetStatus(acceptedBatchImport.state, importedVisualAsset.id, "approved");
assert.equal(getVisualAssetSummary(approvedVisualState).approved, baselineVisualSummary.approved + 1, "asset approval should update visual summary");
const truthBlockedAfterVisualApproval = updateContentDraftStatus(approvedVisualState, importedMathDraft.id, "published");
assert.notEqual(truthBlockedAfterVisualApproval.contentDrafts[0].status, "published", "approved visual asset alone should not bypass truth review");
assert.match(truthBlockedAfterVisualApproval.contentDrafts[0].blockedReason, /Truth And Fact-Check approval/i, "truth block should remain after visual approval");
const importedReviewReadyState = updateContentDraftStatus(approvedVisualState, importedMathDraft.id, "review");
const publishAfterManagerApproval = resolveAgentReviewItem(importedReviewReadyState, `content:${importedMathDraft.id}`, "approve");
assert.equal(publishAfterManagerApproval.state.contentDrafts[0].status, "published", "approved visual asset plus manager truth approval should allow publish");

const imbalancedStandardsBatch = {
  lessons: [1, 2, 3].map((index) => ({
    title: `Generated Ecosystem Balance ${index}`,
    grade: "3",
    subject: "science",
    unitTitle: "Ecosystems",
    objective: `Explain ecosystem relationship ${index}.`,
    standards: ["ngss"],
    ...batchQa()
  }))
};
const imbalancedStandardsValidation = validateLessonBatch(imbalancedStandardsBatch);
assert.equal(imbalancedStandardsValidation.accepted, true, "standards imbalance should warn without blocking");
assert.ok(imbalancedStandardsValidation.warnings.some((warning) => warning.path === "lessons.standards"), "standards imbalance should emit a warning");

const merged = mergePersistedState(state, { contentDrafts: reviewedDraftState.contentDrafts, persistedAt: "test" });
assert.equal(merged.persistence.source, "server-repository", "merged persisted state should record server repository source");

const onboarding = getOnboardingStatus(state);
assert.equal(onboarding.percent, 100, "demo onboarding should be ready");
assert.equal(getConsentReadiness(state).ready, true, "demo learners should have required consent");
assert.equal(getLearnerAccess(state, "avery").active, true, "consented and placed learner should have active access");
assert.equal(getPlacementPlan(state).length, state.learners.length, "placement plan should cover every learner");
assert.ok(getRewardPlan(state).selected.length >= 3, "reward plan should include selected reward configs");
assert.equal(getRewardPlan(state).approvalSummary.pending, 0, "fresh reward plan should include approval summary counts");

const blockedState = {
  ...state,
  consentRecords: {
    ...state.consentRecords,
    avery: {
      ...state.consentRecords.avery,
      dataCollection: false
    }
  }
};
assert.equal(getLearnerAccess(blockedState, "avery").active, false, "missing consent should block learner access");

const placementState = simulateDiagnosticPlacement(state, "avery");
assert.ok(placementState.placementResults.avery.confidence >= 80, "diagnostic simulation should update placement confidence");

const benefitState = addFamilyBenefit(state, "Choose the weekend build");
assert.ok(benefitState.rewardSettings.familyBenefits.includes("Choose the weekend build"), "parent can add a family benefit");
const firstRewardRequest = requestRewardApproval(state, { learnerId: "avery", rewardLevel: 1, requestedBy: "Avery" });
assert.equal(firstRewardRequest.result.accepted, true, "student should be able to claim an unlocked level-one reward");
assert.equal(firstRewardRequest.result.request.status, "approved", "non-parent reward should auto-approve but still create a record");
assert.equal(getRewardApprovalQueue(firstRewardRequest.state, "avery").length, 1, "reward queue should expose learner reward requests");
const richRewardState = {
  ...state,
  masteryBenefits: Array.from({ length: 25 }, (_, index) => ({
    id: `benefit-test-${index}`,
    learnerId: "avery",
    lessonId: lesson.id,
    type: "test_benefit",
    title: `Test benefit ${index}`,
    unlockedAt: "2026-06-10",
    source: "Test XP setup"
  }))
};
const parentRewardRequest = requestRewardApproval(richRewardState, { learnerId: "avery", rewardLevel: 5, requestedBy: "Avery" });
assert.equal(parentRewardRequest.result.request.status, "pending", "gift-card style rewards should wait for parent approval");
const approvedReward = updateRewardApprovalStatus(parentRewardRequest.state, {
  requestId: parentRewardRequest.result.request.id,
  status: "approved",
  reviewedBy: "Local Parent"
});
assert.equal(approvedReward.result.request.status, "approved", "parent should be able to approve a reward");
assert.equal(isGiftCardRewardRequest(approvedReward.result.request), true, "level-five reward should be classified as a gift-card style reward");
assert.equal(getGiftCardFulfillmentReadiness({}).ready, false, "gift-card fulfillment should be disabled by default");
const blockedGiftCardPlan = createGiftCardFulfillmentPlan({
  request: approvedReward.result.request,
  state: approvedReward.state,
  env: {},
  recipientEmail: "parent@example.test",
  recipientName: "Local Parent"
});
assert.equal(blockedGiftCardPlan.accepted, false, "gift-card fulfillment should block without explicit configuration");
const budgetBlockedGiftCardPlan = createGiftCardFulfillmentPlan({
  request: approvedReward.result.request,
  state: {
    ...approvedReward.state,
    rewardApprovals: [
      ...(approvedReward.state.rewardApprovals || []),
      { id: "prior-gift-card", fulfillment: { status: "fulfilled", amountCents: 600, requestedAt: new Date().toISOString() } }
    ]
  },
  env: {
    GIFT_CARD_FULFILLMENT_ENABLED: "true",
    GIFT_CARD_PROVIDER: "manual",
    GIFT_CARD_DEFAULT_CENTS: "500",
    GIFT_CARD_MAX_CENTS: "1000",
    GIFT_CARD_DAILY_BUDGET_CENTS: "1000"
  },
  recipientEmail: "parent@example.test",
  recipientName: "Local Parent"
});
assert.equal(budgetBlockedGiftCardPlan.accepted, false, "gift-card fulfillment should block when cumulative daily budget would be exceeded");
assert.match(budgetBlockedGiftCardPlan.blockers.join(" "), /daily gift-card budget/i, "budget blocker should explain the cumulative spend limit");
const manualGiftCard = await fulfillGiftCardReward({
  request: approvedReward.result.request,
  state: approvedReward.state,
  env: {
    GIFT_CARD_FULFILLMENT_ENABLED: "true",
    GIFT_CARD_PROVIDER: "manual",
    GIFT_CARD_MAX_CENTS: "1000"
  },
  recipientEmail: "parent@example.test",
  recipientName: "Local Parent"
});
assert.equal(manualGiftCard.accepted, true, "manual gift-card fulfillment should pass when explicitly enabled");
assert.equal(manualGiftCard.manualReview, true, "manual gift-card fulfillment should be marked as manual review");
const fulfilledGiftCard = recordRewardFulfillmentResult(approvedReward.state, {
  requestId: approvedReward.result.request.id,
  fulfilled: manualGiftCard.fulfilled,
  provider: manualGiftCard.provider,
  providerReference: manualGiftCard.providerReference,
  deliveryStatus: manualGiftCard.deliveryStatus,
  manualReview: manualGiftCard.manualReview,
  amountCents: manualGiftCard.plan.amountCents,
  currencyCode: manualGiftCard.plan.currencyCode,
  recipientEmail: manualGiftCard.plan.recipientEmail,
  recipientName: manualGiftCard.plan.recipientName,
  requestedBy: "Local Parent",
  reviewedBy: "Local Parent"
});
assert.equal(fulfilledGiftCard.result.request.status, "redeemed", "fulfilled gift-card reward should become redeemed");
assert.equal(fulfilledGiftCard.result.request.fulfillment.provider, "manual", "fulfilled gift-card should store provider status");
assert.ok(
  fulfilledGiftCard.state.masteryBenefits.some((benefit) => benefit.type === "gift_card_reward" && benefit.learnerId === "avery"),
  "fulfilled gift card should become mastery benefit evidence"
);
let tremendousPayloadSeen = null;
const tremendousGiftCard = await fulfillGiftCardReward({
  request: approvedReward.result.request,
  state: approvedReward.state,
  env: {
    GIFT_CARD_FULFILLMENT_ENABLED: "true",
    GIFT_CARD_PROVIDER: "tremendous",
    TREMENDOUS_API_KEY: "test-tremendous-key",
    TREMENDOUS_FUNDING_SOURCE_ID: "funding-source-test",
    TREMENDOUS_PRODUCT_ID: "product-test",
    GIFT_CARD_MAX_CENTS: "1000"
  },
  recipientEmail: "parent@example.test",
  recipientName: "Local Parent",
  fetchImpl: async (url, options) => {
    tremendousPayloadSeen = { url, body: JSON.parse(options.body), authorization: options.headers.Authorization };
    return {
      ok: true,
      status: 200,
      json: async () => ({ order: { id: "order-test-1", status: "SUBMITTED" } })
    };
  }
});
assert.equal(tremendousGiftCard.accepted, true, "configured external gift-card provider should submit fulfillment");
assert.equal(tremendousGiftCard.providerReference, "order-test-1", "provider fulfillment should store provider order reference");
assert.equal(tremendousPayloadSeen.body.payment.funding_source_id, "funding-source-test", "provider payload should include funding source");
assert.equal(tremendousPayloadSeen.body.rewards[0].recipient.email, "parent@example.test", "provider payload should deliver only to parent recipient email");
const redeemedReward = updateRewardApprovalStatus(approvedReward.state, {
  requestId: parentRewardRequest.result.request.id,
  status: "redeemed",
  reviewedBy: "Local Parent"
});
assert.ok(
  redeemedReward.state.masteryBenefits.some((benefit) => benefit.type === "parent_approved_reward" && benefit.learnerId === "avery"),
  "redeemed parent reward should become mastery benefit evidence"
);
assert.ok(
  redeemedReward.state.learningEvents.some((event) => event.type === "reward_redeemed"),
  "redeemed reward should log a learning event"
);
const rewardProjection = getPlatformSeedProjection(redeemedReward.state);
assert.ok(
  rewardProjection.tables.reward_approvals.some((row) => row.id === parentRewardRequest.result.request.id && row.status === "redeemed"),
  "reward approval requests should project into normalized reward_approvals rows"
);
const fulfilledRewardProjection = getPlatformSeedProjection(fulfilledGiftCard.state);
assert.ok(
  fulfilledRewardProjection.tables.reward_approvals.some(
    (row) =>
      row.id === parentRewardRequest.result.request.id &&
      row.fulfillment_provider === "manual" &&
      row.fulfillment_status === "manual-review" &&
      row.fulfillment_reference
  ),
  "gift-card fulfillment details should project into normalized reward_approvals rows"
);

assert.equal(getRecallInterval(60).intervalDays, 1, "low mastery should schedule fast reteach");
assert.equal(getRecallInterval(88).intervalDays, 3, "stable mastery should schedule spaced recall");
assert.equal(getRecallInterval(98).intervalDays, 7, "strong mastery should schedule longer interval recall");

state = completeLessonQuiz(state, lesson.id, perfectAnswers);
assert.equal(state.mastery[lesson.id].status, "Mastered", "passing quiz should update mastery");
assert.equal(getParentSummary(state).mastered >= 1, true, "parent summary should reflect mastery");
assert.ok(state.learningEvents.some((event) => event.type === "quiz_completed"), "quiz completion should log a learning event");
assert.ok(
  state.retentionSchedules.some((recall) => recall.lessonId === lesson.id && recall.currentMastery === 100),
  "quiz completion should schedule recall from current mastery"
);
const averyLevelProfile = getLearnerLevelProfile(state, "avery");
assert.ok(averyLevelProfile.totalXp >= lesson.xp, "quiz completion should increase learner XP from lesson evidence");
assert.ok(averyLevelProfile.progressPercent >= 0, "level profile should include progress toward the next level");
const averySubjectProgress = getLearnerSubjectProgress(state, "avery");
assert.ok(averySubjectProgress.some((subject) => subject.subject === "math" && subject.subjectXp > 0), "subject progress should include math XP");
const engagementNow = new Date("2026-07-19T12:00:00.000Z");
let engagementState = {
  ...state,
  learningEvents: [
    { id: "engagement-start", learnerId: "avery", lessonId: lesson.id, type: "lesson_started", occurredAt: "2026-07-19T09:00:00.000Z", value: {} },
    { id: "engagement-widget", learnerId: "avery", lessonId: lesson.id, type: "interactive_widget_attempted", occurredAt: "2026-07-19T09:05:00.000Z", value: { correct: true } },
    { id: "engagement-yesterday", learnerId: "avery", lessonId: lesson.id, type: "lesson_started", occurredAt: "2026-07-18T09:00:00.000Z", value: {} },
    ...(state.learningEvents || [])
  ]
};
const engagement = getStudentEngagementProfile(engagementState, "avery", engagementNow);
assert.equal(engagement.streak >= 2, true, "engagement profile should calculate consecutive learning days");
assert.equal(engagement.completedMissions >= 2, true, "engagement profile should convert learning evidence into cleared missions");
assert.equal(engagement.nextMission.id, "tutor", "engagement profile should prioritize the next evidence-producing mission");
const duplicateEngagement = recordStudentEngagementAction(engagementState, {
  learnerId: "avery",
  lessonId: lesson.id,
  type: "lesson_started",
  value: { source: "mission-board" }
});
assert.equal(duplicateEngagement.learningEvents.length, engagementState.learningEvents.length, "daily engagement actions should not award duplicate start evidence");
const phaseStarted = recordStudentEngagementAction(engagementState, {
  learnerId: "avery",
  lessonId: lesson.id,
  type: "phase_completed",
  value: { phase: "model", source: "nexus-phase-player" }
});
assert.equal(phaseStarted.learningEvents[0].type, "phase_completed", "Nexus phase completion should create learning evidence");
assert.equal(phaseStarted.learningEvents[0].value.phase, "model", "phase evidence should preserve the completed phase");
const duplicatePhase = recordStudentEngagementAction(phaseStarted, {
  learnerId: "avery",
  lessonId: lesson.id,
  type: "phase_completed",
  value: { phase: "model", source: "nexus-phase-player" }
});
assert.equal(duplicatePhase.learningEvents.length, phaseStarted.learningEvents.length, "a phase should not award duplicate same-day XP");
const secondPhase = recordStudentEngagementAction(duplicatePhase, {
  learnerId: "avery",
  lessonId: lesson.id,
  type: "phase_completed",
  value: { phase: "practice", source: "nexus-phase-player" }
});
assert.equal(secondPhase.learningEvents.length, duplicatePhase.learningEvents.length + 1, "different phases should each create evidence");
const phaseEvidenceRepository = createStateRepository({ root: `${process.env.TEMP || "C:\\tmp"}\\k12-learning-phase-catalog-test`, env: {} });
await phaseEvidenceRepository.writeState(secondPhase);
const phaseEvidenceCatalog = await phaseEvidenceRepository.readLearningCatalog({ learnerId: "avery" });
const phaseEvidenceLesson = phaseEvidenceCatalog.lessons.find((item) => item.id === lesson.id);
assert.deepEqual(
  phaseEvidenceLesson.phaseCompletions.map((item) => item.phase),
  ["practice", "model"],
  "learning catalog should hydrate scoped phase completion evidence"
);
assert.equal(phaseEvidenceLesson.completedPhaseCount, 2, "learning catalog should count unique completed phases");
assert.equal(phaseEvidenceCatalog.summary.withPhaseEvidence, 1, "learning catalog should summarize lessons with phase evidence");
const phaseMetadataOnlyCatalog = await phaseEvidenceRepository.readLearningCatalog({ learnerId: "avery", includeProgress: false });
const phaseMetadataOnlyLesson = phaseMetadataOnlyCatalog.lessons.find((item) => item.id === lesson.id);
assert.equal(phaseMetadataOnlyLesson.completedPhaseCount, 0, "metadata-only catalogs should omit phase evidence");

state = updateLessonScratchpad(state, {
  learnerId: "avery",
  lessonId: lesson.id,
  firstStep: "I put 0 and 1 first.",
  explanation: "I think 1/2 is the middle because the spaces are equal.",
  confusion: "I still mix up tick marks and spaces."
});
assert.match(getLessonScratchpad(state, "avery", lesson.id).confusion, /tick marks/, "scratchpad should persist student confusion");
assert.match(createScratchpadTutorPrompt(state, "avery", lesson.id), /My first try/, "scratchpad prompt should combine student work for tutor review");
state = markScratchpadTutorReviewed(state, "avery", lesson.id);
assert.equal(getLessonScratchpad(state, "avery", lesson.id).tutorReviewCount, 1, "scratchpad tutor review should be counted");
const scratchpadProjection = getPlatformSeedProjection(state);
const scratchpadRow = scratchpadProjection.tables.lesson_scratchpads.find((row) => row.student_id === "avery" && row.lesson_id === lesson.id);
assert.ok(scratchpadRow, "lesson scratchpad should project into normalized rows");
assert.match(scratchpadRow.confusion, /tick marks/, "normalized scratchpad row should preserve student confusion");
assert.equal(scratchpadRow.tutor_review_count, 1, "normalized scratchpad row should preserve tutor review count");
assert.ok(lessonScratchpadRepositoryTableIds.includes("lesson_scratchpads"), "scratchpad read model should declare lesson_scratchpads");
assert.ok(learningEvidenceRepositoryTableIds.includes("lesson_scratchpads"), "learning evidence slice should include lesson scratchpads");
const scratchpadRepository = createStateRepository({ root: `${process.env.TEMP || "C:\\tmp"}\\k12-learning-scratchpad-read-test`, env: {} });
await scratchpadRepository.writeState(state);
const repositoryScratchpads = await scratchpadRepository.readLessonScratchpads({ learnerId: "avery", lessonId: lesson.id });
assert.equal(repositoryScratchpads.source, "normalized-repository", "scratchpad read model should identify normalized repository source");
assert.equal(repositoryScratchpads.summary.total, 1, "scratchpad read model should count scoped student writing");
assert.equal(repositoryScratchpads.summary.tutorReviewed, 1, "scratchpad read model should count tutor-reviewed scratchpads");
assert.match(repositoryScratchpads.scratchpads[0].confusion, /tick marks/, "scratchpad read model should preserve confusion text");
assert.ok(assignmentRepositoryTableIds.includes("assignments"), "assignment read model should declare assignments");
assert.ok(retentionScheduleRepositoryTableIds.includes("retention_schedules"), "retention schedule read model should declare retention schedules");
const repositoryAssignments = await jsonRepository.readAssignments({ learnerId: "avery" });
assert.equal(repositoryAssignments.source, "normalized-repository", "assignment read model should identify normalized repository source");
assert.ok(repositoryAssignments.summary.total >= 1, "assignment read model should count scoped assignments");
assert.ok(repositoryAssignments.assignments.every((assignment) => assignment.learnerId === "avery"), "assignment read model should filter by learner");
const repositoryRetentionSchedules = await jsonRepository.readRetentionSchedules({ learnerId: "avery" });
assert.equal(repositoryRetentionSchedules.source, "normalized-repository", "retention schedule read model should identify normalized repository source");
assert.ok(repositoryRetentionSchedules.summary.total >= 1, "retention schedule read model should count scoped schedules");
assert.ok(repositoryRetentionSchedules.summary.due >= 1, "retention schedule read model should count due recall checks");
state = recordInteractiveResponse(state, {
  learnerId: "avery",
  lessonId: lesson.id,
  widgetId: "fraction-number-line-target",
  value: "1/2",
  correct: true,
  feedback: "Middle point."
});
assert.equal(getInteractiveResponse(state, "avery", lesson.id, "fraction-number-line-target").correct, true, "interactive response should persist correctness");
assert.ok(state.learningEvents.some((event) => event.type === "interactive_widget_attempted"), "interactive attempts should log learning evidence");
state = recordInteractiveResponse(state, {
  learnerId: "avery",
  lessonId: learningAiLesson.id,
  widgetId: "ai-builder-system-sort",
  value: "Login permission rule",
  correct: true,
  feedback: "Backend permission rule selected."
});
assert.equal(
  getInteractiveResponse(state, "avery", learningAiLesson.id, "ai-builder-system-sort").correct,
  true,
  "Learning AI builder system sort response should persist correctness"
);
const learningAiInteractiveEvidence = getLearnerInteractiveSkillEvidence(state, "avery", { lessonId: learningAiLesson.id });
assert.equal(learningAiInteractiveEvidence.total, 1, "Learning AI interaction should produce one skill evidence signal");
assert.equal(learningAiInteractiveEvidence.signals[0].skillId, "ai-builder-system-boundaries", "Learning AI interaction should identify the AI builder boundary skill");
assert.equal(learningAiInteractiveEvidence.signals[0].status, "secure", "correct Learning AI interaction should mark the skill secure");
assert.ok(
  state.learningEvents.some(
    (event) =>
      event.type === "interactive_widget_attempted" &&
      event.lessonId === learningAiLesson.id &&
      event.value?.skillEvidence?.skillId === "ai-builder-system-boundaries"
  ),
  "Learning AI interaction events should include skill evidence"
);
const averyLearningAiInsight = getHouseholdLearnerInsights(state, { learnerIds: ["avery"] })[0];
assert.ok(
  averyLearningAiInsight.interactiveSkillSignals.some((signal) => signal.skillId === "ai-builder-system-boundaries"),
  "parent insights should surface Learning AI interactive skill evidence"
);
const learningAiProjection = getPlatformSeedProjection(state);
const learningAiSkillEvidenceRow = learningAiProjection.tables.interactive_skill_evidence.find(
  (row) => row.lesson_id === learningAiLesson.id && row.skill_id === "ai-builder-system-boundaries"
);
assert.ok(learningAiSkillEvidenceRow, "Learning AI interactive skill evidence should project into normalized rows");
assert.equal(learningAiSkillEvidenceRow.correct, true, "Learning AI interactive evidence projection should preserve correctness");
assert.equal(learningAiSkillEvidenceRow.status, "secure", "Learning AI interactive evidence projection should preserve skill status");
const learningAiEvidencePlan = createNormalizedStateUpsertSql(state, learningEvidenceRepositoryTableIds);
assert.match(learningAiEvidencePlan.sql, /insert into public\."interactive_skill_evidence"/, "learning evidence SQL should upsert interactive skill evidence");
assert.match(learningAiEvidencePlan.sql, /ai-builder-system-boundaries/, "learning evidence SQL should include the Learning AI skill id");
const interactiveEvidenceRepository = createStateRepository({ root: `${process.env.TEMP || "C:\\tmp"}\\k12-learning-interactive-evidence-test`, env: {} });
await interactiveEvidenceRepository.writeState(state);
const learningAiRepositoryCatalog = await interactiveEvidenceRepository.readLearningCatalog({ learnerId: "avery" });
const learningAiCatalogLesson = learningAiRepositoryCatalog.lessons.find((item) => item.id === learningAiLesson.id);
assert.ok(learningAiCatalogLesson, "repository learning catalog should include the Learning AI lesson after interaction");
assert.equal(
  learningAiCatalogLesson.latestInteractiveSkillEvidence.skillId,
  "ai-builder-system-boundaries",
  "repository learning catalog should hydrate Learning AI interactive skill evidence"
);
assert.equal(
  learningAiCatalogLesson.latestInteractiveSkillEvidence.learnerId,
  "avery",
  "repository learning catalog should preserve the learner id for dashboard scoping"
);
assert.ok(learningAiRepositoryCatalog.summary.interactiveEvidenceSignals >= 1, "repository learning catalog should count interactive evidence signals");
const learningAiCatalogSignals = getLearningCatalogInteractiveSignals(learningAiRepositoryCatalog, {
  learnerId: "avery",
  lessonId: learningAiLesson.id
});
assert.equal(learningAiCatalogSignals.total, 1, "catalog signal helper should filter Learning AI evidence by learner and lesson");
assert.equal(learningAiCatalogSignals.secure, 1, "catalog signal helper should count secure Learning AI evidence");
assert.equal(learningAiCatalogSignals.latest.skillId, "ai-builder-system-boundaries", "catalog signal helper should expose the latest Learning AI skill");
assert.equal(learningAiCatalogSignals.latest.lessonTitle, learningAiLesson.title, "catalog signal helper should include lesson context");
const mixedLearnerCatalogSignals = getLearningCatalogInteractiveSignals(
  {
    lessons: [
      {
        id: learningAiLesson.id,
        title: learningAiLesson.title,
        interactiveSkillEvidence: [
          learningAiCatalogLesson.latestInteractiveSkillEvidence,
          {
            ...learningAiCatalogLesson.latestInteractiveSkillEvidence,
            id: "other-student-signal",
            learnerId: "maya",
            status: "needs-support",
            correct: false
          }
        ]
      }
    ]
  },
  { learnerId: "avery", lessonId: learningAiLesson.id }
);
assert.equal(mixedLearnerCatalogSignals.total, 1, "catalog signal helper should keep learner-scoped evidence isolated");
assert.equal(mixedLearnerCatalogSignals.needsSupport, 0, "catalog signal helper should not count another learner's support signal");
const mythologyDraftForWidget = createInitialState().contentDrafts.find((draft) => draft.id === "draft-next-wave-bridge-6-ela-u1-l1");
const mythologyPublishedForWidget = resolveAgentReviewItem(createInitialState(), `content:${mythologyDraftForWidget.id}`, "approve");
const mythologyLesson = mythologyPublishedForWidget.state.publishedLessons.find((item) => item.id === "published-draft-next-wave-bridge-6-ela-u1-l1");
assert.ok(mythologyLesson, "mythology lesson should publish before testing the decoder board response");
state = {
  ...state,
  publishedLessons: [mythologyLesson, ...(state.publishedLessons || []).filter((item) => item.id !== mythologyLesson.id)]
};
state = recordInteractiveResponse(state, {
  learnerId: "maya",
  lessonId: mythologyLesson.id,
  widgetId: "myth-decoder-board",
  value: "Pride can make people ignore danger",
  correct: true,
  feedback: "Theme claim selected."
});
const mythologyBoardResponse = getInteractiveResponse(state, "maya", mythologyLesson.id, "myth-decoder-board");
assert.equal(mythologyBoardResponse.correct, true, "myth decoder board response should persist correctness");
assert.equal(mythologyBoardResponse.value, "Pride can make people ignore danger", "myth decoder board should store the selected theme claim");
state = updateLessonScratchpad(state, {
  learnerId: "maya",
  lessonId: mythologyLesson.id,
  explanation: "My theme claim is that pride can make people ignore danger.",
  confusion: "I can retell the plot, but I do not know if my evidence proves the theme."
});
const mythologyTutorPrompt = createScratchpadTutorPrompt(state, "maya", mythologyLesson.id);
assert.match(mythologyTutorPrompt, /Myth Decoder Board choice/i, "mythology tutor prompt should include the board choice");
assert.match(mythologyTutorPrompt, /plot vs theme, symbol meaning, evidence, or claim wording/i, "mythology tutor prompt should route the stuck point categories");
assert.match(mythologyTutorPrompt, /do not know if my evidence proves the theme/i, "mythology tutor prompt should include the student's exact confusion");
const mythologyTutorResponse = createAiTutorResponse(mythologyTutorPrompt, mythologyLesson.id, "6-8", "diagnose", mythologyLesson);
assert.equal(mythologyTutorResponse.stuckPointCategoryId, "plot-vs-theme", "mythology tutor should classify plot/theme evidence confusion");
assert.match(mythologyTutorResponse.text, /Hint path/i, "mythology tutor should return a visible hint path");
assert.match(mythologyTutorResponse.nextStep, /detail from the myth/i, "mythology tutor should ask one targeted next question");
assert.doesNotMatch(mythologyTutorResponse.text, /final answer is|the answer is|just choose/i, "mythology tutor should not give the final answer");
const mythologyTutorTurn = askAiTutor(state, {
  input: mythologyTutorPrompt,
  lessonId: mythologyLesson.id,
  ageBand: "6-8",
  explanationMode: "diagnose",
  learnerId: "maya",
  scratchpadReview: true
});
assert.equal(mythologyTutorTurn.response.stuckPointCategoryId, "plot-vs-theme", "server tutor helper should preserve mythology stuck-point category");
assert.equal(mythologyTutorTurn.log.stuckPointCategoryId, "plot-vs-theme", "AI tutor log should store the stuck-point category for adult review");
assert.ok(mythologyTutorTurn.log.hintPath.length >= 3, "AI tutor log should store the hint path for quality review");
assert.match(mythologyTutorTurn.log.strategy, /Stuck-point classifier: plot vs theme/i, "AI tutor log strategy should expose classifier rationale");
assert.ok(
  mythologyTutorTurn.state.learningEvents.some(
    (event) =>
      event.type === "scratchpad_tutor_reviewed" &&
      event.learnerId === "maya" &&
      event.value?.stuckPointCategoryId === "plot-vs-theme" &&
      event.value?.diagnosisReady === true
  ),
  "scratchpad tutor review should create a diagnosis-ready learning event"
);
const mythologyTutorEvidence = getTutorReflectionEvidence(mythologyTutorTurn.state, "maya", mythologyLesson.id);
assert.equal(mythologyTutorEvidence.qualified, 1, "qualified tutor reflection should count toward progress evidence");
assert.ok(mythologyTutorEvidence.totalXp >= 50, "diagnosed tutor reflection should earn more than generic chat XP");
const mayaLevelAfterTutor = getLearnerLevelProfile(mythologyTutorTurn.state, "maya");
assert.ok(mayaLevelAfterTutor.xpSources.tutor >= 50, "learner level profile should include quality tutor reflection XP");
assert.equal(mayaLevelAfterTutor.tutorEvidence.latestLabel, "plot vs theme", "learner level profile should expose latest tutor diagnosis");
const mayaInsightsAfterTutor = getHouseholdLearnerInsights(mythologyTutorTurn.state, { learnerIds: ["maya"] })[0];
assert.equal(mayaInsightsAfterTutor.latestTutorReflection.label, "plot vs theme", "parent insights should expose the latest tutor diagnosis");
assert.ok(mayaInsightsAfterTutor.tutorReflectionSummary.totalXp >= 50, "parent insights should expose tutor XP evidence");
const mythologyRetry = submitTutorHintRetry(mythologyTutorTurn.state, {
  learnerId: "maya",
  lessonId: mythologyLesson.id,
  retryAfterHint: "The detail proves the theme because the hero ignores a warning and the consequence shows pride can create danger."
});
assert.equal(mythologyRetry.result.accepted, true, "student retry after tutor hint should be accepted");
assert.match(getLessonScratchpad(mythologyRetry.state, "maya", mythologyLesson.id).retryAfterHint, /detail proves the theme/i, "scratchpad should store retry-after-hint evidence");
assert.ok(
  mythologyRetry.state.learningEvents.some(
    (event) =>
      event.type === "tutor_hint_retry_submitted" &&
      event.learnerId === "maya" &&
      event.lessonId === mythologyLesson.id &&
      event.value?.usedDiagnosis === true
  ),
  "retry after tutor hint should create a learning event tied to the diagnosis"
);
const mayaAfterRetry = getLearnerLevelProfile(mythologyRetry.state, "maya");
assert.ok(
  mayaAfterRetry.xpSources.lessons > mayaLevelAfterTutor.xpSources.lessons,
  "retry-after-hint event should increase lesson/reflection XP sources"
);
const mythologyWrongAnswers = Object.fromEntries(
  mythologyLesson.quiz.map((question) => [question.id, Number(question.answerIndex) === 0 ? 1 : 0])
);
const adaptiveRecommendation = getAdaptiveReteachRecommendation(mythologyRetry.state, "maya", mythologyLesson.id);
assert.equal(adaptiveRecommendation.diagnosisLabel, "plot vs theme", "adaptive reteach should use the latest tutor diagnosis");
assert.equal(adaptiveRecommendation.hasTutorRetry, true, "adaptive reteach should know when the learner retried after the hint");
const mythologyFailedQuizState = completeLessonQuiz(mythologyRetry.state, mythologyLesson.id, mythologyWrongAnswers, { learnerId: "maya" });
const failedMythologyResult = mythologyFailedQuizState.quizResults[mythologyLesson.id];
assert.equal(failedMythologyResult.passed, false, "wrong mythology answers should open reteach");
assert.equal(failedMythologyResult.adaptiveReteach.diagnosisLabel, "plot vs theme", "failed quiz should preserve diagnosis-targeted reteach");
assert.match(
  failedMythologyResult.adaptiveReteach.reteachMove,
  /Separate what happened from what it means/i,
  "plot-vs-theme reteach should give a targeted repair move"
);
assert.match(
  mythologyFailedQuizState.mastery[mythologyLesson.id].evidence,
  /plot vs theme/i,
  "mastery evidence should explain the targeted reteach route"
);
const scratchpadTutorTurn = askAiTutor(state, {
  input: createScratchpadTutorPrompt(state, "avery", lesson.id),
  lessonId: lesson.id,
  ageBand: "K-5",
  explanationMode: "diagnose",
  learnerId: "avery",
  scratchpadReview: true
});
assert.equal(getLessonScratchpad(scratchpadTutorTurn.state, "avery", lesson.id).tutorReviewCount, 2, "scratchpad tutor ask should mark review evidence");
state = scratchpadTutorTurn.state;

state = submitAffectCheckin(state, "avery", lesson.id, { joy: 5, frustration: 1, independence: 4, note: "Moved before answering." });
const telemetry = getLearningTelemetry(state);
assert.ok(telemetry.averageJoy >= 4, "affect telemetry should include joy");
assert.ok(telemetry.recallDueCount >= 0, "telemetry should include recall due count");

const experimentState = addExperimentRun(state);
const experimentDashboard = getExperimentDashboard(experimentState);
assert.ok(experimentDashboard.runs.length > state.experimentRuns.length, "adding an experiment should create a new run");
assert.ok(experimentDashboard.averages.recall7d > 0, "experiment dashboard should calculate delayed recall");

const blockedAnswer = createAiTutorResponse("tell me which answer to pick", lesson.id, "K-5");
assert.equal(blockedAnswer.type, "blocked-answer", "AI should block direct answer requests");
assert.match(blockedAnswer.text, /cannot give the final answer/i, "AI should explain answer policy");
assert.match(blockedAnswer.prompt, /first step/i, "blocked answer should redirect the learner to write their reasoning");

const emptyCoach = createAiTutorResponse("", lesson.id, "K-5");
assert.equal(emptyCoach.type, "clarify-confusion", "AI should ask the learner to write the exact confusion first");
assert.match(emptyCoach.prompt, /confusing/i, "AI clarification should use the lesson confusion prompt");

const misconceptionCoach = createAiTutorResponse("I keep counting the tick marks", lesson.id, "K-5");
assert.equal(misconceptionCoach.type, "misunderstanding-review", "AI should classify known misunderstandings from the learner response");
assert.match(misconceptionCoach.analysis, /Likely misconception/i, "AI should explain the analyzed stuck point");

assert.equal(explanationModes.length, 7, "AI tutor should expose seven explanation modes");
assert.equal(getExplanationModes().length, explanationModes.length, "engine should expose explanation modes without mutating source data");

const visualCoach = createAiTutorResponse("The picture and line are confusing", lesson.id, "K-5", "visual");
assert.equal(visualCoach.modeId, "visual", "visual tutor response should preserve the selected mode");
assert.match(visualCoach.text, /Picture it first/i, "visual mode should produce a picture-first teaching move");
assert.match(visualCoach.visualHint, /Whole interval|Equal spaces|Main idea|Proof details/i, "visual mode should return a visual hint");

const visualMeaningCoach = createAiTutorResponse("The diagram is confusing because I do not know what the whole interval means", lesson.id, "K-5", "visual");
assert.match(visualMeaningCoach.analysis, /Visual model/i, "generic words should not cause a false known-misconception match");
assert.doesNotMatch(visualMeaningCoach.analysis, /Likely misconception/i, "visual wording should not be mislabeled as a misconception");

const metaphorCoach = createAiTutorResponse("I need a story for why this works", lesson.id, "K-5", "metaphor");
assert.equal(metaphorCoach.modeId, "metaphor", "metaphor tutor response should preserve the selected mode");
assert.match(metaphorCoach.text, /metaphor/i, "metaphor mode should produce an analogy-based teaching move");

const firstStepCoach = createAiTutorResponse("I do not know where to start", lesson.id, "K-5", "first-step");
assert.equal(firstStepCoach.modeId, "first-step", "first-step tutor response should preserve the selected mode");
assert.match(firstStepCoach.text, /First step only/i, "first-step mode should limit the response to the first action");

const basicsCoach = createAiTutorResponse("I need to understand this from the beginning", lesson.id, "K-5", "first-principles");
assert.equal(basicsCoach.modeId, "first-principles", "first-principles tutor response should preserve the selected mode");
assert.match(basicsCoach.text, /Start from basics/i, "first-principles mode should rebuild from basics");
assert.match(basicsCoach.firstPrinciplesPrompt, /What is the whole thing|What is the core object/i, "first-principles mode should return grounding questions");

const visualLogState = appendAiLog(state, "The picture and line are confusing", visualCoach, lesson.id);
assert.equal(visualLogState.aiLogs[0].modeId, "visual", "AI log should store the selected explanation mode");
assert.ok(visualLogState.aiLogs[0].visualHint, "AI log should store the visual hint for review");

const diagnoseLogState = appendAiLog(state, "I am stuck and need a better picture", createAiTutorResponse("I am stuck and need a better picture", lesson.id, "K-5", "diagnose"), lesson.id);
const needsPictureFeedback = submitTutorFeedback(diagnoseLogState, diagnoseLogState.aiLogs[0].id, "needs-picture");
assert.ok(needsPictureFeedback.result.improvementSignalId, "unhelpful tutor feedback should queue an improvement signal");
const improvementQueue = getTutorImprovementQueue(needsPictureFeedback.state);
assert.equal(improvementQueue.total, 1, "tutor improvement queue should include the unhelpful feedback signal");
assert.equal(improvementQueue.signals[0].ownerAgentId, "fun-retention", "improvement signal should be owned by the fun-retention agent");
assert.match(improvementQueue.signals[0].change, /diagram|visual|picture/i, "needs-picture feedback should request visual lesson improvement");
const adaptivePictureCoach = createAdaptiveTutorResponse(
  needsPictureFeedback.state,
  "I still cannot see the equal spaces",
  lesson.id,
  "K-5",
  "diagnose"
);
assert.equal(adaptivePictureCoach.adaptive, true, "adaptive tutor should switch strategy after unhelpful feedback");
assert.equal(adaptivePictureCoach.modeId, "visual", "needs-picture feedback after diagnose should switch to visual mode");
assert.match(adaptivePictureCoach.adaptationReason, /needs picture/i, "adaptive response should explain the feedback signal");
const adaptiveLogState = appendAiLog(needsPictureFeedback.state, "I still cannot see the equal spaces", adaptivePictureCoach, lesson.id);
assert.equal(adaptiveLogState.aiLogs[0].adaptive, true, "AI log should store adaptive tutor switch metadata");
const improvementProjection = getPlatformSeedProjection(needsPictureFeedback.state);
assert.ok(
  improvementProjection.tables.lesson_redesign_tasks.some(
    (task) => task.id === needsPictureFeedback.result.improvementSignalId && task.owner_agent_id === "fun-retention"
  ),
  "seed projection should preserve tutor improvement signals as redesign tasks"
);
const serverTutorTurn = askAiTutor(needsPictureFeedback.state, {
  input: "I need a different picture for equal spaces",
  lessonId: lesson.id,
  ageBand: "K-5",
  explanationMode: "diagnose",
  learnerId: "avery"
});
assert.equal(serverTutorTurn.log.learnerId, "avery", "server tutor helper should store the authenticated learner id");
assert.equal(serverTutorTurn.log.lessonId, lesson.id, "server tutor helper should store the lesson id");
assert.equal(typeof serverTutorTurn.log.truthScore, "number", "server tutor helper should store automatic truth-policy score");
assert.ok(serverTutorTurn.log.truthReview?.reviewedByAgentId === "truth-policy", "server tutor helper should attach Truth And Fact-Check review metadata");
assert.equal(serverTutorTurn.state.aiLogs[0].learnerId, "avery", "server tutor state should keep learner-scoped AI logs");
assert.equal(serverTutorTurn.state.aiLogs[0].lessonId, lesson.id, "server tutor state should keep lesson-scoped AI logs");
assert.equal(serverTutorTurn.response.adaptive, true, "server tutor helper should use adaptive tutor selection");
const serverTutorProjection = getPlatformSeedProjection(serverTutorTurn.state);
assert.equal(serverTutorProjection.tables.ai_tutor_events[0].student_id, "avery", "AI tutor projection should use explicit learner id when present");
assert.equal(serverTutorProjection.tables.ai_tutor_events[0].lesson_id, lesson.id, "AI tutor projection should use the explicit lesson id");
assert.equal(serverTutorProjection.tables.ai_tutor_events[0].truth_score, serverTutorTurn.log.truthScore, "AI tutor projection should store truth-policy score");
assert.deepEqual(serverTutorProjection.tables.ai_tutor_events[0].truth_issues, serverTutorTurn.log.truthIssues, "AI tutor projection should store truth-policy issues");
const tutorReadiness = getOpenAiTutorReadiness({ OPENAI_API_KEY: "test-key", OPENAI_TUTOR_MODEL: "test-model" });
assert.equal(tutorReadiness.ready, true, "OpenAI tutor readiness should pass with a server-only API key");
assert.equal(getOpenAiTutorReadiness({ OPENAI_TUTOR_ENABLED: "false", OPENAI_API_KEY: "test-key" }).ready, false, "disabled OpenAI tutor should not be marked ready");
assert.equal(
  createTutorGenerationPlan({ input: "I am confused", env: { OPENAI_TUTOR_ENABLED: "true" } }).accepted,
  false,
  "tutor generation plan should block when the server key is missing"
);
const providerLimitState = {
  aiLogs: [{ provider: "openai", providerAttachedAt: new Date().toISOString() }]
};
assert.equal(
  createTutorGenerationPlan({ state: providerLimitState, input: "I am confused", env: { OPENAI_API_KEY: "test-key", OPENAI_TUTOR_DAILY_LIMIT: "1" } }).accepted,
  false,
  "tutor generation plan should block after the daily provider limit"
);
const tutorProviderRequests = [];
const tutorProviderFetch = async (url, options) => {
  tutorProviderRequests.push({ url, body: JSON.parse(options.body) });
  if (url.endsWith("/moderations")) {
    return { ok: true, status: 200, json: async () => ({ results: [{ flagged: false, categories: {} }] }) };
  }
  return {
    ok: true,
    status: 200,
    json: async () => ({
      id: "resp-tutor-test-1",
      output_text: JSON.stringify({
        text: `The confusing part of ${lesson.title} is the step where you connect the model to the reason. Let us use a diagram and one small example before you retry.`,
        analysis: "The learner needs the first step and a visual model.",
        nextStep: "Point to the part of the model that represents the whole.",
        hintPath: ["Name the whole", "Mark the equal parts", "Explain why the model matches"],
        nextQuestion: "Which part of the diagram shows the whole?",
        visualHint: "Sketch the model and label the whole before the parts.",
        firstPrinciplesPrompt: "What is the core object before we split it into parts?",
        modeId: "visual"
      }),
      usage: { input_tokens: 120, output_tokens: 90, total_tokens: 210 }
    })
  };
};
const providerTutorResult = await generateOpenAiTutorResponse({
  state: serverTutorTurn.state,
  lesson,
  support: getLessonTeachingSupport(lesson.id, serverTutorTurn.state),
  studentInput: "The diagram and first step are confusing.",
  localResponse: serverTutorTurn.response,
  ageBand: "K-5",
  explanationMode: "diagnose",
  env: { OPENAI_API_KEY: "test-key", OPENAI_TUTOR_MODEL: "test-model" },
  fetchImpl: tutorProviderFetch
});
assert.equal(providerTutorResult.accepted, true, "mock provider tutor response should pass generation gates");
assert.equal(tutorProviderRequests.length, 2, "provider tutor should moderate before calling the response model");
assert.ok(!JSON.stringify(tutorProviderRequests[1].body).includes("avery"), "provider tutor request should not include the learner id");
assert.equal(tutorProviderRequests[1].body.store, false, "provider tutor response calls should disable provider response storage");
const attachedProviderTutor = attachTutorProviderResponse(serverTutorTurn.state, serverTutorTurn.log.id, providerTutorResult);
assert.equal(attachedProviderTutor.result.accepted, true, "provider tutor response should pass the local quality gate");
assert.equal(attachedProviderTutor.result.log.provider, "openai", "accepted provider response should be marked on the tutor log");
assert.equal(attachedProviderTutor.result.log.providerRequestId, "resp-tutor-test-1", "provider request id should be persisted for review");
assert.equal(attachedProviderTutor.result.log.providerAttemptHistory.length, 1, "first provider attempt should create one audit-history entry");
const providerProjection = getPlatformSeedProjection(attachedProviderTutor.state).tables.ai_tutor_events[0];
assert.equal(providerProjection.provider, "openai", "provider metadata should reach the normalized seed projection");
assert.equal(providerProjection.provider_request_id, "resp-tutor-test-1", "provider request id should reach the normalized seed projection");
assert.equal(providerProjection.provider_review.accepted, true, "provider quality review should reach the normalized seed projection");
const rejectedProviderTutor = attachTutorProviderResponse(serverTutorTurn.state, serverTutorTurn.log.id, {
  ...providerTutorResult,
  response: { ...providerTutorResult.response, text: "Today the law proves that all students always learn this one way." }
});
assert.equal(rejectedProviderTutor.result.accepted, false, "low-quality provider response should remain on the local fallback");
assert.equal(rejectedProviderTutor.result.log.providerAttemptStatus, "quality-rejected", "quality-rejected provider attempts should be retained for manager review");
assert.equal(rejectedProviderTutor.result.log.requiresHumanReview, true, "quality-rejected provider attempts should require human review");
const revisedProviderTutor = attachTutorProviderResponse(rejectedProviderTutor.state, serverTutorTurn.log.id, providerTutorResult);
assert.equal(revisedProviderTutor.result.accepted, true, "a later provider revision should be attachable after a rejected attempt");
assert.equal(revisedProviderTutor.result.log.providerAttemptHistory.length, 2, "accepted revision should retain the rejected provider attempt");
assert.equal(revisedProviderTutor.result.log.providerAttemptHistory[1].status, "quality-rejected", "provider history should preserve the first quality result");
let revisionInstructionRequest = null;
await generateOpenAiTutorResponse({
  state: serverTutorTurn.state,
  lesson,
  support: getLessonTeachingSupport(lesson.id, serverTutorTurn.state),
  studentInput: "I am confused.",
  revisionInstructions: ["Use a concrete ratio table and explain why the denominator cannot be zero."],
  revisionAttempt: 2,
  env: { OPENAI_API_KEY: "test-key" },
  fetchImpl: async (url, options) => {
    if (url.endsWith("/moderations")) return { ok: true, status: 200, json: async () => ({ results: [{ flagged: false, categories: {} }] }) };
    revisionInstructionRequest = JSON.parse(options.body);
    return { ok: true, status: 200, json: async () => ({ id: "resp-tutor-revision", output_text: JSON.stringify({ text: "Try a table first.", analysis: "A focused visual revision.", nextStep: "Build the table.", hintPath: ["List the two quantities."], modeId: "visual" }), usage: { total_tokens: 12 } }) };
  }
});
assert.match(revisionInstructionRequest.instructions, /denominator cannot be zero/i, "revision instructions should reach the provider prompt");
const rejectedProviderReviewQueue = getAgentReviewQueue(rejectedProviderTutor.state);
const rejectedProviderReviewItem = rejectedProviderReviewQueue.items.find((item) => item.id === `ai:${serverTutorTurn.log.id}`);
assert.ok(rejectedProviderReviewItem, "quality-rejected provider attempt should appear in the manager review queue");
assert.equal(rejectedProviderReviewItem.providerStatus, "quality-rejected", "manager queue should expose the provider attempt status");
assert.ok(["A", "B", "C", "D", "F"].includes(rejectedProviderReviewItem.grade), "manager queue should expose the A-F tutor grade");
assert.equal(rejectedProviderReviewItem.threshold, 80, "manager queue tutor quality threshold should use the 0-100 scale");
assert.deepEqual(rejectedProviderReviewItem.actions, ["approve", "request_revision", "reject"], "manager queue should expose the full AI review action set");
const rejectedProviderDossier = getManagerReviewDossier(rejectedProviderTutor.state, `ai:${serverTutorTurn.log.id}`);
assert.equal(rejectedProviderDossier.threshold, 80, "AI manager dossier should use the 0-100 threshold");
assert.ok(rejectedProviderDossier.categoryScores.length > 0, "AI manager dossier should expose provider category scores");
const requestedProviderRevision = resolveAgentReviewItem(rejectedProviderTutor.state, `ai:${serverTutorTurn.log.id}`, "request_revision");
assert.equal(requestedProviderRevision.result.accepted, true, "manager should be able to request an AI provider revision");
assert.equal(requestedProviderRevision.state.aiLogs[0].reviewStatus, "revision-requested", "AI revision requests should have an explicit review status");
assert.ok(requestedProviderRevision.state.aiLogs[0].reviewHistory.length >= 1, "AI manager actions should persist review history");
assert.ok(requestedProviderRevision.result.revisionInstructions.length >= 1, "AI revision requests should include actionable instructions");
const reviewedProviderProjection = getPlatformSeedProjection(requestedProviderRevision.state).tables.ai_tutor_events[0];
assert.equal(reviewedProviderProjection.reviewed_by_user_id, "manager", "AI review actor should reach the normalized projection");
assert.equal(reviewedProviderProjection.review_history[0].action, "request_revision", "AI review history should reach the normalized projection");
let flaggedResponseCalls = 0;
const flaggedProvider = await generateOpenAiTutorResponse({
  state: serverTutorTurn.state,
  lesson,
  support: getLessonTeachingSupport(lesson.id, serverTutorTurn.state),
  studentInput: "I am confused.",
  env: { OPENAI_API_KEY: "test-key" },
  fetchImpl: async (url, options) => {
    flaggedResponseCalls += 1;
    if (url.endsWith("/moderations")) return { ok: true, status: 200, json: async () => ({ results: [{ flagged: true, categories: { violence: true } }] }) };
    return { ok: true, status: 200, json: async () => ({ output_text: "should not run" }) };
  }
});
assert.equal(flaggedProvider.blocked, true, "moderation should block unsafe tutor provider input");
assert.equal(flaggedResponseCalls, 1, "moderation failure should prevent the response model call");
const flaggedProviderAttempt = attachTutorProviderResponse(serverTutorTurn.state, serverTutorTurn.log.id, flaggedProvider);
assert.equal(flaggedProviderAttempt.result.log.providerAttemptStatus, "moderation-blocked", "moderation-blocked attempts should be retained for manager review");
const aiRepository = createStateRepository({ root: `${process.env.TEMP || "C:\\tmp"}\\k12-learning-ai-repository-test`, env: {} });
await aiRepository.writeState(serverTutorTurn.state);
const repositoryTutorEvents = await aiRepository.readAiTutorEvents({ learnerId: "avery" });
assert.equal(repositoryTutorEvents.source, "normalized-repository", "AI tutor event reads should identify the normalized repository source");
assert.ok(repositoryTutorEvents.tableIds.includes("ai_tutor_events"), "AI tutor event read model should list its backing table");
assert.ok(aiTutorEventRepositoryTableIds.includes("ai_tutor_events"), "AI tutor event table set should include ai_tutor_events");
const expectedAveryTutorEvents = serverTutorTurn.state.aiLogs.filter((log) => (log.learnerId || "avery") === "avery").length;
const repositoryServerTutorEvent = repositoryTutorEvents.events.find((event) => event.id === serverTutorTurn.log.id);
assert.equal(repositoryTutorEvents.summary.total, expectedAveryTutorEvents, "AI tutor event read model should count learner-scoped events");
assert.ok(repositoryTutorEvents.summary.truthReviewed >= 1, "AI tutor event read model should count truth-policy reviewed rows");
assert.ok(repositoryServerTutorEvent, "AI tutor event read model should include the newest server-created tutor event");
assert.equal(
  repositoryServerTutorEvent.requiresHumanReview,
  Boolean(serverTutorTurn.log.flagged || serverTutorTurn.log.needsExternalResearch || serverTutorTurn.log.truthScore < 4),
  "AI tutor event read model should apply the truth-review queue policy"
);
assert.equal(repositoryServerTutorEvent.learnerId, "avery", "AI tutor event read model should map student_id to learnerId");
assert.equal(repositoryServerTutorEvent.lessonId, lesson.id, "AI tutor event read model should map lesson_id to lessonId");
assert.equal(repositoryServerTutorEvent.truthScore, serverTutorTurn.log.truthScore, "AI tutor event read model should expose truth-policy score");
assert.equal(repositoryServerTutorEvent.truthReview.status, serverTutorTurn.log.truthReviewStatus, "AI tutor event read model should expose truth review status");
const riskyTutorState = appendAiLog(
  state,
  "What is the latest school law today?",
  {
    text: "Today the law proves that all students always learn this one way.",
    analysis: "The response makes current and overbroad claims.",
    type: "misunderstanding-review",
    modeId: "diagnose",
    modeTitle: "Diagnose First",
    flagged: false
  },
  lesson.id
);
assert.equal(riskyTutorState.aiLogs[0].needsExternalResearch, true, "current or external claims should trigger staff-side research need");
assert.ok(
  getAgentReviewQueue(riskyTutorState).items.some((item) => item.type === "ai" && item.ownerAgentId === "truth-policy"),
  "truth-policy review queue should include risky tutor responses"
);

const feedbackState = submitTutorFeedback(visualLogState, visualLogState.aiLogs[0].id, "helped").state;
const tutorQuality = getTutorQualityDashboard(feedbackState);
assert.equal(feedbackState.aiLogs[0].studentFeedback, "helped", "AI log should store student tutor feedback");
assert.equal(tutorQuality.helpfulRate, 100, "tutor quality dashboard should calculate helpful rate");
assert.ok(tutorQuality.truthReviewed >= 1, "tutor quality dashboard should count truth-policy reviewed logs");
assert.ok(tutorQuality.truthAverage > 0, "tutor quality dashboard should calculate truth-policy average");
assert.ok(tutorQuality.byMode.some((mode) => mode.modeId === "visual" && mode.helped === 1), "tutor quality should summarize outcomes by mode");

const feedbackProjection = getPlatformSeedProjection(feedbackState);
assert.equal(feedbackProjection.tables.ai_tutor_events[0].mode_id, "visual", "seed projection should store tutor mode");
assert.equal(feedbackProjection.tables.ai_tutor_events[0].student_feedback, "helped", "seed projection should store tutor feedback");
assert.equal(feedbackProjection.tables.ai_tutor_events[0].quality_score, 5, "seed projection should store tutor quality score");
const feedbackAiRepository = createStateRepository({ root: `${process.env.TEMP || "C:\\tmp"}\\k12-learning-ai-feedback-repository-test`, env: {} });
await feedbackAiRepository.writeState(feedbackState);
const feedbackTutorEvents = await feedbackAiRepository.readAiTutorEvents({ learnerId: "avery" });
assert.equal(feedbackTutorEvents.summary.feedback, 1, "AI tutor event read model should count student feedback");
assert.equal(feedbackTutorEvents.summary.helped, 1, "AI tutor event read model should count helpful tutor feedback");
assert.equal(feedbackTutorEvents.summary.helpfulRate, 100, "AI tutor event read model should calculate helpful rate");
assert.equal(feedbackTutorEvents.summary.visualMode, 1, "AI tutor event read model should count visual-mode turns");
assert.equal(feedbackTutorEvents.events[0].studentFeedback, "helped", "AI tutor event read model should expose feedback text");
const autoReviewedTutorEvents = await feedbackAiRepository.readAiTutorEvents({ reviewStatus: "auto-reviewed" });
assert.ok(
  autoReviewedTutorEvents.events.every((event) => event.reviewStatus === "auto-reviewed" || event.truthReviewStatus === "auto-reviewed"),
  "AI tutor event read model should support review-status filtering"
);

const safety = createAiTutorResponse("I might hurt myself", lesson.id, "6-8");
assert.equal(safety.type, "safety", "AI should flag safety requests");
assert.equal(safety.flagged, true, "safety response should be flagged");

const buildGuide = readFileSync("docs/build-guide.md", "utf8");
for (const expected of [
  "What We Teach",
  "Lesson Anatomy",
  "Confusion-First Tutor Flow",
  "Truth And Fact-Check Agent",
  "Visual And Diagram Strategy",
  "Tool And Web Research Policy",
  "Definition Of Done"
]) {
  assert.ok(buildGuide.includes(expected), `build guide should include ${expected}`);
}

const agentInstructions = readFileSync("AGENTS.md", "utf8");
for (const expected of ["K-12 Learning App Suite", "Foundation Academy", "Bridge Academy", "Scholar Academy", "AI Tutor Rules", "Tool Gateway"]) {
  assert.ok(agentInstructions.includes(expected), `AGENTS.md should include ${expected}`);
}

const appSource = readFileSync("src/app.js", "utf8");
for (const expected of [
  "renderStudentTeachingSequence",
  "renderNexusLessonPhaseSequence",
  "nexus-phase-player",
  "data-nexus-phase",
  "nexus-v2-fallback",
  "app-teacher-panel",
  "student-lesson-player",
  "renderAdultLessonSupport",
  "Have tutor review my confusion",
  "renderInteractiveWidget",
  "renderInteractiveMiniModel",
  "data-scratchpad-field",
  "data-interactive-widget",
  "data-phase-complete",
  "myth-decoder-board",
  "Myth Decoder Board",
  "ai-builder-system-sort",
  "g6-ratio-table-lab",
  "g6-expression-machine",
  "g6-weather-evidence-map",
  "g6-cer-evidence-board",
  "g6-migration-source-map",
  "renderSpecialAiBuilderLessonPanel",
  "special-ai-builder-panel",
  "ai-definition-grid",
  "renderBridgeCourseLessonHeader",
  "bridge-course-lesson-header",
  "Previous mission",
  "Next mission",
  "currentMissionNumber",
  "builderPath",
  "confusion-router-card",
  "Send my stuck point to tutor",
  "renderTutorDiagnosisPanel",
  "tutor-diagnosis-panel",
  "Stuck-point diagnosis",
  "Answer this next",
  "tutor-evidence-strip",
  "Tutor diagnosis evidence",
  "Tutor stuck point",
  "renderTutorHintRetryPanel",
  "data-submit-tutor-retry",
  "Retry after tutor hint",
  "Save retry evidence",
  "adaptive-reteach-card",
  "Targeted reteach path opened",
  "Targeted reteach",
  "Assign targeted support",
  "renderRedesignImplementationHistory",
  "redesign-implementation-panel",
  "redesign-history-card",
  "Implemented lesson redesign",
  "Batch quality gates",
  "batchReview",
  "data-targeted-reteach",
  "data-request-reward",
  "reward-approval-panel",
  "renderProductCompletenessPanel",
  "product-completeness-panel",
  "getLessonProductionVisualAsset",
  "ai-tutor-visual",
  "group-homework-visual",
  "postLessonScratchpad",
  "getRepositoryInteractiveSignalSummary",
  "repositoryLearningCatalogsByLearner",
  "repositoryLearnerProfiles",
  "mergeRepositoryLearnerProfiles",
  "fetchLearningCatalog(learnerId)",
  "getRepositoryLearningCatalogStatus",
  "getRepositoryCatalogLesson",
  "phaseEvidenceSource",
  "phaseCompletions",
  "completedPhaseCount",
  "getRepositoryQuizMasterySummary",
  "Repository quiz and mastery",
  "Catalog quizzes",
  "Catalog mastery",
  "fetchRewardApprovals({ learnerId })",
  "getRepositoryTutorEventSummary",
  "getRepositoryRewardApprovalSummary",
  "scopedTutorEvents",
  "repository tutor event source",
  "renderVisualBacklogSummary",
  "Master backlog status",
  "Next generation queue",
  "visualSlotStatusLabel",
  "local learner fallback",
  "Repository tutor events",
  "Repository reward approvals",
  "No learner-scoped tutor event has been read for this learner yet.",
  "No learner-scoped reward approval has been read for this learner yet.",
  "student-evidence-grid",
  "repositoryParentEvidenceForLesson",
  "Nexus learning phases",
  "repositoryPhaseAggregate",
  "Nexus phase(s) cleared from scoped catalog evidence.",
  "masterySource",
  "repositoryCatalogAvailable",
  "getRepositoryPhaseSummary",
  "Repository Nexus phases",
  "getRepositoryMasteryAggregate",
  "applyRepositoryLessonMastery",
  "Progress source:",
  "Scoped catalog evidence",
  "Phase evidence",
  "repositoryRewardApprovalForLesson",
  "getRepositoryLessonEvidence",
  "refreshLearningActionReadModels",
  "Repository lesson evidence",
  "Repository mastery evidence loaded",
  "No repository quiz or mastery evidence has been read for this lesson yet.",
  "local interactive fallback",
  "await refreshLearningActionReadModels()",
  "interactiveResponse",
  "interactiveSignal",
  "Scratchpad writing loaded",
  "repositoryScratchpadForLesson",
  "getRepositoryScratchpadSummary",
  "fetchLessonScratchpads({ learnerId })",
  "fetchAssignments({ learnerId })",
  "fetchRetentionSchedules({ learnerId })",
  "fetchPortfolioEvidence({ learnerId })",
  "fetchClassroomEvidence({ limit: 10000 })",
  "fetchClassroomMonitor({ limit: 10000 })",
  "fetchClassroomStudent({ learnerId })",
  "fetchSchoolOverview()",
  "getRepositoryAssignmentSummary",
  "getRepositoryRetentionScheduleSummary",
  "getRepositoryPortfolioEvidenceSummary",
  "getRepositoryClassroomEvidenceSummary",
  "getRepositoryClassroomMonitor",
  "getRepositoryStudentClassroom",
  "getRepositorySchoolOperationsSummary",
  "Repository portfolio and badges",
  "Portfolio and badges",
  "repositoryRewardApprovalToRequest",
  "Repository quiz/mastery",
  "learner-scoped scratchpad repository",
  "learner-scoped repository evidence",
  "learner-scoped reward repository",
  "learner-scoped repository",
  "local fallback",
  "Tutor events",
  "Reward reads",
  "Assignments",
  "Portfolio",
  "Class artifacts",
  "Interventions",
  "Roster source",
  "Repository roster",
  "repository monitor",
  "repository student classroom source",
  "repository classroom session",
  "Repository spaced retrieval",
  "learner-scoped",
  "Repository skill signals",
  "Skill signals",
  "Catalog evidence"
]) {
  assert.ok(appSource.includes(expected), `lesson player should include app-led student teaching surface: ${expected}`);
}
assert.ok(appSource.includes("A scoped session must not fall back to the broad snapshot"), "learner hydration should block broad snapshot fallback");
assert.ok(appSource.includes("repositoryBootstrap?.catalog || null"), "scoped catalog refresh should use bootstrap metadata before learner-specific reads");

const serverSource = readFileSync("scripts/serve.mjs", "utf8");
const apiClientSource = readFileSync("src/apiClient.js", "utf8");
assert.ok(serverSource.includes('const postgresRepository = stateRepository.status().mode === "postgres"'), "Postgres requests should identify normalized repository mode");
assert.ok(serverSource.includes("const normalizedSecurity = postgresRepository ? await stateRepository.readAccountSecurity"), "Postgres auth session should read normalized account security");
assert.ok(serverSource.includes("accounts: []"), "Anonymous auth sessions should not expose account records");
assert.ok(serverSource.includes("A provider refresh token is required."), "provider refresh should reject missing refresh tokens");
assert.ok(serverSource.includes("const refreshedSession = await getRequestSessionAsync"), "provider refresh should verify refreshed JWT claims");
assert.ok(serverSource.includes("stateRepository.isSessionRevoked(refreshedSession)"), "provider refresh should enforce app-level session revocation");
assert.ok(serverSource.includes("supabaseSignOut({ accessToken: provider.accessToken }).catch(() => {})"), "revoked refresh sessions should be terminated at the provider when possible");
assert.ok(serverSource.includes("if (body.revokeAll) await supabaseSignOut({ accessToken });"), "current-session revocation must not call Supabase global logout");
assert.ok(apiClientSource.includes("setRefreshToken(\"\");\n}"), "local sign-out should clear the refresh token as well as the access token");
for (const expected of [
  'pathname === "/api/bootstrap"',
  'pathname === "/api/runtime/health"',
  "Repository health probe failed",
  "readRoleScopedBootstrap",
  "readLearnerProfiles",
  "readRepositoryLearnerScope",
  "repositoryCanAccessLearner",
  "includeProgress: session.role === \"student\"",
  "stateRepository.status().mode === \"json\"",
  "stateRepository.status().mode === \"json\" ? await ensureStateFile() : {}",
  "sanitizeScopedApiPayload",
  "requireLegacySnapshotAccess",
  'requireRepositoryPermission(session, "app_state_snapshots", operation, session.scope)',
  'pathname === "/api/learning/catalog"',
  "A learnerId is required for scoped learning catalog reads.",
  'pathname === "/api/learning/interactive"',
  'pathname === "/api/learning/phase"',
  "A valid Nexus learning phase is required.",
  'pathname === "/api/rewards/approvals"',
  'pathname === "/api/learning/scratchpads"',
  'pathname === "/api/learning/assignments"',
  'pathname === "/api/learning/retention-schedules"',
  'pathname === "/api/learning/portfolio-evidence"',
  'pathname === "/api/classroom/evidence"',
  'pathname === "/api/classroom/monitor"',
  'pathname === "/api/school/overview"',
  'readLessonScratchpads({',
  'readAssignments({',
  'readRetentionSchedules({',
  'readPortfolioEvidence({',
  'readClassroomEvidence({',
  'readClassroomMonitor({',
  'readLearnerClassSession({',
  'readSchoolOperations({',
  "A learnerId is required for scoped scratchpad reads.",
  "A learnerId is required for scoped assignment reads.",
  "A learnerId is required for scoped retention schedule reads.",
  "A learnerId is required for scoped portfolio evidence reads.",
  'readRewardApprovals({',
  'readAccountSecurity({',
  'pathname === "/api/auth/security"',
  'pathname === "/api/system/state-dependencies"',
  "scopeAccountSecurityForSession",
  "A learnerId is required for scoped AI tutor event reads.",
  'requireRepositoryPermission(session, "interactive_skill_evidence", "read", session.scope)',
  "recordInteractiveResponse(state",
  "writeLearningEvidence(nextState)",
  "response: persisted.interactiveResponses"
]) {
  assert.ok(serverSource.includes(expected), `server should include ${expected}`);
}

for (const expected of ["refreshRuntimeHealth", "Repository health"]) {
  assert.ok(appSource.includes(expected), `app should include ${expected}`);
}
assert.ok(apiClientSource.includes("fetchRuntimeHealth"), "api client should include the runtime health helper");

const stylesSource = readFileSync("src/styles.css", "utf8");
for (const expected of [
  "Production layout guard v2",
  ".topbar-controls",
  "grid-template-columns: repeat(auto-fit, minmax(104px, 1fr))",
  ".wide-panel,\n.dashboard-panel,\n.lesson-panel,\n.side-panel,\n.panel {\n  overflow: visible;",
  ".lesson-row,\n  .classroom-roster-row,\n  .run-row,\n  .source-row,\n  .review-row,\n  .draft-row,\n  .account-row {\n    grid-template-columns: minmax(0, 1fr);"
]) {
  assert.ok(stylesSource.includes(expected), `global layout guard should include ${expected}`);
}

assert.ok(stylesSource.includes(".myth-decoder-model"), "styles should include the mythology decoder board model");
assert.ok(stylesSource.includes(".special-ai-builder-panel"), "styles should include the Learning AI builder panel");
assert.ok(stylesSource.includes(".ai-definition-grid"), "styles should include the Learning AI definition grid");
assert.ok(stylesSource.includes(".ai-builder-mini-model"), "styles should include the Learning AI system sort model");
assert.ok(stylesSource.includes(".bridge-course-lesson-header"), "styles should include the Bridge Grade 6 course lesson header");
assert.ok(stylesSource.includes(".bridge-course-mini-rail"), "styles should include the Bridge Grade 6 mini mission rail");
assert.ok(stylesSource.includes(".ratio-table-widget"), "styles should include the Grade 6 ratio table widget");
assert.ok(stylesSource.includes(".expression-machine-widget"), "styles should include the Grade 6 expression machine widget");
assert.ok(stylesSource.includes(".weather-evidence-widget"), "styles should include the Grade 6 weather evidence widget");
assert.ok(stylesSource.includes(".cer-board-widget"), "styles should include the Grade 6 CER board widget");
assert.ok(stylesSource.includes(".migration-map-widget"), "styles should include the Grade 6 migration map widget");
assert.ok(stylesSource.includes(".confusion-router-card"), "styles should include the mythology confusion router card");
assert.ok(stylesSource.includes(".tutor-diagnosis-panel"), "styles should include the tutor stuck-point diagnosis panel");
assert.ok(stylesSource.includes(".tutor-hint-path"), "styles should include the tutor hint path");
assert.ok(stylesSource.includes(".tutor-evidence-strip"), "styles should include the tutor XP evidence strip");
assert.ok(stylesSource.includes(".tutor-retry-panel"), "styles should include the tutor retry panel");
assert.ok(stylesSource.includes(".retry-after-hint-field"), "styles should include the tutor retry textarea");
assert.ok(stylesSource.includes(".adaptive-reteach-card"), "styles should include the adaptive reteach card");
assert.ok(stylesSource.includes(".redesign-implementation-panel"), "styles should include the manager redesign implementation history panel");
assert.ok(appSource.includes("Repository account security"), "setup view should show repository account security evidence");
assert.ok(appSource.includes("fetchAuthSecurity({ limit: 10000 })"), "setup view should load account security from the scoped auth route");
assert.ok(appSource.includes("State dependency audit"), "admin data model should show the state dependency audit");
assert.ok(appSource.includes("repositoryStateDependencyAudit"), "app should track state dependency audit route results");
assert.ok(apiClientSource.includes("/api/auth/security"), "API client should expose the account security route");
assert.ok(apiClientSource.includes("/api/system/state-dependencies"), "API client should expose the state dependency audit route");
assert.ok(stylesSource.includes(".redesign-history-card"), "styles should include implemented redesign history cards");

const repositorySource = readFileSync("src/repository.js", "utf8");
assert.ok(repositorySource.includes("batchReview"), "repository review summary should count batch review items");
const reportState = refreshSchoolReports({
  ...createInitialState(),
  classSections: [{ id: "class-report-test", schoolId: "school-test", name: "Grade 6 Lab", studentIds: [], status: "setup" }],
  classSessions: [],
  schoolReports: []
});
assert.equal(reportState.schoolReports.length, 1, "school report refresh should create one report per scoped class");
assert.equal(reportState.schoolReports[0].classId, "class-report-test", "school report should identify its class");
assert.match(reportState.schoolReports[0].reportType, /classroom-progress/, "school report should use a progress snapshot type");
const schoolReportsCsv = formatSchoolReportSnapshotsCsv({ reports: reportState.schoolReports });
assert.match(schoolReportsCsv, /school_id,class_id,report_type,summary/, "school report export should include a stable CSV header");
assert.match(schoolReportsCsv, /class-report-test/, "school report export should include the scoped class");
assert.ok(readFileSync("src/app.js", "utf8").includes("Persisted school reports"), "school admin UI should render persisted report summaries");
assert.ok(readFileSync("src/app.js", "utf8").includes("data-school-reports-export"), "school admin UI should expose report export action");
assert.ok(readFileSync("scripts/serve.mjs", "utf8").includes("refreshSchoolReports"), "school write workflows should refresh report snapshots");
assert.ok(readFileSync("scripts/serve.mjs", "utf8").includes("/api/school/reports/export"), "school server should expose a report export route");

assert.ok(getPipelineStats().gates >= 2, "content pipeline should include review gates");
assert.ok(qualityGates.length >= 7, "quality gates should include launch checks");
assert.ok(getReadinessChecklist().every((item) => item.passed), "readiness checklist should pass for prototype data");

const providerTestEnv = {
  NODE_ENV: "production",
  AUTH_PROVIDER: "supabase",
  SUPABASE_URL: "https://auth.example.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "publishable-test-key",
  SUPABASE_JWKS_URL: "https://auth.example.supabase.co/auth/v1/.well-known/jwks.json",
  SUPABASE_SECRET_KEY: "secret-test-key"
};
assert.equal(isSupabaseAuthConfigured(providerTestEnv), true, "Supabase provider adapter should require URL and publishable key");
const providerRequests = [];
const providerFetch = async (url, options = {}) => {
  providerRequests.push({ url, options });
  if (url.endsWith("/signup")) {
    return new Response(JSON.stringify({ user: { id: "provider-parent-1", email: "parent@example.test", confirmed_at: null }, access_token: "", refresh_token: "" }), { status: 200, headers: { "content-type": "application/json" } });
  }
  if (url.includes("/token?grant_type=password")) {
    return new Response(JSON.stringify({ user: { id: "provider-parent-1", email: "parent@example.test", email_confirmed_at: "2026-07-17T00:00:00Z" }, access_token: "provider-access-token", refresh_token: "provider-refresh-token", expires_in: 3600 }), { status: 200, headers: { "content-type": "application/json" } });
  }
  if (url.endsWith("/verify")) return new Response(JSON.stringify({ user: { id: "provider-teacher-1", email: "teacher@example.test", email_confirmed_at: "2026-07-17T00:00:00Z", app_metadata: { role: "teacher", scope: "assigned", teacherId: "teacher-1" } }, access_token: "teacher-verified-token", refresh_token: "teacher-refresh-token" }), { status: 200, headers: { "content-type": "application/json" } });
  if (url.endsWith("/recover")) return new Response(JSON.stringify({}), { status: 200, headers: { "content-type": "application/json" } });
  if (url.endsWith("/user")) return new Response(JSON.stringify({ user: { id: "provider-parent-1", email: "parent@example.test", email_confirmed_at: "2026-07-17T00:00:00Z" } }), { status: 200, headers: { "content-type": "application/json" } });
  return new Response(JSON.stringify({}), { status: 200, headers: { "content-type": "application/json" } });
};
const providerSignup = await supabaseSignUp({ email: "parent@example.test", password: "parent-pass-123", displayName: "Provider Parent", fetchImpl: providerFetch, env: providerTestEnv });
assert.equal(providerSignup.user.id, "provider-parent-1", "provider signup should return the provider user");
assert.equal(JSON.parse(providerRequests[0].options.body).options.data.requested_role, "parent", "provider signup should store role as non-authorizing profile metadata");
const providerSignin = await supabaseSignIn({ email: "parent@example.test", password: "parent-pass-123", fetchImpl: providerFetch, env: providerTestEnv });
assert.equal(providerSignin.access_token, "provider-access-token", "provider sign-in should return an access token");
const normalizedProviderClaims = normalizeSupabaseAuthResponse({
  user: {
    id: "provider-teacher-1",
    email: "teacher@example.test",
    email_confirmed_at: "2026-07-17T00:00:00Z",
    app_metadata: { role: "teacher", scope: "assigned", teacherId: "teacher-1" }
  },
  access_token: "teacher-token"
});
assert.equal(normalizedProviderClaims.user.appMetadata.role, "teacher", "normalized provider users should preserve app metadata role claims");
assert.equal(normalizedProviderClaims.user.appMetadata.teacherId, "teacher-1", "normalized provider users should preserve scoped role identifiers");
const verifiedProvider = await supabaseVerifyEmail({ tokenHash: "verify-hash", fetchImpl: providerFetch, env: providerTestEnv });
assert.equal(verifiedProvider.user.app_metadata.role, "teacher", "provider email verification should return the original role claims");
await supabaseRequestPasswordReset({ email: "parent@example.test", fetchImpl: providerFetch, env: providerTestEnv });
await supabaseUpdatePassword({ accessToken: "provider-access-token", password: "new-parent-pass-123", fetchImpl: providerFetch, env: providerTestEnv });
await supabaseAdminCreateUser({
  email: "child@students.example.edu",
  password: "child-pass-123",
  userMetadata: { username: "child" },
  appMetadata: { role: "student", scope: "own" },
  fetchImpl: providerFetch,
  env: providerTestEnv
});
await supabaseAdminDeleteUser("provider-child-1", { fetchImpl: providerFetch, env: providerTestEnv });
assert.ok(providerRequests.some((request) => request.url.endsWith("/recover")), "provider password reset should call Supabase recover");
assert.ok(providerRequests.some((request) => request.url.endsWith("/admin/users") && request.options.method === "POST"), "provider child creation should use the admin user endpoint");
assert.ok(providerRequests.some((request) => request.url.endsWith("/admin/users/provider-child-1") && request.options.method === "DELETE"), "provider child rollback should delete the admin user");
assert.equal((await getRequestSessionAsync({ headers: {} }, providerTestEnv, { fetchImpl: providerFetch })).authenticated, false, "production provider mode should require a bearer token");

console.log("All K-12 Learning Academies checks passed.");
