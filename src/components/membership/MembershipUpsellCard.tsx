import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
} from '@mui/material';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { colors, fonts } from '../../theme';
import { formatMembershipPrice, getMembershipPlanById } from '../../data/membershipPlans';

interface MembershipUpsellCardProps {
  variant?: 'scheduler' | 'confirmation' | 'pricing';
  membershipInterest?: boolean;
  onMembershipInterestChange?: (checked: boolean) => void;
}

const basicPlan = getMembershipPlanById('basic');

const MembershipUpsellCard: React.FC<MembershipUpsellCardProps> = ({
  variant = 'scheduler',
  membershipInterest = false,
  onMembershipInterestChange,
}) => {
  if (variant === 'confirmation') {
    return (
      <Box
        sx={{
          mt: 3,
          p: 2.5,
          borderRadius: '14px',
          backgroundColor: colors.lightBlueBg,
          border: `1px solid ${colors.border}`,
          textAlign: 'left',
        }}
      >
        <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '1rem', color: colors.navy, mb: 0.75 }}>
          Want priority service and repair savings?
        </Typography>
        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.86rem', color: colors.mutedText, mb: 2, lineHeight: 1.6 }}>
          Join Smart Care to get priority scheduling, repair discounts, and seasonal maintenance reminders.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
          <Button
            component={RouterLink}
            to="/membership"
            variant="contained"
            sx={{
              flex: 1,
              backgroundColor: colors.primaryBlue,
              fontFamily: fonts.body,
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '10px',
              '&:hover': { backgroundColor: colors.navy },
            }}
          >
            View Smart Care Plans
          </Button>
          <Button
            component={RouterLink}
            to="/track-request"
            variant="outlined"
            sx={{
              flex: 1,
              borderColor: colors.primaryBlue,
              color: colors.primaryBlue,
              fontFamily: fonts.body,
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '10px',
              '&:hover': { backgroundColor: colors.surface },
            }}
          >
            Track Request
          </Button>
        </Box>
      </Box>
    );
  }

  if (variant === 'pricing') {
    return (
      <Box
        sx={{
          py: { xs: 5, md: 6 },
          px: 2,
          backgroundColor: colors.lightBlueBg,
          borderTop: `1px solid ${colors.border}`,
          borderBottom: `1px solid ${colors.border}`,
          textAlign: 'center',
        }}
      >
        <Box sx={{ maxWidth: 640, mx: 'auto' }}>
          <ShieldOutlinedIcon sx={{ fontSize: 36, color: colors.primaryBlue, mb: 1 }} />
          <Typography
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '1.35rem', md: '1.55rem' },
              color: colors.navy,
              mb: 1,
            }}
          >
            Save on future repairs with Smart Care
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, mb: 2.5, lineHeight: 1.65 }}>
            Smart Care members receive priority scheduling, repair labor discounts, and seasonal maintenance reminders.
          </Typography>
          <Button
            component={RouterLink}
            to="/membership"
            variant="contained"
            sx={{
              backgroundColor: colors.primaryBlue,
              fontFamily: fonts.body,
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '12px',
              px: 4,
              py: 1.25,
              '&:hover': { backgroundColor: colors.navy },
            }}
          >
            View Membership Plans
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mt: 3,
        p: 2.25,
        borderRadius: '14px',
        backgroundColor: colors.lightBlueBg,
        border: `1px solid ${colors.border}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, mb: 1.5 }}>
        <ShieldOutlinedIcon sx={{ fontSize: 22, color: colors.primaryBlue, mt: 0.2, flexShrink: 0 }} />
        <Box>
          <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '1rem', color: colors.navy, mb: 0.5 }}>
            Save more with Smart Care
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.85rem', color: colors.mutedText, lineHeight: 1.6 }}>
            Members get priority scheduling, repair labor discounts, seasonal reminders, and request tracking benefits.
          </Typography>
        </Box>
      </Box>

      {basicPlan && (
        <FormControlLabel
          control={
            <Checkbox
              checked={membershipInterest}
              onChange={(e) => onMembershipInterestChange?.(e.target.checked)}
              sx={{ color: colors.primaryBlue, '&.Mui-checked': { color: colors.primaryBlue } }}
            />
          }
          label={
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.88rem', color: colors.darkText, fontWeight: 600 }}>
              Add {basicPlan.name} — {formatMembershipPrice(basicPlan.monthlyPrice)}/mo
            </Typography>
          }
          sx={{ alignItems: 'flex-start', ml: 0, mb: 0.5 }}
        />
      )}

      <Link
        component={RouterLink}
        to="/membership"
        sx={{
          fontFamily: fonts.body,
          fontSize: '0.82rem',
          fontWeight: 600,
          color: colors.primaryBlue,
          textDecoration: 'none',
          ml: 4.5,
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        View membership plans
      </Link>
    </Box>
  );
};

export default MembershipUpsellCard;
