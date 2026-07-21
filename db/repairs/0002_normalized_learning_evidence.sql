-- Repair for environments where migration 0001 created the normalized schema
-- but the two learner-evidence tables were not created. Run after 0001.
-- This script is idempotent and intentionally does not insert demo data.

begin;

create table if not exists public."lesson_scratchpads" (
  "id" text primary key,
  "student_id" text,
  "lesson_id" text,
  "first_step" text,
  "explanation" text,
  "confusion" text,
  "retry_after_hint" text,
  "recall_response" text,
  "transfer_response" text,
  "tutor_review_count" integer,
  "updated_at" timestamptz
);

create table if not exists public."interactive_skill_evidence" (
  "id" text primary key,
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
  "updated_at" timestamptz
);

create index if not exists "idx_lesson_scratchpads_student_id" on public."lesson_scratchpads" ("student_id");
create index if not exists "idx_lesson_scratchpads_lesson_id" on public."lesson_scratchpads" ("lesson_id");
create index if not exists "idx_interactive_skill_evidence_student_id" on public."interactive_skill_evidence" ("student_id");
create index if not exists "idx_interactive_skill_evidence_lesson_id" on public."interactive_skill_evidence" ("lesson_id");
create index if not exists "idx_interactive_skill_evidence_status" on public."interactive_skill_evidence" ("status");

alter table public."lesson_scratchpads" enable row level security;
alter table public."interactive_skill_evidence" enable row level security;

drop policy if exists "lesson_scratchpads_platform_admin_all" on public."lesson_scratchpads";
drop policy if exists "lesson_scratchpads_student_select_own" on public."lesson_scratchpads";
drop policy if exists "lesson_scratchpads_parent_select_household" on public."lesson_scratchpads";
drop policy if exists "lesson_scratchpads_teacher_select_assigned" on public."lesson_scratchpads";

create policy "lesson_scratchpads_platform_admin_all" on public."lesson_scratchpads"
  for all to authenticated
  using ((select public.k12_current_app_role()) = 'platform-admin')
  with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "lesson_scratchpads_student_select_own" on public."lesson_scratchpads"
  for select to authenticated
  using ((select public.k12_current_app_role()) = 'student' and "student_id" = (select public.k12_current_app_student_id()));

create policy "lesson_scratchpads_parent_select_household" on public."lesson_scratchpads"
  for select to authenticated
  using (
    (select public.k12_current_app_role()) = 'parent'
    and exists (
      select 1
      from public."student_guardians" sg
      join public."guardians" g on g."id" = sg."guardian_id"
      where sg."student_id" = "lesson_scratchpads"."student_id"
        and g."user_id" = (select public.k12_current_app_user_id())
    )
  );

create policy "lesson_scratchpads_teacher_select_assigned" on public."lesson_scratchpads"
  for select to authenticated
  using (
    (select public.k12_current_app_role()) = 'teacher'
    and exists (
      select 1
      from public."enrollments" e
      join public."classes" c on c."id" = e."class_id"
      join public."teachers" t on t."id" = c."teacher_id"
      where e."student_id" = "lesson_scratchpads"."student_id"
        and t."user_id" = (select public.k12_current_app_user_id())
    )
  );

drop policy if exists "interactive_skill_evidence_platform_admin_all" on public."interactive_skill_evidence";
drop policy if exists "interactive_skill_evidence_student_select_own" on public."interactive_skill_evidence";
drop policy if exists "interactive_skill_evidence_parent_select_household" on public."interactive_skill_evidence";
drop policy if exists "interactive_skill_evidence_teacher_select_assigned" on public."interactive_skill_evidence";

create policy "interactive_skill_evidence_platform_admin_all" on public."interactive_skill_evidence"
  for all to authenticated
  using ((select public.k12_current_app_role()) = 'platform-admin')
  with check ((select public.k12_current_app_role()) = 'platform-admin');

create policy "interactive_skill_evidence_student_select_own" on public."interactive_skill_evidence"
  for select to authenticated
  using ((select public.k12_current_app_role()) = 'student' and "student_id" = (select public.k12_current_app_student_id()));

create policy "interactive_skill_evidence_parent_select_household" on public."interactive_skill_evidence"
  for select to authenticated
  using (
    (select public.k12_current_app_role()) = 'parent'
    and exists (
      select 1
      from public."student_guardians" sg
      join public."guardians" g on g."id" = sg."guardian_id"
      where sg."student_id" = "interactive_skill_evidence"."student_id"
        and g."user_id" = (select public.k12_current_app_user_id())
    )
  );

create policy "interactive_skill_evidence_teacher_select_assigned" on public."interactive_skill_evidence"
  for select to authenticated
  using (
    (select public.k12_current_app_role()) = 'teacher'
    and exists (
      select 1
      from public."enrollments" e
      join public."classes" c on c."id" = e."class_id"
      join public."teachers" t on t."id" = c."teacher_id"
      where e."student_id" = "interactive_skill_evidence"."student_id"
        and t."user_id" = (select public.k12_current_app_user_id())
    )
  );

commit;
