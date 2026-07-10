import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { colors, fonts } from '../../theme';
import { normalizeZipInput } from '../../data/serviceAreas';
import { BUSINESS_HOURS, CONTACT_INFO, CONTACT_SERVICE_CATEGORIES } from '../../data/contact-info';

const ServiceAreaMap = lazy(() => import('../ServiceAreaMap'));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Shared card treatment so the business-hours card, form card, and map read as one family. */
const CARD_RADIUS = '20px';
const CARD_SHADOW = '0 4px 20px rgba(11,61,145,0.06)';
const FIELD_RADIUS = '12px';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: FIELD_RADIUS,
    fontFamily: fonts.body,
  },
  '& .MuiOutlinedInput-input': {
    fontSize: '0.9rem',
    paddingTop: '14px',
    paddingBottom: '14px',
  },
  '& .MuiSelect-select': {
    fontSize: '0.9rem',
    paddingTop: '14px !important',
    paddingBottom: '14px !important',
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.85rem',
  },
  '& .MuiFormHelperText-root': {
    fontSize: '0.72rem',
    marginLeft: 0,
  },
} as const;

export interface GetInTouchSectionProps {
  /** Show the "Send Us a Message" form card. Default true. */
  showForm?: boolean;
  /** Show the compact Business Hours card. Default true. */
  showBusinessHours?: boolean;
  /** Show the embedded service-area map. Default true. */
  showMap?: boolean;
  /** Reduce section/card spacing without changing the design language — for embedding on service pages. */
  compact?: boolean;
  /** Preselect a Service Category value (see CONTACT_SERVICE_CATEGORIES ids in data/contact-info.ts). */
  defaultServiceCategory?: string;
  /** Section background color. Defaults to the light surface used across the site. */
  backgroundColor?: string;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  zip: string;
  serviceCategory: string;
  message: string;
}

interface FormErrors {
  name: boolean;
  email: boolean;
  emailFormat: boolean;
  zipFormat: boolean;
  message: boolean;
}

/**
 * Standardized "Get In Touch" section — contact info, business hours, service-area
 * map, and a message form. Used on /contact, service category pages, and the homepage
 * so every instance shares one layout, one data source, and one submit behavior.
 */
