/** Local photos used for circular expert avatars when DB images are empty. */
export const EXPERT_IMAGE_BY_SLUG: Record<string, string> = {
  'smart-appliances-team': '/images/services/hero-appliance-technician.webp',
  'hvac-repair-specialist': '/images/services/hvac/ac-repair.jpg',
  'appliance-repair-specialist': '/images/services/appliances/technician-default.png',
  'plumbing-repair-specialist': '/images/services/plumbing/trust-technician.webp',
  'electrical-service-specialist': '/images/services/smart-home/hero-installer.webp',
  'garage-door-specialist': '/images/services/garage-door/tech-1.webp',
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
  return EXPERT_IMAGE_BY_SLUG[slug] ?? '/images/services/hero-appliance-technician.webp';
}
