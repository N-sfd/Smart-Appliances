import { getCategoryFallbackImage } from './serviceCategoryFallbacks';
import { HVAC_SERVICE_IMAGES } from './hvacHub';
import { PLUMBING_SERVICE_IMAGES } from './plumbingHub';
import { ELECTRICAL_SERVICE_IMAGES } from './electricalHub';
import { APPLIANCE_SERVICE_IMAGES, APPLIANCE_DEFAULT_IMAGE } from './applianceHub';
import { SMART_HOME_SERVICE_IMAGES } from './smartHomeHub';

export interface ServiceImageInfo {
  image: string;
  title: string;
  desc: string;
}

const BASE = '/images/services';
const SMART = `${BASE}/smart-home`;

// Fallback for when nothing is selected
export const DEFAULT_SERVICE_IMAGE: ServiceImageInfo = {
  image: APPLIANCE_DEFAULT_IMAGE,
  title: 'Home Appliance & Repair Services',
  desc: 'Certified technicians ready for any appliance or home service need.',
};

// Map product name (SchedulerPage) → image info
export const PRODUCT_IMAGE_MAP: Record<string, ServiceImageInfo> = {
  Refrigerator: {
    image: APPLIANCE_SERVICE_IMAGES['refrigerator-repair'],
    title: 'Refrigerator',
    desc: 'Expert diagnosis and repair for cooling, freezing, and ice-making issues.',
  },
  Washer: {
    image: APPLIANCE_SERVICE_IMAGES['washer-repair'],
    title: 'Washer',
    desc: 'Expert help for draining, spinning, and startup problems.',
  },
  Dryer: {
    image: APPLIANCE_SERVICE_IMAGES['dryer-repair'],
    title: 'Dryer',
    desc: 'Professional repair for heating, drum rotation, and power issues.',
  },
  Dishwasher: {
    image: APPLIANCE_SERVICE_IMAGES['dishwasher-repair'],
    title: 'Dishwasher',
    desc: 'Fix for drainage, cleaning performance, and door latch problems.',
  },
  'Oven / Range': {
    image: APPLIANCE_SERVICE_IMAGES['oven-stove-repair'],
    title: 'Oven & Range',
    desc: 'Certified repair for ignition, heating elements, and electrical issues.',
  },
  Microwave: {
    image: APPLIANCE_SERVICE_IMAGES['microwave-repair'],
    title: 'Microwave',
    desc: 'Expert diagnostics for heating and electrical malfunctions.',
  },
  'Gas Grill': {
    image: APPLIANCE_DEFAULT_IMAGE,
    title: 'Gas Grill Service',
    desc: 'Safe, professional inspection and repair for reliable outdoor grilling.',
  },
  'Water Heater': {
    image: PLUMBING_SERVICE_IMAGES['water-heater-service'],
    title: 'Water Heater Service',
    desc: 'Repair and installation for consistent, efficient hot water supply.',
  },
  'Air Conditioner': {
    image: HVAC_SERVICE_IMAGES['ac-repair'],
    title: 'Air Conditioner Repair',
    desc: 'Certified HVAC technicians for cooling, efficiency, and comfort issues.',
  },
  Furnace: {
    image: HVAC_SERVICE_IMAGES['heating-furnace-repair'],
    title: 'Furnace Repair',
    desc: 'Professional heating system repair and safety inspection.',
  },
  'Garbage Disposal': {
    image: APPLIANCE_SERVICE_IMAGES['garbage-disposal-repair'],
    title: 'Garbage Disposal',
    desc: 'Quick repair for jams, leaks, and disposal failures.',
  },
  'Ice Maker': {
    image: APPLIANCE_SERVICE_IMAGES['refrigerator-repair'],
    title: 'Ice Maker',
    desc: 'Fix for ice production, dispensing, and water supply issues.',
  },
  Other: {
    image: APPLIANCE_DEFAULT_IMAGE,
    title: 'Home Appliance Service',
    desc: 'Certified technicians for any appliance or home service need.',
  },
};

