import React, { useEffect, useMemo, useRef } from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';
import { fonts } from '../theme';
import { HubIconCard } from '../data/serviceHubConfigs';
import { getServiceImage } from '../data/serviceImages';
import { schedulerCategoryFromHubId } from '../data/schedulerPrefill';
import { SERVICE_ISSUE_CHIPS } from '../data/serviceIssueChips';
import { CATEGORY_SERVICE_DETAILS } from '../data/serviceCategoryDetails';
import { getCategoryFallbackImage } from '../data/serviceCategoryFallbacks';
import { getCategoryHeroFallback } from '../data/categoryHeroFallbacks';
import { APPLIANCE_DEFAULT_IMAGE } from '../data/applianceHub';
import CategoryBrandSection from './CategoryBrandSection';
import type { CategoryBrandConfig } from '../data/serviceCategoryPages';

/** categoryId -> the slug used by categoryHeroFallbacks (only smart-home's differ). */
const CATEGORY_SLUG_BY_ID: Record<string, string> = {
  'smart-home-setup': 'smart-home',
  'tv-mounting': 'tv-mounting',
  'phone-repair': 'phone-repair',
  handyman: 'handyman',
};

/** Absolute last resort when no category fallback or illustration is available. */
const NEUTRAL_PLACEHOLDER_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" role="img" aria-label="Image not available">
  <rect width="480" height="360" fill="#E4E7EB"/>
  <g fill="none" stroke="#94A3B8" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" transform="translate(190 130)">
    <rect x="0" y="0" width="100" height="72" rx="8"/>
    <circle cx="24" cy="22" r="9"/>
    <path d="M0 58l28-26 20 16 30-28 22 38"/>
  </g>
</svg>
`)}`;

const EMERGENCY_IDS = new Set([
  'emergency-plumbing',
  'emergency-hvac-service',
  'emergency-electrical-service',
]);

const TRUST_BULLETS = [
  {
    title: 'Estimate before work begins',
    desc: 'Your technician explains the issue and provides pricing before starting.',
  },
  {
    title: 'On-time arrival windows',
    desc: 'We honor scheduled windows and keep you updated along the way.',
  },
  {
    title: 'Qualified technicians',
    desc: 'Licensed, insured, and background-checked service professionals.',
  },
];

interface ServiceCategoryBookingSectionProps {
  iconSectionTitle: string;
  iconSectionSubtitle?: string;
  popularSectionTitle: string;
  popularSectionSubtitle?: string;
  iconCards: HubIconCard[];
  categoryId: string;
  selectedIconId: string | null;
  onSelectIcon: (id: string | null) => void;
  selectedServiceId: string | null;
  onSelectService: (id: string | null) => void;
  desktopColumns?: 3 | 4 | 5;
  sectionRef?: React.RefObject<HTMLDivElement | null>;
  brandAfterIcons?: CategoryBrandConfig;
  brandWithIconHeader?: CategoryBrandConfig;
  detailPanelVariant?: 'default' | 'electrical';
  cardHoverLift?: boolean;
  compactIconCards?: boolean;
  serviceCardVariant?: 'icon' | 'photo';
}

interface ResolvedService {
  id: string;
  scheduleId: string;
  title: string;
  description: string;
  image: string;
  chips: string[];
  detailDescription?: string;
  includes?: string[];
  commonIssues?: string[];
  safetyNotice?: string;
}

