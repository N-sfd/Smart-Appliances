import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Chip, IconButton, CircularProgress, Collapse, Button, InputAdornment,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import SendIcon from '@mui/icons-material/Send';
import {
  fetchAllBookings, updateAdminStatus, updateCustomerMessage, BookingRow,
  BOOKING_STATUSES, ADMIN_STATUSES,
  fetchBookingNotes, insertBookingNote, BookingNote,
} from '../../lib/supabaseBookings';
import { useAuth } from '../../contexts/AuthContext';
import { colors, fonts } from '../../theme';

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  New: { bg: '#E3F2FD', text: '#0B3D91' },
  Scheduled: { bg: '#E8F5E9', text: '#1B5E20' },
  'In Progress': { bg: '#FFF3E0', text: '#E65100' },
  Completed: { bg: '#E0F2F1', text: '#004D40' },
  Cancelled: { bg: '#FAFAFA', text: '#616161' },
};

const SERVICE_CATEGORIES = ['Appliance', 'HVAC', 'Plumbing', 'Electrical', 'Smart Home', 'Garage Door'];
const SERVICE_TYPES = ['Repair', 'Installation', 'Maintenance', 'Emergency'];

const fmt = (iso?: string) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return iso; }
};

// ── Booking notes panel ───────────────────────────────────────────────────────

const NotesPanel: React.FC<{ bookingId: string }> = ({ bookingId }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<BookingNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBookingNotes(bookingId).then((n) => { setNotes(n); setLoading(false); });
  }, [bookingId]);

  const handleAdd = async () => {
    if (!newNote.trim()) return;
    setSaving(true);
    await insertBookingNote(bookingId, newNote.trim(), user?.id);
    const updated = await fetchBookingNotes(bookingId);
    setNotes(updated);
    setNewNote('');
    setSaving(false);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
        <NoteAddOutlinedIcon sx={{ fontSize: 16, color: colors.primaryBlue }} />
        <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '0.82rem', color: colors.navy }}>
          Internal Notes
        </Typography>
      </Box>

      {loading ? (
        <CircularProgress size={16} />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1.5 }}>
          {notes.length === 0 && (
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.8rem', color: colors.mutedText }}>
              No notes yet.
            </Typography>
          )}
          {notes.map((n) => (
            <Box
              key={n.id}
              sx={{
                backgroundColor: '#FFFBEB', borderRadius: '8px', px: 1.5, py: 1,
                border: '1px solid #FDE68A',
              }}
            >
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: '#92400E', lineHeight: 1.5 }}>
                {n.note}
              </Typography>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.72rem', color: colors.mutedText, mt: 0.25 }}>
                {fmt(n.created_at)}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note…"
          size="small"
          fullWidth
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void handleAdd(); } }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '0.82rem', fontFamily: fonts.body } }}
        />
        <Button
          onClick={() => void handleAdd()}
          disabled={saving || !newNote.trim()}
          variant="contained"
          sx={{
            backgroundColor: colors.primaryBlue, color: '#fff', minWidth: 40, px: 1.5,
            borderRadius: '8px', '&:hover': { backgroundColor: colors.navy },
          }}
        >
          {saving ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : <SendIcon sx={{ fontSize: 16 }} />}
        </Button>
      </Box>
    </Box>
  );
};

// ── Expanded row detail ───────────────────────────────────────────────────────

interface RowDetailProps {
  row: BookingRow;
  onStatusChange: (id: string, adminStatus: string) => Promise<void>;
}

