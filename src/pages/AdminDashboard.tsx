import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Chip,
  Select,
  MenuItem,
  TextField,
  SelectChangeEvent,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ServiceRequest, statusOptions } from '../data/services';

const STORAGE_KEY = 'smart-appliances-service-requests';

const statusLabels: Record<ServiceRequest['status'], string> = {
  new: 'New',
  contacted: 'Contacted',
  scheduled: 'Scheduled',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const statusColors: Record<ServiceRequest['status'], string> = {
  new: '#E3F2FD',
  contacted: '#FFF8E1',
  scheduled: '#E8F5E9',
  in_progress: '#F3E5F5',
  completed: '#E0F2F1',
  cancelled: '#FAFAFA',
};

const loadRequests = (): ServiceRequest[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as ServiceRequest[];
  } catch {
    // ignore
  }
  return [];
};

const saveRequests = (requests: ServiceRequest[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch {
    // ignore
  }
};

const AdminDashboard: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>(loadRequests);

  const updateStatus = (id: string, status: ServiceRequest['status']) => {
    setRequests((prev) => {
      const updated = prev.map((r) =>
        r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r,
      );
      saveRequests(updated);
      return updated;
    });
  };

  const updateNotes = (id: string, notes: string) => {
    setRequests((prev) => {
      const updated = prev.map((r) =>
        r.id === id ? { ...r, notes, updatedAt: new Date().toISOString() } : r,
      );
      saveRequests(updated);
      return updated;
    });
  };

  const sortedRequests = [...requests].sort((a, b) => {
    if (a.servicePriority === b.servicePriority) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return a.servicePriority === 'emergency' ? -1 : 1;
  });

  const totalCount = requests.length;
  const emergencyCount = requests.filter((r) => r.servicePriority === 'emergency').length;
  const pendingCount = requests.filter((r) => r.status === 'new' || r.status === 'contacted').length;
  const completedCount = requests.filter((r) => r.status === 'completed').length;
  const estRevenue = completedCount * 149;

  const statCards = [
    { label: 'Total Requests', value: totalCount, color: '#022F49' },
    { label: 'Emergency', value: emergencyCount, color: '#FF6B6B' },
    { label: 'Pending', value: pendingCount, color: '#FF9800' },
    { label: 'Completed', value: completedCount, color: '#2E7D32' },
    {
      label: 'Est. Revenue',
      value: `$${estRevenue.toLocaleString()}`,
      color: '#22B1FB',
    },
  ];

  const getBorderColor = (request: ServiceRequest): string => {
    if (request.servicePriority === 'emergency') return '#FF6B6B';
    return '#22B1FB';
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F5F7F9', py: 6 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h3"
            sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#022F49', mb: 1 }}
          >
            Admin Dashboard
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#555555' }}
          >
            Manage all service requests, update statuses, and track customer submissions.
          </Typography>
        </Box>

        {/* Stats row */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' },
            gap: 2,
            mb: 5,
          }}
        >
          {statCards.map((stat) => (
            <Card
              key={stat.label}
              sx={{
                borderRadius: '16px',
                border: '1px solid #E5E5E5',
                boxShadow: 'none',
                backgroundColor: '#FFFFFF',
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Typography
                  sx={{
                    fontFamily: 'Wasted Vindey, Arial, sans-serif',
                    color: stat.color,
                    fontSize: '2rem',
                    fontWeight: 700,
                    lineHeight: 1.2,
                    mb: 0.5,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#666666', fontSize: '0.85rem' }}
                >
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Request cards */}
        {sortedRequests.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 12,
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '2px dashed #D9D9D9',
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 64, color: '#D9D9D9', mb: 2 }} />
            <Typography
              variant="h6"
              sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#999999', mb: 1 }}
            >
              No service requests yet
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#AAAAAA' }}
            >
              Requests submitted through the booking form will appear here.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {sortedRequests.map((request) => (
              <Card
                key={request.id}
                sx={{
                  borderRadius: '16px',
                  border: '1px solid #E5E5E5',
                  borderLeft: `5px solid ${getBorderColor(request)}`,
                  backgroundColor:
                    request.servicePriority === 'emergency' ? '#FFF8F8' : statusColors[request.status],
                  boxShadow: 'none',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.06)' },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
                      gap: 3,
                    }}
                  >
                    {/* Column 1: Customer info */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Chip
                          label={request.servicePriority === 'emergency' ? 'Emergency' : 'Regular'}
                          size="small"
                          icon={
                            request.servicePriority === 'emergency' ? (
                              <WarningAmberIcon sx={{ fontSize: '14px !important' }} />
                            ) : undefined
                          }
                          sx={{
                            backgroundColor:
                              request.servicePriority === 'emergency' ? '#FF6B6B' : '#22B1FB',
                            color: '#FFFFFF',
                            fontFamily: 'DM Sans, Arial, sans-serif',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                          }}
                        />
                      </Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#022F49', fontWeight: 700, mb: 0.5 }}
                      >
                        {request.customerName}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#555555', fontSize: '0.85rem' }}>
                        {request.phone}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#22B1FB', fontSize: '0.85rem', wordBreak: 'break-all' }}
                      >
                        {request.email}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#888888', display: 'block', mt: 0.5 }}>
                        {new Date(request.createdAt).toLocaleDateString()} {new Date(request.createdAt).toLocaleTimeString()}
                      </Typography>
                    </Box>

                    {/* Column 2: Service info */}
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: 'DM Sans, Arial, sans-serif',
                          color: '#888888',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                          display: 'block',
                          mb: 0.75,
                        }}
                      >
                        Service
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#022F49', fontWeight: 700, mb: 0.25 }}
                      >
                        {request.serviceCategory}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#555555', mb: 0.25 }}>
                        {request.serviceType}
                      </Typography>
                      {request.applianceBrand && (
                        <Typography variant="caption" sx={{ color: '#888888', display: 'block' }}>
                          {request.applianceBrand} {request.applianceModel}
                        </Typography>
                      )}
                      {request.issueDescription && (
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'DM Sans, Arial, sans-serif',
                            color: '#444444',
                            mt: 1,
                            fontSize: '0.82rem',
                            lineHeight: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {request.issueDescription}
                        </Typography>
                      )}
                    </Box>

                    {/* Column 3: Status + Notes */}
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: 'DM Sans, Arial, sans-serif',
                          color: '#888888',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                          display: 'block',
                          mb: 0.75,
                        }}
                      >
                        Status
                      </Typography>
                      <Select
                        value={request.status}
                        onChange={(e: SelectChangeEvent<string>) =>
                          updateStatus(request.id, e.target.value as ServiceRequest['status'])
                        }
                        fullWidth
                        size="small"
                        sx={{ fontFamily: 'DM Sans, Arial, sans-serif', fontSize: '0.85rem', mb: 2 }}
                      >
                        {statusOptions.map((opt) => (
                          <MenuItem key={opt} value={opt} sx={{ fontFamily: 'DM Sans, Arial, sans-serif' }}>
                            {statusLabels[opt]}
                          </MenuItem>
                        ))}
                      </Select>
                      <TextField
                        value={request.notes ?? ''}
                        onChange={(e) => updateNotes(request.id, e.target.value)}
                        fullWidth
                        size="small"
                        placeholder="Add internal notes"
                        multiline
                        maxRows={3}
                        label="Notes"
                        sx={{
                          '& input, & textarea': {
                            fontFamily: 'DM Sans, Arial, sans-serif',
                            fontSize: '0.85rem',
                          },
                        }}
                      />
                    </Box>

                    {/* Column 4: Scheduling */}
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: 'DM Sans, Arial, sans-serif',
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
                      {request.servicePriority === 'emergency' ? (
                        <Box>
                          <Chip
                            label={request.urgencyLevel ?? 'ASAP'}
                            size="small"
                            sx={{
                              backgroundColor: '#FFE0E0',
                              color: '#CC2200',
                              fontFamily: 'DM Sans, Arial, sans-serif',
                              fontWeight: 600,
                              mb: 1,
                            }}
                          />
                        </Box>
                      ) : (
                        <Box>
                          {request.preferredDate && (
                            <Typography variant="body2" sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#022F49', mb: 0.25 }}>
                              {request.preferredDate}
                            </Typography>
                          )}
                          {request.preferredTime && (
                            <Typography variant="body2" sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#555555' }}>
                              {request.preferredTime}
                            </Typography>
                          )}
                          {request.requestedResponseTime && (
                            <Typography variant="body2" sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#555555' }}>
                              {request.requestedResponseTime}
                            </Typography>
                          )}
                        </Box>
                      )}

                      {/* Address */}
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: 'DM Sans, Arial, sans-serif',
                          color: '#888888',
                          display: 'block',
                          mt: 2,
                          lineHeight: 1.5,
                        }}
                      >
                        {request.address && `${request.address}, `}
                        {request.city}{request.city && request.state ? ', ' : ''}{request.state} {request.zipCode}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default AdminDashboard;
