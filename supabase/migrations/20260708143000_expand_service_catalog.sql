-- Expand scalable service catalog for TV Mounting, Phone Repair, Handyman, Smart Home, and future categories.
-- Safe to re-run: uses IF NOT EXISTS / ON CONFLICT / guarded DO blocks.
-- Run in Supabase SQL Editor or via supabase db push.

-- ── shared updated_at trigger ───────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── service_categories ──────────────────────────────────────────────────────

create table if not exists public.service_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  name text not null,
  description text,
  icon_name text,
  image_url text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.service_categories
  add column if not exists slug text,
  add column if not exists description text,
  add column if not exists icon_name text,
  add column if not exists image_url text,
  add column if not exists display_order integer not null default 0,
  add column if not exists is_active boolean not null default true,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

-- Backfill slug from name for legacy rows
update public.service_categories
set slug = lower(regexp_replace(trim(name), '[^a-zA-Z0-9]+', '-', 'g'))
where slug is null and name is not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'service_categories_slug_lowercase_chk'
  ) then
    alter table public.service_categories
      add constraint service_categories_slug_lowercase_chk check (slug is null or slug = lower(slug));
  end if;
end $$;

create unique index if not exists service_categories_slug_uidx on public.service_categories(slug);

-- ── services ────────────────────────────────────────────────────────────────

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.service_categories(id) on delete restrict,
  slug text unique,
  name text not null,
  short_description text,
  service_type text,
  starting_price numeric(10,2),
  pricing_type text not null default 'starting_at',
  requires_quote boolean not null default false,
  estimated_duration_minutes integer,
  technician_skill_group text,
  image_url text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.services
  add column if not exists category_id uuid,
  add column if not exists slug text,
  add column if not exists short_description text,
  add column if not exists service_type text,
  add column if not exists starting_price numeric(10,2),
  add column if not exists pricing_type text not null default 'starting_at',
  add column if not exists requires_quote boolean not null default false,
  add column if not exists estimated_duration_minutes integer,
  add column if not exists technician_skill_group text,
  add column if not exists image_url text,
  add column if not exists display_order integer not null default 0,
  add column if not exists is_active boolean not null default true,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists description text,
  add column if not exists is_emergency boolean not null default false;

-- Legacy admin UI uses description — mirror into short_description when empty
update public.services
set short_description = description
where short_description is null and description is not null;

update public.services
set slug = lower(regexp_replace(trim(name), '[^a-zA-Z0-9]+', '-', 'g'))
where slug is null and name is not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'services_slug_lowercase_chk') then
    alter table public.services add constraint services_slug_lowercase_chk check (slug is null or slug = lower(slug));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'services_pricing_type_chk') then
    alter table public.services add constraint services_pricing_type_chk check (
      pricing_type in ('starting_at', 'fixed', 'hourly', 'quote_required', 'inspection_required')
    );
  end if;
  if not exists (select 1 from pg_constraint where conname = 'services_category_id_fkey') then
    alter table public.services
      add constraint services_category_id_fkey
      foreign key (category_id) references public.service_categories(id) on delete restrict;
  end if;
end $$;

create unique index if not exists services_slug_uidx on public.services(slug);

-- ── service_questions ───────────────────────────────────────────────────────

create table if not exists public.service_questions (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.service_categories(id) on delete cascade,
  service_id uuid references public.services(id) on delete cascade,
  question_key text not null,
  label text not null,
  helper_text text,
  input_type text not null,
  options jsonb,
  default_value jsonb,
  is_required boolean not null default false,
  display_order integer not null default 0,
  conditional_logic jsonb,
  validation_rules jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint service_questions_scope_chk check (category_id is not null or service_id is not null)
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'service_questions_input_type_chk') then
    alter table public.service_questions add constraint service_questions_input_type_chk check (
      input_type in ('text', 'textarea', 'select', 'radio', 'checkbox', 'number', 'boolean', 'date', 'time', 'file')
    );
  end if;
end $$;

create unique index if not exists idx_service_questions_service_key
  on public.service_questions(service_id, question_key) where service_id is not null;

