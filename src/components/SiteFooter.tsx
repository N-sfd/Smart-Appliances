import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Typography, TextField, Button, IconButton, Tooltip } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { colors, fonts } from '../theme';

interface FooterLink {
  label: string;
  path: string;
}

interface SocialLink {
  label: string;
  href: string;
  icon: React.ReactNode | null;
}

const companyLinks: FooterLink[] = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Membership', path: '/membership' },
  { label: 'Experts', path: '/experts' },
  { label: 'Areas', path: '/areas' },
  { label: 'Contact', path: '/contact' },
];

const serviceLinks: FooterLink[] = [
  { label: 'Appliance Repair', path: '/services/home-appliances' },
  { label: 'HVAC Services', path: '/services/hvac' },
  { label: 'Plumbing Services', path: '/services/plumbing' },
  { label: 'Electrical Services', path: '/services/electrical' },
  { label: 'Smart Home Services', path: '/services/smart-home' },
  { label: 'Garage Door Services', path: '/services/garage-door' },
  { label: 'Emergency Service', path: '/scheduler?serviceType=E' },
];

const popularServiceLinks: FooterLink[] = [
  { label: 'Refrigerator Repair', path: '/scheduler?serviceType=R&serviceCategory=Appliance&productName=Refrigerator+Repair' },
  { label: 'Washer / Dryer Repair', path: '/scheduler?serviceType=R&serviceCategory=Appliance&productName=Washer+Dryer+Repair' },
  { label: 'Oven / Stove Repair', path: '/scheduler?serviceType=R&serviceCategory=Appliance&productName=Oven+Stove+Repair' },
  { label: 'AC Repair', path: '/scheduler?serviceType=R&serviceCategory=HVAC&productName=AC+Repair' },
  { label: 'Drain Cleaning', path: '/scheduler?serviceType=R&serviceCategory=Plumbing&productName=Drain+Cleaning' },
  { label: 'Light Fixture Installation', path: '/scheduler?serviceType=I&serviceCategory=Electrical&productName=Light+Fixture+Installation' },
  { label: 'Video Doorbell Installation', path: '/scheduler?serviceType=I&serviceCategory=Smart%20Home&productName=Video+Doorbell+Installation' },
];

const legalLinks: FooterLink[] = [
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms of Service', path: '/terms-of-service' },
  { label: 'Membership Terms', path: '/membership-terms' },
  { label: 'Warranty FAQ', path: '/warranty-faq' },
  { label: 'Service Guarantee', path: '/service-guarantee' },
  { label: 'Sitemap', path: '/sitemap' },
];

const bottomBarLinks: FooterLink[] = [
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms of Service', path: '/terms-of-service' },
  { label: 'Sitemap', path: '/sitemap' },
];

