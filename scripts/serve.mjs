import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import {
  createActionTokenRecord,
  createPasswordRecord,
  createSessionToken,
  getRequestSession,
  getRequestSessionAsync,
  getSessionSecret,
  hashActionToken,
  publicSessionSummary,
  requireAuthenticated,
  verifyPassword
} from "../src/auth.js";
import {
  addGeneratedVisualAsset,
  askAiTutor,
  attachTutorProviderResponse,
  canAccessRepositoryAction,
  completeLessonQuiz,
  createEmailVerificationRequest,
  createParentManagedChildAccount,
  registerProviderAccount,
  createSessionClaimsForAccount,
  createContentDraft,
  createInitialState,
  createSchoolClass,
  findLessonInState,
  findLocalAccountByEmail,
  findLocalAccountByLogin,
  getAuthSecuritySummary,
  getLearnerClassSession,
  getLearnerAccess,
  getLessonTeachingSupport,
  getPlatformLessonLibrarySamples,
  getPlatformLessonLibrarySummary,
  getPlatformMigration,
  getPlatformMigrationReadiness,
  getPlatformOpenAiImageReadiness,
  getRuntimeConfigurationStatus,
  getStateDependencyAudit,
  getSchoolRosterImportContract,
  getTeacherClassMonitor,
  getVisualLearningOpportunity,
  importLessonBatch,
  importSchoolRoster,
  enrollLearnerInSchoolClass,
  isSessionRevoked,
  replaceVisualAsset,
  markVisualAssetStoragePromoted,
  publishApprovedContentBatch,
  resetLocalAccountPassword,
  registerLocalAccount,
  recordInteractiveResponse,
  recordTeacherIntervention,
  refreshSchoolReports,
  createPasswordResetRequest,
  requestRewardApproval,
  recordRewardFulfillmentResult,
  revokeAccountSession,
  resolveAgentReviewItem,
  runAgentTool,
  submitClassroomArtifact,
  submitTutorFeedback,
  submitTutorHintRetry,
  verifyLocalAccountEmail,
  updateClassSessionStatus,
  updateGroupMission,
  updateLessonScratchpad,
  updateRewardApprovalStatus,
  updateContentDraftStatus,
  updateVisualAssetStatus,
  runArtifactRevisionLoop
} from "../src/engine.js";
import { exportRepositoryRosterCsv } from "../src/roster.js";
import { formatSchoolReportSnapshotsCsv } from "../src/schoolReports.js";
import { generateOpenAiImage } from "../src/openaiImageService.js";
import { generateOpenAiTutorResponse, getOpenAiTutorReadiness } from "../src/openaiTutorService.js";
import { fulfillGiftCardReward, getGiftCardFulfillmentReadiness } from "../src/rewardFulfillmentService.js";
import { createNormalizedStateUpsertSql, createStateRepository, learnerProfileRepositoryTableIds, learningEvidenceRepositoryTableIds } from "../src/repository.js";
import { uploadVisualAssetToSupabaseStorage } from "../src/visualAssetStorageService.js";
import { fetchApprovedSourceAudit } from "../src/liveSourceAudit.js";
import { loadEnvFile } from "../src/env.js";
import {
  isSupabaseAuthConfigured,
  normalizeSupabaseAuthResponse,
  supabaseAdminCreateUser,
  supabaseAdminDeleteUser,
  supabaseGetUser,
  supabaseRequestPasswordReset,
  supabaseResendVerification,
  supabaseRefreshSession,
  supabaseSetAppMetadata,
  supabaseSignIn,
  supabaseSignOut,
  supabaseSignUp,
  supabaseUpdatePassword,
  supabaseVerifyEmail
} from "../src/supabaseAuth.js";

const root = resolve(process.cwd());
loadEnvFile({ root });
const port = Number(process.env.PORT || 4173);
const stateRepository = createStateRepository({ root, env: process.env });
const isProductionRuntime = () => ["production", "prod"].includes(String(process.env.APP_ENV || process.env.NODE_ENV || "").toLowerCase());
const configuredAuthProvider = () => String(
  process.env.AUTH_PROVIDER || ((process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) ? "supabase" : "")
).trim().toLowerCase();
const useProviderAuth = () =>
  (isProductionRuntime() || process.env.AUTH_USE_SUPABASE_AUTH === "true") &&
  configuredAuthProvider() === "supabase" &&
  isSupabaseAuthConfigured(process.env);

async function requireVerifiedProviderSession(accessToken, reason = "The provider session could not be verified.") {
  const token = String(accessToken || "").trim();
  if (!token) {
    const error = new Error(reason);
    error.status = 403;
    throw error;
  }
  const verifiedSession = await getRequestSessionAsync(
    { headers: { authorization: `Bearer ${token}` } },
    process.env
  );
  if (!verifiedSession.authenticated || !verifiedSession.productionAuth || !verifiedSession.role || verifiedSession.role === "anonymous") {
    const error = new Error(verifiedSession.authError || reason);
    error.status = 403;
    throw error;
  }
  return verifiedSession;
}

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function resolveRequestPath(url) {
  const pathname = new URL(url, `http://localhost:${port}`).pathname;
  const requested = pathname === "/" ? "/index.html" : pathname;
  const filePath = normalize(join(root, requested));
  if (!filePath.startsWith(root)) {
    return null;
  }
  return filePath;
}

async function readJsonBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks).toString("utf8");
  return body ? JSON.parse(body) : {};
}

function getBearerTokenFromRequest(request) {
  const authorization = request.headers?.authorization || request.headers?.Authorization || "";
  return String(authorization).toLowerCase().startsWith("bearer ") ? String(authorization).slice(7).trim() : "";
}

async function requestAuthProviderEmailVerification(body = {}) {
  await supabaseResendVerification({
    email: body.email || body.login,
    type: body.type || "signup",
    redirectTo: body.redirectTo || process.env.AUTH_EMAIL_REDIRECT_TO
  });
  return { message: "If the account exists, a verification email has been sent." };
}

function providerChildEmail(username) {
  const normalized = String(username || "").trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
  const domain = String(process.env.SUPABASE_CHILD_EMAIL_DOMAIN || "").trim().toLowerCase();
  if (!normalized || !domain || !domain.includes(".")) {
    const error = new Error("SUPABASE_CHILD_EMAIL_DOMAIN must be configured before creating provider-backed child accounts.");
    error.status = 503;
    throw error;
  }
  return `${normalized}@${domain}`;
}

async function resolveProviderLoginEmail(body = {}) {
  const login = String(body.email || body.login || "").trim().toLowerCase();
  if (login.includes("@")) return login;
  if (!login) return "";
  const security = await stateRepository.readAccountSecurity({ limit: 10000 });
  const account = (security.accounts || []).find((item) => item.username === login && item.role === "student");
  if (!account?.email) {
    const error = new Error("Login or password is incorrect.");
    error.status = 401;
    throw error;
  }
  return account.email;
}

async function ensureStateFile() {
  return stateRepository.readState();
}

async function writeState(state) {
  return stateRepository.writeState({
    ...createInitialState(),
    ...state,
    persistedAt: new Date().toISOString()
  });
}

async function writeAccountSecurity(state) {
  return stateRepository.writeAccountSecurity({
    ...createInitialState(),
    ...state,
    persistedAt: new Date().toISOString()
  });
}

async function writeAccountProvisioning(state, accountId = "") {
  if (typeof stateRepository.writeAccountProvisioning === "function") {
    return stateRepository.writeAccountProvisioning({
      ...createInitialState(),
      ...state,
      persistedAt: new Date().toISOString()
    }, accountId);
  }
  return writeAccountSecurity(state);
}

async function writeSessionRevocation(state, revocationId = "") {
  if (typeof stateRepository.writeSessionRevocation === "function") {
    return stateRepository.writeSessionRevocation({
      ...createInitialState(),
      ...state,
      persistedAt: new Date().toISOString()
    }, revocationId);
  }
  return writeAccountSecurity(state);
}

async function writeLearningEvidence(state) {
  return stateRepository.writeLearningEvidence({
    ...createInitialState(),
    ...state,
    persistedAt: new Date().toISOString()
  });
}

async function writeTutorWorkflow(state) {
  return stateRepository.writeTutorWorkflow({
    ...createInitialState(),
    ...state,
    persistedAt: new Date().toISOString()
  });
}

async function writeRewardWorkflow(state) {
  return stateRepository.writeRewardWorkflow({
    ...createInitialState(),
    ...state,
    persistedAt: new Date().toISOString()
  });
}

async function writeToolGatewayWorkflow(state) {
  return stateRepository.writeToolGatewayWorkflow({
    ...createInitialState(),
    ...state,
    persistedAt: new Date().toISOString()
  });
}

async function writeContentWorkflow(state) {
  return stateRepository.writeContentWorkflow({
    ...createInitialState(),
    ...state,
    persistedAt: new Date().toISOString()
  });
}

async function writeClassroomWorkflow(state) {
  const reportState = refreshSchoolReports({
    ...createInitialState(),
    ...state
  });
  return stateRepository.writeClassroomWorkflow({
    ...reportState,
    persistedAt: new Date().toISOString()
  });
}

async function writeSchoolOperations(state) {
  const reportState = refreshSchoolReports({
    ...createInitialState(),
    ...state
  });
  return stateRepository.writeSchoolOperations({
    ...reportState,
    persistedAt: new Date().toISOString()
  });
}

async function writeVisualWorkflow(state) {
  return stateRepository.writeVisualWorkflow({
    ...createInitialState(),
    ...state,
    persistedAt: new Date().toISOString()
  });
}

async function writeAgentReviewDecision(state) {
  return stateRepository.writeAgentReviewDecision({
    ...createInitialState(),
    ...state,
    persistedAt: new Date().toISOString()
  });
}

let stateMutationQueue = Promise.resolve();

function queueStateMutation(task) {
  const run = stateMutationQueue.then(task, task);
  stateMutationQueue = run.catch(() => {});
  return run;
}

function writeJsonResponse(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
}

function sanitizeScopedApiPayload(payload, session = {}) {
  if (stateRepository.status().mode !== "postgres" || !["student", "parent", "teacher"].includes(session.role)) return payload;
  if (!payload || typeof payload !== "object" || Array.isArray(payload) || !("state" in payload)) return payload;
  const { state, ...scopedPayload } = payload;
  return scopedPayload;
}

function sendCsv(response, status, csv, filename = "school-roster.csv") {
  response.writeHead(status, {
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Cache-Control": "no-store"
  });
  response.end(csv);
}

function findPendingActionTokenHash(requests = [], token = "") {
  const raw = String(token || "").trim();
  if (!raw) return "";
  const request = requests.find(
    (item) =>
      item.status === "pending" &&
      item.tokenHash &&
      item.tokenSalt &&
      hashActionToken(raw, item.tokenSalt) === item.tokenHash
  );
  return request?.tokenHash || "";
}

function revokedSession(session = {}, reason = "Session has been revoked. Sign in again.") {
  return {
    authenticated: false,
    devFallback: false,
    role: "anonymous",
    scope: "none",
    authError: reason,
    revoked: true,
    userId: session.userId || "",
    sessionId: session.sessionId || ""
  };
}

function requireAuthOwnerOrAdmin(session, targetUserId = "") {
  requireAuthenticated(session);
  if (!targetUserId || session.userId === targetUserId) return;
  if (["school-admin", "platform-admin"].includes(session.role)) return;
  const error = new Error("Only the account owner or an admin can change this account security setting.");
  error.status = 403;
  throw error;
}

function requireRepositoryPermission(session, tableId, operation, scope = session.scope) {
  requireAuthenticated(session);
  const authorization = canAccessRepositoryAction({ role: session.role, tableId, operation, scope });
  if (!authorization.allowed) {
    const error = new Error(authorization.reason || `Role ${session.role} cannot ${operation} ${tableId}.`);
    error.status = 403;
    throw error;
  }
  return authorization;
}

