import React from 'react';
import {
  Box,
  Chip,
  Paper,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { ServiceRequest, statusOptions, statusLabels } from '../data/services';

interface ServiceRequestsAdminProps {
  serviceRequests: ServiceRequest[];
  onUpdateStatus: (id: string, status: ServiceRequest['status']) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

const statusColors: Record<string, string> = {
  new: '#E3F2FD',
  in_review: '#FFF8E1',
  scheduled: '#E8F5E9',
  technician_assigned: '#F3E5F5',
  in_progress: '#FFF3E0',
  completed: '#E0F2F1',
  cancelled: '#FAFAFA',
};

const ServiceRequestsAdmin: React.FC<ServiceRequestsAdminProps> = ({
  serviceRequests,
  onUpdateStatus,
  onUpdateNotes,
}) => {
  const sortedRequests = [...serviceRequests].sort((a, b) => {
    if (a.servicePriority === b.servicePriority) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return a.servicePriority === 'emergency' ? -1 : 1;
  });

  const emergencyCount = serviceRequests.filter((r) => r.servicePriority === 'emergency').length;

  return (
    <Box id="admin" sx={{ backgroundColor: '#F8FBFF', padding: '60px 0' }}>
      <Paper elevation={0} sx={{ maxWidth: '1300px', margin: '0 auto', padding: { xs: 2, md: 4 }, borderRadius: '24px' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Box>
            <Typography
              variant="h3"
              sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#022F49', mb: 1 }}
            >
              Service Request Dashboard
            </Typography>
            <Typography variant="body1" sx={{ color: '#555555' }}>
              Emergency requests are pinned to the top. Update status, add notes, and track all customer requests.
            </Typography>
          </Box>
          {emergencyCount > 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                backgroundColor: '#FFF0F0',
                border: '1px solid #FFCCCC',
                borderRadius: '10px',
                px: 2,
                py: 1,
              }}
            >
              <WarningAmberIcon sx={{ color: '#FF6B6B', fontSize: 20 }} />
              <Typography
                variant="body2"
                sx={{ color: '#CC2200', fontWeight: 700, fontFamily: 'DM Sans, Arial, sans-serif' }}
              >
                {emergencyCount} emergency {emergencyCount === 1 ? 'request' : 'requests'} pending
              </Typography>
            </Box>
          )}
        </Box>

        {sortedRequests.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              backgroundColor: '#F5F7F9',
              borderRadius: '14px',
              border: '2px dashed #D9D9D9',
            }}
          >
            <Typography variant="body1" sx={{ color: '#666666', fontFamily: 'DM Sans, Arial, sans-serif' }}>
              No service requests yet. Use the booking form to create a request.
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F5F7F9' }}>
                  <TableCell sx={{ fontWeight: 700, fontFamily: 'DM Sans, Arial, sans-serif', color: '#022F49' }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontFamily: 'DM Sans, Arial, sans-serif', color: '#022F49' }}>
                    Priority
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontFamily: 'DM Sans, Arial, sans-serif', color: '#022F49' }}>
                    Customer
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontFamily: 'DM Sans, Arial, sans-serif', color: '#022F49' }}>
                    Contact
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontFamily: 'DM Sans, Arial, sans-serif', color: '#022F49' }}>
                    Service
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontFamily: 'DM Sans, Arial, sans-serif', color: '#022F49' }}>
                    Requested
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontFamily: 'DM Sans, Arial, sans-serif', color: '#022F49' }}>
                    Notes
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedRequests.map((request) => (
                  <TableRow
                    key={request.id}
                    sx={{
                      backgroundColor:
                        request.servicePriority === 'emergency'
                          ? '#FFF8F8'
                          : statusColors[request.status] ?? '#FFFFFF',
                      borderLeft: request.servicePriority === 'emergency' ? '4px solid #FF6B6B' : '4px solid transparent',
                      '&:hover': { backgroundColor: request.servicePriority === 'emergency' ? '#FFEFEF' : '#F0F7FF' },
                    }}
                  >
                    <TableCell sx={{ minWidth: 160 }}>
                      <Select
                        value={request.status}
                        onChange={(e) => onUpdateStatus(request.id, e.target.value as ServiceRequest['status'])}
                        fullWidth
                        size="small"
                        sx={{ fontFamily: 'DM Sans, Arial, sans-serif', fontSize: '0.85rem' }}
                      >
                        {statusOptions.map((opt) => (
                          <MenuItem key={opt} value={opt} sx={{ fontFamily: 'DM Sans, Arial, sans-serif' }}>
                            {statusLabels[opt] ?? opt}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={request.servicePriority === 'emergency' ? 'Emergency' : 'Regular'}
                        color={request.servicePriority === 'emergency' ? 'error' : 'primary'}
                        size="small"
                        icon={request.servicePriority === 'emergency' ? <WarningAmberIcon /> : undefined}
                        sx={{ fontFamily: 'DM Sans, Arial, sans-serif', fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, fontFamily: 'DM Sans, Arial, sans-serif' }}>
                        {request.customerName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666666', display: 'block' }}>
                        {request.city}, {request.state} {request.zipCode}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#999999' }}>
                        {new Date(request.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'DM Sans, Arial, sans-serif' }}>
                        {request.phone}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#22B1FB', fontFamily: 'DM Sans, Arial, sans-serif', wordBreak: 'break-all' }}
                      >
                        {request.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700, fontFamily: 'DM Sans, Arial, sans-serif', color: '#022F49' }}
                      >
                        {request.serviceCategory}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666666', fontFamily: 'DM Sans, Arial, sans-serif' }}>
                        {request.serviceType}
                      </Typography>
                      {request.applianceBrand && (
                        <Typography variant="caption" sx={{ color: '#999999' }}>
                          {request.applianceBrand} {request.applianceModel}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ minWidth: 130 }}>
                      {request.servicePriority === 'emergency' ? (
                        <Box>
                          <Chip
                            label={request.urgencyLevel ?? 'ASAP'}
                            size="small"
                            sx={{
                              backgroundColor: '#FFE0E0',
                              color: '#CC2200',
                              fontFamily: 'DM Sans, Arial, sans-serif',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ fontFamily: 'DM Sans, Arial, sans-serif' }}>
                          {request.requestedResponseTime || '—'}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ minWidth: 220 }}>
                      <TextField
                        value={request.notes ?? ''}
                        onChange={(e) => onUpdateNotes(request.id, e.target.value)}
                        fullWidth
                        size="small"
                        placeholder="Add internal notes"
                        multiline
                        maxRows={3}
                        sx={{ '& input, & textarea': { fontFamily: 'DM Sans, Arial, sans-serif', fontSize: '0.85rem' } }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default ServiceRequestsAdmin;
