import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { serviceCategories } from '../data/services';

interface ContactInfo {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel: string;
  iconBg: string;
}

const contactInfoItems: ContactInfo[] = [
  {
    icon: <PhoneIcon sx={{ color: '#22B1FB', fontSize: 22 }} />,
    label: '+1 (555) 123-4567',
    sublabel: 'Mon–Fri 8AM–6PM, Sat 9AM–4PM',
    iconBg: '#E8F4FD',
    value: 'phone',
  },
  {
    icon: <EmailIcon sx={{ color: '#22B1FB', fontSize: 22 }} />,
    label: 'service@smartappliance.com',
    sublabel: 'We respond within 2 hours',
    iconBg: '#E8F4FD',
    value: 'email',
  },
  {
    icon: <LocationOnIcon sx={{ color: '#22B1FB', fontSize: 22 }} />,
    label: 'Serving Your Local Area',
    sublabel: 'We cover the greater metro area and surrounding regions',
    iconBg: '#E8F4FD',
    value: 'location',
  },
  {
    icon: <WarningAmberIcon sx={{ color: '#FF6B6B', fontSize: 22 }} />,
    label: 'Emergency Line',
    sublabel: '+1 (555) 911-HELP — Available 24/7',
    iconBg: '#FFF0F0',
    value: 'emergency',
  },
];

const businessHours = [
  { day: 'Mon–Fri', hours: '8:00 AM – 6:00 PM' },
  { day: 'Saturday', hours: '9:00 AM – 4:00 PM' },
  { day: 'Sunday', hours: 'Closed (Emergency Only)' },
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  serviceCategory: string;
  message: string;
}

