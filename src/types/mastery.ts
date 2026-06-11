export type MasteryBand = {
  min: number;
  max: number;
  label: "Needs Intervention" | "Needs Reteach" | "Almost Mastered" | "Mastered" | "Advanced";
  action: string;
};
