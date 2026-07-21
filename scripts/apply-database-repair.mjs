import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { loadEnvFile } from "../src/env.js";

loadEnvFile();

const repairId = String(process.argv[2] || "0002_normalized_learning_evidence").trim();
if (!/^[a-z0-9_\-]+$/i.test(repairId)) {
  throw new Error("Repair id may only contain letters, numbers, underscores, and hyphens.");
}

const repairPath = resolve("db", "repairs", `${repairId}.sql`);
const dryRun = process.argv.includes("--dry-run");

function sanitize(message = "") {
  let output = String(message || "");
  if (process.env.DATABASE_URL) output = output.replaceAll(process.env.DATABASE_URL, "<DATABASE_URL>");
  return output.replace(/(postgres(?:ql)?:\/\/[^:\s]+:)[^@\s]+@/gi, "$1***@");
}

function runPsql(sql) {
  const databaseUrl = String(process.env.DATABASE_URL || "").trim();
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required. Configure the Supabase database connection in .env.");
  }

  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(process.env.PSQL_BIN || "psql", [databaseUrl, "--no-psqlrc", "-v", "ON_ERROR_STOP=1"], {
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
    child.stdin.on("error", () => {});
    child.on("close", (code) => {
      if (code === 0) {
        resolveRun({ stdout, stderr });
        return;
      }
      const safeError = sanitize(stderr.trim() || `psql exited with code ${code}`);
      if (/password authentication failed|authentication failed/i.test(safeError)) {
        rejectRun(new Error("Supabase rejected the DATABASE_URL credentials. Reset the database password, update .env, and retry this command."));
        return;
      }
      rejectRun(new Error(safeError));
    });
    child.stdin.end(sql);
  });
}

const sql = await readFile(repairPath, "utf8");
console.log(`repair=${repairId}`);
console.log(`file=${repairPath}`);
console.log(`databaseConfigured=${Boolean(process.env.DATABASE_URL)}`);

if (dryRun) {
  console.log("dryRun=true");
  process.exit(0);
}

await runPsql(sql);
console.log("applied=true");
