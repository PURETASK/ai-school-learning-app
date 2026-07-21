import {
  curriculum,
  evidenceGuidanceAudit,
  explanationModes,
  funRetentionRubric,
  pilotLessons,
  qualityGates,
  standardsFrameworks,
  syllabusResearchFindings,
  syllabusResearchSources
} from "./data.js";
import { findVisualOpportunity, getProjectVisualAudit } from "./visualAgent.js";
import { getApprovedLiveSourceTargets, isApprovedLiveSourceUrl } from "./liveSourceAudit.js";

const allowedRoles = ["platform-admin", "school-admin", "teacher", "parent", "student"];
let toolCallSequence = 0;

export const toolRegistry = [
  {
    id: "visual_generation",
    name: "Visual generation planner",
    category: "visuals",
    ownerAgentId: "visual-learning",
    description: "Prepare image prompts and route reviewed visual-generation requests.",
    allowedRoles: ["platform-admin", "school-admin", "teacher"],
    externalRisk: "api-cost",
    requiresHumanReview: true,
    studentFacing: false,
    status: "active"
  },
  {
    id: "lesson_audit",
    name: "Lesson audit",
    category: "curriculum",
    ownerAgentId: "qa",
    description: "Audit a lesson for objective, teaching support, evidence moves, visual support, and mastery behavior.",
    allowedRoles: ["platform-admin", "school-admin", "teacher", "parent"],
    externalRisk: "none",
    requiresHumanReview: false,
    studentFacing: false,
    status: "active"
  },
  {
    id: "content_review",
    name: "Content review gate",
    category: "content",
    ownerAgentId: "content-ops",
    description: "Summarize draft readiness, publication blocks, and quality gates.",
    allowedRoles: ["platform-admin", "school-admin", "teacher"],
    externalRisk: "none",
    requiresHumanReview: true,
    studentFacing: false,
    status: "active"
  },
  {
    id: "browser_preview_check",
    name: "Browser preview check",
    category: "qa",
    ownerAgentId: "qa",
    description: "Report local preview health and the expected browser verification target.",
    allowedRoles: ["platform-admin", "school-admin"],
    externalRisk: "local-browser",
    requiresHumanReview: false,
    studentFacing: false,
    status: "active"
  },
  {
    id: "curriculum_export",
    name: "Curriculum export summary",
    category: "curriculum",
    ownerAgentId: "curriculum",
    description: "Prepare a curriculum export manifest by academy, grade, subject, unit, and planned lessons.",
    allowedRoles: ["platform-admin", "school-admin", "teacher"],
    externalRisk: "none",
    requiresHumanReview: false,
    studentFacing: false,
    status: "active"
  },
  {
    id: "standards_lookup",
    name: "Standards lookup",
    category: "standards",
    ownerAgentId: "curriculum",
    description: "Find supported standards frameworks by subject or standards id.",
    allowedRoles: ["platform-admin", "school-admin", "teacher", "parent"],
    externalRisk: "none",
    requiresHumanReview: false,
    studentFacing: false,
    status: "active"
  },
  {
    id: "truth_policy_review",
    name: "Truth and tutor quality review",
    category: "ai-safety",
    ownerAgentId: "truth-policy",
    description: "Grade a tutor response for factual grounding, confusion diagnosis, answer policy, age fit, and research needs.",
    allowedRoles: ["platform-admin", "school-admin", "teacher"],
    externalRisk: "web-research",
    requiresHumanReview: true,
    studentFacing: false,
    status: "active"
  },
  {
    id: "explanation_variation_studio",
    name: "Explanation variation studio",
    category: "ai-safety",
    ownerAgentId: "teacher-explanation",
    description: "Design multiple explanations, visual types, tutor prompts, and confusion-specific teaching routes for one lesson.",
    allowedRoles: ["platform-admin", "school-admin", "teacher", "parent"],
    externalRisk: "none",
    requiresHumanReview: false,
    studentFacing: false,
    status: "active"
  },
  {
    id: "fun_retention_design",
    name: "Fun and retention lesson designer",
    category: "curriculum",
    ownerAgentId: "fun-retention",
    description: "Audit lesson style, rubric, rewards, activity design, and retention mechanics for fun durable learning.",
    allowedRoles: ["platform-admin", "school-admin", "teacher", "parent"],
    externalRisk: "none",
    requiresHumanReview: false,
    studentFacing: false,
    status: "active"
  },
  {
    id: "syllabus_misconception_research",
    name: "Syllabus and misconception research planner",
    category: "standards",
    ownerAgentId: "syllabus-research",
    description: "Prepare staff-side web research tasks for usual syllabi, standards, hard topics, and better-teaching redesigns.",
    allowedRoles: ["platform-admin", "school-admin", "teacher"],
    externalRisk: "web-research",
    requiresHumanReview: true,
    studentFacing: false,
    status: "active"
  },
  {
    id: "live_curriculum_source_audit",
    name: "Live curriculum source audit",
    category: "standards",
    ownerAgentId: "syllabus-research",
    description: "Fetch an approved curriculum or practice-guide source, extract evidence snippets, and route findings into staff review.",
    allowedRoles: ["platform-admin", "school-admin", "teacher"],
    externalRisk: "web-fetch",
    requiresHumanReview: true,
    studentFacing: false,
    status: "active"
  }
];

