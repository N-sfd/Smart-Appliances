const SMART = '/images/services/smart-home';

export const SMART_HOME_HUB_IDS = new Set(['smart-thermostat-setup', 'smart-home-support', 'smart-home']);

export const SMART_HOME_HERO_IMAGE = `${SMART}/hero-installer.webp`;

/** Dedicated card + detail images for each smart home service */
export const SMART_HOME_SERVICE_IMAGES: Record<string, string> = {
  'smart-thermostat-setup': `${SMART}/thermostat-setup.webp`,
  'doorbell-installation': `${SMART}/doorbell-install.webp`,
  'camera-installation': `${SMART}/security-camera.webp`,
  'smart-lock-installation': `${SMART}/garage-opener.webp`,
  'wifi-setup': `${SMART}/wifi-tools.webp`,
  'tv-mounting': `${SMART}/tv-mounting.webp`,
};

export const SMART_HOME_SERVICE_CARD_SUBTITLES: Record<string, string> = {
  'smart-thermostat-setup': 'Nest, Ecobee, and Honeywell setup',
  'doorbell-installation': 'Ring, Nest, and Arlo doorbell install',
  'camera-installation': 'Indoor and outdoor camera mounting',
  'smart-lock-installation': 'Smart lock fitting and app setup',
  'wifi-setup': 'Connect devices to your home network',
  'tv-mounting': 'Wall mount with cable management',
};
