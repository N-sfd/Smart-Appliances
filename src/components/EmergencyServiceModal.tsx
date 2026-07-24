import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BuildIcon from '@mui/icons-material/Build';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { serviceCategories, ServiceRequest, urgencyOptions } from '../data/services';
import { validateZipCode, normalizeZipInput } from '../data/serviceAreas';
import { saveServiceRequest } from '../lib/firebase';

interface EmergencyServiceModalProps {
  open: boolean;
  onClose: () => void;
  initialCategoryId?: string;
  initialServiceTypeId?: string;
  onSubmitRequest: (request: ServiceRequest) => void;
}

const twoCol = { display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 };

// Warm amber — urgent but not aggressive
const EMERGENCY_COLOR = '#E07B00';
const EMERGENCY_BG = '#FFF8F0';
const EMERGENCY_BORDER = '#F0A030';

const SectionLabel: React.FC<{ icon: React.ReactNode; title: string; first?: boolean }> = ({
  icon,
  title,
  first,
}) => (
  <Box sx={{ mt: first ? 0 : 3, mb: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
      <Box sx={{ color: EMERGENCY_COLOR, display: 'flex' }}>{icon}</Box>
      <Typography
        sx={{
          fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
          fontWeight: 700,
          fontSize: '0.72rem',
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: '#0B3D91',
        }}
      >
        {title}
      </Typography>
    </Box>
    <Divider />
  </Box>
);

const EmergencyServiceModal: React.FC<EmergencyServiceModalProps> = ({
  open,
  onClose,
  initialCategoryId,
  initialServiceTypeId,
  onSubmitRequest,
}) => {
  const [categoryId, setCategoryId] = useState(initialCategoryId ?? serviceCategories[0].id);
  const [serviceTypeId, setServiceTypeId] = useState(
    initialServiceTypeId ?? serviceCategories[0].services[0].id,
  );
  const [urgencyLevel, setUrgencyLevel] = useState(urgencyOptions[0]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [description, setDescription] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedCategory = useMemo(
    () => serviceCategories.find((c) => c.id === categoryId) ?? serviceCategories[0],
    [categoryId],
  );

  useEffect(() => {
    if (open) {
      setCategoryId(initialCategoryId ?? serviceCategories[0].id);
      setServiceTypeId(
        initialServiceTypeId ??
          serviceCategories.find((c) => c.id === initialCategoryId)?.services[0].id ??
          serviceCategories[0].services[0].id,
      );
      setUrgencyLevel(urgencyOptions[0]);
      setName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setCity('');
      setState('');
      setZip('');
      setDescription('');
      setConsent(false);
      setErrors({});
      setIsLoading(false);
      setSubmitted(false);
    }
  }, [open, initialCategoryId, initialServiceTypeId]);

  useEffect(() => {
    const category = serviceCategories.find((c) => c.id === categoryId);
    if (category && !category.services.some((s) => s.id === serviceTypeId)) {
      setServiceTypeId(category.services[0].id);
    }
  }, [categoryId, serviceTypeId]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required.';
    else if (name.trim().length < 2) e.name = 'Full name must be at least 2 characters.';
    if (!phone.trim()) e.phone = 'Phone number is required for emergency service.';
    if (!email.trim()) e.email = 'Email is required.';
    if (!address.trim()) e.address = 'Address is required.';
    if (!city.trim()) e.city = 'City is required.';
    if (!state.trim()) e.state = 'State is required.';
    if (!zip.trim()) e.zip = 'ZIP code is required.';
    else {
      const zipResult = validateZipCode(zip);
      if (!zipResult.isValid) e.zip = zipResult.message ?? 'Enter a valid 5-digit ZIP code.';
    }
    if (!description.trim()) e.description = 'Please describe the emergency.';
    if (!urgencyLevel) e.urgencyLevel = 'Please select urgency level.';
    if (!consent) e.consent = 'Please confirm before submitting.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);

    const request: ServiceRequest = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      customerName: name,
      email,
      phone,
      address,
      city,
      state,
      zipCode: zip,
      serviceCategory: selectedCategory.title,
      serviceType: selectedCategory.services.find((s) => s.id === serviceTypeId)?.label ?? '',
      applianceType: null,
      servicePriority: 'emergency',
      urgencyLevel,
      priorityScore: 4,
      possibleIssue: null,
      recommendedTechnicianType: null,
      estimatedDuration: null,
      safetyNotes: 'Turn off the appliance immediately. If you smell gas or see smoke, evacuate and call 911.',
      hasSafetyConcern: true,
      applianceStillRunning: null,
      issueStartDate: null,
      preferredDate: null,
      preferredTime: null,
      timeWindow: null,
      requestedResponseTime: urgencyLevel,
      callbackTime: null,
      issueDescription: description,
      applianceBrand: null,
      applianceModel: null,
      imageUrl: null,
      notes: null,
      emergencyBadge: true,
      assignedTechnicianId: null,
      technicianStatus: null,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await saveServiceRequest(request);
      onSubmitRequest(request);
      setSubmitted(true);
    } catch (error) {
      console.error('Emergency booking error:', error);
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const fieldSx = { '& .MuiOutlinedInput-root': { borderRadius: '14px' } };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        sx: {
          maxWidth: '680px',
          width: '100%',
          borderRadius: '16px',
          borderTop: `4px solid ${EMERGENCY_BORDER}`,
        },
      }}
    >
      <DialogTitle sx={{ px: 3, pt: 2.5, pb: 1.5, backgroundColor: EMERGENCY_BG }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <WarningAmberIcon sx={{ color: EMERGENCY_COLOR, fontSize: 28 }} />
            <Box>
              <Typography
                sx={{
                  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: '1.3rem',
                  color: '#0B3D91',
                  lineHeight: 1.2,
                }}
              >
                Emergency Service Request
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#666666', fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", mt: 0.25 }}
              >
                Our team will prioritize and contact you as soon as possible.
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: '#888888' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider sx={{ borderColor: EMERGENCY_BORDER }} />

      <DialogContent sx={{ px: 3, py: 2.5 }}>
        {submitted ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <CheckCircleIcon sx={{ fontSize: 56, color: EMERGENCY_COLOR, mb: 2 }} />
            <Typography
              sx={{
                fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                fontSize: '1.4rem',
                color: '#0B3D91',
                mb: 1,
              }}
            >
              Emergency Request Received
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#1A1A1A', fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", lineHeight: 1.8 }}
            >
              Your emergency request has been received. Our team will contact you as soon as
              possible.
            </Typography>
            <Button
              onClick={onClose}
              variant="contained"
              sx={{
                mt: 4,
                backgroundColor: EMERGENCY_COLOR,
                color: '#FFFFFF',
                textTransform: 'none',
                borderRadius: '10px',
                fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                fontWeight: 700,
                px: 5,
                '&:hover': { backgroundColor: '#0B3D91' },
              }}
            >
              Close
            </Button>
          </Box>
        ) : (
          <>
            {/* Urgency notice */}
            <Alert
              icon={<WarningAmberIcon fontSize="small" />}
              severity="warning"
              sx={{
                mb: 3,
                borderRadius: '10px',
                backgroundColor: EMERGENCY_BG,
                border: `1px solid ${EMERGENCY_BORDER}`,
                color: '#7A4000',
                fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                fontSize: '0.85rem',
              }}
            >
              Emergency availability and pricing may vary. A technician will reach out to confirm
              service as quickly as possible.
            </Alert>

            {/* Emergency Details */}
            <SectionLabel
              icon={<ErrorOutlineIcon sx={{ fontSize: 16 }} />}
              title="Emergency Details"
              first
            />
            <Box sx={{ ...twoCol, mb: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Service Category</InputLabel>
                <Select
                  value={categoryId}
                  label="Service Category"
                  onChange={(e: SelectChangeEvent) => setCategoryId(e.target.value)}
                  sx={{ borderRadius: '8px' }}
                >
                  {serviceCategories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Service Type</InputLabel>
                <Select
                  value={serviceTypeId}
                  label="Service Type"
                  onChange={(e: SelectChangeEvent) => setServiceTypeId(e.target.value)}
                  sx={{ borderRadius: '8px' }}
                >
                  {selectedCategory.services.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <FormControl fullWidth size="small" error={Boolean(errors.urgencyLevel)}>
              <InputLabel>Urgency Level *</InputLabel>
              <Select
                value={urgencyLevel}
                label="Urgency Level *"
                onChange={(e: SelectChangeEvent) => setUrgencyLevel(e.target.value)}
                sx={{
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: EMERGENCY_BORDER },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: EMERGENCY_COLOR },
                }}
              >
                {urgencyOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
              {errors.urgencyLevel && (
                <Typography variant="caption" sx={{ color: '#D32F2F', mt: 0.5, ml: 1.5 }}>
                  {errors.urgencyLevel}
                </Typography>
              )}
            </FormControl>

            {/* Contact */}
            <SectionLabel icon={<PersonIcon sx={{ fontSize: 16 }} />} title="Your Contact Info" />
            <Box sx={{ ...twoCol, mb: 2 }}>
              <TextField
                label="Full Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                size="small"
                fullWidth
                error={Boolean(errors.name)}
                helperText={errors.name}
                sx={fieldSx}
              />
              <TextField
                label="Phone Number *"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                size="small"
                fullWidth
                error={Boolean(errors.phone)}
                helperText={errors.phone ?? 'Required — we will call you back'}
                sx={{
                  ...fieldSx,
                  '& .MuiOutlinedInput-root fieldset': { borderColor: EMERGENCY_BORDER },
                  '& .MuiOutlinedInput-root:hover fieldset': { borderColor: EMERGENCY_COLOR },
                }}
              />
            </Box>
            <TextField
              label="Email *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="small"
              fullWidth
              error={Boolean(errors.email)}
              helperText={errors.email}
              sx={fieldSx}
            />

            {/* Address */}
            <SectionLabel icon={<LocationOnIcon sx={{ fontSize: 16 }} />} title="Service Address" />
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr' }, gap: 2, mb: 2 }}>
              <TextField
                label="Street Address *"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                size="small"
                fullWidth
                error={Boolean(errors.address)}
                helperText={errors.address}
                sx={fieldSx}
              />
              <TextField
                label="City *"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                size="small"
                fullWidth
                error={Boolean(errors.city)}
                helperText={errors.city}
                sx={fieldSx}
              />
            </Box>
            <Box sx={twoCol}>
              <TextField
                label="State *"
                value={state}
                onChange={(e) => setState(e.target.value)}
                size="small"
                fullWidth
                error={Boolean(errors.state)}
                helperText={errors.state}
                sx={fieldSx}
              />
              <TextField
                label="ZIP Code *"
                value={zip}
                onChange={(e) => setZip(normalizeZipInput(e.target.value))}
                size="small"
                fullWidth
                error={Boolean(errors.zip)}
                helperText={errors.zip}
                sx={fieldSx}
              />
            </Box>

            {/* Issue description */}
            <SectionLabel
              icon={<BuildIcon sx={{ fontSize: 16 }} />}
              title="Describe the Emergency"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A1A1A' }}>
                What is happening? *
              </Typography>
              <Box
                component="textarea"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                placeholder="Describe the issue clearly — this helps dispatch the right technician quickly."
                sx={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '16px',
                  border: errors.description ? '1px solid #EF4444' : '1px solid #E4E7EB',
                  borderRadius: '16px',
                  fontSize: '16px',
                  lineHeight: 1.5,
                  color: '#1A1A1A',
                  backgroundColor: '#FFFFFF',
                  resize: 'vertical',
                  fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                  outline: 'none',
                  boxSizing: 'border-box',
                  '&:focus': { borderColor: '#EF4444', boxShadow: '0 0 0 4px rgba(239,68,68,0.12)' },
                  '&::placeholder': { color: '#9AA5B1' },
                }}
              />
              {errors.description && (
                <Typography sx={{ fontSize: '0.75rem', color: '#EF4444', mt: 0.25 }}>
                  {errors.description}
                </Typography>
              )}
            </Box>

            {/* Consent + Submit */}
            <Divider sx={{ mt: 3, mb: 2 }} />
            <FormControlLabel
              control={
                <Checkbox
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  sx={{ color: errors.consent ? '#D32F2F' : EMERGENCY_COLOR }}
                />
              }
              label={
                <Typography
                  variant="body2"
                  sx={{
                    color: errors.consent ? '#D32F2F' : '#1A1A1A',
                    fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                  }}
                >
                  I understand that emergency service availability and pricing may vary.
                </Typography>
              }
            />
            {errors.consent && (
              <Typography variant="caption" sx={{ color: '#D32F2F', ml: 1.5 }}>
                {errors.consent}
              </Typography>
            )}
            {errors.submit && (
              <Typography variant="body2" sx={{ color: '#D32F2F', mt: 1.5 }}>
                {errors.submit}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                onClick={onClose}
                fullWidth
                variant="outlined"
                sx={{
                  borderColor: '#D0D0D0',
                  color: '#1A1A1A',
                  textTransform: 'none',
                  borderRadius: '10px',
                  fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                  py: 1.25,
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  backgroundColor: EMERGENCY_COLOR,
                  color: '#FFFFFF',
                  textTransform: 'none',
                  borderRadius: '10px',
                  fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                  fontWeight: 700,
                  py: 1.25,
                  fontSize: '0.95rem',
                  '&:hover': { backgroundColor: '#0B3D91' },
                  '&.Mui-disabled': { backgroundColor: '#F5D5AA' },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  'Submit Emergency Request'
                )}
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyServiceModal;
