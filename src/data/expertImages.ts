/** Unique professional technician portraits, one per expert (face-centered for circular avatars). */
export const EXPERT_IMAGE_BY_SLUG: Record<string, string> = {
  'smart-appliances-team': '/images/experts/smart-appliances-team.webp',
  'hvac-repair-specialist': '/images/experts/hvac-comfort-expert.webp',
  'appliance-repair-specialist': '/images/experts/appliance-care-expert.webp',
  'plumbing-repair-specialist': '/images/experts/plumbing-service-expert.webp',
  'electrical-service-specialist': '/images/experts/electrical-smart-home-expert.webp',
  'garage-door-specialist': '/images/experts/garage-door-expert.webp',
};

/** Fine-tune circular crop so faces stay centered. Portraits are head-and-shoulders framed. */
export const EXPERT_AVATAR_OBJECT_POSITION: Record<string, string> = {
  'smart-appliances-team': 'center 25%',
  'hvac-repair-specialist': 'center 30%',
  'appliance-repair-specialist': 'center 28%',
  'plumbing-repair-specialist': 'center 25%',
  'electrical-service-specialist': 'center 30%',
  'garage-door-specialist': 'center 28%',
};

export const GALLERY_CATEGORY_IMAGES: Record<string, string> = {
  'Appliance Care': '/images/services/washer-repair.webp',
  'HVAC Services': '/images/services/hvac-service.webp',
  Plumbing: '/images/services/plumbing-service.webp',
  Electrical: '/images/services/electrical/hero.webp',
  'Smart Home': '/images/services/smart-home/smart-home-hero.webp',
  'Garage Door': '/images/services/garage-door/hero.webp',
};

/** Old placeholder icon avatars (team.svg, hvac-specialist.svg, etc.) — never use these, but real
 *  photos placed at /images/experts/<slug>.webp are fine and should pass through. */
const LEGACY_SVG_PREFIX = '/images/experts/';

/** Lifestyle/stock images that crop poorly in circular avatars — never use for profiles. */
const BLOCKED_AVATAR_PATHS = new Set([
  '/images/services/hvac/ac-repair.jpg',
  '/images/services/plumbing/trust-technician.webp',
  '/images/services/plumbing/trust-technician.png',
  '/images/services/garage-door/tech-1.webp',
  '/images/services/garage-door/tech-1.jpg',
]);

export function getExpertInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function isBlockedAvatarPath(path: string): boolean {
  return (path.startsWith(LEGACY_SVG_PREFIX) && path.endsWith('.svg')) || BLOCKED_AVATAR_PATHS.has(path);
}

/** Resolve a usable image URL — ignores legacy SVG and poor avatar crops. */
export function getExpertImageUrl(slug: string, ...candidates: (string | null | undefined)[]): string {
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (isBlockedAvatarPath(candidate)) continue;
    return candidate;
  }
  return EXPERT_IMAGE_BY_SLUG[slug] ?? '/images/experts/smart-appliances-team.webp';
}

export function getExpertAvatarObjectPosition(slug: string): string {
  return EXPERT_AVATAR_OBJECT_POSITION[slug] ?? 'center 25%';
}
