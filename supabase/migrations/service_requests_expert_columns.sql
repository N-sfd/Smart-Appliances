-- Run this in the Supabase SQL editor.
-- Adds the optional requested-expert columns used by the Expert Profile feature.
-- Safe to re-run: every column uses IF NOT EXISTS. The app does not require this
-- migration to function — insertBooking() retries without these fields if they
-- are missing — but running it lets booking submissions persist which expert
-- the customer requested.

alter table public.service_requests
  add column if not exists expert_slug text,
  add column if not exists expert_name text;

notify pgrst, 'reload schema';
