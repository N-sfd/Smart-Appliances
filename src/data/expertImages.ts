/** Local service photos used for expert cards and profiles when DB images are empty. */
export const EXPERT_IMAGE_BY_SLUG: Record<string, string> = {
  'smart-appliances-team': '/images/services/hero-technician.jpg',
  'hvac-repair-specialist': '/images/services/hvac-service.jpg',
  'appliance-repair-specialist': '/images/services/refrigerator-repair.jpg',
  'plumbing-repair-specialist': '/images/services/plumbing-service.jpg',
  'electrical-service-specialist': '/images/services/electrical/hero.jpg',
  'garage-door-specialist': '/images/services/garage-door/hero.jpg',
};

export const GALLERY_CATEGORY_IMAGES: Record<string, string> = {
  'Appliance Care': '/images/services/washer-repair.jpg',
  'HVAC Services': '/images/services/hvac-service.jpg',
  Plumbing: '/images/services/plumbing-service.jpg',
  Electrical: '/images/services/electrical/hero.jpg',
  'Smart Home': '/images/services/smart-home/hero.jpg',
  'Garage Door': '/images/services/garage-door/hero.jpg',
};

const LEGACY_SVG_PREFIX = '/images/experts/';

export function getExpertInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/** Resolve a usable image URL — ignores legacy SVG placeholders. */
export function getExpertImageUrl(slug: string, ...candidates: (string | null | undefined)[]): string {
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (candidate.startsWith(LEGACY_SVG_PREFIX)) continue;
    return candidate;
  }
  return EXPERT_IMAGE_BY_SLUG[slug] ?? '/images/services/hero-technician.jpg';
}
