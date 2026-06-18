export const SERVICE_AREA_ZIP_MIN = 20001;
export const SERVICE_AREA_ZIP_MAX = 21930;

export const SERVICE_AREA_REGION_LABEL = 'Washington DC & Maryland Metro';

export const SERVICE_AREA_ZIP_HINT = `Service area: ZIP ${SERVICE_AREA_ZIP_MIN}–${SERVICE_AREA_ZIP_MAX}`;

/** Strip non-digits and cap at 5 characters for ZIP inputs */
export function normalizeZipInput(value: string): string {
  return value.replace(/\D/g, '').slice(0, 5);
}

export function isValidUsZip(zip: string): boolean {
  return /^\d{5}$/.test(zip.trim());
}

export function isInServiceArea(zip: string): boolean {
  if (!isValidUsZip(zip)) return false;
  const num = parseInt(zip.trim(), 10);
  return num >= SERVICE_AREA_ZIP_MIN && num <= SERVICE_AREA_ZIP_MAX;
}

/** States we serve in the DC metro service area */
export type MetroServiceState = 'MD' | 'DC' | 'VA' | 'PA' | 'WV';

const METRO_STATE_LABELS: Record<MetroServiceState, string> = {
  MD: 'Maryland',
  DC: 'Washington DC',
  VA: 'Virginia',
  PA: 'Pennsylvania',
  WV: 'West Virginia',
};

/** 3-digit ZIP prefix → state for our service area (20001–21930) */
const ZIP_PREFIX_TO_STATE: Record<string, MetroServiceState> = {
  '200': 'DC',
  '201': 'VA',
  '202': 'DC',
  '203': 'DC',
  '204': 'DC',
  '205': 'VA',
  '206': 'MD',
  '207': 'MD',
  '208': 'MD',
  '209': 'MD',
  '210': 'MD',
  '211': 'MD',
  '212': 'MD',
  '214': 'MD',
  '216': 'MD',
  '217': 'MD',
  '218': 'MD',
  '219': 'MD',
};

export function getMetroStateLabel(state: MetroServiceState): string {
  return METRO_STATE_LABELS[state];
}

/** Infer state from a valid in-service-area ZIP (e.g. 20166 → VA). */
export function inferStateFromZip(zip: string): MetroServiceState | '' {
  if (!isInServiceArea(zip)) return '';
  const prefix = zip.trim().slice(0, 3);
  return ZIP_PREFIX_TO_STATE[prefix] ?? '';
}

export function validateZipStateMatch(zip: string, state: string): string | null {
  const expected = inferStateFromZip(zip);
  if (!expected || !state) return null;
  if (state !== expected) {
    return `ZIP ${zip} is in ${METRO_STATE_LABELS[expected]}. Select ${expected}, not ${state}.`;
  }
  return null;
}

export interface ZipValidationOptions {
  /** When true (default), ZIP must fall within the service area */
  requireServiceArea?: boolean;
}

export interface ZipValidationResult {
  isValidFormat: boolean;
  isInServiceArea: boolean;
  /** Format valid and, when required, inside service area */
  isValid: boolean;
  message: string | null;
}

export function validateZipCode(
  zip: string,
  options: ZipValidationOptions = {},
): ZipValidationResult {
  const { requireServiceArea = true } = options;
  const normalized = zip.trim();

  if (!normalized) {
    return {
      isValidFormat: false,
      isInServiceArea: false,
      isValid: false,
      message: 'ZIP code is required',
    };
  }

  if (!isValidUsZip(normalized)) {
    return {
      isValidFormat: false,
      isInServiceArea: false,
      isValid: false,
      message: 'Enter a valid 5-digit ZIP code',
    };
  }

  const inArea = isInServiceArea(normalized);

  if (requireServiceArea && !inArea) {
    return {
      isValidFormat: true,
      isInServiceArea: false,
      isValid: false,
      message: `We don't currently service ZIP ${normalized}. We cover ${SERVICE_AREA_REGION_LABEL} (${SERVICE_AREA_ZIP_MIN}–${SERVICE_AREA_ZIP_MAX}).`,
    };
  }

  return {
    isValidFormat: true,
    isInServiceArea: inArea,
    isValid: true,
    message: null,
  };
}

/** Helper text for ZIP fields — pass touched=true after blur or submit attempt */
export function getZipFieldHelperText(
  zip: string,
  touched: boolean,
  options: ZipValidationOptions = {},
): string {
  if (!touched && !zip) return SERVICE_AREA_ZIP_HINT;

  const result = validateZipCode(zip, options);
  if (result.message) return result.message;

  if (result.isInServiceArea) return 'Great news — we service your area.';

  return SERVICE_AREA_ZIP_HINT;
}

