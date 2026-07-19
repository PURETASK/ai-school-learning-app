const apiAvailable = typeof fetch === "function";
const authTokenKey = "k12-learning-auth-token";
const authRefreshTokenKey = "k12-learning-refresh-token";
let refreshInFlight = null;

export function getAuthToken() {
  return typeof localStorage === "undefined" ? "" : localStorage.getItem(authTokenKey) || "";
}

export function setAuthToken(token = "") {
  if (typeof localStorage === "undefined") return;
  if (token) {
    localStorage.setItem(authTokenKey, token);
  } else {
    localStorage.removeItem(authTokenKey);
  }
}

function getRefreshToken() {
  return typeof localStorage === "undefined" ? "" : localStorage.getItem(authRefreshTokenKey) || "";
}

function setRefreshToken(token = "") {
  if (typeof localStorage === "undefined") return;
  if (token) localStorage.setItem(authRefreshTokenKey, token);
  else localStorage.removeItem(authRefreshTokenKey);
}

function decodeJwtPayload(token = "") {
  const encoded = String(token || "").split(".")[1];
  if (!encoded) return null;
  try {
    const normalized = encoded.replaceAll("-", "+").replaceAll("_", "/");
    const padded = `${normalized}${"=".repeat((4 - (normalized.length % 4)) % 4)}`;
    const decoded = typeof atob === "function"
      ? atob(padded)
      : typeof Buffer !== "undefined"
        ? Buffer.from(padded, "base64").toString("utf8")
        : "";
    return decoded ? JSON.parse(decoded) : null;
  } catch {
    return null;
  }
}

function tokenNeedsRefresh(token = "", leewaySeconds = 60) {
  const payload = decodeJwtPayload(token);
  const expiresAt = Number(payload?.exp || 0);
  return Boolean(expiresAt && expiresAt <= Math.floor(Date.now() / 1000) + leewaySeconds);
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return "";
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken })
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || !body.token) {
      throw new Error(body.error || `Session refresh failed with ${response.status}`);
    }
    setAuthToken(body.token);
    if (body.refreshToken) setRefreshToken(body.refreshToken);
    return body.token;
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

