import React from 'react';
import { Box, Typography } from '@mui/material';
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined';
import { colors, fonts } from '../../theme';

/** Single polished "coming soon" panel shown in place of per-category video placeholders until real videos are enabled. */
export default function VideosComingSoonPanel() {
  return (
    <Box
      sx={{
        borderRadius: '18px',
        border: `1px solid ${colors.border}`,
        backgroundColor: '#fff',
        boxShadow: '0 4px 16px rgba(10,37,64,0.05)',
        textAlign: 'center',
        py: { xs: 4, md: 5 },
        px: { xs: 3, md: 5 },
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: colors.lightBlueBg,
          color: colors.primaryBlue,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2,
        }}
      >
        <OndemandVideoOutlinedIcon sx={{ fontSize: 26 }} />
      </Box>
      <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: { xs: '1.1rem', md: '1.25rem' }, color: colors.navy, mb: 1 }}>
        Helpful Videos Coming Soon
      </Typography>
      <Typography sx={{ fontFamily: fonts.body, fontSize: '13.5px', color: colors.mutedText, lineHeight: 1.65, maxWidth: 520, mx: 'auto' }}>
        We&apos;re preparing short guides for appliance care, HVAC maintenance, plumbing, electrical safety, smart home
        setup, and garage door care.
      </Typography>
    </Box>
  );
}