function normalizeRole(role) {
  return allowedRoles.includes(role) ? role : "platform-admin";
}

export function getToolRegistry() {
  return toolRegistry.map((tool) => ({ ...tool }));
}

export function getToolGatewaySummary(state = {}) {
  const tools = getToolRegistry();
  const logs = state.toolCallLogs || [];
  return {
    totalTools: tools.length,
    activeTools: tools.filter((tool) => tool.status === "active").length,
    externalRiskTools: tools.filter((tool) => tool.externalRisk !== "none").length,
    reviewRequiredTools: tools.filter((tool) => tool.requiresHumanReview).length,
    loggedCalls: logs.length,
    blockedCalls: logs.filter((log) => log.status === "blocked").length,
    tools
  };
}

function authorizeTool(tool, role) {
  const normalizedRole = normalizeRole(role);
  if (!tool) {
    return { allowed: false, role: normalizedRole, reason: "Tool is not registered." };
  }
  if (tool.status !== "active") {
    return { allowed: false, role: normalizedRole, reason: "Tool is not active." };
  }
  if (!tool.allowedRoles.includes(normalizedRole)) {
    return { allowed: false, role: normalizedRole, reason: `${normalizedRole} is not allowed to run ${tool.id}.` };
  }
  return { allowed: true, role: normalizedRole, reason: "Allowed" };
}

function createToolLog({ tool, role, input, result, status }) {
  toolCallSequence += 1;
  return {
    id: `tool-call-${Date.now()}-${toolCallSequence}`,
    toolId: tool?.id || String(input?.toolId || "unknown"),
    toolName: tool?.name || "Unknown tool",
    ownerAgentId: tool?.ownerAgentId || "",
    role,
    status,
    externalRisk: tool?.externalRisk || "unknown",
    requiresHumanReview: Boolean(tool?.requiresHumanReview),
    summary: result.summary || result.reason || "Tool call recorded.",
    payload: result.data || {},
    createdAt: new Date().toLocaleString()
  };
}

function findLessonLocal(lessonId) {
  return pilotLessons.find((lesson) => lesson.id === lessonId) || pilotLessons[0];
}

function auditEvidenceMoves(subject, evidenceMoves = {}, itemId = "tool-audit") {
  const requiredMoves = subject === "math" ? evidenceGuidanceAudit.requiredMathLessonMoves : [];
  const missing = requiredMoves.filter((move) => {
    const value = evidenceMoves?.[move.key];
    return Array.isArray(value) ? value.length === 0 : !String(value || "").trim();
  });
  return {
    itemId,
    subject,
    required: requiredMoves.length,
    present: requiredMoves.length - missing.length,
    missing,
    passed: missing.length === 0
  };
}

function getLessonTeachingSupportLocal(lesson) {
  const support = lesson.teachingSupport || {};
  return {
    summary: support.summary || lesson.objective,
    description: support.description || lesson.sections.teach,
    diagramCallouts:
      Array.isArray(support.diagramCallouts) && support.diagramCallouts.length
        ? support.diagramCallouts
        : [
            { title: lesson.visual?.title || "Lesson visual", body: lesson.visual?.caption || lesson.objective },
            { title: "Build", body: lesson.sections.activity },
            { title: "Explain", body: lesson.sections.challenge }
          ],
    helperNotes:
      Array.isArray(support.helperNotes) && support.helperNotes.length
        ? support.helperNotes
        : [lesson.sections.reteach, "Ask the learner to explain the idea in their own words before retrying."],
    commonMisunderstandings:
      Array.isArray(support.commonMisunderstandings) && support.commonMisunderstandings.length
        ? support.commonMisunderstandings
        : [{ mistake: "The learner can repeat the answer but cannot explain the reason.", fix: lesson.sections.reteach }],
    confusionPrompt: support.confusionPrompt || "Write the exact word, step, picture, or question that does not make sense yet."
  };
}

function getLessonExperienceLocal(lesson, evidenceAudit) {
  const support = getLessonTeachingSupportLocal(lesson);
  return {
    hasVisual: Boolean(lesson.visual),
    funTaskCount: lesson.funTasks?.length || 0,
    hasGroupHomework: Boolean(lesson.groupHomework),
    retentionCheckCount: lesson.retentionChecks?.length || 0,
    reward: lesson.reward || "Mastery progress",
    evidenceAuditPassed: evidenceAudit.passed,
    evidenceMoveCount: evidenceAudit.present,
    teachingSupportCount: support.diagramCallouts.length + support.helperNotes.length + support.commonMisunderstandings.length
  };
}

function getDraftEvidenceAuditLocal(draft) {
  return auditEvidenceMoves(draft.subject, draft.evidenceMoves || {}, draft.id);
}

function getContentAuthoringSummaryLocal(state) {
  const drafts = state.contentDrafts || [];
  const evidenceAudits = drafts.map(getDraftEvidenceAuditLocal);
  const bodyReady = drafts.filter((draft) => getContentDraftCompletenessLocal(draft).passed).length;
  const imports = state.contentImportJobs || [];
  return {
    total: drafts.length,
    draft: drafts.filter((item) => item.status === "draft").length,
    review: drafts.filter((item) => item.status === "review").length,
    published: drafts.filter((item) => item.status === "published").length,
    evidenceReady: evidenceAudits.filter((audit) => audit.required > 0 && audit.passed).length,
    evidenceBlocked: evidenceAudits.filter((audit) => audit.required > 0 && !audit.passed).length,
    lessonBodyReady: bodyReady,
    lessonBodyBlocked: drafts.length - bodyReady,
    importsRejected: imports.filter((job) => job.status === "rejected").length,
    importsAccepted: imports.filter((job) => job.status === "imported").length
  };
}

