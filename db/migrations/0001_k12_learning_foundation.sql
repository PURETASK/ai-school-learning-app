-- K-12 Learning Academies production schema foundation

-- Generated from src/schema.js. Review before applying to production.

create extension if not exists pgcrypto;

create or replace function public.k12_current_setting(setting_name text)
returns text
language plpgsql
stable
as $$
declare
  setting_value text;
begin
  setting_value := current_setting(setting_name, true);
  return nullif(setting_value, '');
exception when others then
  return null;
end;
$$;

create or replace function public.k12_auth_jwt()
returns jsonb
language plpgsql
stable
as $$
declare
  claims jsonb;
  raw_claims text;
begin
  if to_regprocedure('auth.jwt()') is not null then
    execute 'select auth.jwt()::jsonb' into claims;
  end if;

  if claims is not null then
    return claims;
  end if;

  raw_claims := public.k12_current_setting('request.jwt.claims');
  if raw_claims is not null then
    return raw_claims::jsonb;
  end if;

  return '{}'::jsonb;
exception when others then
  return '{}'::jsonb;
end;
$$;

create or replace function public.k12_auth_uid_text()
returns text
language plpgsql
stable
as $$
declare
  auth_user_id text;
begin
  if to_regprocedure('auth.uid()') is not null then
    execute 'select auth.uid()::text' into auth_user_id;
  end if;

  return nullif(auth_user_id, '');
exception when others then
  return null;
end;
$$;

create or replace function public.k12_app_claim(claim_name text, setting_name text)
returns text
language plpgsql
stable
as $$
declare
  jwt jsonb;
  claim_value text;
begin
  jwt := public.k12_auth_jwt();
  claim_value := jwt #>> array['app_metadata', claim_name];

  if claim_value is null or claim_value = '' then
    claim_value := jwt #>> array[claim_name];
  end if;

  if claim_value is null or claim_value = '' then
    claim_value := public.k12_current_setting('app.' || setting_name);
  end if;

  return nullif(claim_value, '');
end;
$$;

create or replace function public.k12_current_app_role()
returns text
language sql
stable
as $$
  select public.k12_app_claim('role', 'role');
$$;

create or replace function public.k12_current_app_user_id()
returns text
language sql
stable
as $$
  select coalesce(
    public.k12_app_claim('userId', 'user_id'),
    public.k12_app_claim('user_id', 'user_id'),
    public.k12_auth_uid_text(),
    public.k12_auth_jwt() ->> 'sub'
  );
$$;

create or replace function public.k12_current_app_student_id()
returns text
language sql
stable
as $$
  select coalesce(
    public.k12_app_claim('studentId', 'student_id'),
    public.k12_app_claim('student_id', 'student_id')
  );
$$;

create or replace function public.k12_current_app_guardian_id()
returns text
language sql
stable
as $$
  select coalesce(
    public.k12_app_claim('guardianId', 'guardian_id'),
    public.k12_app_claim('guardian_id', 'guardian_id')
  );
$$;

create or replace function public.k12_current_app_teacher_id()
returns text
language sql
stable
as $$
  select coalesce(
    public.k12_app_claim('teacherId', 'teacher_id'),
    public.k12_app_claim('teacher_id', 'teacher_id')
  );
$$;

create table if not exists public."users" (
  "id" text,
  "role" text,
  "display_name" text,
  "username" text,
  "email" text,
  "email_verified" boolean not null default false,
  "auth_provider" text,
  "provider_subject" text,
  "status" text,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  primary key ("id")
);

create table if not exists public."students" (
  "id" text,
  "user_id" text,
  "academy_id" text,
  "grade_level_id" text,
  "display_name" text,
  "schedule" text,
  "status" text,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  primary key ("id")
);

create table if not exists public."guardians" (
  "id" text,
  "user_id" text,
  "preferred_report_day" text,
  "household_setup_complete" boolean not null default false,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  primary key ("id")
);

create table if not exists public."student_guardians" (
  "id" text,
  "student_id" text,
  "guardian_id" text,
  "relationship" text,
  "can_manage_consent" boolean not null default false,
  "created_at" timestamptz,
  primary key ("id")
);

create table if not exists public."account_invitations" (
  "id" text,
  "email" text,
  "role" text,
  "invited_by_user_id" text,
  "target_student_id" text,
  "target_class_id" text,
  "token_hash" text,
  "status" text,
  "expires_at" timestamptz,
  "accepted_at" timestamptz,
  "created_at" timestamptz,
  primary key ("id")
);

create table if not exists public."guardian_student_links" (
  "id" text,
  "guardian_id" text,
  "student_id" text,
  "relationship" text,
  "status" text,
  "requested_by_user_id" text,
  "approved_by_user_id" text,
  "created_at" timestamptz,
  "approved_at" timestamptz,
  "revoked_at" timestamptz,
  primary key ("id")
);

create table if not exists public."session_revocations" (
  "id" text,
  "user_id" text,
  "session_id" text,
  "revoked_before" text,
  "reason" text,
  "created_at" timestamptz,
  primary key ("id")
);

create table if not exists public."teachers" (
  "id" text,
  "user_id" text,
  "display_name" text,
  "organization_name" text,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  primary key ("id")
);

create table if not exists public."schools" (
  "id" text,
  "name" text,
  "district" text,
  "implementation_stage" text,
  "pilot_focus" text,
  "status" text,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  primary key ("id")
);

create table if not exists public."classes" (
  "id" text,
  "school_id" text,
  "teacher_id" text,
  "name" text,
  "academy_id" text,
  "grade_level_id" text,
  "subject_id" text,
  "schedule" text,
  "status" text,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  primary key ("id")
);

create table if not exists public."teacher_class_assignments" (
  "id" text,
  "teacher_id" text,
  "class_id" text,
  "assigned_by_user_id" text,
  "status" text,
  "created_at" timestamptz,
  "revoked_at" timestamptz,
  primary key ("id")
);

create table if not exists public."enrollments" (
  "id" text,
  "student_id" text,
  "class_id" text,
  "course_id" text,
  "status" text,
  "started_at" timestamptz,
  "ended_at" timestamptz,
  primary key ("id")
);

create table if not exists public."class_sessions" (
  "id" text,
  "class_id" text,
  "lesson_id" text,
  "title" text,
  "status" text,
  "period_label" text,
  "duration_minutes" integer,
  "launch_goal" text,
  "steps" jsonb not null default '[]'::jsonb,
  "started_at" timestamptz,
  "ended_at" timestamptz,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  primary key ("id")
);

create table if not exists public."group_missions" (
  "id" text,
  "class_session_id" text,
  "title" text,
  "group_size" text,
  "shared_artifact" text,
  "role_labels" jsonb not null default '[]'::jsonb,
  "individual_evidence" text,
  "teacher_look_for" text,
  "status" text,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  primary key ("id")
);

create table if not exists public."group_artifacts" (
  "id" text,
  "group_mission_id" text,
  "student_id" text,
  "artifact_title" text,
  "artifact_status" text,
  "individual_evidence" text,
  "submitted_at" timestamptz,
  "reviewed_at" timestamptz,
  primary key ("id")
);

create table if not exists public."teacher_interventions" (
  "id" text,
  "teacher_id" text,
  "class_session_id" text,
  "student_id" text,
  "lesson_id" text,
  "intervention_type" text,
  "summary" text,
  "status" text,
  "created_at" timestamptz,
  "resolved_at" timestamptz,
  primary key ("id")
);

create table if not exists public."school_reports" (
  "id" text,
  "school_id" text,
  "class_id" text,
  "report_type" text,
  "summary" text,
  "metrics" jsonb not null default '[]'::jsonb,
  "created_at" timestamptz,
  primary key ("id")
);

create table if not exists public."grade_bands" (
  "id" text,
  "name" text,
  "range" text,
  "purpose" text,
  "style" text,
  "target_lessons" integer,
  primary key ("id")
);

create table if not exists public."grade_levels" (
  "id" text,
  "grade_band_id" text,
  "grade" text,
  "label" text,
  "sort_order" integer,
  primary key ("id")
);

create table if not exists public."subjects" (
  "id" text,
  "title" text,
  "standards_framework_ids" jsonb not null default '[]'::jsonb,
  "created_at" timestamptz,
  primary key ("id")
);

create table if not exists public."courses" (
  "id" text,
  "grade_level_id" text,
  "subject_id" text,
  "title" text,
  "status" text,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  primary key ("id")
);

create table if not exists public."units" (
  "id" text,
  "course_id" text,
  "title" text,
  "lesson_target" integer,
  "sort_order" integer,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  primary key ("id")
);

create table if not exists public."lessons" (
  "id" text,
  "unit_id" text,
  "title" text,
  "grade_band_id" text,
  "grade_level_id" text,
  "subject_id" text,
  "estimated_minutes" integer,
  "learning_objective" text,
  "essential_question" text,
  "mastery_threshold" integer,
  "status" text,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  primary key ("id")
);

create table if not exists public."activities" (
  "id" text,
  "lesson_id" text,
  "activity_type" text,
  "title" text,
  "body" text,
  "sort_order" integer,
  "requires_group" boolean not null default false,
  "created_at" timestamptz,
  primary key ("id")
);

create table if not exists public."quizzes" (
  "id" text,
  "lesson_id" text,
  "title" text,
  "mastery_threshold" integer,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  primary key ("id")
);

create table if not exists public."quiz_questions" (
  "id" text,
  "quiz_id" text,
  "question_text" text,
  "question_type" text,
  "choices" jsonb not null default '[]'::jsonb,
  "correct_answer" text,
  "explanation" text,
  "difficulty_level" text,
  "skill_tag" text,
  "standard_tag" text,
  "sort_order" integer,
  primary key ("id")
);

create table if not exists public."quiz_attempts" (
  "id" text,
  "quiz_id" text,
  "student_id" text,
  "score" integer,
  "passed" boolean not null default false,
  "answers" jsonb not null default '[]'::jsonb,
  "attempted_at" timestamptz,
  primary key ("id")
);

create table if not exists public."lesson_progress" (
  "id" text,
  "student_id" text,
  "lesson_id" text,
  "status" text,
  "started_at" timestamptz,
  "completed_at" timestamptz,
  "last_activity_at" timestamptz,
  primary key ("id")
);

create table if not exists public."mastery_records" (
  "id" text,
  "student_id" text,
  "lesson_id" text,
  "skill_tag" text,
  "score" integer,
  "status" text,
  "attempts" integer,
  "evidence" text,
  "updated_at" timestamptz,
  primary key ("id")
);

create table if not exists public."lesson_scratchpads" (
  "id" text,
  "student_id" text,
  "lesson_id" text,
  "first_step" text,
  "explanation" text,
  "confusion" text,
  "retry_after_hint" text,
  "tutor_review_count" integer,
  "updated_at" timestamptz,
  primary key ("id")
);

create table if not exists public."interactive_skill_evidence" (
  "id" text,
  "student_id" text,
  "lesson_id" text,
  "widget_id" text,
  "skill_id" text,
  "skill_label" text,
  "status" text,
  "correct" boolean not null default false,
  "attempts" integer,
  "value" jsonb not null default '[]'::jsonb,
  "diagnosis" text,
  "recommended_support" text,
  "evidence_strength" text,
  "updated_at" timestamptz,
  primary key ("id")
);

create table if not exists public."standards" (
  "id" text,
  "name" text,
  "subjects" jsonb not null default '[]'::jsonb,
  "purpose" text,
  "source_url" text,
  "created_at" timestamptz,
  primary key ("id")
);

create table if not exists public."lesson_standards" (
  "id" text,
  "lesson_id" text,
  "standard_id" text,
  "tag" text,
  "alignment_note" text,
  primary key ("id")
);

create table if not exists public."assignments" (
  "id" text,
  "student_id" text,
  "lesson_id" text,
  "assigned_by_user_id" text,
  "title" text,
  "due_at" timestamptz,
  "status" text,
  "created_at" timestamptz,
  primary key ("id")
);

create table if not exists public."portfolio_items" (
  "id" text,
  "student_id" text,
  "lesson_id" text,
  "title" text,
  "artifact_type" text,
  "source" text,
  "visibility" text,
  "created_at" timestamptz,
  primary key ("id")
);

create table if not exists public."badges" (
  "id" text,
  "title" text,
  "category" text,
  "requirement" text,
  "created_at" timestamptz,
  primary key ("id")
);

create table if not exists public."student_badges" (
  "id" text,
  "student_id" text,
  "badge_id" text,
  "lesson_id" text,
  "earned_at" timestamptz,
  "evidence" text,
  primary key ("id")
);

create table if not exists public."reward_approvals" (
  "id" text,
  "student_id" text,
  "guardian_id" text,
  "reward_level" integer,
  "reward_title" text,
  "reward_benefit" text,
  "status" text,
  "requested_by" text,
  "requested_at" timestamptz,
  "reviewed_by" text,
  "reviewed_at" timestamptz,
  "evidence" text,
  "parent_note" text,
  "fulfillment_provider" text,
  "fulfillment_status" text,
  "fulfillment_reference" text,
  "fulfillment_requested_at" timestamptz,
  "fulfillment_completed_at" timestamptz,
  "source" text,
  primary key ("id")
);

create table if not exists public."content_drafts" (
  "id" text,
  "academy_id" text,
  "grade" text,
  "subject_id" text,
  "title" text,
  "objective" text,
  "unit_title" text,
  "standards_tags" jsonb not null default '[]'::jsonb,
  "essential_question" text,
  "student_summary" text,
  "why_it_matters" text,
  "vocabulary_terms" jsonb not null default '[]'::jsonb,
  "prerequisite_skills" jsonb not null default '[]'::jsonb,
  "lesson_sections" jsonb not null default '[]'::jsonb,
  "helper_notes" jsonb not null default '[]'::jsonb,
  "common_misunderstandings" jsonb not null default '[]'::jsonb,
  "visual_supports" jsonb not null default '[]'::jsonb,
  "quiz_questions" jsonb not null default '[]'::jsonb,
  "source_cards" jsonb not null default '[]'::jsonb,
  "group_homework" jsonb not null default '[]'::jsonb,
  "status" text,
  "blocked_reason" text,
  "review_notes" text,
  "accessibility_notes" text,
  "age_fit_notes" text,
  "lesson_body_ready" boolean not null default false,
  "teaching_completeness_status" text,
  "teaching_completeness_issues" jsonb not null default '[]'::jsonb,
  "source_lesson_id" text,
  "source_tool_call_id" text,
  "redesign_task_ids" jsonb not null default '[]'::jsonb,
  "research_source_ids" jsonb not null default '[]'::jsonb,
  "truth_score" integer,
  "truth_issues" jsonb not null default '[]'::jsonb,
  "needs_external_research" boolean not null default false,
  "truth_review_status" text,
  "latest_review" jsonb not null default '{}'::jsonb,
  "review_history" jsonb not null default '[]'::jsonb,
  "review_version" integer,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  primary key ("id")
);

create table if not exists public."content_batch_reviews" (
  "id" text,
  "source_batch_id" text,
  "academy_id" text,
  "grade_band" text,
  "grade_levels" text,
  "subjects" jsonb not null default '[]'::jsonb,
  "status" text,
  "decision" text,
  "total_lessons" text,
  "passed_lessons" text,
  "total_artifacts" text,
  "passed_artifacts" text,
  "score" integer,
  "grade" text,
  "threshold" integer,
  "passed" boolean not null default false,
  "publish_eligible" text,
  "lesson_ids" jsonb not null default '[]'::jsonb,
  "visual_asset_ids" jsonb not null default '[]'::jsonb,
  "lesson_reports" text,
  "artifact_reports" text,
  "blocking_lessons" text,
  "blockers" jsonb not null default '[]'::jsonb,
  "revision_instructions" jsonb not null default '[]'::jsonb,
  "review_history" jsonb not null default '[]'::jsonb,
  "reviewed_by_user_id" text,
  "reviewed_at" timestamptz,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  primary key ("id")
);

create table if not exists public."visual_assets" (
  "id" text,
  "lesson_id" text,
  "draft_id" text,
  "asset_kind" text,
  "placement" text,
  "subject_id" text,
  "grade" text,
  "title" text,
  "asset_url" text,
  "storage_provider" text,
  "storage_bucket" text,
  "storage_path" text,
  "storage_public_url" text,
  "storage_status" text,
  "source_prompt" text,
  "source_model" text,
  "usage" jsonb not null default '[]'::jsonb,
  "generation_metadata" jsonb not null default '[]'::jsonb,
  "review_checklist" jsonb not null default '[]'::jsonb,
  "alt_text" text,
  "caption" text,
  "license" text,
  "credit" text,
  "status" text,
  "approved_by_user_id" text,
  "approved_at" timestamptz,
  "latest_review" jsonb not null default '{}'::jsonb,
  "review_history" jsonb not null default '[]'::jsonb,
  "review_version" integer,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  primary key ("id")
);

create table if not exists public."ai_tutor_events" (
  "id" text,
  "student_id" text,
  "lesson_id" text,
  "input" text,
  "response" text,
  "analysis" text,
  "type" text,
  "mode_id" text,
  "mode_title" text,
  "strategy" text,
  "visual_hint" text,
  "first_principles_prompt" text,
  "student_feedback" text,
  "feedback_note" text,
  "helped" text,
  "quality_score" integer,
  "truth_score" integer,
  "truth_issues" jsonb not null default '[]'::jsonb,
  "needs_external_research" boolean not null default false,
  "truth_review_status" text,
  "flagged" boolean not null default false,
  "review_status" text,
  "created_at" timestamptz,
  primary key ("id")
);

create table if not exists public."agent_tool_calls" (
  "id" text,
  "tool_id" text,
  "tool_name" text,
  "owner_agent_id" text,
  "role" text,
  "status" text,
  "external_risk" text,
  "requires_human_review" boolean not null default false,
  "review_status" text,
  "payload" jsonb not null default '[]'::jsonb,
  "created_at" timestamptz,
  primary key ("id")
);

create table if not exists public."research_evidence_sources" (
  "id" text,
  "source_id" text,
  "source_name" text,
  "source_url" text,
  "source_type" text,
  "checked_at" timestamptz,
  "subject_id" text,
  "grade_band_id" text,
  "claim" text,
  "trouble_signal" text,
  "redesign_move" text,
  "status" text,
  primary key ("id")
);

create table if not exists public."lesson_redesign_tasks" (
  "id" text,
  "lesson_id" text,
  "owner_agent_id" text,
  "title" text,
  "why" text,
  "change" text,
  "source_ids" jsonb not null default '[]'::jsonb,
  "status" text,
  "review_status" text,
  "implemented_draft_id" text,
  "implemented_lesson_id" text,
  "implemented_at" timestamptz,
  "review_history" jsonb not null default '[]'::jsonb,
  "created_at" timestamptz,
  primary key ("id")
);

create table if not exists public."agent_review_items" (
  "id" text,
  "source_type" text,
  "source_id" text,
  "owner_agent_id" text,
  "priority" text,
  "status" text,
  "decision" text,
  "reviewed_by_user_id" text,
  "reviewed_at" timestamptz,
  "artifact_type" text,
  "artifact_id" text,
  "score" integer,
  "grade" text,
  "threshold" integer,
  "passed" boolean not null default false,
  "critical_blockers" jsonb not null default '[]'::jsonb,
  "blockers" jsonb not null default '[]'::jsonb,
  "revision_instructions" jsonb not null default '[]'::jsonb,
  "review_history" jsonb not null default '[]'::jsonb,
  primary key ("id")
);

create table if not exists public."audit_events" (
  "id" text,
  "actor_user_id" text,
  "event_type" text,
  "entity_type" text,
  "entity_id" text,
  "metadata" jsonb not null default '[]'::jsonb,
  "created_at" timestamptz,
  primary key ("id")
);

create table if not exists public."auth_audit_events" (
  "id" text,
  "actor_user_id" text,
  "target_user_id" text,
  "event_type" text,
  "entity_type" text,
  "entity_id" text,
  "metadata" jsonb not null default '[]'::jsonb,
  "created_at" timestamptz,
  primary key ("id")
);

create table if not exists public."consent_records" (
  "id" text,
  "student_id" text,
  "guardian_id" text,
  "data_collection" boolean not null default false,
  "ai_helper" boolean not null default false,
  "portfolio" boolean not null default false,
  "third_party_sharing" boolean not null default false,
  "consented_by" text,
  "updated_at" timestamptz,
  primary key ("id")
);

create table if not exists public."accommodations" (
  "id" text,
  "student_id" text,
  "support" text,
  "source" text,
  "created_at" timestamptz,
  primary key ("id")
);

create table if not exists public."retention_schedules" (
  "id" text,
  "student_id" text,
  "lesson_id" text,
  "skill_tag" text,
  "current_mastery" integer,
  "next_recall" text,
  "interval_days" integer,
  "recall_count" integer,
  "last_result" text,
  primary key ("id")
);

create table if not exists public."learning_events" (
  "id" text,
  "student_id" text,
  "lesson_id" text,
  "event_type" text,
  "value" jsonb not null default '[]'::jsonb,
  "occurred_at" timestamptz,
  primary key ("id")
);

create table if not exists public."experiment_runs" (
  "id" text,
  "template_id" text,
  "student_id" text,
  "lesson_id" text,
  "variant" text,
  "immediate_score" integer,
  "recall_24h" integer,
  "recall_7d" integer,
  "joy" integer,
  "frustration" integer,
  "decision" text,
  primary key ("id")
);

create table if not exists public."reward_settings" (
  "id" text,
  "guardian_id" text,
  "enabled" boolean not null default false,
  "selected_catalog_ids" jsonb not null default '[]'::jsonb,
  "family_benefits" jsonb not null default '[]'::jsonb,
  "require_delayed_recall" boolean not null default false,
  "updated_at" timestamptz,
  primary key ("id")
);

create table if not exists public."app_state_snapshots" (
  "id" text,
  "payload" jsonb not null default '[]'::jsonb,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  primary key ("id")
);

alter table public."users" add column if not exists "id" text;

alter table public."users" add column if not exists "role" text;

alter table public."users" add column if not exists "display_name" text;

alter table public."users" add column if not exists "username" text;

alter table public."users" add column if not exists "email" text;

alter table public."users" add column if not exists "email_verified" boolean not null default false;

alter table public."users" add column if not exists "auth_provider" text;

alter table public."users" add column if not exists "provider_subject" text;

alter table public."users" add column if not exists "status" text;

alter table public."users" add column if not exists "created_at" timestamptz;

alter table public."users" add column if not exists "updated_at" timestamptz;

alter table public."students" add column if not exists "id" text;

alter table public."students" add column if not exists "user_id" text;

alter table public."students" add column if not exists "academy_id" text;

alter table public."students" add column if not exists "grade_level_id" text;

alter table public."students" add column if not exists "display_name" text;

alter table public."students" add column if not exists "schedule" text;

alter table public."students" add column if not exists "status" text;

alter table public."students" add column if not exists "created_at" timestamptz;

alter table public."students" add column if not exists "updated_at" timestamptz;

alter table public."guardians" add column if not exists "id" text;

alter table public."guardians" add column if not exists "user_id" text;

alter table public."guardians" add column if not exists "preferred_report_day" text;

alter table public."guardians" add column if not exists "household_setup_complete" boolean not null default false;

alter table public."guardians" add column if not exists "created_at" timestamptz;

alter table public."guardians" add column if not exists "updated_at" timestamptz;

alter table public."student_guardians" add column if not exists "id" text;

alter table public."student_guardians" add column if not exists "student_id" text;

alter table public."student_guardians" add column if not exists "guardian_id" text;

alter table public."student_guardians" add column if not exists "relationship" text;

alter table public."student_guardians" add column if not exists "can_manage_consent" boolean not null default false;

alter table public."student_guardians" add column if not exists "created_at" timestamptz;

alter table public."account_invitations" add column if not exists "id" text;

alter table public."account_invitations" add column if not exists "email" text;

alter table public."account_invitations" add column if not exists "role" text;

alter table public."account_invitations" add column if not exists "invited_by_user_id" text;

alter table public."account_invitations" add column if not exists "target_student_id" text;

alter table public."account_invitations" add column if not exists "target_class_id" text;

alter table public."account_invitations" add column if not exists "token_hash" text;

alter table public."account_invitations" add column if not exists "status" text;

alter table public."account_invitations" add column if not exists "expires_at" timestamptz;

alter table public."account_invitations" add column if not exists "accepted_at" timestamptz;

alter table public."account_invitations" add column if not exists "created_at" timestamptz;

alter table public."guardian_student_links" add column if not exists "id" text;

alter table public."guardian_student_links" add column if not exists "guardian_id" text;

alter table public."guardian_student_links" add column if not exists "student_id" text;

alter table public."guardian_student_links" add column if not exists "relationship" text;

alter table public."guardian_student_links" add column if not exists "status" text;

alter table public."guardian_student_links" add column if not exists "requested_by_user_id" text;

alter table public."guardian_student_links" add column if not exists "approved_by_user_id" text;

alter table public."guardian_student_links" add column if not exists "created_at" timestamptz;

alter table public."guardian_student_links" add column if not exists "approved_at" timestamptz;

alter table public."guardian_student_links" add column if not exists "revoked_at" timestamptz;

alter table public."session_revocations" add column if not exists "id" text;

alter table public."session_revocations" add column if not exists "user_id" text;

alter table public."session_revocations" add column if not exists "session_id" text;

alter table public."session_revocations" add column if not exists "revoked_before" text;

alter table public."session_revocations" add column if not exists "reason" text;

alter table public."session_revocations" add column if not exists "created_at" timestamptz;

alter table public."teachers" add column if not exists "id" text;

alter table public."teachers" add column if not exists "user_id" text;

alter table public."teachers" add column if not exists "display_name" text;

alter table public."teachers" add column if not exists "organization_name" text;

alter table public."teachers" add column if not exists "created_at" timestamptz;

alter table public."teachers" add column if not exists "updated_at" timestamptz;

alter table public."schools" add column if not exists "id" text;

alter table public."schools" add column if not exists "name" text;

alter table public."schools" add column if not exists "district" text;

alter table public."schools" add column if not exists "implementation_stage" text;

alter table public."schools" add column if not exists "pilot_focus" text;

alter table public."schools" add column if not exists "status" text;

alter table public."schools" add column if not exists "created_at" timestamptz;

alter table public."schools" add column if not exists "updated_at" timestamptz;

alter table public."classes" add column if not exists "id" text;

alter table public."classes" add column if not exists "school_id" text;

alter table public."classes" add column if not exists "teacher_id" text;

alter table public."classes" add column if not exists "name" text;

alter table public."classes" add column if not exists "academy_id" text;

alter table public."classes" add column if not exists "grade_level_id" text;

alter table public."classes" add column if not exists "subject_id" text;

alter table public."classes" add column if not exists "schedule" text;

alter table public."classes" add column if not exists "status" text;

alter table public."classes" add column if not exists "created_at" timestamptz;

alter table public."classes" add column if not exists "updated_at" timestamptz;

alter table public."teacher_class_assignments" add column if not exists "id" text;

alter table public."teacher_class_assignments" add column if not exists "teacher_id" text;

alter table public."teacher_class_assignments" add column if not exists "class_id" text;

alter table public."teacher_class_assignments" add column if not exists "assigned_by_user_id" text;

alter table public."teacher_class_assignments" add column if not exists "status" text;

alter table public."teacher_class_assignments" add column if not exists "created_at" timestamptz;

alter table public."teacher_class_assignments" add column if not exists "revoked_at" timestamptz;

alter table public."enrollments" add column if not exists "id" text;

alter table public."enrollments" add column if not exists "student_id" text;

alter table public."enrollments" add column if not exists "class_id" text;

alter table public."enrollments" add column if not exists "course_id" text;

alter table public."enrollments" add column if not exists "status" text;

alter table public."enrollments" add column if not exists "started_at" timestamptz;

alter table public."enrollments" add column if not exists "ended_at" timestamptz;

alter table public."class_sessions" add column if not exists "id" text;

alter table public."class_sessions" add column if not exists "class_id" text;

alter table public."class_sessions" add column if not exists "lesson_id" text;

alter table public."class_sessions" add column if not exists "title" text;

alter table public."class_sessions" add column if not exists "status" text;

alter table public."class_sessions" add column if not exists "period_label" text;

alter table public."class_sessions" add column if not exists "duration_minutes" integer;

alter table public."class_sessions" add column if not exists "launch_goal" text;

alter table public."class_sessions" add column if not exists "steps" jsonb not null default '[]'::jsonb;

alter table public."class_sessions" add column if not exists "started_at" timestamptz;

alter table public."class_sessions" add column if not exists "ended_at" timestamptz;

alter table public."class_sessions" add column if not exists "created_at" timestamptz;

alter table public."class_sessions" add column if not exists "updated_at" timestamptz;

alter table public."group_missions" add column if not exists "id" text;

alter table public."group_missions" add column if not exists "class_session_id" text;

alter table public."group_missions" add column if not exists "title" text;

alter table public."group_missions" add column if not exists "group_size" text;

alter table public."group_missions" add column if not exists "shared_artifact" text;

alter table public."group_missions" add column if not exists "role_labels" jsonb not null default '[]'::jsonb;

alter table public."group_missions" add column if not exists "individual_evidence" text;

alter table public."group_missions" add column if not exists "teacher_look_for" text;

alter table public."group_missions" add column if not exists "status" text;

alter table public."group_missions" add column if not exists "created_at" timestamptz;

alter table public."group_missions" add column if not exists "updated_at" timestamptz;

alter table public."group_artifacts" add column if not exists "id" text;

alter table public."group_artifacts" add column if not exists "group_mission_id" text;

alter table public."group_artifacts" add column if not exists "student_id" text;

alter table public."group_artifacts" add column if not exists "artifact_title" text;

alter table public."group_artifacts" add column if not exists "artifact_status" text;

alter table public."group_artifacts" add column if not exists "individual_evidence" text;

alter table public."group_artifacts" add column if not exists "submitted_at" timestamptz;

alter table public."group_artifacts" add column if not exists "reviewed_at" timestamptz;

alter table public."teacher_interventions" add column if not exists "id" text;

alter table public."teacher_interventions" add column if not exists "teacher_id" text;

alter table public."teacher_interventions" add column if not exists "class_session_id" text;

alter table public."teacher_interventions" add column if not exists "student_id" text;

alter table public."teacher_interventions" add column if not exists "lesson_id" text;

alter table public."teacher_interventions" add column if not exists "intervention_type" text;

alter table public."teacher_interventions" add column if not exists "summary" text;

alter table public."teacher_interventions" add column if not exists "status" text;

alter table public."teacher_interventions" add column if not exists "created_at" timestamptz;

alter table public."teacher_interventions" add column if not exists "resolved_at" timestamptz;

alter table public."school_reports" add column if not exists "id" text;

alter table public."school_reports" add column if not exists "school_id" text;

alter table public."school_reports" add column if not exists "class_id" text;

alter table public."school_reports" add column if not exists "report_type" text;

alter table public."school_reports" add column if not exists "summary" text;

alter table public."school_reports" add column if not exists "metrics" jsonb not null default '[]'::jsonb;

alter table public."school_reports" add column if not exists "created_at" timestamptz;

alter table public."grade_bands" add column if not exists "id" text;

alter table public."grade_bands" add column if not exists "name" text;

alter table public."grade_bands" add column if not exists "range" text;

alter table public."grade_bands" add column if not exists "purpose" text;

alter table public."grade_bands" add column if not exists "style" text;

alter table public."grade_bands" add column if not exists "target_lessons" integer;

alter table public."grade_levels" add column if not exists "id" text;

alter table public."grade_levels" add column if not exists "grade_band_id" text;

alter table public."grade_levels" add column if not exists "grade" text;

alter table public."grade_levels" add column if not exists "label" text;

alter table public."grade_levels" add column if not exists "sort_order" integer;

alter table public."subjects" add column if not exists "id" text;

alter table public."subjects" add column if not exists "title" text;

alter table public."subjects" add column if not exists "standards_framework_ids" jsonb not null default '[]'::jsonb;

alter table public."subjects" add column if not exists "created_at" timestamptz;

alter table public."courses" add column if not exists "id" text;

alter table public."courses" add column if not exists "grade_level_id" text;

alter table public."courses" add column if not exists "subject_id" text;

alter table public."courses" add column if not exists "title" text;

alter table public."courses" add column if not exists "status" text;

alter table public."courses" add column if not exists "created_at" timestamptz;

alter table public."courses" add column if not exists "updated_at" timestamptz;

alter table public."units" add column if not exists "id" text;

alter table public."units" add column if not exists "course_id" text;

alter table public."units" add column if not exists "title" text;

alter table public."units" add column if not exists "lesson_target" integer;

alter table public."units" add column if not exists "sort_order" integer;

alter table public."units" add column if not exists "created_at" timestamptz;

alter table public."units" add column if not exists "updated_at" timestamptz;

alter table public."lessons" add column if not exists "id" text;

alter table public."lessons" add column if not exists "unit_id" text;

alter table public."lessons" add column if not exists "title" text;

alter table public."lessons" add column if not exists "grade_band_id" text;

alter table public."lessons" add column if not exists "grade_level_id" text;

alter table public."lessons" add column if not exists "subject_id" text;

alter table public."lessons" add column if not exists "estimated_minutes" integer;

alter table public."lessons" add column if not exists "learning_objective" text;

alter table public."lessons" add column if not exists "essential_question" text;

alter table public."lessons" add column if not exists "mastery_threshold" integer;

alter table public."lessons" add column if not exists "status" text;

alter table public."lessons" add column if not exists "created_at" timestamptz;

alter table public."lessons" add column if not exists "updated_at" timestamptz;

alter table public."activities" add column if not exists "id" text;

alter table public."activities" add column if not exists "lesson_id" text;

alter table public."activities" add column if not exists "activity_type" text;

alter table public."activities" add column if not exists "title" text;

alter table public."activities" add column if not exists "body" text;

alter table public."activities" add column if not exists "sort_order" integer;

alter table public."activities" add column if not exists "requires_group" boolean not null default false;

alter table public."activities" add column if not exists "created_at" timestamptz;

alter table public."quizzes" add column if not exists "id" text;

alter table public."quizzes" add column if not exists "lesson_id" text;

alter table public."quizzes" add column if not exists "title" text;

alter table public."quizzes" add column if not exists "mastery_threshold" integer;

alter table public."quizzes" add column if not exists "created_at" timestamptz;

alter table public."quizzes" add column if not exists "updated_at" timestamptz;

alter table public."quiz_questions" add column if not exists "id" text;

alter table public."quiz_questions" add column if not exists "quiz_id" text;

alter table public."quiz_questions" add column if not exists "question_text" text;

alter table public."quiz_questions" add column if not exists "question_type" text;

alter table public."quiz_questions" add column if not exists "choices" jsonb not null default '[]'::jsonb;

alter table public."quiz_questions" add column if not exists "correct_answer" text;

alter table public."quiz_questions" add column if not exists "explanation" text;

alter table public."quiz_questions" add column if not exists "difficulty_level" text;

alter table public."quiz_questions" add column if not exists "skill_tag" text;

alter table public."quiz_questions" add column if not exists "standard_tag" text;

alter table public."quiz_questions" add column if not exists "sort_order" integer;

alter table public."quiz_attempts" add column if not exists "id" text;

alter table public."quiz_attempts" add column if not exists "quiz_id" text;

alter table public."quiz_attempts" add column if not exists "student_id" text;

alter table public."quiz_attempts" add column if not exists "score" integer;

alter table public."quiz_attempts" add column if not exists "passed" boolean not null default false;

alter table public."quiz_attempts" add column if not exists "answers" jsonb not null default '[]'::jsonb;

alter table public."quiz_attempts" add column if not exists "attempted_at" timestamptz;

alter table public."lesson_progress" add column if not exists "id" text;

alter table public."lesson_progress" add column if not exists "student_id" text;

alter table public."lesson_progress" add column if not exists "lesson_id" text;

alter table public."lesson_progress" add column if not exists "status" text;

alter table public."lesson_progress" add column if not exists "started_at" timestamptz;

alter table public."lesson_progress" add column if not exists "completed_at" timestamptz;

alter table public."lesson_progress" add column if not exists "last_activity_at" timestamptz;

alter table public."mastery_records" add column if not exists "id" text;

alter table public."mastery_records" add column if not exists "student_id" text;

alter table public."mastery_records" add column if not exists "lesson_id" text;

alter table public."mastery_records" add column if not exists "skill_tag" text;

alter table public."mastery_records" add column if not exists "score" integer;

alter table public."mastery_records" add column if not exists "status" text;

alter table public."mastery_records" add column if not exists "attempts" integer;

alter table public."mastery_records" add column if not exists "evidence" text;

alter table public."mastery_records" add column if not exists "updated_at" timestamptz;

alter table public."lesson_scratchpads" add column if not exists "id" text;

alter table public."lesson_scratchpads" add column if not exists "student_id" text;

alter table public."lesson_scratchpads" add column if not exists "lesson_id" text;

alter table public."lesson_scratchpads" add column if not exists "first_step" text;

alter table public."lesson_scratchpads" add column if not exists "explanation" text;

alter table public."lesson_scratchpads" add column if not exists "confusion" text;

alter table public."lesson_scratchpads" add column if not exists "retry_after_hint" text;

alter table public."lesson_scratchpads" add column if not exists "tutor_review_count" integer;

alter table public."lesson_scratchpads" add column if not exists "updated_at" timestamptz;

alter table public."interactive_skill_evidence" add column if not exists "id" text;

alter table public."interactive_skill_evidence" add column if not exists "student_id" text;

alter table public."interactive_skill_evidence" add column if not exists "lesson_id" text;

alter table public."interactive_skill_evidence" add column if not exists "widget_id" text;

alter table public."interactive_skill_evidence" add column if not exists "skill_id" text;

alter table public."interactive_skill_evidence" add column if not exists "skill_label" text;

alter table public."interactive_skill_evidence" add column if not exists "status" text;

alter table public."interactive_skill_evidence" add column if not exists "correct" boolean not null default false;

alter table public."interactive_skill_evidence" add column if not exists "attempts" integer;

alter table public."interactive_skill_evidence" add column if not exists "value" jsonb not null default '[]'::jsonb;

alter table public."interactive_skill_evidence" add column if not exists "diagnosis" text;

alter table public."interactive_skill_evidence" add column if not exists "recommended_support" text;

alter table public."interactive_skill_evidence" add column if not exists "evidence_strength" text;

alter table public."interactive_skill_evidence" add column if not exists "updated_at" timestamptz;

alter table public."standards" add column if not exists "id" text;

alter table public."standards" add column if not exists "name" text;

alter table public."standards" add column if not exists "subjects" jsonb not null default '[]'::jsonb;

alter table public."standards" add column if not exists "purpose" text;

alter table public."standards" add column if not exists "source_url" text;

alter table public."standards" add column if not exists "created_at" timestamptz;

