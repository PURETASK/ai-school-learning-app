import type { Lesson } from "@/types/lesson";
import type { QuizResult } from "@/types/quiz";
import type { ThinkingSystemDefinition, ThinkingSystemRuntimeStatus, ThinkingSystemsBundle } from "@/types/thinkingSystems";
import { getMasteryBand } from "@/features/mastery/masteryEngine";
import { buildMistakeJournalEntries, summarizeMistakePatterns } from "@/features/mistake-journal/mistakeJournalEngine";
import { buildReteachInterventionPlan } from "@/features/reteach/reteachInterventionEngine";
import { buildChallengeEnrichmentPlan } from "@/features/challenge/challengeEnrichmentEngine";

export const THINKING_SYSTEM_DEFINITIONS: ThinkingSystemDefinition[] = [
  { id: "mistake-journal", name: "Mistake Journal", purpose: "Turn wrong answers into mistake patterns and repair prompts.", priority: "very-high", activation: "after-quiz", mvpStatus: "interactive-mvp", studentOutcome: "I can see what kind of mistake I made and how to repair it.", requiredEvidence: ["Quiz result", "Graded answers", "Skill tags"], safetyBoundary: "Mistakes are framed as repairable patterns, never personal labels." },
  { id: "reteach-intervention", name: "Reteach and Intervention Engine", purpose: "Assign smaller explanations and guided practice when mastery is weak.", priority: "very-high", activation: "on-low-mastery", mvpStatus: "interactive-mvp", studentOutcome: "I receive a simpler path when I am not ready yet.", requiredEvidence: ["Mastery score", "Mistake pattern", "Reteach path"], safetyBoundary: "Use neutral language: not yet, repair, practice; avoid shame labels." },
  { id: "challenge-enrichment", name: "Challenge and Enrichment Engine", purpose: "Give deeper application tasks when mastery is strong.", priority: "high", activation: "on-high-mastery", mvpStatus: "interactive-mvp", studentOutcome: "I can stretch the skill into real-world or cross-subject use.", requiredEvidence: ["Mastery score", "Challenge path"], safetyBoundary: "Do not punish students who need reteach by hiding normal progress." },
  { id: "problem-solving-lab", name: "Problem-Solving Lab", purpose: "Practice first-principles decomposition and step-by-step reasoning.", priority: "very-high", activation: "always", mvpStatus: "interactive-mvp", studentOutcome: "I can break an unfamiliar task into knowns, unknowns, strategy, solution, and check.", requiredEvidence: ["Lesson objective", "Essential question", "Thinking tags"], safetyBoundary: "Use age-appropriate scenarios and no sensitive personal prompts." },
  { id: "evidence-room", name: "Evidence Room", purpose: "Train Claim → Evidence → Reasoning and evidence quality sorting.", priority: "high", activation: "always", mvpStatus: "interactive-mvp", studentOutcome: "I can support an answer with stronger proof.", requiredEvidence: ["Claim", "Evidence options", "Reasoning prompt"], safetyBoundary: "Avoid adversarial argument; keep prompts academic and age-safe." },
  { id: "interpretation-lens", name: "Interpretation Lens", purpose: "Analyze meaning, context, data, perspective, symbols, and cause/effect.", priority: "medium-high", activation: "always", mvpStatus: "interactive-mvp", studentOutcome: "I can look beneath the surface and explain meaning or pattern.", requiredEvidence: ["Artifact", "Lens", "Prompts"], safetyBoundary: "Do not ask for sensitive personal disclosures." },
  { id: "discussion-arena", name: "Discussion Arena", purpose: "Practice safe structured academic dialogue without public chat.", priority: "medium", activation: "on-demand", mvpStatus: "interactive-mvp", studentOutcome: "I can use sentence frames to explain, agree, disagree, and revise thinking.", requiredEvidence: ["Prompt", "Sentence frames"], safetyBoundary: "MVP is prompt-only; no public student chat or random direct messages." },
  { id: "learning-planner", name: "Learning Planner", purpose: "Help students plan, start, monitor, finish, and reflect.", priority: "high", activation: "always", mvpStatus: "interactive-mvp", studentOutcome: "I can plan my first step and name what success looks like.", requiredEvidence: ["Task", "First step", "Strategy", "Finish signal"], safetyBoundary: "No sensitive scheduling or location data required." },
  { id: "systems-mapper", name: "Systems Mapper", purpose: "Teach connected thinking: parts, relationships, feedback, and consequences.", priority: "medium", activation: "on-demand", mvpStatus: "interactive-mvp", studentOutcome: "I can map parts of a concept and explain what changes when a part changes.", requiredEvidence: ["Nodes", "Links", "Change prompt"], safetyBoundary: "Use school-safe systems and avoid private family/health details." },
  { id: "portfolio-evidence", name: "Portfolio / Project Evidence System", purpose: "Save proof of learning for projects, drafts, reflections, code, and capstones.", priority: "medium-high", activation: "on-project", mvpStatus: "scaffolded", studentOutcome: "I can save evidence that proves growth and receive parent/teacher feedback later.", requiredEvidence: ["Artifact prompt", "Rubric tags"], safetyBoundary: "No public posting; evidence is private to student/guardian/teacher role scopes." },
];

