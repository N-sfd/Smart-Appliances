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
  Avatar,
  Tooltip,
  Typography,
} from '@mui/material';
import { Phone, Menu as MenuIcon, Close as CloseIcon, KeyboardArrowDown, KeyboardArrowUp, Logout as LogoutIcon, ArrowForward as ArrowForwardIcon, CheckCircleOutline as CheckCircleOutlineIcon } from '@mui/icons-material';
import { colors, fonts, primaryButtonSx } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import { BrandLogo } from './Logo';
import ServiceMenuIllustration from './illustrations/ServiceMenuIllustration';
import {
  serviceNavItems,
  serviceNavPath,
  isServiceNavItemActive,
  ServiceNavItem,
} from '../data/serviceNavItems';

interface NavLink {
  key: string;
  label: string;
  path: string;
  hash?: string;
  cat?: string;
}

// `key` is the stable identifier used for active-state/dropdown logic — `label` is
// display-only copy, so relabeling the nav never risks breaking route matching.
const navLinks: NavLink[] = [
  { key: 'services', label: 'Our Services', path: '/services' },
  { key: 'experts', label: 'Service Professionals', path: '/experts' },
  { key: 'membership', label: 'Smart Care', path: '/membership' },
  { key: 'areas', label: 'Service Areas', path: '/', hash: 'service-areas' },
  { key: 'pricing', label: 'Pricing', path: '/pricing' },
  { key: 'resources', label: 'Resources', path: '/resources' },
  { key: 'about', label: 'About Us', path: '/about' },
  { key: 'contact', label: 'Contact Us', path: '/contact' },
];

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'signup'>('login');
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
    if (link.key === 'services') return isServicesSection;
    if (link.hash) return false;
    if (link.path === '/') return location.pathname === '/';
    if (!location.pathname.startsWith(link.path)) return false;
    if (link.cat) return new URLSearchParams(location.search).get('cat') === link.cat;
    return true;
  };

  const scrollToSection = (id: string) => {
    const snap = (behavior: ScrollBehavior) => document.getElementById(id)?.scrollIntoView({ behavior });
    const run = () => {
      snap('smooth');
      // Sections above use content-visibility:auto with a fixed placeholder height, so they
      // can resize once the browser reveals them mid-scroll, leaving the smooth-scroll target
      // misaligned. Re-snap once the reveal + scroll animation has settled.
      setTimeout(() => snap('auto'), 650);
    };
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(run, 400);
    } else {
      run();
    }
  };

  const handleNavClick = (link: NavLink) => {
    if (link.key === 'services') {
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
    fontSize: '0.7rem',
    '@media (min-width:1280px)': { fontSize: '0.78rem' },
    '@media (min-width:1536px)': { fontSize: '0.88rem' },
    textTransform: 'none' as const,
    px: 1,
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
            alignItems: 'center',
            minHeight: { xs: '84px !important', md: '100px !important' },
            py: { xs: 0.75, md: 0.35 },
            pl: { xs: 1.5, sm: 2, md: 2.5, lg: 3 },
            pr: { xs: 2, lg: 3 },
            gap: 0.5,
            overflow: 'hidden',
            '@media (min-width:1024px)': { overflow: 'visible' },
          }}
        >
          <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', mr: { xs: 1.5, md: 1.75, lg: 2 } }}>
            <BrandLogo variant="header" onClick={() => { navigate('/'); setDrawerOpen(false); }} />
          </Box>

          {/* Desktop: nav area (pill + links) then CTAs — pill centers over menu only */}
          <Box
            sx={{
              display: 'none',
              '@media (min-width:1024px)': { display: 'flex' },
              alignItems: 'center',
              flexGrow: 1,
              minWidth: 0,
              ml: 0.25,
              gap: 1,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'center',
                flexGrow: 1,
                minWidth: 0,
                gap: 0.15,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  display: 'none',
                  '@media (min-width:1150px)': {
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                  },
                }}
              >
                <Box
                  component="aside"
                  aria-label="Service highlights"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '24px',
                    height: 28,
                    py: 0.75,
                    px: '40px',
                    maxWidth: '100%',
                    borderRadius: '999px',
                    backgroundColor: colors.lightBlueBg,
                    border: '1px solid #D0E3FF',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                  }}
                >
                  {['Clear scheduling', 'Request tracking', 'Service updates'].map((label) => (
                    <Box
                      key={label}
                      component="span"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        flexShrink: 0,
                      }}
                    >
                      <CheckCircleOutlineIcon
                        sx={{ fontSize: '0.9rem', color: colors.primaryBlue, flexShrink: 0 }}
                        aria-hidden
                      />
                      <Typography
                        component="span"
                        sx={{
                          fontFamily: fonts.body,
                          fontWeight: 600,
                          fontSize: '0.78rem',
                          lineHeight: 1,
                          color: colors.primaryBlue,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  '@media (min-width:1280px)': { gap: 1.5 },
                  '@media (min-width:1536px)': { gap: 2.5 },
                  alignItems: 'center',
                  minWidth: 0,
                  flexWrap: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                {navLinks.map((link) => {
                  const active = isActive(link);

                  if (link.key === 'services') {
                    return (
                      <Box
                        key={link.key}
                        ref={servicesMenuRef}
                        sx={{ position: 'relative', flexShrink: 0 }}
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
                              <Box className="services-nav-dropdown-grid" role="none">
                                {serviceNavItems.map((item) => {
                                  const itemActive = isServiceNavItemActive(
                                    item,
                                    location.pathname,
                                    location.search,
                                  );
                                  const isEmergency = item.id === 'emergency-service';
                                  return (
                                    <button
                                      key={item.id}
                                      type="button"
                                      role="menuitem"
                                      className={[
                                        'services-nav-dropdown-card',
                                        itemActive ? 'is-active' : '',
                                        isEmergency ? 'is-emergency' : '',
                                      ].filter(Boolean).join(' ')}
                                      onClick={() => goToService(item)}
                                    >
                                      <span className="services-nav-dropdown-card-thumb">
                                        <ServiceMenuIllustration variant={item.illustration} title={item.label} />
                                      </span>
                                      <span className="services-nav-dropdown-card-text">
                                        <span className="services-nav-dropdown-card-title">{item.label}</span>
                                        <span className="services-nav-dropdown-card-desc">{item.description}</span>
                                      </span>
                                    </button>
                                  );
                                })}
                              </Box>
                              <button
                                type="button"
                                className="services-nav-dropdown-viewall"
                                onClick={() => { navigate('/services'); setServicesMenuOpen(false); }}
                              >
                                View All Services
                                <ArrowForwardIcon sx={{ fontSize: '1rem !important' }} />
                              </button>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    );
                  }

                  return (
                    <Button
                      key={link.key}
                      onClick={() => handleNavClick(link)}
                      disableRipple
                      sx={navButtonSx(active)}
                    >
                      {link.label}
                    </Button>
                  );
                })}
              </Box>
            </Box>

              {/* Phone / auth aligned on the nav row */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  flexShrink: 0,
                  pl: 1,
                }}
              >
                <Button
                  component="a"
                  href="tel:+12405760397"
                  startIcon={<Phone sx={{ fontSize: '1rem !important' }} />}
                  sx={{
                    display: 'none',
                    '@media (min-width:1280px)': { display: 'inline-flex' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 40,
                    minHeight: 40,
                    color: colors.navy,
                    fontFamily: fonts.body,
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    lineHeight: 1,
                    textTransform: 'none',
                    backgroundColor: '#EEF4FF',
                    border: '2px solid #C5DCFA',
                    borderRadius: '50px',
                    px: 1.5,
                    py: 0,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.3s ease-in-out',
                    '& .MuiButton-startIcon': {
                      marginRight: '6px',
                      marginLeft: 0,
                      display: 'inherit',
                    },
                    '&:hover': {
                      backgroundColor: colors.lightBlueBg,
                      borderColor: colors.primaryBlue,
                      color: colors.primaryBlue,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 18px rgba(26, 115, 232, 0.18)',
                    },
                  }}
                >
                  +1 (240) 576-0397
                </Button>

                <IconButton
                  component="a"
                  href="tel:+12405760397"
                  aria-label="Call +1 (240) 576-0397"
                  sx={{
                    display: 'inline-flex',
                    '@media (min-width:1280px)': { display: 'none' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    color: colors.navy,
                    backgroundColor: '#EEF4FF',
                    border: '2px solid #C5DCFA',
                    borderRadius: '50px',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      backgroundColor: colors.lightBlueBg,
                      borderColor: colors.primaryBlue,
                      color: colors.primaryBlue,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Phone sx={{ fontSize: '1.15rem' }} />
                </IconButton>

                {!user ? (
                  <>
                    <Button
                      onClick={() => { setAuthModalView('login'); setAuthModalOpen(true); }}
                      sx={{
                        height: 40,
                        color: colors.navy,
                        fontFamily: fonts.body,
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        textTransform: 'none',
                        border: `1.5px solid ${colors.border}`,
                        borderRadius: '50px',
                        px: 1.5,
                        whiteSpace: 'nowrap',
                        '&:hover': {
                          borderColor: colors.primaryBlue,
                          color: colors.primaryBlue,
                          backgroundColor: colors.lightBlueBg,
                        },
                      }}
                    >
                      Log in
                    </Button>
                    <Button
                      onClick={() => { setAuthModalView('signup'); setAuthModalOpen(true); }}
                      sx={{
                        height: 40,
                        backgroundColor: colors.primaryBlue,
                        color: '#fff',
                        fontFamily: fonts.body,
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        textTransform: 'none',
                        borderRadius: '50px',
                        px: 1.75,
                        whiteSpace: 'nowrap',
                        '&:hover': { backgroundColor: colors.navy },
                      }}
                    >
                      Sign up
                    </Button>
                  </>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title={profile?.full_name ?? user.email ?? 'Account'}>
                      <Avatar
                        onClick={() => navigate('/my-bookings')}
                        sx={{
                          width: 36,
                          height: 36,
                          backgroundColor: colors.primaryBlue,
                          fontFamily: fonts.body,
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: colors.navy },
                        }}
                      >
                        {(profile?.full_name ?? user.email ?? '?').charAt(0).toUpperCase()}
                      </Avatar>
                    </Tooltip>
                    <Tooltip title="Sign out">
                      <IconButton
                        onClick={() => signOut()}
                        size="small"
                        sx={{ color: colors.mutedText, '&:hover': { color: '#EF4444' } }}
                      >
                        <LogoutIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Box>
          </Box>

          {/* Mobile / tablet actions only — desktop CTAs live in the nav row above */}
          <Box
            sx={{
              display: 'flex',
              '@media (min-width:1024px)': { display: 'none' },
              alignItems: 'center',
              gap: { xs: 0.75, sm: 1 },
              flexShrink: 0,
            }}
          >
            <Button
              component="a"
              href="tel:+12405760397"
              startIcon={<Phone sx={{ fontSize: '1rem !important' }} />}
              sx={{
                display: 'none',
                '@media (min-width:600px)': { display: 'inline-flex' },
                alignItems: 'center',
                justifyContent: 'center',
                height: 44,
                minHeight: 44,
                color: colors.navy,
                fontFamily: fonts.body,
                fontWeight: 700,
                fontSize: '0.82rem',
                lineHeight: 1,
                textTransform: 'none',
                backgroundColor: '#EEF4FF',
                border: '2px solid #C5DCFA',
                borderRadius: '50px',
                px: 2,
                py: 0,
                whiteSpace: 'nowrap',
                transition: 'all 0.3s ease-in-out',
                '& .MuiButton-startIcon': {
                  marginRight: '6px',
                  marginLeft: 0,
                  display: 'inherit',
                },
                '&:hover': {
                  backgroundColor: colors.lightBlueBg,
                  borderColor: colors.primaryBlue,
                  color: colors.primaryBlue,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 18px rgba(26, 115, 232, 0.18)',
                },
              }}
            >
              +1 (240) 576-0397
            </Button>

            <IconButton
              component="a"
              href="tel:+12405760397"
              aria-label="Call +1 (240) 576-0397"
              sx={{
                display: 'inline-flex',
                '@media (min-width:600px)': { display: 'none' },
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                color: colors.navy,
                backgroundColor: '#EEF4FF',
                border: '2px solid #C5DCFA',
                borderRadius: '50px',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: colors.lightBlueBg,
                  borderColor: colors.primaryBlue,
                  color: colors.primaryBlue,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Phone sx={{ fontSize: '1.15rem' }} />
            </IconButton>

            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                color: colors.navy,
                border: `2px solid ${colors.border}`,
                borderRadius: '50px',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: colors.lightBlueBg,
                  borderColor: colors.primaryBlue,
                  transform: 'translateY(-2px)',
                },
              }}
              aria-label="Open navigation menu"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>

        {/* Mobile-only compact line — not shown above the logo on desktop */}
        <Box
          component="aside"
          aria-label="Service availability"
          sx={{
            display: 'flex',
            '@media (min-width:1024px)': { display: 'none' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.75,
            height: 28,
            px: 1.5,
            backgroundColor: colors.lightBlueBg,
            borderTop: `1px solid ${colors.border}`,
            overflow: 'hidden',
          }}
        >
          <Typography
            component="p"
            sx={{
              m: 0,
              fontFamily: fonts.body,
              fontWeight: 600,
              fontSize: '0.72rem',
              lineHeight: 1,
              color: colors.primaryBlue,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: 'center',
              maxWidth: '100%',
            }}
          >
            Check ZIP availability · Call +1 (240) 576-0397
          </Typography>
        </Box>
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

            if (link.key === 'services') {
              return (
                <React.Fragment key={link.key}>
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
                                gap: 1.5,
                                borderBottom: isLast ? 'none' : '1px solid #E4E7EB',
                                backgroundColor: itemActive ? colors.lightBlueBg : 'transparent',
                                '&:hover': {
                                  backgroundColor: colors.lightBlueBg,
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  width: 34,
                                  height: 34,
                                  borderRadius: '10px',
                                  overflow: 'hidden',
                                  flexShrink: 0,
                                }}
                              >
                                <ServiceMenuIllustration variant={item.illustration} title={item.label} />
                              </Box>
                              <ListItemText
                                primary={item.label}
                                secondary={item.description}
                                primaryTypographyProps={{
                                  fontFamily: fonts.body,
                                  color: itemActive ? colors.primaryBlue : colors.darkText,
                                  fontWeight: 600,
                                  fontSize: '0.95rem',
                                }}
                                secondaryTypographyProps={{
                                  fontFamily: fonts.body,
                                  color: colors.mutedText,
                                  fontSize: '0.76rem',
                                  lineHeight: 1.3,
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
              <ListItem key={link.key} disablePadding>
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
          {!user ? (
            <>
              <Button
                fullWidth
                onClick={() => { setAuthModalView('signup'); setDrawerOpen(false); setAuthModalOpen(true); }}
                sx={{ ...primaryButtonSx, py: 1.25 }}
              >
                Sign up
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => { setAuthModalView('login'); setDrawerOpen(false); setAuthModalOpen(true); }}
                sx={{ borderRadius: '12px', fontFamily: fonts.body, fontWeight: 700, textTransform: 'none', borderColor: colors.border, color: colors.navy, py: 1.25, '&:hover': { borderColor: colors.primaryBlue, color: colors.primaryBlue, backgroundColor: colors.lightBlueBg } }}
              >
                Log in
              </Button>
            </>
          ) : (
            <>
              <Button
                fullWidth
                onClick={() => { navigate('/my-bookings'); setDrawerOpen(false); }}
                sx={{ ...primaryButtonSx, py: 1.25 }}
              >
                My Bookings
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => { signOut(); setDrawerOpen(false); }}
                startIcon={<LogoutIcon />}
                sx={{ borderRadius: '12px', fontFamily: fonts.body, fontWeight: 700, textTransform: 'none', borderColor: colors.border, color: colors.navy, py: 1.25, '&:hover': { borderColor: '#EF4444', color: '#EF4444' } }}
              >
                Sign out
              </Button>
            </>
          )}
          <Box
            component="a"
            href="tel:+12405760397"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', mt: 0.5, textDecoration: 'none' }}
          >
            <Phone sx={{ color: colors.primaryBlue, fontSize: '1rem' }} />
            <Box component="span" sx={{ color: colors.navy, fontFamily: fonts.body, fontSize: '0.9rem', fontWeight: 700 }}>
              +1 (240) 576-0397
            </Box>
          </Box>
        </Box>
      </Drawer>

      <AuthModal
        open={authModalOpen}
        initialView={authModalView}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};

export default TopBar;