function getContentDraftCompletenessLocal(draft = {}) {
  const sections = draft.lessonSections || {};
  const issues = [];
  if (!draft.essentialQuestion) issues.push("essential question");
  if (!draft.studentSummary) issues.push("student summary");
  if (!draft.whyItMatters) issues.push("why-it-matters");
  if (Object.values(sections).filter(Boolean).length < 7) issues.push("lesson sections");
  if ((draft.helperNotes || []).length < 2) issues.push("helper notes");
  if (!(draft.commonMisunderstandings || []).length) issues.push("misconception repair");
  if ((draft.visualSupports || []).length < 2) issues.push("visual supports");
  if (!(draft.quizQuestions || []).length) issues.push("quiz checkpoint");
  if (!(draft.sourceCards || []).length) issues.push("source cards");
  return {
    passed: issues.length === 0,
    issues
  };
}

function getCurriculumExportData() {
  return curriculum.academies.map((academy) => ({
    id: academy.id,
    name: academy.name,
    range: academy.range,
    courseCount: academy.courseCount,
    plannedUnitCount: academy.plannedUnitCount,
    grades: academy.grades.map((grade) => ({
      grade: grade.grade,
      label: grade.label,
      courseCount: grade.courses.length,
      subjects: grade.courses.map((course) => ({
        title: course.title,
        subject: course.subject,
        units: course.units.length,
        targetLessons: course.units.reduce((sum, unit) => sum + unit.lessonTarget, 0)
      }))
    }))
  }));
}

function executeVisualGeneration(state, input) {
  const audit = getProjectVisualAudit(state);
  const slotId = input.slotId || audit.slots[0]?.id;
  const slot = slotId ? findVisualOpportunity(state, slotId) : null;

  return {
    summary: slot ? `Prepared ${slot.placement} prompt for ${slot.lessonTitle}.` : "No visual opportunity was available.",
    requiresReview: true,
    nextAction: slot ? "Use the Visuals tab to generate a review-only image from this prompt." : "Add lesson content or teaching support before generating images.",
    data: {
      totalSlots: audit.totalSlots,
      highPriority: audit.highPriority,
      slot
    }
  };
}

function executeLessonAudit(input) {
  const lesson = findLessonLocal(input.lessonId);
  const support = getLessonTeachingSupportLocal(lesson);
  const evidenceAudit = auditEvidenceMoves(lesson.subject, lesson.evidenceMoves || {}, lesson.id);
  const experience = getLessonExperienceLocal(lesson, evidenceAudit);

  return {
    summary: `${lesson.title} has ${experience.funTaskCount} rich task(s), ${experience.retentionCheckCount} retention check(s), and ${support.commonMisunderstandings.length} misconception check(s).`,
    requiresReview: evidenceAudit.required ? !evidenceAudit.passed : false,
    nextAction: evidenceAudit.required && !evidenceAudit.passed ? "Complete missing math evidence moves." : "Review the lesson visually and run a learner checkpoint.",
    data: {
      lessonId: lesson.id,
      objective: lesson.objective,
      experience,
      teachingSupport: {
        summary: support.summary,
        diagramCallouts: support.diagramCallouts.length,
        helperNotes: support.helperNotes.length,
        commonMisunderstandings: support.commonMisunderstandings.length
      },
      evidenceAudit
    }
  };
}

function executeContentReview(state) {
  const authoring = getContentAuthoringSummaryLocal(state);
  const blockedDrafts = (state.contentDrafts || [])
    .map((draft) => ({
      id: draft.id,
      title: draft.title,
      status: draft.status,
      subject: draft.subject,
      evidenceAudit: getDraftEvidenceAuditLocal(draft),
      truthReviewStatus: draft.truthReviewStatus || "needs-human-review",
      truthScore: draft.truthScore || 0,
      truthIssues: draft.truthIssues || draft.contentTruthReview?.issues || [],
      lessonBodyReady: getContentDraftCompletenessLocal(draft).passed,
      lessonBodyIssues: getContentDraftCompletenessLocal(draft).issues,
      publicationBlocked: Boolean(draft.publicationBlocked),
      blockedReason: draft.blockedReason || ""
    }))
    .filter((draft) => draft.publicationBlocked || (draft.evidenceAudit.required && !draft.evidenceAudit.passed) || !draft.lessonBodyReady || draft.truthReviewStatus !== "approved");

  return {
    summary: `${authoring.total} draft(s), ${authoring.published} published, ${blockedDrafts.length} blocked by gates.`,
    requiresReview: blockedDrafts.length > 0,
    nextAction: blockedDrafts.length ? "Resolve lesson body, evidence, truth-policy, or visual approval blocks before publishing." : "Continue academic and accessibility review.",
    data: {
      authoring,
      qualityGates,
      blockedDrafts
    }
  };
}

