import React from 'react';
import { Box, type SxProps, type Theme } from '@mui/material';
import {
  buildResponsiveSrcSet,
  getAvifSrc,
  getDefaultAspectRatio,
  getDefaultSizes,
  getImageBasePath,
  getIntrinsicDimensions,
  type OptimizedImageVariant,
} from '../../utils/optimizedImage';

export type OptimizedServiceImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  variant?: OptimizedImageVariant;
  aspectRatio?: string;
  sizes?: string;
  borderRadius?: string | number;
  className?: string;
  sx?: SxProps<Theme>;
};

/**
 * Performance-optimized service image for the CRA bundle.
 * Uses native <picture> with AVIF/WebP, responsive srcSet, lazy loading, and stable aspect ratio.
 */
const OptimizedServiceImage: React.FC<OptimizedServiceImageProps> = ({
  src,
  alt,
  priority = false,
  variant = 'section',
  aspectRatio,
  sizes,
  borderRadius = 0,
  className,
  sx,
}) => {
  const resolvedAspect = aspectRatio ?? getDefaultAspectRatio(variant);
  const resolvedSizes = sizes ?? getDefaultSizes(variant);
  const { width, height } = getIntrinsicDimensions(variant);
  const webpSrc = src.endsWith('.webp') ? src : `${getImageBasePath(src)}.webp`;
  const avifSrc = getAvifSrc(webpSrc);
  const srcSet = buildResponsiveSrcSet(webpSrc, variant);

  return (
    <Box
      className={className}
      sx={{
        position: 'relative',
        width: '100%',
        aspectRatio: resolvedAspect,
        overflow: 'hidden',
        borderRadius,
        backgroundColor: '#E8EEF4',
        ...sx,
      }}
    >
      <picture
        style={{
          position: 'absolute',
          inset: 0,
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      >
        <source type="image/avif" srcSet={avifSrc} sizes={resolvedSizes} />
        <source type="image/webp" srcSet={srcSet} sizes={resolvedSizes} />
        <img
          src={webpSrc}
          srcSet={srcSet}
          sizes={resolvedSizes}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </picture>
    </Box>
  );
};

export default OptimizedServiceImage;
