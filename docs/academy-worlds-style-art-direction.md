# Academy Worlds Style And Art Direction

## Purpose

This document defines the new visual and experience direction for K-12 Learning Academies. The current product has strong learning systems, but the experience must feel less like a rigid admin dashboard and more like a web-based academy that students attend.

The chosen direction is:

```txt
Academy Worlds + Hybrid School Product
```

That means the student experience should feel bold, playful, visual, and reward-driven, while parent, teacher, and school-admin screens should feel professional, calm, and school-sellable.

The active visual variant is now:

```txt
Neon Academy / Cyberpunk Learning Worlds
```

The student surface should use neon subject worlds, glowing progress, angular panels, visible energy, glitch-accented branding, and high-contrast visual hierarchy. This is not a small color refresh. It should feel like a futuristic learning academy that a middle-school student would want to explore, while still staying readable, safe, and school-appropriate.

The current visual-reference reconstruction is documented in `docs/reference-image-art-style-reconstruction.md`. That file refines the active direction as **Neon Learning Poster Collage**: hyper-saturated motivational poster art with central educational objects, explosive light rays, holographic panels, tactile classroom props, and short bold typography.

The product should not look like a generic LMS, a worksheet library, or teacher notes. The app itself should teach, guide, coach, visualize, ask questions, diagnose confusion, reward progress, and show the next action.

## Product Feeling

The student should feel:

- "I am entering my academy."
- "I know what to do today."
- "The app is teaching me directly."
- "I can ask for help when I am stuck."
- "My progress matters."
- "I can unlock levels and rewards by actually learning."

The parent should feel:

- "I understand how my child is doing."
- "I know where they are stuck."
- "I can support them without becoming the teacher."
- "Rewards and tutor help are visible and controlled."

The teacher should feel:

- "I can run a class from this."
- "I can see who is stuck right now."
- "The app teaches the lesson, and I guide/intervene."
- "Group work, confusion patterns, and progress are actionable."

The school admin should feel:

- "This is an organized school product."
- "I can manage rosters, classes, teachers, reports, and compliance."
- "This can be piloted and sold to a school."

## Core Visual Concept

The app is a learning academy made of subject worlds.

Each world represents a school subject or learning domain:

| Subject | World Name | Visual Language |
| --- | --- | --- |
| Math | Math Lab | number lines, tiles, graphs, puzzle machines, measurement tools |
| English / Reading | Story Studio | books, scenes, sentence builders, character maps, vocabulary cards |
| Writing | Writer's Workshop | drafts, idea boards, argument paths, revision tools |
| Science | Discovery Lab | experiments, diagrams, ecosystems, forces, data displays |
| Social Studies | Time And Civics Hall | maps, timelines, artifacts, debate tables, community systems |
| Computer Science | Code Garage | logic circuits, block flows, debugging panels, robots without copyrighted styling |
| Arts / Music | Creative Studio | color, rhythm, pattern, composition, portfolio pieces |
| Health / PE | Life And Wellness Field | movement paths, habits, body systems, team challenges |
| SEL / Life Skills | Skills Studio | choices, reflection, communication, real-world scenarios |
| Career / College | Future Lab | pathways, portfolios, projects, applications, interviews |

Subject worlds should be used as navigation, lesson context, reward identity, and visual memory anchors.

## Visual Identity

### Typography

Use `Grandstander` for student-facing expressive titles, level labels, badges, and subject-world headings.

Use a highly readable sans-serif for body text, forms, dashboards, reports, and long lesson explanations.

Rules:

- Do not use playful font for long paragraphs.
- Use large playful typography only for true student moments: level, subject world, lesson title, reward, challenge, or completion.
- Parent, teacher, and admin pages can use Grandstander as a small brand accent, but should mostly use the readable system font.

### Shape Language

Use rounded, friendly shapes for student UI, but keep layout disciplined.

Recommended:

- Cards: 14-22px radius for student pages.
- Dashboards: 8-12px radius for adult/admin pages.
- Subject tiles: larger radius with clear icon/visual anchor.
- Progress bars: rounded, thick, animated.
- Lesson stage containers: full-width bands, not nested cards inside cards.

Avoid:

- Too many tiny cards.
- Cards inside cards.
- Decorative blobs/orbs.
- Flat gray admin tables as the first student experience.
- Empty placeholder panels.

### Color System

The app should use multiple clear subject identities, not one dominant hue.

For the Neon Academy variant, use a dark high-contrast base with multiple subject-specific neon accents:

- Base: deep ink, midnight violet, near-black blue.
- Glow accents: cyan, coral, lime, amber, magenta, violet.
- Surfaces: translucent dark panels with bright edge highlights.
- Text: warm white for primary text and pale blue-gray for secondary text.

Recommended subject palette:

