import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Container } from '@mui/material';
import { colors, fonts } from '../theme';

const SITEMAP_SECTIONS = [
  {
    title: 'Main',
    links: [
      { label: 'Home', path: '/' },
      { label: 'Services', path: '/services' },
      { label: 'Pricing', path: '/pricing' },
      { label: 'About Us', path: '/about' },
      { label: 'Contact', path: '/contact' },
      { label: 'Book Service', path: '/scheduler' },
      { label: 'Membership', path: '/membership' },
      { label: 'Track Request', path: '/track-request' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Home Appliances', path: '/services/home-appliances' },
      { label: 'HVAC', path: '/services/hvac' },
      { label: 'Plumbing', path: '/services/plumbing' },
      { label: 'Electrical', path: '/services/electrical' },
      { label: 'Smart Home', path: '/services/smart-home' },
      { label: 'Garage Door', path: '/services/garage-door' },
      { label: 'Emergency Service', path: '/scheduler?serviceType=E' },
    ],
  },
  {
    title: 'Account & Legal',
    links: [
      { label: 'My Bookings', path: '/my-bookings' },
      { label: 'Membership', path: '/membership' },
      { label: 'Login', path: '/login' },
      { label: 'Privacy Policy', path: '/privacy-policy' },
      { label: 'Terms of Service', path: '/terms-of-service' },
      { label: 'Accessibility', path: '/accessibility' },
    ],
  },
] as const;

const linkSx = {
  fontFamily: fonts.body,
  color: colors.primaryBlue,
  fontSize: '0.9rem',
  textDecoration: 'none',
  display: 'block',
  mb: 1,
  '&:hover': { color: colors.navy, textDecoration: 'underline' },
};

const SitemapPage: React.FC = () => (
  <Box sx={{ minHeight: '50vh', backgroundColor: colors.surface, py: { xs: 5, md: 8 } }}>
    <Container maxWidth="md">
      <Typography
        sx={{
          fontFamily: fonts.heading,
          fontWeight: 800,
          fontSize: { xs: '1.75rem', md: '2rem' },
          color: colors.navy,
          mb: 1,
        }}
      >
        Sitemap
      </Typography>
      <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, mb: 4, lineHeight: 1.7 }}>
        Browse all main pages on the Smart Appliances website.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 4,
        }}
      >
        {SITEMAP_SECTIONS.map((section) => (
          <Box key={section.title}>
            <Typography
              sx={{
                fontFamily: fonts.heading,
                fontWeight: 700,
                fontSize: '1rem',
                color: colors.navy,
                mb: 1.5,
              }}
            >
              {section.title}
            </Typography>
            {section.links.map((link) => (
              <Box key={link.path} component={RouterLink} to={link.path} sx={linkSx}>
                {link.label}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Container>
  </Box>
);

export default SitemapPage;
