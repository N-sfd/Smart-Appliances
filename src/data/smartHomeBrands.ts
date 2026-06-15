import type { LogoBrand } from './logoBrandTypes';
import { resolveLogoBrands } from './logoBrandTypes';

export type { LogoBrand } from './logoBrandTypes';

const BASE = '/images/brands/smart-home';

/** Smart home brands — colored logos for marquee on /services/smart-home */
export const smartHomeBrands: LogoBrand[] = [
  { name: 'Ring', displayName: 'Ring', logo: `${BASE}/ring.svg` },
  { name: 'Nest', displayName: 'Nest', logo: `${BASE}/nest.svg` },
  { name: 'Google Home', displayName: 'Google Home', logo: `${BASE}/google-home.svg` },
  { name: 'Alexa', displayName: 'Alexa', logo: `${BASE}/alexa.svg` },
  { name: 'Ecobee', displayName: 'Ecobee', logo: `${BASE}/ecobee.svg` },
  { name: 'Arlo', displayName: 'Arlo', logo: `${BASE}/arlo.svg` },
];

export function resolveSmartHomeBrands(names: string[]): LogoBrand[] {
  return resolveLogoBrands(names, smartHomeBrands);
}