- Math: electric blue + warm yellow.
- Reading/ELA: coral + ink navy.
- Writing: violet + paper white, used carefully.
- Science: green + bright cyan.
- Social Studies: amber + deep teal.
- Computer Science: lime + charcoal.
- Arts/Music: magenta + orange + clean white.
- Life Skills/SEL: mint + soft red.
- Career/College: royal blue + gold.

Global neutrals:

- Warm off-white backgrounds for student spaces.
- Clean white and soft gray for adult dashboards.
- Dark ink text for readability.
- Use color to show subject, status, and progress, not decoration only.

Status colors:

- Ready: blue.
- In progress: amber.
- Mastered: green.
- Needs help: red/orange.
- Review due: purple.
- Locked: gray.

## Role-Based Experience

## Student Experience

The student home should become an academy command home, not a dashboard list.

Required first-screen elements:

- Student avatar or identity badge.
- Level and XP ring.
- Current academy: Foundation, Bridge, or Scholar.
- Today path with 1-3 required actions.
- Subject worlds grid.
- Next reward progress.
- "I am stuck" tutor entry.
- Current class/session if in School Mode.
- Recent badge or achievement.

The student should see immediate action choices:

- Start today's lesson.
- Continue subject world.
- Ask tutor.
- Do review challenge.
- Join class session.
- Submit group mission evidence.

### Student Subject World

Each subject world should show:

- Subject level.
- XP progress inside that subject.
- Current unit/quest.
- Next lesson.
- Skills unlocked.
- Review due.
- Project or group mission.
- Reward milestone.

It should feel like a map or structured progression, but not become a confusing game board.

### Student Lesson Player

The lesson player is the most important screen. It should teach directly.

Every app-led lesson should follow this visual flow:

1. Arrival hook.
   A bold image, diagram, mystery question, scenario, object, or data visual.

2. What you are learning.
   A short objective in student language.

3. Why it matters.
   One concrete real-world or academy-world reason.

4. Visual model.
   Diagram, picture, simulation, model, timeline, map, graph, manipulative, or worked example.

5. Teach me.
   Short explanation written to the student, not to a teacher.

6. Try together.
   Guided steps with immediate feedback.

7. What is confusing?
   Plain-text student input. The student writes the exact stuck point.

8. Tutor diagnosis.
   The tutor classifies the confusion and chooses an explanation route.

9. Practice challenge.
   Quiz, sort, build, draw, explain, simulate, debate, diagnose, or design task.

10. Common misunderstanding.
   A small section that names the trap and shows how to fix it.

11. Mastery check.
   Short quiz, written explanation, artifact, or performance task.

12. XP and next step.
   XP, subject progress, review date, reward progress, reteach or challenge.

The app should not show the teacher lesson plan as the primary student experience.

### Student Tutor

The tutor should be a visible learning coach with modes:

- Find my stuck point.
- Show me a picture.
- Explain with a metaphor.
- Show the first step.
- Give a real example.
- Quiz me gently.
- Start from basics.

The tutor asks:

- "What part does not make sense?"
- "Can you write what you think the question is asking?"
- "Where did your thinking stop?"
- "Do you want a picture, first step, example, or simpler explanation?"

Then it classifies:

- vocabulary confusion
- visual-model gap
- first-step confusion
- reasoning gap
- misconception
- missing prerequisite
- low confidence
- direct-answer seeking
- unsafe or inappropriate input

It should change teaching strategy when the student says the help did not work.

## Parent Experience

The parent experience should not feel like a school admin console. It should be a family learning view.

Required screens:

- Parent home.
- Child account setup.
- Child profile.
- Progress by subject.
- Strengths and struggles.
- Tutor/help summaries.
- Suggested support plan.
- Reward approval center.
- Parent-controlled reward settings.
- Weekly report.

Parent home should answer:

- What did my child learn recently?
- Where are they stuck?
- What should we do next?
- Are any rewards pending?
- Is tutor use safe and helpful?

Parents should not see other students, class details, staff research notes, or unrestricted internal review queues.

## Teacher Experience

The teacher experience should feel like a classroom cockpit, not a content library.

Required screens:

- Teacher home.
- Class list.
- Launch class session.
- Live class monitor.
- Confusion heatmap.
- Student roster.
- Student profile.
- Group mission builder.
- Group artifact review.
- Assignment/reteach controls.
- Class report.
- Review queue for flagged tutor/content/visual issues.

Teacher home should answer:

- Which class is next?
- What lesson is ready to launch?
- Which students need support?
- What confusion patterns are appearing?
- What work needs review?

Live class monitor should show:

- Ready.
- Active.
- Stuck.
- Needs help.
- Submitted.
- Done.
- Inactive.
- Teacher intervention status.

The teacher should be able to intervene without fighting the interface.

