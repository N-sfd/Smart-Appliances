import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { primaryButtonSx, secondaryButtonSx, emergencyButtonSx } from '../../theme';

type BtnProps = ButtonProps & { children: React.ReactNode };

export const ButtonPrimary: React.FC<BtnProps> = ({ children, sx, ...props }) => (
  <Button sx={{ ...primaryButtonSx, ...sx }} {...props}>
    {children}
  </Button>
);

export const ButtonSecondary: React.FC<BtnProps> = ({ children, sx, ...props }) => (
  <Button sx={{ ...secondaryButtonSx, ...sx }} {...props}>
    {children}
  </Button>
);

export const ButtonEmergency: React.FC<BtnProps> = ({ children, sx, ...props }) => (
  <Button sx={{ ...emergencyButtonSx, ...sx }} {...props}>
    {children}
  </Button>
);
