import {
  agentTeam,
  contentPipeline,
  curriculum,
  diagnosticBlueprints,
  evidenceGuidanceAudit,
  explanationModes,
  experimentTemplates,
  learningScienceSources,
  lessonTemplate,
  parentOnboardingModel,
  pilotLessons,
  productionArchitecture,
  qualityGates,
  radicalLearningModel,
  rewardCatalog,
  standardsFrameworks,
  syllabusResearchFindings
} from "./data.js";
import {
  addExperimentRun,
  addFamilyBenefit,
  completeLessonQuiz,
  createSchoolClass,
  findAcademy,
  findLessonInState,
  getConsentReadiness,
  getCurriculumTotals,
  getDraftEvidenceAudit,
  getDraftVisualAsset,
  getEvidenceGuidanceSummary,
  getEvidenceImplementationPlan,
  getLessonEvidenceAudit,
  getExperimentDashboard,
  getLearnerAccess,
  getAuthSecuritySummary,
  getClassroomProductSummary,
  getBridgeGrade6CoursePath,
  getLessonExperience,
  getLessonTeachingSupport,
  getLessonScratchpad,
  getNexusPhaseProgress,
  completeNexusPhase,
  getInteractiveResponse,
  getLearnerClassSession,
  getRewardApprovalQueue,
  getTeacherClassMonitor,
  updateLessonScratchpad,
  recordInteractiveResponse,
  recordStudentEngagementAction,
  requestRewardApproval,
  createScratchpadTutorPrompt,
  getLearningTelemetry,
  getLearnerLevelProfile,
  getStudentEngagementProfile,
  getLearnerSubjectProgress,
  getHouseholdLearnerInsights,
  getAgentCommandCenter,
  getManagerReviewDossier,
  getAgentToolGatewaySummary,
  getApprovedLessonVisualAsset,
  getOnboardingStatus,
  getParentSummary,
  getPlatformDataModelReadiness,
  getPlatformLessonLibrarySamples,
  getPlatformLessonLibrarySummary,
  getPlatformMigration,
  getPlatformMigrationReadiness,
  getPlatformOpenAiImageReadiness,
  getPlatformRepositoryAccessSummary,
  getProductCompletenessAudit,
  mergeRepositoryLearningCatalog,
  mergeRepositoryLearningEvents,
  mergeRepositoryLearnerProfiles,
  getStateDependencyAudit,
  getPlatformLessonProductionBatchPlan,
  getPilotQualityGateReport,
  getPublishedLessonSummary,
  getReviewableContentBatchIds,
  getPlacementPlan,
  getPipelineStats,
  getRadicalLearningSummary,
  getReadinessChecklist,
  getRewardPlan,
  getTodayPlan,
  getTutorQualityDashboard,
  getTutorImprovementQueue,
  getTutorReflectionEvidence,
  submitTutorHintRetry,
  getVisualLearningAgentAudit,
  getVisualProductionBatchPlan,
  getVisualAssetSummary,
  importLessonBatch,
  isolateStateForStrictLearnerScope,
  loadState,
  markPersistenceError,
  mergePersistedState,
  enrollLearnerInSchoolClass,
  importSchoolRoster,
  recordTeacherIntervention,
  replaceVisualAsset,
  publishApprovedContentBatch,
  resolveAgentReviewItem,
  updateRewardApprovalStatus,
  submitClassroomArtifact,
  resetState,
  runAgentTool,
  saveState,
  scoreQuiz,
  simulateDiagnosticPlacement,
  createContentDraft,
  updateClassSessionStatus,
  updateGroupMission,
  getContentAuthoringSummary,
  getContentBatchReviewState,
  getContentDraftCompletenessReview,
  getContentDraftTruthReview,
  getAppViewContractSummary,
  updateContentDraftStatus,
  updateVisualAssetStatus
} from "./engine.js";
import {
  fetchAgentReviewItems,
  fetchAssignments,
  fetchAuditEvents,
  fetchAuthSecurity,
  fetchAuthSession,
  fetchClassroomEvidence,
  fetchClassroomMonitor,
  fetchClassroomStudent,
  fetchContentDrafts,
  fetchLearningCatalog,
  fetchLearningEvents,
  fetchLessonScratchpads,
  fetchPersistedState,
  fetchRoleScopedBootstrap,
  fetchRuntimeHealth,
  fetchPortfolioEvidence,
  fetchRewardApprovals,
  fetchRetentionSchedules,
  fetchRuntimeConfiguration,
  fetchSchoolOverview,
  fetchSchoolReportsExport,
  fetchSchoolRosterExport,
  fetchStateDependencyAudit,
  fetchTutorEvents,
  fetchVisualAssets,
  postAgentReviewDecision,
  postLessonQuiz,
  postLessonPhase,
  postLessonScratchpad,
  postInteractiveResponse,
  postClassroomArtifact,
  putClassroomMission,
  postClassSessionStatus,
  postTeacherIntervention,
  postSchoolClass,
  postSchoolEnrollment,
  postSchoolRosterImport,
  postRewardDecision,
  postRewardFulfillment,
  postRewardRequest,
  postLessonBatchImport,
  postContentBatchPublication,
  postDraftStatus,
  postLessonDraft,
  postTutorAsk,
  postTutorFeedback,
  postVisualAgentGeneration,
  postVisualAssetReplacement,
  postVisualAssetStoragePromotion,
  postVisualAssetStatus,
  postChildAccount,
  postEmailVerificationConfirm,
  postEmailVerificationRequest,
  postPasswordResetConfirm,
  postPasswordResetRequest,
  postSessionRevocation,
  postSignin,
  postSignup,
  postToolGatewayExecution,
  putPersistedState,
  resetPersistedState,
  signOutLocal
} from "./apiClient.js";
import { getLearningCatalogInteractiveSignals, getLearningCatalogQuizMasterySummary } from "./learningCatalogSignals.js";
import { isGiftCardRewardRequest } from "./rewardFulfillmentService.js";
import {
  adaptV2LessonToNexusV3,
  getRenderableNexusPhaseModules,
  validateNexusLessonV3
} from "./nexusV3.js";
import {
  getAccessSummary,
  getAuthorizedView,
  getRoleHomeView,
  getVisibleRoleViews,
  isViewAllowedForSession
} from "./accessControl.js";
import { viewIcons, viewLabels } from "./viewContract.js";

const app = document.querySelector("#app");
let state = loadState();
let activeView = "student";
let selectedGradeId = null;
let syncInFlight = false;
let lastBatchImportResult = null;
let lastBatchPublicationResult = null;
let lastVisualReplacementResult = null;
let lastVisualStorageResult = null;
let lastVisualAgentResult = null;
let lastToolGatewayResult = null;
let lastAgentReviewResult = null;
let lastClassroomResult = null;
let lastSchoolResult = null;
let repositoryLearningCatalog = null;
let repositoryLearningCatalogError = null;
let repositoryLearningCatalogsByLearner = {};
let repositoryLearningCatalogErrorsByLearner = {};
let repositoryLearningEventsByLearner = {};
let repositoryLearningEventErrorsByLearner = {};
let repositoryContentDrafts = null;
let repositoryContentDraftsError = null;
let repositoryVisualAssets = null;
let repositoryVisualAssetsError = null;
let repositoryTutorEvents = null;
let repositoryTutorEventsError = null;
let repositoryTutorEventsByLearner = {};
let repositoryTutorEventErrorsByLearner = {};
let repositoryRewardApprovalsByLearner = {};
let repositoryRewardApprovalErrorsByLearner = {};
let repositoryScratchpadsByLearner = {};
let repositoryScratchpadErrorsByLearner = {};
let repositoryAssignmentsByLearner = {};
let repositoryAssignmentErrorsByLearner = {};
let repositoryRetentionSchedulesByLearner = {};
let repositoryRetentionScheduleErrorsByLearner = {};
let repositoryPortfolioEvidenceByLearner = {};
let repositoryPortfolioEvidenceErrorsByLearner = {};
let repositoryClassroomEvidence = null;
let repositoryClassroomEvidenceError = null;
let repositoryClassroomMonitor = null;
let repositoryClassroomMonitorError = null;
let repositoryStudentClassroomsByLearner = {};
let repositoryStudentClassroomErrorsByLearner = {};
let repositorySchoolOperations = null;
let repositorySchoolOperationsError = null;
let repositoryAgentReviews = null;
let repositoryAgentReviewsError = null;
let repositoryAuditEvents = null;
let repositoryAuditEventsError = null;
let repositoryAccountSecurity = null;
let repositoryAccountSecurityError = null;
let repositoryStateDependencyAudit = null;
let repositoryStateDependencyAuditError = null;
let repositoryBootstrap = null;
let repositoryLearnerProfiles = null;
let currentRuntimeConfiguration = null;
let currentRuntimeConfigurationError = null;
let currentRuntimeHealth = null;
let currentRuntimeHealthError = null;
let currentSession = null;
let currentGiftCardReadiness = null;
let lastAuthResult = null;
let lastRewardResult = null;
let learningMoment = null;
let learningMomentTimer = null;
const soundPreferenceKey = "k12-learning-ui-sound-enabled";
const storedSoundPreference = globalThis.localStorage?.getItem?.(soundPreferenceKey);
let uiSoundEnabled = storedSoundPreference !== "false";
let scratchpadSyncTimer = null;

function announceLearningMoment(message, tone = "success") {
  learningMoment = { message: String(message || "Learning evidence recorded."), tone };
  if (learningMomentTimer) globalThis.clearTimeout?.(learningMomentTimer);
  learningMomentTimer = globalThis.setTimeout?.(() => {
    learningMoment = null;
    learningMomentTimer = null;
    render();
  }, 3600);
}

function html(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function tokenClass(value) {
  return (
    String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "item"
  );
}

function ageBand(academyId) {
  const academy = findAcademy(academyId);
  return academy.range;
}

function currentAcademy() {
  return findAcademy(state.selectedAcademyId);
}

function currentLesson() {
  return findLessonInState(state, state.selectedLessonId);
}

function learnersForCurrentSession() {
  if (!currentSession?.role) return [];
  if (["student", "parent", "teacher"].includes(currentSession.role) && repositoryLearnerProfiles?.learners) {
    return repositoryLearnerProfiles.learners;
  }
  if (currentSession.role === "student" && currentSession.studentId) {
    return state.learners.filter((learner) => learner.id === currentSession.studentId);
  }
  if (currentSession.role === "parent" && currentSession.guardianId) {
    const linkedStudentIds = new Set(
      (state.localAccounts || [])
        .filter((account) => account.role === "student" && account.guardianId === currentSession.guardianId)
        .map((account) => account.studentId)
        .filter(Boolean)
    );
    return state.learners.filter((learner) => linkedStudentIds.has(learner.id));
  }
  if (currentSession.role === "teacher" && currentSession.teacherId) {
    const assignedClassIds = new Set(
      (state.classSections || []).filter((section) => section.teacherId === currentSession.teacherId).map((section) => section.id)
    );
    const assignedStudentIds = new Set(
      (state.classSections || [])
        .filter((section) => assignedClassIds.has(section.id))
        .flatMap((section) => section.studentIds || [])
    );
    return state.learners.filter((learner) => assignedStudentIds.has(learner.id));
  }
  return [];
}

function learnerIdsForCurrentSession() {
  return learnersForCurrentSession().map((learner) => learner.id);
}

function hasStrictLearnerScope() {
  return ["student", "parent", "teacher"].includes(currentSession?.role || "");
}

function learnerScopeOptions() {
  return {
    learnerIds: learnerIdsForCurrentSession(),
    strictLearnerScope: hasStrictLearnerScope()
  };
}

function scopedTodayPlan() {
  return getTodayPlan(state, learnerScopeOptions());
}

function currentLearner() {
  const sessionLearners = learnersForCurrentSession();
  const academyScopedSessionLearner = sessionLearners.find((learner) => learner.academyId === state.selectedAcademyId);
  if (academyScopedSessionLearner) return academyScopedSessionLearner;
  if (sessionLearners[0]) return sessionLearners[0];
  const sessionLearner = currentSession?.studentId
    ? state.learners.find((learner) => learner.id === currentSession.studentId)
    : null;
  return sessionLearner || state.learners.find((learner) => learner.academyId === state.selectedAcademyId) || state.learners[0];
}

function academyBadge(academy) {
  return `<span class="range-badge">${html(academy.range)}</span>`;
}

function renderXpTrack(percent, label = "XP progress") {
  return `
    <div class="xp-track" aria-label="${html(label)} ${Math.min(100, Math.max(0, Number(percent) || 0))}%">
      <span style="width: ${Math.min(100, Math.max(0, Number(percent) || 0))}%"></span>
    </div>
  `;
}

function subjectWorldMeta(subject = "") {
  const worlds = {
    ela: { world: "Story Studio", icon: "ST", action: "Read, notice, explain" },
    writing: { world: "Writer's Workshop", icon: "WR", action: "Draft, revise, publish" },
    math: { world: "Math Lab", icon: "ML", action: "Model, solve, prove" },
    science: { world: "Discovery Lab", icon: "DL", action: "Observe, test, explain" },
    "social-studies": { world: "Time And Civics Hall", icon: "TC", action: "Map, source, debate" },
    "health-pe": { world: "Life And Wellness Field", icon: "LW", action: "Practice, reflect, improve" },
    "arts-media": { world: "Creative Studio", icon: "CS", action: "Make, critique, refine" },
    "computer-science": { world: "Code Garage", icon: "CG", action: "Debug, build, test" },
    "life-skills": { world: "Skills Studio", icon: "SS", action: "Choose, reflect, try" },
    "career-college": { world: "Future Lab", icon: "FL", action: "Plan, build, present" }
  };
  return worlds[subject] || { world: "Learning Studio", icon: "LS", action: "Learn, practice, prove" };
}

function latestUnlockedReward(levelProfile) {
  const unlocked = levelProfile.unlockedRewards || [];
  return unlocked[unlocked.length - 1] || null;
}

function rewardStatusLabel(status = "") {
  const labels = {
    pending: "Parent review",
    approved: "Approved",
    redeemed: "Redeemed",
    rejected: "Needs another try"
  };
  return labels[status] || "Ready";
}

function renderChildRewardClaim(learner, levelProfile) {
  const unlockedReward = latestUnlockedReward(levelProfile);
  const rewardQueue = getRewardApprovalQueue(state, learner.id);
  const newestRequest = unlockedReward
    ? rewardQueue.find((request) => request.rewardLevel === unlockedReward.level)
    : null;

  if (!unlockedReward) {
    return `
      <div class="reward-claim-box locked">
        <strong>Reward locked</strong>
        <p>Earn more XP from lessons, tutor reflection, projects, experiments, or recall checks.</p>
      </div>
    `;
  }

  return `
    <div class="reward-claim-box ${html(newestRequest?.status || "ready")}">
      <div>
        <span>${html(rewardStatusLabel(newestRequest?.status))}</span>
        <strong>${html(unlockedReward.title)}</strong>
        <p>${html(unlockedReward.benefit)}</p>
      </div>
      ${
        newestRequest?.status === "pending"
          ? `<small>Waiting for parent approval.</small>`
          : newestRequest?.status === "approved"
            ? `<small>Parent can mark it redeemed when the benefit is delivered.</small>`
            : newestRequest?.status === "redeemed"
              ? `<small>Redeemed and logged as mastery evidence.</small>`
              : `<button class="small-button" data-request-reward="${html(learner.id)}" data-reward-level="${unlockedReward.level}">Claim reward</button>`
      }
    </div>
  `;
}

function renderShell(content) {
  const access = getAccessSummary(currentSession);
  const visibleRoleViews = getVisibleRoleViews(currentSession);
  const roleClass = tokenClass(access.role);
  const viewClass = tokenClass(activeView);
  const visibleOperationViews = viewLabels.filter(
    ([id]) => !["student", "parent", "teacher", "school"].includes(id) && access.allowedViews.includes(id)
  );

  return `
    <header class="topbar academy-topbar role-${roleClass} view-${viewClass}">
      <div class="brand-block">
        <div class="brand-mark academy-brand-mark" aria-hidden="true">AW</div>
        <div>
          <p class="eyebrow">K-12 Learning Academies</p>
          <h1 class="glitch-title" data-text="Academy Worlds">Academy Worlds</h1>
          <small>Neon subject worlds, app-led visual lessons, tutor support, rewards, and review-gated agent tools.</small>
        </div>
      </div>
      <div class="topbar-controls">
        <nav class="role-tabs" aria-label="User role pages">
          ${viewLabels
            .filter(([id]) => visibleRoleViews.includes(id))
            .map(
              ([id, label]) => `
                <button class="role-tab ${activeView === id ? "active" : ""}" data-view="${id}">
                  <span aria-hidden="true">${html(viewIcons[id])}</span>
                  <strong>${html(label)}</strong>
                </button>
              `
            )
            .join("")}
        </nav>
        <nav class="nav-tabs" aria-label="Primary app views">
          ${visibleOperationViews
            .map(
              ([id, label]) => `
                <button class="nav-tab ${activeView === id ? "active" : ""}" data-view="${id}">
                  <span aria-hidden="true">${html(viewIcons[id] || "")}</span>
                  <strong>${html(label)}</strong>
                </button>
              `
            )
            .join("")}
        </nav>
        <button class="sound-toggle ${uiSoundEnabled ? "enabled" : ""}" data-sound-toggle aria-pressed="${uiSoundEnabled ? "true" : "false"}" aria-label="${uiSoundEnabled ? "Turn interface sounds off" : "Turn interface sounds on"}">
          <span aria-hidden="true">${uiSoundEnabled ? "On" : "Off"}</span>
          <strong>Sound</strong>
        </button>
      </div>
    </header>
    <main class="main-grid academy-main role-${roleClass} view-${viewClass}">
      ${renderAccessStrip(access)}
      ${learningMoment ? `<div class="learning-moment ${html(learningMoment.tone)}" role="status" aria-live="polite"><span aria-hidden="true">✦</span><strong>${html(learningMoment.message)}</strong></div>` : ""}
      ${content}
    </main>
  `;
}

function renderAccessStrip(access) {
  const session = currentSession || {};
  const label = session.devFallback
    ? "Local pilot workspace"
    : session.displayName || session.email || session.userId || (access.isAuthenticated ? "Signed account" : "Not signed in");
  const detail = session.devFallback
    ? "Seeded role claims are active for local testing. Sign in as a parent, teacher, or child to test account-specific pages."
    : access.isAuthenticated
      ? `${access.allowedViews.length} view(s) available for this role.`
      : "Sign in or create an account to unlock the correct role page.";

  return `
    <section class="access-strip wide-panel" aria-label="Current access">
      <div>
        <span>${html(access.role.replace("-", " "))}</span>
        <strong>${html(label)}</strong>
        <small>${html(detail)}</small>
      </div>
      <div class="access-scope-list">
        ${access.allowedViews.slice(0, 6).map((view) => `<span>${html(view.replace("-", " "))}</span>`).join("")}
      </div>
      ${
        access.isAuthenticated && !session.devFallback
          ? `<button class="small-button access-signout" data-signout>Sign out</button>`
          : ""
      }
    </section>
  `;
}

function renderMetric(label, value, detail) {
  return `
    <div class="metric">
      <span>${html(label)}</span>
      <strong>${html(value)}</strong>
      <small>${html(detail)}</small>
    </div>
  `;
}

function renderRoleHero({ role, eyebrow, title, body, primaryAction, secondaryAction, stats = [] }) {
  return `
    <section class="panel wide-panel role-hero role-${html(role)}">
      <div class="role-hero-copy">
        <p class="eyebrow">${html(eyebrow)}</p>
        <h2>${html(title)}</h2>
        <p>${html(body)}</p>
        <div class="hero-actions">
          ${primaryAction ? `<button class="primary-button" data-view="${html(primaryAction.view)}">${html(primaryAction.label)}</button>` : ""}
          ${secondaryAction ? `<button class="secondary-button" data-view="${html(secondaryAction.view)}">${html(secondaryAction.label)}</button>` : ""}
        </div>
      </div>
      <div class="role-hero-showcase">
        ${renderRoleStage(role)}
        <div class="role-hero-stats" aria-label="${html(role)} page highlights">
          ${stats
            .map(
              (stat) => `
                <article>
                  <span>${html(stat.label)}</span>
                  <strong>${html(stat.value)}</strong>
                  <small>${html(stat.detail)}</small>
                </article>
              `
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

function renderRoleStage(role) {
  const stage = {
    child: {
      label: "Child learning loop",
      caption: "Look, make, explain, recall",
      steps: ["Look", "Make", "Explain", "Recall"],
      active: 2
    },
    parent: {
      label: "Family support loop",
      caption: "Consent, assign, reward, review",
      steps: ["Consent", "Assign", "Reward", "Review"],
      active: 3
    },
    teacher: {
      label: "Teaching review loop",
      caption: "Diagnose, reteach, verify, publish",
      steps: ["Diagnose", "Reteach", "Verify", "Publish"],
      active: 1
    },
    school: {
      label: "School operations loop",
      caption: "Roster, launch, monitor, report",
      steps: ["Roster", "Launch", "Monitor", "Report"],
      active: 2
    }
  }[role] || {
    label: "Learning loop",
    caption: "Plan, teach, practice, prove",
    steps: ["Plan", "Teach", "Practice", "Prove"],
    active: 0
  };

  return `
    <figure class="role-stage role-stage-${html(role)}" aria-label="${html(stage.label)}">
      <div class="stage-track">
        ${stage.steps
          .map(
            (step, index) => `
              <span class="${index === stage.active ? "active" : ""}">
                <strong>${index + 1}</strong>
                ${html(step)}
              </span>
            `
          )
          .join("")}
      </div>
      <figcaption>${html(stage.caption)}</figcaption>
    </figure>
  `;
}

function renderExperienceSwitchboard({ eyebrow, title, items }) {
  return `
    <section class="panel wide-panel experience-switchboard">
      <div class="section-head">
        <div>
          <p class="eyebrow">${html(eyebrow)}</p>
          <h2>${html(title)}</h2>
        </div>
      </div>
      <div class="switchboard-grid">
        ${items
          .map(
            (item) => `
              <article class="switchboard-card ${html(item.tone || "")}">
                <span>${html(item.kicker)}</span>
                <h3>${html(item.title)}</h3>
                <p>${html(item.body)}</p>
                ${
                  item.view
                    ? `<button class="small-button" data-view="${html(item.view)}">${html(item.action || "Open")}</button>`
                    : ""
                }
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function learnerMasterySnapshot(learner) {
  const lessons = getTodayPlan(state).filter((lesson) => lesson.academyId === learner.academyId || String(lesson.grade) === String(learner.grade));
  const selected = lessons[0] || getTodayPlan(state)[0];
  const repositoryLesson = getRepositoryCatalogLesson(learner.id, selected?.id || "");
  const repositoryCatalogAvailable = Boolean(repositoryLesson && getRepositoryLearningCatalogStatus({ learnerId: learner.id }).source === "learner-scoped");
  const mastery = repositoryCatalogAvailable
    ? repositoryLesson.mastery || { score: 0, status: "Not started", evidence: "No repository mastery evidence yet." }
    : selected?.mastery || { score: 0, status: "Not started", evidence: "No lesson selected." };
  const placement = state.placementResults?.[learner.id];
  const recall = (state.retentionSchedules || []).find((item) => item.learnerId === learner.id);
  const tutorEvidence = getTutorReflectionEvidence(state, learner.id, selected?.id || "");

  return {
    lesson: selected,
    mastery,
    masterySource: repositoryCatalogAvailable ? "learner-scoped repository" : "local lesson fallback",
    phaseCompletions: repositoryCatalogAvailable ? repositoryLesson.phaseCompletions || [] : [],
    placement,
    recall,
    tutorEvidence
  };
}

function setUiSoundEnabled(enabled) {
  uiSoundEnabled = enabled;
  globalThis.localStorage?.setItem?.(soundPreferenceKey, enabled ? "true" : "false");
}

function playUiSound(tone = "tap") {
  const AudioEngine = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!uiSoundEnabled || !AudioEngine) return;

  const audioContext = new AudioEngine();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const tones = {
    tap: [420, 0.035, 0.018],
    success: [640, 0.06, 0.025],
    switch: [520, 0.045, 0.02],
    blocked: [180, 0.08, 0.022]
  };
  const [frequency, duration, volume] = tones[tone] || tones.tap;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  gain.gain.setValueAtTime(volume, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
  oscillator.addEventListener("ended", () => audioContext.close());
}

function academyLearningPromise(academyId) {
  const promises = {
    foundation: {
      signal: "Play, picture, say it back",
      rhythm: "Short visual lessons with parent-supported practice, movement, and mastery rewards.",
      learnerAction: "See the idea, touch or draw it, explain it, then recall it later."
    },
    bridge: {
      signal: "Quest, investigate, collaborate",
      rhythm: "Independent missions with diagrams, study tools, group roles, and reflection checkpoints.",
      learnerAction: "Build a model, compare strategies, work with a team, then prove the idea."
    },
    scholar: {
      signal: "Course, evidence, portfolio",
      rhythm: "Professional course work with labs, research, credits, capstones, and transcript-style records.",
      learnerAction: "Analyze evidence, defend reasoning, create portfolio artifacts, then transfer the skill."
    }
  };

  return promises[academyId] || promises.foundation;
}

function renderLearningJourneyMap(lesson, experience) {
  const journey = [
    {
      label: "See",
      title: lesson.visual?.title || "Visual model",
      body: lesson.visual?.caption || lesson.objective
    },
    {
      label: "Build",
      title: "Active task",
      body: lesson.funTasks?.[0] || lesson.sections.activity
    },
    {
      label: "Explain",
      title: "Student reasoning",
      body: lesson.sections.challenge || lesson.sections.guidedPractice
    },
    {
      label: "Recall",
      title: "Retention check",
      body: lesson.retentionChecks?.[0] || "Return later and prove the idea still sticks."
    },
    {
      label: "Reward",
      title: "Mastery unlock",
      body: experience.reward || lesson.reward || "Unlock progress after mastery evidence."
    }
  ];

  return `
    <section class="experience-lab" aria-label="Visual learning journey">
      <div class="section-head compact">
        <div>
          <p class="eyebrow">Learning studio</p>
          <h2>See it, build it, explain it, recall it</h2>
        </div>
        <span class="status-pill">${experience.retentionCheckCount} recall checks</span>
      </div>
      <div class="journey-map">
        ${journey
          .map(
            (step, index) => `
              <article class="journey-step">
                <span class="journey-index">${index + 1}</span>
                <div>
                  <strong>${html(step.label)}</strong>
                  <h3>${html(step.title)}</h3>
                  <p>${html(step.body)}</p>
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderPracticeStudio(lesson) {
  return `
    <section class="practice-studio" aria-label="Practice and collaboration plan">
      <div class="task-grid elevated-task-grid">
        <article>
          <span class="task-kicker">Make it active</span>
          <h3>Interesting tasks</h3>
          <ul>
            ${(lesson.funTasks || []).map((task) => `<li>${html(task)}</li>`).join("")}
          </ul>
        </article>
        <article>
          <span class="task-kicker">Make it stick</span>
          <h3>Retention checks</h3>
          <ul>
            ${(lesson.retentionChecks || []).map((check) => `<li>${html(check)}</li>`).join("")}
          </ul>
        </article>
      </div>
      ${
        lesson.groupHomework
          ? `
            <article class="group-homework studio-group-homework">
              <div>
                <p class="eyebrow">Group homework</p>
                <h3>${html(lesson.groupHomework.title)}</h3>
                <p>${html(lesson.groupHomework.sharedOutcome)}</p>
              </div>
              <div>
                <strong>${html(lesson.groupHomework.groupSize)}</strong>
                <p>${html(lesson.groupHomework.roles.join(", "))}</p>
                <small>${html(lesson.groupHomework.parentRole)}</small>
              </div>
            </article>
          `
          : ""
      }
    </section>
  `;
}

async function refreshRepositoryLearningCatalog() {
  const learnerIds = [...new Set(learnerIdsForCurrentSession())];
  if (hasStrictLearnerScope()) {
    repositoryLearningCatalog = repositoryBootstrap?.catalog || null;
    repositoryLearningCatalogError = repositoryLearningCatalog ? null : "Scoped learner bootstrap is unavailable.";
  } else {
    try {
      repositoryLearningCatalog = await fetchLearningCatalog();
      repositoryLearningCatalogError = null;
    } catch (catalogError) {
      repositoryLearningCatalog = null;
      repositoryLearningCatalogError = catalogError?.message || String(catalogError);
    }
  }

  if (!learnerIds.length) {
    repositoryLearningCatalogsByLearner = {};
    repositoryLearningCatalogErrorsByLearner = {};
    return;
  }

  const scopedEntries = await Promise.all(
    learnerIds.map(async (learnerId) => {
      try {
        return [learnerId, { catalog: await fetchLearningCatalog(learnerId), error: null }];
      } catch (catalogError) {
        return [learnerId, { catalog: null, error: catalogError?.message || String(catalogError) }];
      }
    })
  );
  repositoryLearningCatalogsByLearner = Object.fromEntries(scopedEntries.map(([learnerId, entry]) => [learnerId, entry.catalog]));
  repositoryLearningCatalogErrorsByLearner = Object.fromEntries(
    scopedEntries.filter(([, entry]) => entry.error).map(([learnerId, entry]) => [learnerId, entry.error])
  );
}

function getRepositoryInteractiveSignalSummary(options = {}) {
  const scopedCatalog = options.learnerId ? repositoryLearningCatalogsByLearner[options.learnerId] : null;
  const catalog = scopedCatalog || repositoryLearningCatalog;
  if (!catalog) {
    return { total: 0, secure: 0, needsSupport: 0, latest: null, signals: [], lessonCount: 0 };
  }
  return getLearningCatalogInteractiveSignals(catalog, options);
}

function getRepositoryQuizMasterySummary(options = {}) {
  const scopedCatalog = options.learnerId ? repositoryLearningCatalogsByLearner[options.learnerId] : null;
  const catalog = scopedCatalog || repositoryLearningCatalog;
  if (!catalog) {
    return {
      total: 0,
      quizAttempts: 0,
      quizPassed: 0,
      averageQuizScore: 0,
      masteryRecords: 0,
      mastered: 0,
      needsReview: 0,
      averageMasteryScore: 0,
      latest: null,
      evidence: []
    };
  }
  return getLearningCatalogQuizMasterySummary(catalog, options);
}

function getRepositoryLearningCatalogStatus(options = {}) {
  if (options.learnerId && repositoryLearningCatalogsByLearner[options.learnerId]) {
    return { source: "learner-scoped", error: "" };
  }
  if (options.learnerId && repositoryLearningCatalogErrorsByLearner[options.learnerId]) {
    return { source: "learner-scoped", error: repositoryLearningCatalogErrorsByLearner[options.learnerId] };
  }
  return {
    source: repositoryLearningCatalog ? "global" : "unavailable",
    error: repositoryLearningCatalogError || ""
  };
}

function getRepositoryCatalogLesson(learnerId = "", lessonId = "") {
  const scopedCatalog = learnerId ? repositoryLearningCatalogsByLearner[learnerId] : null;
  const catalog = scopedCatalog || repositoryLearningCatalog;
  return catalog?.lessons?.find((item) => item.id === lessonId) || null;
}

function getRepositoryPhaseSummary(learnerId = "") {
  const scopedCatalog = learnerId ? repositoryLearningCatalogsByLearner[learnerId] : null;
  const catalog = scopedCatalog || repositoryLearningCatalog;
  if (!catalog) return { source: "unavailable", lessons: 0, clearedLessons: 0, phases: 0, latest: null };
  const lessons = (catalog.lessons || []).filter((lesson) => lesson.completedPhaseCount > 0);
  const phaseCompletions = lessons.flatMap((lesson) => lesson.phaseCompletions || []);
  return {
    source: scopedCatalog ? "learner-scoped repository" : "global repository",
    lessons: (catalog.lessons || []).length,
    clearedLessons: lessons.length,
    phases: phaseCompletions.length,
    latest: phaseCompletions[0] || null
  };
}

function getRepositoryMasteryAggregate(learnerIds = []) {
  const catalogs = learnerIds.map((learnerId) => repositoryLearningCatalogsByLearner[learnerId]).filter(Boolean);
  if (!learnerIds.length || catalogs.length !== learnerIds.length) {
    return { source: "unavailable", available: false, averageMastery: 0, mastered: 0, needsReview: 0, scoredLessons: 0, phaseSignals: 0 };
  }
  const lessons = catalogs.flatMap((catalog) => catalog.lessons || []);
  const scoredLessons = lessons.filter((lesson) => lesson.mastery && Number.isFinite(Number(lesson.mastery.score)));
  const averageMastery = scoredLessons.length
    ? Math.round(scoredLessons.reduce((sum, lesson) => sum + Number(lesson.mastery.score || 0), 0) / scoredLessons.length)
    : 0;
  const mastered = scoredLessons.filter((lesson) => lesson.mastery.status === "mastered" || Number(lesson.mastery.score || 0) >= 80).length;
  return {
    source: "learner-scoped repository",
    available: true,
    averageMastery,
    mastered,
    needsReview: Math.max(0, scoredLessons.length - mastered),
    scoredLessons: scoredLessons.length,
    phaseSignals: lessons.reduce((sum, lesson) => sum + Number(lesson.completedPhaseCount || 0), 0)
  };
}

function getRepositoryTutorAggregate(learnerIds = []) {
  const entries = learnerIds.map((learnerId) => getRepositoryTutorEventSummary(learnerId));
  if (!learnerIds.length || entries.some((entry) => entry.source !== "learner-scoped")) {
    return { source: "unavailable", available: false, total: 0, feedback: 0, helped: 0, truthReviewed: 0, truthAverage: 0, needsTruthReview: 0 };
  }
  const totals = entries.reduce(
    (summary, entry) => {
      const data = entry.summary || {};
      const reviewed = Number(data.truthReviewed || 0);
      return {
        total: summary.total + Number(data.total || 0),
        feedback: summary.feedback + Number(data.feedback || 0),
        helped: summary.helped + Number(data.helped || 0),
        truthReviewed: summary.truthReviewed + reviewed,
        truthScoreTotal: summary.truthScoreTotal + Number(data.truthAverage || 0) * reviewed,
        needsTruthReview: summary.needsTruthReview + Number(data.needsTruthReview || 0)
      };
    },
    { total: 0, feedback: 0, helped: 0, truthReviewed: 0, truthScoreTotal: 0, needsTruthReview: 0 }
  );
  return {
    source: "learner-scoped repository",
    available: true,
    total: totals.total,
    feedback: totals.feedback,
    helped: totals.helped,
    truthReviewed: totals.truthReviewed,
    truthAverage: totals.truthReviewed ? Math.round((totals.truthScoreTotal / totals.truthReviewed) * 10) / 10 : 0,
    needsTruthReview: totals.needsTruthReview
  };
}

function applyRepositoryLessonMastery(lesson, learnerId = "") {
  const catalogLesson = getRepositoryCatalogLesson(learnerId, lesson?.id || "");
  const catalogStatus = getRepositoryLearningCatalogStatus({ learnerId });
  if (!catalogLesson || catalogStatus.source !== "learner-scoped") return { lesson, source: "local lesson fallback" };
  return {
    source: "learner-scoped repository",
    lesson: {
      ...lesson,
      mastery: catalogLesson.mastery
        ? {
            ...lesson.mastery,
            score: Number(catalogLesson.mastery.score || 0),
            status: catalogLesson.mastery.status || "needs-review",
            evidence: catalogLesson.mastery.evidence || "Repository mastery evidence",
            attempts: Number(catalogLesson.mastery.attempts || 0),
            updatedAt: catalogLesson.mastery.updatedAt || ""
          }
        : { ...lesson.mastery, score: 0, status: "Not started", evidence: "No repository mastery evidence yet.", attempts: 0 }
    }
  };
}

function getRepositoryTutorEventSummary(learnerId = "") {
  const scopedEvents = learnerId ? repositoryTutorEventsByLearner[learnerId] : null;
  const source = scopedEvents || repositoryTutorEvents;
  return {
    source: scopedEvents ? "learner-scoped" : repositoryTutorEvents ? "global" : "unavailable",
    error: learnerId ? repositoryTutorEventErrorsByLearner[learnerId] || "" : repositoryTutorEventsError || "",
    summary: source?.summary || {
      total: 0,
      feedback: 0,
      helped: 0,
      stillConfused: 0,
      needsTruthReview: 0,
      truthAverage: 0,
      visualMode: 0,
      firstPrinciplesMode: 0
    },
    latest: source?.events?.[0] || null,
    events: source?.events || []
  };
}

function getRepositoryRewardApprovalSummary(learnerId = "") {
  const source = learnerId ? repositoryRewardApprovalsByLearner[learnerId] : null;
  return {
    source: source ? "learner-scoped" : "unavailable",
    error: learnerId ? repositoryRewardApprovalErrorsByLearner[learnerId] || "" : "",
    summary: source?.summary || {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      redeemed: 0,
      fulfilled: 0,
      parentActionRequired: 0
    },
    latest: source?.approvals?.[0] || null,
    approvals: source?.approvals || []
  };
}

function getRepositoryScratchpadSummary(learnerId = "") {
  const source = learnerId ? repositoryScratchpadsByLearner[learnerId] : null;
  return {
    source: source ? "learner-scoped" : "unavailable",
    error: learnerId ? repositoryScratchpadErrorsByLearner[learnerId] || "" : "",
    summary: source?.summary || {
      total: 0,
      withWriting: 0,
      withConfusion: 0,
      withRetry: 0,
      tutorReviewed: 0,
      needsTutorReview: 0
    },
    latest: source?.scratchpads?.[0] || null,
    scratchpads: source?.scratchpads || []
  };
}

function repositoryScratchpadForLesson(learnerId = "", lessonId = "") {
  return getRepositoryScratchpadSummary(learnerId).scratchpads.find((scratchpad) => scratchpad.lessonId === lessonId) || null;
}

function repositoryPortfolioEvidenceForLesson(learnerId = "", lessonId = "") {
  const evidence = getRepositoryPortfolioEvidenceSummary(learnerId);
  return {
    portfolioItem: evidence.portfolioItems.find((item) => item.lessonId === lessonId) || null,
    badge: evidence.studentBadges.find((badge) => badge.lessonId === lessonId) || null
  };
}

function getRepositoryAssignmentSummary(learnerId = "") {
  const source = learnerId ? repositoryAssignmentsByLearner[learnerId] : null;
  return {
    source: source ? "learner-scoped" : "unavailable",
    error: learnerId ? repositoryAssignmentErrorsByLearner[learnerId] || "" : "",
    summary: source?.summary || { total: 0, open: 0, completed: 0, dueSoon: 0 },
    assignments: source?.assignments || []
  };
}

function getRepositoryRetentionScheduleSummary(learnerId = "") {
  const source = learnerId ? repositoryRetentionSchedulesByLearner[learnerId] : null;
  return {
    source: source ? "learner-scoped" : "unavailable",
    error: learnerId ? repositoryRetentionScheduleErrorsByLearner[learnerId] || "" : "",
    summary: source?.summary || { total: 0, due: 0, needsReteach: 0, durable: 0, averageMastery: 0 },
    schedules: source?.schedules || []
  };
}

function getRepositoryPortfolioEvidenceSummary(learnerId = "") {
  const source = learnerId ? repositoryPortfolioEvidenceByLearner[learnerId] : null;
  return {
    source: source ? "learner-scoped" : "unavailable",
    error: learnerId ? repositoryPortfolioEvidenceErrorsByLearner[learnerId] || "" : "",
    summary: source?.summary || {
      portfolioItems: 0,
      badgesEarned: 0,
      visibleToParentTeacher: 0,
      masteryArtifacts: 0,
      latestAt: ""
    },
    latestPortfolioItem: source?.latestPortfolioItem || null,
    latestBadge: source?.latestBadge || null,
    portfolioItems: source?.portfolioItems || [],
    studentBadges: source?.studentBadges || []
  };
}

function getRepositoryClassroomEvidenceSummary(options = {}) {
  const source = repositoryClassroomEvidence;
  const classSessionId = options.classSessionId || "";
  const lessonId = options.lessonId || "";
  const learnerId = options.learnerId || "";
  const artifacts = (source?.artifacts || [])
    .filter((artifact) => !classSessionId || artifact.classSessionId === classSessionId)
    .filter((artifact) => !learnerId || artifact.learnerId === learnerId);
  const interventions = (source?.interventions || [])
    .filter((intervention) => !classSessionId || intervention.classSessionId === classSessionId)
    .filter((intervention) => !lessonId || intervention.lessonId === lessonId)
    .filter((intervention) => !learnerId || intervention.learnerId === learnerId);
  return {
    source: source ? "repository" : "unavailable",
    error: repositoryClassroomEvidenceError || "",
    summary: {
      sessions: source?.summary?.sessions || 0,
      missions: source?.summary?.missions || 0,
      artifacts: artifacts.length,
      submittedArtifacts: artifacts.filter((artifact) => artifact.submitted).length,
      interventions: interventions.length,
      openInterventions: interventions.filter((intervention) => intervention.open).length,
      resolvedInterventions: interventions.filter((intervention) => !intervention.open).length
    },
    latestArtifact: artifacts[0] || null,
    latestIntervention: interventions[0] || null,
    artifacts,
    interventions
  };
}

function getRepositoryClassroomMonitor(classSectionId = "") {
  if (repositoryClassroomMonitor && (!classSectionId || repositoryClassroomMonitor.classSection?.id === classSectionId)) {
    return {
      source: "repository",
      error: "",
      monitor: repositoryClassroomMonitor
    };
  }
  return {
    source: "local fallback",
    error: repositoryClassroomMonitorError || "",
    monitor: null
  };
}

function getRepositoryStudentClassroom(learnerId = "") {
  const classroom = learnerId ? repositoryStudentClassroomsByLearner[learnerId] : null;
  return {
    source: classroom ? "repository" : "local fallback",
    error: learnerId ? repositoryStudentClassroomErrorsByLearner[learnerId] || "" : "",
    classroom: classroom || null
  };
}

function getRepositorySchoolOperationsSummary() {
  const source = repositorySchoolOperations;
  return {
    source: source ? "repository" : "local fallback",
    error: repositorySchoolOperationsError || "",
    summary: source?.summary || {
      schools: 0,
      classes: 0,
      learners: 0,
      teachers: 0,
      pendingInvitations: 0,
      activeClasses: 0,
      reports: 0,
      enrolledStudents: 0
    },
    school: source?.school || state.schoolProfile || null,
    classes: source?.classes || state.classSections || [],
    learners: source?.learners || state.learners || [],
    teachers: source?.teachers || (state.localAccounts || [])
      .filter((account) => account.role === "teacher")
      .map((account) => ({ id: account.teacherId || account.id, name: account.displayName || "Teacher" })),
    pendingInvitations: source?.pendingInvitations || (state.accountInvitations || []).filter((item) => item.status === "pending"),
    reports: source?.reports || []
  };
}

function repositoryRewardApprovalForLesson(learnerId = "", lessonId = "") {
  const rewards = getRepositoryRewardApprovalSummary(learnerId);
  return (
    rewards.approvals.find((approval) => approval.lessonId === lessonId) ||
    rewards.approvals.find((approval) => approval.evidence?.lessonId === lessonId) ||
    null
  );
}

function repositoryParentEvidenceForLesson(learnerId = "", lessonId = "") {
  const quizMastery = getRepositoryQuizMasterySummary({ learnerId, lessonId, limit: 1 });
  const reward = repositoryRewardApprovalForLesson(learnerId, lessonId);
  const scratchpad = repositoryScratchpadForLesson(learnerId, lessonId);
  const portfolio = repositoryPortfolioEvidenceForLesson(learnerId, lessonId);
  const catalogLesson = getRepositoryCatalogLesson(learnerId, lessonId);
  const phaseCompletions = Array.isArray(catalogLesson?.phaseCompletions) ? catalogLesson.phaseCompletions : [];
  return {
    quizMastery,
    reward,
    scratchpad,
    portfolio,
    phaseCompletions,
    completedPhaseCount: Number(catalogLesson?.completedPhaseCount || 0),
    hasRepositoryEvidence: Boolean(
      quizMastery.latest || reward || scratchpad || portfolio.portfolioItem || portfolio.badge || phaseCompletions.length
    )
  };
}

function getRepositoryLessonEvidence(learnerId = "", lessonId = "") {
  const quizMastery = getRepositoryQuizMasterySummary({ learnerId, lessonId, limit: 1 });
  const interactive = getRepositoryInteractiveSignalSummary({ learnerId, lessonId, limit: 5 });
  const catalogStatus = getRepositoryLearningCatalogStatus({ learnerId });
  const tutor = getRepositoryTutorEventSummary(learnerId);
  const tutorEvents = tutor.events.filter((event) => !lessonId || event.lessonId === lessonId);
  const reward = repositoryRewardApprovalForLesson(learnerId, lessonId);
  const scratchpad = repositoryScratchpadForLesson(learnerId, lessonId);
  const catalogLesson = getRepositoryCatalogLesson(learnerId, lessonId);
  const phaseCompletions = Array.isArray(catalogLesson?.phaseCompletions) ? catalogLesson.phaseCompletions : [];
  const phaseEvidenceSource = catalogLesson ? "learner-scoped repository" : "local lesson fallback";
  const lesson = findLessonInState(state, lessonId) || currentLesson();
  const widgetId = getLessonInteractiveConfig(lesson).widgetId;
  const interactiveSignal =
    interactive.signals.find((signal) => signal.widgetId === widgetId) ||
    interactive.signals.find((signal) => signal.lessonId === lessonId) ||
    null;
  const latest = quizMastery.latest || null;
  return {
    source: quizMastery.latest || reward || tutorEvents.length || scratchpad || interactiveSignal ? "learner-scoped repository" : "local lesson fallback",
    catalogSource: catalogStatus.source,
    phaseEvidenceSource,
    phaseCompletions,
    completedPhaseCount: Number(catalogLesson?.completedPhaseCount || 0),
    error: catalogStatus.error || tutor.error || "",
    quizMastery,
    interactive,
    interactiveSignal,
    interactiveResponse: interactiveSignal
      ? {
          value: interactiveSignal.value || "",
          correct: Boolean(interactiveSignal.correct),
          feedback: interactiveSignal.diagnosis || interactiveSignal.recommendedSupport || "",
          attempts: Number(interactiveSignal.attempts || 0),
          source: "learner-scoped repository",
          updatedAt: interactiveSignal.updatedAt || ""
        }
      : null,
    reward,
    scratchpad,
    tutor: {
      ...tutor,
      latest: tutorEvents[0] || null,
      events: tutorEvents
    },
    quizResult: latest?.hasQuizAttempt
      ? {
          score: latest.quizScore,
          passed: latest.quizPassed,
          source: "learner-scoped repository",
          attemptedAt: latest.quizAttemptedAt
        }
      : null,
    mastery: latest?.hasMastery
      ? {
          score: latest.masteryScore,
          status: latest.masteryStatus || (latest.masteryScore >= 80 ? "mastered" : "needs-review"),
          attempts: latest.masteryAttempts,
          evidence: latest.masteryEvidence,
          source: "learner-scoped repository",
          updatedAt: latest.masteryUpdatedAt
        }
      : null
  };
}

function repositoryRewardApprovalToRequest(approval = {}) {
  const learner = state.learners.find((item) => item.id === approval.learnerId);
  return {
    id: approval.id,
    learnerId: approval.learnerId,
    learnerName: learner?.name || approval.learnerId || "Learner",
    rewardLevel: approval.rewardLevel,
    rewardTitle: approval.rewardTitle,
    rewardBenefit: approval.rewardBenefit,
    status: approval.status,
    requestedBy: approval.requestedBy,
    requestedAt: approval.requestedAt,
    reviewedBy: approval.reviewedBy,
    reviewedAt: approval.reviewedAt,
    evidence: approval.evidence,
    parentNote: approval.parentNote,
    source: approval.source,
    fulfillment: approval.fulfillmentProvider || approval.fulfillmentStatus
      ? {
          provider: approval.fulfillmentProvider,
          status: approval.fulfillmentStatus,
          providerReference: approval.fulfillmentReference,
          requestedAt: approval.fulfillmentRequestedAt,
          completedAt: approval.fulfillmentCompletedAt
        }
      : null
  };
}

async function refreshRepositoryContentDrafts() {
  try {
    repositoryContentDrafts = await fetchContentDrafts();
    repositoryContentDraftsError = null;
  } catch (draftError) {
    repositoryContentDrafts = null;
    repositoryContentDraftsError = draftError?.message || String(draftError);
  }
}

async function refreshRepositoryVisualAssets(options = {}) {
  try {
    repositoryVisualAssets = await fetchVisualAssets(options);
    repositoryVisualAssetsError = null;
  } catch (assetError) {
    repositoryVisualAssets = null;
    repositoryVisualAssetsError = assetError?.message || String(assetError);
  }
}

async function refreshRepositoryTutorEvents() {
  if (hasStrictLearnerScope()) {
    repositoryTutorEvents = null;
    repositoryTutorEventsError = null;
  } else {
    try {
      repositoryTutorEvents = await fetchTutorEvents();
      repositoryTutorEventsError = null;
    } catch (eventError) {
      repositoryTutorEvents = null;
      repositoryTutorEventsError = eventError?.message || String(eventError);
    }
  }

  const learnerIds = [...new Set(learnerIdsForCurrentSession())];
  if (!learnerIds.length) {
    repositoryLearningEventsByLearner = {};
    repositoryLearningEventErrorsByLearner = {};
    repositoryTutorEventsByLearner = {};
    repositoryTutorEventErrorsByLearner = {};
    repositoryRewardApprovalsByLearner = {};
    repositoryRewardApprovalErrorsByLearner = {};
    repositoryScratchpadsByLearner = {};
    repositoryScratchpadErrorsByLearner = {};
    repositoryAssignmentsByLearner = {};
    repositoryAssignmentErrorsByLearner = {};
    repositoryRetentionSchedulesByLearner = {};
    repositoryRetentionScheduleErrorsByLearner = {};
    repositoryPortfolioEvidenceByLearner = {};
    repositoryPortfolioEvidenceErrorsByLearner = {};
    repositoryStudentClassroomsByLearner = {};
    repositoryStudentClassroomErrorsByLearner = {};
    return;
  }

  const learningEventEntries = await Promise.all(
    learnerIds.map(async (learnerId) => {
      try {
        return [learnerId, { events: await fetchLearningEvents({ learnerId }), error: null }];
      } catch (eventError) {
        return [learnerId, { events: null, error: eventError?.message || String(eventError) }];
      }
    })
  );
  repositoryLearningEventsByLearner = Object.fromEntries(learningEventEntries.map(([learnerId, entry]) => [learnerId, entry.events]));
  repositoryLearningEventErrorsByLearner = Object.fromEntries(
    learningEventEntries.filter(([, entry]) => entry.error).map(([learnerId, entry]) => [learnerId, entry.error])
  );
  for (const [learnerId, entry] of learningEventEntries) {
    if (entry.events?.events?.length) {
      state = mergeRepositoryLearningEvents(state, entry.events);
    }
  }

  const tutorEntries = await Promise.all(
    learnerIds.map(async (learnerId) => {
      try {
        return [learnerId, { events: await fetchTutorEvents({ learnerId }), error: null }];
      } catch (eventError) {
        return [learnerId, { events: null, error: eventError?.message || String(eventError) }];
      }
    })
  );
  repositoryTutorEventsByLearner = Object.fromEntries(tutorEntries.map(([learnerId, entry]) => [learnerId, entry.events]));
  repositoryTutorEventErrorsByLearner = Object.fromEntries(
    tutorEntries.filter(([, entry]) => entry.error).map(([learnerId, entry]) => [learnerId, entry.error])
  );

  const rewardEntries = await Promise.all(
    learnerIds.map(async (learnerId) => {
      try {
        return [learnerId, { rewards: await fetchRewardApprovals({ learnerId }), error: null }];
      } catch (rewardError) {
        return [learnerId, { rewards: null, error: rewardError?.message || String(rewardError) }];
      }
    })
  );
  repositoryRewardApprovalsByLearner = Object.fromEntries(rewardEntries.map(([learnerId, entry]) => [learnerId, entry.rewards]));
  repositoryRewardApprovalErrorsByLearner = Object.fromEntries(
    rewardEntries.filter(([, entry]) => entry.error).map(([learnerId, entry]) => [learnerId, entry.error])
  );

  const scratchpadEntries = await Promise.all(
    learnerIds.map(async (learnerId) => {
      try {
        return [learnerId, { scratchpads: await fetchLessonScratchpads({ learnerId }), error: null }];
      } catch (scratchpadError) {
        return [learnerId, { scratchpads: null, error: scratchpadError?.message || String(scratchpadError) }];
      }
    })
  );
  repositoryScratchpadsByLearner = Object.fromEntries(scratchpadEntries.map(([learnerId, entry]) => [learnerId, entry.scratchpads]));
  repositoryScratchpadErrorsByLearner = Object.fromEntries(
    scratchpadEntries.filter(([, entry]) => entry.error).map(([learnerId, entry]) => [learnerId, entry.error])
  );

  const assignmentEntries = await Promise.all(
    learnerIds.map(async (learnerId) => {
      try {
        return [learnerId, { assignments: await fetchAssignments({ learnerId }), error: null }];
      } catch (assignmentError) {
        return [learnerId, { assignments: null, error: assignmentError?.message || String(assignmentError) }];
      }
    })
  );
  repositoryAssignmentsByLearner = Object.fromEntries(assignmentEntries.map(([learnerId, entry]) => [learnerId, entry.assignments]));
  repositoryAssignmentErrorsByLearner = Object.fromEntries(
    assignmentEntries.filter(([, entry]) => entry.error).map(([learnerId, entry]) => [learnerId, entry.error])
  );

  const retentionEntries = await Promise.all(
    learnerIds.map(async (learnerId) => {
      try {
        return [learnerId, { schedules: await fetchRetentionSchedules({ learnerId }), error: null }];
      } catch (retentionError) {
        return [learnerId, { schedules: null, error: retentionError?.message || String(retentionError) }];
      }
    })
  );
  repositoryRetentionSchedulesByLearner = Object.fromEntries(retentionEntries.map(([learnerId, entry]) => [learnerId, entry.schedules]));
  repositoryRetentionScheduleErrorsByLearner = Object.fromEntries(
    retentionEntries.filter(([, entry]) => entry.error).map(([learnerId, entry]) => [learnerId, entry.error])
  );

  const portfolioEntries = await Promise.all(
    learnerIds.map(async (learnerId) => {
      try {
        return [learnerId, { evidence: await fetchPortfolioEvidence({ learnerId }), error: null }];
      } catch (portfolioError) {
        return [learnerId, { evidence: null, error: portfolioError?.message || String(portfolioError) }];
      }
    })
  );
  repositoryPortfolioEvidenceByLearner = Object.fromEntries(portfolioEntries.map(([learnerId, entry]) => [learnerId, entry.evidence]));
  repositoryPortfolioEvidenceErrorsByLearner = Object.fromEntries(
    portfolioEntries.filter(([, entry]) => entry.error).map(([learnerId, entry]) => [learnerId, entry.error])
  );

  const classroomEntries = await Promise.all(
    learnerIds.map(async (learnerId) => {
      try {
        return [learnerId, { classroom: await fetchClassroomStudent({ learnerId }), error: null }];
      } catch (classroomError) {
        return [learnerId, { classroom: null, error: classroomError?.message || String(classroomError) }];
      }
    })
  );
  repositoryStudentClassroomsByLearner = Object.fromEntries(classroomEntries.map(([learnerId, entry]) => [learnerId, entry.classroom]));
  repositoryStudentClassroomErrorsByLearner = Object.fromEntries(
    classroomEntries.filter(([, entry]) => entry.error).map(([learnerId, entry]) => [learnerId, entry.error])
  );
}

async function refreshRepositoryAgentReviews() {
  try {
    repositoryAgentReviews = await fetchAgentReviewItems({ status: "pending" });
    repositoryAgentReviewsError = null;
  } catch (reviewError) {
    repositoryAgentReviews = null;
    repositoryAgentReviewsError = reviewError?.message || String(reviewError);
  }
}

async function refreshRepositoryAuditEvents() {
  if (currentSession?.role !== "platform-admin") {
    repositoryAuditEvents = null;
    repositoryAuditEventsError = null;
    return;
  }
  try {
    repositoryAuditEvents = await fetchAuditEvents({ limit: 80 });
    repositoryAuditEventsError = null;
  } catch (auditError) {
    repositoryAuditEvents = null;
    repositoryAuditEventsError = auditError?.message || String(auditError);
  }
}

async function refreshRepositoryClassroomEvidence() {
  const access = getAccessSummary(currentSession);
  if (!access.allowedViews.includes("teacher") && !access.allowedViews.includes("school")) {
    repositoryClassroomEvidence = null;
    repositoryClassroomEvidenceError = null;
    return;
  }
  try {
    repositoryClassroomEvidence = await fetchClassroomEvidence({ limit: 10000 });
    repositoryClassroomEvidenceError = null;
  } catch (classroomError) {
    repositoryClassroomEvidence = null;
    repositoryClassroomEvidenceError = classroomError?.message || String(classroomError);
  }
}

async function refreshRepositoryClassroomMonitor() {
  const access = getAccessSummary(currentSession);
  if (!access.allowedViews.includes("teacher") && !access.allowedViews.includes("school")) {
    repositoryClassroomMonitor = null;
    repositoryClassroomMonitorError = null;
    return;
  }
  try {
    repositoryClassroomMonitor = await fetchClassroomMonitor({ limit: 10000 });
    repositoryClassroomMonitorError = null;
  } catch (monitorError) {
    repositoryClassroomMonitor = null;
    repositoryClassroomMonitorError = monitorError?.message || String(monitorError);
  }
}

async function refreshRepositorySchoolOperations() {
  const access = getAccessSummary(currentSession);
  if (!access.allowedViews.includes("school")) {
    repositorySchoolOperations = null;
    repositorySchoolOperationsError = null;
    return;
  }
  try {
    repositorySchoolOperations = await fetchSchoolOverview();
    repositorySchoolOperationsError = null;
  } catch (schoolError) {
    repositorySchoolOperations = null;
    repositorySchoolOperationsError = schoolError?.message || String(schoolError);
  }
}

async function refreshRepositoryAccountSecurity() {
  const access = getAccessSummary(currentSession);
  if (!access.allowedViews.includes("setup")) {
    repositoryAccountSecurity = null;
    repositoryAccountSecurityError = null;
    return;
  }
  try {
    repositoryAccountSecurity = await fetchAuthSecurity({ limit: 10000 });
    repositoryAccountSecurityError = null;
  } catch (securityError) {
    repositoryAccountSecurity = null;
    repositoryAccountSecurityError = securityError?.message || String(securityError);
  }
}

async function refreshRepositoryStateDependencyAudit() {
  if (currentSession?.role !== "platform-admin") {
    repositoryStateDependencyAudit = null;
    repositoryStateDependencyAuditError = null;
    return;
  }
  try {
    repositoryStateDependencyAudit = await fetchStateDependencyAudit();
    repositoryStateDependencyAuditError = null;
  } catch (dependencyError) {
    repositoryStateDependencyAudit = null;
    repositoryStateDependencyAuditError = dependencyError?.message || String(dependencyError);
  }
}

async function refreshRepositoryReadModels() {
  const access = getAccessSummary(currentSession);
  const tasks = [refreshRepositoryLearningCatalog()];

  if (access.allowedViews.includes("admin")) {
    tasks.push(refreshRepositoryContentDrafts());
  } else {
    repositoryContentDrafts = null;
    repositoryContentDraftsError = null;
  }

  if (access.allowedViews.includes("visuals") || access.allowedViews.includes("admin")) {
    tasks.push(refreshRepositoryVisualAssets());
  } else if (currentSession?.role === "student") {
    tasks.push(refreshRepositoryVisualAssets({ status: "approved" }));
  } else {
    repositoryVisualAssets = null;
    repositoryVisualAssetsError = null;
  }

  if (access.allowedViews.includes("ai")) {
    tasks.push(refreshRepositoryTutorEvents());
  } else {
    repositoryTutorEvents = null;
    repositoryTutorEventsError = null;
  }

  if (access.allowedViews.includes("tools") || access.allowedViews.includes("admin")) {
    tasks.push(refreshRepositoryAgentReviews());
  } else {
    repositoryAgentReviews = null;
    repositoryAgentReviewsError = null;
  }

  if (access.allowedViews.includes("teacher") || access.allowedViews.includes("school")) {
    tasks.push(refreshRepositoryClassroomEvidence());
    tasks.push(refreshRepositoryClassroomMonitor());
  } else {
    repositoryClassroomEvidence = null;
    repositoryClassroomEvidenceError = null;
    repositoryClassroomMonitor = null;
    repositoryClassroomMonitorError = null;
  }

  if (access.allowedViews.includes("school")) {
    tasks.push(refreshRepositorySchoolOperations());
  } else {
    repositorySchoolOperations = null;
    repositorySchoolOperationsError = null;
  }

  if (access.allowedViews.includes("setup")) {
    tasks.push(refreshRepositoryAccountSecurity());
  } else {
    repositoryAccountSecurity = null;
    repositoryAccountSecurityError = null;
  }

  if (access.isAdmin) {
    tasks.push(refreshRepositoryAuditEvents());
  } else {
    repositoryAuditEvents = null;
    repositoryAuditEventsError = null;
  }

  if (currentSession?.role === "platform-admin") {
    tasks.push(refreshRepositoryStateDependencyAudit());
  } else {
    repositoryStateDependencyAudit = null;
    repositoryStateDependencyAuditError = null;
  }

  await Promise.all(tasks);
}

async function refreshLearningActionReadModels() {
  const access = getAccessSummary(currentSession);
  const tasks = [refreshRepositoryLearningCatalog()];
  tasks.push(refreshRepositoryTutorEvents());
  if (currentSession?.role === "student") tasks.push(refreshRepositoryVisualAssets({ status: "approved" }));
  await Promise.all(tasks);
}

async function refreshAuthSession() {
  try {
    const auth = await fetchAuthSession();
    currentSession = auth.session;
    currentGiftCardReadiness = auth.giftCards || null;
    activeView = getAuthorizedView(activeView, currentSession);
  } catch (sessionError) {
    currentSession = {
      authenticated: false,
      role: "anonymous",
      scope: "none",
      userId: "",
      error: sessionError?.message || String(sessionError)
    };
    currentGiftCardReadiness = null;
    activeView = getAuthorizedView(activeView, currentSession);
  }
}

async function refreshRuntimeConfiguration() {
  try {
    currentRuntimeConfiguration = await fetchRuntimeConfiguration();
    currentRuntimeConfigurationError = null;
  } catch (error) {
    currentRuntimeConfiguration = null;
    currentRuntimeConfigurationError = error?.message || String(error);
  }
}

async function refreshRuntimeHealth() {
  if (!["school-admin", "platform-admin"].includes(currentSession?.role)) {
    currentRuntimeHealth = null;
    currentRuntimeHealthError = null;
    return;
  }
  try {
    currentRuntimeHealth = await fetchRuntimeHealth();
    currentRuntimeHealthError = null;
  } catch (error) {
    currentRuntimeHealth = error?.payload || { healthy: false };
    currentRuntimeHealthError = error?.message || String(error);
  }
}

async function hydrateFromServer() {
  try {
    await Promise.all([refreshAuthSession(), refreshRuntimeConfiguration()]);
    await refreshRuntimeHealth();
    try {
      repositoryBootstrap = await fetchRoleScopedBootstrap();
      repositoryLearnerProfiles = repositoryBootstrap.learnerProfiles || null;
      repositoryLearningCatalog = repositoryBootstrap.catalog || repositoryLearningCatalog;
      repositoryLearningCatalogError = null;
      repositoryLearningCatalogsByLearner = repositoryBootstrap.catalogsByLearner || {};
      repositoryLearningCatalogErrorsByLearner = {};
      if (repositoryBootstrap.visualAssets) {
        repositoryVisualAssets = repositoryBootstrap.visualAssets;
        repositoryVisualAssetsError = null;
      }
    } catch (bootstrapError) {
      repositoryBootstrap = null;
      repositoryLearnerProfiles = null;
      if (hasStrictLearnerScope()) {
        state = isolateStateForStrictLearnerScope(state);
        repositoryLearningCatalogError = "Scoped learner bootstrap is unavailable; cached learner records are withheld.";
      }
    }
    const scopedRepositoryPathReady = hasStrictLearnerScope() && Boolean(repositoryBootstrap?.catalog && repositoryBootstrap?.learnerProfiles);
    if (scopedRepositoryPathReady) {
      state = mergeRepositoryLearnerProfiles(state, repositoryBootstrap.learnerProfiles);
      state = mergeRepositoryLearningCatalog(state, repositoryBootstrap.catalog);
    } else if (hasStrictLearnerScope()) {
      // A scoped session must not fall back to the broad snapshot when a focused
      // bootstrap is unavailable. Isolate cached records before rendering.
      state = isolateStateForStrictLearnerScope(state);
      repositoryLearningCatalogError = "Scoped learner bootstrap is unavailable; cached learner records are withheld.";
    } else {
      const persisted = await fetchPersistedState();
      state = mergePersistedState(state, persisted);
    }
    await refreshRepositoryReadModels();
    saveState(state);
    render();
  } catch (error) {
    if (hasStrictLearnerScope()) state = isolateStateForStrictLearnerScope(state);
    state = markPersistenceError(state, error);
    saveState(state);
    render();
  }
}

function persistNow() {
  saveState(state);
  // Learner-facing sessions use scoped feature writes. Navigation, selected answers,
  // and local-only UI choices must never fall back to the broad snapshot route.
  if (hasStrictLearnerScope()) return;
  if (syncInFlight) return;
  syncInFlight = true;
  putPersistedState(state)
    .then(async (persisted) => {
      state = mergePersistedState(state, persisted);
      await refreshRepositoryReadModels();
      saveState(state);
      render();
    })
    .catch((error) => {
      state = markPersistenceError(state, error);
      saveState(state);
      render();
    })
    .finally(() => {
      syncInFlight = false;
    });
}

function submitLessonQuiz(lessonId) {
  const answers = state.selectedAnswers[lessonId] || {};
  const learnerId = currentSession?.studentId || currentLearner()?.id || "";
  state = completeLessonQuiz(state, lessonId, answers, { learnerId });
  const quizResult = state.quizResults?.[lessonId];
  announceLearningMoment(
    quizResult?.passed
      ? `Checkpoint cleared: ${quizResult.score}% and a mastery path is open.`
      : "Checkpoint recorded. Your retry path is ready; mistakes are useful evidence.",
    quizResult?.passed ? "success" : "retry"
  );
  saveState(state);
  postLessonQuiz(lessonId, answers, learnerId)
    .then(async (payload) => {
      state = mergePersistedState(state, payload.state);
      await refreshLearningActionReadModels();
      saveState(state);
      render();
    })
    .catch((error) => {
      state = markPersistenceError(state, error);
      saveState(state);
      render();
    });
}

function getLessonProductionVisualAsset(lesson, preferredPlacements, options = {}) {
  return getApprovedLessonVisualAsset(
    {
      visualAssets: [
        ...(state.visualAssets || []),
        ...(repositoryVisualAssets?.assets || [])
      ]
    },
    lesson.id,
    {
      preferredPlacements,
      requirePreferredPlacement: Boolean(options.requirePreferredPlacement)
    }
  );
}

function renderProductionVisualFigure(asset, fallbackAlt, options = {}) {
  if (!asset) return "";
  const source = asset.storagePublicUrl || asset.assetUrl;
  if (!source) return "";
  const caption = asset.caption || fallbackAlt;
  return `
    <figure class="visual-prompt production-lesson-visual ${html(options.className || "")}">
      <div class="production-visual-frame">
        <img src="${html(source)}" alt="${html(asset.altText || caption)}" loading="lazy" />
      </div>
      <figcaption>
        <strong>${html(asset.title || options.title || "Production visual")}</strong>
        <span>${html(caption)}</span>
        <small>${html(options.reviewLabel || "Production visual passed quality review.")}</small>
      </figcaption>
    </figure>
  `;
}

function renderLessonVisualSummary(lesson) {
  const visual = lesson.visual || {};
  const title = visual.title || lesson.title;
  const caption = visual.caption || lesson.objective;
  const type = visual.type ? `Model type: ${visual.type.replaceAll("-", " ")}` : "Production visual model";
  return `
    <div class="classroom-visual-summary">
      <strong>${html(title)}</strong>
      <p>${html(caption)}</p>
      <small>${html(type)}</small>
    </div>
  `;
}

function renderLessonVisual(lesson) {
  const approvedAsset = getLessonProductionVisualAsset(lesson, ["teaching-diagram", "lesson-hero"]);
  if (approvedAsset) {
    return renderProductionVisualFigure(approvedAsset, lesson.objective);
  }
  if (!lesson.visual) return "";

  const commonLabel = `${html(lesson.visual.title)}: ${html(lesson.visual.caption)}`;
  const svgByType = {
    "number-line": `
      <svg viewBox="0 0 640 210" role="img" aria-label="${commonLabel}">
        <rect width="640" height="210" rx="8" fill="#fff8ea"></rect>
        <line x1="72" y1="122" x2="568" y2="122" stroke="#172033" stroke-width="5"></line>
        ${[0, 1, 2, 3, 4].map((tick) => `<line x1="${72 + tick * 124}" y1="104" x2="${72 + tick * 124}" y2="140" stroke="#172033" stroke-width="4"></line>`).join("")}
        <text x="64" y="168" font-size="22" font-weight="700" fill="#172033">0</text>
        <text x="552" y="168" font-size="22" font-weight="700" fill="#172033">1</text>
        <circle cx="320" cy="122" r="18" fill="#e85d4f"></circle>
        <text x="298" y="84" font-size="24" font-weight="800" fill="#e85d4f">1/2 = 2/4</text>
        <path d="M196 62 C238 34 290 34 332 62" fill="none" stroke="#2f8f83" stroke-width="5"></path>
        <path d="M320 62 C370 30 438 30 488 62" fill="none" stroke="#4867b1" stroke-width="5"></path>
      </svg>
    `,
    "weather-map": `
      <svg viewBox="0 0 640 210" role="img" aria-label="${commonLabel}">
        <rect width="640" height="210" rx="8" fill="#eaf4ff"></rect>
        <path d="M42 150 C130 82 180 176 274 112 C352 58 438 82 596 40" fill="none" stroke="#4867b1" stroke-width="8"></path>
        <path d="M58 66 C150 34 204 68 268 50 C336 30 430 52 574 84" fill="none" stroke="#e85d4f" stroke-width="8"></path>
        <circle cx="172" cy="126" r="36" fill="#ffffff" stroke="#172033" stroke-width="4"></circle>
        <text x="154" y="134" font-size="26" font-weight="900" fill="#172033">H</text>
        <circle cx="456" cy="92" r="36" fill="#ffffff" stroke="#172033" stroke-width="4"></circle>
        <text x="440" y="100" font-size="26" font-weight="900" fill="#172033">L</text>
        <g stroke="#2f8f83" stroke-width="5" fill="none">
          <path d="M246 158 l44 -28 l-8 18"></path>
          <path d="M384 148 l54 -16 l-14 15"></path>
          <path d="M112 96 l48 18 l-18 8"></path>
        </g>
        <text x="48" y="188" font-size="20" font-weight="800" fill="#172033">Pressure + wind + temperature = evidence-based forecast</text>
      </svg>
    `,
    "cell-diagram": `
      <svg viewBox="0 0 640 210" role="img" aria-label="${commonLabel}">
        <rect width="640" height="210" rx="8" fill="#edf8f2"></rect>
        <ellipse cx="316" cy="108" rx="236" ry="82" fill="#ffffff" stroke="#172033" stroke-width="5"></ellipse>
        <circle cx="274" cy="104" r="42" fill="#4867b1"></circle>
        <text x="238" y="110" font-size="18" font-weight="900" fill="#ffffff">Nucleus</text>
        <ellipse cx="410" cy="78" rx="48" ry="22" fill="#e85d4f"></ellipse>
        <text x="368" y="84" font-size="16" font-weight="900" fill="#ffffff">Energy</text>
        <rect x="384" y="130" width="92" height="34" rx="17" fill="#c9942c"></rect>
        <text x="398" y="153" font-size="16" font-weight="900" fill="#172033">Transport</text>
        <circle cx="194" cy="134" r="20" fill="#2f8f83"></circle>
        <circle cx="494" cy="114" r="18" fill="#6f5aa6"></circle>
        <text x="68" y="188" font-size="20" font-weight="800" fill="#172033">A living system works when each structure does its job.</text>
      </svg>
    `,
    "ai-system-map": `
      <svg viewBox="0 0 760 280" role="img" aria-label="${commonLabel}">
        <defs>
          <linearGradient id="aiMapBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#061329"></stop>
            <stop offset="54%" stop-color="#14103a"></stop>
            <stop offset="100%" stop-color="#290b2f"></stop>
          </linearGradient>
        </defs>
        <rect width="760" height="280" rx="18" fill="url(#aiMapBg)"></rect>
        <g stroke="#25d9ff" stroke-width="4" fill="none" opacity="0.92">
          <path d="M134 86 H274"></path>
          <path d="M394 86 H536"></path>
          <path d="M596 116 V188 H454"></path>
          <path d="M334 116 V188 H218"></path>
          <path d="M218 218 H536"></path>
        </g>
        ${[
          [42, 50, 110, 72, "#25d9ff", "Goal", "What are we building?"],
          [274, 50, 120, 72, "#ff4fd8", "Prompt", "Role + task + rules"],
          [536, 50, 136, 72, "#9cff4f", "AI output", "Review before use"],
          [92, 180, 126, 72, "#ffcc4f", "Frontend", "Screens + clicks"],
          [334, 180, 120, 72, "#25d9ff", "Backend", "API + rules"],
          [536, 180, 132, 72, "#ff4fd8", "Test loop", "Bug -> fix -> retest"]
        ]
          .map(
            ([x, y, width, height, color, title, body]) => `
              <g>
                <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="16" fill="rgba(255,255,255,0.08)" stroke="${color}" stroke-width="3"></rect>
                <text x="${x + width / 2}" y="${y + 30}" text-anchor="middle" font-size="18" font-weight="900" fill="#ffffff">${title}</text>
                <text x="${x + width / 2}" y="${y + 54}" text-anchor="middle" font-size="12" font-weight="800" fill="${color}">${body}</text>
              </g>
            `
          )
          .join("")}
        <text x="380" y="24" text-anchor="middle" font-size="18" font-weight="900" fill="#ffffff">Learning AI means building, checking, and improving a system.</text>
      </svg>
    `,
    "story-map": `
      <svg viewBox="0 0 640 210" role="img" aria-label="${commonLabel}">
        <rect width="640" height="210" rx="8" fill="#fff4f1"></rect>
        <rect x="230" y="68" width="180" height="74" rx="10" fill="#e85d4f"></rect>
        <text x="268" y="112" font-size="24" font-weight="900" fill="#ffffff">Main Idea</text>
        ${[
          [66, 34, "Detail 1"],
          [460, 34, "Detail 2"],
          [84, 148, "Detail 3"],
          [454, 148, "Detail 4"]
        ].map(([x, y, label]) => `<rect x="${x}" y="${y}" width="118" height="38" rx="8" fill="#ffffff" stroke="#172033" stroke-width="3"></rect><text x="${x + 18}" y="${y + 25}" font-size="16" font-weight="800" fill="#172033">${label}</text>`).join("")}
        <g stroke="#172033" stroke-width="3">
          <line x1="230" y1="88" x2="184" y2="53"></line>
          <line x1="410" y1="88" x2="460" y2="53"></line>
          <line x1="230" y1="128" x2="202" y2="166"></line>
          <line x1="410" y1="128" x2="454" y2="166"></line>
        </g>
      </svg>
    `,
    "ecosystem-model": `
      <svg viewBox="0 0 640 210" role="img" aria-label="${commonLabel}">
        <rect width="640" height="210" rx="8" fill="#edf8f2"></rect>
        <circle cx="96" cy="58" r="34" fill="#c9942c"></circle>
        <rect x="248" y="118" width="34" height="46" fill="#2f8f83"></rect>
        <circle cx="265" cy="102" r="34" fill="#2f8f83"></circle>
        <ellipse cx="418" cy="132" rx="58" ry="26" fill="#e85d4f"></ellipse>
        <circle cx="382" cy="122" r="9" fill="#172033"></circle>
        <path d="M118 70 C176 78 208 92 236 104" fill="none" stroke="#172033" stroke-width="4" marker-end="url(#arrow)"></path>
        <path d="M296 114 C334 106 360 112 382 124" fill="none" stroke="#172033" stroke-width="4"></path>
        <path d="M438 156 C400 184 284 184 230 158" fill="none" stroke="#4867b1" stroke-width="4"></path>
        <text x="58" y="168" font-size="20" font-weight="800" fill="#172033">Sun -> plants -> animals -> soil cycle</text>
      </svg>
    `,
    "community-map": `
      <svg viewBox="0 0 640 210" role="img" aria-label="${commonLabel}">
        <rect width="640" height="210" rx="8" fill="#f8f4ea"></rect>
        <path d="M74 0 C122 70 92 122 150 210" fill="none" stroke="#4867b1" stroke-width="22"></path>
        <path d="M0 146 C172 126 350 154 640 116" fill="none" stroke="#c9942c" stroke-width="12"></path>
        <rect x="252" y="58" width="70" height="52" rx="8" fill="#ffffff" stroke="#172033" stroke-width="4"></rect>
        <text x="264" y="90" font-size="18" font-weight="900" fill="#172033">School</text>
        <circle cx="456" cy="66" r="34" fill="#2f8f83"></circle>
        <text x="426" y="126" font-size="18" font-weight="900" fill="#172033">Park</text>
        <rect x="492" y="138" width="86" height="42" rx="8" fill="#e85d4f"></rect>
        <text x="510" y="165" font-size="18" font-weight="900" fill="#ffffff">Town</text>
        <text x="44" y="42" font-size="22" font-weight="900" fill="#172033">N</text>
        <path d="M54 52 l0 42 m-18 -22 l36 0" stroke="#172033" stroke-width="4"></path>
      </svg>
    `
  };

  return `
    <figure class="visual-prompt">
      ${svgByType[lesson.visual.type] || svgByType["number-line"]}
      <figcaption>
        <strong>${html(lesson.visual.title)}</strong>
        <span>${html(lesson.visual.caption)}</span>
      </figcaption>
    </figure>
  `;
}

function renderLessonEvidenceMoves(lesson, audit) {
  if (!audit.required) return "";

  return `
    <section class="evidence-panel" aria-label="Evidence-backed teaching moves">
      <div class="section-head compact">
        <div>
          <p class="eyebrow">Evidence guidance audit</p>
          <h2>Evidence-backed teaching moves</h2>
        </div>
        <span class="status-pill">${audit.passed ? "Passed" : "Needs work"}</span>
      </div>
      <div class="evidence-grid">
        ${audit.requiredMoves
          .map((move) => {
            const value = lesson.evidenceMoves?.[move.key];
            const body = Array.isArray(value) ? value.join(", ") : value;
            return `
              <article class="evidence-card">
                <span>${body ? "Pass" : "Check"}</span>
                <h3>${html(move.label)}</h3>
                <p>${html(body || move.auditQuestion)}</p>
                <small>${html(move.sourceIds.join(", "))}</small>
              </article>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderTeachingDiagram(lesson, support) {
  const callouts = support.diagramCallouts.slice(0, 3);
  while (callouts.length < 3) {
    callouts.push({
      title: "Explain",
      body: lesson.sections.challenge
    });
  }

  return `
    <figure class="teaching-diagram">
      <svg viewBox="0 0 760 280" role="img" aria-label="${html(`${lesson.title} teaching diagram`)}">
        <rect width="760" height="280" rx="8" fill="#ffffff"></rect>
        <path d="M132 142 C230 62 336 62 434 142 C510 204 594 204 668 142" fill="none" stroke="#172033" stroke-width="5"></path>
        <g>
          <circle cx="132" cy="142" r="58" fill="#4867b1"></circle>
          <text x="132" y="136" text-anchor="middle" font-size="20" font-weight="900" fill="#ffffff">See</text>
          <text x="132" y="160" text-anchor="middle" font-size="14" font-weight="800" fill="#ffffff">${html(callouts[0].title)}</text>
        </g>
        <g>
          <circle cx="380" cy="86" r="58" fill="#2f8f83"></circle>
          <text x="380" y="80" text-anchor="middle" font-size="20" font-weight="900" fill="#ffffff">Build</text>
          <text x="380" y="104" text-anchor="middle" font-size="14" font-weight="800" fill="#ffffff">${html(callouts[1].title)}</text>
        </g>
        <g>
          <circle cx="628" cy="142" r="58" fill="#e85d4f"></circle>
          <text x="628" y="136" text-anchor="middle" font-size="20" font-weight="900" fill="#ffffff">Explain</text>
          <text x="628" y="160" text-anchor="middle" font-size="14" font-weight="800" fill="#ffffff">${html(callouts[2].title)}</text>
        </g>
        <rect x="86" y="224" width="588" height="34" rx="8" fill="#fff8ea" stroke="#d9d0bd"></rect>
        <text x="380" y="247" text-anchor="middle" font-size="16" font-weight="800" fill="#172033">Picture -> hands-on model -> student explanation -> retrieval check</text>
      </svg>
      <figcaption>
        <strong>${html(support.summary)}</strong>
        <span>${html(support.description)}</span>
      </figcaption>
    </figure>
  `;
}

function renderTeachingSupport(lesson) {
  const support = getLessonTeachingSupport(lesson.id, state);

  return `
    <section class="teaching-studio" aria-label="Teaching support for this lesson">
      <div class="section-head compact">
        <div>
          <p class="eyebrow">Teaching studio</p>
          <h2>Pictures, notes, and misconception checks</h2>
        </div>
        <span class="status-pill">${support.commonMisunderstandings.length} checks</span>
      </div>
      ${renderTeachingDiagram(lesson, support)}
      <div class="support-grid">
        <article class="support-card">
          <h3>Helper notes</h3>
          <ul>
            ${support.helperNotes.map((note) => `<li>${html(note)}</li>`).join("")}
          </ul>
        </article>
        <article class="support-card">
          <h3>Diagram callouts</h3>
          <ul>
            ${support.diagramCallouts.map((callout) => `<li><strong>${html(callout.title)}:</strong> ${html(callout.body)}</li>`).join("")}
          </ul>
        </article>
      </div>
      <div class="misunderstanding-grid">
        ${support.commonMisunderstandings
          .map(
            (item) => `
              <article class="misunderstanding-card">
                <span>Common misunderstanding</span>
                <h3>${html(item.mistake)}</h3>
                <p>${html(item.fix)}</p>
              </article>
            `
          )
          .join("")}
      </div>
      <div class="coach-prompt">
        <div>
          <strong>AI coach writing prompt</strong>
          <p>${html(support.confusionPrompt)}</p>
        </div>
        <button class="secondary-button" data-view="ai">Open tutor</button>
      </div>
    </section>
  `;
}

function renderEvidenceAuthorFields() {
  return `
    <div class="span-2 evidence-author-fields">
      <div class="section-head compact">
        <div>
          <p class="eyebrow">Math evidence moves</p>
          <h3>Required before publishing math lessons</h3>
        </div>
        <span class="status-pill">${evidenceGuidanceAudit.requiredMathLessonMoves.length} moves</span>
      </div>
      <div class="evidence-author-grid">
        ${evidenceGuidanceAudit.requiredMathLessonMoves
          .map(
            (move) => `
              <label>
                ${html(move.label)}
                <textarea name="evidenceMove_${html(move.key)}" rows="2" placeholder="${html(move.auditQuestion)}"></textarea>
              </label>
            `
          )
          .join("")}
      </div>
      <small>For non-math drafts these fields are optional. For math drafts, every field is required before publish.</small>
    </div>
  `;
}

function renderLessonBodyAuthorFields() {
  return `
    <div class="span-2 lesson-body-author-fields">
      <div class="section-head compact">
        <div>
          <p class="eyebrow">Lesson body</p>
          <h3>What the student sees, does, and uses</h3>
        </div>
        <span class="status-pill">Required</span>
      </div>
      <div class="lesson-body-author-grid">
        <label>
          Essential question
          <input name="essentialQuestion" placeholder="How can I prove the idea with a model or evidence?" />
        </label>
        <label>
          Why it matters
          <input name="whyItMatters" placeholder="Where the learner will use this idea outside the quiz" />
        </label>
        <label class="span-2">
          Student-facing summary
          <textarea name="studentSummary" rows="2" placeholder="Short explanation the learner sees before practice"></textarea>
        </label>
        <label>
          Vocabulary terms
          <textarea name="vocabularyTerms" rows="3" placeholder="One term per line"></textarea>
        </label>
        <label>
          Prerequisite skills
          <textarea name="prerequisiteSkills" rows="3" placeholder="One skill per line"></textarea>
        </label>
        <label>
          Warm-up
          <textarea name="sectionWarmUp" rows="3" placeholder="Prior knowledge, noticing, curiosity hook, or concrete opener"></textarea>
        </label>
        <label>
          Direct instruction
          <textarea name="sectionDirectInstruction" rows="3" placeholder="Short model, explanation, diagram, or think-aloud"></textarea>
        </label>
        <label>
          Guided practice
          <textarea name="sectionGuidedPractice" rows="3" placeholder="What the learner tries with support"></textarea>
        </label>
        <label>
          Interactive activity
          <textarea name="sectionInteractiveActivity" rows="3" placeholder="Build, sort, draw, discuss, investigate, or role task"></textarea>
        </label>
        <label>
          Independent practice
          <textarea name="sectionIndependentPractice" rows="3" placeholder="Short independent attempt with a confusion-writing prompt"></textarea>
        </label>
        <label>
          Reteach path
          <textarea name="sectionReteachPath" rows="3" placeholder="Different representation, simpler example, first-step support"></textarea>
        </label>
        <label>
          Challenge path
          <textarea name="sectionChallengePath" rows="3" placeholder="Transfer task, explanation, project, or portfolio extension"></textarea>
        </label>
        <label>
          Helper notes
          <textarea name="helperNotes" rows="4" placeholder="One note per line. Example: Look -> Find the visual clue first."></textarea>
        </label>
        <label>
          Common misunderstandings
          <textarea name="commonMisunderstandings" rows="4" placeholder="One per line. Example: Counts pieces only -> Ask what the whole is."></textarea>
        </label>
        <label>
          Visual supports
          <textarea name="visualSupports" rows="4" placeholder="placement | title | description, one visual per line"></textarea>
        </label>
        <label>
          Source cards
          <textarea name="sourceCards" rows="4" placeholder="source id | title | url | claim, one source per line"></textarea>
        </label>
        <label>
          Quiz question
          <textarea name="quizQuestion" rows="2" placeholder="One mastery checkpoint question"></textarea>
        </label>
        <label>
          Quiz choices
          <textarea name="quizChoices" rows="2" placeholder="One choice per line, optional for short response"></textarea>
        </label>
        <label>
          Correct answer
          <input name="quizCorrectAnswer" placeholder="Expected answer or rubric statement" />
        </label>
        <label>
          Answer explanation
          <input name="quizExplanation" placeholder="Why the answer shows understanding" />
        </label>
      </div>
      <small>Empty fields receive a scaffold from the engine, but real authored text should replace scaffolds before production content scaling.</small>
    </div>
  `;
}

function renderDraftEvidenceStatus(draft) {
  const audit = getDraftEvidenceAudit(draft);
  const visualAsset = getDraftVisualAsset(state, draft);
  const truthReview = getContentDraftTruthReview(draft);
  const completenessReview = getContentDraftCompletenessReview(draft);
  const anatomyMeta = `
    <div class="draft-gate ${completenessReview.passed ? "passed" : "failed"}">
      <strong>Lesson body: ${html(completenessReview.passed ? "ready" : "needs work")}</strong>
      <small>${html(completenessReview.summary)}</small>
      <small>${html(`${draft.visualSupports?.length || 0} visual supports | ${draft.commonMisunderstandings?.length || 0} misconception checks | ${draft.sourceCards?.length || 0} source cards`)}</small>
    </div>
  `;
  const truthMeta = `
    <div class="draft-gate ${draft.truthReviewStatus === "approved" ? "passed" : "failed"}">
      <strong>Truth review: ${html(draft.truthReviewStatus === "approved" ? "approved" : `${truthReview.score}/5 needs review`)}</strong>
      <small>${html(truthReview.issues.length ? truthReview.issues.join(" ") : truthReview.summary)}</small>
      ${truthReview.needsExternalResearch ? `<small>Staff-side source check required before publication.</small>` : ""}
    </div>
  `;
  const researchMeta =
    draft.redesignTasks?.length || draft.researchSourceIds?.length
      ? `
        <div class="draft-research-meta">
          <strong>Research-backed redesign</strong>
          ${draft.researchSourceIds?.length ? `<small>Sources: ${html(draft.researchSourceIds.join(", "))}</small>` : ""}
          ${
            draft.redesignTasks?.length
              ? `
                <ul>
                  ${draft.redesignTasks
                    .slice(0, 3)
                    .map((task) => `<li>${html(task.title)}: ${html(task.change)}</li>`)
                    .join("")}
                </ul>
              `
              : ""
          }
        </div>
      `
      : "";
  if (!audit.required) {
    return `
      <small>Evidence gate: not math-specific.</small>
      ${visualAsset ? `<small>Visual asset: ${html(visualAsset.status)}</small>` : ""}
      ${anatomyMeta}
      ${truthMeta}
      ${researchMeta}
    `;
  }

  return `
    <div class="draft-gate ${audit.passed ? "passed" : "failed"}">
      <strong>Evidence audit: ${audit.present}/${audit.required}</strong>
      <small>${audit.passed ? "Ready for publication gate." : html(`Missing: ${audit.missing.map((move) => move.label).join(", ")}`)}</small>
      ${visualAsset ? `<small>Visual asset: ${html(visualAsset.status)}</small>` : ""}
      ${anatomyMeta}
      ${truthMeta}
      ${draft.publicationBlocked ? `<small>${html(draft.blockedReason || "Publication blocked until evidence moves are complete.")}</small>` : ""}
      ${researchMeta}
    </div>
  `;
}

function renderProductionDataModelPanel() {
  const readiness = getPlatformDataModelReadiness(state);
  const migration = getPlatformMigration();
  const migrationReadiness = getPlatformMigrationReadiness();
  const accessSummary = getPlatformRepositoryAccessSummary();
  const stateDependencyAudit = repositoryStateDependencyAudit || getStateDependencyAudit();
  const stateDependencySource = repositoryStateDependencyAudit ? "Route live" : repositoryStateDependencyAuditError ? "Check" : "Static audit";
  const sqlPreview = migration.sql.split("\n").slice(0, 32).join("\n");
  return `
    <section class="panel wide-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Production data model</p>
          <h2>Database schema and seed projection</h2>
        </div>
        <span class="status-pill">${readiness.passed ? "Ready" : "Check"}</span>
      </div>
      <div class="metric-grid">
        ${renderMetric("Tables", readiness.schema.tableCount, `${readiness.schema.requiredPresent}/${readiness.schema.requiredTableCount} required`)}
        ${renderMetric("Relationships", readiness.schema.relationshipCount, "Foreign keys")}
        ${renderMetric("RLS tables", readiness.schema.rlsTableCount, "Role-scoped")}
        ${renderMetric("PII tables", readiness.schema.piiTableCount, "Privacy protected")}
        ${renderMetric("Seed rows", readiness.projectionSummary.rowCount, "Projected platform data")}
        ${renderMetric("Seed coverage", readiness.projectionSummary.requiredTablesWithRows, "Required tables with rows")}
      </div>
      <div class="schema-area-grid">
        ${readiness.areaSummary
          .map(
            (area) => `
              <article>
                <strong>${html(area.area.replaceAll("_", " "))}</strong>
                <span>${area.tableCount}</span>
              </article>
            `
          )
          .join("")}
      </div>
      ${
        readiness.validation.errors.length || readiness.requiredEmpty.length
          ? `
            <div class="batch-result failed">
              <strong>Schema needs work</strong>
              ${readiness.validation.errors.map((error) => `<span>${html(`${error.path}: ${error.message}`)}</span>`).join("")}
              ${readiness.requiredEmpty.map((table) => `<span>${html(`${table}: required table has no projected seed rows`)}</span>`).join("")}
            </div>
          `
          : `<div class="batch-result passed"><strong>Schema contract passes</strong><span>All required tables are defined, protected where needed, and populated by the current app projection.</span></div>`
      }
      <div class="migration-panel">
        <div class="section-head compact">
          <div>
            <p class="eyebrow">Normalized learning read</p>
            <h3>Catalog, progress, mastery, and attempts</h3>
          </div>
          <span class="status-pill">${repositoryLearningCatalog ? "Route live" : repositoryLearningCatalogError ? "Check" : "Loading"}</span>
        </div>
        ${
          repositoryLearningCatalog
            ? `
              <div class="metric-grid">
                ${renderMetric("Lessons", repositoryLearningCatalog.summary.lessonCount, "Normalized rows")}
                ${renderMetric("Pilot", repositoryLearningCatalog.summary.pilot, "Seed catalog")}
                ${renderMetric("Published", repositoryLearningCatalog.summary.published, "Approved drafts")}
                ${renderMetric("Progress", repositoryLearningCatalog.summary.withProgress, "Learner rows")}
                ${renderMetric("Mastery", repositoryLearningCatalog.summary.withMastery, "Evidence rows")}
                ${renderMetric("Interactive", repositoryLearningCatalog.summary.interactiveEvidenceSignals || 0, "Skill signals")}
                ${renderMetric("Quiz-ready", repositoryLearningCatalog.summary.withQuiz, "Question rows")}
              </div>
              <div class="batch-result passed"><strong>Repository read path active</strong><span>/api/learning/catalog is reading normalized lessons, activities, quizzes, progress, mastery, and attempts through the repository layer.</span></div>
            `
            : `<div class="batch-result ${repositoryLearningCatalogError ? "failed" : "passed"}"><strong>${repositoryLearningCatalogError ? "Repository read unavailable" : "Repository read loading"}</strong><span>${html(repositoryLearningCatalogError || "The app is requesting /api/learning/catalog from the local server.")}</span></div>`
        }
      </div>
      <div class="migration-panel">
        <div class="section-head compact">
          <div>
            <p class="eyebrow">Normalized content read</p>
            <h3>Draft anatomy, review gates, and truth status</h3>
          </div>
          <span class="status-pill">${repositoryContentDrafts ? "Route live" : repositoryContentDraftsError ? "Check" : "Loading"}</span>
        </div>
        ${
          repositoryContentDrafts
            ? `
              <div class="metric-grid">
                ${renderMetric("Draft rows", repositoryContentDrafts.summary.total, "Normalized rows")}
                ${renderMetric("Review", repositoryContentDrafts.summary.review, "Awaiting checks")}
                ${renderMetric("Published", repositoryContentDrafts.summary.published, "Approved content")}
                ${renderMetric("Lesson bodies", repositoryContentDrafts.summary.lessonBodyReady, "Teaching anatomy")}
                ${renderMetric("Visuals", repositoryContentDrafts.summary.visualSupportReady, "Supports ready")}
                ${renderMetric("Truth review", repositoryContentDrafts.summary.truthNeedsReview, "Needs approval")}
              </div>
              <div class="batch-result passed"><strong>Content draft route active</strong><span>/api/content/drafts is reading normalized content_drafts rows through the repository layer.</span></div>
            `
            : `<div class="batch-result ${repositoryContentDraftsError ? "failed" : "passed"}"><strong>${repositoryContentDraftsError ? "Content draft read unavailable" : "Content draft read loading"}</strong><span>${html(repositoryContentDraftsError || "The app is requesting /api/content/drafts from the local server.")}</span></div>`
        }
      </div>
      <div class="migration-panel">
        <div class="section-head compact">
          <div>
            <p class="eyebrow">Normalized visual read</p>
            <h3>Generated images, diagrams, approval state, and alt text</h3>
          </div>
          <span class="status-pill">${repositoryVisualAssets ? "Route live" : repositoryVisualAssetsError ? "Check" : "Loading"}</span>
        </div>
        ${
          repositoryVisualAssets
            ? `
              <div class="metric-grid">
                ${renderMetric("Visual rows", repositoryVisualAssets.summary.total, "Normalized rows")}
                ${renderMetric("Review", repositoryVisualAssets.summary.review, "Needs approval")}
                ${renderMetric("Approved", repositoryVisualAssets.summary.approved, "Student-ready")}
                ${renderMetric("OpenAI", repositoryVisualAssets.summary.openAiGenerated, "Generated images")}
                ${renderMetric("Linked drafts", repositoryVisualAssets.summary.linkedDrafts, "Draft assets")}
                ${renderMetric("Review-ready", repositoryVisualAssets.summary.reviewReady, "URL and alt text")}
              </div>
              <div class="batch-result passed"><strong>Visual asset route active</strong><span>/api/content/visual-assets is reading normalized visual_assets rows through the repository layer.</span></div>
            `
            : `<div class="batch-result ${repositoryVisualAssetsError ? "failed" : "passed"}"><strong>${repositoryVisualAssetsError ? "Visual asset read unavailable" : "Visual asset read loading"}</strong><span>${html(repositoryVisualAssetsError || "The app is requesting /api/content/visual-assets from the local server.")}</span></div>`
        }
      </div>
      <div class="migration-panel">
        <div class="section-head compact">
          <div>
            <p class="eyebrow">Normalized tutor read</p>
            <h3>Confusion analysis, feedback, and truth checks</h3>
          </div>
          <span class="status-pill">${repositoryTutorEvents ? "Route live" : repositoryTutorEventsError ? "Check" : "Loading"}</span>
        </div>
        ${
          repositoryTutorEvents
            ? `
              <div class="metric-grid">
                ${renderMetric("Tutor events", repositoryTutorEvents.summary.total, "Normalized rows")}
                ${renderMetric("Feedback", repositoryTutorEvents.summary.feedback, `${repositoryTutorEvents.summary.helpfulRate}% helpful`)}
                ${renderMetric("Truth reviewed", repositoryTutorEvents.summary.truthReviewed, `${repositoryTutorEvents.summary.truthAverage || "n/a"}/5 avg`)}
                ${renderMetric("Needs review", repositoryTutorEvents.summary.needsTruthReview, "Truth-policy queue")}
                ${renderMetric("Flags", repositoryTutorEvents.summary.flagged, "Safety or policy")}
                ${renderMetric("Source checks", repositoryTutorEvents.summary.externalResearchNeeded, "Staff research")}
              </div>
              <div class="batch-result passed"><strong>Tutor event route active</strong><span>/api/tutor/events is reading normalized ai_tutor_events rows through the repository layer.</span></div>
            `
            : `<div class="batch-result ${repositoryTutorEventsError ? "failed" : "passed"}"><strong>${repositoryTutorEventsError ? "Tutor event read unavailable" : "Tutor event read loading"}</strong><span>${html(repositoryTutorEventsError || "The app is requesting /api/tutor/events from the local server.")}</span></div>`
        }
      </div>
      <div class="migration-panel">
        <div class="section-head compact">
          <div>
            <p class="eyebrow">State dependency audit</p>
            <h3>Remaining broad snapshot routes</h3>
          </div>
          <span class="status-pill">${html(stateDependencySource)}</span>
        </div>
        <div class="metric-grid">
          ${renderMetric("Focused reads", stateDependencyAudit.summary.focusedReadRoutes, "Scoped routes")}
          ${renderMetric("Focused writes", stateDependencyAudit.summary.focusedWriteRoutes, "Feature routes")}
          ${renderMetric("Coverage", `${stateDependencyAudit.summary.migrationCoveragePercent}%`, "Route migration")}
          ${renderMetric("Legacy state", stateDependencyAudit.summary.legacySnapshotRoutes, "Must retire")}
        </div>
        ${
          repositoryStateDependencyAuditError
            ? `<div class="batch-result failed"><strong>Dependency route unavailable</strong><span>${html(repositoryStateDependencyAuditError)}</span></div>`
            : `<div class="batch-result ${stateDependencyAudit.summary.productionBlocker ? "failed" : "passed"}"><strong>${stateDependencyAudit.summary.productionBlocker ? "Production blocker remains" : "Snapshot retired"}</strong><span>${html(stateDependencyAudit.releaseRule)}</span></div>`
        }
        <div class="role-matrix">
          ${stateDependencyAudit.legacySnapshotRoutes
            .map(
              (item) => `
                <article>
                  <h3>${html(item.route)}</h3>
                  <p>${html(item.purpose)}</p>
                  <small>${html(item.replacement)}</small>
                </article>
              `
            )
            .join("")}
        </div>
      </div>
      <div class="role-matrix">
        ${readiness.accessMatrix
          .map(
            (role) => `
              <article>
                <h3>${html(role.role.replace("-", " "))}</h3>
                <p><strong>Can read:</strong> ${html(role.canRead.slice(0, 3).join(", "))}</p>
                <p><strong>Can write:</strong> ${html(role.canWrite.slice(0, 3).join(", "))}</p>
                <small>Blocked: ${html(role.blocked.slice(0, 2).join(", "))}</small>
              </article>
            `
          )
          .join("")}
      </div>
      <div class="migration-panel">
        <div class="section-head compact">
          <div>
            <p class="eyebrow">Migration generator</p>
            <h3>PostgreSQL DDL and RLS policies</h3>
          </div>
          <span class="status-pill">${migrationReadiness.passed ? "Generated" : "Check"}</span>
        </div>
        <div class="metric-grid">
          ${renderMetric("Statements", migration.statementCount, migration.id)}
          ${renderMetric("RLS policies", migration.rlsPolicyCount, "Generated policies")}
          ${renderMetric("Indexes", migration.indexCount, "Foreign key and scope indexes")}
          ${renderMetric("Protected", accessSummary.protectedTables, "Repository-scoped tables")}
          ${renderMetric("Student writes", accessSummary.studentWritableTables, "Own learning evidence")}
          ${renderMetric("Teacher writes", accessSummary.teacherWritableTables, "Assigned scope")}
        </div>
        ${
          migrationReadiness.missingSignals.length
            ? `<div class="batch-result failed"><strong>Migration gaps</strong>${migrationReadiness.missingSignals.map((item) => `<span>${html(item)}</span>`).join("")}</div>`
            : `<div class="batch-result passed"><strong>Migration contract passes</strong><span>Required table DDL, RLS policies, indexes, and repository role checks are generated.</span></div>`
        }
        <details>
          <summary>SQL preview</summary>
          <pre class="tool-result-payload">${html(sqlPreview)}</pre>
        </details>
      </div>
    </section>
  `;
}

function getBatchImportSample() {
  const evidenceMoves = Object.fromEntries(
    evidenceGuidanceAudit.requiredMathLessonMoves.map((move) => [move.key, `${move.label} implementation detail.`])
  );

  return JSON.stringify(
    {
      lessons: [
        {
          title: "Equivalent Fractions With Number Lines",
          grade: "3",
          subject: "math",
          unitTitle: "Fractions",
          objective: "Explain equivalent fractions using strips and number lines.",
          standards: ["ccss-math"],
          essentialQuestion: "How can two different fractions name the same point on a number line?",
          studentSummary: "You will build two fraction models, line them up, and explain why one half and two fourths can be equal.",
          whyItMatters: "Equivalent fractions help you compare recipes, distances, measurements, and later algebra ratios.",
          vocabularyTerms: ["equivalent", "fraction", "number line", "whole"],
          prerequisiteSkills: ["Split one whole into equal parts", "Locate one half on a number line", "Explain a model in words"],
          visual: {
            type: "number-line",
            title: "Equivalent fraction number line",
            caption: "A number line from 0 to 1 showing 1/2 and 2/4 at the same point.",
            altText: "Number line from zero to one with one half and two fourths labeled at the midpoint."
          },
          lessonSections: {
            warmUp: "Show one folded strip in halves and one folded strip in fourths. Ask what is the same and different.",
            directInstruction: "Model the same whole with strips and a number line, then mark 1/2 and 2/4 at the same location.",
            guidedPractice: "Together, match 3/6 to 1/2 and ask the learner to point to the proof on the model.",
            interactiveActivity: "Learners build fraction strip pairs and place matching cards on a floor number line.",
            independentPractice: "Learners choose one pair of equivalent fractions and write how the model proves they match.",
            reteachPath: "Return to one whole strip, refold it slowly, and ask which pieces cover the same amount.",
            challengePath: "Ask learners to create a new equivalent fraction pair and explain it to a partner."
          },
          helperNotes: [
            { title: "Look", note: "Check whether both fractions use the same whole before comparing." },
            { title: "Point", note: "Point to the exact same spot on the number line before naming equality." }
          ],
          commonMisunderstandings: [
            {
              misunderstanding: "The learner thinks a bigger denominator always means a bigger fraction.",
              repair: "Use the same whole and show that fourths are smaller pieces than halves."
            }
          ],
          visualSupports: [
            {
              placement: "lesson-hero",
              title: "Fraction strip match",
              description: "Two aligned strips showing one half and two fourths covering the same length.",
              prompt: "Create a clear educational diagram of aligned fraction strips for 1/2 and 2/4.",
              altText: "Aligned fraction strips showing one half equal to two fourths."
            },
            {
              placement: "ai-tutor",
              title: "Same point hint",
              description: "A small number line showing both labels at the midpoint.",
              prompt: "Create a compact tutor visual showing 1/2 and 2/4 at the same point on a number line.",
              altText: "Number line midpoint labeled one half and two fourths."
            }
          ],
          quizQuestions: [
            {
              questionText: "How does the model prove that 1/2 and 2/4 are equivalent?",
              questionType: "short-response",
              choices: [],
              correctAnswer: "They cover the same amount of the same whole or land on the same point.",
              explanation: "Equivalent fractions name the same value, so the model must show the same whole and same location.",
              difficultyLevel: "developing",
              skillTag: "equivalent-fractions",
              standardTag: "ccss-math"
            }
          ],
          sourceCards: [
            {
              sourceId: "ccss-math-3-nf",
              title: "Common Core fraction reasoning",
              url: "",
              claim: "Grade 3 fraction work should connect symbols to visual fraction models.",
              checkedAt: "",
              reviewerNote: "Map to state-specific standards before publication."
            }
          ],
          accessibilityNotes: "Use high contrast labels, read the visual aloud, and offer a tactile paper strip option.",
          ageFitNotes: "Grade 3 learners build with strips before moving to symbols and short written explanations.",
          readability: {
            band: "foundation",
            vocabularyLevel: "Grade 3 concrete math vocabulary",
            maxSentenceWords: 14,
            supportNotes: "Use short directions, repeated fraction terms, and visual examples."
          },
          reviewNotes: "Batch import sample with all required math evidence moves.",
          evidenceMoves
        }
      ]
    },
    null,
    2
  );
}

function renderBatchImportResult() {
  if (!lastBatchImportResult) return "";

  return `
    <div class="batch-result ${lastBatchImportResult.accepted ? "passed" : "failed"}">
      <strong>${lastBatchImportResult.accepted ? "Batch accepted" : "Batch rejected"}</strong>
      <span>${lastBatchImportResult.imported || 0}/${lastBatchImportResult.total || 0} lesson(s) imported</span>
      ${
        lastBatchImportResult.errors?.length
          ? `<ul>${lastBatchImportResult.errors.map((error) => `<li>${html(error.path)}: ${html(error.message)}</li>`).join("")}</ul>`
          : ""
      }
      ${
        lastBatchImportResult.warnings?.length
          ? `<div class="batch-warnings"><strong>Warnings</strong><ul>${lastBatchImportResult.warnings.map((warning) => `<li>${html(warning.path)}: ${html(warning.message)}</li>`).join("")}</ul></div>`
          : ""
      }
    </div>
  `;
}

function getContentBatchPublicationPanelStates() {
  return getReviewableContentBatchIds(state).map((sourceBatchId) => {
    const review = getContentBatchReviewState(state, sourceBatchId);
    const drafts = (state.contentDrafts || []).filter((draft) => draft.sourceBatchId === sourceBatchId);
    const publications = (state.contentBatchPublications || []).filter((publication) => publication.sourceBatchId === sourceBatchId);
    const latestPublication = review.publication || publications[0] || null;
    const publishedLessons = (state.publishedLessons || []).filter((lesson) => lesson.sourceBatchId === sourceBatchId);
    const approved = ["approved", "published", "partial"].includes(review.status);
    const published = review.status === "published" || (publishedLessons.length === review.totalLessons && review.totalLessons > 0);
    return {
      ...review,
      drafts,
      publications,
      latestPublication,
      publishedLessons,
      approved,
      published,
      reviewReady: review.totalLessons > 0,
      blockedDrafts: drafts.filter((draft) => draft.publicationBlocked)
    };
  });
}

function renderBatchPublicationResult(sourceBatchId = "") {
  if (!lastBatchPublicationResult || (sourceBatchId && lastBatchPublicationResult.sourceBatchId !== sourceBatchId)) return "";
  return `
    <div class="batch-result ${lastBatchPublicationResult.accepted && !lastBatchPublicationResult.blockedCount ? "passed" : "failed"}">
      <strong>${lastBatchPublicationResult.accepted ? "Batch publication attempted" : "Batch publication blocked"}</strong>
      <span>${html(lastBatchPublicationResult.summary || "Publication result recorded.")}</span>
      ${
        lastBatchPublicationResult.results?.length
          ? `<ul>${lastBatchPublicationResult.results.map((result) => `<li>${html(result.title)}: ${html(result.status)}${result.blockedReason ? ` - ${html(result.blockedReason)}` : ""}</li>`).join("")}</ul>`
          : ""
      }
    </div>
  `;
}

function renderBridgeBatchPublicationPanel() {
  const batches = getContentBatchPublicationPanelStates();
  if (!batches.length) {
    return `
      <section class="batch-publication-panel">
        <div class="section-head compact">
          <div>
            <p class="eyebrow">Content publication</p>
            <h3>No imported lesson batches yet</h3>
          </div>
          <span class="status-pill">Waiting for import</span>
        </div>
        <p class="callout">Import a validated lesson batch to create a manager review gate and a publication workflow.</p>
      </section>
    `;
  }
  return batches.map((batch) => {
    const status = batch.published ? "Published" : batch.approved ? "Approved" : batch.reviewReady ? "Needs batch approval" : "Preparing";
    return `
    <section class="batch-publication-panel">
      <div class="section-head compact">
        <div>
          <p class="eyebrow">${html(batch.academyId || "Academy")} content publication</p>
          <h3>${html(batch.title)}: manager-approved lessons to student catalog</h3>
        </div>
        <span class="status-pill">${html(status)}</span>
      </div>
      <div class="metric-grid">
        ${renderMetric("Draft lessons", batch.drafts.length, "Batch source rows")}
        ${renderMetric("Approved", batch.drafts.filter((draft) => draft.batchReviewStatus === "approved").length, "Manager batch gate")}
        ${renderMetric("Published", batch.publishedLessons.length, "Student catalog")}
        ${renderMetric("Attempts", batch.publications.length, "Publication history")}
        ${renderMetric("Blocked", batch.blockedDrafts.length, "Individual gates")}
        ${renderMetric("Latest", batch.latestPublication?.status || "None", "Batch result")}
      </div>
      <p class="callout">This action does not bypass review. It sends every manager-approved lesson in this batch through the individual content publication gate, including truth approval, evidence checks, completeness, and visual rules.</p>
      ${renderBatchPublicationResult(batch.sourceBatchId)}
      ${
        batch.latestPublication
          ? `<div class="published-lesson-list batch-publication-history">
              ${batch.latestPublication.results.map((result) => `
                <article class="published-lesson-card">
                  <span class="subject-chip ${html(result.subject)}">${html(result.subject.replace("-", " "))}</span>
                  <h3>${html(result.title)}</h3>
                  <p>${html(result.status === "published" ? "Published into the student catalog." : result.blockedReason || "Blocked by publication gate.")}</p>
                  <small>${html(`Grade ${result.grade || "n/a"} | Score ${result.score ?? "n/a"}`)}</small>
                  ${result.publishedLessonId ? `<button class="small-button" data-lesson="${html(result.publishedLessonId)}" data-view="lesson">Open published lesson</button>` : ""}
                </article>
              `).join("")}
            </div>`
          : ""
      }
      <div class="button-group">
        <button class="primary-button" data-publish-batch="${html(batch.sourceBatchId)}" ${batch.approved && !batch.published ? "" : "disabled"}>Publish approved batch</button>
        <button class="secondary-button" data-view="tools">Open manager review queue</button>
      </div>
    </section>
    `;
  }).join("");
}

function renderPublishedLessonRecords() {
  const summary = getPublishedLessonSummary(state);
  if (!summary.total) {
    return `<p class="muted">No draft-approved lesson records yet. Manager approval creates student-facing lesson records after all gates pass.</p>`;
  }
  return `
    <div class="published-lesson-list">
      ${summary.lessons
        .slice(0, 8)
        .map(
          (lesson) => `
            <article class="published-lesson-card">
              <span class="subject-chip ${html(lesson.subject)}">${html(lesson.subject.replace("-", " "))}</span>
              <h3>${html(lesson.title)}</h3>
              <p>${html(lesson.objective)}</p>
              <small>${html(`Grade ${lesson.grade} | ${lesson.unitTitle} | ${lesson.quiz?.length || 0} checkpoint(s)`)}</small>
              <small>${html(`${lesson.visualSupports?.length || 0} visual supports | ${lesson.sourceCards?.length || 0} source cards`)}</small>
              <button class="small-button" data-lesson="${html(lesson.id)}" data-view="lesson">Open lesson</button>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function formLines(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function splitAuthorLine(line) {
  if (line.includes("->")) return line.split(/\s*->\s*/).map((part) => part.trim());
  if (line.includes("|")) return line.split("|").map((part) => part.trim());
  return [line.trim()];
}

function parseHelperNotes(value) {
  return formLines(value).map((line, index) => {
    const [title, note] = splitAuthorLine(line);
    return {
      title: note ? title : `Helper note ${index + 1}`,
      note: note || title
    };
  });
}

function parseCommonMisunderstandings(value) {
  return formLines(value).map((line) => {
    const [misunderstanding, repair] = splitAuthorLine(line);
    return {
      misunderstanding,
      repair: repair || "Ask the learner to explain the idea with a different representation."
    };
  });
}

function parseVisualSupports(value) {
  return formLines(value).map((line, index) => {
    const [placement, title, description] = splitAuthorLine(line);
    return {
      placement: placement || `visual-${index + 1}`,
      title: title || placement || `Visual support ${index + 1}`,
      description: description || title || placement,
      prompt: `Create an original educational visual for ${title || description || placement}. Use high contrast labels and do not depict real children.`,
      altText: description || title || placement
    };
  });
}

function parseSourceCards(value) {
  return formLines(value).map((line, index) => {
    const [sourceId, title, url, claim] = line.split("|").map((part) => part.trim());
    return {
      sourceId: sourceId || `source-${index + 1}`,
      title: title || sourceId || `Source ${index + 1}`,
      url: url || "",
      claim: claim || "Staff should verify this source before publication.",
      checkedAt: "",
      reviewerNote: ""
    };
  });
}

function buildQuizQuestions(form, subject) {
  const questionText = String(form.get("quizQuestion") || "").trim();
  if (!questionText) return [];
  return [
    {
      questionText,
      questionType: formLines(form.get("quizChoices")).length ? "multiple-choice" : "short-response",
      choices: formLines(form.get("quizChoices")),
      correctAnswer: String(form.get("quizCorrectAnswer") || "").trim(),
      explanation: String(form.get("quizExplanation") || "The answer should show reasoning tied to the lesson objective.").trim(),
      difficultyLevel: "developing",
      skillTag: subject,
      standardTag: subject === "math" ? "ccss-math" : subject === "science" ? "ngss" : subject === "social-studies" ? "c3" : "ccss-ela"
    }
  ];
}

function svgDataUri(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function draftPublishDisabled(draft) {
  const evidenceAudit = getDraftEvidenceAudit(draft);
  const visualAsset = getDraftVisualAsset(state, draft);
  const completenessReview = getContentDraftCompletenessReview(draft);
  return Boolean(
    (evidenceAudit.required && !evidenceAudit.passed) ||
      !completenessReview.passed ||
      (visualAsset && visualAsset.status !== "approved") ||
      draft.truthReviewStatus !== "approved"
  );
}

function renderVisualReplacementResult(assetId) {
  if (!lastVisualReplacementResult || lastVisualReplacementResult.assetId !== assetId) return "";

  return `
    <div class="batch-result ${lastVisualReplacementResult.accepted ? "passed" : "failed"}">
      <strong>${lastVisualReplacementResult.accepted ? "Replacement saved" : "Replacement rejected"}</strong>
      ${
        lastVisualReplacementResult.errors?.length
          ? `<ul>${lastVisualReplacementResult.errors.map((error) => `<li>${html(error.path)}: ${html(error.message)}</li>`).join("")}</ul>`
          : `<span>Asset returned to review for approval.</span>`
      }
    </div>
  `;
}

function renderVisualStorageResult(assetId) {
  if (!lastVisualStorageResult || lastVisualStorageResult.assetId !== assetId) return "";

  return `
    <div class="batch-result ${lastVisualStorageResult.accepted ? "passed" : "failed"}">
      <strong>${lastVisualStorageResult.accepted ? "Storage promotion complete" : "Storage promotion blocked"}</strong>
      <span>${html(lastVisualStorageResult.error || lastVisualStorageResult.summary || "Asset is ready for review using its storage URL.")}</span>
      ${lastVisualStorageResult.storage?.publicUrl ? `<small>${html(lastVisualStorageResult.storage.publicUrl)}</small>` : ""}
    </div>
  `;
}

function renderVisualAssetReview() {
  const repositoryAssets = repositoryVisualAssets?.assets || [];
  const stateAssetsById = new Map((state.visualAssets || []).map((asset) => [asset.id, asset]));
  const assets = repositoryAssets.length
    ? repositoryAssets.map((asset) => ({ ...(stateAssetsById.get(asset.id) || {}), ...asset }))
    : state.visualAssets || [];
  if (!assets.length) {
    return `<p class="muted">No generated visual assets yet. Import a valid lesson batch to create reviewable SVG assets.</p>`;
  }

  return `
    <div class="visual-asset-list">
      ${assets
        .map(
          (asset) => {
            const imageSource = asset.assetUrl || (asset.svg ? svgDataUri(asset.svg) : "");
            const title = asset.title || asset.caption || asset.id;
            const subjectGrade = [asset.subject, asset.grade ? `grade ${asset.grade}` : ""].filter(Boolean).join(" ");
            return `
            <article class="visual-asset-card ${html(asset.status)}">
              <img src="${html(imageSource)}" alt="${html(asset.altText)}" />
              <div>
                <span class="status-pill">${html(asset.status)}</span>
                <h3>${html(title)}</h3>
                ${asset.latestReview ? `<div class="artifact-grade-chip ${asset.latestReview.passed ? "passed" : "blocked"}"><strong>Quality grade ${html(asset.latestReview.grade || "Pending")}</strong><span>${html(`${asset.latestReview.score ?? "n/a"}/${asset.latestReview.threshold ?? "n/a"}`)}</span></div>` : ""}
                <p>${html(asset.caption)}</p>
                <small>${html(asset.altText)}</small>
                <small>${html([asset.license, asset.assetKind, subjectGrade].filter(Boolean).join(" | "))}</small>
                ${asset.credit ? `<small>Credit: ${html(asset.credit)}</small>` : ""}
                <small>${html(["storage", asset.storageStatus || "not-promoted", asset.storageProvider || "", asset.storageBucket || ""].filter(Boolean).join(" | "))}</small>
                ${asset.storagePublicUrl ? `<small>Storage URL: ${html(asset.storagePublicUrl)}</small>` : ""}
                ${
                  asset.sourcePrompt
                    ? `<details class="visual-review-details">
                        <summary>Source prompt</summary>
                        <p>${html(asset.sourcePrompt)}</p>
                      </details>`
                    : ""
                }
                ${
                  asset.reviewChecklist?.length
                    ? `<details class="visual-review-details">
                        <summary>Review checklist</summary>
                        <ul>${asset.reviewChecklist.map((item) => `<li>${html(item)}</li>`).join("")}</ul>
                      </details>`
                    : ""
                }
                ${
                  asset.reviewHistory?.length
                    ? `<details class="visual-review-details">
                        <summary>Revision history (${asset.reviewHistory.length})</summary>
                        <ol>${asset.reviewHistory.slice(0, 6).map((entry) => `<li><strong>${html(entry.action || "graded")}</strong> ${html(`${entry.grade || "n/a"} (${entry.score ?? "n/a"})`)} <small>${html(entry.createdAt || "")}</small>${entry.revisionInstructions?.length ? `<p>${html(entry.revisionInstructions[0])}</p>` : ""}</li>`).join("")}</ol>
                      </details>`
                    : ""
                }
                <form class="asset-replace-form" data-asset-replace="${html(asset.id)}">
                  <label>
                    Replacement image URL
                    <input name="assetUrl" placeholder="https://... or data:image/..." />
                  </label>
                  <label>
                    Alt text
                    <input name="altText" value="${html(asset.altText)}" />
                  </label>
                  <label>
                    Caption
                    <input name="caption" value="${html(asset.caption)}" />
                  </label>
                  <label>
                    License
                    <input name="license" value="${html(asset.license)}" />
                  </label>
                  <label>
                    Credit
                    <input name="credit" value="${html(asset.credit || "Internal reviewer")}" />
                  </label>
                  <button class="secondary-button" type="submit">Replace asset</button>
                  ${renderVisualReplacementResult(asset.id)}
                </form>
              </div>
              <div class="draft-actions">
                ${
                  asset.assetKind !== "generated-svg" && !asset.storagePublicUrl
                    ? `<button class="small-button" data-asset-promote-storage="${html(asset.id)}">Promote to storage</button>`
                    : ""
                }
                <button class="small-button" data-asset-status="${html(asset.id)}" data-status="approved">Approve</button>
                <button class="small-button" data-asset-status="${html(asset.id)}" data-status="rejected">Reject</button>
                <button class="small-button" data-asset-status="${html(asset.id)}" data-status="review">Review</button>
                ${renderVisualStorageResult(asset.id)}
              </div>
            </article>
          `;
          }
        )
        .join("")}
    </div>
  `;
}

function renderVisualAgentResult() {
  if (!lastVisualAgentResult) return "";
  return `
    <div class="batch-result ${lastVisualAgentResult.accepted ? "passed" : "failed"}">
      <strong>${lastVisualAgentResult.accepted ? "Image sent to review" : "Image generation not completed"}</strong>
      ${
        lastVisualAgentResult.accepted
          ? `<span>Asset ${html(lastVisualAgentResult.assetId || "")} was created as review-only.</span>`
          : `<span>${html(lastVisualAgentResult.error || "OpenAI generation requires server configuration.")}</span>`
      }
      ${lastVisualAgentResult.setup ? `<small>${html(lastVisualAgentResult.setup)}</small>` : ""}
      ${lastVisualAgentResult.model ? `<small>Model: ${html(lastVisualAgentResult.model)}</small>` : ""}
    </div>
  `;
}

function visualSlotStatusLabel(status) {
  return {
    missing: "Missing",
    review: "In review",
    rejected: "Rejected",
    "approved-pending-storage": "Approved, needs storage",
    approved: "Production-ready"
  }[status] || "Untracked";
}

function renderVisualBacklogSummary(audit) {
  const status = audit.byStatus || {};
  return `
    <div class="migration-panel visual-backlog-panel">
      <div class="section-head compact">
        <div>
          <p class="eyebrow">Master backlog status</p>
          <h3>Every visual slot has an owner state</h3>
        </div>
        <span class="status-pill">${html(`${audit.totalSlots} planned slots`)}</span>
      </div>
      <p class="callout">A slot is not complete just because an image exists. It must pass review, include accessible metadata, and be storage-backed before the lesson can depend on it.</p>
      <div class="metric-grid">
        ${renderMetric("Missing", status.missing || 0, "Needs generation")}
        ${renderMetric("In review", status.review || 0, "Manager decision")}
        ${renderMetric("Rejected", status.rejected || 0, "Needs revision")}
        ${renderMetric("Storage", status["approved-pending-storage"] || 0, "Approved, not promoted")}
        ${renderMetric("Ready", status.approved || 0, "Can ship to learners")}
        ${renderMetric("High-priority gap", audit.highPriorityMissing || 0, "Lesson/tutor first")}
      </div>
      <div class="visual-backlog-list">
        ${audit.slots
          .filter((slot) => slot.priority >= 88)
          .slice(0, 24)
          .map(
            (slot) => `
              <article class="visual-backlog-row ${html(slot.assetStatus)}">
                <div>
                  <span class="subject-chip ${html(slot.subject)}">${html(slot.subject.replace("-", " "))}</span>
                  <strong>${html(slot.title)}</strong>
                  <small>${html(`Grade ${slot.grade} | ${slot.placement} | priority ${slot.priority}`)}</small>
                </div>
                <div class="visual-backlog-state">
                  <span class="status-pill">${html(visualSlotStatusLabel(slot.assetStatus))}</span>
                  <small>${html(slot.assetId ? `${slot.assetCount} linked asset${slot.assetCount === 1 ? "" : "s"}` : "No linked asset")}</small>
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderVisualPromptCard(slot) {
  return `
    <article class="visual-prompt-card">
      <div class="visual-prompt-meta">
        <span class="subject-chip ${html(slot.subject)}">${html(slot.subject.replace("-", " "))}</span>
        <span class="status-pill">${html(slot.placement)}</span>
        <span class="status-pill">${html(visualSlotStatusLabel(slot.assetStatus))}</span>
        <strong>${slot.priority}</strong>
      </div>
      <h3>${html(slot.title)}</h3>
      <p>${html(slot.reason)}</p>
      <small>${html(`Lesson: ${slot.lessonTitle} | Grade ${slot.grade} | ${slot.assetType}`)}</small>
      ${slot.assetId ? `<small>Linked asset: ${html(slot.assetId)}${slot.storageBacked ? " | storage-backed" : ""}</small>` : ""}
      <form class="visual-agent-form" data-visual-slot="${html(slot.id)}">
        <label>
          Image prompt
          <textarea name="prompt" rows="6">${html(slot.prompt)}</textarea>
        </label>
        <button class="primary-button" type="submit">Generate review image</button>
      </form>
      <details>
        <summary>Review checklist</summary>
        <ul>
          ${slot.reviewChecklist.map((item) => `<li>${html(item)}</li>`).join("")}
        </ul>
      </details>
    </article>
  `;
}

function renderVisualAgentView() {
  const audit = getVisualLearningAgentAudit(state);
  const visualBatchPlan = getVisualProductionBatchPlan({ limit: 6, assets: state.visualAssets || [] });
  const generatedAssets = (state.visualAssets || []).filter((asset) => asset.assetKind === "openai-generated-image");
  const topSlots = audit.slots.filter((slot) => slot.assetStatus !== "approved").slice(0, 12);

  return renderShell(`
    <section class="panel wide-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Visual Learning Agent</p>
          <h2>Image and diagram audit for lessons and tutor help</h2>
        </div>
        <span class="status-pill">${audit.totalSlots} slots</span>
      </div>
      <p class="callout">This agent scans lesson objectives, teaching support, common misunderstandings, group homework, and draft content to decide where images or diagrams would make learning clearer. OpenAI generation is server-side and requires <strong>OPENAI_API_KEY</strong>.</p>
      <div class="metric-grid">
        ${renderMetric("Lessons audited", audit.auditedLessons, "Pilot lessons")}
        ${renderMetric("Drafts audited", audit.auditedDrafts, "Unlinked drafts")}
        ${renderMetric("High priority", audit.highPriority, "Tutor and lesson visuals")}
        ${renderMetric("Generated", generatedAssets.length, "Review-only assets")}
        ${audit.fullCatalog ? renderMetric("Library lessons", audit.fullCatalog.lessonCount, "Full catalog") : ""}
        ${audit.fullCatalog ? renderMetric("Catalog slots", audit.fullCatalog.slotCount.toLocaleString(), `${audit.fullCatalog.coveragePercent}% production-ready`) : ""}
      </div>
      <div class="visual-placement-grid">
        ${Object.entries(audit.byPlacement)
          .map(
            ([placement, count]) => `
              <article>
                <strong>${html(placement)}</strong>
                <span>${count}</span>
              </article>
            `
          )
          .join("")}
      </div>
      ${renderVisualBacklogSummary(audit)}
      <div class="migration-panel visual-batch-panel">
        <div class="section-head compact">
          <div>
            <p class="eyebrow">Batch quality gate</p>
            <h3>Visual work packages follow lesson production batches</h3>
          </div>
          <span class="status-pill">${html(`${visualBatchPlan.totalMissingSlots.toLocaleString()} missing in preview`)}</span>
        </div>
        <p class="callout">Each lesson batch receives its own visual slot count, placement coverage, and approval state. Generation should begin only from a reviewed batch package.</p>
        <div class="visual-batch-list">
          ${visualBatchPlan.batches.map((batch) => `
            <article class="visual-backlog-row ${html(batch.visualGate)}">
              <div>
                <span class="subject-chip ${html(batch.subject)}">${html(batch.subject.replace("-", " "))}</span>
                <strong>${html(batch.title)}</strong>
                <small>${html(`${batch.lessonCount} lessons | ${batch.requiredSlotCount} visual slots | ${batch.byPlacement["group-homework"] || 0} group workflow slots`)}</small>
              </div>
              <div class="visual-backlog-state">
                <span class="status-pill">${html(batch.visualGate)}</span>
                <small>${html(`${batch.readySlotCount}/${batch.requiredSlotCount} ready (${batch.coveragePercent}%)`)}</small>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
      ${renderVisualAgentResult()}
      <div class="section-head compact">
        <h2>Next generation queue</h2>
      </div>
      <div class="visual-agent-grid">
        ${topSlots.length ? topSlots.map(renderVisualPromptCard).join("") : `<p class="muted">All currently audited visual slots are production-ready. Add the next lesson batch to continue the queue.</p>`}
      </div>
    </section>

    <aside class="panel side-panel">
      <div class="section-head compact">
        <h2>Generated image queue</h2>
      </div>
      <div class="ai-log">
        ${
          generatedAssets.length
            ? generatedAssets
                .slice(0, 8)
                .map(
                  (asset) => `
                    <article class="log-entry">
                      <span>${html(asset.status)}</span>
                      <strong>${html(asset.title)}</strong>
                      <p>${html(asset.caption)}</p>
                      <small>${html(asset.credit || "")}</small>
                      <small>${html(asset.storageStatus || (asset.storagePublicUrl ? "stored-review" : "pending-storage"))}</small>
                    </article>
                  `
                )
                .join("")
            : `<p class="muted">No OpenAI-generated images yet. Generate one prompt to create a review asset.</p>`
        }
      </div>
    </aside>
  `);
}

function renderChildLevelDashboard(learner, levelProfile, subjectProgress) {
  const academy = findAcademy(learner.academyId);
  const nextReward = levelProfile.nextReward || {};
  const tutorEvidence = getTutorReflectionEvidence(state, learner.id);
  const repositoryTutor = getRepositoryTutorEventSummary(learner.id);
  const repositoryRewards = getRepositoryRewardApprovalSummary(learner.id);
  const portfolioEvidence = getRepositoryPortfolioEvidenceSummary(learner.id);
  return `
    <section class="panel wide-panel level-home-panel academy-world-home academy-${html(academy.id)}">
      <div class="child-level-showcase">
        <div class="level-orb" aria-label="Current level ${levelProfile.level}">
          <span>Level</span>
          <strong>${levelProfile.level}</strong>
          <small>XP Core</small>
        </div>
        <div class="level-copy">
          <p class="eyebrow">${html(academy.name)} learner home</p>
          <h2>${html(learner.name)}'s learning academy</h2>
          <p>Earn XP from lessons, quizzes, tutor reflection, experiments, projects, and delayed recall. Subject levels grow separately so learners can see exactly where they are getting stronger.</p>
          ${renderXpTrack(levelProfile.progressPercent, `${learner.name} account level`)}
          <div class="xp-stats-row">
            <span>${levelProfile.currentLevelXp}/${levelProfile.nextLevelXp} XP to next level</span>
            <strong>${levelProfile.totalXp} total XP</strong>
            <span>${levelProfile.xpToNextLevel} XP needed</span>
          </div>
          <div class="academy-world-badges" aria-label="Academy world features">
            <span>Subject worlds</span>
            <span>Tutor help</span>
            <span>Mastery rewards</span>
          </div>
          <div class="poster-callout-stack" aria-label="Learning poster callouts">
            <span>Think smart</span>
            <span>Power up</span>
            <span>Build the model</span>
            <span>Recall later</span>
          </div>
        </div>
        <article class="next-reward-card">
          <span>Next reward</span>
          <h3>${html(nextReward.title || "Mastery reward")}</h3>
          <p>${html(nextReward.benefit || levelProfile.rewardRule)}</p>
          <small>${nextReward.requiresParentApproval ? "Requires parent approval and mastery evidence." : "Unlocked by learning evidence."}</small>
          ${renderChildRewardClaim(learner, levelProfile)}
        </article>
      </div>
      <div class="neon-world-rail" aria-label="Academy world path">
        ${subjectProgress
          .slice(0, 6)
          .map((subject) => {
            const world = subjectWorldMeta(subject.subject);
            return `<span class="world-rail-node subject-${html(subject.subject)}">${html(world.world)}</span>`;
          })
          .join("")}
      </div>
      <div class="xp-source-grid">
        ${renderMetric("Lesson XP", levelProfile.xpSources.lessons, "Quizzes, mastery, starts")}
        ${renderMetric("Tutor XP", levelProfile.xpSources.tutor, "Writing exact stuck points")}
        ${renderMetric("Experiment XP", levelProfile.xpSources.experiments, "Learning lab trials")}
        ${renderMetric("Benefit XP", levelProfile.xpSources.benefits, "Recall and transfer wins")}
        ${renderMetric("Tutor events", repositoryTutor.summary.total, `${repositoryTutor.summary.helped} helped`)}
        ${renderMetric("Reward reads", repositoryRewards.summary.total, `${repositoryRewards.summary.parentActionRequired} parent action`)}
        ${renderMetric("Portfolio", portfolioEvidence.summary.portfolioItems, `${portfolioEvidence.summary.badgesEarned} badge(s)`)}
      </div>
      <div class="student-evidence-grid">
        <div class="student-evidence-box ${repositoryTutor.summary.total ? "" : "muted-box"}">
          <strong>Repository tutor events</strong>
          <p>${html(
            repositoryTutor.latest
              ? `${repositoryTutor.latest.modeTitle || repositoryTutor.latest.type || "Tutor event"}: ${repositoryTutor.latest.stuckPointLabel || repositoryTutor.latest.nextQuestion || "reviewable help recorded"}`
              : repositoryTutor.error
                ? `Learner-scoped tutor read failed: ${repositoryTutor.error}`
                : "No learner-scoped tutor event has been read for this learner yet."
          )}</p>
          <small>${html(`${repositoryTutor.summary.helped}/${repositoryTutor.summary.feedback} helped, ${repositoryTutor.summary.needsTruthReview} need truth review from ${repositoryTutor.source}`)}</small>
        </div>
        <div class="student-evidence-box ${repositoryRewards.summary.total ? "" : "muted-box"}">
          <strong>Repository reward approvals</strong>
          <p>${html(
            repositoryRewards.latest
              ? `${repositoryRewards.latest.rewardTitle}: ${rewardStatusLabel(repositoryRewards.latest.status)}`
              : repositoryRewards.error
                ? `Learner-scoped reward read failed: ${repositoryRewards.error}`
                : "No learner-scoped reward approval has been read for this learner yet."
          )}</p>
          <small>${html(`${repositoryRewards.summary.parentActionRequired} parent action, ${repositoryRewards.summary.approved} approved, ${repositoryRewards.summary.fulfilled} fulfilled from ${repositoryRewards.source}`)}</small>
        </div>
      </div>
      <div class="student-evidence-box ${portfolioEvidence.summary.portfolioItems || portfolioEvidence.summary.badgesEarned ? "" : "muted-box"}">
        <strong>Repository portfolio and badges</strong>
        <p>${html(
          portfolioEvidence.latestPortfolioItem
            ? `${portfolioEvidence.latestPortfolioItem.title} was saved as ${portfolioEvidence.latestPortfolioItem.artifactType}.`
            : portfolioEvidence.latestBadge
              ? `${portfolioEvidence.latestBadge.title} badge earned.`
              : portfolioEvidence.error
                ? `Learner-scoped portfolio read failed: ${portfolioEvidence.error}`
                : "No repository portfolio artifact or badge has been read for this learner yet."
        )}</p>
        <small>${html(`${portfolioEvidence.summary.visibleToParentTeacher} visible to parent/teacher from ${portfolioEvidence.source}`)}</small>
      </div>
      <div class="tutor-evidence-strip" aria-label="Tutor reflection progress">
        <article>
          <span>Diagnosed reflections</span>
          <strong>${tutorEvidence.qualified}/${tutorEvidence.total}</strong>
          <p>${html(tutorEvidence.latestQualified?.label ? `Latest stuck point: ${tutorEvidence.latestQualified.label}` : "Write what is confusing and let the tutor classify it for XP.")}</p>
        </article>
        <article>
          <span>Next tutor question</span>
          <strong>${html(tutorEvidence.latestQualified?.nextQuestion ? "Ready" : "Not yet")}</strong>
          <p>${html(tutorEvidence.latestQualified?.nextQuestion || "The tutor will give one question after diagnosing the stuck point.")}</p>
        </article>
      </div>
      <div class="section-head compact">
        <div>
          <p class="eyebrow">Subject academy map</p>
          <h2>Choose a subject mission</h2>
        </div>
      </div>
      <div class="subject-academy-grid">
        ${subjectProgress.map(renderSubjectAcademyCard).join("")}
      </div>
    </section>
  `;
}

function renderStudentEngagementBoard(learner, lesson, levelProfile) {
  const engagement = getStudentEngagementProfile(state, learner.id);
  const nextMission = engagement.nextMission;
  const rewardTrack = engagement.rewardTrack || levelProfile;
  const nextReward = rewardTrack?.nextReward;
  return `
    <section class="panel wide-panel engagement-board" aria-label="Daily learning missions">
      <div class="engagement-board-head">
        <div>
          <p class="eyebrow">Daily mission deck</p>
          <h2>Make your brain the main character</h2>
          <p>${html(engagement.celebration)}</p>
        </div>
        <div class="engagement-stats" aria-label="Learning momentum">
          <div><span>Streak</span><strong>${engagement.streak} day${engagement.streak === 1 ? "" : "s"}</strong></div>
          <div><span>Today</span><strong>+${engagement.todayXp} XP</strong></div>
          <div><span>Combo</span><strong>${engagement.combo}/${engagement.totalMissions}</strong></div>
        </div>
      </div>
      <div class="engagement-progress" aria-label="Daily mission progress">
        <span style="width:${Math.round((engagement.completedMissions / Math.max(1, engagement.totalMissions)) * 100)}%"></span>
      </div>
      <div class="mission-reward-runway" aria-label="Progress toward the next learning reward">
        <div class="mission-reward-copy">
          <span>Reward runway</span>
          <strong>Level ${html(rewardTrack?.level || 1)} · ${html(nextReward?.title || "Next mastery unlock")}</strong>
          <p>${html(nextReward?.benefit || "Keep collecting evidence through practice, explanation, and recall.")}</p>
        </div>
        <div class="mission-reward-meter">
          <div class="mission-reward-meter-top"><span>${html(rewardTrack?.xpToNextLevel || 0)} XP to next level</span><strong>${html(rewardTrack?.progressPercent || 0)}%</strong></div>
          <div class="mission-reward-track"><span style="width:${Math.max(0, Math.min(100, Number(rewardTrack?.progressPercent || 0)))}%"></span></div>
          <small>${html(rewardTrack?.unlockedCount || 0)} reward milestone${Number(rewardTrack?.unlockedCount || 0) === 1 ? "" : "s"} unlocked</small>
        </div>
      </div>
      <div class="mission-deck">
        ${engagement.missions.map((mission) => {
          const targetLessonId = mission.lessonId || lesson?.id || state.selectedLessonId;
          const targetView = mission.action === "ai" ? "ai" : "lesson";
          return `
            <article class="mission-card ${mission.done ? "mission-done" : mission.id === nextMission?.id ? "mission-next" : ""}">
              <div class="mission-icon">${html(mission.icon)}</div>
              <div class="mission-card-copy">
                <span>${mission.done ? "Cleared" : `+${mission.xp} XP`}</span>
                <h3>${html(mission.title)}</h3>
                <p>${html(mission.description)}</p>
              </div>
              ${mission.done
                ? `<strong class="mission-status">READY</strong>`
                : `<button class="small-button mission-action" data-lesson="${html(targetLessonId)}" data-view="${targetView}">${html(mission.actionLabel)}</button>`}
            </article>
          `;
        }).join("")}
      </div>
      <div class="engagement-footnote">
        <span>XP is earned for evidence</span>
        <span>Misses open a retry path</span>
        <span>Mastery unlocks meaningful rewards</span>
      </div>
    </section>
  `;
}

function renderClassSessionSteps(session) {
  return `
    <div class="class-step-rail" aria-label="Class session steps">
      ${(session.steps || [])
        .map(
          (step, index) => `
            <article class="class-step-card ${tokenClass(step.status)}">
              <span>${index + 1}</span>
              <strong>${html(step.label)}</strong>
              <small>${html(step.minutes)} min | ${html(step.status)}</small>
              <p>${html(step.studentAction)}</p>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function renderClassroomActionResult() {
  if (!lastClassroomResult) return "";
  return `
    <div class="batch-result classroom-action-result ${lastClassroomResult.accepted === false ? "failed" : "passed"}">
      <strong>${lastClassroomResult.accepted === false ? "Classroom action needs attention" : "Classroom action recorded"}</strong>
      <span>${html(lastClassroomResult.summary || lastClassroomResult.reason || "Classroom workflow updated.")}</span>
    </div>
  `;
}

function renderStudentClassroomPanel(learner) {
  const repositoryClassroom = getRepositoryStudentClassroom(learner.id);
  let classroom = repositoryClassroom.classroom || getLearnerClassSession(state, learner.id);
  let classroomSource = repositoryClassroom.classroom ? "repository classroom session" : "local classroom fallback";
  const canPreviewClassroom = ["teacher", "school-admin", "platform-admin"].includes(currentSession?.role || "");
  if (!classroom && canPreviewClassroom) {
    const repositoryPreview = Object.values(repositoryStudentClassroomsByLearner).find(Boolean) || null;
    classroom = repositoryPreview || state.learners.map((item) => getLearnerClassSession(state, item.id)).find(Boolean) || null;
    classroomSource = repositoryPreview ? "repository classroom session" : "local classroom fallback";
  }
  if (!classroom) return "";

  const { classSection, session, lesson, mission, learnerStatus, school } = classroom;
  const displayLearner = classroom.learner || learner;
  const previewingAnotherLearner = displayLearner.id !== learner.id;
  const subjectProgress = learnerStatus.subjectProgress || {};
  const masteryScore = Number(learnerStatus.mastery?.score || 0);

  return `
    <section class="panel wide-panel classroom-stage-panel">
      <div class="classroom-hero-grid">
        <div class="classroom-copy">
          <p class="eyebrow">School/Classroom Mode</p>
          <h2>${html(session.title)}</h2>
          <p>${html(session.launchGoal)}</p>
          <span class="status-pill" aria-label="repository student classroom source">${html(classroomSource)}</span>
          ${repositoryClassroom.error ? `<p class="form-note">${html(`Student classroom repository read failed: ${repositoryClassroom.error}`)}</p>` : ""}
          ${
            previewingAnotherLearner
              ? `<p class="staff-preview-note">Staff preview for ${html(displayLearner.name)}. Students only see class sessions they are enrolled in.</p>`
              : ""
          }
          <div class="classroom-meta-row">
            <span>${html(school?.name || "School pilot")}</span>
            <span>${html(classSection.name)}</span>
            <span>${html(classSection.schedule)}</span>
          </div>
          <div class="hero-actions">
            <button class="primary-button" data-lesson="${html(lesson.id)}" data-view="lesson">Enter class lesson</button>
            <button class="secondary-button" data-view="ai">Ask the tutor</button>
          </div>
          ${renderClassroomActionResult()}
        </div>
        <div class="classroom-status-card">
          <span>Live class status</span>
          <strong>${html(learnerStatus.status)}</strong>
          <p>${html(learnerStatus.currentStep)} | ${masteryScore}% mastery</p>
          ${renderXpTrack(subjectProgress.progressPercent || 0, `${displayLearner.name} class subject progress`)}
          <small>${html(learnerStatus.tutorSignal)}</small>
        </div>
      </div>
      ${renderClassSessionSteps(session)}
      <div class="classroom-learning-grid">
        <article class="classroom-visual-card">
          <span class="learning-signal">Visual mini-lesson</span>
          <h3>${html(lesson.title)}</h3>
          ${renderLessonVisualSummary(lesson)}
          ${renderProductionVisualFigure(
            getLessonProductionVisualAsset(lesson, ["teaching-diagram", "lesson-hero"]),
            lesson.objective,
            {
              className: "classroom-production-visual",
              title: "Class visual model",
              reviewLabel: "Approved visual used for the class mini-lesson."
            }
          )}
          <small>${html(lesson.teachingSupport?.summary || lesson.objective)}</small>
        </article>
        <article class="classroom-mission-card">
          <span class="learning-signal">Group mission</span>
          <h3>${html(mission?.title || lesson.groupHomework?.title || "Team learning mission")}</h3>
          <p>${html(mission?.sharedArtifact || lesson.groupHomework?.sharedOutcome || "Create a shared artifact and defend the evidence.")}</p>
          <div class="role-chip-row">
            ${(mission?.roles || lesson.groupHomework?.roles || []).map((role) => `<span>${html(role)}</span>`).join("")}
          </div>
          <small>${html(mission?.individualEvidence || lesson.groupHomework?.individualAccountability || "Each learner submits individual evidence.")}</small>
          ${renderProductionVisualFigure(
            getLessonProductionVisualAsset(lesson, ["group-homework"], { requirePreferredPlacement: true }),
            lesson.groupHomework?.sharedOutcome || "Group mission workflow visual.",
            {
              className: "group-homework-visual",
              title: "Group mission workflow",
              reviewLabel: "Group-work visual passed quality review."
            }
          )}
          ${
            mission
              ? `
                <form class="classroom-artifact-form" data-classroom-artifact="${html(mission.id)}" data-learner-id="${html(displayLearner.id)}">
                  <label>
                    My evidence sentence
                    <textarea name="individualEvidence" rows="3" placeholder="I think the forecast should change because...">${html(learnerStatus.artifact?.individualEvidence || "")}</textarea>
                  </label>
                  <button class="small-button" type="submit">${learnerStatus.artifact?.artifactStatus === "submitted" ? "Update evidence" : "Submit evidence"}</button>
                </form>
              `
              : ""
          }
        </article>
        <article class="classroom-teacher-card">
          <span class="learning-signal">Teacher sees</span>
          <h3>Progress, confusion, and intervention needs</h3>
          <p>The teacher monitor groups stuck points, mastery, group roles, and next actions so class support is based on evidence.</p>
          <small>Students still get their own child account, level, XP, tutor help, and subject progress.</small>
        </article>
      </div>
    </section>
  `;
}

function renderBridgeGrade6CoursePath(learner) {
  const path = getBridgeGrade6CoursePath(state, learner.id);
  if (!path.eligibleLearner && !path.totalLessons) return "";
  const ready = path.publicationStatus === "published" && path.totalLessons > 0;
  return `
    <section class="panel wide-panel bridge-course-path-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Bridge Academy course path</p>
          <h2>${html(path.title)}</h2>
          <p>${html(path.subtitle)}: math, science, ELA, and social studies missions built as app-led class sessions.</p>
        </div>
        <span class="status-pill ${ready ? "passed" : "failed"}">${html(ready ? "Student-ready" : "Awaiting publication")}</span>
      </div>
      <div class="metric-grid">
        ${renderMetric("Lessons", path.totalLessons, "Published missions")}
        ${renderMetric("Subjects", path.subjectCount, "Course worlds")}
        ${renderMetric("Complete", `${path.completedLessons}/${path.totalLessons || 5}`, "Mastery evidence")}
        ${renderMetric("Progress", `${path.progressPercent}%`, "Batch path")}
      </div>
      ${renderXpTrack(path.progressPercent, "Bridge Grade 6 course progress")}
      ${
        ready
          ? `
            <div class="hero-actions">
              <button class="primary-button" data-lesson="${html(path.nextLessonId)}" data-view="lesson">Continue: ${html(path.nextLessonTitle)}</button>
              <button class="secondary-button" data-view="ai">Ask tutor about this course</button>
            </div>
            <div class="published-lesson-list bridge-course-mission-list">
              ${path.lessons
                .map(
                  (lesson) => {
                    const world = subjectWorldMeta(lesson.subject);
                    return `
                      <article class="published-lesson-card subject-${html(lesson.subject)}">
                        <span class="subject-chip ${html(lesson.subject)}">${html(world.world)}</span>
                        <h3>${lesson.order}. ${html(lesson.title)}</h3>
                        <p>${html(lesson.objective)}</p>
                        <small>${html(`${lesson.visualSupportCount} visuals | ${lesson.quizCount} quiz checks | ${lesson.groupHomework ? "group mission" : "solo mission"}`)}</small>
                        <small>${html(`${lesson.masteryStatus} | ${lesson.masteryScore}%`)}</small>
                        <button class="small-button" data-lesson="${html(lesson.id)}" data-view="lesson">${lesson.completed ? "Review" : "Start"}</button>
                      </article>
                    `;
                  }
                )
                .join("")}
            </div>
          `
          : `<p class="callout">This path appears for students after the manager approves and publishes Bridge Academy Grade 6 Batch 1 from Admin. Until then, students only see already-approved lessons.</p>`
      }
    </section>
  `;
}

function renderSubjectAcademyCard(subject) {
  const lessonTarget = subject.nextLessonId ? `data-lesson="${html(subject.nextLessonId)}" data-view="lesson"` : `data-view="curriculum"`;
  const world = subjectWorldMeta(subject.subject);
  return `
    <article class="subject-academy-card subject-${html(subject.subject)} world-${html(tokenClass(subject.subject))}">
      <div class="subject-card-head">
        <span class="subject-token world-token">${html(world.icon)}</span>
        <div>
          <p class="subject-world-name">${html(world.world)}</p>
          <h3>${html(subject.label)}</h3>
          <small>${html(subject.courseTitle)} | ${html(subject.status)}</small>
        </div>
      </div>
      <div class="subject-level-line">
        <strong>Subject level ${subject.level}</strong>
        <span>${subject.currentLevelXp}/${subject.nextLevelXp} XP | ${html(world.action)}</span>
      </div>
      ${renderXpTrack(subject.progressPercent, `${subject.label} level progress`)}
      <p>${html(subject.visualSignal)}</p>
      <div class="subject-card-meta">
        <span>${subject.masteryAverage}% mastery</span>
        <span>${subject.visualSupportCount} visuals</span>
        <span>${subject.completedLessons}/${subject.plannedLessons} lessons</span>
      </div>
      <div class="subject-next">
        <strong>Next:</strong>
        <span>${html(subject.nextLessonTitle)}</span>
      </div>
      <div class="hero-actions">
        <button class="small-button" ${lessonTarget}>Open</button>
        <button class="small-button" data-view="ai">Ask tutor</button>
      </div>
    </article>
  `;
}

function renderProductLearningFlow({ learner, lesson, levelProfile }) {
  const answers = state.selectedAnswers?.[lesson.id] || {};
  const quizResult = state.quizResults?.[lesson.id] || null;
  const scratchpad = getLessonScratchpad(state, learner.id, lesson.id);
  const rewardQueue = getRewardApprovalQueue(state, learner.id);
  const latestReward = rewardQueue[0] || null;
  const interaction = getInteractiveResponse(state, learner.id, lesson.id, getLessonInteractiveConfig(lesson).widgetId);
  const steps = [
    {
      label: "Parent",
      title: "Create child login",
      status: currentSession?.role === "student" || currentSession?.role === "parent" ? "done" : "next",
      body: "Parent owns the household, consent, rewards, and child account."
    },
    {
      label: "Child",
      title: "Choose subject world",
      status: lesson ? "done" : "next",
      body: `${subjectWorldMeta(lesson.subject).world}: ${lesson.title}`
    },
    {
      label: "Lesson",
      title: "See and interact",
      status: interaction.value ? "done" : "next",
      body: interaction.value ? interaction.feedback : "The app shows a visual model, then saves an interactive attempt."
    },
    {
      label: "Tutor",
      title: "Write the stuck point",
      status: scratchpad.explanation || scratchpad.confusion || scratchpad.firstStep ? "done" : "next",
      body: scratchpad.explanation || scratchpad.confusion || scratchpad.firstStep || "Student writes what is confusing before the tutor helps."
    },
    {
      label: "Quiz",
      title: "Earn mastery XP",
      status: quizResult ? (quizResult.passed ? "done" : "repair") : Object.keys(answers).length ? "next" : "locked",
      body: quizResult ? `${quizResult.score}% ${quizResult.passed ? "mastered" : "needs reteach"}` : `${Object.keys(answers).length}/${lesson.quiz.length} answers selected`
    },
    {
      label: "Reward",
      title: "Parent approves benefit",
      status: latestReward ? latestReward.status : levelProfile.unlockedRewards?.length ? "next" : "locked",
      body: latestReward ? `${latestReward.rewardTitle}: ${rewardStatusLabel(latestReward.status)}` : "Reward unlocks after mastery and recall evidence."
    }
  ];

  return `
    <section class="panel wide-panel product-flow-panel" aria-label="End-to-end learning product flow">
      <div class="section-head">
        <div>
          <p class="eyebrow">Product learning loop</p>
          <h2>Parent account to child mastery to parent progress</h2>
        </div>
        <span class="status-pill">${steps.filter((step) => step.status === "done").length}/${steps.length} live</span>
      </div>
      <div class="flow-step-grid">
        ${steps
          .map(
            (step, index) => `
              <article class="flow-step-card ${html(step.status)}">
                <span>${index + 1} ${html(step.label)}</span>
                <strong>${html(step.title)}</strong>
                <p>${html(step.body)}</p>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderStudentLaunchPanel(learner, lesson, levelProfile) {
  const support = getLessonTeachingSupport(lesson.id, state);
  const subject = subjectWorldMeta(lesson.subject);
  const scratchpad = getLessonScratchpad(state, learner.id, lesson.id);
  return `
    <section class="panel wide-panel student-launch-panel subject-${html(lesson.subject)}">
      <div class="student-launch-copy">
        <p class="eyebrow">Start class</p>
        <h2>${html(subject.world)} is ready</h2>
        <p>${html(support.summary || lesson.objective)}</p>
        <div class="hero-actions">
          <button class="primary-button" data-lesson="${html(lesson.id)}" data-view="lesson">Enter app-led lesson</button>
          <button class="secondary-button" data-view="ai">Ask tutor what is stuck</button>
        </div>
      </div>
      <div class="student-launch-board">
        <article>
          <span>Visual</span>
          <strong>${html(lesson.visual?.title || "Lesson model")}</strong>
          <p>${html(lesson.visual?.caption || lesson.objective)}</p>
        </article>
        <article>
          <span>Action</span>
          <strong>Try it yourself</strong>
          <p>${html(lesson.funTasks?.[0] || lesson.sections.activity)}</p>
        </article>
        <article>
          <span>Stuck point</span>
          <strong>${scratchpad.explanation || scratchpad.confusion ? "Tutor context saved" : "Write it out"}</strong>
          <p>${html(scratchpad.explanation || scratchpad.confusion || "The tutor starts by asking what exactly does not make sense.")}</p>
        </article>
        <article>
          <span>Reward</span>
          <strong>${html(levelProfile.nextReward?.title || "Next level reward")}</strong>
          <p>${html(levelProfile.nextReward?.benefit || "Earned through mastery evidence.")}</p>
        </article>
      </div>
    </section>
  `;
}

function renderSpecialAiLessonShowcase() {
  const lesson = findLessonInState(state, "g6-learning-ai-build-test");
  if (!lesson) return "";
  const subject = subjectWorldMeta(lesson.subject);
  const topics = [
    "AI definitions",
    "Prompting",
    "Frontend",
    "Backend",
    "APIs",
    "Databases",
    "Agents",
    "Tool calls",
    "Testing",
    "Debugging",
    "Env vars",
    "Logs",
    "Cost limits",
    "AI safety",
    "Fact-checking"
  ];

  return `
    <section class="panel wide-panel special-ai-showcase subject-${html(lesson.subject)}">
      <div class="special-ai-copy">
        <p class="eyebrow">${html(lesson.showcase?.label || "Featured special lesson")}</p>
        <h2>${html(lesson.title)}: build, prompt, test, debug</h2>
        <p>${html(lesson.objective)}</p>
        <div class="hero-actions">
          <button class="primary-button" data-lesson="${html(lesson.id)}" data-view="lesson">Start Learning AI</button>
          <button class="secondary-button" data-view="ai">Ask the AI tutor</button>
        </div>
      </div>
      <div class="special-ai-map">
        <span class="learning-signal">${html(subject.world)}</span>
        <strong>What this class teaches</strong>
        <div class="special-topic-cloud">
          ${topics.map((topic) => `<span>${html(topic)}</span>`).join("")}
        </div>
        <small>${html(lesson.showcase?.reason || "A hands-on AI builder lesson.")}</small>
      </div>
    </section>
  `;
}

function renderStudentView() {
  const learner = currentLearner();
  const academy = findAcademy(learner?.academyId || state.selectedAcademyId);
  const levelProfile = getLearnerLevelProfile(state, learner.id);
  const subjectProgress = getLearnerSubjectProgress(state, learner.id);
  const totals = getCurriculumTotals();
  const rawTodayPlan = scopedTodayPlan();
  const todayPlanReads = rawTodayPlan.map((lesson) => applyRepositoryLessonMastery(lesson, learner.id));
  const todayPlan = todayPlanReads.map((entry) => entry.lesson);
  const todayPlanSource = todayPlan.length && todayPlanReads.every((entry) => entry.source === "learner-scoped repository")
    ? "learner-scoped repository"
    : "local lesson fallback";
  const selectedPlan = todayPlan.find((lesson) => lesson.academyId === academy.id) || todayPlan[0];
  const promise = academyLearningPromise(academy.id);

  return renderShell(`
    ${renderRoleHero({
      role: "child",
      eyebrow: "Child page",
      title: `${academy.name} mission board`,
      body: "The learner sees what to do now, the visual model to use, how to ask for help, and which mastery reward is tied to delayed recall.",
      primaryAction: { label: "Start today", view: "lesson" },
      secondaryAction: { label: "Ask tutor", view: "ai" },
      stats: [
        { label: "Current grade", value: `Grade ${learner.grade}`, detail: academy.name },
        { label: "Level", value: levelProfile.level, detail: `${levelProfile.totalXp} XP earned` },
        { label: "Next reward", value: `L${levelProfile.nextReward.level}`, detail: levelProfile.nextReward.title }
      ]
    })}
    ${renderProductLearningFlow({ learner, lesson: selectedPlan, levelProfile })}
    ${renderStudentEngagementBoard(learner, selectedPlan, levelProfile)}
    ${renderSpecialAiLessonShowcase()}
    ${renderStudentLaunchPanel(learner, selectedPlan, levelProfile)}
    ${renderChildLevelDashboard(learner, levelProfile, subjectProgress)}
    ${renderStudentClassroomPanel(learner)}
    ${renderBridgeGrade6CoursePath(learner)}
    <section class="panel dashboard-panel student-home-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Child workspace</p>
          <h2>Today starts in ${html(academy.name)}</h2>
        </div>
        ${academyBadge(academy)}
      </div>
      <div class="student-hero">
        <div class="hero-copy">
          <span class="learning-signal">${html(promise.signal)}</span>
          <h3>${html(selectedPlan.title)}</h3>
          <p>${html(promise.rhythm)}</p>
          <div class="hero-actions">
            <button class="primary-button" data-lesson="${html(selectedPlan.id)}" data-view="lesson">Start visual lesson</button>
            <button class="secondary-button" data-view="ai">Ask tutor</button>
          </div>
        </div>
        <div class="hero-path" aria-label="Learning path preview">
          ${["Look", "Try", "Explain", "Recall"].map((step) => `<span>${html(step)}</span>`).join("")}
        </div>
        <div class="poster-signal-board" aria-label="Student mission signals">
          <span>Visual first</span>
          <span>Ask what is stuck</span>
          <span>Mastery XP</span>
        </div>
      </div>
      <div class="academy-selector" role="list" aria-label="Academy selector">
        ${curriculum.academies
          .map(
            (item) => `
              <button class="academy-card ${item.id === academy.id ? "selected" : ""}" data-academy="${item.id}" role="listitem">
                <span>${html(item.range)}</span>
                <strong>${html(item.name)}</strong>
                <small>${html(item.purpose)}</small>
              </button>
            `
          )
          .join("")}
      </div>
      <div class="visual-band" aria-label="K-12 academy pathway visual">
        <canvas id="learningMap" width="920" height="280"></canvas>
      </div>
    </section>

    ${renderExperienceSwitchboard({
      eyebrow: "Child learning controls",
      title: "Visual, active, and built around student confusion",
      items: [
        {
          kicker: "Picture first",
          title: "See the idea before the rule",
          body: "The lesson opens with a model, diagram, or manipulative so the learner can anchor the idea before reading the abstraction.",
          tone: "coral",
          view: "lesson",
          action: "Open lesson"
        },
        {
          kicker: "Plain-text confusion",
          title: "Write what feels stuck",
          body: "The tutor prompt captures the exact sentence, picture, or first step the student does not understand before choosing an explanation path.",
          tone: "blue",
          view: "ai",
          action: "Ask tutor"
        },
        {
          kicker: "Mastery reward",
          title: "Unlock only after recall",
          body: "Badges and family rewards are tied to mastery, transfer, or delayed recall instead of raw screen time.",
          tone: "green",
          view: "experiments",
          action: "View recall"
        },
        {
          kicker: "Sound cues",
          title: "Quiet feedback, no clutter",
          body: "Short tones confirm taps, page changes, and successful checkpoints while respecting the sound toggle and reduced-motion settings.",
          tone: "gold"
        }
      ]
    })}

    <aside class="panel side-panel">
      <div class="section-head compact">
        <h2>System scope</h2>
      </div>
      <div class="metric-grid single">
        ${renderMetric("Academies", totals.academies, "One shared web app")}
        ${renderMetric("Courses", totals.courseCount, "Across K-12")}
        ${renderMetric("Planned units", totals.plannedUnitCount, "Mapped before lesson scale")}
        ${renderMetric("Target lessons", totals.targetLessons.toLocaleString(), "Full school content plan")}
      </div>
    </aside>

    <section class="panel wide-panel daily-path-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Daily learning path</p>
          <h2>What the student does next</h2>
          <small>${html(`Progress source: ${todayPlanSource}`)}</small>
        </div>
        <button class="secondary-button" data-view="lesson">Open lesson player</button>
      </div>
      <div class="lesson-list">
        ${todayPlan
          .map(
            (lesson) => `
              <button class="lesson-row daily-lesson-card ${lesson.id === selectedPlan.id ? "selected" : ""}" data-lesson="${lesson.id}" data-view="lesson">
                <span class="subject-chip ${html(lesson.subject)}">${html(lesson.grade)}</span>
                <span>
                  <strong>${html(lesson.title)}</strong>
                  <small>${html(lesson.courseTitle)} | ${html(lesson.objective)}</small>
                </span>
                <span class="status-pill">${html(lesson.mastery.status)}</span>
                <span class="score">${lesson.mastery.score}%</span>
              </button>
            `
          )
          .join("")}
      </div>
    </section>

    <section class="panel academy-rules-panel">
      <div class="section-head compact">
        <h2>How this academy teaches</h2>
      </div>
      <ul class="clean-list">
        <li><strong>Purpose:</strong> ${html(academy.purpose)}</li>
        <li><strong>Style:</strong> ${html(academy.style)}</li>
        <li><strong>Student action:</strong> ${html(promise.learnerAction)}</li>
        <li><strong>Parent role:</strong> progress review, schedule, assignments, portfolio, and AI visibility.</li>
      </ul>
    </section>
  `);
}

function renderCurriculumView() {
  const academy = currentAcademy();
  const librarySummary = getPlatformLessonLibrarySummary();
  const librarySamples = getPlatformLessonLibrarySamples(6);
  const batchPlan = getPlatformLessonProductionBatchPlan({ batchSize: 24, limit: 6 });
  const pilotQuality = getPilotQualityGateReport(state);
  const openAiReadiness = getPlatformOpenAiImageReadiness();
  const publishedLessonSummary = getPublishedLessonSummary(state);
  const selectedGrade = selectedGradeId
    ? academy.grades.find((grade) => grade.id === selectedGradeId) || academy.grades[0]
    : academy.grades[0];
  selectedGradeId = selectedGrade.id;

  return renderShell(`
    <section class="panel wide-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Curriculum map</p>
          <h2>${html(academy.name)} ${academyBadge(academy)}</h2>
        </div>
        <div class="button-group">
          ${curriculum.academies
            .map(
              (item) => `
                <button class="small-button ${item.id === academy.id ? "active" : ""}" data-academy="${item.id}">
                  ${html(item.range)}
                </button>
              `
            )
            .join("")}
        </div>
      </div>
      <div class="grade-rail" role="list" aria-label="Grades">
        ${academy.grades
          .map(
            (grade) => `
              <button class="grade-pill ${grade.id === selectedGrade.id ? "active" : ""}" data-grade="${grade.id}">
                ${html(grade.label)}
              </button>
            `
          )
          .join("")}
      </div>
      <div class="course-grid">
        ${selectedGrade.courses
          .map(
            (course) => `
              <article class="course-card">
                <div class="course-title">
                  <span class="subject-chip ${html(course.subject)}">${html(course.subject.replace("-", " "))}</span>
                  <h3>${html(course.title)}</h3>
                </div>
                <p>${course.unitCount} units | ${course.units.reduce((sum, unit) => sum + unit.lessonTarget, 0)} planned lessons</p>
                <ol>
                  ${course.units.map((unit) => `<li>${html(unit.title)}</li>`).join("")}
                </ol>
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    <aside class="panel side-panel">
      <div class="section-head compact">
        <h2>Standards baseline</h2>
      </div>
      <div class="standards-list">
        ${standardsFrameworks
          .map(
            (standard) => `
              <div class="standard-row">
                <strong>${html(standard.name)}</strong>
                <small>${html(standard.purpose)}</small>
              </div>
            `
          )
          .join("")}
      </div>
    </aside>

    <section class="panel wide-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Production lesson library</p>
          <h2>${librarySummary.generatedLessonCount.toLocaleString()} structured lesson blueprints</h2>
        </div>
        <span class="status-pill">${librarySummary.readinessPassed ? "Ready" : "Needs work"}</span>
      </div>
      <div class="metric-grid">
        ${renderMetric("Target", librarySummary.targetLessonCount.toLocaleString(), "K-12 lesson count")}
        ${renderMetric("Units", librarySummary.unitCount, "Curriculum map")}
        ${renderMetric("Visuals", librarySummary.visualReady.toLocaleString(), "Every blueprint")}
        ${renderMetric("Group tasks", librarySummary.groupHomeworkReady.toLocaleString(), "Grades 6-12")}
      </div>
      <div class="library-sample-grid">
        ${librarySamples
          .map(
            (lesson) => `
              <article class="library-sample-card">
                <span class="subject-chip ${html(lesson.subject)}">${html(lesson.gradeBand)}</span>
                <h3>${html(lesson.title)}</h3>
                <p>${html(lesson.learningObjective)}</p>
                <small>${html(lesson.visualRequirement)} | ${html(lesson.reward)}</small>
              </article>
            `
          )
          .join("")}
      </div>
      <p class="callout">OpenAI image generation is ${openAiReadiness.ready ? "configured" : "waiting for OPENAI_API_KEY"} and remains review-gated before images become student-facing.</p>
    </section>

    <section class="panel wide-panel pilot-quality-gate-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Non-negotiable release gate</p>
          <h2>Six-pilot quality board</h2>
        </div>
        <span class="status-pill">${pilotQuality.scaleUnlocked ? "Scale unlocked" : "Scale blocked"}</span>
      </div>
      <p class="callout">Every pilot must earn at least a B across student-facing lesson teaching, image prompt quality, generated visual quality, quiz, tutor handoff, accessibility, and required phase-specific visuals before new K-12 production batches can start.</p>
      <div class="metric-grid">
        ${renderMetric("Passed", `${pilotQuality.passedLessons}/${pilotQuality.totalLessons}`, "Minimum B")}
        ${renderMetric("A grades", pilotQuality.summary.a, "Ready to model")}
        ${renderMetric("Visual placements", `${pilotQuality.summary.visualPlacementsReady}/${pilotQuality.summary.visualPlacementsRequired}`, "Approved assets")}
        ${renderMetric("Missing visuals", pilotQuality.summary.missingVisualPlacements, "Must be produced")}
      </div>
      <div class="library-sample-grid">
        ${pilotQuality.lessons
          .map(
            (lesson) => `
              <article class="library-sample-card ${lesson.passed ? "pilot-pass" : "pilot-blocked"}">
                <div class="tool-card-topline"><span class="subject-chip ${html(lesson.subject)}">Grade ${html(lesson.gradeLevel)}</span><span class="status-pill">${html(lesson.grade)} | ${lesson.score}</span></div>
                <h3>${html(lesson.title)}</h3>
                <p>${html(lesson.passed ? "All required pilot gates passed." : lesson.blockers.join(" "))}</p>
                <small>${html(`Content ${lesson.contentReview.grade} | Prompt ${lesson.promptReview.grade} | Visual ${lesson.visualReview.grade}`)}</small>
                ${
                  lesson.visualPlacementStatus?.missingPlacements?.length
                    ? `<small>${html(`Missing: ${lesson.visualPlacementStatus.missingPlacements.join(", ")}`)}</small>`
                    : `<small>${html(`Visuals: ${lesson.visualPlacementStatus?.approvedAssetIds?.length || 0}/${lesson.visualPlacementStatus?.requiredPlacements?.length || 0} placements approved`)}</small>`
                }
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    <section class="panel wide-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Production batch plan</p>
          <h2>Turn the full library into reviewed lessons</h2>
        </div>
        <span class="status-pill">${batchPlan.totalBatches} batches</span>
      </div>
      <div class="metric-grid">
        ${renderMetric("First wave", batchPlan.firstWaveBatchCount, "Bridge batches")}
        ${renderMetric("Bridge lessons", batchPlan.firstWaveLessonCount.toLocaleString(), "6-8 sellable wedge")}
        ${renderMetric("Review gates", batchPlan.reviewGateCount.toLocaleString(), "Across all batches")}
        ${renderMetric("Visual slots", batchPlan.visualRequirementCount.toLocaleString(), "Prompt/image needs")}
        ${renderMetric("Group tasks", batchPlan.groupHomeworkCount.toLocaleString(), "6-12 collaboration")}
      </div>
      <div class="library-sample-grid">
        ${batchPlan.batches
          .map(
            (batch) => `
              <article class="library-sample-card">
                <span class="subject-chip ${html(batch.subject)}">${html(batch.gradeBand)} | Grade ${html(batch.gradeLevel)}</span>
                <h3>${html(batch.title)}</h3>
                <p>${html(batch.productionWave)}</p>
                <small>${html(`${batch.lessonCount} lessons | ${batch.visualRequirementCount} visuals | ${batch.groupHomeworkCount} group tasks`)}</small>
                <small>${html(batch.reviewSteps.join(" -> "))}</small>
              </article>
            `
          )
          .join("")}
      </div>
      <p class="callout">This is the production conveyor belt: every batch must become authored drafts, pass truth/standards review, receive reviewed visuals, pass quiz/mastery QA, then publish into the learner path.</p>
    </section>

    <section class="panel wide-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Published catalog</p>
          <h2>Approved lessons ready for the learner path</h2>
        </div>
        <span class="status-pill">${publishedLessonSummary.total} live</span>
      </div>
      <div class="metric-grid">
        ${renderMetric("Published", publishedLessonSummary.total, "Draft-approved records")}
        ${renderMetric("Foundation", publishedLessonSummary.foundation, "K-5")}
        ${renderMetric("Bridge", publishedLessonSummary.bridge, "6-8")}
        ${renderMetric("Scholar", publishedLessonSummary.scholar, "9-12")}
        ${renderMetric("Visual-ready", publishedLessonSummary.withVisualSupports, "Diagram/tutor support")}
        ${renderMetric("Quiz-ready", publishedLessonSummary.withQuiz, "Mastery checks")}
      </div>
      ${renderPublishedLessonRecords()}
    </section>
  `);
}

function studentLessonVoice(lesson) {
  const academyVoice = {
    foundation: {
      opener: "Let's learn this with a picture, a quick build, and a tiny check.",
      visualVerb: "Point to the parts you can see.",
      explainPrompt: "Say it in your own words. You can use a sentence, a drawing, or a quick voice note with your parent.",
      quizLabel: "Checkpoint game"
    },
    bridge: {
      opener: "Your mission is to inspect the evidence, try a model, and explain the rule.",
      visualVerb: "Read the diagram like a clue board.",
      explainPrompt: "Write your claim, your evidence, and what still feels confusing.",
      quizLabel: "Mission checkpoint"
    },
    scholar: {
      opener: "Build a usable mental model, apply it to evidence, then prove you can transfer it.",
      visualVerb: "Analyze the model before memorizing terms.",
      explainPrompt: "Write a precise explanation with evidence and the first question you still have.",
      quizLabel: "Mastery checkpoint"
    }
  };
  return academyVoice[lesson.academyId] || academyVoice.foundation;
}

function renderAppTeacherPanel(lesson, support) {
  const voice = studentLessonVoice(lesson);
  const callouts = support.diagramCallouts.slice(0, 3);
  const guide = lesson.studentFacing || {};
  return `
    <section class="app-teacher-panel" aria-label="App-led teaching">
      <div class="app-teacher-copy">
        <span class="learning-signal">App teacher</span>
        <h3>${html(guide.mission || voice.opener)}</h3>
        <p>${html(guide.whyItMatters || support.summary || lesson.sections.teach)}</p>
      </div>
      <div class="teacher-callout-stack" aria-label="What to notice">
        ${callouts
          .map(
            (callout, index) => `
              <article>
                <span>${index + 1}</span>
                <strong>${html(callout.title)}</strong>
                <p>${html(callout.body)}</p>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderStudentFacingGuide(lesson, support) {
  const guide = lesson.studentFacing || {};
  const steps = guide.modelSteps?.length ? guide.modelSteps : support.diagramCallouts.map((callout) => `${callout.title}: ${callout.body}`);
  return `
    <section class="student-guide-panel" aria-label="Student lesson guide">
      <div class="student-guide-hero">
        <span class="learning-signal">Your mission</span>
        <h3>${html(guide.mission || lesson.title)}</h3>
        <p>${html(guide.bigIdea || support.summary || lesson.objective)}</p>
      </div>
      <div class="student-guide-grid">
        <article class="student-guide-card focus">
          <span>Why this matters</span>
          <p>${html(guide.whyItMatters || lesson.objective)}</p>
        </article>
        <article class="student-guide-card">
          <span>Model steps</span>
          <ol>
            ${steps.slice(0, 4).map((step) => `<li>${html(step)}</li>`).join("")}
          </ol>
        </article>
        <article class="student-guide-card example">
          <span>Example</span>
          <p>${html(guide.example || lesson.sections.guidedPractice)}</p>
        </article>
        <article class="student-guide-card non-example">
          <span>Watch out</span>
          <p>${html(guide.nonExample || support.commonMisunderstandings[0]?.mistake || "Do not rush past the model.")}</p>
        </article>
      </div>
    </section>
  `;
}

function renderSpecialAiBuilderLessonPanel(lesson) {
  if (lesson.id !== "g6-learning-ai-build-test") return "";
  const definitions = lesson.definitionCards || [];
  const path = lesson.builderPath || [];
  return `
    <section class="special-ai-builder-panel" aria-label="Learning AI builder lesson">
      <div class="section-head">
        <div>
          <p class="eyebrow">Special AI builder class</p>
          <h2>Learn the words, then build the system</h2>
        </div>
        <span class="status-pill">Featured</span>
      </div>
      <div class="ai-builder-path">
        ${path
          .map(
            (step, index) => `
              <article>
                <span>${String(index + 1).padStart(2, "0")}</span>
                <strong>${html(step.title)}</strong>
                <p>${html(step.body)}</p>
              </article>
            `
          )
          .join("")}
      </div>
      <div class="ai-definition-grid">
        ${definitions
          .map(
            (card) => `
              <article>
                <strong>${html(card.term)}</strong>
                <p>${html(card.definition)}</p>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderTeachingMoment({ number, kicker, title, body, action, tone = "" }) {
  return `
    <article class="teaching-moment ${html(tone)}">
      <span class="moment-number">${html(number)}</span>
      <div>
        <p class="eyebrow">${html(kicker)}</p>
        <h3>${html(title)}</h3>
        <p>${html(body)}</p>
        ${action ? `<div class="moment-action">${action}</div>` : ""}
      </div>
    </article>
  `;
}

const nexusPhaseLabels = {
  orient: "Orient",
  model: "Model",
  deconstruct: "Break Down",
  practice: "Practice",
  reason: "Reason",
  prove: "Prove",
  remember: "Remember",
  transfer: "Transfer",
  adapt: "Adapt"
};

const nexusPhaseTone = {
  orient: "blue",
  model: "green",
  deconstruct: "gold",
  practice: "coral",
  reason: "purple",
  prove: "blue",
  remember: "green",
  transfer: "coral",
  adapt: "gold"
};

function getNexusLessonPlayerModel(lesson) {
  const nexusLesson = lesson.schemaVersion === "3" ? lesson : adaptV2LessonToNexusV3(lesson);
  const validation = validateNexusLessonV3(nexusLesson, { requireNative: nexusLesson.schemaVersion === "3" });
  return {
    lesson: nexusLesson,
    validation,
    modules: getRenderableNexusPhaseModules(nexusLesson)
  };
}

function renderNexusPhaseAction(module, lesson, learnerId, scratchpad, answers, result) {
  if (module.phase === "orient") {
    return `
      <div class="nexus-orient-card">
        <strong>Mission start</strong>
        <p>${html(lesson.essentialQuestion || lesson.learningObjective || module.studentAction)}</p>
        <span>Before you begin, make one prediction or connection.</span>
      </div>
    `;
  }
  if (module.phase === "model") return renderLessonVisual(lesson);
  if (module.phase === "deconstruct") {
    const steps = lesson.studentFacing?.steps || lesson.studentFacing?.modelSteps || [];
    return `
      <div class="nexus-breakdown-card">
        <strong>Build the idea from its parts</strong>
        ${steps.length
          ? `<ol>${steps.slice(0, 5).map((step) => `<li>${html(typeof step === "string" ? step : step.text || step.title || "")}</li>`).join("")}</ol>`
          : `<p>Underline the important parts, name what must be true, and explain how the parts connect.</p>`}
      </div>
    `;
  }
  if (module.phase === "practice") {
    return `
      ${renderInteractiveWidget(lesson, learnerId)}
      <div class="student-scratchpad">
        <label>
          Your first try
          <textarea rows="3" data-scratchpad-field="firstStep" data-lesson-id="${html(lesson.id)}" placeholder="Write or sketch your first step here.">${html(scratchpad.firstStep || "")}</textarea>
        </label>
      </div>
    `;
  }
  if (module.phase === "reason") {
    const isMythologyDecoder = lesson.id === "published-draft-next-wave-bridge-6-ela-u1-l1" || lesson.sourceDraftId === "draft-next-wave-bridge-6-ela-u1-l1";
    return `
      <div class="student-scratchpad">
        ${
          isMythologyDecoder
            ? `<div class="confusion-router-card">
                <span>Stuck-point router</span>
                <strong>Tell the tutor exactly where the myth analysis breaks.</strong>
                <p>Use the boxes below to separate your theme claim, your evidence, and the part that does not make sense yet.</p>
                <div class="confusion-chip-row">
                  <span>plot vs theme</span>
                  <span>symbol meaning</span>
                  <span>evidence</span>
                  <span>claim wording</span>
                </div>
              </div>`
            : ""
        }
        <label>
          ${html(isMythologyDecoder ? "My theme claim or first answer" : "My reasoning")}
          <textarea rows="3" data-scratchpad-field="explanation" data-lesson-id="${html(lesson.id)}" placeholder="${html(isMythologyDecoder ? "Example: I think the theme is that pride can make people ignore danger because..." : "Write your claim, evidence, and exact stuck point.")}">${html(scratchpad.explanation || "")}</textarea>
        </label>
        <label>
          ${html(isMythologyDecoder ? "What exactly is confusing?" : "Exact stuck point")}
          <textarea rows="3" data-scratchpad-field="confusion" data-lesson-id="${html(lesson.id)}" placeholder="${html(isMythologyDecoder ? "Example: I can retell the plot, but I do not know if my evidence proves the theme." : "Write the exact word, visual, first step, or reasoning gap that is confusing.")}">${html(scratchpad.confusion || "")}</textarea>
        </label>
        <button class="secondary-button" data-scratchpad-review="${html(lesson.id)}">${html(isMythologyDecoder ? "Send my stuck point to tutor" : "Have tutor review my confusion")}</button>
      </div>
    `;
  }
  if (module.phase === "prove") return renderStudentQuizBlock(lesson, answers, result);
  if (module.phase === "remember") {
    const firstRecall = lesson.retentionChecks?.[0] || "Come back later and prove the idea still sticks.";
    const memoryAsset = getLessonProductionVisualAsset(lesson, ["memory-vault"], { requirePreferredPlacement: true });
    return `<div class="nexus-memory-card"><strong>Memory Vault</strong><p>${html(firstRecall.prompt || firstRecall)}</p>${renderProductionVisualFigure(memoryAsset, "Memory Vault retrieval cue", { className: "memory-vault-visual", title: "Memory Vault retrieval visual", reviewLabel: "Approved delayed-retrieval visual." })}</div>`;
  }
  if (module.phase === "transfer") {
    const firstTask = lesson.funTasks?.[1] || lesson.sections.challenge || module.studentAction;
    return `<div class="active-task-pair"><div><strong>Transfer challenge</strong><p>${html(firstTask)}</p></div><div><strong>Explain</strong><p>Show how the idea still works when the situation changes.</p></div></div>`;
  }
  if (module.phase === "adapt") return renderStudentMisconceptionRepair(getLessonTeachingSupport(lesson.id, state), lesson);
  return "";
}

function renderNexusLessonPhaseSequence(lesson, answers, result, experience, support, learnerId, scratchpad) {
  const playerModel = getNexusLessonPlayerModel(lesson);
  const nativeLabel = playerModel.lesson.schemaVersion === "3" ? "Native V3" : "V2 adapted";
  const validationLabel = playerModel.validation.passed ? "Contract ready" : "Needs contract repair";
  const modules = playerModel.modules;
  const repositoryEvidence = getRepositoryLessonEvidence(learnerId, lesson.id);
  const repositoryCompletedPhases = repositoryEvidence.phaseEvidenceSource === "learner-scoped repository"
    ? repositoryEvidence.phaseCompletions.map((item) => item.phase).filter(Boolean)
    : [];
  const phaseProgress = getNexusPhaseProgress(state, learnerId, lesson.id, {
    completedPhases: repositoryCompletedPhases,
    scratchpad: repositoryEvidence.scratchpad,
    quizResult: repositoryEvidence.quizResult,
    interactiveResponse: repositoryEvidence.interactiveResponse
  });
  const completedPhases = new Set([...phaseProgress.completedPhases, ...repositoryCompletedPhases]);
  return `
    <section class="nexus-phase-player" aria-label="Nexus V3 lesson phases">
      <div class="section-head">
        <div>
          <p class="eyebrow">Nexus Learning OS</p>
          <h2>Learn through the active phases</h2>
        </div>
        <div class="nexus-contract-badges">
          <span>${html(nativeLabel)}</span>
          <span>${html(validationLabel)}</span>
          <span>${modules.length}/${playerModel.lesson.activePhases.length} phases shown</span>
        </div>
      </div>
      ${
        playerModel.validation.warnings?.length
          ? `<p class="callout">${html(playerModel.validation.warnings[0].message)}</p>`
          : ""
      }
      <div class="nexus-phase-rail" aria-label="Active phases">
        ${modules
          .map(
            (module, index) => `
              <span>
                <b>${index + 1}</b>
                ${html(nexusPhaseLabels[module.phase] || module.phase)}
              </span>
            `
          )
          .join("")}
      </div>
      <div class="nexus-phase-stack">
        ${modules
          .map((module, index) => {
            const action = renderNexusPhaseAction(module, lesson, learnerId, scratchpad, answers, result);
            const phaseState = phaseProgress.phases.find((item) => item.phase === module.phase) || {
              done: false,
              ready: index === 0,
              locked: index > 0,
              reason: "Complete the previous evidence move first."
            };
            const phaseDone = completedPhases.has(module.phase) || phaseState.done;
            const phaseLocked = !phaseDone && !phaseState.ready;
            return `
              <article class="nexus-phase-card ${html(nexusPhaseTone[module.phase] || "blue")}" data-nexus-phase="${html(module.phase)}">
                <div class="nexus-phase-index">
                  <span>${String(index + 1).padStart(2, "0")}</span>
                  <strong>${html(nexusPhaseLabels[module.phase] || module.phase)}</strong>
                </div>
                <div class="nexus-phase-body">
                  <p class="eyebrow">${html(playerModel.lesson.lessonFamily.replaceAll("_", " "))}</p>
                  <h3>${html(module.title)}</h3>
                  <p>${html(module.studentAction)}</p>
                  ${module.visualSupport ? `<small>${html(module.visualSupport)}</small>` : ""}
                  ${module.successCheck ? `<div class="nexus-success-check"><strong>Check yourself</strong><span>${html(module.successCheck)}</span></div>` : ""}
                  ${action ? `<div class="nexus-phase-action">${action}</div>` : ""}
                  <div class="nexus-phase-completion ${phaseDone ? "complete" : phaseLocked ? "locked" : ""}">
                    <span>${phaseDone ? "Evidence recorded" : phaseLocked ? html(phaseState.reason) : "Ready for this move"}</span>
                    <button class="small-button" type="button" data-phase-complete="${html(module.phase)}" data-lesson-id="${html(lesson.id)}" ${phaseDone || phaseLocked ? "disabled" : ""} title="${html(phaseDone ? "This phase is already complete" : phaseState.reason)}">
                      ${phaseDone ? "Phase cleared" : phaseLocked ? "Locked until ready" : "Clear phase +8 XP"}
                    </button>
                  </div>
                </div>
              </article>
            `;
          })
          .join("")}
      </div>
      <details class="support-details nexus-v2-fallback">
        <summary>Legacy V2 support still available</summary>
        <p>This lesson is rendered through the V3 phase path while preserving the old V2 lesson fields until native V3 exemplars are approved.</p>
        <div class="path-card">
          <strong>V2 teach</strong>
          <p>${html(lesson.sections.teach)}</p>
        </div>
        <div class="path-card">
          <strong>V2 guided practice</strong>
          <p>${html(lesson.sections.guidedPractice || lesson.sections.activity)}</p>
        </div>
      </details>
    </section>
  `;
}

function renderStudentMisconceptionRepair(support, lesson = null) {
  if (!support.commonMisunderstandings.length) return "";
  const repairAsset = lesson ? getLessonProductionVisualAsset(lesson, ["misconception-repair"], { requirePreferredPlacement: true }) : null;
  return `
    <section class="student-repair-panel" aria-label="Common mistakes and fixes">
      <div class="section-head compact">
        <div>
          <p class="eyebrow">If this feels confusing</p>
          <h2>The app checks the most common traps</h2>
        </div>
      </div>
      ${renderProductionVisualFigure(repairAsset, "A visual showing a common mistake and how to fix it.", {
        className: "misconception-visual",
        title: "Mistake and fix visual",
        reviewLabel: "Misconception visual passed quality review."
      })}
      <div class="repair-grid">
        ${support.commonMisunderstandings
          .map(
            (item) => `
              <article>
                <strong>${html(item.mistake)}</strong>
                <p>${html(item.fix)}</p>
              </article>
            `
          )
          .join("")}
      </div>
      <div class="coach-prompt student-coach-prompt">
        <div>
          <strong>Tell the tutor exactly what is stuck</strong>
          <p>${html(support.confusionPrompt)}</p>
        </div>
        <button class="secondary-button" data-view="ai">Ask for a hint</button>
      </div>
    </section>
  `;
}

function renderStudentSummaryPanel(lesson, support) {
  const guide = lesson.studentFacing || {};
  return `
    <section class="student-summary-panel" aria-label="Lesson summary and tutor handoff">
      <article>
        <span>Summary</span>
        <p>${html(guide.studentSummary || support.summary || lesson.objective)}</p>
      </article>
      <article>
        <span>Quick check</span>
        <p>${html(guide.quickCheck || lesson.sections.challenge)}</p>
      </article>
      <article>
        <span>Ask tutor like this</span>
        <p>${html(guide.tutorHandoff || support.confusionPrompt)}</p>
      </article>
    </section>
  `;
}

function renderStudentQuizBlock(lesson, answers, result) {
  const allAnswered = lesson.quiz.every((question) => answers[question.id] !== undefined);
  const learner = currentLearner();
  const levelProfile = getLearnerLevelProfile(state, learner.id);
  const repositoryLessonEvidence = getRepositoryLessonEvidence(learner.id, lesson.id);
  const rewardQueue = getRewardApprovalQueue(state, learner.id);
  const latestReward = repositoryLessonEvidence.reward || rewardQueue.find((request) => request.evidence?.lessonId === lesson.id) || rewardQueue[0];
  const savedQuizResult = repositoryLessonEvidence.quizResult || state.quizResults?.[lesson.id];
  const adaptiveReteach = savedQuizResult?.adaptiveReteach;
  const assessmentVisual = getLessonProductionVisualAsset(lesson, ["assessment-stimulus"], { requirePreferredPlacement: true });
  const explanationVisual = getLessonProductionVisualAsset(lesson, ["answer-explanation"], { requirePreferredPlacement: true });
  return `
    <section class="quiz-block student-checkpoint">
      <div class="section-head compact">
        <div>
          <p class="eyebrow">${html(studentLessonVoice(lesson).quizLabel)}</p>
          <h2>Show what you understand</h2>
        </div>
        <span class="status-pill">${result.score}% ready</span>
      </div>
      <p class="checkpoint-intro">Pick an answer, then use the explanation to repair your thinking. This is a learning checkpoint, not just a grade.</p>
      ${renderProductionVisualFigure(assessmentVisual, "Assessment evidence visual", { className: "assessment-stimulus-visual", title: "Assessment evidence visual", reviewLabel: "Approved assessment stimulus." })}
      <div class="student-evidence-box ${repositoryLessonEvidence.source === "learner-scoped repository" ? "" : "muted-box"}">
        <strong>Repository lesson evidence</strong>
        <p>${html(
          repositoryLessonEvidence.quizMastery.latest
            ? `${repositoryLessonEvidence.quizMastery.latest.lessonTitle}: quiz ${repositoryLessonEvidence.quizMastery.latest.quizScore}% | mastery ${repositoryLessonEvidence.quizMastery.latest.masteryScore}% ${repositoryLessonEvidence.quizMastery.latest.masteryStatus || ""}`
            : repositoryLessonEvidence.error
              ? `Learner-scoped lesson read failed: ${repositoryLessonEvidence.error}`
              : "No repository quiz or mastery evidence has been read for this lesson yet."
        )}</p>
        <small>${html(`${repositoryLessonEvidence.quizMastery.quizPassed}/${repositoryLessonEvidence.quizMastery.quizAttempts} repository quiz attempt(s) passed from ${repositoryLessonEvidence.catalogSource}`)}</small>
      </div>
      ${lesson.quiz
        .map(
          (question) => `
            <fieldset class="question student-question">
              <legend>${html(question.prompt)}</legend>
              <div class="choice-grid">
                ${question.choices
                  .map((choice, index) => {
                    const selected = answers[question.id] === index;
                    const answered = answers[question.id] !== undefined;
                    const correctChoice = Number(question.answerIndex) === index;
                    const feedbackClass = answered && selected ? (correctChoice ? "correct-choice" : "wrong-choice") : answered && correctChoice ? "correct-choice" : "";
                    return `
                      <button class="choice ${selected ? "selected" : ""} ${feedbackClass}" data-answer="${index}" data-question="${question.id}">
                        ${html(choice)}
                      </button>
                    `;
                  })
                  .join("")}
              </div>
              ${
                answers[question.id] !== undefined
                  ? `<p class="answer-explain ${Number(question.answerIndex) === answers[question.id] ? "correct" : "retry"}">
                      <strong>${Number(question.answerIndex) === answers[question.id] ? "Correct reasoning" : "Repair note"}</strong>
                      ${html(question.explanation)}
                    </p>`
                  : `<p class="answer-explain muted">Choose one answer to reveal the reasoning note.</p>`
              }
            </fieldset>
          `
        )
        .join("")}
      ${renderProductionVisualFigure(explanationVisual, "Answer explanation visual", { className: "answer-explanation-visual", title: "Answer explanation visual", reviewLabel: "Approved answer-feedback visual." })}
      <button class="primary-button" data-submit-quiz="${lesson.id}" ${allAnswered ? "" : "disabled"}>${allAnswered ? "Submit checkpoint" : "Answer every question first"}</button>
      ${
        savedQuizResult
          ? `
            <div class="lesson-outcome-card ${savedQuizResult.passed ? "mastered" : "reteach"}">
              <span>${html(savedQuizResult.source === "learner-scoped repository" ? "Repository mastery evidence loaded" : savedQuizResult.passed ? "Mastery evidence saved" : "Targeted reteach path opened")}</span>
              <strong>${savedQuizResult.score}% checkpoint score</strong>
              <p>${
                savedQuizResult.passed
                  ? `You earned lesson evidence for ${html(lesson.xp || 100)} XP. Claim an unlocked reward when your level allows it.`
                  : html(adaptiveReteach?.studentMessage || "The app recommends a repair round: review the common misunderstanding section, ask the tutor what is stuck, then retry.")
              }</p>
              ${
                adaptiveReteach
                  ? `<div class="adaptive-reteach-card">
                      <span>${html(adaptiveReteach.diagnosisLabel || "Quiz-only reteach")}</span>
                      <strong>${html(adaptiveReteach.evidenceStrength.replaceAll("-", " "))}</strong>
                      <p>${html(adaptiveReteach.reteachMove)}</p>
                    </div>`
                  : ""
              }
              <div class="hero-actions">
                ${
                  savedQuizResult.passed && levelProfile.unlockedRewards?.length
                    ? `<button class="small-button" data-request-reward="${html(learner.id)}" data-reward-level="${levelProfile.unlockedRewards[levelProfile.unlockedRewards.length - 1].level}">${latestReward ? "Reward requested" : "Claim reward"}</button>`
                    : `<button class="small-button" data-view="ai">Ask tutor for reteach</button>`
                }
                <button class="small-button" data-view="student">Return to mission board</button>
              </div>
            </div>
          `
          : ""
      }
    </section>
  `;
}

function getLessonInteractiveConfig(lesson) {
  if (lesson.id === "g6-learning-ai-build-test") {
    return {
      widgetId: "ai-builder-system-sort",
      title: "Sort the AI builder system",
      prompt: "Which item is the clearest backend responsibility?",
      options: ["Login permission rule", "Pink Start button", "Hero image", "Page title"],
      correctValue: "Login permission rule",
      success: "Correct. Permission rules happen behind the scenes on the backend so private data stays protected.",
      retry: "Not yet. Ask whether the user sees it directly. If not, it may be backend, data, or security work.",
      boardZones: [
        { label: "AI", value: "Prompt + model + review" },
        { label: "Frontend", value: "Screens + buttons + layout" },
        { label: "Backend", value: "APIs + rules + permissions" },
        { label: "Data", value: "Records + database" },
        { label: "QA", value: "Tests + bug reports + retest" }
      ]
    };
  }

  if (lesson.id === "published-draft-next-wave-bridge-6-ela-u1-l1" || lesson.sourceDraftId === "draft-next-wave-bridge-6-ela-u1-l1") {
    return {
      widgetId: "myth-decoder-board",
      title: "Build the Myth Decoder Board",
      prompt: "Which card turns a plot retell into a real theme claim?",
      options: ["Hero wants glory", "Ignores the warning", "Pride can make people ignore danger", "The cave is dark"],
      correctValue: "Pride can make people ignore danger",
      success: "Yes. A theme claim says what the myth suggests about life, choices, or values.",
      retry: "Not yet. Plot cards tell what happened. The theme card explains the bigger message those events prove.",
      boardZones: [
        { label: "Hero goal", value: "Hero wants glory" },
        { label: "Pressure", value: "Ignores the warning" },
        { label: "Symbol", value: "The cave is dark" },
        { label: "Theme claim", value: "Pride can make people ignore danger" }
      ]
    };
  }

  if (lesson.sourceDraftId === "draft-bridge-g6-batch1-math-ratios-rate-lab" || lesson.id === "published-draft-bridge-g6-batch1-math-ratios-rate-lab") {
    return {
      widgetId: "g6-ratio-table-lab",
      title: "Build the fair-comparison ratio table",
      prompt: "Which comparison proves the two snack packs have the same rate?",
      options: ["2 cups for 5 servings and 4 cups for 10 servings", "2 cups for 5 servings and 4 cups for 8 servings", "5 cups for 2 servings and 10 cups for 4 servings", "Only the bigger number matters"],
      correctValue: "2 cups for 5 servings and 4 cups for 10 servings",
      success: "Correct. Both rows scale by the same factor, so the rate stays fair.",
      retry: "Not yet. Check whether both quantities scale together, not just whether one number is bigger.",
      boardZones: [
        { label: "Pack A", value: "2 cups -> 5 servings" },
        { label: "Scale x2", value: "4 cups -> 10 servings" },
        { label: "Unit rate", value: "0.4 cup per serving" },
        { label: "Proof", value: "both quantities scale together" }
      ]
    };
  }

  if (lesson.sourceDraftId === "draft-bridge-g6-batch1-math-expressions-machine" || lesson.id === "published-draft-bridge-g6-batch1-math-expressions-machine") {
    return {
      widgetId: "g6-expression-machine",
      title: "Run the expression machine",
      prompt: "If the rule is 3n + 2 and n = 4, which output is correct?",
      options: ["9", "12", "14", "18"],
      correctValue: "14",
      success: "Correct. Multiply first: 3 x 4 = 12, then add 2 to get 14.",
      retry: "Not yet. Substitute 4 for n, then follow order: multiply before add.",
      boardZones: [
        { label: "Input", value: "n = 4" },
        { label: "Multiply", value: "3 x 4 = 12" },
        { label: "Add", value: "12 + 2" },
        { label: "Output", value: "14" }
      ]
    };
  }

  if (lesson.sourceDraftId === "draft-bridge-g6-batch1-science-weather-systems" || lesson.id === "published-draft-bridge-g6-batch1-science-weather-systems") {
    return {
      widgetId: "g6-weather-evidence-map",
      title: "Choose the strongest forecast evidence",
      prompt: "A low-pressure system is moving toward town and wind arrows point inland. What is the best evidence-based prediction?",
      options: ["Rain or storm chance may increase", "The weather will stay exactly the same", "The map cannot help at all", "The biggest letter always means hottest"],
      correctValue: "Rain or storm chance may increase",
      success: "Correct. Low pressure and wind direction are current evidence for a changing forecast.",
      retry: "Not yet. Use the pressure label and arrows as evidence, not the size of a symbol.",
      boardZones: [
        { label: "Pressure", value: "Low moving in" },
        { label: "Wind", value: "Arrows point inland" },
        { label: "Claim", value: "Storm chance rises" },
        { label: "Reason", value: "current map evidence" }
      ]
    };
  }

  if (lesson.sourceDraftId === "draft-bridge-g6-batch1-ela-close-reading-evidence" || lesson.id === "published-draft-bridge-g6-batch1-ela-close-reading-evidence") {
    return {
      widgetId: "g6-cer-evidence-board",
      title: "Build the claim-evidence-reasoning board",
      prompt: "Which card best explains why a quote proves a claim?",
      options: ["It is the longest sentence", "It directly supports the claim and the reasoning says how", "It has a hard vocabulary word", "It appears first in the passage"],
      correctValue: "It directly supports the claim and the reasoning says how",
      success: "Correct. Evidence has to connect to the claim, and reasoning explains the connection.",
      retry: "Not yet. A quote can be interesting without proving the claim. Ask how it connects.",
      boardZones: [
        { label: "Claim", value: "What I believe" },
        { label: "Evidence", value: "Quote or detail" },
        { label: "Reasoning", value: "How it proves it" },
        { label: "Check", value: "Does it answer the claim?" }
      ]
    };
  }

  if (lesson.sourceDraftId === "draft-bridge-g6-batch1-social-early-humans-map" || lesson.id === "published-draft-bridge-g6-batch1-social-early-humans-map") {
    return {
      widgetId: "g6-migration-source-map",
      title: "Read the migration source map",
      prompt: "Which clue best supports a claim that geography shaped early human movement?",
      options: ["A river valley near food and water", "A random date with no location", "A colorful icon with no source", "The longest paragraph"],
      correctValue: "A river valley near food and water",
      success: "Correct. Geography matters when the map clue connects to human needs and choices.",
      retry: "Not yet. Pick the clue that links place conditions to a human decision.",
      boardZones: [
        { label: "Place", value: "River valley" },
        { label: "Need", value: "Food and water" },
        { label: "Evidence", value: "Artifact or map clue" },
        { label: "Claim", value: "Movement followed resources" }
      ]
    };
  }

  const byVisualType = {
    "number-line": {
      widgetId: "fraction-number-line-target",
      title: "Tap where one half belongs",
      prompt: "Use equal spaces between 0 and 1. Which point shows 1/2?",
      options: ["0", "1/4", "1/2", "3/4", "1"],
      correctValue: "1/2",
      success: "Yes. One half is the middle point because the whole is split into two equal spaces.",
      retry: "Not yet. Start with 0 and 1, then split the whole into two equal spaces."
    },
    "story-map": {
      widgetId: "main-idea-evidence-sort",
      title: "Pick the detail that proves the main idea",
      prompt: "Which choice is strongest evidence for the center idea?",
      options: ["A true but random fact", "A detail that connects to the big point", "The longest word", "The first name"],
      correctValue: "A detail that connects to the big point",
      success: "Correct. Evidence should connect back to the big point.",
      retry: "Try again. A fun fact can be true and still not prove the main idea."
    },
    "ecosystem-model": {
      widgetId: "ecosystem-dependency-link",
      title: "Find the first dependency",
      prompt: "What starts many food connections in this model?",
      options: ["Sunlight", "A label", "The longest arrow", "A road"],
      correctValue: "Sunlight",
      success: "Correct. Sunlight helps plants make food, then the rest of the system depends on that energy.",
      retry: "Look for what plants need before insects or animals can depend on plants."
    },
    "community-map": {
      widgetId: "community-map-symbol",
      title: "Use the map tool",
      prompt: "Which map feature helps you describe direction?",
      options: ["Compass rose", "A blank road", "A made-up symbol", "The quiz score"],
      correctValue: "Compass rose",
      success: "Correct. A compass rose helps describe north, south, east, and west.",
      retry: "Look for the feature that tells direction, not just a place."
    },
    "weather-map": {
      widgetId: "weather-evidence-check",
      title: "Choose forecast evidence",
      prompt: "Which evidence best supports a short-term forecast?",
      options: ["Current pressure map", "Favorite season", "Last year's clouds", "No labels"],
      correctValue: "Current pressure map",
      success: "Correct. Current pressure patterns are evidence for short-term forecasting.",
      retry: "A forecast needs current data, not preferences or old observations."
    },
    "cell-diagram": {
      widgetId: "cell-function-match",
      title: "Match structure to job",
      prompt: "Which structure stores instructions that guide cell activity?",
      options: ["Nucleus", "Cell membrane", "Mitochondria", "Cell wall"],
      correctValue: "Nucleus",
      success: "Correct. The nucleus stores the information that guides cell activity.",
      retry: "Think about which structure controls information, not energy or boundaries."
    }
  };
  return byVisualType[lesson.visual?.type] || byVisualType["number-line"];
}

function renderInteractiveMiniModel(lesson, config, response) {
  const selected = response.value || "";
  if (config.widgetId === "ai-builder-system-sort") {
    return `
      <div class="interactive-model ai-builder-mini-model" aria-label="AI builder system model">
        ${(config.boardZones || [])
          .map(
            (zone, index) => `
              <article class="${selected === zone.value || selected.includes(zone.label) ? "active" : ""}">
                <span>${String(index + 1).padStart(2, "0")}</span>
                <strong>${html(zone.label)}</strong>
                <p>${html(zone.value)}</p>
              </article>
            `
          )
          .join("")}
      </div>
    `;
  }

  if (config.widgetId === "myth-decoder-board") {
    return `
      <div class="interactive-model myth-decoder-model" aria-label="Myth Decoder Board">
        ${(config.boardZones || [])
          .map(
            (zone, index) => `
              <article class="${selected === zone.value ? "active" : ""}">
                <span>${String(index + 1).padStart(2, "0")}</span>
                <strong>${html(zone.label)}</strong>
                <p>${html(zone.value)}</p>
              </article>
            `
          )
          .join("")}
      </div>
    `;
  }

  if (config.widgetId === "g6-ratio-table-lab") {
    return `
      <div class="interactive-model bridge-batch-widget ratio-table-widget" aria-label="Ratio table and double number line">
        <div class="ratio-table">
          <span></span><strong>Cups</strong><strong>Servings</strong>
          <strong>Pack A</strong><b>2</b><b>5</b>
          <strong>Scale x2</strong><b class="${selected === config.correctValue ? "active" : ""}">4</b><b class="${selected === config.correctValue ? "active" : ""}">10</b>
        </div>
        <div class="double-line">
          <span>2 cups</span><span>4 cups</span>
          <i></i>
          <span>5 servings</span><span>10 servings</span>
        </div>
      </div>
    `;
  }

  if (config.widgetId === "g6-expression-machine") {
    return `
      <div class="interactive-model bridge-batch-widget expression-machine-widget" aria-label="Expression machine">
        ${(config.boardZones || [])
          .map((zone, index) => `
            <article class="${selected === zone.value || (selected === config.correctValue && zone.label === "Output") ? "active" : ""}">
              <span>${index + 1}</span>
              <strong>${html(zone.label)}</strong>
              <p>${html(zone.value)}</p>
            </article>
          `)
          .join("")}
      </div>
    `;
  }

  if (config.widgetId === "g6-weather-evidence-map") {
    return `
      <div class="interactive-model bridge-batch-widget weather-evidence-widget" aria-label="Weather evidence map">
        <div class="weather-map-board">
          <b>L</b>
          <span class="wind-arrow">-> -> -></span>
          <strong class="${selected === config.correctValue ? "active" : ""}">Storm chance rises</strong>
        </div>
        <div class="evidence-lane">
          ${(config.boardZones || []).map((zone) => `<span>${html(zone.label)}: ${html(zone.value)}</span>`).join("")}
        </div>
      </div>
    `;
  }

  if (config.widgetId === "g6-cer-evidence-board") {
    return `
      <div class="interactive-model bridge-batch-widget cer-board-widget" aria-label="Claim evidence reasoning board">
        ${(config.boardZones || [])
          .map((zone) => `
            <article class="${selected === config.correctValue && zone.label === "Reasoning" ? "active" : ""}">
              <strong>${html(zone.label)}</strong>
              <p>${html(zone.value)}</p>
            </article>
          `)
          .join("")}
      </div>
    `;
  }

  if (config.widgetId === "g6-migration-source-map") {
    return `
      <div class="interactive-model bridge-batch-widget migration-map-widget" aria-label="Migration source map">
        <div class="map-path">
          <span>Camp</span>
          <i></i>
          <span class="${selected === config.correctValue ? "active" : ""}">River valley</span>
          <i></i>
          <span>New shelter</span>
        </div>
        <div class="evidence-lane">
          ${(config.boardZones || []).map((zone) => `<span>${html(zone.label)}: ${html(zone.value)}</span>`).join("")}
        </div>
      </div>
    `;
  }

  if (lesson.visual?.type === "number-line") {
    return `
      <div class="interactive-model number-line-model" aria-label="Fraction number line model">
        <div class="model-track">
          ${config.options.map((option) => `<span class="${selected === option ? "active" : ""}">${html(option)}</span>`).join("")}
        </div>
        <small>Count equal spaces, not tick marks.</small>
      </div>
    `;
  }

  if (lesson.visual?.type === "ecosystem-model") {
    return `
      <div class="interactive-model ecosystem-mini-model" aria-label="Ecosystem dependency model">
        ${["Sunlight", "Plant", "Insect", "Bird"].map((item) => `<span class="${selected === item ? "active" : ""}">${html(item)}</span>`).join("")}
      </div>
    `;
  }

  if (lesson.visual?.type === "cell-diagram") {
    return `
      <div class="interactive-model cell-mini-model" aria-label="Cell structure model">
        ${["Nucleus", "Membrane", "Mitochondria"].map((item) => `<span class="${selected === item ? "active" : ""}">${html(item)}</span>`).join("")}
      </div>
    `;
  }

  if (lesson.visual?.type === "weather-map") {
    return `
      <div class="interactive-model weather-mini-model" aria-label="Forecast evidence model">
        <span class="${selected === "Current pressure map" ? "active" : ""}">H / L pressure</span>
        <span>Wind arrows</span>
        <span>Storm front</span>
      </div>
    `;
  }

  return `
    <div class="interactive-model evidence-mini-model" aria-label="Evidence model">
      <span class="${selected.includes("detail") ? "active" : ""}">Detail</span>
      <span>Because</span>
      <span>Main idea</span>
    </div>
  `;
}

function renderInteractiveWidget(lesson, learnerId) {
  const config = getLessonInteractiveConfig(lesson);
  const repositoryLessonEvidence = getRepositoryLessonEvidence(learnerId, lesson.id);
  const response = repositoryLessonEvidence.interactiveResponse || getInteractiveResponse(state, learnerId, lesson.id, config.widgetId);
  const responseSource = repositoryLessonEvidence.interactiveResponse ? "learner-scoped repository" : "local interactive fallback";
  return `
    <section class="interactive-widget" aria-label="${html(config.title)}">
      <div>
        <p class="eyebrow">Interactive check</p>
        <h3>${html(config.title)}</h3>
        <p>${html(config.prompt)}</p>
      </div>
      ${renderInteractiveMiniModel(lesson, config, response)}
      <div class="interactive-options">
        ${config.options
          .map(
            (option) => `
              <button class="interactive-option ${response.value === option ? "selected" : ""}" data-interactive-widget="${html(config.widgetId)}" data-interactive-value="${html(option)}">
                ${html(option)}
              </button>
            `
          )
          .join("")}
      </div>
      ${
        response.value
          ? `<div class="interactive-feedback ${response.correct ? "correct" : "retry"}">
              <strong>${response.correct ? "You got it" : "Try a repair"}</strong>
              <p>${html(response.feedback || (response.correct ? config.success : config.retry))}</p>
              <small>${response.attempts} attempt(s) saved from ${html(responseSource)}</small>
            </div>`
          : `<div class="interactive-feedback"><strong>Choose one</strong><p>Your attempt will be saved as learning evidence.</p></div>`
      }
    </section>
  `;
}

function renderTutorHintRetryPanel(lesson, learnerId, scratchpad, tutorEvidence) {
  const latest = tutorEvidence.latestQualified || tutorEvidence.latest;
  return `
    <section class="tutor-retry-panel" aria-label="Retry after tutor hint">
      <div class="section-head compact">
        <div>
          <p class="eyebrow">Retry after tutor hint</p>
          <h3>Use the tutor's next question</h3>
        </div>
        <span class="status-pill">${scratchpad.retryAfterHint ? "Retry saved" : latest ? "Ready" : "Ask tutor first"}</span>
      </div>
      ${
        latest
          ? `
            <div class="tutor-retry-context">
              <span>${html(latest.label || "Diagnosed stuck point")}</span>
              <p>${html(latest.nextQuestion || "Use the hint path to try one better explanation.")}</p>
            </div>
          `
          : `<p class="callout">Write your stuck point and ask the tutor first. The app will unlock this retry step after it diagnoses what is confusing.</p>`
      }
      <label class="retry-after-hint-field">
        My retry after the tutor hint
        <textarea rows="4" data-scratchpad-field="retryAfterHint" data-lesson-id="${html(lesson.id)}" placeholder="Answer the tutor's next question or write your improved explanation.">${html(scratchpad.retryAfterHint || "")}</textarea>
      </label>
      <button class="secondary-button" data-submit-tutor-retry="${html(lesson.id)}" ${scratchpad.retryAfterHint ? "" : "disabled"}>Save retry evidence</button>
      <small>${html(scratchpad.retryAfterHint ? "This retry can earn reflection XP and helps parents/teachers see whether the hint worked." : "Type a retry response to unlock this evidence step.")}</small>
    </section>
  `;
}

function renderStudentTeachingSequence(lesson, answers, result, experience) {
  const support = getLessonTeachingSupport(lesson.id, state);
  const learnerId = currentSession?.studentId || currentLearner()?.id || "";
  const repositoryLessonEvidence = getRepositoryLessonEvidence(learnerId, lesson.id);
  const scratchpad = repositoryLessonEvidence.scratchpad || getLessonScratchpad(state, learnerId, lesson.id);
  const localTutorEvidence = getTutorReflectionEvidence(state, learnerId, lesson.id);
  const repositoryTutorLatest = repositoryLessonEvidence.tutor.latest;
  const tutorEvidence = repositoryTutorLatest
    ? {
        ...localTutorEvidence,
        latest: {
          label: repositoryTutorLatest.stuckPointLabel || repositoryTutorLatest.modeTitle || "Repository tutor event",
          nextQuestion: repositoryTutorLatest.nextQuestion || repositoryTutorLatest.visualHint || repositoryTutorLatest.firstPrinciplesPrompt || "",
          lessonId: repositoryTutorLatest.lessonId
        },
        latestQualified: repositoryTutorLatest.helped !== false
          ? {
              label: repositoryTutorLatest.stuckPointLabel || repositoryTutorLatest.modeTitle || "Repository tutor event",
              nextQuestion: repositoryTutorLatest.nextQuestion || repositoryTutorLatest.visualHint || repositoryTutorLatest.firstPrinciplesPrompt || "",
              lessonId: repositoryTutorLatest.lessonId
            }
          : localTutorEvidence.latestQualified
      }
    : localTutorEvidence;
  const firstRecall = lesson.retentionChecks?.[0] || "Come back later and prove the idea still sticks.";
  const answeredCount = Object.keys(answers || {}).length;
  const repositoryQuizDone = Boolean(repositoryLessonEvidence.quizResult);
  const repositoryQuizPassed = Boolean(repositoryLessonEvidence.quizResult?.passed);
  const repositoryRewardDone = Boolean(repositoryLessonEvidence.reward);
  const repositoryInteractiveDone = Boolean(repositoryLessonEvidence.interactiveResponse?.value);
  const lessonSteps = [
    { label: "Look", active: true, done: true },
    { label: "Interact", active: true, done: repositoryInteractiveDone || Boolean(getInteractiveResponse(state, learnerId, lesson.id, getLessonInteractiveConfig(lesson).widgetId).value) },
    { label: "Explain", active: true, done: Boolean(scratchpad.explanation || scratchpad.confusion || scratchpad.firstStep) },
    { label: "Retry", active: Boolean(tutorEvidence.latestQualified), done: Boolean(scratchpad.retryAfterHint) },
    { label: "Quiz", active: true, done: repositoryQuizDone || answeredCount >= lesson.quiz.length },
    { label: "Reward", active: repositoryQuizPassed || Boolean(state.quizResults?.[lesson.id]?.passed), done: repositoryRewardDone || Boolean(getRewardApprovalQueue(state, learnerId)[0]) }
  ];

  return `
    <section class="panel lesson-panel student-lesson-player">
      <div class="student-lesson-hero">
        <div>
          <p class="eyebrow">${html(lesson.courseTitle)} | Grade ${html(lesson.grade)} | ${html(lesson.unitTitle)}</p>
          <h2>${html(lesson.title)}</h2>
          <p>${html(lesson.objective)}</p>
        </div>
        <div class="student-lesson-progress">
          <span>${html(experience.reward || lesson.reward)}</span>
          <strong>${html(lesson.xp || 100)} XP</strong>
          <small>Earned through mastery and recall evidence</small>
        </div>
      </div>
      <div class="lesson-progress-rail" aria-label="Lesson progress">
        ${lessonSteps
          .map(
            (step, index) => `
              <span class="${step.done ? "done" : step.active ? "active" : "locked"}">
                <b>${index + 1}</b>
                ${html(step.label)}
              </span>
            `
          )
          .join("")}
      </div>

      ${renderAppTeacherPanel(lesson, support)}
      ${renderStudentFacingGuide(lesson, support)}
      ${renderSpecialAiBuilderLessonPanel(lesson)}

      <div class="student-teaching-grid">
        <div class="student-teaching-main">
          ${renderNexusLessonPhaseSequence(lesson, answers, result, experience, support, learnerId, scratchpad)}
          ${renderTutorHintRetryPanel(lesson, learnerId, scratchpad, tutorEvidence)}
          ${renderStudentSummaryPanel(lesson, support)}
        </div>

        <aside class="student-lesson-side">
          <article class="side-learning-card">
            <span>Why it matters</span>
            <p>${html(lesson.sections.challenge || lesson.objective)}</p>
          </article>
          <article class="side-learning-card">
            <span>Remember later</span>
            <p>${html(firstRecall)}</p>
          </article>
          <article class="side-learning-card">
            <span>Need help?</span>
            <p>Write the exact part that does not make sense. The tutor will diagnose the stuck point before giving hints.</p>
            <button class="small-button" data-view="ai">Open tutor</button>
          </article>
          <article class="side-learning-card">
            <span>Repository evidence</span>
            <p>${html(
              repositoryLessonEvidence.quizMastery.latest
                ? `Quiz ${repositoryLessonEvidence.quizMastery.latest.quizScore}%, mastery ${repositoryLessonEvidence.quizMastery.latest.masteryScore}% from ${repositoryLessonEvidence.source}.`
                : repositoryLessonEvidence.interactiveSignal
                  ? `${repositoryLessonEvidence.interactiveSignal.skillLabel}: ${repositoryLessonEvidence.interactiveSignal.status} from ${repositoryLessonEvidence.source}.`
                  : repositoryLessonEvidence.scratchpad
                    ? `Scratchpad writing loaded from ${repositoryLessonEvidence.source}.`
                : repositoryLessonEvidence.reward
                  ? `${repositoryLessonEvidence.reward.rewardTitle} is ${rewardStatusLabel(repositoryLessonEvidence.reward.status)} from ${repositoryLessonEvidence.source}.`
                  : "No scoped repository evidence for this lesson yet."
            )}</p>
          </article>
        </aside>
      </div>
    </section>
  `;
}

function renderBridgeCourseLessonHeader(lesson) {
  if (lesson.sourceBatchId !== "bridge-academy-grade-6-batch-1") return "";
  const learnerId = currentSession?.studentId || currentLearner()?.id || "";
  const path = getBridgeGrade6CoursePath(state, learnerId, { currentLessonId: lesson.id });
  if (!path.totalLessons || !path.currentLesson) return "";
  return `
    <section class="panel wide-panel bridge-course-lesson-header">
      <div class="bridge-course-topline">
        <div>
          <p class="eyebrow">Bridge Academy Grade 6 course session</p>
          <h2>Mission ${path.currentMissionNumber} of ${path.totalLessons}: ${html(lesson.title)}</h2>
          <p>${html(path.currentLesson.objective)}</p>
        </div>
        <div class="bridge-course-progress-card">
          <span>Course progress</span>
          <strong>${path.progressPercent}%</strong>
          <small>${path.completedLessons}/${path.totalLessons} missions mastered</small>
        </div>
      </div>
      ${renderXpTrack(path.progressPercent, "Bridge Grade 6 course progress inside lesson")}
      <div class="bridge-course-nav">
        <button class="secondary-button" data-lesson="${html(path.previousMission?.id || lesson.id)}" data-view="lesson" ${path.previousMission ? "" : "disabled"}>Previous mission</button>
        <div class="bridge-course-nav-center">
          <span class="subject-chip ${html(lesson.subject)}">${html(subjectWorldMeta(lesson.subject).world)}</span>
          <strong>${html(path.title)}</strong>
          <small>${html(`${path.subjectCount} subjects | ${path.publicationStatus} | app-led class path`)}</small>
        </div>
        <button class="primary-button" data-lesson="${html(path.nextMission?.id || path.nextLessonId || lesson.id)}" data-view="lesson" ${path.nextMission ? "" : "disabled"}>Next mission</button>
      </div>
      <div class="bridge-course-mini-rail" aria-label="Bridge Grade 6 course missions">
        ${path.lessons
          .map(
            (mission) => `
              <button class="${mission.id === lesson.id ? "active" : mission.completed ? "done" : ""}" data-lesson="${html(mission.id)}" data-view="lesson">
                <b>${mission.order}</b>
                <span>${html(mission.subject.replace("-", " "))}</span>
              </button>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderAdultLessonSupport(lesson, mastery, experience, evidenceAudit) {
  const adaptiveReteach = mastery.adaptiveReteach || state.quizResults?.[lesson.id]?.adaptiveReteach || null;
  return `
    <aside class="panel side-panel adult-support-panel">
      <div class="section-head compact">
        <div>
          <p class="eyebrow">Adult support</p>
          <h2>For parent or teacher review</h2>
        </div>
      </div>
      <div class="metric-grid single">
        ${renderMetric("Status", mastery.status, `${mastery.attempts} attempt(s)`)}
        ${renderMetric("Threshold", `${lesson.masteryThreshold}%`, "Unlocks next step")}
        ${renderMetric("Reward", `${lesson.xp} XP`, "Badge progress")}
      </div>
      <details class="support-details" open>
        <summary>Reteach and challenge paths</summary>
        <div class="path-card">
          <strong>Reteach</strong>
          <p>${html(adaptiveReteach?.reteachMove || lesson.sections.reteach)}</p>
          ${adaptiveReteach ? `<small>${html(adaptiveReteach.teacherLookFor)} Evidence: ${html(adaptiveReteach.evidenceStrength.replaceAll("-", " "))}.</small>` : ""}
        </div>
        <div class="path-card">
          <strong>Challenge</strong>
          <p>${html(lesson.sections.challenge)}</p>
        </div>
        <div class="path-card reward-card">
          <strong>Reward</strong>
          <p>${html(experience.reward)}</p>
        </div>
      </details>
      <details class="support-details">
        <summary>Teaching notes and misconceptions</summary>
        ${renderTeachingSupport(lesson)}
      </details>
      <details class="support-details">
        <summary>Evidence audit</summary>
        ${
          evidenceAudit.required
            ? renderLessonEvidenceMoves(lesson, evidenceAudit)
            : `<p class="callout">No math-specific evidence audit is required for this lesson.</p>`
        }
      </details>
      <details class="support-details">
        <summary>Lesson contract</summary>
        <ul class="check-list">
          ${lessonTemplate.map((item) => `<li>${html(item)}</li>`).join("")}
        </ul>
      </details>
    </aside>
  `;
}

function renderLessonView() {
  const lesson = currentLesson();
  const answers = state.selectedAnswers[lesson.id] || {};
  const result = scoreQuiz(lesson, answers);
  const learnerId = currentSession?.studentId || currentLearner()?.id || "";
  const repositoryLessonEvidence = getRepositoryLessonEvidence(learnerId, lesson.id);
  const mastery = repositoryLessonEvidence.mastery || state.mastery[lesson.id] || { score: 0, status: "Not started", attempts: 0 };
  const experience = getLessonExperience(lesson.id, state);
  const evidenceAudit = getLessonEvidenceAudit(lesson.id, state);

  return renderShell(`
    ${renderBridgeCourseLessonHeader(lesson)}
    ${renderStudentTeachingSequence(lesson, answers, result, experience)}
    ${renderAdultLessonSupport(lesson, mastery, experience, evidenceAudit)}
  `);
}

function renderLearningLabView() {
  const summary = getRadicalLearningSummary();
  const evidenceSummary = getEvidenceGuidanceSummary();
  const implementationPlan = getEvidenceImplementationPlan();

  return renderShell(`
    <section class="panel wide-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Radical learning lab</p>
          <h2>Fun, measured, and built for retention</h2>
        </div>
        <span class="status-pill">${summary.metrics.length} metrics</span>
      </div>
      <p class="lab-thesis">${html(radicalLearningModel.thesis)}</p>
      <div class="lab-guide-grid">
        <article>
          <span>01</span>
          <h3>What the child sees</h3>
          <p>A short mission: look at a model, build or move something, explain the idea, answer a few questions, then come back later for recall.</p>
        </article>
        <article>
          <span>02</span>
          <h3>What parents see</h3>
          <p>Joy, frustration, independence, mastery, recall due, suggested reteach, and whether the reward should unlock.</p>
        </article>
        <article>
          <span>03</span>
          <h3>What experiments test</h3>
          <p>Whether a visual, movement task, group role, or project choice improves recall without raising frustration or parent support time.</p>
        </article>
        <article>
          <span>04</span>
          <h3>When we change</h3>
          <p>If a task gets quick scores but weak recall, high frustration, or unclear explanations, the lesson is redesigned before scaling.</p>
        </article>
      </div>
      <div class="principle-grid">
        ${radicalLearningModel.principles
          .map(
            (principle) => `
              <article class="principle-card">
                <h3>${html(principle.name)}</h3>
                <p>${html(principle.mechanic)}</p>
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    <section class="panel">
      <div class="section-head compact">
        <h2>Young learner loop</h2>
      </div>
      <ol class="lab-flow">
        ${radicalLearningModel.youngLearnerLoop.map((step) => `<li>${html(step)}</li>`).join("")}
      </ol>
    </section>

    <section class="panel">
      <div class="section-head compact">
        <h2>Trial-and-error engine</h2>
      </div>
      <ol class="lab-flow">
        ${radicalLearningModel.experimentLoop.map((step) => `<li>${html(step)}</li>`).join("")}
      </ol>
    </section>

    <section class="panel wide-panel">
      <div class="section-head compact">
        <h2>Rewards that do not cheapen learning</h2>
      </div>
      <div class="reward-grid">
        ${radicalLearningModel.rewardSystem
          .map(
            (reward) => `
              <article>
                <h3>${html(reward.name)}</h3>
                <p>${html(reward.rule)}</p>
              </article>
            `
          )
          .join("")}
      </div>
      <div class="metric-tags" aria-label="Learning metrics">
        ${radicalLearningModel.metrics.map((metric) => `<span>${html(metric)}</span>`).join("")}
      </div>
    </section>

    <section class="panel wide-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">EEF and WWC audit</p>
          <h2>Teaching recommendations converted into product requirements</h2>
        </div>
        <span class="status-pill">${evidenceSummary.recommendationCount} recs</span>
      </div>
      <div class="metric-grid">
        ${renderMetric("Sources", evidenceSummary.sourceCount, "Audited evidence anchors")}
        ${renderMetric("Requirements", evidenceSummary.recommendationCount, "Converted to app rules")}
        ${renderMetric("Math moves", evidenceSummary.requiredMoveCount, "Required in math lessons")}
        ${renderMetric("Phases", evidenceSummary.implementationPhaseCount, "Explore to sustain")}
      </div>
      <div class="evidence-source-grid">
        ${evidenceGuidanceAudit.sources
          .map(
            (source) => `
              <article class="evidence-source-card">
                <h3>${html(source.name)}</h3>
                <p>${html(source.recommendations[0].productRequirement)}</p>
                <small>${html(source.appliesTo.join(", "))} | ${source.recommendations.length} recommendation(s)</small>
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    <section class="panel">
      <div class="section-head compact">
        <h2>Implementation cycle</h2>
      </div>
      <ol class="lab-flow">
        ${implementationPlan.map((phase) => `<li><strong>${html(phase.phase)}:</strong> ${html(phase.requirement)}</li>`).join("")}
      </ol>
    </section>

    <aside class="panel side-panel">
      <div class="section-head compact">
        <h2>Evidence anchors</h2>
      </div>
      <div class="source-list">
        ${learningScienceSources
          .map(
            (source) => `
              <a href="${html(source.url)}" target="_blank" rel="noreferrer">
                <strong>${html(source.name)}</strong>
                <small>${html(source.applies.join(", "))}</small>
              </a>
            `
          )
          .join("")}
      </div>
    </aside>
  `);
}

function renderAccountAccessPanel() {
  const session = currentSession || { role: "loading", scope: "loading", authenticated: false };
  const runtime = currentRuntimeConfiguration?.runtime || {};
  const providerAuthLive = Boolean(runtime.productionMode && runtime.authProviderConfigured && runtime.authReadiness?.passed);
  const localSecurity = getAuthSecuritySummary(state);
  const security = repositoryAccountSecurity?.summary
    ? {
        ...localSecurity,
        ...repositoryAccountSecurity.summary,
        accounts: repositoryAccountSecurity.accounts || localSecurity.accounts
      }
    : localSecurity;
  const accountSecuritySource = repositoryAccountSecurity ? "repository account security" : "local account fallback";
  const authClass = lastAuthResult?.accepted === false ? "failed" : "passed";
  const pendingAccounts = security.accounts.filter((account) => account.email && !account.emailVerified).slice(0, 4);
  const recentRevocations = (repositoryAccountSecurity?.sessionRevocations || state.sessionRevocations || []).slice(0, 3);
  const pendingEmailRequests = (repositoryAccountSecurity?.pendingEmailVerification || (state.emailVerificationRequests || []).filter((request) => request.status === "pending")).slice(0, 3);
  const pendingResetRequests = (repositoryAccountSecurity?.pendingPasswordReset || (state.passwordResetRequests || []).filter((request) => request.status === "pending")).slice(0, 3);
  const actionCodeLabel = (request, fallback = "Account") =>
    request.email || request.metadata?.email || request.targetUserId || request.userId || fallback;
  const actionCodePreview = (request) =>
    request.tokenPreview || request.metadata?.tokenPreview || request.id || request.entityId || "hidden";
  const revocationLabel = (revocation) => revocation.reason || revocation.metadata?.reason || "Session revoked";
  return `
    <section class="panel wide-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Account access</p>
          <h2>Parent-first identity, child sign in, and session safety</h2>
        </div>
        <span class="status-pill">${session.emailVerified ? "Verified" : session.devFallback ? "Dev fallback" : "Verify email"}</span>
      </div>
      <div class="metric-grid">
        ${renderMetric("Signed role", session.role || "loading", session.devFallback ? "Dev fallback session" : "Signed session")}
        ${renderMetric("Scope", session.scope || "none", session.authenticated ? "Authenticated" : "Not signed in")}
        ${renderMetric("Email", session.emailVerified ? "Verified" : session.email ? "Pending" : "None", session.email || "Account claim")}
        ${renderMetric("Session", session.sessionId ? session.sessionId.slice(-8) : "none", session.authError || "Revocable claim")}
        ${renderMetric("Accounts", security.accountCount, `${security.verifiedAccounts} verified`)}
        ${renderMetric("Revoked", security.revokedSessions, "Blocked sessions")}
      </div>
      <div class="student-evidence-box ${repositoryAccountSecurity ? "" : "muted-box"}">
        <strong>Repository account security</strong>
        <p>${html(
          repositoryAccountSecurity
            ? `${security.accountCount} scoped account(s), ${security.pendingEmailVerification} email verification request(s), ${security.pendingPasswordReset} password reset request(s), and ${security.revokedSessions} revoked session marker(s).`
            : repositoryAccountSecurityError
              ? `Account security repository read failed: ${repositoryAccountSecurityError}`
              : "No repository account security read has loaded yet."
        )}</p>
        <small>${html(`${accountSecuritySource}${repositoryAccountSecurity?.scoped ? " / scoped to current session" : ""}`)}</small>
      </div>
      ${
        lastAuthResult
          ? `<div class="batch-result ${authClass}">
              <strong>${lastAuthResult.accepted === false ? "Account action failed" : "Account ready"}</strong>
              <span>${html(lastAuthResult.summary || lastAuthResult.reason || "Signed session updated.")}</span>
              ${lastAuthResult.actionToken ? `<code>${html(lastAuthResult.actionToken)}</code>` : ""}
            </div>`
          : ""
      }
      <div class="auth-security-grid">
        <form class="inline-form account-form auth-card primary-auth-card" id="signupForm">
          <p class="form-note"><strong>Adults start here.</strong> Parent and teacher accounts must verify email before protected setup actions. Parents then create child usernames from this page.</p>
          <div class="account-form-grid">
            <label>
              Role
              <select name="role">
                <option value="parent">Parent</option>
                <option value="teacher">Teacher</option>
              </select>
            </label>
            <label>
              Name
              <input name="displayName" placeholder="Full name" />
            </label>
            <label>
              Email
              <input name="email" type="email" placeholder="name@example.com" />
            </label>
            <label>
              Password
              <input name="password" type="password" placeholder="8+ characters" />
            </label>
            <label>
              Student grade
              <select name="grade">
                <option value="3">Grade 3</option>
                <option value="6">Grade 6</option>
                <option value="9">Grade 9</option>
              </select>
            </label>
          </div>
          <button class="primary-button" type="submit">Create account</button>
        </form>
        <div class="auth-card signin-card">
          <form class="inline-form account-form" id="signinForm">
            <label>
              Email or child username
              <input name="login" type="text" placeholder="parent@example.com or childname" />
            </label>
            <label>
              Password
              <input name="password" type="password" placeholder="8+ characters" />
            </label>
            <button class="primary-button" type="submit">Sign in</button>
          </form>
          <div class="session-control-card">
            <strong>Current session controls</strong>
            <p>${html(session.authenticated ? "Revoke the current token after password changes, shared-device use, or suspicious activity." : "Sign in to manage sessions.")}</p>
            <div class="review-action-row">
              <button class="secondary-button" type="button" data-signout>Sign out local account</button>
              <button class="secondary-button" type="button" data-revoke-session="current" ${session.authenticated && !session.devFallback ? "" : "disabled"}>Revoke this session</button>
              <button class="secondary-button" type="button" data-revoke-session="all" ${session.authenticated && !session.devFallback ? "" : "disabled"}>Revoke all mine</button>
            </div>
          </div>
        </div>
        <div class="auth-card auth-action-card">
          <h3>Email verification</h3>
          <p>${providerAuthLive ? "Request a verification email from the live identity provider, then return here after confirming it." : "Request a verification code, paste it here, then the app issues a new verified session in local development preview."}</p>
          <form class="inline-form compact-auth-form" id="emailVerificationRequestForm">
            <label>
              Account email
              <input name="login" type="email" placeholder="parent@example.com" value="${html(session.email || "")}" />
            </label>
            <button class="secondary-button" type="submit">Request verification</button>
          </form>
          <form class="inline-form compact-auth-form" id="emailVerificationConfirmForm">
            <label>
              Verification code
              <input name="token" placeholder="verify-..." />
            </label>
            <button class="primary-button" type="submit">Verify email</button>
          </form>
        </div>
        <div class="auth-card auth-action-card">
          <h3>Password reset</h3>
          <p>${providerAuthLive ? "Reset requests use the live identity provider and revoke previous sessions after the password changes." : "Reset requests use one-time codes and revoke previous sessions after the password changes in local development preview."}</p>
          <form class="inline-form compact-auth-form" id="passwordResetRequestForm">
            <label>
              Account email or username
              <input name="login" placeholder="parent@example.com or child username" />
            </label>
            <button class="secondary-button" type="submit">Request reset</button>
          </form>
          <form class="inline-form compact-auth-form" id="passwordResetConfirmForm">
            <label>
              Reset code
              <input name="token" placeholder="reset-..." />
            </label>
            <label>
              New password
              <input name="password" type="password" placeholder="8+ characters" />
            </label>
            <button class="primary-button" type="submit">Change password</button>
          </form>
        </div>
      </div>
      <div class="auth-status-board">
        <article>
          <strong>Pending verification</strong>
          ${
            pendingAccounts.length
              ? `<ul>${pendingAccounts.map((account) => `<li>${html(account.displayName || account.email)} <small>${html(account.email)}</small></li>`).join("")}</ul>`
              : "<p>No adult accounts waiting on email verification.</p>"
          }
        </article>
        <article>
          <strong>Open action codes</strong>
          ${
            pendingEmailRequests.length || pendingResetRequests.length
              ? `<ul>
                  ${pendingEmailRequests.map((request) => `<li>Email code for ${html(actionCodeLabel(request))} <small>${html(actionCodePreview(request))}</small></li>`).join("")}
                  ${pendingResetRequests.map((request) => `<li>Reset code for ${html(actionCodeLabel(request))} <small>${html(actionCodePreview(request))}</small></li>`).join("")}
                </ul>`
              : "<p>No active verification or reset requests.</p>"
          }
        </article>
        <article>
          <strong>Revocation log</strong>
          ${
            recentRevocations.length
              ? `<ul>${recentRevocations.map((revocation) => `<li>${html(revocationLabel(revocation))} <small>${html(revocation.userId)} ${html(revocation.sessionId ? revocation.sessionId.slice(-8) : "all sessions")}</small></li>`).join("")}</ul>`
              : "<p>No sessions have been revoked yet.</p>"
          }
        </article>
      </div>
      <p class="callout">${providerAuthLive ? "Live Supabase Auth is active for identity, email verification, password reset, and provider sessions. Parent-gated child creation and server-side revocation remain enforced." : "Local development auth enforces adult email verification, parent-gated child creation, one-time password reset, and server-side session revocation. Production requires the live provider and verified database runtime."}</p>
    </section>
  `;
}

function renderChildAccountCreator() {
  const canCreateChild = currentSession?.authenticated && ["parent", "school-admin", "platform-admin"].includes(currentSession.role);
  return `
    <section class="panel wide-panel child-account-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Child account creator</p>
          <h2>Parent creates the learner login</h2>
        </div>
        <span class="status-pill">${canCreateChild ? "Ready" : "Sign in first"}</span>
      </div>
      <div class="child-account-layout">
        <div class="child-account-copy">
          <h3>How this should work</h3>
          <p>The parent owns the household, consent, rewards, and reports. Each child gets a private username and password, then lands on their own academy page with XP, subject levels, lessons, tutor help, and visual missions.</p>
          <ul class="check-list">
            <li>Child usernames are not public and are linked to the parent household.</li>
            <li>Parent-approved rewards can include creative unlocks, family benefits, or a gift card threshold.</li>
            <li>AI tutor use stays visible to the parent and is built around hints, not answer dumping.</li>
          </ul>
        </div>
        <form class="inline-form account-form child-create-form" id="childAccountForm">
          <label>
            Child display name
            <input name="displayName" placeholder="Avery" ${canCreateChild ? "" : "disabled"} />
          </label>
          <label>
            Child username
            <input name="username" placeholder="avery-learner" ${canCreateChild ? "" : "disabled"} />
          </label>
          <label>
            Child password
            <input name="password" type="password" placeholder="8+ characters" ${canCreateChild ? "" : "disabled"} />
          </label>
          <label>
            Grade
            <select name="grade" ${canCreateChild ? "" : "disabled"}>
              <option value="K">Kindergarten</option>
              <option value="1">Grade 1</option>
              <option value="2">Grade 2</option>
              <option value="3" selected>Grade 3</option>
              <option value="4">Grade 4</option>
              <option value="5">Grade 5</option>
              <option value="6">Grade 6</option>
              <option value="7">Grade 7</option>
              <option value="8">Grade 8</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
          </label>
          <label>
            Accommodations or notes
            <textarea name="accommodations" rows="3" placeholder="Read-aloud support, short practice sets" ${canCreateChild ? "" : "disabled"}></textarea>
          </label>
          <button class="primary-button" type="submit" ${canCreateChild ? "" : "disabled"}>Create child login</button>
        </form>
      </div>
    </section>
  `;
}

function renderRuntimeConfigurationPanel() {
  const runtime = currentRuntimeConfiguration?.runtime;
  const repository = currentRuntimeConfiguration?.repository;
  const checks = runtime?.checks || [];
  const health = currentRuntimeHealth;
  return `
    <section class="panel wide-panel runtime-config-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Runtime configuration</p>
          <h2>Supabase, Postgres, auth, and OpenAI readiness</h2>
        </div>
        <span class="status-pill ${runtime?.ready ? "passed" : "failed"}">${runtime?.ready ? "Runtime ready" : "Needs config"}</span>
      </div>
      ${
        currentRuntimeConfigurationError
          ? `<p class="callout failed">Runtime status could not load: ${html(currentRuntimeConfigurationError)}</p>`
          : `<div class="metric-grid">
              ${renderMetric("Repository", repository?.mode || runtime?.repositoryMode || "loading", runtime?.databaseConfigured ? "Database configured" : "Database missing")}
              ${renderMetric("Production", runtime?.productionMode ? "on" : "off", runtime?.productionMode ? "Strict runtime gates" : "Local preview mode")}
              ${renderMetric("Supabase auth", runtime?.authProviderConfigured ? "configured" : "missing", runtime?.supabaseJwksConfigured ? "JWKS set" : "JWKS missing")}
              ${renderMetric("OpenAI images", runtime?.openAiImage?.ready ? "ready" : "review-only", runtime?.openAiImage?.model || "no model")}
              ${renderMetric("Visual storage", runtime?.visualAssetStorage?.ready ? "ready" : "missing", runtime?.visualAssetStorage?.bucket || "no bucket")}
              ${renderMetric("Repository health", health?.healthy ? "healthy" : health ? "failed" : "not checked", health?.latencyMs ? `${health.latencyMs}ms live probe` : "Normalized table probe")}
            </div>
            ${health?.probe?.missingTables?.length ? `<div class="gate-list failed"><strong>Missing normalized tables</strong>${health.probe.missingTables.map((table) => `<span>${html(table)}</span>`).join("")}</div>` : ""}
            ${currentRuntimeHealthError ? `<p class="callout failed">${html(currentRuntimeHealthError)}</p>` : ""}
            <div class="readiness-list">
              ${checks
                .map(
                  (check) => `
                    <div class="readiness-row ${check.passed ? "passed" : "failed"}">
                      <span>${check.passed ? "Pass" : "Set"}</span>
                      <strong>${html(check.label)}</strong>
                      <small>${html(`${check.value}: ${check.detail}`)}</small>
                    </div>
                  `
                )
                .join("")}
            </div>
            ${
              runtime?.blockers?.length
                ? `<div class="gate-list failed">${runtime.blockers.map((blocker) => `<span>${html(blocker)}</span>`).join("")}</div>`
                : ""
            }
            ${
              runtime?.warnings?.length
                ? `<div class="gate-list">${runtime.warnings.map((warning) => `<span>${html(warning)}</span>`).join("")}</div>`
                : ""
            }`
      }
    </section>
  `;
}

function renderProductCompletenessPanel({ compact = false } = {}) {
  const runtime = currentRuntimeConfiguration?.runtime
    ? {
        ...currentRuntimeConfiguration.runtime,
        liveHealth: currentRuntimeHealth,
        databaseVerified: currentRuntimeHealth?.healthy === true
      }
    : {};
  const audit = getProductCompletenessAudit(state, runtime);
  return `
    <section class="panel wide-panel product-completeness-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Product completion audit</p>
          <h2>What is real, what is still in progress, and what is blocked</h2>
        </div>
        <span class="status-pill ${audit.readyForSale ? "passed" : "failed"}">${audit.percent}% complete</span>
      </div>
      <div class="metric-grid">
        ${renderMetric("Complete", audit.complete, `${audit.total} systems`)}
        ${renderMetric("In progress", audit.inProgress, "Needs build-out")}
        ${renderMetric("Blocked", audit.blocked, "Needs config/provider")}
        ${renderMetric("Sellable", audit.readyForSale ? "Yes" : "Not yet", "School product gate")}
      </div>
      <div class="build-plan-grid action-audit-grid">
        ${audit.categories
          .slice(0, compact ? 8 : audit.categories.length)
          .map(
            (item) => `
              <article class="${html(item.status)}">
                <span>${html(item.status)}</span>
                <h3>${html(item.title)}</h3>
                <p>${html(item.evidence)}</p>
                <small>${html(item.nextStep)}</small>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderSetupView() {
  const onboarding = getOnboardingStatus(state);
  const consent = getConsentReadiness(state);
  const placements = getPlacementPlan(state);
  const rewardPlan = getRewardPlan(state);

  return renderShell(`
    ${renderAccountAccessPanel()}
    ${renderRuntimeConfigurationPanel()}
    ${renderChildAccountCreator()}

    <section class="panel wide-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Parent setup</p>
          <h2>Consent, placement, accommodations, and rewards</h2>
        </div>
        <span class="status-pill">${onboarding.percent}% ready</span>
      </div>
      <div class="setup-steps">
        ${onboarding.steps
          .map(
            (step) => `
              <article class="setup-step ${step.complete ? "complete" : ""}">
                <span>${step.complete ? "Done" : "Next"}</span>
                <h3>${html(step.title)}</h3>
                <p>${html(step.purpose)}</p>
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    <section class="panel">
      <div class="section-head compact">
        <h2>Consent readiness</h2>
      </div>
      <div class="metric-grid single">
        ${renderMetric("Required consent", consent.ready ? "Ready" : "Blocked", `${consent.missing.length} missing`)}
        ${renderMetric("AI restrictions", consent.aiRestricted.length, "Parent-controlled")}
      </div>
      <ul class="check-list">
        ${consent.requiredFields.map((field) => `<li>${html(field)}</li>`).join("")}
      </ul>
    </section>

    <section class="panel wide-panel">
      <div class="section-head compact">
        <h2>Diagnostic placement</h2>
      </div>
      <div class="placement-grid">
        ${placements
          .map(
            ({ learner, diagnostic, result }) => {
              const access = getLearnerAccess(state, learner.id);
              return `
                <article class="placement-card">
                  <div>
                    <span class="range-badge">${html(findAcademy(learner.academyId).range)}</span>
                    <h3>${html(learner.name)}</h3>
                    <p>${html(result.recommendedStart)}</p>
                    <small>${html(diagnostic.title)} | ${html(diagnostic.measures.join(", "))}</small>
                  </div>
                  <div>
                    <strong>${result.confidence}% confidence</strong>
                    <p>${html(result.supportPlan)}</p>
                    <button class="small-button" data-run-placement="${html(learner.id)}">Run placement</button>
                    <small>${access.active ? "Student access active" : html(access.blockedReasons.join(" "))}</small>
                  </div>
                </article>
              `;
            }
          )
          .join("")}
      </div>
    </section>

    <section class="panel">
      <div class="section-head compact">
        <h2>Reward configuration</h2>
      </div>
      <div class="reward-config-list">
        ${rewardPlan.selected
          .map(
            (reward) => `
              <article>
                <h3>${html(reward.title)}</h3>
                <p>${html(reward.guardrail)}</p>
                <small>${html(reward.examples.join(", "))}</small>
              </article>
            `
          )
          .join("")}
      </div>
      <form class="inline-form" id="benefitForm">
        <label for="familyBenefit">Add family benefit</label>
        <input id="familyBenefit" name="familyBenefit" placeholder="Example: pick Saturday science build" />
        <button class="primary-button" type="submit">Add</button>
      </form>
      <div class="metric-tags">
        ${rewardPlan.familyBenefits.map((benefit) => `<span>${html(benefit)}</span>`).join("")}
      </div>
    </section>

    <aside class="panel side-panel">
      <div class="section-head compact">
        <h2>Parent controls</h2>
      </div>
      <ul class="check-list">
        ${parentOnboardingModel.parentControls.map((control) => `<li>${html(control)}</li>`).join("")}
      </ul>
    </aside>
  `);
}

function renderParentLearnerInsights(insights) {
  return `
    <section class="panel wide-panel parent-insights-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Child accounts and learning signals</p>
          <h2>Where each child is excelling, struggling, and what to do next</h2>
        </div>
        <button class="secondary-button" data-view="setup">Create child login</button>
      </div>
      <div class="parent-insight-grid">
        ${insights
          .map((insight) => {
            const repositorySignals = getRepositoryInteractiveSignalSummary({ learnerId: insight.learner.id, limit: 3 });
            const repositoryQuizMastery = getRepositoryQuizMasterySummary({ learnerId: insight.learner.id, limit: 3 });
            const repositoryTutor = getRepositoryTutorEventSummary(insight.learner.id);
            const repositoryRewards = getRepositoryRewardApprovalSummary(insight.learner.id);
            const repositoryPortfolio = getRepositoryPortfolioEvidenceSummary(insight.learner.id);
            const repositoryStatus = getRepositoryLearningCatalogStatus({ learnerId: insight.learner.id });
            const repositoryPhases = getRepositoryPhaseSummary(insight.learner.id);
            return `
              <article class="parent-insight-card">
                <div class="insight-card-head">
                  <div>
                    <span class="range-badge">${html(findAcademy(insight.learner.academyId).range)}</span>
                    <h3>${html(insight.learner.name)}</h3>
                    <small>Grade ${html(insight.learner.grade)} | ${html(insight.childAccount?.username ? `@${insight.childAccount.username}` : "No child login yet")}</small>
                  </div>
                  <div class="mini-level-badge">
                    <span>Level</span>
                    <strong>${insight.levelProfile.level}</strong>
                  </div>
                </div>
                ${renderXpTrack(insight.levelProfile.progressPercent, `${insight.learner.name} account progress`)}
                <div class="subject-card-meta">
                  <span>${insight.levelProfile.totalXp} XP</span>
                  <span>${insight.levelProfile.xpToNextLevel} to next</span>
                  <span>${html(insight.levelProfile.nextReward.title)}</span>
                </div>
                <div class="parent-signal-columns">
                  <div>
                    <strong>Excelling</strong>
                    <p>${html(insight.strengths.join(" "))}</p>
                  </div>
                  <div>
                    <strong>Needs support</strong>
                    <p>${html(insight.struggles.join(" "))}</p>
                  </div>
                </div>
                <div class="suggestion-box">
                  <strong>Suggested next move</strong>
                  <p>${html(insight.suggestedLesson)}</p>
                  <small>${html(insight.suggestedTutorPrompt)}</small>
                </div>
                ${
                  insight.latestScratchpad
                    ? `<div class="student-evidence-box">
                        <strong>Latest student writing</strong>
                        <p>${html(insight.latestScratchpad.explanation || insight.latestScratchpad.firstStep || insight.latestScratchpad.confusion || "Scratchpad started.")}</p>
                        <small>${insight.latestScratchpad.tutorReviewCount} tutor review(s)</small>
                      </div>`
                    : `<div class="student-evidence-box muted-box">
                        <strong>No scratchpad evidence yet</strong>
                        <p>Open a lesson and have the child write their first step or confusion.</p>
                      </div>`
                }
                <div class="student-evidence-box ${insight.latestTutorReflection ? "" : "muted-box"}">
                  <strong>Tutor diagnosis evidence</strong>
                  <p>${html(insight.latestTutorReflection ? `${insight.latestTutorReflection.label || "Diagnosed stuck point"}: ${insight.latestTutorReflection.nextQuestion || "Hint path ready."}` : "No diagnosed tutor reflection yet.")}</p>
                  <small>${html(`${insight.tutorReflectionSummary.qualified}/${insight.tutorReflectionSummary.total} qualified reflection(s), ${insight.tutorReflectionSummary.totalXp} tutor XP`)}</small>
                </div>
                <div class="student-evidence-box ${repositoryTutor.summary.total ? "" : "muted-box"}">
                  <strong>Repository tutor events</strong>
                  <p>${html(
                    repositoryTutor.latest
                      ? `${repositoryTutor.latest.modeTitle || repositoryTutor.latest.type || "Tutor event"}: ${repositoryTutor.latest.stuckPointLabel || repositoryTutor.latest.nextQuestion || "reviewable help recorded"}`
                      : repositoryTutor.error
                        ? `Learner-scoped tutor read failed: ${repositoryTutor.error}`
                        : "No learner-scoped tutor event has been read for this child yet."
                  )}</p>
                  <small>${html(`${repositoryTutor.summary.helped}/${repositoryTutor.summary.feedback} helped, ${repositoryTutor.summary.needsTruthReview} need truth review from ${repositoryTutor.source}`)}</small>
                </div>
                <div class="student-evidence-box ${insight.latestInteractiveSkill ? "" : "muted-box"}">
                  <strong>Interactive skill evidence</strong>
                  <p>${html(
                    insight.interactiveSkillSignals?.length
                      ? insight.interactiveSkillSignals
                          .slice(0, 2)
                          .map((signal) => `${signal.skillLabel}: ${signal.status}`)
                          .join(" | ")
                      : "No interactive model evidence yet."
                  )}</p>
                  <small>${html(`${insight.interactiveSkillSummary.secure}/${insight.interactiveSkillSummary.total} secure model check(s), ${insight.interactiveSkillSummary.needsSupport} needing support`)}</small>
                </div>
                <div class="student-evidence-box ${repositorySignals.total ? "" : "muted-box"}">
                  <strong>Repository skill signals</strong>
                  <p>${html(
                    repositorySignals.total
                      ? repositorySignals.signals
                          .map((signal) => `${signal.lessonTitle}: ${signal.skillLabel} - ${signal.status}`)
                          .join(" | ")
                      : repositoryStatus.error
                        ? `Learner-scoped catalog read failed: ${repositoryStatus.error}`
                        : "No catalog-backed interactive evidence has been read for this child yet."
                  )}</p>
                  <small>${html(`${repositorySignals.secure}/${repositorySignals.total} secure from ${repositoryStatus.source} /api/learning/catalog, ${repositorySignals.needsSupport} needing support`)}</small>
                </div>
                <div class="student-evidence-box ${repositoryQuizMastery.total ? "" : "muted-box"}">
                  <strong>Repository quiz and mastery</strong>
                  <p>${html(
                    repositoryQuizMastery.latest
                      ? `${repositoryQuizMastery.latest.lessonTitle}: quiz ${repositoryQuizMastery.latest.quizScore}% | mastery ${repositoryQuizMastery.latest.masteryScore}% ${repositoryQuizMastery.latest.masteryStatus || ""}`
                      : repositoryStatus.error
                        ? `Learner-scoped catalog read failed: ${repositoryStatus.error}`
                        : "No catalog-backed quiz or mastery evidence has been read for this child yet."
                  )}</p>
                  <small>${html(`${repositoryQuizMastery.quizPassed}/${repositoryQuizMastery.quizAttempts} quiz attempt(s) passed, ${repositoryQuizMastery.mastered}/${repositoryQuizMastery.masteryRecords} mastery record(s) mastered`)}</small>
                </div>
                <div class="student-evidence-box ${repositoryPhases.phases ? "" : "muted-box"}">
                  <strong>Repository Nexus phases</strong>
                  <p>${html(
                    repositoryPhases.phases
                      ? `${repositoryPhases.phases} phase move(s) cleared across ${repositoryPhases.clearedLessons} lesson(s).`
                      : repositoryStatus.error
                        ? `Learner-scoped catalog read failed: ${repositoryStatus.error}`
                        : "No catalog-backed phase completion evidence has been read for this child yet."
                  )}</p>
                  <small>${html(`${repositoryPhases.clearedLessons}/${repositoryPhases.lessons} catalog lesson(s) have phase evidence from ${repositoryPhases.source}`)}</small>
                </div>
                <div class="student-evidence-box ${repositoryRewards.summary.total ? "" : "muted-box"}">
                  <strong>Repository reward approvals</strong>
                  <p>${html(
                    repositoryRewards.latest
                      ? `${repositoryRewards.latest.rewardTitle}: ${rewardStatusLabel(repositoryRewards.latest.status)}`
                      : repositoryRewards.error
                        ? `Learner-scoped reward read failed: ${repositoryRewards.error}`
                        : "No learner-scoped reward approval has been read for this child yet."
                  )}</p>
                  <small>${html(`${repositoryRewards.summary.parentActionRequired} parent action, ${repositoryRewards.summary.approved} approved, ${repositoryRewards.summary.fulfilled} fulfilled from ${repositoryRewards.source}`)}</small>
                </div>
                <div class="student-evidence-box ${repositoryPortfolio.summary.portfolioItems || repositoryPortfolio.summary.badgesEarned ? "" : "muted-box"}">
                  <strong>Repository portfolio and badges</strong>
                  <p>${html(
                    repositoryPortfolio.latestPortfolioItem
                      ? `${repositoryPortfolio.latestPortfolioItem.title}: ${repositoryPortfolio.latestPortfolioItem.artifactType}`
                      : repositoryPortfolio.latestBadge
                        ? `${repositoryPortfolio.latestBadge.title}: ${repositoryPortfolio.latestBadge.category}`
                        : repositoryPortfolio.error
                          ? `Learner-scoped portfolio read failed: ${repositoryPortfolio.error}`
                          : "No learner-scoped portfolio artifact or badge has been read for this child yet."
                  )}</p>
                  <small>${html(`${repositoryPortfolio.summary.portfolioItems} portfolio item(s), ${repositoryPortfolio.summary.badgesEarned} badge(s), ${repositoryPortfolio.summary.masteryArtifacts} mastery artifact(s) from ${repositoryPortfolio.source}`)}</small>
                </div>
                <div class="hero-actions">
                  ${
                    insight.suggestedLessonId
                      ? `<button class="small-button" data-lesson="${html(insight.suggestedLessonId)}" data-view="lesson">Open lesson</button>`
                      : `<button class="small-button" data-view="curriculum">Open curriculum</button>`
                  }
                  <button class="small-button" data-view="ai">Open tutor</button>
                </div>
              </article>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderParentEvidenceTimeline(learnerIds = []) {
  const scopedLearners =
    learnerIds.length || hasStrictLearnerScope()
      ? state.learners.filter((learner) => learnerIds.includes(learner.id))
      : state.learners;
  const rows = scopedLearners.flatMap((learner) => {
    const scratchpads = Object.values(state.lessonScratchpads?.[learner.id] || {});
    return getTodayPlan(state, { learnerIds: [learner.id] }).slice(0, 4).map((lesson) => {
      const quiz = state.quizResults?.[lesson.id] || null;
      const mastery = state.mastery?.[lesson.id] || {};
      const scratchpad = scratchpads.find((item) => item.lessonId === lesson.id) || null;
      const reward = (state.rewardApprovals || []).find((request) => request.learnerId === learner.id && request.evidence?.lessonId === lesson.id);
      const repositoryEvidence = repositoryParentEvidenceForLesson(learner.id, lesson.id);
      const repositoryQuizMastery = repositoryEvidence.quizMastery.latest || null;
      const repositoryReward = repositoryEvidence.reward;
      const repositoryScratchpad = repositoryEvidence.scratchpad;
      const repositoryPortfolio = repositoryEvidence.portfolio;
      return { learner, lesson, quiz, mastery, scratchpad, reward, repositoryQuizMastery, repositoryReward, repositoryScratchpad, repositoryPortfolio, repositoryEvidence };
    });
  });
  const repositoryEvidenceCount = rows.filter((row) => row.repositoryEvidence.hasRepositoryEvidence).length;

  return `
    <section class="panel wide-panel parent-evidence-timeline">
      <div class="section-head">
        <div>
          <p class="eyebrow">Parent progress evidence</p>
          <h2>What the child actually did inside the lesson</h2>
        </div>
        <span class="status-pill">${rows.filter((row) => row.quiz || row.scratchpad || row.repositoryScratchpad || row.reward || row.repositoryEvidence.hasRepositoryEvidence).length} evidence items</span>
      </div>
      <p class="callout">This timeline now prefers learner-scoped repository evidence for quiz, mastery, reward status, student scratchpad writing, portfolio artifacts, and earned badges. Local state remains the fallback while each route is migrated.</p>
      <div class="evidence-timeline-grid">
        ${
          rows.length
            ? rows
                .map(
                  ({ learner, lesson, quiz, mastery, scratchpad, reward, repositoryQuizMastery, repositoryReward, repositoryScratchpad, repositoryPortfolio, repositoryEvidence }) => {
                    const evidenceScore = repositoryQuizMastery ? repositoryQuizMastery.quizScore || repositoryQuizMastery.masteryScore : quiz ? quiz.score : mastery.score || 0;
                    const evidenceStatus = repositoryQuizMastery
                      ? repositoryQuizMastery.quizPassed || repositoryQuizMastery.masteryScore >= 80
                        ? "Mastered"
                        : repositoryQuizMastery.masteryStatus || "Needs reteach"
                      : quiz
                        ? quiz.passed
                          ? "Mastered"
                          : "Needs reteach"
                        : mastery.status || "Not started";
                    const statusClass = evidenceStatus === "Mastered" ? "mastered" : evidenceScore ? "needs-review" : "not-started";
                    const visibleReward = repositoryReward || reward;
                    const visibleScratchpad = repositoryScratchpad || scratchpad;
                    return `
              <article class="evidence-timeline-card ${statusClass}">
                <div>
                  <span>${html(learner.name)} | Grade ${html(learner.grade)}</span>
                  <h3>${html(lesson.title)}</h3>
                  <p>${html(lesson.objective)}</p>
                </div>
                <div class="evidence-status-row">
                  <strong>${html(`${evidenceScore}%`)}</strong>
                  <span>${html(evidenceStatus)}</span>
                </div>
                <div class="student-evidence-box ${repositoryQuizMastery ? "" : "muted-box"}">
                  <strong>Repository quiz/mastery</strong>
                  <p>${html(
                    repositoryQuizMastery
                      ? `${repositoryQuizMastery.lessonTitle}: quiz ${repositoryQuizMastery.quizScore}% | mastery ${repositoryQuizMastery.masteryScore}% ${repositoryQuizMastery.masteryStatus || ""}`
                      : "No learner-scoped catalog quiz or mastery row for this lesson yet."
                  )}</p>
                </div>
                <div class="student-evidence-box ${repositoryEvidence.phaseCompletions.length ? "" : "muted-box"}">
                  <strong>Nexus learning phases</strong>
                  <p>${html(
                    repositoryEvidence.phaseCompletions.length
                      ? `${repositoryEvidence.completedPhaseCount} phase move(s) cleared: ${repositoryEvidence.phaseCompletions.map((item) => item.phase).join(", ")}.`
                      : "No persisted phase-completion evidence for this lesson yet."
                  )}</p>
                  ${repositoryEvidence.phaseCompletions.length ? "<small>Read from the learner-scoped catalog phase evidence.</small>" : ""}
                </div>
                <div class="student-evidence-box ${visibleScratchpad ? "" : "muted-box"}">
                  <strong>Student writing</strong>
                  <p>${html(visibleScratchpad?.explanation || visibleScratchpad?.confusion || visibleScratchpad?.firstStep || "No written stuck point or explanation yet.")}</p>
                  ${repositoryScratchpad ? `<small>${html(`${repositoryScratchpad.tutorReviewCount || 0} tutor review(s) from learner-scoped scratchpad repository.`)}</small>` : ""}
                </div>
                <div class="student-evidence-box ${visibleReward ? "" : "muted-box"}">
                  <strong>Reward status</strong>
                  <p>${html(visibleReward ? `${visibleReward.rewardTitle}: ${rewardStatusLabel(visibleReward.status)}` : "No reward request for this lesson yet.")}</p>
                  ${repositoryReward ? "<small>Read from learner-scoped reward repository.</small>" : ""}
                </div>
                <div class="student-evidence-box ${repositoryPortfolio?.portfolioItem || repositoryPortfolio?.badge ? "" : "muted-box"}">
                  <strong>Portfolio and badges</strong>
                  <p>${html(
                    repositoryPortfolio?.portfolioItem
                      ? `${repositoryPortfolio.portfolioItem.title}: ${repositoryPortfolio.portfolioItem.artifactType}`
                      : repositoryPortfolio?.badge
                        ? `${repositoryPortfolio.badge.title}: ${repositoryPortfolio.badge.category}`
                        : "No portfolio artifact or badge row for this lesson yet."
                  )}</p>
                  ${repositoryPortfolio?.portfolioItem || repositoryPortfolio?.badge ? "<small>Read from learner-scoped portfolio evidence repository.</small>" : ""}
                </div>
                ${
                  quiz?.adaptiveReteach
                    ? `<div class="student-evidence-box">
                        <strong>Targeted reteach</strong>
                        <p>${html(quiz.adaptiveReteach.studentMessage)}</p>
                        <small>${html(quiz.adaptiveReteach.teacherLookFor)}</small>
                      </div>`
                    : ""
                }
                <div class="hero-actions">
                  <button class="small-button" data-lesson="${html(lesson.id)}" data-view="lesson">Open lesson</button>
                  <button class="small-button" data-view="ai">Review tutor</button>
                </div>
              </article>
            `;
                  }
                )
                .join("")
            : `<div class="student-evidence-box muted-box">
                <strong>No linked child evidence yet</strong>
                <p>Create a child account, have the child sign in, then complete a visual lesson to populate this timeline.</p>
                <button class="small-button" data-view="setup">Create child login</button>
              </div>`
        }
      </div>
      <small class="form-note">${repositoryEvidenceCount} row(s) are currently backed by scoped repository evidence.</small>
    </section>
  `;
}

function renderRewardApprovalPanel(learnerIds = []) {
  const allowedLearners = new Set(learnerIds);
  const repositoryQueue = learnerIds
    .flatMap((learnerId) => getRepositoryRewardApprovalSummary(learnerId).approvals.map(repositoryRewardApprovalToRequest));
  const localQueue = getRewardApprovalQueue(state).filter((request) => !hasStrictLearnerScope() || allowedLearners.has(request.learnerId));
  const queue = repositoryQueue.length ? repositoryQueue : localQueue;
  const queueSource = repositoryQueue.length ? "learner-scoped repository" : "local fallback";
  const pending = queue.filter((request) => request.status === "pending");
  const approved = queue.filter((request) => request.status === "approved");
  const redeemed = queue.filter((request) => request.status === "redeemed");
  const rejected = queue.filter((request) => request.status === "rejected");
  const giftCards = currentGiftCardReadiness || {
    ready: false,
    provider: "manual",
    mode: "manual-review",
    blockers: ["Gift-card fulfillment readiness has not loaded."]
  };
  const fulfilled = queue.filter((request) => request.fulfillment?.status && request.fulfillment.status !== "failed");
  return `
    <section class="panel wide-panel reward-approval-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Parent reward approvals</p>
          <h2>Mastery rewards that need adult control</h2>
        </div>
        <span class="status-pill">${pending.length} pending</span>
      </div>
      <p class="callout">Gift cards and family benefits are not automatic. The app can show eligibility, but a parent approves, rejects, and marks delivery after checking mastery, recall, and household rules. This panel is currently reading from ${html(queueSource)}.</p>
      ${
        lastRewardResult
          ? `<div class="batch-result ${lastRewardResult.accepted === false ? "failed" : "passed"}">
              <strong>${lastRewardResult.accepted === false ? "Reward action needs attention" : "Reward action recorded"}</strong>
              <span>${html(lastRewardResult.summary || lastRewardResult.reason || "Reward workflow updated.")}</span>
            </div>`
          : ""
      }
      <div class="metric-grid">
        ${renderMetric("Pending", pending.length, "Needs parent decision")}
        ${renderMetric("Approved", approved.length, "Ready to deliver")}
        ${renderMetric("Fulfilled", fulfilled.length, `${giftCards.provider || "manual"} provider`)}
        ${renderMetric("Redeemed", redeemed.length, "Logged as benefit")}
        ${renderMetric("Rejected", rejected.length, "Needs more evidence")}
      </div>
      <div class="gift-card-readiness ${giftCards.ready ? "ready" : "blocked"}">
        <strong>${giftCards.ready ? "Gift-card fulfillment ready" : "Gift-card fulfillment needs setup"}</strong>
        <span>${html(giftCards.mode || "manual-review")} | max ${html(Math.round((giftCards.maxAmountCents || 0) / 100))} ${html(giftCards.currencyCode || "USD")} | ${html(giftCards.dailyLimit || 0)}/day</span>
        ${giftCards.blockers?.length ? `<small>${html(giftCards.blockers.join(" "))}</small>` : "<small>Provider calls remain parent/admin controlled and never student-facing.</small>"}
      </div>
      <div class="reward-request-grid">
        ${
          queue.length
            ? queue
                .slice(0, 12)
                .map((request) => {
                  const giftCard = isGiftCardRewardRequest(request);
                  const fulfillment = request.fulfillment || null;
                  return `
                    <article class="reward-request-card ${html(request.status)}">
                      <div class="reward-request-topline">
                        <span>${html(rewardStatusLabel(request.status))}</span>
                        <small>Level ${html(request.rewardLevel)}</small>
                      </div>
                      <h3>${html(request.rewardTitle)}</h3>
                      <p>${html(request.rewardBenefit)}</p>
                      <div class="reward-evidence-box">
                        <strong>${html(request.learnerName)}</strong>
                        <span>${html(request.evidence?.source || "Learning evidence")}</span>
                        <small>${html(request.evidence?.lessonTitle || "No lesson linked yet")}${request.evidence?.score ? ` | ${html(request.evidence.score)}%` : ""}</small>
                      </div>
                      ${
                        fulfillment
                          ? `<div class="reward-fulfillment-status ${html(fulfillment.status || "")}">
                              <strong>${html(fulfillment.status === "failed" ? "Fulfillment failed" : "Fulfillment recorded")}</strong>
                              <span>${html(fulfillment.provider || "manual")} ${fulfillment.amountCents ? `| $${html((fulfillment.amountCents / 100).toFixed(2))}` : ""}</span>
                              <small>${html(fulfillment.error || fulfillment.providerReference || fulfillment.recipientEmail || "No provider reference stored.")}</small>
                            </div>`
                          : ""
                      }
                      <div class="hero-actions">
                        ${
                          request.status === "pending"
                            ? `<button class="small-button" data-reward-decision="${html(request.id)}" data-status="approved">Approve</button>
                               <button class="small-button muted-action" data-reward-decision="${html(request.id)}" data-status="rejected">Reject</button>`
                            : request.status === "approved" && giftCard
                              ? `<form class="reward-fulfillment-form" data-reward-fulfillment="${html(request.id)}">
                                  <label>
                                    Parent delivery email
                                    <input name="recipientEmail" type="email" placeholder="parent@example.com" value="${html(currentSession?.email || "")}" ${giftCards.ready ? "" : "disabled"} />
                                  </label>
                                  <label>
                                    Recipient name
                                    <input name="recipientName" placeholder="Parent name" value="${html(currentSession?.displayName || "")}" ${giftCards.ready ? "" : "disabled"} />
                                  </label>
                                  <button class="small-button" type="submit" ${giftCards.ready ? "" : "disabled"}>${giftCards.ready ? "Fulfill gift card" : "Configure provider"}</button>
                                </form>`
                              : request.status === "approved"
                                ? `<button class="small-button" data-reward-decision="${html(request.id)}" data-status="redeemed">Mark redeemed</button>`
                              : `<span class="status-pill">${html(request.status)}</span>`
                        }
                      </div>
                    </article>
                  `;
                })
                .join("")
            : `<div class="student-evidence-box muted-box">
                <strong>No reward requests yet</strong>
                <p>Have a child claim an unlocked reward from their level dashboard after a real lesson action.</p>
              </div>`
        }
      </div>
    </section>
  `;
}

function renderParentView() {
  const scope = learnerScopeOptions();
  const learnerIds = scope.learnerIds;
  const linkedLearners = learnersForCurrentSession();
  const summary = getParentSummary(state, scope);
  const todayPlan = getTodayPlan(state, scope);
  const telemetry = getLearningTelemetry(state, scope);
  const tutorQuality = getTutorQualityDashboard(state);
  const learnerInsights = getHouseholdLearnerInsights(state, scope);
  const repositoryMastery = getRepositoryMasteryAggregate(learnerIds);
  const repositoryTutor = getRepositoryTutorAggregate(learnerIds);
  const visibleSummary = repositoryMastery.available
    ? { ...summary, averageMastery: repositoryMastery.averageMastery, mastered: repositoryMastery.mastered, needsReview: repositoryMastery.needsReview }
    : summary;
  const linkedLearnerNames = new Set(linkedLearners.map((learner) => learner.name));
  const repositoryAssignmentRows = learnerIds.flatMap((learnerId) => getRepositoryAssignmentSummary(learnerId).assignments);
  const repositoryRetentionRows = learnerIds.flatMap((learnerId) => getRepositoryRetentionScheduleSummary(learnerId).schedules);
  const scopedAssignments =
    repositoryAssignmentRows.length
      ? repositoryAssignmentRows.map((assignment) => ({
          id: assignment.id,
          learner: state.learners.find((learner) => learner.id === assignment.learnerId)?.name || assignment.learnerId,
          title: assignment.title,
          due: assignment.dueAt,
          status: assignment.status,
          source: "learner-scoped repository"
        }))
      : hasStrictLearnerScope()
        ? (state.assignments || []).filter((assignment) => linkedLearnerNames.has(assignment.learner))
        : state.assignments || [];
  const recallDueCount = repositoryRetentionRows.length ? repositoryRetentionRows.filter((schedule) => schedule.due).length : telemetry.recallDueCount;
  const retentionNeedsReteach = repositoryRetentionRows.filter((schedule) => schedule.needsReteach).length;

  return renderShell(`
    ${renderRoleHero({
      role: "parent",
      eyebrow: "Parent page",
      title: "Household command center",
      body: "Parents see consent, progress, recall due, weak skills, tutor activity, and reward settings without exposing one child to another household.",
      primaryAction: { label: "Setup family", view: "setup" },
      secondaryAction: { label: "Review tutor", view: "ai" },
      stats: [
        { label: "Average mastery", value: `${visibleSummary.averageMastery}%`, detail: `${visibleSummary.needsReview} need review` },
        { label: "Recall due", value: recallDueCount, detail: repositoryRetentionRows.length ? "Repository spaced retrieval" : "Spaced retrieval" },
        { label: "Children", value: learnerInsights.length, detail: "Linked learner accounts" }
      ]
    })}
    ${
      hasStrictLearnerScope() && !learnerInsights.length
        ? `<section class="panel wide-panel empty-role-state">
            <div class="section-head compact">
              <h2>No child accounts are linked to this parent yet</h2>
            </div>
            <p>The production flow starts with a parent account, then the parent creates a child username and password. After that, this page shows only that household's progress, rewards, tutor notes, and lesson evidence.</p>
            <button class="primary-button" data-view="setup">Create the first child login</button>
          </section>`
        : ""
    }
    ${renderExperienceSwitchboard({
      eyebrow: "Parent screens",
      title: "Family oversight without exposing child data",
      items: [
        {
          kicker: "Account links",
          title: "Parent-child setup",
          body: "Households manage consent, student links, grade placement, and accommodations before sensitive tools are opened.",
          tone: "green",
          view: "setup",
          action: "Setup"
        },
        {
          kicker: "Weak skills",
          title: "Reteach queue",
          body: "Parents see the next intervention, quiz evidence, recall due, and suggested reteach lessons for each learner.",
          tone: "coral"
        },
        {
          kicker: "Tutor visibility",
          title: "AI help is reviewable",
          body: "Tutor turns stay visible for adults, including whether the answer helped, truth review status, and redesign signals.",
          tone: "blue",
          view: "ai",
          action: "Review tutor"
        },
        {
          kicker: "Benefits",
          title: "Rewards stay mastery-tied",
          body: "Family benefits connect to recall, transfer, and persistence so the system rewards learning rather than clicking.",
          tone: "gold",
          view: "experiments",
          action: "Rewards"
        }
      ]
    })}
    <section class="panel wide-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Parent command center</p>
          <h2>Household progress and interventions</h2>
        </div>
        <button class="secondary-button" data-reset>Reset local pilot data</button>
      </div>
      <div class="metric-grid">
        ${renderMetric("Average mastery", `${visibleSummary.averageMastery}%`, repositoryMastery.available ? "Scoped catalog evidence" : "Across pilot lessons")}
        ${renderMetric("Mastered", visibleSummary.mastered, "Ready for challenge")}
        ${renderMetric("Needs review", visibleSummary.needsReview, "Reteach recommended")}
        ${renderMetric("Phase evidence", repositoryMastery.phaseSignals, repositoryMastery.available ? "Scoped catalog" : "Awaiting repository read")}
        ${renderMetric("Attendance streak", `${summary.attendanceStreak} days`, "Learning consistency")}
        ${renderMetric("Consent", summary.consentReady ? "Ready" : "Blocked", `${summary.consentMissing} missing`)}
        ${renderMetric("Recall due", recallDueCount, repositoryRetentionRows.length ? `${retentionNeedsReteach} reteach` : "Retention schedule")}
        ${renderMetric("Joy", telemetry.averageJoy, "Affect check-ins")}
        ${renderMetric("Frustration", telemetry.averageFrustration, "Lower is better")}
        ${renderMetric("Tutor truth", repositoryTutor.available ? `${repositoryTutor.truthAverage}/5` : tutorQuality.truthReviewed ? `${tutorQuality.truthAverage}/5` : "n/a", repositoryTutor.available ? "Scoped tutor events" : "Fact-check score")}
        ${renderMetric("AI review", repositoryTutor.available ? repositoryTutor.needsTruthReview : tutorQuality.needsTruthReview, repositoryTutor.available ? "Scoped tutor events" : "Needs staff check")}
      </div>
    </section>

    ${renderParentLearnerInsights(learnerInsights)}
    ${renderParentEvidenceTimeline(learnerIds)}
    ${renderRewardApprovalPanel(learnerIds)}

    <section class="panel">
      <div class="section-head compact">
        <h2>Intervention queue</h2>
      </div>
      <p class="callout">${html(summary.nextIntervention)}</p>
      <div class="lesson-list compact-list">
        ${todayPlan
          .length
          ? todayPlan
              .map(
                (lesson) => `
              <button class="lesson-row" data-lesson="${lesson.id}" data-view="lesson">
                <span class="subject-chip ${html(lesson.subject)}">${html(lesson.grade)}</span>
                <span>
                  <strong>${html(lesson.title)}</strong>
                  <small>${html(lesson.mastery.evidence)}</small>
                </span>
                <span class="score">${lesson.mastery.score}%</span>
              </button>
            `
              )
              .join("")
          : `<div class="student-evidence-box muted-box">
              <strong>No intervention queue yet</strong>
              <p>Create a child account and complete a first lesson to generate reteach, challenge, and tutor recommendations.</p>
            </div>`}
      </div>
    </section>

    <section class="panel">
      <div class="section-head compact">
        <h2>Assignments</h2>
      </div>
      ${
        scopedAssignments.length
          ? scopedAssignments
              .map(
                (assignment) => `
            <div class="assignment-row">
              <strong>${html(assignment.title)}</strong>
              <span>${html(assignment.learner)} | ${html(assignment.due)}</span>
              <small>${html(assignment.status)}</small>
              ${assignment.source ? `<small>${html(assignment.source)}</small>` : ""}
            </div>
          `
              )
              .join("")
          : `<div class="student-evidence-box muted-box">
              <strong>No household assignments yet</strong>
              <p>Assignments will appear after a parent, teacher, or school admin assigns work to a linked child.</p>
            </div>`
      }
    </section>
  `);
}

function renderTeacherClassroomCommand() {
  const assignedClass = currentSession?.role === "teacher" && currentSession.teacherId
    ? (state.classSections || []).find((section) => section.teacherId === currentSession.teacherId)
    : null;
  const localMonitor = getTeacherClassMonitor(state, assignedClass?.id || "", {
    allowFallback: currentSession?.role !== "teacher"
  });
  const repositoryMonitor = getRepositoryClassroomMonitor(assignedClass?.id || "");
  const monitor = repositoryMonitor.monitor || localMonitor;
  const summary = getClassroomProductSummary(state);

  if (!monitor.classSection || !monitor.session || !monitor.lesson) {
    return `
      <section class="panel wide-panel teacher-classroom-command">
        <div class="section-head compact">
          <h2>School/Classroom Mode setup needed</h2>
        </div>
        <p class="callout">Create a class section, roster, and class session before a teacher can launch a school-ready learning block.</p>
      </section>
    `;
  }

  const repositoryLessonSignals = monitor.learners
    .map((item) => getRepositoryInteractiveSignalSummary({ learnerId: item.learner.id, lessonId: monitor.lesson.id, limit: 5 }))
    .reduce(
      (summary, learnerSignals) => ({
        total: summary.total + learnerSignals.total,
        secure: summary.secure + learnerSignals.secure,
        needsSupport: summary.needsSupport + learnerSignals.needsSupport,
        latest: summary.latest || learnerSignals.latest,
        signals: [...summary.signals, ...learnerSignals.signals],
        lessonCount: Math.max(summary.lessonCount, learnerSignals.lessonCount)
      }),
      { total: 0, secure: 0, needsSupport: 0, latest: null, signals: [], lessonCount: 0 }
    );
  const repositoryLessonQuizMastery = monitor.learners
    .map((item) => getRepositoryQuizMasterySummary({ learnerId: item.learner.id, lessonId: monitor.lesson.id, limit: 5 }))
    .reduce(
      (summary, learnerEvidence) => ({
        total: summary.total + learnerEvidence.total,
        quizAttempts: summary.quizAttempts + learnerEvidence.quizAttempts,
        quizPassed: summary.quizPassed + learnerEvidence.quizPassed,
        averageQuizScore: 0,
        masteryRecords: summary.masteryRecords + learnerEvidence.masteryRecords,
        mastered: summary.mastered + learnerEvidence.mastered,
        needsReview: summary.needsReview + learnerEvidence.needsReview,
        averageMasteryScore: 0,
        latest: summary.latest || learnerEvidence.latest,
        evidence: [...summary.evidence, ...learnerEvidence.evidence]
      }),
      {
        total: 0,
        quizAttempts: 0,
        quizPassed: 0,
        averageQuizScore: 0,
        masteryRecords: 0,
        mastered: 0,
        needsReview: 0,
        averageMasteryScore: 0,
        latest: null,
        evidence: []
      }
    );
  const repositoryTutorAggregate = monitor.learners
    .map((item) => getRepositoryTutorEventSummary(item.learner.id))
    .reduce(
      (summary, learnerTutor) => ({
        total: summary.total + learnerTutor.summary.total,
        helped: summary.helped + learnerTutor.summary.helped,
        feedback: summary.feedback + learnerTutor.summary.feedback,
        needsTruthReview: summary.needsTruthReview + learnerTutor.summary.needsTruthReview,
        latest: summary.latest || learnerTutor.latest
      }),
      { total: 0, helped: 0, feedback: 0, needsTruthReview: 0, latest: null }
    );
  const repositoryRewardAggregate = monitor.learners
    .map((item) => getRepositoryRewardApprovalSummary(item.learner.id))
    .reduce(
      (summary, learnerRewards) => ({
        total: summary.total + learnerRewards.summary.total,
        pending: summary.pending + learnerRewards.summary.pending,
        approved: summary.approved + learnerRewards.summary.approved,
        parentActionRequired: summary.parentActionRequired + learnerRewards.summary.parentActionRequired,
        latest: summary.latest || learnerRewards.latest
      }),
      { total: 0, pending: 0, approved: 0, parentActionRequired: 0, latest: null }
    );
  const repositoryAssignmentAggregate = monitor.learners
    .map((item) => getRepositoryAssignmentSummary(item.learner.id))
    .reduce(
      (summary, learnerAssignments) => ({
        total: summary.total + learnerAssignments.summary.total,
        open: summary.open + learnerAssignments.summary.open,
        completed: summary.completed + learnerAssignments.summary.completed
      }),
      { total: 0, open: 0, completed: 0 }
    );
  const repositoryRetentionAggregate = monitor.learners
    .map((item) => getRepositoryRetentionScheduleSummary(item.learner.id))
    .reduce(
      (summary, learnerRetention) => ({
        total: summary.total + learnerRetention.summary.total,
        due: summary.due + learnerRetention.summary.due,
        needsReteach: summary.needsReteach + learnerRetention.summary.needsReteach,
        durable: summary.durable + learnerRetention.summary.durable
      }),
      { total: 0, due: 0, needsReteach: 0, durable: 0 }
    );
  const repositoryPortfolioAggregate = monitor.learners
    .map((item) => getRepositoryPortfolioEvidenceSummary(item.learner.id))
    .reduce(
      (summary, learnerPortfolio) => ({
        portfolioItems: summary.portfolioItems + learnerPortfolio.summary.portfolioItems,
        badgesEarned: summary.badgesEarned + learnerPortfolio.summary.badgesEarned,
        masteryArtifacts: summary.masteryArtifacts + learnerPortfolio.summary.masteryArtifacts,
        latest: summary.latest || learnerPortfolio.latestPortfolioItem || learnerPortfolio.latestBadge
      }),
      { portfolioItems: 0, badgesEarned: 0, masteryArtifacts: 0, latest: null }
    );
  const repositoryClassroom = getRepositoryClassroomEvidenceSummary({
    classSessionId: monitor.session.id,
    lessonId: monitor.lesson.id
  });
  const repositoryPhaseAggregate = monitor.learners
    .map((item) => getRepositoryCatalogLesson(item.learner.id, monitor.lesson.id))
    .filter(Boolean)
    .reduce(
      (summary, lesson) => ({
        learners: summary.learners + (lesson.completedPhaseCount > 0 ? 1 : 0),
        phases: summary.phases + Number(lesson.completedPhaseCount || 0)
      }),
      { learners: 0, phases: 0 }
    );

  return `
    <section class="panel wide-panel teacher-classroom-command">
      <div class="section-head">
        <div>
          <p class="eyebrow">School/Classroom Mode</p>
          <h2>${html(monitor.classSection.name)} live command</h2>
        </div>
        <span class="status-pill">${html(monitor.session.status)}</span>
        <span class="status-pill" aria-label="repository monitor source">${html(repositoryMonitor.source)} monitor</span>
      </div>
      <div class="teacher-command-grid">
        <article class="class-launch-card">
          <span>${html(summary.implementationStage)}</span>
          <h3>${html(monitor.session.title)}</h3>
          <p>${html(monitor.session.launchGoal)}</p>
          <div class="classroom-meta-row">
            <span>${html(summary.schoolName)}</span>
            <span>${html(monitor.session.periodLabel)}</span>
            <span>${html(monitor.session.durationMinutes)} min</span>
          </div>
          <div class="hero-actions">
            <button class="primary-button" data-lesson="${html(monitor.lesson.id)}" data-view="lesson">Open live lesson</button>
            <button class="secondary-button" data-view="ai">Review tutor signals</button>
            <button class="secondary-button" data-view="admin">Review queue</button>
          </div>
          <div class="classroom-control-row">
            <button class="small-button" data-class-session-status="${html(monitor.session.id)}" data-status="Live">Launch</button>
            <button class="small-button" data-class-session-status="${html(monitor.session.id)}" data-status="Paused">Pause</button>
            <button class="small-button" data-class-session-status="${html(monitor.session.id)}" data-status="Completed">Complete</button>
          </div>
          ${renderClassroomActionResult()}
        </article>
        <article class="class-monitor-card">
          <h3>Live monitor</h3>
          <div class="metric-grid single">
            ${renderMetric("Enrolled", monitor.metrics.enrolled, "Students in class")}
            ${renderMetric("Needs help", monitor.metrics.needsHelp, "Confusion signals")}
            ${renderMetric("Mastered", monitor.metrics.mastered, "Met threshold")}
            ${renderMetric("Average", `${monitor.metrics.averageMastery}%`, "Class mastery")}
            ${renderMetric("Skill signals", repositoryLessonSignals.total, "Catalog evidence")}
            ${renderMetric("Catalog quizzes", repositoryLessonQuizMastery.quizAttempts, `${repositoryLessonQuizMastery.quizPassed} passed`)}
            ${renderMetric("Catalog mastery", repositoryLessonQuizMastery.mastered, `${repositoryLessonQuizMastery.needsReview} review`)}
            ${renderMetric("Nexus phases", repositoryPhaseAggregate.phases, `${repositoryPhaseAggregate.learners} learner(s) started`)}
            ${renderMetric("Tutor events", repositoryTutorAggregate.total, `${repositoryTutorAggregate.needsTruthReview} review`)}
            ${renderMetric("Reward reads", repositoryRewardAggregate.total, `${repositoryRewardAggregate.parentActionRequired} parent action`)}
            ${renderMetric("Assignments", repositoryAssignmentAggregate.open, `${repositoryAssignmentAggregate.total} read`)}
            ${renderMetric("Recall due", repositoryRetentionAggregate.due, `${repositoryRetentionAggregate.needsReteach} reteach`)}
            ${renderMetric("Portfolio", repositoryPortfolioAggregate.portfolioItems, `${repositoryPortfolioAggregate.badgesEarned} badge(s)`)}
            ${renderMetric("Class artifacts", repositoryClassroom.summary.submittedArtifacts, `${repositoryClassroom.summary.artifacts} repository row(s)`)}
            ${renderMetric("Interventions", repositoryClassroom.summary.openInterventions, `${repositoryClassroom.summary.interventions} repository row(s)`)}
          </div>
          <p class="form-note">${html(
            repositoryLessonSignals.latest
              ? `Latest learner-scoped repository signal: ${repositoryLessonSignals.latest.skillLabel} - ${repositoryLessonSignals.latest.status}.`
              : repositoryLessonQuizMastery.latest
                ? `Latest learner-scoped quiz/mastery evidence: ${repositoryLessonQuizMastery.latest.lessonTitle} quiz ${repositoryLessonQuizMastery.latest.quizScore}%, mastery ${repositoryLessonQuizMastery.latest.masteryScore}%.`
                : repositoryTutorAggregate.latest
                  ? `Latest learner-scoped tutor event: ${repositoryTutorAggregate.latest.modeTitle || repositoryTutorAggregate.latest.type || "Tutor event"}.`
                  : repositoryRewardAggregate.latest
                    ? `Latest learner-scoped reward read: ${repositoryRewardAggregate.latest.rewardTitle} ${rewardStatusLabel(repositoryRewardAggregate.latest.status)}.`
                    : repositoryPortfolioAggregate.latest
                      ? `Latest learner-scoped portfolio evidence: ${repositoryPortfolioAggregate.latest.title}.`
                      : repositoryClassroom.latestArtifact
                        ? `Latest repository classroom artifact: ${repositoryClassroom.latestArtifact.artifactTitle} (${repositoryClassroom.latestArtifact.artifactStatus}).`
                        : repositoryClassroom.latestIntervention
                          ? `Latest repository classroom intervention: ${repositoryClassroom.latestIntervention.interventionType} ${repositoryClassroom.latestIntervention.status}.`
                          : repositoryClassroom.error
                            ? `Classroom repository read failed: ${repositoryClassroom.error}`
                            : repositoryMonitor.error
                              ? `Classroom monitor repository read failed: ${repositoryMonitor.error}`
                              : repositoryPhaseAggregate.phases
                                ? `${repositoryPhaseAggregate.phases} learner phase-completion signal(s) are recorded for this live lesson.`
                                : "No learner-scoped repository skill, quiz, mastery, phase, tutor, reward, portfolio, artifact, or intervention signal has been read for this live lesson yet."
          )}</p>
        </article>
      </div>
      <div class="teacher-monitor-grid">
        <div class="classroom-roster-list">
          <h3>Student session state</h3>
          ${monitor.learners
            .map(
              (item) => `
                <article class="classroom-roster-row ${tokenClass(item.status)}">
                  <div>
                    <strong>${html(item.learner.name)}</strong>
                    <small>Grade ${html(item.learner.grade)} | ${html(item.currentStep)} | ${html(item.artifact?.artifactStatus || "no artifact")}</small>
                    <small>${html(item.adaptiveReteach?.diagnosisLabel ? `Targeted reteach: ${item.adaptiveReteach.diagnosisLabel} - ${item.adaptiveReteach.reteachMove}` : "No targeted reteach evidence yet.")}</small>
                    <small>${html(item.interactiveSkillEvidence?.[0] ? `Interactive: ${item.interactiveSkillEvidence[0].skillLabel} - ${item.interactiveSkillEvidence[0].status}` : "No interactive skill evidence yet.")}</small>
                    <small>${html(`${getRepositoryCatalogLesson(item.learner.id, monitor.lesson.id)?.completedPhaseCount || 0} Nexus phase(s) cleared from scoped catalog evidence.`)}</small>
                  </div>
                  <span>${html(item.status)}</span>
                  <b>${html(item.mastery.score || 0)}%</b>
                  ${
                    item.intervention
                      ? `<div class="intervention-outcome-actions">
                          <button class="small-button" data-intervention-outcome="${html(item.intervention.id)}" data-outcome="worked">Worked</button>
                          <button class="small-button muted-action" data-intervention-outcome="${html(item.intervention.id)}" data-outcome="needs-redesign">Needs redesign</button>
                        </div>`
                      : `<button class="small-button" data-record-intervention="${html(monitor.session.id)}" data-learner-id="${html(item.learner.id)}" data-targeted-reteach="${html(item.adaptiveReteach?.reteachMove || "")}">${item.adaptiveReteach?.diagnosisLabel ? "Assign targeted support" : "Intervene"}</button>`
                  }
                </article>
              `
            )
            .join("")}
        </div>
        <div class="confusion-heatmap">
          <h3>Confusion heatmap</h3>
          ${monitor.confusionHeatmap
            .map(
              (item) => `
                <article>
                  <span>${html(item.label)}</span>
                  <strong>${html(item.count)}</strong>
                </article>
              `
            )
            .join("")}
        </div>
        <div class="school-admin-readiness">
          <h3>School admin readiness</h3>
          ${monitor.adminReadiness
            .map(
              (item) => `
                <article>
                  <span>${html(item.label)}</span>
                  <strong>${html(item.status)}</strong>
                </article>
              `
            )
            .join("")}
        </div>
      </div>
      <div class="classroom-mission-strip">
        <span>Group mission</span>
        <strong>${html(monitor.mission?.title || "No mission assigned")}</strong>
        <p>${html(monitor.mission?.teacherLookFor || "Teacher confirms each learner has individual evidence before mastery credit.")}</p>
      </div>
      ${
        monitor.mission
          ? `<form class="classroom-mission-form" data-classroom-mission="${html(monitor.mission.id)}">
              <div class="section-head compact">
                <h3>Edit group mission</h3>
                <span class="form-note">Changes are saved to the classroom repository.</span>
              </div>
              <div class="school-setup-grid">
                <label>Mission title<input name="title" required minlength="8" value="${html(monitor.mission.title || "")}" /></label>
                <label>Group size<input name="groupSize" type="number" min="2" max="8" value="${html(monitor.mission.groupSize || 3)}" /></label>
                <label>Shared artifact<input name="sharedArtifact" required minlength="8" value="${html(monitor.mission.sharedArtifact || "")}" /></label>
                <label>Student roles<input name="roleLabels" value="${html((monitor.mission.roleLabels || []).join(", "))}" /></label>
                <label>Individual evidence<textarea name="individualEvidence" rows="3" required minlength="12">${html(monitor.mission.individualEvidence || "")}</textarea></label>
                <label>Teacher look-for<textarea name="teacherLookFor" rows="3" required minlength="12">${html(monitor.mission.teacherLookFor || "")}</textarea></label>
              </div>
              <button class="secondary-button" type="submit">Save mission</button>
            </form>`
          : ""
      }
    </section>
  `;
}

function renderSchoolActionResult() {
  if (!lastSchoolResult) return "";
  return `
    <div class="batch-result classroom-action-result ${lastSchoolResult.accepted === false ? "failed" : "passed"}">
      <strong>${lastSchoolResult.accepted === false ? "School setup needs attention" : "School setup saved"}</strong>
      <span>${html(lastSchoolResult.summary || lastSchoolResult.reason || "School setup updated.")}</span>
    </div>
  `;
}

function renderSchoolSetupPanel() {
  const schoolOps = getRepositorySchoolOperationsSummary();
  const gradeOptions = ["K", ...Array.from({ length: 12 }, (_, index) => String(index + 1))];
  const teacherOptionsById = new Map();
  if (currentSession?.role === "teacher" && currentSession.teacherId) {
    teacherOptionsById.set(currentSession.teacherId, { id: currentSession.teacherId, name: currentSession.displayName || "Signed-in teacher" });
  }
  for (const teacher of schoolOps.teachers || []) {
    teacherOptionsById.set(teacher.id, { id: teacher.id, name: teacher.name || "Teacher" });
  }
  for (const account of state.localAccounts || []) {
    if (account.role === "teacher" && account.teacherId) {
      teacherOptionsById.set(account.teacherId, { id: account.teacherId, name: account.displayName || "Teacher" });
    }
  }
  if (!teacherOptionsById.size) {
    teacherOptionsById.set("teacher-demo-1", { id: "teacher-demo-1", name: "Pilot Teacher (demo fallback)" });
  }
  const teacherOptions = [...teacherOptionsById.values()];
  const selectedTeacherId = currentSession?.role === "teacher" && currentSession.teacherId ? currentSession.teacherId : teacherOptions[0]?.id || "teacher-demo-1";
  const classes = schoolOps.classes || [];
  const learners = schoolOps.learners || [];
  return `
    <section class="panel wide-panel school-setup-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">School setup</p>
          <h2>Create the class students will attend</h2>
        </div>
        <span class="status-pill">Admin action</span>
      </div>
      <p class="callout">Create a section, assign a teacher, then enroll learners. A class can launch a session once its roster and lesson path are ready. This panel is reading roster options from ${html(schoolOps.source)}.</p>
      <div class="school-setup-grid">
        <form class="school-class-form">
          <label>Class name<input name="name" required placeholder="Grade 6 Earth Systems" /></label>
          <label>Grade<select name="grade">${gradeOptions.map((grade) => `<option value="${grade}" ${grade === "6" ? "selected" : ""}>${grade === "K" ? "Kindergarten" : `Grade ${grade}`}</option>`).join("")}</select></label>
          <label>Subject<select name="subject">
            ${[
              ["ela", "English Language Arts"],
              ["writing", "Writing"],
              ["math", "Math"],
              ["science", "Science"],
              ["social-studies", "Social Studies"],
              ["health-pe", "Health and PE"],
              ["arts-media", "Arts and Music"],
              ["computer-science", "Computer Science"],
              ["life-skills", "Life Skills"],
              ["career-college", "Career and College Readiness"]
            ].map(([value, label]) => `<option value="${value}" ${value === "science" ? "selected" : ""}>${label}</option>`).join("")}
          </select></label>
          <label>Teacher<select name="teacherId">${teacherOptions.map((teacher) => `<option value="${html(teacher.id)}" ${teacher.id === selectedTeacherId ? "selected" : ""}>${html(teacher.name)}</option>`).join("")}</select></label>
          <label>Schedule<input name="schedule" placeholder="Period 2 | Mon-Thu | 50 min" /></label>
          <button class="primary-button" type="submit">Create class section</button>
        </form>
        <form class="school-enrollment-form">
          <label>Class section<select name="classSectionId" ${classes.length ? "" : "disabled"}>
            ${classes.length ? classes.map((section) => `<option value="${html(section.id)}">${html(section.name)} | Grade ${html(section.grade)}</option>`).join("") : `<option>No classes yet</option>`}
          </select></label>
          <label>Learner<select name="learnerId" ${learners.length && classes.length ? "" : "disabled"}>
            ${learners.length ? learners.map((learner) => `<option value="${html(learner.id)}">${html(learner.name)} | Grade ${html(learner.grade)}</option>`).join("") : `<option>No learners yet</option>`}
          </select></label>
          <p class="form-note">Enrollment gives the learner a class scope. The student still signs in with their own child account.</p>
          <button class="secondary-button" type="submit" ${classes.length && learners.length ? "" : "disabled"}>Enroll learner</button>
        </form>
      </div>
      <div class="school-roster-tools">
        <form class="school-roster-import-form">
          <label>Import CSV roster
            <textarea name="csv" rows="6" required placeholder="display_name,grade,class_id,student_id,username,email\nJordan Lee,6,class-bridge-science-6a,jordan-lee,jordanlee,jordan@example.edu"></textarea>
          </label>
          <small class="form-note">Required: display_name, grade, class_id. Optional: student_id, username, email, accommodations. New learners receive a pending invitation and no password is stored.</small>
          <button class="primary-button" type="submit">Validate and import roster</button>
        </form>
        <article class="school-roster-export-card">
          <span class="learning-signal">Administration</span>
          <h3>Export current roster</h3>
          <p>Download the school-scoped class roster for review, records, or the next import cycle.</p>
          <button class="secondary-button" type="button" data-school-roster-export>Download roster CSV</button>
        </article>
      </div>
      ${renderSchoolActionResult()}
    </section>
  `;
}

function renderSchoolAdminView() {
  const schoolOps = getRepositorySchoolOperationsSummary();
  const localMonitor = getTeacherClassMonitor(state);
  const repositoryMonitor = getRepositoryClassroomMonitor();
  const monitor = repositoryMonitor.monitor || localMonitor;
  const summary = getClassroomProductSummary(state);
  const migration = getPlatformMigrationReadiness();
  const authSummary = getAuthSecuritySummary(state);
  const repository = getPlatformRepositoryAccessSummary();
  const classSection = monitor.classSection || {};
  const schoolName = schoolOps.school?.name || summary.schoolName || "School pilot";
  const repositoryRosterLearners = schoolOps.learners || [];

  return renderShell(`
    ${renderRoleHero({
      role: "school",
      eyebrow: "School admin page",
      title: `${schoolName} operations`,
      body: "School admins manage the product as a real class program: roster readiness, teacher assignments, class sessions, implementation status, reports, privacy gates, and pilot evidence.",
      primaryAction: { label: "Open live class", view: "teacher" },
      secondaryAction: { label: "Review admin gates", view: "admin" },
      stats: [
        { label: "Classes", value: schoolOps.summary.classes || summary.classCount, detail: `${schoolOps.source} sections` },
        { label: "Students", value: schoolOps.summary.enrolledStudents || summary.enrolledStudents, detail: "Enrolled learners" },
        { label: "Sessions", value: summary.activeSessions, detail: "Class blocks" }
      ]
    })}

    <section class="panel wide-panel school-ops-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">School/Classroom product</p>
          <h2>Bridge Academy pilot readiness</h2>
        </div>
        <span class="status-pill">${summary.bridgeClassReady ? "Pilot ready" : "Needs setup"}</span>
      </div>
      <div class="school-command-grid">
        <article class="school-profile-card">
          <span>${html(schoolOps.school?.implementationStage || summary.implementationStage)}</span>
          <h3>${html(schoolOps.school?.pilotFocus || summary.pilotFocus)}</h3>
          <p>Package this as a school class students attend: teacher launch, app-led instruction, visual mini-lesson, tutor confusion check, group mission, mastery check, and school reporting.</p>
          <div class="classroom-meta-row">
            <span>${html(classSection.name || "No class configured")}</span>
            <span>${html(classSection.schedule || "No schedule")}</span>
            <span>${html(monitor.session?.status || "No session")}</span>
          </div>
        </article>
        <article class="school-report-card">
          <div class="section-head compact">
            <h3>School report snapshot</h3>
            <button class="secondary-button" type="button" data-school-reports-export>Download reports</button>
          </div>
          <div class="metric-grid single">
            ${renderMetric("Average mastery", `${monitor.metrics.averageMastery}%`, "Class session")}
            ${renderMetric("Needs help", monitor.metrics.needsHelp, "Teacher intervention")}
            ${renderMetric("Group missions", summary.groupMissions, "Collaborative tasks")}
            ${renderMetric("Tables", migration.tableCount, "Production schema")}
            ${renderMetric("Roster source", schoolOps.source === "repository" ? "Repository" : "Local", `${schoolOps.summary.pendingInvitations} pending invite(s)`)}
          </div>
          ${schoolOps.error ? `<p class="form-note">${html(`School repository read failed: ${schoolOps.error}`)}</p>` : ""}
          ${
            schoolOps.reports.length
              ? `<div class="report-list" aria-label="Persisted school reports">
                  ${schoolOps.reports.slice(0, 4).map((report) => `
                    <article class="report-list-item">
                      <strong>${html(report.reportType || "Class progress snapshot")}</strong>
                      <span>${html(report.summary || "Report summary unavailable")}</span>
                      <small>${html(`${report.metrics?.averageMastery || 0}% mastery · ${report.metrics?.needsHelp || 0} needs support`)}</small>
                    </article>
                  `).join("")}
                </div>`
              : `<p class="form-note">No persisted report snapshots yet. Complete a class session or roster action to generate the first scoped report.</p>`
          }
        </article>
      </div>
    </section>

    <section class="panel wide-panel school-readiness-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Launch checklist</p>
          <h2>What a school needs before pilot launch</h2>
        </div>
        <span class="status-pill">${monitor.adminReadiness.filter((item) => item.status === "Ready").length}/${monitor.adminReadiness.length} ready</span>
      </div>
      <div class="school-readiness-grid">
        ${monitor.adminReadiness
          .map(
            (item) => `
              <article>
                <span>${html(item.label)}</span>
                <strong>${html(item.status)}</strong>
              </article>
            `
          )
          .join("")}
        <article>
          <span>Role claims</span>
          <strong>${authSummary.accountCount ? "Accounts exist" : "Dev fallback"}</strong>
        </article>
        <article>
          <span>Repository</span>
          <strong>${repository.blockedStudentExternalOps ? "Student-safe" : "Review needed"}</strong>
        </article>
        <article>
          <span>Database</span>
          <strong>${migration.ready ? "Migration ready" : "Migration gaps"}</strong>
        </article>
      </div>
    </section>

    ${renderSchoolSetupPanel()}

    <section class="panel school-roster-panel">
      <div class="section-head compact">
        <h2>Roster and class scope</h2>
      </div>
      <div class="classroom-roster-list">
        ${
          repositoryRosterLearners.length
            ? repositoryRosterLearners
                .map(
                  (learner) => `
              <article class="classroom-roster-row ${tokenClass(learner.status)}">
                <div>
                  <strong>${html(learner.name)}</strong>
                  <small>Grade ${html(learner.grade)} | ${html(learner.status)} | Repository roster</small>
                </div>
                <span>${html(learner.academyId || "academy")}</span>
                <b>${html(learner.grade || "")}</b>
              </article>
            `
                )
                .join("")
            : monitor.learners
          .map(
            (item) => `
              <article class="classroom-roster-row ${tokenClass(item.status)}">
                <div>
                  <strong>${html(item.learner.name)}</strong>
                  <small>Grade ${html(item.learner.grade)} | ${html(item.tutorSignal)}</small>
                </div>
                <span>${html(item.status)}</span>
                <b>${html(item.mastery.score || 0)}%</b>
              </article>
            `
          )
          .join("")
        }
      </div>
    </section>

    <section class="panel school-roster-panel">
      <div class="section-head compact">
        <h2>Implementation package</h2>
      </div>
      <div class="school-package-list">
        ${[
          ["Teacher guide", "Launch class, monitor confusion, assign reteach/challenge, and run group missions."],
          ["Student guide", "Sign in, attend class, write stuck points, complete exit tickets, and earn XP."],
          ["Parent letter", "Explain data use, tutor visibility, rewards, and school/home support."],
          ["Admin checklist", "Roster import, teacher assignments, reporting exports, FERPA/COPPA review, and accessibility checks."]
        ]
          .map(
            ([title, body]) => `
              <article>
                <strong>${html(title)}</strong>
                <p>${html(body)}</p>
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    ${renderTeacherClassroomCommand()}
  `);
}

function renderTeacherView() {
  const assignedLearners = learnersForCurrentSession();
  const teacherLearners = currentSession?.role === "teacher" ? assignedLearners : assignedLearners.length ? assignedLearners : state.learners;
  const todayPlan =
    currentSession?.role === "teacher"
      ? getTodayPlan(state, { learnerIds: assignedLearners.map((learner) => learner.id), strictLearnerScope: true })
      : assignedLearners.length
        ? getTodayPlan(state, { learnerIds: assignedLearners.map((learner) => learner.id) })
        : getTodayPlan(state);
  const tutorQuality = getTutorQualityDashboard(state);
  const visualAudit = getVisualLearningAgentAudit(state);
  const authoring = getContentAuthoringSummary(state);
  const improvementQueue = getTutorImprovementQueue(state);
  const classAverage = Math.round(
    teacherLearners.reduce((sum, learner) => {
      const snapshot = learnerMasterySnapshot(learner);
      return sum + Number(snapshot.mastery.score || 0);
    }, 0) / Math.max(1, teacherLearners.length)
  );
  const groupLessons = todayPlan.filter((lesson) => lesson.groupHomework);

  return renderShell(`
    ${renderRoleHero({
      role: "teacher",
      eyebrow: "Teacher page",
      title: "Classroom teaching studio",
      body: "Teachers get a command surface for assigned learners, lesson readiness, misconception patterns, group work, tutor quality, and intervention decisions.",
      primaryAction: { label: "Open curriculum", view: "curriculum" },
      secondaryAction: { label: "Review tools", view: "tools" },
      stats: [
        { label: "Class mastery", value: `${classAverage}%`, detail: `${teacherLearners.length} assigned learners` },
        { label: "Visual needs", value: visualAudit.highPriority, detail: "High-priority diagrams" },
        { label: "Tutor review", value: tutorQuality.needsTruthReview, detail: "Need fact-check" }
      ]
    })}

    ${renderTeacherClassroomCommand()}

    ${renderExperienceSwitchboard({
      eyebrow: "Teacher screens",
      title: "Instruction, evidence, visuals, and review in one workflow",
      items: [
        {
          kicker: "Diagnose",
          title: "Misconception triage",
          body: "Common misunderstanding cards turn student confusion into a reteach move, visual request, or first-principles prompt.",
          tone: "coral"
        },
        {
          kicker: "Collaborate",
          title: "Group homework roles",
          body: "Bridge and Scholar assignments include defined team roles, shared artifacts, and individual accountability.",
          tone: "green"
        },
        {
          kicker: "Visuals",
          title: "Diagram request queue",
          body: "Teachers can review visual opportunities before generated assets or diagrams move into student-facing lessons.",
          tone: "blue",
          view: "visuals",
          action: "Visuals"
        },
        {
          kicker: "Truth",
          title: "Tutor quality review",
          body: "The truth policy agent scores explanation accuracy, reasoning quality, and whether the response actually addressed the confusion.",
          tone: "gold",
          view: "ai",
          action: "AI audit"
        }
      ]
    })}

    <section class="panel wide-panel teacher-roster-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Teacher roster</p>
          <h2>Assigned learners and next teaching move</h2>
        </div>
        <span class="status-pill">${teacherLearners.length} learners</span>
      </div>
      <div class="teacher-roster-grid">
        ${
          teacherLearners.length
            ? teacherLearners
                .map((learner) => {
            const academy = findAcademy(learner.academyId);
            const snapshot = learnerMasterySnapshot(learner);
            return `
              <article class="teacher-learner-card">
                <div class="teacher-learner-topline">
                  <span class="range-badge">${html(academy.range)}</span>
                  <strong>${html(snapshot.mastery.score)}%</strong>
                </div>
                <h3>${html(learner.name)}</h3>
                <p>Grade ${html(learner.grade)} | ${html(learner.schedule)}</p>
                <small>${html(`${snapshot.masterySource} | ${snapshot.phaseCompletions.length} Nexus phase(s) cleared`)}</small>
                <small>${html(snapshot.placement?.supportPlan || "Run placement to build a support plan.")}</small>
                <small>${html(snapshot.tutorEvidence.latestQualified ? `Tutor stuck point: ${snapshot.tutorEvidence.latestQualified.label}` : "No diagnosed tutor reflection for this lesson yet.")}</small>
                <div class="mini-progress" aria-label="${html(`${learner.name} mastery ${snapshot.mastery.score}%`)}">
                  <span style="width: ${Math.min(100, Number(snapshot.mastery.score || 0))}%"></span>
                </div>
                <button class="small-button" data-lesson="${html(snapshot.lesson?.id || currentLesson().id)}" data-view="lesson">Open assigned lesson</button>
              </article>
            `;
                })
                .join("")
            : `<div class="student-evidence-box muted-box">
                <strong>No learners assigned yet</strong>
                <p>Create or assign a class roster before this teacher page shows student progress, intervention signals, and live lesson moves.</p>
                <button class="small-button" data-view="school">Set up roster</button>
              </div>`
        }
      </div>
    </section>

    <section class="panel teacher-planning-panel">
      <div class="section-head compact">
        <h2>Misconception triage</h2>
      </div>
      <div class="misconception-board">
        ${
          todayPlan.length
            ? todayPlan
                .slice(0, 4)
                .map((lesson) => {
            const support = getLessonTeachingSupport(lesson.id, state);
            const firstMisunderstanding = support.commonMisunderstandings[0];
            return `
              <article>
                <span class="subject-chip ${html(lesson.subject)}">${html(lesson.grade)}</span>
                <h3>${html(lesson.title)}</h3>
                <p>${html(firstMisunderstanding?.mistake || "No misconception logged yet.")}</p>
                <small>${html(firstMisunderstanding?.fix || support.confusionPrompt)}</small>
              </article>
            `;
                })
                .join("")
            : `<p class="muted">No assigned learner path yet. Import or assign a class roster to generate misconception triage.</p>`
        }
      </div>
    </section>

    <section class="panel teacher-planning-panel">
      <div class="section-head compact">
        <h2>Group homework studio</h2>
      </div>
      <div class="group-work-list">
        ${groupLessons.length
          ? groupLessons
              .map(
                (lesson) => `
                  <article>
                    <span class="subject-chip ${html(lesson.subject)}">${html(lesson.grade)}</span>
                    <h3>${html(lesson.groupHomework.title)}</h3>
                    <p>${html(lesson.groupHomework.sharedOutcome)}</p>
                    <small>${html(lesson.groupHomework.roles.join(", "))}</small>
                  </article>
                `
              )
              .join("")
          : `<p class="muted">No group homework in today's child path. Bridge and Scholar lessons should add structured team roles.</p>`}
      </div>
    </section>

    <section class="panel wide-panel teacher-ops-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Teacher operations</p>
          <h2>Lesson quality, tutor quality, and review work</h2>
        </div>
        <span class="status-pill">${authoring.review} in review</span>
      </div>
      <div class="metric-grid">
        ${renderMetric("Drafts", authoring.total, "Content pipeline")}
        ${renderMetric("Evidence ready", authoring.evidenceReady, "Can publish")}
        ${renderMetric("Visual assets", visualAudit.totalSlots, "Needed slots")}
        ${renderMetric("High-priority visuals", visualAudit.highPriority, "Lesson/tutor support")}
        ${renderMetric("Tutor turns", tutorQuality.totalInteractions, "Student questions")}
        ${renderMetric("Still confused", tutorQuality.stillConfused, "Needs redesign")}
        ${renderMetric("Truth queue", tutorQuality.needsTruthReview, "Fact-check")}
        ${renderMetric("Redesign signals", improvementQueue.needsRedesign, "Fun agent work")}
      </div>
    </section>

    <aside class="panel side-panel">
      <div class="section-head compact">
        <h2>Teacher actions</h2>
      </div>
      <div class="teacher-action-list">
        <button class="secondary-button" data-view="admin">Review drafts</button>
        <button class="secondary-button" data-view="visuals">Review visuals</button>
        <button class="secondary-button" data-view="ai">Audit tutor</button>
        <button class="secondary-button" data-view="experiments">Check retention data</button>
      </div>
    </aside>
  `);
}

function renderExperimentsView() {
  const dashboard = getExperimentDashboard(state);
  const telemetry = getLearningTelemetry(state);

  return renderShell(`
    <section class="panel wide-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Trial-and-error engine</p>
          <h2>Experiments, recall, rewards, and affect signals</h2>
        </div>
        <button class="secondary-button" data-add-experiment>Record learning-lab run</button>
      </div>
      <div class="metric-grid">
        ${renderMetric("Immediate", `${dashboard.averages.immediateScore}%`, "Average score")}
        ${renderMetric("24h recall", `${dashboard.averages.recall24h}%`, "Delayed evidence")}
        ${renderMetric("7d recall", `${dashboard.averages.recall7d}%`, dashboard.bestSignal)}
        ${renderMetric("Learning events", telemetry.eventCount, "Logged locally")}
        ${renderMetric("Benefits", telemetry.benefitCount, "Mastery-tied")}
        ${renderMetric("Joy", telemetry.averageJoy, "1-5")}
        ${renderMetric("Frustration", telemetry.averageFrustration, "1-5")}
        ${renderMetric("Independence", telemetry.averageIndependence, "1-5")}
      </div>
    </section>

    <section class="panel">
      <div class="section-head compact">
        <h2>Experiment templates</h2>
      </div>
      <div class="experiment-list">
        ${experimentTemplates
          .map(
            (template) => `
              <article>
                <h3>${html(template.title)}</h3>
                <p>${html(template.hypothesis)}</p>
                <small>${html(template.variantA)} vs ${html(template.variantB)} | ${html(template.targetMetric)}</small>
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    <section class="panel">
      <div class="section-head compact">
        <h2>Recall schedule</h2>
      </div>
      <div class="recall-list">
        ${(state.retentionSchedules || [])
          .map(
            (recall) => `
              <article>
                <strong>${html(recall.skillTag)}</strong>
                <span>${html(recall.nextRecall)}</span>
                <small>${recall.currentMastery}% | ${html(recall.lastResult)}</small>
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    <section class="panel wide-panel">
      <div class="section-head compact">
        <h2>Recent experiment runs</h2>
      </div>
      <div class="run-table" role="table" aria-label="Experiment runs">
        <div role="row" class="run-row header">
          <span>Variant</span>
          <span>Immediate</span>
          <span>24h</span>
          <span>7d</span>
          <span>Joy</span>
          <span>Decision</span>
        </div>
        ${dashboard.runs
          .map(
            (run) => `
              <div role="row" class="run-row">
                <span>${html(run.variant)}</span>
                <span>${run.immediateScore}%</span>
                <span>${run.recall24h}%</span>
                <span>${run.recall7d}%</span>
                <span>${run.joy}/5</span>
                <span>${html(run.decision)}</span>
              </div>
            `
          )
          .join("")}
      </div>
    </section>
  `);
}

function renderAdminView() {
  const pipelineStats = getPipelineStats();
  const readiness = getReadinessChecklist();
  const authoring = getContentAuthoringSummary(state);
  const publishedLessonSummary = getPublishedLessonSummary(state);
  const evidenceSummary = getEvidenceGuidanceSummary();
  const visualSummary = repositoryVisualAssets?.summary || getVisualAssetSummary(state);
  const viewContract = getAppViewContractSummary();

  return renderShell(`
    <section class="panel wide-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Content operations</p>
          <h2>Draft, review, publish, and scale</h2>
        </div>
        <span class="status-pill">${pipelineStats.gates} review gates</span>
      </div>
      <div class="pipeline">
        ${contentPipeline
          .map(
            (stage, index) => `
              <article class="pipeline-stage">
                <span>${String(index + 1).padStart(2, "0")}</span>
                <h3>${html(stage.stage)}</h3>
                <p>${html(stage.output)}</p>
                <small>${html(stage.status)}</small>
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    <section class="panel">
      <div class="section-head compact">
        <h2>Launch gates</h2>
      </div>
      <ul class="check-list">
        ${qualityGates.map((gate) => `<li>${html(gate)}</li>`).join("")}
      </ul>
    </section>

    <section class="panel">
      <div class="section-head compact">
        <h2>Readiness checks</h2>
      </div>
      <div class="readiness-list">
        ${readiness
          .map(
            (item) => `
              <div class="readiness-row ${item.passed ? "passed" : "failed"}">
                <span>${item.passed ? "Pass" : "Check"}</span>
                <strong>${html(item.label)}</strong>
              </div>
            `
          )
          .join("")}
      </div>
    </section>

    ${renderProductCompletenessPanel({ compact: true })}

    ${renderRuntimeConfigurationPanel()}

    <section class="panel">
      <div class="section-head compact">
        <h2>View contract</h2>
      </div>
      <div class="metric-grid single">
        ${renderMetric("Views", viewContract.totalViews, `${viewContract.roleViews} role homes`)}
        ${renderMetric("Contract", viewContract.passed ? "Pass" : "Check", "Navigation and access rules")}
      </div>
      <div class="readiness-list">
        <div class="readiness-row ${viewContract.duplicateIds.length ? "failed" : "passed"}">
          <span>${viewContract.duplicateIds.length ? "Fix" : "Pass"}</span>
          <strong>Unique view IDs</strong>
        </div>
        <div class="readiness-row ${viewContract.allowedUnknownViews.length ? "failed" : "passed"}">
          <span>${viewContract.allowedUnknownViews.length ? "Fix" : "Pass"}</span>
          <strong>Access rules reference real views</strong>
        </div>
        <div class="readiness-row ${viewContract.missingLabels.length ? "failed" : "passed"}">
          <span>${viewContract.missingLabels.length ? "Fix" : "Pass"}</span>
          <strong>Every view has label, icon, and purpose</strong>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="section-head compact">
        <h2>Evidence gate</h2>
      </div>
      <div class="metric-grid single">
        ${renderMetric("Audited sources", evidenceSummary.sourceCount, "EEF and WWC")}
        ${renderMetric("Teaching rules", evidenceSummary.recommendationCount, "Mapped to app requirements")}
        ${renderMetric("Math audit", evidenceSummary.requiredMoveCount, "Required moves")}
      </div>
      <p class="callout">Math content cannot be considered publication-ready until assessment, representations, problem solving, metacognition, intervention, transition, and feedback moves are present.</p>
    </section>

    <section class="panel wide-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Authoring system</p>
          <h2>Grade 3 pilot lesson drafts</h2>
        </div>
        <span class="status-pill">${authoring.grade3Core} core drafts</span>
      </div>
      <div class="metric-grid">
        ${renderMetric("Total drafts", authoring.total, "Server persisted")}
        ${renderMetric("Draft", authoring.draft, "Needs writing")}
        ${renderMetric("Review", authoring.review, "Academic/safety check")}
        ${renderMetric("Published", authoring.published, "Student-ready")}
        ${renderMetric("Lesson records", publishedLessonSummary.total, "Drafts converted")}
        ${renderMetric("Record visuals", publishedLessonSummary.withVisualSupports, "Student/tutor supports")}
        ${renderMetric("Record quizzes", publishedLessonSummary.withQuiz, "Mastery checks")}
        ${renderMetric("Math drafts", authoring.mathDrafts, "Evidence gate applies")}
        ${renderMetric("Evidence ready", authoring.evidenceReady, "Can publish")}
        ${renderMetric("Evidence blocked", authoring.evidenceBlocked, "Needs required moves")}
        ${renderMetric("Lesson bodies", authoring.lessonBodyReady, "Rich anatomy ready")}
        ${renderMetric("Body gaps", authoring.lessonBodyBlocked, "Needs teaching details")}
        ${renderMetric("Visual supports", authoring.visualSupportReady, "Diagram/tutor-ready")}
        ${renderMetric("Misconceptions", authoring.misconceptionReady, "Repair moves")}
        ${renderMetric("Source cards", authoring.sourceCardReady, "Grounded claims")}
        ${renderMetric("Truth reviewed", authoring.truthReviewed, "Approved drafts")}
        ${renderMetric("Truth blocked", authoring.truthBlocked, "Needs fact-check")}
        ${renderMetric("Source checks", authoring.externalResearchNeeded, "External research")}
        ${renderMetric("Batch imports", authoring.importJobs, "Generated lesson jobs")}
        ${renderMetric("Accepted imports", authoring.importsAccepted, "Drafts created")}
        ${renderMetric("Rejected imports", authoring.importsRejected, "No drafts created")}
        ${renderMetric("Visual assets", visualSummary.total, "Generated previews")}
        ${renderMetric("Visual review", visualSummary.review, "Needs approval")}
        ${renderMetric("Visual approved", visualSummary.approved, "Publish-ready")}
      </div>
      <form class="author-form" id="draftForm">
        <label>
          Subject
          <select name="subject">
            <option value="ela">ELA</option>
            <option value="math">Math</option>
            <option value="science">Science</option>
            <option value="social-studies">Social Studies</option>
          </select>
        </label>
        <label>
          Lesson title
          <input name="title" placeholder="Example: Compare fractions with movement" required />
        </label>
        <label class="span-2">
          Objective
          <textarea name="objective" rows="3" placeholder="Student will..." required></textarea>
        </label>
        <label class="span-2">
          Review notes
          <textarea name="reviewNotes" rows="2" placeholder="Materials, safety, licensing, accessibility, or parent notes"></textarea>
        </label>
        <label class="span-2">
          Accessibility notes
          <textarea name="accessibilityNotes" rows="2" placeholder="Alt text, read-aloud, contrast, keyboard support, or tactile options"></textarea>
        </label>
        <label class="span-2">
          Age-fit notes
          <textarea name="ageFitNotes" rows="2" placeholder="Why the language, task length, visuals, and independence level fit this grade"></textarea>
        </label>
        ${renderLessonBodyAuthorFields()}
        ${renderEvidenceAuthorFields()}
        <button class="primary-button" type="submit">Create draft</button>
      </form>
      <form class="batch-import-form" id="batchImportForm">
        <div class="section-head compact">
          <div>
            <p class="eyebrow">Batch import</p>
            <h3>Validate generated lessons before drafts are created</h3>
          </div>
          <span class="status-pill">All or nothing</span>
        </div>
        <label>
          Lesson batch JSON
          <textarea name="batchJson" rows="12">${html(getBatchImportSample())}</textarea>
        </label>
        <div class="button-group">
          <button class="primary-button" type="submit">Validate and import batch</button>
        </div>
        ${renderBatchImportResult()}
        <div class="import-job-list">
          ${(state.contentImportJobs || [])
            .slice(0, 5)
            .map(
              (job) => `
                <article class="import-job ${html(job.status)}">
                  <strong>${html(job.status)} | ${job.imported}/${job.total} imported</strong>
                  <small>${html(job.importedAt || "")}</small>
                  ${
                    job.errors?.length
                      ? `<small>${html(job.errors.map((error) => `${error.path}: ${error.message}`).join(" "))}</small>`
                      : ""
                  }
                  ${
                    job.warnings?.length
                      ? `<small>${html(job.warnings.map((warning) => `${warning.path}: ${warning.message}`).join(" "))}</small>`
                      : ""
                  }
                </article>
              `
            )
            .join("")}
        </div>
      </form>
      ${renderBridgeBatchPublicationPanel()}
      <div class="draft-list">
        ${(state.contentDrafts || [])
          .map(
            (draft) => `
              <article class="draft-card">
                <div>
                  <span class="subject-chip ${html(draft.subject)}">${html(draft.subject.replace("-", " "))}</span>
                  <h3>${html(draft.title)}</h3>
                  <p>${html(draft.objective)}</p>
                  <small>${html(draft.reviewNotes || "No review notes yet.")}</small>
                  ${renderDraftEvidenceStatus(draft)}
                </div>
                <div class="draft-actions">
                  <span class="status-pill">${html(draft.status)}</span>
                  <button class="small-button" data-draft-status="${html(draft.id)}" data-status="review">Send to review</button>
                  <button class="small-button" data-draft-status="${html(draft.id)}" data-status="published" ${draftPublishDisabled(draft) ? "disabled" : ""}>Publish</button>
                </div>
              </article>
            `
          )
          .join("")}
      </div>
      <div class="published-lesson-records">
        <div class="section-head compact">
          <div>
            <p class="eyebrow">Published lesson records</p>
            <h3>Drafts converted into curriculum rows</h3>
          </div>
          <span class="status-pill">${publishedLessonSummary.total} record(s)</span>
        </div>
        ${renderPublishedLessonRecords()}
      </div>
    </section>

    <section class="panel wide-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Visual asset review</p>
          <h2>Generated lesson visuals waiting for approval</h2>
        </div>
        <span class="status-pill">${visualSummary.review} in review</span>
      </div>
      ${renderVisualAssetReview()}
    </section>

    ${renderProductionDataModelPanel()}

    <section class="panel wide-panel">
      <div class="section-head compact">
        <h2>Production architecture path</h2>
      </div>
      <p>${html(productionArchitecture.currentPrototype)}</p>
      <p><strong>Target:</strong> ${html(productionArchitecture.targetStack)}</p>
      <div class="module-grid">
        ${productionArchitecture.modules.map((module) => `<span>${html(module)}</span>`).join("")}
      </div>
    </section>
  `);
}

function renderAiView() {
  const lesson = currentLesson();
  const learner = currentLearner();
  const support = getLessonTeachingSupport(lesson.id, state);
  const scopedTutorEvents = getRepositoryTutorEventSummary(learner.id);
  const scopedLocalLogs = (state.aiLogs || []).filter((log) => !log.learnerId || log.learnerId === learner.id);
  const aiLogList = scopedTutorEvents.events.length ? scopedTutorEvents.events : scopedLocalLogs;
  const aiLogSource = scopedTutorEvents.events.length ? scopedTutorEvents.source : "local learner fallback";
  const aiLogState = { ...state, aiLogs: aiLogList };
  const localLessonLog = scopedLocalLogs.find((log) => log.lessonId === lesson.id || log.lessonTitle === lesson.title);
  const repositoryLessonLog = aiLogList.find((log) => log.lessonId === lesson.id || log.lessonTitle === lesson.title);
  const latestLessonLog = repositoryLessonLog || localLessonLog;
  const selectedExplanationModeId = state.selectedExplanationModeId || "diagnose";
  const tutorQuality = getTutorQualityDashboard(aiLogState);
  const improvementQueue = getTutorImprovementQueue(state);
  const currentLessonSignals = improvementQueue.signals.filter((signal) => signal.lessonId === lesson.id);

  return renderShell(`
    <section class="panel wide-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Guardrailed AI coach</p>
          <h2>Write the stuck point for ${html(lesson.title)}</h2>
        </div>
        <span class="status-pill">${html(ageBand(lesson.academyId))}</span>
      </div>
      <div class="coach-loop">
        <article>
          <span>1</span>
          <h3>Name the confusion</h3>
          <p>${html(support.confusionPrompt)}</p>
        </article>
        <article>
          <span>2</span>
          <h3>Coach analyzes it</h3>
          <p>The response is checked for visual-model gaps, vocabulary gaps, missing first steps, reasoning gaps, and direct-answer requests.</p>
        </article>
        <article>
          <span>3</span>
          <h3>Try one better step</h3>
          <p>The coach gives one reteach move and asks the learner to explain or retry, not copy an answer.</p>
        </article>
      </div>
      ${renderProductionVisualFigure(
        getLessonProductionVisualAsset(lesson, ["ai-tutor"], { requirePreferredPlacement: true }),
        support.confusionPrompt || "Tutor help visual.",
        {
          className: "ai-tutor-visual",
          title: "Tutor help card",
          reviewLabel: "Tutor visual passed quality review."
        }
      )}
      <div class="metric-grid">
        ${renderMetric("Tutor turns", tutorQuality.totalInteractions, "Student questions")}
        ${renderMetric("Feedback", tutorQuality.feedbackCount, `${tutorQuality.helpfulRate}% helpful`)}
        ${renderMetric("Still confused", tutorQuality.stillConfused, "Needs redesign")}
        ${renderMetric("Basics mode", tutorQuality.firstPrinciplesUses, "First-principles help")}
        ${renderMetric("Adaptive switches", tutorQuality.adaptiveSwitches, "Changed strategy")}
        ${renderMetric("Improvement queue", improvementQueue.needsRedesign, "Fun agent signals")}
        ${renderMetric("Truth score", tutorQuality.truthReviewed ? `${tutorQuality.truthAverage}/5` : "n/a", "Tutor reasoning")}
        ${renderMetric("Fact-check queue", tutorQuality.needsTruthReview, "Truth-policy")}
      </div>
      <form class="ai-form" id="aiForm">
        <label for="aiQuestion">What exactly do you not understand?</label>
        <textarea id="aiQuestion" name="aiQuestion" rows="5" placeholder="${html(support.confusionPrompt)}">${html(state.pendingTutorPrompt || "")}</textarea>
        <fieldset class="mode-grid">
          <legend>How should the tutor help?</legend>
          ${explanationModes
            .map(
              (mode, index) => `
                <label class="mode-card">
                  <input type="radio" name="explanationMode" value="${html(mode.id)}" ${mode.id === selectedExplanationModeId ? "checked" : ""}>
                  <strong>${html(mode.studentLabel)}</strong>
                  <small>${html(mode.strategy)}</small>
                </label>
              `
            )
            .join("")}
        </fieldset>
        <button class="primary-button" type="submit">Ask tutor</button>
      </form>
      ${
        latestLessonLog
          ? `
            <article class="coach-response ${latestLessonLog.flagged ? "flagged" : ""}">
              <span>${html(latestLessonLog.modeTitle || latestLessonLog.type)}</span>
              <h3>Coach analysis</h3>
              <p>${html(latestLessonLog.analysis || latestLessonLog.response)}</p>
              ${
                latestLessonLog.adaptive
                  ? `<p class="adaptive-note"><strong>Adaptive tutor switch:</strong> ${html(latestLessonLog.adaptationReason)}</p>`
                  : ""
              }
              ${renderTutorDiagnosisPanel(latestLessonLog)}
              ${latestLessonLog.strategy ? `<p><strong>Teaching strategy:</strong> ${html(latestLessonLog.strategy)}</p>` : ""}
              ${latestLessonLog.nextStep ? `<p><strong>Next teaching move:</strong> ${html(latestLessonLog.nextStep)}</p>` : ""}
              ${latestLessonLog.visualHint ? `<p><strong>Visual hint:</strong> ${html(latestLessonLog.visualHint)}</p>` : ""}
              ${latestLessonLog.firstPrinciplesPrompt ? `<p><strong>First-principles questions:</strong> ${html(latestLessonLog.firstPrinciplesPrompt)}</p>` : ""}
              ${
                typeof latestLessonLog.truthScore === "number"
                  ? `<p><strong>Truth-policy review:</strong> ${html(`${latestLessonLog.truthScore}/5`)}${latestLessonLog.truthIssues?.length ? ` - ${html(latestLessonLog.truthIssues.join(" "))}` : " - auto-reviewed for lesson grounding, answer policy, and reasoning quality."}</p>`
                  : ""
              }
              ${latestLessonLog.prompt ? `<p><strong>Retry prompt:</strong> ${html(latestLessonLog.prompt)}</p>` : ""}
              ${
                latestLessonLog.studentFeedback
                  ? `<p><strong>Student feedback:</strong> ${html(latestLessonLog.studentFeedback.replace("-", " "))}</p>`
                  : `
                    <div class="feedback-row" aria-label="Tutor feedback">
                      <button class="small-button" data-tutor-feedback="helped" data-log-id="${html(latestLessonLog.id)}">This helped</button>
                      <button class="small-button" data-tutor-feedback="still-confused" data-log-id="${html(latestLessonLog.id)}">Still confused</button>
                      <button class="small-button" data-tutor-feedback="too-hard" data-log-id="${html(latestLessonLog.id)}">Too hard</button>
                      <button class="small-button" data-tutor-feedback="needs-picture" data-log-id="${html(latestLessonLog.id)}">Need picture</button>
                    </div>
                  `
              }
            </article>
          `
          : ""
      }
      <div class="policy-grid">
        <article>
          <h3>Allowed</h3>
          <p>Confusion analysis, hints, reteach steps, vocabulary support, summary prompts, and parent-visible logs.</p>
        </article>
        <article>
          <h3>Blocked</h3>
          <p>Direct quiz answers, cheating, unsafe content, personal data extraction, and ungrounded standards claims.</p>
        </article>
      </div>
    </section>

    <section class="panel wide-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Fun And Retention Agent</p>
          <h2>Lesson improvement queue</h2>
        </div>
        <span class="status-pill">${currentLessonSignals.length} for this lesson</span>
      </div>
      <p class="callout">When a student says the tutor did not help, the platform records the exact failure mode so lesson design can improve with evidence instead of guessing.</p>
      <div class="improvement-grid">
        ${
          currentLessonSignals.length
            ? currentLessonSignals
                .map(
                  (signal) => `
                    <article class="improvement-card">
                      <span>${html(signal.feedback.replace("-", " "))}</span>
                      <h3>${html(signal.title)}</h3>
                      <p>${html(signal.change)}</p>
                      <small>${html(signal.why)}</small>
                    </article>
                  `
                )
                .join("")
            : `<p class="muted">No redesign signals for this lesson yet. Ask the tutor and submit feedback to create one.</p>`
        }
      </div>
    </section>

    <aside class="panel side-panel">
      <div class="section-head compact">
        <h2>AI log</h2>
        <span class="status-pill" aria-label="repository tutor event source">${html(aiLogSource)}</span>
      </div>
      ${scopedTutorEvents.error ? `<div class="batch-result failed"><strong>Scoped tutor read unavailable</strong><span>${html(scopedTutorEvents.error)}</span></div>` : ""}
      <div class="ai-log">
        ${
          aiLogList.length
            ? aiLogList
                .map(
                  (log) => `
                    <article class="log-entry ${log.flagged ? "flagged" : ""}">
                      <span>${html(log.modeTitle || log.type)}</span>
                      <strong>${html(log.lessonTitle || log.lessonId || "Tutor event")}</strong>
                      <p>${html(log.response)}</p>
                      ${log.stuckPointLabel ? `<small>Stuck point: ${html(log.stuckPointLabel)}</small>` : ""}
                      ${log.nextQuestion ? `<small>Next question: ${html(log.nextQuestion)}</small>` : ""}
                      ${log.analysis ? `<small>Analysis: ${html(log.analysis)}</small>` : ""}
                      ${log.strategy ? `<small>Mode: ${html(log.strategy)}</small>` : ""}
                      ${typeof log.truthScore === "number" ? `<small>Truth-policy: ${html(`${log.truthScore}/5`)}${log.needsExternalResearch ? " | staff research needed" : ""}</small>` : ""}
                      ${log.adaptive ? `<small>Adaptive switch: ${html(log.adaptationReason)}</small>` : ""}
                      ${log.studentFeedback ? `<small>Student feedback: ${html(log.studentFeedback.replace("-", " "))}</small>` : ""}
                      <small>${html(log.timestamp)}</small>
                    </article>
                  `
                )
                .join("")
            : `<p class="muted">No tutor interactions yet. Ask a question to test the guardrails.</p>`
        }
      </div>
    </aside>

    <section class="panel wide-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Tutor Quality Loop</p>
          <h2>Which teaching styles are working?</h2>
        </div>
        <span class="status-pill">${tutorQuality.needsReview} need review</span>
      </div>
      <div class="mode-performance-grid">
        ${tutorQuality.byMode
          .map(
            (mode) => `
              <article class="mode-performance-card">
                <strong>${html(mode.title)}</strong>
                <span>${mode.total} turn(s)</span>
                <small>${mode.feedbackCount ? `${mode.helpfulRate}% helpful from ${mode.feedbackCount} feedback item(s)` : "No student feedback yet"}</small>
                <small>${mode.truthAverage ? `Truth score ${mode.truthAverage}/5` : "No truth-policy score yet"}</small>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `);
}

function renderTutorDiagnosisPanel(log = {}) {
  const hintPath = Array.isArray(log.hintPath) ? log.hintPath.filter(Boolean) : [];
  if (!log.stuckPointLabel && !hintPath.length && !log.nextQuestion) return "";

  return `
    <div class="tutor-diagnosis-panel" aria-label="Tutor stuck-point diagnosis">
      <div class="tutor-diagnosis-head">
        <span>Stuck-point diagnosis</span>
        <strong>${html(log.stuckPointLabel || "Needs narrowing")}</strong>
      </div>
      ${
        hintPath.length
          ? `
            <ol class="tutor-hint-path">
              ${hintPath.map((step) => `<li>${html(step)}</li>`).join("")}
            </ol>
          `
          : ""
      }
      ${log.nextQuestion ? `<p class="tutor-next-question"><strong>Answer this next:</strong> ${html(log.nextQuestion)}</p>` : ""}
    </div>
  `;
}

function renderToolGatewayResult() {
  if (!lastToolGatewayResult) return "";
  const data = lastToolGatewayResult.data ? JSON.stringify(lastToolGatewayResult.data, null, 2) : "";
  const sourceCoverage = lastToolGatewayResult.data?.sourceCoverage;
  const redesignTasks = lastToolGatewayResult.data?.redesignTasks || [];
  const sourceLedger = lastToolGatewayResult.data?.sourceLedger || [];
  return `
    <div class="batch-result ${lastToolGatewayResult.accepted ? "passed" : "failed"}">
      <strong>${lastToolGatewayResult.accepted ? "Tool run completed" : "Tool run blocked"}</strong>
      <span>${html(lastToolGatewayResult.summary || lastToolGatewayResult.reason || "Tool gateway result recorded.")}</span>
      ${lastToolGatewayResult.nextAction ? `<small>Next: ${html(lastToolGatewayResult.nextAction)}</small>` : ""}
      ${lastToolGatewayResult.requiresHumanReview ? `<small>Human review required before student-facing or published use.</small>` : ""}
      ${
        sourceCoverage
          ? `<small>Source ledger: ${html(`${sourceCoverage.ledgerFindings} finding(s), ${sourceCoverage.approvedSourceTargets} approved target(s)`)}</small>`
          : ""
      }
      ${
        redesignTasks.length
          ? `
            <div class="research-task-list">
              ${redesignTasks
                .slice(0, 4)
                .map(
                  (task) => `
                    <article>
                      <strong>${html(task.title)}</strong>
                      <span>${html(task.change)}</span>
                      <small>${html((task.sourceIds || []).join(", ") || "source review required")}</small>
                    </article>
                  `
                )
                .join("")}
            </div>
          `
          : ""
      }
      ${
        sourceLedger.length
          ? `<small>Checked sources: ${html(sourceLedger.map((source) => source.sourceName).slice(0, 3).join(" | "))}</small>`
          : ""
      }
      ${
        data
          ? `<details><summary>Result payload</summary><pre class="tool-result-payload">${html(data)}</pre></details>`
          : ""
      }
    </div>
  `;
}

function renderAgentReviewResult() {
  if (!lastAgentReviewResult) return "";
  return `
    <div class="batch-result ${lastAgentReviewResult.accepted ? "passed" : "failed"}">
      <strong>${lastAgentReviewResult.accepted ? "Review decision saved" : "Review decision blocked"}</strong>
      <span>${html(lastAgentReviewResult.summary || "Manager review result recorded.")}</span>
    </div>
  `;
}

function renderReviewDossierDetails(reviewId) {
  const dossier = getManagerReviewDossier(state, reviewId);
  if (!dossier.found) return "";
  const categoryScores = dossier.categoryScores || [];
  const issues = [...(dossier.blockers || []), ...(dossier.issues || []), ...(dossier.missingRequirements || [])].filter(Boolean);
  const revisionInstructions = dossier.revisionInstructions || [];
  const reviewHistory = dossier.reviewHistory || [];

  return `
    <div class="manager-review-dossier">
      <div class="manager-review-dossier-topline">
        ${dossier.grade || typeof dossier.score === "number" ? `<div class="artifact-grade-chip ${issues.length ? "blocked" : "passed"}"><strong>${html(dossier.grade ? `Grade ${dossier.grade}` : "Score")}</strong><span>${html(`${dossier.score ?? "n/a"}/${dossier.threshold ?? "n/a"}`)}</span></div>` : ""}
        <small>${html(`Owner: ${dossier.ownerAgentId} | Impact: ${dossier.publishImpact}`)}</small>
      </div>
      ${
        categoryScores.length
          ? `<details class="visual-review-details" open>
              <summary>Rubric category scores</summary>
              <div class="review-score-grid">
                ${categoryScores
                  .map(
                    (category) => `
                      <article class="${category.passed ? "passed" : "blocked"}">
                        <strong>${html(category.label || category.id)}</strong>
                        <span>${html(`${category.score ?? "n/a"} / 100`)}</span>
                        <small>${html(category.feedback || category.improvement || "")}</small>
                      </article>
                    `
                  )
                  .join("")}
              </div>
            </details>`
          : ""
      }
      ${
        issues.length
          ? `<details class="visual-review-details" open>
              <summary>Blockers and issues</summary>
              <ul>${issues.slice(0, 8).map((issue) => `<li>${html(issue)}</li>`).join("")}</ul>
            </details>`
          : ""
      }
      ${
        revisionInstructions.length
          ? `<details class="visual-review-details" open>
              <summary>Revision instructions</summary>
              <ul>${revisionInstructions.slice(0, 8).map((instruction) => `<li>${html(instruction)}</li>`).join("")}</ul>
            </details>`
          : ""
      }
      ${
        dossier.reviewChecklist?.length
          ? `<details class="visual-review-details">
              <summary>Review checklist</summary>
              <ul>${dossier.reviewChecklist.slice(0, 8).map((item) => `<li>${html(item)}</li>`).join("")}</ul>
            </details>`
          : ""
      }
      ${
        dossier.sourcePrompt
          ? `<details class="visual-review-details">
              <summary>${dossier.artifactType === "ai" ? "Student input" : dossier.artifactType === "tool" ? "Tool input" : "Source prompt"}</summary>
              <pre class="tool-result-payload">${html(dossier.sourcePrompt)}</pre>
            </details>`
          : ""
      }
      ${
        reviewHistory.length
          ? `<details class="visual-review-details">
              <summary>Revision history (${reviewHistory.length})</summary>
              <ol class="review-history-list">
                ${reviewHistory
                  .slice(0, 6)
                  .map(
                    (entry) => `
                      <li>
                        <strong>${html(entry.action || entry.trigger || "review")}</strong>
                        <span>${html([entry.grade, typeof entry.score === "number" ? `${entry.score}` : ""].filter(Boolean).join(" | ") || "no score")}</span>
                        <small>${html(entry.createdAt || "")}</small>
                        ${entry.revisionInstructions?.length ? `<p>${html(entry.revisionInstructions[0])}</p>` : ""}
                      </li>
                    `
                  )
                  .join("")}
              </ol>
            </details>`
          : ""
      }
    </div>
  `;
}

function getRepositoryAwareCommandCenter() {
  const commandCenter = getAgentCommandCenter(state);
  if (!repositoryAgentReviews) return commandCenter;
  return {
    ...commandCenter,
    reviewQueue: {
      ...commandCenter.reviewQueue,
      total: repositoryAgentReviews.summary.total,
      visualReview: repositoryAgentReviews.summary.visualReview,
      contentReview: repositoryAgentReviews.summary.contentReview,
      batchReview: repositoryAgentReviews.summary.batchReview || commandCenter.reviewQueue.batchReview || 0,
      toolReview: repositoryAgentReviews.summary.toolReview,
      aiReview: repositoryAgentReviews.summary.aiReview,
      highPriority: repositoryAgentReviews.summary.highPriority,
      items: repositoryAgentReviews.items
    },
    reviewQueueSource: "normalized-repository"
  };
}

function renderAgentReviewQueue(queue) {
  if (!queue.items.length) {
    return `<p class="muted">No pending review items. Run content review, visual generation, lesson audit, or AI safety checks to create audit work.</p>`;
  }

  return `
    <div class="agent-review-list">
      ${queue.items
        .slice(0, 12)
        .map(
          (item) => `
            <article class="agent-review-card ${html(item.priority)}">
              <div class="tool-card-topline">
                <span class="subject-chip ${html(item.type)}">${html(item.type)}</span>
                <span class="status-pill">${html(item.priority)}</span>
              </div>
              <h3>${html(item.title)}</h3>
              ${item.grade ? `<div class="artifact-grade-chip ${item.passed ? "passed" : "blocked"}"><strong>${html(`Grade ${item.grade}`)}</strong><span>${html(`${item.score ?? "n/a"}/${item.threshold ?? "n/a"}`)}</span></div>` : ""}
              <p>${html(item.summary)}</p>
              ${item.revisionInstructions?.length ? `<details class="visual-review-details"><summary>Suggested improvements</summary><ul>${item.revisionInstructions.slice(0, 5).map((instruction) => `<li>${html(instruction)}</li>`).join("")}</ul></details>` : ""}
              <small>${html(`Owner: ${item.ownerAgentId} | Status: ${item.status}`)}</small>
              <small>${html(item.nextAction)}</small>
              ${renderReviewDossierDetails(item.id)}
              <div class="review-action-row">
                ${item.actions
                  .map(
                    (action) => `
                      <button class="small-button" data-review-id="${html(item.id)}" data-review-action="${html(action)}">
                        ${html(action === "approve" ? "Approve" : action === "reject" ? "Reject" : action === "request_revision" ? "Request revision" : "Mark reviewed")}
                      </button>
                    `
                  )
                  .join("")}
              </div>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function renderRedesignImplementationHistory() {
  const signals = state.lessonImprovementSignals || [];
  const pendingSignals = signals.filter((signal) => !["approved", "rejected", "revision-requested", "reviewed", "implemented"].includes(signal.reviewStatus || ""));
  const implementedSignals = signals.filter((signal) => signal.status === "implemented" || signal.reviewStatus === "implemented");
  const assignedSignals = signals.filter((signal) => signal.status === "assigned" || signal.reviewStatus === "approved");
  const revisionSignals = signals.filter((signal) => signal.reviewStatus === "revision-requested");

  const historyRows = implementedSignals.slice(0, 8).map((signal) => {
    const lesson = findLessonInState(state, signal.lessonId) || pilotLessons.find((item) => item.id === signal.lessonId) || {};
    const latestHistory = (signal.reviewHistory || [])[0] || {};
    return `
      <article class="redesign-history-card implemented">
        <div>
          <span class="subject-chip redesign">implemented</span>
          <h3>${html(signal.title || "Implemented lesson redesign")}</h3>
          <p>${html(signal.change || signal.why || "This redesign has been published into student-facing lesson content.")}</p>
          <small>${html(`Lesson: ${lesson.title || signal.lessonId} | Draft: ${signal.implementedDraftId || "not linked"} | Published: ${signal.implementedLessonId || "not linked"}`)}</small>
          ${latestHistory.summary ? `<small>${html(latestHistory.summary)}</small>` : ""}
        </div>
        <div class="redesign-history-meta">
          <strong>${html(signal.implementedAt || latestHistory.createdAt || "Implemented")}</strong>
          <span>${html((signal.reviewHistory || []).length)} review event(s)</span>
        </div>
      </article>
    `;
  });

  return `
    <section class="panel wide-panel redesign-implementation-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Redesign implementation history</p>
          <h2>Teacher and tutor feedback turned into shipped lesson fixes</h2>
        </div>
        <span class="status-pill">${implementedSignals.length} implemented</span>
      </div>
      <div class="metric-grid">
        ${renderMetric("Pending review", pendingSignals.length, "Needs manager decision")}
        ${renderMetric("Assigned", assignedSignals.length, "Draft in progress")}
        ${renderMetric("Revision requested", revisionSignals.length, "Needs stronger fix")}
        ${renderMetric("Implemented", implementedSignals.length, "Published lesson updates")}
      </div>
      ${
        historyRows.length
          ? `<div class="redesign-history-list">${historyRows.join("")}</div>`
          : `<p class="muted">No redesign fixes have been fully implemented yet. Once a teacher/tutor signal is approved, drafted, reviewed, and published, it will appear here with the draft and published lesson IDs.</p>`
      }
    </section>
  `;
}

function renderAuditEventSummary() {
  if (!repositoryAuditEvents && !repositoryAuditEventsError) return "";
  if (repositoryAuditEventsError) {
    return `<div class="batch-result failed"><strong>Audit route unavailable</strong><span>${html(repositoryAuditEventsError)}</span></div>`;
  }
  return `
    <section class="panel wide-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Audit Event Repository</p>
          <h2>Operational history from normalized tables</h2>
        </div>
        <span class="status-pill">${repositoryAuditEvents.summary.total} events</span>
      </div>
      <div class="metric-grid">
        ${renderMetric("Data events", repositoryAuditEvents.summary.data, "Learning and tool events")}
        ${renderMetric("Auth events", repositoryAuditEvents.summary.auth, "Identity lifecycle")}
        ${renderMetric("Tool calls", repositoryAuditEvents.summary.toolCalls, "Agent gateway")}
        ${renderMetric("Learning", repositoryAuditEvents.summary.learningEvents, "Lesson activity")}
      </div>
    </section>
  `;
}

function renderTutorToolContract(contract) {
  return `
    <section class="panel wide-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">AI Tutor Tool Contract</p>
          <h2>Lesson-scoped, hint-first tutoring rules</h2>
        </div>
        <span class="status-pill">${contract.permittedToolCount} permitted tools</span>
      </div>
      <p class="callout">${html(contract.purpose)}</p>
      <div class="metric-grid">
        ${renderMetric("Response stages", contract.stageCount, "Tutor sequence")}
        ${renderMetric("Allowed", contract.allowedCount, "Safe behaviors")}
        ${renderMetric("Blocked", contract.blockedCount, "Hard stops")}
        ${renderMetric("Audit signals", contract.auditSignalCount, "Review triggers")}
      </div>
      <div class="policy-grid">
        <article>
          <h3>Permitted tool use</h3>
          <ul>
            ${contract.permittedTools.map((tool) => `<li><strong>${html(tool.toolId)}:</strong> ${html(tool.use)}</li>`).join("")}
          </ul>
        </article>
        <article>
          <h3>Blocked behavior</h3>
          <ul>
            ${contract.blockedBehaviors.slice(0, 6).map((item) => `<li>${html(item)}</li>`).join("")}
          </ul>
        </article>
      </div>
    </section>
  `;
}

function renderToolRoleOptions(tool) {
  const roles = [
    ["platform-admin", "Platform admin"],
    ["school-admin", "School admin"],
    ["teacher", "Teacher"],
    ["parent", "Parent"],
    ["student", "Student"]
  ];

  return roles
    .map(
      ([id, label]) => `
        <option value="${id}" ${tool.allowedRoles.includes(id) ? "" : ""}>${html(label)}</option>
      `
    )
    .join("");
}

function renderToolInputControls(tool, visualAudit) {
  if (tool.id === "lesson_audit") {
    return `
      <label>
        Lesson
        <select name="lessonId">
          ${pilotLessons.map((lesson) => `<option value="${html(lesson.id)}">${html(`Grade ${lesson.grade}: ${lesson.title}`)}</option>`).join("")}
        </select>
      </label>
    `;
  }

  if (tool.id === "visual_generation") {
    return `
      <label>
        Visual slot
        <select name="slotId">
          ${visualAudit.slots
            .slice(0, 12)
            .map((slot) => `<option value="${html(slot.id)}">${html(`${slot.priority} | ${slot.placement} | ${slot.lessonTitle}`)}</option>`)
            .join("")}
        </select>
      </label>
    `;
  }

  if (tool.id === "standards_lookup") {
    return `
      <label>
        Standards query
        <input name="query" value="math" />
      </label>
    `;
  }

  if (tool.id === "fun_retention_design") {
    return `
      <label>
        Lesson
        <select name="lessonId">
          ${pilotLessons.map((lesson) => `<option value="${html(lesson.id)}">${html(`Grade ${lesson.grade}: ${lesson.title}`)}</option>`).join("")}
        </select>
      </label>
    `;
  }

  if (tool.id === "explanation_variation_studio") {
    return `
      <label>
        Lesson
        <select name="lessonId">
          ${pilotLessons.map((lesson) => `<option value="${html(lesson.id)}">${html(`Grade ${lesson.grade}: ${lesson.title}`)}</option>`).join("")}
        </select>
      </label>
      <label>
        Student confusion
        <textarea name="studentInput" rows="3">I do not understand which picture or first step to use.</textarea>
      </label>
    `;
  }

  if (tool.id === "syllabus_misconception_research") {
    return `
      <label>
        Lesson
        <select name="lessonId">
          ${pilotLessons.map((lesson) => `<option value="${html(lesson.id)}">${html(`Grade ${lesson.grade}: ${lesson.title}`)}</option>`).join("")}
        </select>
      </label>
      <label>
        Research subject
        <input name="subject" value="${html(currentLesson().subject)}" />
      </label>
      <label>
        Research grade
        <input name="grade" value="${html(currentLesson().grade)}" />
      </label>
    `;
  }

  if (tool.id === "live_curriculum_source_audit") {
    const sourceOptions = syllabusResearchFindings
      .map((finding) => finding.sourceUrl)
      .filter((url, index, urls) => url && urls.indexOf(url) === index);
    return `
      <label>
        Lesson
        <select name="lessonId">
          ${pilotLessons.map((lesson) => `<option value="${html(lesson.id)}">${html(`Grade ${lesson.grade}: ${lesson.title}`)}</option>`).join("")}
        </select>
      </label>
      <label>
        Approved source URL
        <select name="sourceUrl">
          ${sourceOptions.map((url) => `<option value="${html(url)}">${html(url)}</option>`).join("")}
        </select>
      </label>
      <label>
        Research subject
        <input name="subject" value="${html(currentLesson().subject)}" />
      </label>
      <label>
        Research grade
        <input name="grade" value="${html(currentLesson().grade)}" />
      </label>
    `;
  }

  return `<p class="muted">No extra input required for this managed tool.</p>`;
}

function renderToolGatewayCard(tool, visualAudit) {
  const allowedLabel = tool.allowedRoles.map((role) => role.replace("-", " ")).join(", ");
  return `
    <article class="tool-gateway-card">
      <div class="tool-card-topline">
        <span class="subject-chip ${html(tool.category)}">${html(tool.category.replace("-", " "))}</span>
        <span class="status-pill">${html(tool.status)}</span>
      </div>
      <h3>${html(tool.name)}</h3>
      <p>${html(tool.description)}</p>
      <div class="tool-meta">
        <span>Owner: ${html(tool.ownerAgentId)}</span>
        <span>Risk: ${html(tool.externalRisk)}</span>
        <span>${tool.requiresHumanReview ? "Review required" : "No review gate"}</span>
        <span>${tool.studentFacing ? "Student-facing" : "Staff/internal"}</span>
      </div>
      <small>Allowed roles: ${html(allowedLabel)}</small>
      <form class="tool-gateway-form" data-tool-id="${html(tool.id)}">
        <label>
          Run as
          <select name="role">
            ${renderToolRoleOptions(tool)}
          </select>
        </label>
        ${renderToolInputControls(tool, visualAudit)}
        <button class="primary-button" type="submit">Run managed tool</button>
      </form>
    </article>
  `;
}

function renderToolsView() {
  const commandCenter = getRepositoryAwareCommandCenter();
  const summary = commandCenter.gateway;
  const visualAudit = getVisualLearningAgentAudit(state);
  const logs = state.toolCallLogs || [];
  const reviewSource = commandCenter.reviewQueueSource === "normalized-repository" ? "Database rows" : "Local state";

  return renderShell(`
    <section class="panel wide-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Agent Tool Gateway</p>
          <h2>Managed MCP and tool access</h2>
        </div>
        <span class="status-pill">${summary.activeTools} active tools</span>
      </div>
      <p class="callout">External tools should only connect through this gateway. Each tool has an owner agent, role permissions, external-risk label, log trail, and human-review rule before it can affect curriculum, images, student data, or published content.</p>
      <div class="metric-grid">
        ${renderMetric("Registered", summary.totalTools, "Managed tools")}
        ${renderMetric("External risk", summary.externalRiskTools, "API or browser tools")}
        ${renderMetric("Review gated", summary.reviewRequiredTools, "Human approval")}
        ${renderMetric("Logged calls", summary.loggedCalls, `${summary.blockedCalls} blocked`)}
        ${renderMetric("Review queue", commandCenter.reviewQueue.total, reviewSource)}
        ${renderMetric("High priority", commandCenter.reviewQueue.highPriority, "Needs attention")}
      </div>
      ${renderToolGatewayResult()}
      ${renderAgentReviewResult()}
      ${repositoryAgentReviewsError ? `<div class="batch-result failed"><strong>Review repository unavailable</strong><span>${html(repositoryAgentReviewsError)}</span></div>` : ""}
      <div class="tool-gateway-grid">
        ${summary.tools.map((tool) => renderToolGatewayCard(tool, visualAudit)).join("")}
      </div>
    </section>

    <section class="panel wide-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Manager Review Queue</p>
          <h2>Items waiting for human decision</h2>
        </div>
        <span class="status-pill">${commandCenter.reviewQueue.total} pending</span>
      </div>
      <div class="metric-grid">
        ${renderMetric("Visuals", commandCenter.reviewQueue.visualReview, "Asset review")}
        ${renderMetric("Content", commandCenter.reviewQueue.contentReview, "Draft/publish gates")}
        ${renderMetric("Batches", commandCenter.reviewQueue.batchReview || 0, "Batch quality gates")}
        ${renderMetric("Redesign", commandCenter.reviewQueue.redesignReview || 0, "Tutor/teacher signals")}
        ${renderMetric("Tool calls", commandCenter.reviewQueue.toolReview, "Human review")}
        ${renderMetric("AI flags", commandCenter.reviewQueue.aiReview, "Safety review")}
      </div>
      ${renderAgentReviewQueue(commandCenter.reviewQueue)}
    </section>

    ${renderRedesignImplementationHistory()}

    ${renderAuditEventSummary()}

    ${renderTutorToolContract(commandCenter.tutorContract)}

    <aside class="panel side-panel">
      <div class="section-head compact">
        <h2>Tool call log</h2>
      </div>
      <div class="ai-log">
        ${
          logs.length
            ? logs
                .slice(0, 12)
                .map(
                  (log) => `
                    <article class="log-entry ${log.status === "blocked" ? "flagged" : ""}">
                      <span>${html(log.status)}</span>
                      <strong>${html(log.toolName)}</strong>
                      <p>${html(log.summary)}</p>
                      <small>${html(`Role: ${log.role} | Owner: ${log.ownerAgentId} | Risk: ${log.externalRisk}`)}</small>
                      <small>${html(log.createdAt)}</small>
                    </article>
                  `
                )
                .join("")
            : `<p class="muted">No managed tool calls yet. Run one tool to create an audit trail.</p>`
        }
      </div>
    </aside>
  `);
}

function renderAgentsView() {
  const agentHowTo = {
    manager: "Turns broad product goals into reviewed implementation waves and decides what ships.",
    curriculum: "Creates grade, subject, unit, lesson, standards, and misconception structures.",
    ux: "Converts student, parent, teacher, and admin workflows into usable screens.",
    architecture: "Defines data model, auth boundaries, APIs, privacy rules, and deployment order.",
    frontend: "Builds the responsive app shell, dashboards, lesson player, and visual system.",
    backend: "Owns mastery, progress, assignments, diagnostics, reports, and persistence.",
    "ai-safety": "Checks tutor behavior, hint rules, blocked answer policy, and age fit.",
    "teacher-explanation": "Designs multiple explanation routes and checks for understanding.",
    "student-tutor": "Interviews the learner about the exact stuck point and guides next steps.",
    "fun-retention": "Grades whether lessons are fun, memorable, and reward the right behavior.",
    "syllabus-research": "Audits approved sources for curriculum norms and hard-to-learn topics.",
    "truth-policy": "Fact-checks tutor and lesson claims before they affect student-facing content.",
    "visual-learning": "Finds where images, diagrams, simulations, or prompts would clarify learning.",
    "content-ops": "Moves lessons through draft, review, publish, quiz, and QA workflows.",
    qa: "Validates privacy, accessibility, curriculum integrity, tests, and launch gates."
  };
  return renderShell(`
    <section class="panel wide-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Agent operating model</p>
          <h2>Manager plus specialist workers, explained</h2>
        </div>
        <span class="status-pill">Staff controlled</span>
      </div>
      <p class="callout">Agents are not child chat rooms. They are staff-side workers with narrow jobs, review gates, logs, and role checks. Student-facing help goes through the tutor, which asks for the exact confusion and gives hints before answers.</p>
      <div class="agent-grid">
        ${agentTeam
          .map(
            (agent) => `
              <article class="agent-card">
                <span class="agent-code">${html(agent.id)}</span>
                <h3>${html(agent.title)}</h3>
                <p>${html(agentHowTo[agent.id] || agent.owns.join(", "))}</p>
                <small>Owns: ${html(agent.owns.join(", "))}</small>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
    <section class="panel">
      <div class="section-head compact">
        <h2>Operating rules</h2>
      </div>
      <ul class="check-list">
        <li>Manager assigns narrow work with clear ownership.</li>
        <li>Workers do not revert or overwrite each other.</li>
        <li>Specialist outputs are reviewed before integration.</li>
        <li>Implementation work is split only when modules are independent.</li>
      </ul>
    </section>
    ${renderProductCompletenessPanel()}
  `);
}

function render() {
  const renderers = {
    student: renderStudentView,
    curriculum: renderCurriculumView,
    lesson: renderLessonView,
    parent: renderParentView,
    teacher: renderTeacherView,
    school: renderSchoolAdminView,
    setup: renderSetupView,
    admin: renderAdminView,
    ai: renderAiView,
    visuals: renderVisualAgentView,
    tools: renderToolsView,
    lab: renderLearningLabView,
    experiments: renderExperimentsView,
    agents: renderAgentsView
  };
  if (currentSession) activeView = getAuthorizedView(activeView, currentSession);
  app.innerHTML = renderers[activeView]();
  drawLearningMap();
}

function drawLearningMap() {
  const canvas = document.querySelector("#learningMap");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const width = 920;
  const height = 280;
  const dpr = Math.max(1, Math.min(2, globalThis.devicePixelRatio || 1));
  if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
    canvas.width = width * dpr;
    canvas.height = height * dpr;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "#fffdf8";
  ctx.fillRect(0, 0, width, height);

  for (let x = -80; x < width + 80; x += 46) {
    ctx.beginPath();
    ctx.strokeStyle = x % 92 === 0 ? "rgba(72, 103, 177, 0.15)" : "rgba(232, 93, 79, 0.09)";
    ctx.lineWidth = 5;
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 138, height);
    ctx.stroke();
  }

  const nodes = [
    { id: "foundation", x: 130, y: 138, r: 58, color: "#e85d4f", label: "K-5", sub: "Play + picture" },
    { id: "bridge", x: 455, y: 138, r: 64, color: "#2f8f83", label: "6-8", sub: "Quest + team" },
    { id: "scholar", x: 790, y: 138, r: 70, color: "#4867b1", label: "9-12", sub: "Portfolio" }
  ];
  const selectedIndex = Math.max(0, nodes.findIndex((node) => node.id === state.selectedAcademyId));

  ctx.beginPath();
  ctx.moveTo(nodes[0].x + nodes[0].r, nodes[0].y);
  ctx.bezierCurveTo(300, 70, 305, 210, nodes[1].x - nodes[1].r, nodes[1].y);
  ctx.bezierCurveTo(610, 70, 620, 215, nodes[2].x - nodes[2].r, nodes[2].y);
  ctx.strokeStyle = "rgba(23, 32, 51, 0.2)";
  ctx.lineWidth = 20;
  ctx.lineCap = "round";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(nodes[0].x + nodes[0].r, nodes[0].y);
  ctx.bezierCurveTo(300, 70, 305, 210, nodes[1].x - nodes[1].r, nodes[1].y);
  ctx.bezierCurveTo(610, 70, 620, 215, nodes[2].x - nodes[2].r, nodes[2].y);
  ctx.strokeStyle = "#172033";
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 10]);
  ctx.stroke();
  ctx.setLineDash([]);

  nodes.forEach((node, index) => {
    const active = index === selectedIndex;
    ctx.beginPath();
    ctx.fillStyle = active ? "#172033" : "#ffffff";
    ctx.roundRect(node.x - node.r - 10, node.y - node.r - 10, (node.r + 10) * 2, (node.r + 10) * 2, 18);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = node.color;
    ctx.arc(node.x, node.y, active ? node.r + 3 : node.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#172033";
    ctx.lineWidth = active ? 5 : 3;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 30px Grandstander, Arial";
    ctx.textAlign = "center";
    ctx.fillText(node.label, node.x, node.y - 8);
    ctx.font = "800 15px Grandstander, Arial";
    ctx.fillText(node.sub, node.x, node.y + 24);
  });

  ctx.fillStyle = "#172033";
  ctx.font = "800 16px Grandstander, Arial";
  ctx.textAlign = "left";
  ctx.fillText("Daily path -> mastery -> reteach or challenge -> parent report -> portfolio", 44, 246);

  ctx.fillStyle = nodes[selectedIndex]?.color || "#e85d4f";
  ctx.fillRect(44, 220, 180 + selectedIndex * 155, 8);
}

app.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-view]");
  const academyButton = event.target.closest("[data-academy]");
  const gradeButton = event.target.closest("[data-grade]");
  const lessonButton = event.target.closest("[data-lesson]");
  const answerButton = event.target.closest("[data-answer]");
  const interactiveButton = event.target.closest("[data-interactive-widget]");
  const phaseCompleteButton = event.target.closest("[data-phase-complete]");
  const scratchpadReviewButton = event.target.closest("[data-scratchpad-review]");
  const tutorRetryButton = event.target.closest("[data-submit-tutor-retry]");
  const rewardRequestButton = event.target.closest("[data-request-reward]");
  const rewardDecisionButton = event.target.closest("[data-reward-decision]");
  const classSessionStatusButton = event.target.closest("[data-class-session-status]");
  const recordInterventionButton = event.target.closest("[data-record-intervention]");
  const resolveInterventionButton = event.target.closest("[data-resolve-intervention]");
  const interventionOutcomeButton = event.target.closest("[data-intervention-outcome]");
  const rosterExportButton = event.target.closest("[data-school-roster-export]");
  const reportsExportButton = event.target.closest("[data-school-reports-export]");
  const submitButton = event.target.closest("[data-submit-quiz]");
  const resetButton = event.target.closest("[data-reset]");
  const placementButton = event.target.closest("[data-run-placement]");
  const experimentButton = event.target.closest("[data-add-experiment]");
  const draftStatusButton = event.target.closest("[data-draft-status]");
  const publishBatchButton = event.target.closest("[data-publish-batch]");
  const assetStatusButton = event.target.closest("[data-asset-status]");
  const assetPromoteStorageButton = event.target.closest("[data-asset-promote-storage]");
  const reviewActionButton = event.target.closest("[data-review-action]");
  const tutorFeedbackButton = event.target.closest("[data-tutor-feedback]");
  const signOutButton = event.target.closest("[data-signout]");
  const revokeSessionButton = event.target.closest("[data-revoke-session]");
  const soundToggleButton = event.target.closest("[data-sound-toggle]");
  let shouldRender = false;

  if (soundToggleButton) {
    const nextSoundState = !uiSoundEnabled;
    setUiSoundEnabled(nextSoundState);
    if (nextSoundState) playUiSound("success");
    shouldRender = true;
  }

  if (rosterExportButton) {
    playUiSound("success");
    lastSchoolResult = { accepted: true, summary: "Preparing the school roster export..." };
    render();
    fetchSchoolRosterExport()
      .then(({ csv }) => {
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `school-roster-${currentSession?.schoolId || state.schoolProfile?.id || "export"}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        lastSchoolResult = { accepted: true, summary: "School roster CSV downloaded." };
        render();
      })
      .catch((error) => {
        lastSchoolResult = { accepted: false, reason: error.message || "Roster export failed." };
        render();
      });
    shouldRender = false;
  }

  if (reportsExportButton) {
    playUiSound("success");
    lastSchoolResult = { accepted: true, summary: "Preparing the school report export..." };
    render();
    fetchSchoolReportsExport()
      .then(({ csv }) => {
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `school-reports-${currentSession?.schoolId || state.schoolProfile?.id || "export"}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        lastSchoolResult = { accepted: true, summary: "School report CSV downloaded." };
        render();
      })
      .catch((error) => {
        lastSchoolResult = { accepted: false, reason: error.message || "School report export failed." };
        render();
      });
    shouldRender = false;
  }

  if (signOutButton) {
    playUiSound("switch");
    signOutLocal();
    currentSession = null;
    lastAuthResult = { accepted: true, summary: "Local account token cleared. The preview will use the dev fallback session until another account signs in." };
    refreshAuthSession().then(render);
    shouldRender = true;
  }

  if (revokeSessionButton) {
    playUiSound("blocked");
    const revokeAll = revokeSessionButton.dataset.revokeSession === "all";
    postSessionRevocation({
      userId: currentSession?.userId || "",
      sessionId: revokeAll ? "" : currentSession?.sessionId || "",
      revokeAll,
      reason: revokeAll ? "account security all-session revocation" : "account security current-session revocation"
    })
      .then(async ({ state: persisted, result, session }) => {
        state = mergePersistedState(state, persisted);
        currentSession = session || null;
        activeView = "setup";
        lastAuthResult = {
          accepted: result.accepted,
          summary: `${result.summary} Sign in again to continue.`
        };
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        lastAuthResult = { accepted: false, reason: error.message || "Session revocation failed." };
        render();
      });
    shouldRender = true;
  }

  if (academyButton) {
    playUiSound("switch");
    state = { ...state, selectedAcademyId: academyButton.dataset.academy };
    selectedGradeId = null;
    persistNow();
    shouldRender = true;
  }

  if (gradeButton) {
    playUiSound("switch");
    selectedGradeId = gradeButton.dataset.grade;
    shouldRender = true;
  }

  if (lessonButton) {
    playUiSound("switch");
    const learnerId = currentSession?.studentId || currentLearner()?.id || "";
    const lessonId = lessonButton.dataset.lesson;
    state = recordStudentEngagementAction({ ...state, selectedLessonId: lessonId }, {
      learnerId,
      lessonId,
      type: "lesson_started",
      value: { source: "mission-board" }
    });
    persistNow();
    shouldRender = true;
  }

  if (answerButton) {
    playUiSound("tap");
    const lesson = currentLesson();
    state = {
      ...state,
      selectedAnswers: {
        ...state.selectedAnswers,
        [lesson.id]: {
          ...(state.selectedAnswers[lesson.id] || {}),
          [answerButton.dataset.question]: Number(answerButton.dataset.answer)
        }
      }
    };
    persistNow();
    shouldRender = true;
  }

  if (interactiveButton) {
    playUiSound("tap");
    const lesson = currentLesson();
    const learnerId = currentSession?.studentId || currentLearner()?.id || "";
    const config = getLessonInteractiveConfig(lesson);
    const value = interactiveButton.dataset.interactiveValue;
    const correct = value === config.correctValue;
    const feedback = correct ? config.success : config.retry;
    state = recordInteractiveResponse(state, {
      learnerId,
      lessonId: lesson.id,
      widgetId: interactiveButton.dataset.interactiveWidget,
      value,
      correct,
      feedback
    });
    announceLearningMoment(correct ? "Model solved: +30 XP evidence recorded." : "Good attempt. The next hint is ready.", correct ? "success" : "retry");
    postInteractiveResponse({
      learnerId,
      lessonId: lesson.id,
      widgetId: interactiveButton.dataset.interactiveWidget,
      value,
      correct,
      feedback
    })
      .then(async ({ state: persisted }) => {
        state = mergePersistedState(state, persisted);
        await refreshLearningActionReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        state = markPersistenceError(state, error);
        saveState(state);
        render();
      });
    saveState(state);
    shouldRender = true;
  }

  if (phaseCompleteButton) {
    const lessonId = phaseCompleteButton.dataset.lessonId || currentLesson()?.id || "";
    const learnerId = currentSession?.studentId || currentLearner()?.id || "";
    const phase = phaseCompleteButton.dataset.phaseComplete || "";
    const completed = completeNexusPhase({ ...state, selectedLessonId: lessonId }, {
      learnerId,
      lessonId,
      phase
    });
    if (!completed.result.accepted) {
      playUiSound("blocked");
      announceLearningMoment(completed.result.reason || "Complete the evidence move first.", "retry");
      shouldRender = true;
    } else {
      state = completed.state;
      saveState(state);
      playUiSound("success");
      announceLearningMoment(`Phase cleared: ${phase.replaceAll("-", " ")} · +8 XP`, "success");
      postLessonPhase({ lessonId, learnerId, phase })
        .then(async ({ state: persisted, result }) => {
          state = mergePersistedState(state, persisted);
          await refreshLearningActionReadModels();
          saveState(state);
          if (result && !result.accepted) announceLearningMoment(result.reason || "Phase evidence was not accepted.", "retry");
          render();
        })
        .catch((error) => {
          state = markPersistenceError(state, error);
          render();
        });
      shouldRender = true;
    }
  }

  if (scratchpadReviewButton) {
    playUiSound("switch");
    const lessonId = scratchpadReviewButton.dataset.scratchpadReview;
    const learnerId = currentSession?.studentId || currentLearner()?.id || "";
    state = {
      ...state,
      selectedLessonId: lessonId,
      selectedExplanationModeId: "diagnose",
      pendingTutorPrompt: createScratchpadTutorPrompt(state, learnerId, lessonId)
    };
    activeView = "ai";
    saveState(state);
    shouldRender = true;
  }

  if (tutorRetryButton) {
    playUiSound("success");
    announceLearningMoment("Tutor retry recorded: you used help to improve your thinking.", "success");
    const lessonId = tutorRetryButton.dataset.submitTutorRetry;
    const learnerId = currentSession?.studentId || currentLearner()?.id || "";
    const scratchpad = getLessonScratchpad(state, learnerId, lessonId);
    const submitted = submitTutorHintRetry(state, {
      learnerId,
      lessonId,
      retryAfterHint: scratchpad.retryAfterHint
    });
    state = submitted.state;
    postLessonScratchpad({
      learnerId,
      lessonId,
      retryAfterHint: scratchpad.retryAfterHint
    })
      .then(async ({ state: persisted }) => {
        state = mergePersistedState(state, persisted);
        await refreshLearningActionReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        state = markPersistenceError(state, error);
        saveState(state);
        render();
      });
    saveState(state);
    shouldRender = true;
  }

  if (rewardRequestButton) {
    playUiSound("success");
    const learnerId = rewardRequestButton.dataset.requestReward;
    const rewardLevel = Number(rewardRequestButton.dataset.rewardLevel || 0);
    const requested = requestRewardApproval(state, {
      learnerId,
      rewardLevel,
      requestedBy: currentSession?.displayName || currentLearner()?.name || "Learner",
      source: "child-level-dashboard"
    });
    state = requested.state;
    saveState(state);
    postRewardRequest({
      learnerId,
      rewardLevel,
      source: "child-level-dashboard"
    })
      .then(async ({ state: persisted, result }) => {
        state = mergePersistedState(state, persisted);
        lastRewardResult = result || requested.result;
        await refreshLearningActionReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        lastRewardResult = { accepted: false, reason: error.message || "Reward request failed." };
        state = markPersistenceError(state, error);
        saveState(state);
        render();
      });
    shouldRender = true;
  }

  if (rewardDecisionButton) {
    playUiSound("success");
    const requestId = rewardDecisionButton.dataset.rewardDecision;
    const status = rewardDecisionButton.dataset.status || "approved";
    const decided = updateRewardApprovalStatus(state, {
      requestId,
      status,
      reviewedBy: currentSession?.displayName || "Parent"
    });
    state = decided.state;
    saveState(state);
    postRewardDecision({ requestId, status })
      .then(async ({ state: persisted, result }) => {
        state = mergePersistedState(state, persisted);
        lastRewardResult = result || decided.result;
        await refreshLearningActionReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        lastRewardResult = { accepted: false, reason: error.message || "Reward decision failed." };
        state = markPersistenceError(state, error);
        saveState(state);
        render();
      });
    shouldRender = true;
  }

  if (classSessionStatusButton) {
    playUiSound("success");
    const classSessionId = classSessionStatusButton.dataset.classSessionStatus;
    const status = classSessionStatusButton.dataset.status || "Live";
    const updated = updateClassSessionStatus(state, { classSessionId, status });
    state = updated.state;
    lastClassroomResult = updated.result;
    saveState(state);
    postClassSessionStatus({ classSessionId, status })
      .then(async ({ state: persisted, result }) => {
        state = mergePersistedState(state, persisted);
        lastClassroomResult = result;
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        lastClassroomResult = { accepted: false, reason: error.message || "Class session status could not be persisted." };
        state = markPersistenceError(state, error);
        saveState(state);
        render();
      });
    shouldRender = true;
  }

  if (recordInterventionButton) {
    playUiSound("success");
    const classSessionId = recordInterventionButton.dataset.recordIntervention;
    const learnerId = recordInterventionButton.dataset.learnerId;
    const targetedReteach = recordInterventionButton.dataset.targetedReteach || "";
    const interventionSummary = targetedReteach
      ? `Assign targeted support: ${targetedReteach}`
      : "Teacher will review the learner's stuck point, visual model, and exit ticket before assigning the next step.";
    const recorded = recordTeacherIntervention(state, {
      classSessionId,
      learnerId,
      interventionType: "reteach",
      summary: interventionSummary
    });
    state = recorded.state;
    lastClassroomResult = recorded.result;
    saveState(state);
    postTeacherIntervention({
      classSessionId,
      learnerId,
      interventionType: "reteach",
      summary: interventionSummary
    })
      .then(async ({ state: persisted, result }) => {
        state = mergePersistedState(state, persisted);
        lastClassroomResult = result;
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        lastClassroomResult = { accepted: false, reason: error.message || "Teacher intervention could not be persisted." };
        state = markPersistenceError(state, error);
        saveState(state);
        render();
      });
    shouldRender = true;
  }

  if (resolveInterventionButton) {
    playUiSound("success");
    const interventionId = resolveInterventionButton.dataset.resolveIntervention;
    const resolved = recordTeacherIntervention(state, { interventionId, status: "resolved" });
    state = resolved.state;
    lastClassroomResult = resolved.result;
    saveState(state);
    postTeacherIntervention({ interventionId, status: "resolved" })
      .then(async ({ state: persisted, result }) => {
        state = mergePersistedState(state, persisted);
        lastClassroomResult = result;
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        lastClassroomResult = { accepted: false, reason: error.message || "Teacher intervention could not be resolved." };
        state = markPersistenceError(state, error);
        saveState(state);
        render();
      });
    shouldRender = true;
  }

  if (interventionOutcomeButton) {
    playUiSound(interventionOutcomeButton.dataset.outcome === "worked" ? "success" : "blocked");
    const interventionId = interventionOutcomeButton.dataset.interventionOutcome;
    const outcome = interventionOutcomeButton.dataset.outcome || "worked";
    const outcomeNote =
      outcome === "worked"
        ? "Targeted support helped the learner move forward."
        : "Targeted support did not resolve the stuck point; send this to the redesign queue.";
    const resolved = recordTeacherIntervention(state, {
      interventionId,
      status: "resolved",
      outcome,
      outcomeNote
    });
    state = resolved.state;
    lastClassroomResult = resolved.result;
    saveState(state);
    postTeacherIntervention({ interventionId, status: "resolved", outcome, outcomeNote })
      .then(async ({ state: persisted, result }) => {
        state = mergePersistedState(state, persisted);
        lastClassroomResult = result;
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        lastClassroomResult = { accepted: false, reason: error.message || "Teacher intervention outcome could not be saved." };
        state = markPersistenceError(state, error);
        saveState(state);
        render();
      });
    shouldRender = true;
  }

  if (submitButton) {
    playUiSound("success");
    const lessonId = submitButton.dataset.submitQuiz;
    submitLessonQuiz(lessonId);
    shouldRender = true;
  }

  if (resetButton) {
    playUiSound("switch");
    state = resetState();
    activeView = "student";
    selectedGradeId = null;
    resetPersistedState()
      .then(async (persisted) => {
        state = mergePersistedState(state, persisted);
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        state = markPersistenceError(state, error);
        saveState(state);
        render();
      });
    shouldRender = true;
  }

  if (placementButton) {
    playUiSound("success");
    state = simulateDiagnosticPlacement(state, placementButton.dataset.runPlacement);
    persistNow();
    shouldRender = true;
  }

  if (experimentButton) {
    playUiSound("success");
    state = addExperimentRun(state);
    persistNow();
    shouldRender = true;
  }

  if (draftStatusButton) {
    playUiSound("success");
    const draftId = draftStatusButton.dataset.draftStatus;
    const status = draftStatusButton.dataset.status;
    state = updateContentDraftStatus(state, draftId, status);
    postDraftStatus(draftId, status)
      .then(async (persisted) => {
        state = mergePersistedState(state, persisted);
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        state = markPersistenceError(state, error);
        saveState(state);
        render();
      });
    shouldRender = true;
  }

  if (publishBatchButton) {
    playUiSound("success");
    const sourceBatchId = publishBatchButton.dataset.publishBatch;
    const published = publishApprovedContentBatch(state, sourceBatchId, { reviewedBy: currentSession?.userId || "manager" });
    state = published.state;
    lastBatchPublicationResult = published.result;
    saveState(state);
    postContentBatchPublication(sourceBatchId)
      .then(async ({ state: persisted, result }) => {
        state = mergePersistedState(state, persisted);
        lastBatchPublicationResult = result;
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        lastBatchPublicationResult = {
          accepted: false,
          sourceBatchId,
          summary: error.message || "Batch publication could not be persisted."
        };
        state = markPersistenceError(state, error);
        saveState(state);
        render();
      });
    shouldRender = true;
  }

  if (assetStatusButton) {
    playUiSound("success");
    const assetId = assetStatusButton.dataset.assetStatus;
    const status = assetStatusButton.dataset.status;
    state = updateVisualAssetStatus(state, assetId, status);
    postVisualAssetStatus(assetId, status)
      .then(async (persisted) => {
        state = mergePersistedState(state, persisted);
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        state = markPersistenceError(state, error);
        saveState(state);
        render();
      });
    shouldRender = true;
  }

  if (assetPromoteStorageButton) {
    playUiSound("success");
    const assetId = assetPromoteStorageButton.dataset.assetPromoteStorage;
    lastVisualStorageResult = {
      accepted: false,
      assetId,
      summary: "Promoting visual asset to Supabase Storage..."
    };
    render();
    postVisualAssetStoragePromotion(assetId)
      .then(async ({ state: persisted, result }) => {
        state = mergePersistedState(state, persisted);
        lastVisualStorageResult = {
          ...result,
          summary: result?.accepted ? "Asset is stored and ready for final approval." : result?.error || "Promotion did not complete."
        };
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        lastVisualStorageResult = {
          accepted: false,
          assetId,
          error: error.message || "Storage promotion failed."
        };
        state = markPersistenceError(state, error);
        saveState(state);
        render();
      });
    shouldRender = true;
  }

  if (reviewActionButton) {
    playUiSound("success");
    const reviewId = reviewActionButton.dataset.reviewId;
    const decision = reviewActionButton.dataset.reviewAction;
    const resolved = resolveAgentReviewItem(state, reviewId, decision);
    state = resolved.state;
    lastAgentReviewResult = resolved.result;
    saveState(state);
    postAgentReviewDecision(reviewId, decision)
      .then(async ({ state: persisted, result }) => {
        state = mergePersistedState(state, persisted);
        lastAgentReviewResult = result;
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        lastAgentReviewResult = {
          accepted: false,
          summary: error.message || "Review decision could not be persisted."
        };
        state = markPersistenceError(state, error);
        saveState(state);
        render();
      });
    shouldRender = true;
  }

  if (tutorFeedbackButton) {
    playUiSound("success");
    const feedback = tutorFeedbackButton.dataset.tutorFeedback;
    const logId = tutorFeedbackButton.dataset.logId;
    postTutorFeedback(logId, feedback)
      .then(async ({ state: persisted }) => {
        state = mergePersistedState(state, persisted);
        await refreshLearningActionReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        state = markPersistenceError(state, error);
        saveState(state);
        render();
      });
    shouldRender = true;
  }

  if (viewButton) {
    if (!lessonButton && !academyButton && !gradeButton) playUiSound("switch");
    const requestedView = viewButton.dataset.view;
    if (isViewAllowedForSession(requestedView, currentSession)) {
      activeView = requestedView;
    } else {
      playUiSound("blocked");
      activeView = getRoleHomeView(currentSession?.role || "anonymous");
      lastAuthResult = {
        accepted: false,
        reason: `${currentSession?.role || "This account"} cannot open ${requestedView}. You were moved to the correct role page.`
      };
    }
    shouldRender = true;
  }

  if (shouldRender) {
    render();
  }
});

app.addEventListener("input", (event) => {
  const scratchpadControl = event.target.closest("[data-scratchpad-field]");
  if (!scratchpadControl) return;
  const learnerId = currentSession?.studentId || currentLearner()?.id || "";
  const lessonId = scratchpadControl.dataset.lessonId || state.selectedLessonId;
  const field = scratchpadControl.dataset.scratchpadField;
  const patch = { learnerId, lessonId, [field]: scratchpadControl.value };
  state = updateLessonScratchpad(state, patch);
  saveState(state);

  globalThis.clearTimeout(scratchpadSyncTimer);
  scratchpadSyncTimer = globalThis.setTimeout(() => {
    postLessonScratchpad(patch)
      .then(async ({ state: persisted }) => {
        state = mergePersistedState(state, persisted);
        await refreshLearningActionReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        state = markPersistenceError(state, error);
        saveState(state);
      });
  }, 500);
});

app.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.target);

  if (event.target.matches(".classroom-mission-form")) {
    const input = {
      missionId: event.target.dataset.classroomMission,
      title: String(form.get("title") || ""),
      groupSize: Number(form.get("groupSize") || 3),
      sharedArtifact: String(form.get("sharedArtifact") || ""),
      roleLabels: String(form.get("roleLabels") || ""),
      individualEvidence: String(form.get("individualEvidence") || ""),
      teacherLookFor: String(form.get("teacherLookFor") || "")
    };
    const updated = updateGroupMission(state, input);
    state = updated.state;
    lastClassroomResult = updated.result;
    saveState(state);
    render();
    if (!updated.result.accepted) return;

    putClassroomMission(input)
      .then(async ({ state: persisted, result }) => {
        state = mergePersistedState(state, persisted);
        lastClassroomResult = result;
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        lastClassroomResult = { accepted: false, reason: error.message || "Group mission could not be persisted." };
        state = markPersistenceError(state, error);
        saveState(state);
        render();
      });
    return;
  }

  if (event.target.id === "signupForm") {
    lastAuthResult = { accepted: true, summary: "Creating account..." };
    render();
    postSignup({
      role: String(form.get("role") || "parent"),
      displayName: String(form.get("displayName") || ""),
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
      grade: String(form.get("grade") || "3")
    })
      .then(async ({ state: persisted, result, session, emailVerification, devVerificationToken }) => {
        state = mergePersistedState(state, persisted);
        currentSession = session;
        activeView = getRoleHomeView(currentSession.role);
        lastAuthResult = {
          accepted: result.accepted,
          summary: emailVerification?.accepted && !emailVerification.alreadyVerified
            ? `${result.account.role} account created for ${result.account.displayName}. Verify email before protected parent setup actions.`
            : `${result.account.role} account created for ${result.account.displayName}.`,
          actionToken: devVerificationToken || ""
        };
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        lastAuthResult = { accepted: false, reason: error.message || "Signup failed." };
        render();
      });
    return;
  }

  if (event.target.id === "signinForm") {
    lastAuthResult = { accepted: true, summary: "Signing in..." };
    render();
    postSignin({
      login: String(form.get("login") || ""),
      password: String(form.get("password") || "")
    })
      .then(async ({ state: persisted, result, session }) => {
        state = mergePersistedState(state, persisted);
        currentSession = session;
        activeView = getRoleHomeView(currentSession.role);
        lastAuthResult = {
          accepted: result.accepted,
          summary: `${result.account.role} account signed in for ${result.account.displayName}.${result.account.email && !result.account.emailVerified ? " Email verification is still required for protected setup actions." : ""}`
        };
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        lastAuthResult = { accepted: false, reason: error.message || "Signin failed." };
        render();
      });
    return;
  }

  if (event.target.id === "emailVerificationRequestForm") {
    lastAuthResult = { accepted: true, summary: "Creating email verification code..." };
    render();
    postEmailVerificationRequest({
      login: String(form.get("login") || "")
    })
      .then(async ({ state: persisted, result, devVerificationToken }) => {
        state = mergePersistedState(state, persisted);
        lastAuthResult = {
          accepted: result.accepted,
          summary: result.summary || "Verification request created.",
          actionToken: devVerificationToken || ""
        };
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        lastAuthResult = { accepted: false, reason: error.message || "Verification request failed." };
        render();
      });
    return;
  }

  if (event.target.id === "emailVerificationConfirmForm") {
    lastAuthResult = { accepted: true, summary: "Verifying email..." };
    render();
    postEmailVerificationConfirm({
      token: String(form.get("token") || "")
    })
      .then(async ({ state: persisted, result, session }) => {
        state = mergePersistedState(state, persisted);
        currentSession = session;
        activeView = getRoleHomeView(currentSession.role);
        lastAuthResult = {
          accepted: result.accepted,
          summary: result.summary || "Email verified."
        };
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        lastAuthResult = { accepted: false, reason: error.message || "Email verification failed." };
        render();
      });
    return;
  }

  if (event.target.id === "passwordResetRequestForm") {
    lastAuthResult = { accepted: true, summary: "Creating password reset code..." };
    render();
    postPasswordResetRequest({
      login: String(form.get("login") || "")
    })
      .then(async ({ state: persisted, result, devResetToken }) => {
        state = mergePersistedState(state, persisted);
        lastAuthResult = {
          accepted: result.accepted,
          summary: result.summary || "If the account exists, a reset code was created.",
          actionToken: devResetToken || ""
        };
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        lastAuthResult = { accepted: false, reason: error.message || "Password reset request failed." };
        render();
      });
    return;
  }

  if (event.target.id === "passwordResetConfirmForm") {
    lastAuthResult = { accepted: true, summary: "Changing password and revoking old sessions..." };
    render();
    postPasswordResetConfirm({
      token: String(form.get("token") || ""),
      password: String(form.get("password") || "")
    })
      .then(async ({ state: persisted, result, session }) => {
        state = mergePersistedState(state, persisted);
        currentSession = session || null;
        activeView = "setup";
        lastAuthResult = {
          accepted: result.accepted,
          summary: `${result.summary || "Password changed."} Sign in again with the new password.`
        };
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        lastAuthResult = { accepted: false, reason: error.message || "Password reset failed." };
        render();
      });
    return;
  }

  if (event.target.id === "childAccountForm") {
    lastAuthResult = { accepted: true, summary: "Creating child login..." };
    render();
    postChildAccount({
      displayName: String(form.get("displayName") || ""),
      username: String(form.get("username") || ""),
      password: String(form.get("password") || ""),
      grade: String(form.get("grade") || "3"),
      accommodations: String(form.get("accommodations") || "")
    })
      .then(async ({ state: persisted, result }) => {
        state = mergePersistedState(state, persisted);
        lastAuthResult = {
          accepted: result.accepted,
          summary: `Child login created for ${result.childLogin.displayName}. Username: ${result.childLogin.username}.`
        };
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        lastAuthResult = { accepted: false, reason: error.message || "Child account creation failed." };
        render();
      });
    return;
  }

  if (event.target.matches(".reward-fulfillment-form")) {
    lastRewardResult = { accepted: true, summary: "Submitting gift-card fulfillment..." };
    render();
    postRewardFulfillment({
      requestId: event.target.dataset.rewardFulfillment,
      recipientEmail: String(form.get("recipientEmail") || ""),
      recipientName: String(form.get("recipientName") || "")
    })
      .then(async ({ state: persisted, result, giftCards }) => {
        state = mergePersistedState(state, persisted);
        currentGiftCardReadiness = giftCards || currentGiftCardReadiness;
        lastRewardResult = {
          accepted: result.accepted,
          summary: result.summary || "Gift-card fulfillment recorded."
        };
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        lastRewardResult = { accepted: false, reason: error.message || "Gift-card fulfillment failed." };
        render();
      });
    return;
  }

  if (event.target.matches(".school-class-form")) {
    const fallbackTeacherAccount = (state.localAccounts || []).find((account) => account.role === "teacher" && account.teacherId);
    const input = {
      name: String(form.get("name") || ""),
      grade: String(form.get("grade") || ""),
      subject: String(form.get("subject") || "science"),
      teacherId: String(
        form.get("teacherId") ||
          (currentSession?.role === "teacher" ? currentSession.teacherId : "") ||
          fallbackTeacherAccount?.teacherId ||
          "teacher-demo-1"
      ),
      schedule: String(form.get("schedule") || "")
    };
    const created = createSchoolClass(state, input);
    state = created.state;
    lastSchoolResult = created.result;
    saveState(state);
    render();
    if (!created.result.accepted) return;

    postSchoolClass(input)
      .then(async ({ state: persisted, result }) => {
        state = mergePersistedState(state, persisted);
        lastSchoolResult = result;
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        lastSchoolResult = { accepted: false, reason: error.message || "Class section could not be persisted." };
        state = markPersistenceError(state, error);
        saveState(state);
        render();
      });
    return;
  }

  if (event.target.matches(".school-enrollment-form")) {
    const input = {
      classSectionId: String(form.get("classSectionId") || ""),
      learnerId: String(form.get("learnerId") || "")
    };
    const enrolled = enrollLearnerInSchoolClass(state, input);
    state = enrolled.state;
    lastSchoolResult = enrolled.result;
    saveState(state);
    render();
    if (!enrolled.result.accepted) return;

    postSchoolEnrollment(input)
      .then(async ({ state: persisted, result }) => {
        state = mergePersistedState(state, persisted);
        lastSchoolResult = result;
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        lastSchoolResult = { accepted: false, reason: error.message || "Enrollment could not be persisted." };
        state = markPersistenceError(state, error);
        saveState(state);
        render();
      });
    return;
  }

  if (event.target.matches(".school-roster-import-form")) {
    const csv = String(form.get("csv") || "");
    const imported = importSchoolRoster(state, {
      csv,
      schoolId: currentSession?.schoolId || state.schoolProfile?.id || "school-demo-1",
      invitedByUserId: currentSession?.userId || "user-platform-admin"
    });
    state = imported.state;
    lastSchoolResult = imported.result;
    saveState(state);
    render();
    if (!imported.result.accepted) return;

    postSchoolRosterImport({ csv })
      .then(async ({ state: persisted, result }) => {
        state = mergePersistedState(state, persisted);
        lastSchoolResult = result;
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        lastSchoolResult = { accepted: false, reason: error.message || "Roster import could not be persisted." };
        state = markPersistenceError(state, error);
        saveState(state);
        render();
      });
    return;
  }

  if (event.target.matches(".classroom-artifact-form")) {
    const missionId = event.target.dataset.classroomArtifact;
    const learnerId = event.target.dataset.learnerId || currentSession?.studentId || currentLearner()?.id || "";
    const individualEvidence = String(form.get("individualEvidence") || "");
    const submitted = submitClassroomArtifact(state, {
      missionId,
      learnerId,
      individualEvidence
    });
    state = submitted.state;
    lastClassroomResult = submitted.result;
    saveState(state);
    render();
    if (!submitted.result.accepted) return;

    postClassroomArtifact({
      missionId,
      learnerId,
      individualEvidence
    })
      .then(async ({ state: persisted, result }) => {
        state = mergePersistedState(state, persisted);
        lastClassroomResult = result;
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        lastClassroomResult = { accepted: false, reason: error.message || "Classroom evidence could not be persisted." };
        state = markPersistenceError(state, error);
        saveState(state);
        render();
      });
    return;
  }

  if (event.target.id === "aiForm") {
    const input = String(form.get("aiQuestion") || "");
    const explanationMode = String(form.get("explanationMode") || "diagnose");
    const lesson = currentLesson();
    const scratchpadReview = Boolean(state.pendingTutorPrompt && input === state.pendingTutorPrompt);
    state = { ...state, selectedExplanationModeId: explanationMode };
    saveState(state);
    postTutorAsk({
      lessonId: lesson.id,
      input,
      explanationMode,
      ageBand: ageBand(lesson.academyId),
      learnerId: currentSession?.studentId || currentLearner()?.id || "",
      scratchpadReview
    })
      .then(async ({ state: persisted }) => {
        state = { ...mergePersistedState(state, persisted), pendingTutorPrompt: "" };
        await refreshLearningActionReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        state = markPersistenceError(state, error);
        saveState(state);
        render();
      });
    render();
  }

  if (event.target.id === "benefitForm") {
    const benefit = String(form.get("familyBenefit") || "");
    state = addFamilyBenefit(state, benefit);
    persistNow();
    render();
  }

  if (event.target.id === "draftForm") {
    const subject = String(form.get("subject") || "math");
    const evidenceMoves = Object.fromEntries(
      evidenceGuidanceAudit.requiredMathLessonMoves.map((move) => [
        move.key,
        String(form.get(`evidenceMove_${move.key}`) || "")
      ])
    );
    const payload = {
      academyId: "foundation",
      grade: "3",
      subject,
      title: String(form.get("title") || ""),
      objective: String(form.get("objective") || ""),
      standards: [subject === "math" ? "ccss-math" : subject === "science" ? "ngss" : subject === "social-studies" ? "c3" : "ccss-ela"],
      reviewNotes: String(form.get("reviewNotes") || ""),
      accessibilityNotes: String(form.get("accessibilityNotes") || ""),
      ageFitNotes: String(form.get("ageFitNotes") || ""),
      essentialQuestion: String(form.get("essentialQuestion") || ""),
      studentSummary: String(form.get("studentSummary") || ""),
      whyItMatters: String(form.get("whyItMatters") || ""),
      vocabularyTerms: formLines(form.get("vocabularyTerms")),
      prerequisiteSkills: formLines(form.get("prerequisiteSkills")),
      lessonSections: {
        warmUp: String(form.get("sectionWarmUp") || ""),
        directInstruction: String(form.get("sectionDirectInstruction") || ""),
        guidedPractice: String(form.get("sectionGuidedPractice") || ""),
        interactiveActivity: String(form.get("sectionInteractiveActivity") || ""),
        independentPractice: String(form.get("sectionIndependentPractice") || ""),
        reteachPath: String(form.get("sectionReteachPath") || ""),
        challengePath: String(form.get("sectionChallengePath") || "")
      },
      helperNotes: parseHelperNotes(form.get("helperNotes")),
      commonMisunderstandings: parseCommonMisunderstandings(form.get("commonMisunderstandings")),
      visualSupports: parseVisualSupports(form.get("visualSupports")),
      sourceCards: parseSourceCards(form.get("sourceCards")),
      quizQuestions: buildQuizQuestions(form, subject),
      evidenceMoves
    };
    state = createContentDraft(state, payload);
    saveState(state);
    postLessonDraft(payload)
      .then(async ({ state: persisted }) => {
        state = mergePersistedState(state, persisted);
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        state = markPersistenceError(state, error);
        saveState(state);
        render();
      });
    render();
  }

  if (event.target.id === "batchImportForm") {
    const rawBatch = String(form.get("batchJson") || "");
    let payload;
    try {
      payload = JSON.parse(rawBatch);
    } catch (error) {
      lastBatchImportResult = {
        accepted: false,
        total: 0,
        imported: 0,
        errors: [{ path: "batchJson", message: error.message || "Batch JSON is not valid." }]
      };
      render();
      return;
    }

    const imported = importLessonBatch(state, payload);
    state = imported.state;
    lastBatchImportResult = imported.result;
    saveState(state);
    postLessonBatchImport(payload)
      .then(async ({ state: persisted, result }) => {
        state = mergePersistedState(state, persisted);
        lastBatchImportResult = result;
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        state = markPersistenceError(state, error);
        saveState(state);
        render();
      });
    render();
  }

  if (event.target.matches(".asset-replace-form")) {
    const assetId = event.target.dataset.assetReplace;
    const replacement = {
      assetUrl: String(form.get("assetUrl") || ""),
      altText: String(form.get("altText") || ""),
      caption: String(form.get("caption") || ""),
      license: String(form.get("license") || ""),
      credit: String(form.get("credit") || "")
    };
    const replaced = replaceVisualAsset(state, assetId, replacement);
    state = replaced.state;
    lastVisualReplacementResult = replaced.result;
    saveState(state);
    postVisualAssetReplacement(assetId, replacement)
      .then(async ({ state: persisted, result }) => {
        state = mergePersistedState(state, persisted);
        lastVisualReplacementResult = result;
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        state = markPersistenceError(state, error);
        saveState(state);
        render();
      });
    render();
  }

  if (event.target.matches(".visual-agent-form")) {
    const slotId = event.target.dataset.visualSlot;
    const prompt = String(form.get("prompt") || "");
    lastVisualAgentResult = {
      accepted: false,
      error: "Generating image...",
      slotId
    };
    render();
    postVisualAgentGeneration(slotId, prompt)
      .then(async ({ state: persisted, result }) => {
        state = mergePersistedState(state, persisted);
        lastVisualAgentResult = result;
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        lastVisualAgentResult = {
          accepted: false,
          generated: false,
          slotId,
          error: error.message || "Visual generation failed."
        };
        render();
      });
  }

  if (event.target.matches(".tool-gateway-form")) {
    const toolId = event.target.dataset.toolId;
    const role = String(form.get("role") || "platform-admin");
    const input = {};
    if (form.has("lessonId")) input.lessonId = String(form.get("lessonId") || "");
    if (form.has("slotId")) input.slotId = String(form.get("slotId") || "");
    if (form.has("query")) input.query = String(form.get("query") || "");
    if (form.has("subject")) input.subject = String(form.get("subject") || "");
    if (form.has("grade")) input.grade = String(form.get("grade") || "");
    if (form.has("studentInput")) input.studentInput = String(form.get("studentInput") || "");
    if (form.has("sourceUrl")) input.sourceUrl = String(form.get("sourceUrl") || "");

    const executed = runAgentTool(state, { toolId, role, input });
    state = executed.state;
    lastToolGatewayResult = executed.result;
    saveState(state);
    render();

    postToolGatewayExecution(toolId, role, input)
      .then(async ({ state: persisted, result }) => {
        state = mergePersistedState(state, persisted);
        lastToolGatewayResult = result;
        await refreshRepositoryReadModels();
        saveState(state);
        render();
      })
      .catch((error) => {
        lastToolGatewayResult = {
          accepted: false,
          summary: error.message || "Tool gateway execution failed."
        };
        state = markPersistenceError(state, error);
        saveState(state);
        render();
      });
  }
});

render();
hydrateFromServer();
