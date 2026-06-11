"use client";

import type { LearningPersistenceState } from "@/types/persistence";
import { buildStudentPersistenceKey } from "@/features/persistence/persistenceKeys";
import { safeParseLearningPersistenceState } from "@/features/persistence/localLearningPersistence";
import {
  getOrCreateActiveStudentProfileId,
  saveLearningStateToSupabase,
  supabaseLearningPersistence,
  normalizeMistakeType,
} from "@/features/persistence/supabaseLearningPersistence";

const MIGRATION_FLAG_PREFIX = "k12-learning-app:migrated-to-supabase";

export type MigrationSummary = {
  migrated: boolean;
  reason?: string;
  snapshotSaved: boolean;
  quizAttempts: number;
  memoryVaultItems: number;
  mistakeJournalEntries: number;
  failures: string[];
};

function migrationFlagKey(localStudentId: string): string {
  return `${MIGRATION_FLAG_PREFIX}:${localStudentId}`;
}

export function hasMigratedLocalData(localStudentId: string): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(migrationFlagKey(localStudentId)) === "true";
}

export function readLocalLearningState(localStudentId: string): LearningPersistenceState | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(buildStudentPersistenceKey(localStudentId));
  const parsed = safeParseLearningPersistenceState(raw);
  if (!parsed || typeof parsed.schemaVersion !== "number" || !Array.isArray(parsed.completedLessonIds)) {
    return null;
  }
  return parsed as LearningPersistenceState;
}

/**
 * Migrates V7 localStorage learning data into the signed-in account (docs/87).
 *
 * IMPORTANT: `consentConfirmed` must come from an explicit user action
 * ("Save this progress to your account?"). Child data must never be uploaded
 * silently (docs/84 privacy rules).
 */
export async function migrateLocalToSupabase(args: {
  localStudentId: string;
  consentConfirmed: boolean;
}): Promise<MigrationSummary> {
  const summary: MigrationSummary = {
    migrated: false,
    snapshotSaved: false,
    quizAttempts: 0,
    memoryVaultItems: 0,
    mistakeJournalEntries: 0,
    failures: [],
  };

  if (!args.consentConfirmed) {
    summary.reason = "Consent not confirmed; nothing uploaded.";
    return summary;
  }
  if (hasMigratedLocalData(args.localStudentId)) {
    summary.reason = "Local data already migrated.";
    return summary;
  }
  const localState = readLocalLearningState(args.localStudentId);
  if (!localState) {
    summary.reason = "No local learning data found.";
    return summary;
  }

  // 1. Whole-state snapshot (guarantees nothing is lost even if event inserts fail)
  try {
    const dbStudentId = await getOrCreateActiveStudentProfileId();
    await saveLearningStateToSupabase({ dbStudentId, state: localState });
    summary.snapshotSaved = true;
  } catch (error) {
    summary.failures.push(
      `snapshot: ${error instanceof Error ? error.message : "unknown error"}`
    );
    summary.reason = "Snapshot save failed; migration aborted so it can be retried.";
    return summary;
  }

  // 2. Quiz attempts + answers
  for (const attempt of localState.quizAttemptHistory) {
    const result = await supabaseLearningPersistence.saveQuizAttempt({
      lessonId: attempt.lessonId,
      scorePercent: attempt.result.score,
      pointsEarned: attempt.result.pointsEarned,
      pointsPossible: attempt.result.maxPoints,
      masteryBand: masteryBandFromScore(attempt.result.score),
      submittedAtIso: attempt.submittedAtIso,
      answers: attempt.result.answers.map((graded) => ({
        questionId: graded.question.id,
        questionType: graded.question.type,
        studentAnswer: graded.studentAnswer ?? null,
        correctAnswer: graded.question.correctAnswer ?? null,
        isCorrect: graded.isCorrect,
        pointsEarned: graded.pointsEarned,
        pointsPossible: graded.maxPoints,
        explanation: graded.feedback,
        skillTags: [graded.question.skillTag],
      })),
    });
    if (result.ok) summary.quizAttempts += 1;
    else summary.failures.push(`quiz attempt ${attempt.id}: ${result.error.message}`);
  }

  // 3. Memory Vault items
  const vaultInputs = localState.memoryVaultItems.map((item) => ({
    lessonId: item.lessonId,
    skillId: item.skillTag,
    prompt: item.prompt,
    expectedAnswer: item.expectedAnswer,
    promptType: "recall" as const,
    reviewStage: toDbReviewStage(item.reviewStage),
    dueAtIso: item.dueDateIso,
    reviewIntervalDays: item.dueInDays,
    retentionStrength: item.retentionStrength,
    status: item.status === "missed" ? ("due" as const) : (item.status as "scheduled" | "due" | "completed" | "rescheduled"),
  }));
  const vaultResult = await supabaseLearningPersistence.saveMemoryVaultItems(vaultInputs);
  if (vaultResult.ok) summary.memoryVaultItems = vaultResult.data;
  else summary.failures.push(`memory vault items: ${vaultResult.error.message}`);

  // 4. Mistake Journal entries
  for (const entry of localState.mistakeJournalEntries) {
    const result = await supabaseLearningPersistence.saveMistakeJournalEntry({
      lessonId: entry.lessonId,
      questionId: entry.questionId,
      mistakeType: normalizeMistakeType(entry.mistakeType),
      severity: entry.severity,
      skillTags: [entry.skillTag],
      studentFriendlyMessage: entry.studentFriendlyLabel,
      repairAction: entry.repairPrompt,
    });
    if (result.ok) summary.mistakeJournalEntries += 1;
    else summary.failures.push(`mistake entry ${entry.id}: ${result.error.message}`);
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(migrationFlagKey(args.localStudentId), "true");
  }
  summary.migrated = true;
  return summary;
}

function toDbReviewStage(stage: string): "day_1" | "day_3" | "day_7" | "day_14" | "day_30" {
  switch (stage) {
    case "day-1": return "day_1";
    case "day-3": return "day_3";
    case "day-7": return "day_7";
    case "day-14": return "day_14";
    case "day-30": return "day_30";
    default: return "day_7";
  }
}

function masteryBandFromScore(score: number): string {
  if (score >= 90) return "advanced";
  if (score >= 80) return "mastered";
  if (score >= 65) return "almost_mastered";
  if (score >= 40) return "needs_reteach";
  return "needs_intervention";
}
