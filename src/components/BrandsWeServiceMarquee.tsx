import React from 'react';
import { Box, Typography } from '@mui/material';
import { colors, fonts } from '../theme';
import { BRANDS_WE_SERVICE_FOOTER } from '../data/footerBrands';

const LOGO_HEIGHT = { xs: 28, md: 34 } as const;
const CARD_WIDTH = { xs: 118, sm: 132, md: 148 } as const;

interface BrandsWeServiceMarqueeProps {
  /** Background color for edge fade gradients */
  fadeColor?: string;
}

/**
 * Auto-scrolling brand logo strip with compact logo cards.
 * Pauses on hover; respects prefers-reduced-motion via global CSS.
 */
const BrandsWeServiceMarquee: React.FC<BrandsWeServiceMarqueeProps> = ({
  fadeColor = '#F6F9FC',
}) => {
  const trackItems = [...BRANDS_WE_SERVICE_FOOTER, ...BRANDS_WE_SERVICE_FOOTER];

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
        sx={{ gap: { xs: 1.25, md: 1.5 }, alignItems: 'center', py: 0.25 }}
        aria-label="Brands we service"
      >
        {trackItems.map((brand, index) => (
          <Box
            key={`${brand.name}-${index}`}
            sx={{
              flexShrink: 0,
              width: CARD_WIDTH,
              minHeight: { xs: 64, md: 76 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 1.5,
              py: 1.25,
              borderRadius: '13px',
              border: '1px solid #DCE5EF',
              backgroundColor: '#FFFFFF',
              transition: 'border-color 0.2s ease',
              '&:hover': {
                borderColor: '#B8C9DE',
              },
              '&:hover .brand-logo': {
                filter: 'grayscale(0)',
                opacity: 1,
              },
            }}
          >
            {brand.logo ? (
              <Box
                component="img"
                className="brand-logo"
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
                  filter: 'grayscale(1)',
                  opacity: 0.78,
                  transition: 'filter 0.22s ease, opacity 0.22s ease',
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
                  whiteSpace: 'nowrap',
                }}
              >
                {brand.name}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default BrandsWeServiceMarquee;
