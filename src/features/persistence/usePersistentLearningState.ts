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
  const storageKey = useMemo(() => buildStudentPersistenceKey(studentId), [studentId]);
  const initialState = useMemo(() => createInitialLearningPersistenceState({ studentId, lessons }), [studentId, lessons]);
  const [state, rawSetState] = useState<LearningPersistenceState>(initialState);
  const [status, setStatus] = useState<PersistenceHydrationStatus>({
    isHydrated: false,
    isSaving: false,
    storageMode: "local-storage",
    storageKey,
  });
  const didHydrateRef = useRef(false);

  const setState: Dispatch<SetStateAction<LearningPersistenceState>> = useCallback((updater) => {
    rawSetState((current) => {
      const next = typeof updater === "function" ? (updater as (value: LearningPersistenceState) => LearningPersistenceState)(current) : updater;
      return touchLearningPersistenceState(next);
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
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
  }, [initialState, lessons, storageKey]);

  useEffect(() => {
    if (typeof window === "undefined" || !didHydrateRef.current) return;
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
  }, [state, storageKey]);

  const resetPersistence = useCallback(() => {
    if (typeof window !== "undefined") window.localStorage.removeItem(storageKey);
    const resetState = createInitialLearningPersistenceState({ studentId, lessons });
    rawSetState(resetState);
    setStatus((current) => ({
      ...current,
      isHydrated: true,
      lastSavedAtIso: undefined,
      lastLoadedAtIso: new Date().toISOString(),
      error: undefined,
    }));
  }, [lessons, storageKey, studentId]);

  return { state, setState, status, resetPersistence };
}
