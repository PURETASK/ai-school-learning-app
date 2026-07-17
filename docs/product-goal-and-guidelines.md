# Product Goal And Working Guidelines

## Active Goal

Build K-12 Learning Academies into a production-grade learning product that schools, middle schools, homeschool families, and parents can actually use. The product should feel like a real academy class a student attends, not a static worksheet site or a teacher-only lesson binder.

The platform must support three connected academy experiences:

- Foundation Academy: kindergarten through grade 5.
- Bridge Academy: grades 6 through 8.
- Scholar Academy: grades 9 through 12.

The near-term commercial focus is Bridge Academy School/Classroom Mode because middle schools are a strong first buyer and the grade band benefits from visual teaching, independent learning, group tasks, tutor support, and teacher visibility.

Parent/Homeschool Mode remains part of the product, but the productization priority is now a school-sellable class experience with teachers, classes, rosters, assignments, live progress, reports, and implementation materials.

## What The Goal References

The goal references the project instructions in `AGENTS.md`, the build guides in `docs/`, and the direction established during product planning.

These are the governing guidelines:

- Use the Academy Worlds + Hybrid School Product direction in `docs/academy-worlds-style-art-direction.md` for the next full visual and UX redesign.
- Build a real education product, not a flashcard app, worksheet app, or demo.
- Keep full K-12 scope active while shipping a focused first sellable wedge.
- Use one shared responsive platform with age-specific student, parent, teacher, school-admin, and platform-admin experiences.
- Make the app itself teach: students should see explanations, visuals, diagrams, practice, tutor help, feedback, and next steps directly in the product.
- Use normal school subjects: ELA, writing, math, science, social studies, health/PE, arts, computer science, SEL/life skills, and career/college readiness.
- Organize curriculum by academy, grade, subject, course, unit, lesson, activity, quiz, mastery result, reteach path, and challenge path.
- Every lesson must include objective, why it matters, direct teaching, guided practice, active task, independent practice, quiz/checkpoint, mastery behavior, reteach behavior, challenge behavior, visuals, helper notes, and common misunderstandings.
- Do something different from ordinary school: diagnose confusion, use visuals before abstraction, support multiple explanation styles, reward durable learning, and run trial-and-error learning experiments.
- For grades 6-12, include images, diagrams, interesting tasks, projects, group homework, individual accountability, and evidence defense.
- For younger learners, use play, story, movement, audio/visual support, repetition, and parent-guided support.
- Rewards must be tied to mastery, transfer, delayed recall, or meaningful learning behavior, not raw screen time.
- The AI tutor must ask what the student does not understand, classify the stuck point, give hints before answers, adapt by grade band, and stay visible to parents or teachers.
- Students cannot trigger unrestricted web browsing, publishing, generated media release, or cost-bearing external tools.
- External research, OpenAI visual generation, source findings, and content changes must go through the Tool Gateway and human review before becoming student-facing.
- Production identity must use trusted claims for student, parent, teacher, school-admin, and platform-admin roles.
- Parent access must be limited to their own children, and teacher access must be limited to assigned classes and students.
- Production cannot rely on local JSON state, fake permissions, or raw local password storage.
- Build for COPPA/FERPA readiness, accessibility, audit logs, content review, and school procurement expectations.

## Current Product Direction

The product should support two customer modes:

1. School/Classroom Mode.
   Schools buy the product for classes. Teachers launch lessons, students attend class sessions, the app teaches directly, group tasks are structured, and school leaders can see adoption and outcomes.

2. Parent/Homeschool Mode.
   Parents create child accounts, assign learning paths, review progress, approve rewards, and use the academy as a guided homeschool or supplemental learning system.

Bridge Academy should be the first sellable school product because it can become a middle-school class built around visual lessons, daily quests, group challenges, tutor-supported practice, mastery checks, and teacher dashboards.

## Product Quality Bar

A feature is not production-ready just because the screen exists. It must have:

- Real role and permission behavior.
- Real data model or a documented repository path to real data.
- Clear student experience.
- Teacher and parent visibility where appropriate.
- Error, empty, loading, and blocked states.
- Accessibility support.
- Test or validation coverage.
- Clear limitations if it is still transitional.
