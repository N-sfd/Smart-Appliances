import React, { useMemo, useState } from 'react';
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
import { colors, fonts } from '../theme';
import { useSeo } from '../hooks/useSeo';
import type { ServiceLandingPageConfig } from '../data/serviceLandingPageTypes';
import { SERVICE_AREA_REGION_LABEL_SHORT, SERVICE_AREA_REGION_LABEL } from '../data/serviceAreas';
interface ServiceLandingPageLayoutProps {
  config: ServiceLandingPageConfig;
}

const ServiceLandingPageLayout: React.FC<ServiceLandingPageLayoutProps> = ({ config }) => {
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  const serviceSchema = useMemo(() => ({
    name: config.schedulerProductName,
    description: config.metaDescription,
    areaServed: SERVICE_AREA_REGION_LABEL.split(', ').map((s) => s.replace(/^and /, '')),
  }), [config.schedulerProductName, config.metaDescription]);

  useSeo({
    title: config.metaTitle,
    description: config.metaDescription,
    path: `/services/${config.slug}`,
    image: config.heroImage,
    faqs: config.faqs,
    service: serviceSchema,
  });

  const goToScheduler = (issueLabel?: string) => {
    const label = issueLabel ?? (selectedIssue
      ? config.issues.find((c) => c.id === selectedIssue)?.label
      : undefined);
    const query = new URLSearchParams({
      serviceType: 'R',
      productName: config.schedulerProductName,
      serviceCategory: config.schedulerCategory,
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
          src={config.heroImage}
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
            {config.promoChip && (
              <Chip
                label={config.promoChip}
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
            )}
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
              {config.heroTitle}
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
              {config.heroSubtitle}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 3 }}>
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} sx={{ color: '#FBBF24', fontSize: 18 }} />
              ))}
              <Typography sx={{ fontFamily: fonts.body, color: 'rgba(255,255,255,0.9)', fontSize: '0.88rem', ml: 0.5 }}>
                {config.ratingLabel}
              </Typography>
            </Box>

            <Typography sx={{ fontFamily: fonts.body, color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', mb: 3 }}>
              {config.startingPriceLabel} · Serving {SERVICE_AREA_REGION_LABEL_SHORT}
            </Typography>

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
              {config.ctaButtonLabel}
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
            {config.issueSectionTitle}
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
            {config.issueSectionSubtitle}
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: `repeat(${Math.min(config.issues.length, 5)}, 1fr)`,
              },
              gap: 2,
              mb: 4,
            }}
          >
            {config.issues.map(({ id, label, Icon }) => {
              const isSelected = selectedIssue === id;
              return (
                <Box
                  key={id}
                  onClick={() => setSelectedIssue(isSelected ? null : id)}
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
              {selectedIssue ? 'Book for This Issue' : config.ctaButtonLabel}
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
            {config.benefits.map(({ Icon, title, desc }) => (
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
            {config.techGalleryTitle}
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
            {config.techGallerySubtitle}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: { xs: 2, md: 2.5 },
            }}
          >
            {config.techGallery.map((item) => (
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
            Three simple steps from request to completed service.
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            {config.howItWorks.map(({ step, title, desc }) => (
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
            {config.testimonials.map(({ name, location, rating, text }) => (
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
                    <Typography sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: '#9AA5B1' }}>
                      {location}
                    </Typography>
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
                {config.whatToExpectTitle}
              </Typography>
              {config.whatToExpect.map((item) => (
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
              src={config.whatToExpectImage}
              alt={config.heroTitle}
              loading="lazy"
              decoding="async"
              sx={{
                width: '100%',
                height: { xs: 240, md: 320 },
                objectFit: 'cover',
                borderRadius: '16px',
                display: { xs: 'none', md: 'block' },
              }}
            />
          </Box>
        </Container>
      </Box>

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
          {config.faqs.map((faq, index) => (
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
                    : index === config.faqs.length - 1
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
            {config.ctaTitle}
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.body,
              color: 'rgba(255,255,255,0.88)',
              fontSize: '1.05rem',
              lineHeight: 1.6,
              mb: 3,
            }}
          >
            {config.ctaSubtitle}
          </Typography>
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
            {config.ctaButtonLabel}
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default ServiceLandingPageLayout;
