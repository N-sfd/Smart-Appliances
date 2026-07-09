export type ServicePriority = 'regular' | 'emergency';

export interface ServiceOption {
  id: string;
  label: string;
  cardSubtitle?: string;
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
  emergencyBadge?: boolean;
  status: 'new' | 'in_review' | 'scheduled' | 'technician_assigned' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  // New extended fields
  applianceType: string | null;
  issueStartDate: string | null;
  timeWindow: string | null;
  priorityScore: 1 | 2 | 3 | 4;
  possibleIssue: string | null;
  recommendedTechnicianType: string | null;
  estimatedDuration: string | null;
  safetyNotes: string | null;
  hasSafetyConcern: boolean;
  applianceStillRunning: boolean | null;
  callbackTime: string | null;
  assignedTechnicianId: string | null;
  technicianStatus: 'accepted' | 'on_the_way' | 'started' | 'completed' | null;
  /**
   * ZIP-based service-area check (currently only set by the Emergency Service
   * form). Additive/optional fields — not part of the Supabase `service_requests`
   * row shape (see mapServiceRequestToRow in lib/supabase.ts), so they're safely
   * ignored on that write path and only persisted to localStorage/Firestore.
   */
  outsideServiceArea?: boolean;
  detectedServiceArea?: string | null;
  /** Admin-facing status marker, separate from the Supabase `status` column. */
  adminStatus?: string;
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'appliance-repair',
    title: 'Appliance',
    description: 'Refrigerator, washer, dryer, dishwasher, oven, microwave, disposal, and ice maker service.',
    tags: ['Appliances'],
    icon: 'Kitchen',
    services: [
      { id: 'refrigerator-repair', label: 'Refrigerator', cardSubtitle: 'Repair & installation' },
      { id: 'washer-dryer', label: 'Washer / dryer', cardSubtitle: 'Repair & installation' },
      { id: 'dishwasher-repair', label: 'Dishwasher', cardSubtitle: 'Repair & installation' },
      { id: 'oven-stove-repair', label: 'Oven & stove', cardSubtitle: 'Repair & installation' },
      { id: 'cooktop-repair', label: 'Cooktop', cardSubtitle: 'Electric & induction cooktops' },
      { id: 'microwave-repair', label: 'Microwave', cardSubtitle: 'Repair & installation' },
      { id: 'garbage-disposal-repair', label: 'Garbage disposal', cardSubtitle: 'Repair & installation' },
      { id: 'ice-maker-repair', label: 'Ice maker', cardSubtitle: 'Appliance' },
    ],
  },
  {
    id: 'appliance-installation',
    title: 'Appliance Installation',
    description: 'Smart appliance setup and Wi-Fi configuration for connected home devices.',
    tags: ['Appliances'],
    icon: 'ShoppingCart',
    services: [
      { id: 'smart-appliance-setup', label: 'Smart appliance setup', cardSubtitle: 'Wi-Fi pairing & app setup' },
    ],
  },
  {
    id: 'hvac-services',
    title: 'HVAC Services',
    description: 'AC and heating repair, thermostat installation, maintenance, duct cleaning, and emergency HVAC response.',
    tags: ['HVAC'],
    icon: 'AcUnit',
    services: [
      { id: 'ac-repair', label: 'AC repair', cardSubtitle: 'Cooling issues, weak airflow, warm air' },
      { id: 'heating-furnace-repair', label: 'Heating/furnace repair', cardSubtitle: 'No heat, ignition issues, poor airflow' },
      { id: 'thermostat-installation', label: 'Thermostat installation', cardSubtitle: 'Smart thermostat setup and replacement' },
      { id: 'hvac-maintenance', label: 'HVAC maintenance', cardSubtitle: 'Seasonal tune-ups and preventive care' },
      { id: 'duct-cleaning', label: 'Duct cleaning', cardSubtitle: 'Improve airflow and indoor air quality' },
      { id: 'emergency-hvac-service', label: 'Emergency HVAC service', cardSubtitle: 'Urgent heating and cooling support' },
    ],
  },
  {
    id: 'plumbing-services',
    title: 'Plumbing Services',
    description: 'Quality repairs and replacements done right the first time.',
    tags: ['Plumbing'],
    icon: 'Plumbing',
    services: [
      { id: 'leak-repair', label: 'Leak repair', cardSubtitle: 'Pipe, fixture, and under-sink leaks' },
      { id: 'drain-cleaning', label: 'Drain cleaning', cardSubtitle: 'Slow drains, clogs, and backups' },
      { id: 'faucet-repair', label: 'Faucet repair/replacement', cardSubtitle: 'Drips, low pressure, and replacements' },
      { id: 'toilet-repair', label: 'Toilet repair', cardSubtitle: 'Running toilet, clogs, and leaks' },
      { id: 'water-heater-service', label: 'Water heater service', cardSubtitle: 'No hot water, leaks, and tune-ups' },
      { id: 'emergency-plumbing', label: 'Emergency plumbing', cardSubtitle: 'Burst pipes, major leaks, and flooding' },
    ],
  },
  {
    id: 'electrical-services',
    title: 'Electrical Services',
    description: 'Outlet repair, lighting and fan installation, panel inspection, appliance connection, and electrical emergency support.',
    tags: ['Electrical'],
    icon: 'Bolt',
    services: [
      { id: 'outlet-switch-repair', label: 'Outlet / Switch Repair', cardSubtitle: 'Outlets, switches, dimmers' },
      { id: 'light-fixture-installation', label: 'Light Fixture Installation', cardSubtitle: 'Ceiling, pendant, wall lights' },
      { id: 'ceiling-fan-installation', label: 'Ceiling Fan Installation', cardSubtitle: 'Fan wiring and mounting' },
      { id: 'breaker-panel-inspection', label: 'Breaker / Panel Inspection', cardSubtitle: 'Breaker trips and panel issues' },
      { id: 'appliance-electrical-connection', label: 'Appliance Electrical Connection', cardSubtitle: 'Safe power connections' },
      { id: 'wiring-troubleshooting', label: 'Wiring Troubleshooting', cardSubtitle: 'Testing, wiring, and faults' },
      { id: 'smart-device-wiring', label: 'Smart Device Wiring', cardSubtitle: 'Smart switches, devices, and controls' },
      { id: 'emergency-electrical-service', label: 'Emergency Electrical Service', cardSubtitle: 'Sparks, outages, and urgent hazards' },
    ],
  },
  {
    id: 'smart-home-setup',
    title: 'Smart Home & Tech Setup',
    description: 'The convenient and stress-free solution to upgrade your home with smart thermostats, cameras, doorbells, locks, and more.',
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
      { id: 'garage-door-repair', label: 'Garage door repair' },
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
  'in_review',
  'scheduled',
  'technician_assigned',
  'in_progress',
  'completed',
  'cancelled',
] as const;

export const statusLabels: Record<string, string> = {
  new: 'New',
  in_review: 'In Review',
  scheduled: 'Scheduled',
  technician_assigned: 'Tech Assigned',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const TIME_WINDOWS = [
  'Morning (8AM–12PM)',
  'Afternoon (12PM–4PM)',
  'Evening (4PM–8PM)',
];

export const APPLIANCE_TYPES = [
  'Refrigerator',
  'Washer',
  'Dryer',
  'Dishwasher',
  'Oven/Stove',
  'Microwave',
  'HVAC/AC',
  'Water Heater',
  'Other',
];
