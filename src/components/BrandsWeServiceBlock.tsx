import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { colors, fonts } from '../theme';
import BrandsWeServiceMarquee from './BrandsWeServiceMarquee';
import { getContactUrlForCategory } from '../data/service-brands';

interface BrandsWeServiceBlockProps {
  headingId?: string;
  /** Edge fade color — should match section background */
  marqueeFadeColor?: string;
}

/** Shared brand-logo marquee used above the footer and on service landing pages. */
export const BrandsWeServiceBlock: React.FC<BrandsWeServiceBlockProps> = ({
  headingId = 'brands-we-service-heading',
  marqueeFadeColor = '#F6F9FC',
}) => (
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

    <BrandsWeServiceMarquee fadeColor={marqueeFadeColor} />

    <Box sx={{ textAlign: 'center', mt: { xs: 2.5, md: 3 } }}>
      <Box
        component={RouterLink}
        to={getContactUrlForCategory('home-appliances')}
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
