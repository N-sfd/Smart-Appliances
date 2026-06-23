import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, CircularProgress, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Switch, Rating,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import {
  fetchExpertById, updateExpert, fetchExpertServices, upsertExpertService, deleteExpertService,
  fetchExpertReviews, upsertExpertReview, deleteExpertReview,
} from '../../services/adminExperts';
import { DbExpert, DbExpertService, DbExpertReview } from '../../types/admin';
import { colors, fonts } from '../../theme';

const field = (label: string, value: string, onChange: (v: string) => void, opts?: { multiline?: boolean; type?: string }) => (
  <TextField
    label={label}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    fullWidth
    size="small"
    multiline={opts?.multiline}
    minRows={opts?.multiline ? 3 : undefined}
    type={opts?.type}
    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: fonts.body } }}
  />
);

const AdminExpertDetailPage: React.FC = () => {
  const { expertId } = useParams<{ expertId: string }>();
  const navigate = useNavigate();
  const [expert, setExpert] = useState<DbExpert | null>(null);
  const [services, setServices] = useState<DbExpertService[]>([]);
  const [reviews, setReviews] = useState<DbExpertReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    if (!expertId) return;
    setLoading(true);
    const [e, s, r] = await Promise.all([
      fetchExpertById(expertId),
      fetchExpertServices(expertId),
      fetchExpertReviews(expertId),
    ]);
    setExpert(e);
    setServices(s);
    setReviews(r);
    setLoading(false);
  };

  useEffect(() => { void load(); }, [expertId]); // eslint-disable-line react-hooks/exhaustive-deps

  const patch = (p: Partial<DbExpert>) => setExpert((prev) => (prev ? { ...prev, ...p } : prev));

  const handleSave = async () => {
    if (!expert) return;
    setSaving(true);
    await updateExpert(expert.id, {
      name: expert.name,
      slug: expert.slug,
      title: expert.title,
      bio: expert.bio,
      avatar_url: expert.avatar_url,
      rating: expert.rating,
      review_count: expert.review_count,
      jobs_completed: expert.jobs_completed,
      response_time: expert.response_time,
      service_areas: expert.service_areas,
      specialties: expert.specialties,
      starting_fee: expert.starting_fee,
      is_active: expert.is_active,
      is_featured: expert.is_featured,
      display_order: expert.display_order,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddService = async () => {
    if (!expert) return;
    await upsertExpertService({ expert_id: expert.id, service_name: 'New Service', display_order: services.length });
    void load();
  };

  const handleAddReview = async () => {
    if (!expert) return;
    await upsertExpertReview({ expert_id: expert.id, customer_first_name: 'Customer', rating: 5, is_demo: true });
    void load();
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  }
  if (!expert) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText }}>Expert not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/experts')} sx={{ mb: 2, fontFamily: fonts.body, textTransform: 'none', color: colors.mutedText }}>
        Back to Experts
      </Button>
      <Typography variant="h4" sx={{ fontFamily: fonts.heading, color: colors.navy, fontWeight: 800, mb: 3 }}>
        {expert.name}
      </Typography>

      <Paper elevation={0} sx={{ p: 3, border: `1px solid ${colors.border}`, borderRadius: '16px', mb: 3 }}>
        <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, color: colors.navy, mb: 2 }}>Profile</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          {field('Name', expert.name, (v) => patch({ name: v }))}
          {field('Slug', expert.slug, (v) => patch({ slug: v.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
          {field('Title', expert.title ?? '', (v) => patch({ title: v }))}
          {field('Avatar/Image URL', expert.avatar_url ?? '', (v) => patch({ avatar_url: v }))}
          {field('Jobs Completed', expert.jobs_completed ?? '', (v) => patch({ jobs_completed: v }))}
          {field('Response Time', expert.response_time ?? '', (v) => patch({ response_time: v }))}
          {field('Rating', String(expert.rating), (v) => patch({ rating: Number(v) || 0 }), { type: 'number' })}
          {field('Review Count', String(expert.review_count), (v) => patch({ review_count: Number(v) || 0 }), { type: 'number' })}
          {field('Starting Fee', String(expert.starting_fee ?? ''), (v) => patch({ starting_fee: v ? Number(v) : null }), { type: 'number' })}
          {field('Display Order', String(expert.display_order), (v) => patch({ display_order: Number(v) || 0 }), { type: 'number' })}
          {field('Service Areas (comma-separated)', (expert.service_areas ?? []).join(', '), (v) => patch({ service_areas: v.split(',').map((s) => s.trim()).filter(Boolean) }))}
          {field('Specialties (comma-separated)', (expert.specialties ?? []).join(', '), (v) => patch({ specialties: v.split(',').map((s) => s.trim()).filter(Boolean) }))}
        </Box>
        <Box sx={{ mt: 2 }}>
          {field('Bio / About', expert.bio ?? '', (v) => patch({ bio: v }), { multiline: true })}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.85rem' }}>Active</Typography>
            <Switch checked={expert.is_active} onChange={() => patch({ is_active: !expert.is_active })} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.85rem' }}>Featured</Typography>
            <Switch checked={expert.is_featured} onChange={() => patch({ is_featured: !expert.is_featured })} />
          </Box>
        </Box>
        <Button
          onClick={() => void handleSave()}
          disabled={saving}
          variant="contained"
          sx={{ mt: 3, backgroundColor: saved ? colors.success : colors.primaryBlue, color: '#fff', fontFamily: fonts.body, fontWeight: 700, textTransform: 'none', borderRadius: '10px', '&:hover': { backgroundColor: colors.navy } }}
        >
          {saving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : saved ? 'Saved!' : 'Save Profile'}
        </Button>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, border: `1px solid ${colors.border}`, borderRadius: '16px', mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, color: colors.navy }}>Services Offered</Typography>
          <Button size="small" startIcon={<AddIcon />} onClick={() => void handleAddService()} sx={{ fontFamily: fonts.body, textTransform: 'none' }}>
            Add Service
          </Button>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['Service Name', 'Category', 'Type', 'Starting Price', 'Quote Required', ''].map((h) => (
                  <TableCell key={h} sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '0.72rem', color: colors.navy }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((s) => (
                <ServiceRow key={s.id} service={s} onChange={() => void load()} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, border: `1px solid ${colors.border}`, borderRadius: '16px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, color: colors.navy }}>Reviews</Typography>
          <Button size="small" startIcon={<AddIcon />} onClick={() => void handleAddReview()} sx={{ fontFamily: fonts.body, textTransform: 'none' }}>
            Add Review
          </Button>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['First Name', 'Rating', 'Service Type', 'Review Text', 'Date', 'Verified', 'Demo', ''].map((h) => (
                  <TableCell key={h} sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '0.72rem', color: colors.navy }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.map((r) => (
                <ReviewRow key={r.id} review={r} onChange={() => void load()} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

const ServiceRow: React.FC<{ service: DbExpertService; onChange: () => void }> = ({ service, onChange }) => {
  const [s, setS] = useState(service);
  const save = async (patch: Partial<DbExpertService>) => {
    const next = { ...s, ...patch };
    setS(next);
    await upsertExpertService(next);
  };
  return (
    <TableRow>
      <TableCell><TextField size="small" variant="standard" value={s.service_name} onChange={(e) => void save({ service_name: e.target.value })} /></TableCell>
      <TableCell><TextField size="small" variant="standard" value={s.service_category ?? ''} onChange={(e) => void save({ service_category: e.target.value })} /></TableCell>
      <TableCell><TextField size="small" variant="standard" value={s.service_type ?? ''} onChange={(e) => void save({ service_type: e.target.value })} /></TableCell>
      <TableCell><TextField size="small" variant="standard" type="number" value={s.starting_price ?? ''} onChange={(e) => void save({ starting_price: e.target.value ? Number(e.target.value) : null })} /></TableCell>
      <TableCell><Switch size="small" checked={s.quote_required} onChange={() => void save({ quote_required: !s.quote_required })} /></TableCell>
      <TableCell>
        <IconButton size="small" onClick={async () => { await deleteExpertService(s.id); onChange(); }}>
          <DeleteOutlineIcon sx={{ fontSize: 16, color: '#DC2626' }} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

const ReviewRow: React.FC<{ review: DbExpertReview; onChange: () => void }> = ({ review, onChange }) => {
  const [r, setR] = useState(review);
  const save = async (patch: Partial<DbExpertReview>) => {
    const next = { ...r, ...patch };
    setR(next);
    await upsertExpertReview(next);
  };
  return (
    <TableRow>
      <TableCell><TextField size="small" variant="standard" value={r.customer_first_name ?? ''} onChange={(e) => void save({ customer_first_name: e.target.value })} /></TableCell>
      <TableCell><Rating size="small" value={r.rating ?? 0} onChange={(_, v) => void save({ rating: v })} /></TableCell>
      <TableCell><TextField size="small" variant="standard" value={r.service_type ?? ''} onChange={(e) => void save({ service_type: e.target.value })} /></TableCell>
      <TableCell sx={{ minWidth: 220 }}><TextField size="small" variant="standard" fullWidth value={r.review_text ?? ''} onChange={(e) => void save({ review_text: e.target.value })} /></TableCell>
      <TableCell><TextField size="small" variant="standard" type="date" value={r.review_date ?? ''} onChange={(e) => void save({ review_date: e.target.value })} /></TableCell>
      <TableCell><Switch size="small" checked={r.is_verified} onChange={() => void save({ is_verified: !r.is_verified })} /></TableCell>
      <TableCell><Switch size="small" checked={r.is_demo} onChange={() => void save({ is_demo: !r.is_demo })} /></TableCell>
      <TableCell>
        <IconButton size="small" onClick={async () => { await deleteExpertReview(r.id); onChange(); }}>
          <DeleteOutlineIcon sx={{ fontSize: 16, color: '#DC2626' }} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default AdminExpertDetailPage;
