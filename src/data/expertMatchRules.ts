import type { SchedulerServiceCategory } from './schedulerPrefill';
import { URGENCY_OPTIONS, type EstimatorUrgency } from './pricingData';

export type ExpertCategoryId =
  | 'Appliance'
  | 'HVAC'
  | 'Plumbing'
  | 'Electrical'
  | 'Smart Home'
  | 'Garage Door'
  | 'Not Sure';

export const EXPERT_CATEGORIES: { id: ExpertCategoryId; label: string }[] = [
  { id: 'Appliance', label: 'Appliance' },
  { id: 'HVAC', label: 'HVAC' },
  { id: 'Plumbing', label: 'Plumbing' },
  { id: 'Electrical', label: 'Electrical' },
  { id: 'Smart Home', label: 'Smart Home' },
  { id: 'Garage Door', label: 'Garage Door' },
  { id: 'Not Sure', label: 'Not Sure' },
];

export const PROBLEM_OPTIONS: Record<ExpertCategoryId, string[]> = {
  Appliance: [
    'Refrigerator not cooling',
    'Washer not draining',
    'Dryer not heating',
    'Dishwasher leaking',
    'Oven/stove not working',
    'Microwave issue',
    'Appliance installation',
    'Other appliance issue',
  ],
  HVAC: [
    'AC not cooling',
    'Heat not working',
    'Thermostat issue',
    'Strange noise',
    'Airflow issue',
    'HVAC maintenance',
    'Emergency HVAC issue',
  ],
  Plumbing: [
    'Drain clogged',
    'Garbage disposal issue',
    'Leak',
    'Toilet issue',
    'Faucet issue',
    'Water pressure issue',
    'Other plumbing issue',
  ],
  Electrical: [
    'Light fixture installation',
    'Outlet or switch issue',
    'Breaker problem',
    'Ceiling fan installation',
    'Doorbell wiring',
    'Electrical safety concern',
  ],
  'Smart Home': [
    'Video doorbell installation',
    'Smart thermostat installation',
    'Smart lock installation',
    'Security camera installation',
    'Wi-Fi device setup',
    'Smart home troubleshooting',
  ],
  'Garage Door': [
    'Door will not open',
    'Door will not close',
    'Broken spring',
    'Opener not working',
    'Sensor issue',
    'Garage door maintenance',
  ],
  'Not Sure': [
    'Something is not working',
    'Need installation',
    'Need maintenance',
    'Need emergency help',
    'Need a quote',
  ],
};

export { URGENCY_OPTIONS, type EstimatorUrgency };

/** Marker prefixed onto issue_description so admin can identify Matching Expert leads without a dedicated source column */
export const MATCH_EXPERT_SOURCE_TAG = '[Matching Expert]';

export interface ExpertMatch {
  expertType: string;
  serviceType: 'R' | 'I' | 'M' | 'E';
  serviceCategory: SchedulerServiceCategory | null;
  productName: string;
  startingEstimate: string;
  reason: string;
}

