import React from 'react';
import { Box, Typography } from '@mui/material';
import { Plug, ToggleLeft, Lightbulb, Fan, Zap, PanelsTopLeft, Wifi, Cable } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import BrandMarquee from './BrandMarquee';
import LogoBrandMarquee from './LogoBrandMarquee';
import { fonts } from '../theme';
import type { CategoryBrandConfig } from '../data/serviceCategoryPages';
import { resolveSmartHomeBrands } from '../data/smartHomeBrands';
import { resolvePlumbingBrands } from '../data/plumbingBrands';
import { resolveElectricalBrands } from '../data/electricalBrands';
import type { LogoBrand } from '../data/logoBrandTypes';

function resolveMarqueeBrands(config: CategoryBrandConfig): LogoBrand[] {
  if (config.logoMarqueeSet === 'plumbing') return resolvePlumbingBrands(config.brands);
  if (config.logoMarqueeSet === 'electrical') return resolveElectricalBrands(config.brands);
  return resolveSmartHomeBrands(config.brands);
}

const ICON_MAP: Record<string, LucideIcon> = {
  Plug, ToggleLeft, Lightbulb, Fan, Zap, PanelsTopLeft, Wifi, Cable,
};

interface CategoryBrandSectionProps {
  config: CategoryBrandConfig;
  /** Render inline inside booking section (after icon grid) */
  embedded?: boolean;
  /** Show only chips, only marquee, or full section */
  sectionMode?: 'full' | 'chips-only' | 'marquee-only';
}