const RowDetail: React.FC<RowDetailProps> = ({ row, onStatusChange }) => {
  const [adminStatus, setAdminStatus] = useState(row.admin_status ?? row.status);
  const [customerMsg, setCustomerMsg] = useState(row.customer_message ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [msgSaving, setMsgSaving] = useState(false);
  const [msgSaved, setMsgSaved] = useState(false);

  const handleSaveStatus = async () => {
    if (!row.id) return;
    setSaving(true);
    await onStatusChange(row.id, adminStatus);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveMessage = async () => {
    if (!row.id) return;
    setMsgSaving(true);
    await updateCustomerMessage(row.id, customerMsg);
    setMsgSaving(false);
    setMsgSaved(true);
    setTimeout(() => setMsgSaved(false), 2000);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: '#F8FAFC', borderTop: `1px solid ${colors.border}` }}>
      {row.request_number && (
        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.78rem', fontWeight: 700, color: colors.primaryBlue, mb: 2, letterSpacing: '0.04em' }}>
          Request ID: {row.request_number}
        </Typography>
      )}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
        {/* Customer */}
        <Box>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.72rem', color: colors.mutedText, mb: 0.25, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Customer
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, fontWeight: 600, color: colors.darkText }}>{row.customer_name}</Typography>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.mutedText }}>{row.email}</Typography>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.mutedText }}>{row.phone}</Typography>
        </Box>
        {/* Address */}
        <Box>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.72rem', color: colors.mutedText, mb: 0.25, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Address
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.darkText }}>
            {[row.street_address, row.suite_apt].filter(Boolean).join(', ') || '—'}
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.darkText }}>
            {[row.city, row.state, row.zip_code].filter(Boolean).join(', ')}
          </Typography>
        </Box>
        {/* Service details */}
        <Box>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.72rem', color: colors.mutedText, mb: 0.25, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Service Details
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.darkText }}>
            {[row.product_name, row.problem_type, row.system_type].filter(Boolean).join(' · ') || row.service_type}
          </Typography>
          {row.brand && (
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.mutedText }}>
              {row.brand}{row.model_number ? ` · ${row.model_number}` : ''}
            </Typography>
          )}
        </Box>
        {/* Timing */}
        <Box>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.72rem', color: colors.mutedText, mb: 0.25, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Scheduling
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.darkText }}>
            {[row.urgency, row.preferred_date, row.preferred_time].filter(Boolean).join(' · ') || '—'}
          </Typography>
        </Box>
      </Box>

      {row.issue_description && (
        <Box sx={{ mb: 2, p: 1.5, backgroundColor: '#fff', borderRadius: '8px', border: `1px solid ${colors.border}` }}>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.72rem', color: colors.mutedText, mb: 0.25, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Issue Description
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.darkText, lineHeight: 1.6 }}>
            {row.issue_description}
          </Typography>
        </Box>
      )}

      <Divider sx={{ mb: 2 }} />

      {/* Admin status update */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel sx={{ fontFamily: fonts.body, fontSize: '0.85rem' }}>Admin Status</InputLabel>
          <Select
            value={adminStatus}
            label="Admin Status"
            onChange={(e) => setAdminStatus(e.target.value)}
            sx={{ borderRadius: '10px', fontFamily: fonts.body, fontSize: '0.85rem' }}
          >
            {ADMIN_STATUSES.map((s) => (
              <MenuItem key={s} value={s} sx={{ fontFamily: fonts.body, fontSize: '0.85rem' }}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          onClick={() => void handleSaveStatus()}
          disabled={saving || adminStatus === (row.admin_status ?? row.status)}
          variant="contained"
          sx={{
            backgroundColor: saved ? colors.success : colors.primaryBlue, color: '#fff',
            fontFamily: fonts.body, fontWeight: 700, textTransform: 'none',
            borderRadius: '10px', fontSize: '0.85rem', height: 40,
            '&:hover': { backgroundColor: colors.navy },
            '&.Mui-disabled': { backgroundColor: '#CBD5E1', color: '#fff' },
          }}
        >
          {saving ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : saved ? 'Saved!' : 'Update Status'}
        </Button>
      </Box>

      {/* Customer message */}
      <Box sx={{ mb: 2 }}>
        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.78rem', fontWeight: 700, color: colors.navy, mb: 0.75, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Message to Customer
        </Typography>
        <TextField
          value={customerMsg}
          onChange={(e) => setCustomerMsg(e.target.value)}
          placeholder="Visible to customer on the tracking page…"
          size="small"
          multiline
          minRows={2}
          fullWidth
          sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px', fontSize: '0.82rem', fontFamily: fonts.body } }}
        />
        <Button
          onClick={() => void handleSaveMessage()}
          disabled={msgSaving || customerMsg === (row.customer_message ?? '')}
          variant="outlined"
          size="small"
          sx={{
            borderColor: msgSaved ? colors.success : colors.primaryBlue,
            color: msgSaved ? colors.success : colors.primaryBlue,
            fontFamily: fonts.body, fontWeight: 600, textTransform: 'none', borderRadius: '8px',
          }}
        >
          {msgSaving ? <CircularProgress size={12} /> : msgSaved ? 'Saved!' : 'Save Message'}
        </Button>
      </Box>

      {/* Notes */}
      {row.id && <NotesPanel bookingId={row.id} />}
    </Box>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────

const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [zipFilter, setZipFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const rows = await fetchAllBookings({
      status: statusFilter,
      search,
      category: categoryFilter,
      service_type: typeFilter,
      zip_code: zipFilter,
      date_from: dateFrom,
      date_to: dateTo,
    });
    setBookings(rows);
    setLoading(false);
  }, [statusFilter, search, categoryFilter, typeFilter, zipFilter, dateFrom, dateTo]);

  useEffect(() => { void load(); }, [load]);

  const handleStatusChange = async (id: string, adminStatus: string) => {
    await updateAdminStatus(id, adminStatus);
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, admin_status: adminStatus } : b));
  };

  const filterSelect = (label: string, value: string, onChange: (v: string) => void, options: string[]) => (
    <FormControl size="small" sx={{ minWidth: 140 }}>
      <InputLabel sx={{ fontFamily: fonts.body, fontSize: '0.82rem' }}>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value)}
        sx={{ borderRadius: '10px', fontFamily: fonts.body, fontSize: '0.82rem' }}
      >
        <MenuItem value="all" sx={{ fontFamily: fonts.body, fontSize: '0.82rem' }}>All</MenuItem>
        {options.map((o) => (
          <MenuItem key={o} value={o} sx={{ fontFamily: fonts.body, fontSize: '0.82rem' }}>{o}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" sx={{ fontFamily: fonts.heading, color: colors.navy, fontWeight: 800, mb: 0.5 }}>
        Bookings
      </Typography>
      <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '0.9rem', mb: 3 }}>
        {bookings.length} result{bookings.length !== 1 ? 's' : ''}
      </Typography>

      {/* Filter row */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
        <TextField
          placeholder="Search name, email, phone, ZIP…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{
            flex: 1, minWidth: 200,
            '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: fonts.body, fontSize: '0.82rem' },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 16, color: colors.mutedText }} />
              </InputAdornment>
            ),
          }}
        />
        {filterSelect('Status', statusFilter, setStatusFilter, BOOKING_STATUSES)}
        {filterSelect('Category', categoryFilter, setCategoryFilter, SERVICE_CATEGORIES)}
        {filterSelect('Type', typeFilter, setTypeFilter, SERVICE_TYPES)}
        <TextField
          placeholder="ZIP"
          value={zipFilter}
          onChange={(e) => setZipFilter(e.target.value.replace(/\D/g, '').slice(0, 5))}
          size="small"
          inputProps={{ maxLength: 5, inputMode: 'numeric' }}
          sx={{
            width: 90,
            '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: fonts.body, fontSize: '0.82rem' },
          }}
        />
        <TextField
          label="From"
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{
            width: 150,
            '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: fonts.body, fontSize: '0.82rem' },
          }}
        />
        <TextField
          label="To"
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{
            width: 150,
            '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: fonts.body, fontSize: '0.82rem' },
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : bookings.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText }}>No bookings match your filters.</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${colors.border}`, borderRadius: '16px', overflow: 'hidden' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                {['Request ID', 'Date', 'Customer', 'Service', 'ZIP', 'Urgency', 'Status', ''].map((h) => (
                  <TableCell key={h} sx={{ fontFamily: fonts.body, fontWeight: 700, color: colors.navy, fontSize: '0.75rem', py: 1.5 }}>
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
                      onClick={() => setExpandedId(isExpanded ? null : (b.id ?? null))}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: isExpanded ? '#F0F7FF' : 'inherit',
                        '&:hover': { backgroundColor: '#F8FAFC' },
                      }}
                    >
                      <TableCell sx={{ fontFamily: fonts.body, fontSize: '0.75rem', fontWeight: 700, color: colors.primaryBlue, whiteSpace: 'nowrap', py: 1.5, letterSpacing: '0.03em' }}>
                        {b.request_number ?? '—'}
                      </TableCell>
                      <TableCell sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: colors.mutedText, whiteSpace: 'nowrap', py: 1.5 }}>
                        {fmt(b.created_at)}
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontFamily: fonts.body, fontWeight: 600, fontSize: '0.85rem', color: colors.darkText }}>
                          {b.customer_name}
                        </Typography>
                        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.mutedText }}>{b.email}</Typography>
                        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.mutedText }}>{b.phone}</Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.darkText }}>{b.product_name || b.service_type}</Typography>
                        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.mutedText }}>{b.service_category} · {b.service_type}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.mutedText, py: 1.5 }}>
                        {b.zip_code}
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        {b.urgency ? (
                          <Chip
                            label={b.urgency}
                            size="small"
                            sx={{
                              backgroundColor: b.urgency === 'Emergency' ? '#FEF2F2' : colors.lightBlueBg,
                              color: b.urgency === 'Emergency' ? '#DC2626' : colors.primaryBlue,
                              fontFamily: fonts.body, fontWeight: 700, fontSize: '0.72rem',
                            }}
                          />
                        ) : <Typography sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: colors.mutedText }}>—</Typography>}
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Chip
                          label={b.status}
                          size="small"
                          sx={{ backgroundColor: statusStyle.bg, color: statusStyle.text, fontFamily: fonts.body, fontWeight: 700, fontSize: '0.72rem' }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <IconButton size="small">
                          {isExpanded ? <ExpandLessIcon sx={{ fontSize: 18 }} /> : <ExpandMoreIcon sx={{ fontSize: 18 }} />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={8} sx={{ p: 0, border: 0 }}>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <RowDetail row={b} onStatusChange={handleStatusChange} />
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
