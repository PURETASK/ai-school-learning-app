import type { QuizResult } from "./quiz";
import type { ScheduledReviewItem } from "./memoryVault";

export type LessonProgressStatus = "not_started" | "in_progress" | "completed" | "needs_reteach" | "review_scheduled";

export type LessonProgressRecord = {
  lessonId: string;
  status: LessonProgressStatus;
  completedSectionKeys: string[];
  quizResult?: QuizResult;
  memoryVaultItems: ScheduledReviewItem[];
  updatedAtIso: string;
};

export type SubjectProgressSummary = {
  subject: string;
  totalLessons: number;
  completedLessons: number;
  completionPercent: number;
  averageScore?: number;
  weakSkillSignals: string[];
  memoryVaultCount: number;
};

export type StudentProgressSnapshot = {
  studentId: string;
  completedLessonCount: number;
  totalLessonCount: number;
  averageMasteryScore?: number;
  subjectSummaries: SubjectProgressSummary[];
  dueReviewCount: number;
  upcomingReviewCount: number;
  generatedAtIso: string;
};