create unique index if not exists idx_service_questions_category_key
  on public.service_questions(category_id, question_key) where service_id is null;

-- ── service_requests extensions ─────────────────────────────────────────────

alter table public.service_requests
  add column if not exists service_id uuid,
  add column if not exists category_id uuid,
  add column if not exists booking_answers jsonb not null default '{}'::jsonb,
  add column if not exists internal_notes text,
  add column if not exists source text,
  add column if not exists technician_skill_group text,
  add column if not exists estimated_duration_minutes integer,
  add column if not exists materials_required boolean not null default false,
  add column if not exists address text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'service_requests_category_id_fkey') then
    alter table public.service_requests
      add constraint service_requests_category_id_fkey
      foreign key (category_id) references public.service_categories(id) on delete set null;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'service_requests_service_id_fkey') then
    alter table public.service_requests
      add constraint service_requests_service_id_fkey
      foreign key (service_id) references public.services(id) on delete set null;
  end if;
end $$;

-- Address standardization backfill (address deprecated — use street_address)
update public.service_requests
set street_address = address
where street_address is null and address is not null and trim(address) <> '';

-- ── indexes ─────────────────────────────────────────────────────────────────

create index if not exists idx_service_requests_request_number on public.service_requests(request_number);
create index if not exists idx_service_requests_customer_id on public.service_requests(customer_id);
create index if not exists idx_service_requests_user_id on public.service_requests(user_id);
create index if not exists idx_service_requests_service_id on public.service_requests(service_id);
create index if not exists idx_service_requests_category_id on public.service_requests(category_id);
create index if not exists idx_service_requests_admin_status on public.service_requests(admin_status);
create index if not exists idx_service_requests_status on public.service_requests(status);
create index if not exists idx_service_requests_created_at on public.service_requests(created_at desc);
create index if not exists idx_service_requests_preferred_date on public.service_requests(preferred_date);
create index if not exists idx_service_requests_booking_answers_gin on public.service_requests using gin (booking_answers);
create index if not exists idx_services_category_id on public.services(category_id);
create index if not exists idx_services_active_order on public.services(is_active, display_order);
create index if not exists idx_service_categories_active_order on public.service_categories(is_active, display_order);
create index if not exists idx_service_questions_service_order on public.service_questions(service_id, display_order);
create index if not exists idx_service_questions_category_order on public.service_questions(category_id, display_order);

-- ── updated_at triggers ─────────────────────────────────────────────────────

drop trigger if exists set_service_categories_updated_at on public.service_categories;
create trigger set_service_categories_updated_at
  before update on public.service_categories
  for each row execute function public.set_updated_at();

drop trigger if exists set_services_updated_at on public.services;
create trigger set_services_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

drop trigger if exists set_service_questions_updated_at on public.service_questions;
create trigger set_service_questions_updated_at
  before update on public.service_questions
  for each row execute function public.set_updated_at();

drop trigger if exists set_service_requests_updated_at on public.service_requests;
create trigger set_service_requests_updated_at
  before update on public.service_requests
  for each row execute function public.set_updated_at();

drop trigger if exists set_customers_updated_at on public.customers;
create trigger set_customers_updated_at
  before update on public.customers
  for each row execute function public.set_updated_at();

-- ── seed categories ─────────────────────────────────────────────────────────

insert into public.service_categories (slug, name, description, icon_name, display_order, is_active)
values
  ('appliance-care', 'Appliance Care', 'Repair and maintenance for major home appliances.', 'Kitchen', 10, true),
  ('hvac', 'HVAC', 'Heating, cooling, and ventilation services.', 'AcUnit', 20, true),
  ('plumbing', 'Plumbing', 'Leak repair, drains, fixtures, and water heaters.', 'Plumbing', 30, true),
  ('electrical', 'Electrical', 'Outlets, panels, fixtures, and wiring.', 'Bolt', 40, true),
  ('smart-home', 'Smart Home', 'Smart device installation, setup, and troubleshooting.', 'Sensors', 50, true),
  ('garage-door', 'Garage Door', 'Garage door repair, installation, and opener service.', 'Warehouse', 60, true),
  ('tv-mounting', 'TV Mounting', 'Professional TV mounting and home entertainment setup.', 'Tv', 70, true),
  ('phone-repair', 'Phone Repair', 'Mobile device diagnostics and repair services.', 'Smartphone', 80, true),
  ('handyman', 'Handyman', 'General home repairs, assembly, and small projects.', 'Handyman', 90, true),
  ('emergency', 'Emergency', 'Urgent same-day home service requests.', 'WarningAmber', 100, true)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  icon_name = excluded.icon_name,
  display_order = excluded.display_order,
  is_active = excluded.is_active,
  updated_at = now();

