import React, { useState } from 'react';
import { Box, Typography, Chip, Stack, IconButton, Tooltip } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

import { colors, fonts } from '../../theme';
import { Expert } from '../../data/experts';
import ExpertAvatar from './ExpertAvatar';

type Props = {
  expert: Expert;
};

export default function ExpertProfileHeader({ expert }: Props) {
  const filledStars = Math.round(expert.rating);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = { title: expert.name, text: `${expert.name} — ${expert.title}`, url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch { /* user cancelled */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2.5,
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
      }}
    >
      {/* LEFT — LARGE AVATAR */}
      <ExpertAvatar name={expert.name} avatarUrl={expert.avatarUrl} size={96} fontSize={32} />

      {/* RIGHT — TEXT STACK */}
      <Box sx={{ flex: 1, width: '100%' }}>
        {/* NAME + SHARE */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
          <Typography
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: '28px',
              color: colors.navy,
            }}
          >
            {expert.name}
          </Typography>
          <Tooltip title={copied ? 'Link copied!' : 'Share this profile'}>
            <IconButton
              onClick={handleShare}
              aria-label="Share this profile"
              sx={{
                border: `1px solid ${colors.border}`,
                color: colors.primaryBlue,
                flexShrink: 0,
                '&:hover': { backgroundColor: colors.lightBlueBg },
              }}
            >
              <ShareOutlinedIcon sx={{ fontSize: 19 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* TITLE */}
        <Typography
          sx={{
            fontFamily: fonts.body,
            fontWeight: 600,
            fontSize: '16px',
            color: colors.mutedText,
            mt: 0.5,
          }}
        >
          {expert.title}
        </Typography>

        {/* RATING + REVIEWS + JOBS */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mt: 1,
          }}
        >
          {/* 5 STAR ICONS */}
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              sx={{
                fontSize: 18,
                color: i < filledStars ? colors.warningOrange : colors.border,
              }}
            />
          ))}

          <Typography
            sx={{
              fontSize: '14px',
              color: colors.mutedText,
              ml: 1,
            }}
          >
            {expert.rating} · {expert.reviewCount} reviews · {expert.jobsCompleted} jobs completed
          </Typography>
        </Box>

        {/* BADGES */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ flexWrap: 'wrap', mt: 1 }}
        >
          <Chip
            icon={<VerifiedIcon />}
            label="Verified Smart Appliances Provider"
            sx={{
              backgroundColor: colors.lightBlueBg,
              color: colors.primaryBlue,
              fontFamily: fonts.body,
              fontWeight: 600,
              fontSize: '13px',
              borderRadius: '8px',
              height: 30,
            }}
          />

          <Chip
            label="Licensed & Insured Service Network"
            sx={{
              backgroundColor: colors.lightBlueBg,
              color: colors.primaryBlue,
              fontFamily: fonts.body,
              fontWeight: 600,
              fontSize: '13px',
              borderRadius: '8px',
              height: 30,
            }}
          />
        </Stack>

        {/* RESPONSE TIME (OPTIONAL) */}
        {expert.responseTime && (
          <Typography
            sx={{
              mt: 1,
              fontSize: '14px',
              color: colors.mutedText,
            }}
          >
            {expert.responseTime}
          </Typography>
        )}

        {/* SERVICE AREAS */}
        {expert.serviceAreas?.length > 0 && (
          <Typography
            sx={{
              mt: 0.5,
              fontSize: '14px',
              color: colors.mutedText,
            }}
          >
            {expert.serviceAreas.join(' · ')}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
