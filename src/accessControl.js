import { productionDataModel, productionRoles } from "./schema.js";
import { allowedViewsByRole, baseRoleHomeViews, roleViewIds } from "./viewContract.js";

const roleIds = new Set(productionRoles.map((role) => role.id));
const tableIds = new Set(productionDataModel.map((table) => table.id));
const protectedTableIds = new Set(productionDataModel.filter((table) => table.rls).map((table) => table.id));

const publicReadTables = new Set([
  "grade_bands",
  "grade_levels",
  "subjects",
  "courses",
  "units",
  "lessons",
  "activities",
  "quizzes",
  "quiz_questions",
  "standards",
  "lesson_standards",
  "badges"
]);

const studentWritableTables = new Set([
  "quiz_attempts",
  "lesson_progress",
  "mastery_records",
  "lesson_scratchpads",
  "interactive_skill_evidence",
  "group_artifacts",
  "portfolio_items",
  "ai_tutor_events",
  "learning_events",
  "reward_approvals"
]);

const parentWritableTables = new Set([
  "consent_records",
  "guardian_student_links",
  "reward_settings",
  "assignments",
  "lesson_progress",
  "mastery_records",
  "portfolio_items",
  "reward_approvals"
]);

const teacherWritableTables = new Set([
  "assignments",
  "class_sessions",
  "group_missions",
  "group_artifacts",
  "teacher_interventions",
  "lesson_progress",
  "mastery_records",
  "quiz_attempts",
  "content_drafts",
  "visual_assets",
  "ai_tutor_events",
  "agent_review_items",
  "lesson_redesign_tasks"
]);

const schoolAdminWritableTables = new Set([
  "schools",
  "classes",
  "class_sessions",
  "group_missions",
  "group_artifacts",
  "teacher_interventions",
  "school_reports",
  "enrollments",
  "teacher_class_assignments",
  "account_invitations",
  "users",
  "students",
  "guardians",
  "teachers",
  "reward_approvals"
]);

const staffReviewTables = new Set([
  "content_drafts",
  "content_import_jobs",
  "visual_assets",
  "visual_generation_jobs",
  "agent_review_items",
  "agent_tool_calls",
  "research_evidence_sources",
  "lesson_redesign_tasks",
  "audit_events"
]);

function normalizeRepositoryRole(role = "") {
  const value = String(role || "").trim();
  return roleIds.has(value) ? value : "student";
}

function knownTable(tableId = "") {
  return tableIds.has(String(tableId));
}

function readAllowed(role, tableId, scope) {
  if (role === "platform-admin") return true;
  if (publicReadTables.has(tableId)) return true;
  if (!protectedTableIds.has(tableId)) return true;

  if (role === "student") {
    return scope === "own" && [
      "users",
      "students",
      "guardians",
      "student_guardians",
      "guardian_student_links",
      "grade_levels",
      "classes",
      "enrollments",
      "accommodations",
      "class_sessions",
      "group_missions",
      "group_artifacts",
      "assignments",
      "quiz_attempts",
      "lesson_progress",
      "mastery_records",
      "lesson_scratchpads",
      "interactive_skill_evidence",
      "portfolio_items",
      "student_badges",
      "visual_assets",
      "ai_tutor_events",
      "learning_events",
      "reward_approvals"
    ].includes(tableId);
  }

  if (role === "parent") {
    return scope === "own-household" && !["audit_events", "auth_audit_events", "agent_tool_calls", "app_state_snapshots"].includes(tableId);
  }

  if (role === "teacher") {
    return scope === "assigned" && !["audit_events", "auth_audit_events", "app_state_snapshots", "session_revocations", "school_reports"].includes(tableId);
  }

  if (role === "school-admin") {
    return scope === "school" && !["audit_events", "auth_audit_events", "app_state_snapshots", "session_revocations"].includes(tableId);
  }

  return false;
}

