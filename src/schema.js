import { curriculum, pilotLessons, rewardCatalog, standardsFrameworks, syllabusResearchFindings } from "./data.js";

export const productionRoles = [
  {
    id: "student",
    label: "Student",
    scope: "Own learner profile, assigned lessons, attempts, progress, portfolio, badges, and tutor history."
  },
  {
    id: "parent",
    label: "Parent",
    scope: "Own household, linked children, consent, reports, assignments, portfolio, and AI visibility."
  },
  {
    id: "teacher",
    label: "Teacher",
    scope: "Assigned classes, enrolled students, lesson assignments, review notes, reports, and interventions."
  },
  {
    id: "school-admin",
    label: "School Admin",
    scope: "School setup, teachers, classes, enrollments, curriculum visibility, and school reports."
  },
  {
    id: "platform-admin",
    label: "Platform Admin",
    scope: "Platform content, schema, tool registry, reviews, safety logs, and operational audit events."
  }
];

export const requiredProductionTables = [
  "users",
  "students",
  "guardians",
  "teachers",
  "schools",
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
  "lesson_scratchpads",
  "standards",
  "lesson_standards",
  "assignments",
  "portfolio_items",
  "badges",
  "student_badges",
  "content_batch_reviews"
];

export const productionDataModel = [
  {
    id: "users",
    area: "identity",
    ownerAgentId: "architecture",
    description: "Authenticated accounts for parents, teachers, admins, and student login shells when enabled.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: ["id", "role", "display_name", "email", "email_verified", "auth_provider", "provider_subject", "status", "created_at", "updated_at"]
  },
  {
    id: "students",
    area: "identity",
    ownerAgentId: "backend",
    description: "Learner profile, grade placement, academy, schedule, and support settings.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: ["id", "user_id", "academy_id", "grade_level_id", "display_name", "schedule", "status", "created_at", "updated_at"],
    foreignKeys: [{ column: "user_id", references: "users.id" }, { column: "grade_level_id", references: "grade_levels.id" }]
  },
  {
    id: "guardians",
    area: "identity",
    ownerAgentId: "backend",
    description: "Parent/guardian records linked to household learners.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: ["id", "user_id", "preferred_report_day", "household_setup_complete", "created_at", "updated_at"],
    foreignKeys: [{ column: "user_id", references: "users.id" }]
  },
  {
    id: "student_guardians",
    area: "identity",
    ownerAgentId: "backend",
    description: "Many-to-many link between learners and guardians.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: ["id", "student_id", "guardian_id", "relationship", "can_manage_consent", "created_at"],
    foreignKeys: [{ column: "student_id", references: "students.id" }, { column: "guardian_id", references: "guardians.id" }]
  },
  {
    id: "account_invitations",
    area: "identity",
    ownerAgentId: "backend",
    description: "Provider-backed account invitations for parent, teacher, and student onboarding.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: [
      "id",
      "email",
      "role",
      "invited_by_user_id",
      "target_student_id",
      "target_class_id",
      "token_hash",
      "status",
      "expires_at",
      "accepted_at",
      "created_at"
    ],
    foreignKeys: [
      { column: "invited_by_user_id", references: "users.id" },
      { column: "target_student_id", references: "students.id" },
      { column: "target_class_id", references: "classes.id" }
    ]
  },
  {
    id: "guardian_student_links",
    area: "identity",
    ownerAgentId: "backend",
    description: "Parent-child link requests, approvals, and revocations before they become active household links.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: [
      "id",
      "guardian_id",
      "student_id",
      "relationship",
      "status",
      "requested_by_user_id",
      "approved_by_user_id",
      "created_at",
      "approved_at",
      "revoked_at"
    ],
    foreignKeys: [
      { column: "guardian_id", references: "guardians.id" },
      { column: "student_id", references: "students.id" },
      { column: "requested_by_user_id", references: "users.id" },
      { column: "approved_by_user_id", references: "users.id" }
    ]
  },
  {
    id: "session_revocations",
    area: "identity",
    ownerAgentId: "backend",
    description: "Revoked sessions and revoke-before markers used to invalidate old provider or app sessions.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: ["id", "user_id", "session_id", "revoked_before", "reason", "created_at"],
    foreignKeys: [{ column: "user_id", references: "users.id" }]
  },
  {
    id: "teachers",
    area: "identity",
    ownerAgentId: "backend",
    description: "Teacher profiles for homeschool co-ops, tutors, and school expansion.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: ["id", "user_id", "display_name", "organization_name", "created_at", "updated_at"],
    foreignKeys: [{ column: "user_id", references: "users.id" }]
  },
  {
    id: "schools",
    area: "roster",
    ownerAgentId: "backend",
    description: "School or organization profile for school-sellable classroom deployments.",
    primaryKey: "id",
    pii: false,
    rls: true,
    columns: ["id", "name", "district", "implementation_stage", "pilot_focus", "status", "created_at", "updated_at"]
  },
  {
    id: "classes",
    area: "roster",
    ownerAgentId: "backend",
    description: "Class, cohort, household, or study group containers.",
    primaryKey: "id",
    pii: false,
    rls: true,
    columns: ["id", "school_id", "teacher_id", "name", "academy_id", "grade_level_id", "subject_id", "schedule", "status", "created_at", "updated_at"],
    foreignKeys: [
      { column: "school_id", references: "schools.id" },
      { column: "teacher_id", references: "teachers.id" },
      { column: "grade_level_id", references: "grade_levels.id" },
      { column: "subject_id", references: "subjects.id" }
    ]
  },
  {
    id: "teacher_class_assignments",
    area: "roster",
    ownerAgentId: "backend",
    description: "Teacher-class assignment approvals and revocations for role-scoped classroom access.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: ["id", "teacher_id", "class_id", "assigned_by_user_id", "status", "created_at", "revoked_at"],
    foreignKeys: [
      { column: "teacher_id", references: "teachers.id" },
      { column: "class_id", references: "classes.id" },
      { column: "assigned_by_user_id", references: "users.id" }
    ]
  },
  {
    id: "enrollments",
    area: "roster",
    ownerAgentId: "backend",
    description: "Students assigned to classes and courses.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: ["id", "student_id", "class_id", "course_id", "status", "started_at", "ended_at"],
    foreignKeys: [{ column: "student_id", references: "students.id" }, { column: "class_id", references: "classes.id" }, { column: "course_id", references: "courses.id" }]
  },
  {
    id: "class_sessions",
    area: "roster",
    ownerAgentId: "backend",
    description: "A class-period learning block that students attend inside the app.",
    primaryKey: "id",
    pii: false,
    rls: true,
    columns: [
      "id",
      "class_id",
      "lesson_id",
      "title",
      "status",
      "period_label",
      "duration_minutes",
      "launch_goal",
      "steps",
      "started_at",
      "ended_at",
      "created_at",
      "updated_at"
    ],
    foreignKeys: [{ column: "class_id", references: "classes.id" }, { column: "lesson_id", references: "lessons.id" }]
  },
  {
    id: "group_missions",
    area: "roster",
    ownerAgentId: "backend",
    description: "Structured collaborative work for Bridge and Scholar class sessions.",
    primaryKey: "id",
    pii: false,
    rls: true,
    columns: [
      "id",
      "class_session_id",
      "title",
      "group_size",
      "shared_artifact",
      "role_labels",
      "individual_evidence",
      "teacher_look_for",
      "status",
      "created_at",
      "updated_at"
    ],
    foreignKeys: [{ column: "class_session_id", references: "class_sessions.id" }]
  },
  {
    id: "group_artifacts",
    area: "roster",
    ownerAgentId: "backend",
    description: "Shared group output and each learner's individual accountability evidence.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: ["id", "group_mission_id", "student_id", "artifact_title", "artifact_status", "individual_evidence", "submitted_at", "reviewed_at"],
    foreignKeys: [{ column: "group_mission_id", references: "group_missions.id" }, { column: "student_id", references: "students.id" }]
  },
  {
    id: "teacher_interventions",
    area: "roster",
    ownerAgentId: "backend",
    description: "Teacher support decisions created from live class monitoring, confusion, and mastery signals.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: ["id", "teacher_id", "class_session_id", "student_id", "lesson_id", "intervention_type", "summary", "status", "created_at", "resolved_at"],
    foreignKeys: [
      { column: "teacher_id", references: "teachers.id" },
      { column: "class_session_id", references: "class_sessions.id" },
      { column: "student_id", references: "students.id" },
      { column: "lesson_id", references: "lessons.id" }
    ]
  },
  {
    id: "school_reports",
    area: "roster",
    ownerAgentId: "backend",
    description: "School-admin reporting snapshots for usage, mastery, intervention needs, and pilot readiness.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: ["id", "school_id", "class_id", "report_type", "summary", "metrics", "created_at"],
    foreignKeys: [{ column: "school_id", references: "schools.id" }, { column: "class_id", references: "classes.id" }]
  },
  {
    id: "grade_bands",
    area: "curriculum",
    ownerAgentId: "curriculum",
    description: "Foundation, Bridge, and Scholar academy bands.",
    primaryKey: "id",
    pii: false,
    rls: false,
    columns: ["id", "name", "range", "purpose", "style", "target_lessons"]
  },
  {
    id: "grade_levels",
    area: "curriculum",
    ownerAgentId: "curriculum",
    description: "K-12 grade levels linked to grade bands.",
    primaryKey: "id",
    pii: false,
    rls: false,
    columns: ["id", "grade_band_id", "grade", "label", "sort_order"],
    foreignKeys: [{ column: "grade_band_id", references: "grade_bands.id" }]
  },
  {
    id: "subjects",
    area: "curriculum",
    ownerAgentId: "curriculum",
    description: "Subject taxonomy used by courses and lessons.",
    primaryKey: "id",
    pii: false,
    rls: false,
    columns: ["id", "title", "standards_framework_ids", "created_at"],
    foreignKeys: []
  },
  {
    id: "courses",
    area: "curriculum",
    ownerAgentId: "curriculum",
    description: "Grade-level courses mapped to subjects and standards.",
    primaryKey: "id",
    pii: false,
    rls: false,
    columns: ["id", "grade_level_id", "subject_id", "title", "status", "created_at", "updated_at"],
    foreignKeys: [{ column: "grade_level_id", references: "grade_levels.id" }, { column: "subject_id", references: "subjects.id" }]
  },
  {
    id: "units",
    area: "curriculum",
    ownerAgentId: "curriculum",
    description: "Course units with planned lesson targets and required lesson sections.",
    primaryKey: "id",
    pii: false,
    rls: false,
    columns: ["id", "course_id", "title", "lesson_target", "sort_order", "created_at", "updated_at"],
    foreignKeys: [{ column: "course_id", references: "courses.id" }]
  },
  {
    id: "lessons",
    area: "curriculum",
    ownerAgentId: "curriculum",
    description: "Versioned lessons with objectives, teaching support, visuals, mastery thresholds, and paths.",
    primaryKey: "id",
    pii: false,
    rls: false,
    columns: [
      "id",
      "unit_id",
      "title",
      "grade_band_id",
      "grade_level_id",
      "subject_id",
      "estimated_minutes",
      "learning_objective",
      "essential_question",
      "mastery_threshold",
      "status",
      "created_at",
      "updated_at"
    ],
    foreignKeys: [{ column: "unit_id", references: "units.id" }, { column: "grade_level_id", references: "grade_levels.id" }, { column: "subject_id", references: "subjects.id" }]
  },
  {
    id: "activities",
    area: "learning",
    ownerAgentId: "backend",
    description: "Warm-ups, direct instruction, guided practice, interactive tasks, independent practice, group homework, reteach, and challenge steps.",
    primaryKey: "id",
    pii: false,
    rls: false,
    columns: ["id", "lesson_id", "activity_type", "title", "body", "sort_order", "requires_group", "created_at"],
    foreignKeys: [{ column: "lesson_id", references: "lessons.id" }]
  },
  {
    id: "quizzes",
    area: "assessment",
    ownerAgentId: "backend",
    description: "Lesson mastery checkpoints and assessments.",
    primaryKey: "id",
    pii: false,
    rls: false,
    columns: ["id", "lesson_id", "title", "mastery_threshold", "created_at", "updated_at"],
    foreignKeys: [{ column: "lesson_id", references: "lessons.id" }]
  },
  {
    id: "quiz_questions",
    area: "assessment",
    ownerAgentId: "backend",
    description: "Question bank with answer explanations, difficulty, skill tags, and standards tags.",
    primaryKey: "id",
    pii: false,
    rls: false,
    columns: ["id", "quiz_id", "question_text", "question_type", "choices", "correct_answer", "explanation", "difficulty_level", "skill_tag", "standard_tag", "sort_order"],
    foreignKeys: [{ column: "quiz_id", references: "quizzes.id" }]
  },
  {
    id: "quiz_attempts",
    area: "assessment",
    ownerAgentId: "backend",
    description: "Student quiz attempts, scores, mastery pass/fail, and answer snapshots.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: ["id", "quiz_id", "student_id", "score", "passed", "answers", "attempted_at"],
    foreignKeys: [{ column: "quiz_id", references: "quizzes.id" }, { column: "student_id", references: "students.id" }]
  },
  {
    id: "lesson_progress",
    area: "progress",
    ownerAgentId: "backend",
    description: "Per-lesson student progress state and timestamps.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: ["id", "student_id", "lesson_id", "status", "started_at", "completed_at", "last_activity_at"],
    foreignKeys: [{ column: "student_id", references: "students.id" }, { column: "lesson_id", references: "lessons.id" }]
  },
  {
    id: "mastery_records",
    area: "progress",
    ownerAgentId: "backend",
    description: "Current and historical mastery evidence by student, lesson, and skill.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: ["id", "student_id", "lesson_id", "skill_tag", "score", "status", "attempts", "evidence", "updated_at"],
    foreignKeys: [{ column: "student_id", references: "students.id" }, { column: "lesson_id", references: "lessons.id" }]
  },
  {
    id: "lesson_scratchpads",
    area: "progress",
    ownerAgentId: "backend",
    description: "Student-written first steps, explanations, confusion statements, retry evidence, and tutor-review counts.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: [
      "id",
      "student_id",
      "lesson_id",
      "first_step",
      "explanation",
      "confusion",
      "retry_after_hint",
      "tutor_review_count",
      "updated_at"
    ],
    foreignKeys: [{ column: "student_id", references: "students.id" }, { column: "lesson_id", references: "lessons.id" }]
  },
  {
    id: "interactive_skill_evidence",
    area: "progress",
    ownerAgentId: "backend",
    description: "Skill-level evidence generated by interactive widgets, including diagnosis, support move, and status.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: [
      "id",
      "student_id",
      "lesson_id",
      "widget_id",
      "skill_id",
      "skill_label",
      "status",
      "correct",
      "attempts",
      "value",
      "diagnosis",
      "recommended_support",
      "evidence_strength",
      "updated_at"
    ],
    foreignKeys: [{ column: "student_id", references: "students.id" }, { column: "lesson_id", references: "lessons.id" }]
  },
  {
    id: "standards",
    area: "standards",
    ownerAgentId: "curriculum",
    description: "Flexible standards framework registry.",
    primaryKey: "id",
    pii: false,
    rls: false,
    columns: ["id", "name", "subjects", "purpose", "source_url", "created_at"]
  },
  {
    id: "lesson_standards",
    area: "standards",
    ownerAgentId: "curriculum",
    description: "Many-to-many lesson standards tags.",
    primaryKey: "id",
    pii: false,
    rls: false,
    columns: ["id", "lesson_id", "standard_id", "tag", "alignment_note"],
    foreignKeys: [{ column: "lesson_id", references: "lessons.id" }, { column: "standard_id", references: "standards.id" }]
  },
  {
    id: "assignments",
    area: "learning",
    ownerAgentId: "backend",
    description: "Teacher/parent assigned lessons, reviews, projects, and worksheets.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: ["id", "student_id", "lesson_id", "assigned_by_user_id", "title", "due_at", "status", "created_at"],
    foreignKeys: [{ column: "student_id", references: "students.id" }, { column: "lesson_id", references: "lessons.id" }, { column: "assigned_by_user_id", references: "users.id" }]
  },
  {
    id: "portfolio_items",
    area: "portfolio",
    ownerAgentId: "backend",
    description: "Student artifacts, mastery evidence, capstones, labs, writing, and progress records.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: ["id", "student_id", "lesson_id", "title", "artifact_type", "source", "visibility", "created_at"],
    foreignKeys: [{ column: "student_id", references: "students.id" }, { column: "lesson_id", references: "lessons.id" }]
  },
  {
    id: "badges",
    area: "rewards",
    ownerAgentId: "backend",
    description: "Mastery and retention reward definitions.",
    primaryKey: "id",
    pii: false,
    rls: false,
    columns: ["id", "title", "category", "requirement", "created_at"]
  },
  {
    id: "student_badges",
    area: "rewards",
    ownerAgentId: "backend",
    description: "Earned student badges and benefit unlocks.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: ["id", "student_id", "badge_id", "lesson_id", "earned_at", "evidence"],
    foreignKeys: [{ column: "student_id", references: "students.id" }, { column: "badge_id", references: "badges.id" }, { column: "lesson_id", references: "lessons.id" }]
  },
  {
    id: "reward_approvals",
    area: "rewards",
    ownerAgentId: "backend",
    description: "Parent-reviewed reward requests, approval decisions, redemption status, and mastery evidence.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: [
      "id",
      "student_id",
      "guardian_id",
      "reward_level",
      "reward_title",
      "reward_benefit",
      "status",
      "requested_by",
      "requested_at",
      "reviewed_by",
      "reviewed_at",
      "evidence",
      "parent_note",
      "fulfillment_provider",
      "fulfillment_status",
      "fulfillment_reference",
      "fulfillment_requested_at",
      "fulfillment_completed_at",
      "source"
    ],
    foreignKeys: [{ column: "student_id", references: "students.id" }, { column: "guardian_id", references: "guardians.id" }]
  },
  {
    id: "content_drafts",
    area: "content_ops",
    ownerAgentId: "content-ops",
    description: "Draft/review/publish workflow records for authored or imported lessons.",
    primaryKey: "id",
    pii: false,
    rls: true,
    columns: [
      "id",
      "academy_id",
      "grade",
      "subject_id",
      "title",
      "objective",
      "unit_title",
      "standards_tags",
      "essential_question",
      "student_summary",
      "why_it_matters",
      "vocabulary_terms",
      "prerequisite_skills",
      "lesson_sections",
      "helper_notes",
      "common_misunderstandings",
      "visual_supports",
      "quiz_questions",
      "source_cards",
      "group_homework",
      "status",
      "blocked_reason",
      "review_notes",
      "accessibility_notes",
      "age_fit_notes",
      "lesson_body_ready",
      "teaching_completeness_status",
      "teaching_completeness_issues",
      "source_lesson_id",
      "source_tool_call_id",
      "redesign_task_ids",
      "research_source_ids",
      "truth_score",
      "truth_issues",
      "needs_external_research",
      "truth_review_status",
      "latest_review",
      "review_history",
      "review_version",
      "created_at",
      "updated_at"
    ],
    foreignKeys: [{ column: "subject_id", references: "subjects.id" }, { column: "source_lesson_id", references: "lessons.id" }]
  },
  {
    id: "content_batch_reviews",
    area: "content_ops",
    ownerAgentId: "manager",
    description: "Durable batch-level quality gate records that block weak or unsafe lessons and visuals from publication.",
    primaryKey: "id",
    pii: false,
    rls: true,
    columns: [
      "id",
      "source_batch_id",
      "academy_id",
      "grade_band",
      "grade_levels",
      "subjects",
      "status",
      "decision",
      "total_lessons",
      "passed_lessons",
      "total_artifacts",
      "passed_artifacts",
      "score",
      "grade",
      "threshold",
      "passed",
      "publish_eligible",
      "lesson_ids",
      "visual_asset_ids",
      "lesson_reports",
      "artifact_reports",
      "blocking_lessons",
      "blockers",
      "revision_instructions",
      "review_history",
      "reviewed_by_user_id",
      "reviewed_at",
      "created_at",
      "updated_at"
    ],
    foreignKeys: [{ column: "reviewed_by_user_id", references: "users.id" }]
  },
  {
    id: "visual_assets",
    area: "content_ops",
    ownerAgentId: "visual-learning",
    description: "Generated or reviewed lesson images, diagrams, alt text, license, and approval state.",
    primaryKey: "id",
    pii: false,
    rls: true,
    columns: [
      "id",
      "lesson_id",
      "draft_id",
      "asset_kind",
      "placement",
      "subject_id",
      "grade",
      "title",
      "asset_url",
      "storage_provider",
      "storage_bucket",
      "storage_path",
      "storage_public_url",
      "storage_status",
      "source_prompt",
      "source_model",
      "usage",
      "generation_metadata",
      "review_checklist",
      "alt_text",
      "caption",
      "license",
      "credit",
      "status",
      "approved_by_user_id",
      "approved_at",
      "latest_review",
      "review_history",
      "review_version",
      "created_at",
      "updated_at"
    ],
    foreignKeys: [
      { column: "lesson_id", references: "lessons.id" },
      { column: "draft_id", references: "content_drafts.id" },
      { column: "subject_id", references: "subjects.id" },
      { column: "approved_by_user_id", references: "users.id" }
    ]
  },
  {
    id: "ai_tutor_events",
    area: "ai_safety",
    ownerAgentId: "ai-safety",
    description: "Lesson-scoped tutor turns, classifications, blocked-answer events, and safety flags.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: [
      "id",
      "student_id",
      "lesson_id",
      "input",
      "response",
      "analysis",
      "type",
      "mode_id",
      "mode_title",
      "strategy",
      "visual_hint",
      "first_principles_prompt",
      "student_feedback",
      "feedback_note",
      "helped",
      "quality_score",
      "truth_score",
      "truth_issues",
      "needs_external_research",
      "truth_review_status",
      "flagged",
      "review_status",
      "created_at"
    ],
    foreignKeys: [{ column: "student_id", references: "students.id" }, { column: "lesson_id", references: "lessons.id" }]
  },
  {
    id: "agent_tool_calls",
    area: "agent_ops",
    ownerAgentId: "manager",
    description: "Tool Gateway call log with role, owner agent, risk, status, and review state.",
    primaryKey: "id",
    pii: false,
    rls: true,
    columns: ["id", "tool_id", "tool_name", "owner_agent_id", "role", "status", "external_risk", "requires_human_review", "review_status", "payload", "created_at"]
  },
  {
    id: "research_evidence_sources",
    area: "agent_ops",
    ownerAgentId: "syllabus-research",
    description: "Staff-reviewed source ledger for syllabus, misconception, standards, and teaching-redesign claims.",
    primaryKey: "id",
    pii: false,
    rls: true,
    columns: ["id", "source_id", "source_name", "source_url", "source_type", "checked_at", "subject_id", "grade_band_id", "claim", "trouble_signal", "redesign_move", "status"]
  },
  {
    id: "lesson_redesign_tasks",
    area: "agent_ops",
    ownerAgentId: "fun-retention",
    description: "Research-backed lesson redesign tasks created from tutor feedback, source findings, and misconception analysis.",
    primaryKey: "id",
    pii: false,
    rls: true,
    columns: [
      "id",
      "lesson_id",
      "owner_agent_id",
      "title",
      "why",
      "change",
      "source_ids",
      "status",
      "review_status",
      "implemented_draft_id",
      "implemented_lesson_id",
      "implemented_at",
      "review_history",
      "created_at"
    ],
    foreignKeys: [{ column: "lesson_id", references: "lessons.id" }]
  },
  {
    id: "agent_review_items",
    area: "agent_ops",
    ownerAgentId: "manager",
    description: "Human review queue for visuals, content, AI flags, and review-gated tool outputs.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: [
      "id",
      "source_type",
      "source_id",
      "owner_agent_id",
      "priority",
      "status",
      "decision",
      "reviewed_by_user_id",
      "reviewed_at",
      "artifact_type",
      "artifact_id",
      "score",
      "grade",
      "threshold",
      "passed",
      "critical_blockers",
      "blockers",
      "revision_instructions",
      "review_history"
    ],
    foreignKeys: [{ column: "reviewed_by_user_id", references: "users.id" }]
  },
  {
    id: "audit_events",
    area: "audit",
    ownerAgentId: "qa",
    description: "Immutable record of security, privacy, review, and data-change events.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: ["id", "actor_user_id", "event_type", "entity_type", "entity_id", "metadata", "created_at"],
    foreignKeys: [{ column: "actor_user_id", references: "users.id" }]
  },
  {
    id: "auth_audit_events",
    area: "audit",
    ownerAgentId: "qa",
    description: "Immutable auth lifecycle audit records for invitations, email verification, role changes, links, and revocations.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: ["id", "actor_user_id", "target_user_id", "event_type", "entity_type", "entity_id", "metadata", "created_at"],
    foreignKeys: [{ column: "actor_user_id", references: "users.id" }, { column: "target_user_id", references: "users.id" }]
  },
  {
    id: "consent_records",
    area: "privacy",
    ownerAgentId: "qa",
    description: "Parent-managed consent for data collection, AI, portfolio, and third-party sharing.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: ["id", "student_id", "guardian_id", "data_collection", "ai_helper", "portfolio", "third_party_sharing", "consented_by", "updated_at"],
    foreignKeys: [{ column: "student_id", references: "students.id" }, { column: "guardian_id", references: "guardians.id" }]
  },
  {
    id: "accommodations",
    area: "accessibility",
    ownerAgentId: "qa",
    description: "Learner supports such as read-aloud, planner prompts, short practice sets, and portfolio reminders.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: ["id", "student_id", "support", "source", "created_at"],
    foreignKeys: [{ column: "student_id", references: "students.id" }]
  },
  {
    id: "retention_schedules",
    area: "learning_lab",
    ownerAgentId: "backend",
    description: "Spaced-recall schedule for delayed mastery checks.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: ["id", "student_id", "lesson_id", "skill_tag", "current_mastery", "next_recall", "interval_days", "recall_count", "last_result"],
    foreignKeys: [{ column: "student_id", references: "students.id" }, { column: "lesson_id", references: "lessons.id" }]
  },
  {
    id: "learning_events",
    area: "learning_lab",
    ownerAgentId: "backend",
    description: "Event stream for starts, quiz completions, reteach events, rewards, and experiment metrics.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: ["id", "student_id", "lesson_id", "event_type", "value", "occurred_at"],
    foreignKeys: [{ column: "student_id", references: "students.id" }, { column: "lesson_id", references: "lessons.id" }]
  },
  {
    id: "experiment_runs",
    area: "learning_lab",
    ownerAgentId: "backend",
    description: "Trial-and-error learning experiments with immediate and delayed retention metrics.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: ["id", "template_id", "student_id", "lesson_id", "variant", "immediate_score", "recall_24h", "recall_7d", "joy", "frustration", "decision"],
    foreignKeys: [{ column: "student_id", references: "students.id" }, { column: "lesson_id", references: "lessons.id" }]
  },
  {
    id: "reward_settings",
    area: "rewards",
    ownerAgentId: "backend",
    description: "Household reward settings and mastery-benefit rules.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: ["id", "guardian_id", "enabled", "selected_catalog_ids", "family_benefits", "require_delayed_recall", "updated_at"],
    foreignKeys: [{ column: "guardian_id", references: "guardians.id" }]
  },
  {
    id: "app_state_snapshots",
    area: "system",
    ownerAgentId: "backend",
    description: "Transitional database-backed state snapshots used while repository calls move from prototype state to normalized tables.",
    primaryKey: "id",
    pii: true,
    rls: true,
    columns: ["id", "payload", "created_at", "updated_at"]
  }
];

