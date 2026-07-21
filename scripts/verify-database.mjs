import { spawn } from "node:child_process";
import { generatePostgresMigration, getMigrationReadiness } from "../src/migrations.js";
import { normalizedRepositoryTableIds } from "../src/repository.js";
import { productionDataModel } from "../src/schema.js";
import { loadEnvFile } from "../src/env.js";

loadEnvFile();
const dryRun = process.argv.includes("--dry-run");
const migration = generatePostgresMigration();
const readiness = getMigrationReadiness();
const expectedTables = productionDataModel.map((table) => table.id);
const protectedTables = productionDataModel.filter((table) => table.rls).map((table) => table.id);

function sqlString(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlArray(values) {
  return `array[${values.map(sqlString).join(", ")}]`;
}

function runPsql(sql) {
  const databaseUrl = process.env.DATABASE_URL;
  const psqlBin = process.env.PSQL_BIN || "psql";
  return new Promise((resolve, reject) => {
    if (!databaseUrl) {
      reject(new Error("DATABASE_URL is required. Set it to your staging PostgreSQL or Supabase connection string."));
      return;
    }

    const child = spawn(psqlBin, [databaseUrl, "--no-psqlrc", "-v", "ON_ERROR_STOP=1", "-t", "-A"], {
      env: process.env,
      stdio: ["pipe", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", reject);
    child.stdin.on("error", () => {
      // psql closes stdin early when authentication or network setup fails.
      // The process close handler returns the useful stderr message.
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(new Error(stderr.trim() || `psql exited with code ${code}`));
      }
    });
    child.stdin.end(sql);
  });
}

function verificationSql() {
  const expected = sqlArray(expectedTables);
  const protectedList = sqlArray(protectedTables);
  return `
    with expected(table_name) as (
      select unnest(${expected}::text[])
    ),
    protected(table_name) as (
      select unnest(${protectedList}::text[])
    )
    select jsonb_build_object(
      'expectedTables', (select count(*) from expected),
      'actualTables', (
        select count(*)
        from expected e
        join information_schema.tables t
          on t.table_schema = 'public'
         and t.table_name = e.table_name
      ),
      'missingTables', (
        select coalesce(jsonb_agg(e.table_name order by e.table_name), '[]'::jsonb)
        from expected e
        left join information_schema.tables t
          on t.table_schema = 'public'
         and t.table_name = e.table_name
        where t.table_name is null
      ),
      'rlsExpected', (select count(*) from protected),
      'rlsEnabled', (
        select count(*)
        from protected p
        join pg_class c on c.relname = p.table_name
        join pg_namespace n on n.oid = c.relnamespace and n.nspname = 'public'
        where c.relrowsecurity
      ),
      'policies', (
        select count(*)
        from pg_policies
        where schemaname = 'public'
          and tablename = any(${expected}::text[])
      ),
      'indexes', (
        select count(*)
        from pg_indexes
        where schemaname = 'public'
          and tablename = any(${expected}::text[])
      )
    )::text as result;
  `;
}

console.log(`migration=${migration.id}`);
console.log(`migrationReady=${readiness.passed}`);
console.log(`expectedTables=${expectedTables.length}`);
console.log(`normalizedReadTables=${normalizedRepositoryTableIds.length}`);
console.log(`rlsExpected=${protectedTables.length}`);
console.log(`databaseConfigured=${Boolean(process.env.DATABASE_URL)}`);

if (dryRun) {
  console.log("dryRun=true");
  console.log("next=npm run db:apply; npm run db:verify");
  process.exit(readiness.passed ? 0 : 1);
}

if (!readiness.passed) {
  console.error(`Migration readiness failed: ${readiness.missingSignals.join(", ") || "unknown readiness issue"}`);
  process.exit(1);
}

const raw = await runPsql(verificationSql());
const result = raw ? JSON.parse(raw) : {};
const missingTables = Array.isArray(result.missingTables) ? result.missingTables : [];
const ready =
  missingTables.length === 0 &&
  result.actualTables === result.expectedTables &&
  result.rlsEnabled === result.rlsExpected &&
  result.policies >= result.rlsExpected;

console.log(`actualTables=${result.actualTables}`);
console.log(`missingTables=${missingTables.join(",") || "none"}`);
console.log(`rlsEnabled=${result.rlsEnabled}`);
console.log(`policies=${result.policies}`);
console.log(`indexes=${result.indexes}`);
console.log(`ready=${ready}`);

if (!ready) process.exit(1);
