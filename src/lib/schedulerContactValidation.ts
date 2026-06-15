import { isPastLocalDate } from './localDate';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export function validateCityField(city: string): string | null {
  const trimmed = city.trim();
  if (!trimmed) return null;
  if (trimmed.length < 2) return 'City must be at least 2 characters.';
  return null;
}

export function validateStateField(state: string): string | null {
  const trimmed = state.trim();
  if (!trimmed) return null;
  if (!/^[A-Za-z]{2}$/.test(trimmed)) return 'Enter a 2-letter state code.';
  return null;
}

export function validatePreferredDateField(dateStr: string): string | null {
  if (!dateStr) return 'Please choose a preferred date.';
  if (isPastLocalDate(dateStr)) return 'Please select today or a future date.';
  return null;
}
