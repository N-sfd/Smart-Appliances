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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import KitchenOutlinedIcon from '@mui/icons-material/KitchenOutlined';
import AcUnitOutlinedIcon from '@mui/icons-material/AcUnitOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import ElectricBoltOutlinedIcon from '@mui/icons-material/ElectricBoltOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GarageOutlinedIcon from '@mui/icons-material/GarageOutlined';
import { useSeo } from '../hooks/useSeo';
import { colors, fonts, primaryButtonSx, secondaryButtonSx } from '../theme';
import {
  MEMBERSHIP_PLANS,
  MEMBERSHIP_DISCLAIMER,
  MEMBERSHIP_INCLUDED,
  MEMBERSHIP_EXCLUSIONS,
  MEMBERSHIP_FAQS,
  HOW_IT_WORKS_STEPS,
  HERO_BENEFITS,
  WHY_SMART_CARE,
  COVERAGE_NOTE_INTRO,
  ONE_TIME_VS_MEMBERSHIP,
} from '../data/membershipPlans';
import MembershipPlanCard from '../components/membership/MembershipPlanCard';
import MembershipComparisonTable from '../components/membership/MembershipComparisonTable';
import MembershipFaq from '../components/membership/MembershipFaq';
import HeroIllustration from '../components/illustrations/HeroIllustration';

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

const WHY_SMART_CARE_ICONS = [
  SavingsOutlinedIcon,
  BoltOutlinedIcon,
  EventRepeatOutlinedIcon,
  TrackChangesIcon,
];

const WHATS_INCLUDED_ICONS = [
  KitchenOutlinedIcon,
  AcUnitOutlinedIcon,
  WaterDropOutlinedIcon,
  ElectricBoltOutlinedIcon,
  HomeOutlinedIcon,
  GarageOutlinedIcon,
  EventRepeatOutlinedIcon,
  BoltOutlinedIcon,
];

const sectionTitleSx = {
  fontFamily: fonts.heading,
  fontWeight: 800,
  fontSize: { xs: '1.65rem', md: '2rem' },
  color: colors.navy,
  mb: 1,
  letterSpacing: '-0.3px',
};

// 48px mobile / 72px desktop — consistent rhythm across all standard sections.
const sectionPy = { xs: 6, md: 9 };

