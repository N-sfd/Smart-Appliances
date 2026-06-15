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
} from '@mui/material';
import {
  Refrigerator,
  Snowflake,
  Droplets,
  Zap,
  HouseWifi,
  Calculator,
  LucideIcon,
} from 'lucide-react';
import { colors, fonts } from '../theme';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ServiceAreaMap from '../components/ServiceAreaMap';
import {
  normalizeZipInput,
  validateZipCode,
  getZipFieldHelperText,
  isZipFieldError,
  SERVICE_AREA_REGION_LABEL,
} from '../data/serviceAreas';
import {
  PRICING_CATEGORIES,
  APPLIANCE_PRICING_OPTIONS,
  PRICING_TIME_SLOTS,
  PricingCategoryId,
  calculateApplianceEstimate,
  formatPrice,
  formatPriceRange,
  getPricingScheduleDates,
  type PriceEstimate,
} from '../data/pricingData';

const CATEGORY_ICONS: Record<PricingCategoryId, LucideIcon> = {
  appliances: Refrigerator,
  hvac: Snowflake,
  plumbing: Droplets,
  electrical: Zap,
  'smart-home': HouseWifi,
};


const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PricingCategoryId>('appliances');

  const [applianceId, setApplianceId] = useState('');
  const [issueId, setIssueId] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [zipTouched, setZipTouched] = useState(false);
  const [estimate, setEstimate] = useState<PriceEstimate | null>(null);
  const [calcError, setCalcError] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');

  const scheduleDates = useMemo(() => getPricingScheduleDates(), []);

  const category = PRICING_CATEGORIES.find((c) => c.id === activeTab)!;

  const selectedAppliance = useMemo(
    () => APPLIANCE_PRICING_OPTIONS.find((a) => a.id === applianceId),
    [applianceId],
  );

  const zipValidation = validateZipCode(zipCode);
  const canCalculate = Boolean(applianceId && issueId && zipValidation.isValid);
  const canBook = Boolean(estimate && preferredDate && preferredTime);

  const resetEstimate = () => {
    setEstimate(null);
    setPreferredDate('');
    setPreferredTime('');
    setCalcError('');
  };

  const handleApplianceChange = (e: SelectChangeEvent<string>) => {
    setApplianceId(e.target.value);
    setIssueId('');
    resetEstimate();
  };

  const handleCalculate = () => {
    setZipTouched(true);
    if (!applianceId || !issueId) {
      setCalcError('Please select your appliance and issue.');
      resetEstimate();
      return;
    }
    const zipResult = validateZipCode(zipCode);
    if (!zipResult.isValid) {
      setCalcError(zipResult.message ?? 'Enter a valid 5-digit ZIP code.');
      resetEstimate();
      return;
    }
    const result = calculateApplianceEstimate(applianceId, issueId, zipCode);
    if (!result) {
      setCalcError('Unable to calculate estimate. Please try again.');
      return;
    }
    setCalcError('');
    setEstimate(result);
  };

  const bookFromEstimate = () => {
    if (!estimate || !canBook) return;
    const params = new URLSearchParams({
      serviceType: 'R',
      zipCode: estimate.zipCode,
      productName: estimate.applianceLabel,
      serviceCategory: 'Appliance',
    });
    navigate(`/scheduler?${params.toString()}`, {
      state: {
        serviceType: estimate.serviceId,
        zipCode: estimate.zipCode,
        issueDescription,
        preferredDate,
        preferredTime,
      },
    });
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': { backgroundColor: '#FFFFFF', borderRadius: '12px' },
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* Hero */}
      <Box
        sx={{
          py: { xs: 7, md: 9 },
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
            Budget-Friendly Home Services
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.body,
              color: 'rgba(255,255,255,0.85)',
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.7,
              maxWidth: 620,
              mx: 'auto',
            }}
          >
            Discover affordable service pricing and get a quick appliance repair estimate before you book.
          </Typography>
        </Container>
      </Box>

      {/* Category tabs + pricing grid */}
      <Box sx={{ py: { xs: 5, md: 7 } }}>
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
              mb: 2,
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
                }}
              >
                <Typography
                  sx={{
                    fontFamily: fonts.heading,
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: colors.navy,
                    mb: 0.5,
                  }}
                >
                  {item.name}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: fonts.body,
                    fontSize: '0.85rem',
                    color: '#64748B',
                    lineHeight: 1.55,
                    mb: 1.5,
                    minHeight: 40,
                  }}
                >
                  {item.description}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: fonts.heading,
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    color: colors.primaryBlue,
                  }}
                >
                  {formatPriceRange(item.priceFrom, item.priceTo)}
                </Typography>
                {item.note && (
                  <Typography sx={{ fontFamily: fonts.body, fontSize: '0.75rem', color: '#94A3B8', mt: 1 }}>
                    {item.note}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>

          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.8rem', color: '#94A3B8', mb: 6 }}>
            Prices are estimates. Final cost is confirmed after diagnosis. Parts and labor may vary by brand and model.
          </Typography>
        </Container>
      </Box>

      {/* Appliance repair cost calculator */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#FFFFFF', borderTop: '1px solid #EEF0F3' }}>
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
              Appliance Repair Cost Calculator
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
            Get a price estimate for your appliance repair by filling in the details below.
          </Typography>

          <Box
            sx={{
              p: { xs: 2.5, md: 3.5 },
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
              <Box sx={{ display: 'grid', gap: 2.5 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="pricing-appliance-label">Your appliance</InputLabel>
                  <Select
                    labelId="pricing-appliance-label"
                    label="Your appliance"
                    value={applianceId}
                    onChange={handleApplianceChange}
                    sx={fieldSx}
                  >
                    <MenuItem value="">
                      <em>Select appliance</em>
                    </MenuItem>
                    {APPLIANCE_PRICING_OPTIONS.map((a) => (
                      <MenuItem key={a.id} value={a.id}>
                        {a.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small" disabled={!selectedAppliance}>
                  <InputLabel id="pricing-issue-label">Select the issue</InputLabel>
                  <Select
                    labelId="pricing-issue-label"
                    label="Select the issue"
                    value={issueId}
                    onChange={(e) => {
                      setIssueId(e.target.value);
                      resetEstimate();
                    }}
                    sx={fieldSx}
                  >
                    <MenuItem value="">
                      <em>What&apos;s wrong with your appliance?</em>
                    </MenuItem>
                    {(selectedAppliance?.issues ?? []).map((issue) => (
                      <MenuItem key={issue.id} value={issue.id}>
                        {issue.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="What's wrong with your appliance?"
                  placeholder="Please write as many details as possible (e.g. my refrigerator is no longer cooling and is making a loud noise)"
                  value={issueDescription}
                  onChange={(e) => {
                    setIssueDescription(e.target.value);
                    resetEstimate();
                  }}
                  sx={fieldSx}
                />

                <TextField
                  fullWidth
                  size="small"
                  label="Your ZIP code"
                  placeholder="Zip code"
                  value={zipCode}
                  onChange={(e) => {
                    setZipCode(normalizeZipInput(e.target.value));
                    resetEstimate();
                  }}
                  onBlur={() => setZipTouched(true)}
                  error={isZipFieldError(zipCode, zipTouched || zipCode.length === 5)}
                  helperText={getZipFieldHelperText(zipCode, zipTouched || zipCode.length === 5)}
                  inputProps={{ inputMode: 'numeric', maxLength: 5 }}
                  sx={fieldSx}
                />

                <Button
                  fullWidth
                  variant="contained"
                  disabled={!canCalculate}
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
                    '&.Mui-disabled': {
                      backgroundColor: '#CBD5E1',
                      color: '#FFFFFF',
                    },
                  }}
                >
                  Calculate
                </Button>

                {calcError && (
                  <Typography sx={{ fontFamily: fonts.body, color: colors.emergency, fontSize: '0.9rem', textAlign: 'center' }}>
                    {calcError}
                  </Typography>
                )}

                {estimate && (
                  <Box sx={{ display: 'grid', gap: 2.5 }}>
                    <Box
                      sx={{
                        p: 2.5,
                        borderRadius: '16px',
                        border: '1px solid #D0E3FF',
                        backgroundColor: '#F0F6FF',
                      }}
                    >
                      <Typography sx={{ fontFamily: fonts.body, fontSize: '0.88rem', color: '#64748B', mb: 2, textAlign: 'center' }}>
                        Our estimate for {estimate.applianceLabel} — {estimate.issueLabel}
                      </Typography>
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '1fr auto 1fr',
                          alignItems: 'center',
                          gap: 1.5,
                        }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.75rem', color: '#94A3B8', mb: 0.5 }}>
                            Low
                          </Typography>
                          <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, color: colors.navy, fontSize: '1rem' }}>
                            {formatPrice(estimate.min)}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center', px: 1 }}>
                          <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, color: colors.primaryBlue, fontSize: '2rem', lineHeight: 1 }}>
                            {formatPrice(estimate.typical)}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.75rem', color: '#94A3B8', mb: 0.5 }}>
                            High
                          </Typography>
                          <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, color: colors.navy, fontSize: '1rem' }}>
                            {formatPrice(estimate.max)}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography sx={{ fontFamily: fonts.body, fontSize: '0.8rem', color: '#64748B', mt: 2, textAlign: 'center' }}>
                        ${estimate.diagnosticFee} diagnostic fee applies and is waived when you proceed with the repair.
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        fontFamily: fonts.heading,
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: colors.navy,
                      }}
                    >
                      When do you need this done?
                    </Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="pricing-date-label">Preferred date</InputLabel>
                        <Select
                          labelId="pricing-date-label"
                          label="Preferred date"
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          sx={fieldSx}
                        >
                          <MenuItem value="">
                            <em>Select date</em>
                          </MenuItem>
                          {scheduleDates.map((date) => (
                            <MenuItem key={date.value} value={date.value}>
                              {date.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth size="small">
                        <InputLabel id="pricing-time-label">Preferred time</InputLabel>
                        <Select
                          labelId="pricing-time-label"
                          label="Preferred time"
                          value={preferredTime}
                          onChange={(e) => setPreferredTime(e.target.value)}
                          sx={fieldSx}
                        >
                          <MenuItem value="">
                            <em>Select time</em>
                          </MenuItem>
                          {PRICING_TIME_SLOTS.map((slot) => (
                            <MenuItem key={slot} value={slot}>
                              {slot}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      disabled={!canBook}
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
                        '&.Mui-disabled': {
                          backgroundColor: '#CBD5E1',
                          color: '#FFFFFF',
                        },
                      }}
                    >
                      Book Now
                    </Button>

                    <Typography sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: '#94A3B8', textAlign: 'center', lineHeight: 1.6 }}>
                      Questions? Call{' '}
                      <Box component="a" href="tel:+18885550199" sx={{ color: colors.primaryBlue, textDecoration: 'none', fontWeight: 700 }}>
                        (888) 555-0199
                      </Box>
                      {' '}· Final price confirmed after in-home diagnosis
                    </Typography>
                  </Box>
                )}
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

                {zipValidation.isInServiceArea && (
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
                      ZIP {zipCode} is in our service area.
                    </Typography>
                  </Box>
                )}

                {zipValidation.isValidFormat && !zipValidation.isInServiceArea && (
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
                      ZIP {zipCode} is outside our coverage area. Calculate and booking are disabled until you enter a supported ZIP.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Bottom CTA */}
      <Box sx={{ py: { xs: 6, md: 7 }, textAlign: 'center', px: 2 }}>
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
            Ready to schedule?
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, color: '#64748B', mb: 3, lineHeight: 1.65 }}>
            Book online in minutes. A technician provides an upfront estimate before any work begins.
          </Typography>
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
        </Container>
      </Box>
    </Box>
  );
};

export default PricingPage;
