-- Run this in the Supabase SQL editor.
-- The existing "allow_public_select" policy only grants SELECT to the
-- anon role. insertBooking() does .insert().select().single(), which
-- requires the inserting role to also be able to SELECT the new row back
-- (Supabase/PostgREST does this to return the inserted row). Logged-in
-- (authenticated) bookings were failing with "new row violates row-level
-- security policy" because of this gap.

drop policy if exists "allow_public_select" on public.service_requests;
create policy "allow_public_select" on public.service_requests
  for select to anon, authenticated using (true);

notify pgrst, 'reload schema';
