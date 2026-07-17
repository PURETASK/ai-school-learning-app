import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createInitialState, normalizeAppState } from "./engine.js";
import { createProductionSeedProjection, productionDataModel } from "./schema.js";

export const normalizedRepositoryTableIds = [
  "users",
  "grade_bands",
  "grade_levels",
  "subjects",
  "standards",
  "schools",
  "teachers",
  "classes",
  "courses",
  "units",
  "lessons",
  "class_sessions",
  "group_missions",
  "group_artifacts",
  "teacher_interventions",
  "school_reports",
  "quizzes",
  "quiz_questions",
  "students",
  "guardians",
  "student_guardians",
  "account_invitations",
  "guardian_student_links",
  "session_revocations",
  "teacher_class_assignments",
  "enrollments",
  "activities",
  "quiz_attempts",
  "lesson_progress",
  "mastery_records",
  "lesson_scratchpads",
  "interactive_skill_evidence",
  "lesson_standards",
  "assignments",
  "badges",
  "portfolio_items",
  "student_badges",
  "reward_approvals",
  "content_drafts",
  "visual_assets",
  "ai_tutor_events",
  "agent_tool_calls",
  "research_evidence_sources",
  "lesson_redesign_tasks",
  "agent_review_items",
  "audit_events",
  "auth_audit_events",
  "consent_records",
  "accommodations",
  "retention_schedules",
  "learning_events",
  "experiment_runs",
  "reward_settings",
  "content_batch_reviews"
];

export const learningCatalogRepositoryTableIds = [
  "lessons",
  "activities",
  "quizzes",
  "quiz_questions",
  "lesson_standards",
  "lesson_progress",
  "mastery_records",
  "lesson_scratchpads",
  "interactive_skill_evidence",
  "quiz_attempts"
];

export const learningEvidenceRepositoryTableIds = [
  "quiz_attempts",
  "lesson_progress",
  "mastery_records",
  "lesson_scratchpads",
  "interactive_skill_evidence",
  "retention_schedules",
  "learning_events",
  "reward_approvals"
];

export const tutorWorkflowRepositoryTableIds = ["ai_tutor_events", "lesson_scratchpads", "learning_events"];

export const rewardWorkflowRepositoryTableIds = ["reward_approvals", "learning_events"];

export const toolGatewayWorkflowRepositoryTableIds = [
  "agent_tool_calls",
  "research_evidence_sources",
  "lesson_redesign_tasks",
  "agent_review_items"
];

export const contentDraftRepositoryTableIds = ["content_drafts"];

export const contentBatchReviewRepositoryTableIds = ["content_batch_reviews"];

export const visualAssetRepositoryTableIds = ["visual_assets"];

export const aiTutorEventRepositoryTableIds = ["ai_tutor_events"];

export const rewardApprovalRepositoryTableIds = ["reward_approvals"];

export const lessonScratchpadRepositoryTableIds = ["lesson_scratchpads"];

export const assignmentRepositoryTableIds = ["assignments"];

export const retentionScheduleRepositoryTableIds = ["retention_schedules"];

export const portfolioEvidenceRepositoryTableIds = ["portfolio_items", "student_badges", "badges"];

export const agentReviewRepositoryTableIds = ["agent_review_items"];

export const auditEventRepositoryTableIds = ["audit_events", "auth_audit_events"];

export const accountSecurityRepositoryTableIds = [
  "users",
  "students",
  "guardians",
  "teachers",
  "schools",
  "classes",
  "enrollments",
  "student_guardians",
  "guardian_student_links",
  "teacher_class_assignments",
  "account_invitations",
  "session_revocations",
  "auth_audit_events",
  "consent_records",
  "accommodations"
];

export const learnerProfileRepositoryTableIds = [
  "users",
  "students",
  "guardians",
  "student_guardians",
  "guardian_student_links",
  "grade_levels",
  "classes",
  "enrollments",
  "accommodations"
];

export const contentWorkflowRepositoryTableIds = [
  "lessons",
  "class_sessions",
  "group_missions",
  "group_artifacts",
  "teacher_interventions",
  "school_reports",
  "activities",
  "quizzes",
  "quiz_questions",
  "lesson_standards",
  "content_drafts",
  "content_batch_reviews",
  "visual_assets",
  "agent_review_items"
];

export const classroomWorkflowRepositoryTableIds = [
  "class_sessions",
  "group_missions",
  "group_artifacts",
  "teacher_interventions",
  "school_reports",
  "learning_events"
];

export const classroomEvidenceRepositoryTableIds = ["class_sessions", "group_missions", "group_artifacts", "teacher_interventions"];

export const classroomMonitorRepositoryTableIds = [
  "schools",
  "classes",
  "students",
  "enrollments",
  "lessons",
  "class_sessions",
  "group_missions",
  "group_artifacts",
  "teacher_interventions",
  "lesson_progress",
  "mastery_records",
  "lesson_scratchpads",
  "interactive_skill_evidence"
];

export const classroomStudentRepositoryTableIds = classroomMonitorRepositoryTableIds;

export const schoolOperationsRepositoryTableIds = [
  "schools",
  "users",
  "teachers",
  "students",
  "classes",
  "teacher_class_assignments",
  "enrollments",
  "account_invitations",
  "school_reports"
];

export const schoolOperationsReadRepositoryTableIds = [
  "schools",
  "users",
  "teachers",
  "students",
  "classes",
  "teacher_class_assignments",
  "enrollments",
  "account_invitations",
  "school_reports"
];

export const visualWorkflowRepositoryTableIds = [
  "grade_bands",
  "grade_levels",
  "subjects",
  "standards",
  "courses",
  "units",
  "lessons",
  "content_drafts",
  "visual_assets",
  "agent_review_items"
];

export const agentReviewDecisionRepositoryTableIds = [
  "lessons",
  "activities",
  "quizzes",
  "quiz_questions",
  "lesson_standards",
  "content_drafts",
  "visual_assets",
  "ai_tutor_events",
  "agent_tool_calls",
  "research_evidence_sources",
  "lesson_redesign_tasks",
  "agent_review_items"
];

const jsonColumns = new Set([
  "answers",
  "artifact_reports",
  "blockers",
  "blocking_lessons",
  "choices",
  "critical_blockers",
  "family_benefits",
  "group_homework",
  "helper_notes",
  "latest_review",
  "common_misunderstandings",
  "lesson_sections",
  "metadata",
  "payload",
  "prerequisite_skills",
  "quiz_questions",
  "generation_metadata",
  "lesson_ids",
  "lesson_reports",
  "review_checklist",
  "review_history",
  "revision_instructions",
  "selected_catalog_ids",
  "subjects",
  "source_cards",
  "standards_tags",
  "standards_framework_ids",
  "teaching_completeness_issues",
  "truth_issues",
  "value",
  "visual_supports",
  "visual_asset_ids",
  "vocabulary_terms",
  "role_labels",
  "steps",
  "metrics",
  "usage"
]);

function mergeInitialState(state) {
  return normalizeAppState(state || createInitialState());
}

export class JsonStateRepository {
  constructor({ root }) {
    this.mode = "json";
    this.dataDir = join(root, "data");
    this.statePath = join(this.dataDir, "app-state.json");
  }

  status() {
    return {
      mode: this.mode,
      configured: true,
      durable: false,
      path: this.statePath,
      normalizedTables: normalizedRepositoryTableIds.length
    };
  }

  async readState() {
    await mkdir(this.dataDir, { recursive: true });
    try {
      const raw = await readFile(this.statePath, "utf8");
      return mergeInitialState(JSON.parse(raw));
    } catch {
      const initial = createInitialState();
      await this.writeState(initial);
      return initial;
    }
  }

  async readNormalizedTable(tableId, options = {}) {
    return projectNormalizedRows(await this.readState(), tableId, options);
  }

  async readNormalizedTableSummary() {
    const projection = createProductionSeedProjection(await this.readState());
    return {
      mode: this.mode,
      tableIds: normalizedRepositoryTableIds,
      projectionSummary: projection.summary,
      rowCounts: Object.fromEntries(normalizedRepositoryTableIds.map((tableId) => [tableId, projection.tables[tableId]?.length || 0]))
    };
  }

  async readLearningCatalog(options = {}) {
    const rowsByTable = Object.fromEntries(
      await Promise.all(
        learningCatalogRepositoryTableIds.map(async (tableId) => [
          tableId,
          await this.readNormalizedTable(tableId, { limit: options.limit || 10000 })
        ])
      )
    );
    return createLearningCatalogReadModel(rowsByTable, options);
  }

  async readContentDrafts(options = {}) {
    const rows = await this.readNormalizedTable("content_drafts", { limit: options.limit || 10000 });
    return createContentDraftReadModel(rows, options);
  }

  async readContentBatchReviews(options = {}) {
    const rows = await this.readNormalizedTable("content_batch_reviews", { limit: options.limit || 10000 });
    return createContentBatchReviewReadModel(rows, options);
  }

  async readVisualAssets(options = {}) {
    const rows = await this.readNormalizedTable("visual_assets", { limit: options.limit || 10000 });
    return createVisualAssetReadModel(rows, options);
  }

  async readAiTutorEvents(options = {}) {
    const rows = await this.readNormalizedTable("ai_tutor_events", { limit: options.limit || 10000 });
    return createAiTutorEventReadModel(rows, options);
  }

  async readRewardApprovals(options = {}) {
    const rows = await this.readNormalizedTable("reward_approvals", { limit: options.limit || 10000 });
    return createRewardApprovalReadModel(rows, options);
  }

  async readLessonScratchpads(options = {}) {
    const rows = await this.readNormalizedTable("lesson_scratchpads", { limit: options.limit || 10000 });
    return createLessonScratchpadReadModel(rows, options);
  }

  async readAssignments(options = {}) {
    const rows = await this.readNormalizedTable("assignments", { limit: options.limit || 10000 });
    return createAssignmentReadModel(rows, options);
  }

  async readRetentionSchedules(options = {}) {
    const rows = await this.readNormalizedTable("retention_schedules", { limit: options.limit || 10000 });
    return createRetentionScheduleReadModel(rows, options);
  }

  async readPortfolioEvidence(options = {}) {
    const [portfolioRows, studentBadgeRows, badgeRows] = await Promise.all(
      portfolioEvidenceRepositoryTableIds.map((tableId) => this.readNormalizedTable(tableId, { limit: options.limit || 10000 }))
    );
    return createPortfolioEvidenceReadModel({ portfolioRows, studentBadgeRows, badgeRows }, options);
  }

  async readClassroomEvidence(options = {}) {
    const [sessionRows, missionRows, artifactRows, interventionRows] = await Promise.all(
      classroomEvidenceRepositoryTableIds.map((tableId) => this.readNormalizedTable(tableId, { limit: options.limit || 10000 }))
    );
    return createClassroomEvidenceReadModel({ sessionRows, missionRows, artifactRows, interventionRows }, options);
  }

  async readClassroomMonitor(options = {}) {
    const rowsByTable = Object.fromEntries(
      await Promise.all(
        classroomMonitorRepositoryTableIds.map(async (tableId) => [
          tableId,
          await this.readNormalizedTable(tableId, { limit: options.limit || 10000 })
        ])
      )
    );
    return createClassroomMonitorReadModel(rowsByTable, options);
  }

  async readLearnerClassSession(options = {}) {
    const rowsByTable = Object.fromEntries(
      await Promise.all(
        classroomStudentRepositoryTableIds.map(async (tableId) => [
          tableId,
          await this.readNormalizedTable(tableId, { limit: options.limit || 10000 })
        ])
      )
    );
    return createLearnerClassSessionReadModel(rowsByTable, options);
  }

  async readSchoolOperations(options = {}) {
    const rowsByTable = Object.fromEntries(
      await Promise.all(
        schoolOperationsReadRepositoryTableIds.map(async (tableId) => [
          tableId,
          await this.readNormalizedTable(tableId, { limit: options.limit || 10000 })
        ])
      )
    );
    return createSchoolOperationsReadModel(rowsByTable, options);
  }

  async readAgentReviewItems(options = {}) {
    const rows = await this.readNormalizedTable("agent_review_items", { limit: options.limit || 10000 });
    return createAgentReviewReadModel(rows, options);
  }

  async readAuditEvents(options = {}) {
    const [auditRows, authRows] = await Promise.all(
      auditEventRepositoryTableIds.map((tableId) => this.readNormalizedTable(tableId, { limit: options.limit || 10000 }))
    );
    return createAuditEventReadModel({ auditRows, authRows }, options);
  }

