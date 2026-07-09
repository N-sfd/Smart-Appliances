/**
 * Dedicated per-service illustrations for the interactive "selected service"
 * detail panel (ServiceCategoryBookingSection) on Smart Home, TV Mounting, and
 * Handyman. No licensed photo exists yet for these individual services, so
 * each gets its own distinct on-brand vector scene — never a shared/generic
 * fallback and never an appliance photo. Swap any of these for a real photo
 * later without touching the consuming components.
 */

function detailIllustration(accent: string, accentDark: string, glyph: string): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" role="img">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${accentDark}"/>
      <stop offset="1" stop-color="${accent}"/>
    </linearGradient>
  </defs>
  <rect width="480" height="360" fill="url(#g)"/>
  <circle cx="412" cy="58" r="58" fill="#FFFFFF" opacity="0.06"/>
  <circle cx="46" cy="304" r="78" fill="#FFFFFF" opacity="0.06"/>
  <g fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" transform="translate(140 90)">
    ${glyph}
  </g>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const PURPLE = '#7C3AED';
const PURPLE_DARK = '#5B21B6';
const INDIGO = '#4F46E5';
const INDIGO_DARK = '#312E81';
const ORANGE = '#EA580C';
const ORANGE_DARK = '#9A3412';

// ── Smart Home ──────────────────────────────────────────────────────────────
export const WIFI_DEVICE_SETUP_IMAGE = detailIllustration(
  PURPLE,
  PURPLE_DARK,
  // Router with antennas + wifi arcs + phone
  '<rect x="10" y="70" width="120" height="34" rx="8"/><path d="M40 70v-14 M100 70v-14" stroke-linecap="round"/><circle cx="40" cy="87" r="4" fill="#FFFFFF" stroke="none"/><circle cx="70" cy="87" r="4" fill="#FFFFFF" stroke="none"/><path d="M155 60a55 55 0 0 1 0 78" opacity="0.85"/><path d="M175 40a85 85 0 0 1 0 118" opacity="0.55"/><g transform="translate(200 30)"><rect x="0" y="0" width="46" height="80" rx="10"/><circle cx="23" cy="66" r="4" fill="#FFFFFF" stroke="none"/></g>',
);

export const SMART_LIGHTING_SETUP_IMAGE = detailIllustration(
  PURPLE,
  PURPLE_DARK,
  // Smart bulb + rays + wall switch
  '<circle cx="55" cy="55" r="38"/><path d="M40 90h30 M46 100h18"/><path d="M55 4v14 M14 55H0 M96 55H110 M25 25 15 15 M85 25 95 15"/><g transform="translate(150 20)"><rect x="0" y="0" width="46" height="80" rx="10"/><circle cx="23" cy="24" r="7" fill="#FFFFFF" stroke="none"/><line x1="10" y1="55" x2="36" y2="55" stroke-width="6"/></g>',
);

export const SMART_DEVICE_WIRING_IMAGE = detailIllustration(
  PURPLE,
  PURPLE_DARK,
  // Low-voltage wire feeding into a small smart hub, with a safety check mark
  '<rect x="130" y="20" width="80" height="60" rx="10"/><circle cx="170" cy="50" r="10" fill="#FFFFFF" stroke="none"/><path d="M130 50H60" stroke-dasharray="2 8"/><path d="M60 50a18 18 0 0 0 -18 18v20" /><circle cx="42" cy="94" r="16"/><path d="M35 94l5 5l10 -11" stroke-width="6"/>',
);

// ── TV Mounting ──────────────────────────────────────────────────────────────
export const STANDARD_TV_MOUNTING_IMAGE = detailIllustration(
  INDIGO,
  INDIGO_DARK,
  // TV on a simple wall bracket
  '<rect x="0" y="0" width="200" height="120" rx="8"/><rect x="8" y="8" width="184" height="104" rx="4" opacity="0.4"/><rect x="92" y="120" width="16" height="26"/><path d="M70 146h60" stroke-width="6"/>',
);

