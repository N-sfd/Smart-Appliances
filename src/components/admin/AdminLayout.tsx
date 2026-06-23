import React, { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import { useAuth } from '../../contexts/AuthContext';
import { colors, fonts } from '../../theme';

interface SidebarItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: <DashboardOutlinedIcon sx={{ fontSize: 20 }} /> },
  { label: 'Bookings', to: '/admin/bookings', icon: <ListAltOutlinedIcon sx={{ fontSize: 20 }} /> },
  { label: 'Customers', to: '/admin/customers', icon: <PeopleOutlineIcon sx={{ fontSize: 20 }} /> },
  { label: 'Experts', to: '/admin/experts', icon: <BadgeOutlinedIcon sx={{ fontSize: 20 }} /> },
  { label: 'Services', to: '/admin/services', icon: <BuildOutlinedIcon sx={{ fontSize: 20 }} /> },
  { label: 'Membership Leads', to: '/admin/membership', icon: <CardMembershipOutlinedIcon sx={{ fontSize: 20 }} /> },
  { label: 'Reports', to: '/admin/reports', icon: <AssessmentOutlinedIcon sx={{ fontSize: 20 }} /> },
  { label: 'Settings', to: '/admin/settings', icon: <SettingsOutlinedIcon sx={{ fontSize: 20 }} /> },
];

const SIDEBAR_WIDTH = 240;

const SidebarContent: React.FC<{ activePath: string; onNavigate?: () => void }> = ({ activePath, onNavigate }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0B3D91' }}>
    <Box sx={{ px: 2.5, pt: 3, pb: 2 }}>
      <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem', fontFamily: fonts.heading, letterSpacing: '-0.02em' }}>
        Smart Appliances
      </Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.72rem', fontFamily: fonts.body, mt: 0.25 }}>
        Admin Portal
      </Typography>
    </Box>

    <Box sx={{ flex: 1, overflowY: 'auto', px: 1.5, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
      {SIDEBAR_ITEMS.map(({ label, to, icon }) => {
        const active = activePath.startsWith(to);
        return (
          <Box
            key={to}
            component={RouterLink}
            to={to}
            onClick={onNavigate}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              px: 1.5,
              py: 1.1,
              borderRadius: '10px',
              color: active ? '#fff' : 'rgba(255,255,255,0.72)',
              backgroundColor: active ? 'rgba(255,255,255,0.14)' : 'transparent',
              fontFamily: fonts.body,
              fontWeight: active ? 700 : 500,
              fontSize: '0.88rem',
              textDecoration: 'none',
              transition: 'background-color 0.15s ease',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' },
            }}
          >
            {icon}
            {label}
          </Box>
        );
      })}
    </Box>

    <Box sx={{ px: 1.5, py: 2 }}>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mb: 1.5 }} />
      <Box
        component={RouterLink}
        to="/"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          px: 1.5,
          py: 1,
          borderRadius: '10px',
          color: 'rgba(255,255,255,0.65)',
          fontFamily: fonts.body,
          fontSize: '0.85rem',
          textDecoration: 'none',
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' },
        }}
      >
        <LanguageOutlinedIcon sx={{ fontSize: 18 }} />
        Back to Site
      </Box>
    </Box>
  </Box>
);

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const activeItem = SIDEBAR_ITEMS.find((i) => location.pathname.startsWith(i.to));
  const initials = (profile?.full_name || profile?.email || 'A').trim().charAt(0).toUpperCase();

  const handleLogout = async () => {
    setMenuAnchor(null);
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* Desktop sidebar */}
      <Box sx={{ width: SIDEBAR_WIDTH, flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: SIDEBAR_WIDTH, height: '100vh' }}>
          <SidebarContent activePath={location.pathname} />
        </Box>
      </Box>

      {/* Mobile drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH } }}
      >
        <SidebarContent activePath={location.pathname} onNavigate={() => setDrawerOpen(false)} />
      </Drawer>

      {/* Main column */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Top header */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: '#fff',
            borderBottom: `1px solid ${colors.border}`,
            px: { xs: 2, md: 3 },
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { xs: 'inline-flex', md: 'none' } }}
              aria-label="Open admin menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '1rem', color: colors.navy }}>
              {activeItem?.label ?? 'Admin'}
            </Typography>
          </Box>

          <Box
            onClick={(e) => setMenuAnchor(e.currentTarget)}
            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', borderRadius: '10px', px: 1, py: 0.5, '&:hover': { backgroundColor: '#F8FAFC' } }}
          >
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '0.82rem', color: colors.darkText, lineHeight: 1.2 }}>
                {profile?.full_name || 'Admin'}
              </Typography>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.72rem', color: colors.mutedText }}>
                {profile?.email}
              </Typography>
            </Box>
            <Avatar sx={{ width: 34, height: 34, backgroundColor: colors.primaryBlue, fontSize: '0.85rem', fontWeight: 700 }}>
              {initials}
            </Avatar>
          </Box>

          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
            <MenuItem onClick={() => void handleLogout()} sx={{ fontFamily: fonts.body, fontSize: '0.85rem', gap: 1 }}>
              <LogoutIcon sx={{ fontSize: 18 }} /> Logout
            </MenuItem>
          </Menu>
        </Box>

        <Box sx={{ flex: 1 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
export { SIDEBAR_ITEMS };
