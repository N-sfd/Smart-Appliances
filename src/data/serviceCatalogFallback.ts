import type { ServiceCategory, ServiceCatalogItem, ServiceQuestion } from '../types/services';

const cat = (
  slug: string,
  name: string,
  display_order: number,
  description?: string,
): ServiceCategory => ({
  id: `fallback-cat-${slug}`,
  slug,
  name,
  description: description ?? null,
  icon_name: null,
  image_url: null,
  display_order,
  is_active: true,
});

const svc = (
  category_id: string,
  slug: string,
  name: string,
  service_type: string,
  starting_price: number,
  display_order: number,
  technician_skill_group: string,
  estimated_duration_minutes = 90,
): ServiceCatalogItem => ({
  id: `fallback-svc-${slug}`,
  category_id,
  slug,
  name,
  short_description: null,
  service_type,
  starting_price,
  pricing_type: 'starting_at',
  requires_quote: false,
  estimated_duration_minutes,
  technician_skill_group,
  image_url: null,
  display_order,
  is_active: true,
});

const q = (
  category_id: string,
  question_key: string,
  label: string,
  input_type: string,
  display_order: number,
  opts?: {
    options?: string[];
    is_required?: boolean;
    helper_text?: string;
    conditional_logic?: Record<string, unknown>;
  },
): ServiceQuestion => ({
  id: `fallback-q-${category_id}-${question_key}`,
  category_id,
  service_id: null,
  question_key,
  label,
  helper_text: opts?.helper_text ?? null,
  input_type,
  options: opts?.options ?? null,
  default_value: null,
  is_required: opts?.is_required ?? false,
  display_order,
  conditional_logic: opts?.conditional_logic ?? null,
  validation_rules: null,
  is_active: true,
});

export const FALLBACK_CATEGORIES: ServiceCategory[] = [
  cat('appliance-care', 'Appliance Care', 10),
  cat('hvac', 'HVAC', 20),
  cat('plumbing', 'Plumbing', 30),
  cat('electrical', 'Electrical', 40),
  cat('smart-home', 'Smart Home', 50, 'Smart device installation and setup.'),
  cat('garage-door', 'Garage Door', 60),
  cat('tv-mounting', 'TV Mounting', 70, 'Professional TV mounting and entertainment setup.'),
  cat('phone-repair', 'Phone Repair', 80, 'Mobile device diagnostics and repair.'),
  cat('handyman', 'Handyman', 90, 'General home repairs and assembly.'),
  cat('emergency', 'Emergency', 100),
];

const TV = 'fallback-cat-tv-mounting';
const PHONE = 'fallback-cat-phone-repair';
const HANDY = 'fallback-cat-handyman';
const SMART = 'fallback-cat-smart-home';

export const FALLBACK_SERVICES: ServiceCatalogItem[] = [
  svc(TV, 'standard-tv-mounting', 'Standard TV Mounting', 'Installation', 129, 10, 'tv-mounting'),
  svc(TV, 'large-tv-mounting', 'Large TV Mounting', 'Installation', 179, 20, 'tv-mounting', 120),
  svc(TV, 'tv-dismount', 'TV Dismount', 'Installation', 89, 30, 'tv-mounting', 60),
  svc(TV, 'tv-remount', 'TV Remount', 'Installation', 149, 40, 'tv-mounting', 120),
  svc(TV, 'wire-concealment', 'Wire Concealment', 'Installation', 99, 50, 'tv-mounting', 75),
  svc(TV, 'soundbar-installation', 'Soundbar Installation', 'Installation', 109, 60, 'tv-mounting', 60),
  svc(TV, 'media-device-setup', 'Media Device Setup', 'Installation', 89, 70, 'tv-mounting', 60),
  svc(PHONE, 'phone-screen-replacement', 'Screen Replacement', 'Repair', 149, 10, 'phone-repair'),
  svc(PHONE, 'phone-battery-replacement', 'Battery Replacement', 'Repair', 89, 20, 'phone-repair', 60),
  svc(PHONE, 'phone-charging-port-repair', 'Charging Port Repair', 'Repair', 99, 30, 'phone-repair', 75),
  svc(PHONE, 'phone-camera-repair', 'Camera Repair', 'Repair', 119, 40, 'phone-repair', 75),
  svc(PHONE, 'phone-speaker-microphone-repair', 'Speaker or Microphone Repair', 'Repair', 99, 50, 'phone-repair', 60),
  svc(PHONE, 'phone-button-repair', 'Button Repair', 'Repair', 89, 60, 'phone-repair', 60),
  svc(PHONE, 'phone-water-damage-assessment', 'Water-Damage Assessment', 'Repair', 49, 70, 'phone-repair', 45),
  svc(PHONE, 'phone-device-diagnostic', 'Device Diagnostic', 'Repair', 39, 80, 'phone-repair', 30),
  svc(HANDY, 'general-handyman-service', 'General Handyman Service', 'Maintenance', 99, 10, 'handyman', 120),
  svc(HANDY, 'furniture-assembly', 'Furniture Assembly', 'Installation', 109, 20, 'handyman', 120),
  svc(HANDY, 'wall-hanging', 'Wall Hanging', 'Installation', 89, 30, 'handyman', 60),
  svc(HANDY, 'shelf-installation', 'Shelf Installation', 'Installation', 99, 40, 'handyman', 75),
  svc(HANDY, 'drywall-repair', 'Drywall Repair', 'Repair', 119, 50, 'handyman', 90),
  svc(HANDY, 'interior-painting', 'Interior Painting', 'Maintenance', 149, 60, 'handyman', 180),
  svc(HANDY, 'curtain-rod-installation', 'Curtain Rod Installation', 'Installation', 79, 70, 'handyman', 60),
  svc(HANDY, 'minor-home-repairs', 'Minor Home Repairs', 'Repair', 99, 80, 'handyman', 90),
  svc(HANDY, 'appliance-installation-assistance', 'Appliance Installation Assistance', 'Installation', 109, 90, 'handyman', 90),
  svc(SMART, 'video-doorbell-installation', 'Video Doorbell Installation', 'Installation', 129, 10, 'smart-home'),
  svc(SMART, 'smart-thermostat-installation', 'Smart Thermostat Installation', 'Installation', 149, 20, 'smart-home'),
  svc(SMART, 'smart-lock-installation', 'Smart Lock Installation', 'Installation', 139, 30, 'smart-home'),
  svc(SMART, 'security-camera-installation', 'Security Camera Installation', 'Installation', 149, 40, 'smart-home', 120),
  svc(SMART, 'smart-switch-installation', 'Smart Switch Installation', 'Installation', 119, 50, 'smart-home', 75),
  svc(SMART, 'wifi-device-setup', 'Wi-Fi Device Setup', 'Installation', 89, 60, 'smart-home', 60),
  svc(SMART, 'smart-home-consultation', 'Smart Home Consultation', 'Maintenance', 79, 70, 'smart-home', 60),
  svc(SMART, 'device-app-setup', 'Device App Setup', 'Installation', 69, 80, 'smart-home', 45),
];

