import React, { useState, useEffect } from 'react';
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
  { label: 'Home', href: '#home', id: 'home' },
  { label: 'About Us', href: '#about', id: 'about' },
  { label: 'Services', href: '#services', id: 'services' },
  { label: 'Buy Appliances', href: '#appliances', id: 'appliances' },
  { label: 'Repair Services', href: '#repair', id: 'repair' },
  { label: 'Contact Us', href: '#contact', id: 'contact' },
];

interface TopBarProps {
  cartCount: number;
  onScheduleClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ cartCount, onScheduleClick }) => {
  const [selectedItem, setSelectedItem] = useState('Home');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems
        .map((item) => document.getElementById(item.id))
        .filter(Boolean) as HTMLElement[];

      if (sections.length === 0) return;

      const scrollPosition = window.scrollY + 220;

      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section) continue;
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setSelectedItem(navItems[i].label);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (label: string) => {
    setSelectedItem(label);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Top info bar */}
      <AppBar
        position="fixed"
        sx={{ backgroundColor: '#022F49', boxShadow: 'none', zIndex: 1002, top: 0 }}
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
          backgroundColor: 'rgba(2, 47, 73, 0.97)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 1001,
          top: '60px',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '60px' }}>
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
              onClick={() => {
                setSelectedItem('Home');
                document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 0.5 }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  href={item.href}
                  onClick={() => handleNavClick(item.label)}
                  sx={{
                    color: selectedItem === item.label ? '#22B1FB' : '#FFFFFF',
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    fontWeight: selectedItem === item.label ? 700 : 500,
                    fontSize: '0.85rem',
                    textTransform: 'none',
                    padding: '6px 10px',
                    borderRadius: '0px',
                    borderBottom: selectedItem === item.label ? '3px solid #22B1FB' : '3px solid transparent',
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

          {/* Right side: phone, schedule, cart, hamburger */}
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
              onClick={onScheduleClick}
              sx={{
                backgroundColor: '#22B1FB',
                color: '#FFFFFF',
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontWeight: 600,
                fontSize: '0.85rem',
                textTransform: 'none',
                padding: '6px 16px',
                borderRadius: '8px',
                '&:hover': { backgroundColor: '#FFFFFF', color: '#022F49' },
              }}
            >
              Schedule
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
                component="a"
                href={item.href}
                onClick={() => handleNavClick(item.label)}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderLeft: selectedItem === item.label ? '4px solid #22B1FB' : '4px solid transparent',
                  '&:hover': { backgroundColor: 'rgba(34, 177, 251, 0.1)' },
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    color: selectedItem === item.label ? '#22B1FB' : '#FFFFFF',
                    fontWeight: selectedItem === item.label ? 700 : 400,
                    fontSize: '1rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mt: 1 }} />
        <Box sx={{ px: 3, py: 2.5 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              onScheduleClick();
              setDrawerOpen(false);
            }}
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
            Schedule a Service
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, justifyContent: 'center' }}>
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
