import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
  Chip,
} from '@mui/material';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import EventRepeatOutlinedIcon from '@mui/icons-material/EventRepeatOutlined';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined';
import { colors, fonts, primaryButtonSx, secondaryButtonSx } from '../theme';
import {
  MEMBERSHIP_PLANS,
  MEMBERSHIP_DISCLAIMER,
  MEMBERSHIP_INCLUDED,
  MEMBERSHIP_EXCLUSIONS,
  MEMBERSHIP_FAQS,
  HOW_IT_WORKS_STEPS,
} from '../data/membershipPlans';
import MembershipPlanCard from '../components/membership/MembershipPlanCard';
import MembershipComparisonTable from '../components/membership/MembershipComparisonTable';
import MembershipFaq from '../components/membership/MembershipFaq';

const TRUST_BADGES = [
  { label: 'Priority Scheduling', icon: BoltOutlinedIcon },
  { label: 'Member Savings', icon: SavingsOutlinedIcon },
  { label: 'Seasonal Reminders', icon: EventRepeatOutlinedIcon },
  { label: 'Easy Request Tracking', icon: TrackChangesIcon },
];

const HOW_IT_WORKS_ICONS = [
  AssignmentTurnedInOutlinedIcon,
  EventAvailableOutlinedIcon,
  CardMembershipOutlinedIcon,
  TrackChangesIcon,
  SavingsOutlinedIcon,
];

const sectionTitleSx = {
  fontFamily: fonts.heading,
  fontWeight: 800,
  fontSize: { xs: '1.65rem', md: '2rem' },
  color: colors.navy,
  mb: 1,
  letterSpacing: '-0.3px',
};

