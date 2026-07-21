import { getRepositoryAccessSummary } from "./accessControl.js";
import { productionDataModel, productionRoles, validateProductionSchema } from "./schema.js";

const jsonColumns = new Set([
  "answers",
  "blockers",
  "choices",
  "critical_blockers",
  "family_benefits",
  "group_homework",
  "helper_notes",
  "common_misunderstandings",
  "lesson_sections",
  "latest_review",
  "metadata",
  "payload",
  "prerequisite_skills",
  "quiz_questions",
  "generation_metadata",
  "review_checklist",
  "review_history",
  "revision_instructions",
  "role_labels",
  "selected_catalog_ids",
  "source_cards",
  "standards_tags",
  "standards_framework_ids",
  "steps",
  "subjects",
  "teaching_completeness_issues",
  "truth_issues",
  "provider_moderation",
  "provider_review",
  "provider_usage",
  "usage",
  "value",
  "visual_supports",
  "vocabulary_terms",
  "metrics"
]);
const booleanColumns = new Set([
  "ai_helper",
  "can_manage_consent",
  "correct",
  "data_collection",
  "enabled",
  "email_verified",
  "flagged",
  "household_setup_complete",
  "lesson_body_ready",
  "needs_external_research",
  "passed",
  "portfolio",
  "require_delayed_recall",
  "requires_group",
  "requires_human_review",
  "third_party_sharing"
]);
const integerHints = [
  "_count",
  "_minutes",
  "_score",
  "_target",
  "attempts",
  "current_mastery",
  "estimated_minutes",
  "frustration",
  "immediate_score",
  "interval_days",
  "joy",
  "lesson_target",
  "mastery_threshold",
  "recall_24h",
  "recall_7d",
  "recall_count",
  "reward_level",
  "score",
  "sort_order",
  "threshold",
  "target_lessons",
  "review_version"
];

function q(identifier) {
  return `"${identifier}"`;
}

function policyName(tableId, suffix) {
  return `${tableId}_${suffix}`.replace(/[^a-z0-9_]/gi, "_").toLowerCase();
}

function columnType(column) {
  if (column === "latest_review") return "jsonb not null default '{}'::jsonb";
  if (jsonColumns.has(column) || column.endsWith("_ids")) return "jsonb not null default '[]'::jsonb";
  if (booleanColumns.has(column)) return "boolean not null default false";
  if (column.endsWith("_at") || column === "created_at" || column === "updated_at" || column === "attempted_at") return "timestamptz";
  if (integerHints.some((hint) => column === hint || column.endsWith(hint))) return "integer";
  return "text";
}

function columnBaseType(column) {
  if (jsonColumns.has(column) || column.endsWith("_ids")) return "jsonb";
  if (booleanColumns.has(column)) return "boolean";
  if (column.endsWith("_at") || column === "created_at" || column === "updated_at" || column === "attempted_at") return "timestamptz";
  if (integerHints.some((hint) => column === hint || column.endsWith(hint))) return "integer";
  return "text";
}

function columnUdtName(column) {
  const baseType = columnBaseType(column);
  if (baseType === "boolean") return "bool";
  if (baseType === "integer") return "int4";
  return baseType;
}

function columnDefaultStatement(table, column) {
  if (column === "latest_review") {
    return `  alter table public.${q(table.id)} alter column ${q(column)} set default '{}'::jsonb;`;
  }
  if (jsonColumns.has(column) || column.endsWith("_ids")) {
    return `  alter table public.${q(table.id)} alter column ${q(column)} set default '[]'::jsonb;`;
  }
  if (booleanColumns.has(column)) {
    return `  alter table public.${q(table.id)} alter column ${q(column)} set default false;`;
  }
  return "";
}

function createTableStatement(table) {
  const columnLines = table.columns.map((column) => `  ${q(column)} ${columnType(column)}`);
  columnLines.push(`  primary key (${q(table.primaryKey)})`);

  return `create table if not exists public.${q(table.id)} (\n${columnLines.join(",\n")}\n);`;
}

function createMissingColumnStatements(table) {
  return table.columns.map((column) => `alter table public.${q(table.id)} add column if not exists ${q(column)} ${columnType(column)};`);
}

