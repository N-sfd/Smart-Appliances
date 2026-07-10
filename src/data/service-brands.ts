export type BrandCategoryId =
  | 'appliances'
  | 'hvac'
  | 'plumbing'
  | 'electrical'
  | 'garage-door'
  | 'smart-home'
  | 'tv-entertainment'
  | 'phone-repair'
  | 'handyman';

export type ServiceBrand = {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  categories: BrandCategoryId[];
  alt: string;
  featured?: boolean;
};

export type BrandsSectionConfig = {
  category: BrandCategoryId;
  title: string;
  description: string;
  contactServiceId: string;
  displayMode?: 'grid' | 'carousel' | 'compact';
  initialVisibleCount?: number;
};

export const BRAND_FILTER_OPTIONS: { id: BrandCategoryId | 'all'; label: string }[] = [
  { id: 'all', label: 'All Brands' },
  { id: 'appliances', label: 'Appliances' },
  { id: 'hvac', label: 'HVAC' },
  { id: 'plumbing', label: 'Plumbing' },
  { id: 'electrical', label: 'Electrical' },
  { id: 'garage-door', label: 'Garage Doors' },
  { id: 'smart-home', label: 'Smart Home' },
  { id: 'tv-entertainment', label: 'TV & Entertainment' },
  { id: 'phone-repair', label: 'Phone Repair' },
  { id: 'handyman', label: 'Handyman Products' },
];

const B = '/images/brands';
const P = `${B}/plumbing`;
const E = `${B}/electrical`;
const S = `${B}/smart-home`;
const H = `${B}/hvac`;
const G = `${B}/garage-door`;
const TV = `${B}/tv`;
const PH = `${B}/phone`;
const HM = `${B}/handyman`;

