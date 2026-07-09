import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Wrench,
  ShieldCheck,
  Clock,
  ClipboardList,
  AlertCircle,
  Lock,
  Volume2,
  Hammer,
  CheckSquare,
  MapPin,
} from 'lucide-react';
import { colors, fonts } from '../theme';
import BrandsWeService from '../components/brands/BrandsWeService';

const ISSUE_CARDS = [
  { id: 'wont-open', label: "Door won't open", Icon: AlertCircle },
  { id: 'wont-close', label: "Door won't close", Icon: Lock },
  { id: 'noisy-stuck', label: 'Door noisy or stuck', Icon: Volume2 },
  { id: 'panels-damaged', label: 'Panels are damaged', Icon: Hammer },
  { id: 'inspection', label: 'Request an inspection', Icon: ClipboardList },
];

const BENEFITS = [
  {
    Icon: Clock,
    title: 'Simple booking',
    desc: 'Request an appointment in minutes online.',
  },
  {
    Icon: CheckSquare,
    title: '1-hour arrival windows',
    desc: 'No waiting around all day for your technician.',
  },
  {
    Icon: ShieldCheck,
    title: 'Vetted technicians',
    desc: 'Every pro is background-checked and insured.',
  },
  {
    Icon: Wrench,
    title: 'Safety inspection included',
    desc: 'Every repair includes a full safety check.',
  },
];

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Select your issue',
    desc: 'Choose the problem you are experiencing from the options above.',
  },
  {
    step: '2',
    title: 'Pick a time',
    desc: 'Book a convenient appointment — same-day slots may be available.',
  },
  {
    step: '3',
    title: 'We handle the rest',
    desc: 'A vetted technician arrives, completes the repair, and walks you through the results.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    location: 'Denver, CO',
    rating: 5,
    text: 'Technician arrived within the hour window and had my garage door working perfectly. Super professional and explained everything clearly.',
  },
  {
    name: 'James T.',
    location: 'Austin, TX',
    rating: 5,
    text: 'The spring snapped and I could not get my car out. They came the same day and fixed it quickly. Will definitely use again.',
  },
  {
    name: 'Priya K.',
    location: 'Phoenix, AZ',
    rating: 5,
    text: 'Fantastic service from start to finish. Booking was easy, the tech was knowledgeable, and the price was fair.',
  },
];

const FAQS = [
  {
    question: 'How much does garage door repair cost?',
    answer:
      'Costs vary based on the type of repair — spring replacement, opener repair, panel replacement, or track adjustment. Your technician will provide an upfront estimate before any work begins so there are no surprises.',
  },
  {
    question: 'Can you repair all brands of garage door openers?',
    answer:
      'Yes. Our technicians work on all major garage door opener brands including Chamberlain, LiftMaster, Genie, Craftsman, Linear, and more.',
  },
  {
    question: 'Is same-day garage door repair available?',
    answer:
      'Same-day and next-day appointments are often available depending on your location. Select your preferred time when booking online.',
  },
  {
    question: 'What is included in the safety inspection?',
    answer:
      'Our 25-point inspection covers springs, cables, rollers, hinges, tracks, weather seals, opener force settings, auto-reverse function, and more. We identify issues before they become costly problems.',
  },
  {
    question: 'Do you replace garage door springs?',
    answer:
      'Yes. Broken springs are one of the most common garage door repairs. Our technicians replace torsion and extension springs with quality parts and test the balance before finishing.',
  },
  {
    question: 'What if my garage door needs a full replacement?',
    answer:
      'If a repair is not cost-effective, your technician will let you know and can discuss replacement options. We handle both repair and full door installation.',
  },
];

const TECH_GALLERY = [
  {
    image: '/images/services/smart-home/garage-door-service.webp',
    label: 'Expert technicians',
  },
  {
    image: '/images/services/smart-home/garage-opener.webp',
    label: 'Track & sensor service',
  },
  {
    image: '/images/services/garage-door/tech-1.webp',
    label: 'Hardware installation',
  },
  {
    image: '/images/services/garage-door/tech-4.webp',
    label: 'Opener & wiring',
  },
];

const DOOR_GALLERY = [
  {
    image: '/images/services/garage-door/classic-panel.webp',
    title: 'Classic panel door',
    description: 'Repair and maintenance for traditional raised-panel garage doors.',
  },
  {
    image: '/images/services/garage-door/modern-dark.webp',
    title: 'Traditional sectional door',
    description: 'Service for standard sectional doors on single- and multi-car garages.',
  },
  {
    image: '/images/services/garage-door/contemporary-glass.webp',
    title: 'Window-top sectional door',
    description: 'Repair and replacement for doors with decorative top window panels.',
  },
  {
    image: '/images/services/garage-door/wood-look.webp',
    title: 'Wood-look panel door',
    description: 'Maintenance for wood-grain and composite panel garage door styles.',
  },
  {
    image: '/images/services/garage-door/hero.webp',
    title: 'Modern glass-panel door',
    description: 'Installation and service for contemporary aluminum-and-glass door designs.',
  },
];

const GarageDoorRepairPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  const goToScheduler = (issueLabel?: string) => {
    const label = issueLabel ?? (selectedIssue
      ? ISSUE_CARDS.find((c) => c.id === selectedIssue)?.label
      : undefined);
    const query = new URLSearchParams({
      serviceType: 'R',
      productName: 'Garage Door Repair',
      serviceCategory: 'Garage Door',
    });
    if (label) query.set('issue', label);
    navigate(`/scheduler?${query.toString()}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>

      {/* ── Hero ── */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 400, md: 480 },
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src="/images/services/garage-door/hero.webp"
          alt=""
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(100deg, rgba(7,27,65,0.88) 0%, rgba(11,61,145,0.70) 55%, rgba(7,27,65,0.45) 100%)',
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 7, md: 9 } }}>
          <Box sx={{ maxWidth: 580 }}>
            {/* Promo chip */}
            <Chip
              label="$20 OFF when you book online • Use code SAVE20"
              sx={{
                mb: 2.5,
                backgroundColor: '#F59E0B',
                color: '#1A1A1A',
                fontFamily: fonts.body,
                fontWeight: 700,
                fontSize: '0.78rem',
                height: 28,
              }}
            />
            <Typography
              component="h1"
              sx={{
                fontFamily: fonts.heading,
                fontWeight: 800,
                fontSize: { xs: '2.1rem', md: '2.9rem' },
                color: '#FFFFFF',
                lineHeight: 1.15,
                mb: 2,
              }}
            >
              Garage door repair made simple
            </Typography>
            <Typography
              sx={{
                fontFamily: fonts.body,
                color: 'rgba(255,255,255,0.88)',
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.65,
                mb: 3.5,
              }}
            >
              Quality repairs and installations from background-checked, insured technicians — booked online in minutes.
            </Typography>

            {/* Rating badge */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 3 }}>
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} sx={{ color: '#FBBF24', fontSize: 18 }} />
              ))}
              <Typography sx={{ fontFamily: fonts.body, color: 'rgba(255,255,255,0.9)', fontSize: '0.88rem', ml: 0.5 }}>
                4.9 · 2,000+ Reviews
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              onClick={() => goToScheduler()}
              sx={{
                background: '#FFFFFF',
                color: colors.navy,
                fontFamily: fonts.body,
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: '999px',
                px: 4.5,
                py: 1.6,
                fontSize: '1rem',
                '&:hover': { background: '#E8F1FF' },
              }}
            >
              Schedule Your Repair
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ── Issue Cards ── */}
      <Box sx={{ py: { xs: 5, md: 7 }, backgroundColor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Typography
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '1.45rem', md: '1.75rem' },
              color: '#1A1A1A',
              textAlign: 'center',
              mb: 1,
            }}
          >
            What's the issue?
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.body,
              color: '#64748B',
              textAlign: 'center',
              fontSize: '0.95rem',
              mb: 4,
            }}
          >
            Select your problem and we'll match you with the right technician.
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(5, 1fr)',
              },
              gap: 2,
              mb: 4,
            }}
          >
            {ISSUE_CARDS.map(({ id, label, Icon }) => {
              const isSelected = selectedIssue === id;
              return (
                <Box
                  key={id}
                  onClick={() => {
                    setSelectedIssue(isSelected ? null : id);
                  }}
                  sx={{
                    border: `2px solid ${isSelected ? colors.primaryBlue : '#E4E7EB'}`,
                    borderRadius: '14px',
                    p: { xs: 2, md: 2.5 },
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#E8F1FF' : '#FFFFFF',
                    transition: 'all 0.18s ease',
                    '&:hover': {
                      borderColor: colors.primaryBlue,
                      backgroundColor: '#F0F6FF',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(26,115,232,0.12)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      backgroundColor: isSelected ? colors.primaryBlue : '#F0F6FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 1.5,
                      transition: 'background-color 0.18s ease',
                    }}
                  >
                    <Icon size={20} color={isSelected ? '#FFFFFF' : colors.primaryBlue} />
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: fonts.body,
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      color: isSelected ? colors.primaryBlue : '#1A1A1A',
                      lineHeight: 1.3,
                    }}
                  >
                    {label}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => goToScheduler()}
              sx={{
                backgroundColor: colors.primaryBlue,
                color: '#FFFFFF',
                fontFamily: fonts.body,
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: '999px',
                px: 5,
                py: 1.5,
                '&:hover': { backgroundColor: colors.navy },
              }}
            >
              {selectedIssue ? 'Book for This Issue' : 'Schedule Your Repair'}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ── Benefits Strip ── */}
      <Box sx={{ py: { xs: 5, md: 7 }, backgroundColor: '#F8FAFC', borderTop: '1px solid #EEF0F3', borderBottom: '1px solid #EEF0F3' }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
              gap: { xs: 3, md: 4 },
            }}
          >
            {BENEFITS.map(({ Icon, title, desc }) => (
              <Box key={title} sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${colors.primaryBlue} 0%, ${colors.navy} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 1.5,
                  }}
                >
                  <Icon size={22} color="#FFFFFF" />
                </Box>
                <Typography
                  sx={{
                    fontFamily: fonts.heading,
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: '#1A1A1A',
                    mb: 0.5,
                  }}
                >
                  {title}
                </Typography>
                <Typography sx={{ fontFamily: fonts.body, color: '#64748B', fontSize: '0.85rem', lineHeight: 1.55 }}>
                  {desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Technicians at Work ── */}
      <Box sx={{ py: { xs: 5, md: 7 }, backgroundColor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Typography
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '1.35rem', md: '1.65rem' },
              color: '#1A1A1A',
              textAlign: 'center',
              mb: 1,
            }}
          >
            Professional technicians, every visit
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.body,
              color: '#64748B',
              textAlign: 'center',
              fontSize: '0.95rem',
              mb: 4,
            }}
          >
            Background-checked, insured pros ready to handle any garage door issue.
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: { xs: 2, md: 2.5 },
            }}
          >
            {TECH_GALLERY.map((item) => (
              <Box
                key={item.label}
                sx={{
                  position: 'relative',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  aspectRatio: '4/3',
                  boxShadow: '0 6px 24px rgba(10,37,64,0.10)',
                  '&:hover .tech-overlay': { opacity: 1 },
                  '&:hover img': { transform: 'scale(1.05)' },
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.label}
                  loading="lazy"
                  decoding="async"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.3s ease',
                  }}
                />
                <Box
                  className="tech-overlay"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(7,27,65,0.75) 0%, transparent 55%)',
                    opacity: 0.85,
                    transition: 'opacity 0.25s ease',
                  }}
                />
                <Typography
                  sx={{
                    position: 'absolute',
                    bottom: 14,
                    left: 14,
                    right: 14,
                    fontFamily: fonts.body,
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    color: '#FFFFFF',
                    lineHeight: 1.3,
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── How It Works ── */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#FFFFFF' }}>
        <Container maxWidth="md">
          <Typography
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '1.45rem', md: '1.8rem' },
              color: '#1A1A1A',
              textAlign: 'center',
              mb: 1,
            }}
          >
            How it works
          </Typography>
          <Typography
            sx={{ fontFamily: fonts.body, color: '#64748B', textAlign: 'center', mb: 5, fontSize: '0.95rem' }}
          >
            Three simple steps from request to completed repair.
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <Box key={step} sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${colors.primaryBlue} 0%, ${colors.navy} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>
                    {step}
                  </Typography>
                </Box>
                <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '1rem', color: '#1A1A1A', mb: 0.75 }}>
                  {title}
                </Typography>
                <Typography sx={{ fontFamily: fonts.body, color: '#64748B', fontSize: '0.875rem', lineHeight: 1.65 }}>
                  {desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Testimonials ── */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#F8FAFC', borderTop: '1px solid #EEF0F3' }}>
        <Container maxWidth="lg">
          <Typography
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '1.45rem', md: '1.8rem' },
              color: '#1A1A1A',
              textAlign: 'center',
              mb: 4,
            }}
          >
            What our customers say
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {TESTIMONIALS.map(({ name, location, rating, text }) => (
              <Box
                key={name}
                sx={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E4E7EB',
                  borderRadius: '16px',
                  p: 3,
                  boxShadow: '0 4px 16px rgba(10,37,64,0.06)',
                }}
              >
                <Box sx={{ display: 'flex', mb: 1.5 }}>
                  {[...Array(rating)].map((_, i) => (
                    <StarIcon key={i} sx={{ color: '#FBBF24', fontSize: 16 }} />
                  ))}
                </Box>
                <Typography
                  sx={{
                    fontFamily: fonts.body,
                    color: '#1A1A1A',
                    fontSize: '0.9rem',
                    lineHeight: 1.65,
                    mb: 2,
                    fontStyle: 'italic',
                  }}
                >
                  "{text}"
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      backgroundColor: colors.primaryBlue,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>
                      {name[0]}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '0.85rem', color: '#1A1A1A' }}>
                      {name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <MapPin size={12} color="#9AA5B1" />
                      <Typography sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: '#9AA5B1' }}>
                        {location}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── What to expect ── */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#FFFFFF' }}>
        <Container maxWidth="md">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 5,
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: fonts.heading,
                  fontWeight: 800,
                  fontSize: { xs: '1.45rem', md: '1.75rem' },
                  color: '#1A1A1A',
                  mb: 3,
                }}
              >
                What to expect from your repair
              </Typography>
              {[
                'Technician arrives in your 1-hour window',
                'Upfront, transparent estimate before work begins',
                'Repair completed using quality, warrantied parts',
                '25-point safety inspection on every visit',
                'Full walkthrough and test before job completion',
              ].map((item) => (
                <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                  <CheckCircleIcon sx={{ color: colors.primaryBlue, fontSize: 20, mt: 0.15, flexShrink: 0 }} />
                  <Typography sx={{ fontFamily: fonts.body, color: '#1A1A1A', fontSize: '0.925rem', lineHeight: 1.55 }}>
                    {item}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box
              component="img"
              src="/images/services/garage-door/hero.webp"
              alt="Garage door repair technician"
              loading="lazy"
              decoding="async"
              sx={{
                width: '100%',
                height: { xs: 240, md: 320 },
                objectFit: 'cover',
                borderRadius: '20px',
                display: { xs: 'none', md: 'block' },
              }}
            />
          </Box>
        </Container>
      </Box>

      <BrandsWeService category="garage-door" />

      {/* ── FAQ ── */}
      <Box sx={{ py: { xs: 5, md: 7 }, backgroundColor: '#F8FAFC', borderTop: '1px solid #EEF0F3' }}>
        <Container maxWidth="md">
          <Typography
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '1.5rem', md: '1.85rem' },
              color: colors.navy,
              textAlign: 'center',
              mb: { xs: 3, md: 4 },
            }}
          >
            Frequently asked questions
          </Typography>
          {FAQS.map((faq, index) => (
            <Accordion
              key={faq.question}
              disableGutters
              elevation={0}
              defaultExpanded={index === 0}
              TransitionProps={{ unmountOnExit: true, mountOnEnter: true }}
              sx={{
                border: '1px solid #E4E7EB',
                borderRadius:
                  index === 0
                    ? '12px 12px 0 0'
                    : index === FAQS.length - 1
                    ? '0 0 12px 12px'
                    : 0,
                '&:not(:last-child)': { borderBottom: 'none' },
                '&::before': { display: 'none' },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: colors.primaryBlue }} />}
                sx={{ px: { xs: 2, md: 3 } }}
              >
                <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '0.95rem', color: '#1A1A1A' }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: { xs: 2, md: 3 }, pt: 0, pb: 2.5 }}>
                <Typography sx={{ fontFamily: fonts.body, color: '#64748B', fontSize: '0.925rem', lineHeight: 1.7 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>

      {/* ── Door Gallery ── */}
      <Box sx={{ py: { xs: 5, md: 7 }, backgroundColor: '#FFFFFF', borderTop: '1px solid #EEF0F3' }}>
        <Container maxWidth="lg">
          <Typography
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '1.3rem', md: '1.6rem' },
              color: '#1A1A1A',
              textAlign: 'center',
              mb: 1,
            }}
          >
            Garage doors we repair & install
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, color: '#64748B', textAlign: 'center', fontSize: '0.9rem', mb: 4 }}>
            From classic panel doors to modern styles — our technicians service all major door types.
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 2.5,
            }}
          >
            {DOOR_GALLERY.map((door) => (
              <Box
                key={door.title}
                sx={{
                  borderRadius: '18px',
                  overflow: 'hidden',
                  border: '1px solid #E4E7EB',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 4px 18px rgba(10,37,64,0.06)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 14px 32px rgba(10,37,64,0.12)',
                  },
                }}
              >
                <Box
                  component="img"
                  src={door.image}
                  alt={door.title}
                  loading="lazy"
                  decoding="async"
                  sx={{
                    width: '100%',
                    height: { xs: 200, sm: 210, md: 220 },
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                <Box sx={{ p: 2 }}>
                  <Typography
                    sx={{
                      fontFamily: fonts.heading,
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: '#0B3D91',
                      mb: 0.75,
                    }}
                  >
                    {door.title}
                  </Typography>
                  <Typography sx={{ fontFamily: fonts.body, fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6 }}>
                    {door.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Bottom CTA ── */}
      <Box sx={{ py: { xs: 7, md: 9 }, backgroundColor: colors.navy, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Typography
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              color: '#FFFFFF',
              lineHeight: 1.2,
              mb: 2,
            }}
          >
            Ready to fix your garage door?
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.body,
              color: 'rgba(255,255,255,0.88)',
              fontSize: '1.05rem',
              lineHeight: 1.6,
            }}
          >
            Book online in minutes — same-day appointments often available.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default GarageDoorRepairPage;
