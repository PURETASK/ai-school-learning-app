"use client";

import { isSupabasePersistenceEnabled } from "@/lib/supabase/client";
import { persistenceOk, type LearningPersistenceAdapter } from "@/features/persistence/learningPersistenceAdapter";
import { supabaseLearningPersistence } from "@/features/persistence/supabaseLearningPersistence";

export type PersistenceMode = "local" | "supabase";

export function getPersistenceMode(): PersistenceMode {
  return isSupabasePersistenceEnabled() ? "supabase" : "local";
}

/**
 * Local fallback adapter (V7 behavior).
 * Event-level writes are no-ops because the localStorage snapshot in
 * usePersistentLearningState already captures the full learning state.
 * Methods succeed so calling code behaves identically in both modes.
 */
export const localLearningPersistenceAdapter: LearningPersistenceAdapter = {
  mode: "local",
  saveLessonProgress: async () => persistenceOk(null),
  saveQuizAttempt: async () => persistenceOk(null),
  saveMasteryRecord: async () => persistenceOk(null),
  saveMemoryVaultItems: async (items) => persistenceOk(items.length),
  saveMemoryVaultReviewSession: async () => persistenceOk(null),
  saveMistakeJournalEntry: async () => persistenceOk(null),
  saveReteachPlan: async () => persistenceOk(null),
  saveChallengePlan: async () => persistenceOk(null),
  saveProblemSolvingLabEntry: async () => persistenceOk(null),
  saveEvidenceRoomEntry: async () => persistenceOk(null),
  saveInterpretationLensEntry: async () => persistenceOk(null),
  saveDiscussionArenaEntry: async () => persistenceOk(null),
  saveLearningPlannerEntry: async () => persistenceOk(null),
  saveSystemsMapperEntry: async () => persistenceOk(null),
  savePortfolioEvidenceItem: async () => persistenceOk(null),
};

/** Returns the active adapter based on NEXT_PUBLIC_PERSISTENCE_MODE. */
export function getLearningPersistenceAdapter(): LearningPersistenceAdapter {
  return getPersistenceMode() === "supabase"
    ? supabaseLearningPersistence
    : localLearningPersistenceAdapter;
}
