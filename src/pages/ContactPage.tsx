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
  InputAdornment,
  SelectChangeEvent,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { serviceCategories } from '../data/services';
import { primaryButtonSx, radii } from '../theme';

const contactInputSx = {
  '& .MuiOutlinedInput-root': { borderRadius: radii.xl },
};

interface ContactInfo {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel: string;
  iconBg: string;
  href?: string;
}

const contactInfoItems: ContactInfo[] = [
  {
    icon: <PhoneIcon sx={{ color: '#1A73E8', fontSize: 22 }} />,
    label: '+1 (240) 576-0397',
    href: 'tel:+12405760397',
    sublabel: 'Mon–Fri 8AM–6PM, Sat 9AM–4PM',
    iconBg: '#E8F1FF',
    value: 'phone',
  },
  {
    icon: <EmailIcon sx={{ color: '#1A73E8', fontSize: 22 }} />,
    label: 'service@smartappliances.co',
    sublabel: 'We respond within 2 hours',
    iconBg: '#E8F1FF',
    value: 'email',
  },
  {
    icon: <LocationOnIcon sx={{ color: '#1A73E8', fontSize: 22 }} />,
    label: 'Serving Your Local Area',
    sublabel: 'We cover the greater metro area and surrounding regions',
    iconBg: '#E8F1FF',
    value: 'location',
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
          backgroundColor: '#0B3D91',
          py: { xs: 8, md: 10 },
          textAlign: 'center',
          px: 2,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h1"
            sx={{
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
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
              fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
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
                sx={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", color: '#0B3D91', mb: 4 }}
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
                      component={item.href ? 'a' : 'p'}
                      href={item.href}
                      sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#0B3D91', fontWeight: 700, lineHeight: 1.3, textDecoration: 'none', display: 'block', '&:hover': item.href ? { color: '#1A73E8', textDecoration: 'underline' } : {} }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#666666', mt: 0.25, lineHeight: 1.5 }}
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
                  border: '1px solid #E4E7EB',
                  p: 3,
                  mt: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                  <AccessTimeIcon sx={{ color: '#1A73E8', fontSize: 22 }} />
                  <Typography
                    variant="subtitle1"
                    sx={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", color: '#0B3D91', fontWeight: 700 }}
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
                      sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#1A1A1A', fontSize: '0.88rem' }}
                    >
                      {row.day}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#0B3D91', fontWeight: 600, fontSize: '0.88rem' }}
                    >
                      {row.hours}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Right: contact form */}
            <Box
              sx={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #E4E7EB',
                p: { xs: 3, md: 4 },
              }}
            >
              {submitted ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <CheckCircleIcon sx={{ fontSize: 64, color: '#1A73E8', mb: 2 }} />
                  <Typography
                    variant="h5"
                    sx={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", color: '#0B3D91', mb: 1.5 }}
                  >
                    Message Sent!
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#1A1A1A' }}
                  >
                    We'll be in touch within 2 hours.
                  </Typography>
                </Box>
              ) : (
                <>
                  <Typography
                    variant="h5"
                    sx={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", color: '#0B3D91', mb: 3 }}
                  >
                    Send Us a Message
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Box sx={{ display: 'flex', gap: 2.5, flexDirection: { xs: 'column', sm: 'row' } }}>
                      <TextField
                        label="Name *"
                        value={form.name}
                        onChange={handleChange('name')}
                        error={errors.name}
                        helperText={errors.name ? 'Name is required' : ''}
                        fullWidth
                        variant="outlined"
                        sx={contactInputSx}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonOutlineIcon sx={{ fontSize: 19, color: '#9AA5B1' }} />
                            </InputAdornment>
                          ),
                        }}
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
                        sx={contactInputSx}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailOutlinedIcon sx={{ fontSize: 19, color: '#9AA5B1' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2.5, flexDirection: { xs: 'column', sm: 'row' } }}>
                      <TextField
                        label="Phone"
                        value={form.phone}
                        onChange={handleChange('phone')}
                        fullWidth
                        variant="outlined"
                        sx={contactInputSx}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneOutlinedIcon sx={{ fontSize: 19, color: '#9AA5B1' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <FormControl fullWidth variant="outlined" sx={contactInputSx}>
                        <InputLabel id="service-category-label">Service Category</InputLabel>
                        <Select
                          labelId="service-category-label"
                          value={form.serviceCategory}
                          onChange={handleSelectChange}
                          label="Service Category"
                          sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif" }}
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
                    </Box>
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
                      sx={contactInputSx}
                    />
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      sx={{ ...primaryButtonSx, py: 1.75, fontSize: '1rem' }}
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
              sx={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", color: '#0B3D91', mr: { sm: 2 } }}
            >
              Need service now?
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/book/regular')}
              sx={{
                backgroundColor: '#1A73E8',
                color: '#FFFFFF',
                fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: '10px',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#0B3D91' },
              }}
            >
              Book Regular Service
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default ContactPage;
