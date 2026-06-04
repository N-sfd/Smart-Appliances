import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import BoltIcon from '@mui/icons-material/Bolt';
import DevicesIcon from '@mui/icons-material/Devices';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VerifiedIcon from '@mui/icons-material/Verified';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import EngineeringIcon from '@mui/icons-material/Engineering';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';

interface OfferItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface TrustItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const offerItems: OfferItem[] = [
  {
    icon: <BuildIcon sx={{ fontSize: 36, color: '#22B1FB' }} />,
    title: 'Appliance Repair',
    description:
      'Expert repair for all major appliances including refrigerators, washers, dryers, ovens, and more.',
  },
  {
    icon: <AcUnitIcon sx={{ fontSize: 36, color: '#22B1FB' }} />,
    title: 'HVAC Services',
    description: 'Heating and cooling repair, maintenance, and emergency HVAC support.',
  },
  {
    icon: <PlumbingIcon sx={{ fontSize: 36, color: '#22B1FB' }} />,
    title: 'Plumbing Support',
    description: 'Leak repair, drain cleaning, water heater service, and emergency plumbing.',
  },
  {
    icon: <BoltIcon sx={{ fontSize: 36, color: '#22B1FB' }} />,
    title: 'Electrical Services',
    description: 'Outlet repair, panel inspection, fixture installation, and electrical emergencies.',
  },
  {
    icon: <DevicesIcon sx={{ fontSize: 36, color: '#22B1FB' }} />,
    title: 'Smart Home Setup',
    description: 'Smart thermostat, security cameras, doorbells, and Wi-Fi device setup.',
  },
  {
    icon: <WarningAmberIcon sx={{ fontSize: 36, color: '#22B1FB' }} />,
    title: 'Emergency Service',
    description: 'Same-day emergency response available 24/7 for urgent home service needs.',
  },
];

const trustItems: TrustItem[] = [
  {
    icon: <VerifiedIcon sx={{ fontSize: 32, color: '#22B1FB' }} />,
    title: 'Transparent Pricing',
    description: 'Clear diagnostic fees and repair estimates before any work begins.',
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 32, color: '#22B1FB' }} />,
    title: '24/7 Emergency Support',
    description: 'Round-the-clock availability for urgent home service emergencies.',
  },
  {
    icon: <EngineeringIcon sx={{ fontSize: 32, color: '#22B1FB' }} />,
    title: 'Licensed Technicians',
    description: 'All technicians are licensed, insured, and background-checked professionals.',
  },
  {
    icon: <HomeRepairServiceIcon sx={{ fontSize: 32, color: '#22B1FB' }} />,
    title: 'Full Home Coverage',
    description: 'Appliances, HVAC, plumbing, electrical, and smart home — all covered.',
  },
];