function writeAllowed(role, tableId, scope) {
  if (role === "platform-admin") return true;
  if (role === "student") return scope === "own" && studentWritableTables.has(tableId);
  if (role === "parent") return scope === "own-household" && parentWritableTables.has(tableId);
  if (role === "teacher") return scope === "assigned" && teacherWritableTables.has(tableId);
  if (role === "school-admin") return scope === "school" && schoolAdminWritableTables.has(tableId);
  return false;
}

export function authorizeRepositoryAction({ role = "student", tableId = "", operation = "read", scope = "" } = {}) {
  const normalizedRole = normalizeRepositoryRole(role);
  const normalizedTableId = String(tableId || "");
  const normalizedOperation = String(operation || "read").toLowerCase();
  const normalizedScope = String(scope || "");

  if (!knownTable(normalizedTableId)) {
    return {
      allowed: false,
      role: normalizedRole,
      tableId: normalizedTableId,
      operation: normalizedOperation,
      reason: `Unknown repository table: ${normalizedTableId}.`
    };
  }

  const allowed =
    normalizedOperation === "read"
      ? readAllowed(normalizedRole, normalizedTableId, normalizedScope)
      : writeAllowed(normalizedRole, normalizedTableId, normalizedScope);

  return {
    allowed,
    role: normalizedRole,
    tableId: normalizedTableId,
    operation: normalizedOperation,
    reason: allowed
      ? "Allowed by role and scope."
      : `${normalizedRole} cannot ${normalizedOperation} ${normalizedTableId} with ${normalizedScope || "unspecified"} scope.`
  };
}

export function getRepositoryAccessSummary() {
  const protectedTables = protectedTableIds.size;
  const studentWritable = productionDataModel.filter((table) =>
    authorizeRepositoryAction({ role: "student", tableId: table.id, operation: "write", scope: "own" }).allowed
  );
  const parentReadableProtected = productionDataModel.filter((table) =>
    protectedTableIds.has(table.id) &&
    authorizeRepositoryAction({ role: "parent", tableId: table.id, operation: "read", scope: "own-household" }).allowed
  );
  const teacherWritable = productionDataModel.filter((table) =>
    authorizeRepositoryAction({ role: "teacher", tableId: table.id, operation: "write", scope: "assigned" }).allowed
  );

  return {
    protectedTables,
    publicReadTables: publicReadTables.size,
    staffReviewTables: staffReviewTables.size,
    studentWritableTables: studentWritable.length,
    parentReadableProtectedTables: parentReadableProtected.length,
    teacherWritableTables: teacherWritable.length,
    blockedStudentExternalOps: !authorizeRepositoryAction({
      role: "student",
      tableId: "agent_tool_calls",
      operation: "write",
      scope: "own"
    }).allowed
  };
}

export function normalizeSessionRole(session = {}) {
  return session?.authenticated ? session.role || "anonymous" : "anonymous";
}

export function getRoleHomeView(role = "anonymous") {
  return baseRoleHomeViews[role] || "setup";
}

export function getAllowedViewsForSession(session = {}) {
  const role = normalizeSessionRole(session);
  return allowedViewsByRole[role] || allowedViewsByRole.anonymous;
}

export function isViewAllowedForSession(view, session = {}) {
  return getAllowedViewsForSession(session).includes(view);
}

export function getAuthorizedView(view, session = {}) {
  return isViewAllowedForSession(view, session) ? view : getRoleHomeView(normalizeSessionRole(session));
}

export function getVisibleRoleViews(session = {}) {
  const role = normalizeSessionRole(session);
  if (role === "platform-admin" || role === "school-admin") return roleViewIds;
  return roleViewIds.filter((view) => view === getRoleHomeView(role));
}

export function getAccessSummary(session = {}) {
  const role = normalizeSessionRole(session);
  const allowedViews = getAllowedViewsForSession(session);
  return {
    role,
    homeView: getRoleHomeView(role),
    allowedViews,
    roleViews: getVisibleRoleViews(session),
    isAdmin: role === "platform-admin" || role === "school-admin",
    isAuthenticated: Boolean(session?.authenticated)
  };
}
