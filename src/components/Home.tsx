import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  TextField,
  Divider,
} from '@mui/material';
import KitchenIcon from '@mui/icons-material/Kitchen';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import BoltIcon from '@mui/icons-material/Bolt';
import DevicesIcon from '@mui/icons-material/Devices';
import BuildIcon from '@mui/icons-material/Build';
import StarIcon from '@mui/icons-material/Star';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import EngineeringIcon from '@mui/icons-material/Engineering';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import VerifiedIcon from '@mui/icons-material/Verified';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { serviceCategories } from '../data/services';

interface HomeProps {
  cartItems: {
    refrigerator: number;
    washingMachine: number;
    bulb: number;
    oven: number;
  };
  setCartItems: React.Dispatch<
    React.SetStateAction<{
      refrigerator: number;
      washingMachine: number;
      bulb: number;
      oven: number;
    }>
  >;
  onOpenBooking?: (priority: 'regular' | 'emergency', categoryId?: string, serviceTypeId?: string) => void;
}

const sectionTags = ['All', 'Appliances', 'HVAC', 'Plumbing', 'Electrical', 'Smart Home', 'Maintenance'];

const iconMap: Record<string, React.ReactNode> = {
  Kitchen: <KitchenIcon sx={{ fontSize: 36, color: '#22B1FB' }} />,
  ShoppingCart: <ShoppingCartIcon sx={{ fontSize: 36, color: '#22B1FB' }} />,
  AcUnit: <AcUnitIcon sx={{ fontSize: 36, color: '#22B1FB' }} />,
  Plumbing: <PlumbingIcon sx={{ fontSize: 36, color: '#22B1FB' }} />,
  Bolt: <BoltIcon sx={{ fontSize: 36, color: '#22B1FB' }} />,
  Devices: <DevicesIcon sx={{ fontSize: 36, color: '#22B1FB' }} />,
  Build: <BuildIcon sx={{ fontSize: 36, color: '#22B1FB' }} />,
};

const howItWorks = [
  {
    step: '1',
    title: 'Choose a service',
    description: 'Pick the right category and specific service type for your appliance or home system.',
  },
  {
    step: '2',
    title: 'Regular or emergency',
    description: 'Schedule routine work at a convenient time or request urgent same-day emergency response.',
  },
  {
    step: '3',
    title: 'Tell us the problem',
    description: 'Share the issue details, location, appliance brand, model, and any photos for faster service.',
  },
  {
    step: '4',
    title: 'Get contacted & booked',
    description: 'Our team confirms service details, availability, and next steps with clear pricing notes.',
  },
];

const trustItems = [
  {
    icon: <FlashOnIcon sx={{ fontSize: 32, color: '#22B1FB' }} />,
    title: 'Fast Response',
    description: 'Quick replies and clear scheduling for every request, including same-day emergency service.',
  },
  {
    icon: <EngineeringIcon sx={{ fontSize: 32, color: '#22B1FB' }} />,
    title: 'Experienced Technicians',
    description: 'Licensed pros trained in appliance repair, HVAC, plumbing, electrical, and smart home setup.',
  },
  {
    icon: <HomeRepairServiceIcon sx={{ fontSize: 32, color: '#22B1FB' }} />,
    title: 'Full Home Coverage',
    description: 'Complete coverage for repairs, installations, maintenance, and emergency jobs across all systems.',
  },
  {
    icon: <VerifiedIcon sx={{ fontSize: 32, color: '#22B1FB' }} />,
    title: 'Transparent Estimates',
    description: 'Clear pricing notes and your consent before final diagnosis and any work begins.',
  },
];

const companyStats = [
  { value: '5,000+', label: 'Repairs Completed' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '24/7', label: 'Emergency Support' },
  { value: '100%', label: 'Licensed & Insured' },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    location: 'Austin, TX',
    rating: 5,
    text: 'Called for an emergency refrigerator repair at 10pm. A technician arrived within 2 hours and fixed it the same night. Absolutely incredible service!',
  },
  {
    name: 'Michael Torres',
    location: 'Houston, TX',
    rating: 5,
    text: 'Scheduled an AC maintenance visit — they showed up on time, explained everything clearly, and the price matched the quote exactly. Zero surprises.',
  },
  {
    name: 'Emily Chen',
    location: 'Dallas, TX',
    rating: 5,
    text: 'Smart home setup was flawless. The technician walked us through every device and made sure everything was fully integrated before leaving.',
  },
];

