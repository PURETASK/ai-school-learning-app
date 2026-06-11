import type { Lesson } from "@/types/lesson";
import type { MemoryVaultSessionSummary, ScheduledReviewItem } from "@/types/memoryVault";
import type { QuizResult } from "@/types/quiz";
import type { QuizAttemptRecord, PersistedLearningPlannerEntry, PersistedPortfolioEvidenceRecord } from "@/types/persistence";
import type { MistakeJournalEntry } from "@/types/thinkingSystems";
import { buildFeedbackPlan } from "@/features/feedback/feedbackEngine";
import { getMasteryBand } from "@/features/mastery/masteryEngine";
import { groupMemoryVaultItemsBySubject } from "@/features/memory-vault/memoryVaultEngine";

type ParentDashboardProps = {
  completedLessons: Lesson[];
  quizResults: Record<string, QuizResult>;
  memoryVaultItems: ScheduledReviewItem[];
  memoryVaultSessionSummaries?: MemoryVaultSessionSummary[];
  quizAttemptHistory?: QuizAttemptRecord[];
  mistakeJournalEntries?: MistakeJournalEntry[];
  learningPlannerEntries?: PersistedLearningPlannerEntry[];
  portfolioEvidenceItems?: PersistedPortfolioEvidenceRecord[];
};

export function ParentDashboard({
  completedLessons,
  quizResults,
  memoryVaultItems,
  memoryVaultSessionSummaries = [],
  quizAttemptHistory = [],
  mistakeJournalEntries = [],
  learningPlannerEntries = [],
  portfolioEvidenceItems = [],
}: ParentDashboardProps) {
  const latestLesson = completedLessons.at(-1);
  const latestResult = latestLesson ? quizResults[latestLesson.id] : undefined;
  const latestBand = latestResult ? getMasteryBand(latestResult.score) : undefined;
  const feedbackPlan = latestLesson && latestResult ? buildFeedbackPlan(latestLesson, latestResult) : undefined;
  const weakSkillItems = Object.values(quizResults)
    .flatMap((result) => result.skillBreakdown)
    .filter((skill) => skill.score < 80)
    .slice(0, 6);
  const memoryVaultBySubject = groupMemoryVaultItemsBySubject(memoryVaultItems);
  const latestReviewSession = memoryVaultSessionSummaries[0];
  const completedReviewItems = memoryVaultItems.filter((item) => item.status === "completed").length;
  const rescheduledReviewItems = memoryVaultItems.filter((item) => item.status === "rescheduled").length;

  return (
    <section className="space-y-6" aria-labelledby="parent-dashboard-title">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Parent Dashboard</p>
        <h1 id="parent-dashboard-title" className="mt-2 text-3xl font-bold text-slate-950">Progress Summary</h1>
        <p className="mt-2 text-slate-600">This MVP view shows completed lessons, mastery, weak skills, Memory Vault reviews, and suggested support without exposing other students’ data.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Metric label="Completed Lessons" value={String(completedLessons.length)} helper="finished" />
        <Metric label="Quiz Evidence" value={String(Object.keys(quizResults).length)} helper="attempts" />
        <Metric label="Memory Vault" value={String(memoryVaultItems.length)} helper={`${completedReviewItems} completed`} />
        <Metric label="Review Sessions" value={String(memoryVaultSessionSummaries.length)} helper={latestReviewSession ? `${latestReviewSession.averageScore}% latest` : "none yet"} />
        <Metric label="Latest Mastery" value={latestBand?.label ?? "No quiz yet"} helper={latestResult ? `${latestResult.score}%` : "—"} />
      </div>



      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-bold text-slate-950">Persisted Learning Evidence</h2>
        <p className="mt-2 text-sm text-slate-600">These records are saved locally in the MVP prototype so progress survives refresh. Later, this adapter can move to Supabase/Postgres with the same data contract.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <Metric label="Quiz Attempts" value={String(quizAttemptHistory.length)} helper="history" />
          <Metric label="Mistake Entries" value={String(mistakeJournalEntries.length)} helper="patterns" />
          <Metric label="Planner Entries" value={String(learningPlannerEntries.length)} helper="tasks" />
          <Metric label="Portfolio Evidence" value={String(portfolioEvidenceItems.length)} helper="prompts" />
        </div>
      </div>

      {latestLesson && latestResult && latestBand && feedbackPlan ? (
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-950">Latest Lesson: {latestLesson.title}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Metric label="Quiz Score" value={`${latestResult.score}%`} helper={`${latestResult.pointsEarned}/${latestResult.maxPoints} points`} />
            <Metric label="Mastery Band" value={latestBand.label} helper={latestBand.action} />
            <Metric label="Next Action" value={feedbackPlan.nextAction} helper="adaptive path" />
          </div>
          <div className="mt-5 rounded-2xl bg-indigo-50 p-4 text-sm leading-6 text-indigo-950">
            <p className="font-semibold">Feedback summary</p>
            <p className="mt-1">{feedbackPlan.summary}</p>
            <p className="mt-3 font-semibold">Parent support</p>
            <p className="mt-1">{feedbackPlan.parentSupportNote}</p>
          </div>
        </div>
      ) : null}


      {latestReviewSession ? (
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-950">Latest Memory Vault Session</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <Metric label="Reviewed" value={String(latestReviewSession.totalItems)} helper="items" />
            <Metric label="Correct" value={`${latestReviewSession.correctCount}/${latestReviewSession.totalItems}`} helper="retrieval" />
            <Metric label="Average" value={`${latestReviewSession.averageScore}%`} helper="recall score" />
            <Metric label="Reteach" value={String(latestReviewSession.reteachCount)} helper="items rescheduled" />
          </div>
          <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700 ring-1 ring-slate-200">
            Parent action: celebrate recalled items, then ask the student to explain one rescheduled item aloud. Avoid giving the answer first.
          </p>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-950">Weak Skill Signals</h2>
          {weakSkillItems.length ? (
            <ul className="mt-4 space-y-3">
              {weakSkillItems.map((item) => (
                <li key={`${item.skillTag}-${item.score}-${item.totalQuestions}`} className="rounded-2xl bg-amber-50 p-4 text-sm ring-1 ring-amber-200">
                  <p className="font-semibold text-amber-950">{item.skillTag} · {item.score}%</p>
                  <p className="mt-1 text-amber-900">Suggested support: have the student explain the worked example, then complete a reteach item.</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-slate-600">No weak skills yet. Complete a lesson quiz to generate support recommendations.</p>
          )}
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-950">Memory Vault Review Plan</h2>
          <p className="mt-2 text-sm text-slate-600">{completedReviewItems} completed · {rescheduledReviewItems} rescheduled for reteach/review.</p>
          {memoryVaultItems.length ? (
            <div className="mt-4 space-y-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {memoryVaultBySubject.map((item) => <Metric key={item.subject} label={item.subject} value={String(item.count)} helper="review items" />)}
              </div>
              <ul className="max-h-96 space-y-3 overflow-auto pr-1">
                {memoryVaultItems.slice(0, 10).map((item) => (
                  <li key={item.id} className="rounded-2xl bg-slate-50 p-4 text-sm ring-1 ring-slate-200">
                    <p className="font-semibold text-slate-900">{item.reviewStage.replace("-", " ")} · Due in {item.dueInDays} day{item.dueInDays === 1 ? "" : "s"}</p>
                    <p className="mt-1 text-slate-600">{item.prompt}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-600">No Memory Vault items scheduled yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-bold text-slate-950">{value}</p>
      {helper ? <p className="mt-1 text-xs text-slate-500">{helper}</p> : null}
    </div>
  );
}
