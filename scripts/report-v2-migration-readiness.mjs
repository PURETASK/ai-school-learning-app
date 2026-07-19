#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pilotLessons } from "../src/data.js";
import {
  getNexusV3ContractSummary,
  validateNexusLessonV3,
  validateNexusUnitV3
} from "../src/nexusV3.js";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultRoot = path.resolve(scriptDir, "..");

function walkJsonFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walkJsonFiles(fullPath);
    return entry.isFile() && entry.name.endsWith(".json") ? [fullPath] : [];
  });
}

function readJsonFiles(directory) {
  return walkJsonFiles(directory).map((file) => {
    try {
      return { file, value: JSON.parse(fs.readFileSync(file, "utf8")), error: "" };
    } catch (error) {
      return { file, value: null, error: error.message };
    }
  });
}

function sourceIncludes(root, relativePath, patterns) {
  const file = path.join(root, relativePath);
  if (!fs.existsSync(file)) return false;
  const source = fs.readFileSync(file, "utf8");
  return patterns.every((pattern) => source.includes(pattern));
}

function check(id, label, passed, detail, blocking = true) {
  return { id, label, passed: Boolean(passed), detail, blocking };
}

function validateNativePilot(lesson) {
  const result = validateNexusLessonV3(lesson, { requireNative: true });
  return {
    id: lesson.id,
    title: lesson.title,
    academy: lesson.academy,
    gradeLevel: lesson.gradeLevel,
    passed: result.passed,
    errors: result.errors,
    activePhases: lesson.activePhases || [],
    requiredMasteryProofs: lesson.requiredMasteryProofs || []
  };
}

export function buildMigrationReadinessReport({ root = defaultRoot } = {}) {
  const contentFiles = readJsonFiles(path.join(root, "content"));
  const seedFiles = readJsonFiles(path.join(root, "seed-lessons", "lessons", "json"));
  const nativeContentRoot = path.join(root, "content", "native-v3") + path.sep;
  const legacyContentFiles = contentFiles.filter((item) => !item.file.startsWith(nativeContentRoot));
  const nativePilots = pilotLessons.filter((lesson) => lesson.schemaVersion === "3");
  const adaptedPilots = pilotLessons.filter((lesson) => lesson.schemaVersion !== "3");
  const nativePilotResults = nativePilots.map(validateNativePilot);
  const contract = getNexusV3ContractSummary();
  const contentVersions = contentFiles.reduce((counts, item) => {
    const version = item.error ? "invalid-json" : String(item.value?.schemaVersion || "missing");
    counts[version] = (counts[version] || 0) + 1;
    return counts;
  }, {});

  const checks = [
    check(
      "v3-contracts",
      "V3 schemas and validators are present",
      contract.schemaVersion === "3" && contract.schemas.length >= 5,
      `${contract.schemas.length} V3 schemas are registered.`
    ),
    check(
      "native-v3-exemplars",
      "At least three native V3 exemplars validate",
      nativePilotResults.filter((item) => item.passed).length >= 3,
      `${nativePilotResults.filter((item) => item.passed).length}/${nativePilotResults.length} pilot records are native V3 and valid.`
    ),
    check(
      "v2-compatibility-adapter",
      "V2 lessons remain explicitly adapted",
      sourceIncludes(root, "src/nexusV3.js", ["schemaVersion: \"v2-adapted\"", "adaptedFrom: \"v2\""]),
      `${adaptedPilots.length} pilot records still require the V2 adapter.`
    ),
    check(
      "active-phase-rendering",
      "The player renders active phases in authored order",
      sourceIncludes(root, "src/app.js", ["getRenderableNexusPhaseModules", "activePhases.length", "renderNexusLessonPhaseSequence"]),
      "Student player references the V3 render model and active phase sequence."
    ),
    check(
      "empty-phase-omission",
      "Empty V3 phases are omitted",
      sourceIncludes(root, "src/nexusV3.js", ["filter((module) => module && nonEmptyString(module.studentAction))"]),
      "Renderable phase modules require a non-empty student action."
    ),
    check(
      "legacy-content-inventory",
      "On-disk legacy content is accounted for",
      legacyContentFiles.length > 0 && seedFiles.length === legacyContentFiles.length && Object.keys(contentVersions).every((version) => version !== "invalid-json"),
      `${legacyContentFiles.length} legacy content files and ${seedFiles.length} seed lesson files were inventoried; ${contentFiles.length - legacyContentFiles.length} native V3 files are tracked separately.`
    ),
    check(
      "native-content-files",
      "All on-disk content is native V3",
      contentFiles.length > 0 && contentFiles.every((item) => item.value?.schemaVersion === "3"),
      `${contentVersions["3"] || 0}/${contentFiles.length} on-disk content files currently declare schemaVersion 3.`
    ),
    check(
      "production-data-gate",
      "Runtime keeps production fail-closed until database mode is ready",
      sourceIncludes(root, "src/engine.js", ["Production runtime must use K12_REPOSITORY_MODE=postgres."])
        || sourceIncludes(root, "scripts/serve.mjs", ["K12_REPOSITORY_MODE=postgres"]),
      "Production mode must not silently use JSON fallback."
    )
  ];

  const blockers = checks.filter((item) => item.blocking && !item.passed);
  return {
    generatedAt: new Date().toISOString(),
    root,
    status: blockers.length === 0 ? "ready" : "migration-required",
    passed: blockers.length === 0,
    summary: {
      pilotLessons: pilotLessons.length,
      nativeV3Pilots: nativePilots.length,
      validNativeV3Pilots: nativePilotResults.filter((item) => item.passed).length,
      adaptedPilots: adaptedPilots.length,
      contentFiles: contentFiles.length,
      seedLessonFiles: seedFiles.length,
      contentVersions
    },
    checks,
    nativePilotResults,
    nextActions: blockers.map((item) => item.label),
    releaseRule: "Do not expand student-facing content production until the V3 exemplars, adapter/player checks, review gate, and on-disk content migration are verified."
  };
}

function main() {
  const report = buildMigrationReadinessReport();
  const reportPath = path.join(defaultRoot, "reports", "v2-migration-readiness.json");
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`V2/V3 migration readiness: ${report.status}`);
  console.log(`Native V3 pilots: ${report.summary.validNativeV3Pilots}/${report.summary.pilotLessons}`);
  console.log(`On-disk V3 content: ${report.summary.contentVersions["3"] || 0}/${report.summary.contentFiles}`);
  if (report.nextActions.length) {
    console.log("Next actions:");
    for (const action of report.nextActions) console.log(`- ${action}`);
  }
  console.log(`Report written to ${path.relative(defaultRoot, reportPath)}`);
  if (process.argv.includes("--strict") && !report.passed) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
