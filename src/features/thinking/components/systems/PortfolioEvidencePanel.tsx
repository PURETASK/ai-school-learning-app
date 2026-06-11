import type { PortfolioEvidenceItem } from "@/types/thinkingSystems";
import { SystemField, SystemList, SystemPanel } from "./SystemPanel";

export function PortfolioEvidencePanel({ item }: { item: PortfolioEvidenceItem }) {
  return (
    <SystemPanel title="10. Portfolio / Project Evidence" eyebrow="Save proof of learning" status={item.artifactType}>
      <SystemField label="Artifact title" value={item.title} />
      <SystemField label="Evidence prompt" value={item.evidencePrompt} />
      <SystemField label="Parent / teacher feedback prompt" value={item.parentTeacherFeedbackPrompt} />
      <h3 className="mt-4 text-sm font-semibold text-slate-900">Rubric tags</h3>
      <SystemList items={item.rubricTags.length ? item.rubricTags : ["No rubric tags yet"]} />
      <SystemList items={item.successCriteria} />
    </SystemPanel>
  );
}
