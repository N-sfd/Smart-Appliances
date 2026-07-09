import { HVAC_SERVICE_IMAGES } from './hvacHub';
import { ELECTRICAL_SERVICE_IMAGES } from './electricalHub';
import { APPLIANCE_SERVICE_IMAGES } from './applianceHub';
import { PLUMBING_SERVICE_IMAGES } from './plumbingHub';
import { SMART_HOME_SERVICE_IMAGES } from './smartHomeHub';
import { CATEGORY_HERO_IMAGE } from './expandedServiceImages';

/**
 * No dedicated smart lock photo exists yet (the old data accidentally pointed this
 * at the garage-door-opener image instead). Inline placeholder until a real
 * photo is available.
 */
export const SMART_LOCK_PLACEHOLDER_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" role="img" aria-label="Smart lock illustration">
  <defs>
    <linearGradient id="lockBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#5B21B6"/>
      <stop offset="1" stop-color="#7C3AED"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#lockBg)"/>
  <g fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="140" y="140" width="120" height="90" rx="12"/>
    <path d="M162 140v-30a38 38 0 0 1 76 0v30"/>
    <circle cx="200" cy="180" r="10" fill="#FFFFFF" stroke="none"/>
    <path d="M200 190v18" />
  </g>
</svg>
`)}`;

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
    image: SMART_LOCK_PLACEHOLDER_IMAGE,
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
    image: '/images/services/appliances/garbage-disposal-install.png',
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
  // Handyman
  'general-handyman-service': {
    title: 'General Handyman Service',
    description: 'Skilled help for a wide range of home repair and maintenance tasks.',
    chips: ['Home projects', 'Repairs', 'Installations'],
    image: CATEGORY_HERO_IMAGE.handyman,
    detailDescription:
      'Tell us about your project and our technician will review the scope, confirm timing, and provide an estimate before starting work.',
    includes: ['Project scope reviewed first', 'Skilled local technician', 'Estimate before work begins', 'Clean, careful workmanship'],
  },
  'furniture-assembly': {
    title: 'Furniture Assembly',
    description: 'Assembly for flat-pack furniture, shelving units, and home office pieces.',
    chips: ['Flat-pack assembly', 'Shelving', 'Office furniture'],
    image: CATEGORY_HERO_IMAGE.handyman,
    detailDescription:
      'Our technician assembles your furniture using the manufacturer instructions and checks stability before finishing.',
    includes: ['Flat-pack and kit furniture', 'Shelving and storage units', 'Hardware and tool provided', 'Stability check before completion'],
  },
  'wall-hanging': {
    title: 'Wall Hanging',
    description: 'Secure mounting for shelves, mirrors, art, and curtain rods.',
    chips: ['Picture hanging', 'Mirror mounting', 'Curtain rods'],
    image: CATEGORY_HERO_IMAGE.handyman,
    detailDescription:
      'Our technician locates studs or uses appropriate anchors, levels the item, and mounts it securely for your wall type.',
    includes: ['Stud finding and anchoring', 'Level and secure mounting', 'Art, mirrors, and shelving', 'Curtain rod installation'],
  },
  'drywall-repair': {
    title: 'Drywall Repair',
    description: 'Patch holes, cracks, and dents for a smooth, paint-ready wall.',
    chips: ['Small holes', 'Cracks', 'Dents'],
    image: CATEGORY_HERO_IMAGE.handyman,
    detailDescription:
      'Our technician patches and sands the damaged area so it is smooth and ready for paint or texture matching.',
    includes: ['Hole and crack patching', 'Sanding and smoothing', 'Texture matching where possible', 'Paint-ready finish'],
  },
  'interior-painting': {
    title: 'Interior Painting',
    description: 'Touch-up and small-room painting for walls, trim, and ceilings.',
    chips: ['Wall painting', 'Trim touch-up', 'Small rooms'],
    image: CATEGORY_HERO_IMAGE.handyman,
    detailDescription:
      'Our technician preps the surface, protects surrounding areas, and applies a clean, even coat for the space you choose.',
    includes: ['Surface prep and taping', 'Walls, trim, or ceilings', 'Even, clean coverage', 'Furniture and floor protection'],
  },
  'shelf-installation': {
    title: 'Shelf Installation',
    description: 'Level, secure shelving for closets, garages, and living spaces.',
    chips: ['Floating shelves', 'Closet shelving', 'Garage storage'],
    image: CATEGORY_HERO_IMAGE.handyman,
    detailDescription:
      'Our technician measures and levels your shelving, anchors it to the wall, and confirms it can safely hold your items.',
    includes: ['Measuring and leveling', 'Stud-anchored mounting', 'Weight-safe installation', 'Closet, garage, or living space shelving'],
  },
  // TV Mounting
  'standard-tv-mounting': {
    title: 'Standard TV Mounting',
    description: 'Secure wall mounting for standard-size televisions.',
    chips: ['Up to 55"', 'Stud mounting', 'Level install'],
    image: CATEGORY_HERO_IMAGE['tv-mounting'],
    detailDescription:
      'Our technician finds studs, mounts the bracket securely, and levels and attaches your TV for a clean, safe install.',
    includes: ['Bracket mounted to studs', 'TV leveled and secured', 'Cables connected and tested', 'Packaging cleared away'],
  },
  'large-tv-mounting': {
    title: 'Large TV Mounting',
    description: 'Secure wall mounting for large and extra-large televisions.',
    chips: ['56" and larger', 'Reinforced mounting', 'Two-person install'],
    image: CATEGORY_HERO_IMAGE['tv-mounting'],
    detailDescription:
      'Our technician uses a reinforced bracket and confirms wall support before mounting your large-screen TV securely and level.',
    includes: ['Reinforced bracket for larger screens', 'Wall support verified', 'Level, secure mounting', 'Cables connected and tested'],
  },
  'wire-concealment': {
    title: 'Wire Concealment',
    description: 'Hide cables in-wall or in a cable channel for a clean look.',
    chips: ['In-wall kit', 'Cable channel', 'Outlet relocation'],
    image: CATEGORY_HERO_IMAGE['tv-mounting'],
    detailDescription:
      'Our technician routes cables using an in-wall kit or cable channel so your setup looks clean with no visible wires.',
    includes: ['In-wall cable kit option', 'Surface cable channel option', 'Power and A/V cables routed', 'Clean, finished appearance'],
  },
  'soundbar-installation': {
    title: 'Soundbar Installation',
    description: 'Mounting and connection for soundbars and audio systems.',
    chips: ['Wall or shelf mount', 'Audio connection', 'Remote setup'],
    image: CATEGORY_HERO_IMAGE['tv-mounting'],
    detailDescription:
      'Our technician mounts or places your soundbar, connects it to your TV, and confirms audio is working before leaving.',
    includes: ['Wall or shelf mounting', 'Audio cable or HDMI-ARC connection', 'Remote and input setup', 'Sound test before completion'],
  },
  'tv-dismount': {
    title: 'TV Dismount / Remount',
    description: 'Safely remove and reinstall a TV for moving, painting, or repairs.',
    chips: ['Dismount', 'Remount', 'Wall patch on request'],
    image: CATEGORY_HERO_IMAGE['tv-mounting'],
    detailDescription:
      'Our technician safely dismounts your TV and either reinstalls it on the same wall or prepares it for your move.',
    includes: ['Safe TV removal', 'Bracket removal or reuse', 'Reinstallation at new location', 'Cable reconnection and test'],
  },
  'media-device-setup': {
    title: 'Media Device Setup',
    description: 'Connect streaming devices, game consoles, and A/V receivers.',
    chips: ['Streaming device', 'Game console', 'A/V receiver'],
    image: CATEGORY_HERO_IMAGE['tv-mounting'],
    detailDescription:
      'Our technician connects and configures your streaming devices, consoles, or receiver so everything works from one remote setup.',
    includes: ['Device connection and power', 'Input and remote configuration', 'Network and app sign-in help', 'Picture and sound check'],
  },
  // Phone Repair
  'phone-screen-replacement': {
    title: 'Screen Replacement',
    description: 'Replace cracked or unresponsive smartphone screens.',
    chips: ['Cracked screen', 'Unresponsive touch', 'Display issue'],
    image: CATEGORY_HERO_IMAGE['phone-repair'],
    detailDescription:
      'Our technician replaces your damaged screen with a quality-tested part and confirms touch response and display quality before handoff.',
    includes: ['Device brand and model confirmed', 'Screen replaced and tested', 'Touch and display check', 'No passcodes collected online'],
  },
  'phone-battery-replacement': {
    title: 'Battery Replacement',
    description: 'Replace batteries that drain quickly or fail to hold a charge.',
    chips: ['Fast draining', "Won't charge", 'Swollen battery'],
    image: CATEGORY_HERO_IMAGE['phone-repair'],
    detailDescription:
      'Our technician safely replaces your battery and tests charging and power performance before returning your device.',
    includes: ['Battery health checked', 'Safe battery replacement', 'Charging test', 'Device performance check'],
  },
  'phone-charging-port-repair': {
    title: 'Charging Port Repair',
    description: 'Fix loose, damaged, or unresponsive charging ports.',
    chips: ['Loose connection', "Won't charge", 'Debris in port'],
    image: CATEGORY_HERO_IMAGE['phone-repair'],
    detailDescription:
      'Our technician inspects and repairs or replaces the charging port so your device connects and charges reliably again.',
    includes: ['Port inspection and cleaning', 'Repair or part replacement', 'Charging cable test', 'Connection stability check'],
  },
  'phone-camera-repair': {
    title: 'Camera Repair',
    description: 'Fix blurry, cracked, or non-functioning phone cameras.',
    chips: ['Blurry photos', 'Cracked lens', "Camera won't open"],
    image: CATEGORY_HERO_IMAGE['phone-repair'],
    detailDescription:
      'Our technician diagnoses the front or rear camera issue, repairs or replaces the affected module, and tests photo and video quality.',
    includes: ['Front and rear camera diagnostics', 'Lens or module replacement', 'Photo and video test', 'Focus and clarity check'],
  },
  'phone-speaker-microphone-repair': {
    title: 'Speaker / Microphone Repair',
    description: 'Fix muffled audio, call issues, or unresponsive microphones.',
    chips: ['Muffled sound', 'No call audio', 'Mic not working'],
    image: CATEGORY_HERO_IMAGE['phone-repair'],
    detailDescription:
      'Our technician tests speaker and microphone function, repairs or replaces the affected part, and confirms clear call and media audio.',
    includes: ['Speaker and mic diagnostics', 'Component repair or replacement', 'Call audio test', 'Media playback check'],
  },
  'phone-device-diagnostic': {
    title: 'Device Diagnostic',
    description: 'A full check-up to identify the source of a device issue.',
    chips: ['Unknown issue', 'Multiple symptoms', 'Pre-repair check'],
    image: CATEGORY_HERO_IMAGE['phone-repair'],
    detailDescription:
      'Our technician runs a full diagnostic across hardware and software to identify the issue and recommend the right repair.',
    includes: ['Hardware and software check', 'Issue identification', 'Repair recommendation', 'No data collected without consent'],
  },
  'phone-water-damage': {
    title: 'Water-Damage Assessment',
    description: 'Inspection and next-step guidance for a water-exposed device.',
    chips: ['Liquid exposure', 'Not powering on', 'Corrosion check'],
    image: CATEGORY_HERO_IMAGE['phone-repair'],
    detailDescription:
      'Our technician inspects your device for liquid damage and corrosion and recommends the safest next step for recovery or repair.',
    includes: ['Liquid damage inspection', 'Corrosion check', 'Safe drying guidance', 'Repair or replacement recommendation'],
  },
};
