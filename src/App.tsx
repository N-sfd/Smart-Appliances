import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { theme } from './theme';
import TopBar from './components/TopBar';
import Home from './components/Home';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ServicesPage from './pages/ServicesPage';
import AdminDashboard from './pages/AdminDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import RegularBookingPage from './pages/RegularBookingPage';
import EmergencyBookingPage from './pages/EmergencyBookingPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <div className="App">
          <TopBar />
          <Box sx={{ paddingTop: '100px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/book/regular" element={<RegularBookingPage />} />
              <Route path="/book/emergency" element={<EmergencyBookingPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/technician" element={<TechnicianDashboard />} />
            </Routes>
          </Box>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
