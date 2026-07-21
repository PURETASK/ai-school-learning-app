import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createInitialState,
  getContentBatchReviewState,
  getContentPipelineWorkflowAudit,
  importLessonBatch,
  resolveAgentReviewItem,
  validateLessonBatch
} from "../src/engine.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(root, "content", "bridge-academy", "grade-6");
const sourceBatchId = process.env.NATIVE_CONTENT_BATCH_ID || "bridge-academy-grade-6-native-batch-1";

function findJsonFiles(folder) {
  return fs.readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(folder, entry.name);
    return entry.isDirectory() ? findJsonFiles(file) : entry.name.endsWith(".json") ? [file] : [];
  });
}

const files = findJsonFiles(contentRoot).sort();
const lessons = files.map((file) => JSON.parse(fs.readFileSync(file, "utf8")));
const validation = validateLessonBatch({ sourceBatchId, lessons });
const imported = validation.accepted
  ? importLessonBatch(createInitialState(), { sourceBatchId, lessons })
  : { state: createInitialState(), result: validation };
let reviewedState = imported.state;
for (const asset of (reviewedState.visualAssets || []).filter((item) => item.sourceBatchId === sourceBatchId)) {
  const visualReview = resolveAgentReviewItem(reviewedState, `visual:${asset.id}`, "approve");
  if (!visualReview.result.accepted) {
    reviewedState = visualReview.state;
    break;
  }
  reviewedState = visualReview.state;
}
const batch = getContentBatchReviewState(reviewedState, sourceBatchId);
const workflow = validation.accepted
  ? getContentPipelineWorkflowAudit(reviewedState, sourceBatchId)
  : { passed: false, blockers: ["Batch validation failed before review workflow could run."] };

const report = {
  sourceBatchId,
  files: files.map((file) => path.relative(root, file)),
  validation: {
    accepted: validation.accepted,
    total: validation.total,
    readyCount: validation.readyCount,
    errors: validation.errors,
    warnings: validation.warnings
  },
  review: {
    status: batch.status,
    grade: batch.grade,
    score: batch.score,
    passedLessons: batch.passedLessons,
    totalLessons: batch.totalLessons,
    blockers: batch.blockers
  },
  workflow
};

console.log(JSON.stringify(report, null, 2));

if (!validation.accepted || !batch.passed || !workflow.passed) {
  console.error("Native content batch gate failed: resolve validation, quality, or publication blockers before scaling content.");
  process.exitCode = 1;
} else {
  console.error(`Native content batch gate passed: ${sourceBatchId} is ${batch.grade} and the simulated approval/publication loop completed.`);
}