alter table public."lesson_standards" add column if not exists "id" text;

alter table public."lesson_standards" add column if not exists "lesson_id" text;

alter table public."lesson_standards" add column if not exists "standard_id" text;

alter table public."lesson_standards" add column if not exists "tag" text;

alter table public."lesson_standards" add column if not exists "alignment_note" text;

alter table public."assignments" add column if not exists "id" text;

alter table public."assignments" add column if not exists "student_id" text;

alter table public."assignments" add column if not exists "lesson_id" text;

alter table public."assignments" add column if not exists "assigned_by_user_id" text;

alter table public."assignments" add column if not exists "title" text;

alter table public."assignments" add column if not exists "due_at" timestamptz;

alter table public."assignments" add column if not exists "status" text;

alter table public."assignments" add column if not exists "created_at" timestamptz;

alter table public."portfolio_items" add column if not exists "id" text;

alter table public."portfolio_items" add column if not exists "student_id" text;

alter table public."portfolio_items" add column if not exists "lesson_id" text;

alter table public."portfolio_items" add column if not exists "title" text;

alter table public."portfolio_items" add column if not exists "artifact_type" text;

alter table public."portfolio_items" add column if not exists "source" text;

alter table public."portfolio_items" add column if not exists "visibility" text;

alter table public."portfolio_items" add column if not exists "created_at" timestamptz;

alter table public."badges" add column if not exists "id" text;

alter table public."badges" add column if not exists "title" text;

alter table public."badges" add column if not exists "category" text;

alter table public."badges" add column if not exists "requirement" text;

alter table public."badges" add column if not exists "created_at" timestamptz;

alter table public."student_badges" add column if not exists "id" text;

alter table public."student_badges" add column if not exists "student_id" text;

alter table public."student_badges" add column if not exists "badge_id" text;

alter table public."student_badges" add column if not exists "lesson_id" text;

alter table public."student_badges" add column if not exists "earned_at" timestamptz;

alter table public."student_badges" add column if not exists "evidence" text;

alter table public."reward_approvals" add column if not exists "id" text;

alter table public."reward_approvals" add column if not exists "student_id" text;

alter table public."reward_approvals" add column if not exists "guardian_id" text;

alter table public."reward_approvals" add column if not exists "reward_level" integer;

alter table public."reward_approvals" add column if not exists "reward_title" text;

alter table public."reward_approvals" add column if not exists "reward_benefit" text;

alter table public."reward_approvals" add column if not exists "status" text;

alter table public."reward_approvals" add column if not exists "requested_by" text;

alter table public."reward_approvals" add column if not exists "requested_at" timestamptz;

alter table public."reward_approvals" add column if not exists "reviewed_by" text;

alter table public."reward_approvals" add column if not exists "reviewed_at" timestamptz;

alter table public."reward_approvals" add column if not exists "evidence" text;

alter table public."reward_approvals" add column if not exists "parent_note" text;

alter table public."reward_approvals" add column if not exists "fulfillment_provider" text;

alter table public."reward_approvals" add column if not exists "fulfillment_status" text;

alter table public."reward_approvals" add column if not exists "fulfillment_reference" text;

alter table public."reward_approvals" add column if not exists "fulfillment_requested_at" timestamptz;

alter table public."reward_approvals" add column if not exists "fulfillment_completed_at" timestamptz;

alter table public."reward_approvals" add column if not exists "source" text;

alter table public."content_drafts" add column if not exists "id" text;

alter table public."content_drafts" add column if not exists "academy_id" text;

alter table public."content_drafts" add column if not exists "grade" text;

alter table public."content_drafts" add column if not exists "subject_id" text;

alter table public."content_drafts" add column if not exists "title" text;

alter table public."content_drafts" add column if not exists "objective" text;

alter table public."content_drafts" add column if not exists "unit_title" text;

alter table public."content_drafts" add column if not exists "standards_tags" jsonb not null default '[]'::jsonb;

alter table public."content_drafts" add column if not exists "essential_question" text;

alter table public."content_drafts" add column if not exists "student_summary" text;

alter table public."content_drafts" add column if not exists "why_it_matters" text;

alter table public."content_drafts" add column if not exists "vocabulary_terms" jsonb not null default '[]'::jsonb;

alter table public."content_drafts" add column if not exists "prerequisite_skills" jsonb not null default '[]'::jsonb;

alter table public."content_drafts" add column if not exists "lesson_sections" jsonb not null default '[]'::jsonb;

alter table public."content_drafts" add column if not exists "helper_notes" jsonb not null default '[]'::jsonb;

alter table public."content_drafts" add column if not exists "common_misunderstandings" jsonb not null default '[]'::jsonb;

alter table public."content_drafts" add column if not exists "visual_supports" jsonb not null default '[]'::jsonb;

alter table public."content_drafts" add column if not exists "quiz_questions" jsonb not null default '[]'::jsonb;

alter table public."content_drafts" add column if not exists "source_cards" jsonb not null default '[]'::jsonb;

alter table public."content_drafts" add column if not exists "group_homework" jsonb not null default '[]'::jsonb;

alter table public."content_drafts" add column if not exists "status" text;

alter table public."content_drafts" add column if not exists "blocked_reason" text;

alter table public."content_drafts" add column if not exists "review_notes" text;

alter table public."content_drafts" add column if not exists "accessibility_notes" text;

alter table public."content_drafts" add column if not exists "age_fit_notes" text;

alter table public."content_drafts" add column if not exists "lesson_body_ready" boolean not null default false;

alter table public."content_drafts" add column if not exists "teaching_completeness_status" text;

alter table public."content_drafts" add column if not exists "teaching_completeness_issues" jsonb not null default '[]'::jsonb;

alter table public."content_drafts" add column if not exists "source_lesson_id" text;

alter table public."content_drafts" add column if not exists "source_tool_call_id" text;

alter table public."content_drafts" add column if not exists "redesign_task_ids" jsonb not null default '[]'::jsonb;

alter table public."content_drafts" add column if not exists "research_source_ids" jsonb not null default '[]'::jsonb;

alter table public."content_drafts" add column if not exists "truth_score" integer;

alter table public."content_drafts" add column if not exists "truth_issues" jsonb not null default '[]'::jsonb;

alter table public."content_drafts" add column if not exists "needs_external_research" boolean not null default false;

alter table public."content_drafts" add column if not exists "truth_review_status" text;

alter table public."content_drafts" add column if not exists "latest_review" jsonb not null default '{}'::jsonb;

alter table public."content_drafts" add column if not exists "review_history" jsonb not null default '[]'::jsonb;

alter table public."content_drafts" add column if not exists "review_version" integer;

alter table public."content_drafts" add column if not exists "created_at" timestamptz;

alter table public."content_drafts" add column if not exists "updated_at" timestamptz;

alter table public."content_batch_reviews" add column if not exists "id" text;

alter table public."content_batch_reviews" add column if not exists "source_batch_id" text;

alter table public."content_batch_reviews" add column if not exists "academy_id" text;

alter table public."content_batch_reviews" add column if not exists "grade_band" text;

alter table public."content_batch_reviews" add column if not exists "grade_levels" text;

alter table public."content_batch_reviews" add column if not exists "subjects" jsonb not null default '[]'::jsonb;

alter table public."content_batch_reviews" add column if not exists "status" text;

alter table public."content_batch_reviews" add column if not exists "decision" text;

alter table public."content_batch_reviews" add column if not exists "total_lessons" text;

alter table public."content_batch_reviews" add column if not exists "passed_lessons" text;

alter table public."content_batch_reviews" add column if not exists "total_artifacts" text;

alter table public."content_batch_reviews" add column if not exists "passed_artifacts" text;

alter table public."content_batch_reviews" add column if not exists "score" integer;

alter table public."content_batch_reviews" add column if not exists "grade" text;

alter table public."content_batch_reviews" add column if not exists "threshold" integer;

alter table public."content_batch_reviews" add column if not exists "passed" boolean not null default false;

alter table public."content_batch_reviews" add column if not exists "publish_eligible" text;

alter table public."content_batch_reviews" add column if not exists "lesson_ids" jsonb not null default '[]'::jsonb;

alter table public."content_batch_reviews" add column if not exists "visual_asset_ids" jsonb not null default '[]'::jsonb;

alter table public."content_batch_reviews" add column if not exists "lesson_reports" text;

alter table public."content_batch_reviews" add column if not exists "artifact_reports" text;

alter table public."content_batch_reviews" add column if not exists "blocking_lessons" text;

alter table public."content_batch_reviews" add column if not exists "blockers" jsonb not null default '[]'::jsonb;

alter table public."content_batch_reviews" add column if not exists "revision_instructions" jsonb not null default '[]'::jsonb;

alter table public."content_batch_reviews" add column if not exists "review_history" jsonb not null default '[]'::jsonb;

alter table public."content_batch_reviews" add column if not exists "reviewed_by_user_id" text;

alter table public."content_batch_reviews" add column if not exists "reviewed_at" timestamptz;

alter table public."content_batch_reviews" add column if not exists "created_at" timestamptz;

alter table public."content_batch_reviews" add column if not exists "updated_at" timestamptz;

alter table public."visual_assets" add column if not exists "id" text;

alter table public."visual_assets" add column if not exists "lesson_id" text;

alter table public."visual_assets" add column if not exists "draft_id" text;

alter table public."visual_assets" add column if not exists "asset_kind" text;

alter table public."visual_assets" add column if not exists "placement" text;

alter table public."visual_assets" add column if not exists "subject_id" text;

alter table public."visual_assets" add column if not exists "grade" text;

alter table public."visual_assets" add column if not exists "title" text;

alter table public."visual_assets" add column if not exists "asset_url" text;

alter table public."visual_assets" add column if not exists "storage_provider" text;

alter table public."visual_assets" add column if not exists "storage_bucket" text;

alter table public."visual_assets" add column if not exists "storage_path" text;

alter table public."visual_assets" add column if not exists "storage_public_url" text;

alter table public."visual_assets" add column if not exists "storage_status" text;

alter table public."visual_assets" add column if not exists "source_prompt" text;

alter table public."visual_assets" add column if not exists "source_model" text;

alter table public."visual_assets" add column if not exists "usage" jsonb not null default '[]'::jsonb;

alter table public."visual_assets" add column if not exists "generation_metadata" jsonb not null default '[]'::jsonb;

alter table public."visual_assets" add column if not exists "review_checklist" jsonb not null default '[]'::jsonb;

alter table public."visual_assets" add column if not exists "alt_text" text;

alter table public."visual_assets" add column if not exists "caption" text;

alter table public."visual_assets" add column if not exists "license" text;

alter table public."visual_assets" add column if not exists "credit" text;

alter table public."visual_assets" add column if not exists "status" text;

alter table public."visual_assets" add column if not exists "approved_by_user_id" text;

alter table public."visual_assets" add column if not exists "approved_at" timestamptz;

alter table public."visual_assets" add column if not exists "latest_review" jsonb not null default '{}'::jsonb;

alter table public."visual_assets" add column if not exists "review_history" jsonb not null default '[]'::jsonb;

alter table public."visual_assets" add column if not exists "review_version" integer;

alter table public."visual_assets" add column if not exists "created_at" timestamptz;

alter table public."visual_assets" add column if not exists "updated_at" timestamptz;

alter table public."ai_tutor_events" add column if not exists "id" text;

alter table public."ai_tutor_events" add column if not exists "student_id" text;

alter table public."ai_tutor_events" add column if not exists "lesson_id" text;

alter table public."ai_tutor_events" add column if not exists "input" text;

alter table public."ai_tutor_events" add column if not exists "response" text;

alter table public."ai_tutor_events" add column if not exists "analysis" text;

alter table public."ai_tutor_events" add column if not exists "type" text;

alter table public."ai_tutor_events" add column if not exists "mode_id" text;

alter table public."ai_tutor_events" add column if not exists "mode_title" text;

alter table public."ai_tutor_events" add column if not exists "strategy" text;

alter table public."ai_tutor_events" add column if not exists "visual_hint" text;

alter table public."ai_tutor_events" add column if not exists "first_principles_prompt" text;

alter table public."ai_tutor_events" add column if not exists "student_feedback" text;

alter table public."ai_tutor_events" add column if not exists "feedback_note" text;

alter table public."ai_tutor_events" add column if not exists "helped" text;

alter table public."ai_tutor_events" add column if not exists "quality_score" integer;

alter table public."ai_tutor_events" add column if not exists "truth_score" integer;

alter table public."ai_tutor_events" add column if not exists "truth_issues" jsonb not null default '[]'::jsonb;

alter table public."ai_tutor_events" add column if not exists "needs_external_research" boolean not null default false;

alter table public."ai_tutor_events" add column if not exists "truth_review_status" text;

alter table public."ai_tutor_events" add column if not exists "flagged" boolean not null default false;

alter table public."ai_tutor_events" add column if not exists "review_status" text;

alter table public."ai_tutor_events" add column if not exists "created_at" timestamptz;

alter table public."agent_tool_calls" add column if not exists "id" text;

alter table public."agent_tool_calls" add column if not exists "tool_id" text;

alter table public."agent_tool_calls" add column if not exists "tool_name" text;

alter table public."agent_tool_calls" add column if not exists "owner_agent_id" text;

alter table public."agent_tool_calls" add column if not exists "role" text;

alter table public."agent_tool_calls" add column if not exists "status" text;

alter table public."agent_tool_calls" add column if not exists "external_risk" text;

alter table public."agent_tool_calls" add column if not exists "requires_human_review" boolean not null default false;

alter table public."agent_tool_calls" add column if not exists "review_status" text;

alter table public."agent_tool_calls" add column if not exists "payload" jsonb not null default '[]'::jsonb;

alter table public."agent_tool_calls" add column if not exists "created_at" timestamptz;

alter table public."research_evidence_sources" add column if not exists "id" text;

alter table public."research_evidence_sources" add column if not exists "source_id" text;

alter table public."research_evidence_sources" add column if not exists "source_name" text;

alter table public."research_evidence_sources" add column if not exists "source_url" text;

alter table public."research_evidence_sources" add column if not exists "source_type" text;

alter table public."research_evidence_sources" add column if not exists "checked_at" timestamptz;

alter table public."research_evidence_sources" add column if not exists "subject_id" text;

alter table public."research_evidence_sources" add column if not exists "grade_band_id" text;

alter table public."research_evidence_sources" add column if not exists "claim" text;

alter table public."research_evidence_sources" add column if not exists "trouble_signal" text;

alter table public."research_evidence_sources" add column if not exists "redesign_move" text;

alter table public."research_evidence_sources" add column if not exists "status" text;

alter table public."lesson_redesign_tasks" add column if not exists "id" text;

alter table public."lesson_redesign_tasks" add column if not exists "lesson_id" text;

alter table public."lesson_redesign_tasks" add column if not exists "owner_agent_id" text;

alter table public."lesson_redesign_tasks" add column if not exists "title" text;

alter table public."lesson_redesign_tasks" add column if not exists "why" text;

alter table public."lesson_redesign_tasks" add column if not exists "change" text;

alter table public."lesson_redesign_tasks" add column if not exists "source_ids" jsonb not null default '[]'::jsonb;

alter table public."lesson_redesign_tasks" add column if not exists "status" text;

alter table public."lesson_redesign_tasks" add column if not exists "review_status" text;

alter table public."lesson_redesign_tasks" add column if not exists "implemented_draft_id" text;

alter table public."lesson_redesign_tasks" add column if not exists "implemented_lesson_id" text;

alter table public."lesson_redesign_tasks" add column if not exists "implemented_at" timestamptz;

alter table public."lesson_redesign_tasks" add column if not exists "review_history" jsonb not null default '[]'::jsonb;

alter table public."lesson_redesign_tasks" add column if not exists "created_at" timestamptz;

alter table public."agent_review_items" add column if not exists "id" text;

alter table public."agent_review_items" add column if not exists "source_type" text;

alter table public."agent_review_items" add column if not exists "source_id" text;

alter table public."agent_review_items" add column if not exists "owner_agent_id" text;

alter table public."agent_review_items" add column if not exists "priority" text;

alter table public."agent_review_items" add column if not exists "status" text;

alter table public."agent_review_items" add column if not exists "decision" text;

alter table public."agent_review_items" add column if not exists "reviewed_by_user_id" text;

alter table public."agent_review_items" add column if not exists "reviewed_at" timestamptz;

alter table public."agent_review_items" add column if not exists "artifact_type" text;

alter table public."agent_review_items" add column if not exists "artifact_id" text;

alter table public."agent_review_items" add column if not exists "score" integer;

alter table public."agent_review_items" add column if not exists "grade" text;

alter table public."agent_review_items" add column if not exists "threshold" integer;

alter table public."agent_review_items" add column if not exists "passed" boolean not null default false;

alter table public."agent_review_items" add column if not exists "critical_blockers" jsonb not null default '[]'::jsonb;

alter table public."agent_review_items" add column if not exists "blockers" jsonb not null default '[]'::jsonb;

alter table public."agent_review_items" add column if not exists "revision_instructions" jsonb not null default '[]'::jsonb;

alter table public."agent_review_items" add column if not exists "review_history" jsonb not null default '[]'::jsonb;

alter table public."audit_events" add column if not exists "id" text;

alter table public."audit_events" add column if not exists "actor_user_id" text;

alter table public."audit_events" add column if not exists "event_type" text;

alter table public."audit_events" add column if not exists "entity_type" text;

alter table public."audit_events" add column if not exists "entity_id" text;

alter table public."audit_events" add column if not exists "metadata" jsonb not null default '[]'::jsonb;

alter table public."audit_events" add column if not exists "created_at" timestamptz;

alter table public."auth_audit_events" add column if not exists "id" text;

alter table public."auth_audit_events" add column if not exists "actor_user_id" text;

alter table public."auth_audit_events" add column if not exists "target_user_id" text;

alter table public."auth_audit_events" add column if not exists "event_type" text;

alter table public."auth_audit_events" add column if not exists "entity_type" text;

alter table public."auth_audit_events" add column if not exists "entity_id" text;

alter table public."auth_audit_events" add column if not exists "metadata" jsonb not null default '[]'::jsonb;

alter table public."auth_audit_events" add column if not exists "created_at" timestamptz;

alter table public."consent_records" add column if not exists "id" text;

alter table public."consent_records" add column if not exists "student_id" text;

alter table public."consent_records" add column if not exists "guardian_id" text;

alter table public."consent_records" add column if not exists "data_collection" boolean not null default false;

alter table public."consent_records" add column if not exists "ai_helper" boolean not null default false;

alter table public."consent_records" add column if not exists "portfolio" boolean not null default false;

alter table public."consent_records" add column if not exists "third_party_sharing" boolean not null default false;

alter table public."consent_records" add column if not exists "consented_by" text;

alter table public."consent_records" add column if not exists "updated_at" timestamptz;

alter table public."accommodations" add column if not exists "id" text;

alter table public."accommodations" add column if not exists "student_id" text;

alter table public."accommodations" add column if not exists "support" text;

alter table public."accommodations" add column if not exists "source" text;

alter table public."accommodations" add column if not exists "created_at" timestamptz;

alter table public."retention_schedules" add column if not exists "id" text;

alter table public."retention_schedules" add column if not exists "student_id" text;

alter table public."retention_schedules" add column if not exists "lesson_id" text;

alter table public."retention_schedules" add column if not exists "skill_tag" text;

alter table public."retention_schedules" add column if not exists "current_mastery" integer;

alter table public."retention_schedules" add column if not exists "next_recall" text;

alter table public."retention_schedules" add column if not exists "interval_days" integer;

alter table public."retention_schedules" add column if not exists "recall_count" integer;

alter table public."retention_schedules" add column if not exists "last_result" text;

alter table public."learning_events" add column if not exists "id" text;

alter table public."learning_events" add column if not exists "student_id" text;

alter table public."learning_events" add column if not exists "lesson_id" text;

alter table public."learning_events" add column if not exists "event_type" text;

alter table public."learning_events" add column if not exists "value" jsonb not null default '[]'::jsonb;

alter table public."learning_events" add column if not exists "occurred_at" timestamptz;

alter table public."experiment_runs" add column if not exists "id" text;

alter table public."experiment_runs" add column if not exists "template_id" text;

alter table public."experiment_runs" add column if not exists "student_id" text;

alter table public."experiment_runs" add column if not exists "lesson_id" text;

alter table public."experiment_runs" add column if not exists "variant" text;

alter table public."experiment_runs" add column if not exists "immediate_score" integer;

alter table public."experiment_runs" add column if not exists "recall_24h" integer;

alter table public."experiment_runs" add column if not exists "recall_7d" integer;

alter table public."experiment_runs" add column if not exists "joy" integer;

alter table public."experiment_runs" add column if not exists "frustration" integer;

alter table public."experiment_runs" add column if not exists "decision" text;

alter table public."reward_settings" add column if not exists "id" text;

alter table public."reward_settings" add column if not exists "guardian_id" text;

alter table public."reward_settings" add column if not exists "enabled" boolean not null default false;

alter table public."reward_settings" add column if not exists "selected_catalog_ids" jsonb not null default '[]'::jsonb;

alter table public."reward_settings" add column if not exists "family_benefits" jsonb not null default '[]'::jsonb;

alter table public."reward_settings" add column if not exists "require_delayed_recall" boolean not null default false;

alter table public."reward_settings" add column if not exists "updated_at" timestamptz;

alter table public."app_state_snapshots" add column if not exists "id" text;

alter table public."app_state_snapshots" add column if not exists "payload" jsonb not null default '[]'::jsonb;

alter table public."app_state_snapshots" add column if not exists "created_at" timestamptz;

alter table public."app_state_snapshots" add column if not exists "updated_at" timestamptz;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'users'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'users');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'students'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'students');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'guardians'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'guardians');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'student_guardians'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'student_guardians');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'account_invitations'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'account_invitations');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'guardian_student_links'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'guardian_student_links');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'session_revocations'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'session_revocations');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'teachers'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'teachers');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'schools'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'schools');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'classes'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'classes');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'teacher_class_assignments'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'teacher_class_assignments');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'enrollments'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'enrollments');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'class_sessions'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'class_sessions');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'group_missions'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'group_missions');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'group_artifacts'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'group_artifacts');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'teacher_interventions'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'teacher_interventions');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'school_reports'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'school_reports');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'quiz_attempts'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'quiz_attempts');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'lesson_progress'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'lesson_progress');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'mastery_records'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'mastery_records');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'lesson_scratchpads'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'lesson_scratchpads');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'interactive_skill_evidence'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'interactive_skill_evidence');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'assignments'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'assignments');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'portfolio_items'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'portfolio_items');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'student_badges'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'student_badges');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'reward_approvals'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'reward_approvals');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'content_drafts'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'content_drafts');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'content_batch_reviews'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'content_batch_reviews');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'visual_assets'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'visual_assets');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'ai_tutor_events'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'ai_tutor_events');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'agent_tool_calls'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'agent_tool_calls');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'research_evidence_sources'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'research_evidence_sources');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'lesson_redesign_tasks'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'lesson_redesign_tasks');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'agent_review_items'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'agent_review_items');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'audit_events'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'audit_events');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'auth_audit_events'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'auth_audit_events');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'consent_records'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'consent_records');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'accommodations'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'accommodations');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'retention_schedules'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'retention_schedules');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'learning_events'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'learning_events');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'experiment_runs'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'experiment_runs');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'reward_settings'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'reward_settings');
  end loop;
end $$;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'app_state_snapshots'
  loop
    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, 'app_state_snapshots');
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.users')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'users', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.students')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'students', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.guardians')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'guardians', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.student_guardians')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'student_guardians', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.account_invitations')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'account_invitations', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.guardian_student_links')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'guardian_student_links', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.session_revocations')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'session_revocations', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.teachers')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'teachers', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.schools')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'schools', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.classes')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'classes', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.teacher_class_assignments')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'teacher_class_assignments', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.enrollments')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'enrollments', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.class_sessions')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'class_sessions', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.group_missions')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'group_missions', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.group_artifacts')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'group_artifacts', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.teacher_interventions')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'teacher_interventions', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.school_reports')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'school_reports', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.grade_bands')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'grade_bands', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.grade_levels')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'grade_levels', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.subjects')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'subjects', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.courses')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'courses', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.units')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'units', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.lessons')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'lessons', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.activities')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'activities', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.quizzes')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'quizzes', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.quiz_questions')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'quiz_questions', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.quiz_attempts')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'quiz_attempts', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.lesson_progress')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'lesson_progress', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.mastery_records')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'mastery_records', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.lesson_scratchpads')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'lesson_scratchpads', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.interactive_skill_evidence')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'interactive_skill_evidence', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.standards')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'standards', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.lesson_standards')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'lesson_standards', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.assignments')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'assignments', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.portfolio_items')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'portfolio_items', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.badges')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'badges', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.student_badges')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'student_badges', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.reward_approvals')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'reward_approvals', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.content_drafts')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'content_drafts', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.content_batch_reviews')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'content_batch_reviews', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.visual_assets')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'visual_assets', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.ai_tutor_events')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'ai_tutor_events', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.agent_tool_calls')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'agent_tool_calls', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.research_evidence_sources')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'research_evidence_sources', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.lesson_redesign_tasks')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'lesson_redesign_tasks', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.agent_review_items')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'agent_review_items', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.audit_events')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'audit_events', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.auth_audit_events')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'auth_audit_events', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.consent_records')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'consent_records', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.accommodations')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'accommodations', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.retention_schedules')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'retention_schedules', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.learning_events')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'learning_events', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.experiment_runs')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'experiment_runs', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.reward_settings')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'reward_settings', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'f'
      and conrelid = to_regclass('public.app_state_snapshots')
  loop
    execute format('alter table public.%I drop constraint if exists %I', 'app_state_snapshots', existing_constraint.conname);
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."users";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.users')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'users', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.users.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."students";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.students')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'students', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.students.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."guardians";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.guardians')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'guardians', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.guardians.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."student_guardians";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.student_guardians')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'student_guardians', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.student_guardians.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."account_invitations";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.account_invitations')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'account_invitations', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.account_invitations.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."guardian_student_links";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.guardian_student_links')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'guardian_student_links', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.guardian_student_links.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."session_revocations";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.session_revocations')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'session_revocations', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.session_revocations.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."teachers";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.teachers')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'teachers', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.teachers.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."schools";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.schools')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'schools', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.schools.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."classes";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.classes')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'classes', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.classes.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."teacher_class_assignments";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.teacher_class_assignments')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'teacher_class_assignments', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.teacher_class_assignments.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."enrollments";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.enrollments')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'enrollments', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.enrollments.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."class_sessions";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.class_sessions')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'class_sessions', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.class_sessions.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."group_missions";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.group_missions')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'group_missions', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.group_missions.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."group_artifacts";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.group_artifacts')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'group_artifacts', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.group_artifacts.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."teacher_interventions";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.teacher_interventions')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'teacher_interventions', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.teacher_interventions.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."school_reports";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.school_reports')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'school_reports', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.school_reports.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."grade_bands";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.grade_bands')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'grade_bands', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.grade_bands.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."grade_levels";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.grade_levels')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'grade_levels', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.grade_levels.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."subjects";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.subjects')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'subjects', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.subjects.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."courses";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.courses')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'courses', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.courses.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."units";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.units')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'units', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.units.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."lessons";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.lessons')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'lessons', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.lessons.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."activities";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.activities')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'activities', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.activities.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."quizzes";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.quizzes')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'quizzes', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.quizzes.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."quiz_questions";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.quiz_questions')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'quiz_questions', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.quiz_questions.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."quiz_attempts";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.quiz_attempts')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'quiz_attempts', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.quiz_attempts.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."lesson_progress";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.lesson_progress')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'lesson_progress', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.lesson_progress.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."mastery_records";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.mastery_records')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'mastery_records', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.mastery_records.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."lesson_scratchpads";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.lesson_scratchpads')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'lesson_scratchpads', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.lesson_scratchpads.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."interactive_skill_evidence";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.interactive_skill_evidence')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'interactive_skill_evidence', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.interactive_skill_evidence.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."standards";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.standards')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'standards', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.standards.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."lesson_standards";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.lesson_standards')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'lesson_standards', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.lesson_standards.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."assignments";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.assignments')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'assignments', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.assignments.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."portfolio_items";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.portfolio_items')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'portfolio_items', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.portfolio_items.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."badges";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.badges')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'badges', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.badges.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."student_badges";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.student_badges')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'student_badges', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.student_badges.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."reward_approvals";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.reward_approvals')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'reward_approvals', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.reward_approvals.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."content_drafts";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.content_drafts')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'content_drafts', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.content_drafts.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."content_batch_reviews";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.content_batch_reviews')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'content_batch_reviews', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.content_batch_reviews.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."visual_assets";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.visual_assets')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'visual_assets', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.visual_assets.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."ai_tutor_events";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.ai_tutor_events')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'ai_tutor_events', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.ai_tutor_events.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."agent_tool_calls";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.agent_tool_calls')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'agent_tool_calls', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.agent_tool_calls.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."research_evidence_sources";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.research_evidence_sources')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'research_evidence_sources', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.research_evidence_sources.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."lesson_redesign_tasks";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.lesson_redesign_tasks')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'lesson_redesign_tasks', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.lesson_redesign_tasks.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."agent_review_items";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.agent_review_items')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'agent_review_items', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.agent_review_items.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."audit_events";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.audit_events')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'audit_events', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.audit_events.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."auth_audit_events";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.auth_audit_events')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'auth_audit_events', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.auth_audit_events.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."consent_records";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.consent_records')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'consent_records', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.consent_records.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."accommodations";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.accommodations')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'accommodations', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.accommodations.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."retention_schedules";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.retention_schedules')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'retention_schedules', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.retention_schedules.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."learning_events";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.learning_events')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'learning_events', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.learning_events.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."experiment_runs";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.experiment_runs')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'experiment_runs', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.experiment_runs.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."reward_settings";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.reward_settings')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'reward_settings', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.reward_settings.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  row_count bigint;
begin
  select count(*) into row_count from public."app_state_snapshots";
  for existing_constraint in
    select conname
    from pg_constraint
    where contype = 'c'
      and conrelid = to_regclass('public.app_state_snapshots')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop constraint if exists %I', 'app_state_snapshots', existing_constraint.conname);
    else
      raise exception 'Legacy check constraint public.app_state_snapshots.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.users')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'users');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.students')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'students');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.guardians')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'guardians');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.student_guardians')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'student_guardians');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.account_invitations')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'account_invitations');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.guardian_student_links')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'guardian_student_links');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.session_revocations')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'session_revocations');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.teachers')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'teachers');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.schools')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'schools');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.classes')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'classes');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.teacher_class_assignments')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'teacher_class_assignments');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.enrollments')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'enrollments');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.class_sessions')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'class_sessions');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.group_missions')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'group_missions');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.group_artifacts')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'group_artifacts');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.teacher_interventions')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'teacher_interventions');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.school_reports')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'school_reports');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.grade_bands')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'grade_bands');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.grade_levels')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'grade_levels');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.subjects')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'subjects');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.courses')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'courses');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.units')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'units');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.lessons')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'lessons');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.activities')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'activities');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.quizzes')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'quizzes');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.quiz_questions')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'quiz_questions');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.quiz_attempts')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'quiz_attempts');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.lesson_progress')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'lesson_progress');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.mastery_records')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'mastery_records');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.lesson_scratchpads')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'lesson_scratchpads');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.interactive_skill_evidence')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'interactive_skill_evidence');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.standards')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'standards');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.lesson_standards')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'lesson_standards');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.assignments')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'assignments');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.portfolio_items')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'portfolio_items');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.badges')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'badges');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.student_badges')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'student_badges');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.reward_approvals')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'reward_approvals');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.content_drafts')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'content_drafts');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.content_batch_reviews')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'content_batch_reviews');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.visual_assets')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'visual_assets');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.ai_tutor_events')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'ai_tutor_events');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.agent_tool_calls')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'agent_tool_calls');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.research_evidence_sources')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'research_evidence_sources');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.lesson_redesign_tasks')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'lesson_redesign_tasks');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.agent_review_items')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'agent_review_items');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.audit_events')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'audit_events');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.auth_audit_events')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'auth_audit_events');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.consent_records')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'consent_records');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.accommodations')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'accommodations');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.retention_schedules')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'retention_schedules');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.learning_events')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'learning_events');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.experiment_runs')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'experiment_runs');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.reward_settings')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'reward_settings');
  end loop;
end $$;

do $$
declare
  existing_trigger record;
begin
  for existing_trigger in
    select tgname
    from pg_trigger
    where tgrelid = to_regclass('public.app_state_snapshots')
      and not tgisinternal
  loop
    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, 'app_state_snapshots');
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.users')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.users cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.students')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.students cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.guardians')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.guardians cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.student_guardians')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.student_guardians cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.account_invitations')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.account_invitations cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.guardian_student_links')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.guardian_student_links cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.session_revocations')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.session_revocations cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.teachers')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.teachers cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.schools')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.schools cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.classes')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.classes cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.teacher_class_assignments')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.teacher_class_assignments cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.enrollments')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.enrollments cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.class_sessions')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.class_sessions cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.group_missions')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.group_missions cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.group_artifacts')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.group_artifacts cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.teacher_interventions')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.teacher_interventions cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.school_reports')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.school_reports cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.grade_bands')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.grade_bands cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.grade_levels')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.grade_levels cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.subjects')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.subjects cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.courses')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.courses cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.units')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.units cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.lessons')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.lessons cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.activities')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.activities cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.quizzes')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.quizzes cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.quiz_questions')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.quiz_questions cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.quiz_attempts')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.quiz_attempts cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.lesson_progress')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.lesson_progress cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.mastery_records')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.mastery_records cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.lesson_scratchpads')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.lesson_scratchpads cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.interactive_skill_evidence')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.interactive_skill_evidence cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.standards')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.standards cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.lesson_standards')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.lesson_standards cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.assignments')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.assignments cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.portfolio_items')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.portfolio_items cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.badges')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.badges cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.student_badges')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.student_badges cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.reward_approvals')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.reward_approvals cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.content_drafts')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.content_drafts cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.content_batch_reviews')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.content_batch_reviews cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.visual_assets')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.visual_assets cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.ai_tutor_events')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.ai_tutor_events cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.agent_tool_calls')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.agent_tool_calls cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.research_evidence_sources')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.research_evidence_sources cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.lesson_redesign_tasks')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.lesson_redesign_tasks cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.agent_review_items')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.agent_review_items cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.audit_events')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.audit_events cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.auth_audit_events')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.auth_audit_events cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.consent_records')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.consent_records cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.accommodations')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.accommodations cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.retention_schedules')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.retention_schedules cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.learning_events')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.learning_events cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.experiment_runs')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.experiment_runs cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.reward_settings')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.reward_settings cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  existing_constraint record;
  child_rows bigint;
