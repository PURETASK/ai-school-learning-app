-- V8 Persistence Schema (per docs/82_LOCAL_STORAGE_TO_DATABASE_MIGRATION_PLAN.md
-- and docs/56_ERD_AND_DATABASE_RELATIONSHIPS.md)
-- Phase 2 (auth + user scope) and Phase 3 (database tables), with RLS.

-- ============================================================
-- 1. Profiles: one row per authenticated user (guardian by default)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'guardian' check (role in ('guardian', 'student', 'admin')),
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create a profile when a user signs up (incl. anonymous sessions)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 2. Students: child profiles owned by a guardian
-- ============================================================
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  guardian_id uuid not null references auth.users (id) on delete cascade,
  display_name text not null default 'Student',
  academy_slug text not null default 'foundation-academy'
    check (academy_slug in ('foundation-academy', 'bridge-academy', 'scholar-academy')),
  grade_level int not null default 3 check (grade_level between 0 and 12),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists students_guardian_idx on public.students (guardian_id);

-- ============================================================
-- 3. Snapshot table: the V8 adapter target (whole LearningPersistenceState)
-- ============================================================
create table if not exists public.student_learning_state_snapshots (
  student_id uuid primary key references public.students (id) on delete cascade,
  schema_version int not null default 1,
  state jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 4. Normalized tables (doc 82 Phase 3) — populated incrementally
-- ============================================================
create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  lesson_id text not null,
  completed_section_keys text[] not null default '{}',
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (student_id, lesson_id)
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  lesson_id text not null,
  submitted_at timestamptz not null default now(),
  score numeric,
  mastery_band text,
  result jsonb not null
);
create index if not exists quiz_attempts_student_idx on public.quiz_attempts (student_id, lesson_id);

create table if not exists public.memory_vault_items (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  lesson_id text not null,
  item jsonb not null,
  due_at timestamptz,
  stage text,
  updated_at timestamptz not null default now()
);
create index if not exists memory_vault_items_student_idx on public.memory_vault_items (student_id, due_at);

create table if not exists public.memory_vault_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  summary jsonb not null,
  completed_at timestamptz not null default now()
);

create table if not exists public.mistake_journal_entries (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  entry jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.learning_planner_entries (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  entry jsonb not null,
  status text not null default 'assigned' check (status in ('assigned', 'in_progress', 'completed')),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_evidence_items (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  item jsonb not null,
  status text not null default 'prompted' check (status in ('prompted', 'drafted', 'submitted', 'reviewed')),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 5. Row Level Security (doc 82 Phase 5: never trust client-only filtering)
-- ============================================================
alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.student_learning_state_snapshots enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.memory_vault_items enable row level security;
alter table public.memory_vault_sessions enable row level security;
alter table public.mistake_journal_entries enable row level security;
alter table public.learning_planner_entries enable row level security;
alter table public.portfolio_evidence_items enable row level security;

-- Profiles: user can see/update own profile
create policy "own profile select" on public.profiles for select using (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

-- Students: guardian has full control of own students
create policy "guardian manage students" on public.students
  for all using (auth.uid() = guardian_id) with check (auth.uid() = guardian_id);

-- Helper predicate used by all per-student tables:
--   the row's student must belong to the calling guardian
create policy "guardian snapshot access" on public.student_learning_state_snapshots
  for all using (exists (select 1 from public.students s where s.id = student_id and s.guardian_id = auth.uid()))
  with check (exists (select 1 from public.students s where s.id = student_id and s.guardian_id = auth.uid()));

create policy "guardian lesson_progress access" on public.lesson_progress
  for all using (exists (select 1 from public.students s where s.id = student_id and s.guardian_id = auth.uid()))
  with check (exists (select 1 from public.students s where s.id = student_id and s.guardian_id = auth.uid()));

create policy "guardian quiz_attempts access" on public.quiz_attempts
  for all using (exists (select 1 from public.students s where s.id = student_id and s.guardian_id = auth.uid()))
  with check (exists (select 1 from public.students s where s.id = student_id and s.guardian_id = auth.uid()));

create policy "guardian memory_vault_items access" on public.memory_vault_items
  for all using (exists (select 1 from public.students s where s.id = student_id and s.guardian_id = auth.uid()))
  with check (exists (select 1 from public.students s where s.id = student_id and s.guardian_id = auth.uid()));

create policy "guardian memory_vault_sessions access" on public.memory_vault_sessions
  for all using (exists (select 1 from public.students s where s.id = student_id and s.guardian_id = auth.uid()))
  with check (exists (select 1 from public.students s where s.id = student_id and s.guardian_id = auth.uid()));

create policy "guardian mistake_journal access" on public.mistake_journal_entries
  for all using (exists (select 1 from public.students s where s.id = student_id and s.guardian_id = auth.uid()))
  with check (exists (select 1 from public.students s where s.id = student_id and s.guardian_id = auth.uid()));

create policy "guardian learning_planner access" on public.learning_planner_entries
  for all using (exists (select 1 from public.students s where s.id = student_id and s.guardian_id = auth.uid()))
  with check (exists (select 1 from public.students s where s.id = student_id and s.guardian_id = auth.uid()));

create policy "guardian portfolio access" on public.portfolio_evidence_items
  for all using (exists (select 1 from public.students s where s.id = student_id and s.guardian_id = auth.uid()))
  with check (exists (select 1 from public.students s where s.id = student_id and s.guardian_id = auth.uid()));

-- ============================================================
-- 6. updated_at maintenance
-- ============================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists snapshots_touch on public.student_learning_state_snapshots;
create trigger snapshots_touch before update on public.student_learning_state_snapshots
  for each row execute function public.touch_updated_at();

drop trigger if exists students_touch on public.students;
create trigger students_touch before update on public.students
  for each row execute function public.touch_updated_at();
