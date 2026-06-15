import React from 'react';
import { Box, Typography } from '@mui/material';
import { fonts } from '../theme';
import type { LogoBrand } from '../data/logoBrandTypes';
import { BRAND_LOGO_SLOT_WIDTH, BRAND_LOGO_SLOT_HEIGHT } from '../constants/imageDimensions';
import StableImage from './StableImage';

interface LogoBrandMarqueeProps {
  brands: LogoBrand[];
  logoHeight?: number;
  /** Logos only — no pill background or border */
  plain?: boolean;
}

const LogoBrandMarquee: React.FC<LogoBrandMarqueeProps> = ({ brands, logoHeight = 36, plain = false }) => (
  <Box
    sx={{
      position: 'relative',
      overflow: 'hidden',
      py: 1,
      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: { xs: 40, md: 80 },
        zIndex: 1,
        pointerEvents: 'none',
      },
      '&::before': {
        left: 0,
        background: 'linear-gradient(90deg, #F8FAFC 0%, transparent 100%)',
      },
      '&::after': {
        right: 0,
        background: 'linear-gradient(270deg, #F8FAFC 0%, transparent 100%)',
      },
    }}
  >
    <Box className="brand-marquee-track" sx={{ gap: { xs: 4, md: 6 }, alignItems: 'center' }}>
      {[...brands, ...brands].map((brand, index) => (
        <Box
          key={`${brand.name}-${index}`}
          sx={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.25,
            px: plain ? { xs: 1, md: 1.5 } : { xs: 1.5, md: 2 },
            py: plain ? 0 : 1,
            ...(plain
              ? {}
              : {
                  borderRadius: '999px',
                  border: '1px solid #E4E7EB',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(10,37,64,0.04)',
                }),
          }}
        >
          {brand.logo ? (
            <StableImage
              src={brand.logo}
              alt={brand.displayName}
              intrinsicWidth={BRAND_LOGO_SLOT_WIDTH}
              intrinsicHeight={BRAND_LOGO_SLOT_HEIGHT}
              displayWidth={{ xs: 72, md: 120 }}
              displayHeight={{ xs: logoHeight, md: logoHeight }}
            />
          ) : (
            <Typography
              sx={{
                fontFamily: fonts.heading,
                fontWeight: 700,
                fontSize: '0.95rem',
                color: '#1A1A1A',
                whiteSpace: 'nowrap',
              }}
            >
              {brand.displayName}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  </Box>
);

export default LogoBrandMarquee;
