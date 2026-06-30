/**
 * Broad ZIP-range lookup for the regional service area (MD, VA, WV, PA, DE, DC).
 * This is a coarse range check by state/region — it does not guarantee every
 * ZIP code within a range is actually serviceable. Order matters: ranges below
 * overlap at their edges, and the first matching range wins, which is what
 * keeps DC/MD/VA boundaries (and PA/DE/WV) from double-matching.
 */
export const serviceZipRanges = [
  { label: 'Washington DC', min: 20000, max: 20599 },
  { label: 'Maryland', min: 20600, max: 21999 },
  { label: 'Virginia', min: 20100, max: 24699 },
  { label: 'West Virginia', min: 24700, max: 26899 },
  { label: 'Pennsylvania', min: 15000, max: 19699 },
  { label: 'Delaware', min: 19700, max: 19999 },
];

export function getServiceAreaByZip(zip: string): string | null {
  const cleanZip = zip.trim().slice(0, 5);

  if (!/^\d{5}$/.test(cleanZip)) {
    return null;
  }

  const zipNumber = Number(cleanZip);

  const match = serviceZipRanges.find(
    (area) => zipNumber >= area.min && zipNumber <= area.max
  );

  return match ? match.label : null;
}

export function isZipInServiceArea(zip: string): boolean {
  return getServiceAreaByZip(zip) !== null;
}
