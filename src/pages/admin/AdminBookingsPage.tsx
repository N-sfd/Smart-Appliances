import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Chip, IconButton, CircularProgress, Collapse, Button, InputAdornment,
  Divider, Menu, Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  fetchAllBookings, updateAdminStatus, updateCustomerMessage, BookingRow,
  BOOKING_STATUSES, ADMIN_STATUSES,
  fetchBookingNotes, insertBookingNote, BookingNote,
} from '../../lib/supabaseBookings';
import { assignExpert, cancelServiceRequest, deleteServiceRequest } from '../../services/adminBookings';
import { fetchActiveExpertsRaw } from '../../services/adminExperts';
import { DbExpert } from '../../types/admin';
import { useAuth } from '../../contexts/AuthContext';
import { colors, fonts } from '../../theme';
import { MATCH_EXPERT_SOURCE_TAG } from '../../data/expertMatchRules';
import { EXPERTS, getExpertBySlug } from '../../data/experts';
import { exportCsv } from '../../utils/csvExport';
import BookingAnswersPanel from '../../components/admin/BookingAnswersPanel';

type LeadSource = 'Quick Form' | 'Scheduler' | 'Matching Expert';
const LEAD_SOURCES: LeadSource[] = ['Quick Form', 'Scheduler', 'Matching Expert'];

function getLeadSource(row: BookingRow): LeadSource {
  if (row.issue_description?.includes(MATCH_EXPERT_SOURCE_TAG)) return 'Matching Expert';
  if (row.admin_status === 'New Lead') return 'Quick Form';
  return 'Scheduler';
}

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  New: { bg: '#E3F2FD', text: '#0B3D91' },
  'New Lead': { bg: '#E3F2FD', text: '#0B3D91' },
  Contacted: { bg: '#FFF8E1', text: '#8D6E00' },
  Scheduled: { bg: '#F3E5F5', text: '#6A1B9A' },
  'Technician Assigned': { bg: '#F3E5F5', text: '#6A1B9A' },
  'In Progress': { bg: '#FFF3E0', text: '#E65100' },
  Completed: { bg: '#E8F5E9', text: '#1B5E20' },
  Cancelled: { bg: '#FAFAFA', text: '#B71C1C' },
  Emergency: { bg: '#FDECEA', text: '#C62828' },
};

const SERVICE_CATEGORIES = ['Appliance', 'HVAC', 'Plumbing', 'Electrical', 'Smart Home', 'Garage Door', 'TV Mounting', 'Phone Repair', 'Handyman'];
const SERVICE_TYPES = ['Repair', 'Installation', 'Maintenance', 'Emergency'];

const displayCustomerName = (name?: string | null) => {
  const trimmed = (name ?? '').trim();
  return trimmed.length > 0 ? trimmed : 'Guest Customer';
};

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
  activeExperts: DbExpert[];
  onAssignExpert: (id: string, expertId: string | null) => Promise<void>;
}