  async readAccountSecurity(options = {}) {
    const rowsByTable = Object.fromEntries(
      await Promise.all(
        accountSecurityRepositoryTableIds.map(async (tableId) => [
          tableId,
          await this.readNormalizedTable(tableId, { limit: options.limit || 10000 })
        ])
      )
    );
    return createAccountSecurityReadModel(rowsByTable, options);
  }

  async readLearnerProfiles(options = {}) {
    const rowsByTable = Object.fromEntries(
      await Promise.all(
        learnerProfileRepositoryTableIds.map(async (tableId) => [
          tableId,
          await this.readNormalizedTable(tableId, { limit: options.limit || 10000 })
        ])
      )
    );
    return createLearnerProfileReadModel(rowsByTable, options);
  }

  async isSessionRevoked(session = {}) {
    const rows = await this.readNormalizedTable("session_revocations", { limit: 10000 });
    const userId = String(session.userId || "");
    const sessionId = String(session.sessionId || "");
    const issuedAt = Date.parse(session.issuedAt || "") || 0;
    return rows.some((row) => {
      if (String(row.user_id || "") !== userId) return false;
      if (row.session_id && String(row.session_id) === sessionId) return true;
      const revokedBefore = Date.parse(row.revoked_before || "") || 0;
      return Boolean(revokedBefore && issuedAt && issuedAt <= revokedBefore);
    });
  }

  async writeState(state) {
    await mkdir(this.dataDir, { recursive: true });
    const nextState = {
      ...mergeInitialState(state),
      persistence: {
        ...(state?.persistence || {}),
        source: "json-file",
        syncedAt: new Date().toISOString(),
        lastError: null
      },
      persistedAt: new Date().toISOString()
    };
    await writeFile(this.statePath, JSON.stringify(nextState, null, 2));
    return nextState;
  }

  async writeLearningEvidence(state) {
    return this.writeState(state);
  }

  async writeTutorWorkflow(state) {
    return this.writeState(state);
  }

  async writeRewardWorkflow(state) {
    return this.writeState(state);
  }

  async writeToolGatewayWorkflow(state) {
    return this.writeState(state);
  }

  async writeContentWorkflow(state) {
    return this.writeState(state);
  }

  async writeClassroomWorkflow(state) {
    return this.writeState(state);
  }

  async writeSchoolOperations(state) {
    return this.writeState(state);
  }

  async writeVisualWorkflow(state) {
    return this.writeState(state);
  }

  async writeAgentReviewDecision(state) {
    return this.writeState(state);
  }

  async writeAccountSecurity(state) {
    return this.writeState(state);
  }
}

