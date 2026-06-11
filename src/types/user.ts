export type UserRole = "student" | "parent" | "teacher" | "school_admin" | "platform_admin" | "content_creator" | "curriculum_reviewer";

export type StudentProfile = {
  id: string;
  displayName: string;
  academy: "foundation" | "bridge" | "scholar";
  gradeLevel: string;
};
