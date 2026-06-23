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
import ExpertImage from './ExpertImage';

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

  const specialties = expert.specialties.slice(0, 4);
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
        borderRadius: '20px',
        border: `1px solid ${colors.border}`,
        boxShadow: colors.cardShadow,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#fff',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 24px 48px rgba(10, 37, 64, 0.16)',
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <ExpertImage
          src={imageSrc}
          alt={`${expert.name} — Smart Appliances service expert`}
          fallbackInitials={expert.name}
          variant="card"
          height={{ xs: 150, sm: 150, md: 160, lg: 170 }}
        />
        {primaryCategory && (
          <Chip
            label={primaryCategory}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              backgroundColor: 'rgba(255,255,255,0.95)',
              color: colors.primaryBlue,
              fontFamily: fonts.body,
              fontWeight: 700,
              fontSize: '11px',
            }}
          />
        )}
      </Box>

      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Typography
          sx={{
            fontFamily: fonts.body,
            fontWeight: 700,
            fontSize: '18px',
            color: colors.darkText,
          }}
        >
          {expert.name}
        </Typography>
        <Typography
          sx={{
            fontFamily: fonts.body,
            fontSize: '14px',
            color: colors.mutedText,
            mb: 1,
          }}
        >
          {expert.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.25, mb: 0.5 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              sx={{
                fontSize: 15,
                color: i < filledStars ? colors.warningOrange : colors.border,
              }}
            />
          ))}
          <Typography sx={{ fontSize: '13px', color: colors.mutedText, ml: 0.75 }}>
            {expert.rating} · {expert.reviewCount} reviews · {expert.jobsCompleted} {jobsSuffix}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4, mt: 0.75 }}>
          {expert.responseTime && (
            <Typography sx={{ fontSize: '12.5px', color: colors.mutedText, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 14, color: colors.primaryBlue }} />
              {expert.responseTime}
            </Typography>
          )}
          {areaSummary && (
            <Typography sx={{ fontSize: '12.5px', color: colors.mutedText, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PlaceOutlinedIcon sx={{ fontSize: 14, color: colors.primaryBlue }} />
              {areaSummary}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
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
                fontSize: '12px',
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
                fontSize: '12px',
                borderRadius: '8px',
                height: 26,
              }}
            />
          )}
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Typography
          sx={{
            fontFamily: fonts.heading,
            fontWeight: 700,
            fontSize: '14px',
            color: colors.navy,
            mt: 1.5,
          }}
        >
          {startingFeeLabel}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button
            variant="outlined"
            component={Link}
            to={`/experts/${expert.slug}`}
            sx={{ flex: 1, textTransform: 'none', borderRadius: '10px', fontFamily: fonts.body, fontWeight: 600 }}
          >
            View Profile
          </Button>

          <Button
            variant="contained"
            sx={{ flex: 1, textTransform: 'none', borderRadius: '10px', fontFamily: fonts.body, fontWeight: 700 }}
            onClick={() => navigate(bookHref)}
          >
            Book
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
