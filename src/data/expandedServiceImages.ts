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
  },
  phoneRepair: {
    hero: `${BASE}/phone-repair/phone-repair-hero.webp`,
  },
  tvMounting: {
    hero: `${BASE}/tv-mounting/tv-mounting-hero.webp`,
  },
  smartHome: {
    hero: `${BASE}/smart-home/smart-home-hero.webp`,
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