begin
  for existing_constraint in
    select con.conname, child_ns.nspname as child_schema, child.relname as child_table
    from pg_constraint con
    join pg_class child on child.oid = con.conrelid
    join pg_namespace child_ns on child_ns.oid = child.relnamespace
    where con.contype = 'f'
      and child_ns.nspname = 'public'
      and con.confrelid = to_regclass('public.app_state_snapshots')
  loop
    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;
    if child_rows = 0 then
      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);
    else
      raise exception 'Inbound foreign key %.% on public.app_state_snapshots cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."users";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'users'
      and column_name not in ('id', 'role', 'display_name', 'username', 'email', 'email_verified', 'auth_provider', 'provider_subject', 'status', 'created_at', 'updated_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'users', legacy_column.column_name);
    else
      raise exception 'Legacy column public.users.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."students";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'students'
      and column_name not in ('id', 'user_id', 'academy_id', 'grade_level_id', 'display_name', 'schedule', 'status', 'created_at', 'updated_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'students', legacy_column.column_name);
    else
      raise exception 'Legacy column public.students.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."guardians";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'guardians'
      and column_name not in ('id', 'user_id', 'preferred_report_day', 'household_setup_complete', 'created_at', 'updated_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'guardians', legacy_column.column_name);
    else
      raise exception 'Legacy column public.guardians.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."student_guardians";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'student_guardians'
      and column_name not in ('id', 'student_id', 'guardian_id', 'relationship', 'can_manage_consent', 'created_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'student_guardians', legacy_column.column_name);
    else
      raise exception 'Legacy column public.student_guardians.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."account_invitations";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'account_invitations'
      and column_name not in ('id', 'email', 'role', 'invited_by_user_id', 'target_student_id', 'target_class_id', 'token_hash', 'status', 'expires_at', 'accepted_at', 'created_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'account_invitations', legacy_column.column_name);
    else
      raise exception 'Legacy column public.account_invitations.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."guardian_student_links";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'guardian_student_links'
      and column_name not in ('id', 'guardian_id', 'student_id', 'relationship', 'status', 'requested_by_user_id', 'approved_by_user_id', 'created_at', 'approved_at', 'revoked_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'guardian_student_links', legacy_column.column_name);
    else
      raise exception 'Legacy column public.guardian_student_links.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."session_revocations";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'session_revocations'
      and column_name not in ('id', 'user_id', 'session_id', 'revoked_before', 'reason', 'created_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'session_revocations', legacy_column.column_name);
    else
      raise exception 'Legacy column public.session_revocations.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."teachers";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'teachers'
      and column_name not in ('id', 'user_id', 'display_name', 'organization_name', 'created_at', 'updated_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'teachers', legacy_column.column_name);
    else
      raise exception 'Legacy column public.teachers.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."schools";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'schools'
      and column_name not in ('id', 'name', 'district', 'implementation_stage', 'pilot_focus', 'status', 'created_at', 'updated_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'schools', legacy_column.column_name);
    else
      raise exception 'Legacy column public.schools.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."classes";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'classes'
      and column_name not in ('id', 'school_id', 'teacher_id', 'name', 'academy_id', 'grade_level_id', 'subject_id', 'schedule', 'status', 'created_at', 'updated_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'classes', legacy_column.column_name);
    else
      raise exception 'Legacy column public.classes.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."teacher_class_assignments";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'teacher_class_assignments'
      and column_name not in ('id', 'teacher_id', 'class_id', 'assigned_by_user_id', 'status', 'created_at', 'revoked_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'teacher_class_assignments', legacy_column.column_name);
    else
      raise exception 'Legacy column public.teacher_class_assignments.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."enrollments";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'enrollments'
      and column_name not in ('id', 'student_id', 'class_id', 'course_id', 'status', 'started_at', 'ended_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'enrollments', legacy_column.column_name);
    else
      raise exception 'Legacy column public.enrollments.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."class_sessions";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'class_sessions'
      and column_name not in ('id', 'class_id', 'lesson_id', 'title', 'status', 'period_label', 'duration_minutes', 'launch_goal', 'steps', 'started_at', 'ended_at', 'created_at', 'updated_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'class_sessions', legacy_column.column_name);
    else
      raise exception 'Legacy column public.class_sessions.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."group_missions";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'group_missions'
      and column_name not in ('id', 'class_session_id', 'title', 'group_size', 'shared_artifact', 'role_labels', 'individual_evidence', 'teacher_look_for', 'status', 'created_at', 'updated_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'group_missions', legacy_column.column_name);
    else
      raise exception 'Legacy column public.group_missions.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."group_artifacts";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'group_artifacts'
      and column_name not in ('id', 'group_mission_id', 'student_id', 'artifact_title', 'artifact_status', 'individual_evidence', 'submitted_at', 'reviewed_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'group_artifacts', legacy_column.column_name);
    else
      raise exception 'Legacy column public.group_artifacts.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."teacher_interventions";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'teacher_interventions'
      and column_name not in ('id', 'teacher_id', 'class_session_id', 'student_id', 'lesson_id', 'intervention_type', 'summary', 'status', 'created_at', 'resolved_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'teacher_interventions', legacy_column.column_name);
    else
      raise exception 'Legacy column public.teacher_interventions.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."school_reports";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'school_reports'
      and column_name not in ('id', 'school_id', 'class_id', 'report_type', 'summary', 'metrics', 'created_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'school_reports', legacy_column.column_name);
    else
      raise exception 'Legacy column public.school_reports.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."grade_bands";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'grade_bands'
      and column_name not in ('id', 'name', 'range', 'purpose', 'style', 'target_lessons')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'grade_bands', legacy_column.column_name);
    else
      raise exception 'Legacy column public.grade_bands.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."grade_levels";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'grade_levels'
      and column_name not in ('id', 'grade_band_id', 'grade', 'label', 'sort_order')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'grade_levels', legacy_column.column_name);
    else
      raise exception 'Legacy column public.grade_levels.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."subjects";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'subjects'
      and column_name not in ('id', 'title', 'standards_framework_ids', 'created_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'subjects', legacy_column.column_name);
    else
      raise exception 'Legacy column public.subjects.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."courses";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'courses'
      and column_name not in ('id', 'grade_level_id', 'subject_id', 'title', 'status', 'created_at', 'updated_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'courses', legacy_column.column_name);
    else
      raise exception 'Legacy column public.courses.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."units";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'units'
      and column_name not in ('id', 'course_id', 'title', 'lesson_target', 'sort_order', 'created_at', 'updated_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'units', legacy_column.column_name);
    else
      raise exception 'Legacy column public.units.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."lessons";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'lessons'
      and column_name not in ('id', 'unit_id', 'title', 'grade_band_id', 'grade_level_id', 'subject_id', 'estimated_minutes', 'learning_objective', 'essential_question', 'mastery_threshold', 'status', 'created_at', 'updated_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'lessons', legacy_column.column_name);
    else
      raise exception 'Legacy column public.lessons.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."activities";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'activities'
      and column_name not in ('id', 'lesson_id', 'activity_type', 'title', 'body', 'sort_order', 'requires_group', 'created_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'activities', legacy_column.column_name);
    else
      raise exception 'Legacy column public.activities.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."quizzes";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'quizzes'
      and column_name not in ('id', 'lesson_id', 'title', 'mastery_threshold', 'created_at', 'updated_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'quizzes', legacy_column.column_name);
    else
      raise exception 'Legacy column public.quizzes.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."quiz_questions";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'quiz_questions'
      and column_name not in ('id', 'quiz_id', 'question_text', 'question_type', 'choices', 'correct_answer', 'explanation', 'difficulty_level', 'skill_tag', 'standard_tag', 'sort_order')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'quiz_questions', legacy_column.column_name);
    else
      raise exception 'Legacy column public.quiz_questions.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."quiz_attempts";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'quiz_attempts'
      and column_name not in ('id', 'quiz_id', 'student_id', 'score', 'passed', 'answers', 'attempted_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'quiz_attempts', legacy_column.column_name);
    else
      raise exception 'Legacy column public.quiz_attempts.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."lesson_progress";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'lesson_progress'
      and column_name not in ('id', 'student_id', 'lesson_id', 'status', 'started_at', 'completed_at', 'last_activity_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'lesson_progress', legacy_column.column_name);
    else
      raise exception 'Legacy column public.lesson_progress.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."mastery_records";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'mastery_records'
      and column_name not in ('id', 'student_id', 'lesson_id', 'skill_tag', 'score', 'status', 'attempts', 'evidence', 'updated_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'mastery_records', legacy_column.column_name);
    else
      raise exception 'Legacy column public.mastery_records.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."lesson_scratchpads";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'lesson_scratchpads'
      and column_name not in ('id', 'student_id', 'lesson_id', 'first_step', 'explanation', 'confusion', 'retry_after_hint', 'tutor_review_count', 'updated_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'lesson_scratchpads', legacy_column.column_name);
    else
      raise exception 'Legacy column public.lesson_scratchpads.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."interactive_skill_evidence";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'interactive_skill_evidence'
      and column_name not in ('id', 'student_id', 'lesson_id', 'widget_id', 'skill_id', 'skill_label', 'status', 'correct', 'attempts', 'value', 'diagnosis', 'recommended_support', 'evidence_strength', 'updated_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'interactive_skill_evidence', legacy_column.column_name);
    else
      raise exception 'Legacy column public.interactive_skill_evidence.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."standards";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'standards'
      and column_name not in ('id', 'name', 'subjects', 'purpose', 'source_url', 'created_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'standards', legacy_column.column_name);
    else
      raise exception 'Legacy column public.standards.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."lesson_standards";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'lesson_standards'
      and column_name not in ('id', 'lesson_id', 'standard_id', 'tag', 'alignment_note')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'lesson_standards', legacy_column.column_name);
    else
      raise exception 'Legacy column public.lesson_standards.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."assignments";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'assignments'
      and column_name not in ('id', 'student_id', 'lesson_id', 'assigned_by_user_id', 'title', 'due_at', 'status', 'created_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'assignments', legacy_column.column_name);
    else
      raise exception 'Legacy column public.assignments.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."portfolio_items";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'portfolio_items'
      and column_name not in ('id', 'student_id', 'lesson_id', 'title', 'artifact_type', 'source', 'visibility', 'created_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'portfolio_items', legacy_column.column_name);
    else
      raise exception 'Legacy column public.portfolio_items.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."badges";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'badges'
      and column_name not in ('id', 'title', 'category', 'requirement', 'created_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'badges', legacy_column.column_name);
    else
      raise exception 'Legacy column public.badges.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."student_badges";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'student_badges'
      and column_name not in ('id', 'student_id', 'badge_id', 'lesson_id', 'earned_at', 'evidence')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'student_badges', legacy_column.column_name);
    else
      raise exception 'Legacy column public.student_badges.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."reward_approvals";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'reward_approvals'
      and column_name not in ('id', 'student_id', 'guardian_id', 'reward_level', 'reward_title', 'reward_benefit', 'status', 'requested_by', 'requested_at', 'reviewed_by', 'reviewed_at', 'evidence', 'parent_note', 'fulfillment_provider', 'fulfillment_status', 'fulfillment_reference', 'fulfillment_requested_at', 'fulfillment_completed_at', 'source')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'reward_approvals', legacy_column.column_name);
    else
      raise exception 'Legacy column public.reward_approvals.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."content_drafts";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'content_drafts'
      and column_name not in ('id', 'academy_id', 'grade', 'subject_id', 'title', 'objective', 'unit_title', 'standards_tags', 'essential_question', 'student_summary', 'why_it_matters', 'vocabulary_terms', 'prerequisite_skills', 'lesson_sections', 'helper_notes', 'common_misunderstandings', 'visual_supports', 'quiz_questions', 'source_cards', 'group_homework', 'status', 'blocked_reason', 'review_notes', 'accessibility_notes', 'age_fit_notes', 'lesson_body_ready', 'teaching_completeness_status', 'teaching_completeness_issues', 'source_lesson_id', 'source_tool_call_id', 'redesign_task_ids', 'research_source_ids', 'truth_score', 'truth_issues', 'needs_external_research', 'truth_review_status', 'latest_review', 'review_history', 'review_version', 'created_at', 'updated_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'content_drafts', legacy_column.column_name);
    else
      raise exception 'Legacy column public.content_drafts.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."content_batch_reviews";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'content_batch_reviews'
      and column_name not in ('id', 'source_batch_id', 'academy_id', 'grade_band', 'grade_levels', 'subjects', 'status', 'decision', 'total_lessons', 'passed_lessons', 'total_artifacts', 'passed_artifacts', 'score', 'grade', 'threshold', 'passed', 'publish_eligible', 'lesson_ids', 'visual_asset_ids', 'lesson_reports', 'artifact_reports', 'blocking_lessons', 'blockers', 'revision_instructions', 'review_history', 'reviewed_by_user_id', 'reviewed_at', 'created_at', 'updated_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'content_batch_reviews', legacy_column.column_name);
    else
      raise exception 'Legacy column public.content_batch_reviews.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."visual_assets";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'visual_assets'
      and column_name not in ('id', 'lesson_id', 'draft_id', 'asset_kind', 'placement', 'subject_id', 'grade', 'title', 'asset_url', 'storage_provider', 'storage_bucket', 'storage_path', 'storage_public_url', 'storage_status', 'source_prompt', 'source_model', 'usage', 'generation_metadata', 'review_checklist', 'alt_text', 'caption', 'license', 'credit', 'status', 'approved_by_user_id', 'approved_at', 'latest_review', 'review_history', 'review_version', 'created_at', 'updated_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'visual_assets', legacy_column.column_name);
    else
      raise exception 'Legacy column public.visual_assets.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."ai_tutor_events";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'ai_tutor_events'
      and column_name not in ('id', 'student_id', 'lesson_id', 'input', 'response', 'analysis', 'type', 'mode_id', 'mode_title', 'strategy', 'visual_hint', 'first_principles_prompt', 'student_feedback', 'feedback_note', 'helped', 'quality_score', 'truth_score', 'truth_issues', 'needs_external_research', 'truth_review_status', 'flagged', 'review_status', 'created_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'ai_tutor_events', legacy_column.column_name);
    else
      raise exception 'Legacy column public.ai_tutor_events.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."agent_tool_calls";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'agent_tool_calls'
      and column_name not in ('id', 'tool_id', 'tool_name', 'owner_agent_id', 'role', 'status', 'external_risk', 'requires_human_review', 'review_status', 'payload', 'created_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'agent_tool_calls', legacy_column.column_name);
    else
      raise exception 'Legacy column public.agent_tool_calls.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."research_evidence_sources";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'research_evidence_sources'
      and column_name not in ('id', 'source_id', 'source_name', 'source_url', 'source_type', 'checked_at', 'subject_id', 'grade_band_id', 'claim', 'trouble_signal', 'redesign_move', 'status')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'research_evidence_sources', legacy_column.column_name);
    else
      raise exception 'Legacy column public.research_evidence_sources.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."lesson_redesign_tasks";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'lesson_redesign_tasks'
      and column_name not in ('id', 'lesson_id', 'owner_agent_id', 'title', 'why', 'change', 'source_ids', 'status', 'review_status', 'implemented_draft_id', 'implemented_lesson_id', 'implemented_at', 'review_history', 'created_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'lesson_redesign_tasks', legacy_column.column_name);
    else
      raise exception 'Legacy column public.lesson_redesign_tasks.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."agent_review_items";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'agent_review_items'
      and column_name not in ('id', 'source_type', 'source_id', 'owner_agent_id', 'priority', 'status', 'decision', 'reviewed_by_user_id', 'reviewed_at', 'artifact_type', 'artifact_id', 'score', 'grade', 'threshold', 'passed', 'critical_blockers', 'blockers', 'revision_instructions', 'review_history')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'agent_review_items', legacy_column.column_name);
    else
      raise exception 'Legacy column public.agent_review_items.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."audit_events";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'audit_events'
      and column_name not in ('id', 'actor_user_id', 'event_type', 'entity_type', 'entity_id', 'metadata', 'created_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'audit_events', legacy_column.column_name);
    else
      raise exception 'Legacy column public.audit_events.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."auth_audit_events";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'auth_audit_events'
      and column_name not in ('id', 'actor_user_id', 'target_user_id', 'event_type', 'entity_type', 'entity_id', 'metadata', 'created_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'auth_audit_events', legacy_column.column_name);
    else
      raise exception 'Legacy column public.auth_audit_events.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."consent_records";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'consent_records'
      and column_name not in ('id', 'student_id', 'guardian_id', 'data_collection', 'ai_helper', 'portfolio', 'third_party_sharing', 'consented_by', 'updated_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'consent_records', legacy_column.column_name);
    else
      raise exception 'Legacy column public.consent_records.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."accommodations";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'accommodations'
      and column_name not in ('id', 'student_id', 'support', 'source', 'created_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'accommodations', legacy_column.column_name);
    else
      raise exception 'Legacy column public.accommodations.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."retention_schedules";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'retention_schedules'
      and column_name not in ('id', 'student_id', 'lesson_id', 'skill_tag', 'current_mastery', 'next_recall', 'interval_days', 'recall_count', 'last_result')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'retention_schedules', legacy_column.column_name);
    else
      raise exception 'Legacy column public.retention_schedules.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."learning_events";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'learning_events'
      and column_name not in ('id', 'student_id', 'lesson_id', 'event_type', 'value', 'occurred_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'learning_events', legacy_column.column_name);
    else
      raise exception 'Legacy column public.learning_events.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."experiment_runs";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'experiment_runs'
      and column_name not in ('id', 'template_id', 'student_id', 'lesson_id', 'variant', 'immediate_score', 'recall_24h', 'recall_7d', 'joy', 'frustration', 'decision')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'experiment_runs', legacy_column.column_name);
    else
      raise exception 'Legacy column public.experiment_runs.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."reward_settings";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'reward_settings'
      and column_name not in ('id', 'guardian_id', 'enabled', 'selected_catalog_ids', 'family_benefits', 'require_delayed_recall', 'updated_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'reward_settings', legacy_column.column_name);
    else
      raise exception 'Legacy column public.reward_settings.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  legacy_column record;
  row_count bigint;
begin
  select count(*) into row_count from public."app_state_snapshots";
  for legacy_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'app_state_snapshots'
      and column_name not in ('id', 'payload', 'created_at', 'updated_at')
  loop
    if row_count = 0 then
      execute format('alter table public.%I drop column if exists %I', 'app_state_snapshots', legacy_column.column_name);
    else
      raise exception 'Legacy column public.app_state_snapshots.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;
    end if;
  end loop;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'users'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."users";
    if row_count = 0 then
      alter table public."users" alter column "id" drop default;
      alter table public."users" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.users.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'users'
    and c.column_name = 'role';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."users";
    if row_count = 0 then
      alter table public."users" alter column "role" drop default;
      alter table public."users" alter column "role" type text using "role"::text;
    else
      raise exception 'Column public.users.role has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'users'
    and c.column_name = 'display_name';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."users";
    if row_count = 0 then
      alter table public."users" alter column "display_name" drop default;
      alter table public."users" alter column "display_name" type text using "display_name"::text;
    else
      raise exception 'Column public.users.display_name has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'users'
    and c.column_name = 'username';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."users";
    if row_count = 0 then
      alter table public."users" alter column "username" drop default;
      alter table public."users" alter column "username" type text using "username"::text;
    else
      raise exception 'Column public.users.username has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'users'
    and c.column_name = 'email';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."users";
    if row_count = 0 then
      alter table public."users" alter column "email" drop default;
      alter table public."users" alter column "email" type text using "email"::text;
    else
      raise exception 'Column public.users.email has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'users'
    and c.column_name = 'email_verified';
  if actual_type is not null and actual_type <> 'bool' then
    select count(*) into row_count from public."users";
    if row_count = 0 then
      alter table public."users" alter column "email_verified" drop default;
      alter table public."users" alter column "email_verified" type boolean using "email_verified"::boolean;
  alter table public."users" alter column "email_verified" set default false;
    else
      raise exception 'Column public.users.email_verified has type %, expected bool, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'users'
    and c.column_name = 'auth_provider';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."users";
    if row_count = 0 then
      alter table public."users" alter column "auth_provider" drop default;
      alter table public."users" alter column "auth_provider" type text using "auth_provider"::text;
    else
      raise exception 'Column public.users.auth_provider has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'users'
    and c.column_name = 'provider_subject';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."users";
    if row_count = 0 then
      alter table public."users" alter column "provider_subject" drop default;
      alter table public."users" alter column "provider_subject" type text using "provider_subject"::text;
    else
      raise exception 'Column public.users.provider_subject has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'users'
    and c.column_name = 'status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."users";
    if row_count = 0 then
      alter table public."users" alter column "status" drop default;
      alter table public."users" alter column "status" type text using "status"::text;
    else
      raise exception 'Column public.users.status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'users'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."users";
    if row_count = 0 then
      alter table public."users" alter column "created_at" drop default;
      alter table public."users" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.users.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'users'
    and c.column_name = 'updated_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."users";
    if row_count = 0 then
      alter table public."users" alter column "updated_at" drop default;
      alter table public."users" alter column "updated_at" type timestamptz using "updated_at"::timestamptz;
    else
      raise exception 'Column public.users.updated_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'students'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."students";
    if row_count = 0 then
      alter table public."students" alter column "id" drop default;
      alter table public."students" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.students.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'students'
    and c.column_name = 'user_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."students";
    if row_count = 0 then
      alter table public."students" alter column "user_id" drop default;
      alter table public."students" alter column "user_id" type text using "user_id"::text;
    else
      raise exception 'Column public.students.user_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'students'
    and c.column_name = 'academy_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."students";
    if row_count = 0 then
      alter table public."students" alter column "academy_id" drop default;
      alter table public."students" alter column "academy_id" type text using "academy_id"::text;
    else
      raise exception 'Column public.students.academy_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'students'
    and c.column_name = 'grade_level_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."students";
    if row_count = 0 then
      alter table public."students" alter column "grade_level_id" drop default;
      alter table public."students" alter column "grade_level_id" type text using "grade_level_id"::text;
    else
      raise exception 'Column public.students.grade_level_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'students'
    and c.column_name = 'display_name';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."students";
    if row_count = 0 then
      alter table public."students" alter column "display_name" drop default;
      alter table public."students" alter column "display_name" type text using "display_name"::text;
    else
      raise exception 'Column public.students.display_name has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'students'
    and c.column_name = 'schedule';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."students";
    if row_count = 0 then
      alter table public."students" alter column "schedule" drop default;
      alter table public."students" alter column "schedule" type text using "schedule"::text;
    else
      raise exception 'Column public.students.schedule has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'students'
    and c.column_name = 'status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."students";
    if row_count = 0 then
      alter table public."students" alter column "status" drop default;
      alter table public."students" alter column "status" type text using "status"::text;
    else
      raise exception 'Column public.students.status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'students'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."students";
    if row_count = 0 then
      alter table public."students" alter column "created_at" drop default;
      alter table public."students" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.students.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'students'
    and c.column_name = 'updated_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."students";
    if row_count = 0 then
      alter table public."students" alter column "updated_at" drop default;
      alter table public."students" alter column "updated_at" type timestamptz using "updated_at"::timestamptz;
    else
      raise exception 'Column public.students.updated_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'guardians'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."guardians";
    if row_count = 0 then
      alter table public."guardians" alter column "id" drop default;
      alter table public."guardians" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.guardians.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'guardians'
    and c.column_name = 'user_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."guardians";
    if row_count = 0 then
      alter table public."guardians" alter column "user_id" drop default;
      alter table public."guardians" alter column "user_id" type text using "user_id"::text;
    else
      raise exception 'Column public.guardians.user_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'guardians'
    and c.column_name = 'preferred_report_day';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."guardians";
    if row_count = 0 then
      alter table public."guardians" alter column "preferred_report_day" drop default;
      alter table public."guardians" alter column "preferred_report_day" type text using "preferred_report_day"::text;
    else
      raise exception 'Column public.guardians.preferred_report_day has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'guardians'
    and c.column_name = 'household_setup_complete';
  if actual_type is not null and actual_type <> 'bool' then
    select count(*) into row_count from public."guardians";
    if row_count = 0 then
      alter table public."guardians" alter column "household_setup_complete" drop default;
      alter table public."guardians" alter column "household_setup_complete" type boolean using "household_setup_complete"::boolean;
  alter table public."guardians" alter column "household_setup_complete" set default false;
    else
      raise exception 'Column public.guardians.household_setup_complete has type %, expected bool, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'guardians'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."guardians";
    if row_count = 0 then
      alter table public."guardians" alter column "created_at" drop default;
      alter table public."guardians" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.guardians.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'guardians'
    and c.column_name = 'updated_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."guardians";
    if row_count = 0 then
      alter table public."guardians" alter column "updated_at" drop default;
      alter table public."guardians" alter column "updated_at" type timestamptz using "updated_at"::timestamptz;
    else
      raise exception 'Column public.guardians.updated_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'student_guardians'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."student_guardians";
    if row_count = 0 then
      alter table public."student_guardians" alter column "id" drop default;
      alter table public."student_guardians" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.student_guardians.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'student_guardians'
    and c.column_name = 'student_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."student_guardians";
    if row_count = 0 then
      alter table public."student_guardians" alter column "student_id" drop default;
      alter table public."student_guardians" alter column "student_id" type text using "student_id"::text;
    else
      raise exception 'Column public.student_guardians.student_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'student_guardians'
    and c.column_name = 'guardian_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."student_guardians";
    if row_count = 0 then
      alter table public."student_guardians" alter column "guardian_id" drop default;
      alter table public."student_guardians" alter column "guardian_id" type text using "guardian_id"::text;
    else
      raise exception 'Column public.student_guardians.guardian_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'student_guardians'
    and c.column_name = 'relationship';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."student_guardians";
    if row_count = 0 then
      alter table public."student_guardians" alter column "relationship" drop default;
      alter table public."student_guardians" alter column "relationship" type text using "relationship"::text;
    else
      raise exception 'Column public.student_guardians.relationship has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'student_guardians'
    and c.column_name = 'can_manage_consent';
  if actual_type is not null and actual_type <> 'bool' then
    select count(*) into row_count from public."student_guardians";
    if row_count = 0 then
      alter table public."student_guardians" alter column "can_manage_consent" drop default;
      alter table public."student_guardians" alter column "can_manage_consent" type boolean using "can_manage_consent"::boolean;
  alter table public."student_guardians" alter column "can_manage_consent" set default false;
    else
      raise exception 'Column public.student_guardians.can_manage_consent has type %, expected bool, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'student_guardians'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."student_guardians";
    if row_count = 0 then
      alter table public."student_guardians" alter column "created_at" drop default;
      alter table public."student_guardians" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.student_guardians.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'account_invitations'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."account_invitations";
    if row_count = 0 then
      alter table public."account_invitations" alter column "id" drop default;
      alter table public."account_invitations" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.account_invitations.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'account_invitations'
    and c.column_name = 'email';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."account_invitations";
    if row_count = 0 then
      alter table public."account_invitations" alter column "email" drop default;
      alter table public."account_invitations" alter column "email" type text using "email"::text;
    else
      raise exception 'Column public.account_invitations.email has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'account_invitations'
    and c.column_name = 'role';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."account_invitations";
    if row_count = 0 then
      alter table public."account_invitations" alter column "role" drop default;
      alter table public."account_invitations" alter column "role" type text using "role"::text;
    else
      raise exception 'Column public.account_invitations.role has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'account_invitations'
    and c.column_name = 'invited_by_user_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."account_invitations";
    if row_count = 0 then
      alter table public."account_invitations" alter column "invited_by_user_id" drop default;
      alter table public."account_invitations" alter column "invited_by_user_id" type text using "invited_by_user_id"::text;
    else
      raise exception 'Column public.account_invitations.invited_by_user_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'account_invitations'
    and c.column_name = 'target_student_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."account_invitations";
    if row_count = 0 then
      alter table public."account_invitations" alter column "target_student_id" drop default;
      alter table public."account_invitations" alter column "target_student_id" type text using "target_student_id"::text;
    else
      raise exception 'Column public.account_invitations.target_student_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'account_invitations'
    and c.column_name = 'target_class_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."account_invitations";
    if row_count = 0 then
      alter table public."account_invitations" alter column "target_class_id" drop default;
      alter table public."account_invitations" alter column "target_class_id" type text using "target_class_id"::text;
    else
      raise exception 'Column public.account_invitations.target_class_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'account_invitations'
    and c.column_name = 'token_hash';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."account_invitations";
    if row_count = 0 then
      alter table public."account_invitations" alter column "token_hash" drop default;
      alter table public."account_invitations" alter column "token_hash" type text using "token_hash"::text;
    else
      raise exception 'Column public.account_invitations.token_hash has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'account_invitations'
    and c.column_name = 'status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."account_invitations";
    if row_count = 0 then
      alter table public."account_invitations" alter column "status" drop default;
      alter table public."account_invitations" alter column "status" type text using "status"::text;
    else
      raise exception 'Column public.account_invitations.status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'account_invitations'
    and c.column_name = 'expires_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."account_invitations";
    if row_count = 0 then
      alter table public."account_invitations" alter column "expires_at" drop default;
      alter table public."account_invitations" alter column "expires_at" type timestamptz using "expires_at"::timestamptz;
    else
      raise exception 'Column public.account_invitations.expires_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'account_invitations'
    and c.column_name = 'accepted_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."account_invitations";
    if row_count = 0 then
      alter table public."account_invitations" alter column "accepted_at" drop default;
      alter table public."account_invitations" alter column "accepted_at" type timestamptz using "accepted_at"::timestamptz;
    else
      raise exception 'Column public.account_invitations.accepted_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'account_invitations'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."account_invitations";
    if row_count = 0 then
      alter table public."account_invitations" alter column "created_at" drop default;
      alter table public."account_invitations" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.account_invitations.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'guardian_student_links'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."guardian_student_links";
    if row_count = 0 then
      alter table public."guardian_student_links" alter column "id" drop default;
      alter table public."guardian_student_links" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.guardian_student_links.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'guardian_student_links'
    and c.column_name = 'guardian_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."guardian_student_links";
    if row_count = 0 then
      alter table public."guardian_student_links" alter column "guardian_id" drop default;
      alter table public."guardian_student_links" alter column "guardian_id" type text using "guardian_id"::text;
    else
      raise exception 'Column public.guardian_student_links.guardian_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'guardian_student_links'
    and c.column_name = 'student_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."guardian_student_links";
    if row_count = 0 then
      alter table public."guardian_student_links" alter column "student_id" drop default;
      alter table public."guardian_student_links" alter column "student_id" type text using "student_id"::text;
    else
      raise exception 'Column public.guardian_student_links.student_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'guardian_student_links'
    and c.column_name = 'relationship';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."guardian_student_links";
    if row_count = 0 then
      alter table public."guardian_student_links" alter column "relationship" drop default;
      alter table public."guardian_student_links" alter column "relationship" type text using "relationship"::text;
    else
      raise exception 'Column public.guardian_student_links.relationship has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'guardian_student_links'
    and c.column_name = 'status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."guardian_student_links";
    if row_count = 0 then
      alter table public."guardian_student_links" alter column "status" drop default;
      alter table public."guardian_student_links" alter column "status" type text using "status"::text;
    else
      raise exception 'Column public.guardian_student_links.status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'guardian_student_links'
    and c.column_name = 'requested_by_user_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."guardian_student_links";
    if row_count = 0 then
      alter table public."guardian_student_links" alter column "requested_by_user_id" drop default;
      alter table public."guardian_student_links" alter column "requested_by_user_id" type text using "requested_by_user_id"::text;
    else
      raise exception 'Column public.guardian_student_links.requested_by_user_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'guardian_student_links'
    and c.column_name = 'approved_by_user_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."guardian_student_links";
    if row_count = 0 then
      alter table public."guardian_student_links" alter column "approved_by_user_id" drop default;
      alter table public."guardian_student_links" alter column "approved_by_user_id" type text using "approved_by_user_id"::text;
    else
      raise exception 'Column public.guardian_student_links.approved_by_user_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'guardian_student_links'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."guardian_student_links";
    if row_count = 0 then
      alter table public."guardian_student_links" alter column "created_at" drop default;
      alter table public."guardian_student_links" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.guardian_student_links.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'guardian_student_links'
    and c.column_name = 'approved_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."guardian_student_links";
    if row_count = 0 then
      alter table public."guardian_student_links" alter column "approved_at" drop default;
      alter table public."guardian_student_links" alter column "approved_at" type timestamptz using "approved_at"::timestamptz;
    else
      raise exception 'Column public.guardian_student_links.approved_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'guardian_student_links'
    and c.column_name = 'revoked_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."guardian_student_links";
    if row_count = 0 then
      alter table public."guardian_student_links" alter column "revoked_at" drop default;
      alter table public."guardian_student_links" alter column "revoked_at" type timestamptz using "revoked_at"::timestamptz;
    else
      raise exception 'Column public.guardian_student_links.revoked_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'session_revocations'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."session_revocations";
    if row_count = 0 then
      alter table public."session_revocations" alter column "id" drop default;
      alter table public."session_revocations" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.session_revocations.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'session_revocations'
    and c.column_name = 'user_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."session_revocations";
    if row_count = 0 then
      alter table public."session_revocations" alter column "user_id" drop default;
      alter table public."session_revocations" alter column "user_id" type text using "user_id"::text;
    else
      raise exception 'Column public.session_revocations.user_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'session_revocations'
    and c.column_name = 'session_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."session_revocations";
    if row_count = 0 then
      alter table public."session_revocations" alter column "session_id" drop default;
      alter table public."session_revocations" alter column "session_id" type text using "session_id"::text;
    else
      raise exception 'Column public.session_revocations.session_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'session_revocations'
    and c.column_name = 'revoked_before';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."session_revocations";
    if row_count = 0 then
      alter table public."session_revocations" alter column "revoked_before" drop default;
      alter table public."session_revocations" alter column "revoked_before" type text using "revoked_before"::text;
    else
      raise exception 'Column public.session_revocations.revoked_before has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'session_revocations'
    and c.column_name = 'reason';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."session_revocations";
    if row_count = 0 then
      alter table public."session_revocations" alter column "reason" drop default;
      alter table public."session_revocations" alter column "reason" type text using "reason"::text;
    else
      raise exception 'Column public.session_revocations.reason has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'session_revocations'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."session_revocations";
    if row_count = 0 then
      alter table public."session_revocations" alter column "created_at" drop default;
      alter table public."session_revocations" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.session_revocations.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'teachers'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."teachers";
    if row_count = 0 then
      alter table public."teachers" alter column "id" drop default;
      alter table public."teachers" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.teachers.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'teachers'
    and c.column_name = 'user_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."teachers";
    if row_count = 0 then
      alter table public."teachers" alter column "user_id" drop default;
      alter table public."teachers" alter column "user_id" type text using "user_id"::text;
    else
      raise exception 'Column public.teachers.user_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'teachers'
    and c.column_name = 'display_name';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."teachers";
    if row_count = 0 then
      alter table public."teachers" alter column "display_name" drop default;
      alter table public."teachers" alter column "display_name" type text using "display_name"::text;
    else
      raise exception 'Column public.teachers.display_name has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'teachers'
    and c.column_name = 'organization_name';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."teachers";
    if row_count = 0 then
      alter table public."teachers" alter column "organization_name" drop default;
      alter table public."teachers" alter column "organization_name" type text using "organization_name"::text;
    else
      raise exception 'Column public.teachers.organization_name has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'teachers'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."teachers";
    if row_count = 0 then
      alter table public."teachers" alter column "created_at" drop default;
      alter table public."teachers" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.teachers.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'teachers'
    and c.column_name = 'updated_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."teachers";
    if row_count = 0 then
      alter table public."teachers" alter column "updated_at" drop default;
      alter table public."teachers" alter column "updated_at" type timestamptz using "updated_at"::timestamptz;
    else
      raise exception 'Column public.teachers.updated_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'schools'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."schools";
    if row_count = 0 then
      alter table public."schools" alter column "id" drop default;
      alter table public."schools" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.schools.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'schools'
    and c.column_name = 'name';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."schools";
    if row_count = 0 then
      alter table public."schools" alter column "name" drop default;
      alter table public."schools" alter column "name" type text using "name"::text;
    else
      raise exception 'Column public.schools.name has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'schools'
    and c.column_name = 'district';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."schools";
    if row_count = 0 then
      alter table public."schools" alter column "district" drop default;
      alter table public."schools" alter column "district" type text using "district"::text;
    else
      raise exception 'Column public.schools.district has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'schools'
    and c.column_name = 'implementation_stage';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."schools";
    if row_count = 0 then
      alter table public."schools" alter column "implementation_stage" drop default;
      alter table public."schools" alter column "implementation_stage" type text using "implementation_stage"::text;
    else
      raise exception 'Column public.schools.implementation_stage has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'schools'
    and c.column_name = 'pilot_focus';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."schools";
    if row_count = 0 then
      alter table public."schools" alter column "pilot_focus" drop default;
      alter table public."schools" alter column "pilot_focus" type text using "pilot_focus"::text;
    else
      raise exception 'Column public.schools.pilot_focus has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'schools'
    and c.column_name = 'status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."schools";
    if row_count = 0 then
      alter table public."schools" alter column "status" drop default;
      alter table public."schools" alter column "status" type text using "status"::text;
    else
      raise exception 'Column public.schools.status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'schools'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."schools";
    if row_count = 0 then
      alter table public."schools" alter column "created_at" drop default;
      alter table public."schools" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.schools.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'schools'
    and c.column_name = 'updated_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."schools";
    if row_count = 0 then
      alter table public."schools" alter column "updated_at" drop default;
      alter table public."schools" alter column "updated_at" type timestamptz using "updated_at"::timestamptz;
    else
      raise exception 'Column public.schools.updated_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'classes'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."classes";
    if row_count = 0 then
      alter table public."classes" alter column "id" drop default;
      alter table public."classes" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.classes.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'classes'
    and c.column_name = 'school_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."classes";
    if row_count = 0 then
      alter table public."classes" alter column "school_id" drop default;
      alter table public."classes" alter column "school_id" type text using "school_id"::text;
    else
      raise exception 'Column public.classes.school_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'classes'
    and c.column_name = 'teacher_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."classes";
    if row_count = 0 then
      alter table public."classes" alter column "teacher_id" drop default;
      alter table public."classes" alter column "teacher_id" type text using "teacher_id"::text;
    else
      raise exception 'Column public.classes.teacher_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'classes'
    and c.column_name = 'name';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."classes";
    if row_count = 0 then
      alter table public."classes" alter column "name" drop default;
      alter table public."classes" alter column "name" type text using "name"::text;
    else
      raise exception 'Column public.classes.name has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'classes'
    and c.column_name = 'academy_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."classes";
    if row_count = 0 then
      alter table public."classes" alter column "academy_id" drop default;
      alter table public."classes" alter column "academy_id" type text using "academy_id"::text;
    else
      raise exception 'Column public.classes.academy_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'classes'
    and c.column_name = 'grade_level_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."classes";
    if row_count = 0 then
      alter table public."classes" alter column "grade_level_id" drop default;
      alter table public."classes" alter column "grade_level_id" type text using "grade_level_id"::text;
    else
      raise exception 'Column public.classes.grade_level_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'classes'
    and c.column_name = 'subject_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."classes";
    if row_count = 0 then
      alter table public."classes" alter column "subject_id" drop default;
      alter table public."classes" alter column "subject_id" type text using "subject_id"::text;
    else
      raise exception 'Column public.classes.subject_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'classes'
    and c.column_name = 'schedule';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."classes";
    if row_count = 0 then
      alter table public."classes" alter column "schedule" drop default;
      alter table public."classes" alter column "schedule" type text using "schedule"::text;
    else
      raise exception 'Column public.classes.schedule has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'classes'
    and c.column_name = 'status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."classes";
    if row_count = 0 then
      alter table public."classes" alter column "status" drop default;
      alter table public."classes" alter column "status" type text using "status"::text;
    else
      raise exception 'Column public.classes.status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'classes'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."classes";
    if row_count = 0 then
      alter table public."classes" alter column "created_at" drop default;
      alter table public."classes" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.classes.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'classes'
    and c.column_name = 'updated_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."classes";
    if row_count = 0 then
      alter table public."classes" alter column "updated_at" drop default;
      alter table public."classes" alter column "updated_at" type timestamptz using "updated_at"::timestamptz;
    else
      raise exception 'Column public.classes.updated_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'teacher_class_assignments'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."teacher_class_assignments";
    if row_count = 0 then
      alter table public."teacher_class_assignments" alter column "id" drop default;
      alter table public."teacher_class_assignments" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.teacher_class_assignments.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'teacher_class_assignments'
    and c.column_name = 'teacher_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."teacher_class_assignments";
    if row_count = 0 then
      alter table public."teacher_class_assignments" alter column "teacher_id" drop default;
      alter table public."teacher_class_assignments" alter column "teacher_id" type text using "teacher_id"::text;
    else
      raise exception 'Column public.teacher_class_assignments.teacher_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'teacher_class_assignments'
    and c.column_name = 'class_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."teacher_class_assignments";
    if row_count = 0 then
      alter table public."teacher_class_assignments" alter column "class_id" drop default;
      alter table public."teacher_class_assignments" alter column "class_id" type text using "class_id"::text;
    else
      raise exception 'Column public.teacher_class_assignments.class_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'teacher_class_assignments'
    and c.column_name = 'assigned_by_user_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."teacher_class_assignments";
    if row_count = 0 then
      alter table public."teacher_class_assignments" alter column "assigned_by_user_id" drop default;
      alter table public."teacher_class_assignments" alter column "assigned_by_user_id" type text using "assigned_by_user_id"::text;
    else
      raise exception 'Column public.teacher_class_assignments.assigned_by_user_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'teacher_class_assignments'
    and c.column_name = 'status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."teacher_class_assignments";
    if row_count = 0 then
      alter table public."teacher_class_assignments" alter column "status" drop default;
      alter table public."teacher_class_assignments" alter column "status" type text using "status"::text;
    else
      raise exception 'Column public.teacher_class_assignments.status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'teacher_class_assignments'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."teacher_class_assignments";
    if row_count = 0 then
      alter table public."teacher_class_assignments" alter column "created_at" drop default;
      alter table public."teacher_class_assignments" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.teacher_class_assignments.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'teacher_class_assignments'
    and c.column_name = 'revoked_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."teacher_class_assignments";
    if row_count = 0 then
      alter table public."teacher_class_assignments" alter column "revoked_at" drop default;
      alter table public."teacher_class_assignments" alter column "revoked_at" type timestamptz using "revoked_at"::timestamptz;
    else
      raise exception 'Column public.teacher_class_assignments.revoked_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'enrollments'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."enrollments";
    if row_count = 0 then
      alter table public."enrollments" alter column "id" drop default;
      alter table public."enrollments" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.enrollments.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'enrollments'
    and c.column_name = 'student_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."enrollments";
    if row_count = 0 then
      alter table public."enrollments" alter column "student_id" drop default;
      alter table public."enrollments" alter column "student_id" type text using "student_id"::text;
    else
      raise exception 'Column public.enrollments.student_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'enrollments'
    and c.column_name = 'class_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."enrollments";
    if row_count = 0 then
      alter table public."enrollments" alter column "class_id" drop default;
      alter table public."enrollments" alter column "class_id" type text using "class_id"::text;
    else
      raise exception 'Column public.enrollments.class_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'enrollments'
    and c.column_name = 'course_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."enrollments";
    if row_count = 0 then
      alter table public."enrollments" alter column "course_id" drop default;
      alter table public."enrollments" alter column "course_id" type text using "course_id"::text;
    else
      raise exception 'Column public.enrollments.course_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'enrollments'
    and c.column_name = 'status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."enrollments";
    if row_count = 0 then
      alter table public."enrollments" alter column "status" drop default;
      alter table public."enrollments" alter column "status" type text using "status"::text;
    else
      raise exception 'Column public.enrollments.status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'enrollments'
    and c.column_name = 'started_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."enrollments";
    if row_count = 0 then
      alter table public."enrollments" alter column "started_at" drop default;
      alter table public."enrollments" alter column "started_at" type timestamptz using "started_at"::timestamptz;
    else
      raise exception 'Column public.enrollments.started_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'enrollments'
    and c.column_name = 'ended_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."enrollments";
    if row_count = 0 then
      alter table public."enrollments" alter column "ended_at" drop default;
      alter table public."enrollments" alter column "ended_at" type timestamptz using "ended_at"::timestamptz;
    else
      raise exception 'Column public.enrollments.ended_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'class_sessions'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."class_sessions";
    if row_count = 0 then
      alter table public."class_sessions" alter column "id" drop default;
      alter table public."class_sessions" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.class_sessions.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'class_sessions'
    and c.column_name = 'class_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."class_sessions";
    if row_count = 0 then
      alter table public."class_sessions" alter column "class_id" drop default;
      alter table public."class_sessions" alter column "class_id" type text using "class_id"::text;
    else
      raise exception 'Column public.class_sessions.class_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'class_sessions'
    and c.column_name = 'lesson_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."class_sessions";
    if row_count = 0 then
      alter table public."class_sessions" alter column "lesson_id" drop default;
      alter table public."class_sessions" alter column "lesson_id" type text using "lesson_id"::text;
    else
      raise exception 'Column public.class_sessions.lesson_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'class_sessions'
    and c.column_name = 'title';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."class_sessions";
    if row_count = 0 then
      alter table public."class_sessions" alter column "title" drop default;
      alter table public."class_sessions" alter column "title" type text using "title"::text;
    else
      raise exception 'Column public.class_sessions.title has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'class_sessions'
    and c.column_name = 'status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."class_sessions";
    if row_count = 0 then
      alter table public."class_sessions" alter column "status" drop default;
      alter table public."class_sessions" alter column "status" type text using "status"::text;
    else
      raise exception 'Column public.class_sessions.status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'class_sessions'
    and c.column_name = 'period_label';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."class_sessions";
    if row_count = 0 then
      alter table public."class_sessions" alter column "period_label" drop default;
      alter table public."class_sessions" alter column "period_label" type text using "period_label"::text;
    else
      raise exception 'Column public.class_sessions.period_label has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'class_sessions'
    and c.column_name = 'duration_minutes';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."class_sessions";
    if row_count = 0 then
      alter table public."class_sessions" alter column "duration_minutes" drop default;
      alter table public."class_sessions" alter column "duration_minutes" type integer using "duration_minutes"::integer;
    else
      raise exception 'Column public.class_sessions.duration_minutes has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'class_sessions'
    and c.column_name = 'launch_goal';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."class_sessions";
    if row_count = 0 then
      alter table public."class_sessions" alter column "launch_goal" drop default;
      alter table public."class_sessions" alter column "launch_goal" type text using "launch_goal"::text;
    else
      raise exception 'Column public.class_sessions.launch_goal has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'class_sessions'
    and c.column_name = 'steps';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."class_sessions";
    if row_count = 0 then
      alter table public."class_sessions" alter column "steps" drop default;
      alter table public."class_sessions" alter column "steps" type jsonb using "steps"::jsonb;
  alter table public."class_sessions" alter column "steps" set default '[]'::jsonb;
    else
      raise exception 'Column public.class_sessions.steps has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'class_sessions'
    and c.column_name = 'started_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."class_sessions";
    if row_count = 0 then
      alter table public."class_sessions" alter column "started_at" drop default;
      alter table public."class_sessions" alter column "started_at" type timestamptz using "started_at"::timestamptz;
    else
      raise exception 'Column public.class_sessions.started_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'class_sessions'
    and c.column_name = 'ended_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."class_sessions";
    if row_count = 0 then
      alter table public."class_sessions" alter column "ended_at" drop default;
      alter table public."class_sessions" alter column "ended_at" type timestamptz using "ended_at"::timestamptz;
    else
      raise exception 'Column public.class_sessions.ended_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'class_sessions'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."class_sessions";
    if row_count = 0 then
      alter table public."class_sessions" alter column "created_at" drop default;
      alter table public."class_sessions" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.class_sessions.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'class_sessions'
    and c.column_name = 'updated_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."class_sessions";
    if row_count = 0 then
      alter table public."class_sessions" alter column "updated_at" drop default;
      alter table public."class_sessions" alter column "updated_at" type timestamptz using "updated_at"::timestamptz;
    else
      raise exception 'Column public.class_sessions.updated_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'group_missions'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."group_missions";
    if row_count = 0 then
      alter table public."group_missions" alter column "id" drop default;
      alter table public."group_missions" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.group_missions.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'group_missions'
    and c.column_name = 'class_session_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."group_missions";
    if row_count = 0 then
      alter table public."group_missions" alter column "class_session_id" drop default;
      alter table public."group_missions" alter column "class_session_id" type text using "class_session_id"::text;
    else
      raise exception 'Column public.group_missions.class_session_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'group_missions'
    and c.column_name = 'title';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."group_missions";
    if row_count = 0 then
      alter table public."group_missions" alter column "title" drop default;
      alter table public."group_missions" alter column "title" type text using "title"::text;
    else
      raise exception 'Column public.group_missions.title has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'group_missions'
    and c.column_name = 'group_size';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."group_missions";
    if row_count = 0 then
      alter table public."group_missions" alter column "group_size" drop default;
      alter table public."group_missions" alter column "group_size" type text using "group_size"::text;
    else
      raise exception 'Column public.group_missions.group_size has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'group_missions'
    and c.column_name = 'shared_artifact';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."group_missions";
    if row_count = 0 then
      alter table public."group_missions" alter column "shared_artifact" drop default;
      alter table public."group_missions" alter column "shared_artifact" type text using "shared_artifact"::text;
    else
      raise exception 'Column public.group_missions.shared_artifact has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'group_missions'
    and c.column_name = 'role_labels';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."group_missions";
    if row_count = 0 then
      alter table public."group_missions" alter column "role_labels" drop default;
      alter table public."group_missions" alter column "role_labels" type jsonb using "role_labels"::jsonb;
  alter table public."group_missions" alter column "role_labels" set default '[]'::jsonb;
    else
      raise exception 'Column public.group_missions.role_labels has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'group_missions'
    and c.column_name = 'individual_evidence';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."group_missions";
    if row_count = 0 then
      alter table public."group_missions" alter column "individual_evidence" drop default;
      alter table public."group_missions" alter column "individual_evidence" type text using "individual_evidence"::text;
    else
      raise exception 'Column public.group_missions.individual_evidence has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'group_missions'
    and c.column_name = 'teacher_look_for';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."group_missions";
    if row_count = 0 then
      alter table public."group_missions" alter column "teacher_look_for" drop default;
      alter table public."group_missions" alter column "teacher_look_for" type text using "teacher_look_for"::text;
    else
      raise exception 'Column public.group_missions.teacher_look_for has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'group_missions'
    and c.column_name = 'status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."group_missions";
    if row_count = 0 then
      alter table public."group_missions" alter column "status" drop default;
      alter table public."group_missions" alter column "status" type text using "status"::text;
    else
      raise exception 'Column public.group_missions.status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'group_missions'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."group_missions";
    if row_count = 0 then
      alter table public."group_missions" alter column "created_at" drop default;
      alter table public."group_missions" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.group_missions.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'group_missions'
    and c.column_name = 'updated_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."group_missions";
    if row_count = 0 then
      alter table public."group_missions" alter column "updated_at" drop default;
      alter table public."group_missions" alter column "updated_at" type timestamptz using "updated_at"::timestamptz;
    else
      raise exception 'Column public.group_missions.updated_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'group_artifacts'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."group_artifacts";
    if row_count = 0 then
      alter table public."group_artifacts" alter column "id" drop default;
      alter table public."group_artifacts" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.group_artifacts.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'group_artifacts'
    and c.column_name = 'group_mission_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."group_artifacts";
    if row_count = 0 then
      alter table public."group_artifacts" alter column "group_mission_id" drop default;
      alter table public."group_artifacts" alter column "group_mission_id" type text using "group_mission_id"::text;
    else
      raise exception 'Column public.group_artifacts.group_mission_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'group_artifacts'
    and c.column_name = 'student_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."group_artifacts";
    if row_count = 0 then
      alter table public."group_artifacts" alter column "student_id" drop default;
      alter table public."group_artifacts" alter column "student_id" type text using "student_id"::text;
    else
      raise exception 'Column public.group_artifacts.student_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'group_artifacts'
    and c.column_name = 'artifact_title';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."group_artifacts";
    if row_count = 0 then
      alter table public."group_artifacts" alter column "artifact_title" drop default;
      alter table public."group_artifacts" alter column "artifact_title" type text using "artifact_title"::text;
    else
      raise exception 'Column public.group_artifacts.artifact_title has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'group_artifacts'
    and c.column_name = 'artifact_status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."group_artifacts";
    if row_count = 0 then
      alter table public."group_artifacts" alter column "artifact_status" drop default;
      alter table public."group_artifacts" alter column "artifact_status" type text using "artifact_status"::text;
    else
      raise exception 'Column public.group_artifacts.artifact_status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'group_artifacts'
    and c.column_name = 'individual_evidence';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."group_artifacts";
    if row_count = 0 then
      alter table public."group_artifacts" alter column "individual_evidence" drop default;
      alter table public."group_artifacts" alter column "individual_evidence" type text using "individual_evidence"::text;
    else
      raise exception 'Column public.group_artifacts.individual_evidence has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'group_artifacts'
    and c.column_name = 'submitted_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."group_artifacts";
    if row_count = 0 then
      alter table public."group_artifacts" alter column "submitted_at" drop default;
      alter table public."group_artifacts" alter column "submitted_at" type timestamptz using "submitted_at"::timestamptz;
    else
      raise exception 'Column public.group_artifacts.submitted_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'group_artifacts'
    and c.column_name = 'reviewed_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."group_artifacts";
    if row_count = 0 then
      alter table public."group_artifacts" alter column "reviewed_at" drop default;
      alter table public."group_artifacts" alter column "reviewed_at" type timestamptz using "reviewed_at"::timestamptz;
    else
      raise exception 'Column public.group_artifacts.reviewed_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'teacher_interventions'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."teacher_interventions";
    if row_count = 0 then
      alter table public."teacher_interventions" alter column "id" drop default;
      alter table public."teacher_interventions" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.teacher_interventions.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'teacher_interventions'
    and c.column_name = 'teacher_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."teacher_interventions";
    if row_count = 0 then
      alter table public."teacher_interventions" alter column "teacher_id" drop default;
      alter table public."teacher_interventions" alter column "teacher_id" type text using "teacher_id"::text;
    else
      raise exception 'Column public.teacher_interventions.teacher_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'teacher_interventions'
    and c.column_name = 'class_session_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."teacher_interventions";
    if row_count = 0 then
      alter table public."teacher_interventions" alter column "class_session_id" drop default;
      alter table public."teacher_interventions" alter column "class_session_id" type text using "class_session_id"::text;
    else
      raise exception 'Column public.teacher_interventions.class_session_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'teacher_interventions'
    and c.column_name = 'student_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."teacher_interventions";
    if row_count = 0 then
      alter table public."teacher_interventions" alter column "student_id" drop default;
      alter table public."teacher_interventions" alter column "student_id" type text using "student_id"::text;
    else
      raise exception 'Column public.teacher_interventions.student_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'teacher_interventions'
    and c.column_name = 'lesson_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."teacher_interventions";
    if row_count = 0 then
      alter table public."teacher_interventions" alter column "lesson_id" drop default;
      alter table public."teacher_interventions" alter column "lesson_id" type text using "lesson_id"::text;
    else
      raise exception 'Column public.teacher_interventions.lesson_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'teacher_interventions'
    and c.column_name = 'intervention_type';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."teacher_interventions";
    if row_count = 0 then
      alter table public."teacher_interventions" alter column "intervention_type" drop default;
      alter table public."teacher_interventions" alter column "intervention_type" type text using "intervention_type"::text;
    else
      raise exception 'Column public.teacher_interventions.intervention_type has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'teacher_interventions'
    and c.column_name = 'summary';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."teacher_interventions";
    if row_count = 0 then
      alter table public."teacher_interventions" alter column "summary" drop default;
      alter table public."teacher_interventions" alter column "summary" type text using "summary"::text;
    else
      raise exception 'Column public.teacher_interventions.summary has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'teacher_interventions'
    and c.column_name = 'status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."teacher_interventions";
    if row_count = 0 then
      alter table public."teacher_interventions" alter column "status" drop default;
      alter table public."teacher_interventions" alter column "status" type text using "status"::text;
    else
      raise exception 'Column public.teacher_interventions.status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'teacher_interventions'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."teacher_interventions";
    if row_count = 0 then
      alter table public."teacher_interventions" alter column "created_at" drop default;
      alter table public."teacher_interventions" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.teacher_interventions.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'teacher_interventions'
    and c.column_name = 'resolved_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."teacher_interventions";
    if row_count = 0 then
      alter table public."teacher_interventions" alter column "resolved_at" drop default;
      alter table public."teacher_interventions" alter column "resolved_at" type timestamptz using "resolved_at"::timestamptz;
    else
      raise exception 'Column public.teacher_interventions.resolved_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'school_reports'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."school_reports";
    if row_count = 0 then
      alter table public."school_reports" alter column "id" drop default;
      alter table public."school_reports" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.school_reports.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'school_reports'
    and c.column_name = 'school_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."school_reports";
    if row_count = 0 then
      alter table public."school_reports" alter column "school_id" drop default;
      alter table public."school_reports" alter column "school_id" type text using "school_id"::text;
    else
      raise exception 'Column public.school_reports.school_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'school_reports'
    and c.column_name = 'class_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."school_reports";
    if row_count = 0 then
      alter table public."school_reports" alter column "class_id" drop default;
      alter table public."school_reports" alter column "class_id" type text using "class_id"::text;
    else
      raise exception 'Column public.school_reports.class_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'school_reports'
    and c.column_name = 'report_type';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."school_reports";
    if row_count = 0 then
      alter table public."school_reports" alter column "report_type" drop default;
      alter table public."school_reports" alter column "report_type" type text using "report_type"::text;
    else
      raise exception 'Column public.school_reports.report_type has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'school_reports'
    and c.column_name = 'summary';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."school_reports";
    if row_count = 0 then
      alter table public."school_reports" alter column "summary" drop default;
      alter table public."school_reports" alter column "summary" type text using "summary"::text;
    else
      raise exception 'Column public.school_reports.summary has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'school_reports'
    and c.column_name = 'metrics';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."school_reports";
    if row_count = 0 then
      alter table public."school_reports" alter column "metrics" drop default;
      alter table public."school_reports" alter column "metrics" type jsonb using "metrics"::jsonb;
  alter table public."school_reports" alter column "metrics" set default '[]'::jsonb;
    else
      raise exception 'Column public.school_reports.metrics has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'school_reports'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."school_reports";
    if row_count = 0 then
      alter table public."school_reports" alter column "created_at" drop default;
      alter table public."school_reports" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.school_reports.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'grade_bands'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."grade_bands";
    if row_count = 0 then
      alter table public."grade_bands" alter column "id" drop default;
      alter table public."grade_bands" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.grade_bands.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'grade_bands'
    and c.column_name = 'name';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."grade_bands";
    if row_count = 0 then
      alter table public."grade_bands" alter column "name" drop default;
      alter table public."grade_bands" alter column "name" type text using "name"::text;
    else
      raise exception 'Column public.grade_bands.name has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'grade_bands'
    and c.column_name = 'range';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."grade_bands";
    if row_count = 0 then
      alter table public."grade_bands" alter column "range" drop default;
      alter table public."grade_bands" alter column "range" type text using "range"::text;
    else
      raise exception 'Column public.grade_bands.range has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'grade_bands'
    and c.column_name = 'purpose';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."grade_bands";
    if row_count = 0 then
      alter table public."grade_bands" alter column "purpose" drop default;
      alter table public."grade_bands" alter column "purpose" type text using "purpose"::text;
    else
      raise exception 'Column public.grade_bands.purpose has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'grade_bands'
    and c.column_name = 'style';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."grade_bands";
    if row_count = 0 then
      alter table public."grade_bands" alter column "style" drop default;
      alter table public."grade_bands" alter column "style" type text using "style"::text;
    else
      raise exception 'Column public.grade_bands.style has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'grade_bands'
    and c.column_name = 'target_lessons';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."grade_bands";
    if row_count = 0 then
      alter table public."grade_bands" alter column "target_lessons" drop default;
      alter table public."grade_bands" alter column "target_lessons" type integer using "target_lessons"::integer;
    else
      raise exception 'Column public.grade_bands.target_lessons has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'grade_levels'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."grade_levels";
    if row_count = 0 then
      alter table public."grade_levels" alter column "id" drop default;
      alter table public."grade_levels" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.grade_levels.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'grade_levels'
    and c.column_name = 'grade_band_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."grade_levels";
    if row_count = 0 then
      alter table public."grade_levels" alter column "grade_band_id" drop default;
      alter table public."grade_levels" alter column "grade_band_id" type text using "grade_band_id"::text;
    else
      raise exception 'Column public.grade_levels.grade_band_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'grade_levels'
    and c.column_name = 'grade';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."grade_levels";
    if row_count = 0 then
      alter table public."grade_levels" alter column "grade" drop default;
      alter table public."grade_levels" alter column "grade" type text using "grade"::text;
    else
      raise exception 'Column public.grade_levels.grade has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'grade_levels'
    and c.column_name = 'label';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."grade_levels";
    if row_count = 0 then
      alter table public."grade_levels" alter column "label" drop default;
      alter table public."grade_levels" alter column "label" type text using "label"::text;
    else
      raise exception 'Column public.grade_levels.label has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'grade_levels'
    and c.column_name = 'sort_order';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."grade_levels";
    if row_count = 0 then
      alter table public."grade_levels" alter column "sort_order" drop default;
      alter table public."grade_levels" alter column "sort_order" type integer using "sort_order"::integer;
    else
      raise exception 'Column public.grade_levels.sort_order has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'subjects'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."subjects";
    if row_count = 0 then
      alter table public."subjects" alter column "id" drop default;
      alter table public."subjects" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.subjects.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'subjects'
    and c.column_name = 'title';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."subjects";
    if row_count = 0 then
      alter table public."subjects" alter column "title" drop default;
      alter table public."subjects" alter column "title" type text using "title"::text;
    else
      raise exception 'Column public.subjects.title has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'subjects'
    and c.column_name = 'standards_framework_ids';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."subjects";
    if row_count = 0 then
      alter table public."subjects" alter column "standards_framework_ids" drop default;
      alter table public."subjects" alter column "standards_framework_ids" type jsonb using "standards_framework_ids"::jsonb;
  alter table public."subjects" alter column "standards_framework_ids" set default '[]'::jsonb;
    else
      raise exception 'Column public.subjects.standards_framework_ids has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'subjects'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."subjects";
    if row_count = 0 then
      alter table public."subjects" alter column "created_at" drop default;
      alter table public."subjects" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.subjects.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'courses'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."courses";
    if row_count = 0 then
      alter table public."courses" alter column "id" drop default;
      alter table public."courses" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.courses.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'courses'
    and c.column_name = 'grade_level_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."courses";
    if row_count = 0 then
      alter table public."courses" alter column "grade_level_id" drop default;
      alter table public."courses" alter column "grade_level_id" type text using "grade_level_id"::text;
    else
      raise exception 'Column public.courses.grade_level_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'courses'
    and c.column_name = 'subject_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."courses";
    if row_count = 0 then
      alter table public."courses" alter column "subject_id" drop default;
      alter table public."courses" alter column "subject_id" type text using "subject_id"::text;
    else
      raise exception 'Column public.courses.subject_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'courses'
    and c.column_name = 'title';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."courses";
    if row_count = 0 then
      alter table public."courses" alter column "title" drop default;
      alter table public."courses" alter column "title" type text using "title"::text;
    else
      raise exception 'Column public.courses.title has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'courses'
    and c.column_name = 'status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."courses";
    if row_count = 0 then
      alter table public."courses" alter column "status" drop default;
      alter table public."courses" alter column "status" type text using "status"::text;
    else
      raise exception 'Column public.courses.status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'courses'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."courses";
    if row_count = 0 then
      alter table public."courses" alter column "created_at" drop default;
      alter table public."courses" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.courses.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'courses'
    and c.column_name = 'updated_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."courses";
    if row_count = 0 then
      alter table public."courses" alter column "updated_at" drop default;
      alter table public."courses" alter column "updated_at" type timestamptz using "updated_at"::timestamptz;
    else
      raise exception 'Column public.courses.updated_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'units'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."units";
    if row_count = 0 then
      alter table public."units" alter column "id" drop default;
      alter table public."units" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.units.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'units'
    and c.column_name = 'course_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."units";
    if row_count = 0 then
      alter table public."units" alter column "course_id" drop default;
      alter table public."units" alter column "course_id" type text using "course_id"::text;
    else
      raise exception 'Column public.units.course_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'units'
    and c.column_name = 'title';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."units";
    if row_count = 0 then
      alter table public."units" alter column "title" drop default;
      alter table public."units" alter column "title" type text using "title"::text;
    else
      raise exception 'Column public.units.title has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'units'
    and c.column_name = 'lesson_target';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."units";
    if row_count = 0 then
      alter table public."units" alter column "lesson_target" drop default;
      alter table public."units" alter column "lesson_target" type integer using "lesson_target"::integer;
    else
      raise exception 'Column public.units.lesson_target has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'units'
    and c.column_name = 'sort_order';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."units";
    if row_count = 0 then
      alter table public."units" alter column "sort_order" drop default;
      alter table public."units" alter column "sort_order" type integer using "sort_order"::integer;
    else
      raise exception 'Column public.units.sort_order has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'units'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."units";
    if row_count = 0 then
      alter table public."units" alter column "created_at" drop default;
      alter table public."units" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.units.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'units'
    and c.column_name = 'updated_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."units";
    if row_count = 0 then
      alter table public."units" alter column "updated_at" drop default;
      alter table public."units" alter column "updated_at" type timestamptz using "updated_at"::timestamptz;
    else
      raise exception 'Column public.units.updated_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lessons'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lessons";
    if row_count = 0 then
      alter table public."lessons" alter column "id" drop default;
      alter table public."lessons" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.lessons.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lessons'
    and c.column_name = 'unit_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lessons";
    if row_count = 0 then
      alter table public."lessons" alter column "unit_id" drop default;
      alter table public."lessons" alter column "unit_id" type text using "unit_id"::text;
    else
      raise exception 'Column public.lessons.unit_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lessons'
    and c.column_name = 'title';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lessons";
    if row_count = 0 then
      alter table public."lessons" alter column "title" drop default;
      alter table public."lessons" alter column "title" type text using "title"::text;
    else
      raise exception 'Column public.lessons.title has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lessons'
    and c.column_name = 'grade_band_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lessons";
    if row_count = 0 then
      alter table public."lessons" alter column "grade_band_id" drop default;
      alter table public."lessons" alter column "grade_band_id" type text using "grade_band_id"::text;
    else
      raise exception 'Column public.lessons.grade_band_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lessons'
    and c.column_name = 'grade_level_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lessons";
    if row_count = 0 then
      alter table public."lessons" alter column "grade_level_id" drop default;
      alter table public."lessons" alter column "grade_level_id" type text using "grade_level_id"::text;
    else
      raise exception 'Column public.lessons.grade_level_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lessons'
    and c.column_name = 'subject_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lessons";
    if row_count = 0 then
      alter table public."lessons" alter column "subject_id" drop default;
      alter table public."lessons" alter column "subject_id" type text using "subject_id"::text;
    else
      raise exception 'Column public.lessons.subject_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lessons'
    and c.column_name = 'estimated_minutes';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."lessons";
    if row_count = 0 then
      alter table public."lessons" alter column "estimated_minutes" drop default;
      alter table public."lessons" alter column "estimated_minutes" type integer using "estimated_minutes"::integer;
    else
      raise exception 'Column public.lessons.estimated_minutes has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lessons'
    and c.column_name = 'learning_objective';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lessons";
    if row_count = 0 then
      alter table public."lessons" alter column "learning_objective" drop default;
      alter table public."lessons" alter column "learning_objective" type text using "learning_objective"::text;
    else
      raise exception 'Column public.lessons.learning_objective has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lessons'
    and c.column_name = 'essential_question';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lessons";
    if row_count = 0 then
      alter table public."lessons" alter column "essential_question" drop default;
      alter table public."lessons" alter column "essential_question" type text using "essential_question"::text;
    else
      raise exception 'Column public.lessons.essential_question has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lessons'
    and c.column_name = 'mastery_threshold';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."lessons";
    if row_count = 0 then
      alter table public."lessons" alter column "mastery_threshold" drop default;
      alter table public."lessons" alter column "mastery_threshold" type integer using "mastery_threshold"::integer;
    else
      raise exception 'Column public.lessons.mastery_threshold has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lessons'
    and c.column_name = 'status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lessons";
    if row_count = 0 then
      alter table public."lessons" alter column "status" drop default;
      alter table public."lessons" alter column "status" type text using "status"::text;
    else
      raise exception 'Column public.lessons.status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lessons'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."lessons";
    if row_count = 0 then
      alter table public."lessons" alter column "created_at" drop default;
      alter table public."lessons" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.lessons.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lessons'
    and c.column_name = 'updated_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."lessons";
    if row_count = 0 then
      alter table public."lessons" alter column "updated_at" drop default;
      alter table public."lessons" alter column "updated_at" type timestamptz using "updated_at"::timestamptz;
    else
      raise exception 'Column public.lessons.updated_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'activities'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."activities";
    if row_count = 0 then
      alter table public."activities" alter column "id" drop default;
      alter table public."activities" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.activities.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'activities'
    and c.column_name = 'lesson_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."activities";
    if row_count = 0 then
      alter table public."activities" alter column "lesson_id" drop default;
      alter table public."activities" alter column "lesson_id" type text using "lesson_id"::text;
    else
      raise exception 'Column public.activities.lesson_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'activities'
    and c.column_name = 'activity_type';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."activities";
    if row_count = 0 then
      alter table public."activities" alter column "activity_type" drop default;
      alter table public."activities" alter column "activity_type" type text using "activity_type"::text;
    else
      raise exception 'Column public.activities.activity_type has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'activities'
    and c.column_name = 'title';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."activities";
    if row_count = 0 then
      alter table public."activities" alter column "title" drop default;
      alter table public."activities" alter column "title" type text using "title"::text;
    else
      raise exception 'Column public.activities.title has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'activities'
    and c.column_name = 'body';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."activities";
    if row_count = 0 then
      alter table public."activities" alter column "body" drop default;
      alter table public."activities" alter column "body" type text using "body"::text;
    else
      raise exception 'Column public.activities.body has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'activities'
    and c.column_name = 'sort_order';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."activities";
    if row_count = 0 then
      alter table public."activities" alter column "sort_order" drop default;
      alter table public."activities" alter column "sort_order" type integer using "sort_order"::integer;
    else
      raise exception 'Column public.activities.sort_order has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'activities'
    and c.column_name = 'requires_group';
  if actual_type is not null and actual_type <> 'bool' then
    select count(*) into row_count from public."activities";
    if row_count = 0 then
      alter table public."activities" alter column "requires_group" drop default;
      alter table public."activities" alter column "requires_group" type boolean using "requires_group"::boolean;
  alter table public."activities" alter column "requires_group" set default false;
    else
      raise exception 'Column public.activities.requires_group has type %, expected bool, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'activities'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."activities";
    if row_count = 0 then
      alter table public."activities" alter column "created_at" drop default;
      alter table public."activities" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.activities.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'quizzes'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."quizzes";
    if row_count = 0 then
      alter table public."quizzes" alter column "id" drop default;
      alter table public."quizzes" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.quizzes.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'quizzes'
    and c.column_name = 'lesson_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."quizzes";
    if row_count = 0 then
      alter table public."quizzes" alter column "lesson_id" drop default;
      alter table public."quizzes" alter column "lesson_id" type text using "lesson_id"::text;
    else
      raise exception 'Column public.quizzes.lesson_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'quizzes'
    and c.column_name = 'title';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."quizzes";
    if row_count = 0 then
      alter table public."quizzes" alter column "title" drop default;
      alter table public."quizzes" alter column "title" type text using "title"::text;
    else
      raise exception 'Column public.quizzes.title has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'quizzes'
    and c.column_name = 'mastery_threshold';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."quizzes";
    if row_count = 0 then
      alter table public."quizzes" alter column "mastery_threshold" drop default;
      alter table public."quizzes" alter column "mastery_threshold" type integer using "mastery_threshold"::integer;
    else
      raise exception 'Column public.quizzes.mastery_threshold has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'quizzes'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."quizzes";
    if row_count = 0 then
      alter table public."quizzes" alter column "created_at" drop default;
      alter table public."quizzes" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.quizzes.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'quizzes'
    and c.column_name = 'updated_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."quizzes";
    if row_count = 0 then
      alter table public."quizzes" alter column "updated_at" drop default;
      alter table public."quizzes" alter column "updated_at" type timestamptz using "updated_at"::timestamptz;
    else
      raise exception 'Column public.quizzes.updated_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'quiz_questions'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."quiz_questions";
    if row_count = 0 then
      alter table public."quiz_questions" alter column "id" drop default;
      alter table public."quiz_questions" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.quiz_questions.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'quiz_questions'
    and c.column_name = 'quiz_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."quiz_questions";
    if row_count = 0 then
      alter table public."quiz_questions" alter column "quiz_id" drop default;
      alter table public."quiz_questions" alter column "quiz_id" type text using "quiz_id"::text;
    else
      raise exception 'Column public.quiz_questions.quiz_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'quiz_questions'
    and c.column_name = 'question_text';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."quiz_questions";
    if row_count = 0 then
      alter table public."quiz_questions" alter column "question_text" drop default;
      alter table public."quiz_questions" alter column "question_text" type text using "question_text"::text;
    else
      raise exception 'Column public.quiz_questions.question_text has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'quiz_questions'
    and c.column_name = 'question_type';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."quiz_questions";
    if row_count = 0 then
      alter table public."quiz_questions" alter column "question_type" drop default;
      alter table public."quiz_questions" alter column "question_type" type text using "question_type"::text;
    else
      raise exception 'Column public.quiz_questions.question_type has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'quiz_questions'
    and c.column_name = 'choices';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."quiz_questions";
    if row_count = 0 then
      alter table public."quiz_questions" alter column "choices" drop default;
      alter table public."quiz_questions" alter column "choices" type jsonb using "choices"::jsonb;
  alter table public."quiz_questions" alter column "choices" set default '[]'::jsonb;
    else
      raise exception 'Column public.quiz_questions.choices has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'quiz_questions'
    and c.column_name = 'correct_answer';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."quiz_questions";
    if row_count = 0 then
      alter table public."quiz_questions" alter column "correct_answer" drop default;
      alter table public."quiz_questions" alter column "correct_answer" type text using "correct_answer"::text;
    else
      raise exception 'Column public.quiz_questions.correct_answer has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'quiz_questions'
    and c.column_name = 'explanation';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."quiz_questions";
    if row_count = 0 then
      alter table public."quiz_questions" alter column "explanation" drop default;
      alter table public."quiz_questions" alter column "explanation" type text using "explanation"::text;
    else
      raise exception 'Column public.quiz_questions.explanation has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'quiz_questions'
    and c.column_name = 'difficulty_level';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."quiz_questions";
    if row_count = 0 then
      alter table public."quiz_questions" alter column "difficulty_level" drop default;
      alter table public."quiz_questions" alter column "difficulty_level" type text using "difficulty_level"::text;
    else
      raise exception 'Column public.quiz_questions.difficulty_level has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'quiz_questions'
    and c.column_name = 'skill_tag';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."quiz_questions";
    if row_count = 0 then
      alter table public."quiz_questions" alter column "skill_tag" drop default;
      alter table public."quiz_questions" alter column "skill_tag" type text using "skill_tag"::text;
    else
      raise exception 'Column public.quiz_questions.skill_tag has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'quiz_questions'
    and c.column_name = 'standard_tag';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."quiz_questions";
    if row_count = 0 then
      alter table public."quiz_questions" alter column "standard_tag" drop default;
      alter table public."quiz_questions" alter column "standard_tag" type text using "standard_tag"::text;
    else
      raise exception 'Column public.quiz_questions.standard_tag has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'quiz_questions'
    and c.column_name = 'sort_order';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."quiz_questions";
    if row_count = 0 then
      alter table public."quiz_questions" alter column "sort_order" drop default;
      alter table public."quiz_questions" alter column "sort_order" type integer using "sort_order"::integer;
    else
      raise exception 'Column public.quiz_questions.sort_order has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'quiz_attempts'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."quiz_attempts";
    if row_count = 0 then
      alter table public."quiz_attempts" alter column "id" drop default;
      alter table public."quiz_attempts" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.quiz_attempts.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'quiz_attempts'
    and c.column_name = 'quiz_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."quiz_attempts";
    if row_count = 0 then
      alter table public."quiz_attempts" alter column "quiz_id" drop default;
      alter table public."quiz_attempts" alter column "quiz_id" type text using "quiz_id"::text;
    else
      raise exception 'Column public.quiz_attempts.quiz_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'quiz_attempts'
    and c.column_name = 'student_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."quiz_attempts";
    if row_count = 0 then
      alter table public."quiz_attempts" alter column "student_id" drop default;
      alter table public."quiz_attempts" alter column "student_id" type text using "student_id"::text;
    else
      raise exception 'Column public.quiz_attempts.student_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'quiz_attempts'
    and c.column_name = 'score';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."quiz_attempts";
    if row_count = 0 then
      alter table public."quiz_attempts" alter column "score" drop default;
      alter table public."quiz_attempts" alter column "score" type integer using "score"::integer;
    else
      raise exception 'Column public.quiz_attempts.score has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'quiz_attempts'
    and c.column_name = 'passed';
  if actual_type is not null and actual_type <> 'bool' then
    select count(*) into row_count from public."quiz_attempts";
    if row_count = 0 then
      alter table public."quiz_attempts" alter column "passed" drop default;
      alter table public."quiz_attempts" alter column "passed" type boolean using "passed"::boolean;
  alter table public."quiz_attempts" alter column "passed" set default false;
    else
      raise exception 'Column public.quiz_attempts.passed has type %, expected bool, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'quiz_attempts'
    and c.column_name = 'answers';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."quiz_attempts";
    if row_count = 0 then
      alter table public."quiz_attempts" alter column "answers" drop default;
      alter table public."quiz_attempts" alter column "answers" type jsonb using "answers"::jsonb;
  alter table public."quiz_attempts" alter column "answers" set default '[]'::jsonb;
    else
      raise exception 'Column public.quiz_attempts.answers has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'quiz_attempts'
    and c.column_name = 'attempted_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."quiz_attempts";
    if row_count = 0 then
      alter table public."quiz_attempts" alter column "attempted_at" drop default;
      alter table public."quiz_attempts" alter column "attempted_at" type timestamptz using "attempted_at"::timestamptz;
    else
      raise exception 'Column public.quiz_attempts.attempted_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_progress'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lesson_progress";
    if row_count = 0 then
      alter table public."lesson_progress" alter column "id" drop default;
      alter table public."lesson_progress" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.lesson_progress.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_progress'
    and c.column_name = 'student_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lesson_progress";
    if row_count = 0 then
      alter table public."lesson_progress" alter column "student_id" drop default;
      alter table public."lesson_progress" alter column "student_id" type text using "student_id"::text;
    else
      raise exception 'Column public.lesson_progress.student_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_progress'
    and c.column_name = 'lesson_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lesson_progress";
    if row_count = 0 then
      alter table public."lesson_progress" alter column "lesson_id" drop default;
      alter table public."lesson_progress" alter column "lesson_id" type text using "lesson_id"::text;
    else
      raise exception 'Column public.lesson_progress.lesson_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_progress'
    and c.column_name = 'status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lesson_progress";
    if row_count = 0 then
      alter table public."lesson_progress" alter column "status" drop default;
      alter table public."lesson_progress" alter column "status" type text using "status"::text;
    else
      raise exception 'Column public.lesson_progress.status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_progress'
    and c.column_name = 'started_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."lesson_progress";
    if row_count = 0 then
      alter table public."lesson_progress" alter column "started_at" drop default;
      alter table public."lesson_progress" alter column "started_at" type timestamptz using "started_at"::timestamptz;
    else
      raise exception 'Column public.lesson_progress.started_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_progress'
    and c.column_name = 'completed_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."lesson_progress";
    if row_count = 0 then
      alter table public."lesson_progress" alter column "completed_at" drop default;
      alter table public."lesson_progress" alter column "completed_at" type timestamptz using "completed_at"::timestamptz;
    else
      raise exception 'Column public.lesson_progress.completed_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_progress'
    and c.column_name = 'last_activity_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."lesson_progress";
    if row_count = 0 then
      alter table public."lesson_progress" alter column "last_activity_at" drop default;
      alter table public."lesson_progress" alter column "last_activity_at" type timestamptz using "last_activity_at"::timestamptz;
    else
      raise exception 'Column public.lesson_progress.last_activity_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'mastery_records'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."mastery_records";
    if row_count = 0 then
      alter table public."mastery_records" alter column "id" drop default;
      alter table public."mastery_records" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.mastery_records.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'mastery_records'
    and c.column_name = 'student_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."mastery_records";
    if row_count = 0 then
      alter table public."mastery_records" alter column "student_id" drop default;
      alter table public."mastery_records" alter column "student_id" type text using "student_id"::text;
    else
      raise exception 'Column public.mastery_records.student_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'mastery_records'
    and c.column_name = 'lesson_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."mastery_records";
    if row_count = 0 then
      alter table public."mastery_records" alter column "lesson_id" drop default;
      alter table public."mastery_records" alter column "lesson_id" type text using "lesson_id"::text;
    else
      raise exception 'Column public.mastery_records.lesson_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'mastery_records'
    and c.column_name = 'skill_tag';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."mastery_records";
    if row_count = 0 then
      alter table public."mastery_records" alter column "skill_tag" drop default;
      alter table public."mastery_records" alter column "skill_tag" type text using "skill_tag"::text;
    else
      raise exception 'Column public.mastery_records.skill_tag has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'mastery_records'
    and c.column_name = 'score';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."mastery_records";
    if row_count = 0 then
      alter table public."mastery_records" alter column "score" drop default;
      alter table public."mastery_records" alter column "score" type integer using "score"::integer;
    else
      raise exception 'Column public.mastery_records.score has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'mastery_records'
    and c.column_name = 'status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."mastery_records";
    if row_count = 0 then
      alter table public."mastery_records" alter column "status" drop default;
      alter table public."mastery_records" alter column "status" type text using "status"::text;
    else
      raise exception 'Column public.mastery_records.status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'mastery_records'
    and c.column_name = 'attempts';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."mastery_records";
    if row_count = 0 then
      alter table public."mastery_records" alter column "attempts" drop default;
      alter table public."mastery_records" alter column "attempts" type integer using "attempts"::integer;
    else
      raise exception 'Column public.mastery_records.attempts has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'mastery_records'
    and c.column_name = 'evidence';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."mastery_records";
    if row_count = 0 then
      alter table public."mastery_records" alter column "evidence" drop default;
      alter table public."mastery_records" alter column "evidence" type text using "evidence"::text;
    else
      raise exception 'Column public.mastery_records.evidence has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'mastery_records'
    and c.column_name = 'updated_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."mastery_records";
    if row_count = 0 then
      alter table public."mastery_records" alter column "updated_at" drop default;
      alter table public."mastery_records" alter column "updated_at" type timestamptz using "updated_at"::timestamptz;
    else
      raise exception 'Column public.mastery_records.updated_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_scratchpads'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lesson_scratchpads";
    if row_count = 0 then
      alter table public."lesson_scratchpads" alter column "id" drop default;
      alter table public."lesson_scratchpads" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.lesson_scratchpads.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_scratchpads'
    and c.column_name = 'student_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lesson_scratchpads";
    if row_count = 0 then
      alter table public."lesson_scratchpads" alter column "student_id" drop default;
      alter table public."lesson_scratchpads" alter column "student_id" type text using "student_id"::text;
    else
      raise exception 'Column public.lesson_scratchpads.student_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_scratchpads'
    and c.column_name = 'lesson_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lesson_scratchpads";
    if row_count = 0 then
      alter table public."lesson_scratchpads" alter column "lesson_id" drop default;
      alter table public."lesson_scratchpads" alter column "lesson_id" type text using "lesson_id"::text;
    else
      raise exception 'Column public.lesson_scratchpads.lesson_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_scratchpads'
    and c.column_name = 'first_step';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lesson_scratchpads";
    if row_count = 0 then
      alter table public."lesson_scratchpads" alter column "first_step" drop default;
      alter table public."lesson_scratchpads" alter column "first_step" type text using "first_step"::text;
    else
      raise exception 'Column public.lesson_scratchpads.first_step has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_scratchpads'
    and c.column_name = 'explanation';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lesson_scratchpads";
    if row_count = 0 then
      alter table public."lesson_scratchpads" alter column "explanation" drop default;
      alter table public."lesson_scratchpads" alter column "explanation" type text using "explanation"::text;
    else
      raise exception 'Column public.lesson_scratchpads.explanation has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_scratchpads'
    and c.column_name = 'confusion';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lesson_scratchpads";
    if row_count = 0 then
      alter table public."lesson_scratchpads" alter column "confusion" drop default;
      alter table public."lesson_scratchpads" alter column "confusion" type text using "confusion"::text;
    else
      raise exception 'Column public.lesson_scratchpads.confusion has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_scratchpads'
    and c.column_name = 'retry_after_hint';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lesson_scratchpads";
    if row_count = 0 then
      alter table public."lesson_scratchpads" alter column "retry_after_hint" drop default;
      alter table public."lesson_scratchpads" alter column "retry_after_hint" type text using "retry_after_hint"::text;
    else
      raise exception 'Column public.lesson_scratchpads.retry_after_hint has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_scratchpads'
    and c.column_name = 'tutor_review_count';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."lesson_scratchpads";
    if row_count = 0 then
      alter table public."lesson_scratchpads" alter column "tutor_review_count" drop default;
      alter table public."lesson_scratchpads" alter column "tutor_review_count" type integer using "tutor_review_count"::integer;
    else
      raise exception 'Column public.lesson_scratchpads.tutor_review_count has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_scratchpads'
    and c.column_name = 'updated_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."lesson_scratchpads";
    if row_count = 0 then
      alter table public."lesson_scratchpads" alter column "updated_at" drop default;
      alter table public."lesson_scratchpads" alter column "updated_at" type timestamptz using "updated_at"::timestamptz;
    else
      raise exception 'Column public.lesson_scratchpads.updated_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'interactive_skill_evidence'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."interactive_skill_evidence";
    if row_count = 0 then
      alter table public."interactive_skill_evidence" alter column "id" drop default;
      alter table public."interactive_skill_evidence" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.interactive_skill_evidence.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'interactive_skill_evidence'
    and c.column_name = 'student_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."interactive_skill_evidence";
    if row_count = 0 then
      alter table public."interactive_skill_evidence" alter column "student_id" drop default;
      alter table public."interactive_skill_evidence" alter column "student_id" type text using "student_id"::text;
    else
      raise exception 'Column public.interactive_skill_evidence.student_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'interactive_skill_evidence'
    and c.column_name = 'lesson_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."interactive_skill_evidence";
    if row_count = 0 then
      alter table public."interactive_skill_evidence" alter column "lesson_id" drop default;
      alter table public."interactive_skill_evidence" alter column "lesson_id" type text using "lesson_id"::text;
    else
      raise exception 'Column public.interactive_skill_evidence.lesson_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'interactive_skill_evidence'
    and c.column_name = 'widget_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."interactive_skill_evidence";
    if row_count = 0 then
      alter table public."interactive_skill_evidence" alter column "widget_id" drop default;
      alter table public."interactive_skill_evidence" alter column "widget_id" type text using "widget_id"::text;
    else
      raise exception 'Column public.interactive_skill_evidence.widget_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'interactive_skill_evidence'
    and c.column_name = 'skill_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."interactive_skill_evidence";
    if row_count = 0 then
      alter table public."interactive_skill_evidence" alter column "skill_id" drop default;
      alter table public."interactive_skill_evidence" alter column "skill_id" type text using "skill_id"::text;
    else
      raise exception 'Column public.interactive_skill_evidence.skill_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'interactive_skill_evidence'
    and c.column_name = 'skill_label';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."interactive_skill_evidence";
    if row_count = 0 then
      alter table public."interactive_skill_evidence" alter column "skill_label" drop default;
      alter table public."interactive_skill_evidence" alter column "skill_label" type text using "skill_label"::text;
    else
      raise exception 'Column public.interactive_skill_evidence.skill_label has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'interactive_skill_evidence'
    and c.column_name = 'status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."interactive_skill_evidence";
    if row_count = 0 then
      alter table public."interactive_skill_evidence" alter column "status" drop default;
      alter table public."interactive_skill_evidence" alter column "status" type text using "status"::text;
    else
      raise exception 'Column public.interactive_skill_evidence.status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'interactive_skill_evidence'
    and c.column_name = 'correct';
  if actual_type is not null and actual_type <> 'bool' then
    select count(*) into row_count from public."interactive_skill_evidence";
    if row_count = 0 then
      alter table public."interactive_skill_evidence" alter column "correct" drop default;
      alter table public."interactive_skill_evidence" alter column "correct" type boolean using "correct"::boolean;
  alter table public."interactive_skill_evidence" alter column "correct" set default false;
    else
      raise exception 'Column public.interactive_skill_evidence.correct has type %, expected bool, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'interactive_skill_evidence'
    and c.column_name = 'attempts';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."interactive_skill_evidence";
    if row_count = 0 then
      alter table public."interactive_skill_evidence" alter column "attempts" drop default;
      alter table public."interactive_skill_evidence" alter column "attempts" type integer using "attempts"::integer;
    else
      raise exception 'Column public.interactive_skill_evidence.attempts has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'interactive_skill_evidence'
    and c.column_name = 'value';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."interactive_skill_evidence";
    if row_count = 0 then
      alter table public."interactive_skill_evidence" alter column "value" drop default;
      alter table public."interactive_skill_evidence" alter column "value" type jsonb using "value"::jsonb;
  alter table public."interactive_skill_evidence" alter column "value" set default '[]'::jsonb;
    else
      raise exception 'Column public.interactive_skill_evidence.value has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'interactive_skill_evidence'
    and c.column_name = 'diagnosis';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."interactive_skill_evidence";
    if row_count = 0 then
      alter table public."interactive_skill_evidence" alter column "diagnosis" drop default;
      alter table public."interactive_skill_evidence" alter column "diagnosis" type text using "diagnosis"::text;
    else
      raise exception 'Column public.interactive_skill_evidence.diagnosis has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'interactive_skill_evidence'
    and c.column_name = 'recommended_support';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."interactive_skill_evidence";
    if row_count = 0 then
      alter table public."interactive_skill_evidence" alter column "recommended_support" drop default;
      alter table public."interactive_skill_evidence" alter column "recommended_support" type text using "recommended_support"::text;
    else
      raise exception 'Column public.interactive_skill_evidence.recommended_support has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'interactive_skill_evidence'
    and c.column_name = 'evidence_strength';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."interactive_skill_evidence";
    if row_count = 0 then
      alter table public."interactive_skill_evidence" alter column "evidence_strength" drop default;
      alter table public."interactive_skill_evidence" alter column "evidence_strength" type text using "evidence_strength"::text;
    else
      raise exception 'Column public.interactive_skill_evidence.evidence_strength has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'interactive_skill_evidence'
    and c.column_name = 'updated_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."interactive_skill_evidence";
    if row_count = 0 then
      alter table public."interactive_skill_evidence" alter column "updated_at" drop default;
      alter table public."interactive_skill_evidence" alter column "updated_at" type timestamptz using "updated_at"::timestamptz;
    else
      raise exception 'Column public.interactive_skill_evidence.updated_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'standards'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."standards";
    if row_count = 0 then
      alter table public."standards" alter column "id" drop default;
      alter table public."standards" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.standards.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'standards'
    and c.column_name = 'name';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."standards";
    if row_count = 0 then
      alter table public."standards" alter column "name" drop default;
      alter table public."standards" alter column "name" type text using "name"::text;
    else
      raise exception 'Column public.standards.name has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'standards'
    and c.column_name = 'subjects';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."standards";
    if row_count = 0 then
      alter table public."standards" alter column "subjects" drop default;
      alter table public."standards" alter column "subjects" type jsonb using "subjects"::jsonb;
  alter table public."standards" alter column "subjects" set default '[]'::jsonb;
    else
      raise exception 'Column public.standards.subjects has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'standards'
    and c.column_name = 'purpose';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."standards";
    if row_count = 0 then
      alter table public."standards" alter column "purpose" drop default;
      alter table public."standards" alter column "purpose" type text using "purpose"::text;
    else
      raise exception 'Column public.standards.purpose has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'standards'
    and c.column_name = 'source_url';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."standards";
    if row_count = 0 then
      alter table public."standards" alter column "source_url" drop default;
      alter table public."standards" alter column "source_url" type text using "source_url"::text;
    else
      raise exception 'Column public.standards.source_url has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'standards'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."standards";
    if row_count = 0 then
      alter table public."standards" alter column "created_at" drop default;
      alter table public."standards" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.standards.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_standards'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lesson_standards";
    if row_count = 0 then
      alter table public."lesson_standards" alter column "id" drop default;
      alter table public."lesson_standards" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.lesson_standards.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_standards'
    and c.column_name = 'lesson_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lesson_standards";
    if row_count = 0 then
      alter table public."lesson_standards" alter column "lesson_id" drop default;
      alter table public."lesson_standards" alter column "lesson_id" type text using "lesson_id"::text;
    else
      raise exception 'Column public.lesson_standards.lesson_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_standards'
    and c.column_name = 'standard_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lesson_standards";
    if row_count = 0 then
      alter table public."lesson_standards" alter column "standard_id" drop default;
      alter table public."lesson_standards" alter column "standard_id" type text using "standard_id"::text;
    else
      raise exception 'Column public.lesson_standards.standard_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_standards'
    and c.column_name = 'tag';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lesson_standards";
    if row_count = 0 then
      alter table public."lesson_standards" alter column "tag" drop default;
      alter table public."lesson_standards" alter column "tag" type text using "tag"::text;
    else
      raise exception 'Column public.lesson_standards.tag has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_standards'
    and c.column_name = 'alignment_note';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lesson_standards";
    if row_count = 0 then
      alter table public."lesson_standards" alter column "alignment_note" drop default;
      alter table public."lesson_standards" alter column "alignment_note" type text using "alignment_note"::text;
    else
      raise exception 'Column public.lesson_standards.alignment_note has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'assignments'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."assignments";
    if row_count = 0 then
      alter table public."assignments" alter column "id" drop default;
      alter table public."assignments" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.assignments.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'assignments'
    and c.column_name = 'student_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."assignments";
    if row_count = 0 then
      alter table public."assignments" alter column "student_id" drop default;
      alter table public."assignments" alter column "student_id" type text using "student_id"::text;
    else
      raise exception 'Column public.assignments.student_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'assignments'
    and c.column_name = 'lesson_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."assignments";
    if row_count = 0 then
      alter table public."assignments" alter column "lesson_id" drop default;
      alter table public."assignments" alter column "lesson_id" type text using "lesson_id"::text;
    else
      raise exception 'Column public.assignments.lesson_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'assignments'
    and c.column_name = 'assigned_by_user_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."assignments";
    if row_count = 0 then
      alter table public."assignments" alter column "assigned_by_user_id" drop default;
      alter table public."assignments" alter column "assigned_by_user_id" type text using "assigned_by_user_id"::text;
    else
      raise exception 'Column public.assignments.assigned_by_user_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'assignments'
    and c.column_name = 'title';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."assignments";
    if row_count = 0 then
      alter table public."assignments" alter column "title" drop default;
      alter table public."assignments" alter column "title" type text using "title"::text;
    else
      raise exception 'Column public.assignments.title has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'assignments'
    and c.column_name = 'due_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."assignments";
    if row_count = 0 then
      alter table public."assignments" alter column "due_at" drop default;
      alter table public."assignments" alter column "due_at" type timestamptz using "due_at"::timestamptz;
    else
      raise exception 'Column public.assignments.due_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'assignments'
    and c.column_name = 'status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."assignments";
    if row_count = 0 then
      alter table public."assignments" alter column "status" drop default;
      alter table public."assignments" alter column "status" type text using "status"::text;
    else
      raise exception 'Column public.assignments.status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'assignments'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."assignments";
    if row_count = 0 then
      alter table public."assignments" alter column "created_at" drop default;
      alter table public."assignments" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.assignments.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'portfolio_items'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."portfolio_items";
    if row_count = 0 then
      alter table public."portfolio_items" alter column "id" drop default;
      alter table public."portfolio_items" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.portfolio_items.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'portfolio_items'
    and c.column_name = 'student_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."portfolio_items";
    if row_count = 0 then
      alter table public."portfolio_items" alter column "student_id" drop default;
      alter table public."portfolio_items" alter column "student_id" type text using "student_id"::text;
    else
      raise exception 'Column public.portfolio_items.student_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'portfolio_items'
    and c.column_name = 'lesson_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."portfolio_items";
    if row_count = 0 then
      alter table public."portfolio_items" alter column "lesson_id" drop default;
      alter table public."portfolio_items" alter column "lesson_id" type text using "lesson_id"::text;
    else
      raise exception 'Column public.portfolio_items.lesson_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'portfolio_items'
    and c.column_name = 'title';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."portfolio_items";
    if row_count = 0 then
      alter table public."portfolio_items" alter column "title" drop default;
      alter table public."portfolio_items" alter column "title" type text using "title"::text;
    else
      raise exception 'Column public.portfolio_items.title has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'portfolio_items'
    and c.column_name = 'artifact_type';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."portfolio_items";
    if row_count = 0 then
      alter table public."portfolio_items" alter column "artifact_type" drop default;
      alter table public."portfolio_items" alter column "artifact_type" type text using "artifact_type"::text;
    else
      raise exception 'Column public.portfolio_items.artifact_type has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'portfolio_items'
    and c.column_name = 'source';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."portfolio_items";
    if row_count = 0 then
      alter table public."portfolio_items" alter column "source" drop default;
      alter table public."portfolio_items" alter column "source" type text using "source"::text;
    else
      raise exception 'Column public.portfolio_items.source has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'portfolio_items'
    and c.column_name = 'visibility';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."portfolio_items";
    if row_count = 0 then
      alter table public."portfolio_items" alter column "visibility" drop default;
      alter table public."portfolio_items" alter column "visibility" type text using "visibility"::text;
    else
      raise exception 'Column public.portfolio_items.visibility has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'portfolio_items'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."portfolio_items";
    if row_count = 0 then
      alter table public."portfolio_items" alter column "created_at" drop default;
      alter table public."portfolio_items" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.portfolio_items.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'badges'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."badges";
    if row_count = 0 then
      alter table public."badges" alter column "id" drop default;
      alter table public."badges" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.badges.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'badges'
    and c.column_name = 'title';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."badges";
    if row_count = 0 then
      alter table public."badges" alter column "title" drop default;
      alter table public."badges" alter column "title" type text using "title"::text;
    else
      raise exception 'Column public.badges.title has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'badges'
    and c.column_name = 'category';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."badges";
    if row_count = 0 then
      alter table public."badges" alter column "category" drop default;
      alter table public."badges" alter column "category" type text using "category"::text;
    else
      raise exception 'Column public.badges.category has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'badges'
    and c.column_name = 'requirement';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."badges";
    if row_count = 0 then
      alter table public."badges" alter column "requirement" drop default;
      alter table public."badges" alter column "requirement" type text using "requirement"::text;
    else
      raise exception 'Column public.badges.requirement has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'badges'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."badges";
    if row_count = 0 then
      alter table public."badges" alter column "created_at" drop default;
      alter table public."badges" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.badges.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'student_badges'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."student_badges";
    if row_count = 0 then
      alter table public."student_badges" alter column "id" drop default;
      alter table public."student_badges" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.student_badges.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'student_badges'
    and c.column_name = 'student_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."student_badges";
    if row_count = 0 then
      alter table public."student_badges" alter column "student_id" drop default;
      alter table public."student_badges" alter column "student_id" type text using "student_id"::text;
    else
      raise exception 'Column public.student_badges.student_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'student_badges'
    and c.column_name = 'badge_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."student_badges";
    if row_count = 0 then
      alter table public."student_badges" alter column "badge_id" drop default;
      alter table public."student_badges" alter column "badge_id" type text using "badge_id"::text;
    else
      raise exception 'Column public.student_badges.badge_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'student_badges'
    and c.column_name = 'lesson_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."student_badges";
    if row_count = 0 then
      alter table public."student_badges" alter column "lesson_id" drop default;
      alter table public."student_badges" alter column "lesson_id" type text using "lesson_id"::text;
    else
      raise exception 'Column public.student_badges.lesson_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'student_badges'
    and c.column_name = 'earned_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."student_badges";
    if row_count = 0 then
      alter table public."student_badges" alter column "earned_at" drop default;
      alter table public."student_badges" alter column "earned_at" type timestamptz using "earned_at"::timestamptz;
    else
      raise exception 'Column public.student_badges.earned_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'student_badges'
    and c.column_name = 'evidence';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."student_badges";
    if row_count = 0 then
      alter table public."student_badges" alter column "evidence" drop default;
      alter table public."student_badges" alter column "evidence" type text using "evidence"::text;
    else
      raise exception 'Column public.student_badges.evidence has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'reward_approvals'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."reward_approvals";
    if row_count = 0 then
      alter table public."reward_approvals" alter column "id" drop default;
      alter table public."reward_approvals" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.reward_approvals.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'reward_approvals'
    and c.column_name = 'student_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."reward_approvals";
    if row_count = 0 then
      alter table public."reward_approvals" alter column "student_id" drop default;
      alter table public."reward_approvals" alter column "student_id" type text using "student_id"::text;
    else
      raise exception 'Column public.reward_approvals.student_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'reward_approvals'
    and c.column_name = 'guardian_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."reward_approvals";
    if row_count = 0 then
      alter table public."reward_approvals" alter column "guardian_id" drop default;
      alter table public."reward_approvals" alter column "guardian_id" type text using "guardian_id"::text;
    else
      raise exception 'Column public.reward_approvals.guardian_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'reward_approvals'
    and c.column_name = 'reward_level';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."reward_approvals";
    if row_count = 0 then
      alter table public."reward_approvals" alter column "reward_level" drop default;
      alter table public."reward_approvals" alter column "reward_level" type integer using "reward_level"::integer;
    else
      raise exception 'Column public.reward_approvals.reward_level has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'reward_approvals'
    and c.column_name = 'reward_title';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."reward_approvals";
    if row_count = 0 then
      alter table public."reward_approvals" alter column "reward_title" drop default;
      alter table public."reward_approvals" alter column "reward_title" type text using "reward_title"::text;
    else
      raise exception 'Column public.reward_approvals.reward_title has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'reward_approvals'
    and c.column_name = 'reward_benefit';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."reward_approvals";
    if row_count = 0 then
      alter table public."reward_approvals" alter column "reward_benefit" drop default;
      alter table public."reward_approvals" alter column "reward_benefit" type text using "reward_benefit"::text;
    else
      raise exception 'Column public.reward_approvals.reward_benefit has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'reward_approvals'
    and c.column_name = 'status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."reward_approvals";
    if row_count = 0 then
      alter table public."reward_approvals" alter column "status" drop default;
      alter table public."reward_approvals" alter column "status" type text using "status"::text;
    else
      raise exception 'Column public.reward_approvals.status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'reward_approvals'
    and c.column_name = 'requested_by';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."reward_approvals";
    if row_count = 0 then
      alter table public."reward_approvals" alter column "requested_by" drop default;
      alter table public."reward_approvals" alter column "requested_by" type text using "requested_by"::text;
    else
      raise exception 'Column public.reward_approvals.requested_by has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'reward_approvals'
    and c.column_name = 'requested_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."reward_approvals";
    if row_count = 0 then
      alter table public."reward_approvals" alter column "requested_at" drop default;
      alter table public."reward_approvals" alter column "requested_at" type timestamptz using "requested_at"::timestamptz;
    else
      raise exception 'Column public.reward_approvals.requested_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'reward_approvals'
    and c.column_name = 'reviewed_by';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."reward_approvals";
    if row_count = 0 then
      alter table public."reward_approvals" alter column "reviewed_by" drop default;
      alter table public."reward_approvals" alter column "reviewed_by" type text using "reviewed_by"::text;
    else
      raise exception 'Column public.reward_approvals.reviewed_by has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'reward_approvals'
    and c.column_name = 'reviewed_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."reward_approvals";
    if row_count = 0 then
      alter table public."reward_approvals" alter column "reviewed_at" drop default;
      alter table public."reward_approvals" alter column "reviewed_at" type timestamptz using "reviewed_at"::timestamptz;
    else
      raise exception 'Column public.reward_approvals.reviewed_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'reward_approvals'
    and c.column_name = 'evidence';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."reward_approvals";
    if row_count = 0 then
      alter table public."reward_approvals" alter column "evidence" drop default;
      alter table public."reward_approvals" alter column "evidence" type text using "evidence"::text;
    else
      raise exception 'Column public.reward_approvals.evidence has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'reward_approvals'
    and c.column_name = 'parent_note';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."reward_approvals";
    if row_count = 0 then
      alter table public."reward_approvals" alter column "parent_note" drop default;
      alter table public."reward_approvals" alter column "parent_note" type text using "parent_note"::text;
    else
      raise exception 'Column public.reward_approvals.parent_note has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'reward_approvals'
    and c.column_name = 'fulfillment_provider';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."reward_approvals";
    if row_count = 0 then
      alter table public."reward_approvals" alter column "fulfillment_provider" drop default;
      alter table public."reward_approvals" alter column "fulfillment_provider" type text using "fulfillment_provider"::text;
    else
      raise exception 'Column public.reward_approvals.fulfillment_provider has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'reward_approvals'
    and c.column_name = 'fulfillment_status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."reward_approvals";
    if row_count = 0 then
      alter table public."reward_approvals" alter column "fulfillment_status" drop default;
      alter table public."reward_approvals" alter column "fulfillment_status" type text using "fulfillment_status"::text;
    else
      raise exception 'Column public.reward_approvals.fulfillment_status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'reward_approvals'
    and c.column_name = 'fulfillment_reference';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."reward_approvals";
    if row_count = 0 then
      alter table public."reward_approvals" alter column "fulfillment_reference" drop default;
      alter table public."reward_approvals" alter column "fulfillment_reference" type text using "fulfillment_reference"::text;
    else
      raise exception 'Column public.reward_approvals.fulfillment_reference has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'reward_approvals'
    and c.column_name = 'fulfillment_requested_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."reward_approvals";
    if row_count = 0 then
      alter table public."reward_approvals" alter column "fulfillment_requested_at" drop default;
      alter table public."reward_approvals" alter column "fulfillment_requested_at" type timestamptz using "fulfillment_requested_at"::timestamptz;
    else
      raise exception 'Column public.reward_approvals.fulfillment_requested_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'reward_approvals'
    and c.column_name = 'fulfillment_completed_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."reward_approvals";
    if row_count = 0 then
      alter table public."reward_approvals" alter column "fulfillment_completed_at" drop default;
      alter table public."reward_approvals" alter column "fulfillment_completed_at" type timestamptz using "fulfillment_completed_at"::timestamptz;
    else
      raise exception 'Column public.reward_approvals.fulfillment_completed_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'reward_approvals'
    and c.column_name = 'source';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."reward_approvals";
    if row_count = 0 then
      alter table public."reward_approvals" alter column "source" drop default;
      alter table public."reward_approvals" alter column "source" type text using "source"::text;
    else
      raise exception 'Column public.reward_approvals.source has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "id" drop default;
      alter table public."content_drafts" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.content_drafts.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'academy_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "academy_id" drop default;
      alter table public."content_drafts" alter column "academy_id" type text using "academy_id"::text;
    else
      raise exception 'Column public.content_drafts.academy_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'grade';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "grade" drop default;
      alter table public."content_drafts" alter column "grade" type text using "grade"::text;
    else
      raise exception 'Column public.content_drafts.grade has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'subject_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "subject_id" drop default;
      alter table public."content_drafts" alter column "subject_id" type text using "subject_id"::text;
    else
      raise exception 'Column public.content_drafts.subject_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'title';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "title" drop default;
      alter table public."content_drafts" alter column "title" type text using "title"::text;
    else
      raise exception 'Column public.content_drafts.title has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'objective';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "objective" drop default;
      alter table public."content_drafts" alter column "objective" type text using "objective"::text;
    else
      raise exception 'Column public.content_drafts.objective has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'unit_title';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "unit_title" drop default;
      alter table public."content_drafts" alter column "unit_title" type text using "unit_title"::text;
    else
      raise exception 'Column public.content_drafts.unit_title has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'standards_tags';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "standards_tags" drop default;
      alter table public."content_drafts" alter column "standards_tags" type jsonb using "standards_tags"::jsonb;
  alter table public."content_drafts" alter column "standards_tags" set default '[]'::jsonb;
    else
      raise exception 'Column public.content_drafts.standards_tags has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'essential_question';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "essential_question" drop default;
      alter table public."content_drafts" alter column "essential_question" type text using "essential_question"::text;
    else
      raise exception 'Column public.content_drafts.essential_question has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'student_summary';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "student_summary" drop default;
      alter table public."content_drafts" alter column "student_summary" type text using "student_summary"::text;
    else
      raise exception 'Column public.content_drafts.student_summary has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'why_it_matters';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "why_it_matters" drop default;
      alter table public."content_drafts" alter column "why_it_matters" type text using "why_it_matters"::text;
    else
      raise exception 'Column public.content_drafts.why_it_matters has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'vocabulary_terms';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "vocabulary_terms" drop default;
      alter table public."content_drafts" alter column "vocabulary_terms" type jsonb using "vocabulary_terms"::jsonb;
  alter table public."content_drafts" alter column "vocabulary_terms" set default '[]'::jsonb;
    else
      raise exception 'Column public.content_drafts.vocabulary_terms has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'prerequisite_skills';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "prerequisite_skills" drop default;
      alter table public."content_drafts" alter column "prerequisite_skills" type jsonb using "prerequisite_skills"::jsonb;
  alter table public."content_drafts" alter column "prerequisite_skills" set default '[]'::jsonb;
    else
      raise exception 'Column public.content_drafts.prerequisite_skills has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'lesson_sections';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "lesson_sections" drop default;
      alter table public."content_drafts" alter column "lesson_sections" type jsonb using "lesson_sections"::jsonb;
  alter table public."content_drafts" alter column "lesson_sections" set default '[]'::jsonb;
    else
      raise exception 'Column public.content_drafts.lesson_sections has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'helper_notes';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "helper_notes" drop default;
      alter table public."content_drafts" alter column "helper_notes" type jsonb using "helper_notes"::jsonb;
  alter table public."content_drafts" alter column "helper_notes" set default '[]'::jsonb;
    else
      raise exception 'Column public.content_drafts.helper_notes has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'common_misunderstandings';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "common_misunderstandings" drop default;
      alter table public."content_drafts" alter column "common_misunderstandings" type jsonb using "common_misunderstandings"::jsonb;
  alter table public."content_drafts" alter column "common_misunderstandings" set default '[]'::jsonb;
    else
      raise exception 'Column public.content_drafts.common_misunderstandings has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'visual_supports';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "visual_supports" drop default;
      alter table public."content_drafts" alter column "visual_supports" type jsonb using "visual_supports"::jsonb;
  alter table public."content_drafts" alter column "visual_supports" set default '[]'::jsonb;
    else
      raise exception 'Column public.content_drafts.visual_supports has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'quiz_questions';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "quiz_questions" drop default;
      alter table public."content_drafts" alter column "quiz_questions" type jsonb using "quiz_questions"::jsonb;
  alter table public."content_drafts" alter column "quiz_questions" set default '[]'::jsonb;
    else
      raise exception 'Column public.content_drafts.quiz_questions has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'source_cards';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "source_cards" drop default;
      alter table public."content_drafts" alter column "source_cards" type jsonb using "source_cards"::jsonb;
  alter table public."content_drafts" alter column "source_cards" set default '[]'::jsonb;
    else
      raise exception 'Column public.content_drafts.source_cards has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'group_homework';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "group_homework" drop default;
      alter table public."content_drafts" alter column "group_homework" type jsonb using "group_homework"::jsonb;
  alter table public."content_drafts" alter column "group_homework" set default '[]'::jsonb;
    else
      raise exception 'Column public.content_drafts.group_homework has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "status" drop default;
      alter table public."content_drafts" alter column "status" type text using "status"::text;
    else
      raise exception 'Column public.content_drafts.status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'blocked_reason';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "blocked_reason" drop default;
      alter table public."content_drafts" alter column "blocked_reason" type text using "blocked_reason"::text;
    else
      raise exception 'Column public.content_drafts.blocked_reason has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'review_notes';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "review_notes" drop default;
      alter table public."content_drafts" alter column "review_notes" type text using "review_notes"::text;
    else
      raise exception 'Column public.content_drafts.review_notes has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'accessibility_notes';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "accessibility_notes" drop default;
      alter table public."content_drafts" alter column "accessibility_notes" type text using "accessibility_notes"::text;
    else
      raise exception 'Column public.content_drafts.accessibility_notes has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'age_fit_notes';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "age_fit_notes" drop default;
      alter table public."content_drafts" alter column "age_fit_notes" type text using "age_fit_notes"::text;
    else
      raise exception 'Column public.content_drafts.age_fit_notes has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'lesson_body_ready';
  if actual_type is not null and actual_type <> 'bool' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "lesson_body_ready" drop default;
      alter table public."content_drafts" alter column "lesson_body_ready" type boolean using "lesson_body_ready"::boolean;
  alter table public."content_drafts" alter column "lesson_body_ready" set default false;
    else
      raise exception 'Column public.content_drafts.lesson_body_ready has type %, expected bool, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'teaching_completeness_status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "teaching_completeness_status" drop default;
      alter table public."content_drafts" alter column "teaching_completeness_status" type text using "teaching_completeness_status"::text;
    else
      raise exception 'Column public.content_drafts.teaching_completeness_status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'teaching_completeness_issues';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "teaching_completeness_issues" drop default;
      alter table public."content_drafts" alter column "teaching_completeness_issues" type jsonb using "teaching_completeness_issues"::jsonb;
  alter table public."content_drafts" alter column "teaching_completeness_issues" set default '[]'::jsonb;
    else
      raise exception 'Column public.content_drafts.teaching_completeness_issues has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'source_lesson_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "source_lesson_id" drop default;
      alter table public."content_drafts" alter column "source_lesson_id" type text using "source_lesson_id"::text;
    else
      raise exception 'Column public.content_drafts.source_lesson_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'source_tool_call_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "source_tool_call_id" drop default;
      alter table public."content_drafts" alter column "source_tool_call_id" type text using "source_tool_call_id"::text;
    else
      raise exception 'Column public.content_drafts.source_tool_call_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'redesign_task_ids';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "redesign_task_ids" drop default;
      alter table public."content_drafts" alter column "redesign_task_ids" type jsonb using "redesign_task_ids"::jsonb;
  alter table public."content_drafts" alter column "redesign_task_ids" set default '[]'::jsonb;
    else
      raise exception 'Column public.content_drafts.redesign_task_ids has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'research_source_ids';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "research_source_ids" drop default;
      alter table public."content_drafts" alter column "research_source_ids" type jsonb using "research_source_ids"::jsonb;
  alter table public."content_drafts" alter column "research_source_ids" set default '[]'::jsonb;
    else
      raise exception 'Column public.content_drafts.research_source_ids has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'truth_score';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "truth_score" drop default;
      alter table public."content_drafts" alter column "truth_score" type integer using "truth_score"::integer;
    else
      raise exception 'Column public.content_drafts.truth_score has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'truth_issues';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "truth_issues" drop default;
      alter table public."content_drafts" alter column "truth_issues" type jsonb using "truth_issues"::jsonb;
  alter table public."content_drafts" alter column "truth_issues" set default '[]'::jsonb;
    else
      raise exception 'Column public.content_drafts.truth_issues has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'needs_external_research';
  if actual_type is not null and actual_type <> 'bool' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "needs_external_research" drop default;
      alter table public."content_drafts" alter column "needs_external_research" type boolean using "needs_external_research"::boolean;
  alter table public."content_drafts" alter column "needs_external_research" set default false;
    else
      raise exception 'Column public.content_drafts.needs_external_research has type %, expected bool, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'truth_review_status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "truth_review_status" drop default;
      alter table public."content_drafts" alter column "truth_review_status" type text using "truth_review_status"::text;
    else
      raise exception 'Column public.content_drafts.truth_review_status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'latest_review';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "latest_review" drop default;
      alter table public."content_drafts" alter column "latest_review" type jsonb using "latest_review"::jsonb;
  alter table public."content_drafts" alter column "latest_review" set default '{}'::jsonb;
    else
      raise exception 'Column public.content_drafts.latest_review has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'review_history';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "review_history" drop default;
      alter table public."content_drafts" alter column "review_history" type jsonb using "review_history"::jsonb;
  alter table public."content_drafts" alter column "review_history" set default '[]'::jsonb;
    else
      raise exception 'Column public.content_drafts.review_history has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'review_version';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "review_version" drop default;
      alter table public."content_drafts" alter column "review_version" type integer using "review_version"::integer;
    else
      raise exception 'Column public.content_drafts.review_version has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "created_at" drop default;
      alter table public."content_drafts" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.content_drafts.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_drafts'
    and c.column_name = 'updated_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."content_drafts";
    if row_count = 0 then
      alter table public."content_drafts" alter column "updated_at" drop default;
      alter table public."content_drafts" alter column "updated_at" type timestamptz using "updated_at"::timestamptz;
    else
      raise exception 'Column public.content_drafts.updated_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "id" drop default;
      alter table public."content_batch_reviews" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.content_batch_reviews.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'source_batch_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "source_batch_id" drop default;
      alter table public."content_batch_reviews" alter column "source_batch_id" type text using "source_batch_id"::text;
    else
      raise exception 'Column public.content_batch_reviews.source_batch_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'academy_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "academy_id" drop default;
      alter table public."content_batch_reviews" alter column "academy_id" type text using "academy_id"::text;
    else
      raise exception 'Column public.content_batch_reviews.academy_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'grade_band';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "grade_band" drop default;
      alter table public."content_batch_reviews" alter column "grade_band" type text using "grade_band"::text;
    else
      raise exception 'Column public.content_batch_reviews.grade_band has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'grade_levels';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "grade_levels" drop default;
      alter table public."content_batch_reviews" alter column "grade_levels" type text using "grade_levels"::text;
    else
      raise exception 'Column public.content_batch_reviews.grade_levels has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'subjects';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "subjects" drop default;
      alter table public."content_batch_reviews" alter column "subjects" type jsonb using "subjects"::jsonb;
  alter table public."content_batch_reviews" alter column "subjects" set default '[]'::jsonb;
    else
      raise exception 'Column public.content_batch_reviews.subjects has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "status" drop default;
      alter table public."content_batch_reviews" alter column "status" type text using "status"::text;
    else
      raise exception 'Column public.content_batch_reviews.status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'decision';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "decision" drop default;
      alter table public."content_batch_reviews" alter column "decision" type text using "decision"::text;
    else
      raise exception 'Column public.content_batch_reviews.decision has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'total_lessons';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "total_lessons" drop default;
      alter table public."content_batch_reviews" alter column "total_lessons" type text using "total_lessons"::text;
    else
      raise exception 'Column public.content_batch_reviews.total_lessons has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'passed_lessons';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "passed_lessons" drop default;
      alter table public."content_batch_reviews" alter column "passed_lessons" type text using "passed_lessons"::text;
    else
      raise exception 'Column public.content_batch_reviews.passed_lessons has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'total_artifacts';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "total_artifacts" drop default;
      alter table public."content_batch_reviews" alter column "total_artifacts" type text using "total_artifacts"::text;
    else
      raise exception 'Column public.content_batch_reviews.total_artifacts has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'passed_artifacts';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "passed_artifacts" drop default;
      alter table public."content_batch_reviews" alter column "passed_artifacts" type text using "passed_artifacts"::text;
    else
      raise exception 'Column public.content_batch_reviews.passed_artifacts has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'score';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "score" drop default;
      alter table public."content_batch_reviews" alter column "score" type integer using "score"::integer;
    else
      raise exception 'Column public.content_batch_reviews.score has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'grade';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "grade" drop default;
      alter table public."content_batch_reviews" alter column "grade" type text using "grade"::text;
    else
      raise exception 'Column public.content_batch_reviews.grade has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'threshold';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "threshold" drop default;
      alter table public."content_batch_reviews" alter column "threshold" type integer using "threshold"::integer;
    else
      raise exception 'Column public.content_batch_reviews.threshold has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'passed';
  if actual_type is not null and actual_type <> 'bool' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "passed" drop default;
      alter table public."content_batch_reviews" alter column "passed" type boolean using "passed"::boolean;
  alter table public."content_batch_reviews" alter column "passed" set default false;
    else
      raise exception 'Column public.content_batch_reviews.passed has type %, expected bool, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'publish_eligible';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "publish_eligible" drop default;
      alter table public."content_batch_reviews" alter column "publish_eligible" type text using "publish_eligible"::text;
    else
      raise exception 'Column public.content_batch_reviews.publish_eligible has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'lesson_ids';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "lesson_ids" drop default;
      alter table public."content_batch_reviews" alter column "lesson_ids" type jsonb using "lesson_ids"::jsonb;
  alter table public."content_batch_reviews" alter column "lesson_ids" set default '[]'::jsonb;
    else
      raise exception 'Column public.content_batch_reviews.lesson_ids has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'visual_asset_ids';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "visual_asset_ids" drop default;
      alter table public."content_batch_reviews" alter column "visual_asset_ids" type jsonb using "visual_asset_ids"::jsonb;
  alter table public."content_batch_reviews" alter column "visual_asset_ids" set default '[]'::jsonb;
    else
      raise exception 'Column public.content_batch_reviews.visual_asset_ids has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'lesson_reports';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "lesson_reports" drop default;
      alter table public."content_batch_reviews" alter column "lesson_reports" type text using "lesson_reports"::text;
    else
      raise exception 'Column public.content_batch_reviews.lesson_reports has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'artifact_reports';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "artifact_reports" drop default;
      alter table public."content_batch_reviews" alter column "artifact_reports" type text using "artifact_reports"::text;
    else
      raise exception 'Column public.content_batch_reviews.artifact_reports has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'blocking_lessons';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "blocking_lessons" drop default;
      alter table public."content_batch_reviews" alter column "blocking_lessons" type text using "blocking_lessons"::text;
    else
      raise exception 'Column public.content_batch_reviews.blocking_lessons has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'blockers';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "blockers" drop default;
      alter table public."content_batch_reviews" alter column "blockers" type jsonb using "blockers"::jsonb;
  alter table public."content_batch_reviews" alter column "blockers" set default '[]'::jsonb;
    else
      raise exception 'Column public.content_batch_reviews.blockers has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'revision_instructions';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "revision_instructions" drop default;
      alter table public."content_batch_reviews" alter column "revision_instructions" type jsonb using "revision_instructions"::jsonb;
  alter table public."content_batch_reviews" alter column "revision_instructions" set default '[]'::jsonb;
    else
      raise exception 'Column public.content_batch_reviews.revision_instructions has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'review_history';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "review_history" drop default;
      alter table public."content_batch_reviews" alter column "review_history" type jsonb using "review_history"::jsonb;
  alter table public."content_batch_reviews" alter column "review_history" set default '[]'::jsonb;
    else
      raise exception 'Column public.content_batch_reviews.review_history has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'reviewed_by_user_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "reviewed_by_user_id" drop default;
      alter table public."content_batch_reviews" alter column "reviewed_by_user_id" type text using "reviewed_by_user_id"::text;
    else
      raise exception 'Column public.content_batch_reviews.reviewed_by_user_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'reviewed_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "reviewed_at" drop default;
      alter table public."content_batch_reviews" alter column "reviewed_at" type timestamptz using "reviewed_at"::timestamptz;
    else
      raise exception 'Column public.content_batch_reviews.reviewed_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "created_at" drop default;
      alter table public."content_batch_reviews" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.content_batch_reviews.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'content_batch_reviews'
    and c.column_name = 'updated_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."content_batch_reviews";
    if row_count = 0 then
      alter table public."content_batch_reviews" alter column "updated_at" drop default;
      alter table public."content_batch_reviews" alter column "updated_at" type timestamptz using "updated_at"::timestamptz;
    else
      raise exception 'Column public.content_batch_reviews.updated_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "id" drop default;
      alter table public."visual_assets" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.visual_assets.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'lesson_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "lesson_id" drop default;
      alter table public."visual_assets" alter column "lesson_id" type text using "lesson_id"::text;
    else
      raise exception 'Column public.visual_assets.lesson_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'draft_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "draft_id" drop default;
      alter table public."visual_assets" alter column "draft_id" type text using "draft_id"::text;
    else
      raise exception 'Column public.visual_assets.draft_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'asset_kind';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "asset_kind" drop default;
      alter table public."visual_assets" alter column "asset_kind" type text using "asset_kind"::text;
    else
      raise exception 'Column public.visual_assets.asset_kind has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'placement';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "placement" drop default;
      alter table public."visual_assets" alter column "placement" type text using "placement"::text;
    else
      raise exception 'Column public.visual_assets.placement has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'subject_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "subject_id" drop default;
      alter table public."visual_assets" alter column "subject_id" type text using "subject_id"::text;
    else
      raise exception 'Column public.visual_assets.subject_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'grade';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "grade" drop default;
      alter table public."visual_assets" alter column "grade" type text using "grade"::text;
    else
      raise exception 'Column public.visual_assets.grade has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'title';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "title" drop default;
      alter table public."visual_assets" alter column "title" type text using "title"::text;
    else
      raise exception 'Column public.visual_assets.title has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'asset_url';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "asset_url" drop default;
      alter table public."visual_assets" alter column "asset_url" type text using "asset_url"::text;
    else
      raise exception 'Column public.visual_assets.asset_url has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'storage_provider';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "storage_provider" drop default;
      alter table public."visual_assets" alter column "storage_provider" type text using "storage_provider"::text;
    else
      raise exception 'Column public.visual_assets.storage_provider has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'storage_bucket';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "storage_bucket" drop default;
      alter table public."visual_assets" alter column "storage_bucket" type text using "storage_bucket"::text;
    else
      raise exception 'Column public.visual_assets.storage_bucket has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'storage_path';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "storage_path" drop default;
      alter table public."visual_assets" alter column "storage_path" type text using "storage_path"::text;
    else
      raise exception 'Column public.visual_assets.storage_path has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'storage_public_url';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "storage_public_url" drop default;
      alter table public."visual_assets" alter column "storage_public_url" type text using "storage_public_url"::text;
    else
      raise exception 'Column public.visual_assets.storage_public_url has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'storage_status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "storage_status" drop default;
      alter table public."visual_assets" alter column "storage_status" type text using "storage_status"::text;
    else
      raise exception 'Column public.visual_assets.storage_status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'source_prompt';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "source_prompt" drop default;
      alter table public."visual_assets" alter column "source_prompt" type text using "source_prompt"::text;
    else
      raise exception 'Column public.visual_assets.source_prompt has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'source_model';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "source_model" drop default;
      alter table public."visual_assets" alter column "source_model" type text using "source_model"::text;
    else
      raise exception 'Column public.visual_assets.source_model has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'usage';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "usage" drop default;
      alter table public."visual_assets" alter column "usage" type jsonb using "usage"::jsonb;
  alter table public."visual_assets" alter column "usage" set default '[]'::jsonb;
    else
      raise exception 'Column public.visual_assets.usage has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'generation_metadata';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "generation_metadata" drop default;
      alter table public."visual_assets" alter column "generation_metadata" type jsonb using "generation_metadata"::jsonb;
  alter table public."visual_assets" alter column "generation_metadata" set default '[]'::jsonb;
    else
      raise exception 'Column public.visual_assets.generation_metadata has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'review_checklist';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "review_checklist" drop default;
      alter table public."visual_assets" alter column "review_checklist" type jsonb using "review_checklist"::jsonb;
  alter table public."visual_assets" alter column "review_checklist" set default '[]'::jsonb;
    else
      raise exception 'Column public.visual_assets.review_checklist has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'alt_text';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "alt_text" drop default;
      alter table public."visual_assets" alter column "alt_text" type text using "alt_text"::text;
    else
      raise exception 'Column public.visual_assets.alt_text has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'caption';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "caption" drop default;
      alter table public."visual_assets" alter column "caption" type text using "caption"::text;
    else
      raise exception 'Column public.visual_assets.caption has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'license';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "license" drop default;
      alter table public."visual_assets" alter column "license" type text using "license"::text;
    else
      raise exception 'Column public.visual_assets.license has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'credit';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "credit" drop default;
      alter table public."visual_assets" alter column "credit" type text using "credit"::text;
    else
      raise exception 'Column public.visual_assets.credit has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "status" drop default;
      alter table public."visual_assets" alter column "status" type text using "status"::text;
    else
      raise exception 'Column public.visual_assets.status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'approved_by_user_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "approved_by_user_id" drop default;
      alter table public."visual_assets" alter column "approved_by_user_id" type text using "approved_by_user_id"::text;
    else
      raise exception 'Column public.visual_assets.approved_by_user_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'approved_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "approved_at" drop default;
      alter table public."visual_assets" alter column "approved_at" type timestamptz using "approved_at"::timestamptz;
    else
      raise exception 'Column public.visual_assets.approved_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'latest_review';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "latest_review" drop default;
      alter table public."visual_assets" alter column "latest_review" type jsonb using "latest_review"::jsonb;
  alter table public."visual_assets" alter column "latest_review" set default '{}'::jsonb;
    else
      raise exception 'Column public.visual_assets.latest_review has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'review_history';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "review_history" drop default;
      alter table public."visual_assets" alter column "review_history" type jsonb using "review_history"::jsonb;
  alter table public."visual_assets" alter column "review_history" set default '[]'::jsonb;
    else
      raise exception 'Column public.visual_assets.review_history has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'review_version';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "review_version" drop default;
      alter table public."visual_assets" alter column "review_version" type integer using "review_version"::integer;
    else
      raise exception 'Column public.visual_assets.review_version has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "created_at" drop default;
      alter table public."visual_assets" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.visual_assets.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'visual_assets'
    and c.column_name = 'updated_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."visual_assets";
    if row_count = 0 then
      alter table public."visual_assets" alter column "updated_at" drop default;
      alter table public."visual_assets" alter column "updated_at" type timestamptz using "updated_at"::timestamptz;
    else
      raise exception 'Column public.visual_assets.updated_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'ai_tutor_events'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."ai_tutor_events";
    if row_count = 0 then
      alter table public."ai_tutor_events" alter column "id" drop default;
      alter table public."ai_tutor_events" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.ai_tutor_events.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'ai_tutor_events'
    and c.column_name = 'student_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."ai_tutor_events";
    if row_count = 0 then
      alter table public."ai_tutor_events" alter column "student_id" drop default;
      alter table public."ai_tutor_events" alter column "student_id" type text using "student_id"::text;
    else
      raise exception 'Column public.ai_tutor_events.student_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'ai_tutor_events'
    and c.column_name = 'lesson_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."ai_tutor_events";
    if row_count = 0 then
      alter table public."ai_tutor_events" alter column "lesson_id" drop default;
      alter table public."ai_tutor_events" alter column "lesson_id" type text using "lesson_id"::text;
    else
      raise exception 'Column public.ai_tutor_events.lesson_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'ai_tutor_events'
    and c.column_name = 'input';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."ai_tutor_events";
    if row_count = 0 then
      alter table public."ai_tutor_events" alter column "input" drop default;
      alter table public."ai_tutor_events" alter column "input" type text using "input"::text;
    else
      raise exception 'Column public.ai_tutor_events.input has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'ai_tutor_events'
    and c.column_name = 'response';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."ai_tutor_events";
    if row_count = 0 then
      alter table public."ai_tutor_events" alter column "response" drop default;
      alter table public."ai_tutor_events" alter column "response" type text using "response"::text;
    else
      raise exception 'Column public.ai_tutor_events.response has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'ai_tutor_events'
    and c.column_name = 'analysis';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."ai_tutor_events";
    if row_count = 0 then
      alter table public."ai_tutor_events" alter column "analysis" drop default;
      alter table public."ai_tutor_events" alter column "analysis" type text using "analysis"::text;
    else
      raise exception 'Column public.ai_tutor_events.analysis has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'ai_tutor_events'
    and c.column_name = 'type';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."ai_tutor_events";
    if row_count = 0 then
      alter table public."ai_tutor_events" alter column "type" drop default;
      alter table public."ai_tutor_events" alter column "type" type text using "type"::text;
    else
      raise exception 'Column public.ai_tutor_events.type has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'ai_tutor_events'
    and c.column_name = 'mode_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."ai_tutor_events";
    if row_count = 0 then
      alter table public."ai_tutor_events" alter column "mode_id" drop default;
      alter table public."ai_tutor_events" alter column "mode_id" type text using "mode_id"::text;
    else
      raise exception 'Column public.ai_tutor_events.mode_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'ai_tutor_events'
    and c.column_name = 'mode_title';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."ai_tutor_events";
    if row_count = 0 then
      alter table public."ai_tutor_events" alter column "mode_title" drop default;
      alter table public."ai_tutor_events" alter column "mode_title" type text using "mode_title"::text;
    else
      raise exception 'Column public.ai_tutor_events.mode_title has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'ai_tutor_events'
    and c.column_name = 'strategy';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."ai_tutor_events";
    if row_count = 0 then
      alter table public."ai_tutor_events" alter column "strategy" drop default;
      alter table public."ai_tutor_events" alter column "strategy" type text using "strategy"::text;
    else
      raise exception 'Column public.ai_tutor_events.strategy has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'ai_tutor_events'
    and c.column_name = 'visual_hint';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."ai_tutor_events";
    if row_count = 0 then
      alter table public."ai_tutor_events" alter column "visual_hint" drop default;
      alter table public."ai_tutor_events" alter column "visual_hint" type text using "visual_hint"::text;
    else
      raise exception 'Column public.ai_tutor_events.visual_hint has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'ai_tutor_events'
    and c.column_name = 'first_principles_prompt';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."ai_tutor_events";
    if row_count = 0 then
      alter table public."ai_tutor_events" alter column "first_principles_prompt" drop default;
      alter table public."ai_tutor_events" alter column "first_principles_prompt" type text using "first_principles_prompt"::text;
    else
      raise exception 'Column public.ai_tutor_events.first_principles_prompt has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'ai_tutor_events'
    and c.column_name = 'student_feedback';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."ai_tutor_events";
    if row_count = 0 then
      alter table public."ai_tutor_events" alter column "student_feedback" drop default;
      alter table public."ai_tutor_events" alter column "student_feedback" type text using "student_feedback"::text;
    else
      raise exception 'Column public.ai_tutor_events.student_feedback has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'ai_tutor_events'
    and c.column_name = 'feedback_note';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."ai_tutor_events";
    if row_count = 0 then
      alter table public."ai_tutor_events" alter column "feedback_note" drop default;
      alter table public."ai_tutor_events" alter column "feedback_note" type text using "feedback_note"::text;
    else
      raise exception 'Column public.ai_tutor_events.feedback_note has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'ai_tutor_events'
    and c.column_name = 'helped';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."ai_tutor_events";
    if row_count = 0 then
      alter table public."ai_tutor_events" alter column "helped" drop default;
      alter table public."ai_tutor_events" alter column "helped" type text using "helped"::text;
    else
      raise exception 'Column public.ai_tutor_events.helped has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'ai_tutor_events'
    and c.column_name = 'quality_score';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."ai_tutor_events";
    if row_count = 0 then
      alter table public."ai_tutor_events" alter column "quality_score" drop default;
      alter table public."ai_tutor_events" alter column "quality_score" type integer using "quality_score"::integer;
    else
      raise exception 'Column public.ai_tutor_events.quality_score has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'ai_tutor_events'
    and c.column_name = 'truth_score';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."ai_tutor_events";
    if row_count = 0 then
      alter table public."ai_tutor_events" alter column "truth_score" drop default;
      alter table public."ai_tutor_events" alter column "truth_score" type integer using "truth_score"::integer;
    else
      raise exception 'Column public.ai_tutor_events.truth_score has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'ai_tutor_events'
    and c.column_name = 'truth_issues';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."ai_tutor_events";
    if row_count = 0 then
      alter table public."ai_tutor_events" alter column "truth_issues" drop default;
      alter table public."ai_tutor_events" alter column "truth_issues" type jsonb using "truth_issues"::jsonb;
  alter table public."ai_tutor_events" alter column "truth_issues" set default '[]'::jsonb;
    else
      raise exception 'Column public.ai_tutor_events.truth_issues has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'ai_tutor_events'
    and c.column_name = 'needs_external_research';
  if actual_type is not null and actual_type <> 'bool' then
    select count(*) into row_count from public."ai_tutor_events";
    if row_count = 0 then
      alter table public."ai_tutor_events" alter column "needs_external_research" drop default;
      alter table public."ai_tutor_events" alter column "needs_external_research" type boolean using "needs_external_research"::boolean;
  alter table public."ai_tutor_events" alter column "needs_external_research" set default false;
    else
      raise exception 'Column public.ai_tutor_events.needs_external_research has type %, expected bool, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'ai_tutor_events'
    and c.column_name = 'truth_review_status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."ai_tutor_events";
    if row_count = 0 then
      alter table public."ai_tutor_events" alter column "truth_review_status" drop default;
      alter table public."ai_tutor_events" alter column "truth_review_status" type text using "truth_review_status"::text;
    else
      raise exception 'Column public.ai_tutor_events.truth_review_status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'ai_tutor_events'
    and c.column_name = 'flagged';
  if actual_type is not null and actual_type <> 'bool' then
    select count(*) into row_count from public."ai_tutor_events";
    if row_count = 0 then
      alter table public."ai_tutor_events" alter column "flagged" drop default;
      alter table public."ai_tutor_events" alter column "flagged" type boolean using "flagged"::boolean;
  alter table public."ai_tutor_events" alter column "flagged" set default false;
    else
      raise exception 'Column public.ai_tutor_events.flagged has type %, expected bool, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'ai_tutor_events'
    and c.column_name = 'review_status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."ai_tutor_events";
    if row_count = 0 then
      alter table public."ai_tutor_events" alter column "review_status" drop default;
      alter table public."ai_tutor_events" alter column "review_status" type text using "review_status"::text;
    else
      raise exception 'Column public.ai_tutor_events.review_status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'ai_tutor_events'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."ai_tutor_events";
    if row_count = 0 then
      alter table public."ai_tutor_events" alter column "created_at" drop default;
      alter table public."ai_tutor_events" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.ai_tutor_events.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_tool_calls'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."agent_tool_calls";
    if row_count = 0 then
      alter table public."agent_tool_calls" alter column "id" drop default;
      alter table public."agent_tool_calls" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.agent_tool_calls.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_tool_calls'
    and c.column_name = 'tool_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."agent_tool_calls";
    if row_count = 0 then
      alter table public."agent_tool_calls" alter column "tool_id" drop default;
      alter table public."agent_tool_calls" alter column "tool_id" type text using "tool_id"::text;
    else
      raise exception 'Column public.agent_tool_calls.tool_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_tool_calls'
    and c.column_name = 'tool_name';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."agent_tool_calls";
    if row_count = 0 then
      alter table public."agent_tool_calls" alter column "tool_name" drop default;
      alter table public."agent_tool_calls" alter column "tool_name" type text using "tool_name"::text;
    else
      raise exception 'Column public.agent_tool_calls.tool_name has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_tool_calls'
    and c.column_name = 'owner_agent_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."agent_tool_calls";
    if row_count = 0 then
      alter table public."agent_tool_calls" alter column "owner_agent_id" drop default;
      alter table public."agent_tool_calls" alter column "owner_agent_id" type text using "owner_agent_id"::text;
    else
      raise exception 'Column public.agent_tool_calls.owner_agent_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_tool_calls'
    and c.column_name = 'role';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."agent_tool_calls";
    if row_count = 0 then
      alter table public."agent_tool_calls" alter column "role" drop default;
      alter table public."agent_tool_calls" alter column "role" type text using "role"::text;
    else
      raise exception 'Column public.agent_tool_calls.role has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_tool_calls'
    and c.column_name = 'status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."agent_tool_calls";
    if row_count = 0 then
      alter table public."agent_tool_calls" alter column "status" drop default;
      alter table public."agent_tool_calls" alter column "status" type text using "status"::text;
    else
      raise exception 'Column public.agent_tool_calls.status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_tool_calls'
    and c.column_name = 'external_risk';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."agent_tool_calls";
    if row_count = 0 then
      alter table public."agent_tool_calls" alter column "external_risk" drop default;
      alter table public."agent_tool_calls" alter column "external_risk" type text using "external_risk"::text;
    else
      raise exception 'Column public.agent_tool_calls.external_risk has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_tool_calls'
    and c.column_name = 'requires_human_review';
  if actual_type is not null and actual_type <> 'bool' then
    select count(*) into row_count from public."agent_tool_calls";
    if row_count = 0 then
      alter table public."agent_tool_calls" alter column "requires_human_review" drop default;
      alter table public."agent_tool_calls" alter column "requires_human_review" type boolean using "requires_human_review"::boolean;
  alter table public."agent_tool_calls" alter column "requires_human_review" set default false;
    else
      raise exception 'Column public.agent_tool_calls.requires_human_review has type %, expected bool, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_tool_calls'
    and c.column_name = 'review_status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."agent_tool_calls";
    if row_count = 0 then
      alter table public."agent_tool_calls" alter column "review_status" drop default;
      alter table public."agent_tool_calls" alter column "review_status" type text using "review_status"::text;
    else
      raise exception 'Column public.agent_tool_calls.review_status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_tool_calls'
    and c.column_name = 'payload';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."agent_tool_calls";
    if row_count = 0 then
      alter table public."agent_tool_calls" alter column "payload" drop default;
      alter table public."agent_tool_calls" alter column "payload" type jsonb using "payload"::jsonb;
  alter table public."agent_tool_calls" alter column "payload" set default '[]'::jsonb;
    else
      raise exception 'Column public.agent_tool_calls.payload has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_tool_calls'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."agent_tool_calls";
    if row_count = 0 then
      alter table public."agent_tool_calls" alter column "created_at" drop default;
      alter table public."agent_tool_calls" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.agent_tool_calls.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'research_evidence_sources'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."research_evidence_sources";
    if row_count = 0 then
      alter table public."research_evidence_sources" alter column "id" drop default;
      alter table public."research_evidence_sources" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.research_evidence_sources.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'research_evidence_sources'
    and c.column_name = 'source_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."research_evidence_sources";
    if row_count = 0 then
      alter table public."research_evidence_sources" alter column "source_id" drop default;
      alter table public."research_evidence_sources" alter column "source_id" type text using "source_id"::text;
    else
      raise exception 'Column public.research_evidence_sources.source_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'research_evidence_sources'
    and c.column_name = 'source_name';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."research_evidence_sources";
    if row_count = 0 then
      alter table public."research_evidence_sources" alter column "source_name" drop default;
      alter table public."research_evidence_sources" alter column "source_name" type text using "source_name"::text;
    else
      raise exception 'Column public.research_evidence_sources.source_name has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'research_evidence_sources'
    and c.column_name = 'source_url';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."research_evidence_sources";
    if row_count = 0 then
      alter table public."research_evidence_sources" alter column "source_url" drop default;
      alter table public."research_evidence_sources" alter column "source_url" type text using "source_url"::text;
    else
      raise exception 'Column public.research_evidence_sources.source_url has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'research_evidence_sources'
    and c.column_name = 'source_type';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."research_evidence_sources";
    if row_count = 0 then
      alter table public."research_evidence_sources" alter column "source_type" drop default;
      alter table public."research_evidence_sources" alter column "source_type" type text using "source_type"::text;
    else
      raise exception 'Column public.research_evidence_sources.source_type has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'research_evidence_sources'
    and c.column_name = 'checked_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."research_evidence_sources";
    if row_count = 0 then
      alter table public."research_evidence_sources" alter column "checked_at" drop default;
      alter table public."research_evidence_sources" alter column "checked_at" type timestamptz using "checked_at"::timestamptz;
    else
      raise exception 'Column public.research_evidence_sources.checked_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'research_evidence_sources'
    and c.column_name = 'subject_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."research_evidence_sources";
    if row_count = 0 then
      alter table public."research_evidence_sources" alter column "subject_id" drop default;
      alter table public."research_evidence_sources" alter column "subject_id" type text using "subject_id"::text;
    else
      raise exception 'Column public.research_evidence_sources.subject_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'research_evidence_sources'
    and c.column_name = 'grade_band_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."research_evidence_sources";
    if row_count = 0 then
      alter table public."research_evidence_sources" alter column "grade_band_id" drop default;
      alter table public."research_evidence_sources" alter column "grade_band_id" type text using "grade_band_id"::text;
    else
      raise exception 'Column public.research_evidence_sources.grade_band_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'research_evidence_sources'
    and c.column_name = 'claim';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."research_evidence_sources";
    if row_count = 0 then
      alter table public."research_evidence_sources" alter column "claim" drop default;
      alter table public."research_evidence_sources" alter column "claim" type text using "claim"::text;
    else
      raise exception 'Column public.research_evidence_sources.claim has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'research_evidence_sources'
    and c.column_name = 'trouble_signal';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."research_evidence_sources";
    if row_count = 0 then
      alter table public."research_evidence_sources" alter column "trouble_signal" drop default;
      alter table public."research_evidence_sources" alter column "trouble_signal" type text using "trouble_signal"::text;
    else
      raise exception 'Column public.research_evidence_sources.trouble_signal has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'research_evidence_sources'
    and c.column_name = 'redesign_move';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."research_evidence_sources";
    if row_count = 0 then
      alter table public."research_evidence_sources" alter column "redesign_move" drop default;
      alter table public."research_evidence_sources" alter column "redesign_move" type text using "redesign_move"::text;
    else
      raise exception 'Column public.research_evidence_sources.redesign_move has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'research_evidence_sources'
    and c.column_name = 'status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."research_evidence_sources";
    if row_count = 0 then
      alter table public."research_evidence_sources" alter column "status" drop default;
      alter table public."research_evidence_sources" alter column "status" type text using "status"::text;
    else
      raise exception 'Column public.research_evidence_sources.status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_redesign_tasks'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lesson_redesign_tasks";
    if row_count = 0 then
      alter table public."lesson_redesign_tasks" alter column "id" drop default;
      alter table public."lesson_redesign_tasks" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.lesson_redesign_tasks.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_redesign_tasks'
    and c.column_name = 'lesson_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lesson_redesign_tasks";
    if row_count = 0 then
      alter table public."lesson_redesign_tasks" alter column "lesson_id" drop default;
      alter table public."lesson_redesign_tasks" alter column "lesson_id" type text using "lesson_id"::text;
    else
      raise exception 'Column public.lesson_redesign_tasks.lesson_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_redesign_tasks'
    and c.column_name = 'owner_agent_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lesson_redesign_tasks";
    if row_count = 0 then
      alter table public."lesson_redesign_tasks" alter column "owner_agent_id" drop default;
      alter table public."lesson_redesign_tasks" alter column "owner_agent_id" type text using "owner_agent_id"::text;
    else
      raise exception 'Column public.lesson_redesign_tasks.owner_agent_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_redesign_tasks'
    and c.column_name = 'title';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lesson_redesign_tasks";
    if row_count = 0 then
      alter table public."lesson_redesign_tasks" alter column "title" drop default;
      alter table public."lesson_redesign_tasks" alter column "title" type text using "title"::text;
    else
      raise exception 'Column public.lesson_redesign_tasks.title has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_redesign_tasks'
    and c.column_name = 'why';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lesson_redesign_tasks";
    if row_count = 0 then
      alter table public."lesson_redesign_tasks" alter column "why" drop default;
      alter table public."lesson_redesign_tasks" alter column "why" type text using "why"::text;
    else
      raise exception 'Column public.lesson_redesign_tasks.why has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_redesign_tasks'
    and c.column_name = 'change';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lesson_redesign_tasks";
    if row_count = 0 then
      alter table public."lesson_redesign_tasks" alter column "change" drop default;
      alter table public."lesson_redesign_tasks" alter column "change" type text using "change"::text;
    else
      raise exception 'Column public.lesson_redesign_tasks.change has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_redesign_tasks'
    and c.column_name = 'source_ids';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."lesson_redesign_tasks";
    if row_count = 0 then
      alter table public."lesson_redesign_tasks" alter column "source_ids" drop default;
      alter table public."lesson_redesign_tasks" alter column "source_ids" type jsonb using "source_ids"::jsonb;
  alter table public."lesson_redesign_tasks" alter column "source_ids" set default '[]'::jsonb;
    else
      raise exception 'Column public.lesson_redesign_tasks.source_ids has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_redesign_tasks'
    and c.column_name = 'status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lesson_redesign_tasks";
    if row_count = 0 then
      alter table public."lesson_redesign_tasks" alter column "status" drop default;
      alter table public."lesson_redesign_tasks" alter column "status" type text using "status"::text;
    else
      raise exception 'Column public.lesson_redesign_tasks.status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_redesign_tasks'
    and c.column_name = 'review_status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lesson_redesign_tasks";
    if row_count = 0 then
      alter table public."lesson_redesign_tasks" alter column "review_status" drop default;
      alter table public."lesson_redesign_tasks" alter column "review_status" type text using "review_status"::text;
    else
      raise exception 'Column public.lesson_redesign_tasks.review_status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_redesign_tasks'
    and c.column_name = 'implemented_draft_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lesson_redesign_tasks";
    if row_count = 0 then
      alter table public."lesson_redesign_tasks" alter column "implemented_draft_id" drop default;
      alter table public."lesson_redesign_tasks" alter column "implemented_draft_id" type text using "implemented_draft_id"::text;
    else
      raise exception 'Column public.lesson_redesign_tasks.implemented_draft_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_redesign_tasks'
    and c.column_name = 'implemented_lesson_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."lesson_redesign_tasks";
    if row_count = 0 then
      alter table public."lesson_redesign_tasks" alter column "implemented_lesson_id" drop default;
      alter table public."lesson_redesign_tasks" alter column "implemented_lesson_id" type text using "implemented_lesson_id"::text;
    else
      raise exception 'Column public.lesson_redesign_tasks.implemented_lesson_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_redesign_tasks'
    and c.column_name = 'implemented_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."lesson_redesign_tasks";
    if row_count = 0 then
      alter table public."lesson_redesign_tasks" alter column "implemented_at" drop default;
      alter table public."lesson_redesign_tasks" alter column "implemented_at" type timestamptz using "implemented_at"::timestamptz;
    else
      raise exception 'Column public.lesson_redesign_tasks.implemented_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_redesign_tasks'
    and c.column_name = 'review_history';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."lesson_redesign_tasks";
    if row_count = 0 then
      alter table public."lesson_redesign_tasks" alter column "review_history" drop default;
      alter table public."lesson_redesign_tasks" alter column "review_history" type jsonb using "review_history"::jsonb;
  alter table public."lesson_redesign_tasks" alter column "review_history" set default '[]'::jsonb;
    else
      raise exception 'Column public.lesson_redesign_tasks.review_history has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'lesson_redesign_tasks'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."lesson_redesign_tasks";
    if row_count = 0 then
      alter table public."lesson_redesign_tasks" alter column "created_at" drop default;
      alter table public."lesson_redesign_tasks" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.lesson_redesign_tasks.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_review_items'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."agent_review_items";
    if row_count = 0 then
      alter table public."agent_review_items" alter column "id" drop default;
      alter table public."agent_review_items" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.agent_review_items.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_review_items'
    and c.column_name = 'source_type';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."agent_review_items";
    if row_count = 0 then
      alter table public."agent_review_items" alter column "source_type" drop default;
      alter table public."agent_review_items" alter column "source_type" type text using "source_type"::text;
    else
      raise exception 'Column public.agent_review_items.source_type has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_review_items'
    and c.column_name = 'source_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."agent_review_items";
    if row_count = 0 then
      alter table public."agent_review_items" alter column "source_id" drop default;
      alter table public."agent_review_items" alter column "source_id" type text using "source_id"::text;
    else
      raise exception 'Column public.agent_review_items.source_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_review_items'
    and c.column_name = 'owner_agent_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."agent_review_items";
    if row_count = 0 then
      alter table public."agent_review_items" alter column "owner_agent_id" drop default;
      alter table public."agent_review_items" alter column "owner_agent_id" type text using "owner_agent_id"::text;
    else
      raise exception 'Column public.agent_review_items.owner_agent_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_review_items'
    and c.column_name = 'priority';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."agent_review_items";
    if row_count = 0 then
      alter table public."agent_review_items" alter column "priority" drop default;
      alter table public."agent_review_items" alter column "priority" type text using "priority"::text;
    else
      raise exception 'Column public.agent_review_items.priority has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_review_items'
    and c.column_name = 'status';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."agent_review_items";
    if row_count = 0 then
      alter table public."agent_review_items" alter column "status" drop default;
      alter table public."agent_review_items" alter column "status" type text using "status"::text;
    else
      raise exception 'Column public.agent_review_items.status has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_review_items'
    and c.column_name = 'decision';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."agent_review_items";
    if row_count = 0 then
      alter table public."agent_review_items" alter column "decision" drop default;
      alter table public."agent_review_items" alter column "decision" type text using "decision"::text;
    else
      raise exception 'Column public.agent_review_items.decision has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_review_items'
    and c.column_name = 'reviewed_by_user_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."agent_review_items";
    if row_count = 0 then
      alter table public."agent_review_items" alter column "reviewed_by_user_id" drop default;
      alter table public."agent_review_items" alter column "reviewed_by_user_id" type text using "reviewed_by_user_id"::text;
    else
      raise exception 'Column public.agent_review_items.reviewed_by_user_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_review_items'
    and c.column_name = 'reviewed_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."agent_review_items";
    if row_count = 0 then
      alter table public."agent_review_items" alter column "reviewed_at" drop default;
      alter table public."agent_review_items" alter column "reviewed_at" type timestamptz using "reviewed_at"::timestamptz;
    else
      raise exception 'Column public.agent_review_items.reviewed_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_review_items'
    and c.column_name = 'artifact_type';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."agent_review_items";
    if row_count = 0 then
      alter table public."agent_review_items" alter column "artifact_type" drop default;
      alter table public."agent_review_items" alter column "artifact_type" type text using "artifact_type"::text;
    else
      raise exception 'Column public.agent_review_items.artifact_type has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_review_items'
    and c.column_name = 'artifact_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."agent_review_items";
    if row_count = 0 then
      alter table public."agent_review_items" alter column "artifact_id" drop default;
      alter table public."agent_review_items" alter column "artifact_id" type text using "artifact_id"::text;
    else
      raise exception 'Column public.agent_review_items.artifact_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_review_items'
    and c.column_name = 'score';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."agent_review_items";
    if row_count = 0 then
      alter table public."agent_review_items" alter column "score" drop default;
      alter table public."agent_review_items" alter column "score" type integer using "score"::integer;
    else
      raise exception 'Column public.agent_review_items.score has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_review_items'
    and c.column_name = 'grade';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."agent_review_items";
    if row_count = 0 then
      alter table public."agent_review_items" alter column "grade" drop default;
      alter table public."agent_review_items" alter column "grade" type text using "grade"::text;
    else
      raise exception 'Column public.agent_review_items.grade has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_review_items'
    and c.column_name = 'threshold';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."agent_review_items";
    if row_count = 0 then
      alter table public."agent_review_items" alter column "threshold" drop default;
      alter table public."agent_review_items" alter column "threshold" type integer using "threshold"::integer;
    else
      raise exception 'Column public.agent_review_items.threshold has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_review_items'
    and c.column_name = 'passed';
  if actual_type is not null and actual_type <> 'bool' then
    select count(*) into row_count from public."agent_review_items";
    if row_count = 0 then
      alter table public."agent_review_items" alter column "passed" drop default;
      alter table public."agent_review_items" alter column "passed" type boolean using "passed"::boolean;
  alter table public."agent_review_items" alter column "passed" set default false;
    else
      raise exception 'Column public.agent_review_items.passed has type %, expected bool, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_review_items'
    and c.column_name = 'critical_blockers';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."agent_review_items";
    if row_count = 0 then
      alter table public."agent_review_items" alter column "critical_blockers" drop default;
      alter table public."agent_review_items" alter column "critical_blockers" type jsonb using "critical_blockers"::jsonb;
  alter table public."agent_review_items" alter column "critical_blockers" set default '[]'::jsonb;
    else
      raise exception 'Column public.agent_review_items.critical_blockers has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_review_items'
    and c.column_name = 'blockers';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."agent_review_items";
    if row_count = 0 then
      alter table public."agent_review_items" alter column "blockers" drop default;
      alter table public."agent_review_items" alter column "blockers" type jsonb using "blockers"::jsonb;
  alter table public."agent_review_items" alter column "blockers" set default '[]'::jsonb;
    else
      raise exception 'Column public.agent_review_items.blockers has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_review_items'
    and c.column_name = 'revision_instructions';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."agent_review_items";
    if row_count = 0 then
      alter table public."agent_review_items" alter column "revision_instructions" drop default;
      alter table public."agent_review_items" alter column "revision_instructions" type jsonb using "revision_instructions"::jsonb;
  alter table public."agent_review_items" alter column "revision_instructions" set default '[]'::jsonb;
    else
      raise exception 'Column public.agent_review_items.revision_instructions has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'agent_review_items'
    and c.column_name = 'review_history';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."agent_review_items";
    if row_count = 0 then
      alter table public."agent_review_items" alter column "review_history" drop default;
      alter table public."agent_review_items" alter column "review_history" type jsonb using "review_history"::jsonb;
  alter table public."agent_review_items" alter column "review_history" set default '[]'::jsonb;
    else
      raise exception 'Column public.agent_review_items.review_history has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'audit_events'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."audit_events";
    if row_count = 0 then
      alter table public."audit_events" alter column "id" drop default;
      alter table public."audit_events" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.audit_events.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'audit_events'
    and c.column_name = 'actor_user_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."audit_events";
    if row_count = 0 then
      alter table public."audit_events" alter column "actor_user_id" drop default;
      alter table public."audit_events" alter column "actor_user_id" type text using "actor_user_id"::text;
    else
      raise exception 'Column public.audit_events.actor_user_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'audit_events'
    and c.column_name = 'event_type';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."audit_events";
    if row_count = 0 then
      alter table public."audit_events" alter column "event_type" drop default;
      alter table public."audit_events" alter column "event_type" type text using "event_type"::text;
    else
      raise exception 'Column public.audit_events.event_type has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'audit_events'
    and c.column_name = 'entity_type';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."audit_events";
    if row_count = 0 then
      alter table public."audit_events" alter column "entity_type" drop default;
      alter table public."audit_events" alter column "entity_type" type text using "entity_type"::text;
    else
      raise exception 'Column public.audit_events.entity_type has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'audit_events'
    and c.column_name = 'entity_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."audit_events";
    if row_count = 0 then
      alter table public."audit_events" alter column "entity_id" drop default;
      alter table public."audit_events" alter column "entity_id" type text using "entity_id"::text;
    else
      raise exception 'Column public.audit_events.entity_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'audit_events'
    and c.column_name = 'metadata';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."audit_events";
    if row_count = 0 then
      alter table public."audit_events" alter column "metadata" drop default;
      alter table public."audit_events" alter column "metadata" type jsonb using "metadata"::jsonb;
  alter table public."audit_events" alter column "metadata" set default '[]'::jsonb;
    else
      raise exception 'Column public.audit_events.metadata has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'audit_events'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."audit_events";
    if row_count = 0 then
      alter table public."audit_events" alter column "created_at" drop default;
      alter table public."audit_events" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.audit_events.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'auth_audit_events'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."auth_audit_events";
    if row_count = 0 then
      alter table public."auth_audit_events" alter column "id" drop default;
      alter table public."auth_audit_events" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.auth_audit_events.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'auth_audit_events'
    and c.column_name = 'actor_user_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."auth_audit_events";
    if row_count = 0 then
      alter table public."auth_audit_events" alter column "actor_user_id" drop default;
      alter table public."auth_audit_events" alter column "actor_user_id" type text using "actor_user_id"::text;
    else
      raise exception 'Column public.auth_audit_events.actor_user_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'auth_audit_events'
    and c.column_name = 'target_user_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."auth_audit_events";
    if row_count = 0 then
      alter table public."auth_audit_events" alter column "target_user_id" drop default;
      alter table public."auth_audit_events" alter column "target_user_id" type text using "target_user_id"::text;
    else
      raise exception 'Column public.auth_audit_events.target_user_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'auth_audit_events'
    and c.column_name = 'event_type';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."auth_audit_events";
    if row_count = 0 then
      alter table public."auth_audit_events" alter column "event_type" drop default;
      alter table public."auth_audit_events" alter column "event_type" type text using "event_type"::text;
    else
      raise exception 'Column public.auth_audit_events.event_type has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'auth_audit_events'
    and c.column_name = 'entity_type';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."auth_audit_events";
    if row_count = 0 then
      alter table public."auth_audit_events" alter column "entity_type" drop default;
      alter table public."auth_audit_events" alter column "entity_type" type text using "entity_type"::text;
    else
      raise exception 'Column public.auth_audit_events.entity_type has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'auth_audit_events'
    and c.column_name = 'entity_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."auth_audit_events";
    if row_count = 0 then
      alter table public."auth_audit_events" alter column "entity_id" drop default;
      alter table public."auth_audit_events" alter column "entity_id" type text using "entity_id"::text;
    else
      raise exception 'Column public.auth_audit_events.entity_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'auth_audit_events'
    and c.column_name = 'metadata';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."auth_audit_events";
    if row_count = 0 then
      alter table public."auth_audit_events" alter column "metadata" drop default;
      alter table public."auth_audit_events" alter column "metadata" type jsonb using "metadata"::jsonb;
  alter table public."auth_audit_events" alter column "metadata" set default '[]'::jsonb;
    else
      raise exception 'Column public.auth_audit_events.metadata has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'auth_audit_events'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."auth_audit_events";
    if row_count = 0 then
      alter table public."auth_audit_events" alter column "created_at" drop default;
      alter table public."auth_audit_events" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.auth_audit_events.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'consent_records'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."consent_records";
    if row_count = 0 then
      alter table public."consent_records" alter column "id" drop default;
      alter table public."consent_records" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.consent_records.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'consent_records'
    and c.column_name = 'student_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."consent_records";
    if row_count = 0 then
      alter table public."consent_records" alter column "student_id" drop default;
      alter table public."consent_records" alter column "student_id" type text using "student_id"::text;
    else
      raise exception 'Column public.consent_records.student_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'consent_records'
    and c.column_name = 'guardian_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."consent_records";
    if row_count = 0 then
      alter table public."consent_records" alter column "guardian_id" drop default;
      alter table public."consent_records" alter column "guardian_id" type text using "guardian_id"::text;
    else
      raise exception 'Column public.consent_records.guardian_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'consent_records'
    and c.column_name = 'data_collection';
  if actual_type is not null and actual_type <> 'bool' then
    select count(*) into row_count from public."consent_records";
    if row_count = 0 then
      alter table public."consent_records" alter column "data_collection" drop default;
      alter table public."consent_records" alter column "data_collection" type boolean using "data_collection"::boolean;
  alter table public."consent_records" alter column "data_collection" set default false;
    else
      raise exception 'Column public.consent_records.data_collection has type %, expected bool, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'consent_records'
    and c.column_name = 'ai_helper';
  if actual_type is not null and actual_type <> 'bool' then
    select count(*) into row_count from public."consent_records";
    if row_count = 0 then
      alter table public."consent_records" alter column "ai_helper" drop default;
      alter table public."consent_records" alter column "ai_helper" type boolean using "ai_helper"::boolean;
  alter table public."consent_records" alter column "ai_helper" set default false;
    else
      raise exception 'Column public.consent_records.ai_helper has type %, expected bool, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'consent_records'
    and c.column_name = 'portfolio';
  if actual_type is not null and actual_type <> 'bool' then
    select count(*) into row_count from public."consent_records";
    if row_count = 0 then
      alter table public."consent_records" alter column "portfolio" drop default;
      alter table public."consent_records" alter column "portfolio" type boolean using "portfolio"::boolean;
  alter table public."consent_records" alter column "portfolio" set default false;
    else
      raise exception 'Column public.consent_records.portfolio has type %, expected bool, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'consent_records'
    and c.column_name = 'third_party_sharing';
  if actual_type is not null and actual_type <> 'bool' then
    select count(*) into row_count from public."consent_records";
    if row_count = 0 then
      alter table public."consent_records" alter column "third_party_sharing" drop default;
      alter table public."consent_records" alter column "third_party_sharing" type boolean using "third_party_sharing"::boolean;
  alter table public."consent_records" alter column "third_party_sharing" set default false;
    else
      raise exception 'Column public.consent_records.third_party_sharing has type %, expected bool, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'consent_records'
    and c.column_name = 'consented_by';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."consent_records";
    if row_count = 0 then
      alter table public."consent_records" alter column "consented_by" drop default;
      alter table public."consent_records" alter column "consented_by" type text using "consented_by"::text;
    else
      raise exception 'Column public.consent_records.consented_by has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'consent_records'
    and c.column_name = 'updated_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."consent_records";
    if row_count = 0 then
      alter table public."consent_records" alter column "updated_at" drop default;
      alter table public."consent_records" alter column "updated_at" type timestamptz using "updated_at"::timestamptz;
    else
      raise exception 'Column public.consent_records.updated_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'accommodations'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."accommodations";
    if row_count = 0 then
      alter table public."accommodations" alter column "id" drop default;
      alter table public."accommodations" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.accommodations.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'accommodations'
    and c.column_name = 'student_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."accommodations";
    if row_count = 0 then
      alter table public."accommodations" alter column "student_id" drop default;
      alter table public."accommodations" alter column "student_id" type text using "student_id"::text;
    else
      raise exception 'Column public.accommodations.student_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'accommodations'
    and c.column_name = 'support';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."accommodations";
    if row_count = 0 then
      alter table public."accommodations" alter column "support" drop default;
      alter table public."accommodations" alter column "support" type text using "support"::text;
    else
      raise exception 'Column public.accommodations.support has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'accommodations'
    and c.column_name = 'source';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."accommodations";
    if row_count = 0 then
      alter table public."accommodations" alter column "source" drop default;
      alter table public."accommodations" alter column "source" type text using "source"::text;
    else
      raise exception 'Column public.accommodations.source has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'accommodations'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."accommodations";
    if row_count = 0 then
      alter table public."accommodations" alter column "created_at" drop default;
      alter table public."accommodations" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.accommodations.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'retention_schedules'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."retention_schedules";
    if row_count = 0 then
      alter table public."retention_schedules" alter column "id" drop default;
      alter table public."retention_schedules" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.retention_schedules.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'retention_schedules'
    and c.column_name = 'student_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."retention_schedules";
    if row_count = 0 then
      alter table public."retention_schedules" alter column "student_id" drop default;
      alter table public."retention_schedules" alter column "student_id" type text using "student_id"::text;
    else
      raise exception 'Column public.retention_schedules.student_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'retention_schedules'
    and c.column_name = 'lesson_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."retention_schedules";
    if row_count = 0 then
      alter table public."retention_schedules" alter column "lesson_id" drop default;
      alter table public."retention_schedules" alter column "lesson_id" type text using "lesson_id"::text;
    else
      raise exception 'Column public.retention_schedules.lesson_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'retention_schedules'
    and c.column_name = 'skill_tag';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."retention_schedules";
    if row_count = 0 then
      alter table public."retention_schedules" alter column "skill_tag" drop default;
      alter table public."retention_schedules" alter column "skill_tag" type text using "skill_tag"::text;
    else
      raise exception 'Column public.retention_schedules.skill_tag has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'retention_schedules'
    and c.column_name = 'current_mastery';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."retention_schedules";
    if row_count = 0 then
      alter table public."retention_schedules" alter column "current_mastery" drop default;
      alter table public."retention_schedules" alter column "current_mastery" type integer using "current_mastery"::integer;
    else
      raise exception 'Column public.retention_schedules.current_mastery has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'retention_schedules'
    and c.column_name = 'next_recall';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."retention_schedules";
    if row_count = 0 then
      alter table public."retention_schedules" alter column "next_recall" drop default;
      alter table public."retention_schedules" alter column "next_recall" type text using "next_recall"::text;
    else
      raise exception 'Column public.retention_schedules.next_recall has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'retention_schedules'
    and c.column_name = 'interval_days';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."retention_schedules";
    if row_count = 0 then
      alter table public."retention_schedules" alter column "interval_days" drop default;
      alter table public."retention_schedules" alter column "interval_days" type integer using "interval_days"::integer;
    else
      raise exception 'Column public.retention_schedules.interval_days has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'retention_schedules'
    and c.column_name = 'recall_count';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."retention_schedules";
    if row_count = 0 then
      alter table public."retention_schedules" alter column "recall_count" drop default;
      alter table public."retention_schedules" alter column "recall_count" type integer using "recall_count"::integer;
    else
      raise exception 'Column public.retention_schedules.recall_count has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'retention_schedules'
    and c.column_name = 'last_result';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."retention_schedules";
    if row_count = 0 then
      alter table public."retention_schedules" alter column "last_result" drop default;
      alter table public."retention_schedules" alter column "last_result" type text using "last_result"::text;
    else
      raise exception 'Column public.retention_schedules.last_result has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'learning_events'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."learning_events";
    if row_count = 0 then
      alter table public."learning_events" alter column "id" drop default;
      alter table public."learning_events" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.learning_events.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'learning_events'
    and c.column_name = 'student_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."learning_events";
    if row_count = 0 then
      alter table public."learning_events" alter column "student_id" drop default;
      alter table public."learning_events" alter column "student_id" type text using "student_id"::text;
    else
      raise exception 'Column public.learning_events.student_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'learning_events'
    and c.column_name = 'lesson_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."learning_events";
    if row_count = 0 then
      alter table public."learning_events" alter column "lesson_id" drop default;
      alter table public."learning_events" alter column "lesson_id" type text using "lesson_id"::text;
    else
      raise exception 'Column public.learning_events.lesson_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'learning_events'
    and c.column_name = 'event_type';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."learning_events";
    if row_count = 0 then
      alter table public."learning_events" alter column "event_type" drop default;
      alter table public."learning_events" alter column "event_type" type text using "event_type"::text;
    else
      raise exception 'Column public.learning_events.event_type has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'learning_events'
    and c.column_name = 'value';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."learning_events";
    if row_count = 0 then
      alter table public."learning_events" alter column "value" drop default;
      alter table public."learning_events" alter column "value" type jsonb using "value"::jsonb;
  alter table public."learning_events" alter column "value" set default '[]'::jsonb;
    else
      raise exception 'Column public.learning_events.value has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'learning_events'
    and c.column_name = 'occurred_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."learning_events";
    if row_count = 0 then
      alter table public."learning_events" alter column "occurred_at" drop default;
      alter table public."learning_events" alter column "occurred_at" type timestamptz using "occurred_at"::timestamptz;
    else
      raise exception 'Column public.learning_events.occurred_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'experiment_runs'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."experiment_runs";
    if row_count = 0 then
      alter table public."experiment_runs" alter column "id" drop default;
      alter table public."experiment_runs" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.experiment_runs.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'experiment_runs'
    and c.column_name = 'template_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."experiment_runs";
    if row_count = 0 then
      alter table public."experiment_runs" alter column "template_id" drop default;
      alter table public."experiment_runs" alter column "template_id" type text using "template_id"::text;
    else
      raise exception 'Column public.experiment_runs.template_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'experiment_runs'
    and c.column_name = 'student_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."experiment_runs";
    if row_count = 0 then
      alter table public."experiment_runs" alter column "student_id" drop default;
      alter table public."experiment_runs" alter column "student_id" type text using "student_id"::text;
    else
      raise exception 'Column public.experiment_runs.student_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'experiment_runs'
    and c.column_name = 'lesson_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."experiment_runs";
    if row_count = 0 then
      alter table public."experiment_runs" alter column "lesson_id" drop default;
      alter table public."experiment_runs" alter column "lesson_id" type text using "lesson_id"::text;
    else
      raise exception 'Column public.experiment_runs.lesson_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'experiment_runs'
    and c.column_name = 'variant';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."experiment_runs";
    if row_count = 0 then
      alter table public."experiment_runs" alter column "variant" drop default;
      alter table public."experiment_runs" alter column "variant" type text using "variant"::text;
    else
      raise exception 'Column public.experiment_runs.variant has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'experiment_runs'
    and c.column_name = 'immediate_score';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."experiment_runs";
    if row_count = 0 then
      alter table public."experiment_runs" alter column "immediate_score" drop default;
      alter table public."experiment_runs" alter column "immediate_score" type integer using "immediate_score"::integer;
    else
      raise exception 'Column public.experiment_runs.immediate_score has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'experiment_runs'
    and c.column_name = 'recall_24h';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."experiment_runs";
    if row_count = 0 then
      alter table public."experiment_runs" alter column "recall_24h" drop default;
      alter table public."experiment_runs" alter column "recall_24h" type integer using "recall_24h"::integer;
    else
      raise exception 'Column public.experiment_runs.recall_24h has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'experiment_runs'
    and c.column_name = 'recall_7d';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."experiment_runs";
    if row_count = 0 then
      alter table public."experiment_runs" alter column "recall_7d" drop default;
      alter table public."experiment_runs" alter column "recall_7d" type integer using "recall_7d"::integer;
    else
      raise exception 'Column public.experiment_runs.recall_7d has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'experiment_runs'
    and c.column_name = 'joy';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."experiment_runs";
    if row_count = 0 then
      alter table public."experiment_runs" alter column "joy" drop default;
      alter table public."experiment_runs" alter column "joy" type integer using "joy"::integer;
    else
      raise exception 'Column public.experiment_runs.joy has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'experiment_runs'
    and c.column_name = 'frustration';
  if actual_type is not null and actual_type <> 'int4' then
    select count(*) into row_count from public."experiment_runs";
    if row_count = 0 then
      alter table public."experiment_runs" alter column "frustration" drop default;
      alter table public."experiment_runs" alter column "frustration" type integer using "frustration"::integer;
    else
      raise exception 'Column public.experiment_runs.frustration has type %, expected int4, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'experiment_runs'
    and c.column_name = 'decision';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."experiment_runs";
    if row_count = 0 then
      alter table public."experiment_runs" alter column "decision" drop default;
      alter table public."experiment_runs" alter column "decision" type text using "decision"::text;
    else
      raise exception 'Column public.experiment_runs.decision has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'reward_settings'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."reward_settings";
    if row_count = 0 then
      alter table public."reward_settings" alter column "id" drop default;
      alter table public."reward_settings" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.reward_settings.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'reward_settings'
    and c.column_name = 'guardian_id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."reward_settings";
    if row_count = 0 then
      alter table public."reward_settings" alter column "guardian_id" drop default;
      alter table public."reward_settings" alter column "guardian_id" type text using "guardian_id"::text;
    else
      raise exception 'Column public.reward_settings.guardian_id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'reward_settings'
    and c.column_name = 'enabled';
  if actual_type is not null and actual_type <> 'bool' then
    select count(*) into row_count from public."reward_settings";
    if row_count = 0 then
      alter table public."reward_settings" alter column "enabled" drop default;
      alter table public."reward_settings" alter column "enabled" type boolean using "enabled"::boolean;
  alter table public."reward_settings" alter column "enabled" set default false;
    else
      raise exception 'Column public.reward_settings.enabled has type %, expected bool, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'reward_settings'
    and c.column_name = 'selected_catalog_ids';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."reward_settings";
    if row_count = 0 then
      alter table public."reward_settings" alter column "selected_catalog_ids" drop default;
      alter table public."reward_settings" alter column "selected_catalog_ids" type jsonb using "selected_catalog_ids"::jsonb;
  alter table public."reward_settings" alter column "selected_catalog_ids" set default '[]'::jsonb;
    else
      raise exception 'Column public.reward_settings.selected_catalog_ids has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'reward_settings'
    and c.column_name = 'family_benefits';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."reward_settings";
    if row_count = 0 then
      alter table public."reward_settings" alter column "family_benefits" drop default;
      alter table public."reward_settings" alter column "family_benefits" type jsonb using "family_benefits"::jsonb;
  alter table public."reward_settings" alter column "family_benefits" set default '[]'::jsonb;
    else
      raise exception 'Column public.reward_settings.family_benefits has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'reward_settings'
    and c.column_name = 'require_delayed_recall';
  if actual_type is not null and actual_type <> 'bool' then
    select count(*) into row_count from public."reward_settings";
    if row_count = 0 then
      alter table public."reward_settings" alter column "require_delayed_recall" drop default;
      alter table public."reward_settings" alter column "require_delayed_recall" type boolean using "require_delayed_recall"::boolean;
  alter table public."reward_settings" alter column "require_delayed_recall" set default false;
    else
      raise exception 'Column public.reward_settings.require_delayed_recall has type %, expected bool, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'reward_settings'
    and c.column_name = 'updated_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."reward_settings";
    if row_count = 0 then
      alter table public."reward_settings" alter column "updated_at" drop default;
      alter table public."reward_settings" alter column "updated_at" type timestamptz using "updated_at"::timestamptz;
    else
      raise exception 'Column public.reward_settings.updated_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'app_state_snapshots'
    and c.column_name = 'id';
  if actual_type is not null and actual_type <> 'text' then
    select count(*) into row_count from public."app_state_snapshots";
    if row_count = 0 then
      alter table public."app_state_snapshots" alter column "id" drop default;
      alter table public."app_state_snapshots" alter column "id" type text using "id"::text;
    else
      raise exception 'Column public.app_state_snapshots.id has type %, expected text, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'app_state_snapshots'
    and c.column_name = 'payload';
  if actual_type is not null and actual_type <> 'jsonb' then
    select count(*) into row_count from public."app_state_snapshots";
    if row_count = 0 then
      alter table public."app_state_snapshots" alter column "payload" drop default;
      alter table public."app_state_snapshots" alter column "payload" type jsonb using "payload"::jsonb;
  alter table public."app_state_snapshots" alter column "payload" set default '[]'::jsonb;
    else
      raise exception 'Column public.app_state_snapshots.payload has type %, expected jsonb, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'app_state_snapshots'
    and c.column_name = 'created_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."app_state_snapshots";
    if row_count = 0 then
      alter table public."app_state_snapshots" alter column "created_at" drop default;
      alter table public."app_state_snapshots" alter column "created_at" type timestamptz using "created_at"::timestamptz;
    else
      raise exception 'Column public.app_state_snapshots.created_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$
declare
  row_count bigint;
  actual_type text;
begin
  select c.udt_name into actual_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'app_state_snapshots'
    and c.column_name = 'updated_at';
  if actual_type is not null and actual_type <> 'timestamptz' then
    select count(*) into row_count from public."app_state_snapshots";
    if row_count = 0 then
      alter table public."app_state_snapshots" alter column "updated_at" drop default;
      alter table public."app_state_snapshots" alter column "updated_at" type timestamptz using "updated_at"::timestamptz;
    else
      raise exception 'Column public.app_state_snapshots.updated_at has type %, expected timestamptz, and table is not empty; repair manually before applying constraints.', actual_type;
    end if;
  end if;
end $$;

do $$ begin
  alter table public."students" add constraint "fk_students_user_id" foreign key ("user_id") references public."users" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."students" add constraint "fk_students_grade_level_id" foreign key ("grade_level_id") references public."grade_levels" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."guardians" add constraint "fk_guardians_user_id" foreign key ("user_id") references public."users" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."student_guardians" add constraint "fk_student_guardians_student_id" foreign key ("student_id") references public."students" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."student_guardians" add constraint "fk_student_guardians_guardian_id" foreign key ("guardian_id") references public."guardians" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."account_invitations" add constraint "fk_account_invitations_invited_by_user_id" foreign key ("invited_by_user_id") references public."users" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."account_invitations" add constraint "fk_account_invitations_target_student_id" foreign key ("target_student_id") references public."students" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."account_invitations" add constraint "fk_account_invitations_target_class_id" foreign key ("target_class_id") references public."classes" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."guardian_student_links" add constraint "fk_guardian_student_links_guardian_id" foreign key ("guardian_id") references public."guardians" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."guardian_student_links" add constraint "fk_guardian_student_links_student_id" foreign key ("student_id") references public."students" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."guardian_student_links" add constraint "fk_guardian_student_links_requested_by_user_id" foreign key ("requested_by_user_id") references public."users" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."guardian_student_links" add constraint "fk_guardian_student_links_approved_by_user_id" foreign key ("approved_by_user_id") references public."users" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."session_revocations" add constraint "fk_session_revocations_user_id" foreign key ("user_id") references public."users" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."teachers" add constraint "fk_teachers_user_id" foreign key ("user_id") references public."users" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."classes" add constraint "fk_classes_school_id" foreign key ("school_id") references public."schools" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."classes" add constraint "fk_classes_teacher_id" foreign key ("teacher_id") references public."teachers" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."classes" add constraint "fk_classes_grade_level_id" foreign key ("grade_level_id") references public."grade_levels" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."classes" add constraint "fk_classes_subject_id" foreign key ("subject_id") references public."subjects" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."teacher_class_assignments" add constraint "fk_teacher_class_assignments_teacher_id" foreign key ("teacher_id") references public."teachers" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."teacher_class_assignments" add constraint "fk_teacher_class_assignments_class_id" foreign key ("class_id") references public."classes" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."teacher_class_assignments" add constraint "fk_teacher_class_assignments_assigned_by_user_id" foreign key ("assigned_by_user_id") references public."users" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."enrollments" add constraint "fk_enrollments_student_id" foreign key ("student_id") references public."students" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."enrollments" add constraint "fk_enrollments_class_id" foreign key ("class_id") references public."classes" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."enrollments" add constraint "fk_enrollments_course_id" foreign key ("course_id") references public."courses" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."class_sessions" add constraint "fk_class_sessions_class_id" foreign key ("class_id") references public."classes" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."class_sessions" add constraint "fk_class_sessions_lesson_id" foreign key ("lesson_id") references public."lessons" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."group_missions" add constraint "fk_group_missions_class_session_id" foreign key ("class_session_id") references public."class_sessions" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."group_artifacts" add constraint "fk_group_artifacts_group_mission_id" foreign key ("group_mission_id") references public."group_missions" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."group_artifacts" add constraint "fk_group_artifacts_student_id" foreign key ("student_id") references public."students" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."teacher_interventions" add constraint "fk_teacher_interventions_teacher_id" foreign key ("teacher_id") references public."teachers" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."teacher_interventions" add constraint "fk_teacher_interventions_class_session_id" foreign key ("class_session_id") references public."class_sessions" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."teacher_interventions" add constraint "fk_teacher_interventions_student_id" foreign key ("student_id") references public."students" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."teacher_interventions" add constraint "fk_teacher_interventions_lesson_id" foreign key ("lesson_id") references public."lessons" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."school_reports" add constraint "fk_school_reports_school_id" foreign key ("school_id") references public."schools" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."school_reports" add constraint "fk_school_reports_class_id" foreign key ("class_id") references public."classes" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."grade_levels" add constraint "fk_grade_levels_grade_band_id" foreign key ("grade_band_id") references public."grade_bands" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."courses" add constraint "fk_courses_grade_level_id" foreign key ("grade_level_id") references public."grade_levels" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."courses" add constraint "fk_courses_subject_id" foreign key ("subject_id") references public."subjects" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."units" add constraint "fk_units_course_id" foreign key ("course_id") references public."courses" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."lessons" add constraint "fk_lessons_unit_id" foreign key ("unit_id") references public."units" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."lessons" add constraint "fk_lessons_grade_level_id" foreign key ("grade_level_id") references public."grade_levels" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."lessons" add constraint "fk_lessons_subject_id" foreign key ("subject_id") references public."subjects" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."activities" add constraint "fk_activities_lesson_id" foreign key ("lesson_id") references public."lessons" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."quizzes" add constraint "fk_quizzes_lesson_id" foreign key ("lesson_id") references public."lessons" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."quiz_questions" add constraint "fk_quiz_questions_quiz_id" foreign key ("quiz_id") references public."quizzes" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."quiz_attempts" add constraint "fk_quiz_attempts_quiz_id" foreign key ("quiz_id") references public."quizzes" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."quiz_attempts" add constraint "fk_quiz_attempts_student_id" foreign key ("student_id") references public."students" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."lesson_progress" add constraint "fk_lesson_progress_student_id" foreign key ("student_id") references public."students" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."lesson_progress" add constraint "fk_lesson_progress_lesson_id" foreign key ("lesson_id") references public."lessons" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."mastery_records" add constraint "fk_mastery_records_student_id" foreign key ("student_id") references public."students" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."mastery_records" add constraint "fk_mastery_records_lesson_id" foreign key ("lesson_id") references public."lessons" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."lesson_scratchpads" add constraint "fk_lesson_scratchpads_student_id" foreign key ("student_id") references public."students" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."lesson_scratchpads" add constraint "fk_lesson_scratchpads_lesson_id" foreign key ("lesson_id") references public."lessons" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."interactive_skill_evidence" add constraint "fk_interactive_skill_evidence_student_id" foreign key ("student_id") references public."students" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."interactive_skill_evidence" add constraint "fk_interactive_skill_evidence_lesson_id" foreign key ("lesson_id") references public."lessons" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."lesson_standards" add constraint "fk_lesson_standards_lesson_id" foreign key ("lesson_id") references public."lessons" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."lesson_standards" add constraint "fk_lesson_standards_standard_id" foreign key ("standard_id") references public."standards" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."assignments" add constraint "fk_assignments_student_id" foreign key ("student_id") references public."students" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."assignments" add constraint "fk_assignments_lesson_id" foreign key ("lesson_id") references public."lessons" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."assignments" add constraint "fk_assignments_assigned_by_user_id" foreign key ("assigned_by_user_id") references public."users" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."portfolio_items" add constraint "fk_portfolio_items_student_id" foreign key ("student_id") references public."students" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."portfolio_items" add constraint "fk_portfolio_items_lesson_id" foreign key ("lesson_id") references public."lessons" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."student_badges" add constraint "fk_student_badges_student_id" foreign key ("student_id") references public."students" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."student_badges" add constraint "fk_student_badges_badge_id" foreign key ("badge_id") references public."badges" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."student_badges" add constraint "fk_student_badges_lesson_id" foreign key ("lesson_id") references public."lessons" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."reward_approvals" add constraint "fk_reward_approvals_student_id" foreign key ("student_id") references public."students" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."reward_approvals" add constraint "fk_reward_approvals_guardian_id" foreign key ("guardian_id") references public."guardians" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."content_drafts" add constraint "fk_content_drafts_subject_id" foreign key ("subject_id") references public."subjects" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."content_drafts" add constraint "fk_content_drafts_source_lesson_id" foreign key ("source_lesson_id") references public."lessons" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."content_batch_reviews" add constraint "fk_content_batch_reviews_reviewed_by_user_id" foreign key ("reviewed_by_user_id") references public."users" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."visual_assets" add constraint "fk_visual_assets_lesson_id" foreign key ("lesson_id") references public."lessons" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."visual_assets" add constraint "fk_visual_assets_draft_id" foreign key ("draft_id") references public."content_drafts" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."visual_assets" add constraint "fk_visual_assets_subject_id" foreign key ("subject_id") references public."subjects" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."visual_assets" add constraint "fk_visual_assets_approved_by_user_id" foreign key ("approved_by_user_id") references public."users" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."ai_tutor_events" add constraint "fk_ai_tutor_events_student_id" foreign key ("student_id") references public."students" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."ai_tutor_events" add constraint "fk_ai_tutor_events_lesson_id" foreign key ("lesson_id") references public."lessons" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."lesson_redesign_tasks" add constraint "fk_lesson_redesign_tasks_lesson_id" foreign key ("lesson_id") references public."lessons" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."agent_review_items" add constraint "fk_agent_review_items_reviewed_by_user_id" foreign key ("reviewed_by_user_id") references public."users" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."audit_events" add constraint "fk_audit_events_actor_user_id" foreign key ("actor_user_id") references public."users" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."auth_audit_events" add constraint "fk_auth_audit_events_actor_user_id" foreign key ("actor_user_id") references public."users" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."auth_audit_events" add constraint "fk_auth_audit_events_target_user_id" foreign key ("target_user_id") references public."users" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."consent_records" add constraint "fk_consent_records_student_id" foreign key ("student_id") references public."students" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."consent_records" add constraint "fk_consent_records_guardian_id" foreign key ("guardian_id") references public."guardians" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."accommodations" add constraint "fk_accommodations_student_id" foreign key ("student_id") references public."students" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."retention_schedules" add constraint "fk_retention_schedules_student_id" foreign key ("student_id") references public."students" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."retention_schedules" add constraint "fk_retention_schedules_lesson_id" foreign key ("lesson_id") references public."lessons" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."learning_events" add constraint "fk_learning_events_student_id" foreign key ("student_id") references public."students" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."learning_events" add constraint "fk_learning_events_lesson_id" foreign key ("lesson_id") references public."lessons" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."experiment_runs" add constraint "fk_experiment_runs_student_id" foreign key ("student_id") references public."students" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."experiment_runs" add constraint "fk_experiment_runs_lesson_id" foreign key ("lesson_id") references public."lessons" ("id");
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public."reward_settings" add constraint "fk_reward_settings_guardian_id" foreign key ("guardian_id") references public."guardians" ("id");
exception when duplicate_object then null;
end $$;

create index if not exists "idx_users_role" on public."users" ("role");

create index if not exists "idx_users_status" on public."users" ("status");

create index if not exists "idx_users_created_at" on public."users" ("created_at");

create index if not exists "idx_students_user_id" on public."students" ("user_id");

create index if not exists "idx_students_grade_level_id" on public."students" ("grade_level_id");

create index if not exists "idx_students_status" on public."students" ("status");

create index if not exists "idx_students_created_at" on public."students" ("created_at");

create index if not exists "idx_guardians_user_id" on public."guardians" ("user_id");

create index if not exists "idx_guardians_created_at" on public."guardians" ("created_at");

create index if not exists "idx_student_guardians_student_id" on public."student_guardians" ("student_id");

create index if not exists "idx_student_guardians_guardian_id" on public."student_guardians" ("guardian_id");

create index if not exists "idx_student_guardians_created_at" on public."student_guardians" ("created_at");

create index if not exists "idx_account_invitations_invited_by_user_id" on public."account_invitations" ("invited_by_user_id");

create index if not exists "idx_account_invitations_target_student_id" on public."account_invitations" ("target_student_id");

create index if not exists "idx_account_invitations_target_class_id" on public."account_invitations" ("target_class_id");

create index if not exists "idx_account_invitations_role" on public."account_invitations" ("role");

create index if not exists "idx_account_invitations_status" on public."account_invitations" ("status");

create index if not exists "idx_account_invitations_created_at" on public."account_invitations" ("created_at");

create index if not exists "idx_guardian_student_links_guardian_id" on public."guardian_student_links" ("guardian_id");

create index if not exists "idx_guardian_student_links_student_id" on public."guardian_student_links" ("student_id");

create index if not exists "idx_guardian_student_links_requested_by_user_id" on public."guardian_student_links" ("requested_by_user_id");

create index if not exists "idx_guardian_student_links_approved_by_user_id" on public."guardian_student_links" ("approved_by_user_id");

create index if not exists "idx_guardian_student_links_status" on public."guardian_student_links" ("status");

create index if not exists "idx_guardian_student_links_created_at" on public."guardian_student_links" ("created_at");

create index if not exists "idx_session_revocations_user_id" on public."session_revocations" ("user_id");

create index if not exists "idx_session_revocations_created_at" on public."session_revocations" ("created_at");

create index if not exists "idx_teachers_user_id" on public."teachers" ("user_id");

create index if not exists "idx_teachers_created_at" on public."teachers" ("created_at");

create index if not exists "idx_schools_status" on public."schools" ("status");

create index if not exists "idx_schools_created_at" on public."schools" ("created_at");

create index if not exists "idx_classes_school_id" on public."classes" ("school_id");

create index if not exists "idx_classes_teacher_id" on public."classes" ("teacher_id");

create index if not exists "idx_classes_grade_level_id" on public."classes" ("grade_level_id");

create index if not exists "idx_classes_subject_id" on public."classes" ("subject_id");

create index if not exists "idx_classes_status" on public."classes" ("status");

create index if not exists "idx_classes_created_at" on public."classes" ("created_at");

create index if not exists "idx_teacher_class_assignments_teacher_id" on public."teacher_class_assignments" ("teacher_id");

create index if not exists "idx_teacher_class_assignments_class_id" on public."teacher_class_assignments" ("class_id");

create index if not exists "idx_teacher_class_assignments_assigned_by_user_id" on public."teacher_class_assignments" ("assigned_by_user_id");

create index if not exists "idx_teacher_class_assignments_status" on public."teacher_class_assignments" ("status");

create index if not exists "idx_teacher_class_assignments_created_at" on public."teacher_class_assignments" ("created_at");

create index if not exists "idx_enrollments_student_id" on public."enrollments" ("student_id");

create index if not exists "idx_enrollments_class_id" on public."enrollments" ("class_id");

create index if not exists "idx_enrollments_course_id" on public."enrollments" ("course_id");

create index if not exists "idx_enrollments_status" on public."enrollments" ("status");

create index if not exists "idx_class_sessions_class_id" on public."class_sessions" ("class_id");

create index if not exists "idx_class_sessions_lesson_id" on public."class_sessions" ("lesson_id");

create index if not exists "idx_class_sessions_status" on public."class_sessions" ("status");

create index if not exists "idx_class_sessions_created_at" on public."class_sessions" ("created_at");

create index if not exists "idx_group_missions_class_session_id" on public."group_missions" ("class_session_id");

create index if not exists "idx_group_missions_status" on public."group_missions" ("status");

create index if not exists "idx_group_missions_created_at" on public."group_missions" ("created_at");

create index if not exists "idx_group_artifacts_group_mission_id" on public."group_artifacts" ("group_mission_id");

create index if not exists "idx_group_artifacts_student_id" on public."group_artifacts" ("student_id");

create index if not exists "idx_teacher_interventions_teacher_id" on public."teacher_interventions" ("teacher_id");

create index if not exists "idx_teacher_interventions_class_session_id" on public."teacher_interventions" ("class_session_id");

create index if not exists "idx_teacher_interventions_student_id" on public."teacher_interventions" ("student_id");

create index if not exists "idx_teacher_interventions_lesson_id" on public."teacher_interventions" ("lesson_id");

create index if not exists "idx_teacher_interventions_status" on public."teacher_interventions" ("status");

create index if not exists "idx_teacher_interventions_created_at" on public."teacher_interventions" ("created_at");

create index if not exists "idx_school_reports_school_id" on public."school_reports" ("school_id");

create index if not exists "idx_school_reports_class_id" on public."school_reports" ("class_id");

create index if not exists "idx_school_reports_created_at" on public."school_reports" ("created_at");

create index if not exists "idx_grade_levels_grade_band_id" on public."grade_levels" ("grade_band_id");

create index if not exists "idx_subjects_created_at" on public."subjects" ("created_at");

create index if not exists "idx_courses_grade_level_id" on public."courses" ("grade_level_id");

create index if not exists "idx_courses_subject_id" on public."courses" ("subject_id");

create index if not exists "idx_courses_status" on public."courses" ("status");

create index if not exists "idx_courses_created_at" on public."courses" ("created_at");

create index if not exists "idx_units_course_id" on public."units" ("course_id");

create index if not exists "idx_units_created_at" on public."units" ("created_at");

create index if not exists "idx_lessons_unit_id" on public."lessons" ("unit_id");

create index if not exists "idx_lessons_grade_level_id" on public."lessons" ("grade_level_id");

create index if not exists "idx_lessons_subject_id" on public."lessons" ("subject_id");

create index if not exists "idx_lessons_status" on public."lessons" ("status");

create index if not exists "idx_lessons_created_at" on public."lessons" ("created_at");

create index if not exists "idx_activities_lesson_id" on public."activities" ("lesson_id");

create index if not exists "idx_activities_created_at" on public."activities" ("created_at");

create index if not exists "idx_quizzes_lesson_id" on public."quizzes" ("lesson_id");

create index if not exists "idx_quizzes_created_at" on public."quizzes" ("created_at");

create index if not exists "idx_quiz_questions_quiz_id" on public."quiz_questions" ("quiz_id");

create index if not exists "idx_quiz_attempts_quiz_id" on public."quiz_attempts" ("quiz_id");

create index if not exists "idx_quiz_attempts_student_id" on public."quiz_attempts" ("student_id");

create index if not exists "idx_lesson_progress_student_id" on public."lesson_progress" ("student_id");

create index if not exists "idx_lesson_progress_lesson_id" on public."lesson_progress" ("lesson_id");

create index if not exists "idx_lesson_progress_status" on public."lesson_progress" ("status");

create index if not exists "idx_mastery_records_student_id" on public."mastery_records" ("student_id");

create index if not exists "idx_mastery_records_lesson_id" on public."mastery_records" ("lesson_id");

create index if not exists "idx_mastery_records_status" on public."mastery_records" ("status");

create index if not exists "idx_lesson_scratchpads_student_id" on public."lesson_scratchpads" ("student_id");

create index if not exists "idx_lesson_scratchpads_lesson_id" on public."lesson_scratchpads" ("lesson_id");

create index if not exists "idx_interactive_skill_evidence_student_id" on public."interactive_skill_evidence" ("student_id");

create index if not exists "idx_interactive_skill_evidence_lesson_id" on public."interactive_skill_evidence" ("lesson_id");

create index if not exists "idx_interactive_skill_evidence_status" on public."interactive_skill_evidence" ("status");

create index if not exists "idx_standards_created_at" on public."standards" ("created_at");

create index if not exists "idx_lesson_standards_lesson_id" on public."lesson_standards" ("lesson_id");

create index if not exists "idx_lesson_standards_standard_id" on public."lesson_standards" ("standard_id");

create index if not exists "idx_assignments_student_id" on public."assignments" ("student_id");

create index if not exists "idx_assignments_lesson_id" on public."assignments" ("lesson_id");

create index if not exists "idx_assignments_assigned_by_user_id" on public."assignments" ("assigned_by_user_id");

create index if not exists "idx_assignments_status" on public."assignments" ("status");

create index if not exists "idx_assignments_created_at" on public."assignments" ("created_at");

create index if not exists "idx_portfolio_items_student_id" on public."portfolio_items" ("student_id");

create index if not exists "idx_portfolio_items_lesson_id" on public."portfolio_items" ("lesson_id");

create index if not exists "idx_portfolio_items_created_at" on public."portfolio_items" ("created_at");

create index if not exists "idx_badges_created_at" on public."badges" ("created_at");

create index if not exists "idx_student_badges_student_id" on public."student_badges" ("student_id");

create index if not exists "idx_student_badges_badge_id" on public."student_badges" ("badge_id");

create index if not exists "idx_student_badges_lesson_id" on public."student_badges" ("lesson_id");

create index if not exists "idx_reward_approvals_student_id" on public."reward_approvals" ("student_id");

create index if not exists "idx_reward_approvals_guardian_id" on public."reward_approvals" ("guardian_id");

create index if not exists "idx_reward_approvals_status" on public."reward_approvals" ("status");

create index if not exists "idx_content_drafts_subject_id" on public."content_drafts" ("subject_id");

create index if not exists "idx_content_drafts_source_lesson_id" on public."content_drafts" ("source_lesson_id");

create index if not exists "idx_content_drafts_status" on public."content_drafts" ("status");

create index if not exists "idx_content_drafts_created_at" on public."content_drafts" ("created_at");

create index if not exists "idx_content_batch_reviews_reviewed_by_user_id" on public."content_batch_reviews" ("reviewed_by_user_id");

create index if not exists "idx_content_batch_reviews_status" on public."content_batch_reviews" ("status");

create index if not exists "idx_content_batch_reviews_created_at" on public."content_batch_reviews" ("created_at");

create index if not exists "idx_visual_assets_lesson_id" on public."visual_assets" ("lesson_id");

create index if not exists "idx_visual_assets_draft_id" on public."visual_assets" ("draft_id");

create index if not exists "idx_visual_assets_subject_id" on public."visual_assets" ("subject_id");

create index if not exists "idx_visual_assets_approved_by_user_id" on public."visual_assets" ("approved_by_user_id");

create index if not exists "idx_visual_assets_status" on public."visual_assets" ("status");

create index if not exists "idx_visual_assets_created_at" on public."visual_assets" ("created_at");

create index if not exists "idx_ai_tutor_events_student_id" on public."ai_tutor_events" ("student_id");

create index if not exists "idx_ai_tutor_events_lesson_id" on public."ai_tutor_events" ("lesson_id");

create index if not exists "idx_ai_tutor_events_created_at" on public."ai_tutor_events" ("created_at");

create index if not exists "idx_agent_tool_calls_role" on public."agent_tool_calls" ("role");

create index if not exists "idx_agent_tool_calls_status" on public."agent_tool_calls" ("status");

create index if not exists "idx_agent_tool_calls_created_at" on public."agent_tool_calls" ("created_at");

create index if not exists "idx_research_evidence_sources_status" on public."research_evidence_sources" ("status");

create index if not exists "idx_lesson_redesign_tasks_lesson_id" on public."lesson_redesign_tasks" ("lesson_id");

create index if not exists "idx_lesson_redesign_tasks_status" on public."lesson_redesign_tasks" ("status");

create index if not exists "idx_lesson_redesign_tasks_created_at" on public."lesson_redesign_tasks" ("created_at");

create index if not exists "idx_agent_review_items_reviewed_by_user_id" on public."agent_review_items" ("reviewed_by_user_id");

create index if not exists "idx_agent_review_items_status" on public."agent_review_items" ("status");

create index if not exists "idx_audit_events_actor_user_id" on public."audit_events" ("actor_user_id");

create index if not exists "idx_audit_events_created_at" on public."audit_events" ("created_at");

create index if not exists "idx_auth_audit_events_actor_user_id" on public."auth_audit_events" ("actor_user_id");

create index if not exists "idx_auth_audit_events_target_user_id" on public."auth_audit_events" ("target_user_id");

create index if not exists "idx_auth_audit_events_created_at" on public."auth_audit_events" ("created_at");

create index if not exists "idx_consent_records_student_id" on public."consent_records" ("student_id");

create index if not exists "idx_consent_records_guardian_id" on public."consent_records" ("guardian_id");

create index if not exists "idx_accommodations_student_id" on public."accommodations" ("student_id");

create index if not exists "idx_accommodations_created_at" on public."accommodations" ("created_at");

create index if not exists "idx_retention_schedules_student_id" on public."retention_schedules" ("student_id");

create index if not exists "idx_retention_schedules_lesson_id" on public."retention_schedules" ("lesson_id");

create index if not exists "idx_learning_events_student_id" on public."learning_events" ("student_id");

create index if not exists "idx_learning_events_lesson_id" on public."learning_events" ("lesson_id");

create index if not exists "idx_experiment_runs_student_id" on public."experiment_runs" ("student_id");

create index if not exists "idx_experiment_runs_lesson_id" on public."experiment_runs" ("lesson_id");

create index if not exists "idx_reward_settings_guardian_id" on public."reward_settings" ("guardian_id");

create index if not exists "idx_app_state_snapshots_created_at" on public."app_state_snapshots" ("created_at");

comment on table public."users" is 'Authenticated accounts for parents, teachers, admins, and student login shells when enabled.';

comment on table public."students" is 'Learner profile, grade placement, academy, schedule, and support settings.';

comment on table public."guardians" is 'Parent/guardian records linked to household learners.';

comment on table public."student_guardians" is 'Many-to-many link between learners and guardians.';

comment on table public."account_invitations" is 'Provider-backed account invitations for parent, teacher, and student onboarding.';

comment on table public."guardian_student_links" is 'Parent-child link requests, approvals, and revocations before they become active household links.';

comment on table public."session_revocations" is 'Revoked sessions and revoke-before markers used to invalidate old provider or app sessions.';

comment on table public."teachers" is 'Teacher profiles for homeschool co-ops, tutors, and school expansion.';

comment on table public."schools" is 'School or organization profile for school-sellable classroom deployments.';

comment on table public."classes" is 'Class, cohort, household, or study group containers.';

comment on table public."teacher_class_assignments" is 'Teacher-class assignment approvals and revocations for role-scoped classroom access.';

comment on table public."enrollments" is 'Students assigned to classes and courses.';

comment on table public."class_sessions" is 'A class-period learning block that students attend inside the app.';

comment on table public."group_missions" is 'Structured collaborative work for Bridge and Scholar class sessions.';

comment on table public."group_artifacts" is 'Shared group output and each learner''s individual accountability evidence.';

comment on table public."teacher_interventions" is 'Teacher support decisions created from live class monitoring, confusion, and mastery signals.';

comment on table public."school_reports" is 'School-admin reporting snapshots for usage, mastery, intervention needs, and pilot readiness.';

comment on table public."grade_bands" is 'Foundation, Bridge, and Scholar academy bands.';

comment on table public."grade_levels" is 'K-12 grade levels linked to grade bands.';

comment on table public."subjects" is 'Subject taxonomy used by courses and lessons.';

comment on table public."courses" is 'Grade-level courses mapped to subjects and standards.';

comment on table public."units" is 'Course units with planned lesson targets and required lesson sections.';

comment on table public."lessons" is 'Versioned lessons with objectives, teaching support, visuals, mastery thresholds, and paths.';

comment on table public."activities" is 'Warm-ups, direct instruction, guided practice, interactive tasks, independent practice, group homework, reteach, and challenge steps.';

comment on table public."quizzes" is 'Lesson mastery checkpoints and assessments.';

comment on table public."quiz_questions" is 'Question bank with answer explanations, difficulty, skill tags, and standards tags.';

comment on table public."quiz_attempts" is 'Student quiz attempts, scores, mastery pass/fail, and answer snapshots.';

comment on table public."lesson_progress" is 'Per-lesson student progress state and timestamps.';

comment on table public."mastery_records" is 'Current and historical mastery evidence by student, lesson, and skill.';

comment on table public."lesson_scratchpads" is 'Student-written first steps, explanations, confusion statements, retry evidence, and tutor-review counts.';

comment on table public."interactive_skill_evidence" is 'Skill-level evidence generated by interactive widgets, including diagnosis, support move, and status.';

comment on table public."standards" is 'Flexible standards framework registry.';

comment on table public."lesson_standards" is 'Many-to-many lesson standards tags.';

comment on table public."assignments" is 'Teacher/parent assigned lessons, reviews, projects, and worksheets.';

comment on table public."portfolio_items" is 'Student artifacts, mastery evidence, capstones, labs, writing, and progress records.';

comment on table public."badges" is 'Mastery and retention reward definitions.';

comment on table public."student_badges" is 'Earned student badges and benefit unlocks.';

comment on table public."reward_approvals" is 'Parent-reviewed reward requests, approval decisions, redemption status, and mastery evidence.';

comment on table public."content_drafts" is 'Draft/review/publish workflow records for authored or imported lessons.';

comment on table public."content_batch_reviews" is 'Durable batch-level quality gate records that block weak or unsafe lessons and visuals from publication.';

comment on table public."visual_assets" is 'Generated or reviewed lesson images, diagrams, alt text, license, and approval state.';

comment on table public."ai_tutor_events" is 'Lesson-scoped tutor turns, classifications, blocked-answer events, and safety flags.';

comment on table public."agent_tool_calls" is 'Tool Gateway call log with role, owner agent, risk, status, and review state.';

comment on table public."research_evidence_sources" is 'Staff-reviewed source ledger for syllabus, misconception, standards, and teaching-redesign claims.';

comment on table public."lesson_redesign_tasks" is 'Research-backed lesson redesign tasks created from tutor feedback, source findings, and misconception analysis.';

comment on table public."agent_review_items" is 'Human review queue for visuals, content, AI flags, and review-gated tool outputs.';

comment on table public."audit_events" is 'Immutable record of security, privacy, review, and data-change events.';

comment on table public."auth_audit_events" is 'Immutable auth lifecycle audit records for invitations, email verification, role changes, links, and revocations.';

comment on table public."consent_records" is 'Parent-managed consent for data collection, AI, portfolio, and third-party sharing.';

comment on table public."accommodations" is 'Learner supports such as read-aloud, planner prompts, short practice sets, and portfolio reminders.';

comment on table public."retention_schedules" is 'Spaced-recall schedule for delayed mastery checks.';

comment on table public."learning_events" is 'Event stream for starts, quiz completions, reteach events, rewards, and experiment metrics.';

comment on table public."experiment_runs" is 'Trial-and-error learning experiments with immediate and delayed retention metrics.';

comment on table public."reward_settings" is 'Household reward settings and mastery-benefit rules.';

comment on table public."app_state_snapshots" is 'Transitional database-backed state snapshots used while repository calls move from prototype state to normalized tables.';

alter table public."users" enable row level security;

create policy "users_platform_admin_all" on public."users" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "users_self_select" on public."users" for select to authenticated using ("id" = (select public.k12_current_app_user_id()));

alter table public."students" enable row level security;

create policy "students_platform_admin_all" on public."students" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "students_student_self" on public."students" for select to authenticated using ((select public.k12_current_app_role()) = 'student' and "id" = (select public.k12_current_app_student_id()));

create policy "students_parent_household" on public."students" for select to authenticated using ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."student_guardians" sg join public."guardians" g on g."id" = sg."guardian_id" where sg."student_id" = "students"."id" and g."user_id" = (select public.k12_current_app_user_id())));

alter table public."guardians" enable row level security;

create policy "guardians_platform_admin_all" on public."guardians" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

alter table public."student_guardians" enable row level security;

create policy "student_guardians_platform_admin_all" on public."student_guardians" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "student_guardians_student_select_own" on public."student_guardians" for select to authenticated using ((select public.k12_current_app_role()) = 'student' and "student_id" = (select public.k12_current_app_student_id()));

create policy "student_guardians_parent_select_household" on public."student_guardians" for select to authenticated using ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."student_guardians" sg join public."guardians" g on g."id" = sg."guardian_id" where sg."student_id" = "student_guardians"."student_id" and g."user_id" = (select public.k12_current_app_user_id())));

create policy "student_guardians_teacher_select_assigned" on public."student_guardians" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' and exists (select 1 from public."enrollments" e join public."classes" c on c."id" = e."class_id" join public."teachers" t on t."id" = c."teacher_id" where e."student_id" = "student_guardians"."student_id" and t."user_id" = (select public.k12_current_app_user_id())));

create policy "student_guardians_parent_guardian_scope" on public."student_guardians" for all to authenticated using ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."guardians" g where g."id" = "student_guardians"."guardian_id" and g."user_id" = (select public.k12_current_app_user_id()))) with check ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."guardians" g where g."id" = "student_guardians"."guardian_id" and g."user_id" = (select public.k12_current_app_user_id())));

alter table public."account_invitations" enable row level security;

create policy "account_invitations_platform_admin_all" on public."account_invitations" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

alter table public."guardian_student_links" enable row level security;

create policy "guardian_student_links_platform_admin_all" on public."guardian_student_links" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "guardian_student_links_student_select_own" on public."guardian_student_links" for select to authenticated using ((select public.k12_current_app_role()) = 'student' and "student_id" = (select public.k12_current_app_student_id()));

create policy "guardian_student_links_parent_select_household" on public."guardian_student_links" for select to authenticated using ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."student_guardians" sg join public."guardians" g on g."id" = sg."guardian_id" where sg."student_id" = "guardian_student_links"."student_id" and g."user_id" = (select public.k12_current_app_user_id())));

create policy "guardian_student_links_teacher_select_assigned" on public."guardian_student_links" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' and exists (select 1 from public."enrollments" e join public."classes" c on c."id" = e."class_id" join public."teachers" t on t."id" = c."teacher_id" where e."student_id" = "guardian_student_links"."student_id" and t."user_id" = (select public.k12_current_app_user_id())));

create policy "guardian_student_links_parent_guardian_scope" on public."guardian_student_links" for all to authenticated using ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."guardians" g where g."id" = "guardian_student_links"."guardian_id" and g."user_id" = (select public.k12_current_app_user_id()))) with check ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."guardians" g where g."id" = "guardian_student_links"."guardian_id" and g."user_id" = (select public.k12_current_app_user_id())));

alter table public."session_revocations" enable row level security;

create policy "session_revocations_platform_admin_all" on public."session_revocations" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

alter table public."teachers" enable row level security;

create policy "teachers_platform_admin_all" on public."teachers" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

alter table public."schools" enable row level security;

create policy "schools_platform_admin_all" on public."schools" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

alter table public."classes" enable row level security;

create policy "classes_platform_admin_all" on public."classes" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "classes_teacher_scope" on public."classes" for all to authenticated using ((select public.k12_current_app_role()) = 'teacher' and exists (select 1 from public."teachers" t where t."id" = "classes"."teacher_id" and t."user_id" = (select public.k12_current_app_user_id()))) with check ((select public.k12_current_app_role()) = 'teacher' and exists (select 1 from public."teachers" t where t."id" = "classes"."teacher_id" and t."user_id" = (select public.k12_current_app_user_id())));

alter table public."teacher_class_assignments" enable row level security;

create policy "teacher_class_assignments_platform_admin_all" on public."teacher_class_assignments" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "teacher_class_assignments_teacher_scope" on public."teacher_class_assignments" for all to authenticated using ((select public.k12_current_app_role()) = 'teacher' and exists (select 1 from public."teachers" t where t."id" = "teacher_class_assignments"."teacher_id" and t."user_id" = (select public.k12_current_app_user_id()))) with check ((select public.k12_current_app_role()) = 'teacher' and exists (select 1 from public."teachers" t where t."id" = "teacher_class_assignments"."teacher_id" and t."user_id" = (select public.k12_current_app_user_id())));

alter table public."enrollments" enable row level security;

create policy "enrollments_platform_admin_all" on public."enrollments" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "enrollments_student_select_own" on public."enrollments" for select to authenticated using ((select public.k12_current_app_role()) = 'student' and "student_id" = (select public.k12_current_app_student_id()));

create policy "enrollments_parent_select_household" on public."enrollments" for select to authenticated using ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."student_guardians" sg join public."guardians" g on g."id" = sg."guardian_id" where sg."student_id" = "enrollments"."student_id" and g."user_id" = (select public.k12_current_app_user_id())));

create policy "enrollments_teacher_select_assigned" on public."enrollments" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' and exists (select 1 from public."enrollments" e join public."classes" c on c."id" = e."class_id" join public."teachers" t on t."id" = c."teacher_id" where e."student_id" = "enrollments"."student_id" and t."user_id" = (select public.k12_current_app_user_id())));

alter table public."class_sessions" enable row level security;

create policy "class_sessions_platform_admin_all" on public."class_sessions" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

alter table public."group_missions" enable row level security;

create policy "group_missions_platform_admin_all" on public."group_missions" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

alter table public."group_artifacts" enable row level security;

create policy "group_artifacts_platform_admin_all" on public."group_artifacts" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "group_artifacts_student_select_own" on public."group_artifacts" for select to authenticated using ((select public.k12_current_app_role()) = 'student' and "student_id" = (select public.k12_current_app_student_id()));

create policy "group_artifacts_parent_select_household" on public."group_artifacts" for select to authenticated using ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."student_guardians" sg join public."guardians" g on g."id" = sg."guardian_id" where sg."student_id" = "group_artifacts"."student_id" and g."user_id" = (select public.k12_current_app_user_id())));

create policy "group_artifacts_teacher_select_assigned" on public."group_artifacts" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' and exists (select 1 from public."enrollments" e join public."classes" c on c."id" = e."class_id" join public."teachers" t on t."id" = c."teacher_id" where e."student_id" = "group_artifacts"."student_id" and t."user_id" = (select public.k12_current_app_user_id())));

alter table public."teacher_interventions" enable row level security;

create policy "teacher_interventions_platform_admin_all" on public."teacher_interventions" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "teacher_interventions_student_select_own" on public."teacher_interventions" for select to authenticated using ((select public.k12_current_app_role()) = 'student' and "student_id" = (select public.k12_current_app_student_id()));

create policy "teacher_interventions_parent_select_household" on public."teacher_interventions" for select to authenticated using ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."student_guardians" sg join public."guardians" g on g."id" = sg."guardian_id" where sg."student_id" = "teacher_interventions"."student_id" and g."user_id" = (select public.k12_current_app_user_id())));

create policy "teacher_interventions_teacher_select_assigned" on public."teacher_interventions" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' and exists (select 1 from public."enrollments" e join public."classes" c on c."id" = e."class_id" join public."teachers" t on t."id" = c."teacher_id" where e."student_id" = "teacher_interventions"."student_id" and t."user_id" = (select public.k12_current_app_user_id())));

create policy "teacher_interventions_teacher_scope" on public."teacher_interventions" for all to authenticated using ((select public.k12_current_app_role()) = 'teacher' and exists (select 1 from public."teachers" t where t."id" = "teacher_interventions"."teacher_id" and t."user_id" = (select public.k12_current_app_user_id()))) with check ((select public.k12_current_app_role()) = 'teacher' and exists (select 1 from public."teachers" t where t."id" = "teacher_interventions"."teacher_id" and t."user_id" = (select public.k12_current_app_user_id())));

alter table public."school_reports" enable row level security;

create policy "school_reports_platform_admin_all" on public."school_reports" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

alter table public."quiz_attempts" enable row level security;

create policy "quiz_attempts_platform_admin_all" on public."quiz_attempts" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "quiz_attempts_student_select_own" on public."quiz_attempts" for select to authenticated using ((select public.k12_current_app_role()) = 'student' and "student_id" = (select public.k12_current_app_student_id()));

create policy "quiz_attempts_parent_select_household" on public."quiz_attempts" for select to authenticated using ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."student_guardians" sg join public."guardians" g on g."id" = sg."guardian_id" where sg."student_id" = "quiz_attempts"."student_id" and g."user_id" = (select public.k12_current_app_user_id())));

create policy "quiz_attempts_teacher_select_assigned" on public."quiz_attempts" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' and exists (select 1 from public."enrollments" e join public."classes" c on c."id" = e."class_id" join public."teachers" t on t."id" = c."teacher_id" where e."student_id" = "quiz_attempts"."student_id" and t."user_id" = (select public.k12_current_app_user_id())));

alter table public."lesson_progress" enable row level security;

create policy "lesson_progress_platform_admin_all" on public."lesson_progress" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "lesson_progress_student_select_own" on public."lesson_progress" for select to authenticated using ((select public.k12_current_app_role()) = 'student' and "student_id" = (select public.k12_current_app_student_id()));

create policy "lesson_progress_parent_select_household" on public."lesson_progress" for select to authenticated using ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."student_guardians" sg join public."guardians" g on g."id" = sg."guardian_id" where sg."student_id" = "lesson_progress"."student_id" and g."user_id" = (select public.k12_current_app_user_id())));

create policy "lesson_progress_teacher_select_assigned" on public."lesson_progress" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' and exists (select 1 from public."enrollments" e join public."classes" c on c."id" = e."class_id" join public."teachers" t on t."id" = c."teacher_id" where e."student_id" = "lesson_progress"."student_id" and t."user_id" = (select public.k12_current_app_user_id())));

alter table public."mastery_records" enable row level security;

create policy "mastery_records_platform_admin_all" on public."mastery_records" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "mastery_records_student_select_own" on public."mastery_records" for select to authenticated using ((select public.k12_current_app_role()) = 'student' and "student_id" = (select public.k12_current_app_student_id()));

create policy "mastery_records_parent_select_household" on public."mastery_records" for select to authenticated using ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."student_guardians" sg join public."guardians" g on g."id" = sg."guardian_id" where sg."student_id" = "mastery_records"."student_id" and g."user_id" = (select public.k12_current_app_user_id())));

create policy "mastery_records_teacher_select_assigned" on public."mastery_records" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' and exists (select 1 from public."enrollments" e join public."classes" c on c."id" = e."class_id" join public."teachers" t on t."id" = c."teacher_id" where e."student_id" = "mastery_records"."student_id" and t."user_id" = (select public.k12_current_app_user_id())));

alter table public."lesson_scratchpads" enable row level security;

create policy "lesson_scratchpads_platform_admin_all" on public."lesson_scratchpads" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "lesson_scratchpads_student_select_own" on public."lesson_scratchpads" for select to authenticated using ((select public.k12_current_app_role()) = 'student' and "student_id" = (select public.k12_current_app_student_id()));

create policy "lesson_scratchpads_parent_select_household" on public."lesson_scratchpads" for select to authenticated using ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."student_guardians" sg join public."guardians" g on g."id" = sg."guardian_id" where sg."student_id" = "lesson_scratchpads"."student_id" and g."user_id" = (select public.k12_current_app_user_id())));

create policy "lesson_scratchpads_teacher_select_assigned" on public."lesson_scratchpads" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' and exists (select 1 from public."enrollments" e join public."classes" c on c."id" = e."class_id" join public."teachers" t on t."id" = c."teacher_id" where e."student_id" = "lesson_scratchpads"."student_id" and t."user_id" = (select public.k12_current_app_user_id())));

alter table public."interactive_skill_evidence" enable row level security;

create policy "interactive_skill_evidence_platform_admin_all" on public."interactive_skill_evidence" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "interactive_skill_evidence_student_select_own" on public."interactive_skill_evidence" for select to authenticated using ((select public.k12_current_app_role()) = 'student' and "student_id" = (select public.k12_current_app_student_id()));

create policy "interactive_skill_evidence_parent_select_household" on public."interactive_skill_evidence" for select to authenticated using ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."student_guardians" sg join public."guardians" g on g."id" = sg."guardian_id" where sg."student_id" = "interactive_skill_evidence"."student_id" and g."user_id" = (select public.k12_current_app_user_id())));

create policy "interactive_skill_evidence_teacher_select_assigned" on public."interactive_skill_evidence" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' and exists (select 1 from public."enrollments" e join public."classes" c on c."id" = e."class_id" join public."teachers" t on t."id" = c."teacher_id" where e."student_id" = "interactive_skill_evidence"."student_id" and t."user_id" = (select public.k12_current_app_user_id())));

alter table public."assignments" enable row level security;

create policy "assignments_platform_admin_all" on public."assignments" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "assignments_student_select_own" on public."assignments" for select to authenticated using ((select public.k12_current_app_role()) = 'student' and "student_id" = (select public.k12_current_app_student_id()));

create policy "assignments_parent_select_household" on public."assignments" for select to authenticated using ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."student_guardians" sg join public."guardians" g on g."id" = sg."guardian_id" where sg."student_id" = "assignments"."student_id" and g."user_id" = (select public.k12_current_app_user_id())));

create policy "assignments_teacher_select_assigned" on public."assignments" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' and exists (select 1 from public."enrollments" e join public."classes" c on c."id" = e."class_id" join public."teachers" t on t."id" = c."teacher_id" where e."student_id" = "assignments"."student_id" and t."user_id" = (select public.k12_current_app_user_id())));

alter table public."portfolio_items" enable row level security;

create policy "portfolio_items_platform_admin_all" on public."portfolio_items" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "portfolio_items_student_select_own" on public."portfolio_items" for select to authenticated using ((select public.k12_current_app_role()) = 'student' and "student_id" = (select public.k12_current_app_student_id()));

create policy "portfolio_items_parent_select_household" on public."portfolio_items" for select to authenticated using ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."student_guardians" sg join public."guardians" g on g."id" = sg."guardian_id" where sg."student_id" = "portfolio_items"."student_id" and g."user_id" = (select public.k12_current_app_user_id())));

