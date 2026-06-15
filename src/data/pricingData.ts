export type PricingCategoryId =
  | 'appliances'
  | 'hvac'
  | 'plumbing'
  | 'electrical'
  | 'smart-home';

export interface PricingItem {
  name: string;
  description: string;
  priceFrom: number;
  priceTo?: number;
  note?: string;
}

export interface PricingCategory {
  id: PricingCategoryId;
  label: string;
  subtitle: string;
  items: PricingItem[];
}

export const DIAGNOSTIC_FEE = 89;

export const PRICING_CATEGORIES: PricingCategory[] = [
  {
    id: 'appliances',
    label: 'Home Appliances',
    subtitle: 'Transparent repair and installation estimates for major household appliances.',
    items: [
      { name: 'Diagnostic visit', description: 'In-home assessment and upfront repair quote', priceFrom: 89, priceTo: 89 },
      { name: 'Refrigerator repair', description: 'Cooling, ice maker, leaks, and compressor issues', priceFrom: 149, priceTo: 449 },
      { name: 'Washer / dryer repair', description: 'Spin, drain, heat, and control problems', priceFrom: 129, priceTo: 389 },
      { name: 'Dishwasher repair', description: 'Drainage, cleaning, and door latch issues', priceFrom: 119, priceTo: 329 },
      { name: 'Oven / stove repair', description: 'Heating, ignition, and burner failures', priceFrom: 139, priceTo: 399 },
      { name: 'Microwave repair', description: 'Heating, turntable, and display issues', priceFrom: 109, priceTo: 279 },
      { name: 'Appliance installation', description: 'Hookup, leveling, and test cycle', priceFrom: 149, priceTo: 349 },
    ],
  },
  {
    id: 'hvac',
    label: 'HVAC',
    subtitle: 'Heating and cooling service pricing for common residential systems.',
    items: [
      { name: 'HVAC diagnostic', description: 'System inspection and repair estimate', priceFrom: 99, priceTo: 99 },
      { name: 'AC repair', description: 'Cooling failure, refrigerant, and airflow issues', priceFrom: 179, priceTo: 549 },
      { name: 'Furnace / heating repair', description: 'No heat, ignition, and blower problems', priceFrom: 169, priceTo: 499 },
      { name: 'Thermostat installation', description: 'Smart or standard thermostat setup', priceFrom: 129, priceTo: 249 },
      { name: 'HVAC maintenance', description: 'Seasonal tune-up and safety check', priceFrom: 129, priceTo: 199 },
      { name: 'Duct cleaning', description: 'Whole-home duct cleaning service', priceFrom: 349, priceTo: 599 },
      { name: 'Emergency HVAC', description: 'Same-day urgent heating or cooling', priceFrom: 199, priceTo: 699, note: 'Availability varies by ZIP' },
    ],
  },
  {
    id: 'plumbing',
    label: 'Plumbing',
    subtitle: 'Fixture, drain, and water heater service estimates.',
    items: [
      { name: 'Plumbing diagnostic', description: 'Leak or drain assessment visit', priceFrom: 89, priceTo: 89 },
      { name: 'Leak repair', description: 'Pipe, fixture, and under-sink leaks', priceFrom: 149, priceTo: 449 },
      { name: 'Drain cleaning', description: 'Clogs and slow drains', priceFrom: 129, priceTo: 349 },
      { name: 'Faucet repair / replacement', description: 'Drips, low pressure, and upgrades', priceFrom: 119, priceTo: 299 },
      { name: 'Toilet repair', description: 'Running toilet, clogs, and leaks', priceFrom: 109, priceTo: 279 },
      { name: 'Water heater service', description: 'Tank and tankless repair', priceFrom: 169, priceTo: 549 },
      { name: 'Emergency plumbing', description: 'Burst pipe or major leak response', priceFrom: 199, priceTo: 699, note: 'Call 911 for gas or flooding hazards' },
    ],
  },
  {
    id: 'electrical',
    label: 'Electrical',
    subtitle: 'Licensed electrical repair and installation pricing.',
    items: [
      { name: 'Electrical diagnostic', description: 'Outlet, switch, or panel assessment', priceFrom: 89, priceTo: 89 },
      { name: 'Outlet / switch repair', description: 'Dead outlets, GFCI, and switches', priceFrom: 119, priceTo: 249 },
      { name: 'Light fixture installation', description: 'Indoor or outdoor fixture install', priceFrom: 129, priceTo: 299 },
      { name: 'Ceiling fan installation', description: 'Mounting, wiring, and balancing', priceFrom: 149, priceTo: 349 },
      { name: 'Breaker / panel inspection', description: 'Tripping breakers and safety review', priceFrom: 149, priceTo: 399 },
      { name: 'Appliance electrical hookup', description: 'Dryer, range, and dedicated circuits', priceFrom: 159, priceTo: 449 },
      { name: 'Emergency electrical', description: 'Sparks, outages, and urgent hazards', priceFrom: 199, priceTo: 599 },
    ],
  },
  {
    id: 'smart-home',
    label: 'Smart Home',
    subtitle: 'Device setup, mounting, and network configuration.',
    items: [
      { name: 'Smart device setup', description: 'Wi-Fi pairing and app configuration', priceFrom: 99, priceTo: 179 },
      { name: 'Video doorbell installation', description: 'Ring, Nest, and similar models', priceFrom: 129, priceTo: 249 },
      { name: 'Security camera installation', description: 'Indoor or outdoor camera mount', priceFrom: 119, priceTo: 279 },
      { name: 'Smart thermostat setup', description: 'Install, wire, and configure schedules', priceFrom: 129, priceTo: 249 },
      { name: 'Smart lock installation', description: 'Lock fitting and app pairing', priceFrom: 149, priceTo: 299 },
      { name: 'TV mounting', description: 'Wall mount with cable management', priceFrom: 129, priceTo: 249 },
      { name: 'Wi-Fi / network help', description: 'Connect devices and improve coverage', priceFrom: 99, priceTo: 199 },
    ],
  },
];

