import KitchenIcon from '@mui/icons-material/Kitchen';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import BoltIcon from '@mui/icons-material/Bolt';
import SensorsIcon from '@mui/icons-material/Sensors';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
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
    description: 'Refrigerator, washer, dryer, dishwasher, oven, and microwave service.',
    illustration: 'appliance-care',
  },
  {
    id: 'hvac-services',
    label: 'HVAC Services',
    path: '/services/hvac-support',
    icon: AcUnitIcon,
    description: 'AC repair, heating, thermostats, duct cleaning, and maintenance.',
    illustration: 'hvac-services',
  },
  {
    id: 'plumbing-services',
    label: 'Plumbing Services',
    path: '/services/plumbing',
    icon: WaterDropIcon,
    description: 'Leak repair, drain cleaning, faucets, and water heater service.',
    illustration: 'plumbing-services',
  },
  {
    id: 'electrical-services',
    label: 'Electrical Services',
    path: '/services/electrical',
    icon: BoltIcon,
    description: 'Outlets, breaker panels, fixtures, and wiring troubleshooting.',
    illustration: 'electrical-services',
  },
  {
    id: 'smart-home-setup',
    label: 'Smart Home Services',
    path: '/services/smart-thermostat-setup',
    icon: SensorsIcon,
    description: 'Video doorbells, smart locks, thermostats, and security cameras.',
    illustration: 'smart-home-setup',
  },
  {
    id: 'garage-door-repair',
    label: 'Garage Door Services',
    path: '/services/garage-door-repair',
    icon: WarehouseIcon,
    description: 'Openers, tracks, sensors, and spring inspection.',
    illustration: 'garage-door-repair',
  },
  {
    id: 'emergency-service',
    label: 'Emergency Service',
    path: '/emergency-service',
    icon: WarningAmberIcon,
    description: 'Urgent, same-day service when something can’t wait.',
    illustration: 'emergency-service',
  },
];

export const serviceNavPath = (item: ServiceNavItem): string => item.path;

const SMART_HOME_PREFIXES = [
  '/services/smart-thermostat-setup',
  '/services/doorbell-installation',
  '/services/camera-installation',
  '/services/smart-lock-installation',
  '/services/wifi-setup',
  '/services/tv-mounting',
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

  if (item.id === 'garage-door-repair') {
    return pathname === '/services/garage-door-repair';
  }

  return pathname === item.path;
};
