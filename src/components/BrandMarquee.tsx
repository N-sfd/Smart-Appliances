import React from 'react';
import { Box, Typography } from '@mui/material';
import { ApplianceBrand, homeApplianceBrands } from '../data/applianceBrands';
import { fonts } from '../theme';
import { BRAND_LOGO_SLOT_WIDTH, BRAND_LOGO_SLOT_HEIGHT } from '../constants/imageDimensions';
import StableImage from './StableImage';

interface BrandMarqueeProps {
  brands?: ApplianceBrand[];
  /** Filter marquee to these appliance brand names (Home Appliances page) */
  brandNames?: string[];
  title?: string;
}

function resolveMarqueeBrands(brands?: ApplianceBrand[], brandNames?: string[]): ApplianceBrand[] {
  if (brands?.length) return brands;
  if (brandNames?.length) {
    return brandNames.map((name) => {
      const match = homeApplianceBrands.find(
        (b) =>
          b.name.toLowerCase() === name.toLowerCase() ||
          b.displayName.toLowerCase() === name.toLowerCase(),
      );
      return match ?? { name, displayName: name, logo: '' };
    });
  }
  return homeApplianceBrands;
}

const BrandMarquee: React.FC<BrandMarqueeProps> = ({
  brands: brandsProp,
  brandNames,
  title = 'Brands we service',
}) => {
  const brands = resolveMarqueeBrands(brandsProp, brandNames);

  return (
  <Box
    sx={{
      py: { xs: 4, md: 5 },
      backgroundColor: '#FFFFFF',
      borderTop: title ? '1px solid #E4E7EB' : 'none',
    }}
  >
    <Typography
      sx={{
        fontFamily: fonts.body,
        fontWeight: 600,
        fontSize: '0.75rem',
        color: '#64748B',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        mb: title ? 3 : 0,
        px: 2,
        display: title ? 'block' : 'none',
      }}
    >
      {title}
    </Typography>

    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
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
          background: 'linear-gradient(90deg, #FFFFFF 0%, transparent 100%)',
        },
        '&::after': {
          right: 0,
          background: 'linear-gradient(270deg, #FFFFFF 0%, transparent 100%)',
        },
      }}
    >
      <Box className="brand-marquee-track" sx={{ gap: { xs: 4, md: 6 }, alignItems: 'center', py: 0.5 }}>
        {[...brands, ...brands].map((brand, index) => (
          <Box
            key={`${brand.name}-${index}`}
            sx={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              px: { xs: 1, md: 1.5 },
            }}
          >
            {brand.logo ? (
              <StableImage
                src={brand.logo}
                alt={brand.displayName}
                intrinsicWidth={BRAND_LOGO_SLOT_WIDTH}
                intrinsicHeight={BRAND_LOGO_SLOT_HEIGHT}
                displayWidth={{ xs: 72, md: 96 }}
                displayHeight={{ xs: 32, md: 38 }}
              />
            ) : null}
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
  );
};

export default BrandMarquee;
