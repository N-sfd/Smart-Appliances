/**
 * Broad ZIP-range lookup for the regional service area (MD, VA, WV, PA, DE, DC).
 * This is a coarse range check by state/region — it does not guarantee every
 * ZIP code within a range is actually serviceable.
 *
 * DC and Northern Virginia ZIPs interleave in the 200xx–205xx band (e.g. 20001
 * is DC, but 20176 is Leesburg, VA), so a single min/max pair per state can't
 * represent the real boundary — a state can appear more than once below.
 * `serviceZipRanges.find(...)` returns the first match, so within any given
 * state's entries, keep the narrower/more specific range first.
 */
export interface ServiceZipRange {
  label: string;
  code: 'DC' | 'MD' | 'VA' | 'WV' | 'PA' | 'DE';
  min: number;
  max: number;
}

export const serviceZipRanges: ServiceZipRange[] = [
  { label: 'Washington DC', code: 'DC', min: 20000, max: 20099 },
  { label: 'Virginia', code: 'VA', min: 20100, max: 20199 },
  { label: 'Washington DC', code: 'DC', min: 20200, max: 20499 },
  { label: 'Virginia', code: 'VA', min: 20500, max: 20599 },
  { label: 'Maryland', code: 'MD', min: 20600, max: 21999 },
  { label: 'Virginia', code: 'VA', min: 22000, max: 24699 },
  { label: 'West Virginia', code: 'WV', min: 24700, max: 26899 },
  { label: 'Pennsylvania', code: 'PA', min: 15000, max: 19699 },
  { label: 'Delaware', code: 'DE', min: 19700, max: 19999 },
];

/** Returns the matching service-area range (label + state code) for a ZIP, or null. */
export function getServiceAreaByZip(zip: string): ServiceZipRange | null {
  const cleanZip = zip.trim().slice(0, 5);

  if (!/^\d{5}$/.test(cleanZip)) {
    return null;
  }

  const zipNumber = Number(cleanZip);

  const match = serviceZipRanges.find(
    (area) => zipNumber >= area.min && zipNumber <= area.max
  );

  return match ?? null;
}

export function isZipInServiceArea(zip: string): boolean {
  return getServiceAreaByZip(zip) !== null;
}
