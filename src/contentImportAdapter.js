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
  const source = rawLesson?.schemaVersion === "3" && Array.isArray(rawLesson?.phaseModules)
    ? rawLesson.phaseModules
    : rawLesson?.activePhases && typeof rawLesson.activePhases === "object" ? rawLesson.activePhases : rawLesson?.lessonFlow;
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

function phaseModuleText(phases, names) {
  return phaseValue(phases, ...names);
}

function buildNativePhaseModules(rawLesson, phases, visualSupports) {
  const definitions = [
    ["orient", "Orient", ["hook", "learningGoal"]],
    ["model", "Model", ["miniTeach", "workedExample"]],
    ["deconstruct", "Break down", ["firstPrinciplesBreakdown"]],
    ["practice", "Practice", ["guidedPractice", "activePractice"]],
    ["reason", "Reason", ["criticalThinkingCheckpoint", "evidenceBasedReasoningTask", "interpretationOrDiscussionTask"]],
    ["prove", "Prove", ["quiz"]],
    ["remember", "Remember", ["retrievalCheck"]],
    ["transfer", "Transfer", ["challengePath", "reflection"]],
    ["adapt", "Adapt", ["feedback", "reteachPath"]]
  ];
  return definitions
    .map(([phase, title, names]) => {
      const studentAction = phase === "prove" ? `${rawLesson.quiz?.length || 0} checkpoint questions test the current skill.` : phaseModuleText(phases, names);
      if (!studentAction) return null;
      const visual = visualSupports.find((item) => item.placement === (phase === "model" ? "teaching-diagram" : phase === "remember" ? "ai-tutor" : "lesson-hero"));
      return {
        phase,
        title,
        studentAction,
        successCheck: phase === "orient" ? text(rawLesson.essentialQuestion) || "I can name today's goal." : "I can explain or demonstrate the idea without copying a final answer.",
        visualSupport: visual?.title || "Use the lesson model and labels."
      };
    })
    .filter(Boolean);
}

