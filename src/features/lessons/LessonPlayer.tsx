import type { Lesson, LessonFlow, LessonFlowSection } from "@/types/lesson";

export type LessonSectionKey =
  | keyof LessonFlow
  | "masteryScore"
  | "spacedReviewScheduling"
  | "reteachOrChallengePath";

export type LessonSectionDefinition = {
  key: LessonSectionKey;
  label: string;
  pillar: string;
  source: "lessonFlow" | "derived";
};

export const LESSON_SECTION_ORDER: LessonSectionDefinition[] = [
  { key: "hook", label: "Hook", pillar: "Engagement", source: "lessonFlow" },
  { key: "learningGoal", label: "Learning Goal", pillar: "Clarity", source: "lessonFlow" },
  { key: "miniTeach", label: "Mini Teach", pillar: "Instruction", source: "lessonFlow" },
  { key: "firstPrinciplesBreakdown", label: "First-Principles Breakdown", pillar: "Problem Solving", source: "lessonFlow" },
  { key: "workedExample", label: "Worked Example", pillar: "Cognitive Load", source: "lessonFlow" },
  { key: "guidedPractice", label: "Guided Practice", pillar: "Active Practice", source: "lessonFlow" },
  { key: "criticalThinkingCheckpoint", label: "Critical Thinking Checkpoint", pillar: "Critical Thinking", source: "lessonFlow" },
  { key: "evidenceBasedReasoningTask", label: "Evidence-Based Reasoning Task", pillar: "Evidence", source: "lessonFlow" },
  { key: "interpretationOrDiscussionTask", label: "Interpretation / Discussion Task", pillar: "Dialogue", source: "lessonFlow" },
  { key: "activePractice", label: "Active Practice", pillar: "Application", source: "lessonFlow" },
  { key: "retrievalCheck", label: "Retrieval Check", pillar: "Retention", source: "lessonFlow" },
  { key: "feedback", label: "Feedback", pillar: "Adaptive Feedback", source: "lessonFlow" },
  { key: "masteryScore", label: "Mastery Score", pillar: "Adaptive Mastery", source: "derived" },
  { key: "spacedReviewScheduling", label: "Spaced Review Scheduling", pillar: "Memory Vault", source: "derived" },
  { key: "reflection", label: "Reflection", pillar: "Metacognition", source: "lessonFlow" },
  { key: "reteachOrChallengePath", label: "Reteach or Challenge Path", pillar: "Adaptive Pathways", source: "derived" },
];

export const LESSON_SECTION_COUNT = LESSON_SECTION_ORDER.length;

export type LessonPlayerProps = {
  lesson: Lesson;
  sectionIndex: number;
  completedSectionKeys: string[];
  onNext: () => void;
  onBack: () => void;
  onGoToQuiz: () => void;
  onJumpToSection: (sectionIndex: number) => void;
  onMarkSectionComplete: (sectionKey: string) => void;
};

