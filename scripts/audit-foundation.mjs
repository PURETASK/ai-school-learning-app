#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const checks = [];
function exists(file) { return fs.existsSync(path.join(root, file)); }
function read(file) { return exists(file) ? fs.readFileSync(path.join(root, file), "utf8") : ""; }
function add(category, check, status, detail) { checks.push({ category, check, status, detail }); }

for (const file of [
  "AGENTS.md",
  "PROJECT_SOURCE_OF_TRUTH.md",
  "MVP_VERTICAL_SLICE_SPEC.md",
  "docs/15_MVP_SCOPE.md",
  "docs/55_MVP_BACKLOG_AND_TASK_BREAKDOWN.md",
  "docs/mvp-vertical-slice/10_ACCEPTANCE_TESTS.md",
]) add("docs", file, exists(file) ? "pass" : "fail", exists(file) ? "present" : "missing");

const source = read("PROJECT_SOURCE_OF_TRUTH.md");
for (const term of ["Foundation Academy", "Bridge Academy", "Scholar Academy", "Teach → Break Down", "Memory Vault", "Needs Intervention"]) {
  add("source-of-truth", term, source.includes(term) ? "pass" : "fail", source.includes(term) ? "found" : "missing");
}

const lessonPlayer = read("src/features/lessons/LessonPlayer.tsx");
const sectionCount = [...lessonPlayer.matchAll(/label: \"([^\"]+)\"/g)].length;
add("lesson-player", "16 official sections", sectionCount === 16 ? "pass" : "fail", `found ${sectionCount}`);

const memoryVaultEngine = read("src/features/memory-vault/memoryVaultEngine.ts");
for (const fn of ["gradeMemoryVaultAnswer", "applyMemoryVaultReviewSession", "getReviewableMemoryVaultItems", "updateRetentionStrength"]) {
  add("memory-vault", fn, memoryVaultEngine.includes(fn) ? "pass" : "fail", memoryVaultEngine.includes(fn) ? "implemented" : "missing");
}
add("memory-vault", "review-session UI", read("src/features/memory-vault/components/MemoryVaultReviewSession.tsx").includes("Memory Vault Review Session") ? "pass" : "fail", exists("src/features/memory-vault/components/MemoryVaultReviewSession.tsx") ? "present" : "missing");

const verticalSlice = read("src/features/vertical-slice/MvpLearningLoop.tsx");
add("vertical-slice", "memory-vault screen", verticalSlice.includes('"memory-vault"') ? "pass" : "fail", verticalSlice.includes('"memory-vault"') ? "wired" : "missing");
add("vertical-slice", "thinking-systems screen", verticalSlice.includes('"thinking-systems"') ? "pass" : "fail", verticalSlice.includes('"thinking-systems"') ? "wired" : "missing");
add("vertical-slice", "review session summaries", verticalSlice.includes("memoryVaultSessionSummaries") ? "pass" : "fail", verticalSlice.includes("memoryVaultSessionSummaries") ? "tracked" : "missing");

const contentFiles = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith(".json")) contentFiles.push(full);
  }
}
walk(path.join(root, "content"));
add("content", "16 seed lessons", contentFiles.length === 16 ? "pass" : "fail", `found ${contentFiles.length}`);

const lessons = contentFiles.map((file) => JSON.parse(fs.readFileSync(file, "utf8")));
const schedulesOk = lessons.every((lesson) => lesson.memoryVaultItems?.every((item) => JSON.stringify(item.scheduleDays) === JSON.stringify([1,3,7,14,30])));
add("memory-vault", "canonical schedule", schedulesOk ? "pass" : "fail", schedulesOk ? "all Memory Vault schedules match" : "one or more schedules differ");

const thinkingHub = read("src/features/thinking/components/ThinkingSystemsHub.tsx");
const systemComponentText = fs.existsSync(path.join(root, "src/features/thinking/components/systems"))
  ? fs.readdirSync(path.join(root, "src/features/thinking/components/systems")).filter((name) => name.endsWith(".tsx")).map((name) => read(path.join("src/features/thinking/components/systems", name))).join("\n")
  : "";
