import React from 'react';
import { Box, Typography } from '@mui/material';
import { colors, fonts } from '../theme';
import { BRANDS_WE_SERVICE_FOOTER } from '../data/footerBrands';

const LOGO_HEIGHT = { xs: 28, md: 34 } as const;
const ITEM_WIDTH = { xs: 108, sm: 122, md: 136 } as const;

interface BrandsWeServiceMarqueeProps {
  /** Background color for edge fade gradients */
  fadeColor?: string;
}

/**
 * Auto-scrolling, boxless brand logo strip in full color.
 * Pauses on hover; respects prefers-reduced-motion via global CSS.
 */
const BrandsWeServiceMarquee: React.FC<BrandsWeServiceMarqueeProps> = ({
  fadeColor = '#F6F9FC',
}) => {
  // Duplicate the track for a seamless scroll loop; the second copy is
  // decorative and hidden from assistive tech to avoid announcing brands twice.
  const trackItems = [...BRANDS_WE_SERVICE_FOOTER, ...BRANDS_WE_SERVICE_FOOTER];
  const baseLength = BRANDS_WE_SERVICE_FOOTER.length;

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        py: 0.5,
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: { xs: 32, md: 72 },
          zIndex: 1,
          pointerEvents: 'none',
        },
        '&::before': {
          left: 0,
          background: `linear-gradient(90deg, ${fadeColor} 0%, transparent 100%)`,
        },
        '&::after': {
          right: 0,
          background: `linear-gradient(270deg, ${fadeColor} 0%, transparent 100%)`,
        },
      }}
    >
      <Box
        className="brand-marquee-track"
        role="list"
        aria-label="Brands we service"
        sx={{ gap: { xs: 2.5, md: 3.25 }, alignItems: 'center', py: 0.25 }}
      >
        {trackItems.map((brand, index) => {
          const isDuplicate = index >= baseLength;
          return (
            <Box
              key={`${brand.name}-${index}`}
              role={isDuplicate ? undefined : 'listitem'}
              aria-hidden={isDuplicate || undefined}
              sx={{
                flexShrink: 0,
                width: ITEM_WIDTH,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
              }}
            >
              {brand.logo ? (
                <Box
                  component="img"
                  src={brand.logo}
                  alt={brand.name}
                  width={120}
                  height={40}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: LOGO_HEIGHT,
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                    userSelect: 'none',
                  }}
                />
              ) : (
                <Typography
                  sx={{
                    fontFamily: fonts.heading,
                    fontWeight: 700,
                    fontSize: { xs: '0.78rem', md: '0.88rem' },
                    color: colors.navy,
                    textAlign: 'center',
                    lineHeight: 1.2,
                  }}
                >
                  {brand.name}
                </Typography>
              )}
              {brand.logo && (
                <Typography
                  component="span"
                  sx={{
                    fontFamily: fonts.body,
                    fontWeight: 600,
                    fontSize: '0.66rem',
                    color: colors.mutedText,
                    textAlign: 'center',
                    lineHeight: 1.2,
                  }}
                >
                  {brand.name}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default BrandsWeServiceMarquee;
