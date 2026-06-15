import React, { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  OutlinedInput,
  SelectChangeEvent,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VerifiedIcon from '@mui/icons-material/Verified';
import { serviceCategories } from '../data/services';
import { colors, fonts, heroCtaButtonSx } from '../theme';
import { HERO_TECHNICIAN_WIDTH, HERO_TECHNICIAN_HEIGHT } from '../constants/imageDimensions';
import {
  normalizeZipInput,
  validateZipCode,
  getZipFieldHelperText,
  isZipFieldError,
} from '../data/serviceAreas';

const HomeBelowFold = lazy(() => import('./HomeBelowFold'));

const allServiceOptions = serviceCategories.flatMap((cat) =>
  cat.services.map((s) => ({ id: s.id, label: s.label, categoryId: cat.id })),
);


const Home: React.FC = () => {
  const navigate = useNavigate();

  // Scheduler state
  const [schedulerService, setSchedulerService] = useState('');
  const [schedulerZip, setSchedulerZip] = useState('');
  const [schedulerZipTouched, setSchedulerZipTouched] = useState(false);
  const [schedulerUrgency, setSchedulerUrgency] = useState<'regular' | 'sameday' | 'emergency'>('regular');

  const schedulerZipValidation = validateZipCode(schedulerZip);
  const schedulerCanContinue = Boolean(schedulerService) && schedulerZipValidation.isValid;

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
            SelectDisplayProps={{ 'aria-label': 'What do you need help with?' }}
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
