import {
  Bath,
  ChefHat,
  Cable,
  CircuitBoard,
  Droplets,
  Flame,
  Gauge,
  HouseWifi,
  Lightbulb,
  Lock,
  LucideIcon,
  Plug,
  Refrigerator,
  RefreshCw,
  ShieldAlert,
  Snowflake,
  Speaker,
  Thermometer,
  Toilet,
  TriangleAlert,
  Wind,
  Wrench,
  Zap,
  Fan,
  Camera,
  Bell,
  Wifi,
  Tv,
  Smartphone,
  Hammer,
  Monitor,
  PaintRoller,
  Ruler,
  Frame,
  Armchair,
  BatteryCharging,
  ToggleLeft,
  Unplug,
  Cast,
  PlugZap,
  Aperture,
  Mic,
  Droplet,
  Blinds,
  HardHat,
} from 'lucide-react';

export interface HubIconCard {
  id: string;
  label: string;
  /** Short one-line description shown below the label on the booking card. */
  description?: string;
  Icon: LucideIcon;
  serviceIds: string[];
}

export const homeApplianceIconCards: HubIconCard[] = [
  { id: 'dishwasher', label: 'Dishwasher', Icon: Droplets, serviceIds: ['dishwasher-repair'] },
  { id: 'washer-dryer', label: 'Washer & Dryer', Icon: RefreshCw, serviceIds: ['washer-dryer', 'washer-repair', 'dryer-repair'] },
  { id: 'refrigerator', label: 'Refrigerator', Icon: Refrigerator, serviceIds: ['refrigerator-repair'] },
  { id: 'oven-stove', label: 'Oven', Icon: Flame, serviceIds: ['oven-stove-repair'] },
  { id: 'cooktop', label: 'Cooktop', Icon: ChefHat, serviceIds: ['cooktop-repair'] },
  { id: 'microwave', label: 'Microwave', Icon: Zap, serviceIds: ['microwave-repair'] },
  { id: 'freezer', label: 'Freezer', Icon: Snowflake, serviceIds: ['freezer-repair'] },
  { id: 'garbage-disposal', label: 'Garbage Disposal', Icon: ChefHat, serviceIds: ['garbage-disposal-repair'] },
];

export const plumbingIconCards: HubIconCard[] = [
  { id: 'leak', label: 'Leak', Icon: Droplets, serviceIds: ['leak-repair'] },
  { id: 'drain', label: 'Drain', Icon: Wrench, serviceIds: ['drain-cleaning'] },
  { id: 'faucet', label: 'Faucet', Icon: Bath, serviceIds: ['faucet-repair'] },
  { id: 'toilet', label: 'Toilet', Icon: Toilet, serviceIds: ['toilet-repair'] },
  { id: 'water-heater', label: 'Water Heater', Icon: Flame, serviceIds: ['water-heater-service'] },
  { id: 'garbage-disposal', label: 'Garbage Disposal', Icon: ChefHat, serviceIds: ['garbage-disposal-install'] },
  { id: 'sump-pump', label: 'Sump Pump', Icon: Gauge, serviceIds: ['sump-pump-service', 'drain-cleaning'] },
  { id: 'emergency-plumbing', label: 'Emergency Plumbing', Icon: ShieldAlert, serviceIds: ['emergency-plumbing'] },
];

export const hvacIconCards: HubIconCard[] = [
  { id: 'ac-repair', label: 'AC Repair', Icon: Snowflake, serviceIds: ['ac-repair'] },
  { id: 'heating', label: 'Heating / Furnace', Icon: Flame, serviceIds: ['heating-furnace-repair'] },
  { id: 'thermostat', label: 'Thermostat', Icon: Thermometer, serviceIds: ['thermostat-installation'] },
  { id: 'maintenance', label: 'Maintenance', Icon: Wrench, serviceIds: ['hvac-maintenance'] },
  { id: 'duct-cleaning', label: 'Duct Cleaning', Icon: Wind, serviceIds: ['duct-cleaning'] },
  { id: 'emergency-hvac', label: 'Emergency HVAC', Icon: ShieldAlert, serviceIds: ['emergency-hvac-service'] },
];

export const electricalIconCards: HubIconCard[] = [
  { id: 'outlet-switch', label: 'Outlet / Switch', Icon: Plug, serviceIds: ['outlet-switch-repair'] },
  { id: 'light-fixture', label: 'Light Fixture', Icon: Lightbulb, serviceIds: ['light-fixture-installation'] },
  { id: 'ceiling-fan', label: 'Ceiling Fan', Icon: Fan, serviceIds: ['ceiling-fan-installation'] },
  { id: 'breaker-panel', label: 'Breaker / Panel', Icon: CircuitBoard, serviceIds: ['breaker-panel-inspection'] },
  { id: 'appliance-connection', label: 'Appliance Connection', Icon: Cable, serviceIds: ['appliance-electrical-connection'] },
  { id: 'wiring-check', label: 'Wiring Check', Icon: Wrench, serviceIds: ['wiring-troubleshooting'] },
  { id: 'smart-device-wiring', label: 'Smart Device Wiring', Icon: HouseWifi, serviceIds: ['smart-device-wiring'] },
  { id: 'emergency-electrical', label: 'Emergency Electrical', Icon: TriangleAlert, serviceIds: ['emergency-electrical-service'] },
];

