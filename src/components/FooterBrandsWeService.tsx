import React from 'react';
import { Box } from '@mui/material';
import { colors } from '../theme';
import BrandsWeServiceBlock from './BrandsWeServiceBlock';

/**
 * Compact brand-logo strip displayed directly above the site footer.
 */
const FooterBrandsWeService: React.FC = () => (
  <Box
    component="section"
    aria-labelledby="footer-brands-heading"
    sx={{
      backgroundColor: '#F6F9FC',
      borderTop: `1px solid ${colors.border}`,
      py: { xs: 5, md: 7 },
    }}
  >
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 } }}>
      <BrandsWeServiceBlock headingId="footer-brands-heading" />
    </Box>
  </Box>
);

export default FooterBrandsWeService;
