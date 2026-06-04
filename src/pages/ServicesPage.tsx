import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  commonIssues: string[];
  diagnosticFee: string;
  availability: 'Regular & Emergency' | 'Regular Only' | 'Emergency Only';
}

const services: ServiceCard[] = [
  {
    id: 'refrigerator-repair',
    title: 'Refrigerator Repair',
    description: 'Expert repair for all refrigerator makes and models. We diagnose and fix cooling, ice maker, and compressor issues.',
    commonIssues: ['Not cooling properly', 'Ice maker not working', 'Leaking water', 'Unusual noise'],
    diagnosticFee: '$79',
    availability: 'Regular & Emergency',
  },
  {
    id: 'washer-repair',
    title: 'Washer Repair',
    description: 'Front-load and top-load washer repair for all brands. We fix drainage, spin cycle, and error code issues.',
    commonIssues: ['Not draining', 'Not spinning', 'Leaking', 'Won\'t start'],
    diagnosticFee: '$69',
    availability: 'Regular & Emergency',
  },
  {
    id: 'dryer-repair',
    title: 'Dryer Repair',
    description: 'Gas and electric dryer repair. We address heating failures, tumbler issues, and airflow problems.',
    commonIssues: ['Not heating', 'Takes too long to dry', 'Tumbler not turning', 'Loud noise'],
    diagnosticFee: '$69',
    availability: 'Regular Only',
  },
  {
    id: 'dishwasher-repair',
    title: 'Dishwasher Repair',
    description: 'Full dishwasher diagnostics and repair. We fix cleaning performance, draining, and door latch issues.',
    commonIssues: ['Not cleaning dishes', 'Not draining', 'Door latch broken', 'Leaking'],
    diagnosticFee: '$79',
    availability: 'Regular Only',
  },
  {
    id: 'oven-stove-repair',
    title: 'Oven & Stove Repair',
    description: 'Gas and electric oven and stove repair. We handle heating elements, igniters, and temperature issues.',
    commonIssues: ['Not heating', 'Burner not igniting', 'Inaccurate temperature', 'Door not sealing'],
    diagnosticFee: '$79',
    availability: 'Regular Only',
  },
  {
    id: 'microwave-repair',
    title: 'Microwave Repair',
    description: 'Countertop and over-the-range microwave repair. We fix heating failures, door switches, and turntable issues.',
    commonIssues: ['Not heating', 'Sparking', 'Turntable not rotating', 'Display not working'],
    diagnosticFee: '$59',
    availability: 'Regular Only',
  },
  {
    id: 'hvac-support',
    title: 'HVAC Support',
    description: 'AC and heating repair, thermostat service, and seasonal maintenance for all HVAC systems.',
    commonIssues: ['No cooling or heating', 'Strange noises', 'High energy bills', 'Thermostat not responding'],
    diagnosticFee: '$89',
    availability: 'Regular & Emergency',
  },
  {
    id: 'plumbing-support',
    title: 'Plumbing Support',
    description: 'Leak repair, drain cleaning, water heater service, and emergency plumbing for all home systems.',
    commonIssues: ['Water leak', 'Clogged drain', 'Water heater issues', 'Running toilet'],
    diagnosticFee: '$89',
    availability: 'Regular & Emergency',
  },
  {
    id: 'electrical-support',
    title: 'Electrical Support',
    description: 'Outlet repair, panel inspection, fixture installation, and emergency electrical service.',
    commonIssues: ['Outlet not working', 'Circuit breaker tripping', 'Flickering lights', 'Burning smell'],
    diagnosticFee: '$89',
    availability: 'Regular & Emergency',
  },
  {
    id: 'emergency-repair',
    title: 'Emergency Repair',
    description: 'Same-day emergency response for urgent home appliance and system failures that cannot wait.',
    commonIssues: ['Major water leak', 'Burning smell or smoke', 'Complete appliance failure', 'No heat in extreme weather'],
    diagnosticFee: 'ASAP',
    availability: 'Emergency Only',
  },
];

const availabilityColor: Record<ServiceCard['availability'], string> = {
  'Regular & Emergency': '#E8F5E9',
  'Regular Only': '#E3F2FD',
  'Emergency Only': '#FFEBEE',
};

