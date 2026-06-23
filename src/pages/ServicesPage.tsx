import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Button } from '@mui/material';
import {
  Refrigerator,
  Snowflake,
  Droplets,
  Zap,
  HouseWifi,
  AlertTriangle,
  LucideIcon,
} from 'lucide-react';
import { SERVICE_TYPE_IMAGE_MAP, DEFAULT_SERVICE_IMAGE } from '../data/serviceImages';
import { fonts } from '../theme';

const SERVICES_HERO_IMAGE = '/images/services/appliances/technician-default.webp';

type ServiceTab =
  | 'hvac'
  | 'plumbing'
  | 'electrical'
  | 'smart-home'
  | 'emergency';

interface ServiceCardData {
  id: string;
  title: string;
  description: string;
  image: string;
  issues: string[];
}

interface TabConfig {
  id: ServiceTab;
  label: string;
  Icon: LucideIcon;
  heading: string;
  subtitle: string;
  services: ServiceCardData[];
}

function svc(id: string, title: string, issues: string[]): ServiceCardData {
  const info = SERVICE_TYPE_IMAGE_MAP[id] ?? DEFAULT_SERVICE_IMAGE;
  return { id, title, description: info.desc, image: info.image, issues };
}

const TABS: TabConfig[] = [
  {
    id: 'hvac',
    label: 'HVAC',
    Icon: Snowflake,
    heading: 'HVAC Services',
    subtitle:
      'Heating, ventilation, and air conditioning repair and maintenance by certified HVAC technicians.',
    services: [
      svc('ac-repair', 'AC Repair', ['No cooling', 'Warm air blowing', 'Refrigerant leak', 'Loud noise']),
      svc('heating-furnace-repair', 'Heating & Furnace Repair', ['No heat', 'Burner not igniting', 'Short cycling', 'Unusual smell']),
      svc('thermostat-installation', 'Thermostat Installation', ['Not responding', 'Incorrect temperature', 'New smart thermostat', 'C-wire upgrade']),
      svc('hvac-maintenance', 'HVAC Maintenance', ['Annual tune-up', 'Filter replacement', 'Coil cleaning', 'Efficiency check']),
      svc('duct-cleaning', 'Duct Cleaning', ['Dust and debris', 'Allergens in air', 'Poor airflow', 'Post-renovation cleaning']),
    ],
  },
  {
    id: 'plumbing',
    label: 'Plumbing',
    Icon: Droplets,
    heading: 'Plumbing Services',
    subtitle:
      'Expert plumbing repair and installation for leaks, drains, fixtures, and water heaters.',
    services: [
      svc('leak-repair', 'Leak Repair', ['Pipe leak', 'Under-sink leak', 'Water stains', 'High water bill']),
      svc('drain-cleaning', 'Drain Cleaning', ['Slow drain', 'Complete blockage', 'Bad odor', 'Multiple drains']),
      svc('faucet-repair', 'Faucet Repair & Replacement', ['Dripping faucet', 'Low pressure', 'Leak at base', 'Handle issue']),
      svc('toilet-repair', 'Toilet Repair', ['Running toilet', "Won't flush", 'Leaking at base', 'Clogged']),
      svc('water-heater-service', 'Water Heater Service', ['No hot water', 'Insufficient hot water', 'Leak at tank', 'Strange sounds']),
    ],
  },
  {
    id: 'electrical',
    label: 'Electrical',
    Icon: Zap,
    heading: 'Electrical Services',
    subtitle:
      'Licensed electricians for outlets, fixtures, panels, and appliance electrical connections.',
    services: [
      svc('outlet-switch-repair', 'Outlet & Switch Repair', ['Dead outlet', 'Switch not working', 'Warm outlet', 'GFCI tripping']),
      svc('light-fixture-installation', 'Light Fixture Installation', ['New fixture', 'Flickering light', 'Buzzing sound', 'Dimmer upgrade']),
      svc('ceiling-fan-installation', 'Ceiling Fan Installation', ['New fan install', 'Wobbling fan', 'Remote issue', 'Light kit']),
      svc('breaker-panel-inspection', 'Breaker / Panel Inspection', ['Breaker tripping', 'Panel overheating', 'Safety inspection', 'Capacity upgrade']),
      svc('appliance-electrical-connection', 'Appliance Electrical Connection', ['Dryer circuit', 'Range outlet', 'Dedicated circuit', 'Amperage upgrade']),
    ],
  },
  {
    id: 'smart-home',
    label: 'Smart Home',
    Icon: HouseWifi,
    heading: 'Smart Home Setup',
    subtitle:
      'Professional installation and configuration of smart home devices, locks, cameras, and thermostats.',
    services: [
      svc('smart-thermostat-setup', 'Smart Thermostat Setup', ['Nest / Ecobee', 'C-wire install', 'App pairing', 'Schedule config']),
      svc('doorbell-installation', 'Video Doorbell Installation', ['Ring setup', 'Existing wiring', 'App setup', 'Motion zones']),
      svc('camera-installation', 'Security Camera Installation', ['Indoor mount', 'Outdoor setup', 'Night vision', 'Cloud storage']),
      svc('smart-lock-installation', 'Smart Lock Installation', ['Lock fitting', 'App pairing', 'Access codes', 'Keypad programming']),
      svc('wifi-setup', 'Wi-Fi Device Setup', ['Device connection', 'Troubleshooting', 'Mesh network', 'Range extension']),
      svc('tv-mounting', 'TV Mounting', ['Wall mount', 'Cable management', 'Stud finding', 'Tilt bracket']),
    ],
  },
  {
    id: 'emergency',
    label: 'Emergency',
    Icon: AlertTriangle,
    heading: 'Emergency Services',
    subtitle:
      'Urgent same-day response for critical appliance and home system failures. For gas, smoke, or fire — call 911 first.',
    services: [
      svc('emergency-hvac-service', 'Emergency HVAC Service', ['Total system failure', 'No heat in winter', 'No AC in extreme heat', 'Gas smell']),
      svc('emergency-plumbing', 'Emergency Plumbing', ['Burst pipe', 'Major water leak', 'Sewage backup', 'Flooding']),
      svc('emergency-electrical-service', 'Emergency Electrical Service', ['Power outage', 'Sparking outlet', 'Burning smell', 'Circuit failure']),
    ],
  },
];

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ServiceTab>('hvac');

  const tab = TABS.find((t) => t.id === activeTab)!;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* ── Hero ── */}
      <Box
        sx={{
          position: 'relative',
          py: { xs: 8, md: 10 },
          textAlign: 'center',
          px: 2,
          overflow: 'hidden',
          backgroundImage: `url(${SERVICES_HERO_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(135deg, rgba(7,27,65,0.88) 0%, rgba(11,61,145,0.78) 45%, rgba(11,61,145,0.72) 100%)',
            zIndex: 0,
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="overline"
            sx={{
              color: '#4FC3F7',
              fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
              fontWeight: 700,
              letterSpacing: 3,
              display: 'block',
              mb: 2,
            }}
          >
            Our Services
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
              fontWeight: 800,
              color: '#FFFFFF',
              fontSize: { xs: '2rem', sm: '2.6rem', md: '3rem' },
              mb: 2,
              letterSpacing: '-0.4px',
              lineHeight: 1.15,
            }}
          >
            Professional Appliance Repair & Service
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
              color: '#A8D8F0',
              fontSize: { xs: '1rem', md: '1.15rem' },
              lineHeight: 1.8,
              maxWidth: '560px',
              mx: 'auto',
            }}
          >
            Choose a service category, view common issues, and schedule trusted technicians in minutes.
          </Typography>
        </Container>
      </Box>

      {/* ── Category Tabs + Services ── */}
      <Box sx={{ py: { xs: 5, md: 8 }, backgroundColor: '#F8FAFC' }}>
        <Container maxWidth={false} sx={{ maxWidth: '1180px', mx: 'auto', px: { xs: 2, sm: 3 } }}>

          {/* Segmented tab bar */}
          <Box
            sx={{
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
              mb: 5,
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                minWidth: 'max-content',
                backgroundColor: '#EEF2F7',
                borderRadius: '16px',
                p: '5px',
                gap: '4px',
              }}
            >
              {/* Home Appliances — dedicated page */}
              <Box
                component="button"
                type="button"
                onClick={() => navigate('/services/home-appliances')}
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  px: { xs: '14px', md: '18px' }, py: '10px',
                  borderRadius: '12px', border: 'none', cursor: 'pointer',
                  fontFamily: fonts.body,
                  fontWeight: 500,
                  fontSize: { xs: '0.85rem', md: '0.9rem' },
                  color: '#64748B',
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.18s ease',
                  '&:hover': { color: '#0B3D91', backgroundColor: 'rgba(255,255,255,0.65)' },
                }}
              >
                <Refrigerator size={16} strokeWidth={1.8} color="currentColor" />
                <span>Home Appliances</span>
              </Box>

              {TABS.map(({ id, label, Icon }) => {
                const isActive = activeTab === id;
                const isEmergency = id === 'emergency';
                return (
                  <Box
                    key={id}
                    component="button"
                    type="button"
                    onClick={() => setActiveTab(id)}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      px: { xs: '14px', md: '18px' },
                      py: '10px',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: fonts.body,
                      fontWeight: isActive ? 700 : 500,
                      fontSize: { xs: '0.85rem', md: '0.9rem' },
                      color: isActive
                        ? isEmergency ? '#DC2626' : '#1A73E8'
                        : '#64748B',
                      backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                      boxShadow: isActive ? '0 2px 10px rgba(0,0,0,0.10)' : 'none',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.18s ease',
                      '&:hover': {
                        color: isActive
                          ? isEmergency ? '#DC2626' : '#1A73E8'
                          : '#0B3D91',
                        backgroundColor: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.65)',
                      },
                    }}
                  >
                    <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} color="currentColor" />
                    <span>{label}</span>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Category heading */}
          <Box sx={{ mb: { xs: 4, md: 5 } }}>
            <Typography
              variant="h2"
              sx={{
                fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                fontWeight: 800,
                color: '#0B3D91',
                fontSize: { xs: '1.65rem', md: '2rem' },
                mb: 1,
                letterSpacing: '-0.3px',
              }}
            >
              {tab.heading}
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                color: '#64748B',
                fontSize: { xs: '0.95rem', md: '1rem' },
                lineHeight: 1.7,
                maxWidth: 680,
              }}
            >
              {tab.subtitle}
            </Typography>
          </Box>

          {/* Service cards grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: '28px',
            }}
          >
            {tab.services.map((service) => (
              <Box
                key={service.id}
                sx={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E4E7EB',
                  borderRadius: '22px',
                  overflow: 'hidden',
                  boxShadow: '0 12px 30px rgba(10,37,64,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 18px 40px rgba(10,37,64,0.12)',
                  },
                }}
              >
                {/* Image */}
                <Box sx={{ height: '190px', overflow: 'hidden', flexShrink: 0 }}>
                  <Box
                    component="img"
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.3s ease',
                      '&:hover': { transform: 'scale(1.04)' },
                    }}
                  />
                </Box>

                {/* Body */}
                <Box sx={{ p: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                      fontWeight: 700,
                      fontSize: '1.05rem',
                      color: '#0B3D91',
                      mb: 0.75,
                      lineHeight: 1.3,
                    }}
                  >
                    {service.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                      fontSize: '0.875rem',
                      color: '#64748B',
                      lineHeight: 1.55,
                      mb: 1.75,
                    }}
                  >
                    {service.description}
                  </Typography>

                  {/* Issue chips */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px', mb: 2.5 }}>
                    {service.issues.map((issue) => (
                      <Box
                        key={issue}
                        component="span"
                        sx={{
                          display: 'inline-block',
                          backgroundColor: '#E8F1FF',
                          color: '#0B3D91',
                          borderRadius: '999px',
                          px: '10px',
                          py: '4px',
                          fontSize: '0.75rem',
                          fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                          fontWeight: 600,
                          lineHeight: 1.4,
                        }}
                      >
                        {issue}
                      </Box>
                    ))}
                  </Box>

                  {/* Schedule button */}
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() =>
                      navigate('/book/regular', { state: { serviceType: service.id } })
                    }
                    sx={{
                      mt: 'auto',
                      height: '44px',
                      backgroundColor: '#1A73E8',
                      color: '#FFFFFF',
                      fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      textTransform: 'none',
                      borderRadius: '12px',
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: '#0B3D91',
                        boxShadow: '0 6px 20px rgba(11,61,145,0.22)',
                      },
                    }}
                  >
                    Schedule Service
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Bottom CTA ── */}
      <Box
        sx={{
          backgroundColor: '#0B3D91',
          py: { xs: 8, md: 10 },
          textAlign: 'center',
          px: 2,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            sx={{
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
              fontWeight: 800,
              color: '#FFFFFF',
              mb: 2,
              fontSize: { xs: '1.6rem', md: '2rem' },
              letterSpacing: '-0.3px',
            }}
          >
            Not Sure Which Service You Need?
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
              color: '#A8D8F0',
              mb: 4,
              lineHeight: 1.8,
              maxWidth: 560,
              mx: 'auto',
              fontSize: { xs: '0.95rem', md: '1rem' },
            }}
          >
            Our team is ready to help diagnose the issue and recommend the right service.
            Contact us and we&apos;ll guide you through the process.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/match-expert')}
              sx={{
                backgroundColor: '#4FC3F7',
                color: '#071B41',
                fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: '10px',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#FFFFFF', color: '#0B3D91' },
              }}
            >
              Find My Expert
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/contact')}
              sx={{
                backgroundColor: '#1A73E8',
                color: '#FFFFFF',
                fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: '10px',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#FFFFFF', color: '#0B3D91' },
              }}
            >
              Contact Us
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/scheduler')}
              sx={{
                borderColor: 'rgba(255,255,255,0.4)',
                color: '#FFFFFF',
                fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: '10px',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderColor: '#FFFFFF',
                },
              }}
            >
              Book Online
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default ServicesPage;