function createDropExistingPolicyStatements(table) {
  if (!table.rls) return [];
  return [
    [
      "do $$",
      "declare",
      "  existing_policy record;",
      "begin",
      "  for existing_policy in",
      "    select policyname",
      "    from pg_policies",
      "    where schemaname = 'public'",
      `      and tablename = '${table.id}'`,
      "  loop",
      `    execute format('drop policy if exists %I on public.%I', existing_policy.policyname, '${table.id}');`,
      "  end loop;",
      "end $$;"
    ].join("\n")
  ];
}

function createDropExistingForeignKeyStatements(table) {
  return [
    [
      "do $$",
      "declare",
      "  existing_constraint record;",
      "begin",
      "  for existing_constraint in",
      "    select conname",
      "    from pg_constraint",
      "    where contype = 'f'",
      `      and conrelid = to_regclass('public.${table.id}')`,
      "  loop",
      `    execute format('alter table public.%I drop constraint if exists %I', '${table.id}', existing_constraint.conname);`,
      "  end loop;",
      "end $$;"
    ].join("\n")
  ];
}

function createDropExistingCheckConstraintStatements(table) {
  return [
    [
      "do $$",
      "declare",
      "  existing_constraint record;",
      "  row_count bigint;",
      "begin",
      `  select count(*) into row_count from public.${q(table.id)};`,
      "  for existing_constraint in",
      "    select conname",
      "    from pg_constraint",
      "    where contype = 'c'",
      `      and conrelid = to_regclass('public.${table.id}')`,
      "  loop",
      "    if row_count = 0 then",
      `      execute format('alter table public.%I drop constraint if exists %I', '${table.id}', existing_constraint.conname);`,
      "    else",
      `      raise exception 'Legacy check constraint public.${table.id}.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', existing_constraint.conname, row_count;`,
      "    end if;",
      "  end loop;",
      "end $$;"
    ].join("\n")
  ];
}

function createDropExistingTriggerStatements(table) {
  return [
    [
      "do $$",
      "declare",
      "  existing_trigger record;",
      "begin",
      "  for existing_trigger in",
      "    select tgname",
      "    from pg_trigger",
      `    where tgrelid = to_regclass('public.${table.id}')`,
      "      and not tgisinternal",
      "  loop",
      `    execute format('drop trigger if exists %I on public.%I', existing_trigger.tgname, '${table.id}');`,
      "  end loop;",
      "end $$;"
    ].join("\n")
  ];
}

function createDropInboundForeignKeyStatements(table) {
  return [
    [
      "do $$",
      "declare",
      "  existing_constraint record;",
      "  child_rows bigint;",
      "begin",
      "  for existing_constraint in",
      "    select con.conname, child_ns.nspname as child_schema, child.relname as child_table",
      "    from pg_constraint con",
      "    join pg_class child on child.oid = con.conrelid",
      "    join pg_namespace child_ns on child_ns.oid = child.relnamespace",
      "    where con.contype = 'f'",
      "      and child_ns.nspname = 'public'",
      `      and con.confrelid = to_regclass('public.${table.id}')`,
      "  loop",
      "    execute format('select count(*) from %I.%I', existing_constraint.child_schema, existing_constraint.child_table) into child_rows;",
      "    if child_rows = 0 then",
      "      execute format('alter table %I.%I drop constraint if exists %I', existing_constraint.child_schema, existing_constraint.child_table, existing_constraint.conname);",
      "    else",
      `      raise exception 'Inbound foreign key %.% on public.${table.id} cannot be dropped automatically because the child table has % rows; repair manually before applying type fixes.', existing_constraint.child_table, existing_constraint.conname, child_rows;`,
      "    end if;",
      "  end loop;",
      "end $$;"
    ].join("\n")
  ];
}

function createDropLegacyColumnStatements(table) {
  const expectedColumns = table.columns.map((column) => `'${column.replaceAll("'", "''")}'`).join(", ");
  return [
    [
      "do $$",
      "declare",
      "  legacy_column record;",
      "  row_count bigint;",
      "begin",
      `  select count(*) into row_count from public.${q(table.id)};`,
      "  for legacy_column in",
      "    select column_name",
      "    from information_schema.columns",
      "    where table_schema = 'public'",
      `      and table_name = '${table.id}'`,
      `      and column_name not in (${expectedColumns})`,
      "  loop",
      "    if row_count = 0 then",
      `      execute format('alter table public.%I drop column if exists %I', '${table.id}', legacy_column.column_name);`,
      "    else",
      `      raise exception 'Legacy column public.${table.id}.% cannot be dropped automatically because the table has % rows; repair manually before applying seed data.', legacy_column.column_name, row_count;`,
      "    end if;",
      "  end loop;",
      "end $$;"
    ].join("\n")
  ];
}

