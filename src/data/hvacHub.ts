export const HVAC_HUB_IDS = new Set(['hvac', 'hvac-support']);

export const HVAC_HERO_IMAGE = '/images/services/hvac/ac-repair.webp';

const HVAC = '/images/services/hvac';

/** Dedicated card + detail images for each HVAC service */
export const HVAC_SERVICE_IMAGES: Record<string, string> = {
  'ac-repair': `${HVAC}/ac-repair.webp`,
  'heating-furnace-repair': `${HVAC}/heating-furnace-repair.webp`,
  'thermostat-installation': `${HVAC}/thermostat-installation.png`,
  'hvac-maintenance': `${HVAC}/hvac-maintenance.webp`,
  'duct-cleaning': `${HVAC}/duct-cleaning.webp`,
  'emergency-hvac-service': `${HVAC}/emergency-hvac-service.webp`,
};

export const HVAC_SERVICE_CARD_SUBTITLES: Record<string, string> = {
  'ac-repair': 'Cooling issues, weak airflow, warm air',
  'heating-furnace-repair': 'No heat, ignition issues, poor airflow',
  'thermostat-installation': 'Smart thermostat setup and replacement',
  'hvac-maintenance': 'Seasonal tune-ups and preventive care',
  'duct-cleaning': 'Improve airflow and indoor air quality',
  'emergency-hvac-service': 'Urgent heating and cooling support',
};
