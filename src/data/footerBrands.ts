export interface BrandWeService {
  /** Accessible name / alt text */
  name: string;
  /** SVG or WebP path; omit for text-only fallback */
  logo?: string;
}

/** Twelve appliance brands shown in the footer brands strip. */
export const BRANDS_WE_SERVICE_FOOTER: BrandWeService[] = [
  { name: 'Whirlpool', logo: '/images/brands/whirlpool.svg' },
  { name: 'GE Appliances', logo: '/images/brands/ge.svg' },
  { name: 'Samsung', logo: '/images/brands/samsung.svg' },
  { name: 'LG', logo: '/images/brands/lg.svg' },
  { name: 'Maytag', logo: '/images/brands/maytag.svg' },
  { name: 'KitchenAid', logo: '/images/brands/kitchenaid.svg' },
  { name: 'Frigidaire', logo: '/images/brands/frigidaire.svg' },
  { name: 'Bosch', logo: '/images/brands/bosch.svg' },
  { name: 'Electrolux', logo: '/images/brands/electrolux.svg' },
  { name: 'Amana', logo: '/images/brands/amana.svg' },
  { name: 'Kenmore', logo: '/images/brands/kenmore.svg' },
  { name: 'Miele' },
];
