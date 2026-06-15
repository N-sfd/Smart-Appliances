import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';

interface StableImageProps {
  src: string;
  alt: string;
  /** Intrinsic width for aspect-ratio hint (HTML attribute) */
  intrinsicWidth: number;
  /** Intrinsic height for aspect-ratio hint (HTML attribute) */
  intrinsicHeight: number;
  /** Reserved layout width (prevents CLS) */
  displayWidth: number | string | Record<string, number | string>;
  /** Reserved layout height (prevents CLS) */
  displayHeight: number | string | Record<string, number | string>;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  decoding?: 'async' | 'sync' | 'auto';
  sx?: SxProps<Theme>;
}

/** Image with a fixed-size wrapper so width/height attributes match rendered layout. */
const StableImage: React.FC<StableImageProps> = ({
  src,
  alt,
  intrinsicWidth,
  intrinsicHeight,
  displayWidth,
  displayHeight,
  loading = 'lazy',
  fetchPriority,
  decoding = 'async',
  sx,
}) => {
  if (!src) return null;

  return (
    <Box
      sx={{
        width: displayWidth,
        height: displayHeight,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        width={intrinsicWidth}
        height={intrinsicHeight}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding={decoding}
        sx={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          ...sx,
        }}
      />
    </Box>
  );
};

export default StableImage;
