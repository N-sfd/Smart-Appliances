import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
  Checkbox,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { issueSeverityOptions, serviceCategories, ServicePriority, ServiceRequest, urgencyOptions } from '../data/services';

interface BookingDialogProps {
  open: boolean;
  onClose: () => void;
  initialPriority: ServicePriority;
  initialCategoryId?: string;
  initialServiceTypeId?: string;
  onSubmitRequest: (request: ServiceRequest) => void;
}

const BookingDialog: React.FC<BookingDialogProps> = ({
  open,
  onClose,
  initialPriority,
  initialCategoryId,
  initialServiceTypeId,
  onSubmitRequest,
}) => {
  const [servicePriority, setServicePriority] = useState<ServicePriority>(initialPriority);
  const [serviceCategoryId, setServiceCategoryId] = useState<string>(initialCategoryId ?? serviceCategories[0].id);
  const [serviceTypeId, setServiceTypeId] = useState<string>(initialServiceTypeId ?? serviceCategories[0].services[0].id);
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateValue, setStateValue] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [applianceBrand, setApplianceBrand] = useState('');
  const [applianceModel, setApplianceModel] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState(urgencyOptions[0]);
  const [issueSeverity, setIssueSeverity] = useState(issueSeverityOptions[0]);
  const [consentChecked, setConsentChecked] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const selectedCategory = useMemo(
    () => serviceCategories.find((c) => c.id === serviceCategoryId) ?? serviceCategories[0],
    [serviceCategoryId],
  );

  useEffect(() => {
    if (open) {
      setServicePriority(initialPriority);
      setServiceCategoryId(initialCategoryId ?? serviceCategories[0].id);
      setServiceTypeId(
        initialServiceTypeId ??
          (serviceCategories.find((c) => c.id === initialCategoryId)?.services[0].id ??
            serviceCategories[0].services[0].id),
      );
      setCustomerName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setCity('');
      setStateValue('');
      setZipCode('');
      setApplianceBrand('');
      setApplianceModel('');
      setIssueDescription('');
      setPreferredDate('');
      setPreferredTime('');
      setUrgencyLevel(urgencyOptions[0]);
      setIssueSeverity(issueSeverityOptions[0]);
      setConsentChecked(false);
      setImagePreviewUrl(null);
      setErrorMessage('');
      setConfirmationMessage('');
    }
  }, [open, initialCategoryId, initialPriority, initialServiceTypeId]);

  useEffect(() => {
    if (serviceCategoryId) {
      const category = serviceCategories.find((c) => c.id === serviceCategoryId);
      if (category) {
        setServiceTypeId((current) =>
          category.services.some((s) => s.id === current) ? current : category.services[0].id,
        );
      }
    }
  }, [serviceCategoryId]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl(null);
    }
  };

  const handleSubmit = () => {
    setErrorMessage('');
    if (!customerName || !email || !phone || !address || !city || !stateValue || !zipCode || !issueDescription) {
      setErrorMessage('Please complete all required contact and request fields.');
      return;
    }
    if (servicePriority === 'regular' && (!preferredDate || !preferredTime)) {
      setErrorMessage('Please choose a preferred date and time for regular service.');
      return;
    }
    if (servicePriority === 'emergency' && !urgencyLevel) {
      setErrorMessage('Please select the emergency urgency level.');
      return;
    }
    if (!consentChecked) {
      setErrorMessage('Please confirm that you understand final pricing may depend on diagnosis and availability.');
      return;
    }

    const requestedResponseTime =
      servicePriority === 'emergency'
        ? urgencyLevel
        : preferredDate && preferredTime
        ? `${preferredDate} ${preferredTime}`
        : null;

    const newRequest: ServiceRequest = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      customerName,
      email,
      phone,
      address,
      city,
      state: stateValue,
      zipCode,
      serviceCategory: selectedCategory.title,
      serviceType: selectedCategory.services.find((s) => s.id === serviceTypeId)?.label ?? '',
      servicePriority,
      urgencyLevel: servicePriority === 'emergency' ? urgencyLevel : null,
      preferredDate: servicePriority === 'regular' ? preferredDate : null,
      preferredTime: servicePriority === 'regular' ? preferredTime : null,
      requestedResponseTime,
      issueDescription,
      applianceBrand: applianceBrand || null,
      applianceModel: applianceModel || null,
      imageUrl: imagePreviewUrl ?? null,
      notes: null,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Extended fields
      applianceType: null,
      issueStartDate: null,
      timeWindow: servicePriority === 'regular' ? preferredTime : null,
      priorityScore: servicePriority === 'emergency' ? 4 : 2,
      possibleIssue: null,
      recommendedTechnicianType: null,
      estimatedDuration: null,
      safetyNotes: null,
      hasSafetyConcern: false,
      applianceStillRunning: null,
      callbackTime: null,
      assignedTechnicianId: null,
      technicianStatus: null,
    };

    onSubmitRequest(newRequest);

    setConfirmationMessage(
      servicePriority === 'emergency'
        ? 'Emergency request received. Our team will contact you as soon as possible.'
        : 'Your service request has been submitted. We will confirm your appointment soon.',
    );
  };

  const serviceTypeOptions = useMemo(() => selectedCategory.services, [selectedCategory.services]);

  const isEmergency = servicePriority === 'emergency';

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: isEmergency ? '#FFF8F8' : '#F8FBFF',
          borderBottom: `3px solid ${isEmergency ? '#FF6B6B' : '#22B1FB'}`,
          pb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {isEmergency ? (
            <WarningAmberIcon sx={{ color: '#FF6B6B', fontSize: 28 }} />
          ) : (
            <CalendarTodayIcon sx={{ color: '#22B1FB', fontSize: 26 }} />
          )}
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'Wasted Vindey, Arial, sans-serif',
              color: isEmergency ? '#CC2200' : '#022F49',
              fontWeight: 700,
            }}
          >
            {isEmergency ? 'Emergency Service Request' : 'Schedule Regular Service'}
          </Typography>
        </Box>
        <Button
          onClick={onClose}
          startIcon={<CloseIcon />}
          sx={{ color: '#555555', textTransform: 'none', fontFamily: 'DM Sans, Arial, sans-serif' }}
        >
          Close
        </Button>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {/* Priority selector cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
          <Box
            onClick={() => setServicePriority('regular')}
            sx={{
              border: `2px solid ${servicePriority === 'regular' ? '#22B1FB' : '#E5E5E5'}`,
              borderRadius: '14px',
              p: 2,
              cursor: 'pointer',
              backgroundColor: servicePriority === 'regular' ? '#EBF8FF' : '#FAFAFA',
              transition: 'all 0.2s ease',
              '&:hover': { borderColor: '#22B1FB', backgroundColor: '#EBF8FF' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <CalendarTodayIcon sx={{ color: '#22B1FB', fontSize: 20 }} />
              <Typography
                variant="subtitle1"
                sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#022F49', fontWeight: 700 }}
              >
                Regular Service
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#555555', fontFamily: 'DM Sans, Arial, sans-serif' }}>
              Schedule a convenient appointment at your preferred date and time.
            </Typography>
          </Box>

          <Box
            onClick={() => setServicePriority('emergency')}
            sx={{
              border: `2px solid ${servicePriority === 'emergency' ? '#FF6B6B' : '#E5E5E5'}`,
              borderRadius: '14px',
              p: 2,
              cursor: 'pointer',
              backgroundColor: servicePriority === 'emergency' ? '#FFF5F5' : '#FAFAFA',
              transition: 'all 0.2s ease',
              '&:hover': { borderColor: '#FF6B6B', backgroundColor: '#FFF5F5' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <WarningAmberIcon sx={{ color: '#FF6B6B', fontSize: 20 }} />
              <Typography
                variant="subtitle1"
                sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#CC2200', fontWeight: 700 }}
              >
                Emergency Service
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#555555', fontFamily: 'DM Sans, Arial, sans-serif' }}>
              Need urgent help? Request ASAP or same-day emergency response.
            </Typography>
          </Box>
        </Box>

        {/* Emergency warning banner */}
        {isEmergency && (
          <Alert
            severity="warning"
            icon={<WarningAmberIcon />}
            sx={{ mb: 3, borderRadius: '10px', fontFamily: 'DM Sans, Arial, sans-serif' }}
          >
            <strong>Emergency service note:</strong> Availability and pricing for emergency requests may vary based on
            location and demand. Our dispatch team will contact you as soon as possible to confirm service.
          </Alert>
        )}

        {/* Service selectors */}
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          <FormControl fullWidth>
            <InputLabel id="category-label">Service Category</InputLabel>
            <Select
              labelId="category-label"
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
          <FormControl fullWidth>
            <InputLabel id="service-type-label">Service Type</InputLabel>
            <Select
              labelId="service-type-label"
              value={serviceTypeId}
              label="Service Type"
              onChange={(e: SelectChangeEvent<string>) => setServiceTypeId(e.target.value)}
            >
              {serviceTypeOptions.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Customer info */}
        <Box sx={{ mt: 3, display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          <TextField
            label="Customer Name *"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Email *"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label={isEmergency ? 'Phone Number * (required for emergency)' : 'Phone Number *'}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            sx={isEmergency ? { '& .MuiOutlinedInput-root': { borderColor: '#FF6B6B' } } : {}}
          />
          <TextField
            label="Address *"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
          />
          <TextField
            label="City *"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            fullWidth
          />
          <TextField
            label="State *"
            value={stateValue}
            onChange={(e) => setStateValue(e.target.value)}
            fullWidth
          />
          <TextField
            label="ZIP Code *"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            fullWidth
          />
        </Box>

        {/* Appliance info */}
        <Box sx={{ mt: 3, display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
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
        </Box>

        {/* Issue description */}
        <TextField
          label="Describe the problem *"
          value={issueDescription}
          onChange={(e) => setIssueDescription(e.target.value)}
          fullWidth
          multiline
          minRows={4}
          sx={{ mt: 3 }}
        />

        {/* Date/time or urgency */}
        {servicePriority === 'regular' ? (
          <Stack direction={{ xs: 'column', md: 'row' }} gap={2} sx={{ mt: 3 }}>
            <TextField
              label="Preferred Date *"
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Preferred Time *"
              type="time"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>
        ) : (
          <Box sx={{ mt: 3, display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
            <FormControl fullWidth>
              <InputLabel id="urgency-label">Urgency Level *</InputLabel>
              <Select
                labelId="urgency-label"
                value={urgencyLevel}
                label="Urgency Level *"
                onChange={(e: SelectChangeEvent<string>) => setUrgencyLevel(e.target.value)}
              >
                {urgencyOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="severity-label">Issue Severity</InputLabel>
              <Select
                labelId="severity-label"
                value={issueSeverity}
                label="Issue Severity"
                onChange={(e: SelectChangeEvent<string>) => setIssueSeverity(e.target.value)}
              >
                {issueSeverityOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Image upload */}
        <Box sx={{ mt: 3 }}>
          <Button component="label" variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none', fontFamily: 'DM Sans, Arial, sans-serif' }}>
            Upload an image (optional)
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </Button>
          {imagePreviewUrl && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#555555', mb: 1 }}>
                Image preview
              </Typography>
              <Box
                component="img"
                src={imagePreviewUrl}
                alt="Upload preview"
                sx={{ width: '100%', maxWidth: '240px', borderRadius: '12px', border: '1px solid #D9D9D9' }}
              />
            </Box>
          )}
        </Box>

        {/* Consent */}
        <FormControlLabel
          control={<Checkbox checked={consentChecked} onChange={(e) => setConsentChecked(e.target.checked)} />}
          label="I understand that final pricing may depend on diagnosis and availability."
          sx={{ mt: 3, display: 'block' }}
        />

        {/* Error / confirmation */}
        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: '10px' }}>
            {errorMessage}
          </Alert>
        )}
        {confirmationMessage && (
          <Alert
            severity={servicePriority === 'emergency' ? 'warning' : 'success'}
            sx={{ mt: 2, borderRadius: '10px' }}
          >
            {confirmationMessage}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.5, gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{ textTransform: 'none', fontFamily: 'DM Sans, Arial, sans-serif', color: '#555555' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: isEmergency ? '#FF6B6B' : '#22B1FB',
            color: '#FFFFFF',
            textTransform: 'none',
            fontFamily: 'DM Sans, Arial, sans-serif',
            fontWeight: 700,
            px: 4,
            borderRadius: '10px',
            '&:hover': { backgroundColor: isEmergency ? '#CC2200' : '#022F49' },
          }}
        >
          {isEmergency ? 'Submit Emergency Request' : 'Submit Request'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingDialog;
