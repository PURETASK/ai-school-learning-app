# School And Classroom Product Plan

> **Commercial scope:** `docs/BRIDGE_GRADE_6_MATH_INTERVENTION_PRODUCT_CONTRACT.md` controls the first sellable pilot. This plan supplies the broader classroom capability model and must not expand the active pilot beyond that contract.

## Product Position

K-12 Learning Academies should become a school-sellable learning academy where a student can attend a class inside the app. The product should help schools run engaging middle-school and K-12 learning blocks with direct instruction, visual explanations, tutor support, active tasks, group projects, mastery checks, and teacher dashboards.

The first commercial wedge is:

```txt
Bridge Academy Grade 6 Math Intervention Class
Grade 6 Math only for the first pilot
25 reviewed sessions delivered over 6-8 weeks
Designed for a 35-55 minute class period
```

This wedge gives the product a focused buyer story while preserving the full K-12 architecture.

## Buyers And Users

Primary buyers:

- Middle-school principals.
- District curriculum leaders.
- Instructional technology leaders.
- Intervention and enrichment program owners.
- Charter, private, microschool, and homeschool co-op leaders.

Daily users:

- Students attend class sessions and complete lessons, quizzes, projects, tutor reflections, and group tasks.
- Teachers launch class sessions, monitor progress, review confusion patterns, assign reteach or challenge paths, and grade projects.
- Parents review child progress, strengths, struggles, suggested support, and rewards when parent-controlled rewards are enabled.
- School admins manage rosters, classes, teacher assignments, reports, implementation status, and compliance controls.

## What A Student Attends

A school class session should feel like a live learning block inside the app:

1. Arrival screen.
   The student sees their class, subject, level, streak, XP, today objective, and a visual hook.

2. Bell ringer.
   A short retrieval or curiosity prompt activates prior knowledge.

3. Visual mini-lesson.
   The app teaches the concept with a diagram, model, animation, image, data visual, simulation, or worked example.

4. Guided practice.
   Students answer small steps with immediate feedback and hints.

5. Confusion check.
   Students write what they do not understand in plain text. The tutor classifies the stuck point before helping.

6. Active task.
   Students build, sort, debate, draw, explain, model, simulate, compare, or diagnose something connected to the lesson.

7. Group mission for grades 6-12.
   Students get assigned roles, a shared artifact, and individual evidence they must submit.

8. Mastery check.
   A quiz, written explanation, project checkpoint, or performance task measures understanding.

9. Reteach or challenge.
   Students who miss the target get a targeted reteach path. Students who master the idea get a challenge or transfer task.

10. Exit ticket and XP.
   The student summarizes the idea, rates confidence, receives mastery/retention XP, and sees the next recommended step.

## Teacher Experience

Teacher screens must make the app usable as a real class tool:

- Class roster with attendance/session state.
- Launch Class button for today lesson.
- Live class monitor showing who is ready, stuck, inactive, done, or needs help.
- Confusion heatmap grouped by misconception type.
- Group mission builder with roles and shared artifact requirements.
- Assignment controls for reteach, challenge, homework, and retention checks.
- Project rubric and grading view.
- Student profile with mastery, quiz scores, missing work, tutor flags, strengths, and struggles.
- Class report with standards coverage, progress, intervention needs, and engagement.
- Review queue for AI tutor flags, source findings, generated visuals, and content changes.

## School Admin Experience

School-admin screens must support buying, implementation, and compliance:

- School setup and teacher invitations.
- Class creation and roster import.
- Teacher-class assignments.
- Student enrollment and guardian link status.
- Role and permission review.
- Usage dashboards by class, grade, subject, teacher, and student.
- Standards coverage and curriculum map reports.
- Intervention and enrichment reports.
- Accessibility and accommodation status.
- Audit logs for role changes, student links, content review, AI tutor events, and data access.
- Exportable reports for school leadership.

## Parent Experience In School Mode

Parent access should be useful but scoped:

- See linked child progress only.
- See current level, XP, mastery, strengths, struggles, missing work, and suggested support.
- Review teacher-approved recommendations.
- Approve or disable parent-controlled rewards.
- See tutor safety or confusion summaries when policy allows.
- Avoid exposing other students, class discussion, group members, or staff-only source notes.

