import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  serviceCategories,
  ServiceRequest,
  APPLIANCE_TYPES,
  TIME_WINDOWS,
} from '../data/services';
import { generateTriageResult } from '../lib/triage';
import { saveServiceRequest } from '../lib/firebase';

const STORAGE_KEY = 'smart-appliances-service-requests';

const PHONE_REGEX = /^\+?[\d\s\-()]{7,15}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const steps = ['Service Details', 'Contact & Address', 'Appointment & Confirm'];

const priorityColors: Record<string, string> = {
  Emergency: '#FF6B6B',
  High: '#FF9800',
  Normal: '#22B1FB',
  Low: '#757575',
};

interface FormErrors {
  serviceCategory?: string;
  serviceType?: string;
  issueDescription?: string;
  applianceType?: string;
  preferredDate?: string;
  timeWindow?: string;
  consent?: string;
  customerName?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

const RegularBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});

  // Step 1 fields
  const [serviceCategoryId, setServiceCategoryId] = useState<string>(
    searchParams.get('category') ?? serviceCategories[0].id,
  );
  const [serviceTypeId, setServiceTypeId] = useState<string>('');
  const [applianceType, setApplianceType] = useState<string>('');
  const [applianceBrand, setApplianceBrand] = useState('');
  const [applianceModel, setApplianceModel] = useState('');
  const [issueStartDate, setIssueStartDate] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [hasSafetyConcern, setHasSafetyConcern] = useState(false);
  const [applianceStillRunning, setApplianceStillRunning] = useState<'yes' | 'no' | 'unsure' | ''>('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Step 2 fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateValue, setStateValue] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Step 3 fields
  const [preferredDate, setPreferredDate] = useState('');
  const [timeWindow, setTimeWindow] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [consent, setConsent] = useState(false);

  const selectedCategory = useMemo(
    () => serviceCategories.find((c) => c.id === serviceCategoryId) ?? serviceCategories[0],
    [serviceCategoryId],
  );

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const serviceParam = searchParams.get('service');
    if (categoryParam) {
      setServiceCategoryId(categoryParam);
    }
    if (serviceParam) {
      setServiceTypeId(serviceParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const category = serviceCategories.find((c) => c.id === serviceCategoryId);
    if (category) {
      setServiceTypeId((curr) =>
        category.services.some((s) => s.id === curr) ? curr : category.services[0].id,
      );
    }
  }, [serviceCategoryId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl(null);
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};
    if (!serviceCategoryId) newErrors.serviceCategory = 'Please select a service category.';
    if (!serviceTypeId) newErrors.serviceType = 'Please select a service type.';
    if (!issueDescription.trim()) newErrors.issueDescription = 'Please describe the issue.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};
    if (!customerName.trim()) newErrors.customerName = 'Full name is required.';
    if (!phone.trim() || !PHONE_REGEX.test(phone)) newErrors.phone = 'Please enter a valid phone number.';
    if (!email.trim() || !EMAIL_REGEX.test(email)) newErrors.email = 'Please enter a valid email address.';
    if (!address.trim()) newErrors.address = 'Street address is required.';
    if (!city.trim()) newErrors.city = 'City is required.';
    if (!stateValue.trim()) newErrors.state = 'State is required.';
    if (!zipCode.trim()) newErrors.zipCode = 'ZIP code is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: FormErrors = {};
    if (!preferredDate) newErrors.preferredDate = 'Please select a preferred date.';
    if (!timeWindow) newErrors.timeWindow = 'Please select a time window.';
    if (!consent) newErrors.consent = 'Please accept the terms to proceed.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let valid = false;
    if (activeStep === 0) valid = validateStep1();
    else if (activeStep === 1) valid = validateStep2();
    else if (activeStep === 2) valid = validateStep3();
    if (valid) {
      if (activeStep < steps.length - 1) {
        setActiveStep((s) => s + 1);
        setErrors({});
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    setActiveStep((s) => s - 1);
    setErrors({});
  };

  const handleSubmit = () => {
    const categoryTitle = selectedCategory.title;
    const serviceTypeLabel =
      selectedCategory.services.find((s) => s.id === serviceTypeId)?.label ?? serviceTypeId;

    const stillRunningBool: boolean | null =
      applianceStillRunning === 'yes'
        ? true
        : applianceStillRunning === 'no'
        ? false
        : null;

    const triage = generateTriageResult({
      serviceCategory: categoryTitle,
      serviceType: serviceTypeLabel,
      issueDescription,
      hasSafetyConcern,
      applianceStillRunning: stillRunningBool,
      servicePriority: 'regular',
    });

    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    const newRequest: ServiceRequest = {
      id: requestId,
      customerName,
      email,
      phone,
      address,
      city,
      state: stateValue,
      zipCode,
      serviceCategory: categoryTitle,
      serviceType: serviceTypeLabel,
      servicePriority: 'regular',
      urgencyLevel: triage.urgencyLevel,
      preferredDate,
      preferredTime: timeWindow,
      requestedResponseTime: `${preferredDate} — ${timeWindow}`,
      issueDescription,
      applianceBrand: applianceBrand || null,
      applianceModel: applianceModel || null,
      imageUrl: imagePreviewUrl,
      notes: additionalNotes || null,
      emergencyBadge: false,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      applianceType: applianceType || null,
      issueStartDate: issueStartDate || null,
      timeWindow: timeWindow || null,
      priorityScore: triage.priorityScore,
      possibleIssue: triage.possibleIssue,
      recommendedTechnicianType: triage.recommendedTechnicianType,
      estimatedDuration: triage.estimatedDuration,
      safetyNotes: triage.safetyNotes || null,
      hasSafetyConcern,
      applianceStillRunning: stillRunningBool,
      callbackTime: null,
      assignedTechnicianId: null,
      technicianStatus: null,
    };

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as ServiceRequest[];
      localStorage.setItem(STORAGE_KEY, JSON.stringify([newRequest, ...existing]));
    } catch {
      // ignore
    }

    // Save to Firestore (non-blocking)
    saveServiceRequest(newRequest).catch(() => {});

    navigate(`/confirmation/${requestId}`);
  };

  const triagePreview = useMemo(() => {
    if (activeStep === 2 && issueDescription.trim()) {
      const categoryTitle = selectedCategory.title;
      const serviceTypeLabel =
        selectedCategory.services.find((s) => s.id === serviceTypeId)?.label ?? '';
      const stillRunningBool: boolean | null =
        applianceStillRunning === 'yes' ? true : applianceStillRunning === 'no' ? false : null;
      return generateTriageResult({
        serviceCategory: categoryTitle,
        serviceType: serviceTypeLabel,
        issueDescription,
        hasSafetyConcern,
        applianceStillRunning: stillRunningBool,
        servicePriority: 'regular',
      });
    }
    return null;
  }, [activeStep, issueDescription, selectedCategory, serviceTypeId, hasSafetyConcern, applianceStillRunning]);

  const today = new Date().toISOString().split('T')[0];

  return (
    <Box sx={{ backgroundColor: '#F5F7F9', minHeight: '100vh', pb: 8 }}>
      {/* Page header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #022F49 0%, #034a73 100%)',
          py: { xs: 4, md: 6 },
          px: 2,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/services')}
              sx={{
                color: 'rgba(255,255,255,0.7)',
                textTransform: 'none',
                fontFamily: 'DM Sans, Arial, sans-serif',
                '&:hover': { color: '#FFFFFF' },
              }}
            >
              Back to Services
            </Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CalendarTodayIcon sx={{ color: '#22B1FB', fontSize: 36 }} />
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: 'Wasted Vindey, Arial, sans-serif',
                  color: '#FFFFFF',
                  fontWeight: 700,
                }}
              >
                Book Regular Service
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'DM Sans, Arial, sans-serif' }}
              >
                Schedule a service appointment at your convenience
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        {/* Stepper */}
        <Paper
          elevation={0}
          sx={{ borderRadius: '16px', border: '1px solid #E8EFF5', p: { xs: 2, md: 3 }, mb: 4 }}
        >
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    '& .MuiStepLabel-label': { fontFamily: 'DM Sans, Arial, sans-serif', fontSize: '0.875rem' },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        <Paper
          elevation={0}
          sx={{ borderRadius: '16px', border: '1px solid #E8EFF5', p: { xs: 2, md: 4 } }}
        >
          {/* Step 1 — Service Details */}
          {activeStep === 0 && (
            <Box>
              <Typography
                variant="h6"
                sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#022F49', mb: 3 }}
              >
                Service Details
              </Typography>

              <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                <FormControl fullWidth error={Boolean(errors.serviceCategory)}>
                  <InputLabel>Service Category *</InputLabel>
                  <Select
                    value={serviceCategoryId}
                    label="Service Category *"
                    onChange={(e: SelectChangeEvent<string>) => setServiceCategoryId(e.target.value)}
                  >
                    {serviceCategories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.title}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.serviceCategory && <FormHelperText>{errors.serviceCategory}</FormHelperText>}
                </FormControl>

                <FormControl fullWidth error={Boolean(errors.serviceType)}>
                  <InputLabel>Service Type *</InputLabel>
                  <Select
                    value={serviceTypeId}
                    label="Service Type *"
                    onChange={(e: SelectChangeEvent<string>) => setServiceTypeId(e.target.value)}
                  >
                    {selectedCategory.services.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.serviceType && <FormHelperText>{errors.serviceType}</FormHelperText>}
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Appliance Type</InputLabel>
                  <Select
                    value={applianceType}
                    label="Appliance Type"
                    onChange={(e: SelectChangeEvent<string>) => setApplianceType(e.target.value)}
                  >
                    <MenuItem value="">— Select (optional) —</MenuItem>
                    {APPLIANCE_TYPES.map((t) => (
                      <MenuItem key={t} value={t}>
                        {t}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Appliance Brand (optional)"
                  value={applianceBrand}
                  onChange={(e) => setApplianceBrand(e.target.value)}
                  fullWidth
                />

                <TextField
                  label="Appliance Model (optional)"
                  value={applianceModel}
                  onChange={(e) => setApplianceModel(e.target.value)}
                  fullWidth
                />

                <TextField
                  label="When did the issue start?"
                  type="date"
                  value={issueStartDate}
                  onChange={(e) => setIssueStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Box>

              <TextField
                label="Describe the issue *"
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                fullWidth
                multiline
                minRows={4}
                sx={{ mt: 3 }}
                error={Boolean(errors.issueDescription)}
                helperText={errors.issueDescription}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={hasSafetyConcern}
                    onChange={(e) => setHasSafetyConcern(e.target.checked)}
                    sx={{ color: '#FF6B6B', '&.Mui-checked': { color: '#FF6B6B' } }}
                  />
                }
                label="This involves safety concerns (smoke, burning smell, gas, or electrical hazard)"
                sx={{ mt: 2, display: 'block', fontFamily: 'DM Sans, Arial, sans-serif' }}
              />

              {hasSafetyConcern && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: '10px' }}>
                  If there is an immediate safety risk, please call 911 first or use our{' '}
                  <Box
                    component="span"
                    sx={{ cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}
                    onClick={() => navigate('/book/emergency')}
                  >
                    Emergency Service
                  </Box>{' '}
                  form.
                </Alert>
              )}

              <Box sx={{ mt: 3 }}>
                <FormControl component="fieldset">
                  <FormLabel
                    component="legend"
                    sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#555555', mb: 1 }}
                  >
                    Is the appliance still running?
                  </FormLabel>
                  <RadioGroup
                    row
                    value={applianceStillRunning}
                    onChange={(e) => setApplianceStillRunning(e.target.value as 'yes' | 'no' | 'unsure')}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                    <FormControlLabel value="unsure" control={<Radio />} label="Unsure" />
                  </RadioGroup>
                </FormControl>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Button
                  component="label"
                  variant="outlined"
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    borderColor: '#22B1FB',
                    color: '#22B1FB',
                  }}
                >
                  Upload Photo / Video (optional)
                  <input
                    type="file"
                    hidden
                    accept="image/* video/*"
                    onChange={handleImageChange}
                  />
                </Button>
                {imagePreviewUrl && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ color: '#555555', mb: 1 }}>
                      Preview
                    </Typography>
                    <Box
                      component="img"
                      src={imagePreviewUrl}
                      alt="Upload preview"
                      sx={{ maxWidth: 200, borderRadius: '10px', border: '1px solid #D9D9D9' }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {/* Step 2 — Contact & Address */}
          {activeStep === 1 && (
            <Box>
              <Typography
                variant="h6"
                sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#022F49', mb: 3 }}
              >
                Contact & Address
              </Typography>
              <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                <TextField
                  label="Full Name *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  fullWidth
                  error={Boolean(errors.customerName)}
                  helperText={errors.customerName}
                />
                <TextField
                  label="Phone Number *"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  fullWidth
                  error={Boolean(errors.phone)}
                  helperText={errors.phone}
                />
                <TextField
                  label="Email Address *"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                  sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}
                />
                <TextField
                  label="Street Address *"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  fullWidth
                  error={Boolean(errors.address)}
                  helperText={errors.address}
                  sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}
                />
                <TextField
                  label="City *"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  fullWidth
                  error={Boolean(errors.city)}
                  helperText={errors.city}
                />
                <TextField
                  label="State *"
                  value={stateValue}
                  onChange={(e) => setStateValue(e.target.value)}
                  fullWidth
                  error={Boolean(errors.state)}
                  helperText={errors.state}
                />
                <TextField
                  label="ZIP Code *"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  fullWidth
                  error={Boolean(errors.zipCode)}
                  helperText={errors.zipCode}
                />
              </Box>
            </Box>
          )}

          {/* Step 3 — Appointment & Confirm */}
          {activeStep === 2 && (
            <Box>
              <Typography
                variant="h6"
                sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#022F49', mb: 3 }}
              >
                Appointment & Confirmation
              </Typography>

              <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                <TextField
                  label="Preferred Date *"
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: today }}
                  fullWidth
                  error={Boolean(errors.preferredDate)}
                  helperText={errors.preferredDate}
                />
              </Box>

              <Box sx={{ mt: 3 }}>
                <FormControl component="fieldset" error={Boolean(errors.timeWindow)}>
                  <FormLabel
                    component="legend"
                    sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#555555', mb: 1 }}
                  >
                    Preferred Time Window *
                  </FormLabel>
                  <RadioGroup
                    value={timeWindow}
                    onChange={(e) => setTimeWindow(e.target.value)}
                  >
                    {TIME_WINDOWS.map((tw) => (
                      <FormControlLabel key={tw} value={tw} control={<Radio />} label={tw} />
                    ))}
                  </RadioGroup>
                  {errors.timeWindow && <FormHelperText>{errors.timeWindow}</FormHelperText>}
                </FormControl>
              </Box>

              <TextField
                label="Additional Notes (optional)"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                fullWidth
                multiline
                minRows={3}
                sx={{ mt: 3 }}
              />

              {/* Triage Result Preview */}
              {triagePreview && (
                <Box
                  sx={{
                    mt: 3,
                    p: 3,
                    borderRadius: '12px',
                    backgroundColor: '#F0F8FF',
                    border: `1.5px solid ${priorityColors[triagePreview.urgencyLevel] ?? '#22B1FB'}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CheckCircleIcon sx={{ color: '#22B1FB' }} />
                    <Typography
                      variant="subtitle1"
                      sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#022F49', fontWeight: 700 }}
                    >
                      Triage Summary
                    </Typography>
                    <Chip
                      label={triagePreview.urgencyLevel}
                      size="small"
                      sx={{
                        backgroundColor: priorityColors[triagePreview.urgencyLevel],
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontFamily: 'DM Sans, Arial, sans-serif',
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'grid', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#444' }}>
                      <strong>Possible Issue:</strong> {triagePreview.possibleIssue}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#444' }}>
                      <strong>Recommended Technician:</strong> {triagePreview.recommendedTechnicianType}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#444' }}>
                      <strong>Estimated Duration:</strong> {triagePreview.estimatedDuration}
                    </Typography>
                    {triagePreview.safetyNotes && (
                      <Alert severity="warning" sx={{ mt: 1, borderRadius: '8px' }}>
                        {triagePreview.safetyNotes}
                      </Alert>
                    )}
                  </Box>
                </Box>
              )}

              <FormControlLabel
                control={
                  <Checkbox
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                }
                label="I understand that final pricing may depend on diagnosis and availability, and consent to be contacted by a technician."
                sx={{ mt: 3, display: 'block', fontFamily: 'DM Sans, Arial, sans-serif' }}
              />
              {errors.consent && (
                <Typography variant="caption" sx={{ color: '#d32f2f', ml: 2 }}>
                  {errors.consent}
                </Typography>
              )}
            </Box>
          )}

          {/* Navigation buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={activeStep === 0 ? () => navigate('/services') : handleBack}
              startIcon={<ArrowBackIcon />}
              sx={{
                textTransform: 'none',
                fontFamily: 'DM Sans, Arial, sans-serif',
                color: '#555555',
              }}
            >
              {activeStep === 0 ? 'Cancel' : 'Back'}
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={activeStep < steps.length - 1 ? <ArrowForwardIcon /> : <CheckCircleIcon />}
              sx={{
                backgroundColor: '#22B1FB',
                color: '#FFFFFF',
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontWeight: 700,
                px: 4,
                borderRadius: '10px',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#022F49' },
              }}
            >
              {activeStep < steps.length - 1 ? 'Continue' : 'Submit Request'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegularBookingPage;
