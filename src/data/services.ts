export type ServicePriority = 'regular' | 'emergency';

export interface ServiceOption {
  id: string;
  label: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  tags: string[];
  icon: string;
  services: ServiceOption[];
}

export interface ServiceRequest {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  serviceCategory: string;
  serviceType: string;
  servicePriority: ServicePriority;
  urgencyLevel: string | null;
  preferredDate: string | null;
  preferredTime: string | null;
  requestedResponseTime: string | null;
  issueDescription: string;
  applianceBrand: string | null;
  applianceModel: string | null;
  imageUrl: string | null;
  notes: string | null;
  emergencyBadge: boolean;
  status: 'new' | 'contacted' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'appliance-repair',
    title: 'Appliance Repair',
    description: 'Refrigerator, washer, dryer, dishwasher, oven, microwave, disposal, and ice maker repair.',
    tags: ['Appliances'],
    icon: 'Kitchen',
    services: [
      { id: 'refrigerator-repair', label: 'Refrigerator repair' },
      { id: 'washer-repair', label: 'Washer repair' },
      { id: 'dryer-repair', label: 'Dryer repair' },
      { id: 'dishwasher-repair', label: 'Dishwasher repair' },
      { id: 'oven-stove-repair', label: 'Oven and stove repair' },
      { id: 'microwave-repair', label: 'Microwave repair' },
      { id: 'garbage-disposal-repair', label: 'Garbage disposal repair' },
      { id: 'ice-maker-repair', label: 'Ice maker repair' },
    ],
  },
  {
    id: 'appliance-installation',
    title: 'Appliance Installation',
    description: 'Install refrigerators, dishwashers, washer/dryers, microwaves, ranges, smart appliances, and kitchen equipment.',
    tags: ['Appliances'],
    icon: 'ShoppingCart',
    services: [
      { id: 'refrigerator-installation', label: 'Refrigerator installation' },
      { id: 'dishwasher-installation', label: 'Dishwasher installation' },
      { id: 'washer-dryer-installation', label: 'Washer/dryer installation' },
      { id: 'microwave-installation', label: 'Microwave installation' },
      { id: 'range-oven-installation', label: 'Range/oven installation' },
      { id: 'smart-appliance-setup', label: 'Smart appliance setup' },
    ],
  },
  {
    id: 'hvac-services',
    title: 'HVAC Services',
    description: 'AC and heating repair, thermostat installation, maintenance, duct cleaning, and emergency HVAC response.',
    tags: ['HVAC'],
    icon: 'AcUnit',
    services: [
      { id: 'ac-repair', label: 'AC repair' },
      { id: 'heating-furnace-repair', label: 'Heating/furnace repair' },
      { id: 'thermostat-installation', label: 'Thermostat installation' },
      { id: 'hvac-maintenance', label: 'HVAC maintenance' },
      { id: 'duct-cleaning', label: 'Duct cleaning' },
      { id: 'emergency-hvac-service', label: 'Emergency HVAC service' },
    ],
  },
  {
    id: 'plumbing-services',
    title: 'Plumbing Services',
    description: 'Leak repair, drain cleaning, faucet and toilet service, water heater care, disposal installation, and urgent plumbing support.',
    tags: ['Plumbing'],
    icon: 'Plumbing',
    services: [
      { id: 'leak-repair', label: 'Leak repair' },
      { id: 'drain-cleaning', label: 'Drain cleaning' },
      { id: 'faucet-repair', label: 'Faucet repair/replacement' },
      { id: 'toilet-repair', label: 'Toilet repair' },
      { id: 'water-heater-service', label: 'Water heater service' },
      { id: 'disposal-installation', label: 'Garbage disposal installation' },
      { id: 'emergency-plumbing', label: 'Emergency plumbing' },
    ],
  },
  {
    id: 'electrical-services',
    title: 'Electrical Services',
    description: 'Outlet repair, lighting and fan installation, panel inspection, appliance connection, and electrical emergency support.',
    tags: ['Electrical'],
    icon: 'Bolt',
    services: [
      { id: 'outlet-switch-repair', label: 'Outlet/switch repair' },
      { id: 'light-fixture-installation', label: 'Light fixture installation' },
      { id: 'ceiling-fan-installation', label: 'Ceiling fan installation' },
      { id: 'breaker-panel-inspection', label: 'Breaker/panel inspection' },
      { id: 'appliance-electrical-connection', label: 'Appliance electrical connection' },
      { id: 'emergency-electrical-service', label: 'Emergency electrical service' },
    ],
  },
  {
    id: 'smart-home-setup',
    title: 'Smart Home & Tech Setup',
    description: 'Smart thermostat, security cameras, doorbells, locks, Wi-Fi devices, and TV mounting for modern homes.',
    tags: ['Smart Home'],
    icon: 'Devices',
    services: [
      { id: 'smart-thermostat-setup', label: 'Smart thermostat setup' },
      { id: 'doorbell-installation', label: 'Ring/video doorbell installation' },
      { id: 'camera-installation', label: 'Security camera installation' },
      { id: 'smart-lock-installation', label: 'Smart lock installation' },
      { id: 'wifi-setup', label: 'Wi-Fi device setup' },
      { id: 'tv-mounting', label: 'TV mounting' },
    ],
  },
  {
    id: 'home-maintenance',
    title: 'Home Maintenance',
    description: 'Preventive maintenance, dryer vent cleaning, duct cleaning, seasonal tune-ups, and general handyman requests.',
    tags: ['Maintenance'],
    icon: 'Build',
    services: [
      { id: 'preventive-maintenance', label: 'Preventive appliance maintenance' },
      { id: 'dryer-vent-cleaning', label: 'Dryer vent cleaning' },
      { id: 'air-duct-cleaning', label: 'Air duct cleaning' },
      { id: 'seasonal-hvac-tune-up', label: 'Seasonal HVAC tune-up' },
      { id: 'general-handyman', label: 'General handyman request' },
    ],
  },
];

export const urgencyOptions = [
  'ASAP',
  'Today',
  'Within 24 hours',
  'No heat/AC emergency',
  'Water leak emergency',
  'Electrical safety issue',
  'Appliance stopped working completely',
];

export const issueSeverityOptions = ['High', 'Medium', 'Low'];

export const statusOptions = [
  'new',
  'contacted',
  'scheduled',
  'in_progress',
  'completed',
  'cancelled',
] as const;
