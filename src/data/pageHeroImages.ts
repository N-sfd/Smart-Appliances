/** Unique hero photography for trust-focused pages — never reuse across hero sections. */
export interface PageHeroPhoto {
  src: string;
  alt: string;
  objectPosition?: string;
  aspectRatio?: '4 / 3' | '1 / 1' | '16 / 9';
}

/**
 * Approved local assets only. Each path is dedicated to one page hero.
 * Avoid: hero-appliance-technician.webp (Home), hero-technician.jpg (About mission).
 */
export const PAGE_HERO_PHOTOS = {
  about: {
    src: '/images/experts/smart-appliances-team.png',
    alt: 'Smart Appliances home service team ready to help local homeowners',
    objectPosition: 'center 22%',
    aspectRatio: '4 / 3',
  },
  contact: {
    src: '/images/services/plumbing/trust-technician.webp',
    alt: 'Smart Appliances technician providing professional in-home service consultation',
    objectPosition: 'center 20%',
    aspectRatio: '4 / 3',
  },
  experts: {
    src: '/images/services/hero-technician.webp',
    alt: 'Licensed Smart Appliances technicians providing professional in-home service',
    objectPosition: 'center 28%',
    aspectRatio: '16 / 9',
  },
} as const satisfies Record<string, PageHeroPhoto>;

/** Paths reserved for illustration heroes (no raster file — SVG component). */
export const PAGE_HERO_ILLUSTRATIONS = {
  membership: 'membership',
  pricing: 'pricing',
  resources: 'resources',
} as const;
