import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#022F49',
      light: '#22B1FB',
      dark: '#011824',
    },
    secondary: {
      main: '#22B1FB',
      light: '#5DCAFF',
      dark: '#0088CC',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#022F49',
      secondary: '#555555',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'DM Sans, Arial, sans-serif',
    h1: { fontFamily: 'Wasted Vindey, Arial, sans-serif', fontWeight: 700 },
    h2: { fontFamily: 'Wasted Vindey, Arial, sans-serif', fontWeight: 600 },
    h3: { fontFamily: 'Wasted Vindey, Arial, sans-serif', fontWeight: 600 },
    h4: { fontFamily: 'Wasted Vindey, Arial, sans-serif', fontWeight: 600 },
    h5: { fontFamily: 'Wasted Vindey, Arial, sans-serif', fontWeight: 600 },
    h6: { fontFamily: 'Wasted Vindey, Arial, sans-serif', fontWeight: 600 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: '#022F49' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.25s ease',
          fontFamily: 'DM Sans, Arial, sans-serif',
          fontWeight: 600,
          letterSpacing: 0.3,
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #22B1FB 0%, #0088CC 100%)',
          boxShadow: '0 4px 14px rgba(34,177,251,0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5DCAFF 0%, #22B1FB 100%)',
            boxShadow: '0 6px 20px rgba(34,177,251,0.45)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(2,47,73,0.06)',
          transition: 'all 0.25s ease',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          boxShadow: '0 4px 24px rgba(2,47,73,0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            transition: 'box-shadow 0.2s ease',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#22B1FB',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(34,177,251,0.12)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#22B1FB',
              },
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: 'DM Sans, Arial, sans-serif',
          fontWeight: 600,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontFamily: 'DM Sans, Arial, sans-serif',
        },
      },
    },
  },
});
