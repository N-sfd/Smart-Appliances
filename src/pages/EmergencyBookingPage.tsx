import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
  TextField,
  FormControl,
  FormLabel,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Card,
  CardContent,
  Alert,
  AlertTitle,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckIcon from '@mui/icons-material/Check';
import { serviceCategories, urgencyOptions, ServiceRequest } from '../data/services';
import { getServiceImage } from '../data/serviceImages';
import {
  normalizeZipInput,
  isValidUsZip,
  isInServiceArea,
  SERVICE_AREA_ZIP_HINT,
  type MetroServiceState,
} from '../data/serviceAreas';
import { getServiceAreaByZip } from '../utils/serviceAreas';
import { saveServiceRequest } from '../lib/firebase';

const US_STATE_OPTIONS: MetroServiceState[] = ['MD', 'VA', 'WV', 'PA', 'DE', 'DC'];

interface EmergencyBookingState {
  serviceCategory?: string;
  serviceType?: string;
}

const NAVY = '#0B3D91';
const RED = '#EF4444';
const RED_DARK = '#DC2626';
const PAGE_BG = '#F5F7FB';
const BORDER = '#E4E7EB';
const MUTED = '#64748B';

type YesNo = '' | 'Yes' | 'No';

const STEPS = [
  { num: 1, label: 'Emergency Details' },
  { num: 2, label: 'Contact Information' },
] as const;

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
  const [happeningNow, setHappeningNow] = useState<YesNo>('');
  const [activeHazard, setActiveHazard] = useState<YesNo>('');
  const [immediateDanger, setImmediateDanger] = useState<YesNo>('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState<MetroServiceState>('MD');
  const [zipCode, setZipCode] = useState('');
  const [zipTouched, setZipTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStepErrors, setShowStepErrors] = useState(false);

  const selectedCategory = serviceCategories.find((c) => c.id === categoryId) ?? serviceCategories[0];

  // ZIP is only required to be a valid 5-digit format to submit — being outside the
  // service area is a warning, not a submission blocker (see spec section 1).
  const zipFormatValid = isValidUsZip(zipCode);
  const zipInArea = zipFormatValid && isInServiceArea(zipCode);
  const zipShowFeedback = zipTouched || zipCode.length === 5;

  let zipStatusMessage = SERVICE_AREA_ZIP_HINT;
  let zipHasError = false;
  if (zipShowFeedback) {
    if (!zipCode.trim()) {
      zipStatusMessage = 'Please enter your ZIP code.';
      zipHasError = true;
    } else if (!zipFormatValid) {
      zipStatusMessage = 'Please enter a valid 5-digit ZIP code.';
      zipHasError = true;
    } else if (zipInArea) {
      zipStatusMessage = 'Great news — this ZIP is within our emergency service region.';
      zipHasError = false;
    } else {
      zipStatusMessage = 'This ZIP may be outside our current emergency service area. Please call us to confirm availability.';
      zipHasError = false;
    }
  }

  const descMissing = !issueDesc.trim();
  const ackMissing = !acknowledged;
  const step1Valid = !descMissing && !ackMissing;

  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    const cat = serviceCategories.find((c) => c.id === e.target.value) ?? serviceCategories[0];
    setCategoryId(cat.id);
    setServiceTypeId(cat.services[0].id);
  };

  const handleContinue = () => {
    if (!step1Valid) {
      setShowStepErrors(true);
      return;
    }
    setShowStepErrors(false);
    setStep(2);
  };

  const handleSubmit = async () => {
    setSubmitError('');
    setIsSubmitting(true);

    const newId = `req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const detectedServiceArea = getServiceAreaByZip(zipCode);
    const outsideServiceArea = zipFormatValid && !zipInArea;
    const triageNotes = [
      `Happening now: ${happeningNow || 'Not specified'}`,
      `Active water/smoke/sparks/burning smell: ${activeHazard || 'Not specified'}`,
      `Anyone in immediate danger: ${immediateDanger || 'Not specified'}`,
      `Acknowledged non-emergency-service notice: ${acknowledged ? 'Yes' : 'No'}`,
      // Fallback surface for outside-area flagging — the Supabase service_requests
      // table has no dedicated column for this yet, so it rides along in notes
      // (admin_notes-equivalent) in addition to the typed fields below.
      outsideServiceArea
        ? 'ZIP outside current emergency service area — confirm availability before dispatch.'
        : detectedServiceArea
        ? `Detected service area: ${detectedServiceArea}`
        : null,
    ]
      .filter(Boolean)
      .join(' | ');

    const request: ServiceRequest = {
      id: newId,
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
      applianceStillRunning: happeningNow === 'Yes' ? true : happeningNow === 'No' ? false : null,
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
      notes: triageNotes,
      emergencyBadge: true,
      assignedTechnicianId: null,
      technicianStatus: null,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      outsideServiceArea,
      detectedServiceArea,
    };

    try {
      await saveServiceRequest(request);
      setRequestId(newId);
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
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: PAGE_BG, py: 6 }}>
        <Container maxWidth="sm">
          <Card sx={{ borderRadius: '20px', border: `1px solid ${BORDER}`, boxShadow: '0 18px 40px rgba(10,37,64,0.10)', textAlign: 'center', p: { xs: 3, md: 4 } }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: '#16A34A', mb: 2 }} />
            <Typography variant="h5" sx={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontWeight: 800, color: NAVY, mb: 1 }}>
              Emergency Request Received
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#1A1A1A', mb: 2 }}>
              Our team will review your request and reach out as soon as possible.
            </Typography>
            {requestId ? (
              <Box sx={{ backgroundColor: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: '12px', py: 1.5, px: 2, mb: 2.5 }}>
                <Typography sx={{ fontSize: '0.8rem', color: MUTED, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Your request ID
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', monospace", fontWeight: 700, color: NAVY, fontSize: '1.05rem', wordBreak: 'break-all' }}>
                  {requestId}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: MUTED, mt: 0.5 }}>
                  Keep this ID to track your request.
                </Typography>
              </Box>
            ) : null}
            <Alert severity="error" sx={{ textAlign: 'left', borderRadius: '10px', mb: 3 }}>
              For life-threatening emergencies, call <strong>911</strong> immediately.
            </Alert>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/track-request')}
                sx={{ borderColor: NAVY, color: NAVY, fontWeight: 700, px: 3, py: 1.25, borderRadius: '10px', textTransform: 'none' }}
              >
                Track Request
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/')}
                sx={{ backgroundColor: NAVY, color: '#FFFFFF', fontWeight: 700, px: 3, py: 1.25, borderRadius: '10px', textTransform: 'none', '&:hover': { backgroundColor: '#092E6E' } }}
              >
                Back to Home
              </Button>
            </Box>
          </Card>
        </Container>
      </Box>
    );
  }

  const labelSx = { fontSize: '0.875rem', fontWeight: 700, color: NAVY, mb: 0.75 } as const;
  const helperSx = { fontSize: '0.8rem', color: MUTED, mb: 1 } as const;

  const TriageQuestion = ({
    legend,
    value,
    onChange,
    danger,
  }: {
    legend: string;
    value: YesNo;
    onChange: (v: YesNo) => void;
    danger?: boolean;
  }) => (
    <FormControl component="fieldset" sx={{ display: 'block' }}>
      <FormLabel component="legend" sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A1A1A', '&.Mui-focused': { color: NAVY } }}>
        {legend}
      </FormLabel>
      <RadioGroup row value={value} onChange={(e) => onChange(e.target.value as YesNo)} sx={{ mt: 0.5 }}>
        <FormControlLabel value="Yes" control={<Radio size="small" sx={{ color: danger ? RED : NAVY, '&.Mui-checked': { color: danger ? RED : NAVY } }} />} label="Yes" />
        <FormControlLabel value="No" control={<Radio size="small" sx={{ color: NAVY, '&.Mui-checked': { color: NAVY } }} />} label="No" />
      </RadioGroup>
    </FormControl>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: PAGE_BG,
        backgroundImage:
          'linear-gradient(180deg, rgba(245,247,251,0.62) 0%, rgba(245,247,251,0.80) 100%), url(/images/services/emergency-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="md" sx={{ maxWidth: { md: 980 } }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3, maxWidth: 680, mx: 'auto' }}>
          <Typography
            component="h1"
            sx={{
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
              fontWeight: 800,
              color: NAVY,
              fontSize: { xs: '2.15rem', md: '3rem' },
              lineHeight: 1.1,
              mb: 1,
            }}
          >
            Emergency Service Request
          </Typography>
          <Typography sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: MUTED, fontSize: { xs: '1rem', md: '1.15rem' } }}>
            For urgent home-service issues that need prompt attention.
          </Typography>
        </Box>

        {/* Critical safety alert */}
        <Alert
          severity="error"
          icon={<WarningAmberIcon />}
          sx={{
            maxWidth: 720,
            mx: 'auto',
            mb: 3,
            borderRadius: '12px',
            border: `1px solid ${RED}`,
            backgroundColor: '#FEF2F2',
            alignItems: 'flex-start',
            '& .MuiAlert-message': { textAlign: 'left' },
          }}
        >
          <AlertTitle sx={{ fontWeight: 800, color: RED_DARK, mb: 0.5 }}>Immediate danger?</AlertTitle>
          Call <strong>911</strong> immediately if you smell gas, see smoke or fire, notice electrical arcing, or believe
          anyone is in immediate danger.
          <Box component="span" sx={{ display: 'block', mt: 0.75, fontSize: '0.85rem', color: MUTED }}>
            Smart Appliances is not an emergency response service.
          </Box>
        </Alert>

        {/* Compact progress card */}
        <Card
          sx={{
            maxWidth: 820,
            mx: 'auto',
            mb: 3,
            borderRadius: '14px',
            border: `1px solid ${BORDER}`,
            boxShadow: '0 6px 18px rgba(10,37,64,0.06)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: { xs: 1.5, sm: 2.5 }, py: 2, px: { xs: 2, sm: 3 } }}>
            {STEPS.map((s, index) => {
              const isActive = step === s.num;
              const isComplete = step > s.num;
              const canNavigate = s.num === 1 || step1Valid;
              const onClick = () => {
                if (s.num === 1) {
                  setStep(1);
                } else {
                  handleContinue();
                }
              };
              return (
                <React.Fragment key={s.num}>
                  <Box
                    role="button"
                    tabIndex={0}
                    aria-label={`Step ${s.num}: ${s.label}`}
                    aria-current={isActive ? 'step' : undefined}
                    onClick={onClick}
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onClick();
                      }
                    }}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      cursor: 'pointer',
                      borderRadius: '10px',
                      p: 0.5,
                      outline: 'none',
                      opacity: canNavigate || isActive ? 1 : 0.6,
                      '&:focus-visible': { boxShadow: `0 0 0 3px rgba(11,61,145,0.3)` },
                    }}
                  >
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        backgroundColor: isActive ? RED : isComplete ? '#16A34A' : '#E4E7EB',
                        color: isActive || isComplete ? '#FFFFFF' : '#94A3B8',
                        transition: 'background-color 0.2s ease',
                      }}
                    >
                      {isComplete ? <CheckIcon sx={{ fontSize: 18 }} /> : s.num}
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                        fontWeight: isActive ? 800 : 600,
                        fontSize: { xs: '0.8rem', sm: '0.9rem' },
                        color: isActive ? RED : isComplete ? '#16A34A' : MUTED,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {s.label}
                    </Typography>
                  </Box>
                  {index < STEPS.length - 1 && (
                    <Box
                      sx={{
                        width: { xs: 28, sm: 56 },
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: step > s.num ? '#16A34A' : '#E4E7EB',
                        transition: 'background-color 0.2s ease',
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </Box>
        </Card>

        {/* Intake card */}
        <Card sx={{ maxWidth: 820, mx: 'auto', borderRadius: '18px', border: `1px solid ${BORDER}`, boxShadow: '0 18px 40px rgba(10,37,64,0.08)', backgroundColor: '#FFFFFF' }}>
          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            {step === 1 && (
              <Box>
                <Typography sx={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontWeight: 800, color: NAVY, fontSize: '1.4rem', mb: 0.5 }}>
                  Tell us what happened
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: MUTED, fontSize: '0.95rem', mb: 3 }}>
                  Provide enough detail so our team can understand the urgency and determine the appropriate next step.
                </Typography>

                {/* Dynamic service image banner */}
                {(() => {
                  const info = getServiceImage(serviceTypeId, categoryId);
                  return (
                    <Box sx={{ mb: 3, borderRadius: '14px', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
                      <Box component="img" src={info.image} alt={info.title} sx={{ width: '100%', height: 150, objectFit: 'cover', display: 'block' }} />
                      <Box sx={{ p: '12px 16px', backgroundColor: PAGE_BG }}>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: NAVY, lineHeight: 1.2 }}>{info.title}</Typography>
                        <Typography sx={{ fontSize: '0.85rem', color: MUTED, mt: '2px', lineHeight: 1.5 }}>{info.desc}</Typography>
                      </Box>
                    </Box>
                  );
                })()}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
                    <Typography sx={labelSx}>Urgency Level *</Typography>
                    <FormControl fullWidth>
                      <Select value={urgencyLevel} onChange={(e: SelectChangeEvent<string>) => setUrgencyLevel(e.target.value)}>
                        {urgencyOptions.map((opt) => (
                          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <Box>
                      <Typography sx={labelSx}>Emergency Category *</Typography>
                      <FormControl fullWidth>
                        <Select value={categoryId} onChange={handleCategoryChange}>
                          {serviceCategories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>{cat.title}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    <Box>
                      <Typography sx={labelSx}>Specific Issue *</Typography>
                      <FormControl fullWidth>
                        <Select value={serviceTypeId} onChange={(e: SelectChangeEvent<string>) => setServiceTypeId(e.target.value)}>
                          {selectedCategory.services.map((s) => (
                            <MenuItem key={s.id} value={s.id}>{s.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>

                  <Box>
                    <Typography component="label" htmlFor="emergency-desc" sx={labelSx}>
                      Describe the urgent issue *
                    </Typography>
                    <Typography sx={helperSx}>Include what you see, hear, smell, or what stopped working.</Typography>
                    <Box
                      id="emergency-desc"
                      component="textarea"
                      value={issueDesc}
                      aria-describedby="emergency-desc-error"
                      aria-invalid={showStepErrors && descMissing}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setIssueDesc(e.target.value)}
                      placeholder="Example: Water is leaking under the kitchen sink and spreading across the floor."
                      sx={{
                        width: '100%',
                        minHeight: '150px',
                        padding: '14px 16px',
                        border: `1px solid ${showStepErrors && descMissing ? RED : BORDER}`,
                        borderRadius: '12px',
                        fontSize: '16px',
                        lineHeight: 1.5,
                        color: '#1A1A1A',
                        backgroundColor: '#FFFFFF',
                        resize: 'vertical',
                        fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                        outline: 'none',
                        boxSizing: 'border-box',
                        '&:focus': { borderColor: NAVY, boxShadow: `0 0 0 4px rgba(11,61,145,0.12)` },
                        '&::placeholder': { color: '#9AA5B1' },
                      }}
                    />
                    {showStepErrors && descMissing ? (
                      <Typography id="emergency-desc-error" role="alert" sx={{ color: RED_DARK, fontSize: '0.8rem', mt: 0.75, fontWeight: 600 }}>
                        Please describe the urgent issue before continuing.
                      </Typography>
                    ) : null}
                  </Box>

                  {/* Urgency triage */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2, borderRadius: '12px', backgroundColor: PAGE_BG, border: `1px solid ${BORDER}` }}>
                    <TriageQuestion legend="Is the issue happening right now?" value={happeningNow} onChange={setHappeningNow} />
                    <TriageQuestion legend="Is there active water, smoke, sparks, or a burning smell?" value={activeHazard} onChange={setActiveHazard} danger />
                    <TriageQuestion legend="Is anyone in immediate danger?" value={immediateDanger} onChange={setImmediateDanger} danger />
                  </Box>

                  {immediateDanger === 'Yes' ? (
                    <Alert severity="error" sx={{ borderRadius: '12px', border: `1px solid ${RED}` }}>
                      <AlertTitle sx={{ fontWeight: 800 }}>Please call 911 now</AlertTitle>
                      If anyone is in immediate danger, call <strong>911</strong> right away. Smart Appliances cannot
                      respond to life-threatening emergencies.
                    </Alert>
                  ) : null}

                  <Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={acknowledged}
                          onChange={(e) => setAcknowledged(e.target.checked)}
                          sx={{ color: showStepErrors && ackMissing ? RED : NAVY, '&.Mui-checked': { color: NAVY } }}
                        />
                      }
                      label={
                        <Typography sx={{ fontSize: '0.9rem', color: '#1A1A1A' }}>
                          I understand Smart Appliances is not an emergency response service.
                        </Typography>
                      }
                    />
                    {showStepErrors && ackMissing ? (
                      <Typography role="alert" sx={{ color: RED_DARK, fontSize: '0.8rem', fontWeight: 600, ml: 0.5 }}>
                        Please acknowledge this notice before continuing.
                      </Typography>
                    ) : null}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, justifyContent: 'space-between', gap: 1.5, mt: 4 }}>
                  <Button
                    onClick={() => navigate('/services')}
                    variant="outlined"
                    fullWidth
                    sx={{ borderColor: NAVY, color: NAVY, textTransform: 'none', borderRadius: '10px', px: 3, py: 1.35, fontWeight: 700, maxWidth: { sm: 220 } }}
                  >
                    Back to Services
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleContinue}
                    fullWidth
                    sx={{
                      backgroundColor: RED,
                      color: '#FFFFFF',
                      fontWeight: 700,
                      px: 3,
                      py: 1.35,
                      borderRadius: '10px',
                      textTransform: 'none',
                      maxWidth: { sm: 320 },
                      '&:hover': { backgroundColor: RED_DARK },
                    }}
                  >
                    Continue to Contact Information
                  </Button>
                </Box>
              </Box>
            )}

            {step === 2 && (
              <Box>
                <Typography sx={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontWeight: 800, color: NAVY, fontSize: '1.4rem', mb: 0.5 }}>
                  Contact information
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: MUTED, fontSize: '0.95rem', mb: 3 }}>
                  Share how to reach you and where the issue is located so our team can respond quickly.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
                  <TextField label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth required />
                  <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
                  <TextField label="Street Address" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth required />
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
                    <TextField label="City" value={city} onChange={(e) => setCity(e.target.value)} fullWidth />
                    <FormControl fullWidth>
                      <InputLabel id="emergency-state-label">State</InputLabel>
                      <Select
                        labelId="emergency-state-label"
                        label="State"
                        value={stateVal}
                        onChange={(e: SelectChangeEvent<string>) => setStateVal(e.target.value as MetroServiceState)}
                      >
                        {US_STATE_OPTIONS.map((abbr) => (
                          <MenuItem key={abbr} value={abbr}>{abbr}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label="ZIP Code"
                      value={zipCode}
                      onChange={(e) => setZipCode(normalizeZipInput(e.target.value))}
                      onBlur={() => setZipTouched(true)}
                      inputProps={{ inputMode: 'numeric', maxLength: 5 }}
                      error={zipHasError}
                      fullWidth
                      required
                    />
                  </Box>
                  <Typography
                    role={zipHasError ? 'alert' : undefined}
                    sx={{
                      mt: -1.5,
                      fontSize: '0.8rem',
                      fontWeight: zipShowFeedback ? 600 : 400,
                      color: zipHasError ? RED_DARK : zipShowFeedback && zipFormatValid && !zipInArea ? '#B45309' : MUTED,
                    }}
                  >
                    {zipStatusMessage}
                  </Typography>
                </Box>
                {submitError ? (
                  <Alert severity="error" sx={{ mt: 2, borderRadius: '10px' }}>{submitError}</Alert>
                ) : null}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, justifyContent: 'space-between', gap: 1.5, mt: 4 }}>
                  <Button
                    onClick={() => setStep(1)}
                    variant="outlined"
                    fullWidth
                    sx={{ borderColor: NAVY, color: NAVY, textTransform: 'none', borderRadius: '10px', px: 3, py: 1.35, fontWeight: 700, maxWidth: { sm: 200 } }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!name || !phone || !email || !address || !zipFormatValid || isSubmitting}
                    onClick={handleSubmit}
                    fullWidth
                    startIcon={isSubmitting ? <CircularProgress size={18} sx={{ color: '#FFFFFF' }} /> : undefined}
                    sx={{
                      backgroundColor: RED,
                      color: '#FFFFFF',
                      fontWeight: 700,
                      px: 3,
                      py: 1.35,
                      borderRadius: '10px',
                      textTransform: 'none',
                      maxWidth: { sm: 320 },
                      '&:hover': { backgroundColor: RED_DARK },
                      '&.Mui-disabled': { backgroundColor: '#F2A9A9', color: '#FFFFFF' },
                    }}
                  >
                    {isSubmitting ? 'Submitting Request…' : 'Submit Emergency Request'}
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Response expectation note */}
        <Box sx={{ maxWidth: 820, mx: 'auto', mt: 3, px: 1, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.85rem', color: MUTED, lineHeight: 1.6 }}>
            Submitting this form does not guarantee immediate dispatch. Availability depends on service area, technician
            availability, and the nature of the issue. After submission, you will receive a request ID for tracking.
            Same-day or emergency priority fees may apply.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default EmergencyBookingPage;
