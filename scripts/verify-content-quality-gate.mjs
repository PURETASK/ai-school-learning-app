import { createInitialState, getContentBatchReviewState, getContentPipelineWorkflowAudit, getPilotQualityGateReport } from "../src/engine.js";

const state = createInitialState();
const args = new Map(
  process.argv.slice(2).map((argument) => {
    const [key, ...value] = argument.replace(/^--/, "").split("=");
    return [key, value.join("=") || ""];
  })
);
const batchId = args.get("batch") || "bridge-academy-grade-6-batch-1";
const batch = getContentBatchReviewState(state, batchId);
const pilot = getPilotQualityGateReport(state);
const workflow = getContentPipelineWorkflowAudit(state, batchId);
const report = {
  batch: {
    id: batch.sourceBatchId,
    title: batch.title,
    status: batch.status,
    grade: batch.grade,
    score: batch.score,
    threshold: batch.threshold,
    passedLessons: batch.passedLessons,
    totalLessons: batch.totalLessons,
    passed: batch.passed,
    publishEligible: batch.publishEligible,
    blockers: batch.blockers,
    revisionInstructions: batch.revisionInstructions
  },
  pilotScaleGate: {
    passedLessons: pilot.passedLessons,
    totalLessons: pilot.totalLessons,
    scaleUnlocked: pilot.scaleUnlocked,
    blockingLessons: pilot.blockingLessons
  },
  workflowAudit: workflow
};

console.log(JSON.stringify(report, null, 2));

if (!batch.totalLessons) {
  console.error(`Quality gate failed: batch '${batchId}' has no lessons.`);
  process.exitCode = 1;
} else if (!batch.passed || Number(batch.score || 0) < Number(batch.threshold || 80)) {
  console.error(`Quality gate failed: ${batch.title} is ${batch.grade} (${batch.score}/${batch.threshold}).`);
  process.exitCode = 1;
} else if (!pilot.scaleUnlocked || !workflow.passed) {
  console.error("Scale gate failed: pilots must pass quality and the manager approval-to-publication workflow must complete.");
  process.exitCode = 1;
} else {
  console.error(`Quality gate passed: ${batch.title} is ${batch.grade} and all pilots clear the scale gate.`);
}
