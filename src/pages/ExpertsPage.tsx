import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, Container, Button, TextField, FormControl, InputLabel, Select, MenuItem,
  Chip, InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import RecommendOutlinedIcon from '@mui/icons-material/RecommendOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import StarIcon from '@mui/icons-material/Star';
import {
  Refrigerator, Snowflake, Droplets, Zap, HouseWifi, DoorOpen, AlertTriangle, LucideIcon,
} from 'lucide-react';
import { colors, fonts } from '../theme';
import { EXPERTS, Expert, getExpertBySlug, resolveExpertImages } from '../data/experts';
import { getExpertImageUrl } from '../data/expertImages';
import { SchedulerServiceCategory } from '../data/schedulerPrefill';
import ExpertCard from '../components/experts/ExpertCard';
import ExpertAvatar from '../components/experts/ExpertAvatar';
import ExpertMatchBanner from '../components/experts/ExpertMatchBanner';
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

type SortOption = 'featured' | 'rating' | 'jobs' | 'response';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'jobs', label: 'Most Jobs' },
  { value: 'response', label: 'Fastest Response' },
];

const WHY_CHOOSE_ITEMS = [
  { title: 'Clear starting estimates', icon: RequestQuoteOutlinedIcon },
  { title: 'Request ID tracking', icon: TrackChangesIcon },
  { title: 'Professional service process', icon: FactCheckOutlinedIcon },
  { title: 'Email confirmation', icon: MarkEmailReadOutlinedIcon },
  { title: 'Admin-reviewed requests', icon: VerifiedOutlinedIcon },
  { title: 'Service across MD, DC, VA, PA, and WV', icon: PlaceOutlinedIcon },
];

const MATCH_STEPS = [
  { title: 'Tell us what you need', icon: QuestionAnswerOutlinedIcon },
  { title: 'We recommend the right expert', icon: RecommendOutlinedIcon },
  { title: 'Book online and track your request', icon: EventAvailableOutlinedIcon },
];

const CATEGORY_LINKS: { label: string; path: string; icon: LucideIcon }[] = [
  { label: 'Appliance Care', path: '/services/home-appliances', icon: Refrigerator },
  { label: 'HVAC', path: '/services/hvac', icon: Snowflake },
  { label: 'Plumbing', path: '/services/plumbing', icon: Droplets },
  { label: 'Electrical', path: '/services/electrical', icon: Zap },
  { label: 'Smart Home', path: '/services/smart-home', icon: HouseWifi },
  { label: 'Garage Door', path: '/services/garage-door', icon: DoorOpen },
  { label: 'Emergency', path: '/scheduler?serviceType=E', icon: AlertTriangle },
];

const RECOMMENDED_SLUGS = ['hvac-repair-specialist', 'appliance-repair-specialist', 'plumbing-repair-specialist'];

const jobsCount = (jobsCompleted: string): number => parseInt(jobsCompleted.replace(/\D/g, ''), 10) || 0;

/** Lower = faster. Unknown response time sorts last. */
const responseMinutes = (responseTime?: string): number => {
  if (!responseTime) return Number.MAX_SAFE_INTEGER;
  const hourMatch = responseTime.match(/(\d+)\s*hour/i);
  if (hourMatch) return parseInt(hourMatch[1], 10) * 60;
  const minMatch = responseTime.match(/(\d+)\s*min/i);
  if (minMatch) return parseInt(minMatch[1], 10);
  return Number.MAX_SAFE_INTEGER;
};

const matchesCategory = (expert: Expert, category: SchedulerServiceCategory | 'All'): boolean => {
  if (category === 'All') return true;
  return expert.services.some((s) => s.serviceCategory === category)
    || expert.specialties.some((s) => s.toLowerCase().includes(category.toLowerCase()))
    || expert.title.toLowerCase().includes(category.toLowerCase());
};