function resolveService(serviceId: string, categoryId: string): ResolvedService {
  const base = getServiceImage(serviceId, categoryId);
  const override = CATEGORY_SERVICE_DETAILS[serviceId];
  let image = override?.image ?? base.image;

  // Tier 1 (selected service image) failed to resolve to anything but the
  // generic appliance photo — work down the rest of the fallback hierarchy
  // instead of ever showing that image outside the Appliance/Electrical pages.
  const looksLikeApplianceDefault = image.includes('hero-technician') || image === APPLIANCE_DEFAULT_IMAGE;
  if (looksLikeApplianceDefault && categoryId !== 'electrical-services') {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn(
        `[ServiceCategoryBookingSection] No dedicated image for service "${serviceId}" in category "${categoryId}" — using a category fallback instead of the appliance default.`,
      );
    }
    const categorySlug = CATEGORY_SLUG_BY_ID[categoryId] ?? categoryId;
    // Tier 2: category support image (a real photo where one exists) → Tier 3:
    // category-specific illustration → Tier 4: neutral placeholder.
    image = getCategoryFallbackImage(categoryId) || getCategoryHeroFallback(categorySlug) || NEUTRAL_PLACEHOLDER_IMAGE;
  }

  return {
    id: serviceId,
    scheduleId: override?.scheduleId ?? serviceId,
    title: override?.title ?? base.title,
    description: override?.description ?? base.desc,
    image,
    chips: override?.chips ?? SERVICE_ISSUE_CHIPS[serviceId] ?? [],
    detailDescription: override?.detailDescription,
    includes: override?.includes,
    commonIssues: override?.commonIssues,
    safetyNotice: override?.safetyNotice,
  };
}

function buildDetailBullets(service: ResolvedService): { title: string; desc?: string }[] {
  if (service.includes?.length) {
    return service.includes.map((item) => ({ title: item }));
  }
  if (service.commonIssues?.length) {
    return service.commonIssues.map((item) => ({ title: item }));
  }
  if (service.chips.length) {
    return service.chips.map((item) => ({ title: item }));
  }
  return TRUST_BULLETS;
}

