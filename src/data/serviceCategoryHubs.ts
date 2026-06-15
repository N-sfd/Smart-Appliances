/** Aggregate hub routes → full category IDs in serviceCategories */
export type ServicesBrowseTab = 'appliances' | 'plumbing' | 'hvac' | 'electrical';

export const CATEGORY_HUB_MAP: Record<string, string> = {
  'plumbing-support': 'plumbing-services',
  'hvac-support': 'hvac-services',
  'electrical-support': 'electrical-services',
  plumbing: 'plumbing-services',
  hvac: 'hvac-services',
  electrical: 'electrical-services',
};

export const HUB_TAB_MAP: Record<string, ServicesBrowseTab> = {
  'plumbing-support': 'plumbing',
  'hvac-support': 'hvac',
  'electrical-support': 'electrical',
  plumbing: 'plumbing',
  hvac: 'hvac',
  electrical: 'electrical',
};

export const HUB_TITLES: Record<string, string> = {
  'plumbing-support': 'Plumbing Services',
  'hvac-support': 'HVAC Services',
  'electrical-support': 'Electrical Services',
  plumbing: 'Plumbing Services',
  hvac: 'HVAC Services',
  electrical: 'Electrical Services',
};

export const EMERGENCY_SERVICE_IDS = new Set([
  'emergency-repair',
  'emergency-hvac-service',
  'emergency-plumbing',
  'emergency-electrical-service',
]);

export const SERVICES_BROWSE_TABS: { id: ServicesBrowseTab; label: string }[] = [
  { id: 'appliances', label: 'Appliances' },
  { id: 'plumbing', label: 'Plumbing' },
  { id: 'hvac', label: 'HVAC' },
  { id: 'electrical', label: 'Electrical' },
];

export const BROWSE_TAB_CATEGORY: Record<Exclude<ServicesBrowseTab, 'appliances'>, string> = {
  plumbing: 'plumbing-services',
  hvac: 'hvac-services',
  electrical: 'electrical-services',
};

/** Appliance repair cards on /services (Thumbtack-style browse) */
export const APPLIANCE_SHOWCASE_IDS = [
  'refrigerator-repair',
  'washer-dryer',
  'dishwasher-repair',
  'oven-stove-repair',
  'microwave-repair',
] as const;
