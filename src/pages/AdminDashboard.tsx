import React, { useState, useMemo } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Container,
  FormControl,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { ServiceRequest, statusOptions, statusLabels } from '../data/services';
import { updateServiceRequestStatus, updateServiceRequestNotes } from '../lib/firebase';

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

const borderColors: Record<number, string> = {
  4: '#FF6B6B',
  3: '#FF9800',
  2: '#22B1FB',
  1: '#E0E0E0',
};

const tabs = ['All', 'New', 'Emergency', 'Scheduled', 'In Progress', 'Completed'];

const AdminDashboard: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>(loadFromStorage);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleUpdateStatus = (id: string, status: ServiceRequest['status']) => {
    setRequests((curr) => {
      const updated = curr.map((r) =>
        r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r,
      );
      saveToStorage(updated);
      return updated;
    });
    updateServiceRequestStatus(id, status).catch(() => {});
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setRequests((curr) => {
      const updated = curr.map((r) =>
        r.id === id ? { ...r, notes, updatedAt: new Date().toISOString() } : r,
      );
      saveToStorage(updated);
      return updated;
    });
    updateServiceRequestNotes(id, notes).catch(() => {});
  };

  const stats = useMemo(
    () => ({
      total: requests.length,
      emergency: requests.filter((r) => r.servicePriority === 'emergency').length,
      pending: requests.filter((r) => r.status === 'in_review' || r.status === 'scheduled').length,
      completed: requests.filter((r) => r.status === 'completed').length,
    }),
    [requests],
  );

  const filteredRequests = useMemo(() => {
    let filtered = [...requests];

    // Tab filter
    if (activeTab === 1) filtered = filtered.filter((r) => r.status === 'new');
    else if (activeTab === 2) filtered = filtered.filter((r) => r.servicePriority === 'emergency');
    else if (activeTab === 3) filtered = filtered.filter((r) => r.status === 'scheduled');
    else if (activeTab === 4) filtered = filtered.filter((r) => r.status === 'in_progress');
    else if (activeTab === 5) filtered = filtered.filter((r) => r.status === 'completed');

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.customerName.toLowerCase().includes(q) ||
          r.serviceType.toLowerCase().includes(q) ||
          r.serviceCategory.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q),
      );
    }

    // Sort: emergency first, then by date
    filtered.sort((a, b) => {
      if (a.servicePriority === b.servicePriority) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.servicePriority === 'emergency' ? -1 : 1;
    });

    return filtered;
  }, [requests, activeTab, searchQuery]);

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
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AssignmentIcon sx={{ color: '#22B1FB', fontSize: 40 }} />
            <Box>
              <Typography
                variant="h4"
                sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#FFFFFF', fontWeight: 700 }}
              >
                Service Request Dashboard
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'DM Sans, Arial, sans-serif' }}
              >
                Manage all service requests, update statuses, and track technician assignments
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* Stats row */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 2,
            mb: 4,
          }}
        >
          <StatCard label="Total Requests" value={stats.total} color="#022F49" />
          <StatCard label="Emergency" value={stats.emergency} color="#FF6B6B" />
          <StatCard label="Pending" value={stats.pending} color="#FF9800" />
          <StatCard label="Completed" value={stats.completed} color="#4CAF50" />
        </Box>

        {/* Filter tabs + search */}
        <Paper
          elevation={0}
          sx={{ borderRadius: '16px', border: '1px solid #E8EFF5', mb: 3, overflow: 'hidden' }}
        >
          <Tabs
            value={activeTab}
            onChange={(_e, newVal) => setActiveTab(newVal as number)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: '1px solid #E8EFF5',
              '& .MuiTab-root': {
                fontFamily: 'DM Sans, Arial, sans-serif',
                textTransform: 'none',
                fontWeight: 500,
              },
              '& .Mui-selected': { fontWeight: 700, color: '#022F49 !important' },
              '& .MuiTabs-indicator': { backgroundColor: '#22B1FB' },
            }}
          >
            {tabs.map((tab, i) => (
              <Tab key={tab} label={tab} value={i} />
            ))}
          </Tabs>

          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              placeholder="Search by customer name, service type, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#999999' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: '10px' },
                '& input': { fontFamily: 'DM Sans, Arial, sans-serif' },
              }}
            />
          </Box>
        </Paper>

        {/* Request cards */}
        {filteredRequests.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              borderRadius: '16px',
              border: '2px dashed #D9D9D9',
              p: 6,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="body1"
              sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#666666' }}
            >
              {requests.length === 0
                ? 'No service requests yet. Requests will appear here when customers submit forms.'
                : 'No requests match your current filter.'}
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                expanded={expandedId === request.id}
                onToggleExpand={() =>
                  setExpandedId((curr) => (curr === request.id ? null : request.id))
                }
                onUpdateStatus={handleUpdateStatus}
                onUpdateNotes={handleUpdateNotes}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

// --- StatCard ---
const StatCard: React.FC<{ label: string; value: number; color: string }> = ({
  label,
  value,
  color,
}) => (
  <Paper
    elevation={0}
    sx={{
      borderRadius: '14px',
      border: `2px solid ${color}22`,
      p: { xs: 2, md: 3 },
      textAlign: 'center',
      backgroundColor: `${color}08`,
    }}
  >
    <Typography
      variant="h3"
      sx={{
        fontFamily: 'Wasted Vindey, Arial, sans-serif',
        color,
        fontWeight: 700,
        fontSize: { xs: '2rem', md: '2.5rem' },
      }}
    >
      {value}
    </Typography>
    <Typography
      variant="body2"
      sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#666666', fontWeight: 500 }}
    >
      {label}
    </Typography>
  </Paper>
);

// --- RequestCard ---
interface RequestCardProps {
  request: ServiceRequest;
  expanded: boolean;
  onToggleExpand: () => void;
  onUpdateStatus: (id: string, status: ServiceRequest['status']) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

const RequestCard: React.FC<RequestCardProps> = ({
  request,
  expanded,
  onToggleExpand,
  onUpdateStatus,
  onUpdateNotes,
}) => {
  const isEmergency = request.servicePriority === 'emergency';
  const score = request.priorityScore ?? (isEmergency ? 4 : 2);
  const borderColor = borderColors[score] ?? '#E0E0E0';

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: '14px',
        border: `1.5px solid ${borderColor}`,
        borderLeft: `5px solid ${borderColor}`,
        backgroundColor: isEmergency ? '#FFF8F8' : '#FFFFFF',
        overflow: 'visible',
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          {/* Left: customer info */}
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
              <Chip
                label={isEmergency ? 'Emergency' : (request.urgencyLevel ?? 'Normal')}
                size="small"
                icon={isEmergency ? <WarningAmberIcon /> : undefined}
                sx={{
                  backgroundColor: priorityScoreColors[score] ?? '#22B1FB',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  '& .MuiChip-icon': { color: '#FFFFFF' },
                }}
              />
              <Chip
                label={statusLabels[request.status] ?? request.status}
                size="small"
                variant="outlined"
                sx={{ fontFamily: 'DM Sans, Arial, sans-serif', fontWeight: 500 }}
              />
            </Box>
            <Typography
              variant="subtitle1"
              sx={{ fontFamily: 'DM Sans, Arial, sans-serif', fontWeight: 700, color: '#022F49' }}
            >
              {request.customerName}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#555555', fontFamily: 'DM Sans, Arial, sans-serif' }}
            >
              {request.phone} &bull; {request.email}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#777777', fontFamily: 'DM Sans, Arial, sans-serif', mt: 0.5 }}
            >
              <strong>{request.serviceCategory}</strong> &rarr; {request.serviceType}
              {request.applianceType ? ` (${request.applianceType})` : ''}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#888888', fontFamily: 'DM Sans, Arial, sans-serif', mt: 0.5 }}
            >
              {request.issueDescription.slice(0, 100)}
              {request.issueDescription.length > 100 ? '...' : ''}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: '#AAAAAA', fontFamily: 'DM Sans, Arial, sans-serif', display: 'block', mt: 0.5 }}
            >
              Created: {new Date(request.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>

          {/* Right: status + actions */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 200 }}>
            <FormControl fullWidth size="small">
              <Select
                value={request.status}
                onChange={(e: SelectChangeEvent<string>) =>
                  onUpdateStatus(request.id, e.target.value as ServiceRequest['status'])
                }
                sx={{ fontFamily: 'DM Sans, Arial, sans-serif', fontSize: '0.875rem', borderRadius: '8px' }}
              >
                {statusOptions.map((opt) => (
                  <MenuItem key={opt} value={opt} sx={{ fontFamily: 'DM Sans, Arial, sans-serif' }}>
                    {statusLabels[opt] ?? opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              value={request.notes ?? ''}
              onChange={(e) => onUpdateNotes(request.id, e.target.value)}
              placeholder="Internal notes..."
              size="small"
              multiline
              maxRows={3}
              sx={{
                '& textarea, & input': { fontFamily: 'DM Sans, Arial, sans-serif', fontSize: '0.85rem' },
                '& .MuiOutlinedInput-root': { borderRadius: '8px' },
              }}
            />

            <Button
              size="small"
              endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={onToggleExpand}
              sx={{
                textTransform: 'none',
                fontFamily: 'DM Sans, Arial, sans-serif',
                color: '#22B1FB',
                justifyContent: 'flex-start',
              }}
            >
              {expanded ? 'Hide Details' : 'View Details'}
            </Button>
          </Box>
        </Box>

        {/* Expanded triage details */}
        <Collapse in={expanded}>
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: '1px solid #E8EFF5',
              display: 'grid',
              gap: 1,
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            }}
          >
            <DetailRow label="Urgency Level" value={request.urgencyLevel ?? '—'} />
            <DetailRow label="Possible Issue" value={request.possibleIssue ?? '—'} />
            <DetailRow label="Recommended Technician" value={request.recommendedTechnicianType ?? '—'} />
            <DetailRow label="Estimated Duration" value={request.estimatedDuration ?? '—'} />
            <DetailRow label="Appliance Brand" value={request.applianceBrand ?? '—'} />
            <DetailRow label="Appliance Model" value={request.applianceModel ?? '—'} />
            <DetailRow
              label="Address"
              value={`${request.address}, ${request.city}, ${request.state} ${request.zipCode}`}
            />
            {request.preferredDate && (
              <DetailRow
                label="Appointment"
                value={`${request.preferredDate} — ${request.timeWindow ?? request.preferredTime ?? ''}`}
              />
            )}
            {request.callbackTime && (
              <DetailRow label="Callback Time" value={request.callbackTime} />
            )}
            {request.safetyNotes && (
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Alert severity="warning" sx={{ borderRadius: '8px' }}>
                  <strong>Safety Notes:</strong> {request.safetyNotes}
                </Alert>
              </Box>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <Box>
    <Typography
      variant="caption"
      sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#999999', display: 'block' }}
    >
      {label}
    </Typography>
    <Typography
      variant="body2"
      sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#333333' }}
    >
      {value}
    </Typography>
  </Box>
);

export default AdminDashboard;
