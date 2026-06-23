import { supabase, isSupabaseConfigured } from './supabaseClient';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BookingRow {
  id?: string;
  user_id?: string | null;
  customer_id?: string | null;
  service_id?: string | null;

  request_number?: string | null;
  admin_status?: string;
  customer_message?: string | null;
  email_sent?: boolean;
  submitted_at?: string;
  updated_at?: string;

  customer_name: string;
  email: string;
  phone: string;

  zip_code?: string | null;
  street_address?: string | null;
  suite_apt?: string | null;
  city?: string | null;
  state?: string | null;

  service_type: string;
  service_category: string;
  product_name?: string | null;

  problem_type?: string | null;
  system_type?: string | null;
  appliance_brand?: string | null;
  appliance_model?: string | null;
  issue_description?: string | null;

  urgency?: string | null;
  preferred_date?: string | null;
  preferred_time?: string | null;

  // Optional starting-estimate fields — present only if the schema has these columns (see
  // supabase/migrations/service_requests_pricing_columns.sql). insertBooking() retries without
  // them if the columns don't exist yet, so booking submission never fails on their account.
  estimated_base_fee?: number | null;
  estimated_priority_fee?: number | null;
  estimated_emergency_fee?: number | null;
  estimated_total?: number | null;
  quote_required?: boolean | null;

  // Optional requested-expert fields — present only if the schema has these columns (see
  // supabase/migrations/service_requests_expert_columns.sql). Same retry-without-them behavior.
  expert_slug?: string | null;
  expert_name?: string | null;

  // Admin-assigned expert (distinct from the customer-requested expert_slug/expert_name
  // above) — see supabase/migrations/admin_experts_membership.sql.
  expert_id?: string | null;

  membership_interest?: boolean | null;
  selected_membership_plan?: string | null;
  membership_status?: string | null;

  status: string;
  created_at?: string;
}

const PRICING_ESTIMATE_KEYS = [
  'estimated_base_fee',
  'estimated_priority_fee',
  'estimated_emergency_fee',
  'estimated_total',
  'quote_required',
] as const;

const EXPERT_KEYS = ['expert_slug', 'expert_name'] as const;

const MEMBERSHIP_KEYS = ['membership_interest', 'selected_membership_plan'] as const;

const OPTIONAL_INSERT_KEYS = [...PRICING_ESTIMATE_KEYS, ...EXPERT_KEYS, ...MEMBERSHIP_KEYS] as const;

export interface Customer {
  id?: string;
  profile_id?: string | null;
  email: string;
  full_name?: string | null;
  phone?: string | null;
  zip_code?: string | null;
}

export type BookingStatus =
  | 'New'
  | 'Scheduled'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

export const BOOKING_STATUSES: BookingStatus[] = [
  'New', 'Scheduled', 'In Progress', 'Completed', 'Cancelled',
];

export type AdminStatus =
  | 'New'
  | 'Contacted'
  | 'Scheduled'
  | 'Technician Assigned'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

export const ADMIN_STATUSES: AdminStatus[] = [
  'New', 'Contacted', 'Scheduled', 'Technician Assigned', 'In Progress', 'Completed', 'Cancelled',
];

const ADMIN_TO_STATUS: Record<string, string> = {
  'New': 'New',
  'Contacted': 'New',
  'Scheduled': 'Scheduled',
  'Technician Assigned': 'Scheduled',
  'In Progress': 'In Progress',
  'Completed': 'Completed',
  'Cancelled': 'Cancelled',
};

export const ADMIN_STATUS_STEPS = [
  'New', 'Contacted', 'Scheduled', 'Technician Assigned', 'In Progress', 'Completed',
] as const;

// ── Booking notes ─────────────────────────────────────────────────────────────

export interface BookingNote {
  id?: string;
  service_request_id: string;
  admin_id?: string | null;
  note: string;
  created_at?: string;
}

// ── Customers ─────────────────────────────────────────────────────────────────