const CategoryBrandSection: React.FC<CategoryBrandSectionProps> = ({
  config,
  embedded = false,
  sectionMode = 'full',
}) => {
  if (config.variant === 'logo-marquee') {
    const brands = resolveMarqueeBrands(config);
    return (
      <Box
        sx={{
          mb: embedded ? 5 : 0,
          py: embedded ? { xs: 4, md: 5 } : { xs: 5, md: 6 },
          backgroundColor: '#F8FAFC',
          borderTop: embedded ? 'none' : '1px solid #EEF0F3',
          borderRadius: embedded ? '16px' : 0,
          mx: embedded ? 0 : undefined,
        }}
      >
        <Box sx={{ maxWidth: 960, mx: 'auto', px: { xs: 1, sm: 2 }, textAlign: 'center' }}>
          <Typography
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '1.2rem', md: '1.45rem' },
              color: '#0B3D91',
              mb: 0.75,
            }}
          >
            {config.title}
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.body,
              fontSize: '0.9rem',
              color: '#64748B',
              mb: 3,
              lineHeight: 1.6,
              px: { xs: 1, md: 0 },
            }}
          >
            {config.subtitle}
          </Typography>
          <LogoBrandMarquee brands={brands} plain />
        </Box>
      </Box>
    );
  }

  if (config.variant === 'marquee') {
    return (
      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          borderTop: embedded ? '1px solid #E4E7EB' : 'none',
          borderRadius: embedded ? '16px' : 0,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, sm: 3 }, pt: { xs: 5, md: 6 }, textAlign: 'center' }}>
          <Typography
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '1.35rem', md: '1.6rem' },
              color: '#0B3D91',
              mb: 1,
            }}
          >
            {config.title}
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.body,
              fontSize: '0.95rem',
              color: '#64748B',
              mb: 0,
              lineHeight: 1.6,
            }}
          >
            {config.subtitle}
          </Typography>
        </Box>
        <BrandMarquee title="" brandNames={config.brands} />
      </Box>
    );
  }

  if (config.variant === 'icon-pills') {
    const compact = config.compactIconPills ?? false;
    const marqueeBrands = config.logoMarqueeSet ? resolveMarqueeBrands(config) : [];
    const showChips = sectionMode !== 'marquee-only';
    const showMarquee =
      sectionMode === 'marquee-only' ||
      (sectionMode === 'full' && config.marqueePlacement !== 'before-how-it-works');
    const headerTitle = sectionMode === 'marquee-only' ? config.marqueeTitle ?? config.title : config.title;
    const headerSubtitle =
      sectionMode === 'marquee-only' ? config.marqueeSubtitle ?? config.subtitle : config.subtitle;

    return (
      <Box
        sx={{
          py: embedded ? { xs: 0, md: 0 } : { xs: 5, md: 6 },
          mb: embedded ? { xs: 4, md: 4.5 } : 0,
          backgroundColor: embedded ? 'transparent' : '#F8FAFC',
          borderTop: embedded ? 'none' : '1px solid #EEF0F3',
        }}
      >
        <Box sx={{ maxWidth: compact ? 820 : 900, mx: 'auto', px: { xs: 2, sm: 3 }, textAlign: 'center' }}>
          <Typography
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '1.5rem', md: '1.85rem' },
              color: embedded && sectionMode !== 'marquee-only' ? '#1A1A1A' : '#0B3D91',
              mb: 1,
            }}
          >
            {headerTitle}
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.body,
              fontSize: '1rem',
              color: '#64748B',
              mb: showChips ? (compact ? 3 : 3.5) : 3,
              lineHeight: 1.6,
              maxWidth: 560,
              mx: 'auto',
            }}
          >
            {headerSubtitle}
          </Typography>
          {showChips && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: compact
                  ? { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(4, minmax(0, 1fr))' }
                  : { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
                gap: compact ? { xs: 1, sm: 1.25 } : 1.5,
                justifyItems: 'stretch',
                mb: showMarquee && marqueeBrands.length > 0 ? 3.5 : 0,
              }}
            >
              {(config.iconChips ?? []).map(({ label, iconName }) => {
                const Icon = ICON_MAP[iconName];
                return (
                  <Box
                    key={label}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: compact ? 0.5 : 0.75,
                      px: compact ? 1.25 : 2.5,
                      py: compact ? 0.625 : 1,
                      borderRadius: '999px',
                      border: '1px solid #DFE3E8',
                      backgroundColor: '#FFFFFF',
                      minWidth: 0,
                    }}
                  >
                    {Icon && <Icon size={compact ? 14 : 18} color="#1A73E8" strokeWidth={2} />}
                    <Typography
                      sx={{
                        fontFamily: fonts.body,
                        fontWeight: 600,
                        fontSize: compact ? '0.72rem' : '0.875rem',
                        color: '#0B3D91',
                        lineHeight: 1.25,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}
          {showMarquee && marqueeBrands.length > 0 && (
            <LogoBrandMarquee brands={marqueeBrands} plain={config.logoMarqueePlain} logoHeight={32} />
          )}
          {config.secondaryBrands && config.secondaryBrands.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mt: 2.5 }}>
              {config.secondaryBrands.map((brand) => (
                <Box
                  key={brand}
                  sx={{
                    px: 2,
                    py: 0.75,
                    borderRadius: '999px',
                    border: '1px solid #E4E7EB',
                    backgroundColor: '#F8FAFC',
                  }}
                >
                  <Typography sx={{ fontFamily: fonts.body, fontWeight: 500, fontSize: '0.8rem', color: '#64748B' }}>
                    {brand}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ py: { xs: 5, md: 6 }, backgroundColor: '#F8FAFC', borderTop: '1px solid #EEF0F3' }}>
      <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, sm: 3 }, textAlign: 'center' }}>
        <Typography
          sx={{
            fontFamily: fonts.heading,
            fontWeight: 800,
            fontSize: { xs: '1.35rem', md: '1.6rem' },
            color: '#0B3D91',
            mb: 1,
          }}
        >
          {config.title}
        </Typography>
        <Typography
          sx={{
            fontFamily: fonts.body,
            fontSize: '0.95rem',
            color: '#64748B',
            mb: 3,
            lineHeight: 1.6,
          }}
        >
          {config.subtitle}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, justifyContent: 'center' }}>
          {config.brands.map((brand) => (
            <Box
              key={brand}
              sx={{
                px: 2.5,
                py: 1,
                borderRadius: '999px',
                border: '1px solid #E4E7EB',
                backgroundColor: '#FFFFFF',
              }}
            >
              <Typography sx={{ fontFamily: fonts.body, fontWeight: 600, fontSize: '0.875rem', color: '#1A1A1A' }}>
                {brand}
              </Typography>
            </Box>
          ))}
        </Box>
        {config.secondaryBrands && config.secondaryBrands.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mt: 2.5 }}>
            {config.secondaryBrands.map((brand) => (
              <Box
                key={brand}
                sx={{
                  px: 2,
                  py: 0.75,
                  borderRadius: '999px',
                  border: '1px solid #E4E7EB',
                  backgroundColor: '#F8FAFC',
                }}
              >
                <Typography sx={{ fontFamily: fonts.body, fontWeight: 500, fontSize: '0.8rem', color: '#64748B' }}>
                  {brand}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CategoryBrandSection;
