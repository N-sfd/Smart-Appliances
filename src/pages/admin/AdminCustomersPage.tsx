import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, CircularProgress, InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import { fetchCustomers, CustomerSummary } from '../../lib/supabaseBookings';
import { colors, fonts } from '../../theme';

const fmt = (iso?: string | null) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return iso;
  }
};

const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCustomers().then((rows) => {
      setCustomers(rows);
      setLoading(false);
    });
  }, []);

  const filtered = search.trim()
    ? customers.filter(
        (c) =>
          c.customer_name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          c.phone.includes(search) ||
          c.zip_code.includes(search),
      )
    : customers;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <PeopleOutlineIcon sx={{ color: colors.primaryBlue, fontSize: 28 }} />
        <Typography variant="h4" sx={{ fontFamily: fonts.heading, color: colors.navy, fontWeight: 800 }}>
          Customers
        </Typography>
      </Box>
      <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '0.9rem', mb: 3 }}>
        {filtered.length} customer{filtered.length !== 1 ? 's' : ''} (deduplicated by email)
      </Typography>

      <TextField
        placeholder="Search name, email, phone, ZIP…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        sx={{
          mb: 3, width: { xs: '100%', sm: 360 },
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

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText }}>No customers found.</Typography>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ border: `1px solid ${colors.border}`, borderRadius: '16px', overflow: 'hidden' }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                {['Name', 'Email', 'Phone', 'ZIP', 'Bookings', 'Last Booking'].map((h) => (
                  <TableCell
                    key={h}
                    sx={{ fontFamily: fonts.body, fontWeight: 700, color: colors.navy, fontSize: '0.78rem', py: 1.5 }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.email} sx={{ '&:hover': { backgroundColor: '#F8FAFC' } }}>
                  <TableCell sx={{ fontFamily: fonts.body, fontWeight: 600, fontSize: '0.85rem', color: colors.darkText, py: 1.5 }}>
                    {c.customer_name}
                  </TableCell>
                  <TableCell sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.mutedText, py: 1.5 }}>
                    {c.email}
                  </TableCell>
                  <TableCell sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.mutedText, py: 1.5, whiteSpace: 'nowrap' }}>
                    {c.phone}
                  </TableCell>
                  <TableCell sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.mutedText, py: 1.5 }}>
                    {c.zip_code}
                  </TableCell>
                  <TableCell sx={{ fontFamily: fonts.body, fontSize: '0.85rem', fontWeight: 700, color: colors.primaryBlue, py: 1.5 }}>
                    {c.booking_count}
                  </TableCell>
                  <TableCell sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.mutedText, py: 1.5, whiteSpace: 'nowrap' }}>
                    {fmt(c.last_booking)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminCustomersPage;
