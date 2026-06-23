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
  InputLabel,
  FormHelperText,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VerifiedIcon from '@mui/icons-material/Verified';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import { colors, fonts, heroCtaButtonSx, primaryButtonSx, secondaryButtonSx } from '../theme';
import { HERO_TECHNICIAN_WIDTH, HERO_TECHNICIAN_HEIGHT } from '../constants/imageDimensions';
import {
  validateFullName,
  validateEmailAddress,
  validateUsPhone,
} from '../lib/schedulerContactValidation';
import { insertBooking, updateEmailSent } from '../lib/supabaseBookings';

const HomeBelowFold = lazy(() => import('./HomeBelowFold'));

const HOME_SERVICES = [
  { label: 'Refrigerator Repair',           serviceType: 'Repair',       serviceCategory: 'Appliance'    },
  { label: 'Washer / Dryer Repair',         serviceType: 'Repair',       serviceCategory: 'Appliance'    },
  { label: 'Dishwasher Repair',             serviceType: 'Repair',       serviceCategory: 'Appliance'    },
  { label: 'Oven / Stove Repair',           serviceType: 'Repair',       serviceCategory: 'Appliance'    },
  { label: 'Microwave Repair',              serviceType: 'Repair',       serviceCategory: 'Appliance'    },
  { label: 'Garbage Disposal Repair',       serviceType: 'Repair',       serviceCategory: 'Appliance'    },
  { label: 'AC Repair',                     serviceType: 'Repair',       serviceCategory: 'HVAC'         },
  { label: 'Heating / Furnace Repair',      serviceType: 'Repair',       serviceCategory: 'HVAC'         },
  { label: 'Thermostat Installation',       serviceType: 'Installation', serviceCategory: 'HVAC'         },
  { label: 'HVAC Maintenance',              serviceType: 'Maintenance',  serviceCategory: 'HVAC'         },
  { label: 'Drain Cleaning',                serviceType: 'Repair',       serviceCategory: 'Plumbing'     },
  { label: 'Leak Repair',                   serviceType: 'Repair',       serviceCategory: 'Plumbing'     },
  { label: 'Toilet Repair',                 serviceType: 'Repair',       serviceCategory: 'Plumbing'     },
  { label: 'Faucet Repair',                 serviceType: 'Repair',       serviceCategory: 'Plumbing'     },
  { label: 'Water Heater Repair',           serviceType: 'Repair',       serviceCategory: 'Plumbing'     },
  { label: 'Outlet / Switch Repair',        serviceType: 'Repair',       serviceCategory: 'Electrical'   },
  { label: 'Light Fixture Installation',    serviceType: 'Installation', serviceCategory: 'Electrical'   },
  { label: 'Ceiling Fan Installation',      serviceType: 'Installation', serviceCategory: 'Electrical'   },
  { label: 'Smart Thermostat Installation', serviceType: 'Installation', serviceCategory: 'Smart Home'   },
  { label: 'Security Camera Setup',         serviceType: 'Installation', serviceCategory: 'Smart Home'   },
  { label: 'Garage Door Repair',            serviceType: 'Repair',       serviceCategory: 'Garage Door'  },
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

const Home: React.FC = () => {
  const navigate = useNavigate();

  // Service dropdown
  const [selectedService, setSelectedService] = useState('');

  // Contact
  const [name, setName]           = useState('');
  const [nameTouched, setNameTouched]   = useState(false);
  const [email, setEmail]         = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [phone, setPhone]         = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);

  // Submit state
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting]       = useState(false);
  const [submitError, setSubmitError]         = useState('');
  const [successData, setSuccessData] = useState<{ requestNumber: string; serviceName: string } | null>(null);

  // Validation
  const serviceError = !selectedService ? 'Please select a service.' : null;
  const nameError    = validateFullName(name);
  const emailError   = validateEmailAddress(email);
  const phoneError   = validateUsPhone(phone);

  const showErr = (touched: boolean, err: string | null) =>
    Boolean(err) && (touched || submitAttempted);

  const handleReset = () => {
    setSuccessData(null);
    setSelectedService('');
    setName(''); setNameTouched(false);
    setEmail(''); setEmailTouched(false);
    setPhone(''); setPhoneTouched(false);
    setSubmitAttempted(false);
    setSubmitError('');
  };

  const handleSubmit = async () => {
    setSubmitAttempted(true);
    if (serviceError || nameError || emailError || phoneError) return;
    setIsSubmitting(true);
    setSubmitError('');

    const svc    = HOME_SERVICES.find((s) => s.label === selectedService)!;
    const reqNum = generateRequestNumber();

    const { id: bookingId, error: insertError } = await insertBooking({
      request_number:    reqNum,
      admin_status:      'New Lead',
      customer_name:     name,
      email,
      phone,
      zip_code:          '',
      service_type:      svc.serviceType,
      service_category:  svc.serviceCategory,
      product_name:      svc.label,
      urgency:           'Regular',
      status:            'New',
      issue_description: 'Quick service request from homepage',
    });

    if (insertError) {
      console.error('[Booking] Insert failed:', insertError);
      setSubmitError(`Save failed: ${insertError}`);
      setIsSubmitting(false);
      return;
    }

    // Fire-and-forget email — booking success is never blocked by this
    fetch('/.netlify/functions/send-booking-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestNumber: reqNum, customerName: name, email, service: svc.label, preferredDate: '', preferredTime: '' }),
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
    setSuccessData({ requestNumber: reqNum, serviceName: svc.label });
  };

  const heroImageSrc = '/images/services/hero-appliance-technician.webp';

  const inputSx = {
    '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: fonts.body, fontSize: '0.88rem' },
    '& .MuiFormHelperText-root': { mx: 0, fontSize: '0.72rem', fontFamily: fonts.body, mt: 0.25 },
  };

  const heroBookingCard = (
    <Box className="hero-booking-card">
      {/* ── Success screen ── */}
      {successData ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: 1.5 }}>
          <CheckCircleIcon sx={{ color: '#22c55e', fontSize: 48, mb: 1.25 }} />
          <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '1.1rem', color: colors.navy, mb: 0.5 }}>
            Request Received!
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.81rem', color: colors.mutedText, mb: 1.5, lineHeight: 1.5, maxWidth: 260 }}>
            Thank you! Your service request has been received. We will contact you shortly.
          </Typography>

          {/* Request ID badge */}
          <Box sx={{ backgroundColor: colors.lightBlueBg, borderRadius: '10px', px: 2, py: 1.25, mb: 0.75, width: '100%', textAlign: 'left' }}>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.68rem', color: colors.mutedText, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Request ID
            </Typography>
            <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '1rem', color: colors.primaryBlue, letterSpacing: '0.04em', my: 0.25 }}>
              {successData.requestNumber}
            </Typography>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.darkText }}>
              {successData.serviceName}
            </Typography>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.72rem', color: '#15803D', fontWeight: 600, mt: 0.5 }}>
              Status: New Lead
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            startIcon={<TrackChangesIcon />}
            onClick={() => navigate(`/track-request?id=${successData.requestNumber}`)}
            sx={{
              backgroundColor: colors.primaryBlue, color: colors.white,
              fontFamily: fonts.heading, fontWeight: 600, fontSize: '0.88rem',
              textTransform: 'none', borderRadius: '11px', height: 42, mb: 0.875,
              '&:hover': { backgroundColor: colors.primaryBlueHover },
            }}
          >
            Track Request
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
              <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '1.05rem', color: colors.navy, lineHeight: 1.2 }}>
                Book Your Service
              </Typography>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.mutedText, mt: 0.1 }}>
                It only takes a minute
              </Typography>
            </Box>
          </Box>
          <Box sx={{ height: '2px', width: '40px', backgroundColor: colors.primaryBlue, borderRadius: '2px', mb: 1.75 }} />

          {/* Service dropdown */}
          <FormControl
            fullWidth
            size="small"
            sx={{ mb: 1.25, '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: fonts.body, fontSize: '0.88rem' }, '& .MuiFormHelperText-root': { mx: 0, fontSize: '0.72rem', fontFamily: fonts.body } }}
            error={submitAttempted && Boolean(serviceError)}
          >
            <InputLabel sx={{ fontFamily: fonts.body, fontSize: '0.88rem' }}>
              What do you need help with?
            </InputLabel>
            <Select
              value={selectedService}
              label="What do you need help with?"
              onChange={(e: SelectChangeEvent<string>) => setSelectedService(e.target.value)}
              MenuProps={{ PaperProps: { sx: { maxHeight: 300, fontFamily: fonts.body } } }}
            >
              {HOME_SERVICES.map((svc) => (
                <MenuItem key={svc.label} value={svc.label} sx={{ fontFamily: fonts.body, fontSize: '0.88rem' }}>
                  {svc.label}
                </MenuItem>
              ))}
            </Select>
            {submitAttempted && serviceError && (
              <FormHelperText>{serviceError}</FormHelperText>
            )}
          </FormControl>

          {/* Contact fields */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1.5 }}>
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
            sx={{ ...primaryButtonSx, height: 46 }}
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
          pt: { xs: 6, md: 7 },
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
            <Box sx={{ maxWidth: { md: '42%', lg: '38%' }, pb: { xs: 1, lg: 1.5 }, pt: { xs: 1, md: 1.5 }, position: 'relative', zIndex: 2, ml: { md: -2.5, lg: -3.5 } }}>
              {/* Trust badge */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  backgroundColor: 'rgba(255,255,255,0.16)',
                  border: '1px solid rgba(255,255,255,0.55)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                  borderRadius: '20px',
                  px: 1.5,
                  py: 0.45,
                  mb: 2,
                }}
              >
                <VerifiedIcon sx={{ color: '#7FDBFF', fontSize: 14 }} />
                <Typography sx={{ fontFamily: fonts.body, fontSize: '0.76rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Trusted Local Appliance Service
                </Typography>
              </Box>

              {/* Heading */}
              <Typography
                variant="h1"
                sx={{
                  fontFamily: fonts.heading,
                  fontWeight: 800,
                  fontSize: { xs: '1.85rem', md: '2.35rem', lg: '42px' },
                  color: '#FFFFFF',
                  lineHeight: 1.1,
                  mb: 1.5,
                  letterSpacing: '-0.4px',
                }}
              >
                Fast, Certified Appliance Repair —{' '}
                <Box component="span" sx={{ color: '#4FC3F7' }}>Same‑Day Availability</Box>
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
                  sx={{ ...primaryButtonSx, ...heroCtaButtonSx }}
                >
                  Book Service
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/emergency-service')}
                  sx={{ ...secondaryButtonSx, ...heroCtaButtonSx }}
                >
                  Emergency Service
                </Button>
              </Box>

              {/* Not sure which service? */}
              <Button
                variant="text"
                onClick={() => navigate('/match-expert')}
                sx={{
                  fontFamily: fonts.body,
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  textTransform: 'none',
                  color: '#4FC3F7',
                  px: 0,
                  mb: 2.5,
                  '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
                }}
              >
                Not sure what you need? Match Me With an Expert →
              </Button>

              {/* Trust row */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.5, md: 2.5 }, alignItems: 'center' }}>
                {['Licensed & Insured', 'Same-Day Service', 'Certified Technicians'].map((item) => (
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
