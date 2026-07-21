#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { validateNexusLessonV3 } from "../src/nexusV3.js";

const root = process.cwd();
const contentDir = path.join(root, "content");
const requiredTopLevel = [
  "schemaVersion", "id", "title", "academy", "academyName", "gradeLevel", "subject", "course", "unit",
  "learningObjective", "essentialQuestion", "standardsTags", "thinkingSkillTags", "vocabularyTerms",
  "prerequisites", "lessonFlow", "quiz", "retrievalCheck", "memoryVaultItems", "reteachPath",
  "challengePath", "mastery", "parentTeacherNotes", "accessibilityNotes", "safetyNotes"
];
const requiredFlow = [
  "hook", "learningGoal", "miniTeach", "firstPrinciplesBreakdown", "workedExample", "guidedPractice",
  "criticalThinkingCheckpoint", "evidenceBasedReasoningTask", "interpretationOrDiscussionTask", "activePractice",
  "retrievalCheck", "feedback", "reflection"
];
const idPattern = /^(FA|BA|SA)-G\d+-(ELA|MATH|SCI|SS|ALG|ENG|BIO|WH|WR|CS|STUDY|FIN)-U\d+-L\d+$/;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    if (entry.isFile() && entry.name.endsWith(".json")) return [full];
    return [];
  });
}

const errors = [];
const warnings = [];
const lessonIds = new Set();
const quizIds = new Set();
const memoryIds = new Set();
const files = walk(contentDir);

if (files.length === 0) {
  errors.push(`No lesson JSON files found in ${contentDir}`);
}

for (const file of files) {
  let lesson;
  try {
    lesson = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    errors.push(`${file}: invalid JSON: ${error.message}`);
    continue;
  }
  const label = lesson.id || file;
  if (lesson.schemaVersion === "3") {
    const result = validateNexusLessonV3(lesson, { requireNative: true });
    if (!result.passed) {
      for (const error of result.errors) errors.push(String(label) + ": " + error.path + ": " + error.message);
    }
    if (lesson.id && lessonIds.has(lesson.id)) errors.push(String(label) + ": duplicate lesson id " + lesson.id);
    if (lesson.id) lessonIds.add(lesson.id);
    continue;
  }
  for (const field of requiredTopLevel) {
    if (lesson[field] === undefined || lesson[field] === null || lesson[field] === "") {
      errors.push(`${label}: missing required field ${field}`);
    }
  }
  if (lesson.id && lessonIds.has(lesson.id)) errors.push(`${label}: duplicate lesson id ${lesson.id}`);
  if (lesson.id) lessonIds.add(lesson.id);
  if (lesson.id && !idPattern.test(lesson.id)) warnings.push(`${label}: lesson id does not match canonical pattern`);
  if (!Array.isArray(lesson.standardsTags) || lesson.standardsTags.length === 0) errors.push(`${label}: standardsTags must be non-empty`);
  if (!Array.isArray(lesson.thinkingSkillTags) || lesson.thinkingSkillTags.length === 0) errors.push(`${label}: thinkingSkillTags must be non-empty`);
  for (const section of requiredFlow) {
    if (!lesson.lessonFlow || !lesson.lessonFlow[section]) errors.push(`${label}: missing lessonFlow.${section}`);
  }
  if (!Array.isArray(lesson.quiz) || lesson.quiz.length === 0) {
    errors.push(`${label}: quiz must contain questions`);
  } else {
    for (const q of lesson.quiz) {
      if (!q.id) errors.push(`${label}: quiz question missing id`);
      if (q.id && quizIds.has(q.id)) errors.push(`${label}: duplicate quiz id ${q.id}`);
      if (q.id) quizIds.add(q.id);
      if (!q.question) errors.push(`${label}/${q.id}: missing question`);
      if (!q.explanation) errors.push(`${label}/${q.id}: missing explanation`);
      if (q.type === "mc" && (!Array.isArray(q.choices) || q.choices.length < 2)) errors.push(`${label}/${q.id}: multiple choice requires choices`);
      if (q.type === "mc" && !q.correctAnswer) errors.push(`${label}/${q.id}: multiple choice requires correctAnswer`);
    }
  }
  if (!Array.isArray(lesson.memoryVaultItems) || lesson.memoryVaultItems.length === 0) {
    errors.push(`${label}: memoryVaultItems must be non-empty`);
  } else {
    for (const item of lesson.memoryVaultItems) {
      if (!item.id) errors.push(`${label}: Memory Vault item missing id`);
      if (item.id && memoryIds.has(item.id)) errors.push(`${label}: duplicate Memory Vault item id ${item.id}`);
      if (item.id) memoryIds.add(item.id);
      if (!Array.isArray(item.scheduleDays) || item.scheduleDays.join(",") !== "1,3,7,14,30") {
        warnings.push(`${label}/${item.id}: scheduleDays should be [1,3,7,14,30]`);
      }
      if (!item.prompt || !item.expectedAnswer || !item.skillTag) errors.push(`${label}/${item.id}: Memory Vault item needs prompt, expectedAnswer, skillTag`);
    }
  }
  if (!lesson.reteachPath || !Array.isArray(lesson.reteachPath.practice) || lesson.reteachPath.practice.length === 0) {
    errors.push(`${label}: reteachPath.practice must be non-empty`);
  }
  if (!lesson.challengePath || !Array.isArray(lesson.challengePath.tasks) || lesson.challengePath.tasks.length === 0) {
    errors.push(`${label}: challengePath.tasks must be non-empty`);
  }
}

console.log(`Validated ${files.length} lesson JSON files.`);
if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}):`);
  for (const warning of warnings) console.log(`- ${warning}`);
}
if (errors.length) {
  console.error(`\nErrors (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("No validation errors found.");
