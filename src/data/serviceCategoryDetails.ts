import { HVAC_SERVICE_IMAGES } from './hvacHub';
import { ELECTRICAL_SERVICE_IMAGES } from './electricalHub';
import { APPLIANCE_SERVICE_IMAGES } from './applianceHub';
import { PLUMBING_SERVICE_IMAGES } from './plumbingHub';
import { SMART_HOME_SERVICE_IMAGES } from './smartHomeHub';

/** Rich content overrides for category booking cards and detail panels */
export interface CategoryServiceDetail {
  title?: string;
  description?: string;
  chips?: string[];
  image?: string;
  detailDescription?: string;
  includes?: string[];
  commonIssues?: string[];
  safetyNotice?: string;
  scheduleId?: string;
}

export const CATEGORY_SERVICE_DETAILS: Record<string, CategoryServiceDetail> = {
  // Smart Home
  'camera-installation': {
    title: 'Security Camera Installation',
    description: 'Install and connect indoor or outdoor smart cameras.',
    chips: ['Camera setup', 'App connection', 'WiFi check'],
    detailDescription:
      'Our technician mounts your camera, connects it to WiFi, pairs it with the app, and walks you through live view and alerts before leaving.',
    includes: ['Mounting and positioning', 'WiFi connection', 'App pairing', 'Basic feature walkthrough', 'Testing before completion'],
  },
  'doorbell-installation': {
    title: 'Video Doorbell Installation',
    description: 'Install and configure smart doorbells for your entryway.',
    chips: ['Doorbell setup', 'Chime check', 'App pairing'],
    image: SMART_HOME_SERVICE_IMAGES['doorbell-installation'],
    detailDescription:
      'Our technician installs your video doorbell, connects it to WiFi, pairs it with the app, and shows you the basic features before leaving.',
    includes: ['Installation and mounting', 'WiFi connection', 'App pairing', 'Basic feature walkthrough', 'Testing before completion'],
  },
  'smart-thermostat-setup': {
    title: 'Smart Thermostat Installation',
    description: 'Install and set up compatible smart thermostats.',
    chips: ['Thermostat wiring', 'WiFi setup', 'App tutorial'],
    includes: ['Thermostat installation', 'WiFi connection', 'App setup', 'Schedule configuration', 'Testing before completion'],
  },
  'smart-lock-installation': {
    title: 'Smart Lock Installation',
    description: 'Install and configure smart locks for supported doors.',
    chips: ['Lock setup', 'App pairing', 'Access codes'],
    includes: ['Lock fitting', 'App pairing', 'Access code setup', 'Battery check', 'Testing before completion'],
  },
  'smart-hub-setup': {
    title: 'Smart Hub / Speaker Setup',
    description: 'Connect smart hubs, speakers, and voice assistant devices.',
    chips: ['Hub setup', 'Device pairing', 'App tutorial'],
    image: '/images/services/smart-home/wifi-tools.webp',
    scheduleId: 'wifi-setup',
    includes: ['Hub placement', 'Device pairing', 'App configuration', 'Voice assistant setup', 'Testing before completion'],
  },
  'smart-lighting-setup': {
    title: 'Smart Lighting Setup',
    description: 'Install and connect smart bulbs, switches, or lighting systems.',
    chips: ['Light setup', 'App pairing', 'Automation'],
    image: '/images/services/showcase/electrical-light.webp',
    scheduleId: 'light-fixture-installation',
    includes: ['Fixture or switch install', 'App pairing', 'Automation setup', 'Testing before completion'],
  },
  'wifi-device-setup': {
    title: 'WiFi Device Setup',
    description: 'Connect supported smart devices to your home network.',
    chips: ['WiFi setup', 'Signal check', 'Device connection'],
    image: '/images/services/smart-home/wifi-tools.webp',
    scheduleId: 'wifi-setup',
    includes: ['Network connection', 'Signal verification', 'Device registration', 'App pairing', 'Testing before completion'],
  },
  'smart-device-troubleshooting': {
    title: 'Smart Device Troubleshooting',
    description: 'Help reconnect or configure existing smart devices.',
    chips: ['Offline device', 'App issue', 'Network problem'],
    image: '/images/services/smart-home/wifi-tools.webp',
    scheduleId: 'wifi-setup',
    includes: ['Device diagnostics', 'Network troubleshooting', 'App reconnection', 'Feature verification'],
  },
  // Plumbing
  'garbage-disposal-install': {
    title: 'Garbage Disposal Installation',
    description: 'Install or replace garbage disposals with proper plumbing connections.',
    chips: ['New install', 'Replacement', 'Drain connection'],
    image: '/images/services/showcase/plumbing-disposal.webp',
    scheduleId: 'garbage-disposal-repair',
  },
  'sump-pump-service': {
    title: 'Sump Pump Service',
    description: 'Repair, replace, or maintain sump pump systems.',
    chips: ['Pump failure', 'Backup check', 'Float switch'],
    image: '/images/services/plumbing-service.webp',
    scheduleId: 'drain-cleaning',
  },
  // Appliances
  'range-oven-installation': {
    title: 'Oven & Stove',
    description: 'Repair and installation for gas or electric ranges and ovens.',
    chips: ['Not heating', 'Gas line hookup', 'Electrical connection', 'Safety check'],
  },
  'microwave-repair': {
    title: 'Microwave',
    description: 'Repair and installation for heating, display, turntable, and mounting.',
    chips: ['Not heating', 'Sparking', 'OTR mounting', 'Countertop setup'],
    image: APPLIANCE_SERVICE_IMAGES['microwave-repair'],
  },
  // Plumbing
  'faucet-repair': {
    title: 'Faucet Repair & Replacement',
    description: 'Fix drips, low pressure, leaks, and replace worn kitchen or bathroom faucets.',
    chips: ['Dripping faucet', 'Low pressure', 'Leak at base', 'Handle issue'],
    image: PLUMBING_SERVICE_IMAGES['faucet-repair'],
  },
  'toilet-repair': {
    title: 'Toilet Repair',
    description: 'Fix running toilets, clogs, leaks, and flushing issues.',
    chips: ['Running toilet', "Won't flush", 'Leaking at base', 'Clogged'],
    image: PLUMBING_SERVICE_IMAGES['toilet-repair'],
  },
  'water-heater-service': {
    title: 'Water Heater Service',
    description: 'Repair, tune-ups, and installation for tank and tankless water heaters.',
    chips: ['No hot water', 'Insufficient hot water', 'Leak at tank', 'Strange sounds'],
    image: PLUMBING_SERVICE_IMAGES['water-heater-service'],
  },
  'garbage-disposal-repair': {
    title: 'Garbage Disposal Service',
    description: 'Repair jams, leaks, and motor issues for kitchen disposals.',
    chips: ['Jammed unit', 'Leaking', 'Humming motor'],
    image: APPLIANCE_SERVICE_IMAGES['garbage-disposal-repair'],
  },
  // HVAC
  'ac-repair': {
    title: 'AC Repair',
    description: 'Cooling issues, weak airflow, warm air, and refrigerant problems.',
    chips: ['No cooling', 'Warm air', 'Weak airflow', 'Strange noise'],
    image: HVAC_SERVICE_IMAGES['ac-repair'],
  },
  'heating-furnace-repair': {
    title: 'Heating & Furnace Repair',
    description: 'No heat, ignition issues, poor airflow, and furnace performance problems.',
    chips: ['No heat', 'Burner not igniting', 'Short cycling', 'Unusual smell'],
    image: HVAC_SERVICE_IMAGES['heating-furnace-repair'],
  },
  'thermostat-installation': {
    title: 'Thermostat Installation',
    description: 'Smart thermostat setup and replacement with app configuration.',
    chips: ['Smart thermostat', 'Replacement', 'Wi-Fi setup', 'Schedule config'],
    image: HVAC_SERVICE_IMAGES['thermostat-installation'],
  },
  'hvac-maintenance': {
    title: 'HVAC Maintenance',
    description: 'Seasonal tune-ups and preventive care for heating and cooling systems.',
    chips: ['Filter replacement', 'Tune-up', 'Efficiency check', 'Safety inspection'],
    image: HVAC_SERVICE_IMAGES['hvac-maintenance'],
  },
  'duct-cleaning': {
    title: 'Duct Cleaning',
    description: 'Improve airflow and indoor air quality with professional duct cleaning.',
    chips: ['Dust buildup', 'Poor airflow', 'Allergens', 'Vent cleaning'],
    image: HVAC_SERVICE_IMAGES['duct-cleaning'],
  },
  'emergency-hvac-service': {
    title: 'Emergency HVAC Service',
    description: 'Urgent heating and cooling support when comfort cannot wait.',
    chips: ['No heat', 'No cooling', 'System failure', 'Gas smell'],
    image: HVAC_SERVICE_IMAGES['emergency-hvac-service'],
  },
  // Electrical
  'outlet-switch-repair': {
    title: 'Outlet / Switch Repair',
    description: 'Outlets, switches, dimmers',
    chips: ['No power', 'Loose outlet', 'Switch issue'],
    image: ELECTRICAL_SERVICE_IMAGES['outlet-switch-repair'],
    detailDescription:
      'Our technician checks the outlet or switch, identifies the issue, explains the recommended repair, and provides an estimate before work begins.',
    commonIssues: [
      'Outlet has no power',
      'Loose outlet',
      'Switch not working',
      'Burning smell',
      'Sparks or heat',
      'Breaker keeps tripping',
    ],
  },
  'light-fixture-installation': {
    title: 'Light Fixture Installation',
    description: 'Ceiling, pendant, wall lights',
    chips: ['Fixture install', 'Replacement', 'Wiring check'],
    image: ELECTRICAL_SERVICE_IMAGES['light-fixture-installation'],
    detailDescription:
      'Our technician reviews the fixture location, confirms wiring compatibility, installs or replaces the fixture, and tests operation before finishing.',
    commonIssues: [
      'New fixture installation',
      'Replacing old fixture',
      'Flickering after install',
      'No power to fixture',
      'Outdoor lighting setup',
    ],
  },
  'ceiling-fan-installation': {
    title: 'Ceiling Fan Installation',
    description: 'Fan wiring and mounting',
    chips: ['Fan install', 'Wobbling fan', 'Control issue'],
    image: ELECTRICAL_SERVICE_IMAGES['ceiling-fan-installation'],
    detailDescription:
      'Our technician mounts the fan securely, connects wiring and controls, balances the installation, and verifies safe operation.',
    commonIssues: [
      'New fan installation',
      'Fan wobbling or noisy',
      'Wall control not working',
      'Fan not turning on',
      'Replacing an old fan',
    ],
  },
  'breaker-panel-inspection': {
    title: 'Breaker / Panel Inspection',
    description: 'Breaker trips and panel issues',
    chips: ['Breaker trips', 'Panel check', 'Circuit issue'],
    image: ELECTRICAL_SERVICE_IMAGES['breaker-panel-inspection'],
    detailDescription:
      'Our technician inspects the panel and affected circuits, identifies tripping or overload issues, and explains recommended next steps with an estimate.',
    commonIssues: [
      'Breaker keeps tripping',
      'Buzzing from panel',
      'Partial power loss',
      'Old or outdated panel',
      'Need capacity review',
    ],
  },
  'appliance-electrical-connection': {
    title: 'Appliance Electrical Connection',
    description: 'Safe power connections',
    chips: ['Appliance setup', 'Power connection', 'Safety check'],
    image: ELECTRICAL_SERVICE_IMAGES['appliance-electrical-connection'],
    detailDescription:
      'Our technician verifies circuit requirements, connects the appliance safely, and performs a basic operational check before completion.',
    commonIssues: [
      'Range or oven connection',
      'Dryer circuit setup',
      'Dedicated circuit needed',
      'Outlet upgrade for appliance',
      'Post-install safety check',
    ],
  },
  'wiring-troubleshooting': {
    title: 'Wiring Troubleshooting',
    description: 'Testing, wiring, and faults',
    chips: ['No power', 'Flickering lights', 'Wiring issue'],
    image: ELECTRICAL_SERVICE_IMAGES['wiring-troubleshooting'],
    detailDescription:
      'Our technician traces the affected circuit, identifies wiring or connection problems, and explains repair options with an estimate before work begins.',
    commonIssues: [
      'No power in part of home',
      'Flickering lights',
      'Intermittent power loss',
      'Warm switches or outlets',
      'Unknown wiring issue',
    ],
  },
  'smart-device-wiring': {
    title: 'Smart Device Wiring',
    description: 'Support wiring for smart switches, smart thermostats, and connected home devices.',
    chips: ['Smart switch', 'Device wiring', 'App setup'],
    image: ELECTRICAL_SERVICE_IMAGES['smart-device-wiring'],
    detailDescription:
      'Our technician installs or wires compatible smart devices, connects them to your network when supported, and walks you through basic setup.',
    commonIssues: [
      'Smart switch installation',
      'Smart thermostat wiring',
      'Device not connecting',
      'Neutral wire questions',
      'Hub or app pairing help',
    ],
  },
  'emergency-electrical-service': {
    title: 'Emergency Electrical Service',
    description:
      'Priority support for urgent electrical issues, burning smells, sparks, or safety concerns.',
    chips: ['Urgent issue', 'Safety concern', 'Call first'],
    image: ELECTRICAL_SERVICE_IMAGES['emergency-electrical-service'],
    detailDescription:
      'Our team prioritizes urgent electrical requests. Share what is happening so we can respond quickly and advise on immediate safety steps.',
    commonIssues: [
      'Sparks or arcing',
      'Burning smell from outlet',
      'Partial or full power loss',
      'Buzzing breaker panel',
      'Visible damage to wiring',
    ],
    safetyNotice:
      'If you see sparks, smell burning, or have an active electrical hazard, turn off power if safe and call emergency services when needed.',
  },
};
