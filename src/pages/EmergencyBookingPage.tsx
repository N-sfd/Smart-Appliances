import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { serviceCategories, urgencyOptions, ServiceRequest } from '../data/services';
import { getServiceImage } from '../data/serviceImages';
import {
  normalizeZipInput,
  validateZipCode,
  getZipFieldHelperText,
  isZipFieldError,
} from '../data/serviceAreas';
import { saveServiceRequest } from '../lib/firebase';

interface EmergencyBookingState {
  serviceCategory?: string;
  serviceType?: string;
}

const EmergencyBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = (location.state as EmergencyBookingState | null) ?? {};

  const initCategory = serviceCategories.find((c) => c.id === prefill.serviceCategory) ?? serviceCategories[0];
  const initServiceId =
    initCategory.services.find((s) => s.id === prefill.serviceType)?.id ?? initCategory.services[0].id;

  const [step, setStep] = useState(1);
  const [categoryId, setCategoryId] = useState(initCategory.id);
  const [serviceTypeId, setServiceTypeId] = useState(initServiceId);
  const [urgencyLevel, setUrgencyLevel] = useState(urgencyOptions[0]);
  const [issueDesc, setIssueDesc] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [zipTouched, setZipTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCategory = serviceCategories.find((c) => c.id === categoryId) ?? serviceCategories[0];
  const zipValidation = validateZipCode(zipCode);

  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    const cat = serviceCategories.find((c) => c.id === e.target.value) ?? serviceCategories[0];
    setCategoryId(cat.id);
    setServiceTypeId(cat.services[0].id);
  };

  const handleSubmit = async () => {
    setSubmitError('');
    setIsSubmitting(true);

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
      serviceType: selectedCategory.services.find((s) => s.id === serviceTypeId)?.label ?? serviceTypeId,
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
      issueDescription: issueDesc,
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
      setSubmitted(true);
    } catch (error) {
      console.error('Emergency booking error:', error);
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF8F8', py: 6 }}>
        <Container maxWidth="sm">
          <Card sx={{ borderRadius: '20px', border: '2px solid #EF4444', boxShadow: 'none', textAlign: 'center', p: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 72, color: '#EF4444', mb: 2 }} />
            <Typography variant="h4" sx={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", color: '#0B3D91', mb: 1.5 }}>
              Emergency Request Sent!
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#1A1A1A', mb: 1.5 }}>
              Your emergency request has been received. Our team will contact you within minutes.
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#EA580C', fontWeight: 600, mb: 3 }}>
              For life-threatening emergencies, call 911 immediately.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: '10px',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#EA580C' },
              }}
            >
              Back to Home
            </Button>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FFF8F8', py: 6 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <WarningAmberIcon sx={{ fontSize: 52, color: '#EF4444', mb: 2 }} />
          <Typography
            variant="h3"
            sx={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", color: '#0B3D91', mb: 1 }}
          >
            Emergency Service Request
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#666666', mb: 2 }}>
            For urgent issues that require immediate attention.
          </Typography>
          <Alert
            severity="error"
            icon={<WarningAmberIcon />}
            sx={{ borderRadius: '10px', backgroundColor: '#FFEBEE', border: '1px solid #FFCDD2', maxWidth: '500px', margin: '0 auto' }}
          >
            If you smell gas, see smoke, or have a life-threatening emergency — call 911 immediately.
          </Alert>
        </Box>

        {/* Step indicators */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 5 }}>
          {[1, 2].map((s) => (
            <Box
              key={s}
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: step >= s ? '#EF4444' : '#E4E7EB',
                color: step >= s ? '#FFFFFF' : '#999999',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                fontWeight: 700,
                fontSize: '0.9rem',
                transition: 'background-color 0.3s',
              }}
            >
              {s}
            </Box>
          ))}
        </Box>

        <Card sx={{ borderRadius: '20px', border: '2px solid #FFE5E5', boxShadow: 'none', backgroundColor: '#FFFFFF' }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            {step === 1 && (
              <Box>
                <Typography variant="h5" sx={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", color: '#0B3D91', mb: 3 }}>
                  Step 1: Describe Your Emergency
                </Typography>

                {/* Dynamic service image banner */}
                {(() => {
                  const info = getServiceImage(serviceTypeId, categoryId);
                  return (
                    <Box sx={{ mb: 3, borderRadius: '20px', border: '2px solid #FFE5E5', overflow: 'hidden', boxShadow: '0 12px 30px rgba(239,68,68,0.08)', transition: 'all 0.3s ease' }}>
                      <Box component="img" src={info.image} alt={info.title} sx={{ width: '100%', height: 200, objectFit: 'cover', display: 'block', transition: 'opacity 0.3s ease' }} />
                      <Box sx={{ p: '16px 18px', backgroundColor: '#FFF8F8' }}>
                        <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#0B3D91', lineHeight: 1.2 }}>{info.title}</Typography>
                        <Typography sx={{ fontSize: '14px', color: '#64748B', mt: '4px', lineHeight: 1.5 }}>{info.desc}</Typography>
                      </Box>
                    </Box>
                  );
                })()}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Urgency Level *</InputLabel>
                    <Select
                      value={urgencyLevel}
                      onChange={(e: SelectChangeEvent<string>) => setUrgencyLevel(e.target.value)}
                      label="Urgency Level *"
                    >
                      {urgencyOptions.map((opt) => (
                        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Service Category</InputLabel>
                    <Select value={categoryId} onChange={handleCategoryChange} label="Service Category">
                      {serviceCategories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>{cat.title}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Specific Issue</InputLabel>
                    <Select
                      value={serviceTypeId}
                      onChange={(e: SelectChangeEvent<string>) => setServiceTypeId(e.target.value)}
                      label="Specific Issue"
                    >
                      {selectedCategory.services.map((s) => (
                        <MenuItem key={s.id} value={s.id}>{s.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A1A1A' }}>
                      Describe the Emergency *
                    </Typography>
                    <Box
                      component="textarea"
                      value={issueDesc}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setIssueDesc(e.target.value)}
                      placeholder="Please describe what's happening in as much detail as possible."
                      sx={{
                        width: '100%',
                        minHeight: '120px',
                        padding: '16px',
                        border: '1px solid #E4E7EB',
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
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                  <Button
                    variant="contained"
                    disabled={!issueDesc.trim()}
                    onClick={() => setStep(2)}
                    sx={{
                      backgroundColor: '#EF4444',
                      color: '#FFFFFF',
                      fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                      fontWeight: 700,
                      px: 4,
                      py: 1.5,
                      borderRadius: '10px',
                      textTransform: 'none',
                      '&:hover': { backgroundColor: '#EA580C' },
                    }}
                  >
                    Next: Contact Info
                  </Button>
                </Box>
              </Box>
            )}

            {step === 2 && (
              <Box>
                <Typography variant="h5" sx={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", color: '#0B3D91', mb: 3 }}>
                  Step 2: Your Contact & Location
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField label="Full Name *" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
                  <TextField label="Phone *" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth required />
                  <TextField label="Email *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
                  <TextField label="Street Address *" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth required />
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                    <TextField label="City" value={city} onChange={(e) => setCity(e.target.value)} fullWidth />
                    <TextField label="State" value={stateVal} onChange={(e) => setStateVal(e.target.value)} fullWidth />
                    <TextField
                      label="ZIP Code *"
                      value={zipCode}
                      onChange={(e) => setZipCode(normalizeZipInput(e.target.value))}
                      onBlur={() => setZipTouched(true)}
                      inputProps={{ inputMode: 'numeric', maxLength: 5 }}
                      error={isZipFieldError(zipCode, zipTouched || zipCode.length === 5)}
                      helperText={getZipFieldHelperText(zipCode, zipTouched || zipCode.length === 5)}
                      fullWidth
                      required
                    />
                  </Box>
                </Box>
                {submitError ? (
                  <Alert severity="error" sx={{ mt: 2 }}>{submitError}</Alert>
                ) : null}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button onClick={() => setStep(1)} variant="outlined" sx={{ borderColor: '#0B3D91', color: '#0B3D91', textTransform: 'none', borderRadius: '10px', px: 3, py: 1.25 }}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!name || !phone || !email || !address || !zipValidation.isValid || isSubmitting}
                    onClick={handleSubmit}
                    sx={{
                      backgroundColor: '#EF4444',
                      color: '#FFFFFF',
                      fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                      fontWeight: 700,
                      px: 4,
                      py: 1.5,
                      borderRadius: '10px',
                      textTransform: 'none',
                      '&:hover': { backgroundColor: '#EA580C' },
                    }}
                  >
                    {isSubmitting ? 'Submitting…' : 'Submit Emergency Request'}
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default EmergencyBookingPage;
