import React from 'react';
import ExpertImage from './ExpertImage';

interface Props {
  name: string;
  avatarUrl?: string;
  size: number;
  fontSize: number;
}

/** @deprecated Use ExpertImage directly */
export default function ExpertAvatar({ name, avatarUrl, size }: Props) {
  return (
    <ExpertImage
      src={avatarUrl}
      alt={name}
      fallbackInitials={name}
      variant="avatar"
      width={size}
      height={size}
    />
  );
}
