import type { GradedAnswer, QuizResult } from "@/types/quiz";
import type { MistakeJournalEntry, MistakePatternSummary, MistakeSeverity, MistakeType } from "@/types/thinkingSystems";

const MAP: Array<[RegExp, MistakeType, string]> = [
  [/misread|question|what is being asked/i, "misread_question", "Misread the question"],
  [/wrong operation|operation|add|subtract|multiply|divide/i, "used_wrong_operation", "Used the wrong operation"],
  [/vocabulary|term|definition|word meaning/i, "forgot_vocabulary", "Forgot vocabulary"],
  [/weak evidence|evidence|proof|claim/i, "weak_evidence", "Weak evidence"],
  [/skipped|step|sequence|order/i, "skipped_step", "Skipped a step"],
  [/guess|quickly|confidence/i, "guessed_too_fast", "Guessed too fast"],
  [/calculation|calculate|compute|arithmetic/i, "calculation_error", "Calculation error"],
  [/misunderstood|concept|main idea|system|ratio|cell|budget/i, "misunderstood_concept", "Misunderstood concept"],
  [/explanation|reasoning|because|why/i, "weak_explanation", "Weak explanation"],
];

const LABELS: Record<MistakeType, string> = {
  misread_question: "Misread the question",
  used_wrong_operation: "Used the wrong operation",
  forgot_vocabulary: "Forgot vocabulary",
  weak_evidence: "Weak evidence",
  skipped_step: "Skipped a step",
  guessed_too_fast: "Guessed too fast",
  calculation_error: "Calculation error",
  misunderstood_concept: "Misunderstood concept",
  weak_explanation: "Weak explanation",
};

export function classifyMistake(answer: GradedAnswer): { type: MistakeType; label: string; severity: MistakeSeverity } {
  const signal = `${answer.question.misconceptionTarget ?? ""} ${answer.feedback ?? ""} ${answer.question.explanation ?? ""} ${answer.question.skillTag ?? ""}`;
  const match = MAP.find(([pattern]) => pattern.test(signal));
  const type = match ? match[1] : fallbackType(answer);
  return { type, label: LABELS[type], severity: getMistakeSeverity(answer) };
}

export function buildMistakeJournalEntries(lessonId: string, result?: QuizResult): MistakeJournalEntry[] {
  if (!result) return [];
  return result.answers
    .filter((answer) => answer.pointsEarned < 0.8)
    .map((answer) => {
      const classified = classifyMistake(answer);
      return {
        id: `${lessonId}-${answer.question.id}-mistake`,
        lessonId,
        questionId: answer.question.id,
        skillTag: answer.question.skillTag,
        mistakeType: classified.type,
        severity: classified.severity,
        studentFriendlyLabel: classified.label,
        evidence: answer.question.misconceptionTarget ?? answer.feedback,
        repairPrompt: getRepairPrompt(classified.type),
        recommendedSystem: getRecommendedSystem(classified.type),
      };
    });
}

export function summarizeMistakePatterns(entries: MistakeJournalEntry[]): MistakePatternSummary {
  if (!entries.length) {
    return {
      totalMistakes: 0,
      severity: "low",
      affectedSkills: [],
      recommendedNextSystems: ["Memory Vault", "Challenge / Enrichment Engine"],
      studentMessage: "No mistake pattern yet. Keep using Memory Vault so the skill stays strong.",
      parentTeacherNote: "No current misconception pattern was detected from this quiz attempt.",
    };
  }

  const counts = entries.reduce<Record<MistakeType, number>>((acc, entry) => {
    acc[entry.mistakeType] = (acc[entry.mistakeType] ?? 0) + 1;
    return acc;
  }, {} as Record<MistakeType, number>);
  const [primaryPattern] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] as [MistakeType, number];
  const affectedSkills = [...new Set(entries.map((entry) => entry.skillTag))];
  const hasHigh = entries.some((entry) => entry.severity === "high");
  const severity: MistakeSeverity = hasHigh || entries.length >= 4 ? "high" : entries.length >= 2 ? "medium" : "low";
  const systems = [...new Set(entries.map((entry) => formatSystem(entry.recommendedSystem)))]

  return {
    totalMistakes: entries.length,
    primaryPattern,
    primaryPatternLabel: LABELS[primaryPattern],
    severity,
    affectedSkills,
    recommendedNextSystems: systems,
    studentMessage: `This is fixable. The main pattern is: ${LABELS[primaryPattern]}. We will repair the exact step instead of guessing again.`,
    parentTeacherNote: `Primary mistake pattern: ${LABELS[primaryPattern]}. Affected skills: ${affectedSkills.join(", ") || "none"}. Recommended support: ${systems.join(", ")}.`,
  };
}

function fallbackType(answer: GradedAnswer): MistakeType {
  if (answer.question.type === "cer") return "weak_evidence";
  if (answer.question.type === "explain") return "weak_explanation";
  if (answer.question.skillTag.toLowerCase().includes("vocab")) return "forgot_vocabulary";
  if (answer.question.skillTag.toLowerCase().includes("calculation")) return "calculation_error";
  return "misunderstood_concept";
}

function getMistakeSeverity(answer: GradedAnswer): MistakeSeverity {
  if (answer.pointsEarned <= 0.1) return "high";
  if (answer.pointsEarned < 0.6) return "medium";
  return "low";
}

function getRepairPrompt(type: MistakeType): string {
  switch (type) {
    case "misread_question": return "Underline what the question is asking, then restate the task in your own words.";
    case "used_wrong_operation": return "Name the known facts, unknown, and operation before solving again.";
    case "weak_evidence": return "Choose stronger proof and explain how it supports your answer.";
    case "skipped_step": return "Rewrite the solution one step at a time and mark where the missing step belongs.";
    case "calculation_error": return "Recalculate slowly and check the answer with the inverse operation or estimate.";
    case "forgot_vocabulary": return "Review the term, give an example, and answer a Memory Vault recall card.";
    case "weak_explanation": return "Use because language and add evidence or a step that proves the answer.";
    case "guessed_too_fast": return "Pause, choose a strategy, and explain why that strategy fits before answering.";
    default: return "Break the question into known facts, unknowns, and a strategy before retrying.";
  }
}

function getRecommendedSystem(type: MistakeType): MistakeJournalEntry["recommendedSystem"] {
  if (type === "weak_evidence" || type === "weak_explanation") return "evidence-room";
  if (type === "skipped_step" || type === "used_wrong_operation" || type === "calculation_error" || type === "misread_question") return "problem-solving-lab";
  if (type === "guessed_too_fast") return "learning-planner";
  if (type === "forgot_vocabulary") return "memory-vault";
  return "reteach";
}

function formatSystem(system: MistakeJournalEntry["recommendedSystem"]): string {
  switch (system) {
    case "problem-solving-lab": return "Problem-Solving Lab";
    case "evidence-room": return "Evidence Room";
    case "learning-planner": return "Learning Planner";
    case "memory-vault": return "Memory Vault";
    default: return "Reteach / Intervention Engine";
  }
}
