import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, Link as MuiLink } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { fonts } from '../theme';

const FOOTER_HEADING = {
  fontFamily: fonts.heading,
  color: '#0B3D91',
  fontWeight: 700,
  fontSize: '0.95rem',
  letterSpacing: '-0.01em',
  lineHeight: 1.3,
  m: 0,
};

const footerHeaderSlot = {
  minHeight: { xs: 48, md: 56 },
  display: 'flex',
  alignItems: 'flex-start',
  mb: 2,
};

const footerBodyText = {
  fontFamily: fonts.body,
  color: '#64748B',
  fontSize: '0.875rem',
  lineHeight: 1.7,
};

const footerLinkSx = {
  fontFamily: fonts.body,
  color: '#64748B',
  fontSize: '0.875rem',
  lineHeight: 1.6,
  mb: 1.1,
  cursor: 'pointer',
  display: 'block',
  textDecoration: 'none',
  transition: 'color 0.2s',
  '&:hover': { color: '#1A73E8' },
};

const SERVICE_LINKS = [
  { label: 'Home Appliances', path: '/services/home-appliances' },
  { label: 'HVAC Services', path: '/services/hvac' },
  { label: 'Plumbing Services', path: '/services/plumbing' },
  { label: 'Electrical Services', path: '/services/electrical' },
  { label: 'Smart Home Setup', path: '/services/smart-home' },
  { label: 'Emergency Service', path: '/emergency-service' },
] as const;

const COMPANY_LINKS = [
  { label: 'Pricing', path: '/pricing' },
  { label: 'About Us', path: '/about' },
  { label: 'Service Areas', hash: 'service-areas' },
  { label: 'Why Choose Us', hash: 'why-choose-us' },
  { label: 'Contact', hash: 'contact' },
  { label: 'FAQs', hash: 'faqs' },
  { label: 'Track Request', path: '/track-request' },
] as const;

const PROMISE_ITEMS = [
  'Licensed & Insured',
  'Same-Day Availability',
  'Certified Technicians',
  'Transparent Pricing',
  'Estimate After Diagnosis',
  'Service Warranty',
] as const;

const LEGAL_LINKS = [
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms of Service', path: '/terms' },
  { label: 'Accessibility', path: '/accessibility' },
] as const;

const SiteFooter: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goToPath = (path: string) => navigate(path);

  const goToHash = (hash: string) => {
    if (location.pathname === '/') {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    navigate(`/#${hash}`);
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#F5F7FA',
        borderTop: '1px solid #E4E7EB',
        color: '#64748B',
      }}
    >
      <Box
        sx={{
          maxWidth: '1180px',
          mx: 'auto',
          px: '24px',
          pt: '56px',
          pb: '28px',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'minmax(280px, 320px) repeat(3, minmax(0, 1fr))',
            },
            columnGap: { xs: 0, sm: 5, lg: 7 },
            rowGap: { xs: 4, sm: 5 },
            alignItems: 'start',
            '& > :first-of-type': {
              gridColumn: { xs: '1', sm: '1 / -1', lg: 'auto' },
            },
          }}
        >
          {/* Column 1 — Brand */}
          <Box sx={{ maxWidth: { lg: 320 } }}>
            <Box sx={footerHeaderSlot}>
              <Typography component="h3" sx={FOOTER_HEADING}>
                Smart Appliances
              </Typography>
            </Box>
            <Typography sx={{ ...footerBodyText, mb: 2.5 }}>
              Fast, trusted appliance repair, installation, and urgent service by certified technicians.
            </Typography>
            <Button
              component="a"
              href="tel:+18885550199"
              variant="contained"
              startIcon={<PhoneIcon sx={{ fontSize: 18 }} />}
              sx={{
                fontFamily: fonts.body,
                fontWeight: 700,
                fontSize: '0.875rem',
                textTransform: 'none',
                borderRadius: '10px',
                backgroundColor: '#1A73E8',
                color: '#FFFFFF',
                px: 2.5,
                py: 1.1,
                mb: 1.5,
                boxShadow: '0 4px 14px rgba(26, 115, 232, 0.28)',
                '&:hover': { backgroundColor: '#0B3D91' },
              }}
            >
              Call (888) 555-0199
            </Button>
            <Typography sx={{ ...footerBodyText, fontSize: '0.8rem', mb: 1.5 }}>
              24/7 emergency service available
            </Typography>
            <MuiLink
              href="mailto:service@smartappliance.com"
              sx={{
                fontFamily: fonts.body,
                color: '#64748B',
                fontSize: '0.875rem',
                textDecoration: 'none',
                '&:hover': { color: '#1A73E8' },
              }}
            >
              service@smartappliance.com
            </MuiLink>
          </Box>

          {/* Column 2 — Services */}
          <Box>
            <Box sx={footerHeaderSlot}>
              <Typography component="h3" sx={FOOTER_HEADING}>
                Services
              </Typography>
            </Box>
            {SERVICE_LINKS.map((link) => (
              <Box
                key={link.label}
                component="button"
                type="button"
                onClick={() => goToPath(link.path)}
                sx={{
                  ...footerLinkSx,
                  border: 'none',
                  background: 'none',
                  padding: 0,
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                {link.label}
              </Box>
            ))}
          </Box>

          {/* Column 3 — Company */}
          <Box>
            <Box sx={footerHeaderSlot}>
              <Typography component="h3" sx={FOOTER_HEADING}>
                Company
              </Typography>
            </Box>
            {COMPANY_LINKS.map((link) => (
              <Box
                key={link.label}
                component="button"
                type="button"
                onClick={() => ('path' in link ? goToPath(link.path) : goToHash(link.hash))}
                sx={{
                  ...footerLinkSx,
                  border: 'none',
                  background: 'none',
                  padding: 0,
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                {link.label}
              </Box>
            ))}
          </Box>

          {/* Column 4 — Our Promise */}
          <Box>
            <Box sx={footerHeaderSlot}>
              <Typography component="h3" sx={FOOTER_HEADING}>
                Our Promise
              </Typography>
            </Box>
            {PROMISE_ITEMS.map((item) => (
              <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.2 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 16, color: '#1A73E8', mt: 0.25, flexShrink: 0 }} />
                <Typography sx={{ ...footerBodyText, fontSize: '0.85rem', color: '#64748B' }}>
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Bottom bar */}
        <Box
          sx={{
            borderTop: '1px solid #E4E7EB',
            mt: '36px',
            pt: '20px',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Typography sx={{ fontFamily: fonts.body, color: '#64748B', fontSize: '14px', flex: { md: '1 1 auto' } }}>
            © {new Date().getFullYear()} Smart Appliances. All rights reserved.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 1.5, md: 2.5 },
              justifyContent: { xs: 'center', md: 'flex-end' },
              flex: { md: '0 0 auto' },
            }}
          >
            {LEGAL_LINKS.map((link) => (
              <Box
                key={link.label}
                component="button"
                type="button"
                onClick={() => goToPath(link.path)}
                sx={{
                  fontFamily: fonts.body,
                  color: '#64748B',
                  fontSize: '14px',
                  border: 'none',
                  background: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  '&:hover': { color: '#1A73E8' },
                }}
              >
                {link.label}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SiteFooter;
