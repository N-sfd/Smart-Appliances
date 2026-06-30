import { isInServiceArea, validateZipStateMatch } from '../data/serviceAreas';
import { isPastLocalDate } from './localDate';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const SERVICE_AREA_STATES = ['MD', 'DC', 'VA', 'PA', 'WV', 'DE'] as const;
export type ServiceAreaState = typeof SERVICE_AREA_STATES[number];

export function validateFullName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return 'Full name is required.';
  if (trimmed.length < 2) return 'Full name must be at least 2 characters.';
  return null;
}

export function validateEmailAddress(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return 'Email address is required.';
  if (!EMAIL_PATTERN.test(trimmed)) return 'Enter a valid email address.';
  return null;
}

export function validateUsPhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, '');
  if (digits.length !== 10) return 'Enter a valid 10-digit phone number.';
  return null;
}

export function validateStreetAddress(address: string): string | null {
  const trimmed = address.trim();
  if (!trimmed) return null;
  if (trimmed.includes('@') || EMAIL_PATTERN.test(trimmed)) {
    return 'Please enter a street address, not an email address.';
  }
  return null;
}

const STATE_NAME_VALUES = new Set([
  'maryland',
  'virginia',
  'district of columbia',
  'washington dc',
  'pennsylvania',
  'west virginia',
  'delaware',
  'md',
  'va',
  'dc',
  'pa',
  'wv',
  'de',
]);

export function validateCityField(city: string): string | null {
  const trimmed = city.trim();
  if (!trimmed) return 'City is required.';
  if (trimmed.length < 2) return 'City must be at least 2 characters.';
  if (STATE_NAME_VALUES.has(trimmed.toLowerCase())) {
    return 'Enter a city name (e.g., Sterling), not a state.';
  }
  return null;
}

export function validateStateField(state: string, zip = ''): string | null {
  if (!state) return 'State is required.';
  if (!(SERVICE_AREA_STATES as readonly string[]).includes(state)) return 'Select a valid state.';
  if (zip && isInServiceArea(zip)) {
    const zipStateError = validateZipStateMatch(zip, state);
    if (zipStateError) return zipStateError;
  }
  return null;
}

export function validatePreferredDateField(dateStr: string): string | null {
  if (!dateStr) return 'Please choose a preferred date.';
  if (isPastLocalDate(dateStr)) return 'Please select today or a future date.';
  return null;
}

/** Prefer the selected slot's date, then the date field value. */
export function resolveSchedulerPreferredDate(
  preferredDate: string,
  selectedSlot: string | null,
): string {
  const slotDate = selectedSlot?.split('|')[0] ?? '';
  if (slotDate && !isPastLocalDate(slotDate)) return slotDate;
  return preferredDate;
}
