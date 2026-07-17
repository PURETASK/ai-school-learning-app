const ACADEMY_IDS = new Set(["foundation", "bridge", "scholar"]);

function text(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function list(value) {
  return Array.isArray(value) ? value.map(text).filter(Boolean) : [];
}

function phaseText(phase) {
  if (typeof phase === "string") return text(phase);
  if (!phase || typeof phase !== "object") return "";
  const values = [phase.content, phase.prompt, phase.coreConcept, phase.teacherModel, phase.studentAction, phase.check];
  const items = Array.isArray(phase.items) ? phase.items : [];
  const itemText = items.map((item) => (typeof item === "string" ? item : item?.prompt || item?.content || item?.question || ""));
  return [...values, ...itemText].map(text).filter(Boolean).join(" ");
}

function phaseCollection(rawLesson) {
  const source = rawLesson?.activePhases && typeof rawLesson.activePhases === "object" ? rawLesson.activePhases : rawLesson?.lessonFlow;
  if (!source || typeof source !== "object") return {};
  if (Array.isArray(source)) {
    return source.reduce((result, phase) => {
      const key = text(phase?.id || phase?.phase || phase?.name).toLowerCase();
      if (key) result[key] = phase;
      return result;
    }, {});
  }
  return source;
}

function phaseValue(phases, ...names) {
  for (const name of names) {
    const phase = phases[name];
    const value = phaseText(phase);
    if (value) return value;
  }
  return "";
}

function academyId(rawLesson) {
  const candidate = text(rawLesson?.academyId || rawLesson?.academy).toLowerCase();
  if (candidate === "foundation academy") return "foundation";
  if (candidate === "bridge academy") return "bridge";
  if (candidate === "scholar academy") return "scholar";
  return ACADEMY_IDS.has(candidate) ? candidate : "foundation";
}

function subjectId(rawSubject) {
  const candidate = text(rawSubject).toLowerCase();
  const aliases = {
    math: "math",
    mathematics: "math",
    science: "science",
    ela: "ela",
    english: "ela",
    "english language arts": "ela",
    "social studies": "social-studies",
    history: "social-studies",
    "computer science": "computer-science",
    coding: "computer-science"
  };
  return aliases[candidate] || candidate.replace(/\s+/g, "-") || "lesson";
}

function vocabularyTerms(rawVocabulary) {
  return (Array.isArray(rawVocabulary) ? rawVocabulary : [])
    .map((item) => (typeof item === "string" ? item : item?.term || item?.word || ""))
    .map(text)
    .filter(Boolean);
}

function quizQuestions(rawQuiz) {
  return (Array.isArray(rawQuiz) ? rawQuiz : []).map((question) => ({
    ...question,
    questionText: question?.questionText || question?.question || question?.prompt || "",
    questionType: question?.questionType || question?.type || "short-response",
    correctAnswer: question?.correctAnswer || question?.answer || question?.correct_answer || "",
    difficultyLevel: question?.difficultyLevel || question?.difficulty || "developing",
    skillTag: question?.skillTag || question?.skill || "",
    standardTag: question?.standardTag || question?.standard || ""
  }));
}

function visualSupport(title, description, placement, prompt) {
  const cleanTitle = text(title) || "Lesson visual";
  const cleanDescription = text(description) || "A labeled visual model that makes the idea visible before abstract practice.";
  return {
    placement,
    title: cleanTitle,
    caption: cleanDescription,
    description: cleanDescription,
    prompt: text(prompt) || `Create an original educational visual for ${cleanTitle}: ${cleanDescription}`,
    altText: cleanDescription
  };
}

function buildVisuals(rawLesson, phases) {
  const title = text(rawLesson.title) || "Lesson visual";
  const objective = text(rawLesson.learningObjective || rawLesson.objective);
  const firstPrinciples = rawLesson.firstPrinciplesBreakdown || phases.firstPrinciplesBreakdown;
  const parts = Array.isArray(firstPrinciples?.parts) ? firstPrinciples.parts.map(text).filter(Boolean) : [];
  const modelDescription = phaseValue(phases, "workedExample", "miniTeach", "learningGoal") || objective;
  return [
    visualSupport(
      `${title} concept model`,
      objective || `A student-friendly model of ${title}.`,
      "lesson-hero",
      `Create a bold, age-appropriate educational illustration for ${title}. Show the concrete situation first, then the main idea. Use high contrast, clear labels, and no decorative text that is not provided.`
    ),
    visualSupport(
      `${title} step diagram`,
      parts.length ? `Show these connected parts: ${parts.join(", ")}.` : modelDescription,
      "teaching-diagram",
      `Create a clean labeled diagram for ${title}. Break the concept into visible parts, connect them with arrows, and include an accessible visual reading order. Topic: ${objective || title}.`
    ),
    visualSupport(
      `${title} tutor hint`,
      "A compact visual hint the tutor can reveal after asking what part feels confusing.",
      "ai-tutor",
      `Create a small tutor hint visual for ${title}. It should isolate one common stuck point and show one next step without displaying a final quiz answer.`
    )
  ];
}

function buildSections(rawLesson, phases) {
  const guided = phaseValue(phases, "guidedPractice");
  const active = phaseValue(phases, "activePractice", "evidenceBasedReasoningTask", "interpretationOrDiscussionTask");
  const retrieval = phaseValue(phases, "retrievalCheck");
  const reflection = phaseValue(phases, "reflection", "feedback");
  return {
    warmUp: phaseValue(phases, "hook", "orient") || `Start by noticing something connected to ${text(rawLesson.title) || "today's idea"}.`,
    directInstruction: phaseValue(phases, "miniTeach", "model", "workedExample") || text(rawLesson.learningObjective),
    guidedPractice: guided || "Try one example with the app. Explain what each step means before moving on.",
    interactiveActivity: active || "Build, sort, draw, test, or explain a model of the idea.",
    independentPractice: phaseValue(phases, "criticalThinkingCheckpoint", "prove", "practice") || "Solve a new example independently and write the exact part that feels uncertain.",
    reteachPath: text(rawLesson.reteachPath?.simpleExplanation) || phaseValue(phases, "feedback") || "Switch to a simpler example, a different visual, and one first-step hint.",
    challengePath: phaseValue(phases, "challenge", "transfer", "adapt") || "Transfer the idea to a new situation and defend your reasoning.",
    retrievalCheck: retrieval || "Close the lesson by recalling the key idea without looking back.",
    reflection: reflection || "Name the strategy that helped, the mistake to watch for, and when you will review it again."
  };
}

function buildHelperNotes(rawLesson, phases) {
  const firstPrinciples = rawLesson.firstPrinciplesBreakdown || phases.firstPrinciplesBreakdown;
  const parts = Array.isArray(firstPrinciples?.parts) ? firstPrinciples.parts.map(text).filter(Boolean) : [];
  const check = text(firstPrinciples?.check) || phaseValue(phases, "criticalThinkingCheckpoint", "feedback");
  return [
    { title: "Look", note: "Find the concrete example, diagram, source clue, or pattern before naming the rule." },
    { title: "Explain", note: phaseValue(phases, "learningGoal", "miniTeach") || "Explain the idea in your own words before choosing an answer." },
    ...(parts.length ? [{ title: "Parts", note: `Break the idea into: ${parts.join(", ")}.` }] : []),
    ...(check ? [{ title: "Check", note: check }] : [])
  ];
}

function buildMisunderstandings(rawLesson, phases) {
  const path = rawLesson.reteachPath;
  if (path && typeof path === "object") {
    return [{
      misunderstanding: text(path.misconception || path.misunderstanding) || "The learner applies a rule without connecting it to the model.",
      repair: text(path.simpleExplanation || path.repair) || "Use a simpler example and ask the learner to point to the evidence for each step.",
      signal: text(path.exitCriteria || path.lookFor)
    }];
  }
  const checkpoint = phaseValue(phases, "criticalThinkingCheckpoint", "feedback");
  return [{
    misunderstanding: "The learner can repeat a label or procedure but cannot explain why it works.",
    repair: checkpoint || "Ask the learner to draw the model, name the first clue, and explain the connection in a because sentence.",
    signal: "Correct answer with missing or contradictory reasoning."
  }];
}

function buildGroupHomework(rawLesson) {
  if (rawLesson.groupHomework) return rawLesson.groupHomework;
  const subject = text(rawLesson.subject || "lesson").replaceAll("-", " ");
  return {
    title: `Learning crew: explain ${text(rawLesson.title) || subject}`,
    roles: ["Facilitator", "Evidence keeper", "Visual builder", "Reporter"],
    sharedArtifact: "A shared diagram, model, explanation, or short presentation that proves the group understands the idea.",
    individualAccountability: "Each learner submits one sentence naming their contribution and one piece of evidence they can defend."
  };
}

function buildEvidenceMoves(rawLesson, phases, subject) {
  if (subject !== "math") return rawLesson.evidenceMoves || {};
  const objective = text(rawLesson.learningObjective || rawLesson.objective) || "the lesson idea";
  const worked = phaseValue(phases, "workedExample", "miniTeach");
  const active = phaseValue(phases, "activePractice", "guidedPractice");
  const feedback = phaseValue(phases, "feedback");
  return {
    priorKnowledgeCheck: phaseValue(phases, "hook", "retrievalCheck") || `Ask what the learner already knows about ${objective}.`,
    misconceptionCheck: text(rawLesson.reteachPath?.misconception) || phaseValue(phases, "criticalThinkingCheckpoint") || "Ask the learner to test the most tempting wrong idea and explain why it fails.",
    manipulativeRationale: "Use a concrete model or representation because it makes the quantities and relationship visible before symbols are used.",
    representations: "Connect the concrete situation, labeled diagram, words, table, and symbols, then ask which representation makes the reasoning easiest to see.",
    problemSolvingStrategy: active || "Compare at least two strategies and ask the learner to choose and justify one.",
    workedExample: worked || `Model one example of ${objective} with a think-aloud and a visible check.`,
    examplesAndNonExamples: "Show one example that fits the concept and one near-miss. Ask the learner to identify the feature that changes the answer.",
    knowledgeConnections: `Connect ${objective} to a prior skill, a real situation, and a future transfer problem.`,
    metacognitivePrompt: phaseValue(phases, "reflection", "feedback") || "Plan the first step, monitor whether the representation still matches, and evaluate the result.",
    interventionTrigger: text(rawLesson.reteachPath?.exitCriteria) || "If the learner misses two checks or cannot explain the model, route to the visual reteach path and log the misconception.",
    transitionBridge: "Begin with a familiar Grade 5 representation, then bridge to Grade 6 notation and independent strategy choice.",
    feedbackFrame: feedback || "Name what is correct, identify the exact reasoning gap, give one hint, and offer a similar retry."
  };
}

export function adaptStructuredLesson(rawLesson = {}) {
  const isStructuredLesson = Boolean(rawLesson?.schemaVersion || rawLesson?.lessonFlow || rawLesson?.activePhases);
  if (!isStructuredLesson) return rawLesson;
  const phases = phaseCollection(rawLesson);
  const objective = text(rawLesson.objective || rawLesson.learningObjective);
  const title = text(rawLesson.title);
  const standards = list(rawLesson.standards || rawLesson.standardsTags);
  const subject = subjectId(rawLesson.subject);
  const visualSupports = buildVisuals(rawLesson, phases);
  const visual = visualSupports[0];
  return {
    ...rawLesson,
    academyId: academyId(rawLesson),
    grade: text(rawLesson.grade || rawLesson.gradeLevel),
    subject,
    unitTitle: text(rawLesson.unitTitle || rawLesson.unit),
    objective,
    standards,
    accessibilityNotes: Array.isArray(rawLesson.accessibilityNotes)
      ? rawLesson.accessibilityNotes.join(" ")
      : text(rawLesson.accessibilityNotes) || "Use text alternatives for visuals, keyboard-completable interactions, and do not rely on color alone.",
    ageFitNotes: text(rawLesson.ageFitNotes) || "Grade 6 learners see concrete models first, then explain the abstraction and transfer it to a new context.",
    visual,
    readability: rawLesson.readability || {
      band: "bridge",
      vocabularyLevel: "Grade 6 academic vocabulary with defined domain terms",
      maxSentenceWords: 24,
      supportNotes: "Define new domain terms, pair explanations with a visual, and allow the learner to respond with text, speech, or a labeled model."
    },
    visualSupports,
    lessonSections: buildSections(rawLesson, phases),
    helperNotes: buildHelperNotes(rawLesson, phases),
    commonMisunderstandings: buildMisunderstandings(rawLesson, phases),
    quizQuestions: quizQuestions(rawLesson.quizQuestions || rawLesson.quiz),
    vocabularyTerms: vocabularyTerms(rawLesson.vocabularyTerms),
    prerequisiteSkills: list(rawLesson.prerequisiteSkills || rawLesson.prerequisites),
    evidenceMoves: buildEvidenceMoves(rawLesson, phases, subject),
    groupHomework: buildGroupHomework(rawLesson),
    studentSummary: text(rawLesson.studentSummary) || `You will learn to ${objective.replace(/\.$/, "")}.`,
    whyItMatters: text(rawLesson.whyItMatters) || `This helps you use ${text(rawLesson.title) || "the idea"} in new problems, projects, and explanations.`,
    sourceCards: rawLesson.sourceCards || standards.map((standard) => ({
      sourceId: standard,
      title: "Standards alignment",
      claim: `${title || "This lesson"} is tagged to ${standard}.`
    })),
    sourceLessonId: text(rawLesson.sourceLessonId || rawLesson.id),
    estimatedMinutes: Number(rawLesson.estimatedMinutes || 35),
    masteryThreshold: Number(rawLesson.mastery?.masteryThreshold || rawLesson.masteryThreshold || 80),
    activePhases: Object.keys(phases),
    memoryVaultItems: rawLesson.memoryVaultItems || [],
    retrievalCheck: rawLesson.retrievalCheck || null,
    reteachPath: rawLesson.reteachPath || null,
    challengePath: rawLesson.challengePath || null
  };
}

export function adaptStructuredLessonBatch(lessons = []) {
  return (Array.isArray(lessons) ? lessons : []).map(adaptStructuredLesson);
}
