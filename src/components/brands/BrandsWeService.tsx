import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import { colors, fonts } from '../../theme';
import type { BrandCategoryId } from '../../data/service-brands';
import {
  getBrandDisclaimer,
  getBrandsForCategory,
  getBrandsSectionConfig,
  getContactUrlForCategory,
} from '../../data/service-brands';

const ITEM_WIDTH = { xs: 108, sm: 126, md: 140 } as const;
const LOGO_HEIGHT = { xs: 30, md: 36 } as const;

interface BrandsWeServiceProps {
  category: BrandCategoryId;
  /** Override section title */
  title?: string;
  /** Override section description */
  description?: string;
  headingId?: string;
  backgroundColor?: string;
}

const BrandsWeService: React.FC<BrandsWeServiceProps> = ({
  category,
  title,
  description,
  headingId,
  backgroundColor = colors.sectionBg,
}) => {
  const config = getBrandsSectionConfig(category);
  const brands = getBrandsForCategory(category);
  const sectionTitle = title ?? config.title;
  const sectionDescription = description ?? config.description;
  const headingIdResolved = headingId ?? `brands-${category}-heading`;
  // Duplicate the track for a seamless scroll loop; the second copy is
  // decorative and hidden from assistive tech to avoid announcing brands twice.
  const trackItems = [...brands, ...brands];

  return (
    <Box
      component="section"
      aria-labelledby={headingIdResolved}
      sx={{
        py: { xs: 7, md: 8.5 },
        backgroundColor,
        borderTop: '1px solid #EEF0F3',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 960, mx: 'auto', textAlign: 'center', mb: { xs: 3.5, md: 4 } }}>
          <Typography
            id={headingIdResolved}
            component="h2"
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '1.3rem', md: '1.55rem' },
              color: colors.navy,
              mb: 1.25,
            }}
          >
            {sectionTitle}
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.body,
              fontSize: { xs: '0.9rem', md: '0.95rem' },
              color: colors.mutedText,
              lineHeight: 1.65,
              maxWidth: 640,
              mx: 'auto',
            }}
          >
            {sectionDescription}
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            py: 0.5,
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: { xs: 32, md: 72 },
              zIndex: 1,
              pointerEvents: 'none',
            },
            '&::before': {
              left: 0,
              background: `linear-gradient(90deg, ${backgroundColor} 0%, transparent 100%)`,
            },
            '&::after': {
              right: 0,
              background: `linear-gradient(270deg, ${backgroundColor} 0%, transparent 100%)`,
            },
          }}
        >
          <Box
            className="brand-marquee-track"
            role="list"
            aria-label={sectionTitle}
            sx={{ gap: { xs: 2.5, md: 3.5 }, alignItems: 'center' }}
          >
            {trackItems.map((brand, index) => {
              const isDuplicate = index >= brands.length;
              return (
                <Box
                  key={`${brand.id}-${index}`}
                  role={isDuplicate ? undefined : 'listitem'}
                  aria-hidden={isDuplicate || undefined}
                  sx={{
                    flexShrink: 0,
                    width: ITEM_WIDTH,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5,
                  }}
                >
                  {brand.logo ? (
                    <Box
                      component="img"
                      src={brand.logo}
                      alt={brand.alt}
                      width={130}
                      height={40}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      sx={{
                        maxWidth: '100%',
                        maxHeight: LOGO_HEIGHT,
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain',
                        display: 'block',
                        userSelect: 'none',
                        filter: 'none',
                        opacity: 1,
                      }}
                    />
                  ) : (
                    <Typography
                      sx={{
                        fontFamily: fonts.heading,
                        fontWeight: 700,
                        fontSize: { xs: '0.8rem', md: '0.9rem' },
                        color: colors.navy,
                        textAlign: 'center',
                        lineHeight: 1.25,
                      }}
                    >
                      {brand.name}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center', mt: { xs: 4, md: 4.5 } }}>
          <Typography
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 700,
              fontSize: '1rem',
              color: colors.navy,
              mb: 0.75,
            }}
          >
            Don&apos;t see your brand?
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.body,
              fontSize: '0.875rem',
              color: colors.mutedText,
              lineHeight: 1.6,
              maxWidth: 480,
              mx: 'auto',
              mb: 2,
            }}
          >
            Contact us with the brand and model number, and we&apos;ll confirm service availability.
          </Typography>
          <Button
            component={RouterLink}
            to={getContactUrlForCategory(config.contactServiceId)}
            variant="outlined"
            sx={{
              borderColor: colors.primaryBlue,
              color: colors.primaryBlue,
              fontFamily: fonts.body,
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '12px',
              px: 3,
              '&:hover': {
                borderColor: colors.navy,
                color: colors.navy,
                backgroundColor: colors.lightBlueBg,
              },
              '&:focus-visible': {
                outline: `2px solid ${colors.primaryBlue}`,
                outlineOffset: 2,
              },
            }}
          >
            Check My Brand
          </Button>
        </Box>

        <Typography
          sx={{
            fontFamily: fonts.body,
            fontSize: '0.72rem',
            color: '#94A3B8',
            textAlign: 'center',
            lineHeight: 1.55,
            maxWidth: 720,
            mx: 'auto',
            mt: { xs: 3.5, md: 4 },
          }}
        >
          {getBrandDisclaimer()}
        </Typography>
      </Container>
    </Box>
  );
};

export default BrandsWeService;
