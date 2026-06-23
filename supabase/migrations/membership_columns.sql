-- Smart Care membership interest on service requests
alter table public.service_requests
  add column if not exists membership_interest boolean not null default false,
  add column if not exists selected_membership_plan text;

notify pgrst, 'reload schema';