function buildNativeV3Fields(rawLesson, phases, visualSupports, subject, objective) {
  if (rawLesson?.schemaVersion === "3") {
    return {
      schemaVersion: "3",
      lessonFamily: text(rawLesson.lessonFamily),
      activePhases: list(rawLesson.activePhases),
      targetLearningStates: list(rawLesson.targetLearningStates),
      learningObjective: objective,
      successCriteria: list(rawLesson.successCriteria),
      thinkingSkillTags: list(rawLesson.thinkingSkillTags),
      outcomes: rawLesson.outcomes || {},
      phaseModules: Array.isArray(rawLesson.phaseModules) ? rawLesson.phaseModules : [],
      proofTasks: Array.isArray(rawLesson.proofTasks) ? rawLesson.proofTasks : [],
      requiredMasteryProofs: list(rawLesson.requiredMasteryProofs),
      feedbackRules: Array.isArray(rawLesson.feedbackRules) ? rawLesson.feedbackRules : [],
      reteachPaths: Array.isArray(rawLesson.reteachPaths) ? rawLesson.reteachPaths : [],
      challengePaths: Array.isArray(rawLesson.challengePaths) ? rawLesson.challengePaths : [],
      contentStatus: text(rawLesson.contentStatus) || "review_required",
      version: text(rawLesson.version) || "3.0.0"
    };
  }
  const phaseModules = buildNativePhaseModules(rawLesson, phases, visualSupports);
  const activePhases = phaseModules.map((module) => module.phase);
  const family = subject === "science" ? "inquiry_investigation" : subject === "math" ? "skill_workshop" : subject === "ela" || subject === "social-studies" ? "reasoning_lab" : "concept_launch";
  const learningGoal = phases.learningGoal?.successCriteria;
  const successCriteria = Array.isArray(learningGoal) ? learningGoal.map(text).filter(Boolean) : [text(learningGoal)].filter(Boolean);
  const challengeAction = typeof rawLesson.challengePath === "string"
    ? text(rawLesson.challengePath)
    : text(rawLesson.challengePath?.action || rawLesson.challengePath?.prompt || rawLesson.challengePath?.description);
  return {
    schemaVersion: "3",
    lessonFamily: family,
    activePhases,
    targetLearningStates: ["acquiring", "developing", "accurate", "secure"],
    learningObjective: objective,
    successCriteria: successCriteria.length ? successCriteria : ["I can explain the idea in my own words.", "I can use the idea in a new example."],
    thinkingSkillTags: list(rawLesson.thinkingSkillTags),
    outcomes: {
      knowledge: [objective],
      capability: phaseModules.filter((module) => ["practice", "prove"].includes(module.phase)).map((module) => module.studentAction),
      reasoning: phaseModules.filter((module) => ["deconstruct", "reason"].includes(module.phase)).map((module) => module.studentAction),
      retention: activePhases.includes("remember") ? ["Retrieve the key idea after a delay."] : [],
      transfer: activePhases.includes("transfer") ? ["Use the idea in a changed context."] : []
    },
    phaseModules,
    proofTasks: ["recall", "explain", "perform", "retain", "transfer"].map((proof) => ({
      proof,
      prompt: proof === "retain" ? "Complete the delayed retrieval check." : proof === "transfer" ? "Apply the idea in a new context." : "Show the reasoning without final-answer help.",
      independentRequired: true
    })),
    requiredMasteryProofs: ["recall", "explain", "perform", "retain", "transfer"].filter((proof) => proof !== "retain" || activePhases.includes("remember")),
    feedbackRules: [{
      diagnosisCode: "source-lesson-feedback",
      result: "Use the learner's response and exact stuck point to identify the next move.",
      hint: "Ask whether the gap is vocabulary, model, first step, or reasoning.",
      action: "Route to hint, alternate visual, reteach, or retry."
    }],
    reteachPaths: [{ id: `${text(rawLesson.id) || "lesson"}-reteach`, trigger: "The learner misses a checkpoint or cannot explain the model.", action: text(rawLesson.reteachPath?.simpleExplanation) || "Use a smaller example and a different representation." }],
    challengePaths: [{ id: `${text(rawLesson.id) || "lesson"}-challenge`, trigger: "The learner demonstrates current-context accuracy.", action: challengeAction || "Transfer the idea to a changed context." }],
    contentStatus: "review_required",
    version: "3.0.0-structured-source"
  };
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
    ),
    visualSupport(
      `${title} misconception repair`,
      "A contrast visual that shows a tempting mistake beside the corrected reasoning.",
      "misconception-repair",
      `Create a side-by-side educational visual for ${title}: show one common misconception, then the corrected model. Use labels, arrows, and a short explanation without giving a graded answer.`
    ),
    visualSupport(
      `${title} memory cue`,
      "A compact retrieval cue for the Memory Vault review after the lesson.",
      "memory-vault",
      `Create a memorable retrieval cue for ${title}. Show the smallest set of symbols, steps, or relationships a Grade 6 learner should recall later, with accessible labels.`
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
    }, {
      misunderstanding: "The learner can name a term but cannot connect it to the diagram, example, or evidence.",
      repair: "Ask the learner to point to the exact part of the model that supports the term, then explain the connection.",
      signal: "Definition is repeated without a model or example."
    }, {
      misunderstanding: "The learner uses a correct procedure in the original example but cannot explain the first step in a new context.",
      repair: "Change one feature of the example and ask the learner to choose the first move before solving.",
      signal: "Accuracy drops when the surface story or representation changes."
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
  const studentObjective = objective.replace(/^students?\s+will\s+/i, "");
  const title = text(rawLesson.title);
  const standards = list(rawLesson.standards || rawLesson.standardsTags);
  const subject = subjectId(rawLesson.subject);
  const visualSupports = buildVisuals(rawLesson, phases);
  const visual = visualSupports[0];
  const nativeV3 = buildNativeV3Fields(rawLesson, phases, visualSupports, subject, objective);
  const sections = buildSections(rawLesson, phases);
  const studentSummary = text(rawLesson.studentSummary) || `You will learn to ${studentObjective.replace(/\.$/, "")}.`;
  const tutorHandoff = `Write exactly what is confusing about ${title || "this lesson"}: the words, the visual, the first step, or the reasoning.`;
  return {
    ...rawLesson,
    academyId: academyId(rawLesson),
    academy: academyId(rawLesson),
    grade: text(rawLesson.grade || rawLesson.gradeLevel),
    subject,
    unitTitle: text(rawLesson.unitTitle || rawLesson.unit),
    objective,
    learningObjective: objective,
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
    studentSummary,
    whyItMatters: text(rawLesson.whyItMatters) || `This helps you use ${text(rawLesson.title) || "the idea"} in new problems, projects, and explanations.`,
    studentFacing: {
      mission: studentSummary,
      bigIdea: phaseValue(phases, "miniTeach", "learningGoal") || objective,
      whyItMatters: text(rawLesson.whyItMatters) || `This helps you use ${title || "the idea"} in a new problem.`,
      tutorHandoff,
      thinkingPrompt: phaseValue(phases, "criticalThinkingCheckpoint", "evidenceBasedReasoningTask") || "Explain why your answer or model makes sense.",
      steps: sections.directInstruction ? [sections.directInstruction] : []
    },
    funTasks: [sections.interactiveActivity, sections.challengePath].filter(Boolean),
    retentionChecks: [
      { prompt: phaseValue(phases, "retrievalCheck") || `Recall the key idea from ${title || "today's lesson"}.`, schedule: "same-day" },
      { prompt: "Return tomorrow and explain the idea without looking at the lesson.", schedule: "next-day" },
      { prompt: "Use the idea in a changed example one week later.", schedule: "seven-day" }
    ],
    reward: "Earn XP for an independent explanation, a corrected misconception, and successful delayed recall.",
    teachingSupport: {
      summary: studentSummary,
      diagramCallouts: visualSupports.map((support) => ({ title: support.title, body: support.description })),
      helperNotes: buildHelperNotes(rawLesson, phases).map((note) => note.note),
      confusionPrompt: tutorHandoff
    },
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
    challengePath: rawLesson.challengePath || null,
    ...nativeV3
  };
}

export function adaptStructuredLessonBatch(lessons = []) {
  return (Array.isArray(lessons) ? lessons : []).map(adaptStructuredLesson);
}
