import { curriculum } from "./data.js";

const subjectBlueprints = {
  ela: {
    task: "read, annotate, discuss evidence, and publish a short response",
    visual: "story map, claim-evidence organizer, or vocabulary image",
    misconception: "The learner may retell details without naming the central idea or claim."
  },
  writing: {
    task: "plan, draft, revise, conference, and publish",
    visual: "writing process board or paragraph structure diagram",
    misconception: "The learner may add more sentences without improving structure or evidence."
  },
  math: {
    task: "model, solve, explain, compare strategies, and retrieve later",
    visual: "concrete-to-visual-to-symbolic diagram",
    misconception: "The learner may follow a procedure without connecting it to the model."
  },
  science: {
    task: "observe, model, investigate, record data, and argue from evidence",
    visual: "system diagram, lab setup, cycle, or cause-effect model",
    misconception: "The learner may remember labels without explaining how the system works."
  },
  "social-studies": {
    task: "source, map, compare perspectives, discuss cause and effect, and create a civic product",
    visual: "timeline, map, primary-source frame, or decision diagram",
    misconception: "The learner may memorize facts without using evidence or context."
  },
  "health-pe": {
    task: "practice, reflect, set a goal, and connect the habit to wellness",
    visual: "routine card, body-systems diagram, or safety sequence",
    misconception: "The learner may treat wellness as a rule instead of a habit they can practice."
  },
  "arts-media": {
    task: "study a model, create, critique, revise, and share",
    visual: "composition guide, media storyboard, or music pattern diagram",
    misconception: "The learner may copy a style without making intentional choices."
  },
  "computer-science": {
    task: "predict, build, debug, explain, and improve",
    visual: "flowchart, algorithm trace, interface sketch, or data model",
    misconception: "The learner may think debugging means guessing instead of testing a cause."
  },
  "life-skills": {
    task: "role-play, plan, practice, reflect, and apply in a real situation",
    visual: "decision tree, checklist, or reflection map",
    misconception: "The learner may know the words but not practice the behavior."
  },
  "career-college": {
    task: "research, compare options, build an artifact, and defend a decision",
    visual: "portfolio map, finance model, application timeline, or career pathway chart",
    misconception: "The learner may choose a path without evidence about cost, fit, or next actions."
  }
};

function slug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function academyRange(academyId) {
  if (academyId === "bridge") return "6-8";
  if (academyId === "scholar") return "9-12";
  return "K-5";
}

function agePattern(academyId) {
  if (academyId === "foundation") {
    return {
      lessonMinutes: 18,
      activityMode: "play, movement, story, manipulatives, drawing, and parent talk",
      reward: "unlock a creative choice after next-day recall",
      group: null
    };
  }
  if (academyId === "bridge") {
    return {
      lessonMinutes: 32,
      activityMode: "quest task, partner explanation, mini project, and planner reflection",
      reward: "unlock a skill-tree badge after explanation plus delayed retrieval",
      group: "3-4 learner crew with facilitator, evidence keeper, visual builder, and reporter"
    };
  }
  return {
    lessonMinutes: 45,
    activityMode: "course task, seminar or lab evidence, portfolio artifact, and transfer problem",
    reward: "unlock a portfolio marker after transfer and delayed recall",
    group: "3-5 learner team with project lead, researcher, analyst, designer, and reviewer"
  };
}

function unitEntries() {
  const entries = [];
  for (const academy of curriculum.academies) {
    for (const grade of academy.grades) {
      for (const course of grade.courses) {
        for (const unit of course.units) {
          entries.push({ academy, grade, course, unit });
        }
      }
    }
  }
  return entries;
}

function allocateLessonCounts(entries) {
  const target = curriculum.totalTargetLessons;
  const rawTotal = entries.reduce((sum, entry) => sum + entry.unit.lessonTarget, 0);
  const scale = target / rawTotal;
  const allocations = entries.map((entry) => ({
    ...entry,
    allocatedLessons: Math.max(6, Math.floor(entry.unit.lessonTarget * scale))
  }));
  let remaining = target - allocations.reduce((sum, entry) => sum + entry.allocatedLessons, 0);
  let index = 0;
  while (remaining > 0) {
    allocations[index % allocations.length].allocatedLessons += 1;
    remaining -= 1;
    index += 1;
  }
  return allocations;
}

