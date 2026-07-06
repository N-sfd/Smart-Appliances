import {
  Refrigerator, Snowflake, Droplets, Zap, HouseWifi, DoorOpen, ClipboardList, RefreshCcw, LucideIcon,
} from 'lucide-react';

export type ResourceCategoryId =
  | 'appliance-care'
  | 'hvac-energy'
  | 'plumbing'
  | 'electrical-safety'
  | 'smart-home'
  | 'garage-door'
  | 'maintenance'
  | 'repair-or-replace';

export interface ResourceCategory {
  id: ResourceCategoryId;
  label: string;
  description: string;
  icon: LucideIcon;
}

/** Canonical Help Center taxonomy — used for both hub category cards and article filters. */
export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    id: 'appliance-care',
    label: 'Appliance Care',
    description: 'Troubleshooting and upkeep for refrigerators, washers, dryers, dishwashers, and more.',
    icon: Refrigerator,
  },
  {
    id: 'hvac-energy',
    label: 'HVAC & Energy Savings',
    description: 'Heating, cooling, filters, and practical ways to lower your energy bill.',
    icon: Snowflake,
  },
  {
    id: 'plumbing',
    label: 'Plumbing Tips',
    description: 'Leak prevention, drain care, and knowing when a plumbing issue needs a pro.',
    icon: Droplets,
  },
  {
    id: 'electrical-safety',
    label: 'Electrical Safety',
    description: 'Warning signs to watch for and when to stop and call a licensed professional.',
    icon: Zap,
  },
  {
    id: 'smart-home',
    label: 'Smart Home Guides',
    description: 'Getting the most out of smart thermostats, locks, cameras, and connected devices.',
    icon: HouseWifi,
  },
  {
    id: 'garage-door',
    label: 'Garage Door Care',
    description: 'Rollers, tracks, springs, and simple maintenance to keep doors running safely.',
    icon: DoorOpen,
  },
  {
    id: 'maintenance',
    label: 'Maintenance Checklists',
    description: 'Seasonal and routine checklists to help you stay ahead of costly repairs.',
    icon: ClipboardList,
  },
  {
    id: 'repair-or-replace',
    label: 'Repair or Replace',
    description: 'How to weigh age, cost, and reliability when deciding what to do next.',
    icon: RefreshCcw,
  },
];

export function getResourceCategory(id: ResourceCategoryId): ResourceCategory | undefined {
  return RESOURCE_CATEGORIES.find((c) => c.id === id);
}