function createColumnTypeRepairStatements(table) {
  return table.columns.map((column) => {
    const expectedType = columnBaseType(column);
    const expectedUdt = columnUdtName(column);
    const defaultStatement = columnDefaultStatement(table, column);
    return [
      "do $$",
      "declare",
      "  row_count bigint;",
      "  actual_type text;",
      "begin",
      "  select c.udt_name into actual_type",
      "  from information_schema.columns c",
      "  where c.table_schema = 'public'",
      `    and c.table_name = '${table.id}'`,
      `    and c.column_name = '${column}';`,
      "",
      `  if actual_type is not null and actual_type <> '${expectedUdt}' then`,
      `    select count(*) into row_count from public.${q(table.id)};`,
      "    if row_count = 0 then",
      `      alter table public.${q(table.id)} alter column ${q(column)} drop default;`,
      `      alter table public.${q(table.id)} alter column ${q(column)} type ${expectedType} using ${q(column)}::${expectedType};`,
      defaultStatement,
      "    else",
      `      raise exception 'Column public.${table.id}.${column} has type %, expected ${expectedUdt}, and table is not empty; repair manually before applying constraints.', actual_type;`,
      "    end if;",
      "  end if;",
      "end $$;"
    ].filter(Boolean).join("\n");
  });
}

function createForeignKeyStatements(table) {
  return (table.foreignKeys || []).map((relation) => {
    const [targetTable, targetColumn] = String(relation.references).split(".");
    const constraintName = `fk_${table.id}_${relation.column}`;
    return [
      "do $$ begin",
      `  alter table public.${q(table.id)} add constraint ${q(constraintName)} foreign key (${q(relation.column)}) references public.${q(targetTable)} (${q(targetColumn)});`,
      "exception when duplicate_object then null;",
      "end $$;"
    ].join("\n");
  });
}

function createIndexStatements(table) {
  const indexed = new Set([...(table.foreignKeys || []).map((relation) => relation.column)]);
  for (const column of ["student_id", "guardian_id", "teacher_id", "lesson_id", "course_id", "class_id", "role", "status", "created_at"]) {
    if (table.columns.includes(column)) indexed.add(column);
  }
  return [...indexed].map((column) => `create index if not exists ${q(`idx_${table.id}_${column}`)} on public.${q(table.id)} (${q(column)});`);
}

function createAuthHelperStatements() {
  return [
    `create or replace function public.k12_current_setting(setting_name text)
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
$$;`,
    `create or replace function public.k12_auth_jwt()
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
$$;`,
    `create or replace function public.k12_auth_uid_text()
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
$$;`,
    `create or replace function public.k12_app_claim(claim_name text, setting_name text)
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
$$;`,
    `create or replace function public.k12_current_app_role()
returns text
language sql
stable
as $$
  select public.k12_app_claim('role', 'role');
$$;`,
    `create or replace function public.k12_current_app_user_id()
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
$$;`,
    `create or replace function public.k12_current_app_student_id()
returns text
language sql
stable
as $$
  select coalesce(
    public.k12_app_claim('studentId', 'student_id'),
    public.k12_app_claim('student_id', 'student_id')
  );
$$;`,
    `create or replace function public.k12_current_app_guardian_id()
returns text
language sql
stable
as $$
  select coalesce(
    public.k12_app_claim('guardianId', 'guardian_id'),
    public.k12_app_claim('guardian_id', 'guardian_id')
  );
$$;`,
    `create or replace function public.k12_current_app_teacher_id()
returns text
language sql
stable
as $$
  select coalesce(
    public.k12_app_claim('teacherId', 'teacher_id'),
    public.k12_app_claim('teacher_id', 'teacher_id')
  );
$$;`
  ];
}

function roleExpression(role) {
  return `(select public.k12_current_app_role()) = '${role}'`;
}

