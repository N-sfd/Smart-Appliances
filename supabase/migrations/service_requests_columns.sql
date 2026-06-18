-- Run this in the Supabase SQL editor.
-- Adds every column the app's BookingRow type expects on service_requests.
-- Safe to re-run: every column uses IF NOT EXISTS, so this won't touch
-- columns that already exist (e.g. customer_name, email, phone, zip_code,
-- service_type, service_category, which were already on the live table).

alter table public.service_requests
  add column if not exists service_id uuid,
  add column if not exists request_number text,
  add column if not exists admin_status text,
  add column if not exists customer_message text,
  add column if not exists email_sent boolean not null default false,
  add column if not exists submitted_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists street_address text,
  add column if not exists suite_apt text,
  add column if not exists city text,
  add column if not exists state text,
  add column if not exists product_name text,
  add column if not exists problem_type text,
  add column if not exists system_type text,
  add column if not exists appliance_brand text,
  add column if not exists appliance_model text,
  add column if not exists issue_description text,
  add column if not exists urgency text,
  add column if not exists preferred_date text,
  add column if not exists preferred_time text,
  add column if not exists status text not null default 'New',
  add column if not exists created_at timestamptz not null default now();

notify pgrst, 'reload schema';