create policy "portfolio_items_teacher_select_assigned" on public."portfolio_items" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' and exists (select 1 from public."enrollments" e join public."classes" c on c."id" = e."class_id" join public."teachers" t on t."id" = c."teacher_id" where e."student_id" = "portfolio_items"."student_id" and t."user_id" = (select public.k12_current_app_user_id())));

alter table public."student_badges" enable row level security;

create policy "student_badges_platform_admin_all" on public."student_badges" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "student_badges_student_select_own" on public."student_badges" for select to authenticated using ((select public.k12_current_app_role()) = 'student' and "student_id" = (select public.k12_current_app_student_id()));

create policy "student_badges_parent_select_household" on public."student_badges" for select to authenticated using ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."student_guardians" sg join public."guardians" g on g."id" = sg."guardian_id" where sg."student_id" = "student_badges"."student_id" and g."user_id" = (select public.k12_current_app_user_id())));

create policy "student_badges_teacher_select_assigned" on public."student_badges" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' and exists (select 1 from public."enrollments" e join public."classes" c on c."id" = e."class_id" join public."teachers" t on t."id" = c."teacher_id" where e."student_id" = "student_badges"."student_id" and t."user_id" = (select public.k12_current_app_user_id())));

alter table public."reward_approvals" enable row level security;

