import type { Lesson } from "@/types/lesson";
import type { ScheduledReviewItem } from "@/types/memoryVault";
import type { QuizResult } from "@/types/quiz";
import type { StudentProfile } from "@/types/user";
import { getMasteryBand } from "@/features/mastery/masteryEngine";
import { getDueMemoryVaultItems, getUpcomingMemoryVaultItems } from "@/features/memory-vault/memoryVaultEngine";

type StudentDashboardProps = {
  student: StudentProfile;
  lessons: Lesson[];
  selectedLessonId: string;
  completedLessonIds: string[];
  memoryVaultItems: ScheduledReviewItem[];
  quizResults: Record<string, QuizResult>;
  averageMasteryScore?: number;
  persistedCounts?: {
    quizAttempts: number;
    mistakeJournalEntries: number;
    learningPlannerEntries: number;
    portfolioEvidenceItems: number;
  };
  onSelectLesson: (lessonId: string) => void;
  onStartLesson: () => void;
  onStartMemoryVault: () => void;
  onOpenThinkingSystems: () => void;
};

export function StudentDashboard({
  student,
  lessons,
  selectedLessonId,
  completedLessonIds,
  memoryVaultItems,
  quizResults,
  averageMasteryScore,
  persistedCounts,
  onSelectLesson,
  onStartLesson,
  onStartMemoryVault,
  onOpenThinkingSystems,
}: StudentDashboardProps) {
  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId) ?? lessons[0];
  const nextIncompleteLesson = lessons.find((lesson) => !completedLessonIds.includes(lesson.id));
  const recommendedLesson = nextIncompleteLesson ?? selectedLesson;
  const dueItems = getDueMemoryVaultItems(memoryVaultItems);
  const upcomingItems = getUpcomingMemoryVaultItems(memoryVaultItems, 5);
  const subjectProgress = buildSubjectProgress(lessons, completedLessonIds, quizResults);
  const weakSkills = Object.values(quizResults)
    .flatMap((result) => result.skillBreakdown)
    .filter((skill) => skill.score < 80)
    .slice(0, 4);

  return (
    <section className="space-y-6" aria-labelledby="student-dashboard-title">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Student Dashboard</p>
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 id="student-dashboard-title" className="text-3xl font-bold text-slate-950">Welcome back, {student.displayName}</h1>
            <p className="mt-2 text-slate-600">Academy: {selectedLesson?.academyName ?? student.academy} · Grade {student.gradeLevel}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <Metric label="Lessons" value={`${completedLessonIds.length}/${lessons.length}`} helper="completed" />
            <Metric label="Due Reviews" value={String(dueItems.length)} helper="today" />
            <Metric label="Vault Items" value={String(memoryVaultItems.length)} helper="scheduled" />
            <Metric label="Avg. mastery" value={averageMasteryScore === undefined ? "—" : `${averageMasteryScore}%`} helper={averageMasteryScore === undefined ? "no evidence" : getMasteryBand(averageMasteryScore).label} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Today’s Learning Mission</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">{recommendedLesson?.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{recommendedLesson?.course} · {recommendedLesson?.unit}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (recommendedLesson?.id) onSelectLesson(recommendedLesson.id);
                onStartLesson();
              }}
              className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Start recommended lesson
            </button>
          </div>
          <p className="mt-5 rounded-2xl bg-indigo-50 p-4 text-sm leading-6 text-indigo-950">{recommendedLesson?.learningObjective}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Pill label="Thinking focus" value={recommendedLesson?.thinkingSkillTags.slice(0, 2).join(" + ") ?? "—"} />
            <Pill label="Lesson type" value={recommendedLesson?.lessonType.slice(0, 2).join(" + ") ?? "—"} />
            <Pill label="Estimated time" value={recommendedLesson?.estimatedMinutes ?? "—"} />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Mastery by Subject</p>
          <div className="mt-4 space-y-4">
            {subjectProgress.map((progress) => (
              <div key={progress.subject}>
                <div className="flex justify-between gap-3 text-sm font-medium text-slate-700">
                  <span>{progress.subject}</span>
                  <span>{progress.completed}/{progress.total} · {progress.averageScore === undefined ? "No score" : `${progress.averageScore}%`}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100" aria-hidden="true">
                  <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${progress.completionPercent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Memory Vault Preview</p>
            <button
              type="button"
              onClick={onStartMemoryVault}
              disabled={!memoryVaultItems.length}
              className="rounded-2xl border border-indigo-300 px-4 py-2 text-sm font-semibold text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Start review session
            </button>
          </div>
          {upcomingItems.length ? (
            <ul className="mt-4 space-y-3">
              {upcomingItems.map((item) => (
                <li key={item.id} className="rounded-2xl bg-slate-50 p-4 text-sm ring-1 ring-slate-200">
                  <p className="font-semibold text-slate-900">{item.reviewStage.replace("-", " ")} · {item.subject}</p>
                  <p className="mt-1 text-slate-600">Due in {item.dueInDays} day{item.dueInDays === 1 ? "" : "s"}: {item.prompt}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-slate-600">No review items yet. Complete a lesson to schedule Memory Vault practice.</p>
          )}
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Weak Skill Signals</p>
            <button
              type="button"
              onClick={onOpenThinkingSystems}
              className="rounded-2xl border border-purple-300 px-4 py-2 text-sm font-semibold text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Open thinking systems
            </button>
          </div>
          {weakSkills.length ? (
            <ul className="mt-4 space-y-3">
              {weakSkills.map((skill) => (
                <li key={`${skill.skillTag}-${skill.score}`} className="rounded-2xl bg-amber-50 p-4 text-sm ring-1 ring-amber-200">
                  <p className="font-semibold text-amber-950">{skill.skillTag} · {skill.score}%</p>
                  <p className="mt-1 text-amber-900">Recommended: revisit worked example, then complete a reteach item.</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-slate-600">No weak skills yet. The app will detect patterns after quiz evidence appears.</p>
          )}
        </div>
      </div>



      {persistedCounts ? (
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Saved Learning Evidence</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Quiz Attempts" value={String(persistedCounts.quizAttempts)} helper="saved" />
            <Metric label="Mistake Journal" value={String(persistedCounts.mistakeJournalEntries)} helper="patterns" />
            <Metric label="Planner Tasks" value={String(persistedCounts.learningPlannerEntries)} helper="assigned" />
            <Metric label="Portfolio Prompts" value={String(persistedCounts.portfolioEvidenceItems)} helper="evidence" />
          </div>
        </div>
      ) : null}

      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Available Seed Lessons</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {lessons.map((lesson) => {
            const isSelected = lesson.id === selectedLessonId;
            const isCompleted = completedLessonIds.includes(lesson.id);
            const result = quizResults[lesson.id];
            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => onSelectLesson(lesson.id)}
                className={`rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  isSelected ? "border-indigo-500 bg-indigo-50" : "border-slate-200 bg-white hover:border-indigo-300"
                }`}
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{lesson.academyName} · Grade {lesson.gradeLevel}</span>
                <h3 className="mt-1 font-semibold text-slate-950">{lesson.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{lesson.subject}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                  {isCompleted ? <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 ring-1 ring-emerald-200">Completed</span> : <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 ring-1 ring-slate-200">Not started</span>}
                  {result ? <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700 ring-1 ring-indigo-200">{result.score}%</span> : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function buildSubjectProgress(lessons: Lesson[], completedLessonIds: string[], quizResults: Record<string, QuizResult>) {
  return Object.values(
    lessons.reduce<Record<string, { subject: string; total: number; completed: number; scores: number[] }>>((acc, lesson) => {
      const bucket = acc[lesson.subject] ?? { subject: lesson.subject, total: 0, completed: 0, scores: [] };
      bucket.total += 1;
      if (completedLessonIds.includes(lesson.id)) bucket.completed += 1;
      if (quizResults[lesson.id]) bucket.scores.push(quizResults[lesson.id].score);
      acc[lesson.subject] = bucket;
      return acc;
    }, {}),
  ).map((bucket) => ({
    ...bucket,
    completionPercent: bucket.total ? Math.round((bucket.completed / bucket.total) * 100) : 0,
    averageScore: bucket.scores.length ? Math.round(bucket.scores.reduce((sum, score) => sum + score, 0) / bucket.scores.length) : undefined,
  }));
}

function Metric({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-950">{value}</p>
      {helper ? <p className="mt-1 text-xs text-slate-500">{helper}</p> : null}
    </div>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}
