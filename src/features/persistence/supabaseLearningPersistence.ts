"use client";

import type { LearningPersistenceState } from "@/types/persistence";
import { LEARNING_PERSISTENCE_SCHEMA_VERSION } from "@/types/persistence";
import { ensureSupabaseSession, getSupabaseClient } from "@/lib/supabase/client";
import type { Json } from "@/types/database.types";
import {
  persistenceError,
  persistenceOk,
  type ChallengePlanInput,
  type DiscussionArenaEntryInput,
  type EvidenceRoomEntryInput,
  type InterpretationLensEntryInput,
  type LearningPersistenceAdapter,
  type LearningPlannerEntryInput,
  type LessonProgressInput,
  type MasteryRecordInput,
  type MemoryVaultItemInput,
  type MemoryVaultReviewSessionInput,
  type MistakeJournalEntryInput,
  type PersistenceResult,
  type PortfolioEvidenceItemInput,
  type ProblemSolvingLabEntryInput,
  type QuizAttemptInput,
  type ReteachPlanInput,
  type SavedRecord,
  type SystemsMapperEntryInput,
} from "@/features/persistence/learningPersistenceAdapter";

const DEFAULT_STUDENT_NAME = "My Student";
const DEFAULT_ACADEMY = "foundation-academy";
const DEFAULT_GRADE_LEVEL = "3";

let cachedStudentProfileId: string | null = null;

/**
 * Finds (or creates) the active student profile for the signed-in guardian.
 * MVP model: one child per guardian, created on first use; the guardian is
 * linked via guardian_student_links so RLS grants read/write access.
 */
export async function getOrCreateActiveStudentProfileId(): Promise<string> {
  if (cachedStudentProfileId) return cachedStudentProfileId;
  const supabase = getSupabaseClient();
  const userId = await ensureSupabaseSession();

  const { data: links, error: linkError } = await supabase
    .from("guardian_student_links")
    .select("student_id")
    .order("created_at", { ascending: true })
    .limit(1);
  if (linkError) throw new Error(`Unable to look up linked students: ${linkError.message}`);
  if (links && links.length > 0) {
    cachedStudentProfileId = links[0].student_id;
    return cachedStudentProfileId;
  }

  const { data: created, error: createError } = await supabase
    .from("student_profiles")
    .insert({
      user_id: null,
      display_name: DEFAULT_STUDENT_NAME,
      academy: DEFAULT_ACADEMY,
      grade_level: DEFAULT_GRADE_LEVEL,
    })
    .select("id")
    .single();
  if (createError || !created) {
    throw new Error(`Unable to create student profile: ${createError?.message ?? "unknown error"}`);
  }

  const { error: linkInsertError } = await supabase
    .from("guardian_student_links")
    .insert({ guardian_user_id: userId, student_id: created.id });
  if (linkInsertError) {
    throw new Error(`Unable to link student to guardian: ${linkInsertError.message}`);
  }

  cachedStudentProfileId = created.id;
  return cachedStudentProfileId;
}

export function clearCachedStudentProfile(): void {
  cachedStudentProfileId = null;
}

// ---------------------------------------------------------------------------
// Snapshot persistence (whole-state restore; used by usePersistentLearningState)
// ---------------------------------------------------------------------------

export type SupabaseLoadResult = {
  dbStudentId: string;
  state: LearningPersistenceState | null;
};

export async function loadLearningStateFromSupabase(): Promise<SupabaseLoadResult> {
  const supabase = getSupabaseClient();
  const dbStudentId = await getOrCreateActiveStudentProfileId();

  const { data, error } = await supabase
    .from("student_learning_state_snapshots")
    .select("state, schema_version")
    .eq("student_id", dbStudentId)
    .maybeSingle();
  if (error) throw new Error(`Unable to load learning state: ${error.message}`);
  if (!data?.state) return { dbStudentId, state: null };

  const state = data.state as unknown as LearningPersistenceState;
  if (typeof state !== "object" || state === null || !Array.isArray(state.completedLessonIds)) {
    return { dbStudentId, state: null };
  }
  return { dbStudentId, state };
}

export async function saveLearningStateToSupabase(args: {
  dbStudentId: string;
  state: LearningPersistenceState;
}): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("student_learning_state_snapshots").upsert(
    {
      student_id: args.dbStudentId,
      schema_version: LEARNING_PERSISTENCE_SCHEMA_VERSION,
      state: args.state as unknown as Json,
    },
    { onConflict: "student_id" }
  );
  if (error) throw new Error(`Unable to save learning state: ${error.message}`);
}

