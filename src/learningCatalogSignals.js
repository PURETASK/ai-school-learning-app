function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeSignal(row = {}, lesson = {}) {
  const skillId = row.skillId || row.skill_id || "";
  const skillLabel = row.skillLabel || row.skill_label || skillId || "Interactive skill";
  const updatedAt = row.updatedAt || row.updated_at || "";
  const recommendedSupport = row.recommendedSupport || row.recommended_support || "";
  return {
    id: row.id || `${lesson.id || row.lessonId || row.lesson_id || "lesson"}:${skillId || row.widgetId || row.widget_id || "skill"}`,
    learnerId: row.learnerId || row.studentId || row.student_id || "",
    lessonId: lesson.id || row.lessonId || row.lesson_id || "",
    lessonTitle: lesson.title || row.lessonTitle || row.lesson_title || "Lesson",
    widgetId: row.widgetId || row.widget_id || "",
    skillId,
    skillLabel,
    status: row.status || "unknown",
    correct: Boolean(row.correct),
    attempts: Number(row.attempts || 0),
    value: row.value || "",
    diagnosis: row.diagnosis || "",
    recommendedSupport,
    evidenceStrength: row.evidenceStrength || row.evidence_strength || "",
    updatedAt
  };
}

export function getLearningCatalogInteractiveSignals(catalog = {}, options = {}) {
  const lessonId = options.lessonId || "";
  const learnerId = options.learnerId || "";
  const limit = Number.isFinite(Number(options.limit)) ? Math.max(0, Number(options.limit)) : 0;
  const lessons = asArray(catalog.lessons);
  const signals = lessons
    .filter((lesson) => !lessonId || lesson.id === lessonId)
    .flatMap((lesson) => asArray(lesson.interactiveSkillEvidence).map((row) => normalizeSignal(row, lesson)))
    .filter((signal) => !learnerId || !signal.learnerId || signal.learnerId === learnerId)
    .sort((left, right) => String(right.updatedAt || "").localeCompare(String(left.updatedAt || "")));
  const visibleSignals = limit ? signals.slice(0, limit) : signals;
  const secure = signals.filter((signal) => signal.status === "secure" || signal.correct).length;
  const needsSupport = signals.filter((signal) => signal.status === "needs-support" || signal.status === "needs_support" || signal.status === "retry").length;

  return {
    total: signals.length,
    secure,
    needsSupport,
    latest: signals[0] || null,
    signals: visibleSignals,
    lessonCount: new Set(signals.map((signal) => signal.lessonId).filter(Boolean)).size
  };
}

function normalizeQuizMasteryEvidence(lesson = {}) {
  const latestAttempt = lesson.latestAttempt || null;
  const mastery = lesson.mastery || null;
  return {
    lessonId: lesson.id || "",
    lessonTitle: lesson.title || "Lesson",
    quizAttemptId: latestAttempt?.id || "",
    quizScore: Number(latestAttempt?.score || 0),
    quizPassed: Boolean(latestAttempt?.passed),
    quizAttemptedAt: latestAttempt?.attemptedAt || latestAttempt?.attempted_at || "",
    masterySkillTag: mastery?.skillTag || mastery?.skill_tag || "",
    masteryScore: Number(mastery?.score || 0),
    masteryStatus: mastery?.status || "",
    masteryAttempts: Number(mastery?.attempts || 0),
    masteryEvidence: mastery?.evidence || "",
    masteryUpdatedAt: mastery?.updatedAt || mastery?.updated_at || "",
    hasQuizAttempt: Boolean(latestAttempt),
    hasMastery: Boolean(mastery)
  };
}

export function getLearningCatalogQuizMasterySummary(catalog = {}, options = {}) {
  const lessonId = options.lessonId || "";
  const limit = Number.isFinite(Number(options.limit)) ? Math.max(0, Number(options.limit)) : 0;
  const lessons = asArray(catalog.lessons);
  const evidence = lessons
    .filter((lesson) => !lessonId || lesson.id === lessonId)
    .map(normalizeQuizMasteryEvidence)
    .filter((item) => item.hasQuizAttempt || item.hasMastery)
    .sort((left, right) =>
      String(right.quizAttemptedAt || right.masteryUpdatedAt || "").localeCompare(String(left.quizAttemptedAt || left.masteryUpdatedAt || ""))
    );
  const visibleEvidence = limit ? evidence.slice(0, limit) : evidence;
  const quizAttempts = evidence.filter((item) => item.hasQuizAttempt);
  const masteryRows = evidence.filter((item) => item.hasMastery);
  const mastered = masteryRows.filter((item) => item.masteryStatus === "mastered" || item.masteryScore >= 80).length;
  const needsReview = masteryRows.filter((item) => item.masteryStatus && item.masteryStatus !== "mastered" && item.masteryScore < 80).length;
  const averageQuizScore = quizAttempts.length
    ? Math.round(quizAttempts.reduce((sum, item) => sum + item.quizScore, 0) / quizAttempts.length)
    : 0;
  const averageMasteryScore = masteryRows.length
    ? Math.round(masteryRows.reduce((sum, item) => sum + item.masteryScore, 0) / masteryRows.length)
    : 0;

  return {
    total: evidence.length,
    quizAttempts: quizAttempts.length,
    quizPassed: quizAttempts.filter((item) => item.quizPassed).length,
    averageQuizScore,
    masteryRecords: masteryRows.length,
    mastered,
    needsReview,
    averageMasteryScore,
    latest: evidence[0] || null,
    evidence: visibleEvidence
  };
}