## Learning And Retention Model

School/Classroom Mode must still be different from ordinary school:

- Teach with visuals before abstract rules.
- Ask students to explain their confusion instead of only marking answers wrong.
- Use multiple explanation types: diagram, metaphor, first step, real example, first principles, and gentle quiz.
- Use group tasks with roles and individual accountability.
- Use spaced retrieval after 24 hours, 3-7 days, and later spiral review.
- Track joy, frustration, confidence, independence, score, recall, and tutor helpfulness.
- Reward mastery, transfer, and delayed recall instead of raw completion.

## Data Requirements

The school product needs these data objects beyond the current learner model:

- Schools.
- School terms.
- Class sections.
- Class meetings or sessions.
- Rosters and enrollments.
- Teacher assignments.
- Student attendance/session state.
- Lesson launch records.
- Group missions.
- Group roles.
- Group artifacts.
- Teacher interventions.
- Intervention notes.
- Standards coverage reports.
- School-level usage reports.
- District or organization settings.

These objects should connect to the existing curriculum, lesson, quiz, mastery, assignment, tutor, reward, audit, visual, and content review models.

Implementation status: the current build seeds the first Bridge Academy pilot school, class section, class session, group mission, group artifact accountability rows, teacher intervention rows, and school report snapshot into the normalized production projection. The app also has a School role page for roster/report readiness, class creation, learner enrollment, all-or-nothing CSV roster import, pending learner invitations, school-scoped roster export, a Teacher live monitor for the same class session, student group-evidence submission, teacher launch/pause/complete controls, teacher intervention creation/resolution, and classroom/school-specific API/write routes. The remaining production work is turning teacher invitations, group mission editing, attendance, and report downloads into fully editable, database-backed school-admin workflows.

## Integration Requirements

To sell to schools, plan for:

- Managed production auth with verified roles.
- SIS/rostering import path such as CSV first, then OneRoster or Clever/ClassLink later.
- LMS export or assignment interoperability later.
- District-safe reporting exports.
- FERPA/COPPA-ready data handling.
- Accessibility review against WCAG expectations.
- Admin audit logs.
- Data retention and deletion workflows.
- School onboarding material, teacher guide, student guide, parent letter, and implementation checklist.

## First Sellable Pilot

The controlling pilot definition is `docs/BRIDGE_GRADE_6_MATH_INTERVENTION_PRODUCT_CONTRACT.md`:

- Bridge Academy Grade 6 Math Intervention Class.
- One Grade 6 Math track with exactly 25 reviewed sessions.
- A 6-8 week pilot using 35-55 minute class periods.
- App-led visual teaching, guided and active practice, plain-text confusion diagnosis, guardrailed tutor help, group and individual evidence, mastery proofs, adaptive routes, delayed recall, and exit tickets.
- Teacher launch, live monitoring, intervention, and evidence review.
- School setup, roster, scoped reporting, and linked-parent progress visibility.

Additional Bridge Academy grades and subjects remain architecture goals, not active pilot scope.

## Production Acceptance Criteria

The following capabilities remain required. The complete release gate and measurable targets are controlled by the product contract. The school product is not eligible for a design-partner pilot until:

- A teacher can create or receive a class roster.
- Students can log in with student-scoped accounts.
- A teacher can launch a class session.
- The app directly teaches the lesson to students.
- The teacher can monitor live progress and confusion.
- Students can complete practice, quiz, tutor help, group task, and exit ticket.
- Teacher and parent dashboards show correct scoped data.
- School admins can manage teachers, classes, and reports.
- Role access is enforced server-side.
- Content, visuals, tutor behavior, and source findings go through review gates.
- The database is the system of record.
- Email verification, password reset, and session revocation are production-backed.
- Critical flows have automated tests and manual QA scripts.

## Implementation Order

Use the ordered backlog in `docs/55_MVP_BACKLOG_AND_TASK_BREAKDOWN.md`. It establishes production data and identity before the golden session, classroom operations, 25-session content package, launch gates, and pilot.
