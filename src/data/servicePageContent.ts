import { serviceImages } from './expandedServiceImages';

/**
 * Static, category-specific "support" section shown on the four expanded service
 * pages (Handyman, TV Mounting, Phone Repair, Smart Home). Unlike the interactive
 * booking detail panel above it, this section never depends on which card the
 * visitor has clicked — it always renders the correct category content, so a
 * missing service-id mapping elsewhere can never surface generic appliance
 * content here. See src/components/CategorySupportSection.tsx for the renderer.
 *
 * `image` uses each category's real hero photo — there's no second licensed
 * photo available yet, and a real photo (even reused) reads far better than a
 * flat illustration panel. Swap `support` in expandedServiceImages.ts for a
 * dedicated photo whenever one is licensed; nothing else needs to change.
 */

export interface ServiceSupportContent {
  categorySlug: 'handyman' | 'tv-mounting' | 'phone-repair' | 'smart-home';
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  bullets: string[];
}

export const serviceSupportContent: Record<
  'handyman' | 'tvMounting' | 'phoneRepair' | 'smartHome',
  ServiceSupportContent
> = {
  handyman: {
    categorySlug: 'handyman',
    title: 'Reliable Handyman Help for Everyday Home Projects',
    subtitle:
      'Get help with furniture assembly, wall hanging, shelf installation, drywall repair, painting, and minor home projects.',
    image: serviceImages.handyman.support,
    imageAlt: 'Handyman completing a small home repair project',
    bullets: [
      'Project Details Reviewed First',
      'Help for Small Home Projects',
      'Clear Scheduling and Tracking',
      'Request ID Included',
    ],
  },

  tvMounting: {
    categorySlug: 'tv-mounting',
    title: 'Professional TV Mounting for a Clean Setup',
    subtitle:
      'Book help for TV mounting, bracket installation, wire concealment, soundbars, and media device setup.',
    image: serviceImages.tvMounting.support,
    imageAlt: 'Wall-mounted television setup in a living room',
    bullets: [
      'TV Size and Wall Type Reviewed',
      'Cleaner Entertainment Setup',
      'Optional Wire Concealment',
      'Request ID Included',
    ],
  },

  phoneRepair: {
    categorySlug: 'phone-repair',
    title: 'Convenient Phone Repair Request Support',
    subtitle:
      'Request help for screen replacement, battery issues, charging ports, camera problems, and device diagnostics.',
    image: serviceImages.phoneRepair.support,
    imageAlt: 'Smartphone repair on a technician workbench',
    bullets: [
      'Device Issue Captured Clearly',
      'Repair Type Matched to Request',
      'Clear Follow-Up',
      'Request ID Included',
    ],
  },

  smartHome: {
    categorySlug: 'smart-home',
    title: 'Smart Home Setup Made Easier',
    subtitle:
      'Book help for video doorbells, smart locks, smart thermostats, cameras, smart switches, and device setup.',
    image: serviceImages.smartHome.support,
    imageAlt: 'Smart home devices including thermostat, doorbell, lock, and camera',
    bullets: [
      'Device Setup Questions Included',
      'Wiring and Wi-Fi Details Captured',
      'Connected-Home Installation Support',
      'Request ID Included',
    ],
  },
};

/** Looks up support content by the page's URL slug (matches ServiceCategoryPageConfig.slug). */
export const SERVICE_SUPPORT_CONTENT_BY_SLUG: Record<string, ServiceSupportContent> = {
  handyman: serviceSupportContent.handyman,
  'tv-mounting': serviceSupportContent.tvMounting,
  'phone-repair': serviceSupportContent.phoneRepair,
  'smart-home': serviceSupportContent.smartHome,
};