create policy "reward_approvals_platform_admin_all" on public."reward_approvals" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "reward_approvals_student_select_own" on public."reward_approvals" for select to authenticated using ((select public.k12_current_app_role()) = 'student' and "student_id" = (select public.k12_current_app_student_id()));

create policy "reward_approvals_parent_select_household" on public."reward_approvals" for select to authenticated using ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."student_guardians" sg join public."guardians" g on g."id" = sg."guardian_id" where sg."student_id" = "reward_approvals"."student_id" and g."user_id" = (select public.k12_current_app_user_id())));

create policy "reward_approvals_teacher_select_assigned" on public."reward_approvals" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' and exists (select 1 from public."enrollments" e join public."classes" c on c."id" = e."class_id" join public."teachers" t on t."id" = c."teacher_id" where e."student_id" = "reward_approvals"."student_id" and t."user_id" = (select public.k12_current_app_user_id())));

create policy "reward_approvals_parent_guardian_scope" on public."reward_approvals" for all to authenticated using ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."guardians" g where g."id" = "reward_approvals"."guardian_id" and g."user_id" = (select public.k12_current_app_user_id()))) with check ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."guardians" g where g."id" = "reward_approvals"."guardian_id" and g."user_id" = (select public.k12_current_app_user_id())));

alter table public."content_drafts" enable row level security;

