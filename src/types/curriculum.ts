export type AcademySlug = "foundation-academy" | "bridge-academy" | "scholar-academy";
export type GradeSlug = "grade-3" | "grade-6" | "grade-9";

export type CurriculumFilter = {
  academy?: string;
  gradeLevel?: string;
  subject?: string;
};
