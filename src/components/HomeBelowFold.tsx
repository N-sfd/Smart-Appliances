import React, { useState, useMemo, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import EngineeringIcon from '@mui/icons-material/Engineering';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GppGoodIcon from '@mui/icons-material/GppGood';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import HandshakeIcon from '@mui/icons-material/Handshake';
import VerifiedIcon from '@mui/icons-material/Verified';
import { serviceCategories } from '../data/services';
import { popularServices } from '../data/popularServices';
import { SERVICE_TYPE_IMAGE_MAP, CATEGORY_IMAGE_MAP, DEFAULT_SERVICE_IMAGE } from '../data/serviceImages';
import { colors, fonts } from '../theme';
import { BRAND_LOGO_SLOT_WIDTH, BRAND_LOGO_SLOT_HEIGHT, BRAND_LOGO_DISPLAY_WIDTH, BRAND_LOGO_DISPLAY_HEIGHT, SERVICE_CARD_IMAGE_WIDTH, SERVICE_CARD_IMAGE_HEIGHT } from '../constants/imageDimensions';
import StableImage from './StableImage';
import ServiceCategoryTabs, { ServiceCategoryTab } from './ServiceCategoryTabs';
import ServiceGridCard from './ServiceGridCard';
import {
  normalizeZipInput,
  validateZipCode,
  getZipFieldHelperText,
  isZipFieldError,
  serviceAreaNeighborhoods,
  SERVICE_AREA_REGION_LABEL,
} from '../data/serviceAreas';
import {
  tabCategoryMap,
  SERVICE_DETAIL_EXT,
  howItWorks,
  faqs,
  serviceCoverageItems,
  majorBrands,
} from '../data/homePageData';

const SiteFooter = lazy(() => import('./SiteFooter'));
const ServiceAreaMap = lazy(() => import('./ServiceAreaMap'));

const trustItems = [
  { icon: <GppGoodIcon sx={{ fontSize: 28, color: colors.primaryBlue }} />, title: 'Licensed & Insured', description: 'All technicians are licensed, insured, and background-checked for your peace of mind.' },
  { icon: <ScheduleIcon sx={{ fontSize: 28, color: colors.primaryBlue }} />, title: 'Same-Day Availability', description: 'Priority scheduling for urgent but non-emergency issues when availability allows.' },
  { icon: <AssignmentTurnedInIcon sx={{ fontSize: 28, color: colors.primaryBlue }} />, title: 'Transparent Pricing', description: 'Technician explains the issue and estimated cost before any repair begins.' },
  { icon: <HomeRepairServiceIcon sx={{ fontSize: 28, color: colors.primaryBlue }} />, title: 'Service Warranty', description: 'Work is backed by a service quality commitment — we stand behind every repair.' },
  { icon: <EngineeringIcon sx={{ fontSize: 28, color: colors.primaryBlue }} />, title: 'Certified Technicians', description: 'Every technician passes a thorough background check before working in your home.' },
  { icon: <HandshakeIcon sx={{ fontSize: 28, color: colors.primaryBlue }} />, title: 'Satisfaction-Focused', description: 'We do not consider a job done until you are satisfied with the work and service.' },
];

const HomeBelowFold: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<ServiceCategoryTab>('Appliances');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);
  const [areaZip, setAreaZip] = useState('');
  const [areaZipTouched, setAreaZipTouched] = useState(false);

  const handleServiceSelect = (id: string) => {
    setSelectedServiceId(id);
    setTimeout(() => document.getElementById('service-detail-panel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
  };

  const handleCategoryChange = (cat: ServiceCategoryTab) => {
    setActiveCategory(cat);
    setSelectedServiceId(null);
  };

  const nonPopularCategories = useMemo(() => {
    const catIds = tabCategoryMap[activeCategory] ?? [];
    return serviceCategories.filter((c) => catIds.includes(c.id));
  }, [activeCategory]);

  const selectedDetail = useMemo(() => {
    if (!selectedServiceId) return null;
    const popular = popularServices.find((s) => s.id === selectedServiceId);
    const imgInfo = SERVICE_TYPE_IMAGE_MAP[selectedServiceId] ?? DEFAULT_SERVICE_IMAGE;
    const ext = SERVICE_DETAIL_EXT[selectedServiceId];
    if (popular) {
      return {
        title: popular.label,
        description: popular.description,
        image: popular.image,
        issues: popular.chips,
        hasEmergency: ext?.hasEmergency ?? false,
      };
    }
    if (imgInfo && ext) {
      return {
        title: imgInfo.title,
        description: imgInfo.desc,
        image: imgInfo.image,
        issues: ext.issues ?? [],
        hasEmergency: ext.hasEmergency,
      };
    }
    return null;
  }, [selectedServiceId]);

  const areaZipValidation = validateZipCode(areaZip);
  const areaZipInCoverage = areaZipValidation.isInServiceArea;

  const handleAreaZipCheck = () => {
    setAreaZipTouched(true);
    if (!areaZipValidation.isValid) return;
    navigate(`/scheduler?${new URLSearchParams({ zipCode: areaZip }).toString()}`);
  };

  const handleContactSubmit = () => {
    if (contactName && contactEmail && contactMessage) setContactSent(true);
  };

  return (
    <>
      {/* ── What Needs Service? ── */}
      <Box className="home-deferred-section" id="services" sx={{ py: { xs: 7, md: 10 }, backgroundColor: colors.surface }}>
        <Container
          maxWidth={false}
          sx={{
            maxWidth: '1180px',
            mx: 'auto',
            px: { xs: 2, sm: 3 },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              color: colors.navy,
              textAlign: 'center',
              fontSize: { xs: '1.875rem', md: '2.625rem' },
              mb: 1.5,
            }}
          >
            What Needs Service?
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.body,
              color: '#64748B',
              textAlign: 'center',
              mb: { xs: 3, md: 3.5 },
              fontSize: '1rem',
              lineHeight: 1.65,
              maxWidth: 680,
              mx: 'auto',
            }}
          >
            Choose a service to see repair details, common issues, and booking options.
          </Typography>

          <ServiceCategoryTabs
            activeCategory={activeCategory}
            onChange={handleCategoryChange}
          />

          {/* Appliances tab: image-based cards */}
          {activeCategory === 'Appliances' && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: '28px',
              }}
            >
              {popularServices.map((service) => (
                <Card
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  sx={{
                    borderRadius: '18px',
                    border: `1px solid ${colors.border}`,
                    boxShadow: colors.cardShadow,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    transition: 'all 0.22s ease',
                    '&:hover': {
                      boxShadow: '0 22px 48px rgba(10, 37, 64, 0.16)',
                      transform: 'translateY(-4px)',
                      borderColor: colors.primaryBlue,
                    },
                  }}
                >
                  {/* Image area */}
                  <Box
                    sx={{
                      backgroundColor: service.imageBg,
                      height: '180px',
                      position: 'relative',
                    }}
                  >
                    <Box
                      component="img"
                      src={service.image}
                      alt={service.label}
                      width={SERVICE_CARD_IMAGE_WIDTH}
                      height={SERVICE_CARD_IMAGE_HEIGHT}
                      loading="lazy"
                      decoding="async"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </Box>
                  {/* Text area */}
                  <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          color: '#0B3D91',
                          mb: 0.25,
                        }}
                      >
                        {service.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                          fontSize: '0.78rem',
                          color: '#1A1A1A',
                        }}
                      >
                        {service.subtitle}
                      </Typography>
                    </Box>
                    <ArrowForwardIcon sx={{ color: '#AAAAAA', fontSize: 20, flexShrink: 0, ml: 1 }} />
                  </Box>
                </Card>
              ))}
            </Box>
          )}

          {/* Other tabs: image-top service cards */}
          {activeCategory !== 'Appliances' && (
            <Box
              sx={{
                maxWidth: ['HVAC', 'Plumbing', 'Electrical'].includes(activeCategory) ? 992 : 1100,
                mx: 'auto',
                width: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, minmax(0, 1fr))',
                    md: 'repeat(3, minmax(0, 1fr))',
                  },
                  gap: { xs: 2, sm: 2.25, md: 2.5 },
                }}
              >
                {nonPopularCategories.flatMap((cat) =>
                  cat.services.slice(0, 6).map((s) => {
                    const imgInfo = SERVICE_TYPE_IMAGE_MAP[s.id] ?? CATEGORY_IMAGE_MAP[cat.id] ?? DEFAULT_SERVICE_IMAGE;
                    return (
                      <ServiceGridCard
                        key={s.id}
                        title={imgInfo.title}
                        subtitle={s.cardSubtitle ?? cat.title}
                        image={imgInfo.image}
                        onClick={() => handleServiceSelect(s.id)}
                      />
                    );
                  }),
                )}
              </Box>
            </Box>
          )}

          {/* Selected service detail panel */}
          {selectedDetail && (
            <Box
              id="service-detail-panel"
              sx={{
                mt: 4,
                borderRadius: '24px',
                border: '1px solid #D0E3FF',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(10,37,64,0.10)',
                backgroundColor: '#FFFFFF',
              }}
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '380px 1fr' }, minHeight: 280 }}>
                {/* Image */}
                <Box sx={{ height: { xs: 220, md: '100%' }, minHeight: { md: 280 }, overflow: 'hidden' }}>
                  <Box
                    component="img"
                    src={selectedDetail.image}
                    alt={selectedDetail.title}
                    width={380}
                    height={280}
                    loading="lazy"
                    decoding="async"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </Box>
                {/* Info */}
                <Box sx={{ p: { xs: 3, md: 4.5 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: { xs: '1.35rem', md: '1.65rem' }, color: '#0B3D91', mb: 1.5, lineHeight: 1.2 }}>
                    {selectedDetail.title}
                  </Typography>
                  <Typography sx={{ fontFamily: fonts.body, color: '#475569', lineHeight: 1.8, fontSize: '0.95rem', mb: 2.5 }}>
                    {selectedDetail.description}
                  </Typography>
                  {selectedDetail.issues.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2.5 }}>
                      {selectedDetail.issues.map((issue) => (
                        <Chip
                          key={issue}
                          label={issue}
                          size="small"
                          sx={{
                            backgroundColor: '#F0F4FF',
                            color: '#1A73E8',
                            border: '1px solid #D0E3FF',
                            fontFamily: fonts.body,
                            fontWeight: 600,
                            fontSize: '0.8rem',
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 3 }}>
                    <VerifiedIcon sx={{ fontSize: 15, color: '#1A73E8' }} />
                    <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>
                      Transparent quote before work begins
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/book/regular', { state: { serviceType: selectedServiceId } })}
                      sx={{
                        backgroundColor: '#1A73E8',
                        color: '#FFFFFF',
                        fontFamily: fonts.body,
                        fontWeight: 700,
                        textTransform: 'none',
                        borderRadius: '10px',
                        px: 3.5,
                        py: 1.3,
                        '&:hover': { backgroundColor: '#0B3D91' },
                      }}
                    >
                      Schedule Service
                    </Button>
                    {selectedDetail.hasEmergency && (
                      <Button
                        variant="outlined"
                        startIcon={<WarningAmberIcon />}
                        onClick={() => navigate('/emergency-service')}
                        sx={{
                          borderColor: '#EF4444',
                          color: '#EF4444',
                          fontFamily: fonts.body,
                          fontWeight: 700,
                          textTransform: 'none',
                          borderRadius: '10px',
                          px: 3,
                          py: 1.3,
                          '&:hover': { backgroundColor: '#FFF5F5', borderColor: '#EA580C', color: '#EA580C' },
                        }}
                      >
                        Emergency Service
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

        </Container>
      </Box>

      {/* ── Booking Options ── */}
      <Box sx={{ py: { xs: 7, md: 9 }, backgroundColor: '#F5F7FA' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              color: colors.navy,
              textAlign: 'center',
              fontSize: { xs: '1.75rem', md: '2.1rem' },
              mb: 1,
              letterSpacing: '-0.3px',
            }}
          >
            Choose how you want to book
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, textAlign: 'center', mb: 6, fontSize: '1rem' }}>
            Select the option that fits your situation.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'center',
              gap: { xs: 2.5, md: '28px' },
              alignItems: { xs: 'center', md: 'stretch' },
            }}
          >
            {/* Standard Appointment */}
            <Card
              sx={{
                maxWidth: 340,
                width: '100%',
                borderRadius: '22px',
                border: '1px solid #E4E7EB',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 2px 12px rgba(10, 37, 64, 0.04)',
                transition: 'box-shadow 0.22s ease, transform 0.22s ease',
                '&:hover': { boxShadow: '0 12px 32px rgba(11,94,215,0.14)', transform: 'translateY(-3px)' },
              }}
            >
              <Box sx={{ p: '28px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '14px',
                    backgroundColor: '#EAF5FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <CalendarMonthIcon sx={{ color: '#1A73E8', fontSize: 28 }} />
                </Box>
                <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '1.12rem', color: colors.navy, mb: 1.5 }}>
                  Standard Appointment
                </Typography>
                <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none', flexGrow: 1, mb: 3 }}>
                  {['Best for routine repair and installation.', 'Available in 1–3 days.'].map((line) => (
                    <Box component="li" key={line} sx={{ display: 'flex', gap: 1.25, mb: 1.1, '&:last-of-type': { mb: 0 } }}>
                      <Box component="span" sx={{ color: '#1A73E8', fontWeight: 700, lineHeight: 1.6, flexShrink: 0 }}>•</Box>
                      <Typography sx={{ fontFamily: fonts.body, fontSize: '0.94rem', color: colors.darkText, lineHeight: 1.6 }}>
                        {line}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/book/regular')}
                  sx={{
                    backgroundColor: '#1A73E8',
                    color: '#FFFFFF',
                    fontFamily: fonts.body,
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: '10px',
                    py: 1.25,
                    '&:hover': { backgroundColor: '#0B3D91' },
                  }}
                >
                  Schedule
                </Button>
              </Box>
            </Card>

            {/* Same-Day Service */}
            <Card
              sx={{
                maxWidth: 340,
                width: '100%',
                borderRadius: '22px',
                border: '1px solid #E4E7EB',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 2px 12px rgba(10, 37, 64, 0.04)',
                transition: 'box-shadow 0.22s ease, transform 0.22s ease',
                '&:hover': { boxShadow: '0 12px 32px rgba(139,92,246,0.14)', transform: 'translateY(-3px)' },
              }}
            >
              <Box sx={{ p: '28px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '14px',
                    backgroundColor: '#F3F0FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <FlashOnIcon sx={{ color: '#8B5CF6', fontSize: 28 }} />
                </Box>
                <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '1.12rem', color: colors.navy, mb: 1.5 }}>
                  Same-Day Service
                </Typography>
                <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none', flexGrow: 1, mb: 3 }}>
                  {['Priority scheduling for urgent non-emergency issues.', 'Availability may vary.'].map((line) => (
                    <Box component="li" key={line} sx={{ display: 'flex', gap: 1.25, mb: 1.1, '&:last-of-type': { mb: 0 } }}>
                      <Box component="span" sx={{ color: '#8B5CF6', fontWeight: 700, lineHeight: 1.6, flexShrink: 0 }}>•</Box>
                      <Typography sx={{ fontFamily: fonts.body, fontSize: '0.94rem', color: colors.darkText, lineHeight: 1.6 }}>
                        {line}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/book/regular', { state: { sameDayRequested: true } })}
                  sx={{
                    backgroundColor: '#8B5CF6',
                    color: '#FFFFFF',
                    fontFamily: fonts.body,
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: '10px',
                    py: 1.25,
                    '&:hover': { backgroundColor: '#7C3AED' },
                  }}
                >
                  Check Availability
                </Button>
              </Box>
            </Card>

            {/* Emergency Priority */}
            <Card
              sx={{
                maxWidth: 340,
                width: '100%',
                borderRadius: '22px',
                border: '1px solid #FECDD3',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 2px 12px rgba(10, 37, 64, 0.04)',
                transition: 'box-shadow 0.22s ease, transform 0.22s ease',
                '&:hover': { boxShadow: '0 12px 32px rgba(239,68,68,0.12)', transform: 'translateY(-3px)' },
              }}
            >
              <Box sx={{ p: '28px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '14px',
                    backgroundColor: '#FFF5F5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <WarningAmberIcon sx={{ color: '#EF4444', fontSize: 28 }} />
                </Box>
                <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '1.12rem', color: colors.navy, mb: 1.5 }}>
                  Emergency Priority
                </Typography>
                <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none', flexGrow: 1, mb: 3 }}>
                  {['For urgent breakdowns or safety-related issues.', 'Call 911 first for gas, smoke, or fire.'].map((line) => (
                    <Box component="li" key={line} sx={{ display: 'flex', gap: 1.25, mb: 1.1, '&:last-of-type': { mb: 0 } }}>
                      <Box component="span" sx={{ color: '#EF4444', fontWeight: 700, lineHeight: 1.6, flexShrink: 0 }}>•</Box>
                      <Typography sx={{ fontFamily: fonts.body, fontSize: '0.94rem', color: colors.darkText, lineHeight: 1.6 }}>
                        {line}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/emergency-service')}
                  sx={{
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    fontFamily: fonts.body,
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: '10px',
                    py: 1.25,
                    '&:hover': { backgroundColor: '#DC2626' },
                  }}
                >
                  Emergency Service
                </Button>
              </Box>
            </Card>
          </Box>

          {/* Safety note */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: '#94A3B8', textAlign: 'center' }}>
              For gas leaks, smoke, fire, or life-safety emergencies — call{' '}
              <Box component="span" sx={{ fontWeight: 700, color: '#EF4444' }}>911</Box>{' '}
              immediately.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ── Trust Section ── */}
      <Box className="home-deferred-section" id="why-choose-us" sx={{ py: { xs: 7, md: 9 }, backgroundColor: '#FFFFFF', scrollMarginTop: '80px' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
              fontWeight: 800,
              color: '#0B3D91',
              textAlign: 'center',
              fontSize: { xs: '1.8rem', md: '2.1rem' },
              mb: 1,
              letterSpacing: '-0.3px',
            }}
          >
            Why customers choose Smart Appliances
          </Typography>
          <Box sx={{ width: 56, height: 4, borderRadius: '2px', background: 'linear-gradient(90deg, #1A73E8, #4FC3F7)', mx: 'auto', mt: 1.5, mb: { xs: 4, md: 5 } }} />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: { xs: 2.5, md: '28px' },
            }}
          >
            {trustItems.map((item) => (
              <Box
                key={item.title}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: '16px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E4E7EB',
                  borderRadius: '18px',
                  p: '24px',
                  boxShadow: '0 2px 10px rgba(10, 37, 64, 0.04)',
                  transition: 'box-shadow 0.22s ease, transform 0.22s ease',
                  '&:hover': {
                    boxShadow: '0 10px 28px rgba(11,94,215,0.10)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    flexShrink: 0,
                    borderRadius: '12px',
                    backgroundColor: '#EAF5FF',
                    border: '1px solid #D6E8FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: '#0B3D91',
                      mb: 0.5,
                      lineHeight: 1.3,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                      fontSize: '0.84rem',
                      color: '#4B5563',
                      lineHeight: 1.65,
                      m: 0,
                    }}
                  >
                    {item.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── How It Works ── */}
      <Box sx={{ py: { xs: 7, md: 9 }, backgroundColor: '#F5F7FA' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
              fontWeight: 800,
              color: '#0B3D91',
              textAlign: 'center',
              fontSize: { xs: '1.8rem', md: '2.1rem' },
              mb: 1,
              letterSpacing: '-0.3px',
            }}
          >
            How It Works
          </Typography>
          <Box sx={{ width: 56, height: 4, borderRadius: '2px', background: 'linear-gradient(90deg, #1A73E8, #4FC3F7)', mx: 'auto', mt: 1.5, mb: 6 }} />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 3,
            }}
          >
            {howItWorks.map((item) => (
              <Box
                key={item.step}
                sx={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: '1px solid #E4E7EB',
                  p: 3,
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: '#1A73E8',
                    boxShadow: '0 4px 14px rgba(11,94,215,0.38)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Typography sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: '1rem', fontFamily: "'Inter', 'DM Sans', Arial, sans-serif" }}>
                    {item.step}
                  </Typography>
                </Box>
                <Typography sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#0B3D91', mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", fontSize: '0.85rem', color: '#1A1A1A', lineHeight: 1.75 }}>
                  {item.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Brands Section ── */}
      <Box className="home-deferred-section" id="brands" sx={{ py: { xs: 7, md: 9 }, backgroundColor: '#F8FAFC', scrollMarginTop: '80px' }}>
        <Container maxWidth="lg">
          {/* Section header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="Certified Service"
              size="small"
              sx={{
                backgroundColor: colors.lightBlueBg,
                color: colors.primaryBlue,
                fontFamily: fonts.body,
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.5px',
                mb: 2,
                px: 1,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontFamily: fonts.heading,
                fontWeight: 800,
                fontSize: { xs: '1.75rem', md: '2.1rem' },
                color: colors.navy,
                letterSpacing: '-0.3px',
                mb: 1.5,
              }}
            >
              We Service All Major Appliance Brands
            </Typography>
            <Typography
              sx={{
                fontFamily: fonts.body,
                fontSize: { xs: '0.95rem', md: '1rem' },
                color: colors.mutedText,
                maxWidth: 540,
                mx: 'auto',
                lineHeight: 1.75,
              }}
            >
              Our certified technicians are trained to diagnose and repair appliances from the industry's most trusted brands.
            </Typography>
          </Box>

          {/* Brand marquee — white card strip */}
          <Box
            sx={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #E4E7EB',
              boxShadow: '0 4px 20px rgba(10, 37, 64, 0.06)',
              position: 'relative',
              overflow: 'hidden',
              py: { xs: 2.5, md: 3 },
              '&::before, &::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: { xs: 48, md: 100 },
                zIndex: 1,
                pointerEvents: 'none',
              },
              '&::before': {
                left: 0,
                background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(255,255,255,0.9) 45%, transparent 100%)',
              },
              '&::after': {
                right: 0,
                background: 'linear-gradient(270deg, #FFFFFF 0%, rgba(255,255,255,0.9) 45%, transparent 100%)',
              },
            }}
          >
            <Box className="brand-marquee-track" sx={{ gap: { xs: 5, md: 7 }, alignItems: 'center' }}>
              {[...majorBrands, ...majorBrands].map((brand, index) => (
                <Box
                  key={`${brand.name}-${index}`}
                  sx={{
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: { xs: 1, md: 1.5 },
                  }}
                >
                  <StableImage
                    src={brand.logo}
                    alt={`${brand.name} appliance repair`}
                    intrinsicWidth={BRAND_LOGO_SLOT_WIDTH}
                    intrinsicHeight={BRAND_LOGO_SLOT_HEIGHT}
                    displayWidth={BRAND_LOGO_DISPLAY_WIDTH}
                    displayHeight={BRAND_LOGO_DISPLAY_HEIGHT}
                    sx={{
                      opacity: 0.65,
                      transition: 'opacity 0.25s ease, transform 0.25s ease',
                      '&:hover': {
                        opacity: 1,
                        transform: 'scale(1.06)',
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Bottom trust note */}
          <Box
            sx={{
              mt: 5,
              pt: 4,
              borderTop: `1px solid ${colors.border}`,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: { xs: 2, md: 4 },
            }}
          >
            {['All brands serviced', 'OEM parts used', 'Warranty on repairs', 'Same-day availability'].map((note) => (
              <Box key={note} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 15, color: colors.primaryBlue }} />
                <Typography sx={{ fontFamily: fonts.body, fontSize: '0.84rem', fontWeight: 600, color: colors.darkText }}>
                  {note}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── FAQ ── */}
      <Box id="faqs" sx={{ py: { xs: 7, md: 9 }, backgroundColor: '#FFFFFF', scrollMarginTop: '80px' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
              fontWeight: 800,
              color: '#0B3D91',
              textAlign: 'center',
              fontSize: { xs: '1.8rem', md: '2.1rem' },
              mb: 1,
              letterSpacing: '-0.3px',
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
            <Box sx={{ width: 56, height: 4, backgroundColor: '#1A73E8', borderRadius: 2, mt: 1.5 }} />
          </Box>
          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            {faqs.map((faq) => (
              <Accordion
                key={faq.question}
                disableGutters
                elevation={0}
                TransitionProps={{ unmountOnExit: true, mountOnEnter: true }}
                sx={{
                  border: '1px solid #E4E7EB',
                  borderRadius: '12px !important',
                  mb: 1.5,
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { boxShadow: '0 4px 16px rgba(11,37,69,0.08)' },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#1A73E8' }} />}
                  sx={{ px: 3, '& .MuiAccordionSummary-content': { my: 1.75 } }}
                >
                  <Typography sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#0B3D91', fontWeight: 600, fontSize: '0.95rem' }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 2.5 }}>
                  <Typography sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#1A1A1A', lineHeight: 1.8, fontSize: '0.88rem' }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Service Areas ── */}
      <Box className="home-deferred-section" id="service-areas" sx={{ py: { xs: 7, md: 9 }, backgroundColor: '#F5F7FA', scrollMarginTop: '80px' }}>
        <Container
          maxWidth={false}
          sx={{ maxWidth: '1180px', mx: 'auto', px: { xs: 2, sm: 3 } }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '55% 45%' },
              gap: { xs: 3, md: '28px' },
              alignItems: 'stretch',
            }}
          >
            {/* Left — ZIP checker + neighborhoods */}
            <Box
              sx={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E4E7EB',
                borderRadius: '24px',
                boxShadow: '0 18px 40px rgba(10, 37, 64, 0.08)',
                p: { xs: '28px', md: '32px' },
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontFamily: fonts.heading,
                  fontWeight: 800,
                  color: '#0B3D91',
                  fontSize: { xs: '1.65rem', md: '1.9rem' },
                  mb: 1.25,
                  letterSpacing: '-0.3px',
                }}
              >
                Service Areas
              </Typography>
              <Typography
                sx={{
                  fontFamily: fonts.body,
                  color: colors.darkText,
                  fontSize: { xs: '0.94rem', md: '1rem' },
                  lineHeight: 1.75,
                  mb: 3,
                }}
              >
                We provide appliance repair, installation, HVAC, plumbing, and urgent service across {SERVICE_AREA_REGION_LABEL}. Enter your ZIP code to check availability in your area.
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 1.5,
                  mb: 3,
                }}
              >
                <TextField
                  placeholder="Enter your ZIP code"
                  value={areaZip}
                  onChange={(e) => {
                    setAreaZip(normalizeZipInput(e.target.value));
                    setAreaZipTouched(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAreaZipCheck();
                  }}
                  fullWidth
                  error={isZipFieldError(areaZip, areaZipTouched)}
                  helperText={getZipFieldHelperText(areaZip, areaZipTouched) || ' '}
                  inputProps={{ inputMode: 'numeric', maxLength: 5 }}
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      height: '52px',
                      borderRadius: '14px',
                      fontFamily: fonts.body,
                      fontSize: '1rem',
                      backgroundColor: '#FFFFFF',
                      '& fieldset': { borderColor: '#E4E7EB' },
                      '&:hover fieldset': { borderColor: '#1A73E8' },
                      '&.Mui-focused fieldset': { borderColor: '#1A73E8' },
                    },
                    '& .MuiFormHelperText-root': { mx: 0, mt: 0.75 },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleAreaZipCheck}
                  sx={{
                    height: '52px',
                    minWidth: { xs: '100%', sm: 180 },
                    flexShrink: 0,
                    backgroundColor: '#1A73E8',
                    color: '#FFFFFF',
                    fontFamily: fonts.body,
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    textTransform: 'none',
                    borderRadius: '14px',
                    px: 3,
                    boxShadow: '0 8px 24px rgba(26, 115, 232, 0.22)',
                    '&:hover': { backgroundColor: '#0B3D91' },
                  }}
                >
                  Check Availability
                </Button>
              </Box>

              {areaZipTouched && areaZipValidation.isValid && areaZipInCoverage && (
                <Typography
                  sx={{
                    fontFamily: fonts.body,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#15803D',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                  }}
                >
                  <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />
                  Great news — we service {areaZip}.
                </Typography>
              )}

              {areaZipTouched && areaZipValidation.isValidFormat && !areaZipInCoverage && (
                <Typography
                  sx={{
                    fontFamily: fonts.body,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: colors.emergency,
                    mb: 2,
                  }}
                >
                  We don&apos;t currently service ZIP {areaZip}. Call (571) 276-4808 to check nearby options.
                </Typography>
              )}

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
                {serviceAreaNeighborhoods.map((area) => (
                  <Box
                    key={area}
                    component="span"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D0E3FF',
                      color: '#0B3D91',
                      borderRadius: '999px',
                      px: '14px',
                      py: '8px',
                      fontFamily: fonts.body,
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      lineHeight: 1,
                      transition: 'background-color 0.2s ease, border-color 0.2s ease',
                      '&:hover': {
                        backgroundColor: '#E8F1FF',
                        borderColor: '#1A73E8',
                      },
                    }}
                  >
                    {area}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Right — service coverage card */}
            <Box
              sx={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E4E7EB',
                borderRadius: '24px',
                boxShadow: '0 18px 40px rgba(10, 37, 64, 0.08)',
                p: { xs: '28px', md: '32px' },
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                sx={{
                  fontFamily: fonts.heading,
                  fontWeight: 800,
                  color: '#0B3D91',
                  fontSize: { xs: '1.25rem', md: '1.35rem' },
                  mb: 2.5,
                }}
              >
                Service Coverage
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3, flexGrow: 1 }}>
                {serviceCoverageItems.map((item) => (
                  <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 18, color: '#1A73E8', flexShrink: 0 }} />
                    <Typography
                      sx={{
                        fontFamily: fonts.body,
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        color: colors.darkText,
                        textTransform: 'capitalize',
                      }}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Suspense fallback={<Box sx={{ height: { xs: 220, md: 280 } }} aria-hidden />}>
                <ServiceAreaMap height={{ xs: 220, md: 280 }} />
              </Suspense>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── Get In Touch With Us ── */}
      <Box id="contact" sx={{ py: { xs: 7, md: 9 }, backgroundColor: colors.surface, scrollMarginTop: '80px' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontFamily: fonts.heading,
                fontWeight: 800,
                color: colors.navy,
                fontSize: { xs: '1.8rem', md: '2.25rem' },
                mb: 1.5,
                letterSpacing: '-0.3px',
              }}
            >
              Get In Touch With Us
            </Typography>
            <Typography
              sx={{
                fontFamily: fonts.body,
                color: colors.darkText,
                fontSize: { xs: '1rem', md: '1.05rem' },
                maxWidth: 680,
                mx: 'auto',
                lineHeight: 1.75,
              }}
            >
              Need reliable appliance repair, installation, or urgent service? Contact our team today.
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 6 }}>
            <Box>
              <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '1.15rem', color: colors.navy, mb: 3 }}>
                Contact Information
              </Typography>
              {[
                { icon: <PhoneIcon sx={{ color: '#1A73E8', fontSize: 20 }} />, label: 'Phone', value: '+1 (555) 123-4567' },
                { icon: <EmailIcon sx={{ color: '#1A73E8', fontSize: 20 }} />, label: 'Email', value: 'service@smartappliance.com' },
                { icon: <LocationOnIcon sx={{ color: '#1A73E8', fontSize: 20 }} />, label: 'Address', value: '123 Main St, Anytown, USA 00000' },
              ].map((item) => (
                <Box key={item.label} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2.5 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: '#E8F1FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", fontWeight: 700, fontSize: '0.85rem', color: '#0B3D91' }}>
                      {item.label}
                    </Typography>
                    <Typography sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#1A1A1A', fontSize: '0.85rem', mt: 0.25 }}>
                      {item.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
              <Box sx={{ backgroundColor: '#F5F7FA', borderRadius: '14px', border: '1px solid #E4E7EB', p: 2.5, mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <AccessTimeIcon sx={{ color: '#1A73E8', fontSize: 18 }} />
                  <Typography sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", fontWeight: 700, fontSize: '0.88rem', color: '#0B3D91' }}>
                    Service Hours
                  </Typography>
                </Box>
                {[
                  { day: 'Monday – Friday', hours: '8:00 AM – 6:00 PM' },
                  { day: 'Saturday', hours: '9:00 AM – 4:00 PM' },
                  { day: 'Sunday', hours: 'Closed (Emergency Only)' },
                ].map((row) => (
                  <Box key={row.day} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}>
                    <Typography sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#1A1A1A', fontSize: '0.82rem' }}>{row.day}</Typography>
                    <Typography sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#0B3D91', fontWeight: 600, fontSize: '0.82rem' }}>{row.hours}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box>
              <Typography sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", fontWeight: 700, fontSize: '1.15rem', color: '#0B3D91', mb: 3 }}>
                Send Us a Message
              </Typography>
              {contactSent ? (
                <Box sx={{ backgroundColor: '#E8F5E9', border: '1px solid #A5D6A7', borderRadius: '14px', p: 4, textAlign: 'center' }}>
                  <CheckCircleOutlineIcon sx={{ color: '#2E7D32', fontSize: 48, mb: 2 }} />
                  <Typography sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", fontWeight: 700, color: '#2E7D32', mb: 1 }}>
                    Message Sent!
                  </Typography>
                  <Typography sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#388E3C', fontSize: '0.9rem' }}>
                    Thank you for reaching out. We will get back to you as soon as possible.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField
                    label="Your Name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    fullWidth
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: "'Inter', 'DM Sans', sans-serif" } }}
                  />
                  <TextField
                    label="Email Address"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    fullWidth
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: "'Inter', 'DM Sans', sans-serif" } }}
                  />
                  <TextField
                    label="Message"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    fullWidth
                    multiline
                    minRows={5}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: "'Inter', 'DM Sans', sans-serif" } }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleContactSubmit}
                    disabled={!contactName || !contactEmail || !contactMessage}
                    sx={{
                      background: '#1A73E8',
                      color: '#FFFFFF',
                      fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                      fontWeight: 700,
                      py: 1.4,
                      borderRadius: '10px',
                      textTransform: 'none',
                      '&:hover': { background: '#0B3D91' },
                    }}
                  >
                    Send Message
                  </Button>
                  <Typography sx={{ color: '#888', fontFamily: "'Inter', 'DM Sans', sans-serif", textAlign: 'center', fontSize: '0.82rem' }}>
                    Or call us directly at{' '}
                    <Box component="a" href="tel:+15712764808" sx={{ color: '#1A73E8', fontWeight: 700, textDecoration: 'none' }}>+1 (571) 276-4808</Box>
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      <Suspense fallback={null}>
        <SiteFooter />
      </Suspense>
    </>
  );
};

export default HomeBelowFold;