function requireLegacySnapshotAccess(session, operation = "read") {
  requireAuthenticated(session);
  const production = ["production", "prod"].includes(String(process.env.APP_ENV || process.env.NODE_ENV || "").toLowerCase());
  if (!production) return;
  requireRepositoryPermission(session, "app_state_snapshots", operation, session.scope);
}

function scopeAccountSecurityForSession(accountSecurity = {}, session = {}, state = {}) {
  if (session.role === "platform-admin") return accountSecurity;
  const accounts = accountSecurity.accounts || [];
  const students = accountSecurity.students || [];
  const ownUserIds = new Set([session.userId].filter(Boolean));
  if (session.role === "student" && session.studentId) ownUserIds.add(`user-${session.studentId}`);
  if (session.role === "parent" && session.guardianId) {
    const linkedStudentIds = new Set(
      [
        ...(accountSecurity.guardianLinks || []),
        ...(accountSecurity.studentGuardians || [])
      ]
        .filter((link) => link.guardian_id === session.guardianId || link.guardianId === session.guardianId)
        .filter((link) => (link.status || "approved") === "approved" && !link.revoked_at && !link.revokedAt)
        .map((link) => link.student_id || link.studentId)
        .filter(Boolean)
    );
    students.filter((student) => linkedStudentIds.has(student.id)).forEach((student) => ownUserIds.add(student.userId || `user-${student.id}`));
    accounts
      .filter((account) => account.guardianId === session.guardianId)
      .forEach((account) => ownUserIds.add(account.userId || `user-${account.id}`));
  }
  if (session.role === "teacher" && session.teacherId) {
    const assignedClassIds = new Set([
      ...(accountSecurity.teacherClassAssignments || [])
        .filter((assignment) => assignment.teacher_id === session.teacherId || assignment.teacherId === session.teacherId)
        .filter((assignment) => (assignment.status || "active") === "active" && !assignment.revoked_at && !assignment.revokedAt)
        .map((assignment) => assignment.class_id || assignment.classId),
      ...(accountSecurity.classes || [])
        .filter((item) => item.teacher_id === session.teacherId || item.teacherId === session.teacherId)
        .map((item) => item.id)
    ].filter(Boolean));
    const assignedStudentIds = new Set(
      (accountSecurity.enrollments || [])
        .filter((enrollment) => assignedClassIds.has(enrollment.class_id || enrollment.classId))
        .filter((enrollment) => (enrollment.status || "active") === "active")
        .map((enrollment) => enrollment.student_id || enrollment.studentId)
        .filter(Boolean)
    );
    students
      .filter((student) => assignedStudentIds.has(student.id))
      .forEach((student) => ownUserIds.add(student.userId || `user-${student.id}`));
    ownUserIds.add(session.userId);
  }
  const scopedAccounts = ["school-admin"].includes(session.role)
    ? accounts.filter((account) => ["student", "teacher", "parent", "school-admin"].includes(account.role))
    : accounts.filter((account) => ownUserIds.has(account.userId));
  const scopedUserIds = new Set(scopedAccounts.map((account) => account.userId));
  const scopedStudents = students.filter((student) => scopedUserIds.has(student.userId));
  const scopedRevocations = (accountSecurity.sessionRevocations || []).filter((item) => scopedUserIds.has(item.userId) || session.role === "school-admin");
  const scopedAuthAuditEvents = (accountSecurity.authAuditEvents || []).filter(
    (event) => scopedUserIds.has(event.targetUserId) || scopedUserIds.has(event.actorUserId) || session.role === "school-admin"
  );
  const scopedPendingEmailVerification = (accountSecurity.pendingEmailVerification || []).filter(
    (event) => scopedUserIds.has(event.targetUserId) || scopedUserIds.has(event.actorUserId) || session.role === "school-admin"
  );
  const scopedPendingPasswordReset = (accountSecurity.pendingPasswordReset || []).filter(
    (event) => scopedUserIds.has(event.targetUserId) || scopedUserIds.has(event.actorUserId) || session.role === "school-admin"
  );
  return {
    ...accountSecurity,
    scoped: session.role !== "platform-admin",
    accounts: scopedAccounts,
    students: scopedStudents,
    sessionRevocations: scopedRevocations,
    authAuditEvents: scopedAuthAuditEvents,
    pendingEmailVerification: scopedPendingEmailVerification,
    pendingPasswordReset: scopedPendingPasswordReset,
    summary: {
      ...(accountSecurity.summary || {}),
      accountCount: scopedAccounts.length,
      verifiedAccounts: scopedAccounts.filter((account) => account.emailVerified).length,
      pendingVerificationAccounts: scopedAccounts.filter((account) => account.email && !account.emailVerified).length,
      studentAccounts: scopedAccounts.filter((account) => account.role === "student").length,
      parentAccounts: scopedAccounts.filter((account) => account.role === "parent").length,
      teacherAccounts: scopedAccounts.filter((account) => account.role === "teacher").length,
      managedChildAccounts: scopedAccounts.filter((account) => account.authProvider === "managed-child").length,
      pendingEmailVerification: scopedPendingEmailVerification.length,
      pendingPasswordReset: scopedPendingPasswordReset.length,
      revokedSessions: scopedRevocations.length,
      authAuditEvents: scopedAuthAuditEvents.length
    }
  };
}

function repositoryScopeForRole(session, fallback = session.scope) {
  if (session.role === "student") return "own";
  if (session.role === "parent") return "own-household";
  if (session.role === "teacher") return "assigned";
  if (session.role === "school-admin") return "school";
  return fallback;
}

function requireClassroomStaff(session, tableId, operation = "write") {
  requireAuthenticated(session);
  if (!["teacher", "school-admin", "platform-admin"].includes(session.role)) {
    const error = new Error("A teacher, school admin, or platform admin session is required for this classroom action.");
    error.status = 403;
    throw error;
  }
  return requireRepositoryPermission(session, tableId, operation, repositoryScopeForRole(session));
}

function requireSchoolAdmin(session, tableId, operation = "write") {
  requireAuthenticated(session);
  if (!["school-admin", "platform-admin"].includes(session.role)) {
    const error = new Error("A school admin or platform admin session is required for school setup actions.");
    error.status = 403;
    throw error;
  }
  return requireRepositoryPermission(session, tableId, operation, repositoryScopeForRole(session));
}

async function readRepositoryLearnerScope(session, learnerId = "") {
  return stateRepository.readLearnerProfiles({
    role: session.role,
    studentId: session.studentId || "",
    guardianId: session.guardianId || "",
    teacherId: session.teacherId || "",
    learnerIds: learnerId ? [learnerId] : [],
    limit: 10000
  });
}

async function repositoryCanAccessLearner(session, learnerId = "") {
  if (!learnerId || ["school-admin", "platform-admin"].includes(session.role)) return true;
  const profile = await readRepositoryLearnerScope(session, learnerId);
  return profile.learners.some((learner) => learner.id === learnerId && learner.status === "active");
}

async function readRepositoryLearnerAccess(session, state, learnerId) {
  if (stateRepository.status().mode !== "postgres") return getLearnerAccess(state, learnerId);
  const profile = await readRepositoryLearnerScope(session, learnerId);
  const learner = profile.learners.find((item) => item.id === learnerId);
  if (!learner) return { active: false, aiAllowed: false, blockedReasons: ["Learner access is not in this session's scope."] };

  const security = await stateRepository.readAccountSecurity({ limit: 10000 });
  const consent = security.consentRecords?.[learnerId];
  const parentIds = learner.guardianIds || [];
  const parentUserIds = new Set(
    security.guardians.filter((guardian) => parentIds.includes(guardian.id)).map((guardian) => guardian.userId).filter(Boolean)
  );
  const parentVerified = security.accounts.some(
    (account) => parentUserIds.has(account.userId) && account.emailVerified
  );
  const blockedReasons = [];
  if (!parentVerified) blockedReasons.push("Parent email is not verified.");
  if (!consent?.dataCollection || !consent?.portfolio) blockedReasons.push("Required parent consent is missing.");
  if (!consent?.aiHelper) blockedReasons.push("AI tutor is disabled by parent control.");
  return { active: blockedReasons.length === 0, aiAllowed: Boolean(consent?.aiHelper), blockedReasons };
}

async function requireTutorAccess(session, state, learnerId) {
  requireRepositoryPermission(session, "ai_tutor_events", "write", session.scope);
  if (session.role === "student" && learnerId !== session.studentId) {
    const error = new Error("Student tutor sessions can only write the authenticated learner's own AI tutor events.");
    error.status = 403;
    throw error;
  }

  const access = await readRepositoryLearnerAccess(session, state, learnerId);
  if (!access.active || !access.aiAllowed) {
    const error = new Error(
      access.blockedReasons?.length
        ? `AI tutor access is blocked: ${access.blockedReasons.join(" ")}`
        : "AI tutor access is blocked for this learner."
    );
    error.status = 403;
    throw error;
  }

  return access;
}

function learnerIdForLesson(lesson) {
  if (lesson.academyId === "bridge") return "maya";
  if (lesson.academyId === "scholar") return "jordan";
  return "avery";
}

function requireLearningEvidenceAccess(session, state, learnerId) {
  if (session.role === "student" && learnerId !== session.studentId) {
    const error = new Error("Students can only submit their own learning evidence.");
    error.status = 403;
    throw error;
  }

  const scope = session.role === "teacher" ? "assigned" : session.role === "parent" ? "own-household" : session.scope;
  for (const tableId of learningEvidenceRepositoryTableIds) {
    requireRepositoryPermission(session, tableId, "write", scope);
  }

  const blockers = [];
  const consent = state.consentRecords?.[learnerId];
  if (!state.parentProfile?.emailVerified) blockers.push("Parent email is not verified.");
  if (!consent?.dataCollection) blockers.push("Required data-collection consent is missing.");
  if (!state.placementResults?.[learnerId]) blockers.push("Placement diagnostic is not complete.");

  if (blockers.length) {
    const error = new Error(`Learning evidence cannot be recorded: ${blockers.join(" ")}`);
    error.status = 403;
    throw error;
  }
}

async function requireRewardDecisionAccess(session, state = {}, rewardRequest = {}) {
  requireAuthenticated(session);
  if (!["parent", "school-admin", "platform-admin"].includes(session.role)) {
    const error = new Error("A parent or admin session is required to approve, reject, or redeem rewards.");
    error.status = 403;
    throw error;
  }
  if (session.role === "parent" && !(await repositoryCanAccessLearner(session, rewardRequest.learnerId))) {
    const error = new Error("Parents can only approve or redeem rewards for their own linked child accounts.");
    error.status = 403;
    throw error;
  }
}

async function canTeacherAccessLearner(state = {}, session = {}, learnerId = "") {
  const normalizedLearnerId = String(learnerId || "").trim();
  if (!normalizedLearnerId) return false;
  if (["school-admin", "platform-admin"].includes(session.role)) return true;
  if (session.role !== "teacher" || !session.teacherId) return false;
  if (stateRepository.status().mode === "postgres") return repositoryCanAccessLearner(session, normalizedLearnerId);
  return (state.classSections || []).some(
    (section) => section.teacherId === session.teacherId && (section.studentIds || []).includes(normalizedLearnerId)
  );
}

async function requireLearnerReadAccess(session, state = {}, learnerId = "", label = "learner records") {
  requireAuthenticated(session);
  if (!learnerId || ["school-admin", "platform-admin"].includes(session.role)) return;
  if (session.role === "student" && learnerId === session.studentId) return;
  if (session.role === "parent" && (await repositoryCanAccessLearner(session, learnerId))) return;
  if (session.role === "teacher" && (await canTeacherAccessLearner(state, session, learnerId))) return;
  const error = new Error(`This session cannot read ${label} for the requested learner.`);
  error.status = 403;
  throw error;
}

function gradeBandForGrade(grade = "") {
  const numeric = Number(grade);
  if (!Number.isFinite(numeric)) return "";
  if (numeric <= 5) return "K-5";
  if (numeric <= 8) return "6-8";
  return "9-12";
}

