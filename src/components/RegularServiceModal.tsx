import React, { useEffect, useMemo, useState } from 'react';
import {
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
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BuildIcon from '@mui/icons-material/Build';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { serviceCategories, ServiceRequest } from '../data/services';
import { saveServiceRequest } from '../lib/firebase';

interface RegularServiceModalProps {
  open: boolean;
  onClose: () => void;
  initialCategoryId?: string;
  initialServiceTypeId?: string;
  onSubmitRequest: (request: ServiceRequest) => void;
}

const twoCol = { display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 };

const SectionLabel: React.FC<{ icon: React.ReactNode; title: string; first?: boolean }> = ({
  icon,
  title,
  first,
}) => (
  <Box sx={{ mt: first ? 0 : 3, mb: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
      <Box sx={{ color: '#22B1FB', display: 'flex' }}>{icon}</Box>
      <Typography
        sx={{
          fontFamily: 'DM Sans, Arial, sans-serif',
          fontWeight: 700,
          fontSize: '0.72rem',
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: '#022F49',
        }}
      >
        {title}
      </Typography>
    </Box>
    <Divider />
  </Box>
);

const RegularServiceModal: React.FC<RegularServiceModalProps> = ({
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
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
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setCity('');
      setState('');
      setZip('');
      setPreferredDate('');
      setPreferredTime('');
      setBrand('');
      setModel('');
      setDescription('');
      setImagePreviewUrl(null);
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
    if (!email.trim()) e.email = 'Email is required.';
    if (!phone.trim()) e.phone = 'Phone number is required.';
    if (!address.trim()) e.address = 'Address is required.';
    if (!city.trim()) e.city = 'City is required.';
    if (!state.trim()) e.state = 'State is required.';
    if (!zip.trim()) e.zip = 'ZIP code is required.';
    if (!preferredDate) e.preferredDate = 'Please choose a preferred date.';
    if (!preferredTime) e.preferredTime = 'Please choose a preferred time.';
    if (!description.trim()) e.description = 'Please describe the issue.';
    if (!consent) e.consent = 'Please accept before submitting.';
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
      servicePriority: 'regular',
      urgencyLevel: null,
      preferredDate,
      preferredTime,
      requestedResponseTime: `${preferredDate} ${preferredTime}`,
      issueDescription: description,
      applianceBrand: brand || null,
      applianceModel: model || null,
      imageUrl: imagePreviewUrl,
      notes: null,
      emergencyBadge: false,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await saveServiceRequest(request);
    } catch {
      // Firestore unavailable — data still saved to localStorage via App.tsx
    }

    onSubmitRequest(request);
    setIsLoading(false);
    setSubmitted(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': { borderRadius: '8px' },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        sx: {
          maxWidth: '720px',
          width: '100%',
          borderRadius: '16px',
          borderTop: '4px solid #22B1FB',
        },
      }}
    >
      <DialogTitle sx={{ px: 3, pt: 2.5, pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CalendarMonthIcon sx={{ color: '#22B1FB', fontSize: 26 }} />
            <Box>
              <Typography
                sx={{
                  fontFamily: 'Wasted Vindey, Arial, sans-serif',
                  fontWeight: 700,
                  fontSize: '1.3rem',
                  color: '#022F49',
                  lineHeight: 1.2,
                }}
              >
                Schedule Regular Service
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#666666', fontFamily: 'DM Sans, Arial, sans-serif', mt: 0.25 }}
              >
                Book an appointment at your preferred date and time.
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: '#888888' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ px: 3, py: 2.5 }}>
        {submitted ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <CheckCircleIcon sx={{ fontSize: 56, color: '#22B1FB', mb: 2 }} />
            <Typography
              sx={{
                fontFamily: 'Wasted Vindey, Arial, sans-serif',
                fontSize: '1.4rem',
                color: '#022F49',
                mb: 1,
              }}
            >
              Request Submitted
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#555555', fontFamily: 'DM Sans, Arial, sans-serif', lineHeight: 1.8 }}
            >
              Your regular service request has been submitted. We will contact you to confirm your
              appointment.
            </Typography>
            <Button
              onClick={onClose}
              variant="contained"
              sx={{
                mt: 4,
                backgroundColor: '#22B1FB',
                color: '#FFFFFF',
                textTransform: 'none',
                borderRadius: '10px',
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontWeight: 700,
                px: 5,
                '&:hover': { backgroundColor: '#022F49' },
              }}
            >
              Close
            </Button>
          </Box>
        ) : (
          <>
            {/* Service Details */}
            <SectionLabel icon={<BuildIcon sx={{ fontSize: 16 }} />} title="Service Details" first />
            <Box sx={twoCol}>
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

            {/* Contact Information */}
            <SectionLabel icon={<PersonIcon sx={{ fontSize: 16 }} />} title="Contact Information" />
            <Box sx={twoCol}>
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
              <TextField
                label="Phone Number *"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                size="small"
                fullWidth
                error={Boolean(errors.phone)}
                helperText={errors.phone}
                sx={fieldSx}
              />
            </Box>

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
                onChange={(e) => setZip(e.target.value)}
                size="small"
                fullWidth
                error={Boolean(errors.zip)}
                helperText={errors.zip}
                sx={fieldSx}
              />
            </Box>

            {/* Appointment */}
            <SectionLabel icon={<AccessTimeIcon sx={{ fontSize: 16 }} />} title="Appointment Preferences" />
            <Box sx={twoCol}>
              <TextField
                label="Preferred Date *"
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={Boolean(errors.preferredDate)}
                helperText={errors.preferredDate}
                sx={fieldSx}
              />
              <TextField
                label="Preferred Time *"
                type="time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={Boolean(errors.preferredTime)}
                helperText={errors.preferredTime}
                sx={fieldSx}
              />
            </Box>

            {/* Issue */}
            <SectionLabel icon={<BuildIcon sx={{ fontSize: 16 }} />} title="About the Issue" />
            <Box sx={{ ...twoCol, mb: 2 }}>
              <TextField
                label="Appliance Brand (optional)"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                size="small"
                fullWidth
                sx={fieldSx}
              />
              <TextField
                label="Appliance Model (optional)"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                size="small"
                fullWidth
                sx={fieldSx}
              />
            </Box>
            <TextField
              label="Describe the problem *"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              size="small"
              fullWidth
              multiline
              minRows={4}
              error={Boolean(errors.description)}
              helperText={errors.description}
              sx={{ ...fieldSx, mb: 2 }}
            />
            <Box>
              <Button
                component="label"
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  borderColor: '#D0D0D0',
                  color: '#444444',
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  '&:hover': { borderColor: '#22B1FB', color: '#22B1FB' },
                }}
              >
                Attach an image (optional)
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              </Button>
              {imagePreviewUrl && (
                <Box sx={{ mt: 1.5 }}>
                  <Box
                    component="img"
                    src={imagePreviewUrl}
                    alt="Preview"
                    sx={{ width: '100%', maxWidth: '200px', borderRadius: '8px', border: '1px solid #E5E5E5' }}
                  />
                </Box>
              )}
            </Box>

            {/* Consent + Submit */}
            <Divider sx={{ mt: 3, mb: 2 }} />
            <FormControlLabel
              control={
                <Checkbox
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  sx={{ color: errors.consent ? '#D32F2F' : undefined }}
                />
              }
              label={
                <Typography
                  variant="body2"
                  sx={{ color: errors.consent ? '#D32F2F' : '#555555', fontFamily: 'DM Sans, Arial, sans-serif' }}
                >
                  I understand that final pricing may depend on diagnosis and service availability.
                </Typography>
              }
            />
            {errors.consent && (
              <Typography variant="caption" sx={{ color: '#D32F2F', ml: 1.5 }}>
                {errors.consent}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                onClick={onClose}
                fullWidth
                variant="outlined"
                sx={{
                  borderColor: '#D0D0D0',
                  color: '#555555',
                  textTransform: 'none',
                  borderRadius: '10px',
                  fontFamily: 'DM Sans, Arial, sans-serif',
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
                  backgroundColor: '#22B1FB',
                  color: '#FFFFFF',
                  textTransform: 'none',
                  borderRadius: '10px',
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontWeight: 700,
                  py: 1.25,
                  fontSize: '0.95rem',
                  '&:hover': { backgroundColor: '#022F49' },
                  '&.Mui-disabled': { backgroundColor: '#BBDDEE' },
                }}
              >
                {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Submit Service Request'}
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RegularServiceModal;
