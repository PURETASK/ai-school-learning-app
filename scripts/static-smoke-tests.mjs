#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const contentDir = path.join(root, "content");

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    if (entry.isFile() && entry.name.endsWith(".json")) return [full];
    return [];
  });
}

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

const lessons = walk(contentDir).map((file) => JSON.parse(fs.readFileSync(file, "utf8")));
assert.equal(lessons.length, 16, "MVP should contain exactly 16 seed lessons after V5 expansion");

for (const lesson of lessons) {
  assert.ok(["foundation", "bridge", "scholar"].includes(lesson.academy), `${lesson.id}: academy should be canonical`);
  assert.ok(lesson.quiz.length >= 12, `${lesson.id}: should have at least 12 quiz questions`);
  assert.ok(lesson.memoryVaultItems.length >= 5, `${lesson.id}: should have Memory Vault items`);
  for (const item of lesson.memoryVaultItems) {
    assert.deepEqual(item.scheduleDays, [1, 3, 7, 14, 30], `${lesson.id}/${item.id}: schedule must match Memory Vault canon`);
  }
}

const lessonPlayer = read("src/features/lessons/LessonPlayer.tsx");
assert.ok(lessonPlayer.includes("LESSON_SECTION_COUNT = LESSON_SECTION_ORDER.length"), "Lesson Player should expose canonical section count");
const sectionMatches = [...lessonPlayer.matchAll(/label: \"([^\"]+)\"/g)].map((m) => m[1]);
assert.equal(sectionMatches.length, 16, "Lesson Player should expose all 16 official lesson sections");
for (const required of ["Mastery Score", "Spaced Review Scheduling", "Reteach or Challenge Path"]) {
  assert.ok(sectionMatches.includes(required), `Lesson Player missing required derived section: ${required}`);
}

const masteryEngine = read("src/features/mastery/masteryEngine.ts");
for (const label of ["Needs Intervention", "Needs Reteach", "Almost Mastered", "Mastered", "Advanced"]) {
  assert.ok(masteryEngine.includes(label), `Mastery engine missing ${label}`);
}

const memoryVaultEngine = read("src/features/memory-vault/memoryVaultEngine.ts");
for (const required of [
  "gradeMemoryVaultAnswer",
  "applyMemoryVaultReviewSession",
  "scoreMemoryVaultResponse",
  "updateRetentionStrength",
  "getReviewableMemoryVaultItems",
]) {
  assert.ok(memoryVaultEngine.includes(required), `Memory Vault engine missing ${required}`);
}
assert.ok(memoryVaultEngine.includes("DEFAULT_MEMORY_VAULT_DAYS = [1, 3, 7, 14, 30]"), "Memory Vault engine should preserve canonical schedule");

const memoryVaultTypes = read("src/types/memoryVault.ts");
for (const required of ["MemoryVaultReviewAnswer", "MemoryVaultReviewOutcome", "MemoryVaultReviewAttempt", "MemoryVaultSessionSummary"]) {
  assert.ok(memoryVaultTypes.includes(required), `Memory Vault types missing ${required}`);
}

const reviewComponent = read("src/features/memory-vault/components/MemoryVaultReviewSession.tsx");
for (const required of ["Memory Vault Review Session", "Type what you remember", "Confidence", "Check answer", "Finish session", "Review Queue"]) {
  assert.ok(reviewComponent.includes(required), `Review session UI missing ${required}`);
}

const verticalSlice = read("src/features/vertical-slice/MvpLearningLoop.tsx");
assert.ok(verticalSlice.includes('"memory-vault"'), "Vertical slice should include memory-vault screen");
assert.ok(verticalSlice.includes("MemoryVaultReviewSession"), "Vertical slice should render MemoryVaultReviewSession");
assert.ok(verticalSlice.includes("memoryVaultSessionSummaries"), "Vertical slice should store Memory Vault session summaries");

const studentDashboard = read("src/features/dashboards/student/StudentDashboard.tsx");
assert.ok(studentDashboard.includes("Start review session"), "Student dashboard should expose Memory Vault review entry point");

const parentDashboard = read("src/features/dashboards/parent/ParentDashboard.tsx");
assert.ok(parentDashboard.includes("Latest Memory Vault Session"), "Parent dashboard should summarize latest Memory Vault session");

const pkg = JSON.parse(read("package.json"));
assert.ok(pkg.scripts["validate:lessons"], "package.json should expose validate:lessons");
assert.ok(pkg.scripts.audit, "package.json should expose audit");
assert.ok(pkg.scripts.test, "package.json should expose test");

console.log("Static smoke tests passed.");
console.log(`Lessons checked: ${lessons.length}`);
console.log(`Lesson sections checked: ${sectionMatches.length}`);

const requiredV5Files = [
  "src/types/thinkingSystems.ts",
  "src/features/mistake-journal/mistakeJournalEngine.ts",
  "src/features/reteach/reteachInterventionEngine.ts",
  "src/features/challenge/challengeEnrichmentEngine.ts",
  "src/features/thinking/thinkingSystemsEngine.ts",
  "src/features/thinking/components/ThinkingSystemsHub.tsx",
  "src/features/portfolio/portfolioEvidenceEngine.ts",
  "docs/76_V5_THINKING_AND_ADAPTATION_SYSTEMS.md"
];
for (const file of requiredV5Files) {
  assert.ok(fs.existsSync(path.join(root, file)), `V5 required file missing: ${file}`);
}
const thinkingHub = read("src/features/thinking/components/ThinkingSystemsHub.tsx");
const systemComponentText = fs.readdirSync(path.join(root, "src/features/thinking/components/systems")).filter((name) => name.endsWith(".tsx")).map((name) => read(path.join("src/features/thinking/components/systems", name))).join("\n");
const thinkingSystemText = `${thinkingHub}\n${systemComponentText}`;
for (const label of ["Mistake Journal", "Reteach / Intervention Engine", "Challenge / Enrichment Engine", "Problem-Solving Lab", "Evidence Room", "Interpretation Lens", "Discussion Arena", "Learning Planner", "Systems Mapper", "Portfolio / Project Evidence"]) {
  assert.ok(thinkingSystemText.includes(label), `Thinking Systems implementation missing ${label}`);
}
const verticalSliceV5 = read("src/features/vertical-slice/MvpLearningLoop.tsx");
assert.ok(verticalSliceV5.includes('"thinking-systems"'), "Vertical slice should include thinking-systems screen");
assert.ok(verticalSliceV5.includes("ThinkingSystemsHub"), "Vertical slice should render ThinkingSystemsHub");

console.log("Memory Vault review-session workflow checked.");
console.log("V5 thinking/adaptation systems checked.");

const requiredV6SystemDocs = [
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
];
for (const file of requiredV6SystemDocs) {
  assert.ok(fs.existsSync(path.join(root, file)), `V6 deep-dive system doc missing: ${file}`);
}

const requiredV6Components = [
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
];
for (const file of requiredV6Components) {
  assert.ok(fs.existsSync(path.join(root, "src/features/thinking/components/systems", file)), `V6 system component missing: ${file}`);
}

const thinkingTypes = read("src/types/thinkingSystems.ts");
for (const required of ["ThinkingSystemDefinition", "ThinkingSystemRuntimeStatus", "MistakePatternSummary", "successCriteria", "safetyBoundary"]) {
  assert.ok(thinkingTypes.includes(required), `V6 thinking system types missing ${required}`);
}
console.log("V6 thinking system deep-dive docs/components checked.");


const requiredV7Files = [
  "src/types/persistence.ts",
  "src/features/persistence/persistenceKeys.ts",
  "src/features/persistence/localLearningPersistence.ts",
  "src/features/persistence/usePersistentLearningState.ts",
  "src/features/persistence/components/PersistenceStatusPanel.tsx",
  "docs/80_PERSISTENCE_ARCHITECTURE.md",
  "docs/81_PERSISTENCE_DATA_CONTRACTS.md",
  "docs/82_LOCAL_STORAGE_TO_DATABASE_MIGRATION_PLAN.md",
  "docs/83_PERSISTENCE_QA_AND_ACCEPTANCE_TESTS.md",
];
for (const file of requiredV7Files) {
  assert.ok(fs.existsSync(path.join(root, file)), `V7 persistence required file missing: ${file}`);
}
const persistenceTypes = read("src/types/persistence.ts");
for (const required of ["LearningPersistenceState", "QuizAttemptRecord", "PersistedLearningPlannerEntry", "PersistedPortfolioEvidenceRecord"]) {
  assert.ok(persistenceTypes.includes(required), `Persistence types missing ${required}`);
}
const persistenceHook = read("src/features/persistence/usePersistentLearningState.ts");
for (const required of ["localStorage", "buildStudentPersistenceKey", "resetPersistence", "isHydrated"]) {
  assert.ok(persistenceHook.includes(required), `Persistence hook missing ${required}`);
}
const verticalSliceV7 = read("src/features/vertical-slice/MvpLearningLoop.tsx");
for (const required of ["usePersistentLearningState", "PersistenceStatusPanel", "quizAttemptHistory", "mistakeJournalEntries", "learningPlannerEntries", "portfolioEvidenceItems"]) {
  assert.ok(verticalSliceV7.includes(required), `Vertical slice persistence missing ${required}`);
}
const parentDashboardV7 = read("src/features/dashboards/parent/ParentDashboard.tsx");
assert.ok(parentDashboardV7.includes("Persisted Learning Evidence"), "Parent dashboard should expose persisted learning evidence");
console.log("V7 persistence layer checked.");
