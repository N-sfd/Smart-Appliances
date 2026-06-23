import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { MembershipLead } from '../types/admin';

interface MembershipRow {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  selected_membership_plan: string | null;
  request_number: string | null;
  created_at?: string;
  membership_status: string | null;
}

export async function fetchMembershipLeads(): Promise<MembershipLead[]> {
  if (!isSupabaseConfigured() || !supabase) return [];
  const { data, error } = await supabase
    .from('service_requests')
    .select('id, customer_name, email, phone, selected_membership_plan, request_number, created_at, membership_status')
    .or('membership_interest.eq.true,selected_membership_plan.not.is.null')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('fetchMembershipLeads:', error.message);
    return [];
  }
  return ((data ?? []) as MembershipRow[]).map((r) => ({
    ...r,
    membership_status: r.membership_status ?? 'Interested',
  }));
}

export async function updateMembershipStatus(
  id: string,
  status: string,
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) return { error: 'Supabase not configured' };
  const { error } = await supabase
    .from('service_requests')
    .update({ membership_status: status, updated_at: new Date().toISOString() })
    .eq('id', id);
  return { error: error?.message ?? null };
}
