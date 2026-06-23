import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';

import { colors, fonts } from '../../theme';
import { Expert } from '../../data/experts';
import { getStartingFeeLabel } from '../../utils/pricing';
import ExpertAvatar from './ExpertAvatar';

type Props = {
  expert: Expert;
};

export default function ExpertCard({ expert }: Props) {
  const navigate = useNavigate();

  const specialties = expert.specialties.slice(0, 4);
  const extraCount = expert.specialties.length - specialties.length;
  const startingFeeLabel = getStartingFeeLabel(expert.services);
  const areaSummary = expert.serviceAreas.slice(0, 2).join(', ')
    + (expert.serviceAreas.length > 2 ? ` +${expert.serviceAreas.length - 2}` : '');

  return (
    <Box
      sx={{
        borderRadius: '20px',
        border: `1px solid ${colors.border}`,
        boxShadow: colors.cardShadow,
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#fff',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 24px 48px rgba(10, 37, 64, 0.16)',
        },
      }}
    >
      {/* TOP ROW */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Avatar */}
        <ExpertAvatar name={expert.name} avatarUrl={expert.avatarUrl} size={56} fontSize={18} />

        {/* Name + Title */}
        <Box>
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
            }}
          >
            {expert.title}
          </Typography>
        </Box>
      </Box>

      {/* STATS ROW */}
      <Typography
        sx={{
          mt: 1.5,
          fontSize: '13px',
          color: colors.mutedText,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        <StarIcon sx={{ fontSize: 16, color: colors.warningOrange }} />
        {expert.rating} · {expert.reviewCount} reviews · {expert.jobsCompleted} jobs
      </Typography>

      {/* RESPONSE TIME + SERVICE AREA */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4, mt: 1 }}>
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

      {/* SPECIALTY CHIPS */}
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

      {/* SPACER */}
      <Box sx={{ flexGrow: 1 }} />

      {/* STARTING FEE */}
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

      {/* BUTTON ROW */}
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <Button
          variant="outlined"
          component={Link}
          to={`/experts/${expert.slug}`}
          sx={{ flex: 1 }}
        >
          View Profile
        </Button>

        <Button
          variant="contained"
          sx={{ flex: 1 }}
          onClick={() => navigate(`/scheduler?expert=${expert.slug}`)}
        >
          Book
        </Button>
      </Box>
    </Box>
  );
}