function settingExpression(name) {
  const helperFunctions = {
    user_id: "k12_current_app_user_id",
    student_id: "k12_current_app_student_id",
    guardian_id: "k12_current_app_guardian_id",
    teacher_id: "k12_current_app_teacher_id"
  };
  const helper = helperFunctions[name];
  return helper ? `(select public.${helper}())` : `public.k12_current_setting('app.${name}')`;
}

function createStudentScopePolicies(table) {
  if (!table.columns.includes("student_id")) return [];
  return [
    `create policy ${q(policyName(table.id, "student_select_own"))} on public.${q(table.id)} for select to authenticated using (${roleExpression("student")} and ${q("student_id")} = ${settingExpression("student_id")});`,
    `create policy ${q(policyName(table.id, "parent_select_household"))} on public.${q(table.id)} for select to authenticated using (${roleExpression("parent")} and exists (select 1 from public.${q("student_guardians")} sg join public.${q("guardians")} g on g.${q("id")} = sg.${q("guardian_id")} where sg.${q("student_id")} = ${q(table.id)}.${q("student_id")} and g.${q("user_id")} = ${settingExpression("user_id")}));`,
    `create policy ${q(policyName(table.id, "teacher_select_assigned"))} on public.${q(table.id)} for select to authenticated using (${roleExpression("teacher")} and exists (select 1 from public.${q("enrollments")} e join public.${q("classes")} c on c.${q("id")} = e.${q("class_id")} join public.${q("teachers")} t on t.${q("id")} = c.${q("teacher_id")} where e.${q("student_id")} = ${q(table.id)}.${q("student_id")} and t.${q("user_id")} = ${settingExpression("user_id")}));`
  ];
}

function createGuardianScopePolicies(table) {
  if (!table.columns.includes("guardian_id")) return [];
  return [
    `create policy ${q(policyName(table.id, "parent_guardian_scope"))} on public.${q(table.id)} for all to authenticated using (${roleExpression("parent")} and exists (select 1 from public.${q("guardians")} g where g.${q("id")} = ${q(table.id)}.${q("guardian_id")} and g.${q("user_id")} = ${settingExpression("user_id")})) with check (${roleExpression("parent")} and exists (select 1 from public.${q("guardians")} g where g.${q("id")} = ${q(table.id)}.${q("guardian_id")} and g.${q("user_id")} = ${settingExpression("user_id")}));`
  ];
}

function createTeacherScopePolicies(table) {
  if (!table.columns.includes("teacher_id")) return [];
  return [
    `create policy ${q(policyName(table.id, "teacher_scope"))} on public.${q(table.id)} for all to authenticated using (${roleExpression("teacher")} and exists (select 1 from public.${q("teachers")} t where t.${q("id")} = ${q(table.id)}.${q("teacher_id")} and t.${q("user_id")} = ${settingExpression("user_id")})) with check (${roleExpression("teacher")} and exists (select 1 from public.${q("teachers")} t where t.${q("id")} = ${q(table.id)}.${q("teacher_id")} and t.${q("user_id")} = ${settingExpression("user_id")}));`
  ];
}

function createOperationalPolicies(table) {
  if (!["content_ops", "agent_ops", "ai_safety", "audit"].includes(table.area)) return [];
  const staffRoles = ["teacher", "school-admin", "platform-admin"];
  return [
    `create policy ${q(policyName(table.id, "staff_operational_select"))} on public.${q(table.id)} for select to authenticated using (${staffRoles
      .map(roleExpression)
      .join(" or ")});`
  ];
}

function createRlsStatements(table) {
  if (!table.rls) return [];
  const statements = [
    `alter table public.${q(table.id)} enable row level security;`,
    `create policy ${q(policyName(table.id, "platform_admin_all"))} on public.${q(table.id)} for all to authenticated using (${roleExpression(
      "platform-admin"
    )}) with check (${roleExpression("platform-admin")});`
  ];

  if (table.id === "users") {
    statements.push(
      `create policy ${q(policyName(table.id, "self_select"))} on public.${q(table.id)} for select to authenticated using (${q("id")} = ${settingExpression("user_id")});`
    );
  }
  if (table.id === "students") {
    statements.push(
      `create policy ${q(policyName(table.id, "student_self"))} on public.${q(table.id)} for select to authenticated using (${roleExpression("student")} and ${q("id")} = ${settingExpression("student_id")});`,
      `create policy ${q(policyName(table.id, "parent_household"))} on public.${q(table.id)} for select to authenticated using (${roleExpression("parent")} and exists (select 1 from public.${q("student_guardians")} sg join public.${q("guardians")} g on g.${q("id")} = sg.${q("guardian_id")} where sg.${q("student_id")} = ${q("students")}.${q("id")} and g.${q("user_id")} = ${settingExpression("user_id")}));`
    );
  }

  statements.push(...createStudentScopePolicies(table));
  statements.push(...createGuardianScopePolicies(table));
  statements.push(...createTeacherScopePolicies(table));
  statements.push(...createOperationalPolicies(table));
  return statements;
}