/** Central brand catalog — each brand appears once with category tags. */
export const SERVICE_BRANDS: ServiceBrand[] = [
  // Appliances
  { id: 'whirlpool', name: 'Whirlpool', logo: `${B}/whirlpool.svg`, categories: ['appliances'], alt: 'Whirlpool logo', featured: true },
  { id: 'ge-appliances', name: 'GE Appliances', logo: `${B}/ge.svg`, categories: ['appliances'], alt: 'GE Appliances logo', featured: true },
  { id: 'samsung', name: 'Samsung', logo: `${B}/samsung.svg`, categories: ['appliances', 'tv-entertainment', 'phone-repair'], alt: 'Samsung logo', featured: true },
  { id: 'lg', name: 'LG', logo: `${B}/lg.svg`, categories: ['appliances', 'tv-entertainment', 'phone-repair'], alt: 'LG logo', featured: true },
  { id: 'maytag', name: 'Maytag', logo: `${B}/maytag.svg`, categories: ['appliances'], alt: 'Maytag logo', featured: true },
  { id: 'kitchenaid', name: 'KitchenAid', logo: `${B}/kitchenaid.svg`, categories: ['appliances'], alt: 'KitchenAid logo', featured: true },
  { id: 'frigidaire', name: 'Frigidaire', logo: `${B}/frigidaire.svg`, categories: ['appliances'], alt: 'Frigidaire logo', featured: true },
  { id: 'bosch', name: 'Bosch', logo: `${B}/bosch.svg`, categories: ['appliances'], alt: 'Bosch logo', featured: true },
  { id: 'electrolux', name: 'Electrolux', logo: `${B}/electrolux.svg`, categories: ['appliances'], alt: 'Electrolux logo', featured: true },
  { id: 'amana', name: 'Amana', logo: `${B}/amana.svg`, categories: ['appliances'], alt: 'Amana logo', featured: true },
  { id: 'kenmore', name: 'Kenmore', logo: `${B}/kenmore.svg`, categories: ['appliances'], alt: 'Kenmore logo', featured: true },
  { id: 'miele', name: 'Miele', categories: ['appliances'], alt: 'Miele', featured: true },

  // HVAC
  { id: 'carrier', name: 'Carrier', logo: `${H}/carrier.svg`, categories: ['hvac'], alt: 'Carrier logo', featured: true },
  { id: 'trane', name: 'Trane', logo: `${H}/trane.svg`, categories: ['hvac'], alt: 'Trane logo', featured: true },
  { id: 'lennox', name: 'Lennox', logo: `${H}/lennox.svg`, categories: ['hvac'], alt: 'Lennox logo', featured: true },
  { id: 'rheem-hvac', name: 'Rheem', logo: `${P}/rheem.svg`, categories: ['hvac', 'plumbing'], alt: 'Rheem logo', featured: true },
  { id: 'goodman', name: 'Goodman', logo: `${H}/goodman.svg`, categories: ['hvac'], alt: 'Goodman logo', featured: true },
  { id: 'york', name: 'York', logo: `${H}/york.svg`, categories: ['hvac'], alt: 'York logo', featured: true },
  { id: 'bryant', name: 'Bryant', logo: `${H}/bryant.svg`, categories: ['hvac'], alt: 'Bryant logo', featured: true },
  { id: 'american-standard-hvac', name: 'American Standard', logo: `${H}/american-standard.svg`, categories: ['hvac', 'plumbing'], alt: 'American Standard logo', featured: true },
  { id: 'daikin', name: 'Daikin', logo: `${H}/daikin.svg`, categories: ['hvac'], alt: 'Daikin logo', featured: true },
  { id: 'mitsubishi-electric', name: 'Mitsubishi Electric', logo: `${H}/mitsubishi-electric.svg`, categories: ['hvac'], alt: 'Mitsubishi Electric logo', featured: true },
  { id: 'fujitsu', name: 'Fujitsu', logo: `${H}/fujitsu.svg`, categories: ['hvac'], alt: 'Fujitsu logo' },
  { id: 'ruud', name: 'Ruud', logo: `${H}/ruud.svg`, categories: ['hvac'], alt: 'Ruud logo' },

  // Plumbing
  { id: 'moen', name: 'Moen', logo: `${P}/moen.svg`, categories: ['plumbing'], alt: 'Moen logo', featured: true },
  { id: 'delta', name: 'Delta', logo: `${P}/delta.svg`, categories: ['plumbing'], alt: 'Delta logo', featured: true },
  { id: 'kohler', name: 'Kohler', logo: `${P}/kohler.svg`, categories: ['plumbing'], alt: 'Kohler logo', featured: true },
  { id: 'grohe', name: 'Grohe', categories: ['plumbing'], alt: 'Grohe', featured: true },
  { id: 'pfister', name: 'Pfister', categories: ['plumbing'], alt: 'Pfister', featured: true },
  { id: 'toto', name: 'Toto', categories: ['plumbing'], alt: 'Toto', featured: true },
  { id: 'rinnai', name: 'Rinnai', categories: ['plumbing'], alt: 'Rinnai', featured: true },
  { id: 'navien', name: 'Navien', categories: ['plumbing'], alt: 'Navien' },
  { id: 'bradford-white', name: 'Bradford White', categories: ['plumbing'], alt: 'Bradford White' },
  { id: 'ao-smith', name: 'AO Smith', logo: `${P}/ao-smith.svg`, categories: ['plumbing'], alt: 'AO Smith logo', featured: true },
  { id: 'insinkerator', name: 'InSinkErator', logo: `${P}/insinkerator.svg`, categories: ['plumbing'], alt: 'InSinkErator logo' },

  // Electrical
  { id: 'leviton', name: 'Leviton', logo: `${E}/leviton.svg`, categories: ['electrical'], alt: 'Leviton logo', featured: true },
  { id: 'lutron', name: 'Lutron', logo: `${E}/lutron.svg`, categories: ['electrical'], alt: 'Lutron logo', featured: true },
  { id: 'eaton', name: 'Eaton', logo: `${E}/eaton.svg`, categories: ['electrical'], alt: 'Eaton logo', featured: true },
  { id: 'siemens', name: 'Siemens', categories: ['electrical'], alt: 'Siemens', featured: true },
  { id: 'square-d', name: 'Square D', logo: `${E}/square-d.svg`, categories: ['electrical'], alt: 'Square D logo', featured: true },
  { id: 'ge-electrical', name: 'GE', logo: `${E}/ge-lighting.svg`, categories: ['electrical'], alt: 'GE logo', featured: true },
  { id: 'legrand', name: 'Legrand', logo: `${E}/legrand.svg`, categories: ['electrical'], alt: 'Legrand logo', featured: true },
  { id: 'philips-hue', name: 'Philips Hue', categories: ['electrical', 'smart-home'], alt: 'Philips Hue', featured: true },

  // Garage doors
  { id: 'liftmaster', name: 'LiftMaster', logo: `${G}/liftmaster.svg`, categories: ['garage-door'], alt: 'LiftMaster logo', featured: true },
  { id: 'chamberlain', name: 'Chamberlain', logo: `${G}/chamberlain.svg`, categories: ['garage-door'], alt: 'Chamberlain logo', featured: true },
  { id: 'genie', name: 'Genie', logo: `${G}/genie.svg`, categories: ['garage-door'], alt: 'Genie logo', featured: true },
  { id: 'craftsman', name: 'Craftsman', logo: `${G}/craftsman.svg`, categories: ['garage-door'], alt: 'Craftsman logo', featured: true },
  { id: 'clopay', name: 'Clopay', logo: `${G}/clopay.svg`, categories: ['garage-door'], alt: 'Clopay logo', featured: true },
  { id: 'amarr', name: 'Amarr', logo: `${G}/amarr.svg`, categories: ['garage-door'], alt: 'Amarr logo', featured: true },
  { id: 'wayne-dalton', name: 'Wayne Dalton', logo: `${G}/wayne-dalton.svg`, categories: ['garage-door'], alt: 'Wayne Dalton logo', featured: true },
  { id: 'linear', name: 'Linear', logo: `${G}/linear.svg`, categories: ['garage-door'], alt: 'Linear logo' },
  { id: 'sommer', name: 'Sommer', logo: `${G}/sommer.svg`, categories: ['garage-door'], alt: 'Sommer logo' },

  // Smart home (shared logos also tagged for electrical where relevant)
  { id: 'google-nest', name: 'Google Nest', logo: `${S}/nest.svg`, categories: ['smart-home', 'electrical'], alt: 'Google Nest logo', featured: true },
  { id: 'ring', name: 'Ring', logo: `${S}/ring.svg`, categories: ['smart-home', 'electrical'], alt: 'Ring logo', featured: true },
  { id: 'alexa', name: 'Amazon Alexa', logo: `${S}/alexa.svg`, categories: ['smart-home'], alt: 'Amazon Alexa logo', featured: true },
  { id: 'ecobee', name: 'Ecobee', logo: `${S}/ecobee.svg`, categories: ['smart-home'], alt: 'Ecobee logo', featured: true },
  { id: 'arlo', name: 'Arlo', logo: `${S}/arlo.svg`, categories: ['smart-home'], alt: 'Arlo logo', featured: true },
  { id: 'google-home', name: 'Google Home', logo: `${S}/google-home.svg`, categories: ['smart-home'], alt: 'Google Home logo', featured: true },
  { id: 'eufy', name: 'Eufy', categories: ['smart-home'], alt: 'Eufy', featured: true },
  { id: 'wyze', name: 'Wyze', categories: ['smart-home'], alt: 'Wyze' },
  { id: 'august', name: 'August', categories: ['smart-home'], alt: 'August' },
  { id: 'schlage', name: 'Schlage', categories: ['smart-home'], alt: 'Schlage' },
  { id: 'yale', name: 'Yale', categories: ['smart-home'], alt: 'Yale' },
  { id: 'tp-link-kasa', name: 'TP-Link Kasa', logo: `${E}/kasa.svg`, categories: ['smart-home', 'electrical'], alt: 'TP-Link Kasa logo' },

  // TV & entertainment
  { id: 'sony', name: 'Sony', logo: `${TV}/sony.svg`, categories: ['tv-entertainment', 'phone-repair'], alt: 'Sony logo', featured: true },
  { id: 'tcl', name: 'TCL', logo: `${TV}/tcl.svg`, categories: ['tv-entertainment'], alt: 'TCL logo', featured: true },
  { id: 'hisense', name: 'Hisense', logo: `${TV}/hisense.svg`, categories: ['tv-entertainment'], alt: 'Hisense logo', featured: true },
  { id: 'vizio', name: 'Vizio', logo: `${TV}/vizio.svg`, categories: ['tv-entertainment'], alt: 'Vizio logo', featured: true },
  { id: 'panasonic', name: 'Panasonic', logo: `${TV}/panasonic.svg`, categories: ['tv-entertainment'], alt: 'Panasonic logo', featured: true },
  { id: 'philips-tv', name: 'Philips', logo: `${TV}/philips.svg`, categories: ['tv-entertainment'], alt: 'Philips logo' },
  { id: 'roku', name: 'Roku', logo: `${TV}/roku.svg`, categories: ['tv-entertainment'], alt: 'Roku logo', featured: true },
  { id: 'fire-tv', name: 'Amazon Fire TV', logo: `${TV}/fire-tv.svg`, categories: ['tv-entertainment'], alt: 'Amazon Fire TV logo' },

  // Phone repair
  { id: 'apple', name: 'Apple', logo: `${PH}/apple.svg`, categories: ['phone-repair'], alt: 'Apple logo', featured: true },
  { id: 'google-pixel', name: 'Google', logo: `${PH}/google.svg`, categories: ['phone-repair'], alt: 'Google logo', featured: true },
  { id: 'motorola', name: 'Motorola', logo: `${PH}/motorola.svg`, categories: ['phone-repair'], alt: 'Motorola logo', featured: true },
  { id: 'oneplus', name: 'OnePlus', logo: `${PH}/oneplus.svg`, categories: ['phone-repair'], alt: 'OnePlus logo', featured: true },
  { id: 'nokia', name: 'Nokia', logo: `${PH}/nokia.svg`, categories: ['phone-repair'], alt: 'Nokia logo' },

  // Handyman
  { id: 'ikea', name: 'IKEA', logo: `${HM}/ikea.svg`, categories: ['handyman'], alt: 'IKEA logo', featured: true },
  { id: 'wayfair', name: 'Wayfair', logo: `${HM}/wayfair.svg`, categories: ['handyman'], alt: 'Wayfair logo', featured: true },
  { id: 'ashley', name: 'Ashley', logo: `${HM}/ashley.svg`, categories: ['handyman'], alt: 'Ashley logo', featured: true },
  { id: 'sauder', name: 'Sauder', logo: `${HM}/sauder.svg`, categories: ['handyman'], alt: 'Sauder logo', featured: true },
  { id: 'closetmaid', name: 'ClosetMaid', logo: `${HM}/closetmaid.svg`, categories: ['handyman'], alt: 'ClosetMaid logo', featured: true },
  { id: 'rubbermaid', name: 'Rubbermaid', logo: `${HM}/rubbermaid.svg`, categories: ['handyman'], alt: 'Rubbermaid logo', featured: true },
  { id: 'elfa', name: 'Elfa', logo: `${HM}/elfa.svg`, categories: ['handyman'], alt: 'Elfa logo' },
  { id: 'home-decorators', name: 'Home Decorators Collection', logo: `${HM}/home-decorators.svg`, categories: ['handyman'], alt: 'Home Decorators Collection logo' },
];

