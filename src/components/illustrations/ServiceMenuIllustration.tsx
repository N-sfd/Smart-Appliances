import React from 'react';

export type ServiceMenuIllustrationVariant =
  | 'appliance-care'
  | 'hvac-services'
  | 'plumbing-services'
  | 'electrical-services'
  | 'smart-home-setup'
  | 'garage-door-repair'
  | 'emergency-service';

interface ServiceMenuIllustrationProps {
  variant: ServiceMenuIllustrationVariant;
  title: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Compact rounded-square badge icons for the header Services menu and
 * service category cards. Deliberately a distinct composition style (small
 * flat badge, not a scene) from HeroIllustration (page heroes) and
 * TopicIllustration (Help Center) so no artwork is reused across sections —
 * see docs/image-assets-needed.md. Swap for real category photography by
 * pointing the menu at files under public/images/services/menu/ later.
 */
export default function ServiceMenuIllustration({ variant, title, className, style }: ServiceMenuIllustrationProps) {
  const palette = PALETTES[variant];
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      style={{ width: '100%', height: '100%', display: 'block', ...style }}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`menu-bg-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={palette.from} />
          <stop offset="100%" stopColor={palette.to} />
        </linearGradient>
      </defs>
      <rect width="96" height="96" rx="22" fill={`url(#menu-bg-${variant})`} />
      {GLYPHS[variant](palette)}
    </svg>
  );
}

interface Palette {
  from: string;
  to: string;
  accent: string;
}

const WHITE = '#FFFFFF';

const PALETTES: Record<ServiceMenuIllustrationVariant, Palette> = {
  'appliance-care': { from: '#E8F1FF', to: '#CBE0FF', accent: '#1A73E8' },
  'hvac-services': { from: '#E5FBFF', to: '#C9F1FF', accent: '#0891B2' },
  'plumbing-services': { from: '#EAF6FF', to: '#D3ECFF', accent: '#2563EB' },
  'electrical-services': { from: '#FFF7E0', to: '#FFECB3', accent: '#D97706' },
  'smart-home-setup': { from: '#EFEAFF', to: '#DCD1FF', accent: '#7C3AED' },
  'garage-door-repair': { from: '#EEF2F7', to: '#DCE4EF', accent: '#334155' },
  'emergency-service': { from: '#FFECEC', to: '#FFD6D6', accent: '#DC2626' },
};

const GLYPHS: Record<ServiceMenuIllustrationVariant, (p: Palette) => React.ReactNode> = {
  'appliance-care': (p) => (
    <g>
      <rect x="30" y="18" width="36" height="60" rx="7" fill={WHITE} stroke={p.accent} strokeWidth="3.5" />
      <line x1="30" y1="46" x2="66" y2="46" stroke={p.accent} strokeWidth="3" />
      <rect x="57" y="26" width="4" height="10" rx="2" fill={p.accent} />
      <rect x="57" y="54" width="4" height="10" rx="2" fill={p.accent} />
    </g>
  ),
  'hvac-services': (p) => (
    <g>
      <rect x="22" y="32" width="52" height="24" rx="6" fill={WHITE} stroke={p.accent} strokeWidth="3.5" />
      <line x1="32" y1="40" x2="32" y2="48" stroke={p.accent} strokeWidth="3" strokeLinecap="round" />
      <line x1="42" y1="40" x2="42" y2="48" stroke={p.accent} strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="40" x2="52" y2="48" stroke={p.accent} strokeWidth="3" strokeLinecap="round" />
      <line x1="62" y1="40" x2="62" y2="48" stroke={p.accent} strokeWidth="3" strokeLinecap="round" />
      <path d="M28 66 Q40 58 48 66 T68 66" fill="none" stroke={p.accent} strokeWidth="3" strokeLinecap="round" />
    </g>
  ),
  'plumbing-services': (p) => (
    <g>
      <path d="M28 58 h40 a8 8 0 0 1 8 8 v2 a14 14 0 0 1 -14 14 h-28 a14 14 0 0 1 -14 -14 v-2 a8 8 0 0 1 8 -8 Z" fill={WHITE} stroke={p.accent} strokeWidth="3.5" />
      <rect x="44" y="20" width="5" height="26" rx="2.5" fill={p.accent} />
      <path d="M46 20 q0 -10 18 -10 h6" fill="none" stroke={p.accent} strokeWidth="5" strokeLinecap="round" />
      <rect x="66" y="6" width="5" height="14" rx="2.5" fill={p.accent} />
      <circle cx="68" cy="34" r="2.5" fill={p.accent} />
    </g>
  ),
  'electrical-services': (p) => (
    <g>
      <rect x="26" y="18" width="24" height="40" rx="6" fill={WHITE} stroke={p.accent} strokeWidth="3.5" />
      <circle cx="38" cy="30" r="4" fill="none" stroke={p.accent} strokeWidth="2.75" />
      <circle cx="38" cy="46" r="4" fill="none" stroke={p.accent} strokeWidth="2.75" />
      <path d="M64 20 L48 48 L58 48 L44 76 L74 42 L62 42 Z" fill={p.accent} />
    </g>
  ),
  'smart-home-setup': (p) => (
    <g>
      <path d="M24 52 L48 30 L72 52 V74 H24 Z" fill={WHITE} stroke={p.accent} strokeWidth="3.5" strokeLinejoin="round" />
      <rect x="42" y="58" width="12" height="16" fill={p.accent} opacity="0.8" />
      <path d="M48 24 a20 20 0 0 1 20 20" fill="none" stroke={p.accent} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <circle cx="34" cy="62" r="3.5" fill={p.accent} />
    </g>
  ),
  'garage-door-repair': (p) => (
    <g>
      <rect x="22" y="24" width="52" height="44" rx="6" fill={WHITE} stroke={p.accent} strokeWidth="3.5" />
      <line x1="22" y1="35" x2="74" y2="35" stroke={p.accent} strokeWidth="2.5" />
      <line x1="22" y1="46" x2="74" y2="46" stroke={p.accent} strokeWidth="2.5" />
      <line x1="22" y1="57" x2="74" y2="57" stroke={p.accent} strokeWidth="2.5" />
      <circle cx="30" cy="46" r="3" fill={p.accent} />
      <circle cx="66" cy="46" r="3" fill={p.accent} />
    </g>
  ),
  'emergency-service': (p) => (
    <g>
      <path d="M48 18 L76 68 H20 Z" fill={WHITE} stroke={p.accent} strokeWidth="3.5" strokeLinejoin="round" />
      <rect x="45" y="36" width="6" height="18" rx="3" fill={p.accent} />
      <circle cx="48" cy="60" r="3.5" fill={p.accent} />
    </g>
  ),
};
