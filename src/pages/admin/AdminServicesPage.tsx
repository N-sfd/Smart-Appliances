import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, CircularProgress,
} from '@mui/material';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { colors, fonts } from '../../theme';

interface ServiceRow {
  id: string;
  name: string;
  slug: string;
  service_type: string;
  description: string | null;
  is_emergency: boolean;
  is_active: boolean;
  category_name?: string;
}

const TYPE_COLOR: Record<string, { bg: string; text: string }> = {
  Repair: { bg: '#E3F2FD', text: '#0B3D91' },
  Installation: { bg: '#E8F5E9', text: '#1B5E20' },
  Maintenance: { bg: '#F3E5F5', text: '#4A148C' },
  Emergency: { bg: '#FEF2F2', text: '#DC2626' },
};

const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!isSupabaseConfigured() || !supabase) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('services')
        .select('*, service_categories(name)')
        .order('name');
      if (!error && data) {
        setServices(
          (data as (ServiceRow & { service_categories: { name: string } | null })[]).map((r) => ({
            ...r,
            category_name: r.service_categories?.name ?? '—',
          })),
        );
      }
      setLoading(false);
    };
    void load();
  }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <BuildOutlinedIcon sx={{ color: colors.primaryBlue, fontSize: 26 }} />
        <Typography variant="h4" sx={{ fontFamily: fonts.heading, color: colors.navy, fontWeight: 800 }}>
          Services
        </Typography>
      </Box>
      <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '0.9rem', mb: 3 }}>
        Services seeded from your Supabase <code>services</code> table.
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : services.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center', py: 8, backgroundColor: '#fff', borderRadius: '16px',
            border: `1px solid ${colors.border}`,
          }}
        >
          <BuildOutlinedIcon sx={{ fontSize: 48, color: colors.border, mb: 2 }} />
          <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText }}>
            No services found. Run the seed SQL in Supabase to populate this table.
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${colors.border}`, borderRadius: '16px', overflow: 'hidden' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                {['Name', 'Category', 'Type', 'Emergency', 'Active', 'Description'].map((h) => (
                  <TableCell key={h} sx={{ fontFamily: fonts.body, fontWeight: 700, color: colors.navy, fontSize: '0.75rem', py: 1.5 }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((s) => {
                const typeStyle = TYPE_COLOR[s.service_type] ?? { bg: '#F5F5F5', text: '#333' };
                return (
                  <TableRow key={s.id} sx={{ '&:hover': { backgroundColor: '#F8FAFC' } }}>
                    <TableCell sx={{ fontFamily: fonts.body, fontWeight: 600, fontSize: '0.85rem', color: colors.darkText, py: 1.5 }}>
                      {s.name}
                    </TableCell>
                    <TableCell sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.mutedText, py: 1.5 }}>
                      {s.category_name}
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Chip
                        label={s.service_type}
                        size="small"
                        sx={{ backgroundColor: typeStyle.bg, color: typeStyle.text, fontFamily: fonts.body, fontWeight: 700, fontSize: '0.72rem' }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      {s.is_emergency ? (
                        <Chip label="Yes" size="small" sx={{ backgroundColor: '#FEF2F2', color: '#DC2626', fontFamily: fonts.body, fontWeight: 700, fontSize: '0.72rem' }} />
                      ) : (
                        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: colors.mutedText }}>—</Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Chip
                        label={s.is_active ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{
                          backgroundColor: s.is_active ? '#E8F5E9' : '#FAFAFA',
                          color: s.is_active ? '#1B5E20' : '#616161',
                          fontFamily: fonts.body, fontWeight: 700, fontSize: '0.72rem',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: colors.mutedText, py: 1.5, maxWidth: 300 }}>
                      {s.description ?? '—'}
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

export default AdminServicesPage;
