/**
 * Central image map for the expanded service categories (Handyman, Phone Repair,
 * TV Mounting, Smart Home). Each category owns a unique hero image — no hero is
 * shared across categories, and none reuse the Appliance/HVAC/Plumbing/Electrical/
 * Garage Door/Resources/About/Contact/Membership/Pricing/Experts imagery.
 *
 * Card art uses category-specific Lucide icons (see serviceHubConfigs.ts), so only
 * hero photography lives here for now. Additional card photos can be added later at
 * the documented slots without changing consumers.
 */
const BASE = '/images/services';

export const serviceImages = {
  handyman: {
    hero: `${BASE}/handyman/handyman-hero.webp`,
    support: `${BASE}/handyman/handyman-support.webp`,
    general: `${BASE}/handyman/handyman-general.webp`,
    furnitureAssembly: `${BASE}/handyman/handyman-furniture-assembly.webp`,
    wallHanging: `${BASE}/handyman/handyman-wall-hanging.webp`,
    shelfInstallation: `${BASE}/handyman/handyman-shelf-installation.webp`,
    drywallRepair: `${BASE}/handyman/handyman-drywall-repair.webp`,
    interiorPainting: `${BASE}/handyman/handyman-interior-painting.webp`,
    curtainRod: `${BASE}/handyman/handyman-curtain-rod.webp`,
    minorRepairs: `${BASE}/handyman/handyman-minor-repairs.webp`,
  },
  phoneRepair: {
    hero: `${BASE}/phone-repair/phone-repair-hero.webp`,
    support: `${BASE}/phone-repair/phone-repair-support.webp`,
    screenReplacement: `${BASE}/phone-repair/phone-screen-replacement.webp`,
    batteryReplacement: `${BASE}/phone-repair/phone-battery-replacement.webp`,
    chargingPort: `${BASE}/phone-repair/phone-charging-port.webp`,
    cameraRepair: `${BASE}/phone-repair/phone-camera-repair.webp`,
    speakerRepair: `${BASE}/phone-repair/phone-speaker-repair.webp`,
    waterDamage: `${BASE}/phone-repair/phone-water-damage.webp`,
  },
  tvMounting: {
    hero: `${BASE}/tv-mounting/tv-mounting-hero.webp`,
    support: `${BASE}/tv-mounting/tv-mounting-support.webp`,
    standardMount: `${BASE}/tv-mounting/tv-standard-mount.webp`,
    largeMount: `${BASE}/tv-mounting/tv-large-mount.webp`,
    wireConcealment: `${BASE}/tv-mounting/tv-wire-concealment.webp`,
    soundbarInstall: `${BASE}/tv-mounting/tv-soundbar-install.webp`,
    dismountRemount: `${BASE}/tv-mounting/tv-dismount-remount.webp`,
    mediaSetup: `${BASE}/tv-mounting/tv-media-setup.webp`,
  },
  smartHome: {
    hero: `${BASE}/smart-home/smart-home-hero.webp`,
    support: `${BASE}/smart-home/smart-home-support.webp`,
    doorbell: `${BASE}/smart-home/smart-doorbell-install.webp`,
    thermostat: `${BASE}/smart-home/smart-thermostat-install.webp`,
    smartLock: `${BASE}/smart-home/smart-lock-install.webp`,
    camera: `${BASE}/smart-home/smart-camera-install.webp`,
    smartSwitch: `${BASE}/smart-home/smart-switch-install.webp`,
    wifiSetup: `${BASE}/smart-home/smart-wifi-setup.webp`,
  },
} as const;

/** Category slug → hero image (used by service hub pages). */
export const CATEGORY_HERO_IMAGE: Record<string, string> = {
  handyman: serviceImages.handyman.hero,
  'phone-repair': serviceImages.phoneRepair.hero,
  'tv-mounting': serviceImages.tvMounting.hero,
  'smart-home': serviceImages.smartHome.hero,
};

/** Category slug → fallback illustration variant if the hero photo fails to load. */
export const CATEGORY_FALLBACK_ILLUSTRATION: Record<
  string,
  'handyman' | 'phone-repair' | 'tv-mounting' | 'smart-home'
> = {
  handyman: 'handyman',
  'phone-repair': 'phone-repair',
  'tv-mounting': 'tv-mounting',
  'smart-home': 'smart-home',
};
