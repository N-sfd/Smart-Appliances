import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Chip,
  Alert,
} from '@mui/material';
import EngineeringIcon from '@mui/icons-material/Engineering';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { ServiceRequest } from '../data/services';

const STORAGE_KEY = 'smart-appliances-service-requests';

const loadRequests = (): ServiceRequest[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as ServiceRequest[];
  } catch {
    // ignore
  }
  return [];
};

const TechnicianDashboard: React.FC = () => {
  const [requests] = useState<ServiceRequest[]>(loadRequests);

  // Show only scheduled and in-progress jobs
  const activeJobs = requests
    .filter((r) => r.status === 'scheduled' || r.status === 'in_progress' || r.status === 'new')
    .sort((a, b) => {
      if (a.servicePriority === b.servicePriority) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.servicePriority === 'emergency' ? -1 : 1;
    });

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F5F7F9', py: 6 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '14px',
              backgroundColor: '#0B3D91',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <EngineeringIcon sx={{ fontSize: 30, color: '#1A73E8' }} />
          </Box>
          <Box>
            <Typography
              variant="h3"
              sx={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", color: '#0B3D91', lineHeight: 1.2 }}
            >
              Technician Dashboard
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#666666' }}
            >
              View and manage your assigned service jobs
            </Typography>
          </Box>
        </Box>

        {/* Summary */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 5 }}>
          <Chip
            label={`${activeJobs.length} Active Jobs`}
            sx={{
              backgroundColor: '#0B3D91',
              color: '#FFFFFF',
              fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
              fontWeight: 600,
            }}
          />
          <Chip
            label={`${activeJobs.filter((j) => j.servicePriority === 'emergency').length} Emergency`}
            sx={{
              backgroundColor: activeJobs.filter((j) => j.servicePriority === 'emergency').length > 0 ? '#EF4444' : '#E0E0E0',
              color: activeJobs.filter((j) => j.servicePriority === 'emergency').length > 0 ? '#FFFFFF' : '#888888',
              fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
              fontWeight: 600,
            }}
          />
        </Box>

        {/* Jobs */}
        {activeJobs.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 12,
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '2px dashed #D9D9D9',
            }}
          >
            <EngineeringIcon sx={{ fontSize: 64, color: '#D9D9D9', mb: 2 }} />
            <Typography
              variant="h6"
              sx={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", color: '#999999', mb: 1 }}
            >
              No jobs assigned yet
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#AAAAAA' }}
            >
              New job assignments will appear here once the admin schedules them.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {activeJobs.map((job) => (
              <Card
                key={job.id}
                sx={{
                  borderRadius: '16px',
                  border: '1px solid #E4E7EB',
                  borderLeft: `5px solid ${job.servicePriority === 'emergency' ? '#EF4444' : '#1A73E8'}`,
                  backgroundColor: job.servicePriority === 'emergency' ? '#FFF8F8' : '#FFFFFF',
                  boxShadow: 'none',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.06)' },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Top row */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography
                        variant="h6"
                        sx={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", color: '#0B3D91' }}
                      >
                        {job.customerName}
                      </Typography>
                      <Chip
                        label={job.servicePriority === 'emergency' ? 'Emergency' : 'Regular'}
                        size="small"
                        icon={
                          job.servicePriority === 'emergency' ? (
                            <WarningAmberIcon sx={{ fontSize: '14px !important' }} />
                          ) : undefined
                        }
                        sx={{
                          backgroundColor: job.servicePriority === 'emergency' ? '#EF4444' : '#1A73E8',
                          color: '#FFFFFF',
                          fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                          fontWeight: 700,
                          fontSize: '0.72rem',
                        }}
                      />
                      <Chip
                        label={job.status.replace('_', ' ')}
                        size="small"
                        sx={{
                          backgroundColor: '#F5F7F9',
                          color: '#0B3D91',
                          fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                          fontWeight: 600,
                          fontSize: '0.72rem',
                          textTransform: 'capitalize',
                        }}
                      />
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#888888' }}
                    >
                      {new Date(job.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>

                  {/* Details grid */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                      gap: 3,
                    }}
                  >
                    {/* Contact & Location */}
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                          color: '#888888',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                          display: 'block',
                          mb: 0.75,
                        }}
                      >
                        Contact & Location
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#0B3D91', mb: 0.25 }}>
                        {job.phone}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#1A73E8', mb: 0.5, wordBreak: 'break-all', fontSize: '0.82rem' }}
                      >
                        {job.email}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#1A1A1A', fontSize: '0.85rem' }}>
                        {job.address && `${job.address}, `}
                        {job.city}{job.city && job.state ? ', ' : ''}{job.state} {job.zipCode}
                      </Typography>
                    </Box>

                    {/* Service info */}
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                          color: '#888888',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                          display: 'block',
                          mb: 0.75,
                        }}
                      >
                        Service Details
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#0B3D91', fontWeight: 700, mb: 0.25 }}
                      >
                        {job.serviceCategory}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#1A1A1A', mb: 0.25 }}>
                        {job.serviceType}
                      </Typography>
                      {job.applianceBrand && (
                        <Typography variant="caption" sx={{ color: '#888888', display: 'block', mb: 0.5 }}>
                          {job.applianceBrand} {job.applianceModel}
                        </Typography>
                      )}
                      {job.issueDescription && (
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                            color: '#444444',
                            fontSize: '0.82rem',
                            lineHeight: 1.5,
                            mt: 0.5,
                          }}
                        >
                          {job.issueDescription}
                        </Typography>
                      )}
                    </Box>

                    {/* Scheduling */}
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                          color: '#888888',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                          display: 'block',
                          mb: 0.75,
                        }}
                      >
                        Scheduling
                      </Typography>
                      {job.servicePriority === 'emergency' ? (
                        <Chip
                          label={job.urgencyLevel ?? 'ASAP'}
                          size="small"
                          sx={{
                            backgroundColor: '#FFE0E0',
                            color: '#EA580C',
                            fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                            fontWeight: 600,
                          }}
                        />
                      ) : (
                        <Box>
                          {job.preferredDate && (
                            <Typography variant="body2" sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#0B3D91', mb: 0.25 }}>
                              {job.preferredDate}
                            </Typography>
                          )}
                          {job.preferredTime && (
                            <Typography variant="body2" sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", color: '#1A1A1A' }}>
                              {job.preferredTime}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Safety notes */}
                  {job.notes && job.notes.trim() !== '' && (
                    <Alert
                      severity="warning"
                      icon={<WarningAmberIcon fontSize="inherit" />}
                      sx={{
                        mt: 2.5,
                        borderRadius: '10px',
                        backgroundColor: '#FFF3E0',
                        border: '1px solid #FFCC80',
                        '& .MuiAlert-message': {
                          fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                          fontSize: '0.88rem',
                          color: '#E65100',
                        },
                      }}
                    >
                      <Typography variant="body2" sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", fontWeight: 700, color: '#E65100', mb: 0.5 }}>
                        Notes
                      </Typography>
                      {job.notes}
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default TechnicianDashboard;
