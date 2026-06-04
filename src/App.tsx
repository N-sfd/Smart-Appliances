import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { theme } from './theme';
import TopBar from './components/TopBar';
import Home from './components/Home';
import RegularServiceModal from './components/RegularServiceModal';
import EmergencyServiceModal from './components/EmergencyServiceModal';
import ServiceRequestsAdmin from './components/ServiceRequestsAdmin';
import { ServicePriority, ServiceRequest } from './data/services';

const STORAGE_KEY = 'smart-appliances-service-requests';

function App() {
  const [cartItems, setCartItems] = useState({
    refrigerator: 0,
    washingMachine: 0,
    bulb: 0,
    oven: 0,
  });

  const [isRegularOpen, setIsRegularOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [modalCategoryId, setModalCategoryId] = useState<string>('appliance-repair');
  const [modalServiceTypeId, setModalServiceTypeId] = useState<string>('refrigerator-repair');

  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved) as ServiceRequest[];
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serviceRequests));
    } catch {
      // ignore
    }
  }, [serviceRequests]);

  const totalCartCount = Object.values(cartItems).reduce((sum, n) => sum + n, 0);

  // Single entry point used by Home.tsx — routes to the correct modal by priority
  const handleOpenBooking = (
    priority: ServicePriority,
    categoryId?: string,
    serviceTypeId?: string,
  ) => {
    if (categoryId) setModalCategoryId(categoryId);
    if (serviceTypeId) setModalServiceTypeId(serviceTypeId);
    if (priority === 'emergency') {
      setIsEmergencyOpen(true);
    } else {
      setIsRegularOpen(true);
    }
  };

  const handleSubmitRequest = (request: ServiceRequest) => {
    setServiceRequests((prev) => [request, ...prev]);
    // Modals close themselves after showing success state
  };

  const handleUpdateStatus = (id: string, status: ServiceRequest['status']) => {
    setServiceRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r,
      ),
    );
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setServiceRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, notes, updatedAt: new Date().toISOString() } : r,
      ),
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <TopBar
          cartCount={totalCartCount}
          onScheduleClick={() => handleOpenBooking('regular')}
        />
        <Box sx={{ paddingTop: '124px' }}>
          <Home
            cartItems={cartItems}
            setCartItems={setCartItems}
            onOpenBooking={handleOpenBooking}
          />
          <ServiceRequestsAdmin
            serviceRequests={serviceRequests}
            onUpdateStatus={handleUpdateStatus}
            onUpdateNotes={handleUpdateNotes}
          />
        </Box>

        <RegularServiceModal
          open={isRegularOpen}
          onClose={() => setIsRegularOpen(false)}
          initialCategoryId={modalCategoryId}
          initialServiceTypeId={modalServiceTypeId}
          onSubmitRequest={handleSubmitRequest}
        />

        <EmergencyServiceModal
          open={isEmergencyOpen}
          onClose={() => setIsEmergencyOpen(false)}
          initialCategoryId={modalCategoryId}
          initialServiceTypeId={modalServiceTypeId}
          onSubmitRequest={handleSubmitRequest}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
