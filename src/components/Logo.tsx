import React from 'react';
import { Box } from '@mui/material';
import logoBrand from '../assets/logo-brand.webp';
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
  dark?: boolean;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 108,
  mobileSize = 70,
  variant = 'header',
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
          maxWidth: isHeader ? { xs: 260, sm: 300, md: 340, lg: 360 } : undefined,
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
