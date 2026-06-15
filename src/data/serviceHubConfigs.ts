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
  HelpCircle,
  Wifi,
} from 'lucide-react';

export interface HubIconCard {
  id: string;
  label: string;
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
  { id: 'freezer', label: 'Freezer', Icon: Snowflake, serviceIds: ['refrigerator-repair'] },
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
  { id: 'security-camera', label: 'Security Camera', Icon: Camera, serviceIds: ['camera-installation'] },
  { id: 'video-doorbell', label: 'Video Doorbell', Icon: Bell, serviceIds: ['doorbell-installation'] },
  { id: 'smart-thermostat', label: 'Smart Thermostat', Icon: Thermometer, serviceIds: ['smart-thermostat-setup'] },
  { id: 'smart-lock', label: 'Smart Lock', Icon: Lock, serviceIds: ['smart-lock-installation'] },
  { id: 'smart-hub', label: 'Smart Hub / Speaker', Icon: Speaker, serviceIds: ['smart-hub-setup'] },
  { id: 'wifi-network', label: 'WiFi / Network Device', Icon: Wifi, serviceIds: ['wifi-device-setup'] },
  { id: 'smart-lighting', label: 'Smart Lighting', Icon: Lightbulb, serviceIds: ['smart-lighting-setup'] },
  { id: 'other-smart', label: 'Other Smart Device', Icon: HelpCircle, serviceIds: ['smart-device-troubleshooting', 'wifi-device-setup', 'smart-hub-setup'] },
];

export const HUB_CATEGORY_IDS = {
  appliances: 'appliance-repair',
  plumbing: 'plumbing-services',
  hvac: 'hvac-services',
  electrical: 'electrical-services',
  smartHome: 'smart-home-setup',
} as const;
