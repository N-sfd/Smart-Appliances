export type PricingCategoryKey =
  | 'Appliance'
  | 'HVAC'
  | 'Plumbing'
  | 'Electrical'
  | 'Smart Home'
  | 'Garage Door'
  | 'Emergency';

const CATEGORY_ALIASES: Record<string, PricingCategoryKey> = {
  appliance: 'Appliance',
  appliances: 'Appliance',
  'home appliance': 'Appliance',
  'home appliances': 'Appliance',
  hvac: 'HVAC',
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  'smart home': 'Smart Home',
  smarthome: 'Smart Home',
  'garage door': 'Garage Door',
  garagedoor: 'Garage Door',
  emergency: 'Emergency',
};

export function normalizePricingCategory(category?: string | null): PricingCategoryKey | null {
  if (!category) return null;
  const key = category.trim().toLowerCase();
  return CATEGORY_ALIASES[key] ?? null;
}

const QUOTE_REQUIRED = 'quote' as const;
type PriceEntry = number | typeof QUOTE_REQUIRED;

interface CategoryPricing {
  default: number;
  items: Record<string, PriceEntry>;
}

const PRICING_MAP: Record<PricingCategoryKey, CategoryPricing> = {
  Appliance: {
    default: 89,
    items: {
      'Refrigerator Repair': 89,
      'Washer / Dryer Repair': 89,
      'Dishwasher Repair': 89,
      'Oven / Stove Repair': 89,
      'Microwave Repair': 79,
      'Appliance Installation': 149,
    },
  },
  HVAC: {
    default: 99,
    items: {
      'AC Repair': 99,
      'Heating / Furnace Repair': 99,
      'Thermostat Installation': 129,
      'HVAC Maintenance': 129,
      'Duct Cleaning': QUOTE_REQUIRED,
    },
  },
  Plumbing: {
    default: 99,
    items: {
      'Drain Cleaning': 149,
      'Garbage Disposal Repair': 99,
      'Garbage Disposal Installation': 179,
      'Faucet Repair / Replacement': 129,
      'Toilet Repair': 129,
      'Leak Inspection': 99,
    },
  },
  Electrical: {
    default: 99,
    items: {
      'Light Fixture Installation': 149,
      'Ceiling Fan Installation': 179,
      'Outlet / Switch Repair': 99,
      'Breaker / Panel Inspection': 129,
      'Doorbell Wiring': 129,
    },
  },
  'Smart Home': {
    default: 129,
    items: {
      'Video Doorbell Installation': 129,
      'Smart Thermostat Installation': 129,
      'Smart Lock Installation': 149,
      'Security Camera Installation': 149,
      'Wi-Fi Device Setup': 99,
    },
  },
  'Garage Door': {
    default: 99,
    items: {
      'Garage Door Repair': 99,
      'Spring Repair': QUOTE_REQUIRED,
      'Opener Repair': 99,
      'Sensor Alignment': 89,
      'Garage Door Maintenance': 129,
    },
  },
  Emergency: {
    default: 149,
    items: {
      'Emergency Service Visit': 149,
    },
  },
};

const GENERIC_WORDS = new Set([
  'repair', 'installation', 'install', 'maintenance', 'service', 'visit',
  'inspection', 'setup', 'replacement', 'issue', 'cleaning',
]);

function normalizeFull(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

/** Strips generic service words to compare the "core" subject (e.g. "Washer Repair" -> "washer") */
function coreWords(value: string): string {
  const words = value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w && !GENERIC_WORDS.has(w));
  return words.join('');
}

function findPriceEntry(category: CategoryPricing, productName?: string | null): PriceEntry {
  if (!productName) return category.default;
  const normalizedProduct = normalizeFull(productName);

  const exactKey = Object.keys(category.items).find((k) => normalizeFull(k) === normalizedProduct);
  if (exactKey) return category.items[exactKey];

  const coreProduct = coreWords(productName) || normalizedProduct;
  let bestMatch: { key: string; length: number } | null = null;

  for (const key of Object.keys(category.items)) {
    const coreKey = coreWords(key);
    if (!coreKey) continue;
    if (coreProduct.includes(coreKey) || coreKey.includes(coreProduct)) {
      if (!bestMatch || coreKey.length > bestMatch.length) {
        bestMatch = { key, length: coreKey.length };
      }
    }
  }

  return bestMatch ? category.items[bestMatch.key] : category.default;
}

export type ServiceUrgency = 'Regular' | 'Same-Day' | 'Emergency' | string;

export interface ServiceEstimateInput {
  serviceCategory?: string | null;
  productName?: string | null;
  serviceType?: string | null;
  urgency?: ServiceUrgency | null;
}

export interface ServiceEstimate {
  categoryLabel: PricingCategoryKey;
  baseFee: number | null;
  priorityFee: number;
  emergencyFee: number;
  estimatedTotal: number | null;
  quoteRequired: boolean;
  displayLabel: string;
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/** Cheapest non-quote-required starting fee across a list of services, formatted for display. */
export function getStartingFeeLabel(services: { serviceCategory: string | null; name: string }[]): string {
  const estimates = services
    .map((s) => calculateServiceEstimate({
      serviceCategory: s.serviceCategory,
      productName: s.name,
      serviceType: null,
      urgency: 'Regular',
    }))
    .filter((e): e is NonNullable<typeof e> => e !== null);

  const baseFees = estimates
    .filter((e) => !e.quoteRequired && e.baseFee != null)
    .map((e) => e.baseFee as number);

  return baseFees.length > 0 ? `Service call from ${formatCurrency(Math.min(...baseFees))}` : 'Estimate required';
}

export function calculateServiceEstimate(input: ServiceEstimateInput): ServiceEstimate | null {
  const canonicalCategory = normalizePricingCategory(input.serviceCategory);
  if (!canonicalCategory) return null;

  const categoryPricing = PRICING_MAP[canonicalCategory];
  const entry = canonicalCategory === 'Emergency'
    ? categoryPricing.default
    : findPriceEntry(categoryPricing, input.productName);

  const quoteRequired = entry === QUOTE_REQUIRED;
  const baseFee = quoteRequired ? null : (entry as number);

  const normalizedUrgency = (input.urgency ?? '').trim().toLowerCase();
  const normalizedServiceType = (input.serviceType ?? '').trim().toLowerCase();
  const isEmergency = normalizedUrgency === 'emergency' || normalizedServiceType === 'emergency';
  const isSameDay = normalizedUrgency === 'same-day';

  const priorityFee = !quoteRequired && isSameDay ? 25 : 0;
  const emergencyFee = !quoteRequired && isEmergency ? 50 : 0;

  const estimatedTotal = quoteRequired || baseFee === null ? null : baseFee + priorityFee + emergencyFee;
  const displayLabel = quoteRequired
    ? 'Estimate required after inspection'
    : estimatedTotal !== null
      ? formatCurrency(estimatedTotal)
      : '';

  return {
    categoryLabel: canonicalCategory,
    baseFee,
    priorityFee,
    emergencyFee,
    estimatedTotal,
    quoteRequired,
    displayLabel,
  };
}
