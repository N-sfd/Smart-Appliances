import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Collapse,
} from '@mui/material';
import { Phone, Menu as MenuIcon, Close as CloseIcon, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { colors, fonts, primaryButtonSx } from '../theme';
import { BrandLogo } from './Logo';
import {
  serviceNavItems,
  serviceNavPath,
  isServiceNavItemActive,
  ServiceNavItem,
} from '../data/serviceNavItems';

interface NavLink {
  label: string;
  path: string;
  hash?: string;
  cat?: string;
}

const navLinks: NavLink[] = [
  { label: 'Services', path: '/services' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Brands We Service', path: '/', hash: 'brands' },
  { label: 'Why Choose Us', path: '/', hash: 'why-choose-us' },
  { label: 'Service Areas', path: '/', hash: 'service-areas' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [servicesDrawerOpen, setServicesDrawerOpen] = useState(false);
  const servicesMenuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const servicesMenuRef = useRef<HTMLDivElement | null>(null);

  const isServicesSection = location.pathname.startsWith('/services');

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setServicesMenuOpen(false);
    if (isServicesSection) setServicesDrawerOpen(true);
  }, [location.pathname, isServicesSection]);

  useEffect(() => {
    if (!servicesMenuOpen) return undefined;

    const handlePointerDown = (event: MouseEvent) => {
      if (servicesMenuRef.current && !servicesMenuRef.current.contains(event.target as Node)) {
        setServicesMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setServicesMenuOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [servicesMenuOpen]);

  const openServicesMenu = () => {
    if (servicesMenuCloseTimer.current) clearTimeout(servicesMenuCloseTimer.current);
    setServicesMenuOpen(true);
  };

  const closeServicesMenu = () => {
    servicesMenuCloseTimer.current = setTimeout(() => setServicesMenuOpen(false), 120);
  };

  const isActive = (link: NavLink): boolean => {
    if (link.label === 'Services') return isServicesSection;
    if (link.hash) return false;
    if (link.path === '/') return location.pathname === '/';
    if (!location.pathname.startsWith(link.path)) return false;
    if (link.cat) return new URLSearchParams(location.search).get('cat') === link.cat;
    return true;
  };

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 400);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (link: NavLink) => {
    if (link.label === 'Services') {
      navigate('/services');
      setDrawerOpen(false);
      return;
    }
    if (link.hash) scrollToSection(link.hash);
    else navigate(link.cat ? `${link.path}?cat=${link.cat}` : link.path);
    setDrawerOpen(false);
  };

  const goToService = (item: ServiceNavItem) => {
    navigate(serviceNavPath(item));
    setServicesMenuOpen(false);
    setDrawerOpen(false);
  };

  const toggleServicesMenu = () => {
    setServicesMenuOpen((open) => !open);
  };

  const navButtonSx = (active: boolean) => ({
    color: active ? colors.primaryBlue : colors.darkText,
    fontFamily: fonts.heading,
    fontWeight: active ? 700 : 600,
    fontSize: '0.88rem',
    textTransform: 'none' as const,
    px: 0.9,
    py: 0.85,
    minWidth: 'auto',
    whiteSpace: 'nowrap' as const,
    borderRadius: 0,
    borderBottom: '2px solid',
    borderBottomColor: active ? colors.primaryBlue : 'transparent',
    transition: 'color 0.2s ease, border-color 0.2s ease',
    '&:hover': {
      backgroundColor: 'transparent',
      color: colors.primaryBlue,
    },
  });

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: colors.surface,
          borderBottom: `1px solid ${colors.border}`,
          boxShadow: scrolled ? '0 4px 20px rgba(10, 37, 64, 0.08)' : 'none',
          transition: 'box-shadow 0.25s ease',
          zIndex: 1100,
          overflow: 'visible',
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            minHeight: { xs: '112px !important', md: '128px !important' },
            py: { xs: 1, md: 1.25 },
            pl: { xs: 1.5, sm: 2, md: 2.5, lg: 3 },
            pr: { xs: 2, lg: 3 },
            gap: 0.5,
            overflow: 'visible',
          }}
        >
          <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', mr: { xs: 2, md: 3.5, lg: 4.5 } }}>
            <BrandLogo variant="header" onClick={() => { navigate('/'); setDrawerOpen(false); }} />
          </Box>

          <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 0.25, alignItems: 'center', flexGrow: 1, justifyContent: 'flex-start', ml: { lg: 2.5, xl: 3.5 } }}>
            {navLinks.map((link) => {
              const active = isActive(link);

              if (link.label === 'Services') {
                return (
                  <Box
                    key={link.label}
                    ref={servicesMenuRef}
                    sx={{ position: 'relative' }}
                    onMouseEnter={openServicesMenu}
                    onMouseLeave={closeServicesMenu}
                  >
                    <Button
                      onClick={toggleServicesMenu}
                      disableRipple
                      aria-expanded={servicesMenuOpen}
                      aria-haspopup="menu"
                      endIcon={
                        <KeyboardArrowDown
                          sx={{
                            fontSize: '1.1rem !important',
                            transform: servicesMenuOpen ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s ease',
                          }}
                        />
                      }
                      sx={navButtonSx(active)}
                    >
                      {link.label}
                    </Button>

                    {servicesMenuOpen && (
                      <Box
                        onMouseEnter={openServicesMenu}
                        onMouseLeave={closeServicesMenu}
                        sx={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          pt: 0.75,
                          zIndex: 1200,
                        }}
                      >
                        <Box
                          className="services-nav-dropdown"
                          role="menu"
                          aria-label="Services menu"
                        >
                          {serviceNavItems.map((item, index) => {
                            const itemActive = isServiceNavItemActive(
                              item,
                              location.pathname,
                              location.search,
                            );
                            const Icon = item.icon;
                            const isLast = index === serviceNavItems.length - 1;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                role="menuitem"
                                className={[
                                  'services-nav-dropdown-item',
                                  itemActive ? 'is-active' : '',
                                  isLast ? 'is-last' : '',
                                ].filter(Boolean).join(' ')}
                                onClick={() => goToService(item)}
                              >
                                <Icon className="services-nav-dropdown-icon" aria-hidden="true" />
                                <span>{item.label}</span>
                              </button>
                            );
                          })}
                        </Box>
                      </Box>
                    )}
                  </Box>
                );
              }

              return (
                <Button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  disableRipple
                  sx={navButtonSx(active)}
                >
                  {link.label}
                </Button>
              );
            })}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexShrink: 0 }}>
            <Button
              component="a"
              href="tel:+18885550199"
              startIcon={<Phone sx={{ fontSize: '1rem !important' }} />}
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                color: colors.navy,
                fontFamily: fonts.body,
                fontWeight: 700,
                fontSize: '0.82rem',
                textTransform: 'none',
                border: `1.5px solid ${colors.border}`,
                borderRadius: '10px',
                px: 1.5,
                py: 0.55,
                whiteSpace: 'nowrap',
                '&:hover': { backgroundColor: colors.lightBlueBg, borderColor: colors.primaryBlue, color: colors.primaryBlue },
              }}
            >
              (888) 555-0199
            </Button>

            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { xs: 'flex', lg: 'none' }, color: colors.navy }}
              aria-label="Open navigation menu"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 300, backgroundColor: colors.surface } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 2 }}>
          <BrandLogo variant="header" onClick={() => { navigate('/'); setDrawerOpen(false); }} />
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: colors.navy }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: colors.border }} />
        <List sx={{ py: 1 }}>
          {navLinks.map((link) => {
            const active = isActive(link);

            if (link.label === 'Services') {
              return (
                <React.Fragment key={link.label}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => setServicesDrawerOpen((open) => !open)}
                      sx={{
                        px: 3,
                        py: 1.4,
                        backgroundColor: active ? colors.lightBlueBg : 'transparent',
                        '&:hover': { backgroundColor: colors.lightBlueBg },
                      }}
                    >
                      <ListItemText
                        primary={link.label}
                        primaryTypographyProps={{
                          fontFamily: fonts.body,
                          color: active ? colors.primaryBlue : colors.darkText,
                          fontWeight: active ? 700 : 600,
                          fontSize: '0.95rem',
                        }}
                      />
                      {servicesDrawerOpen ? (
                        <KeyboardArrowUp sx={{ color: colors.primaryBlue, fontSize: '1.2rem' }} />
                      ) : (
                        <KeyboardArrowDown sx={{ color: colors.mutedText, fontSize: '1.2rem' }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={servicesDrawerOpen} timeout="auto" unmountOnExit>
                    <List disablePadding sx={{ pb: 1 }}>
                      {serviceNavItems.map((item, index) => {
                        const itemActive = isServiceNavItemActive(
                          item,
                          location.pathname,
                          location.search,
                        );
                        const Icon = item.icon;
                        const isLast = index === serviceNavItems.length - 1;
                        return (
                          <ListItem key={item.id} disablePadding sx={{ px: 1.5 }}>
                            <ListItemButton
                              onClick={() => goToService(item)}
                              sx={{
                                minHeight: 56,
                                px: 2,
                                py: 1.25,
                                borderRadius: 0,
                                gap: 2,
                                borderBottom: isLast ? 'none' : '1px solid #E4E7EB',
                                backgroundColor: itemActive ? colors.lightBlueBg : 'transparent',
                                '&:hover': {
                                  backgroundColor: colors.lightBlueBg,
                                },
                              }}
                            >
                              <Icon
                                className="services-nav-dropdown-icon"
                                aria-hidden="true"
                                sx={{ color: itemActive ? colors.primaryBlue : '#64748B' }}
                              />
                              <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{
                                  fontFamily: fonts.body,
                                  color: itemActive ? colors.primaryBlue : colors.darkText,
                                  fontWeight: 600,
                                  fontSize: '0.95rem',
                                }}
                              />
                            </ListItemButton>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Collapse>
                </React.Fragment>
              );
            }

            return (
              <ListItem key={link.label} disablePadding>
                <ListItemButton
                  onClick={() => handleNavClick(link)}
                  sx={{
                    px: 3,
                    py: 1.4,
                    backgroundColor: active ? colors.lightBlueBg : 'transparent',
                    '&:hover': { backgroundColor: colors.lightBlueBg },
                  }}
                >
                  <ListItemText
                    primary={link.label}
                    primaryTypographyProps={{
                      fontFamily: fonts.body,
                      color: active ? colors.primaryBlue : colors.darkText,
                      fontWeight: active ? 700 : 600,
                      fontSize: '0.95rem',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Divider sx={{ borderColor: colors.border }} />
        <Box sx={{ px: 3, py: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button
            fullWidth
            onClick={() => { navigate('/scheduler'); setDrawerOpen(false); }}
            startIcon={<EventAvailableIcon />}
            sx={{ ...primaryButtonSx, py: 1.25 }}
          >
            Schedule Service
          </Button>
          <Box
            component="a"
            href="tel:+18885550199"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', mt: 0.5, textDecoration: 'none' }}
          >
            <Phone sx={{ color: colors.primaryBlue, fontSize: '1rem' }} />
            <Box component="span" sx={{ color: colors.navy, fontFamily: fonts.body, fontSize: '0.9rem', fontWeight: 700 }}>
              (888) 555-0199
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default TopBar;