export const MATCH_RULES: Record<ExpertCategoryId, Record<string, ExpertMatch>> = {
  Appliance: {
    'Refrigerator not cooling': {
      expertType: 'Appliance Repair Specialist',
      serviceType: 'R',
      serviceCategory: 'Appliance',
      productName: 'Refrigerator Repair',
      startingEstimate: '$89 diagnostic',
      reason: "Cooling issues usually require appliance diagnostics for compressor, fan, thermostat, or refrigerant-related problems.",
    },
    'Washer not draining': {
      expertType: 'Appliance Repair Specialist',
      serviceType: 'R',
      serviceCategory: 'Appliance',
      productName: 'Washer / Dryer Repair',
      startingEstimate: '$89 diagnostic',
      reason: 'A washer that will not drain is often caused by a clogged pump, blocked hose, or faulty lid switch — best diagnosed in person.',
    },
    'Dryer not heating': {
      expertType: 'Appliance Repair Specialist',
      serviceType: 'R',
      serviceCategory: 'Appliance',
      productName: 'Washer / Dryer Repair',
      startingEstimate: '$89 diagnostic',
      reason: 'No-heat dryer issues are commonly caused by a failed heating element, thermostat, or fuse that a technician can test on site.',
    },
    'Dishwasher leaking': {
      expertType: 'Appliance Repair Specialist',
      serviceType: 'R',
      serviceCategory: 'Appliance',
      productName: 'Dishwasher Repair',
      startingEstimate: '$89 diagnostic',
      reason: 'Leaks can come from the door seal, pump, or hose connections, so an in-home diagnostic pinpoints the source before repair.',
    },
    'Oven/stove not working': {
      expertType: 'Appliance Repair Specialist',
      serviceType: 'R',
      serviceCategory: 'Appliance',
      productName: 'Oven / Stove Repair',
      startingEstimate: '$89 diagnostic',
      reason: 'Heating, ignition, and burner failures need a hands-on inspection to confirm whether the issue is electrical or mechanical.',
    },
    'Microwave issue': {
      expertType: 'Appliance Repair Specialist',
      serviceType: 'R',
      serviceCategory: 'Appliance',
      productName: 'Microwave Repair',
      startingEstimate: '$79 diagnostic',
      reason: 'Microwave heating, power, or turntable issues are quickly diagnosed and repaired by an appliance specialist.',
    },
    'Appliance installation': {
      expertType: 'Appliance Installation Technician',
      serviceType: 'I',
      serviceCategory: 'Appliance',
      productName: 'Appliance Installation',
      startingEstimate: 'Starting at $149',
      reason: 'New appliance hookup, leveling, and test cycles are handled by our installation team to ensure everything runs safely.',
    },
    'Other appliance issue': {
      expertType: 'Appliance Repair Specialist',
      serviceType: 'R',
      serviceCategory: 'Appliance',
      productName: 'Appliance Diagnostic Visit',
      startingEstimate: '$89 diagnostic',
      reason: "When the issue isn't clear, a general appliance diagnostic visit identifies the cause and next steps.",
    },
  },
  HVAC: {
    'AC not cooling': {
      expertType: 'HVAC Technician',
      serviceType: 'R',
      serviceCategory: 'HVAC',
      productName: 'AC Repair',
      startingEstimate: '$99 diagnostic',
      reason: 'No-cooling issues are often tied to refrigerant levels, airflow, or compressor problems that need an HVAC inspection.',
    },
    'Heat not working': {
      expertType: 'HVAC Technician',
      serviceType: 'R',
      serviceCategory: 'HVAC',
      productName: 'Heating / Furnace Repair',
      startingEstimate: '$99 diagnostic',
      reason: 'A furnace or heat pump that stops producing heat typically needs an on-site diagnostic of ignition, blower, or control components.',
    },
    'Thermostat issue': {
      expertType: 'HVAC Technician',
      serviceType: 'I',
      serviceCategory: 'HVAC',
      productName: 'Thermostat Installation',
      startingEstimate: 'Starting at $129',
      reason: 'Thermostat problems are usually resolved fastest with a fresh installation or wiring check by an HVAC technician.',
    },
    'Strange noise': {
      expertType: 'HVAC Technician',
      serviceType: 'R',
      serviceCategory: 'HVAC',
      productName: 'AC Repair',
      startingEstimate: '$99 diagnostic',
      reason: 'Unusual HVAC noises often signal a loose part, failing motor, or airflow obstruction that needs an in-person diagnostic.',
    },
    'Airflow issue': {
      expertType: 'HVAC Technician',
      serviceType: 'R',
      serviceCategory: 'HVAC',
      productName: 'HVAC Maintenance',
      startingEstimate: 'Starting at $129',
      reason: 'Weak or uneven airflow is commonly fixed with a duct, filter, and blower inspection during a maintenance visit.',
    },
    'HVAC maintenance': {
      expertType: 'HVAC Technician',
      serviceType: 'M',
      serviceCategory: 'HVAC',
      productName: 'HVAC Maintenance',
      startingEstimate: 'Starting at $129',
      reason: 'A seasonal tune-up keeps your system efficient and catches small issues before they become costly repairs.',
    },
    'Emergency HVAC issue': {
      expertType: 'HVAC Technician',
      serviceType: 'E',
      serviceCategory: 'HVAC',
      productName: 'Emergency Service Visit',
      startingEstimate: 'Starting at $149',
      reason: 'A complete loss of heating or cooling is treated as urgent so a technician can respond the same day.',
    },
  },
  Plumbing: {
    'Drain clogged': {
      expertType: 'Plumbing Technician',
      serviceType: 'R',
      serviceCategory: 'Plumbing',
      productName: 'Drain Cleaning',
      startingEstimate: 'Starting at $149',
      reason: 'Clogged or slow drains are cleared with professional drain cleaning equipment to fully restore flow.',
    },
    'Garbage disposal issue': {
      expertType: 'Plumbing Technician',
      serviceType: 'R',
      serviceCategory: 'Plumbing',
      productName: 'Garbage Disposal Repair',
      startingEstimate: '$99 diagnostic',
      reason: 'Jammed, leaking, or unresponsive disposals are diagnosed in person to determine if a repair or replacement is needed.',
    },
    Leak: {
      expertType: 'Plumbing Technician',
      serviceType: 'R',
      serviceCategory: 'Plumbing',
      productName: 'Leak Inspection',
      startingEstimate: '$99 diagnostic',
      reason: 'Leaks should be inspected quickly to locate the source and prevent water damage before repair.',
    },
    'Toilet issue': {
      expertType: 'Plumbing Technician',
      serviceType: 'R',
      serviceCategory: 'Plumbing',
      productName: 'Toilet Repair',
      startingEstimate: 'Starting at $129',
      reason: 'Running, clogged, or leaking toilets are addressed with a standard toilet repair visit.',
    },
    'Faucet issue': {
      expertType: 'Plumbing Technician',
      serviceType: 'R',
      serviceCategory: 'Plumbing',
      productName: 'Faucet Repair / Replacement',
      startingEstimate: 'Starting at $129',
      reason: 'Drips, low pressure, or handle problems are typically resolved with a faucet repair or replacement.',
    },
    'Water pressure issue': {
      expertType: 'Plumbing Technician',
      serviceType: 'R',
      serviceCategory: 'Plumbing',
      productName: 'Leak Inspection',
      startingEstimate: '$99 diagnostic',
      reason: 'Pressure changes can point to a hidden leak or fixture problem, so a plumbing inspection is the right first step.',
    },
    'Other plumbing issue': {
      expertType: 'Plumbing Technician',
      serviceType: 'R',
      serviceCategory: 'Plumbing',
      productName: 'Leak Inspection',
      startingEstimate: '$99 diagnostic',
      reason: "When the plumbing issue isn't clear, a general inspection visit identifies the cause and next steps.",
    },
  },
  Electrical: {
    'Light fixture installation': {
      expertType: 'Licensed Electrician',
      serviceType: 'I',
      serviceCategory: 'Electrical',
      productName: 'Light Fixture Installation',
      startingEstimate: 'Starting at $149',
      reason: 'Indoor and outdoor fixture installs are completed safely by a licensed electrician.',
    },
    'Outlet or switch issue': {
      expertType: 'Licensed Electrician',
      serviceType: 'R',
      serviceCategory: 'Electrical',
      productName: 'Outlet / Switch Repair',
      startingEstimate: '$99 diagnostic',
      reason: 'Dead outlets, GFCI trips, and switch problems need an electrical diagnostic to rule out wiring issues.',
    },
    'Breaker problem': {
      expertType: 'Licensed Electrician',
      serviceType: 'R',
      serviceCategory: 'Electrical',
      productName: 'Breaker / Panel Inspection',
      startingEstimate: '$129 diagnostic',
      reason: 'Tripping breakers can indicate an overloaded circuit or panel issue that should be inspected for safety.',
    },
    'Ceiling fan installation': {
      expertType: 'Licensed Electrician',
      serviceType: 'I',
      serviceCategory: 'Electrical',
      productName: 'Ceiling Fan Installation',
      startingEstimate: 'Starting at $179',
      reason: 'Ceiling fan mounting, wiring, and balancing is handled safely by a licensed electrician.',
    },
    'Doorbell wiring': {
      expertType: 'Licensed Electrician',
      serviceType: 'I',
      serviceCategory: 'Electrical',
      productName: 'Doorbell Wiring',
      startingEstimate: 'Starting at $129',
      reason: 'Doorbell wiring issues or upgrades are best handled with a dedicated electrical visit.',
    },
    'Electrical safety concern': {
      expertType: 'Licensed Electrician',
      serviceType: 'E',
      serviceCategory: 'Electrical',
      productName: 'Breaker / Panel Inspection',
      startingEstimate: '$129 diagnostic',
      reason: 'Sparks, burning smells, or other safety concerns are treated as urgent and inspected as soon as possible.',
    },
  },
  'Smart Home': {
    'Video doorbell installation': {
      expertType: 'Smart Home Technician',
      serviceType: 'I',
      serviceCategory: 'Smart Home',
      productName: 'Video Doorbell Installation',
      startingEstimate: 'Starting at $129',
      reason: 'Video doorbell mounting and app pairing is set up correctly the first time by a smart home technician.',
    },
    'Smart thermostat installation': {
      expertType: 'Smart Home Technician',
      serviceType: 'I',
      serviceCategory: 'Smart Home',
      productName: 'Smart Thermostat Installation',
      startingEstimate: 'Starting at $129',
      reason: 'Smart thermostat wiring and schedule setup is completed by a technician familiar with major brands.',
    },
    'Smart lock installation': {
      expertType: 'Smart Home Technician',
      serviceType: 'I',
      serviceCategory: 'Smart Home',
      productName: 'Smart Lock Installation',
      startingEstimate: 'Starting at $149',
      reason: 'Smart lock fitting and app pairing is handled to make sure the door is secure and connected.',
    },
    'Security camera installation': {
      expertType: 'Smart Home Technician',
      serviceType: 'I',
      serviceCategory: 'Smart Home',
      productName: 'Security Camera Installation',
      startingEstimate: 'Starting at $149',
      reason: 'Indoor or outdoor camera mounting and connectivity setup is completed by a smart home technician.',
    },
    'Wi-Fi device setup': {
      expertType: 'Smart Home Technician',
      serviceType: 'I',
      serviceCategory: 'Smart Home',
      productName: 'Wi-Fi Device Setup',
      startingEstimate: 'Starting at $99',
      reason: 'Connecting and configuring smart devices on your network is quickest with hands-on setup help.',
    },
    'Smart home troubleshooting': {
      expertType: 'Smart Home Technician',
      serviceType: 'R',
      serviceCategory: 'Smart Home',
      productName: 'Wi-Fi Device Setup',
      startingEstimate: 'Starting at $99',
      reason: 'Connectivity or device problems are diagnosed and resolved by a smart home technician.',
    },
  },
  'Garage Door': {
    'Door will not open': {
      expertType: 'Garage Door Technician',
      serviceType: 'R',
      serviceCategory: 'Garage Door',
      productName: 'Garage Door Repair',
      startingEstimate: '$99 diagnostic',
      reason: 'A door that will not open can be caused by the opener, track, or spring — best confirmed with a diagnostic visit.',
    },
    'Door will not close': {
      expertType: 'Garage Door Technician',
      serviceType: 'R',
      serviceCategory: 'Garage Door',
      productName: 'Garage Door Repair',
      startingEstimate: '$99 diagnostic',
      reason: 'Doors that will not close are often a sensor alignment or opener issue that needs an in-person check.',
    },
    'Broken spring': {
      expertType: 'Garage Door Technician',
      serviceType: 'R',
      serviceCategory: 'Garage Door',
      productName: 'Spring Repair',
      startingEstimate: 'Quote required',
      reason: 'Spring replacement involves high-tension parts, so pricing is confirmed after an in-home safety inspection.',
    },
    'Opener not working': {
      expertType: 'Garage Door Technician',
      serviceType: 'R',
      serviceCategory: 'Garage Door',
      productName: 'Opener Repair',
      startingEstimate: '$99 diagnostic',
      reason: 'Opener motor, remote, or wiring issues are diagnosed on site to determine the right fix.',
    },
    'Sensor issue': {
      expertType: 'Garage Door Technician',
      serviceType: 'R',
      serviceCategory: 'Garage Door',
      productName: 'Sensor Alignment',
      startingEstimate: 'Starting at $89',
      reason: 'Misaligned safety sensors are a common, quick fix for doors that reverse or will not close.',
    },
    'Garage door maintenance': {
      expertType: 'Garage Door Technician',
      serviceType: 'M',
      serviceCategory: 'Garage Door',
      productName: 'Garage Door Maintenance',
      startingEstimate: 'Starting at $129',
      reason: 'Routine maintenance keeps tracks, rollers, and springs in safe working condition.',
    },
  },
  'Not Sure': {
    'Something is not working': {
      expertType: 'General Service Technician',
      serviceType: 'R',
      serviceCategory: null,
      productName: 'General Diagnostic Visit',
      startingEstimate: '$89 diagnostic',
      reason: "When you're not sure what's wrong, a general diagnostic visit identifies the issue so we can route you to the right specialist.",
    },
    'Need installation': {
      expertType: 'Installation Technician',
      serviceType: 'I',
      serviceCategory: null,
      productName: 'Installation Service',
      startingEstimate: 'Quote required',
      reason: 'Installation pricing depends on the device or system, so a technician will confirm details before your visit.',
    },
    'Need maintenance': {
      expertType: 'Maintenance Technician',
      serviceType: 'M',
      serviceCategory: null,
      productName: 'Maintenance Visit',
      startingEstimate: 'Quote required',
      reason: 'Maintenance scope varies by system, so we will confirm the right plan based on what you need serviced.',
    },
    'Need emergency help': {
      expertType: 'Emergency Response Technician',
      serviceType: 'E',
      serviceCategory: null,
      productName: 'Emergency Service Visit',
      startingEstimate: 'Starting at $149',
      reason: 'Urgent issues are prioritized so a technician can respond as quickly as possible.',
    },
    'Need a quote': {
      expertType: 'Service Coordinator',
      serviceType: 'R',
      serviceCategory: null,
      productName: 'Custom Quote Request',
      startingEstimate: 'Quote required',
      reason: 'A coordinator will gather a few more details and connect you with the right specialist for an accurate quote.',
    },
  },
};

export function getExpertMatch(category: ExpertCategoryId, problem: string): ExpertMatch | undefined {
  return MATCH_RULES[category]?.[problem];
}

/** Maps an ExpertMatch.expertType label to a real profile slug in src/data/experts.ts */
export const EXPERT_TYPE_TO_SLUG: Record<string, string> = {
  'Appliance Repair Specialist': 'appliance-repair-specialist',
  'Appliance Installation Technician': 'appliance-repair-specialist',
  'HVAC Technician': 'hvac-repair-specialist',
  'Plumbing Technician': 'plumbing-repair-specialist',
  'Licensed Electrician': 'electrical-service-specialist',
  'Smart Home Technician': 'electrical-service-specialist',
  'Garage Door Technician': 'smart-appliances-team',
  'General Service Technician': 'smart-appliances-team',
  'Installation Technician': 'smart-appliances-team',
  'Maintenance Technician': 'smart-appliances-team',
  'Emergency Response Technician': 'smart-appliances-team',
  'Service Coordinator': 'smart-appliances-team',
};

export function getExpertSlugForMatch(expertType: string): string | undefined {
  return EXPERT_TYPE_TO_SLUG[expertType];
}