async function readRoleScopedBootstrap(session) {
  const profile = await stateRepository.readLearnerProfiles({
    role: session.role,
    studentId: session.studentId || "",
    guardianId: session.guardianId || "",
    teacherId: session.teacherId || "",
    learnerIds: session.role === "student" && session.studentId ? [session.studentId] : [],
    limit: 10000
  });
  const learnerIds = profile.learners.map((learner) => learner.id).filter(Boolean);
  const catalogLearnerId = session.role === "student" ? session.studentId || "" : "";
  const catalog = await stateRepository.readLearningCatalog({
    learnerId: catalogLearnerId,
    includeProgress: session.role === "student",
    limit: 10000
  });
  const catalogsByLearner = Object.fromEntries(
    await Promise.all(
      learnerIds.map(async (learnerId) => [
        learnerId,
        await stateRepository.readLearningCatalog({ learnerId, limit: 10000 })
      ])
    )
  );

  const visualAssets = ["student", "parent", "teacher", "school-admin", "platform-admin"].includes(session.role)
    ? await stateRepository.readVisualAssets({
        limit: session.role === "student" ? 10000 : 250,
        status: session.role === "student" ? "approved" : ""
      })
    : null;

  return {
    version: 1,
    source: "role-scoped-bootstrap",
    session: publicSessionSummary(session),
    repository: stateRepository.status(),
    scope: repositoryScopeForRole(session),
    learnerIds,
    learnerProfiles: profile,
    catalog,
    catalogsByLearner,
    visualAssets,
    compatibility: {
      broadStateRoute: "/api/state",
      status: "available-only-for-legacy-v2-v3-adapters",
      productionRule: "Student, parent, and teacher workflows should consume scoped bootstrap and feature routes."
    }
  };
}

async function enrichLiveCurriculumSourceAudit(result, log) {
  if (result.toolId !== "live_curriculum_source_audit" || !result.data?.approved) {
    return { result, log };
  }

  try {
    const live = await fetchApprovedSourceAudit({
      sourceUrl: result.data.sourceUrl,
      subject: result.data.subject,
      grade: result.data.grade,
      gradeBand: gradeBandForGrade(result.data.grade),
      lessonTitle: result.data.lessonTitle
    });
    const redesignTask = {
      id: `redesign-${result.data.lessonId}-live-source-${Date.now()}`,
      lessonId: result.data.lessonId,
      title: `Review live source evidence for ${result.data.lessonTitle}`,
      why: live.sourceLedger[0]?.troubleSignal || "A live curriculum source was checked and needs staff interpretation.",
      change: live.sourceLedger[0]?.redesignMove || "Use reviewed evidence to update lesson teaching support.",
      sourceIds: live.sourceLedger.map((source) => source.sourceId),
      status: "research-review",
      acceptanceCriteria: [
        "Staff reviewer confirms the source is appropriate for this grade and subject.",
        "Claim is rewritten in original curriculum language before publication.",
        "Lesson change passes truth, visual, accessibility, and manager review gates."
      ]
    };
    const data = {
      ...result.data,
      liveAudit: live.audit,
      sourceLedger: live.sourceLedger,
      redesignTasks: [redesignTask]
    };
    const enrichedResult = {
      ...result,
      summary: `Fetched ${live.audit.host} (${live.audit.httpStatus}) and extracted ${live.audit.snippets.length} evidence snippet(s) for review.`,
      nextAction: "Review source snippets, confirm the claim, then approve or reject the resulting redesign task before changing student-facing content.",
      requiresHumanReview: true,
      data
    };
    return {
      result: enrichedResult,
      log: {
        ...log,
        summary: enrichedResult.summary,
        payload: data
      }
    };
  } catch (error) {
    const data = {
      ...result.data,
      liveAudit: {
        url: result.data.sourceUrl,
        ok: false,
        error: error.message || "Live source audit failed.",
        checkedAt: new Date().toISOString()
      }
    };
    const failedResult = {
      ...result,
      summary: `Live source audit failed: ${data.liveAudit.error}`,
      nextAction: "Check the approved URL allowlist, source availability, and network access before retrying.",
      requiresHumanReview: true,
      data
    };
    return {
      result: failedResult,
      log: {
        ...log,
        summary: failedResult.summary,
        payload: data
      }
    };
  }
}

