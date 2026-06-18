import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { colors, fonts } from '../theme';

export const TRANSPARENT_PRICING_ITEMS = [
  {
    label: 'Diagnostic Fee',
    value: '$75 – $125',
    note: 'Applied toward repair cost if you proceed.',
    color: '#4FC3F7',
  },
  {
    label: 'Typical Repair Range',
    value: '$150 – $400',
    note: 'Varies by appliance type and parts needed.',
    color: '#34D399',
  },
  {
    label: 'Service Warranty',
    value: '30-Day',
    note: 'Labor warranty included on all completed repairs.',
    color: '#FBBF24',
  },
] as const;

const TransparentPricingSection: React.FC = () => (
  <Box sx={{ py: { xs: 5, md: 6 }, backgroundColor: colors.navy }}>
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: { xs: 3.5, md: 4 } }}>
        <Typography
          sx={{
            fontFamily: fonts.heading,
            fontWeight: 800,
            fontSize: { xs: '1.4rem', md: '1.7rem' },
            color: '#fff',
            mb: 0.5,
          }}
        >
          Transparent Pricing — No Surprises
        </Typography>
        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)' }}>
          You&apos;ll always know the cost before any work begins.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: { xs: 2, md: 3 },
        }}
      >
        {TRANSPARENT_PRICING_ITEMS.map((item) => (
          <Box
            key={item.label}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '18px',
              p: { xs: 3, md: 3.5 },
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                fontFamily: fonts.heading,
                fontWeight: 800,
                fontSize: { xs: '1.75rem', md: '2rem' },
                color: item.color,
                lineHeight: 1.1,
                mb: 0.5,
              }}
            >
              {item.value}
            </Typography>
            <Typography
              sx={{
                fontFamily: fonts.body,
                fontWeight: 700,
                fontSize: '0.9rem',
                color: '#fff',
                mb: 0.5,
              }}
            >
              {item.label}
            </Typography>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)' }}>
              {item.note}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  </Box>
);

export default TransparentPricingSection;
