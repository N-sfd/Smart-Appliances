import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
  Chip,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import {
  Refrigerator,
  Snowflake,
  Droplets,
  Zap,
  HouseWifi,
  DoorOpen,
  AlertTriangle,
  Calculator,
  Wrench,
  LucideIcon,
} from 'lucide-react';
import { colors, fonts, primaryButtonSx, secondaryButtonSx } from '../theme';
import ServiceAreaMap from '../components/ServiceAreaMap';
import TransparentPricingSection from '../components/TransparentPricingSection';
import { getServiceDisplayName } from '../utils/serviceDisplayNames';
import {
  normalizeZipInput,
  validateZipCode,
  getZipFieldHelperText,
  isZipFieldError,
  SERVICE_AREA_REGION_LABEL,
} from '../data/serviceAreas';
import {
  PRICING_CATEGORIES,
  GENERIC_ISSUE_OPTIONS,
  URGENCY_OPTIONS,
  PricingCategoryId,
  EstimatorUrgency,
  calculateEstimate,
  formatPrice,
  formatStartingPrice,
  type PriceEstimate,
} from '../data/pricingData';

const CATEGORY_ICONS: Record<PricingCategoryId, LucideIcon> = {
  appliances: Refrigerator,
  hvac: Snowflake,
  plumbing: Droplets,
  electrical: Zap,
  'smart-home': HouseWifi,
  'garage-door': DoorOpen,
  emergency: AlertTriangle,
};

const PRICE_FACTORS = [
  { title: 'Type of service', description: 'Repair, installation, or maintenance carries different labor and parts needs.', icon: BuildOutlinedIcon },
  { title: 'Parts required', description: 'Replacement parts and materials are quoted separately from the visit fee.', icon: Inventory2OutlinedIcon },
  { title: 'Urgency / after-hours', description: 'Same-day and emergency visits include a priority scheduling fee.', icon: BoltOutlinedIcon },
  { title: 'Complexity of repair', description: 'Older systems or hard-to-access units may take additional labor time.', icon: EngineeringOutlinedIcon },
  { title: 'Location / service area', description: 'Travel distance within our coverage area can affect total cost.', icon: PlaceOutlinedIcon },
  { title: 'Warranty or maintenance plan', description: 'Active plans or warranties may reduce or waive certain fees.', icon: VerifiedOutlinedIcon },
];

const TRUST_POINTS = [
  'Upfront starting prices',
  'Request ID tracking',
  'Email confirmation',
  'Admin-reviewed requests',
  'Professional service process',
  'Service across MD, DC, VA, PA, and WV',
];

const POPULAR_BUNDLES: {
  title: string;
  fee: string;
  icon: LucideIcon;
  serviceType: 'R' | 'I' | 'M';
  serviceCategory: string;
  productName: string;
}[] = [
  { title: 'Appliance Tune-Up Visit', fee: 'From $89', icon: Wrench, serviceType: 'M', serviceCategory: 'Appliance', productName: 'Appliance Maintenance Visit' },
  { title: 'Same-Day AC Service', fee: 'From $99 + same-day fee', icon: Snowflake, serviceType: 'R', serviceCategory: 'HVAC', productName: 'AC Repair' },
  { title: 'Drain Cleaning Visit', fee: 'From $149', icon: Droplets, serviceType: 'R', serviceCategory: 'Plumbing', productName: 'Drain Cleaning' },
  { title: 'Smart Thermostat Setup', fee: 'From $129', icon: HouseWifi, serviceType: 'I', serviceCategory: 'Smart Home', productName: 'Smart Thermostat Installation' },
  { title: 'Garage Door Safety Check', fee: 'From $129', icon: DoorOpen, serviceType: 'M', serviceCategory: 'Garage Door', productName: 'Garage Door Maintenance' },
];

