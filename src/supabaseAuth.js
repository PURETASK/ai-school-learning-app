const defaultFetch = typeof fetch === "function" ? fetch : null;

function trimTrailingSlash(value = "") {
  return String(value || "").trim().replace(/\/+$/, "");
}

function authConfig(env = process.env) {
  const url = trimTrailingSlash(env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL);
  const publishableKey = String(
    env.SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY || ""
  ).trim();
  return { url, publishableKey };
}

function providerError(payload = {}, fallback = "Supabase Auth request failed.") {
  const error = new Error(String(payload.msg || payload.error_description || payload.message || payload.error || fallback));
  error.status = Number(payload.status || payload.code) || 400;
  error.provider = "supabase";
  return error;
}

async function requestAuth(path, { method = "POST", body, accessToken = "", env = process.env, fetchImpl = defaultFetch } = {}) {
  const { url, publishableKey } = authConfig(env);
  if (!url || !publishableKey) {
    const error = new Error("Supabase Auth requires SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.");
    error.status = 503;
    throw error;
  }
  if (typeof fetchImpl !== "function") throw new Error("Fetch API is unavailable for Supabase Auth.");

  const response = await fetchImpl(`${url}/auth/v1${path}`, {
    method,
    headers: {
      apikey: publishableKey,
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw providerError({ ...payload, status: response.status });
  return payload;
}

async function requestAdmin(path, { method = "PUT", body, env = process.env, fetchImpl = defaultFetch } = {}) {
  const { url } = authConfig(env);
  const secretKey = String(env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!url || !secretKey) {
    const error = new Error("Supabase admin Auth operations require SUPABASE_URL and SUPABASE_SECRET_KEY.");
    error.status = 503;
    throw error;
  }
  const response = await fetchImpl(`${url}/auth/v1${path}`, {
    method,
    headers: { apikey: secretKey, Authorization: `Bearer ${secretKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body || {})
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw providerError({ ...payload, status: response.status });
  return payload;
}

export function isSupabaseAuthConfigured(env = process.env) {
  const { url, publishableKey } = authConfig(env);
  return Boolean(url && publishableKey);
}

export async function supabaseSignUp({ email, password, role = "parent", displayName = "", redirectTo = "", env = process.env, fetchImpl = defaultFetch } = {}) {
  return requestAuth("/signup", {
    env,
    fetchImpl,
    body: {
      email: String(email || "").trim().toLowerCase(),
      password: String(password || ""),
      options: {
        ...(redirectTo ? { emailRedirectTo: redirectTo } : {}),
        // This is profile metadata only. Authorization is resolved from app_metadata/database claims.
        data: { display_name: String(displayName || "").trim(), requested_role: String(role || "parent") }
      }
    }
  });
}

export async function supabaseSignIn({ email, password, env = process.env, fetchImpl = defaultFetch } = {}) {
  return requestAuth("/token?grant_type=password", {
    env,
    fetchImpl,
    body: { email: String(email || "").trim().toLowerCase(), password: String(password || "") }
  });
}

export async function supabaseRefreshSession({ refreshToken, env = process.env, fetchImpl = defaultFetch } = {}) {
  return requestAuth("/token?grant_type=refresh_token", {
    env,
    fetchImpl,
    body: { refresh_token: String(refreshToken || "") }
  });
}

export async function supabaseSetAppMetadata(userId, appMetadata, { env = process.env, fetchImpl = defaultFetch } = {}) {
  return requestAdmin(`/admin/users/${encodeURIComponent(userId)}`, { env, fetchImpl, body: { app_metadata: appMetadata || {} } });
}

export async function supabaseAdminCreateUser(
  { email, password, emailConfirm = true, userMetadata = {}, appMetadata = {}, env = process.env, fetchImpl = defaultFetch } = {}
) {
  return requestAdmin("/admin/users", {
    method: "POST",
    env,
    fetchImpl,
    body: {
      email: String(email || "").trim().toLowerCase(),
      password: String(password || ""),
      email_confirm: Boolean(emailConfirm),
      user_metadata: userMetadata || {},
      app_metadata: appMetadata || {}
    }
  });
}

export async function supabaseAdminDeleteUser(userId, { env = process.env, fetchImpl = defaultFetch } = {}) {
  return requestAdmin(`/admin/users/${encodeURIComponent(userId)}`, { method: "DELETE", env, fetchImpl });
}

export async function supabaseGetUser(accessToken, { env = process.env, fetchImpl = defaultFetch } = {}) {
  return requestAuth("/user", { method: "GET", accessToken, env, fetchImpl });
}

export async function supabaseVerifyEmail({ tokenHash, type = "signup", env = process.env, fetchImpl = defaultFetch } = {}) {
  return requestAuth("/verify", { env, fetchImpl, body: { type, token_hash: String(tokenHash || "") } });
}

export async function supabaseResendVerification({ email, type = "signup", redirectTo = "", env = process.env, fetchImpl = defaultFetch } = {}) {
  return requestAuth("/resend", {
    env,
    fetchImpl,
    body: { type, email: String(email || "").trim().toLowerCase(), ...(redirectTo ? { options: { emailRedirectTo: redirectTo } } : {}) }
  });
}

export async function supabaseRequestPasswordReset({ email, redirectTo = "", env = process.env, fetchImpl = defaultFetch } = {}) {
  return requestAuth("/recover", {
    env,
    fetchImpl,
    body: { email: String(email || "").trim().toLowerCase(), ...(redirectTo ? { redirect_to: redirectTo } : {}) }
  });
}

export async function supabaseUpdatePassword({ accessToken, password, env = process.env, fetchImpl = defaultFetch } = {}) {
  return requestAuth("/user", { method: "PUT", accessToken, env, fetchImpl, body: { password: String(password || "") } });
}

export async function supabaseSignOut({ accessToken, env = process.env, fetchImpl = defaultFetch } = {}) {
  return requestAuth("/logout", { accessToken, env, fetchImpl });
}

export function normalizeSupabaseAuthResponse(payload = {}) {
  const user = payload.user || {};
  return {
    accessToken: String(payload.access_token || ""),
    refreshToken: String(payload.refresh_token || ""),
    expiresIn: Number(payload.expires_in || 0),
    user: {
      id: String(user.id || ""),
      email: String(user.email || "").trim().toLowerCase(),
      emailVerified: Boolean(user.email_confirmed_at || user.confirmed_at),
      createdAt: user.created_at || "",
      userMetadata: user.user_metadata || {},
      appMetadata: user.app_metadata || {}
    }
  };
}
