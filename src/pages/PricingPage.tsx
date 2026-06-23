import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
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
import {
  Refrigerator,
  Snowflake,
  Droplets,
  Zap,
  HouseWifi,
  DoorOpen,
  AlertTriangle,
  Calculator,
  LucideIcon,
} from 'lucide-react';
import { colors, fonts, primaryButtonSx, secondaryButtonSx, heroCtaButtonSx, heroCtaInnerSx } from '../theme';
import ServiceAreaMap from '../components/ServiceAreaMap';
import TransparentPricingSection from '../components/TransparentPricingSection';
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
  { title: 'Type of service', description: 'Repair, installation, or maintenance carries different labor and parts needs.' },
  { title: 'Parts required', description: 'Replacement parts and materials are quoted separately from the visit fee.' },
  { title: 'Urgency / after-hours', description: 'Same-day and emergency visits include a priority scheduling fee.' },
  { title: 'Complexity of repair', description: 'Older systems or hard-to-access units may take additional labor time.' },
  { title: 'Location / service area', description: 'Travel distance within our coverage area can affect total cost.' },
  { title: 'Warranty or maintenance plan', description: 'Active plans or warranties may reduce or waive certain fees.' },
];

const TRUST_POINTS = [
  'Upfront starting prices',
  'Request ID tracking on every booking',
  'Professional, vetted service team',
  'Email confirmation for every request',
  'Admin-reviewed service requests',
  'Service across MD, DC, VA, PA, and WV',
];

const FAQ_ITEMS = [
  {
    q: 'Is the diagnostic fee included in the repair?',
    a: 'In most cases, the diagnostic fee is applied toward your repair cost if you choose to proceed with the work after inspection.',
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
    a: `We currently service ${SERVICE_AREA_REGION_LABEL} and surrounding areas across Maryland, Washington DC, Virginia, Pennsylvania, and West Virginia. Enter your ZIP in the estimator to confirm coverage.`,
  },
];

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PricingCategoryId>('appliances');

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
          py: { xs: 5.5, md: 7 },
          textAlign: 'center',
          px: 2,
          background: 'linear-gradient(135deg, #071B41 0%, #0B2D6B 55%, #0D3A82 100%)',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h1"
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              color: '#FFFFFF',
              fontSize: { xs: '2rem', md: '2.75rem' },
              mb: 1.5,
              lineHeight: 1.15,
            }}
          >
            Transparent Home Service Pricing
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.body,
              color: 'rgba(255,255,255,0.85)',
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.7,
              maxWidth: 640,
              mx: 'auto',
              mb: 3.5,
            }}
          >
            Get a clear starting estimate for appliance repair, HVAC, plumbing, electrical, smart home, and garage door services before you book.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              onClick={() => navigate('/scheduler')}
              sx={{ ...primaryButtonSx, ...heroCtaButtonSx }}
            >
              <Box sx={heroCtaInnerSx}>Book a Service</Box>
            </Button>
            <Button
              onClick={() => navigate('/scheduler?serviceType=E')}
              sx={{ ...secondaryButtonSx, ...heroCtaButtonSx, backgroundColor: 'transparent', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.5)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
            >
              <Box sx={heroCtaInnerSx}>Emergency Service</Box>
            </Button>
          </Box>
        </Container>
      </Box>

      <TransparentPricingSection />

      {/* Category tabs + pricing grid */}
      <Box sx={{ py: { xs: 6, md: 9 } }}>
        <Container maxWidth={false} sx={{ maxWidth: '1180px', mx: 'auto', px: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
              mb: 4,
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                minWidth: 'max-content',
                backgroundColor: '#EEF2F7',
                borderRadius: '16px',
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
                  borderRadius: '18px',
                  border: '1px solid #E4E7EB',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 4px 16px rgba(10,37,64,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: fonts.heading,
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: colors.navy,
                    mb: 1,
                  }}
                >
                  {item.name}
                </Typography>
                <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 1 }}>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: fonts.heading,
                        fontWeight: 800,
                        fontSize: '1.15rem',
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

      {/* Cost estimator */}
      <Box sx={{ py: { xs: 6, md: 9 }, backgroundColor: '#FFFFFF', borderTop: '1px solid #EEF0F3' }}>
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
            Answer a few quick questions to get a starting estimate.
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
              Not sure? Match me with an expert →
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
              <Box sx={{ display: 'grid', gap: 2 }}>
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
                        {item.name}
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
                  sx={fieldSx}
                />

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

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleCalculate}
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
                  Calculate Estimate
                </Button>

                {estError && (
                  <Typography sx={{ fontFamily: fonts.body, color: colors.emergency, fontSize: '0.9rem', textAlign: 'center' }}>
                    {estError}
                  </Typography>
                )}

                {estimate && (
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: '16px',
                      border: '1px solid #D0E3FF',
                      backgroundColor: '#F0F6FF',
                      display: 'grid',
                      gap: 1.5,
                    }}
                  >
                    <Typography sx={{ fontFamily: fonts.body, fontSize: '0.88rem', color: '#64748B', textAlign: 'center' }}>
                      Estimate for {estimate.itemName} — {estimate.urgencyLabel}
                    </Typography>

                    {estimate.quoteRequired ? (
                      <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, color: colors.navy, fontSize: '1.3rem', textAlign: 'center' }}>
                        Quote required after inspection
                      </Typography>
                    ) : (
                      <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontFamily: fonts.body, fontSize: '0.9rem', color: colors.darkText }}>
                          <span>{estimate.isDiagnostic ? 'Diagnostic / visit fee' : 'Starting labor estimate'}</span>
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
                      Final pricing may vary after technician inspection.
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

                <Typography sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: '#94A3B8', textAlign: 'center', lineHeight: 1.6 }}>
                  Prices shown are starting estimates. Final pricing depends on diagnosis, parts, labor, accessibility, and service urgency.
                </Typography>
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontFamily: fonts.heading,
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    color: colors.navy,
                    mb: 1.5,
                  }}
                >
                  Service Coverage Map
                </Typography>
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
                      ZIP {estZip} is in our service area.
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
                      ZIP {estZip} is outside our coverage area.
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
            Starting prices give you a baseline. A few factors determine your final cost.
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 2.5,
              alignItems: 'stretch',
            }}
          >
            {PRICE_FACTORS.map((factor) => (
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
                <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '1rem', color: colors.navy, mb: 0.75 }}>
                  {factor.title}
                </Typography>
                <Typography sx={{ fontFamily: fonts.body, fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6 }}>
                  {factor.description}
                </Typography>
              </Box>
            ))}
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
              gap: 2,
              maxWidth: 900,
              mx: 'auto',
            }}
          >
            {TRUST_POINTS.map((point) => (
              <Box key={point} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                <CheckCircleOutlineIcon sx={{ color: colors.skyBlue, fontSize: 22, mt: '1px' }} />
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
              sx={{
                mb: 1.5,
                borderRadius: '14px !important',
                border: '1px solid #E4E7EB',
                boxShadow: 'none',
                '&:before': { display: 'none' },
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
            Book online in minutes. A technician provides an upfront estimate before any work begins.
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
