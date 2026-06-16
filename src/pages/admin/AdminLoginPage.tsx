import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Container, TextField, Button, CircularProgress, Alert,
  InputAdornment, IconButton,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { colors, fonts } from '../../theme';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signIn(email.trim(), password);
    if (err) {
      setLoading(false);
      setError('Invalid credentials. Please try again.');
      return;
    }
    // Fetch profile directly to check role — context state updates asynchronously
    if (isSupabaseConfigured() && supabase) {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authUser.id)
          .single();
        if (!profileData || profileData.role !== 'admin') {
          await supabase.auth.signOut();
          setLoading(false);
          setError('Access denied. This account does not have admin privileges.');
          return;
        }
      }
    }
    setLoading(false);
    navigate('/admin/dashboard', { replace: true });
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': { borderRadius: '12px', fontFamily: fonts.body },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        backgroundColor: colors.navy, py: 6, px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 64, height: 64, borderRadius: '16px',
              backgroundColor: 'rgba(255,255,255,0.12)', mb: 2,
            }}
          >
            <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 36, color: '#fff' }} />
          </Box>
          <Typography variant="h4" sx={{ fontFamily: fonts.heading, color: '#fff', fontWeight: 800, mb: 0.5 }}>
            Admin Portal
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>
            Sign in with your administrator credentials.
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundColor: '#fff', borderRadius: '20px', p: { xs: 3, md: 5 },
            boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: '10px', fontFamily: fonts.body }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Admin email"
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
              disabled={loading || !email || !password}
              sx={{
                backgroundColor: colors.navy, color: '#fff', fontFamily: fonts.body, fontWeight: 700,
                textTransform: 'none', borderRadius: '12px', py: 1.5, mt: 0.5, fontSize: '1rem',
                '&:hover': { backgroundColor: colors.primaryBlue },
                '&.Mui-disabled': { backgroundColor: '#CBD5E1', color: '#fff' },
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Sign in to Admin'}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminLoginPage;
