import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress } from '@mui/material';
import { theme } from './theme';
import TopBar from './components/TopBar';
import SiteFooter from './components/SiteFooter';
import FooterBrandsWeService from './components/FooterBrandsWeService';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

const Home = lazy(() => import('./components/Home'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const SchedulerPage = lazy(() => import('./pages/SchedulerPage'));
const TechnicianDashboard = lazy(() => import('./pages/TechnicianDashboard'));
const ServiceCategoryPage = lazy(() => import('./pages/ServiceCategoryPage'));
const RegularBookingPage = lazy(() => import('./pages/RegularBookingPage'));
const EmergencyBookingPage = lazy(() => import('./pages/EmergencyBookingPage'));
const TrackRequestPage = lazy(() => import('./pages/TrackRequestPage'));
const BookingConfirmationPage = lazy(() => import('./pages/BookingConfirmationPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/LegalPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsOfServicePage = lazy(() => import('./pages/LegalPage').then(m => ({ default: m.TermsOfServicePage })));
const AccessibilityPage = lazy(() => import('./pages/LegalPage').then(m => ({ default: m.AccessibilityPage })));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const SitemapPage = lazy(() => import('./pages/SitemapPage'));
const MatchExpertPage = lazy(() => import('./pages/MatchExpertPage'));
const MembershipPage = lazy(() => import('./pages/MembershipPage'));

// Auth pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const MyBookingsPage = lazy(() => import('./pages/MyBookingsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

// Admin pages
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminBookingsPage = lazy(() => import('./pages/admin/AdminBookingsPage'));
const AdminCustomersPage = lazy(() => import('./pages/admin/AdminCustomersPage'));
const AdminServicesPage = lazy(() => import('./pages/admin/AdminServicesPage'));
const AdminExpertsPage = lazy(() => import('./pages/admin/AdminExpertsPage'));
const AdminExpertDetailPage = lazy(() => import('./pages/admin/AdminExpertDetailPage'));
const AdminMembershipPage = lazy(() => import('./pages/admin/AdminMembershipPage'));
const AdminReportsPage = lazy(() => import('./pages/admin/AdminReportsPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));

const ExpertsPage = lazy(() => import('./pages/ExpertsPage'));
const ExpertProfilePage = lazy(() => import('./pages/ExpertProfilePage'));

const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const ResourceArticlesPage = lazy(() => import('./pages/ResourceArticlesPage'));
const ResourceVideosPage = lazy(() => import('./pages/ResourceVideosPage'));
const ResourceArticleDetailPage = lazy(() => import('./pages/ResourceArticleDetailPage'));

const PageFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
    <CircularProgress />
  </Box>
);

/** Minimal shell for admin pages — no top nav, full-height sidebar layout */
const AdminShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
    {/* Sidebar */}
    <Box
      sx={{
        width: 220, flexShrink: 0, backgroundColor: '#0B3D91',
        display: { xs: 'none', md: 'flex' }, flexDirection: 'column', pt: 4, px: 2, gap: 0.5,
      }}
    >
      <Box sx={{ px: 1, mb: 3 }}>
        <Box sx={{ color: '#fff', fontWeight: 800, fontSize: '1rem', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>
          Smart Appliances
        </Box>
        <Box sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontFamily: 'Inter, sans-serif' }}>
          Admin Portal
        </Box>
      </Box>
      {[
        { label: 'Dashboard', to: '/admin/dashboard' },
        { label: 'Bookings', to: '/admin/bookings' },
        { label: 'Customers', to: '/admin/customers' },
        { label: 'Services', to: '/admin/services' },
        { label: '← Site', to: '/' },
      ].map(({ label, to }) => (
        <Box
          key={to}
          component="a"
          href={to}
          sx={{
            display: 'block', px: 1.5, py: 1, borderRadius: '8px', color: 'rgba(255,255,255,0.8)',
            fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', textDecoration: 'none',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)', color: '#fff' },
          }}
        >
          {label}
        </Box>
      ))}
    </Box>
    {/* Main */}
    <Box sx={{ flex: 1, overflow: 'auto' }}>{children}</Box>
  </Box>
);

function AppRoutes() {
  const location = useLocation();
  const showPublicChrome = !location.pathname.startsWith('/admin');

  return (
    <>
      {showPublicChrome && <TopBar />}
      <Box
        component="main"
        sx={{
          paddingTop: showPublicChrome ? { xs: '112px', md: '128px' } : 0,
          display: 'flex',
          flexDirection: 'column',
          minHeight: showPublicChrome ? '100vh' : undefined,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Suspense fallback={<PageFallback />}>
            <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/home-appliances" element={<ServiceCategoryPage slug="home-appliances" />} />
            <Route path="/services/plumbing" element={<ServiceCategoryPage slug="plumbing" />} />
            <Route path="/services/smart-home" element={<ServiceCategoryPage slug="smart-home" />} />
            <Route path="/services/hvac" element={<ServiceCategoryPage slug="hvac" />} />
            <Route path="/services/electrical" element={<ServiceCategoryPage slug="electrical" />} />
            <Route path="/services/tv-mounting" element={<ServiceCategoryPage slug="tv-mounting" />} />
            <Route path="/services/phone-repair" element={<ServiceCategoryPage slug="phone-repair" />} />
            <Route path="/services/handyman" element={<ServiceCategoryPage slug="handyman" />} />
            <Route path="/services/garage-door" element={<Navigate to="/services/garage-door-repair" replace />} />
            <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
            <Route path="/scheduler" element={<SchedulerPage />} />
            <Route path="/scheduler/shs" element={<SchedulerPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/match-expert" element={<MatchExpertPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/book/regular" element={<RegularBookingPage />} />
            <Route path="/book/emergency" element={<Navigate to="/emergency-service" replace />} />
            <Route path="/emergency-service" element={<EmergencyBookingPage />} />
            <Route path="/track-request" element={<TrackRequestPage />} />
            <Route path="/booking-confirmation/:requestNumber" element={<BookingConfirmationPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/sitemap" element={<SitemapPage />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />
            <Route path="/technician" element={<TechnicianDashboard />} />

            {/* Auth pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected user pages */}
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Admin login (no AdminRoute guard — it's the entry point) */}
            <Route
              path="/admin/login"
              element={
                <AdminShell>
                  <AdminLoginPage />
                </AdminShell>
              }
            />

            {/* Protected admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminDashboardPage />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminBookingsPage />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/customers"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminCustomersPage />
                  </AdminLayout>
                </AdminRoute>
              }
            />

            <Route
              path="/admin/services"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminServicesPage />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/experts"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminExpertsPage />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/experts/:expertId"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminExpertDetailPage />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/membership"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminMembershipPage />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminReportsPage />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminSettingsPage />
                  </AdminLayout>
                </AdminRoute>
              }
            />

<Route path="/experts" element={<ExpertsPage />} />
<Route path="/experts/:expertSlug" element={<ExpertProfilePage />} />

<Route path="/resources" element={<ResourcesPage />} />
<Route path="/resources/articles" element={<ResourceArticlesPage />} />
<Route path="/resources/videos" element={<ResourceVideosPage />} />
<Route path="/resources/:articleSlug" element={<ResourceArticleDetailPage />} />

            {/* /admin now resolves to the real Supabase-backed admin dashboard */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </Suspense>
        </Box>
        {showPublicChrome && (
          <>
            <FooterBrandsWeService />
            <SiteFooter />
          </>
        )}
      </Box>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <div className="App">
            <AppRoutes />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
