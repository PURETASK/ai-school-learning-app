-- Repair the school/classroom tables added after the initial Supabase rollout.
-- Run after 0001 and 0002. This script is idempotent and inserts no demo data.

begin;

create table if not exists public."school_staff_memberships" (
  "id" text primary key,
  "school_id" text,
  "user_id" text,
  "role" text,
  "status" text,
  "invited_by_user_id" text,
  "created_at" timestamptz,
  "revoked_at" timestamptz
);

create table if not exists public."attendance_records" (
  "id" text primary key,
  "class_session_id" text,
  "student_id" text,
  "status" text,
  "checked_in_at" timestamptz,
  "recorded_by_user_id" text,
  "note" text,
  "created_at" timestamptz,
  "updated_at" timestamptz
);

do $$ begin
  alter table public."school_staff_memberships" add constraint "fk_school_staff_memberships_school_id" foreign key ("school_id") references public."schools" ("id");
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public."school_staff_memberships" add constraint "fk_school_staff_memberships_user_id" foreign key ("user_id") references public."users" ("id");
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public."school_staff_memberships" add constraint "fk_school_staff_memberships_invited_by_user_id" foreign key ("invited_by_user_id") references public."users" ("id");
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public."attendance_records" add constraint "fk_attendance_records_class_session_id" foreign key ("class_session_id") references public."class_sessions" ("id");
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public."attendance_records" add constraint "fk_attendance_records_student_id" foreign key ("student_id") references public."students" ("id");
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public."attendance_records" add constraint "fk_attendance_records_recorded_by_user_id" foreign key ("recorded_by_user_id") references public."users" ("id");
exception when duplicate_object then null; end $$;

create index if not exists "idx_school_staff_memberships_school_id" on public."school_staff_memberships" ("school_id");
create index if not exists "idx_school_staff_memberships_user_id" on public."school_staff_memberships" ("user_id");
create index if not exists "idx_school_staff_memberships_invited_by_user_id" on public."school_staff_memberships" ("invited_by_user_id");
create index if not exists "idx_school_staff_memberships_role" on public."school_staff_memberships" ("role");
create index if not exists "idx_school_staff_memberships_status" on public."school_staff_memberships" ("status");
create index if not exists "idx_school_staff_memberships_created_at" on public."school_staff_memberships" ("created_at");
create index if not exists "idx_attendance_records_class_session_id" on public."attendance_records" ("class_session_id");
create index if not exists "idx_attendance_records_student_id" on public."attendance_records" ("student_id");
create index if not exists "idx_attendance_records_recorded_by_user_id" on public."attendance_records" ("recorded_by_user_id");
create index if not exists "idx_attendance_records_status" on public."attendance_records" ("status");
create index if not exists "idx_attendance_records_created_at" on public."attendance_records" ("created_at");

alter table public."school_staff_memberships" enable row level security;
alter table public."attendance_records" enable row level security;

drop policy if exists "school_staff_memberships_platform_admin_all" on public."school_staff_memberships";
drop policy if exists "school_staff_memberships_self_select" on public."school_staff_memberships";
create policy "school_staff_memberships_platform_admin_all" on public."school_staff_memberships"
  for all to authenticated
  using ((select public.k12_current_app_role()) = 'platform-admin')
  with check ((select public.k12_current_app_role()) = 'platform-admin');
create policy "school_staff_memberships_self_select" on public."school_staff_memberships"
  for select to authenticated
  using ("user_id" = (select public.k12_current_app_user_id()));

drop policy if exists "attendance_records_platform_admin_all" on public."attendance_records";
drop policy if exists "attendance_records_student_select_own" on public."attendance_records";
drop policy if exists "attendance_records_parent_select_household" on public."attendance_records";
drop policy if exists "attendance_records_teacher_select_assigned" on public."attendance_records";
drop policy if exists "attendance_records_school_admin_select_school" on public."attendance_records";
create policy "attendance_records_platform_admin_all" on public."attendance_records"
  for all to authenticated
  using ((select public.k12_current_app_role()) = 'platform-admin')
  with check ((select public.k12_current_app_role()) = 'platform-admin');
create policy "attendance_records_student_select_own" on public."attendance_records"
  for select to authenticated
  using ((select public.k12_current_app_role()) = 'student' and "student_id" = (select public.k12_current_app_student_id()));
create policy "attendance_records_parent_select_household" on public."attendance_records"
  for select to authenticated
  using (
    (select public.k12_current_app_role()) = 'parent'
    and exists (
      select 1 from public."guardian_student_links" gsl
      join public."guardians" g on g."id" = gsl."guardian_id"
      where gsl."student_id" = "attendance_records"."student_id"
        and gsl."status" = 'approved'
        and gsl."revoked_at" is null
        and g."user_id" = (select public.k12_current_app_user_id())
    )
  );
create policy "attendance_records_teacher_select_assigned" on public."attendance_records"
  for select to authenticated
  using (
    (select public.k12_current_app_role()) = 'teacher'
    and exists (
      select 1 from public."enrollments" e
      join public."teacher_class_assignments" tca on tca."class_id" = e."class_id"
      join public."teachers" t on t."id" = tca."teacher_id"
      where e."student_id" = "attendance_records"."student_id"
        and e."status" = 'active'
        and tca."status" = 'active'
        and tca."revoked_at" is null
        and t."user_id" = (select public.k12_current_app_user_id())
    )
  );
create policy "attendance_records_school_admin_select_school" on public."attendance_records"
  for select to authenticated
  using (
    (select public.k12_current_app_role()) = 'school-admin'
    and exists (
      select 1 from public."enrollments" e
      join public."classes" c on c."id" = e."class_id"
      join public."school_staff_memberships" ssm on ssm."school_id" = c."school_id"
      where e."student_id" = "attendance_records"."student_id"
        and e."status" = 'active'
        and ssm."user_id" = (select public.k12_current_app_user_id())
        and ssm."school_id" = (select public.k12_current_app_school_id())
        and ssm."role" = 'school-admin'
        and ssm."status" = 'active'
        and ssm."revoked_at" is null
    )
  );

grant select, insert, update, delete on table public."school_staff_memberships" to authenticated;
grant select, insert, update, delete on table public."attendance_records" to authenticated;

commit;
