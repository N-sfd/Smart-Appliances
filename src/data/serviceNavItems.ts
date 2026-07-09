import KitchenIcon from '@mui/icons-material/Kitchen';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import BoltIcon from '@mui/icons-material/Bolt';
import SensorsIcon from '@mui/icons-material/Sensors';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TvIcon from '@mui/icons-material/Tv';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import ConstructionIcon from '@mui/icons-material/Construction';
import type { SvgIconComponent } from '@mui/icons-material';
import { serviceCategories } from './services';
import type { ServiceMenuIllustrationVariant } from '../components/illustrations/ServiceMenuIllustration';

export interface ServiceNavItem {
  id: string;
  label: string;
  path: string;
  icon: SvgIconComponent;
  /** One-line summary shown in the desktop mega menu card. */
  description: string;
  /** Compact badge icon shown in the desktop mega menu and mobile accordion. */
  illustration: ServiceMenuIllustrationVariant;
}

const HOME_APPLIANCE_CATEGORY_IDS = new Set(['appliance-repair', 'appliance-installation']);

export const HOME_APPLIANCE_SERVICE_IDS = new Set(
  serviceCategories
    .filter((c) => HOME_APPLIANCE_CATEGORY_IDS.has(c.id))
    .flatMap((c) => c.services.map((s) => s.id)),
);

export const PLUMBING_SERVICE_IDS = new Set(
  serviceCategories
    .find((c) => c.id === 'plumbing-services')
    ?.services.map((s) => s.id) ?? [],
);

export const ELECTRICAL_SERVICE_IDS = new Set(
  serviceCategories
    .find((c) => c.id === 'electrical-services')
    ?.services.map((s) => s.id) ?? [],
);

/** Header Services dropdown — category list only (no individual repair services) */
export const serviceNavItems: ServiceNavItem[] = [
  {
    id: 'home-appliances',
    label: 'Appliance Care',
    path: '/services/home-appliances',
    icon: KitchenIcon,
    description: 'Refrigerator, Washer, Dryer, Dishwasher, Oven, and Microwave Service.',
    illustration: 'appliance-care',
  },
  {
    id: 'hvac-services',
    label: 'HVAC Services',
    path: '/services/hvac-support',
    icon: AcUnitIcon,
    description: 'AC Repair, Heating, Thermostats, Duct Cleaning, and Maintenance.',
    illustration: 'hvac-services',
  },
  {
    id: 'plumbing-services',
    label: 'Plumbing Services',
    path: '/services/plumbing',
    icon: WaterDropIcon,
    description: 'Leak Repair, Drain Cleaning, Faucets, and Water Heater Service.',
    illustration: 'plumbing-services',
  },
  {
    id: 'electrical-services',
    label: 'Electrical Services',
    path: '/services/electrical',
    icon: BoltIcon,
    description: 'Outlets, Breaker Panels, Fixtures, and Wiring Troubleshooting.',
    illustration: 'electrical-services',
  },
  {
    id: 'smart-home-setup',
    label: 'Smart Home Services',
    path: '/services/smart-home',
    icon: SensorsIcon,
    description: 'Video Doorbells, Smart Locks, Smart Thermostats, Security Cameras, and Device Setup.',
    illustration: 'smart-home-setup',
  },
  {
    id: 'tv-mounting',
    label: 'TV Mounting',
    path: '/services/tv-mounting',
    icon: TvIcon,
    description: 'TV Mounting, Wire Concealment, Soundbar Installation, and Device Setup.',
    illustration: 'tv-mounting',
  },
  {
    id: 'phone-repair',
    label: 'Phone Repair',
    path: '/services/phone-repair',
    icon: PhoneAndroidIcon,
    description: 'Screen Replacement, Battery Replacement, Charging Port Repair, and Device Diagnostics.',
    illustration: 'phone-repair',
  },
  {
    id: 'handyman',
    label: 'Handyman Services',
    path: '/services/handyman',
    icon: ConstructionIcon,
    description: 'Furniture Assembly, Wall Hanging, Drywall Repair, Painting, and Minor Home Projects.',
    illustration: 'handyman',
  },
  {
    id: 'garage-door-repair',
    label: 'Garage Door Services',
    path: '/services/garage-door-repair',
    icon: WarehouseIcon,
    description: 'Openers, Tracks, Sensors, and Spring Inspection.',
    illustration: 'garage-door-repair',
  },
  {
    id: 'emergency-service',
    label: 'Emergency Service',
    path: '/emergency-service',
    icon: WarningAmberIcon,
    description: 'Urgent, Same-Day Service When Something Can’t Wait.',
    illustration: 'emergency-service',
  },
];

export const serviceNavPath = (item: ServiceNavItem): string => item.path;

const SMART_HOME_PREFIXES = [
  '/services/smart-home',
  '/services/smart-thermostat-setup',
  '/services/tv-mounting',
  '/services/phone-repair',
  '/services/handyman',
  '/services/doorbell-installation',
  '/services/camera-installation',
  '/services/smart-lock-installation',
  '/services/wifi-setup',
];

export const isServiceNavItemActive = (
  item: ServiceNavItem,
  pathname: string,
  search: string,
): boolean => {
  if (item.id === 'home-appliances') {
    if (pathname === '/services/home-appliances') return true;
    if (!pathname.startsWith('/services/')) return false;
    const segment = pathname.replace('/services/', '').split('/')[0];
    return HOME_APPLIANCE_SERVICE_IDS.has(segment);
  }

  if (item.id === 'plumbing-services') {
    if (pathname === '/services/plumbing' || pathname === '/services/plumbing-support') return true;
    if (!pathname.startsWith('/services/')) return false;
    const segment = pathname.replace('/services/', '').split('/')[0];
    return PLUMBING_SERVICE_IDS.has(segment);
  }

  if (item.id === 'electrical-services') {
    if (pathname === '/services/electrical' || pathname === '/services/electrical-support') return true;
    if (!pathname.startsWith('/services/')) return false;
    const segment = pathname.replace('/services/', '').split('/')[0];
    return ELECTRICAL_SERVICE_IDS.has(segment);
  }

  if (item.id === 'smart-home-setup') {
    return SMART_HOME_PREFIXES.some((p) => pathname === p || pathname.startsWith(p));
  }

  if (item.id === 'tv-mounting') {
    return pathname === '/services/tv-mounting';
  }

  if (item.id === 'phone-repair') {
    return pathname === '/services/phone-repair';
  }

  if (item.id === 'handyman') {
    return pathname === '/services/handyman';
  }

  if (item.id === 'garage-door-repair') {
    return pathname === '/services/garage-door-repair';
  }

  return pathname === item.path;
};