export const BRANDS_SECTION_CONFIGS: Record<BrandCategoryId, BrandsSectionConfig> = {
  appliances: {
    category: 'appliances',
    title: 'Appliance Brands We Service',
    description:
      'We service many major appliance brands across refrigerators, washers, dryers, ovens, dishwashers, and other household appliances.',
    contactServiceId: 'home-appliances',
    initialVisibleCount: 12,
  },
  hvac: {
    category: 'hvac',
    title: 'HVAC Brands We Service',
    description:
      'Our technicians work with many common heating, cooling, thermostat, and indoor-air equipment brands.',
    contactServiceId: 'hvac-services',
    initialVisibleCount: 10,
  },
  plumbing: {
    category: 'plumbing',
    title: 'Plumbing Fixture and Equipment Brands',
    description:
      'We work with leading plumbing fixture, water heater, and water system brands for repair and installation.',
    contactServiceId: 'plumbing-services',
    initialVisibleCount: 10,
  },
  electrical: {
    category: 'electrical',
    title: 'Electrical and Smart Device Brands',
    description:
      'We install and service fixtures, panels, switches, and connected devices from many common electrical brands.',
    contactServiceId: 'electrical-services',
    initialVisibleCount: 10,
  },
  'garage-door': {
    category: 'garage-door',
    title: 'Garage Door Brands We Service',
    description:
      'Our technicians work on many common garage door openers, panels, and hardware brands.',
    contactServiceId: 'garage-door-repair',
    initialVisibleCount: 9,
  },
  'smart-home': {
    category: 'smart-home',
    title: 'Smart Home Brands We Install',
    description:
      'We install and configure many popular smart-home devices, subject to compatibility, wiring, Wi-Fi, and account requirements.',
    contactServiceId: 'smart-home-setup',
    initialVisibleCount: 10,
  },
  'tv-entertainment': {
    category: 'tv-entertainment',
    title: 'TV Brands We Mount',
    description:
      'We mount most major television brands when the TV, wall type, bracket, and installation conditions are compatible.',
    contactServiceId: 'tv-mounting',
    initialVisibleCount: 8,
  },
  'phone-repair': {
    category: 'phone-repair',
    title: 'Phone Brands We Repair',
    description:
      'Repair availability depends on the phone model, issue, replacement-part availability, and technician coverage.',
    contactServiceId: 'phone-repair',
    initialVisibleCount: 8,
  },
  handyman: {
    category: 'handyman',
    title: 'Furniture and Hardware Brands We Work With',
    description:
      'We assemble and install products from many common furniture, storage, shelving, and home-improvement brands.',
    contactServiceId: 'handyman',
    initialVisibleCount: 8,
  },
};

