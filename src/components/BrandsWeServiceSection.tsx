import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Chip, Button } from '@mui/material';
import { colors, fonts } from '../theme';
import { BRANDS_WE_SERVICE } from '../data/homePageData';

interface BrandsWeServiceSectionProps {
  backgroundColor?: string;
}

/** Reusable "Brands We Service" block for individual service landing pages. */
const BrandsWeServiceSection: React.FC<BrandsWeServiceSectionProps> = ({ backgroundColor = colors.sectionBg }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '1.45rem', md: '1.75rem' },
              color: colors.navy,
              mb: 1.5,
            }}
          >
            Brands We Service
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.body,
              fontSize: '0.95rem',
              color: colors.mutedText,
              maxWidth: 560,
              mx: 'auto',
              lineHeight: 1.7,
            }}
          >
            We service many major appliance and home-system brands. If you do not see your brand
            listed, contact us and we will confirm availability.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.25, mb: 4 }}>
          {BRANDS_WE_SERVICE.map((brand) => (
            <Chip
              key={brand}
              label={brand}
              sx={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E4E7EB',
                color: colors.navy,
                fontFamily: fonts.body,
                fontWeight: 700,
                fontSize: '0.85rem',
                px: 1.5,
                py: 2.5,
                boxShadow: '0 2px 10px rgba(10, 37, 64, 0.04)',
                transition: 'box-shadow 0.22s ease, transform 0.22s ease',
                '&:hover': {
                  boxShadow: '0 10px 28px rgba(11,94,215,0.10)',
                  transform: 'translateY(-2px)',
                },
              }}
            />
          ))}
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            onClick={() => navigate('/scheduler')}
            variant="contained"
            sx={{
              backgroundColor: colors.primaryBlue,
              color: '#fff',
              fontFamily: fonts.body,
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '12px',
              px: 4,
              py: 1.25,
              '&:hover': { backgroundColor: colors.navy },
            }}
          >
            Book a Service
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default BrandsWeServiceSection;
