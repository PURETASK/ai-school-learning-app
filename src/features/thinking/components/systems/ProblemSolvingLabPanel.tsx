import type { ProblemSolvingLabTask } from "@/types/thinkingSystems";
import { SystemField, SystemList, SystemPanel } from "./SystemPanel";

export function ProblemSolvingLabPanel({ task }: { task: ProblemSolvingLabTask }) {
  return (
    <SystemPanel title="4. Problem-Solving Lab" eyebrow="First-principles flow">
      <SystemField label="Problem" value={task.problem} />
      <h3 className="mt-4 text-sm font-semibold text-slate-900">Known facts</h3>
      <SystemList items={task.knownFacts} />
      <h3 className="mt-4 text-sm font-semibold text-slate-900">Unknowns</h3>
      <SystemList items={task.unknowns} />
      <h3 className="mt-4 text-sm font-semibold text-slate-900">Solution steps</h3>
      <SystemList items={task.solutionSteps} />
      <SystemField label="Answer check" value={task.answerCheck} />
    </SystemPanel>
  );
}
