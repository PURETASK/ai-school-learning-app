"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Lesson } from "@/types/lesson";
import type { QuizResult, StudentAnswer } from "@/types/quiz";
import type { MistakeJournalEntry, PortfolioEvidenceItem } from "@/types/thinkingSystems";
import type { PersistedLearningPlannerEntry, PersistedPortfolioEvidenceRecord } from "@/types/persistence";
import { DEMO_STUDENT } from "@/lib/demo/mockStudent";
import { StudentDashboard } from "@/features/dashboards/student/StudentDashboard";
import { LESSON_SECTION_COUNT, LessonPlayer } from "@/features/lessons/LessonPlayer";
import { QuizPanel } from "@/features/quizzes/components/QuizPanel";
import { ParentDashboard } from "@/features/dashboards/parent/ParentDashboard";
import { gradeQuiz } from "@/features/quizzes/quizEngine";
import { getMasteryBand } from "@/features/mastery/masteryEngine";
import { buildFeedbackPlan } from "@/features/feedback/feedbackEngine";
import { getReviewableMemoryVaultItems, scheduleMemoryVaultItems } from "@/features/memory-vault/memoryVaultEngine";
import { MemoryVaultReviewSession } from "@/features/memory-vault/components/MemoryVaultReviewSession";
import { ThinkingSystemsHub } from "@/features/thinking/components/ThinkingSystemsHub";
import { buildThinkingSystemsBundle } from "@/features/thinking/thinkingSystemsEngine";
import { usePersistentLearningState } from "@/features/persistence/usePersistentLearningState";
import { PersistenceStatusPanel } from "@/features/persistence/components/PersistenceStatusPanel";


type Screen = "student-dashboard" | "lesson" | "quiz" | "results" | "memory-vault" | "thinking-systems" | "parent-dashboard";

type MvpLearningLoopProps = {
  lessons: Lesson[];
};

