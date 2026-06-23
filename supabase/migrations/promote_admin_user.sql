-- Run this in the Supabase SQL editor (Project -> SQL Editor -> New query).
-- One-time promotion of an existing account to admin so it can sign in at
-- /admin/login and pass the `profiles.role = 'admin'` check in AdminRoute.
-- Safe to re-run.

update public.profiles
set role = 'admin'
where email = 'naziaasif1412@gmail.com';

-- If the row above updates 0 rows, the user signed up before the
-- `handle_new_user` trigger existed and has no `profiles` row yet — back-fill
-- it from auth.users instead:
insert into public.profiles (id, email, role)
select id, email, 'admin'
from auth.users
where email = 'naziaasif1412@gmail.com'
on conflict (id) do update set role = 'admin';
