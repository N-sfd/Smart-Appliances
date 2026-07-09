import {
  homeApplianceIconCards,
  plumbingIconCards,
  smartHomeIconCards,
  hvacIconCards,
  electricalIconCards,
  tvMountingIconCards,
  phoneRepairIconCards,
  handymanIconCards,
  HUB_CATEGORY_IDS,
} from './serviceHubConfigs';
import type { HubIconCard } from './serviceHubConfigs';
import { CATEGORY_HERO_IMAGE } from './expandedServiceImages';

export interface CategoryFaq {
  question: string;
  answer: string;
}

export interface CategoryHowItWorksStep {
  step: string;
  title: string;
  description: string;
}

export interface IconChipItem {
  label: string;
  /** Lucide icon component name, e.g. 'Plug', 'Fan' */
  iconName: string;
}

export interface CategoryBrandConfig {
  title: string;
  subtitle: string;
  brands: string[];
  secondaryBrands?: string[];
  variant: 'marquee' | 'pills' | 'logo-marquee' | 'icon-pills';
  /** Chips with icons — used when variant is icon-pills */
  iconChips?: IconChipItem[];
  /** Which logo set to use when variant is logo-marquee or icon-pills brand strip */
  logoMarqueeSet?: 'smart-home' | 'plumbing' | 'electrical';
  /** Show logos without pill/oval backgrounds (logo-marquee only) */
  logoMarqueePlain?: boolean;
  /** Compact icon pill chips (icon-pills variant) */
  compactIconPills?: boolean;
  /** Where to render the brand strip on the page */
  placement?: 'before-booking' | 'after-icon-selection' | 'with-icon-header' | 'before-how-it-works';
  /** For icon-pills: render logo marquee separately before How It Works */
  marqueePlacement?: 'inline' | 'before-how-it-works';
  /** Title/subtitle for marquee when split from icon-pills header */
  marqueeTitle?: string;
  marqueeSubtitle?: string;
}

export interface ServiceCategoryPageConfig {
  slug: string;
  categoryId: string;
  hero: {
    title: string;
    subtitle: string;
    image: string;
    primaryCta: string;
    secondaryCta?: string;
    layout: 'split' | 'banner';
    trustBullets?: string[];
    /** Lighter navy overlay on banner hero — keeps photo more visible */
    overlayLight?: boolean;
    /** Override background color for split-layout hero */
    heroBg?: string;
    /** CSS object-position for circular split hero image */
    imagePosition?: string;
  };
  iconSectionTitle: string;
  iconSectionSubtitle?: string;
  iconCards: HubIconCard[];
  popularSectionTitle: string;
  popularSectionSubtitle?: string;
  brandSection?: CategoryBrandConfig;
  howItWorks: CategoryHowItWorksStep[];
  howItWorksTitle?: string;
  howItWorksSubtitle?: string;
  safetyNotice?: { title: string; text: string };
  faqs: CategoryFaq[];
  faqTitle?: string;
  bottomCta: {
    title: string;
    subtitle: string;
    primaryLabel: string;
    secondaryLabel?: string;
  };
  desktopIconColumns?: 3 | 4 | 5;
  detailPanelVariant?: 'default' | 'electrical';
  cardHoverLift?: boolean;
  /** Smaller clickable icon cards in the booking grid */
  compactIconCards?: boolean;
}

const BASE = '/images/services';

const DEFAULT_HOW_IT_WORKS: CategoryHowItWorksStep[] = [
  { step: '1', title: 'Choose your service', description: 'Select the device or issue you need help with from the options above.' },
  { step: '2', title: 'Pick a time', description: 'Book a convenient appointment — same-day options may be available.' },
  { step: '3', title: 'We handle the rest', description: 'A qualified technician arrives, completes the work, and walks you through next steps.' },
];

