# 88 — Supabase QA and Security Checklist

## Verified (2026-06-10, via Supabase MCP)
- [x] 20/20 proposal tables exist (+ snapshot table = 21)
- [x] RLS enabled on all tables
- [x] 51+ policies; every table covered
- [x] No service role key anywhere in client code (audit script enforces)
- [x] Anon key + URL only env values exposed to browser
- [x] handle_new_user / set_updated_at: EXECUTE revoked from anon+authenticated
- [x] Helper functions: EXECUTE revoked from anon
- [x] tsc clean; production build passes

## Accepted advisor warnings
`*_security_definer_function_executable (authenticated)` on the 9 RLS helper
functions: `authenticated` must keep EXECUTE for policies to evaluate, and the
functions only return whether the CALLER can access a given row (auth.uid()
based) — no data disclosure. Re-review when student logins ship.

## Manual test script (run after `npm run dev`)
1. Sign up with a fresh email → expect profile row (role `parent`).
2. Complete lesson sections + quiz → expect snapshot row updated.
3. Refresh browser → progress restored from Supabase.
4. Sign out, sign in as a DIFFERENT user → expect a fresh student, no
   access to the first user's data (RLS).
5. In SQL editor as service role: confirm rows exist for both students.
6. Attempt cross-user read with anon key + user A token on user B's
   student_id → expect empty result (RLS).

## Outstanding security work (pre-launch blockers)
- [ ] Rotate service role key + anon key (both were shared in chat during dev)
- [ ] Email confirmation decision (on for prod, off for dev)
- [ ] Delete/export data flows (docs/84, COPPA) — no delete policies yet
- [ ] Rate limiting / abuse review for sign-up
- [ ] Audit logging for admin access