const FAQ_ITEMS = [
  {
    q: 'Is the service call fee included in the repair?',
    a: 'In most cases, the service call fee is applied toward your repair cost if you choose to proceed with the work after inspection.',
  },
  {
    q: 'Do prices include parts?',
    a: 'Starting prices cover the visit and labor estimate. Parts and materials are quoted separately once your technician identifies what is needed.',
  },
  {
    q: 'Do you offer emergency service?',
    a: 'Yes. Emergency and same-day service is available for urgent issues, with a priority fee added to cover faster scheduling.',
  },
  {
    q: 'Can I get an exact quote online?',
    a: 'Our online estimator gives you a starting price range. An exact quote is confirmed by your technician after an in-home inspection.',
  },
  {
    q: 'How do I track my request?',
    a: 'Every booking generates a request ID. You can check status anytime from the Track Request page using that ID.',
  },
  {
    q: 'Do you service my ZIP code?',
    a: `Online scheduling is available for selected ZIP codes across ${SERVICE_AREA_REGION_LABEL}. Enter your ZIP in the estimator to confirm coverage in your specific area.`,
  },
  {
    q: 'Can the service call fee be applied toward the repair?',
    a: 'Yes. If you move forward with the repair after your technician\'s in-person review, the service call fee is applied toward the total cost.',
  },
  {
    q: "Why can't you give an exact repair price online?",
    a: 'Final pricing depends on the exact cause, parts needed, and labor involved, which can only be confirmed once a technician inspects the issue in person.',
  },
];

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PricingCategoryId>('appliances');
  const estimatorRef = useRef<HTMLDivElement>(null);

  // Estimator state
  const [estCategory, setEstCategory] = useState<PricingCategoryId | ''>('');
  const [estService, setEstService] = useState('');
  const [estIssue, setEstIssue] = useState('');
  const [estZip, setEstZip] = useState('');
  const [estZipTouched, setEstZipTouched] = useState(false);
  const [estUrgency, setEstUrgency] = useState<EstimatorUrgency>('regular');
  const [estDescription, setEstDescription] = useState('');
  const [estimate, setEstimate] = useState<PriceEstimate | null>(null);
  const [estError, setEstError] = useState('');

  const category = PRICING_CATEGORIES.find((c) => c.id === activeTab)!;

  const estServiceOptions = useMemo(
    () => (estCategory ? PRICING_CATEGORIES.find((c) => c.id === estCategory)?.items ?? [] : []),
    [estCategory],
  );

  const estZipValidation = validateZipCode(estZip);

  const fieldSx = {
    '& .MuiOutlinedInput-root': { backgroundColor: '#FFFFFF', borderRadius: '12px' },
  };

  const scrollToEstimator = () => {
    estimatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const goToCategoryBooking = (categoryId: PricingCategoryId) => {
    const cat = PRICING_CATEGORIES.find((c) => c.id === categoryId);
    if (!cat) return;
    if (categoryId === 'emergency' || !cat.schedulerCategory) {
      navigate('/scheduler?serviceType=E');
      return;
    }
    navigate(`/scheduler?serviceCategory=${encodeURIComponent(cat.schedulerCategory)}`);
  };

  const bookItem = (itemName: string) => {
    if (!category.schedulerCategory) {
      navigate('/scheduler?serviceType=E');
      return;
    }
    const params = new URLSearchParams({
      serviceCategory: category.schedulerCategory,
      productName: itemName,
    });
    navigate(`/scheduler?${params.toString()}`);
  };

  const bookBundle = (bundle: typeof POPULAR_BUNDLES[number]) => {
    const params = new URLSearchParams({
      serviceType: bundle.serviceType,
      serviceCategory: bundle.serviceCategory,
      productName: bundle.productName,
    });
    navigate(`/scheduler?${params.toString()}`);
  };

  const handleEstCategoryChange = (e: SelectChangeEvent<string>) => {
    setEstCategory(e.target.value as PricingCategoryId);
    setEstService('');
    setEstimate(null);
    setEstError('');
  };

  const handleCalculate = () => {
    setEstZipTouched(true);
    if (!estCategory || !estService) {
      setEstError('Please select a service category and service.');
      setEstimate(null);
      return;
    }
    const zipResult = validateZipCode(estZip);
    if (!zipResult.isValid) {
      setEstError(zipResult.message ?? 'Enter a valid 5-digit ZIP code.');
      setEstimate(null);
      return;
    }
    const result = calculateEstimate(estCategory, estService, estUrgency, estZip);
    if (!result) {
      setEstError('Unable to calculate estimate. Please try again.');
      return;
    }
    setEstError('');
    setEstimate(result);
  };

  const bookFromEstimate = () => {
    if (!estimate) return;
    if (estimate.schedulerCategory === null) {
      navigate('/scheduler?serviceType=E');
      return;
    }
    const params = new URLSearchParams({
      serviceType: 'R',
      productName: estimate.itemName,
      serviceCategory: estimate.schedulerCategory,
    });
    navigate(`/scheduler?${params.toString()}`, {
      state: { issueDescription: estDescription, zipCode: estimate.zipCode },
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* Hero */}
      <Box
        sx={{
          py: { xs: 5, md: 6 },
          px: 2,
          background: 'linear-gradient(135deg, #071B41 0%, #0B2D6B 55%, #0D3A82 100%)',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: { xs: 4, md: 6 },
            }}
          >
            {/* Left — copy */}
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                variant="h1"
                sx={{
                  fontFamily: fonts.heading,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  fontSize: { xs: '1.85rem', md: '2.4rem' },
                  mb: 1.5,
                  lineHeight: 1.15,
                }}
              >
                Clear, Upfront Home Service Pricing
              </Typography>
              <Typography
                sx={{
                  fontFamily: fonts.body,
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  lineHeight: 1.7,
                  maxWidth: 520,
                  mx: { xs: 'auto', md: 0 },
                  mb: 3,
                }}
              >
                See starting service call fees and estimated costs for appliance, HVAC, plumbing,
                electrical, smart home, and garage door services before you book.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, justifyContent: { xs: 'center', md: 'flex-start' }, flexWrap: 'wrap' }}>
                <Button onClick={() => navigate('/scheduler')} sx={{ ...primaryButtonSx, px: 3.5, py: 1.25 }}>
                  Book a Service
                </Button>
                <Button
                  onClick={scrollToEstimator}
                  sx={{
                    ...secondaryButtonSx,
                    background: 'transparent',
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: '#FFFFFF',
                    px: 3.5,
                    py: 1.25,
                    '&:hover': { background: 'rgba(255,255,255,0.1)', borderColor: '#fff' },
                  }}
                >
                  Calculate Estimate
                </Button>
              </Box>
            </Box>

            {/* Right — trust summary card */}
            <Box sx={{ flex: 1, width: '100%', maxWidth: { xs: 420, md: 'none' } }}>
              <Box
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: '20px',
                  p: { xs: 3, md: 3.5 },
                  boxShadow: '0 24px 56px rgba(0,0,0,0.28)',
                }}
              >
                <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '1.1rem', color: colors.navy, mb: 2 }}>
                  Typical Service Visit
                </Typography>
                <Box sx={{ display: 'grid', gap: 1.5 }}>
                  {[
                    'Service call from $79–$149',
                    'Same-day priority available',
                    'Final price confirmed before work begins',
                    'Request ID tracking included',
                  ].map((row) => (
                    <Box key={row} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <CheckCircleOutlineIcon sx={{ fontSize: 19, color: colors.primaryBlue, mt: '1px', flexShrink: 0 }} />
                      <Typography sx={{ fontFamily: fonts.body, fontSize: '0.92rem', color: colors.darkText, lineHeight: 1.5 }}>
                        {row}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <TransparentPricingSection />

      {/* Category tabs + pricing grid */}
      <Box sx={{ py: { xs: 6, md: 9 } }}>
        <Container maxWidth={false} sx={{ maxWidth: '1180px', mx: 'auto', px: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              p: '6px',
              mb: 4,
              borderRadius: '18px',
              backgroundColor: '#fff',
              border: `1px solid ${colors.border}`,
              boxShadow: '0 4px 16px rgba(10,37,64,0.05)',
            }}
          >
            <Box
              sx={{
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  minWidth: 'max-content',
                  backgroundColor: '#EEF2F7',
                  borderRadius: '14px',
                  p: '5px',
                  gap: '4px',
                }}
              >
                {PRICING_CATEGORIES.map(({ id, label }) => {
                  const Icon = CATEGORY_ICONS[id];
                  const isActive = activeTab === id;
                  return (
                    <Box
                      key={id}
                      component="button"
                      type="button"
                      onClick={() => setActiveTab(id)}
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '7px',
                        px: { xs: '14px', md: '18px' },
                        py: '10px',
                        borderRadius: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: fonts.body,
                        fontWeight: isActive ? 700 : 500,
                        fontSize: { xs: '0.85rem', md: '0.9rem' },
                        color: isActive ? '#1A73E8' : '#64748B',
                        backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                        boxShadow: isActive ? '0 2px 10px rgba(0,0,0,0.10)' : 'none',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.18s ease',
                        '&:hover': {
                          color: '#0B3D91',
                          backgroundColor: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.65)',
                        },
                      }}
                    >
                      <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} color="currentColor" />
                      <span>{label}</span>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>

          <Typography
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '1.5rem', md: '1.85rem' },
              color: colors.navy,
              mb: 1,
            }}
          >
            {category.label} pricing
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.body,
              color: '#64748B',
              fontSize: '1rem',
              lineHeight: 1.65,
              mb: 4,
              maxWidth: 680,
            }}
          >
            {category.subtitle}
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 2,
              mb: 3,
              alignItems: 'stretch',
            }}
          >
            {category.items.map((item) => (
              <Box
                key={item.name}
                sx={{
                  p: 2.5,
                  borderRadius: '20px',
                  border: '1px solid #E4E7EB',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 4px 16px rgba(10,37,64,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 16px 32px rgba(10,37,64,0.1)' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 0.75 }}>
                  <Typography
                    sx={{
                      fontFamily: fonts.heading,
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: colors.navy,
                    }}
                  >
                    {item.displayName ?? item.name}
                  </Typography>
                  {item.quoteRequired && (
                    <Chip
                      label="Estimate"
                      size="small"
                      sx={{ backgroundColor: '#FFF3E0', color: '#E65100', fontFamily: fonts.body, fontWeight: 700, fontSize: '10.5px', height: 22, flexShrink: 0 }}
                    />
                  )}
                </Box>
                {item.description && (
                  <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: '#64748B', lineHeight: 1.5, mb: 1.5 }}>
                    {item.description}
                  </Typography>
                )}
                <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 1 }}>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: fonts.heading,
                        fontWeight: 800,
                        fontSize: '1.05rem',
                        color: colors.primaryBlue,
                      }}
                    >
                      {formatStartingPrice(item)}
                    </Typography>
                    {item.note && !item.priceFrom && (
                      <Typography sx={{ fontFamily: fonts.body, fontSize: '0.75rem', color: '#94A3B8', mt: 0.5 }}>
                        {item.note}
                      </Typography>
                    )}
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => bookItem(item.name)}
                    sx={{
                      borderRadius: '10px',
                      borderColor: colors.primaryBlue,
                      color: colors.primaryBlue,
                      fontFamily: fonts.body,
                      fontWeight: 700,
                      textTransform: 'none',
                      fontSize: '0.78rem',
                      px: 1.5,
                      flexShrink: 0,
                      '&:hover': { backgroundColor: colors.lightBlueBg },
                    }}
                  >
                    Book
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>

          <Button
            variant="outlined"
            onClick={() => goToCategoryBooking(activeTab)}
            sx={{
              borderRadius: '12px',
              borderColor: colors.primaryBlue,
              color: colors.primaryBlue,
              fontFamily: fonts.body,
              fontWeight: 700,
              textTransform: 'none',
              mb: 2,
              '&:hover': { backgroundColor: colors.lightBlueBg },
            }}
          >
            Book a {category.label} Service
          </Button>

          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.8rem', color: '#94A3B8' }}>
            Prices shown are starting estimates. Final pricing depends on diagnosis, parts, labor, accessibility, and service urgency.
          </Typography>
        </Container>
      </Box>

      {/* Popular service bundles */}
      <Box sx={{ py: { xs: 6, md: 9 }, backgroundColor: colors.sectionBg }}>
        <Container maxWidth="lg">
          <Typography
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '1.5rem', md: '1.85rem' },
              color: colors.navy,
              textAlign: 'center',
              mb: 4,
            }}
          >
            Popular Service Requests
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' },
              gap: 2,
              alignItems: 'stretch',
            }}
          >
            {POPULAR_BUNDLES.map((bundle) => {
              const Icon = bundle.icon;
              return (
                <Box
                  key={bundle.title}
                  sx={{
                    p: 2.25,
                    borderRadius: '16px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E4E7EB',
                    boxShadow: '0 4px 16px rgba(10,37,64,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    textAlign: 'center',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 14px 28px rgba(10,37,64,0.1)' },
                  }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
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
                    <Icon size={20} strokeWidth={1.8} />
                  </Box>
                  <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '0.92rem', color: colors.navy, mb: 0.5 }}>
                    {bundle.title}
                  </Typography>
                  <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.primaryBlue, fontWeight: 700, mb: 1.5 }}>
                    {bundle.fee}
                  </Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => bookBundle(bundle)}
                    sx={{
                      borderRadius: '10px',
                      borderColor: colors.primaryBlue,
                      color: colors.primaryBlue,
                      fontFamily: fonts.body,
                      fontWeight: 700,
                      textTransform: 'none',
                      fontSize: '0.78rem',
                      '&:hover': { backgroundColor: colors.lightBlueBg },
                    }}
                  >
                    Book
                  </Button>
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* Cost estimator */}
      <Box ref={estimatorRef} sx={{ py: { xs: 6, md: 9 }, backgroundColor: '#FFFFFF', borderTop: '1px solid #EEF0F3', scrollMarginTop: '96px' }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center', mb: 1 }}>
            <Calculator size={28} color={colors.primaryBlue} strokeWidth={2} />
            <Typography
              sx={{
                fontFamily: fonts.heading,
                fontWeight: 800,
                fontSize: { xs: '1.5rem', md: '1.85rem' },
                color: colors.navy,
                textAlign: 'center',
              }}
            >
              Service Cost Estimator
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: fonts.body,
              color: '#64748B',
              textAlign: 'center',
              mb: 4,
              lineHeight: 1.65,
            }}
          >
            Answer a few quick questions to see a starting estimate and confirm whether we serve your area.
          </Typography>

          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Button
              variant="text"
              onClick={() => navigate('/match-expert')}
              sx={{
                fontFamily: fonts.body,
                fontWeight: 700,
                fontSize: '0.9rem',
                textTransform: 'none',
                color: colors.primaryBlue,
                '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
              }}
            >
              Not sure what you need? Match me with an expert →
            </Button>
          </Box>

          <Box
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: '20px',
              border: '1px solid #C8D8F8',
              backgroundColor: '#FFFFFF',
              boxShadow: colors.cardShadow,
              backgroundImage:
                'radial-gradient(circle at 12% 18%, rgba(26,115,232,0.05) 0%, transparent 42%), radial-gradient(circle at 88% 82%, rgba(26,115,232,0.04) 0%, transparent 38%)',
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1.1fr 0.9fr' },
                gap: { xs: 3, lg: 4 },
                alignItems: 'start',
              }}
            >
              <Box>
                <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '0.95rem', color: colors.navy, mb: 1.5 }}>
                  Tell us about the service
                </Typography>
                <Box sx={{ display: 'grid', gap: 1.75 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="est-category-label">Service category</InputLabel>
                    <Select
                      labelId="est-category-label"
                      label="Service category"
                      value={estCategory}
                      onChange={handleEstCategoryChange}
                      sx={fieldSx}
                    >
                      <MenuItem value="">
                        <em>Select category</em>
                      </MenuItem>
                      {PRICING_CATEGORIES.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                          {c.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small" disabled={!estCategory}>
                    <InputLabel id="est-service-label">Service / product</InputLabel>
                    <Select
                      labelId="est-service-label"
                      label="Service / product"
                      value={estService}
                      onChange={(e) => {
                        setEstService(e.target.value);
                        setEstimate(null);
                        setEstError('');
                      }}
                      sx={fieldSx}
                    >
                      <MenuItem value="">
                        <em>Select service or product</em>
                      </MenuItem>
                      {estServiceOptions.map((item) => (
                        <MenuItem key={item.name} value={item.name}>
                          {item.displayName ?? item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <InputLabel id="est-issue-label">Issue</InputLabel>
                    <Select
                      labelId="est-issue-label"
                      label="Issue"
                      value={estIssue}
                      onChange={(e) => setEstIssue(e.target.value)}
                      sx={fieldSx}
                    >
                      <MenuItem value="">
                        <em>What&apos;s the issue?</em>
                      </MenuItem>
                      {GENERIC_ISSUE_OPTIONS.map((issue) => (
                        <MenuItem key={issue} value={issue}>
                          {issue}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <InputLabel id="est-urgency-label">Urgency</InputLabel>
                    <Select
                      labelId="est-urgency-label"
                      label="Urgency"
                      value={estUrgency}
                      onChange={(e) => {
                        setEstUrgency(e.target.value as EstimatorUrgency);
                        setEstimate(null);
                      }}
                      sx={fieldSx}
                    >
                      {URGENCY_OPTIONS.map((u) => (
                        <MenuItem key={u.id} value={u.id}>
                          {u.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    label="Describe the issue (optional)"
                    placeholder="Add any details that will help your technician prepare"
                    value={estDescription}
                    onChange={(e) => setEstDescription(e.target.value)}
                    sx={fieldSx}
                  />
                </Box>

                <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '0.95rem', color: colors.navy, mt: 2.5, mb: 1.25 }}>
                  Check your area
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  label="ZIP code"
                  placeholder="ZIP code"
                  value={estZip}
                  onChange={(e) => {
                    setEstZip(normalizeZipInput(e.target.value));
                    setEstimate(null);
                  }}
                  onBlur={() => setEstZipTouched(true)}
                  error={isZipFieldError(estZip, estZipTouched || estZip.length === 5)}
                  helperText={getZipFieldHelperText(estZip, estZipTouched || estZip.length === 5)}
                  inputProps={{ inputMode: 'numeric', maxLength: 5, 'aria-label': 'ZIP code' }}
                  sx={{ ...fieldSx, mb: 2 }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleCalculate}
                  sx={{
                    py: 1.3,
                    borderRadius: '14px',
                    backgroundColor: colors.primaryBlue,
                    fontFamily: fonts.body,
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': { backgroundColor: colors.navy },
                  }}
                >
                  Calculate Estimate
                </Button>

                {estError && (
                  <Typography sx={{ fontFamily: fonts.body, color: colors.emergency, fontSize: '0.9rem', textAlign: 'center', mt: 1.5 }}>
                    {estError}
                  </Typography>
                )}

                {estimate && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2.5,
                      borderRadius: '16px',
                      border: '1px solid #D0E3FF',
                      backgroundColor: '#F0F6FF',
                      display: 'grid',
                      gap: 1.5,
                    }}
                  >
                    <Typography sx={{ fontFamily: fonts.body, fontSize: '0.88rem', color: '#64748B', textAlign: 'center' }}>
                      Estimate for {getServiceDisplayName(estimate.itemName)} — {estimate.urgencyLabel}
                    </Typography>

                    {estimate.quoteRequired ? (
                      <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, color: colors.navy, fontSize: '1.3rem', textAlign: 'center' }}>
                        Estimate after review
                      </Typography>
                    ) : (
                      <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontFamily: fonts.body, fontSize: '0.9rem', color: colors.darkText }}>
                          <span>{estimate.isDiagnostic ? 'Service call fee' : 'Starting labor estimate'}</span>
                          <strong>{formatPrice(estimate.baseFee)}</strong>
                        </Box>
                        {estimate.surcharge > 0 && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontFamily: fonts.body, fontSize: '0.9rem', color: colors.darkText }}>
                            <span>{estimate.urgencyLabel} priority fee</span>
                            <strong>{formatPrice(estimate.surcharge)}</strong>
                          </Box>
                        )}
                        <Box sx={{ borderTop: '1px solid #D0E3FF', pt: 1.5, display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, color: colors.navy }}>Estimated total</Typography>
                          <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, color: colors.primaryBlue, fontSize: '1.3rem' }}>
                            {formatPrice(estimate.total)}
                          </Typography>
                        </Box>
                      </>
                    )}

                    <Typography sx={{ fontFamily: fonts.body, fontSize: '0.8rem', color: '#64748B', textAlign: 'center' }}>
                      Final pricing is confirmed before work begins.
                    </Typography>

                    <Button
                      fullWidth
                      variant="contained"
                      onClick={bookFromEstimate}
                      sx={{
                        py: 1.4,
                        borderRadius: '14px',
                        backgroundColor: colors.primaryBlue,
                        fontFamily: fonts.body,
                        fontWeight: 700,
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': { backgroundColor: colors.navy },
                      }}
                    >
                      Book This Service
                    </Button>
                  </Box>
                )}

                <Typography sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: '#94A3B8', textAlign: 'center', lineHeight: 1.6, mt: 1.5 }}>
                  Prices shown are starting estimates. Final pricing depends on diagnosis, parts, labor, accessibility, and service urgency.
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '1.1rem', color: colors.navy }}>
                    Service Coverage Map
                  </Typography>
                  <Chip
                    icon={<PlaceOutlinedIcon sx={{ fontSize: '15px !important', color: `${colors.primaryBlue} !important` }} />}
                    label="Service Coverage"
                    size="small"
                    sx={{ backgroundColor: colors.lightBlueBg, color: colors.primaryBlue, fontFamily: fonts.body, fontWeight: 700, fontSize: '10.5px' }}
                  />
                </Box>
                <Typography sx={{ fontFamily: fonts.body, fontSize: '0.9rem', color: '#64748B', mb: 2, lineHeight: 1.65 }}>
                  We serve {SERVICE_AREA_REGION_LABEL}. Enter a ZIP in our coverage range to calculate pricing and book online.
                </Typography>

                <ServiceAreaMap height={{ xs: 220, md: 260 }} />

                {estZipValidation.isInServiceArea && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 1.5,
                      borderRadius: '12px',
                      backgroundColor: '#ECFDF3',
                      border: '1px solid #BBF7D0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <CheckCircleOutlineIcon sx={{ color: '#15803D', fontSize: 20 }} />
                    <Typography sx={{ fontFamily: fonts.body, fontSize: '0.88rem', fontWeight: 600, color: '#15803D' }}>
                      ZIP {estZip} is within our regional service area.
                    </Typography>
                  </Box>
                )}

                {estZipValidation.isValidFormat && !estZipValidation.isInServiceArea && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 1.5,
                      borderRadius: '12px',
                      backgroundColor: '#FEF2F2',
                      border: '1px solid #FECACA',
                    }}
                  >
                    <Typography sx={{ fontFamily: fonts.body, fontSize: '0.88rem', fontWeight: 600, color: colors.emergency }}>
                      This ZIP may be outside our current service area. Please call us to confirm.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* What affects the final price */}
      <Box sx={{ py: { xs: 6, md: 9 } }}>
        <Container maxWidth="lg">
          <Typography
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '1.5rem', md: '1.85rem' },
              color: colors.navy,
              textAlign: 'center',
              mb: 1,
            }}
          >
            What affects the final price?
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, color: '#64748B', textAlign: 'center', mb: 5, maxWidth: 620, mx: 'auto' }}>
            Starting prices give you a baseline. Your technician confirms the final price before work begins.
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 2.5,
              alignItems: 'stretch',
            }}
          >
            {PRICE_FACTORS.map((factor) => {
              const Icon = factor.icon;
              return (
                <Box
                  key={factor.title}
                  sx={{
                    p: 3,
                    borderRadius: '18px',
                    border: '1px solid #E4E7EB',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 4px 16px rgba(10,37,64,0.04)',
                    height: '100%',
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '10px',
                      backgroundColor: colors.lightBlueBg,
                      color: colors.primaryBlue,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1.5,
                    }}
                  >
                    <Icon sx={{ fontSize: 21 }} />
                  </Box>
                  <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '1rem', color: colors.navy, mb: 0.75 }}>
                    {factor.title}
                  </Typography>
                  <Typography sx={{ fontFamily: fonts.body, fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6 }}>
                    {factor.description}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* Trust section */}
      <Box sx={{ py: { xs: 6, md: 9 }, backgroundColor: colors.navy }}>
        <Container maxWidth="lg">
          <Typography
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '1.5rem', md: '1.85rem' },
              color: '#FFFFFF',
              textAlign: 'center',
              mb: 4,
            }}
          >
            Why customers choose Smart Appliances
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 2.5,
              maxWidth: 900,
              mx: 'auto',
            }}
          >
            {TRUST_POINTS.map((point) => (
              <Box key={point} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                <CheckCircleOutlineIcon sx={{ color: colors.skyBlue, fontSize: 22, mt: '1px', flexShrink: 0 }} />
                <Typography sx={{ fontFamily: fonts.body, fontSize: '0.95rem', color: '#FFFFFF' }}>{point}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* FAQ */}
      <Box sx={{ py: { xs: 6, md: 9 } }}>
        <Container maxWidth="md">
          <Typography
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '1.5rem', md: '1.85rem' },
              color: colors.navy,
              textAlign: 'center',
              mb: 4,
            }}
          >
            Frequently asked questions
          </Typography>
          {FAQ_ITEMS.map((faq) => (
            <Accordion
              key={faq.q}
              disableGutters
              elevation={0}
              sx={{
                mb: 1.5,
                borderRadius: '14px !important',
                border: '1px solid #E4E7EB',
                boxShadow: 'none',
                transition: 'border-color 0.2s ease',
                '&:before': { display: 'none' },
                '&:hover': { borderColor: colors.primaryBlue },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`faq-${faq.q}`}>
                <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '0.95rem', color: colors.navy }}>
                  {faq.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ fontFamily: fonts.body, fontSize: '0.9rem', color: '#64748B', lineHeight: 1.65 }}>
                  {faq.a}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>

      {/* Bottom CTA */}
      <Box sx={{ py: { xs: 6, md: 9 }, textAlign: 'center', px: 2 }}>
        <Container maxWidth="sm">
          <Typography
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '1.35rem', md: '1.6rem' },
              color: colors.navy,
              mb: 1.5,
            }}
          >
            Ready to book your service?
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, color: '#64748B', mb: 3, lineHeight: 1.65 }}>
            Schedule online in minutes and receive a request ID to track your service.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/scheduler')}
              sx={{
                borderRadius: '14px',
                backgroundColor: colors.primaryBlue,
                fontFamily: fonts.body,
                fontWeight: 700,
                textTransform: 'none',
                px: 4,
                py: 1.25,
                '&:hover': { backgroundColor: colors.navy },
              }}
            >
              Book a Service
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/track-request')}
              sx={{
                borderRadius: '14px',
                borderColor: colors.primaryBlue,
                color: colors.primaryBlue,
                fontFamily: fonts.body,
                fontWeight: 700,
                textTransform: 'none',
                px: 4,
                py: 1.25,
                '&:hover': { backgroundColor: colors.lightBlueBg },
              }}
            >
              Track Existing Request
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default PricingPage;
