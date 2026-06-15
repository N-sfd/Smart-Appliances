import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { colors } from '../theme';
import { SERVICE_CARD_IMAGE_WIDTH, SERVICE_CARD_IMAGE_HEIGHT } from '../constants/imageDimensions';

interface ServiceGridCardProps {
  title: string;
  subtitle: string;
  image: string;
  onClick: () => void;
}

const ServiceGridCard: React.FC<ServiceGridCardProps> = ({ title, subtitle, image, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      borderRadius: '18px',
      border: `1px solid ${colors.border}`,
      boxShadow: '0 4px 18px rgba(10, 37, 64, 0.07)',
      cursor: 'pointer',
      overflow: 'hidden',
      transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
      '&:hover': {
        boxShadow: '0 20px 44px rgba(10, 37, 64, 0.14)',
        transform: 'translateY(-5px)',
        borderColor: colors.primaryBlue,
        '& .service-grid-card-image': {
          transform: 'scale(1.04)',
        },
        '& .service-grid-card-arrow': {
          color: colors.primaryBlue,
          transform: 'translateX(4px)',
        },
      },
    }}
  >
    <Box
      sx={{
        height: { xs: 168, sm: 176, md: 180 },
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#EEF3FA',
      }}
    >
      <Box
        className="service-grid-card-image"
        component="img"
        src={image}
        alt={title}
        width={SERVICE_CARD_IMAGE_WIDTH}
        height={SERVICE_CARD_IMAGE_HEIGHT}
        loading="lazy"
        decoding="async"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 0.32s ease',
        }}
      />
    </Box>
    <Box
      sx={{
        px: 2.25,
        py: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 1,
        minHeight: 88,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
            fontWeight: 700,
            fontSize: '0.95rem',
            color: '#0B3D91',
            mb: 0.35,
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
            fontSize: '0.78rem',
            color: '#64748B',
            lineHeight: 1.45,
          }}
        >
          {subtitle}
        </Typography>
      </Box>
      <ArrowForwardIcon
        className="service-grid-card-arrow"
        sx={{
          color: '#B0B8C4',
          fontSize: 20,
          flexShrink: 0,
          mt: 0.25,
          transition: 'transform 0.22s ease, color 0.22s ease',
        }}
      />
    </Box>
  </Card>
);

export default ServiceGridCard;