function sqlString(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function q(identifier) {
  return `"${identifier}"`;
}

function isTemporalColumn(column) {
  return column.endsWith("_at") || column === "created_at" || column === "updated_at" || column === "attempted_at";
}

function sqlValue(value, column, { foreignKey = false } = {}) {
  if (value === undefined || value === null) return "null";
  if (value === "" && (foreignKey || isTemporalColumn(column))) return "null";
  if (isTemporalColumn(column) && typeof value === "string" && Number.isNaN(Date.parse(value))) return "null";
  if (jsonColumns.has(column)) return `${sqlString(JSON.stringify(value))}::jsonb`;
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (Array.isArray(value) || typeof value === "object") return `${sqlString(JSON.stringify(value))}::jsonb`;
  return sqlString(value);
}

function tableMeta(tableId) {
  const table = productionDataModel.find((item) => item.id === tableId);
  if (!table) throw new Error(`Unknown production table: ${tableId}`);
  if (!normalizedRepositoryTableIds.includes(table.id)) {
    throw new Error(`Table is not exposed through the normalized repository: ${tableId}`);
  }
  return table;
}

function normalizedLimit(limit) {
  const parsed = Number(limit);
  if (!Number.isFinite(parsed)) return 100;
  return Math.max(1, Math.min(10000, Math.floor(parsed)));
}

function projectNormalizedRows(state, tableId, { limit = 100 } = {}) {
  const table = tableMeta(tableId);
  const projection = createProductionSeedProjection(state);
  return (projection.tables[table.id] || []).slice(0, normalizedLimit(limit));
}

function groupRowsBy(rows = [], key) {
  const grouped = new Map();
  for (const row of rows || []) {
    const value = row?.[key] || "";
    if (!grouped.has(value)) grouped.set(value, []);
    grouped.get(value).push(row);
  }
  return grouped;
}

function firstById(rows = [], idKey, id) {
  return (rows || []).find((row) => row?.[idKey] === id) || null;
}

function filterByLearner(rows = [], learnerId = "") {
  return learnerId ? (rows || []).filter((row) => row.student_id === learnerId) : rows || [];
}

function latestAttempt(attempts = []) {
  return [...attempts].sort((left, right) => String(right.attempted_at || "").localeCompare(String(left.attempted_at || "")))[0] || null;
}

export function createLearningCatalogReadModel(tables = {}, { learnerId = "" } = {}) {
  const lessons = tables.lessons || [];
  const activitiesByLesson = groupRowsBy(tables.activities || [], "lesson_id");
  const quizzesByLesson = groupRowsBy(tables.quizzes || [], "lesson_id");
  const questionsByQuiz = groupRowsBy(tables.quiz_questions || [], "quiz_id");
  const standardsByLesson = groupRowsBy(tables.lesson_standards || [], "lesson_id");
  const progressRows = filterByLearner(tables.lesson_progress || [], learnerId);
  const masteryRows = filterByLearner(tables.mastery_records || [], learnerId);
  const scratchpadRows = filterByLearner(tables.lesson_scratchpads || [], learnerId);
  const interactiveRows = filterByLearner(tables.interactive_skill_evidence || [], learnerId);
  const attemptRows = filterByLearner(tables.quiz_attempts || [], learnerId);
  const interactiveByLesson = groupRowsBy(interactiveRows, "lesson_id");
  const attemptsByQuiz = groupRowsBy(attemptRows, "quiz_id");

  const catalogLessons = lessons.map((lesson) => {
    const activities = activitiesByLesson.get(lesson.id) || [];
    const quiz = (quizzesByLesson.get(lesson.id) || [])[0] || null;
    const quizQuestions = quiz ? questionsByQuiz.get(quiz.id) || [] : [];
    const progress = firstById(progressRows, "lesson_id", lesson.id);
    const mastery = firstById(masteryRows, "lesson_id", lesson.id);
    const scratchpad = firstById(scratchpadRows, "lesson_id", lesson.id);
    const interactiveSkillEvidence = (interactiveByLesson.get(lesson.id) || [])
      .map((row) => ({
        id: row.id,
        learnerId: row.student_id,
        widgetId: row.widget_id,
        skillId: row.skill_id,
        skillLabel: row.skill_label,
        status: row.status,
        correct: Boolean(row.correct),
        attempts: Number(row.attempts || 0),
        value: row.value,
        diagnosis: row.diagnosis,
        recommendedSupport: row.recommended_support,
        evidenceStrength: row.evidence_strength,
        updatedAt: row.updated_at
      }))
      .sort((left, right) => String(right.updatedAt || "").localeCompare(String(left.updatedAt || "")));
    const attempts = quiz ? attemptsByQuiz.get(quiz.id) || [] : [];
    const latest = latestAttempt(attempts);

    return {
      id: lesson.id,
      title: lesson.title,
      unitId: lesson.unit_id,
      gradeBandId: lesson.grade_band_id,
      gradeLevelId: lesson.grade_level_id,
      subjectId: lesson.subject_id,
      estimatedMinutes: lesson.estimated_minutes,
      learningObjective: lesson.learning_objective,
      essentialQuestion: lesson.essential_question,
      masteryThreshold: lesson.mastery_threshold,
      status: lesson.status,
      catalogSource: lesson.status === "published" ? "published" : lesson.status === "pilot" ? "pilot" : "normalized",
      activityCount: activities.length,
      activities: [...activities]
        .sort((left, right) => Number(left.sort_order || 0) - Number(right.sort_order || 0))
        .map((activity) => ({
          id: activity.id,
          type: activity.activity_type,
          title: activity.title,
          body: activity.body,
          sortOrder: Number(activity.sort_order || 0),
          requiresGroup: Boolean(activity.requires_group)
        })),
      visualSupportCount: activities.filter((activity) => activity.activity_type === "visual_support").length,
      groupHomeworkCount: activities.filter((activity) => activity.activity_type === "group_homework" || activity.requires_group).length,
      quizId: quiz?.id || "",
      quizQuestionCount: quizQuestions.length,
      quiz: quiz
        ? {
            id: quiz.id,
            title: quiz.title,
            masteryThreshold: quiz.mastery_threshold,
            questions: [...quizQuestions]
              .sort((left, right) => Number(left.sort_order || 0) - Number(right.sort_order || 0))
              .map((question) => ({
                id: question.id,
                prompt: question.question_text,
                questionType: question.question_type,
                choices: Array.isArray(question.choices) ? question.choices : [],
                correctAnswer: question.correct_answer || "",
                explanation: question.explanation || "",
                difficultyLevel: question.difficulty_level || "",
                skillTag: question.skill_tag || "",
                standardTag: question.standard_tag || "",
                sortOrder: Number(question.sort_order || 0)
              }))
          }
        : null,
      standards: (standardsByLesson.get(lesson.id) || []).map((standard) => standard.tag || standard.standard_id).filter(Boolean),
      progress: progress
        ? {
            status: progress.status,
            startedAt: progress.started_at,
            completedAt: progress.completed_at,
            lastActivityAt: progress.last_activity_at
          }
        : null,
      mastery: mastery
        ? {
            skillTag: mastery.skill_tag,
            score: mastery.score,
            status: mastery.status,
            attempts: mastery.attempts,
            evidence: mastery.evidence,
            updatedAt: mastery.updated_at
        }
        : null,
      scratchpad: scratchpad
        ? {
            id: scratchpad.id,
            learnerId: scratchpad.student_id,
            lessonId: scratchpad.lesson_id,
            firstStep: scratchpad.first_step || "",
            explanation: scratchpad.explanation || "",
            confusion: scratchpad.confusion || "",
            retryAfterHint: scratchpad.retry_after_hint || "",
            tutorReviewCount: Number(scratchpad.tutor_review_count || 0),
            updatedAt: scratchpad.updated_at || ""
          }
        : null,
      interactiveSkillEvidence,
      latestInteractiveSkillEvidence: interactiveSkillEvidence[0] || null,
      latestAttempt: latest
        ? {
            id: latest.id,
            score: latest.score,
            passed: Boolean(latest.passed),
            attemptedAt: latest.attempted_at
          }
        : null
    };
  });

  return {
    source: "normalized-repository",
    learnerId: learnerId || "all",
    tableIds: learningCatalogRepositoryTableIds,
    summary: {
      lessonCount: catalogLessons.length,
      pilot: catalogLessons.filter((lesson) => lesson.catalogSource === "pilot").length,
      published: catalogLessons.filter((lesson) => lesson.catalogSource === "published").length,
      withProgress: catalogLessons.filter((lesson) => lesson.progress).length,
      withMastery: catalogLessons.filter((lesson) => lesson.mastery).length,
      withScratchpad: catalogLessons.filter((lesson) => lesson.scratchpad).length,
      withInteractiveEvidence: catalogLessons.filter((lesson) => lesson.interactiveSkillEvidence.length > 0).length,
      interactiveEvidenceSignals: catalogLessons.reduce((sum, lesson) => sum + lesson.interactiveSkillEvidence.length, 0),
      withQuiz: catalogLessons.filter((lesson) => lesson.quizQuestionCount > 0).length,
      visualSupportActivities: catalogLessons.reduce((sum, lesson) => sum + lesson.visualSupportCount, 0),
      groupHomeworkActivities: catalogLessons.reduce((sum, lesson) => sum + lesson.groupHomeworkCount, 0)
    },
    lessons: catalogLessons
  };
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function toObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

export function normalizedContentDraftRow(row = {}) {
  const draft = {
    id: row.id,
    academyId: row.academy_id,
    grade: row.grade,
    subject: row.subject_id,
    title: row.title,
    objective: row.objective,
    unitTitle: row.unit_title || "",
    standards: toArray(row.standards_tags),
    essentialQuestion: row.essential_question || "",
    studentSummary: row.student_summary || "",
    whyItMatters: row.why_it_matters || "",
    vocabularyTerms: toArray(row.vocabulary_terms),
    prerequisiteSkills: toArray(row.prerequisite_skills),
    lessonSections: toObject(row.lesson_sections),
    helperNotes: toArray(row.helper_notes),
    commonMisunderstandings: toArray(row.common_misunderstandings),
    visualSupports: toArray(row.visual_supports),
    quizQuestions: toArray(row.quiz_questions),
    sourceCards: toArray(row.source_cards),
    groupHomework: toObject(row.group_homework),
    status: row.status || "draft",
    blockedReason: row.blocked_reason || "",
    reviewNotes: row.review_notes || "",
    accessibilityNotes: row.accessibility_notes || "",
    ageFitNotes: row.age_fit_notes || "",
    lessonBodyReady: Boolean(row.lesson_body_ready),
    teachingCompletenessStatus: row.teaching_completeness_status || "",
    teachingCompletenessIssues: toArray(row.teaching_completeness_issues),
    sourceLessonId: row.source_lesson_id || "",
    sourceToolCallId: row.source_tool_call_id || "",
    redesignTaskIds: toArray(row.redesign_task_ids),
    researchSourceIds: toArray(row.research_source_ids),
    truthScore: typeof row.truth_score === "number" ? row.truth_score : null,
    truthIssues: toArray(row.truth_issues),
    needsExternalResearch: Boolean(row.needs_external_research),
    truthReviewStatus: row.truth_review_status || "",
    latestReview: toObject(row.latest_review),
    reviewHistory: row.review_history || [],
    reviewVersion: Number(row.review_version || 0),
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || row.created_at || ""
  };

  return {
    ...draft,
    publicationBlocked: Boolean(draft.blockedReason),
    contentCompletenessReview: {
      status: draft.teachingCompletenessStatus,
      passed: draft.lessonBodyReady,
      issues: draft.teachingCompletenessIssues
    },
    contentTruthReview: {
      score: draft.truthScore,
      status: draft.truthReviewStatus,
      issues: draft.truthIssues,
      needsExternalResearch: draft.needsExternalResearch
    }
  };
}

export function createContentDraftReadModel(rows = [], { status = "" } = {}) {
  const drafts = rows.map(normalizedContentDraftRow).filter((draft) => !status || draft.status === status);
  return {
    source: "normalized-repository",
    tableIds: contentDraftRepositoryTableIds,
    summary: {
      total: drafts.length,
      draft: drafts.filter((draft) => draft.status === "draft").length,
      review: drafts.filter((draft) => draft.status === "review").length,
      published: drafts.filter((draft) => draft.status === "published").length,
      publicationBlocked: drafts.filter((draft) => draft.publicationBlocked).length,
      lessonBodyReady: drafts.filter((draft) => draft.lessonBodyReady).length,
      visualSupportReady: drafts.filter((draft) => draft.visualSupports.length > 0).length,
      misconceptionReady: drafts.filter((draft) => draft.commonMisunderstandings.length > 0).length,
      sourceCardReady: drafts.filter((draft) => draft.sourceCards.length > 0).length,
      truthApproved: drafts.filter((draft) => draft.truthReviewStatus === "approved").length,
      truthNeedsReview: drafts.filter((draft) => draft.truthReviewStatus && draft.truthReviewStatus !== "approved").length,
      externalResearchNeeded: drafts.filter((draft) => draft.needsExternalResearch).length
    },
    drafts
  };
}

export function normalizedContentBatchReviewRow(row = {}) {
  return {
    id: row.id || "",
    batchId: row.source_batch_id || "",
    academyId: row.academy_id || "",
    gradeBand: row.grade_band || "",
    gradeLevels: toArray(row.grade_levels),
    subjects: toArray(row.subjects),
    status: row.status || "pending",
    decision: row.decision || "",
    totalLessons: Number(row.total_lessons || 0),
    passedLessons: Number(row.passed_lessons || 0),
    totalArtifacts: Number(row.total_artifacts || 0),
    passedArtifacts: Number(row.passed_artifacts || 0),
    score: typeof row.score === "number" ? row.score : null,
    grade: row.grade || "",
    threshold: Number(row.threshold || 80),
    passed: Boolean(row.passed),
    publishEligible: Boolean(row.publish_eligible),
    lessonIds: toArray(row.lesson_ids),
    visualAssetIds: toArray(row.visual_asset_ids),
    lessonReports: toArray(row.lesson_reports),
    artifactReports: toArray(row.artifact_reports),
    blockingLessons: toArray(row.blocking_lessons),
    blockers: toArray(row.blockers),
    revisionInstructions: toArray(row.revision_instructions),
    reviewHistory: toArray(row.review_history),
    reviewedByUserId: row.reviewed_by_user_id || "",
    reviewedAt: row.reviewed_at || "",
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || row.created_at || ""
  };
}

export function createContentBatchReviewReadModel(rows = [], { status = "" } = {}) {
  const reviews = rows.map(normalizedContentBatchReviewRow).filter((review) => !status || review.status === status);
  return {
    source: "normalized-repository",
    tableIds: contentBatchReviewRepositoryTableIds,
    summary: {
      total: reviews.length,
      pending: reviews.filter((review) => ["manager-review", "pending"].includes(review.status)).length,
      revisionRequired: reviews.filter((review) => review.status === "revision-required").length,
      approved: reviews.filter((review) => review.status === "approved").length,
      published: reviews.filter((review) => review.status === "published").length,
      blocked: reviews.filter((review) => !review.passed).length
    },
    reviews
  };
}

export function normalizedVisualAssetRow(row = {}) {
  const assetUrl = row.storage_public_url || row.asset_url || "";
  const storageBacked = Boolean(row.storage_public_url || (row.storage_path && row.storage_bucket));
  return {
    id: row.id,
    lessonId: row.lesson_id || "",
    draftId: row.draft_id || "",
    assetKind: row.asset_kind || "visual-asset",
    placement: row.placement || "",
    subject: row.subject_id || "",
    grade: row.grade || "",
    title: row.title || row.caption || row.alt_text || row.id || "Visual asset",
    assetUrl,
    storageProvider: row.storage_provider || "",
    storageBucket: row.storage_bucket || "",
    storagePath: row.storage_path || "",
    storagePublicUrl: row.storage_public_url || "",
    storageStatus: row.storage_status || "",
    sourcePrompt: row.source_prompt || "",
    sourceModel: row.source_model || "",
    usage: row.usage || {},
    generationMetadata: row.generation_metadata || {},
    reviewChecklist: row.review_checklist || [],
    altText: row.alt_text || "",
    caption: row.caption || "",
    license: row.license || "",
    credit: row.credit || row.license || "",
    status: row.status || "review",
    approvedByUserId: row.approved_by_user_id || "",
    approvedAt: row.approved_at || "",
    latestReview: toObject(row.latest_review),
    reviewHistory: row.review_history || [],
    reviewVersion: Number(row.review_version || 0),
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || row.created_at || "",
    reviewReady: Boolean(assetUrl && row.alt_text && row.caption && row.license),
    productionReady: Boolean(assetUrl && row.alt_text && row.caption && row.license && (storageBacked || row.asset_kind === "generated-svg")),
    storageBacked,
    linked: Boolean(row.lesson_id || row.draft_id)
  };
}

export function createVisualAssetReadModel(rows = [], { status = "" } = {}) {
  const assets = rows.map(normalizedVisualAssetRow).filter((asset) => !status || asset.status === status);
  return {
    source: "normalized-repository",
    tableIds: visualAssetRepositoryTableIds,
    summary: {
      total: assets.length,
      review: assets.filter((asset) => asset.status === "review").length,
      approved: assets.filter((asset) => asset.status === "approved").length,
      rejected: assets.filter((asset) => asset.status === "rejected").length,
      openAiGenerated: assets.filter((asset) => asset.assetKind === "openai-generated-image").length,
      generatedSvg: assets.filter((asset) => asset.assetKind === "generated-svg").length,
      linkedDrafts: assets.filter((asset) => asset.draftId).length,
      linkedLessons: assets.filter((asset) => asset.lessonId).length,
      missingAltText: assets.filter((asset) => !asset.altText).length,
      missingAssetUrl: assets.filter((asset) => !asset.assetUrl).length,
      reviewReady: assets.filter((asset) => asset.reviewReady).length,
      storageBacked: assets.filter((asset) => asset.storageBacked).length,
      productionReady: assets.filter((asset) => asset.productionReady).length,
      dataUrlOnly: assets.filter((asset) => String(asset.assetUrl || "").startsWith("data:image/") && !asset.storageBacked).length
    },
    assets
  };
}

export function normalizedAiTutorEventRow(row = {}) {
  const response = row.response || "";
  const analysis = row.analysis || "";
  const stuckPointLabel = analysis.match(/Stuck-point category:\s*([^.\n]+)/i)?.[1]?.trim() || "";
  const hintPathText = response.match(/Hint path:\s*(.*)$/i)?.[1] || "";
  const hintPath = hintPathText
    ? hintPathText
        .split(/\s+\d+\.\s+/)
        .map((step) => step.replace(/^\d+\.\s*/, "").trim())
        .filter(Boolean)
    : [];
  return {
    id: row.id,
    learnerId: row.student_id || "",
    studentId: row.student_id || "",
    lessonId: row.lesson_id || "",
    lessonTitle: row.lesson_id || "Tutor event",
    input: row.input || "",
    response,
    analysis,
    type: row.type || "",
    modeId: row.mode_id || "",
    modeTitle: row.mode_title || "",
    strategy: row.strategy || "",
    visualHint: row.visual_hint || "",
    firstPrinciplesPrompt: row.first_principles_prompt || "",
    stuckPointLabel,
    stuckPointCategoryId: stuckPointLabel ? stuckPointLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : "",
    hintPath,
    nextQuestion: row.response?.match(/Answer this next:\s*([^<\n]+)/i)?.[1]?.trim() || "",
    studentFeedback: row.student_feedback || "",
    feedbackNote: row.feedback_note || "",
    helped: typeof row.helped === "boolean" ? row.helped : null,
    qualityScore: typeof row.quality_score === "number" ? row.quality_score : null,
    truthScore: typeof row.truth_score === "number" ? row.truth_score : null,
    truthIssues: toArray(row.truth_issues),
    needsExternalResearch: Boolean(row.needs_external_research),
    truthReviewStatus: row.truth_review_status || "",
    flagged: Boolean(row.flagged),
    reviewStatus: row.review_status || "",
    timestamp: row.created_at || "",
    createdAt: row.created_at || "",
    requiresHumanReview: Boolean(row.flagged || row.needs_external_research || (typeof row.truth_score === "number" && row.truth_score < 4)),
    truthReview: {
      score: typeof row.truth_score === "number" ? row.truth_score : null,
      status: row.truth_review_status || "",
      issues: toArray(row.truth_issues),
      needsExternalResearch: Boolean(row.needs_external_research)
    }
  };
}

export function createAiTutorEventReadModel(rows = [], { learnerId = "", lessonId = "", reviewStatus = "" } = {}) {
  const events = rows
    .map(normalizedAiTutorEventRow)
    .filter((event) => !learnerId || event.learnerId === learnerId)
    .filter((event) => !lessonId || event.lessonId === lessonId)
    .filter((event) => !reviewStatus || event.reviewStatus === reviewStatus || event.truthReviewStatus === reviewStatus);
  const feedbackEvents = events.filter((event) => event.studentFeedback);
  const helped = feedbackEvents.filter((event) => event.helped).length;
  const truthReviewed = events.filter((event) => typeof event.truthScore === "number");
  const truthScoreTotal = truthReviewed.reduce((sum, event) => sum + event.truthScore, 0);
  const needsTruthReview = events.filter(
    (event) => !event.reviewStatus && (event.requiresHumanReview || event.needsExternalResearch || (typeof event.truthScore === "number" && event.truthScore < 4))
  );

  return {
    source: "normalized-repository",
    tableIds: aiTutorEventRepositoryTableIds,
    summary: {
      total: events.length,
      flagged: events.filter((event) => event.flagged).length,
      feedback: feedbackEvents.length,
      helped,
      stillConfused: feedbackEvents.length - helped,
      helpfulRate: feedbackEvents.length ? Math.round((helped / feedbackEvents.length) * 100) : 0,
      truthReviewed: truthReviewed.length,
      truthAverage: truthReviewed.length ? Math.round((truthScoreTotal / truthReviewed.length) * 10) / 10 : 0,
      needsTruthReview: needsTruthReview.length,
      externalResearchNeeded: events.filter((event) => event.needsExternalResearch).length,
      autoReviewed: events.filter((event) => event.reviewStatus === "auto-reviewed").length,
      humanReviewed: events.filter((event) => event.reviewStatus && event.reviewStatus !== "auto-reviewed").length,
      visualMode: events.filter((event) => event.modeId === "visual").length,
      firstPrinciplesMode: events.filter((event) => event.modeId === "first-principles").length
    },
    events
  };
}

export function normalizedRewardApprovalRow(row = {}) {
  const evidence = toObject(row.evidence);
  return {
    id: row.id || "",
    learnerId: row.student_id || "",
    studentId: row.student_id || "",
    guardianId: row.guardian_id || "",
    lessonId: evidence.lessonId || row.lesson_id || "",
    rewardLevel: Number(row.reward_level || 0),
    rewardTitle: row.reward_title || "Reward",
    rewardBenefit: row.reward_benefit || "",
    status: row.status || "pending",
    requestedBy: row.requested_by || "",
    requestedAt: row.requested_at || "",
    reviewedBy: row.reviewed_by || "",
    reviewedAt: row.reviewed_at || "",
    evidence,
    parentNote: row.parent_note || "",
    fulfillmentProvider: row.fulfillment_provider || "",
    fulfillmentStatus: row.fulfillment_status || "",
    fulfillmentReference: row.fulfillment_reference || "",
    fulfillmentRequestedAt: row.fulfillment_requested_at || "",
    fulfillmentCompletedAt: row.fulfillment_completed_at || "",
    source: row.source || "app",
    requiresParentAction: row.status === "pending",
    fulfilled: ["fulfilled", "redeemed", "completed"].includes(row.fulfillment_status || row.status || "")
  };
}

export function createRewardApprovalReadModel(rows = [], { learnerId = "", guardianId = "", status = "" } = {}) {
  const approvals = rows
    .map(normalizedRewardApprovalRow)
    .filter((approval) => !learnerId || approval.learnerId === learnerId)
    .filter((approval) => !guardianId || approval.guardianId === guardianId)
    .filter((approval) => !status || approval.status === status)
    .sort((left, right) => String(right.requestedAt || "").localeCompare(String(left.requestedAt || "")));

  return {
    source: "normalized-repository",
    tableIds: rewardApprovalRepositoryTableIds,
    summary: {
      total: approvals.length,
      pending: approvals.filter((approval) => approval.status === "pending").length,
      approved: approvals.filter((approval) => approval.status === "approved").length,
      rejected: approvals.filter((approval) => approval.status === "rejected").length,
      redeemed: approvals.filter((approval) => approval.status === "redeemed").length,
      fulfilled: approvals.filter((approval) => approval.fulfilled).length,
      giftCardReady: approvals.filter((approval) => approval.fulfillmentProvider && approval.fulfillmentStatus).length,
      parentActionRequired: approvals.filter((approval) => approval.requiresParentAction).length
    },
    approvals
  };
}

export function normalizedLessonScratchpadRow(row = {}) {
  return {
    id: row.id || "",
    learnerId: row.student_id || "",
    studentId: row.student_id || "",
    lessonId: row.lesson_id || "",
    firstStep: row.first_step || "",
    explanation: row.explanation || "",
    confusion: row.confusion || "",
    retryAfterHint: row.retry_after_hint || "",
    tutorReviewCount: Number(row.tutor_review_count || 0),
    updatedAt: row.updated_at || "",
    hasStudentWriting: Boolean(row.first_step || row.explanation || row.confusion || row.retry_after_hint),
    needsTutorReview: Boolean((row.confusion || row.first_step || row.explanation) && !Number(row.tutor_review_count || 0))
  };
}

export function createLessonScratchpadReadModel(rows = [], { learnerId = "", lessonId = "" } = {}) {
  const scratchpads = rows
    .map(normalizedLessonScratchpadRow)
    .filter((scratchpad) => !learnerId || scratchpad.learnerId === learnerId)
    .filter((scratchpad) => !lessonId || scratchpad.lessonId === lessonId)
    .sort((left, right) => String(right.updatedAt || "").localeCompare(String(left.updatedAt || "")));

  return {
    source: "normalized-repository",
    tableIds: lessonScratchpadRepositoryTableIds,
    summary: {
      total: scratchpads.length,
      withWriting: scratchpads.filter((scratchpad) => scratchpad.hasStudentWriting).length,
      withConfusion: scratchpads.filter((scratchpad) => scratchpad.confusion).length,
      withRetry: scratchpads.filter((scratchpad) => scratchpad.retryAfterHint).length,
      tutorReviewed: scratchpads.filter((scratchpad) => scratchpad.tutorReviewCount > 0).length,
      needsTutorReview: scratchpads.filter((scratchpad) => scratchpad.needsTutorReview).length
    },
    scratchpads
  };
}

export function normalizedAssignmentRow(row = {}) {
  return {
    id: row.id || "",
    learnerId: row.student_id || "",
    studentId: row.student_id || "",
    lessonId: row.lesson_id || "",
    assignedByUserId: row.assigned_by_user_id || "",
    title: row.title || "Assignment",
    dueAt: row.due_at || "",
    status: row.status || "Assigned",
    createdAt: row.created_at || "",
    open: !["completed", "done", "submitted"].includes(String(row.status || "").toLowerCase())
  };
}

export function createAssignmentReadModel(rows = [], { learnerId = "", status = "" } = {}) {
  const assignments = rows
    .map(normalizedAssignmentRow)
    .filter((assignment) => !learnerId || assignment.learnerId === learnerId)
    .filter((assignment) => !status || assignment.status === status)
    .sort((left, right) => String(left.dueAt || "").localeCompare(String(right.dueAt || "")));

  return {
    source: "normalized-repository",
    tableIds: assignmentRepositoryTableIds,
    summary: {
      total: assignments.length,
      open: assignments.filter((assignment) => assignment.open).length,
      completed: assignments.filter((assignment) => !assignment.open).length,
      dueSoon: assignments.filter((assignment) => assignment.open && assignment.dueAt).length
    },
    assignments
  };
}

export function normalizedRetentionScheduleRow(row = {}) {
  return {
    id: row.id || "",
    learnerId: row.student_id || "",
    studentId: row.student_id || "",
    lessonId: row.lesson_id || "",
    skillTag: row.skill_tag || "",
    currentMastery: Number(row.current_mastery || 0),
    nextRecall: row.next_recall || "",
    intervalDays: Number(row.interval_days || 0),
    recallCount: Number(row.recall_count || 0),
    lastResult: row.last_result || "",
    due: Number(row.interval_days || 0) <= 3,
    needsReteach: String(row.last_result || "").toLowerCase().includes("reteach") || Number(row.current_mastery || 0) < 80
  };
}

export function createRetentionScheduleReadModel(rows = [], { learnerId = "", lessonId = "" } = {}) {
  const schedules = rows
    .map(normalizedRetentionScheduleRow)
    .filter((schedule) => !learnerId || schedule.learnerId === learnerId)
    .filter((schedule) => !lessonId || schedule.lessonId === lessonId)
    .sort((left, right) => left.intervalDays - right.intervalDays);

  return {
    source: "normalized-repository",
    tableIds: retentionScheduleRepositoryTableIds,
    summary: {
      total: schedules.length,
      due: schedules.filter((schedule) => schedule.due).length,
      needsReteach: schedules.filter((schedule) => schedule.needsReteach).length,
      durable: schedules.filter((schedule) => schedule.currentMastery >= 80 && schedule.intervalDays >= 7).length,
      averageMastery: schedules.length ? Math.round(schedules.reduce((sum, schedule) => sum + schedule.currentMastery, 0) / schedules.length) : 0
    },
    schedules
  };
}

export function normalizedPortfolioItemRow(row = {}) {
  return {
    id: row.id || "",
    learnerId: row.student_id || "",
    studentId: row.student_id || "",
    lessonId: row.lesson_id || "",
    title: row.title || "Portfolio artifact",
    artifactType: row.artifact_type || "artifact",
    source: row.source || "",
    visibility: row.visibility || "student-parent-teacher",
    createdAt: row.created_at || ""
  };
}

export function normalizedBadgeRow(row = {}) {
  return {
    id: row.id || "",
    title: row.title || "Badge",
    category: row.category || "mastery",
    requirement: row.requirement || "Requires verified learning evidence.",
    createdAt: row.created_at || ""
  };
}

export function normalizedStudentBadgeRow(row = {}, badgeById = new Map()) {
  const badge = badgeById.get(row.badge_id) || {};
  return {
    id: row.id || "",
    learnerId: row.student_id || "",
    studentId: row.student_id || "",
    badgeId: row.badge_id || "",
    lessonId: row.lesson_id || "",
    earnedAt: row.earned_at || "",
    evidence: toObject(row.evidence),
    title: badge.title || row.badge_id || "Earned badge",
    category: badge.category || "mastery",
    requirement: badge.requirement || "Requires verified learning evidence."
  };
}

export function createPortfolioEvidenceReadModel(
  { portfolioRows = [], studentBadgeRows = [], badgeRows = [] } = {},
  { learnerId = "", lessonId = "" } = {}
) {
  const badges = badgeRows.map(normalizedBadgeRow);
  const badgeById = new Map(badges.map((badge) => [badge.id, badge]));
  const portfolioItems = portfolioRows
    .map(normalizedPortfolioItemRow)
    .filter((item) => !learnerId || item.learnerId === learnerId)
    .filter((item) => !lessonId || item.lessonId === lessonId)
    .sort((left, right) => String(right.createdAt || "").localeCompare(String(left.createdAt || "")));
  const studentBadges = studentBadgeRows
    .map((row) => normalizedStudentBadgeRow(row, badgeById))
    .filter((badge) => !learnerId || badge.learnerId === learnerId)
    .filter((badge) => !lessonId || badge.lessonId === lessonId)
    .sort((left, right) => String(right.earnedAt || "").localeCompare(String(left.earnedAt || "")));

  return {
    source: "normalized-repository",
    tableIds: portfolioEvidenceRepositoryTableIds,
    summary: {
      portfolioItems: portfolioItems.length,
      badgesEarned: studentBadges.length,
      visibleToParentTeacher: portfolioItems.filter((item) => item.visibility.includes("parent") || item.visibility.includes("teacher")).length,
      masteryArtifacts: portfolioItems.filter((item) => item.artifactType.includes("mastery") || item.artifactType.includes("reward")).length,
      latestAt: portfolioItems[0]?.createdAt || studentBadges[0]?.earnedAt || ""
    },
    latestPortfolioItem: portfolioItems[0] || null,
    latestBadge: studentBadges[0] || null,
    portfolioItems,
    studentBadges,
    badges
  };
}

export function normalizedClassSessionRow(row = {}) {
  return {
    id: row.id || "",
    classSectionId: row.class_id || "",
    classId: row.class_id || "",
    lessonId: row.lesson_id || "",
    title: row.title || "Class session",
    status: row.status || "planned",
    periodLabel: row.period_label || "",
    durationMinutes: Number(row.duration_minutes || 0),
    launchGoal: row.launch_goal || "",
    steps: toArray(row.steps),
    startedAt: row.started_at || "",
    endedAt: row.ended_at || "",
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || ""
  };
}

export function normalizedGroupMissionRow(row = {}) {
  return {
    id: row.id || "",
    classSessionId: row.class_session_id || "",
    title: row.title || "Group mission",
    groupSize: row.group_size || "",
    sharedArtifact: row.shared_artifact || "",
    roles: toArray(row.role_labels),
    individualEvidence: row.individual_evidence || "",
    teacherLookFor: row.teacher_look_for || "",
    status: row.status || "planned",
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || ""
  };
}

export function normalizedGroupArtifactRow(row = {}, missionById = new Map()) {
  const mission = missionById.get(row.group_mission_id) || {};
  return {
    id: row.id || "",
    groupMissionId: row.group_mission_id || "",
    classSessionId: mission.classSessionId || "",
    learnerId: row.student_id || "",
    studentId: row.student_id || "",
    artifactTitle: row.artifact_title || mission.sharedArtifact || "Group artifact",
    artifactStatus: row.artifact_status || "not-submitted",
    individualEvidence: row.individual_evidence || "",
    submittedAt: row.submitted_at || "",
    reviewedAt: row.reviewed_at || "",
    submitted: Boolean(row.submitted_at || String(row.artifact_status || "").toLowerCase().includes("submit"))
  };
}

export function normalizedTeacherInterventionRow(row = {}) {
  return {
    id: row.id || "",
    teacherId: row.teacher_id || "",
    classSessionId: row.class_session_id || "",
    learnerId: row.student_id || "",
    studentId: row.student_id || "",
    lessonId: row.lesson_id || "",
    interventionType: row.intervention_type || "monitor",
    summary: row.summary || "",
    status: row.status || "open",
    createdAt: row.created_at || "",
    resolvedAt: row.resolved_at || "",
    open: !["resolved", "closed", "complete", "completed"].includes(String(row.status || "").toLowerCase())
  };
}

export function createClassroomEvidenceReadModel(
  { sessionRows = [], missionRows = [], artifactRows = [], interventionRows = [] } = {},
  { learnerId = "", classSessionId = "", lessonId = "", classSectionId = "" } = {}
) {
  const sessions = sessionRows
    .map(normalizedClassSessionRow)
    .filter((session) => !classSessionId || session.id === classSessionId)
    .filter((session) => !lessonId || session.lessonId === lessonId)
    .filter((session) => !classSectionId || session.classSectionId === classSectionId);
  const sessionIds = new Set(sessions.map((session) => session.id));
  const sessionScoped = Boolean(classSessionId || lessonId || classSectionId);
  const missions = missionRows
    .map(normalizedGroupMissionRow)
    .filter((mission) => !sessionScoped || sessionIds.has(mission.classSessionId))
    .filter((mission) => !classSessionId || mission.classSessionId === classSessionId);
  const missionById = new Map(missions.map((mission) => [mission.id, mission]));
  const artifacts = artifactRows
    .map((row) => normalizedGroupArtifactRow(row, missionById))
    .filter((artifact) => !missions.length || missionById.has(artifact.groupMissionId))
    .filter((artifact) => !learnerId || artifact.learnerId === learnerId)
    .filter((artifact) => !classSessionId || artifact.classSessionId === classSessionId)
    .sort((left, right) => String(right.submittedAt || "").localeCompare(String(left.submittedAt || "")));
  const interventions = interventionRows
    .map(normalizedTeacherInterventionRow)
    .filter((intervention) => !classSessionId || intervention.classSessionId === classSessionId)
    .filter((intervention) => !lessonId || intervention.lessonId === lessonId)
    .filter((intervention) => !learnerId || intervention.learnerId === learnerId)
    .sort((left, right) => String(right.createdAt || "").localeCompare(String(left.createdAt || "")));

  return {
    source: "normalized-repository",
    tableIds: classroomEvidenceRepositoryTableIds,
    summary: {
      sessions: sessions.length,
      missions: missions.length,
      artifacts: artifacts.length,
      submittedArtifacts: artifacts.filter((artifact) => artifact.submitted).length,
      interventions: interventions.length,
      openInterventions: interventions.filter((intervention) => intervention.open).length,
      resolvedInterventions: interventions.filter((intervention) => !intervention.open).length
    },
    sessions,
    missions,
    artifacts,
    interventions,
    latestArtifact: artifacts[0] || null,
    latestIntervention: interventions[0] || null
  };
}

function firstSortedBy(rows = [], key = "updated_at") {
  return [...(rows || [])].sort((left, right) => String(right?.[key] || "").localeCompare(String(left?.[key] || "")))[0] || null;
}

function normalizedClassroomLessonRow(row = {}) {
  return row
    ? {
        id: row.id || "",
        title: row.title || "Lesson",
        subject: row.subject_id || "",
        subjectId: row.subject_id || "",
        gradeLevelId: row.grade_level_id || "",
        learningObjective: row.learning_objective || "",
        objective: row.learning_objective || "",
        essentialQuestion: row.essential_question || "",
        masteryThreshold: Number(row.mastery_threshold || 80),
        status: row.status || ""
      }
    : null;
}

function createRepositoryLearnerStatus({ learner, lesson, mission, artifact, intervention, progress, mastery, scratchpad, interactiveSignals }) {
  const score = Number(mastery?.score || 0);
  const threshold = Number(lesson?.masteryThreshold || 80);
  const confusion = scratchpad?.confusion || scratchpad?.first_step || scratchpad?.explanation || "";
  const status = intervention?.open
    ? "Teacher support"
    : artifact?.submitted
      ? "Evidence submitted"
      : score >= threshold
        ? "Mastered"
        : confusion
          ? "Needs help"
          : progress?.status === "completed"
            ? "Reteach"
            : "In progress";
  return {
    learner,
    status,
    currentStep: progress?.status || (artifact?.submitted ? "Mission evidence submitted" : "Class mission"),
    tutorSignal: confusion || "No written confusion yet",
    confusion,
    mastery: {
      score,
      status: mastery?.status || (score >= threshold ? "mastered" : "needs-review"),
      evidence: mastery?.evidence || ""
    },
    artifact: artifact
      ? {
          id: artifact.id,
          artifactTitle: artifact.artifactTitle,
          artifactStatus: artifact.artifactStatus,
          individualEvidence: artifact.individualEvidence,
          submittedAt: artifact.submittedAt
        }
      : {
          id: "",
          artifactTitle: mission?.sharedArtifact || "Group artifact",
          artifactStatus: "not-submitted",
          individualEvidence: ""
        },
    intervention: intervention || null,
    interactiveSkillEvidence: interactiveSignals.slice(0, 3),
    adaptiveReteach: intervention?.open
      ? {
          diagnosisLabel: intervention.interventionType,
          reteachMove: intervention.summary,
          teacherLookFor: "Confirm the learner can explain the evidence before moving on."
        }
      : null
  };
}

export function createClassroomMonitorReadModel(tables = {}, { classSectionId = "", teacherId = "" } = {}) {
  const enrollments = toArray(tables.enrollments);
  const classes = toArray(tables.classes)
    .filter((row) => !classSectionId || row.id === classSectionId)
    .filter((row) => !teacherId || row.teacher_id === teacherId)
    .map((row) => normalizedSchoolClassRow(row, enrollments));
  const classSection = classes[0] || null;
  if (!classSection) {
    return {
      source: "normalized-repository",
      tableIds: classroomMonitorRepositoryTableIds,
      school: null,
      classSection: null,
      session: null,
      lesson: null,
      mission: null,
      learners: [],
      metrics: { enrolled: 0, ready: 0, inProgress: 0, needsHelp: 0, teacherSupport: 0, submittedArtifacts: 0, mastered: 0, averageMastery: 0 },
      confusionHeatmap: [],
      adminReadiness: []
    };
  }

  const school = toArray(tables.schools).map(normalizedSchoolRow).find((item) => item.id === classSection.schoolId) || null;
  const session = firstSortedBy(
    toArray(tables.class_sessions).filter((row) => row.class_id === classSection.id),
    "updated_at"
  );
  const normalizedSession = normalizedClassSessionRow(session || {});
  const lesson = normalizedClassroomLessonRow(toArray(tables.lessons).find((row) => row.id === normalizedSession.lessonId));
  const mission = toArray(tables.group_missions)
    .map(normalizedGroupMissionRow)
    .find((row) => row.classSessionId === normalizedSession.id) || null;
  const missionById = new Map(mission ? [[mission.id, mission]] : []);
  const artifacts = toArray(tables.group_artifacts).map((row) => normalizedGroupArtifactRow(row, missionById));
  const interventions = toArray(tables.teacher_interventions).map(normalizedTeacherInterventionRow);
  const progressRows = toArray(tables.lesson_progress);
  const masteryRows = toArray(tables.mastery_records);
  const scratchpadRows = toArray(tables.lesson_scratchpads);
  const interactiveRows = toArray(tables.interactive_skill_evidence);

  const learners = toArray(tables.students)
    .filter((row) => classSection.studentIds.includes(row.id))
    .map(normalizedSchoolLearnerRow)
    .map((learner) => {
      const artifact = artifacts.find((item) => item.learnerId === learner.id && (!mission || item.groupMissionId === mission.id)) || null;
      const intervention =
        interventions.find((item) => item.learnerId === learner.id && item.classSessionId === normalizedSession.id && item.open) ||
        interventions.find((item) => item.learnerId === learner.id && item.classSessionId === normalizedSession.id) ||
        null;
      const progress = progressRows.find((row) => row.student_id === learner.id && row.lesson_id === lesson?.id) || null;
      const mastery = masteryRows.find((row) => row.student_id === learner.id && row.lesson_id === lesson?.id) || null;
      const scratchpad = scratchpadRows.find((row) => row.student_id === learner.id && row.lesson_id === lesson?.id) || null;
      const interactiveSignals = interactiveRows
        .filter((row) => row.student_id === learner.id && row.lesson_id === lesson?.id)
        .map((row) => ({
          id: row.id,
          skillId: row.skill_id,
          skillLabel: row.skill_label,
          status: row.status,
          correct: Boolean(row.correct),
          diagnosis: row.diagnosis,
          recommendedSupport: row.recommended_support,
          evidenceStrength: row.evidence_strength,
          updatedAt: row.updated_at
        }));
      return createRepositoryLearnerStatus({
        learner,
        lesson,
        mission,
        artifact,
        intervention,
        progress,
        mastery,
        scratchpad,
        interactiveSignals
      });
    });

  const needsHelp = learners.filter((item) => item.status === "Needs help").length;
  const teacherSupport = learners.filter((item) => item.status === "Teacher support").length;
  const submittedArtifacts = learners.filter((item) => item.artifact?.artifactStatus === "submitted").length;
  const mastered = learners.filter((item) => item.status === "Mastered").length;
  const averageMastery = learners.length ? Math.round(learners.reduce((sum, item) => sum + Number(item.mastery.score || 0), 0) / learners.length) : 0;

  return {
    source: "normalized-repository",
    tableIds: classroomMonitorRepositoryTableIds,
    school,
    classSection,
    session: normalizedSession.id ? normalizedSession : null,
    lesson,
    mission,
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
    confusionHeatmap: [
      { label: "Visual model", count: learners.filter((item) => /picture|diagram|map|visual|model/i.test(item.confusion)).length },
      { label: "First step", count: learners.filter((item) => /start|first|begin|step/i.test(item.confusion)).length },
      { label: "Evidence link", count: learners.filter((item) => /why|because|evidence|reason/i.test(item.confusion)).length },
      { label: "Needs teacher", count: needsHelp + teacherSupport }
    ],
    adminReadiness: [
      { label: "Roster", status: learners.length ? "Ready" : "Needs students" },
      { label: "Class session", status: normalizedSession.id ? normalizedSession.status || "Ready" : "Needs launch plan" },
      { label: "Group mission", status: mission ? "Ready" : "Needs mission" },
      { label: "Teacher scope", status: classSection.teacherId ? "Ready" : "Needs assignment" }
    ]
  };
}

export function createLearnerClassSessionReadModel(tables = {}, { learnerId = "" } = {}) {
  const learner = toArray(tables.students).map(normalizedSchoolLearnerRow).find((item) => item.id === learnerId) || null;
  if (!learner) {
    return {
      source: "normalized-repository",
      tableIds: classroomStudentRepositoryTableIds,
      classroom: null
    };
  }

  const enrollments = toArray(tables.enrollments);
  const classRows = toArray(tables.classes);
  const sessionRows = toArray(tables.class_sessions);
  const learnerEnrollments = enrollments.filter((row) => row.student_id === learner.id);
  const learnerEnrollment =
    learnerEnrollments.find((enrollment) => sessionRows.some((session) => session.class_id === enrollment.class_id)) ||
    learnerEnrollments[0] ||
    null;
  const classRow = learnerEnrollment ? classRows.find((row) => row.id === learnerEnrollment.class_id) : null;
  const classSection = classRow ? normalizedSchoolClassRow(classRow, enrollments) : null;
  if (!classSection) {
    return {
      source: "normalized-repository",
      tableIds: classroomStudentRepositoryTableIds,
      classroom: null
    };
  }

  const school = toArray(tables.schools).map(normalizedSchoolRow).find((item) => item.id === classSection.schoolId) || null;
  const session = firstSortedBy(
    toArray(tables.class_sessions).filter((row) => row.class_id === classSection.id),
    "updated_at"
  );
  const normalizedSession = normalizedClassSessionRow(session || {});
  if (!normalizedSession.id) {
    return {
      source: "normalized-repository",
      tableIds: classroomStudentRepositoryTableIds,
      classroom: null
    };
  }

  const lesson = normalizedClassroomLessonRow(toArray(tables.lessons).find((row) => row.id === normalizedSession.lessonId));
  const mission = toArray(tables.group_missions)
    .map(normalizedGroupMissionRow)
    .find((row) => row.classSessionId === normalizedSession.id) || null;
  const missionById = new Map(mission ? [[mission.id, mission]] : []);
  const artifact = toArray(tables.group_artifacts)
    .map((row) => normalizedGroupArtifactRow(row, missionById))
    .find((item) => item.learnerId === learner.id && (!mission || item.groupMissionId === mission.id)) || null;
  const intervention =
    toArray(tables.teacher_interventions)
      .map(normalizedTeacherInterventionRow)
      .find((item) => item.learnerId === learner.id && item.classSessionId === normalizedSession.id && item.open) || null;
  const progress = toArray(tables.lesson_progress).find((row) => row.student_id === learner.id && row.lesson_id === lesson?.id) || null;
  const mastery = toArray(tables.mastery_records).find((row) => row.student_id === learner.id && row.lesson_id === lesson?.id) || null;
  const scratchpad = toArray(tables.lesson_scratchpads).find((row) => row.student_id === learner.id && row.lesson_id === lesson?.id) || null;
  const interactiveSignals = toArray(tables.interactive_skill_evidence)
    .filter((row) => row.student_id === learner.id && row.lesson_id === lesson?.id)
    .map((row) => ({
      id: row.id,
      skillId: row.skill_id,
      skillLabel: row.skill_label,
      status: row.status,
      correct: Boolean(row.correct),
      diagnosis: row.diagnosis,
      recommendedSupport: row.recommended_support,
      evidenceStrength: row.evidence_strength,
      updatedAt: row.updated_at
    }));
  const learnerStatus = createRepositoryLearnerStatus({
    learner,
    lesson,
    mission,
    artifact,
    intervention,
    progress,
    mastery,
    scratchpad,
    interactiveSignals
  });
  const classmates = toArray(tables.students)
    .filter((row) => classSection.studentIds.includes(row.id))
    .map(normalizedSchoolLearnerRow);

  return {
    source: "normalized-repository",
    tableIds: classroomStudentRepositoryTableIds,
    classroom: {
      learner,
      classSection,
      session: normalizedSession,
      lesson,
      mission,
      classmates,
      learnerStatus,
      school
    }
  };
}

function gradeFromGradeLevelId(gradeLevelId = "") {
  const match = String(gradeLevelId || "").match(/(?:^|-)(k|kindergarten|\d{1,2})$/i);
  if (!match) return "";
  const value = match[1].toLowerCase();
  return value === "kindergarten" ? "K" : value.toUpperCase();
}

export function normalizedSchoolRow(row = {}) {
  return {
    id: row.id || "",
    name: row.name || "School",
    district: row.district || "",
    implementationStage: row.implementation_stage || "",
    pilotFocus: row.pilot_focus || "",
    status: row.status || "pilot",
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || ""
  };
}

export function normalizedSchoolTeacherRow(row = {}, userById = new Map()) {
  const user = userById.get(row.user_id) || {};
  return {
    id: row.id || "",
    userId: row.user_id || "",
    name: row.display_name || user.display_name || "Teacher",
    email: user.email || "",
    organizationName: row.organization_name || "",
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || ""
  };
}

export function normalizedSchoolLearnerRow(row = {}) {
  return {
    id: row.id || "",
    userId: row.user_id || "",
    academyId: row.academy_id || "",
    grade: gradeFromGradeLevelId(row.grade_level_id),
    gradeLevelId: row.grade_level_id || "",
    name: row.display_name || "Learner",
    schedule: row.schedule || "",
    status: row.status || "active",
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || ""
  };
}

export function normalizedSchoolClassRow(row = {}, enrollments = []) {
  return {
    id: row.id || "",
    schoolId: row.school_id || "",
    teacherId: row.teacher_id || "",
    name: row.name || "Class section",
    academyId: row.academy_id || "",
    grade: gradeFromGradeLevelId(row.grade_level_id),
    gradeLevelId: row.grade_level_id || "",
    subject: row.subject_id || "",
    schedule: row.schedule || "",
    status: row.status || "active",
    studentIds: enrollments.filter((enrollment) => enrollment.class_id === row.id).map((enrollment) => enrollment.student_id),
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || ""
  };
}

export function normalizedSchoolInvitationRow(row = {}) {
  return {
    id: row.id || "",
    email: row.email || "",
    role: row.role || "",
    invitedByUserId: row.invited_by_user_id || "",
    targetStudentId: row.target_student_id || "",
    targetClassId: row.target_class_id || "",
    status: row.status || "pending",
    expiresAt: row.expires_at || "",
    acceptedAt: row.accepted_at || "",
    createdAt: row.created_at || ""
  };
}

export function normalizedSchoolReportRow(row = {}) {
  return {
    id: row.id || "",
    schoolId: row.school_id || "",
    classId: row.class_id || "",
    reportType: row.report_type || "",
    summary: row.summary || "",
    metrics: toObject(row.metrics),
    createdAt: row.created_at || ""
  };
}

export function createSchoolOperationsReadModel(rowsByTable = {}, { schoolId = "", teacherId = "" } = {}) {
  const users = toArray(rowsByTable.users);
  const userById = new Map(users.map((user) => [user.id, user]));
  const schools = toArray(rowsByTable.schools).map(normalizedSchoolRow).filter((school) => !schoolId || school.id === schoolId);
  const selectedSchoolId = schoolId || schools[0]?.id || "";
  const enrollments = toArray(rowsByTable.enrollments);
  const assignmentClassIds = new Set(
    toArray(rowsByTable.teacher_class_assignments)
      .filter((assignment) => !teacherId || assignment.teacher_id === teacherId)
      .filter((assignment) => assignment.status !== "revoked")
      .map((assignment) => assignment.class_id)
  );
  const classes = toArray(rowsByTable.classes)
    .filter((row) => !selectedSchoolId || row.school_id === selectedSchoolId)
    .filter((row) => !teacherId || row.teacher_id === teacherId || assignmentClassIds.has(row.id))
    .map((row) => normalizedSchoolClassRow(row, enrollments));
  const classIds = new Set(classes.map((section) => section.id));
  const learnerIds = new Set(enrollments.filter((enrollment) => classIds.has(enrollment.class_id)).map((enrollment) => enrollment.student_id));
  const learners = toArray(rowsByTable.students)
    .filter((row) => !learnerIds.size || learnerIds.has(row.id))
    .map(normalizedSchoolLearnerRow);
  const teachers = toArray(rowsByTable.teachers)
    .map((row) => normalizedSchoolTeacherRow(row, userById))
    .filter((teacher) => !teacherId || teacher.id === teacherId);
  const invitations = toArray(rowsByTable.account_invitations)
    .map(normalizedSchoolInvitationRow)
    .filter((invitation) => !classIds.size || !invitation.targetClassId || classIds.has(invitation.targetClassId));
  const reports = toArray(rowsByTable.school_reports)
    .map(normalizedSchoolReportRow)
    .filter((report) => !selectedSchoolId || report.schoolId === selectedSchoolId)
    .filter((report) => !classIds.size || !report.classId || classIds.has(report.classId));

  return {
    source: "normalized-repository",
    tableIds: schoolOperationsReadRepositoryTableIds,
    summary: {
      schools: schools.length,
      classes: classes.length,
      learners: learners.length,
      teachers: teachers.length,
      pendingInvitations: invitations.filter((invitation) => invitation.status === "pending").length,
      activeClasses: classes.filter((section) => section.status === "active").length,
      reports: reports.length,
      enrolledStudents: new Set(classes.flatMap((section) => section.studentIds)).size
    },
    school: schools[0] || null,
    classes,
    learners,
    teachers,
    pendingInvitations: invitations.filter((invitation) => invitation.status === "pending"),
    invitations,
    reports
  };
}

function reviewCommandId(row = {}) {
  const sourceType = row.source_type || "";
  const sourceId = row.source_id || "";
  return sourceType && sourceId ? `${sourceType}:${sourceId}` : row.id || "";
}

function reviewActionSet(sourceType) {
  return sourceType === "ai" ? ["reviewed"] : ["approve", "request_revision", "reject"];
}

function reviewTitle(row = {}) {
  const labels = {
    ai: "AI tutor review",
    content: "Content review",
    tool: "Tool output review",
    visual: "Visual asset review",
    redesign: "Lesson redesign review"
  };
  return `${labels[row.source_type] || "Review item"}: ${row.source_id || row.id || "unknown"}`;
}

function reviewSummary(row = {}) {
  const summaries = {
    ai: "Truth-policy or safety review is required before this tutor interaction is treated as cleared.",
    content: "Manager review is required before this lesson draft can publish or return to draft.",
    tool: "A staff reviewer must approve or reject this tool output before it can affect curriculum, visuals, or student-facing content.",
    visual: "A staff reviewer must check accuracy, age fit, license, caption, and alt text before this visual becomes student-facing.",
    redesign: "A manager must approve, reject, or request revision before this lesson-improvement signal becomes assigned redesign work."
  };
  return summaries[row.source_type] || "A manager decision is required for this review item.";
}

export function normalizedAgentReviewItemRow(row = {}) {
  const sourceType = row.source_type || "";
  const status = row.status || "pending";
  const decision = row.decision || "";
  return {
    id: reviewCommandId(row),
    rowId: row.id || "",
    sourceType,
    type: sourceType || "review",
    sourceId: row.source_id || "",
    ownerAgentId: row.owner_agent_id || "manager",
    priority: row.priority || "medium",
    status,
    decision,
    reviewedByUserId: row.reviewed_by_user_id || "",
    reviewedAt: row.reviewed_at || "",
    artifactType: row.artifact_type || "",
    artifactId: row.artifact_id || row.source_id || "",
    score: typeof row.score === "number" ? row.score : row.score ? Number(row.score) : null,
    grade: row.grade || "",
    threshold: typeof row.threshold === "number" ? row.threshold : row.threshold ? Number(row.threshold) : null,
    passed: Boolean(row.passed),
    criticalBlockers: row.critical_blockers || [],
    blockers: row.blockers || [],
    revisionInstructions: row.revision_instructions || [],
    reviewHistory: row.review_history || [],
    title: reviewTitle(row),
    summary: row.grade ? `${reviewSummary(row)} Current grade: ${row.grade} (${row.score ?? "n/a"}/${row.threshold ?? "n/a"}).` : reviewSummary(row),
    nextAction: decision ? "Decision has been recorded." : row.revision_instructions?.length ? row.revision_instructions[0] : "Review and record an approval, rejection, or reviewed decision.",
    actions: decision || status !== "pending" ? [] : reviewActionSet(sourceType)
  };
}

export function createAgentReviewReadModel(rows = [], { status = "", ownerAgentId = "", priority = "" } = {}) {
  const items = rows
    .map(normalizedAgentReviewItemRow)
    .filter((item) => !status || item.status === status)
    .filter((item) => !ownerAgentId || item.ownerAgentId === ownerAgentId)
    .filter((item) => !priority || item.priority === priority)
    .sort((left, right) => {
      const priorityRank = { high: 0, medium: 1, low: 2 };
      return (priorityRank[left.priority] ?? 3) - (priorityRank[right.priority] ?? 3) || left.title.localeCompare(right.title);
    });

  return {
    source: "normalized-repository",
    tableIds: agentReviewRepositoryTableIds,
    summary: {
      total: items.length,
      pending: items.filter((item) => item.status === "pending").length,
      highPriority: items.filter((item) => item.priority === "high").length,
      approved: items.filter((item) => item.decision === "approve" || item.decision === "approved").length,
      rejected: items.filter((item) => item.decision === "reject" || item.decision === "rejected").length,
      reviewed: items.filter((item) => item.decision === "reviewed" || item.status === "reviewed").length,
      visualReview: items.filter((item) => item.type === "visual").length,
      contentReview: items.filter((item) => item.type === "content").length,
      batchReview: items.filter((item) => item.type === "batch").length,
      toolReview: items.filter((item) => item.type === "tool").length,
      aiReview: items.filter((item) => item.type === "ai").length,
      redesignReview: items.filter((item) => item.type === "redesign").length
    },
    items
  };
}

export function normalizedAuditEventRow(row = {}, category = "data") {
  return {
    id: row.id || "",
    category,
    actorUserId: row.actor_user_id || "",
    targetUserId: row.target_user_id || "",
    eventType: row.event_type || "",
    entityType: row.entity_type || "",
    entityId: row.entity_id || "",
    metadata: toObject(row.metadata),
    createdAt: row.created_at || ""
  };
}

export function createAuditEventReadModel({ auditRows = [], authRows = [] } = {}, { eventType = "", entityType = "", category = "" } = {}) {
  const events = [
    ...auditRows.map((row) => normalizedAuditEventRow(row, "data")),
    ...authRows.map((row) => normalizedAuditEventRow(row, "auth"))
  ]
    .filter((event) => !eventType || event.eventType === eventType)
    .filter((event) => !entityType || event.entityType === entityType)
    .filter((event) => !category || event.category === category)
    .sort((left, right) => String(right.createdAt || "").localeCompare(String(left.createdAt || "")));

  return {
    source: "normalized-repository",
    tableIds: auditEventRepositoryTableIds,
    summary: {
      total: events.length,
      auth: events.filter((event) => event.category === "auth").length,
      data: events.filter((event) => event.category === "data").length,
      toolCalls: events.filter((event) => event.entityType === "agent_tool_call").length,
      learningEvents: events.filter((event) => event.entityType === "lesson").length,
      byEventType: events.reduce((counts, event) => {
        const key = event.eventType || "unknown";
        counts[key] = (counts[key] || 0) + 1;
        return counts;
      }, {})
    },
    events
  };
}

export function normalizedAccountUserRow(row = {}) {
  return {
    id: row.id || "",
    userId: row.id || "",
    role: row.role || "",
    displayName: row.display_name || "",
    email: row.email || "",
    emailVerified: Boolean(row.email_verified),
    authProvider: row.auth_provider || "",
    providerSubject: row.provider_subject || "",
    status: row.status || "",
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || ""
  };
}

export function normalizedAccountAuthAuditRow(row = {}) {
  return {
    id: row.id || "",
    actorUserId: row.actor_user_id || "",
    targetUserId: row.target_user_id || "",
    eventType: row.event_type || "",
    entityType: row.entity_type || "",
    entityId: row.entity_id || "",
    metadata: toObject(row.metadata),
    createdAt: row.created_at || ""
  };
}

export function normalizedSessionRevocationRow(row = {}) {
  return {
    id: row.id || "",
    userId: row.user_id || "",
    sessionId: row.session_id || "",
    revokedBefore: row.revoked_before || "",
    reason: row.reason || "",
    createdAt: row.created_at || ""
  };
}

export function createAccountSecurityReadModel(rowsByTable = {}, options = {}) {
  const role = options.role || "";
  const users = toArray(rowsByTable.users).map(normalizedAccountUserRow).filter((user) => !role || user.role === role);
  const students = toArray(rowsByTable.students);
  const guardians = toArray(rowsByTable.guardians);
  const teachers = toArray(rowsByTable.teachers);
  const invitations = toArray(rowsByTable.account_invitations);
  const guardianLinks = toArray(rowsByTable.guardian_student_links);
  const sessionRevocations = toArray(rowsByTable.session_revocations)
    .map(normalizedSessionRevocationRow)
    .sort((left, right) => String(right.createdAt || "").localeCompare(String(left.createdAt || "")));
  const authAuditEvents = toArray(rowsByTable.auth_audit_events)
    .map(normalizedAccountAuthAuditRow)
    .sort((left, right) => String(right.createdAt || "").localeCompare(String(left.createdAt || "")));
  const pendingEmailVerification = authAuditEvents.filter(
    (event) => event.eventType === "email-verification-request" && (event.metadata.status || "pending") === "pending"
  );
  const pendingPasswordReset = authAuditEvents.filter(
    (event) => event.eventType === "password-reset-request" && (event.metadata.status || "pending") === "pending"
  );

  return {
    source: "normalized-repository",
    tableIds: accountSecurityRepositoryTableIds,
    summary: {
      accountCount: users.length,
      verifiedAccounts: users.filter((user) => user.emailVerified).length,
      pendingVerificationAccounts: users.filter((user) => user.email && !user.emailVerified).length,
      studentAccounts: users.filter((user) => user.role === "student").length,
      parentAccounts: users.filter((user) => user.role === "parent").length,
      teacherAccounts: users.filter((user) => user.role === "teacher").length,
      managedChildAccounts: users.filter((user) => user.authProvider === "managed-child").length,
      pendingEmailVerification: pendingEmailVerification.length,
      pendingPasswordReset: pendingPasswordReset.length,
      revokedSessions: sessionRevocations.length,
      pendingInvitations: invitations.filter((invitation) => (invitation.status || "pending") === "pending").length,
      guardianLinks: guardianLinks.filter((link) => (link.status || "approved") === "approved").length,
      consentRecords: toArray(rowsByTable.consent_records).length,
      authAuditEvents: authAuditEvents.length
    },
    accounts: users,
    students: students.map((row) => ({
      id: row.id || "",
      userId: row.user_id || "",
      displayName: row.display_name || "",
      academyId: row.academy_id || "",
      gradeLevelId: row.grade_level_id || "",
      status: row.status || ""
    })),
    guardians: guardians.map((row) => ({
      id: row.id || "",
      userId: row.user_id || "",
      householdSetupComplete: Boolean(row.household_setup_complete)
    })),
    teachers: teachers.map((row) => ({
      id: row.id || "",
      userId: row.user_id || "",
      displayName: row.display_name || "",
      organizationName: row.organization_name || ""
    })),
    pendingEmailVerification,
    pendingPasswordReset,
    sessionRevocations,
    authAuditEvents,
    invitations,
    guardianLinks
  };
}

export function createLearnerProfileReadModel(rowsByTable = {}, options = {}) {
  const role = options.role || "";
  const requestedIds = new Set((options.learnerIds || []).filter(Boolean));
  const users = toArray(rowsByTable.users);
  const students = toArray(rowsByTable.students);
  const guardians = toArray(rowsByTable.guardians);
  const gradeLevels = toArray(rowsByTable.grade_levels);
  const classes = toArray(rowsByTable.classes);
  const enrollments = toArray(rowsByTable.enrollments).filter((row) => (row.status || "active") === "active");
  const accommodations = toArray(rowsByTable.accommodations);
  const directLinks = toArray(rowsByTable.student_guardians).filter((row) => row.student_id && row.guardian_id);
  const approvedLinks = toArray(rowsByTable.guardian_student_links).filter(
    (row) => row.student_id && row.guardian_id && (row.status || "approved") === "approved" && !row.revoked_at
  );
  const allLinks = [...directLinks, ...approvedLinks];
  const userById = new Map(users.map((row) => [row.id, row]));
  const guardianById = new Map(guardians.map((row) => [row.id, row]));
  const gradeById = new Map(gradeLevels.map((row) => [row.id, row]));
  const classById = new Map(classes.map((row) => [row.id, row]));

  const allowedIds = new Set();
  if (role === "student" && options.studentId) allowedIds.add(options.studentId);
  if (role === "parent" && options.guardianId) {
    for (const link of allLinks) if (link.guardian_id === options.guardianId) allowedIds.add(link.student_id);
  }
  if (role === "teacher" && options.teacherId) {
    const assignedClassIds = new Set(
      toArray(rowsByTable.teacher_class_assignments)
        .filter((row) => row.teacher_id === options.teacherId && (row.status || "active") === "active" && !row.revoked_at)
        .map((row) => row.class_id)
    );
    for (const enrollment of enrollments) {
      if (assignedClassIds.has(enrollment.class_id)) allowedIds.add(enrollment.student_id);
    }
  }
  if (!role && requestedIds.size) for (const id of requestedIds) allowedIds.add(id);
  if (requestedIds.size) {
    for (const id of [...allowedIds]) if (!requestedIds.has(id)) allowedIds.delete(id);
  }

  const learnerRows = students.filter((row) => !allowedIds.size || allowedIds.has(row.id));
  const learners = learnerRows.map((row) => {
    const user = userById.get(row.user_id) || {};
    const grade = gradeById.get(row.grade_level_id) || {};
    const linkedGuardianIds = [...new Set(allLinks.filter((link) => link.student_id === row.id).map((link) => link.guardian_id))];
    const learnerEnrollments = enrollments.filter((enrollment) => enrollment.student_id === row.id);
    return {
      id: row.id || "",
      userId: row.user_id || "",
      name: row.display_name || user.display_name || "Learner",
      displayName: row.display_name || user.display_name || "Learner",
      email: user.email || "",
      emailVerified: Boolean(user.email_verified),
      accountStatus: user.status || row.status || "active",
      status: row.status || "active",
      academyId: row.academy_id || grade.grade_band_id || "",
      gradeLevelId: row.grade_level_id || "",
      grade: grade.grade ?? (String(row.grade_level_id || "").split("-").pop() || ""),
      gradeLabel: grade.label || "",
      schedule: row.schedule || "",
      guardianIds: linkedGuardianIds,
      classIds: learnerEnrollments.map((enrollment) => enrollment.class_id).filter(Boolean),
      classes: learnerEnrollments
        .map((enrollment) => classById.get(enrollment.class_id))
        .filter(Boolean)
        .map((item) => ({ id: item.id, name: item.name, subjectId: item.subject_id || "", status: item.status || "active" })),
      accommodations: accommodations.filter((item) => item.student_id === row.id).map((item) => item.support).filter(Boolean)
    };
  });

  return {
    source: "normalized-repository",
    tableIds: learnerProfileRepositoryTableIds,
    scope: { role, learnerIds: learners.map((learner) => learner.id) },
    summary: { learnerCount: learners.length, activeLearners: learners.filter((learner) => learner.status === "active").length },
    learners
  };
}

function createUpsertStatement(table, rows) {
  const uniqueRows = [...new Map((rows || []).map((row) => [row[table.primaryKey], row])).values()].filter((row) => row[table.primaryKey]);
  if (!uniqueRows.length) return `-- ${table.id}: no rows to upsert`;
  const columns = table.columns;
  const foreignKeyColumns = new Set((table.foreignKeys || []).map((relation) => relation.column));
  const updateColumns = columns.filter((column) => column !== table.primaryKey);
  const updateClause = updateColumns.length
    ? `do update set ${updateColumns.map((column) => `${q(column)} = excluded.${q(column)}`).join(", ")}`
    : "do nothing";

  return uniqueRows
    .map((row) =>
      [
        `insert into public.${q(table.id)} (${columns.map(q).join(", ")})`,
        `values (${columns.map((column) => sqlValue(row[column], column, { foreignKey: foreignKeyColumns.has(column) })).join(", ")})`,
        `on conflict (${q(table.primaryKey)}) ${updateClause};`
      ].join("\n")
    )
    .join("\n\n");
}

export function createNormalizedStateUpsertSql(state, tableIds = normalizedRepositoryTableIds) {
  const projection = createProductionSeedProjection(state);
  const statements = tableIds.map((tableId) => createUpsertStatement(tableMeta(tableId), projection.tables[tableId] || []));
  return {
    tableIds,
    projectionSummary: projection.summary,
    rowCounts: Object.fromEntries(tableIds.map((tableId) => [tableId, projection.tables[tableId]?.length || 0])),
    sql: `${statements.join("\n\n")}\n`
  };
}

export function createNormalizedTableDeleteMissingSql(state, tableIds = []) {
  const projection = createProductionSeedProjection(state);
  const statements = tableIds.map((tableId) => {
    const table = tableMeta(tableId);
    const ids = [...new Set((projection.tables[tableId] || []).map((row) => row?.[table.primaryKey]).filter((id) => id !== undefined && id !== null && id !== ""))];
    const target = `public.${q(table.id)}`;
    if (!ids.length) {
      return `delete from ${target};`;
    }
    return `delete from ${target} where ${q(table.primaryKey)} not in (${ids.map(sqlString).join(", ")});`;
  });
  return {
    tableIds,
    rowCounts: Object.fromEntries(tableIds.map((tableId) => [tableId, projection.tables[tableId]?.length || 0])),
    sql: `${statements.join("\n\n")}\n`
  };
}

export function createNormalizedTableSelectSql(tableId, { limit = 100 } = {}) {
  const table = tableMeta(tableId);
  const rowLimit = normalizedLimit(limit);
  return [
    "select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb)::text",
    "from (",
    `  select * from public.${q(table.id)}`,
    `  order by ${q(table.primaryKey)}`,
    `  limit ${rowLimit}`,
    ") as t;"
  ].join("\n");
}

function runPsql({ sql, env }) {
  const databaseUrl = env.DATABASE_URL;
  const psqlBin = env.PSQL_BIN || "psql";
  const timeoutMs = Math.max(1000, Number(env.K12_REPOSITORY_TIMEOUT_MS || 10000));
  return new Promise((resolve, reject) => {
    if (!databaseUrl) {
      reject(new Error("DATABASE_URL is required for postgres repository mode."));
      return;
    }

    let settled = false;
    const child = spawn(psqlBin, [databaseUrl, "--no-psqlrc", "-q", "-v", "ON_ERROR_STOP=1", "-t", "-A"], {
      env,
      stdio: ["pipe", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";
    const finish = (callback, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      callback(value);
    };
    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      finish(
        reject,
        new Error(
          `Postgres repository command timed out after ${timeoutMs}ms. Check DATABASE_URL, Supabase pooler settings, VPN/firewall, or set K12_REPOSITORY_MODE=json for local UI work.`
        )
      );
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", (error) => finish(reject, error));
    child.stdin.on("error", () => {
      // psql closes stdin early when authentication or network setup fails.
      // The process close handler returns the useful stderr message.
    });
    child.on("close", (code) => {
      if (code === 0) {
        finish(resolve, stdout.trim());
      } else {
        finish(reject, new Error(stderr.trim() || `psql exited with code ${code}`));
      }
    });
    child.stdin.end(sql);
  });
}

export class PostgresStateRepository {
  constructor({ env }) {
    this.mode = "postgres";
    this.env = env;
  }

  status() {
    return {
      mode: this.mode,
      configured: Boolean(this.env.DATABASE_URL),
      durable: true,
      table: "public.app_state_snapshots",
      normalizedTables: normalizedRepositoryTableIds.length
    };
  }

  async readState() {
    const sql = [
      "select coalesce(",
      "  (select payload::text from public.app_state_snapshots where id = 'current' order by updated_at desc limit 1),",
      "  '{}'::jsonb::text",
      ") as payload;"
    ].join("\n");
    const raw = await runPsql({ sql, env: this.env });
    const parsed = raw ? JSON.parse(raw) : {};
    return mergeInitialState(parsed);
  }

  async readNormalizedTable(tableId, options = {}) {
    const sql = createNormalizedTableSelectSql(tableId, options);
    const raw = await runPsql({ sql, env: this.env });
    return raw ? JSON.parse(raw) : [];
  }

  async readNormalizedTableSummary() {
    const projection = createProductionSeedProjection(await this.readState());
    return {
      mode: this.mode,
      tableIds: normalizedRepositoryTableIds,
      projectionSummary: projection.summary,
      rowCounts: Object.fromEntries(normalizedRepositoryTableIds.map((tableId) => [tableId, projection.tables[tableId]?.length || 0]))
    };
  }

  async readLearningCatalog(options = {}) {
    const rowsByTable = Object.fromEntries(
      await Promise.all(
        learningCatalogRepositoryTableIds.map(async (tableId) => [
          tableId,
          await this.readNormalizedTable(tableId, { limit: options.limit || 10000 })
        ])
      )
    );
    return createLearningCatalogReadModel(rowsByTable, options);
  }

  async readContentDrafts(options = {}) {
    const rows = await this.readNormalizedTable("content_drafts", { limit: options.limit || 10000 });
    return createContentDraftReadModel(rows, options);
  }

  async readContentBatchReviews(options = {}) {
    const rows = await this.readNormalizedTable("content_batch_reviews", { limit: options.limit || 10000 });
    return createContentBatchReviewReadModel(rows, options);
  }

  async readVisualAssets(options = {}) {
    const rows = await this.readNormalizedTable("visual_assets", { limit: options.limit || 10000 });
    return createVisualAssetReadModel(rows, options);
  }

  async readAiTutorEvents(options = {}) {
    const rows = await this.readNormalizedTable("ai_tutor_events", { limit: options.limit || 10000 });
    return createAiTutorEventReadModel(rows, options);
  }

  async readRewardApprovals(options = {}) {
    const rows = await this.readNormalizedTable("reward_approvals", { limit: options.limit || 10000 });
    return createRewardApprovalReadModel(rows, options);
  }

  async readLessonScratchpads(options = {}) {
    const rows = await this.readNormalizedTable("lesson_scratchpads", { limit: options.limit || 10000 });
    return createLessonScratchpadReadModel(rows, options);
  }

  async readAssignments(options = {}) {
    const rows = await this.readNormalizedTable("assignments", { limit: options.limit || 10000 });
    return createAssignmentReadModel(rows, options);
  }

  async readRetentionSchedules(options = {}) {
    const rows = await this.readNormalizedTable("retention_schedules", { limit: options.limit || 10000 });
    return createRetentionScheduleReadModel(rows, options);
  }

  async readPortfolioEvidence(options = {}) {
    const [portfolioRows, studentBadgeRows, badgeRows] = await Promise.all(
      portfolioEvidenceRepositoryTableIds.map((tableId) => this.readNormalizedTable(tableId, { limit: options.limit || 10000 }))
    );
    return createPortfolioEvidenceReadModel({ portfolioRows, studentBadgeRows, badgeRows }, options);
  }

  async readClassroomEvidence(options = {}) {
    const [sessionRows, missionRows, artifactRows, interventionRows] = await Promise.all(
      classroomEvidenceRepositoryTableIds.map((tableId) => this.readNormalizedTable(tableId, { limit: options.limit || 10000 }))
    );
    return createClassroomEvidenceReadModel({ sessionRows, missionRows, artifactRows, interventionRows }, options);
  }

  async readClassroomMonitor(options = {}) {
    const rowsByTable = Object.fromEntries(
      await Promise.all(
        classroomMonitorRepositoryTableIds.map(async (tableId) => [
          tableId,
          await this.readNormalizedTable(tableId, { limit: options.limit || 10000 })
        ])
      )
    );
    return createClassroomMonitorReadModel(rowsByTable, options);
  }

  async readLearnerClassSession(options = {}) {
    const rowsByTable = Object.fromEntries(
      await Promise.all(
        classroomStudentRepositoryTableIds.map(async (tableId) => [
          tableId,
          await this.readNormalizedTable(tableId, { limit: options.limit || 10000 })
        ])
      )
    );
    return createLearnerClassSessionReadModel(rowsByTable, options);
  }

  async readSchoolOperations(options = {}) {
    const rowsByTable = Object.fromEntries(
      await Promise.all(
        schoolOperationsReadRepositoryTableIds.map(async (tableId) => [
          tableId,
          await this.readNormalizedTable(tableId, { limit: options.limit || 10000 })
        ])
      )
    );
    return createSchoolOperationsReadModel(rowsByTable, options);
  }

  async readAgentReviewItems(options = {}) {
    const rows = await this.readNormalizedTable("agent_review_items", { limit: options.limit || 10000 });
    return createAgentReviewReadModel(rows, options);
  }

  async readAuditEvents(options = {}) {
    const [auditRows, authRows] = await Promise.all(
      auditEventRepositoryTableIds.map((tableId) => this.readNormalizedTable(tableId, { limit: options.limit || 10000 }))
    );
    return createAuditEventReadModel({ auditRows, authRows }, options);
  }

  async readAccountSecurity(options = {}) {
    const rowsByTable = Object.fromEntries(
      await Promise.all(
        accountSecurityRepositoryTableIds.map(async (tableId) => [
          tableId,
          await this.readNormalizedTable(tableId, { limit: options.limit || 10000 })
        ])
      )
    );
    return createAccountSecurityReadModel(rowsByTable, options);
  }

  async readLearnerProfiles(options = {}) {
    const rowsByTable = Object.fromEntries(
      await Promise.all(
        learnerProfileRepositoryTableIds.map(async (tableId) => [
          tableId,
          await this.readNormalizedTable(tableId, { limit: options.limit || 10000 })
        ])
      )
    );
    return createLearnerProfileReadModel(rowsByTable, options);
  }

  async isSessionRevoked(session = {}) {
    const rows = await this.readNormalizedTable("session_revocations", { limit: 10000 });
    const userId = String(session.userId || "");
    const sessionId = String(session.sessionId || "");
    const issuedAt = Date.parse(session.issuedAt || "") || 0;
    return rows.some((row) => {
      if (String(row.user_id || "") !== userId) return false;
      if (row.session_id && String(row.session_id) === sessionId) return true;
      const revokedBefore = Date.parse(row.revoked_before || "") || 0;
      return Boolean(revokedBefore && issuedAt && issuedAt <= revokedBefore);
    });
  }

  async writeProjectedState(state, tableIds, { splitTables = false, syncTableIds = [] } = {}) {
    const nextState = {
      ...mergeInitialState(state),
      persistence: {
        ...(state?.persistence || {}),
        source: "postgres",
        syncedAt: new Date().toISOString(),
        lastError: null
      },
      persistedAt: new Date().toISOString()
    };
    const payload = sqlString(JSON.stringify(nextState));
    const sql = `
      insert into public.app_state_snapshots ("id", "payload", "created_at", "updated_at")
      values ('current', ${payload}::jsonb, now(), now())
      on conflict ("id") do update set
        "payload" = excluded."payload",
        "updated_at" = now()
      returning "payload"::text;
    `;
    if (splitTables) {
      for (const tableId of tableIds) {
        const tablePlan = createNormalizedStateUpsertSql(nextState, [tableId]);
        if (tablePlan.sql.trim()) {
          await runPsql({ sql: tablePlan.sql, env: this.env });
        }
      }
    } else {
      const normalized = createNormalizedStateUpsertSql(nextState, tableIds);
      await runPsql({ sql: normalized.sql, env: this.env });
    }
    if (syncTableIds.length) {
      const cleanup = createNormalizedTableDeleteMissingSql(nextState, syncTableIds);
      if (cleanup.sql.trim()) {
        await runPsql({ sql: cleanup.sql, env: this.env });
      }
    }
    const raw = await runPsql({ sql, env: this.env });
    return mergeInitialState(raw ? JSON.parse(raw) : nextState);
  }

  async writeState(state) {
    return this.writeProjectedState(state, normalizedRepositoryTableIds);
  }

  async writeLearningEvidence(state) {
    return this.writeProjectedState(state, learningEvidenceRepositoryTableIds, { splitTables: true });
  }

  async writeTutorWorkflow(state) {
    return this.writeProjectedState(state, tutorWorkflowRepositoryTableIds, { splitTables: true });
  }

  async writeRewardWorkflow(state) {
    return this.writeProjectedState(state, rewardWorkflowRepositoryTableIds, { splitTables: true });
  }

  async writeToolGatewayWorkflow(state) {
    return this.writeProjectedState(state, toolGatewayWorkflowRepositoryTableIds, {
      splitTables: true,
      syncTableIds: ["agent_review_items"]
    });
  }

  async writeContentWorkflow(state) {
    return this.writeProjectedState(state, contentWorkflowRepositoryTableIds, {
      splitTables: true,
      syncTableIds: agentReviewRepositoryTableIds
    });
  }

  async writeClassroomWorkflow(state) {
    return this.writeProjectedState(state, classroomWorkflowRepositoryTableIds, { splitTables: true });
  }

  async writeSchoolOperations(state) {
    return this.writeProjectedState(state, schoolOperationsRepositoryTableIds, { splitTables: true });
  }

  async writeVisualWorkflow(state) {
    return this.writeProjectedState(state, visualWorkflowRepositoryTableIds, {
      splitTables: true,
      syncTableIds: agentReviewRepositoryTableIds
    });
  }

  async writeAgentReviewDecision(state) {
    return this.writeProjectedState(state, agentReviewDecisionRepositoryTableIds, {
      splitTables: true,
      syncTableIds: agentReviewRepositoryTableIds
    });
  }

  async writeAccountSecurity(state) {
    return this.writeProjectedState(state, accountSecurityRepositoryTableIds, { splitTables: true });
  }
}

export function createStateRepository({ root, env = process.env }) {
  if (env.K12_REPOSITORY_MODE === "postgres" || (!env.K12_REPOSITORY_MODE && env.DATABASE_URL)) {
    return new PostgresStateRepository({ env });
  }
  return new JsonStateRepository({ root });
}
