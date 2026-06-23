import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress, Button, Switch, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, IconButton, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import {
  fetchAllExperts, createExpert, updateExpert, deleteExpert,
} from '../../services/adminExperts';
import { DbExpert } from '../../types/admin';
import { colors, fonts } from '../../theme';
import { exportCsv } from '../../utils/csvExport';

const AdminExpertsPage: React.FC = () => {
  const [experts, setExperts] = useState<DbExpert[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DbExpert | null>(null);

  const load = async () => {
    setLoading(true);
    setExperts(await fetchAllExperts());
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const handleToggle = async (expert: DbExpert, field: 'is_active' | 'is_featured') => {
    await updateExpert(expert.id, { [field]: !expert[field] });
    void load();
  };

  const handleAdd = async () => {
    if (!newName.trim() || !newSlug.trim()) return;
    setSaving(true);
    await createExpert({
      slug: newSlug.trim(),
      name: newName.trim(),
      title: newTitle.trim() || null,
      bio: null,
      avatar_url: null,
      rating: 0,
      review_count: 0,
      jobs_completed: null,
      response_time: null,
      service_areas: [],
      specialties: [],
      starting_fee: null,
      is_active: true,
      is_featured: false,
      display_order: experts.length,
    });
    setSaving(false);
    setAddOpen(false);
    setNewName(''); setNewSlug(''); setNewTitle('');
    void load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteExpert(deleteTarget.id);
    setDeleteTarget(null);
    void load();
  };

  const handleExport = () => {
    exportCsv('experts.csv', experts, [
      { header: 'Name', value: (e) => e.name },
      { header: 'Slug', value: (e) => e.slug },
      { header: 'Title', value: (e) => e.title },
      { header: 'Rating', value: (e) => e.rating },
      { header: 'Review Count', value: (e) => e.review_count },
      { header: 'Jobs Completed', value: (e) => e.jobs_completed },
      { header: 'Response Time', value: (e) => e.response_time },
      { header: 'Service Areas', value: (e) => (e.service_areas ?? []).join('; ') },
      { header: 'Active', value: (e) => e.is_active },
      { header: 'Featured', value: (e) => e.is_featured },
    ]);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5, flexWrap: 'wrap', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <BadgeOutlinedIcon sx={{ color: colors.primaryBlue, fontSize: 28 }} />
          <Typography variant="h4" sx={{ fontFamily: fonts.heading, color: colors.navy, fontWeight: 800 }}>
            Experts
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            onClick={handleExport}
            variant="outlined"
            sx={{ borderColor: colors.border, color: colors.darkText, fontFamily: fonts.body, fontWeight: 600, textTransform: 'none', borderRadius: '10px' }}
          >
            Export CSV
          </Button>
          <Button
            onClick={() => setAddOpen(true)}
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ backgroundColor: colors.primaryBlue, color: '#fff', fontFamily: fonts.body, fontWeight: 700, textTransform: 'none', borderRadius: '10px', '&:hover': { backgroundColor: colors.navy } }}
          >
            Add Expert
          </Button>
        </Box>
      </Box>
      <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '0.9rem', mb: 3 }}>
        {experts.length} expert{experts.length !== 1 ? 's' : ''}
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      ) : experts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, backgroundColor: '#fff', borderRadius: '16px', border: `1px solid ${colors.border}` }}>
          <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText }}>
            No experts in the database yet. Add one, or the public site will keep using the built-in expert profiles.
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${colors.border}`, borderRadius: '16px', overflow: 'hidden' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                {['Name', 'Title', 'Rating', 'Reviews', 'Jobs', 'Response', 'Service Areas', 'Active', 'Featured', 'Actions'].map((h) => (
                  <TableCell key={h} sx={{ fontFamily: fonts.body, fontWeight: 700, color: colors.navy, fontSize: '0.72rem', py: 1.5 }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {experts.map((e) => (
                <TableRow key={e.id} sx={{ '&:hover': { backgroundColor: '#F8FAFC' } }}>
                  <TableCell sx={{ py: 1.5 }}>
                    <Typography
                      component={RouterLink}
                      to={`/admin/experts/${e.id}`}
                      sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '0.85rem', color: colors.primaryBlue, textDecoration: 'none' }}
                    >
                      {e.name}
                    </Typography>
                    <Typography sx={{ fontFamily: fonts.body, fontSize: '0.72rem', color: colors.mutedText }}>{e.slug}</Typography>
                  </TableCell>
                  <TableCell sx={{ fontFamily: fonts.body, fontSize: '0.8rem', color: colors.darkText, py: 1.5 }}>{e.title ?? '—'}</TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                      <StarIcon sx={{ fontSize: 14, color: '#F59E0B' }} />
                      <Typography sx={{ fontFamily: fonts.body, fontSize: '0.8rem', color: colors.darkText }}>{e.rating}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontFamily: fonts.body, fontSize: '0.8rem', color: colors.darkText, py: 1.5 }}>{e.review_count}</TableCell>
                  <TableCell sx={{ fontFamily: fonts.body, fontSize: '0.8rem', color: colors.darkText, py: 1.5 }}>{e.jobs_completed ?? '—'}</TableCell>
                  <TableCell sx={{ fontFamily: fonts.body, fontSize: '0.8rem', color: colors.darkText, py: 1.5 }}>{e.response_time ?? '—'}</TableCell>
                  <TableCell sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: colors.mutedText, py: 1.5, maxWidth: 180 }}>
                    {(e.service_areas ?? []).join(', ') || '—'}
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Switch size="small" checked={e.is_active} onChange={() => void handleToggle(e, 'is_active')} />
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Switch size="small" checked={e.is_featured} onChange={() => void handleToggle(e, 'is_featured')} />
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Tooltip title="Edit">
                      <IconButton component={RouterLink} to={`/admin/experts/${e.id}`} size="small">
                        <EditOutlinedIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => setDeleteTarget(e)}>
                        <DeleteOutlineIcon sx={{ fontSize: 18, color: '#DC2626' }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: fonts.heading, color: colors.navy, fontWeight: 700 }}>Add Expert</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Name" value={newName} onChange={(e) => setNewName(e.target.value)} fullWidth size="small" />
          <TextField label="Slug" value={newSlug} onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} fullWidth size="small" helperText="Used in the public URL: /experts/your-slug" />
          <TextField label="Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} fullWidth size="small" />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAddOpen(false)} sx={{ fontFamily: fonts.body, textTransform: 'none' }}>Cancel</Button>
          <Button
            onClick={() => void handleAdd()}
            disabled={saving || !newName.trim() || !newSlug.trim()}
            variant="contained"
            sx={{ backgroundColor: colors.primaryBlue, fontFamily: fonts.body, textTransform: 'none', borderRadius: '8px' }}
          >
            {saving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: fonts.heading, color: colors.navy, fontWeight: 700 }}>Delete Expert?</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.88rem', color: colors.darkText }}>
            This permanently deletes <strong>{deleteTarget?.name}</strong> along with their services and reviews. This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} sx={{ fontFamily: fonts.body, textTransform: 'none' }}>Cancel</Button>
          <Button onClick={() => void handleDelete()} variant="contained" color="error" sx={{ fontFamily: fonts.body, textTransform: 'none', borderRadius: '8px' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminExpertsPage;
