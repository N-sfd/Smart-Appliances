import React from 'react';
import { Box, BoxProps } from '@mui/material';
import { cardSx } from '../../theme';

export const Card: React.FC<BoxProps> = ({ children, sx, ...props }) => (
  <Box sx={{ ...cardSx, ...sx }} {...props}>
    {children}
  </Box>
);