-- ── seed services (new + expanded categories) ───────────────────────────────

-- TV Mounting
insert into public.services (category_id, slug, name, short_description, service_type, starting_price, pricing_type, technician_skill_group, estimated_duration_minutes, display_order, is_active)
select c.id, v.slug, v.name, v.short_description, v.service_type, v.starting_price, v.pricing_type, v.technician_skill_group, v.estimated_duration_minutes, v.display_order, true
from public.service_categories c
cross join (values
  ('standard-tv-mounting', 'Standard TV Mounting', 'Mount TVs up to 55 inches on standard walls.', 'Installation', 129.00, 'starting_at', 'tv-mounting', 90, 10),
  ('large-tv-mounting', 'Large TV Mounting', 'Mount TVs 56 inches and larger with reinforced hardware.', 'Installation', 179.00, 'starting_at', 'tv-mounting', 120, 20),
  ('tv-dismount', 'TV Dismount', 'Safely remove an existing wall-mounted TV.', 'Installation', 89.00, 'starting_at', 'tv-mounting', 60, 30),
  ('tv-remount', 'TV Remount', 'Relocate or remount a TV to a new location.', 'Installation', 149.00, 'starting_at', 'tv-mounting', 120, 40),
  ('wire-concealment', 'Wire Concealment', 'Hide power and HDMI cables for a clean finish.', 'Installation', 99.00, 'starting_at', 'tv-mounting', 75, 50),
  ('soundbar-installation', 'Soundbar Installation', 'Mount and connect a soundbar with your TV.', 'Installation', 109.00, 'starting_at', 'tv-mounting', 60, 60),
  ('media-device-setup', 'Media Device Setup', 'Connect streaming devices, consoles, and AV equipment.', 'Installation', 89.00, 'starting_at', 'tv-mounting', 60, 70)
) as v(slug, name, short_description, service_type, starting_price, pricing_type, technician_skill_group, estimated_duration_minutes, display_order)
where c.slug = 'tv-mounting'
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  short_description = excluded.short_description,
  service_type = excluded.service_type,
  starting_price = excluded.starting_price,
  pricing_type = excluded.pricing_type,
  technician_skill_group = excluded.technician_skill_group,
  estimated_duration_minutes = excluded.estimated_duration_minutes,
  display_order = excluded.display_order,
  is_active = true,
  updated_at = now();

