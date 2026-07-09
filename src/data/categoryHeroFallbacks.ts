/**
 * Inline, on-brand SVG illustrations used as guaranteed fallbacks when a
 * category hero photo fails to load. Each is a category-specific glyph so a
 * page never shows a broken image or a generic appliance photo.
 */

type FallbackKey = 'handyman' | 'phone-repair' | 'tv-mounting' | 'smart-home';

const wrap = (glyph: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0B3D91"/>
      <stop offset="1" stop-color="#1A73E8"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#g)"/>
  <g fill="none" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" transform="translate(120 120)">
    ${glyph}
  </g>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const GLYPHS: Record<FallbackKey, string> = {
  // Toolbox
  handyman:
    '<rect x="0" y="40" width="160" height="90" rx="10"/><path d="M45 40v-14a12 12 0 0 1 12-12h46a12 12 0 0 1 12 12v14"/><path d="M0 74h160"/><rect x="66" y="60" width="28" height="28" rx="5" fill="#FFFFFF" stroke="none"/>',
  // Smartphone with wrench accent
  'phone-repair':
    '<rect x="35" y="0" width="90" height="160" rx="16"/><path d="M70 138h20"/><path d="M52 22h56v96h-56z" opacity="0.35"/>',
  // Mounted TV on wall bracket
  'tv-mounting':
    '<rect x="0" y="10" width="160" height="100" rx="10"/><path d="M80 110v26"/><path d="M52 150h56"/><path d="M0 78h160" opacity="0.4"/>',
  // House with wifi/connected nodes
  'smart-home':
    '<path d="M20 78 80 24l60 54"/><path d="M34 70v66h92V70"/><circle cx="80" cy="104" r="12" fill="#FFFFFF" stroke="none"/><path d="M62 92a26 26 0 0 1 36 0" opacity="0.5"/>',
};

export const CATEGORY_HERO_FALLBACK_SVG: Record<FallbackKey, string> = {
  handyman: wrap(GLYPHS.handyman),
  'phone-repair': wrap(GLYPHS['phone-repair']),
  'tv-mounting': wrap(GLYPHS['tv-mounting']),
  'smart-home': wrap(GLYPHS['smart-home']),
};

export function getCategoryHeroFallback(slug: string): string | undefined {
  return CATEGORY_HERO_FALLBACK_SVG[slug as FallbackKey];
}
