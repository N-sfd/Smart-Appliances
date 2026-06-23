import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';

import { colors, fonts } from '../../theme';
import { Expert } from '../../data/experts';
import { getExpertImageUrl } from '../../data/expertImages';
import { getStartingFeeLabel } from '../../utils/pricing';
import ExpertAvatar from './ExpertAvatar';

type Props = {
  expert: Expert;
};

function getPrimaryCategory(expert: Expert): string | null {
  if (expert.category && expert.category !== 'All Services') return expert.category;
  const counts = new Map<string, number>();
  expert.services.forEach((s) => {
    if (!s.serviceCategory) return;
    counts.set(s.serviceCategory, (counts.get(s.serviceCategory) ?? 0) + 1);
  });
  let best: string | null = null;
  let bestCount = 0;
  counts.forEach((count, cat) => {
    if (count > bestCount) {
      best = cat;
      bestCount = count;
    }
  });
  return best;
}

export default function ExpertCard({ expert }: Props) {
  const navigate = useNavigate();

  const specialties = expert.specialties.slice(0, 3);
  const extraCount = expert.specialties.length - specialties.length;
  const startingFeeLabel = expert.startingFeeLabel ?? getStartingFeeLabel(expert.services);
  const areaSummary = expert.serviceAreas.slice(0, 2).join(', ')
    + (expert.serviceAreas.length > 2 ? ` +${expert.serviceAreas.length - 2}` : '');
  const primaryCategory = expert.category ?? getPrimaryCategory(expert);
  const imageSrc = getExpertImageUrl(expert.slug, expert.imageUrl, expert.avatarUrl);
  const filledStars = Math.round(expert.rating);
  const jobsSuffix = expert.jobsLabel ?? 'jobs completed';

  const bookHref = primaryCategory && primaryCategory !== 'All Services'
    ? `/scheduler?serviceCategory=${encodeURIComponent(primaryCategory)}&expert=${expert.slug}`
    : `/scheduler?expert=${expert.slug}`;

  return (
    <Box
      sx={{
        borderRadius: '18px',
        border: `1px solid ${colors.border}`,
        boxShadow: colors.cardShadow,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        gap: { xs: 2, md: 2.5 },
        p: { xs: 2.5, md: 3 },
        backgroundColor: '#fff',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 16px 40px rgba(10, 37, 64, 0.12)',
        },
      }}
    >
      {/* Left — circular avatar */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', flexShrink: 0 }}>
        <ExpertAvatar
          src={imageSrc}
          alt={expert.name}
          initials={expert.initials}
          category={primaryCategory ?? undefined}
          size={104}
        />
      </Box>

      {/* Middle — details */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: fonts.body,
            fontWeight: 700,
            fontSize: '18px',
            color: colors.darkText,
            lineHeight: 1.25,
          }}
        >
          {expert.name}
        </Typography>
        <Typography
          sx={{
            fontFamily: fonts.body,
            fontSize: '14px',
            color: colors.mutedText,
            mt: 0.25,
            mb: 0.75,
          }}
        >
          {expert.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.25, mb: 0.75 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              sx={{ fontSize: 15, color: i < filledStars ? colors.warningOrange : colors.border }}
            />
          ))}
          <Typography sx={{ fontSize: '13px', color: colors.mutedText, ml: 0.5 }}>
            {expert.rating} · {expert.reviewCount} reviews · {expert.jobsCompleted} {jobsSuffix}
          </Typography>
        </Box>

        {expert.responseTime && (
          <Typography
            sx={{
              fontSize: '12.5px',
              color: colors.mutedText,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mb: 0.35,
            }}
          >
            <AccessTimeIcon sx={{ fontSize: 14, color: colors.primaryBlue }} />
            {expert.responseTime}
          </Typography>
        )}

        {areaSummary && (
          <Typography
            sx={{
              fontSize: '12.5px',
              color: colors.mutedText,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mb: 0.75,
            }}
          >
            <PlaceOutlinedIcon sx={{ fontSize: 14, color: colors.primaryBlue }} />
            {areaSummary}
          </Typography>
        )}

        {expert.shortSummary && (
          <Typography
            sx={{
              fontFamily: fonts.body,
              fontSize: '13px',
              color: colors.darkText,
              lineHeight: 1.55,
              mb: 1,
            }}
          >
            {expert.shortSummary}
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {specialties.map((spec) => (
            <Chip
              key={spec}
              label={spec}
              size="small"
              sx={{
                backgroundColor: colors.lightBlueBg,
                color: colors.primaryBlue,
                fontFamily: fonts.body,
                fontWeight: 600,
                fontSize: '11.5px',
                borderRadius: '8px',
                height: 26,
              }}
            />
          ))}
          {extraCount > 0 && (
            <Chip
              label={`+${extraCount} more`}
              size="small"
              sx={{
                backgroundColor: colors.lightBlueBg,
                color: colors.primaryBlue,
                fontFamily: fonts.body,
                fontWeight: 600,
                fontSize: '11.5px',
                borderRadius: '8px',
                height: 26,
              }}
            />
          )}
        </Box>
      </Box>

      {/* Right — CTA */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'stretch', md: 'flex-end' },
          justifyContent: 'center',
          gap: 1.25,
          flexShrink: 0,
          minWidth: { md: 168 },
          pt: { xs: 0.5, md: 0 },
          borderTop: { xs: `1px solid ${colors.border}`, md: 'none' },
          mt: { xs: 0.5, md: 0 },
        }}
      >
        <Typography
          sx={{
            fontFamily: fonts.heading,
            fontWeight: 700,
            fontSize: '14px',
            color: colors.navy,
            textAlign: { xs: 'left', md: 'right' },
          }}
        >
          {startingFeeLabel}
        </Typography>
        <Button
          variant="outlined"
          component={Link}
          to={`/experts/${expert.slug}`}
          fullWidth
          sx={{
            textTransform: 'none',
            borderRadius: '10px',
            fontFamily: fonts.body,
            fontWeight: 600,
            borderColor: colors.border,
            color: colors.darkText,
          }}
        >
          View Profile
        </Button>
        <Button
          variant="contained"
          fullWidth
          sx={{
            textTransform: 'none',
            borderRadius: '10px',
            fontFamily: fonts.body,
            fontWeight: 700,
            backgroundColor: colors.primaryBlue,
            '&:hover': { backgroundColor: colors.navy },
          }}
          onClick={() => navigate(bookHref)}
        >
          Book
        </Button>
      </Box>
    </Box>
  );
}
