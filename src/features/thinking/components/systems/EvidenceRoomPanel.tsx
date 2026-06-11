import type { EvidenceRoomTask } from "@/types/thinkingSystems";
import { SystemField, SystemList, SystemPanel } from "./SystemPanel";

export function EvidenceRoomPanel({ task }: { task: EvidenceRoomTask }) {
  return (
    <SystemPanel title="5. Evidence Room" eyebrow="Claim → evidence → reasoning">
      <SystemField label="Claim" value={task.claim} />
      <ul className="mt-4 space-y-2">
        {task.evidenceOptions.map((option) => (
          <li key={option.text} className="rounded-xl bg-slate-50 p-3 text-sm ring-1 ring-slate-200">
            <span className="font-semibold text-slate-900">{option.strength}:</span> {option.text}
          </li>
        ))}
      </ul>
      <SystemField label="Reasoning prompt" value={task.reasoningPrompt} />
      <SystemField label="Revision prompt" value={task.revisionPrompt} />
      <SystemList items={task.successCriteria} />
    </SystemPanel>
  );
}