export const homeAppliancesPageConfig: ServiceCategoryPageConfig = {
  slug: 'home-appliances',
  categoryId: HUB_CATEGORY_IDS.appliances,
  hero: {
    title: 'Fast, Certified Appliance Repair — Same-Day Service',
    subtitle:
      'Book trusted technicians for appliance repair, installation, diagnostics, and urgent appliance service.',
    image: `${BASE}/home-appliances/hero.jpg`,
    primaryCta: 'Book Appliance Service',
    secondaryCta: 'Emergency Repair',
    layout: 'split',
    trustBullets: ['Licensed & Insured', 'Same-Day Availability', 'Certified Technicians'],
  },
  iconSectionTitle: 'What appliance needs service?',
  iconCards: homeApplianceIconCards,
  popularSectionTitle: 'Popular Appliance Services',
  brandSection: {
    title: 'Brands We Service',
    subtitle: 'Our technicians service most major appliance brands.',
    brands: ['GE', 'Whirlpool', 'Samsung', 'LG', 'Bosch', 'Frigidaire', 'Maytag'],
    variant: 'marquee',
    placement: 'before-how-it-works',
  },
  howItWorks: DEFAULT_HOW_IT_WORKS,
  faqs: [
    {
      question: 'Do you repair all major appliance brands?',
      answer: 'Yes. Our technicians work on most major appliance brands including Samsung, LG, Whirlpool, GE, Bosch, and more.',
    },
    {
      question: 'Do you install new appliances?',
      answer: 'Yes. We offer installation for refrigerators, dishwashers, washers, dryers, ranges, and other common appliances.',
    },
    {
      question: 'Is there a diagnostic fee?',
      answer: 'Your technician provides an upfront estimate before any repair work begins so you know what to expect.',
    },
    {
      question: 'Can I request same-day service?',
      answer: 'Same-day appointments are often available depending on your location and technician availability.',
    },
    {
      question: 'Do you offer emergency appliance service?',
      answer: 'Yes. Use our emergency booking option for urgent issues like major leaks from appliances or complete loss of cooling.',
    },
  ],
  bottomCta: {
    title: 'Need appliance repair today?',
    subtitle: 'Schedule online or request emergency service.',
    primaryLabel: 'Book Appliance Service',
    secondaryLabel: 'Emergency Repair',
  },
  desktopIconColumns: 4,
  cardHoverLift: true,
};

export const plumbingPageConfig: ServiceCategoryPageConfig = {
  slug: 'plumbing',
  categoryId: HUB_CATEGORY_IDS.plumbing,
  hero: {
    title: 'Professional Plumbing Services',
    subtitle:
      'Book help for leaks, drains, faucets, toilets, water heaters, garbage disposals, and urgent plumbing issues.',
    image: `${BASE}/plumbing-service.jpg`,
    primaryCta: 'Schedule Plumbing Service',
    secondaryCta: 'Emergency Plumbing',
    layout: 'banner',
    trustBullets: ['Licensed & Insured', 'Same-Day Availability', 'Safety-Focused Service'],
  },
  iconSectionTitle: 'What plumbing issue do you need help with?',
  iconCards: plumbingIconCards,
  popularSectionTitle: 'Popular Plumbing Services',
  brandSection: {
    title: 'Plumbing Fixtures & Systems We Service',
    subtitle: 'We work with leading fixture and water system brands.',
    brands: ['Moen', 'Delta', 'Kohler', 'Rheem', 'AO Smith', 'InSinkErator'],
    variant: 'logo-marquee',
    logoMarqueeSet: 'plumbing',
    logoMarqueePlain: true,
    placement: 'after-icon-selection',
  },
  howItWorks: DEFAULT_HOW_IT_WORKS,
  faqs: [
    {
      question: 'Do you handle urgent plumbing issues?',
      answer: 'Yes. We offer emergency plumbing service for burst pipes, major leaks, and other urgent situations.',
    },
    {
      question: 'Do you repair faucets and toilets?',
      answer: 'Yes. We repair and replace faucets, toilets, and related bathroom and kitchen fixtures.',
    },
    {
      question: 'Can you help with drain clogs?',
      answer: 'Yes. Our technicians clear slow or blocked drains using professional equipment.',
    },
    {
      question: 'Do you service water heaters?',
      answer: 'Yes. We diagnose, repair, and maintain tank and tankless water heaters from major brands.',
    },
    {
      question: 'Should I call 911 for gas or serious safety issues?',
      answer: 'If you smell gas, suspect a gas leak, or have a life-threatening emergency, leave the area and call 911 immediately before scheduling service.',
    },
  ],
  bottomCta: {
    title: 'Need a plumber today?',
    subtitle: 'Schedule online or request emergency plumbing help.',
    primaryLabel: 'Schedule Plumbing Service',
    secondaryLabel: 'Emergency Plumbing',
  },
  desktopIconColumns: 4,
  cardHoverLift: true,
};

