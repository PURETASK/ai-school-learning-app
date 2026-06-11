import { calculateMasterySummary } from "@/features/mastery/masteryEngine";
import type { Lesson } from "@/types/lesson";
import type { QuizResult } from "@/types/quiz";

export type FeedbackPlan = {
  summary: string;
  nextAction: string;
  strengths: string[];
  weakSkills: string[];
  reteachRecommendation?: string;
  challengeRecommendation?: string;
  parentSupportNote: string;
};

export function getFeedbackSummary(scoreOrResult: number | QuizResult): string {
  const score = typeof scoreOrResult === "number" ? scoreOrResult : scoreOrResult.score;
  const band = calculateMasterySummary(score).band;
  if (band.label === "Advanced") return "Excellent. Move into the challenge path and keep this skill in spaced review.";
  if (band.label === "Mastered") return "Mastered for now. Add the skill to Memory Vault so it sticks long-term.";
  if (band.label === "Almost Mastered") return "Close. Complete guided practice before moving on.";
  if (band.label === "Needs Reteach") return "Reteach needed. Return to the worked example and simpler practice.";
  return "Intervention needed. Break the skill into smaller parts with direct support.";
}

export function buildFeedbackPlan(lesson: Lesson, result: QuizResult): FeedbackPlan {
  const mastery = calculateMasterySummary(result.score);
  const weakSkillBreakdowns = result.skillBreakdown.filter((skill) => skill.score < 80);
  const strongSkillBreakdowns = result.skillBreakdown.filter((skill) => skill.score >= 80);

  return {
    summary: getFeedbackSummary(result),
    nextAction: mastery.nextAction,
    strengths: strongSkillBreakdowns.length
      ? strongSkillBreakdowns.map((skill) => `${skill.skillTag}: ${skill.score}%`)
      : ["Complete another lesson to build a stronger evidence profile."],
    weakSkills: weakSkillBreakdowns.flatMap((skill) => skill.weakSignals.length ? skill.weakSignals.slice(0, 2) : [`${skill.skillTag}: needs more evidence.`]).slice(0, 5),
    reteachRecommendation: mastery.shouldReteach ? lesson.reteachPath.simpleExplanation : undefined,
    challengeRecommendation: mastery.shouldChallenge ? lesson.challengePath.tasks[0] : undefined,
    parentSupportNote: mastery.shouldReteach
      ? "Review the worked example together, then ask the student to explain each step aloud."
      : "Ask the student to teach the concept back in their own words during the next Memory Vault review.",
  };
}