function executeBrowserPreviewCheck() {
  return {
    summary: "Preview health check target prepared.",
    requiresReview: false,
    nextAction: "Verify http://localhost:4173/ loads, then inspect Student, Lesson, Visuals, Admin, and Agents views.",
    data: {
      url: "http://localhost:4173/",
      expectedSignals: ["K-12 Learning Academies", "Student", "Lesson", "Visuals", "Admin", "Agents"],
      knownRisk: "Browser automation may time out if a stale preview process is holding the port."
    }
  };
}

function executeCurriculumExport() {
  const academies = getCurriculumExportData();
  return {
    summary: `${academies.length} academy export manifest prepared.`,
    requiresReview: false,
    nextAction: "Use this manifest to create CSV, JSON, or LMS import formats later.",
    data: { academies }
  };
}

function executeStandardsLookup(input) {
  const query = String(input.query || input.subject || "").toLowerCase().trim();
  const matches = standardsFrameworks.filter((framework) => {
    const haystack = [framework.id, framework.name, framework.purpose, ...(framework.subjects || [])].join(" ").toLowerCase();
    return !query || haystack.includes(query);
  });

  return {
    summary: `${matches.length} standards framework(s) matched${query ? ` "${query}"` : ""}.`,
    requiresReview: false,
    nextAction: "Attach standards as data tags; do not hardcode state-specific logic.",
    data: { query, matches }
  };
}

function containsAny(value, words) {
  const normalized = String(value || "").toLowerCase();
  return words.some((word) => normalized.includes(String(word || "").toLowerCase()));
}

function scoreTutorResponse({ lesson, support, studentInput, tutorResponse }) {
  const response = String(tutorResponse || "");
  const input = String(studentInput || "");
  const lowerResponse = response.toLowerCase();
  const scores = {
    lessonGrounding: containsAny(response, [lesson.objective.toLowerCase(), support.summary.toLowerCase(), lesson.title.toLowerCase()]) ? 5 : 3,
    confusionDiagnosis: input && containsAny(response, ["stuck", "confusing", "misconception", "step", "visual", "vocabulary", "reason"]) ? 5 : 2,
    answerPolicy: containsAny(lowerResponse, ["final answer is", "the answer is", "just choose", "copy this"]) ? 1 : 5,
    ageFit: response.length <= 900 && !containsAny(lowerResponse, ["obviously", "trivial", "just do"]) ? 5 : 3,
    helpfulness: containsAny(lowerResponse, ["draw", "point", "explain", "retry", "compare", "because", "model", "diagram"]) ? 5 : 3,
    truthRisk: containsAny(lowerResponse, ["always", "never", "guarantee", "all scientists", "proves that"]) ? 2 : 5
  };
  const average = Math.round((Object.values(scores).reduce((sum, value) => sum + value, 0) / Object.keys(scores).length) * 10) / 10;
  return { scores, average };
}

export function reviewTutorResponseQuality({ lesson, support, studentInput = "", tutorResponse = "" }) {
  const review = scoreTutorResponse({ lesson, support, studentInput, tutorResponse });
  const needsExternalResearch =
    containsAny(`${studentInput} ${tutorResponse}`, ["current", "latest", "today", "news", "law", "price", "recent", "web"]) ||
    !containsAny(tutorResponse, [support.summary, lesson.objective, lesson.title]);
  const issues = [];
  if (review.scores.answerPolicy < 5) issues.push("Tutor may be giving an answer instead of teaching the method.");
  if (review.scores.confusionDiagnosis < 4) issues.push("Tutor response does not clearly classify the student's stuck point.");
  if (review.scores.truthRisk < 4) issues.push("Tutor response may use overbroad factual language.");
  if (needsExternalResearch) issues.push("Staff-side source check is recommended before treating this as canonical instruction.");

  return {
    review,
    issues,
    needsExternalResearch,
    approvedTutorMoves: [
      "Name the exact confusion first.",
      "Ground the answer in the lesson objective and teaching support.",
      "Use a diagram, analogy, concrete example, or retry prompt before another hint.",
      "Escalate staff-side web or standards research when the claim is outside stored curriculum."
    ],
    researchPlan: needsExternalResearch
      ? [
          "Check the lesson objective, standards tags, and evidence-guidance notes first.",
          "Use standards_lookup for standards-family grounding.",
          "Use staff-controlled browser or approved web source only when the claim is current, external, or not present in curriculum.",
          "Record source, date checked, and reviewer before updating student-facing content."
        ]
      : []
  };
}

function executeTruthPolicyReview(input) {
  const lesson = findLessonLocal(input.lessonId);
  const support = getLessonTeachingSupportLocal(lesson);
  const studentInput = String(input.studentInput || "");
  const tutorResponse = String(input.tutorResponse || "");
  const quality = reviewTutorResponseQuality({ lesson, support, studentInput, tutorResponse });

  return {
    summary: `Truth-policy review score ${quality.review.average}/5 for ${lesson.title}.`,
    requiresReview: true,
    nextAction: quality.issues.length
      ? "Revise the tutor response, run a lesson audit, and use staff-side standards/web research if the claim is outside the lesson source."
      : "Tutor response is acceptable after human review.",
    data: {
      lessonId: lesson.id,
      studentInput,
      tutorResponse,
      review: quality.review,
      issues: quality.issues,
      needsExternalResearch: quality.needsExternalResearch,
      approvedTutorMoves: quality.approvedTutorMoves,
      researchPlan: quality.researchPlan
    }
  };
}

