import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Select,
  MenuItem,
  FormControl,
  OutlinedInput,
  SelectChangeEvent,
} from '@mui/material';
import EngineeringIcon from '@mui/icons-material/Engineering';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import VerifiedIcon from '@mui/icons-material/Verified';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GppGoodIcon from '@mui/icons-material/GppGood';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import HandshakeIcon from '@mui/icons-material/Handshake';
import { serviceCategories } from '../data/services';
import { popularServices } from '../data/popularServices';
import { SERVICE_TYPE_IMAGE_MAP, CATEGORY_IMAGE_MAP, DEFAULT_SERVICE_IMAGE } from '../data/serviceImages';
import { colors, fonts, heroCtaButtonSx } from '../theme';
import SiteFooter from './SiteFooter';
import ServiceCategoryTabs, { ServiceCategoryTab } from './ServiceCategoryTabs';
import ServiceGridCard from './ServiceGridCard';
import ServiceAreaMap from './ServiceAreaMap';
import {
  normalizeZipInput,
  validateZipCode,
  getZipFieldHelperText,
  isZipFieldError,
  serviceAreaNeighborhoods,
  SERVICE_AREA_REGION_LABEL,
} from '../data/serviceAreas';

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────

const allServiceOptions = serviceCategories.flatMap((cat) =>
  cat.services.map((s) => ({ id: s.id, label: s.label, categoryId: cat.id })),
);

const tabCategoryMap: Record<string, string[]> = {
  HVAC: ['hvac-services'],
  Plumbing: ['plumbing-services'],
  Electrical: ['electrical-services'],
  'Smart Home': ['smart-home-setup'],
};

