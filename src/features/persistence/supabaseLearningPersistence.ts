"use client";

import type { LearningPersistenceState } from "@/types/persistence";
import { LEARNING_PERSISTENCE_SCHEMA_VERSION } from "@/types/persistence";
import { ensureSupabaseSession, getSupabaseClient } from "@/lib/supabase/client";

/**
 * V8 Supabase persistence adapter (docs/82 Phase 4).
 * Mirrors the localStorage adapter contract: load, save, reset.
 * Stores the whole LearningPersistenceState as a JSONB snapshot in
 * public.student_learning_state_snapshots, keyed by a students row that
 * belongs to the current (anonymous or signed-in) guardian session.
 */

const DEFAULT_STUDENT_NAME = "Demo Student";

async function ensureStudentRow(): Promise<string> {
  const supabase = getSupabaseClient();
  await ensureSupabaseSession();

  const { data: existing, error: selectError } = await supabase
    .from("students")
    .select("id")
    .order("created_at", { ascending: true })
    .limit(1);

  if (selectError) throw new Error(`Unable to look up student: ${selectError.message}`);
  if (existing && existing.length > 0) return existing[0].id as string;

  const { data: created, error: insertError } = await supabase
    .from("students")
    .insert({
      display_name: DEFAULT_STUDENT_NAME,
      guardian_id: (await supabase.auth.getUser()).data.user?.id,
    })
    .select("id")
    .single();

  if (insertError || !created) {
    throw new Error(`Unable to create student: ${insertError?.message ?? "unknown error"}`);
  }
  return created.id as string;
}

export type SupabaseLoadResult = {
  /** Database student row id (uuid) — distinct from the in-app demo studentId. */
  dbStudentId: string;
  /** Parsed snapshot or null if this student has no saved state yet. */
  state: LearningPersistenceState | null;
};

export async function loadLearningStateFromSupabase(): Promise<SupabaseLoadResult> {
  const supabase = getSupabaseClient();
  const dbStudentId = await ensureStudentRow();

  const { data, error } = await supabase
    .from("student_learning_state_snapshots")
    .select("state, schema_version")
    .eq("student_id", dbStudentId)
    .maybeSingle();

  if (error) throw new Error(`Unable to load learning state: ${error.message}`);
  if (!data?.state) return { dbStudentId, state: null };

  const state = data.state as LearningPersistenceState;
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
      state: args.state,
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