export const roleAccessMatrix = [
  {
    role: "student",
    canRead: ["own lessons", "own assignments", "own progress", "own portfolio", "approved visuals", "own AI history"],
    canWrite: ["quiz attempts", "lesson progress", "portfolio submissions", "AI tutor questions"],
    blocked: ["publishing content", "running external tools", "seeing other learners", "changing consent"]
  },
  {
    role: "parent",
    canRead: ["own children", "household reports", "AI logs", "portfolio", "assignments", "review recommendations"],
    canWrite: ["consent", "reward settings", "assignment notes", "review acknowledgements"],
    blocked: ["platform content publishing", "other households", "unreviewed generated media"]
  },
  {
    role: "teacher",
    canRead: ["assigned classes", "enrolled students", "lesson progress", "quiz attempts", "content review notes"],
    canWrite: ["assignments", "intervention notes", "content drafts", "review requests"],
    blocked: ["unassigned students", "platform admin settings", "student consent"]
  },
  {
    role: "school-admin",
    canRead: ["school roster", "classes", "teachers", "school reports", "curriculum"],
    canWrite: ["classes", "enrollments", "teacher assignments", "school settings"],
    blocked: ["other schools", "platform schema", "raw child data outside assigned scope"]
  },
  {
    role: "platform-admin",
    canRead: ["platform audit", "content ops", "agent reviews", "tool logs", "schema readiness"],
    canWrite: ["curriculum publishing", "tool registry", "review decisions", "launch gates"],
    blocked: ["using child data outside support, safety, or operations purpose"]
  }
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function nowStamp() {
  return new Date().toLocaleString();
}

function normalizeTitle(value) {
  return String(value || "")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function escapeXml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function subjectTitle(subject) {
  return normalizeTitle(String(subject || "").replaceAll("-", " "));
}

function learnerIdForLesson(lesson) {
  if (lesson.academyId === "foundation") return "avery";
  if (lesson.academyId === "bridge") return "maya";
  return "jordan";
}

function compactVisualAssetSvg(asset = {}) {
  const title = String(asset.caption || asset.altText || asset.id || "Learning visual").slice(0, 44);
  const key = String([asset.id, asset.lessonId, asset.draftId, asset.caption, asset.altText].filter(Boolean).join(" ")).toLowerCase();
  const palette = {
    math: ["#45f3ff", "#ff4fd8"],
    ela: ["#ffea64", "#ff4fd8"],
    science: ["#66ff9a", "#45f3ff"],
    social: ["#ff9d4d", "#ffea64"],
    default: ["#45f3ff", "#b967ff"]
  };
  const subjectKey = String(asset.lessonId || asset.draftId || asset.id || "").includes("science")
    ? "science"
    : String(asset.lessonId || asset.draftId || asset.id || "").includes("ela")
      ? "ela"
      : String(asset.lessonId || asset.draftId || asset.id || "").includes("social")
        ? "social"
        : String(asset.lessonId || asset.draftId || asset.id || "").includes("math")
          ? "math"
          : "default";
  const [primary, secondary] = palette[subjectKey] || palette.default;
  const label = (x, y, value, color = "white") =>
    `<text x='${x}' y='${y}' fill='${color}' font-size='24'>${escapeXml(value)}</text>`;
  const chip = (x, y, value) =>
    `<rect x='${x}' y='${y}' width='132' height='42' rx='18' fill='${primary}' opacity='.18' stroke='${primary}' stroke-width='5'/>${label(x + 18, y + 29, value, primary)}`;
  let scene = "";
  if (key.includes("fraction") || key.includes("number-line")) {
    scene = `<line x1='120' y1='300' x2='840' y2='300' stroke='${primary}' stroke-width='14' stroke-linecap='round'/><circle cx='300' cy='300' r='32' fill='${secondary}'/><circle cx='660' cy='300' r='32' fill='${secondary}'/><path d='M300 250 C410 190 545 190 660 250' fill='none' stroke='${secondary}' stroke-width='10'/>${label(132,250,"Equal spaces",primary)}${label(290,368,"1/4",secondary)}${label(650,368,"3/4",secondary)}`;
  } else if (key.includes("main") || key.includes("idea") || key.includes("story")) {
    scene = `<rect x='126' y='182' width='330' height='156' rx='24' fill='${primary}' opacity='.2' stroke='${primary}' stroke-width='7'/>${label(172,238,"Main idea",primary)}${chip(536,190,"Proof")}${chip(646,306,"Detail")}`;
  } else if (key.includes("ecosystem")) {
    scene = `<circle cx='184' cy='172' r='58' fill='#ffea64'/><path d='M210 260 C330 190 430 196 538 270 S704 340 810 246' fill='none' stroke='${primary}' stroke-width='12' marker-end='url(#a)'/><rect x='210' y='330' width='140' height='92' rx='22' fill='${primary}' opacity='.24'/>${label(230,385,"Plant",primary)}<circle cx='650' cy='344' r='58' fill='${secondary}'/>${label(600,432,"Animal",secondary)}`;
  } else if (key.includes("community") || key.includes("map")) {
    scene = `<path d='M110 330 C250 260 326 430 470 330 S682 206 842 286' fill='none' stroke='${primary}' stroke-width='20'/><rect x='210' y='170' width='122' height='90' rx='14' fill='${secondary}'/><rect x='600' y='340' width='142' height='90' rx='14' fill='${primary}' opacity='.75'/>${label(220,154,"School",secondary)}${label(606,462,"Park",primary)}`;
  } else if (key.includes("weather")) {
    scene = `<circle cx='256' cy='278' r='76' fill='${secondary}'/><circle cx='670' cy='250' r='88' fill='${primary}' opacity='.3' stroke='${primary}' stroke-width='10'/>${label(236,290,"H","#080b1e")}${label(650,262,"L",primary)}<path d='M350 344 C450 300 548 402 660 338' fill='none' stroke='white' stroke-width='10'/><path d='M382 184 l54 34 l-62 22 z' fill='${primary}'/>`;
  } else if (key.includes("cell")) {
    scene = `<ellipse cx='480' cy='300' rx='270' ry='138' fill='${primary}' opacity='.18' stroke='${primary}' stroke-width='10'/><circle cx='420' cy='292' r='64' fill='${secondary}'/>${label(382,300,"DNA","#080b1e")}${chip(592,246,"Energy")}`;
  } else {
    scene = `<path d='M86 402 C220 248 310 488 466 304 S742 168 874 262' fill='none' stroke='${primary}' stroke-width='18' stroke-linecap='round'/><circle cx='226' cy='210' r='74' fill='${secondary}' opacity='.86'/><rect x='534' y='140' width='220' height='160' rx='26' fill='${primary}' opacity='.2' stroke='${primary}' stroke-width='8'/>`;
  }
  return [
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 960 540' role='img' font-family='Arial,sans-serif' font-weight='800'>",
    "<rect width='960' height='540' rx='42' fill='#080b1e'/>",
    `<text x='84' y='92' fill='white' font-size='44'>${escapeXml(title)}</text>`,
    scene,
    `<text x='84' y='472' fill='${primary}' font-size='28'>Review-ready production asset</text>`,
    "</svg>"
  ].join("");
}

function visualAssetUrl(asset = {}) {
  if (asset.assetUrl) return asset.assetUrl;
  if (asset.assetKind === "generated-svg") {
    return `data:image/svg+xml,${encodeURIComponent(compactVisualAssetSvg(asset))}`;
  }
  if (asset.svg) return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(asset.svg)}`;
  return "";
}

function projectedLessonCatalog(state = {}) {
  const published = state.publishedLessons || [];
  const publishedIds = new Set(published.map((lesson) => lesson.id));
  return [
    ...pilotLessons.filter((lesson) => !publishedIds.has(lesson.id)).map((lesson) => ({ ...lesson, catalogSource: "pilot" })),
    ...published.map((lesson) => ({ ...lesson, catalogSource: "published" }))
  ];
}

function findProjectedLesson(state, lessonId) {
  return projectedLessonCatalog(state).find((lesson) => lesson.id === lessonId) || null;
}

function findProjectedLessonByTitle(state, title) {
  const normalizedTitle = String(title || "").toLowerCase();
  if (!normalizedTitle) return null;
  return (
    projectedLessonCatalog(state).find((lesson) => lesson.title === title) ||
    projectedLessonCatalog(state).find((lesson) => normalizedTitle.includes(String(lesson.title || "").toLowerCase().slice(0, 8))) ||
    null
  );
}

function findCurriculumUnit(lesson) {
  for (const academy of curriculum.academies) {
    if (academy.id !== lesson.academyId) continue;
    for (const grade of academy.grades) {
      if (grade.grade !== String(lesson.grade)) continue;
      for (const course of grade.courses) {
        if (course.subject !== lesson.subject && course.title !== lesson.courseTitle) continue;
        const exact = course.units.find((unit) => unit.title === lesson.unitTitle);
        return exact || course.units[0];
      }
    }
  }
  return null;
}

function rowCount(projection) {
  return Object.values(projection.tables).reduce((sum, rows) => sum + rows.length, 0);
}

function groupBy(rows = [], key) {
  return rows.reduce((groups, row) => {
    const value = row?.[key] || "";
    if (!value) return groups;
    groups[value] = groups[value] || [];
    groups[value].push(row);
    return groups;
  }, {});
}

export function getProductionSchema() {
  return {
    roles: clone(productionRoles),
    requiredTables: [...requiredProductionTables],
    tables: clone(productionDataModel),
    roleAccessMatrix: clone(roleAccessMatrix)
  };
}

export function getProductionSchemaSummary() {
  const relationships = productionDataModel.reduce((sum, table) => sum + (table.foreignKeys?.length || 0), 0);
  const areas = [...new Set(productionDataModel.map((table) => table.area))];
  const requiredPresent = requiredProductionTables.filter((tableId) => productionDataModel.some((table) => table.id === tableId));
  return {
    tableCount: productionDataModel.length,
    requiredTableCount: requiredProductionTables.length,
    requiredPresent: requiredPresent.length,
    requiredMissing: requiredProductionTables.length - requiredPresent.length,
    relationshipCount: relationships,
    rlsTableCount: productionDataModel.filter((table) => table.rls).length,
    piiTableCount: productionDataModel.filter((table) => table.pii).length,
    areaCount: areas.length,
    areas: areas.map((area) => ({
      area,
      tableCount: productionDataModel.filter((table) => table.area === area).length
    }))
  };
}

export function validateProductionSchema() {
  const tableIds = new Set(productionDataModel.map((table) => table.id));
  const errors = [];
  const warnings = [];

  for (const required of requiredProductionTables) {
    if (!tableIds.has(required)) {
      errors.push({ path: required, message: "Required production table is missing." });
    }
  }

  for (const table of productionDataModel) {
    if (!table.primaryKey) errors.push({ path: `${table.id}.primaryKey`, message: "Table needs a primary key." });
    if (!Array.isArray(table.columns) || !table.columns.includes(table.primaryKey)) {
      errors.push({ path: `${table.id}.columns`, message: "Primary key must be included in columns." });
    }
    if (table.pii && !table.rls) {
      errors.push({ path: `${table.id}.rls`, message: "PII tables must have row-level security." });
    }
    for (const relation of table.foreignKeys || []) {
      const targetTable = String(relation.references || "").split(".")[0];
      if (!tableIds.has(targetTable)) {
        errors.push({ path: `${table.id}.${relation.column}`, message: `Foreign key target ${targetTable} is not defined.` });
      }
    }
    if (!table.foreignKeys?.length && ["students", "courses", "lessons", "quiz_attempts", "mastery_records"].includes(table.id)) {
      warnings.push({ path: `${table.id}.foreignKeys`, message: "Core relational table should declare at least one relationship." });
    }
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings
  };
}

export function getRoleAccessMatrix() {
  return clone(roleAccessMatrix);
}

export function createProductionSeedProjection(state = {}) {
  const timestamp = nowStamp();
  const learners = state.learners || [];
  const parentProfile = state.parentProfile || {};
  const guardianUserId = parentProfile.id ? `user-${parentProfile.id}` : "user-parent-1";
  const teacherUserId = "user-teacher-demo";
  const adminUserId = "user-platform-admin";
  const guardianId = parentProfile.id || "parent-1";
  const teacherId = "teacher-demo-1";
  const schoolProfile = state.schoolProfile || {};
  const schoolId = schoolProfile.id || "school-demo-1";

  const tables = Object.fromEntries(productionDataModel.map((table) => [table.id, []]));

  tables.users.push(
    {
      id: guardianUserId,
      role: "parent",
      display_name: parentProfile.name || "Demo Parent",
      email: parentProfile.email || "demo-parent@example.invalid",
      email_verified: Boolean(parentProfile.emailVerified),
      auth_provider: "local-preview",
      provider_subject: guardianUserId,
      status: parentProfile.emailVerified ? "verified" : "pending",
      created_at: timestamp,
      updated_at: timestamp
    },
    {
      id: teacherUserId,
      role: "teacher",
      display_name: "Demo Teacher",
      email: "demo-teacher@example.invalid",
      email_verified: true,
      auth_provider: "local-preview",
      provider_subject: teacherUserId,
      status: "demo",
      created_at: timestamp,
      updated_at: timestamp
    },
    {
      id: adminUserId,
      role: "platform-admin",
      display_name: "Platform Admin",
      email: "platform-admin@example.invalid",
      email_verified: true,
      auth_provider: "local-preview",
      provider_subject: adminUserId,
      status: "demo",
      created_at: timestamp,
      updated_at: timestamp
    }
  );

  tables.schools.push({
    id: schoolId,
    name: schoolProfile.name || "Bridge Pilot Middle School",
    district: schoolProfile.district || "Demo District",
    implementation_stage: schoolProfile.implementationStage || "Pilot planning",
    pilot_focus: schoolProfile.pilotFocus || "Bridge Academy classroom pilot",
    status: schoolProfile.status || "pilot",
    created_at: timestamp,
    updated_at: timestamp
  });

  for (const account of state.localAccounts || []) {
    tables.users.push({
      id: account.userId || `user-${account.id}`,
      role: account.role,
      display_name: account.displayName,
      email: account.email,
      email_verified: Boolean(account.emailVerified || account.status === "active"),
      auth_provider: account.authProvider || "local-preview",
      provider_subject: account.providerSubject || account.userId || account.id,
      status: account.status || "active",
      created_at: account.createdAt || timestamp,
      updated_at: account.updatedAt || account.createdAt || timestamp
    });
  }

  for (const learner of learners) {
    tables.users.push({
      id: `user-${learner.id}`,
      role: "student",
      display_name: learner.name,
      email: "",
      email_verified: false,
      auth_provider: "managed-child",
      provider_subject: `user-${learner.id}`,
      status: learner.status || "managed-child",
      created_at: timestamp,
      updated_at: timestamp
    });
  }

  tables.guardians.push({
    id: guardianId,
    user_id: guardianUserId,
    preferred_report_day: parentProfile.preferredReportDay || "Friday",
    household_setup_complete: Boolean(parentProfile.householdSetupComplete),
    created_at: timestamp,
    updated_at: timestamp
  });

  for (const account of (state.localAccounts || []).filter((item) => item.role === "parent" && item.guardianId)) {
    tables.guardians.push({
      id: account.guardianId,
      user_id: account.userId || `user-${account.id}`,
      preferred_report_day: parentProfile.preferredReportDay || "Friday",
      household_setup_complete: Boolean(parentProfile.householdSetupComplete),
      created_at: account.createdAt || timestamp,
      updated_at: account.updatedAt || account.createdAt || timestamp
    });
  }

  tables.teachers.push({
    id: teacherId,
    user_id: teacherUserId,
    display_name: "Demo Teacher",
    organization_name: "Demo Homeschool Studio",
    created_at: timestamp,
    updated_at: timestamp
  });

  for (const account of (state.localAccounts || []).filter((item) => item.role === "teacher" && item.teacherId)) {
    tables.teachers.push({
      id: account.teacherId,
      user_id: account.userId || `user-${account.id}`,
      display_name: account.displayName,
      organization_name: "Local learning account",
      created_at: account.createdAt || timestamp,
      updated_at: account.updatedAt || account.createdAt || timestamp
    });
  }

  for (const academy of curriculum.academies) {
    tables.grade_bands.push({
      id: academy.id,
      name: academy.name,
      range: academy.range,
      purpose: academy.purpose,
      style: academy.style,
      target_lessons: academy.targetLessons
    });

    for (const grade of academy.grades) {
      tables.grade_levels.push({
        id: grade.id,
        grade_band_id: academy.id,
        grade: grade.grade,
        label: grade.label,
        sort_order: tables.grade_levels.length + 1
      });

      tables.classes.push({
        id: `class-${grade.id}`,
        school_id: schoolId,
        teacher_id: teacherId,
        name: `${grade.label} Demo Class`,
        academy_id: academy.id,
        grade_level_id: grade.id,
        subject_id: "",
        schedule: "Flexible preview schedule",
        status: "demo",
        created_at: timestamp,
        updated_at: timestamp
      });

      for (const course of grade.courses) {
        if (!tables.subjects.some((subject) => subject.id === course.subject)) {
          tables.subjects.push({
            id: course.subject,
            title: subjectTitle(course.subject),
            standards_framework_ids: course.standards,
            created_at: timestamp
          });
        }
        tables.courses.push({
          id: course.id,
          grade_level_id: grade.id,
          subject_id: course.subject,
          title: course.title,
          status: "planned",
          created_at: timestamp,
          updated_at: timestamp
        });
        for (const [unitIndex, unit] of course.units.entries()) {
          tables.units.push({
            id: unit.id,
            course_id: course.id,
            title: unit.title,
            lesson_target: unit.lessonTarget,
            sort_order: unitIndex + 1,
            created_at: timestamp,
            updated_at: timestamp
          });
        }
      }
    }
  }

  for (const section of state.classSections || []) {
    const gradeLevelId = `${section.academyId || "bridge"}-${String(section.grade || "6").toLowerCase()}`;
    tables.classes.push({
      id: section.id,
      school_id: section.schoolId || schoolId,
      teacher_id: section.teacherId || teacherId,
      name: section.name || "Bridge Academy Class",
      academy_id: section.academyId || "bridge",
      grade_level_id: gradeLevelId,
      subject_id: section.subject || "",
      schedule: section.schedule || "",
      status: section.status || "active",
      created_at: timestamp,
      updated_at: timestamp
    });

    tables.teacher_class_assignments.push({
      id: `teacher-class-assignment-${section.teacherId || teacherId}-${section.id}`.replace(/[^a-z0-9_-]/gi, "-"),
      teacher_id: section.teacherId || teacherId,
      class_id: section.id,
      assigned_by_user_id: adminUserId,
      status: "active",
      created_at: timestamp,
      revoked_at: ""
    });
  }

  for (const framework of standardsFrameworks) {
    tables.standards.push({
      id: framework.id,
      name: framework.name,
      subjects: framework.subjects,
      purpose: framework.purpose,
      source_url: framework.url || "",
      created_at: timestamp
    });
  }

  for (const learner of learners) {
    const gradeLevelId = `${learner.academyId}-${String(learner.grade).toLowerCase()}`;
    tables.students.push({
      id: learner.id,
      user_id: `user-${learner.id}`,
      academy_id: learner.academyId,
      grade_level_id: gradeLevelId,
      display_name: learner.name,
      schedule: learner.schedule,
      status: learner.status || "active",
      created_at: timestamp,
      updated_at: timestamp
    });
    tables.student_guardians.push({
      id: `guardian-link-${learner.id}`,
      student_id: learner.id,
      guardian_id: guardianId,
      relationship: "parent",
      can_manage_consent: true,
      created_at: timestamp
    });
    tables.enrollments.push({
      id: `enroll-${learner.id}`,
      student_id: learner.id,
      class_id: `class-${gradeLevelId}`,
      course_id: "",
      status: "active",
      started_at: timestamp,
      ended_at: ""
    });
    for (const support of learner.accommodations || []) {
      tables.accommodations.push({
        id: `accommodation-${learner.id}-${tables.accommodations.length + 1}`,
        student_id: learner.id,
        support,
        source: "parent-setup",
        created_at: timestamp
      });
    }
  }

  for (const section of state.classSections || []) {
    for (const studentId of section.studentIds || []) {
      tables.enrollments.push({
        id: `enroll-${section.id}-${studentId}`.replace(/[^a-z0-9_-]/gi, "-"),
        student_id: studentId,
        class_id: section.id,
        course_id: "",
        status: "active",
        started_at: timestamp,
        ended_at: ""
      });
    }
  }

  for (const invitation of state.accountInvitations || []) {
    tables.account_invitations.push({
      id: invitation.id,
      email: invitation.email || "",
      role: invitation.role || "student",
      invited_by_user_id: invitation.invitedByUserId || guardianUserId,
      target_student_id: invitation.targetStudentId || null,
      target_class_id: invitation.targetClassId || null,
      token_hash: invitation.tokenHash || "",
      status: invitation.status || "pending",
      expires_at: invitation.expiresAt || "",
      accepted_at: invitation.acceptedAt || "",
      created_at: invitation.createdAt || timestamp
    });
  }

  for (const account of state.localAccounts || []) {
    if (account.role === "parent" && account.guardianId && account.studentId) {
      tables.guardian_student_links.push({
        id: `guardian-student-link-${account.guardianId}-${account.studentId}`.replace(/[^a-z0-9_-]/gi, "-"),
        guardian_id: account.guardianId,
        student_id: account.studentId,
        relationship: "parent",
        status: "approved",
        requested_by_user_id: account.userId,
        approved_by_user_id: adminUserId,
        created_at: account.createdAt || timestamp,
        approved_at: account.createdAt || timestamp,
        revoked_at: ""
      });
    }
    if (account.role === "teacher" && account.teacherId) {
      const learner = learners.find((item) => item.id === account.studentId) || learners[0];
      const gradeLevelId = learner ? `${learner.academyId}-${String(learner.grade).toLowerCase()}` : "foundation-3";
      tables.teacher_class_assignments.push({
        id: `teacher-class-assignment-${account.teacherId}-${gradeLevelId}`.replace(/[^a-z0-9_-]/gi, "-"),
        teacher_id: account.teacherId,
        class_id: `class-${gradeLevelId}`,
        assigned_by_user_id: adminUserId,
        status: "active",
        created_at: account.createdAt || timestamp,
        revoked_at: ""
      });
    }
    tables.auth_audit_events.push({
      id: `auth-audit-${account.id}`,
      actor_user_id: adminUserId,
      target_user_id: account.userId || `user-${account.id}`,
      event_type: "local-account-created",
      entity_type: "user",
      entity_id: account.userId || `user-${account.id}`,
      metadata: {
        role: account.role,
        productionReplacement: "provider-backed identity required before launch"
      },
      created_at: account.createdAt || timestamp
    });
  }

  for (const revocation of state.sessionRevocations || []) {
    tables.session_revocations.push({
      id: revocation.id,
      user_id: revocation.userId,
      session_id: revocation.sessionId || "",
      revoked_before: revocation.revokedBefore || revocation.createdAt || timestamp,
      reason: revocation.reason || "manual revocation",
      created_at: revocation.createdAt || timestamp
    });
    tables.auth_audit_events.push({
      id: `auth-audit-${revocation.id}`,
      actor_user_id: revocation.actorUserId || adminUserId,
      target_user_id: revocation.userId || "",
      event_type: "session-revoked",
      entity_type: "session_revocation",
      entity_id: revocation.id,
      metadata: {
        sessionId: revocation.sessionId || "",
        revokeAll: !revocation.sessionId,
        reason: revocation.reason || "manual revocation"
      },
      created_at: revocation.createdAt || timestamp
    });
  }

  for (const request of state.emailVerificationRequests || []) {
    tables.auth_audit_events.push({
      id: `auth-audit-${request.id}`,
      actor_user_id: request.requestedByUserId || request.userId || adminUserId,
      target_user_id: request.userId || "",
      event_type: "email-verification-request",
      entity_type: "auth_action_request",
      entity_id: request.id,
      metadata: {
        status: request.status || "pending",
        email: request.email || "",
        expiresAt: request.expiresAt || ""
      },
      created_at: request.createdAt || timestamp
    });
  }

  for (const request of state.passwordResetRequests || []) {
    tables.auth_audit_events.push({
      id: `auth-audit-${request.id}`,
      actor_user_id: request.requestedByUserId || request.userId || adminUserId,
      target_user_id: request.userId || "",
      event_type: "password-reset-request",
      entity_type: "auth_action_request",
      entity_id: request.id,
      metadata: {
        status: request.status || "pending",
        expiresAt: request.expiresAt || ""
      },
      created_at: request.createdAt || timestamp
    });
  }

  for (const [studentId, consent] of Object.entries(state.consentRecords || {})) {
    tables.consent_records.push({
      id: `consent-${studentId}`,
      student_id: studentId,
      guardian_id: guardianId,
      data_collection: Boolean(consent.dataCollection),
      ai_helper: Boolean(consent.aiHelper),
      portfolio: Boolean(consent.portfolio),
      third_party_sharing: Boolean(consent.thirdPartySharing),
      consented_by: consent.consentedBy || parentProfile.name || "Parent",
      updated_at: consent.lastUpdated || timestamp
    });
  }

  const publishedSourceLessonIds = new Set((state.publishedLessons || []).map((lesson) => lesson.sourceLessonId).filter(Boolean));
  const publishedSourceDraftIds = new Set((state.publishedLessons || []).map((lesson) => lesson.sourceDraftId).filter(Boolean));
  const projectedPilotLessons = pilotLessons.filter(
    (lesson) => !publishedSourceLessonIds.has(lesson.id) && !publishedSourceDraftIds.has(`draft-pilot-${lesson.id}`)
  );

  for (const lesson of projectedPilotLessons) {
    const unit = findCurriculumUnit(lesson);
    const gradeLevelId = `${lesson.academyId}-${String(lesson.grade).toLowerCase()}`;
    tables.lessons.push({
      id: lesson.id,
      unit_id: unit?.id || "",
      title: lesson.title,
      grade_band_id: lesson.academyId,
      grade_level_id: gradeLevelId,
      subject_id: lesson.subject,
      estimated_minutes: lesson.estimatedMinutes,
      learning_objective: lesson.objective,
      essential_question: lesson.essentialQuestion || `Why does ${lesson.title} matter?`,
      mastery_threshold: lesson.masteryThreshold,
      status: "pilot",
      created_at: timestamp,
      updated_at: timestamp
    });

    const activityRows = [
      ["warm_up", "Warm-up", lesson.sections?.warmup],
      ["direct_instruction", "Teach", lesson.sections?.teach],
      ["guided_practice", "Guided practice", lesson.sections?.guidedPractice],
      ["interactive_activity", "Interactive activity", lesson.sections?.activity],
      ["independent_practice", "Independent practice", lesson.sections?.independentPractice],
      ["reteach", "Reteach path", lesson.sections?.reteach],
      ["challenge", "Challenge path", lesson.sections?.challenge]
    ].filter(([, , body]) => body);
    lesson.funTasks?.forEach((task, index) => activityRows.push(["fun_task", `Interesting task ${index + 1}`, task]));
    if (lesson.groupHomework) {
      activityRows.push(["group_homework", lesson.groupHomework.title, lesson.groupHomework.sharedOutcome]);
    }
    activityRows.forEach(([activityType, title, body], index) => {
      tables.activities.push({
        id: `${lesson.id}-activity-${index + 1}`,
        lesson_id: lesson.id,
        activity_type: activityType,
        title,
        body,
        sort_order: index + 1,
        requires_group: activityType === "group_homework",
        created_at: timestamp
      });
    });

    tables.quizzes.push({
      id: `${lesson.id}-quiz`,
      lesson_id: lesson.id,
      title: `${lesson.title} mastery check`,
      mastery_threshold: lesson.masteryThreshold,
      created_at: timestamp,
      updated_at: timestamp
    });
    lesson.quiz.forEach((question, index) => {
      tables.quiz_questions.push({
        id: question.id,
        quiz_id: `${lesson.id}-quiz`,
        question_text: question.prompt,
        question_type: "multiple_choice",
        choices: question.choices,
        correct_answer: question.choices[question.answerIndex],
        explanation: question.explanation,
        difficulty_level: index === 0 ? "core" : "transfer",
        skill_tag: lesson.id,
        standard_tag: lesson.standards[0] || "",
        sort_order: index + 1
      });
    });
    for (const standardId of lesson.standards || []) {
      tables.lesson_standards.push({
        id: `${lesson.id}-${standardId}`,
        lesson_id: lesson.id,
        standard_id: standardId,
        tag: standardId,
        alignment_note: "Pilot lesson standard tag."
      });
    }
  }

  for (const lesson of state.publishedLessons || []) {
    const unit = findCurriculumUnit(lesson);
    const gradeLevelId = `${lesson.academyId}-${String(lesson.grade).toLowerCase()}`;
    const projectedLessonId = lesson.sourceLessonId || lesson.id;
    tables.lessons.push({
      id: projectedLessonId,
      unit_id: unit?.id || "",
      title: lesson.title,
      grade_band_id: lesson.academyId,
      grade_level_id: gradeLevelId,
      subject_id: lesson.subject,
      estimated_minutes: lesson.estimatedMinutes || 25,
      learning_objective: lesson.objective,
      essential_question: lesson.essentialQuestion || `Why does ${lesson.title} matter?`,
      mastery_threshold: lesson.masteryThreshold || 80,
      status: lesson.status || "published",
      created_at: lesson.publishedAt || timestamp,
      updated_at: lesson.updatedAt || lesson.publishedAt || timestamp
    });

    const activityRows = [
      ["warm_up", "Warm-up", lesson.sections?.warmup],
      ["direct_instruction", "Teach", lesson.sections?.teach],
      ["guided_practice", "Guided practice", lesson.sections?.guidedPractice],
      ["interactive_activity", "Interactive activity", lesson.sections?.activity],
      ["independent_practice", "Independent practice", lesson.sections?.independentPractice],
      ["reteach", "Reteach path", lesson.sections?.reteach],
      ["challenge", "Challenge path", lesson.sections?.challenge]
    ].filter(([, , body]) => body);
    lesson.funTasks?.forEach((task, index) => activityRows.push(["fun_task", `Interesting task ${index + 1}`, task]));
    if (lesson.groupHomework) {
      activityRows.push(["group_homework", lesson.groupHomework.title, lesson.groupHomework.sharedOutcome]);
    }
    lesson.visualSupports?.forEach((support, index) =>
      activityRows.push(["visual_support", support.title || `Visual support ${index + 1}`, support.description || support.prompt || "Published visual support."])
    );
    lesson.sourceCards?.forEach((source, index) =>
      activityRows.push(["source_card", source.title || `Source card ${index + 1}`, `${source.claim || "Reviewed source claim."} ${source.url || ""}`.trim()])
    );
    activityRows.forEach(([activityType, title, body], index) => {
      tables.activities.push({
        id: `${projectedLessonId}-activity-${index + 1}`,
        lesson_id: projectedLessonId,
        activity_type: activityType,
        title,
        body,
        sort_order: index + 1,
        requires_group: activityType === "group_homework",
        created_at: lesson.publishedAt || timestamp
      });
    });

    tables.quizzes.push({
      id: `${projectedLessonId}-quiz`,
      lesson_id: projectedLessonId,
      title: `${lesson.title} mastery check`,
      mastery_threshold: lesson.masteryThreshold || 80,
      created_at: lesson.publishedAt || timestamp,
      updated_at: lesson.updatedAt || lesson.publishedAt || timestamp
    });
    (lesson.quiz || []).forEach((question, index) => {
      const choices = Array.isArray(question.choices) ? question.choices : [];
      tables.quiz_questions.push({
        id: question.id || `${lesson.id}-q${index + 1}`,
        quiz_id: `${projectedLessonId}-quiz`,
        question_text: question.prompt || question.questionText,
        question_type: question.questionType || "multiple_choice",
        choices,
        correct_answer: question.correctAnswer || choices[question.answerIndex || 0] || "",
        explanation: question.explanation || "",
        difficulty_level: question.difficultyLevel || (index === 0 ? "core" : "transfer"),
        skill_tag: question.skillTag || lesson.id,
        standard_tag: question.standardTag || lesson.standards?.[0] || "",
        sort_order: index + 1
      });
    });
    for (const standardId of lesson.standards || []) {
      tables.lesson_standards.push({
        id: `${projectedLessonId}-${standardId}`,
        lesson_id: projectedLessonId,
        standard_id: standardId,
        tag: standardId,
        alignment_note: `Published lesson standard tag from content draft ${lesson.sourceDraftId || ""}.`.trim()
      });
    }
  }

  for (const session of state.classSessions || []) {
    tables.class_sessions.push({
      id: session.id,
      class_id: session.classSectionId || "",
      lesson_id: session.lessonId || "",
      title: session.title || "Class session",
      status: session.status || "planned",
      period_label: session.periodLabel || "",
      duration_minutes: Number(session.durationMinutes || 0),
      launch_goal: session.launchGoal || "",
      steps: session.steps || [],
      started_at: session.startedAt || "",
      ended_at: session.endedAt || "",
      created_at: session.createdAt || timestamp,
      updated_at: session.updatedAt || session.createdAt || timestamp
    });
  }

  for (const mission of state.groupMissions || []) {
    tables.group_missions.push({
      id: mission.id,
      class_session_id: mission.sessionId || "",
      title: mission.title || "Group mission",
      group_size: mission.groupSize || "",
      shared_artifact: mission.sharedArtifact || "",
      role_labels: mission.roles || [],
      individual_evidence: mission.individualEvidence || "",
      teacher_look_for: mission.teacherLookFor || "",
      status: mission.status || "planned",
      created_at: mission.createdAt || timestamp,
      updated_at: mission.updatedAt || mission.createdAt || timestamp
    });

    const session = (state.classSessions || []).find((item) => item.id === mission.sessionId);
    const section = (state.classSections || []).find((item) => item.id === session?.classSectionId);
    for (const studentId of section?.studentIds || []) {
      const submittedArtifact = (state.classroomArtifacts || []).find(
        (artifact) => artifact.missionId === mission.id && artifact.learnerId === studentId
      );
      tables.group_artifacts.push({
        id: submittedArtifact?.id || `group-artifact-${mission.id}-${studentId}`.replace(/[^a-z0-9_-]/gi, "-"),
        group_mission_id: mission.id,
        student_id: studentId,
        artifact_title: submittedArtifact?.artifactTitle || mission.sharedArtifact || mission.title || "Group artifact",
        artifact_status: submittedArtifact?.artifactStatus || "not-submitted",
        individual_evidence: submittedArtifact?.individualEvidence || mission.individualEvidence || "",
        submitted_at: submittedArtifact?.submittedAt || "",
        reviewed_at: submittedArtifact?.reviewedAt || ""
      });
    }
  }

  const explicitInterventionKeys = new Set();
  for (const intervention of state.teacherInterventions || []) {
    explicitInterventionKeys.add(`${intervention.classSessionId}:${intervention.learnerId || intervention.studentId || ""}`);
    tables.teacher_interventions.push({
      id: intervention.id,
      teacher_id: intervention.teacherId || teacherId,
      class_session_id: intervention.classSessionId || "",
      student_id: intervention.learnerId || intervention.studentId || "",
      lesson_id: intervention.lessonId || "",
      intervention_type: intervention.interventionType || "reteach",
      summary: [
        intervention.summary || intervention.teacherNote || "Teacher intervention recorded from class monitoring.",
        intervention.outcome ? `Outcome: ${intervention.outcome}.` : "",
        intervention.outcomeNote || ""
      ].filter(Boolean).join(" "),
      status: intervention.status || "open",
      created_at: intervention.createdAt || timestamp,
      resolved_at: intervention.resolvedAt || ""
    });
  }

  for (const session of state.classSessions || []) {
    const section = (state.classSections || []).find((item) => item.id === session.classSectionId);
    const lesson = findProjectedLesson(state, session.lessonId) || pilotLessons[0];
    for (const studentId of section?.studentIds || []) {
      if (explicitInterventionKeys.has(`${session.id}:${studentId}`)) continue;
      const mastery = state.mastery?.[session.lessonId] || {};
      if (Number(mastery.score || 0) >= Number(lesson.masteryThreshold || 80)) continue;
      tables.teacher_interventions.push({
        id: `intervention-${session.id}-${studentId}`.replace(/[^a-z0-9_-]/gi, "-"),
        teacher_id: section.teacherId || teacherId,
        class_session_id: session.id,
        student_id: studentId,
        lesson_id: session.lessonId || "",
        intervention_type: Number(mastery.score || 0) ? "reteach" : "monitor",
        summary: mastery.evidence || "Monitor the student's visual model, written stuck point, and exit ticket before assigning the next step.",
        status: "open",
        created_at: timestamp,
        resolved_at: ""
      });
    }
  }

  for (const section of state.classSections || []) {
    const sectionStudents = learners.filter((learner) => (section.studentIds || []).includes(learner.id));
    const sectionSessionIds = new Set((state.classSessions || []).filter((session) => session.classSectionId === section.id).map((session) => session.id));
    const sectionMissionIds = new Set(
      (state.groupMissions || []).filter((mission) => sectionSessionIds.has(mission.sessionId)).map((mission) => mission.id)
    );
    const scores = sectionStudents
      .map((learner) => {
        const session = (state.classSessions || []).find((item) => item.classSectionId === section.id);
        return Number(state.mastery?.[session?.lessonId]?.score || 0);
      })
      .filter((score) => Number.isFinite(score));
    const averageMastery = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
    tables.school_reports.push({
      id: `school-report-${section.id}`.replace(/[^a-z0-9_-]/gi, "-"),
      school_id: section.schoolId || schoolId,
      class_id: section.id,
      report_type: "classroom-pilot-readiness",
      summary: `${section.name || "Class"} has ${sectionStudents.length} enrolled learner(s), ${averageMastery}% average mastery, and a live class-session pilot path.`,
      metrics: {
        enrolledStudents: sectionStudents.length,
        averageMastery,
        activeSessions: (state.classSessions || []).filter((session) => session.classSectionId === section.id).length,
        groupMissions: (state.groupMissions || []).filter((mission) =>
          (state.classSessions || []).some((session) => session.id === mission.sessionId && session.classSectionId === section.id)
        ).length,
        submittedArtifacts: (state.classroomArtifacts || []).filter(
          (artifact) => sectionMissionIds.has(artifact.missionId) && artifact.artifactStatus === "submitted"
        ).length,
        openInterventions: (state.teacherInterventions || []).filter(
          (intervention) => sectionSessionIds.has(intervention.classSessionId) && intervention.status !== "resolved"
        ).length
      },
      created_at: timestamp
    });
  }

  const attemptedLessonIds = new Set();
  for (const [lessonId, result] of Object.entries(state.quizResults || {})) {
    const lesson = findProjectedLesson(state, lessonId);
    if (!lesson) continue;
    attemptedLessonIds.add(lessonId);
    tables.quiz_attempts.push({
      id: `attempt-${lessonId}-${tables.quiz_attempts.length + 1}`,
      quiz_id: `${lessonId}-quiz`,
      student_id: learnerIdForLesson(lesson),
      score: result.score,
      passed: Boolean(result.passed),
      answers: result.answers || {},
      attempted_at: timestamp
    });
  }

  for (const [lessonId, mastery] of Object.entries(state.mastery || {})) {
    if (attemptedLessonIds.has(lessonId)) continue;
    const lesson = findProjectedLesson(state, lessonId);
    if (!lesson) continue;
    tables.quiz_attempts.push({
      id: `attempt-${lessonId}-seed`,
      quiz_id: `${lessonId}-quiz`,
      student_id: learnerIdForLesson(lesson),
      score: mastery.score,
      passed: mastery.score >= (lesson.masteryThreshold || 80),
      answers: {},
      attempted_at: timestamp
    });
  }

  for (const [lessonId, mastery] of Object.entries(state.mastery || {})) {
    const lesson = findProjectedLesson(state, lessonId);
    if (!lesson) continue;
    const studentId = learnerIdForLesson(lesson);
    tables.lesson_progress.push({
      id: `progress-${studentId}-${lessonId}`,
      student_id: studentId,
      lesson_id: lessonId,
      status: mastery.status,
      started_at: "",
      completed_at: mastery.status === "Mastered" ? timestamp : "",
      last_activity_at: timestamp
    });
    tables.mastery_records.push({
      id: `mastery-${studentId}-${lessonId}`,
      student_id: studentId,
      lesson_id: lessonId,
      skill_tag: lessonId,
      score: mastery.score,
      status: mastery.status,
      attempts: mastery.attempts,
      evidence: mastery.evidence,
      updated_at: timestamp
    });
  }

  for (const [studentId, lessons] of Object.entries(state.lessonScratchpads || {})) {
    for (const [lessonId, scratchpad] of Object.entries(lessons || {})) {
      const lesson = findProjectedLesson(state, lessonId);
      if (!lesson) continue;
      tables.lesson_scratchpads.push({
        id: `scratchpad-${studentId}-${lessonId}`.replace(/[^a-z0-9_-]/gi, "-"),
        student_id: studentId,
        lesson_id: lessonId,
        first_step: scratchpad.firstStep || "",
        explanation: scratchpad.explanation || "",
        confusion: scratchpad.confusion || "",
        retry_after_hint: scratchpad.retryAfterHint || "",
        tutor_review_count: Number(scratchpad.tutorReviewCount || 0),
        updated_at: scratchpad.updatedAt || timestamp
      });
    }
  }

  for (const [studentId, lessons] of Object.entries(state.interactiveResponses || {})) {
    for (const [lessonId, widgets] of Object.entries(lessons || {})) {
      const lesson = findProjectedLesson(state, lessonId);
      if (!lesson) continue;
      for (const [widgetId, response] of Object.entries(widgets || {})) {
        const skillEvidence = response.skillEvidence || {};
        tables.interactive_skill_evidence.push({
          id: `interactive-skill-${studentId}-${lessonId}-${widgetId}`.replace(/[^a-z0-9_-]/gi, "-"),
          student_id: studentId,
          lesson_id: lessonId,
          widget_id: widgetId,
          skill_id: skillEvidence.skillId || widgetId,
          skill_label: skillEvidence.skillLabel || "Interactive model",
          status: skillEvidence.status || (response.correct ? "secure" : "needs-retry"),
          correct: Boolean(response.correct),
          attempts: Number(response.attempts || 0),
          value: response.value || "",
          diagnosis: skillEvidence.diagnosis || response.feedback || "",
          recommended_support: skillEvidence.recommendedSupport || "",
          evidence_strength: skillEvidence.evidenceStrength || (response.correct ? "interactive-correct" : "interactive-retry"),
          updated_at: response.updatedAt || timestamp
        });
      }
    }
  }

  for (const assignment of state.assignments || []) {
    const lesson =
      findProjectedLesson(state, assignment.lessonId) ||
      findProjectedLessonByTitle(state, assignment.title) ||
      pilotLessons[0];
    tables.assignments.push({
      id: assignment.id,
      student_id: assignment.learner === "Avery" ? "avery" : assignment.learner === "Maya" ? "maya" : "jordan",
      lesson_id: lesson.id,
      assigned_by_user_id: guardianUserId,
      title: assignment.title,
      due_at: assignment.due,
      status: assignment.status,
      created_at: timestamp
    });
  }

  for (const item of state.masteryBenefits || []) {
    tables.portfolio_items.push({
      id: `portfolio-${item.id}`,
      student_id: item.learnerId,
      lesson_id: item.lessonId,
      title: item.title,
      artifact_type: item.type,
      source: item.source,
      visibility: "parent-teacher-student",
      created_at: item.unlockedAt || timestamp
    });
  }

  for (const reward of rewardCatalog) {
    tables.badges.push({
      id: reward.id,
      title: reward.title,
      category: reward.type || "mastery",
      requirement: reward.description || "Requires mastery evidence.",
      created_at: timestamp
    });
  }

  for (const item of state.masteryBenefits || []) {
    tables.student_badges.push({
      id: `student-badge-${item.id}`,
      student_id: item.learnerId,
      badge_id: "mastery-badges",
      lesson_id: item.lessonId,
      earned_at: item.unlockedAt || timestamp,
      evidence: item.source
    });
  }

  for (const request of state.rewardApprovals || []) {
    tables.reward_approvals.push({
      id: request.id,
      student_id: request.learnerId,
      guardian_id: guardianId,
      reward_level: request.rewardLevel,
      reward_title: request.rewardTitle,
      reward_benefit: request.rewardBenefit,
      status: request.status,
      requested_by: request.requestedBy,
      requested_at: request.requestedAt,
      reviewed_by: request.reviewedBy || "",
      reviewed_at: request.reviewedAt || "",
      evidence: JSON.stringify(request.evidence || {}),
      parent_note: request.parentNote || request.note || "",
      fulfillment_provider: request.fulfillment?.provider || "",
      fulfillment_status: request.fulfillment?.status || "",
      fulfillment_reference: request.fulfillment?.providerReference || "",
      fulfillment_requested_at: request.fulfillment?.requestedAt || "",
      fulfillment_completed_at: request.fulfillment?.completedAt || "",
      source: request.source || "app"
    });
  }

  for (const draft of state.contentDrafts || []) {
    tables.content_drafts.push({
      id: draft.id,
      academy_id: draft.academyId,
      grade: draft.grade,
      subject_id: draft.subject,
      title: draft.title,
      objective: draft.objective,
      unit_title: draft.unitTitle || "",
      standards_tags: draft.standards || [],
      essential_question: draft.essentialQuestion || "",
      student_summary: draft.studentSummary || "",
      why_it_matters: draft.whyItMatters || "",
      vocabulary_terms: draft.vocabularyTerms || [],
      prerequisite_skills: draft.prerequisiteSkills || [],
      lesson_sections: draft.lessonSections || {},
      helper_notes: draft.helperNotes || [],
      common_misunderstandings: draft.commonMisunderstandings || [],
      visual_supports: draft.visualSupports || [],
      quiz_questions: draft.quizQuestions || [],
      source_cards: draft.sourceCards || [],
      group_homework: draft.groupHomework || {},
      status: draft.status,
      blocked_reason: draft.blockedReason || "",
      review_notes: draft.reviewNotes || "",
      accessibility_notes: draft.accessibilityNotes || "",
      age_fit_notes: draft.ageFitNotes || "",
      lesson_body_ready: Boolean(draft.lessonBodyReady),
      teaching_completeness_status: draft.teachingCompletenessStatus || "",
      teaching_completeness_issues: draft.teachingCompletenessIssues || draft.contentCompletenessReview?.issues || [],
      source_lesson_id: draft.sourceLessonId || null,
      source_tool_call_id: draft.sourceToolCallId || "",
      redesign_task_ids: draft.redesignTaskIds || [],
      research_source_ids: draft.researchSourceIds || [],
      truth_score: typeof draft.truthScore === "number" ? draft.truthScore : null,
      truth_issues: draft.truthIssues || draft.contentTruthReview?.issues || [],
      needs_external_research: Boolean(draft.needsExternalResearch),
      truth_review_status: draft.truthReviewStatus || draft.contentTruthReview?.status || "",
      latest_review: draft.latestReview || {},
      review_history: draft.reviewHistory || [],
      review_version: Number(draft.reviewVersion || 0),
      created_at: draft.createdAt || timestamp,
      updated_at: draft.updatedAt || draft.createdAt || timestamp
    });
  }

  const contentDraftIds = new Set((state.contentDrafts || []).map((draft) => draft.id).filter(Boolean));
  for (const asset of state.visualAssets || []) {
    const lessonId = asset.lessonId || "";
    const draftId = asset.draftId && contentDraftIds.has(asset.draftId) ? asset.draftId : "";
    tables.visual_assets.push({
      id: asset.id,
      lesson_id: lessonId,
      draft_id: draftId,
      asset_kind: asset.assetKind,
      placement: asset.placement || "",
      subject_id: asset.subject || "",
      grade: asset.grade || "",
      title: asset.title || asset.caption || "",
      asset_url: visualAssetUrl(asset),
      storage_provider: asset.storageProvider || "",
      storage_bucket: asset.storageBucket || "",
      storage_path: asset.storagePath || "",
      storage_public_url: asset.storagePublicUrl || "",
      storage_status: asset.storageStatus || "",
      source_prompt: asset.sourcePrompt || "",
      source_model: asset.sourceModel || asset.model || "",
      usage: asset.usage || {},
      generation_metadata: asset.generationMetadata || asset.generationPlan || {},
      review_checklist: asset.reviewChecklist || [],
      alt_text: asset.altText || "",
      caption: asset.caption || "",
      license: asset.license || "",
      credit: asset.credit || "",
      status: asset.status,
      approved_by_user_id: asset.approvedByUserId || "",
      approved_at: asset.approvedAt || "",
      latest_review: asset.latestReview || {},
      review_history: asset.reviewHistory || [],
      review_version: Number(asset.reviewVersion || 0),
      created_at: asset.createdAt || timestamp,
      updated_at: asset.updatedAt || asset.createdAt || timestamp
    });
  }

  for (const log of state.aiLogs || []) {
    const lesson =
      findProjectedLesson(state, log.lessonId) ||
      findProjectedLessonByTitle(state, log.lessonTitle) ||
      pilotLessons[0];
    tables.ai_tutor_events.push({
      id: log.id,
      student_id: log.learnerId || log.studentId || learnerIdForLesson(lesson),
      lesson_id: lesson.id,
      input: log.input,
      response: log.response,
      analysis: log.analysis,
      type: log.type,
      mode_id: log.modeId || "",
      mode_title: log.modeTitle || "",
      strategy: log.strategy || "",
      visual_hint: log.visualHint || "",
      first_principles_prompt: log.firstPrinciplesPrompt || "",
      student_feedback: log.studentFeedback || "",
      feedback_note: log.feedbackNote || "",
      helped: typeof log.helped === "boolean" ? log.helped : null,
      quality_score: typeof log.qualityScore === "number" ? log.qualityScore : null,
      truth_score: typeof log.truthScore === "number" ? log.truthScore : null,
      truth_issues: log.truthIssues || log.truthReview?.issues || [],
      needs_external_research: Boolean(log.needsExternalResearch),
      truth_review_status: log.truthReviewStatus || log.truthReview?.status || "",
      flagged: Boolean(log.flagged),
      review_status: log.reviewStatus || "",
      created_at: log.timestamp || timestamp
    });
  }

  for (const log of state.toolCallLogs || []) {
    tables.agent_tool_calls.push({
      id: log.id,
      tool_id: log.toolId,
      tool_name: log.toolName,
      owner_agent_id: log.ownerAgentId,
      role: log.role,
      status: log.status,
      external_risk: log.externalRisk,
      requires_human_review: Boolean(log.requiresHumanReview),
      review_status: log.reviewStatus || "",
      payload: log.payload || {},
      created_at: log.createdAt || timestamp
    });
  }

  for (const finding of syllabusResearchFindings) {
    for (const subject of finding.subjects || [""]) {
      for (const gradeBand of finding.gradeBands || [""]) {
        tables.research_evidence_sources.push({
          id: `${finding.id}-${subject}-${gradeBand}`.replace(/[^a-z0-9_-]/gi, "-"),
          source_id: finding.sourceId,
          source_name: finding.sourceName,
          source_url: finding.sourceUrl,
          source_type: finding.sourceType,
          checked_at: finding.checkedAt,
          subject_id: subject,
          grade_band_id: gradeBand,
          claim: finding.claim,
          trouble_signal: finding.troubleSignal,
          redesign_move: finding.redesignMove,
          status: "staff-reviewed-seed"
        });
      }
    }
  }

  for (const log of state.toolCallLogs || []) {
    const sourceLedger = Array.isArray(log.payload?.sourceLedger) ? log.payload.sourceLedger : [];
    for (const source of sourceLedger) {
      tables.research_evidence_sources.push({
        id: source.id || `${log.id}-${source.sourceId || "source"}`.replace(/[^a-z0-9_-]/gi, "-"),
        source_id: source.sourceId || log.toolId,
        source_name: source.sourceName || log.toolName,
        source_url: source.sourceUrl || log.payload?.sourceUrl || "",
        source_type: source.sourceType || "tool-source-ledger",
        checked_at: source.checkedAt || log.createdAt || timestamp,
        subject_id: (source.subjects || [log.payload?.subject || ""])[0] || "",
        grade_band_id: (source.gradeBands || [])[0] || "",
        claim: source.claim || "",
        trouble_signal: source.troubleSignal || "",
        redesign_move: source.redesignMove || "",
        status: source.status || "review"
      });
    }

    const tasks = Array.isArray(log.payload?.redesignTasks) ? log.payload.redesignTasks : [];
    const lessonId = log.payload?.lessonId || tasks[0]?.lessonId || "";
    for (const task of tasks) {
      const lesson = findProjectedLesson(state, task.lessonId || lessonId) || pilotLessons[0];
      tables.lesson_redesign_tasks.push({
        id: task.id,
        lesson_id: lesson.id,
        owner_agent_id: log.ownerAgentId || "syllabus-research",
        title: task.title,
        why: task.why,
        change: task.change,
        source_ids: task.sourceIds || [],
        status: task.status || "research-review",
        created_at: log.createdAt || timestamp
      });
    }
  }

  for (const signal of state.lessonImprovementSignals || []) {
    const lesson = findProjectedLesson(state, signal.lessonId) || pilotLessons[0];
    tables.lesson_redesign_tasks.push({
      id: signal.id,
      lesson_id: lesson.id,
      owner_agent_id: signal.ownerAgentId || "fun-retention",
      title: signal.title,
      why: signal.why,
      change: signal.change,
      source_ids: signal.sourceIds || ["student-tutor-feedback"],
      status: signal.status || "needs-redesign",
      review_status: signal.reviewStatus || "",
      implemented_draft_id: signal.implementedDraftId || "",
      implemented_lesson_id: signal.implementedLessonId || "",
      implemented_at: signal.implementedAt || null,
      review_history: signal.reviewHistory || [],
      created_at: signal.createdAt || timestamp
    });
    if (!["approved", "rejected", "revision-requested", "reviewed", "implemented"].includes(signal.reviewStatus || "")) {
      tables.agent_review_items.push({
        id: `review-redesign-${signal.id}`,
        source_type: "redesign",
        source_id: signal.id,
        owner_agent_id: signal.ownerAgentId || "fun-retention",
        priority: signal.feedback === "needs-picture" || signal.feedback === "needs-redesign" ? "high" : "medium",
        status: "pending",
        decision: "",
        reviewed_by_user_id: "",
        reviewed_at: "",
        artifact_type: "lesson_redesign_task",
        artifact_id: signal.id,
        score: null,
        grade: "",
        threshold: null,
        passed: false,
        critical_blockers: [],
        blockers: [],
        revision_instructions: signal.change ? [signal.change] : [],
        review_history: signal.reviewHistory || []
      });
    }
  }

  for (const asset of (state.visualAssets || []).filter((item) => item.status === "review")) {
    const review = asset.latestReview || {};
    tables.agent_review_items.push({
      id: `review-visual-${asset.id}`,
      source_type: "visual",
      source_id: asset.id,
      owner_agent_id: "visual-learning",
      priority: asset.assetKind === "openai-generated-image" ? "high" : "medium",
      status: "pending",
      decision: "",
      reviewed_by_user_id: "",
      reviewed_at: "",
      artifact_type: "generated_visual",
      artifact_id: asset.id,
      score: typeof review.score === "number" ? review.score : null,
      grade: review.grade || "",
      threshold: typeof review.threshold === "number" ? review.threshold : null,
      passed: Boolean(review.passed),
      critical_blockers: review.criticalBlockers || [],
      blockers: review.blockers || [],
      revision_instructions: review.specificRevisionInstructions || [],
      review_history: asset.reviewHistory || []
    });
  }
  for (const draft of (state.contentDrafts || []).filter((item) => item.status === "published" && item.publishedAt)) {
    const review = draft.latestReview || {};
    tables.agent_review_items.push({
      id: `review-publication-${draft.id}`,
      source_type: "content",
      source_id: draft.id,
      owner_agent_id: "content-ops",
      priority: "low",
      status: "approved",
      decision: "published",
      reviewed_by_user_id: "user-platform-admin",
      reviewed_at: draft.publishedAt,
      artifact_type: "lesson",
      artifact_id: draft.id,
      score: typeof review.score === "number" ? review.score : 100,
      grade: review.grade || "A",
      threshold: typeof review.threshold === "number" ? review.threshold : 80,
      passed: true,
      critical_blockers: review.criticalBlockers || [],
      blockers: review.blockers || [],
      revision_instructions: review.specificRevisionInstructions || [],
      review_history: draft.reviewHistory || []
    });
  }
  for (const draft of (state.contentDrafts || []).filter((item) => item.status === "review" || item.publicationBlocked)) {
    const truthBlocked = draft.truthReviewStatus !== "approved";
    const review = draft.latestReview || {};
    tables.agent_review_items.push({
      id: `review-content-${draft.id}`,
      source_type: "content",
      source_id: draft.id,
      owner_agent_id: truthBlocked ? "truth-policy" : "content-ops",
      priority: draft.publicationBlocked || truthBlocked ? "high" : "medium",
      status: "pending",
      decision: "",
      reviewed_by_user_id: "",
      reviewed_at: "",
      artifact_type: "lesson",
      artifact_id: draft.id,
      score: typeof review.score === "number" ? review.score : null,
      grade: review.grade || "",
      threshold: typeof review.threshold === "number" ? review.threshold : null,
      passed: Boolean(review.passed),
      critical_blockers: review.criticalBlockers || [],
      blockers: review.blockers || [],
      revision_instructions: review.specificRevisionInstructions || [],
      review_history: draft.reviewHistory || []
    });
  }
  for (const log of (state.toolCallLogs || []).filter((item) => item.requiresHumanReview && !item.reviewStatus)) {
    tables.agent_review_items.push({
      id: `review-tool-${log.id}`,
      source_type: "tool",
      source_id: log.id,
      owner_agent_id: log.ownerAgentId,
      priority: log.externalRisk === "api-cost" ? "high" : "medium",
      status: "pending",
      decision: "",
      reviewed_by_user_id: "",
      reviewed_at: "",
      artifact_type: "tool_output",
      artifact_id: log.id,
      score: null,
      grade: "",
      threshold: 80,
      passed: false,
      critical_blockers: [],
      blockers: [],
      revision_instructions: [],
      review_history: []
    });
  }
  for (const log of (state.aiLogs || []).filter((item) => {
    const needsTruthReview = item.requiresHumanReview || item.needsExternalResearch || (typeof item.truthScore === "number" && item.truthScore < 4);
    return (item.flagged || needsTruthReview) && !item.reviewStatus;
  })) {
    tables.agent_review_items.push({
      id: `review-ai-${log.id}`,
      source_type: "ai",
      source_id: log.id,
      owner_agent_id: log.flagged ? "ai-safety" : "truth-policy",
      priority: log.flagged || log.needsExternalResearch ? "high" : "medium",
      status: "pending",
      decision: "",
      reviewed_by_user_id: "",
      reviewed_at: "",
      artifact_type: "ai_tutor_response",
      artifact_id: log.id,
      score: typeof log.truthScore === "number" ? log.truthScore * 20 : null,
      grade: "",
      threshold: 80,
      passed: false,
      critical_blockers: log.flagged ? ["Safety review required."] : [],
      blockers: log.truthIssues || [],
      revision_instructions: log.needsExternalResearch ? ["Truth-policy review requires staff-side source checking."] : [],
      review_history: []
    });
  }

  const createBatchReviewRow = ({
    id,
    sourceBatchId,
    academyId = "",
    gradeBand = "",
    gradeLevels = [],
    subjects = [],
    status = "pending",
    decision = "",
    totalLessons = 0,
    passedLessons = 0,
    totalArtifacts = 0,
    passedArtifacts = 0,
    score = null,
    grade = "",
    threshold = 80,
    passed = false,
    publishEligible = false,
    lessonIds = [],
    visualAssetIds = [],
    lessonReports = [],
    artifactReports = [],
    blockingLessons = [],
    blockers = [],
    revisionInstructions = [],
    reviewHistory = [],
    reviewedByUserId = "",
    reviewedAt = ""
  }) => ({
    id,
    source_batch_id: sourceBatchId,
    academy_id: academyId,
    grade_band: gradeBand,
    grade_levels: gradeLevels,
    subjects,
    status,
    decision,
    total_lessons: totalLessons,
    passed_lessons: passedLessons,
    total_artifacts: totalArtifacts,
    passed_artifacts: passedArtifacts,
    score,
    grade,
    threshold,
    passed: Boolean(passed),
    publish_eligible: Boolean(publishEligible),
    lesson_ids: lessonIds,
    visual_asset_ids: visualAssetIds,
    lesson_reports: lessonReports,
    artifact_reports: artifactReports,
    blocking_lessons: blockingLessons,
    blockers,
    revision_instructions: revisionInstructions,
    review_history: reviewHistory,
    reviewed_by_user_id: reviewedByUserId,
    reviewed_at: reviewedAt,
    created_at: timestamp,
    updated_at: timestamp
  });

  const visualAssetsByBatch = groupBy(state.visualAssets || [], "sourceBatchId");
  const draftsByBatch = groupBy(state.contentDrafts || [], "sourceBatchId");
  for (const job of state.contentImportJobs || []) {
    const drafts = draftsByBatch[job.id] || [];
    const assets = visualAssetsByBatch[job.id] || [];
    const accepted = job.status === "imported";
    const blockers = (job.errors || []).map((error) => error.message || String(error)).filter(Boolean);
    tables.content_batch_reviews.push(
      createBatchReviewRow({
        id: `batch-review-${job.id}`,
        sourceBatchId: job.id,
        academyId: drafts[0]?.academyId || "",
        gradeBand: drafts[0]?.academyId || "",
        gradeLevels: [...new Set(drafts.map((draft) => draft.grade).filter(Boolean))],
        subjects: [...new Set(drafts.map((draft) => draft.subject).filter(Boolean))],
        status: accepted ? "ready-for-manager-review" : "rejected",
        decision: accepted ? "" : "rejected",
        totalLessons: Number(job.total || drafts.length || 0),
        passedLessons: accepted ? Number(job.imported || drafts.length || 0) : 0,
        totalArtifacts: assets.length,
        passedArtifacts: assets.filter((asset) => asset.status === "approved").length,
        score: accepted ? 80 : 0,
        grade: accepted ? "B" : "F",
        threshold: 80,
        passed: accepted,
        publishEligible: accepted && assets.every((asset) => asset.status === "approved"),
        lessonIds: drafts.map((draft) => draft.id),
        visualAssetIds: assets.map((asset) => asset.id),
        lessonReports: drafts.map((draft) => ({
          id: draft.id,
          title: draft.title,
          status: draft.status,
          lessonBodyReady: Boolean(draft.lessonBodyReady),
          truthReviewStatus: draft.truthReviewStatus || ""
        })),
        artifactReports: assets.map((asset) => ({
          id: asset.id,
          status: asset.status,
          assetKind: asset.assetKind,
          title: asset.title || asset.caption || ""
        })),
        blockingLessons: accepted ? [] : job.errors || [],
        blockers,
        revisionInstructions: accepted
          ? ["Manager must approve lesson content, truth review, accessibility, and visuals before publishing."]
          : ["Fix the rejected batch validation errors and resubmit the whole batch."],
        reviewHistory: [
          {
            action: accepted ? "batch-imported" : "batch-rejected",
            at: job.importedAt || timestamp,
            status: job.status,
            warnings: job.warnings || [],
            errors: job.errors || []
          }
        ],
        reviewedByUserId: accepted ? "" : adminUserId,
        reviewedAt: accepted ? "" : job.importedAt || timestamp
      })
    );
  }

  const bridgeBatchOneId = "bridge-academy-grade-6-batch-1";
  const bridgeBatchOneDrafts = draftsByBatch[bridgeBatchOneId] || [];
  const bridgeBatchOnePublications = (state.contentBatchPublications || []).filter((publication) => publication.sourceBatchId === bridgeBatchOneId);
  const latestBridgeBatchPublication = bridgeBatchOnePublications[0] || null;
  if (bridgeBatchOneDrafts.length || latestBridgeBatchPublication) {
    const bridgeBatchStatus = latestBridgeBatchPublication
      ? latestBridgeBatchPublication.status
      : bridgeBatchOneDrafts.every((draft) => draft.batchReviewStatus === "approved")
      ? "approved"
      : bridgeBatchOneDrafts.some((draft) => draft.batchReviewStatus === "rejected")
        ? "rejected"
        : bridgeBatchOneDrafts.some((draft) => draft.batchReviewStatus === "revision-required")
          ? "revision-required"
          : "manager-review";
    const bridgeBatchPassedLessons = bridgeBatchOneDrafts.filter(
      (draft) =>
        draft.visualSupports?.length >= 5 &&
        draft.quizQuestions?.length >= 4 &&
        draft.commonMisunderstandings?.length >= 3 &&
        draft.groupHomework &&
        draft.sourceCards?.length >= 2
    ).length;
    const bridgeBatchPassed = latestBridgeBatchPublication
      ? latestBridgeBatchPublication.publishedCount === latestBridgeBatchPublication.totalLessons && latestBridgeBatchPublication.blockedCount === 0
      : bridgeBatchPassedLessons === bridgeBatchOneDrafts.length;
    const bridgeBatchReviewHistory = bridgeBatchOneDrafts.flatMap((draft) => draft.batchReviewHistory || []).slice(0, 12);
    const bridgeBatchReviewRow = createBatchReviewRow({
      id: "batch-review-bridge-academy-grade-6-batch-1",
      sourceBatchId: bridgeBatchOneId,
      academyId: "bridge",
      gradeBand: "6-8",
      gradeLevels: ["6"],
      subjects: [...new Set([
        ...bridgeBatchOneDrafts.map((draft) => draft.subject),
        ...(latestBridgeBatchPublication?.results || []).map((result) => result.subject)
      ].filter(Boolean))],
      status: bridgeBatchStatus,
      decision: ["approved", "published", "partial"].includes(bridgeBatchStatus) ? "approved" : bridgeBatchStatus === "rejected" ? "rejected" : "",
      totalLessons: latestBridgeBatchPublication?.totalLessons || bridgeBatchOneDrafts.length,
      passedLessons: latestBridgeBatchPublication?.publishedCount ?? bridgeBatchPassedLessons,
      totalArtifacts: latestBridgeBatchPublication
        ? latestBridgeBatchPublication.results.length
        : bridgeBatchOneDrafts.reduce((sum, draft) => sum + (draft.visualSupports?.length || 0) + (draft.quizQuestions?.length || 0), 0),
      passedArtifacts: latestBridgeBatchPublication
        ? latestBridgeBatchPublication.publishedCount
        : bridgeBatchOneDrafts.reduce((sum, draft) => sum + (draft.visualSupports?.length || 0) + (draft.quizQuestions?.length || 0), 0),
      score: latestBridgeBatchPublication?.score ?? (bridgeBatchPassed ? 90 : 70),
      grade: latestBridgeBatchPublication?.grade || (bridgeBatchPassed ? "A" : "C"),
      threshold: 80,
      passed: bridgeBatchPassed,
      publishEligible: bridgeBatchStatus === "approved" && bridgeBatchPassed,
      lessonIds: latestBridgeBatchPublication
        ? latestBridgeBatchPublication.results.map((result) => result.publishedLessonId || result.draftId).filter(Boolean)
        : bridgeBatchOneDrafts.map((draft) => draft.id),
      visualAssetIds: bridgeBatchOneDrafts.flatMap((draft) => draft.visualAssetId ? [draft.visualAssetId] : []),
      lessonReports: latestBridgeBatchPublication
        ? latestBridgeBatchPublication.results.map((result) => ({
            id: result.publishedLessonId || result.draftId,
            draftId: result.draftId,
            title: result.title,
            subject: result.subject,
            status: result.status,
            score: result.score,
            grade: result.grade,
            blockedReason: result.blockedReason || ""
          }))
        : bridgeBatchOneDrafts.map((draft) => ({
            id: draft.id,
            title: draft.title,
            subject: draft.subject,
            status: draft.status,
            batchReviewStatus: draft.batchReviewStatus || "",
            visualSupports: draft.visualSupports?.length || 0,
            quizQuestions: draft.quizQuestions?.length || 0,
            groupHomework: Boolean(draft.groupHomework),
            sourceCards: draft.sourceCards?.length || 0
          })),
      artifactReports: latestBridgeBatchPublication
        ? latestBridgeBatchPublication.results.map((result) => ({ draftId: result.draftId, artifactType: "published_lesson", status: result.status }))
        : bridgeBatchOneDrafts.flatMap((draft) => [
            { draftId: draft.id, artifactType: "visual_supports", count: draft.visualSupports?.length || 0 },
            { draftId: draft.id, artifactType: "quiz_questions", count: draft.quizQuestions?.length || 0 }
          ]),
      blockingLessons: latestBridgeBatchPublication
        ? latestBridgeBatchPublication.results.filter((result) => result.status !== "published")
        : bridgeBatchPassed ? [] : bridgeBatchOneDrafts.filter((draft) => !(draft.visualSupports?.length >= 5 && draft.quizQuestions?.length >= 4)),
      blockers: latestBridgeBatchPublication
        ? latestBridgeBatchPublication.results.filter((result) => result.status !== "published").map((result) => `${result.title}: ${result.blockedReason || "Publication blocked."}`)
        : bridgeBatchPassed ? [] : ["Bridge Batch 1 requires five review-ready Grade 6 class lessons before approval."],
      revisionInstructions: latestBridgeBatchPublication
        ? latestBridgeBatchPublication.blockedCount
          ? ["Fix the blocked lesson gates and rerun batch publication."]
          : ["Batch is fully published into the student lesson catalog."]
        : bridgeBatchPassed
          ? ["Manager should approve the batch before individual lesson publication gates."]
          : ["Complete missing visual supports, quizzes, group work, source cards, or misconception repairs."],
      reviewHistory: [
        ...bridgeBatchOnePublications.map((publication) => ({
          action: "batch-publication",
          at: publication.attemptedAt,
          status: publication.status,
          publishedCount: publication.publishedCount,
          blockedCount: publication.blockedCount
        })),
        ...(bridgeBatchReviewHistory.length
          ? bridgeBatchReviewHistory
          : [{ action: "batch-seeded", at: timestamp, status: bridgeBatchStatus, source: "bridge-grade-6-batch-1" }])
      ].slice(0, 12),
      reviewedByUserId: bridgeBatchStatus === "approved" || bridgeBatchStatus === "rejected" ? adminUserId : "",
      reviewedAt: latestBridgeBatchPublication?.attemptedAt || bridgeBatchOneDrafts.find((draft) => draft.batchReviewedAt)?.batchReviewedAt || ""
    });
    tables.content_batch_reviews.push(bridgeBatchReviewRow);
    if (!["approved", "rejected", "published", "partial"].includes(bridgeBatchStatus)) {
      tables.agent_review_items.push({
        id: "review-batch-bridge-academy-grade-6-batch-1",
        source_type: "batch",
        source_id: "bridge-academy-grade-6-batch-1",
        owner_agent_id: "content-ops",
        priority: bridgeBatchPassed ? "medium" : "high",
        status: "pending",
        decision: "",
        reviewed_by_user_id: "",
        reviewed_at: "",
        artifact_type: "content_batch_review",
        artifact_id: bridgeBatchReviewRow.id,
        score: bridgeBatchReviewRow.score,
        grade: bridgeBatchReviewRow.grade,
        threshold: bridgeBatchReviewRow.threshold,
        passed: bridgeBatchReviewRow.passed,
        critical_blockers: [],
        blockers: bridgeBatchReviewRow.blockers,
        revision_instructions: bridgeBatchReviewRow.revision_instructions,
        review_history: bridgeBatchReviewRow.review_history
      });
    }
  }

  if (!tables.content_batch_reviews.length) {
    const approvedPilotAssetIds = new Set(
      (state.visualAssets || []).filter((asset) => asset.status === "approved" && asset.lessonId).map((asset) => asset.lessonId)
    );
    const pilotLessonReports = pilotLessons.map((lesson) => {
      const visualApproved = approvedPilotAssetIds.has(lesson.id);
      return {
        id: lesson.id,
        title: lesson.title,
        gradeLevel: lesson.grade,
        subject: lesson.subject,
        contentReady: true,
        quizReady: Array.isArray(lesson.quiz) && lesson.quiz.length > 0,
        visualApproved
      };
    });
    const blockers = pilotLessonReports
      .filter((lesson) => !lesson.visualApproved)
      .map((lesson) => `${lesson.title} needs an approved production visual before scaled release.`);
    tables.content_batch_reviews.push(
      createBatchReviewRow({
        id: "batch-review-six-pilot-quality-gate",
        sourceBatchId: "six-pilot-quality-gate",
        academyId: "multi-academy",
        gradeBand: "mvp",
        gradeLevels: [...new Set(pilotLessons.map((lesson) => String(lesson.grade)).filter(Boolean))],
        subjects: [...new Set(pilotLessons.map((lesson) => lesson.subject).filter(Boolean))],
        status: blockers.length ? "revision-required" : "ready-for-manager-review",
        decision: "",
        totalLessons: pilotLessonReports.length,
        passedLessons: pilotLessonReports.filter((lesson) => lesson.contentReady && lesson.quizReady).length,
        totalArtifacts: pilotLessonReports.length,
        passedArtifacts: pilotLessonReports.filter((lesson) => lesson.visualApproved).length,
        score: blockers.length ? 75 : 90,
        grade: blockers.length ? "C" : "A",
        threshold: 80,
        passed: blockers.length === 0,
        publishEligible: blockers.length === 0,
        lessonIds: pilotLessons.map((lesson) => lesson.id),
        visualAssetIds: (state.visualAssets || []).filter((asset) => asset.status === "approved" && asset.lessonId).map((asset) => asset.id),
        lessonReports: pilotLessonReports,
        artifactReports: pilotLessonReports.map((lesson) => ({
          lessonId: lesson.id,
          visualApproved: lesson.visualApproved
        })),
        blockingLessons: pilotLessonReports.filter((lesson) => !lesson.visualApproved),
        blockers,
        revisionInstructions: blockers.length
          ? ["Approve or generate production visuals for every pilot lesson before scaling content production."]
          : ["Manager can proceed to V7 exemplar review before scaled content production."],
        reviewHistory: [
          {
            action: "baseline-pilot-quality-gate-projected",
            at: timestamp,
            source: "createProductionSeedProjection"
          }
        ]
      })
    );
  }

  for (const schedule of state.retentionSchedules || []) {
    tables.retention_schedules.push({
      id: schedule.id,
      student_id: schedule.learnerId,
      lesson_id: schedule.lessonId,
      skill_tag: schedule.skillTag,
      current_mastery: schedule.currentMastery,
      next_recall: schedule.nextRecall,
      interval_days: schedule.intervalDays,
      recall_count: schedule.recallCount,
      last_result: schedule.lastResult
    });
  }

  for (const event of state.learningEvents || []) {
    tables.learning_events.push({
      id: event.id,
      student_id: event.learnerId,
      lesson_id: event.lessonId,
      event_type: event.type,
      value: event.value,
      occurred_at: event.occurredAt
    });
  }

  for (const run of state.experimentRuns || []) {
    tables.experiment_runs.push({
      id: run.id,
      template_id: run.templateId,
      student_id: run.learnerId,
      lesson_id: run.lessonId,
      variant: run.variant,
      immediate_score: run.immediateScore,
      recall_24h: run.recall24h,
      recall_7d: run.recall7d,
      joy: run.joy,
      frustration: run.frustration,
      decision: run.decision
    });
  }

  tables.reward_settings.push({
    id: `reward-settings-${guardianId}`,
    guardian_id: guardianId,
    enabled: Boolean(state.rewardSettings?.enabled),
    selected_catalog_ids: state.rewardSettings?.selectedCatalogIds || [],
    family_benefits: state.rewardSettings?.familyBenefits || [],
    require_delayed_recall: Boolean(state.rewardSettings?.requireDelayedRecall),
    updated_at: timestamp
  });

  for (const event of [...tables.learning_events, ...tables.agent_tool_calls]) {
    tables.audit_events.push({
      id: `audit-${event.id}`,
      actor_user_id: event.student_id ? `user-${event.student_id}` : adminUserId,
      event_type: event.event_type || event.status || "tool_call",
      entity_type: event.lesson_id ? "lesson" : "agent_tool_call",
      entity_id: event.lesson_id || event.id,
      metadata: event,
      created_at: event.occurred_at || event.created_at || timestamp
    });
  }

  return {
    tables,
    summary: {
      tableCount: productionDataModel.length,
      rowCount: rowCount({ tables }),
      generatedAt: timestamp,
      requiredTablesWithRows: requiredProductionTables.filter((tableId) => tables[tableId]?.length > 0).length,
      requiredTableCount: requiredProductionTables.length
    }
  };
}

export function getProductionDataModelReadiness(state = {}) {
  const schema = getProductionSchemaSummary();
  const validation = validateProductionSchema();
  const projection = createProductionSeedProjection(state);
  const requiredEmpty = requiredProductionTables.filter((tableId) => !projection.tables[tableId]?.length);
  const roleCoverage = productionRoles.every((role) => roleAccessMatrix.some((entry) => entry.role === role.id));
  return {
    passed: validation.passed && requiredEmpty.length === 0 && roleCoverage,
    schema,
    validation,
    projectionSummary: projection.summary,
    requiredEmpty,
    roleCoverage,
    accessMatrix: getRoleAccessMatrix(),
    areaSummary: schema.areas
  };
}
