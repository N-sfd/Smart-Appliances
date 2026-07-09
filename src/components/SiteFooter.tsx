import React, { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, IconButton, Tooltip } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { colors, fonts } from '../theme';

interface FooterLink {
  label: string;
  /** Route to navigate to. Omit when using `hash`. */
  path?: string;
  /** Element id on the homepage to scroll to instead of navigating to a new page. */
  hash?: string;
}

interface SocialLink {
  label: string;
  ariaLabel: string;
  href: string;
  icon: React.ReactNode;
}

const companyLinks: FooterLink[] = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Smart Care', path: '/membership' },
  { label: 'Service Areas', hash: 'service-areas' },
  { label: 'Contact Us', path: '/contact' },
];

const serviceLinks: FooterLink[] = [
  { label: 'Appliance Care', path: '/services/home-appliances' },
  { label: 'HVAC Services', path: '/services/hvac' },
  { label: 'Plumbing Services', path: '/services/plumbing' },
  { label: 'Electrical Services', path: '/services/electrical' },
  { label: 'Smart Home Services', path: '/services/smart-home' },
  { label: 'TV Mounting', path: '/services/tv-mounting' },
  { label: 'Phone Repair', path: '/services/phone-repair' },
  { label: 'Handyman', path: '/services/handyman' },
  { label: 'Garage Door Services', path: '/services/garage-door-repair' },
];

const resourceLinks: FooterLink[] = [
  { label: 'Help Center', path: '/resources' },
  { label: 'Articles', path: '/resources/articles' },
  { label: 'Videos', path: '/resources/videos' },
  { label: 'Maintenance Guides', path: '/resources/articles?category=maintenance' },
  { label: 'FAQ', hash: 'faqs' },
];

const supportLinks: FooterLink[] = [
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms of Service', path: '/terms-of-service' },
  { label: 'Membership Terms', path: '/membership' },
  { label: 'Service Guarantee', hash: 'service-guarantee' },
  { label: 'Sitemap', path: '/sitemap' },
];

const bottomBarLinks: FooterLink[] = [
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms of Service', path: '/terms-of-service' },
  { label: 'Sitemap', path: '/sitemap' },
];

// TODO: replace with the real Smart Appliances social profile URLs once they exist,
// then restore target="_blank" rel="noreferrer" (already wired up below for real links).
const socialLinks: SocialLink[] = [
  { label: 'Facebook', ariaLabel: 'Visit Smart Appliances on Facebook', href: '#', icon: <FacebookIcon sx={{ fontSize: 18 }} /> },
  {
    label: 'X',
    ariaLabel: 'Visit Smart Appliances on X',
    href: '#',
    icon: <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '0.85rem', lineHeight: 1 }}>X</Typography>,
  },
  { label: 'YouTube', ariaLabel: 'Visit Smart Appliances on YouTube', href: '#', icon: <YouTubeIcon sx={{ fontSize: 18 }} /> },
  { label: 'Google Business', ariaLabel: 'View Smart Appliances Google Business Profile', href: '#', icon: <StorefrontIcon sx={{ fontSize: 18 }} /> },
  { label: 'Instagram', ariaLabel: 'Visit Smart Appliances on Instagram', href: '#', icon: <InstagramIcon sx={{ fontSize: 18 }} /> },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Accessible, readable against the white footer background (~7.5:1 contrast). */
const FOOTER_LINK_COLOR = '#4B5563';

const FOOTER_HEADING = {
  fontFamily: fonts.heading,
  color: colors.navy,
  fontWeight: 700,
  fontSize: '1rem',
  letterSpacing: '-0.01em',
  lineHeight: 1.3,
  m: 0,
  mb: 1.75,
} as const;

const footerLinkSx = {
  fontFamily: fonts.body,
  color: FOOTER_LINK_COLOR,
  fontSize: '0.875rem',
  lineHeight: 1.6,
  textDecoration: 'none',
  display: 'block',
  mb: 0.9,
  transition: 'color 0.2s',
  '&:hover': { color: colors.primaryBlue },
} as const;

const hashLinkButtonSx = {
  ...footerLinkSx,
  background: 'none',
  border: 'none',
  padding: 0,
  width: '100%',
  textAlign: 'left',
  cursor: 'pointer',
  font: 'inherit',
} as const;

/** Scrolls to a section on the homepage, navigating there first if needed (mirrors TopBar's nav behavior). */
function scrollToHomeSection(id: string, navigate: ReturnType<typeof useNavigate>, pathname: string) {
  const snap = (behavior: ScrollBehavior) => document.getElementById(id)?.scrollIntoView({ behavior });
  const run = () => {
    snap('smooth');
    setTimeout(() => snap('auto'), 650);
  };
  if (pathname !== '/') {
    navigate('/');
    setTimeout(run, 400);
  } else {
    run();
  }
}

