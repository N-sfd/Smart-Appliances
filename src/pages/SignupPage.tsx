import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, Container, TextField, Button, CircularProgress, Alert,
  InputAdornment, IconButton,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../contexts/AuthContext';
import { colors, fonts } from '../theme';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const passwordValid = password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!passwordValid) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    const { error: err } = await signUp(email.trim(), password, fullName.trim());
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    setSuccess(true);
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': { borderRadius: '14px', fontFamily: fonts.body },
  };

  if (success) {
    return (
      <Box
        sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', backgroundColor: colors.background, py: 6, px: 2 }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{ backgroundColor: '#fff', borderRadius: '20px', p: { xs: 3, md: 5 }, boxShadow: colors.cardShadow, border: `1px solid ${colors.border}`, textAlign: 'center' }}
          >
            <Typography variant="h4" sx={{ fontFamily: fonts.heading, color: colors.navy, fontWeight: 800, mb: 1 }}>
              Check your email
            </Typography>
            <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, mb: 3, lineHeight: 1.7 }}>
              We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then sign in.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{ backgroundColor: colors.primaryBlue, color: '#fff', fontFamily: fonts.body, fontWeight: 700, textTransform: 'none', borderRadius: '12px', px: 4, py: 1.4, '&:hover': { backgroundColor: colors.navy } }}
            >
              Go to Sign in
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', backgroundColor: colors.background, py: 6, px: 2 }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{ backgroundColor: '#fff', borderRadius: '20px', p: { xs: 3, md: 5 }, boxShadow: colors.cardShadow, border: `1px solid ${colors.border}` }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontFamily: fonts.heading, color: colors.navy, fontWeight: 800, mb: 0.5 }}>
              Create your account
            </Typography>
            <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '0.95rem' }}>
              Track your bookings and get faster service next time.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: '10px', fontFamily: fonts.body }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              fullWidth
              autoFocus
              autoComplete="name"
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ fontSize: 20, color: colors.mutedText }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoComplete="email"
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
              label="Password (min. 8 characters)"
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="new-password"
              error={password.length > 0 && !passwordValid}
              helperText={password.length > 0 && !passwordValid ? 'Password must be at least 8 characters.' : ''}
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ fontSize: 20, color: colors.mutedText }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPw((v) => !v)} edge="end" size="small" aria-label={showPw ? 'Hide password' : 'Show password'}>
                      {showPw ? <VisibilityOffIcon sx={{ fontSize: 20 }} /> : <VisibilityIcon sx={{ fontSize: 20 }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || !fullName || !email || !password}
              sx={{
                backgroundColor: colors.primaryBlue, color: '#fff', fontFamily: fonts.body, fontWeight: 700,
                textTransform: 'none', borderRadius: '12px', py: 1.5, mt: 0.5, fontSize: '1rem',
                '&:hover': { backgroundColor: colors.navy },
                '&.Mui-disabled': { backgroundColor: '#CBD5E1', color: '#fff' },
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Create account'}
            </Button>
          </Box>

          <Typography sx={{ fontFamily: fonts.body, textAlign: 'center', mt: 3, fontSize: '0.9rem', color: colors.mutedText }}>
            Already have an account?{' '}
            <RouterLink to="/login" style={{ color: colors.primaryBlue, fontWeight: 700, textDecoration: 'none' }}>
              Sign in
            </RouterLink>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default SignupPage;
