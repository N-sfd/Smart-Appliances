import React, { useMemo, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import {
  Refrigerator,
  Snowflake,
  Droplets,
  Zap,
  HouseWifi,
  DoorOpen,
  HelpCircle,
  LucideIcon,
} from 'lucide-react';
import { colors, fonts, primaryButtonSx, secondaryButtonSx, heroCtaButtonSx, heroCtaInnerSx } from '../theme';
import {
  EXPERT_CATEGORIES,
  PROBLEM_OPTIONS,
  URGENCY_OPTIONS,
  MATCH_EXPERT_SOURCE_TAG,
  getExpertMatch,
  getExpertSlugForMatch,
  type ExpertCategoryId,
  type EstimatorUrgency,
  type ExpertMatch,
} from '../data/expertMatchRules';
import { SERVICE_AREA_STATES, validateFullName, validateEmailAddress, validateUsPhone } from '../lib/schedulerContactValidation';
import {
  normalizeZipInput,
  validateZipCode,
  getZipFieldHelperText,
  isZipFieldError,
  inferStateFromZip,
} from '../data/serviceAreas';
import { insertBooking, updateEmailSent } from '../lib/supabaseBookings';

const CATEGORY_ICONS: Record<ExpertCategoryId, LucideIcon> = {
  Appliance: Refrigerator,
  HVAC: Snowflake,
  Plumbing: Droplets,
  Electrical: Zap,
  'Smart Home': HouseWifi,
  'Garage Door': DoorOpen,
  'Not Sure': HelpCircle,
};

const SERVICE_TYPE_LABEL: Record<ExpertMatch['serviceType'], string> = {
  R: 'Repair',
  I: 'Installation',
  M: 'Maintenance',
  E: 'Emergency',
};

const TOTAL_STEPS = 5;

const generateRequestNumber = (): string => {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `SA-${year}-${s}`;
};

const chipSx = (selected: boolean) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 1,
  px: 2,
  py: 1.25,
  borderRadius: '14px',
  border: `1.5px solid ${selected ? colors.primaryBlue : '#E4E7EB'}`,
  backgroundColor: selected ? colors.lightBlueBg : '#FFFFFF',
  color: selected ? colors.primaryBlue : colors.darkText,
  fontFamily: fonts.body,
  fontWeight: selected ? 700 : 500,
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  textAlign: 'left' as const,
  '&:hover': { borderColor: colors.primaryBlue, backgroundColor: colors.lightBlueBg },
});

type Phase = 'intro' | 'form' | 'submitting' | 'result';

