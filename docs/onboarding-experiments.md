# Parent Setup, Recall, Rewards, And Experiments

This slice turns the learning model into product infrastructure. It adds parent-managed setup, consent-aware access, diagnostic placement, reward configuration, learning-event logging, recall scheduling, affect check-ins, and experiment tracking.

## Parent Setup

The setup flow is:

1. Parent account and email verification.
2. Learner profile with grade, academy, schedule, and accommodations.
3. Parent consent for data collection, AI helper, portfolio, and sharing controls.
4. Diagnostic placement by academy and subject need.
5. Reward plan configured by the family.

Launch rule: an under-13 learner cannot use student features until required parent consent and placement are ready. AI helper access is separately controlled.

## Diagnostic Placement

Placement is not age-only. Each learner receives a recommendation from diagnostic evidence:

- Foundation: reading and math foundations, with manipulatives before abstract tasks.
- Bridge: middle-school independence, collaboration, planning, and evidence use.
- Scholar: course readiness, study system, portfolio readiness, and internal progress records.

Parent override must be possible later, but it should not delete diagnostic history.

## Recall Scheduling

The prototype schedules recall from quiz mastery:

- Score below 70: reteach within 1 day.
- Score 70-84: recall at 1, 3, and 7 days.
- Score 85-94: recall at 3, 7, and 14 days.
- Score 95 or higher: recall at 7, 21, and 45 days.

Recall should mature into skill-based scheduling, not just lesson-based review.

## Rewards

Rewards are configured by parents and grade band. Good rewards support autonomy, competence, and relatedness:

- Creative unlocks.
- Family benefits.
- Mastery badges.
- Crew achievements.
- Portfolio markers and challenge unlocks.

Rewards should not use pay-to-win mechanics, public rankings, punishment for broken streaks, or screen-time maximization.

## Experiment Tracking

Experiments compare safe learning variants such as movement-first vs screen-only practice, choice of project theme, or structured group roles.

Required metrics:

- Immediate score.
- 24-hour recall.
- 7-day recall.
- Joy.
- Frustration.
- Independence.
- Parent support minutes.

The product should keep the variant that improves retention without raising frustration or parent burden.

## Implemented Prototype Behavior

- `createInitialState()` seeds consent, placements, rewards, events, recall schedules, mastery benefits, affect check-ins, and experiments.
- Quiz completion logs a learning event and schedules recall.
- Setup view shows onboarding progress, consent readiness, placement plans, and reward settings.
- Experiments view shows recall, telemetry, experiment templates, and recent runs.
- Tests protect consent gates, placement simulation, rewards, recall intervals, affect telemetry, and experiment dashboards.
