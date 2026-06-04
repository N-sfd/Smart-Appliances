import React, { useState } from 'react';
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Typography,
} from '@mui/material';
import EngineeringIcon from '@mui/icons-material/Engineering';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { ServiceRequest } from '../data/services';
import { updateTechnicianStatus } from '../lib/firebase';

const STORAGE_KEY = 'smart-appliances-service-requests';

function loadFromStorage(): ServiceRequest[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as ServiceRequest[];
  } catch {
    return [];
  }
}

function saveToStorage(requests: ServiceRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch {
    // ignore
  }
}

const priorityScoreColors: Record<number, string> = {
  4: '#FF6B6B',
  3: '#FF9800',
  2: '#22B1FB',
  1: '#757575',
};

const TechnicianDashboard: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>(loadFromStorage);

  const activeJobs = requests.filter(
    (r) => r.status === 'technician_assigned' || r.status === 'in_progress',
  );

  const handleTechnicianAction = (
    id: string,
    techStatus: ServiceRequest['technicianStatus'],
    newJobStatus?: ServiceRequest['status'],
  ) => {
    setRequests((curr) => {
      const updated = curr.map((r) =>
        r.id === id
          ? {
              ...r,
              technicianStatus: techStatus,
              status: newJobStatus ?? r.status,
              updatedAt: new Date().toISOString(),
            }
          : r,
      );
      saveToStorage(updated);
      return updated;
    });
    updateTechnicianStatus(id, techStatus).catch(() => {});
  };

  return (
    <Box sx={{ backgroundColor: '#F5F7F9', minHeight: '100vh', pb: 8 }}>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #022F49 0%, #034a73 100%)',
          py: { xs: 4, md: 6 },
          px: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <EngineeringIcon sx={{ color: '#22B1FB', fontSize: 40 }} />
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: 'Wasted Vindey, Arial, sans-serif',
                    color: '#FFFFFF',
                    fontWeight: 700,
                  }}
                >
                  Technician Dashboard
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'DM Sans, Arial, sans-serif' }}
                >
                  All Jobs — Assigned & In Progress
                </Typography>
              </Box>
            </Box>
            <Badge badgeContent={activeJobs.length} color="error">
              <Chip
                label={`${activeJobs.length} Active Job${activeJobs.length !== 1 ? 's' : ''}`}
                sx={{
                  backgroundColor: '#22B1FB',
                  color: '#FFFFFF',
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontWeight: 700,
                  fontSize: '1rem',
                  px: 1,
                }}
              />
            </Badge>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {activeJobs.length === 0 ? (
          <Card
            elevation={0}
            sx={{
              borderRadius: '16px',
              border: '2px dashed #D9D9D9',
              p: 6,
              textAlign: 'center',
            }}
          >
            <EngineeringIcon sx={{ fontSize: 48, color: '#CCCCCC', mb: 2 }} />
            <Typography
              variant="h6"
              sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#999999', mb: 1 }}
            >
              No Active Jobs
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#BBBBBB' }}
            >
              Jobs with status "technician_assigned" or "in_progress" will appear here.
            </Typography>
          </Card>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {activeJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onAction={handleTechnicianAction}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

// --- JobCard ---
interface JobCardProps {
  job: ServiceRequest;
  onAction: (
    id: string,
    techStatus: ServiceRequest['technicianStatus'],
    newJobStatus?: ServiceRequest['status'],
  ) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onAction }) => {
  const isEmergency = job.servicePriority === 'emergency';
  const score = job.priorityScore ?? (isEmergency ? 4 : 2);
  const priorityColor = priorityScoreColors[score] ?? '#22B1FB';

  const getNextAction = (): { label: string; techStatus: ServiceRequest['technicianStatus']; jobStatus?: ServiceRequest['status'] } | null => {
    if (!job.technicianStatus) {
      return { label: 'Accept Job', techStatus: 'accepted' };
    }
    if (job.technicianStatus === 'accepted') {
      return { label: 'On the Way', techStatus: 'on_the_way', jobStatus: 'in_progress' };
    }
    if (job.technicianStatus === 'on_the_way') {
      return { label: 'Started', techStatus: 'started' };
    }
    if (job.technicianStatus === 'started') {
      return { label: 'Mark Completed', techStatus: 'completed', jobStatus: 'completed' };
    }
    return null;
  };

  const nextAction = getNextAction();

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: '16px',
        border: `1.5px solid ${priorityColor}44`,
        borderLeft: `5px solid ${priorityColor}`,
        backgroundColor: isEmergency ? '#FFF8F8' : '#FFFFFF',
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        {/* Priority badge */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            label={isEmergency ? 'EMERGENCY' : (job.urgencyLevel ?? 'Normal')}
            size="small"
            icon={isEmergency ? <WarningAmberIcon /> : undefined}
            sx={{
              backgroundColor: priorityColor,
              color: '#FFFFFF',
              fontWeight: 700,
              fontFamily: 'DM Sans, Arial, sans-serif',
              '& .MuiChip-icon': { color: '#FFFFFF' },
            }}
          />
          {job.technicianStatus && (
            <Chip
              label={job.technicianStatus.replace('_', ' ').toUpperCase()}
              size="small"
              variant="outlined"
              sx={{ fontFamily: 'DM Sans, Arial, sans-serif', fontWeight: 600 }}
            />
          )}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            mb: 2,
          }}
        >
          {/* Customer & location */}
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontFamily: 'DM Sans, Arial, sans-serif', fontWeight: 700, color: '#022F49' }}
            >
              {job.customerName}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#555555', fontFamily: 'DM Sans, Arial, sans-serif' }}
            >
              {job.address}, {job.city}, {job.state} {job.zipCode}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#22B1FB', fontFamily: 'DM Sans, Arial, sans-serif', mt: 0.5 }}
            >
              {job.phone}
            </Typography>
          </Box>

          {/* Service info */}
          <Box>
            <Typography
              variant="body2"
              sx={{ fontFamily: 'DM Sans, Arial, sans-serif', fontWeight: 600, color: '#022F49' }}
            >
              {job.serviceCategory}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#555555', fontFamily: 'DM Sans, Arial, sans-serif' }}
            >
              {job.serviceType}
              {job.applianceType ? ` — ${job.applianceType}` : ''}
              {job.applianceBrand ? ` (${job.applianceBrand})` : ''}
            </Typography>
            {job.preferredDate && (
              <Typography
                variant="caption"
                sx={{ color: '#888888', fontFamily: 'DM Sans, Arial, sans-serif', display: 'block', mt: 0.5 }}
              >
                Preferred: {job.preferredDate} | {job.timeWindow ?? job.preferredTime ?? ''}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Issue summary */}
        <Typography
          variant="body2"
          sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#555555', mb: 2 }}
        >
          {job.issueDescription.slice(0, 150)}
          {job.issueDescription.length > 150 ? '...' : ''}
        </Typography>

        {/* Safety notes (prominent if present) */}
        {job.safetyNotes && (
          <Alert
            severity="error"
            icon={<WarningAmberIcon />}
            sx={{ mb: 2, borderRadius: '10px', backgroundColor: '#FFF0F0', border: '1px solid #FF6B6B' }}
          >
            <strong>SAFETY:</strong> {job.safetyNotes}
          </Alert>
        )}

        {/* Triage info */}
        {job.recommendedTechnicianType && (
          <Typography
            variant="body2"
            sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#666666', mb: 1 }}
          >
            <strong>Technician Type:</strong> {job.recommendedTechnicianType} &bull;{' '}
            <strong>Est. Duration:</strong> {job.estimatedDuration ?? '—'}
          </Typography>
        )}

        {/* Action button */}
        {nextAction ? (
          <Button
            variant="contained"
            onClick={() => onAction(job.id, nextAction.techStatus, nextAction.jobStatus)}
            sx={{
              backgroundColor: priorityColor,
              color: '#FFFFFF',
              fontFamily: 'DM Sans, Arial, sans-serif',
              fontWeight: 700,
              textTransform: 'none',
              px: 4,
              borderRadius: '10px',
              mt: 1,
              '&:hover': { backgroundColor: '#022F49' },
            }}
          >
            {nextAction.label}
          </Button>
        ) : (
          <Chip
            label="Job Completed"
            sx={{
              backgroundColor: '#4CAF5020',
              color: '#4CAF50',
              fontWeight: 700,
              fontFamily: 'DM Sans, Arial, sans-serif',
              mt: 1,
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TechnicianDashboard;