export function LessonPlayer({ lesson, sectionIndex, completedSectionKeys, onNext, onBack, onGoToQuiz, onJumpToSection, onMarkSectionComplete }: LessonPlayerProps) {
  const boundedIndex = Math.max(0, Math.min(sectionIndex, LESSON_SECTION_ORDER.length - 1));
  const current = LESSON_SECTION_ORDER[boundedIndex];
  const section = getSectionContent(lesson, current);
  const uniqueCompletedCount = new Set(completedSectionKeys).size;
  const currentWillCount = completedSectionKeys.includes(String(current.key)) ? 0 : 1;
  const progress = Math.round(((uniqueCompletedCount + currentWillCount) / LESSON_SECTION_ORDER.length) * 100);
  const allSectionsVisited = uniqueCompletedCount >= LESSON_SECTION_ORDER.length - 1;

  function handleNext() {
    onMarkSectionComplete(String(current.key));
    onNext();
  }

  function handleQuiz() {
    onMarkSectionComplete(String(current.key));
    onGoToQuiz();
  }

  return (
    <section className="space-y-6" aria-labelledby="lesson-player-title">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Lesson Player</p>
            <h1 id="lesson-player-title" className="mt-2 text-3xl font-bold text-slate-950">{lesson.title}</h1>
            <p className="mt-2 text-slate-600">{lesson.course} · {lesson.unit}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm ring-1 ring-slate-200" aria-live="polite">
            <strong>{progress}%</strong> lesson flow progress · {LESSON_SECTION_COUNT} required sections
          </div>
        </div>
        <div className="mt-5 h-2 rounded-full bg-slate-100" aria-hidden="true">
          <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${Math.min(100, progress)}%` }} />
        </div>
        <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
          <Info label="Objective" value={lesson.learningObjective} />
          <Info label="Essential Question" value={lesson.essentialQuestion} />
          <Info label="Thinking Skills" value={lesson.thinkingSkillTags.slice(0, 4).join(" · ")} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
        <nav className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200" aria-label="Lesson sections">
          <ol className="space-y-2">
            {LESSON_SECTION_ORDER.map((item, index) => {
              const isCurrent = index === boundedIndex;
              const isCompleted = completedSectionKeys.includes(String(item.key));
              return (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => onJumpToSection(index)}
                    className={`w-full rounded-2xl px-3 py-2 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      isCurrent ? "bg-indigo-50 font-semibold text-indigo-900" : isCompleted ? "bg-emerald-50 text-emerald-900" : "text-slate-600 hover:bg-slate-50"
                    }`}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    <span className="block">{index + 1}. {item.label}</span>
                    <span className="text-xs opacity-75">{item.pillar}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Section {boundedIndex + 1} of {LESSON_SECTION_ORDER.length} · {current.pillar}</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">{current.label}</h2>
          {section ? <SectionContent section={section} /> : <MissingSection sectionName={current.label} />}

          <div className="mt-8 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-200">
            <p className="font-semibold text-slate-900">Completion cue</p>
            <p className="mt-1">Before continuing, the student should be able to explain the main idea of this section in one sentence.</p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={onBack}
              disabled={boundedIndex === 0}
              className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Back
            </button>
            {boundedIndex === LESSON_SECTION_ORDER.length - 1 ? (
              <button
                type="button"
                onClick={handleQuiz}
                className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-describedby="quiz-readiness-note"
              >
                Continue to quiz
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Mark complete and continue
              </button>
            )}
          </div>
          <p id="quiz-readiness-note" className="sr-only">
            {allSectionsVisited ? "All lesson sections have been visited." : "Some lesson sections may still need review before quiz submission."}
          </p>
        </article>
      </div>
    </section>
  );
}

function getSectionContent(lesson: Lesson, definition: LessonSectionDefinition): LessonFlowSection | undefined {
  if (definition.source === "lessonFlow") {
    return lesson.lessonFlow[definition.key as keyof LessonFlow];
  }

  if (definition.key === "masteryScore") {
    return {
      content: "The mastery score will be calculated after the quiz using the official mastery bands.",
      masteryThreshold: `${lesson.mastery.masteryThreshold}%`,
      advancedThreshold: `${lesson.mastery.advancedThreshold}%`,
      minimumEvidence: lesson.mastery.minimumEvidence,
      weights: lesson.mastery.weights,
      successCriteria: [
        "Student understands that mastery is based on evidence, not completion alone.",
        "Student knows that weak areas trigger reteach and strong evidence triggers challenge work.",
      ],
    };
  }

  if (definition.key === "spacedReviewScheduling") {
    return {
      content: "When the lesson quiz is submitted, Memory Vault review items are scheduled automatically.",
      reviewSchedule: "Day 1, Day 3, Day 7, Day 14, Day 30",
      itemsCreated: lesson.memoryVaultItems.map((item) => ({
        prompt: item.prompt,
        skillTag: item.skillTag,
        scheduleDays: item.scheduleDays,
      })),
      successCriteria: [
        "Student sees that learning returns later through spaced retrieval.",
        "Parent dashboard can display the scheduled review plan.",
      ],
    };
  }

  if (definition.key === "reteachOrChallengePath") {
    return {
      content: "The next path depends on mastery evidence after the quiz.",
      reteachPath: lesson.reteachPath,
      challengePath: lesson.challengePath,
      successCriteria: [
        "Below 80% routes to guided practice or reteach.",
        "90% or higher unlocks the challenge path.",
        "80–89% schedules spaced review without skipping retention.",
      ],
    };
  }

  return undefined;
}

function SectionContent({ section }: { section: LessonFlowSection }) {
  const entries = Object.entries(section).filter(([, value]) => value !== undefined && value !== null && value !== "");
  return (
    <div className="mt-5 space-y-4">
      {entries.map(([key, value]) => (
        <div key={key} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <h3 className="text-sm font-semibold capitalize text-slate-700">{formatKey(key)}</h3>
          <div className="mt-2 text-sm leading-6 text-slate-700">
            <RenderValue value={value} />
          </div>
        </div>
      ))}
    </div>
  );
}

function RenderValue({ value }: { value: unknown }) {
  if (Array.isArray(value)) {
    return (
      <ul className="list-disc space-y-1 pl-5">
        {value.map((item, index) => <li key={index}><RenderValue value={item} /></li>)}
      </ul>
    );
  }
  if (typeof value === "object" && value !== null) {
    return (
      <dl className="space-y-2">
        {Object.entries(value).map(([key, child]) => (
          <div key={key}>
            <dt className="font-semibold text-slate-800">{formatKey(key)}</dt>
            <dd><RenderValue value={child} /></dd>
          </div>
        ))}
      </dl>
    );
  }
  return <p>{String(value)}</p>;
}

function MissingSection({ sectionName }: { sectionName: string }) {
  return (
    <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-950 ring-1 ring-amber-200">
      Missing section data for {sectionName}. Validate the lesson JSON before publishing.
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 line-clamp-3 text-slate-700">{value}</p>
    </div>
  );
}

function formatKey(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim();
}