export const RESOURCES_BRANDS_CONFIG: BrandsSectionConfig = {
  category: 'appliances',
  title: 'Brands We Service',
  description:
    'Explore many of the major appliance, HVAC, plumbing, electrical, smart-home, garage-door, television, mobile-device, and home-service brands our team may support.',
  contactServiceId: '',
};

export const SERVICE_SLUG_TO_BRAND_CATEGORY: Record<string, BrandCategoryId> = {
  'home-appliances': 'appliances',
  'appliance-repair': 'appliances',
  hvac: 'hvac',
  plumbing: 'plumbing',
  electrical: 'electrical',
  'smart-home': 'smart-home',
  'garage-door': 'garage-door',
  'garage-door-repair': 'garage-door',
  'tv-mounting': 'tv-entertainment',
  'phone-repair': 'phone-repair',
  handyman: 'handyman',
};

const BRAND_DISCLAIMER =
  'Brand names and logos belong to their respective owners. Displaying a brand does not imply manufacturer authorization, endorsement, or affiliation.';

export function getBrandDisclaimer(): string {
  return BRAND_DISCLAIMER;
}

export function getBrandsSectionConfig(category: BrandCategoryId): BrandsSectionConfig {
  return BRANDS_SECTION_CONFIGS[category];
}

export function getBrandsForCategory(category: BrandCategoryId): ServiceBrand[] {
  return SERVICE_BRANDS.filter((brand) => brand.categories.includes(category)).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

export function getAllBrands(): ServiceBrand[] {
  return [...SERVICE_BRANDS].sort((a, b) => a.name.localeCompare(b.name));
}

export function filterBrands(
  brands: ServiceBrand[],
  options: { category?: BrandCategoryId | 'all'; query?: string },
): ServiceBrand[] {
  let result = brands;
  if (options.category && options.category !== 'all') {
    result = result.filter((brand) => brand.categories.includes(options.category as BrandCategoryId));
  }
  const q = options.query?.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (brand) => brand.name.toLowerCase().includes(q) || brand.id.toLowerCase().includes(q),
    );
  }
  return result;
}