const RowDetail: React.FC<RowDetailProps> = ({ row, onStatusChange, activeExperts, onAssignExpert }) => {
  const [adminStatus, setAdminStatus] = useState(row.admin_status ?? row.status);
  const [customerMsg, setCustomerMsg] = useState(row.customer_message ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [msgSaving, setMsgSaving] = useState(false);
  const [msgSaved, setMsgSaved] = useState(false);
  const [expertSaving, setExpertSaving] = useState(false);
  const [expertSaved, setExpertSaved] = useState(false);

  const handleAssignExpert = async (expertId: string) => {
    if (!row.id) return;
    setExpertSaving(true);
    await onAssignExpert(row.id, expertId || null);
    setExpertSaving(false);
    setExpertSaved(true);
    setTimeout(() => setExpertSaved(false), 2000);
  };

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
      <Typography
        sx={{
          fontFamily: fonts.body,
          fontSize: '0.78rem',
          fontWeight: 700,
          color: row.request_number ? colors.primaryBlue : '#B71C1C',
          mb: 2,
          letterSpacing: '0.04em',
        }}
      >
        Request ID: {row.request_number || 'Missing Request ID'}
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
        {/* Customer */}
        <Box>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.72rem', color: colors.mutedText, mb: 0.25, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Customer
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, fontWeight: 600, color: colors.darkText }}>{displayCustomerName(row.customer_name)}</Typography>
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
          {row.appliance_brand && (
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.mutedText }}>
              {row.appliance_brand}{row.appliance_model ? ` · ${row.appliance_model}` : ''}
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
        {/* Pricing estimate */}
        {(row.estimated_total != null || row.quote_required) && (
          <Box>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.72rem', color: colors.mutedText, mb: 0.25, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Pricing Estimate
            </Typography>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.darkText }}>
              Service Call Fee: {row.estimated_base_fee != null ? `$${row.estimated_base_fee.toFixed(2)}` : '—'}
            </Typography>
            {(row.estimated_priority_fee || row.estimated_emergency_fee) ? (
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.darkText }}>
                Priority/Emergency Fee: ${(row.estimated_priority_fee || row.estimated_emergency_fee || 0).toFixed(2)}
              </Typography>
            ) : null}
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', fontWeight: 700, color: colors.navy }}>
              {row.quote_required ? 'Quote Required' : `Estimated Total: $${(row.estimated_total ?? 0).toFixed(2)}`}
            </Typography>
          </Box>
        )}
        {/* Requested expert (customer's original request) */}
        {row.expert_name && (
          <Box>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.72rem', color: colors.mutedText, mb: 0.25, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Requested Expert
            </Typography>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.darkText }}>
              {row.expert_name}
            </Typography>
            {row.expert_slug && getExpertBySlug(row.expert_slug)?.title && (
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: colors.mutedText }}>
                {getExpertBySlug(row.expert_slug)?.title}
              </Typography>
            )}
          </Box>
        )}
        {/* Admin-assigned expert (final, overrides display priority) */}
        {row.expert_id && (
          <Box>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.72rem', color: colors.mutedText, mb: 0.25, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Assigned Expert
            </Typography>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', fontWeight: 700, color: colors.primaryBlue }}>
              {activeExperts.find((e) => e.id === row.expert_id)?.name ?? '—'}
            </Typography>
          </Box>
        )}
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

      <BookingAnswersPanel answers={row.booking_answers} />

      {(row.technician_skill_group || row.estimated_duration_minutes != null || row.source) && (
        <Box sx={{ mb: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 1.5 }}>
          {row.source ? (
            <Box>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.72rem', color: colors.mutedText, mb: 0.25, textTransform: 'uppercase' }}>Source</Typography>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.darkText }}>{row.source}</Typography>
            </Box>
          ) : null}
          {row.technician_skill_group ? (
            <Box>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.72rem', color: colors.mutedText, mb: 0.25, textTransform: 'uppercase' }}>Skill Group</Typography>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.darkText }}>{row.technician_skill_group}</Typography>
            </Box>
          ) : null}
          {row.estimated_duration_minutes != null ? (
            <Box>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.72rem', color: colors.mutedText, mb: 0.25, textTransform: 'uppercase' }}>Est. Duration</Typography>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.darkText }}>{row.estimated_duration_minutes} min</Typography>
            </Box>
          ) : null}
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

        <FormControl size="small" sx={{ minWidth: 200 }} disabled={activeExperts.length === 0 || expertSaving}>
          <InputLabel sx={{ fontFamily: fonts.body, fontSize: '0.85rem' }}>Assign Expert</InputLabel>
          <Select
            value={row.expert_id ?? ''}
            label="Assign Expert"
            onChange={(e) => void handleAssignExpert(e.target.value)}
            sx={{ borderRadius: '10px', fontFamily: fonts.body, fontSize: '0.85rem' }}
          >
            <MenuItem value="" sx={{ fontFamily: fonts.body, fontSize: '0.85rem' }}>Unassigned</MenuItem>
            {activeExperts.map((e) => (
              <MenuItem key={e.id} value={e.id} sx={{ fontFamily: fonts.body, fontSize: '0.85rem' }}>{e.name}</MenuItem>
            ))}
          </Select>
          {activeExperts.length === 0 && (
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.7rem', color: colors.mutedText, mt: 0.5 }}>
              Add experts in Admin → Experts to enable assignment.
            </Typography>
          )}
        </FormControl>
        {expertSaved && (
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: colors.success, fontWeight: 700 }}>Saved!</Typography>
        )}
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
  const [activeExperts, setActiveExperts] = useState<DbExpert[]>([]);

  useEffect(() => { fetchActiveExpertsRaw().then(setActiveExperts); }, []);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [zipFilter, setZipFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [leadSourceFilter, setLeadSourceFilter] = useState('all');
  const [expertFilter, setExpertFilter] = useState('all');
  const [emailSentFilter, setEmailSentFilter] = useState('all');
  const [membershipFilter, setMembershipFilter] = useState('all');

  // Row actions menu + cancel/delete dialogs
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [menuRow, setMenuRow] = useState<BookingRow | null>(null);
  const [cancelTarget, setCancelTarget] = useState<BookingRow | null>(null);
  const [cancelSaving, setCancelSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BookingRow | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

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

  const visibleBookings = bookings
    .filter((b) => leadSourceFilter === 'all' || getLeadSource(b) === leadSourceFilter)
    .filter((b) => expertFilter === 'all' || b.expert_name === expertFilter)
    .filter((b) => emailSentFilter === 'all' || String(Boolean(b.email_sent)) === emailSentFilter)
    .filter((b) => membershipFilter === 'all' || String(Boolean(b.membership_interest)) === membershipFilter);

  const hasActiveFilters =
    Boolean(search) ||
    statusFilter !== 'all' ||
    categoryFilter !== 'all' ||
    typeFilter !== 'all' ||
    Boolean(zipFilter) ||
    Boolean(dateFrom) ||
    Boolean(dateTo) ||
    leadSourceFilter !== 'all' ||
    expertFilter !== 'all' ||
    emailSentFilter !== 'all' ||
    membershipFilter !== 'all';

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setTypeFilter('all');
    setZipFilter('');
    setDateFrom('');
    setDateTo('');
    setLeadSourceFilter('all');
    setExpertFilter('all');
    setEmailSentFilter('all');
    setMembershipFilter('all');
  };

  const handleExport = () => {
    exportCsv('bookings.csv', visibleBookings, [
      { header: 'Request ID', value: (b) => b.request_number || 'Missing Request ID' },
      { header: 'Customer Name', value: (b) => displayCustomerName(b.customer_name) },
      { header: 'Email', value: (b) => b.email },
      { header: 'Phone', value: (b) => b.phone },
      { header: 'Service Category', value: (b) => b.service_category },
      { header: 'Product/Service', value: (b) => b.product_name },
      { header: 'Service Type', value: (b) => b.service_type },
      { header: 'Urgency', value: (b) => b.urgency },
      { header: 'Preferred Date', value: (b) => b.preferred_date },
      { header: 'Preferred Time', value: (b) => b.preferred_time },
      { header: 'Admin Status', value: (b) => b.admin_status ?? b.status },
      { header: 'Email Sent', value: (b) => Boolean(b.email_sent) },
      { header: 'Membership Interest', value: (b) => Boolean(b.membership_interest) },
      { header: 'Requested Expert', value: (b) => b.expert_name },
      { header: 'Assigned Expert', value: (b) => activeExperts.find((e) => e.id === b.expert_id)?.name ?? '' },
      { header: 'Created Date', value: (b) => b.created_at },
    ]);
  };

  const handleStatusChange = async (id: string, adminStatus: string) => {
    await updateAdminStatus(id, adminStatus);
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, admin_status: adminStatus } : b));
  };

  const handleAssignExpert = async (id: string, expertId: string | null) => {
    await assignExpert(id, expertId);
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, expert_id: expertId } : b));
  };

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, row: BookingRow) => {
    e.stopPropagation();
    setMenuAnchorEl(e.currentTarget);
    setMenuRow(row);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuRow(null);
  };

  const handleViewDetails = (row: BookingRow) => {
    setExpandedId((prev) => (prev === row.id ? null : (row.id ?? null)));
    handleMenuClose();
  };

  const handleOpenCancelDialog = (row: BookingRow) => {
    setCancelTarget(row);
    handleMenuClose();
  };

  const handleOpenDeleteDialog = (row: BookingRow) => {
    setDeleteTarget(row);
    setDeleteConfirmText('');
    handleMenuClose();
  };

  const handleConfirmCancel = async () => {
    if (!cancelTarget?.id) return;
    setCancelSaving(true);
    const { error } = await cancelServiceRequest(cancelTarget.id);
    setCancelSaving(false);
    if (error) {
      setSnackbar({ open: true, message: `Failed to cancel request: ${error}`, severity: 'error' });
      return;
    }
    setBookings((prev) => prev.map((b) => (
      b.id === cancelTarget.id ? { ...b, admin_status: 'Cancelled', status: 'Cancelled' } : b
    )));
    setCancelTarget(null);
    setSnackbar({ open: true, message: 'Request cancelled successfully.', severity: 'success' });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.id) return;
    setDeleteSaving(true);
    const { error } = await deleteServiceRequest(deleteTarget.id);
    setDeleteSaving(false);
    if (error) {
      setSnackbar({ open: true, message: `Failed to delete request: ${error}`, severity: 'error' });
      return;
    }
    setBookings((prev) => prev.filter((b) => b.id !== deleteTarget.id));
    setDeleteTarget(null);
    setSnackbar({ open: true, message: 'Request deleted successfully.', severity: 'success' });
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: fonts.heading, color: colors.navy, fontWeight: 800, mb: 0.5 }}>
            Bookings
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '0.9rem', mb: 3 }}>
            {visibleBookings.length} result{visibleBookings.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
            variant="outlined"
            sx={{ borderColor: colors.border, color: colors.darkText, fontFamily: fonts.body, fontWeight: 600, textTransform: 'none', borderRadius: '10px' }}
          >
            Clear Filters
          </Button>
          <Button
            onClick={handleExport}
            variant="outlined"
            sx={{ borderColor: colors.border, color: colors.darkText, fontFamily: fonts.body, fontWeight: 600, textTransform: 'none', borderRadius: '10px' }}
          >
            Export CSV
          </Button>
        </Box>
      </Box>

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
        {filterSelect('Lead Source', leadSourceFilter, setLeadSourceFilter, LEAD_SOURCES)}
        {filterSelect('Expert', expertFilter, setExpertFilter, EXPERTS.map((e) => e.name))}
        {filterSelect('Email Sent', emailSentFilter, setEmailSentFilter, ['true', 'false'])}
        {filterSelect('Membership', membershipFilter, setMembershipFilter, ['true', 'false'])}
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
      ) : visibleBookings.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, mb: hasActiveFilters ? 2 : 0 }}>
            {bookings.length === 0 ? 'No service requests yet' : 'No matching requests found'}
          </Typography>
          {hasActiveFilters && (
            <Button
              onClick={handleClearFilters}
              variant="outlined"
              sx={{ borderColor: colors.border, color: colors.darkText, fontFamily: fonts.body, fontWeight: 600, textTransform: 'none', borderRadius: '10px' }}
            >
              Clear Filters
            </Button>
          )}
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${colors.border}`, borderRadius: '16px', overflow: 'hidden' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                {['Request ID', 'Date', 'Customer', 'Service', 'ZIP', 'Urgency', 'Flags', 'Status', 'Actions'].map((h) => (
                  <TableCell key={h} sx={{ fontFamily: fonts.body, fontWeight: 700, color: colors.navy, fontSize: '0.75rem', py: 1.5 }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleBookings.map((b) => {
                const statusStyle = STATUS_COLOR[b.status] ?? { bg: '#F5F5F5', text: '#333' };
                const isExpanded = expandedId === b.id;
                const leadSource = getLeadSource(b);
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
                      <TableCell sx={{ fontFamily: fonts.body, fontSize: '0.75rem', fontWeight: 700, color: b.request_number ? colors.primaryBlue : '#B71C1C', whiteSpace: 'nowrap', py: 1.5, letterSpacing: '0.03em' }}>
                        {b.request_number || 'Missing Request ID'}
                      </TableCell>
                      <TableCell sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: colors.mutedText, whiteSpace: 'nowrap', py: 1.5 }}>
                        {fmt(b.created_at)}
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontFamily: fonts.body, fontWeight: 600, fontSize: '0.85rem', color: colors.darkText }}>
                          {displayCustomerName(b.customer_name)}
                        </Typography>
                        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.mutedText }}>{b.email}</Typography>
                        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.mutedText }}>{b.phone}</Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.darkText }}>{b.product_name || b.service_type}</Typography>
                        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.mutedText }}>{b.service_category} · {b.service_type}</Typography>
                        {leadSource === 'Matching Expert' && (
                          <Chip
                            label="Matching Expert Lead"
                            size="small"
                            sx={{ mt: 0.5, backgroundColor: '#EDE9FE', color: '#6D28D9', fontFamily: fonts.body, fontWeight: 700, fontSize: '0.65rem', height: 20 }}
                          />
                        )}
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
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          <Chip
                            label={b.email_sent ? 'Email Sent' : 'Email Pending'}
                            size="small"
                            sx={{ backgroundColor: b.email_sent ? '#E8F5E9' : '#FFF3E0', color: b.email_sent ? '#1B5E20' : '#E65100', fontFamily: fonts.body, fontSize: '0.65rem', height: 20 }}
                          />
                          {b.membership_interest && (
                            <Chip label="Membership" size="small" sx={{ backgroundColor: '#F3E5F5', color: '#4A148C', fontFamily: fonts.body, fontSize: '0.65rem', height: 20 }} />
                          )}
                          {(b.expert_id || b.expert_name) && (
                            <Chip label={activeExperts.find((e) => e.id === b.expert_id)?.name ?? b.expert_name ?? 'Expert'} size="small" sx={{ backgroundColor: colors.lightBlueBg, color: colors.primaryBlue, fontFamily: fonts.body, fontSize: '0.65rem', height: 20 }} />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Chip
                          label={b.status}
                          size="small"
                          sx={{ backgroundColor: statusStyle.bg, color: statusStyle.text, fontFamily: fonts.body, fontWeight: 700, fontSize: '0.72rem' }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }} onClick={(e) => e.stopPropagation()}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                          <IconButton size="small" onClick={() => setExpandedId(isExpanded ? null : (b.id ?? null))}>
                            {isExpanded ? <ExpandLessIcon sx={{ fontSize: 18 }} /> : <ExpandMoreIcon sx={{ fontSize: 18 }} />}
                          </IconButton>
                          <IconButton size="small" onClick={(e) => handleMenuOpen(e, b)}>
                            <MoreVertIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={9} sx={{ p: 0, border: 0 }}>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <RowDetail row={b} onStatusChange={handleStatusChange} activeExperts={activeExperts} onAssignExpert={handleAssignExpert} />
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

      {/* Row actions menu */}
      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => menuRow && handleViewDetails(menuRow)} sx={{ fontFamily: fonts.body, fontSize: '0.85rem' }}>
          <VisibilityOutlinedIcon sx={{ fontSize: 18, mr: 1, color: colors.mutedText }} /> View Details
        </MenuItem>
        <MenuItem
          onClick={() => menuRow && handleOpenCancelDialog(menuRow)}
          disabled={menuRow?.status === 'Cancelled'}
          sx={{ fontFamily: fonts.body, fontSize: '0.85rem', color: '#B45309' }}
        >
          <BlockOutlinedIcon sx={{ fontSize: 18, mr: 1 }} /> Cancel Request
        </MenuItem>
        <MenuItem onClick={() => menuRow && handleOpenDeleteDialog(menuRow)} sx={{ fontFamily: fonts.body, fontSize: '0.85rem', color: '#B71C1C' }}>
          <DeleteOutlineIcon sx={{ fontSize: 18, mr: 1 }} /> Delete Request
        </MenuItem>
      </Menu>

      {/* Cancel confirmation dialog */}
      <Dialog open={Boolean(cancelTarget)} onClose={() => setCancelTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: fonts.heading, color: colors.navy, fontWeight: 700 }}>Cancel Request?</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.88rem', color: colors.darkText, lineHeight: 1.6 }}>
            Are you sure you want to cancel this request? The request will remain in records but status will be changed to Cancelled.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCancelTarget(null)} sx={{ fontFamily: fonts.body, textTransform: 'none' }}>
            Keep Request
          </Button>
          <Button
            onClick={() => void handleConfirmCancel()}
            disabled={cancelSaving}
            variant="contained"
            sx={{
              backgroundColor: '#B45309', color: '#fff', fontFamily: fonts.body,
              fontWeight: 700, textTransform: 'none', borderRadius: '8px',
              '&:hover': { backgroundColor: '#92400E' },
            }}
          >
            {cancelSaving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : 'Cancel Request'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog — protected admin action */}
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: fonts.heading, color: '#B71C1C', fontWeight: 700 }}>Delete Request?</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.88rem', color: colors.darkText, lineHeight: 1.6, mb: 2 }}>
            This will permanently delete the request from admin records. This action cannot be undone.
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: colors.mutedText, mb: 1 }}>
            Type <strong>DELETE</strong> to confirm.
          </Typography>
          <TextField
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="DELETE"
            size="small"
            fullWidth
            autoFocus
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontFamily: fonts.body } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} sx={{ fontFamily: fonts.body, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={() => void handleConfirmDelete()}
            disabled={deleteSaving || deleteConfirmText.trim().toUpperCase() !== 'DELETE'}
            variant="contained"
            color="error"
            sx={{ fontFamily: fonts.body, fontWeight: 700, textTransform: 'none', borderRadius: '8px' }}
          >
            {deleteSaving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : 'Delete Permanently'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ fontFamily: fonts.body }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminBookingsPage;
