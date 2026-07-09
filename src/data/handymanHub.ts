const BASE = '/images/services/handyman';

/** Per-service photography for Handyman hub cards and detail panels. */
export const HANDYMAN_SERVICE_IMAGES: Record<string, string> = {
  'general-handyman-service': `${BASE}/handyman-general.webp`,
  'general-handyman': `${BASE}/handyman-general.webp`,
  'furniture-assembly': `${BASE}/handyman-furniture-assembly.webp`,
  'wall-hanging': `${BASE}/handyman-wall-hanging.webp`,
  'shelf-installation': `${BASE}/handyman-shelf-installation.webp`,
  'drywall-repair': `${BASE}/handyman-drywall-repair.webp`,
  'interior-painting': `${BASE}/handyman-interior-painting.webp`,
  'curtain-rod-installation': `${BASE}/handyman-curtain-rod.webp`,
  'minor-home-repairs': `${BASE}/handyman-minor-repairs.webp`,
};

export function getHandymanServiceImage(serviceId: string): string | undefined {
  return HANDYMAN_SERVICE_IMAGES[serviceId];
}