export const smartHomePageConfig: ServiceCategoryPageConfig = {
  slug: 'smart-home',
  categoryId: HUB_CATEGORY_IDS.smartHome,
  hero: {
    title: 'Smart Home Setup & Installation',
    subtitle:
      'Get help installing and connecting smart devices, security cameras, video doorbells, thermostats, hubs, speakers, and WiFi-connected home technology.',
    image: CATEGORY_HERO_IMAGE['smart-home'],
    primaryCta: 'Book Smart Home Service',
    secondaryCta: 'Ask About Installation',
    layout: 'split',
    imagePosition: 'center top',
  },
  iconSectionTitle: 'What smart home device do you need help with?',
  iconCards: smartHomeIconCards,
  popularSectionTitle: 'Popular Smart Home Services',
  brandSection: {
    title: 'Smart Home Brands We Support',
    subtitle: 'We help install and connect many popular smart home devices and ecosystems.',
    brands: ['Ring', 'Nest', 'Google Home', 'Alexa', 'Ecobee', 'Arlo'],
    variant: 'logo-marquee',
    logoMarqueePlain: true,
    placement: 'after-icon-selection',
  },
  howItWorks: DEFAULT_HOW_IT_WORKS,
  faqs: [
    {
      question: 'Do I need WiFi for smart home devices?',
      answer: 'Most smart devices require a WiFi connection for full features. Have your network name and password ready for setup.',
    },
    {
      question: 'Can you install video doorbells?',
      answer: 'Yes. We install and configure popular video doorbells including Ring, Nest, and similar models.',
    },
    {
      question: 'Can you connect devices to a smart hub?',
      answer: 'Yes, when your devices are compatible with your hub or voice assistant ecosystem.',
    },
    {
      question: 'Will the technician show me how to use the app?',
      answer: 'Yes. We provide a brief walkthrough of the app and main device features before we leave.',
    },
    {
      question: 'Can smart devices be installed outside?',
      answer: 'Many cameras and doorbells are rated for outdoor use. Your technician can advise on placement and weather considerations.',
    },
    {
      question: 'What if my WiFi signal is weak?',
      answer: 'Weak signal can affect performance. We can recommend extenders or mesh options and help optimize device placement.',
    },
  ],
  bottomCta: {
    title: 'Ready to upgrade your home?',
    subtitle: 'Book smart home installation online in minutes.',
    primaryLabel: 'Book Smart Home Service',
    secondaryLabel: 'Ask About Installation',
  },
  desktopIconColumns: 4,
  cardHoverLift: true,
};

export const hvacPageConfig: ServiceCategoryPageConfig = {
  slug: 'hvac',
  categoryId: HUB_CATEGORY_IDS.hvac,
  hero: {
    title: 'HVAC Services — Heating, Cooling & Air Quality',
    subtitle: 'Heating, cooling, and ventilation service from certified HVAC technicians.',
    image: `${BASE}/hvac-service.jpg`,
    primaryCta: 'Book HVAC Service',
    secondaryCta: 'Emergency HVAC Help',
    layout: 'banner',
    trustBullets: ['Licensed & Insured', 'Same-Day Availability', 'Safety-Focused Service'],
  },
  iconSectionTitle: 'What HVAC service do you need?',
  iconCards: hvacIconCards,
  popularSectionTitle: 'Popular HVAC Services',
  brandSection: {
    title: 'Brands We Service',
    subtitle: 'Trusted HVAC equipment and thermostat brands we work with.',
    brands: ['Carrier', 'Trane', 'Lennox', 'Rheem', 'Goodman', 'Honeywell'],
    variant: 'logo-marquee',
    logoMarqueePlain: true,
    placement: 'after-icon-selection',
  },
  howItWorks: DEFAULT_HOW_IT_WORKS,
  faqs: [
    {
      question: 'Do you repair both heating and cooling systems?',
      answer: 'Yes. We service air conditioners, furnaces, heat pumps, and related HVAC equipment.',
    },
    {
      question: 'How often should I schedule HVAC maintenance?',
      answer: 'Most systems benefit from seasonal tune-ups in spring and fall to maintain efficiency and reliability.',
    },
    {
      question: 'Can you install a new thermostat?',
      answer: 'Yes. We install and configure standard and smart thermostats.',
    },
    {
      question: 'Do you offer emergency HVAC service?',
      answer: 'Yes. Emergency service is available for no-heat and no-cooling situations when slots are open.',
    },
  ],
  bottomCta: {
    title: 'Need HVAC help?',
    subtitle: 'Schedule online or request emergency HVAC service.',
    primaryLabel: 'Book HVAC Service',
    secondaryLabel: 'Emergency HVAC Help',
  },
  desktopIconColumns: 3,
  cardHoverLift: true,
};

