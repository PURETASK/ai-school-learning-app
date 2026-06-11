import type { Lesson } from "@/types/lesson";
import type { LearningPersistenceState, PersistenceSnapshotSummary } from "@/types/persistence";
import { LEARNING_PERSISTENCE_SCHEMA_VERSION } from "@/types/persistence";

export function createInitialLearningPersistenceState(args: {
  studentId: string;
  lessons: Lesson[];
  now?: Date;
}): LearningPersistenceState {
  const { studentId, lessons, now = new Date() } = args;
  const iso = now.toISOString();
  return {
    schemaVersion: LEARNING_PERSISTENCE_SCHEMA_VERSION,
    studentId,
    selectedLessonId: lessons[0]?.id ?? "",
    completedLessonIds: [],
    completedSectionKeysByLesson: {},
    draftAnswersByLesson: {},
    quizResults: {},
    quizAttemptHistory: [],
    memoryVaultItems: [],
    memoryVaultSessionSummaries: [],
    mistakeJournalEntries: [],
    learningPlannerEntries: [],
    portfolioEvidenceItems: [],
    createdAtIso: iso,
    updatedAtIso: iso,
  };
}

export function mergePersistedLearningState(args: {
  initial: LearningPersistenceState;
  persisted?: Partial<LearningPersistenceState> | null;
  lessons: Lesson[];
  now?: Date;
}): LearningPersistenceState {
  const { initial, persisted, lessons, now = new Date() } = args;
  if (!persisted || persisted.studentId !== initial.studentId) return initial;
  const knownLessonIds = new Set(lessons.map((lesson) => lesson.id));
  const selectedLessonId = persisted.selectedLessonId && knownLessonIds.has(persisted.selectedLessonId)
    ? persisted.selectedLessonId
    : initial.selectedLessonId;

  const completedLessonIds = uniqueStrings(persisted.completedLessonIds ?? []).filter((lessonId) => knownLessonIds.has(lessonId));
  const completedSectionKeysByLesson = Object.fromEntries(
    Object.entries(persisted.completedSectionKeysByLesson ?? {})
      .filter(([lessonId]) => knownLessonIds.has(lessonId))
      .map(([lessonId, keys]) => [lessonId, uniqueStrings(keys)]),
  );
  const draftAnswersByLesson = Object.fromEntries(
    Object.entries(persisted.draftAnswersByLesson ?? {})
      .filter(([lessonId]) => knownLessonIds.has(lessonId))
      .map(([lessonId, answers]) => [lessonId, Array.isArray(answers) ? answers : []]),
  );

  return {
    ...initial,
    ...persisted,
    schemaVersion: LEARNING_PERSISTENCE_SCHEMA_VERSION,
    selectedLessonId,
    completedLessonIds,
    completedSectionKeysByLesson,
    draftAnswersByLesson,
    quizResults: persisted.quizResults ?? {},
    quizAttemptHistory: persisted.quizAttemptHistory ?? [],
    memoryVaultItems: persisted.memoryVaultItems ?? [],
    memoryVaultSessionSummaries: persisted.memoryVaultSessionSummaries ?? [],
    mistakeJournalEntries: persisted.mistakeJournalEntries ?? [],
    learningPlannerEntries: persisted.learningPlannerEntries ?? [],
    portfolioEvidenceItems: persisted.portfolioEvidenceItems ?? [],
    createdAtIso: persisted.createdAtIso ?? initial.createdAtIso,
    updatedAtIso: persisted.updatedAtIso ?? now.toISOString(),
  };
}

export function safeParseLearningPersistenceState(raw: string | null): Partial<LearningPersistenceState> | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<LearningPersistenceState>;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function buildPersistenceSnapshotSummary(state: LearningPersistenceState): PersistenceSnapshotSummary {
  return {
    completedLessons: state.completedLessonIds.length,
    quizAttempts: state.quizAttemptHistory.length,
    memoryVaultItems: state.memoryVaultItems.length,
    memoryVaultSessions: state.memoryVaultSessionSummaries.length,
    mistakeJournalEntries: state.mistakeJournalEntries.length,
    learningPlannerEntries: state.learningPlannerEntries.length,
    portfolioEvidenceItems: state.portfolioEvidenceItems.length,
    updatedAtIso: state.updatedAtIso,
  };
}

export function touchLearningPersistenceState(state: LearningPersistenceState, now = new Date()): LearningPersistenceState {
  return { ...state, updatedAtIso: now.toISOString() };
}

function uniqueStrings(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return [...new Set(values.filter((value): value is string => typeof value === "string" && value.trim().length > 0))];
}
