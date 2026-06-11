import type { Lesson } from "@/types/lesson";
import type { QuizResult } from "@/types/quiz";
import type { MistakeJournalEntry, PortfolioEvidenceItem } from "@/types/thinkingSystems";
import type { PersistedLearningPlannerEntry } from "@/types/persistence";
import { buildThinkingSystemsBundle } from "@/features/thinking/thinkingSystemsEngine";
import { MistakeJournalPanel } from "./systems/MistakeJournalPanel";
import { ReteachInterventionPanel } from "./systems/ReteachInterventionPanel";
import { ChallengeEnrichmentPanel } from "./systems/ChallengeEnrichmentPanel";
import { ProblemSolvingLabPanel } from "./systems/ProblemSolvingLabPanel";
import { EvidenceRoomPanel } from "./systems/EvidenceRoomPanel";
import { InterpretationLensPanel } from "./systems/InterpretationLensPanel";
import { DiscussionArenaPanel } from "./systems/DiscussionArenaPanel";
import { LearningPlannerPanel } from "./systems/LearningPlannerPanel";
import { SystemsMapperPanel } from "./systems/SystemsMapperPanel";
import { PortfolioEvidencePanel } from "./systems/PortfolioEvidencePanel";

export function ThinkingSystemsHub({
  lesson,
  result,
  persistedMistakeEntries = [],
  persistedPlannerEntries = [],
  persistedPortfolioEvidence = [],
}: {
  lesson: Lesson;
  result?: QuizResult;
  persistedMistakeEntries?: MistakeJournalEntry[];
  persistedPlannerEntries?: PersistedLearningPlannerEntry[];
  persistedPortfolioEvidence?: PortfolioEvidenceItem[];
}) {
  const bundle = buildThinkingSystemsBundle(lesson, result);
  const availableCount = bundle.systemStatuses.filter((system) => system.isAvailable).length;
  return (
    <section className="space-y-6" aria-labelledby="thinking-systems-title">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Thinking + Adaptation Systems</p>
        <h1 id="thinking-systems-title" className="mt-2 text-3xl font-bold text-slate-950">{lesson.title}</h1>
        <p className="mt-2 text-slate-600">These systems turn mistakes, evidence, interpretation, planning, and application into next learning actions.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-5">
          <Metric label="Systems available" value={`${availableCount}/10`} />
          <Metric label="Mistake signals" value={String(bundle.mistakePatternSummary.totalMistakes)} />
          <Metric label="Saved mistakes" value={String(persistedMistakeEntries.length)} />
          <Metric label="Saved plans" value={String(persistedPlannerEntries.length + persistedPortfolioEvidence.length)} />
          <Metric label="Primary support" value={bundle.mistakePatternSummary.recommendedNextSystems[0] ?? "Memory Vault"} />
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-bold text-slate-950">System status map</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {bundle.systemStatuses.map((system) => (
            <div key={system.id} className={`rounded-2xl p-3 text-sm ring-1 ${system.isAvailable ? "bg-emerald-50 text-emerald-950 ring-emerald-200" : "bg-slate-50 text-slate-600 ring-slate-200"}`}>
              <p className="font-semibold">{system.name}</p>
              <p className="mt-1 text-xs">{system.reason}</p>
              <p className="mt-2 text-xs font-semibold">Next: {system.nextAction}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <MistakeJournalPanel entries={bundle.mistakeJournalEntries} summary={bundle.mistakePatternSummary} />
        <ReteachInterventionPanel plan={bundle.reteachPlan} />
        <ChallengeEnrichmentPanel plan={bundle.challengePlan} />
        <ProblemSolvingLabPanel task={bundle.problemSolvingLabTask} />
        <EvidenceRoomPanel task={bundle.evidenceRoomTask} />
        <InterpretationLensPanel task={bundle.interpretationLensTask} />
        <DiscussionArenaPanel prompt={bundle.discussionPrompt} />
        <LearningPlannerPanel task={bundle.learningPlannerTask} />
        <SystemsMapperPanel task={bundle.systemsMapperTask} />
        <PortfolioEvidencePanel item={bundle.portfolioEvidenceItem} />
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-950">{value}</p>
    </div>
  );
}
