import React, { useState } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box, Typography, Container, TextField, Button, CircularProgress, Alert, InputAdornment, IconButton,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../contexts/AuthContext';
import { colors, fonts } from '../theme';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = (location.state as { from?: string } | null)?.from ?? '/my-bookings';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signIn(email.trim(), password);
    setLoading(false);
    if (err) {
      setError('Invalid email or password. Please try again.');
      return;
    }
    navigate(from, { replace: true });
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '14px',
      fontFamily: fonts.body,
    },
  };

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: colors.background,
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            backgroundColor: '#fff',
            borderRadius: '20px',
            p: { xs: 3, md: 5 },
            boxShadow: colors.cardShadow,
            border: `1px solid ${colors.border}`,
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h4"
              sx={{ fontFamily: fonts.heading, color: colors.navy, fontWeight: 800, mb: 0.5 }}
            >
              Welcome back
            </Typography>
            <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '0.95rem' }}>
              Sign in to view your bookings and service history.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: '10px', fontFamily: fonts.body }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoComplete="email"
              autoFocus
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ fontSize: 20, color: colors.mutedText }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="current-password"
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ fontSize: 20, color: colors.mutedText }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPw((v) => !v)}
                      edge="end"
                      size="small"
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                    >
                      {showPw ? (
                        <VisibilityOffIcon sx={{ fontSize: 20 }} />
                      ) : (
                        <VisibilityIcon sx={{ fontSize: 20 }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || !email || !password}
              sx={{
                backgroundColor: colors.primaryBlue,
                color: '#fff',
                fontFamily: fonts.body,
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: '12px',
                py: 1.5,
                mt: 0.5,
                fontSize: '1rem',
                '&:hover': { backgroundColor: colors.navy },
                '&.Mui-disabled': { backgroundColor: '#CBD5E1', color: '#fff' },
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Sign in'}
            </Button>
          </Box>

          <Typography
            sx={{
              fontFamily: fonts.body,
              textAlign: 'center',
              mt: 3,
              fontSize: '0.9rem',
              color: colors.mutedText,
            }}
          >
            Don't have an account?{' '}
            <RouterLink
              to="/signup"
              style={{ color: colors.primaryBlue, fontWeight: 700, textDecoration: 'none' }}
            >
              Create one free
            </RouterLink>
          </Typography>

          <Typography
            sx={{
              fontFamily: fonts.body,
              textAlign: 'center',
              mt: 1.5,
              fontSize: '0.875rem',
              color: colors.mutedText,
            }}
          >
            <RouterLink
              to="/scheduler"
              style={{ color: colors.mutedText, textDecoration: 'underline' }}
            >
              Continue as guest instead
            </RouterLink>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