function inferConfusionProfile(studentInput, support) {
  const input = String(studentInput || "").toLowerCase();
  const signals = [
    {
      type: "vocabulary",
      matched: containsAny(input, ["word", "mean", "term", "definition", "vocab"]),
      why: "The learner may not know what the academic language means yet."
    },
    {
      type: "visual-model",
      matched: containsAny(input, ["picture", "diagram", "model", "line", "graph", "see", "visual"]),
      why: "The learner may need to see the relationship, sequence, or structure."
    },
    {
      type: "first-step",
      matched: containsAny(input, ["start", "first", "begin", "where do i", "step"]),
      why: "The learner may understand the goal but not the first action."
    },
    {
      type: "reasoning",
      matched: containsAny(input, ["why", "because", "reason", "true", "works"]),
      why: "The learner may be memorizing a move without understanding why it works."
    },
    {
      type: "misconception",
      matched: support.commonMisunderstandings.some((item) => containsAny(input, String(item.mistake || "").toLowerCase().split(/\W+/).filter(Boolean))),
      why: "The learner may be using a known wrong rule or surface cue."
    }
  ];
  const matched = signals.filter((signal) => signal.matched);
  return {
    studentInput: studentInput || support.confusionPrompt,
    likelyTypes: (matched.length ? matched : signals.slice(0, 4)).map(({ type, why }) => ({ type, why })),
    interviewQuestion: "Which part is confusing right now: the word, the picture, the first step, the reason, or a mistake you keep making?",
    knownMisunderstandings: support.commonMisunderstandings.map((item) => ({
      misunderstanding: item.mistake,
      repair: item.fix
    }))
  };
}

function createExplanationRoute(mode, lesson, support, confusionProfile) {
  const firstMisunderstanding = support.commonMisunderstandings[0] || {};
  const visualAnchor = lesson.visual?.title || support.diagramCallouts[0]?.title || "main model";
  const routeTemplates = {
    diagnose: {
      teacherMove: `Ask the learner to point to the exact stuck part, then connect it to "${support.summary}".`,
      tutorPrompt: "Tell me if the confusing part is the word, the picture, the first step, the reason, or a mistake you keep making.",
      learnerAction: "Underline or name the stuck point before trying another step."
    },
    visual: {
      teacherMove: `Show the ${visualAnchor}, label the whole, the changing part, and the proof detail before using symbols.`,
      tutorPrompt: `Use the ${visualAnchor}. What do you see first, and what part of the picture does not match the words yet?`,
      learnerAction: "Draw, label, or annotate the model and explain one label."
    },
    metaphor: {
      teacherMove: `Create an age-fit story that preserves the core relationship in "${lesson.objective}".`,
      tutorPrompt: "Would a story help? Tell me what the idea reminds you of, then we will compare what matches and what does not.",
      learnerAction: "Retell the idea as a short story and mark where the metaphor stops working."
    },
    "first-step": {
      teacherMove: `Reduce the task to the first visible action from the guided practice: ${lesson.sections.guided || lesson.sections.activity}.`,
      tutorPrompt: "What is the first thing you can mark, sort, write, or check before solving?",
      learnerAction: "Complete only the first action, then pause for a check."
    },
    "real-world": {
      teacherMove: `Tie the idea to a concrete situation before returning to "${lesson.title}".`,
      tutorPrompt: "Where might this show up outside the lesson? Use that example to explain the same idea.",
      learnerAction: "Solve or explain a real-world mini case using the lesson idea."
    },
    "gentle-quiz": {
      teacherMove: "Ask one low-stakes retrieval question that checks the repaired idea without adding new load.",
      tutorPrompt: "I will ask one quick check. Answer in words first; then we decide what to try next.",
      learnerAction: "Answer one confidence-building retrieval question and explain why."
    },
    "first-principles": {
      teacherMove: "Rebuild from what the object is, what changes, and what must stay true before naming the procedure.",
      tutorPrompt: "What is the basic object? What changes? What must stay true or fair?",
      learnerAction: "Answer the three first-principles questions before using a rule."
    }
  };
  const template = routeTemplates[mode.id] || routeTemplates.diagnose;
  return {
    modeId: mode.id,
    title: mode.title,
    studentLabel: mode.studentLabel,
    bestFor: confusionProfile.likelyTypes.map((item) => item.type).slice(0, 3),
    teacherMove: template.teacherMove,
    tutorPrompt: template.tutorPrompt,
    learnerAction: template.learnerAction,
    misconceptionRepair: firstMisunderstanding.fix || support.helperNotes[0],
    successEvidence: "The learner explains the idea in their own words, uses a model or example, and retries one step without copying."
  };
}

