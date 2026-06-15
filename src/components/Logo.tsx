import React from 'react';
import { Box } from '@mui/material';
import logoBrand from '../assets/logo-brand.webp';

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

  return (
    <Box sx={wrapperSx} {...interactiveProps}>
      <Box
        component="img"
        src={logoBrand}
        alt="Smart Appliances — Repair, Install, Maintain"
        sx={{
          display: 'block',
          objectFit: 'contain',
          objectPosition: 'left center',
          flexShrink: 0,
          // No filters or opacity — show the PNG exactly as designed
          ...(isHeader
            ? {
                height: { xs: 88, sm: 96, md: 108, lg: 116 },
                width: 'auto',
                maxWidth: { xs: 260, sm: 300, md: 340, lg: 360 },
              }
            : {
                height: { xs: mobileSize, md: size },
                width: 'auto',
              }),
        }}
      />
    </Box>
  );
};

export default BrandLogo;
