import React from 'react';
import { Box, BoxProps } from '@mui/material';
import { badgeSx } from '../../theme';

export const Badge: React.FC<BoxProps> = ({ children, sx, ...props }) => (
  <Box sx={{ ...badgeSx, ...sx }} {...props}>
    {children}
  </Box>
);
