import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { DbExpert, DbExpertService, DbExpertReview } from '../types/admin';
import { Expert as LocalExpert, getExpertBySlug, GALLERY_CATEGORIES } from '../data/experts';

// ── Public reads (used by ExpertsPage / ExpertProfilePage with local fallback) ─

export async function fetchActiveExpertsWithDetails(): Promise<LocalExpert[] | null> {
  if (!isSupabaseConfigured() || !supabase) return null;
  const { data: experts, error } = await supabase
    .from('experts')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error || !experts || experts.length === 0) return null;

  const ids = (experts as DbExpert[]).map((e) => e.id);
  const [{ data: services }, { data: reviews }] = await Promise.all([
    supabase.from('expert_services').select('*').in('expert_id', ids).order('display_order', { ascending: true }),
    supabase.from('expert_reviews').select('*').in('expert_id', ids).order('review_date', { ascending: false }),
  ]);

  return (experts as DbExpert[]).map((e) => mapToLocalExpert(
    e,
    ((services ?? []) as DbExpertService[]).filter((s) => s.expert_id === e.id),
    ((reviews ?? []) as DbExpertReview[]).filter((r) => r.expert_id === e.id),
  ));
}

export async function fetchActiveExpertBySlug(slug: string): Promise<LocalExpert | null> {
  if (!isSupabaseConfigured() || !supabase) return null;
  const { data: expert, error } = await supabase
    .from('experts')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  if (error || !expert) return null;

  const [{ data: services }, { data: reviews }] = await Promise.all([
    supabase.from('expert_services').select('*').eq('expert_id', (expert as DbExpert).id).order('display_order', { ascending: true }),
    supabase.from('expert_reviews').select('*').eq('expert_id', (expert as DbExpert).id).order('review_date', { ascending: false }),
  ]);

  return mapToLocalExpert(expert as DbExpert, (services ?? []) as DbExpertService[], (reviews ?? []) as DbExpertReview[]);
}

// DB rows created via the admin UI may not have every field filled in yet (avatar,
// gallery, sample services/reviews). Fall back to the matching built-in local expert
// (by slug) for any field the DB leaves empty, so the public page never looks blank —
// admin-entered content still always wins when present.
function mapToLocalExpert(e: DbExpert, services: DbExpertService[], reviews: DbExpertReview[]): LocalExpert {
  const local = getExpertBySlug(e.slug);

  const mappedServices = services.map((s) => ({
    name: s.service_name,
    serviceCategory: (s.service_category as LocalExpert['services'][number]['serviceCategory']) ?? null,
    isDiagnostic: s.quote_required,
  }));

  const mappedReviews = reviews.map((r) => ({
    firstName: r.customer_first_name ?? '',
    rating: r.rating ?? 5,
    date: r.review_date ?? '',
    serviceType: r.service_type ?? '',
    text: r.review_text ?? '',
  }));

  return {
    slug: e.slug,
    name: e.name,
    title: e.title || local?.title || '',
    rating: e.rating,
    reviewCount: e.review_count,
    jobsCompleted: e.jobs_completed || local?.jobsCompleted || '',
    responseTime: e.response_time ?? local?.responseTime,
    serviceAreas: e.service_areas?.length ? e.service_areas : local?.serviceAreas ?? [],
    specialties: e.specialties?.length ? e.specialties : local?.specialties ?? [],
    about: e.bio || local?.about || '',
    services: mappedServices.length > 0 ? mappedServices : local?.services ?? [],
    reviews: mappedReviews.length > 0 ? mappedReviews : local?.reviews ?? [],
    galleryCategories: local?.galleryCategories ?? GALLERY_CATEGORIES,
    avatarUrl: e.avatar_url || local?.avatarUrl,
  };
}

// ── Admin reads/writes ─────────────────────────────────────────────────────────

export async function fetchAllExperts(): Promise<DbExpert[]> {
  if (!isSupabaseConfigured() || !supabase) return [];
  const { data, error } = await supabase.from('experts').select('*').order('display_order', { ascending: true });
  if (error) {
    console.error('fetchAllExperts:', error.message);
    return [];
  }
  return (data ?? []) as DbExpert[];
}

export async function fetchExpertById(id: string): Promise<DbExpert | null> {
  if (!isSupabaseConfigured() || !supabase) return null;
  const { data, error } = await supabase.from('experts').select('*').eq('id', id).maybeSingle();
  if (error) {
    console.error('fetchExpertById:', error.message);
    return null;
  }
  return data as DbExpert | null;
}

export async function fetchActiveExpertsRaw(): Promise<DbExpert[]> {
  if (!isSupabaseConfigured() || !supabase) return [];
  const { data, error } = await supabase.from('experts').select('*').eq('is_active', true).order('name');
  if (error) {
    console.error('fetchActiveExpertsRaw:', error.message);
    return [];
  }
  return (data ?? []) as DbExpert[];
}

export async function createExpert(
  input: Omit<DbExpert, 'id' | 'created_at' | 'updated_at'>,
): Promise<{ id: string | null; error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) return { id: null, error: 'Supabase not configured' };
  const { data, error } = await supabase.from('experts').insert([input]).select('id').single();
  if (error) return { id: null, error: error.message };
  return { id: (data as { id: string }).id, error: null };
}

export async function updateExpert(
  id: string,
  patch: Partial<Omit<DbExpert, 'id' | 'created_at'>>,
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) return { error: 'Supabase not configured' };
  const { error } = await supabase
    .from('experts')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id);
  return { error: error?.message ?? null };
}

export async function deleteExpert(id: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) return { error: 'Supabase not configured' };
  const { error } = await supabase.from('experts').delete().eq('id', id);
  return { error: error?.message ?? null };
}

// ── Expert services ────────────────────────────────────────────────────────────

export async function fetchExpertServices(expertId: string): Promise<DbExpertService[]> {
  if (!isSupabaseConfigured() || !supabase) return [];
  const { data, error } = await supabase
    .from('expert_services')
    .select('*')
    .eq('expert_id', expertId)
    .order('display_order', { ascending: true });
  if (error) {
    console.error('fetchExpertServices:', error.message);
    return [];
  }
  return (data ?? []) as DbExpertService[];
}

export async function upsertExpertService(
  service: Partial<DbExpertService> & { expert_id: string; service_name: string },
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) return { error: 'Supabase not configured' };
  const { error } = await supabase.from('expert_services').upsert([service]);
  return { error: error?.message ?? null };
}

export async function deleteExpertService(id: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) return { error: 'Supabase not configured' };
  const { error } = await supabase.from('expert_services').delete().eq('id', id);
  return { error: error?.message ?? null };
}

// ── Expert reviews ──────────────────────────────────────────────────────────────

export async function fetchExpertReviews(expertId: string): Promise<DbExpertReview[]> {
  if (!isSupabaseConfigured() || !supabase) return [];
  const { data, error } = await supabase
    .from('expert_reviews')
    .select('*')
    .eq('expert_id', expertId)
    .order('review_date', { ascending: false });
  if (error) {
    console.error('fetchExpertReviews:', error.message);
    return [];
  }
  return (data ?? []) as DbExpertReview[];
}

export async function upsertExpertReview(
  review: Partial<DbExpertReview> & { expert_id: string },
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) return { error: 'Supabase not configured' };
  const { error } = await supabase.from('expert_reviews').upsert([review]);
  return { error: error?.message ?? null };
}

export async function deleteExpertReview(id: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) return { error: 'Supabase not configured' };
  const { error } = await supabase.from('expert_reviews').delete().eq('id', id);
  return { error: error?.message ?? null };
}
