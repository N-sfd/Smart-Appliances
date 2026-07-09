import type { ServiceBrand } from './service-brands';
import { getFooterMarqueeBrands } from './service-brands';

export interface BrandWeService {
  /** Accessible name / alt text */
  name: string;
  /** SVG or WebP path; omit for text-only fallback */
  logo?: string;
}

function toFooterBrand(brand: ServiceBrand): BrandWeService {
  return { name: brand.name, logo: brand.logo };
}

/** Appliance brands shown in the global footer marquee — sourced from centralized catalog. */
export const BRANDS_WE_SERVICE_FOOTER: BrandWeService[] = getFooterMarqueeBrands().map(toFooterBrand);