// Map specific service type ID → image info
export const SERVICE_TYPE_IMAGE_MAP: Record<string, ServiceImageInfo> = {
  // Appliance services
  'refrigerator-repair': {
    image: APPLIANCE_SERVICE_IMAGES['refrigerator-repair'],
    title: 'Refrigerator',
    desc: 'Repair and installation for cooling, freezing, ice maker, and water line issues.',
  },
  'washer-dryer': {
    image: APPLIANCE_SERVICE_IMAGES['washer-dryer'],
    title: 'Washer / Dryer',
    desc: 'Repair and installation for washing machines and dryers — spin, drain, heat, and setup.',
  },
  'washer-repair': {
    image: APPLIANCE_SERVICE_IMAGES['washer-repair'],
    title: 'Washer',
    desc: 'Expert help for draining, spinning, and startup problems.',
  },
  'dryer-repair': {
    image: APPLIANCE_SERVICE_IMAGES['dryer-repair'],
    title: 'Dryer',
    desc: 'Professional repair for heating, drum rotation, and power issues.',
  },
  'dishwasher-repair': {
    image: APPLIANCE_SERVICE_IMAGES['dishwasher-repair'],
    title: 'Dishwasher',
    desc: 'Repair and installation for drainage, cleaning performance, and water line hookup.',
  },
  'oven-stove-repair': {
    image: APPLIANCE_SERVICE_IMAGES['oven-stove-repair'],
    title: 'Oven & Stove',
    desc: 'Repair and installation for ignition, heating elements, gas lines, and electrical hookup.',
  },
  'microwave-repair': {
    image: APPLIANCE_SERVICE_IMAGES['microwave-repair'],
    title: 'Microwave',
    desc: 'Repair and installation for heating, display, turntable, and over-the-range mounting.',
  },
  'garbage-disposal-repair': {
    image: APPLIANCE_SERVICE_IMAGES['garbage-disposal-repair'],
    title: 'Garbage Disposal',
    desc: 'Quick repair for jams, leaks, and disposal failures.',
  },
  'ice-maker-repair': {
    image: APPLIANCE_SERVICE_IMAGES['refrigerator-repair'],
    title: 'Ice Maker',
    desc: 'Fix for ice production, dispensing, and water supply issues.',
  },
  // Legacy installation IDs → merged appliance cards (booking compatibility)
  'refrigerator-installation': {
    image: APPLIANCE_SERVICE_IMAGES['refrigerator-repair'],
    title: 'Refrigerator',
    desc: 'Repair and installation for cooling, freezing, ice maker, and water line issues.',
  },
  'dishwasher-installation': {
    image: APPLIANCE_SERVICE_IMAGES['dishwasher-repair'],
    title: 'Dishwasher',
    desc: 'Repair and installation for drainage, cleaning performance, and water line hookup.',
  },
  'washer-dryer-installation': {
    image: APPLIANCE_SERVICE_IMAGES['washer-dryer'],
    title: 'Washer / Dryer',
    desc: 'Repair and installation for washing machines and dryers — spin, drain, heat, and setup.',
  },
  'microwave-installation': {
    image: APPLIANCE_SERVICE_IMAGES['microwave-repair'],
    title: 'Microwave',
    desc: 'Repair and installation for heating, display, turntable, and over-the-range mounting.',
  },
  'range-oven-installation': {
    image: APPLIANCE_SERVICE_IMAGES['oven-stove-repair'],
    title: 'Oven & Stove',
    desc: 'Repair and installation for ignition, heating elements, gas lines, and electrical hookup.',
  },
  'smart-appliance-setup': {
    image: `${SMART}/hero-installer.png`,
    title: 'Smart Appliance Setup',
    desc: 'Wi-Fi connection, app pairing, and configuration for smart appliances.',
  },
  // HVAC
  'ac-repair': {
    image: HVAC_SERVICE_IMAGES['ac-repair'],
    title: 'AC Repair',
    desc: 'Diagnose and fix cooling failures, weak airflow, warm air, and refrigerant issues.',
  },
  'heating-furnace-repair': {
    image: HVAC_SERVICE_IMAGES['heating-furnace-repair'],
    title: 'Heating & Furnace Repair',
    desc: 'Restore reliable heat with professional furnace diagnosis and repair.',
  },
  'thermostat-installation': {
    image: HVAC_SERVICE_IMAGES['thermostat-installation'],
    title: 'Thermostat Installation',
    desc: 'Smart thermostat setup, replacement, and calibration for better comfort control.',
  },
  'hvac-maintenance': {
    image: HVAC_SERVICE_IMAGES['hvac-maintenance'],
    title: 'HVAC Maintenance',
    desc: 'Seasonal tune-ups and preventive care to keep your system running efficiently.',
  },
  'duct-cleaning': {
    image: HVAC_SERVICE_IMAGES['duct-cleaning'],
    title: 'Duct Cleaning',
    desc: 'Improve airflow and indoor air quality with professional duct and vent cleaning.',
  },
  'emergency-hvac-service': {
    image: HVAC_SERVICE_IMAGES['emergency-hvac-service'],
    title: 'Emergency HVAC Service',
    desc: 'Urgent same-day response for heating and cooling emergencies.',
  },
  // Plumbing
  'leak-repair': {
    image: PLUMBING_SERVICE_IMAGES['leak-repair'],
    title: 'Leak Repair',
    desc: 'Fast detection and repair of pipe, fixture, and appliance leaks.',
  },
  'drain-cleaning': {
    image: PLUMBING_SERVICE_IMAGES['drain-cleaning'],
    title: 'Drain Cleaning',
    desc: 'Clear clogged drains with professional equipment and techniques.',
  },
  'faucet-repair': {
    image: PLUMBING_SERVICE_IMAGES['faucet-repair'],
    title: 'Faucet Repair & Replacement',
    desc: 'Fix drips, low pressure, and replace worn faucets.',
  },
  'toilet-repair': {
    image: PLUMBING_SERVICE_IMAGES['toilet-repair'],
    title: 'Toilet Repair',
    desc: 'Fix running toilets, clogs, leaks, and flushing issues.',
  },
  'water-heater-service': {
    image: PLUMBING_SERVICE_IMAGES['water-heater-service'],
    title: 'Water Heater Service',
    desc: 'Repair and installation for consistent, efficient hot water supply.',
  },
  'emergency-plumbing': {
    image: PLUMBING_SERVICE_IMAGES['emergency-plumbing'],
    title: 'Emergency Plumbing',
    desc: 'Rapid response for burst pipes, major leaks, and sewage backups.',
  },
  // Electrical
  'outlet-switch-repair': {
    image: ELECTRICAL_SERVICE_IMAGES['outlet-switch-repair'],
    title: 'Outlet / Switch Repair',
    desc: 'Repair or replace faulty outlets, switches, loose connections, or non-working power points.',
  },
  'light-fixture-installation': {
    image: ELECTRICAL_SERVICE_IMAGES['light-fixture-installation'],
    title: 'Light Fixture Installation',
    desc: 'Install or replace indoor and outdoor light fixtures safely and professionally.',
  },
  'ceiling-fan-installation': {
    image: ELECTRICAL_SERVICE_IMAGES['ceiling-fan-installation'],
    title: 'Ceiling Fan Installation',
    desc: 'Install, replace, or troubleshoot ceiling fans and wall controls.',
  },
  'breaker-panel-inspection': {
    image: ELECTRICAL_SERVICE_IMAGES['breaker-panel-inspection'],
    title: 'Breaker / Panel Inspection',
    desc: 'Inspect breaker problems, tripping circuits, and panel-related concerns.',
  },
  'appliance-electrical-connection': {
    image: ELECTRICAL_SERVICE_IMAGES['appliance-electrical-connection'],
    title: 'Appliance Electrical Connection',
    desc: 'Help connect appliances that require proper electrical setup or dedicated power.',
  },
  'wiring-troubleshooting': {
    image: ELECTRICAL_SERVICE_IMAGES['wiring-troubleshooting'],
    title: 'Wiring Troubleshooting',
    desc: 'Troubleshoot common wiring issues, power interruptions, and connection problems.',
  },
  'smart-device-wiring': {
    image: ELECTRICAL_SERVICE_IMAGES['smart-device-wiring'],
    title: 'Smart Device Wiring',
    desc: 'Support wiring for smart switches, smart thermostats, and connected home devices.',
  },
  'emergency-electrical-service': {
    image: ELECTRICAL_SERVICE_IMAGES['emergency-electrical-service'],
    title: 'Emergency Electrical Service',
    desc: 'Priority support for urgent electrical issues, burning smells, sparks, or safety concerns.',
  },
  // Smart Home
  'smart-thermostat-setup': {
    image: SMART_HOME_SERVICE_IMAGES['smart-thermostat-setup'],
    title: 'Smart Thermostat Setup',
    desc: 'Nest, Ecobee, and Honeywell thermostat installation with app pairing.',
  },
  'doorbell-installation': {
    image: SMART_HOME_SERVICE_IMAGES['doorbell-installation'],
    title: 'Video Doorbell Installation',
    desc: 'Ring, Nest, and Arlo doorbell installation with app pairing.',
  },
  'camera-installation': {
    image: SMART_HOME_SERVICE_IMAGES['camera-installation'],
    title: 'Security Camera Installation',
    desc: 'Indoor and outdoor security camera mounting and setup.',
  },
  'smart-lock-installation': {
    image: `${SMART}/garage-opener.png`,
    title: 'Smart Lock Installation',
    desc: 'Professional smart lock fitting, programming, and app setup.',
  },
  'wifi-setup': {
    image: SMART_HOME_SERVICE_IMAGES['wifi-setup'],
    title: 'Wi-Fi Device Setup',
    desc: 'Connect and configure smart home devices to your network.',
  },
  'tv-mounting': {
    image: SMART_HOME_SERVICE_IMAGES['tv-mounting'],
    title: 'TV Mounting',
    desc: 'Safe wall mounting with cable management for any TV size.',
  },
  // Home Maintenance
  'preventive-maintenance': {
    image: APPLIANCE_DEFAULT_IMAGE,
    title: 'Preventive Appliance Maintenance',
    desc: 'Scheduled check-ups to extend appliance life and prevent breakdowns.',
  },
  'dryer-vent-cleaning': {
    image: APPLIANCE_SERVICE_IMAGES['dryer-repair'],
    title: 'Dryer Vent Cleaning',
    desc: 'Remove lint buildup to improve efficiency and reduce fire risk.',
  },
  'air-duct-cleaning': {
    image: HVAC_SERVICE_IMAGES['duct-cleaning'],
    title: 'Air Duct Cleaning',
    desc: 'Improve indoor air quality by cleaning your HVAC duct system.',
  },
  'seasonal-hvac-tune-up': {
    image: HVAC_SERVICE_IMAGES['hvac-maintenance'],
    title: 'Seasonal HVAC Tune-Up',
    desc: 'Prepare your heating and cooling system for the season ahead.',
  },
  'garage-door-repair': {
    image: `${SMART}/garage-door-service.png`,
    title: 'Garage Door Repair',
    desc: 'Spring, opener, track, and panel repair from licensed technicians.',
  },
  'general-handyman': {
    image: APPLIANCE_DEFAULT_IMAGE,
    title: 'General Handyman Request',
    desc: 'Skilled technicians for a wide range of home repair and maintenance tasks.',
  },
};