function buildLesson(entry, index) {
  const blueprint = subjectBlueprints[entry.course.subject] || subjectBlueprints.ela;
  const age = agePattern(entry.academy.id);
  const lessonNumber = index + 1;
  const title = `${entry.unit.title}: ${lessonNumber}. ${entry.course.title} learning mission`;
  return {
    id: `${entry.unit.id}-l${lessonNumber}`.replace(/[^a-z0-9-]+/gi, "-").toLowerCase(),
    title,
    gradeBand: academyRange(entry.academy.id),
    academyId: entry.academy.id,
    gradeLevel: entry.grade.grade,
    subject: entry.course.subject,
    courseId: entry.course.id,
    courseTitle: entry.course.title,
    unitId: entry.unit.id,
    unitTitle: entry.unit.title,
    lessonNumber,
    estimatedMinutes: age.lessonMinutes,
    learningObjective: `Use ${entry.unit.title.toLowerCase()} ideas to ${blueprint.task}.`,
    essentialQuestion: `How does ${entry.unit.title.toLowerCase()} help us understand or solve a real problem?`,
    visualRequirement: blueprint.visual,
    interestingTask: age.activityMode,
    helperNotes: [
      "Start with what the learner notices before naming the academic rule.",
      "Ask for an explanation in the learner's words before scoring mastery.",
      "Schedule retrieval after the lesson so rewards depend on retention."
    ],
    commonMisunderstanding: blueprint.misconception,
    groupHomework: age.group,
    reward: age.reward,
    masteryThreshold: 80,
    standardsTags: entry.course.standards,
    status: "planned"
  };
}

export function getFullLessonLibrary() {
  return allocateLessonCounts(unitEntries()).flatMap((entry) =>
    Array.from({ length: entry.allocatedLessons }, (_, index) => buildLesson(entry, index))
  );
}

export function getLessonLibrarySummary() {
  const lessons = getFullLessonLibrary();
  const byAcademy = lessons.reduce((totals, lesson) => {
    totals[lesson.academyId] = (totals[lesson.academyId] || 0) + 1;
    return totals;
  }, {});
  const byGrade = lessons.reduce((totals, lesson) => {
    totals[lesson.gradeLevel] = (totals[lesson.gradeLevel] || 0) + 1;
    return totals;
  }, {});
  const bySubject = lessons.reduce((totals, lesson) => {
    totals[lesson.subject] = (totals[lesson.subject] || 0) + 1;
    return totals;
  }, {});
  const visualReady = lessons.filter((lesson) => lesson.visualRequirement).length;
  const groupHomeworkReady = lessons.filter((lesson) => ["6-8", "9-12"].includes(lesson.gradeBand) && lesson.groupHomework).length;
  return {
    generatedLessonCount: lessons.length,
    targetLessonCount: curriculum.totalTargetLessons,
    unitCount: unitEntries().length,
    byAcademy,
    byGrade,
    bySubject,
    visualReady,
    groupHomeworkReady,
    helperNotesReady: lessons.every((lesson) => lesson.helperNotes.length >= 3),
    readinessPassed:
      lessons.length === curriculum.totalTargetLessons &&
      visualReady === lessons.length &&
      groupHomeworkReady === lessons.filter((lesson) => ["6-8", "9-12"].includes(lesson.gradeBand)).length
  };
}

export function getLessonLibrarySamples(limit = 12) {
  const lessons = getFullLessonLibrary();
  const anchors = ["K", "3", "6", "8", "9", "12"];
  const selected = [];
  for (const grade of anchors) {
    const match = lessons.find((lesson) => lesson.gradeLevel === grade && !selected.some((item) => item.id === lesson.id));
    if (match) selected.push(match);
  }
  return [...selected, ...lessons.filter((lesson) => !selected.some((item) => item.id === lesson.id))].slice(0, limit);
}

function batchPriority(academyId) {
  if (academyId === "bridge") return 1;
  if (academyId === "foundation") return 2;
  return 3;
}

function productionWave(academyId) {
  if (academyId === "bridge") return "Wave 1: sellable middle-school classroom wedge";
  if (academyId === "foundation") return "Wave 2: parent-guided elementary academy";
  return "Wave 3: credit and portfolio high-school academy";
}

function chunkLessons(lessons, size) {
  const chunks = [];
  for (let index = 0; index < lessons.length; index += size) {
    chunks.push(lessons.slice(index, index + size));
  }
  return chunks;
}

