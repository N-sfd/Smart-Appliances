import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import { ServiceRequest } from '../data/services';

const STORAGE_KEY = 'smart-appliances-service-requests';

const priorityColors: Record<string, string> = {
  Emergency: '#EF4444',
  High: '#FF9800',
  Normal: '#1A73E8',
  Low: '#757575',
};

const priorityScoreColors: Record<number, string> = {
  4: '#EF4444',
  3: '#FF9800',
  2: '#1A73E8',
  1: '#757575',
};

const ConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const { requestId } = useParams<{ requestId: string }>();
  const [copied, setCopied] = React.useState(false);

  const request = useMemo<ServiceRequest | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      const requests = JSON.parse(stored) as ServiceRequest[];
      return requests.find((r) => r.id === requestId) ?? null;
    } catch {
      return null;
    }
  }, [requestId]);

  const handleCopyId = () => {
    if (requestId) {
      navigator.clipboard.writeText(requestId).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!request) {
    return (
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F5F7F9',
        }}
      >
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Typography
            variant="h5"
            sx={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", color: '#0B3D91', mb: 2 }}
          >
            Request Not Found
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#666666', mb: 3 }}
          >
            We couldn't find the service request you're looking for. It may have been cleared.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            startIcon={<HomeIcon />}
            sx={{
              backgroundColor: '#1A73E8',
              color: '#FFFFFF',
              textTransform: 'none',
              fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
              borderRadius: '10px',
              px: 4,
            }}
          >
            Go to Home
          </Button>
        </Container>
      </Box>
    );
  }

  const isEmergency = request.servicePriority === 'emergency';
  const urgencyLevel = request.urgencyLevel ?? 'Normal';
  const priorityColor = isEmergency
    ? '#EF4444'
    : priorityColors[urgencyLevel] ?? priorityScoreColors[request.priorityScore] ?? '#1A73E8';

  return (
    <Box sx={{ backgroundColor: '#F5F7F9', minHeight: '100vh', pb: 8 }}>
      {/* Header */}
      <Box
        sx={{
          background: isEmergency
            ? 'linear-gradient(135deg, #7a1a1a 0%, #EA580C 100%)'
            : 'linear-gradient(135deg, #0B3D91 0%, #034a73 100%)',
          py: { xs: 5, md: 8 },
          px: 2,
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: isEmergency ? '#EF4444' : '#4CAF50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
            boxShadow: '0 0 0 12px rgba(255,255,255,0.15)',
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 48, color: '#FFFFFF' }} />
        </Box>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
            color: '#FFFFFF',
            fontWeight: 700,
            mb: 1,
          }}
        >
          Request Submitted Successfully
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'rgba(255,255,255,0.8)', fontFamily: "'Inter', 'DM Sans', Arial, sans-serif" }}
        >
          {isEmergency
            ? 'Our emergency dispatch team will contact you as soon as possible.'
            : 'Our team will review your request and confirm your appointment.'}
        </Typography>
      </Box>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        {/* Emergency safety reminder */}
        {isEmergency && (
          <Alert
            severity="error"
            icon={<WarningAmberIcon />}
            sx={{ mb: 3, borderRadius: '12px', border: '2px solid #EF4444' }}
          >
            <strong>Safety Reminder:</strong> If there is any immediate danger (gas, smoke, fire, flooding) — evacuate immediately and call 911. Do not wait for a technician.
          </Alert>
        )}

        {/* Request ID card */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: '16px',
            border: `2px solid ${priorityColor}`,
            p: { xs: 2, md: 4 },
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="overline"
                sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#999999' }}
              >
                Request ID
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                  color: '#0B3D91',
                  fontWeight: 700,
                  wordBreak: 'break-all',
                }}
              >
                {requestId}
              </Typography>
            </Box>
            <Button
              size="small"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopyId}
              sx={{
                textTransform: 'none',
                fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                color: copied ? '#4CAF50' : '#1A73E8',
              }}
            >
              {copied ? 'Copied!' : 'Copy ID'}
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Summary table */}
          <Typography
            variant="subtitle1"
            sx={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", color: '#0B3D91', fontWeight: 700, mb: 2 }}
          >
            Request Summary
          </Typography>

          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
            <SummaryRow label="Service" value={`${request.serviceCategory} — ${request.serviceType}`} />
            <SummaryRow
              label="Priority"
              value={
                <Chip
                  label={isEmergency ? 'Emergency' : urgencyLevel}
                  size="small"
                  sx={{
                    backgroundColor: priorityColor,
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                  }}
                />
              }
            />
            <SummaryRow
              label="Appointment Preference"
              value={
                isEmergency
                  ? 'ASAP — Emergency Response'
                  : `${request.preferredDate ?? '—'} | ${request.preferredTime ?? '—'}`
              }
            />
            <SummaryRow label="Customer Name" value={request.customerName} />
            <SummaryRow
              label="Address"
              value={`${request.address}, ${request.city}, ${request.state} ${request.zipCode}`}
            />
            <SummaryRow label="Phone" value={request.phone} />
            <SummaryRow label="Email" value={request.email} />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Triage result */}
          <Typography
            variant="subtitle1"
            sx={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", color: '#0B3D91', fontWeight: 700, mb: 2 }}
          >
            Triage Assessment
          </Typography>

          <Box sx={{ display: 'grid', gap: 2 }}>
            {request.possibleIssue && (
              <SummaryRow label="Possible Issue" value={request.possibleIssue} />
            )}
            {request.recommendedTechnicianType && (
              <SummaryRow label="Recommended Technician" value={request.recommendedTechnicianType} />
            )}
            {request.estimatedDuration && (
              <SummaryRow label="Estimated Duration" value={request.estimatedDuration} />
            )}
          </Box>

          {request.safetyNotes && (
            <Alert severity="warning" sx={{ mt: 2, borderRadius: '10px' }}>
              <strong>Safety Note:</strong> {request.safetyNotes}
            </Alert>
          )}
        </Paper>

        {/* Next steps */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: '16px',
            border: '1.5px solid #E8EFF5',
            p: { xs: 2, md: 4 },
            mb: 3,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", color: '#0B3D91', fontWeight: 700, mb: 2 }}
          >
            What Happens Next
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              'Our team will review your request within 2 hours.',
              'A technician will contact you to confirm the appointment.',
              "You'll receive a confirmation with the technician's details.",
            ].map((step, idx) => (
              <Box key={idx} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    minWidth: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: isEmergency ? '#EF4444' : '#1A73E8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                    flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </Box>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#1A1A1A', pt: 0.25 }}
                >
                  {step}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/book/regular')}
            sx={{
              backgroundColor: '#1A73E8',
              color: '#FFFFFF',
              textTransform: 'none',
              fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
              fontWeight: 700,
              px: 4,
              borderRadius: '10px',
              '&:hover': { backgroundColor: '#0B3D91' },
            }}
          >
            Book Another Service
          </Button>
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{
              borderColor: '#0B3D91',
              color: '#0B3D91',
              textTransform: 'none',
              fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
              fontWeight: 700,
              px: 4,
              borderRadius: '10px',
              '&:hover': { backgroundColor: '#0B3D91', color: '#FFFFFF' },
            }}
          >
            Go to Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

interface SummaryRowProps {
  label: string;
  value: React.ReactNode;
}

const SummaryRow: React.FC<SummaryRowProps> = ({ label, value }) => (
  <Box>
    <Typography
      variant="caption"
      sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#999999', display: 'block', mb: 0.25 }}
    >
      {label}
    </Typography>
    {typeof value === 'string' ? (
      <Typography
        variant="body2"
        sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#333333', fontWeight: 500 }}
      >
        {value}
      </Typography>
    ) : (
      value
    )}
  </Box>
);

export default ConfirmationPage;