const SERVICE_DETAIL_EXT: Record<string, { issues?: string[]; hasEmergency: boolean }> = {
  // Appliances — issues come from popularServices chips
  'refrigerator-repair':             { issues: ['Not cooling', 'Ice maker issue', 'New install setup', 'Water line hookup'], hasEmergency: true },
  'washer-dryer':                    { issues: ["Won't spin", 'Not heating', 'Hose connection', 'Level and test'], hasEmergency: false },
  'washer-repair':                   { hasEmergency: false },
  'dishwasher-repair':               { issues: ['Not cleaning', "Won't drain", 'Drain connection', 'Water line hookup'], hasEmergency: false },
  'oven-stove-repair':               { issues: ['Not heating', 'Burner issue', 'Gas line hookup', 'Electrical hookup'], hasEmergency: true },
  'microwave-repair':                { issues: ['Not heating', 'No power', 'OTR mounting', 'Countertop setup'], hasEmergency: false },
  'smart-appliance-setup':           { hasEmergency: false },
  'garbage-disposal-repair':         { issues: ['Humming but not working', 'Leaking under sink', 'Jammed blades', "Won't turn on"], hasEmergency: false },
  'ice-maker-repair':                { issues: ['Not making ice', 'Ice tastes off', 'Water supply issue', 'Dispenser stuck'], hasEmergency: false },
  'refrigerator-installation':       { hasEmergency: false },
  'dishwasher-installation':         { hasEmergency: false },
  'washer-dryer-installation':       { hasEmergency: false },
  'microwave-installation':          { hasEmergency: false },
  'range-oven-installation':         { hasEmergency: false },
  // Appliances (legacy)
  'dryer-repair':                    { hasEmergency: false },
  // HVAC
  'ac-repair':                       { issues: ['No cooling', 'Warm air blowing', 'Refrigerant leak', 'Loud noise'], hasEmergency: true },
  'heating-furnace-repair':          { issues: ['No heat', 'Burner not igniting', 'Short cycling', 'Unusual smell'], hasEmergency: true },
  'thermostat-installation':         { issues: ['Thermostat not responding', 'Incorrect temperature', 'New smart thermostat', 'C-wire upgrade'], hasEmergency: false },
  'hvac-maintenance':                { issues: ['Annual tune-up', 'Filter replacement', 'Coil cleaning', 'Efficiency check'], hasEmergency: false },
  'duct-cleaning':                   { issues: ['Dust and debris', 'Allergens in air', 'Poor airflow', 'Post-renovation cleaning'], hasEmergency: false },
  'emergency-hvac-service':          { issues: ['Total system failure', 'No heat in winter', 'No AC in extreme heat', 'Gas smell'], hasEmergency: true },
  // Plumbing
  'leak-repair':                     { issues: ['Pipe leak', 'Under-sink leak', 'Water stains on walls', 'High water bill'], hasEmergency: true },
  'drain-cleaning':                  { issues: ['Slow drain', 'Complete blockage', 'Bad odor', 'Multiple drains affected'], hasEmergency: false },
  'faucet-repair':                   { issues: ['Dripping faucet', 'Low pressure', 'Leak at base', 'Handle issue'], hasEmergency: false },
  'toilet-repair':                   { issues: ['Running toilet', "Won't flush properly", 'Leaking at base', 'Clogged'], hasEmergency: false },
  'water-heater-service':            { issues: ['No hot water', 'Insufficient hot water', 'Leak at tank', 'Strange sounds'], hasEmergency: true },
  'emergency-plumbing':              { issues: ['Burst pipe', 'Major water leak', 'Sewage backup', 'Flooding'], hasEmergency: true },
  // Electrical
  'outlet-switch-repair':            { issues: ['Dead outlet', 'Switch not working', 'Warm or buzzing outlet', 'GFCI tripping'], hasEmergency: true },
  'light-fixture-installation':      { issues: ['New fixture install', 'Flickering light', 'Buzzing sound', 'Dimmer upgrade'], hasEmergency: false },
  'ceiling-fan-installation':        { issues: ['New fan install', 'Wobbling fan', 'Remote not working', 'Light kit issue'], hasEmergency: false },
  'breaker-panel-inspection':        { issues: ['Breaker tripping', 'Panel overheating', 'Safety inspection', 'Capacity upgrade'], hasEmergency: true },
  'appliance-electrical-connection': { issues: ['Dryer circuit setup', 'Range outlet install', 'Dedicated circuit', 'Amperage upgrade'], hasEmergency: false },
  'emergency-electrical-service':    { issues: ['Power outage', 'Sparking outlet', 'Burning smell', 'Circuit failure'], hasEmergency: true },
  // Smart Home
  'smart-thermostat-setup':          { issues: ['Nest / Ecobee setup', 'C-wire installation', 'App pairing', 'Schedule configuration'], hasEmergency: false },
  'doorbell-installation':           { issues: ['Ring doorbell setup', 'Existing wiring use', 'App setup', 'Motion zone config'], hasEmergency: false },
  'camera-installation':             { issues: ['Indoor camera mount', 'Outdoor camera setup', 'Night vision config', 'Cloud storage setup'], hasEmergency: false },
  'smart-lock-installation':         { issues: ['Smart lock fitting', 'App pairing', 'Access code setup', 'Keypad programming'], hasEmergency: false },
  'wifi-setup':                      { issues: ['Device connection', 'Wi-Fi troubleshooting', 'Mesh network setup', 'Range extension'], hasEmergency: false },
  'tv-mounting':                     { issues: ['Wall mount install', 'Cable management', 'Stud finding', 'Tilt / swivel bracket'], hasEmergency: false },
  // Home Maintenance
  'preventive-maintenance':          { issues: ['Annual appliance check', 'Filter replacement', 'Seal inspection', 'Efficiency tune-up'], hasEmergency: false },
  'dryer-vent-cleaning':             { issues: ['Lint buildup', 'Long dry times', 'Overheating dryer', 'Fire risk reduction'], hasEmergency: false },
  'air-duct-cleaning':               { issues: ['Dust in vents', 'Allergy symptoms', 'Pet dander buildup', 'Post-reno debris'], hasEmergency: false },
  'seasonal-hvac-tune-up':           { issues: ['Pre-season check', 'Filter change', 'Coil cleaning', 'Refrigerant check'], hasEmergency: false },
  'garage-door-repair':              { issues: ["Won't open or close", 'Broken spring or cable', 'Noisy or off-track door', 'Opener not responding'], hasEmergency: false },
  'general-handyman':                { issues: ['Minor repairs', 'Small installations', 'Home maintenance fixes', 'Seasonal tasks'], hasEmergency: false },
};

