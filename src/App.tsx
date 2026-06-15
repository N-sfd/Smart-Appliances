import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress } from '@mui/material';
import { theme } from './theme';
import TopBar from './components/TopBar';
import Home from './components/Home';

const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const SchedulerPage = lazy(() => import('./pages/SchedulerPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const TechnicianDashboard = lazy(() => import('./pages/TechnicianDashboard'));
const ServiceCategoryPage = lazy(() => import('./pages/ServiceCategoryPage'));
const RegularBookingPage = lazy(() => import('./pages/RegularBookingPage'));
const EmergencyBookingPage = lazy(() => import('./pages/EmergencyBookingPage'));
const TrackRequestPage = lazy(() => import('./pages/TrackRequestPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/LegalPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsOfServicePage = lazy(() => import('./pages/LegalPage').then(m => ({ default: m.TermsOfServicePage })));
const AccessibilityPage = lazy(() => import('./pages/LegalPage').then(m => ({ default: m.AccessibilityPage })));
const PricingPage = lazy(() => import('./pages/PricingPage'));

const PageFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
    <CircularProgress />
  </Box>
);

function AppRoutes() {
  return (
    <>
      <TopBar />
      <Box sx={{ paddingTop: { xs: '112px', md: '128px' } }}>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/home-appliances" element={<ServiceCategoryPage slug="home-appliances" />} />
            <Route path="/services/plumbing" element={<ServiceCategoryPage slug="plumbing" />} />
            <Route path="/services/smart-home" element={<ServiceCategoryPage slug="smart-home" />} />
            <Route path="/services/hvac" element={<ServiceCategoryPage slug="hvac" />} />
            <Route path="/services/electrical" element={<ServiceCategoryPage slug="electrical" />} />
            <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
            <Route path="/scheduler" element={<SchedulerPage />} />
            <Route path="/scheduler/shs" element={<SchedulerPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/book/regular" element={<RegularBookingPage />} />
            <Route path="/book/emergency" element={<Navigate to="/emergency-service" replace />} />
            <Route path="/emergency-service" element={<EmergencyBookingPage />} />
            <Route path="/track-request" element={<TrackRequestPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/technician" element={<TechnicianDashboard />} />
          </Routes>
        </Suspense>
      </Box>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <div className="App">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