const thinkingSystemText = `${thinkingHub}\n${systemComponentText}`;
for (const system of ["Mistake Journal", "Reteach", "Challenge", "Problem-Solving Lab", "Evidence Room", "Interpretation Lens", "Discussion Arena", "Learning Planner", "Systems Mapper", "Portfolio"]) {
  add("thinking-systems", system, thinkingSystemText.includes(system) ? "pass" : "fail", thinkingSystemText.includes(system) ? "implemented in hub/components" : "missing");
}

for (const file of [
  "docs/thinking-systems/00_THINKING_SYSTEMS_DEEP_DIVE_INDEX.md",
  "docs/thinking-systems/01_MISTAKE_JOURNAL_DEEP_DIVE.md",
  "docs/thinking-systems/02_RETEACH_INTERVENTION_ENGINE_DEEP_DIVE.md",
  "docs/thinking-systems/03_CHALLENGE_ENRICHMENT_ENGINE_DEEP_DIVE.md",
  "docs/thinking-systems/04_PROBLEM_SOLVING_LAB_DEEP_DIVE.md",
  "docs/thinking-systems/05_EVIDENCE_ROOM_DEEP_DIVE.md",
  "docs/thinking-systems/06_INTERPRETATION_LENS_DEEP_DIVE.md",
  "docs/thinking-systems/07_DISCUSSION_ARENA_DEEP_DIVE.md",
  "docs/thinking-systems/08_LEARNING_PLANNER_DEEP_DIVE.md",
  "docs/thinking-systems/09_SYSTEMS_MAPPER_DEEP_DIVE.md",
  "docs/thinking-systems/10_PORTFOLIO_PROJECT_EVIDENCE_SYSTEM_DEEP_DIVE.md",
  "docs/77_THINKING_SYSTEMS_V6_AUDIT_AND_IMPROVEMENT_PLAN.md",
  "docs/78_THINKING_SYSTEMS_DATA_CONTRACTS.md",
  "docs/79_THINKING_SYSTEMS_QA_AND_ACCEPTANCE_TESTS.md",
]) add("v6-docs", file, exists(file) ? "pass" : "fail", exists(file) ? "present" : "missing");

for (const file of [
  "MistakeJournalPanel.tsx",
  "ReteachInterventionPanel.tsx",
  "ChallengeEnrichmentPanel.tsx",
  "ProblemSolvingLabPanel.tsx",
  "EvidenceRoomPanel.tsx",
  "InterpretationLensPanel.tsx",
  "DiscussionArenaPanel.tsx",
  "LearningPlannerPanel.tsx",
  "SystemsMapperPanel.tsx",
  "PortfolioEvidencePanel.tsx",
]) add("v6-components", file, exists(path.join("src/features/thinking/components/systems", file)) ? "pass" : "fail", exists(path.join("src/features/thinking/components/systems", file)) ? "present" : "missing");

const thinkingTypes = read("src/types/thinkingSystems.ts");
for (const required of ["ThinkingSystemDefinition", "ThinkingSystemRuntimeStatus", "MistakePatternSummary", "successCriteria", "safetyBoundary"]) {
  add("v6-contracts", required, thinkingTypes.includes(required) ? "pass" : "fail", thinkingTypes.includes(required) ? "typed" : "missing");
}



for (const file of [
  "src/types/persistence.ts",
  "src/features/persistence/persistenceKeys.ts",
  "src/features/persistence/localLearningPersistence.ts",
  "src/features/persistence/usePersistentLearningState.ts",
  "src/features/persistence/components/PersistenceStatusPanel.tsx",
  "docs/80_PERSISTENCE_ARCHITECTURE.md",
  "docs/81_PERSISTENCE_DATA_CONTRACTS.md",
  "docs/82_LOCAL_STORAGE_TO_DATABASE_MIGRATION_PLAN.md",
  "docs/83_PERSISTENCE_QA_AND_ACCEPTANCE_TESTS.md",
]) add("v7-persistence", file, exists(file) ? "pass" : "fail", exists(file) ? "present" : "missing");

