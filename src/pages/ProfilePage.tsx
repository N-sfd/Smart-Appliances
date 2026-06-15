import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Container, TextField, Button, Alert, CircularProgress,
  Divider, InputAdornment,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { colors, fonts } from '../theme';

const formatPhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const fieldSx = {
  '& .MuiOutlinedInput-root': { borderRadius: '12px', fontFamily: fonts.body },
};

const ProfilePage: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFullName(profile?.full_name ?? '');
    setPhone(profile?.phone ? formatPhone(profile.phone) : '');
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!user) return;

    const digits = phone.replace(/\D/g, '');
    if (digits.length > 0 && digits.length !== 10) {
      setError('Enter a valid 10-digit phone number.');
      return;
    }

    setSaving(true);
    if (isSupabaseConfigured() && supabase) {
      const { error: err } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim(), phone: digits || null })
        .eq('id', user.id);
      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }
    }
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '80vh', backgroundColor: colors.background, py: { xs: 4, md: 6 } }}>
      <Container maxWidth="sm">
        <Box sx={{ mb: 3 }}>
          <Button
            component={RouterLink}
            to="/my-bookings"
            startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
            sx={{
              fontFamily: fonts.body, fontWeight: 600, textTransform: 'none',
              color: colors.primaryBlue, px: 0,
              '&:hover': { backgroundColor: 'transparent', color: colors.navy },
            }}
          >
            My Bookings
          </Button>
        </Box>

        <Box
          sx={{
            backgroundColor: '#fff', borderRadius: '20px', p: { xs: 3, md: 5 },
            boxShadow: colors.cardShadow, border: `1px solid ${colors.border}`,
          }}
        >
          <Typography variant="h4" sx={{ fontFamily: fonts.heading, color: colors.navy, fontWeight: 800, mb: 0.5 }}>
            My Profile
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '0.9rem', mb: 3 }}>
            Update your contact details.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: '10px', fontFamily: fonts.body }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2.5, borderRadius: '10px', fontFamily: fonts.body }}>
              Profile updated successfully.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSave} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              fullWidth
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
              value={user?.email ?? ''}
              fullWidth
              disabled
              sx={fieldSx}
              helperText="Email cannot be changed here."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ fontSize: 20, color: colors.mutedText }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Phone number"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              inputProps={{ inputMode: 'tel' }}
              fullWidth
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneOutlinedIcon sx={{ fontSize: 20, color: colors.mutedText }} />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              sx={{
                backgroundColor: colors.primaryBlue, color: '#fff', fontFamily: fonts.body,
                fontWeight: 700, textTransform: 'none', borderRadius: '12px', py: 1.5,
                mt: 0.5, fontSize: '1rem', '&:hover': { backgroundColor: colors.navy },
                '&.Mui-disabled': { backgroundColor: '#CBD5E1', color: '#fff' },
              }}
            >
              {saving ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Save Changes'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.85rem', color: colors.mutedText }}>
                Signed in as
              </Typography>
              <Typography sx={{ fontFamily: fonts.body, fontWeight: 600, color: colors.darkText, fontSize: '0.9rem' }}>
                {user?.email}
              </Typography>
            </Box>
            <Button
              onClick={handleSignOut}
              variant="outlined"
              sx={{
                borderColor: colors.border, color: colors.darkText, fontFamily: fonts.body,
                fontWeight: 600, textTransform: 'none', borderRadius: '10px',
                '&:hover': { borderColor: '#EF4444', color: '#EF4444' },
              }}
            >
              Sign out
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProfilePage;
