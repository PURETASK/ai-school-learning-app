import { createHmac, createPublicKey, createVerify, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { createProductionSessionFromVerifiedClaims, createTrustedProxySession, getProductionAuthConfig, isProductionAuthProviderConfigured } from "./productionAuth.js";
import { productionRoles } from "./schema.js";

const roleIds = new Set(productionRoles.map((role) => role.id));
const jwksCache = new Map();

function base64UrlEncode(value) {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(payload, secret) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function normalizeRole(role) {
  const value = String(role || "").trim();
  return roleIds.has(value) ? value : "student";
}

function normalizeScope(scope, role) {
  if (scope) return String(scope);
  if (role === "platform-admin") return "platform";
  if (role === "school-admin") return "school";
  if (role === "teacher") return "assigned";
  if (role === "parent") return "own-household";
  return "own";
}

function sessionTtlMs(env = process.env) {
  const parsed = Number(env.AUTH_SESSION_TTL_SECONDS || 60 * 60 * 12);
  const seconds = Number.isFinite(parsed) && parsed > 0 ? parsed : 60 * 60 * 12;
  return Math.min(Math.max(seconds, 5 * 60), 60 * 60 * 24 * 30) * 1000;
}

export function getSessionSecret(env = process.env) {
  const runtimeMode = String(env.APP_ENV || env.NODE_ENV || "").trim().toLowerCase();
  const isProduction = runtimeMode === "production" || runtimeMode === "prod";
  return env.AUTH_SESSION_SECRET || (!isProduction ? "local-dev-session-secret" : "");
}

function defaultSession(env = process.env) {
  const role = normalizeRole(env.K12_DEFAULT_ROLE || "platform-admin");
  return {
    authenticated: true,
    devFallback: true,
    role,
    scope: normalizeScope(env.K12_DEFAULT_SCOPE, role),
    userId: env.K12_DEFAULT_USER_ID || `user-${role}`,
    studentId: env.K12_DEFAULT_STUDENT_ID || "avery",
    guardianId: env.K12_DEFAULT_GUARDIAN_ID || "guardian-parent-1",
    teacherId: env.K12_DEFAULT_TEACHER_ID || "teacher-demo-1",
    schoolId: env.K12_DEFAULT_SCHOOL_ID || "school-demo-1"
  };
}

export function createSessionToken(claims, secret, options = {}) {
  if (!secret) throw new Error("AUTH_SESSION_SECRET is required to sign session tokens.");
  const role = normalizeRole(claims.role);
  const issuedAt = claims.issuedAt || new Date().toISOString();
  const issuedAtMs = Date.parse(issuedAt);
  const expiresAt =
    claims.expiresAt ||
    options.expiresAt ||
    new Date((Number.isFinite(issuedAtMs) ? issuedAtMs : Date.now()) + sessionTtlMs(options.env)).toISOString();
  const normalized = {
    ...claims,
    role,
    scope: normalizeScope(claims.scope, role),
    issuedAt,
    expiresAt
  };
  const payload = base64UrlEncode(JSON.stringify(normalized));
  return `${payload}.${signPayload(payload, secret)}`;
}

export function verifySessionToken(token, secret, options = {}) {
  if (!token || !secret) return null;
  const [payload, signature] = String(token).split(".");
  if (!payload || !signature) return null;
  const expected = signPayload(payload, secret);
  if (!safeEqual(signature, expected)) return null;

  try {
    const claims = JSON.parse(base64UrlDecode(payload));
    if (claims.expiresAt) {
      const expiresAt = Date.parse(claims.expiresAt);
      const now = options.now instanceof Date ? options.now.getTime() : Number(options.now || Date.now());
      if (!Number.isFinite(expiresAt) || expiresAt <= now) return null;
    }
    const role = normalizeRole(claims.role);
    return {
      authenticated: true,
      devFallback: false,
      ...claims,
      role,
      scope: normalizeScope(claims.scope, role)
    };
  } catch {
    return null;
  }
}

function getHeader(request, name) {
  return request.headers?.[name.toLowerCase()] || "";
}

function getBearerToken(request) {
  const authorization = getHeader(request, "authorization");
  if (!authorization.toLowerCase().startsWith("bearer ")) return "";
  return authorization.slice(7).trim();
}

function devHeaderSession(request) {
  const role = normalizeRole(getHeader(request, "x-k12-role"));
  return {
    authenticated: true,
    devFallback: false,
    role,
    scope: normalizeScope(getHeader(request, "x-k12-scope"), role),
    userId: getHeader(request, "x-k12-user-id") || `user-${role}`,
    studentId: getHeader(request, "x-k12-student-id") || "avery",
    guardianId: getHeader(request, "x-k12-guardian-id") || "guardian-parent-1",
    teacherId: getHeader(request, "x-k12-teacher-id") || "teacher-demo-1",
    schoolId: getHeader(request, "x-k12-school-id") || "school-demo-1"
  };
}

export function getRequestSession(request, env = process.env) {
  const trustedProxySession = createTrustedProxySession(request.headers || {}, env);
  if (trustedProxySession.accepted) return trustedProxySession.session;
  if (trustedProxySession.terminal) {
    return {
      authenticated: false,
      devFallback: false,
      role: "anonymous",
      scope: "none",
      authError: trustedProxySession.reason
    };
  }

  const token = getHeader(request, "x-k12-session") || getBearerToken(request);
  const productionProviderConfigured = env.NODE_ENV === "production" && isProductionAuthProviderConfigured(env);
  const localTokenAllowed = !productionProviderConfigured || env.ALLOW_LOCAL_SESSION_TOKENS_IN_PRODUCTION === "true";
  if (localTokenAllowed) {
    const verified = verifySessionToken(token, getSessionSecret(env));
    if (verified) return verified;
  }

  if (env.ALLOW_DEV_AUTH_HEADERS === "true" && getHeader(request, "x-k12-role")) {
    return devHeaderSession(request);
  }

  if (env.NODE_ENV !== "production") {
    return defaultSession(env);
  }

  return {
    authenticated: false,
    devFallback: false,
    role: "anonymous",
    scope: "none"
  };
}

function decodeJwtPart(value = "") {
  const normalized = String(value || "").replaceAll("-", "+").replaceAll("_", "/");
  const padded = `${normalized}${"=".repeat((4 - (normalized.length % 4)) % 4)}`;
  return Buffer.from(padded, "base64");
}

function decodeJwtJson(value = "") {
  return JSON.parse(decodeJwtPart(value).toString("utf8"));
}

function derLength(length) {
  if (length < 128) return Buffer.from([length]);
  const bytes = [];
  let remaining = length;
  while (remaining) {
    bytes.unshift(remaining & 0xff);
    remaining >>= 8;
  }
  return Buffer.from([0x80 | bytes.length, ...bytes]);
}

function rawEcdsaSignatureToDer(signature) {
  const raw = Buffer.from(signature);
  if (raw.length % 2 !== 0) throw new Error("Invalid ECDSA JWT signature length.");
  const half = raw.length / 2;
  const integer = (value) => {
    let normalized = Buffer.from(value);
    while (normalized.length > 1 && normalized[0] === 0) normalized = normalized.subarray(1);
    if (normalized[0] & 0x80) normalized = Buffer.concat([Buffer.from([0]), normalized]);
    return Buffer.concat([Buffer.from([0x02]), derLength(normalized.length), normalized]);
  };
  const body = Buffer.concat([integer(raw.subarray(0, half)), integer(raw.subarray(half))]);
  return Buffer.concat([Buffer.from([0x30]), derLength(body.length), body]);
}

async function fetchJwks(jwksUrl, fetchImpl = fetch) {
  const cached = jwksCache.get(jwksUrl);
  if (cached && cached.expiresAt > Date.now()) return cached.keys;
  const response = await fetchImpl(jwksUrl, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Auth JWKS request failed with ${response.status}.`);
  const payload = await response.json();
  const keys = Array.isArray(payload.keys) ? payload.keys : [];
  if (!keys.length) throw new Error("Auth JWKS response did not contain signing keys.");
  jwksCache.set(jwksUrl, { keys, expiresAt: Date.now() + 5 * 60 * 1000 });
  return keys;
}

function verifyJwtSignature(token, header, jwk) {
  const [encodedHeader, encodedPayload, encodedSignature] = String(token).split(".");
  if (!encodedHeader || !encodedPayload || !encodedSignature || !jwk) return false;
  const algorithm = String(header.alg || "");
  const verifyAlgorithm = algorithm === "RS256" ? "RSA-SHA256" : algorithm === "RS384" ? "RSA-SHA384" : algorithm === "RS512" ? "RSA-SHA512" : algorithm === "ES256" ? "sha256" : algorithm === "ES384" ? "sha384" : algorithm === "ES512" ? "sha512" : "";
  if (!verifyAlgorithm || algorithm === "none") return false;
  const signature = decodeJwtPart(encodedSignature);
  const normalizedSignature = algorithm.startsWith("ES") ? rawEcdsaSignatureToDer(signature) : signature;
  const verifier = createVerify(verifyAlgorithm);
  verifier.update(`${encodedHeader}.${encodedPayload}`);
  verifier.end();
  return verifier.verify(createPublicKey({ key: jwk, format: "jwk" }), normalizedSignature);
}

export async function getRequestSessionAsync(request, env = process.env, { fetchImpl = fetch } = {}) {
  const trustedProxySession = createTrustedProxySession(request.headers || {}, env);
  if (trustedProxySession.accepted) return trustedProxySession.session;
  if (trustedProxySession.terminal) return { authenticated: false, devFallback: false, role: "anonymous", scope: "none", authError: trustedProxySession.reason };

  const token = getHeader(request, "x-k12-session") || getBearerToken(request);
  const productionProviderConfigured = env.NODE_ENV === "production" && isProductionAuthProviderConfigured(env);
  if (productionProviderConfigured && token) {
    const config = getProductionAuthConfig(env);
    try {
      const parts = String(token).split(".");
      if (parts.length !== 3) throw new Error("Auth bearer token is not a JWT.");
      const header = decodeJwtJson(parts[0]);
      const claims = decodeJwtJson(parts[1]);
      const keys = await fetchJwks(config.jwksUrl, fetchImpl);
      const jwk = keys.find((key) => !header.kid || key.kid === header.kid);
      if (!verifyJwtSignature(token, header, jwk)) throw new Error("Auth bearer token signature is invalid.");
      const verified = createProductionSessionFromVerifiedClaims(claims, env);
      if (verified.accepted) return verified.session;
      return { authenticated: false, devFallback: false, role: "anonymous", scope: "none", authError: verified.reason };
    } catch (error) {
      return { authenticated: false, devFallback: false, role: "anonymous", scope: "none", authError: error.message || "Provider token verification failed." };
    }
  }

  return getRequestSession(request, env);
}

export function createPasswordRecord(password, salt = randomBytes(16).toString("base64url")) {
  const normalized = String(password || "");
  if (normalized.length < 8) {
    const error = new Error("Password must be at least 8 characters.");
    error.status = 400;
    throw error;
  }
  return {
    passwordSalt: salt,
    passwordHash: scryptSync(normalized, salt, 32).toString("base64url"),
    passwordAlgorithm: "scrypt-sha256"
  };
}

export function hashActionToken(token, salt) {
  return createHmac("sha256", String(salt || "")).update(String(token || "")).digest("base64url");
}

export function createActionTokenRecord(prefix = "auth") {
  const token = `${prefix}-${randomBytes(18).toString("base64url")}`;
  const tokenSalt = randomBytes(16).toString("base64url");
  return {
    token,
    tokenSalt,
    tokenHash: hashActionToken(token, tokenSalt),
    tokenAlgorithm: "hmac-sha256",
    tokenPreview: `${token.slice(0, 12)}...${token.slice(-6)}`
  };
}

export function verifyPassword(password, account = {}) {
  if (!account.passwordSalt || !account.passwordHash) return false;
  try {
    const candidate = createPasswordRecord(password, account.passwordSalt).passwordHash;
    return safeEqual(candidate, account.passwordHash);
  } catch {
    return false;
  }
}

export function requireAuthenticated(session) {
  if (!session?.authenticated) {
    const error = new Error("Authentication is required for this API route.");
    error.status = 401;
    throw error;
  }
}

export function requireRole(session, allowedRoles) {
  requireAuthenticated(session);
  if (!allowedRoles.includes(session.role)) {
    const error = new Error(`Role ${session.role} is not allowed for this action.`);
    error.status = 403;
    throw error;
  }
}

export function publicSessionSummary(session) {
  return {
    authenticated: Boolean(session?.authenticated),
    devFallback: Boolean(session?.devFallback),
    productionAuth: Boolean(session?.productionAuth),
    authProvider: session?.authProvider || "",
    role: session?.role || "anonymous",
    scope: session?.scope || "none",
    userId: session?.userId || "",
    accountId: session?.accountId || "",
    displayName: session?.displayName || "",
    email: session?.email || "",
    emailVerified: Boolean(session?.emailVerified),
    studentId: session?.studentId || "",
    guardianId: session?.guardianId || "",
    teacherId: session?.teacherId || "",
    schoolId: session?.schoolId || "",
    sessionId: session?.sessionId || "",
    issuedAt: session?.issuedAt || "",
    expiresAt: session?.expiresAt || "",
    authError: session?.authError || ""
  };
}