-- Phone Repair
insert into public.services (category_id, slug, name, short_description, service_type, starting_price, pricing_type, requires_quote, technician_skill_group, estimated_duration_minutes, display_order, is_active)
select c.id, v.slug, v.name, v.short_description, v.service_type, v.starting_price, v.pricing_type, v.requires_quote, v.technician_skill_group, v.estimated_duration_minutes, v.display_order, true
from public.service_categories c
cross join (values
  ('phone-screen-replacement', 'Screen Replacement', 'Replace cracked or unresponsive screens.', 'Repair', 149.00, 'starting_at', false, 'phone-repair', 90, 10),
  ('phone-battery-replacement', 'Battery Replacement', 'Restore battery life and charging performance.', 'Repair', 89.00, 'starting_at', false, 'phone-repair', 60, 20),
  ('phone-charging-port-repair', 'Charging Port Repair', 'Fix loose or damaged charging ports.', 'Repair', 99.00, 'starting_at', false, 'phone-repair', 75, 30),
  ('phone-camera-repair', 'Camera Repair', 'Repair front or rear camera modules.', 'Repair', 119.00, 'starting_at', false, 'phone-repair', 75, 40),
  ('phone-speaker-microphone-repair', 'Speaker or Microphone Repair', 'Restore audio input and output.', 'Repair', 99.00, 'starting_at', false, 'phone-repair', 60, 50),
  ('phone-button-repair', 'Button Repair', 'Repair power, volume, or home buttons.', 'Repair', 89.00, 'starting_at', false, 'phone-repair', 60, 60),
  ('phone-water-damage-assessment', 'Water-Damage Assessment', 'Inspect water-damaged devices and recommend next steps.', 'Repair', 49.00, 'inspection_required', true, 'phone-repair', 45, 70),
  ('phone-device-diagnostic', 'Device Diagnostic', 'Full device diagnostic before repair approval.', 'Repair', 39.00, 'inspection_required', false, 'phone-repair', 30, 80)
) as v(slug, name, short_description, service_type, starting_price, pricing_type, requires_quote, technician_skill_group, estimated_duration_minutes, display_order)
where c.slug = 'phone-repair'
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  short_description = excluded.short_description,
  service_type = excluded.service_type,
  starting_price = excluded.starting_price,
  pricing_type = excluded.pricing_type,
  requires_quote = excluded.requires_quote,
  technician_skill_group = excluded.technician_skill_group,
  estimated_duration_minutes = excluded.estimated_duration_minutes,
  display_order = excluded.display_order,
  is_active = true,
  updated_at = now();

-- Handyman
insert into public.services (category_id, slug, name, short_description, service_type, starting_price, pricing_type, technician_skill_group, estimated_duration_minutes, display_order, is_active)
select c.id, v.slug, v.name, v.short_description, v.service_type, v.starting_price, v.pricing_type, v.technician_skill_group, v.estimated_duration_minutes, v.display_order, true
from public.service_categories c
cross join (values
  ('general-handyman-service', 'General Handyman Service', 'Hourly handyman help for small home tasks.', 'Maintenance', 99.00, 'hourly', 'handyman', 120, 10),
  ('furniture-assembly', 'Furniture Assembly', 'Assemble flat-pack furniture and fixtures.', 'Installation', 109.00, 'starting_at', 'handyman', 120, 20),
  ('wall-hanging', 'Wall Hanging', 'Hang mirrors, art, and decor securely.', 'Installation', 89.00, 'starting_at', 'handyman', 60, 30),
  ('shelf-installation', 'Shelf Installation', 'Install floating or bracketed shelves.', 'Installation', 99.00, 'starting_at', 'handyman', 75, 40),
  ('drywall-repair', 'Drywall Repair', 'Patch holes and minor drywall damage.', 'Repair', 119.00, 'starting_at', 'handyman', 90, 50),
  ('interior-painting', 'Interior Painting', 'Touch-up and small-area interior painting.', 'Maintenance', 149.00, 'quote_required', 'handyman', 180, 60),
  ('curtain-rod-installation', 'Curtain Rod Installation', 'Install curtain rods and window hardware.', 'Installation', 79.00, 'starting_at', 'handyman', 60, 70),
  ('minor-home-repairs', 'Minor Home Repairs', 'Small repairs that do not require a specialist trade.', 'Repair', 99.00, 'starting_at', 'handyman', 90, 80),
  ('appliance-installation-assistance', 'Appliance Installation Assistance', 'Help positioning and connecting non-plumbed appliances.', 'Installation', 109.00, 'starting_at', 'handyman', 90, 90)
) as v(slug, name, short_description, service_type, starting_price, pricing_type, technician_skill_group, estimated_duration_minutes, display_order)
where c.slug = 'handyman'
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  short_description = excluded.short_description,
  service_type = excluded.service_type,
  starting_price = excluded.starting_price,
  pricing_type = excluded.pricing_type,
  technician_skill_group = excluded.technician_skill_group,
  estimated_duration_minutes = excluded.estimated_duration_minutes,
  display_order = excluded.display_order,
  is_active = true,
  updated_at = now();

