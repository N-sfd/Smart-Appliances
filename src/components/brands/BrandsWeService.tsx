import React, { useId, useState } from 'react';
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
import BrandCard from './BrandCard';

interface BrandsWeServiceProps {
  category: BrandCategoryId;
  /** Override section title */
  title?: string;
  /** Override section description */
  description?: string;
  headingId?: string;
  backgroundColor?: string;
  /** Show expand/collapse on service pages (default true) */
  expandable?: boolean;
  /** Max brands before expand (defaults from config) */
  initialVisibleCount?: number;
}

const BrandsWeService: React.FC<BrandsWeServiceProps> = ({
  category,
  title,
  description,
  headingId,
  backgroundColor = colors.sectionBg,
  expandable = true,
  initialVisibleCount,
}) => {
  const config = getBrandsSectionConfig(category);
  const brands = getBrandsForCategory(category);
  const sectionTitle = title ?? config.title;
  const sectionDescription = description ?? config.description;
  const initialCount = initialVisibleCount ?? config.initialVisibleCount ?? 10;
  const [expanded, setExpanded] = useState(false);
  const headingIdResolved = headingId ?? `brands-${category}-heading`;
  const expandButtonId = useId();

  const visibleBrands = expandable && !expanded ? brands.slice(0, initialCount) : brands;
  const hasMore = expandable && brands.length > initialCount;

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
          role="list"
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              sm: 'repeat(4, minmax(0, 1fr))',
              md: 'repeat(6, minmax(0, 1fr))',
            },
            gap: { xs: 1.5, md: 2.25 },
            maxWidth: 1080,
            mx: 'auto',
          }}
        >
          {visibleBrands.map((brand) => (
            <Box key={brand.id} role="listitem">
              <BrandCard brand={brand} />
            </Box>
          ))}
        </Box>

        {hasMore && (
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              id={expandButtonId}
              onClick={() => setExpanded((prev) => !prev)}
              aria-expanded={expanded}
              aria-controls={`${headingIdResolved}-grid`}
              sx={{
                fontFamily: fonts.body,
                fontWeight: 600,
                fontSize: '0.875rem',
                color: colors.primaryBlue,
                textTransform: 'none',
                '&:hover': { backgroundColor: colors.lightBlueBg },
                '&:focus-visible': {
                  outline: `2px solid ${colors.primaryBlue}`,
                  outlineOffset: 2,
                },
              }}
            >
              {expanded ? 'Show fewer brands' : 'View all brands'}
            </Button>
          </Box>
        )}

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
