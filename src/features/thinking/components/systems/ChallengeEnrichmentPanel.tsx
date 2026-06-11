import type { ChallengeEnrichmentPlan } from "@/types/thinkingSystems";
import { SystemField, SystemList, SystemPanel } from "./SystemPanel";

export function ChallengeEnrichmentPanel({ plan }: { plan: ChallengeEnrichmentPlan }) {
  return (
    <SystemPanel title="3. Challenge / Enrichment Engine" eyebrow="Mastery → stretch task" status={`${plan.estimatedMinutes} min`}>
      <SystemField label="Trigger" value={plan.trigger} />
      <SystemList items={[plan.harderProblem, plan.realWorldApplication, plan.creativeTask, plan.multiStepReasoning, plan.crossSubjectChallenge]} />
      <SystemField label="Evidence to save" value={plan.evidenceToSave} />
    </SystemPanel>
  );
}