export async function findOrCreateCustomer(input: {
  email: string;
  full_name?: string | null;
  phone?: string | null;
  zip_code?: string | null;
  profile_id?: string | null;
}): Promise<string | null> {
  if (!isSupabaseConfigured() || !supabase) return null;
  const email = input.email.trim().toLowerCase();
  if (!email) return null;

  const { data: existing, error: selectError } = await supabase
    .from('customers')
    .select('id, profile_id, full_name, phone, zip_code')
    .eq('email', email)
    .maybeSingle();
  if (selectError) {
    console.error('findOrCreateCustomer: select failed', selectError.message);
    return null;
  }

  if (existing) {
    const patch: Partial<Customer> = {};
    if (!existing.profile_id && input.profile_id) patch.profile_id = input.profile_id;
    if (!existing.full_name && input.full_name) patch.full_name = input.full_name;
    if (!existing.phone && input.phone) patch.phone = input.phone;
    if (!existing.zip_code && input.zip_code) patch.zip_code = input.zip_code;
    if (Object.keys(patch).length > 0) {
      await supabase
        .from('customers')
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq('id', existing.id);
    }
    return existing.id as string;
  }

  const { data: created, error: insertError } = await supabase
    .from('customers')
    .insert([{
      email,
      profile_id: input.profile_id ?? null,
      full_name: input.full_name ?? null,
      phone: input.phone ?? null,
      zip_code: input.zip_code ?? null,
    }])
    .select('id')
    .single();
  if (insertError) {
    console.error('findOrCreateCustomer: insert failed', insertError.message);
    return null;
  }
  return (created as { id: string } | null)?.id ?? null;
}

// ── Insert booking ────────────────────────────────────────────────────────────

export async function insertBooking(
  row: BookingRow,
): Promise<{ id: string | null; error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) {
    console.error('[Booking] insertBooking: Supabase not configured — REACT_APP_SUPABASE_URL / REACT_APP_SUPABASE_ANON_KEY may be missing');
    return { id: null, error: 'Supabase not configured' };
  }

  const customerId = await findOrCreateCustomer({
    email: row.email,
    full_name: row.customer_name,
    phone: row.phone,
    zip_code: row.zip_code,
    profile_id: row.user_id ?? null,
  });
  const rowWithCustomer = { ...row, customer_id: customerId ?? row.customer_id ?? null };

  console.log('[Booking] FormData', rowWithCustomer);
  const { data, error } = await supabase
    .from('service_requests')
    .insert([rowWithCustomer])
    .select('id')
    .single();

  if (error) {
    // If the optional pricing-estimate columns haven't been migrated yet, retry without them
    // rather than failing the whole booking.
    if (/column .* does not exist/i.test(error.message)) {
      const fallbackRow = { ...rowWithCustomer };
      for (const key of OPTIONAL_INSERT_KEYS) delete (fallbackRow as Record<string, unknown>)[key];
      const { data: retryData, error: retryError } = await supabase
        .from('service_requests')
        .insert([fallbackRow])
        .select('id')
        .single();
      if (retryError) {
        console.error('[Booking] Error (retry without pricing columns)', retryError.message, retryError);
        return { id: null, error: retryError.message };
      }
      console.log('[Booking] Success (without pricing columns)', retryData);
      return { id: (retryData as { id: string } | null)?.id ?? null, error: null };
    }
    console.error('[Booking] Error', error.message, error);
    return { id: null, error: error.message };
  }
  console.log('[Booking] Success', data);
  return { id: (data as { id: string } | null)?.id ?? null, error: null };
}

// ── Fetch user's own bookings ─────────────────────────────────────────────────

export async function fetchUserBookings(userId: string): Promise<BookingRow[]> {
  if (!isSupabaseConfigured() || !supabase) return [];
  const { data, error } = await supabase
    .from('service_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('fetchUserBookings:', error.message);
    return [];
  }
  return (data ?? []) as BookingRow[];
}

// ── Admin: fetch all bookings ─────────────────────────────────────────────────

