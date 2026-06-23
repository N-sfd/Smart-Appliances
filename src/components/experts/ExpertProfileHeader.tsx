import React, { useState } from 'react';
import { Box, Typography, Chip, IconButton, Tooltip } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

import { colors, fonts } from '../../theme';
import { Expert } from '../../data/experts';
import { getExpertImageUrl } from '../../data/expertImages';
import ExpertImage from './ExpertImage';

type Props = {
  expert: Expert;
};

export default function ExpertProfileHeader({ expert }: Props) {
  const filledStars = Math.round(expert.rating);
  const [copied, setCopied] = useState(false);
  const imageSrc = getExpertImageUrl(expert.slug, expert.imageUrl, expert.avatarUrl);

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
        gap: { xs: 2, sm: 2.5 },
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'flex-start' },
        p: { xs: 2, sm: 2.5 },
        borderRadius: '20px',
        backgroundColor: '#fff',
        border: `1px solid ${colors.border}`,
        boxShadow: colors.cardShadow,
      }}
    >
      <ExpertImage
        src={imageSrc}
        alt={`${expert.name} profile`}
        fallbackInitials={expert.name}
        variant="profile"
        width={120}
        height={120}
        sx={{ alignSelf: { xs: 'center', sm: 'flex-start' } }}
      />

      <Box sx={{ flex: 1, width: '100%', minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
          <Typography
            component="h1"
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '24px', sm: '28px' },
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

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 0.25,
            rowGap: 0.5,
            mt: 1,
          }}
        >
          <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '14px', color: colors.navy, mr: 0.5 }}>
            {expert.rating}
          </Typography>
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              sx={{
                fontSize: 18,
                color: i < filledStars ? colors.warningOrange : colors.border,
              }}
            />
          ))}
          <Typography sx={{ fontSize: '14px', color: colors.mutedText, ml: 0.75 }}>
            · {expert.reviewCount} reviews · {expert.jobsCompleted} {expert.jobsLabel ?? 'jobs completed'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.25 }}>
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
        </Box>

        {expert.responseTime && (
          <Typography sx={{ mt: 1, fontSize: '14px', color: colors.mutedText }}>
            {expert.responseTime}
          </Typography>
        )}

        {expert.serviceAreas?.length > 0 && (
          <Typography sx={{ mt: 0.5, fontSize: '14px', color: colors.mutedText, lineHeight: 1.55 }}>
            Serving {expert.serviceAreas.join(', ')}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
