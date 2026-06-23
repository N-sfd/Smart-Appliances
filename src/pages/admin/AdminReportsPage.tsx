import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, CircularProgress, Table, TableBody, TableCell, TableRow,
} from '@mui/material';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import { fetchAdminReports, AdminReports } from '../../services/adminReports';
import { colors, fonts } from '../../theme';

const ReportCard: React.FC<{ title: string; rows: [string, number][] }> = ({ title, rows }) => (
  <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: `1px solid ${colors.border}`, flex: 1, minWidth: 260 }}>
    <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, color: colors.navy, mb: 1.5 }}>{title}</Typography>
    {rows.length === 0 ? (
      <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.mutedText }}>No data yet.</Typography>
    ) : (
      <Table size="small">
        <TableBody>
          {rows.map(([label, count]) => (
            <TableRow key={label}>
              <TableCell sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.darkText, border: 0, py: 0.6 }}>{label}</TableCell>
              <TableCell align="right" sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '0.82rem', color: colors.primaryBlue, border: 0, py: 0.6 }}>{count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )}
  </Paper>
);

const AdminReportsPage: React.FC = () => {
  const [data, setData] = useState<AdminReports | null>(null);

  useEffect(() => { fetchAdminReports().then(setData); }, []);

  if (!data) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <AssessmentOutlinedIcon sx={{ color: colors.primaryBlue, fontSize: 28 }} />
        <Typography variant="h4" sx={{ fontFamily: fonts.heading, color: colors.navy, fontWeight: 800 }}>
          Reports
        </Typography>
      </Box>
      <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '0.9rem', mb: 3 }}>
        Snapshot of booking activity across the platform.
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <ReportCard title="Bookings by Status" rows={Object.entries(data.byStatus)} />
        <ReportCard title="Bookings by Service Category" rows={Object.entries(data.byCategory)} />
        <ReportCard title="Bookings by Urgency" rows={Object.entries(data.byUrgency)} />
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <ReportCard title="Email Sent vs Pending" rows={[['Sent', data.emailSent], ['Pending', data.emailPending]]} />
        <ReportCard title="Membership Interested" rows={[['Interested', data.membershipInterested]]} />
        <ReportCard title="Top Requested Experts" rows={data.topExperts.map((e) => [e.name, e.count] as [string, number])} />
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <ReportCard title="New Leads by Day" rows={data.leadsByDay.map((d) => [d.day, d.count] as [string, number])} />
        <ReportCard title="Completed Requests by Month" rows={data.completedByMonth.map((m) => [m.month, m.count] as [string, number])} />
      </Box>
    </Box>
  );
};

export default AdminReportsPage;
