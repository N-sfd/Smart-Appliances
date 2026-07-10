import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
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
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GppGoodIcon from '@mui/icons-material/GppGood';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import HandshakeIcon from '@mui/icons-material/Handshake';
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import SearchIcon from '@mui/icons-material/Search';
import BuildIcon from '@mui/icons-material/Build';
import AcUnitOutlinedIcon from '@mui/icons-material/AcUnitOutlined';
import PlumbingOutlinedIcon from '@mui/icons-material/PlumbingOutlined';
import LocalLaundryServiceOutlinedIcon from '@mui/icons-material/LocalLaundryServiceOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ReplayIcon from '@mui/icons-material/Replay';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import HomeResourcesSection from './HomeResourcesSection';
import BrandsWeServiceMarquee from './BrandsWeServiceMarquee';
import { getContactUrlForCategory } from '../data/service-brands';
import { serviceCategories } from '../data/services';
import { popularServices } from '../data/popularServices';
import { SERVICE_TYPE_IMAGE_MAP, CATEGORY_IMAGE_MAP, DEFAULT_SERVICE_IMAGE } from '../data/serviceImages';
import { colors, fonts, radii } from '../theme';
import { SERVICE_CARD_IMAGE_WIDTH, SERVICE_CARD_IMAGE_HEIGHT } from '../constants/imageDimensions';
import ServiceCategoryTabs, { ServiceCategoryTab } from './ServiceCategoryTabs';
import ServiceGridCard from './ServiceGridCard';
import {
  normalizeZipInput,
  validateZipCode,
  serviceAreaNeighborhoods,
  SERVICE_AREA_REGION_LABEL,
  SERVICE_AREA_REGION_LABEL_SHORT,
} from '../data/serviceAreas';
import {
  tabCategoryMap,
  SERVICE_DETAIL_EXT,
  howItWorks,
  faqs,
  serviceCoverageItems,
} from '../data/homePageData';

const SERVICE_COVERAGE_ICONS = {
  appliance: LocalLaundryServiceOutlinedIcon,
  install: HomeRepairServiceIcon,
  hvac: AcUnitOutlinedIcon,
  plumbing: PlumbingOutlinedIcon,
  emergency: BoltOutlinedIcon,
} as const;

const BUSINESS_PHONE_DISPLAY = '+1 (240) 576-0397';
const BUSINESS_PHONE_HREF = 'tel:+12405760397';

const ServiceAreaMap = lazy(() => import('./ServiceAreaMap'));

const testimonials = [
  {
    name: 'Sarah M.',
    location: 'Rockville, MD',
    rating: 5,
    text: 'Our refrigerator stopped cooling on a Friday night. Smart Appliances had a technician here Saturday morning — fixed same-day. Incredible service!',
  },
  {
    name: 'James T.',
    location: 'Arlington, VA',
    rating: 5,
    text: 'Booked online in under 2 minutes. The technician explained exactly what was wrong with my washer and the pricing was completely transparent. Highly recommend.',
  },
  {
    name: 'Linda R.',
    location: 'Bethesda, MD',
    rating: 5,
    text: "Used them twice — once for my dryer and once for an HVAC check. Both times on time, professional, and fairly priced. Won't use anyone else.",
  },
];