-- Expanded Smart Home
insert into public.services (category_id, slug, name, short_description, service_type, starting_price, pricing_type, technician_skill_group, estimated_duration_minutes, display_order, is_active)
select c.id, v.slug, v.name, v.short_description, v.service_type, v.starting_price, v.pricing_type, v.technician_skill_group, v.estimated_duration_minutes, v.display_order, true
from public.service_categories c
cross join (values
  ('video-doorbell-installation', 'Video Doorbell Installation', 'Install and configure video doorbells.', 'Installation', 129.00, 'starting_at', 'smart-home', 90, 10),
  ('smart-thermostat-installation', 'Smart Thermostat Installation', 'Install and program smart thermostats.', 'Installation', 149.00, 'starting_at', 'smart-home', 90, 20),
  ('smart-lock-installation', 'Smart Lock Installation', 'Install smart locks and test access.', 'Installation', 139.00, 'starting_at', 'smart-home', 90, 30),
  ('security-camera-installation', 'Security Camera Installation', 'Mount and configure security cameras.', 'Installation', 149.00, 'starting_at', 'smart-home', 120, 40),
  ('smart-switch-installation', 'Smart Switch Installation', 'Replace switches with smart controls.', 'Installation', 119.00, 'starting_at', 'smart-home', 75, 50),
  ('wifi-device-setup', 'Wi-Fi Device Setup', 'Connect smart devices to home Wi-Fi.', 'Installation', 89.00, 'starting_at', 'smart-home', 60, 60),
  ('smart-home-consultation', 'Smart Home Consultation', 'Plan a smart home setup with a technician.', 'Maintenance', 79.00, 'fixed', 'smart-home', 60, 70),
  ('device-app-setup', 'Device App Setup', 'Configure apps, accounts, and automations.', 'Installation', 69.00, 'starting_at', 'smart-home', 45, 80)
) as v(slug, name, short_description, service_type, starting_price, pricing_type, technician_skill_group, estimated_duration_minutes, display_order)
where c.slug = 'smart-home'
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  short_description = excluded.short_description,
  service_type = excluded.service_type,
  starting_price = excluded.starting_price,
  pricing_type = excluded.pricing_type,
  technician_skill_group = excluded.technician_skill_group,
  estimated_duration_minutes = excluded.estimated_duration_minutes,
  display_order = excluded.display_order,
  is_active = true,
  updated_at = now();

-- ── seed category-level questions ───────────────────────────────────────────

-- TV Mounting
insert into public.service_questions (category_id, service_id, question_key, label, helper_text, input_type, options, is_required, display_order, is_active)
select c.id, null, v.question_key, v.label, v.helper_text, v.input_type, v.options::jsonb, v.is_required, v.display_order, true
from public.service_categories c
cross join (values
  ('tvSize', 'TV size', 'Approximate screen size', 'select', '["32 inches or less","33–44 inches","45–54 inches","55–65 inches","66–75 inches","76+ inches"]', true, 10),
  ('wallType', 'Wall type', null, 'select', '["Drywall","Plaster","Brick","Concrete","Other"]', true, 20),
  ('mountAvailable', 'Is the mount already purchased?', null, 'boolean', null, false, 30),
  ('mountType', 'Mount type', null, 'select', '["Fixed","Tilt","Full motion","Not sure"]', false, 40),
  ('wireConcealment', 'Wire concealment needed?', null, 'boolean', null, false, 50),
  ('soundbarInstallation', 'Soundbar installation needed?', null, 'boolean', null, false, 60),
  ('outletNearby', 'Existing outlet near installation?', null, 'boolean', null, false, 70),
  ('mountingHeight', 'Preferred mounting height', null, 'select', '["Eye level","Above fireplace","Higher on wall","Not sure"]', false, 80),
  ('numberOfTvs', 'Number of TVs', null, 'number', null, true, 90),
  ('additionalNotes', 'Additional notes', null, 'textarea', null, false, 100)
) as v(question_key, label, helper_text, input_type, options, is_required, display_order)
where c.slug = 'tv-mounting'
on conflict (category_id, question_key) where service_id is null do update set
  label = excluded.label,
  helper_text = excluded.helper_text,
  input_type = excluded.input_type,
  options = excluded.options,
  is_required = excluded.is_required,
  display_order = excluded.display_order,
  is_active = true,
  updated_at = now();

