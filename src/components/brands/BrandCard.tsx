import React from 'react';
import { Box, Typography } from '@mui/material';
import { colors, fonts } from '../../theme';
import type { ServiceBrand } from '../../data/service-brands';

interface BrandCardProps {
  brand: ServiceBrand;
  compact?: boolean;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand, compact = false }) => (
  <Box
    component="article"
    aria-label={brand.name}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: compact ? { xs: 72, md: 80 } : { xs: 76, md: 88 },
      px: { xs: 1.25, md: 1.5 },
      py: { xs: 1.25, md: 1.5 },
      borderRadius: '13px',
      border: '1px solid #DCE5EF',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 1px 4px rgba(10, 37, 64, 0.04)',
      transition: 'box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
      '&:hover': {
        borderColor: '#C5D9F5',
        boxShadow: '0 6px 18px rgba(11, 94, 215, 0.08)',
        transform: 'translateY(-1px)',
      },
      '&:focus-within': {
        outline: `2px solid ${colors.primaryBlue}`,
        outlineOffset: 2,
      },
    }}
  >
    {brand.logo ? (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: { xs: 34, md: 38 },
          mb: 0.5,
        }}
      >
        <Box
          component="img"
          className="brand-logo-img"
          src={brand.logo}
          alt={brand.alt}
          loading="lazy"
          decoding="async"
          width={120}
          height={38}
          sx={{
            maxWidth: { xs: 100, md: 120 },
            maxHeight: { xs: 32, md: 38 },
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </Box>
    ) : (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          minHeight: { xs: 34, md: 38 },
          mb: 0.5,
        }}
      >
        <Typography
          sx={{
            fontFamily: fonts.heading,
            fontWeight: 700,
            fontSize: compact ? { xs: '0.72rem', md: '0.8rem' } : { xs: '0.78rem', md: '0.88rem' },
            color: colors.navy,
            textAlign: 'center',
            lineHeight: 1.25,
            px: 0.5,
          }}
        >
          {brand.name}
        </Typography>
      </Box>
    )}
    {brand.logo && (
      <Typography
        component="span"
        sx={{
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: '0.68rem',
          color: colors.mutedText,
          textAlign: 'center',
          lineHeight: 1.2,
          mt: 0.25,
        }}
      >
        {brand.name}
      </Typography>
    )}
  </Box>
);

export default BrandCard;
