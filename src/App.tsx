import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { theme } from './theme';
import TopBar from './components/TopBar';
import Home from './components/Home';
import BookingDialog from './components/BookingDialog';
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
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingPriority, setBookingPriority] = useState<ServicePriority>('regular');
  const [bookingCategory, setBookingCategory] = useState<string>('appliance-repair');
  const [bookingServiceType, setBookingServiceType] = useState<string>('refrigerator-repair');
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as ServiceRequest[];
      }
    } catch {
      // ignore parse errors
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serviceRequests));
    } catch {
      // ignore storage errors
    }
  }, [serviceRequests]);

  const totalCartCount = Object.values(cartItems).reduce((sum, count) => sum + count, 0);

  const handleOpenBooking = (
    priority: ServicePriority,
    categoryId?: string,
    serviceTypeId?: string,
  ) => {
    setBookingPriority(priority);
    if (categoryId) {
      setBookingCategory(categoryId);
    }
    if (serviceTypeId) {
      setBookingServiceType(serviceTypeId);
    }
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  const handleSubmitRequest = (request: ServiceRequest) => {
    setServiceRequests((current) => [request, ...current]);
    setIsBookingOpen(false);
  };

  const handleUpdateStatus = (id: string, status: ServiceRequest['status']) => {
    setServiceRequests((current) =>
      current.map((request) =>
        request.id === id ? { ...request, status, updatedAt: new Date().toISOString() } : request,
      ),
    );
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setServiceRequests((current) =>
      current.map((request) =>
        request.id === id ? { ...request, notes, updatedAt: new Date().toISOString() } : request,
      ),
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <TopBar cartCount={totalCartCount} onScheduleClick={() => handleOpenBooking('regular')} />
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
        <BookingDialog
          open={isBookingOpen}
          onClose={handleCloseBooking}
          initialPriority={bookingPriority}
          initialCategoryId={bookingCategory}
          initialServiceTypeId={bookingServiceType}
          onSubmitRequest={handleSubmitRequest}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