export function MvpLearningLoop({ lessons }: MvpLearningLoopProps) {
  const [screen, setScreen] = useState<Screen>("student-dashboard");
  const [sectionIndex, setSectionIndex] = useState(0);
  const { state, setState, status, resetPersistence } = usePersistentLearningState({ studentId: DEMO_STUDENT.id, lessons });

  const selectedLesson = lessons.find((lesson) => lesson.id === state.selectedLessonId) ?? lessons[0];
  const latestResult = selectedLesson ? state.quizResults[selectedLesson.id] : undefined;
  const completedLessons = lessons.filter((lesson) => state.completedLessonIds.includes(lesson.id));
  const completedSectionKeys = selectedLesson ? state.completedSectionKeysByLesson[selectedLesson.id] ?? [] : [];
  const answers = selectedLesson ? state.draftAnswersByLesson[selectedLesson.id] ?? [] : [];
  const reviewableMemoryVaultItems = useMemo(() => getReviewableMemoryVaultItems(state.memoryVaultItems, new Date(), 8), [state.memoryVaultItems]);
  const averageMasteryScore = useMemo(() => {
    const results = Object.values(state.quizResults);
    if (!results.length) return undefined;
    return Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length);
  }, [state.quizResults]);

  function resetLessonState(lessonId: string) {
    setState((current) => ({ ...current, selectedLessonId: lessonId }));
    setSectionIndex(0);
  }

  function markSectionComplete(sectionKey: string) {
    if (!selectedLesson) return;
    setState((current) => {
      const currentKeys = current.completedSectionKeysByLesson[selectedLesson.id] ?? [];
      if (currentKeys.includes(sectionKey)) return current;
      return {
        ...current,
        completedSectionKeysByLesson: {
          ...current.completedSectionKeysByLesson,
          [selectedLesson.id]: [...currentKeys, sectionKey],
        },
      };
    });
  }

  function handleAnswer(questionId: string, answer: string) {
    if (!selectedLesson) return;
    setState((current) => {
      const currentAnswers = current.draftAnswersByLesson[selectedLesson.id] ?? [];
      const otherAnswers = currentAnswers.filter((item) => item.questionId !== questionId);
      return {
        ...current,
        draftAnswersByLesson: {
          ...current.draftAnswersByLesson,
          [selectedLesson.id]: [...otherAnswers, { questionId, answer }],
        },
      };
    });
  }

  function submitQuiz() {
    if (!selectedLesson) return;
    const result = gradeQuiz(selectedLesson.quiz, answers);
    const thinkingBundle = buildThinkingSystemsBundle(selectedLesson, result);
    const nowIso = new Date().toISOString();

    setState((current) => {
      const alreadyScheduled = new Set(current.memoryVaultItems.map((item) => item.id));
      const nextMemoryVaultItems = scheduleMemoryVaultItems(selectedLesson, DEMO_STUDENT.id).filter((item) => !alreadyScheduled.has(item.id));
      const quizAttempt = {
        id: `${DEMO_STUDENT.id}-${selectedLesson.id}-${result.submittedAt.replace(/[:.]/g, "-")}`,
        studentId: DEMO_STUDENT.id,
        lessonId: selectedLesson.id,
        submittedAtIso: result.submittedAt,
        result,
      };
      const existingPlannerEntry = current.learningPlannerEntries.find((entry) => entry.lessonId === selectedLesson.id);
      const plannerEntry: PersistedLearningPlannerEntry = {
        ...thinkingBundle.learningPlannerTask,
        id: `${DEMO_STUDENT.id}-${selectedLesson.id}-planner`,
        studentId: DEMO_STUDENT.id,
        status: existingPlannerEntry?.status ?? "assigned",
        createdAtIso: existingPlannerEntry?.createdAtIso ?? nowIso,
        updatedAtIso: nowIso,
        source: "quiz",
      };
      const portfolioEntry = toPersistedPortfolioEvidenceRecord(thinkingBundle.portfolioEvidenceItem, nowIso);
      const nextDraftAnswers = { ...current.draftAnswersByLesson };
      delete nextDraftAnswers[selectedLesson.id];

      return {
        ...current,
        quizResults: { ...current.quizResults, [selectedLesson.id]: result },
        quizAttemptHistory: upsertById([...current.quizAttemptHistory, quizAttempt]),
        completedLessonIds: current.completedLessonIds.includes(selectedLesson.id)
          ? current.completedLessonIds
          : [...current.completedLessonIds, selectedLesson.id],
        memoryVaultItems: [...current.memoryVaultItems, ...nextMemoryVaultItems],
        mistakeJournalEntries: upsertById<MistakeJournalEntry>([
          ...current.mistakeJournalEntries,
          ...thinkingBundle.mistakeJournalEntries,
        ]),
        learningPlannerEntries: upsertById<PersistedLearningPlannerEntry>([
          ...current.learningPlannerEntries,
          plannerEntry,
        ]),
        portfolioEvidenceItems: upsertById<PersistedPortfolioEvidenceRecord>([
          ...current.portfolioEvidenceItems,
          portfolioEntry,
        ]),
        draftAnswersByLesson: nextDraftAnswers,
      };
    });
    setScreen("results");
  }

  if (!selectedLesson) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 text-slate-950">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-2xl font-bold">No lessons loaded</h1>
          <p className="mt-2 text-slate-600">Add lesson JSON files to the content folder and run the validator.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-950 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Header screen={screen} onGoHome={() => setScreen("student-dashboard")} onGoParent={() => setScreen("parent-dashboard")} />
        <PersistenceStatusPanel state={state} status={status} onReset={resetPersistence} />

        {screen === "student-dashboard" ? (
          <StudentDashboard
            student={DEMO_STUDENT}
            lessons={lessons}
            selectedLessonId={selectedLesson.id}
            completedLessonIds={state.completedLessonIds}
            memoryVaultItems={state.memoryVaultItems}
            quizResults={state.quizResults}
            averageMasteryScore={averageMasteryScore}
            persistedCounts={{
              quizAttempts: state.quizAttemptHistory.length,
              mistakeJournalEntries: state.mistakeJournalEntries.length,
              learningPlannerEntries: state.learningPlannerEntries.length,
              portfolioEvidenceItems: state.portfolioEvidenceItems.length,
            }}
            onSelectLesson={resetLessonState}
            onStartLesson={() => setScreen("lesson")}
            onStartMemoryVault={() => setScreen("memory-vault")}
            onOpenThinkingSystems={() => setScreen("thinking-systems")}
          />
        ) : null}

        {screen === "lesson" ? (
          <LessonPlayer
            lesson={selectedLesson}
            sectionIndex={sectionIndex}
            completedSectionKeys={completedSectionKeys}
            onBack={() => setSectionIndex((current) => Math.max(0, current - 1))}
            onNext={() => setSectionIndex((current) => Math.min(LESSON_SECTION_COUNT - 1, current + 1))}
            onJumpToSection={setSectionIndex}
            onMarkSectionComplete={markSectionComplete}
            onGoToQuiz={() => setScreen("quiz")}
          />
        ) : null}

        {screen === "quiz" ? (
          <QuizPanel questions={selectedLesson.quiz} answers={answers} onAnswer={handleAnswer} onSubmit={submitQuiz} />
        ) : null}

        {screen === "results" && latestResult ? (
          <ResultsPanel
            lesson={selectedLesson}
            result={latestResult}
            scheduledCount={selectedLesson.memoryVaultItems.reduce((sum, item) => sum + (item.scheduleDays?.length ?? 5), 0)}
            onStudentDashboard={() => setScreen("student-dashboard")}
            onParentDashboard={() => setScreen("parent-dashboard")}
            onMemoryVault={() => setScreen("memory-vault")}
            onThinkingSystems={() => setScreen("thinking-systems")}
          />
        ) : null}

        {screen === "memory-vault" ? (
          <MemoryVaultReviewSession
            studentId={DEMO_STUDENT.id}
            items={reviewableMemoryVaultItems}
            allItems={state.memoryVaultItems}
            onComplete={(updatedItems, summary) => {
              setState((current) => ({
                ...current,
                memoryVaultItems: updatedItems,
                memoryVaultSessionSummaries: [summary, ...current.memoryVaultSessionSummaries],
              }));
            }}
            onExit={() => setScreen("student-dashboard")}
          />
        ) : null}

        {screen === "thinking-systems" ? (
          <ThinkingSystemsHub
            lesson={selectedLesson}
            result={latestResult}
            persistedMistakeEntries={state.mistakeJournalEntries.filter((entry) => entry.lessonId === selectedLesson.id)}
            persistedPlannerEntries={state.learningPlannerEntries.filter((entry) => entry.lessonId === selectedLesson.id)}
            persistedPortfolioEvidence={state.portfolioEvidenceItems.filter((entry) => entry.lessonId === selectedLesson.id)}
          />
        ) : null}

        {screen === "parent-dashboard" ? (
          <ParentDashboard
            completedLessons={completedLessons}
            quizResults={state.quizResults}
            memoryVaultItems={state.memoryVaultItems}
            memoryVaultSessionSummaries={state.memoryVaultSessionSummaries}
            quizAttemptHistory={state.quizAttemptHistory}
            mistakeJournalEntries={state.mistakeJournalEntries}
            learningPlannerEntries={state.learningPlannerEntries}
            portfolioEvidenceItems={state.portfolioEvidenceItems}
          />
        ) : null}
      </div>
    </main>
  );
}