// Map service category ID → image info (fallback when no specific type match)
export const CATEGORY_IMAGE_MAP: Record<string, ServiceImageInfo> = {
  'appliance-repair': {
    image: APPLIANCE_SERVICE_IMAGES['washer-dryer'],
    title: 'Appliance',
    desc: 'Certified repair for all major home appliances by licensed technicians.',
  },
  'appliance-installation': {
    image: APPLIANCE_DEFAULT_IMAGE,
    title: 'Appliance Installation',
    desc: 'Professional installation for refrigerators, washers, dishwashers, and more.',
  },
  'hvac-services': {
    image: HVAC_SERVICE_IMAGES['ac-repair'],
    title: 'HVAC Service',
    desc: 'Heating, cooling, and ventilation repair by certified HVAC technicians.',
  },
  'plumbing-services': {
    image: PLUMBING_SERVICE_IMAGES['leak-repair'],
    title: 'Plumbing made simple',
    desc: 'Quality repairs and replacements done right the first time.',
  },
  'electrical-services': {
    image: `${BASE}/electrical-default.jpg`,
    title: 'Electrical Service',
    desc: 'Licensed electricians for wiring, panel, outlet, and safety issues.',
  },
  'smart-home-setup': {
    image: `${BASE}/smart-home/hero-installer.png`,
    title: 'Smart Home Installation & Setup',
    desc: 'The convenient and stress-free solution to upgrade your home.',
  },
  'home-maintenance': {
    image: APPLIANCE_DEFAULT_IMAGE,
    title: 'Home Maintenance',
    desc: 'Routine maintenance and preventive service for your home systems.',
  },
};

export function getServiceImage(
  serviceTypeId: string,
  categoryId: string,
): ServiceImageInfo {
  const info =
    SERVICE_TYPE_IMAGE_MAP[serviceTypeId] ??
    CATEGORY_IMAGE_MAP[categoryId] ??
    DEFAULT_SERVICE_IMAGE;

  const fallback = getCategoryFallbackImage(categoryId);
  if (info.image.includes('hero-technician') && categoryId !== 'electrical-services') {
    return { ...info, image: fallback };
  }
  return info;
}
