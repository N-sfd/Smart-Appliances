import { APPLIANCE_DEFAULT_IMAGE, APPLIANCE_SERVICE_IMAGES } from './applianceHub';
import { HVAC_SERVICE_IMAGES } from './hvacHub';
import { CATEGORY_HERO_IMAGE } from './expandedServiceImages';

const BASE = '/images/services';

/** Category fallback images when a service has no dedicated asset */
export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'appliance-repair': APPLIANCE_SERVICE_IMAGES['washer-dryer'],
  'appliance-installation': APPLIANCE_DEFAULT_IMAGE,
  'plumbing-services': `${BASE}/plumbing/leak-repair.png`,
  'smart-home-setup': `${BASE}/smart-home/hero-installer.webp`,
  'hvac-services': HVAC_SERVICE_IMAGES['ac-repair'],
  'electrical-services': `${BASE}/electrical-default.jpg`,
  handyman: CATEGORY_HERO_IMAGE.handyman,
  'tv-mounting': CATEGORY_HERO_IMAGE['tv-mounting'],
  'phone-repair': CATEGORY_HERO_IMAGE['phone-repair'],
};

export function getCategoryFallbackImage(categoryId: string): string {
  return CATEGORY_FALLBACK_IMAGES[categoryId] ?? APPLIANCE_DEFAULT_IMAGE;
}
