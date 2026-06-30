import React from 'react';
import { Box, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { fonts } from '../theme';
import {
  SERVICE_AREA_MAP_EMBED_URL,
  SERVICE_AREA_REGION_LABEL,
  SERVICE_AREA_MAP_LABEL,
  serviceAreaMapPins,
} from '../data/serviceAreas';

interface ServiceAreaMapProps {
  height?: number | { xs: number; sm?: number; md: number };
}

const ServiceAreaMap: React.FC<ServiceAreaMapProps> = ({ height = { xs: 230, sm: 250, md: 280 } }) => (
  <Box
    sx={{
      position: 'relative',
      height,
      borderRadius: '18px',
      overflow: 'hidden',
      border: '1px solid #D0E3FF',
      backgroundColor: '#E8F1FF',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.45)',
    }}
  >
    <Box
      component="iframe"
      title={`${SERVICE_AREA_REGION_LABEL} service coverage map`}
      src={SERVICE_AREA_MAP_EMBED_URL}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      sx={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        border: 0,
        filter: 'saturate(0.92) contrast(1.02)',
      }}
    />

    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background:
          'radial-gradient(ellipse 58% 52% at 50% 46%, rgba(26, 115, 232, 0.14) 0%, rgba(26, 115, 232, 0.05) 52%, transparent 78%)',
      }}
    />

    {serviceAreaMapPins.map((pin) => (
      <Box
        key={pin.label}
        title={pin.label}
        sx={{
          position: 'absolute',
          top: pin.top,
          left: pin.left,
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.25,
        }}
      >
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: '#1A73E8',
            border: '2px solid #FFFFFF',
            boxShadow: '0 2px 8px rgba(26, 115, 232, 0.45)',
          }}
        />
      </Box>
    ))}

    <Box
      sx={{
        position: 'absolute',
        top: 12,
        left: 12,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.25,
        py: 0.75,
        borderRadius: '999px',
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        border: '1px solid #D0E3FF',
        boxShadow: '0 4px 14px rgba(10, 37, 64, 0.1)',
      }}
    >
      <LocationOnIcon sx={{ color: '#1A73E8', fontSize: 16 }} />
      <Typography
        sx={{
          fontFamily: fonts.body,
          fontSize: '0.72rem',
          fontWeight: 700,
          color: '#0B3D91',
          lineHeight: 1.2,
        }}
      >
        {SERVICE_AREA_MAP_LABEL}
      </Typography>
    </Box>
  </Box>
);

export default ServiceAreaMap;
