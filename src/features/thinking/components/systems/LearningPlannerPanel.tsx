import type { LearningPlannerTask } from "@/types/thinkingSystems";
import { SystemField, SystemList, SystemPanel } from "./SystemPanel";

export function LearningPlannerPanel({ task }: { task: LearningPlannerTask }) {
  return (
    <SystemPanel title="8. Learning Planner" eyebrow="Plan → monitor → evaluate">
      <SystemField label="Task" value={task.task} />
      <SystemField label="First step" value={task.firstStep} />
      <SystemField label="Strategy" value={task.strategy} />
      <SystemField label="Finish signal" value={task.finishSignal} />
      <SystemField label="Obstacle prompt" value={task.obstaclePrompt} />
      <SystemField label="Reflection" value={task.reflectionPrompt} />
      <SystemList items={task.successCriteria} />
    </SystemPanel>
  );
}