export function buildThinkingSystemsBundle(lesson: Lesson, result?: QuizResult): ThinkingSystemsBundle {
  const mistakes = buildMistakeJournalEntries(lesson.id, result);
  const mistakePatternSummary = summarizeMistakePatterns(mistakes);
  return {
    lesson,
    quizResult: result,
    systemStatuses: buildThinkingSystemStatuses(result),
    mistakeJournalEntries: mistakes,
    mistakePatternSummary,
    reteachPlan: buildReteachInterventionPlan(lesson, mistakes),
    challengePlan: buildChallengeEnrichmentPlan(lesson),
    problemSolvingLabTask: buildProblemSolvingLabTask(lesson),
    evidenceRoomTask: buildEvidenceRoomTask(lesson),
    interpretationLensTask: buildInterpretationLensTask(lesson),
    discussionPrompt: buildDiscussionPrompt(lesson),
    learningPlannerTask: buildLearningPlannerTask(lesson),
    systemsMapperTask: buildSystemsMapperTask(lesson),
    portfolioEvidenceItem: buildPortfolioEvidenceItem(lesson),
  };
}

export function buildThinkingSystemStatuses(result?: QuizResult): ThinkingSystemRuntimeStatus[] {
  const score = result?.score;
  const band = score === undefined ? undefined : getMasteryBand(score);
  return THINKING_SYSTEM_DEFINITIONS.map((definition) => {
    const base = { ...definition };
    if (definition.activation === "after-quiz" && !result) return { ...base, isAvailable: false, reason: "Submit a quiz to generate evidence.", nextAction: "Complete the lesson quiz." };
    if (definition.activation === "on-low-mastery") {
      const available = score === undefined || score < 80;
      return { ...base, isAvailable: available, reason: score === undefined ? "Available as preventive support." : `Current mastery: ${band?.label}.`, nextAction: available ? "Open reteach plan." : "Use Memory Vault or challenge path." };
    }
    if (definition.activation === "on-high-mastery") {
      const available = score !== undefined && score >= 90;
      return { ...base, isAvailable: available, reason: score === undefined ? "Unlocks after quiz evidence." : `Current mastery: ${band?.label}.`, nextAction: available ? "Open challenge task." : "Reach Advanced mastery to unlock." };
    }
    return { ...base, isAvailable: true, reason: "Available for this lesson.", nextAction: "Open activity scaffold." };
  });
}

function buildProblemSolvingLabTask(lesson: Lesson) {
  return {
    lessonId: lesson.id,
    problem: lesson.essentialQuestion,
    knownFacts: [lesson.learningObjective, ...lesson.prerequisites.slice(0, 2)],
    unknowns: ["What does the student need to find, explain, or prove?", "Which detail is most important?"],
    smallerParts: ["Identify the goal", "List known facts", "Name unknowns", "Choose a strategy", "Solve or explain", "Check the answer"],
    strategyOptions: ["draw/model", "use evidence", "step-by-step calculation", "compare choices", "debug sequence"],
    recommendedStrategy: lesson.thinkingSkillTags.includes("first-principles problem solving") ? "first-principles breakdown" : "break into knowns and unknowns",
    solutionSteps: ["Restate the task", "Name known facts", "Pick a strategy", "Apply the strategy", "Check whether the answer fits the goal", "Explain why it works"],
    answerCheck: "The answer should match the learning objective and be explainable in the student's own words.",
    reflectionPrompt: "Which step helped you most, and which step would you use again?",
    successCriteria: ["Known facts are named", "Unknown is clear", "Strategy matches task", "Answer is checked", "Student explains reasoning"],
  };
}