create policy "content_drafts_platform_admin_all" on public."content_drafts" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "content_drafts_staff_operational_select" on public."content_drafts" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' or (select public.k12_current_app_role()) = 'school-admin' or (select public.k12_current_app_role()) = 'platform-admin');

alter table public."content_batch_reviews" enable row level security;

create policy "content_batch_reviews_platform_admin_all" on public."content_batch_reviews" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "content_batch_reviews_staff_operational_select" on public."content_batch_reviews" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' or (select public.k12_current_app_role()) = 'school-admin' or (select public.k12_current_app_role()) = 'platform-admin');

alter table public."visual_assets" enable row level security;

create policy "visual_assets_platform_admin_all" on public."visual_assets" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "visual_assets_staff_operational_select" on public."visual_assets" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' or (select public.k12_current_app_role()) = 'school-admin' or (select public.k12_current_app_role()) = 'platform-admin');

alter table public."ai_tutor_events" enable row level security;

create policy "ai_tutor_events_platform_admin_all" on public."ai_tutor_events" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "ai_tutor_events_student_select_own" on public."ai_tutor_events" for select to authenticated using ((select public.k12_current_app_role()) = 'student' and "student_id" = (select public.k12_current_app_student_id()));

create policy "ai_tutor_events_parent_select_household" on public."ai_tutor_events" for select to authenticated using ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."student_guardians" sg join public."guardians" g on g."id" = sg."guardian_id" where sg."student_id" = "ai_tutor_events"."student_id" and g."user_id" = (select public.k12_current_app_user_id())));

