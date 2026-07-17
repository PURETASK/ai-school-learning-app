export const appViews = [
  {
    id: "student",
    label: "Child",
    icon: "01",
    kind: "role-home",
    purpose: "Learner mission board, levels, subject worlds, daily path, rewards, and class session access."
  },
  {
    id: "parent",
    label: "Parent",
    icon: "02",
    kind: "role-home",
    purpose: "Household dashboard, child progress, weak/strong skills, rewards, assignments, and suggested support."
  },
  {
    id: "teacher",
    label: "Teacher",
    icon: "03",
    kind: "role-home",
    purpose: "Class launch, live learning monitor, group work, tutor quality, and intervention workflows."
  },
  {
    id: "school",
    label: "School",
    icon: "04",
    kind: "role-home",
    purpose: "School admin setup, rosters, classes, implementation status, and school reporting."
  },
  {
    id: "curriculum",
    label: "Curriculum",
    icon: "05",
    kind: "learning",
    purpose: "K-12 curriculum map, full lesson library, standards baseline, and published catalog."
  },
  {
    id: "lesson",
    label: "Lesson",
    icon: "06",
    kind: "learning",
    purpose: "Student-facing app-led lesson player with diagrams, scratchpad, practice, quiz, and reteach/challenge paths."
  },
  {
    id: "setup",
    label: "Setup",
    icon: "07",
    kind: "identity",
    purpose: "Signup, signin, child account creation, email verification, password reset, runtime config, and onboarding."
  },
  {
    id: "admin",
    label: "Admin",
    icon: "08",
    kind: "staff",
    purpose: "Content operations, launch gates, evidence gates, drafts, publishing, and review queues."
  },
  {
    id: "ai",
    label: "AI Safety",
    icon: "09",
    kind: "learning",
    purpose: "Guardrailed tutor, stuck-point diagnosis, explanation modes, safety review, and tutor quality."
  },
  {
    id: "visuals",
    label: "Visuals",
    icon: "10",
    kind: "staff",
    purpose: "Visual learning agent, image/diagram opportunities, OpenAI generation plan, and asset review."
  },
  {
    id: "tools",
    label: "Tools",
    icon: "11",
    kind: "staff",
    purpose: "Agent tool gateway, live source audit, managed tool calls, and review-gated operations."
  },
  {
    id: "lab",
    label: "Learning Lab",
    icon: "12",
    kind: "learning-science",
    purpose: "Learning model, evidence recommendations, retention loop, young learner loop, and radical teaching rules."
  },
  {
    id: "experiments",
    label: "Experiments",
    icon: "13",
    kind: "learning-science",
    purpose: "Trial-and-error learning experiments, recall telemetry, joy/frustration signals, and reward validation."
  },
  {
    id: "agents",
    label: "Agents",
    icon: "14",
    kind: "staff",
    purpose: "Manager plus specialist agent operating model, responsibilities, build plan, and action audit."
  }
];

export const appViewIds = appViews.map((view) => view.id);
export const roleViewIds = ["student", "parent", "teacher", "school"];

export const viewLabels = appViews.map((view) => [view.id, view.label]);
export const viewIcons = Object.fromEntries(appViews.map((view) => [view.id, view.icon]));

export const allowedViewsByRole = {
  anonymous: ["setup"],
  student: ["student", "lesson", "ai"],
  parent: ["parent", "setup", "curriculum", "lesson", "ai", "experiments"],
  teacher: ["teacher", "curriculum", "lesson", "ai", "visuals", "tools", "lab", "experiments", "admin"],
  "school-admin": appViewIds,
  "platform-admin": appViewIds
};

export const baseRoleHomeViews = {
  student: "student",
  parent: "parent",
  teacher: "teacher",
  "school-admin": "school",
  "platform-admin": "school"
};

export function getViewContractSummary() {
  const ids = new Set(appViewIds);
  const duplicateIds = appViewIds.filter((id, index) => appViewIds.indexOf(id) !== index);
  const missingRoleViews = roleViewIds.filter((id) => !ids.has(id));
  const allowedUnknownViews = Object.entries(allowedViewsByRole).flatMap(([role, views]) =>
    views.filter((view) => !ids.has(view)).map((view) => ({ role, view }))
  );
  const missingLabels = appViews.filter((view) => !view.label || !view.icon || !view.purpose).map((view) => view.id);
  return {
    totalViews: appViews.length,
    roleViews: roleViewIds.length,
    duplicateIds,
    missingRoleViews,
    allowedUnknownViews,
    missingLabels,
    passed:
      appViews.length === 14 &&
      duplicateIds.length === 0 &&
      missingRoleViews.length === 0 &&
      allowedUnknownViews.length === 0 &&
      missingLabels.length === 0
  };
}