const persistenceTypes = read("src/types/persistence.ts");
for (const required of ["LearningPersistenceState", "QuizAttemptRecord", "PersistedLearningPlannerEntry", "PersistedPortfolioEvidenceRecord"]) {
  add("v7-persistence-contracts", required, persistenceTypes.includes(required) ? "pass" : "fail", persistenceTypes.includes(required) ? "typed" : "missing");
}

const persistenceHook = read("src/features/persistence/usePersistentLearningState.ts");
for (const required of ["localStorage", "buildStudentPersistenceKey", "resetPersistence", "isHydrated"]) {
  add("v7-persistence-hook", required, persistenceHook.includes(required) ? "pass" : "fail", persistenceHook.includes(required) ? "implemented" : "missing");
}

const verticalSliceV7 = read("src/features/vertical-slice/MvpLearningLoop.tsx");
for (const required of ["usePersistentLearningState", "PersistenceStatusPanel", "quizAttemptHistory", "mistakeJournalEntries", "learningPlannerEntries", "portfolioEvidenceItems"]) {
  add("v7-persistence-wiring", required, verticalSliceV7.includes(required) ? "pass" : "fail", verticalSliceV7.includes(required) ? "wired" : "missing");
}

const outDir = path.join(root, "reports");
fs.mkdirSync(outDir, { recursive: true });

// ---- V8 Supabase persistence checks ----
for (const file of [
  "src/lib/supabase/client.ts",
  "src/types/database.types.ts",
  "src/features/persistence/learningPersistenceAdapter.ts",
  "src/features/persistence/supabaseLearningPersistence.ts",
  "src/features/persistence/learningPersistenceProvider.ts",
  "src/features/persistence/migrateLocalToSupabase.ts",
  "src/features/auth/AuthGate.tsx",
  "docs/85_SUPABASE_SCHEMA_AND_RLS.md",
  "docs/86_SUPABASE_PERSISTENCE_ADAPTER.md",
  "docs/87_LOCAL_TO_SUPABASE_MIGRATION.md",
  "docs/88_SUPABASE_QA_AND_SECURITY_CHECKLIST.md",
  "reports/V8_SUPABASE_PERSISTENCE_BUILD_REPORT.md",
  "reports/V8_CHANGELOG.md",
  "supabase/migrations/0005_v8_full_normalized_schema.sql",
]) add("v8-supabase-persistence", file, exists(file) ? "pass" : "fail", exists(file) ? "present" : "missing");

const v8Adapter = read("src/features/persistence/supabaseLearningPersistence.ts");
for (const required of [
  "saveLessonProgress", "saveQuizAttempt", "saveMasteryRecord", "saveMemoryVaultItems",
  "saveMemoryVaultReviewSession", "saveMistakeJournalEntry", "saveReteachPlan", "saveChallengePlan",
  "saveProblemSolvingLabEntry", "saveEvidenceRoomEntry", "saveInterpretationLensEntry",
  "saveDiscussionArenaEntry", "saveLearningPlannerEntry", "saveSystemsMapperEntry", "savePortfolioEvidenceItem",
]) add("v8-adapter-methods", required, v8Adapter.includes(required) ? "pass" : "fail", v8Adapter.includes(required) ? "implemented" : "missing");

const v8Client = read("src/lib/supabase/client.ts");
add("v8-security", "no service role key in client", v8Client.includes("SERVICE_ROLE") ? "fail" : "pass", v8Client.includes("SERVICE_ROLE") ? "EXPOSED" : "clean");

const csv = ["category,check,status,detail", ...checks.map((row) => [row.category, row.check, row.status, row.detail].map((value) => `"${String(value).replaceAll('"','""')}"`).join(","))].join("\n");
fs.writeFileSync(path.join(outDir, "BUILD_GUIDE_COMPLIANCE_MATRIX_V7.csv"), csv);
const failCount = checks.filter((row) => row.status === "fail").length;
console.log(`Audit checks: ${checks.length}`);
console.log(`Failures: ${failCount}`);
console.log("Report: reports/BUILD_GUIDE_COMPLIANCE_MATRIX_V7.csv");
if (failCount) process.exit(1);
