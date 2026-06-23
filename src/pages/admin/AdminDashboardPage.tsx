import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, Paper, CircularProgress, Divider, Button, Chip,
} from '@mui/material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingIcon from '@mui/icons-material/Pending';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import AddIcon from '@mui/icons-material/Add';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { fetchBookingStats, fetchAllBookings, BookingStats, BookingRow } from '../../lib/supabaseBookings';
import { colors, fonts } from '../../theme';
import { exportCsv } from '../../utils/csvExport';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accent: string;
  to?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, accent, to }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3, borderRadius: '16px', border: `1px solid ${colors.border}`,
      display: 'flex', alignItems: 'flex-start', gap: 2,
      transition: 'box-shadow 0.2s',
      '&:hover': to ? { boxShadow: '0 8px 24px rgba(10,37,64,0.10)', cursor: 'pointer' } : {},
    }}
    component={to ? RouterLink : 'div'}
    {...(to ? { to } : {})}
    style={{ textDecoration: 'none' }}
  >
    <Box
      sx={{
        width: 48, height: 48, borderRadius: '12px', backgroundColor: accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography sx={{ fontFamily: fonts.body, fontSize: '0.8rem', color: colors.mutedText, mb: 0.25 }}>
        {label}
      </Typography>
      <Typography sx={{ fontFamily: fonts.heading, fontSize: '1.8rem', fontWeight: 800, color: colors.navy, lineHeight: 1 }}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

const fmt = (iso?: string) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return iso; }
};

