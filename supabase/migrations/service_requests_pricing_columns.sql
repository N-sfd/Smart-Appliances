-- Run this in the Supabase SQL editor.
-- Adds the optional starting-estimate columns used by the booking pricing summary.
-- Safe to re-run: every column uses IF NOT EXISTS. The app does not require this
-- migration to function — insertBooking() retries without these fields if they
-- are missing — but running it lets booking submissions persist the estimate
-- shown to the customer.

alter table public.service_requests
  add column if not exists estimated_base_fee numeric,
  add column if not exists estimated_priority_fee numeric,
  add column if not exists estimated_emergency_fee numeric,
  add column if not exists estimated_total numeric,
  add column if not exists quote_required boolean default false;

notify pgrst, 'reload schema';
