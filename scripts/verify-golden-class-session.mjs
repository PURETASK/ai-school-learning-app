import assert from "node:assert/strict";
import {
  askAiTutor,
  completeLessonQuiz,
  completeNexusPhase,
  createClassSession,
  createInitialState,
  createSchoolClass,
  enrollLearnerInSchoolClass,
  getHouseholdLearnerInsights,
  getLearnerClassSession,
  getLearnerLevelProfile,
  getParentSummary,
  getPlatformSeedProjection,
  getTeacherClassMonitor,
  recordClassAttendance,
  submitClassroomArtifact,
  submitTutorHintRetry,
  updateClassSessionStatus
} from "../src/engine.js";

const classSectionId = "class-golden-bridge-math-6";
const classSessionId = "session-golden-ratio-quest";
const lessonId = "g6-math-ratios-unit-rates";
const learnerId = "maya";

let state = createInitialState();
const startingXp = getLearnerLevelProfile(state, learnerId).totalXp;

const createdClass = createSchoolClass(state, {
  id: classSectionId,
  schoolId: "school-demo-1",
  name: "Bridge Grade 6 Math Intervention",
  grade: "6",
  subject: "math",
  teacherId: "teacher-demo-1",
  schedule: "Pilot period | Mon-Thu | 50 min"
});
assert.equal(createdClass.result.accepted, true);
state = createdClass.state;

const enrolled = enrollLearnerInSchoolClass(state, { classSectionId, learnerId });
assert.equal(enrolled.result.accepted, true);
state = enrolled.state;

const planned = createClassSession(state, {
  id: classSessionId,
  classSectionId,
  lessonId,
  durationMinutes: 50,
  periodLabel: "Pilot period"
});
assert.equal(planned.result.accepted, true);
assert.equal(planned.result.session.steps.length, 9);
assert.equal(planned.result.session.steps.reduce((sum, step) => sum + step.minutes, 0), 50);
assert.ok(planned.result.mission);
state = planned.state;

const attendance = recordClassAttendance(state, {
  classSessionId,
  learnerId,
  status: "present",
  recordedByUserId: "user-teacher-demo"
});
assert.equal(attendance.result.accepted, true);
state = attendance.state;

const launched = updateClassSessionStatus(state, {
  classSessionId,
  status: "Live",
  stepId: "orient",
  stepStatus: "live"
});
assert.equal(launched.result.accepted, true);
state = launched.state;

const orient = completeNexusPhase(state, { learnerId, lessonId, phase: "orient" });
assert.equal(orient.result.accepted, true);
state = orient.state;

const tutorTurn = askAiTutor(state, {
  learnerId,
  lessonId,
  ageBand: "6-8",
  scratchpadReview: true,
  input: "I can find each total price, but I do not understand why comparing only the totals is unfair."
});
assert.notEqual(tutorTurn.response.type, "blocked-answer");
assert.ok(tutorTurn.response.nextQuestion || tutorTurn.response.nextStep);
state = tutorTurn.state;

const retry = submitTutorHintRetry(state, {
  learnerId,
  lessonId,
  retryAfterHint: "I should compare what one item costs in each deal, because the packs contain different numbers of items."
});
assert.equal(retry.result.accepted, true);
state = retry.state;

const artifact = submitClassroomArtifact(state, {
  missionId: planned.result.mission.id,
  learnerId,
  individualEvidence: "Deal B is better because its unit rate is lower; I divided each price by its number of items before comparing."
});
assert.equal(artifact.result.accepted, true);
state = artifact.state;

const lesson = getLearnerClassSession(state, learnerId).lesson;
const answers = Object.fromEntries(lesson.quiz.map((question) => [question.id, Number(question.answerIndex)]));
state = completeLessonQuiz(state, lessonId, answers, { learnerId });
assert.ok(Number(state.mastery[lessonId]?.score || 0) >= Number(lesson.masteryThreshold || 80));

const completed = updateClassSessionStatus(state, { classSessionId, status: "Completed", stepId: "prove", stepStatus: "complete" });
assert.equal(completed.result.accepted, true);
state = completed.state;

const teacher = getTeacherClassMonitor(state, classSectionId, { allowFallback: false });
assert.equal(teacher.session.status, "Completed");
assert.equal(teacher.metrics.enrolled, 1);
assert.equal(teacher.metrics.present, 1);
assert.equal(teacher.metrics.submittedArtifacts, 1);
assert.equal(teacher.metrics.mastered, 1);

const parent = getParentSummary(state, { learnerIds: [learnerId], strictLearnerScope: true });
const household = getHouseholdLearnerInsights(state, { learnerIds: [learnerId], strictLearnerScope: true });
assert.equal(parent.learnerCount, 1);
assert.equal(household.length, 1);
assert.ok(household[0].subjects.some((subject) => subject.subject === "math" && subject.masteryAverage > 0));
assert.ok(getLearnerLevelProfile(state, learnerId).totalXp > startingXp);

const projection = getPlatformSeedProjection(state).tables;
for (const [tableId, predicate] of [
  ["classes", (row) => row.id === classSectionId],
  ["enrollments", (row) => row.class_id === classSectionId && row.student_id === learnerId],
  ["class_sessions", (row) => row.id === classSessionId && row.status === "Completed"],
  ["attendance_records", (row) => row.class_session_id === classSessionId && row.status === "present"],
  ["group_artifacts", (row) => row.student_id === learnerId && row.artifact_status === "submitted"],
  ["quiz_attempts", (row) => row.student_id === learnerId && row.quiz_id === `${lessonId}-quiz`],
  ["mastery_records", (row) => row.student_id === learnerId && row.lesson_id === lessonId],
  ["ai_tutor_events", (row) => row.student_id === learnerId && row.lesson_id === lessonId]
]) {
  assert.ok(projection[tableId].some(predicate), `${tableId} should contain golden-session evidence`);
}

console.log(JSON.stringify({
  passed: true,
  product: "Bridge Academy Grade 6 Math Intervention Class",
  classSectionId,
  classSessionId,
  lessonId,
  phaseCount: planned.result.session.steps.length,
  durationMinutes: planned.result.session.durationMinutes,
  masteryScore: state.mastery[lessonId].score,
  xpEarned: getLearnerLevelProfile(state, learnerId).totalXp - startingXp,
  teacherMetrics: teacher.metrics,
  parentVisible: true,
  persistedEvidenceTables: ["classes", "enrollments", "class_sessions", "attendance_records", "group_artifacts", "quiz_attempts", "mastery_records", "ai_tutor_events"]
}, null, 2));
