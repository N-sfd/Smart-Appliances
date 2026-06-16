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
  brand?: string | null;
  model_number?: string | null;
  issue_description?: string | null;

  urgency?: string | null;
  preferred_date?: string | null;
  preferred_time?: string | null;

  status: string;
  created_at?: string;
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

// ── Insert booking ────────────────────────────────────────────────────────────

export async function insertBooking(
  row: BookingRow,
): Promise<{ id: string | null; error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) {
    console.error('[Booking] insertBooking: Supabase not configured — REACT_APP_SUPABASE_URL / REACT_APP_SUPABASE_ANON_KEY may be missing');
    return { id: null, error: 'Supabase not configured' };
  }
  console.log('[Booking] FormData', row);
  const { data, error } = await supabase
    .from('service_requests')
    .insert([row])
    .select('id')
    .single();
  if (error) {
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
  email: string;
  customer_name: string;
  phone: string;
  zip_code: string;
  booking_count: number;
  last_booking: string;
}

export async function fetchCustomers(): Promise<CustomerSummary[]> {
  if (!isSupabaseConfigured() || !supabase) return [];
  const { data, error } = await supabase
    .from('service_requests')
    .select('email, customer_name, phone, zip_code, created_at')
    .order('created_at', { ascending: false });
  if (error) return [];

  const map = new Map<string, CustomerSummary>();
  for (const row of (data ?? []) as { email: string; customer_name: string; phone: string; zip_code: string; created_at: string }[]) {
    if (map.has(row.email)) {
      map.get(row.email)!.booking_count++;
    } else {
      map.set(row.email, {
        email: row.email,
        customer_name: row.customer_name,
        phone: row.phone,
        zip_code: row.zip_code,
        booking_count: 1,
        last_booking: row.created_at,
      });
    }
  }
  return Array.from(map.values());
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
}

export async function fetchBookingStats(): Promise<BookingStats> {
  if (!isSupabaseConfigured() || !supabase) {
    return { total: 0, newCount: 0, scheduled: 0, inProgress: 0, completed: 0, cancelled: 0, emergency: 0 };
  }
  const { data } = await supabase.from('service_requests').select('status, urgency');
  const rows = (data ?? []) as { status: string; urgency: string | null }[];
  return {
    total: rows.length,
    newCount: rows.filter((r) => r.status === 'New').length,
    scheduled: rows.filter((r) => r.status === 'Scheduled').length,
    inProgress: rows.filter((r) => r.status === 'In Progress').length,
    completed: rows.filter((r) => r.status === 'Completed').length,
    cancelled: rows.filter((r) => r.status === 'Cancelled').length,
    emergency: rows.filter((r) => r.urgency === 'Emergency').length,
  };
}
