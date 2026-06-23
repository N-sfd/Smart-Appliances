import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  TextField,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import PriceCheckOutlinedIcon from '@mui/icons-material/PriceCheckOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import { colors, fonts } from '../theme';
import { getExpertBySlug, Expert } from '../data/experts';
import { fetchActiveExpertBySlug } from '../services/adminExperts';
import { SchedulerServiceCategory } from '../data/schedulerPrefill';
import ExpertProfileHeader from '../components/experts/ExpertProfileHeader';
import ExpertServices from '../components/experts/ExpertServices';
import ExpertReviews from '../components/experts/ExpertReviews';
import ExpertBookingCard from '../components/experts/ExpertBookingCard';
import ExpertGalleryCard from '../components/experts/ExpertGalleryCard';
import ServiceAreaMap from '../components/ServiceAreaMap';
import {
  normalizeZipInput,
  validateZipCode,
  getZipFieldHelperText,
  isZipFieldError,
} from '../data/serviceAreas';

const CATEGORY_TO_SERVICE_PATH: Record<SchedulerServiceCategory, { label: string; path: string }> = {
  Appliance: { label: 'Appliance Repair', path: '/services/home-appliances' },
  HVAC: { label: 'HVAC Services', path: '/services/hvac' },
  Plumbing: { label: 'Plumbing Services', path: '/services/plumbing' },
  Electrical: { label: 'Electrical Services', path: '/services/electrical' },
  'Smart Home': { label: 'Smart Home Services', path: '/services/smart-home' },
  'Garage Door': { label: 'Garage Door Services', path: '/services/garage-door' },
};

const TEAM_SERVICE_CATEGORIES: {
  title: string;
  description: string;
  priceLabel: string;
  serviceCategory: SchedulerServiceCategory | null;
}[] = [
  { title: 'Appliance Care', description: 'Refrigerator, washer, dryer, dishwasher, oven, and microwave service.', priceLabel: 'Service call from $89', serviceCategory: 'Appliance' },
  { title: 'HVAC Services', description: 'AC and heating repair, thermostat installs, and seasonal maintenance.', priceLabel: 'Service call from $99', serviceCategory: 'HVAC' },
  { title: 'Plumbing Services', description: 'Drain clearing, leak inspection, faucet and toilet service.', priceLabel: 'Service call from $99', serviceCategory: 'Plumbing' },
  { title: 'Electrical Services', description: 'Lighting, outlets, ceiling fans, and panel inspections.', priceLabel: 'Service call from $99', serviceCategory: 'Electrical' },
  { title: 'Smart Home Setup', description: 'Smart thermostats, locks, cameras, and device setup.', priceLabel: 'Starting from $99', serviceCategory: 'Smart Home' },
  { title: 'Garage Door Services', description: 'Garage door repair, opener service, and safety checks.', priceLabel: 'Service call from $99', serviceCategory: 'Garage Door' },
  { title: 'Emergency Service', description: 'Priority response for urgent home service issues.', priceLabel: 'Estimate after review', serviceCategory: null },
];

const CREDENTIALS_ITEMS = [
  'Online booking request submitted',
  'Request ID generated instantly',
  'Email confirmation sent',
  'Admin reviews the request',
  'Customer tracks status updates',
  'Technician follow-up to complete service',
];