export function isZipFieldError(zip: string, touched: boolean, options: ZipValidationOptions = {}): boolean {
  if (!touched && !zip) return false;
  return !validateZipCode(zip, options).isValid;
}

export interface ServiceAreaZipOption {
  zip: string;
  city: string;
  state: MetroServiceState;
}

/** Curated ZIP/city/state combos offered in the scheduler's location dropdowns */
export const SERVICE_AREA_ZIP_OPTIONS: ServiceAreaZipOption[] = [
  { zip: '20001', city: 'Washington DC', state: 'DC' },
  { zip: '21201', city: 'Baltimore', state: 'MD' },
  { zip: '20910', city: 'Silver Spring', state: 'MD' },
  { zip: '20850', city: 'Rockville', state: 'MD' },
  { zip: '20814', city: 'Bethesda', state: 'MD' },
  { zip: '21044', city: 'Columbia', state: 'MD' },
  { zip: '21401', city: 'Annapolis', state: 'MD' },
  { zip: '21701', city: 'Frederick', state: 'MD' },
  { zip: '20877', city: 'Gaithersburg', state: 'MD' },
  { zip: '21204', city: 'Towson', state: 'MD' },
  { zip: '21740', city: 'Hagerstown', state: 'MD' },
  { zip: '20601', city: 'Waldorf', state: 'MD' },
  { zip: '20164', city: 'Sterling', state: 'VA' },
  { zip: '20166', city: 'Sterling', state: 'VA' },
  { zip: '20147', city: 'Ashburn', state: 'VA' },
  { zip: '20175', city: 'Leesburg', state: 'VA' },
  { zip: '20170', city: 'Herndon', state: 'VA' },
  { zip: '20190', city: 'Reston', state: 'VA' },
  { zip: '20110', city: 'Manassas', state: 'VA' },
];

/** Match a ZIP to a curated dropdown row, or the closest same-prefix option in our service area. */
export function findServiceAreaZipOption(zip: string): ServiceAreaZipOption | undefined {
  const exact = SERVICE_AREA_ZIP_OPTIONS.find((o) => o.zip === zip);
  if (exact) return exact;
  if (!isInServiceArea(zip)) return undefined;
  const state = inferStateFromZip(zip);
  if (!state) return undefined;
  const prefix = zip.slice(0, 3);
  return SERVICE_AREA_ZIP_OPTIONS.find((o) => o.zip.startsWith(prefix) && o.state === state);
}

/** Options for the scheduler ZIP select — includes a valid prefilled ZIP even if not curated. */
export function getSchedulerZipSelectOptions(zip: string): ServiceAreaZipOption[] {
  if (!zip || SERVICE_AREA_ZIP_OPTIONS.some((o) => o.zip === zip)) {
    return SERVICE_AREA_ZIP_OPTIONS;
  }
  if (!isInServiceArea(zip)) return SERVICE_AREA_ZIP_OPTIONS;
  const state = inferStateFromZip(zip);
  if (!state) return SERVICE_AREA_ZIP_OPTIONS;
  const matched = findServiceAreaZipOption(zip);
  return [
    ...SERVICE_AREA_ZIP_OPTIONS,
    { zip, city: matched?.city ?? '', state },
  ];
}

export const serviceAreaNeighborhoods = [
  'Washington DC',
  'Baltimore',
  'Silver Spring',
  'Rockville',
  'Bethesda',
  'Columbia',
  'Annapolis',
  'Frederick',
  'Gaithersburg',
  'Towson',
  'Hagerstown',
  'Waldorf',
];

export interface ServiceAreaMapPin {
  label: string;
  top: string;
  left: string;
}

/** Approximate pin positions over the embedded map viewport */
export const serviceAreaMapPins: ServiceAreaMapPin[] = [
  { label: 'Washington DC', top: '58%', left: '42%' },
  { label: 'Baltimore', top: '34%', left: '72%' },
  { label: 'Silver Spring', top: '52%', left: '48%' },
  { label: 'Rockville', top: '48%', left: '44%' },
  { label: 'Columbia', top: '46%', left: '58%' },
  { label: 'Frederick', top: '28%', left: '32%' },
  { label: 'Annapolis', top: '54%', left: '68%' },
  { label: 'Hagerstown', top: '14%', left: '18%' },
];

/** OpenStreetMap embed — DC through central Maryland */
export const SERVICE_AREA_MAP_EMBED_URL =
  'https://www.openstreetmap.org/export/embed.html?bbox=-77.85%2C38.55%2C-76.0%2C39.75&layer=mapnik&marker=39.0458%2C-76.9413';
