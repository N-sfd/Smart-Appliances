import React from 'react';

interface ArticleTopicIllustrationProps {
  /** Article slug — must exist in ARTICLE_SCENES, check with hasArticleIllustration() first. */
  slug: string;
  title: string;
  className?: string;
  style?: React.CSSProperties;
}

/** True when a dedicated (non-category) scene exists for this article slug. */
export function hasArticleIllustration(slug: string): boolean {
  return slug in ARTICLE_SCENES;
}

/**
 * Article-specific vector scenes for guides whose shared category art would
 * otherwise repeat across multiple articles (five appliance-care guides plus
 * two HVAC guides previously all rendered the same category illustration).
 * Falls back to TopicIllustration (via ResourceImage) for any slug not listed here.
 */
export default function ArticleTopicIllustration({ slug, title, className, style }: ArticleTopicIllustrationProps) {
  const Scene = ARTICLE_SCENES[slug];
  if (!Scene) return null;

  return (
    <svg
      viewBox="0 0 400 250"
      className={className}
      style={{ width: '100%', height: '100%', display: 'block', ...style }}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`ati-bg-${slug}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EAF3FF" />
          <stop offset="100%" stopColor="#DCEBFF" />
        </linearGradient>
      </defs>
      <rect width="400" height="250" fill={`url(#ati-bg-${slug})`} />
      {Scene()}
    </svg>
  );
}

const NAVY = '#0B3D91';
const BLUE = '#1A73E8';
const SKY = '#4FC3F7';
const WHITE = '#FFFFFF';
const AMBER = '#F59E0B';
const GREEN = '#22C55E';
const SLATE = '#94A3B8';
const RED = '#F87171';

const ARTICLE_SCENES: Record<string, () => React.ReactNode> = {
  'refrigerator-not-cooling': () => (
    <g>
      <rect x="0" y="205" width="400" height="45" fill="#D6E8FF" />
      {/* fridge interior cross-section */}
      <rect x="90" y="35" width="220" height="185" rx="10" fill={WHITE} stroke={NAVY} strokeWidth="3" />
      <line x1="90" y1="105" x2="310" y2="105" stroke={SLATE} strokeWidth="4" />
      <line x1="90" y1="165" x2="310" y2="165" stroke={SLATE} strokeWidth="4" />
      {/* food items */}
      <circle cx="130" cy="90" r="12" fill={AMBER} />
      <rect x="160" y="80" width="26" height="22" rx="4" fill={GREEN} />
      <circle cx="225" cy="145" r="11" fill={RED} />
      <rect x="255" y="135" width="30" height="24" rx="4" fill={SKY} opacity="0.6" />
      <rect x="105" y="180" width="34" height="20" rx="4" fill="#EAF3FF" stroke={BLUE} strokeWidth="2" />
      {/* thermometer */}
      <rect x="330" y="25" width="10" height="95" rx="5" fill={WHITE} stroke={NAVY} strokeWidth="2.5" />
      <circle cx="335" cy="128" r="13" fill={WHITE} stroke={NAVY} strokeWidth="2.5" />
      <rect x="332" y="55" width="6" height="55" rx="3" fill={BLUE} />
      <circle cx="335" cy="128" r="6" fill={BLUE} />
      {/* cold accent */}
      <path d="M100 55 q10 -8 20 0 t20 0" fill="none" stroke={SKY} strokeWidth="3" strokeLinecap="round" />
    </g>
  ),
  'washer-making-noise': () => (
    <g>
      <rect x="0" y="205" width="400" height="45" fill="#D6E8FF" />
      <rect x="60" y="45" width="180" height="175" rx="12" fill={WHITE} stroke={NAVY} strokeWidth="3" />
      <circle cx="150" cy="140" r="55" fill="#EAF3FF" stroke={BLUE} strokeWidth="4" />
      <circle cx="150" cy="140" r="55" fill="none" stroke={NAVY} strokeWidth="2" strokeDasharray="2 6" />
      <circle cx="85" cy="65" r="7" fill={SKY} />
      <circle cx="105" cy="65" r="7" fill={SLATE} />
      {/* drum door swung open */}
      <ellipse cx="255" cy="140" rx="16" ry="52" fill={WHITE} stroke={NAVY} strokeWidth="3" />
      {/* sound waves */}
      <path d="M290 108 q22 32 0 64" fill="none" stroke={AMBER} strokeWidth="4" strokeLinecap="round" />
      <path d="M312 92 q36 48 0 96" fill="none" stroke={AMBER} strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <path d="M334 76 q50 64 0 128" fill="none" stroke={AMBER} strokeWidth="4" strokeLinecap="round" opacity="0.45" />
    </g>
  ),
  'dryer-taking-too-long': () => (
    <g>
      <rect x="0" y="205" width="400" height="45" fill="#D6E8FF" />
      <rect x="40" y="70" width="130" height="135" rx="10" fill={WHITE} stroke={NAVY} strokeWidth="3" />
      <circle cx="105" cy="140" r="42" fill="#EAF3FF" stroke={BLUE} strokeWidth="3" />
      {/* flexible vent hose */}
      <path d="M175 128 q35 -12 55 8 t55 8 t50 -6" fill="none" stroke={SLATE} strokeWidth="16" strokeLinecap="round" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={i} x1={185 + i * 30} y1={110 + (i % 2 === 0 ? -6 : 12)} x2={185 + i * 30} y2={150 + (i % 2 === 0 ? -6 : 12)} stroke={WHITE} strokeWidth="2" opacity="0.6" />
      ))}
      {/* lint clump */}
      <ellipse cx="275" cy="128" rx="20" ry="12" fill="#E9E3D5" stroke={AMBER} strokeWidth="2" />
      <ellipse cx="292" cy="140" rx="14" ry="9" fill="#E9E3D5" stroke={AMBER} strokeWidth="2" />
      {/* heat waves */}
      <path d="M345 85 q6 -14 0 -28" stroke={RED} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M361 90 q6 -14 0 -28" stroke={RED} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
    </g>
  ),
  'dishwasher-not-draining': () => (
    <g>
      <rect x="0" y="205" width="400" height="45" fill="#D6E8FF" />
      <rect x="60" y="55" width="210" height="150" rx="10" fill={WHITE} stroke={NAVY} strokeWidth="3" />
      {/* standing water at bottom of tub */}
      <path d="M78 175 q96 22 174 0 v18 h-174 Z" fill={SKY} opacity="0.55" />
      <line x1="78" y1="100" x2="252" y2="100" stroke={SLATE} strokeWidth="3" />
      <line x1="78" y1="135" x2="252" y2="135" stroke={SLATE} strokeWidth="3" />
      {/* filter basket lifted out */}
      <g transform="translate(310,95)">
        <ellipse cx="0" cy="0" rx="34" ry="20" fill="none" stroke={BLUE} strokeWidth="4" />
        <path d="M-30 0 q30 20 60 0" stroke={BLUE} strokeWidth="3" fill="none" />
        <path d="M-20 -6 l40 0 M-24 4 l48 0" stroke={SKY} strokeWidth="2.5" />
        <circle cx="-4" cy="34" r="4" fill={SKY} />
        <circle cx="8" cy="46" r="3" fill={SKY} />
      </g>
    </g>
  ),
  'freezer-frost-buildup': () => (
    <g>
      <rect x="0" y="0" width="400" height="250" fill="#EAF6FF" />
      <rect x="40" y="30" width="320" height="190" rx="8" fill="#F5FBFF" stroke={NAVY} strokeWidth="3" />
      {/* thick ice mound in corner */}
      <path d="M40 220 L40 140 Q80 150 95 185 Q120 165 130 200 Q150 190 150 220 Z" fill={WHITE} stroke={SKY} strokeWidth="3" />
      {/* frost crystals */}
      {[
        [220, 70], [270, 110], [310, 60], [180, 100],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <line x1="-12" y1="0" x2="12" y2="0" stroke={SKY} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="0" y1="-12" x2="0" y2="12" stroke={SKY} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="-8" y1="-8" x2="8" y2="8" stroke={SKY} strokeWidth="2" strokeLinecap="round" />
          <line x1="-8" y1="8" x2="8" y2="-8" stroke={SKY} strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
      <line x1="200" y1="60" x2="200" y2="205" stroke={SLATE} strokeWidth="2" strokeDasharray="3 5" opacity="0.5" />
    </g>
  ),
  'appliance-repair-or-replace': () => (
    <g>
      <rect x="0" y="205" width="400" height="45" fill="#D6E8FF" />
      {/* balance scale */}
      <rect x="160" y="185" width="80" height="14" rx="4" fill={NAVY} />
      <rect x="196" y="95" width="8" height="90" fill={NAVY} />
      <line x1="120" y1="115" x2="280" y2="115" stroke={NAVY} strokeWidth="5" strokeLinecap="round" />
      <rect x="188" y="100" width="24" height="10" rx="3" fill={NAVY} />
      <line x1="120" y1="115" x2="120" y2="150" stroke={SLATE} strokeWidth="3" />
      <line x1="280" y1="115" x2="280" y2="150" stroke={SLATE} strokeWidth="3" />
      <path d="M95 150 a25 20 0 0 0 50 0 Z" fill="#EEF2F6" stroke={SLATE} strokeWidth="2.5" />
      <path d="M255 150 a25 20 0 0 0 50 0 Z" fill={WHITE} stroke={BLUE} strokeWidth="2.5" />
      {/* old appliance, left pan */}
      <rect x="98" y="55" width="44" height="60" rx="6" fill="#EEF2F6" stroke={SLATE} strokeWidth="2.5" />
      <line x1="98" y1="85" x2="142" y2="85" stroke={SLATE} strokeWidth="2" />
      {/* new appliance, right pan */}
      <rect x="258" y="45" width="44" height="70" rx="6" fill={WHITE} stroke={BLUE} strokeWidth="2.5" />
      <line x1="258" y1="80" x2="302" y2="80" stroke={NAVY} strokeWidth="2" />
      <circle cx="292" cy="98" r="4" fill={GREEN} />
    </g>
  ),
  'lower-heating-bill': () => (
    <g>
      <rect x="0" y="205" width="400" height="45" fill="#D6E8FF" />
      {/* window with sun */}
      <rect x="55" y="45" width="160" height="150" rx="6" fill="#EAF6FF" stroke={NAVY} strokeWidth="3" />
      <line x1="135" y1="45" x2="135" y2="195" stroke={NAVY} strokeWidth="2.5" />
      <line x1="55" y1="120" x2="215" y2="120" stroke={NAVY} strokeWidth="2.5" />
      <circle cx="105" cy="85" r="20" fill={AMBER} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * Math.PI) / 3;
        const x1 = 105 + Math.cos(angle) * 26;
        const y1 = 85 + Math.sin(angle) * 26;
        const x2 = 105 + Math.cos(angle) * 34;
        const y2 = 85 + Math.sin(angle) * 34;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={AMBER} strokeWidth="3" strokeLinecap="round" />;
      })}
      {/* thermostat on the wall */}
      <circle cx="300" cy="120" r="34" fill={WHITE} stroke={BLUE} strokeWidth="4" />
      <circle cx="300" cy="120" r="9" fill={BLUE} />
      <line x1="300" y1="120" x2="300" y2="98" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
      <path d="M270 175 q30 -14 60 0" fill="none" stroke={GREEN} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    </g>
  ),
  'hvac-filter-guide': () => (
    <g>
      <rect x="0" y="205" width="400" height="45" fill="#D6E8FF" />
      <circle cx="200" cy="120" r="90" fill={AMBER} opacity="0.12" />
      {/* filter frame */}
      <rect x="130" y="40" width="140" height="170" rx="8" fill={WHITE} stroke={NAVY} strokeWidth="3" />
      {/* dirty half tint */}
      <rect x="133" y="43" width="67" height="164" fill="#D8C9A3" opacity="0.35" />
      {/* pleats */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <line key={i} x1={140 + i * 18} y1="46" x2={140 + i * 18} y2="204" stroke={SKY} strokeWidth="2.5" />
      ))}
      {/* dust specks on dirty half */}
      {[[145, 70], [160, 110], [150, 150], [175, 90]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill={SLATE} opacity="0.7" />
      ))}
    </g>
  ),
};
