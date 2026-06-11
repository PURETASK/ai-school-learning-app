import fs from "node:fs";
import path from "node:path";
import type { Lesson } from "@/types/lesson";
import type { CurriculumFilter } from "@/types/curriculum";

const CONTENT_DIR = path.join(process.cwd(), "content");

function walkJsonFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkJsonFiles(full);
    if (entry.isFile() && entry.name.endsWith(".json")) return [full];
    return [];
  });
}

export function getAllLessons(): Lesson[] {
  return walkJsonFiles(CONTENT_DIR)
    .map((file) => JSON.parse(fs.readFileSync(file, "utf8")) as Lesson)
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function getLessonById(id: string): Lesson | undefined {
  return getAllLessons().find((lesson) => lesson.id === id);
}

export function getLessons(filter: CurriculumFilter = {}): Lesson[] {
  return getAllLessons().filter((lesson) => {
    if (filter.academy && lesson.academy !== filter.academy) return false;
    if (filter.gradeLevel && lesson.gradeLevel !== filter.gradeLevel) return false;
    if (filter.subject && lesson.subject !== filter.subject) return false;
    return true;
  });
}

export function getLessonsByAcademy(academy: string): Lesson[] {
  return getLessons({ academy });
}

export function getLessonsByGrade(gradeLevel: string): Lesson[] {
  return getLessons({ gradeLevel });
}

export function getLessonsBySubject(subject: string): Lesson[] {
  return getLessons({ subject });
}

export function getFirstDemoLesson(): Lesson | undefined {
  return getLessonById("FA-G3-MATH-U1-L1") ?? getAllLessons()[0];
}
