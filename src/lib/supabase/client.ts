"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

let cachedClient: SupabaseClient<Database> | null = null;

export function getSupabaseEnv(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function isSupabasePersistenceEnabled(): boolean {
  return process.env.NEXT_PUBLIC_PERSISTENCE_MODE === "supabase" && getSupabaseEnv() !== null;
}

export function getSupabaseClient(): SupabaseClient<Database> {
  if (cachedClient) return cachedClient;
  const env = getSupabaseEnv();
  if (!env) {
    throw new Error(
      "Supabase persistence requested but NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set."
    );
  }
  cachedClient = createClient<Database>(env.url, env.anonKey, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return cachedClient;
}

/**
 * Returns the signed-in user's id. Accounts are required (AuthGate enforces
 * sign-in before the learning app renders), so this throws if no session exists.
 */
export async function ensureSupabaseSession(): Promise<string> {
  const supabase = getSupabaseClient();
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user?.id;
  if (!userId) {
    throw new Error("Not signed in. Please sign in to load your learning data.");
  }
  return userId;
}