export const FALLBACK_QUESTIONS: ServiceQuestion[] = [
  q(TV, 'tvSize', 'TV size', 'select', 10, { is_required: true, options: ['32 inches or less', '33–44 inches', '45–54 inches', '55–65 inches', '66–75 inches', '76+ inches'] }),
  q(TV, 'wallType', 'Wall type', 'select', 20, { is_required: true, options: ['Drywall', 'Plaster', 'Brick', 'Concrete', 'Other'] }),
  q(TV, 'mountAvailable', 'Is the mount already purchased?', 'boolean', 30),
  q(TV, 'mountType', 'Mount type', 'select', 40, { options: ['Fixed', 'Tilt', 'Full motion', 'Not sure'] }),
  q(TV, 'wireConcealment', 'Wire concealment needed?', 'boolean', 50),
  q(TV, 'soundbarInstallation', 'Soundbar installation needed?', 'boolean', 60),
  q(TV, 'outletNearby', 'Existing outlet near installation?', 'boolean', 70),
  q(TV, 'numberOfTvs', 'Number of TVs', 'number', 90, { is_required: true }),
  q(PHONE, 'deviceBrand', 'Device brand', 'select', 10, { is_required: true, options: ['Apple', 'Samsung', 'Google', 'Motorola', 'LG', 'Other'] }),
  q(PHONE, 'deviceModel', 'Device model', 'text', 20, { is_required: true, helper_text: 'Example: iPhone 15, Galaxy S24' }),
  q(PHONE, 'repairType', 'Repair type', 'select', 30, { is_required: true, options: ['Screen replacement', 'Battery replacement', 'Charging port', 'Camera', 'Speaker/microphone', 'Button', 'Water damage', 'Diagnostic', 'Other'] }),
  q(PHONE, 'devicePowersOn', 'Does the device power on?', 'boolean', 40, { is_required: true }),
  q(PHONE, 'waterDamage', 'Water damage?', 'boolean', 50),
  q(HANDY, 'jobType', 'Job type', 'select', 10, { is_required: true, options: ['Furniture assembly', 'Wall hanging', 'Shelf installation', 'Drywall repair', 'Painting', 'Curtain rods', 'Minor repairs', 'Other'] }),
  q(HANDY, 'numberOfItems', 'Number of items', 'number', 20),
  q(HANDY, 'materialsProvidedByCustomer', 'Materials already purchased?', 'boolean', 40),
  q(HANDY, 'jobDescription', 'Detailed job description', 'textarea', 90, { is_required: true }),
  q(SMART, 'deviceType', 'Device type', 'select', 10, { is_required: true, options: ['Video doorbell', 'Smart thermostat', 'Smart lock', 'Security camera', 'Smart switch', 'Wi-Fi device', 'Hub', 'Other'] }),
  q(SMART, 'deviceAlreadyPurchased', 'Device already purchased?', 'boolean', 30, { is_required: true }),
  q(SMART, 'wifiAvailable', 'Wi-Fi available at install location?', 'boolean', 50, { is_required: true }),
  q(SMART, 'appSetupRequired', 'App setup required?', 'boolean', 60),
];

export function getFallbackCategoryBySlug(slug: string): ServiceCategory | null {
  return FALLBACK_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function getFallbackServicesByCategorySlug(slug: string): ServiceCatalogItem[] {
  const catRow = getFallbackCategoryBySlug(slug);
  if (!catRow) return [];
  return FALLBACK_SERVICES.filter((s) => s.category_id === catRow.id).sort((a, b) => a.display_order - b.display_order);
}

export function getFallbackServiceBySlug(serviceSlug: string): ServiceCatalogItem | null {
  return FALLBACK_SERVICES.find((s) => s.slug === serviceSlug) ?? null;
}

export function getFallbackQuestionsForCategory(categoryId: string): ServiceQuestion[] {
  return FALLBACK_QUESTIONS.filter((q) => q.category_id === categoryId && !q.service_id)
    .sort((a, b) => a.display_order - b.display_order);
}

export function getFallbackQuestionsForService(serviceId: string): ServiceQuestion[] {
  return FALLBACK_QUESTIONS.filter((q) => q.service_id === serviceId)
    .sort((a, b) => a.display_order - b.display_order);
}