-- Phone Repair
insert into public.service_questions (category_id, service_id, question_key, label, helper_text, input_type, options, is_required, display_order, is_active)
select c.id, null, v.question_key, v.label, v.helper_text, v.input_type, v.options::jsonb, v.is_required, v.display_order, true
from public.service_categories c
cross join (values
  ('deviceBrand', 'Device brand', null, 'select', '["Apple","Samsung","Google","Motorola","LG","Other"]', true, 10),
  ('deviceModel', 'Device model', 'Example: iPhone 15, Galaxy S24', 'text', null, true, 20),
  ('repairType', 'Repair type', null, 'select', '["Screen replacement","Battery replacement","Charging port","Camera","Speaker/microphone","Button","Water damage","Diagnostic","Other"]', true, 30),
  ('devicePowersOn', 'Does the device power on?', null, 'boolean', null, true, 40),
  ('waterDamage', 'Water damage?', null, 'boolean', null, false, 50),
  ('screenCondition', 'Screen condition', null, 'select', '["Cracked","Unresponsive","Lines/dead pixels","No damage","Other"]', false, 60),
  ('previousRepair', 'Has the device been repaired before?', null, 'boolean', null, false, 70),
  ('preferredServiceOption', 'Preferred service option', null, 'select', '["In-home service","Drop-off/pickup if available","Not sure"]', false, 80),
  ('issueDetails', 'Additional issue details', null, 'textarea', null, false, 90)
) as v(question_key, label, helper_text, input_type, options, is_required, display_order)
where c.slug = 'phone-repair'
on conflict (category_id, question_key) where service_id is null do update set
  label = excluded.label,
  helper_text = excluded.helper_text,
  input_type = excluded.input_type,
  options = excluded.options,
  is_required = excluded.is_required,
  display_order = excluded.display_order,
  is_active = true,
  updated_at = now();

-- Handyman
insert into public.service_questions (category_id, service_id, question_key, label, helper_text, input_type, options, is_required, display_order, is_active)
select c.id, null, v.question_key, v.label, v.helper_text, v.input_type, v.options::jsonb, v.is_required, v.display_order, true
from public.service_categories c
cross join (values
  ('jobType', 'Job type', null, 'select', '["Furniture assembly","Wall hanging","Shelf installation","Drywall repair","Painting","Curtain rods","Minor repairs","Other"]', true, 10),
  ('numberOfItems', 'Number of items', null, 'number', null, false, 20),
  ('estimatedHours', 'Estimated job size (hours)', null, 'number', null, false, 30),
  ('materialsProvidedByCustomer', 'Materials already purchased?', null, 'boolean', null, false, 40),
  ('ladderRequired', 'Ladder required?', null, 'boolean', null, false, 50),
  ('wallType', 'Wall type', null, 'select', '["Drywall","Plaster","Brick","Concrete","Not applicable"]', false, 60),
  ('roomLocation', 'Room/location', null, 'text', null, false, 70),
  ('photosAvailable', 'Photos available?', 'You may share photos after booking confirmation.', 'boolean', null, false, 80),
  ('jobDescription', 'Detailed job description', null, 'textarea', null, true, 90)
) as v(question_key, label, helper_text, input_type, options, is_required, display_order)
where c.slug = 'handyman'
on conflict (category_id, question_key) where service_id is null do update set
  label = excluded.label,
  helper_text = excluded.helper_text,
  input_type = excluded.input_type,
  options = excluded.options,
  is_required = excluded.is_required,
  display_order = excluded.display_order,
  is_active = true,
  updated_at = now();