export const LARGE_TV_MOUNTING_IMAGE = detailIllustration(
  INDIGO,
  INDIGO_DARK,
  // Wider TV with reinforced double-arm bracket + wall stud lines
  '<rect x="-20" y="-10" width="240" height="130" rx="8"/><rect x="-12" y="-2" width="224" height="114" rx="4" opacity="0.4"/><path d="M40 120v20 M160 120v20" stroke-width="6"/><path d="M40 140h120" stroke-width="6"/><path d="M0 -30v170 M200 -30v170" opacity="0.3" stroke-dasharray="2 8"/>',
);

export const WIRE_CONCEALMENT_IMAGE = detailIllustration(
  INDIGO,
  INDIGO_DARK,
  // TV with a neat cable channel routed down into a wall outlet
  '<rect x="10" y="0" width="180" height="104" rx="8"/><rect x="18" y="8" width="164" height="88" rx="4" opacity="0.4"/><rect x="92" y="104" width="16" height="70" opacity="0.85"/><rect x="70" y="182" width="60" height="30" rx="4"/><circle cx="88" cy="197" r="4" fill="#FFFFFF" stroke="none"/><circle cx="112" cy="197" r="4" fill="#FFFFFF" stroke="none"/>',
);

export const SOUNDBAR_INSTALLATION_IMAGE = detailIllustration(
  INDIGO,
  INDIGO_DARK,
  // TV above a soundbar with sound waves
  '<rect x="0" y="0" width="200" height="104" rx="8"/><rect x="8" y="8" width="184" height="88" rx="4" opacity="0.4"/><rect x="30" y="122" width="140" height="24" rx="12"/><circle cx="55" cy="134" r="3" fill="#FFFFFF" stroke="none"/><circle cx="75" cy="134" r="3" fill="#FFFFFF" stroke="none"/><path d="M190 118q14 16 0 32" opacity="0.85"/><path d="M204 108q26 26 0 52" opacity="0.5"/>',
);

export const TV_DISMOUNT_REMOUNT_IMAGE = detailIllustration(
  INDIGO,
  INDIGO_DARK,
  // TV being lifted off the bracket
  '<rect x="10" y="0" width="180" height="104" rx="8"/><rect x="18" y="8" width="164" height="88" rx="4" opacity="0.4"/><path d="M100 104v18" stroke-dasharray="3 7"/><rect x="78" y="130" width="44" height="14" rx="4" opacity="0.8"/><path d="M60 168l20 -14 20 14 20 -14 20 14" stroke-width="6"/>',
);

export const MEDIA_DEVICE_SETUP_IMAGE = detailIllustration(
  INDIGO,
  INDIGO_DARK,
  // Streaming box + remote, connected to the TV
  '<rect x="0" y="-30" width="150" height="86" rx="8"/><rect x="8" y="-22" width="134" height="70" rx="4" opacity="0.4"/><rect x="40" y="70" width="90" height="24" rx="8"/><circle cx="60" cy="82" r="4" fill="#FFFFFF" stroke="none"/><g transform="translate(178 40)"><rect x="0" y="0" width="26" height="70" rx="10"/><circle cx="13" cy="16" r="5" fill="#FFFFFF" stroke="none"/><line x1="6" y1="34" x2="20" y2="34" stroke-width="4"/><line x1="6" y1="46" x2="20" y2="46" stroke-width="4"/></g>',
);

// ── Handyman ─────────────────────────────────────────────────────────────────
export const GENERAL_HANDYMAN_SERVICE_IMAGE = detailIllustration(
  ORANGE,
  ORANGE_DARK,
  // Toolbox with a wrench laid across it
  '<rect x="0" y="56" width="200" height="112" rx="12"/><path d="M56 56v-18a16 16 0 0 1 16-16h56a16 16 0 0 1 16 16v18"/><path d="M0 100h200"/><g transform="translate(100,128) rotate(20)"><rect x="-50" y="-8" width="100" height="16" rx="6" fill="#FFFFFF" stroke="none"/><circle cx="-50" cy="0" r="14" fill="none" /></g>',
);

