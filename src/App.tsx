import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { theme } from './theme';
import TopBar from './components/TopBar';
import Home from './components/Home';
import ServicesPage from './pages/ServicesPage';
import RegularBookingPage from './pages/RegularBookingPage';
import EmergencyBookingPage from './pages/EmergencyBookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import AdminDashboard from './pages/AdminDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';

const STORAGE_KEY = 'smart-appliances-service-requests';

function App() {
  const [cartItems, setCartItems] = useState({
    refrigerator: 0,
    washingMachine: 0,
    bulb: 0,
    oven: 0,
  });

  // Keep service requests in state for the old admin component (legacy support)
  const [_serviceRequests, setServiceRequests] = useState<unknown[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as unknown[];
      }
    } catch {
      // ignore parse errors
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_serviceRequests));
    } catch {
      // ignore storage errors
    }
  }, [_serviceRequests]);

  // Keep setServiceRequests available for potential use
  void setServiceRequests;

  const totalCartCount = Object.values(cartItems).reduce((sum, count) => sum + count, 0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ paddingTop: '104px' }}>
          <TopBar cartCount={totalCartCount} />
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                />
              }
            />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/book/regular" element={<RegularBookingPage />} />
            <Route path="/book/emergency" element={<EmergencyBookingPage />} />
            <Route path="/confirmation/:requestId" element={<ConfirmationPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/technician" element={<TechnicianDashboard />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