function getFaqItems(isTeam: boolean) {
  return [
    {
      q: isTeam ? 'How do I book Smart Appliances Team?' : 'How do I book this expert?',
      a: isTeam
        ? 'Use the "Book This Team" button to open the scheduler with Smart Appliances Team pre-selected.'
        : 'Use the "Book This Expert" button to open the scheduler with this expert pre-selected.',
    },
    {
      q: isTeam ? 'Can I choose a specific expert?' : 'Can I request a specific expert?',
      a: 'You can request an expert when booking. Your requested expert is subject to availability, and our team will confirm assignment after you submit your request.',
    },
  {
    q: 'How does the service call fee work?',
    a: 'A technician reviews the issue in person and confirms the final price before work begins. The service call fee may be applied toward the repair cost if you move forward.',
  },
  {
    q: 'Will I get a confirmation email?',
    a: 'Yes, a confirmation email is sent after you submit your booking.',
  },
  {
    q: 'Can I track my request?',
    a: 'Yes. Every booking generates a request ID you can use on the Track Request page.',
  },
  {
    q: 'Do prices include parts?',
    a: 'No. Prices shown online are starting service estimates for labor. Parts are quoted separately based on diagnosis.',
  },
  {
    q: 'Do you offer emergency service?',
    a: 'Yes, emergency and same-day service is available for urgent issues, with a priority fee added to cover faster scheduling.',
  },
    {
      q: 'What areas do you serve?',
      a: 'We currently serve Maryland, Washington DC, Virginia, Pennsylvania, and West Virginia.',
    },
  ];
}

const TABS = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'photos', label: 'Photos' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'faqs', label: 'FAQs' },
];

