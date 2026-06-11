export type Academy = "foundation" | "bridge" | "scholar";

export type VocabularyTerm = {
  term: string;
  definition: string;
};

export type LessonFlowSection = {
  time?: string;
  content?: string;
  studentAction?: string;
  teacherOrAppAction?: string;
  successCriteria?: string[];
  cognitiveLoadNotes?: string;
  [key: string]: unknown;
};

export type LessonFlow = {
  hook: LessonFlowSection;
  learningGoal: LessonFlowSection;
  miniTeach: LessonFlowSection;
  firstPrinciplesBreakdown: LessonFlowSection;
  workedExample: LessonFlowSection;
  guidedPractice: LessonFlowSection;
  criticalThinkingCheckpoint: LessonFlowSection;
  evidenceBasedReasoningTask: LessonFlowSection;
  interpretationOrDiscussionTask: LessonFlowSection;
  activePractice: LessonFlowSection;
  retrievalCheck: LessonFlowSection;
  feedback: LessonFlowSection;
  reflection: LessonFlowSection;
};

export type QuizQuestion = {
  id: string;
  type: "mc" | "short_answer" | "explain" | "cer" | string;
  question: string;
  choices?: string[];
  correctAnswer?: string;
  explanation: string;
  skillTag: string;
  difficulty: "easy" | "medium" | "hard" | string;
  scoringNotes?: string;
  misconceptionTarget?: string;
};

export type RetrievalPrompt = {
  id: string;
  prompt: string;
  expectedAnswer: string;
  feedbackIfMissed: string;
};

export type MemoryVaultItem = {
  id: string;
  type: "concept" | "vocabulary" | "application" | "explain" | string;
  prompt: string;
  expectedAnswer: string;
  scheduleDays: number[];
  skillTag: string;
  retentionStrengthStart: "weak" | "developing" | "strong" | "mastered";
  failureAction: string;
  successAction: string;
};

export type ReteachPath = {
  misconception: string;
  simpleExplanation: string;
  steps: string[];
  practice: string[];
  exitCriteria: string;
};

export type ChallengePath = {
  tasks: string[];
  extensionRule: string;
};

export type MasteryConfig = {
  bands: Record<string, string>;
  weights: Record<string, number>;
  masteryThreshold: number;
  advancedThreshold: number;
  minimumEvidence: string[];
};

export type Lesson = {
  schemaVersion: string;
  id: string;
  title: string;
  academy: Academy;
  academyName: string;
  gradeLevel: string;
  subject: string;
  course: string;
  unit: string;
  lessonType: string[];
  estimatedMinutes: string;
  developmentNotes: string;
  learningObjective: string;
  essentialQuestion: string;
  standardsTags: string[];
  thinkingSkillTags: string[];
  vocabularyTerms: VocabularyTerm[];
  prerequisites: string[];
  lessonFlow: LessonFlow;
  quiz: QuizQuestion[];
  retrievalCheck: RetrievalPrompt[];
  memoryVaultItems: MemoryVaultItem[];
  reteachPath: ReteachPath;
  challengePath: ChallengePath;
  mastery: MasteryConfig;
  parentTeacherNotes: string;
  accessibilityNotes: string[];
  safetyNotes: string[];
  implementationNotes: string[];
  reviewStatus: Record<string, unknown>;
};
