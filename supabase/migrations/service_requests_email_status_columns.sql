-- Run this in the Supabase SQL editor.
-- Optional columns for tracking admin vs. customer email delivery separately.
-- email_sent already means "customer confirmation email sent" (see
-- src/lib/supabaseBookings.ts updateEmailSent) — these add finer-grained
-- diagnostics without changing that meaning. The app works fine if this
-- migration is never run; updateEmailSent() detects missing columns and
-- retries with just email_sent.

alter table public.service_requests
  add column if not exists admin_email_sent boolean default false,
  add column if not exists customer_email_sent boolean default false,
  add column if not exists email_error text;

notify pgrst, 'reload schema';
