# Codex First Build Prompt

Paste this into Codex after dropping this archive into a repo root.

```txt
Read AGENTS.md, PROJECT_SOURCE_OF_TRUTH.md, MVP_VERTICAL_SLICE_SPEC.md, LESSON_IMPORT_PLAN.md, LESSON_VALIDATION_RULES.md, docs/15_MVP_SCOPE.md, docs/55_MVP_BACKLOG_AND_TASK_BREAKDOWN.md, and seed-lessons/LESSON_JSON_SCHEMA_V2.json.

Then build only the MVP vertical slice:

1. Confirm the stack and install/configure Next.js + TypeScript + Tailwind if not already present.
2. Create the source folders from PROJECT_SOURCE_OF_TRUTH.md.
3. Create TypeScript types matching the v2 lesson JSON schema.
4. Create a lesson loader that reads JSON lessons from content/.
5. Create a validation script that checks required lesson fields, quiz answer keys, Memory Vault items, reteach paths, challenge paths, standards tags, thinking skill tags, duplicate IDs, and missing IDs.
6. Build the Student Dashboard showing the first available lesson and mock progress.
7. Build the Lesson Player rendering all lessonFlow sections in order.
8. Build the Quiz Engine for multiple choice, short answer placeholder, and explain-your-thinking prompts.
9. Build the Feedback + Mastery Engine using official mastery bands.
10. Build Memory Vault scheduling for Day 1, 3, 7, 14, and 30.
11. Build the Basic Parent Dashboard showing completed lesson, quiz score, mastery band, weak skills, due review items, and suggested support.

Do not build homepage-first, payments, mobile app, public discussion boards, full AI tutor, school admin, or leaderboards. The goal is proof of the learning loop.

After changes, report:
- What changed
- Files modified
- How to run it
- How to validate lessons
- Known limitations
- Recommended next step
```