function createVisualVariationPlan(lesson, support, confusionProfile) {
  const basePrompt = `Lesson: ${lesson.title}. Objective: ${lesson.objective}. Student confusion: ${confusionProfile.studentInput}.`;
  return [
    {
      type: "annotated-diagram",
      placement: "teaching-diagram",
      bestFor: "visual-model",
      prompt: `${basePrompt} Create an annotated diagram with 3-5 labeled callouts that reveal the key relationship. Avoid real children and keep text minimal.`,
      accessibility: "Use high contrast, simple labels, and alt text that states the relationship."
    },
    {
      type: "misconception-contrast",
      placement: "misconception-repair",
      bestFor: "misconception",
      prompt: `${basePrompt} Show a side-by-side comparison of the common mistake and the corrected model, with the mistake clearly marked but not shaming.`,
      accessibility: "Do not rely only on color; include shape or label differences."
    },
    {
      type: "process-flow",
      placement: "teacher-mini-lesson",
      bestFor: "first-step",
      prompt: `${basePrompt} Create a simple 3-step flow that shows what to do first, what to check, and what to explain.`,
      accessibility: "Number the steps and keep each step short."
    },
    {
      type: "manipulative-model",
      placement: "hands-on-task",
      bestFor: "reasoning",
      prompt: `${basePrompt} Show a hands-on model using neutral classroom objects that can be built, moved, sorted, or compared.`,
      accessibility: "Describe object positions clearly for screen-reader alt text."
    },
    {
      type: "real-world-scene",
      placement: "transfer-example",
      bestFor: "real-world",
      prompt: `${basePrompt} Create an age-appropriate real-world scene where the same idea is useful and inspectable.`,
      accessibility: "Avoid clutter; the educational object should be the first visual signal."
    },
    {
      type: "first-principles-map",
      placement: "ai-tutor",
      bestFor: "first-principles",
      prompt: `${basePrompt} Create a three-part concept map: what is the object, what changes, and what must stay true.`,
      accessibility: "Use a logical reading order and concise labels."
    }
  ];
}

function executeExplanationVariationStudio(input) {
  const lesson = findLessonLocal(input.lessonId);
  const support = getLessonTeachingSupportLocal(lesson);
  const studentInput = String(input.studentInput || input.confusion || "").trim();
  const confusionProfile = inferConfusionProfile(studentInput, support);
  const explanationRoutes = explanationModes.map((mode) => createExplanationRoute(mode, lesson, support, confusionProfile));
  const visualPlans = createVisualVariationPlan(lesson, support, confusionProfile);

  return {
    summary: `Prepared ${explanationRoutes.length} explanation route(s) and ${visualPlans.length} visual type(s) for ${lesson.title}.`,
    requiresReview: false,
    nextAction: "Run Visual generation planner for selected visuals, use the tutor route in /api/tutor/ask, and run syllabus research if the source claims need web audit.",
    data: {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      ownerAgentId: "teacher-explanation",
      cooperatingAgents: ["student-tutor", "visual-learning", "syllabus-research", "truth-policy", "fun-retention"],
      confusionProfile,
      teacherPlan: {
        launch: lesson.visual
          ? `Open with ${lesson.visual.title} and ask what the learner notices before instruction.`
          : `Open with a concrete object, mystery, or problem tied to "${lesson.objective}".`,
        directInstruction: support.description,
        checkForUnderstanding: [
          "Ask the learner to name the stuck part before the explanation.",
          "Ask the learner to explain the model in their own words.",
          "Ask the learner to retry one step and say why it works."
        ],
        groupTask:
          lesson.groupHomework?.task ||
          "One student draws the model, one explains the rule, one finds a mistake, and one records the final explanation."
      },
      explanationRoutes,
      visualPlans,
      tutorHandoff: {
        firstQuestion: confusionProfile.interviewQuestion,
        modeOrder: explanationRoutes.map((route) => route.modeId),
        switchRule: "If feedback says still-confused, too-hard, or needs-picture, switch to a different route before giving another hint.",
        answerPolicy: "Do not provide final graded answers; require learner explanation, drawing, comparison, or retry evidence."
      },
      webAuditHandoff: {
        staffOnly: true,
        recommendedToolId: "syllabus_misconception_research",
        approvedSourceTargets: syllabusResearchSources.map((source) => ({
          id: source.id,
          name: source.name,
          url: source.url
        })),
        researchQuestions: [
          `What do usual grade ${lesson.grade} ${lesson.subject} syllabi teach immediately before and after "${lesson.unitTitle}"?`,
          "Which parts of this idea do students most often misunderstand, and why?",
          "Which teaching representations or tasks are recommended by official standards, practice guides, or released-item evidence?",
          "What source-backed redesign should be added before this becomes student-facing?"
        ]
      }
    }
  };
}

function scoreFunRetentionLesson(lesson, support) {
  const checks = {
    curiosity: Boolean(lesson.visual || support.confusionPrompt),
    active_build: (lesson.funTasks || []).some((task) => /build|draw|sort|hop|record|design|teach|map|debate|lab|model/i.test(task)),
    visual_model: Boolean(lesson.visual && support.diagramCallouts.length >= 3),
    retrieval: (lesson.retentionChecks || []).length >= 3,
    student_choice: Boolean(lesson.groupHomework || (lesson.funTasks || []).length >= 2 || support.helperNotes.length >= 3),
    mastery_reward: /recall|mastery|transfer|badge|portfolio|unlock/i.test(String(lesson.reward || ""))
  };
  const passed = Object.values(checks).filter(Boolean).length;
  return {
    score: Math.round((passed / funRetentionRubric.length) * 100),
    checks,
    passed,
    possible: funRetentionRubric.length
  };
}

