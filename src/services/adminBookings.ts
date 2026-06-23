import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export {
  fetchAllBookings,
  updateAdminStatus,
  updateCustomerMessage,
  updateBookingStatus,
  fetchBookingNotes,
  insertBookingNote,
  fetchBookingStats,
  BOOKING_STATUSES,
  ADMIN_STATUSES,
} from '../lib/supabaseBookings';
export type { BookingRow, BookingNote, BookingStats, AdminStatus, BookingStatus } from '../lib/supabaseBookings';

// Sets the admin-assigned expert (service_requests.expert_id), distinct from
// expert_slug/expert_name which capture the customer's originally requested
// expert and are left untouched.
export async function assignExpert(
  bookingId: string,
  expertId: string | null,
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) return { error: 'Supabase not configured' };
  const { error } = await supabase
    .from('service_requests')
    .update({ expert_id: expertId, updated_at: new Date().toISOString() })
    .eq('id', bookingId);
  return { error: error?.message ?? null };
}

export async function deleteBooking(bookingId: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) return { error: 'Supabase not configured' };
  const { error } = await supabase.from('service_requests').delete().eq('id', bookingId);
  return { error: error?.message ?? null };
}
