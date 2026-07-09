export type PricingType =
  | 'starting_at'
  | 'fixed'
  | 'hourly'
  | 'quote_required'
  | 'inspection_required';

export type QuestionInputType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'number'
  | 'boolean'
  | 'date'
  | 'time'
  | 'file';

export interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  icon_name?: string | null;
  image_url?: string | null;
  display_order: number;
  is_active: boolean;
}

export interface ServiceCatalogItem {
  id: string;
  category_id: string;
  slug: string;
  name: string;
  short_description?: string | null;
  service_type?: string | null;
  starting_price?: number | null;
  pricing_type: PricingType | string;
  requires_quote: boolean;
  estimated_duration_minutes?: number | null;
  technician_skill_group?: string | null;
  image_url?: string | null;
  display_order: number;
  is_active: boolean;
}

export interface ConditionalLogic {
  field: string;
  operator: 'equals' | 'not_equals' | 'truthy' | 'falsy';
  value?: unknown;
}

export interface ServiceQuestion {
  id: string;
  category_id?: string | null;
  service_id?: string | null;
  question_key: string;
  label: string;
  helper_text?: string | null;
  input_type: QuestionInputType | string;
  options?: unknown[] | null;
  default_value?: unknown;
  is_required: boolean;
  display_order: number;
  conditional_logic?: ConditionalLogic | Record<string, unknown> | null;
  validation_rules?: Record<string, unknown> | null;
  is_active: boolean;
}

export interface CatalogBookingSelection {
  category: ServiceCategory | null;
  service: ServiceCatalogItem | null;
  answers: Record<string, unknown>;
}

/** Scheduler display label → catalog slug */
export const SCHEDULER_CATEGORY_SLUGS: Record<string, string> = {
  Appliance: 'appliance-care',
  HVAC: 'hvac',
  Plumbing: 'plumbing',
  Electrical: 'electrical',
  'Smart Home': 'smart-home',
  'Garage Door': 'garage-door',
  'TV Mounting': 'tv-mounting',
  'Phone Repair': 'phone-repair',
  Handyman: 'handyman',
  Emergency: 'emergency',
};

/** Categories that use the catalog service picker + dynamic questions as primary UI */
export const CATALOG_PRIMARY_CATEGORIES = new Set([
  'TV Mounting',
  'Phone Repair',
  'Handyman',
]);

/** Categories that also load catalog questions (alongside legacy fields) */
export const CATALOG_QUESTION_CATEGORIES = new Set([
  ...CATALOG_PRIMARY_CATEGORIES,
  'Smart Home',
]);
