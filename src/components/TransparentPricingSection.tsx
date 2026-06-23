import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import PriceCheckOutlinedIcon from '@mui/icons-material/PriceCheckOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import { colors, fonts } from '../theme';

export const TRANSPARENT_PRICING_ITEMS = [
  {
    label: 'Service Call',
    value: 'From $79–$149',
    note: 'Applied toward eligible work when you move forward.',
    color: '#1A73E8',
    icon: HandymanOutlinedIcon,
  },
  {
    label: 'Typical Service Range',
    value: '$150–$400',
    note: 'Varies by service type, parts, labor, and urgency.',
    color: '#34D399',
    icon: PriceCheckOutlinedIcon,
  },
  {
    label: 'Service Warranty',
    value: '30-Day',
    note: 'Labor warranty included on completed eligible services.',
    color: '#FBBF24',
    icon: VerifiedOutlinedIcon,
  },
] as const;

const TransparentPricingSection: React.FC = () => (
  <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: colors.lightBlueBg }}>
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: { xs: 3.5, md: 4 } }}>
        <Typography
          sx={{
            fontFamily: fonts.heading,
            fontWeight: 800,
            fontSize: { xs: '1.4rem', md: '1.7rem' },
            color: colors.navy,
            mb: 0.5,
          }}
        >
          Transparent Pricing — No Surprises
        </Typography>
        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.9rem', color: '#64748B' }}>
          You&apos;ll always know the cost before any work begins.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: { xs: 2, md: 3 },
          alignItems: 'stretch',
        }}
      >
        {TRANSPARENT_PRICING_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Box
              key={item.label}
              sx={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E4E7EB',
                borderRadius: '18px',
                boxShadow: '0 4px 16px rgba(10,37,64,0.06)',
                p: { xs: 3, md: 3.5 },
                textAlign: 'center',
                height: '100%',
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: `${item.color}1A`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 1.5,
                }}
              >
                <Icon sx={{ fontSize: 22, color: item.color }} />
              </Box>
              <Typography
                sx={{
                  fontFamily: fonts.heading,
                  fontWeight: 800,
                  fontSize: { xs: '1.5rem', md: '1.75rem' },
                  color: colors.navy,
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
                  color: colors.navy,
                  mb: 0.5,
                }}
              >
                {item.label}
              </Typography>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: '#64748B' }}>
                {item.note}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Container>
  </Box>
);

export default TransparentPricingSection;
