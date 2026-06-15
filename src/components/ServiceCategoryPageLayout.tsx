import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TriangleAlert } from 'lucide-react';
import { colors, fonts } from '../theme';
import ServiceCategoryBookingSection from './ServiceCategoryBookingSection';
import CategoryBrandSection from './CategoryBrandSection';
import type { ServiceCategoryPageConfig } from '../data/serviceCategoryPages';

interface ServiceCategoryPageLayoutProps {
  config: ServiceCategoryPageConfig;
}

/** Unified split-hero background — smooth white-to-blue, no hard column split */
const SPLIT_HERO_BACKGROUND = `
  radial-gradient(circle at 82% 18%, rgba(26, 115, 232, 0.14), transparent 42%),
  radial-gradient(circle at 65% 45%, rgba(94, 163, 245, 0.12), transparent 38%),
  linear-gradient(90deg, #FFFFFF 0%, #F8FBFF 35%, #EEF6FF 70%, #E8F1FF 100%)
`;

const ServiceCategoryPageLayout: React.FC<ServiceCategoryPageLayoutProps> = ({ config }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingRef = useRef<HTMLDivElement>(null);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (!serviceParam) return;
    const icon = config.iconCards.find((c) => c.serviceIds.includes(serviceParam));
    if (icon) {
      setSelectedIconId(icon.id);
      setSelectedServiceId(serviceParam);
      setTimeout(() => bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350);
    }
  }, [searchParams, config.iconCards]);

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePrimaryCta = () => {
    if (config.slug === 'smart-home' && config.hero.secondaryCta) {
      scrollToBooking();
      return;
    }
    if (config.slug === 'home-appliances') {
      navigate('/scheduler');
      return;
    }
    scrollToBooking();
  };

  const handleSecondaryCta = () => {
    if (config.hero.secondaryCta?.toLowerCase().includes('emergency')) {
      navigate('/emergency-service');
      return;
    }
    if (config.slug === 'smart-home') {
      navigate('/contact');
      return;
    }
    navigate('/emergency-service');
  };

  const renderHero = () => {
    if (config.hero.layout === 'banner') {
      return (
        <Box
          sx={{
            position: 'relative',
            minHeight: { xs: 360, md: 420 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={config.hero.image}
            alt=""
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: config.hero.overlayLight
                ? 'linear-gradient(180deg, rgba(7,27,65,0.45) 0%, rgba(11,61,145,0.35) 50%, rgba(7,27,65,0.52) 100%)'
                : 'linear-gradient(180deg, rgba(7,27,65,0.72) 0%, rgba(11,61,145,0.55) 50%, rgba(7,27,65,0.78) 100%)',
            }}
          />
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center', py: { xs: 6, md: 8 }, px: 3 }}>
            <Typography
              component="h1"
              sx={{
                fontFamily: fonts.heading,
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                color: '#FFFFFF',
                lineHeight: 1.15,
                mb: 2,
              }}
            >
              {config.hero.title}
            </Typography>
            <Typography
              sx={{
                fontFamily: fonts.body,
                color: 'rgba(255,255,255,0.92)',
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.6,
                mb: 3.5,
                maxWidth: 560,
                mx: 'auto',
              }}
            >
              {config.hero.subtitle}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handlePrimaryCta}
                sx={{
                  background: '#FFFFFF',
                  color: colors.navy,
                  fontFamily: fonts.body,
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: '999px',
                  px: 4,
                  py: 1.5,
                  '&:hover': { background: '#E8F1FF' },
                }}
              >
                {config.hero.primaryCta}
              </Button>
              {config.hero.secondaryCta && (
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleSecondaryCta}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.6)',
                    color: '#FFFFFF',
                    fontFamily: fonts.body,
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '999px',
                    px: 3.5,
                    py: 1.5,
                    '&:hover': { borderColor: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.08)' },
                  }}
                >
                  {config.hero.secondaryCta}
                </Button>
              )}
            </Box>
            {config.hero.trustBullets && config.hero.trustBullets.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: { xs: 1.5, md: 2.5 },
                  justifyContent: 'center',
                  mt: 4,
                }}
              >
                {config.hero.trustBullets.map((bullet) => (
                  <Typography
                    key={bullet}
                    sx={{
                      fontFamily: fonts.body,
                      fontSize: '0.9rem',
                      color: 'rgba(255,255,255,0.92)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                        flexShrink: 0,
                      }}
                    />
                    {bullet}
                  </Typography>
                ))}
              </Box>
            )}
          </Container>
        </Box>
      );
    }

    const isEmergencySecondary = config.hero.secondaryCta?.toLowerCase().includes('emergency') ?? false;

    return (
      <Box
        sx={{
          background: SPLIT_HERO_BACKGROUND,
          borderBottom: '1px solid #E4E7EB',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            minHeight: { xs: 'auto', md: '460px' },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              px: { xs: 3, sm: 5, md: 7, lg: 10 },
              pt: { xs: 6, md: 0 },
              pb: { xs: 5, md: 0 },
              background: 'transparent',
            }}
          >
            <Typography
              component="h1"
              sx={{
                fontFamily: fonts.heading,
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.4rem', md: '2.75rem' },
                color: '#1A1A1A',
                lineHeight: 1.15,
                mb: 2,
              }}
            >
              {config.hero.title}
            </Typography>
            <Typography
              sx={{
                fontFamily: fonts.body,
                color: '#64748B',
                fontSize: { xs: '1rem', md: '1.05rem' },
                lineHeight: 1.7,
                mb: 4,
                maxWidth: 480,
              }}
            >
              {config.hero.subtitle}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                onClick={handlePrimaryCta}
                sx={{
                  backgroundColor: colors.primaryBlue,
                  color: '#fff',
                  fontFamily: fonts.body,
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: '14px',
                  px: 3.5,
                  py: 1.4,
                  '&:hover': { backgroundColor: colors.navy },
                }}
              >
                {config.hero.primaryCta}
              </Button>
              {config.hero.secondaryCta && (
                <Button
                  variant="outlined"
                  onClick={handleSecondaryCta}
                  sx={{
                    borderColor: isEmergencySecondary ? '#EF4444' : colors.primaryBlue,
                    color: isEmergencySecondary ? '#EF4444' : colors.primaryBlue,
                    backgroundColor: '#FFFFFF',
                    fontFamily: fonts.body,
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '14px',
                    px: 3,
                    py: 1.4,
                    '&:hover': {
                      borderColor: isEmergencySecondary ? '#DC2626' : colors.navy,
                      backgroundColor: isEmergencySecondary ? '#FFF5F5' : '#E8F1FF',
                    },
                  }}
                >
                  {config.hero.secondaryCta}
                </Button>
              )}
            </Box>
            {config.hero.trustBullets && config.hero.trustBullets.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 3 }}>
                {config.hero.trustBullets.map((bullet) => (
                  <Box
                    key={bullet}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.75,
                      px: 1.75,
                      py: 0.6,
                      borderRadius: '999px',
                      border: '1px solid #DFE3E8',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <Box
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        backgroundColor: colors.primaryBlue,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: fonts.body,
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        color: '#0B3D91',
                        lineHeight: 1,
                      }}
                    >
                      {bullet}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          {/* ── Circular hero image with decorative rings & dots ── */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: { xs: 340, sm: 420, md: 520 },
              background: 'transparent',
              overflow: 'hidden',
            }}
          >
            {/* Outer ring 2 */}
            <Box
              sx={{
                position: 'absolute',
                width: { xs: 385, sm: 465, md: 575 },
                height: { xs: 385, sm: 465, md: 575 },
                borderRadius: '50%',
                border: '1px solid rgba(26,115,232,0.09)',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }}
            />
            {/* Outer ring 1 */}
            <Box
              sx={{
                position: 'absolute',
                width: { xs: 315, sm: 395, md: 490 },
                height: { xs: 315, sm: 395, md: 490 },
                borderRadius: '50%',
                border: '2px solid rgba(26,115,232,0.18)',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }}
            />

            {/* Decorative floating dots — subtle accents */}
            <Box sx={{ position: 'absolute', top: '17%', left: '13%', width: 12, height: 12, borderRadius: '50%', backgroundColor: '#1A73E8', opacity: 0.38, pointerEvents: 'none' }} />
            <Box sx={{ position: 'absolute', top: '14%', right: '16%', width: 9, height: 9, borderRadius: '50%', backgroundColor: '#0B3D91', opacity: 0.32, pointerEvents: 'none' }} />
            <Box sx={{ position: 'absolute', top: '42%', left: '5%', width: 7, height: 7, borderRadius: '50%', backgroundColor: '#1A73E8', opacity: 0.28, pointerEvents: 'none' }} />
            <Box sx={{ position: 'absolute', bottom: '22%', left: '10%', width: 10, height: 10, borderRadius: '50%', backgroundColor: '#1A73E8', opacity: 0.34, pointerEvents: 'none' }} />
            <Box sx={{ position: 'absolute', bottom: '16%', right: '14%', width: 13, height: 13, borderRadius: '50%', backgroundColor: '#0B3D91', opacity: 0.36, pointerEvents: 'none' }} />
            <Box sx={{ position: 'absolute', top: '50%', right: '5%', width: 8, height: 8, borderRadius: '50%', backgroundColor: '#1A73E8', opacity: 0.3, pointerEvents: 'none' }} />

            {/* Main circular image */}
            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
                width: { xs: 250, sm: 320, md: 400 },
                height: { xs: 250, sm: 320, md: 400 },
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: '0 20px 56px rgba(11,61,145,0.20)',
                flexShrink: 0,
              }}
            >
              <Box
                component="img"
                src={config.hero.image}
                alt=""
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: config.hero.imagePosition ?? 'center center',
                  display: 'block',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  const brandBeforeBooking =
    config.brandSection &&
    config.brandSection.placement !== 'after-icon-selection' &&
    config.brandSection.placement !== 'with-icon-header' &&
    config.brandSection.placement !== 'before-how-it-works';
  const brandWithIconHeader =
    config.brandSection?.placement === 'with-icon-header' ? config.brandSection : undefined;
  const brandAfterIcons =
    config.brandSection?.placement === 'after-icon-selection' ? config.brandSection : undefined;
  const brandBeforeHowItWorks =
    config.brandSection?.placement === 'before-how-it-works' ||
    config.brandSection?.marqueePlacement === 'before-how-it-works'
      ? config.brandSection
      : undefined;
  const brandBeforeHowItWorksMode =
    config.brandSection?.marqueePlacement === 'before-how-it-works' ? 'marquee-only' : 'full';

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      {renderHero()}

      {brandBeforeBooking && config.brandSection && (
        <CategoryBrandSection config={config.brandSection} />
      )}

      <ServiceCategoryBookingSection
        sectionRef={bookingRef}
        iconSectionTitle={config.iconSectionTitle}
        iconSectionSubtitle={config.iconSectionSubtitle}
        popularSectionTitle={config.popularSectionTitle}
        popularSectionSubtitle={config.popularSectionSubtitle}
        iconCards={config.iconCards}
        categoryId={config.categoryId}
        selectedIconId={selectedIconId}
        onSelectIcon={setSelectedIconId}
        selectedServiceId={selectedServiceId}
        onSelectService={setSelectedServiceId}
        desktopColumns={config.desktopIconColumns}
        brandAfterIcons={brandAfterIcons}
        brandWithIconHeader={brandWithIconHeader}
        detailPanelVariant={config.detailPanelVariant}
        cardHoverLift={config.cardHoverLift}
        compactIconCards={config.compactIconCards}
      />

      {brandBeforeHowItWorks && (
        <CategoryBrandSection config={brandBeforeHowItWorks} sectionMode={brandBeforeHowItWorksMode} />
      )}

      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#F8FAFC', borderTop: '1px solid #EEF0F3' }}>
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
            {config.howItWorksTitle ?? 'How it works'}
          </Typography>
          {config.howItWorksSubtitle ? (
            <Typography
              sx={{
                fontFamily: fonts.body,
                color: '#64748B',
                textAlign: 'center',
                mb: 5,
                fontSize: '1rem',
              }}
            >
              {config.howItWorksSubtitle}
            </Typography>
          ) : !config.howItWorksTitle ? (
            <Typography
              sx={{
                fontFamily: fonts.body,
                color: '#64748B',
                textAlign: 'center',
                mb: 5,
                fontSize: '1rem',
              }}
            >
              Three simple steps from request to completed service.
            </Typography>
          ) : (
            <Box sx={{ mb: 5 }} />
          )}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: config.howItWorks.length === 4 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                lg: config.howItWorks.length === 4 ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
              },
              gap: 4,
            }}
          >
            {config.howItWorks.map(({ step, title, description }) => (
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
                  {description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {config.safetyNotice && (
        <Box sx={{ py: { xs: 4, md: 5 }, backgroundColor: '#FFFFFF' }}>
          <Container maxWidth="md">
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'flex-start',
                p: { xs: 2.5, md: 3 },
                borderRadius: '16px',
                border: '1px solid #FDE68A',
                backgroundColor: '#FFFBEB',
              }}
            >
              <TriangleAlert size={28} color="#B45309" strokeWidth={1.75} style={{ flexShrink: 0, marginTop: 2 }} />
              <Box>
                <Typography
                  sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '1.05rem', color: '#92400E', mb: 0.75 }}
                >
                  {config.safetyNotice.title}
                </Typography>
                <Typography sx={{ fontFamily: fonts.body, fontSize: '0.925rem', color: '#64748B', lineHeight: 1.7 }}>
                  {config.safetyNotice.text}
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      )}

      <Box sx={{ py: { xs: 5, md: 7 }, backgroundColor: '#FFFFFF' }}>
        <Container maxWidth="md">
          <Typography
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '1.5rem', md: '1.85rem' },
              color: '#0B3D91',
              textAlign: 'center',
              mb: { xs: 3, md: 4 },
            }}
          >
            {config.faqTitle ?? 'FAQ'}
          </Typography>
          {config.faqs.map((faq, index) => (
            <Accordion
              key={faq.question}
              disableGutters
              elevation={0}
              defaultExpanded={index === 0}
              sx={{
                border: '1px solid #E4E7EB',
                borderRadius: index === 0 ? '12px 12px 0 0' : index === config.faqs.length - 1 ? '0 0 12px 12px' : 0,
                '&:not(:last-child)': { borderBottom: 'none' },
                '&::before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#1A73E8' }} />} sx={{ px: { xs: 2, md: 3 } }}>
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
            {config.bottomCta.title}
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, color: 'rgba(255,255,255,0.88)', fontSize: '1.05rem', mb: 3.5, lineHeight: 1.6 }}>
            {config.bottomCta.subtitle}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handlePrimaryCta}
              sx={{
                background: '#FFFFFF',
                color: colors.navy,
                fontFamily: fonts.body,
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: '999px',
                px: 4,
                py: 1.5,
                '&:hover': { background: '#E8F1FF' },
              }}
            >
              {config.bottomCta.primaryLabel}
            </Button>
            {config.bottomCta.secondaryLabel && (
              <Button
                variant="outlined"
                size="large"
                onClick={handleSecondaryCta}
                sx={{
                  borderColor: 'rgba(255,255,255,0.45)',
                  color: '#FFFFFF',
                  fontFamily: fonts.body,
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '999px',
                  px: 3.5,
                  py: 1.5,
                  '&:hover': { borderColor: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.08)' },
                }}
              >
                {config.bottomCta.secondaryLabel}
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default ServiceCategoryPageLayout;
