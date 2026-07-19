import { loadEnvFile } from "../src/env.js";
import {
  createInitialState,
  getProductCompletenessAudit,
  getRuntimeConfigurationStatus,
  getStateDependencyAudit
} from "../src/engine.js";
import { getMigrationReadiness } from "../src/migrations.js";

loadEnvFile();

const strict = process.argv.includes("--strict");
const runtime = getRuntimeConfigurationStatus(process.env);
const product = getProductCompletenessAudit(createInitialState(), runtime);
const migration = getMigrationReadiness();
const dependencyAudit = getStateDependencyAudit();

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
    databaseProbe: "not-run",
    databaseMigration: migration.passed ? "sql-ready-but-not-live-verified" : "sql-not-ready",
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
  "Live database probe has not been run by readiness:audit.",
  ...(dependencyAudit.productionBlocker ? ["Legacy snapshot persistence remains a production blocker."] : [])
];

report.verdict = strict
  ? unresolved.length === 0 ? "pass" : "fail"
  : unresolved.length === 0 ? "configured-and-verified" : "not-ready";
report.unresolved = unresolved;

console.log(JSON.stringify(report, null, 2));

if (strict && unresolved.length > 0) process.exitCode = 1;
