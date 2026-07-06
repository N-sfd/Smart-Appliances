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
    title: 'Popular Repairs',
    links: [
      { label: 'Refrigerator Service', path: '/services/refrigerator-service' },
      { label: 'Washer & Dryer Service', path: '/services/washer-dryer-service' },
      { label: 'Dishwasher Service', path: '/services/dishwasher-service' },
      { label: 'Oven & Stove Service', path: '/services/oven-stove-service' },
      { label: 'Microwave Service', path: '/services/microwave-service' },
      { label: 'AC Service', path: '/services/ac-service' },
      { label: 'Heating & Furnace Service', path: '/services/heating-furnace-service' },
      { label: 'Garbage Disposal Service', path: '/services/garbage-disposal-service' },
      { label: 'Drain Cleaning', path: '/services/drain-cleaning' },
      { label: 'Light Fixture Installation', path: '/services/light-fixture-installation' },
      { label: 'Video Doorbell Installation', path: '/services/video-doorbell-installation' },
      { label: 'Garage Door Service', path: '/services/garage-door-repair' },
      { label: 'Water Heater Service', path: '/services/water-heater-service' },
      { label: 'Leak Repair', path: '/services/leak-repair' },
      { label: 'Breaker & Panel Service', path: '/services/breaker-panel-inspection' },
      { label: 'Smart Thermostat Installation', path: '/services/smart-thermostat-setup' },
    ],
  },
  {
    title: 'Help Center',
    links: [
      { label: 'Help Center', path: '/resources' },
      { label: 'Articles', path: '/resources/articles' },
      { label: 'Videos', path: '/resources/videos' },
      { label: 'Why Is My Refrigerator Not Cooling?', path: '/resources/refrigerator-not-cooling' },
      { label: 'Why Is My Washing Machine Making Noise?', path: '/resources/washer-making-noise' },
      { label: 'Why Is My Dryer Taking Too Long to Dry Clothes?', path: '/resources/dryer-taking-too-long' },
      { label: 'Why Is My Dishwasher Not Draining?', path: '/resources/dishwasher-not-draining' },
      { label: 'What Causes Freezer Frost Buildup?', path: '/resources/freezer-frost-buildup' },
      { label: 'Should You Repair or Replace Your Appliance?', path: '/resources/appliance-repair-or-replace' },
      { label: 'Electrical Safety: DIY or Pro?', path: '/resources/electrical-safety-diy-or-pro' },
      { label: 'Simple Ways to Lower Your Heating Bill', path: '/resources/lower-heating-bill' },
      { label: 'How Often Should You Replace Your HVAC Filter?', path: '/resources/hvac-filter-guide' },
      { label: 'Simple Ways to Prevent Common Plumbing Leaks', path: '/resources/prevent-plumbing-leaks' },
      { label: 'Is a Smart Thermostat Worth It?', path: '/resources/smart-thermostat-benefits' },
      { label: 'Essential Garage Door Maintenance Tips', path: '/resources/garage-door-maintenance' },
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