const serviceGuaranteeItems = [
  { icon: <ChatBubbleOutlineIcon sx={{ fontSize: 26, color: colors.primaryBlue }} />, title: 'Clear Communication', description: 'You will know what to expect before, during, and after your service.' },
  { icon: <ReplayIcon sx={{ fontSize: 26, color: colors.primaryBlue }} />, title: 'Service Follow-Up', description: 'Reach out within the follow-up period if an issue related to the completed service comes up.' },
  { icon: <TrackChangesIcon sx={{ fontSize: 26, color: colors.primaryBlue }} />, title: 'Request ID Tracking', description: 'Every booking gets a Request ID so you can track status and history at any time.' },
  { icon: <SupportAgentIcon sx={{ fontSize: 26, color: colors.primaryBlue }} />, title: 'Professional Support', description: 'Our team reviews follow-up requests promptly and keeps you informed at each step.' },
];

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
  const [contactNameTouched, setContactNameTouched] = useState(false);
  const [contactEmailTouched, setContactEmailTouched] = useState(false);
  const [contactMessageTouched, setContactMessageTouched] = useState(false);
  const [areaZip, setAreaZip] = useState('');
  const [areaZipTouched, setAreaZipTouched] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySubmitted, setNotifySubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | false>(false);
  const [stickyVisible, setStickyVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setStickyVisible(window.scrollY > 320);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
  const showZipSuccess = areaZip.length === 5 && areaZipValidation.isValid && areaZipInCoverage;

  const areaZipHelperText = useMemo(() => {
    if (areaZipTouched && !areaZip) return 'Please enter your ZIP code.';
    if (areaZip.length < 5) return `Service area: ${SERVICE_AREA_REGION_LABEL_SHORT}`;
    if (areaZipInCoverage) return `Great news — ZIP ${areaZip} is within our regional service area.`;
    return 'This ZIP may be outside our current service area. Please call us to confirm availability.';
  }, [areaZip, areaZipTouched, areaZipInCoverage]);

  const areaZipFieldError = (areaZipTouched && !areaZip) || (areaZip.length === 5 && !areaZipInCoverage);

  const handleAreaZipCheck = () => {
    setAreaZipTouched(true);
    if (!areaZip) return;
    if (!areaZipValidation.isValid) return;
    navigate(`/scheduler?${new URLSearchParams({ zipCode: areaZip }).toString()}`);
  };

  const CONTACT_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const contactEmailValid = CONTACT_EMAIL_RE.test(contactEmail);
  const contactFormValid =
    contactName.trim().length > 0 && contactEmailValid && contactMessage.trim().length > 0;

  const handleContactSubmit = () => {
    setContactNameTouched(true);
    setContactEmailTouched(true);
    setContactMessageTouched(true);
    if (contactFormValid) setContactSent(true);
  };

  return (
    <>
      {/* ── What Needs Service? ── */}
      <Box className="home-deferred-section" id="services" sx={{ py: { xs: 7, md: 9 }, backgroundColor: colors.surface }}>
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
              fontSize: { xs: '1.75rem', md: '2rem' },
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
                    borderRadius: '16px',
                    border: `1px solid ${colors.border}`,
                    boxShadow: colors.cardShadow,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
                    '&:hover': {
                      boxShadow: '0 22px 48px rgba(10, 37, 64, 0.16)',
                      transform: 'translateY(-4px)',
                      borderColor: colors.primaryBlue,
                      '& .appl-card-img': { transform: 'scale(1.05)' },
                      '& .appl-card-arrow': { color: colors.primaryBlue, transform: 'translateX(4px)' },
                    },
                    '&:active': { transform: 'scale(0.97)', boxShadow: colors.cardShadow },
                  }}
                >
                  {/* Image area */}
                  <Box
                    sx={{
                      backgroundColor: service.imageBg,
                      height: '180px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      className="appl-card-img"
                      component="img"
                      src={service.image}
                      alt={service.label}
                      width={SERVICE_CARD_IMAGE_WIDTH}
                      height={SERVICE_CARD_IMAGE_HEIGHT}
                      loading="lazy"
                      decoding="async"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.32s ease' }}
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
                    <ArrowForwardIcon className="appl-card-arrow" sx={{ color: '#AAAAAA', fontSize: 20, flexShrink: 0, ml: 1, transition: 'transform 0.22s ease, color 0.22s ease' }} />
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
      <Box sx={{ py: { xs: 7, md: 9 }, backgroundColor: colors.sectionBg }}>
        <Container maxWidth="lg">
          <Typography
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 700,
              color: colors.primaryBlue,
              textAlign: 'center',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              mb: 1.5,
            }}
          >
            3 ways to get started
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              color: colors.navy,
              textAlign: 'center',
              fontSize: { xs: '1.75rem', md: '2rem' },
              mb: 1,
              letterSpacing: '-0.3px',
            }}
          >
            Choose how you want to book
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, textAlign: 'center', mb: 6, fontSize: '1rem' }}>
            Not sure which to pick? Compare the three options below.
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
                borderRadius: '16px',
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
                    fontFamily: fonts.heading,
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: radii.xl,
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
                borderRadius: '16px',
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
                  {[
                    'Appliance stopped working unexpectedly.',
                    'No hot water, broken fridge, or dishwasher failure.',
                  ].map((line) => (
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
                    fontFamily: fonts.heading,
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: radii.xl,
                    py: 1.25,
                    '&:hover': { backgroundColor: '#7C3AED' },
                  }}
                >
                  Schedule Service
                </Button>
              </Box>
            </Card>

            {/* Emergency Priority */}
            <Card
              sx={{
                maxWidth: 340,
                width: '100%',
                borderRadius: '16px',
                border: '2px solid #FECDD3',
                backgroundColor: '#FFFAFA',
                boxShadow: '0 2px 12px rgba(239,68,68,0.06)',
                transition: 'box-shadow 0.22s ease, transform 0.22s ease',
                '&:hover': { boxShadow: '0 12px 32px rgba(239,68,68,0.14)', transform: 'translateY(-3px)' },
              }}
            >
              <Box sx={{ p: '28px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Icon + red badge row */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: '14px',
                      backgroundColor: '#FFF0F0',
                      border: '1px solid #FECDD3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <WarningAmberIcon sx={{ color: '#EF4444', fontSize: 28 }} />
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: '#EF4444',
                      borderRadius: '20px',
                      px: 1.5,
                      py: 0.4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#fff', animation: 'pulse 1.4s infinite' }} />
                    <Typography sx={{ fontFamily: fonts.body, fontWeight: 800, fontSize: '0.7rem', color: '#fff', letterSpacing: '0.04em' }}>
                      PRIORITY DISPATCH
                    </Typography>
                  </Box>
                </Box>

                <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '1.12rem', color: '#B91C1C', mb: 0.5 }}>
                  Emergency Priority
                </Typography>
                <Typography sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: '#6B7280', mb: 1.75 }}>
                  Active hazard or complete system failure
                </Typography>

                <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none', flexGrow: 1, mb: 3 }}>
                  {[
                    'AC failure during extreme heat or cold.',
                    'Active leak, flooding, or appliance sparking.',
                    'Complete system failure affecting daily living.',
                  ].map((line) => (
                    <Box component="li" key={line} sx={{ display: 'flex', gap: 1.25, mb: 1.1, '&:last-of-type': { mb: 0 } }}>
                      <Box component="span" sx={{ color: '#EF4444', fontWeight: 700, lineHeight: 1.6, flexShrink: 0 }}>•</Box>
                      <Typography sx={{ fontFamily: fonts.body, fontSize: '0.88rem', color: '#374151', lineHeight: 1.6 }}>
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
                    fontFamily: fonts.heading,
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: radii.xl,
                    py: 1.25,
                    boxShadow: '0 4px 14px rgba(239,68,68,0.30)',
                    '&:hover': { backgroundColor: '#DC2626' },
                  }}
                >
                  Request Emergency Service
                </Button>
              </Box>
            </Card>
          </Box>

          {/* Single safety note — 911 appears only here */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              mt: 4,
              p: 2,
              borderRadius: '12px',
              backgroundColor: '#FFF5F5',
              border: '1px solid #FECDD3',
              maxWidth: 540,
              mx: 'auto',
            }}
          >
            <WarningAmberIcon sx={{ fontSize: 16, color: '#EF4444', flexShrink: 0 }} />
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: '#7F1D1D', textAlign: 'center' }}>
              For gas leaks, fire, smoke, or electrical hazards — call{' '}
              <Box component="span" sx={{ fontWeight: 800, color: '#EF4444' }}>911</Box>{' '}
              immediately. Do not use this form.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ── Social Proof ── */}
      <Box sx={{ py: { xs: 7, md: 9 }, backgroundColor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          {/* Header with aggregate rating */}
          <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 6 } }}>
            <Typography
              variant="h2"
              sx={{
                fontFamily: fonts.heading,
                fontWeight: 800,
                color: colors.navy,
                fontSize: { xs: '1.75rem', md: '2rem' },
                mb: 1,
                letterSpacing: '-0.3px',
              }}
            >
              Trusted by 10,000+ Homeowners
            </Typography>
            {/* Google-style rating row */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1.5, mb: 1 }}>
              {[1,2,3,4,5].map((s) => (
                <StarIcon key={s} sx={{ color: '#FBBC04', fontSize: 26 }} />
              ))}
              <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '1.25rem', color: colors.navy, ml: 0.5 }}>
                4.9
              </Typography>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.9rem', color: colors.mutedText, ml: 0.25 }}>
                / 5 · Google Rating
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.85rem', color: colors.mutedText }}>
              Based on 800+ verified customer reviews
            </Typography>
          </Box>

          {/* Testimonial cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: { xs: 2.5, md: 3 },
            }}
          >
            {testimonials.map((t) => (
              <Box
                key={t.name}
                sx={{
                  backgroundColor: '#FFFFFF',
                  border: `1px solid ${colors.border}`,
                  borderLeft: `4px solid ${colors.primaryBlue}`,
                  borderRadius: '16px',
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  boxShadow: '0 2px 10px rgba(11,61,145,0.06)',
                  '&:hover': { boxShadow: '0 12px 32px rgba(11,61,145,0.12)', transform: 'translateY(-2px)' },
                }}
              >
                {/* Top: stars + Google badge */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', gap: 0.4 }}>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <StarIcon key={i} sx={{ color: '#FBBC04', fontSize: 18 }} />
                    ))}
                  </Box>
                  {/* Google "G" badge */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.6,
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E4E7EB',
                      borderRadius: '8px',
                      px: 1,
                      py: 0.4,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        background: 'conic-gradient(#4285F4 0deg 90deg, #EA4335 90deg 180deg, #FBBC05 180deg 270deg, #34A853 270deg 360deg)',
                        display: 'inline-block',
                        flexShrink: 0,
                      }}
                    />
                    <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '0.68rem', color: '#555', letterSpacing: '0.02em' }}>
                      Google Review
                    </Typography>
                  </Box>
                </Box>

                <FormatQuoteIcon sx={{ color: colors.primaryBlue, fontSize: 24, opacity: 0.4, mt: -0.5 }} />
                <Typography
                  sx={{
                    fontFamily: fonts.body,
                    fontSize: '0.9rem',
                    color: colors.darkText,
                    lineHeight: 1.75,
                    flexGrow: 1,
                  }}
                >
                  {t.text}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: 0.5, borderTop: `1px solid ${colors.border}` }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      backgroundColor: colors.lightBlueBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontFamily: fonts.heading,
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: colors.primaryBlue,
                    }}
                  >
                    {t.name.charAt(0)}
                  </Box>
                  <Box>
                    <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '0.86rem', color: colors.navy }}>
                      {t.name}
                    </Typography>
                    <Typography sx={{ fontFamily: fonts.body, fontSize: '0.76rem', color: colors.mutedText }}>
                      {t.location}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Trust Section ── */}
      <Box className="home-deferred-section" id="why-choose-us" sx={{ py: { xs: 7, md: 9 }, backgroundColor: colors.sectionBg, scrollMarginTop: '80px' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
              fontWeight: 800,
              color: '#0B3D91',
              textAlign: 'center',
              fontSize: { xs: '1.75rem', md: '2rem' },
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
                  borderRadius: '16px',
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

      {/* ── 30-Day Service Follow-Up ── */}
      <Box id="service-guarantee" sx={{ py: { xs: 7, md: 9 }, backgroundColor: '#FFFFFF', scrollMarginTop: '80px' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              color: colors.navy,
              textAlign: 'center',
              fontSize: { xs: '1.75rem', md: '2rem' },
              mb: 1,
              letterSpacing: '-0.3px',
            }}
          >
            30-Day Service Follow-Up
          </Typography>
          <Box sx={{ width: 56, height: 4, borderRadius: '2px', background: 'linear-gradient(90deg, #1A73E8, #4FC3F7)', mx: 'auto', mt: 1.5, mb: 3 }} />
          <Typography
            sx={{
              fontFamily: fonts.body,
              fontSize: { xs: '0.95rem', md: '1rem' },
              color: colors.mutedText,
              maxWidth: 720,
              mx: 'auto',
              textAlign: 'center',
              lineHeight: 1.75,
              mb: { xs: 5, md: 6 },
            }}
          >
            We stand behind completed eligible services. If an issue related to the completed service occurs within the follow-up period, contact us and our team will review it promptly. Warranty terms may vary by service type, parts, and technician assessment.
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: { xs: 2.5, md: '28px' },
              mb: { xs: 4, md: 5 },
            }}
          >
            {serviceGuaranteeItems.map((item) => (
              <Box
                key={item.title}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '12px',
                  backgroundColor: colors.sectionBg,
                  border: '1px solid #E4E7EB',
                  borderRadius: '16px',
                  p: '22px',
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
                <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '0.95rem', color: colors.navy, lineHeight: 1.3 }}>
                  {item.title}
                </Typography>
                <Typography sx={{ fontFamily: fonts.body, fontSize: '0.84rem', color: '#4B5563', lineHeight: 1.65, m: 0 }}>
                  {item.description}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              onClick={() => navigate('/scheduler')}
              variant="contained"
              sx={{
                backgroundColor: colors.primaryBlue,
                color: '#fff',
                fontFamily: fonts.body,
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: '12px',
                px: 4,
                py: 1.25,
                '&:hover': { backgroundColor: colors.navy },
              }}
            >
              Schedule Service
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ── How It Works ── */}
      <Box sx={{ py: { xs: 7, md: 9 }, backgroundColor: colors.sectionBg }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              color: colors.navy,
              textAlign: 'center',
              fontSize: { xs: '1.75rem', md: '2rem' },
              mb: 1,
              letterSpacing: '-0.3px',
            }}
          >
            How It Works
          </Typography>
          <Box sx={{ width: 56, height: 4, borderRadius: '2px', background: 'linear-gradient(90deg, #1A73E8, #4FC3F7)', mx: 'auto', mt: 1.5, mb: { xs: 5, md: 7 } }} />

          {/* Timeline */}
          <Box sx={{ position: 'relative' }}>
            {/* Horizontal connector (desktop only) */}
            <Box
              aria-hidden
              sx={{
                display: { xs: 'none', md: 'block' },
                position: 'absolute',
                top: 36,
                left: 'calc(12.5% + 28px)',
                right: 'calc(12.5% + 28px)',
                height: 2,
                background: 'linear-gradient(90deg, #1A73E8 0%, #4FC3F7 100%)',
                opacity: 0.3,
                zIndex: 0,
              }}
            />

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: { xs: 3, md: 2.5 },
              }}
            >
              {[
                { ...howItWorks[0], icon: <SearchIcon sx={{ fontSize: 24, color: '#fff' }} /> },
                { ...howItWorks[1], icon: <CalendarMonthIcon sx={{ fontSize: 24, color: '#fff' }} /> },
                { ...howItWorks[2], icon: <BuildIcon sx={{ fontSize: 24, color: '#fff' }} /> },
                { ...howItWorks[3], icon: <DoneAllIcon sx={{ fontSize: 24, color: '#fff' }} /> },
              ].map((item) => (
                <Box
                  key={item.step}
                  sx={{
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1,
                    px: { md: 1 },
                  }}
                >
                  {/* Icon circle */}
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1A73E8 0%, #0B3D91 100%)',
                      boxShadow: '0 6px 20px rgba(26,115,232,0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      position: 'relative',
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography
                    sx={{
                      fontFamily: fonts.heading,
                      fontWeight: 700,
                      fontSize: '0.98rem',
                      color: colors.navy,
                      mb: 0.75,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: fonts.body,
                      fontSize: '0.84rem',
                      color: colors.mutedText,
                      lineHeight: 1.65,
                      maxWidth: 200,
                      mx: 'auto',
                    }}
                  >
                    {item.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── Brands Section ── */}
      <Box className="home-deferred-section" id="brands" sx={{ py: { xs: 7, md: 9 }, backgroundColor: colors.sectionBg, scrollMarginTop: '80px' }}>
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
                fontSize: { xs: '1.75rem', md: '2rem' },
                color: colors.navy,
                letterSpacing: '-0.3px',
                mb: 1.5,
              }}
            >
              Brands We Service
            </Typography>
            <Typography
              sx={{
                fontFamily: fonts.body,
                fontSize: { xs: '0.95rem', md: '1rem' },
                color: colors.mutedText,
                maxWidth: 560,
                mx: 'auto',
                lineHeight: 1.75,
                mb: 4,
              }}
            >
              We service many major appliance and home-system brands. If you do not see your brand listed, contact us and we will confirm availability.
            </Typography>
          </Box>

          <BrandsWeServiceMarquee fadeColor={colors.sectionBg} />

          <Box sx={{ textAlign: 'center', mt: 4, mb: 2 }}>
            <Button
              onClick={() => navigate(getContactUrlForCategory('home-appliances'))}
              sx={{
                fontFamily: fonts.body,
                fontWeight: 600,
                fontSize: '0.875rem',
                color: colors.primaryBlue,
                textTransform: 'none',
                '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
              }}
            >
              Don&apos;t see your brand? Contact us to confirm availability.
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3, mb: 5 }}>
            <Button
              onClick={() => navigate('/scheduler')}
              variant="contained"
              sx={{
                backgroundColor: colors.primaryBlue,
                color: '#fff',
                fontFamily: fonts.body,
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: '12px',
                px: 4,
                py: 1.25,
                '&:hover': { backgroundColor: colors.navy },
              }}
            >
              Book a Service
            </Button>
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
              fontSize: { xs: '1.75rem', md: '2rem' },
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
            {faqs.map((faq) => {
              const isOpen = expandedFaq === faq.question;
              return (
                <Accordion
                  key={faq.question}
                  expanded={isOpen}
                  onChange={() => setExpandedFaq(isOpen ? false : faq.question)}
                  disableGutters
                  elevation={0}
                  TransitionProps={{ unmountOnExit: true }}
                  sx={{
                    border: `1px solid ${isOpen ? '#1A73E8' : '#E4E7EB'}`,
                    borderLeft: isOpen ? '3px solid #1A73E8' : `1px solid #E4E7EB`,
                    borderRadius: '12px !important',
                    mb: 1.5,
                    '&:before': { display: 'none' },
                    transition: 'border-color 0.2s',
                    '&.Mui-expanded': { boxShadow: '0 4px 16px rgba(11,37,69,0.08)' },
                    '&:hover': { borderColor: '#1A73E8' },
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon
                        sx={{
                          color: isOpen ? '#1A73E8' : '#64748B',
                          transition: 'color 0.2s',
                        }}
                      />
                    }
                    sx={{
                      px: 3,
                      backgroundColor: isOpen ? 'rgba(26,115,232,0.06)' : 'transparent',
                      borderRadius: '12px 12px 0 0',
                      transition: 'background-color 0.2s',
                      '& .MuiAccordionSummary-content': { my: 1.75, display: 'flex', alignItems: 'center', gap: 1.25 },
                    }}
                  >
                    <HelpOutlineIcon sx={{ fontSize: 19, color: isOpen ? '#1A73E8' : '#9AA5B1', transition: 'color 0.2s', flexShrink: 0 }} />
                    <Typography sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: isOpen ? '#1A73E8' : '#0B3D91', fontWeight: 600, fontSize: '0.95rem', transition: 'color 0.2s' }}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 3, pb: 2.5, pt: 0 }}>
                    <Typography sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#1A1A1A', lineHeight: 1.8, fontSize: '0.88rem' }}>
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        </Container>
      </Box>

      <HomeResourcesSection />

      {/* ── Service Areas ── */}
      <Box className="home-deferred-section" id="service-areas" sx={{ py: { xs: 4.5, md: 7 }, backgroundColor: colors.sectionBg, scrollMarginTop: '80px' }}>
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
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontFamily: fonts.heading,
                  fontWeight: 800,
                  color: '#0B3D91',
                  fontSize: { xs: '1.65rem', md: '2rem' },
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
                  mb: { xs: 2.5, md: 3.5 },
                }}
              >
                Enter your ZIP to confirm availability across {SERVICE_AREA_REGION_LABEL}.
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: { xs: 2, md: 3.5 },
                  p: { xs: 1.25, md: 1.5 },
                  borderRadius: '10px',
                  backgroundColor: '#EAF5FF',
                  border: '1px solid #BFDBFE',
                  width: '100%',
                }}
              >
                <GppGoodIcon sx={{ fontSize: 18, color: '#1A73E8', flexShrink: 0 }} />
                <Typography
                  sx={{
                    fontFamily: fonts.body,
                    fontSize: { xs: '0.84rem', md: '0.8rem' },
                    color: '#0B3D91',
                    fontWeight: 600,
                    lineHeight: 1.45,
                    whiteSpace: { xs: 'normal', md: 'nowrap' },
                  }}
                >
                  Licensed &amp; insured service team serving MD, VA, WV, PA, DE &amp; DC.
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 1.5,
                  mb: { xs: 3, md: 4 },
                }}
              >
                <TextField
                  placeholder="Enter your ZIP code"
                  value={areaZip}
                  onChange={(e) => {
                    setAreaZip(normalizeZipInput(e.target.value));
                    if (normalizeZipInput(e.target.value).length < 5) {
                      setAreaZipTouched(false);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAreaZipCheck();
                  }}
                  fullWidth
                  error={areaZipFieldError}
                  helperText={areaZipHelperText}
                  inputProps={{ inputMode: 'numeric', maxLength: 5 }}
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      height: '56px',
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
                    height: '56px',
                    minWidth: { xs: '100%', sm: 230 },
                    flexShrink: 0,
                    backgroundColor: '#1A73E8',
                    color: '#FFFFFF',
                    fontFamily: fonts.heading,
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    textTransform: 'none',
                    borderRadius: radii.xl,
                    px: 3,
                    boxShadow: '0 8px 24px rgba(26, 115, 232, 0.22)',
                    '&:hover': { backgroundColor: '#0B3D91' },
                  }}
                >
                  Schedule Service
                </Button>
              </Box>

              {showZipSuccess && (
                <Box
                  sx={{
                    mb: 2,
                    p: 1.75,
                    borderRadius: '12px',
                    backgroundColor: '#F0FDF4',
                    border: '1px solid #86EFAC',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, mb: 1.5 }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 20, color: '#15803D', flexShrink: 0, mt: 0.1 }} />
                    <Box>
                      <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '0.92rem', color: '#14532D', mb: 0.35 }}>
                        We serve your area! Schedule your repair today.
                      </Typography>
                      <Typography sx={{ fontFamily: fonts.body, fontSize: '0.8rem', color: '#166534' }}>
                        Technicians are available near ZIP {areaZip}.
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/scheduler?zipCode=${areaZip}`)}
                    sx={{
                      backgroundColor: '#16A34A',
                      color: '#fff',
                      fontFamily: fonts.body,
                      fontWeight: 700,
                      textTransform: 'none',
                      borderRadius: '9px',
                      px: 2.5,
                      py: 0.9,
                      fontSize: '0.88rem',
                      '&:hover': { backgroundColor: '#15803D' },
                    }}
                  >
                    Find My Technician
                  </Button>
                </Box>
              )}

              {/* Out-of-area card with email capture */}
              {areaZipTouched && areaZipValidation.isValidFormat && !areaZipInCoverage && (
                <Box
                  sx={{
                    mb: 2,
                    p: 2.25,
                    borderRadius: '14px',
                    backgroundColor: '#FFF7ED',
                    border: '1px solid #FED7AA',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                    <Box sx={{ fontSize: '1.1rem', mt: 0.1, flexShrink: 0 }}>📍</Box>
                    <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '0.92rem', color: '#9A3412' }}>
                      We don&apos;t service ZIP {areaZip} yet.
                    </Typography>
                  </Box>
                  {notifySubmitted ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 3.25, mt: 0.5 }}>
                      <CheckCircleOutlineIcon sx={{ fontSize: 16, color: '#15803D' }} />
                      <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: '#15803D', fontWeight: 600 }}>
                        You're on the list! We'll email you when we expand to your area.
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: '#7C2D12', mb: 1.25, pl: 3.25 }}>
                        Leave your email and we'll notify you when we expand to your area.
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, pl: 3.25, flexDirection: { xs: 'column', sm: 'row' } }}>
                        <Box
                          component="input"
                          type="email"
                          placeholder="your@email.com"
                          value={notifyEmail}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotifyEmail(e.target.value)}
                          sx={{
                            flex: 1,
                            height: 38,
                            px: 1.5,
                            border: '1px solid #FCA572',
                            borderRadius: '8px',
                            fontFamily: fonts.body,
                            fontSize: '0.84rem',
                            outline: 'none',
                            '&:focus': { borderColor: '#EA580C' },
                          }}
                        />
                        <Button
                          variant="contained"
                          disabled={!notifyEmail.includes('@')}
                          onClick={() => setNotifySubmitted(true)}
                          sx={{
                            backgroundColor: '#EA580C',
                            color: '#fff',
                            fontFamily: fonts.body,
                            fontWeight: 700,
                            textTransform: 'none',
                            borderRadius: '8px',
                            px: 2,
                            fontSize: '0.82rem',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            '&:hover': { backgroundColor: '#C2410C' },
                            '&.Mui-disabled': { backgroundColor: '#FED7AA', color: '#fff' },
                          }}
                        >
                          Notify Me
                        </Button>
                      </Box>
                      <Typography sx={{ fontFamily: fonts.body, fontSize: '0.75rem', color: '#9A3412', mt: 1, pl: 3.25 }}>
                        Or call{' '}
                        <Box component="a" href={BUSINESS_PHONE_HREF} sx={{ color: '#EA580C', fontWeight: 700, textDecoration: 'none' }}>
                          {BUSINESS_PHONE_DISPLAY}
                        </Box>{' '}
                        to check if we have nearby options.
                      </Typography>
                    </>
                  )}
                </Box>
              )}

              <Typography
                sx={{
                  fontFamily: fonts.heading,
                  fontWeight: 700,
                  color: '#0B3D91',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  mb: 1.5,
                  mt: { xs: 0.5, md: 1.5 },
                }}
              >
                Popular service areas
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.25, md: 1.75 } }}>
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
                      py: { xs: '8px', md: '10px' },
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
                height: '100%',
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
                  mb: 2,
                }}
              >
                Service Coverage
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2.5 }}>
                {serviceCoverageItems.map((item) => {
                  const Icon = SERVICE_COVERAGE_ICONS[item.icon];
                  return (
                    <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '10px',
                          backgroundColor: '#EAF5FF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon sx={{ fontSize: 20, color: '#1A73E8' }} />
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: fonts.body,
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          color: colors.darkText,
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>

              <Suspense fallback={<Box sx={{ height: { xs: 230, sm: 250, md: 264 } }} aria-hidden />}>
                <ServiceAreaMap height={{ xs: 230, sm: 250, md: 264 }} />
              </Suspense>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── Closing CTA ── */}
      <Box
        sx={{
          py: { xs: 7, md: 9 },
          background: 'linear-gradient(135deg, #071B41 0%, #0B2D6B 55%, #0D3A82 100%)',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '1.3rem', sm: '1.65rem', md: '1.85rem', lg: '2.25rem' },
              color: '#fff',
              lineHeight: 1.15,
              mb: 1.5,
              letterSpacing: '-0.3px',
              whiteSpace: { xs: 'normal', sm: 'nowrap' },
            }}
          >
            Book in 60 seconds —{' '}
            <Box component="span" sx={{ color: '#4FC3F7' }}>technicians available today.</Box>
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.body,
              fontSize: { xs: '0.95rem', md: '1.05rem' },
              color: 'rgba(255,255,255,0.72)',
              mb: 4,
              maxWidth: 480,
              mx: 'auto',
              lineHeight: 1.65,
            }}
          >
            Same-day and next-day slots fill fast. Secure your appointment now — no commitment until you confirm.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center', alignItems: 'center', mb: 3 }}>
            <Button
              variant="contained"
              onClick={() => navigate('/scheduler')}
              sx={{
                backgroundColor: '#4FC3F7',
                color: colors.navy,
                fontFamily: fonts.heading,
                fontWeight: 800,
                fontSize: '1rem',
                textTransform: 'none',
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                boxShadow: '0 8px 28px rgba(79,195,247,0.35)',
                '&:hover': { backgroundColor: '#38BDF8' },
              }}
            >
              Book Service Now
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/track-request')}
              sx={{
                borderColor: 'rgba(255,255,255,0.4)',
                color: '#fff',
                fontFamily: fonts.heading,
                fontWeight: 700,
                fontSize: '0.95rem',
                textTransform: 'none',
                borderRadius: '12px',
                px: 3.5,
                py: 1.5,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.7)' },
              }}
            >
              Track Your Request
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: { xs: 2, md: 3.5 } }}>
            {['No upfront payment', 'Licensed & insured', 'Free cancellation'].map((badge) => (
              <Box key={badge} sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 14, color: '#4FC3F7' }} />
                <Typography sx={{ fontFamily: fonts.body, fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.78)' }}>
                  {badge}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Get In Touch ── */}
      <Box id="contact" sx={{ py: { xs: 7, md: 9 }, backgroundColor: colors.surface, scrollMarginTop: '80px' }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h2"
              sx={{ fontFamily: fonts.heading, fontWeight: 800, color: colors.navy, fontSize: { xs: '1.8rem', md: '2rem' }, mb: 1, letterSpacing: '-0.3px' }}
            >
              Get In Touch
            </Typography>
            <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '1rem', maxWidth: 560, mx: 'auto' }}>
              Questions before you book? Reach us by phone, email, or the form below.
            </Typography>
          </Box>

          {/* Why Choose Us strip */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: { xs: 1.5, md: 3 },
              mb: 5,
              pb: 4,
              borderBottom: `1px solid ${colors.border}`,
            }}
          >
            {[
              'Licensed & insured technicians',
              'Transparent pricing before work begins',
              'Same-day & emergency availability',
              '30-day labor warranty',
            ].map((item) => (
              <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 16, color: colors.primaryBlue, flexShrink: 0 }} />
                <Typography sx={{ fontFamily: fonts.body, fontSize: '0.88rem', fontWeight: 600, color: colors.darkText }}>
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Two-column grid — equal-height cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: 3, md: 4 },
              alignItems: 'stretch',
            }}
          >
            {/* Left: contact info + hours + map */}
            <Box
              sx={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E4E7EB',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(10,37,64,0.07)',
                p: { xs: '24px', md: '28px' },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Contact items */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75, mb: 2.5 }}>
                {[
                  { icon: <PhoneIcon sx={{ color: '#1A73E8', fontSize: 18 }} />, label: 'Phone', value: '+1 (240) 576-0397', href: 'tel:+12405760397' },
                  { icon: <EmailIcon sx={{ color: '#1A73E8', fontSize: 18 }} />, label: 'Email', value: 'service@smartappliances.co', href: 'mailto:service@smartappliances.co' },
                  { icon: <LocationOnIcon sx={{ color: '#1A73E8', fontSize: 18 }} />, label: 'Coverage', value: SERVICE_AREA_REGION_LABEL_SHORT, href: undefined },
                ].map((item) => (
                  <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: '9px', backgroundColor: '#E8F1FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '0.75rem', color: colors.mutedText, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {item.label}
                      </Typography>
                      {item.href ? (
                        <Box component="a" href={item.href} sx={{ fontFamily: fonts.body, fontSize: '0.9rem', color: colors.navy, fontWeight: 600, textDecoration: 'none', '&:hover': { color: colors.primaryBlue } }}>
                          {item.value}
                        </Box>
                      ) : (
                        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.9rem', color: colors.navy, fontWeight: 600 }}>{item.value}</Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Hours */}
              <Box sx={{ backgroundColor: '#F5F7FA', borderRadius: '12px', border: '1px solid #E4E7EB', p: 2, mb: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.25 }}>
                  <AccessTimeIcon sx={{ color: '#1A73E8', fontSize: 16 }} />
                  <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '0.82rem', color: colors.navy }}>Service Hours</Typography>
                </Box>
                {[
                  { day: 'Mon – Fri', hours: '8:00 AM – 6:00 PM' },
                  { day: 'Saturday', hours: '9:00 AM – 4:00 PM' },
                  { day: 'Sunday', hours: 'Emergency Only' },
                ].map((row) => (
                  <Box key={row.day} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '0.8rem' }}>{row.day}</Typography>
                    <Typography sx={{ fontFamily: fonts.body, color: row.hours === 'Emergency Only' ? '#D97706' : colors.navy, fontWeight: 600, fontSize: '0.8rem' }}>{row.hours}</Typography>
                  </Box>
                ))}
              </Box>

              {/* Map */}
              <Box sx={{ borderRadius: '14px', overflow: 'hidden', border: `1px solid ${colors.border}` }}>
                <Suspense fallback={<Box sx={{ height: 240, backgroundColor: '#EAF1FF' }} aria-hidden />}>
                  <ServiceAreaMap height={{ xs: 220, sm: 240, md: 240 }} />
                </Suspense>
              </Box>
            </Box>

            {/* Right: message form */}
            <Box
              sx={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E4E7EB',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(10,37,64,0.07)',
                p: { xs: '24px', md: '28px' },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '1.2rem', color: colors.navy, mb: 0.5 }}>
                Send Us a Message
              </Typography>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.85rem', color: colors.mutedText, mb: 2.5 }}>
                We typically respond within a few hours during business hours.
              </Typography>

              {contactSent ? (
                <Box
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#F0FDF4',
                    border: '1px solid #86EFAC',
                    borderRadius: '14px',
                    p: 4,
                    textAlign: 'center',
                  }}
                >
                  <CheckCircleOutlineIcon sx={{ color: '#15803D', fontSize: 48, mb: 2 }} />
                  <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '1.1rem', color: '#14532D', mb: 0.75 }}>Message Sent!</Typography>
                  <Typography sx={{ fontFamily: fonts.body, color: '#166534', fontSize: '0.9rem' }}>
                    Thank you — we&apos;ll get back to you shortly.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
                  <TextField
                    label="Your Name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    onBlur={() => setContactNameTouched(true)}
                    fullWidth
                    error={contactNameTouched && !contactName.trim()}
                    helperText={contactNameTouched && !contactName.trim() ? 'Name is required.' : ''}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        fontFamily: fonts.body,
                        backgroundColor: '#FAFBFC',
                      },
                    }}
                  />
                  <TextField
                    label="Email Address"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    onBlur={() => setContactEmailTouched(true)}
                    fullWidth
                    error={contactEmailTouched && !contactEmailValid}
                    helperText={contactEmailTouched && !contactEmailValid ? 'Please enter a valid email address.' : ''}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        fontFamily: fonts.body,
                        backgroundColor: '#FAFBFC',
                      },
                    }}
                  />
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: { xs: 168, md: 260 } }}>
                    <TextField
                      label="Message"
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      onBlur={() => setContactMessageTouched(true)}
                      fullWidth
                      multiline
                      minRows={8}
                      error={contactMessageTouched && !contactMessage.trim()}
                      helperText={contactMessageTouched && !contactMessage.trim() ? 'Message is required.' : ''}
                      sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        '& .MuiInputBase-root': {
                          flex: 1,
                          height: '100%',
                          borderRadius: '10px',
                          fontFamily: fonts.body,
                          backgroundColor: '#FAFBFC',
                          alignItems: 'flex-start',
                        },
                        '& .MuiInputBase-inputMultiline': {
                          flex: 1,
                          minHeight: { xs: 140, md: 220 },
                          height: '100% !important',
                          boxSizing: 'border-box',
                        },
                      }}
                    />
                  </Box>
                  <Button
                    variant="contained"
                    onClick={handleContactSubmit}
                    disabled={!contactFormValid}
                    sx={{
                      backgroundColor: '#1A73E8',
                      color: '#fff',
                      fontFamily: fonts.body,
                      fontWeight: 700,
                      py: 1.5,
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      '&:hover': { backgroundColor: '#0B3D91' },
                      '&.Mui-disabled': {
                        backgroundColor: 'rgba(26,115,232,0.32)',
                        color: 'rgba(255,255,255,0.75)',
                      },
                    }}
                  >
                    Send Message
                  </Button>
                  <Typography sx={{ color: colors.mutedText, fontFamily: fonts.body, textAlign: 'center', fontSize: '0.82rem' }}>
                    Or call us directly at{' '}
                    <Box component="a" href="tel:+12405760397" sx={{ color: colors.primaryBlue, fontWeight: 700, textDecoration: 'none' }}>
                      +1 (240) 576-0397
                    </Box>
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Spacer so footer isn't hidden behind sticky bar on mobile */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, height: 80 }} />

      {/* Sticky bottom CTA bar — mobile only, appears on scroll */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1300,
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E4E7EB',
          boxShadow: '0 -4px 20px rgba(10,37,64,0.12)',
          px: 2,
          pt: 1.25,
          pb: 'max(12px, env(safe-area-inset-bottom, 12px))',
          gap: 1.5,
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          transform: stickyVisible ? 'translateY(0)' : 'translateY(100%)',
          opacity: stickyVisible ? 1 : 0,
          pointerEvents: stickyVisible ? 'auto' : 'none',
        }}
      >
        <Box
          component="a"
          href="tel:+12405760397"
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.75,
            backgroundColor: '#F5F7FA',
            border: '1.5px solid #E4E7EB',
            borderRadius: '12px',
            py: 1.25,
            textDecoration: 'none',
            transition: 'background-color 0.15s',
            '&:active': { backgroundColor: '#E8EDF3' },
          }}
        >
          <PhoneIcon sx={{ fontSize: 17, color: colors.navy }} />
          <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '0.85rem', color: colors.navy }}>
            Call Now
          </Typography>
        </Box>
        <Box
          onClick={() => navigate('/scheduler')}
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.75,
            backgroundColor: colors.primaryBlue,
            borderRadius: '12px',
            py: 1.25,
            cursor: 'pointer',
            transition: 'background-color 0.15s',
            '&:active': { backgroundColor: colors.navy },
          }}
        >
          <EventAvailableIcon sx={{ fontSize: 17, color: '#fff' }} />
          <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>
            Book Now
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default HomeBelowFold;
