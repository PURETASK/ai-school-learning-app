import type { LearningEvent, LearningEventName } from "@/types/analytics";
import type { Lesson } from "@/types/lesson";

export function createLearningEvent(
  name: LearningEventName,
  lesson?: Lesson,
  metadata: LearningEvent["metadata"] = {},
  studentId?: string,
  date = new Date(),
): LearningEvent {
  return {
    name,
    studentId,
    lessonId: lesson?.id,
    academy: lesson?.academy,
    gradeLevel: lesson?.gradeLevel,
    subject: lesson?.subject,
    metadata,
    createdAtIso: date.toISOString(),
  };
}

export function summarizeEvents(events: LearningEvent[]) {
  return events.reduce<Record<string, number>>((acc, event) => {
    acc[event.name] = (acc[event.name] ?? 0) + 1;
    return acc;
  }, {});
}
