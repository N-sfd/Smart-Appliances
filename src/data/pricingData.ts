import type { SchedulerServiceCategory } from './schedulerPrefill';

export type PricingCategoryId =
  | 'appliances'
  | 'hvac'
  | 'plumbing'
  | 'electrical'
  | 'smart-home'
  | 'garage-door'
  | 'emergency';

export interface PricingItem {
  name: string;
  /** Base price — labeled as a diagnostic fee when isDiagnostic is true, otherwise a flat starting price */
  priceFrom?: number;
  isDiagnostic?: boolean;
  quoteRequired?: boolean;
  note?: string;
}

export interface PricingCategory {
  id: PricingCategoryId;
  label: string;
  subtitle: string;
  /** Scheduler category param used for category-level booking links; emergency has none (uses serviceType=E) */
  schedulerCategory: SchedulerServiceCategory | null;
  items: PricingItem[];
}

export const PRICING_CATEGORIES: PricingCategory[] = [
  {
    id: 'appliances',
    label: 'Home Appliances',
    subtitle: 'Transparent repair and installation estimates for major household appliances.',
    schedulerCategory: 'Appliance',
    items: [
      { name: 'Refrigerator Repair', priceFrom: 89, isDiagnostic: true },
      { name: 'Washer / Dryer Repair', priceFrom: 89, isDiagnostic: true },
      { name: 'Dishwasher Repair', priceFrom: 89, isDiagnostic: true },
      { name: 'Oven / Stove Repair', priceFrom: 89, isDiagnostic: true },
      { name: 'Microwave Repair', priceFrom: 79, isDiagnostic: true },
      { name: 'Appliance Installation', priceFrom: 149 },
    ],
  },
  {
    id: 'hvac',
    label: 'HVAC',
    subtitle: 'Heating and cooling service pricing for common residential systems.',
    schedulerCategory: 'HVAC',
    items: [
      { name: 'AC Repair', priceFrom: 99, isDiagnostic: true },
      { name: 'Heating / Furnace Repair', priceFrom: 99, isDiagnostic: true },
      { name: 'Thermostat Installation', priceFrom: 129 },
      { name: 'HVAC Maintenance', priceFrom: 129 },
      { name: 'Duct Cleaning', quoteRequired: true },
    ],
  },
  {
    id: 'plumbing',
    label: 'Plumbing',
    subtitle: 'Fixture, drain, and leak service estimates.',
    schedulerCategory: 'Plumbing',
    items: [
      { name: 'Drain Cleaning', priceFrom: 149 },
      { name: 'Garbage Disposal Repair', priceFrom: 99, isDiagnostic: true },
      { name: 'Garbage Disposal Installation', priceFrom: 179 },
      { name: 'Faucet Repair / Replacement', priceFrom: 129 },
      { name: 'Toilet Repair', priceFrom: 129 },
      { name: 'Leak Inspection', priceFrom: 99, isDiagnostic: true },
    ],
  },
  {
    id: 'electrical',
    label: 'Electrical',
    subtitle: 'Licensed electrical repair and installation pricing.',
    schedulerCategory: 'Electrical',
    items: [
      { name: 'Light Fixture Installation', priceFrom: 149 },
      { name: 'Ceiling Fan Installation', priceFrom: 179 },
      { name: 'Outlet / Switch Repair', priceFrom: 99, isDiagnostic: true },
      { name: 'Breaker / Panel Inspection', priceFrom: 129, isDiagnostic: true },
      { name: 'Doorbell Wiring', priceFrom: 129 },
    ],
  },
  {
    id: 'smart-home',
    label: 'Smart Home',
    subtitle: 'Device setup, mounting, and network configuration.',
    schedulerCategory: 'Smart Home',
    items: [
      { name: 'Video Doorbell Installation', priceFrom: 129 },
      { name: 'Smart Thermostat Installation', priceFrom: 129 },
      { name: 'Smart Lock Installation', priceFrom: 149 },
      { name: 'Security Camera Installation', priceFrom: 149 },
      { name: 'Wi-Fi Device Setup', priceFrom: 99 },
    ],
  },
  {
    id: 'garage-door',
    label: 'Garage Door',
    subtitle: 'Repair, maintenance, and safety service for garage door systems.',
    schedulerCategory: 'Garage Door',
    items: [
      { name: 'Garage Door Repair', priceFrom: 99, isDiagnostic: true },
      { name: 'Spring Repair', quoteRequired: true },
      { name: 'Opener Repair', priceFrom: 99, isDiagnostic: true },
      { name: 'Sensor Alignment', priceFrom: 89 },
      { name: 'Garage Door Maintenance', priceFrom: 129 },
    ],
  },
  {
    id: 'emergency',
    label: 'Emergency',
    subtitle: 'Urgent, priority response when something needs attention right away.',
    schedulerCategory: null,
    items: [
      { name: 'Emergency Service Visit', priceFrom: 149 },
      { name: 'Same-Day Priority', priceFrom: 0, note: 'Additional fee may apply' },
      { name: 'After-Hours Service', quoteRequired: true },
    ],
  },
];

export const GENERIC_ISSUE_OPTIONS = [
  'Not working / no power',
  "Won't turn on or start",
  'Leaking or moisture',
  'Unusual noise or vibration',
  'New installation / setup',
  'Routine maintenance',
  'Other / not sure',
] as const;

export type EstimatorUrgency = 'regular' | 'same-day' | 'emergency';

export const URGENCY_OPTIONS: { id: EstimatorUrgency; label: string; surcharge: number }[] = [
  { id: 'regular', label: 'Regular', surcharge: 0 },
  { id: 'same-day', label: 'Same-Day', surcharge: 25 },
  { id: 'emergency', label: 'Emergency', surcharge: 50 },
];

export interface PriceEstimate {
  categoryLabel: string;
  schedulerCategory: SchedulerServiceCategory | null;
  itemName: string;
  urgencyLabel: string;
  quoteRequired: boolean;
  isDiagnostic: boolean;
  baseFee: number;
  surcharge: number;
  total: number;
  zipCode: string;
}

export function calculateEstimate(
  categoryId: PricingCategoryId,
  itemName: string,
  urgency: EstimatorUrgency,
  zipCode: string,
): PriceEstimate | null {
  const category = PRICING_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return null;
  const item = category.items.find((i) => i.name === itemName);
  if (!item) return null;

  const urgencyOption = URGENCY_OPTIONS.find((u) => u.id === urgency) ?? URGENCY_OPTIONS[0];
  const baseFee = item.priceFrom ?? 0;

  return {
    categoryLabel: category.label,
    schedulerCategory: category.schedulerCategory,
    itemName: item.name,
    urgencyLabel: urgencyOption.label,
    quoteRequired: Boolean(item.quoteRequired),
    isDiagnostic: Boolean(item.isDiagnostic),
    baseFee,
    surcharge: urgencyOption.surcharge,
    total: baseFee + urgencyOption.surcharge,
    zipCode,
  };
}

export function formatPrice(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

export function formatStartingPrice(item: PricingItem): string {
  if (item.quoteRequired) return 'Quote required';
  if (item.priceFrom === undefined) return 'Quote required';
  if (item.priceFrom === 0) return item.note ?? 'Included';
  return item.isDiagnostic ? `Starting at ${formatPrice(item.priceFrom)} diagnostic` : `Starting at ${formatPrice(item.priceFrom)}`;
}
