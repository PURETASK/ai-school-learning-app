import { productionRoles } from "./schema.js";

const roleIds = new Set(productionRoles.map((role) => role.id));
const defaultEnv = typeof process !== "undefined" && process.env ? process.env : {};

function boolFromEnv(value, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

function splitCsv(value = "") {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function claimValue(claims = {}, path = "") {
  if (!path) return undefined;
  if (Object.prototype.hasOwnProperty.call(claims, path)) return claims[path];
  return String(path)
    .split(".")
    .filter(Boolean)
    .reduce((current, key) => (current && typeof current === "object" ? current[key] : undefined), claims);
}

function firstClaim(claims = {}, paths = []) {
  for (const path of paths) {
    const value = claimValue(claims, path);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return "";
}

function normalizeRole(role = "") {
  const value = String(role || "").trim();
  return roleIds.has(value) ? value : "";
}

function defaultScope(role) {
  if (role === "platform-admin") return "platform";
  if (role === "school-admin") return "school";
  if (role === "teacher") return "assigned";
  if (role === "parent") return "own-household";
  if (role === "student") return "own";
  return "none";
}

function normalizeBoolean(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  return ["1", "true", "yes", "verified"].includes(String(value || "").toLowerCase());
}

function normalizeAudience(value) {
  if (Array.isArray(value)) return value.map(String);
  if (value === undefined || value === null) return [];
  return [String(value)];
}

function jwtTime(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "";
  return new Date(parsed * 1000).toISOString();
}

function safeEqual(left = "", right = "") {
  const leftText = String(left);
  const rightText = String(right);
  let diff = leftText.length ^ rightText.length;
  const length = Math.max(leftText.length, rightText.length);
  for (let index = 0; index < length; index += 1) {
    diff |= (leftText.charCodeAt(index) || 0) ^ (rightText.charCodeAt(index) || 0);
  }
  return diff === 0;
}

function decodeBase64Url(value = "") {
  const normalized = String(value || "").replaceAll("-", "+").replaceAll("_", "/");
  const padded = `${normalized}${"=".repeat((4 - (normalized.length % 4)) % 4)}`;
  if (typeof Buffer !== "undefined") return Buffer.from(padded, "base64").toString("utf8");
  if (typeof atob === "function") {
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
  throw new Error("Base64url decoding is unavailable in this runtime.");
}

function decodeClaimsHeader(value = "") {
  const raw = String(value || "").trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return JSON.parse(decodeBase64Url(raw));
  }
}

function headerValue(headers = {}, name = "") {
  const target = String(name || "").toLowerCase();
  const direct = headers[target];
  if (direct !== undefined) return direct;
  const matched = Object.entries(headers).find(([key]) => String(key).toLowerCase() === target);
  return matched ? matched[1] : "";
}

function normalizeBaseUrl(value = "") {
  return String(value || "").trim().replace(/\/+$/, "");
}

export function getProductionAuthConfig(env = defaultEnv) {
  const supabaseUrl = normalizeBaseUrl(env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseIssuer = supabaseUrl ? `${supabaseUrl}/auth/v1` : "";
  const supabaseJwksUrl = supabaseUrl ? `${supabaseIssuer}/.well-known/jwks.json` : "";
  const provider = env.AUTH_PROVIDER || (supabaseUrl ? "supabase" : "");

  return {
    provider,
    issuer: env.AUTH_ISSUER || supabaseIssuer,
    audience: env.AUTH_AUDIENCE || (provider === "supabase" ? "authenticated" : ""),
    jwksUrl: env.AUTH_JWKS_URL || env.SUPABASE_JWKS_URL || supabaseJwksUrl,
    supabaseUrl,
    roleClaim: env.AUTH_ROLE_CLAIM || "app_metadata.role",
    scopeClaim: env.AUTH_SCOPE_CLAIM || "app_metadata.scope",
    userIdClaim: env.AUTH_USER_ID_CLAIM || "app_metadata.userId",
    studentIdClaim: env.AUTH_STUDENT_ID_CLAIM || "app_metadata.studentId",
    guardianIdClaim: env.AUTH_GUARDIAN_ID_CLAIM || "app_metadata.guardianId",
    teacherIdClaim: env.AUTH_TEACHER_ID_CLAIM || "app_metadata.teacherId",
    schoolIdClaim: env.AUTH_SCHOOL_ID_CLAIM || "app_metadata.schoolId",
    emailClaim: env.AUTH_EMAIL_CLAIM || "email",
    emailVerifiedClaim: env.AUTH_EMAIL_VERIFIED_CLAIM || "email_verified",
    requireEmailVerified: env.AUTH_REQUIRE_EMAIL_VERIFIED === "false" ? false : true,
    trustedProxy: boolFromEnv(env.AUTH_TRUSTED_PROXY),
    trustedClaimsHeader: String(env.AUTH_VERIFIED_CLAIMS_HEADER || "x-k12-verified-claims").toLowerCase(),
    trustedProxySecretHeader: String(env.AUTH_PROXY_SECRET_HEADER || "x-k12-auth-proxy-secret").toLowerCase(),
    trustedProxySecret: env.AUTH_PROXY_SHARED_SECRET || ""
  };
}

export function isProductionAuthProviderConfigured(env = defaultEnv) {
  return Boolean(getProductionAuthConfig(env).provider);
}

export function getProductionAuthReadiness(env = defaultEnv) {
  const config = getProductionAuthConfig(env);
  const missing = [];
  const warnings = [];

  if (!config.provider) missing.push("AUTH_PROVIDER");
  if (!config.issuer) missing.push("AUTH_ISSUER");
  if (!config.audience) missing.push("AUTH_AUDIENCE");
  if (!config.jwksUrl && !config.trustedProxy) missing.push("AUTH_JWKS_URL or AUTH_TRUSTED_PROXY=true");
  if (config.trustedProxy && !config.trustedProxySecret) missing.push("AUTH_PROXY_SHARED_SECRET");
  if (env.ALLOW_LOCAL_SESSION_TOKENS_IN_PRODUCTION === "true") warnings.push("Local signed session tokens are allowed in production.");
  if (config.requireEmailVerified === false) warnings.push("Email verification is not required by AUTH_REQUIRE_EMAIL_VERIFIED=false.");

  return {
    passed: missing.length === 0 && warnings.length === 0,
    configured: Boolean(config.provider),
    provider: config.provider || "not-configured",
    issuer: config.issuer,
    audience: config.audience,
    jwksUrlConfigured: Boolean(config.jwksUrl),
    supabaseConfigured: config.provider === "supabase" && Boolean(config.supabaseUrl),
    trustedProxy: config.trustedProxy,
    trustedClaimsHeader: config.trustedClaimsHeader,
    requiredLifecycleTables: [
      "account_invitations",
      "guardian_student_links",
      "teacher_class_assignments",
      "session_revocations",
      "auth_audit_events"
    ],
    missing,
    warnings
  };
}

export function createProductionSessionFromVerifiedClaims(claims = {}, env = defaultEnv) {
  const config = getProductionAuthConfig(env);
  const issuer = String(firstClaim(claims, ["iss"]) || "");
  const audiences = normalizeAudience(firstClaim(claims, ["aud"]));
  const email = String(firstClaim(claims, [config.emailClaim, "email"]) || "").trim().toLowerCase();
  const emailVerified = normalizeBoolean(firstClaim(claims, [config.emailVerifiedClaim, "email_verified"]));
  const subject = String(firstClaim(claims, ["sub", "provider_subject"]) || "");
  const role = normalizeRole(firstClaim(claims, [config.roleClaim, "https://k12learning.app/role", "app_metadata.role", "role"]));
  const nowSeconds = Math.floor(Date.now() / 1000);
  const rawExp = firstClaim(claims, ["exp"]);
  const exp = rawExp === "" ? null : Number(rawExp);

  if (config.issuer && issuer && issuer !== config.issuer) {
    return { accepted: false, reason: "Auth issuer does not match configured AUTH_ISSUER." };
  }
  if (config.audience && audiences.length && !audiences.includes(config.audience)) {
    return { accepted: false, reason: "Auth audience does not match configured AUTH_AUDIENCE." };
  }
  if (Number.isFinite(exp) && exp <= nowSeconds) {
    return { accepted: false, reason: "Auth token is expired." };
  }
  if (!email) {
    return { accepted: false, reason: "Verified auth claims must include an email." };
  }
  if (config.requireEmailVerified && !emailVerified) {
    return { accepted: false, reason: "Email verification is required before app access." };
  }
  if (!role) {
    return { accepted: false, reason: "Verified auth claims must include a supported app role." };
  }

  const userId = String(firstClaim(claims, [config.userIdClaim, "https://k12learning.app/user_id", "userId"]) || subject || email);
  if (!userId) {
    return { accepted: false, reason: "Verified auth claims must resolve to an app user id." };
  }

  const session = {
    authenticated: true,
    devFallback: false,
    productionAuth: true,
    authProvider: config.provider || "oidc",
    providerSubject: subject,
    sessionId: String(firstClaim(claims, ["sid", "jti", "session_id"]) || ""),
    role,
    scope: String(firstClaim(claims, [config.scopeClaim, "https://k12learning.app/scope", "scope"]) || defaultScope(role)),
    userId,
    email,
    emailVerified,
    studentId: String(firstClaim(claims, [config.studentIdClaim, "https://k12learning.app/student_id", "studentId"]) || ""),
    guardianId: String(firstClaim(claims, [config.guardianIdClaim, "https://k12learning.app/guardian_id", "guardianId"]) || ""),
    teacherId: String(firstClaim(claims, [config.teacherIdClaim, "https://k12learning.app/teacher_id", "teacherId"]) || ""),
    schoolId: String(firstClaim(claims, [config.schoolIdClaim, "https://k12learning.app/school_id", "schoolId"]) || ""),
    issuedAt: jwtTime(firstClaim(claims, ["iat"])) || new Date().toISOString(),
    expiresAt: jwtTime(firstClaim(claims, ["exp"]))
  };

  return { accepted: true, session };
}

export function createTrustedProxySession(headers = {}, env = defaultEnv) {
  const config = getProductionAuthConfig(env);
  if (!config.trustedProxy) return { accepted: false, skipped: true, terminal: false, reason: "Trusted auth proxy is not enabled." };
  if (!config.trustedProxySecret) {
    return { accepted: false, terminal: true, reason: "AUTH_PROXY_SHARED_SECRET is required when AUTH_TRUSTED_PROXY=true." };
  }

  const providedSecret = headerValue(headers, config.trustedProxySecretHeader);
  if (!safeEqual(providedSecret, config.trustedProxySecret)) {
    return { accepted: false, terminal: true, reason: "Trusted auth proxy secret did not match." };
  }

  try {
    const claims = decodeClaimsHeader(headerValue(headers, config.trustedClaimsHeader));
    const result = createProductionSessionFromVerifiedClaims(claims, env);
    return result.accepted ? result : { ...result, terminal: true };
  } catch {
    return { accepted: false, terminal: true, reason: "Trusted auth proxy claims header could not be parsed." };
  }
}
