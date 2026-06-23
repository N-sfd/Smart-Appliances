import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, CircularProgress, Switch, Button, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem,
  FormControl, InputLabel,
} from '@mui/material';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  fetchServices, fetchServiceCategories, createService, updateService, ServiceRow, ServiceCategoryRow,
} from '../../services/adminServices';
import { colors, fonts } from '../../theme';

const TYPE_COLOR: Record<string, { bg: string; text: string }> = {
  Repair: { bg: '#E3F2FD', text: '#0B3D91' },
  Installation: { bg: '#E8F5E9', text: '#1B5E20' },
  Maintenance: { bg: '#F3E5F5', text: '#4A148C' },
  Emergency: { bg: '#FEF2F2', text: '#DC2626' },
};

const SERVICE_TYPES = ['Repair', 'Installation', 'Maintenance', 'Emergency'];

interface FormState {
  id?: string;
  name: string;
  slug: string;
  category_id: string;
  service_type: string;
  description: string;
  is_emergency: boolean;
  is_active: boolean;
}

const emptyForm: FormState = {
  name: '', slug: '', category_id: '', service_type: 'Repair', description: '', is_emergency: false, is_active: true,
};

const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [categories, setCategories] = useState<ServiceCategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [s, c] = await Promise.all([fetchServices(), fetchServiceCategories()]);
    setServices(s);
    setCategories(c);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const openAdd = () => { setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (s: ServiceRow) => {
    setForm({
      id: s.id, name: s.name, slug: s.slug, category_id: s.category_id ?? '',
      service_type: s.service_type, description: s.description ?? '', is_emergency: s.is_emergency, is_active: s.is_active,
    });
    setDialogOpen(true);
  };

  const handleToggleActive = async (s: ServiceRow) => {
    await updateService(s.id, { is_active: !s.is_active });
    void load();
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) return;
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      category_id: form.category_id || null,
      service_type: form.service_type,
      description: form.description || null,
      is_emergency: form.is_emergency,
      is_active: form.is_active,
    };
    if (form.id) {
      await updateService(form.id, payload);
    } else {
      await createService(payload);
    }
    setSaving(false);
    setDialogOpen(false);
    void load();
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, mb: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <BuildOutlinedIcon sx={{ color: colors.primaryBlue, fontSize: 26 }} />
          <Typography variant="h4" sx={{ fontFamily: fonts.heading, color: colors.navy, fontWeight: 800 }}>
            Services
          </Typography>
        </Box>
        <Button
          onClick={openAdd}
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ backgroundColor: colors.primaryBlue, color: '#fff', fontFamily: fonts.body, fontWeight: 700, textTransform: 'none', borderRadius: '10px', '&:hover': { backgroundColor: colors.navy } }}
        >
          Add Service
        </Button>
      </Box>
      <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '0.9rem', mb: 3 }}>
        Services from your Supabase <code>services</code> table.
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : services.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, backgroundColor: '#fff', borderRadius: '16px', border: `1px solid ${colors.border}` }}>
          <BuildOutlinedIcon sx={{ fontSize: 48, color: colors.border, mb: 2 }} />
          <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText }}>
            No services found. Add one above, or run the seed SQL in Supabase.
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${colors.border}`, borderRadius: '16px', overflow: 'hidden' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                {['Name', 'Category', 'Type', 'Emergency', 'Active', 'Description', 'Actions'].map((h) => (
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
                      <Switch size="small" checked={s.is_active} onChange={() => void handleToggleActive(s)} />
                    </TableCell>
                    <TableCell sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: colors.mutedText, py: 1.5, maxWidth: 280 }}>
                      {s.description ?? '—'}
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <IconButton size="small" onClick={() => openEdit(s)}>
                        <EditOutlinedIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: fonts.heading, color: colors.navy, fontWeight: 700 }}>
          {form.id ? 'Edit Service' : 'Add Service'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} fullWidth size="small" />
          <TextField label="Slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))} fullWidth size="small" />
          <FormControl size="small" fullWidth>
            <InputLabel>Category</InputLabel>
            <Select value={form.category_id} label="Category" onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}>
              <MenuItem value="">None</MenuItem>
              {categories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel>Service Type</InputLabel>
            <Select value={form.service_type} label="Service Type" onChange={(e) => setForm((f) => ({ ...f, service_type: e.target.value }))}>
              {SERVICE_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} fullWidth size="small" multiline minRows={2} />
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.85rem' }}>Emergency</Typography>
              <Switch checked={form.is_emergency} onChange={() => setForm((f) => ({ ...f, is_emergency: !f.is_emergency }))} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.85rem' }}>Active</Typography>
              <Switch checked={form.is_active} onChange={() => setForm((f) => ({ ...f, is_active: !f.is_active }))} />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ fontFamily: fonts.body, textTransform: 'none' }}>Cancel</Button>
          <Button
            onClick={() => void handleSave()}
            disabled={saving || !form.name.trim() || !form.slug.trim()}
            variant="contained"
            sx={{ backgroundColor: colors.primaryBlue, fontFamily: fonts.body, textTransform: 'none', borderRadius: '8px' }}
          >
            {saving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminServicesPage;