function executeFunRetentionDesign(input) {
  const lesson = findLessonLocal(input.lessonId);
  const support = getLessonTeachingSupportLocal(lesson);
  const rubric = scoreFunRetentionLesson(lesson, support);
  const weakChecks = funRetentionRubric.filter((item) => !rubric.checks[item.id]);
  const redesignMoves = [
    {
      move: "Add a curiosity hook",
      detail: lesson.visual
        ? `Open with the ${lesson.visual.title} and ask what the learner notices before instruction.`
        : `Open with a concrete object, mystery, or image tied to "${lesson.objective}".`
    },
    {
      move: "Make it active",
      detail: (lesson.funTasks || [lesson.sections.activity])[0] || "Ask the learner to build, draw, sort, diagnose, or teach the idea."
    },
    {
      move: "Use misconception repair",
      detail: support.commonMisunderstandings[0]?.fix || lesson.sections.reteach
    },
    {
      move: "Tie rewards to retention",
      detail: lesson.reward || "Unlock the reward only after a delayed recall or transfer check."
    }
  ];

  return {
    summary: `${lesson.title} fun-retention score ${rubric.score}/100 with ${rubric.passed}/${rubric.possible} rubric checks passing.`,
    requiresReview: rubric.score < 80,
    nextAction: weakChecks.length
      ? `Improve: ${weakChecks.map((item) => item.label).join(", ")}.`
      : "Keep collecting student feedback and delayed recall data before scaling this lesson pattern.",
    data: {
      lessonId: lesson.id,
      objective: lesson.objective,
      rubric,
      rubricQuestions: funRetentionRubric,
      redesignMoves,
      retentionPlan: lesson.retentionChecks || [],
      rewardRule: lesson.reward || "Reward must require delayed recall or transfer.",
      firstPrinciplesTeachingPrompt: [
        "What is the basic object, quantity, claim, or system?",
        "What changes?",
        "What must stay true?"
      ]
    }
  };
}

function executeSyllabusMisconceptionResearch(input) {
  const lesson = findLessonLocal(input.lessonId);
  const support = getLessonTeachingSupportLocal(lesson);
  const subject = String(input.subject || lesson.subject || "").toLowerCase();
  const grade = String(input.grade || lesson.grade || "");
  const gradeNumber = Number(grade);
  const gradeBand = Number.isFinite(gradeNumber) ? (gradeNumber <= 5 ? "K-5" : gradeNumber <= 8 ? "6-8" : "9-12") : "K-5";
  const standardsMatches = standardsFrameworks.filter((framework) => {
    const haystack = [framework.id, framework.name, framework.purpose, ...(framework.subjects || [])].join(" ").toLowerCase();
    return haystack.includes(subject) || lesson.standards?.includes(framework.id);
  });
  const sourceLedger = syllabusResearchFindings.filter((finding) => {
    const subjectMatch = finding.subjects.includes(subject || lesson.subject) || finding.subjects.includes(lesson.subject);
    const bandMatch = finding.gradeBands.includes(gradeBand);
    const standardsMatch = standardsMatches.some((framework) => finding.sourceId.includes(framework.id) || finding.claim.toLowerCase().includes(framework.name.toLowerCase()));
    return (subjectMatch && bandMatch) || standardsMatch;
  });
  const difficultParts = support.commonMisunderstandings.map((item) => ({
    likelyTrouble: item.mistake,
    whyItIsHard: "The learner may be using a surface cue or memorized procedure instead of the underlying relationship.",
    betterApproach: item.fix
  }));
  const leastDifficultParts = [
    {
      likelyEasier: support.summary,
      whyItIsEasier: "This is the plain-language anchor the learner can repeat before moving into representations or procedures."
    }
  ];
  const sourceDrivenTasks = sourceLedger.map((finding, index) => ({
    id: `redesign-${lesson.id}-${finding.sourceId}-${index + 1}`,
    title: `Apply ${finding.sourceName}`,
    why: finding.troubleSignal,
    change: finding.redesignMove,
    sourceIds: [finding.sourceId],
    status: "research-review",
    acceptanceCriteria: [
      "Staff reviewer confirms the source claim is appropriate for this lesson.",
      "Lesson draft adds the redesign move without increasing cognitive overload.",
      "Student retry prompt asks for explanation, model, or transfer evidence."
    ]
  }));
  const misconceptionTasks = difficultParts.map((part, index) => ({
    id: `redesign-${lesson.id}-misconception-${index + 1}`,
    title: `Repair likely misconception: ${part.likelyTrouble}`,
    why: part.whyItIsHard,
    change: part.betterApproach,
    sourceIds: sourceLedger.map((finding) => finding.sourceId).slice(0, 3),
    status: "research-review",
    acceptanceCriteria: [
      "Lesson includes an example and non-example.",
      "Tutor asks the student to explain the mistaken idea before correcting it.",
      "Reteach path uses a different representation than the first explanation."
    ]
  }));
  const redesignTasks = [...misconceptionTasks, ...sourceDrivenTasks].slice(0, 8);
  const sourceCoverage = {
    approvedSourceTargets: syllabusResearchSources.length,
    ledgerFindings: sourceLedger.length,
    verifiedFindings: sourceLedger.filter((finding) => finding.status !== "needs-review").length,
    sourceIds: [...new Set(sourceLedger.map((finding) => finding.sourceId))]
  };

  return {
    summary: `Prepared staff research plan for Grade ${grade} ${subject || lesson.subject}: ${lesson.title} with ${sourceLedger.length} source finding(s) and ${redesignTasks.length} redesign task(s).`,
    requiresReview: true,
    nextAction:
      "Staff should verify source notes, compare the usual syllabus sequence, add misconception evidence, and approve changes before student-facing publication.",
    data: {
      lessonId: lesson.id,
      grade,
      subject: subject || lesson.subject,
      usualSyllabusQuestions: [
        `What do common U.S. grade ${grade} ${subject || lesson.subject} syllabi teach before and after "${lesson.unitTitle}"?`,
        "Which standards or course maps treat this as major work, supporting work, or enrichment?",
        "Which released items, practice guides, or curriculum notes identify common errors?",
        "What prerequisite gap usually explains the struggle?",
        "What first-principles explanation would rebuild the idea from definitions, evidence, or relationships?"
      ],
      likelyMostDifficult: difficultParts,
      likelyLeastDifficult: leastDifficultParts,
      sourceCoverage,
      sourceLedger,
      redesignTasks,
      redesignHypotheses: [
        "Start from a concrete visual or phenomenon before symbols.",
        "Ask the student to explain the misconception in their own words before correction.",
        "Use first-principles questions before formulas, shortcuts, or memorized definitions.",
        "Compare examples and non-examples to expose the boundary of the idea.",
        "Measure whether the redesign improves delayed recall, not just immediate quiz score."
      ],
      approvedSourceCatalog: syllabusResearchSources,
      standardsMatches,
      studentInterviewQuestions: [
        "What part feels confusing: the word, the picture, the first step, or the reason?",
        "What do you think the problem is asking you to find or prove?",
        "What do you already know that must stay true?",
        "Where did your thinking stop?",
        "Would a picture, story, real example, first step, or quick check help most?"
      ],
      staffOnly: true
    }
  };
}