function summarizeBatch(lessons, index, totalChunks) {
  const first = lessons[0];
  const standards = [...new Set(lessons.flatMap((lesson) => lesson.standardsTags || []))];
  return {
    id: `${first.academyId}-${slug(first.gradeLevel)}-${first.courseId}-${first.unitId}-batch-${index + 1}`,
    title: `${first.courseTitle}: ${first.unitTitle}${totalChunks > 1 ? ` (${index + 1}/${totalChunks})` : ""}`,
    academyId: first.academyId,
    gradeBand: first.gradeBand,
    gradeLevel: first.gradeLevel,
    subject: first.subject,
    courseId: first.courseId,
    courseTitle: first.courseTitle,
    unitId: first.unitId,
    unitTitle: first.unitTitle,
    lessonCount: lessons.length,
    estimatedMinutes: lessons.reduce((sum, lesson) => sum + lesson.estimatedMinutes, 0),
    visualRequirementCount: lessons.filter((lesson) => lesson.visualRequirement).length,
    helperNotesReadyCount: lessons.filter((lesson) => lesson.helperNotes?.length >= 3).length,
    groupHomeworkCount: lessons.filter((lesson) => lesson.groupHomework).length,
    standardsTags: standards,
    productionWave: productionWave(first.academyId),
    priority: batchPriority(first.academyId),
    reviewSteps: ["author lesson draft", "truth and standards review", "visual prompt review", "quiz/mastery QA", "publish"],
    status: "planned",
    sampleLessonIds: lessons.slice(0, 3).map((lesson) => lesson.id)
  };
}

export function getLessonProductionBatchPlan({ batchSize = 24, limit } = {}) {
  const lessons = getFullLessonLibrary();
  const grouped = lessons.reduce((groups, lesson) => {
    const key = [lesson.academyId, lesson.gradeLevel, lesson.courseId, lesson.unitId].join("|");
    groups.set(key, [...(groups.get(key) || []), lesson]);
    return groups;
  }, new Map());

  const batches = [...grouped.values()]
    .flatMap((group) => {
      const chunks = chunkLessons(group, Math.max(6, batchSize));
      return chunks.map((chunk, index) => summarizeBatch(chunk, index, chunks.length));
    })
    .sort(
      (a, b) =>
        a.priority - b.priority ||
        Number(String(a.gradeLevel).replace("K", "0")) - Number(String(b.gradeLevel).replace("K", "0")) ||
        a.subject.localeCompare(b.subject) ||
        a.courseTitle.localeCompare(b.courseTitle) ||
        a.unitTitle.localeCompare(b.unitTitle)
    );

  const selectedBatches = typeof limit === "number" ? batches.slice(0, limit) : batches;
  const firstWave = batches.filter((batch) => batch.academyId === "bridge");
  const studentFacingLessonCount = lessons.length;
  return {
    batchSize: Math.max(6, batchSize),
    totalBatches: batches.length,
    totalLessons: studentFacingLessonCount,
    firstWaveBatchCount: firstWave.length,
    firstWaveLessonCount: firstWave.reduce((sum, batch) => sum + batch.lessonCount, 0),
    reviewGateCount: batches.reduce((sum, batch) => sum + batch.reviewSteps.length, 0),
    visualRequirementCount: batches.reduce((sum, batch) => sum + batch.visualRequirementCount, 0),
    groupHomeworkCount: batches.reduce((sum, batch) => sum + batch.groupHomeworkCount, 0),
    waves: [
      {
        id: "bridge",
        label: productionWave("bridge"),
        batchCount: firstWave.length,
        lessonCount: firstWave.reduce((sum, batch) => sum + batch.lessonCount, 0)
      },
      {
        id: "foundation",
        label: productionWave("foundation"),
        batchCount: batches.filter((batch) => batch.academyId === "foundation").length,
        lessonCount: batches.filter((batch) => batch.academyId === "foundation").reduce((sum, batch) => sum + batch.lessonCount, 0)
      },
      {
        id: "scholar",
        label: productionWave("scholar"),
        batchCount: batches.filter((batch) => batch.academyId === "scholar").length,
        lessonCount: batches.filter((batch) => batch.academyId === "scholar").reduce((sum, batch) => sum + batch.lessonCount, 0)
      }
    ],
    batches: selectedBatches
  };
}
