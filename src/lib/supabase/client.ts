"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

export function getSupabaseEnv(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function isSupabasePersistenceEnabled(): boolean {
  return process.env.NEXT_PUBLIC_PERSISTENCE_MODE === "supabase" && getSupabaseEnv() !== null;
}

export function getSupabaseClient(): SupabaseClient {
  if (cachedClient) return cachedClient;
  const env = getSupabaseEnv();
  if (!env) {
    throw new Error(
      "Supabase persistence requested but NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set."
    );
  }
  cachedClient = createClient(env.url, env.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
  return cachedClient;
}

/**
 * Ensures the browser has an authenticated Supabase session.
 * MVP strategy (docs/82 Phase 2): anonymous sign-in gives every browser a
 * stable auth.uid() so Row Level Security works before a full login UI exists.
 * Replace with email/password or OAuth sign-in when the auth UI ships.
 */
export async function ensureSupabaseSession(): Promise<string> {
  const supabase = getSupabaseClient();
  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData.session?.user?.id) return sessionData.session.user.id;
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error || !data.user) {
    throw new Error(`Unable to start Supabase session: ${error?.message ?? "unknown error"}`);
  }
  return data.user.id;
}
