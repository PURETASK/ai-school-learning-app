# Auth, Repository, And OpenAI Integration

## What Is Implemented

The server now has a production-facing integration layer:

- Request sessions are parsed server-side from `Authorization: Bearer ...` or `x-k12-session`.
- Session tokens can be HMAC-signed with `AUTH_SESSION_SECRET`.
- Local signup and signin routes create signed session tokens for parent, teacher, and student prototype accounts.
- A provider-neutral production auth adapter maps verified OIDC/JWT claims into app session claims.
- Trusted auth-proxy mode can accept pre-verified claims only when `AUTH_TRUSTED_PROXY=true` and `AUTH_PROXY_SHARED_SECRET` matches.
- In production with `AUTH_PROVIDER` configured, local prototype session tokens are rejected unless `ALLOW_LOCAL_SESSION_TOKENS_IN_PRODUCTION=true` is explicitly set.
- Dev-only role headers can be enabled with `ALLOW_DEV_AUTH_HEADERS=true`.
- Local preview falls back to `K12_DEFAULT_ROLE=platform-admin` when not in production.
- State reads/writes go through a repository interface instead of direct server file calls.
- `K12_REPOSITORY_MODE=postgres` switches persistence to PostgreSQL through `DATABASE_URL` and `psql`.
- OpenAI image generation is routed through server-side checks for API key, prompt size, daily limit, estimated cost, and human review.
- Gift-card fulfillment is routed through a parent/admin server gateway with manual and Tremendous-compatible modes, amount caps, daily caps, and no stored redemption codes.
- Tutor asks and tutor feedback now go through server routes that enforce session claims, learner consent, and `ai_tutor_events` write permissions before writing the repository.

## Database Mode

Local fallback:

```bash
npm start
```

PostgreSQL-backed mode:

```powershell
$env:DATABASE_URL="postgresql://..."
$env:K12_REPOSITORY_MODE="postgres"
npm start
```

Apply the schema first:

```powershell
$env:DATABASE_URL="postgresql://..."
npm run db:apply
```

Verify a staging database after applying the schema:

```powershell
$env:DATABASE_URL="postgresql://..."
npm run db:verify
```

Dry-run the database verification contract without credentials:

```powershell
node scripts/verify-database.mjs --dry-run
```

Export normalized seed data:

```powershell
npm run export:seed
```

The Postgres repository now writes to `app_state_snapshots` and also upserts normalized rows for the core production tables. This includes identity, roster, curriculum, drafts, visual assets, AI tutor events, quiz attempts, lesson progress, mastery records, review items, rewards, gift-card fulfillment status, consent, learning events, and audit events.

The production schema now includes identity lifecycle tables for launch hardening:

```txt
account_invitations
guardian_student_links
teacher_class_assignments
session_revocations
auth_audit_events
```

Normalized read endpoints:

```txt
GET /api/repository/tables
GET /api/repository/tables/content_drafts?limit=25
GET /api/repository/tables/quiz_attempts?limit=25
GET /api/repository/tables/agent_review_items?limit=25
GET /api/learning/catalog
POST /api/learning/quiz
GET /api/content/drafts
GET /api/content/visual-assets
GET /api/tutor/events
```

Local account endpoints:

```txt
POST /api/auth/signup
POST /api/auth/signin
GET /api/auth/session
POST /api/auth/request-email-verification
POST /api/auth/verify-email
POST /api/auth/request-password-reset
POST /api/auth/reset-password
POST /api/auth/revoke-session
POST /api/auth/child-account
```

Signup supports `parent`, `teacher`, and `student` roles. Passwords are stored as salted `scrypt-sha256` hashes in local prototype state, and the raw password is never persisted. The response returns a signed session token that the browser stores locally and sends as `Authorization: Bearer ...` on API requests. Adult accounts start as pending email verification, and parent sessions cannot create child accounts until the parent email claim is verified. Student-created learner records default to parent-review mode for AI helper consent.

This is still local auth, but the product lifecycle is now represented: one-time email verification codes, password reset codes, session revocation checks on every API request, and parent-managed child account creation. Production still needs an external identity provider, real email delivery, provider-backed reset links, database-backed row policies, rate limits, account deletion/export workflows, and removal or provider-wrapping of local password signup/signin.

## Production Identity Adapter

The provider-neutral adapter is in `src/productionAuth.js`. It expects a managed identity provider or trusted auth proxy to verify passwords, email ownership, password reset, and token signatures outside the app. The app maps verified claims into the same session shape used by repository access checks.

Required production environment variables:

```powershell
$env:NODE_ENV="production"
$env:AUTH_PROVIDER="oidc"
$env:AUTH_ISSUER="https://your-provider.example/"
$env:AUTH_AUDIENCE="k12-learning-app"
$env:AUTH_JWKS_URL="https://your-provider.example/.well-known/jwks.json"
```

Supabase Auth shortcut for this project:

```powershell
$env:NODE_ENV="production"
$env:SUPABASE_URL="https://hqsydwjcpcammmfftyqi.supabase.co"
$env:SUPABASE_JWKS_URL="https://hqsydwjcpcammmfftyqi.supabase.co/auth/v1/.well-known/jwks.json"
```

Browser-safe Supabase variables can also use the common frontend names:

```powershell
$env:NEXT_PUBLIC_SUPABASE_URL="https://hqsydwjcpcammmfftyqi.supabase.co"
$env:NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="..."
```

Keep `SUPABASE_SECRET_KEY`, service-role keys, and the database password server-only. Do not put them in browser bundles, committed `.env` files, screenshots, or docs. Direct SQL migration still needs the separate Postgres database password in `DATABASE_URL`; the Supabase secret/server API key is not a database password.

Trusted proxy mode, for deployments where an upstream edge/auth layer verifies the token:

```powershell
$env:AUTH_TRUSTED_PROXY="true"
$env:AUTH_PROXY_SHARED_SECRET="replace-with-long-random-secret"
$env:AUTH_VERIFIED_CLAIMS_HEADER="x-k12-verified-claims"
$env:AUTH_PROXY_SECRET_HEADER="x-k12-auth-proxy-secret"
```

Expected verified claims:

```json
{
  "iss": "https://your-provider.example/",
  "aud": "k12-learning-app",
  "sub": "provider-user-id",
  "email": "adult@example.com",
  "email_verified": true,
  "sid": "provider-session-id",
  "app_metadata": {
    "role": "parent",
    "scope": "own-household",
    "userId": "user-parent-1",
    "guardianId": "guardian-parent-1",
    "studentId": "avery",
    "schoolId": "school-demo-1"
  }
}
```

The adapter rejects unverified email by default, unsupported roles, wrong issuer, wrong audience, expired tokens, malformed trusted-proxy claims, and wrong proxy shared secrets. Local signup/signin remains for development only.

These endpoints are role-checked through the repository access policy before returning rows or writing learner evidence. In JSON mode they read table-shaped rows from the schema projection. In Postgres mode they query or upsert the normalized tables directly. Auth lifecycle routes use `writeAccountSecurity()` for users, guardians, teachers, students, links, consent, session revocations, and auth audit rows. `/api/learning/catalog` groups normalized lessons, activities, quizzes, standards, progress, mastery records, and quiz attempts into the app-facing catalog read model. `/api/learning/quiz` is the dedicated quiz-completion write path for submitted answers, quiz attempts, progress, mastery, recall schedules, and learning events; it allows student-owned, parent-household, teacher-assigned, or platform-admin scoped evidence writes after consent and placement checks. Content routes now use `writeContentWorkflow()` for draft creation, batch import, status changes, and published-catalog projection. Visual routes use `writeVisualWorkflow()` for review status, replacement, and generated visual review records. `/api/agent-command-center/review` uses `writeAgentReviewDecision()` so manager decisions update affected visual, content, tool, tutor, source-ledger, redesign, and published-catalog rows while removing stale pending review rows. `/api/content/drafts` reads normalized `content_drafts` rows and maps them back into the app-facing draft anatomy used by content operations. `/api/content/visual-assets` reads normalized `visual_assets` rows for staff review, including generated SVG previews projected as data-image URLs. `/api/tutor/events` reads normalized `ai_tutor_events` rows for learner-scoped tutor quality, first-principles usage, visual hints, feedback, safety flags, and Truth And Fact-Check review. `/api/agent-command-center/reviews` reads normalized `agent_review_items` for manager decisions, and `/api/audit/events` reads normalized data/auth audit events for platform-admin review.

Tutor write endpoints:

```txt
POST /api/tutor/ask
POST /api/tutor/feedback
```

`/api/tutor/ask` runs the adaptive tutor on the server, stores the authenticated learner id on the AI log, attaches an automatic Truth And Fact-Check review, and persists through the repository. When a provider response fails the quality gate, the server can make one bounded revision attempt (configurable up to two with `OPENAI_TUTOR_MAX_REVISION_ATTEMPTS`), passing the grader's issues back into the provider prompt. Each attempt stores its status, request id, usage, moderation result, grade, and revision issues in `provider_attempt_history`; a passing attempt replaces the local fallback, while a failed sequence keeps the safe local tutor response and enters manager review. `/api/tutor/feedback` records whether the response helped and queues Fun And Retention redesign signals when the learner is still confused, says it is too hard, or needs a picture.

The next repository pass should continue shrinking broad `/api/state` hydration by moving more feature screens onto explicit normalized routes.

## Session Claims

Expected claim fields:

```json
{
  "role": "parent",
  "scope": "own-household",
  "userId": "user-parent-1",
  "studentId": "avery",
  "guardianId": "guardian-parent-1",
  "teacherId": "teacher-demo-1",
  "schoolId": "school-demo-1"
}
```

Supported roles:

- `student`
- `parent`
- `teacher`
- `school-admin`
- `platform-admin`

Sensitive routes use these claims instead of trusting UI-submitted roles.

## OpenAI Images

Required:

```powershell
$env:OPENAI_API_KEY="..."
```

Optional controls:

```powershell
$env:OPENAI_IMAGE_MODEL="gpt-image-2"
$env:OPENAI_IMAGE_SIZE="1024x1024"
$env:OPENAI_IMAGE_QUALITY="medium"
$env:OPENAI_IMAGE_DAILY_LIMIT="12"
$env:OPENAI_IMAGE_MAX_COST_CENTS="25"
```

Generated images are still created as review-only visual assets. They must be approved in the manager review queue before they can become student-facing.