function buildEvidenceRoomTask(lesson: Lesson) {
  return {
    lessonId: lesson.id,
    claim: `I can show understanding of ${lesson.title}.`,
    evidenceOptions: [
      { text: lesson.learningObjective, strength: "strong" as const },
      { text: lesson.lessonFlow.workedExample.content ?? "Worked example from the lesson", strength: "strong" as const },
      { text: "I guessed because it looked right.", strength: "weak" as const },
      { text: "This detail is interesting but does not prove the claim.", strength: "irrelevant" as const },
    ],
    reasoningPrompt: "Explain why the strongest evidence proves the claim.",
    revisionPrompt: "Revise a weak answer by adding stronger evidence and reasoning.",
    successCriteria: ["Claim is clear", "Evidence is relevant", "Reasoning connects evidence to claim", "Weak evidence is revised"],
  };
}

function buildInterpretationLensTask(lesson: Lesson) {
  const subject = lesson.subject.toLowerCase();
  const lens = subject.includes("science") ? "science" : subject.includes("social") || subject.includes("history") ? "history" : subject.includes("math") || subject.includes("financial") ? "data" : subject.includes("computer") ? "cause-and-effect" : "text";
  return {
    lessonId: lesson.id,
    lens: lens as any,
    artifact: lesson.lessonFlow.hook.content ?? lesson.title,
    prompts: ["What do you notice?", "What does it mean?", "What context matters?", "What perspective or pattern is missing?"],
    successCriteria: ["Observation is specific", "Interpretation is explained", "Context or pattern is named", "Student avoids unsupported claims"],
  };
}

function buildDiscussionPrompt(lesson: Lesson) {
  return {
    lessonId: lesson.id,
    sentenceFrames: ["I think ___ because ___.", "I agree because ___.", "I disagree because ___.", "The evidence shows ___.", "Another possibility is ___.", "I changed my mind because ___."],
    prompt: lesson.lessonFlow.interpretationOrDiscussionTask.content ?? `Discuss how ${lesson.title} works.`,
    safetyMode: "prompt-only" as const,
    moderationRules: ["No open public chat in MVP", "No direct messages", "Use sentence frames", "Respond to ideas, not people"],
    successCriteria: ["Uses an academic sentence frame", "Includes evidence or reasoning", "Responds respectfully", "Can revise thinking"],
  };
}

function buildLearningPlannerTask(lesson: Lesson) {
  return {
    lessonId: lesson.id,
    task: `Complete ${lesson.title}`,
    firstStep: "Read the learning goal and name what success looks like.",
    strategy: lesson.thinkingSkillTags[0] ?? "break the task into steps",
    finishSignal: "Lesson sections, quiz, reflection, and Memory Vault scheduling are complete.",
    obstaclePrompt: "What might make this task hard, and what support can you use?",
    reflectionPrompt: "What worked, what got in the way, and what should happen next?",
    successCriteria: ["Names first step", "Chooses strategy", "Names finish signal", "Reflects after attempt"],
  };
}

function buildSystemsMapperTask(lesson: Lesson) {
  return {
    lessonId: lesson.id,
    systemName: `${lesson.title} system`,
    nodes: [
      { id: "goal", label: "Learning goal", type: "input" as const },
      { id: "strategy", label: "Strategy or method", type: "process" as const },
      { id: "evidence", label: "Evidence/check", type: "feedback" as const },
      { id: "result", label: "Result or explanation", type: "output" as const },
    ],
    links: [
      { from: "goal", to: "strategy", relationship: "guides" },
      { from: "strategy", to: "result", relationship: "produces" },
      { from: "evidence", to: "strategy", relationship: "improves" },
    ],
    changePrompt: "What changes if one part of the system is weak or missing?",
    successCriteria: ["At least three parts named", "Relationships explained", "Change consequence predicted"],
  };
}

function buildPortfolioEvidenceItem(lesson: Lesson) {
  const subject = lesson.subject.toLowerCase();
  return {
    id: `${lesson.id}-portfolio`,
    lessonId: lesson.id,
    artifactType: subject.includes("writing") ? "writing_draft" as const : subject.includes("computer") ? "code_project" as const : subject.includes("science") ? "lab_report" as const : "reflection" as const,
    title: `${lesson.title} Evidence Artifact`,
    evidencePrompt: "Save one answer, explanation, project, or reflection that proves learning.",
    rubricTags: lesson.thinkingSkillTags.slice(0, 3),
    parentTeacherFeedbackPrompt: "What evidence shows growth, and what is the next small improvement?",
    successCriteria: ["Artifact is tied to lesson", "Student explains what it proves", "Next improvement is named"],
  };
}
