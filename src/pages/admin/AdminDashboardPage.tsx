import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, Paper, CircularProgress, Divider, Button,
} from '@mui/material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingIcon from '@mui/icons-material/Pending';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import { fetchBookingStats, BookingStats } from '../../lib/supabaseBookings';
import { colors, fonts } from '../../theme';

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

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<BookingStats | null>(null);

  useEffect(() => {
    fetchBookingStats().then(setStats);
  }, []);

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
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
              gap: 2,
              mb: 4,
            }}
          >
            <StatCard label="Total Bookings" value={stats.total} accent="#E3F2FD" icon={<FormatListBulletedIcon sx={{ color: '#0B3D91', fontSize: 22 }} />} to="/admin/bookings" />
            <StatCard label="New (unreviewed)" value={stats.newCount} accent="#FFF3E0" icon={<FiberNewIcon sx={{ color: '#E65100', fontSize: 22 }} />} to="/admin/bookings" />
            <StatCard label="Scheduled" value={stats.scheduled} accent="#E8F5E9" icon={<PendingIcon sx={{ color: '#1B5E20', fontSize: 22 }} />} to="/admin/bookings" />
            <StatCard label="In Progress" value={stats.inProgress} accent="#F3E5F5" icon={<BuildOutlinedIcon sx={{ color: '#4A148C', fontSize: 22 }} />} to="/admin/bookings" />
            <StatCard label="Completed" value={stats.completed} accent="#E0F2F1" icon={<CheckCircleOutlineIcon sx={{ color: '#004D40', fontSize: 22 }} />} to="/admin/bookings" />
            <StatCard label="Customers" value="—" accent="#EDE7F6" icon={<PeopleOutlineIcon sx={{ color: '#4527A0', fontSize: 22 }} />} to="/admin/customers" />
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
          </Box>
        </>
      )}
    </Box>
  );
};

export default AdminDashboardPage;
