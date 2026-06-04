import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { serviceCategories, ServiceRequest } from '../data/services';

const STORAGE_KEY = 'smart-appliances-service-requests';

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

const RegularBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [categoryId, setCategoryId] = useState(serviceCategories[0].id);
  const [serviceTypeId, setServiceTypeId] = useState(serviceCategories[0].services[0].id);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [issueDesc, setIssueDesc] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const selectedCategory = serviceCategories.find((c) => c.id === categoryId) ?? serviceCategories[0];

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
      serviceType: selectedCategory.services.find((s) => s.id === serviceTypeId)?.label ?? serviceTypeId,
      servicePriority: 'regular',
      urgencyLevel: null,
      preferredDate,
      preferredTime,
      requestedResponseTime: preferredDate ? `${preferredDate} ${preferredTime}`.trim() : null,
      issueDescription: issueDesc,
      applianceBrand: brand || null,
      applianceModel: model || null,
      imageUrl: null,
      notes: null,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveRequest(request);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F7F9', py: 6 }}>
        <Container maxWidth="sm">
          <Card sx={{ borderRadius: '20px', border: '1px solid #E5E5E5', boxShadow: 'none', textAlign: 'center', p: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 72, color: '#22B1FB', mb: 2 }} />
            <Typography variant="h4" sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#022F49', mb: 1.5 }}>
              Booking Submitted!
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#555555', mb: 3 }}>
              Thank you, {name}. We'll contact you within 2 hours to confirm your service appointment.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
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
              Back to Home
            </Button>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F5F7F9', py: 6 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <CalendarMonthIcon sx={{ fontSize: 52, color: '#22B1FB', mb: 2 }} />
          <Typography
            variant="h3"
            sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#022F49', mb: 1 }}
          >
            Book Regular Service
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#666666' }}>
            Schedule a non-urgent appliance repair or home service appointment.
          </Typography>
        </Box>

        {/* Step indicators */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 5 }}>
          {[1, 2, 3].map((s) => (
            <Box
              key={s}
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: step >= s ? '#22B1FB' : '#E5E5E5',
                color: step >= s ? '#FFFFFF' : '#999999',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontWeight: 700,
                fontSize: '0.9rem',
                transition: 'background-color 0.3s',
              }}
            >
              {s}
            </Box>
          ))}
        </Box>

        <Card sx={{ borderRadius: '20px', border: '1px solid #E5E5E5', boxShadow: 'none', backgroundColor: '#FFFFFF' }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            {step === 1 && (
              <Box>
                <Typography variant="h5" sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#022F49', mb: 3 }}>
                  Step 1: Choose Your Service
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Service Category</InputLabel>
                    <Select value={categoryId} onChange={handleCategoryChange} label="Service Category">
                      {serviceCategories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>{cat.title}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Specific Service</InputLabel>
                    <Select
                      value={serviceTypeId}
                      onChange={(e: SelectChangeEvent<string>) => setServiceTypeId(e.target.value)}
                      label="Specific Service"
                    >
                      {selectedCategory.services.map((s) => (
                        <MenuItem key={s.id} value={s.id}>{s.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField label="Appliance Brand (optional)" value={brand} onChange={(e) => setBrand(e.target.value)} fullWidth />
                  <TextField label="Appliance Model (optional)" value={model} onChange={(e) => setModel(e.target.value)} fullWidth />
                  <TextField
                    label="Describe the Issue *"
                    value={issueDesc}
                    onChange={(e) => setIssueDesc(e.target.value)}
                    fullWidth
                    multiline
                    minRows={4}
                    required
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                  <Button
                    variant="contained"
                    disabled={!issueDesc.trim()}
                    onClick={() => setStep(2)}
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
                    Next: Contact Info
                  </Button>
                </Box>
              </Box>
            )}

            {step === 2 && (
              <Box>
                <Typography variant="h5" sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#022F49', mb: 3 }}>
                  Step 2: Your Contact Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField label="Full Name *" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
                  <TextField label="Email *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
                  <TextField label="Phone *" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth required />
                  <TextField label="Street Address" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth />
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                    <TextField label="City" value={city} onChange={(e) => setCity(e.target.value)} fullWidth />
                    <TextField label="State" value={stateVal} onChange={(e) => setStateVal(e.target.value)} fullWidth />
                    <TextField label="ZIP Code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} fullWidth />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button onClick={() => setStep(1)} variant="outlined" sx={{ borderColor: '#022F49', color: '#022F49', textTransform: 'none', borderRadius: '10px', px: 3, py: 1.25 }}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!name || !email || !phone}
                    onClick={() => setStep(3)}
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
                    Next: Scheduling
                  </Button>
                </Box>
              </Box>
            )}

            {step === 3 && (
              <Box>
                <Typography variant="h5" sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#022F49', mb: 3 }}>
                  Step 3: Preferred Schedule
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField
                    label="Preferred Date"
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  <FormControl fullWidth>
                    <InputLabel>Preferred Time</InputLabel>
                    <Select
                      value={preferredTime}
                      onChange={(e: SelectChangeEvent<string>) => setPreferredTime(e.target.value)}
                      label="Preferred Time"
                    >
                      {['Morning (8AM–12PM)', 'Afternoon (12PM–4PM)', 'Evening (4PM–6PM)', 'Flexible'].map((t) => (
                        <MenuItem key={t} value={t}>{t}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button onClick={() => setStep(2)} variant="outlined" sx={{ borderColor: '#022F49', color: '#022F49', textTransform: 'none', borderRadius: '10px', px: 3, py: 1.25 }}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
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
                    Submit Booking
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

export default RegularBookingPage;
