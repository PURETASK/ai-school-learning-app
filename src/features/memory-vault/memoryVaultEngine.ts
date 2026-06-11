import type { Lesson } from "@/types/lesson";
import type {
  MemoryVaultReviewAnswer,
  MemoryVaultReviewAttempt,
  MemoryVaultReviewOutcome,
  MemoryVaultSessionSummary,
  RetentionStrength,
  ReviewItemStatus,
  ReviewStage,
  ScheduledReviewItem,
} from "@/types/memoryVault";

export const DEFAULT_MEMORY_VAULT_DAYS = [1, 3, 7, 14, 30];

export function scheduleMemoryVaultItems(lesson: Lesson, studentId: string, baseDate = new Date()): ScheduledReviewItem[] {
  return lesson.memoryVaultItems.flatMap((item) => {
    const days = item.scheduleDays?.length ? item.scheduleDays : DEFAULT_MEMORY_VAULT_DAYS;
    return days.map((day) => ({
      id: `${studentId}-${lesson.id}-${item.id}-D${day}`,
      studentId,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      academy: lesson.academy,
      gradeLevel: lesson.gradeLevel,
      subject: lesson.subject,
      course: lesson.course,
      sourceMemoryVaultItemId: item.id,
      prompt: item.prompt,
      expectedAnswer: item.expectedAnswer,
      skillTag: item.skillTag,
      dueInDays: day,
      dueDateIso: addDays(baseDate, day).toISOString(),
      createdAtIso: baseDate.toISOString(),
      reviewStage: getReviewStage(day),
      status: "scheduled",
      retentionStrength: item.retentionStrengthStart,
      failureAction: item.failureAction,
      successAction: item.successAction,
      accuracyHistory: [],
      confidenceHistory: [],
      reviewHistory: [],
    }));
  });
}

export function getDueMemoryVaultItems(items: ScheduledReviewItem[], date = new Date()): ScheduledReviewItem[] {
  return items
    .filter((item) => new Date(item.dueDateIso).getTime() <= date.getTime() && item.status !== "completed")
    .map((item) => ({ ...item, status: "due" }));
}

export function getReviewableMemoryVaultItems(items: ScheduledReviewItem[], date = new Date(), limit = 8): ScheduledReviewItem[] {
  const due = getDueMemoryVaultItems(items, date);
  if (due.length) return due.slice(0, limit);
  return getUpcomingMemoryVaultItems(items, limit);
}

export function getUpcomingMemoryVaultItems(items: ScheduledReviewItem[], limit = 8): ScheduledReviewItem[] {
  return [...items]
    .filter((item) => item.status === "scheduled" || item.status === "rescheduled")
    .sort((a, b) => new Date(a.dueDateIso).getTime() - new Date(b.dueDateIso).getTime())
    .slice(0, limit);
}

export function groupMemoryVaultItemsBySubject(items: ScheduledReviewItem[]): Array<{ subject: string; count: number }> {
  const grouped = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.subject] = (acc[item.subject] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(grouped).map(([subject, count]) => ({ subject, count })).sort((a, b) => a.subject.localeCompare(b.subject));
}

export function gradeMemoryVaultAnswer(item: ScheduledReviewItem, answer: MemoryVaultReviewAnswer, reviewedAt = new Date()): MemoryVaultReviewOutcome {
  const score = scoreMemoryVaultResponse(answer.answer, item.expectedAnswer);
  const isCorrect = score >= 80;
  const nextRetentionStrength = updateRetentionStrength(item.retentionStrength, score, answer.confidence);
  const shouldRescheduleSoon = !isCorrect || answer.confidence <= 2;
  const nextStatus: ReviewItemStatus = isCorrect ? "completed" : "rescheduled";
  const nextDueDateIso = shouldRescheduleSoon ? addDays(reviewedAt, 1).toISOString() : undefined;

  return {
    itemId: item.id,
    isCorrect,
    score,
    previousRetentionStrength: item.retentionStrength,
    nextRetentionStrength,
    nextStatus,
    nextDueDateIso,
    feedback: buildMemoryVaultFeedback(item, score, answer.confidence),
    action: isCorrect ? item.successAction : item.failureAction,
    confidence: answer.confidence,
  };
}

export function applyMemoryVaultReviewOutcome(
  item: ScheduledReviewItem,
  answer: MemoryVaultReviewAnswer,
  outcome: MemoryVaultReviewOutcome,
  sessionId: string,
): ScheduledReviewItem {
  const attempt: MemoryVaultReviewAttempt = {
    ...outcome,
    sessionId,
    prompt: item.prompt,
    expectedAnswer: item.expectedAnswer,
    studentAnswer: answer.answer,
    reviewedAtIso: answer.answeredAtIso,
    reviewStage: item.reviewStage,
  };

  return {
    ...item,
    status: outcome.nextStatus,
    retentionStrength: outcome.nextRetentionStrength,
    dueDateIso: outcome.nextDueDateIso ?? item.dueDateIso,
    dueInDays: outcome.nextDueDateIso ? 1 : item.dueInDays,
    lastReviewedAtIso: answer.answeredAtIso,
    accuracyHistory: [...(item.accuracyHistory ?? []), outcome.score],
    confidenceHistory: [...(item.confidenceHistory ?? []), outcome.confidence],
    reviewHistory: [...(item.reviewHistory ?? []), attempt],
  };
}

