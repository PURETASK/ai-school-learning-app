import type { QuizQuestion } from "./lesson";

export type StudentAnswer = {
  questionId: string;
  answer: string;
};

export type SkillBreakdown = {
  skillTag: string;
  totalQuestions: number;
  pointsEarned: number;
  maxPoints: number;
  score: number;
  weakSignals: string[];
};

export type GradedAnswer = {
  question: QuizQuestion;
  studentAnswer?: string;
  isCorrect: boolean;
  isAutoScored: boolean;
  pointsEarned: number;
  maxPoints: number;
  feedback: string;
  nextStep: "review" | "reteach" | "challenge" | "teacher_review";
};

export type QuizResult = {
  totalQuestions: number;
  correctCount: number;
  pointsEarned: number;
  maxPoints: number;
  score: number;
  submittedAt: string;
  answers: GradedAnswer[];
  skillBreakdown: SkillBreakdown[];
};