const MatchExpertPage: React.FC = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('intro');
  const [step, setStep] = useState(0);

  const [category, setCategory] = useState<ExpertCategoryId | ''>('');
  const [problem, setProblem] = useState('');
  const [urgency, setUrgency] = useState<EstimatorUrgency>('regular');

  const [zip, setZip] = useState('');
  const [zipTouched, setZipTouched] = useState(false);
  const [city, setCity] = useState('');
  const [stateField, setStateField] = useState('');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [touched, setTouched] = useState(false);

  const [submitError, setSubmitError] = useState('');
  const [result, setResult] = useState<{ requestNumber: string; match: ExpertMatch; urgencyLabel: string } | null>(null);

  const problemOptions = useMemo(() => (category ? PROBLEM_OPTIONS[category] : []), [category]);
  const zipValidation = validateZipCode(zip);
  const nameError = validateFullName(fullName);
  const emailError = validateEmailAddress(email);
  const phoneError = validateUsPhone(phone);

  const canProceed = (() => {
    if (step === 0) return Boolean(category);
    if (step === 1) return Boolean(problem);
    if (step === 2) return Boolean(urgency);
    if (step === 3) return zipValidation.isValid;
    return true;
  })();

  const handleCategorySelect = (id: ExpertCategoryId) => {
    setCategory(id);
    setProblem('');
  };

  const handleBack = () => {
    if (step === 0) {
      setPhase('intro');
      return;
    }
    setStep((s) => s - 1);
  };

  const handleNext = () => {
    if (!canProceed) return;
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
      return;
    }
    void handleSubmit();
  };

  const handleSubmit = async () => {
    setTouched(true);
    if (nameError || emailError || phoneError || !category || !problem) return;

    const match = getExpertMatch(category as ExpertCategoryId, problem);
    if (!match) {
      setSubmitError('Unable to find a match for that combination. Please try again.');
      return;
    }

    setPhase('submitting');
    setSubmitError('');

    const urgencyLabel = URGENCY_OPTIONS.find((u) => u.id === urgency)?.label ?? 'Regular';
    const reqNum = generateRequestNumber();
    const inferredState = stateField || inferStateFromZip(zip) || null;

    const answerSummary = [
      `Category: ${category}`,
      `Problem: ${problem}`,
      `Urgency: ${urgencyLabel}`,
      description ? `Notes: ${description}` : null,
    ].filter(Boolean).join('\n');

    const { id: bookingId, error: insertError } = await insertBooking({
      request_number: reqNum,
      admin_status: 'New Lead',
      customer_name: fullName,
      email,
      phone,
      zip_code: zip,
      city: city || null,
      state: inferredState,
      service_type: SERVICE_TYPE_LABEL[match.serviceType],
      service_category: match.serviceCategory ?? category,
      product_name: match.productName,
      problem_type: problem,
      issue_description: `${MATCH_EXPERT_SOURCE_TAG}\n${answerSummary}`,
      urgency: urgencyLabel,
      status: 'New',
    });

    if (insertError) {
      console.error('[MatchExpert] Insert failed:', insertError);
      setSubmitError(`Save failed: ${insertError}`);
      setPhase('form');
      return;
    }

    fetch('/.netlify/functions/send-booking-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestNumber: reqNum,
        customerName: fullName,
        email,
        service: match.productName,
        preferredDate: '',
        preferredTime: '',
      }),
    })
      .then(async (r) => {
        if (!r.ok) return;
        const json = await r.json().catch(() => ({}));
        if (json.skipped) return;
        if (json.success && bookingId) updateEmailSent(bookingId);
      })
      .catch((err) => console.warn('[MatchExpert] Email send failed (non-blocking):', err));

    setResult({ requestNumber: reqNum, match, urgencyLabel });
    setPhase('result');
  };

  const handleEditAnswers = () => {
    setResult(null);
    setPhase('form');
    setStep(0);
  };

  const bookThisExpert = () => {
    if (!result) return;
    const { match, urgencyLabel } = result;
    const params = new URLSearchParams({ serviceType: match.serviceType, productName: match.productName });
    if (match.serviceCategory) params.set('serviceCategory', match.serviceCategory);
    if (match.serviceType === 'E') params.set('urgency', urgencyLabel);
    if (problem) params.set('problemType', problem);
    const expertSlug = getExpertSlugForMatch(match.expertType);
    if (expertSlug) params.set('expert', expertSlug);
    navigate(`/scheduler?${params.toString()}`);
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': { backgroundColor: '#FFFFFF', borderRadius: '12px' },
  };

  // ── Intro ──────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
        <Box
          sx={{
            py: { xs: 8, md: 11 },
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
                fontSize: { xs: '1.85rem', md: '2.5rem' },
                mb: 1.5,
                lineHeight: 1.2,
              }}
            >
              Tell us what&apos;s happening. We&apos;ll match you with the right service expert.
            </Typography>
            <Typography
              sx={{
                fontFamily: fonts.body,
                color: 'rgba(255,255,255,0.85)',
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.7,
                maxWidth: 620,
                mx: 'auto',
                mb: 4,
              }}
            >
              Answer a few quick questions and Smart Appliances will recommend the best service category, urgency level, and booking path.
            </Typography>
            <Button
              onClick={() => { setPhase('form'); setStep(0); }}
              sx={{ ...primaryButtonSx, ...heroCtaButtonSx, width: { xs: '100%', sm: '220px' } }}
            >
              <Box sx={heroCtaInnerSx}>Start Matching</Box>
            </Button>
          </Container>
        </Box>
      </Box>
    );
  }

  // ── Result ─────────────────────────────────────────────────────────────
  if (phase === 'result' && result) {
    const { match, urgencyLabel, requestNumber } = result;
    const expertSlug = getExpertSlugForMatch(match.expertType);
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC', py: { xs: 6, md: 9 }, px: 2 }}>
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <CheckCircleIcon sx={{ color: colors.success, fontSize: 56, mb: 1 }} />
            <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: { xs: '1.4rem', md: '1.65rem' }, color: colors.navy, mb: 1 }}>
              Your request has been matched with the right Smart Appliances service path.
            </Typography>
          </Box>

          <Box
            sx={{
              p: { xs: 2.5, md: 3.5 },
              borderRadius: '20px',
              border: '1px solid #C8D8F8',
              backgroundColor: '#FFFFFF',
              boxShadow: colors.cardShadow,
            }}
          >
            <Box sx={{ backgroundColor: colors.lightBlueBg, borderRadius: '12px', px: 2, py: 1.25, mb: 2.5 }}>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.7rem', color: colors.mutedText, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Request ID
              </Typography>
              <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '1.15rem', color: colors.primaryBlue, letterSpacing: '0.04em' }}>
                {requestNumber}
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gap: 1.5, mb: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Typography sx={{ fontFamily: fonts.body, fontSize: '0.85rem', color: colors.mutedText }}>Recommended Expert</Typography>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '0.9rem', color: colors.navy }}>{match.expertType}</Typography>
                  {expertSlug && (
                    <Typography
                      component={RouterLink}
                      to={`/experts/${expertSlug}`}
                      sx={{ fontFamily: fonts.body, fontSize: '0.78rem', fontWeight: 600, color: colors.primaryBlue, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      View Expert Profile
                    </Typography>
                  )}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Typography sx={{ fontFamily: fonts.body, fontSize: '0.85rem', color: colors.mutedText }}>Service Category</Typography>
                <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '0.9rem', color: colors.navy }}>{match.serviceCategory ?? category}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Typography sx={{ fontFamily: fonts.body, fontSize: '0.85rem', color: colors.mutedText }}>Recommended Service</Typography>
                <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '0.9rem', color: colors.navy, textAlign: 'right' }}>{match.productName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Typography sx={{ fontFamily: fonts.body, fontSize: '0.85rem', color: colors.mutedText }}>Urgency</Typography>
                <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '0.9rem', color: colors.navy }}>{urgencyLabel}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Typography sx={{ fontFamily: fonts.body, fontSize: '0.85rem', color: colors.mutedText }}>Starting Estimate</Typography>
                <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '0.95rem', color: colors.primaryBlue }}>{match.startingEstimate}</Typography>
              </Box>
            </Box>

            <Box sx={{ p: 2, borderRadius: '12px', backgroundColor: '#F0F6FF', mb: 2.5 }}>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.78rem', fontWeight: 700, color: colors.navy, mb: 0.5 }}>
                Why this match was selected
              </Typography>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.85rem', color: colors.darkText, lineHeight: 1.6 }}>
                {match.reason}
              </Typography>
            </Box>

            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: colors.mutedText, mb: 2.5, lineHeight: 1.6 }}>
              Prices shown are starting estimates. Final pricing depends on diagnosis, parts, labor, accessibility, and service urgency.
            </Typography>

            <Box sx={{ display: 'grid', gap: 1.25 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={bookThisExpert}
                sx={{
                  py: 1.4, borderRadius: '14px', backgroundColor: colors.primaryBlue,
                  fontFamily: fonts.body, fontWeight: 700, textTransform: 'none', fontSize: '1rem',
                  '&:hover': { backgroundColor: colors.navy },
                }}
              >
                Book This Expert
              </Button>
              <Box sx={{ display: 'flex', gap: 1.25 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleEditAnswers}
                  sx={{ borderRadius: '14px', borderColor: colors.primaryBlue, color: colors.primaryBlue, fontFamily: fonts.body, fontWeight: 700, textTransform: 'none' }}
                >
                  Edit Answers
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  component="a"
                  href="tel:+15712764808"
                  startIcon={<PhoneIcon sx={{ fontSize: 18 }} />}
                  sx={{ borderRadius: '14px', borderColor: colors.primaryBlue, color: colors.primaryBlue, fontFamily: fonts.body, fontWeight: 700, textTransform: 'none' }}
                >
                  Call Now
                </Button>
              </Box>
              <Button
                fullWidth
                variant="text"
                onClick={() => navigate('/track-request')}
                sx={{ fontFamily: fonts.body, fontWeight: 700, textTransform: 'none', color: colors.mutedText }}
              >
                Track Request
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  // ── Form steps ─────────────────────────────────────────────────────────
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC', py: { xs: 5, md: 8 }, px: 2 }}>
      <Container maxWidth="sm">
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.8rem', color: colors.mutedText, mb: 0.75 }}>
            Step {step + 1} of {TOTAL_STEPS}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={((step + 1) / TOTAL_STEPS) * 100}
            sx={{
              height: 6, borderRadius: 6, backgroundColor: '#E4E7EB',
              '& .MuiLinearProgress-bar': { backgroundColor: colors.primaryBlue, borderRadius: 6 },
            }}
          />
        </Box>

        <Box
          sx={{
            p: { xs: 2.5, md: 3.5 },
            borderRadius: '20px',
            border: '1px solid #E4E7EB',
            backgroundColor: '#FFFFFF',
            boxShadow: colors.cardShadow,
          }}
        >
          {step === 0 && (
            <>
              <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '1.3rem', color: colors.navy, mb: 0.75 }}>
                What do you need help with?
              </Typography>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.9rem', color: colors.mutedText, mb: 2.5 }}>
                Choose the category that best matches your issue.
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(2, 1fr)' }, gap: 1.25 }}>
                {EXPERT_CATEGORIES.map(({ id, label }) => {
                  const Icon = CATEGORY_ICONS[id];
                  const selected = category === id;
                  return (
                    <Box key={id} component="button" type="button" onClick={() => handleCategorySelect(id)} sx={chipSx(selected)}>
                      <Icon size={18} strokeWidth={selected ? 2.2 : 1.8} />
                      <span>{label}</span>
                    </Box>
                  );
                })}
              </Box>
            </>
          )}

          {step === 1 && (
            <>
              <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '1.3rem', color: colors.navy, mb: 0.75 }}>
                What problem are you having?
              </Typography>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.9rem', color: colors.mutedText, mb: 2.5 }}>
                Select the option that best describes your {category} issue.
              </Typography>
              <Box sx={{ display: 'grid', gap: 1.25 }}>
                {problemOptions.map((opt) => {
                  const selected = problem === opt;
                  return (
                    <Box key={opt} component="button" type="button" onClick={() => setProblem(opt)} sx={chipSx(selected)}>
                      <span>{opt}</span>
                    </Box>
                  );
                })}
              </Box>
            </>
          )}

          {step === 2 && (
            <>
              <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '1.3rem', color: colors.navy, mb: 0.75 }}>
                How urgent is it?
              </Typography>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.9rem', color: colors.mutedText, mb: 2.5 }}>
                This helps us recommend the right response time.
              </Typography>
              <Box sx={{ display: 'grid', gap: 1.25 }}>
                {URGENCY_OPTIONS.map((u) => {
                  const selected = urgency === u.id;
                  return (
                    <Box key={u.id} component="button" type="button" onClick={() => setUrgency(u.id)} sx={chipSx(selected)}>
                      <span>{u.label}</span>
                    </Box>
                  );
                })}
              </Box>
            </>
          )}

          {step === 3 && (
            <>
              <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '1.3rem', color: colors.navy, mb: 0.75 }}>
                Where do you need service?
              </Typography>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.9rem', color: colors.mutedText, mb: 2.5 }}>
                We&apos;ll confirm we cover your area.
              </Typography>
              <Box sx={{ display: 'grid', gap: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="ZIP code"
                  value={zip}
                  onChange={(e) => setZip(normalizeZipInput(e.target.value))}
                  onBlur={() => setZipTouched(true)}
                  error={isZipFieldError(zip, zipTouched)}
                  helperText={getZipFieldHelperText(zip, zipTouched)}
                  inputProps={{ inputMode: 'numeric', maxLength: 5 }}
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="City (optional)"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  sx={fieldSx}
                />
                <FormControl fullWidth size="small">
                  <InputLabel id="match-state-label">State (optional)</InputLabel>
                  <Select
                    labelId="match-state-label"
                    label="State (optional)"
                    value={stateField}
                    onChange={(e) => setStateField(e.target.value)}
                    sx={fieldSx}
                  >
                    <MenuItem value="">
                      <em>Select state</em>
                    </MenuItem>
                    {SERVICE_AREA_STATES.map((s) => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </>
          )}

          {step === 4 && (
            <>
              <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '1.3rem', color: colors.navy, mb: 0.75 }}>
                Contact details
              </Typography>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.9rem', color: colors.mutedText, mb: 2.5 }}>
                We&apos;ll send your match and Request ID here.
              </Typography>
              <Box sx={{ display: 'grid', gap: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  error={touched && Boolean(nameError)}
                  helperText={touched ? nameError ?? '' : ''}
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={touched && Boolean(emailError)}
                  helperText={touched ? emailError ?? '' : ''}
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={touched && Boolean(phoneError)}
                  helperText={touched ? phoneError ?? '' : ''}
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Describe the issue (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  sx={fieldSx}
                />
              </Box>
              {submitError && (
                <Typography sx={{ fontFamily: fonts.body, color: colors.emergency, fontSize: '0.85rem', mt: 2 }}>
                  {submitError}
                </Typography>
              )}
            </>
          )}

          <Box sx={{ display: 'flex', gap: 1.5, mt: 3.5 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleBack}
              disabled={phase === 'submitting'}
              sx={{ ...secondaryButtonSx, borderRadius: '14px', py: 1.3 }}
            >
              Back
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={handleNext}
              disabled={!canProceed || phase === 'submitting'}
              sx={{
                py: 1.3, borderRadius: '14px', backgroundColor: colors.primaryBlue,
                fontFamily: fonts.body, fontWeight: 700, textTransform: 'none',
                '&:hover': { backgroundColor: colors.navy },
                '&.Mui-disabled': { backgroundColor: '#CBD5E1', color: '#FFFFFF' },
              }}
            >
              {phase === 'submitting' ? 'Matching…' : step === TOTAL_STEPS - 1 ? 'Find My Expert' : 'Next'}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default MatchExpertPage;
