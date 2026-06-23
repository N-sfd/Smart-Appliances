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
  /** Internal key — used for scheduler productName params and pricing lookups. Do not change. */
  name: string;
  /** Cleaner customer-facing label; falls back to `name` when not set. */
  displayName?: string;
  /** Short one-line card description shown under the price. */
  description?: string;
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
      { name: 'Refrigerator Repair', displayName: 'Refrigerator Service', description: 'Cooling, leaking, noise, and power issues.', priceFrom: 89, isDiagnostic: true },
      { name: 'Washer / Dryer Repair', displayName: 'Washer & Dryer Service', description: 'Drainage, heating, and cycle problems.', priceFrom: 89, isDiagnostic: true },
      { name: 'Dishwasher Repair', displayName: 'Dishwasher Service', description: 'Leaks, drainage, and cleaning performance.', priceFrom: 89, isDiagnostic: true },
      { name: 'Oven / Stove Repair', displayName: 'Oven & Stove Service', description: 'Heating, ignition, and burner issues.', priceFrom: 89, isDiagnostic: true },
      { name: 'Microwave Repair', displayName: 'Microwave Service', description: 'Power, heating, and turntable issues.', priceFrom: 79, isDiagnostic: true },
      { name: 'Appliance Installation', description: 'New appliance hookup, leveling, and testing.', priceFrom: 149 },
    ],
  },
  {
    id: 'hvac',
    label: 'HVAC',
    subtitle: 'Heating and cooling service pricing for common residential systems.',
    schedulerCategory: 'HVAC',
    items: [
      { name: 'AC Repair', displayName: 'AC Service', description: 'Cooling, airflow, and noise issues.', priceFrom: 99, isDiagnostic: true },
      { name: 'Heating / Furnace Repair', displayName: 'Heating & Furnace Service', description: 'No-heat, ignition, and blower issues.', priceFrom: 99, isDiagnostic: true },
      { name: 'Thermostat Installation', description: 'New or smart thermostat setup.', priceFrom: 129 },
      { name: 'HVAC Maintenance', description: 'Seasonal tune-up and system check.', priceFrom: 129 },
      { name: 'Duct Cleaning', description: 'Whole-system duct cleaning visit.', quoteRequired: true },
    ],
  },
  {
    id: 'plumbing',
    label: 'Plumbing',
    subtitle: 'Fixture, drain, and leak service estimates.',
    schedulerCategory: 'Plumbing',
    items: [
      { name: 'Drain Cleaning', description: 'Clogged or slow-draining lines.', priceFrom: 149 },
      { name: 'Garbage Disposal Repair', displayName: 'Garbage Disposal Service', description: 'Jams, leaks, and power issues.', priceFrom: 99, isDiagnostic: true },
      { name: 'Garbage Disposal Installation', description: 'New disposal unit installation.', priceFrom: 179 },
      { name: 'Faucet Repair / Replacement', displayName: 'Faucet Service', description: 'Leaks, low pressure, and replacement.', priceFrom: 129 },
      { name: 'Toilet Repair', displayName: 'Toilet Service', description: 'Running, clogging, and leak issues.', priceFrom: 129 },
      { name: 'Leak Inspection', description: 'Locate and assess a suspected leak.', priceFrom: 99, isDiagnostic: true },
    ],
  },
  {
    id: 'electrical',
    label: 'Electrical',
    subtitle: 'Licensed electrical repair and installation pricing.',
    schedulerCategory: 'Electrical',
    items: [
      { name: 'Light Fixture Installation', description: 'Indoor or outdoor fixture installation.', priceFrom: 149 },
      { name: 'Ceiling Fan Installation', description: 'New ceiling fan mounting and wiring.', priceFrom: 179 },
      { name: 'Outlet / Switch Repair', displayName: 'Outlet & Switch Service', description: 'Non-working or unsafe outlets and switches.', priceFrom: 99, isDiagnostic: true },
      { name: 'Breaker / Panel Inspection', description: 'Tripping breakers or panel concerns.', priceFrom: 129, isDiagnostic: true },
      { name: 'Doorbell Wiring', description: 'Wired or video doorbell setup.', priceFrom: 129 },
    ],
  },
  {
    id: 'smart-home',
    label: 'Smart Home',
    subtitle: 'Device setup, mounting, and network configuration.',
    schedulerCategory: 'Smart Home',
    items: [
      { name: 'Video Doorbell Installation', description: 'Smart video doorbell mounting and setup.', priceFrom: 129 },
      { name: 'Smart Thermostat Installation', description: 'Wi-Fi thermostat installation and pairing.', priceFrom: 129 },
      { name: 'Smart Lock Installation', description: 'Keyless or smart deadbolt installation.', priceFrom: 149 },
      { name: 'Security Camera Installation', description: 'Indoor or outdoor camera setup.', priceFrom: 149 },
      { name: 'Wi-Fi Device Setup', description: 'Connect and configure a smart device.', priceFrom: 99 },
    ],
  },
  {
    id: 'garage-door',
    label: 'Garage Door',
    subtitle: 'Repair, maintenance, and safety service for garage door systems.',
    schedulerCategory: 'Garage Door',
    items: [
      { name: 'Garage Door Repair', displayName: 'Garage Door Service', description: 'Door off-track, noisy, or not responding.', priceFrom: 99, isDiagnostic: true },
      { name: 'Spring Repair', displayName: 'Spring Service', description: 'Broken or worn garage door spring.', quoteRequired: true },
      { name: 'Opener Repair', displayName: 'Opener Service', description: 'Remote, motor, or sensor issues.', priceFrom: 99, isDiagnostic: true },
      { name: 'Sensor Alignment', description: 'Realign safety sensors.', priceFrom: 89 },
      { name: 'Garage Door Maintenance', description: 'Lubrication and safety check.', priceFrom: 129 },
    ],
  },
  {
    id: 'emergency',
    label: 'Emergency',
    subtitle: 'Urgent, priority response when something needs attention right away.',
    schedulerCategory: null,
    items: [
      { name: 'Emergency Service Visit', description: 'Priority response for urgent issues.', priceFrom: 149 },
      { name: 'Same-Day Priority', priceFrom: 0, note: 'Additional fee may apply' },
      { name: 'After-Hours Service', description: 'Service outside normal business hours.', quoteRequired: true },
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
  if (item.quoteRequired) return 'Estimate after review';
  if (item.priceFrom === undefined) return 'Estimate after review';
  if (item.priceFrom === 0) return item.note ?? 'Included';
  return item.isDiagnostic
    ? `Service call from ${formatPrice(item.priceFrom)}`
    : `Starting from ${formatPrice(item.priceFrom)}`;
}
