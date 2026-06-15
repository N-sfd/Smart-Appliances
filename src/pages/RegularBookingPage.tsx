import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Card,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import { serviceCategories, ServiceRequest } from '../data/services';
import { colors, fonts } from '../theme';
import { getServiceImage } from '../data/serviceImages';
import {
  normalizeZipInput,
  validateZipCode,
  getZipFieldHelperText,
  isZipFieldError,
  SERVICE_AREA_ZIP_HINT,
} from '../data/serviceAreas';

const STORAGE_KEY = 'smart-appliances-service-requests';

const STEPS = [
  { num: 1, label: 'Service Details' },
  { num: 2, label: 'Contact Info' },
  { num: 3, label: 'Review & Submit' },
] as const;

const saveRequest = (request: ServiceRequest): void => {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    const requests: ServiceRequest[] = existing ? (JSON.parse(existing) as ServiceRequest[]) : [];
    requests.unshift(request);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch {
    // ignore
  }
};

interface BookingState {
  serviceCategory?: string;
  serviceType?: string;
  sameDayRequested?: boolean;
  zipCode?: string;
}

const fieldLabelSx = {
  fontFamily: fonts.body,
  fontSize: '14px',
  fontWeight: 600,
  color: colors.darkText,
  mb: 1,
  display: 'block',
};

const inputRootSx = {
  height: 56,
  borderRadius: '16px',
  fontFamily: fonts.body,
  fontSize: '16px',
  color: colors.darkText,
  backgroundColor: colors.white,
  '& fieldset': { borderColor: colors.border },
  '&:hover fieldset': { borderColor: colors.primaryBlue },
  '&.Mui-focused fieldset': {
    borderColor: colors.primaryBlue,
    boxShadow: '0 0 0 4px rgba(26, 115, 232, 0.12)',
  },
  '& .MuiSelect-select': {
    display: 'flex',
    alignItems: 'center',
    py: 0,
    minHeight: '56px !important',
    boxSizing: 'border-box',
  },
};

const fieldSx = {
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
  '& .MuiOutlinedInput-root': inputRootSx,
  '& .MuiOutlinedInput-input': {
    py: 0,
    px: '18px',
    height: 56,
    boxSizing: 'border-box' as const,
    fontSize: '16px',
  },
  '& .MuiInputBase-input::placeholder': { color: colors.mutedText, opacity: 1 },
};

const backButtonSx = {
  height: 52,
  borderRadius: '14px',
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.white,
  color: colors.darkText,
  fontFamily: fonts.body,
  fontWeight: 600,
  fontSize: '15px',
  textTransform: 'none' as const,
  px: 3,
  '&:hover': { backgroundColor: colors.veryLightBg, borderColor: colors.border },
};

const continueButtonSx = {
  height: 52,
  borderRadius: '14px',
  backgroundColor: colors.primaryBlue,
  color: colors.white,
  fontFamily: fonts.body,
  fontWeight: 700,
  fontSize: '15px',
  textTransform: 'none' as const,
  px: 4,
  boxShadow: '0 8px 24px rgba(26, 115, 232, 0.22)',
  '&:hover': { backgroundColor: colors.primaryBlueHover },
  '&.Mui-disabled': {
    backgroundColor: colors.border,
    color: colors.mutedText,
    boxShadow: 'none',
  },
};

const RegularBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = (location.state as BookingState | null) ?? {};

  const initCategory = serviceCategories.find((c) => c.id === prefill.serviceCategory) ?? serviceCategories[0];
  const initServiceId =
    initCategory.services.find((s) => s.id === prefill.serviceType)?.id ?? initCategory.services[0].id;

  const [step, setStep] = useState(1);
  const [categoryId, setCategoryId] = useState(initCategory.id);
  const [serviceTypeId, setServiceTypeId] = useState(initServiceId);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [zipCode, setZipCode] = useState(prefill.zipCode ?? '');
  const [zipTouched, setZipTouched] = useState(false);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [issueDesc, setIssueDesc] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const selectedCategory = serviceCategories.find((c) => c.id === categoryId) ?? serviceCategories[0];
  const selectedService = selectedCategory.services.find((s) => s.id === serviceTypeId);

  const zipValidation = validateZipCode(zipCode);

  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    const cat = serviceCategories.find((c) => c.id === e.target.value) ?? serviceCategories[0];
    setCategoryId(cat.id);
    setServiceTypeId(cat.services[0].id);
  };

  const handleSubmit = () => {
    const request: ServiceRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      customerName: name,
      email,
      phone,
      address,
      city,
      state: stateVal,
      zipCode,
      serviceCategory: selectedCategory.title,
      serviceType: selectedService?.label ?? serviceTypeId,
      applianceType: null,
      servicePriority: 'regular',
      urgencyLevel: null,
      priorityScore: 2,
      possibleIssue: null,
      recommendedTechnicianType: null,
      estimatedDuration: null,
      safetyNotes: null,
      hasSafetyConcern: false,
      applianceStillRunning: null,
      issueStartDate: null,
      preferredDate,
      preferredTime,
      timeWindow: null,
      requestedResponseTime: preferredDate ? `${preferredDate} ${preferredTime}`.trim() : null,
      callbackTime: null,
      issueDescription: issueDesc,
      applianceBrand: brand || null,
      applianceModel: model || null,
      imageUrl: null,
      notes: null,
      emergencyBadge: false,
      assignedTechnicianId: null,
      technicianStatus: null,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveRequest(request);
    setSubmitted(true);
  };

  const ActionRow = ({
    onBack,
    onContinue,
    continueLabel,
    continueDisabled,
  }: {
    onBack?: () => void;
    onContinue: () => void;
    continueLabel: string;
    continueDisabled?: boolean;
  }) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column-reverse', sm: 'row' },
        justifyContent: 'space-between',
        gap: 1.5,
        mt: 3,
        pt: 2.5,
        borderTop: `1px solid ${colors.border}`,
      }}
    >
      {onBack ? (
        <Button onClick={onBack} sx={{ ...backButtonSx, width: { xs: '100%', sm: 'auto' } }}>
          Back
        </Button>
      ) : (
        <Box sx={{ display: { xs: 'none', sm: 'block' } }} />
      )}
      <Button
        variant="contained"
        disabled={continueDisabled}
        onClick={onContinue}
        sx={{ ...continueButtonSx, width: { xs: '100%', sm: 'auto' }, ml: { sm: 'auto' } }}
      >
        {continueLabel}
      </Button>
    </Box>
  );

  const StepHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        sx={{
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: { xs: '1.2rem', md: '1.35rem' },
          color: colors.navy,
          mb: 0.5,
        }}
      >
        {title}
      </Typography>
      <Typography sx={{ fontFamily: fonts.body, fontSize: '15px', color: colors.mutedText, lineHeight: 1.5 }}>
        {subtitle}
      </Typography>
    </Box>
  );

  if (submitted) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, py: 5, px: 2 }}>
        <Card
          sx={{
            maxWidth: 480,
            width: '100%',
            mx: 'auto',
            borderRadius: '24px',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 18px 40px rgba(10, 37, 64, 0.08)',
            textAlign: 'center',
            p: { xs: 3, md: 4 },
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 64, color: colors.primaryBlue, mb: 2 }} />
          <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '1.5rem', color: colors.navy, mb: 1 }}>
            Booking Submitted!
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '15px', color: colors.darkText, mb: 3, lineHeight: 1.6 }}>
            Thank you, {name}. We&apos;ll contact you within 2 hours to confirm your service appointment.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')} sx={continueButtonSx}>
            Back to Home
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.background, py: { xs: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
      <Box sx={{ maxWidth: 860, mx: 'auto' }}>
        {/* Page header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 3.5 } }}>
          <Typography
            component="h1"
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '30px', md: '40px' },
              color: colors.navy,
              lineHeight: 1.15,
              mb: 1,
            }}
          >
            Book Regular Service
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '16px', color: colors.mutedText, lineHeight: 1.5 }}>
            Schedule a non-urgent repair or installation appointment.
          </Typography>
        </Box>

        {/* Stepper */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            mb: { xs: 2.5, md: 3 },
            px: { xs: 0, sm: 1 },
          }}
        >
          {STEPS.map((s, index) => {
            const isActive = step === s.num;
            const isComplete = step > s.num;
            const isHighlighted = isActive || isComplete;
            return (
              <React.Fragment key={s.num}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.75,
                    minWidth: { xs: 72, sm: 100, md: 120 },
                    flex: index === STEPS.length - 1 ? '0 0 auto' : undefined,
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: fonts.body,
                      fontWeight: 700,
                      fontSize: '14px',
                      backgroundColor: isHighlighted ? colors.primaryBlue : colors.border,
                      color: isHighlighted ? colors.white : colors.mutedText,
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    {s.num}
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: fonts.body,
                      fontWeight: isActive ? 700 : 500,
                      fontSize: { xs: '11px', sm: '12px', md: '13px' },
                      color: isActive ? colors.primaryBlue : colors.mutedText,
                      textAlign: 'center',
                      lineHeight: 1.25,
                    }}
                  >
                    {s.label}
                  </Typography>
                </Box>
                {index < STEPS.length - 1 && (
                  <Box
                    sx={{
                      flex: 1,
                      height: 2,
                      backgroundColor: step > s.num ? colors.primaryBlue : colors.border,
                      mt: '18px',
                      mx: { xs: 0.5, sm: 1 },
                      minWidth: { xs: 24, sm: 40 },
                      transition: 'background-color 0.2s ease',
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </Box>

        {/* Form card */}
        <Card
          className="form-card"
          sx={{
            borderRadius: '24px',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 18px 40px rgba(10, 37, 64, 0.08)',
            backgroundColor: colors.white,
          }}
        >
            {step === 1 && (
              <Box>
                <StepHeader
                  title="Service Details"
                  subtitle="Tell us what needs repair or installation."
                />

                {/* Dynamic service image banner */}
                {(() => {
                  const info = getServiceImage(serviceTypeId, categoryId);
                  return (
                    <Box sx={{ mb: 3, borderRadius: '20px', border: '1px solid #E4E7EB', overflow: 'hidden', boxShadow: '0 12px 30px rgba(10,37,64,0.08)', transition: 'all 0.3s ease' }}>
                      <Box component="img" src={info.image} alt={info.title} sx={{ width: '100%', height: 200, objectFit: 'cover', display: 'block', transition: 'opacity 0.3s ease' }} />
                      <Box sx={{ p: '16px 18px', backgroundColor: '#FFFFFF' }}>
                        <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#0B3D91', lineHeight: 1.2 }}>{info.title}</Typography>
                        <Typography sx={{ fontSize: '14px', color: '#64748B', mt: '4px', lineHeight: 1.5 }}>{info.desc}</Typography>
                      </Box>
                    </Box>
                  );
                })()}

                {/* Selected service summary */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                    mb: 2.5,
                    p: 2,
                    backgroundColor: colors.lightBlueBg,
                    border: '1px solid #D0E3FF',
                    borderRadius: '16px',
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '10px',
                      backgroundColor: colors.white,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <BuildOutlinedIcon sx={{ color: colors.primaryBlue, fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontFamily: fonts.body, fontSize: '12px', fontWeight: 600, color: colors.mutedText, mb: 0.25, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                      Selected Service
                    </Typography>
                    <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '16px', color: colors.navy, lineHeight: 1.3 }}>
                      {selectedService?.label ?? 'Select a service'}
                    </Typography>
                    <Typography sx={{ fontFamily: fonts.body, fontSize: '13px', color: colors.mutedText, mt: 0.25 }}>
                      {selectedCategory.title} • Regular appointment
                    </Typography>
                  </Box>
                </Box>

                <Box className="form-grid">
                  <Box className="form-field">
                    <Typography component="label" sx={fieldLabelSx}>Service Category</Typography>
                    <FormControl fullWidth sx={fieldSx}>
                      <Select
                        value={categoryId}
                        onChange={handleCategoryChange}
                        input={<OutlinedInput notched={false} />}
                      >
                        {serviceCategories.map((cat) => (
                          <MenuItem key={cat.id} value={cat.id}>{cat.title}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box className="form-field">
                    <Typography component="label" sx={fieldLabelSx}>Specific Service</Typography>
                    <FormControl fullWidth sx={fieldSx}>
                      <Select
                        value={serviceTypeId}
                        onChange={(e: SelectChangeEvent<string>) => setServiceTypeId(e.target.value)}
                        input={<OutlinedInput notched={false} />}
                      >
                        {selectedCategory.services.map((s) => (
                          <MenuItem key={s.id} value={s.id}>{s.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box className="form-field">
                    <Typography component="label" sx={fieldLabelSx}>Appliance Brand (optional)</Typography>
                    <TextField
                      fullWidth
                      placeholder="e.g. Samsung, LG, Whirlpool"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      sx={fieldSx}
                    />
                  </Box>

                  <Box className="form-field">
                    <Typography component="label" sx={fieldLabelSx}>Appliance Model (optional)</Typography>
                    <TextField
                      fullWidth
                      placeholder="e.g. WF45T6000AW"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      sx={fieldSx}
                    />
                  </Box>

                  <Box className="form-field full-width">
                    <Typography component="label" sx={fieldLabelSx}>Describe the Issue *</Typography>
                    <textarea
                      className="booking-textarea"
                      value={issueDesc}
                      onChange={(e) => setIssueDesc(e.target.value)}
                      placeholder="Tell us what is happening with the appliance or service issue."
                    />
                  </Box>
                </Box>

                <ActionRow
                  onContinue={() => setStep(2)}
                  continueLabel="Continue"
                  continueDisabled={!issueDesc.trim()}
                />
              </Box>
            )}

            {step === 2 && (
              <Box>
                <StepHeader
                  title="Contact Info"
                  subtitle="How should we reach you about this appointment?"
                />

                <Box className="form-grid">
                  <Box className="form-field">
                    <Typography component="label" sx={fieldLabelSx}>Full Name *</Typography>
                    <TextField
                      fullWidth
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      sx={fieldSx}
                    />
                  </Box>

                  <Box className="form-field">
                    <Typography component="label" sx={fieldLabelSx}>Email *</Typography>
                    <TextField
                      fullWidth
                      type="email"
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      sx={fieldSx}
                    />
                  </Box>

                  <Box className="form-field">
                    <Typography component="label" sx={fieldLabelSx}>Phone *</Typography>
                    <TextField
                      fullWidth
                      placeholder="(555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      sx={fieldSx}
                    />
                  </Box>

                  <Box className="form-field">
                    <Typography component="label" sx={fieldLabelSx}>Street Address</Typography>
                    <TextField
                      fullWidth
                      placeholder="123 Main Street"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      sx={fieldSx}
                    />
                  </Box>

                  <Box className="form-field">
                    <Typography component="label" sx={fieldLabelSx}>City</Typography>
                    <TextField
                      fullWidth
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      sx={fieldSx}
                    />
                  </Box>

                  <Box className="form-field">
                    <Typography component="label" sx={fieldLabelSx}>State</Typography>
                    <TextField
                      fullWidth
                      placeholder="State"
                      value={stateVal}
                      onChange={(e) => setStateVal(e.target.value)}
                      sx={fieldSx}
                    />
                  </Box>

                  <Box className="form-field">
                    <Typography component="label" sx={fieldLabelSx}>ZIP Code *</Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter 5-digit ZIP"
                      value={zipCode}
                      onChange={(e) => setZipCode(normalizeZipInput(e.target.value))}
                      onBlur={() => setZipTouched(true)}
                      inputProps={{ inputMode: 'numeric', maxLength: 5 }}
                      error={isZipFieldError(zipCode, zipTouched || zipCode.length === 5)}
                      sx={fieldSx}
                    />
                    <FormHelperText
                      sx={{
                        mx: 0,
                        fontFamily: fonts.body,
                        fontSize: '13px',
                        color: zipValidation.isInServiceArea ? '#15803D' : zipValidation.message ? colors.emergency : colors.mutedText,
                        fontWeight: zipValidation.isInServiceArea || zipValidation.message ? 600 : 400,
                      }}
                    >
                      {getZipFieldHelperText(zipCode, zipTouched || zipCode.length === 5)}
                    </FormHelperText>
                  </Box>

                  <Box className="form-field form-field-note">
                    <Typography
                      sx={{
                        fontFamily: fonts.body,
                        fontSize: '14px',
                        color: colors.mutedText,
                        lineHeight: 1.5,
                      }}
                    >
                      {SERVICE_AREA_ZIP_HINT}. Enter yours to confirm availability.
                    </Typography>
                  </Box>
                </Box>

                <ActionRow
                  onBack={() => setStep(1)}
                  onContinue={() => setStep(3)}
                  continueLabel="Continue"
                  continueDisabled={!name || !email || !phone || !zipValidation.isValid}
                />
              </Box>
            )}

            {step === 3 && (
              <Box>
                <StepHeader
                  title="Review & Submit"
                  subtitle="Choose your preferred time and confirm your booking."
                />

                {/* Booking summary */}
                <Box
                  sx={{
                    mb: 2.5,
                    p: 2,
                    backgroundColor: colors.veryLightBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '16px',
                  }}
                >
                  <Typography sx={{ fontFamily: fonts.body, fontSize: '13px', fontWeight: 600, color: colors.mutedText, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Booking Summary
                  </Typography>
                  {[
                    ['Service', `${selectedService?.label ?? '—'} (${selectedCategory.title})`],
                    ['Contact', name || '—'],
                    ['Phone', phone || '—'],
                    ['Email', email || '—'],
                    ['Location', [address, city, stateVal, zipCode].filter(Boolean).join(', ') || '—'],
                  ].map(([label, value]) => (
                    <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 0.75, flexWrap: 'wrap' }}>
                      <Typography sx={{ fontFamily: fonts.body, fontSize: '14px', color: colors.mutedText }}>{label}</Typography>
                      <Typography sx={{ fontFamily: fonts.body, fontSize: '14px', fontWeight: 600, color: colors.darkText, textAlign: 'right' }}>{value}</Typography>
                    </Box>
                  ))}
                </Box>

                <Box className="form-grid">
                  <Box className="form-field">
                    <Typography component="label" sx={fieldLabelSx}>Preferred Date</Typography>
                    <TextField
                      fullWidth
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      sx={fieldSx}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>

                  <Box className="form-field">
                    <Typography component="label" sx={fieldLabelSx}>Preferred Time</Typography>
                    <FormControl fullWidth sx={fieldSx}>
                      <Select
                        value={preferredTime}
                        displayEmpty
                        onChange={(e: SelectChangeEvent<string>) => setPreferredTime(e.target.value)}
                        input={<OutlinedInput notched={false} />}
                        renderValue={(v) => v || 'Select a time window'}
                      >
                        {['Morning (8AM–12PM)', 'Afternoon (12PM–4PM)', 'Evening (4PM–6PM)', 'Flexible'].map((t) => (
                          <MenuItem key={t} value={t}>{t}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                <ActionRow
                  onBack={() => setStep(2)}
                  onContinue={handleSubmit}
                  continueLabel="Submit Booking"
                />
              </Box>
            )}
        </Card>
      </Box>
    </Box>
  );
};

export default RegularBookingPage;
