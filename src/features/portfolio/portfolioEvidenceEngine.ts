import type { Lesson } from "@/types/lesson";
import type { PortfolioEvidenceItem } from "@/types/thinkingSystems";

export function createPortfolioEvidenceItem(lesson: Lesson): PortfolioEvidenceItem {
  return {
    id: `${lesson.id}-portfolio-evidence`,
    lessonId: lesson.id,
    artifactType: "reflection",
    title: `${lesson.title} Learning Evidence`,
    evidencePrompt: "Save one piece of work that proves what you learned and one reflection about how you improved.",
    rubricTags: lesson.thinkingSkillTags,
    successCriteria: [
      "Evidence clearly shows the lesson skill in use",
      "Reflection explains what improved and why",
      "Work is the student's own and complete",
    ],
    parentTeacherFeedbackPrompt: "Name one strength, one next step, and one piece of evidence from the student's work.",
  };
}
