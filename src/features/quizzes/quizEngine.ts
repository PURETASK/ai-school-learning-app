import type { QuizQuestion } from "@/types/lesson";
import type { GradedAnswer, QuizResult, SkillBreakdown, StudentAnswer } from "@/types/quiz";

const OPEN_RESPONSE_TYPES = new Set(["short_answer", "explain", "cer", "reflection"]);

export function gradeQuiz(questions: QuizQuestion[], studentAnswers: StudentAnswer[]): QuizResult {
  const answerMap = new Map(studentAnswers.map((answer) => [answer.questionId, answer.answer]));
  const graded = questions.map((question) => gradeQuestion(question, answerMap.get(question.id)));
  const correctCount = graded.filter((item) => item.isCorrect).length;
  const pointsEarned = roundToOneDecimal(graded.reduce((sum, item) => sum + item.pointsEarned, 0));
  const maxPoints = roundToOneDecimal(graded.reduce((sum, item) => sum + item.maxPoints, 0));
  const score = maxPoints === 0 ? 0 : Math.round((pointsEarned / maxPoints) * 100);

  return {
    totalQuestions: questions.length,
    correctCount,
    pointsEarned,
    maxPoints,
    score,
    submittedAt: new Date().toISOString(),
    answers: graded,
    skillBreakdown: buildSkillBreakdown(graded),
  };
}

export function gradeQuestion(question: QuizQuestion, studentAnswer?: string): GradedAnswer {
  const answer = (studentAnswer ?? "").trim();
  const maxPoints = 1;

  if (!answer) {
    return {
      question,
      studentAnswer,
      isCorrect: false,
      isAutoScored: true,
      pointsEarned: 0,
      maxPoints,
      feedback: `No answer yet. ${question.explanation}`,
      nextStep: "reteach",
    };
  }

  const isOpenResponse = OPEN_RESPONSE_TYPES.has(question.type);
  const normalizedAnswer = normalize(answer);
  const normalizedCorrect = normalize(question.correctAnswer);

  if (!isOpenResponse && question.correctAnswer) {
    const isCorrect = normalizedAnswer === normalizedCorrect;
    return {
      question,
      studentAnswer,
      isCorrect,
      isAutoScored: true,
      pointsEarned: isCorrect ? 1 : 0,
      maxPoints,
      feedback: isCorrect
        ? `Correct. ${question.explanation}`
        : `Not yet. Correct answer: ${question.correctAnswer}. ${question.explanation}`,
      nextStep: isCorrect ? "review" : "reteach",
    };
  }

  const heuristicScore = scoreOpenResponse(answer, question);
  const isCorrect = heuristicScore >= 0.8;
  return {
    question,
    studentAnswer,
    isCorrect,
    isAutoScored: false,
    pointsEarned: heuristicScore,
    maxPoints,
    feedback: buildOpenResponseFeedback(heuristicScore, question),
    nextStep: heuristicScore >= 0.8 ? "review" : heuristicScore >= 0.45 ? "teacher_review" : "reteach",
  };
}

function scoreOpenResponse(answer: string, question: QuizQuestion): number {
  const normalizedAnswer = normalize(answer);
  const expected = normalize(`${question.correctAnswer ?? ""} ${question.explanation ?? ""}`);
  const expectedTokens = keywordSet(expected);
  const answerTokens = keywordSet(normalizedAnswer);
  if (!expectedTokens.size) return answer.length >= 20 ? 0.6 : 0.3;

  const overlap = [...expectedTokens].filter((token) => answerTokens.has(token)).length;
  const ratio = overlap / expectedTokens.size;
  if (ratio >= 0.55 && answer.length >= 20) return 1;
  if (ratio >= 0.3 && answer.length >= 15) return 0.6;
  if (answer.length >= 10) return 0.35;
  return 0.15;
}

function buildOpenResponseFeedback(score: number, question: QuizQuestion): string {
  if (score >= 0.8) return `Strong response. ${question.explanation}`;
  if (score >= 0.45) return `Partially developed. Add clearer evidence or steps. ${question.explanation}`;
  return `Needs more reasoning. Try naming the claim, evidence, and reasoning. ${question.explanation}`;
}

function buildSkillBreakdown(graded: GradedAnswer[]): SkillBreakdown[] {
  const grouped = graded.reduce<Record<string, GradedAnswer[]>>((acc, answer) => {
    const skill = answer.question.skillTag || "untagged";
    acc[skill] = [...(acc[skill] ?? []), answer];
    return acc;
  }, {});

  return Object.entries(grouped).map(([skillTag, items]) => {
    const pointsEarned = roundToOneDecimal(items.reduce((sum, item) => sum + item.pointsEarned, 0));
    const maxPoints = roundToOneDecimal(items.reduce((sum, item) => sum + item.maxPoints, 0));
    return {
      skillTag,
      totalQuestions: items.length,
      pointsEarned,
      maxPoints,
      score: maxPoints === 0 ? 0 : Math.round((pointsEarned / maxPoints) * 100),
      weakSignals: items.filter((item) => item.pointsEarned < 0.8).map((item) => item.question.misconceptionTarget ?? item.question.explanation),
    };
  });
}

function keywordSet(value: string): Set<string> {
  const stop = new Set(["the", "and", "for", "with", "that", "this", "are", "was", "were", "from", "into", "your", "you", "can", "because", "answer", "correct"]);
  return new Set(
    value
      .split(/[^a-z0-9]+/i)
      .map((token) => token.trim().toLowerCase())
      .filter((token) => token.length > 3 && !stop.has(token)),
  );
}

function normalize(value?: string): string {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}
