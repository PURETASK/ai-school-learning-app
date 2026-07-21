import { randomBytes } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getRequestSessionAsync } from "../src/auth.js";
import { loadEnvFile } from "../src/env.js";
import {
  normalizeSupabaseAuthResponse,
  supabaseAdminCreateUser,
  supabaseAdminDeleteUser,
  supabaseGetUser,
  supabaseRefreshSession,
  supabaseSignIn,
  supabaseSignOut,
  supabaseUpdatePassword
} from "../src/supabaseAuth.js";

loadEnvFile();

const execute = process.argv.includes("--execute");
const evidencePath = resolve("logs", "supabase-auth-live-verification.json");
const roles = [
  { role: "parent", scope: "own-household", guardianId: "live-check-guardian" },
  { role: "student", scope: "own", studentId: "live-check-student" },
  { role: "teacher", scope: "assigned", teacherId: "live-check-teacher", schoolId: "live-check-school" },
  { role: "school-admin", scope: "school", schoolId: "live-check-school" }
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function bearerRequest(accessToken) {
  return { headers: { authorization: `Bearer ${accessToken}` } };
}

function verificationEnv() {
  return {
    ...process.env,
    NODE_ENV: "production",
    AUTH_PROVIDER: "supabase",
    AUTH_REQUIRE_EMAIL_VERIFIED: "true"
  };
}

if (!execute) {
  console.log("execute=false");
  console.log("This check creates temporary Supabase Auth users, verifies signed role claims, exercises refresh/password/logout, and deletes the users.");
  console.log("Run: npm run auth:verify:live -- --execute");
  process.exit(0);
}

const runId = `${Date.now()}-${randomBytes(4).toString("hex")}`;
const createdUsers = [];
const checks = [];

try {
  for (const roleSpec of roles) {
    const email = `nexus-auth-${roleSpec.role}-${runId}@example.test`;
    const password = `Nexus!${randomBytes(12).toString("base64url")}9a`;
    const appMetadata = {
      ...roleSpec,
      userId: `live-check-user-${roleSpec.role}`
    };
    const created = await supabaseAdminCreateUser({
      email,
      password,
      emailConfirm: true,
      userMetadata: { display_name: `Nexus ${roleSpec.role} verification` },
      appMetadata
    });
    const userId = String(created.user?.id || created.id || "");
    assert(userId, `${roleSpec.role}: Supabase did not return a user id.`);
    createdUsers.push(userId);

    const signedIn = normalizeSupabaseAuthResponse(await supabaseSignIn({ email, password }));
    assert(signedIn.accessToken && signedIn.refreshToken, `${roleSpec.role}: signin did not return a session.`);
    assert(signedIn.user.emailVerified, `${roleSpec.role}: confirmed test identity is not email verified.`);
    assert(signedIn.user.appMetadata.role === roleSpec.role, `${roleSpec.role}: app_metadata role was not preserved.`);

    const session = await getRequestSessionAsync(bearerRequest(signedIn.accessToken), verificationEnv());
    assert(session.authenticated, `${roleSpec.role}: the application rejected the signed provider token (${session.authError || "no reason returned"}).`);
    assert(session.role === roleSpec.role, `${roleSpec.role}: application role did not match the trusted claim.`);
    assert(session.scope === roleSpec.scope, `${roleSpec.role}: application scope did not match the trusted claim.`);
    for (const claim of ["studentId", "guardianId", "teacherId", "schoolId"]) {
      if (roleSpec[claim]) assert(session[claim] === roleSpec[claim], `${roleSpec.role}: ${claim} was not resolved from app_metadata.`);
    }

    const providerUser = normalizeSupabaseAuthResponse({ user: await supabaseGetUser(signedIn.accessToken) });
    assert(providerUser.user.id === userId, `${roleSpec.role}: provider user lookup returned the wrong user.`);

    const refreshed = normalizeSupabaseAuthResponse(await supabaseRefreshSession({ refreshToken: signedIn.refreshToken }));
    assert(refreshed.accessToken, `${roleSpec.role}: refresh did not issue an access token.`);

    if (roleSpec.role === "parent") {
      const newPassword = `Revised!${randomBytes(12).toString("base64url")}7b`;
      await supabaseUpdatePassword({ accessToken: refreshed.accessToken, password: newPassword });
      const passwordSession = normalizeSupabaseAuthResponse(await supabaseSignIn({ email, password: newPassword }));
      assert(passwordSession.accessToken, "parent: updated password could not create a new session.");
      await supabaseSignOut({ accessToken: passwordSession.accessToken });
      checks.push("password-update-and-current-session-signout");
    } else {
      await supabaseSignOut({ accessToken: refreshed.accessToken });
    }

    checks.push(`${roleSpec.role}-signed-claims-refresh-signout`);
  }

  const evidence = {
    schemaVersion: 1,
    provider: "supabase",
    projectRef: new URL(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0],
    verifiedAt: new Date().toISOString(),
    roles: roles.map(({ role, scope }) => ({ role, scope })),
    checks,
    passed: true,
    note: "No access tokens, refresh tokens, passwords, or user emails are stored in this artifact."
  };
  await writeFile(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ passed: true, evidencePath, checks }, null, 2));
} finally {
  const deletionFailures = [];
  for (const userId of createdUsers.reverse()) {
    try {
      await supabaseAdminDeleteUser(userId);
    } catch (error) {
      deletionFailures.push(error.message || String(error));
    }
  }
  if (deletionFailures.length) {
    console.error(`cleanupFailures=${deletionFailures.length}`);
    process.exitCode = 1;
  }
}
