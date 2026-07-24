import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Button } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { SERVICE_AREA_REGION_LABEL } from '../data/serviceAreas';
import PageHero from '../components/common/PageHero';
import { PAGE_HERO_PHOTOS } from '../data/pageHeroImages';
import GetInTouchSection from '../components/contact/GetInTouchSection';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <PageHero
        title="Get in Touch with Smart Appliances"
        subtitle="Our team is here to help with service requests, scheduling questions, coverage confirmation, and general support."
        belowSubtitle={
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
            <Box
              component="a"
              href="tel:+12405760397"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.75, textDecoration: 'none', color: '#FFFFFF', '&:hover': { color: '#4FC3F7' } }}
            >
              <PhoneIcon sx={{ fontSize: 17, color: '#4FC3F7' }} />
              <Typography sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", fontSize: '0.85rem', fontWeight: 600 }}>
                (240) 576-0397
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#FFFFFF' }}>
              <EmailIcon sx={{ fontSize: 17, color: '#4FC3F7' }} />
              <Typography sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", fontSize: '0.85rem', fontWeight: 600 }}>
                service@smartappliances.co
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#FFFFFF' }}>
              <LocationOnIcon sx={{ fontSize: 17, color: '#4FC3F7' }} />
              <Typography sx={{ fontFamily: "'Inter', 'DM Sans', Arial, sans-serif", fontSize: '0.85rem', fontWeight: 600 }}>
                Serving {SERVICE_AREA_REGION_LABEL}
              </Typography>
            </Box>
          </Box>
        }
        primaryAction={{ label: 'Schedule Service', onClick: () => navigate('/scheduler') }}
        secondaryAction={{ label: 'Track a Request', href: '/track-request' }}
        imageSrc={PAGE_HERO_PHOTOS.contact.src}
        imageAlt={PAGE_HERO_PHOTOS.contact.alt}
        imageAspectRatio={PAGE_HERO_PHOTOS.contact.aspectRatio}
        imageObjectPosition={PAGE_HERO_PHOTOS.contact.objectPosition}
      />

      {/* ── Get In Touch ── */}
      <GetInTouchSection backgroundColor="#F5F7F9" />

      {/* ── Bottom CTA row ── */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", color: '#0B3D91', mr: { sm: 2 } }}
            >
              Need service now?
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/book/regular')}
              sx={{
                backgroundColor: '#1A73E8',
                color: '#FFFFFF',
                fontFamily: "'Inter', 'DM Sans', Arial, sans-serif",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: '14px',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#0B3D91' },
              }}
            >
              Book Regular Service
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default ContactPage;
