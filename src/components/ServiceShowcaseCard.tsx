import React from 'react';
import { Box, Typography } from '@mui/material';

interface ServiceShowcaseCardProps {
  title: string;
  image: string;
  onClick: () => void;
}

const ServiceShowcaseCard: React.FC<ServiceShowcaseCardProps> = ({ title, image, onClick }) => (
  <Box
    component="button"
    type="button"
    onClick={onClick}
    sx={{
      position: 'relative',
      display: 'block',
      width: '100%',
      minWidth: { xs: 200, sm: 220 },
      height: { xs: 200, sm: 220, md: 240 },
      p: 0,
      border: 'none',
      borderRadius: '16px',
      overflow: 'hidden',
      cursor: 'pointer',
      textAlign: 'left',
      background: 'transparent',
      transition: 'transform 0.22s ease, box-shadow 0.22s ease',
      boxShadow: '0 4px 16px rgba(10, 37, 64, 0.08)',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 16px 40px rgba(10, 37, 64, 0.16)',
      },
      '&:focus-visible': {
        outline: '3px solid rgba(26, 115, 232, 0.35)',
        outlineOffset: 2,
      },
    }}
  >
    <Box
      component="img"
      src={image}
      alt=""
      loading="lazy"
      sx={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
      }}
    />
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(7, 27, 65, 0.82) 0%, rgba(7, 27, 65, 0.35) 42%, transparent 72%)',
      }}
    />
    <Typography
      sx={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 16,
        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
        fontWeight: 700,
        fontSize: { xs: '0.95rem', md: '1.05rem' },
        color: '#FFFFFF',
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
      }}
    >
      {title}
    </Typography>
  </Box>
);

export default ServiceShowcaseCard;
