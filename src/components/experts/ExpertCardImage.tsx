import React from 'react';
import ExpertImage from './ExpertImage';

interface Props {
  name: string;
  avatarUrl?: string;
  height?: number;
}

/** @deprecated Use ExpertImage directly */
export default function ExpertCardImage({ name, avatarUrl, height = 160 }: Props) {
  return (
    <ExpertImage
      src={avatarUrl}
      alt={`${name} — Smart Appliances service expert`}
      fallbackInitials={name}
      variant="card"
      height={height}
    />
  );
}
