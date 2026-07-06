import React from 'react';

export type HeroIllustrationVariant = 'resources' | 'membership' | 'pricing' | 'about' | 'contact' | 'electrical-detail';

interface HeroIllustrationProps {
  variant: HeroIllustrationVariant;
  title: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Larger editorial-style vector scenes used for page heroes that previously
 * had no image (Resources, Membership, Pricing, About, Contact). Distinct
 * per page and distinct from the technician/lifestyle photos already used on
 * Home, Our Services, and Experts — see docs/image-assets-needed.md.
 */
export default function HeroIllustration({ variant, title, className, style }: HeroIllustrationProps) {
  return (
    <svg
      viewBox="0 0 480 400"
      className={className}
      style={{ width: '100%', height: '100%', display: 'block', ...style }}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`hero-bg-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0F2E63" />
          <stop offset="100%" stopColor="#123A82" />
        </linearGradient>
        <linearGradient id={`hero-card-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#EAF3FF" />
        </linearGradient>
      </defs>
      <rect width="480" height="400" rx="28" fill={`url(#hero-bg-${variant})`} />
      {HERO_SCENES[variant]()}
    </svg>
  );
}

const WHITE = '#FFFFFF';
const SKY = '#4FC3F7';
const BLUE = '#1A73E8';
const AMBER = '#F59E0B';
const GREEN = '#22C55E';
const NAVY = '#0B3D91';

const HERO_SCENES: Record<HeroIllustrationVariant, () => React.ReactNode> = {
  resources: () => (
    <g>
      {/* open book / guide */}
      <path d="M100 260 V130 q70 -22 140 0 q70 -22 140 0 V260 q-70 -20 -140 0 q-70 -20 -140 0 Z" fill={`url(#hero-card-resources)`} stroke={WHITE} strokeWidth="2" opacity="0.97" />
      <line x1="240" y1="130" x2="240" y2="260" stroke="#D0E3FF" strokeWidth="2" />
      {[0, 1, 2].map((i) => (
        <line key={`l-${i}`} x1={120} y1={165 + i * 24} x2={222} y2={165 + i * 24} stroke="#B9D3FC" strokeWidth="5" strokeLinecap="round" />
      ))}
      {[0, 1, 2].map((i) => (
        <line key={`r-${i}`} x1={258} y1={165 + i * 24} x2={352} y2={165 + i * 24} stroke="#B9D3FC" strokeWidth="5" strokeLinecap="round" />
      ))}
      {/* magnifying glass */}
      <circle cx="330" cy="105" r="30" fill="none" stroke={SKY} strokeWidth="8" />
      <line x1="352" y1="127" x2="372" y2="147" stroke={SKY} strokeWidth="9" strokeLinecap="round" />
      {/* floating topic chips */}
      <circle cx="90" cy="90" r="22" fill={WHITE} opacity="0.15" />
      <circle cx="90" cy="90" r="10" fill={AMBER} />
      <circle cx="140" cy="60" r="16" fill={WHITE} opacity="0.15" />
      <circle cx="140" cy="60" r="7" fill={SKY} />
      <circle cx="400" cy="230" r="18" fill={WHITE} opacity="0.15" />
      <circle cx="400" cy="230" r="8" fill={GREEN} />
    </g>
  ),
  membership: () => (
    <g>
      {/* radiating rings */}
      <circle cx="240" cy="200" r="150" fill="none" stroke={WHITE} strokeOpacity="0.08" strokeWidth="18" />
      <circle cx="240" cy="200" r="112" fill="none" stroke={WHITE} strokeOpacity="0.12" strokeWidth="14" />
      {/* shield */}
      <path d="M240 90 L330 122 V205 Q330 275 240 310 Q150 275 150 205 V122 Z" fill={`url(#hero-card-membership)`} stroke={WHITE} strokeWidth="2" />
      {/* house inside shield */}
      <path d="M205 205 L240 175 L275 205 V250 H205 Z" fill="none" stroke={BLUE} strokeWidth="6" strokeLinejoin="round" />
      <rect x="228" y="222" width="24" height="28" fill={BLUE} opacity="0.85" />
      {/* checkmark badge */}
      <circle cx="300" cy="150" r="26" fill={GREEN} />
      <path d="M289 150 l8 8 l16 -18" fill="none" stroke={WHITE} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  pricing: () => (
    <g>
      {/* price tag */}
      <path d="M150 120 H280 L340 200 L260 280 H150 Z" fill={`url(#hero-card-pricing)`} stroke={WHITE} strokeWidth="2" />
      <circle cx="185" cy="155" r="14" fill="none" stroke={BLUE} strokeWidth="6" />
      <text x="185" y="162" textAnchor="middle" fontSize="18" fontWeight="800" fill={NAVY} fontFamily="Arial, sans-serif">$</text>
      <line x1="170" y1="210" x2="310" y2="210" stroke="#D0E3FF" strokeWidth="6" strokeLinecap="round" />
      <line x1="170" y1="234" x2="280" y2="234" stroke="#D0E3FF" strokeWidth="6" strokeLinecap="round" />
      {/* calculator accent */}
      <rect x="310" y="90" width="90" height="110" rx="12" fill={WHITE} opacity="0.94" />
      <rect x="322" y="102" width="66" height="22" rx="4" fill="#0F2E63" />
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={322 + col * 24}
            y={134 + row * 24}
            width="16"
            height="16"
            rx="4"
            fill={row === 2 && col === 2 ? AMBER : '#DCEBFF'}
          />
        )),
      )}
    </g>
  ),
  about: () => (
    <g>
      {/* house */}
      <path d="M150 260 V160 L240 100 L330 160 V260 Z" fill={`url(#hero-card-about)`} stroke={WHITE} strokeWidth="2" />
      <rect x="215" y="200" width="50" height="60" fill={BLUE} opacity="0.85" />
      <rect x="170" y="180" width="26" height="26" fill="#DCEBFF" />
      <rect x="285" y="180" width="26" height="26" fill="#DCEBFF" />
      {/* team silhouettes */}
      {[
        { x: 110, c: SKY },
        { x: 240, c: BLUE },
        { x: 370, c: GREEN },
      ].map((p) => (
        <g key={p.x} transform={`translate(${p.x},290)`}>
          <circle cx="0" cy="-38" r="16" fill={p.c} />
          <path d="M-22 10 q22 -26 44 0 v26 h-44 Z" fill={p.c} />
        </g>
      ))}
      {/* trust badge ribbon */}
      <circle cx="360" cy="120" r="26" fill={AMBER} />
      <path d="M349 120 l7 8 l14 -16" fill="none" stroke={WHITE} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  contact: () => (
    <g>
      {/* chat bubble */}
      <path d="M110 110 h260 a20 20 0 0 1 20 20 v110 a20 20 0 0 1 -20 20 H210 l-45 40 v-40 h-55 a20 20 0 0 1 -20 -20 V130 a20 20 0 0 1 20 -20 Z" fill={`url(#hero-card-contact)`} stroke={WHITE} strokeWidth="2" />
      {/* house icon inside bubble */}
      <path d="M195 195 L240 160 L285 195 V225 H195 Z" fill="none" stroke={BLUE} strokeWidth="6" strokeLinejoin="round" />
      <rect x="228" y="200" width="24" height="25" fill={BLUE} opacity="0.85" />
      {/* headset accent */}
      <g transform="translate(365,110)">
        <path d="M-30 10 a30 30 0 0 1 60 0" fill="none" stroke={WHITE} strokeWidth="7" strokeLinecap="round" />
        <rect x="-34" y="6" width="14" height="22" rx="6" fill={SKY} />
        <rect x="20" y="6" width="14" height="22" rx="6" fill={SKY} />
      </g>
      {/* online dot */}
      <circle cx="330" cy="270" r="10" fill={GREEN} />
    </g>
  ),
  'electrical-detail': () => (
    <g>
      {/* large breaker panel */}
      <rect x="140" y="90" width="200" height="220" rx="14" fill={`url(#hero-card-electrical-detail)`} stroke={WHITE} strokeWidth="2" />
      {[0, 1, 2, 3].map((row) => (
        <g key={row}>
          {[0, 1].map((col) => (
            <rect
              key={col}
              x={170 + col * 78}
              y={120 + row * 44}
              width="56"
              height="32"
              rx="6"
              fill={row === 2 && col === 1 ? AMBER : '#EAF3FF'}
              stroke={BLUE}
              strokeWidth="3"
            />
          ))}
        </g>
      ))}
      {/* warning triangle accent */}
      <g transform="translate(370,240)">
        <path d="M0 -34 L30 26 H-30 Z" fill="#FEF2F2" stroke="#DC2626" strokeWidth="5" strokeLinejoin="round" />
        <rect x="-3" y="-14" width="6" height="20" rx="3" fill="#DC2626" />
        <circle cx="0" cy="14" r="3.5" fill="#DC2626" />
      </g>
    </g>
  ),
};
