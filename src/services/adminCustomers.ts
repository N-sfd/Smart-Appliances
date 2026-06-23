import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { BookingRow } from '../lib/supabaseBookings';

export { fetchCustomers } from '../lib/supabaseBookings';
export type { CustomerSummary } from '../lib/supabaseBookings';

export async function fetchCustomerBookings(customerId: string): Promise<BookingRow[]> {
  if (!isSupabaseConfigured() || !supabase) return [];
  const { data, error } = await supabase
    .from('service_requests')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('fetchCustomerBookings:', error.message);
    return [];
  }
  return (data ?? []) as BookingRow[];
}