const FooterColumn: React.FC<{
  title: string;
  links: FooterLink[];
  onHashLinkClick: (hash: string) => void;
}> = ({ title, links, onHashLinkClick }) => (
  <Box>
    <Typography component="h3" sx={FOOTER_HEADING}>
      {title}
    </Typography>
    {links.map((link) =>
      link.hash ? (
        <Box
          key={link.label}
          component="button"
          type="button"
          onClick={() => onHashLinkClick(link.hash as string)}
          sx={hashLinkButtonSx}
        >
          {link.label}
        </Box>
      ) : (
        <Box key={link.label} component={RouterLink} to={link.path as string} sx={footerLinkSx}>
          {link.label}
        </Box>
      ),
    )}
  </Box>
);

const SiteFooter: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleHashLinkClick = (hash: string) => scrollToHomeSection(hash, navigate, location.pathname);

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
          pt: { xs: 4, md: 6 },
          pb: { xs: 3, md: 4 },
        }}
      >
        {/* Multi-column footer: Company | Services | Resources | Support | Stay Connected */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(3, minmax(0, 1fr))',
              lg: '1fr 1.35fr 1fr 1fr 1.3fr',
            },
            columnGap: { xs: 0, sm: 4, lg: 4 },
            rowGap: { xs: 4, sm: 5 },
            alignItems: 'start',
          }}
        >
          <Box sx={{ order: { xs: 2, sm: 0 } }}>
            <FooterColumn title="Company" links={companyLinks} onHashLinkClick={handleHashLinkClick} />
          </Box>
          <Box sx={{ order: { xs: 3, sm: 0 } }}>
            <FooterColumn title="Services" links={serviceLinks} onHashLinkClick={handleHashLinkClick} />
          </Box>
          <Box sx={{ order: { xs: 4, sm: 0 } }}>
            <FooterColumn title="Resources" links={resourceLinks} onHashLinkClick={handleHashLinkClick} />
          </Box>
          <Box sx={{ order: { xs: 5, sm: 0 } }}>
            <FooterColumn title="Support" links={supportLinks} onHashLinkClick={handleHashLinkClick} />
          </Box>

          {/* Stay Connected */}
          <Box sx={{ order: { xs: 1, sm: 0 } }}>
            <Typography component="h3" sx={FOOTER_HEADING}>
              Stay Connected
            </Typography>
            <Typography sx={{ fontFamily: fonts.body, color: FOOTER_LINK_COLOR, fontSize: '0.85rem', lineHeight: 1.55, mb: 1.75 }}>
              Get service tips, maintenance reminders, and Smart Care updates.
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubscribe}
              noValidate
              sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row', md: 'row', lg: 'column' }, gap: 1 }}
            >
              <TextField
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setSubscribeStatus('idle'); }}
                size="small"
                inputProps={{ 'aria-label': 'Email address' }}
                sx={{
                  // flex-basis/grow apply to the main axis, which flips with flexDirection above —
                  // only stretch to fill space when the form is a row; column mode already gets
                  // full width for free from the flex container's default align-items: stretch.
                  flex: { xs: 'auto', sm: '1 1 160px', md: '1 1 160px', lg: 'auto' },
                  minWidth: 0,
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
                  flexShrink: 0,
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

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {socialLinks.map((social) => {
                const isPlaceholder = social.href === '#';
                return (
                  <Tooltip key={social.label} title={social.label} enterTouchDelay={0}>
                    <IconButton
                      component="a"
                      href={social.href}
                      target={isPlaceholder ? undefined : '_blank'}
                      rel={isPlaceholder ? undefined : 'noreferrer'}
                      onClick={(e) => { if (isPlaceholder) e.preventDefault(); }}
                      aria-label={social.ariaLabel}
                      sx={{
                        width: 38,
                        height: 38,
                        backgroundColor: colors.primaryBlue,
                        color: '#fff',
                        transition: 'transform 0.2s ease, background-color 0.2s ease',
                        '&:hover': { backgroundColor: colors.navy, transform: 'translateY(-2px)' },
                        '&:focus-visible': { outline: `2px solid ${colors.navy}`, outlineOffset: 2 },
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  </Tooltip>
                );
              })}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 2 }}>
              <Box component="a" href="mailto:service@smartappliances.co" sx={{ ...footerLinkSx, mb: 0 }}>
                service@smartappliances.co
              </Box>
              <Box component="a" href="tel:+12405760397" sx={{ ...footerLinkSx, mb: 0 }}>
                +1 (240) 576-0397
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
          <Typography sx={{ fontFamily: fonts.body, color: FOOTER_LINK_COLOR, fontSize: '14px' }}>
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
                to={link.path as string}
                sx={{
                  fontFamily: fonts.body,
                  color: FOOTER_LINK_COLOR,
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
