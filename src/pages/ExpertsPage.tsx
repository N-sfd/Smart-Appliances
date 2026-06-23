import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Container, Button, TextField, FormControl, InputLabel, Select, MenuItem,
  Chip, InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import { colors, fonts } from '../theme';
import { EXPERTS, Expert } from '../data/experts';
import { SchedulerServiceCategory } from '../data/schedulerPrefill';
import ExpertCard from '../components/experts/ExpertCard';
import { fetchActiveExpertsWithDetails } from '../services/adminExperts';

const TRUST_BADGES = [
  { label: 'Verified Service Team', icon: VerifiedOutlinedIcon },
  { label: 'Request ID Tracking', icon: TrackChangesIcon },
  { label: 'Starting Estimates', icon: RequestQuoteOutlinedIcon },
  { label: 'Fast Scheduling', icon: BoltOutlinedIcon },
];

const CATEGORIES: (SchedulerServiceCategory | 'All')[] = [
  'All', 'Appliance', 'HVAC', 'Plumbing', 'Electrical', 'Smart Home', 'Garage Door',
];

type SortOption = 'rating' | 'jobs' | 'featured';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'jobs', label: 'Most Jobs' },
];

const jobsCount = (jobsCompleted: string): number => parseInt(jobsCompleted.replace(/\D/g, ''), 10) || 0;

const matchesCategory = (expert: Expert, category: SchedulerServiceCategory | 'All'): boolean => {
  if (category === 'All') return true;
  return expert.services.some((s) => s.serviceCategory === category)
    || expert.specialties.some((s) => s.toLowerCase().includes(category.toLowerCase()))
    || expert.title.toLowerCase().includes(category.toLowerCase());
};

export default function ExpertsPage() {
  const navigate = useNavigate();
  const [experts, setExperts] = useState<Expert[]>(EXPERTS);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<SchedulerServiceCategory | 'All'>('All');
  const [sort, setSort] = useState<SortOption>('featured');

  useEffect(() => {
    fetchActiveExpertsWithDetails().then((dbExperts) => {
      if (dbExperts && dbExperts.length > 0) setExperts(dbExperts);
    });
  }, []);

  const visibleExperts = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = experts.filter((e) => {
      const matchesSearch = !q
        || e.name.toLowerCase().includes(q)
        || e.title.toLowerCase().includes(q)
        || e.specialties.some((s) => s.toLowerCase().includes(q));
      return matchesSearch && matchesCategory(e, category);
    });

    const sorted = [...filtered];
    if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    else if (sort === 'jobs') sorted.sort((a, b) => jobsCount(b.jobsCompleted) - jobsCount(a.jobsCompleted));
    return sorted;
  }, [experts, search, category, sort]);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* HERO */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #071B41 0%, #0B2D6B 55%, #0D3A82 100%)',
          color: '#fff',
          py: { xs: 5, md: 7 },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '26px', md: '32px' },
              mb: 1.5,
            }}
          >
            Meet the Smart Appliances Service Experts
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.body,
              fontSize: '15px',
              maxWidth: 640,
              color: '#E2E8F0',
              mb: 2.5,
            }}
          >
            Browse trusted specialists for appliance repair, HVAC, plumbing, electrical, smart home, and
            garage door services in your area.
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {TRUST_BADGES.map(({ label, icon: Icon }) => (
              <Chip
                key={label}
                icon={<Icon sx={{ fontSize: 16, color: '#fff !important' }} />}
                label={label}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  color: '#fff',
                  fontFamily: fonts.body,
                  fontWeight: 600,
                  fontSize: '12.5px',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#fff', color: '#0B2D6B', '&:hover': { backgroundColor: '#E2E8F0' } }}
              onClick={() => navigate('/match-expert')}
            >
              Find My Expert
            </Button>
            <Button
              variant="outlined"
              sx={{ borderColor: '#E2E8F0', color: '#E2E8F0' }}
              onClick={() => navigate('/scheduler')}
            >
              Book a Service
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* FILTER BAR */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.5,
            p: 2.5,
            mb: { xs: 4, md: 5 },
            borderRadius: '18px',
            backgroundColor: '#fff',
            boxShadow: colors.cardShadow,
            border: `1px solid ${colors.border}`,
          }}
        >
          <TextField
            placeholder="Search expert or service…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ flex: '1 1 220px', '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: colors.mutedText }} />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value as SchedulerServiceCategory | 'All')}
              sx={{ borderRadius: '10px' }}
            >
              {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sort}
              label="Sort by"
              onChange={(e) => setSort(e.target.value as SortOption)}
              sx={{ borderRadius: '10px' }}
            >
              {SORT_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        {/* GRID OF EXPERTS */}
        {visibleExperts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText }}>
              No experts match your search. Try a different category or keyword.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {visibleExperts.map((expert) => (
              <ExpertCard key={expert.slug} expert={expert} />
            ))}
          </Box>
        )}

        {/* BOTTOM CTA */}
        <Box
          sx={{
            mt: { xs: 5, md: 6 },
            borderRadius: '18px',
            backgroundColor: '#0B2D6B',
            color: '#fff',
            p: { xs: 3, md: 4 },
            textAlign: { xs: 'left', md: 'center' },
          }}
        >
          <Typography
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '20px', md: '24px' },
              mb: 1.5,
            }}
          >
            Ready to book your service?
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.body,
              fontSize: '14px',
              mb: 3,
              color: '#E2E8F0',
            }}
          >
            Schedule a visit or track an existing request in just a few clicks.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: { sm: 'center' },
              gap: 1.5,
            }}
          >
            <Button
              variant="contained"
              color="inherit"
              sx={{ backgroundColor: '#fff', color: '#0B2D6B' }}
              onClick={() => navigate('/scheduler')}
            >
              Book a Service
            </Button>
            <Button
              variant="outlined"
              sx={{ borderColor: '#E2E8F0', color: '#E2E8F0' }}
              onClick={() => navigate('/track-request')}
            >
              Track Existing Request
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