function executeLiveCurriculumSourceAudit(input) {
  const lesson = findLessonLocal(input.lessonId);
  const sourceUrl = String(input.sourceUrl || "").trim();
  const approved = isApprovedLiveSourceUrl(sourceUrl);
  return {
    summary: approved
      ? `Prepared live source audit request for ${lesson.title}.`
      : "Live source audit request needs an approved HTTPS curriculum source URL.",
    requiresReview: true,
    nextAction: approved
      ? "Server should fetch the source, extract evidence snippets, and keep findings in manager review before lesson changes."
      : "Choose an approved source target from the allowlist before running live web audit.",
    data: {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      subject: input.subject || lesson.subject,
      grade: input.grade || lesson.grade,
      sourceUrl,
      approved,
      staffOnly: true,
      approvedSourceTargets: getApprovedLiveSourceTargets(),
      liveAudit: null,
      sourceLedger: [],
      redesignTasks: []
    }
  };
}

export function executeToolGateway(state, request = {}) {
  const tool = toolRegistry.find((item) => item.id === request.toolId);
  const role = normalizeRole(request.role || "platform-admin");
  const authorization = authorizeTool(tool, role);

  if (!authorization.allowed) {
    const result = {
      accepted: false,
      summary: authorization.reason,
      reason: authorization.reason,
      data: {}
    };
    const log = createToolLog({ tool, role, input: request, result, status: "blocked" });
    return {
      state: {
        ...state,
        toolCallLogs: [log, ...(state.toolCallLogs || [])].slice(0, 80)
      },
      result,
      log
    };
  }

  const input = request.input || {};
  let payload;
  if (tool.id === "visual_generation") {
    payload = executeVisualGeneration(state, input);
  } else if (tool.id === "lesson_audit") {
    payload = executeLessonAudit(input);
  } else if (tool.id === "content_review") {
    payload = executeContentReview(state);
  } else if (tool.id === "browser_preview_check") {
    payload = executeBrowserPreviewCheck();
  } else if (tool.id === "curriculum_export") {
    payload = executeCurriculumExport();
  } else if (tool.id === "standards_lookup") {
    payload = executeStandardsLookup(input);
  } else if (tool.id === "truth_policy_review") {
    payload = executeTruthPolicyReview(input);
  } else if (tool.id === "explanation_variation_studio") {
    payload = executeExplanationVariationStudio(input);
  } else if (tool.id === "fun_retention_design") {
    payload = executeFunRetentionDesign(input);
  } else if (tool.id === "syllabus_misconception_research") {
    payload = executeSyllabusMisconceptionResearch(input);
  } else if (tool.id === "live_curriculum_source_audit") {
    payload = executeLiveCurriculumSourceAudit(input);
  } else {
    payload = {
      summary: "Tool has no execution handler yet.",
      requiresReview: true,
      nextAction: "Add a handler before enabling this tool.",
      data: {}
    };
  }

  const result = {
    accepted: true,
    toolId: tool.id,
    toolName: tool.name,
    ownerAgentId: tool.ownerAgentId,
    role,
    externalRisk: tool.externalRisk,
    requiresHumanReview: tool.requiresHumanReview || payload.requiresReview,
    ...payload
  };
  const log = createToolLog({ tool, role, input: request, result, status: "completed" });

  return {
    state: {
      ...state,
      toolCallLogs: [log, ...(state.toolCallLogs || [])].slice(0, 80)
    },
    result,
    log
  };
}