const availabilityTextColor: Record<ServiceCard['availability'], string> = {
  'Regular & Emergency': '#2E7D32',
  'Regular Only': '#1565C0',
  'Emergency Only': '#C62828',
};

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      {/* ── Hero ── */}
      <Box
        sx={{
          backgroundColor: '#022F49',
          py: { xs: 8, md: 10 },
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
            }}
          >
            Our Services
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontFamily: 'Wasted Vindey, Arial, sans-serif',
              fontWeight: 700,
              color: '#FFFFFF',
              fontSize: { xs: '2rem', sm: '2.6rem', md: '3rem' },
              mb: 2,
            }}
          >
            Professional Home Repair & Service
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'DM Sans, Arial, sans-serif',
              color: '#A8D8F0',
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.8,
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            From routine appliance repair to emergency home service, SmartAppliance has you covered.
          </Typography>
        </Container>
      </Box>

      {/* ── Service Cards ── */}
      <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: '#F5F7F9' }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {services.map((service) => (
              <Card
                key={service.id}
                sx={{
                  borderRadius: '20px',
                  border: '1px solid #E5E5E5',
                  backgroundColor: '#FFFFFF',
                  boxShadow: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(2,47,73,0.1)',
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  {/* Title row with diagnostic fee */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#022F49', flexGrow: 1, mr: 1 }}
                    >
                      {service.title}
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: service.availability === 'Emergency Only' ? '#FFEBEE' : '#E8F4FD',
                        borderRadius: '8px',
                        px: 1.25,
                        py: 0.5,
                        flexShrink: 0,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: 'DM Sans, Arial, sans-serif',
                          fontWeight: 700,
                          color: service.availability === 'Emergency Only' ? '#C62828' : '#022F49',
                          fontSize: '0.8rem',
                        }}
                      >
                        {service.diagnosticFee === 'ASAP' ? 'ASAP' : `from ${service.diagnosticFee}`}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Availability badge */}
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={service.availability}
                      size="small"
                      sx={{
                        backgroundColor: availabilityColor[service.availability],
                        color: availabilityTextColor[service.availability],
                        fontFamily: 'DM Sans, Arial, sans-serif',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#555555', lineHeight: 1.7, mb: 2 }}
                  >
                    {service.description}
                  </Typography>

                  {/* Common issues list */}
                  <Box sx={{ mb: 3, flexGrow: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: 'DM Sans, Arial, sans-serif',
                        color: '#888888',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        display: 'block',
                        mb: 1,
                      }}
                    >
                      Common Issues
                    </Typography>
                    {service.commonIssues.map((issue) => (
                      <Box key={issue} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                        <CheckCircleOutlineIcon sx={{ fontSize: 14, color: '#22B1FB', flexShrink: 0 }} />
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#444444', fontSize: '0.82rem' }}
                        >
                          {issue}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* CTA buttons */}
                  <Box sx={{ display: 'grid', gap: 1 }}>
                    {service.availability !== 'Emergency Only' && (
                      <Button
                        variant="contained"
                        onClick={() => navigate('/book/regular')}
                        sx={{
                          backgroundColor: '#22B1FB',
                          color: '#FFFFFF',
                          textTransform: 'none',
                          borderRadius: '10px',
                          fontFamily: 'DM Sans, Arial, sans-serif',
                          fontWeight: 600,
                          '&:hover': { backgroundColor: '#022F49' },
                        }}
                      >
                        Book Service
                      </Button>
                    )}
                    {service.availability !== 'Regular Only' && (
                      <Button
                        variant={service.availability === 'Emergency Only' ? 'contained' : 'outlined'}
                        onClick={() => navigate('/book/emergency')}
                        startIcon={<WarningAmberIcon />}
                        sx={
                          service.availability === 'Emergency Only'
                            ? {
                                backgroundColor: '#FF6B6B',
                                color: '#FFFFFF',
                                textTransform: 'none',
                                borderRadius: '10px',
                                fontFamily: 'DM Sans, Arial, sans-serif',
                                fontWeight: 600,
                                '&:hover': { backgroundColor: '#CC2200' },
                              }
                            : {
                                textTransform: 'none',
                                borderRadius: '10px',
                                borderColor: '#FF6B6B',
                                color: '#FF6B6B',
                                fontFamily: 'DM Sans, Arial, sans-serif',
                                fontWeight: 600,
                                '&:hover': { backgroundColor: '#FFF5F5', borderColor: '#CC2200', color: '#CC2200' },
                              }
                        }
                      >
                        Emergency Support
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Bottom CTA ── */}
      <Box sx={{ backgroundColor: '#022F49', py: { xs: 8, md: 10 }, textAlign: 'center', px: 2 }}>
        <Container maxWidth="md">
          <Typography
            variant="h3"
            sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#FFFFFF', mb: 2 }}
          >
            Not Sure Which Service You Need?
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#A8D8F0', mb: 4, lineHeight: 1.8 }}
          >
            Our team is ready to help diagnose the issue and recommend the right service. Contact us and we'll guide you through the process.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/contact')}
              sx={{
                backgroundColor: '#22B1FB',
                color: '#FFFFFF',
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: '10px',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#FFFFFF', color: '#022F49' },
              }}
            >
              Contact Us
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/book/emergency')}
              startIcon={<WarningAmberIcon />}
              sx={{
                borderColor: '#FF6B6B',
                color: '#FF6B6B',
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: '10px',
                textTransform: 'none',
                '&:hover': { backgroundColor: 'rgba(255,107,107,0.1)', borderColor: '#FF9999', color: '#FF9999' },
              }}
            >
              Emergency Service
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default ServicesPage;