export const electricalPageConfig: ServiceCategoryPageConfig = {
  slug: 'electrical',
  categoryId: HUB_CATEGORY_IDS.electrical,
  hero: {
    title: 'Electrical Services for Appliances, Fixtures & Smart Devices',
    subtitle:
      'Get help with outlets, switches, light fixtures, breakers, panels, smart devices, and appliance electrical connections.',
    image: `${BASE}/electrical/hero.jpg`,
    imagePosition: '28% center',
    primaryCta: 'Book Electrical Service',
    secondaryCta: 'Emergency Electrical Help',
    layout: 'split',
    trustBullets: ['Licensed & Insured', 'Same-Day Availability', 'Safety-Focused Service'],
    heroBg: '#F5F7FA',
  },
  iconSectionTitle: '',
  iconCards: electricalIconCards,
  popularSectionTitle: 'Popular Electrical Services',
  popularSectionSubtitle: 'Select a service to see details and schedule a technician.',
  brandSection: {
    title: 'What electrical service do you need?',
    subtitle: 'Choose the type of electrical issue or installation you need help with.',
    brands: ['Leviton', 'Lutron', 'GE Lighting', 'Kasa', 'TP-Link', 'Eaton', 'Square D', 'Legrand'],
    iconChips: [
      { label: 'Outlets', iconName: 'Plug' },
      { label: 'Switches', iconName: 'ToggleLeft' },
      { label: 'Light Fixtures', iconName: 'Lightbulb' },
      { label: 'Ceiling Fans', iconName: 'Fan' },
      { label: 'Breakers', iconName: 'Zap' },
      { label: 'Panels', iconName: 'PanelsTopLeft' },
      { label: 'Smart Switches', iconName: 'Wifi' },
      { label: 'Appliance Connections', iconName: 'Cable' },
    ],
    variant: 'icon-pills',
    logoMarqueeSet: 'electrical',
    logoMarqueePlain: true,
    compactIconPills: true,
    placement: 'with-icon-header',
    marqueePlacement: 'before-how-it-works',
    marqueeTitle: 'Brands We Service',
    marqueeSubtitle: 'Trusted electrical fixture, device, and smart-home brands we support.',
  },
  howItWorksTitle: 'How Electrical Service Works',
  howItWorks: [
    {
      step: '1',
      title: 'Choose your electrical issue',
      description: 'Select the service type that best matches what you need help with.',
    },
    {
      step: '2',
      title: 'Tell us what is happening',
      description: 'Share details about the issue so we can match the right technician.',
    },
    {
      step: '3',
      title: 'Get contacted and scheduled',
      description: 'We confirm availability and schedule your visit at a convenient time.',
    },
    {
      step: '4',
      title: 'Technician inspects and explains the estimate',
      description: 'Your technician inspects the work, explains options, and provides an estimate before starting.',
    },
  ],
  faqTitle: 'Electrical Service FAQs',
  faqs: [
    {
      question: 'Do you repair outlets and switches?',
      answer:
        'Yes. We can help with faulty outlets, loose outlets, non-working switches, and common connection issues.',
    },
    {
      question: 'Can you install light fixtures?',
      answer: 'Yes. We can install or replace many indoor and outdoor light fixtures.',
    },
    {
      question: 'Can you install ceiling fans?',
      answer: 'Yes. We can install, replace, or troubleshoot ceiling fans and related controls.',
    },
    {
      question: 'What if I smell burning or see sparks?',
      answer:
        'Stop using the affected area immediately. If there is an active safety hazard, call emergency services first.',
    },
    {
      question: 'Can you connect appliances that need electrical setup?',
      answer: 'Yes. We can help with appliance electrical connections and safety checks where supported.',
    },
    {
      question: 'Do you provide same-day electrical service?',
      answer:
        'Same-day availability may be offered depending on location, technician availability, and issue type.',
    },
  ],
  bottomCta: {
    title: 'Need electrical help?',
    subtitle: "Choose your service, tell us the issue, and we'll help you schedule the right technician.",
    primaryLabel: 'Book Electrical Service',
    secondaryLabel: 'Request Emergency Help',
  },
  desktopIconColumns: 4,
  detailPanelVariant: 'electrical',
  cardHoverLift: true,
  compactIconCards: true,
};

