import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createInitialState, normalizeAppState } from "../src/engine.js";
import { createNormalizedStateUpsertSql } from "../src/repository.js";
import { createProductionSeedProjection, productionDataModel } from "../src/schema.js";
import { loadEnvFile } from "../src/env.js";

loadEnvFile();

const dryRun = process.argv.includes("--dry-run");
const seedPath = resolve("db", "seeds", "0001_k12_learning_seed.sql");
const seedState = normalizeAppState(createInitialState());
const seed = createNormalizedStateUpsertSql(seedState);

async function loadSql() {
  try {
    return await readFile(seedPath, "utf8");
  } catch {
    return [
      "-- K-12 Learning Academies normalized seed data",
      "-- Generated from createInitialState() and src/schema.js.",
      "-- Review before applying outside local development.",
      seed.sql
    ].join("\n");
  }
}

function runPsql(sql) {
  const databaseUrl = process.env.DATABASE_URL;
  const psqlBin = process.env.PSQL_BIN || "psql";
  const timeoutMs = Number(process.env.PSQL_TIMEOUT_MS || 120000);
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required. Set it to your PostgreSQL or Supabase connection string.");
  }

  const result = spawnSync(psqlBin, [databaseUrl, "--no-psqlrc", "-v", "ON_ERROR_STOP=1"], {
    env: process.env,
    input: sql,
    encoding: "utf8",
    timeout: timeoutMs,
    windowsHide: true
  });
  if (result.error) {
    throw result.error.code === "ETIMEDOUT" ? new Error(`psql timed out after ${timeoutMs}ms`) : result.error;
  }
  if (result.status !== 0) {
    throw new Error((result.stderr || "").trim() || `psql exited with code ${result.status}`);
  }
  return { stdout: result.stdout || "", stderr: result.stderr || "" };
}

function runPsqlCsv(sql) {
  const databaseUrl = process.env.DATABASE_URL;
  const psqlBin = process.env.PSQL_BIN || "psql";
  const timeoutMs = Number(process.env.PSQL_TIMEOUT_MS || 120000);
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required. Set it to your PostgreSQL or Supabase connection string.");
  }

  const result = spawnSync(psqlBin, [databaseUrl, "--no-psqlrc", "-v", "ON_ERROR_STOP=1", "-A", "-F", ",", "-t"], {
    env: process.env,
    input: sql,
    encoding: "utf8",
    timeout: timeoutMs,
    windowsHide: true
  });
  if (result.error) {
    throw result.error.code === "ETIMEDOUT" ? new Error(`psql timed out after ${timeoutMs}ms`) : result.error;
  }
  if (result.status !== 0) {
    throw new Error((result.stderr || "").trim() || `psql exited with code ${result.status}`);
  }
  return { stdout: result.stdout || "", stderr: result.stderr || "" };
}

function seedStatements(sql) {
  const withoutComments = sql
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");
  return withoutComments
    .split(/;\s*(?:\r?\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean)
    .map((statement) => `${statement};`);
}

function sqlString(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function expectedRowsExist(tableId) {
  const table = productionDataModel.find((item) => item.id === tableId);
  const rows = createProductionSeedProjection(seedState).tables[tableId] || [];
  const ids = [...new Set(rows.map((row) => row?.[table?.primaryKey]).filter(Boolean))];
  if (!table || !ids.length) return false;
  const sql = [
    "select count(*)::int as seeded_count",
    `from public."${table.id}"`,
    `where "${table.primaryKey}" in (${ids.map(sqlString).join(", ")});`
  ].join("\n");
  const result = runPsql(sql);
  const match = result.stdout.match(/\n\s*(\d+)\s*\n/);
  return Number(match?.[1] || 0) === ids.length;
}

function allExpectedRowsExist() {
  const projection = createProductionSeedProjection(seedState);
  const checks = seed.tableIds
    .map((tableId) => {
      const table = productionDataModel.find((item) => item.id === tableId);
      const rows = projection.tables[tableId] || [];
      const expectedCount = rows.length;
      if (!table || !expectedCount) return null;
      return [
        `select ${sqlString(tableId)} as table_id,`,
        `${expectedCount}::int as expected_count,`,
        `(select count(*)::int from public."${table.id}") as actual_count`
      ].join(" ");
    })
    .filter(Boolean);
  if (!checks.length) return false;
  try {
    const result = runPsqlCsv(checks.join("\nunion all\n"));
    const rows = result.stdout
      .trim()
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const [tableId, expected, actual] = line.split(",");
        return { tableId, expected: Number(expected), actual: Number(actual) };
      });
    return rows.length === checks.length && rows.every((row) => row.actual >= row.expected);
  } catch {
    return false;
  }
}

function groupStatements(statements) {
  const grouped = new Map();
  for (const statement of statements) {
    const match = statement.match(/insert into public\."([^"]+)"/);
    const tableId = match?.[1] || "misc";
    if (!grouped.has(tableId)) grouped.set(tableId, []);
    grouped.get(tableId).push(statement);
  }
  return grouped;
}

function applySeed(sql) {
  const statements = seedStatements(sql);
  if (process.env.SEED_FORCE_UPSERT !== "true" && allExpectedRowsExist()) {
    console.log("seedAlreadyApplied=true");
    return 0;
  }

  try {
    runPsql(statements.join("\n\n"));
    return statements.length;
  } catch (bulkError) {
    console.warn("bulkSeedFailed=true");
    console.warn(String(bulkError.message || bulkError).split(/\r?\n/).slice(0, 4).join("\n"));
  }

  let applied = 0;
  for (const [tableId, tableStatements] of groupStatements(statements).entries()) {
    try {
      runPsql(tableStatements.join("\n\n"));
      applied += tableStatements.length;
      continue;
    } catch {
      if (expectedRowsExist(tableId)) {
        console.warn(`seedTableAlreadyPresent=${tableId}`);
        applied += tableStatements.length;
        continue;
      }
    }

    for (const [index, statement] of tableStatements.entries()) {
      try {
        runPsql(statement);
        applied += 1;
      } catch (statementError) {
        if (expectedRowsExist(tableId)) {
          console.warn(`seedTableAlreadyPresent=${tableId}`);
          applied += 1;
          continue;
        }
        const firstLine = statement.split(/\r?\n/).find((line) => line.trim() && !line.trim().startsWith("--")) || "unknown statement";
        throw new Error(`Seed table ${tableId} statement ${index + 1}/${tableStatements.length} failed near: ${firstLine}\n${statementError.message}`);
      }
    }
  }
  return applied;
}

console.log(`file=${seedPath}`);
console.log(`tables=${seed.tableIds.length}`);
console.log(`requiredTablesWithRows=${seed.projectionSummary.requiredTablesWithRows}`);
console.log(`contentDrafts=${seed.rowCounts.content_drafts || 0}`);
console.log(`quizAttempts=${seed.rowCounts.quiz_attempts || 0}`);
console.log(`reviewItems=${seed.rowCounts.agent_review_items || 0}`);

if (dryRun) {
  console.log("dryRun=true");
  console.log(`databaseConfigured=${Boolean(process.env.DATABASE_URL)}`);
  process.exit(0);
}

const sql = await loadSql();
const statementCount = applySeed(sql);
console.log("seedApplied=true");
console.log(`statements=${statementCount}`);