create policy "ai_tutor_events_teacher_select_assigned" on public."ai_tutor_events" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' and exists (select 1 from public."enrollments" e join public."classes" c on c."id" = e."class_id" join public."teachers" t on t."id" = c."teacher_id" where e."student_id" = "ai_tutor_events"."student_id" and t."user_id" = (select public.k12_current_app_user_id())));

create policy "ai_tutor_events_staff_operational_select" on public."ai_tutor_events" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' or (select public.k12_current_app_role()) = 'school-admin' or (select public.k12_current_app_role()) = 'platform-admin');

alter table public."agent_tool_calls" enable row level security;

create policy "agent_tool_calls_platform_admin_all" on public."agent_tool_calls" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "agent_tool_calls_staff_operational_select" on public."agent_tool_calls" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' or (select public.k12_current_app_role()) = 'school-admin' or (select public.k12_current_app_role()) = 'platform-admin');

alter table public."research_evidence_sources" enable row level security;

create policy "research_evidence_sources_platform_admin_all" on public."research_evidence_sources" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "research_evidence_sources_staff_operational_select" on public."research_evidence_sources" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' or (select public.k12_current_app_role()) = 'school-admin' or (select public.k12_current_app_role()) = 'platform-admin');

alter table public."lesson_redesign_tasks" enable row level security;

