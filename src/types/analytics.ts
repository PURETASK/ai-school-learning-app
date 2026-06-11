export type LearningEventName =
  | "dashboard_viewed"
  | "lesson_started"
  | "lesson_section_completed"
  | "quiz_started"
  | "quiz_submitted"
  | "feedback_viewed"
  | "mastery_band_assigned"
  | "memory_vault_items_scheduled"
  | "parent_dashboard_viewed";

export type LearningEvent = {
  name: LearningEventName;
  studentId?: string;
  lessonId?: string;
  academy?: string;
  gradeLevel?: string;
  subject?: string;
  metadata?: Record<string, string | number | boolean | undefined>;
  createdAtIso: string;
};
