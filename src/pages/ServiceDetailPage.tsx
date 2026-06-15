import React, { lazy, Suspense } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
  Chip,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GppGoodIcon from '@mui/icons-material/GppGood';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { popularServices } from '../data/popularServices';
import { getServiceImage } from '../data/serviceImages';
import { EMERGENCY_SERVICE_IDS } from '../data/serviceCategoryHubs';
import { HOME_APPLIANCE_SERVICE_IDS, ELECTRICAL_SERVICE_IDS } from '../data/serviceNavItems';
import ServiceCategoryPage from './ServiceCategoryPage';
import { SERVICE_CATEGORY_PAGE_MAP } from '../data/serviceCategoryPages';
import { inferCategoryFromProductName } from '../data/schedulerPrefill';

const GarageDoorRepairPage = lazy(() => import('./GarageDoorRepairPage'));

const font = "'Inter', 'DM Sans', Arial, sans-serif";
const heading = "'Plus Jakarta Sans', 'Inter', sans-serif";

const HUB_TO_SLUG: Record<string, keyof typeof SERVICE_CATEGORY_PAGE_MAP> = {
  plumbing: 'plumbing',
  'plumbing-support': 'plumbing',
  'smart-home': 'smart-home',
  'smart-home-support': 'smart-home',
  'smart-thermostat-setup': 'smart-home',
  hvac: 'hvac',
  'hvac-support': 'hvac',
  electrical: 'electrical',
  'electrical-support': 'electrical',
  'appliance-repair': 'home-appliances',
  'appliance-installation': 'home-appliances',
};

const ServiceDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();

  if (!serviceId) {
    navigate('/services');
    return null;
  }

  if (serviceId in SERVICE_CATEGORY_PAGE_MAP) {
    return <ServiceCategoryPage slug={serviceId as keyof typeof SERVICE_CATEGORY_PAGE_MAP} />;
  }

  const hubSlug = HUB_TO_SLUG[serviceId];
  if (hubSlug) {
    return <Navigate to={`/services/${hubSlug}`} replace />;
  }

  if (HOME_APPLIANCE_SERVICE_IDS.has(serviceId)) {
    return <Navigate to={`/services/home-appliances?service=${serviceId}`} replace />;
  }

  if (ELECTRICAL_SERVICE_IDS.has(serviceId)) {
    return <Navigate to={`/services/electrical?service=${serviceId}`} replace />;
  }

  if (EMERGENCY_SERVICE_IDS.has(serviceId)) {
    navigate('/services', { replace: true });
    return null;
  }

  if (serviceId === 'garage-door-repair') {
    return (
      <Suspense fallback={<Box sx={{ minHeight: '50vh' }} />}>
        <GarageDoorRepairPage />
      </Suspense>
    );
  }

  const service = popularServices.find((s) => s.id === serviceId || s.serviceId === serviceId);

  const title = service?.label ?? getServiceImage(serviceId, 'appliance-repair').title;
  const description = service?.description ?? getServiceImage(serviceId, 'appliance-repair').desc;
  const image = service?.image ?? getServiceImage(serviceId, 'appliance-repair').image;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <Box sx={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #E8F1FF 100%)', py: { xs: 4, md: 5 } }}>
        <Container maxWidth="lg">
          <Breadcrumbs sx={{ mb: 2, fontFamily: font, fontSize: '0.85rem' }}>
            <MuiLink component="button" underline="hover" onClick={() => navigate('/')} sx={{ fontFamily: font, color: '#1A1A1A' }}>
              Home
            </MuiLink>
            <MuiLink component="button" underline="hover" onClick={() => navigate('/services')} sx={{ fontFamily: font, color: '#1A1A1A' }}>
              Services
            </MuiLink>
            <Typography sx={{ fontFamily: font, color: '#0B3D91', fontWeight: 600, fontSize: '0.85rem' }}>{title}</Typography>
          </Breadcrumbs>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, alignItems: 'center' }}>
            <Box>
              <Typography sx={{ fontFamily: heading, fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.25rem' }, color: '#0B3D91', mb: 2 }}>
                {title}
              </Typography>
              <Typography sx={{ fontFamily: font, color: '#64748B', fontSize: '1rem', lineHeight: 1.75, mb: 3 }}>
                {description}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
                <Chip icon={<GppGoodIcon sx={{ fontSize: '16px !important' }} />} label="Licensed technicians" sx={{ fontFamily: font, fontWeight: 600 }} />
                <Chip icon={<ScheduleIcon sx={{ fontSize: '16px !important' }} />} label="Flexible scheduling" sx={{ fontFamily: font, fontWeight: 600 }} />
              </Box>
              <Button
                variant="contained"
                onClick={() => {
                  const query = new URLSearchParams({ serviceType: 'R', productName: title });
                  const schedulerCategory = inferCategoryFromProductName(title);
                  if (schedulerCategory) {
                    query.set('serviceCategory', schedulerCategory);
                  }
                  navigate(`/scheduler?${query.toString()}`);
                }}
                sx={{
                  background: '#1A73E8',
                  color: '#FFFFFF',
                  fontFamily: font,
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: '10px',
                  px: 4,
                  py: 1.4,
                  '&:hover': { background: '#0B3D91' },
                }}
              >
                Schedule Service
              </Button>
            </Box>
            <Box
              component="img"
              src={image}
              alt={title}
              sx={{ width: '100%', height: { xs: 240, md: 320 }, objectFit: 'cover', borderRadius: '20px' }}
            />
          </Box>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 4, md: 5 }, backgroundColor: '#FFFFFF' }}>
        <Container maxWidth="md">
          <Typography sx={{ fontFamily: heading, fontWeight: 800, fontSize: '1.25rem', color: '#0B3D91', mb: 2 }}>
            What to expect
          </Typography>
          {[
            'A qualified technician arrives within your scheduled window',
            'Diagnosis and upfront estimate before work begins',
            'Professional repair or installation with quality parts',
            'Testing and walkthrough before job completion',
          ].map((item) => (
            <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
              <CheckCircleOutlineIcon sx={{ color: '#1A73E8', fontSize: 22, mt: 0.2 }} />
              <Typography sx={{ fontFamily: font, color: '#1A1A1A', fontSize: '0.95rem', lineHeight: 1.5 }}>
                {item}
              </Typography>
            </Box>
          ))}
        </Container>
      </Box>

      <Box sx={{ pb: 5 }}>
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/services')}
            sx={{ fontFamily: font, color: '#1A73E8', fontWeight: 600, textTransform: 'none', '&:hover': { backgroundColor: 'rgba(11,94,215,0.06)' } }}
          >
            Back to all services
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default ServiceDetailPage;
