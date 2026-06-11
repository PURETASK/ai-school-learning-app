import type { InterpretationLensTask } from "@/types/thinkingSystems";
import { SystemField, SystemList, SystemPanel } from "./SystemPanel";

export function InterpretationLensPanel({ task }: { task: InterpretationLensTask }) {
  return (
    <SystemPanel title="6. Interpretation Lens" eyebrow="Meaning + context" status={task.lens}>
      <SystemField label="Artifact" value={task.artifact} />
      <SystemList items={task.prompts} />
      <SystemField label="How to pass" value={task.successCriteria.join(" · ")} />
    </SystemPanel>
  );
}
