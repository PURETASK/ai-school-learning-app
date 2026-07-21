import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { loadEnvFile } from "../src/env.js";

loadEnvFile();

const execute = process.argv.includes("--execute");
const baseUrl = String(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/\/+$/, "");
const secretKey = String(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
const appUrl = String(process.env.JUDGE_APP_URL || "PENDING_RENDER_URL").trim();
const outputPath = resolve("logs", "judge-login-sheet.md");

if (!baseUrl || !secretKey) throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY are required.");

const accounts = [
  {
    label: "Student",
    email: String(process.env.JUDGE_STUDENT_EMAIL || "judge-student@nexus-learning-os.demo").toLowerCase(),
    appMetadata: { role: "student", scope: "own", userId: "user-avery", studentId: "avery" },
    profile: { id: "user-avery", role: "student", display_name: "Avery Judge Demo" }
  },
  {
    label: "Teacher",
    email: String(process.env.JUDGE_TEACHER_EMAIL || "judge-teacher@nexus-learning-os.demo").toLowerCase(),
    appMetadata: { role: "teacher", scope: "assigned", userId: "user-teacher-demo", teacherId: "teacher-demo-1", schoolId: "school-demo-1" },
    profile: { id: "user-teacher-demo", role: "teacher", display_name: "Bridge Academy Demo Teacher" }
  },
  {
    label: "Parent",
    email: String(process.env.JUDGE_PARENT_EMAIL || "judge-parent@nexus-learning-os.demo").toLowerCase(),
    appMetadata: { role: "parent", scope: "own-household", userId: "user-parent-1", guardianId: "parent-1" },
    profile: { id: "user-parent-1", role: "parent", display_name: "Avery Demo Parent" }
  },
  {
    label: "School administrator",
    email: String(process.env.JUDGE_SCHOOL_ADMIN_EMAIL || "judge-school-admin@nexus-learning-os.demo").toLowerCase(),
    appMetadata: { role: "school-admin", scope: "school", userId: "user-school-admin-judge", schoolId: "school-demo-1" },
    profile: { id: "user-school-admin-judge", role: "school-admin", display_name: "Bridge Pilot School Administrator" }
  }
];

function password() {
  return `Nexus!${randomBytes(15).toString("base64url")}6A`;
}

async function request(path, { method = "GET", body, headers = {} } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      ...headers
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(String(payload.message || payload.msg || payload.error || `Request failed with ${response.status}.`));
    error.status = response.status;
    throw error;
  }
  return payload;
}

async function assertTables() {
  const required = ["users", "students", "guardians", "teachers", "schools", "school_staff_memberships", "attendance_records", "lesson_scratchpads", "interactive_skill_evidence"];
  const missing = [];
  for (const table of required) {
    try {
      await request(`/rest/v1/${table}?select=id&limit=1`);
    } catch (error) {
      if (error.status === 404) missing.push(table);
      else throw error;
    }
  }
  if (missing.length) throw new Error(`Apply the Supabase release migrations before provisioning judges. Missing: ${missing.join(", ")}.`);
}

async function listAuthUsers() {
  const payload = await request("/auth/v1/admin/users?page=1&per_page=1000");
  return Array.isArray(payload.users) ? payload.users : [];
}

async function upsertAuthUser(account, accountPassword, existingUsers) {
  const existing = existingUsers.find((user) => String(user.email || "").toLowerCase() === account.email);
  const body = {
    email: account.email,
    password: accountPassword,
    email_confirm: true,
    user_metadata: { display_name: account.profile.display_name, judge_demo: true },
    app_metadata: account.appMetadata
  };
  if (existing?.id) return request(`/auth/v1/admin/users/${encodeURIComponent(existing.id)}`, { method: "PUT", body });
  return request("/auth/v1/admin/users", { method: "POST", body });
}

async function upsertRows(table, rows, onConflict = "id") {
  return request(`/rest/v1/${table}?on_conflict=${encodeURIComponent(onConflict)}`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: rows
  });
}

if (!execute) {
  console.log("execute=false");
  console.log("Run: npm run judges:provision -- --execute");
  process.exit(0);
}

await assertTables();
const existingUsers = await listAuthUsers();
const createdAt = new Date().toISOString();
const credentials = [];

for (const account of accounts) {
  const accountPassword = password();
  const provider = await upsertAuthUser(account, accountPassword, existingUsers);
  const providerUser = provider.user || provider;
  await upsertRows("users", [{
    ...account.profile,
    email: account.email,
    email_verified: true,
    auth_provider: "supabase",
    provider_subject: providerUser.id,
    status: "judge-demo",
    created_at: createdAt,
    updated_at: createdAt
  }]);
  credentials.push({ label: account.label, email: account.email, password: accountPassword });
}

await upsertRows("school_staff_memberships", [{
  id: "school-staff-user-school-admin-judge-school-demo-1",
  school_id: "school-demo-1",
  user_id: "user-school-admin-judge",
  role: "school-admin",
  status: "active",
  invited_by_user_id: "user-platform-admin",
  created_at: createdAt,
  revoked_at: null
}]);

await mkdir(resolve("logs"), { recursive: true });
const lines = [
  "# Nexus Learning OS Judge Login Sheet",
  "",
  `Application: ${appUrl}`,
  `Generated: ${createdAt}`,
  "",
  "These accounts use confirmed Supabase Auth identities and role-scoped application claims.",
  "",
  ...credentials.flatMap((entry) => [
    `## ${entry.label}`,
    `- Email: ${entry.email}`,
    `- Password: ${entry.password}`,
    ""
  ]),
  "## Suggested Review Path",
  "1. Sign in as Student and complete the Grade 6 ratio lesson.",
  "2. Use the tutor from the lesson and submit the mastery check.",
  "3. Sign in as Teacher and inspect classroom progress and intervention signals.",
  "4. Sign in as Parent and inspect Avery's strengths, struggles, and recommended support.",
  "5. Sign in as School administrator and inspect school readiness, class sessions, and reporting."
];
await writeFile(outputPath, `${lines.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ passed: true, accounts: credentials.map(({ label, email }) => ({ label, email })), outputPath }, null, 2));
