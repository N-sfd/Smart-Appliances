import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export interface ServiceCategoryRow {
  id: string;
  name: string;
}

export interface ServiceRow {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  service_type: string;
  description: string | null;
  is_emergency: boolean;
  is_active: boolean;
  display_order?: number;
  category_name?: string;
}

export async function fetchServices(): Promise<ServiceRow[]> {
  if (!isSupabaseConfigured() || !supabase) return [];
  const { data, error } = await supabase
    .from('services')
    .select('*, service_categories(name)')
    .order('name');
  if (error) {
    console.error('fetchServices:', error.message);
    return [];
  }
  return ((data ?? []) as (ServiceRow & { service_categories: { name: string } | null })[]).map((r) => ({
    ...r,
    category_name: r.service_categories?.name ?? '—',
  }));
}

export async function fetchServiceCategories(): Promise<ServiceCategoryRow[]> {
  if (!isSupabaseConfigured() || !supabase) return [];
  const { data, error } = await supabase.from('service_categories').select('*').order('name');
  if (error) {
    console.error('fetchServiceCategories:', error.message);
    return [];
  }
  return (data ?? []) as ServiceCategoryRow[];
}

export async function createService(
  input: Omit<ServiceRow, 'id' | 'category_name'>,
): Promise<{ id: string | null; error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) return { id: null, error: 'Supabase not configured' };
  const { data, error } = await supabase.from('services').insert([input]).select('id').single();
  if (error) return { id: null, error: error.message };
  return { id: (data as { id: string }).id, error: null };
}

export async function updateService(
  id: string,
  patch: Partial<Omit<ServiceRow, 'id' | 'category_name'>>,
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) return { error: 'Supabase not configured' };
  const { error } = await supabase.from('services').update(patch).eq('id', id);
  return { error: error?.message ?? null };
}