const MembershipPage: React.FC = () => {
  const navigate = useNavigate();

  useSeo({
    title: 'Smart Care Membership | Smart Appliances',
    description: 'Book appliance care, HVAC, plumbing, electrical, smart home, garage door, and emergency services across MD, VA, WV, PA, DE, and Washington DC.',
    path: '/membership',
  });

  const plansRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);

  const scrollToPlans = () => {
    plansRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToComparison = () => {
    comparisonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
          py: { xs: 5, md: 7 },
          px: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 0.9fr' },
              alignItems: 'center',
              gap: { xs: 4, md: 7 },
            }}
          >
            {/* Left — copy */}
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <ShieldOutlinedIcon
                sx={{ fontSize: 36, color: colors.skyBlue, mb: 1.5, display: { xs: 'inline-block', md: 'block' } }}
              />
              <Typography
                component="h1"
                sx={{
                  fontFamily: fonts.heading,
                  fontWeight: 800,
                  fontSize: { xs: '1.8rem', md: '2.4rem' },
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
                  maxWidth: 520,
                  mx: { xs: 'auto', md: 0 },
                  mb: 2.5,
                }}
              >
                Priority scheduling, repair savings, seasonal reminders, and member-only service
                benefits for your appliances and home systems.
              </Typography>

              <Box
                component="ul"
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  mb: 3,
                  p: 0,
                  listStyle: 'none',
                }}
              >
                {TRUST_BADGES.map(({ label, icon: Icon }) => (
                  <Box component="li" key={label} sx={{ display: 'inline-flex' }}>
                    <Chip
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
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 1.5, justifyContent: { xs: 'center', md: 'flex-start' }, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={scrollToPlans}
                  sx={{ ...primaryButtonSx, px: 3.5, py: 1.25 }}
                >
                  Join Smart Care
                </Button>
                <Button
                  variant="outlined"
                  onClick={scrollToComparison}
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
                  Explore Plans
                </Button>
              </Box>
            </Box>

            {/* Right — hero image + benefits card, treated as one visual column */}
            <Box sx={{ width: '100%', maxWidth: { xs: 420, md: 460 }, mx: { xs: 'auto', md: 0 } }}>
              <Box sx={{ mb: 1.5, borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 48px rgba(0,0,0,0.24)', display: { xs: 'none', sm: 'block' } }}>
                <HeroIllustration variant="membership" title="Smart Care membership protecting a home with priority technician support" />
              </Box>
              <Box
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: '20px',
                  p: { xs: 3, md: 3.5 },
                  boxShadow: '0 20px 48px rgba(0,0,0,0.24)',
                }}
              >
                <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '1.1rem', color: colors.navy, mb: 2 }}>
                  Smart Care Benefits
                </Typography>
                <Box component="ul" sx={{ display: 'grid', gap: 1.5, m: 0, p: 0, listStyle: 'none' }}>
                  {HERO_BENEFITS.map((benefit) => (
                    <Box component="li" key={benefit} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <CheckCircleOutlineIcon sx={{ fontSize: 19, color: colors.primaryBlue, mt: '1px', flexShrink: 0 }} aria-hidden="true" />
                      <Typography sx={{ fontFamily: fonts.body, fontSize: '0.92rem', color: colors.darkText, lineHeight: 1.5 }}>
                        {benefit}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Why Smart Care */}
      <Box sx={{ py: sectionPy }}>
        <Container maxWidth="lg">
          <Typography component="h2" sx={{ ...sectionTitleSx, textAlign: 'center', mb: 4 }}>
            Why Smart Care?
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 2.5,
              alignItems: 'stretch',
            }}
          >
            {WHY_SMART_CARE.map((item, index) => {
              const Icon = WHY_SMART_CARE_ICONS[index] ?? ShieldOutlinedIcon;
              return (
                <Box
                  key={item.title}
                  sx={{
                    p: 2.5,
                    borderRadius: '16px',
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.border}`,
                    boxShadow: '0 4px 16px rgba(10, 37, 64, 0.05)',
                    height: '100%',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 10px 28px rgba(10, 37, 64, 0.1)' },
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      backgroundColor: colors.lightBlueBg,
                      color: colors.primaryBlue,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1.5,
                    }}
                  >
                    <Icon sx={{ fontSize: 22 }} />
                  </Box>
                  <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '0.98rem', color: colors.navy, mb: 0.5 }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ fontFamily: fonts.body, fontSize: '0.85rem', color: colors.mutedText, lineHeight: 1.55 }}>
                    {item.description}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* Plan cards */}
      <Box
        ref={plansRef}
        id="plans"
        sx={{
          pt: sectionPy,
          pb: sectionPy,
          backgroundColor: colors.sectionBg,
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
              mb: 5,
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
              gap: { xs: 3, md: 3 },
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
      <Box
        ref={comparisonRef}
        id="compare-plans"
        sx={{ py: sectionPy, backgroundColor: colors.surface, scrollMarginTop: { xs: '96px', md: '112px' } }}
      >
        <Container maxWidth="lg">
          <Typography component="h2" sx={{ ...sectionTitleSx, textAlign: 'center', mb: 3 }}>
            Compare Plans
          </Typography>
          <MembershipComparisonTable />
        </Container>
      </Box>

      {/* How it works */}
      <Box sx={{ py: sectionPy }}>
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
      <Box sx={{ py: sectionPy, backgroundColor: colors.sectionBg }}>
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
            {MEMBERSHIP_INCLUDED.map((item, index) => {
              const Icon = WHATS_INCLUDED_ICONS[index] ?? ShieldOutlinedIcon;
              return (
                <Box
                  key={item.title}
                  sx={{
                    p: 2.25,
                    borderRadius: '14px',
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.border}`,
                    boxShadow: '0 2px 8px rgba(10, 37, 64, 0.04)',
                    height: '100%',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(10, 37, 64, 0.08)' },
                  }}
                >
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: '10px',
                      backgroundColor: colors.lightBlueBg,
                      color: colors.primaryBlue,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1.25,
                    }}
                  >
                    <Icon sx={{ fontSize: 19 }} />
                  </Box>
                  <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '0.95rem', color: colors.navy, mb: 0.75 }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ fontFamily: fonts.body, fontSize: '0.84rem', color: colors.mutedText, lineHeight: 1.55 }}>
                    {item.description}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* Smart Care vs one-time service */}
      <Box sx={{ py: sectionPy }}>
        <Container maxWidth="md">
          <Typography component="h2" sx={{ ...sectionTitleSx, textAlign: 'center', mb: 4 }}>
            Smart Care vs. One-Time Service
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 2.5,
              alignItems: 'stretch',
            }}
          >
            <Box
              sx={{
                p: 3,
                borderRadius: '18px',
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`,
                height: '100%',
              }}
            >
              <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '1.05rem', color: colors.mutedText, mb: 2 }}>
                {ONE_TIME_VS_MEMBERSHIP.oneTime.title}
              </Typography>
              <Box sx={{ display: 'grid', gap: 1.25 }}>
                {ONE_TIME_VS_MEMBERSHIP.oneTime.items.map((item) => (
                  <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <RemoveCircleOutlineIcon sx={{ fontSize: 18, color: colors.mutedText, mt: '1px', flexShrink: 0 }} />
                    <Typography sx={{ fontFamily: fonts.body, fontSize: '0.9rem', color: colors.darkText }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box
              sx={{
                p: 3,
                borderRadius: '18px',
                backgroundColor: colors.surface,
                border: `2px solid ${colors.primaryBlue}`,
                boxShadow: '0 16px 36px rgba(26, 115, 232, 0.12)',
                height: '100%',
              }}
            >
              <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '1.05rem', color: colors.navy, mb: 2 }}>
                {ONE_TIME_VS_MEMBERSHIP.membership.title}
              </Typography>
              <Box sx={{ display: 'grid', gap: 1.25 }}>
                {ONE_TIME_VS_MEMBERSHIP.membership.items.map((item) => (
                  <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 18, color: colors.primaryBlue, mt: '1px', flexShrink: 0 }} />
                    <Typography sx={{ fontFamily: fonts.body, fontSize: '0.9rem', color: colors.darkText, fontWeight: 600 }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Coverage notes */}
      <Box sx={{ py: sectionPy, backgroundColor: colors.sectionBg }}>
        <Container maxWidth="md">
          <Box
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: '16px',
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <ReportProblemOutlinedIcon sx={{ fontSize: 22, color: '#B45309' }} />
              <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '1.05rem', color: colors.navy }}>
                Important Coverage Notes
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.9rem', color: colors.darkText, lineHeight: 1.6, mb: 1.5 }}>
              {COVERAGE_NOTE_INTRO}
            </Typography>
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
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
          </Box>
        </Container>
      </Box>

      {/* FAQ */}
      <Box sx={{ py: sectionPy, backgroundColor: colors.surface }}>
        <Container maxWidth="md">
          <Typography component="h2" sx={{ ...sectionTitleSx, textAlign: 'center', mb: 3 }}>
            Frequently Asked Questions
          </Typography>
          <MembershipFaq faqs={MEMBERSHIP_FAQS} />
        </Container>
      </Box>

      {/* Bottom CTA */}
      <Box
        sx={{
          py: { xs: 5, md: 7 },
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
              mb: 1.5,
            }}
          >
            Ready to save on future home services?
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.body,
              fontSize: '0.95rem',
              color: 'rgba(255,255,255,0.78)',
              lineHeight: 1.65,
              maxWidth: 480,
              mx: 'auto',
              mb: 3,
            }}
          >
            Join Smart Care today and get priority scheduling, member savings, and easy service tracking.
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
