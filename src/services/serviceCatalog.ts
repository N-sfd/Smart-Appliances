import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type { ServiceCategory, ServiceCatalogItem, ServiceQuestion } from '../types/services';
import {
  FALLBACK_CATEGORIES,
  getFallbackCategoryBySlug,
  getFallbackQuestionsForCategory,
  getFallbackQuestionsForService,
  getFallbackServiceBySlug,
  getFallbackServicesByCategorySlug,
} from '../data/serviceCatalogFallback';

function sortByOrder<T extends { display_order: number }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => a.display_order - b.display_order);
}

export async function getActiveServiceCategories(): Promise<ServiceCategory[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return sortByOrder(FALLBACK_CATEGORIES.filter((c) => c.is_active));
  }
  const { data, error } = await supabase
    .from('service_categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error || !data?.length) {
    console.warn('getActiveServiceCategories: using fallback', error?.message);
    return sortByOrder(FALLBACK_CATEGORIES.filter((c) => c.is_active));
  }
  return data as ServiceCategory[];
}

export async function getServicesByCategorySlug(categorySlug: string): Promise<ServiceCatalogItem[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return getFallbackServicesByCategorySlug(categorySlug);
  }
  const { data: cat, error: catError } = await supabase
    .from('service_categories')
    .select('id')
    .eq('slug', categorySlug)
    .eq('is_active', true)
    .maybeSingle();
  if (catError || !cat) {
    console.warn('getServicesByCategorySlug: using fallback', catError?.message);
    return getFallbackServicesByCategorySlug(categorySlug);
  }
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('category_id', cat.id)
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error || !data) {
    console.warn('getServicesByCategorySlug: using fallback', error?.message);
    return getFallbackServicesByCategorySlug(categorySlug);
  }
  return data as ServiceCatalogItem[];
}

export async function getServiceBySlug(serviceSlug: string): Promise<ServiceCatalogItem | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return getFallbackServiceBySlug(serviceSlug);
  }
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', serviceSlug)
    .eq('is_active', true)
    .maybeSingle();
  if (error || !data) {
    console.warn('getServiceBySlug: using fallback', error?.message);
    return getFallbackServiceBySlug(serviceSlug);
  }
  return data as ServiceCatalogItem;
}

export async function getCategoryBySlug(categorySlug: string): Promise<ServiceCategory | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return getFallbackCategoryBySlug(categorySlug);
  }
  const { data, error } = await supabase
    .from('service_categories')
    .select('*')
    .eq('slug', categorySlug)
    .eq('is_active', true)
    .maybeSingle();
  if (error || !data) {
    console.warn('getCategoryBySlug: using fallback', error?.message);
    return getFallbackCategoryBySlug(categorySlug);
  }
  return data as ServiceCategory;
}

export async function getQuestionsForCategory(categoryId: string): Promise<ServiceQuestion[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return getFallbackQuestionsForCategory(categoryId);
  }
  const { data, error } = await supabase
    .from('service_questions')
    .select('*')
    .eq('category_id', categoryId)
    .is('service_id', null)
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error || !data?.length) {
    const fb = getFallbackQuestionsForCategory(categoryId);
    if (fb.length) return fb;
    console.warn('getQuestionsForCategory:', error?.message);
    return [];
  }
  return data as ServiceQuestion[];
}

export async function getQuestionsForService(serviceId: string): Promise<ServiceQuestion[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return getFallbackQuestionsForService(serviceId);
  }
  const { data, error } = await supabase
    .from('service_questions')
    .select('*')
    .eq('service_id', serviceId)
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error || !data?.length) {
    const fb = getFallbackQuestionsForService(serviceId);
    if (fb.length) return fb;
    return [];
  }
  return data as ServiceQuestion[];
}

export async function loadCatalogQuestions(
  categoryId: string,
  serviceId?: string | null,
): Promise<ServiceQuestion[]> {
  const [categoryQs, serviceQs] = await Promise.all([
    getQuestionsForCategory(categoryId),
    serviceId ? getQuestionsForService(serviceId) : Promise.resolve([]),
  ]);
  return sortByOrder([...categoryQs, ...serviceQs]);
}