export function getContactUrlForCategory(contactServiceId: string): string {
  if (!contactServiceId) return '/contact';
  return `/contact?service=${encodeURIComponent(contactServiceId)}`;
}

/** Preferred homepage / footer marquee order (logos first). */
const HOMEPAGE_MARQUEE_ORDER = [
  'samsung',
  'lg',
  'whirlpool',
  'ge-appliances',
  'maytag',
  'frigidaire',
  'bosch',
  'kitchenaid',
  'electrolux',
  'amana',
  'kenmore',
  'miele',
] as const;

/** Footer / homepage marquee — appliance brands with colored logos, preferred order. */
export function getFooterMarqueeBrands(): ServiceBrand[] {
  const byId = new Map(getBrandsForCategory('appliances').map((brand) => [brand.id, brand]));
  const ordered = HOMEPAGE_MARQUEE_ORDER.map((id) => byId.get(id)).filter(
    (brand): brand is ServiceBrand => Boolean(brand),
  );
  // Prefer logo assets so the strip reads as colored icons, not text pills.
  const withLogos = ordered.filter((brand) => Boolean(brand.logo));
  const textOnly = ordered.filter((brand) => !brand.logo);
  return [...withLogos, ...textOnly];
}

export function parseBrandCategoryParam(raw: string | null): BrandCategoryId | 'all' {
  if (!raw || raw === 'all') return 'all';
  const normalized = raw.trim().toLowerCase();
  const aliases: Record<string, BrandCategoryId | 'all'> = {
    appliances: 'appliances',
    appliance: 'appliances',
    'appliance-repair': 'appliances',
    'home-appliances': 'appliances',
    hvac: 'hvac',
    plumbing: 'plumbing',
    electrical: 'electrical',
    'garage-door': 'garage-door',
    'garage-doors': 'garage-door',
    'smart-home': 'smart-home',
    smarthome: 'smart-home',
    tv: 'tv-entertainment',
    'tv-mounting': 'tv-entertainment',
    'tv-entertainment': 'tv-entertainment',
    'phone-repair': 'phone-repair',
    phone: 'phone-repair',
    handyman: 'handyman',
  };
  return aliases[normalized] ?? 'all';
}
