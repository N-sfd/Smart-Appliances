import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { colors, fonts } from '../theme';
import { BRANDS_WE_SERVICE_FOOTER } from '../data/footerBrands';

const LOGO_HEIGHT = { xs: 28, sm: 32, md: 36 } as const;

interface BrandsWeServiceBlockProps {
  headingId?: string;
}

/** Shared brand-logo grid used above the footer and on service landing pages. */
export const BrandsWeServiceBlock: React.FC<BrandsWeServiceBlockProps> = ({ headingId = 'brands-we-service-heading' }) => (
  <>
    <Typography
      id={headingId}
      component="h2"
      sx={{
        fontFamily: fonts.heading,
        fontWeight: 800,
        fontSize: { xs: '1.25rem', md: '1.5rem' },
        color: colors.navy,
        textAlign: 'center',
        mb: 1.25,
      }}
    >
      Brands We Service
    </Typography>
    <Typography
      sx={{
        fontFamily: fonts.body,
        fontSize: { xs: '0.9rem', md: '0.95rem' },
        color: colors.mutedText,
        textAlign: 'center',
        maxWidth: 560,
        mx: 'auto',
        lineHeight: 1.65,
        mb: { xs: 3, md: 3.5 },
      }}
    >
      Our technicians service many major appliance brands. Brand availability may vary by appliance type and service area.
    </Typography>

    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(3, minmax(0, 1fr))',
          sm: 'repeat(4, minmax(0, 1fr))',
          md: 'repeat(6, minmax(0, 1fr))',
        },
        gap: { xs: 1, sm: 1.25, md: 1.5 },
        maxWidth: 960,
        mx: 'auto',
      }}
    >
      {BRANDS_WE_SERVICE_FOOTER.map((brand) => (
        <Box
          key={brand.name}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: { xs: 64, sm: 72, md: 80 },
            px: { xs: 1, md: 1.5 },
            py: { xs: 1.25, md: 1.5 },
            borderRadius: '13px',
            border: '1px solid #DCE5EF',
            backgroundColor: '#FFFFFF',
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
              sx={{
                maxWidth: { xs: 72, sm: 84, md: 96 },
                maxHeight: LOGO_HEIGHT,
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
                filter: 'grayscale(1)',
                opacity: 0.72,
                transition: 'filter 0.22s ease, opacity 0.22s ease',
              }}
            />
          ) : (
            <Typography
              sx={{
                fontFamily: fonts.heading,
                fontWeight: 700,
                fontSize: { xs: '0.8rem', md: '0.9rem' },
                color: colors.navy,
                textAlign: 'center',
                lineHeight: 1.2,
                px: 0.5,
              }}
            >
              {brand.name}
            </Typography>
          )}
        </Box>
      ))}
    </Box>

    <Box sx={{ textAlign: 'center', mt: { xs: 2.5, md: 3 } }}>
      <Box
        component={RouterLink}
        to="/contact"
        sx={{
          fontFamily: fonts.body,
          fontSize: '0.875rem',
          fontWeight: 600,
          color: colors.primaryBlue,
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' },
          '&:focus-visible': { outline: `2px solid ${colors.primaryBlue}`, outlineOffset: 2, borderRadius: '4px' },
        }}
      >
        Don&apos;t see your brand? Contact us to confirm availability.
      </Box>
    </Box>
  </>
);

export default BrandsWeServiceBlock;