export function applyMemoryVaultReviewSession(args: {
  items: ScheduledReviewItem[];
  answers: MemoryVaultReviewAnswer[];
  allItems: ScheduledReviewItem[];
  sessionId: string;
  reviewedAt?: Date;
}): { updatedItems: ScheduledReviewItem[]; summary: MemoryVaultSessionSummary } {
  const { items, answers, allItems, sessionId, reviewedAt = new Date() } = args;
  const answerMap = new Map(answers.map((answer) => [answer.itemId, answer]));
  const outcomes: MemoryVaultReviewOutcome[] = [];
  const updatedById = new Map<string, ScheduledReviewItem>();

  for (const item of items) {
    const answer = answerMap.get(item.id);
    if (!answer) continue;
    const outcome = gradeMemoryVaultAnswer(item, answer, reviewedAt);
    outcomes.push(outcome);
    updatedById.set(item.id, applyMemoryVaultReviewOutcome(item, answer, outcome, sessionId));
  }

  const updatedItems = allItems.map((item) => updatedById.get(item.id) ?? item);
  const correctCount = outcomes.filter((outcome) => outcome.isCorrect).length;
  const averageScore = outcomes.length ? Math.round(outcomes.reduce((sum, outcome) => sum + outcome.score, 0) / outcomes.length) : 0;

  return {
    updatedItems,
    summary: {
      sessionId,
      reviewedAtIso: reviewedAt.toISOString(),
      totalItems: outcomes.length,
      correctCount,
      averageScore,
      masteredCount: outcomes.filter((outcome) => outcome.nextRetentionStrength === "mastered").length,
      reteachCount: outcomes.filter((outcome) => !outcome.isCorrect).length,
      outcomes,
    },
  };
}

export function scoreMemoryVaultResponse(studentAnswer: string, expectedAnswer: string): number {
  const answerTokens = keywordSet(studentAnswer);
  const expectedTokens = keywordSet(expectedAnswer);
  const cleanAnswer = normalize(studentAnswer);
  const cleanExpected = normalize(expectedAnswer);

  if (!cleanAnswer) return 0;
  if (cleanAnswer === cleanExpected) return 100;
  if (cleanExpected && cleanAnswer.includes(cleanExpected)) return 95;
  if (!expectedTokens.size) return cleanAnswer.length >= 20 ? 70 : 35;

  const overlap = [...expectedTokens].filter((token) => answerTokens.has(token)).length;
  const overlapScore = Math.round((overlap / expectedTokens.size) * 100);
  const lengthBonus = cleanAnswer.length >= 20 ? 10 : cleanAnswer.length >= 10 ? 5 : 0;
  return Math.max(0, Math.min(100, overlapScore + lengthBonus));
}

export function updateRetentionStrength(current: RetentionStrength, score: number, confidence: number): RetentionStrength {
  const index = RETENTION_STRENGTH_ORDER.indexOf(current);
  if (score >= 90 && confidence >= 4) return RETENTION_STRENGTH_ORDER[Math.min(index + 2, RETENTION_STRENGTH_ORDER.length - 1)];
  if (score >= 80 && confidence >= 3) return RETENTION_STRENGTH_ORDER[Math.min(index + 1, RETENTION_STRENGTH_ORDER.length - 1)];
  if (score >= 60) return current;
  return RETENTION_STRENGTH_ORDER[Math.max(index - 1, 0)];
}

export function buildMemoryVaultSessionId(studentId: string, date = new Date()): string {
  return `${studentId}-memory-vault-${date.toISOString().replace(/[:.]/g, "-")}`;
}

function buildMemoryVaultFeedback(item: ScheduledReviewItem, score: number, confidence: number): string {
  if (score >= 90 && confidence >= 4) return `Strong recall. You remembered ${item.skillTag} clearly. Next step: ${item.successAction}`;
  if (score >= 80) return `Correct recall. Your answer matches the key idea. Confidence was ${confidence}/5, so keep this in the review cycle.`;
  if (score >= 50) return `Partially recalled. Compare your answer with: ${item.expectedAnswer}. Next step: ${item.failureAction}`;
  return `Not yet. The key idea is: ${item.expectedAnswer}. Next step: ${item.failureAction}`;
}

function getReviewStage(day: number): ReviewStage {
  if (day === 1) return "day-1";
  if (day === 3) return "day-3";
  if (day === 7) return "day-7";
  if (day === 14) return "day-14";
  if (day === 30) return "day-30";
  return "custom";
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function keywordSet(value: string): Set<string> {
  const stop = new Set(["the", "and", "for", "with", "that", "this", "are", "was", "were", "from", "into", "your", "you", "can", "because", "answer", "correct", "should", "about"]);
  return new Set(
    normalize(value)
      .split(/[^a-z0-9]+/i)
      .map((token) => token.trim().toLowerCase())
      .filter((token) => token.length > 3 && !stop.has(token)),
  );
}

function normalize(value?: string): string {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

const RETENTION_STRENGTH_ORDER: RetentionStrength[] = ["weak", "developing", "strong", "mastered"];