const howItWorks = [
  { step: '1', title: 'Choose a service', description: 'Pick the category and specific service for your appliance or home system.' },
  { step: '2', title: 'Regular or emergency', description: 'Schedule at a convenient time or request same-day emergency response.' },
  { step: '3', title: 'Tell us the problem', description: 'Share the issue, appliance brand, model, and any photos for faster service.' },
  { step: '4', title: 'Get contacted & booked', description: 'We confirm availability, service details, and next steps with clear pricing.' },
];

const trustItems = [
  { icon: <GppGoodIcon sx={{ fontSize: 28, color: colors.primaryBlue }} />, title: 'Licensed & Insured', description: 'All technicians are licensed, insured, and background-checked for your peace of mind.' },
  { icon: <ScheduleIcon sx={{ fontSize: 28, color: colors.primaryBlue }} />, title: 'Same-Day Availability', description: 'Priority scheduling for urgent but non-emergency issues when availability allows.' },
  { icon: <AssignmentTurnedInIcon sx={{ fontSize: 28, color: colors.primaryBlue }} />, title: 'Transparent Pricing', description: 'Technician explains the issue and estimated cost before any repair begins.' },
  { icon: <HomeRepairServiceIcon sx={{ fontSize: 28, color: colors.primaryBlue }} />, title: 'Service Warranty', description: 'Work is backed by a service quality commitment — we stand behind every repair.' },
  { icon: <EngineeringIcon sx={{ fontSize: 28, color: colors.primaryBlue }} />, title: 'Certified Technicians', description: 'Every technician passes a thorough background check before working in your home.' },
  { icon: <HandshakeIcon sx={{ fontSize: 28, color: colors.primaryBlue }} />, title: 'Satisfaction-Focused', description: 'We do not consider a job done until you are satisfied with the work and service.' },
];

const faqs = [
  { question: 'Do you offer emergency service?', answer: 'Yes. We provide 24/7 emergency service for urgent issues including water leaks, burning smells, electrical hazards, and complete appliance failures. Emergency requests are prioritized and receive same-day response.' },
  { question: 'What appliances do you repair?', answer: 'We repair all major home appliances including refrigerators, washers, dryers, dishwashers, ovens, stoves, microwaves, and more. We also service HVAC systems, plumbing, electrical, and smart home equipment.' },
  { question: 'Is there a diagnostic fee?', answer: 'A diagnostic fee may apply depending on the appliance type and service needed. This covers the technician visit and initial assessment. The technician will explain the full cost before any repair work begins.' },
  { question: 'How soon can a technician come?', answer: 'For regular service, we typically schedule within 1–3 business days based on your preferred time window. Same-day requests depend on availability. Emergency requests receive priority response.' },
  { question: 'Do you service HVAC, plumbing, or electrical issues?', answer: 'Yes. In addition to appliance repair, we offer HVAC support, plumbing services, and electrical services through our licensed technician network.' },
  { question: 'Can I track my service request?', answer: 'Yes. Use the Track Request section on our homepage or contact us directly by phone or email. We will provide status updates as your request moves from scheduling through completion.' },
];

const serviceCoverageItems = [
  'Appliance repair',
  'Appliance installation',
  'HVAC service',
  'Plumbing service',
  'Emergency priority',
];

