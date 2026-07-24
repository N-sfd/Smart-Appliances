import React, { useState } from 'react';
import { Box, Typography, SxProps, Theme } from '@mui/material';
import { colors, fonts } from '../../theme';
import { getExpertInitials } from '../../data/expertImages';

export type ExpertImageVariant = 'card' | 'avatar' | 'profile' | 'gallery';

interface ExpertImageProps {
  src?: string | null;
  alt: string;
  fallbackInitials?: string;
  variant?: ExpertImageVariant;
  height?: number | string | Record<string, number | string>;
  width?: number | string;
  borderRadius?: string;
  sx?: SxProps<Theme>;
}

const variantDefaults: Record<ExpertImageVariant, { borderRadius: string; fontSize: string }> = {
  card: { borderRadius: '18px 18px 0 0', fontSize: '2.25rem' },
  avatar: { borderRadius: '50%', fontSize: '1rem' },
  profile: { borderRadius: '14px', fontSize: '1.75rem' },
  gallery: { borderRadius: '12px 12px 0 0', fontSize: '1.25rem' },
};

export default function ExpertImage({
  src,
  alt,
  fallbackInitials,
  variant = 'card',
  height,
  width,
  borderRadius,
  sx,
}: ExpertImageProps) {
  const [errored, setErrored] = useState(false);
  const showImage = Boolean(src) && !errored;
  const initials = fallbackInitials ?? getExpertInitials(alt);
  const defaults = variantDefaults[variant];
  const resolvedRadius = borderRadius ?? defaults.borderRadius;

  return (
    <Box
      sx={{
        width: width ?? '100%',
        height: height ?? (variant === 'avatar' || variant === 'profile' ? width : '100%'),
        flexShrink: 0,
        borderRadius: resolvedRadius,
        overflow: 'hidden',
        backgroundColor: colors.lightBlueBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
    >
      {showImage ? (
        <Box
          component="img"
          src={src ?? undefined}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setErrored(true)}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <Typography
          aria-hidden
          sx={{
            fontFamily: fonts.heading,
            fontWeight: 800,
            fontSize: defaults.fontSize,
            color: colors.primaryBlue,
            userSelect: 'none',
          }}
        >
          {initials}
        </Typography>
      )}
    </Box>
  );
}
