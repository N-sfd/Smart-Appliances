import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, CircularProgress, Button, Select, MenuItem, TextField,
} from '@mui/material';
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined';
import { fetchMembershipLeads, updateMembershipStatus } from '../../services/adminMembership';
import { MembershipLead } from '../../types/admin';
import { colors, fonts } from '../../theme';
import { exportCsv } from '../../utils/csvExport';

const STATUS_OPTIONS = ['Interested', 'Contacted', 'Converted', 'Not Interested'];
const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  Interested: { bg: '#E3F2FD', text: '#0B3D91' },
  Contacted: { bg: '#FFF3E0', text: '#E65100' },
  Converted: { bg: '#E8F5E9', text: '#1B5E20' },
  'Not Interested': { bg: '#FAFAFA', text: '#616161' },
};

const fmt = (iso?: string) => {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); }
  catch { return iso; }
};

const AdminMembershipPage: React.FC = () => {
  const [leads, setLeads] = useState<MembershipLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    setLeads(await fetchMembershipLeads());
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    await updateMembershipStatus(id, status);
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, membership_status: status } : l)));
  };

  const filtered = leads.filter((l) =>
    !search.trim() ||
    l.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    l.email?.toLowerCase().includes(search.toLowerCase()) ||
    l.phone?.includes(search),
  );

  const handleExport = () => {
    exportCsv('membership-leads.csv', filtered, [
      { header: 'Customer Name', value: (l) => l.customer_name },
      { header: 'Email', value: (l) => l.email },
      { header: 'Phone', value: (l) => l.phone },
      { header: 'Selected Plan', value: (l) => l.selected_membership_plan },
      { header: 'Related Request ID', value: (l) => l.request_number },
      { header: 'Created Date', value: (l) => l.created_at },
      { header: 'Status', value: (l) => l.membership_status },
    ]);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, mb: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CardMembershipOutlinedIcon sx={{ color: colors.primaryBlue, fontSize: 28 }} />
          <Typography variant="h4" sx={{ fontFamily: fonts.heading, color: colors.navy, fontWeight: 800 }}>
            Membership Leads
          </Typography>
        </Box>
        <Button onClick={handleExport} variant="outlined" sx={{ borderColor: colors.border, color: colors.darkText, fontFamily: fonts.body, fontWeight: 600, textTransform: 'none', borderRadius: '10px' }}>
          Export CSV
        </Button>
      </Box>
      <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '0.9rem', mb: 3 }}>
        {filtered.length} lead{filtered.length !== 1 ? 's' : ''}
      </Typography>

      <TextField
        placeholder="Search name, email, phone…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        sx={{ mb: 3, width: { xs: '100%', sm: 360 }, '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: fonts.body } }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, backgroundColor: '#fff', borderRadius: '16px', border: `1px solid ${colors.border}` }}>
          <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText }}>No membership leads yet.</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${colors.border}`, borderRadius: '16px', overflow: 'hidden' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                {['Customer', 'Email', 'Phone', 'Selected Plan', 'Request ID', 'Created', 'Status'].map((h) => (
                  <TableCell key={h} sx={{ fontFamily: fonts.body, fontWeight: 700, color: colors.navy, fontSize: '0.75rem', py: 1.5 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((l) => {
                const style = STATUS_COLOR[l.membership_status] ?? { bg: '#F5F5F5', text: '#333' };
                return (
                  <TableRow key={l.id} sx={{ '&:hover': { backgroundColor: '#F8FAFC' } }}>
                    <TableCell sx={{ fontFamily: fonts.body, fontWeight: 600, fontSize: '0.85rem', color: colors.darkText, py: 1.5 }}>{l.customer_name}</TableCell>
                    <TableCell sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.mutedText, py: 1.5 }}>{l.email}</TableCell>
                    <TableCell sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.mutedText, py: 1.5 }}>{l.phone}</TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      {l.selected_membership_plan ? (
                        <Chip label={l.selected_membership_plan} size="small" sx={{ backgroundColor: colors.lightBlueBg, color: colors.primaryBlue, fontFamily: fonts.body, fontSize: '0.72rem' }} />
                      ) : '—'}
                    </TableCell>
                    <TableCell sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: colors.primaryBlue, fontWeight: 700, py: 1.5 }}>{l.request_number ?? '—'}</TableCell>
                    <TableCell sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: colors.mutedText, py: 1.5, whiteSpace: 'nowrap' }}>{fmt(l.created_at)}</TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Select
                        value={l.membership_status}
                        onChange={(e) => void handleStatusChange(l.id, e.target.value)}
                        size="small"
                        sx={{
                          borderRadius: '8px', fontFamily: fonts.body, fontSize: '0.78rem',
                          backgroundColor: style.bg, color: style.text, fontWeight: 700,
                          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        }}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <MenuItem key={s} value={s} sx={{ fontFamily: fonts.body, fontSize: '0.82rem' }}>{s}</MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminMembershipPage;