const GetInTouchSection: React.FC<GetInTouchSectionProps> = ({
  showForm = true,
  showBusinessHours = true,
  showMap = true,
  compact = false,
  defaultServiceCategory,
  backgroundColor = colors.surface,
}) => {
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    zip: '',
    serviceCategory: defaultServiceCategory ?? '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({
    name: false,
    email: false,
    emailFormat: false,
    zipFormat: false,
    message: false,
  });
  const [touched, setTouched] = useState({ name: false, email: false, zip: false, message: false });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (defaultServiceCategory) {
      setForm((prev) => ({ ...prev, serviceCategory: defaultServiceCategory }));
      return;
    }
    const serviceParam = searchParams.get('service') ?? searchParams.get('serviceCategory') ?? '';
    if (!serviceParam) return;
    const normalized = serviceParam.trim().toLowerCase();
    const match = CONTACT_SERVICE_CATEGORIES.find(
      (item) => item.id === normalized || item.id === serviceParam.trim(),
    );
    if (match) {
      setForm((prev) => ({ ...prev, serviceCategory: match.id }));
    }
    // Only re-run when the resolved query param actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultServiceCategory, searchParams.get('service'), searchParams.get('serviceCategory')]);

  const handleChange = (field: 'name' | 'email' | 'phone' | 'message') => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: false, ...(field === 'email' ? { emailFormat: false } : {}) }));
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const zip = normalizeZipInput(e.target.value);
    setForm((prev) => ({ ...prev, zip }));
    setErrors((prev) => ({ ...prev, zipFormat: false }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setForm((prev) => ({ ...prev, serviceCategory: e.target.value }));
  };

  const emailValid = !form.email.trim() || EMAIL_RE.test(form.email);
  const zipValid = !form.zip || form.zip.length === 5;

  const validate = (): boolean => {
    const newErrors: FormErrors = {
      name: !form.name.trim(),
      email: !form.email.trim(),
      emailFormat: !!form.email.trim() && !EMAIL_RE.test(form.email),
      zipFormat: !zipValid,
      message: !form.message.trim(),
    };
    setErrors(newErrors);
    setTouched({ name: true, email: true, zip: true, message: true });
    return !newErrors.name && !newErrors.email && !newErrors.emailFormat && !newErrors.zipFormat && !newErrors.message;
  };

  const handleSubmit = () => {
    if (validate()) {
      setSubmitted(true);
    }
  };

  const headingFontSize = { xs: '1.65rem', md: '2.125rem' };
  const sectionPy = compact ? { xs: 5, md: 6.5 } : { xs: 7, md: 9 };
  const cardPadding = compact ? { xs: '20px', md: '24px' } : { xs: '20px', md: '28px' };
  const columnGap = compact ? { xs: 3, md: 4 } : { xs: 3, md: 4.5 };

  const renderContactRow = (
    icon: React.ReactNode,
    label: React.ReactNode,
    sublabel: string,
    href?: string,
    linkProps?: React.AnchorHTMLAttributes<HTMLAnchorElement>,
  ) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '13px', minWidth: 0, flex: 1 }}>
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: '11px',
          backgroundColor: '#E8F1FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        {href ? (
          <Typography
            component="a"
            href={href}
            {...linkProps}
            sx={{
              fontFamily: fonts.body,
              fontSize: '0.95rem',
              fontWeight: 600,
              color: colors.navy,
              lineHeight: 1.3,
              textDecoration: 'none',
              display: 'block',
              '&:hover': { color: colors.primaryBlue, textDecoration: 'underline' },
              '&:focus-visible': { outline: `2px solid ${colors.primaryBlue}`, outlineOffset: 2, borderRadius: '4px' },
            }}
          >
            {label}
          </Typography>
        ) : (
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.95rem', fontWeight: 600, color: colors.navy, lineHeight: 1.3 }}>
            {label}
          </Typography>
        )}
        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.8125rem', color: colors.mutedText, mt: '4px', lineHeight: 1.45 }}>
          {sublabel}
        </Typography>
      </Box>
    </Box>
  );

  // The map is deliberately kept out of this grid and rendered as its own full-width
  // section below — inside the grid it made the left column much taller than the form.
  const desktopAreas = showForm
    ? `"heading form" "contact form" "hours form"`
    : `"heading" "contact" "hours"`;
  const mobileAreas = `"heading" "contact" ${showForm ? '"form" ' : ''}"hours"`;

  return (
    <Box id="contact" sx={{ py: sectionPy, backgroundColor, scrollMarginTop: '80px' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: showForm ? '0.88fr 1fr' : '1fr' },
            gridTemplateAreas: { xs: mobileAreas, md: desktopAreas },
            columnGap,
            rowGap: { xs: 3, md: 3 },
            alignItems: 'start',
          }}
        >
          {/* Heading */}
          <Box sx={{ gridArea: 'heading' }}>
            <Typography
              variant="h2"
              sx={{ fontFamily: fonts.heading, fontWeight: 700, color: colors.navy, fontSize: headingFontSize, mb: 1, letterSpacing: '-0.3px' }}
            >
              Get In Touch
            </Typography>
            <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '0.95rem', maxWidth: 480 }}>
              Questions before you book? Reach us by phone, email, or the form.
            </Typography>
          </Box>

          {/* Contact info grid: phone + email row, then address, then coverage */}
          <Box sx={{ gridArea: 'contact', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '16px' }}>
              {renderContactRow(
                <PhoneIcon sx={{ color: '#1A73E8', fontSize: 19 }} />,
                CONTACT_INFO.phone,
                CONTACT_INFO.phoneHours,
                CONTACT_INFO.phoneHref,
              )}
              {renderContactRow(
                <EmailIcon sx={{ color: '#1A73E8', fontSize: 19 }} />,
                CONTACT_INFO.email,
                CONTACT_INFO.emailSubtext,
                CONTACT_INFO.emailHref,
              )}
            </Box>
            {renderContactRow(
              <LocationOnIcon sx={{ color: '#1A73E8', fontSize: 19 }} />,
              CONTACT_INFO.address,
              CONTACT_INFO.addressSubtext,
              CONTACT_INFO.addressMapUrl,
              { target: '_blank', rel: 'noopener noreferrer' },
            )}
            {renderContactRow(
              <LocationOnIcon sx={{ color: '#1A73E8', fontSize: 19 }} />,
              CONTACT_INFO.coverage,
              CONTACT_INFO.coverageSupportingText,
            )}
          </Box>

          {/* Business hours */}
          {showBusinessHours && (
            <Box
              sx={{
                gridArea: 'hours',
                backgroundColor: '#FFFFFF',
                borderRadius: CARD_RADIUS,
                border: '1px solid #E4E7EB',
                boxShadow: CARD_SHADOW,
                p: '20px',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: '15px' }}>
                <AccessTimeIcon sx={{ color: '#1A73E8', fontSize: 19 }} />
                <Typography sx={{ fontFamily: fonts.heading, color: colors.navy, fontWeight: 600, fontSize: '0.95rem' }}>
                  Business Hours
                </Typography>
              </Box>
              {BUSINESS_HOURS.map((row) => (
                <Box key={row.day} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: '9px', '&:last-of-type': { mb: 0 } }}>
                  <Typography sx={{ fontFamily: fonts.body, color: colors.darkText, fontSize: '0.85rem' }}>
                    {row.day}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: fonts.body,
                      color: row.isEmergency ? '#D97706' : colors.navy,
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      textAlign: 'right',
                    }}
                  >
                    {row.hours}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* Form card */}
          {showForm && (
            <Box
              sx={{
                gridArea: 'form',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E4E7EB',
                borderRadius: CARD_RADIUS,
                boxShadow: CARD_SHADOW,
                p: cardPadding,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {submitted ? (
                <Box role="status" aria-live="polite" sx={{ textAlign: 'center', py: 5 }}>
                  <CheckCircleIcon sx={{ fontSize: 48, color: '#1A73E8', mb: 2 }} />
                  <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '1.15rem', color: colors.navy, mb: 1 }}>
                    Message Sent!
                  </Typography>
                  <Typography sx={{ fontFamily: fonts.body, fontSize: '0.9rem', color: colors.darkText }}>
                    We&apos;ll be in touch within 2 hours.
                  </Typography>
                </Box>
              ) : (
                <>
                  <Typography
                    id="get-in-touch-form-heading"
                    sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: { xs: '1.3rem', md: '1.625rem' }, color: colors.navy, mb: '22px' }}
                  >
                    Send Us a Message
                  </Typography>
                  <Box
                    component="form"
                    aria-labelledby="get-in-touch-form-heading"
                    noValidate
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                    sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
                  >
                    <Box sx={{ display: 'flex', gap: '15px', flexDirection: { xs: 'column', sm: 'row' } }}>
                      <TextField
                        label="Name *"
                        value={form.name}
                        onChange={handleChange('name')}
                        onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                        error={touched.name && errors.name}
                        helperText={touched.name && errors.name ? 'Name is required.' : ''}
                        aria-invalid={touched.name && errors.name}
                        aria-describedby="contact-name-helper"
                        FormHelperTextProps={{ id: 'contact-name-helper' }}
                        fullWidth
                        variant="outlined"
                        sx={fieldSx}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonOutlineIcon sx={{ fontSize: 18, color: '#9AA5B1' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        label="Email *"
                        type="email"
                        value={form.email}
                        onChange={handleChange('email')}
                        onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                        error={touched.email && (errors.email || !emailValid)}
                        helperText={
                          touched.email && errors.email
                            ? 'Email is required.'
                            : touched.email && !emailValid
                            ? 'Enter a valid email address.'
                            : ''
                        }
                        aria-invalid={touched.email && (errors.email || !emailValid)}
                        aria-describedby="contact-email-helper"
                        FormHelperTextProps={{ id: 'contact-email-helper' }}
                        fullWidth
                        variant="outlined"
                        sx={fieldSx}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailOutlinedIcon sx={{ fontSize: 18, color: '#9AA5B1' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: '15px', flexDirection: { xs: 'column', sm: 'row' } }}>
                      <TextField
                        label="Phone"
                        value={form.phone}
                        onChange={handleChange('phone')}
                        fullWidth
                        variant="outlined"
                        sx={fieldSx}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneOutlinedIcon sx={{ fontSize: 18, color: '#9AA5B1' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        label="ZIP Code"
                        value={form.zip}
                        onChange={handleZipChange}
                        onBlur={() => setTouched((prev) => ({ ...prev, zip: true }))}
                        error={touched.zip && !zipValid}
                        helperText={touched.zip && !zipValid ? 'Enter a valid 5-digit ZIP code.' : ''}
                        aria-invalid={touched.zip && !zipValid}
                        aria-describedby="contact-zip-helper"
                        FormHelperTextProps={{ id: 'contact-zip-helper' }}
                        inputProps={{ inputMode: 'numeric', maxLength: 5 }}
                        fullWidth
                        variant="outlined"
                        sx={fieldSx}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnIcon sx={{ fontSize: 18, color: '#9AA5B1' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <FormControl fullWidth variant="outlined" sx={fieldSx}>
                      <InputLabel id="get-in-touch-service-category-label">Service Category</InputLabel>
                      <Select
                        labelId="get-in-touch-service-category-label"
                        id="get-in-touch-service-category"
                        value={form.serviceCategory}
                        onChange={handleSelectChange}
                        label="Service Category"
                        sx={{ fontFamily: fonts.body }}
                      >
                        <MenuItem value="">
                          <em>Select a category</em>
                        </MenuItem>
                        {CONTACT_SERVICE_CATEGORIES.map((cat) => (
                          <MenuItem key={cat.id} value={cat.id}>
                            {cat.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label="Message *"
                      value={form.message}
                      onChange={handleChange('message')}
                      onBlur={() => setTouched((prev) => ({ ...prev, message: true }))}
                      error={touched.message && errors.message}
                      helperText={touched.message && errors.message ? 'Message is required.' : ''}
                      aria-invalid={touched.message && errors.message}
                      aria-describedby="contact-message-helper"
                      FormHelperTextProps={{ id: 'contact-message-helper' }}
                      fullWidth
                      multiline
                      minRows={6}
                      variant="outlined"
                      sx={{
                        ...fieldSx,
                        '& .MuiInputBase-inputMultiline': {
                          resize: 'vertical',
                          minHeight: { xs: 150, sm: 165, md: 180 },
                          boxSizing: 'border-box',
                        },
                      }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: '#1A73E8',
                        color: '#fff',
                        fontFamily: fonts.heading,
                        fontWeight: 700,
                        height: 52,
                        borderRadius: FIELD_RADIUS,
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        boxShadow: 'none',
                        '&:hover': { backgroundColor: colors.navy, boxShadow: 'none' },
                      }}
                    >
                      Send Message
                    </Button>
                  </Box>

                  <Box
                    sx={{
                      mt: '18px',
                      pt: '18px',
                      borderTop: '1px solid #EEF0F3',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1.5,
                      justifyContent: 'space-between',
                    }}
                  >
                    {[
                      { icon: <AccessTimeIcon sx={{ fontSize: 16, color: '#1A73E8' }} />, label: 'We respond within 2 hours' },
                      { icon: <CheckCircleIcon sx={{ fontSize: 16, color: '#1A73E8' }} />, label: 'No spam — service-related replies only' },
                    ].map((item) => (
                      <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        {item.icon}
                        <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '0.78rem' }}>
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </Box>
          )}
        </Box>

        {/* Service area map — kept as its own full-width row so it never stretches the
            left column much taller than the form card. */}
        {showMap && (
          <Box sx={{ mt: { xs: 3, md: 3.5 } }}>
            <Suspense fallback={<Box sx={{ height: 240, borderRadius: CARD_RADIUS, backgroundColor: '#EAF1FF' }} aria-hidden />}>
              <ServiceAreaMap height={{ xs: 220, sm: 235, md: 240 }} />
            </Suspense>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default GetInTouchSection;