export default function ExpertsPage() {
  const navigate = useNavigate();
  const [experts, setExperts] = useState<Expert[]>(EXPERTS.map(resolveExpertImages));
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
        || e.specialties.some((s) => s.toLowerCase().includes(q))
        || e.services.some((s) => s.name.toLowerCase().includes(q));
      return matchesSearch && matchesCategory(e, category);
    });

    const sorted = [...filtered];
    if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    else if (sort === 'jobs') sorted.sort((a, b) => jobsCount(b.jobsCompleted) - jobsCount(a.jobsCompleted));
    else if (sort === 'response') sorted.sort((a, b) => responseMinutes(a.responseTime) - responseMinutes(b.responseTime));
    return sorted;
  }, [experts, search, category, sort]);

  const recommendedExperts = RECOMMENDED_SLUGS
    .map((slug) => getExpertBySlug(slug))
    .filter((e): e is Expert => Boolean(e));

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* HERO */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #071B41 0%, #0B2D6B 55%, #0D3A82 100%)',
          py: { xs: 4.5, md: 5.5 },
          px: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: { xs: 4, md: 6 },
            }}
          >
            {/* LEFT — copy */}
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                sx={{
                  fontFamily: fonts.heading,
                  fontWeight: 800,
                  fontSize: { xs: '1.85rem', md: '2.3rem' },
                  color: '#fff',
                  lineHeight: 1.15,
                  mb: 1.5,
                }}
              >
                Find the Right Home Service Expert
              </Typography>
              <Typography
                sx={{
                  fontFamily: fonts.body,
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  maxWidth: 520,
                  color: '#E2E8F0',
                  mx: { xs: 'auto', md: 0 },
                  mb: 2.5,
                  lineHeight: 1.7,
                }}
              >
                Browse Smart Appliances experts for appliance care, HVAC, plumbing, electrical,
                smart home, and garage door services.
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' }, mb: 3 }}>
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

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#fff', color: '#0B2D6B', '&:hover': { backgroundColor: '#E2E8F0' } }}
                  onClick={() => navigate('/match-expert')}
                >
                  Match Me With an Expert
                </Button>
                <Button
                  variant="outlined"
                  sx={{ borderColor: '#E2E8F0', color: '#E2E8F0' }}
                  onClick={() => navigate('/scheduler')}
                >
                  Book a Service
                </Button>
              </Box>
            </Box>

            {/* RIGHT — recommended experts card */}
            <Box sx={{ flex: 1, width: '100%', maxWidth: { xs: 420, md: 'none' } }}>
              <Box
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: '20px',
                  p: { xs: 2.5, md: 3 },
                  boxShadow: '0 24px 56px rgba(0,0,0,0.28)',
                }}
              >
                <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '1.05rem', color: colors.navy, mb: 1.75 }}>
                  Recommended Experts
                </Typography>
                <Box sx={{ display: 'grid', gap: 1.25 }}>
                  {recommendedExperts.map((expert) => (
                    <Box
                      key={expert.slug}
                      component={RouterLink}
                      to={`/experts/${expert.slug}`}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.25,
                        p: 1,
                        borderRadius: '12px',
                        textDecoration: 'none',
                        transition: 'background-color 0.15s ease',
                        '&:hover': { backgroundColor: colors.lightBlueBg },
                      }}
                    >
                      <ExpertAvatar
                        src={getExpertImageUrl(expert.slug, expert.imageUrl, expert.avatarUrl)}
                        alt={expert.name}
                        initials={expert.initials}
                        slug={expert.slug}
                        size={42}
                      />
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '0.85rem', color: colors.darkText, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {expert.name}
                        </Typography>
                        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.mutedText, display: 'flex', alignItems: 'center', gap: 0.4 }}>
                          <StarIcon sx={{ fontSize: 13, color: colors.warningOrange }} />
                          {expert.rating} · {expert.jobsCompleted} jobs
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
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
            placeholder="Search by service, expert, or category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ flex: '1 1 240px', '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: colors.mutedText }} />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
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

          <Box
            sx={{
              width: '100%',
              display: 'flex',
              gap: 1,
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
              pt: 0.5,
            }}
          >
            {CATEGORIES.map((c) => {
              const isActive = category === c;
              return (
                <Chip
                  key={c}
                  label={c}
                  onClick={() => setCategory(c)}
                  sx={{
                    flexShrink: 0,
                    fontFamily: fonts.body,
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.8rem',
                    backgroundColor: isActive ? colors.primaryBlue : colors.lightBlueBg,
                    color: isActive ? '#fff' : colors.primaryBlue,
                    '&:hover': { backgroundColor: isActive ? colors.navy : '#D9E8FB' },
                  }}
                />
              );
            })}
          </Box>
        </Box>

        <ExpertMatchBanner />

        {/* Expert listings */}
        {visibleExperts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, mb: 2 }}>
              No experts found. Try another category or start expert matching.
            </Typography>
            <Button
              variant="contained"
              sx={{ backgroundColor: colors.primaryBlue, '&:hover': { backgroundColor: colors.navy } }}
              onClick={() => navigate('/match-expert')}
            >
              Match Me With an Expert
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {visibleExperts.map((expert) => (
              <ExpertCard key={expert.slug} expert={expert} />
            ))}
          </Box>
        )}
      </Container>

      {/* WHY CHOOSE OUR EXPERTS */}
      <Box sx={{ py: { xs: 6, md: 9 }, backgroundColor: colors.lightBlueBg }}>
        <Container maxWidth="lg">
          <Typography
            sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: { xs: '1.5rem', md: '1.85rem' }, color: colors.navy, textAlign: 'center', mb: 4 }}
          >
            Why Choose Smart Appliances Experts?
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 2.5,
              alignItems: 'stretch',
            }}
          >
            {WHY_CHOOSE_ITEMS.map(({ title, icon: Icon }) => (
              <Box
                key={title}
                sx={{
                  p: 2.5,
                  borderRadius: '16px',
                  backgroundColor: '#fff',
                  border: `1px solid ${colors.border}`,
                  boxShadow: '0 4px 16px rgba(10,37,64,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    backgroundColor: colors.lightBlueBg,
                    color: colors.primaryBlue,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon sx={{ fontSize: 21 }} />
                </Box>
                <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '0.92rem', color: colors.navy }}>
                  {title}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* HOW EXPERT MATCHING WORKS */}
      <Box sx={{ py: { xs: 6, md: 9 } }}>
        <Container maxWidth="md">
          <Typography
            sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: { xs: '1.5rem', md: '1.85rem' }, color: colors.navy, textAlign: 'center', mb: 4 }}
          >
            How Expert Matching Works
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: 2.5,
              mb: 4,
            }}
          >
            {MATCH_STEPS.map(({ title, icon: Icon }, index) => (
              <Box
                key={title}
                sx={{
                  textAlign: 'center',
                  p: 2.5,
                  borderRadius: '16px',
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  boxShadow: '0 4px 16px rgba(10, 37, 64, 0.05)',
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: colors.navy,
                    color: '#fff',
                    fontFamily: fonts.heading,
                    fontWeight: 800,
                    fontSize: '0.62rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    top: 10,
                    right: 10,
                  }}
                >
                  {index + 1}
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: colors.lightBlueBg,
                    color: colors.primaryBlue,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 1.5,
                  }}
                >
                  <Icon sx={{ fontSize: 24 }} />
                </Box>
                <Typography sx={{ fontFamily: fonts.body, fontSize: '0.92rem', color: colors.darkText, fontWeight: 600 }}>
                  {title}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: colors.primaryBlue, fontFamily: fonts.body, fontWeight: 700, textTransform: 'none', borderRadius: '12px', px: 3.5, '&:hover': { backgroundColor: colors.navy } }}
              onClick={() => navigate('/match-expert')}
            >
              Start Expert Match
            </Button>
          </Box>
        </Container>
      </Box>

      {/* FEATURED BANNER */}
      <Box sx={{ py: { xs: 5, md: 6 }, backgroundColor: colors.sectionBg }}>
        <Container maxWidth="md">
          <Box
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: '20px',
              backgroundColor: colors.navy,
              color: '#fff',
              textAlign: 'center',
            }}
          >
            <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: { xs: '1.3rem', md: '1.5rem' }, mb: 1 }}>
              Not sure who to choose?
            </Typography>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.92rem', color: '#E2E8F0', maxWidth: 520, mx: 'auto', mb: 2.5, lineHeight: 1.65 }}>
              Answer a few questions and we&apos;ll recommend the best Smart Appliances expert for your service need.
            </Typography>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#fff', color: colors.navy, fontFamily: fonts.body, fontWeight: 700, textTransform: 'none', borderRadius: '12px', px: 3.5, '&:hover': { backgroundColor: '#E2E8F0' } }}
              onClick={() => navigate('/match-expert')}
            >
              Match Me With an Expert
            </Button>
          </Box>
        </Container>
      </Box>

      {/* BROWSE BY SERVICE CATEGORY */}
      <Box sx={{ py: { xs: 6, md: 9 } }}>
        <Container maxWidth="lg">
          <Typography
            sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: { xs: '1.5rem', md: '1.85rem' }, color: colors.navy, textAlign: 'center', mb: 4 }}
          >
            Browse by Service Category
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(7, 1fr)' },
              gap: 1.5,
            }}
          >
            {CATEGORY_LINKS.map(({ label, path, icon: Icon }) => (
              <Box
                key={label}
                component={RouterLink}
                to={path}
                sx={{
                  textDecoration: 'none',
                  textAlign: 'center',
                  p: 2,
                  borderRadius: '14px',
                  backgroundColor: '#fff',
                  border: `1px solid ${colors.border}`,
                  boxShadow: '0 2px 8px rgba(10,37,64,0.04)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 24px rgba(10,37,64,0.1)' },
                }}
              >
                <Box sx={{ color: colors.primaryBlue, mb: 1, display: 'flex', justifyContent: 'center' }}>
                  <Icon size={22} strokeWidth={1.8} />
                </Box>
                <Typography sx={{ fontFamily: fonts.body, fontWeight: 600, fontSize: '0.8rem', color: colors.darkText }}>
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* BOTTOM CTA */}
      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 8 } }}>
        <Box
          sx={{
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
            Ready to book with a Smart Appliances expert?
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.body,
              fontSize: '14px',
              mb: 3,
              color: '#E2E8F0',
            }}
          >
            Schedule online in minutes and receive a request ID to track your service.
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
