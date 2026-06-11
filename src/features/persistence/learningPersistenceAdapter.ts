/**
 * V8 persistence adapter contract (docs/86).
 * Both the localStorage fallback and the Supabase adapter implement this shape.
 * All methods return structured results — persistence failures must never
 * crash the learning loop (docs/82 Phase 4, build prompt requirement 6).
 */

export type PersistenceSuccess<T> = { ok: true; data: T };
export type PersistenceFailure = { ok: false; error: { code: string; message: string } };
export type PersistenceResult<T = void> = PersistenceSuccess<T> | PersistenceFailure;

export function persistenceOk<T>(data: T): PersistenceSuccess<T> {
  return { ok: true, data };
}

export function persistenceError(code: string, error: unknown): PersistenceFailure {
  return {
    ok: false,
    error: {
      code,
      message: error instanceof Error ? error.message : String(error),
    },
  };
}

export type LessonProgressInput = {
  lessonId: string;
  academy: string;
  gradeLevel: string;
  subject: string;
  status: "not_started" | "in_progress" | "completed";
  completedSectionIds: string[];
  currentSectionId?: string;
  startedAtIso?: string;
  completedAtIso?: string;
};

export type QuizAnswerInput = {
  questionId: string;
  questionType: string;
  studentAnswer: unknown;
  correctAnswer?: unknown;
  isCorrect?: boolean;
  pointsEarned: number;
  pointsPossible: number;
  explanation?: string;
  skillTags: string[];
  mistakeType?: string;
};

export type QuizAttemptInput = {
  lessonId: string;
  scorePercent: number;
  pointsEarned: number;
  pointsPossible: number;
  masteryBand: string;
  autoScored?: boolean;
  submittedAtIso?: string;
  answers: QuizAnswerInput[];
};

export type MasteryRecordInput = {
  lessonId?: string;
  subject: string;
  skillTag: string;
  scorePercent: number;
  masteryBand: string;
  evidenceSource: "quiz" | "memory_vault" | "project" | "manual_review";
  lastEvidenceId?: string;
};

export type MemoryVaultItemInput = {
  lessonId: string;
  skillId: string;
  prompt: string;
  expectedAnswer?: string;
  promptType: "recall" | "multiple_choice" | "short_answer" | "explain" | "apply";
  reviewStage: "day_1" | "day_3" | "day_7" | "day_14" | "day_30";
  dueAtIso: string;
  reviewIntervalDays: number;
  retentionStrength?: "weak" | "developing" | "strong" | "mastered";
  status?: "scheduled" | "due" | "completed" | "rescheduled";
};

export type MemoryVaultReviewAnswerInput = {
  memoryVaultItemId: string;
  studentAnswer?: string;
  expectedAnswer?: string;
  isCorrect: boolean;
  confidence?: 1 | 2 | 3 | 4 | 5;
  feedback?: string;
  nextDueAtIso?: string;
};

export type MemoryVaultReviewSessionInput = {
  startedAtIso?: string;
  completedAtIso?: string;
  answers: MemoryVaultReviewAnswerInput[];
};

export type MistakeJournalEntryInput = {
  lessonId?: string;
  quizAttemptId?: string;
  questionId?: string;
  mistakeType: string;
  severity?: "low" | "medium" | "high";
  skillTags: string[];
  studentFriendlyMessage: string;
  repairAction?: string;
};

export type ReteachPlanInput = {
  lessonId: string;
  sourceQuizAttemptId?: string;
  reason: string;
  reteachType: string;
  status?: "assigned" | "in_progress" | "completed";
};

export type ChallengePlanInput = {
  lessonId: string;
  sourceQuizAttemptId?: string;
  challengeType: string;
  prompt: string;
  status?: "assigned" | "in_progress" | "completed";
};

export type ProblemSolvingLabEntryInput = {
  lessonId?: string;
  problemPrompt: string;
  knownFacts?: string[];
  unknowns?: string[];
  smallerParts?: string[];
  strategy?: string;
  solutionSteps?: string[];
  answerCheck?: string;
  reflection?: string;
};

export type EvidenceRoomEntryInput = {
  lessonId?: string;
  claim: string;
  selectedEvidence?: unknown[];
  evidenceSort?: Record<string, unknown>;
  reasoning?: string;
  revision?: string;
};

export type InterpretationLensEntryInput = {
  lessonId?: string;
  lensType: "text" | "data" | "history" | "science" | "art" | "media" | "perspective" | "cause_effect";
  sourcePrompt: string;
  observation?: string;
  interpretation?: string;
  evidence?: string;
};

export type DiscussionArenaEntryInput = {
  lessonId?: string;
  prompt: string;
  sentenceFrame: string;
  response: string;
  safetyStatus?: "safe" | "needs_review";
};

export type LearningPlannerEntryInput = {
  lessonId?: string;
  taskGoal: string;
  firstStep?: string;
  strategy?: string;
  doneDefinition?: string;
  obstacle?: string;
  nextTimeChange?: string;
};

export type SystemsMapperEntryInput = {
  lessonId?: string;
  systemName: string;
  parts?: unknown[];
  connections?: unknown[];
  causeEffectNotes?: string;
};

export type PortfolioEvidenceItemInput = {
  lessonId?: string;
  evidenceType:
    | "essay" | "project" | "lab_report" | "capstone"
    | "reflection" | "writing_draft" | "presentation" | "code_project";
  title: string;
  content?: Record<string, unknown>;
  reflection?: string;
};

export type SavedRecord = { id: string };

/** The shared adapter contract for normalized (event-level) persistence. */
export type LearningPersistenceAdapter = {
  readonly mode: "local" | "supabase";
  saveLessonProgress(input: LessonProgressInput): Promise<PersistenceResult<SavedRecord | null>>;
  saveQuizAttempt(input: QuizAttemptInput): Promise<PersistenceResult<SavedRecord | null>>;
  saveMasteryRecord(input: MasteryRecordInput): Promise<PersistenceResult<SavedRecord | null>>;
  saveMemoryVaultItems(items: MemoryVaultItemInput[]): Promise<PersistenceResult<number>>;
  saveMemoryVaultReviewSession(input: MemoryVaultReviewSessionInput): Promise<PersistenceResult<SavedRecord | null>>;
  saveMistakeJournalEntry(input: MistakeJournalEntryInput): Promise<PersistenceResult<SavedRecord | null>>;
  saveReteachPlan(input: ReteachPlanInput): Promise<PersistenceResult<SavedRecord | null>>;
  saveChallengePlan(input: ChallengePlanInput): Promise<PersistenceResult<SavedRecord | null>>;
  saveProblemSolvingLabEntry(input: ProblemSolvingLabEntryInput): Promise<PersistenceResult<SavedRecord | null>>;
  saveEvidenceRoomEntry(input: EvidenceRoomEntryInput): Promise<PersistenceResult<SavedRecord | null>>;
  saveInterpretationLensEntry(input: InterpretationLensEntryInput): Promise<PersistenceResult<SavedRecord | null>>;
  saveDiscussionArenaEntry(input: DiscussionArenaEntryInput): Promise<PersistenceResult<SavedRecord | null>>;
  saveLearningPlannerEntry(input: LearningPlannerEntryInput): Promise<PersistenceResult<SavedRecord | null>>;
  saveSystemsMapperEntry(input: SystemsMapperEntryInput): Promise<PersistenceResult<SavedRecord | null>>;
  savePortfolioEvidenceItem(input: PortfolioEvidenceItemInput): Promise<PersistenceResult<SavedRecord | null>>;
};