const ActivityList: React.FC<{ title: string; rows: BookingRow[] }> = ({ title, rows }) => (
  <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: `1px solid ${colors.border}`, flex: 1, minWidth: 280 }}>
    <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, color: colors.navy, mb: 1.5 }}>{title}</Typography>
    {rows.length === 0 ? (
      <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.mutedText }}>No records yet.</Typography>
    ) : (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {rows.map((b) => (
          <Box key={b.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.75, borderBottom: `1px solid ${colors.border}` }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontFamily: fonts.body, fontWeight: 600, fontSize: '0.82rem', color: colors.darkText, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {b.customer_name?.trim() || 'Guest Customer'}
              </Typography>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.72rem', color: colors.mutedText }}>{fmt(b.created_at)}</Typography>
            </Box>
            <Chip label={b.admin_status ?? b.status} size="small" sx={{ backgroundColor: colors.lightBlueBg, color: colors.primaryBlue, fontFamily: fonts.body, fontSize: '0.68rem', height: 20 }} />
          </Box>
        ))}
      </Box>
    )}
  </Paper>
);

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<BookingRow[]>([]);
  const [recentLeads, setRecentLeads] = useState<BookingRow[]>([]);

  useEffect(() => {
    fetchBookingStats().then(setStats);
    fetchAllBookings().then((rows) => {
      setRecentBookings(rows.slice(0, 10));
      setRecentLeads(rows.filter((r) => (r.admin_status ?? r.status) === 'New' || r.admin_status === 'New Lead').slice(0, 10));
    });
  }, []);

  const handleExportAll = async () => {
    const rows = await fetchAllBookings();
    exportCsv('all-bookings.csv', rows, [
      { header: 'Request ID', value: (b) => b.request_number },
      { header: 'Customer Name', value: (b) => b.customer_name },
      { header: 'Email', value: (b) => b.email },
      { header: 'Phone', value: (b) => b.phone },
      { header: 'Status', value: (b) => b.admin_status ?? b.status },
      { header: 'Created Date', value: (b) => b.created_at },
    ]);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: fonts.heading, color: colors.navy, fontWeight: 800 }}>
          Dashboard
        </Typography>
        <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '0.9rem', mt: 0.25 }}>
          Overview of all service requests.
        </Typography>
      </Box>

      {!stats ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
              gap: 2,
              mb: 4,
            }}
          >
            <StatCard label="Total Bookings" value={stats.total} accent="#E3F2FD" icon={<FormatListBulletedIcon sx={{ color: '#0B3D91', fontSize: 22 }} />} to="/admin/bookings" />
            <StatCard label="New Leads" value={stats.newLeads} accent="#FFF3E0" icon={<FiberNewIcon sx={{ color: '#E65100', fontSize: 22 }} />} to="/admin/bookings" />
            <StatCard label="Scheduled" value={stats.scheduled} accent="#E8F5E9" icon={<PendingIcon sx={{ color: '#1B5E20', fontSize: 22 }} />} to="/admin/bookings" />
            <StatCard label="In Progress" value={stats.inProgress} accent="#F3E5F5" icon={<BuildOutlinedIcon sx={{ color: '#4A148C', fontSize: 22 }} />} to="/admin/bookings" />
            <StatCard label="Completed" value={stats.completed} accent="#E0F2F1" icon={<CheckCircleOutlineIcon sx={{ color: '#004D40', fontSize: 22 }} />} to="/admin/bookings" />
            <StatCard label="Cancelled" value={stats.cancelled} accent="#FAFAFA" icon={<CancelOutlinedIcon sx={{ color: '#616161', fontSize: 22 }} />} to="/admin/bookings" />
            <StatCard label="Emergency Requests" value={stats.emergency} accent="#FEF2F2" icon={<WarningAmberIcon sx={{ color: '#DC2626', fontSize: 22 }} />} to="/admin/bookings" />
            <StatCard label="Email Sent" value={stats.emailSent} accent="#E8F5E9" icon={<MarkEmailReadOutlinedIcon sx={{ color: '#1B5E20', fontSize: 22 }} />} to="/admin/bookings" />
            <StatCard label="Email Pending" value={stats.emailPending} accent="#FFF3E0" icon={<MarkEmailUnreadOutlinedIcon sx={{ color: '#E65100', fontSize: 22 }} />} to="/admin/bookings" />
            <StatCard label="Membership Interested" value={stats.membershipInterested} accent="#F3E5F5" icon={<CardMembershipOutlinedIcon sx={{ color: '#4A148C', fontSize: 22 }} />} to="/admin/membership" />
            <StatCard label="Expert Requested" value={stats.expertRequestedCount} accent="#E3F2FD" icon={<BadgeOutlinedIcon sx={{ color: '#0B3D91', fontSize: 22 }} />} to="/admin/experts" />
            <StatCard label="Customers" value="—" accent="#EDE7F6" icon={<PeopleOutlineIcon sx={{ color: '#4527A0', fontSize: 22 }} />} to="/admin/customers" />
            <StatCard label="Estimated Revenue" value={`$${stats.estimatedRevenue.toFixed(2)}`} accent="#E0F2F1" icon={<AttachMoneyIcon sx={{ color: '#004D40', fontSize: 22 }} />} to="/admin/bookings" />
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
            <ActivityList title="Latest 10 Bookings" rows={recentBookings} />
            <ActivityList title="Latest 10 Leads" rows={recentLeads} />
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              component={RouterLink}
              to="/admin/bookings"
              variant="contained"
              sx={{
                backgroundColor: colors.primaryBlue, color: '#fff', fontFamily: fonts.body,
                fontWeight: 700, textTransform: 'none', borderRadius: '10px',
                '&:hover': { backgroundColor: colors.navy },
              }}
            >
              View All Bookings
            </Button>
            <Button
              component={RouterLink}
              to="/admin/experts"
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{
                borderColor: colors.border, color: colors.darkText, fontFamily: fonts.body,
                fontWeight: 600, textTransform: 'none', borderRadius: '10px',
                '&:hover': { borderColor: colors.navy },
              }}
            >
              Add Expert
            </Button>
            <Button
              component={RouterLink}
              to="/admin/customers"
              variant="outlined"
              sx={{
                borderColor: colors.border, color: colors.darkText, fontFamily: fonts.body,
                fontWeight: 600, textTransform: 'none', borderRadius: '10px',
                '&:hover': { borderColor: colors.navy },
              }}
            >
              View Customers
            </Button>
            <Button
              onClick={() => void handleExportAll()}
              variant="outlined"
              sx={{
                borderColor: colors.border, color: colors.darkText, fontFamily: fonts.body,
                fontWeight: 600, textTransform: 'none', borderRadius: '10px',
                '&:hover': { borderColor: colors.navy },
              }}
            >
              Export Bookings CSV
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AdminDashboardPage;
