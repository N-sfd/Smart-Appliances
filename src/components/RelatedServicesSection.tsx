import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { colors, fonts } from '../theme';
import { serviceNavItems } from '../data/serviceNavItems';

const SLUG_TO_NAV_ID: Record<string, string> = {
  'home-appliances': 'home-appliances',
  hvac: 'hvac-services',
  plumbing: 'plumbing-services',
  electrical: 'electrical-services',
  'smart-home': 'smart-home-setup',
  'garage-door-repair': 'garage-door-repair',
  'tv-mounting': 'tv-mounting',
  'phone-repair': 'phone-repair',
  handyman: 'handyman',
};

interface RelatedServicesSectionProps {
  currentSlug: string;
  maxItems?: number;
}

/**
 * Compact related-services strip for category pages — keeps navigation consistent
 * without duplicating booking CTAs.
 */
const RelatedServicesSection: React.FC<RelatedServicesSectionProps> = ({
  currentSlug,
  maxItems = 4,
}) => {
  const currentNavId = SLUG_TO_NAV_ID[currentSlug] ?? currentSlug;
  const related = serviceNavItems
    .filter((item) => item.id !== currentNavId && item.id !== 'emergency-service')
    .slice(0, maxItems);

  if (related.length === 0) return null;

  return (
    <Box
      component="section"
      aria-labelledby="related-services-heading"
      sx={{
        py: { xs: 5, md: 6.5 },
        backgroundColor: colors.sectionBg,
        borderTop: '1px solid #EEF0F3',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          id="related-services-heading"
          component="h2"
          sx={{
            fontFamily: fonts.heading,
            fontWeight: 800,
            fontSize: { xs: '1.35rem', md: '1.65rem' },
            color: colors.navy,
            textAlign: 'center',
            mb: 1,
          }}
        >
          Related Services
        </Typography>
        <Typography
          sx={{
            fontFamily: fonts.body,
            fontSize: '0.92rem',
            color: colors.mutedText,
            textAlign: 'center',
            mb: { xs: 3, md: 3.5 },
            maxWidth: 520,
            mx: 'auto',
          }}
        >
          Explore other home services customers often book with us.
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: `repeat(${Math.min(related.length, 4)}, 1fr)` },
            gap: 2,
          }}
        >
          {related.map((item) => {
            const Icon = item.icon;
            return (
              <Box
                key={item.id}
                component={RouterLink}
                to={item.path}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  p: 2.25,
                  height: '100%',
                  textDecoration: 'none',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E4E7EB',
                  borderRadius: '16px',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
                  '&:hover': {
                    borderColor: '#BFDBFE',
                    boxShadow: '0 8px 24px rgba(11, 61, 145, 0.08)',
                    transform: 'translateY(-2px)',
                  },
                  '&:focus-visible': {
                    outline: `2px solid ${colors.primaryBlue}`,
                    outlineOffset: 2,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '12px',
                      backgroundColor: colors.lightBlueBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon sx={{ fontSize: 22, color: colors.primaryBlue }} />
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: fonts.heading,
                      fontWeight: 700,
                      fontSize: '0.98rem',
                      color: colors.navy,
                      lineHeight: 1.3,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontFamily: fonts.body,
                    fontSize: '0.84rem',
                    color: colors.mutedText,
                    lineHeight: 1.5,
                    flexGrow: 1,
                  }}
                >
                  {item.description}
                </Typography>
                <Button
                  component="span"
                  endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    alignSelf: 'flex-start',
                    px: 0,
                    minWidth: 0,
                    fontFamily: fonts.body,
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    textTransform: 'none',
                    color: colors.primaryBlue,
                    '&:hover': { backgroundColor: 'transparent' },
                  }}
                >
                  View Service
                </Button>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export default RelatedServicesSection;