const MembershipPage: React.FC = () => {
  const navigate = useNavigate();
  const plansRef = useRef<HTMLDivElement>(null);

  const scrollToPlans = () => {
    plansRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleChoosePlan = (planId: string) => {
    navigate(`/scheduler?membershipPlan=${planId}`);
  };

  return (
    <Box sx={{ backgroundColor: colors.background, pb: 2 }}>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #071B41 0%, #0B2D6B 55%, #0D3A82 100%)',
          py: { xs: 5, md: 6.5 },
          px: 2,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <ShieldOutlinedIcon sx={{ fontSize: 44, color: colors.skyBlue, mb: 1.5 }} />
          <Typography
            component="h1"
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '1.85rem', md: '2.5rem' },
              color: colors.white,
              lineHeight: 1.15,
              mb: 1.5,
            }}
          >
            Protect Your Home with Smart Care
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.body,
              fontSize: { xs: '0.95rem', md: '1.05rem' },
              color: 'rgba(255,255,255,0.78)',
              lineHeight: 1.7,
              maxWidth: 640,
              mx: 'auto',
              mb: 3,
            }}
          >
            Get priority scheduling, repair savings, seasonal maintenance reminders, and member-only
            service benefits for your home appliances and systems.
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 3 }}>
            {TRUST_BADGES.map(({ label, icon: Icon }) => (
              <Chip
                key={label}
                icon={<Icon sx={{ fontSize: 16, color: '#fff !important' }} />}
                label={label}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  color: '#fff',
                  fontFamily: fonts.body,
                  fontWeight: 600,
                  fontSize: '12.5px',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap', mb: 2 }}>
            <Button variant="contained" onClick={scrollToPlans} sx={{ ...primaryButtonSx, px: 3.5, py: 1.25 }}>
              Join Smart Care
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/scheduler')}
              sx={{
                ...secondaryButtonSx,
                background: 'transparent',
                borderColor: 'rgba(255,255,255,0.5)',
                color: colors.white,
                px: 3.5,
                py: 1.25,
                '&:hover': { background: 'rgba(255,255,255,0.08)', borderColor: colors.white },
              }}
            >
              Book a Service
            </Button>
          </Box>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.8rem', fontWeight: 600, color: colors.skyBlue }}>
            Priority service • Member savings • Easy request tracking
          </Typography>
        </Container>
      </Box>

      {/* Plan cards */}
      <Box
        ref={plansRef}
        id="plans"
        sx={{
          pt: { xs: 7, md: 9 },
          pb: { xs: 6, md: 8 },
          scrollMarginTop: { xs: '128px', md: '152px' },
        }}
      >
        <Container maxWidth="lg">
          <Typography component="h2" sx={{ ...sectionTitleSx, textAlign: 'center' }}>
            Choose Your Smart Care Plan
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.body,
              color: colors.mutedText,
              textAlign: 'center',
              mb: 4,
              maxWidth: 560,
              mx: 'auto',
              lineHeight: 1.65,
            }}
          >
            Flexible monthly or yearly options. No payment required today — we&apos;ll help you activate your plan.
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: { xs: 2.5, md: 3 },
              alignItems: 'stretch',
            }}
          >
            {MEMBERSHIP_PLANS.map((plan) => (
              <MembershipPlanCard key={plan.id} plan={plan} onChoose={handleChoosePlan} />
            ))}
          </Box>

          <Typography
            sx={{
              fontFamily: fonts.body,
              fontSize: '0.78rem',
              color: colors.mutedText,
              lineHeight: 1.65,
              mt: 3,
              maxWidth: 900,
              mx: 'auto',
              textAlign: 'center',
            }}
          >
            {MEMBERSHIP_DISCLAIMER}
          </Typography>
        </Container>
      </Box>

      {/* Comparison */}
      <Box sx={{ py: { xs: 5, md: 7 }, backgroundColor: colors.surface }}>
        <Container maxWidth="lg">
          <Typography component="h2" sx={{ ...sectionTitleSx, textAlign: 'center', mb: 3 }}>
            Compare Plans
          </Typography>
          <MembershipComparisonTable />
        </Container>
      </Box>

      {/* How it works */}
      <Box sx={{ py: { xs: 5, md: 7 } }}>
        <Container maxWidth="md">
          <Typography component="h2" sx={{ ...sectionTitleSx, textAlign: 'center', mb: 4 }}>
            How It Works
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' },
              gap: 2,
            }}
          >
            {HOW_IT_WORKS_STEPS.map((step, index) => {
              const Icon = HOW_IT_WORKS_ICONS[index] ?? CardMembershipOutlinedIcon;
              return (
                <Box
                  key={step}
                  sx={{
                    position: 'relative',
                    textAlign: 'center',
                    p: 2.5,
                    borderRadius: '16px',
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.border}`,
                    boxShadow: '0 4px 16px rgba(10, 37, 64, 0.05)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 10px 28px rgba(10, 37, 64, 0.1)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: colors.navy,
                      color: '#fff',
                      fontFamily: fonts.heading,
                      fontWeight: 800,
                      fontSize: '0.62rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'absolute',
                      top: 10,
                      right: 10,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: colors.lightBlueBg,
                      color: colors.primaryBlue,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 1.5,
                    }}
                  >
                    <Icon sx={{ fontSize: 24 }} />
                  </Box>
                  <Typography sx={{ fontFamily: fonts.body, fontSize: '0.88rem', color: colors.darkText, lineHeight: 1.5 }}>
                    {step}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* What's included */}
      <Box sx={{ py: { xs: 5, md: 7 }, backgroundColor: colors.sectionBg }}>
        <Container maxWidth="lg">
          <Typography component="h2" sx={{ ...sectionTitleSx, textAlign: 'center', mb: 4 }}>
            What&apos;s Included
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 2,
              alignItems: 'stretch',
            }}
          >
            {MEMBERSHIP_INCLUDED.map((item) => (
              <Box
                key={item.title}
                sx={{
                  p: 2,
                  borderRadius: '14px',
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  boxShadow: '0 2px 8px rgba(10, 37, 64, 0.04)',
                  height: '100%',
                }}
              >
                <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '0.95rem', color: colors.navy, mb: 0.75 }}>
                  {item.title}
                </Typography>
                <Typography sx={{ fontFamily: fonts.body, fontSize: '0.84rem', color: colors.mutedText, lineHeight: 1.55 }}>
                  {item.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Exclusions */}
      <Box sx={{ py: { xs: 5, md: 7 } }}>
        <Container maxWidth="md">
          <Typography component="h2" sx={{ ...sectionTitleSx, textAlign: 'center', mb: 3 }}>
            What&apos;s Not Included
          </Typography>
          <Box
            component="ul"
            sx={{
              m: 0,
              p: 2,
              borderRadius: '14px',
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              listStyle: 'none',
            }}
          >
            {MEMBERSHIP_EXCLUSIONS.map((item) => (
              <Box
                component="li"
                key={item}
                sx={{
                  fontFamily: fonts.body,
                  fontSize: '0.88rem',
                  color: colors.darkText,
                  lineHeight: 1.6,
                  mb: 0.6,
                  pl: 2,
                  position: 'relative',
                  '&::before': { content: '"•"', position: 'absolute', left: 0, color: '#B45309' },
                  '&:last-of-type': { mb: 0 },
                }}
              >
                {item}
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* FAQ */}
      <Box sx={{ py: { xs: 4.5, md: 6 }, backgroundColor: colors.surface }}>
        <Container maxWidth="md">
          <Typography component="h2" sx={{ ...sectionTitleSx, textAlign: 'center', mb: 2.5 }}>
            Frequently Asked Questions
          </Typography>
          <MembershipFaq faqs={MEMBERSHIP_FAQS} />
        </Container>
      </Box>

      {/* Bottom CTA */}
      <Box
        sx={{
          py: { xs: 5, md: 6.5 },
          textAlign: 'center',
          background: 'linear-gradient(135deg, #071B41 0%, #0B2D6B 100%)',
          px: 2,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h2"
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '1.5rem', md: '1.85rem' },
              color: colors.white,
              mb: 2.5,
            }}
          >
            Ready to protect your home?
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="contained" onClick={scrollToPlans} sx={{ ...primaryButtonSx, px: 3.5 }}>
              Join Smart Care
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/scheduler')}
              sx={{
                borderColor: 'rgba(255,255,255,0.5)',
                color: colors.white,
                fontFamily: fonts.body,
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: '12px',
                px: 3.5,
                '&:hover': { borderColor: colors.white, backgroundColor: 'rgba(255,255,255,0.08)' },
              }}
            >
              Book a Service
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default MembershipPage;
