import React from 'react';
import { Box, Typography } from '@mui/material';
import logoBrand from '../assets/logo-brand.png';
import { colors, fonts } from '../theme';
import {
  LOGO_BRAND_WIDTH,
  LOGO_BRAND_HEIGHT,
  LOGO_HEADER_HEIGHT,
  LOGO_HEADER_WIDTH,
} from '../constants/imageDimensions';

interface BrandLogoProps {
  size?: number;
  mobileSize?: number;
  variant?: 'header' | 'footer';
  /** Flat 2D mark + wordmark for header (default on header) */
  flat?: boolean;
  dark?: boolean;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 108,
  mobileSize = 70,
  variant = 'header',
  flat = false,
  onClick,
}) => {
  const isHeader = variant === 'header';

  const wrapperSx = {
    display: 'inline-flex',
    alignItems: 'center',
    cursor: onClick ? 'pointer' : 'default',
    userSelect: 'none',
    flexShrink: 0,
    outline: 'none',
    transition: 'opacity 0.3s ease',
    '&:hover': onClick ? { opacity: 0.88 } : undefined,
    '&:focus-visible': onClick
      ? { outline: '2px solid #1A73E8', outlineOffset: 3, borderRadius: '8px' }
      : undefined,
  } as const;

  const interactiveProps = onClick
    ? {
        onClick,
        role: 'button' as const,
        tabIndex: 0,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        },
        'aria-label': 'Smart Appliances',
      }
    : { 'aria-label': 'Smart Appliances' };

  if (variant === 'footer') {
    return (
      <Box sx={wrapperSx} {...interactiveProps}>
        <Box
          component="img"
          src="/images/logo-full.webp"
          alt="Smart Appliances"
          sx={{
            display: 'block',
            width: { xs: 168, sm: 188, md: 208 },
            height: 'auto',
            maxHeight: { xs: 68, sm: 76, md: 84 },
            objectFit: 'contain',
            objectPosition: 'left center',
          }}
        />
      </Box>
    );
  }

  if (isHeader && flat) {
    return (
      <Box sx={wrapperSx} {...interactiveProps}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 1.15, md: 1.35 },
          }}
        >
          <Box
            component="img"
            src="/logo-mark.svg"
            alt=""
            aria-hidden
            sx={{
              width: { xs: 38, sm: 42, md: 46 },
              height: { xs: 38, sm: 42, md: 46 },
              flexShrink: 0,
              display: 'block',
            }}
          />
          <Box sx={{ textAlign: 'left', minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: fonts.heading,
                fontWeight: 800,
                fontSize: { xs: '1rem', sm: '1.08rem', md: '1.15rem' },
                color: colors.navy,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
              }}
            >
              Smart Appliances
            </Typography>
            <Typography
              sx={{
                fontFamily: fonts.body,
                fontSize: { xs: '0.62rem', sm: '0.68rem', md: '0.72rem' },
                fontWeight: 500,
                color: colors.mutedText,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                lineHeight: 1.3,
                mt: 0.2,
              }}
            >
              Repair · Install · Maintain
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  const displayWidth = isHeader
    ? LOGO_HEADER_WIDTH
    : { xs: Math.round(mobileSize * (LOGO_BRAND_WIDTH / LOGO_BRAND_HEIGHT)), md: Math.round(size * (LOGO_BRAND_WIDTH / LOGO_BRAND_HEIGHT)) };

  const displayHeight = isHeader
    ? LOGO_HEADER_HEIGHT
    : { xs: mobileSize, md: size };

  return (
    <Box sx={wrapperSx} {...interactiveProps}>
      <Box
        sx={{
          width: displayWidth,
          height: displayHeight,
          maxWidth: isHeader ? { xs: 210, sm: 230, md: 155, lg: 162 } : undefined,
          ...(isHeader && {
            '@media (min-width:1024px) and (max-width:1199.98px)': { maxWidth: 150 },
          }),
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <Box
          component="img"
          src={logoBrand}
          alt="Smart Appliances — Repair, Install, Maintain"
          width={LOGO_BRAND_WIDTH}
          height={LOGO_BRAND_HEIGHT}
          sx={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'left center',
          }}
        />
      </Box>
    </Box>
  );
};

export default BrandLogo;
