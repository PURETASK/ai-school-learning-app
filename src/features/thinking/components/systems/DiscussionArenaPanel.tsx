import type { DiscussionArenaPrompt } from "@/types/thinkingSystems";
import { SystemField, SystemList, SystemPanel } from "./SystemPanel";

export function DiscussionArenaPanel({ prompt }: { prompt: DiscussionArenaPrompt }) {
  return (
    <SystemPanel title="7. Discussion Arena" eyebrow="Safe academic dialogue" status={prompt.safetyMode}>
      <SystemField label="Prompt" value={prompt.prompt} />
      <h3 className="mt-4 text-sm font-semibold text-slate-900">Sentence frames</h3>
      <SystemList items={prompt.sentenceFrames} />
      <h3 className="mt-4 text-sm font-semibold text-slate-900">Safety rules</h3>
      <SystemList items={prompt.moderationRules} />
    </SystemPanel>
  );
}