const ServiceCategoryBookingSection: React.FC<ServiceCategoryBookingSectionProps> = ({
  iconSectionTitle,
  iconSectionSubtitle,
  iconCards,
  categoryId,
  selectedIconId,
  onSelectIcon,
  selectedServiceId,
  onSelectService,
  desktopColumns = 4,
  sectionRef,
  brandAfterIcons,
  brandWithIconHeader,
  detailPanelVariant = 'default',
  cardHoverLift = false,
  compactIconCards = false,
  serviceCardVariant = 'icon',
}) => {
  const navigate = useNavigate();
  const detailRef = useRef<HTMLDivElement>(null);

  const activeIcon = iconCards.find((c) => c.id === selectedIconId) ?? null;

  const popularServices = useMemo(() => {
    if (!activeIcon) return [];
    return activeIcon.serviceIds.map((id) => resolveService(id, categoryId));
  }, [activeIcon, categoryId]);

  const displayService = useMemo(() => {
    if (!activeIcon || popularServices.length === 0) return null;
    const match = selectedServiceId
      ? popularServices.find((s) => s.id === selectedServiceId)
      : null;
    return match ?? popularServices[0];
  }, [activeIcon, popularServices, selectedServiceId]);

  const activeServiceId = displayService?.id ?? null;

  useEffect(() => {
    if (!activeServiceId || !detailRef.current) return;
    detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [activeServiceId]);

  const handleSchedule = (service: ResolvedService) => {
    if (EMERGENCY_IDS.has(service.scheduleId)) {
      navigate('/emergency-service');
      return;
    }
    const schedulerCategory = schedulerCategoryFromHubId(categoryId);
    const title = service.title;
    // Card titles like "Furniture Assembly" or "Standard TV Mounting" are already
    // complete, human-readable product names — only titles with no descriptive
    // keyword at all (rare) get a suffix appended so the scheduler category-detail
    // step still has something meaningful to show.
    const isInstallType = /install|mount|assembly|hanging|setup|conceal/i.test(title);
    const isMaintenanceType = /mainten|clean/i.test(title);
    const typeCode = isInstallType ? 'I' : isMaintenanceType ? 'M' : 'R';
    const isCompleteTitle = /repair|install|mainten|clean|service|setup|mount|assembly|hanging|assessment|replacement|painting|conceal|diagnostic/i.test(
      title,
    );
    const productName = isCompleteTitle
      ? title
      : typeCode === 'I' ? `${title} Installation`
      : typeCode === 'M' ? `${title} Maintenance`
      : `${title} Repair`;
    const query = new URLSearchParams({ serviceType: typeCode, productName });
    if (schedulerCategory) {
      query.set('serviceCategory', schedulerCategory);
    }
    navigate(`/scheduler?${query.toString()}`);
  };

  const isPhotoCards = serviceCardVariant === 'photo';

  const lgIconCols = isPhotoCards
    ? 'repeat(3, minmax(0, 1fr))'
    : desktopColumns === 5
    ? 'repeat(5, 1fr)'
    : desktopColumns === 3
    ? 'repeat(3, 1fr)'
    : 'repeat(4, 1fr)';

  // When any card in this grid has a description, size every card in the grid to
  // match so the row stays equal-height instead of some cards being taller than others.
  const hasCardDescriptions = iconCards.some((c) => c.description);

  return (
    <Box ref={sectionRef} sx={{ backgroundColor: '#FFFFFF', py: { xs: 6, md: 8 } }}>
      <Box sx={{ maxWidth: 1180, mx: 'auto', px: { xs: 2, sm: 3 } }}>
        {brandWithIconHeader ? (
          <CategoryBrandSection
            config={brandWithIconHeader}
            embedded
            sectionMode={
              brandWithIconHeader.marqueePlacement === 'before-how-it-works' ? 'chips-only' : 'full'
            }
          />
        ) : (
          <>
            {iconSectionTitle && (
              <Typography
                sx={{
                  fontFamily: fonts.heading,
                  fontWeight: 800,
                  fontSize: { xs: '1.35rem', sm: '1.5rem', md: '1.85rem' },
                  color: '#1A1A1A',
                  textAlign: 'center',
                  whiteSpace: 'normal',
                  overflowWrap: 'break-word',
                  mb: iconSectionSubtitle ? 1 : 4.5,
                }}
              >
                {iconSectionTitle}
              </Typography>
            )}
            {iconSectionSubtitle && (
              <Typography
                sx={{
                  fontFamily: fonts.body,
                  color: '#64748B',
                  textAlign: 'center',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  mb: 4.5,
                  maxWidth: 560,
                  mx: 'auto',
                }}
              >
                {iconSectionSubtitle}
              </Typography>
            )}
          </>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: isPhotoCards
              ? {
                  xs: '1fr',
                  sm: 'repeat(2, minmax(0, 1fr))',
                  md: 'repeat(3, minmax(0, 1fr))',
                  lg: lgIconCols,
                }
              : {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: desktopColumns === 4 ? 'repeat(4, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))',
                  lg: lgIconCols,
                },
            gap: isPhotoCards ? { xs: 2, md: 2.5 } : { xs: 1.5, md: 2 },
            alignItems: 'stretch',
            maxWidth: !isPhotoCards && desktopColumns === 4 && iconCards.length === 8 ? 960 : undefined,
            mx: !isPhotoCards && desktopColumns === 4 && iconCards.length === 8 ? 'auto' : undefined,
            mb: displayService ? 4 : brandAfterIcons ? 0 : 0,
          }}
        >
          {iconCards.map(({ id, label, description, Icon, cardImage }) => {
            const isActive = selectedIconId === id;
            const photoSrc = cardImage ?? (isPhotoCards ? resolveService(iconCards.find((c) => c.id === id)?.serviceIds[0] ?? '', categoryId).image : undefined);

            if (isPhotoCards && photoSrc) {
              return (
                <Box
                  key={id}
                  component="button"
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => {
                    if (isActive) {
                      onSelectIcon(null);
                      onSelectService(null);
                    } else {
                      const card = iconCards.find((c) => c.id === id);
                      onSelectIcon(id);
                      onSelectService(card?.serviceIds[0] ?? null);
                    }
                  }}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    p: 0,
                    overflow: 'hidden',
                    backgroundColor: '#FFFFFF',
                    border: `2px solid ${isActive ? '#1A73E8' : '#E4E7EB'}`,
                    borderRadius: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease-in-out',
                    outline: 'none',
                    boxShadow: isActive ? '0 8px 24px rgba(26, 115, 232, 0.16)' : '0 2px 8px rgba(15, 23, 42, 0.06)',
                    '&:hover': {
                      borderColor: '#1A73E8',
                      transform: cardHoverLift ? 'translateY(-3px)' : 'none',
                      boxShadow: '0 12px 28px rgba(26, 115, 232, 0.14)',
                    },
                    '&:focus-visible': {
                      outline: '2px solid #1A73E8',
                      outlineOffset: '2px',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={photoSrc}
                    alt={label}
                    loading="lazy"
                    width={400}
                    height={300}
                    sx={{
                      width: '100%',
                      aspectRatio: '4 / 3',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: fonts.body,
                      fontWeight: isActive ? 700 : 600,
                      fontSize: { xs: '0.9rem', md: '0.95rem' },
                      color: '#1A1A1A',
                      textAlign: 'center',
                      px: 1.5,
                      py: 1.5,
                      lineHeight: 1.35,
                    }}
                  >
                    {label}
                  </Typography>
                </Box>
              );
            }

            return (
              <Box
                key={id}
                component="button"
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  if (isActive) {
                    onSelectIcon(null);
                    onSelectService(null);
                  } else {
                    const card = iconCards.find((c) => c.id === id);
                    onSelectIcon(id);
                    onSelectService(card?.serviceIds[0] ?? null);
                  }
                }}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: description ? 'flex-start' : 'center',
                  width: '100%',
                  height: '100%',
                  minHeight: compactIconCards
                    ? { xs: 108, sm: 112, md: 116 }
                    : hasCardDescriptions
                    ? { xs: 172, sm: 180, md: 184 }
                    : { xs: 120, sm: 128, md: 132 },
                  backgroundColor: isActive ? '#E8F1FF' : '#FFFFFF',
                  border: `1px solid ${isActive ? '#1A73E8' : '#E4E7EB'}`,
                  borderRadius: compactIconCards ? '16px' : '20px',
                  py: compactIconCards ? { xs: '16px', md: '18px' } : '28px',
                  px: compactIconCards ? { xs: '12px', md: '14px' } : '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  outline: 'none',
                  boxShadow: isActive ? '0 6px 18px rgba(26, 115, 232, 0.12)' : 'none',
                  '&:hover': {
                    borderColor: '#1A73E8',
                    backgroundColor: '#E8F1FF',
                    transform: cardHoverLift ? 'translateY(-2px)' : 'none',
                    boxShadow: '0 8px 22px rgba(26, 115, 232, 0.14)',
                    '& .hub-icon': { color: '#1A73E8' },
                  },
                  '&:focus-visible': {
                    outline: '2px solid #1A73E8',
                    outlineOffset: '2px',
                  },
                }}
              >
                <Icon
                  className="hub-icon"
                  size={compactIconCards ? 32 : 42}
                  strokeWidth={1.5}
                  color={isActive ? '#1A73E8' : '#64748B'}
                  style={{ transition: 'color 0.18s ease', flexShrink: 0 }}
                />
                <Typography
                  sx={{
                    fontFamily: fonts.body,
                    fontWeight: isActive ? 700 : 600,
                    fontSize: compactIconCards
                      ? { xs: '0.78rem', md: '0.84rem' }
                      : { xs: '0.875rem', md: '0.95rem' },
                    color: '#1A1A1A',
                    textAlign: 'center',
                    mt: compactIconCards ? 1.25 : 1.75,
                    lineHeight: 1.35,
                  }}
                >
                  {label}
                </Typography>
                {description && (
                  <Typography
                    sx={{
                      fontFamily: fonts.body,
                      fontSize: '0.76rem',
                      color: isActive ? '#0B3D91' : '#64748B',
                      textAlign: 'center',
                      lineHeight: 1.4,
                      mt: 0.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {description}
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>

        {displayService && (
          <Box
            ref={detailRef}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: 3, md: 5 },
              alignItems: 'center',
              mb: brandAfterIcons ? 5 : 0,
            }}
          >
            <Box
              component="img"
              src={displayService.image}
              alt={displayService.title}
              loading="lazy"
              width={480}
              height={360}
              sx={{
                width: '100%',
                height: { xs: 240, sm: 300, md: 360 },
                objectFit: 'cover',
                borderRadius: '20px',
                display: 'block',
                boxShadow: '0 12px 40px rgba(10,37,64,0.12)',
              }}
            />

            <Box>
              {popularServices.length > 1 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {popularServices.map((service) => {
                    const isActive = displayService.id === service.id;
                    return (
                      <Chip
                        key={service.id}
                        label={service.title}
                        onClick={() => onSelectService(service.id)}
                        sx={{
                          fontFamily: fonts.body,
                          fontWeight: isActive ? 700 : 500,
                          fontSize: '0.8rem',
                          height: 32,
                          backgroundColor: isActive ? '#1A73E8' : '#F0F6FF',
                          color: isActive ? '#FFFFFF' : '#0B3D91',
                          border: `1px solid ${isActive ? '#1A73E8' : '#C8D8F8'}`,
                          '&:hover': { backgroundColor: isActive ? '#0B3D91' : '#E8F1FF' },
                        }}
                      />
                    );
                  })}
                </Box>
              )}

              <Typography
                sx={{
                  fontFamily: fonts.heading,
                  fontWeight: 800,
                  fontSize: { xs: '1.35rem', md: '1.55rem' },
                  color: '#0B3D91',
                  mb: 1.5,
                  lineHeight: 1.25,
                }}
              >
                {displayService.title}
              </Typography>

              <Typography
                sx={{
                  fontFamily: fonts.body,
                  color: '#64748B',
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                  mb: 2.5,
                }}
              >
                {displayService.detailDescription ?? displayService.description}
              </Typography>

              <Box sx={{ mb: 2.5 }}>
                {buildDetailBullets(displayService).map((item) => (
                  <Box key={item.title} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, mb: 1.5 }}>
                    <CheckCircleOutlineIcon sx={{ color: '#1A73E8', fontSize: 20, mt: 0.15, flexShrink: 0 }} />
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: fonts.body,
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          color: '#1A1A1A',
                          lineHeight: 1.4,
                        }}
                      >
                        {item.title}
                      </Typography>
                      {item.desc && (
                        <Typography
                          sx={{
                            fontFamily: fonts.body,
                            fontSize: '0.85rem',
                            color: '#64748B',
                            lineHeight: 1.55,
                            mt: 0.25,
                          }}
                        >
                          {item.desc}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>

              {displayService.safetyNotice && (
                <Box
                  sx={{
                    mb: 2.5,
                    p: 2,
                    borderRadius: '12px',
                    border: '1px solid #FECACA',
                    backgroundColor: '#FEF2F2',
                  }}
                >
                  <Typography
                    sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '0.875rem', color: '#991B1B', mb: 0.75 }}
                  >
                    Safety notice
                  </Typography>
                  <Typography sx={{ fontFamily: fonts.body, fontSize: '0.875rem', color: '#64748B', lineHeight: 1.65 }}>
                    {displayService.safetyNotice}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => handleSchedule(displayService)}
                  sx={{
                    backgroundColor: '#1A73E8',
                    color: '#FFFFFF',
                    fontFamily: fonts.body,
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: '12px',
                    px: 3.5,
                    py: 1.25,
                    '&:hover': { backgroundColor: '#0B3D91' },
                  }}
                >
                  Schedule Service
                </Button>
                {detailPanelVariant === 'electrical' && (
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/emergency-service')}
                    sx={{
                      borderColor: '#1A73E8',
                      color: '#1A73E8',
                      fontFamily: fonts.body,
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: '12px',
                      px: 3,
                      py: 1.25,
                    }}
                  >
                    Emergency Service
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        )}

        {brandAfterIcons && (
          <CategoryBrandSection config={brandAfterIcons} embedded />
        )}
      </Box>
    </Box>
  );
};

export default ServiceCategoryBookingSection;
