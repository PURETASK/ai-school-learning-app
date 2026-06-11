import type { ReteachInterventionPlan } from "@/types/thinkingSystems";
import { SystemField, SystemList, SystemPanel } from "./SystemPanel";

export function ReteachInterventionPanel({ plan }: { plan: ReteachInterventionPlan }) {
  return (
    <SystemPanel title="2. Reteach / Intervention Engine" eyebrow="Low score → smaller path" status={`${plan.estimatedMinutes} min`}>
      <SystemField label="Trigger" value={plan.trigger} />
      <SystemField label="Simple explanation" value={plan.simpleExplanation} />
      <SystemField label="Visual model" value={plan.visualModel} />
      <SystemField label="Worked example" value={plan.workedExample} />
      <h3 className="mt-4 text-sm font-semibold text-slate-900">Scaffold steps</h3>
      <SystemList items={plan.scaffoldSteps} />
      <h3 className="mt-4 text-sm font-semibold text-slate-900">Smaller practice set</h3>
      <SystemList items={plan.smallerPracticeSet} />
      <SystemField label="Exit criteria" value={plan.exitCriteria} />
    </SystemPanel>
  );
}
