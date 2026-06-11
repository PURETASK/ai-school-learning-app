import type { Lesson } from "@/types/lesson";
import type { ScheduledReviewItem } from "@/types/memoryVault";
import type { QuizResult } from "@/types/quiz";
import type { StudentProgressSnapshot, SubjectProgressSummary } from "@/types/progress";
import { getDueMemoryVaultItems, getUpcomingMemoryVaultItems } from "@/features/memory-vault/memoryVaultEngine";

export function buildStudentProgressSnapshot(args: {
  studentId: string;
  lessons: Lesson[];
  completedLessonIds: string[];
  quizResults: Record<string, QuizResult>;
  memoryVaultItems: ScheduledReviewItem[];
  date?: Date;
}): StudentProgressSnapshot {
  const { studentId, lessons, completedLessonIds, quizResults, memoryVaultItems, date = new Date() } = args;
  const scoredResults = Object.values(quizResults);
  const averageMasteryScore = scoredResults.length
    ? Math.round(scoredResults.reduce((sum, result) => sum + result.score, 0) / scoredResults.length)
    : undefined;

  return {
    studentId,
    completedLessonCount: completedLessonIds.length,
    totalLessonCount: lessons.length,
    averageMasteryScore,
    subjectSummaries: buildSubjectProgressSummaries(lessons, completedLessonIds, quizResults, memoryVaultItems),
    dueReviewCount: getDueMemoryVaultItems(memoryVaultItems, date).length,
    upcomingReviewCount: getUpcomingMemoryVaultItems(memoryVaultItems, 1000).length,
    generatedAtIso: date.toISOString(),
  };
}

export function buildSubjectProgressSummaries(
  lessons: Lesson[],
  completedLessonIds: string[],
  quizResults: Record<string, QuizResult>,
  memoryVaultItems: ScheduledReviewItem[],
): SubjectProgressSummary[] {
  const buckets = lessons.reduce<Record<string, SubjectProgressSummary & { scores: number[] }>>((acc, lesson) => {
    const bucket = acc[lesson.subject] ?? {
      subject: lesson.subject,
      totalLessons: 0,
      completedLessons: 0,
      completionPercent: 0,
      averageScore: undefined,
      weakSkillSignals: [],
      memoryVaultCount: 0,
      scores: [],
    };
    bucket.totalLessons += 1;
    if (completedLessonIds.includes(lesson.id)) bucket.completedLessons += 1;
    const result = quizResults[lesson.id];
    if (result) {
      bucket.scores.push(result.score);
      bucket.weakSkillSignals.push(
        ...result.skillBreakdown.filter((skill) => skill.score < 80).map((skill) => `${skill.skillTag}: ${skill.score}%`),
      );
    }
    acc[lesson.subject] = bucket;
    return acc;
  }, {});

  for (const item of memoryVaultItems) {
    if (buckets[item.subject]) buckets[item.subject].memoryVaultCount += 1;
  }

  return Object.values(buckets).map(({ scores, ...bucket }) => ({
    ...bucket,
    completionPercent: bucket.totalLessons ? Math.round((bucket.completedLessons / bucket.totalLessons) * 100) : 0,
    averageScore: scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : undefined,
    weakSkillSignals: bucket.weakSkillSignals.slice(0, 5),
  })).sort((a, b) => a.subject.localeCompare(b.subject));
}