async function handleApi(request, response, pathname) {
  let session = await getRequestSessionAsync(request, process.env);
  const sendJson = (targetResponse, status, payload) =>
    writeJsonResponse(targetResponse, status, sanitizeScopedApiPayload(payload, session));
  if (request.method === "GET" && pathname === "/api/runtime/health") {
    requireAuthenticated(session);
    if (!["school-admin", "platform-admin"].includes(session.role)) {
      const error = new Error("Only school admins and platform admins can inspect runtime health.");
      error.status = 403;
      throw error;
    }
    const startedAt = Date.now();
    try {
      const rows = await stateRepository.readNormalizedTable("lessons", { limit: 1 });
      sendJson(response, 200, {
        healthy: true,
        checkedAt: new Date().toISOString(),
        latencyMs: Date.now() - startedAt,
        repository: stateRepository.status(),
        probe: { table: "lessons", rowsReturned: rows.length }
      });
    } catch (error) {
      sendJson(response, 503, {
        healthy: false,
        checkedAt: new Date().toISOString(),
        latencyMs: Date.now() - startedAt,
        repository: stateRepository.status(),
        probe: { table: "lessons", rowsReturned: 0 },
        error: "Repository health probe failed. Check server logs and DATABASE_URL configuration."
      });
    }
    return true;
  }
  const postgresRepository = stateRepository.status().mode === "postgres";
  const authState = postgresRepository ? {} : await ensureStateFile();
  const repositorySessionRevoked = session.authenticated ? await stateRepository.isSessionRevoked(session) : false;
  if (isSessionRevoked(authState, session) || repositorySessionRevoked) {
    session = revokedSession(session);
  }

  if (request.method === "GET" && pathname === "/api/auth/session") {
    const normalizedSecurity = postgresRepository ? await stateRepository.readAccountSecurity({ limit: 10000 }) : null;
    const security = normalizedSecurity
      ? (() => {
          const scoped = session.authenticated
            ? scopeAccountSecurityForSession(normalizedSecurity, session, {})
            : { summary: normalizedSecurity.summary, accounts: [] };
          return { ...(scoped.summary || {}), accounts: scoped.accounts || [] };
        })()
      : getAuthSecuritySummary(authState);
    sendJson(response, 200, {
      session: publicSessionSummary(session),
      security,
      repository: stateRepository.status(),
      openAiImages: getPlatformOpenAiImageReadiness(process.env),
      openAiTutor: getOpenAiTutorReadiness(process.env),
      giftCards: getGiftCardFulfillmentReadiness(process.env)
    });
    return true;
  }

  if (request.method === "GET" && pathname === "/api/auth/security") {
    requireAuthenticated(session);
    const url = new URL(request.url, `http://localhost:${port}`);
    const security = await stateRepository.readAccountSecurity({
      limit: url.searchParams.get("limit") || 10000
    });
    sendJson(response, 200, {
      repository: stateRepository.status(),
      session: publicSessionSummary(session),
      ...scopeAccountSecurityForSession(security, session, authState)
    });
    return true;
  }

  if (request.method === "POST" && pathname === "/api/auth/signup") {
    const body = await readJsonBody(request);
    if (useProviderAuth()) {
      if (!String(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim()) {
        const error = new Error("Provider signup requires SUPABASE_SECRET_KEY so the server can provision role claims securely.");
        error.status = 503;
        throw error;
      }
      const provider = normalizeSupabaseAuthResponse(await supabaseSignUp({
        email: body.email,
        password: body.password,
        role: body.role || "parent",
        displayName: body.displayName || body.name,
        redirectTo: body.redirectTo || process.env.AUTH_EMAIL_REDIRECT_TO
      }));
      const provisioned = await queueStateMutation(async () => {
        const state = await ensureStateFile();
        const registered = registerProviderAccount(state, {
          providerUser: provider.user,
          role: body.role || "parent",
          displayName: body.displayName || body.name,
          schoolId: body.schoolId || ""
        });
        if (!registered.result.accepted) return { state, result: registered.result };
        const claims = registered.result.sessionClaims;
        if (provider.user.id && process.env.SUPABASE_SECRET_KEY) {
          await supabaseSetAppMetadata(provider.user.id, {
            role: claims.role,
            userId: claims.userId,
            scope: claims.scope,
            ...(claims.guardianId ? { guardianId: claims.guardianId } : {}),
            ...(claims.teacherId ? { teacherId: claims.teacherId } : {}),
            ...(claims.schoolId ? { schoolId: claims.schoolId } : {})
          });
        }
        return {
          state: await writeAccountProvisioning(registered.state, registered.result.account.id),
          result: registered.result
        };
      });
      if (!provisioned.result.accepted) {
        sendJson(response, 400, { accepted: false, provider: "supabase", result: provisioned.result });
        return true;
      }
      const claims = provisioned.result.sessionClaims;
      const providerSession = provider.accessToken && claims.emailVerified
        ? { authenticated: true, productionAuth: true, authProvider: "supabase", ...claims }
        : { authenticated: false, productionAuth: true, authProvider: "supabase", role: "anonymous", scope: "none" };
      sendJson(response, 201, {
        accepted: true,
        provider: "supabase",
        requiresEmailVerification: !provider.user.emailVerified,
        token: claims.emailVerified ? provider.accessToken : "",
        refreshToken: claims.emailVerified ? provider.refreshToken : "",
        user: provider.user,
        account: provisioned.result.account,
        session: publicSessionSummary(providerSession)
      });
      return true;
    }
    const passwordRecord = createPasswordRecord(body.password);
    const verificationToken = createActionTokenRecord("verify");
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const registered = registerLocalAccount(state, {
        role: body.role,
        displayName: body.displayName,
        email: body.email,
        grade: body.grade,
        academyId: body.academyId,
        ...passwordRecord
      });
      if (!registered.result.accepted) {
        return { state, result: registered.result };
      }
      let nextState = registered.state;
      let emailVerification = null;
      if (registered.result.account.email && !registered.result.account.emailVerified) {
        const verification = createEmailVerificationRequest(nextState, {
          accountId: registered.result.account.id,
          requestedByUserId: registered.result.account.userId,
          ...verificationToken
        });
        nextState = verification.state;
        emailVerification = verification.result;
      }
      const claims = registered.result.sessionClaims;
      const token = createSessionToken(claims, getSessionSecret(process.env));
      return {
        state: await writeAccountProvisioning(nextState, registered.result.account.id),
        result: registered.result,
        emailVerification,
        devVerificationToken: emailVerification?.accepted && !emailVerification.alreadyVerified ? verificationToken.token : "",
        token,
        session: publicSessionSummary({ authenticated: true, devFallback: false, ...claims })
      };
    });
    sendJson(response, payload.result.accepted ? 200 : 400, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/auth/signin") {
    const body = await readJsonBody(request);
    if (useProviderAuth()) {
      const email = await resolveProviderLoginEmail(body);
      const raw = await supabaseSignIn({ email, password: body.password });
      const provider = normalizeSupabaseAuthResponse(raw);
      if (!provider.accessToken) throw new Error("Supabase Auth did not return an access token.");
      const verifiedUser = await supabaseGetUser(provider.accessToken);
      const normalizedUser = normalizeSupabaseAuthResponse({ ...raw, user: verifiedUser.user || raw.user });
      if (!normalizedUser.user.emailVerified) {
        const error = new Error("Email verification is required before app access.");
        error.status = 403;
        throw error;
      }
      const verifiedSession = await requireVerifiedProviderSession(
        provider.accessToken,
        "Supabase Auth did not return the required application role claims."
      );
      sendJson(response, 200, {
        accepted: true,
        provider: "supabase",
        token: provider.accessToken,
        refreshToken: provider.refreshToken,
        user: normalizedUser.user,
        session: publicSessionSummary(verifiedSession)
      });
      return true;
    }
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const account = findLocalAccountByLogin(state, body.login || body.email || body.username);
      if (!account || !verifyPassword(body.password, account)) {
        const error = new Error("Login or password is incorrect.");
        error.status = 401;
        throw error;
      }
      const claims = createSessionClaimsForAccount(account);
      const token = createSessionToken(claims, getSessionSecret(process.env));
      const nextState = {
        ...state,
        localAccounts: (state.localAccounts || []).map((item) =>
          item.id === account.id ? { ...item, lastSignedInAt: new Date().toISOString() } : item
        )
      };
      return {
        state: await writeAccountSecurity(nextState),
        result: {
          accepted: true,
          account: {
            id: account.id,
            userId: account.userId,
            role: account.role,
            displayName: account.displayName,
            email: account.email,
            emailVerified: Boolean(account.emailVerified),
            status: account.status || "active",
            studentId: account.studentId || "",
            guardianId: account.guardianId || "",
            teacherId: account.teacherId || "",
            schoolId: account.schoolId
          },
          sessionClaims: claims
        },
        token,
        session: publicSessionSummary({ authenticated: true, devFallback: false, ...claims })
      };
    });
    sendJson(response, 200, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/auth/refresh") {
    if (!useProviderAuth()) {
      sendJson(response, 400, { accepted: false, error: "Provider session refresh is only available in Supabase Auth mode." });
      return true;
    }
    const body = await readJsonBody(request);
    if (!String(body.refreshToken || "").trim()) {
      const error = new Error("A provider refresh token is required.");
      error.status = 401;
      throw error;
    }
    const raw = await supabaseRefreshSession({ refreshToken: body.refreshToken });
    const provider = normalizeSupabaseAuthResponse(raw);
    if (!provider.accessToken) throw new Error("Supabase Auth did not return a refreshed access token.");
    const refreshedSession = await getRequestSessionAsync(
      { headers: { authorization: `Bearer ${provider.accessToken}` } },
      process.env
    );
    if (!refreshedSession.authenticated) {
      const error = new Error(refreshedSession.authError || "The refreshed provider session could not be verified.");
      error.status = 401;
      throw error;
    }
    const refreshedSessionRevoked = isSessionRevoked(authState, refreshedSession) || await stateRepository.isSessionRevoked(refreshedSession);
    if (refreshedSessionRevoked) {
      await supabaseSignOut({ accessToken: provider.accessToken }).catch(() => {});
      const error = new Error("The provider session has been revoked. Sign in again.");
      error.status = 401;
      throw error;
    }
    sendJson(response, 200, {
      accepted: true,
      provider: "supabase",
      token: provider.accessToken,
      refreshToken: provider.refreshToken,
      user: provider.user,
      session: publicSessionSummary(refreshedSession)
    });
    return true;
  }

  if (request.method === "POST" && pathname === "/api/auth/request-email-verification") {
    const body = await readJsonBody(request);
    if (useProviderAuth()) {
      const result = await requestAuthProviderEmailVerification(body);
      sendJson(response, 200, { accepted: true, provider: "supabase", ...result, session: publicSessionSummary(session) });
      return true;
    }
    const verificationToken = createActionTokenRecord("verify");
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const requested = createEmailVerificationRequest(state, {
        accountId: body.accountId,
        login: body.login || body.email || body.username,
        userId: body.userId,
        requestedByUserId: session.userId || body.userId || "",
        ...verificationToken
      });
      if (!requested.result.accepted) {
        return { state, result: requested.result };
      }
      return {
        state: await writeAccountSecurity(requested.state),
        result: requested.result,
        devVerificationToken: requested.result.alreadyVerified ? "" : verificationToken.token,
        session: publicSessionSummary(session)
      };
    });
    sendJson(response, payload.result.accepted ? 200 : 400, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/auth/verify-email") {
    const body = await readJsonBody(request);
    if (useProviderAuth()) {
      const provider = normalizeSupabaseAuthResponse(await supabaseVerifyEmail({ tokenHash: body.token || body.tokenHash || body.code, type: body.type || "signup" }));
      const verifiedSession = provider.accessToken
        ? await requireVerifiedProviderSession(
            provider.accessToken,
            "Email verified, but Supabase Auth did not return the required application role claims."
          )
        : null;
      sendJson(response, 200, {
        accepted: true,
        provider: "supabase",
        token: provider.accessToken,
        refreshToken: provider.refreshToken,
        user: provider.user,
        session: publicSessionSummary(verifiedSession || {
          authenticated: false,
          productionAuth: true,
          authProvider: "supabase",
          role: "anonymous",
          scope: "none",
          userId: provider.user.id,
          email: provider.user.email,
          emailVerified: true
        })
      });
      return true;
    }
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const tokenHash = findPendingActionTokenHash(state.emailVerificationRequests || [], body.token || body.code);
      const verified = verifyLocalAccountEmail(state, { tokenHash });
      if (!verified.result.accepted) {
        return { state, result: verified.result };
      }
      const account = (verified.state.localAccounts || []).find((item) => item.id === verified.result.account.id);
      const claims = createSessionClaimsForAccount(account || verified.result.account);
      const token = createSessionToken(claims, getSessionSecret(process.env));
      return {
        state: await writeAccountSecurity(verified.state),
        result: verified.result,
        token,
        session: publicSessionSummary({ authenticated: true, devFallback: false, ...claims })
      };
    });
    sendJson(response, payload.result.accepted ? 200 : 400, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/auth/request-password-reset") {
    const body = await readJsonBody(request);
    if (useProviderAuth()) {
      await supabaseRequestPasswordReset({ email: body.email || body.login, redirectTo: body.redirectTo || process.env.AUTH_PASSWORD_RESET_REDIRECT_TO });
      sendJson(response, 200, { accepted: true, provider: "supabase", message: "If the account exists, a password reset email has been sent.", session: publicSessionSummary(session) });
      return true;
    }
    const resetToken = createActionTokenRecord("reset");
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const requested = createPasswordResetRequest(state, {
        login: body.login || body.email || body.username,
        requestedByUserId: session.userId || "",
        ...resetToken
      });
      if (!requested.result.accepted) {
        return { state, result: requested.result };
      }
      return {
        state: requested.result.accountFound ? await writeAccountSecurity(requested.state) : state,
        result: requested.result,
        devResetToken: requested.result.accountFound ? resetToken.token : "",
        session: publicSessionSummary(session)
      };
    });
    sendJson(response, payload.result.accepted ? 200 : 400, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/auth/reset-password") {
    const body = await readJsonBody(request);
    if (useProviderAuth()) {
      if (!body.accessToken) {
        const error = new Error("A provider access token from the password-reset link is required to set a new password.");
        error.status = 400;
        throw error;
      }
      await supabaseUpdatePassword({ accessToken: body.accessToken, password: body.password || body.newPassword });
      const resetUser = await supabaseGetUser(body.accessToken);
      const resetUserId = String(resetUser.user?.id || "");
      let revocation = null;
      if (resetUserId) {
        const revoked = revokeAccountSession({ sessionRevocations: [] }, {
          userId: resetUserId,
          revokeAll: true,
          reason: "password reset",
          actorUserId: resetUserId
        });
        revocation = revoked.result.revocation;
        await writeSessionRevocation(revoked.state, revocation.id);
      }
      sendJson(response, 200, { accepted: true, provider: "supabase", message: "Password updated. Sign in again.", session: publicSessionSummary(revokedSession(session, "Password reset completed.")) });
      return true;
    }
    const passwordRecord = createPasswordRecord(body.password || body.newPassword);
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const tokenHash = findPendingActionTokenHash(state.passwordResetRequests || [], body.token || body.code);
      const reset = resetLocalAccountPassword(state, {
        tokenHash,
        ...passwordRecord
      });
      if (!reset.result.accepted) {
        return { state, result: reset.result };
      }
      return {
        state: await writeAccountSecurity(reset.state),
        result: reset.result,
        session: publicSessionSummary(revokedSession(session, "Password reset completed. Sign in again."))
      };
    });
    sendJson(response, payload.result.accepted ? 200 : 400, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/auth/revoke-session") {
    const body = await readJsonBody(request);
    if (useProviderAuth()) {
      const targetUserId = String(body.userId || session.userId || "");
      requireAuthOwnerOrAdmin(session, targetUserId);
      const accessToken = String(body.accessToken || getBearerTokenFromRequest(request) || "");
      if (!accessToken) {
        const error = new Error("A provider access token is required to revoke the current session.");
        error.status = 401;
        throw error;
      }
      // Supabase's /logout endpoint revokes all refresh tokens for the user.
      // A local request must stay local: our session-revocation record and
      // request middleware enforce the current session without killing other devices.
      if (body.revokeAll) await supabaseSignOut({ accessToken });
      const revoked = await queueStateMutation(async () => {
        const state = stateRepository.status().mode === "postgres" ? { sessionRevocations: [] } : await ensureStateFile();
        const result = revokeAccountSession(state, {
          userId: targetUserId,
          sessionId: body.sessionId || session.sessionId || "",
          revokeAll: Boolean(body.revokeAll),
          reason: body.reason || (body.revokeAll ? "user requested all-session revocation" : "user requested session revocation"),
          actorUserId: session.userId || targetUserId
        });
        if (!result.result.accepted) return result;
        return { ...result, state: await writeSessionRevocation(result.state, result.result.revocation.id) };
      });
      sendJson(response, revoked.result.accepted ? 200 : 400, { accepted: revoked.result.accepted, provider: "supabase", revoked: revoked.result.accepted, result: revoked.result, session: publicSessionSummary(revokedSession(session, body.reason || "Session revoked.")) });
      return true;
    }
    const targetUserId = String(body.userId || session.userId || "");
    requireAuthOwnerOrAdmin(session, targetUserId);
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const revoked = revokeAccountSession(state, {
        userId: targetUserId,
        sessionId: body.sessionId || session.sessionId || "",
        revokeAll: Boolean(body.revokeAll),
        reason: body.reason || (body.revokeAll ? "user requested all-session revocation" : "user requested session revocation"),
        actorUserId: session.userId || targetUserId
      });
      if (!revoked.result.accepted) {
        return { state, result: revoked.result };
      }
      return {
        state: await writeAccountSecurity(revoked.state),
        result: revoked.result,
        session: publicSessionSummary(revokedSession(session))
      };
    });
    sendJson(response, payload.result.accepted ? 200 : 400, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/auth/child-account") {
    const body = await readJsonBody(request);
    if (!session.authenticated || !["parent", "school-admin", "platform-admin"].includes(session.role)) {
      const error = new Error("A parent or admin session is required to create a child account.");
      error.status = 403;
      throw error;
    }
    if (session.role === "parent" && !session.emailVerified) {
      const error = new Error("Parent email verification is required before creating child accounts.");
      error.status = 403;
      throw error;
    }
    if (useProviderAuth()) {
      const childEmail = providerChildEmail(body.username || body.childUsername);
      let providerUser = null;
      try {
        const created = await supabaseAdminCreateUser({
          email: childEmail,
          password: body.password,
          emailConfirm: true,
          userMetadata: {
            display_name: body.displayName || body.childName || "",
            username: body.username || body.childUsername || ""
          },
          appMetadata: {
            role: "student",
            scope: "own",
            guardianId: session.guardianId || "",
            schoolId: session.schoolId || ""
          }
        });
        providerUser = normalizeSupabaseAuthResponse(created).user;
        if (!providerUser.id) throw new Error("Supabase did not return the new child user id.");
        const child = await queueStateMutation(async () => {
          const state = await ensureStateFile();
          const childAccount = createParentManagedChildAccount(state, {
            parentSession: session,
            displayName: body.displayName || body.childName,
            username: body.username || body.childUsername,
            email: childEmail,
            grade: body.grade,
            academyId: body.academyId,
            accommodations: body.accommodations,
            aiHelper: body.aiHelper,
            authProvider: "supabase",
            providerSubject: providerUser.id,
            userId: providerUser.id,
            emailVerified: true
          });
          if (!childAccount.result.accepted) return { state, result: childAccount.result };
          const nextState = await writeAccountProvisioning(childAccount.state, childAccount.result.account.id);
          const claims = childAccount.result.sessionClaims;
          if (process.env.SUPABASE_SECRET_KEY) {
            await supabaseSetAppMetadata(providerUser.id, {
              role: "student",
              userId: claims.userId,
              studentId: claims.studentId,
              guardianId: claims.guardianId || session.guardianId || "",
              scope: "own",
              ...(claims.schoolId ? { schoolId: claims.schoolId } : {})
            });
          }
          return { state: nextState, result: childAccount.result };
        });
        if (!child.result.accepted) {
          await supabaseAdminDeleteUser(providerUser.id).catch(() => {});
          sendJson(response, 400, { accepted: false, provider: "supabase", result: child.result });
          return true;
        }
        sendJson(response, 201, {
          accepted: true,
          provider: "supabase",
          account: child.result.account,
          childLogin: child.result.childLogin,
          user: providerUser,
          session: publicSessionSummary(session)
        });
        return true;
      } catch (error) {
        if (providerUser?.id) await supabaseAdminDeleteUser(providerUser.id).catch(() => {});
        throw error;
      }
    }
    const passwordRecord = createPasswordRecord(body.password);
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const childAccount = createParentManagedChildAccount(state, {
        parentSession: session,
        displayName: body.displayName || body.childName,
        username: body.username || body.childUsername,
        grade: body.grade,
        academyId: body.academyId,
        accommodations: body.accommodations,
        aiHelper: body.aiHelper,
        ...passwordRecord
      });
      if (!childAccount.result.accepted) {
        return { state, result: childAccount.result };
      }
      return {
        state: await writeAccountProvisioning(childAccount.state, childAccount.result.account.id),
        result: childAccount.result,
        session: publicSessionSummary(session)
      };
    });
    sendJson(response, payload.result.accepted ? 200 : 400, payload);
    return true;
  }

  if (request.method === "GET" && pathname === "/api/system/repository") {
    sendJson(response, 200, {
      repository: stateRepository.status(),
      session: publicSessionSummary(session)
    });
    return true;
  }

  if (request.method === "GET" && pathname === "/api/system/repository/normalized-plan") {
    requireRepositoryPermission(session, "audit_events", "read", "platform");
    const state = await ensureStateFile();
    const plan = createNormalizedStateUpsertSql(state);
    sendJson(response, 200, {
      repository: stateRepository.status(),
      projectionSummary: plan.projectionSummary,
      rowCounts: plan.rowCounts,
      tableIds: plan.tableIds,
      sqlPreview: plan.sql.split("\n").slice(0, 28).join("\n")
    });
    return true;
  }

  if (request.method === "GET" && pathname === "/api/repository/tables") {
    requireRepositoryPermission(session, "audit_events", "read", "platform");
    sendJson(response, 200, {
      repository: stateRepository.status(),
      summary: await stateRepository.readNormalizedTableSummary()
    });
    return true;
  }

  if (request.method === "GET" && pathname.startsWith("/api/repository/tables/")) {
    const tableId = decodeURIComponent(pathname.slice("/api/repository/tables/".length));
    requireRepositoryPermission(session, tableId, "read", session.scope);
    const limit = new URL(request.url, `http://localhost:${port}`).searchParams.get("limit");
    const rows = await stateRepository.readNormalizedTable(tableId, { limit });
    sendJson(response, 200, {
      repository: stateRepository.status(),
      tableId,
      count: rows.length,
      rows
    });
    return true;
  }

  if (request.method === "GET" && pathname === "/api/curriculum/library") {
    sendJson(response, 200, {
      summary: getPlatformLessonLibrarySummary(),
      samples: getPlatformLessonLibrarySamples(18)
    });
    return true;
  }

  if (request.method === "GET" && pathname === "/api/openai/image-readiness") {
    sendJson(response, 200, getPlatformOpenAiImageReadiness(process.env));
    return true;
  }

  if (request.method === "GET" && pathname === "/api/runtime/configuration") {
    sendJson(response, 200, {
      runtime: getRuntimeConfigurationStatus(process.env),
      repository: stateRepository.status()
    });
    return true;
  }

  requireAuthenticated(session);

  if (request.method === "GET" && pathname === "/api/bootstrap") {
    for (const tableId of ["lessons", "lesson_progress", "mastery_records", "lesson_scratchpads", "interactive_skill_evidence", "quiz_attempts", ...learnerProfileRepositoryTableIds]) {
      requireRepositoryPermission(session, tableId, "read", session.scope);
    }
    requireRepositoryPermission(session, "visual_assets", "read", session.scope);
    sendJson(response, 200, await readRoleScopedBootstrap(session));
    return true;
  }

  if (request.method === "GET" && pathname === "/api/system/state-dependencies") {
    requireRepositoryPermission(session, "audit_events", "read", "platform");
    sendJson(response, 200, {
      repository: stateRepository.status(),
      session: publicSessionSummary(session),
      audit: getStateDependencyAudit()
    });
    return true;
  }

  if (request.method === "GET" && pathname === "/api/state") {
    requireLegacySnapshotAccess(session, "read");
    sendJson(response, 200, { state: await ensureStateFile(), session: publicSessionSummary(session), repository: stateRepository.status() });
    return true;
  }

  if (request.method === "PUT" && pathname === "/api/state") {
    requireLegacySnapshotAccess(session, "write");
    const body = await readJsonBody(request);
    const payload = await queueStateMutation(async () => ({ state: await writeState(body.state || body) }));
    sendJson(response, 200, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/state/reset") {
    requireLegacySnapshotAccess(session, "write");
    const payload = await queueStateMutation(async () => ({ state: await writeState(createInitialState()) }));
    sendJson(response, 200, payload);
    return true;
  }

  if (request.method === "GET" && pathname === "/api/classroom/monitor") {
    requireClassroomStaff(session, "class_sessions", "read");
    requireRepositoryPermission(session, "group_missions", "read", repositoryScopeForRole(session));
    requireRepositoryPermission(session, "group_artifacts", "read", repositoryScopeForRole(session));
    requireRepositoryPermission(session, "teacher_interventions", "read", repositoryScopeForRole(session));
    const url = new URL(request.url, `http://localhost:${port}`);
    const classSectionId = url.searchParams.get("classSectionId") || "";
    const monitor = await stateRepository.readClassroomMonitor({
      limit: url.searchParams.get("limit") || 10000,
      classSectionId,
      teacherId: url.searchParams.get("teacherId") || (session.role === "teacher" ? session.teacherId || "" : "")
    });
    sendJson(response, 200, {
      repository: stateRepository.status(),
      session: publicSessionSummary(session),
      monitor,
      fallbackMonitor:
        stateRepository.status().mode === "json"
          ? getTeacherClassMonitor(await ensureStateFile(), classSectionId)
          : null
    });
    return true;
  }

  if (request.method === "GET" && pathname === "/api/classroom/student") {
    requireRepositoryPermission(session, "class_sessions", "read", repositoryScopeForRole(session));
    requireRepositoryPermission(session, "group_missions", "read", repositoryScopeForRole(session));
    requireRepositoryPermission(session, "group_artifacts", "read", repositoryScopeForRole(session));
    const url = new URL(request.url, `http://localhost:${port}`);
    let learnerId = String(url.searchParams.get("learnerId") || session.studentId || "");
    if (session.role === "student") {
      learnerId = session.studentId;
    }
    if (learnerId) {
      await requireLearnerReadAccess(session, state, learnerId, "student classroom session");
    }
    const classroom = await stateRepository.readLearnerClassSession({
      limit: url.searchParams.get("limit") || 10000,
      learnerId
    });
    sendJson(response, 200, {
      repository: stateRepository.status(),
      session: publicSessionSummary(session),
      ...classroom,
      fallbackClassroom:
        stateRepository.status().mode === "json"
          ? getLearnerClassSession(await ensureStateFile(), learnerId)
          : null
    });
    return true;
  }

  if (request.method === "GET" && pathname === "/api/classroom/evidence") {
    requireClassroomStaff(session, "class_sessions", "read");
    requireRepositoryPermission(session, "group_missions", "read", repositoryScopeForRole(session));
    requireRepositoryPermission(session, "group_artifacts", "read", repositoryScopeForRole(session));
    requireRepositoryPermission(session, "teacher_interventions", "read", repositoryScopeForRole(session));
    const url = new URL(request.url, `http://localhost:${port}`);
    const state = stateRepository.status().mode === "json" ? await ensureStateFile() : {};
    const learnerId = url.searchParams.get("learnerId") || "";
    if (learnerId) {
      await requireLearnerReadAccess(session, state, learnerId, "classroom evidence");
    }
    const evidence = await stateRepository.readClassroomEvidence({
      limit: url.searchParams.get("limit") || 10000,
      learnerId,
      classSessionId: url.searchParams.get("classSessionId") || "",
      lessonId: url.searchParams.get("lessonId") || "",
      classSectionId: url.searchParams.get("classSectionId") || ""
    });
    sendJson(response, 200, {
      repository: stateRepository.status(),
      session: publicSessionSummary(session),
      ...evidence
    });
    return true;
  }

  if (request.method === "POST" && pathname === "/api/classroom/session/status") {
    requireClassroomStaff(session, "class_sessions", "write");
    const body = await readJsonBody(request);
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const updated = updateClassSessionStatus(state, body);
      if (!updated.result.accepted) {
        return { state, result: updated.result, repository: stateRepository.status() };
      }
      const persisted = await writeClassroomWorkflow(updated.state);
      return {
        state: persisted,
        result: updated.result,
        monitor: getTeacherClassMonitor(persisted, body.classSectionId || ""),
        repository: stateRepository.status()
      };
    });
    sendJson(response, payload.result.accepted ? 200 : 400, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/classroom/artifact") {
    const body = await readJsonBody(request);
    const learnerId = String(body.learnerId || body.studentId || session.studentId || "");
    if (session.role === "student" && learnerId !== session.studentId) {
      const error = new Error("Students can only submit their own class mission evidence.");
      error.status = 403;
      throw error;
    }
    requireRepositoryPermission(session, "group_artifacts", "write", repositoryScopeForRole(session));
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const submitted = submitClassroomArtifact(state, { ...body, learnerId });
      if (!submitted.result.accepted) {
        return { state, result: submitted.result, repository: stateRepository.status() };
      }
      const persisted = await writeClassroomWorkflow(submitted.state);
      return {
        state: persisted,
        result: submitted.result,
        classroom: getLearnerClassSession(persisted, learnerId),
        repository: stateRepository.status()
      };
    });
    sendJson(response, payload.result.accepted ? 200 : 400, payload);
    return true;
  }

  if (request.method === "PUT" && pathname === "/api/classroom/mission") {
    requireClassroomStaff(session, "group_missions", "write");
    const body = await readJsonBody(request);
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const updated = updateGroupMission(state, body);
      if (!updated.result.accepted) {
        return { state, result: updated.result, repository: stateRepository.status() };
      }
      const persisted = await writeClassroomWorkflow(updated.state);
      const missionSession = persisted.classSessions?.find((item) => item.id === updated.result.mission.sessionId);
      return {
        state: persisted,
        result: updated.result,
        monitor: getTeacherClassMonitor(persisted, missionSession?.classSectionId || ""),
        repository: stateRepository.status()
      };
    });
    sendJson(response, payload.result.accepted ? 200 : 400, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/classroom/intervention") {
    requireClassroomStaff(session, "teacher_interventions", "write");
    const body = await readJsonBody(request);
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const recorded = recordTeacherIntervention(state, {
        ...body,
        teacherId: body.teacherId || session.teacherId || "teacher-demo-1"
      });
      if (!recorded.result.accepted) {
        return { state, result: recorded.result, repository: stateRepository.status() };
      }
      const persisted = await writeClassroomWorkflow(recorded.state);
      return {
        state: persisted,
        result: recorded.result,
        monitor: getTeacherClassMonitor(persisted, body.classSectionId || ""),
        repository: stateRepository.status()
      };
    });
    sendJson(response, payload.result.accepted ? 200 : 400, payload);
    return true;
  }

  if (request.method === "GET" && pathname === "/api/school/overview") {
    requireSchoolAdmin(session, "classes", "read");
    requireSchoolAdmin(session, "students", "read");
    requireSchoolAdmin(session, "enrollments", "read");
    requireSchoolAdmin(session, "account_invitations", "read");
    requireSchoolAdmin(session, "school_reports", "read");
    const url = new URL(request.url, `http://localhost:${port}`);
    const school = await stateRepository.readSchoolOperations({
      limit: url.searchParams.get("limit") || 10000,
      schoolId: url.searchParams.get("schoolId") || session.schoolId || "",
      teacherId: url.searchParams.get("teacherId") || ""
    });
    sendJson(response, 200, {
      repository: stateRepository.status(),
      session: publicSessionSummary(session),
      ...school,
      rosterImport: getSchoolRosterImportContract()
    });
    return true;
  }

  if (request.method === "GET" && pathname === "/api/school/roster/export") {
    requireSchoolAdmin(session, "enrollments", "read");
    requireSchoolAdmin(session, "classes", "read");
    const schoolId = session.schoolId || "school-demo-1";
    const operations = await stateRepository.readSchoolOperations({ schoolId, limit: 10000 });
    sendCsv(response, 200, exportRepositoryRosterCsv(operations), `school-roster-${schoolId}.csv`);
    return true;
  }

  if (request.method === "GET" && pathname === "/api/school/reports/export") {
    requireSchoolAdmin(session, "school_reports", "read");
    const schoolId = session.schoolId || "school-demo-1";
    const operations = await stateRepository.readSchoolOperations({ schoolId, limit: 10000 });
    sendCsv(response, 200, formatSchoolReportSnapshotsCsv({ reports: operations.reports || [] }), `school-reports-${schoolId}.csv`);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/school/roster/import") {
    requireSchoolAdmin(session, "students", "write");
    requireSchoolAdmin(session, "classes", "write");
    requireSchoolAdmin(session, "enrollments", "write");
    requireSchoolAdmin(session, "account_invitations", "write");
    const body = await readJsonBody(request);
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const imported = importSchoolRoster(state, {
        csv: body.csv || body.rosterCsv || "",
        schoolId: session.schoolId || state.schoolProfile?.id || "school-demo-1",
        invitedByUserId: session.userId || "user-platform-admin"
      });
      if (!imported.result.accepted) {
        return { state, result: imported.result, repository: stateRepository.status() };
      }
      const persisted = await writeSchoolOperations(imported.state);
      return {
        state: persisted,
        result: imported.result,
        classes: persisted.classSections || [],
        learners: persisted.learners || [],
        pendingInvitations: (persisted.accountInvitations || []).filter((item) => item.status === "pending"),
        repository: stateRepository.status()
      };
    });
    sendJson(response, payload.result.accepted ? 200 : 400, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/school/class") {
    requireSchoolAdmin(session, "classes", "write");
    requireSchoolAdmin(session, "teacher_class_assignments", "write");
    const body = await readJsonBody(request);
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const created = createSchoolClass(state, {
        ...body,
        schoolId: body.schoolId || session.schoolId || state.schoolProfile?.id
      });
      if (!created.result.accepted) {
        return { state, result: created.result, repository: stateRepository.status() };
      }
      const persisted = await writeSchoolOperations(created.state);
      return {
        state: persisted,
        result: created.result,
        classes: persisted.classSections || [],
        repository: stateRepository.status()
      };
    });
    sendJson(response, payload.result.accepted ? 200 : 400, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/school/enrollment") {
    requireSchoolAdmin(session, "enrollments", "write");
    requireSchoolAdmin(session, "classes", "write");
    const body = await readJsonBody(request);
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const enrolled = enrollLearnerInSchoolClass(state, body);
      if (!enrolled.result.accepted) {
        return { state, result: enrolled.result, repository: stateRepository.status() };
      }
      const persisted = await writeSchoolOperations(enrolled.state);
      return {
        state: persisted,
        result: enrolled.result,
        classes: persisted.classSections || [],
        repository: stateRepository.status()
      };
    });
    sendJson(response, payload.result.accepted ? 200 : 400, payload);
    return true;
  }

  if (request.method === "GET" && pathname === "/api/content/drafts") {
    requireRepositoryPermission(session, "content_drafts", "read", session.scope);
    const url = new URL(request.url, `http://localhost:${port}`);
    const drafts = await stateRepository.readContentDrafts({
      limit: url.searchParams.get("limit") || 10000,
      status: url.searchParams.get("status") || ""
    });
    sendJson(response, 200, {
      repository: stateRepository.status(),
      session: publicSessionSummary(session),
      ...drafts
    });
    return true;
  }

  if (request.method === "GET" && pathname === "/api/learning/catalog") {
    requireRepositoryPermission(session, "lessons", "read", session.scope);
    requireRepositoryPermission(session, "lesson_progress", "read", session.scope);
    requireRepositoryPermission(session, "mastery_records", "read", session.scope);
    requireRepositoryPermission(session, "lesson_scratchpads", "read", session.scope);
    requireRepositoryPermission(session, "interactive_skill_evidence", "read", session.scope);
    requireRepositoryPermission(session, "quiz_attempts", "read", session.scope);
    const url = new URL(request.url, `http://localhost:${port}`);
    const state = stateRepository.status().mode === "json" ? await ensureStateFile() : {};
    const requestedLearnerId = url.searchParams.get("learnerId");
    let learnerId = requestedLearnerId === null ? "" : String(requestedLearnerId);
    if (session.role === "student") {
      if (learnerId && learnerId !== session.studentId) {
        const error = new Error("Students can only read their own learning catalog progress.");
        error.status = 403;
        throw error;
      }
      learnerId = session.studentId;
    } else if (["parent", "teacher"].includes(session.role)) {
      if (!learnerId) {
        const error = new Error("A learnerId is required for scoped learning catalog reads.");
        error.status = 400;
        throw error;
      }
      await requireLearnerReadAccess(session, state, learnerId, "learning catalog progress");
    } else if (learnerId) {
      await requireLearnerReadAccess(session, state, learnerId, "learning catalog progress");
    }
    const limit = url.searchParams.get("limit") || 10000;
    const catalog = await stateRepository.readLearningCatalog({ learnerId, limit });
    sendJson(response, 200, {
      repository: stateRepository.status(),
      session: publicSessionSummary(session),
      catalog
    });
    return true;
  }

  if (request.method === "GET" && pathname === "/api/learning/scratchpads") {
    requireRepositoryPermission(session, "lesson_scratchpads", "read", repositoryScopeForRole(session));
    const url = new URL(request.url, `http://localhost:${port}`);
    const state = stateRepository.status().mode === "json" ? await ensureStateFile() : {};
    let learnerId = url.searchParams.get("learnerId") || "";
    if (session.role === "student") {
      learnerId = session.studentId;
    } else if (["parent", "teacher"].includes(session.role) && !learnerId) {
      const error = new Error("A learnerId is required for scoped scratchpad reads.");
      error.status = 400;
      throw error;
    } else if (learnerId) {
      await requireLearnerReadAccess(session, state, learnerId, "lesson scratchpads");
    }
    const scratchpads = await stateRepository.readLessonScratchpads({
      limit: url.searchParams.get("limit") || 10000,
      learnerId,
      lessonId: url.searchParams.get("lessonId") || ""
    });
    sendJson(response, 200, {
      repository: stateRepository.status(),
      session: publicSessionSummary(session),
      ...scratchpads
    });
    return true;
  }

  if (request.method === "GET" && pathname === "/api/learning/events") {
    requireRepositoryPermission(session, "learning_events", "read", repositoryScopeForRole(session));
    const url = new URL(request.url, `http://localhost:${port}`);
    const state = stateRepository.status().mode === "json" ? await ensureStateFile() : {};
    let learnerId = url.searchParams.get("learnerId") || "";
    if (session.role === "student") {
      learnerId = session.studentId;
    } else if (["parent", "teacher"].includes(session.role) && !learnerId) {
      const error = new Error("A learnerId is required for scoped learning-event reads.");
      error.status = 400;
      throw error;
    } else if (learnerId) {
      await requireLearnerReadAccess(session, state, learnerId, "learning events");
    }
    const events = await stateRepository.readLearningEvents({
      limit: url.searchParams.get("limit") || 200,
      learnerId
    });
    sendJson(response, 200, {
      repository: stateRepository.status(),
      session: publicSessionSummary(session),
      ...events
    });
    return true;
  }

  if (request.method === "GET" && pathname === "/api/learning/assignments") {
    requireRepositoryPermission(session, "assignments", "read", repositoryScopeForRole(session));
    const url = new URL(request.url, `http://localhost:${port}`);
    const state = stateRepository.status().mode === "json" ? await ensureStateFile() : {};
    let learnerId = url.searchParams.get("learnerId") || "";
    if (session.role === "student") {
      learnerId = session.studentId;
    } else if (["parent", "teacher"].includes(session.role) && !learnerId) {
      const error = new Error("A learnerId is required for scoped assignment reads.");
      error.status = 400;
      throw error;
    } else if (learnerId) {
      await requireLearnerReadAccess(session, state, learnerId, "assignments");
    }
    const assignments = await stateRepository.readAssignments({
      limit: url.searchParams.get("limit") || 10000,
      learnerId,
      status: url.searchParams.get("status") || ""
    });
    sendJson(response, 200, {
      repository: stateRepository.status(),
      session: publicSessionSummary(session),
      ...assignments
    });
    return true;
  }

  if (request.method === "GET" && pathname === "/api/learning/retention-schedules") {
    requireRepositoryPermission(session, "retention_schedules", "read", repositoryScopeForRole(session));
    const url = new URL(request.url, `http://localhost:${port}`);
    const state = stateRepository.status().mode === "json" ? await ensureStateFile() : {};
    let learnerId = url.searchParams.get("learnerId") || "";
    if (session.role === "student") {
      learnerId = session.studentId;
    } else if (["parent", "teacher"].includes(session.role) && !learnerId) {
      const error = new Error("A learnerId is required for scoped retention schedule reads.");
      error.status = 400;
      throw error;
    } else if (learnerId) {
      await requireLearnerReadAccess(session, state, learnerId, "retention schedules");
    }
    const schedules = await stateRepository.readRetentionSchedules({
      limit: url.searchParams.get("limit") || 10000,
      learnerId,
      lessonId: url.searchParams.get("lessonId") || ""
    });
    sendJson(response, 200, {
      repository: stateRepository.status(),
      session: publicSessionSummary(session),
      ...schedules
    });
    return true;
  }

  if (request.method === "GET" && pathname === "/api/learning/portfolio-evidence") {
    requireRepositoryPermission(session, "portfolio_items", "read", repositoryScopeForRole(session));
    requireRepositoryPermission(session, "student_badges", "read", repositoryScopeForRole(session));
    requireRepositoryPermission(session, "badges", "read", repositoryScopeForRole(session));
    const url = new URL(request.url, `http://localhost:${port}`);
    const state = stateRepository.status().mode === "json" ? await ensureStateFile() : {};
    let learnerId = url.searchParams.get("learnerId") || "";
    if (session.role === "student") {
      learnerId = session.studentId;
    } else if (["parent", "teacher"].includes(session.role) && !learnerId) {
      const error = new Error("A learnerId is required for scoped portfolio evidence reads.");
      error.status = 400;
      throw error;
    } else if (learnerId) {
      await requireLearnerReadAccess(session, state, learnerId, "portfolio and badge evidence");
    }
    const evidence = await stateRepository.readPortfolioEvidence({
      limit: url.searchParams.get("limit") || 10000,
      learnerId,
      lessonId: url.searchParams.get("lessonId") || ""
    });
    sendJson(response, 200, {
      repository: stateRepository.status(),
      session: publicSessionSummary(session),
      ...evidence
    });
    return true;
  }

  if (request.method === "POST" && pathname === "/api/learning/quiz") {
    const body = await readJsonBody(request);
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const lessonId = String(body.lessonId || state.selectedLessonId || "g3-fractions-number-line");
      const lesson = findLessonInState(state, lessonId);
      const learnerId = String(body.learnerId || (session.role === "student" ? session.studentId : learnerIdForLesson(lesson)));
      requireLearningEvidenceAccess(session, state, learnerId);
      const answers = body.answers && typeof body.answers === "object" ? body.answers : {};
      const nextState = completeLessonQuiz(state, lessonId, answers, { learnerId });
      const persisted = await writeLearningEvidence(nextState);
      return {
        state: persisted,
        result: persisted.quizResults?.[lessonId] || nextState.quizResults?.[lessonId],
        repository: stateRepository.status()
      };
    });
    sendJson(response, 200, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/learning/scratchpad") {
    const body = await readJsonBody(request);
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const lessonId = String(body.lessonId || state.selectedLessonId || "g3-fractions-number-line");
      const lesson = findLessonInState(state, lessonId);
      const learnerId = String(body.learnerId || (session.role === "student" ? session.studentId : learnerIdForLesson(lesson)));
      requireLearningEvidenceAccess(session, state, learnerId);
      const nextState = updateLessonScratchpad(state, {
        learnerId,
        lessonId,
        firstStep: body.firstStep,
        explanation: body.explanation,
        confusion: body.confusion
      });
      const withRetryEvidence =
        body.retryAfterHint !== undefined
          ? submitTutorHintRetry(nextState, {
              learnerId,
              lessonId,
              retryAfterHint: body.retryAfterHint
            }).state
          : nextState;
      return {
        state: await writeLearningEvidence(withRetryEvidence),
        scratchpad: withRetryEvidence.lessonScratchpads?.[learnerId]?.[lessonId] || null,
        repository: stateRepository.status()
      };
    });
    sendJson(response, 200, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/learning/interactive") {
    const body = await readJsonBody(request);
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const lessonId = String(body.lessonId || state.selectedLessonId || "g3-fractions-number-line");
      const lesson = findLessonInState(state, lessonId);
      const learnerId = String(body.learnerId || (session.role === "student" ? session.studentId : learnerIdForLesson(lesson)));
      requireLearningEvidenceAccess(session, state, learnerId);
      const nextState = recordInteractiveResponse(state, {
        learnerId,
        lessonId,
        widgetId: body.widgetId,
        value: body.value,
        correct: body.correct,
        feedback: body.feedback
      });
      const persisted = await writeLearningEvidence(nextState);
      return {
        state: persisted,
        response: persisted.interactiveResponses?.[learnerId]?.[lessonId]?.[body.widgetId] || nextState.interactiveResponses?.[learnerId]?.[lessonId]?.[body.widgetId] || null,
        repository: stateRepository.status()
      };
    });
    sendJson(response, 200, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/rewards/request") {
    const body = await readJsonBody(request);
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const learnerId = String(body.learnerId || session.studentId || "");
      requireLearningEvidenceAccess(session, state, learnerId);
      const requested = requestRewardApproval(state, {
        learnerId,
        rewardLevel: body.rewardLevel,
        rewardTitle: body.rewardTitle,
        rewardBenefit: body.rewardBenefit,
        requestedBy: session.displayName || body.requestedBy || "",
        note: body.note,
        source: body.source || "api"
      });
      return {
        state: await writeRewardWorkflow(requested.state),
        result: requested.result,
        repository: stateRepository.status()
      };
    });
    sendJson(response, payload.result.accepted ? 200 : 400, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/rewards/decision") {
    const body = await readJsonBody(request);
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const requestRecord = (state.rewardApprovals || []).find((item) => item.id === body.requestId);
      if (!requestRecord) {
        return {
          state,
          result: {
            accepted: false,
            reason: "Reward request was not found."
          },
          repository: stateRepository.status()
        };
      }
      await requireRewardDecisionAccess(session, state, requestRecord);
      const decided = updateRewardApprovalStatus(state, {
        requestId: body.requestId,
        status: body.status,
        reviewedBy: session.displayName || "Parent",
        note: body.note
      });
      return {
        state: await writeRewardWorkflow(decided.state),
        result: decided.result,
        repository: stateRepository.status()
      };
    });
    sendJson(response, payload.result.accepted ? 200 : 400, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/rewards/fulfill") {
    const body = await readJsonBody(request);
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const requestRecord = (state.rewardApprovals || []).find((item) => item.id === body.requestId);
      if (!requestRecord) {
        return {
          state,
          result: {
            accepted: false,
            reason: "Reward request was not found."
          },
          giftCards: getGiftCardFulfillmentReadiness(process.env)
        };
      }
      await requireRewardDecisionAccess(session, state, requestRecord);
      const fulfilled = await fulfillGiftCardReward({
        request: requestRecord,
        state,
        env: process.env,
        recipientEmail: body.recipientEmail || session.email,
        recipientName: body.recipientName || session.displayName || "Parent"
      });
      const recorded = recordRewardFulfillmentResult(state, {
        requestId: requestRecord.id,
        fulfilled: fulfilled.fulfilled,
        provider: fulfilled.provider,
        providerReference: fulfilled.providerReference,
        deliveryStatus: fulfilled.deliveryStatus,
        manualReview: fulfilled.manualReview,
        amountCents: fulfilled.plan?.amountCents,
        currencyCode: fulfilled.plan?.currencyCode,
        recipientEmail: fulfilled.plan?.recipientEmail || body.recipientEmail || "",
        recipientName: fulfilled.plan?.recipientName || body.recipientName || "",
        requestedBy: session.displayName || session.userId || "Parent",
        reviewedBy: session.displayName || "Parent",
        note: body.note,
        error: fulfilled.error || ""
      });
      return {
        state: await writeRewardWorkflow(recorded.state),
        result: recorded.result,
        fulfillment: fulfilled,
        giftCards: getGiftCardFulfillmentReadiness(process.env),
        repository: stateRepository.status()
      };
    });
    sendJson(response, payload.result.accepted ? 200 : 400, payload);
    return true;
  }

  if (request.method === "GET" && pathname === "/api/rewards/approvals") {
    requireRepositoryPermission(session, "reward_approvals", "read", repositoryScopeForRole(session));
    const url = new URL(request.url, `http://localhost:${port}`);
    const state = stateRepository.status().mode === "json" ? await ensureStateFile() : {};
    let learnerId = url.searchParams.get("learnerId") || "";
    let guardianId = url.searchParams.get("guardianId") || "";
    if (session.role === "student") {
      learnerId = session.studentId;
      guardianId = "";
    } else if (session.role === "parent") {
      if (learnerId) await requireLearnerReadAccess(session, state, learnerId, "reward approvals");
      guardianId = session.guardianId || guardianId;
    } else if (session.role === "teacher" && learnerId) {
      await requireLearnerReadAccess(session, state, learnerId, "reward approvals");
    }
    const rewards = await stateRepository.readRewardApprovals({
      limit: url.searchParams.get("limit") || 10000,
      learnerId,
      guardianId,
      status: url.searchParams.get("status") || ""
    });
    sendJson(response, 200, {
      repository: stateRepository.status(),
      session: publicSessionSummary(session),
      ...rewards
    });
    return true;
  }

  if (request.method === "GET" && pathname === "/api/content/visual-assets") {
    requireRepositoryPermission(session, "visual_assets", "read", session.scope);
    const url = new URL(request.url, `http://localhost:${port}`);
    const assets = await stateRepository.readVisualAssets({
      limit: url.searchParams.get("limit") || 10000,
      status: session.role === "student" ? "approved" : url.searchParams.get("status") || ""
    });
    sendJson(response, 200, {
      repository: stateRepository.status(),
      session: publicSessionSummary(session),
      ...assets
    });
    return true;
  }

  if (request.method === "GET" && pathname === "/api/tutor/events") {
    requireRepositoryPermission(session, "ai_tutor_events", "read", repositoryScopeForRole(session));
    const url = new URL(request.url, `http://localhost:${port}`);
    const requestedLearnerId = url.searchParams.get("learnerId");
    const state = stateRepository.status().mode === "json" ? await ensureStateFile() : {};
    let learnerId = requestedLearnerId === null ? "" : String(requestedLearnerId);
    if (session.role === "student") {
      if (learnerId && learnerId !== session.studentId) {
        const error = new Error("Students can only read their own AI tutor events.");
        error.status = 403;
        throw error;
      }
      learnerId = session.studentId;
    } else if (["parent", "teacher"].includes(session.role) && !learnerId) {
      const error = new Error("A learnerId is required for scoped AI tutor event reads.");
      error.status = 400;
      throw error;
    } else if (learnerId) {
      await requireLearnerReadAccess(session, state, learnerId, "AI tutor events");
    }
    const events = await stateRepository.readAiTutorEvents({
      limit: url.searchParams.get("limit") || 10000,
      learnerId,
      lessonId: url.searchParams.get("lessonId") || "",
      reviewStatus: url.searchParams.get("reviewStatus") || ""
    });
    sendJson(response, 200, {
      repository: stateRepository.status(),
      session: publicSessionSummary(session),
      ...events
    });
    return true;
  }

  if (request.method === "GET" && pathname === "/api/agent-command-center/reviews") {
    requireRepositoryPermission(session, "agent_review_items", "read", session.scope);
    const url = new URL(request.url, `http://localhost:${port}`);
    const reviews = await stateRepository.readAgentReviewItems({
      limit: url.searchParams.get("limit") || 10000,
      status: url.searchParams.get("status") || "",
      ownerAgentId: url.searchParams.get("ownerAgentId") || "",
      priority: url.searchParams.get("priority") || ""
    });
    sendJson(response, 200, {
      repository: stateRepository.status(),
      session: publicSessionSummary(session),
      ...reviews
    });
    return true;
  }

  if (request.method === "GET" && pathname === "/api/audit/events") {
    requireRepositoryPermission(session, "audit_events", "read", "platform");
    if (session.role !== "platform-admin") {
      const error = new Error("Audit event reads are limited to platform admins.");
      error.status = 403;
      throw error;
    }
    const url = new URL(request.url, `http://localhost:${port}`);
    const audit = await stateRepository.readAuditEvents({
      limit: url.searchParams.get("limit") || 10000,
      eventType: url.searchParams.get("eventType") || "",
      entityType: url.searchParams.get("entityType") || "",
      category: url.searchParams.get("category") || ""
    });
    sendJson(response, 200, {
      repository: stateRepository.status(),
      session: publicSessionSummary(session),
      ...audit
    });
    return true;
  }

  if (request.method === "GET" && pathname === "/api/schema/migration") {
    const migration = getPlatformMigration();
    sendJson(response, 200, { migration, readiness: getPlatformMigrationReadiness() });
    return true;
  }

  if (request.method === "POST" && pathname === "/api/tutor/ask") {
    const body = await readJsonBody(request);
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const learnerId = String(body.learnerId || session.studentId || "avery");
      await requireTutorAccess(session, state, learnerId);
      const nextTutor = askAiTutor(state, {
        input: String(body.input || ""),
        lessonId: String(body.lessonId || state.selectedLessonId || "g3-fractions-number-line"),
        ageBand: String(body.ageBand || "K-5"),
        explanationMode: String(body.explanationMode || "diagnose"),
        learnerId,
        scratchpadReview: Boolean(body.scratchpadReview)
      });
      const lesson = findLessonInState(nextTutor.state, nextTutor.log.lessonId);
      const support = getLessonTeachingSupport(lesson.id, nextTutor.state);
      let finalTutor = nextTutor;
      let provider = { attempted: false, accepted: false, fallback: true, readiness: getOpenAiTutorReadiness(process.env) };
      const maxRevisionAttempts = Math.min(Math.max(Number(process.env.OPENAI_TUTOR_MAX_REVISION_ATTEMPTS || 1), 0), 2);
      const providerAttemptSummaries = [];
      let providerState = nextTutor.state;
      let revisionInstructions = [];
      for (let revisionAttempt = 1; revisionAttempt <= maxRevisionAttempts + 1; revisionAttempt += 1) {
        let providerResult;
        try {
          providerResult = await generateOpenAiTutorResponse({
            state: providerState,
            lesson,
            support,
            studentInput: nextTutor.log.input,
            localResponse: nextTutor.response,
            ageBand: String(body.ageBand || "K-5"),
            explanationMode: String(body.explanationMode || "diagnose"),
            revisionInstructions,
            revisionAttempt,
            env: process.env
          });
        } catch (error) {
          providerResult = {
            accepted: false,
            error: "The provider request failed; the local tutor response was retained.",
            plan: { accepted: true, config: { model: process.env.OPENAI_TUTOR_MODEL || "" } }
          };
        }
        provider = {
          ...provider,
          attempted: Boolean(provider.attempted || providerResult.plan?.accepted),
          blocked: Boolean(providerResult.blocked),
          reason: providerResult.reason || providerResult.error || providerResult.plan?.blockers?.[0] || "Local tutor response retained.",
          model: providerResult.model || provider.model || "",
          requestId: providerResult.requestId || provider.requestId || "",
          usage: providerResult.usage || provider.usage || {},
          moderation: providerResult.moderation || provider.moderation || {},
          readiness: getOpenAiTutorReadiness(process.env)
        };
        if (!providerResult.plan?.accepted) break;
        const attached = attachTutorProviderResponse(providerState, nextTutor.log.id, providerResult, {
          minimumAverage: Number(process.env.OPENAI_TUTOR_MIN_REVIEW_AVERAGE || 4)
        });
        providerState = attached.state;
        finalTutor = {
          ...nextTutor,
          state: attached.state,
          response: attached.result.accepted ? { ...nextTutor.response, ...providerResult.response } : nextTutor.response,
          log: attached.result.log
        };
        providerAttemptSummaries.push({
          attempt: revisionAttempt,
          status: attached.result.accepted ? "accepted" : attached.result.log?.providerAttemptStatus || "rejected",
          requestId: providerResult.requestId || "",
          review: attached.result.providerReview,
          revisionInstructions: attached.result.providerReview?.issues || []
        });
        provider = {
          ...provider,
          accepted: Boolean(attached.result.accepted),
          fallback: !attached.result.accepted,
          reason: attached.result.accepted ? "Provider response passed the tutor quality gate." : attached.result.reason,
          review: attached.result.providerReview,
          revisionAttempt: revisionAttempt
        };
        if (attached.result.accepted || providerResult.blocked || revisionAttempt > maxRevisionAttempts) break;
        revisionInstructions = attached.result.providerReview?.issues?.length
          ? attached.result.providerReview.issues
          : ["Strengthen the explanation, preserve hint-first tutoring, and remove unsupported or overbroad claims."];
      }
      provider = { ...provider, attempts: providerAttemptSummaries, revisionAttempts: Math.max(0, providerAttemptSummaries.length - 1) };
      return { state: await writeTutorWorkflow(finalTutor.state), response: finalTutor.response, log: finalTutor.log, provider };
    });
    sendJson(response, 200, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/tutor/feedback") {
    const body = await readJsonBody(request);
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const log = (state.aiLogs || []).find((item) => item.id === body.logId);
      const learnerId = String(log?.learnerId || body.learnerId || session.studentId || "avery");
      await requireTutorAccess(session, state, learnerId);
      const feedback = submitTutorFeedback(state, String(body.logId || ""), String(body.feedback || "still-confused"), String(body.note || ""));
      return { state: await writeTutorWorkflow(feedback.state), result: feedback.result };
    });
    sendJson(response, 200, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/content/lessons") {
    requireRepositoryPermission(session, "content_drafts", "write");
    const body = await readJsonBody(request);
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const nextState = createContentDraft(state, body);
      return { state: await writeContentWorkflow(nextState), draft: nextState.contentDrafts[0] };
    });
    sendJson(response, 201, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/content/import") {
    requireRepositoryPermission(session, "content_drafts", "write");
    const body = await readJsonBody(request);
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const { state: nextState, result } = importLessonBatch(state, body);
      return { state: await writeContentWorkflow(nextState), result };
    });
    sendJson(response, 200, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/content/batches/publish") {
    requireRepositoryPermission(session, "content_drafts", "write");
    requireRepositoryPermission(session, "lessons", "write");
    const body = await readJsonBody(request);
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const published = publishApprovedContentBatch(state, String(body.sourceBatchId || "bridge-academy-grade-6-batch-1"), {
        reviewedBy: session.userId || "manager"
      });
      const persisted = published.result.accepted ? await writeContentWorkflow(published.state) : state;
      return { state: persisted, result: published.result, repository: stateRepository.status() };
    });
    sendJson(response, payload.result.accepted ? 200 : 400, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/content/status") {
    requireRepositoryPermission(session, "content_drafts", "write");
    const body = await readJsonBody(request);
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      return { state: await writeContentWorkflow(updateContentDraftStatus(state, body.id, body.status || "draft")) };
    });
    sendJson(response, 200, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/content/visual-assets/status") {
    requireRepositoryPermission(session, "visual_assets", "write");
    const body = await readJsonBody(request);
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      return { state: await writeVisualWorkflow(updateVisualAssetStatus(state, body.id, body.status || "review")) };
    });
    sendJson(response, 200, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/content/visual-assets/replace") {
    requireRepositoryPermission(session, "visual_assets", "write");
    const body = await readJsonBody(request);
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const { state: nextState, result } = replaceVisualAsset(state, body.id, body.replacement || body);
      return { state: await writeVisualWorkflow(nextState), result };
    });
    sendJson(response, 200, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/content/visual-assets/promote-storage") {
    requireRepositoryPermission(session, "visual_assets", "write");
    const body = await readJsonBody(request);
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const asset = (state.visualAssets || []).find((item) => item.id === body.id);
      if (!asset) {
        return {
          state,
          result: {
            accepted: false,
            assetId: body.id || "",
            error: "Visual asset was not found."
          }
        };
      }
      const storage = await uploadVisualAssetToSupabaseStorage({ asset, env: process.env });
      if (!storage.accepted) {
        return {
          state,
          result: {
            accepted: false,
            assetId: asset.id,
            error: storage.error || "Visual asset could not be promoted to storage."
          }
        };
      }
      const promoted = markVisualAssetStoragePromoted(state, asset.id, storage);
      return { state: await writeVisualWorkflow(promoted.state), result: promoted.result };
    });
    sendJson(response, payload.result?.accepted ? 200 : 400, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/visual-agent/generate") {
    requireRepositoryPermission(session, "visual_assets", "write");
    const body = await readJsonBody(request);
    const state = await ensureStateFile();
    const slot = getVisualLearningOpportunity(state, body.slotId);
    if (!slot) {
      sendJson(response, 404, { error: "Visual opportunity was not found." });
      return true;
    }

    const requestedPrompt = String(body.prompt || slot.prompt || "").trim();
    if (!requestedPrompt) {
      sendJson(response, 400, { error: "Visual generation prompt is required." });
      return true;
    }

    const promptRevisionLoop = runArtifactRevisionLoop({
      artifactType: "image_prompt",
      artifact: { ...slot, id: slot.id, prompt: requestedPrompt },
      maxAttempts: Math.max(1, Math.min(3, Number(process.env.K12_ARTIFACT_MAX_ATTEMPTS || 3))),
      creatorId: "visual-learning-agent",
      options: { nextCritic: "Visual Learning Agent" },
      regenerate: ({ artifact, revisionBrief }) => ({
        ...artifact,
        prompt: `${artifact.prompt}\n\nRevision requirements from the critic: ${revisionBrief.specificImprovements.join(" ") || revisionBrief.creatorInstructions}`
      })
    });
    if (!promptRevisionLoop.approved) {
      sendJson(response, 400, {
        result: {
          accepted: false,
          generated: false,
          slot,
          prompt: requestedPrompt,
          error: "Image prompt failed the quality gate and could not be revised into an eligible prompt.",
          promptReview: promptRevisionLoop.finalReview,
          revisionHistory: promptRevisionLoop.history,
          revisionBrief: promptRevisionLoop.history.at(-1)?.revisionBrief || null
        }
      });
      return true;
    }
    const prompt = String(promptRevisionLoop.finalArtifact.prompt || requestedPrompt).trim();

    const generated = await generateOpenAiImage({ prompt, state, env: process.env });
    if (!generated.accepted) {
      sendJson(response, 400, {
        result: {
          accepted: false,
          generated: false,
          slot,
          prompt,
          error: generated.error,
          setup: "Set OPENAI_API_KEY, keep OPENAI_IMAGE_ENABLED=true, and adjust OPENAI_IMAGE_DAILY_LIMIT or OPENAI_IMAGE_MAX_COST_CENTS only after review.",
          model: generated.plan?.config?.model || process.env.OPENAI_IMAGE_MODEL || "gpt-image-2",
          plan: generated.plan,
          promptReview: promptRevisionLoop.finalReview,
          revisionHistory: promptRevisionLoop.history
        }
      });
      return true;
    }

    const payload = await queueStateMutation(async () => {
      const latestState = await ensureStateFile();
      const { state: nextState, result } = addGeneratedVisualAsset(latestState, {
        slot,
        prompt,
        b64Json: generated.b64Json,
        model: generated.model,
        outputFormat: generated.outputFormat,
        usage: generated.usage,
        estimatedCostCents: generated.plan?.estimatedCostCents || null,
        generationPlan: {
          ...(generated.plan || {}),
          promptReview: promptRevisionLoop.finalReview,
          revisionHistory: promptRevisionLoop.history
        },
        revisionAttempt: promptRevisionLoop.attempts,
        creatorId: "visual-learning-agent"
      });
      return { state: await writeVisualWorkflow(nextState), result: { ...result, promptReview: promptRevisionLoop.finalReview, revisionHistory: promptRevisionLoop.history } };
    });
    sendJson(response, 200, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/tool-gateway/execute") {
    const body = await readJsonBody(request);
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const executed = runAgentTool(state, { ...body, role: session.role, requestedBy: session.userId });
      const enriched = await enrichLiveCurriculumSourceAudit(executed.result, executed.log);
      const nextState = {
        ...executed.state,
        toolCallLogs: (executed.state.toolCallLogs || []).map((item) => (item.id === enriched.log.id ? enriched.log : item))
      };
      return { state: await writeToolGatewayWorkflow(nextState), result: enriched.result, log: enriched.log };
    });
    sendJson(response, 200, payload);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/agent-command-center/review") {
    requireRepositoryPermission(session, "agent_review_items", "write");
    const body = await readJsonBody(request);
    const payload = await queueStateMutation(async () => {
      const state = await ensureStateFile();
      const { state: nextState, result } = resolveAgentReviewItem(state, body.reviewId, body.decision || "approve");
      return { state: await writeAgentReviewDecision(nextState), result };
    });
    sendJson(response, 200, payload);
    return true;
  }

  return false;
}

