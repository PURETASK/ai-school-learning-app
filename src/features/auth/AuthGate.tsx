"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseClient, isSupabasePersistenceEnabled } from "@/lib/supabase/client";

type AuthMode = "sign-in" | "sign-up";

type AuthGateProps = {
  children: ReactNode;
};

/**
 * AuthGate (docs/82 Phase 2 — Auth and User Scope).
 * In Supabase mode: requires a signed-in guardian account before rendering
 * the learning app. Shows a sign-in / create-account form otherwise.
 * In local-storage mode: renders children directly (demo behavior unchanged).
 */
export function AuthGate({ children }: AuthGateProps) {
  const supabaseMode = isSupabasePersistenceEnabled();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(supabaseMode);
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!supabaseMode) return;
    const supabase = getSupabaseClient();
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => listener.subscription.unsubscribe();
  }, [supabaseMode]);

  const handleSubmit = useCallback(
    async (event: { preventDefault: () => void }) => {
      event.preventDefault();
      setFormError(null);
      setNotice(null);

      if (!email.trim() || !password) {
        setFormError("Please enter an email and password.");
        return;
      }
      if (password.length < 8) {
        setFormError("Password must be at least 8 characters.");
        return;
      }

      setIsSubmitting(true);
      const supabase = getSupabaseClient();
      try {
        if (mode === "sign-up") {
          const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: { data: { display_name: displayName.trim() || undefined } },
          });
          if (error) {
            setFormError(error.message);
            return;
          }
          if (!data.session) {
            setNotice("Account created. Check your email for a confirmation link, then sign in.");
            setMode("sign-in");
            return;
          }
          if (data.user && displayName.trim()) {
            await supabase
              .from("profiles")
              .update({ display_name: displayName.trim() })
              .eq("id", data.user.id);
          }
        } else {
          const { error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });
          if (error) {
            setFormError(error.message);
            return;
          }
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [displayName, email, mode, password]
  );

  const handleSignOut = useCallback(async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
  }, []);

  if (!supabaseMode) return <>{children}</>;

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Loading your account…</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">
            {mode === "sign-in" ? "Sign in to A.I. School" : "Create your guardian account"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {mode === "sign-in"
              ? "Welcome back. Your student's progress is saved to your account."
              : "One account per parent/guardian. You can add students after signing in."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "sign-up" ? (
              <div>
                <label htmlFor="auth-display-name" className="block text-sm font-medium text-slate-700">
                  Your name (optional)
                </label>
                <input
                  id="auth-display-name"
                  type="text"
                  autoComplete="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            ) : null}
            <div>
              <label htmlFor="auth-email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="auth-password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
            {notice ? <p className="text-sm text-green-700">{notice}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Please wait…" : mode === "sign-in" ? "Sign in" : "Create account"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(mode === "sign-in" ? "sign-up" : "sign-in");
              setFormError(null);
              setNotice(null);
            }}
            className="mt-4 w-full text-center text-sm text-blue-600 hover:underline"
          >
            {mode === "sign-in" ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        </div>
      </main>
    );
  }

  return (
    <div>
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2">
        <span className="text-xs text-slate-500">
          Signed in as <span className="font-medium text-slate-700">{session.user.email}</span>
        </span>
        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          Sign out
        </button>
      </header>
      {children}
    </div>
  );
}
