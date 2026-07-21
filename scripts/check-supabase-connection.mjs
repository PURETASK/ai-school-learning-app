import { spawn } from "node:child_process";
import { request } from "node:https";
import { Socket } from "node:net";
import { loadEnvFile } from "../src/env.js";
import { normalizedRepositoryTableIds } from "../src/repository.js";

loadEnvFile();

function bool(value) {
  return Boolean(String(value || "").trim());
}

function normalizeBaseUrl(value = "") {
  return String(value || "").trim().replace(/\/+$/, "");
}

function projectRefFromUrl(value = "") {
  try {
    return new URL(value).hostname.split(".")[0] || "";
  } catch {
    return "";
  }
}

function databaseUrlParts(value = "") {
  try {
    const parsed = new URL(value);
    return {
      host: parsed.hostname,
      port: Number(parsed.port || 5432),
      username: decodeURIComponent(parsed.username || ""),
      pooler: parsed.hostname.endsWith("pooler.supabase.com")
    };
  } catch {
    return { host: "", port: 0, username: "", pooler: false };
  }
}

function sanitize(value = "") {
  let output = String(value || "");
  if (process.env.DATABASE_URL) output = output.replaceAll(process.env.DATABASE_URL, "<DATABASE_URL>");
  if (process.env.SUPABASE_SECRET_KEY) output = output.replaceAll(process.env.SUPABASE_SECRET_KEY, "<SUPABASE_SECRET_KEY>");
  output = output.replace(/(postgres(?:ql)?:\/\/[^:\s]+:)[^@\s]+@/gi, "$1***@");
  output = output.replace(/sb_secret_[A-Za-z0-9_-]+/g, "sb_secret_***");
  return output;
}

function checkHttps(url, { clientErrorsReachable = false } = {}) {
  return new Promise((resolve) => {
    if (!url) {
      resolve({ ok: false, statusCode: 0, error: "not configured" });
      return;
    }

    const req = request(url, { method: "GET", timeout: 10000 }, (res) => {
      res.resume();
      res.on("end", () =>
        resolve({
          ok: res.statusCode >= 200 && (clientErrorsReachable ? res.statusCode < 500 : res.statusCode < 400),
          statusCode: res.statusCode,
          error: ""
        })
      );
    });
    req.on("timeout", () => {
      req.destroy(new Error("request timed out"));
    });
    req.on("error", (error) => resolve({ ok: false, statusCode: 0, error: sanitize(error.message) }));
    req.end();
  });
}

function checkTcp(host, port) {
  return new Promise((resolve) => {
    if (!host || !port) {
      resolve({ ok: false, error: "host or port not configured" });
      return;
    }

    const socket = new Socket();
    const done = (result) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(result);
    };
    socket.setTimeout(10000);
    socket.once("connect", () => done({ ok: true, error: "" }));
    socket.once("timeout", () => done({ ok: false, error: "connection timed out" }));
    socket.once("error", (error) => done({ ok: false, error: sanitize(error.message) }));
    socket.connect(port, host);
  });
}