const majorBrands: { name: string; logo: string }[] = [
  { name: 'Samsung', logo: '/Samsung_Logo.svg.png' },
  { name: 'LG', logo: '/LG-Logo.png' },
  { name: 'Whirlpool', logo: '/Whirlpool-Logo.png' },
  { name: 'Bosch', logo: '/Bosch-Logo.png' },
  { name: 'GE', logo: '/General_Electric_logo.svg.png' },
  { name: 'Maytag', logo: '/images/brands/maytag.svg' },
  { name: 'Frigidaire', logo: '/images/brands/frigidaire.svg' },
  { name: 'KitchenAid', logo: '/images/brands/kitchenaid.svg' },
  { name: 'Electrolux', logo: '/images/brands/electrolux.svg' },
  { name: 'Amana', logo: '/images/brands/amana.svg' },
  { name: 'Speed Queen', logo: '/images/brands/speed-queen.svg' },
  { name: 'Hotpoint', logo: '/images/brands/hotpoint.svg' },
];

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const Home: React.FC = () => {
  const navigate = useNavigate();

  // Scheduler state
  const [schedulerService, setSchedulerService] = useState('');
  const [schedulerZip, setSchedulerZip] = useState('');
  const [schedulerZipTouched, setSchedulerZipTouched] = useState(false);
  const [schedulerUrgency, setSchedulerUrgency] = useState<'regular' | 'sameday' | 'emergency'>('regular');

  // Service cards state
  const [activeCategory, setActiveCategory] = useState<ServiceCategoryTab>('Appliances');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // Service areas ZIP checker
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

  const schedulerZipValidation = validateZipCode(schedulerZip);
  const schedulerCanContinue = Boolean(schedulerService) && schedulerZipValidation.isValid;
  const areaZipValidation = validateZipCode(areaZip);
  const areaZipInCoverage = areaZipValidation.isInServiceArea;

  const handleAreaZipCheck = () => {
    setAreaZipTouched(true);
    if (!areaZipValidation.isValid) return;
    navigate(`/scheduler?${new URLSearchParams({ zipCode: areaZip }).toString()}`);
  };

  const schedulerContinue = () => {
    setSchedulerZipTouched(true);
    if (!schedulerCanContinue) return;

    const found = allServiceOptions.find((o) => o.id === schedulerService);
    const state = {
      serviceCategory: found?.categoryId ?? '',
      serviceType: schedulerService,
      sameDayRequested: schedulerUrgency === 'sameday',
      zipCode: schedulerZip,
    };
    if (schedulerUrgency === 'emergency') {
      navigate('/emergency-service', { state });
    } else {
      navigate('/book/regular', { state });
    }
  };

  const handleContactSubmit = () => {
    if (contactName && contactEmail && contactMessage) setContactSent(true);
  };

  const heroImageSrc = '/images/services/hero-appliance-technician.webp';

  const heroFieldLabelSx = {
    fontFamily: fonts.body,
    fontWeight: 600,
    fontSize: '0.8rem',
    color: colors.darkText,
    mb: 0.75,
    display: 'block',
  };

  const heroBookingCard = (
    <Box className="hero-booking-card">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.75 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              backgroundColor: colors.lightBlueBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CalendarMonthIcon sx={{ color: colors.primaryBlue, fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '1.05rem', color: colors.navy, lineHeight: 1.2 }}>
              Book Your Service
            </Typography>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: colors.mutedText, mt: 0.15 }}>
              It only takes a minute
            </Typography>
          </Box>
        </Box>

        <Typography component="label" sx={heroFieldLabelSx}>What do you need help with?</Typography>
        <FormControl fullWidth size="small" className="hero-form-input" sx={{ mb: 1.25 }}>
          <Select
            value={schedulerService}
            displayEmpty
            onChange={(e: SelectChangeEvent<string>) => setSchedulerService(e.target.value)}
            renderValue={(v) => v ? allServiceOptions.find((o) => o.id === v)?.label ?? v : 'Select a service'}
            MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
            input={
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">
                    <CalendarMonthIcon sx={{ fontSize: 20, color: colors.mutedText }} />
                  </InputAdornment>
                }
              />
            }
          >
            {serviceCategories.map((cat) => [
              <MenuItem key={`cat-${cat.id}`} disabled value="" sx={{ fontFamily: fonts.body, fontWeight: 700, color: colors.navy, fontSize: '0.8rem', opacity: '1 !important' }}>
                — {cat.title}
              </MenuItem>,
              ...cat.services.map((s) => (
                <MenuItem key={s.id} value={s.id} sx={{ fontFamily: fonts.body, pl: 3 }}>
                  {s.label}
                </MenuItem>
              )),
            ])}
          </Select>
        </FormControl>

        <Typography component="label" sx={heroFieldLabelSx}>ZIP Code</Typography>
        <TextField
          fullWidth
          size="small"
          className="hero-form-input"
          placeholder="Enter your ZIP code"
          value={schedulerZip}
          onChange={(e) => setSchedulerZip(normalizeZipInput(e.target.value))}
          onBlur={() => setSchedulerZipTouched(true)}
          inputProps={{ inputMode: 'numeric', maxLength: 5, pattern: '[0-9]{5}' }}
          error={isZipFieldError(schedulerZip, schedulerZipTouched)}
          helperText={getZipFieldHelperText(schedulerZip, schedulerZipTouched) || ' '}
          FormHelperTextProps={{ sx: { mx: 0, fontFamily: fonts.body, fontSize: '0.75rem', minHeight: '1.25em' } }}
          sx={{ mb: 1.25 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon sx={{ fontSize: 20, color: colors.mutedText }} />
              </InputAdornment>
            ),
          }}
        />

        <Typography component="label" sx={heroFieldLabelSx}>How soon do you need service?</Typography>
        <FormControl fullWidth size="small" className="hero-form-input" sx={{ mb: 1.75 }}>
          <Select
            value={schedulerUrgency}
            onChange={(e) => setSchedulerUrgency(e.target.value as typeof schedulerUrgency)}
            input={
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">
                    <AccessTimeIcon sx={{ fontSize: 20, color: colors.mutedText }} />
                  </InputAdornment>
                }
              />
            }
          >
            <MenuItem value="regular" sx={{ fontFamily: fonts.body }}>Schedule at a convenient time</MenuItem>
            <MenuItem value="sameday" sx={{ fontFamily: fonts.body }}>Same-day service</MenuItem>
            <MenuItem value="emergency" sx={{ fontFamily: fonts.body }}>Emergency — right away</MenuItem>
          </Select>
        </FormControl>

        <Button
          fullWidth
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          disabled={!schedulerCanContinue}
          onClick={schedulerContinue}
          sx={{
            backgroundColor: colors.primaryBlue,
            color: colors.white,
            fontFamily: fonts.heading,
            fontWeight: 600,
            fontSize: '1rem',
            textTransform: 'none',
            borderRadius: '14px',
            height: 48,
            boxShadow: '0 12px 30px rgba(10, 37, 64, 0.18)',
            '&:hover': { backgroundColor: colors.primaryBlueHover },
            '&.Mui-disabled': { backgroundColor: colors.border, color: colors.mutedText, boxShadow: 'none' },
          }}
        >
          Continue
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 1.5, justifyContent: 'center' }}>
          <LockOutlinedIcon sx={{ fontSize: 14, color: colors.mutedText }} />
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.71rem', color: colors.mutedText }}>
            Your information is secure and private
          </Typography>
        </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.background }}>
      {/* ── Hero — unified banner: navy text left, image blends across, card floats right ── */}
      <Box
        id="home"
        sx={{
          position: 'relative',
          background: 'linear-gradient(135deg, #071B41 0%, #0B2D6B 55%, #0D3A82 100%)',
          pt: { xs: 5, md: 6 },
          pb: { xs: 4, md: 5, lg: 5 },
          minHeight: { md: 560, lg: 600 },
          overflow: 'hidden',
        }}
      >
        {/* Desktop: full-width ambient image — one continuous banner, no boxed panel */}
        <Box
          aria-hidden
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
          }}
        >
          {/* Soft peripheral glow — never covers the technician center */}
          <Box
            component="img"
            src={heroImageSrc}
            alt=""
            sx={{
              position: 'absolute',
              inset: '-48px',
              width: 'calc(100% + 96px)',
              height: 'calc(100% + 96px)',
              objectFit: 'cover',
              objectPosition: '54% 38%',
              filter: 'blur(42px) brightness(1.12) saturate(1.08)',
              opacity: 0.32,
              WebkitMaskImage: 'radial-gradient(ellipse 68% 88% at 52% 40%, transparent 30%, rgba(0,0,0,0.35) 58%, black 100%)',
              maskImage: 'radial-gradient(ellipse 68% 88% at 52% 40%, transparent 30%, rgba(0,0,0,0.35) 58%, black 100%)',
            }}
          />
          {/* Sharp technician — clear subject, feathered edges only */}
          <Box
            component="img"
            src={heroImageSrc}
            alt=""
            loading="eager"
            fetchPriority="high"
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: '54% 38%',
              WebkitMaskImage: `
                linear-gradient(to right,
                  transparent 0%,
                  rgba(0,0,0,0.12) 10%,
                  rgba(0,0,0,0.45) 20%,
                  black 30%,
                  black 72%,
                  rgba(0,0,0,0.08) 82%,
                  transparent 90%
                )
              `,
              maskImage: `
                linear-gradient(to right,
                  transparent 0%,
                  rgba(0,0,0,0.12) 10%,
                  rgba(0,0,0,0.45) 20%,
                  black 30%,
                  black 72%,
                  rgba(0,0,0,0.08) 82%,
                  transparent 90%
                )
              `,
            }}
          />
          {/* Smooth left-to-right fade — no solid block, image shows through */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(
                90deg,
                rgba(11, 61, 145, 0.92) 0%,
                rgba(11, 61, 145, 0.74) 24%,
                rgba(11, 61, 145, 0.28) 42%,
                rgba(11, 61, 145, 0.06) 56%,
                rgba(11, 61, 145, 0.00) 66%
              )`,
            }}
          />
        </Box>

        <Container
          maxWidth="xl"
          sx={{
            maxWidth: '1280px !important',
            px: { xs: 2, sm: 3 },
            pl: { md: 1, lg: 1.5 },
            pr: { md: 2, lg: 2.5 },
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              minHeight: { md: 400, lg: 440 },
            }}
          >
            {/* Left: headline + CTAs — stays readable, does not overlap image subject */}
            <Box sx={{ maxWidth: { md: '42%', lg: '38%' }, pb: { xs: 1, lg: 1.5 }, pt: 0, position: 'relative', zIndex: 2, ml: { md: -2.5, lg: -3.5 } }}>
              {/* Trust badge */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  backgroundColor: 'rgba(79,195,247,0.14)',
                  border: '1px solid rgba(79,195,247,0.28)',
                  borderRadius: '20px',
                  px: 1.5,
                  py: 0.45,
                  mb: 2,
                }}
              >
                <VerifiedIcon sx={{ color: '#4FC3F7', fontSize: 14 }} />
                <Typography sx={{ fontFamily: fonts.body, fontSize: '0.76rem', fontWeight: 600, color: '#BDE8FF' }}>
                  Trusted Local Appliance Service
                </Typography>
              </Box>

              {/* Heading */}
              <Typography
                variant="h1"
                sx={{
                  fontFamily: fonts.heading,
                  fontWeight: 800,
                  fontSize: { xs: '1.85rem', md: '2.2rem', lg: '2.5rem' },
                  color: '#FFFFFF',
                  lineHeight: 1.1,
                  mb: 1.5,
                  letterSpacing: '-0.4px',
                }}
              >
                Professional Appliance Repair{' '}
                <Box component="span" sx={{ color: '#4FC3F7' }}>Made Easy</Box>
              </Typography>

              {/* Subtext */}
              <Typography
                sx={{
                  fontFamily: fonts.body,
                  fontSize: { xs: '0.92rem', md: '0.98rem' },
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.6,
                  mb: 2.5,
                  maxWidth: '440px',
                }}
              >
                Book trusted technicians for appliance repair, installation, HVAC, plumbing, and urgent service needs.
              </Typography>

              {/* CTAs */}
              <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'flex-start' }, mb: 2.5 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/scheduler')}
                  sx={{
                    ...heroCtaButtonSx,
                    backgroundColor: colors.primaryBlue,
                    color: colors.white,
                    boxShadow: '0 12px 30px rgba(10, 37, 64, 0.18)',
                    '&:hover': {
                      backgroundColor: colors.primaryBlueHover,
                      boxShadow: '0 18px 40px rgba(10, 37, 64, 0.22)',
                    },
                  }}
                >
                  Book Service
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/emergency-service')}
                  sx={{
                    ...heroCtaButtonSx,
                    backgroundColor: colors.white,
                    color: colors.primaryBlue,
                    border: `1px solid ${colors.primaryBlue}`,
                    boxShadow: '0 12px 30px rgba(10, 37, 64, 0.12)',
                    '&:hover': {
                      backgroundColor: colors.lightBlueBg,
                      boxShadow: '0 16px 36px rgba(10, 37, 64, 0.16)',
                    },
                  }}
                >
                  Emergency Service
                </Button>
              </Box>

              {/* Trust row */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.5, md: 2.5 }, alignItems: 'center' }}>
                {['Licensed & Insured', 'Same-Day Available', 'Estimate After Diagnosis'].map((item) => (
                  <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 14, color: '#4FC3F7' }} />
                    <Typography sx={{ fontFamily: fonts.body, fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.82)' }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Mobile: image visible above, card below — does not overlap subject */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, pb: 3 }}>
            <Box
              sx={{
                position: 'relative',
                height: 260,
                mx: -1,
                mb: 0,
                overflow: 'hidden',
                borderRadius: '16px',
              }}
            >
              <Box
                component="img"
                src={heroImageSrc}
                alt=""
                aria-hidden
                sx={{
                  position: 'absolute',
                  inset: '-28px',
                  width: 'calc(100% + 56px)',
                  height: 'calc(100% + 56px)',
                  objectFit: 'cover',
                  objectPosition: '54% 38%',
                  filter: 'blur(32px) brightness(1.08)',
                  opacity: 0.35,
                }}
              />
              <Box
                component="img"
                src={heroImageSrc}
                alt="Certified appliance repair technician giving thumbs up"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: '54% 38%',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 62%, rgba(0,0,0,0.4) 85%, transparent 100%)',
                  maskImage: 'linear-gradient(to bottom, black 62%, rgba(0,0,0,0.4) 85%, transparent 100%)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: `
                    linear-gradient(180deg, rgba(11,61,145,0.12) 0%, transparent 40%, transparent 100%),
                    linear-gradient(90deg, rgba(11,61,145,0.28) 0%, rgba(11,61,145,0.04) 45%, transparent 72%)
                  `,
                }}
              />
            </Box>
            <Box sx={{ position: 'relative', zIndex: 2, mt: 3 }}>
              {heroBookingCard}
            </Box>
          </Box>
        </Container>

        {/* Desktop booking card — tucked to far right, below face/thumbs-up */}
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'absolute',
            right: { md: '16px', lg: '24px' },
            top: { md: 96, lg: 104 },
            width: '100%',
            maxWidth: { md: '300px', lg: '320px' },
            zIndex: 4,
            pointerEvents: 'auto',
          }}
        >
          {heroBookingCard}
        </Box>
      </Box>

      {/* ── What Needs Service? ── */}
      <Box id="services" sx={{ py: { xs: 7, md: 10 }, backgroundColor: colors.surface }}>
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
                      loading="lazy"
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
      <Box id="why-choose-us" sx={{ py: { xs: 7, md: 9 }, backgroundColor: '#FFFFFF', scrollMarginTop: '80px' }}>
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
      <Box id="brands" sx={{ py: { xs: 7, md: 9 }, backgroundColor: '#F8FAFC', scrollMarginTop: '80px' }}>
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
                    height: { xs: 44, md: 52 },
                    px: { xs: 1, md: 1.5 },
                  }}
                >
                  <Box
                    component="img"
                    src={brand.logo}
                    alt={`${brand.name} appliance repair`}
                    loading="lazy"
                    sx={{
                      height: { xs: 32, md: 40 },
                      maxWidth: { xs: 110, md: 140 },
                      width: 'auto',
                      objectFit: 'contain',
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
      <Box id="service-areas" sx={{ py: { xs: 7, md: 9 }, backgroundColor: '#F5F7FA', scrollMarginTop: '80px' }}>
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
                  We don&apos;t currently service ZIP {areaZip}. Call (888) 555-0199 to check nearby options.
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

              <ServiceAreaMap height={{ xs: 220, md: 280 }} />
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
                    <Box component="span" sx={{ color: '#1A73E8', fontWeight: 700 }}>+1 (555) 123-4567</Box>
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      <SiteFooter />
    </Box>
  );
};

export default Home;
