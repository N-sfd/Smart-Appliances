import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Modal,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const NavigationBar: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState('Home');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'Appliances', href: '#appliances', id: 'appliances' },
    { label: 'Repair Services', href: '#repair', id: 'repair' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Contact Us', href: '#contact', id: 'contact' },
  ];

  const repairItems = [
    'Refrigerator',
    'Washing Machine',
    'Dishwasher',
    'Speaker',
    'Microwave',
    'Dryer',
    'Air Conditioner',
    'Water Heater',
    'TV',
    'Camera'
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id)).filter(Boolean);
      
      if (sections.length === 0) return;

      const scrollPosition = window.scrollY + 200; // Offset for fixed header

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setSelectedItem(navItems[i].label);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScheduleClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <AppBar 
        position="fixed"
        sx={{ 
          backgroundColor: 'rgba(217, 217, 217, 0.9)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          zIndex: 1000,
          top: '60px', // Position below the TopBar (accounting for logo height)
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '60px' }}>
          {/* Navigation Items - Left Aligned */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                href={item.href}
                onClick={() => setSelectedItem(item.label)}
                sx={{
                  color: selectedItem === item.label ? '#22B1FB' : '#022F49',
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontWeight: selectedItem === item.label ? 700 : 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  borderBottom: selectedItem === item.label ? '3px solid #22B1FB' : '3px solid transparent',
                  '&:hover': {
                    backgroundColor: selectedItem === item.label ? 'rgba(34, 177, 251, 0.2)' : '#022F49',
                    color: selectedItem === item.label ? '#22B1FB' : '#FFFFFF',
                  },
                  '&:active': {
                    backgroundColor: '#22B1FB',
                    color: '#FFFFFF',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Schedule Button - Right Aligned */}
          <Button
            variant="contained"
            onClick={handleScheduleClick}
            sx={{
              backgroundColor: '#22B1FB',
              color: '#FFFFFF',
              fontFamily: 'DM Sans, Arial, sans-serif',
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              padding: '6px 20px',
              borderRadius: '12px',
              minHeight: '36px',
              '&:hover': {
                backgroundColor: '#022F49',
              },
            }}
          >
            Schedule
          </Button>
        </Toolbar>
      </AppBar>

      {/* Schedule Appointment Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="schedule-modal-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
        }}
      >
        <Box
          sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: 4,
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: '#666666',
              '&:hover': {
                color: '#FF0000',
                backgroundColor: '#FFE6E6',
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Modal Content */}
          <Typography
            id="schedule-modal-title"
            variant="h5"
            sx={{
              fontFamily: 'Wasted Vindey, Arial, sans-serif',
              fontWeight: 600,
              color: '#022F49',
              marginBottom: 2,
              paddingRight: 4,
              marginTop: 0,
            }}
          >
            Schedule Repair Appointment
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontFamily: 'DM Sans, Arial, sans-serif',
              color: '#666666',
              marginBottom: 3,
              lineHeight: 1.6,
            }}
          >
            Need help with your appliance? Schedule a repair appointment with our expert technicians. 
            We'll contact you to confirm the appointment time and provide a detailed quote.
          </Typography>

          {/* Contact Information */}
          <Box sx={{ backgroundColor: '#F5F7F9', padding: 2, borderRadius: '8px', marginBottom: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontWeight: 600,
                color: '#022F49',
                marginBottom: 1,
              }}
            >
              Contact Information
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'DM Sans, Arial, sans-serif',
                color: '#666666',
                marginBottom: 0.5,
              }}
            >
              📞 +1 (555) 123-4567
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'DM Sans, Arial, sans-serif',
                color: '#666666',
              }}
            >
              ✉️ info@smartapplications.com
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Name Field */}
            <TextField
              label="Full Name"
              variant="outlined"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontFamily: 'DM Sans, Arial, sans-serif',
                },
              }}
            />

            {/* Email Field */}
            <TextField
              label="Email Address"
              type="email"
              variant="outlined"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontFamily: 'DM Sans, Arial, sans-serif',
                },
              }}
            />

            {/* Phone Field */}
            <TextField
              label="Phone Number"
              type="tel"
              variant="outlined"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontFamily: 'DM Sans, Arial, sans-serif',
                },
              }}
            />

            {/* Repair Item Dropdown */}
            <FormControl variant="outlined" required>
              <InputLabel sx={{ fontFamily: 'DM Sans, Arial, sans-serif' }}>
                Select Item for Repair
              </InputLabel>
              <Select
                label="Select Item for Repair"
                sx={{
                  borderRadius: '8px',
                  fontFamily: 'DM Sans, Arial, sans-serif',
                }}
              >
                {repairItems.map((item) => (
                  <MenuItem key={item} value={item} sx={{ fontFamily: 'DM Sans, Arial, sans-serif' }}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Description Field */}
            <TextField
              label="Description of Issue"
              variant="outlined"
              multiline
              rows={3}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontFamily: 'DM Sans, Arial, sans-serif',
                },
              }}
            />

            {/* Schedule Button */}
            <Button
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: '#22B1FB',
                color: '#FFFFFF',
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                marginTop: 2,
                '&:hover': {
                  backgroundColor: '#022F49',
                },
              }}
            >
              Schedule Appointment
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default NavigationBar; 