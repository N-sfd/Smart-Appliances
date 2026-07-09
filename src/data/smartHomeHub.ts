const BASE = '/images/services/smart-home';

export const SMART_HOME_HUB_IDS = new Set(['smart-thermostat-setup', 'smart-home-support', 'smart-home']);

export const SMART_HOME_HERO_IMAGE = `${BASE}/smart-home-hero.webp`;

/** Dedicated card + detail photos for each smart home service. */
export const SMART_HOME_SERVICE_IMAGES: Record<string, string> = {
  'doorbell-installation': `${BASE}/smart-doorbell-install.webp`,
  'smart-thermostat-setup': `${BASE}/smart-thermostat-install.webp`,
  'smart-lock-installation': `${BASE}/smart-lock-install.webp`,
  'camera-installation': `${BASE}/smart-camera-install.webp`,
  'smart-lighting-setup': `${BASE}/smart-switch-install.webp`,
  'smart-home-device-wiring': `${BASE}/smart-switch-install.webp`,
  'wifi-device-setup': `${BASE}/smart-wifi-setup.webp`,
  'wifi-setup': `${BASE}/smart-wifi-setup.webp`,
};

export const SMART_HOME_SERVICE_CARD_SUBTITLES: Record<string, string> = {
  'doorbell-installation': 'Ring, Nest, and Arlo doorbell install',
  'smart-thermostat-setup': 'Nest, Ecobee, and Honeywell setup',
  'smart-lock-installation': 'Smart lock fitting and app setup',
  'camera-installation': 'Indoor and outdoor camera mounting',
  'smart-lighting-setup': 'Smart switches and lighting controls',
  'wifi-device-setup': 'Connect devices to your home network',
};
