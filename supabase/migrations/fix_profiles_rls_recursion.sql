-- Run this in the Supabase SQL editor (Project -> SQL Editor -> New query).
-- Fixes "infinite recursion detected in policy for relation 'profiles'" (Postgres
-- error 42P17), which is why /admin/login always shows "Access denied" — the
-- policy below queries `profiles` from within a policy ON `profiles`, so
-- Postgres recurses into itself evaluating the policy and the SELECT errors
-- out entirely (regardless of the user's actual role).
--
-- Fix: move the admin check into a SECURITY DEFINER function, which runs with
-- elevated privileges and bypasses RLS internally, breaking the recursion.
-- Safe to re-run.

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

drop policy if exists "admin select all profiles" on public.profiles;
create policy "admin select all profiles" on public.profiles
  for select to authenticated using (public.is_admin());

-- Force PostgREST to pick up the new function/policy immediately.
notify pgrst, 'reload schema';
