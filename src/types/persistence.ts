import type { MemoryVaultSessionSummary, ScheduledReviewItem } from "./memoryVault";
import type { QuizResult, StudentAnswer } from "./quiz";
import type { MistakeJournalEntry, PortfolioEvidenceItem, LearningPlannerTask } from "./thinkingSystems";

export const LEARNING_PERSISTENCE_SCHEMA_VERSION = 1;

export type PersistenceStorageMode = "local-storage" | "database-ready-adapter";

export type QuizAttemptRecord = {
  id: string;
  studentId: string;
  lessonId: string;
  submittedAtIso: string;
  result: QuizResult;
};

export type PersistedLearningPlannerEntry = LearningPlannerTask & {
  id: string;
  studentId: string;
  status: "assigned" | "in_progress" | "completed";
  createdAtIso: string;
  updatedAtIso: string;
  source: "lesson" | "quiz" | "student";
};

export type PersistedPortfolioEvidenceRecord = PortfolioEvidenceItem & {
  studentId: string;
  status: "prompted" | "drafted" | "submitted" | "reviewed";
  artifactText?: string;
  createdAtIso: string;
  updatedAtIso: string;
  source: "lesson" | "quiz" | "project";
};

export type LearningPersistenceState = {
  schemaVersion: number;
  studentId: string;
  selectedLessonId: string;
  completedLessonIds: string[];
  completedSectionKeysByLesson: Record<string, string[]>;
  draftAnswersByLesson: Record<string, StudentAnswer[]>;
  quizResults: Record<string, QuizResult>;
  quizAttemptHistory: QuizAttemptRecord[];
  memoryVaultItems: ScheduledReviewItem[];
  memoryVaultSessionSummaries: MemoryVaultSessionSummary[];
  mistakeJournalEntries: MistakeJournalEntry[];
  learningPlannerEntries: PersistedLearningPlannerEntry[];
  portfolioEvidenceItems: PersistedPortfolioEvidenceRecord[];
  createdAtIso: string;
  updatedAtIso: string;
};

export type PersistenceHydrationStatus = {
  isHydrated: boolean;
  isSaving: boolean;
  storageMode: PersistenceStorageMode;
  storageKey: string;
  lastSavedAtIso?: string;
  lastLoadedAtIso?: string;
  error?: string;
};

export type PersistenceSnapshotSummary = {
  completedLessons: number;
  quizAttempts: number;
  memoryVaultItems: number;
  memoryVaultSessions: number;
  mistakeJournalEntries: number;
  learningPlannerEntries: number;
  portfolioEvidenceItems: number;
  updatedAtIso: string;
};
