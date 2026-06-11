-- Harden v8 helper functions per Supabase security advisors
alter function public.touch_updated_at() set search_path = public;

-- Trigger-only functions should not be callable via the public API
revoke execute on function public.handle_new_user() from anon, authenticated;
revoke execute on function public.touch_updated_at() from anon, authenticated;
