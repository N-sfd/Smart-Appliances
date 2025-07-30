import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#022F49',
      light: '#22B1FB',
      dark: '#000000',
    },
    secondary: {
      main: '#D9D9D9',
      light: '#FFFFFF',
      dark: '#000000',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#022F49',
    },
  },
  typography: {
    fontFamily: 'DM Sans, Arial, sans-serif',
    h1: {
      fontFamily: 'Wasted Vindey, Arial, sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'Wasted Vindey, Arial, sans-serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: 'Wasted Vindey, Arial, sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: 'Wasted Vindey, Arial, sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: 'Wasted Vindey, Arial, sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: 'Wasted Vindey, Arial, sans-serif',
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#022F49',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '64px',
        },
      },
    },
  },
}); 