import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Chip } from '@mui/material';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import HeroIllustration, { HeroIllustrationVariant } from '../illustrations/HeroIllustration';
import { colors, fonts, primaryButtonSx, secondaryButtonSx } from '../../theme';

export interface PageHeroAction {
  label: string;
  href?: string;
  onClick?: () => void;
  startIcon?: React.ReactNode;
}

export interface PageHeroBadge {
  label: string;
  icon?: React.ReactNode;
}

export interface PageHeroInfoCard {
  title: string;
  children: React.ReactNode;
}

export interface PageHeroProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  variant?: 'dark' | 'light';
  primaryAction?: PageHeroAction;
  secondaryAction?: PageHeroAction;
  tertiaryAction?: PageHeroAction;
  badges?: PageHeroBadge[];
  imageSrc?: string;
  imageAlt?: string;
  imageAspectRatio?: '4 / 3' | '1 / 1' | '16 / 9';
  imageObjectPosition?: string;
  /** Show hero photo above custom visual content (e.g. experts team photo + recommended card). */
  stackImageWithVisual?: boolean;
  illustration?: HeroIllustrationVariant;
  visual?: React.ReactNode;
  infoCard?: PageHeroInfoCard;
  showIllustrationOnMobile?: boolean;
  belowSubtitle?: React.ReactNode;
}

function HeroActionButton({
  action,
  variant,
  isPrimary,
}: {
  action: PageHeroAction;
  variant: 'dark' | 'light';
  isPrimary: boolean;
}) {
  const isDark = variant === 'dark';

  const primarySx = {
    ...primaryButtonSx,
    px: 3.5,
    py: 1.25,
    fontSize: '0.95rem',
    minHeight: 44,
  };

  const secondarySx = isDark
    ? {
        ...secondaryButtonSx,
        background: 'transparent',
        borderColor: 'rgba(255,255,255,0.5)',
        color: colors.white,
        px: 3.5,
        py: 1.25,
        fontSize: '0.95rem',
        minHeight: 44,
        '&:hover': { background: 'rgba(255,255,255,0.08)', borderColor: colors.white },
      }
    : {
        ...secondaryButtonSx,
        px: 3.5,
        py: 1.25,
        fontSize: '0.95rem',
        minHeight: 44,
      };

  const sx = isPrimary ? primarySx : secondarySx;

  if (action.href) {
    return (
      <Button
        variant={isPrimary ? 'contained' : 'outlined'}
        component={RouterLink}
        to={action.href}
        startIcon={action.startIcon}
        sx={sx}
      >
        {action.label}
      </Button>
    );
  }

  return (
    <Button
      variant={isPrimary ? 'contained' : 'outlined'}
      onClick={action.onClick}
      startIcon={action.startIcon}
      sx={sx}
    >
      {action.label}
    </Button>
  );
}

function HeroPhoto({
  src,
  alt,
  aspectRatio,
  objectPosition = 'center 22%',
  compact,
}: {
  src: string;
  alt: string;
  aspectRatio: '4 / 3' | '1 / 1' | '16 / 9';
  objectPosition?: string;
  compact?: boolean;
}) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <Box
        role="img"
        aria-label={alt}
        sx={{
          width: '100%',
          maxWidth: 460,
          aspectRatio: compact ? undefined : aspectRatio,
          maxHeight: compact ? 168 : undefined,
          height: compact ? 168 : undefined,
          borderRadius: '18px',
          backgroundColor: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
        }}
      >
        <HomeRepairServiceIcon sx={{ fontSize: 56, color: 'rgba(255,255,255,0.35)' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 460,
        aspectRatio: compact ? undefined : aspectRatio,
        maxHeight: compact ? 168 : undefined,
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: '0 20px 48px rgba(0,0,0,0.24)',
        mx: 'auto',
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        loading="eager"
        decoding="async"
        fetchPriority="high"
        onError={() => setErrored(true)}
        sx={{
          width: '100%',
          height: compact ? 168 : '100%',
          objectFit: 'cover',
          objectPosition,
          display: 'block',
        }}
      />
    </Box>
  );
}

