-- Run this in the Supabase SQL editor (Project -> SQL Editor -> New query).
-- Adds DB-backed experts/expert_services/expert_reviews tables (previously only
-- in src/data/experts.ts) so admins can manage expert profiles, and links
-- service_requests to a real expert via expert_id for admin assignment
-- (separate from the existing expert_slug/expert_name "requested expert"
-- snapshot fields, which stay as-is). Also adds membership_status for the
-- membership leads admin page. Safe to re-run.

-- ── experts ─────────────────────────────────────────────────────────────────

create table if not exists public.experts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  title text,
  bio text,
  avatar_url text,
  rating numeric default 0,
  review_count int default 0,
  jobs_completed text,
  response_time text,
  service_areas text[],
  specialties text[],
  starting_fee numeric,
  is_active boolean default true,
  is_featured boolean default false,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists experts_slug_idx on public.experts(slug);

-- ── expert_services ─────────────────────────────────────────────────────────

create table if not exists public.expert_services (
  id uuid primary key default gen_random_uuid(),
  expert_id uuid references public.experts(id) on delete cascade,
  service_name text not null,
  service_category text,
  service_type text,
  starting_price numeric,
  quote_required boolean default false,
  product_name text,
  display_order int default 0,
  created_at timestamptz default now()
);

create index if not exists expert_services_expert_id_idx on public.expert_services(expert_id);

-- ── expert_reviews ───────────────────────────────────────────────────────────

create table if not exists public.expert_reviews (
  id uuid primary key default gen_random_uuid(),
  expert_id uuid references public.experts(id) on delete cascade,
  customer_first_name text,
  rating int,
  service_type text,
  review_text text,
  review_date date,
  is_verified boolean default false,
  is_demo boolean default true,
  created_at timestamptz default now()
);

create index if not exists expert_reviews_expert_id_idx on public.expert_reviews(expert_id);

-- ── service_requests: admin expert assignment + membership status ──────────

alter table public.service_requests
  add column if not exists expert_id uuid references public.experts(id) on delete set null,
  add column if not exists membership_status text default 'Interested';

-- ── RLS ──────────────────────────────────────────────────────────────────────

alter table public.experts enable row level security;
alter table public.expert_services enable row level security;
alter table public.expert_reviews enable row level security;

drop policy if exists "public select active experts" on public.experts;
create policy "public select active experts" on public.experts
  for select to anon, authenticated using (is_active = true);

drop policy if exists "admin select all experts" on public.experts;
create policy "admin select all experts" on public.experts
  for select to authenticated using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

drop policy if exists "admin write experts" on public.experts;
create policy "admin write experts" on public.experts
  for all to authenticated using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

drop policy if exists "public select services of active experts" on public.expert_services;
create policy "public select services of active experts" on public.expert_services
  for select to anon, authenticated using (
    exists (select 1 from public.experts e where e.id = expert_id and e.is_active = true)
  );

drop policy if exists "admin write expert services" on public.expert_services;
create policy "admin write expert services" on public.expert_services
  for all to authenticated using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

drop policy if exists "public select reviews of active experts" on public.expert_reviews;
create policy "public select reviews of active experts" on public.expert_reviews
  for select to anon, authenticated using (
    exists (select 1 from public.experts e where e.id = expert_id and e.is_active = true)
  );

drop policy if exists "admin write expert reviews" on public.expert_reviews;
create policy "admin write expert reviews" on public.expert_reviews
  for all to authenticated using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

notify pgrst, 'reload schema';