export interface ApplianceIssue {
  id: string;
  label: string;
  min: number;
  max: number;
}

export interface AppliancePricingOption {
  id: string;
  label: string;
  serviceId: string;
  issues: ApplianceIssue[];
}

export const APPLIANCE_PRICING_OPTIONS: AppliancePricingOption[] = [
  {
    id: 'refrigerator',
    label: 'Refrigerator',
    serviceId: 'refrigerator-repair',
    issues: [
      { id: 'not-cooling', label: 'Not cooling', min: 189, max: 449 },
      { id: 'ice-maker', label: 'Ice maker not working', min: 149, max: 329 },
      { id: 'leaking', label: 'Leaking water', min: 129, max: 299 },
      { id: 'noise', label: 'Loud or strange noise', min: 139, max: 349 },
      { id: 'other', label: 'Other issue', min: 149, max: 399 },
    ],
  },
  {
    id: 'washer-dryer',
    label: 'Washer / dryer',
    serviceId: 'washer-dryer',
    issues: [
      { id: 'wont-spin', label: "Won't spin", min: 129, max: 329 },
      { id: 'wont-drain', label: "Won't drain", min: 119, max: 289 },
      { id: 'not-heating', label: 'Not heating (dryer)', min: 139, max: 349 },
      { id: 'leaking', label: 'Leaking', min: 119, max: 279 },
      { id: 'other', label: 'Other issue', min: 129, max: 389 },
    ],
  },
  {
    id: 'dishwasher',
    label: 'Dishwasher',
    serviceId: 'dishwasher-repair',
    issues: [
      { id: 'not-cleaning', label: 'Not cleaning well', min: 119, max: 279 },
      { id: 'wont-drain', label: "Won't drain", min: 109, max: 259 },
      { id: 'leaking', label: 'Leaking', min: 109, max: 249 },
      { id: 'wont-start', label: "Won't start", min: 119, max: 299 },
      { id: 'other', label: 'Other issue', min: 119, max: 329 },
    ],
  },
  {
    id: 'oven-stove',
    label: 'Oven / stove',
    serviceId: 'oven-stove-repair',
    issues: [
      { id: 'not-heating', label: 'Not heating', min: 149, max: 399 },
      { id: 'burner', label: 'Burner not working', min: 129, max: 289 },
      { id: 'ignition', label: 'Ignition problem', min: 139, max: 329 },
      { id: 'display', label: 'Display / control error', min: 149, max: 349 },
      { id: 'other', label: 'Other issue', min: 139, max: 399 },
    ],
  },
  {
    id: 'microwave',
    label: 'Microwave',
    serviceId: 'microwave-repair',
    issues: [
      { id: 'not-heating', label: 'Not heating', min: 109, max: 249 },
      { id: 'no-power', label: 'No power', min: 99, max: 219 },
      { id: 'turntable', label: 'Turntable issue', min: 89, max: 179 },
      { id: 'sparking', label: 'Sparking inside', min: 109, max: 259 },
      { id: 'other', label: 'Other issue', min: 109, max: 279 },
    ],
  },
  {
    id: 'garbage-disposal',
    label: 'Garbage disposal',
    serviceId: 'garbage-disposal-repair',
    issues: [
      { id: 'jammed', label: 'Jammed / humming', min: 99, max: 219 },
      { id: 'leaking', label: 'Leaking', min: 109, max: 249 },
      { id: 'wont-start', label: "Won't turn on", min: 99, max: 229 },
      { id: 'other', label: 'Other issue', min: 99, max: 259 },
    ],
  },
];

export interface PriceEstimate {
  min: number;
  max: number;
  typical: number;
  diagnosticFee: number;
  applianceLabel: string;
  issueLabel: string;
  zipCode: string;
  serviceId: string;
}

export function calculateApplianceEstimate(
  applianceId: string,
  issueId: string,
  zipCode: string,
): PriceEstimate | null {
  const appliance = APPLIANCE_PRICING_OPTIONS.find((a) => a.id === applianceId);
  if (!appliance) return null;
  const issue = appliance.issues.find((i) => i.id === issueId);
  if (!issue) return null;

  return {
    min: issue.min,
    max: issue.max,
    typical: Math.round((issue.min + issue.max) / 2),
    diagnosticFee: DIAGNOSTIC_FEE,
    applianceLabel: appliance.label,
    issueLabel: issue.label,
    zipCode,
    serviceId: appliance.serviceId,
  };
}

export function formatPrice(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

export function formatPriceRange(from: number, to?: number): string {
  if (to === undefined || from === to) return formatPrice(from);
  return `${formatPrice(from)} – ${formatPrice(to)}`;
}

export const PRICING_TIME_SLOTS = [
  '8am – 10am',
  '10am – 12pm',
  '12pm – 2pm',
  '2pm – 4pm',
  '4pm – 6pm',
] as const;

export function getPricingScheduleDates(count = 14): { value: string; label: string }[] {
  const dates: { value: string; label: string }[] = [];
  const today = new Date();

  for (let offset = 1; offset <= count; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    const value = date.toISOString().slice(0, 10);
    const label = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    dates.push({ value, label });
  }

  return dates;
}
