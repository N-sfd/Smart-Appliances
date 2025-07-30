import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';

interface TopBarProps {
  cartCount: number;
}

const TopBar: React.FC<TopBarProps> = ({ cartCount }) => {
  const [selectedItem, setSelectedItem] = useState('Home');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'About Us', href: '#about', id: 'about' },
    { label: 'Buy Appliances', href: '#appliances', id: 'appliances' },
    { label: 'Repair Appliances', href: '#repair', id: 'repair' },
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
      {/* Contact Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: '#022F49',
          boxShadow: 'none',
          zIndex: 1002,
          top: 0,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '40px', padding: '0 24px' }}>
          {/* Contact Number */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Phone sx={{ color: '#22B1FB', fontSize: '1rem' }} />
            <Typography
              variant="body2"
              sx={{
                color: '#FFFFFF',
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontSize: '0.85rem',
              }}
            >
              +1 (555) 123-4567
            </Typography>
          </Box>

          {/* Social Media Links */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              component="a"
              href="#"
              sx={{
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#22B1FB',
                  backgroundColor: 'rgba(34, 177, 251, 0.2)',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </Box>
            <Box
              component="a"
              href="#"
              sx={{
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#22B1FB',
                  backgroundColor: 'rgba(34, 177, 251, 0.2)',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </Box>
            <Box
              component="a"
              href="#"
              sx={{
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#22B1FB',
                  backgroundColor: 'rgba(34, 177, 251, 0.2)',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
            </Box>
            <Box
              component="a"
              href="#"
              sx={{
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#22B1FB',
                  backgroundColor: 'rgba(34, 177, 251, 0.2)',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main TopBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: 'rgba(2, 47, 73, 0.95)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          zIndex: 1001,
          top: '60px', // Position below the contact bar with more spacing
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '60px' }}>
          {/* Logo and Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {/* Logo */}
            <Box
              component="img"
              src="/Logo.png"
              alt="Smart Applications Logo"
              sx={{
                height: '50px',
                width: 'auto',
                objectFit: 'contain',
                marginTop: '8px',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.05)',
                  transition: 'transform 0.2s ease',
                },
              }}
              onClick={() => {
                setSelectedItem('Home');
                document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            
            {/* Navigation Items */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  href={item.href}
                  onClick={() => setSelectedItem(item.label)}
                  sx={{
                    color: selectedItem === item.label ? '#22B1FB' : '#FFFFFF',
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    fontWeight: selectedItem === item.label ? 700 : 600,
                    fontSize: '0.9rem',
                    textTransform: 'none',
                    padding: '6px 12px',
                    borderRadius: '0px',
                    borderBottom: selectedItem === item.label ? '3px solid #22B1FB' : '3px solid transparent',
                    '&:hover': {
                      backgroundColor: selectedItem === item.label ? 'rgba(34, 177, 251, 0.2)' : '#22B1FB',
                      color: selectedItem === item.label ? '#22B1FB' : '#FFFFFF',
                      borderRadius: '8px',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Contact Information and Schedule Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {/* Phone */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone sx={{ color: '#22B1FB', fontSize: '1.2rem' }} />
              <Typography
                variant="body2"
                sx={{
                  color: '#FFFFFF',
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontSize: '0.9rem',
                }}
              >
                +1 (555) 123-4567
              </Typography>
            </Box>

            {/* Schedule Button */}
            <Button
              variant="contained"
              onClick={handleScheduleClick}
              sx={{
                backgroundColor: '#22B1FB',
                color: '#FFFFFF',
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontWeight: 600,
                fontSize: '0.9rem',
                textTransform: 'none',
                padding: '6px 16px',
                borderRadius: '8px',
                minHeight: '32px',
                '&:hover': {
                  backgroundColor: '#FFFFFF',
                  color: '#022F49',
                },
              }}
            >
              Schedule
            </Button>

            {/* Cart Icon */}
            <Box sx={{ position: 'relative' }}>
              <Box
                component="img"
                src="/cart.png"
                alt="Shopping Cart"
                sx={{
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  filter: 'brightness(0) invert(1)', // Makes the image white
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    filter: 'brightness(0) invert(1) sepia(1) saturate(5) hue-rotate(180deg)', // Makes it blue on hover
                  },
                }}
              />
              {cartCount > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    backgroundColor: '#FF4444',
                    color: '#FFFFFF',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    border: '2px solid #FFFFFF',
                  }}
                >
                  {cartCount}
                </Box>
              )}
            </Box>
          </Box>
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

export default TopBar; 