export const SERVICE_CATEGORY_PAGE_MAP: Record<string, ServiceCategoryPageConfig> = {
  'home-appliances': homeAppliancesPageConfig,
  plumbing: plumbingPageConfig,
  'smart-home': smartHomePageConfig,
  hvac: hvacPageConfig,
  electrical: electricalPageConfig,
  'tv-mounting': {
    slug: 'tv-mounting',
    categoryId: 'tv-mounting',
    hero: {
      title: 'Professional TV Mounting',
      subtitle: 'Secure mounting, wire concealment, soundbar installation, and media device setup.',
      image: CATEGORY_HERO_IMAGE['tv-mounting'],
      primaryCta: 'Book TV Mounting',
      layout: 'split',
      trustBullets: ['Clean cable management', 'Standard and large TVs', 'Same-day options'],
    },
    iconSectionTitle: 'What TV service do you need?',
    iconCards: tvMountingIconCards,
    popularSectionTitle: 'Popular TV Mounting Services',
    howItWorks: DEFAULT_HOW_IT_WORKS,
    faqs: [
      { question: 'Do I need to buy the mount first?', answer: 'You can purchase your own mount or ask your technician for recommendations during booking.' },
      { question: 'Can you hide the wires?', answer: 'Yes. Wire concealment is available as an add-on service during booking.' },
    ],
    bottomCta: {
      title: 'Ready to mount your TV?',
      subtitle: 'Book online and tell us your wall type and TV size.',
      primaryLabel: 'Schedule TV Mounting',
    },
    desktopIconColumns: 3,
    cardHoverLift: true,
  },
  'phone-repair': {
    slug: 'phone-repair',
    categoryId: 'phone-repair',
    hero: {
      title: 'Fast, Convenient Phone Repair',
      subtitle: 'Screen, battery, charging port, and diagnostic services for popular devices.',
      image: CATEGORY_HERO_IMAGE['phone-repair'],
      primaryCta: 'Book Phone Repair',
      layout: 'split',
      trustBullets: ['Diagnostics available', 'Major brands supported', 'No passcodes collected online'],
    },
    iconSectionTitle: 'What phone issue do you have?',
    iconCards: phoneRepairIconCards,
    popularSectionTitle: 'Popular Phone Repair Services',
    howItWorks: DEFAULT_HOW_IT_WORKS,
    faqs: [
      { question: 'Do you need my passcode?', answer: 'No. We do not collect device passcodes or full serial numbers during online booking.' },
      { question: 'Can you repair water damage?', answer: 'We offer water-damage assessment and will recommend the safest next step after inspection.' },
    ],
    bottomCta: {
      title: 'Need phone repair help?',
      subtitle: 'Tell us your device model and issue to get started.',
      primaryLabel: 'Book Phone Repair',
    },
    desktopIconColumns: 3,
    cardHoverLift: true,
  },
  handyman: {
    slug: 'handyman',
    categoryId: 'handyman',
    hero: {
      title: 'Professional Handyman Services',
      subtitle: 'Furniture assembly, hanging, drywall repair, and minor home fixes.',
      image: CATEGORY_HERO_IMAGE.handyman,
      primaryCta: 'Book Handyman Service',
      layout: 'split',
      trustBullets: ['Transparent estimates', 'Skilled local technicians', 'Flexible project sizes'],
    },
    iconSectionTitle: 'What handyman help do you need?',
    iconCards: handymanIconCards,
    popularSectionTitle: 'Popular Handyman Services',
    howItWorks: DEFAULT_HOW_IT_WORKS,
    faqs: [
      { question: 'Is this hourly or flat-rate?', answer: 'Many jobs start at a listed price; larger projects may require an on-site quote.' },
      { question: 'Do I need to supply materials?', answer: 'Tell us during booking whether materials are already purchased so we can plan accordingly.' },
    ],
    bottomCta: {
      title: 'Need a handyman?',
      subtitle: 'Describe your project and pick a convenient time.',
      primaryLabel: 'Book Handyman Service',
    },
    desktopIconColumns: 3,
    cardHoverLift: true,
  },
};
