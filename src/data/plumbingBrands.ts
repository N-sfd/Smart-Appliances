import type { LogoBrand } from './logoBrandTypes';
import { resolveLogoBrands } from './logoBrandTypes';

const BASE = '/images/brands/plumbing';

/** Plumbing fixture & water system brands — colored logos for marquee on /services/plumbing */
export const plumbingBrands: LogoBrand[] = [
  { name: 'Moen', displayName: 'Moen', logo: `${BASE}/moen.svg` },
  { name: 'Delta', displayName: 'Delta', logo: `${BASE}/delta.svg` },
  { name: 'Kohler', displayName: 'Kohler', logo: `${BASE}/kohler.svg` },
  { name: 'Rheem', displayName: 'Rheem', logo: `${BASE}/rheem.svg` },
  { name: 'AO Smith', displayName: 'AO Smith', logo: `${BASE}/ao-smith.svg` },
  { name: 'InSinkErator', displayName: 'InSinkErator', logo: `${BASE}/insinkerator.svg` },
];

export function resolvePlumbingBrands(names: string[]): LogoBrand[] {
  return resolveLogoBrands(names, plumbingBrands);
}