export async function fetchAllBookings(filters?: {
  status?: string;
  search?: string;
  category?: string;
  service_type?: string;
  zip_code?: string;
  date_from?: string;
  date_to?: string;
}): Promise<BookingRow[]> {
  if (!isSupabaseConfigured() || !supabase) return [];

  let q = supabase
    .from('service_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.status && filters.status !== 'all') {
    q = q.eq('status', filters.status);
  }
  if (filters?.category && filters.category !== 'all') {
    q = q.eq('service_category', filters.category);
  }
  if (filters?.service_type && filters.service_type !== 'all') {
    q = q.eq('service_type', filters.service_type);
  }
  if (filters?.zip_code) {
    q = q.ilike('zip_code', `%${filters.zip_code}%`);
  }
  if (filters?.date_from) {
    q = q.gte('created_at', filters.date_from);
  }
  if (filters?.date_to) {
    q = q.lte('created_at', `${filters.date_to}T23:59:59`);
  }
  if (filters?.search) {
    const s = filters.search.trim();
    q = q.or(
      `customer_name.ilike.%${s}%,email.ilike.%${s}%,phone.ilike.%${s}%,zip_code.ilike.%${s}%,service_type.ilike.%${s}%,product_name.ilike.%${s}%`,
    );
  }

  const { data, error } = await q;
  if (error) {
    console.error('fetchAllBookings:', error.message);
    return [];
  }
  return (data ?? []) as BookingRow[];
}

// ── Admin: update booking ─────────────────────────────────────────────────────

export async function updateBookingStatus(
  id: string,
  status: string,
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) return { error: null };
  const { error } = await supabase.from('service_requests').update({ status }).eq('id', id);
  return { error: error?.message ?? null };
}

// ── Admin: booking notes ──────────────────────────────────────────────────────

export async function fetchBookingNotes(serviceRequestId: string): Promise<BookingNote[]> {
  if (!isSupabaseConfigured() || !supabase) return [];
  const { data, error } = await supabase
    .from('booking_notes')
    .select('*')
    .eq('service_request_id', serviceRequestId)
    .order('created_at', { ascending: true });
  if (error) {
    console.error('fetchBookingNotes:', error.message);
    return [];
  }
  return (data ?? []) as BookingNote[];
}

export async function insertBookingNote(
  serviceRequestId: string,
  note: string,
  adminId?: string,
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) return { error: null };
  const { error } = await supabase.from('booking_notes').insert([{
    service_request_id: serviceRequestId,
    admin_id: adminId ?? null,
    note,
  }]);
  return { error: error?.message ?? null };
}

// ── Admin: customer list ──────────────────────────────────────────────────────

export interface CustomerSummary {
  id: string;
  profile_id: string | null;
  email: string;
  customer_name: string;
  phone: string;
  zip_code: string;
  booking_count: number;
  last_booking: string | null;
}

export async function fetchCustomers(): Promise<CustomerSummary[]> {
  if (!isSupabaseConfigured() || !supabase) return [];
  const { data, error } = await supabase
    .from('customer_summary')
    .select('*')
    .order('last_booking', { ascending: false, nullsFirst: false });
  if (error) {
    console.error('fetchCustomers:', error.message);
    return [];
  }

  return ((data ?? []) as {
    id: string;
    profile_id: string | null;
    email: string;
    full_name: string | null;
    phone: string | null;
    zip_code: string | null;
    booking_count: number;
    last_booking: string | null;
  }[]).map((row) => ({
    id: row.id,
    profile_id: row.profile_id,
    email: row.email,
    customer_name: row.full_name ?? '',
    phone: row.phone ?? '',
    zip_code: row.zip_code ?? '',
    booking_count: row.booking_count,
    last_booking: row.last_booking,
  }));
}

// ── Admin: update admin_status ────────────────────────────────────────────────

