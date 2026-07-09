export type SchedulerServiceCategory =
  | 'Appliance'
  | 'HVAC'
  | 'Plumbing'
  | 'Electrical'
  | 'Smart Home'
  | 'Garage Door'
  | 'TV Mounting'
  | 'Phone Repair'
  | 'Handyman';

export type SchedulerServiceTypeId = 'repair' | 'installation' | 'maintenance' | 'emergency';

export interface SchedulerCategoryFields {
  appliance?: string;
  hvacService?: string;
  plumbingIssue?: string;
  electricalIssue?: string;
  smartDevice?: string;
  garageDoorService?: string;
}

export interface SchedulerPrefill {
  category: SchedulerServiceCategory | '';
  categoryFromUrl: boolean;
  skipCategoryPicker: boolean;
  serviceType: SchedulerServiceTypeId;
  serviceTypeFromUrl: boolean;
  productName: string;
  fields: SchedulerCategoryFields;
}

/** Maps hub category ids (from service pages) to scheduler category labels */
export const HUB_CATEGORY_TO_SCHEDULER: Record<string, SchedulerServiceCategory> = {
  'appliance-repair': 'Appliance',
  'hvac-services': 'HVAC',
  'plumbing-services': 'Plumbing',
  'electrical-services': 'Electrical',
  'smart-home-setup': 'Smart Home',
  'tv-mounting': 'TV Mounting',
  'phone-repair': 'Phone Repair',
  handyman: 'Handyman',
};

/** Maps /services/:slug paths to scheduler categories */
export const SERVICE_SLUG_TO_SCHEDULER: Record<string, SchedulerServiceCategory> = {
  'home-appliances': 'Appliance',
  'appliance-repair': 'Appliance',
  hvac: 'HVAC',
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  'smart-home': 'Smart Home',
  'garage-door-repair': 'Garage Door',
  'tv-mounting': 'TV Mounting',
  'phone-repair': 'Phone Repair',
  handyman: 'Handyman',
};

const SERVICE_TYPE_CODE: Record<string, SchedulerServiceTypeId> = {
  r: 'repair',
  i: 'installation',
  m: 'maintenance',
  e: 'emergency',
  repair: 'repair',
  installation: 'installation',
  maintenance: 'maintenance',
  emergency: 'emergency',
};

const SCHEDULER_CATEGORIES = new Set<string>([
  'Appliance',
  'HVAC',
  'Plumbing',
  'Electrical',
  'Smart Home',
  'Garage Door',
  'TV Mounting',
  'Phone Repair',
  'Handyman',
]);

export function normalizeProductName(raw: string): string {
  return decodeURIComponent(raw.replace(/\+/g, ' ')).trim();
}

