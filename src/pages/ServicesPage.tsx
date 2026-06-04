import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Chip,
  Typography,
} from '@mui/material';
import KitchenIcon from '@mui/icons-material/Kitchen';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import BoltIcon from '@mui/icons-material/Bolt';
import DevicesIcon from '@mui/icons-material/Devices';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { serviceCategories } from '../data/services';

const iconMap: Record<string, React.ReactNode> = {
  Kitchen: <KitchenIcon sx={{ fontSize: 44, color: '#22B1FB' }} />,
  ShoppingCart: <ShoppingCartIcon sx={{ fontSize: 44, color: '#22B1FB' }} />,
  AcUnit: <AcUnitIcon sx={{ fontSize: 44, color: '#22B1FB' }} />,
  Plumbing: <PlumbingIcon sx={{ fontSize: 44, color: '#22B1FB' }} />,
  Bolt: <BoltIcon sx={{ fontSize: 44, color: '#22B1FB' }} />,
  Devices: <DevicesIcon sx={{ fontSize: 44, color: '#22B1FB' }} />,
  Build: <BuildIcon sx={{ fontSize: 44, color: '#22B1FB' }} />,
};

const categoryFees: Record<string, string> = {
  'appliance-repair': '$69',
  'appliance-installation': '$79',
  'hvac-services': '$89',
  'plumbing-services': '$79',
  'electrical-services': '$89',
  'smart-home-setup': '$49',
  'home-maintenance': '$59',
};

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: '#F5F7F9', minHeight: '100vh' }}>
      {/* Hero Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #022F49 0%, #034a73 60%, #022F49 100%)',
          py: { xs: 6, md: 10 },
          px: 2,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(circle at 30% 50%, rgba(34, 177, 251, 0.12) 0%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(34, 177, 251, 0.08) 0%, transparent 60%)',
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="overline"
            sx={{
              color: '#22B1FB',
              fontFamily: 'DM Sans, Arial, sans-serif',
              letterSpacing: 3,
              fontWeight: 600,
              display: 'block',
              mb: 2,
            }}
          >
            Complete Home Services
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Wasted Vindey, Arial, sans-serif',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '3rem' },
              mb: 2,
            }}
          >
            Professional Home Services
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'DM Sans, Arial, sans-serif',
              color: 'rgba(255,255,255,0.8)',
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '1.2rem' },
              maxWidth: 600,
              mx: 'auto',
              mb: 4,
            }}
          >
            Expert technicians for appliance repair, HVAC, plumbing, electrical, and smart home
            setup. Licensed pros, transparent pricing, fast response.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<CalendarTodayIcon />}
              onClick={() => navigate('/book/regular')}
              sx={{
                backgroundColor: '#22B1FB',
                color: '#FFFFFF',
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: '10px',
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': { backgroundColor: '#FFFFFF', color: '#022F49' },
              }}
            >
              Book Regular Service
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<WarningAmberIcon />}
              onClick={() => navigate('/book/emergency')}
              sx={{
                borderColor: '#FF6B6B',
                color: '#FF6B6B',
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: '10px',
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': { backgroundColor: '#FF6B6B', color: '#FFFFFF' },
              }}
            >
              Emergency Service
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Services Grid */}
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 } }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Wasted Vindey, Arial, sans-serif',
            color: '#022F49',
            fontWeight: 700,
            textAlign: 'center',
            mb: 1,
          }}
        >
          Our Service Categories
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: 'DM Sans, Arial, sans-serif',
            color: '#666666',
            textAlign: 'center',
            mb: 6,
          }}
        >
          Choose from 7 professional service categories — all with upfront diagnostic fees and
          certified technicians.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              lg: 'repeat(3, 1fr)',
              xl: 'repeat(4, 1fr)',
            },
            gap: 3,
          }}
        >
          {serviceCategories.map((category) => (
            <Card
              key={category.id}
              elevation={0}
              sx={{
                borderRadius: '16px',
                border: '1.5px solid #E8EFF5',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.25s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(2,47,73,0.12)',
                  borderColor: '#22B1FB',
                },
              }}
            >
              <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Icon + Tag */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '14px',
                      backgroundColor: 'rgba(34,177,251,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {iconMap[category.icon]}
                  </Box>
                  <Chip
                    label={`From ${categoryFees[category.id]}`}
                    size="small"
                    sx={{
                      backgroundColor: '#E8F8FF',
                      color: '#022F49',
                      fontFamily: 'DM Sans, Arial, sans-serif',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                    }}
                  />
                </Box>

                {/* Title + Description */}
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: 'Wasted Vindey, Arial, sans-serif',
                    color: '#022F49',
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  {category.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    color: '#666666',
                    mb: 2,
                    lineHeight: 1.6,
                  }}
                >
                  {category.description}
                </Typography>

                {/* Services list */}
                <Box sx={{ flex: 1, mb: 3 }}>
                  {category.services.slice(0, 5).map((service) => (
                    <Box
                      key={service.id}
                      sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}
                    >
                      <CheckCircleIcon sx={{ fontSize: 16, color: '#22B1FB', flexShrink: 0 }} />
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#555555', fontSize: '0.82rem' }}
                      >
                        {service.label}
                      </Typography>
                    </Box>
                  ))}
                  {category.services.length > 5 && (
                    <Typography
                      variant="caption"
                      sx={{ color: '#999999', fontFamily: 'DM Sans, Arial, sans-serif', ml: 3 }}
                    >
                      +{category.services.length - 5} more services
                    </Typography>
                  )}
                </Box>

                {/* Action buttons */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 'auto' }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<CalendarTodayIcon sx={{ fontSize: 16 }} />}
                    onClick={() => navigate(`/book/regular?category=${category.id}`)}
                    sx={{
                      backgroundColor: '#22B1FB',
                      color: '#FFFFFF',
                      fontFamily: 'DM Sans, Arial, sans-serif',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: '10px',
                      py: 1,
                      '&:hover': { backgroundColor: '#022F49' },
                    }}
                  >
                    Book Regular Service
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<WarningAmberIcon sx={{ fontSize: 16 }} />}
                    onClick={() => navigate(`/book/emergency?category=${category.id}`)}
                    sx={{
                      borderColor: '#FF6B6B',
                      color: '#FF6B6B',
                      fontFamily: 'DM Sans, Arial, sans-serif',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: '10px',
                      py: 1,
                      '&:hover': { backgroundColor: '#FF6B6B', color: '#FFFFFF', borderColor: '#FF6B6B' },
                    }}
                  >
                    Emergency Service
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default ServicesPage;
