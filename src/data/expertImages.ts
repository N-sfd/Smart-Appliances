/** Professional technician photos suited for circular expert avatars. */
export const EXPERT_IMAGE_BY_SLUG: Record<string, string> = {
  'smart-appliances-team': '/images/services/appliances/technician-default.webp',
  'hvac-repair-specialist': '/images/services/hvac/emergency-hvac-service.png',
  'appliance-repair-specialist': '/images/services/appliances/technician-default.webp',
  'plumbing-repair-specialist': '/images/services/hero-technician.jpg',
  'electrical-service-specialist': '/images/services/smart-home/hero-installer.webp',
  'garage-door-specialist': '/images/services/hero-technician.jpg',
};

/** Fine-tune circular crop so faces stay centered (not feet/hands). */
export const EXPERT_AVATAR_OBJECT_POSITION: Record<string, string> = {
  'smart-appliances-team': 'center 18%',
  'hvac-repair-specialist': '62% 28%',
  'appliance-repair-specialist': 'center 18%',
  'plumbing-repair-specialist': '42% 22%',
  'electrical-service-specialist': 'center 22%',
  'garage-door-specialist': '42% 22%',
};

export const GALLERY_CATEGORY_IMAGES: Record<string, string> = {
  'Appliance Care': '/images/services/washer-repair.jpg',
  'HVAC Services': '/images/services/hvac-service.jpg',
  Plumbing: '/images/services/plumbing-service.jpg',
  Electrical: '/images/services/electrical/hero.jpg',
  'Smart Home': '/images/services/smart-home/hero.jpg',
  'Garage Door': '/images/services/garage-door/hero.jpg',
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
  return EXPERT_IMAGE_BY_SLUG[slug] ?? '/images/services/appliances/technician-default.webp';
}

export function getExpertAvatarObjectPosition(slug: string): string {
  return EXPERT_AVATAR_OBJECT_POSITION[slug] ?? 'center 25%';
}
