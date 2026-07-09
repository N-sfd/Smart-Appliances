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
  'smart-thermostat-benefits': () => (
    <g>
      <rect x="0" y="205" width="400" height="45" fill="#D6E8FF" />
      {/* wall plate */}
      <rect x="140" y="55" width="120" height="150" rx="14" fill={WHITE} opacity="0.5" />
      {/* thermostat body */}
      <circle cx="200" cy="125" r="62" fill={WHITE} stroke={NAVY} strokeWidth="3" />
      <circle cx="200" cy="125" r="46" fill="#EAF3FF" stroke={BLUE} strokeWidth="3" />
      <text x="200" y="135" textAnchor="middle" fontSize="26" fontWeight="800" fill={NAVY} fontFamily="Arial, sans-serif">72°</text>
      <line x1="200" y1="79" x2="200" y2="67" stroke={BLUE} strokeWidth="4" strokeLinecap="round" />
      {/* wifi arcs */}
      <path d="M200 40 q30 -22 60 0" fill="none" stroke={SKY} strokeWidth="4" strokeLinecap="round" />
      <path d="M212 50 q14 -10 28 0" fill="none" stroke={SKY} strokeWidth="4" strokeLinecap="round" />
      <circle cx="200" cy="58" r="4" fill={SKY} />
      {/* phone / app accent */}
      <g transform="translate(310,150)">
        <rect x="-24" y="-45" width="48" height="90" rx="10" fill={WHITE} stroke={NAVY} strokeWidth="3" />
        <rect x="-16" y="-34" width="32" height="52" rx="4" fill="#EAF3FF" />
        <circle cx="0" cy="-34" r="8" fill={GREEN} />
        <path d="M-6 -34 l4 4 l8 -9" fill="none" stroke={WHITE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="-10" y1="-8" x2="10" y2="-8" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
        <line x1="-10" y1="4" x2="4" y2="4" stroke={BLUE} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      </g>
      {/* schedule accent */}
      <g transform="translate(90,150)">
        <circle cx="0" cy="0" r="24" fill={WHITE} stroke={AMBER} strokeWidth="3" />
        <line x1="0" y1="0" x2="0" y2="-13" stroke={AMBER} strokeWidth="3" strokeLinecap="round" />
        <line x1="0" y1="0" x2="9" y2="4" stroke={AMBER} strokeWidth="3" strokeLinecap="round" />
      </g>
    </g>
  ),
  'electrical-safety-diy-or-pro': () => (
    <g>
      <rect x="0" y="205" width="400" height="45" fill="#D6E8FF" />
      {/* outlet plate */}
      <rect x="70" y="60" width="140" height="150" rx="12" fill={WHITE} stroke={NAVY} strokeWidth="3" />
      <rect x="98" y="95" width="18" height="26" rx="4" fill="#EEF2F6" stroke={SLATE} strokeWidth="2.5" />
      <rect x="134" y="95" width="18" height="26" rx="4" fill="#EEF2F6" stroke={SLATE} strokeWidth="2.5" />
      <circle cx="140" cy="150" r="9" fill="none" stroke={SLATE} strokeWidth="2.5" />
      {/* spark burst at outlet */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i * Math.PI) / 2.6 - Math.PI / 5;
        const x1 = 210 + Math.cos(angle) * 10;
        const y1 = 95 + Math.sin(angle) * 10;
        const x2 = 210 + Math.cos(angle) * 26;
        const y2 = 95 + Math.sin(angle) * 26;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={AMBER} strokeWidth="3" strokeLinecap="round" />;
      })}
      <circle cx="210" cy="95" r="6" fill={AMBER} />
      {/* warning triangle */}
      <g transform="translate(305,150)">
        <path d="M0 -38 L34 30 H-34 Z" fill="#FEF2F2" stroke="#DC2626" strokeWidth="5" strokeLinejoin="round" />
        <rect x="-3.5" y="-16" width="7" height="24" rx="3.5" fill="#DC2626" />
        <circle cx="0" cy="16" r="4" fill="#DC2626" />
      </g>
      {/* breaker switches accent */}
      <g transform="translate(90,205)">
        {[0, 1, 2].map((i) => (
          <rect key={i} x={i * 24} y={-24} width="16" height="24" rx="3" fill={i === 1 ? '#DC2626' : '#EAF3FF'} stroke={NAVY} strokeWidth="2" />
        ))}
      </g>
    </g>
  ),
  // Handyman
  'handyman-small-home-projects': () => (
    <g>
      <rect x="0" y="205" width="400" height="45" fill="#D6E8FF" />
      {/* toolbox */}
      <rect x="35" y="150" width="120" height="66" rx="10" fill={WHITE} stroke={NAVY} strokeWidth="3" />
      <path d="M68 150 v-16 a10 10 0 0 1 10 -10 h24 a10 10 0 0 1 10 10 v16" fill="none" stroke={NAVY} strokeWidth="3" />
      <rect x="83" y="168" width="24" height="24" rx="4" fill={AMBER} />
      {/* shelf with frame */}
      <rect x="195" y="120" width="90" height="10" rx="4" fill={SLATE} />
      <rect x="215" y="70" width="50" height="40" rx="4" fill={WHITE} stroke={BLUE} strokeWidth="3" />
      <path d="M225 88 l8 10 l14 -18" fill="none" stroke={SKY} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* drywall patch */}
      <g transform="translate(330,165)">
        <rect x="-28" y="-28" width="56" height="56" rx="6" fill={WHITE} stroke={NAVY} strokeWidth="3" />
        <circle cx="0" cy="0" r="14" fill="#EEF2F6" stroke={SLATE} strokeWidth="2.5" />
      </g>
      {/* curtain rod accent */}
      <line x1="195" y1="50" x2="285" y2="50" stroke={SLATE} strokeWidth="5" strokeLinecap="round" />
      <circle cx="195" cy="50" r="6" fill={SLATE} />
      <circle cx="285" cy="50" r="6" fill={SLATE} />
    </g>
  ),
  'furniture-assembly-tips': () => (
    <g>
      <rect x="0" y="205" width="400" height="45" fill="#D6E8FF" />
      {/* flat-pack box */}
      <rect x="55" y="90" width="130" height="115" rx="8" fill={WHITE} stroke={NAVY} strokeWidth="3" />
      <path d="M55 118 h130 M120 90 v115" stroke={SLATE} strokeWidth="2" strokeDasharray="4 6" />
      {/* allen key */}
      <g transform="translate(250,150) rotate(-30)">
        <path d="M-40 0 h60 v14 h-14 v26 h-14 v-26 h-32 Z" fill={AMBER} />
      </g>
      {/* instruction sheet with checklist */}
      <g transform="translate(320,110)">
        <rect x="-28" y="-40" width="56" height="80" rx="6" fill={WHITE} stroke={BLUE} strokeWidth="3" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x="-18" y={-24 + i * 22} width="10" height="10" rx="2" fill={i < 2 ? GREEN : '#EAF3FF'} stroke={i < 2 ? GREEN : BLUE} strokeWidth="2" />
            <line x1="-2" y1={-19 + i * 22} x2="18" y2={-19 + i * 22} stroke={SLATE} strokeWidth="3" strokeLinecap="round" />
          </g>
        ))}
      </g>
    </g>
  ),
  'wall-hanging-guide': () => (
    <g>
      <rect x="0" y="205" width="400" height="45" fill="#D6E8FF" />
      {/* wall with stud lines */}
      <rect x="40" y="35" width="320" height="170" fill="#F5FBFF" />
      <line x1="120" y1="35" x2="120" y2="205" stroke={SKY} strokeWidth="1.5" strokeDasharray="3 6" opacity="0.6" />
      <line x1="280" y1="35" x2="280" y2="205" stroke={SKY} strokeWidth="1.5" strokeDasharray="3 6" opacity="0.6" />
      {/* framed art hung level */}
      <rect x="150" y="55" width="100" height="80" rx="4" fill={WHITE} stroke={NAVY} strokeWidth="3" />
      <circle cx="200" cy="95" r="22" fill="#EAF3FF" stroke={BLUE} strokeWidth="2.5" />
      {/* level tool */}
      <g transform="translate(280,150)">
        <rect x="-50" y="-10" width="100" height="20" rx="5" fill={WHITE} stroke={NAVY} strokeWidth="3" />
        <circle cx="0" cy="0" r="7" fill="none" stroke={GREEN} strokeWidth="3" />
        <circle cx="0" cy="0" r="2.5" fill={GREEN} />
      </g>
      {/* anchor + weight rating tag */}
      <g transform="translate(90,160)">
        <path d="M0 -18 v22 M-10 -10 a10 10 0 0 0 20 0" fill="none" stroke={AMBER} strokeWidth="4" strokeLinecap="round" />
      </g>
    </g>
  ),
  'drywall-repair-basics': () => (
    <g>
      <rect x="0" y="205" width="400" height="45" fill="#D6E8FF" />
      {/* wall section with hole/crack */}
      <rect x="70" y="45" width="260" height="160" rx="6" fill="#F5FBFF" stroke={NAVY} strokeWidth="3" />
      <circle cx="150" cy="110" r="18" fill="#EEF2F6" stroke={SLATE} strokeWidth="2.5" />
      <path d="M230 70 L255 110 L240 150" fill="none" stroke={SLATE} strokeWidth="2.5" strokeLinecap="round" />
      {/* putty knife applying patch */}
      <g transform="translate(240,150) rotate(-18)">
        <rect x="-42" y="-8" width="60" height="16" rx="4" fill={WHITE} stroke={NAVY} strokeWidth="2.5" />
        <rect x="16" y="-14" width="14" height="28" rx="4" fill={AMBER} />
      </g>
      {/* paint roller accent */}
      <g transform="translate(120,165)">
        <rect x="-8" y="-30" width="16" height="34" rx="6" fill={BLUE} />
        <rect x="-4" y="0" width="8" height="20" rx="2" fill={SLATE} />
      </g>
    </g>
  ),
  // TV Mounting
  'tv-mounting-cost-guide': () => (
    <g>
      <rect x="0" y="0" width="400" height="250" fill="#EAF6FF" />
      <rect x="80" y="40" width="180" height="108" rx="8" fill={WHITE} stroke={NAVY} strokeWidth="3" />
      <rect x="88" y="48" width="164" height="92" rx="4" fill="#0B3D91" opacity="0.08" />
      <rect x="172" y="148" width="8" height="24" fill={SLATE} />
      <path d="M150 172 h60" stroke={SLATE} strokeWidth="6" strokeLinecap="round" />
      {/* price tag */}
      <g transform="translate(320,110) rotate(18)">
        <path d="M0 -26 h34 l14 14 v34 a6 6 0 0 1 -6 6 h-42 a6 6 0 0 1 -6 -6 v-42 a6 6 0 0 1 6 -6 Z" fill={WHITE} stroke={AMBER} strokeWidth="3" />
        <circle cx="10" cy="-8" r="4" fill={AMBER} />
      </g>
      {/* checklist for complexity factors */}
      <g transform="translate(60,180)">
        <rect x="-8" y="-8" width="16" height="16" rx="3" fill={GREEN} />
        <path d="M-5 0 l4 4 l7 -8" fill="none" stroke={WHITE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  ),
  'tv-wall-mounting-checklist': () => (
    <g>
      <rect x="0" y="205" width="400" height="45" fill="#D6E8FF" />
      {/* clipboard checklist */}
      <rect x="60" y="45" width="140" height="175" rx="12" fill={WHITE} stroke={NAVY} strokeWidth="3" />
      <rect x="95" y="35" width="70" height="22" rx="8" fill={BLUE} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="80" y={90 + i * 32} width="18" height="18" rx="4" fill={i < 3 ? GREEN : '#EAF3FF'} stroke={i < 3 ? GREEN : BLUE} strokeWidth="2.5" />
          {i < 3 && <path d={`M84 ${99 + i * 32} l4 4 l8 -9`} fill="none" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
          <line x1="108" y1={99 + i * 32} x2="180" y2={99 + i * 32} stroke={SLATE} strokeWidth="4" strokeLinecap="round" />
        </g>
      ))}
      {/* small TV silhouette */}
      <g transform="translate(300,120)">
        <rect x="-50" y="-34" width="100" height="62" rx="6" fill={WHITE} stroke={NAVY} strokeWidth="3" />
        <line x1="0" y1="28" x2="0" y2="42" stroke={SLATE} strokeWidth="4" />
        <line x1="-20" y1="46" x2="20" y2="46" stroke={SLATE} strokeWidth="4" strokeLinecap="round" />
      </g>
    </g>
  ),
  'wire-concealment-guide': () => (
    <g>
      <rect x="0" y="0" width="400" height="250" fill="#EAF6FF" />
      <rect x="90" y="35" width="170" height="100" rx="8" fill={WHITE} stroke={NAVY} strokeWidth="3" />
      <rect x="98" y="43" width="154" height="84" rx="4" fill="#0B3D91" opacity="0.08" />
      {/* concealed cable channel down to outlet */}
      <rect x="168" y="135" width="14" height="80" rx="6" fill="#EAF3FF" stroke={BLUE} strokeWidth="2.5" />
      <path d="M175 140 v70" stroke={SLATE} strokeWidth="3" strokeDasharray="2 6" strokeLinecap="round" />
      {/* wall outlet */}
      <rect x="150" y="215" width="50" height="26" rx="4" fill={WHITE} stroke={NAVY} strokeWidth="2.5" />
      <circle cx="165" cy="228" r="4" fill={SLATE} />
      <circle cx="185" cy="228" r="4" fill={SLATE} />
      {/* soundbar */}
      <rect x="110" y="150" width="120" height="16" rx="8" fill={WHITE} stroke={BLUE} strokeWidth="2.5" />
      {/* safety shield accent */}
      <g transform="translate(320,90)">
        <path d="M0 -22 L20 -14 V6 Q20 22 0 30 Q-20 22 -20 6 V-14 Z" fill="#EAF3FF" stroke={GREEN} strokeWidth="3" />
        <path d="M-8 4 l6 6 l12 -14" fill="none" stroke={GREEN} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  ),
  // Phone Repair
  'phone-screen-repair-guide': () => (
    <g>
      <rect x="0" y="205" width="400" height="45" fill="#D6E8FF" />
      <rect x="160" y="30" width="105" height="185" rx="18" fill={WHITE} stroke={NAVY} strokeWidth="3.5" />
      <rect x="172" y="48" width="81" height="132" rx="4" fill="#EAF3FF" />
      {/* prominent crack */}
      <path d="M180 65 L215 100 L195 130 L230 160 L210 178" fill="none" stroke={SLATE} strokeWidth="3" strokeLinecap="round" />
      <path d="M198 90 L225 95" stroke={SLATE} strokeWidth="2" />
      {/* repair tool */}
      <g transform="translate(305,120) rotate(-15)">
        <rect x="-6" y="-40" width="12" height="52" rx="4" fill={AMBER} />
        <rect x="-10" y="-52" width="20" height="16" rx="4" fill={SLATE} />
      </g>
      {/* backup/cloud reminder accent */}
      <g transform="translate(80,110)">
        <path d="M-20 8 a14 14 0 0 1 0 -26 a18 18 0 0 1 34 4 a12 12 0 0 1 -4 22 Z" fill={WHITE} stroke={BLUE} strokeWidth="2.5" />
      </g>
    </g>
  ),
  'phone-battery-replacement-signs': () => (
    <g>
      <rect x="0" y="205" width="400" height="45" fill="#D6E8FF" />
      <rect x="165" y="30" width="105" height="185" rx="18" fill={WHITE} stroke={NAVY} strokeWidth="3.5" />
      <rect x="177" y="48" width="81" height="132" rx="4" fill="#EAF3FF" />
      {/* battery icon on screen */}
      <g transform="translate(217,110)">
        <rect x="-24" y="-14" width="48" height="28" rx="5" fill={WHITE} stroke="#DC2626" strokeWidth="3" />
        <rect x="24" y="-7" width="7" height="14" rx="2" fill="#DC2626" />
        <rect x="-19" y="-9" width="14" height="18" fill="#DC2626" />
      </g>
      {/* heat / warning accent */}
      <g transform="translate(305,90)">
        <path d="M0 -26 L20 24 H-20 Z" fill="#FEF2F2" stroke="#DC2626" strokeWidth="4" strokeLinejoin="round" />
        <rect x="-3" y="-12" width="6" height="18" rx="3" fill="#DC2626" />
        <circle cx="0" cy="12" r="3.5" fill="#DC2626" />
      </g>
      {/* charging cable accent */}
      <path d="M80 190 q20 -18 40 0" fill="none" stroke={SLATE} strokeWidth="4" strokeLinecap="round" />
    </g>
  ),
  'charging-port-repair-guide': () => (
    <g>
      <rect x="0" y="205" width="400" height="45" fill="#D6E8FF" />
      <rect x="150" y="30" width="105" height="185" rx="18" fill={WHITE} stroke={NAVY} strokeWidth="3.5" />
      <rect x="162" y="48" width="81" height="132" rx="4" fill="#EAF3FF" />
      {/* charging port close-up at bottom of phone */}
      <rect x="185" y="205" width="35" height="10" rx="3" fill={SLATE} />
      {/* cable plugging in */}
      <path d="M60 210 h110" stroke={SLATE} strokeWidth="6" strokeLinecap="round" />
      <rect x="55" y="200" width="18" height="20" rx="4" fill={AMBER} />
      {/* magnifying inspection accent */}
      <g transform="translate(310,130)">
        <circle cx="0" cy="0" r="26" fill="#EAF3FF" stroke={BLUE} strokeWidth="3.5" />
        <line x1="18" y1="18" x2="34" y2="34" stroke={BLUE} strokeWidth="5" strokeLinecap="round" />
        <circle cx="0" cy="0" r="8" fill="none" stroke={SLATE} strokeWidth="2" />
      </g>
      {/* moisture-warning drop */}
      <path d="M100 100 q10 16 0 26 q-10 -10 0 -26 Z" fill={SKY} opacity="0.7" />
    </g>
  ),
  'phone-repair-or-replace': () => (
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
      {/* older phone, left pan */}
      <rect x="105" y="60" width="30" height="55" rx="8" fill="#EEF2F6" stroke={SLATE} strokeWidth="2.5" />
      {/* newer phone, right pan */}
      <rect x="265" y="48" width="30" height="65" rx="8" fill={WHITE} stroke={BLUE} strokeWidth="2.5" />
      <circle cx="280" cy="98" r="3.5" fill={GREEN} />
    </g>
  ),
};
