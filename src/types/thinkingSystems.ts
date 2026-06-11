import type { Lesson } from "@/types/lesson";
import type { QuizResult } from "@/types/quiz";

export type ThinkingSystemId =
  | "mistake-journal"
  | "reteach-intervention"
  | "challenge-enrichment"
  | "problem-solving-lab"
  | "evidence-room"
  | "interpretation-lens"
  | "discussion-arena"
  | "learning-planner"
  | "systems-mapper"
  | "portfolio-evidence";

export type ThinkingSystemPriority = "very-high" | "high" | "medium-high" | "medium";
export type ThinkingSystemStatus = "not-started" | "scaffolded" | "interactive-mvp" | "persistent-mvp" | "production-ready";
export type ThinkingSystemActivation = "always" | "after-quiz" | "on-low-mastery" | "on-high-mastery" | "on-demand" | "on-project";

export type MistakeType =
  | "misread_question"
  | "used_wrong_operation"
  | "forgot_vocabulary"
  | "weak_evidence"
  | "skipped_step"
  | "guessed_too_fast"
  | "calculation_error"
  | "misunderstood_concept"
  | "weak_explanation";

export type MistakeSeverity = "low" | "medium" | "high";

export type ThinkingSystemDefinition = {
  id: ThinkingSystemId;
  name: string;
  purpose: string;
  priority: ThinkingSystemPriority;
  activation: ThinkingSystemActivation;
  mvpStatus: ThinkingSystemStatus;
  studentOutcome: string;
  requiredEvidence: string[];
  safetyBoundary: string;
};

export type ThinkingSystemRuntimeStatus = ThinkingSystemDefinition & {
  isAvailable: boolean;
  reason: string;
  nextAction: string;
};

export type MistakeJournalEntry = {
  id: string;
  lessonId: string;
  questionId: string;
  skillTag: string;
  mistakeType: MistakeType;
  severity: MistakeSeverity;
  studentFriendlyLabel: string;
  evidence: string;
  repairPrompt: string;
  recommendedSystem: "reteach" | "problem-solving-lab" | "evidence-room" | "learning-planner" | "memory-vault";
};

export type MistakePatternSummary = {
  totalMistakes: number;
  primaryPattern?: MistakeType;
  primaryPatternLabel?: string;
  severity: MistakeSeverity;
  affectedSkills: string[];
  recommendedNextSystems: string[];
  studentMessage: string;
  parentTeacherNote: string;
};

export type ReteachInterventionPlan = {
  lessonId: string;
  trigger: string;
  simpleExplanation: string;
  visualModel: string;
  workedExample: string;
  vocabularySupport: string[];
  scaffoldSteps: string[];
  smallerPracticeSet: string[];
  misconceptionCorrection: string;
  parentTeacherNote: string;
  exitCriteria: string;
  estimatedMinutes: number;
  activationReason: string;
};

export type ChallengeEnrichmentPlan = {
  lessonId: string;
  trigger: string;
  harderProblem: string;
  realWorldApplication: string;
  creativeTask: string;
  multiStepReasoning: string;
  debatePrompt: string;
  researchExtension: string;
  designChallenge: string;
  crossSubjectChallenge: string;
  estimatedMinutes: number;
  evidenceToSave: string;
};

export type ProblemSolvingLabTask = {
  lessonId: string;
  problem: string;
  knownFacts: string[];
  unknowns: string[];
  smallerParts: string[];
  strategyOptions: string[];
  recommendedStrategy: string;
  solutionSteps: string[];
  answerCheck: string;
  reflectionPrompt: string;
  successCriteria: string[];
};

export type EvidenceRoomTask = {
  lessonId: string;
  claim: string;
  evidenceOptions: Array<{ text: string; strength: "strong" | "weak" | "irrelevant" | "counterargument" }>;
  reasoningPrompt: string;
  revisionPrompt: string;
  successCriteria: string[];
};

export type InterpretationLensType = "text" | "data" | "history" | "science" | "art" | "media" | "perspective" | "cause-and-effect";
export type InterpretationLensTask = {
  lessonId: string;
  lens: InterpretationLensType;
  artifact: string;
  prompts: string[];
  successCriteria: string[];
};

export type DiscussionArenaPrompt = {
  lessonId: string;
  sentenceFrames: string[];
  prompt: string;
  safetyMode: "prompt-only" | "ai-guided" | "teacher-moderated";
  moderationRules: string[];
  successCriteria: string[];
};

export type LearningPlannerTask = {
  lessonId: string;
  task: string;
  firstStep: string;
  strategy: string;
  finishSignal: string;
  obstaclePrompt: string;
  reflectionPrompt: string;
  successCriteria: string[];
};

export type SystemsMapNode = { id: string; label: string; type: "input" | "process" | "output" | "constraint" | "feedback" };
export type SystemsMapLink = { from: string; to: string; relationship: string };
export type SystemsMapperTask = {
  lessonId: string;
  systemName: string;
  nodes: SystemsMapNode[];
  links: SystemsMapLink[];
  changePrompt: string;
  successCriteria: string[];
};

export type PortfolioEvidenceItem = {
  id: string;
  lessonId: string;
  artifactType: "essay" | "project" | "lab_report" | "reflection" | "writing_draft" | "presentation" | "code_project" | "capstone";
  title: string;
  evidencePrompt: string;
  rubricTags: string[];
  parentTeacherFeedbackPrompt: string;
  successCriteria: string[];
};

export type ThinkingSystemsBundle = {
  lesson: Lesson;
  quizResult?: QuizResult;
  systemStatuses: ThinkingSystemRuntimeStatus[];
  mistakeJournalEntries: MistakeJournalEntry[];
  mistakePatternSummary: MistakePatternSummary;
  reteachPlan: ReteachInterventionPlan;
  challengePlan: ChallengeEnrichmentPlan;
  problemSolvingLabTask: ProblemSolvingLabTask;
  evidenceRoomTask: EvidenceRoomTask;
  interpretationLensTask: InterpretationLensTask;
  discussionPrompt: DiscussionArenaPrompt;
  learningPlannerTask: LearningPlannerTask;
  systemsMapperTask: SystemsMapperTask;
  portfolioEvidenceItem: PortfolioEvidenceItem;
};