async function requestJson(path, options = {}, allowRefresh = true) {
  if (!apiAvailable) {
    throw new Error("Fetch API is not available in this environment.");
  }

  if (allowRefresh && path !== "/api/auth/refresh" && tokenNeedsRefresh(getAuthToken())) {
    try {
      await refreshAccessToken();
    } catch {
      setAuthToken("");
      setRefreshToken("");
    }
  }

  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  if (response.status === 401 && allowRefresh && getRefreshToken() && path !== "/api/auth/refresh") {
    try {
      await refreshAccessToken();
      return requestJson(path, options, false);
    } catch {
      setAuthToken("");
      setRefreshToken("");
    }
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with ${response.status}`);
  }

  return response.json();
}

export async function fetchAuthSession() {
  return requestJson("/api/auth/session");
}

export async function fetchAuthSecurity({ limit = "" } = {}) {
  const params = new URLSearchParams();
  if (limit) params.set("limit", String(limit));
  const query = params.toString() ? `?${params.toString()}` : "";
  return requestJson(`/api/auth/security${query}`);
}

export async function fetchRuntimeConfiguration() {
  return requestJson("/api/runtime/configuration");
}

export async function fetchRuntimeHealth() {
  return requestJson("/api/runtime/health");
}

export async function fetchStateDependencyAudit() {
  const body = await requestJson("/api/system/state-dependencies");
  return body.audit;
}

export async function postSignup(payload) {
  const body = await requestJson("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  if (body.token) setAuthToken(body.token);
  if (body.refreshToken) setRefreshToken(body.refreshToken);
  return body;
}

export async function postSignin(payload) {
  const body = await requestJson("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  if (body.token) setAuthToken(body.token);
  if (body.refreshToken) setRefreshToken(body.refreshToken);
  return body;
}

export async function postEmailVerificationRequest(payload) {
  return requestJson("/api/auth/request-email-verification", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function postEmailVerificationConfirm(payload) {
  const body = await requestJson("/api/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  if (body.token) setAuthToken(body.token);
  if (body.refreshToken) setRefreshToken(body.refreshToken);
  return body;
}

export async function postPasswordResetRequest(payload) {
  return requestJson("/api/auth/request-password-reset", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function postPasswordResetConfirm(payload) {
  const body = await requestJson("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  setAuthToken("");
  setRefreshToken("");
  return body;
}

export async function postSessionRevocation(payload = {}) {
  const body = await requestJson("/api/auth/revoke-session", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  if (!payload.userId || payload.userId === body.session?.userId || payload.revokeAll) {
    setAuthToken("");
    setRefreshToken("");
  }
  return body;
}

export async function postChildAccount(payload) {
  return requestJson("/api/auth/child-account", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function signOutLocal() {
  setAuthToken("");
  setRefreshToken("");
}

export async function fetchPersistedState() {
  const body = await requestJson("/api/state");
  return body.state;
}

export async function fetchRoleScopedBootstrap() {
  return requestJson("/api/bootstrap");
}

export async function putPersistedState(state) {
  const body = await requestJson("/api/state", {
    method: "PUT",
    body: JSON.stringify({ state })
  });
  return body.state;
}

export async function resetPersistedState() {
  const body = await requestJson("/api/state/reset", {
    method: "POST",
    body: "{}"
  });
  return body.state;
}

export async function fetchLearningCatalog(learnerId = "") {
  const query = learnerId ? `?learnerId=${encodeURIComponent(learnerId)}` : "";
  const body = await requestJson(`/api/learning/catalog${query}`);
  return body.catalog;
}

export async function fetchLearningEvents({ learnerId = "", limit = "" } = {}) {
  const params = new URLSearchParams();
  if (learnerId) params.set("learnerId", learnerId);
  if (limit) params.set("limit", String(limit));
  const query = params.toString() ? `?${params.toString()}` : "";
  return requestJson(`/api/learning/events${query}`);
}

export async function postLessonQuiz(lessonId, answers, learnerId = "") {
  return requestJson("/api/learning/quiz", {
    method: "POST",
    body: JSON.stringify({ lessonId, answers, learnerId })
  });
}

export async function postLessonScratchpad(payload) {
  return requestJson("/api/learning/scratchpad", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function fetchLessonScratchpads({ learnerId = "", lessonId = "", limit = "" } = {}) {
  const params = new URLSearchParams();
  if (learnerId) params.set("learnerId", learnerId);
  if (lessonId) params.set("lessonId", lessonId);
  if (limit) params.set("limit", String(limit));
  const query = params.toString() ? `?${params.toString()}` : "";
  return requestJson(`/api/learning/scratchpads${query}`);
}

export async function fetchAssignments({ learnerId = "", status = "", limit = "" } = {}) {
  const params = new URLSearchParams();
  if (learnerId) params.set("learnerId", learnerId);
  if (status) params.set("status", status);
  if (limit) params.set("limit", String(limit));
  const query = params.toString() ? `?${params.toString()}` : "";
  return requestJson(`/api/learning/assignments${query}`);
}

export async function fetchRetentionSchedules({ learnerId = "", lessonId = "", limit = "" } = {}) {
  const params = new URLSearchParams();
  if (learnerId) params.set("learnerId", learnerId);
  if (lessonId) params.set("lessonId", lessonId);
  if (limit) params.set("limit", String(limit));
  const query = params.toString() ? `?${params.toString()}` : "";
  return requestJson(`/api/learning/retention-schedules${query}`);
}

export async function fetchPortfolioEvidence({ learnerId = "", lessonId = "", limit = "" } = {}) {
  const params = new URLSearchParams();
  if (learnerId) params.set("learnerId", learnerId);
  if (lessonId) params.set("lessonId", lessonId);
  if (limit) params.set("limit", String(limit));
  const query = params.toString() ? `?${params.toString()}` : "";
  return requestJson(`/api/learning/portfolio-evidence${query}`);
}

export async function postInteractiveResponse(payload) {
  return requestJson("/api/learning/interactive", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function postClassSessionStatus(payload) {
  return requestJson("/api/classroom/session/status", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function postClassroomArtifact(payload) {
  return requestJson("/api/classroom/artifact", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function putClassroomMission(payload) {
  return requestJson("/api/classroom/mission", {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export async function postTeacherIntervention(payload) {
  return requestJson("/api/classroom/intervention", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function fetchClassroomMonitor({ classSectionId = "", teacherId = "", limit = "" } = {}) {
  const params = new URLSearchParams();
  if (classSectionId) params.set("classSectionId", classSectionId);
  if (teacherId) params.set("teacherId", teacherId);
  if (limit) params.set("limit", String(limit));
  const query = params.toString() ? `?${params.toString()}` : "";
  const body = await requestJson(`/api/classroom/monitor${query}`);
  return body.monitor;
}

export async function fetchClassroomStudent({ learnerId = "", limit = "" } = {}) {
  const params = new URLSearchParams();
  if (learnerId) params.set("learnerId", learnerId);
  if (limit) params.set("limit", String(limit));
  const query = params.toString() ? `?${params.toString()}` : "";
  const body = await requestJson(`/api/classroom/student${query}`);
  return body.classroom;
}

export async function fetchClassroomEvidence({ learnerId = "", classSessionId = "", lessonId = "", classSectionId = "", limit = "" } = {}) {
  const params = new URLSearchParams();
  if (learnerId) params.set("learnerId", learnerId);
  if (classSessionId) params.set("classSessionId", classSessionId);
  if (lessonId) params.set("lessonId", lessonId);
  if (classSectionId) params.set("classSectionId", classSectionId);
  if (limit) params.set("limit", String(limit));
  const query = params.toString() ? `?${params.toString()}` : "";
  return requestJson(`/api/classroom/evidence${query}`);
}

export async function fetchSchoolOverview() {
  return requestJson("/api/school/overview");
}

export async function postSchoolClass(payload) {
  return requestJson("/api/school/class", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function postSchoolEnrollment(payload) {
  return requestJson("/api/school/enrollment", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function postSchoolRosterImport(payload) {
  return requestJson("/api/school/roster/import", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function fetchSchoolRosterExport() {
  const response = await fetch("/api/school/roster/export", {
    headers: getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Roster export failed with ${response.status}`);
  }
  return {
    csv: await response.text(),
    filename: response.headers.get("content-disposition") || "school-roster.csv"
  };
}