const statCards = [
  { value: '5,000+', label: 'Repairs Completed' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '24/7', label: 'Emergency Support' },
  { value: '100%', label: 'Licensed & Insured' },
];

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      {/* ── Hero Banner ── */}
      <Box
        sx={{
          backgroundColor: '#022F49',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          px: 2,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="overline"
            sx={{
              color: '#22B1FB',
              fontFamily: 'DM Sans, Arial, sans-serif',
              fontWeight: 700,
              letterSpacing: 3,
              display: 'block',
              mb: 2,
              fontSize: '0.85rem',
            }}
          >
            About SmartAppliance
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontFamily: 'Wasted Vindey, Arial, sans-serif',
              fontWeight: 700,
              color: '#FFFFFF',
              fontSize: { xs: '2rem', sm: '2.8rem', md: '3.4rem' },
              lineHeight: 1.2,
              mb: 3,
            }}
          >
            Bringing Professional Home Service to Your Doorstep
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'DM Sans, Arial, sans-serif',
              color: '#A8D8F0',
              fontSize: { xs: '1rem', md: '1.15rem' },
              lineHeight: 1.8,
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            SmartAppliance helps customers book reliable appliance repair and home service support through a simple
            digital experience.
          </Typography>
        </Container>
      </Box>

      {/* ── Our Mission ── */}
      <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 8,
              alignItems: 'center',
            }}
          >
            {/* Left: mission text */}
            <Box>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: 'Wasted Vindey, Arial, sans-serif',
                  color: '#022F49',
                  mb: 3,
                  fontSize: { xs: '2rem', md: '2.6rem' },
                }}
              >
                Our Mission
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#555555', lineHeight: 1.9, mb: 2 }}
              >
                We make it easy for homeowners to get professional appliance repair and home service support without
                the hassle. Our platform collects the right information upfront so technicians arrive prepared,
                reducing delays and improving outcomes.
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#555555', lineHeight: 1.9 }}
              >
                Whether it's a refrigerator repair, HVAC emergency, plumbing issue, or smart home setup,
                SmartAppliance connects you with the right professional for the job.
              </Typography>
            </Box>

            {/* Right: 2x2 stat cards */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 2,
              }}
            >
              {statCards.map((stat) => (
                <Box
                  key={stat.label}
                  sx={{
                    backgroundColor: '#F5F7F9',
                    borderRadius: '16px',
                    p: 3,
                    textAlign: 'center',
                    border: '1px solid #E8E8E8',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'Wasted Vindey, Arial, sans-serif',
                      color: '#022F49',
                      fontSize: '2.2rem',
                      fontWeight: 700,
                      lineHeight: 1.2,
                      mb: 0.5,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#666666', fontSize: '0.88rem' }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── What We Offer ── */}
      <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#F5F7F9' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Wasted Vindey, Arial, sans-serif',
              color: '#022F49',
              textAlign: 'center',
              mb: 1,
            }}
          >
            What We Offer
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
            <Box sx={{ width: 60, height: 4, backgroundColor: '#22B1FB', borderRadius: 2 }} />
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {offerItems.map((item) => (
              <Card
                key={item.title}
                sx={{
                  borderRadius: '20px',
                  border: '1px solid #E5E5E5',
                  backgroundColor: '#FFFFFF',
                  boxShadow: 'none',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(2,47,73,0.1)',
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 2 }}>{item.icon}</Box>
                  <Typography
                    variant="h6"
                    sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#022F49', mb: 1.5 }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#555555', lineHeight: 1.8 }}
                  >
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Why Customers Trust Us ── */}
      <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Wasted Vindey, Arial, sans-serif',
              color: '#022F49',
              textAlign: 'center',
              mb: 1,
            }}
          >
            Why Customers Trust Us
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
            <Box sx={{ width: 60, height: 4, backgroundColor: '#22B1FB', borderRadius: 2 }} />
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 3,
            }}
          >
            {trustItems.map((item) => (
              <Box
                key={item.title}
                sx={{
                  textAlign: 'center',
                  p: 3,
                  borderRadius: '16px',
                  border: '1px solid #E8E8E8',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: '0 6px 20px rgba(2,47,73,0.08)' },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #E8F4FD 0%, #D0EEFF 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#022F49', mb: 1 }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#666666', lineHeight: 1.7 }}
                >
                  {item.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── CTA Banner ── */}
      <Box sx={{ backgroundColor: '#022F49', py: { xs: 8, md: 10 }, textAlign: 'center', px: 2 }}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Wasted Vindey, Arial, sans-serif',
              color: '#FFFFFF',
              mb: 4,
              fontSize: { xs: '2rem', md: '2.6rem' },
            }}
          >
            Ready to Book a Service?
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/book/regular')}
              sx={{
                backgroundColor: '#22B1FB',
                color: '#FFFFFF',
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontWeight: 700,
                px: 4,
                py: 1.75,
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': { backgroundColor: '#FFFFFF', color: '#022F49' },
              }}
            >
              Book Regular Service
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/book/emergency')}
              sx={{
                borderColor: '#FF6B6B',
                color: '#FF6B6B',
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontWeight: 700,
                px: 4,
                py: 1.75,
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': { backgroundColor: 'rgba(255,107,107,0.1)', borderColor: '#FF9999', color: '#FF9999' },
              }}
            >
              Request Emergency Service
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage;
