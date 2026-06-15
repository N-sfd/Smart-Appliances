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
