import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { colors, fonts } from '../../theme';
import { getExpertInitials } from '../../data/expertImages';

interface ExpertAvatarProps {
  src?: string | null;
  alt: string;
  initials?: string;
  size?: number;
  category?: string;
}

export default function ExpertAvatar({
  src,
  alt,
  initials,
  size = 96,
  category,
}: ExpertAvatarProps) {
  const [errored, setErrored] = useState(false);
  const showImage = Boolean(src) && !errored;
  const label = initials ?? getExpertInitials(alt);
  const fontSize = size <= 48 ? '0.85rem' : size <= 80 ? '1.1rem' : '1.5rem';

  return (
    <Box
      role="img"
      aria-label={category ? `${alt} — ${category}` : alt}
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        overflow: 'hidden',
        backgroundColor: colors.lightBlueBg,
        border: '3px solid #fff',
        boxShadow: '0 4px 14px rgba(10, 37, 64, 0.12)',
        outline: `2px solid ${colors.lightBlueBg}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {showImage ? (
        <Box
          component="img"
          src={src ?? undefined}
          alt={alt}
          onError={() => setErrored(true)}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <Typography
          aria-hidden
          sx={{
            fontFamily: fonts.heading,
            fontWeight: 800,
            fontSize,
            color: colors.primaryBlue,
            userSelect: 'none',
            lineHeight: 1,
          }}
        >
          {label}
        </Typography>
      )}
    </Box>
  );
}