const socialLinks: SocialLink[] = [
  { label: 'Facebook', href: 'https://facebook.com/', icon: <FacebookIcon sx={{ fontSize: 19 }} /> },
  { label: 'X', href: 'https://x.com/', icon: null },
  { label: 'YouTube', href: 'https://youtube.com/', icon: <YouTubeIcon sx={{ fontSize: 19 }} /> },
  { label: 'Google Business', href: 'https://www.google.com/business/', icon: <StorefrontIcon sx={{ fontSize: 19 }} /> },
  { label: 'Instagram', href: 'https://instagram.com/', icon: <InstagramIcon sx={{ fontSize: 19 }} /> },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FOOTER_HEADING = {
  fontFamily: fonts.heading,
  color: colors.navy,
  fontWeight: 700,
  fontSize: '0.95rem',
  letterSpacing: '-0.01em',
  lineHeight: 1.3,
  m: 0,
  mb: 2,
} as const;

const footerLinkSx = {
  fontFamily: fonts.body,
  color: colors.mutedText,
  fontSize: '0.875rem',
  lineHeight: 1.6,
  textDecoration: 'none',
  display: 'block',
  mb: 1.1,
  transition: 'color 0.2s',
  '&:hover': { color: colors.primaryBlue },
  '&:last-of-type': { mb: 0 },
} as const;

const FooterColumn: React.FC<{ title: string; links: FooterLink[] }> = ({ title, links }) => (
  <Box>
    <Typography component="h3" sx={FOOTER_HEADING}>
      {title}
    </Typography>
    {links.map((link) => (
      <Box key={link.label} component={RouterLink} to={link.path} sx={footerLinkSx}>
        {link.label}
      </Box>
    ))}
  </Box>
);

const SiteFooter: React.FC = () => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setSubscribeStatus('error');
      return;
    }
    setSubscribeStatus('success');
    setEmail('');
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: colors.surface,
        borderTop: `1px solid ${colors.border}`,
        mt: 'auto',
      }}
    >
      <Box
        sx={{
          maxWidth: '1280px',
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          pt: { xs: 5, md: 7 },
          pb: { xs: 3, md: 4 },
        }}
      >
        {/* Multi-column footer: Company | Services | Popular Services | Legal | Stay Connected */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(3, minmax(0, 1fr))',
              lg: 'repeat(4, minmax(0, 1fr)) minmax(280px, 1.4fr)',
            },
            columnGap: { xs: 0, sm: 4, lg: 5 },
            rowGap: { xs: 4, sm: 5 },
            alignItems: 'start',
          }}
        >
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Services" links={serviceLinks} />
          <FooterColumn title="Popular Services" links={popularServiceLinks} />
          <FooterColumn title="Legal" links={legalLinks} />

          {/* Stay Connected */}
          <Box>
            <Typography component="h3" sx={FOOTER_HEADING}>
              Stay Connected
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubscribe}
              noValidate
              sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row', lg: 'row' }, gap: 1 }}
            >
              <TextField
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setSubscribeStatus('idle'); }}
                size="small"
                sx={{
                  flex: '1 1 180px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    fontFamily: fonts.body,
                    fontSize: '0.85rem',
                    backgroundColor: '#fff',
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: colors.primaryBlue,
                  color: '#fff',
                  fontFamily: fonts.body,
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: '10px',
                  px: 2.5,
                  whiteSpace: 'nowrap',
                  '&:hover': { backgroundColor: colors.navy },
                }}
              >
                Subscribe
              </Button>
            </Box>
            {subscribeStatus === 'success' && (
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: colors.success, mt: 1 }}>
                Thank you for subscribing.
              </Typography>
            )}
            {subscribeStatus === 'error' && (
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: '#DC2626', mt: 1 }}>
                Please enter a valid email address.
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 1.25, mt: 2.5 }}>
              {socialLinks.map((social) => (
                <Tooltip key={social.label} title={social.label}>
                  <IconButton
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    sx={{
                      width: 38,
                      height: 38,
                      backgroundColor: colors.primaryBlue,
                      color: '#fff',
                      transition: 'transform 0.2s ease, background-color 0.2s ease',
                      '&:hover': { backgroundColor: colors.navy, transform: 'translateY(-2px)' },
                    }}
                  >
                    {social.icon ?? (
                      <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '0.9rem' }}>
                        X
                      </Typography>
                    )}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 2.5 }}>
              <Box component="a" href="mailto:support@smartappliances.com" sx={{ ...footerLinkSx, mb: 0 }}>
                support@smartappliances.com
              </Box>
              <Box component="a" href="tel:3017830977" sx={{ ...footerLinkSx, mb: 0 }}>
                301-783-0977
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Bottom bar */}
        <Box
          sx={{
            borderTop: `1px solid ${colors.border}`,
            mt: { xs: 4, md: 5 },
            pt: 2.5,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '14px' }}>
            © {new Date().getFullYear()} Smart Appliances. All rights reserved.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 1.5, md: 2.5 },
              justifyContent: { xs: 'center', md: 'flex-end' },
            }}
          >
            {bottomBarLinks.map((link) => (
              <Box
                key={link.label}
                component={RouterLink}
                to={link.path}
                sx={{
                  fontFamily: fonts.body,
                  color: colors.mutedText,
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  '&:hover': { color: colors.primaryBlue },
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