export async function resetLearningStateInSupabase(dbStudentId: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("student_learning_state_snapshots")
    .delete()
    .eq("student_id", dbStudentId);
  if (error) throw new Error(`Unable to reset learning state: ${error.message}`);
}

// ---------------------------------------------------------------------------
// Normalized event persistence (docs/86) — one method per V8 table
// ---------------------------------------------------------------------------

async function withStudent<T>(
  code: string,
  fn: (studentId: string) => Promise<T>
): Promise<PersistenceResult<T>> {
  try {
    const studentId = await getOrCreateActiveStudentProfileId();
    return persistenceOk(await fn(studentId));
  } catch (error) {
    return persistenceError(code, error);
  }
}

export const supabaseLearningPersistence: LearningPersistenceAdapter = {
  mode: "supabase",

  saveLessonProgress(input: LessonProgressInput) {
    return withStudent<SavedRecord | null>("lesson_progress_save_failed", async (studentId) => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("lesson_progress")
        .upsert(
          {
            student_id: studentId,
            lesson_id: input.lessonId,
            academy: input.academy,
            grade_level: input.gradeLevel,
            subject: input.subject,
            status: input.status,
            completed_section_ids: input.completedSectionIds,
            current_section_id: input.currentSectionId ?? null,
            started_at: input.startedAtIso ?? null,
            completed_at: input.completedAtIso ?? null,
          },
          { onConflict: "student_id,lesson_id" }
        )
        .select("id")
        .single();
      if (error) throw error;
      return data;
    });
  },

  saveQuizAttempt(input: QuizAttemptInput) {
    return withStudent<SavedRecord | null>("quiz_attempt_save_failed", async (studentId) => {
      const supabase = getSupabaseClient();
      const { data: attempt, error: attemptError } = await supabase
        .from("quiz_attempts")
        .insert({
          student_id: studentId,
          lesson_id: input.lessonId,
          score_percent: input.scorePercent,
          points_earned: input.pointsEarned,
          points_possible: input.pointsPossible,
          mastery_band: input.masteryBand,
          auto_scored: input.autoScored ?? true,
          submitted_at: input.submittedAtIso ?? new Date().toISOString(),
        })
        .select("id")
        .single();
      if (attemptError || !attempt) throw attemptError ?? new Error("No attempt row returned");

      if (input.answers.length > 0) {
        const { error: answersError } = await supabase.from("quiz_answers").insert(
          input.answers.map((answer) => ({
            quiz_attempt_id: attempt.id,
            question_id: answer.questionId,
            question_type: answer.questionType,
            student_answer: (answer.studentAnswer ?? null) as Json,
            correct_answer: (answer.correctAnswer ?? null) as Json,
            is_correct: answer.isCorrect ?? null,
            points_earned: answer.pointsEarned,
            points_possible: answer.pointsPossible,
            explanation: answer.explanation ?? null,
            skill_tags: answer.skillTags,
            mistake_type: answer.mistakeType ?? null,
          }))
        );
        if (answersError) throw answersError;
      }
      return attempt;
    });
  },

  saveMasteryRecord(input: MasteryRecordInput) {
    return withStudent<SavedRecord | null>("mastery_record_save_failed", async (studentId) => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("mastery_records")
        .upsert(
          {
            student_id: studentId,
            lesson_id: input.lessonId ?? null,
            subject: input.subject,
            skill_tag: input.skillTag,
            score_percent: input.scorePercent,
            mastery_band: input.masteryBand,
            evidence_source: input.evidenceSource,
            last_evidence_id: input.lastEvidenceId ?? null,
          },
          { onConflict: "student_id,skill_tag" }
        )
        .select("id")
        .single();
      if (error) throw error;
      return data;
    });
  },

  saveMemoryVaultItems(items: MemoryVaultItemInput[]) {
    return withStudent<number>("memory_vault_items_save_failed", async (studentId) => {
      if (items.length === 0) return 0;
      const supabase = getSupabaseClient();
      const { error } = await supabase.from("memory_vault_items").insert(
        items.map((item) => ({
          student_id: studentId,
          lesson_id: item.lessonId,
          skill_id: item.skillId,
          prompt: item.prompt,
          expected_answer: item.expectedAnswer ?? null,
          prompt_type: item.promptType,
          review_stage: item.reviewStage,
          due_at: item.dueAtIso,
          review_interval_days: item.reviewIntervalDays,
          retention_strength: item.retentionStrength ?? "weak",
          status: item.status ?? "scheduled",
        }))
      );
      if (error) throw error;
      return items.length;
    });
  },

  saveMemoryVaultReviewSession(input: MemoryVaultReviewSessionInput) {
    return withStudent<SavedRecord | null>("memory_vault_session_save_failed", async (studentId) => {
      const supabase = getSupabaseClient();
      const confidences = input.answers
        .map((a) => a.confidence)
        .filter((c): c is 1 | 2 | 3 | 4 | 5 => typeof c === "number");
      const { data: session, error: sessionError } = await supabase
        .from("memory_vault_review_sessions")
        .insert({
          student_id: studentId,
          started_at: input.startedAtIso ?? new Date().toISOString(),
          completed_at: input.completedAtIso ?? new Date().toISOString(),
          items_reviewed: input.answers.length,
          correct_count: input.answers.filter((a) => a.isCorrect).length,
          average_confidence:
            confidences.length > 0
              ? confidences.reduce((sum, c) => sum + c, 0) / confidences.length
              : null,
        })
        .select("id")
        .single();
      if (sessionError || !session) throw sessionError ?? new Error("No session row returned");

      if (input.answers.length > 0) {
        const { error: answerError } = await supabase.from("memory_vault_review_answers").insert(
          input.answers.map((answer) => ({
            session_id: session.id,
            memory_vault_item_id: answer.memoryVaultItemId,
            student_answer: answer.studentAnswer ?? null,
            expected_answer: answer.expectedAnswer ?? null,
            is_correct: answer.isCorrect,
            confidence: answer.confidence ?? null,
            feedback: answer.feedback ?? null,
            next_due_at: answer.nextDueAtIso ?? null,
          }))
        );
        if (answerError) throw answerError;
      }
      return session;
    });
  },

  saveMistakeJournalEntry(input: MistakeJournalEntryInput) {
    return withStudent<SavedRecord | null>("mistake_entry_save_failed", async (studentId) => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("mistake_journal_entries")
        .insert({
          student_id: studentId,
          lesson_id: input.lessonId ?? null,
          quiz_attempt_id: input.quizAttemptId ?? null,
          question_id: input.questionId ?? null,
          mistake_type: normalizeMistakeType(input.mistakeType),
          severity: input.severity ?? "medium",
          skill_tags: input.skillTags,
          student_friendly_message: input.studentFriendlyMessage,
          repair_action: input.repairAction ?? null,
        })
        .select("id")
        .single();
      if (error) throw error;
      return data;
    });
  },

  saveReteachPlan(input: ReteachPlanInput) {
    return withStudent<SavedRecord | null>("reteach_plan_save_failed", async (studentId) => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("reteach_plans")
        .insert({
          student_id: studentId,
          lesson_id: input.lessonId,
          source_quiz_attempt_id: input.sourceQuizAttemptId ?? null,
          reason: input.reason,
          reteach_type: input.reteachType,
          status: input.status ?? "assigned",
        })
        .select("id")
        .single();
      if (error) throw error;
      return data;
    });
  },

  saveChallengePlan(input: ChallengePlanInput) {
    return withStudent<SavedRecord | null>("challenge_plan_save_failed", async (studentId) => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("challenge_plans")
        .insert({
          student_id: studentId,
          lesson_id: input.lessonId,
          source_quiz_attempt_id: input.sourceQuizAttemptId ?? null,
          challenge_type: input.challengeType,
          prompt: input.prompt,
          status: input.status ?? "assigned",
        })
        .select("id")
        .single();
      if (error) throw error;
      return data;
    });
  },

  saveProblemSolvingLabEntry(input: ProblemSolvingLabEntryInput) {
    return withStudent<SavedRecord | null>("psl_entry_save_failed", async (studentId) => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("problem_solving_lab_entries")
        .insert({
          student_id: studentId,
          lesson_id: input.lessonId ?? null,
          problem_prompt: input.problemPrompt,
          known_facts: input.knownFacts ?? [],
          unknowns: input.unknowns ?? [],
          smaller_parts: input.smallerParts ?? [],
          strategy: input.strategy ?? null,
          solution_steps: input.solutionSteps ?? [],
          answer_check: input.answerCheck ?? null,
          reflection: input.reflection ?? null,
        })
        .select("id")
        .single();
      if (error) throw error;
      return data;
    });
  },

  saveEvidenceRoomEntry(input: EvidenceRoomEntryInput) {
    return withStudent<SavedRecord | null>("evidence_entry_save_failed", async (studentId) => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("evidence_room_entries")
        .insert({
          student_id: studentId,
          lesson_id: input.lessonId ?? null,
          claim: input.claim,
          selected_evidence: (input.selectedEvidence ?? []) as Json,
          evidence_sort: (input.evidenceSort ?? {}) as Json,
          reasoning: input.reasoning ?? null,
          revision: input.revision ?? null,
        })
        .select("id")
        .single();
      if (error) throw error;
      return data;
    });
  },

  saveInterpretationLensEntry(input: InterpretationLensEntryInput) {
    return withStudent<SavedRecord | null>("lens_entry_save_failed", async (studentId) => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("interpretation_lens_entries")
        .insert({
          student_id: studentId,
          lesson_id: input.lessonId ?? null,
          lens_type: input.lensType,
          source_prompt: input.sourcePrompt,
          observation: input.observation ?? null,
          interpretation: input.interpretation ?? null,
          evidence: input.evidence ?? null,
        })
        .select("id")
        .single();
      if (error) throw error;
      return data;
    });
  },

  saveDiscussionArenaEntry(input: DiscussionArenaEntryInput) {
    return withStudent<SavedRecord | null>("discussion_entry_save_failed", async (studentId) => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("discussion_arena_entries")
        .insert({
          student_id: studentId,
          lesson_id: input.lessonId ?? null,
          prompt: input.prompt,
          sentence_frame: input.sentenceFrame,
          response: input.response,
          safety_status: input.safetyStatus ?? "safe",
        })
        .select("id")
        .single();
      if (error) throw error;
      return data;
    });
  },

  saveLearningPlannerEntry(input: LearningPlannerEntryInput) {
    return withStudent<SavedRecord | null>("planner_entry_save_failed", async (studentId) => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("learning_planner_entries")
        .insert({
          student_id: studentId,
          lesson_id: input.lessonId ?? null,
          task_goal: input.taskGoal,
          first_step: input.firstStep ?? null,
          strategy: input.strategy ?? null,
          done_definition: input.doneDefinition ?? null,
          obstacle: input.obstacle ?? null,
          next_time_change: input.nextTimeChange ?? null,
        })
        .select("id")
        .single();
      if (error) throw error;
      return data;
    });
  },

  saveSystemsMapperEntry(input: SystemsMapperEntryInput) {
    return withStudent<SavedRecord | null>("mapper_entry_save_failed", async (studentId) => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("systems_mapper_entries")
        .insert({
          student_id: studentId,
          lesson_id: input.lessonId ?? null,
          system_name: input.systemName,
          parts: (input.parts ?? []) as Json,
          connections: (input.connections ?? []) as Json,
          cause_effect_notes: input.causeEffectNotes ?? null,
        })
        .select("id")
        .single();
      if (error) throw error;
      return data;
    });
  },

  savePortfolioEvidenceItem(input: PortfolioEvidenceItemInput) {
    return withStudent<SavedRecord | null>("portfolio_item_save_failed", async (studentId) => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("portfolio_evidence_items")
        .insert({
          student_id: studentId,
          lesson_id: input.lessonId ?? null,
          evidence_type: input.evidenceType,
          title: input.title,
          content: (input.content ?? {}) as Json,
          reflection: input.reflection ?? null,
        })
        .select("id")
        .single();
      if (error) throw error;
      return data;
    });
  },
};

/** App enum uses "used_wrong_operation"; DB check constraint uses "wrong_operation". */
const MISTAKE_TYPE_DB_VALUES = new Set([
  "misread_question", "wrong_operation", "forgot_vocabulary", "weak_evidence",
  "skipped_step", "guessed_too_fast", "calculation_error", "misunderstood_concept", "weak_explanation",
]);

export function normalizeMistakeType(appMistakeType: string): string {
  const mapped = appMistakeType === "used_wrong_operation" ? "wrong_operation" : appMistakeType;
  return MISTAKE_TYPE_DB_VALUES.has(mapped) ? mapped : "misunderstood_concept";
}