export default function PageHero({
  title,
  subtitle,
  eyebrow,
  variant = 'dark',
  primaryAction,
  secondaryAction,
  tertiaryAction,
  badges,
  imageSrc,
  imageAlt,
  imageAspectRatio = '4 / 3',
  imageObjectPosition,
  stackImageWithVisual = false,
  illustration,
  visual,
  infoCard,
  showIllustrationOnMobile = false,
  belowSubtitle,
}: PageHeroProps) {
  const isDark = variant === 'dark';
  const hasVisualColumn = Boolean(imageSrc || illustration || visual || infoCard);

  return (
    <Box
      component="section"
      aria-label={title}
      sx={{
        background: isDark
          ? 'linear-gradient(135deg, #071B41 0%, #0B2D6B 55%, #0D3A82 100%)'
          : colors.sectionBg,
        py: { xs: 4.5, sm: 6, md: 7 },
        px: { xs: 2, sm: 3 },
        minHeight: { md: 480 },
      }}
    >
      <Box
        sx={{
          width: 'min(1200px, calc(100% - 48px))',
          maxWidth: 1200,
          mx: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: hasVisualColumn ? { xs: '1fr', md: 'minmax(0, 1fr) minmax(320px, 0.9fr)' } : '1fr',
            alignItems: 'center',
            gap: { xs: 3.5, md: 6 },
          }}
        >
          {/* Copy column */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            {eyebrow ? (
              <Typography
                component="p"
                sx={{
                  color: isDark ? colors.skyBlue : colors.primaryBlue,
                  fontFamily: fonts.body,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  mb: 1.25,
                }}
              >
                {eyebrow}
              </Typography>
            ) : null}

            <Typography
              component="h1"
              sx={{
                fontFamily: fonts.heading,
                fontWeight: 800,
                fontSize: { xs: '2.15rem', sm: '2.5rem', md: '3rem' },
                lineHeight: 1.1,
                color: isDark ? colors.white : colors.navy,
                mb: 1.25,
              }}
            >
              {title}
            </Typography>

            {subtitle ? (
              <Typography
                sx={{
                  fontFamily: fonts.body,
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  lineHeight: 1.65,
                  color: isDark ? 'rgba(255,255,255,0.82)' : colors.mutedText,
                  maxWidth: 620,
                  mx: { xs: 'auto', md: 0 },
                  mb: belowSubtitle || badges?.length || primaryAction ? 2 : 0,
                }}
              >
                {subtitle}
              </Typography>
            ) : null}

            {belowSubtitle ? (
              <Box sx={{ mb: badges?.length || primaryAction ? 2.5 : 0 }}>{belowSubtitle}</Box>
            ) : null}

            {badges && badges.length > 0 ? (
              <Box
                component="ul"
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  mb: 2.5,
                  p: 0,
                  m: 0,
                  listStyle: 'none',
                }}
              >
                {badges.map(({ label, icon }) => (
                  <Box component="li" key={label} sx={{ display: 'inline-flex' }}>
                    <Chip
                      icon={icon ? <Box component="span" sx={{ display: 'flex', pl: 0.5 }}>{icon}</Box> : undefined}
                      label={label}
                      sx={{
                        backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : colors.lightBlueBg,
                        color: isDark ? colors.white : colors.navy,
                        fontFamily: fonts.body,
                        fontWeight: 600,
                        fontSize: '12.5px',
                        border: isDark ? '1px solid rgba(255,255,255,0.2)' : `1px solid ${colors.border}`,
                        '& .MuiChip-icon': { color: isDark ? '#fff !important' : `${colors.primaryBlue} !important` },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            ) : null}

            {(primaryAction || secondaryAction || tertiaryAction) && (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1.5,
                  justifyContent: { xs: 'center', md: 'flex-start' },
                }}
              >
                {primaryAction ? <HeroActionButton action={primaryAction} variant={variant} isPrimary /> : null}
                {secondaryAction ? <HeroActionButton action={secondaryAction} variant={variant} isPrimary={false} /> : null}
                {tertiaryAction ? <HeroActionButton action={tertiaryAction} variant={variant} isPrimary={false} /> : null}
              </Box>
            )}
          </Box>

          {/* Visual column */}
          {hasVisualColumn ? (
            <Box sx={{ width: '100%', maxWidth: { xs: 420, md: 460 }, mx: { xs: 'auto', md: 0 } }}>
              {illustration ? (
                <Box
                  sx={{
                    mb: infoCard ? 2 : 0,
                    borderRadius: '18px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 48px rgba(0,0,0,0.24)',
                    display: showIllustrationOnMobile ? 'block' : { xs: 'none', sm: 'block' },
                    maxWidth: 460,
                    width: '100%',
                    aspectRatio: '4 / 3',
                    mx: 'auto',
                  }}
                >
                  <HeroIllustration variant={illustration} title={imageAlt ?? title} />
                </Box>
              ) : null}

              {imageSrc && imageAlt && (stackImageWithVisual || !visual) ? (
                <Box
                  sx={{
                    mb: visual || infoCard ? 2 : 0,
                    display: stackImageWithVisual ? { xs: 'none', sm: 'block' } : 'block',
                  }}
                >
                  <HeroPhoto
                    src={imageSrc}
                    alt={imageAlt}
                    aspectRatio={imageAspectRatio}
                    objectPosition={imageObjectPosition}
                    compact={stackImageWithVisual}
                  />
                </Box>
              ) : null}

              {visual}

              {infoCard ? (
                <Box
                  sx={{
                    backgroundColor: colors.white,
                    borderRadius: '18px',
                    p: { xs: 2.5, md: 3 },
                    boxShadow: '0 20px 48px rgba(0,0,0,0.24)',
                  }}
                >
                  <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '1.1rem', color: colors.navy, mb: 2 }}>
                    {infoCard.title}
                  </Typography>
                  {infoCard.children}
                </Box>
              ) : null}
            </Box>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}
