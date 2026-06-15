/** Format a Date as YYYY-MM-DD in the user's local timezone. */
export function formatLocalDateIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Today's date as YYYY-MM-DD in local time. */
export function getTodayLocalDate(): string {
  return formatLocalDateIso(new Date());
}

/** Local date N days from today (negative values allowed). */
export function addLocalDays(days: number): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return formatLocalDateIso(date);
}

export function isPastLocalDate(dateStr: string): boolean {
  if (!dateStr) return false;
  return dateStr < getTodayLocalDate();
}

export function sanitizePreferredDate(
  dateStr: string,
  minDate = getTodayLocalDate(),
): string {
  if (!dateStr || dateStr < minDate) return '';
  return dateStr;
}
