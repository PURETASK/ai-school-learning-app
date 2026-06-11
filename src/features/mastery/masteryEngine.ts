import type { MasteryBand } from "@/types/mastery";
import type { QuizResult } from "@/types/quiz";

export const MASTERY_BANDS: MasteryBand[] = [
  { min: 0, max: 39, label: "Needs Intervention", action: "Assign intervention path" },
  { min: 40, max: 64, label: "Needs Reteach", action: "Assign reteach lesson" },
  { min: 65, max: 79, label: "Almost Mastered", action: "Assign guided practice" },
  { min: 80, max: 89, label: "Mastered", action: "Schedule spaced review" },
  { min: 90, max: 100, label: "Advanced", action: "Unlock challenge task" },
];

export type MasterySummary = {
  score: number;
  band: MasteryBand;
  nextAction: string;
  isReadyForReview: boolean;
  shouldReteach: boolean;
  shouldChallenge: boolean;
};

export type SubjectMasterySummary = {
  subject: string;
  completedLessons: number;
  averageScore?: number;
  bandLabel: string;
};

export function getMasteryBand(score: number): MasteryBand {
  const bounded = Math.max(0, Math.min(100, Math.round(score)));
  return MASTERY_BANDS.find((band) => bounded >= band.min && bounded <= band.max) ?? MASTERY_BANDS[0];
}

export function calculateMasterySummary(score: number): MasterySummary {
  const band = getMasteryBand(score);
  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    band,
    nextAction: band.action,
    isReadyForReview: score >= 80,
    shouldReteach: score < 80,
    shouldChallenge: score >= 90,
  };
}

export function getSubjectMasterySummaries(
  lessonsById: Record<string, { subject: string }>,
  quizResults: Record<string, QuizResult>,
): SubjectMasterySummary[] {
  const grouped = Object.entries(quizResults).reduce<Record<string, number[]>>((acc, [lessonId, result]) => {
    const subject = lessonsById[lessonId]?.subject ?? "Unknown";
    acc[subject] = [...(acc[subject] ?? []), result.score];
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([subject, scores]) => {
      const averageScore = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : undefined;
      return {
        subject,
        completedLessons: scores.length,
        averageScore,
        bandLabel: averageScore === undefined ? "No evidence yet" : getMasteryBand(averageScore).label,
      };
    })
    .sort((a, b) => a.subject.localeCompare(b.subject));
}