export const smartHomeIconCards: HubIconCard[] = [
  { id: 'video-doorbell', label: 'Video Doorbell Installation', description: 'Install and pair a video doorbell with your app.', Icon: Bell, serviceIds: ['doorbell-installation'] },
  { id: 'smart-thermostat', label: 'Smart Thermostat Installation', description: 'Nest, Ecobee, and Honeywell thermostat setup.', Icon: Thermometer, serviceIds: ['smart-thermostat-setup'] },
  { id: 'smart-lock', label: 'Smart Lock Installation', description: 'Fit and program a smart lock with access codes.', Icon: Lock, serviceIds: ['smart-lock-installation'] },
  { id: 'security-camera', label: 'Security Camera Installation', description: 'Indoor and outdoor camera mounting and setup.', Icon: Camera, serviceIds: ['camera-installation'] },
  { id: 'smart-switch', label: 'Smart Switch Installation', description: 'Install smart switches and lighting controls.', Icon: ToggleLeft, serviceIds: ['smart-lighting-setup', 'smart-device-wiring'] },
  { id: 'wifi-setup', label: 'Wi-Fi Device Setup', description: 'Connect smart devices to your home network.', Icon: Wifi, serviceIds: ['wifi-device-setup', 'wifi-setup'] },
];

export const tvMountingIconCards: HubIconCard[] = [
  { id: 'standard-mount', label: 'Standard TV Mounting', description: 'Secure wall mounting for standard-size TVs.', Icon: Tv, serviceIds: ['standard-tv-mounting'] },
  { id: 'large-mount', label: 'Large TV Mounting', description: 'Reinforced mounting for large and extra-large TVs.', Icon: Monitor, serviceIds: ['large-tv-mounting'] },
  { id: 'wire-hide', label: 'Wire Concealment', description: 'Hide cables for a clean, finished look.', Icon: Cable, serviceIds: ['wire-concealment'] },
  { id: 'soundbar', label: 'Soundbar Installation', description: 'Mount and connect a soundbar to your TV.', Icon: Speaker, serviceIds: ['soundbar-installation'] },
  { id: 'dismount', label: 'TV Dismount / Remount', description: 'Safely remove and reinstall a mounted TV.', Icon: Unplug, serviceIds: ['tv-dismount'] },
  { id: 'media-setup', label: 'Media Device Setup', description: 'Connect streaming devices, consoles, and receivers.', Icon: Cast, serviceIds: ['media-device-setup'] },
];

export const phoneRepairIconCards: HubIconCard[] = [
  { id: 'screen', label: 'Screen Replacement', description: 'Replace cracked or unresponsive screens.', Icon: Smartphone, serviceIds: ['phone-screen-replacement'] },
  { id: 'battery', label: 'Battery Replacement', description: "Replace batteries that drain fast or won't hold a charge.", Icon: BatteryCharging, serviceIds: ['phone-battery-replacement'] },
  { id: 'charging', label: 'Charging Port Repair', description: 'Fix loose, damaged, or unresponsive charging ports.', Icon: PlugZap, serviceIds: ['phone-charging-port-repair'] },
  { id: 'camera', label: 'Camera Repair', description: 'Fix blurry, cracked, or non-functioning cameras.', Icon: Aperture, serviceIds: ['phone-camera-repair'] },
  { id: 'speaker', label: 'Speaker / Microphone', description: 'Fix muffled audio or call and mic issues.', Icon: Mic, serviceIds: ['phone-speaker-microphone-repair'] },
  { id: 'water-damage', label: 'Water-Damage Assessment', description: 'Inspection and next steps for liquid-exposed devices.', Icon: Droplet, serviceIds: ['phone-water-damage', 'phone-device-diagnostic'] },
];

export const handymanIconCards: HubIconCard[] = [
  { id: 'general', label: 'General Handyman Service', description: 'Help with small home projects and minor repairs.', Icon: Hammer, serviceIds: ['general-handyman-service', 'general-handyman'] },
  { id: 'furniture', label: 'Furniture Assembly', description: 'Assembly for flat-pack furniture, shelves, desks, and more.', Icon: Armchair, serviceIds: ['furniture-assembly'] },
  { id: 'wall-hang', label: 'Wall Hanging', description: 'Hang pictures, mirrors, décor, and wall-mounted items.', Icon: Frame, serviceIds: ['wall-hanging'] },
  { id: 'shelf', label: 'Shelf Installation', description: 'Install shelves, brackets, and small wall storage.', Icon: Ruler, serviceIds: ['shelf-installation'] },
  { id: 'drywall', label: 'Drywall Repair', description: 'Patch small holes, dents, cracks, and wall damage.', Icon: Wrench, serviceIds: ['drywall-repair'] },
  { id: 'painting', label: 'Interior Painting', description: 'Small-room painting, touch-ups, and wall refreshes.', Icon: PaintRoller, serviceIds: ['interior-painting'] },
  { id: 'curtain-rod', label: 'Curtain Rod Installation', description: 'Install curtain rods, brackets, and window hardware.', Icon: Blinds, serviceIds: ['curtain-rod-installation'] },
  { id: 'minor-repairs', label: 'Minor Home Repairs', description: 'Simple repairs and small household fixes.', Icon: HardHat, serviceIds: ['minor-home-repairs'] },
];

export const HUB_CATEGORY_IDS = {
  appliances: 'appliance-repair',
  plumbing: 'plumbing-services',
  hvac: 'hvac-services',
  electrical: 'electrical-services',
  smartHome: 'smart-home-setup',
} as const;
