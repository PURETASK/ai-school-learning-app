import type { Lesson } from "@/types/lesson";
import type { MistakeJournalEntry, ReteachInterventionPlan } from "@/types/thinkingSystems";

export function buildReteachInterventionPlan(lesson: Lesson, mistakes: MistakeJournalEntry[]): ReteachInterventionPlan {
  const topMistake = mistakes[0]?.studentFriendlyLabel ?? lesson.reteachPath.misconception;
  const affectedSkills = [...new Set(mistakes.map((entry) => entry.skillTag))].slice(0, 3);
  return {
    lessonId: lesson.id,
    trigger: mistakes.length ? `Triggered by ${mistakes.length} mistake signal(s). Main pattern: ${topMistake}.` : "Triggered when mastery is below 80% or student requests support.",
    simpleExplanation: lesson.reteachPath.simpleExplanation,
    visualModel: buildVisualModelInstruction(lesson),
    workedExample: lesson.lessonFlow.workedExample.content ?? "Use the lesson worked example and narrate each step.",
    vocabularySupport: lesson.vocabularyTerms.slice(0, 5).map((term) => `${term.term}: ${term.definition}`),
    scaffoldSteps: normalizeScaffoldSteps(lesson, mistakes),
    smallerPracticeSet: lesson.reteachPath.practice,
    misconceptionCorrection: lesson.reteachPath.misconception,
    parentTeacherNote: mistakes.length
      ? `${lesson.parentTeacherNotes} Reteach focus: ${topMistake}. Affected skill(s): ${affectedSkills.join(", ") || "not yet detected"}.`
      : lesson.parentTeacherNotes,
    exitCriteria: lesson.reteachPath.exitCriteria,
    estimatedMinutes: mistakes.some((entry) => entry.severity === "high") ? 12 : 8,
    activationReason: mistakes.length ? "Mistake Journal detected repairable misconception patterns." : "Preventive support available on demand.",
  };
}

function buildVisualModelInstruction(lesson: Lesson): string {
  const subject = lesson.subject.toLowerCase();
  if (subject.includes("math") || subject.includes("financial")) return `Use a labeled table, number model, or worked numeric example for ${lesson.title}.`;
  if (subject.includes("science")) return `Use a diagram showing parts, relationships, inputs, and outputs for ${lesson.title}.`;
  if (subject.includes("social") || subject.includes("history")) return `Use a timeline, map, or cause/effect chart for ${lesson.title}.`;
  if (subject.includes("computer")) return `Use a step-by-step algorithm trace and bug marker for ${lesson.title}.`;
  return `Use a paragraph frame, evidence chart, or visual organizer for ${lesson.title}.`;
}

function normalizeScaffoldSteps(lesson: Lesson, mistakes: MistakeJournalEntry[]): string[] {
  const base = lesson.reteachPath.steps?.length ? lesson.reteachPath.steps : [
    "Restate the goal in your own words.",
    "Review one worked example.",
    "Try one easier version with hints.",
    "Explain the answer out loud or in writing.",
  ];
  if (!mistakes.length) return base;
  return [
    `Repair focus: ${mistakes[0].studentFriendlyLabel}.`,
    ...base,
    "Complete one exit question without hints.",
  ];
}