create policy "lesson_redesign_tasks_platform_admin_all" on public."lesson_redesign_tasks" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "lesson_redesign_tasks_staff_operational_select" on public."lesson_redesign_tasks" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' or (select public.k12_current_app_role()) = 'school-admin' or (select public.k12_current_app_role()) = 'platform-admin');

alter table public."agent_review_items" enable row level security;

create policy "agent_review_items_platform_admin_all" on public."agent_review_items" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "agent_review_items_staff_operational_select" on public."agent_review_items" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' or (select public.k12_current_app_role()) = 'school-admin' or (select public.k12_current_app_role()) = 'platform-admin');

alter table public."audit_events" enable row level security;

create policy "audit_events_platform_admin_all" on public."audit_events" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "audit_events_staff_operational_select" on public."audit_events" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' or (select public.k12_current_app_role()) = 'school-admin' or (select public.k12_current_app_role()) = 'platform-admin');

alter table public."auth_audit_events" enable row level security;

create policy "auth_audit_events_platform_admin_all" on public."auth_audit_events" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "auth_audit_events_staff_operational_select" on public."auth_audit_events" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' or (select public.k12_current_app_role()) = 'school-admin' or (select public.k12_current_app_role()) = 'platform-admin');

alter table public."consent_records" enable row level security;

create policy "consent_records_platform_admin_all" on public."consent_records" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "consent_records_student_select_own" on public."consent_records" for select to authenticated using ((select public.k12_current_app_role()) = 'student' and "student_id" = (select public.k12_current_app_student_id()));

create policy "consent_records_parent_select_household" on public."consent_records" for select to authenticated using ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."student_guardians" sg join public."guardians" g on g."id" = sg."guardian_id" where sg."student_id" = "consent_records"."student_id" and g."user_id" = (select public.k12_current_app_user_id())));

create policy "consent_records_teacher_select_assigned" on public."consent_records" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' and exists (select 1 from public."enrollments" e join public."classes" c on c."id" = e."class_id" join public."teachers" t on t."id" = c."teacher_id" where e."student_id" = "consent_records"."student_id" and t."user_id" = (select public.k12_current_app_user_id())));

create policy "consent_records_parent_guardian_scope" on public."consent_records" for all to authenticated using ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."guardians" g where g."id" = "consent_records"."guardian_id" and g."user_id" = (select public.k12_current_app_user_id()))) with check ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."guardians" g where g."id" = "consent_records"."guardian_id" and g."user_id" = (select public.k12_current_app_user_id())));

alter table public."accommodations" enable row level security;

create policy "accommodations_platform_admin_all" on public."accommodations" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "accommodations_student_select_own" on public."accommodations" for select to authenticated using ((select public.k12_current_app_role()) = 'student' and "student_id" = (select public.k12_current_app_student_id()));

create policy "accommodations_parent_select_household" on public."accommodations" for select to authenticated using ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."student_guardians" sg join public."guardians" g on g."id" = sg."guardian_id" where sg."student_id" = "accommodations"."student_id" and g."user_id" = (select public.k12_current_app_user_id())));

create policy "accommodations_teacher_select_assigned" on public."accommodations" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' and exists (select 1 from public."enrollments" e join public."classes" c on c."id" = e."class_id" join public."teachers" t on t."id" = c."teacher_id" where e."student_id" = "accommodations"."student_id" and t."user_id" = (select public.k12_current_app_user_id())));

alter table public."retention_schedules" enable row level security;

create policy "retention_schedules_platform_admin_all" on public."retention_schedules" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "retention_schedules_student_select_own" on public."retention_schedules" for select to authenticated using ((select public.k12_current_app_role()) = 'student' and "student_id" = (select public.k12_current_app_student_id()));

create policy "retention_schedules_parent_select_household" on public."retention_schedules" for select to authenticated using ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."student_guardians" sg join public."guardians" g on g."id" = sg."guardian_id" where sg."student_id" = "retention_schedules"."student_id" and g."user_id" = (select public.k12_current_app_user_id())));

create policy "retention_schedules_teacher_select_assigned" on public."retention_schedules" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' and exists (select 1 from public."enrollments" e join public."classes" c on c."id" = e."class_id" join public."teachers" t on t."id" = c."teacher_id" where e."student_id" = "retention_schedules"."student_id" and t."user_id" = (select public.k12_current_app_user_id())));

alter table public."learning_events" enable row level security;

create policy "learning_events_platform_admin_all" on public."learning_events" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "learning_events_student_select_own" on public."learning_events" for select to authenticated using ((select public.k12_current_app_role()) = 'student' and "student_id" = (select public.k12_current_app_student_id()));

create policy "learning_events_parent_select_household" on public."learning_events" for select to authenticated using ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."student_guardians" sg join public."guardians" g on g."id" = sg."guardian_id" where sg."student_id" = "learning_events"."student_id" and g."user_id" = (select public.k12_current_app_user_id())));

create policy "learning_events_teacher_select_assigned" on public."learning_events" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' and exists (select 1 from public."enrollments" e join public."classes" c on c."id" = e."class_id" join public."teachers" t on t."id" = c."teacher_id" where e."student_id" = "learning_events"."student_id" and t."user_id" = (select public.k12_current_app_user_id())));

alter table public."experiment_runs" enable row level security;

create policy "experiment_runs_platform_admin_all" on public."experiment_runs" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "experiment_runs_student_select_own" on public."experiment_runs" for select to authenticated using ((select public.k12_current_app_role()) = 'student' and "student_id" = (select public.k12_current_app_student_id()));

create policy "experiment_runs_parent_select_household" on public."experiment_runs" for select to authenticated using ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."student_guardians" sg join public."guardians" g on g."id" = sg."guardian_id" where sg."student_id" = "experiment_runs"."student_id" and g."user_id" = (select public.k12_current_app_user_id())));

create policy "experiment_runs_teacher_select_assigned" on public."experiment_runs" for select to authenticated using ((select public.k12_current_app_role()) = 'teacher' and exists (select 1 from public."enrollments" e join public."classes" c on c."id" = e."class_id" join public."teachers" t on t."id" = c."teacher_id" where e."student_id" = "experiment_runs"."student_id" and t."user_id" = (select public.k12_current_app_user_id())));

alter table public."reward_settings" enable row level security;

create policy "reward_settings_platform_admin_all" on public."reward_settings" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "reward_settings_parent_guardian_scope" on public."reward_settings" for all to authenticated using ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."guardians" g where g."id" = "reward_settings"."guardian_id" and g."user_id" = (select public.k12_current_app_user_id()))) with check ((select public.k12_current_app_role()) = 'parent' and exists (select 1 from public."guardians" g where g."id" = "reward_settings"."guardian_id" and g."user_id" = (select public.k12_current_app_user_id())));

alter table public."app_state_snapshots" enable row level security;

create policy "app_state_snapshots_platform_admin_all" on public."app_state_snapshots" for all to authenticated using ((select public.k12_current_app_role()) = 'platform-admin') with check ((select public.k12_current_app_role()) = 'platform-admin');