const Home: React.FC<HomeProps> = ({ cartItems, setCartItems, onOpenBooking }) => {
  const navigate = useNavigate();
  const openBooking = (priority: 'regular' | 'emergency', categoryId?: string, serviceTypeId?: string) => {
    if (onOpenBooking) {
      onOpenBooking(priority, categoryId, serviceTypeId);
    } else {
      const path = priority === 'emergency' ? '/book/emergency' : '/book/regular';
      const params = new URLSearchParams();
      if (categoryId) params.set('category', categoryId);
      if (serviceTypeId) params.set('service', serviceTypeId);
      const queryString = params.toString();
      navigate(queryString ? `${path}?${queryString}` : path);
    }
  };
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentBrandIndex, setCurrentBrandIndex] = useState(0);
  const [currentRepairBrandIndex, setCurrentRepairBrandIndex] = useState(0);
  const [itemCounts, setItemCounts] = useState({ refrigerator: 0, washingMachine: 0, bulb: 0, oven: 0 });
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState('All');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const images = ['/1.png', '/2.png', '/3.png'];

  const brandLogos = [
    { src: '/Samsung_Logo.svg.png', alt: 'Samsung' },
    { src: '/LG-Logo.png', alt: 'LG' },
    { src: '/Whirlpool-Logo.png', alt: 'Whirlpool' },
    { src: '/Bosch-Logo.png', alt: 'Bosch' },
    { src: '/General_Electric_logo.svg.png', alt: 'GE' },
  ];

  const infiniteBrandLogos = [...brandLogos, ...brandLogos];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBrandIndex((prev) => (prev + 1 >= brandLogos.length ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [brandLogos.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRepairBrandIndex((prev) => (prev + 1 >= brandLogos.length ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [brandLogos.length]);

  const filteredCategories = useMemo(
    () =>
      serviceCategoryFilter === 'All'
        ? serviceCategories
        : serviceCategories.filter((c) => c.tags.includes(serviceCategoryFilter)),
    [serviceCategoryFilter],
  );

  const increaseCount = (itemType: keyof typeof itemCounts) => {
    setItemCounts((prev) => ({ ...prev, [itemType]: prev[itemType] + 1 }));
  };

  const decreaseCount = (itemType: keyof typeof itemCounts) => {
    setItemCounts((prev) => ({ ...prev, [itemType]: Math.max(0, prev[itemType] - 1) }));
  };

  const addToCart = (itemType: keyof typeof itemCounts) => {
    if (itemCounts[itemType] > 0) {
      setCartItems((prev) => ({ ...prev, [itemType]: prev[itemType] + itemCounts[itemType] }));
      setItemCounts((prev) => ({ ...prev, [itemType]: 0 }));
    }
  };

  const handleContactSubmit = () => {
    if (contactName && contactEmail && contactMessage) {
      setContactSent(true);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      {/* ── Hero ── */}
      <Box
        id="home"
        sx={{ position: 'relative', height: '70vh', minHeight: '540px', overflow: 'hidden' }}
      >
        {images.map((image, index) => (
          <Box
            key={image}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: index === currentImageIndex ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        ))}

        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(2, 47, 73, 0.68)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            pb: '80px',
          }}
        >
          <Container maxWidth="lg" sx={{ color: '#FFFFFF', textAlign: 'center' }}>
            {/* Trust badge */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                backgroundColor: 'rgba(34, 177, 251, 0.15)',
                border: '1px solid rgba(34, 177, 251, 0.4)',
                borderRadius: '999px',
                px: 2.5,
                py: 0.75,
                mb: 2.5,
                backdropFilter: 'blur(8px)',
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#22B1FB',
                  '@keyframes heroPulse': {
                    '0%': { boxShadow: '0 0 0 0 rgba(34,177,251,0.7)' },
                    '70%': { boxShadow: '0 0 0 8px rgba(34,177,251,0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(34,177,251,0)' },
                  },
                  animation: 'heroPulse 2s infinite',
                }}
              />
              <Typography
                sx={{
                  color: '#D0EEFF',
                  fontSize: '0.85rem',
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontWeight: 600,
                  letterSpacing: 0.5,
                }}
              >
                Trusted by 5,000+ homeowners
              </Typography>
            </Box>
            <Typography
              variant="h1"
              sx={{
                fontFamily: 'Wasted Vindey, Arial, sans-serif',
                fontWeight: 700,
                fontSize: { xs: '1.9rem', sm: '2.6rem', md: '3.4rem' },
                marginBottom: 2,
                textShadow: '2px 2px 8px rgba(0,0,0,0.4)',
              }}
            >
              Smart Home Service, Repairs & Installations
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontWeight: 400,
                marginBottom: 3,
                maxWidth: '760px',
                margin: '0 auto 24px',
                lineHeight: 1.7,
                fontSize: { xs: '1rem', md: '1.2rem' },
                textShadow: '1px 1px 6px rgba(0,0,0,0.3)',
              }}
            >
              Book trusted technicians for appliances, HVAC, plumbing, electrical, smart home setup, or urgent
              same-day service in your area.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
              <Button
                variant="contained"
                onClick={() => openBooking('regular')}
                sx={{
                  backgroundColor: '#22B1FB',
                  color: '#FFFFFF',
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontWeight: 700,
                  padding: '14px 32px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  '&:hover': { backgroundColor: '#FFFFFF', color: '#022F49' },
                }}
              >
                Schedule Regular Service
              </Button>
              <Button
                variant="contained"
                onClick={() => openBooking('emergency')}
                sx={{
                  backgroundColor: '#FF6B6B',
                  color: '#FFFFFF',
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontWeight: 700,
                  padding: '14px 32px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  '&:hover': { backgroundColor: '#FFFFFF', color: '#FF6B6B' },
                }}
              >
                Emergency Service
              </Button>
            </Box>
            <Typography variant="body2" sx={{ color: '#D0EEFF', lineHeight: 1.7, fontSize: '0.9rem' }}>
              Schedule a convenient appointment or request urgent same-day support with clear priority and fast response.
            </Typography>
          </Container>
        </Box>

        {/* Hero stats bar */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            backgroundColor: 'rgba(2, 47, 73, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            py: { xs: 2, md: 2.5 },
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'flex',
                justifyContent: { xs: 'center', md: 'space-around' },
                gap: { xs: 4, md: 2 },
                flexWrap: 'wrap',
              }}
            >
              {companyStats.map((stat) => (
                <Box key={stat.label} sx={{ textAlign: 'center' }}>
                  <Typography
                    sx={{
                      color: '#22B1FB',
                      fontWeight: 800,
                      fontSize: { xs: '1.4rem', md: '1.7rem' },
                      fontFamily: 'DM Sans, Arial, sans-serif',
                      lineHeight: 1.1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    sx={{
                      color: '#A8D8F0',
                      fontSize: '0.7rem',
                      fontFamily: 'DM Sans, Arial, sans-serif',
                      textTransform: 'uppercase',
                      letterSpacing: 1.2,
                      mt: 0.5,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>
      </Box>

      {/* ── Service Categories ── */}
      <Box id="services" sx={{ padding: '72px 0', backgroundColor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Wasted Vindey, Arial, sans-serif',
              fontWeight: 600,
              color: '#022F49',
              textAlign: 'center',
              marginBottom: 1,
            }}
          >
            Our Service Categories
          </Typography>
          <Box sx={{ width: 56, height: 4, borderRadius: '2px', background: 'linear-gradient(90deg, #22B1FB, #0077CC)', mx: 'auto', mt: 1.5, mb: 2 }} />
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'DM Sans, Arial, sans-serif',
              color: '#555555',
              textAlign: 'center',
              marginBottom: 4,
              maxWidth: '780px',
              margin: '0 auto 32px',
              lineHeight: 1.8,
            }}
          >
            Home services that match the brands and systems you trust — from appliance repair to emergency support,
            HVAC care, plumbing, electrical, and smart home setup.
          </Typography>

          {/* Filter tabs */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', marginBottom: 4 }}>
            {sectionTags.map((tag) => (
              <Button
                key={tag}
                onClick={() => setServiceCategoryFilter(tag)}
                variant={serviceCategoryFilter === tag ? 'contained' : 'outlined'}
                sx={{
                  textTransform: 'none',
                  borderRadius: '999px',
                  px: 3,
                  py: 0.75,
                  borderColor: '#22B1FB',
                  color: serviceCategoryFilter === tag ? '#FFFFFF' : '#022F49',
                  backgroundColor: serviceCategoryFilter === tag ? '#22B1FB' : '#F5F7F9',
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontWeight: serviceCategoryFilter === tag ? 700 : 500,
                  '&:hover': { backgroundColor: serviceCategoryFilter === tag ? '#1A9FE0' : '#E8F4FD', borderColor: '#22B1FB' },
                }}
              >
                {tag}
              </Button>
            ))}
          </Box>

          {/* Category cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {filteredCategories.map((category) => (
              <Card
                key={category.id}
                sx={{
                  borderRadius: '20px',
                  border: '1px solid #E5E5E5',
                  minHeight: '340px',
                  transition: 'all 0.25s ease',
                  '&:hover': { boxShadow: '0 14px 40px rgba(34,177,251,0.18)', transform: 'translateY(-5px)', borderColor: 'rgba(34,177,251,0.4)' },
                }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, rgba(34,177,251,0.15) 0%, rgba(34,177,251,0.05) 100%)',
                        border: '1px solid rgba(34,177,251,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {iconMap[category.icon] ?? <StarIcon sx={{ fontSize: 32, color: '#22B1FB' }} />}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#022F49' }}
                    >
                      {category.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#666666', lineHeight: 1.8, mb: 2 }}>
                    {category.description}
                  </Typography>

                  {/* Top services list */}
                  <Box sx={{ mb: 2, flexGrow: 1 }}>
                    {category.services.slice(0, 4).map((service) => (
                      <Box
                        key={service.id}
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}
                      >
                        <CheckCircleOutlineIcon sx={{ fontSize: 14, color: '#22B1FB', flexShrink: 0 }} />
                        <Typography
                          variant="body2"
                          sx={{ color: '#444444', fontFamily: 'DM Sans, Arial, sans-serif', fontSize: '0.82rem' }}
                        >
                          {service.label}
                        </Typography>
                      </Box>
                    ))}
                    {category.services.length > 4 && (
                      <Typography
                        variant="caption"
                        sx={{ color: '#22B1FB', fontFamily: 'DM Sans, Arial, sans-serif', ml: 2.5 }}
                      >
                        +{category.services.length - 4} more services
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'grid', gap: 1 }}>
                    <Button
                      variant="contained"
                      onClick={() => openBooking('regular', category.id, category.services[0]?.id)}
                      sx={{
                        backgroundColor: '#22B1FB',
                        color: '#FFFFFF',
                        textTransform: 'none',
                        borderRadius: '10px',
                        fontFamily: 'DM Sans, Arial, sans-serif',
                        fontWeight: 600,
                        '&:hover': { backgroundColor: '#022F49' },
                      }}
                    >
                      Book Service
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => openBooking('emergency', category.id, category.services[0]?.id)}
                      sx={{
                        textTransform: 'none',
                        borderRadius: '10px',
                        borderColor: '#FF6B6B',
                        color: '#FF6B6B',
                        fontFamily: 'DM Sans, Arial, sans-serif',
                        fontWeight: 600,
                        '&:hover': { backgroundColor: '#FFF5F5', borderColor: '#CC2200', color: '#CC2200' },
                      }}
                    >
                      Emergency Support
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── How It Works ── */}
      <Box sx={{ padding: '64px 0', backgroundColor: '#F5F7F9' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Wasted Vindey, Arial, sans-serif',
              color: '#022F49',
              textAlign: 'center',
              marginBottom: 1,
            }}
          >
            How It Works
          </Typography>
          <Box sx={{ width: 56, height: 4, borderRadius: '2px', background: 'linear-gradient(90deg, #22B1FB, #0077CC)', mx: 'auto', mt: 1.5, mb: 2 }} />
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'DM Sans, Arial, sans-serif',
              color: '#555555',
              textAlign: 'center',
              marginBottom: 4,
            }}
          >
            Book a service in minutes, get expert help fast.
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 3,
            }}
          >
            {howItWorks.map((item) => (
              <Card
                key={item.step}
                sx={{ borderRadius: '18px', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #22B1FB 0%, #0077CC 100%)',
                      boxShadow: '0 4px 16px rgba(34,177,251,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#FFFFFF',
                        fontFamily: 'Wasted Vindey, Arial, sans-serif',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                      }}
                    >
                      {item.step}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: 'Wasted Vindey, Arial, sans-serif',
                      color: '#022F49',
                      marginBottom: 1.5,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555555', lineHeight: 1.8, fontFamily: 'DM Sans, Arial, sans-serif' }}>
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Trust Section ── */}
      <Box sx={{ padding: '72px 0', backgroundColor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Wasted Vindey, Arial, sans-serif',
              color: '#022F49',
              textAlign: 'center',
              marginBottom: 1,
            }}
          >
            Why Choose Us
          </Typography>
          <Box sx={{ width: 56, height: 4, borderRadius: '2px', background: 'linear-gradient(90deg, #22B1FB, #0077CC)', mx: 'auto', mt: 1.5, mb: 2 }} />
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'DM Sans, Arial, sans-serif',
              color: '#555555',
              textAlign: 'center',
              marginBottom: 4,
            }}
          >
            Trusted service with transparent pricing and professional technicians.
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 3,
            }}
          >
            {trustItems.map((item) => (
              <Card
                key={item.title}
                sx={{
                  borderRadius: '18px',
                  backgroundColor: '#F5F7F9',
                  border: '1px solid #E8E8E8',
                  borderTop: '3px solid #22B1FB',
                  transition: 'all 0.25s ease',
                  '&:hover': { boxShadow: '0 10px 30px rgba(34,177,251,0.14)', transform: 'translateY(-3px)' },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      mb: 2.5,
                      width: 56,
                      height: 56,
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, rgba(34,177,251,0.15) 0%, rgba(34,177,251,0.05) 100%)',
                      border: '1px solid rgba(34,177,251,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#022F49', mb: 1.5 }}
                  >
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555555', lineHeight: 1.8, fontFamily: 'DM Sans, Arial, sans-serif' }}>
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Testimonials ── */}
      <Box sx={{ padding: '72px 0', backgroundColor: '#022F49' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#FFFFFF', textAlign: 'center', mb: 1 }}
          >
            What Our Customers Say
          </Typography>
          <Box sx={{ width: 56, height: 4, borderRadius: '2px', background: 'linear-gradient(90deg, #22B1FB, #5DCAFF)', mx: 'auto', mt: 1.5, mb: 6 }} />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {testimonials.map((t) => (
              <Box
                key={t.name}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  p: 3.5,
                  transition: 'all 0.25s ease',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.09)', transform: 'translateY(-4px)', boxShadow: '0 12px 40px rgba(0,0,0,0.2)' },
                }}
              >
                <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <StarIcon key={i} sx={{ color: '#FFB800', fontSize: 18 }} />
                  ))}
                </Box>
                <Typography
                  sx={{
                    color: '#D0EEFF',
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    lineHeight: 1.85,
                    mb: 3,
                    fontSize: '0.95rem',
                    fontStyle: 'italic',
                  }}
                >
                  "{t.text}"
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #22B1FB 0%, #0077CC 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Typography sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1.1rem', fontFamily: 'DM Sans, Arial, sans-serif' }}>
                      {t.name.charAt(0)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#FFFFFF', fontWeight: 700, fontFamily: 'DM Sans, Arial, sans-serif', fontSize: '0.9rem' }}>
                      {t.name}
                    </Typography>
                    <Typography sx={{ color: '#7FBBDD', fontSize: '0.8rem', fontFamily: 'DM Sans, Arial, sans-serif' }}>
                      {t.location}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Brands ── */}
      <Box sx={{ padding: '40px 0 56px', backgroundColor: '#F5F7F9' }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr auto 1fr' },
              gap: 3,
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography
                variant="h3"
                sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', textAlign: 'center', mb: 3, color: '#022F49' }}
              >
                Brands We Sell
              </Typography>
              <Box sx={{ position: 'relative', overflow: 'hidden', maxWidth: '500px', margin: '0 auto', height: '80px' }}>
                <Box
                  sx={{
                    display: 'flex',
                    transition: 'transform 0.5s ease-in-out',
                    transform: `translateX(-${currentBrandIndex * 152}px)`,
                    gap: 4,
                    alignItems: 'center',
                  }}
                >
                  {infiniteBrandLogos.map((brand, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={brand.src}
                      alt={brand.alt}
                      sx={{
                        width: index % 5 === 4 ? '80px' : '120px',
                        height: 'auto',
                        objectFit: 'contain',
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
                width: '2px',
                backgroundColor: '#D9D9D9',
                height: '200px',
                margin: '0 auto',
                borderRadius: '1px',
              }}
            />
            <Box>
              <Typography
                variant="h3"
                sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', textAlign: 'center', mb: 3, color: '#022F49' }}
              >
                Brands We Repair
              </Typography>
              <Box sx={{ position: 'relative', overflow: 'hidden', maxWidth: '500px', margin: '0 auto', height: '80px' }}>
                <Box
                  sx={{
                    display: 'flex',
                    transition: 'transform 0.5s ease-in-out',
                    transform: `translateX(-${currentRepairBrandIndex * 152}px)`,
                    gap: 4,
                    alignItems: 'center',
                  }}
                >
                  {infiniteBrandLogos.map((brand, index) => (
                    <Box
                      key={`repair-${index}`}
                      component="img"
                      src={brand.src}
                      alt={brand.alt}
                      sx={{
                        width: index % 5 === 4 ? '80px' : '120px',
                        height: 'auto',
                        objectFit: 'contain',
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── Repair & Emergency Services ── */}
      <Box id="repair" sx={{ padding: '72px 0', backgroundColor: '#022F49' }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 6,
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: 'Wasted Vindey, Arial, sans-serif',
                  color: '#FFFFFF',
                  mb: 2,
                }}
              >
                Repair & Emergency Services
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  color: '#A8D8F0',
                  lineHeight: 1.9,
                  mb: 3,
                }}
              >
                Our certified technicians handle repairs of all kinds — from appliance breakdowns and HVAC failures to
                plumbing emergencies and electrical issues. We respond fast, diagnose accurately, and fix it right.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
                {[
                  'All major appliance brands serviced',
                  'Licensed HVAC, plumbing & electrical techs',
                  'Same-day emergency response available',
                  'Transparent diagnosis before any repair',
                  'Parts sourced and replaced on-site',
                ].map((point) => (
                  <Box key={point} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CheckCircleOutlineIcon sx={{ color: '#22B1FB', fontSize: 20, flexShrink: 0 }} />
                    <Typography
                      variant="body2"
                      sx={{ color: '#CCECFF', fontFamily: 'DM Sans, Arial, sans-serif', fontSize: '0.95rem' }}
                    >
                      {point}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={() => openBooking('regular', 'appliance-repair')}
                  sx={{
                    backgroundColor: '#22B1FB',
                    color: '#FFFFFF',
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    fontWeight: 700,
                    px: 3,
                    py: 1.25,
                    borderRadius: '10px',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#FFFFFF', color: '#022F49' },
                  }}
                >
                  Book Repair Service
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => openBooking('emergency')}
                  sx={{
                    borderColor: '#FF6B6B',
                    color: '#FF6B6B',
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    fontWeight: 700,
                    px: 3,
                    py: 1.25,
                    borderRadius: '10px',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: 'rgba(255,107,107,0.1)', borderColor: '#FF9999' },
                  }}
                >
                  Emergency Help
                </Button>
              </Box>
            </Box>

            {/* Stats */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 2,
              }}
            >
              {companyStats.map((stat) => (
                <Box
                  key={stat.label}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '16px',
                    p: 3,
                    textAlign: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'Wasted Vindey, Arial, sans-serif',
                      color: '#22B1FB',
                      fontSize: '2rem',
                      fontWeight: 700,
                      lineHeight: 1.2,
                      mb: 0.5,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: '#A8D8F0', fontFamily: 'DM Sans, Arial, sans-serif', fontSize: '0.85rem' }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── Buy Appliances ── */}
      <Box id="appliances" sx={{ backgroundColor: '#E8F4FD' }}>
        <Container maxWidth="lg" sx={{ padding: '56px 0' }}>
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Wasted Vindey, Arial, sans-serif',
              fontWeight: 600,
              textAlign: 'center',
              marginBottom: 4,
              color: '#022F49',
            }}
          >
            Buy Our Premium Appliances
          </Typography>
          <Box
            sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}
          >
            {[
              {
                src: '/Item2.png',
                alt: 'Smart Refrigerator',
                title: 'Smart Refrigerator',
                description: 'Advanced temperature control, inventory tracking, and energy efficiency for modern kitchens.',
                price: '$1,299',
                type: 'refrigerator' as const,
              },
              {
                src: '/Item1.png',
                alt: 'Smart Washer',
                title: 'Smart Washer',
                description: 'Efficient laundry solutions with remote monitoring and automatic cycle updates.',
                price: '$799',
                type: 'washingMachine' as const,
              },
            ].map((product) => (
              <Card
                key={product.type}
                sx={{
                  height: '100%',
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #D9D9D9',
                  borderRadius: '16px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#022F49',
                    borderColor: '#022F49',
                    transform: 'translateY(-4px)',
                    '& .MuiTypography-root': { color: '#FFFFFF' },
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    component="img"
                    src={product.src}
                    alt={product.alt}
                    sx={{ width: '100%', height: '150px', objectFit: 'contain', borderRadius: '8px', mb: 2 }}
                  />
                  <Typography
                    variant="h5"
                    sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', fontWeight: 600, mb: 2, color: '#022F49' }}
                  >
                    {product.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#000000', lineHeight: 1.6, mb: 3 }}
                  >
                    {product.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontFamily: 'DM Sans, Arial, sans-serif', fontWeight: 700, color: '#022F49' }}
                    >
                      {product.price}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Button
                        variant="outlined"
                        onClick={() => decreaseCount(product.type)}
                        disabled={itemCounts[product.type] === 0}
                        sx={{
                          minWidth: '32px',
                          width: '32px',
                          height: '32px',
                          p: 0,
                          border: '2px solid #22B1FB',
                          color: itemCounts[product.type] === 0 ? '#CCCCCC' : '#22B1FB',
                          borderRadius: '8px',
                          '&:hover': {
                            backgroundColor: itemCounts[product.type] === 0 ? 'transparent' : '#22B1FB',
                            color: itemCounts[product.type] === 0 ? '#CCCCCC' : '#FFFFFF',
                          },
                        }}
                      >
                        -
                      </Button>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: 'DM Sans, Arial, sans-serif',
                          fontWeight: 600,
                          color: '#022F49',
                          minWidth: '20px',
                          textAlign: 'center',
                        }}
                      >
                        {itemCounts[product.type]}
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={() => increaseCount(product.type)}
                        sx={{
                          minWidth: '32px',
                          width: '32px',
                          height: '32px',
                          p: 0,
                          border: '2px solid #22B1FB',
                          color: '#22B1FB',
                          borderRadius: '8px',
                          '&:hover': { backgroundColor: '#22B1FB', color: '#FFFFFF' },
                        }}
                      >
                        +
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => addToCart(product.type)}
                        disabled={itemCounts[product.type] === 0}
                        sx={{
                          backgroundColor: '#22B1FB',
                          color: '#FFFFFF',
                          textTransform: 'none',
                          borderRadius: '10px',
                          '&:hover': { backgroundColor: '#022F49' },
                        }}
                      >
                        Add
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── About Us ── */}
      <Box id="about" sx={{ padding: '80px 0', backgroundColor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 8, alignItems: 'center' }}>
            <Box>
              <Typography
                variant="overline"
                sx={{
                  color: '#22B1FB',
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontWeight: 700,
                  letterSpacing: 2,
                  mb: 1,
                  display: 'block',
                }}
              >
                About Us
              </Typography>
              <Typography
                variant="h2"
                sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#022F49', mb: 3 }}
              >
                Your Trusted Home Service Partner
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  color: '#555555',
                  lineHeight: 2,
                  mb: 2,
                }}
              >
                Smart Appliances is a full-service home solutions company dedicated to keeping your appliances, HVAC
                systems, plumbing, and electrical running smoothly. Our team of certified technicians brings years of
                experience and a commitment to quality work every time.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  color: '#555555',
                  lineHeight: 2,
                  mb: 3,
                }}
              >
                Whether you need a routine maintenance visit or urgent emergency support, we respond quickly, diagnose
                accurately, and provide transparent pricing before any work begins. We serve homeowners across the region
                with same-day availability for emergency calls.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={() => openBooking('regular')}
                  sx={{
                    backgroundColor: '#22B1FB',
                    color: '#FFFFFF',
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    fontWeight: 700,
                    px: 3,
                    py: 1.25,
                    borderRadius: '10px',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#022F49' },
                  }}
                >
                  Book a Service
                </Button>
                <Button
                  variant="outlined"
                  href="#contact"
                  sx={{
                    borderColor: '#022F49',
                    color: '#022F49',
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    fontWeight: 600,
                    px: 3,
                    py: 1.25,
                    borderRadius: '10px',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#F5F7F9' },
                  }}
                >
                  Contact Us
                </Button>
              </Box>
            </Box>

            {/* Values grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              {[
                { icon: <SupportAgentIcon sx={{ fontSize: 28, color: '#22B1FB' }} />, title: '24/7 Emergency', desc: 'Round-the-clock support for urgent home service needs.' },
                { icon: <EngineeringIcon sx={{ fontSize: 28, color: '#22B1FB' }} />, title: 'Certified Techs', desc: 'All technicians are licensed, insured, and background-checked.' },
                { icon: <VerifiedIcon sx={{ fontSize: 28, color: '#22B1FB' }} />, title: 'Quality Guarantee', desc: 'We stand behind every repair with our service quality guarantee.' },
                { icon: <HomeRepairServiceIcon sx={{ fontSize: 28, color: '#22B1FB' }} />, title: 'Full Coverage', desc: 'Appliances, HVAC, plumbing, electrical — all in one call.' },
              ].map((val) => (
                <Box
                  key={val.title}
                  sx={{
                    backgroundColor: '#F5F7F9',
                    borderRadius: '16px',
                    p: 2.5,
                    border: '1px solid #E8E8E8',
                  }}
                >
                  <Box sx={{ mb: 1 }}>{val.icon}</Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#022F49', mb: 0.5 }}
                  >
                    {val.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: '#666666', fontFamily: 'DM Sans, Arial, sans-serif', lineHeight: 1.7, fontSize: '0.82rem' }}
                  >
                    {val.desc}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── Contact Us ── */}
      <Box id="contact" sx={{ padding: '80px 0', backgroundColor: '#F5F7F9' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Wasted Vindey, Arial, sans-serif',
              color: '#022F49',
              textAlign: 'center',
              mb: 1,
            }}
          >
            Contact Us
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#555555', textAlign: 'center', mb: 6 }}
          >
            Have a question or ready to book? Reach out — we respond quickly.
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 6 }}>
            {/* Contact info */}
            <Box>
              <Typography
                variant="h5"
                sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#022F49', mb: 3 }}
              >
                Get In Touch
              </Typography>
              {[
                { icon: <PhoneIcon sx={{ color: '#22B1FB', fontSize: 22 }} />, label: 'Phone', value: '+1 (555) 123-4567' },
                { icon: <EmailIcon sx={{ color: '#22B1FB', fontSize: 22 }} />, label: 'Email', value: 'service@smartappliances.com' },
                { icon: <LocationOnIcon sx={{ color: '#22B1FB', fontSize: 22 }} />, label: 'Address', value: '123 Main St, Anytown, USA 00000' },
              ].map((item) => (
                <Box key={item.label} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '10px',
                      backgroundColor: '#E8F4FD',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#022F49', fontWeight: 700 }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#555555', mt: 0.25 }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                </Box>
              ))}

              {/* Hours */}
              <Box
                sx={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E5E5E5',
                  p: 2.5,
                  mt: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <AccessTimeIcon sx={{ color: '#22B1FB', fontSize: 20 }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#022F49', fontWeight: 700 }}
                  >
                    Service Hours
                  </Typography>
                </Box>
                {[
                  { day: 'Monday – Friday', hours: '8:00 AM – 6:00 PM' },
                  { day: 'Saturday', hours: '9:00 AM – 4:00 PM' },
                  { day: 'Sunday', hours: 'Closed (Emergency Only)' },
                ].map((row) => (
                  <Box
                    key={row.day}
                    sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#555555', fontSize: '0.85rem' }}
                    >
                      {row.day}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#022F49', fontWeight: 600, fontSize: '0.85rem' }}
                    >
                      {row.hours}
                    </Typography>
                  </Box>
                ))}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5, pt: 1.5, borderTop: '1px solid #E5E5E5' }}>
                  <WarningAmberIcon sx={{ color: '#FF6B6B', fontSize: 16 }} />
                  <Typography
                    variant="caption"
                    sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#CC2200', fontWeight: 600 }}
                  >
                    Emergency service available 24/7 — call anytime
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Contact form */}
            <Box>
              <Typography
                variant="h5"
                sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#022F49', mb: 3 }}
              >
                Send Us a Message
              </Typography>
              {contactSent ? (
                <Box
                  sx={{
                    backgroundColor: '#E8F5E9',
                    border: '1px solid #A5D6A7',
                    borderRadius: '14px',
                    p: 4,
                    textAlign: 'center',
                  }}
                >
                  <CheckCircleOutlineIcon sx={{ color: '#2E7D32', fontSize: 48, mb: 2 }} />
                  <Typography
                    variant="h6"
                    sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#2E7D32', mb: 1 }}
                  >
                    Message Sent!
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#388E3C' }}
                  >
                    Thank you for reaching out. We will get back to you as soon as possible.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField
                    label="Your Name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    fullWidth
                    variant="outlined"
                    sx={{ backgroundColor: '#FFFFFF', borderRadius: '8px' }}
                  />
                  <TextField
                    label="Email Address"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    fullWidth
                    variant="outlined"
                    sx={{ backgroundColor: '#FFFFFF', borderRadius: '8px' }}
                  />
                  <TextField
                    label="Message"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    fullWidth
                    multiline
                    minRows={5}
                    variant="outlined"
                    sx={{ backgroundColor: '#FFFFFF', borderRadius: '8px' }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleContactSubmit}
                    disabled={!contactName || !contactEmail || !contactMessage}
                    sx={{
                      backgroundColor: '#22B1FB',
                      color: '#FFFFFF',
                      fontFamily: 'DM Sans, Arial, sans-serif',
                      fontWeight: 700,
                      py: 1.5,
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': { backgroundColor: '#022F49' },
                    }}
                  >
                    Send Message
                  </Button>
                  <Typography
                    variant="body2"
                    sx={{ color: '#888888', fontFamily: 'DM Sans, Arial, sans-serif', textAlign: 'center' }}
                  >
                    Or call us directly at{' '}
                    <Box
                      component="span"
                      sx={{ color: '#22B1FB', fontWeight: 700, cursor: 'pointer' }}
                    >
                      +1 (555) 123-4567
                    </Box>{' '}
                    — we are here to help.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── Footer ── */}
      <Box component="footer" sx={{ backgroundColor: '#022F49', color: '#FFFFFF', pt: 7, pb: 4 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 5,
              mb: 5,
            }}
          >
            {/* Brand column */}
            <Box>
              <Box
                component="img"
                src="/Logo.png"
                alt="Smart Appliances"
                sx={{ height: '48px', width: 'auto', objectFit: 'contain', mb: 2 }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  color: '#A8D8F0',
                  lineHeight: 1.9,
                  mb: 2.5,
                }}
              >
                Your trusted partner for appliance repair, HVAC, plumbing, electrical, and smart home services — with
                24/7 emergency support.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                {['FB', 'TW', 'YT', 'IG'].map((s) => (
                  <Box
                    key={s}
                    component="a"
                    href="#"
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#A8D8F0',
                      textDecoration: 'none',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      transition: 'all 0.2s',
                      '&:hover': { backgroundColor: '#22B1FB', color: '#FFFFFF' },
                    }}
                  >
                    {s}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Quick links */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#FFFFFF', mb: 2.5, fontWeight: 700 }}
              >
                Quick Links
              </Typography>
              {[
                { label: 'Home', href: '#home' },
                { label: 'About Us', href: '#about' },
                { label: 'Services', href: '#services' },
                { label: 'Buy Appliances', href: '#appliances' },
                { label: 'Repair Services', href: '#repair' },
                { label: 'Contact Us', href: '#contact' },
              ].map((link) => (
                <Box key={link.label} component="a" href={link.href} sx={footerLinkStyle}>
                  {link.label}
                </Box>
              ))}
            </Box>

            {/* Services */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#FFFFFF', mb: 2.5, fontWeight: 700 }}
              >
                Our Services
              </Typography>
              {[
                'Appliance Repair',
                'Appliance Installation',
                'HVAC Services',
                'Plumbing Services',
                'Electrical Services',
                'Smart Home Setup',
                'Home Maintenance',
              ].map((s) => (
                <Box key={s} component="span" sx={{ ...footerLinkStyle, display: 'block', cursor: 'default' }}>
                  {s}
                </Box>
              ))}
            </Box>

            {/* Contact */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontFamily: 'Wasted Vindey, Arial, sans-serif', color: '#FFFFFF', mb: 2.5, fontWeight: 700 }}
              >
                Contact
              </Typography>
              {[
                { icon: <PhoneIcon sx={{ fontSize: 16 }} />, text: '+1 (555) 123-4567' },
                { icon: <EmailIcon sx={{ fontSize: 16 }} />, text: 'service@smartappliances.com' },
                { icon: <LocationOnIcon sx={{ fontSize: 16 }} />, text: '123 Main St, Anytown, USA' },
                { icon: <AccessTimeIcon sx={{ fontSize: 16 }} />, text: 'Mon–Fri: 8AM–6PM' },
              ].map((item) => (
                <Box
                  key={item.text}
                  sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, mb: 1.75 }}
                >
                  <Box sx={{ color: '#22B1FB', mt: '2px', flexShrink: 0 }}>{item.icon}</Box>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#A8D8F0', fontSize: '0.85rem', lineHeight: 1.5 }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              ))}
              <Button
                variant="outlined"
                onClick={() => openBooking('emergency')}
                startIcon={<WarningAmberIcon sx={{ fontSize: 16 }} />}
                sx={{
                  borderColor: '#FF6B6B',
                  color: '#FF9999',
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  mt: 1,
                  '&:hover': { backgroundColor: 'rgba(255,107,107,0.1)', borderColor: '#FF9999' },
                }}
              >
                Emergency Service
              </Button>
            </Box>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'center', md: 'space-between' },
              flexWrap: 'wrap',
              gap: 2,
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#7FBBDD', fontSize: '0.82rem' }}
            >
              © {new Date().getFullYear()} Smart Appliances. All rights reserved.
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#7FBBDD', fontSize: '0.82rem' }}
            >
              Licensed &amp; Insured · Serving homeowners across the region
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

const footerLinkStyle = {
  display: 'block',
  fontFamily: 'DM Sans, Arial, sans-serif',
  color: '#A8D8F0',
  textDecoration: 'none',
  fontSize: '0.88rem',
  lineHeight: 1.5,
  mb: 1.25,
  cursor: 'pointer',
  transition: 'color 0.2s',
  '&:hover': { color: '#22B1FB' },
};

export default Home;