export async function updateAdminStatus(
  id: string,
  adminStatus: string,
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) return { error: null };
  const status = ADMIN_TO_STATUS[adminStatus] ?? 'New';
  const { error } = await supabase
    .from('service_requests')
    .update({ admin_status: adminStatus, status, updated_at: new Date().toISOString() })
    .eq('id', id);
  return { error: error?.message ?? null };
}

// ── Admin: update customer message ────────────────────────────────────────────

export async function updateCustomerMessage(
  id: string,
  message: string,
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) return { error: null };
  const { error } = await supabase
    .from('service_requests')
    .update({ customer_message: message, updated_at: new Date().toISOString() })
    .eq('id', id);
  return { error: error?.message ?? null };
}

// ── Mark email sent ───────────────────────────────────────────────────────────

export async function updateEmailSent(id: string): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) return;
  await supabase
    .from('service_requests')
    .update({ email_sent: true, updated_at: new Date().toISOString() })
    .eq('id', id);
}

// ── Tracking: fetch by request number ─────────────────────────────────────────

export async function fetchBookingByRequestNumber(
  requestNumber: string,
): Promise<BookingRow | null> {
  if (!isSupabaseConfigured() || !supabase) return null;
  const { data, error } = await supabase
    .from('service_requests')
    .select('*')
    .eq('request_number', requestNumber.trim().toUpperCase())
    .maybeSingle();
  if (error) {
    console.error('fetchBookingByRequestNumber:', error.message);
    return null;
  }
  return (data as BookingRow | null);
}

// ── Tracking: fetch by email + phone ──────────────────────────────────────────

export async function fetchBookingsByContact(
  email: string,
  phone: string,
): Promise<BookingRow[]> {
  if (!isSupabaseConfigured() || !supabase) return [];
  const digits = phone.replace(/\D/g, '');
  const formatted =
    digits.length === 10
      ? `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
      : phone.trim();
  const { data, error } = await supabase
    .from('service_requests')
    .select('*')
    .ilike('email', email.trim())
    .ilike('phone', `%${formatted}%`)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('fetchBookingsByContact:', error.message);
    return [];
  }
  return (data ?? []) as BookingRow[];
}

// ── Admin: booking stats ──────────────────────────────────────────────────────

export interface BookingStats {
  total: number;
  newCount: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  emergency: number;
  newLeads: number;
  emailSent: number;
  emailPending: number;
  membershipInterested: number;
  expertRequestedCount: number;
}

export async function fetchBookingStats(): Promise<BookingStats> {
  const empty: BookingStats = {
    total: 0, newCount: 0, scheduled: 0, inProgress: 0, completed: 0, cancelled: 0, emergency: 0,
    newLeads: 0, emailSent: 0, emailPending: 0, membershipInterested: 0, expertRequestedCount: 0,
  };
  if (!isSupabaseConfigured() || !supabase) return empty;
  const { data } = await supabase
    .from('service_requests')
    .select('status, urgency, admin_status, email_sent, membership_interest, expert_slug');
  const rows = (data ?? []) as {
    status: string;
    urgency: string | null;
    admin_status: string | null;
    email_sent: boolean | null;
    membership_interest: boolean | null;
    expert_slug: string | null;
  }[];
  return {
    total: rows.length,
    newCount: rows.filter((r) => r.status === 'New').length,
    scheduled: rows.filter((r) => r.status === 'Scheduled').length,
    inProgress: rows.filter((r) => r.status === 'In Progress').length,
    completed: rows.filter((r) => r.status === 'Completed').length,
    cancelled: rows.filter((r) => r.status === 'Cancelled').length,
    emergency: rows.filter((r) => r.urgency === 'Emergency').length,
    newLeads: rows.filter((r) => r.admin_status === 'New Lead').length,
    emailSent: rows.filter((r) => r.email_sent === true).length,
    emailPending: rows.filter((r) => !r.email_sent).length,
    membershipInterested: rows.filter((r) => r.membership_interest === true).length,
    expertRequestedCount: rows.filter((r) => Boolean(r.expert_slug)).length,
  };
}
