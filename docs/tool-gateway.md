# Agent Tool Gateway

## Purpose

The Tool Gateway is the controlled path for connecting MCP servers, browser automation, OpenAI image generation, curriculum exports, standards lookup, content review, and future agent tools.

No external tool should be called directly from a student lesson, AI tutor, or content publish flow. Tools must be registered, role-gated, logged, and review-gated when they can affect curriculum, child data, generated media, cost, browser state, or published content.

## Current Registry

| Tool | Owner agent | Risk | Allowed roles | Review |
| --- | --- | --- | --- | --- |
| Visual generation planner | Visual Learning Agent | API cost | Platform admin, school admin, teacher | Required |
| Lesson audit | QA Agent | None | Platform admin, school admin, teacher, parent | Not required |
| Content review gate | Content Operations Agent | None | Platform admin, school admin, teacher | Required |
| Browser preview check | QA Agent | Local browser | Platform admin, school admin | Not required |
| Curriculum export summary | Curriculum Agent | None | Platform admin, school admin, teacher | Not required |
| Standards lookup | Curriculum Agent | None | Platform admin, school admin, teacher, parent | Not required |
| Truth and tutor quality review | Truth And Fact-Check Agent | Web research | Platform admin, school admin, teacher | Required |
| Explanation variation studio | Teacher And Explanation Design Agent | None | Platform admin, school admin, teacher, parent | Not required |
| Fun and retention lesson designer | Fun And Retention Design Agent | None | Platform admin, school admin, teacher, parent | Not required |
| Syllabus and misconception research planner | Curriculum Web Audit And Misconception Research Agent | Web research | Platform admin, school admin, teacher | Required |
| Live curriculum source audit | Curriculum Web Audit And Misconception Research Agent | Web fetch | Platform admin, school admin, teacher | Required |

## Execution Contract

All tool runs use:

```txt
toolId
role
input
```

The gateway returns:

```txt
accepted
summary
nextAction
requiresHumanReview
data
```

Every completed or blocked run is stored in `state.toolCallLogs` with tool id, tool name, owner agent, role, status, external risk, review flag, summary, and timestamp.

Structured output is preserved in the tool-call payload. Research tools use that payload for source ledgers, likely hard parts, redesign tasks, acceptance criteria, and staff review evidence.

The `explanation_variation_studio` tool is the planning bridge between the teacher, tutor, visual, truth-policy, and web-audit agents. It creates multiple explanation routes, multiple visual types, a teacher plan, a tutor handoff, and a staff-only web-audit handoff without calling external tools directly.

The `live_curriculum_source_audit` tool is the staff-only live web connection. It accepts approved HTTPS curriculum and practice-guide source URLs, fetches the source on the server, extracts title/description/snippets, creates source-ledger payloads, and records a redesign task for manager review. It does not publish content, expose browsing to students, or accept arbitrary URLs.

Approving a completed `syllabus_misconception_research` review item creates a review-stage content draft. Rejecting it leaves the research payload logged but does not affect drafts.

Server-created tutor turns and content drafts also run a local Truth And Fact-Check scoring pass before they are persisted. Content drafts additionally run a lesson-body completeness check for student summary, essential question, teaching sections, helper notes, misconception repair, visual supports, quiz checkpoints, source cards, and group homework when age-appropriate. These checks can add a manager review item or block publication, but they do not perform unrestricted web search; any standards or web research still has to run through this gateway as a staff-controlled tool call.

Approved content drafts convert into published lesson records. The production projection then writes those records into lesson, activity, quiz, quiz question, and lesson-standard rows so review approval affects curriculum data instead of only changing a draft status.

## Connection Rules

1. Student roles cannot trigger external tools, cost-bearing APIs, or browser automation.
2. Generated images remain review-only until a human approves the visual asset.
3. Standards stay as data tags and are not hardcoded to one state.
4. Content publication remains blocked if lesson body, evidence, visual, accessibility, age-fit, academic review, or Truth And Fact-Check gates fail.
5. Parent-visible tools can summarize and inspect, but cannot publish, generate media, or change curriculum.
6. Browser automation is staff-only and should be used for preview verification, not learner workflows.
7. Any new MCP server must be represented as one or more registry entries with explicit owner, role access, risk, and review behavior.
8. Truth-policy review decides whether staff-side web research is needed; students do not receive unrestricted web search.
9. Syllabus and misconception research must produce source-ledger entries and redesign tasks before a lesson is changed.
10. Explanation variation planning can be parent-visible, but generated visuals, web research, and student-facing lesson changes still require their own gated tools and review workflow.
11. Live source audit can fetch only approved HTTPS source targets and must store findings for human review before they affect lessons.

## Recommended MCP Order

1. OpenAI API for guardrailed tutoring, image prompt processing, and generated review assets.
2. Browser/Playwright verification for local app QA.
3. GitHub for version control, issues, and PR review when the codebase moves to a remote repo.
4. Vercel for deployment previews, environment variables, and production monitoring.
5. Optional later connectors for Google Classroom/LMS exports, Notion planning, or Figma design review.

Do not connect school roster systems, student messaging, payments, or public social tools until the privacy, auth, and role-based access model is production-ready.

## Implementation Files

- `src/toolGateway.js` defines the registry and pure execution handlers.
- `src/engine.js` exposes gateway actions and seeds `toolCallLogs`.
- `scripts/serve.mjs` persists tool runs through `POST /api/tool-gateway/execute`.
- `src/app.js` renders the Tools tab and execution console.
- `tests/run-tests.mjs` verifies registry behavior, blocked roles, standards lookup, lesson audit, explanation variation payloads, research payloads, redesign tasks, and curriculum export.