interface FormErrors {
  name: boolean;
  email: boolean;
  message: boolean;
  emailFormat: boolean;
}

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    serviceCategory: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({
    name: false,
    email: false,
    message: false,
    emailFormat: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: false, emailFormat: false }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setForm((prev) => ({ ...prev, serviceCategory: e.target.value }));
  };

  const validate = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors: FormErrors = {
      name: !form.name.trim(),
      email: !form.email.trim(),
      message: !form.message.trim(),
      emailFormat: !!form.email.trim() && !emailRegex.test(form.email),
    };
    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.message && !newErrors.emailFormat;
  };

  const handleSubmit = () => {
    if (validate()) {
      setSubmitted(true);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      {/* ── Page Hero ── */}
      <Box
        sx={{
          backgroundColor: '#022F49',
          py: { xs: 8, md: 10 },
          textAlign: 'center',
          px: 2,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h1"
            sx={{
              fontFamily: 'Wasted Vindey, Arial, sans-serif',
              fontWeight: 700,
              color: '#FFFFFF',
              fontSize: { xs: '2rem', sm: '2.6rem', md: '3rem' },
              mb: 2,
            }}
          >
            Contact SmartAppliance
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'DM Sans, Arial, sans-serif',
              color: '#A8D8F0',
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.8,
            }}
          >
            We're here to help. Reach out and our team will respond quickly.
          </Typography>
        </Container>
      </Box>

      {/* ── Two-column layout ── */}
      <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: '#F5F7F9' }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: 4, md: 6 },
            }}
          >
            {/* Left: contact info */}
            <Box>
              <Typography
                variant="h4"
                sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#022F49', mb: 4 }}
              >
                Get In Touch
              </Typography>

              {contactInfoItems.map((item) => (
                <Box
                  key={item.value}
                  sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      backgroundColor: item.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#022F49', fontWeight: 700, lineHeight: 1.3 }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#666666', mt: 0.25, lineHeight: 1.5 }}
                    >
                      {item.sublabel}
                    </Typography>
                  </Box>
                </Box>
              ))}

              {/* Business hours card */}
              <Box
                sx={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E5E5E5',
                  p: 3,
                  mt: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                  <AccessTimeIcon sx={{ color: '#22B1FB', fontSize: 22 }} />
                  <Typography
                    variant="subtitle1"
                    sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#022F49', fontWeight: 700 }}
                  >
                    Business Hours
                  </Typography>
                </Box>
                {businessHours.map((row) => (
                  <Box
                    key={row.day}
                    sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#555555', fontSize: '0.88rem' }}
                    >
                      {row.day}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#022F49', fontWeight: 600, fontSize: '0.88rem' }}
                    >
                      {row.hours}
                    </Typography>
                  </Box>
                ))}
                <Box
                  sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: '1px solid #E5E5E5',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <WarningAmberIcon sx={{ color: '#FF6B6B', fontSize: 16, flexShrink: 0 }} />
                  <Typography
                    variant="caption"
                    sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#CC2200', fontWeight: 600 }}
                  >
                    Emergency service available 24/7 — call anytime
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Right: contact form */}
            <Box
              sx={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #E5E5E5',
                p: { xs: 3, md: 4 },
              }}
            >
              {submitted ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <CheckCircleIcon sx={{ fontSize: 64, color: '#22B1FB', mb: 2 }} />
                  <Typography
                    variant="h5"
                    sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#022F49', mb: 1.5 }}
                  >
                    Message Sent!
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#555555' }}
                  >
                    We'll be in touch within 2 hours.
                  </Typography>
                </Box>
              ) : (
                <>
                  <Typography
                    variant="h5"
                    sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#022F49', mb: 3 }}
                  >
                    Send Us a Message
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                      label="Name *"
                      value={form.name}
                      onChange={handleChange('name')}
                      error={errors.name}
                      helperText={errors.name ? 'Name is required' : ''}
                      fullWidth
                      variant="outlined"
                    />
                    <TextField
                      label="Email *"
                      type="email"
                      value={form.email}
                      onChange={handleChange('email')}
                      error={errors.email || errors.emailFormat}
                      helperText={
                        errors.email
                          ? 'Email is required'
                          : errors.emailFormat
                          ? 'Enter a valid email address'
                          : ''
                      }
                      fullWidth
                      variant="outlined"
                    />
                    <TextField
                      label="Phone"
                      value={form.phone}
                      onChange={handleChange('phone')}
                      fullWidth
                      variant="outlined"
                    />
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="service-category-label">Service Category</InputLabel>
                      <Select
                        labelId="service-category-label"
                        value={form.serviceCategory}
                        onChange={handleSelectChange}
                        label="Service Category"
                        sx={{ fontFamily: 'DM Sans, Arial, sans-serif' }}
                      >
                        <MenuItem value="">
                          <em>Select a category</em>
                        </MenuItem>
                        {serviceCategories.map((cat) => (
                          <MenuItem key={cat.id} value={cat.id}>
                            {cat.title}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label="Message *"
                      value={form.message}
                      onChange={handleChange('message')}
                      error={errors.message}
                      helperText={errors.message ? 'Message is required' : ''}
                      fullWidth
                      multiline
                      minRows={5}
                      variant="outlined"
                    />
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      sx={{
                        backgroundColor: '#22B1FB',
                        color: '#FFFFFF',
                        fontFamily: 'DM Sans, Arial, sans-serif',
                        fontWeight: 700,
                        py: 1.75,
                        borderRadius: '10px',
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': { backgroundColor: '#022F49' },
                      }}
                    >
                      Send Message
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── Bottom CTA row ── */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#022F49', mr: { sm: 2 } }}
            >
              Need service now?
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/book/regular')}
              sx={{
                backgroundColor: '#22B1FB',
                color: '#FFFFFF',
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: '10px',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#022F49' },
              }}
            >
              Book Regular Service
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/book/emergency')}
              startIcon={<WarningAmberIcon />}
              sx={{
                borderColor: '#FF6B6B',
                color: '#FF6B6B',
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: '10px',
                textTransform: 'none',
                '&:hover': { backgroundColor: 'rgba(255,107,107,0.08)', borderColor: '#CC2200', color: '#CC2200' },
              }}
            >
              Emergency Service
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default ContactPage;
