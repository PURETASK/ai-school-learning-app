import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { loadEnvFile } from "../src/env.js";
import {
  createInitialState,
  getProductCompletenessAudit,
  getRuntimeConfigurationStatus,
  getStateDependencyAudit
} from "../src/engine.js";
import { getMigrationReadiness } from "../src/migrations.js";

loadEnvFile();

function runSupabaseProbe() {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [fileURLToPath(new URL("./check-supabase-connection.mjs", import.meta.url))], {
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk.toString("utf8"); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString("utf8"); });
    child.on("error", (error) => resolve({ ok: false, status: "failed", error: error.message, raw: null }));
    child.on("close", (code) => {
      try {
        const summary = JSON.parse(stdout);
        resolve({
          ok: code === 0 && Boolean(summary.supabaseRestQuerySucceeded || summary.psqlQuerySucceeded),
          status: code === 0 ? "passed" : "failed",
          error: code === 0 ? "" : (summary.next || stderr.trim() || "Live database probe failed."),
          raw: summary
        });
      } catch {
        resolve({ ok: false, status: "failed", error: stderr.trim() || "Live database probe returned invalid output.", raw: null });
      }
    });
  });
}

const strict = process.argv.includes("--strict");
const runtime = getRuntimeConfigurationStatus(process.env);
const product = getProductCompletenessAudit(createInitialState(), runtime);
const migration = getMigrationReadiness();
const dependencyAudit = getStateDependencyAudit();
const databaseProbe = await runSupabaseProbe();

const report = {
  generatedAt: new Date().toISOString(),
  environment: String(process.env.NODE_ENV || "development"),
  runtime: {
    readyByConfiguration: runtime.ready,
    productionMode: runtime.productionMode,
    repositoryMode: runtime.repositoryMode,
    databaseConnectionConfigured: runtime.databaseConnectionConfigured,
    authProviderConfigured: runtime.authProviderConfigured,
    authClaimsConfigurationReady: Boolean(runtime.authReadiness?.passed),
    authLiveVerified: runtime.authLiveVerified === true,
    openAiImagesConfigured: Boolean(runtime.openAiImage?.ready),
    openAiTutorConfigured: Boolean(runtime.openAiTutor?.ready),
    visualStorageConfigured: Boolean(runtime.visualAssetStorage?.ready),
    blockers: runtime.blockers,
    warnings: runtime.warnings
  },
  liveVerification: {
    databaseProbe: {
      status: databaseProbe.status,
      ok: databaseProbe.ok,
      error: databaseProbe.error,
      repositoryMode: databaseProbe.raw?.repositoryMode || runtime.repositoryMode,
      missingTables: databaseProbe.raw?.supabaseRestMissingTables || []
    },
    databaseMigration: databaseProbe.ok
      ? migration.passed ? "sql-ready-and-live-verified" : "sql-not-ready"
      : migration.passed ? "sql-ready-but-live-verification-failed" : "sql-not-ready",
    command: "npm run supabase:check",
    strictCommands: ["npm run db:verify", "npm run content:gate", "npm test"]
  },
  product: {
    percent: product.percent,
    readyForSale: product.readyForSale,
    categories: product.categories.map((category) => ({
      id: category.id,
      status: category.status,
      title: category.title,
      nextStep: category.nextStep
    }))
  },
  persistence: {
    focusedReads: dependencyAudit.summary.focusedReadRoutes,
    focusedWrites: dependencyAudit.summary.focusedWriteRoutes,
    legacySnapshotRoutes: dependencyAudit.summary.legacySnapshotRoutes,
    migrationCoveragePercent: dependencyAudit.summary.migrationCoveragePercent,
    productionBlocker: dependencyAudit.summary.productionBlocker
  }
};

const unresolved = [
  ...runtime.blockers,
  ...(databaseProbe.ok ? [] : [`Live database probe failed: ${databaseProbe.error || "database is not reachable or normalized tables are incomplete."}`]),
  ...(dependencyAudit.productionBlocker ? ["Legacy snapshot persistence remains a production blocker."] : [])
];

report.verdict = strict
  ? unresolved.length === 0 ? "pass" : "fail"
  : unresolved.length === 0 ? "configured-and-verified" : "not-ready";
report.unresolved = unresolved;

console.log(JSON.stringify(report, null, 2));

if (strict && unresolved.length > 0) process.exitCode = 1;
