# K–12 Learning App Suite

A web-first K–12 learning platform made of three grade-band academies:

- **Foundation Academy** — Kindergarten through 5th Grade
- **Bridge Academy** — 6th Grade through 8th Grade
- **Scholar Academy** — 9th Grade through 12th Grade

The platform is not a simple lesson library. It is a thinking-development and retention system built around standards-aligned curriculum, first-principles problem solving, critical thinking, interpretation, academic discussion, evidence-based reasoning, retrieval practice, spaced review, adaptive mastery, safe child-centered design, and accessible UX.

---

## Core Learning Loop

```txt
Teach → Break Down → Think → Discuss → Interpret → Prove → Practice → Retrieve → Space → Reflect → Adapt → Apply
```

---

## MVP Scope

The MVP should not attempt the entire K–12 system.

Initial build:

| Academy | MVP Grade |
|---|---:|
| Foundation Academy | Grade 3 |
| Bridge Academy | Grade 6 |
| Scholar Academy | Grade 9 |

Initial subjects:

- ELA / Reading
- Math
- Science
- Social Studies

Initial features:

- Lesson Player
- Quiz Engine
- Feedback Engine
- Mastery Engine
- Memory Vault
- Student Dashboard
- Basic Parent Dashboard
- Markdown/JSON content files

---

## Recommended Tech Stack

- Frontend: Next.js + TypeScript
- Styling: Tailwind CSS
- Database: PostgreSQL / Supabase
- Auth: Supabase Auth or Clerk
- Content: Markdown/JSON first
- Hosting: Vercel
- Testing: Vitest + Playwright later

---

## Documentation Map

Core docs live in `docs/`:

```txt
01_PRODUCT_BIBLE.md
02_CORE_PILLARS.md
03_LEARNING_SCIENCE_CORE.md
04_THINKING_SKILLS_FRAMEWORK.md
05_PRIVACY_AND_CHILD_SAFETY.md
06_ACCESSIBILITY_PLAN.md
07_STANDARDS_MAP.md
08_CURRICULUM_ARCHITECTURE.md
09_LESSON_TEMPLATE_SPEC.md
10_ASSESSMENT_AND_MASTERY_MODEL.md
11_RETENTION_ENGINE_SPEC.md
12_ADAPTIVE_LEARNING_RULES.md
13_GAMIFICATION_AND_MOTIVATION.md
14_FEATURE_MAP.md
15_MVP_SCOPE.md
16_DATA_MODEL_SPEC.md
17_CONTENT_AUTHORING_GUIDE.md
18_AI_TUTOR_POLICY.md
19_TECH_STACK_DECISION.md
20_ROLES_AND_PERMISSIONS.md
21_BUILD_SEQUENCE.md
```

`AGENTS.md` contains Codex-specific operating instructions.

---

## Development Principle

Build the learning engine first.

Do not start with:

- random landing pages
- full K–12 content
- AI tutor first
- open discussion boards
- payments
- complex school admin
- mobile app first

Start with the core loop: lesson → quiz → feedback → mastery → spaced review → dashboard.

---

## Safety Note

This product serves children and students. Privacy, role-based access, restricted communication, parent/teacher controls, accessibility, and child-safe AI behavior must be designed from the beginning.

## Documentation Set v2

This repo includes a complete 60-document planning and implementation set.

### Core foundation

- `docs/01_PRODUCT_BIBLE.md` through `docs/21_BUILD_SEQUENCE.md`

### Production and supplemental specs

- `docs/22_DESIGN_SYSTEM_AND_UI_GUIDELINES.md` through `docs/50_AI_EVALUATION_AND_GUARDRAILS.md`

### Implementation-ready specs

- `docs/51_PRODUCT_REQUIREMENTS_DOCUMENT.md` through `docs/60_ANALYTICS_EVENT_TAXONOMY.md`

The intended first build is a vertical learning slice: student dashboard → lesson player → quiz/feedback → mastery score → Memory Vault review scheduling → parent progress view.
