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
  path?: string;
  hash?: string;
}

interface SocialLink {
  label: string;
  ariaLabel: string;
  href: string;
  icon: React.ReactNode;
  /** Brand color used for the icon (and its hover fill) so each platform reads as itself. */
  color: string;
  /** Optional brand gradient (e.g. Instagram) used for the hover fill instead of a flat color. */
  hoverGradient?: string;
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
  { label: 'Privacy', path: '/privacy-policy' },
  { label: 'Terms', path: '/terms-of-service' },
];

const socialLinks: SocialLink[] = [
  { label: 'Facebook', ariaLabel: 'Visit Smart Appliances on Facebook', href: '#', icon: <FacebookIcon sx={{ fontSize: 18 }} />, color: '#1877F2' },
  {
    label: 'X',
    ariaLabel: 'Visit Smart Appliances on X',
    href: '#',
    icon: <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '0.85rem', lineHeight: 1, color: 'inherit' }}>X</Typography>,
    color: '#000000',
  },
  { label: 'YouTube', ariaLabel: 'Visit Smart Appliances on YouTube', href: '#', icon: <YouTubeIcon sx={{ fontSize: 18 }} />, color: '#FF0000' },
  { label: 'Google Business', ariaLabel: 'View Smart Appliances Google Business Profile', href: '#', icon: <StorefrontIcon sx={{ fontSize: 18 }} />, color: '#4285F4' },
  {
    label: 'Instagram',
    ariaLabel: 'Visit Smart Appliances on Instagram',
    href: '#',
    icon: <InstagramIcon sx={{ fontSize: 18 }} />,
    color: '#D62976',
    hoverGradient: 'linear-gradient(45deg, #FEDA75, #FA7E1E, #D62976, #962FBF, #4F5BD5)',
  },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FOOTER_LINK_COLOR = '#4B5563';

const FOOTER_HEADING = {
  fontFamily: fonts.heading,
  color: colors.navy,
  fontWeight: 700,
  fontSize: '1rem',
  letterSpacing: '-0.01em',
  lineHeight: 1.3,
  m: 0,
  mb: '12px',
} as const;

const footerLinkSx = {
  fontFamily: fonts.body,
  color: FOOTER_LINK_COLOR,
  fontSize: '0.875rem',
  lineHeight: 1.45,
  textDecoration: 'none',
  display: 'block',
  mb: '7px',
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
        backgroundColor: '#FFFFFF',
        borderTop: `1px solid ${colors.border}`,
        mt: 'auto',
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          pt: { xs: 4, md: 5 },
          pb: { xs: 2, md: 2.5 },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(3, minmax(0, 1fr))',
              lg: '1.05fr 1.4fr 1fr 1fr 1.35fr',
            },
            columnGap: { xs: 0, sm: 4, lg: 5 },
            rowGap: { xs: 3.5, sm: 4 },
            alignItems: 'start',
          }}
        >
          <FooterColumn title="Company" links={companyLinks} onHashLinkClick={handleHashLinkClick} />
          <FooterColumn title="Services" links={serviceLinks} onHashLinkClick={handleHashLinkClick} />
          <FooterColumn title="Resources" links={resourceLinks} onHashLinkClick={handleHashLinkClick} />
          <FooterColumn title="Support" links={supportLinks} onHashLinkClick={handleHashLinkClick} />

          <Box>
            <Typography component="h3" sx={FOOTER_HEADING}>
              Stay Connected
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubscribe}
              noValidate
              sx={{ display: 'flex', flexDirection: 'row', gap: 0.75, mb: 1.5 }}
            >
              <TextField
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSubscribeStatus('idle');
                }}
                size="small"
                fullWidth
                inputProps={{ 'aria-label': 'Email address' }}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    fontFamily: fonts.body,
                    fontSize: '0.85rem',
                    backgroundColor: '#F6F9FC',
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  flexShrink: 0,
                  minHeight: 40,
                  backgroundColor: colors.primaryBlue,
                  color: '#fff',
                  fontFamily: fonts.body,
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: '10px',
                  px: 2.5,
                  whiteSpace: 'nowrap',
                  boxShadow: 'none',
                  '&:hover': { backgroundColor: colors.navy, boxShadow: 'none' },
                }}
              >
                Subscribe
              </Button>
            </Box>

            {subscribeStatus === 'success' && (
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: colors.success, mb: 1 }}>
                Thank you for subscribing.
              </Typography>
            )}
            {subscribeStatus === 'error' && (
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: '#DC2626', mb: 1 }}>
                Please enter a valid email address.
              </Typography>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {socialLinks.map((social) => {
                const isPlaceholder = social.href === '#';
                return (
                  <Tooltip key={social.label} title={social.label} enterTouchDelay={0}>
                    <IconButton
                      component="a"
                      href={social.href}
                      target={isPlaceholder ? undefined : '_blank'}
                      rel={isPlaceholder ? undefined : 'noreferrer'}
                      onClick={(e) => {
                        if (isPlaceholder) e.preventDefault();
                      }}
                      aria-label={social.ariaLabel}
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: '#F5F7FA',
                        color: social.color,
                        border: '1px solid #E4E7EB',
                        transition: 'transform 0.2s ease, background-color 0.2s ease, background-image 0.2s ease, color 0.2s ease',
                        '&:hover': {
                          backgroundColor: social.color,
                          backgroundImage: social.hoverGradient ?? 'none',
                          color: '#fff',
                          transform: 'translateY(-2px)',
                        },
                        '&:focus-visible': { outline: `2px solid ${colors.navy}`, outlineOffset: 2 },
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  </Tooltip>
                );
              })}
            </Box>

            <Typography
              component="p"
              sx={{
                fontFamily: fonts.body,
                color: FOOTER_LINK_COLOR,
                fontSize: '0.875rem',
                lineHeight: 1.5,
                m: 0,
              }}
            >
              <Box
                component="a"
                href="mailto:service@smartappliances.co"
                sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: colors.primaryBlue } }}
              >
                service@smartappliances.co
              </Box>
              <Box component="span" sx={{ mx: 1, color: '#9CA3AF' }} aria-hidden>
                |
              </Box>
              <Box
                component="a"
                href="tel:+12405760397"
                sx={{ color: 'inherit', textDecoration: 'none', whiteSpace: 'nowrap', '&:hover': { color: colors.primaryBlue } }}
              >
                +1 (240) 576-0397
              </Box>
            </Typography>
            <Typography
              component="p"
              sx={{
                fontFamily: fonts.body,
                color: FOOTER_LINK_COLOR,
                fontSize: '0.875rem',
                lineHeight: 1.5,
                mt: 0.5,
                mb: 0,
              }}
            >
              1101 Opal Ct, Hagerstown, MD 21740
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            borderTop: `1px solid ${colors.border}`,
            mt: { xs: 4, md: 5 },
            pt: 2,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'center' },
            justifyContent: 'space-between',
            gap: 1.5,
          }}
        >
          <Typography sx={{ fontFamily: fonts.body, color: FOOTER_LINK_COLOR, fontSize: '14px' }}>
            © {new Date().getFullYear()} Smart Appliances
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {bottomBarLinks.map((link, index) => (
              <React.Fragment key={link.label}>
                {index > 0 ? (
                  <Box component="span" sx={{ color: '#9CA3AF', fontSize: '14px' }} aria-hidden>
                    |
                  </Box>
                ) : null}
                <Box
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
              </React.Fragment>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SiteFooter;
