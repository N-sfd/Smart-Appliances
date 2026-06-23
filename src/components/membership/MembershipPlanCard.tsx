import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { colors, fonts } from '../../theme';
import type { MembershipPlan } from '../../data/membershipPlans';
import { formatMembershipPrice } from '../../data/membershipPlans';

interface MembershipPlanCardProps {
  plan: MembershipPlan;
  onChoose: (planId: string) => void;
}

const MembershipPlanCard: React.FC<MembershipPlanCardProps> = ({ plan, onChoose }) => (
  <Box
    component="article"
    aria-label={`${plan.name} membership plan`}
    sx={{
      position: 'relative',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: colors.surface,
      borderRadius: '22px',
      border: plan.highlighted ? `2px solid ${colors.primaryBlue}` : `1px solid ${colors.border}`,
      boxShadow: plan.highlighted
        ? '0 18px 40px rgba(26, 115, 232, 0.14)'
        : '0 2px 12px rgba(10, 37, 64, 0.06)',
      p: { xs: 2.5, md: 3 },
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: plan.highlighted
          ? '0 22px 48px rgba(26, 115, 232, 0.18)'
          : '0 12px 32px rgba(10, 37, 64, 0.1)',
      },
    }}
  >
    {plan.highlighted && (
      <Chip
        label="Most Popular"
        size="small"
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          backgroundColor: colors.primaryBlue,
          color: colors.white,
          fontFamily: fonts.body,
          fontWeight: 700,
          fontSize: '0.72rem',
        }}
      />
    )}

    <Typography
      component="h3"
      sx={{
        fontFamily: fonts.heading,
        fontWeight: 800,
        fontSize: '1.2rem',
        color: colors.navy,
        mb: 0.75,
        pr: plan.highlighted ? 6 : 0,
      }}
    >
      {plan.name}
    </Typography>

    <Typography sx={{ fontFamily: fonts.body, fontSize: '0.88rem', color: colors.mutedText, mb: 2, lineHeight: 1.55 }}>
      {plan.description}
    </Typography>

    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '1.75rem', color: colors.navy, lineHeight: 1.1 }}>
        {formatMembershipPrice(plan.monthlyPrice)}
        <Box component="span" sx={{ fontSize: '0.95rem', fontWeight: 600, color: colors.mutedText }}>
          /month
        </Box>
      </Typography>
      <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.mutedText, mt: 0.5 }}>
        or {formatMembershipPrice(plan.yearlyPrice)}/year
      </Typography>
    </Box>

    <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none', flexGrow: 1, mb: 2.5 }}>
      {plan.benefits.map((benefit) => (
        <Box
          component="li"
          key={benefit}
          sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.1 }}
        >
          <CheckCircleOutlineIcon sx={{ fontSize: 17, color: colors.primaryBlue, mt: 0.15, flexShrink: 0 }} />
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.86rem', color: colors.darkText, lineHeight: 1.55 }}>
            {benefit}
          </Typography>
        </Box>
      ))}
    </Box>

    <Button
      variant={plan.highlighted ? 'contained' : 'outlined'}
      fullWidth
      onClick={() => onChoose(plan.id)}
      sx={{
        fontFamily: fonts.body,
        fontWeight: 700,
        textTransform: 'none',
        borderRadius: '12px',
        py: 1.25,
        ...(plan.highlighted
          ? {
              backgroundColor: colors.primaryBlue,
              color: colors.white,
              '&:hover': { backgroundColor: colors.navy },
            }
          : {
              borderColor: colors.primaryBlue,
              color: colors.primaryBlue,
              '&:hover': { backgroundColor: colors.lightBlueBg, borderColor: colors.navy },
            }),
      }}
    >
      {plan.ctaLabel}
    </Button>
  </Box>
);

export default MembershipPlanCard;