function Header({ screen, onGoHome, onGoParent }: { screen: Screen; onGoHome: () => void; onGoParent: () => void }) {
  return (
    <header className="flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">MVP Vertical Slice</p>
        <p className="font-bold text-slate-950">Dashboard → Lesson → Quiz → Feedback → Mastery → Memory Vault → Thinking Systems → Parent View</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onGoHome} className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Student view
        </button>
        <button type="button" onClick={onGoParent} className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Parent view
        </button>
        <span className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">Current: {screen}</span>
      </div>
    </header>
  );
}

function ResultsPanel({
  lesson,
  result,
  scheduledCount,
  onStudentDashboard,
  onParentDashboard,
  onMemoryVault,
  onThinkingSystems,
}: {
  lesson: Lesson;
  result: QuizResult;
  scheduledCount: number;
  onStudentDashboard: () => void;
  onParentDashboard: () => void;
  onMemoryVault: () => void;
  onThinkingSystems: () => void;
}) {
  const band = getMasteryBand(result.score);
  const feedbackPlan = buildFeedbackPlan(lesson, result);
  return (
    <section className="space-y-6" aria-labelledby="results-title">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Feedback + Mastery Engine</p>
        <h1 id="results-title" className="mt-2 text-3xl font-bold text-slate-950">{lesson.title} Results</h1>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <Metric label="Score" value={`${result.score}%`} helper={`${result.pointsEarned}/${result.maxPoints} points`} />
          <Metric label="Mastery" value={band.label} helper={band.action} />
          <Metric label="Memory Vault" value={String(scheduledCount)} helper="reviews scheduled" />
          <Metric label="Next Path" value={feedbackPlan.nextAction} helper="adaptive" />
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-950 ring-1 ring-emerald-200">
            <p className="font-semibold">Strengths</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {feedbackPlan.strengths.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-950 ring-1 ring-amber-200">
            <p className="font-semibold">Focus areas</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {feedbackPlan.weakSkills.length ? feedbackPlan.weakSkills.map((item) => <li key={item}>{item}</li>) : <li>No weak skill pattern yet.</li>}
            </ul>
          </div>
        </div>
        <p className="mt-5 rounded-2xl bg-indigo-50 p-4 text-sm leading-6 text-indigo-950">{feedbackPlan.summary}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ActionButton onClick={onStudentDashboard}>Back to student dashboard</ActionButton>
          <ActionButton onClick={onMemoryVault}>Open Memory Vault</ActionButton>
          <ActionButton onClick={onThinkingSystems}>Open thinking systems</ActionButton>
          <ActionButton onClick={onParentDashboard}>Open parent dashboard</ActionButton>
        </div>
      </div>
    </section>
  );
}

function ActionButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
      {children}
    </button>
  );
}

function Metric({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-950">{value}</p>
      {helper ? <p className="mt-1 text-xs text-slate-500">{helper}</p> : null}
    </div>
  );
}

function upsertById<T extends { id: string }>(items: T[]): T[] {
  return [...items.reduce<Map<string, T>>((map, item) => map.set(item.id, item), new Map()).values()];
}

function toPersistedPortfolioEvidenceRecord(item: PortfolioEvidenceItem, nowIso: string): PersistedPortfolioEvidenceRecord {
  return {
    ...item,
    studentId: DEMO_STUDENT.id,
    status: "prompted",
    createdAtIso: nowIso,
    updatedAtIso: nowIso,
    source: "quiz",
  };
}
