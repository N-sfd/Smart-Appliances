/**
 * Static, category-specific "support" section shown on the four expanded service
 * pages (Handyman, TV Mounting, Phone Repair, Smart Home). Unlike the interactive
 * booking detail panel above it, this section never depends on which card the
 * visitor has clicked — it always renders the correct category content, so a
 * missing service-id mapping elsewhere can never surface generic appliance
 * content here. See src/components/CategorySupportSection.tsx for the renderer.
 */

export interface ServiceSupportBullet {
  title: string;
  description: string;
}

export interface ServiceSupportContent {
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  bullets: ServiceSupportBullet[];
}

/** Distinct on-brand illustrations per category — no real photo is reused a second time on the page. */
function supportIllustration(accent: string, accentDark: string, glyph: string): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 360" role="img">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${accentDark}"/>
      <stop offset="1" stop-color="${accent}"/>
    </linearGradient>
  </defs>
  <rect width="560" height="360" rx="24" fill="url(#bg)"/>
  <circle cx="470" cy="60" r="70" fill="#FFFFFF" opacity="0.06"/>
  <circle cx="60" cy="300" r="90" fill="#FFFFFF" opacity="0.06"/>
  <circle cx="90" cy="70" r="6" fill="#FFFFFF" opacity="0.5"/>
  <circle cx="500" cy="290" r="8" fill="#FFFFFF" opacity="0.4"/>
  <circle cx="480" cy="170" r="5" fill="#FFFFFF" opacity="0.45"/>
  <g fill="none" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" transform="translate(180 90)">
    ${glyph}
  </g>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const HANDYMAN_SUPPORT_IMAGE = supportIllustration(
  '#EA580C',
  '#9A3412',
  // Toolbox
  '<rect x="0" y="56" width="200" height="112" rx="12"/><path d="M56 56v-18a16 16 0 0 1 16-16h56a16 16 0 0 1 16 16v18"/><path d="M0 100h200"/><rect x="84" y="82" width="32" height="32" rx="6" fill="#FFFFFF" stroke="none"/>',
);

const TV_MOUNTING_SUPPORT_IMAGE = supportIllustration(
  '#4F46E5',
  '#312E81',
  // Mounted TV with bracket + stand line
  '<rect x="0" y="0" width="200" height="126" rx="12"/><path d="M100 126v32"/><path d="M64 182h72"/><path d="M0 92h200" opacity="0.45"/>',
);

const PHONE_REPAIR_SUPPORT_IMAGE = supportIllustration(
  '#0D9488',
  '#115E59',
  // Phone with a wrench accent
  '<rect x="44" y="0" width="112" height="200" rx="20"/><path d="M88 172h24"/><path d="M66 28h68v120h-68z" opacity="0.35"/>',
);

const SMART_HOME_SUPPORT_IMAGE = supportIllustration(
  '#7C3AED',
  '#4C1D95',
  // House with connected nodes
  '<path d="M24 96 100 30l76 66"/><path d="M42 86v84h116V86"/><circle cx="100" cy="128" r="14" fill="#FFFFFF" stroke="none"/><path d="M78 114a32 32 0 0 1 44 0" opacity="0.55"/>',
);

export const serviceSupportContent: Record<
  'handyman' | 'tvMounting' | 'phoneRepair' | 'smartHome',
  ServiceSupportContent
> = {
  handyman: {
    title: 'Reliable Handyman Help for Everyday Home Projects',
    subtitle:
      'Get help with furniture assembly, wall hanging, drywall repair, painting, shelf installation, and minor home projects.',
    image: HANDYMAN_SUPPORT_IMAGE,
    imageAlt: 'Handyman completing a small home repair project',
    bullets: [
      {
        title: 'Project details reviewed first',
        description: 'Share what you need done so we can understand the scope before work begins.',
      },
      {
        title: 'Help for small home projects',
        description: 'From assembly to hanging and minor repairs, request the right type of handyman help.',
      },
      {
        title: 'Clear scheduling and tracking',
        description: 'Book online and receive a request ID for follow-up and tracking.',
      },
    ],
  },

  tvMounting: {
    title: 'Professional TV Mounting for a Clean Setup',
    subtitle:
      'Book help for TV mounting, bracket installation, wire concealment, soundbars, and media device setup.',
    image: TV_MOUNTING_SUPPORT_IMAGE,
    imageAlt: 'Wall-mounted television setup in a living room',
    bullets: [
      {
        title: 'Mounting details confirmed',
        description: 'TV size, wall type, bracket type, and setup preferences are reviewed before service.',
      },
      {
        title: 'Cleaner entertainment setup',
        description: 'Add options such as wire concealment, soundbar installation, and device setup.',
      },
      {
        title: 'Request tracking included',
        description: 'Receive a request ID so you can track your service request.',
      },
    ],
  },

  phoneRepair: {
    title: 'Convenient Phone Repair Request Support',
    subtitle:
      'Request help for screen replacement, battery issues, charging ports, camera problems, and device diagnostics.',
    image: PHONE_REPAIR_SUPPORT_IMAGE,
    imageAlt: 'Smartphone repair on a technician workbench',
    bullets: [
      {
        title: 'Device issue captured clearly',
        description: 'Share your device brand, model, repair type, and issue details during booking.',
      },
      {
        title: 'Repair type matched to request',
        description: 'Screen, battery, charging port, camera, speaker, and diagnostic needs are handled separately.',
      },
      {
        title: 'Clear follow-up',
        description: 'Your request is saved with a request ID for tracking and follow-up.',
      },
    ],
  },

  smartHome: {
    title: 'Smart Home Setup Made Easier',
    subtitle:
      'Book help for video doorbells, smart locks, smart thermostats, cameras, smart switches, and device setup.',
    image: SMART_HOME_SUPPORT_IMAGE,
    imageAlt: 'Smart home devices including a thermostat, camera, lock, and doorbell',
    bullets: [
      {
        title: 'Device setup questions included',
        description: 'We collect wiring, Wi-Fi, app setup, and device details before scheduling.',
      },
      {
        title: 'Connected-home installation support',
        description: 'Get help with smart locks, doorbells, thermostats, cameras, and device setup.',
      },
      {
        title: 'Simple online booking',
        description: 'Choose your service, share device details, and receive a request ID.',
      },
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
