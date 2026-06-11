# Lesson Import Plan

## Source

Polished v2 JSON lessons live in:

```txt
seed-lessons/lessons/json/
```

App-ready copies live in:

```txt
content/foundation-academy/grade-3/{subject}/
content/bridge-academy/grade-6/{subject}/
content/scholar-academy/grade-9/{subject}/
```

## Import Rule

Use file-based JSON loading first. Do not introduce a database until the Lesson Player, Quiz Engine, Mastery Engine, and Memory Vault work against file content.

## Loader Requirements

Create:

```txt
src/lib/curriculum/loadLessons.ts
```

Functions:

- `getAllLessons()`
- `getLessonById(id)`
- `getLessonsByAcademy(academy)`
- `getLessonsByGrade(gradeLevel)`
- `getLessonsBySubject(subject)`
- `getFirstDemoLesson()`

## Content Path Rules

- Use academy slugs from `PROJECT_SOURCE_OF_TRUTH.md`.
- Use `grade-3`, `grade-6`, `grade-9` folder names.
- Do not rename lesson IDs.
- Use JSON as the app source of truth for MVP.
- Markdown versions are for review/human curriculum editing.