function runPsql(sql) {
  return new Promise((resolve) => {
    if (!process.env.DATABASE_URL) {
      resolve({ ok: false, output: "", error: "DATABASE_URL is not configured" });
      return;
    }

    const psqlBin = process.env.PSQL_BIN || "psql";
    const child = spawn(psqlBin, [process.env.DATABASE_URL, "--no-psqlrc", "-v", "ON_ERROR_STOP=1", "-t", "-A", "-c", sql], {
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", (error) => resolve({ ok: false, output: "", error: sanitize(error.message) }));
    child.on("close", (code) => {
      resolve({
        ok: code === 0,
        output: sanitize(stdout.trim()),
        error: sanitize(stderr.trim())
      });
    });
  });
}

async function runSupabaseRestProbe() {
  const secretKey = String(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!supabaseUrl || !secretKey) return { ok: false, missingTables: [], error: "SUPABASE_URL and SUPABASE_SECRET_KEY are not configured" };
  const headers = { apikey: secretKey, Authorization: `Bearer ${secretKey}` };
  const checks = await Promise.all(normalizedRepositoryTableIds.map(async (tableId) => {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/${tableId}?select=*&limit=1`, { headers });
      return { tableId, ok: response.ok, status: response.status, error: response.ok ? "" : (await response.text()).slice(0, 240) };
    } catch (error) {
      return { tableId, ok: false, status: 0, error: sanitize(error.message) };
    }
  }));
  const missingTables = checks.filter((check) => check.status === 404).map((check) => check.tableId);
  const errors = checks.filter((check) => !check.ok && check.status !== 404).map((check) => `${check.tableId}: ${check.error}`);
  return { ok: missingTables.length === 0 && errors.length === 0, missingTables, errors };
}

const supabaseUrl = normalizeBaseUrl(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
const projectRef = projectRefFromUrl(supabaseUrl);
const jwksUrl = process.env.SUPABASE_JWKS_URL || (supabaseUrl ? `${supabaseUrl}/auth/v1/.well-known/jwks.json` : "");
const authHealthUrl = supabaseUrl ? `${supabaseUrl}/auth/v1/health` : "";
const databaseUrl = databaseUrlParts(process.env.DATABASE_URL);
const dbHost = process.env.SUPABASE_DB_HOST || databaseUrl.host || (projectRef ? `db.${projectRef}.supabase.co` : "");
const dbPort = Number(process.env.SUPABASE_DB_PORT || databaseUrl.port || 5432);
const repositoryMode = String(process.env.K12_REPOSITORY_MODE || (process.env.DATABASE_URL ? "postgres" : "json")).toLowerCase();

const [projectCheck, jwksCheck, tcpCheck, psqlCheck, restCheck] = await Promise.all([
  checkHttps(authHealthUrl, { clientErrorsReachable: true }),
  checkHttps(jwksUrl),
  checkTcp(dbHost, dbPort),
  repositoryMode === "supabase-rest" ? Promise.resolve({ ok: false, output: "", error: "Skipped because Supabase REST repository mode is selected." }) : runPsql("select current_database() || ':' || current_user;"),
  repositoryMode === "supabase-rest" ? runSupabaseRestProbe() : Promise.resolve({ ok: false, missingTables: [], errors: [], error: "Skipped because Postgres repository mode is selected." })
]);

const psqlError = psqlCheck.error.toLowerCase();
const authenticationFailed = psqlError.includes("password authentication failed") || psqlError.includes("authentication failed");
const next =
  repositoryMode === "supabase-rest" && restCheck.ok
    ? "Supabase PostgREST can reach every normalized repository table. Run the application health probe and keep db:apply/db:verify for migration changes."
    : repositoryMode === "supabase-rest" && restCheck.missingTables?.length
      ? `Supabase PostgREST is reachable, but the normalized migration is incomplete. Apply the migration; missing tables include ${restCheck.missingTables.slice(0, 5).join(", ")}.`
      : bool(process.env.DATABASE_URL) && psqlCheck.ok
    ? "Run npm run db:apply, then npm run db:verify."
    : bool(process.env.DATABASE_URL) && authenticationFailed
      ? "The database host is reachable, but PostgreSQL rejected the password. Reset the Supabase database password, update DATABASE_URL in .env, then rerun npm run supabase:check."
      : bool(process.env.DATABASE_URL) && !tcpCheck.ok
        ? "The database URL is set, but the host/port is not reachable from this network. Use the Supabase Session Pooler URI or enable the IPv4 add-on."
        : "Set DATABASE_URL to postgresql://postgres:<database-password>@<host>:5432/postgres before applying SQL, or select K12_REPOSITORY_MODE=supabase-rest with server-only Supabase credentials.";

const summary = {
  supabaseUrlConfigured: bool(supabaseUrl),
  publishableKeyConfigured: bool(process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
  secretKeyConfigured: bool(process.env.SUPABASE_SECRET_KEY),
  jwksUrlConfigured: bool(jwksUrl),
  projectReachable: projectCheck.ok,
  projectStatusCode: projectCheck.statusCode,
  jwksReachable: jwksCheck.ok,
  jwksStatusCode: jwksCheck.statusCode,
  dbHost,
  dbPort,
  dbPooler: databaseUrl.pooler,
  dbUsernameConfigured: bool(databaseUrl.username),
  dbTcpReachable: tcpCheck.ok,
  databaseUrlConfigured: bool(process.env.DATABASE_URL),
  repositoryMode,
  psqlQuerySucceeded: psqlCheck.ok,
  psqlQueryResult: psqlCheck.ok ? psqlCheck.output : "",
  supabaseRestQuerySucceeded: restCheck.ok,
  supabaseRestMissingTables: restCheck.missingTables || [],
  next
};

console.log(JSON.stringify(summary, null, 2));

if (projectCheck.error) console.error(`projectError=${projectCheck.error}`);
if (jwksCheck.error) console.error(`jwksError=${jwksCheck.error}`);
if (tcpCheck.error && !tcpCheck.ok) console.error(`dbTcpError=${tcpCheck.error}`);
if (psqlCheck.error && bool(process.env.DATABASE_URL) && repositoryMode !== "supabase-rest") console.error(`psqlError=${psqlCheck.error}`);

if (repositoryMode === "supabase-rest" ? !restCheck.ok : bool(process.env.DATABASE_URL) && !psqlCheck.ok) process.exitCode = 1;
