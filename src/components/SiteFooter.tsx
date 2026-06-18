import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Link as MuiLink, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { colors, fonts } from '../theme';

interface FooterLink {
  label: string;
  path: string;
  hash?: string;
}

const FOOTER_LINKS: FooterLink[] = [
  { label: 'Services', path: '/services' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Areas', path: '/', hash: 'service-areas' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
  { label: 'FAQs', path: '/', hash: 'faqs' },
];

const SiteFooter: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = (link: FooterLink) => {
    if (!link.hash) {
      navigate(link.path);
      return;
    }
    if (location.pathname === '/') {
      const el = document.getElementById(link.hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    navigate(`/#${link.hash}`);
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: colors.sectionBg,
        borderTop: '1px solid #E4E7EB',
      }}
    >
      <Box
        sx={{
          maxWidth: '1440px',
          mx: 'auto',
          px: { xs: '24px', md: '48px', lg: '80px' },
          py: '32px',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2.5,
        }}
      >
        {/* Brand + tagline */}
        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '0.95rem', color: colors.navy }}>
            Smart Appliances
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.8rem', color: colors.mutedText, mt: 0.25 }}>
            Fast, trusted appliance repair, installation, and urgent service.
          </Typography>
        </Box>

        {/* Nav links */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: { xs: 2, md: 3 },
          }}
        >
          {FOOTER_LINKS.map((link) => (
            <Box
              key={link.label}
              component="button"
              type="button"
              onClick={() => goTo(link)}
              sx={{
                fontFamily: fonts.body,
                color: colors.mutedText,
                fontSize: '0.85rem',
                fontWeight: 500,
                border: 'none',
                background: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'color 0.2s',
                '&:hover': { color: colors.primaryBlue },
              }}
            >
              {link.label}
            </Box>
          ))}
        </Box>

        {/* Social icons */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {[
            { href: 'https://www.facebook.com/smartappliancesmd', icon: <FacebookIcon sx={{ fontSize: 19 }} />, label: 'Facebook' },
            { href: 'https://www.instagram.com/smartappliancesmd', icon: <InstagramIcon sx={{ fontSize: 19 }} />, label: 'Instagram' },
            { href: 'https://www.youtube.com/@smartappliancesmd', icon: <YouTubeIcon sx={{ fontSize: 19 }} />, label: 'YouTube' },
          ].map(({ href, icon, label }) => (
            <IconButton
              key={label}
              component="a"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              size="small"
              sx={{
                color: colors.mutedText,
                '&:hover': { color: colors.primaryBlue, backgroundColor: colors.lightBlueBg },
                transition: 'color 0.2s, background-color 0.2s',
              }}
            >
              {icon}
            </IconButton>
          ))}
        </Box>
      </Box>

      {/* Copyright */}
      <Box sx={{ borderTop: '1px solid #E4E7EB', py: '16px', textAlign: 'center' }}>
        <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '13px' }}>
          © {new Date().getFullYear()} Smart Appliances. All rights reserved.
        </Typography>
        <MuiLink
          href="tel:+15712764808"
          sx={{
            display: 'block',
            mt: 0.5,
            fontFamily: fonts.body,
            color: colors.mutedText,
            fontSize: '13px',
            textDecoration: 'none',
            '&:hover': { color: colors.primaryBlue },
          }}
        >
          (571) 276-4808
        </MuiLink>
      </Box>
    </Box>
  );
};

export default SiteFooter;
