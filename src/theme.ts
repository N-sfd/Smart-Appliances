import { createTheme } from '@mui/material/styles';

// ─────────────────────────────────────────────
// Cobalt/Navy design tokens
// ─────────────────────────────────────────────
export const tokens = {
  primary: {
    50: '#E8F1FF',
    100: '#D0E3FF',
    300: '#5EA3F5',
    500: '#1A73E8',
    700: '#0B3D91',
  },
  accent: {
    100: '#DFF6FF',
    300: '#7FD9FF',
    500: '#4FC3F7',
  },
  neutral: {
    50: '#FFFFFF',
    100: '#F5F7FA',
    200: '#E4E7EB',
    400: '#9AA5B1',
    700: '#1A1A1A',
  },
  success: { 500: '#22C55E' },
  warning: { 500: '#F59E0B' },
  error: { 500: '#EF4444' },
} as const;

/** Backward-compatible flat color map used across components */
export const colors = {
  navy: tokens.primary[700],
  darkText: tokens.neutral[700],
  primaryBlue: tokens.primary[500],
  primaryBlueHover: tokens.primary[700],
  skyBlue: tokens.accent[500],
  brightBlue: tokens.accent[300],
  serviceBlue: tokens.primary[500],
  lightBlueBg: tokens.primary[50],
  veryLightBg: tokens.neutral[100],
  background: tokens.neutral[100],
  surface: tokens.neutral[50],
  border: tokens.neutral[200],
  mutedText: tokens.neutral[400],
  sectionBg: '#F7F9FC',
  emergency: tokens.error[500],
  emergencyHover: '#DC2626',
  emergencyLight: '#FEF2F2',
  warningOrange: tokens.warning[500],
  success: tokens.success[500],
  white: tokens.neutral[50],
  cardShadow: '0 18px 40px rgba(10, 37, 64, 0.12)',
  brandGradient: 'linear-gradient(135deg, #0B3D91 0%, #1A73E8 40%, #4FC3F7 100%)',
};

export const fonts = {
  heading: "'Inter', 'Plus Jakarta Sans', Arial, sans-serif",
  body: "'Inter', 'DM Sans', Arial, sans-serif",
};

export const radii = {
  xl: '0.875rem',
  '2xl': '1rem',
};

// ─────────────────────────────────────────────
// Reusable button styles (MUI sx tokens)
// ─────────────────────────────────────────────
export const primaryButtonSx = {
  background: colors.primaryBlue,
  color: colors.white,
  fontFamily: fonts.heading,
  fontWeight: 600,
  fontSize: '0.95rem',
  textTransform: 'none' as const,
  borderRadius: radii.xl,
  boxShadow: '0 12px 30px rgba(10, 37, 64, 0.18)',
  transition: 'transform 150ms ease, box-shadow 150ms ease, background 150ms ease',
  '&:hover': {
    background: colors.primaryBlueHover,
    transform: 'translateY(-1px)',
    boxShadow: '0 18px 40px rgba(10, 37, 64, 0.22)',
  },
  '&.Mui-disabled': { background: tokens.neutral[200], color: tokens.neutral[400], boxShadow: 'none' },
};

export const secondaryButtonSx = {
  background: colors.white,
  color: colors.primaryBlue,
  fontFamily: fonts.heading,
  fontWeight: 600,
  fontSize: '0.95rem',
  textTransform: 'none' as const,
  border: `1px solid ${colors.primaryBlue}`,
  borderRadius: radii.xl,
  boxShadow: 'none',
  transition: 'background 150ms ease, color 150ms ease',
  '&:hover': { background: colors.lightBlueBg },
};

export const emergencyButtonSx = {
  background: colors.white,
  color: colors.emergency,
  fontFamily: fonts.heading,
  fontWeight: 600,
  fontSize: '0.95rem',
  textTransform: 'none' as const,
  border: `1px solid ${colors.emergency}`,
  borderRadius: radii.xl,
  boxShadow: 'none',
  transition: 'background 150ms ease, transform 150ms ease',
  '&:hover': {
    background: colors.emergencyLight,
    transform: 'translateY(-1px)',
  },
};

/** Equal-size hero/header CTA pair — Book Service + Emergency Service */
export const heroCtaButtonSx = {
  width: { xs: '100%', sm: '180px' },
  height: '56px',
  minHeight: '56px',
  maxHeight: '56px',
  borderRadius: '16px',
  fontFamily: fonts.heading,
  fontWeight: 600,
  fontSize: '0.95rem',
  lineHeight: 1,
  textTransform: 'none' as const,
  padding: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

export const heroCtaInnerSx = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  whiteSpace: 'nowrap',
};

export const cardSx = {
  backgroundColor: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: radii['2xl'],
  boxShadow: colors.cardShadow,
};

export const badgeSx = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.75,
  backgroundColor: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: radii.xl,
  px: 1.5,
  py: 0.75,
  fontFamily: fonts.body,
  fontSize: '0.82rem',
  fontWeight: 500,
  color: colors.darkText,
};

export const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: radii.xl,
    fontFamily: fonts.body,
    height: 52,
    '& fieldset': { borderColor: colors.border },
    '&:hover fieldset': { borderColor: colors.primaryBlue },
    '&.Mui-focused': {
      boxShadow: `0 0 0 4px ${colors.lightBlueBg}`,
      '& fieldset': { borderColor: colors.primaryBlue },
    },
  },
};

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.primaryBlue,
      light: tokens.primary[300],
      dark: colors.primaryBlueHover,
      contrastText: colors.white,
    },
    secondary: {
      main: tokens.accent[500],
      light: tokens.accent[300],
      dark: tokens.primary[700],
    },
    error: {
      main: colors.emergency,
      dark: colors.emergencyHover,
      light: colors.emergencyLight,
    },
    success: { main: colors.success },
    warning: { main: colors.warningOrange },
    background: {
      default: colors.background,
      paper: colors.surface,
    },
    text: {
      primary: colors.darkText,
      secondary: colors.mutedText,
    },
    divider: colors.border,
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: fonts.body,
    h1: { fontFamily: fonts.heading, fontWeight: 700, fontSize: '42px', lineHeight: 1.2 },
    h2: { fontFamily: fonts.heading, fontWeight: 600, fontSize: '30px', lineHeight: 1.3 },
    h3: { fontFamily: fonts.heading, fontWeight: 700 },
    h4: { fontFamily: fonts.heading, fontWeight: 700 },
    h5: { fontFamily: fonts.heading, fontWeight: 700 },
    h6: { fontFamily: fonts.heading, fontWeight: 700 },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          '&.MuiContainer-maxWidthLg': {
            maxWidth: '1440px',
            paddingLeft: '24px',
            paddingRight: '24px',
            '@media (min-width: 900px)': { paddingLeft: '48px', paddingRight: '48px' },
            '@media (min-width: 1200px)': { paddingLeft: '80px', paddingRight: '80px' },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.white,
          color: colors.navy,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.15s ease',
          fontFamily: fonts.body,
          fontWeight: 600,
          letterSpacing: 0,
          textTransform: 'none',
        },
        containedPrimary: {
          backgroundColor: colors.primaryBlue,
          boxShadow: '0 12px 30px rgba(10, 37, 64, 0.18)',
          '&:hover': {
            backgroundColor: colors.primaryBlueHover,
            boxShadow: '0 18px 40px rgba(10, 37, 64, 0.22)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${colors.border}`,
          boxShadow: colors.cardShadow,
          transition: 'all 0.22s ease',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: inputSx,
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: fonts.body,
          fontWeight: 600,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: { fontFamily: fonts.body },
      },
    },
  },
});
