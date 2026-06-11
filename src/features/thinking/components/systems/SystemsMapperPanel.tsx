import type { SystemsMapperTask } from "@/types/thinkingSystems";
import { SystemField, SystemList, SystemPanel } from "./SystemPanel";

export function SystemsMapperPanel({ task }: { task: SystemsMapperTask }) {
  return (
    <SystemPanel title="9. Systems Mapper" eyebrow="Parts + relationships">
      <SystemField label="System" value={task.systemName} />
      <h3 className="mt-4 text-sm font-semibold text-slate-900">Nodes</h3>
      <SystemList items={task.nodes.map((node) => `${node.label} (${node.type})`)} />
      <h3 className="mt-4 text-sm font-semibold text-slate-900">Links</h3>
      <SystemList items={task.links.map((link) => `${link.from} → ${link.to}: ${link.relationship}`)} />
      <SystemField label="Change prompt" value={task.changePrompt} />
    </SystemPanel>
  );
}