async function assertProductionStartup() {
  if (!isProductionRuntime()) return;
  const runtime = getRuntimeConfigurationStatus(process.env);
  if (!runtime.ready) {
    throw new Error(`Production startup blocked: ${runtime.blockers.join(" ")}`);
  }
  if (stateRepository.status().mode !== "postgres") {
    throw new Error("Production startup blocked: K12_REPOSITORY_MODE=postgres is required.");
  }
  try {
    await stateRepository.readNormalizedTable("lessons", { limit: 1 });
  } catch (error) {
    throw new Error(`Production startup blocked: normalized Postgres probe failed. ${error.message || "Check DATABASE_URL credentials."}`);
  }
}

const server = createServer(async (request, response) => {
  const { pathname } = new URL(request.url, `http://localhost:${port}`);
  if (pathname.startsWith("/api/")) {
    try {
      const handled = await handleApi(request, response, pathname);
      if (!handled) {
        sendJson(response, 404, { error: "API route not found" });
      }
    } catch (error) {
      writeJsonResponse(response, error.status || 500, { error: error.message || "API error" });
    }
    return;
  }

  const filePath = resolveRequestPath(request.url);
  if (!filePath) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const body = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    response.end(body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

async function startServer() {
  try {
    await assertProductionStartup();
    server.listen(port, () => {
      console.log(`K-12 Learning Academies preview running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error.message || "Server startup failed.");
    process.exitCode = 1;
  }
}

startServer();