function normalizeKey(raw: string): string {
  return normalizeProductName(raw).toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export function parseServiceCategoryParam(raw: string | null): SchedulerServiceCategory | '' {
  if (!raw) return '';
  const trimmed = normalizeProductName(raw);
  if (SCHEDULER_CATEGORIES.has(trimmed)) return trimmed as SchedulerServiceCategory;

  const key = normalizeKey(trimmed);
  const fromSlug = SERVICE_SLUG_TO_SCHEDULER[key.replace(/\s+/g, '-')];
  if (fromSlug) return fromSlug;

  const titleCase: Record<string, SchedulerServiceCategory> = {
    appliance: 'Appliance',
    appliances: 'Appliance',
    hvac: 'HVAC',
    plumbing: 'Plumbing',
    electrical: 'Electrical',
    'smart home': 'Smart Home',
    smarthome: 'Smart Home',
    'garage door': 'Garage Door',
  };
  return titleCase[key] ?? '';
}

export function parseServiceTypeParam(raw: string | null): SchedulerServiceTypeId | null {
  if (!raw) return null;
  return SERVICE_TYPE_CODE[raw.trim().toLowerCase()] ?? null;
}

const HVAC_FIELD_VALUES = [
  'AC Repair',
  'Heating / Furnace Repair',
  'Thermostat Installation',
  'HVAC Maintenance',
  'Duct Cleaning',
] as const;

const PLUMBING_FIELD_VALUES = [
  'Leak Repair',
  'Drain Cleaning',
  'Toilet Repair',
  'Faucet Repair',
  'Water Heater',
  'Garbage Disposal',
  'Pipe Repair',
] as const;

const ELECTRICAL_FIELD_VALUES = [
  'Outlet / Switch',
  'Light Fixture',
  'Ceiling Fan',
  'Breaker / Panel',
  'Smart Switch',
  'Appliance Electrical Connection',
] as const;

const APPLIANCE_FIELD_VALUES = [
  'Refrigerator',
  'Washer',
  'Dryer',
  'Dishwasher',
  'Oven / Stove',
  'Microwave',
  'Garbage Disposal',
  'Smart Appliance',
] as const;

const SMART_HOME_FIELD_VALUES = [
  'Smart Thermostat',
  'Security Camera',
  'Smart Doorbell',
  'Smart Lock',
  'Smart Switch',
  'Smart Appliance',
  'Wi-Fi Device',
] as const;

const GARAGE_FIELD_VALUES = [
  'Repair',
  'Installation',
  'Opener Repair',
  'Spring Repair',
  'Track Issue',
  'Remote / Sensor Issue',
] as const;

function matchFieldValue<T extends string>(productName: string, options: readonly T[]): T | undefined {
  const key = normalizeKey(productName);
  const exact = options.find((opt) => normalizeKey(opt) === key);
  if (exact) return exact;

  const partial = options.find((opt) => {
    const optKey = normalizeKey(opt);
    return key.includes(optKey) || optKey.includes(key);
  });
  if (partial) return partial;

  return undefined;
}

const PRODUCT_CATEGORY_RULES: { category: SchedulerServiceCategory; patterns: string[] }[] = [
  {
    category: 'HVAC',
    patterns: [
      'ac repair',
      'hvac',
      'furnace',
      'heating',
      'duct cleaning',
      'thermostat installation',
      'hvac maintenance',
      'emergency hvac',
      'air conditioning',
    ],
  },
  {
    category: 'Plumbing',
    patterns: [
      'plumbing',
      'drain cleaning',
      'leak repair',
      'water heater',
      'toilet repair',
      'faucet repair',
      'pipe repair',
      'garbage disposal installation',
      'sump pump',
    ],
  },
  {
    category: 'Electrical',
    patterns: [
      'electrical',
      'outlet',
      'switch repair',
      'light fixture',
      'ceiling fan',
      'breaker',
      'panel',
      'smart switch',
      'appliance electrical',
      'wiring',
    ],
  },
  {
    category: 'Smart Home',
    patterns: [
      'smart thermostat',
      'security camera',
      'smart doorbell',
      'video doorbell',
      'smart lock',
      'smart hub',
      'smart lighting',
      'wifi device',
      'smart device',
      'smart appliance setup',
      'doorbell installation',
      'camera installation',
    ],
  },
  {
    category: 'Garage Door',
    patterns: ['garage door'],
  },
  {
    category: 'TV Mounting',
    patterns: ['tv mount', 'television mount', 'soundbar', 'wire concealment', 'media device'],
  },
  {
    category: 'Phone Repair',
    patterns: ['phone repair', 'screen replacement', 'iphone', 'android phone', 'battery replacement', 'charging port'],
  },
  {
    category: 'Handyman',
    patterns: ['handyman', 'furniture assembly', 'drywall', 'wall hanging', 'shelf installation', 'curtain rod'],
  },
  {
    category: 'Appliance',
    patterns: [
      'refrigerator',
      'washer',
      'dryer',
      'dishwasher',
      'oven',
      'stove',
      'microwave',
      'cooktop',
      'freezer',
      'appliance',
      'range',
    ],
  },
];

export function inferCategoryFromProductName(productName: string): SchedulerServiceCategory | '' {
  const key = normalizeKey(productName);
  if (!key) return '';

  for (const rule of PRODUCT_CATEGORY_RULES) {
    if (rule.patterns.some((p) => key.includes(p))) {
      return rule.category;
    }
  }
  return '';
}

export function mapProductNameToFields(
  category: SchedulerServiceCategory,
  productName: string,
): SchedulerCategoryFields {
  const name = normalizeProductName(productName);
  if (!name) return {};

  switch (category) {
    case 'HVAC':
      return { hvacService: matchFieldValue(name, HVAC_FIELD_VALUES) ?? name };
    case 'Plumbing': {
      const mapped = matchFieldValue(name, PLUMBING_FIELD_VALUES);
      if (mapped) return { plumbingIssue: mapped };
      if (/water heater/i.test(name)) return { plumbingIssue: 'Water Heater' };
      return { plumbingIssue: name };
    }
    case 'Electrical': {
      if (/outlet|switch/i.test(name)) return { electricalIssue: 'Outlet / Switch' };
      if (/light fixture/i.test(name)) return { electricalIssue: 'Light Fixture' };
      if (/ceiling fan/i.test(name)) return { electricalIssue: 'Ceiling Fan' };
      if (/breaker|panel/i.test(name)) return { electricalIssue: 'Breaker / Panel' };
      return { electricalIssue: matchFieldValue(name, ELECTRICAL_FIELD_VALUES) ?? name };
    }
    case 'Appliance': {
      if (/refrigerator|fridge|freezer/i.test(name)) return { appliance: 'Refrigerator' };
      if (/washer/i.test(name) && !/dryer/i.test(name)) return { appliance: 'Washer' };
      if (/dryer/i.test(name)) return { appliance: 'Dryer' };
      if (/dishwasher/i.test(name)) return { appliance: 'Dishwasher' };
      if (/oven|stove|range|cooktop/i.test(name)) return { appliance: 'Oven / Stove' };
      if (/microwave/i.test(name)) return { appliance: 'Microwave' };
      if (/disposal/i.test(name)) return { appliance: 'Garbage Disposal' };
      if (/smart appliance/i.test(name)) return { appliance: 'Smart Appliance' };
      return { appliance: matchFieldValue(name, APPLIANCE_FIELD_VALUES) ?? name.replace(/\s*repair$/i, '').trim() };
    }
    case 'Smart Home': {
      if (/thermostat/i.test(name)) return { smartDevice: 'Smart Thermostat' };
      if (/camera/i.test(name)) return { smartDevice: 'Security Camera' };
      if (/doorbell/i.test(name)) return { smartDevice: 'Smart Doorbell' };
      if (/smart lock|lock installation/i.test(name)) return { smartDevice: 'Smart Lock' };
      if (/wifi|wi fi|network/i.test(name)) return { smartDevice: 'Wi-Fi Device' };
      if (/light/i.test(name)) return { smartDevice: 'Smart Switch' };
      return { smartDevice: matchFieldValue(name, SMART_HOME_FIELD_VALUES) ?? name };
    }
    case 'Garage Door':
      return { garageDoorService: matchFieldValue(name, GARAGE_FIELD_VALUES) ?? 'Repair' };
    case 'TV Mounting':
    case 'Phone Repair':
    case 'Handyman':
      return {};
    default:
      return {};
  }
}

export function parseSchedulerPrefill(params: URLSearchParams): SchedulerPrefill {
  const productName = normalizeProductName(params.get('productName') ?? '');
  const serviceCategoryParam = params.get('serviceCategory') ?? params.get('category') ?? '';
  const slugParam = params.get('slug') ?? params.get('from') ?? '';

  let category = parseServiceCategoryParam(serviceCategoryParam);
  const slugCategory = slugParam
    ? SERVICE_SLUG_TO_SCHEDULER[slugParam.trim().toLowerCase()] ?? ''
    : '';
  if (!category && slugCategory) {
    category = slugCategory;
  }

  const categoryFromUrl = Boolean(
    parseServiceCategoryParam(serviceCategoryParam) || slugCategory,
  );

  if (!category && productName) {
    category = inferCategoryFromProductName(productName);
  }

  const serviceTypeParsed = parseServiceTypeParam(params.get('serviceType'));
  const serviceType = serviceTypeParsed ?? 'repair';
  const serviceTypeFromUrl = serviceTypeParsed !== null;

  const fields = category && productName ? mapProductNameToFields(category, productName) : {};

  return {
    category,
    categoryFromUrl,
    skipCategoryPicker: Boolean(category) && (categoryFromUrl || Boolean(productName)),
    serviceType,
    serviceTypeFromUrl,
    productName,
    fields,
  };
}

export function schedulerCategoryFromHubId(categoryId: string): SchedulerServiceCategory | '' {
  return HUB_CATEGORY_TO_SCHEDULER[categoryId] ?? '';
}

/** Resolved category-specific answer from URL prefill (for step-1 validation). */
export function resolvePrefilledCategoryDetail(
  category: SchedulerServiceCategory | '',
  productName: string,
  fields: SchedulerCategoryFields,
  state: SchedulerCategoryFields,
): string {
  if (!category) return '';
  const mapped = productName ? mapProductNameToFields(category, productName) : {};
  switch (category) {
    case 'Appliance':
      return state.appliance || fields.appliance || mapped.appliance || '';
    case 'HVAC':
      return state.hvacService || fields.hvacService || mapped.hvacService || '';
    case 'Plumbing':
      return state.plumbingIssue || fields.plumbingIssue || mapped.plumbingIssue || '';
    case 'Electrical':
      return state.electricalIssue || fields.electricalIssue || mapped.electricalIssue || '';
    case 'Smart Home':
      return state.smartDevice || fields.smartDevice || mapped.smartDevice || '';
    case 'Garage Door':
      return state.garageDoorService || fields.garageDoorService || mapped.garageDoorService || '';
    case 'TV Mounting':
    case 'Phone Repair':
    case 'Handyman':
      return productName || '';
    default:
      return '';
  }
}
