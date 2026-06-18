-- Run this in the Supabase SQL editor (Project -> SQL Editor -> New query).
-- Your project only has `service_requests` today — `profiles` never existed,
-- which is why signup data was never actually being saved anywhere. This
-- script creates `profiles` + `customers`, links them to `service_requests`,
-- and uses a trigger on auth.users (not a client-side upsert) to populate
-- `profiles`/`customers` on signup — required because this project has
-- email confirmation enabled, so the client isn't authenticated yet at the
-- moment signUp() returns, and a client-side insert would be blocked by RLS.
-- Safe to re-run: every step is guarded with IF NOT EXISTS / OR REPLACE.

-- ── profiles ────────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "select own profile" on public.profiles;
create policy "select own profile" on public.profiles
  for select to authenticated using (auth.uid() = id);

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id);

drop policy if exists "admin select all profiles" on public.profiles;
create policy "admin select all profiles" on public.profiles
  for select to authenticated using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ── customers ───────────────────────────────────────────────────────────────

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  email text not null unique,
  full_name text,
  phone text,
  zip_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customers_profile_id_idx on public.customers(profile_id);
create index if not exists customers_email_idx on public.customers(email);

alter table public.customers enable row level security;

drop policy if exists "anon insert customers" on public.customers;
create policy "anon insert customers" on public.customers
  for insert to anon, authenticated with check (true);

drop policy if exists "anon select customers" on public.customers;
create policy "anon select customers" on public.customers
  for select to anon, authenticated using (true);

drop policy if exists "admin update customers" on public.customers;
create policy "admin update customers" on public.customers
  for update to authenticated using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ── auto-create profile + customer on signup ──────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user')
  on conflict (id) do nothing;

  insert into public.customers (email, full_name, profile_id)
  values (lower(new.email), new.raw_user_meta_data->>'full_name', new.id)
  on conflict (email) do update set profile_id = excluded.profile_id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── link service_requests to profiles/customers ───────────────────────────────

alter table public.service_requests
  add column if not exists user_id uuid,
  add column if not exists customer_id uuid;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'service_requests_user_id_fkey'
  ) then
    alter table public.service_requests
      add constraint service_requests_user_id_fkey
      foreign key (user_id) references public.profiles(id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'service_requests_customer_id_fkey'
  ) then
    alter table public.service_requests
      add constraint service_requests_customer_id_fkey
      foreign key (customer_id) references public.customers(id) on delete set null;
  end if;
end $$;

create or replace view public.customer_summary as
select
  c.*,
  count(sr.id) as booking_count,
  max(sr.created_at) as last_booking
from public.customers c
left join public.service_requests sr on sr.customer_id = c.id
group by c.id;

-- Force PostgREST to pick up the new tables/columns immediately.
notify pgrst, 'reload schema';
