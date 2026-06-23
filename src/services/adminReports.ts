import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface ReportRow {
  status: string;
  service_category: string | null;
  urgency: string | null;
  email_sent: boolean | null;
  membership_interest: boolean | null;
  expert_name: string | null;
  admin_status: string | null;
  created_at: string;
}

export interface AdminReports {
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  byUrgency: Record<string, number>;
  emailSent: number;
  emailPending: number;
  membershipInterested: number;
  topExperts: { name: string; count: number }[];
  leadsByDay: { day: string; count: number }[];
  completedByMonth: { month: string; count: number }[];
}

function tally<T extends string>(rows: T[]): Record<string, number> {
  return rows.reduce((acc, key) => {
    const k = key || 'Unknown';
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

export async function fetchAdminReports(): Promise<AdminReports> {
  const empty: AdminReports = {
    byStatus: {}, byCategory: {}, byUrgency: {}, emailSent: 0, emailPending: 0,
    membershipInterested: 0, topExperts: [], leadsByDay: [], completedByMonth: [],
  };
  if (!isSupabaseConfigured() || !supabase) return empty;

  const { data, error } = await supabase
    .from('service_requests')
    .select('status, service_category, urgency, email_sent, membership_interest, expert_name, admin_status, created_at');
  if (error || !data) {
    console.error('fetchAdminReports:', error?.message);
    return empty;
  }
  const rows = data as ReportRow[];

  const expertCounts = tally(rows.map((r) => r.expert_name ?? '').filter(Boolean));
  const topExperts = Object.entries(expertCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  const newLeadRows = rows.filter((r) => r.admin_status === 'New Lead' || r.admin_status === 'New');
  const leadsByDayMap = tally(newLeadRows.map((r) => new Date(r.created_at).toLocaleDateString()));
  const leadsByDay = Object.entries(leadsByDayMap).map(([day, count]) => ({ day, count }));

  const completedRows = rows.filter((r) => r.status === 'Completed');
  const completedByMonthMap = tally(
    completedRows.map((r) => new Date(r.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })),
  );
  const completedByMonth = Object.entries(completedByMonthMap).map(([month, count]) => ({ month, count }));

  return {
    byStatus: tally(rows.map((r) => r.status)),
    byCategory: tally(rows.map((r) => r.service_category ?? '')),
    byUrgency: tally(rows.map((r) => r.urgency ?? '')),
    emailSent: rows.filter((r) => r.email_sent === true).length,
    emailPending: rows.filter((r) => !r.email_sent).length,
    membershipInterested: rows.filter((r) => r.membership_interest === true).length,
    topExperts,
    leadsByDay,
    completedByMonth,
  };
}
