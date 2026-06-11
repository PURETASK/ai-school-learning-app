import { MvpLearningLoop } from "@/features/vertical-slice/MvpLearningLoop";
import { getAllLessons } from "@/lib/curriculum/loadLessons";
import { AuthGate } from "@/features/auth/AuthGate";

export default function HomePage() {
  const lessons = getAllLessons();
  return (
    <AuthGate>
      <MvpLearningLoop lessons={lessons} />
    </AuthGate>
  );
}
