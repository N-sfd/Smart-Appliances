-- Run this in the Supabase SQL editor.
-- Adds admin-only DELETE for service_requests so the new "Delete Request"
-- action in /admin/bookings can't be exercised by non-admins even if the
-- anon key leaks. Re-declares the existing insert/select/update policies at
-- the same time so enabling RLS here can't silently break booking
-- submission (insertBooking), the tracking page, or admin status/cancel
-- updates — all of which currently run under the anon/authenticated roles.
-- Reuses public.is_admin() from fix_profiles_rls_recursion.sql. Safe to re-run.

alter table public.service_requests enable row level security;

drop policy if exists "allow_public_insert" on public.service_requests;
create policy "allow_public_insert" on public.service_requests
  for insert to anon, authenticated with check (true);

drop policy if exists "allow_public_select" on public.service_requests;
create policy "allow_public_select" on public.service_requests
  for select to anon, authenticated using (true);

-- Broad update stays available to anon/authenticated because updateEmailSent()
-- runs immediately after a public, often-unauthenticated booking submission.
-- Admin-only write enforcement for status/cancel is handled at the app layer
-- (AdminRoute + admin login); this policy only prevents public DELETE.
drop policy if exists "allow_public_update" on public.service_requests;
create policy "allow_public_update" on public.service_requests
  for update to anon, authenticated using (true) with check (true);

drop policy if exists "admin delete service_requests" on public.service_requests;
create policy "admin delete service_requests" on public.service_requests
  for delete to authenticated using (public.is_admin());

notify pgrst, 'reload schema';