function createCommentStatements(table) {
  return [`comment on table public.${q(table.id)} is '${table.description.replaceAll("'", "''")}';`];
}

export function generatePostgresMigration() {
  const validation = validateProductionSchema();
  const statements = [
    "-- K-12 Learning Academies production schema foundation",
    "-- Generated from src/schema.js. Review before applying to production.",
    "create extension if not exists pgcrypto;"
  ];

  statements.push(...createAuthHelperStatements());
  for (const table of productionDataModel) statements.push(createTableStatement(table));
  for (const table of productionDataModel) statements.push(...createMissingColumnStatements(table));
  for (const table of productionDataModel) statements.push(...createDropExistingPolicyStatements(table));
  for (const table of productionDataModel) statements.push(...createDropExistingForeignKeyStatements(table));
  for (const table of productionDataModel) statements.push(...createDropExistingCheckConstraintStatements(table));
  for (const table of productionDataModel) statements.push(...createDropExistingTriggerStatements(table));
  for (const table of productionDataModel) statements.push(...createDropInboundForeignKeyStatements(table));
  for (const table of productionDataModel) statements.push(...createDropLegacyColumnStatements(table));
  for (const table of productionDataModel) statements.push(...createColumnTypeRepairStatements(table));
  for (const table of productionDataModel) statements.push(...createForeignKeyStatements(table));
  for (const table of productionDataModel) statements.push(...createIndexStatements(table));
  for (const table of productionDataModel) statements.push(...createCommentStatements(table));
  for (const table of productionDataModel) statements.push(...createRlsStatements(table));

  const sql = `${statements.join("\n\n")}\n`;
  const rlsPolicyCount = statements.filter((statement) => /^create policy /i.test(statement)).length;
  const indexCount = statements.filter((statement) => /^create index /i.test(statement)).length;

  return {
    id: "0001_k12_learning_foundation",
    sql,
    tableCount: productionDataModel.length,
    roleCount: productionRoles.length,
    statementCount: statements.length,
    rlsPolicyCount,
    indexCount,
    validation
  };
}

export function getMigrationReadiness() {
  const migration = generatePostgresMigration();
  const access = getRepositoryAccessSummary();
  const requiredSignals = [
    "create table if not exists public.\"users\"",
    "create table if not exists public.\"students\"",
    "create table if not exists public.\"lessons\"",
    "create table if not exists public.\"quiz_attempts\"",
    "create table if not exists public.\"app_state_snapshots\"",
    "alter table public.\"students\" enable row level security",
    "create policy \"students_parent_household\""
  ];
  const missingSignals = requiredSignals.filter((signal) => !migration.sql.includes(signal));

  return {
    passed:
      migration.validation.passed &&
      missingSignals.length === 0 &&
      migration.tableCount === productionDataModel.length &&
      migration.rlsPolicyCount >= productionDataModel.filter((table) => table.rls).length &&
      access.blockedStudentExternalOps,
    migrationId: migration.id,
    tableCount: migration.tableCount,
    roleCount: migration.roleCount,
    statementCount: migration.statementCount,
    rlsPolicyCount: migration.rlsPolicyCount,
    indexCount: migration.indexCount,
    missingSignals,
    accessSummary: {
      protectedTables: access.protectedTables,
      studentWritableTables: access.studentWritableTables,
      parentReadableProtectedTables: access.parentReadableProtectedTables,
      teacherWritableTables: access.teacherWritableTables,
      blockedStudentExternalOps: access.blockedStudentExternalOps
    }
  };
}