export const FURNITURE_ASSEMBLY_IMAGE = detailIllustration(
  ORANGE,
  ORANGE_DARK,
  // Flat-pack panel + allen key + hardware
  '<rect x="0" y="10" width="130" height="150" rx="8"/><path d="M0 60h130 M65 10v150" stroke-dasharray="4 8" opacity="0.6"/><g transform="translate(190,90) rotate(-25)"><path d="M-40 0h60v14h-14v26h-14v-26h-32z" fill="#FFFFFF" stroke="none"/></g>',
);

export const WALL_HANGING_IMAGE = detailIllustration(
  ORANGE,
  ORANGE_DARK,
  // Framed art hung level, with a level tool
  '<rect x="20" y="0" width="120" height="96" rx="4"/><circle cx="80" cy="48" r="26" opacity="0.5"/><g transform="translate(60,150)"><rect x="-60" y="-12" width="120" height="24" rx="6"/><circle cx="0" cy="0" r="8" fill="none"/><circle cx="0" cy="0" r="2.5" fill="#FFFFFF" stroke="none"/></g>',
);

export const SHELF_INSTALLATION_IMAGE = detailIllustration(
  ORANGE,
  ORANGE_DARK,
  // Wall shelf on brackets with books/décor
  '<line x1="0" y1="90" x2="200" y2="90" stroke-width="10"/><path d="M30 90v-30a10 10 0 0 1 10-10h10" opacity="0.7"/><path d="M150 90v-30a10 10 0 0 1 -10-10h-10" opacity="0.7"/><rect x="55" y="55" width="18" height="35" opacity="0.8"/><rect x="80" y="45" width="18" height="45" opacity="0.6"/><circle cx="120" cy="66" r="12" opacity="0.8"/>',
);

export const DRYWALL_REPAIR_IMAGE = detailIllustration(
  ORANGE,
  ORANGE_DARK,
  // Wall patch with a putty knife
  '<rect x="0" y="0" width="180" height="150" rx="6" opacity="0.9"/><circle cx="60" cy="60" r="20" opacity="0.4"/><path d="M120 40l30 30-20 40" opacity="0.4"/><g transform="translate(150,120) rotate(-15)"><rect x="-40" y="-7" width="60" height="14" rx="4" fill="#FFFFFF" stroke="none"/><rect x="18" y="-12" width="12" height="24" rx="4" fill="#FFFFFF" stroke="none"/></g>',
);

export const INTERIOR_PAINTING_IMAGE = detailIllustration(
  ORANGE,
  ORANGE_DARK,
  // Paint roller + tray + wall swatch
  '<rect x="0" y="0" width="150" height="150" rx="6" opacity="0.35"/><g transform="translate(70,40)"><rect x="-8" y="-30" width="16" height="34" rx="6"/><rect x="-4" y="0" width="8" height="20"/></g><path d="M130 130q30 0 30-30v-10" opacity="0.7"/><ellipse cx="165" cy="150" rx="30" ry="12" opacity="0.5"/>',
);

export const CURTAIN_ROD_INSTALLATION_IMAGE = detailIllustration(
  ORANGE,
  ORANGE_DARK,
  // Curtain rod with rings above a window
  '<line x1="0" y1="10" x2="200" y2="10" stroke-width="8"/><circle cx="0" cy="10" r="10" fill="#FFFFFF" stroke="none"/><circle cx="200" cy="10" r="10" fill="#FFFFFF" stroke="none"/>' +
    [0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${20 + i * 32}" cy="10" r="7"/>`).join('') +
    '<path d="M30 20q-10 60 0 130" opacity="0.7"/><path d="M170 20q10 60 0 130" opacity="0.7"/><rect x="0" y="150" width="200" height="10" rx="4" opacity="0.6"/>',
);

export const MINOR_HOME_REPAIRS_IMAGE = detailIllustration(
  ORANGE,
  ORANGE_DARK,
  // Wrench + small hardware parts
  '<g transform="translate(90,80) rotate(25)"><rect x="-16" y="-70" width="32" height="110" rx="10"/><circle cx="0" cy="-70" r="26" fill="none" stroke-width="14"/></g><circle cx="30" cy="150" r="10" opacity="0.7"/><circle cx="60" cy="160" r="7" opacity="0.7"/><circle cx="150" cy="150" r="9" opacity="0.7"/>',
);
