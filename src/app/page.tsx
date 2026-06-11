import { MvpLearningLoop } from "@/features/vertical-slice/MvpLearningLoop";
import { getAllLessons } from "@/lib/curriculum/loadLessons";

export default function HomePage() {
  const lessons = getAllLessons();
  return <MvpLearningLoop lessons={lessons} />;
}
