import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import { Phone, Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
];

interface TopBarProps {
  cartCount: number;
}

const TopBar: React.FC<TopBarProps> = ({ cartCount }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Top info bar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: 'rgba(2, 47, 73, 0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          zIndex: 1002,
          top: 0,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '40px !important', padding: '0 24px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Phone sx={{ color: '#22B1FB', fontSize: '1rem' }} />
            <Typography
              variant="body2"
              sx={{ color: '#FFFFFF', fontFamily: 'DM Sans, Arial, sans-serif', fontSize: '0.85rem' }}
            >
              +1 (555) 123-4567
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {['FB', 'TW', 'YT', 'IG'].map((social) => (
              <Box key={social} component="a" href="#" sx={linkStyle}>
                {social}
              </Box>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main nav bar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: 'rgba(2, 47, 73, 0.94)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          zIndex: 1001,
          top: '40px',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px' }}>
          {/* Logo + desktop nav */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              component="img"
              src="/Logo.png"
              alt="Smart Applications Logo"
              sx={{
                height: '50px',
                width: 'auto',
                objectFit: 'contain',
                cursor: 'pointer',
                '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s ease' },
              }}
              onClick={() => handleNavClick('/')}
            />
            <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 0.5 }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  onClick={() => handleNavClick(item.path)}
                  sx={{
                    color: isActive(item.path) ? '#22B1FB' : '#FFFFFF',
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    fontWeight: isActive(item.path) ? 700 : 500,
                    fontSize: '0.85rem',
                    textTransform: 'none',
                    padding: '6px 10px',
                    borderRadius: '0px',
                    borderBottom: isActive(item.path) ? '3px solid #22B1FB' : '3px solid transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(34, 177, 251, 0.12)',
                      color: '#22B1FB',
                      borderRadius: '8px',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Right side: phone, Book Service, Emergency, cart, hamburger */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              <Phone sx={{ color: '#22B1FB', fontSize: '1.1rem' }} />
              <Typography
                variant="body2"
                sx={{ color: '#FFFFFF', fontFamily: 'DM Sans, Arial, sans-serif', fontSize: '0.9rem' }}
              >
                +1 (555) 123-4567
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={() => handleNavClick('/book/regular')}
              sx={{
                backgroundColor: '#22B1FB',
                color: '#FFFFFF',
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontWeight: 600,
                fontSize: '0.85rem',
                textTransform: 'none',
                padding: '6px 16px',
                borderRadius: '8px',
                display: { xs: 'none', sm: 'flex' },
                '&:hover': { backgroundColor: '#FFFFFF', color: '#022F49' },
              }}
            >
              Book Service
            </Button>

            <Button
              variant="outlined"
              onClick={() => handleNavClick('/book/emergency')}
              sx={{
                borderColor: '#FF6B6B',
                color: '#FF6B6B',
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontWeight: 600,
                fontSize: '0.8rem',
                textTransform: 'none',
                padding: '5px 12px',
                borderRadius: '8px',
                display: { xs: 'none', md: 'flex' },
                '&:hover': { backgroundColor: '#FF6B6B', color: '#FFFFFF', borderColor: '#FF6B6B' },
              }}
            >
              Emergency
            </Button>

            {/* Admin link */}
            <Button
              onClick={() => handleNavClick('/admin')}
              sx={{
                color: 'rgba(255,255,255,0.4)',
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontSize: '0.7rem',
                textTransform: 'none',
                display: { xs: 'none', lg: 'flex' },
                '&:hover': { color: 'rgba(255,255,255,0.8)' },
              }}
            >
              Admin
            </Button>

            {/* Cart icon */}
            <Box sx={{ position: 'relative' }}>
              <Box
                component="img"
                src="/cart.png"
                alt="Shopping Cart"
                sx={{
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  filter: 'brightness(0) invert(1)',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'scale(1.1)' },
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

            {/* Hamburger for mobile/tablet */}
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { xs: 'flex', lg: 'none' }, color: '#FFFFFF', ml: 0.5 }}
              aria-label="Open navigation menu"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile/tablet drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 300, backgroundColor: '#022F49' } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 2 }}>
          <Box
            component="img"
            src="/Logo.png"
            alt="Logo"
            sx={{ height: '40px', width: 'auto', objectFit: 'contain' }}
          />
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#FFFFFF' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
        <List sx={{ py: 1 }}>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                onClick={() => handleNavClick(item.path)}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderLeft: isActive(item.path) ? '4px solid #22B1FB' : '4px solid transparent',
                  '&:hover': { backgroundColor: 'rgba(34, 177, 251, 0.1)' },
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    color: isActive(item.path) ? '#22B1FB' : '#FFFFFF',
                    fontWeight: isActive(item.path) ? 700 : 400,
                    fontSize: '1rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
          {/* Admin link in drawer */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavClick('/admin')}
              sx={{ px: 3, py: 1.5, '&:hover': { backgroundColor: 'rgba(34, 177, 251, 0.1)' } }}
            >
              <ListItemText
                primary="Admin"
                primaryTypographyProps={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  color: 'rgba(255,255,255,0.4)',
                  fontWeight: 400,
                  fontSize: '0.85rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mt: 1 }} />
        <Box sx={{ px: 3, py: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleNavClick('/book/regular')}
            sx={{
              backgroundColor: '#22B1FB',
              color: '#FFFFFF',
              fontFamily: 'DM Sans, Arial, sans-serif',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '10px',
              py: 1.25,
              '&:hover': { backgroundColor: '#FFFFFF', color: '#022F49' },
            }}
          >
            Book Service
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => handleNavClick('/book/emergency')}
            sx={{
              borderColor: '#FF6B6B',
              color: '#FF6B6B',
              fontFamily: 'DM Sans, Arial, sans-serif',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '10px',
              py: 1.25,
              '&:hover': { backgroundColor: '#FF6B6B', color: '#FFFFFF' },
            }}
          >
            Emergency Service
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, justifyContent: 'center' }}>
            <Phone sx={{ color: '#22B1FB', fontSize: '1rem' }} />
            <Typography
              variant="body2"
              sx={{ color: '#FFFFFF', fontFamily: 'DM Sans, Arial, sans-serif', fontSize: '0.9rem' }}
            >
              +1 (555) 123-4567
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

const linkStyle = {
  color: '#FFFFFF',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '26px',
  height: '26px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  transition: 'all 0.3s ease',
  textDecoration: 'none',
  fontSize: '0.65rem',
  fontWeight: 700,
  '&:hover': {
    color: '#22B1FB',
    backgroundColor: 'rgba(34, 177, 251, 0.2)',
    transform: 'scale(1.1)',
  },
};

export default TopBar;
