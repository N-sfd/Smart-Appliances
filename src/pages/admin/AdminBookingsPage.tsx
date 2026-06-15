import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Chip, IconButton, CircularProgress, Collapse, Button, InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  fetchAllBookings, updateBookingStatus, BookingRow, BOOKING_STATUSES,
} from '../../lib/supabaseBookings';
import { colors, fonts } from '../../theme';

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  New: { bg: '#E3F2FD', text: '#0B3D91' },
  Scheduled: { bg: '#E8F5E9', text: '#1B5E20' },
  'In Progress': { bg: '#FFF3E0', text: '#E65100' },
  Completed: { bg: '#E0F2F1', text: '#004D40' },
  Cancelled: { bg: '#FAFAFA', text: '#616161' },
};

const fmt = (iso?: string) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return iso;
  }
};

interface RowDetailProps {
  row: BookingRow;
  onUpdate: (id: string, status: string, notes: string) => Promise<void>;
}

const RowDetail: React.FC<RowDetailProps> = ({ row, onUpdate }) => {
  const [status, setStatus] = useState(row.status);
  const [notes, setNotes] = useState(row.admin_notes ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!row.id) return;
    setSaving(true);
    await onUpdate(row.id, status, notes);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: '#F8FAFC', borderTop: `1px solid ${colors.border}` }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
        <Box>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.mutedText, mb: 0.25 }}>Customer</Typography>
          <Typography sx={{ fontFamily: fonts.body, fontWeight: 600, color: colors.darkText }}>{row.customer_name}</Typography>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.85rem', color: colors.mutedText }}>{row.email}</Typography>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.85rem', color: colors.mutedText }}>{row.phone}</Typography>
        </Box>
        <Box>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.mutedText, mb: 0.25 }}>Address</Typography>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.85rem', color: colors.darkText }}>
            {[row.address, row.suite_apt].filter(Boolean).join(', ')}
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.85rem', color: colors.darkText }}>
            {[row.city, row.state, row.zip_code].filter(Boolean).join(', ')}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.mutedText, mb: 0.25 }}>Issue</Typography>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.85rem', color: colors.darkText }}>{row.issue_description || '—'}</Typography>
        </Box>
        <Box>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.mutedText, mb: 0.25 }}>Urgency / Preferred Time</Typography>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.85rem', color: colors.darkText }}>
            {[row.urgency, row.preferred_date, row.preferred_time].filter(Boolean).join(' · ') || '—'}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel sx={{ fontFamily: fonts.body, fontSize: '0.85rem' }}>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
            sx={{ borderRadius: '10px', fontFamily: fonts.body, fontSize: '0.85rem' }}
          >
            {BOOKING_STATUSES.map((s) => (
              <MenuItem key={s} value={s} sx={{ fontFamily: fonts.body, fontSize: '0.85rem' }}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Admin notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          size="small"
          multiline
          minRows={1}
          maxRows={3}
          sx={{
            flex: 1, minWidth: 200,
            '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: fonts.body, fontSize: '0.85rem' },
          }}
        />

        <Button
          onClick={handleSave}
          disabled={saving}
          variant="contained"
          startIcon={saving ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : <SaveOutlinedIcon />}
          sx={{
            backgroundColor: saved ? colors.success : colors.primaryBlue, color: '#fff',
            fontFamily: fonts.body, fontWeight: 700, textTransform: 'none',
            borderRadius: '10px', fontSize: '0.85rem', height: 40,
            '&:hover': { backgroundColor: colors.navy },
          }}
        >
          {saved ? 'Saved!' : 'Save'}
        </Button>
      </Box>
    </Box>
  );
};

const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const rows = await fetchAllBookings({ status: statusFilter, search });
    setBookings(rows);
    setLoading(false);
  }, [statusFilter, search]);

  useEffect(() => { void load(); }, [load]);

  const handleUpdate = async (id: string, status: string, notes: string) => {
    await updateBookingStatus(id, status, notes);
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status, admin_notes: notes } : b));
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" sx={{ fontFamily: fonts.heading, color: colors.navy, fontWeight: 800, mb: 0.5 }}>
        Bookings
      </Typography>
      <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '0.9rem', mb: 3 }}>
        {bookings.length} result{bookings.length !== 1 ? 's' : ''}
      </Typography>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        <TextField
          placeholder="Search name, email, phone, ZIP, service…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{
            flex: 1, minWidth: 240,
            '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: fonts.body },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: colors.mutedText }} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel sx={{ fontFamily: fonts.body, fontSize: '0.85rem' }}>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ borderRadius: '10px', fontFamily: fonts.body, fontSize: '0.85rem' }}
          >
            <MenuItem value="all" sx={{ fontFamily: fonts.body }}>All statuses</MenuItem>
            {BOOKING_STATUSES.map((s) => (
              <MenuItem key={s} value={s} sx={{ fontFamily: fonts.body }}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : bookings.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText }}>No bookings found.</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${colors.border}`, borderRadius: '16px', overflow: 'hidden' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                {['Date', 'Name', 'Service', 'Location', 'Status', ''].map((h) => (
                  <TableCell key={h} sx={{ fontFamily: fonts.body, fontWeight: 700, color: colors.navy, fontSize: '0.78rem', py: 1.5 }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((b) => {
                const statusStyle = STATUS_COLOR[b.status] ?? { bg: '#F5F5F5', text: '#333' };
                const isExpanded = expandedId === b.id;
                return (
                  <React.Fragment key={b.id}>
                    <TableRow
                      sx={{
                        '&:hover': { backgroundColor: '#F8FAFC' },
                        cursor: 'pointer',
                        backgroundColor: isExpanded ? '#F0F7FF' : 'inherit',
                      }}
                      onClick={() => setExpandedId(isExpanded ? null : (b.id ?? null))}
                    >
                      <TableCell sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.mutedText, whiteSpace: 'nowrap', py: 1.5 }}>
                        {fmt(b.created_at)}
                      </TableCell>
                      <TableCell sx={{ fontFamily: fonts.body, fontSize: '0.85rem', color: colors.darkText, py: 1.5 }}>
                        <Typography sx={{ fontFamily: fonts.body, fontWeight: 600, fontSize: '0.85rem' }}>{b.customer_name}</Typography>
                        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.mutedText }}>{b.email}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontFamily: fonts.body, fontSize: '0.85rem', color: colors.darkText, py: 1.5 }}>
                        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.85rem' }}>{b.service_type}</Typography>
                        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.mutedText }}>{b.service_category}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.mutedText, py: 1.5 }}>
                        {[b.city, b.zip_code].filter(Boolean).join(', ')}
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Chip
                          label={b.status}
                          size="small"
                          sx={{ backgroundColor: statusStyle.bg, color: statusStyle.text, fontFamily: fonts.body, fontWeight: 700, fontSize: '0.75rem' }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <IconButton size="small">
                          {isExpanded ? <ExpandLessIcon sx={{ fontSize: 18 }} /> : <ExpandMoreIcon sx={{ fontSize: 18 }} />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={6} sx={{ p: 0, border: 0 }}>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <RowDetail row={b} onUpdate={handleUpdate} />
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminBookingsPage;
