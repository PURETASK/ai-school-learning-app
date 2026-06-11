import type { LearningPersistenceState, PersistenceHydrationStatus } from "@/types/persistence";
import { buildPersistenceSnapshotSummary } from "@/features/persistence/localLearningPersistence";

export function PersistenceStatusPanel({
  state,
  status,
  onReset,
}: {
  state: LearningPersistenceState;
  status: PersistenceHydrationStatus;
  onReset: () => void;
}) {
  const summary = buildPersistenceSnapshotSummary(state);
  return (
    <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200" aria-labelledby="persistence-status-title">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Persistence Layer V7</p>
          <h2 id="persistence-status-title" className="mt-1 text-lg font-bold text-slate-950">Local prototype persistence is active</h2>
          <p className="mt-1 text-sm text-slate-600">
            Saves progress, quiz attempts, Memory Vault sessions, mistake patterns, planner tasks, and portfolio evidence in browser storage.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <StatusPill label="Hydrated" value={status.isHydrated ? "Yes" : "Loading"} />
          <StatusPill label="Saving" value={status.isSaving ? "Saving" : "Idle"} />
          <StatusPill label="Mode" value={status.storageMode} />
          <button
            type="button"
            onClick={onReset}
            className="rounded-2xl border border-rose-300 px-3 py-2 text-rose-700 hover:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
          >
            Reset demo progress
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
        <MiniMetric label="Lessons" value={String(summary.completedLessons)} />
        <MiniMetric label="Quiz attempts" value={String(summary.quizAttempts)} />
        <MiniMetric label="Vault items" value={String(summary.memoryVaultItems)} />
        <MiniMetric label="Vault sessions" value={String(summary.memoryVaultSessions)} />
        <MiniMetric label="Mistakes" value={String(summary.mistakeJournalEntries)} />
        <MiniMetric label="Planner" value={String(summary.learningPlannerEntries)} />
        <MiniMetric label="Portfolio" value={String(summary.portfolioEvidenceItems)} />
      </div>

      {status.error ? (
        <p className="mt-3 rounded-2xl bg-rose-50 p-3 text-sm text-rose-900 ring-1 ring-rose-200">Persistence error: {status.error}</p>
      ) : null}
      <p className="mt-3 break-all text-xs text-slate-500">Storage key: {status.storageKey}</p>
      {status.lastSavedAtIso ? <p className="mt-1 text-xs text-slate-500">Last saved: {new Date(status.lastSavedAtIso).toLocaleString()}</p> : null}
    </section>
  );
}

function StatusPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-2xl bg-emerald-50 px-3 py-2 text-emerald-800 ring-1 ring-emerald-200">
      {label}: {value}
    </span>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-base font-bold text-slate-950">{value}</p>
    </div>
  );
}
