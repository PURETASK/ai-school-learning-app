import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createInitialState, normalizeAppState } from "../src/engine.js";
import { createNormalizedStateUpsertSql } from "../src/repository.js";

const state = normalizeAppState(createInitialState());
const seed = createNormalizedStateUpsertSql(state);
const outputDir = resolve("db", "seeds");
const outputPath = resolve(outputDir, "0001_k12_learning_seed.sql");

await mkdir(outputDir, { recursive: true });
await writeFile(
  outputPath,
  [
    "-- K-12 Learning Academies normalized seed data",
    "-- Generated from createInitialState() and src/schema.js.",
    "-- Review before applying outside local development.",
    seed.sql
  ].join("\n"),
  "utf8"
);

console.log(`file=${outputPath}`);
console.log(`tables=${seed.tableIds.length}`);
console.log(`requiredTablesWithRows=${seed.projectionSummary.requiredTablesWithRows}`);
console.log(`contentDrafts=${seed.rowCounts.content_drafts || 0}`);
console.log(`visualAssets=${seed.rowCounts.visual_assets || 0}`);
console.log(`quizAttempts=${seed.rowCounts.quiz_attempts || 0}`);
console.log(`reviewItems=${seed.rowCounts.agent_review_items || 0}`);