## School Admin Experience

The school admin experience should feel procurement-ready and operational.

Required screens:

- School overview.
- Teacher setup.
- Class creation.
- Roster import/export.
- Student enrollment.
- Guardian link status.
- School reports.
- Usage and adoption.
- Standards coverage.
- Audit logs.
- Implementation checklist.

School admin screens should be visually calmer than student screens. Use the brand and academy-world identity, but prioritize clarity, tables, filters, exports, and status indicators.

## Age-Band Design Rules

### Foundation Academy

Design personality:

- bright
- simple
- warm
- tactile
- story-based
- parent-supported

Screen rules:

- Large tap targets.
- Very short copy.
- Read-aloud/audio hooks.
- More images than text.
- Movement, sorting, drawing, building, and explaining.
- Reward feedback is immediate and clear.

Avoid:

- dense charts
- long paragraph explanations
- multi-column complexity
- adult school language

### Bridge Academy

Design personality:

- quest-based
- independent
- colorful but not childish
- structured
- collaborative

Screen rules:

- Subject worlds become skill maps.
- Daily path is prominent.
- XP and levels matter.
- Group missions are visible.
- Tutor is easy to access.
- Common misunderstanding sections are direct and helpful.

Bridge Academy is the first commercial wedge, so it should get the most production polish first.

### Scholar Academy

Design personality:

- mature
- course-based
- portfolio-focused
- future-oriented
- still visual, but less playful

Screen rules:

- Course progress and credits matter.
- Projects, labs, essays, research, and portfolios are first-class.
- Rewards should become milestones, credentials, badges, portfolio unlocks, and career/college readiness progress.
- Group work should include roles, evidence, and critique.

Avoid:

- childish animation
- toy-like badges as the main motivation
- vague progress

## Motion And Interaction

Use animation to clarify progress, not to distract.

Recommended:

- Page transitions between role views.
- Subject tile hover/press motion.
- XP bar fill animation.
- Level-up animation.
- Lesson step transition.
- Tutor response mode transition.
- Correct/incorrect feedback micro-motion.
- Completion celebration.

Rules:

- All sound must have a mute control.
- Avoid flashing.
- Respect reduced-motion settings.
- Do not animate layout in a way that makes text move while the student is reading.
- Keep adult/admin animation subtle.

## Sound Direction

Sound should be optional and purposeful.

Recommended sound moments:

- XP earned.
- Level up.
- Lesson complete.
- Badge unlocked.
- Review reminder.
- Correct answer confirmation.
- Tutor mode selected.

Avoid:

- constant background music by default
- sounds on every click
- loud failure sounds
- shame or alarm effects

Sound settings:

- on/off
- volume
- reduced sound mode
- parent/teacher control for classroom use

## Educational Visual Standards

Every visual must support learning.

Approved visual types:

- lesson hero image
- annotated diagram
- manipulative model
- number line
- graph or data visual
- process flow
- timeline
- map
- misconception contrast
- lab scene
- first-principles map
- group mission workflow
- portfolio/project artifact example

Visual quality rules:

- The educational object is the first thing seen.
- Labels are short and readable.
- The visual should show what to notice, build, compare, or explain.
- Avoid clutter.
- Avoid generic stock-like decoration.
- Avoid real child faces unless a reviewed licensed asset policy exists.
- Generated visuals must go through review before student-facing use.

## Component Inventory

Student components:

- AcademyHomeHero
- LevelRing
- XpProgressBar
- SubjectWorldTile
- TodayPath
- RewardMilestoneCard
- TutorHelpDock
- LessonStageRail
- VisualTeachingStage
- ConfusionInput
- TutorDiagnosisPanel
- PracticeChallengeCard
- MisunderstandingRepairPanel
- MasteryResultPanel
- GroupMissionCard
- BadgeShelf

Parent components:

- ParentHomeSummary
- ChildSwitcher
- ChildProgressMap
- StrengthStrugglePanel
- TutorSummaryCard
- RewardApprovalCard
- SuggestedSupportPlan
- WeeklyReportCard

Teacher components:

- ClassLaunchPanel
- LiveClassMonitor
- ConfusionHeatmap
- InterventionQueue
- GroupMissionBuilder
- GroupArtifactReview
- StudentEvidenceCard
- ReteachAssignmentPanel
- ClassReportExport

School admin components:

- SchoolOverviewMetrics
- TeacherSetupPanel
- ClassSetupPanel
- RosterImportPanel
- RosterExportPanel
- ReportDownloadPanel
- StandardsCoverageTable
- AuditEventList
- ImplementationChecklist

Shared components:

- RoleShell
- RoleNav
- StatusPill
- ProgressMeter
- EmptyState
- LoadingState
- BlockedState
- ReviewGateBanner
- AccessibilitySettings