export async function fetchSchoolReportsExport() {
  const response = await fetch("/api/school/reports/export", {
    headers: getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `School report export failed with ${response.status}`);
  }
  return {
    csv: await response.text(),
    filename: response.headers.get("content-disposition") || "school-reports.csv"
  };
}

export async function postRewardRequest(payload) {
  return requestJson("/api/rewards/request", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function postRewardDecision(payload) {
  return requestJson("/api/rewards/decision", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function postRewardFulfillment(payload) {
  return requestJson("/api/rewards/fulfill", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function fetchRewardApprovals({ learnerId = "", guardianId = "", status = "", limit = "" } = {}) {
  const params = new URLSearchParams();
  if (learnerId) params.set("learnerId", learnerId);
  if (guardianId) params.set("guardianId", guardianId);
  if (status) params.set("status", status);
  if (limit) params.set("limit", String(limit));
  const query = params.toString() ? `?${params.toString()}` : "";
  return requestJson(`/api/rewards/approvals${query}`);
}

export async function fetchContentDrafts({ status = "", limit = "" } = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (limit) params.set("limit", String(limit));
  const query = params.toString() ? `?${params.toString()}` : "";
  return requestJson(`/api/content/drafts${query}`);
}

export async function fetchVisualAssets({ status = "", limit = "" } = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (limit) params.set("limit", String(limit));
  const query = params.toString() ? `?${params.toString()}` : "";
  return requestJson(`/api/content/visual-assets${query}`);
}

export async function fetchTutorEvents({ learnerId = "", lessonId = "", reviewStatus = "", limit = "" } = {}) {
  const params = new URLSearchParams();
  if (learnerId) params.set("learnerId", learnerId);
  if (lessonId) params.set("lessonId", lessonId);
  if (reviewStatus) params.set("reviewStatus", reviewStatus);
  if (limit) params.set("limit", String(limit));
  const query = params.toString() ? `?${params.toString()}` : "";
  return requestJson(`/api/tutor/events${query}`);
}

export async function fetchAgentReviewItems({ status = "", ownerAgentId = "", priority = "", limit = "" } = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (ownerAgentId) params.set("ownerAgentId", ownerAgentId);
  if (priority) params.set("priority", priority);
  if (limit) params.set("limit", String(limit));
  const query = params.toString() ? `?${params.toString()}` : "";
  return requestJson(`/api/agent-command-center/reviews${query}`);
}

export async function fetchAuditEvents({ eventType = "", entityType = "", category = "", limit = "" } = {}) {
  const params = new URLSearchParams();
  if (eventType) params.set("eventType", eventType);
  if (entityType) params.set("entityType", entityType);
  if (category) params.set("category", category);
  if (limit) params.set("limit", String(limit));
  const query = params.toString() ? `?${params.toString()}` : "";
  return requestJson(`/api/audit/events${query}`);
}

export async function postLessonDraft(payload) {
  const body = await requestJson("/api/content/lessons", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return body;
}

export async function postLessonBatchImport(payload) {
  const body = await requestJson("/api/content/import", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return body;
}

export async function postContentBatchPublication(sourceBatchId) {
  return requestJson("/api/content/batches/publish", {
    method: "POST",
    body: JSON.stringify({ sourceBatchId })
  });
}

export async function postDraftStatus(id, status) {
  const body = await requestJson("/api/content/status", {
    method: "POST",
    body: JSON.stringify({ id, status })
  });
  return body.state;
}

export async function postVisualAssetStatus(id, status) {
  const body = await requestJson("/api/content/visual-assets/status", {
    method: "POST",
    body: JSON.stringify({ id, status })
  });
  return body.state;
}

export async function postVisualAssetStoragePromotion(id) {
  return requestJson("/api/content/visual-assets/promote-storage", {
    method: "POST",
    body: JSON.stringify({ id })
  });
}

export async function postVisualAssetReplacement(id, replacement) {
  const body = await requestJson("/api/content/visual-assets/replace", {
    method: "POST",
    body: JSON.stringify({ id, replacement })
  });
  return body;
}

export async function postVisualAgentGeneration(slotId, prompt) {
  return requestJson("/api/visual-agent/generate", {
    method: "POST",
    body: JSON.stringify({ slotId, prompt })
  });
}

export async function postTutorAsk(payload) {
  return requestJson("/api/tutor/ask", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function postTutorFeedback(logId, feedback, note = "") {
  return requestJson("/api/tutor/feedback", {
    method: "POST",
    body: JSON.stringify({ logId, feedback, note })
  });
}

export async function postToolGatewayExecution(toolId, role, input = {}) {
  return requestJson("/api/tool-gateway/execute", {
    method: "POST",
    body: JSON.stringify({ toolId, role, input })
  });
}

export async function postAgentReviewDecision(reviewId, decision) {
  return requestJson("/api/agent-command-center/review", {
    method: "POST",
    body: JSON.stringify({ reviewId, decision })
  });
}
