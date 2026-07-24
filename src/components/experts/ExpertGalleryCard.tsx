import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import AcUnitOutlinedIcon from '@mui/icons-material/AcUnitOutlined';
import PlumbingOutlinedIcon from '@mui/icons-material/PlumbingOutlined';
import ElectricalServicesOutlinedIcon from '@mui/icons-material/ElectricalServicesOutlined';
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined';
import GarageOutlinedIcon from '@mui/icons-material/GarageOutlined';
import { colors, fonts } from '../../theme';
import { GALLERY_CATEGORY_IMAGES } from '../../data/expertImages';

const GALLERY_ICONS: Record<string, React.ElementType> = {
  'Appliance Care': BuildOutlinedIcon,
  'HVAC Services': AcUnitOutlinedIcon,
  Plumbing: PlumbingOutlinedIcon,
  Electrical: ElectricalServicesOutlinedIcon,
  'Smart Home': SensorsOutlinedIcon,
  'Garage Door': GarageOutlinedIcon,
};

interface Props {
  category: string;
}

export default function ExpertGalleryCard({ category }: Props) {
  const imageSrc = GALLERY_CATEGORY_IMAGES[category];
  const Icon = GALLERY_ICONS[category] ?? BuildOutlinedIcon;
  const [errored, setErrored] = useState(false);
  const showImage = Boolean(imageSrc) && !errored;

  return (
    <Box
      sx={{
        borderRadius: '16px',
        border: `1px solid ${colors.border}`,
        boxShadow: colors.cardShadow,
        backgroundColor: '#fff',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 20px 40px rgba(10,37,64,0.14)' },
      }}
    >
      <Box
        sx={{
          height: { xs: 120, sm: 140 },
          backgroundColor: colors.lightBlueBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {showImage ? (
          <Box
            component="img"
            src={imageSrc}
            alt={`${category} service by Smart Appliances`}
            loading="lazy"
            decoding="async"
            onError={() => setErrored(true)}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <Icon sx={{ fontSize: 36, color: colors.primaryBlue, opacity: 0.85 }} aria-hidden />
        )}
      </Box>
      <Typography
        sx={{
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: '13px',
          color: colors.darkText,
          textAlign: 'center',
          py: 1.25,
          px: 1,
        }}
      >
        {category}
      </Typography>
    </Box>
  );
}
