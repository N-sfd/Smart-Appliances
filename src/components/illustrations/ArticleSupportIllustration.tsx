import React from 'react';

export type ArticleSupportVariant = 'inspection' | 'decision';

interface ArticleSupportIllustrationProps {
  variant: ArticleSupportVariant;
  title: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Small in-context scenes used as inline supporting images inside Help Center articles. */
export default function ArticleSupportIllustration({ variant, title, className, style }: ArticleSupportIllustrationProps) {
  return (
    <svg
      viewBox="0 0 320 220"
      className={className}
      style={{ width: '100%', height: '100%', display: 'block', ...style }}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`asi-bg-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EAF3FF" />
          <stop offset="100%" stopColor="#DCEBFF" />
        </linearGradient>
      </defs>
      <rect width="320" height="220" fill={`url(#asi-bg-${variant})`} />
      {variant === 'inspection' ? <InspectionScene /> : <DecisionScene />}
    </svg>
  );
}

const NAVY = '#0B3D91';
const BLUE = '#1A73E8';
const SKY = '#4FC3F7';
const WHITE = '#FFFFFF';
const AMBER = '#F59E0B';
const SLATE = '#94A3B8';

function InspectionScene() {
  return (
    <g>
      {/* panel / fixture being inspected */}
      <rect x="150" y="50" width="90" height="120" rx="8" fill={WHITE} stroke={NAVY} strokeWidth="3" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x="168" y={68 + i * 32} width="54" height="20" rx="4" fill="#EAF3FF" stroke={BLUE} strokeWidth="2" />
      ))}
      {/* person silhouette leaning in */}
      <circle cx="90" cy="95" r="16" fill={NAVY} />
      <path d="M65 175 q25 -40 50 0 v30 h-50 Z" fill={NAVY} />
      {/* flashlight beam */}
      <path d="M108 100 L150 90 L150 110 Z" fill={AMBER} opacity="0.85" />
      {/* magnifier */}
      <circle cx="196" cy="100" r="20" fill="none" stroke={SKY} strokeWidth="6" />
      <line x1="211" y1="115" x2="224" y2="128" stroke={SKY} strokeWidth="7" strokeLinecap="round" />
    </g>
  );
}

function DecisionScene() {
  return (
    <g>
      {/* homeowner */}
      <circle cx="110" cy="90" r="18" fill={BLUE} />
      <path d="M82 180 q28 -44 56 0 v30 h-56 Z" fill={BLUE} />
      {/* thought bubble */}
      <circle cx="150" cy="55" r="6" fill={WHITE} opacity="0.9" />
      <circle cx="168" cy="42" r="9" fill={WHITE} opacity="0.9" />
      <ellipse cx="215" cy="55" rx="70" ry="46" fill={WHITE} opacity="0.95" />
      {/* wrench vs phone icons inside bubble */}
      <g transform="translate(190,50) rotate(20)">
        <rect x="-4" y="-18" width="8" height="30" rx="3" fill={SLATE} />
        <circle cx="0" cy="-18" r="8" fill="none" stroke={SLATE} strokeWidth="5" />
      </g>
      <g transform="translate(238,52)">
        <rect x="-9" y="-16" width="18" height="30" rx="4" fill={NAVY} />
        <circle cx="0" cy="9" r="2.5" fill={WHITE} />
      </g>
      {/* checkmark badge */}
      <circle cx="256" cy="150" r="22" fill="#22C55E" />
      <path d="M245 150 l8 8 l14 -16" fill="none" stroke={WHITE} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}
