"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Lesson } from "@/types/lesson";
import type { LearningPersistenceState, PersistenceHydrationStatus } from "@/types/persistence";
import { buildStudentPersistenceKey } from "@/features/persistence/persistenceKeys";
import {
  createInitialLearningPersistenceState,
  mergePersistedLearningState,
  safeParseLearningPersistenceState,
  touchLearningPersistenceState,
} from "@/features/persistence/localLearningPersistence";
import { isSupabasePersistenceEnabled } from "@/lib/supabase/client";
import {
  loadLearningStateFromSupabase,
  resetLearningStateInSupabase,
  saveLearningStateToSupabase,
} from "@/features/persistence/supabaseLearningPersistence";

const SAVE_DEBOUNCE_MS = 800;

export function usePersistentLearningState(args: {
  studentId: string;
  lessons: Lesson[];
}): {
  state: LearningPersistenceState;
  setState: Dispatch<SetStateAction<LearningPersistenceState>>;
  status: PersistenceHydrationStatus;
  resetPersistence: () => void;
} {
  const { studentId, lessons } = args;
  const supabaseMode = isSupabasePersistenceEnabled();
  const storageKey = useMemo(() => buildStudentPersistenceKey(studentId), [studentId]);
  const initialState = useMemo(
    () => createInitialLearningPersistenceState({ studentId, lessons }),
    [studentId, lessons]
  );
  const [state, rawSetState] = useState<LearningPersistenceState>(initialState);
  const [status, setStatus] = useState<PersistenceHydrationStatus>({
    isHydrated: false,
    isSaving: false,
    storageMode: supabaseMode ? "supabase" : "local-storage",
    storageKey: supabaseMode ? "supabase:student_learning_state_snapshots" : storageKey,
  });
  const didHydrateRef = useRef(false);
  const dbStudentIdRef = useRef<string | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setState: Dispatch<SetStateAction<LearningPersistenceState>> = useCallback((updater) => {
    rawSetState((current) => {
      const next =
        typeof updater === "function"
          ? (updater as (value: LearningPersistenceState) => LearningPersistenceState)(current)
          : updater;
      return touchLearningPersistenceState(next);
    });
  }, []);

  // ---- Hydration (load once) ----
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!supabaseMode) {
      const raw = window.localStorage.getItem(storageKey);
      const parsed = safeParseLearningPersistenceState(raw);
      const nextState = mergePersistedLearningState({ initial: initialState, persisted: parsed, lessons });
      rawSetState(nextState);
      didHydrateRef.current = true;
      setStatus((current) => ({
        ...current,
        isHydrated: true,
        storageKey,
        lastLoadedAtIso: new Date().toISOString(),
        error: undefined,
      }));
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const { dbStudentId, state: persisted } = await loadLearningStateFromSupabase();
        if (cancelled) return;
        dbStudentIdRef.current = dbStudentId;
        const nextState = mergePersistedLearningState({ initial: initialState, persisted, lessons });
        rawSetState(nextState);
        didHydrateRef.current = true;
        setStatus((current) => ({
          ...current,
          isHydrated: true,
          lastLoadedAtIso: new Date().toISOString(),
          error: undefined,
        }));
      } catch (error) {
        if (cancelled) return;
        didHydrateRef.current = true;
        setStatus((current) => ({
          ...current,
          isHydrated: true,
          lastLoadedAtIso: new Date().toISOString(),
          error: error instanceof Error ? error.message : "Unable to load learning state from Supabase.",
        }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialState, lessons, storageKey, supabaseMode]);

  // ---- Persistence (save on change) ----
  useEffect(() => {
    if (typeof window === "undefined" || !didHydrateRef.current) return;

    if (!supabaseMode) {
      try {
        setStatus((current) => ({ ...current, isSaving: true, error: undefined }));
        window.localStorage.setItem(storageKey, JSON.stringify(state));
        setStatus((current) => ({
          ...current,
          isSaving: false,
          isHydrated: true,
          storageKey,
          lastSavedAtIso: new Date().toISOString(),
        }));
      } catch (error) {
        setStatus((current) => ({
          ...current,
          isSaving: false,
          error: error instanceof Error ? error.message : "Unable to save learning state.",
        }));
      }
      return;
    }

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setStatus((current) => ({ ...current, isSaving: true, error: undefined }));
    saveTimerRef.current = setTimeout(async () => {
      const dbStudentId = dbStudentIdRef.current;
      if (!dbStudentId) return;
      try {
        await saveLearningStateToSupabase({ dbStudentId, state });
        setStatus((current) => ({
          ...current,
          isSaving: false,
          lastSavedAtIso: new Date().toISOString(),
          error: undefined,
        }));
      } catch (error) {
        setStatus((current) => ({
          ...current,
          isSaving: false,
          error: error instanceof Error ? error.message : "Unable to save learning state to Supabase.",
        }));
      }
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [state, storageKey, supabaseMode]);

  const resetPersistence = useCallback(() => {
    if (typeof window !== "undefined" && !supabaseMode) {
      window.localStorage.removeItem(storageKey);
    }
    if (supabaseMode && dbStudentIdRef.current) {
      void resetLearningStateInSupabase(dbStudentIdRef.current).catch(() => {
        /* non-fatal: error surfaces on next save */
      });
    }
    const resetState = createInitialLearningPersistenceState({ studentId, lessons });
    rawSetState(resetState);
    setStatus((current) => ({
      ...current,
      isHydrated: true,
      lastSavedAtIso: undefined,
      lastLoadedAtIso: new Date().toISOString(),
      error: undefined,
    }));
  }, [lessons, storageKey, studentId, supabaseMode]);

  return { state, setState, status, resetPersistence };
}
