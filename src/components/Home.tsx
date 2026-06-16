import React, { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Collapse,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckIcon from '@mui/icons-material/Check';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import { serviceCategories } from '../data/services';
import { colors, fonts, heroCtaButtonSx } from '../theme';
import { HERO_TECHNICIAN_WIDTH, HERO_TECHNICIAN_HEIGHT } from '../constants/imageDimensions';
import {
  validateFullName,
  validateEmailAddress,
  validateUsPhone,
} from '../lib/schedulerContactValidation';
import { inferCategoryFromProductName } from '../data/schedulerPrefill';
import { insertBooking, updateEmailSent } from '../lib/supabaseBookings';

const HomeBelowFold = lazy(() => import('./HomeBelowFold'));

const allServiceOptions = serviceCategories.flatMap((cat) =>
  cat.services.map((s) => ({ id: s.id, label: s.label, categoryId: cat.id })),
);

const POPULAR_SERVICES = [
  { id: 'refrigerator',   label: 'Refrigerator',   productName: 'Refrigerator',   serviceType: 'Repair', serviceCategory: 'Appliance' },
  { id: 'washer-dryer',   label: 'Washer / Dryer', productName: 'Washer / Dryer', serviceType: 'Repair', serviceCategory: 'Appliance' },
  { id: 'dishwasher',     label: 'Dishwasher',     productName: 'Dishwasher',     serviceType: 'Repair', serviceCategory: 'Appliance' },
  { id: 'oven-stove',     label: 'Oven / Stove',   productName: 'Oven / Stove',   serviceType: 'Repair', serviceCategory: 'Appliance' },
  { id: 'ac-repair',      label: 'AC Repair',      productName: 'AC Repair',      serviceType: 'Repair', serviceCategory: 'HVAC'      },
  { id: 'drain-cleaning', label: 'Drain Cleaning', productName: 'Drain Cleaning', serviceType: 'Repair', serviceCategory: 'Plumbing'  },
] as const;

const generateRequestNumber = (): string => {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `SA-${year}-${s}`;
};

const formatPhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const URGENCY_OPTIONS = [
  { id: 'regular',   label: 'Regular',   emergency: false },
  { id: 'sameday',   label: 'Same-Day',  emergency: false },
  { id: 'emergency', label: 'Emergency', emergency: true  },
] as const;

const HVAC_SERVICES    = ['AC Repair', 'Heating / Furnace Repair', 'Thermostat Installation', 'HVAC Maintenance', 'Duct Cleaning'] as const;
const HVAC_PROBLEMS    = ['No cooling', 'No heat', 'Weak airflow', 'Strange noise', 'Thermostat issue', 'System not turning on'] as const;
const HVAC_SYSTEM_TYPES = ['Central AC', 'Furnace', 'Heat Pump', 'Mini Split', 'Thermostat', 'Other'] as const;

const APPLIANCE_PROBLEMS = ["Won't start", 'Not cooling / heating', 'Making noise', 'Leaking', 'Error code', 'Other'] as const;

const PLUMBING_SERVICES = ['Drain Cleaning', 'Leak Repair', 'Water Heater', 'Pipe Repair', 'Faucet / Fixture', 'Sump Pump'] as const;
const PLUMBING_PROBLEMS = ['Clogged drain', 'Leaking pipe', 'No hot water', 'Low pressure', 'Running toilet', 'Other'] as const;

const Home: React.FC = () => {
  const navigate = useNavigate();

  // Service selection
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedProductName, setSelectedProductName] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('Repair');
  const [selectedServiceCategory, setSelectedServiceCategory] = useState('');
  const [showFullList, setShowFullList] = useState(false);
  const [fullListValue, setFullListValue] = useState('');

  // Contact info
  const [name, setName] = useState('');
  const [nameTouched, setNameTouched] = useState(false);
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);

  // Urgency
  const [urgency, setUrgency] = useState<'regular' | 'sameday' | 'emergency'>('regular');

  // Follow-up chip selections (category-contextual)
  const [subService, setSubService] = useState('');
  const [problemType, setProblemType] = useState('');
  const [systemType, setSystemType] = useState('');

  // Submit state
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successData, setSuccessData] = useState<{ requestNumber: string; serviceName: string } | null>(null);

  // Validation
  const nameError = validateFullName(name);
  const emailError = validateEmailAddress(email);
  const phoneError = validateUsPhone(phone);
  const serviceError = !selectedServiceId ? 'Please select a service.' : null;

  const showErr = (touched: boolean, err: string | null) =>
    Boolean(err) && (touched || submitAttempted);

  const resetFollowUps = () => {
    setSubService('');
    setProblemType('');
    setSystemType('');
  };

  const handleSelectPopular = (svc: typeof POPULAR_SERVICES[number]) => {
    setSelectedServiceId(svc.id);
    setSelectedProductName(svc.productName);
    setSelectedServiceType(svc.serviceType);
    setSelectedServiceCategory(svc.serviceCategory);
    setShowFullList(false);
    setFullListValue('');
    resetFollowUps();
    // Pre-select sub-service for HVAC / Plumbing popular chips
    if (svc.serviceCategory === 'HVAC') setSubService(svc.productName);
    if (svc.serviceCategory === 'Plumbing') setSubService(svc.productName);
  };

  const handleSelectFull = (e: SelectChangeEvent<string>) => {
    const val = e.target.value;
    const found = allServiceOptions.find((o) => o.id === val);
    if (!found) return;
    const svcType = /install/i.test(found.label) ? 'Installation' : /mainten/i.test(found.label) ? 'Maintenance' : 'Repair';
    const svcCategory = inferCategoryFromProductName(found.label) || 'Appliance';
    setFullListValue(val);
    setSelectedServiceId(val);
    setSelectedProductName(found.label);
    setSelectedServiceType(svcType);
    setSelectedServiceCategory(svcCategory);
    setShowFullList(false);
    resetFollowUps();
    // Pre-select sub-service when it matches a known chip value
    if (svcCategory === 'HVAC' && (HVAC_SERVICES as readonly string[]).includes(found.label)) setSubService(found.label);
    if (svcCategory === 'Plumbing' && (PLUMBING_SERVICES as readonly string[]).includes(found.label)) setSubService(found.label);
  };

  const handleReset = () => {
    setSuccessData(null);
    setSelectedServiceId('');
    setSelectedProductName('');
    setSelectedServiceType('Repair');
    setSelectedServiceCategory('');
    setShowFullList(false);
    setFullListValue('');
    resetFollowUps();
    setName('');
    setNameTouched(false);
    setEmail('');
    setEmailTouched(false);
    setPhone('');
    setPhoneTouched(false);
    setUrgency('regular');
    setSubmitAttempted(false);
    setSubmitError('');
  };

  const handleSubmit = async () => {
    setSubmitAttempted(true);
    if (serviceError || nameError || emailError || phoneError) return;
    setIsSubmitting(true);
    setSubmitError('');

    const reqNum = generateRequestNumber();
    const urgencyLabel = urgency === 'regular' ? 'Regular' : urgency === 'sameday' ? 'Same-Day' : 'Emergency';

    const { id: bookingId, error: insertError } = await insertBooking({
      request_number: reqNum,
      admin_status: 'New Lead',
      customer_name: name,
      email,
      phone,
      zip_code: '',
      service_type: selectedServiceType,
      service_category: selectedServiceCategory,
      product_name: subService || selectedProductName,
      problem_type: problemType || null,
      system_type: systemType || null,
      urgency: urgencyLabel,
      status: 'New',
      issue_description: 'Quick service request from homepage',
    });

    if (insertError) {
      setSubmitError('Something went wrong. Please try again.');
      setIsSubmitting(false);
      return;
    }

    // Fire-and-forget email — booking success is never blocked by this
    fetch('/.netlify/functions/send-booking-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestNumber: reqNum, customerName: name, email, service: selectedProductName, preferredDate: '', preferredTime: '' }),
    })
      .then(async (r) => {
        if (!r.ok) return;
        const json = await r.json().catch(() => ({}));
        if (json.skipped) {
          console.warn('[Booking] Email skipped because RESEND_API_KEY is missing');
          return;
        }
        if (json.success && bookingId) updateEmailSent(bookingId);
      })
      .catch((err) => console.warn('[Booking] Email send failed (non-blocking):', err));

    setIsSubmitting(false);
    setSuccessData({ requestNumber: reqNum, serviceName: selectedProductName });
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

  // Custom (non-popular) selection chip
  const isCustomSelection = selectedServiceId && !POPULAR_SERVICES.find((s) => s.id === selectedServiceId);

  const chipSx = (selected: boolean, emergency = false) => ({
    cursor: 'pointer',
    px: 1.25,
    py: 0.55,
    borderRadius: '9px',
    border: `1.5px solid ${selected ? (emergency ? colors.emergency : colors.primaryBlue) : colors.border}`,
    backgroundColor: selected ? (emergency ? '#FFF5F5' : colors.lightBlueBg) : '#fff',
    color: selected ? (emergency ? colors.emergency : colors.primaryBlue) : colors.darkText,
    fontFamily: fonts.body,
    fontSize: '0.8rem',
    fontWeight: selected ? 700 : 500,
    display: 'flex',
    alignItems: 'center',
    gap: 0.4,
    userSelect: 'none' as const,
    transition: 'all 0.14s',
    '&:hover': {
      borderColor: emergency ? colors.emergency : colors.primaryBlue,
      backgroundColor: selected ? undefined : (emergency ? '#FFF5F5' : '#F0F7FF'),
    },
  });

  const inputSx = {
    '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: fonts.body, fontSize: '0.88rem' },
    '& .MuiFormHelperText-root': { mx: 0, fontSize: '0.72rem', fontFamily: fonts.body, mt: 0.25 },
  };

  const heroBookingCard = (
    <Box className="hero-booking-card">
      {/* ── Success screen ── */}
      {successData ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: 2 }}>
          <CheckCircleIcon sx={{ color: '#22c55e', fontSize: 52, mb: 1.5 }} />
          <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '1.15rem', color: colors.navy, mb: 0.5 }}>
            Request Received!
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.mutedText, mb: 1.75, lineHeight: 1.5, maxWidth: 270 }}>
            We'll contact you shortly to confirm your appointment. Check your email for details.
          </Typography>

          {/* Request ID badge */}
          <Box sx={{ backgroundColor: colors.lightBlueBg, borderRadius: '10px', px: 2.5, py: 1.25, mb: 1.5, width: '100%' }}>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.7rem', color: colors.mutedText, mb: 0.25, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Request ID
            </Typography>
            <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '1.05rem', color: colors.primaryBlue, letterSpacing: '0.04em' }}>
              {successData.requestNumber}
            </Typography>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.mutedText, mt: 0.25 }}>
              {successData.serviceName}
            </Typography>
          </Box>

          {/* Action buttons */}
          <Button
            fullWidth
            variant="contained"
            startIcon={<TrackChangesIcon />}
            onClick={() => navigate(`/track-request?id=${successData.requestNumber}`)}
            sx={{
              backgroundColor: colors.primaryBlue, color: colors.white,
              fontFamily: fonts.heading, fontWeight: 600, fontSize: '0.88rem',
              textTransform: 'none', borderRadius: '11px', height: 42, mb: 1,
              '&:hover': { backgroundColor: colors.primaryBlueHover },
            }}
          >
            Track Request Status
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleReset}
            sx={{
              borderColor: colors.primaryBlue, color: colors.primaryBlue,
              fontFamily: fonts.heading, fontWeight: 600, fontSize: '0.88rem',
              textTransform: 'none', borderRadius: '11px', height: 42,
              '&:hover': { backgroundColor: colors.lightBlueBg },
            }}
          >
            Book Another Service
          </Button>
        </Box>
      ) : (
      <>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <Box sx={{ width: 34, height: 34, borderRadius: '9px', backgroundColor: colors.lightBlueBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <CalendarMonthIcon sx={{ color: colors.primaryBlue, fontSize: 19 }} />
        </Box>
        <Box>
          <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '1rem', color: colors.navy, lineHeight: 1.2 }}>
            Book Your Service
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.mutedText, mt: 0.1 }}>
            It only takes a minute
          </Typography>
        </Box>
      </Box>

      {/* Popular service chips */}
      <Typography component="div" sx={{ ...heroFieldLabelSx, mb: 0.75 }}>
        Popular Services
      </Typography>

      {isCustomSelection && (
        <Box sx={{ mb: 0.75 }}>
          <Box
            onClick={() => { setSelectedServiceId(''); setSelectedProductName(''); setFullListValue(''); }}
            sx={{ ...chipSx(true), display: 'inline-flex' }}
          >
            <CheckIcon sx={{ fontSize: 12 }} />
            {selectedProductName}
            <Box component="span" sx={{ ml: 0.5, opacity: 0.6, fontSize: '0.7rem', cursor: 'pointer' }}>✕</Box>
          </Box>
        </Box>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.75, mb: 0.75 }}>
        {POPULAR_SERVICES.map((svc) => {
          const sel = selectedServiceId === svc.id;
          return (
            <Box key={svc.id} onClick={() => handleSelectPopular(svc)} sx={chipSx(sel)}>
              {sel && <CheckIcon sx={{ fontSize: 12 }} />}
              {svc.label}
            </Box>
          );
        })}
      </Box>

      {/* View All Services toggle */}
      <Box
        component="button"
        type="button"
        onClick={() => setShowFullList((v) => !v)}
        sx={{
          background: 'none', border: 'none', cursor: 'pointer', p: 0, mb: 0.5,
          color: colors.primaryBlue, fontFamily: fonts.body, fontSize: '0.78rem', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 0.4,
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        {showFullList ? '← Back to popular' : 'View All Services →'}
      </Box>

      <Collapse in={showFullList}>
        <FormControl fullWidth size="small" sx={{ mb: 0.75 }}>
          <Select
            value={fullListValue}
            displayEmpty
            onChange={handleSelectFull}
            renderValue={(v) => v ? allServiceOptions.find((o) => o.id === v)?.label ?? v : 'Browse all services…'}
            MenuProps={{ PaperProps: { sx: { maxHeight: 260, fontFamily: fonts.body } } }}
            sx={{ borderRadius: '10px', fontFamily: fonts.body, fontSize: '0.85rem' }}
          >
            {serviceCategories.map((cat) => [
              <MenuItem key={`cat-${cat.id}`} disabled value="" sx={{ fontFamily: fonts.body, fontWeight: 700, color: colors.navy, fontSize: '0.78rem', opacity: '1 !important' }}>
                — {cat.title}
              </MenuItem>,
              ...cat.services.map((s) => (
                <MenuItem key={s.id} value={s.id} sx={{ fontFamily: fonts.body, pl: 3, fontSize: '0.84rem' }}>
                  {s.label}
                </MenuItem>
              )),
            ])}
          </Select>
        </FormControl>
      </Collapse>

      {submitAttempted && serviceError && (
        <Typography sx={{ color: colors.emergency, fontSize: '0.72rem', mb: 0.5, fontFamily: fonts.body }}>
          {serviceError}
        </Typography>
      )}

      {/* ── Contextual follow-up chips ── */}
      <Collapse in={selectedServiceCategory === 'HVAC'}>
        <Box sx={{ mb: 0.75 }}>
          <Typography component="div" sx={{ ...heroFieldLabelSx, mb: 0.6 }}>What HVAC service?</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mb: 1 }}>
            {HVAC_SERVICES.map((s) => (
              <Box key={s} onClick={() => setSubService(subService === s ? '' : s)} sx={{ ...chipSx(subService === s), fontSize: '0.76rem', px: 1, py: 0.4 }}>{s}</Box>
            ))}
          </Box>

          <Typography component="div" sx={{ ...heroFieldLabelSx, mb: 0.6 }}>What problem are you having?</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mb: 1 }}>
            {HVAC_PROBLEMS.map((p) => (
              <Box key={p} onClick={() => setProblemType(problemType === p ? '' : p)} sx={{ ...chipSx(problemType === p), fontSize: '0.76rem', px: 1, py: 0.4 }}>{p}</Box>
            ))}
          </Box>

          <Typography component="div" sx={{ ...heroFieldLabelSx, mb: 0.6 }}>System type</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
            {HVAC_SYSTEM_TYPES.map((t) => (
              <Box key={t} onClick={() => setSystemType(systemType === t ? '' : t)} sx={{ ...chipSx(systemType === t), fontSize: '0.76rem', px: 1, py: 0.4 }}>{t}</Box>
            ))}
          </Box>
        </Box>
      </Collapse>

      <Collapse in={selectedServiceCategory === 'Appliance'}>
        <Box sx={{ mb: 0.75 }}>
          <Typography component="div" sx={{ ...heroFieldLabelSx, mb: 0.6 }}>What problem are you having?</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
            {APPLIANCE_PROBLEMS.map((p) => (
              <Box key={p} onClick={() => setProblemType(problemType === p ? '' : p)} sx={{ ...chipSx(problemType === p), fontSize: '0.76rem', px: 1, py: 0.4 }}>{p}</Box>
            ))}
          </Box>
        </Box>
      </Collapse>

      <Collapse in={selectedServiceCategory === 'Plumbing'}>
        <Box sx={{ mb: 0.75 }}>
          <Typography component="div" sx={{ ...heroFieldLabelSx, mb: 0.6 }}>What plumbing service?</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mb: 1 }}>
            {PLUMBING_SERVICES.map((s) => (
              <Box key={s} onClick={() => setSubService(subService === s ? '' : s)} sx={{ ...chipSx(subService === s), fontSize: '0.76rem', px: 1, py: 0.4 }}>{s}</Box>
            ))}
          </Box>

          <Typography component="div" sx={{ ...heroFieldLabelSx, mb: 0.6 }}>What problem are you having?</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
            {PLUMBING_PROBLEMS.map((p) => (
              <Box key={p} onClick={() => setProblemType(problemType === p ? '' : p)} sx={{ ...chipSx(problemType === p), fontSize: '0.76rem', px: 1, py: 0.4 }}>{p}</Box>
            ))}
          </Box>
        </Box>
      </Collapse>

      {/* Contact fields */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.875, mt: 0.5, mb: 1 }}>
        <TextField
          placeholder="Full Name *"
          value={name}
          size="small"
          fullWidth
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setNameTouched(true)}
          error={showErr(nameTouched, nameError)}
          helperText={showErr(nameTouched, nameError) ? nameError : undefined}
          sx={inputSx}
        />
        <TextField
          placeholder="Email Address *"
          type="email"
          value={email}
          size="small"
          fullWidth
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setEmailTouched(true)}
          error={showErr(emailTouched, emailError)}
          helperText={showErr(emailTouched, emailError) ? emailError : undefined}
          sx={inputSx}
        />
        <TextField
          placeholder="Phone Number *"
          value={phone}
          size="small"
          fullWidth
          inputProps={{ inputMode: 'tel' }}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          onBlur={() => setPhoneTouched(true)}
          error={showErr(phoneTouched, phoneError)}
          helperText={showErr(phoneTouched, phoneError) ? phoneError : undefined}
          sx={inputSx}
        />
      </Box>

      {/* Urgency chips */}
      <Typography component="div" sx={{ ...heroFieldLabelSx, mb: 0.75 }}>How soon?</Typography>
      <Box sx={{ display: 'flex', gap: 0.75, mb: 1.5 }}>
        {URGENCY_OPTIONS.map((opt) => {
          const sel = urgency === opt.id;
          return (
            <Box
              key={opt.id}
              onClick={() => setUrgency(opt.id)}
              sx={{ ...chipSx(sel, opt.emergency), flex: 1, justifyContent: 'center' }}
            >
              {opt.label}
            </Box>
          );
        })}
      </Box>

      {/* Submit */}
      {submitError && (
        <Typography sx={{ color: colors.emergency, fontSize: '0.75rem', mb: 0.75, fontFamily: fonts.body, textAlign: 'center' }}>
          {submitError}
        </Typography>
      )}
      <Button
        fullWidth
        variant="contained"
        endIcon={isSubmitting ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <ArrowForwardIcon />}
        onClick={() => { void handleSubmit(); }}
        disabled={isSubmitting}
        sx={{
          backgroundColor: colors.primaryBlue,
          color: colors.white,
          fontFamily: fonts.heading,
          fontWeight: 600,
          fontSize: '0.95rem',
          textTransform: 'none',
          borderRadius: '13px',
          height: 46,
          boxShadow: '0 10px 28px rgba(10, 37, 64, 0.18)',
          '&:hover': { backgroundColor: colors.primaryBlueHover },
        }}
      >
        {isSubmitting ? 'Sending…' : 'Request Service'}
      </Button>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 1.25, justifyContent: 'center' }}>
        <LockOutlinedIcon sx={{ fontSize: 13, color: colors.mutedText }} />
        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.7rem', color: colors.mutedText }}>
          Your information is secure and private
        </Typography>
      </Box>
      </>
      )}
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
          minHeight: { md: 610, lg: 640 },
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
          {/* Single sharp layer — blur removed to cut decode cost; gradient handles blend */}
          <Box
            component="img"
            src={heroImageSrc}
            alt=""
            aria-hidden
            width={HERO_TECHNICIAN_WIDTH}
            height={HERO_TECHNICIAN_HEIGHT}
            loading="lazy"
            decoding="async"
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
                alt="Certified appliance repair technician giving thumbs up"
                width={HERO_TECHNICIAN_WIDTH}
                height={HERO_TECHNICIAN_HEIGHT}
                loading="lazy"
                decoding="async"
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

      <Suspense fallback={<Box className="home-deferred-section" sx={{ minHeight: 800 }} aria-hidden />}>
        <HomeBelowFold />
      </Suspense>
    </Box>
  );
};

export default Home;
