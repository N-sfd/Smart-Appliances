import React from 'react';
import type { ResourceCategoryId } from '../../data/resourceCategories';

interface TopicIllustrationProps {
  /** Resource category this scene should represent. */
  variant: ResourceCategoryId;
  /** Accessible label — pass the real image alt text so screen readers get the same context a photo would provide. */
  title: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Hand-drawn flat-vector scenes used as topic art across the Help Center until
 * licensed photography replaces them (see docs/image-assets-needed.md). Each
 * variant is a distinct composition so no two categories look alike.
 */
export default function TopicIllustration({ variant, title, className, style }: TopicIllustrationProps) {
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
        <linearGradient id={`bg-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EAF3FF" />
          <stop offset="100%" stopColor="#DCEBFF" />
        </linearGradient>
      </defs>
      <rect width="400" height="250" fill={`url(#bg-${variant})`} />
      {SCENES[variant]()}
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

const SCENES: Record<ResourceCategoryId, () => React.ReactNode> = {
  'appliance-care': () => (
    <g>
      <rect x="0" y="205" width="400" height="45" fill="#D6E8FF" />
      {/* Refrigerator */}
      <rect x="60" y="55" width="110" height="150" rx="10" fill={WHITE} stroke={NAVY} strokeWidth="3" />
      <line x1="60" y1="115" x2="170" y2="115" stroke={NAVY} strokeWidth="3" />
      <rect x="140" y="75" width="6" height="24" rx="3" fill={BLUE} />
      <rect x="140" y="130" width="6" height="24" rx="3" fill={BLUE} />
      {/* Washer */}
      <rect x="220" y="95" width="110" height="110" rx="10" fill={WHITE} stroke={NAVY} strokeWidth="3" />
      <circle cx="275" cy="152" r="34" fill="#EAF3FF" stroke={BLUE} strokeWidth="3" />
      <circle cx="275" cy="152" r="19" fill="none" stroke={SKY} strokeWidth="3" />
      <rect x="236" y="106" width="14" height="8" rx="2" fill={SKY} />
      {/* sparkle accents */}
      <circle cx="200" cy="60" r="4" fill={SKY} />
      <circle cx="345" cy="70" r="3" fill={AMBER} />
    </g>
  ),
  'hvac-energy': () => (
    <g>
      <path d="M0 190 L120 100 L240 190 Z" fill="#D6E8FF" />
      <rect x="60" y="188" width="120" height="62" fill={WHITE} stroke={NAVY} strokeWidth="3" />
      {/* wall AC unit */}
      <rect x="230" y="70" width="130" height="46" rx="8" fill={WHITE} stroke={NAVY} strokeWidth="3" />
      <line x1="248" y1="82" x2="248" y2="104" stroke={SKY} strokeWidth="3" />
      <line x1="266" y1="82" x2="266" y2="104" stroke={SKY} strokeWidth="3" />
      <line x1="284" y1="82" x2="284" y2="104" stroke={SKY} strokeWidth="3" />
      <line x1="302" y1="82" x2="302" y2="104" stroke={SKY} strokeWidth="3" />
      <line x1="320" y1="82" x2="320" y2="104" stroke={SKY} strokeWidth="3" />
      {/* airflow waves */}
      <path d="M245 130 Q265 120 285 130 T325 130" fill="none" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
      <path d="M240 150 Q262 138 284 150 T328 150" fill="none" stroke={SKY} strokeWidth="3" strokeLinecap="round" />
      {/* thermostat dial */}
      <circle cx="120" cy="150" r="26" fill={WHITE} stroke={BLUE} strokeWidth="3" />
      <circle cx="120" cy="150" r="7" fill={BLUE} />
      <line x1="120" y1="150" x2="120" y2="130" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
    </g>
  ),
  plumbing: () => (
    <g>
      <rect x="0" y="205" width="400" height="45" fill="#D6E8FF" />
      {/* sink basin */}
      <path d="M90 165 h180 a10 10 0 0 1 10 10 v10 a30 30 0 0 1 -30 30 h-140 a30 30 0 0 1 -30 -30 v-10 a10 10 0 0 1 10 -10 Z" fill={WHITE} stroke={NAVY} strokeWidth="3" />
      <line x1="70" y1="165" x2="330" y2="165" stroke={NAVY} strokeWidth="3" />
      {/* faucet */}
      <rect x="180" y="90" width="10" height="55" rx="4" fill={BLUE} />
      <path d="M185 90 q0 -22 40 -22 h20" fill="none" stroke={BLUE} strokeWidth="10" strokeLinecap="round" />
      <rect x="238" y="68" width="10" height="30" rx="4" fill={BLUE} />
      {/* water drips */}
      <path d="M243 100 q6 12 0 20 q-6 -8 0 -20 Z" fill={SKY} />
      <circle cx="243" cy="132" r="4" fill={SKY} />
      {/* wrench accent */}
      <g transform="translate(300,150) rotate(25)">
        <rect x="-6" y="-30" width="12" height="46" rx="4" fill={AMBER} />
        <circle cx="0" cy="-30" r="12" fill="none" stroke={AMBER} strokeWidth="7" />
      </g>
    </g>
  ),
  'electrical-safety': () => (
    <g>
      {/* breaker panel */}
      <rect x="120" y="55" width="160" height="150" rx="10" fill={WHITE} stroke={NAVY} strokeWidth="3" />
      <rect x="140" y="75" width="120" height="1" fill="none" />
      {[0, 1, 2].map((row) => (
        <g key={row}>
          {[0, 1, 2].map((col) => (
            <rect
              key={col}
              x={140 + col * 34}
              y={80 + row * 38}
              width="22"
              height="28"
              rx="4"
              fill={col === 1 && row === 1 ? AMBER : '#EAF3FF'}
              stroke={BLUE}
              strokeWidth="2.5"
            />
          ))}
        </g>
      ))}
      {/* warning triangle */}
      <g transform="translate(60,150)">
        <path d="M0 -38 L34 30 H-34 Z" fill="#FEF2F2" stroke="#DC2626" strokeWidth="4" strokeLinejoin="round" />
        <rect x="-3.5" y="-16" width="7" height="24" rx="3" fill="#DC2626" />
        <circle cx="0" cy="16" r="4" fill="#DC2626" />
      </g>
      {/* lightning accent */}
      <path d="M330 140 L312 175 L326 175 L308 210 L340 168 L324 168 Z" fill={AMBER} />
    </g>
  ),
  'smart-home': () => (
    <g>
      {/* house outline */}
      <path d="M120 130 L200 70 L280 130 V205 H120 Z" fill={WHITE} stroke={NAVY} strokeWidth="3" strokeLinejoin="round" />
      <rect x="185" y="160" width="30" height="45" fill="#EAF3FF" stroke={NAVY} strokeWidth="2.5" />
      {/* wifi arcs */}
      <path d="M200 60 a55 55 0 0 1 55 55" fill="none" stroke={SKY} strokeWidth="4" strokeLinecap="round" />
      <path d="M200 60 a80 80 0 0 1 80 80" fill="none" stroke={BLUE} strokeWidth="4" strokeLinecap="round" opacity="0.55" />
      {/* smart thermostat dot */}
      <circle cx="150" cy="150" r="14" fill={WHITE} stroke={BLUE} strokeWidth="3" />
      <circle cx="150" cy="150" r="4" fill={BLUE} />
      {/* camera */}
      <g transform="translate(300,110)">
        <rect x="-16" y="-10" width="32" height="20" rx="6" fill={NAVY} />
        <circle cx="4" cy="0" r="7" fill={SKY} />
      </g>
      <path d="M284 110 L268 110" stroke={SLATE} strokeWidth="2" strokeDasharray="3 4" />
    </g>
  ),
  'garage-door': () => (
    <g>
      <rect x="0" y="205" width="400" height="45" fill="#D6E8FF" />
      <rect x="90" y="60" width="220" height="145" rx="8" fill={WHITE} stroke={NAVY} strokeWidth="3" />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="90" y1={60 + (i + 1) * 29} x2="310" y2={60 + (i + 1) * 29} stroke={NAVY} strokeWidth="2.5" />
      ))}
      {/* track rails */}
      <line x1="90" y1="60" x2="60" y2="90" stroke={SLATE} strokeWidth="4" strokeLinecap="round" />
      <line x1="310" y1="60" x2="340" y2="90" stroke={SLATE} strokeWidth="4" strokeLinecap="round" />
      <circle cx="105" cy="90" r="6" fill={BLUE} />
      <circle cx="105" cy="148" r="6" fill={BLUE} />
      <circle cx="295" cy="90" r="6" fill={BLUE} />
      <circle cx="295" cy="148" r="6" fill={BLUE} />
      {/* driveway sun accent */}
      <circle cx="345" cy="55" r="16" fill="#FFE7A3" />
    </g>
  ),
  maintenance: () => (
    <g>
      {/* clipboard */}
      <rect x="130" y="55" width="140" height="165" rx="12" fill={WHITE} stroke={NAVY} strokeWidth="3" />
      <rect x="165" y="45" width="70" height="22" rx="8" fill={BLUE} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="150" y={95 + i * 32} width="18" height="18" rx="4" fill={i < 2 ? GREEN : '#EAF3FF'} stroke={i < 2 ? GREEN : BLUE} strokeWidth="2.5" />
          {i < 2 && <path d={`M154 ${104 + i * 32} l4 4 l8 -9`} fill="none" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
          <line x1="178" y1={104 + i * 32} x2="252" y2={104 + i * 32} stroke={SLATE} strokeWidth="4" strokeLinecap="round" />
        </g>
      ))}
      {/* gear accent */}
      <circle cx="315" cy="180" r="20" fill="none" stroke={AMBER} strokeWidth="6" />
      <circle cx="315" cy="180" r="6" fill={AMBER} />
    </g>
  ),
  'repair-or-replace': () => (
    <g>
      <rect x="0" y="205" width="400" height="45" fill="#D6E8FF" />
      {/* old appliance (left, muted) */}
      <rect x="55" y="90" width="95" height="115" rx="8" fill="#EEF2F6" stroke={SLATE} strokeWidth="3" />
      <line x1="55" y1="145" x2="150" y2="145" stroke={SLATE} strokeWidth="2.5" />
      <circle cx="103" cy="175" r="3.5" fill={SLATE} />
      {/* new appliance (right, bright) */}
      <rect x="250" y="75" width="100" height="130" rx="8" fill={WHITE} stroke={NAVY} strokeWidth="3" />
      <line x1="250" y1="135" x2="350" y2="135" stroke={NAVY} strokeWidth="2.5" />
      <rect x="328" y="90" width="6" height="24" rx="3" fill={BLUE} />
      <circle cx="335" cy="185" r="4" fill={GREEN} />
      {/* arrow between */}
      <path d="M165 150 H228" stroke={BLUE} strokeWidth="5" strokeLinecap="round" />
      <path d="M215 138 L232 150 L215 162" fill="none" stroke={BLUE} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  handyman: () => (
    <g>
      <rect x="0" y="205" width="400" height="45" fill="#D6E8FF" />
      {/* toolbox */}
      <rect x="55" y="140" width="150" height="80" rx="10" fill={WHITE} stroke={NAVY} strokeWidth="3" />
      <path d="M95 140 v-20 a12 12 0 0 1 12 -12 h36 a12 12 0 0 1 12 12 v20" fill="none" stroke={NAVY} strokeWidth="3.5" />
      <line x1="55" y1="172" x2="205" y2="172" stroke={NAVY} strokeWidth="2.5" />
      <rect x="112" y="158" width="26" height="26" rx="4" fill={AMBER} />
      {/* hammer */}
      <g transform="translate(260,110) rotate(28)">
        <rect x="-7" y="-14" width="14" height="90" rx="5" fill="#C08A4E" />
        <rect x="-28" y="-38" width="56" height="30" rx="8" fill={SLATE} />
      </g>
      {/* framed picture being hung */}
      <g transform="translate(330,150)">
        <rect x="-22" y="-28" width="44" height="56" rx="4" fill={WHITE} stroke={BLUE} strokeWidth="3" />
        <path d="M-14 -20 l10 12 l8 -18" fill="none" stroke={SKY} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M0 -28 q0 -18 0 -18" stroke={SLATE} strokeWidth="2" strokeDasharray="3 4" />
      </g>
    </g>
  ),
  'tv-mounting': () => (
    <g>
      <rect x="0" y="0" width="400" height="250" fill="#EAF6FF" />
      {/* wall-mounted TV */}
      <rect x="110" y="45" width="200" height="120" rx="8" fill={WHITE} stroke={NAVY} strokeWidth="3" />
      <rect x="118" y="53" width="184" height="104" rx="4" fill="#0B3D91" opacity="0.08" />
      {/* wall bracket arm */}
      <rect x="196" y="165" width="8" height="26" fill={SLATE} />
      <path d="M170 191 h60" stroke={SLATE} strokeWidth="6" strokeLinecap="round" />
      {/* soundbar below */}
      <rect x="140" y="205" width="120" height="18" rx="9" fill={WHITE} stroke={BLUE} strokeWidth="3" />
      <circle cx="160" cy="214" r="3" fill={BLUE} />
      <circle cx="180" cy="214" r="3" fill={SKY} />
      {/* concealed cable path */}
      <path d="M300 100 q30 20 0 91" fill="none" stroke={SLATE} strokeWidth="4" strokeDasharray="2 7" strokeLinecap="round" />
    </g>
  ),
  'phone-repair': () => (
    <g>
      <rect x="0" y="205" width="400" height="45" fill="#D6E8FF" />
      {/* phone body */}
      <rect x="165" y="35" width="105" height="180" rx="18" fill={WHITE} stroke={NAVY} strokeWidth="3.5" />
      <rect x="177" y="52" width="81" height="128" rx="4" fill="#EAF3FF" />
      {/* crack lines across screen */}
      <path d="M185 70 L220 110 L205 150 L235 175" fill="none" stroke={SLATE} strokeWidth="2.5" strokeLinecap="round" />
      {/* screwdriver tool */}
      <g transform="translate(80,120) rotate(-20)">
        <rect x="-5" y="-46" width="10" height="60" rx="4" fill={AMBER} />
        <rect x="-9" y="-58" width="18" height="16" rx="4" fill={SLATE} />
      </g>
      {/* battery accent */}
      <g transform="translate(320,150)">
        <rect x="-20" y="-14" width="40" height="28" rx="5" fill={WHITE} stroke={GREEN} strokeWidth="3" />
        <rect x="20" y="-6" width="6" height="12" rx="2" fill={GREEN} />
        <rect x="-14" y="-8" width="18" height="16" fill={GREEN} />
      </g>
    </g>
  ),
};
