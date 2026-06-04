import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Checkbox,
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
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { serviceCategories, ServiceRequest } from '../data/services';
import { generateTriageResult } from '../lib/triage';
import { saveServiceRequest } from '../lib/firebase';

const STORAGE_KEY = 'smart-appliances-service-requests';
const PHONE_REGEX = /^\+?[\d\s\-()]{7,15}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const steps = ['Emergency Details', 'Contact & Address'];

const EMERGENCY_TYPES = [
  'Major water leak',
  'Burning smell',
  'Smoke',
  'Electrical issue',
  'Appliance overheating',
  'Refrigerator stopped working',
  'Gas smell',
  'Flooding',
  'Other emergency',
];

interface FormErrors {
  emergencyType?: string;
  serviceCategory?: string;
  serviceType?: string;
  issueDescription?: string;
  customerName?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

const EmergencyBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});

  // Step 1 fields
  const [emergencyType, setEmergencyType] = useState('');
  const [serviceCategoryId, setServiceCategoryId] = useState<string>(
    searchParams.get('category') ?? serviceCategories[0].id,
  );
  const [serviceTypeId, setServiceTypeId] = useState<string>('');
  const [hasSafetyConcern, setHasSafetyConcern] = useState(false);
  const [applianceStillRunning, setApplianceStillRunning] = useState<'yes' | 'no' | ''>('');
  const [issueDescription, setIssueDescription] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [callbackTime, setCallbackTime] = useState('');

  // Step 2 fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateValue, setStateValue] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const selectedCategory = useMemo(
    () => serviceCategories.find((c) => c.id === serviceCategoryId) ?? serviceCategories[0],
    [serviceCategoryId],
  );

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) setServiceCategoryId(categoryParam);
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
    if (!emergencyType) newErrors.emergencyType = 'Please select the emergency type.';
    if (!serviceTypeId) newErrors.serviceType = 'Please select a service type.';
    if (!issueDescription.trim()) newErrors.issueDescription = 'Please describe the emergency.';
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

  const handleNext = () => {
    let valid = false;
    if (activeStep === 0) valid = validateStep1();
    else if (activeStep === 1) valid = validateStep2();
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
      applianceStillRunning === 'yes' ? true : applianceStillRunning === 'no' ? false : null;

    const triage = generateTriageResult({
      serviceCategory: categoryTitle,
      serviceType: serviceTypeLabel,
      issueDescription: `${emergencyType}. ${issueDescription}`,
      hasSafetyConcern: hasSafetyConcern || true, // always emergency
      applianceStillRunning: stillRunningBool,
      servicePriority: 'emergency',
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
      servicePriority: 'emergency',
      urgencyLevel: 'Emergency',
      preferredDate: null,
      preferredTime: null,
      requestedResponseTime: 'ASAP — Emergency',
      issueDescription: `${emergencyType}: ${issueDescription}`,
      applianceBrand: null,
      applianceModel: null,
      imageUrl: imagePreviewUrl,
      notes: additionalNotes || null,
      emergencyBadge: true,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      applianceType: null,
      issueStartDate: null,
      timeWindow: null,
      priorityScore: 4,
      possibleIssue: triage.possibleIssue,
      recommendedTechnicianType: triage.recommendedTechnicianType,
      estimatedDuration: triage.estimatedDuration,
      safetyNotes: triage.safetyNotes || 'Turn off the appliance immediately. If you smell gas or see smoke, evacuate and call 911.',
      hasSafetyConcern: hasSafetyConcern || true,
      applianceStillRunning: stillRunningBool,
      callbackTime: callbackTime || null,
      assignedTechnicianId: null,
      technicianStatus: null,
    };

    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as ServiceRequest[];
      localStorage.setItem(STORAGE_KEY, JSON.stringify([newRequest, ...existing]));
    } catch {
      // ignore
    }

    saveServiceRequest(newRequest).catch(() => {});
    navigate(`/confirmation/${requestId}`);
  };

  return (
    <Box sx={{ backgroundColor: '#FFF5F5', minHeight: '100vh', pb: 8 }}>
      {/* Safety banner */}
      <Box
        sx={{
          backgroundColor: '#FF6B6B',
          py: 1.5,
          px: 2,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: '#FFFFFF',
            fontFamily: 'DM Sans, Arial, sans-serif',
            fontWeight: 700,
            fontSize: { xs: '0.8rem', md: '0.95rem' },
          }}
        >
          If you smell gas, see smoke, or have an electrical hazard — leave the area immediately and call 911 before using this form.
        </Typography>
      </Box>

      {/* Page header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #7a1a1a 0%, #CC2200 100%)',
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
            <WarningAmberIcon sx={{ color: '#FFD700', fontSize: 40 }} />
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: 'Wasted Vindey, Arial, sans-serif',
                  color: '#FFFFFF',
                  fontWeight: 700,
                }}
              >
                Emergency Service Request
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'DM Sans, Arial, sans-serif' }}
              >
                Our dispatch team will contact you as soon as possible
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        {/* Stepper */}
        <Paper
          elevation={0}
          sx={{ borderRadius: '16px', border: '1px solid #FFD0D0', p: { xs: 2, md: 3 }, mb: 4 }}
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
          sx={{
            borderRadius: '16px',
            border: '2px solid #FF6B6B',
            p: { xs: 2, md: 4 },
          }}
        >
          {/* Step 1 — Emergency Details */}
          {activeStep === 0 && (
            <Box>
              <Typography
                variant="h6"
                sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#CC2200', mb: 3 }}
              >
                Emergency Details
              </Typography>

              <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                <FormControl fullWidth error={Boolean(errors.emergencyType)}>
                  <InputLabel>Emergency Type *</InputLabel>
                  <Select
                    value={emergencyType}
                    label="Emergency Type *"
                    onChange={(e: SelectChangeEvent<string>) => setEmergencyType(e.target.value)}
                  >
                    {EMERGENCY_TYPES.map((t) => (
                      <MenuItem key={t} value={t}>
                        {t}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.emergencyType && <FormHelperText>{errors.emergencyType}</FormHelperText>}
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Service Category</InputLabel>
                  <Select
                    value={serviceCategoryId}
                    label="Service Category"
                    onChange={(e: SelectChangeEvent<string>) => setServiceCategoryId(e.target.value)}
                  >
                    {serviceCategories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.title}
                      </MenuItem>
                    ))}
                  </Select>
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

                <TextField
                  label="Best callback time (e.g. Call me now, After 6PM)"
                  value={callbackTime}
                  onChange={(e) => setCallbackTime(e.target.value)}
                  fullWidth
                />
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={hasSafetyConcern}
                    onChange={(e) => setHasSafetyConcern(e.target.checked)}
                    sx={{ color: '#FF6B6B', '&.Mui-checked': { color: '#FF6B6B' } }}
                  />
                }
                label="There is smoke, burning smell, or gas present"
                sx={{ mt: 2, display: 'block' }}
              />

              {hasSafetyConcern && (
                <Alert severity="error" sx={{ mt: 1, borderRadius: '10px' }}>
                  STOP — If you smell gas or see smoke, evacuate immediately and call 911.
                </Alert>
              )}

              <Box sx={{ mt: 2 }}>
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
                    onChange={(e) => setApplianceStillRunning(e.target.value as 'yes' | 'no')}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Box>

              <TextField
                label="Describe the emergency *"
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                fullWidth
                multiline
                minRows={4}
                sx={{ mt: 3 }}
                error={Boolean(errors.issueDescription)}
                helperText={errors.issueDescription}
                placeholder="Provide as much detail as possible about what is happening..."
              />

              <Box sx={{ mt: 3 }}>
                <Button
                  component="label"
                  variant="outlined"
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    borderColor: '#FF6B6B',
                    color: '#FF6B6B',
                  }}
                >
                  Upload Photo / Video if safe (optional)
                  <input
                    type="file"
                    hidden
                    accept="image/* video/*"
                    onChange={handleImageChange}
                  />
                </Button>
                {imagePreviewUrl && (
                  <Box sx={{ mt: 2 }}>
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
                sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#CC2200', mb: 3 }}
              >
                Contact & Address
              </Typography>

              <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>
                Provide accurate contact details — our emergency team will call you immediately.
              </Alert>

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
                  label="Phone Number * (for emergency call)"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  fullWidth
                  error={Boolean(errors.phone)}
                  helperText={errors.phone}
                />
                <TextField
                  label="Email Address"
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

              <TextField
                label="Additional Notes (optional)"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                fullWidth
                multiline
                minRows={3}
                sx={{ mt: 3 }}
              />
            </Box>
          )}

          {/* Navigation */}
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
                backgroundColor: '#FF6B6B',
                color: '#FFFFFF',
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontWeight: 700,
                px: 4,
                borderRadius: '10px',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#CC2200' },
              }}
            >
              {activeStep < steps.length - 1 ? 'Continue' : 'Submit Emergency Request'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default EmergencyBookingPage;
