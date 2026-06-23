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
import {
  Refrigerator,
  Snowflake,
  Droplets,
  Zap,
  HouseWifi,
  DoorOpen,
  LucideIcon,
} from 'lucide-react';
import { colors, fonts } from '../theme';
import { getExpertBySlug, Expert } from '../data/experts';
import { fetchActiveExpertBySlug } from '../services/adminExperts';
import { SchedulerServiceCategory } from '../data/schedulerPrefill';
import ExpertProfileHeader from '../components/experts/ExpertProfileHeader';
import ExpertServices from '../components/experts/ExpertServices';
import ExpertReviews from '../components/experts/ExpertReviews';
import ExpertBookingCard from '../components/experts/ExpertBookingCard';
import ServiceAreaMap from '../components/ServiceAreaMap';
import {
  normalizeZipInput,
  validateZipCode,
  getZipFieldHelperText,
  isZipFieldError,
} from '../data/serviceAreas';

const GALLERY_ICONS: Record<string, LucideIcon> = {
  'Appliance repair': Refrigerator,
  'HVAC service': Snowflake,
  'Plumbing service': Droplets,
  'Electrical installation': Zap,
  'Smart home setup': HouseWifi,
  'Garage door service': DoorOpen,
};

const CATEGORY_TO_SERVICE_PATH: Record<SchedulerServiceCategory, { label: string; path: string }> = {
  Appliance: { label: 'Appliance Repair', path: '/services/home-appliances' },
  HVAC: { label: 'HVAC Services', path: '/services/hvac' },
  Plumbing: { label: 'Plumbing Services', path: '/services/plumbing' },
  Electrical: { label: 'Electrical Services', path: '/services/electrical' },
  'Smart Home': { label: 'Smart Home Services', path: '/services/smart-home' },
  'Garage Door': { label: 'Garage Door Services', path: '/services/garage-door' },
};

const CREDENTIALS_ITEMS = [
  'Smart Appliances service process for every request',
  'Email confirmation sent for every booking',
  'Request ID tracking on every service request',
  'Admin-reviewed service requests',
  'Starting estimate shown before booking',
  'Final price confirmed before work begins',
];

const FAQ_ITEMS = [
  {
    q: 'How do I book this expert?',
    a: 'Use the "Book This Expert" button to open the scheduler with this expert pre-selected.',
  },
  {
    q: 'Can I request a specific expert?',
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
];

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
  const primaryCategory = expert.services.find((s) => s.serviceCategory)?.serviceCategory ?? null;
  const breadcrumbCategory = primaryCategory ? CATEGORY_TO_SERVICE_PATH[primaryCategory] : null;

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    sectionRefs[id as keyof typeof sectionRefs].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
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
          <Box sx={{ flex: 1, minWidth: 0 }}>
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
                TabIndicatorProps={{ sx: { backgroundColor: colors.primaryBlue, height: 3 } }}
                sx={{ minHeight: 44 }}
              >
                {TABS.map((tab) => (
                  <Tab
                    key={tab.id}
                    value={tab.id}
                    label={tab.label}
                    sx={{
                      fontFamily: fonts.body,
                      fontWeight: 700,
                      fontSize: '13.5px',
                      textTransform: 'none',
                      color: colors.mutedText,
                      minHeight: 44,
                      '&.Mui-selected': { color: colors.primaryBlue },
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
                  Why this expert?
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '13.5px', color: colors.darkText, lineHeight: 1.65 }}>
                This expert is recommended based on service category, customer rating, response time, and completed
                service requests. Smart Appliances focuses on clear communication, request tracking, and professional
                service follow-up.
              </Typography>
            </Box>

            {/* ABOUT */}
            <Box ref={sectionRefs.about} sx={{ mb: { xs: 4, md: 5 }, scrollMarginTop: '96px' }}>
              <Typography
                sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '22px', color: colors.navy, mb: 1.5 }}
              >
                About
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
                {[
                  { icon: WorkOutlineIcon, label: `${expert.jobsCompleted} jobs completed` },
                  ...(expert.responseTime ? [{ icon: AccessTimeIcon, label: expert.responseTime }] : []),
                  { icon: CategoryOutlinedIcon, label: `Categories: ${expert.specialties.slice(0, 3).join(', ')}` },
                  { icon: PlaceOutlinedIcon, label: `Serves: ${expert.serviceAreas.join(', ')}` },
                  { icon: TrackChangesIcon, label: 'Request tracking available on every booking' },
                ].map(({ icon: Icon, label }) => (
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
              <ExpertServices services={expert.services} expertSlug={expert.slug} />
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
                {expert.galleryCategories.map((cat) => {
                  const Icon = GALLERY_ICONS[cat] ?? HouseWifi;
                  return (
                    <Box
                      key={cat}
                      sx={{
                        borderRadius: '16px',
                        border: `1px solid ${colors.border}`,
                        boxShadow: colors.cardShadow,
                        backgroundColor: '#fff',
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        minHeight: 130,
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 20px 40px rgba(10,37,64,0.14)' },
                      }}
                    >
                      <Box
                        sx={{
                          mb: 1.5,
                          color: colors.primaryBlue,
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          backgroundColor: colors.lightBlueBg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={24} strokeWidth={1.8} />
                      </Box>
                      <Typography sx={{ fontFamily: fonts.body, fontWeight: 600, fontSize: '13px', color: colors.darkText }}>
                        {cat}
                      </Typography>
                    </Box>
                  );
                })}
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

              {FAQ_ITEMS.map((item) => (
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
          <Box sx={{ width: { md: '340px' }, flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
            <ExpertBookingCard expert={expert} />
          </Box>
        </Box>

        {/* MOBILE BOOKING CARD NEAR BOTTOM */}
        <Box sx={{ mt: { xs: 4, md: 0 }, display: { xs: 'block', md: 'none' } }}>
          <ExpertBookingCard expert={expert} />
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
            Ready to book with this expert?
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '14px', mb: 3, color: '#E2E8F0' }}>
            Choose this expert, compare pricing, or track an existing request.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: { sm: 'center' }, gap: 1.5 }}>
            <Button
              variant="contained"
              color="inherit"
              sx={{ backgroundColor: '#fff', color: '#0B2D6B' }}
              onClick={() => navigate(`/scheduler?expert=${expert.slug}`)}
            >
              Book This Expert
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