export default function ExpertProfilePage() {
  const { expertSlug } = useParams<{ expertSlug: string }>();
  const navigate = useNavigate();
  const [expert, setExpert] = useState<Expert | undefined>(getExpertBySlug(expertSlug ?? ''));
  const [activeTab, setActiveTab] = useState('about');

  const [zip, setZip] = useState('');
  const [zipTouched, setZipTouched] = useState(false);

  const sectionRefs = {
    about: useRef<HTMLDivElement>(null),
    services: useRef<HTMLDivElement>(null),
    photos: useRef<HTMLDivElement>(null),
    reviews: useRef<HTMLDivElement>(null),
    credentials: useRef<HTMLDivElement>(null),
    faqs: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    if (!expertSlug) return;
    fetchActiveExpertBySlug(expertSlug).then((dbExpert) => {
      if (dbExpert) setExpert(dbExpert);
    });
  }, [expertSlug]);

  if (!expert) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F8FAFC',
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              borderRadius: '18px',
              boxShadow: colors.cardShadow,
              backgroundColor: '#fff',
              p: 3,
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                fontFamily: fonts.heading,
                fontWeight: 800,
                fontSize: '22px',
                color: colors.navy,
                mb: 1,
              }}
            >
              Expert not found
            </Typography>
            <Typography
              sx={{
                fontFamily: fonts.body,
                fontSize: '14px',
                color: colors.mutedText,
                mb: 2,
              }}
            >
              The expert you&apos;re looking for isn&apos;t available. Browse all experts to find the right match.
            </Typography>
            <Button variant="contained" component={RouterLink} to="/experts">
              Browse All Experts
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  const zipValidation = validateZipCode(zip);
  const isTeam = expert.slug === 'smart-appliances-team';
  const primaryCategory = expert.services.find((s) => s.serviceCategory)?.serviceCategory ?? null;
  const breadcrumbCategory = !isTeam && primaryCategory ? CATEGORY_TO_SERVICE_PATH[primaryCategory] : null;

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    sectionRefs[id as keyof typeof sectionRefs].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Container maxWidth={false} sx={{ maxWidth: 1280, py: { xs: 3, md: 5 }, px: { xs: 2, md: 3 } }}>
        {/* BREADCRUMB */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
          <Typography component={RouterLink} to="/experts" sx={{ fontFamily: fonts.body, fontSize: '13px', color: colors.mutedText, textDecoration: 'none', '&:hover': { color: colors.primaryBlue } }}>
            Experts
          </Typography>
          {breadcrumbCategory && (
            <>
              <NavigateNextIcon sx={{ fontSize: 14, color: colors.mutedText }} />
              <Typography component={RouterLink} to={breadcrumbCategory.path} sx={{ fontFamily: fonts.body, fontSize: '13px', color: colors.mutedText, textDecoration: 'none', '&:hover': { color: colors.primaryBlue } }}>
                {breadcrumbCategory.label}
              </Typography>
            </>
          )}
          <NavigateNextIcon sx={{ fontSize: 14, color: colors.mutedText }} />
          <Typography sx={{ fontFamily: fonts.body, fontSize: '13px', color: colors.navy, fontWeight: 600 }}>
            {expert.name}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: { xs: 3, md: 4 },
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'flex-start',
          }}
        >
          {/* LEFT COLUMN */}
          <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
            <Box sx={{ mb: { xs: 3, md: 4 } }}>
              <ExpertProfileHeader expert={expert} />
            </Box>

            {/* MOBILE BOOKING CARD NEAR TOP */}
            <Box sx={{ display: { xs: 'block', md: 'none' }, mb: { xs: 4, md: 5 } }}>
              <ExpertBookingCard expert={expert} />
            </Box>

            {/* TABS NAVIGATION */}
            <Box sx={{ mb: { xs: 3, md: 4 }, borderBottom: `1px solid ${colors.border}` }}>
              <Tabs
                value={activeTab}
                onChange={(_, value) => handleTabClick(value)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                TabIndicatorProps={{ sx: { backgroundColor: colors.primaryBlue, height: 2, borderRadius: '2px 2px 0 0' } }}
                sx={{ minHeight: 40 }}
              >
                {TABS.map((tab) => (
                  <Tab
                    key={tab.id}
                    value={tab.id}
                    label={tab.label}
                    sx={{
                      fontFamily: fonts.body,
                      fontWeight: 600,
                      fontSize: '13px',
                      textTransform: 'none',
                      color: colors.mutedText,
                      minHeight: 40,
                      py: 1,
                      px: { xs: 1.25, sm: 2 },
                      '&.Mui-selected': { color: colors.primaryBlue, fontWeight: 700 },
                    }}
                  />
                ))}
              </Tabs>
            </Box>

            {/* WHY THIS EXPERT */}
            <Box
              sx={{
                mb: { xs: 4, md: 5 },
                p: 2.5,
                borderRadius: '16px',
                backgroundColor: colors.lightBlueBg,
                border: `1px solid ${colors.border}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <VerifiedOutlinedIcon sx={{ fontSize: 20, color: colors.primaryBlue }} />
                <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '16px', color: colors.navy }}>
                  {isTeam ? 'Why choose this team?' : 'Why this expert?'}
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '13.5px', color: colors.darkText, lineHeight: 1.65 }}>
                {isTeam
                  ? 'Smart Appliances is recommended for customers who want clear communication, request ID tracking, starting estimates, and professional service follow-up across appliance, HVAC, plumbing, electrical, smart home, and garage door needs.'
                  : 'This expert is recommended based on service category, customer rating, response time, and completed service requests. Smart Appliances focuses on clear communication, request tracking, and professional service follow-up.'}
              </Typography>
            </Box>

            {/* ABOUT */}
            <Box ref={sectionRefs.about} sx={{ mb: { xs: 4, md: 5 }, scrollMarginTop: '96px' }}>
              <Typography
                sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '22px', color: colors.navy, mb: 1.5 }}
              >
                {isTeam ? 'About Smart Appliances' : 'About'}
              </Typography>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '14px', color: colors.darkText, lineHeight: 1.65, mb: 2.5 }}>
                {expert.about}
              </Typography>

              {/* OVERVIEW ICON ROWS */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 1.5,
                }}
              >
                {(isTeam ? [
                  { icon: WorkOutlineIcon, label: `${expert.jobsCompleted} service requests supported` },
                  { icon: TrackChangesIcon, label: 'Request ID tracking' },
                  { icon: MarkEmailReadOutlinedIcon, label: 'Email confirmation' },
                  { icon: VerifiedOutlinedIcon, label: 'Admin-reviewed requests' },
                  { icon: PriceCheckOutlinedIcon, label: 'Starting estimates before booking' },
                  { icon: FactCheckOutlinedIcon, label: 'Final pricing confirmed before work begins' },
                ] : [
                  { icon: WorkOutlineIcon, label: `${expert.jobsCompleted} ${expert.jobsLabel ?? 'jobs completed'}` },
                  ...(expert.responseTime ? [{ icon: AccessTimeIcon, label: expert.responseTime }] : []),
                  { icon: CategoryOutlinedIcon, label: `Categories: ${expert.specialties.slice(0, 3).join(', ')}` },
                  { icon: PlaceOutlinedIcon, label: `Serves: ${expert.serviceAreas.join(', ')}` },
                  { icon: TrackChangesIcon, label: 'Request tracking available on every booking' },
                ]).map(({ icon: Icon, label }) => (
                  <Box key={label} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, p: 1.5, borderRadius: '12px', backgroundColor: '#fff', border: `1px solid ${colors.border}` }}>
                    <Icon sx={{ fontSize: 18, color: colors.primaryBlue, mt: '1px', flexShrink: 0 }} />
                    <Typography sx={{ fontFamily: fonts.body, fontSize: '13px', color: colors.darkText, lineHeight: 1.5 }}>
                      {label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* SERVICES */}
            <Box ref={sectionRefs.services} sx={{ mb: { xs: 4, md: 5 }, scrollMarginTop: '96px' }}>
              {isTeam ? (
                <Box>
                  <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '22px', color: colors.navy, mb: 0.5 }}>
                    Services Offered
                  </Typography>
                  <Typography sx={{ fontFamily: fonts.body, fontSize: '14px', color: colors.mutedText, mb: 2.5 }}>
                    Choose a category to get started, or book a specific service from the scheduler.
                  </Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                      gap: 2,
                    }}
                  >
                    {TEAM_SERVICE_CATEGORIES.map((cat) => (
                      <Box
                        key={cat.title}
                        sx={{
                          borderRadius: '18px',
                          border: `1px solid ${colors.border}`,
                          boxShadow: colors.cardShadow,
                          p: 2.5,
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%',
                          backgroundColor: '#fff',
                        }}
                      >
                        <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '16px', color: colors.darkText, mb: 0.75 }}>
                          {cat.title}
                        </Typography>
                        <Typography sx={{ fontFamily: fonts.body, fontSize: '12.5px', color: colors.mutedText, mb: 1.5, lineHeight: 1.5 }}>
                          {cat.description}
                        </Typography>
                        <Typography sx={{ fontFamily: fonts.body, fontSize: '14px', color: colors.primaryBlue, fontWeight: 700, mb: 2 }}>
                          {cat.priceLabel}
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Button
                          variant="contained"
                          onClick={() => {
                            const params = new URLSearchParams({ expert: expert.slug });
                            if (cat.serviceCategory) params.set('serviceCategory', cat.serviceCategory);
                            else params.set('serviceType', 'E');
                            navigate(`/scheduler?${params.toString()}`);
                          }}
                        >
                          Book
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ) : (
                <ExpertServices services={expert.services} expertSlug={expert.slug} />
              )}
            </Box>

            {/* GALLERY */}
            <Box ref={sectionRefs.photos} sx={{ mb: { xs: 4, md: 5 }, scrollMarginTop: '96px' }}>
              <Typography
                sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '22px', color: colors.navy, mb: 2 }}
              >
                Photos &amp; Recent Work
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
                  gap: 2,
                }}
              >
                {expert.galleryCategories.map((cat) => (
                  <ExpertGalleryCard key={cat} category={cat} />
                ))}
              </Box>
            </Box>

            {/* SERVICE AREA */}
            <Box sx={{ mb: { xs: 4, md: 5 } }}>
              <Typography
                sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '22px', color: colors.navy, mb: 2 }}
              >
                Service Area
              </Typography>

              <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {expert.serviceAreas.map((area) => (
                  <Chip
                    key={area}
                    label={area}
                    sx={{ backgroundColor: colors.lightBlueBg, color: colors.primaryBlue, fontFamily: fonts.body, fontWeight: 600, fontSize: '13px' }}
                  />
                ))}
              </Box>

              <ServiceAreaMap height={{ xs: 220, md: 280 }} />

              <Box sx={{ mt: 2 }}>
                <TextField
                  label="Check your ZIP code"
                  value={zip}
                  onChange={(e) => setZip(normalizeZipInput(e.target.value))}
                  onBlur={() => setZipTouched(true)}
                  fullWidth
                  size="small"
                  inputProps={{ inputMode: 'numeric', maxLength: 5 }}
                  helperText={getZipFieldHelperText(zip, zipTouched)}
                  error={isZipFieldError(zip, zipTouched)}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#fff', borderRadius: '12px' } }}
                />
                {zipValidation.isInServiceArea && (
                  <Typography sx={{ fontFamily: fonts.body, fontSize: '12px', color: colors.success, mt: 0.75 }}>
                    Great news — we service ZIP {zip}.
                  </Typography>
                )}
              </Box>
            </Box>

            {/* REVIEWS */}
            <Box ref={sectionRefs.reviews} sx={{ mb: { xs: 4, md: 5 }, scrollMarginTop: '96px' }}>
              <ExpertReviews reviews={expert.reviews} />
            </Box>

            {/* CREDENTIALS */}
            <Box ref={sectionRefs.credentials} sx={{ mb: { xs: 4, md: 5 }, scrollMarginTop: '96px' }}>
              <Typography
                sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '22px', color: colors.navy, mb: 2 }}
              >
                Credentials &amp; Service Process
              </Typography>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: '16px',
                  border: `1px solid ${colors.border}`,
                  backgroundColor: '#fff',
                  boxShadow: colors.cardShadow,
                }}
              >
                {CREDENTIALS_ITEMS.map((item, i) => {
                  const icons = [FactCheckOutlinedIcon, MarkEmailReadOutlinedIcon, TrackChangesIcon, FactCheckOutlinedIcon, PriceCheckOutlinedIcon, CheckIcon];
                  const Icon = icons[i] ?? CheckIcon;
                  return (
                    <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: i === CREDENTIALS_ITEMS.length - 1 ? 0 : 1 }}>
                      <Icon sx={{ fontSize: 18, color: colors.primaryBlue, mt: '2px' }} />
                      <Typography sx={{ fontFamily: fonts.body, fontSize: '13.5px', color: colors.darkText }}>
                        {item}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* FAQ */}
            <Box ref={sectionRefs.faqs} sx={{ mb: { xs: 4, md: 5 }, scrollMarginTop: '96px' }}>
              <Typography
                sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '22px', color: colors.navy, mb: 2 }}
              >
                Frequently Asked Questions
              </Typography>

              {getFaqItems(isTeam).map((item) => (
                <Accordion
                  key={item.q}
                  sx={{ mb: 1, borderRadius: '12px !important', border: `1px solid ${colors.border}`, boxShadow: 'none', '&:before': { display: 'none' } }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontFamily: fonts.body, fontWeight: 600, fontSize: '14px', color: colors.darkText }}>
                      {item.q}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={{ fontFamily: fonts.body, fontSize: '13px', color: colors.mutedText, lineHeight: 1.6 }}>
                      {item.a}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Box>

          {/* RIGHT COLUMN — DESKTOP BOOKING CARD */}
          <Box sx={{ width: { md: 360 }, flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
            <ExpertBookingCard expert={expert} />
          </Box>
        </Box>

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
          <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: { xs: '20px', md: '24px' }, mb: 1.5 }}>
            {isTeam ? 'Ready to book with Smart Appliances?' : 'Ready to book with this expert?'}
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '14px', mb: 3, color: '#E2E8F0' }}>
            {isTeam ? 'Book the team, compare pricing, or track an existing request.' : 'Choose this expert, compare pricing, or track an existing request.'}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: { sm: 'center' }, gap: 1.5 }}>
            <Button
              variant="contained"
              color="inherit"
              sx={{ backgroundColor: '#fff', color: '#0B2D6B' }}
              onClick={() => navigate(`/scheduler?expert=${expert.slug}`)}
            >
              {isTeam ? 'Book This Team' : 'Book This Expert'}
            </Button>
            <Button
              variant="outlined"
              sx={{ borderColor: '#E2E8F0', color: '#E2E8F0' }}
              onClick={() => navigate('/pricing')}
            >
              View Pricing
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
