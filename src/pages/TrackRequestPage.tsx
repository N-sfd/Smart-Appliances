import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Button } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import { fonts } from '../theme';

const TrackRequestPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '60vh', backgroundColor: '#FFFFFF', py: { xs: 5, md: 8 } }}>
      <Container maxWidth="sm">
        <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '2rem', color: '#0B3D91', mb: 2 }}>
          Track Your Service Request
        </Typography>
        <Typography sx={{ fontFamily: fonts.body, color: '#64748B', lineHeight: 1.75, mb: 3 }}>
          To check the status of your appointment, call our team with the phone number used when booking.
          We will confirm scheduling, technician assignment, and completion details.
        </Typography>
        <Button
          component="a"
          href="tel:+18885550199"
          variant="contained"
          startIcon={<PhoneIcon />}
          sx={{
            fontFamily: fonts.body,
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: '10px',
            backgroundColor: '#1A73E8',
            mb: 2,
            '&:hover': { backgroundColor: '#0B3D91' },
          }}
        >
          Call (888) 555-0199
        </Button>
        <Box>
          <Button
            onClick={() => navigate('/contact')}
            sx={{ fontFamily: fonts.body, color: '#1A73E8', fontWeight: 600, textTransform: 'none' }}
          >
            Contact us instead
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default TrackRequestPage;
