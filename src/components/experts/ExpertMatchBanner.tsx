import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { colors, fonts } from '../../theme';
import { getExpertBySlug } from '../../data/experts';
import { getExpertImageUrl } from '../../data/expertImages';
import ExpertAvatar from './ExpertAvatar';

const PREVIEW_SLUGS = ['hvac-repair-specialist', 'appliance-repair-specialist', 'plumbing-repair-specialist'];

export default function ExpertMatchBanner() {
  const previewExperts = PREVIEW_SLUGS.map((slug) => getExpertBySlug(slug)).filter(Boolean);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        p: { xs: 2.5, md: 3 },
        mb: 3,
        borderRadius: '18px',
        backgroundColor: colors.lightBlueBg,
        border: `1px solid ${colors.border}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
        {previewExperts.length > 0 && (
          <Box sx={{ display: 'flex', flexShrink: 0, pl: 0.5 }}>
            {previewExperts.map((expert, index) => (
              <Box
                key={expert!.slug}
                sx={{
                  ml: index === 0 ? 0 : -2.5,
                  zIndex: previewExperts.length - index,
                  position: 'relative',
                }}
              >
                <ExpertAvatar
                  src={getExpertImageUrl(expert!.slug, expert!.imageUrl, expert!.avatarUrl)}
                  alt={expert!.name}
                  initials={expert!.initials}
                  size={44}
                />
              </Box>
            ))}
          </Box>
        )}
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '1.05rem', md: '1.15rem' },
              color: colors.navy,
              mb: 0.5,
            }}
          >
            Get matched with the right service expert
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.body,
              fontSize: '0.88rem',
              color: colors.mutedText,
              lineHeight: 1.6,
            }}
          >
            Answer a few questions and we&apos;ll recommend the best Smart Appliances expert for your service need.
          </Typography>
        </Box>
      </Box>
      <Button
        component={RouterLink}
        to="/match-expert"
        variant="contained"
        sx={{
          flexShrink: 0,
          backgroundColor: colors.primaryBlue,
          fontFamily: fonts.body,
          fontWeight: 700,
          textTransform: 'none',
          borderRadius: '12px',
          px: 3,
          py: 1.1,
          width: { xs: '100%', sm: 'auto' },
          '&:hover': { backgroundColor: colors.navy },
        }}
      >
        Start Matching
      </Button>
    </Box>
  );
}
