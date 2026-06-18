import React, { useState } from 'react';
import {
  Box,
  Typography,
  Modal,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Divider,
  Checkbox,
  FormControlLabel,
  Link,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useAuth } from '../contexts/AuthContext';
import { colors, fonts } from '../theme';

interface AuthModalProps {
  open: boolean;
  initialView?: 'login' | 'signup';
  onClose: () => void;
  onSuccess?: () => void;
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
  </svg>
);

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    fontFamily: fonts.body,
    fontSize: '0.9rem',
  },
  '& .MuiInputLabel-root': { fontFamily: fonts.body, fontSize: '0.9rem' },
};

const socialBtnSx = {
  borderRadius: '10px',
  border: '1.5px solid #E4E7EB',
  color: '#1A1A1A',
  fontFamily: fonts.body,
  fontWeight: 600,
  fontSize: '0.85rem',
  textTransform: 'none' as const,
  py: 1.1,
  gap: 1,
  '&:hover': { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' },
};

const pwRules = [
  { label: '8 to 72 characters long', check: (pw: string) => pw.length >= 8 && pw.length <= 72 },
  { label: 'Not commonly used or easily guessed', check: (pw: string) => pw.length >= 8 },
];

const AuthModal: React.FC<AuthModalProps> = ({ open, initialView = 'login', onClose, onSuccess }) => {
  const { signIn, signUp, signInWithProvider } = useAuth();
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);
  const [view, setView] = useState<'login' | 'signup'>(initialView);

  // Shared
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sign-up only
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setEmail(''); setPassword(''); setFirstName(''); setLastName('');
    setError(''); setSuccess(false); setShowPw(false); setRememberMe(false);
  };

  React.useEffect(() => {
    if (open) { setView(initialView); resetForm(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialView]);

  const switchView = (v: 'login' | 'signup') => {
    resetForm();
    setView(v);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signIn(email.trim(), password);
    setLoading(false);
    if (err) { setError('Invalid email or password. Please try again.'); return; }
    handleClose();
    onSuccess?.();
  };

  const handleSocialAuth = async (provider: 'google' | 'facebook') => {
    setError('');
    setSocialLoading(provider);
    const { error: err } = await signInWithProvider(provider);
    if (err) {
      setError(err);
      setSocialLoading(null);
    }
    // On success the browser redirects to the provider — no further action needed here.
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    setLoading(true);
    const { error: err } = await signUp(email.trim(), password, fullName);
    setLoading(false);
    if (err) { setError(err); return; }
    setSuccess(true);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
    >
      <Box
        sx={{
          backgroundColor: '#fff',
          borderRadius: '20px',
          boxShadow: '0 24px 64px rgba(10,37,64,0.22)',
          width: '100%',
          maxWidth: 440,
          maxHeight: '92vh',
          overflow: 'auto',
          position: 'relative',
          outline: 'none',
        }}
      >
        {/* Close */}
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{ position: 'absolute', top: 14, right: 14, color: colors.mutedText, '&:hover': { color: '#EF4444', backgroundColor: '#FEE2E2' } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        {/* Tab row */}
        <Box sx={{ display: 'flex', borderBottom: `1px solid ${colors.border}` }}>
          {(['signup', 'login'] as const).map((v) => (
            <Box
              key={v}
              onClick={() => switchView(v)}
              sx={{
                flex: 1,
                py: 1.75,
                textAlign: 'center',
                cursor: 'pointer',
                fontFamily: fonts.body,
                fontWeight: view === v ? 700 : 500,
                fontSize: '0.9rem',
                color: view === v ? colors.primaryBlue : colors.mutedText,
                borderBottom: view === v ? `2.5px solid ${colors.primaryBlue}` : '2.5px solid transparent',
                transition: 'color 0.2s, border-color 0.2s',
                userSelect: 'none',
              }}
            >
              {v === 'signup' ? 'Sign up' : 'Log in'}
            </Box>
          ))}
        </Box>

        <Box sx={{ p: { xs: 3, sm: 4 } }}>
          {/* ── SIGN UP ── */}
          {view === 'signup' && !success && (
            <>
              <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, color: colors.navy, fontSize: '1.35rem', mb: 0.5 }}>
                Create your account
              </Typography>
              <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '0.85rem', mb: 2.5 }}>
                Book and track home services in one place.
              </Typography>

              {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '10px', fontFamily: fonts.body, fontSize: '0.85rem' }}>{error}</Alert>}

              <Box component="form" onSubmit={handleSignUp} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <TextField
                    label="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    fullWidth
                    autoComplete="given-name"
                    sx={fieldSx}
                    InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineIcon sx={{ fontSize: 18, color: colors.mutedText }} /></InputAdornment> }}
                  />
                  <TextField
                    label="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    fullWidth
                    autoComplete="family-name"
                    sx={fieldSx}
                  />
                </Box>

                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  autoComplete="email"
                  sx={fieldSx}
                  InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ fontSize: 18, color: colors.mutedText }} /></InputAdornment> }}
                />

                <TextField
                  label="Password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  autoComplete="new-password"
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ fontSize: 18, color: colors.mutedText }} /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPw(v => !v)} edge="end" size="small" aria-label={showPw ? 'Hide' : 'Show'}>
                          {showPw ? <VisibilityOffIcon sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Password rules */}
                {password.length > 0 && (
                  <Box sx={{ backgroundColor: '#F8FAFC', borderRadius: '10px', p: 1.5, display: 'flex', flexDirection: 'column', gap: 0.6 }}>
                    <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '0.75rem', color: colors.navy, mb: 0.25 }}>
                      Your password must:
                    </Typography>
                    {pwRules.map((rule) => (
                      <Box key={rule.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <CheckCircleOutlineIcon sx={{ fontSize: 14, color: rule.check(password) ? '#16A34A' : '#CBD5E1' }} />
                        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.76rem', color: rule.check(password) ? '#16A34A' : colors.mutedText }}>
                          {rule.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading || !firstName || !lastName || !email || !password}
                  sx={{ backgroundColor: colors.primaryBlue, color: '#fff', fontFamily: fonts.body, fontWeight: 700, textTransform: 'none', borderRadius: '12px', py: 1.4, fontSize: '0.95rem', '&:hover': { backgroundColor: colors.navy }, '&.Mui-disabled': { backgroundColor: '#CBD5E1', color: '#fff' } }}
                >
                  {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Create Account'}
                </Button>
              </Box>

              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.73rem', color: colors.mutedText, textAlign: 'center', mt: 1.5, lineHeight: 1.6 }}>
                By clicking Create Account, you agree to the{' '}
                <Link href="/legal/terms" sx={{ color: colors.primaryBlue, fontWeight: 600 }}>Terms of Use</Link>
                {' '}and{' '}
                <Link href="/legal/privacy" sx={{ color: colors.primaryBlue, fontWeight: 600 }}>Privacy Policy</Link>.
              </Typography>

              <Divider sx={{ my: 2.5, color: colors.mutedText, fontSize: '0.8rem', '&::before, &::after': { borderColor: colors.border } }}>or</Divider>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={socialBtnSx}
                  startIcon={socialLoading === 'google' ? <CircularProgress size={16} /> : <GoogleIcon />}
                  disabled={socialLoading !== null}
                  onClick={() => handleSocialAuth('google')}
                >
                  Sign up with Google
                </Button>
              </Box>

              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.73rem', color: colors.mutedText, textAlign: 'center', mt: 1.5, lineHeight: 1.6 }}>
                By clicking Sign up with Google, you agree to the{' '}
                <Link href="/legal/terms" sx={{ color: colors.primaryBlue, fontWeight: 600 }}>Terms of Use</Link>
                {' '}and{' '}
                <Link href="/legal/privacy" sx={{ color: colors.primaryBlue, fontWeight: 600 }}>Privacy Policy</Link>.
              </Typography>
            </>
          )}

          {/* ── SIGN UP SUCCESS ── */}
          {view === 'signup' && success && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 52, color: '#16A34A', mb: 1.5 }} />
              <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, color: colors.navy, fontSize: '1.3rem', mb: 1 }}>
                Check your email
              </Typography>
              <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '0.9rem', lineHeight: 1.7 }}>
                We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then log in.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => switchView('login')}
                sx={{ mt: 3, borderRadius: '10px', fontFamily: fonts.body, fontWeight: 700, textTransform: 'none', borderColor: colors.primaryBlue, color: colors.primaryBlue }}
              >
                Go to Log in
              </Button>
            </Box>
          )}

          {/* ── LOG IN ── */}
          {view === 'login' && (
            <>
              <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, color: colors.navy, fontSize: '1.35rem', mb: 0.5 }}>
                Welcome back
              </Typography>
              <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '0.85rem', mb: 2.5 }}>
                Sign in to view your bookings and service history.
              </Typography>

              {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '10px', fontFamily: fonts.body, fontSize: '0.85rem' }}>{error}</Alert>}

              <Box component="form" onSubmit={handleLogin} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
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
                  InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ fontSize: 18, color: colors.mutedText }} /></InputAdornment> }}
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
                    startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ fontSize: 18, color: colors.mutedText }} /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPw(v => !v)} edge="end" size="small" aria-label={showPw ? 'Hide' : 'Show'}>
                          {showPw ? <VisibilityOffIcon sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: -0.5 }}>
                  <FormControlLabel
                    control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} size="small" sx={{ color: colors.mutedText, '&.Mui-checked': { color: colors.primaryBlue } }} />}
                    label={<Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.darkText }}>Remember me</Typography>}
                  />
                  <Link href="/forgot-password" sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.primaryBlue, fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                    Forgot password?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading || !email || !password}
                  sx={{ backgroundColor: colors.primaryBlue, color: '#fff', fontFamily: fonts.body, fontWeight: 700, textTransform: 'none', borderRadius: '12px', py: 1.4, fontSize: '0.95rem', '&:hover': { backgroundColor: colors.navy }, '&.Mui-disabled': { backgroundColor: '#CBD5E1', color: '#fff' } }}
                >
                  {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Sign in'}
                </Button>
              </Box>

              <Divider sx={{ my: 2.5, color: colors.mutedText, fontSize: '0.8rem', '&::before, &::after': { borderColor: colors.border } }}>or</Divider>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={socialBtnSx}
                  startIcon={socialLoading === 'google' ? <CircularProgress size={16} /> : <GoogleIcon />}
                  disabled={socialLoading !== null}
                  onClick={() => handleSocialAuth('google')}
                >
                  Continue with Google
                </Button>
              </Box>

              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.73rem', color: colors.mutedText, textAlign: 'center', mt: 1.5, lineHeight: 1.6 }}>
                By clicking Continue with Google, you agree to the{' '}
                <Link href="/legal/terms" sx={{ color: colors.primaryBlue, fontWeight: 600 }}>Terms of Use</Link>
                {' '}and{' '}
                <Link href="/legal/privacy" sx={{ color: colors.primaryBlue, fontWeight: 600 }}>Privacy Policy</Link>.
                {' '}We'll keep you logged in.
              </Typography>

              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.85rem', color: colors.mutedText, textAlign: 'center', mt: 2 }}>
                Don't have an account?{' '}
                <Box component="span" onClick={() => switchView('signup')} sx={{ color: colors.primaryBlue, fontWeight: 700, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                  Sign up.
                </Box>
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default AuthModal;
