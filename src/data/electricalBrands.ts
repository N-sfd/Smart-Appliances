import type { LogoBrand } from './logoBrandTypes';
import { resolveLogoBrands } from './logoBrandTypes';

const BASE = '/images/brands/electrical';

/** Electrical fixture & device brands — colored logos for marquee on /services/electrical */
export const electricalBrands: LogoBrand[] = [
  { name: 'Leviton', displayName: 'Leviton', logo: `${BASE}/leviton.svg` },
  { name: 'Lutron', displayName: 'Lutron', logo: `${BASE}/lutron.svg` },
  { name: 'GE Lighting', displayName: 'GE Lighting', logo: `${BASE}/ge-lighting.svg` },
  { name: 'Kasa', displayName: 'Kasa', logo: `${BASE}/kasa.svg` },
  { name: 'TP-Link', displayName: 'TP-Link', logo: `${BASE}/tp-link.svg` },
  { name: 'Eaton', displayName: 'Eaton', logo: `${BASE}/eaton.svg` },
  { name: 'Square D', displayName: 'Square D', logo: `${BASE}/square-d.svg` },
  { name: 'Legrand', displayName: 'Legrand', logo: `${BASE}/legrand.svg` },
];

export function resolveElectricalBrands(names: string[]): LogoBrand[] {
  return resolveLogoBrands(names, electricalBrands);
}
