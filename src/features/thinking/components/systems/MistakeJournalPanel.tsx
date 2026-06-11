import type { MistakeJournalEntry, MistakePatternSummary } from "@/types/thinkingSystems";
import { SystemField, SystemList, SystemPanel } from "./SystemPanel";

export function MistakeJournalPanel({ entries, summary }: { entries: MistakeJournalEntry[]; summary: MistakePatternSummary }) {
  return (
    <SystemPanel title="1. Mistake Journal" eyebrow="Mistakes → patterns" status={summary.severity}>
      <SystemField label="Student message" value={summary.studentMessage} />
      <SystemField label="Parent / teacher note" value={summary.parentTeacherNote} />
      {entries.length ? (
        <ul className="mt-4 space-y-3">
          {entries.map((entry) => (
            <li key={entry.id} className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-amber-950">{entry.studentFriendlyLabel}</p>
                <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900">{entry.severity}</span>
              </div>
              <p className="mt-1 text-sm text-amber-900">{entry.repairPrompt}</p>
              <p className="mt-1 text-xs text-amber-800">Skill: {entry.skillTag} · Recommended system: {entry.recommendedSystem}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-600">No mistake entries yet. Submit a quiz to create pattern evidence.</p>
      )}
      <SystemList items={summary.recommendedNextSystems.map((system) => `Next system: ${system}`)} />
    </SystemPanel>
  );
}
