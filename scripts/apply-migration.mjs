import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { generatePostgresMigration, getMigrationReadiness } from "../src/migrations.js";
import { loadEnvFile } from "../src/env.js";

loadEnvFile();
const dryRun = process.argv.includes("--dry-run");
const migration = generatePostgresMigration();
const readiness = getMigrationReadiness();
const migrationPath = resolve("db", "migrations", `${migration.id}.sql`);

async function loadSql() {
  try {
    return await readFile(migrationPath, "utf8");
  } catch {
    return migration.sql;
  }
}

function runPsql(sql) {
  const databaseUrl = process.env.DATABASE_URL;
  const psqlBin = process.env.PSQL_BIN || "psql";
  return new Promise((resolveRun, rejectRun) => {
    if (!databaseUrl) {
      rejectRun(new Error("DATABASE_URL is required. Set it to your PostgreSQL or Supabase connection string."));
      return;
    }

    const child = spawn(psqlBin, [databaseUrl, "--no-psqlrc", "-v", "ON_ERROR_STOP=1"], {
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
    child.on("error", rejectRun);
    child.stdin.on("error", () => {
      // psql closes stdin early when authentication or network setup fails.
      // The process close handler returns the useful stderr message.
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolveRun({ stdout, stderr });
      } else {
        rejectRun(new Error(stderr.trim() || `psql exited with code ${code}`));
      }
    });
    child.stdin.end(sql);
  });
}

console.log(`migration=${migration.id}`);
console.log(`file=${migrationPath}`);
console.log(`tables=${migration.tableCount}`);
console.log(`statements=${migration.statementCount}`);
console.log(`rlsPolicies=${migration.rlsPolicyCount}`);
console.log(`indexes=${migration.indexCount}`);
console.log(`ready=${readiness.passed}`);

if (!readiness.passed) {
  console.error(`Migration readiness failed: ${readiness.missingSignals.join(", ") || "unknown readiness issue"}`);
  process.exit(1);
}

const sql = await loadSql();

if (dryRun) {
  console.log("dryRun=true");
  console.log(`databaseConfigured=${Boolean(process.env.DATABASE_URL)}`);
  process.exit(0);
}

const result = await runPsql(sql);
console.log("applied=true");
if (result.stderr.trim()) console.log(result.stderr.trim());
