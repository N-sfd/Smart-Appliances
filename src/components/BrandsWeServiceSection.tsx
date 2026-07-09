import React from 'react';
import { Box } from '@mui/material';
import { colors } from '../theme';
import BrandsWeServiceBlock from './BrandsWeServiceBlock';

interface BrandsWeServiceSectionProps {
  backgroundColor?: string;
}

const BrandsWeServiceSection: React.FC<BrandsWeServiceSectionProps> = ({
  backgroundColor = colors.sectionBg,
}) => (
  <Box
    component="section"
    aria-labelledby="page-brands-heading"
    sx={{ py: { xs: 5, md: 7 }, backgroundColor }}
  >
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 } }}>
      <BrandsWeServiceBlock headingId="page-brands-heading" />
    </Box>
  </Box>
);

export default BrandsWeServiceSection;