## Page Inventory

Student pages:

- `/student/home`
- `/student/worlds`
- `/student/worlds/:subject`
- `/student/lesson/:lessonId`
- `/student/tutor`
- `/student/rewards`
- `/student/group-missions`
- `/student/portfolio`

Parent pages:

- `/parent/home`
- `/parent/children`
- `/parent/children/:studentId`
- `/parent/rewards`
- `/parent/support-plan`
- `/parent/reports`

Teacher pages:

- `/teacher/home`
- `/teacher/classes`
- `/teacher/classes/:classId`
- `/teacher/classes/:classId/live`
- `/teacher/classes/:classId/group-missions`
- `/teacher/classes/:classId/reports`
- `/teacher/review`

School admin pages:

- `/school/home`
- `/school/teachers`
- `/school/classes`
- `/school/rosters`
- `/school/reports`
- `/school/audit`
- `/school/implementation`

The current prototype may still use hash/view routing. These routes define the target product structure for future framework migration or route refactoring.

## Design Tokens To Add

Recommended token groups:

```txt
--font-display
--font-body

--color-ink
--color-paper
--color-surface
--color-border

--color-math
--color-reading
--color-writing
--color-science
--color-social-studies
--color-code
--color-arts
--color-life
--color-career

--status-ready
--status-active
--status-stuck
--status-mastered
--status-review
--status-locked

--radius-student-card
--radius-dashboard-card
--radius-pill

--shadow-soft
--shadow-lifted
--shadow-focus

--motion-fast
--motion-medium
--motion-slow
```

## Implementation Phases

### Phase 1: Style Foundation

Build:

- font loading for Grandstander and body font
- subject-world color tokens
- shared button/input/status/progress styles
- page transition primitives
- sound setting placeholder
- reduced-motion support

Acceptance:

- Student pages visibly change identity.
- Adult pages remain readable and professional.
- No text overlap on mobile or desktop.

### Phase 2: Role Shell Redesign

Build:

- separate student, parent, teacher, and school-admin home layouts
- role-specific navigation
- clear current role/account context
- no dead-looking placeholder buttons

Acceptance:

- Each role has its own first-screen purpose.
- Navigation makes clear what is available and what is still coming.

### Phase 3: Student Academy Worlds

Build:

- student academy home
- level and XP display
- subject worlds grid
- subject progress and next lesson cards
- reward milestone card
- tutor entry

Acceptance:

- The student knows what to do in under 5 seconds.
- The screen feels like a learning academy, not an admin dashboard.

### Phase 4: App-Led Lesson Player

Build:

- visual hook
- objective and why-it-matters section
- visual model stage
- student-facing teaching explanation
- guided practice
- confusion input
- tutor diagnosis
- common misunderstanding
- mastery and XP result

Acceptance:

- The app can teach the lesson without a teacher reading from notes.
- Tutor help starts from the student's written confusion.

### Phase 5: Parent And Teacher Product Polish

Build:

- parent child-progress home
- parent reward center
- teacher class launch cockpit
- teacher live monitor polish
- school admin roster/report polish

Acceptance:

- The product feels sellable to schools and understandable to families.

### Phase 6: Asset And Visual System

Build:

- approved visual asset library
- subject-world icon/illustration style
- diagram templates
- tutor visual templates
- generated visual review queue

Acceptance:

- Every pilot lesson has at least one meaningful visual.
- Generated visuals stay blocked until approved.

## Design Acceptance Criteria

A redesigned screen passes only if:

- It clearly belongs to the correct role.
- It tells the user what to do next.
- It uses subject-world identity when educational.
- It does not bury the learning action under admin clutter.
- It has usable empty, loading, error, and blocked states.
- It works on mobile and desktop.
- Text does not overlap or overflow.
- Interactive elements are large enough.
- Color is not the only signal.
- Motion respects reduced-motion settings.
- Student screens feel engaging without becoming chaotic.
- Adult screens feel professional without becoming lifeless.

## What To Avoid

Avoid:

- dashboards that look like internal admin tools for students
- lesson screens written for teachers instead of learners
- generic cards with no visual hierarchy
- small token changes that do not visibly transform the app
- placeholder buttons that do nothing
- static text dumps
- decorative images that do not teach
- rewards for raw screen time
- shame-based streaks or public ranking
- unrestricted student chat/search/tool access
- dense tables on student pages
- one-color visual themes
- tiny controls
- animation that interrupts reading

## North Star

K-12 Learning Academies should feel like a complete academy product:

- playful enough for students to want to enter
- structured enough for parents to trust
- operational enough for teachers to run class
- serious enough for schools to buy
- rigorous enough to improve learning, not just entertain

The redesign should make the app feel like the teacher, tutor, coach, progress tracker, and classroom operating system are working together.
