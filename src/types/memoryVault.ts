export type ReviewStage = "day-1" | "day-3" | "day-7" | "day-14" | "day-30" | "custom";

export type ReviewItemStatus = "scheduled" | "due" | "completed" | "missed" | "rescheduled";

export type RetentionStrength = "weak" | "developing" | "strong" | "mastered";

export type MemoryVaultPromptType = "recall" | "multiple_choice" | "short_answer" | "explain" | "apply";

export type MemoryVaultReviewAnswer = {
  itemId: string;
  answer: string;
  confidence: 1 | 2 | 3 | 4 | 5;
  answeredAtIso: string;
};

export type MemoryVaultReviewOutcome = {
  itemId: string;
  isCorrect: boolean;
  score: number;
  previousRetentionStrength: RetentionStrength;
  nextRetentionStrength: RetentionStrength;
  nextStatus: ReviewItemStatus;
  nextDueDateIso?: string;
  feedback: string;
  action: string;
  confidence: 1 | 2 | 3 | 4 | 5;
};

export type MemoryVaultReviewAttempt = MemoryVaultReviewOutcome & {
  sessionId: string;
  prompt: string;
  expectedAnswer: string;
  studentAnswer: string;
  reviewedAtIso: string;
  reviewStage: ReviewStage;
};

export type MemoryVaultSessionSummary = {
  sessionId: string;
  reviewedAtIso: string;
  totalItems: number;
  correctCount: number;
  averageScore: number;
  masteredCount: number;
  reteachCount: number;
  outcomes: MemoryVaultReviewOutcome[];
};

export type ScheduledReviewItem = {
  id: string;
  studentId: string;
  lessonId: string;
  lessonTitle: string;
  academy: string;
  gradeLevel: string;
  subject: string;
  course: string;
  sourceMemoryVaultItemId: string;
  prompt: string;
  expectedAnswer: string;
  skillTag: string;
  dueInDays: number;
  dueDateIso: string;
  createdAtIso: string;
  reviewStage: ReviewStage;
  status: ReviewItemStatus;
  retentionStrength: RetentionStrength;
  failureAction: string;
  successAction: string;
  lastReviewedAtIso?: string;
  accuracyHistory?: number[];
  confidenceHistory?: number[];
  reviewHistory?: MemoryVaultReviewAttempt[];
};