-- Smart Home
insert into public.service_questions (category_id, service_id, question_key, label, helper_text, input_type, options, is_required, display_order, is_active)
select c.id, null, v.question_key, v.label, v.helper_text, v.input_type, v.options::jsonb, v.is_required, v.display_order, true
from public.service_categories c
cross join (values
  ('deviceType', 'Device type', null, 'select', '["Video doorbell","Smart thermostat","Smart lock","Security camera","Smart switch","Wi-Fi device","Hub","Other"]', true, 10),
  ('brand', 'Device brand', null, 'text', null, false, 20),
  ('deviceAlreadyPurchased', 'Device already purchased?', null, 'boolean', null, true, 30),
  ('existingWiring', 'Existing wiring?', null, 'boolean', null, false, 40),
  ('wifiAvailable', 'Wi-Fi available at install location?', null, 'boolean', null, true, 50),
  ('appSetupRequired', 'App setup required?', null, 'boolean', null, false, 60),
  ('existingHub', 'Existing smart home hub?', null, 'boolean', null, false, 70),
  ('numberOfDevices', 'Number of devices', null, 'number', null, false, 80),
  ('needsDemonstration', 'Customer needs a demonstration?', null, 'boolean', null, false, 90),
  ('additionalNotes', 'Additional notes', null, 'textarea', null, false, 100)
) as v(question_key, label, helper_text, input_type, options, is_required, display_order)
where c.slug = 'smart-home'
on conflict (category_id, question_key) where service_id is null do update set
  label = excluded.label,
  helper_text = excluded.helper_text,
  input_type = excluded.input_type,
  options = excluded.options,
  is_required = excluded.is_required,
  display_order = excluded.display_order,
  is_active = true,
  updated_at = now();

-- ── backfill legacy service_requests catalog IDs ────────────────────────────

update public.service_requests sr
set category_id = sc.id
from public.service_categories sc
where sr.category_id is null
  and (
    (lower(trim(sr.service_category)) in ('appliance', 'appliances', 'appliance care') and sc.slug = 'appliance-care')
    or (lower(trim(sr.service_category)) = 'hvac' and sc.slug = 'hvac')
    or (lower(trim(sr.service_category)) = 'plumbing' and sc.slug = 'plumbing')
    or (lower(trim(sr.service_category)) = 'electrical' and sc.slug = 'electrical')
    or (lower(trim(sr.service_category)) in ('smart home', 'smart home services') and sc.slug = 'smart-home')
    or (lower(trim(sr.service_category)) in ('garage door', 'garage door services') and sc.slug = 'garage-door')
    or (lower(trim(sr.service_category)) = 'tv mounting' and sc.slug = 'tv-mounting')
    or (lower(trim(sr.service_category)) = 'phone repair' and sc.slug = 'phone-repair')
    or (lower(trim(sr.service_category)) = 'handyman' and sc.slug = 'handyman')
    or (lower(trim(sr.service_category)) = 'emergency' and sc.slug = 'emergency')
  );

update public.service_requests sr
set service_id = s.id
from public.services s
where sr.service_id is null
  and sr.product_name is not null
  and lower(trim(sr.product_name)) = lower(trim(s.name));

-- ── RLS ─────────────────────────────────────────────────────────────────────

alter table public.service_categories enable row level security;
alter table public.services enable row level security;
alter table public.service_questions enable row level security;

drop policy if exists "public read active service_categories" on public.service_categories;
create policy "public read active service_categories" on public.service_categories
  for select to anon, authenticated using (is_active = true);

drop policy if exists "admin manage service_categories" on public.service_categories;
create policy "admin manage service_categories" on public.service_categories
  for all to authenticated using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

drop policy if exists "public read active services" on public.services;
create policy "public read active services" on public.services
  for select to anon, authenticated using (is_active = true);

drop policy if exists "admin manage services" on public.services;
create policy "admin manage services" on public.services
  for all to authenticated using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

drop policy if exists "public read active service_questions" on public.service_questions;
create policy "public read active service_questions" on public.service_questions
  for select to anon, authenticated using (is_active = true);

drop policy if exists "admin manage service_questions" on public.service_questions;
create policy "admin manage service_questions" on public.service_questions
  for all to authenticated using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Unmatched legacy records report (run manually after migration):
-- select id, request_number, service_category, product_name
-- from public.service_requests
-- where category_id is null or (product_name is not null and service_id is null);

notify pgrst, 'reload schema';
