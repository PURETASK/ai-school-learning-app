import type { Lesson } from "@/types/lesson";
import type { ChallengeEnrichmentPlan } from "@/types/thinkingSystems";

export function buildChallengeEnrichmentPlan(lesson: Lesson): ChallengeEnrichmentPlan {
  const [harderProblem, realWorldApplication, creativeTask] = lesson.challengePath.tasks;
  return {
    lessonId: lesson.id,
    trigger: lesson.challengePath.extensionRule,
    harderProblem: harderProblem ?? `Create a harder version of ${lesson.title} with an added constraint.`,
    realWorldApplication: realWorldApplication ?? `Apply ${lesson.title} to a real-world but privacy-safe scenario.`,
    creativeTask: creativeTask ?? `Create a short teaching artifact that explains ${lesson.title}.`,
    multiStepReasoning: `Solve a version of the task that requires at least three reasoning steps and an answer check.`,
    debatePrompt: `Which strategy for ${lesson.title} is strongest? Defend your position with evidence.`,
    researchExtension: `Find or create one additional example related to ${lesson.title} and explain why it fits.`,
    designChallenge: `Design a mini challenge that teaches ${lesson.title} to another student.`,
    crossSubjectChallenge: `Connect ${lesson.title} to another subject and explain the relationship.`,
    estimatedMinutes: 12,
    evidenceToSave: "Save a written explanation, model, code trace, budget table, or project artifact in the Portfolio Evidence System.",
  };
}
